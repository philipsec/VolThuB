import { useState, useEffect } from "react";
import { User, Lock, Shield, Bell, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { api } from "../lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { useAuth } from "../contexts/AuthContext";

export default function UserProfile() {
  const { user, session, updateProfile, uploadProfileAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    bio: "",
    profilePicUrl: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    bookingConfirmations: true,
    promotions: false,
    reminders: true,
  });

  useEffect(() => {
    if (user?.emailVerified !== undefined) {
      setEmailVerified(user.emailVerified);
    }

    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        bio: user.bio || "",
        profilePicUrl: user.profilePicUrl || "",
      });
      setAvatarPreview(user.profilePicUrl || "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        company: profileData.company,
        bio: profileData.bio,
      });
      setProfileMessage('Profile updated successfully!');
    } catch (error: any) {
      console.error(error);
      setProfileMessage(error?.message || 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!profileData.email) {
      setProfileMessage('Email address missing.');
      return;
    }

    setResendLoading(true);
    try {
      await api.resendVerificationEmail(profileData.email);
      setProfileMessage('Verification email sent again. Check your inbox.');
    } catch (error: any) {
      console.error(error);
      setProfileMessage(error?.message || 'Could not resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Password updated successfully!");
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      await uploadProfileAvatar(file);
      alert("Profile picture updated successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Could not upload profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    alert(twoFactorEnabled ? "2FA disabled" : "2FA enabled successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-[#071022]">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#071022] mb-2">Profile Settings</h1>
        <p className="text-lg text-[#4B5563]">Manage your account settings and preferences</p>
        {profileMessage && (
          <div className="mt-4 p-3 rounded-lg bg-[#EEF2FF] text-[#1D4ED8] font-medium">
            {profileMessage}
          </div>
        )}
      </div>

      {/* Profile Picture and Basic Info */}
      <Card className="bg-white border-[#D1D5DB]">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-[#0052FF] to-[#00D4FF] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.firstName?.charAt(0) || "U"}{profileData.lastName?.charAt(0) || ""}
                </div>
              )}

              <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-[#D1D5DB] cursor-pointer hover:bg-[#F3F4F6]">
                <svg
                  className="w-4 h-4 text-[#0052FF]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" d="M4 3a1 1 0 011-1h10a1 1 0 011 1v4h-2V4H6v12h8v-3h2v4a1 1 0 01-1 1H5a1 1 0 01-1-1V3z" clipRule="evenodd" />
                  <path d="M9 7a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#071022]">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-[#374151] font-medium">{profileData.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${
                    emailVerified ? 'bg-[#10B981] text-white' : 'bg-[#F59E0B] text-white'
                  }`}
                >
                  {emailVerified ? 'Email Verified' : 'Email Not Verified'}
                </span>
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="ml-2 px-3 py-1 text-xs rounded-lg border border-[#0052FF] text-[#0052FF] hover:bg-[#0052FF] hover:text-white transition-colors"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Verification'}
                  </button>
                )}
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-[#0052FF] text-white text-xs rounded-full">
                Premium Member
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#F3F4F6] p-1 rounded-lg grid grid-cols-4 w-full">
          <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            <User className="w-4 h-4 mr-2" />
            General Info
          </TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            <Lock className="w-4 h-4 mr-2" />
            Password
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-[#0052FF]">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="mt-8">
          <Card className="bg-white border-[#D1D5DB]">
            <CardHeader>
              <CardTitle className="text-xl text-[#071022]">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-[#374151]">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="mt-2 h-11 border-[#D1D5DB] rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-[#374151]">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="mt-2 h-11 border-[#D1D5DB] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#374151]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="mt-2 h-11 border-[#D1D5DB] rounded-lg bg-[#F3F4F6]"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-[#374151]">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="mt-2 h-11 border-[#D1D5DB] rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-[#374151]">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="mt-2 h-11 border-[#D1D5DB] rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-[#374151]">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="mt-2 min-h-[100px] border-[#D1D5DB] rounded-lg"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0052FF] hover:bg-[#0042CC] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password" className="mt-8">
          <Card className="bg-white border-[#D1D5DB]">
            <CardHeader>
              <CardTitle className="text-xl text-[#071022]">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword" className="text-[#374151]">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="mt-2 h-11 border-[#D1D5DB] rounded-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-[#374151]">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-2 h-11 border-[#D1D5DB] rounded-lg"
                    required
                  />
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-[#374151]">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-2 h-11 border-[#D1D5DB] rounded-lg"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0052FF] hover:bg-[#0042CC] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-8">
          <Card className="bg-white border-[#D1D5DB]">
            <CardHeader>
              <CardTitle className="text-xl text-[#071022]">Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F3F4F6] rounded-lg">
                <div>
                  <div className="font-semibold text-[#071022] mb-1">Two-Factor Authentication</div>
                  <p className="text-sm text-[#9CA3AF]">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleEnable2FA}
                />
              </div>

              {twoFactorEnabled && (
                <div className="p-4 border border-[#D1D5DB] rounded-lg">
                  <h4 className="font-semibold text-[#071022] mb-3">Authenticator App</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-32 h-32 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                      <div className="text-xs text-center text-[#9CA3AF]">QR Code<br/>Placeholder</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#9CA3AF] mb-2">
                        Scan this QR code with your authenticator app
                      </p>
                      <code className="text-xs bg-[#F3F4F6] px-2 py-1 rounded">
                        ABCD-EFGH-IJKL-MNOP
                      </code>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[#0052FF] text-[#0052FF]">
                    View Backup Codes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-8">
          <Card className="bg-white border-[#D1D5DB]">
            <CardHeader>
              <CardTitle className="text-xl text-[#071022]">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F3F4F6] rounded-lg">
                <div>
                  <div className="font-semibold text-[#071022] mb-1">Booking Confirmations</div>
                  <p className="text-sm text-[#9CA3AF]">Receive notifications when bookings are confirmed</p>
                </div>
                <Switch
                  checked={notifications.bookingConfirmations}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, bookingConfirmations: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F3F4F6] rounded-lg">
                <div>
                  <div className="font-semibold text-[#071022] mb-1">Promotional Emails</div>
                  <p className="text-sm text-[#9CA3AF]">Receive updates about new workspaces and offers</p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F3F4F6] rounded-lg">
                <div>
                  <div className="font-semibold text-[#071022] mb-1">Booking Reminders</div>
                  <p className="text-sm text-[#9CA3AF]">Get reminded 24 hours before your booking</p>
                </div>
                <Switch
                  checked={notifications.reminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account */}
      <Card className="bg-white border-[#EF4444]">
        <CardHeader>
          <CardTitle className="text-xl text-[#EF4444] flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#9CA3AF] mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" className="bg-[#EF4444] hover:bg-[#DC2626]">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
