import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Package, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  Edit3, 
  Save, 
  X, 
  AlertCircle,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Booking, RentalItem, PortfolioEvent, Vendor, BookingStatus } from '../types';

interface VendorDashboardProps {
  vendor: Vendor;
  bookings: Booking[];
  rentalItems: RentalItem[];
  onUpdateBookingStatus: (bookingId: string, nextStatus: BookingStatus) => void;
  onAddNewRentalItem: (item: Partial<RentalItem>) => void;
  onUpdateItemRates: (itemId: string, hourly: number, daily: number, weekend: number, available: boolean) => void;
  onPublishPortfolioEvent: (event: PortfolioEvent) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  vendor,
  bookings,
  rentalItems,
  onUpdateBookingStatus,
  onAddNewRentalItem,
  onUpdateItemRates,
  onPublishPortfolioEvent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'inventory' | 'portfolio' | 'calendar'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  
  // Modal states
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isPublishEventModalOpen, setIsPublishEventModalOpen] = useState(false);

  // New Item Form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'audio' | 'lighting' | 'decor' | 'furniture'>('lighting');
  const [newItemHourly, setNewItemHourly] = useState(40);
  const [newItemDaily, setNewItemDaily] = useState(200);
  const [newItemWeekend, setNewItemWeekend] = useState(420);
  const [newItemStock, setNewItemStock] = useState(3);
  const [newItemDeposit, setNewItemDeposit] = useState(250);
  const [newItemDesc, setNewItemDesc] = useState('');

  // New Event Form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventGuests, setNewEventGuests] = useState(250);
  const [newEventReview, setNewEventReview] = useState('');
  const [newEventAuthor, setNewEventAuthor] = useState('');

  // Editing rate in inventory
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editHourly, setEditHourly] = useState(0);
  const [editDaily, setEditDaily] = useState(0);
  const [editWeekend, setEditWeekend] = useState(0);

  const vendorBookings = bookings.filter(b => b.vendorId === vendor.id);
  const vendorInventory = rentalItems.filter(i => i.vendorId === vendor.id);

  const filteredBookings = vendorBookings.filter(b => {
    if (orderStatusFilter === 'all') return true;
    return b.status === orderStatusFilter;
  });

  const handleStartEdit = (item: RentalItem) => {
    setEditingItemId(item.id);
    setEditHourly(item.hourlyRate);
    setEditDaily(item.dailyRate);
    setEditWeekend(item.weekendRate);
  };

  const handleSaveEdit = (itemId: string, isAvailable: boolean) => {
    onUpdateItemRates(itemId, editHourly, editDaily, editWeekend, isAvailable);
    setEditingItemId(null);
  };

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    onAddNewRentalItem({
      vendorId: vendor.id,
      vendorName: vendor.name,
      name: newItemName,
      category: newItemCategory,
      categoryLabel: newItemCategory === 'audio' ? 'DJ & Sound' : newItemCategory === 'lighting' ? 'Stage Lighting' : newItemCategory === 'decor' ? 'Decor & Drapery' : 'Furniture',
      specs: ['Standard professional flight case included', 'Verified bench tested before release'],
      hourlyRate: Number(newItemHourly),
      dailyRate: Number(newItemDaily),
      weekendRate: Number(newItemWeekend),
      stockAvailable: Number(newItemStock),
      condition: 'Pristine Clean',
      depositAmount: Number(newItemDeposit),
      packageDescription: newItemDesc || 'Professional event rental gear serviced and certified.',
      isAvailable: true,
      image: vendor.coverImage,
    });

    setIsAddItemModalOpen(false);
    setNewItemName('');
    setNewItemDesc('');
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const newEv: PortfolioEvent = {
      id: `port-${Date.now()}`,
      title: newEventTitle,
      eventType: 'Concluded Event Showcase',
      date: 'Just Concluded',
      venue: newEventVenue || 'Private Event Venue',
      guestCount: Number(newEventGuests) || 200,
      heroImage: vendor.coverImage,
      gearUsed: ['Pioneer CDJ-3000 Pair', 'Robe Moving Heads', 'White-Glove Sound Technician'],
      clientReview: newEventReview ? {
        text: newEventReview,
        author: newEventAuthor || 'Lead Event Producer',
        role: 'Verified Organizer',
        rating: 5,
      } : undefined,
    };

    onPublishPortfolioEvent(newEv);
    setIsPublishEventModalOpen(false);
    setNewEventTitle('');
    setNewEventVenue('');
    setNewEventReview('');
    setNewEventAuthor('');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-xs bg-sky-950 text-sky-400 border border-sky-800 px-2.5 py-1 rounded-full font-bold">Confirmed · Pack Gear</span>;
      case 'in_delivery':
        return <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-1 rounded-full font-bold">In Transit / Delivery</span>;
      case 'active':
        return <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-bold">Active at Venue</span>;
      case 'awaiting_return':
        return <span className="text-xs bg-purple-950 text-purple-400 border border-purple-800 px-2.5 py-1 rounded-full font-bold">Awaiting Return Check</span>;
      case 'completed':
        return <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-semibold">Completed & Released</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top SaaS Header & Executive Revenue Bar */}
      <section className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Vendor Back-Office Portal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white">{vendor.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {vendor.location} · {vendor.insuranceInfo}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">30-Day Gross Payouts</span>
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">₹12,45,000</span>
              <span className="text-xs text-emerald-400 font-semibold block">+18.4% vs last month</span>
            </div>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-indigo-900/60 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-400 block font-medium">Active Rentals Dispatched</span>
            <span className="text-xl sm:text-2xl font-bold text-white tabular-nums mt-1 block">
              {vendorBookings.filter(b => b.status !== 'completed').length} Gigs
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">2 in transit · 1 at venue</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-400 block font-medium">Inventory Utilization</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums mt-1 block">
              88.4%
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">High weekend demand</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-400 block font-medium">On-Time Return Rate</span>
            <span className="text-xl sm:text-2xl font-bold text-white tabular-nums mt-1 block">
              99.2%
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Prompt inspection clearance</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-400 block font-medium">Damage Dispute Rate</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums mt-1 block">
              0.0%
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Clean returns & waivers</span>
          </div>
        </div>
      </section>

      {/* Portal Tabs Bar */}
      <section>
        <div className="flex items-center border-b border-slate-800 gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`pb-3.5 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer relative ${
              activeSubTab === 'orders' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Live Dispatches & Orders ({vendorBookings.length})</span>
            {activeSubTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`pb-3.5 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer relative ${
              activeSubTab === 'inventory' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Inventory & Pricing Matrix ({vendorInventory.length})</span>
            {activeSubTab === 'inventory' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('portfolio')}
            className={`pb-3.5 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer relative ${
              activeSubTab === 'portfolio' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Showcase Portfolio Manager</span>
            {activeSubTab === 'portfolio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`pb-3.5 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer relative ${
              activeSubTab === 'calendar' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Logistics Calendar & Schedule</span>
            {activeSubTab === 'calendar' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
            )}
          </button>
        </div>
      </section>

      {/* SUBTAB 1: Active Rental Orders & Dispatches */}
      {activeSubTab === 'orders' && (
        <section className="space-y-6">
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'confirmed', 'in_delivery', 'active', 'awaiting_return', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setOrderStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  orderStatusFilter === status
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                {status === 'all' ? 'All Orders' : status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <Package className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <h3 className="text-sm font-bold text-white">No Orders Found</h3>
                <p className="text-xs text-slate-400">There are no rental bookings under this status filter.</p>
              </div>
            ) : (
              filteredBookings.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-4 shadow-md transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-amber-400">
                          {order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {order.eventName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Client: <strong className="text-slate-200">{order.clientName}</strong> · Event Date: <strong className="text-slate-200">{order.eventDate}</strong>
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs text-slate-400 block uppercase">Total Invoice Paid</span>
                      <span className="text-xl font-extrabold text-white block tabular-nums">
                        ₹{order.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold block">
                        Held Security Deposit: ₹{order.refundableDeposit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Gear List In Order */}
                  <div className="bg-slate-950 p-4 rounded-2xl space-y-2 text-xs text-slate-300 border border-slate-800/80">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">
                      Dispatched Hardware Packages:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {order.items.map((ci, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded-xl">
                          <span className="truncate">
                            <strong className="text-amber-400">{ci.quantity}x</strong> {ci.item.name}
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            ₹{(ci.item.dailyRate * ci.quantity).toLocaleString('en-IN')} /day
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
                      <span>Delivery Method: <strong className="text-white capitalize">{order.deliveryMethod.replace('_', ' ')}</strong></span>
                      <span>Damage Waiver: <strong className={order.hasDamageWaiver ? 'text-emerald-400' : 'text-slate-400'}>{order.hasDamageWaiver ? 'Protected (8%)' : 'Declined'}</strong></span>
                      <span>Venue: <strong className="text-white">{order.venueAddress}</strong></span>
                    </div>
                  </div>

                  {/* Status Progression Actions Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400 self-start sm:self-auto">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{order.clientPhone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{order.clientEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => onUpdateBookingStatus(order.id, 'in_delivery')}
                          className="h-10 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Mark In Delivery</span>
                        </button>
                      )}

                      {order.status === 'in_delivery' && (
                        <button
                          onClick={() => onUpdateBookingStatus(order.id, 'active')}
                          className="h-10 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Active at Venue</span>
                        </button>
                      )}

                      {order.status === 'active' && (
                        <button
                          onClick={() => onUpdateBookingStatus(order.id, 'awaiting_return')}
                          className="h-10 px-4 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Event Done · Request Return Check</span>
                        </button>
                      )}

                      {order.status === 'awaiting_return' && (
                        <button
                          onClick={() => onUpdateBookingStatus(order.id, 'completed')}
                          className="h-10 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Pass Inspection & Release Deposit (₹{order.refundableDeposit.toLocaleString('en-IN')})</span>
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-2 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Gear Inspected & Deposit Released</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* SUBTAB 2: Inventory & Rate Matrix */}
      {activeSubTab === 'inventory' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Equipment Catalog & Multi-Tier Pricing
              </h2>
              <p className="text-xs text-slate-400">
                Adjust hourly, 24-hour daily, and 3-day weekend rates with instant marketplace sync.
              </p>
            </div>

            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="h-11 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-400/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Equipment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorInventory.map((item) => {
              const isEditing = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 block">
                            {item.categoryLabel}
                          </span>
                          <h3 className="text-sm font-bold text-white line-clamp-1">
                            {item.name}
                          </h3>
                          <span className="text-xs text-slate-400 block">
                            {item.stockAvailable} units in stock · Dep: ${item.depositAmount}
                          </span>
                        </div>
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer transition-colors"
                          title="Edit rates"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Edit mode or View mode */}
                    {isEditing ? (
                      <div className="p-3 bg-slate-950 rounded-2xl space-y-3 border border-slate-800">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block">Hourly ($)</label>
                            <input
                              type="number"
                              value={editHourly}
                              onChange={(e) => setEditHourly(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">Daily ($)</label>
                            <input
                              type="number"
                              value={editDaily}
                              onChange={(e) => setEditDaily(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">Weekend ($)</label>
                            <input
                              type="number"
                              value={editWeekend}
                              onChange={(e) => setEditWeekend(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(item.id, item.isAvailable ?? true)}
                            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Rates</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-2xl text-center text-xs border border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Hourly</span>
                          <span className="font-bold text-white tabular-nums">₹{item.hourlyRate.toLocaleString('en-IN')}/hr</span>
                        </div>
                        <div className="border-x border-slate-800">
                          <span className="text-[10px] text-amber-400 font-bold block">Daily (24h)</span>
                          <span className="font-extrabold text-amber-300 tabular-nums">₹{item.dailyRate.toLocaleString('en-IN')}/day</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Weekend</span>
                          <span className="font-bold text-white tabular-nums">₹{item.weekendRate.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SUBTAB 3: Concluded Events Showcase Manager */}
      {activeSubTab === 'portfolio' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Event Portfolio Manager
              </h2>
              <p className="text-xs text-slate-400">
                Publish completed gigs with photography and client feedback to build high trust.
              </p>
            </div>

            <button
              onClick={() => setIsPublishEventModalOpen(true)}
              className="h-11 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-400/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Concluded Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vendor.portfolioEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-md flex flex-col sm:flex-row gap-4 p-4"
              >
                <img
                  src={ev.heroImage}
                  alt={ev.title}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-36 h-36 rounded-2xl object-cover border border-slate-800 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      {ev.eventType}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">Published on Marketplace</span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-400">{ev.venue} · {ev.guestCount} guests</p>
                  <p className="text-xs text-slate-500 pt-1 line-clamp-2">
                    Gear: {ev.gearUsed.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SUBTAB 4: Logistics Schedule & Gear Calendar */}
      {activeSubTab === 'calendar' && (
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  October 2026 Production Calendar
                </h2>
                <p className="text-xs text-slate-400">
                  Scheduled warehouse load-ins, soundcheck dispatches, and return diagnostic testing.
                </p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl font-mono">
                Week 41
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-400 block">
                    Today · Friday Oct 9
                  </span>
                  <strong className="text-sm text-white block mt-0.5">Sunburn Beachside Sunset Sessions</strong>
                  <p className="text-xs text-slate-400">Load-out 18:00 · Vagator Cliff Arena, North Goa · Robe Beams & CDJ-3000s</p>
                </div>
                <span className="text-xs bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg self-start sm:self-auto">
                  In Transit
                </span>
              </div>

              <div className="p-4 bg-sky-950/40 border border-sky-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase font-bold text-sky-400 block">
                    Tomorrow · Saturday Oct 10
                  </span>
                  <strong className="text-sm text-white block mt-0.5">Bengaluru AI Summit Keynote</strong>
                  <p className="text-xs text-slate-400">The Leela Palace, Old Airport Rd, Bengaluru · JBL Line Array + Wireless Mics</p>
                </div>
                <span className="text-xs bg-sky-500 text-white font-bold px-3 py-1 rounded-lg self-start sm:self-auto">
                  Confirmed
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block">
                    Sunday Oct 11
                  </span>
                  <strong className="text-sm text-white block mt-0.5">Depot Return & Diagnostic Testing</strong>
                  <p className="text-xs text-slate-400">Return window: 09:00 - 14:00 (Indiranagar Central Depot, Bengaluru)</p>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-3 py-1 rounded-lg self-start sm:self-auto">
                  Scheduled Inspection
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODAL: Add New Rental Item */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add Gear to Rental Catalog
              </h3>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Equipment Name & Model *</label>
                <input
                  type="text"
                  placeholder="e.g. Shure Axient Digital Wireless Mic System (4-Ch)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e: any) => setNewItemCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="audio">DJ & Sound Systems</option>
                    <option value="lighting">Stage Lighting</option>
                    <option value="decor">Decor & Drapery</option>
                    <option value="furniture">Furniture</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Units in Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Rates Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-400 block font-semibold">Hourly ($)</label>
                  <input
                    type="number"
                    value={newItemHourly}
                    onChange={(e) => setNewItemHourly(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-amber-400 block font-bold">Daily 24h ($)</label>
                  <input
                    type="number"
                    value={newItemDaily}
                    onChange={(e) => setNewItemDaily(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-amber-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block font-semibold">Weekend ($)</label>
                  <input
                    type="number"
                    value={newItemWeekend}
                    onChange={(e) => setNewItemWeekend(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Refundable Security Deposit ($)</label>
                <input
                  type="number"
                  value={newItemDeposit}
                  onChange={(e) => setNewItemDeposit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description & Flight Case Specs</label>
                <textarea
                  rows={2}
                  placeholder="Includes heavy duty Pelican case, powercon link, and dual antennas..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Publish Concluded Event */}
      {isPublishEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Publish Concluded Event Showcase
              </h3>
              <button
                onClick={() => setIsPublishEventModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Brooklyn Mirage Season Closer"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Venue Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Knockdown Center, Queens"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Guest Attendance</label>
                  <input
                    type="number"
                    value={newEventGuests}
                    onChange={(e) => setNewEventGuests(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Client Feedback Quote</label>
                <textarea
                  rows={2}
                  placeholder="Lumina was on time, gear was spotless and the sound was pristine..."
                  value={newEventReview}
                  onChange={(e) => setNewEventReview(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Client Author & Title</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova, Festival Producer"
                  value={newEventAuthor}
                  onChange={(e) => setNewEventAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPublishEventModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
