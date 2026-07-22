import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  Settings as SettingsIcon, 
  FolderGit, 
  Menu, 
  X, 
  Search, 
  Bell, 
  Activity, 
  ChevronDown, 
  Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPalette } from './dashboard/CommandPalette';

export const Navigation = ({ variant = 'landing' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Mock list of workspace items
  const activeProjectName = localStorage.getItem('last_project_name') || 'Select Repository';

  const navItems = [
    { path: '/workspace', label: 'Workspace', icon: FolderGit },
    { path: '/compiler', label: 'Compiler', icon: Terminal },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (variant === 'landing') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5" data-testid="nav-logo">
              <div className="p-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.2)]">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white" style={{ fontFamily: 'Chivo, sans-serif' }}>
                CodeAtlas AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors" data-testid="nav-features">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors" data-testid="nav-how-it-works">
                How it Works
              </a>
              <Link to="/workspace">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.45)] transition-all" data-testid="nav-get-started">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg border border-zinc-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl" data-testid="mobile-menu">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-400 hover:text-zinc-100"
                data-testid="mobile-nav-features"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-400 hover:text-zinc-100"
                data-testid="mobile-nav-how-it-works"
              >
                How it Works
              </a>
              <Link to="/workspace" onClick={() => setMobileMenuOpen(false)} className="block" data-testid="mobile-nav-get-started">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Sidebar Layout for In-App views
  return (
    <>
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />

      {/* TOP HEADER (Breadcrumbs and shortcuts bar) */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-zinc-800/80 glass z-30 flex items-center justify-between px-6 md:pl-72 select-none">
        <div className="flex items-center space-x-3">
          <Link to="/workspace" className="md:hidden flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-blue-500" />
          </Link>
          <div className="text-zinc-500 text-xs font-mono hidden md:flex items-center space-x-2">
            <span>CodeAtlas AI</span>
            <span>/</span>
            <span className="text-zinc-200 capitalize font-medium">{location.pathname.replace('/', '')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Command search input button */}
          <button 
            onClick={() => setCmdOpen(true)}
            className="flex items-center space-x-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-400 transition-colors text-xs font-medium w-40 md:w-56"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-left flex-1">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 rounded font-sans uppercase">
              Ctrl+K
            </kbd>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-zinc-800 bg-zinc-950 p-4 shadow-2xl text-xs space-y-3 z-50">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="font-bold text-zinc-200 uppercase tracking-wider">Alerts</span>
                  <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer" onClick={() => setNotificationsOpen(false)}>Close</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-zinc-900/60 rounded border border-zinc-800 flex items-start space-x-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-zinc-200 font-semibold">Compiler Engine Active</p>
                      <p className="text-zinc-500 text-[10px]">System services are operational.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* LEFT SIDEBAR (Desktop only) */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 border-r border-zinc-800/80 bg-zinc-950 z-40 hidden md:flex flex-col select-none">
        {/* Workspace Swapper Header */}
        <div className="h-16 border-b border-zinc-800/80 px-6 flex items-center">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-500">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-extrabold text-zinc-200 tracking-tight" style={{ fontFamily: 'Chivo, sans-serif' }}>
              CodeAtlas AI
            </span>
          </Link>
        </div>

        {/* Project Switcher Selector */}
        <div className="px-4 py-4 border-b border-zinc-900">
          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-850 hover:border-zinc-800 cursor-pointer">
            <div className="flex items-center space-x-2 overflow-hidden">
              <Layers className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-zinc-200 truncate">{activeProjectName}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  active 
                    ? 'bg-zinc-900 border border-zinc-800/80 text-white shadow-lg shadow-black/40' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                }`}
                data-testid={item.path === '/workspace' ? 'nav-workspace' : item.path === '/compiler' ? 'nav-compiler' : 'nav-settings'}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-500' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-6 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-600 font-mono">
          <span>v1.0.0-enterprise</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Healthy" />
        </div>
      </aside>
    </>
  );
};