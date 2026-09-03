import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safely parse a JSON response. If the server returns non-JSON (e.g. an HTML
// error page or plain-text "A server error has occurred" from a crashed
// serverless function), this throws a clear error instead of the cryptic
// "Unexpected token < in JSON" that res.json() would produce.
async function safeJsonParse(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(
      `Expected JSON response but received ${contentType || 'unknown content-type'} ` +
      `(HTTP ${res.status}). Body preview: ${text.substring(0, 200)}`
    );
  }
  return res.json();
}

const LOCAL_STORAGE_USER_KEY = 'tiles_gallery_user';
const LOCAL_STORAGE_TOKEN_KEY = 'tiles_gallery_token';

// Initial pre-configured guest/demo user for quick testing if desired
const DEFAULT_DEMO_USER: User = {
  id: 'user_default',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@studio.design',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  createdAt: '2025-01-15T10:00:00.000Z',
  role: 'Interior Architect',
};

// Clean and resolve API endpoint. The API base comes from VITE_API_URL
// (legacy: NEXT_PUBLIC_API_URL). When unset — the default on Vercel, where the
// backend is a same-origin serverless function — endpoints resolve relatively
// against the current origin. localhost values are ignored so they can never
// leak into production.
function getAuthUrl(endpoint: string): string {
  const raw = (process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '');
  const base = (raw && !raw.includes('localhost') && !raw.includes('127.0.0.1')) ? raw : '';
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      const savedUserStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

      if (savedToken && savedUserStr) {
        setUser(JSON.parse(savedUserStr));
      }
    } catch (e) {
      console.error('Failed reading session from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const res = await fetch(getAuthUrl('/api/auth/sign-in/email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeJsonParse(res);
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      const authenticatedUser: User = data.user;
      const token = data.token;

      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);

      return { success: true };
    } catch (error: any) {
      // Fallback local authentication if server unreachable
      if (email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase() && password === 'Password123') {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, 'demo_token');
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
        setUser(DEFAULT_DEMO_USER);
        return { success: true };
      }
      return { success: false, error: 'Network error or invalid credentials' };
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string, image?: string) => {
    try {
      const res = await fetch(getAuthUrl('/api/auth/sign-up/email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, image }),
      });

      const data = await safeJsonParse(res);
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: true };
    }
  };

  const signInWithGoogle = async (options?: { redirectUri?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const width = 520;
      const height = 640;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      // 1. Open popup synchronously to preserve browser user activation (prevents popup blocker)
      const popup = window.open(
        'about:blank',
        'google_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      // 2. Obtain Google authorization URL with explicit client origin or custom redirectUri
      const queryParams = new URLSearchParams({ origin: window.location.origin });
      if (options?.redirectUri) {
        queryParams.set('redirect_uri', options.redirectUri);
      }
      const authUrlEndpoint = getAuthUrl(`/api/auth/google/url?${queryParams.toString()}`);
      let data: any = null;

      try {
        const res = await fetch(authUrlEndpoint);
        data = await safeJsonParse(res);

        if (!res.ok || !data.configured || !data.url) {
          if (popup && !popup.closed) popup.close();
          return {
            success: false,
            error: data?.message || 'Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) must be configured in environment variables.',
          };
        }
      } catch (fetchErr: any) {
        if (popup && !popup.closed) popup.close();
        return {
          success: false,
          error: 'Failed to contact authentication server: ' + (fetchErr.message || 'Unknown network error'),
        };
      }

      // 3. Direct popup directly to OAuth provider (Google) - never load container app routes in popup
      if (popup && !popup.closed) {
        popup.location.href = data.url;
      } else {
        // Fallback: If popup was blocked by browser
        window.location.href = data.url;
        return { success: true };
      }

      // 4. Multi-channel response listener (postMessage + BroadcastChannel + storage event + polling)
      return new Promise<{ success: boolean; error?: string }>((resolve) => {
        let isResolved = false;

        const finalizeAuth = (token: string, userData: any) => {
          if (isResolved) return;
          isResolved = true;
          cleanup();
          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
          setUser(userData);
          try {
            if (popup && !popup.closed) popup.close();
          } catch (e) {}
          resolve({ success: true });
        };

        const cleanup = () => {
          window.removeEventListener('message', handleMessage);
          window.removeEventListener('storage', handleStorage);
          if (broadcastChannel) {
            try {
              broadcastChannel.close();
            } catch (e) {}
          }
          if (pollTimer) clearInterval(pollTimer);
        };

        // Channel A: postMessage from popup callback
        const handleMessage = (event: MessageEvent) => {
          if (event.data && event.data.type === 'GOOGLE_AUTH_RESULT') {
            if (event.data.success && event.data.token && event.data.user) {
              finalizeAuth(event.data.token, event.data.user);
            } else if (!event.data.success) {
              if (isResolved) return;
              isResolved = true;
              cleanup();
              resolve({
                success: false,
                error: event.data.error || 'Google authentication was not completed.',
              });
            }
          }
        };
        window.addEventListener('message', handleMessage);

        // Channel B: BroadcastChannel (cross-tab/popup synchronization on same origin)
        let broadcastChannel: BroadcastChannel | null = null;
        try {
          broadcastChannel = new BroadcastChannel('google_oauth_channel');
          broadcastChannel.onmessage = (event) => {
            if (event.data && event.data.type === 'GOOGLE_AUTH_RESULT') {
              if (event.data.success && event.data.token && event.data.user) {
                finalizeAuth(event.data.token, event.data.user);
              }
            }
          };
        } catch (e) {}

        // Channel C: localStorage storage event
        const handleStorage = (event: StorageEvent) => {
          if (event.key === LOCAL_STORAGE_TOKEN_KEY && event.newValue) {
            const userStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (userStr) {
              try {
                finalizeAuth(event.newValue, JSON.parse(userStr));
              } catch (e) {}
            }
          }
        };
        window.addEventListener('storage', handleStorage);

        // Channel D: Periodic polling of localStorage and popup state
        const startTime = Date.now();
        const pollTimer = setInterval(() => {
          // Check if token was written by callback
          const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
          const userStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (token && userStr) {
            try {
              finalizeAuth(token, JSON.parse(userStr));
              return;
            } catch (e) {}
          }

          // Check if popup closed by user or due to error (wait at least 2.5s to avoid initial render race conditions)
          if (popup.closed) {
            if (Date.now() - startTime > 2000) {
              if (isResolved) return;
              isResolved = true;
              cleanup();

              // Final check on localStorage
              const finalToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
              const finalUserStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
              if (finalToken && finalUserStr) {
                try {
                  finalizeAuth(finalToken, JSON.parse(finalUserStr));
                  return;
                } catch (e) {}
              }

              resolve({
                success: false,
                error: 'Authentication popup was closed before completion. If Google showed "redirect_uri_mismatch", please add the authorized redirect URI in Google Cloud Console.',
              });
            }
          }
        }, 500);
      });
    } catch (err: any) {
      console.error('[Google OAuth] Error:', err);
      return {
        success: false,
        error: err.message || 'Failed to initiate Google sign-in.',
      };
    }
  };

  const updateUserProfile = async (data: { name: string; image?: string }) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';
    try {
      const res = await fetch(getAuthUrl('/api/auth/update-user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await safeJsonParse(res);
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to update profile');
      }

      const updatedUser: User = resData.user;
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error: any) {
      if (user) {
        const localUpdated: User = {
          ...user,
          name: data.name.trim(),
          image: data.image?.trim() || user.image,
        };
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUpdated));
        setUser(localUpdated);
        return { success: true };
      }
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  const signOut = async () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (token) {
      try {
        await fetch(getAuthUrl('/api/auth/sign-out'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        // ignore error during signout
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        updateUserProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
