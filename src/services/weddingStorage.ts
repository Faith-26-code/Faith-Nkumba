import { Guest, WeddingDetails, GuestbookMessage, ScheduleItem } from '../types/wedding';

const STORAGE_KEYS = {
  GUESTS: 'amore_vows_guests_v1',
  DETAILS: 'amore_vows_details_v1',
  GUESTBOOK: 'amore_vows_guestbook_v1',
};

export const DEFAULT_WEDDING_DETAILS: WeddingDetails = {
  partner1: 'Eleanor Bennett',
  partner2: 'Arthur James',
  weddingDate: '2026-09-19T16:00:00',
  displayDate: 'Saturday, September 19, 2026',
  ceremonyTime: '4:00 PM',
  ceremonyVenue: 'Villa Bella Vista Estate',
  ceremonyAddress: 'Via delle Fontanelle 14, 50014 Fiesole (Florence), Italy',
  receptionVenue: 'The Belvedere Terraces & Olive Courtyard',
  receptionAddress: 'Villa Bella Vista, Fiesole, Italy',
  rsvpDeadline: 'August 15, 2026',
  dressCode: 'Black Tie Optional / Formal Garden Elegance',
  dressCodeDetails: 'Gentlemen in dark suits or tuxedos; ladies in midi or floor-length evening gowns. Earthy florals and muted jewel tones encouraged.',
  storyTitle: 'From Oxford Libraries to Florence Sunsets',
  storyText1: 'We met on a rainy Tuesday in the Bodleian Library reading room in Oxford, both searching for the exact same out-of-print architecture monograph. What began as a polite negotiation over a table lamp became a four-hour coffee conversation in a subterranean cafe that neither of us wanted to end.',
  storyText2: 'Six years, four continents, and countless Italian espresso stops later, Arthur surprised Eleanor during an evening stroll above the hills of Florence with an antique emerald ring and a question that changed our lives forever.',
  registryMessage: 'Your presence at our celebration in Italy is the greatest gift we could ever ask for. For those who have inquired about honoring us with a gift, we have established a Honeymoon & Future Home Fund.',
  accommodationsNote: 'Complimentary private guest shuttles will be operating between Florence Santa Maria Novella city center and Villa Bella Vista on the afternoon and evening of the celebration.',
};

