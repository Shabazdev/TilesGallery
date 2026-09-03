import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { LayoutGrid, Mail, Lock, ArrowRight, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination if redirected from a protected route
  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCallback, setCopiedCallback] = useState(false);

  const exactCallbackUri = `${window.location.origin}/api/auth/callback/google`;

  const copyCallbackUri = () => {
    navigator.clipboard.writeText(exactCallbackUri);
    setCopiedCallback(true);
    toast.success('Redirect URI copied to clipboard!');
    setTimeout(() => setCopiedCallback(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);
    const result = await signInWithEmail(email.trim(), password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back to Tiles Gallery!');
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.error || 'Invalid email or password.');
      toast.error(result.error || 'Authentication failed');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      toast.success('Signed in with Google successfully!');
      navigate(from, { replace: true });
    } else {
      const msg = result.error || 'Google authentication failed';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('eleanor.vance@studio.design');
    setPassword('Password123');
    setErrorMessage('');
    toast.info('Filled default architect credentials');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-14 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 p-2 rounded-xl bg-stone-900 text-stone-100 mb-2">
            <LayoutGrid className="w-5 h-5 text-amber-400" />
            <span className="font-serif-luxury text-sm font-bold tracking-wider">TILES GALLERY</span>
          </Link>
          <h1 className="font-serif-luxury text-3xl font-bold text-stone-900">
            Sign In
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Access private specification sheets, sample tracking, and curated catalogs.
          </p>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>

            {(errorMessage.includes('redirect_uri_mismatch') || errorMessage.includes('popup was closed') || errorMessage.includes('Google')) && (
              <div className="mt-2 pt-2 border-t border-rose-200/80 text-[11px] text-stone-700 space-y-1.5">
                <div className="font-semibold text-rose-900">Configured Authorized Redirect URI:</div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-rose-200 font-mono text-[11px] text-stone-800 break-all select-all">
                  <span className="flex-1">{exactCallbackUri}</span>
                  <button
                    type="button"
                    onClick={copyCallbackUri}
                    className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors shrink-0 cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedCallback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-500">
                  Ensure this exact URI is listed under <strong>Authorized redirect URIs</strong> for your Client ID in Google Cloud Console.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700" htmlFor="login-password">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-stone-200 w-full"></div>
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-stone-400">
            or continue with
          </span>
          <div className="border-t border-stone-200 w-full"></div>
        </div>

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          id="google-login-btn"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-sm font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Quick Demo Credentials for Reviewers */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Demo: Eleanor Vance</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            className="text-amber-800 font-semibold hover:underline cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Registration Link */}
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-stone-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              id="register-redirect-link"
              className="font-semibold text-amber-600 hover:text-amber-700 hover:underline ml-1"
            >
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
