import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Clock, 
  Flame, 
  ArrowRight, 
  Plus, 
  Check, 
  ChevronRight,
  SlidersHorizontal,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Vendor, RentalItem, GearBundle, ScreenType, UserRole } from '../types';

interface ClientHomeProps {
  vendors: Vendor[];
  bundles: GearBundle[];
  rentalItems: RentalItem[];
  onSelectVendor: (vendorId: string) => void;
  onAddToCart: (item: RentalItem, quantity?: number) => void;
  onAddBundleToCart: (bundle: GearBundle) => void;
  onNavigate: (screen: ScreenType) => void;
  onToggleRole: () => void;
  userRole: UserRole;
  selectedCity: string;
}

export const ClientHome: React.FC<ClientHomeProps> = ({
  vendors,
  bundles,
  rentalItems,
  onSelectVendor,
  onAddToCart,
  onAddBundleToCart,
  onNavigate,
  onToggleRole,
  userRole,
  selectedCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [eventDateFilter, setEventDateFilter] = useState<'this-weekend' | 'upcoming-month' | 'anytime'>('this-weekend');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Equipment' },
    { id: 'audio', label: 'DJ & Sound Systems' },
    { id: 'lighting', label: 'Stage & Kinetic Lighting' },
    { id: 'decor', label: 'Floral & Architectural Arches' },
    { id: 'furniture', label: 'Luxury Lounge & Staging' },
  ];

  const filteredItems = rentalItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.packageDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleQuickAdd = (item: RentalItem) => {
    onAddToCart(item, 1);
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1400);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Grand Website Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 pt-10 pb-16 lg:py-20">
        {/* Subtle Atmospheric Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Two-Sided Production Gear & Staging Marketplace</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              Rent Pro Stage Gear & Audio Crews by the Hour or Day.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Connect directly with insured production houses. Reserve Pioneer CDJs, Robe moving beams, boho floral backdrops, and modular VIP suites with guaranteed on-time delivery.
            </p>
          </div>

          {/* Unified Desktop Search Widget */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Keyword Search */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gear (Pioneer CDJ, Robe Beams, Arch)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Event Date Window */}
              <div className="md:col-span-3 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <select
                  value={eventDateFilter}
                  onChange={(e: any) => setEventDateFilter(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs sm:text-sm focus:outline-none w-full cursor-pointer"
                >
                  <option value="this-weekend" className="bg-slate-900 text-white">This Weekend (Oct 9-11)</option>
                  <option value="upcoming-month" className="bg-slate-900 text-white">Next 30 Days</option>
                  <option value="anytime" className="bg-slate-900 text-white">Custom Date</option>
                </select>
              </div>

              {/* City Metro Location */}
              <div className="md:col-span-3 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200 truncate font-medium text-xs sm:text-sm">{selectedCity} Coverage</span>
              </div>

              {/* Action Button */}
              <div className="md:col-span-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('catalog-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full h-11 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <span>Search Gear</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline mr-2">Categories:</span>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Credibility Markers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/60 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>₹2.5 Crore Liability & GSTIN</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Tier Hourly & Daily Rates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Bench-Tested Gear</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pan-India Metro Dispatches</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Verified Production Houses (Vendors) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Vetted Vendor Network</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Production Houses & Studios
            </h2>
            <p className="text-sm text-slate-400">
              Commercial liability verified with guaranteed on-time equipment load-in and experienced riggers.
            </p>
          </div>

          <button
            onClick={() => onSelectVendor('vendor-swara')}
            className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View Full Directory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map(vendor => (
            <div
              key={vendor.id}
              onClick={() => onSelectVendor(vendor.id)}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Cover Image & Avatar */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={vendor.coverImage}
                  alt={vendor.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="absolute top-3 right-3">
                  <span className="bg-slate-950/80 border border-slate-700 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified COI
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-end gap-3">
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 bg-slate-950 shadow-md shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{vendor.location}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Specs & Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {vendor.bio}
                </p>

                <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block">Rating</span>
                    <span className="font-bold text-amber-400 flex items-center justify-center gap-1 tabular-nums mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {vendor.rating}
                    </span>
                  </div>

                  <div className="bg-slate-950/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block">Gigs Done</span>
                    <span className="font-bold text-white tabular-nums mt-0.5">{vendor.completedGigsCount} Events</span>
                  </div>

                  <div className="bg-slate-950/70 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block">Response</span>
                    <span className="font-bold text-emerald-400 mt-0.5">{vendor.responseTime.replace(' response', '')}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
                  <span>Catalog: <strong>{vendor.catalog.length} items</strong></span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                    Explore Profile &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top-Rated Turnkey Gear Bundles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Turnkey Production Packages</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Top-Rated Complete Gear Bundles
            </h2>
            <p className="text-sm text-slate-400">
              Coordinated sound, light, and decor packages with flight cases, cables, and optional technicians.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bundles.map(bundle => (
            <div
              key={bundle.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row"
            >
              <div className="relative md:w-1/2 h-56 md:h-auto min-h-[220px]">
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="absolute top-3 left-3">
                  <span className="bg-amber-400 text-slate-950 font-black text-xs uppercase px-2.5 py-1 rounded-md shadow">
                    {bundle.badge} · Save {bundle.savingsPercent}%
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs text-slate-300 font-semibold block">
                    Fulfilled by {bundle.vendorName}
                  </span>
                  <span className="text-xs text-amber-300 font-medium">
                    Recommended for {bundle.guestCapacity}
                  </span>
                </div>
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {bundle.tagline}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                      Included In This Bundle:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {bundle.itemsIncluded.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block line-through tabular-nums">
                      ₹{Math.round(bundle.dailyRate * 1.25).toLocaleString('en-IN')}
                    </span>
                    <div className="text-lg font-black text-amber-400 tabular-nums">
                      ₹{bundle.dailyRate.toLocaleString('en-IN')}
                      <span className="text-xs text-slate-400 font-normal"> / 24h day</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddBundleToCart(bundle)}
                    className="min-h-[44px] px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-400/20"
                  >
                    <span>Rent Bundle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Complete Itemized Equipment Catalog */}
      <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Live Gear Inventory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Individual Gear & Staging Rentals
            </h2>
            <p className="text-sm text-slate-400">
              Clear hourly slots, 24-hour daily rates, and 3-day weekend festival passes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Showing <strong className="text-white tabular-nums">{filteredItems.length}</strong> rental units</span>
          </div>
        </div>

        {/* Catalog 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden p-4 space-y-4 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
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
                      {item.stockAvailable} in stock
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {item.vendorName} · {item.condition}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.packageDescription}
                  </p>
                </div>

                {/* 3-Tier Pricing Rate Matrix */}
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

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Dep: <strong className="text-slate-200 tabular-nums">₹{item.depositAmount.toLocaleString('en-IN')}</strong>
                </span>

                <button
                  onClick={() => handleQuickAdd(item)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    addedItemIds[item.id]
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20'
                  }`}
                >
                  {addedItemIds[item.id] ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Rent</span>
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
          ))}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="bg-slate-900/60 border-y border-slate-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white">
              How Staged Powers Your Event
            </h2>
            <p className="text-sm text-slate-400">
              From boutique rooftop gatherings to massive multi-room warehouse raves, rent guaranteed equipment with total peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
              <span className="text-4xl font-display font-black text-amber-400/30">01</span>
              <h3 className="text-lg font-bold text-white">Select Gear & Duration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose hourly evening slots, single-day 24h rentals, or 3-day weekend festival passes. Bundle audio, stage lighting, and lounge decor in one invoice.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
              <span className="text-4xl font-display font-black text-amber-400/30">02</span>
              <h3 className="text-lg font-bold text-white">White-Glove Staging or Depot Pickup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pick up directly at the vendor's loading dock or choose white-glove van delivery with sound technicians to handle truss rigging and audio tuning.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
              <span className="text-4xl font-display font-black text-amber-400/30">03</span>
              <h3 className="text-lg font-bold text-white">Automated Deposit Release</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                After the event strike, gear undergoes prompt diagnostic testing. Your refundable security deposit is automatically released upon clearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Production House Partner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">
              For Event Equipment Rental Houses
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
              Monetize Idle Audio, Lighting & Decor Inventory
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              List your tour-grade gear, set hourly and weekend rate structures, and manage incoming dispatch bookings with our dedicated Vendor Back-Office portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onToggleRole}
              className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <span>Launch Vendor Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
