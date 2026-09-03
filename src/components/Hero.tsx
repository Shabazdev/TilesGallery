import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, Award, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100 pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Subtle architectural grid backdrop */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Ambient warm lighting glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-amber-400 text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>The Premier Architectural Surface Exhibition</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.12]">
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
                Perfect Aesthetic
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-2xl font-normal leading-relaxed">
              Step inside Tiles Gallery — an uncompromising catalog of handcrafted ceramics, honed Italian marbles, tactile mosaics, and large-format porcelain slabs designed to elevate modern living spaces.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/all-tiles"
                id="hero-browse-now-btn"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-amber-950/40 hover:shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all duration-150 text-base"
              >
                <span>Browse Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#featured-section"
                className="inline-flex items-center justify-center gap-2 bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-stone-600 font-medium px-6 py-3.5 rounded-xl transition-all duration-150 text-base"
              >
                <span>View Featured</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 max-w-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-100 font-semibold text-lg sm:text-xl font-serif-luxury">
                  <span>500+</span>
                </div>
                <div className="text-xs text-stone-400">Curated Textures</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-100 font-semibold text-lg sm:text-xl font-serif-luxury">
                  <span>100%</span>
                </div>
                <div className="text-xs text-stone-400">Authentic Slabs</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-100 font-semibold text-lg sm:text-xl font-serif-luxury">
                  <span>24h</span>
                </div>
                <div className="text-xs text-stone-400">Sample Dispatch</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition with floating cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main spotlight tile display */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-900 group">
                <div className="aspect-[4/5] sm:aspect-square relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85"
                    alt="Calacatta Gold Italian Marble Showcase"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-stone-950/70 backdrop-blur-md text-amber-300 border border-stone-800">
                      Signature Marble
                    </span>
                  </div>

                  {/* Tile details pill overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-800 text-stone-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-serif-luxury text-lg font-bold text-stone-100">
                          Calacatta Gold
                        </h2>
                        <p className="text-xs text-stone-400">Honed Italian Slabs • 80x80 cm</p>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-400 font-semibold text-base">$128.50</span>
                        <span className="block text-[10px] text-stone-400">per sq meter</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating decorative badge 1 */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-stone-900/95 backdrop-blur-md border border-stone-700/80 rounded-xl p-3 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-stone-100">Best In Class</p>
                  <p className="text-[10px] text-stone-400">2026 Surface Design Award</p>
                </div>
              </div>

              {/* Floating decorative badge 2 */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-stone-900/95 backdrop-blur-md border border-stone-700/80 rounded-xl p-3 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-stone-100">Grade AAA Verified</p>
                  <p className="text-[10px] text-stone-400">Zero Water Absorption</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
