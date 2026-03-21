import { Link } from "react-router";

export default function Footer() {
  const handleNavigation = (section: string) => {
    // Placeholder for future navigation
    console.log(`Navigate to ${section}`);
  };

  return (
    <footer className="bg-card text-card-foreground border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">VoltHub</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your next-power coworking booking platform. Find spaces, manage bookings, and keep your team aligned.
          </p>
        </div>

        <nav>
          <h4 className="text-sm font-semibold text-foreground mb-2">Links</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/portal/workspaces"
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1"
              >
                Explore
              </Link>
            </li>
            <li>
              <Link
                to="/portal/my-bookings"
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1"
              >
                My Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/portal/profile"
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        <nav>
          <h4 className="text-sm font-semibold text-foreground mb-2">Support</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <button
                onClick={() => handleNavigation('help')}
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1 text-left"
              >
                Help Center
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('terms')}
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1 text-left"
              >
                Terms
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('privacy')}
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1 text-left"
              >
                Privacy
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('contact')}
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded px-1 text-left"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="bg-background/40 dark:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:flex md:items-center md:justify-between text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} VoltHub. All rights reserved.</span>
          <div className="flex items-center justify-center gap-3 mt-3 md:mt-0">
            <a
              href="#"
              className="hover:text-foreground transition-colors"
              onClick={() => handleNavigation('twitter')}
              aria-label="Visit VoltHub Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
              onClick={() => handleNavigation('linkedin')}
              aria-label="Visit VoltHub LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
              onClick={() => handleNavigation('github')}
              aria-label="Visit VoltHub GitHub"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
