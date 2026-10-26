import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { ScheduleSection } from './components/ScheduleSection';
import { VenueSection } from './components/VenueSection';
import { GuestbookSection } from './components/GuestbookSection';
import { Footer } from './components/Footer';
import { RsvpModal } from './components/RsvpModal';
import { InviteShareModal } from './components/InviteShareModal';
import { CouplePortalModal } from './components/CouplePortalModal';
import { weddingStorage } from './services/weddingStorage';
import { Guest, WeddingDetails, GuestbookMessage } from './types/wedding';
import { Users, Share2, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [details, setDetails] = useState<WeddingDetails>(weddingStorage.getDetails());
  const [guests, setGuests] = useState<Guest[]>(weddingStorage.getGuests());
  const [guestbook, setGuestbook] = useState<GuestbookMessage[]>(weddingStorage.getGuestbook());

  // URL param parsed guest
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);

  // Modals state
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCouplePortalOpen, setIsCouplePortalOpen] = useState(false);

  // Floating notification / toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // On mount: check URL parameters for guest or rsvp flag
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('guest');
    const codeParam = params.get('code');
    const seatsParam = params.get('seats');
    const rsvpParam = params.get('rsvp');

    if (guestParam || codeParam) {
      const allGuests = weddingStorage.getGuests();
      let found: Guest | undefined;

      if (codeParam) {
        found = allGuests.find((g) => g.inviteCode.toLowerCase() === codeParam.toLowerCase());
      }
      if (!found && guestParam) {
        found = allGuests.find((g) => g.name.toLowerCase() === guestParam.toLowerCase());
      }

      if (found) {
        setCurrentGuest(found);
      } else if (guestParam) {
        // Construct a provisional guest from URL
        const provisional: Guest = {
          id: 'temp-' + Date.now(),
          name: guestParam,
          email: '',
          inviteCode: codeParam || 'WED-' + Math.floor(1000 + Math.random() * 9000),
          allottedSeats: seatsParam ? parseInt(seatsParam) : 2,
          status: 'pending',
        };
        setCurrentGuest(provisional);
      }
    }

    if (rsvpParam === 'true') {
      setIsRsvpOpen(true);
    }
  }, []);

  const handleRsvpSuccess = (savedGuest: Guest) => {
    setCurrentGuest(savedGuest);
    const updated = weddingStorage.getGuests();
    setGuests(updated);
    setGuestbook(weddingStorage.getGuestbook());
    showToast(
      savedGuest.status === 'attending'
        ? `RSVP Confirmed for ${savedGuest.name}! We look forward to seeing you.`
        : `Thank you, ${savedGuest.name}. We received your response.`
    );
  };

  const handleGuestCreated = (newGuest: Guest) => {
    setGuests(weddingStorage.getGuests());
    showToast(`Invitation created for ${newGuest.name} with code ${newGuest.inviteCode}`);
  };

  const pendingCount = guests.filter((g) => g.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2A29] font-sans selection:bg-[#E2D2BE] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#1A1918] text-[#FAF8F5] px-4 py-3 rounded shadow-xl border border-[#D8B77D] text-xs font-medium flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Top Bar */}
      <Navbar
        onOpenRsvp={() => setIsRsvpOpen(true)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onOpenCouplePortal={() => setIsCouplePortalOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Main Wedding Sections */}
      <main>
        <HeroSection
          details={details}
          currentGuest={currentGuest}
          onOpenRsvp={() => setIsRsvpOpen(true)}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
        />

        <StorySection details={details} />

        <ScheduleSection
          details={details}
          onOpenRsvp={() => setIsRsvpOpen(true)}
        />

        <VenueSection details={details} />

        <GuestbookSection
          messages={guestbook}
          onMessageAdded={(newMsgs) => setGuestbook(newMsgs)}
        />
      </main>

      {/* Footer */}
      <Footer
        details={details}
        onOpenCouplePortal={() => setIsCouplePortalOpen(true)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onOpenRsvp={() => setIsRsvpOpen(true)}
      />

      {/* Floating Organizer & Sharing Toolbar for Couple & Guests */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsInviteModalOpen(true)}
          title="Create & Send Online Invitation"
          className="px-3.5 py-2.5 bg-[#FAF8F5] text-[#1A1918] hover:bg-white text-xs font-semibold rounded-full shadow-lg border border-[#D5C7B7] flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[#8C6B45]" />
          <span className="hidden sm:inline">Invite Online</span>
        </button>

        <button
          onClick={() => setIsCouplePortalOpen(true)}
          title="Open Couple Organizer Dashboard"
          className="px-4 py-2.5 bg-[#1A1918] text-white hover:bg-[#2C2A29] text-xs font-semibold rounded-full shadow-lg border border-[#D8B77D]/50 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <Users className="w-4 h-4 text-[#E7CFA3]" />
          <span>Couple Portal</span>
          {pendingCount > 0 && (
            <span className="bg-[#8C6B45] text-[10px] text-white px-1.5 py-0.2 rounded-full font-mono">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Interactive Modals */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        preselectedGuest={currentGuest}
        details={details}
        onRsvpSuccess={handleRsvpSuccess}
      />

      <InviteShareModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        details={details}
        guests={guests}
        onGuestCreated={handleGuestCreated}
      />

      <CouplePortalModal
        isOpen={isCouplePortalOpen}
        onClose={() => setIsCouplePortalOpen(false)}
        guests={guests}
        details={details}
        onGuestsUpdated={(updated) => setGuests(updated)}
        onDetailsUpdated={(updatedDetails) => setDetails(updatedDetails)}
        onInviteGuest={(targetGuest) => {
          setIsCouplePortalOpen(false);
          setIsInviteModalOpen(true);
        }}
      />
    </div>
  );
}
