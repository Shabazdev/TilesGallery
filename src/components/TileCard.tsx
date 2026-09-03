import React from 'react';
import { Link } from 'react-router-dom';
import { Tile } from '../types';
import { ArrowRight, Layers, CheckCircle2, Clock } from 'lucide-react';

interface TileCardProps {
  tile: Tile;
}

export const TileCard: React.FC<TileCardProps> = ({ tile }) => {
  return (
    <div
      id={`tile-card-${tile.id}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/60 transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={tile.image}
          alt={tile.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-stone-900/80 backdrop-blur-md text-amber-300 border border-stone-800 shadow-sm">
            {tile.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {tile.inStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
              <Clock className="w-3 h-3" />
              Pre-order
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-stone-400" />
            {tile.material}
          </span>
          <span className="text-base font-bold text-stone-900 font-sans">
            ${tile.price.toFixed(2)}
            <span className="text-xs font-normal text-stone-500"> / m²</span>
          </span>
        </div>

        <h3 className="font-serif-luxury text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
          {tile.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed flex-1">
          {tile.description}
        </p>

        {/* Footer info and Details CTA */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <span className="text-xs text-stone-500 font-medium">
            {tile.dimensions}
          </span>

          <Link
            to={`/tile/${tile.id}`}
            id={`tile-details-link-${tile.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-amber-700 bg-stone-100 hover:bg-amber-100/70 py-2 px-3.5 rounded-lg transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
