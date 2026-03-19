import { Link } from "react-router";

export default function Footer() {
  const handleNavigation = (section: string) => {
    // Placeholder for future navigation
    console.log(`Navigate to ${section}`);
  };

  return (
    <footer className="bg-[#0F172A] text-white border-t border-[#1F2937]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">VoltHub</h3>
          <p className="text-sm text-[#9CA3AF] max-w-xs">
            Your next-power coworking booking platform. Find spaces, manage bookings, and keep your team aligned.
          </p>
        </div>

        <nav>
          <h4 className="text-sm font-semibold text-[#F3F4F6] mb-2">Links</h4>
          <ul className="space-y-1 text-sm text-[#9CA3AF]">
            <li><Link to="/" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1">Home</Link></li>
            <li><Link to="/portal/workspaces" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1">Explore</Link></li>
            <li><Link to="/portal/my-bookings" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1">My Bookings</Link></li>
            <li><Link to="/portal/profile" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1">Profile</Link></li>
          </ul>
        </nav>

        <nav>
          <h4 className="text-sm font-semibold text-[#F3F4F6] mb-2">Support</h4>
          <ul className="space-y-1 text-sm text-[#9CA3AF]">
            <li><button onClick={() => handleNavigation('help')} className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1 text-left">Help Center</button></li>
            <li><button onClick={() => handleNavigation('terms')} className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1 text-left">Terms</button></li>
            <li><button onClick={() => handleNavigation('privacy')} className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1 text-left">Privacy</button></li>
            <li><button onClick={() => handleNavigation('contact')} className="hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded px-1 text-left">Contact Us</button></li>
          </ul>
        </nav>
      </div>
      <div className="bg-[#0B1222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-[#64748B]">
          &copy; {new Date().getFullYear()} VoltHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
