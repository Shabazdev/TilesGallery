import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Tile } from '../types';
import { ArrowRight, Sparkles, Compass, Eye } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FeaturedCarouselProps {
  tiles: Tile[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ tiles }) => {
  // We can take up to 6 tiles for the hero carousel
  const carouselTiles = tiles.slice(0, 6);

  if (carouselTiles.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Ambient gradient */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Highlights</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-100">
              Featured Collection Carousel
            </h2>
            <p className="mt-2 text-stone-400 text-sm sm:text-base max-w-xl">
              Immerse yourself in our premier architectural finishes, selected for their extraordinary veining, durability, and craftsmanship.
            </p>
          </div>

          <Link
            to="/all-tiles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Swiper Container */}
        <div className="relative pb-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full rounded-2xl"
          >
            {carouselTiles.map((tile) => (
              <SwiperSlide key={tile.id} className="h-auto">
                <div className="group flex flex-col h-full bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/60 shadow-lg transition-all duration-300">
                  {/* Image Presentation */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-800">
                    <img
                      src={tile.image}
                      alt={tile.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-stone-900/90 backdrop-blur-md text-amber-300 border border-stone-700">
                      {tile.category}
                    </span>

                    <span className="absolute bottom-3 right-3 text-xs font-bold text-stone-100 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-700">
                      ${tile.price.toFixed(2)} / m²
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium mb-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>{tile.style}</span>
                      </div>

                      <h3 className="font-serif-luxury text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                        {tile.title}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm text-stone-400 line-clamp-2 leading-relaxed">
                        {tile.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tile.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-900 text-stone-300 border border-stone-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs text-stone-400 font-mono">
                        {tile.dimensions}
                      </span>
                      <Link
                        to={`/tile/${tile.id}`}
                        id={`swiper-tile-btn-${tile.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 py-2 px-3.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Surface</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
