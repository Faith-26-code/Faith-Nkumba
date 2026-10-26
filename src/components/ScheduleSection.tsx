import React from 'react';
import { Clock, MapPin, Sparkles, Heart } from 'lucide-react';
import { DEFAULT_SCHEDULE } from '../services/weddingStorage';
import { WeddingDetails } from '../types/wedding';

interface ScheduleSectionProps {
  details: WeddingDetails;
  onOpenRsvp: () => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ details, onOpenRsvp }) => {
  return (
    <section id="schedule" className="py-24 sm:py-32 bg-[#F5F0E8] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6B45]">
            Order of Events
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1A1918] mt-2 tracking-tight">
            The Wedding Day
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5C554E] font-serif italic">
            {details.displayDate} · Florence, Italy
          </p>
          <div className="w-16 h-px bg-[#D8B77D] mx-auto mt-4" />
        </div>

        {/* Timeline Sequence */}
        <div className="relative border-l border-[#D5C7B7] ml-4 sm:ml-32 md:ml-40 space-y-12">
          {DEFAULT_SCHEDULE.map((item, index) => (
            <div key={item.id} className="relative pl-8 sm:pl-10 group">
              {/* Timeline Gold Dot Marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#FAF8F5] border-2 border-[#8C6B45] group-hover:bg-[#8C6B45] transition-colors flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8C6B45] group-hover:bg-white" />
              </div>

              {/* Time pill on desktop floating to left */}
              <div className="sm:absolute sm:-left-36 md:-left-44 sm:top-1 sm:text-right">
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#8C6B45] font-mono">
                  {item.time}
                </span>
              </div>

              {/* Content Card */}
              <div className="bg-white p-6 sm:p-7 rounded-md border border-[#E0D5C7] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-xs text-[#7A7269] mb-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6B45]" />
                  <span>{item.location}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#1A1918] font-medium">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#5C554E] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dress code & RSVP callout */}
        <div className="mt-16 bg-[#FAF8F5] p-8 rounded-lg border border-[#D8B77D]/70 text-center max-w-2xl mx-auto shadow-sm">
          <span className="text-xs uppercase tracking-widest text-[#8C6B45] font-semibold block mb-1">
            Attire &amp; Dress Code
          </span>
          <h4 className="text-2xl font-serif text-[#1A1918]">{details.dressCode}</h4>
          <p className="text-xs sm:text-sm text-[#5C554E] mt-2 leading-relaxed">
            {details.dressCodeDetails}
          </p>

          <div className="mt-6 pt-4 border-t border-[#E8E2D9]">
            <button
              onClick={onOpenRsvp}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#8C6B45] hover:bg-[#745533] rounded-sm cursor-pointer shadow transition-all"
            >
              Confirm Your Attendance
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
