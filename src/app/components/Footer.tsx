import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white border-t border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">VoltHub</h3>
          <p className="text-sm text-[#9CA3AF] max-w-xs">
            Your next-power coworking booking platform. Find spaces, manage bookings, and keep your team aligned.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#F3F4F6] mb-2">Links</h4>
          <ul className="space-y-1 text-sm text-[#9CA3AF]">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/portal/workspaces" className="hover:text-white">Explore</Link></li>
            <li><Link to="/portal/my-bookings" className="hover:text-white">My Bookings</Link></li>
            <li><Link to="/portal/profile" className="hover:text-white">Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#F3F4F6] mb-2">Support</h4>
          <ul className="space-y-1 text-sm text-[#9CA3AF]">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Terms</a></li>
            <li><a href="#" className="hover:text-white">Privacy</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="bg-[#0B1222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-[#64748B]">
          &copy; {new Date().getFullYear()} VoltHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
