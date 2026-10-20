export type ScreenType = 'client-home' | 'vendor-profile' | 'vendor-dashboard' | 'booking-flow';

export type UserRole = 'client' | 'vendor';

export type DurationType = 'hourly' | 'daily' | 'weekend';

export type DeliveryMethod = 'pickup' | 'curbside' | 'white_glove';

export interface RentalItem {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  category: 'audio' | 'lighting' | 'decor' | 'furniture' | 'stage_av';
  categoryLabel: string;
  image: string;
  specs: string[];
  hourlyRate: number; // e.g. $45/hr
  dailyRate: number;  // e.g. $180/day
  weekendRate: number; // e.g. $380/weekend (3 days)
  minHours?: number;
  stockAvailable: number;
  condition: 'Brand New' | 'Tour Grade' | 'Pristine Clean' | 'Restored Vintage';
  depositAmount: number;
  featured?: boolean;
  packageDescription?: string;
  isAvailable?: boolean;
}

export interface PortfolioEvent {
  id: string;
  title: string;
  eventType: string; // e.g. 'Warehouse Festival', 'Sunset Botanical Wedding', 'Tech Keynote Gala'
  date: string;
  venue: string;
  guestCount: number;
  heroImage: string;
  gearUsed: string[];
  clientReview?: {
    text: string;
    author: string;
    role: string;
    rating: number;
  };
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  coverImage: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  responseTime: string;
  insuranceInfo: string;
  bio: string;
  categories: string[];
  completedGigsCount: number;
  portfolioEvents: PortfolioEvent[];
  catalog: RentalItem[];
}

export interface CartItem {
  item: RentalItem;
  quantity: number;
}

export type BookingStatus = 'confirmed' | 'in_delivery' | 'active' | 'awaiting_return' | 'completed';

export interface Booking {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  eventName: string;
  eventDate: string;
  venueAddress: string;
  durationType: DurationType;
  durationUnits: number; // e.g., 6 hours, 2 days, 1 weekend
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  hasDamageWaiver: boolean;
  subtotal: number;
  deliveryFee: number;
  damageWaiverFee: number;
  tax: number;
  refundableDeposit: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export interface GearBundle {
  id: string;
  title: string;
  tagline: string;
  vendorId: string;
  vendorName: string;
  image: string;
  itemsIncluded: string[];
  guestCapacity: string;
  dailyRate: number;
  weekendRate: number;
  savingsPercent: number;
  badge: string;
}
