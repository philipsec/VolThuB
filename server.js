import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-this';

// Initialize AWS SES Client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || 'ses').toLowerCase();
const SENDER_EMAIL =
  process.env.EMAIL_SENDER ||
  process.env.AWS_SES_SENDER_EMAIL ||
  'noreply@volthub.com';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// Configure SMTP transport (optional, used when EMAIL_PROVIDER=smtp)
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    // Allow self-signed certificates in development environments if explicitly enabled.
    rejectUnauthorized: process.env.SMTP_ALLOW_INSECURE !== 'true',
  },
});

let etherealTransporter = null;
let etherealAccount = null;

const createEtherealTransporter = async () => {
  if (etherealTransporter) return etherealTransporter;

  etherealAccount = await nodemailer.createTestAccount();
  etherealTransporter = nodemailer.createTransport({
    host: etherealAccount.smtp.host,
    port: etherealAccount.smtp.port,
    secure: etherealAccount.smtp.secure,
    auth: {
      user: etherealAccount.user,
      pass: etherealAccount.pass,
    },
  });

  console.log(`\n📧 [DEV MODE] Using Ethereal SMTP account (preview emails at the URL shown after sending)`);
  console.log(`📧 Ethereal user: ${etherealAccount.user}`);
  console.log(`📧 Ethereal pass: ${etherealAccount.pass}\n`);

  return etherealTransporter;
};

// Email sending helper
const sendEmail = async (toEmail, subject, htmlContent, textContent) => {
  try {
    const hasAwsCredentials =
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_ACCESS_KEY_ID !== 'your_access_key_here' &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_SECRET_ACCESS_KEY !== 'your_secret_key_here';

    const hasSmtpConfig =
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    const enableEthereal =
      process.env.NODE_ENV !== 'production' &&
      ((EMAIL_PROVIDER === 'smtp' && !hasSmtpConfig) ||
        (EMAIL_PROVIDER === 'ses' && !hasAwsCredentials));

    if (EMAIL_PROVIDER === 'smtp') {
      if (!hasSmtpConfig) {
        console.error('SMTP is configured as email provider but SMTP credentials are missing or invalid.');
        throw new Error('SMTP configuration missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS.');
      }

      const transporter = smtpTransporter;

      try {
        const info = await transporter.sendMail({
          from: SENDER_EMAIL,
          to: toEmail,
          subject,
          html: htmlContent,
          text: textContent,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`✅ Email sent via ${hasSmtpConfig ? 'SMTP' : 'Ethereal'} to ${toEmail} - Message ID: ${info.messageId}`);
        if (previewUrl) {
          console.log(`🔗 Preview URL: ${previewUrl}`);
        }
        return info;
      } catch (error) {
        console.error(`❌ Failed to send email via SMTP:`, error.message);

        // In development, fall back to Ethereal if SMTP fails.
        if (process.env.NODE_ENV !== 'production') {
          console.log('🔁 Falling back to Ethereal email transport (development only)');
          const ethereal = await createEtherealTransporter();
          const info = await ethereal.sendMail({
            from: SENDER_EMAIL,
            to: toEmail,
            subject,
            html: htmlContent,
            text: textContent,
          });
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log(`✅ Email sent via Ethereal to ${toEmail} - Message ID: ${info.messageId}`);
          if (previewUrl) {
            console.log(`🔗 Preview URL: ${previewUrl}`);
          }
          return info;
        }

        throw error;
      }
    }

    if (EMAIL_PROVIDER === 'ses') {
      if (!hasAwsCredentials) {
        console.error('SES is configured as email provider but AWS credentials are missing or invalid.');
        throw new Error('SES configuration missing. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.');
      }

      const command = new SendEmailCommand({
        Source: SENDER_EMAIL,
        Destination: {
          ToAddresses: [toEmail],
        },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: htmlContent, Charset: 'UTF-8' },
            Text: { Data: textContent, Charset: 'UTF-8' },
          },
        },
      });

      const response = await sesClient.send(command);
      console.log(`✅ Email sent to ${toEmail} - Message ID: ${response.MessageId}`);
      return response;
    }

    if (!hasAwsCredentials && enableEthereal) {
      const transporter = await createEtherealTransporter();
      const info = await transporter.sendMail({
        from: SENDER_EMAIL,
        to: toEmail,
        subject,
        html: htmlContent,
        text: textContent,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`✅ Email sent via Ethereal to ${toEmail} - Message ID: ${info.messageId}`);
      if (previewUrl) {
        console.log(`🔗 Preview URL: ${previewUrl}`);
      }
      return info;
    }

    if (!hasAwsCredentials) {
      // Development mode: log to console instead of failing
      console.log(`\n📧 [DEV MODE] Email to: ${toEmail}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 Content: ${textContent.substring(0, 100)}...\n`);
      return { MessageId: 'dev-mode' };
    }

    const command = new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlContent,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textContent,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const response = await sesClient.send(command);
    console.log(`✅ Email sent to ${toEmail} - Message ID: ${response.MessageId}`);
    return response;
  } catch (error) {
    console.error(`❌ Failed to send email to ${toEmail}:`, error.message);
    throw error;
  }
};

