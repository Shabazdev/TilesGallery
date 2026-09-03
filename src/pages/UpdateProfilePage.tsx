import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { ArrowLeft, User as UserIcon, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';

export const UpdateProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [imageUrl, setImageUrl] = useState(user?.image || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setLoading(true);
    const result = await updateUserProfile({
      name: name.trim(),
      image: imageUrl.trim() || undefined,
    });
    setLoading(false);

    if (result.success) {
      toast.success('Profile information updated successfully!');
      navigate('/my-profile');
    } else {
      toast.error(result.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-12 sm:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/my-profile"
          id="update-profile-back-link"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 shadow-sm">
          <div className="mb-6">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
              Update Profile Information
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Modify your display name and verified portrait photo for sample orders.
            </p>
          </div>

          {/* Real-time photo preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-6">
            <img
              src={imageUrl.trim() || user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="Avatar preview"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              }}
              className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Avatar Preview
              </div>
              <div className="text-sm font-bold text-stone-900">
                {name || user?.name}
              </div>
              <div className="text-xs text-stone-500">
                {user?.email}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5" htmlFor="update-name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="update-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5" htmlFor="update-image">
                Profile Image URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  id="update-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Provide an image URL hosted on Unsplash or your image CDN.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                id="update-info-submit-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold py-3.5 px-6 rounded-xl shadow transition-all cursor-pointer disabled:opacity-60 text-sm"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving Changes...' : 'Update Information'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/my-profile')}
                className="inline-flex items-center justify-center py-3.5 px-6 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
