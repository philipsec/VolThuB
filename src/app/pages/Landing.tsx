import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { api } from "../lib/api";
import { CheckCircle2, Zap, Users, Calendar, ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch workspaces with real-time updates
  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const response = await api.getWorkspaces();
        setWorkspaces(response.workspaces || []);
      } catch (error) {
        console.error('Failed to load workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();

    // Poll for updates every 5 seconds to show real-time admin changes
    const interval = setInterval(loadWorkspaces, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book premium coworking spaces in seconds"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with professionals and entrepreneurs"
    },
    {
      icon: Calendar,
      title: "Flexible Plans",
      description: "Choose hourly, daily, or monthly memberships"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0052FF] via-[#003399] to-[#0A2E66]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-[#0052FF]">V</span>
          </div>
          <span className="text-2xl font-bold text-white">VoltHub</span>
        </div>
        <div className="flex gap-3">
          <Link to="/auth/login">
            <Button className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#0052FF]">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="bg-white text-[#0052FF] hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your Premium Coworking Space Awaits
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          Find and book the perfect workspace for your team. Access premium facilities with flexible pricing and locations across major cities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth/signup">
            <Button size="lg" className="bg-white text-[#0052FF] hover:bg-gray-100">
              Start Exploring
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#0052FF]"
            onClick={() => document.querySelector('#featured-spaces')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Available Spaces
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="bg-white/10 border-white/20 backdrop-blur">
                <CardHeader>
                  <Icon className="w-8 h-8 text-white mb-2" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Spaces Section */}
      <section id="featured-spaces" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Available Spaces</h2>
        
        {loading ? (
          <div className="text-center text-gray-300 py-12">Loading spaces...</div>
        ) : workspaces.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.slice(0, 6).map((workspace) => (
              <Card key={workspace.id} className="bg-white overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={workspace.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500'}
                    alt={workspace.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#0052FF] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${workspace.price}/hr
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{workspace.name}</CardTitle>
                  <CardDescription>{workspace.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{workspace.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {workspace.capacity} capacity
                  </div>
                  <div className="flex items-center gap-2">
                    {workspace.availability === 'available' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Available</span>
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full bg-[#0052FF] hover:bg-[#0041CC]"
                    onClick={() => navigate(`/auth/signup?workspace=${workspace.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-300 py-12">
            No spaces available yet. Check back soon!
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-white/5 backdrop-blur border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your perfect workspace?</h2>
          <p className="text-gray-300 mb-8">Join thousands of professionals using VoltHub for their coworking needs.</p>
          <Link to="/auth/signup">
            <Button size="lg" className="bg-white text-[#0052FF] hover:bg-gray-100">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10 text-center text-gray-400">
        <p>&copy; 2026 VoltHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
