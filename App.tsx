import React, { createContext, useContext, useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, User as UserIcon, LogIn } from 'lucide-react';
import { User, CartItem, UserRole } from './types';
import { MOCK_USER, MOCK_PHARMACY_OWNER } from './constants';
import { HomePage, SearchResults, MedicineDetail, Checkout } from './pages/CustomerPages';
import { PharmacyDashboard } from './pages/PharmacyPages';

// --- Global Context ---
interface AppContextType {
  user: User | null;
  cart: CartItem[];
  login: (role: UserRole) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppContext = () => useContext(AppContext);

// --- Layout Components ---

const Navbar = () => {
  const { user, cart, login, logout } = useAppContext();
  const location = useLocation();
  const isPharmacy = user?.role === UserRole.PHARMACY_OWNER;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <Home className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-primary tracking-tight">MediConnect</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isPharmacy && (
                <Link to="/pharmacy" className={`text-sm font-medium ${location.pathname === '/pharmacy' ? 'text-primary' : 'text-slate-600'}`}>
                  Dashboard
                </Link>
              )}
              {!isPharmacy && (
                <Link to="/checkout" className="relative p-2 text-slate-600 hover:text-primary transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
              <div className="flex items-center gap-2 pl-4 border-l">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                </div>
                <div className="hidden md:block">
                    <p className="text-xs font-bold">{user.name}</p>
                    <button onClick={logout} className="text-xs text-red-500 hover:underline">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
                <button onClick={() => login(UserRole.CUSTOMER)} className="text-sm font-medium text-slate-600 hover:text-primary">Login</button>
                <button onClick={() => login(UserRole.PHARMACY_OWNER)} className="text-sm font-medium text-slate-600 hover:text-primary">Partner Login</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [cart, setCart] = useState<CartItem[]>([]);

  const login = (role: UserRole) => {
    if (role === UserRole.PHARMACY_OWNER) setUser(MOCK_PHARMACY_OWNER);
    else setUser(MOCK_USER);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  return (
    <AppContext.Provider value={{ user, cart, login, logout, addToCart }}>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/medicine/:id" element={<MedicineDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pharmacy" element={<PharmacyDashboard />} />
            </Routes>
          </main>
          <footer className="bg-white border-t py-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 MediConnect. Health at your fingertips.</p>
          </footer>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
}
