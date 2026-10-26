import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Mail, QrCode, Share2, Sparkles, Send, UserPlus, Heart } from 'lucide-react';
import { Guest, WeddingDetails } from '../types/wedding';
import { weddingStorage } from '../services/weddingStorage';

interface InviteShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: WeddingDetails;
  guests: Guest[];
  onGuestCreated?: (guest: Guest) => void;
}

export const InviteShareModal: React.FC<InviteShareModalProps> = ({
  isOpen,
  onClose,
  details,
  guests,
  onGuestCreated,
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [seats, setSeats] = useState(2);
  const [selectedExistingId, setSelectedExistingId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Selected or newly drafted guest
  const currentGuestInfo = selectedExistingId
    ? guests.find(g => g.id === selectedExistingId)
    : null;

  const effectiveName = currentGuestInfo ? currentGuestInfo.name : (guestName.trim() || 'Honored Guest');
  const effectiveSeats = currentGuestInfo ? currentGuestInfo.allottedSeats : seats;
  const effectiveCode = currentGuestInfo ? currentGuestInfo.inviteCode : 'WED-' + Math.floor(1000 + Math.random() * 9000);

  // Generate URL
  const baseUrl = window.location.origin + window.location.pathname;
  const inviteParams = new URLSearchParams();
  inviteParams.set('guest', effectiveName);
  inviteParams.set('code', effectiveCode);
  if (effectiveSeats > 1) {
    inviteParams.set('seats', effectiveSeats.toString());
  }
  const fullInviteUrl = `${baseUrl}?${inviteParams.toString()}`;

  // WhatsApp Message
  const whatsappMessage = encodeURIComponent(
    `Dear ${effectiveName},\n\nWe are overjoyed to invite you to celebrate our wedding!\n\nEleanor & Arthur\nDate: ${details.displayDate}\nLocation: ${details.ceremonyVenue}, Florence, Italy\n\nPlease view your personalized invitation and RSVP online here:\n${fullInviteUrl}\n\nWith love,\nEleanor & Arthur`
  );

  // Email subject & body
  const emailSubject = encodeURIComponent(`Wedding Invitation: Eleanor Bennett & Arthur James`);
  const emailBody = encodeURIComponent(
    `Dear ${effectiveName},\n\nWith joyful hearts, we invite you to share in our wedding celebration on ${details.displayDate} at ${details.ceremonyVenue} in Florence, Italy.\n\nWe have reserved ${effectiveSeats} ${effectiveSeats === 1 ? 'seat' : 'seats'} in your honor.\n\nPlease visit our online wedding portal to view full event details, schedule, and RSVP:\n${fullInviteUrl}\n\nKindly reply by ${details.rsvpDeadline}.\n\nWarmest regards,\nEleanor & Arthur`
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(fullInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToGuestList = () => {
    if (!guestName.trim()) {
      alert('Please enter the guest name');
      return;
    }
    const newGuest = weddingStorage.addGuest({
      name: guestName.trim(),
      email: guestEmail.trim(),
      inviteCode: effectiveCode,
      allottedSeats: seats,
      status: 'pending',
    });
    if (onGuestCreated) onGuestCreated(newGuest);
    setSelectedExistingId(newGuest.id);
  };

  // Generate SVG QR Code representation
  // We can render a clean responsive QR code using a standard visual pattern
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullInviteUrl)}&bgcolor=FAF8F5&color=1A1918`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-lg shadow-2xl border border-[#D5C7B7] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1A1918] text-white px-6 py-5 flex items-center justify-between border-b border-[#D8B77D]/40">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-[#E7CFA3]" />
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E7CFA3] font-medium block">
                Digital Wedding Invitations
              </span>
              <h2 className="text-xl sm:text-2xl font-serif tracking-normal text-white">
                Invite Online &amp; Send RSVP Links
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Form & Sharing Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1.5">
                Select Existing Guest or Create New
              </label>
              <select
                value={selectedExistingId}
                onChange={(e) => {
                  setSelectedExistingId(e.target.value);
                  if (e.target.value) {
                    const g = guests.find((item) => item.id === e.target.value);
                    if (g) {
                      setGuestName(g.name);
                      setGuestEmail(g.email || '');
                      setSeats(g.allottedSeats || 1);
                    }
                  } else {
                    setGuestName('');
                    setGuestEmail('');
                    setSeats(2);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
              >
                <option value="">+ Create New Guest Invitation</option>
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.allottedSeats} seats · {g.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Input Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                  Guest Name(s) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (selectedExistingId) setSelectedExistingId('');
                  }}
                  placeholder="e.g. Sarah Jenkins or The Sterling Family"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                  Reserved Seats
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={seats}
                  onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                  Guest Email (Optional)
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. sarah.jenkins@example.com"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                />
              </div>
            </div>

            {!selectedExistingId && guestName.trim() && (
              <button
                type="button"
                onClick={handleSaveToGuestList}
                className="w-full py-2 text-xs font-semibold uppercase tracking-wider text-[#8C6B45] border border-[#8C6B45] hover:bg-[#FAF2E6] rounded-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save this Guest to Event Guestbook List</span>
              </button>
            )}

            {/* Generated Link Box */}
            <div className="bg-white p-4 rounded-md border border-[#E0D5C7] space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E]">
                Personalized Invitation Link
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={fullInviteUrl}
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm text-[#5C554E] select-all font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#8C6B45] text-white hover:bg-[#745533] rounded-sm cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#7A7269]">
                When your guest opens this link, their name is pre-loaded and ready for immediate RSVP!
              </p>
            </div>

            {/* Send Options (WhatsApp, Email, QR) */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E]">
                One-Click Invitation Channels
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-sm bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${guestEmail}?subject=${emailSubject}&body=${emailBody}`}
                  className="px-3 py-2.5 rounded-sm bg-[#0284C7]/10 text-[#0369A1] hover:bg-[#0284C7]/20 border border-[#0284C7]/30 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className="px-3 py-2.5 rounded-sm bg-[#5C554E]/10 text-[#2C2A29] hover:bg-[#5C554E]/20 border border-[#5C554E]/30 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
                </button>
              </div>
            </div>

            {showQr && (
              <div className="p-4 bg-white rounded-md border border-[#D5C7B7] text-center space-y-2">
                <p className="text-xs font-medium text-[#5C554E]">Scan with phone camera to RSVP:</p>
                <div className="inline-block p-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <img
                    src={qrSvgUrl}
                    alt="RSVP QR Code"
                    className="w-40 h-40 mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[11px] font-mono text-[#7A7269]">Code: {effectiveCode}</p>
              </div>
            )}
          </div>

          {/* Right Column: Digital Stationery Live Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#8C6B45] mb-3 text-center">
              Live Digital Stationery Preview
            </span>

            {/* Bespoke Invitation Card */}
            <div className="w-full bg-[#FAF8F5] p-6 sm:p-7 rounded shadow-lg border-2 border-[#D8B77D] text-center relative overflow-hidden deckle-card">
              {/* Gold botanical filigree top */}
              <div className="w-8 h-8 rounded-full border border-[#D8B77D] mx-auto flex items-center justify-center text-[#8C6B45] mb-4">
                <Heart className="w-4 h-4 fill-[#D8B77D]" />
              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#8C6B45] font-semibold">
                Together With Their Families
              </p>

              <h4 className="font-serif text-2xl sm:text-3xl text-[#1A1918] mt-2 leading-tight">
                Eleanor <br />
                <span className="text-xl italic font-serif text-[#8C6B45]">&amp;</span> <br />
                Arthur
              </h4>

              <div className="w-16 h-px bg-[#D8B77D] mx-auto my-3" />

              <p className="text-[10px] text-[#5C554E] italic font-serif">
                request the honor of the presence of
              </p>

              {/* Personalized Name highlight */}
              <div className="my-2 py-1 px-2 border-b border-[#D8B77D]/60 inline-block">
                <p className="font-serif text-base sm:text-lg font-bold text-[#1A1918] italic">
                  {effectiveName}
                </p>
              </div>

              <p className="text-[10px] uppercase tracking-wider text-[#8C6B45] font-medium">
                ({effectiveSeats} {effectiveSeats === 1 ? 'seat reserved' : 'seats reserved'})
              </p>

              <div className="mt-4 pt-3 border-t border-[#E8E2D9] text-[11px] text-[#2C2A29] space-y-1 font-serif">
                <p className="font-semibold">{details.displayDate}</p>
                <p className="text-[#5C554E]">{details.ceremonyVenue}</p>
                <p className="text-[#5C554E] italic">Florence, Italy</p>
              </div>

              {/* Wax Seal Stamp Graphic */}
              <div className="mt-4 pt-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#344E41] text-[#E7CFA3] border border-[#283618] shadow-md">
                  <span className="text-[10px] font-serif font-bold tracking-widest">E&amp;A</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#7A7269] text-center mt-3">
              This card is presented to guests when opening their personalized link.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F2ECE4] border-t border-[#E0D5C7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1A1918] text-white hover:bg-black rounded-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
