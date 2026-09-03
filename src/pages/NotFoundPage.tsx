import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-stone-50 text-stone-900">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl border border-stone-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5 border border-amber-200/60">
          <Layers className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
          404 Error
        </span>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 mt-4 mb-2">
          Tile Not Found
        </h1>

        <p className="text-stone-600 text-sm mb-8 leading-relaxed">
          The tile or page you're looking for doesn't exist, may have been relocated, or is temporarily unavailable in our current exhibition.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/all-tiles"
            id="notfound-alltiles-btn"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-sm shadow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gallery</span>
          </Link>

          <Link
            to="/"
            id="notfound-home-btn"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
