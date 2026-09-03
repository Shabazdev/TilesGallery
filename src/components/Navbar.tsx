import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, User as UserIcon, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Tiles', path: '/all-tiles' },
    { name: 'My Profile', path: '/my-profile', protected: true },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo */}
          <Link
            to="/"
            id="nav-brand-logo"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 shadow-md group-hover:scale-105 transition-transform duration-200">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-stone-100">
                TILES GALLERY
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 -mt-1 font-sans">
                Curated Surfaces
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm tracking-wide font-medium transition-colors duration-150 py-1.5 px-3 rounded-md ${
                  isActive(link.path)
                    ? 'text-amber-400 bg-stone-800/80 font-semibold'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/my-profile"
                  id="nav-user-profile-badge"
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-stone-800/80 border border-stone-700/80 hover:border-amber-500/50 transition-all"
                >
                  <img
                    src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-stone-600"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-stone-100 leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-stone-400 leading-none">
                      {user.role || 'Member'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  id="nav-logout-btn"
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-rose-300 hover:bg-rose-950/30 px-3 py-2 rounded-lg border border-transparent hover:border-rose-900/50 transition-all cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-5 py-2.5 rounded-lg shadow-sm hover:shadow-amber-500/20 transition-all duration-150"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="nav-mobile-toggle-btn"
              className="p-2.5 rounded-lg bg-stone-800 text-stone-200 hover:text-amber-400 hover:bg-stone-700/80 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-stone-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-stone-900 rounded-lg">
                  <img
                    src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-700"
                  />
                  <div>
                    <div className="text-sm font-semibold text-stone-100">{user.name}</div>
                    <div className="text-xs text-stone-400">{user.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/my-profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-stone-800 text-sm font-medium text-stone-200 hover:bg-stone-700"
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-950/40 border border-rose-900/50 text-sm font-medium text-rose-300 hover:bg-rose-900/60"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-3 px-4 rounded-lg shadow-sm"
              >
                <span>Login / Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
