import React from 'react';

export const TileCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full bg-stone-200"></div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="h-3.5 bg-stone-200 rounded w-20"></div>
            <div className="h-4 bg-stone-200 rounded w-14"></div>
          </div>
          <div className="h-5 bg-stone-200 rounded w-3/4 mb-2"></div>
          <div className="h-3.5 bg-stone-200 rounded w-full mb-1"></div>
          <div className="h-3.5 bg-stone-200 rounded w-2/3"></div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
          <div className="h-3.5 bg-stone-200 rounded w-16"></div>
          <div className="h-8 bg-stone-200 rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  );
};

export const TileGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <TileCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
};
