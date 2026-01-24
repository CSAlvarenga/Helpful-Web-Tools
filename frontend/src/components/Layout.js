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
    { name: "Daily Utilities", path: "/#utilities" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Glow Effects */}
      <div 
        className="fixed top-0 left-1/4 w-96 h-96 -translate-y-1/2 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, transparent 70%)'
        }}
      />
      <div 
        className="fixed bottom-0 right-1/4 w-96 h-96 translate-y-1/2 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 95, 0, 0.15) 0%, transparent 70%)'
        }}
      />

      {/* Header */}
      <header 
        className="fixed top-0 w-full z-50 border-b border-white/5"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" data-testid="logo-link">
              <img 
                src="https://customer-assets.emergentagent.com/job_toolkit-online/artifacts/m1i845iy_Gemini_Generated_Image_l3xqktl3xqktl3xq.png" 
                alt="Helpful Web Tools Logo"
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
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
            <p className="text-muted-foreground text-sm">
              © 2025 Helpful Web Tools. Your Swiss Army Knife Online.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              All tools run in your browser. No data uploaded to servers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