// Email templates
const getVerificationEmailTemplate = (email, verificationCode) => {
  const verificationLink = `${APP_URL}/auth/verify-email?code=${verificationCode}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0052FF 0%, #003399 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to VoltHub</h1>
      </div>
      <div style="padding: 40px; background: #f9f9f9;">
        <h2 style="color: #071022;">Verify Your Email Address</h2>
        <p style="color: #9CA3AF; font-size: 16px;">Hi there! We're excited to have you join VoltHub. Please verify your email address to complete your signup.</p>
        
        <div style="background: white; border: 2px solid #D1D5DB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Your verification code:</p>
          <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #0052FF; letter-spacing: 2px; margin: 0;">
            ${verificationCode}
          </p>
        </div>

        <p style="color: #9CA3AF; font-size: 14px;">Or click the button below to verify:</p>
        <a href="${verificationLink}" style="display: inline-block; background: #0052FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>

        <p style="color: #9CA3AF; font-size: 12px; margin-top: 30px; border-top: 1px solid #D1D5DB; padding-top: 20px;">
          This verification code expires in 24 hours. If you didn't create this account, please ignore this email.
        </p>
      </div>
      <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #9CA3AF; font-size: 12px;">
        <p style="margin: 0;">© 2026 VoltHub. All rights reserved.</p>
      </div>
    </div>
  `;

  const text = `
Welcome to VoltHub

Verify Your Email Address

Your verification code: ${verificationCode}

Or visit this link to verify: ${verificationLink}

Your code expires in 24 hours.

© 2026 VoltHub
  `;

  return { html, text };
};

const getPasswordResetEmailTemplate = (resetCode) => {
  const resetLink = `${APP_URL}/auth/reset-password?code=${resetCode}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0052FF 0%, #003399 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0;">VoltHub Password Reset</h1>
      </div>
      <div style="padding: 40px; background: #f9f9f9;">
        <h2 style="color: #071022;">Reset Your Password</h2>
        <p style="color: #9CA3AF; font-size: 16px;">We received a request to reset your password. Use the code below to create a new password:</p>
        
        <div style="background: white; border: 2px solid #D1D5DB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Your reset code:</p>
          <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #0052FF; letter-spacing: 2px; margin: 0;">
            ${resetCode}
          </p>
        </div>

        <p style="color: #9CA3AF; font-size: 14px;">Or click the button below to reset:</p>
        <a href="${resetLink}" style="display: inline-block; background: #0052FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>

        <p style="color: #9CA3AF; font-size: 12px; margin-top: 30px; border-top: 1px solid #D1D5DB; padding-top: 20px;">
          This reset code expires in 1 hour. If you didn't request a password reset, please ignore this email and your account remains secure.
        </p>
      </div>
      <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #9CA3AF; font-size: 12px;">
        <p style="margin: 0;">© 2026 VoltHub. All rights reserved.</p>
      </div>
    </div>
  `;

  const text = `
VoltHub Password Reset

Reset Your Password

Your reset code: ${resetCode}

Or visit this link to reset: ${resetLink}

Your code expires in 1 hour.

© 2026 VoltHub
  `;

  return { html, text };
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files
app.use('/api/uploads', express.static(uploadsDir));

// Data storage (in-memory for development, persisted to disk)
let users = [];
let workspaces = [];
let bookings = [];
let admins = [];
let verificationTokens = []; // Email verification tokens
let passwordResetTokens = []; // Password reset tokens

// Persist data to disk (simple JSON file for development)
const DATA_FILE = path.join(__dirname, 'data.json');

const loadDataFromDisk = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return;
  }

  try {
    const payload = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    users = payload.users || [];
    workspaces = payload.workspaces || [];
    bookings = payload.bookings || [];
    admins = payload.admins || [];
    verificationTokens = payload.verificationTokens || [];
    passwordResetTokens = payload.passwordResetTokens || [];
    console.log(`✅ Loaded ${users.length} users and ${workspaces.length} workspaces from ${DATA_FILE}`);
  } catch (error) {
    console.warn('⚠️ Failed to load data from disk:', error.message);
  }
};

