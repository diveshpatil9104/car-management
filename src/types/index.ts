export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  phone?: string;
  address?: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  description: string;
  features: string[];
  available: boolean;
  category: 'economy' | 'compact' | 'luxury' | 'suv' | 'sports';
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  mileage: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    lastUpdated: string;
    speed?: number;
    heading?: number;
  };
  isTracking?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoffLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  createdAt: string;
  notes?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'card' | 'cash';
  transactionId?: string;
  createdAt: string;
}

export interface LocationUpdate {
  carId: string;
  lat: number;
  lng: number;
  address: string;
  timestamp: string;
  speed?: number;
  heading?: number;
}