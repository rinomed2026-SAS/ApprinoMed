export type Role = 'ASSISTANT' | 'PROFESSOR' | 'STAFF' | 'ADMIN';

export type Session = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  title: string;
  topic: string;
  level: string;
  description: string;
  isFavorite?: boolean;
  speakers?: { id: string; name: string; specialty?: string; country?: string }[];
};

export type Speaker = {
  id: string;
  name: string;
  country: string;
  specialty: string;
  bio: string;
  photoUrl: string;
  websiteUrl?: string;
  instagramUrl?: string;
  isInternational?: boolean;
};

export type Sponsor = {
  id: string;
  name: string;
  tier: string;
  description: string;
  websiteUrl: string;
  products: string;
  logoUrl?: string;
  productsList?: string[];
};

export type Hotel = {
  id: string;
  name: string;
  rating: number;
  priceMinCop: number;
  priceMaxCop: number;
  distanceKm: number;
  amenities: string;
  contact: string;
  promoCode: string;
};

export type Tourism = {
  id: string;
  name: string;
  category: string;
  duration: string;
  highlights: string;
  description: string;
};

export type EventInfo = {
  id: number;
  name: string;
  city: string;
  dates: string;
  venue: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  mapsUrl: string;
  academicHours: string;
};

export type Question = {
  id: string;
  sessionId: string;
  text: string;
  anonymous?: boolean;
  createdAt: string;
  userId?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  stats: {
    favorites: number;
    questions: number;
    certificateAvailable: boolean;
  };
};

export type Certificate = {
  id: string;
  userId: string;
  certificateId: string;
  userName: string;
  userRole?: string;
  certificateType?: string;
  eventName: string;
  eventDates: string;
  academicHours: number;
  issuedAt: string;
  pdfUrl?: string;
};