const persistDataToDisk = () => {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({
        users,
        workspaces,
        bookings,
        admins,
        verificationTokens,
        passwordResetTokens,
      }, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.warn('⚠️ Failed to persist data:', error.message);
  }
};

// Load initial data and persist on changes
loadDataFromDisk();

// Load default workspace list if none exists yet
const loadInitialData = () => {
  if (workspaces.length > 0) return;

  // Sample workspaces
  workspaces = [
    {
      id: '1',
      name: 'Tech Hub Downtown',
      location: 'San Francisco, CA',
      description: 'Modern coworking space with high-speed internet and meeting rooms',
      type: 'coworking',
      capacity: 50,
      availability: 'available',
      price: 25,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
      amenities: 'WiFi, Coffee, Meeting Rooms, Parking',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Creative Studio',
      location: 'New York, NY',
      description: 'Design-focused workspace with creative tools',
      type: 'studio',
      capacity: 30,
      availability: 'available',
      price: 35,
      image: 'https://images.unsplash.com/photo-1559027615-cd61628902d4?w=500',
      amenities: 'Desks, Design Software, Monitors, Kitchen',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Startup Incubator',
      location: 'Austin, TX',
      description: 'Support for early-stage startups',
      type: 'incubator',
      capacity: 20,
      availability: 'available',
      price: 15,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
      amenities: 'Mentorship, Networking, Demo Day',
      createdAt: new Date().toISOString(),
    },
  ];
  persistDataToDisk();
};

loadInitialData();

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  return authHeader.split(' ')[1];
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// ============ AUTHENTICATION ROUTES ============

// Helper to normalize tokens (case-insensitive support)
const normalizeToken = (token) => {
  return token?.toString().trim().toUpperCase();
};

// Helper to generate verification token (numeric, 6-8 digits)
const generateVerificationToken = () => {
  const length = Math.floor(Math.random() * 3) + 6; // 6-8 digits
  const max = 10 ** length;
  const code = Math.floor(Math.random() * max).toString().padStart(length, '0');
  return code;
};

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const normalizedEmail = email?.toString().trim().toLowerCase();
    const trimmedPassword = password?.toString().trim();

    // Basic validation
    if (!normalizedEmail || !trimmedPassword || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    if (users.find(u => u.email === normalizedEmail)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
      id: generateId(),
      email: normalizedEmail,
      password: trimmedPassword, // In production, hash this!
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone: '',
      company: '',
      bio: '',
      profilePicUrl: '',
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    persistDataToDisk();

    // Generate verification token
    const verificationToken = generateVerificationToken();
    verificationTokens.push({
      token: verificationToken,
      userId: newUser.id,
      email: newUser.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date().toISOString(),
    });
    persistDataToDisk();

    // Send verification email
    const { html: emailHtml, text: emailText } = getVerificationEmailTemplate(email, verificationToken);
    await sendEmail(
      email,
      'Verify your VoltHub email address',
      emailHtml,
      emailText
    );

    const hasSmtpConfig =
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    const response = {
      message: 'Account created. Please verify your email.',
      user: { ...newUser, password: undefined },
      verificationRequired: true,
    };

    // Include verification code in development mode for easier testing
    // Only when using Ethereal (dev email service) or when no email provider is configured
    if (process.env.NODE_ENV !== 'production' && EMAIL_PROVIDER === 'smtp' && !hasSmtpConfig) {
      response.devVerificationCode = verificationToken;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to sign up' });
  }
});

