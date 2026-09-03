import React, { useEffect, useState, useMemo } from 'react';
import { Tile } from '../types';
import { fetchTiles } from '../lib/api';
import { TileCard } from '../components/TileCard';
import { TileGridSkeleton } from '../components/LoadingSkeleton';
import { Search, SlidersHorizontal, X, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Ceramic',
  'Porcelain',
  'Marble',
  'Mosaic',
  'Stone',
  'Wood Finish',
  'Geometric',
  'Luxury',
];

export const AllTilesPage: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    // Dynamic page title per SEO requirement #32
    document.title = 'All Tiles | Tiles Gallery';
    
    setLoading(true);
    fetchTiles()
      .then((data) => {
        setTiles(data);
      })
      .catch((err) => console.error('Error fetching tiles:', err))
      .finally(() => setLoading(false));
  }, []);

  // Instant client-side filtering (case-insensitive, no page refresh, dynamic search by title/category/material/tags)
  const filteredTiles = useMemo(() => {
    return tiles.filter((tile) => {
      // 1. Search filter by title, material, description, tags
      const matchesSearch =
        !searchTerm.trim() ||
        tile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        tile.category.toLowerCase() === selectedCategory.toLowerCase();

      // 3. In stock filter
      const matchesStock = !inStockOnly || tile.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [tiles, searchTerm, selectedCategory, inStockOnly]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
      {/* 1. Large Hero / Search Area */}
      <section className="bg-stone-900 text-stone-100 py-16 sm:py-20 border-b border-stone-800 relative overflow-hidden">
        {/* Ambient background styling */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Surface Repository</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-stone-100">
              Explore Our Tile Collection
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto">
              Browse, filter, and inspect hand-selected ceramic, marble, and porcelain surfaces for residential and commercial architecture.
            </p>

            {/* Dynamic Search Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-stone-400 pointer-events-none">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="tile-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tiles by title..."
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-stone-800/95 border border-stone-700 text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base shadow-inner transition-all"
                  aria-label="Search tiles by title"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 p-1 rounded-md text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-colors"
                    aria-label="Clear search text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filters Bar */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-amber-400 shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* In Stock toggle & Results count */}
            <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  id="filter-instock-checkbox"
                  className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              <div className="text-xs text-stone-500 font-medium">
                Showing <span className="font-bold text-stone-900">{filteredTiles.length}</span> of {tiles.length} tiles
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <TileGridSkeleton count={8} />
        ) : filteredTiles.length === 0 ? (
          /* Empty State */
          <div className="py-20 px-6 text-center max-w-lg mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-2">
              No tiles found
            </h2>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              We couldn’t find any tiles matching your current search parameters "{searchTerm || selectedCategory}". Try tweaking your filters or resetting the search.
            </p>
            <button
              onClick={handleClearSearch}
              id="clear-search-btn"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-100 px-6 py-3 rounded-xl text-sm font-semibold shadow transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Search</span>
            </button>
          </div>
        ) : (
          /* All Tiles Grid: 4 cols desktop, 2-3 cols tablet, 1 col mobile */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredTiles.map((tile) => (
              <TileCard key={tile.id} tile={tile} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
