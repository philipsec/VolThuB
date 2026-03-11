import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";

export default function PasswordReset() {
  const { resetPassword } = useAuth();
  const [step, setStep] = useState<"request" | "confirmation">("request");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await resetPassword(email);
      setStep("confirmation");
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 60000); // Enable after 60 seconds
    } catch (error: any) {
      setError(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setError("");
    
    try {
      await resetPassword(email);
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

        {step === "request" ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#071022] mb-2">Reset Password</h1>
              <p className="text-[#9CA3AF]">Enter your email to receive a reset link</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  "Send Reset Link"
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
        ) : (
          <>
            {/* Confirmation */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#071022] mb-2">Check Your Email</h1>
              <p className="text-[#9CA3AF]">
                We sent a password reset link to <br />
                <span className="font-medium text-[#374151]">{email}</span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-center text-[#9CA3AF]">
                Didn't receive the email?
              </p>

              <Button
                onClick={handleResend}
                disabled={resendDisabled}
                variant="outline"
                className="w-full h-11 border-2 border-[#0052FF] text-[#0052FF] hover:bg-[#F3F4F6] rounded-lg transition-colors disabled:opacity-50"
              >
                {resendDisabled ? "Resend in 60s" : "Resend Email"}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}