// Sign in
app.post('/api/auth/signin', (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toString().trim().toLowerCase();
    const trimmedPassword = password?.toString().trim();

    const user = users.find(u => u.email === normalizedEmail);

    if (!user || user.password !== trimmedPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email address first',
        verificationRequired: true,
        userId: user.id,
        email: user.email,
      });
    }

    const token = generateToken(user.id);
    res.json({
      user: { ...user, password: undefined },
      session: { access_token: token },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to sign in' });
  }
});

// Verify email
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { token } = req.body;
    const normalized = normalizeToken(token);

    if (!normalized) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const verifToken = verificationTokens.find(t => normalizeToken(t.token) === normalized);

    if (!verifToken) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    if (new Date() > verifToken.expiresAt) {
      // Remove expired token
      verificationTokens = verificationTokens.filter(t => t.token !== token);
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Update user as verified
    const user = users.find(u => u.id === verifToken.userId);
    if (user) {
      user.emailVerified = true;
    }
    persistDataToDisk();

    // Remove used token
    verificationTokens = verificationTokens.filter(t => t.token !== token);
    persistDataToDisk();

    // Generate session token
    const sessionToken = generateToken(verifToken.userId);
    res.json({
      message: 'Email verified successfully',
      user: { ...user, password: undefined },
      session: { access_token: sessionToken },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to verify email' });
  }
});

// Resend verification email
app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Remove old tokens
    verificationTokens = verificationTokens.filter(t => t.email !== email);

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    verificationTokens.push({
      token: verificationToken,
      userId: user.id,
      email: user.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date().toISOString(),
    });

    persistDataToDisk();

    // Send verification email
    const { html: emailHtml, text: emailText } = getVerificationEmailTemplate(email, verificationToken);
    await sendEmail(
      email,
      'Verify your VoltHub email address',
      emailHtml,
      emailText
    );

    res.json({
      message: 'Verification email resent'
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to resend verification' });
  }
});

