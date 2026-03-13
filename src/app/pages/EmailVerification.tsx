import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Logo } from "../components/Logo";

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signin } = useAuth();

  const initialEmail =
    location.state?.email ||
    localStorage.getItem('volthub_verify_email') ||
    '';
  const initialDevCode =
    location.state?.devVerificationCode ||
    localStorage.getItem('volthub_dev_verification_code') ||
    '';

  const [email, setEmail] = useState(initialEmail);
  const [userId] = useState(location.state?.userId || '');
  const [devVerificationCode, setDevVerificationCode] = useState(initialDevCode);

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setVerificationCode(codeFromUrl);
      // If we don't have an email yet, keep it blank until resend.
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.verifyEmail(verificationCode);
      setSuccess('Email verified successfully!');
      
      // Store the session token
      if (response.session?.access_token) {
        localStorage.setItem('volthub_access_token', response.session.access_token);
      }

      // Clear stored verification info
      localStorage.removeItem('volthub_verify_email');
      localStorage.removeItem('volthub_dev_verification_code');

      // Redirect to portal after 2 seconds
      setTimeout(() => {
        navigate('/portal/');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email address is required');
      return;
    }
    
    setResendLoading(true);
    setError('');
    
    try {
      await api.resendVerificationEmail(email);
      setSuccess('Verification email resent! Check your inbox.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#0052FF] rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">We've sent a verification code to {email}</p>
        </div>

        {/* DEV MODE MESSAGE */}
        {devVerificationCode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 mb-2 font-semibold">🔧 DEVELOPMENT MODE</p>
            <p className="text-sm text-blue-900 mb-3">Your verification code:</p>
            <div className="bg-white p-3 rounded border border-blue-300 font-mono text-center text-lg font-bold text-blue-600 break-all">
              {devVerificationCode}
            </div>
            <p className="text-xs text-blue-600 mt-2">Copy and paste this code above to verify your email</p>
          </div>
        )}

        {/* Email Display */}
        {email && (
          <div className="mb-6 p-4 bg-[#F3F4F6] rounded-lg">
            <p className="text-sm text-[#9CA3AF]">Verification code sent to:</p>
            <p className="text-[#071022] font-medium break-all">{email}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <Label htmlFor="code" className="text-[#374151]">Verification Code</Label>
            <div className="relative mt-2 flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter the code from your email"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.trim())}
                  className="pl-10 h-11 border-[#D1D5DB] rounded-lg font-mono tracking-widest"
                  required
                  maxLength={64}
                />
              </div>
              {devVerificationCode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVerificationCode(devVerificationCode)}
                  className="h-11 px-4 text-sm"
                >
                  Use Code
                </Button>
              )}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-2">Look for a long verification code in your email</p>
          </div>

          <Button
            type="submit"
            disabled={loading || !verificationCode}
            className="w-full bg-[#0052FF] hover:bg-[#0042CC] text-white h-11"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        {/* Resend Link */}
        <div className="mt-6 text-center">
          <p className="text-[#9CA3AF] mb-3">Didn't receive the code?</p>
          <Button
            variant="ghost"
            disabled={resendLoading}
            onClick={handleResend}
            className="text-[#0052FF] hover:text-[#0042CC]"
          >
            {resendLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Verification Code'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
