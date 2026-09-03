import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-3" />
        <span className="text-sm font-medium tracking-wide">Validating session credentials...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login while preserving the attempted location path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