// Get session
app.get('/api/auth/session', (req, res) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.json({ session: null, user: null });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.json({ session: null, user: null });
    }

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.json({ session: null, user: null });
    }

    res.json({
      user: { ...user, password: undefined },
      session: { access_token: token },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test email sending endpoint (manual test)
app.post('/api/email/test', async (req, res) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const resetCode = generateVerificationToken();
    const { html: emailHtml, text: emailText } = getPasswordResetEmailTemplate(resetCode);

    await sendEmail(
      to,
      'VoltHub email test - reset code included',
      emailHtml,
      emailText
    );

    return res.json({
      message: 'Test email sent',
      resetCode,
    });
  } catch (error) {
    console.error('Email test failed:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Password reset request
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'Password reset email sent if account exists' });
    }

    // Remove old reset tokens for this user
    passwordResetTokens = passwordResetTokens.filter(t => t.userId !== user.id);

    // Generate password reset token
    const resetToken = generateVerificationToken();
    passwordResetTokens.push({
      token: resetToken,
      userId: user.id,
      email: user.email,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      createdAt: new Date().toISOString(),
    });

    persistDataToDisk();

    // Send password reset email
    const { html: emailHtml, text: emailText } = getPasswordResetEmailTemplate(resetToken);
    await sendEmail(
      email,
      'Reset your VoltHub password',
      emailHtml,
      emailText
    );

    res.json({
      message: 'Password reset email sent',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify reset token and change password
app.post('/api/auth/reset-password-confirm', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const normalized = normalizeToken(token);

    if (!normalized || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    const resetToken = passwordResetTokens.find(t => normalizeToken(t.token) === normalized);

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (new Date() > resetToken.expiresAt) {
      // Remove expired token
      passwordResetTokens = passwordResetTokens.filter(t => normalizeToken(t.token) !== normalized);
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Update user password
    const user = users.find(u => u.id === resetToken.userId);
    if (user) {
      user.password = newPassword;
    }

    // Remove used token
    passwordResetTokens = passwordResetTokens.filter(t => t.token !== token);

    persistDataToDisk();

    res.json({
      message: 'Password reset successful. Please sign in with your new password.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign out
app.post('/api/auth/signout', (req, res) => {
  try {
    // In stateless JWT, logout is handled on client (token removal)
    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password for authenticated user
app.post('/api/auth/change-password', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const userIndex = users.findIndex(u => u.id === decoded.userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];

    // Verify current password
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    users[userIndex].password = newPassword;

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ WORKSPACE ROUTES ============

// Get all workspaces
app.get('/api/workspaces', (req, res) => {
  try {
    const { type, availability, search, minPrice, maxPrice } = req.query;

    let filtered = workspaces.filter(w => w.createdBy);

    if (type && type !== 'all') {
      filtered = filtered.filter(w => w.type === type);
    }

    if (availability && availability !== 'all') {
      filtered = filtered.filter(w => w.availability === availability);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        w =>
          w.name.toLowerCase().includes(searchLower) ||
          w.description.toLowerCase().includes(searchLower) ||
          w.location.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      filtered = filtered.filter(w => w.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(w => w.price <= parseFloat(maxPrice));
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workspace by ID
app.get('/api/workspaces/:id', (req, res) => {
  try {
    const workspace = workspaces.find(w => w.id === req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ BOOKING ROUTES (Protected) ============

// Create booking
app.post('/api/bookings', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { workspaceId, startDate, endDate } = req.body;
    const workspace = workspaces.find(w => w.id === workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const newBooking = {
      id: generateId(),
      userId: decoded.userId,
      workspaceId,
      workspaceName: workspace.name,
      startDate,
      endDate,
      status: 'confirmed',
      totalPrice: workspace.price * 8, // Example: 8 hours
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    persistDataToDisk();
    res.json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user bookings
app.get('/api/bookings', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userBookings = bookings.filter(b => b.userId === decoded.userId);
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== decoded.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookingIndex = bookings.findIndex(b => b.id === req.params.id);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (bookings[bookingIndex].userId !== decoded.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Mark booking as cancelled instead of deleting so user history remains.
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].cancelledAt = new Date().toISOString();

    persistDataToDisk();

    res.json(bookings[bookingIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PROFILE ROUTES (Protected) ============

// Get user profile
app.get('/api/profile', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ ...user, password: undefined });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/profile', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userIndex = users.findIndex(u => u.id === decoded.userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { firstName, lastName, phone, company, bio } = req.body;
    users[userIndex] = {
      ...users[userIndex],
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone !== undefined ? { phone } : {}),
      ...(company !== undefined ? { company } : {}),
      ...(bio !== undefined ? { bio } : {}),
      name: `${firstName || users[userIndex].firstName} ${lastName || users[userIndex].lastName}`,
    };

    persistDataToDisk();

    res.json({ ...users[userIndex], password: undefined });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile upload avatar
app.post('/api/profile/avatar', upload.single('avatar'), (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/api/uploads/${req.file.filename}`;

    users[userIndex] = {
      ...users[userIndex],
      profilePicUrl: imageUrl,
    };

    persistDataToDisk();

    res.json({ profilePicUrl: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ADMIN ROUTES ============

// Admin login
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toString().trim().toLowerCase();
    const trimmedPassword = password?.toString().trim();

    const admin = admins.find(a => a.email.toLowerCase() === normalizedEmail);

    if (!admin || admin.password !== trimmedPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = generateToken(admin.id);
    res.json({
      admin: { ...admin, password: undefined },
      session: { access_token: token },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create admin (first time setup)
app.post('/api/admin/create-admin', (req, res) => {
  try {
    const { email, password, firstName, lastName, secretKey } = req.body;

    if (secretKey !== 'volthub-admin-2024') {
      return res.status(401).json({ error: 'Invalid secret key' });
    }

    if (admins.find(a => a.email === email)) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const newAdmin = {
      id: generateId(),
      email,
      password,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      createdAt: new Date().toISOString(),
    };

    admins.push(newAdmin);

    const token = generateToken(newAdmin.id);
    res.json({
      admin: { ...newAdmin, password: undefined },
      session: { access_token: token },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin dashboard stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const monthlyRevenue = bookings
      .filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    res.json({
      totalWorkspaces: workspaces.length,
      totalUsers: users.length,
      totalBookings: bookings.length,
      totalRevenue,
      monthlyRevenue,
      recentBookings: bookings.slice(-5),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin)
app.get('/api/admin/users', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const usersWithBookingCount = users.map(user => ({
      ...user,
      password: undefined,
      bookingCount: bookings.filter(b => b.userId === user.id).length,
    }));

    res.json(usersWithBookingCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (admin)
app.get('/api/admin/bookings', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create workspace (admin)
app.post('/api/admin/workspaces', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, location, description, type, capacity, price, image, amenities, availability } = req.body;

    const newWorkspace = {
      id: generateId(),
      name,
      location,
      description,
      type,
      capacity,
      price,
      image,
      amenities,
      availability: availability || 'available',
      createdBy: decoded.userId,
      createdAt: new Date().toISOString(),
    };

    workspaces.push(newWorkspace);
    persistDataToDisk();
    res.json(newWorkspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update workspace (admin)
app.put('/api/admin/workspaces/:id', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const workspaceIndex = workspaces.findIndex(w => w.id === req.params.id);

    if (workspaceIndex === -1) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    workspaces[workspaceIndex] = {
      ...workspaces[workspaceIndex],
      ...req.body,
    };

    persistDataToDisk();
    res.json(workspaces[workspaceIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete workspace (admin)
app.delete('/api/admin/workspaces/:id', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const workspaceIndex = workspaces.findIndex(w => w.id === req.params.id);

    if (workspaceIndex === -1) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const deleted = workspaces.splice(workspaceIndex, 1);
    persistDataToDisk();
    res.json(deleted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (admin)
app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deleted = users.splice(userIndex, 1);

    // Also delete user's bookings
    bookings = bookings.filter(b => b.userId !== req.params.id);

    res.json(deleted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin)
app.put('/api/admin/bookings/:id', (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookingIndex = bookings.findIndex(b => b.id === req.params.id);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { status } = req.body;
    bookings[bookingIndex].status = status;

    res.json(bookings[bookingIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Dev endpoint to list users (for debugging only)
app.get('/api/dev/users', (req, res) => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  res.json({
    users: users.map(u => ({ ...u, password: '[REDACTED]' })),
    verificationTokens: verificationTokens,
    passwordResetTokens: passwordResetTokens,
  });
});

// ============ FILE UPLOAD ROUTES ============

// Upload image (single file)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const imageUrl = `/api/uploads/${req.file.filename}`;
    res.json({ 
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Upload multiple images
app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const urls = req.files.map(file => ({
      url: `/api/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    }));

    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Node.js API Server running at http://localhost:${PORT}`);
  console.log(`📝 Using in-memory data storage (resets on server restart)`);
  console.log(`✉️  Email provider: ${EMAIL_PROVIDER.toUpperCase()}`);
  console.log(`✉️  Email sender: ${SENDER_EMAIL}`);

  if (EMAIL_PROVIDER === 'smtp') {
    console.log(`✉️  SMTP host: ${process.env.SMTP_HOST || '(missing)'}`);
  }

  if (EMAIL_PROVIDER === 'ses') {
    console.log(`✉️  SES region: ${process.env.AWS_REGION || '(default us-east-1)'}
`);
  }
});
