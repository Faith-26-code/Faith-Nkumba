import React from 'react';
import { WeddingDetails } from '../types/wedding';

interface StorySectionProps {
  details: WeddingDetails;
}

export const StorySection: React.FC<StorySectionProps> = ({ details }) => {
  return (
    <section id="story" className="py-24 sm:py-32 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6B45]">
            Chapter One
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1A1918] mt-2 tracking-tight">
            Our Love Story
          </h2>
          <div className="w-16 h-px bg-[#D8B77D] mx-auto mt-4" />
        </div>

        {/* 2-Column Split: Editorial Photo + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Romantic Heirloom Stationery & Rings Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative offset border */}
              <div className="absolute -inset-3 border border-[#D8B77D]/50 rounded-sm -rotate-1 hidden sm:block" />
              <div className="relative overflow-hidden rounded-sm shadow-xl bg-white p-2">
                <img
                  src="/src/assets/images/wedding_rings_invitation_1793022884369.jpg"
                  alt="Wedding rings and bespoke letterpress stationery"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover aspect-square rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Right: Story Prose */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1918] italic font-normal">
              "{details.storyTitle}"
            </h3>

            <p className="text-base sm:text-lg text-[#5C554E] leading-relaxed font-light">
              {details.storyText1}
            </p>

            <p className="text-base sm:text-lg text-[#5C554E] leading-relaxed font-light">
              {details.storyText2}
            </p>

            {/* Romance Milestone Badges (clean unboxed text with separators) */}
            <div className="pt-6 border-t border-[#E8E2D9] grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#8C6B45] tabular-nums">
                  2020
                </span>
                <span className="text-xs uppercase tracking-wider text-[#7A7269]">First Encounter</span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#8C6B45] tabular-nums">
                  2025
                </span>
                <span className="text-xs uppercase tracking-wider text-[#7A7269]">The Proposal</span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#8C6B45] tabular-nums">
                  2026
                </span>
                <span className="text-xs uppercase tracking-wider text-[#7A7269]">The Vows</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
