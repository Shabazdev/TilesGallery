import React from 'react';
import { Sparkles, Compass, ShieldCheck, Gem } from 'lucide-react';

export const Marquee: React.FC = () => {
  const marqueeItems = [
    { text: 'New Arrivals: Azure Mediterranean Ceramic', icon: Sparkles },
    { text: 'Weekly Feature: Calacatta Gold Honed Marble', icon: Gem },
    { text: 'Modern Geometric Patterns & Terrazzo Inlays', icon: Compass },
    { text: 'Join The Designer Community', icon: ShieldCheck },
    { text: 'Sustainable Zero-Emission Porcelain Planks', icon: Sparkles },
    { text: 'Direct Factory Pricing for Interior Architects', icon: Gem },
    { text: 'Complimentary High-Resolution Sample Kits', icon: Compass },
  ];

  return (
    <div className="w-full bg-stone-900 border-y border-stone-800 text-stone-300 py-3.5 overflow-hidden select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* First repetition */}
        <div className="flex items-center gap-8 px-4">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m1-${idx}`} className="flex items-center gap-3 text-sm font-medium tracking-wide">
                <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-200">{item.text}</span>
                <span className="text-stone-600 ml-5 font-light">|</span>
              </div>
            );
          })}
        </div>
        {/* Second repetition for seamless infinite loop */}
        <div className="flex items-center gap-8 px-4" aria-hidden="true">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m2-${idx}`} className="flex items-center gap-3 text-sm font-medium tracking-wide">
                <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-200">{item.text}</span>
                <span className="text-stone-600 ml-5 font-light">|</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
