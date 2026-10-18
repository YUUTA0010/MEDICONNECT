import { Medicine, Pharmacy, PharmacyMedicine, StockStatus, User, UserRole } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.CUSTOMER,
  location: { lat: 12.9716, lng: 77.5946 }, // Example coordinates (Bangalore)
  address: '123, Green Park, City Center'
};

export const MOCK_PHARMACY_OWNER: User = {
  id: 'p1_owner',
  name: 'Rajesh Gupta',
  email: 'rajesh@wellness.com',
  role: UserRole.PHARMACY_OWNER,
  location: { lat: 12.9750, lng: 77.5990 }
};

export const MEDICINES: Medicine[] = [
  {
    id: 'm1',
    name: 'Dolo 650',
    salt: 'Paracetamol 650mg',
    manufacturer: 'Micro Labs Ltd',
    dosage: '650mg',
    isPrescriptionRequired: false,
    category: 'OTC',
    description: 'Used for fever and mild to moderate pain.'
  },
  {
    id: 'm2',
    name: 'Augmentin 625 Duo',
    salt: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
    manufacturer: 'GSK',
    dosage: '625mg',
    isPrescriptionRequired: true,
    category: 'Prescription',
    description: 'Antibiotic used to treat bacterial infections.'
  },
  {
    id: 'm3',
    name: 'Glycomet GP 1',
    salt: 'Glimepiride 1mg + Metformin 500mg',
    manufacturer: 'USV Ltd',
    dosage: '1mg/500mg',
    isPrescriptionRequired: true,
    category: 'Prescription',
    description: 'Used for Type 2 Diabetes Mellitus.'
  },
  {
    id: 'm4',
    name: 'Pan 40',
    salt: 'Pantoprazole 40mg',
    manufacturer: 'Alkem Laboratories',
    dosage: '40mg',
    isPrescriptionRequired: false,
    category: 'OTC', // Often treated as OTC in practice though legally Rx
    description: 'Reduces stomach acid, used for GERD.'
  }
];

export const PHARMACIES: Pharmacy[] = [
  {
    id: 'ph1',
    storeName: 'Apollo Pharmacy',
    address: 'Shop 4, MG Road',
    lat: 12.9720,
    lng: 77.5950, // Very close
    isOpen: true,
    closingTime: '11:00 PM',
    deliveryAvailable: true,
    deliveryFee: 40,
    rating: 4.5
  },
  {
    id: 'ph2',
    storeName: 'Wellness Forever',
    address: 'Near Central Mall',
    lat: 12.9780,
    lng: 77.6000, // ~1km away
    isOpen: true,
    closingTime: '24 Hours',
    deliveryAvailable: true,
    deliveryFee: 0,
    rating: 4.8
  },
  {
    id: 'ph3',
    storeName: 'Local Chemist',
    address: 'Market Street',
    lat: 12.9600,
    lng: 77.5900, // ~1.5km away
    isOpen: false,
    closingTime: '9:00 PM',
    deliveryAvailable: false,
    deliveryFee: 0,
    rating: 3.8
  }
];

// Mapping inventory
export const INVENTORY: PharmacyMedicine[] = [
  // Apollo has everything
  { pharmacyId: 'ph1', medicineId: 'm1', price: 30, mrp: 32, stockQty: 50, stockStatus: StockStatus.IN_STOCK, expiryDate: '2024-12-01' },
  { pharmacyId: 'ph1', medicineId: 'm2', price: 180, mrp: 200, stockQty: 10, stockStatus: StockStatus.LOW_STOCK, expiryDate: '2024-10-15' },
  { pharmacyId: 'ph1', medicineId: 'm4', price: 140, mrp: 155, stockQty: 100, stockStatus: StockStatus.IN_STOCK, expiryDate: '2025-01-20' },
  
  // Wellness is out of Dolo
  { pharmacyId: 'ph2', medicineId: 'm1', price: 32, mrp: 32, stockQty: 0, stockStatus: StockStatus.OUT_OF_STOCK, expiryDate: '2024-12-01' },
  { pharmacyId: 'ph2', medicineId: 'm3', price: 110, mrp: 120, stockQty: 30, stockStatus: StockStatus.IN_STOCK, expiryDate: '2024-11-10' },

  // Local chemist
  { pharmacyId: 'ph3', medicineId: 'm1', price: 28, mrp: 32, stockQty: 20, stockStatus: StockStatus.IN_STOCK, expiryDate: '2024-09-30' },
];
