"use client";

import React from 'react';

const REVIEWS = [
  {
    name: "Amelia Park",
    role: "Travel Enthusiast",
    body: "This is the testimonial we feature everywhere. It captures why travelers choose us.",
    platform: "TripAdvisor",
  },
  {
    name: "James Okonkwo",
    role: "Photographer",
    body: "The team adopted our custom itinerary overnight. Documentation and guides are first-class.",
    platform: "Google Reviews",
  },
  {
    name: "Elena Ruiz",
    role: "Digital Nomad",
    body: "Performance and aesthetics without compromise. Exactly what we needed for the trip.",
    platform: "Facebook",
  },
  {
    name: "Daniel Frost",
    role: "Food Blogger",
    body: "The culinary tour was unreal. We went from street food to fine dining without friction.",
    platform: "Yelp",
  },
  {
    name: "Sarah Webb",
    role: "Solo Traveler",
    body: "An experience that feels perfectly tailored. The itinerary was shipped in record time.",
    platform: "TripAdvisor",
  },
  {
    name: "Michael Chen",
    role: "History Buff",
    body: "The cultural insights were deep and fascinating. Highly recommend the ancient cities tour.",
    platform: "Google Reviews",
  }
];

const ReviewCard = ({ name, role, body, platform }: any) => {
  return (
    <div className="w-[350px] sm:w-[400px] shrink-0 p-6 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] transition-colors border border-white/5 flex flex-col justify-between gap-6 mr-4 shadow-xl">
      <div>
        <div className="text-sm font-bold text-emerald-500 mb-4">{platform}</div>
        <p className="text-sm text-zinc-300 leading-relaxed font-medium">
          "{body}"
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/10 shadow-inner">
          {name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{name}</span>
          <span className="text-xs text-zinc-500">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  // Duplicate arrays to create the infinite scroll illusion seamlessly
  const row1 = [...REVIEWS, ...REVIEWS, ...REVIEWS];
  const row2 = [...REVIEWS.reverse(), ...REVIEWS.reverse(), ...REVIEWS.reverse()];

  return (
    <section className="py-24 bg-black overflow-hidden relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Trusted in real travels, not just brochures.
        </h2>
        <p className="text-zinc-400">
          Real stories from people who explored Sri Lanka with the same passion we have.
        </p>
      </div>

      <div className="relative flex flex-col gap-4 pause-on-hover mt-10">
        {/* Left and Right fades for seamless look */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Row 1: Marquee Left */}
        <div className="flex w-max animate-marquee-left">
          {row1.map((review, i) => (
            <ReviewCard key={`r1-${i}`} {...review} />
          ))}
        </div>

        {/* Row 2: Marquee Right */}
        <div className="flex w-max animate-marquee-right">
          {row2.map((review, i) => (
            <ReviewCard key={`r2-${i}`} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}
