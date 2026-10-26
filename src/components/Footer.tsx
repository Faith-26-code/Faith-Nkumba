import React from 'react';
import { Heart, Lock, Users, Share2, Calendar } from 'lucide-react';
import { WeddingDetails } from '../types/wedding';
import { weddingStorage } from '../services/weddingStorage';

interface FooterProps {
  details: WeddingDetails;
  onOpenCouplePortal: () => void;
  onOpenInviteModal: () => void;
  onOpenRsvp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  details,
  onOpenCouplePortal,
  onOpenInviteModal,
  onOpenRsvp,
}) => {
  return (
    <footer className="bg-[#1A1918] text-[#FAF8F5] pt-20 pb-12 border-t border-[#D8B77D]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Monogram */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D8B77D]/60 text-[#D8B77D] mb-6">
          <span className="font-serif text-lg italic">E &amp; A</span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-serif text-white tracking-normal">
          {details.partner1} &amp; {details.partner2}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-[#D5C7B7] font-serif italic tracking-wide">
          {details.displayDate} · Florence, Italy
        </p>

        {/* Quick Nav Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-[#D5C7B7]">
          <a href="#hero" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="#story" className="hover:text-white transition-colors">
            Our Story
          </a>
          <a href="#schedule" className="hover:text-white transition-colors">
            Schedule
          </a>
          <a href="#venue" className="hover:text-white transition-colors">
            Venue &amp; Travel
          </a>
          <a href="#guestbook" className="hover:text-white transition-colors">
            Guestbook
          </a>
          <button
            onClick={onOpenRsvp}
            className="hover:text-[#E7CFA3] transition-colors cursor-pointer"
          >
            RSVP
          </button>
        </div>

        {/* Action Shortcuts Strip */}
        <div className="mt-10 py-6 border-y border-white/10 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={onOpenInviteModal}
            className="px-4 py-2 rounded border border-[#D8B77D]/60 text-[#E7CFA3] hover:bg-[#D8B77D]/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Generate Guest Invitation</span>
          </button>

          <button
            onClick={() => weddingStorage.generateIcsCalendar()}
            className="px-4 py-2 rounded border border-white/20 text-[#D5C7B7] hover:text-white hover:border-white/40 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Download .ics Calendar</span>
          </button>

          <button
            onClick={onOpenCouplePortal}
            className="px-4 py-2 rounded border border-white/20 text-[#D5C7B7] hover:text-white hover:border-white/40 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Couple Organizer Portal</span>
          </button>
        </div>

        {/* Quiet Copyright */}
        <div className="mt-10 text-[11px] text-[#A59D94] flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>With love &amp; gratitude</span>
          <span className="hidden sm:inline">·</span>
          <span>© {new Date().getFullYear()} Eleanor &amp; Arthur Wedding</span>
        </div>
      </div>
    </footer>
  );
};
