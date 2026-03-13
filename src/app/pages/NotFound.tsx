import { Link } from "react-router";
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071022] to-[#071a2a] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#0052FF] mb-4">404</h1>
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-lg text-white/80 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-[#0052FF] hover:bg-[#0042CC] text-white">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/portal/workspaces">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#071022]">
              <Search className="w-5 h-5 mr-2" />
              Browse Workspaces
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
