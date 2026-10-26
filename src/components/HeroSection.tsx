import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Share2, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { WeddingDetails, Guest } from '../types/wedding';
import { weddingStorage } from '../services/weddingStorage';

interface HeroSectionProps {
  details: WeddingDetails;
  currentGuest: Guest | null;
  onOpenRsvp: () => void;
  onOpenInviteModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  details,
  currentGuest,
  onOpenRsvp,
  onOpenInviteModal,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = new Date(details.weddingDate).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [details.weddingDate]);

  return (
    <section id="hero" className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Hero Image with subtle zoom & luxury filmic scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_wedding_couple_1793022882227.jpg"
          alt="Eleanor and Arthur in Tuscany"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.88]"
        />
        {/* Multilayer contrast scrim: soft dark overlay for pristine typographic legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#181512]/60 via-[#181512]/40 to-[#181512]/85" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center text-white flex flex-col items-center">
        {/* Monogram Crest */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#E7CFA3]/70 bg-[#1A1918]/40 backdrop-blur-sm mb-6 text-[#E7CFA3]">
          <span className="font-serif text-2xl sm:text-3xl tracking-widest italic">E &amp; A</span>
        </div>

        {/* Personalized Guest Welcome Banner if loaded via custom link */}
        {currentGuest && (
          <div className="mb-6 max-w-xl mx-auto px-5 py-3 rounded-lg bg-[#FAF8F5]/95 backdrop-blur-md text-[#2C2A29] shadow-xl border border-[#D8B77D] animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6B45]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Wedding Invitation</span>
            </div>
            <p className="font-serif text-lg sm:text-xl text-[#1A1918] mt-0.5">
              Welcome, <span className="font-semibold italic">{currentGuest.name}</span>
            </p>
            <p className="text-xs text-[#5C554E] mt-1">
              We have reserved <span className="font-semibold text-[#8C6B45]">{currentGuest.allottedSeats} {currentGuest.allottedSeats === 1 ? 'seat' : 'seats'}</span> in your honor.
              {currentGuest.status === 'attending' && (
                <span className="ml-2 inline-flex items-center text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> RSVP Confirmed
                </span>
              )}
            </p>
          </div>
        )}

        {/* Invitation Top Kicker */}
        <p className="text-xs sm:text-sm tracking-[0.25em] uppercase font-medium text-[#E7CFA3] mb-3">
          Together With Their Families
        </p>

        {/* Couple Names */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight font-normal text-white max-w-4xl text-balance drop-shadow-md leading-tight">
          {details.partner1} <br className="hidden sm:inline" />
          <span className="text-3xl sm:text-5xl lg:text-6xl italic text-[#F3E5AB] font-serif font-light mx-2">&amp;</span>
          {details.partner2}
        </h1>

        {/* Subtitle / Promise */}
        <p className="mt-4 text-base sm:text-xl text-[#FAF8F5]/90 font-light max-w-2xl font-serif italic text-balance">
          Request the pleasure of your company as we exchange vows and celebrate our marriage
        </p>

        {/* Date and Location clean metadata (No static pills) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base text-[#FAF8F5]/95">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#E7CFA3]" />
            <span className="tracking-wide">{details.displayDate}</span>
          </div>
          <span className="hidden sm:inline text-[#E7CFA3]/60">·</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E7CFA3]" />
            <span className="tracking-wide">{details.ceremonyVenue}</span>
          </div>
        </div>

        {/* Wedding Countdown Timer */}
        <div className="mt-10 sm:mt-12 bg-[#1A1918]/60 backdrop-blur-md border border-[#E7CFA3]/30 rounded-lg px-6 py-5 max-w-xl w-full">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#E7CFA3] text-center mb-3 flex items-center justify-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Counting Down to Forever</span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 rounded bg-black/20">
              <span className="block text-2xl sm:text-4xl font-serif tabular-nums text-white font-medium">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#D5C7B7]">Days</span>
            </div>
            <div className="p-2 sm:p-3 rounded bg-black/20">
              <span className="block text-2xl sm:text-4xl font-serif tabular-nums text-white font-medium">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#D5C7B7]">Hours</span>
            </div>
            <div className="p-2 sm:p-3 rounded bg-black/20">
              <span className="block text-2xl sm:text-4xl font-serif tabular-nums text-white font-medium">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#D5C7B7]">Minutes</span>
            </div>
            <div className="p-2 sm:p-3 rounded bg-black/20">
              <span className="block text-2xl sm:text-4xl font-serif tabular-nums text-white font-medium">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#D5C7B7]">Seconds</span>
            </div>
          </div>
        </div>

        {/* Primary and Secondary CTA Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#1A1918] bg-[#E7CFA3] hover:bg-[#F3E5AB] active:bg-[#D8B77D] transition-all rounded-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Heart className="w-4 h-4 fill-[#1A1918] group-hover:scale-110 transition-transform" />
            <span>Respond to Invitation (RSVP)</span>
          </button>

          <button
            onClick={onOpenInviteModal}
            className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-widest text-white border border-[#E7CFA3]/60 hover:bg-white/10 active:bg-white/20 transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#E7CFA3]" />
            <span>Invite Online / Share Card</span>
          </button>
        </div>

        {/* Calendar Add Shortcut */}
        <div className="mt-4 text-xs text-[#FAF8F5]/80 flex items-center gap-2">
          <span>Reply requested by {details.rsvpDeadline}</span>
          <span>·</span>
          <button
            onClick={() => weddingStorage.generateIcsCalendar()}
            className="underline hover:text-[#E7CFA3] transition-colors cursor-pointer"
          >
            Add to Calendar (.ics)
          </button>
        </div>
      </div>
    </section>
  );
};
