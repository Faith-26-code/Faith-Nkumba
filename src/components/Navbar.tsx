import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Users, Share2 } from 'lucide-react';

interface NavbarProps {
  onOpenRsvp: () => void;
  onOpenInviteModal: () => void;
  onOpenCouplePortal: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRsvp,
  onOpenInviteModal,
  onOpenCouplePortal,
  pendingCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D9] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar Contract: 3 zones, gap-8 */}
          <div className="flex items-center justify-between gap-8">
            {/* Zone 1: Brand Title, one element */}
            <a
              href="#hero"
              className={`text-2xl sm:text-3xl font-serif tracking-normal whitespace-nowrap shrink-0 transition-colors ${
                isScrolled ? 'text-[#2C2A29]' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
              }`}
            >
              Eleanor &amp; Arthur
            </a>

            {/* Zone 2: Nav links, 1-2 word labels, single-line */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
              <a
                href="#story"
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  isScrolled
                    ? 'text-[#5C554E] hover:text-[#1A1918]'
                    : 'text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                Our Story
              </a>
              <a
                href="#schedule"
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  isScrolled
                    ? 'text-[#5C554E] hover:text-[#1A1918]'
                    : 'text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                Schedule
              </a>
              <a
                href="#venue"
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  isScrolled
                    ? 'text-[#5C554E] hover:text-[#1A1918]'
                    : 'text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                Details
              </a>
              <a
                href="#guestbook"
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  isScrolled
                    ? 'text-[#5C554E] hover:text-[#1A1918]'
                    : 'text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                Guestbook
              </a>
            </nav>

            {/* Zone 3: 1 Primary Action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenRsvp}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] bg-[#8C6B45] hover:bg-[#745533] active:bg-[#5E4427] transition-all rounded-sm shadow-md whitespace-nowrap shrink-0 cursor-pointer"
              >
                RSVP Now
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-sm cursor-pointer ${
                  isScrolled ? 'text-[#2C2A29]' : 'text-white'
                }`}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col px-6 py-6 md:hidden">
          <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D9]">
            <span className="text-2xl font-serif text-[#2C2A29]">Eleanor &amp; Arthur</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#5C554E] hover:text-[#1A1918]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 py-8 text-lg font-serif">
            <a
              href="#story"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#2C2A29] hover:text-[#8C6B45]"
            >
              Our Story
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#2C2A29] hover:text-[#8C6B45]"
            >
              Wedding Schedule
            </a>
            <a
              href="#venue"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#2C2A29] hover:text-[#8C6B45]"
            >
              Venue &amp; Travel
            </a>
            <a
              href="#guestbook"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#2C2A29] hover:text-[#8C6B45]"
            >
              Guestbook &amp; Wishes
            </a>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-[#E8E2D9]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRsvp();
              }}
              className="w-full py-3 text-sm font-semibold uppercase tracking-wider text-white bg-[#8C6B45] hover:bg-[#745533] rounded-sm text-center"
            >
              RSVP Now
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInviteModal();
                }}
                className="py-2.5 px-3 text-xs font-medium border border-[#D5C7B7] text-[#5C554E] hover:bg-[#F2ECE4] rounded-sm flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Invite Guests</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCouplePortal();
                }}
                className="py-2.5 px-3 text-xs font-medium border border-[#D5C7B7] text-[#5C554E] hover:bg-[#F2ECE4] rounded-sm flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Guest List ({pendingCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
