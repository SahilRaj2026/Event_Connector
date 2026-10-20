import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  Building, 
  Phone, 
  Mail, 
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { CartItem, DurationType, DeliveryMethod, Booking, ScreenType, RentalItem } from '../types';

interface BookingFlowProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onConfirmBooking: (booking: Booking) => void;
  onNavigate: (screen: ScreenType) => void;
  availableItems: RentalItem[];
  onQuickAddItem: (item: RentalItem) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmBooking,
  onNavigate,
  availableItems,
  onQuickAddItem,
}) => {
  // Booking Form State
  const [durationType, setDurationType] = useState<DurationType>('daily');
  const [durationUnits, setDurationUnits] = useState<number>(1);
  const [eventDate, setEventDate] = useState('2026-10-10');
  const [startTime, setStartTime] = useState('16:00');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('curbside');
  const [hasDamageWaiver, setHasDamageWaiver] = useState(true);

  // Client Details
  const [eventName, setEventName] = useState('Goa Beachside Sunset Sessions');
  const [venueAddress, setVenueAddress] = useState('Vagator Cliff Arena, North Goa');
  const [clientName, setClientName] = useState('Ananya Sharma');
  const [clientPhone, setClientPhone] = useState('+91 98201 45890');
  const [clientEmail, setClientEmail] = useState('ananya@pulseevents.in');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Pricing calculations
  const calculateItemCost = (item: RentalItem, qty: number): number => {
    if (durationType === 'hourly') {
      const hours = Math.max(durationUnits, item.minHours || 4);
      return item.hourlyRate * hours * qty;
    } else if (durationType === 'weekend') {
      return item.weekendRate * durationUnits * qty;
    } else {
      // daily
      return item.dailyRate * durationUnits * qty;
    }
  };

  const subtotal = cartItems.reduce((acc, curr) => {
    return acc + calculateItemCost(curr.item, curr.quantity);
  }, 0);

  const deliveryFee = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'curbside' ? 1500 : 6500;
  const damageWaiverFee = hasDamageWaiver ? Number((subtotal * 0.08).toFixed(2)) : 0;
  const tax = Number(((subtotal + deliveryFee) * 0.18).toFixed(2));
  
  const refundableDeposit = cartItems.reduce((acc, curr) => {
    return acc + (curr.item.depositAmount * curr.quantity);
  }, 0);

  const total = Number((subtotal + deliveryFee + damageWaiverFee + tax).toFixed(2));

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const primaryVendor = cartItems[0]?.item.vendorId || 'vendor-swara';
    const primaryVendorName = cartItems[0]?.item.vendorName || 'Swara Pro Audio & Staging Co.';

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      vendorId: primaryVendor,
      vendorName: primaryVendorName,
      clientName: clientName || 'Event Organizer',
      clientPhone: clientPhone || '+91 98201 00000',
      clientEmail: clientEmail || 'organizer@event.in',
      eventName: eventName || 'Private Event',
      eventDate: `${eventDate} (${durationType === 'hourly' ? `${durationUnits} hours` : durationType === 'daily' ? `${durationUnits} day(s)` : `${durationUnits} weekend`})`,
      venueAddress: venueAddress || 'Vagator, Goa',
      durationType,
      durationUnits,
      items: [...cartItems],
      deliveryMethod,
      hasDamageWaiver,
      subtotal,
      deliveryFee,
      damageWaiverFee,
      tax,
      refundableDeposit,
      total,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onConfirmBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  // If already confirmed, show confirmation pass
  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
              Rental Reservation Confirmed & Locked
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-white">
              {confirmedBooking.eventName}
            </h1>
            <p className="text-sm text-slate-400">
              Order #{confirmedBooking.orderNumber} · Handled by {confirmedBooking.vendorName}
            </p>
          </div>

          {/* Digital QR Code Pickup Pass */}
          <div className="bg-white p-6 rounded-3xl max-w-[240px] mx-auto space-y-3 shadow-2xl">
            <div className="w-44 h-44 mx-auto bg-slate-950 p-2 rounded-2xl flex items-center justify-center text-white">
              <QrCode className="w-40 h-40" />
            </div>
            <span className="text-xs font-mono text-slate-900 font-bold block">
              SCAN AT DISPATCH / RETURN
            </span>
          </div>

          {/* Order Details Breakdown */}
          <div className="bg-slate-950 p-6 rounded-2xl text-left text-xs sm:text-sm space-y-3 border border-slate-800 max-w-lg mx-auto">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Event Window:</span>
              <span className="font-semibold text-white">{confirmedBooking.eventDate}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Delivery Tier:</span>
              <span className="font-semibold text-white capitalize">{confirmedBooking.deliveryMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Gear Packages:</span>
              <span className="font-semibold text-white">{confirmedBooking.items.length} Packages ({confirmedBooking.items.reduce((a, c) => a + c.quantity, 0)} units)</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-white text-base">
              <span>Total Paid:</span>
              <span className="text-amber-400 tabular-nums">₹{confirmedBooking.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400 font-medium">
              <span>Refundable Security Deposit:</span>
              <span className="tabular-nums">₹{confirmedBooking.refundableDeposit.toLocaleString('en-IN')} (Hold released upon return inspection)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('vendor-dashboard')}
              className="w-full sm:w-auto h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
            >
              <span>View in Vendor Back-Office Dashboard &rarr;</span>
            </button>

            <button
              onClick={() => onNavigate('client-home')}
              className="w-full sm:w-auto h-12 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Back to Equipment Discovery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate('client-home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </button>
      </div>

      <div className="space-y-1">
        <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
          Rental Checkout & Dispatch
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
          Configure Duration, Logistics & Confirm Quote
        </h1>
        <p className="text-sm text-slate-400">
          Select hourly, 24-hour daily, or 3-day weekend festival passes with transparent live fee calculations.
        </p>
      </div>

      {/* 2-Column Desktop Checkout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* SECTION 1: DURATION SELECTOR */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>1. Choose Rental Duration Mode</span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDurationType('hourly');
                  if (durationUnits < 4) setDurationUnits(6);
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  durationType === 'hourly'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase font-bold block">Hourly Slot</span>
                <span className="text-sm font-black text-white">4h – 12h</span>
                <span className="text-[10px] text-slate-500 block mt-1">Evening Gigs</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDurationType('daily');
                  setDurationUnits(1);
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  durationType === 'daily'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase font-bold block">Daily (24h)</span>
                <span className="text-sm font-black text-white">Full Day</span>
                <span className="text-[10px] text-slate-500 block mt-1">Most Popular</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDurationType('weekend');
                  setDurationUnits(1);
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  durationType === 'weekend'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase font-bold block">Weekend Pass</span>
                <span className="text-sm font-black text-white">3-Day Run</span>
                <span className="text-[10px] text-slate-500 block mt-1">Fri - Mon Flat</span>
              </button>
            </div>

            {/* Stepper */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Duration Length:</span>
                <strong className="text-white text-base">
                  {durationType === 'hourly' ? `${durationUnits} Hours` : durationType === 'daily' ? `${durationUnits} Day(s) (24h each)` : `${durationUnits} Weekend (3 Full Days)`}
                </strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (durationType === 'hourly') {
                      setDurationUnits(Math.max(4, durationUnits - 2));
                    } else {
                      setDurationUnits(Math.max(1, durationUnits - 1));
                    }
                  }}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                >
                  -
                </button>
                <span className="text-base font-bold text-amber-400 w-8 text-center tabular-nums">
                  {durationUnits}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (durationType === 'hourly') {
                      setDurationUnits(Math.min(16, durationUnits + 2));
                    } else {
                      setDurationUnits(Math.min(14, durationUnits + 1));
                    }
                  }}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Load-in Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: DELIVERY & STAGING TIERS */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>2. Delivery & On-Site Staging Service</span>
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="accent-amber-400"
                    />
                    <strong className="text-sm text-white">Self-Pickup at Vendor Warehouse Depot</strong>
                  </div>
                  <p className="text-xs text-slate-400 ml-6 mt-1">
                    Load directly into your own vehicle at Central Depot (Indiranagar, Bengaluru or Lower Parel, Mumbai). Zero delivery surcharge.
                  </p>
                </div>
                <span className="text-sm font-bold text-emerald-400 shrink-0">₹0</span>
              </label>

              <label
                onClick={() => setDeliveryMethod('curbside')}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  deliveryMethod === 'curbside'
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'curbside'}
                      onChange={() => setDeliveryMethod('curbside')}
                      className="accent-amber-400"
                    />
                    <strong className="text-sm text-white">Tempo / Tata Ace Commercial Loading Dock Delivery</strong>
                  </div>
                  <p className="text-xs text-slate-400 ml-6 mt-1">
                    Direct delivery to venue service gate. Round-trip transit & return pickup included.
                  </p>
                </div>
                <span className="text-sm font-bold text-white shrink-0 tabular-nums">+₹1,500</span>
              </label>

              <label
                onClick={() => setDeliveryMethod('white_glove')}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  deliveryMethod === 'white_glove'
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'white_glove'}
                      onChange={() => setDeliveryMethod('white_glove')}
                      className="accent-amber-400"
                    />
                    <strong className="text-sm text-white">White-Glove Staging + Sound & Light Engineer On-Site</strong>
                  </div>
                  <p className="text-xs text-slate-400 ml-6 mt-1">
                    Full truss assembly, soundcheck, wireless mic tuning & 2h live show engineer support.
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-400 shrink-0 tabular-nums">+₹6,500</span>
              </label>
            </div>
          </section>

          {/* SECTION 3: DAMAGE PROTECTION WAIVER */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-sm text-white block">Accidental Damage Protection Waiver</strong>
                  <span className="text-xs text-slate-400">Covers beverage spills, cosmetic truss scratches & normal cable wear</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHasDamageWaiver(!hasDamageWaiver)}
                className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer ${
                  hasDamageWaiver ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    hasDamageWaiver ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            <div className="text-xs text-slate-400 pl-8 flex justify-between">
              <span>8% equipment protection waiver</span>
              <span className="text-slate-200 font-bold tabular-nums">
                {hasDamageWaiver ? `+$${damageWaiverFee.toFixed(2)}` : 'Declined by organizer'}
              </span>
            </div>
          </section>

          {/* SECTION 4: VENUE & ORGANIZER DETAILS */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>3. Event Venue & Organizer Information</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Venue Delivery Address</label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Contact Organizer</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Phone (Load-in Contact)</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Rental Quote Summary (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Selected Gear ({cartItems.reduce((a, c) => a + c.quantity, 0)} units)
              </h2>
              <span className="text-xs text-amber-400 font-semibold">Live Quote</span>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-950 rounded-2xl space-y-3">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Your rental cart is empty.</p>
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Suggested to add:</span>
                  {availableItems.slice(0, 2).map(item => (
                    <button
                      key={item.id}
                      onClick={() => onQuickAddItem(item)}
                      className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <span className="text-white truncate font-medium">{item.name}</span>
                      <span className="text-amber-400 font-bold ml-2 shrink-0">+ Add</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        ₹{durationType === 'hourly' ? `${item.hourlyRate.toLocaleString('en-IN')}/hr` : durationType === 'daily' ? `${item.dailyRate.toLocaleString('en-IN')}/day` : `${item.weekendRate.toLocaleString('en-IN')}/weekend`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fee Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  Equipment Subtotal ({durationUnits} {durationType === 'hourly' ? 'hours' : durationType === 'daily' ? 'day(s)' : 'weekend'}):
                </span>
                <span className="font-semibold tabular-nums text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Delivery & Staging:</span>
                <span className="font-semibold tabular-nums text-white">₹{deliveryFee.toLocaleString('en-IN')}</span>
              </div>

              {hasDamageWaiver && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Damage Protection Waiver (8%):</span>
                  <span className="font-semibold tabular-nums text-emerald-400">₹{damageWaiverFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-400">GST (18% CGST + SGST):</span>
                <span className="font-semibold tabular-nums text-white">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>

              {/* Deposit Callout */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Refundable Security Deposit:</span>
                  <span className="font-bold text-amber-400 tabular-nums">₹{refundableDeposit.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Held authorization only. Automatically released within 4 hours after post-event return inspection.
                </p>
              </div>

              {/* Total Due Now */}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-extrabold text-white block">Total Quote Due Now:</span>
                  <span className="text-[11px] text-slate-400">Includes all gear, setup & 18% GST</span>
                </div>
                <span className="font-display text-2xl font-black text-amber-400 tabular-nums">
                  ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={cartItems.length === 0}
              className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                cartItems.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 active:scale-[0.98]'
              }`}
            >
              <span>Confirm & Lock Rental Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
