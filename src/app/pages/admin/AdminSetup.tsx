import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { api } from "../../lib/supabase";

export default function AdminSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await api.createAdmin(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.secretKey
      );

      setStep("success");
    } catch (error: any) {
      setError(error.message || "Failed to create admin account");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071022] to-[#071a2a] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#071022] mb-3">Admin Account Created!</h2>
            <p className="text-[#9CA3AF] mb-8">
              Your administrator account has been successfully created. You can now log in to the admin portal.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/admin/login")}
                className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white"
              >
                <Shield className="w-5 h-5 mr-2" />
                Go to Admin Login
              </Button>
              <p className="text-sm text-[#9CA3AF]">
                Email: {formData.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071022] to-[#071a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-[#EF4444] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#071022]">
              Create Admin Account
            </CardTitle>
            <p className="text-[#9CA3AF] mt-2">
              Set up your administrator account to manage VoltHub
            </p>
          </CardHeader>
          <CardContent className="p-8">
            {/* Info Box */}
            <div className="mb-6 p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-sm text-[#92400E]">
                <strong>Secret Key Required:</strong> You need the admin secret key to create an admin account. 
                The default key is <code className="px-2 py-1 bg-white rounded">volthub-admin-2024</code>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@volthub.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="secretKey">Admin Secret Key</Label>
                <Input
                  id="secretKey"
                  type="password"
                  placeholder="Enter the admin secret key"
                  value={formData.secretKey}
                  onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                  required
                />
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Contact your system administrator for the secret key
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white h-12 text-base"
              >
                {loading ? (
                  <>Creating Admin Account...</>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Create Admin Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#9CA3AF]">
                Already have an admin account?{" "}
                <button
                  onClick={() => navigate("/admin/login")}
                  className="text-[#EF4444] hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