export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    id: '1',
    time: '3:30 PM',
    title: 'Guest Arrival & Welcome Spritz',
    location: 'Lower Fountain Garden, Villa Bella Vista',
    description: 'Arrive at the estate gates, sip chilled Aperol spritzes and sparkling elderflower cordial while classical strings welcome you.',
  },
  {
    id: '2',
    time: '4:00 PM',
    title: 'The Marriage Ceremony',
    location: 'The Century-Old Olive Grove',
    description: 'Eleanor and Arthur exchange vows in an intimate open-air ceremony beneath ancient Tuscan olive trees overlooking the Florentine hills.',
  },
  {
    id: '3',
    time: '5:00 PM',
    title: 'Aperitivo & Sunset Cocktails',
    location: 'Belvedere Panoramic Terrace',
    description: 'Passed artisanal Tuscan antipasti, local Chianti Classico, and live jazz quartet as golden hour lights up the valley.',
  },
  {
    id: '4',
    time: '7:00 PM',
    title: 'Banquet Dinner & Toasts',
    location: 'Courtyard Under the Filament Canopy',
    description: 'A four-course candlelit seated Italian dinner prepared by master Tuscan chefs, followed by heartfelt family toasts.',
  },
  {
    id: '5',
    time: '9:30 PM',
    title: 'First Dance & Dancing Under the Stars',
    location: 'The Historic Orangery & Courtyard',
    description: 'Cake cutting, artisan dessert bar, craft signature cocktails, and live DJ dance party well into the warm night.',
  },
  {
    id: '6',
    time: '1:00 AM',
    title: 'Midnight Gelato & Finale',
    location: 'Main Villa Portico',
    description: 'Artisanal gelato cart and midnight pizza slices as the shuttle returns guests to Florence.',
  },
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'g-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    inviteCode: 'WED-7291',
    allottedSeats: 2,
    status: 'attending',
    rsvpDate: '2026-08-01',
    attendingCount: 2,
    mealChoice: 'Herb-Crusted Filet Mignon',
    dietaryRestrictions: 'None',
    hasPlusOne: true,
    plusOneName: 'David Jenkins',
    plusOneMealChoice: 'Pan-Seared Mediterranean Sea Bass',
    plusOneDietary: 'Gluten-Free',
    songRequest: 'L-O-V-E by Nat King Cole',
    personalNote: 'We wouldn’t miss this for the world! Counting down the days to celebrate you two in Italy.',
    needsShuttle: true,
    tableAssignment: 'Table 2 — Cypress',
  },
  {
    id: 'g-2',
    name: 'Marcus & Sophia Vance',
    email: 'marcus.vance@example.com',
    inviteCode: 'WED-3810',
    allottedSeats: 2,
    status: 'attending',
    rsvpDate: '2026-08-03',
    attendingCount: 2,
    mealChoice: 'Pan-Seared Mediterranean Sea Bass',
    dietaryRestrictions: 'Nut Allergy',
    hasPlusOne: true,
    plusOneName: 'Sophia Vance',
    plusOneMealChoice: 'Truffle & Wild Mushroom Risotto (V/GF)',
    plusOneDietary: 'Vegetarian',
    songRequest: 'September by Earth, Wind & Fire',
    personalNote: 'So deeply excited for you both. Get ready to dance!',
    needsShuttle: true,
    tableAssignment: 'Table 1 — Olive',
  },
  {
    id: 'g-3',
    name: 'Julian Henderson',
    email: 'julian.h@example.com',
    inviteCode: 'WED-5192',
    allottedSeats: 1,
    status: 'attending',
    rsvpDate: '2026-08-05',
    attendingCount: 1,
    mealChoice: 'Herb-Crusted Filet Mignon',
    dietaryRestrictions: 'None',
    hasPlusOne: false,
    songRequest: 'You Make My Dreams by Daryl Hall & John Oates',
    personalNote: 'From freshman dorms to the Tuscan altar. So proud of you Arthur!',
    needsShuttle: false,
    tableAssignment: 'Table 3 — Rosemary',
  },
  {
    id: 'g-4',
    name: 'Clara Beaumont',
    email: 'clara.b@example.com',
    inviteCode: 'WED-9403',
    allottedSeats: 1,
    status: 'declined',
    rsvpDate: '2026-08-04',
    attendingCount: 0,
    personalNote: 'Sending endless love from Sydney! I will be holding an exhibition that week, but raising a glass to you both from afar.',
  },
  {
    id: 'g-5',
    name: 'Jonathan & Emily Sterling',
    email: 'jonathan.sterling@example.com',
    inviteCode: 'WED-2048',
    allottedSeats: 2,
    status: 'pending',
  },
  {
    id: 'g-6',
    name: 'Liam O’Connor',
    email: 'liam.oc@example.com',
    inviteCode: 'WED-6175',
    allottedSeats: 2,
    status: 'pending',
  },
  {
    id: 'g-7',
    name: 'Beatrice Rossi',
    email: 'beatrice.rossi@example.com',
    inviteCode: 'WED-4412',
    allottedSeats: 1,
    status: 'attending',
    rsvpDate: '2026-08-06',
    attendingCount: 1,
    mealChoice: 'Truffle & Wild Mushroom Risotto (V/GF)',
    dietaryRestrictions: 'Vegetarian',
    hasPlusOne: false,
    songRequest: 'Volare by Dean Martin',
    personalNote: 'Benvenuti in Italia! Can’t wait to toast with local Brunello wine.',
    needsShuttle: true,
    tableAssignment: 'Table 1 — Olive',
  },
  {
    id: 'g-8',
    name: 'Dr. Robert & Catherine Bennett',
    email: 'r.bennett@example.com',
    inviteCode: 'WED-1100',
    allottedSeats: 2,
    status: 'attending',
    rsvpDate: '2026-07-28',
    attendingCount: 2,
    mealChoice: 'Herb-Crusted Filet Mignon',
    dietaryRestrictions: 'None',
    hasPlusOne: true,
    plusOneName: 'Catherine Bennett',
    plusOneMealChoice: 'Herb-Crusted Filet Mignon',
    plusOneDietary: 'None',
    songRequest: 'At Last by Etta James',
    personalNote: 'Our dearest Eleanor and Arthur, our hearts overflow with joy and anticipation for your special day.',
    needsShuttle: false,
    tableAssignment: 'Table 4 — Magnolia',
  },
];

