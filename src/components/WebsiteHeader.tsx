import React from 'react';
import { ShoppingBag, Sparkles, MapPin, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { ScreenType, UserRole } from '../types';

interface WebsiteHeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({
  currentScreen,
  onNavigate,
  userRole,
  onToggleRole,
  cartCount,
  cartSubtotal,
  onOpenCart,
  selectedCity,
  onCityChange,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('client-home')}
            className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none"
            aria-label="STAGED Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <span className="font-display text-xl font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                STAGED
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-amber-400/90 uppercase tracking-widest">
                Marketplace
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('client-home')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentScreen === 'client-home' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Explore Gear
          </button>

          <button
            onClick={() => onNavigate('vendor-profile')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentScreen === 'vendor-profile' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Vendor Catalog & Gigs
          </button>

          <button
            onClick={() => onNavigate('vendor-dashboard')}
            className={`transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'vendor-dashboard' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <span>Vendor Office</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => onNavigate('booking-flow')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentScreen === 'booking-flow' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Booking & Duration
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* City Selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="Bengaluru, KA" className="bg-slate-900 text-white">Bengaluru, KA</option>
              <option value="Mumbai, MH" className="bg-slate-900 text-white">Mumbai, MH</option>
              <option value="Delhi NCR" className="bg-slate-900 text-white">Delhi NCR</option>
              <option value="Goa" className="bg-slate-900 text-white">Goa (North & South)</option>
              <option value="Jaipur & Udaipur" className="bg-slate-900 text-white">Jaipur & Udaipur</option>
            </select>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative h-10 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 text-slate-200 transition-all cursor-pointer shadow-sm hover:border-slate-700"
            title="View Rental Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4.5 h-4.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold hidden md:inline">
              {cartCount > 0 ? (
                <>
                  <span className="text-slate-400">{cartCount} items · </span>
                  <span className="text-amber-300 tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </>
              ) : (
                'Rental Cart'
              )}
            </span>
          </button>

          {/* Persona Switcher Toggle */}
          <button
            onClick={onToggleRole}
            className={`h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              userRole === 'client'
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
            title="Switch Persona"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {userRole === 'client' ? 'Vendor Portal' : 'Client Mode'}
            </span>
            <span className="sm:hidden">
              {userRole === 'client' ? 'Vendor' : 'Client'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
