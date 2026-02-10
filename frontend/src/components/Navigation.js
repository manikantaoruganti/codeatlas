import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Code2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = ({ variant = 'landing' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="nav-logo">
            <Code2 className="w-8 h-8 text-electric-blue" />
            <span className="text-xl font-black" style={{ fontFamily: 'Chivo, sans-serif' }}>
              CodeAtlas AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {variant === 'landing' ? (
              <>
                <a href="#features" className="text-sm hover:text-electric-blue transition-smooth" data-testid="nav-features">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm hover:text-electric-blue transition-smooth" data-testid="nav-how-it-works">
                  How it Works
                </a>
                <Link to="/workspace">
                  <Button className="bg-electric-blue hover:bg-blue-600 btn-hover" data-testid="nav-get-started">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/workspace" className="text-sm hover:text-electric-blue transition-smooth" data-testid="nav-workspace">
                  Workspace
                </Link>
                <Link to="/compiler" className="text-sm hover:text-electric-blue transition-smooth" data-testid="nav-compiler">
                  Compiler
                </Link>
                <Link to="/settings" className="text-sm hover:text-electric-blue transition-smooth" data-testid="nav-settings">
                  Settings
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {variant === 'landing' ? (
              <>
                <a
                  href="#features"
                  className="block px-3 py-2 text-base hover:bg-electric-blue/10 rounded-md"
                  data-testid="mobile-nav-features"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 text-base hover:bg-electric-blue/10 rounded-md"
                  data-testid="mobile-nav-how-it-works"
                >
                  How it Works
                </a>
                <Link to="/workspace" className="block px-3 py-2" data-testid="mobile-nav-get-started">
                  <Button className="w-full bg-electric-blue hover:bg-blue-600">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/workspace"
                  className="block px-3 py-2 text-base hover:bg-electric-blue/10 rounded-md"
                  data-testid="mobile-nav-workspace"
                >
                  Workspace
                </Link>
                <Link
                  to="/compiler"
                  className="block px-3 py-2 text-base hover:bg-electric-blue/10 rounded-md"
                  data-testid="mobile-nav-compiler"
                >
                  Compiler
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 text-base hover:bg-electric-blue/10 rounded-md"
                  data-testid="mobile-nav-settings"
                >
                  Settings
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};