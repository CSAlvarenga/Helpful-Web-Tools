import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Image Tools", path: "/#image-tools" },
    { name: "PDF Tools", path: "/#pdf-tools" },
    { name: "Developer Tools", path: "/#dev-tools" },
    { name: "Text Tools", path: "/#text-tools" },
    { name: "Math & Finance", path: "/#math-finance" },
    { name: "Daily Utilities", path: "/#utilities" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Background Image - Only on homepage */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(https://customer-assets.emergentagent.com/job_toolkit-online/artifacts/cq72c9tx_Gemini_Generated_Image_dnnhl0dnnhl0dnnh.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.4'
        }}
      />
      
      {/* Dark Overlay for readability */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(5, 5, 5, 0.7) 0%, rgba(5, 5, 5, 0.9) 100%)'
        }}
      />

      {/* Header */}
      <header 
        className="fixed top-0 w-full z-50 border-b border-white/5"
        style={{
          background: '#000000',
          backdropFilter: 'blur(12px)'
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" data-testid="logo-link">
              <img 
                src="https://customer-assets.emergentagent.com/job_toolkit-online/artifacts/5ddq4su0_enlarged-logo.png" 
                alt="Helpful Web Tools Logo"
                className="h-14 w-14"
              />
              <div className="flex flex-col">
                <span className="text-xl font-heading font-bold tracking-tight text-foreground">
                  Helpful Web Tools
                </span>
                <span className="text-xs text-muted-foreground tracking-wide uppercase">
                  Your Swiss Army Knife Online
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
                  data-testid={`nav-${category.name.toLowerCase().replace(' ', '-')}`}
                >
                  {category.name}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5" data-testid="mobile-menu">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.path}
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </a>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">
              © 2025 Helpful Web Tools. Your Swiss Army Knife Online.
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              All tools run in your browser. No data uploaded to servers.
            </p>
            <p className="text-muted-foreground text-sm">
              Support: <a href="mailto:support@helpfulwebtools.net" className="text-primary hover:text-primary/80 transition-colors">support@helpfulwebtools.net</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
