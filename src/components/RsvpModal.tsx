import React, { useState, useEffect } from 'react';
import { X, Check, Heart, Sparkles, AlertCircle, Utensils, Music, Bus, Calendar, Download, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Guest, MealOption, WeddingDetails } from '../types/wedding';
import { weddingStorage } from '../services/weddingStorage';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedGuest: Guest | null;
  details: WeddingDetails;
  onRsvpSuccess: (updatedGuest: Guest) => void;
}

const MEAL_OPTIONS: { id: MealOption; title: string; description: string; tags: string }[] = [
  {
    id: 'Herb-Crusted Filet Mignon',
    title: 'Herb-Crusted Filet Mignon',
    description: 'Chianti Classico reduction, rosemary roasted heirloom potatoes, charred asparagus.',
    tags: 'Gluten-Free',
  },
  {
    id: 'Pan-Seared Mediterranean Sea Bass',
    title: 'Mediterranean Sea Bass',
    description: 'Saffron-infused fennel puree, blistered datterini tomatoes, citrus salsa verde.',
    tags: 'Pescatarian · Gluten-Free',
  },
  {
    id: 'Truffle & Wild Mushroom Risotto (V/GF)',
    title: 'Truffle & Forest Mushroom Risotto',
    description: 'Acquerello carnaroli rice, foraged Tuscan porcini, shaved black summer truffle, 24-month parmigiano.',
    tags: 'Vegetarian · Gluten-Free',
  },
];

