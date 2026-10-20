import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Award, 
  Sparkles, 
  Check,
  Building,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { Vendor, RentalItem, CartItem, ScreenType } from '../types';

interface VendorProfileProps {
  vendor: Vendor;
  onAddToCart: (item: RentalItem, quantity?: number) => void;
  cartItems: CartItem[];
  onNavigateToBooking: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const VendorProfile: React.FC<VendorProfileProps> = ({
  vendor,
  onAddToCart,
  cartItems,
  onNavigateToBooking,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'portfolio' | 'credentials'>('catalog');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const vendorCartItems = cartItems.filter(ci => ci.item.vendorId === vendor.id);
  const totalVendorCartUnits = vendorCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const categories = ['all', ...Array.from(new Set(vendor.catalog.map(item => item.category)))];

  const filteredCatalog = vendor.catalog.filter(item => {
    return selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
  });

  const handleAddItem = (item: RentalItem) => {
    onAddToCart(item, 1);
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1400);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('client-home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Equipment Discovery</span>
        </button>
      </div>

      {/* Vendor Profile Header & Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Panoramic Cover */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={vendor.coverImage}
              alt={vendor.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
          </div>

          {/* Profile Identity Bar */}
          <div className="px-6 sm:px-8 pb-8 -mt-16 sm:-mt-20 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={vendor.avatar}
                alt={vendor.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-amber-400 bg-slate-950 shadow-2xl shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {vendor.name}
                  </h1>
                  <span title="Verified Vendor" className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                    Verified Partner
                  </span>
                </div>
                <p className="text-sm text-amber-300 font-medium">{vendor.tagline}</p>

                <div className="flex items-center gap-3 text-xs text-slate-300 pt-1 flex-wrap">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{vendor.rating}</span>
                    <span className="text-slate-400 font-normal">({vendor.reviewCount} verified reviews)</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vendor.location}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{vendor.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill & COI Info */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl md:text-right space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Commercial Insurance Verification
              </span>
              <p className="text-xs text-emerald-400 font-semibold flex items-center md:justify-end gap-1.5">
                <Award className="w-4 h-4 shrink-0" />
                <span>{vendor.insuranceInfo}</span>
              </p>
              <span className="text-[11px] text-slate-400 block">
                {vendor.completedGigsCount} Completed Live Event Deliveries
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center border-b border-slate-800 gap-8">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3.5 text-sm font-bold transition-colors cursor-pointer relative ${
              activeTab === 'catalog' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Rental Equipment Catalog ({vendor.catalog.length})</span>
            {activeTab === 'catalog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3.5 text-sm font-bold transition-colors cursor-pointer relative ${
              activeTab === 'portfolio' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Concluded Events Showcase ({vendor.portfolioEvents.length})</span>
            {activeTab === 'portfolio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-3.5 text-sm font-bold transition-colors cursor-pointer relative ${
              activeTab === 'credentials' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>About, COI & Policies</span>
            {activeTab === 'credentials' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
            )}
          </button>
        </div>
      </section>

      {/* TAB 1: Rental Catalog */}
      {activeTab === 'catalog' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Gear in Catalog' : cat}
              </button>
            ))}
          </div>

          {/* 3-Column Gear Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map(item => {
              const inCartCount = cartItems.find(ci => ci.item.id === item.id)?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-48 rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-slate-950/80 border border-slate-800 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-md">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="bg-slate-950/90 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-800">
                          {item.stockAvailable} units in stock
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Condition: {item.condition}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.packageDescription}
                      </p>
                    </div>

                    {/* Rates Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Hourly</span>
                        <span className="text-xs font-extrabold text-white tabular-nums">
                          ₹{item.hourlyRate.toLocaleString('en-IN')}
                          <span className="text-[10px] text-slate-400 font-normal">/hr</span>
                        </span>
                        <span className="text-[9px] text-slate-500 block">Min {item.minHours || 4}h</span>
                      </div>

                      <div className="border-x border-slate-800">
                        <span className="text-[10px] text-amber-400 font-bold block uppercase">Daily (24h)</span>
                        <span className="text-xs font-extrabold text-amber-300 tabular-nums">
                          ₹{item.dailyRate.toLocaleString('en-IN')}
                          <span className="text-[10px] text-slate-400 font-normal">/day</span>
                        </span>
                        <span className="text-[9px] text-slate-500 block">Single night</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Weekend</span>
                        <span className="text-xs font-extrabold text-white tabular-nums">
                          ₹{item.weekendRate.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-slate-500 block">3-Day Run</span>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Specifications:</span>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                        {item.specs.slice(0, 4).map((sp, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0"></span>
                            <span className="truncate">{sp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">
                      Dep: <strong className="text-slate-200 tabular-nums">₹{item.depositAmount.toLocaleString('en-IN')}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {inCartCount > 0 && (
                        <span className="text-xs font-bold text-amber-400 px-2 py-1 bg-amber-400/10 rounded-lg">
                          {inCartCount} in cart
                        </span>
                      )}

                      <button
                        onClick={() => handleAddItem(item)}
                        className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          addedItemIds[item.id]
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20'
                        }`}
                      >
                        {addedItemIds[item.id] ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Rent This Gear</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: Concluded Events Showcase */}
      {activeTab === 'portfolio' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Verified Event Deliveries & Staging Highlights
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Photographs and production breakdowns from recently concluded events equipped by {vendor.name}. Every gig is verified by client signatures and venue management.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {vendor.portfolioEvents.map(event => (
              <div
                key={event.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full">
                    <img
                      src={event.heroImage}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-950/80 border border-slate-700 text-amber-400 font-bold text-xs uppercase px-3 py-1 rounded-md backdrop-blur-md">
                        {event.eventType}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display text-xl font-bold text-white">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                        <span>{event.venue}</span>
                        <span>·</span>
                        <span>{event.guestCount} guests</span>
                        <span>·</span>
                        <span>{event.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5">
                        Production Hardware Deployed:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {event.gearUsed.map((g, i) => (
                          <span
                            key={i}
                            className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {event.clientReview && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: event.clientReview.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          "{event.clientReview.text}"
                        </p>
                        <div className="text-xs text-slate-400 font-semibold">
                          — {event.clientReview.author}, <span className="text-slate-500 font-normal">{event.clientReview.role}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: Credentials, COI & Policies */}
      {activeTab === 'credentials' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">About {vendor.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {vendor.bio}
            </p>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Completed Gigs</span>
                <span className="text-lg font-bold text-white tabular-nums">{vendor.completedGigsCount} Events</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Typical Response</span>
                <span className="text-lg font-bold text-emerald-400">{vendor.responseTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Rental Guarantees & Insurance Coverage</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Certificate of Insurance (COI):</strong> Custom COI naming your venue as additional insured issued within 2 hours of checkout.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Bench Diagnostic Testing:</strong> Every controller, mixer channel, moving beam, and audio driver passes diagnostic testing before dispatch.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">24/7 Live Event Hotline:</strong> On-call technical dispatch and emergency spare hardware availability.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floating Bottom Cart Bar */}
      {totalVendorCartUnits > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-full px-4">
          <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                {totalVendorCartUnits}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  {totalVendorCartUnits} Gear item{totalVendorCartUnits > 1 ? 's' : ''} in cart
                </span>
                <span className="text-xs text-slate-400">
                  Ready to configure rental duration & delivery
                </span>
              </div>
            </div>

            <button
              onClick={onNavigateToBooking}
              className="h-11 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <span>Configure & Rent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
