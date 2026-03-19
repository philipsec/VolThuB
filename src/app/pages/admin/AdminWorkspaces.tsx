import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import ImageUpload from "../../components/ImageUpload";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useDataInit } from "../../hooks/useDataInit";

export default function AdminWorkspaces() {
  const { initialized } = useDataInit();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    capacity: 0,
    pricePerHour: 0,
    image: "",
    images: "",
    amenities: "",
    type: "open",
    availability: "available",
  });

  useEffect(() => {
    if (initialized) {
      loadWorkspaces();
    }
  }, [initialized]);

  const loadWorkspaces = async () => {
    try {
      const data = await api.getWorkspaces();
      setWorkspaces(Array.isArray(data) ? data : data.workspaces || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('volthub_admin_token');
    if (!token) return;

    try {
      const workspaceData = {
        ...formData,
        capacity: Number(formData.capacity),
        pricePerHour: Number(formData.pricePerHour),
        images: formData.images.split(',').map(s => s.trim()).filter(s => s),
        amenities: formData.amenities.split(',').map(s => s.trim()).filter(s => s),
      };

      if (editingWorkspace) {
        await api.updateWorkspace(token, editingWorkspace.id, workspaceData);
        toast.success('Workspace updated successfully');
      } else {
        await api.createWorkspace(token, workspaceData);
        toast.success('Workspace created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadWorkspaces();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save workspace');
    }
  };

  const handleEdit = (workspace: any) => {
    setEditingWorkspace(workspace);
    setFormData({
      name: workspace.name,
      location: workspace.location,
      description: workspace.description,
      capacity: workspace.capacity,
      pricePerHour: workspace.pricePerHour,
      image: workspace.image,
      images: workspace.images.join(', '),
      amenities: workspace.amenities.join(', '),
      type: workspace.type,
      availability: workspace.availability,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workspace?')) return;

    const token = localStorage.getItem('volthub_admin_token');
    if (!token) return;

    try {
      await api.deleteWorkspace(token, id);
      toast.success('Workspace deleted successfully');
      loadWorkspaces();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete workspace');
    }
  };

  const resetForm = () => {
    setEditingWorkspace(null);
    setFormData({
      name: "",
      location: "",
      description: "",
      capacity: 0,
      pricePerHour: 0,
      image: "",
      images: "",
      amenities: "",
      type: "open",
      availability: "available",
    });
  };

  const filteredWorkspaces = workspaces.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#9CA3AF]">Loading workspaces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#071022]">Workspaces Management</h1>
          <p className="text-[#9CA3AF] mt-1">Manage all workspace listings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWorkspace ? 'Edit Workspace' : 'Create New Workspace'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 border border-[#D1D5DB] rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pricePerHour">Price per Hour ($)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <ImageUpload
                label="Main Image"
                onImageUpload={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
              />

              <ImageUpload
                label="Additional Images"
                multiple={true}
                onMultipleUpload={(urls) => setFormData({ ...formData, images: urls.join(',') })}
                currentImage={formData.images ? formData.images.split(',')[0] : undefined}
              />

              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, Coffee Bar, Parking"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Space</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="meeting-room">Meeting Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-[#0052FF] hover:bg-[#0042CC] text-white">
                  {editingWorkspace ? 'Update' : 'Create'} Workspace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
        <Input
          placeholder="Search workspaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Workspaces List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkspaces.map((workspace) => (
          <Card key={workspace.id} className="bg-white border-[#D1D5DB]">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img
                  src={workspace.image}
                  alt={workspace.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#071022] mb-1">{workspace.name}</h3>
                  <p className="text-sm text-[#9CA3AF] mb-2">{workspace.location}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#0052FF] font-semibold">${workspace.pricePerHour}/hr</span>
                    <span className="text-[#9CA3AF]">Seats: {workspace.capacity}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(workspace)}
                    className="border-[#0052FF] text-[#0052FF]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(workspace.id)}
                    className="border-[#EF4444] text-[#EF4444]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkspaces.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#9CA3AF]">No workspaces found</p>
        </div>
      )}
    </div>
  );
}
