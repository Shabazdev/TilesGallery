import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tile } from '../types';
import { fetchFeaturedTiles } from '../lib/api';
import { TileCard } from './TileCard';
import { TileGridSkeleton } from './LoadingSkeleton';
import { ArrowRight, AlertCircle, RefreshCw, Sparkles, Inbox } from 'lucide-react';

export const FeaturedTiles: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeaturedTiles();
      setTiles(data);
    } catch (err: any) {
      setError('Unable to load featured tiles from the collection server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  return (
    <section id="featured-section" className="py-16 sm:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Studio Picks</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900">
              Featured Tiles
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              Our curated top-rated selections, from hand-glazed Mediterranean tiles to Italian marble slabs.
            </p>
          </div>

          <Link
            to="/all-tiles"
            id="featured-view-all-link"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
          >
            <span>Explore All 12 Tiles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content States */}
        {loading ? (
          <TileGridSkeleton count={4} />
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-serif-luxury text-lg font-bold text-rose-900 mb-1">
              Error Loading Tiles
            </h3>
            <p className="text-sm text-rose-700 mb-4">{error}</p>
            <button
              onClick={loadFeatured}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        ) : tiles.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-stone-200 text-center max-w-md mx-auto">
            <Inbox className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif-luxury text-lg font-bold text-stone-900 mb-1">
              No Tiles Available
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              Check back soon as we curate our newest seasonal shipments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiles.map((tile) => (
              <TileCard key={tile.id} tile={tile} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
