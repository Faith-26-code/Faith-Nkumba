export type RsvpStatus = 'attending' | 'declined' | 'pending';

export type MealOption = 'Herb-Crusted Filet Mignon' | 'Pan-Seared Mediterranean Sea Bass' | 'Truffle & Wild Mushroom Risotto (V/GF)';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  inviteCode: string;
  allottedSeats: number;
  status: RsvpStatus;
  rsvpDate?: string;
  attendingCount?: number;
  mealChoice?: MealOption | string;
  dietaryRestrictions?: string;
  hasPlusOne?: boolean;
  plusOneName?: string;
  plusOneMealChoice?: MealOption | string;
  plusOneDietary?: string;
  songRequest?: string;
  personalNote?: string;
  needsShuttle?: boolean;
  tableAssignment?: string;
}

export interface WeddingDetails {
  partner1: string;
  partner2: string;
  weddingDate: string; // ISO string
  displayDate: string;
  ceremonyTime: string;
  ceremonyVenue: string;
  ceremonyAddress: string;
  receptionVenue: string;
  receptionAddress: string;
  rsvpDeadline: string;
  dressCode: string;
  dressCodeDetails: string;
  storyTitle: string;
  storyText1: string;
  storyText2: string;
  registryMessage: string;
  accommodationsNote: string;
}

export interface GuestbookMessage {
  id: string;
  author: string;
  date: string;
  message: string;
  status: 'attending' | 'declined' | 'friend';
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  attire?: string;
}