export const INITIAL_GUESTBOOK: GuestbookMessage[] = [
  {
    id: 'msg-1',
    author: 'Sarah Jenkins',
    date: 'August 1, 2026',
    message: 'We wouldn’t miss this for the world! Counting down the days to celebrate you two in Italy. You are the most wonderful pair.',
    status: 'attending',
  },
  {
    id: 'msg-2',
    author: 'Marcus & Sophia Vance',
    date: 'August 3, 2026',
    message: 'So deeply excited for you both. May your marriage be as radiant and enduring as the Tuscan hills! Get ready to dance all night.',
    status: 'attending',
  },
  {
    id: 'msg-3',
    author: 'Clara Beaumont',
    date: 'August 4, 2026',
    message: 'Sending endless love from Sydney! So sorry I cannot be there physically, but my heart is right beside you on your wedding day.',
    status: 'declined',
  },
  {
    id: 'msg-4',
    author: 'Julian Henderson',
    date: 'August 5, 2026',
    message: 'From cramming in Oxford to seeing you marry the love of your life. Here’s to a lifetime of adventures and laughter!',
    status: 'attending',
  },
];

// Helper functions for storage management
export const weddingStorage = {
  getDetails(): WeddingDetails {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DETAILS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return DEFAULT_WEDDING_DETAILS;
  },

  saveDetails(details: WeddingDetails): void {
    localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(details));
  },

  getGuests(): Guest[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUESTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    // First time setup
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
    return INITIAL_GUESTS;
  },

  saveGuests(guests: Guest[]): void {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  },

  findGuest(query: string): Guest | undefined {
    const guests = this.getGuests();
    const clean = query.trim().toLowerCase();
    return guests.find(g => 
      g.inviteCode.toLowerCase() === clean || 
      g.name.toLowerCase() === clean || 
      g.email.toLowerCase() === clean
    );
  },

  submitRsvp(rsvpData: Partial<Guest> & { name: string; status: 'attending' | 'declined' }): Guest {
    const guests = this.getGuests();
    const cleanName = rsvpData.name.trim().toLowerCase();
    
    // Check if guest already exists
    let existingIndex = guests.findIndex(g => 
      (rsvpData.inviteCode && g.inviteCode.toLowerCase() === rsvpData.inviteCode.toLowerCase()) ||
      g.name.toLowerCase() === cleanName ||
      (rsvpData.email && g.email.toLowerCase() === rsvpData.email.trim().toLowerCase())
    );

    const now = new Date().toISOString().split('T')[0];

    let updatedGuest: Guest;

    if (existingIndex >= 0) {
      updatedGuest = {
        ...guests[existingIndex],
        ...rsvpData,
        status: rsvpData.status,
        rsvpDate: now,
      };
      guests[existingIndex] = updatedGuest;
    } else {
      const randomCode = 'WED-' + Math.floor(1000 + Math.random() * 9000);
      updatedGuest = {
        ...rsvpData,
        id: 'g-' + Date.now(),
        name: rsvpData.name.trim(),
        email: rsvpData.email?.trim() || '',
        inviteCode: rsvpData.inviteCode || randomCode,
        allottedSeats: rsvpData.allottedSeats || (rsvpData.hasPlusOne ? 2 : 1),
        status: rsvpData.status,
        rsvpDate: now,
      };
      guests.push(updatedGuest);
    }

    this.saveGuests(guests);

    // If they left a note, record to guestbook
    if (rsvpData.personalNote && rsvpData.personalNote.trim().length > 0) {
      this.addGuestbookMessage({
        id: 'msg-' + Date.now(),
        author: updatedGuest.name,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        message: rsvpData.personalNote.trim(),
        status: rsvpData.status,
      });
    }

    return updatedGuest;
  },

  addGuest(guest: Omit<Guest, 'id'>): Guest {
    const guests = this.getGuests();
    const newGuest: Guest = {
      ...guest,
      id: 'g-' + Date.now(),
    };
    guests.unshift(newGuest);
    this.saveGuests(guests);
    return newGuest;
  },

  updateGuest(id: string, updates: Partial<Guest>): Guest | null {
    const guests = this.getGuests();
    const index = guests.findIndex(g => g.id === id);
    if (index === -1) return null;
    guests[index] = { ...guests[index], ...updates };
    this.saveGuests(guests);
    return guests[index];
  },

  deleteGuest(id: string): void {
    const guests = this.getGuests().filter(g => g.id !== id);
    this.saveGuests(guests);
  },

  getGuestbook(): GuestbookMessage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUESTBOOK);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(INITIAL_GUESTBOOK));
    return INITIAL_GUESTBOOK;
  },

  addGuestbookMessage(msg: GuestbookMessage): void {
    const list = this.getGuestbook();
    list.unshift(msg);
    localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(list));
  },

  resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
    localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(DEFAULT_WEDDING_DETAILS));
    localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(INITIAL_GUESTBOOK));
  },

  generateInviteLink(guest: Guest): string {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('guest', guest.name);
    url.searchParams.set('code', guest.inviteCode);
    if (guest.allottedSeats > 1) {
      url.searchParams.set('seats', guest.allottedSeats.toString());
    }
    return url.toString();
  },

  exportCsv(): void {
    const guests = this.getGuests();
    const headers = [
      'Name',
      'Email',
      'Status',
      'Seats Allotted',
      'Attending Count',
      'Meal Choice',
      'Dietary Restrictions',
      'Has Plus One',
      'Plus One Name',
      'Plus One Meal',
      'Plus One Dietary',
      'Needs Shuttle',
      'Song Request',
      'Invite Code',
      'RSVP Date',
      'Note',
    ];

    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.email || ''}"`,
      `"${g.status}"`,
      g.allottedSeats,
      g.status === 'attending' ? (g.attendingCount || 1) : 0,
      `"${g.mealChoice || ''}"`,
      `"${g.dietaryRestrictions || ''}"`,
      g.hasPlusOne ? 'Yes' : 'No',
      `"${g.plusOneName || ''}"`,
      `"${g.plusOneMealChoice || ''}"`,
      `"${g.plusOneDietary || ''}"`,
      g.needsShuttle ? 'Yes' : 'No',
      `"${g.songRequest || ''}"`,
      `"${g.inviteCode}"`,
      `"${g.rsvpDate || ''}"`,
      `"${(g.personalNote || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Wedding_RSVP_Guest_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  generateIcsCalendar(): void {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Amore and Vows//Wedding Event//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Eleanor & Arthur\'s Wedding Celebration',
      'DESCRIPTION:Join Eleanor Bennett and Arthur James in celebrating their holy matrimony at Villa Bella Vista in Florence, Italy.',
      'LOCATION:Villa Bella Vista, Via delle Fontanelle 14, 50014 Fiesole, Florence, Italy',
      'DTSTART:20260919T140000Z',
      'DTEND:20260920T000000Z',
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Eleanor_Arthur_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
