import { useEffect, useState } from "react";
import { Search, Trash2, Mail, Calendar } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { api } from "../../lib/supabase";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('volthub_admin_token');
      if (!token) return;

      const { users: data } = await api.getAllUsers(token);
      setUsers(data.filter((u: any) => !u.isAdmin) || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    const token = localStorage.getItem('volthub_admin_token');
    if (!token) return;

    try {
      await api.deleteUser(token, id);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#9CA3AF]">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#071022]">Users Management</h1>
        <p className="text-[#9CA3AF] mt-1">Manage all registered users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-[#D1D5DB]">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-[#071022]">{users.length}</div>
            <p className="text-sm text-[#9CA3AF] mt-1">Total Users</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#D1D5DB]">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-[#071022]">
              {users.reduce((sum, u) => sum + (u.bookingsCount || 0), 0)}
            </div>
            <p className="text-sm text-[#9CA3AF] mt-1">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#D1D5DB]">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-[#071022]">
              {users.filter(u => u.bookingsCount > 0).length}
            </div>
            <p className="text-sm text-[#9CA3AF] mt-1">Active Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-white border-[#D1D5DB]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F3F4F6] border-b border-[#D1D5DB]">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#071022]">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#071022]">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#071022]">Company</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#071022]">Bookings</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#071022]">Joined</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-[#071022]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#D1D5DB] hover:bg-[#F3F4F6]">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0052FF] flex items-center justify-center text-white font-semibold">
                          {user.firstName?.[0] || user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-[#071022]">{user.name || 'Unknown'}</div>
                          <div className="text-sm text-[#9CA3AF]">{user.phone || 'No phone'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-[#374151]">
                        <Mail className="w-4 h-4 text-[#9CA3AF]" />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#374151]">
                      {user.company || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 bg-[#0052FF] text-white text-xs rounded-full font-medium">
                        {user.bookingsCount || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                        <Calendar className="w-4 h-4" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#9CA3AF]">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
