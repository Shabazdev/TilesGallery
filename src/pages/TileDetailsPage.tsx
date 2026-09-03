import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tile } from '../types';
import { fetchTileById } from '../lib/api';
import { ArrowLeft, CheckCircle2, Clock, Layers, Ruler, Tag, Sparkles, Building, Palette, Share2, Heart } from 'lucide-react';
import { toast } from 'sonner';

export const TileDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sampleRequested, setSampleRequested] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchTileById(id)
      .then((data) => {
        setTile(data);
        if (data) {
          document.title = `${data.title} | Tiles Gallery`;
        } else {
          document.title = 'Tile Not Found | Tiles Gallery';
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequestSample = () => {
    setSampleRequested(true);
    toast.success(`Sample kit reserved for ${tile?.title}! Our concierge will contact you shortly.`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Direct link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-stone-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-stone-500 font-medium text-sm">Retrieving high-resolution tile specifications...</p>
      </div>
    );
  }

  // Custom Not Found experience if tile does not exist
  if (!tile) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-stone-50">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl border border-stone-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Tile Not Found
          </h1>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            The tile with specification ID <span className="font-mono font-semibold text-stone-800">"{id}"</span> could not be located in our active showroom catalog.
          </p>
          <Link
            to="/all-tiles"
            id="notfound-back-gallery-btn"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gallery</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Top breadcrumb & back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <Link
            to="/all-tiles"
            id="details-back-btn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200/90 px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gallery</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200/90 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Spec</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Details Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm">
          
          {/* Left Column: Large High-Resolution Image Presentation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Category overlay */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-950/80 backdrop-blur-md text-amber-300 border border-stone-800 shadow-md">
                  {tile.category}
                </span>
              </div>

              {/* In stock badge */}
              <div className="absolute top-4 right-4">
                {tile.inStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/95 backdrop-blur-md text-white shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock & Ready to Ship
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/95 backdrop-blur-md text-stone-950 shadow-md">
                    <Clock className="w-3.5 h-3.5" />
                    Custom Quarry Order
                  </span>
                )}
              </div>
            </div>

            {/* Sub-details preview card */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
              <div>
                <span className="text-stone-400 block uppercase font-mono">Catalog ID</span>
                <span className="font-semibold text-stone-800">{tile.id}</span>
              </div>
              <div>
                <span className="text-stone-400 block uppercase font-mono">Finish Grade</span>
                <span className="font-semibold text-stone-800">Commercial AAA+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Content */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Title & Creator */}
              <div className="border-b border-stone-200 pb-5">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-700 uppercase mb-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>Created by {tile.creator}</span>
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                  {tile.title}
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-stone-900 font-sans">
                    ${tile.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-stone-500">
                    {tile.currency} / square meter
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Architectural Description
                </h2>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {tile.description}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mb-1">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Material</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{tile.material}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mb-1">
                    <Ruler className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dimensions</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{tile.dimensions}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mb-1">
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    <span>Style</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{tile.style}</div>
                </div>
              </div>

              {/* Tags / Chips */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Design Tags</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tile.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200/80 hover:bg-stone-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRequestSample}
                  disabled={sampleRequested}
                  id="tile-request-sample-btn"
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer ${
                    sampleRequested
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{sampleRequested ? 'Sample Kit Reserved ✓' : 'Request Material Sample'}</span>
                </button>

                <Link
                  to="/all-tiles"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-sm transition-colors"
                >
                  <span>Browse More Tiles</span>
                </Link>
              </div>
              <p className="text-center text-[11px] text-stone-400">
                Samples shipped in protective crating with technical specification sheets.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
