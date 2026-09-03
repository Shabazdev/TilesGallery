export interface Tile {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'Ceramic' | 'Porcelain' | 'Marble' | 'Mosaic' | 'Stone' | 'Wood Finish' | 'Geometric' | 'Luxury' | string;
  price: number;
  currency: string;
  dimensions: string;
  material: string;
  creator: string;
  style: string;
  tags: string[];
  inStock: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (name: string, email: string, password: string, image?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (options?: { redirectUri?: string }) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (data: { name: string; image?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_API_URL?: string;
      NEXT_PUBLIC_API_URL?: string;
      BETTER_AUTH_SECRET?: string;
      BETTER_AUTH_URL?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      GOOGLE_REDIRECT_URI?: string;
      CORS_ORIGINS?: string;
      MONGODB_URI?: string;
      NODE_ENV?: string;
      PORT?: string;
      APP_URL?: string;
      VERCEL?: string;
      VERCEL_ENV?: string;
      VERCEL_URL?: string;
      VERCEL_PROJECT_PRODUCTION_URL?: string;
    }
  }
}
