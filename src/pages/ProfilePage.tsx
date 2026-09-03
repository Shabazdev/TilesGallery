import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { User as UserIcon, Mail, Calendar, Shield, Edit3, Award, Layers, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'January 2025';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-700">
            Account Management
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            My Designer Profile
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            View your verified credentials, architectural privileges, and surface preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          {/* Header banner */}
          <div className="h-36 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 relative">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          <div className="px-6 sm:px-10 pb-10 relative">
            {/* Avatar & Action Button Bar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-8 gap-4">
              <div className="relative inline-block">
                <img
                  src={
                    user.image ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={user.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-100"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-amber-500 text-stone-950 shadow-md">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <Link
                to="/my-profile/update"
                id="profile-update-btn"
                className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-sm px-6 py-3 rounded-xl shadow transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Update Profile</span>
              </Link>
            </div>

            {/* User details */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-500">
                  <span className="font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    {user.role || 'Verified Specifier'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    Member since {formattedDate}
                  </span>
                </div>
              </div>

              {/* Account Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold uppercase tracking-wider">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>Email Address</span>
                  </div>
                  <div className="text-sm font-semibold text-stone-800 break-all">
                    {user.email}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Authentication Method</span>
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    Better Auth Session (JWT Protected)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>Sample Kit Tier</span>
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    Priority Express (Direct Quarry Shipping)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Catalog Access</span>
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    Full High-Resolution Spec Sheets
                  </div>
                </div>
              </div>

              {/* Recent Saved Collections banner */}
              <div className="mt-8 p-6 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Explore New Seasonal Slabs
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Our 2026 Spring collection features 12 rare honed Italian marbles and terrazzo inlays.
                  </p>
                </div>
                <Link
                  to="/all-tiles"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  Browse Tiles
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
