import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Mail, ArrowLeft, Loader2, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { api } from "../lib/api";

export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<"request" | "verification" | "reset" | "success">("request");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem('volthub_password_reset_email') || '');
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setResetCode(codeFromUrl);
      setStep('verification');
    }
  }, [searchParams]);

  // Step 1: Request password reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await api.requestPasswordReset(email);
      // Keep email around so the user can continue the flow via email link
      localStorage.setItem('volthub_password_reset_email', email);
      setStep("verification");
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (error: any) {
      setError(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code and set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await api.resetPasswordWithToken(resetCode, newPassword);
      // Clear persisted email after success
      localStorage.removeItem('volthub_password_reset_email');
      setStep("success");
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setError("");
    
    try {
      await api.requestPasswordReset(email);
    } catch (error: any) {
      setError(error.message || "Failed to resend email");
    }
    
    setTimeout(() => setResendDisabled(false), 60000);
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

        {step === "request" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#071022] mb-2">Reset Password</h1>
              <p className="text-[#9CA3AF]">Enter your email to receive a reset code</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-[#374151]">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-[#D1D5DB] rounded-lg"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0052FF] hover:bg-[#0042CC] text-white rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>

              <Link to="/auth/login">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </form>
          </>
        )}

        {step === "verification" && (
          <>
            {/* Verification */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#071022] mb-2">Enter Reset Code</h1>
              <p className="text-[#9CA3AF]">
                Check your email for the reset code
              </p>
            </div>

            {/* Email Display */}
            <div className="mb-6 p-4 bg-[#F3F4F6] rounded-lg">
              <p className="text-sm text-[#9CA3AF]">Reset code sent to:</p>
              <p className="text-[#071022] font-medium break-all">{email}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={() => {
              setStep("reset");
              setError("");
            }} className="space-y-6">
              <div>
                <Label htmlFor="code" className="text-[#374151]">Reset Code</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter the code from your email"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.trim())}
                    className="pl-10 h-11 border-[#D1D5DB] rounded-lg font-mono"
                    required
                  />
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2">Look for a long code in your email</p>
              </div>

              <Button
                type="submit"
                disabled={!resetCode}
                className="w-full h-11 bg-[#0052FF] hover:bg-[#0042CC] text-white rounded-lg transition-colors"
              >
                Continue
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#9CA3AF] mb-3 text-sm">Didn't receive the code?</p>
              <Button
                variant="ghost"
                disabled={resendDisabled}
                onClick={handleResend}
                className="text-[#0052FF] hover:text-[#0042CC]"
              >
                {resendDisabled ? "Resend in 60s" : "Resend Code"}
              </Button>
            </div>
          </>
        )}

        {step === "reset" && (
          <>
            {/* New Password Form */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#071022] mb-2">Create New Password</h1>
              <p className="text-[#9CA3AF]">Enter your new password</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <Label htmlFor="newPassword" className="text-[#374151]">New Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 h-11 border-[#D1D5DB] rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-[#374151]">Confirm Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 border-[#D1D5DB] rounded-lg"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full h-11 bg-[#0052FF] hover:bg-[#0042CC] text-white rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            {/* Success */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#071022] mb-2">Password Reset</h1>
              <p className="text-[#9CA3AF]">Your password has been reset successfully</p>
            </div>

            <Link to="/auth/login" className="block">
              <Button className="w-full h-11 bg-[#0052FF] hover:bg-[#0042CC] text-white rounded-lg transition-colors">
                Back to Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}