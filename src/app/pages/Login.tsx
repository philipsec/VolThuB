import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname || "/portal/";
  const { signin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signin(formData.email, formData.password);
      navigate(fromPath);
    } catch (error: any) {
      // Check if verification is required
      if (error.message && error.message.includes('verify your email')) {
        navigate("/auth/verify-email", {
          state: {
            email: formData.email,
          }
        });
      } else {
        setError(error.message || "Failed to sign in");
      }
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-[#071022] mb-2">Welcome Back</h1>
          <p className="text-[#9CA3AF]">Sign in to book your perfect workspace</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 h-11 border-[#D1D5DB] rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#374151]">Password</Label>
              <Link
                to="/auth/reset-password"
                className="text-sm text-[#0052FF] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 h-11 border-[#D1D5DB] rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#0052FF] hover:bg-[#0042CC] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF]"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D1D5DB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#9CA3AF]">OR</span>
            </div>
          </div>

          <Link to="/auth/signup">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-2 border-[#0052FF] text-[#0052FF] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              Create Account
            </Button>
          </Link>
        </form>
      </div>

      <p className="text-center mt-6 text-xs text-[#071022] dark:text-[#E5E7EB] font-medium">
        By continuing, you agree to VoltHub's{" "}
        <a href="/terms" className="text-[#0052FF] dark:text-[#0052FF] hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-0.5">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy" className="text-[#0052FF] dark:text-[#0052FF] hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-0.5">Privacy Policy</a>
      </p>
    </div>
  );
}