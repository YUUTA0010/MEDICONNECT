export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PHARMACY_OWNER = 'PHARMACY_OWNER',
  ADMIN = 'ADMIN'
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  location?: { lat: number; lng: number };
}

export interface Medicine {
  id: string;
  name: string;
  salt: string;
  manufacturer: string;
  dosage: string;
  isPrescriptionRequired: boolean;
  category: 'OTC' | 'Prescription';
  description?: string;
}

export interface Pharmacy {
  id: string;
  storeName: string;
  address: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  closingTime: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  rating: number;
  distance?: number; // Calculated at runtime
}

export interface PharmacyMedicine {
  pharmacyId: string;
  medicineId: string;
  price: number;
  mrp: number;
  stockQty: number;
  stockStatus: StockStatus;
  expiryDate: string;
}

export interface CartItem {
  medicine: Medicine;
  pharmacyId: string; // Items in cart must be from same pharmacy or split orders
  pharmacyName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  pharmacyId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  type: 'PICKUP' | 'DELIVERY';
  date: string;
  prescriptionUrl?: string;
}

export interface Substitute {
  name: string;
  manufacturer: string;
  priceEstimate: string;
  matchReason: string;
}

// Global Context Type
export interface AppState {
  user: User | null;
  cart: CartItem[];
  location: { lat: number; lng: number } | null;
}
