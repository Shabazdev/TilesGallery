import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" id="footer-brand-logo" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 shadow-md">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span className="font-serif-luxury text-xl font-bold tracking-wider text-stone-100">
                TILES GALLERY
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Curating the world’s most exquisite ceramic, porcelain, natural stone, and artisan mosaics for discerning architects and interior designers.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-amber-400 font-medium">
              <span>Studio Showroom</span>
              <span>•</span>
              <span>Worldwide Shipping</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-stone-100 uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  id="footer-link-home"
                  className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-tiles"
                  id="footer-link-all-tiles"
                  className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  All Tiles Gallery
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link
                  to="/my-profile"
                  id="footer-link-my-profile"
                  className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  id="footer-link-login"
                  className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  Client Portal / Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-stone-100 uppercase mb-4">
              Showroom Contact
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>480 Architectural Way, Design District, New York, NY 10013</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+18005558453" className="hover:text-stone-200 transition-colors">
                  +1 (800) 555-TILE (8453)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:concierge@tilesgallery.com" className="hover:text-stone-200 transition-colors">
                  concierge@tilesgallery.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-stone-100 uppercase mb-4">
              Connect With Us
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Follow our daily architectural features, material studies, and newly curated arrivals.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                id="footer-social-facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                id="footer-social-instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                id="footer-social-linkedin"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                id="footer-social-twitter"
                aria-label="X/Twitter"
                className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <div className="text-xs text-stone-500">
              Hours: Mon – Fri: 9:00 AM – 6:00 PM EST
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Tiles Gallery Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-400 transition-colors cursor-pointer">Material Certifications</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
