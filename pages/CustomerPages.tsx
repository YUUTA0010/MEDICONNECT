import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Search, MapPin, Pill, Activity, Filter, Info, ShoppingBag, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { Button, Badge, Input } from '../components/ui';
import { MEDICINES, PHARMACIES, INVENTORY } from '../constants';
import { Medicine, Pharmacy, StockStatus, PharmacyMedicine } from '../types';
import { getMedicineSubstitutes, getSymptomRemedies } from '../services/geminiService';
import { useAppContext } from '../App';

// --- Components ---

const SearchBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [term, setTerm] = useState('');
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-20 py-4 border-none rounded-xl shadow-lg ring-1 ring-slate-900/5 placeholder:text-slate-400 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
        placeholder="Search for medicines (e.g. Dolo, Insulin)..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(term)}
      />
      <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
        <Button onClick={() => onSearch(term)} className="h-full rounded-lg text-sm">Search</Button>
      </div>
    </div>
  );
};

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  medicine: Medicine;
  inventoryData: PharmacyMedicine;
  onAddToCart: () => void;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({ 
  pharmacy, medicine, inventoryData, onAddToCart 
}) => {
  const stockColor = inventoryData.stockStatus === StockStatus.IN_STOCK ? 'green' 
    : inventoryData.stockStatus === StockStatus.LOW_STOCK ? 'yellow' : 'red';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{pharmacy.storeName}</h3>
          <p className="text-sm text-slate-500 flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1" /> {pharmacy.distance?.toFixed(1)} km • {pharmacy.address}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">₹{inventoryData.price}</p>
          {inventoryData.price < inventoryData.mrp && (
            <p className="text-xs text-slate-400 line-through">MRP ₹{inventoryData.mrp}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Badge color={stockColor}>{inventoryData.stockStatus.replace('_', ' ')}</Badge>
        {pharmacy.isOpen ? (
          <Badge color="blue">Open Now</Badge>
        ) : (
          <Badge color="red">Closed</Badge>
        )}
        {pharmacy.deliveryAvailable && (
          <Badge color="yellow">Delivery ₹{pharmacy.deliveryFee}</Badge>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button 
          variant="primary" 
          className="w-full text-sm" 
          disabled={inventoryData.stockStatus === StockStatus.OUT_OF_STOCK || !pharmacy.isOpen}
          onClick={onAddToCart}
        >
          {medicine.isPrescriptionRequired ? 'Order with Rx' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

// --- Pages ---

export const HomePage = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSymptomCheck = async () => {
    if (!symptoms) return;
    setIsAnalyzing(true);
    const result = await getSymptomRemedies(symptoms);
    setIsAnalyzing(false);
    
    // Simple alert for demo, ideally a modal
    if(result.medicines.length > 0) {
      const confirm = window.confirm(`Suggestion: ${result.suggestion}\n\nRecommended: ${result.medicines.join(', ')}\n\nSearch for these now?`);
      if(confirm) navigate(`/search?q=${result.medicines[0]}`);
    } else {
      alert(result.suggestion);
    }
  };

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-emerald-800 text-white pt-20 pb-24 px-4 rounded-b-[3rem]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1 text-sm border border-white/20">
            <MapPin className="w-3 h-3 mr-2" />
            <span>Locating you... Bengaluru, KA</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Medicine delivered <br />in minutes.
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Find medicines in nearby pharmacies, compare prices, and get them delivered or pick up instantly.
          </p>
          <div className="pt-4">
            <SearchBar onSearch={(term) => navigate(`/search?q=${term}`)} />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Upload Prescription</h3>
            <p className="text-slate-500 text-sm mb-4">Got a doctor's slip? Upload it here and we'll find the medicines for you.</p>
            <Button variant="outline" className="w-full">Upload Now</Button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-purple-600" />
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI Symptom Checker</h3>
            <div className="space-y-2">
               <Input 
                placeholder="E.g., Headache, mild fever..." 
                value={symptoms} 
                onChange={e => setSymptoms(e.target.value)}
                className="text-sm"
              />
               <Button 
                variant="secondary" 
                className="w-full text-sm"
                onClick={handleSymptomCheck}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Suggest Medicines'}
               </Button>
            </div>
          </div>

           <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Order History</h3>
            <p className="text-slate-500 text-sm mb-4">Re-order your monthly medicines with a single click.</p>
            <Button variant="outline" className="w-full">View Orders</Button>
          </div>
        </div>
      </section>

      {/* Featured Categories would go here */}
    </div>
  );
};

export const SearchResults = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get('q') || '';
  const { addToCart } = useAppContext();
  
  // 1. Find medicine ID from query (mock logic)
  const medicine = MEDICINES.find(m => m.name.toLowerCase().includes(query.toLowerCase())) || MEDICINES[0];
  
  // 2. Find pharmacies stocking this medicine
  const availablePharmacies = INVENTORY
    .filter(inv => inv.medicineId === medicine.id)
    .map(inv => {
      const ph = PHARMACIES.find(p => p.id === inv.pharmacyId);
      if (!ph) return null;
      // Mock distance calc
      const dist = Math.sqrt(Math.pow(ph.lat - 12.9716, 2) + Math.pow(ph.lng - 77.5946, 2)) * 111; 
      return { ...ph, distance: dist, inventory: inv };
    })
    .filter(Boolean)
    .sort((a, b) => (a?.distance || 0) - (b?.distance || 0)) as (Pharmacy & { inventory: PharmacyMedicine })[];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/')} className="!px-3"><MapPin className="w-4 h-4" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Results for "{query}"</h1>
          <p className="text-slate-500 text-sm">Found {availablePharmacies.length} pharmacies nearby</p>
        </div>
      </div>

      {/* Medicine Info Header */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-bold text-lg text-blue-900">{medicine.name}</h2>
          <p className="text-sm text-blue-700">{medicine.salt} • {medicine.manufacturer}</p>
          {medicine.isPrescriptionRequired && (
             <span className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded mt-2">
               <AlertCircle className="w-3 h-3 mr-1" /> Prescription Required
             </span>
          )}
        </div>
        <Button 
          variant="secondary" 
          icon={Sparkles} 
          onClick={() => navigate(`/medicine/${medicine.id}`)}
        >
          View Substitutes (AI)
        </Button>
      </div>

      <div className="grid gap-4">
        {availablePharmacies.map(ph => (
          <PharmacyCard 
            key={ph.id} 
            pharmacy={ph} 
            medicine={medicine} 
            inventoryData={ph.inventory} 
            onAddToCart={() => {
              addToCart({
                medicine,
                pharmacyId: ph.id,
                pharmacyName: ph.storeName,
                price: ph.inventory.price,
                quantity: 1
              });
              alert('Added to cart!');
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const MedicineDetail = () => {
  const { id } = useParams(); // Need useParams from router
  // Mock finding details
  const medicine = MEDICINES.find(m => m.id === id) || MEDICINES[0];
  const [substitutes, setSubstitutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubs = async () => {
      setLoading(true);
      const subs = await getMedicineSubstitutes(medicine.name, medicine.salt);
      setSubstitutes(subs);
      setLoading(false);
    };
    fetchSubs();
  }, [medicine]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{medicine.name}</h1>
      <p className="text-slate-500 mb-6">{medicine.salt}</p>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Cheaper Substitutes (AI Generated)
        </h3>
        {loading ? (
          <p className="text-slate-400">Analyzing composition...</p>
        ) : (
          <div className="space-y-4">
            {substitutes.map((sub, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-bold">{sub.name}</p>
                  <p className="text-xs text-slate-500">{sub.manufacturer}</p>
                  <p className="text-xs text-green-600 mt-1">{sub.matchReason}</p>
                </div>
                <Badge color="green">{sub.priceEstimate}</Badge>
              </div>
            ))}
            <p className="text-xs text-slate-400 italic mt-2">
              Disclaimer: AI suggestions are for informational purposes. Always consult a pharmacist or doctor before switching medicines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Checkout = () => {
  const { cart } = useAppContext();
  const [prescription, setPrescription] = useState<File | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const requiresRx = cart.some(i => i.medicine.isPrescriptionRequired);

  if (cart.length === 0) return <div className="p-8 text-center text-slate-500">Cart is empty</div>;
  
  if (orderPlaced) return (
    <div className="p-8 text-center max-w-md mx-auto mt-10">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
      <p className="text-slate-600 mb-6">Your order #{Math.floor(Math.random() * 10000)} has been sent to the pharmacy. You will be notified when it's ready.</p>
      <Button onClick={() => window.location.href = '#/'} className="w-full">Back to Home</Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="bg-white rounded-xl border p-4 mb-6 space-y-4">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <div>
              <p className="font-bold">{item.medicine.name}</p>
              <p className="text-xs text-slate-500">Qty: {item.quantity} • {item.pharmacyName}</p>
            </div>
            <p className="font-bold">₹{item.price * item.quantity}</p>
          </div>
        ))}
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {requiresRx && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-red-900 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> Prescription Required
          </h3>
          <p className="text-sm text-red-700 mb-4">
            One or more items in your cart require a valid prescription.
          </p>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*,.pdf"
              onChange={(e) => setPrescription(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-bold">Delivery Address</h3>
        <Input placeholder="Full Name" defaultValue="John Doe" />
        <Input placeholder="Street Address" defaultValue="123 Green Park" />
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="City" defaultValue="Bengaluru" />
          <Input placeholder="Pincode" defaultValue="560001" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-pb">
        <div className="max-w-2xl mx-auto">
            <Button 
                className="w-full py-3 text-lg" 
                onClick={() => setOrderPlaced(true)}
                disabled={requiresRx && !prescription}
            >
                {requiresRx && !prescription ? 'Upload Prescription to Continue' : `Pay ₹${total} & Order`}
            </Button>
        </div>
      </div>
    </div>
  );
};