export const RsvpModal: React.FC<RsvpModalProps> = ({
  isOpen,
  onClose,
  preselectedGuest,
  details,
  onRsvpSuccess,
}) => {
  // Search / Lookup state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(preselectedGuest);
  const [lookupError, setLookupError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [attendingCount, setAttendingCount] = useState<number>(1);
  const [allottedSeats, setAllottedSeats] = useState<number>(2);
  const [mealChoice, setMealChoice] = useState<MealOption>('Herb-Crusted Filet Mignon');
  const [dietary, setDietary] = useState('');
  
  // Plus one
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [plusOneMealChoice, setPlusOneMealChoice] = useState<MealOption>('Pan-Seared Mediterranean Sea Bass');
  const [plusOneDietary, setPlusOneDietary] = useState('');

  // Additional details
  const [needsShuttle, setNeedsShuttle] = useState(false);
  const [songRequest, setSongRequest] = useState('');
  const [personalNote, setPersonalNote] = useState('');

  // Submission result state
  const [submittedGuest, setSubmittedGuest] = useState<Guest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedGuest) {
      applyGuestData(preselectedGuest);
    }
  }, [preselectedGuest]);

  const applyGuestData = (guest: Guest) => {
    setSelectedGuest(guest);
    setName(guest.name);
    setEmail(guest.email || '');
    setPhone(guest.phone || '');
    setStatus(guest.status === 'declined' ? 'declined' : 'attending');
    setAllottedSeats(guest.allottedSeats || 2);
    setAttendingCount(guest.attendingCount || (guest.status === 'attending' ? (guest.hasPlusOne ? 2 : 1) : 1));
    if (guest.mealChoice) setMealChoice(guest.mealChoice as MealOption);
    if (guest.dietaryRestrictions) setDietary(guest.dietaryRestrictions);
    
    setHasPlusOne(guest.hasPlusOne || (guest.allottedSeats > 1 && !!guest.plusOneName));
    if (guest.plusOneName) setPlusOneName(guest.plusOneName);
    if (guest.plusOneMealChoice) setPlusOneMealChoice(guest.plusOneMealChoice as MealOption);
    if (guest.plusOneDietary) setPlusOneDietary(guest.plusOneDietary);

    if (guest.needsShuttle !== undefined) setNeedsShuttle(guest.needsShuttle);
    if (guest.songRequest) setSongRequest(guest.songRequest);
    if (guest.personalNote) setPersonalNote(guest.personalNote);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    if (!searchQuery.trim()) {
      setLookupError('Please enter your full name or invite code.');
      return;
    }

    const found = weddingStorage.findGuest(searchQuery);
    if (found) {
      applyGuestData(found);
    } else {
      // Allow them to continue as a new guest
      setName(searchQuery.trim());
      setSelectedGuest(null);
      setAllottedSeats(2);
      setAttendingCount(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = weddingStorage.submitRsvp({
        id: selectedGuest?.id,
        inviteCode: selectedGuest?.inviteCode,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        allottedSeats: selectedGuest?.allottedSeats || allottedSeats,
        attendingCount: status === 'attending' ? (hasPlusOne ? 2 : 1) : 0,
        mealChoice: status === 'attending' ? mealChoice : undefined,
        dietaryRestrictions: status === 'attending' ? dietary : undefined,
        hasPlusOne: status === 'attending' && hasPlusOne,
        plusOneName: status === 'attending' && hasPlusOne ? plusOneName.trim() : undefined,
        plusOneMealChoice: status === 'attending' && hasPlusOne ? plusOneMealChoice : undefined,
        plusOneDietary: status === 'attending' && hasPlusOne ? plusOneDietary.trim() : undefined,
        needsShuttle: status === 'attending' ? needsShuttle : false,
        songRequest: songRequest.trim(),
        personalNote: personalNote.trim(),
      });

      setSubmittedGuest(saved);
      onRsvpSuccess(saved);

      if (status === 'attending') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FAF8F5', '#8C6B45', '#5F7161', '#E7CFA3'],
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-lg shadow-2xl border border-[#D5C7B7] overflow-hidden my-8">
        {/* Header Ribbon */}
        <div className="bg-[#1A1918] text-white px-6 py-5 flex items-center justify-between border-b border-[#D8B77D]/40">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#E7CFA3] font-medium block">
              Wedding of Eleanor &amp; Arthur
            </span>
            <h2 className="text-xl sm:text-2xl font-serif tracking-normal text-white">
              Online RSVP &amp; Guest Response
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submittedGuest ? (
            /* Confirmation Pass View */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#EBF2EB] text-[#2D5A27] mx-auto flex items-center justify-center border border-[#A7CCA3]">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#8C6B45] font-semibold">
                  Response Recorded
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#1A1918] mt-1">
                  {submittedGuest.status === 'attending'
                    ? 'We Cannot Wait to Celebrate With You!'
                    : 'Thank You for Letting Us Know'}
                </h3>
                <p className="text-sm text-[#5C554E] max-w-md mx-auto mt-2">
                  {submittedGuest.status === 'attending'
                    ? `A confirmation pass has been issued for ${submittedGuest.name}. See you on ${details.displayDate} in Florence!`
                    : `We will truly miss having you there, ${submittedGuest.name}. Thank you for your warm thoughts and wishes.`}
                </p>
              </div>

              {/* Digital Pass Card */}
              {submittedGuest.status === 'attending' && (
                <div className="bg-white rounded-lg p-6 border-2 border-dashed border-[#D8B77D] text-left shadow-sm max-w-md mx-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#8C6B45] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl">
                    Admit {submittedGuest.hasPlusOne ? '2' : '1'}
                  </div>

                  <div className="border-b border-[#E8E2D9] pb-4 mb-4">
                    <p className="text-xs text-[#8C6B45] uppercase tracking-wider font-semibold">
                      Eleanor &amp; Arthur’s Wedding
                    </p>
                    <p className="text-xl font-serif font-bold text-[#1A1918] mt-0.5">
                      {submittedGuest.name}
                    </p>
                    {submittedGuest.hasPlusOne && submittedGuest.plusOneName && (
                      <p className="text-xs text-[#5C554E] italic mt-0.5">
                        &amp; {submittedGuest.plusOneName} (Guest)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-[#2C2A29]">
                    <div className="flex justify-between">
                      <span className="text-[#7A7269]">Date:</span>
                      <span className="font-medium">{details.displayDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A7269]">Ceremony:</span>
                      <span className="font-medium">{details.ceremonyTime} · {details.ceremonyVenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A7269]">Selected Entree:</span>
                      <span className="font-medium text-right max-w-[200px] truncate">{submittedGuest.mealChoice}</span>
                    </div>
                    {submittedGuest.needsShuttle && (
                      <div className="flex justify-between">
                        <span className="text-[#7A7269]">Shuttle Transfer:</span>
                        <span className="font-medium text-emerald-700">Reserved (Florence ⇄ Villa)</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#7A7269]">Invite Reference:</span>
                      <span className="font-mono font-semibold">{submittedGuest.inviteCode}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => weddingStorage.generateIcsCalendar()}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1A1918] bg-[#E7CFA3] hover:bg-[#F3E5AB] rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Save to Calendar (.ics)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedGuest(null);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5C554E] hover:text-[#1A1918] border border-[#D5C7B7] hover:bg-white rounded-sm cursor-pointer"
                >
                  Return to Wedding Page
                </button>
              </div>
            </div>
          ) : (
            /* RSVP Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Lookup helper banner if no preselected guest */}
              {!selectedGuest && (
                <div className="p-4 rounded-md bg-[#F2ECE4] border border-[#E0D5C7]">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1.5">
                    Find Your Invitation (Search by name or invite code)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Sarah Jenkins or WED-7291"
                      className="flex-1 px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                    />
                    <button
                      type="button"
                      onClick={handleLookup}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#8C6B45] text-white hover:bg-[#745533] rounded-sm cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                  {lookupError && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {lookupError}
                    </p>
                  )}
                  <p className="text-[11px] text-[#7A7269] mt-1.5">
                    Tip: If you do not have an invite code, simply fill out the form below directly!
                  </p>
                </div>
              )}

              {selectedGuest && (
                <div className="flex items-center justify-between p-3.5 rounded bg-[#FAF2E6] border border-[#E3D1BA]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C6B45]">
                      Invitation Found
                    </span>
                    <p className="text-sm font-semibold text-[#1A1918]">{selectedGuest.name}</p>
                    <p className="text-xs text-[#5C554E]">
                      Code: {selectedGuest.inviteCode} · {selectedGuest.allottedSeats} seats reserved
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGuest(null);
                      setName('');
                    }}
                    className="text-xs text-[#8C6B45] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Change
                  </button>
                </div>
              )}

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First and Last Name"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                  />
                </div>
              </div>

              {/* Attendance Choice Buttons (Segmented control) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-2">
                  Will You Be Attending? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('attending')}
                    className={`p-4 rounded-md border text-left transition-all cursor-pointer flex items-center justify-between ${
                      status === 'attending'
                        ? 'border-[#8C6B45] bg-[#FAF2E6] ring-1 ring-[#8C6B45]'
                        : 'border-[#D5C7B7] bg-white hover:border-[#8C6B45]/50'
                    }`}
                  >
                    <div>
                      <span className="font-serif text-lg font-bold text-[#1A1918] block">
                        Joyfully Accepts
                      </span>
                      <span className="text-xs text-[#5C554E]">
                        I will be there to celebrate with you!
                      </span>
                    </div>
                    {status === 'attending' && (
                      <div className="w-5 h-5 rounded-full bg-[#8C6B45] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('declined')}
                    className={`p-4 rounded-md border text-left transition-all cursor-pointer flex items-center justify-between ${
                      status === 'declined'
                        ? 'border-[#8C6B45] bg-[#FAF2E6] ring-1 ring-[#8C6B45]'
                        : 'border-[#D5C7B7] bg-white hover:border-[#8C6B45]/50'
                    }`}
                  >
                    <div>
                      <span className="font-serif text-lg font-bold text-[#1A1918] block">
                        Regretfully Declines
                      </span>
                      <span className="text-xs text-[#5C554E]">
                        Celebrating with you from afar
                      </span>
                    </div>
                    {status === 'declined' && (
                      <div className="w-5 h-5 rounded-full bg-[#8C6B45] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Attending Specific Fields */}
              {status === 'attending' && (
                <div className="space-y-6 pt-2 border-t border-[#E8E2D9]">
                  {/* Plus One Toggle */}
                  <div className="bg-white p-4 rounded-md border border-[#E0D5C7]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-[#1A1918] block">
                          Bringing a Guest / Plus-One?
                        </span>
                        <span className="text-xs text-[#7A7269]">
                          {selectedGuest
                            ? `You have ${selectedGuest.allottedSeats} seats reserved.`
                            : 'Let us know if you are attending with a partner or companion.'}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasPlusOne}
                          onChange={(e) => setHasPlusOne(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8C6B45]"></div>
                      </label>
                    </div>

                    {hasPlusOne && (
                      <div className="mt-4 pt-4 border-t border-[#F0EBE1] grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                            Plus-One Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required={hasPlusOne}
                            value={plusOneName}
                            onChange={(e) => setPlusOneName(e.target.value)}
                            placeholder="Guest's First and Last Name"
                            className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                            Plus-One Meal Choice
                          </label>
                          <select
                            value={plusOneMealChoice}
                            onChange={(e) => setPlusOneMealChoice(e.target.value as MealOption)}
                            className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                          >
                            {MEAL_OPTIONS.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                            Plus-One Dietary Restrictions
                          </label>
                          <input
                            type="text"
                            value={plusOneDietary}
                            onChange={(e) => setPlusOneDietary(e.target.value)}
                            placeholder="e.g. Vegetarian, Gluten-Free, Nut Allergy"
                            className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Guest Meal Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-2 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#8C6B45]" />
                      <span>Select Your Entrée Choice</span>
                    </label>
                    <div className="space-y-2.5">
                      {MEAL_OPTIONS.map((m) => {
                        const isSelected = mealChoice === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setMealChoice(m.id)}
                            className={`p-3.5 rounded border transition-all cursor-pointer flex items-start justify-between ${
                              isSelected
                                ? 'bg-[#FAF2E6] border-[#8C6B45] ring-1 ring-[#8C6B45]'
                                : 'bg-white border-[#E0D5C7] hover:border-[#8C6B45]/50'
                            }`}
                          >
                            <div className="pr-3">
                              <p className="font-serif font-bold text-sm text-[#1A1918]">{m.title}</p>
                              <p className="text-xs text-[#5C554E] mt-0.5">{m.description}</p>
                              <p className="text-[11px] text-[#8C6B45] mt-1 font-medium">{m.tags}</p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                                isSelected ? 'border-[#8C6B45] bg-[#8C6B45]' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dietary Requirements */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                      Your Dietary Restrictions or Food Allergies
                    </label>
                    <input
                      type="text"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      placeholder="e.g. Celiac / Gluten-free, Shellfish allergy, Dairy-free, None"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                    />
                  </div>

                  {/* Shuttle Bus Transfer */}
                  <div className="p-3.5 rounded bg-white border border-[#E0D5C7] flex items-center justify-between">
                    <div className="pr-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1918]">
                        <Bus className="w-3.5 h-3.5 text-[#8C6B45]" />
                        <span>Complimentary Guest Shuttle</span>
                      </div>
                      <p className="text-xs text-[#5C554E] mt-0.5">
                        Will you require the round-trip private bus from Florence Santa Maria Novella city center to Villa Bella Vista?
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={needsShuttle}
                        onChange={(e) => setNeedsShuttle(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8C6B45]"></div>
                    </label>
                  </div>

                  {/* Song Request */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-[#8C6B45]" />
                      <span>Song Request for the Dance Floor</span>
                    </label>
                    <input
                      type="text"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      placeholder="Song Title & Artist (What will get you dancing?)"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                    />
                  </div>
                </div>
              )}

              {/* Personal Note / Guestbook Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#8C6B45]" />
                  <span>A Note for Eleanor &amp; Arthur (Will appear in Guestbook)</span>
                </label>
                <textarea
                  rows={3}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Leave a message, blessing, or memory for the happy couple..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5C554E] hover:text-[#1A1918] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#FAF8F5] bg-[#8C6B45] hover:bg-[#745533] active:bg-[#5E4427] rounded-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting RSVP...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm RSVP Response</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
