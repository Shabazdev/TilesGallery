import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { Marquee } from '../components/Marquee';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { FeaturedTiles } from '../components/FeaturedTiles';
import { Tile } from '../types';
import { fetchTiles } from '../lib/api';
import { ShieldCheck, Compass, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [allTiles, setAllTiles] = useState<Tile[]>([]);

  useEffect(() => {
    fetchTiles().then(setAllTiles).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero / Banner */}
      <Hero />

      {/* 2. Marquee */}
      <Marquee />

      {/* 3. SwiperJS Featured Collection Carousel */}
      <FeaturedCarousel tiles={allTiles} />

      {/* 4. Top 4 Featured Tiles */}
      <FeaturedTiles />

      {/* 5. Architectural Surface Philosophy & Excellence */}
      <section className="py-20 bg-stone-900 text-stone-100 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-400">
              The Tiles Gallery Standard
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold mt-2 text-stone-100">
              Surfaces Crafted for Architectural Permanence
            </h2>
            <p className="mt-4 text-stone-400 text-base leading-relaxed">
              Every tile in our repository undergoes stringent testing for porosity, dimensional precision, slip resistance, and tonal fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-stone-950/80 border border-stone-800/80 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-100 mb-3">
                Artisan Hand-Glazes
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Formulated using traditional mineral oxides fired at 1,250°C, producing organic color depth that cannot be replicated by synthetic laminates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-950/80 border border-stone-800/80 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-100 mb-3">
                Zero Water Absorption
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Our vitrified porcelain and high-density quartz formulations boast absorption rates under 0.05%, ensuring mold-free indoor and outdoor durability.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-950/80 border border-stone-800/80 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-100 mb-3">
                Direct Specifier Fulfillment
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Direct quarry allocations and crated shipments ensure zero transit breakage and rapid fulfillment for residential and commercial builds.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-100">
                Ready to transform your next space?
              </h3>
              <p className="text-stone-400 text-sm max-w-lg">
                Explore our full gallery of 12 luxury tile collections, filter by material, and view high-resolution specifications.
              </p>
            </div>
            <Link
              to="/all-tiles"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all text-base shrink-0"
            >
              <span>Explore All Tiles</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
