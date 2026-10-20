import React, { useState } from 'react';
import { 
  ScreenType, 
  UserRole, 
  Vendor, 
  RentalItem, 
  GearBundle, 
  CartItem, 
  Booking, 
  BookingStatus, 
  PortfolioEvent 
} from './types';
import { 
  INITIAL_RENTAL_ITEMS, 
  VENDORS, 
  GEAR_BUNDLES, 
  INITIAL_VENDOR_BOOKINGS 
} from './data/mockData';
import { WebsiteHeader } from './components/WebsiteHeader';
import { WebsiteFooter } from './components/WebsiteFooter';
import { ClientHome } from './components/ClientHome';
import { VendorProfile } from './components/VendorProfile';
import { VendorDashboard } from './components/VendorDashboard';
import { BookingFlow } from './components/BookingFlow';

export default function App() {
  // Navigation & Role states
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('client-home');
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru, KA');

  // App Data states
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>(INITIAL_RENTAL_ITEMS);
  const [bundles] = useState<GearBundle[]>(GEAR_BUNDLES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_VENDOR_BOOKINGS);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('vendor-swara');

  // Pre-seed cart with flagship Pioneer CDJ-3000 Pair so checkout has live equipment
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      item: INITIAL_RENTAL_ITEMS[0],
      quantity: 1,
    }
  ]);

  // Persona Toggle Handler
  const handleToggleRole = () => {
    if (userRole === 'client') {
      setUserRole('vendor');
      setCurrentScreen('vendor-dashboard');
    } else {
      setUserRole('client');
      setCurrentScreen('client-home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to screen and scroll to top
  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Vendor
  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    handleNavigate('vendor-profile');
  };

  // Add Item to Cart
  const handleAddToCart = (item: RentalItem, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci => 
          ci.item.id === item.id 
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      } else {
        return [...prev, { item, quantity }];
      }
    });
  };

  // Add Bundle to Cart
  const handleAddBundleToCart = (bundle: GearBundle) => {
    const vendorItems = rentalItems.filter(i => i.vendorId === bundle.vendorId);
    if (vendorItems.length > 0) {
      handleAddToCart(vendorItems[0], 1);
      if (vendorItems.length > 1) {
        handleAddToCart(vendorItems[1], 1);
      }
    }
    handleNavigate('booking-flow');
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(prev => 
      prev.map(ci => ci.item.id === itemId ? { ...ci, quantity: newQty } : ci)
    );
  };

  // Remove Item from Cart
  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  // Confirm Booking from checkout
  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setCartItems([]);
  };

  // Update Booking Status in Vendor Dashboard
  const handleUpdateBookingStatus = (bookingId: string, nextStatus: BookingStatus) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: nextStatus } : b)
    );
  };

  // Add New Rental Item in Vendor Dashboard
  const handleAddNewRentalItem = (newItemData: Partial<RentalItem>) => {
    const newItem: RentalItem = {
      id: `item-${Date.now()}`,
      vendorId: newItemData.vendorId || 'vendor-swara',
      vendorName: newItemData.vendorName || 'Swara Pro Audio & Staging Co.',
      name: newItemData.name || 'New Rental Gear',
      category: newItemData.category || 'audio',
      categoryLabel: newItemData.categoryLabel || 'DJ & Sound Systems',
      image: newItemData.image || rentalItems[0].image,
      specs: newItemData.specs || ['Standard roadcase', 'Pre-tested on bench'],
      hourlyRate: newItemData.hourlyRate || 3500,
      dailyRate: newItemData.dailyRate || 18000,
      weekendRate: newItemData.weekendRate || 38000,
      minHours: 4,
      stockAvailable: newItemData.stockAvailable || 2,
      condition: 'Pristine Clean',
      depositAmount: newItemData.depositAmount || 20000,
      packageDescription: newItemData.packageDescription || 'Professional event gear.',
      isAvailable: true,
      featured: false,
    };

    setRentalItems(prev => [newItem, ...prev]);
    setVendors(prev => 
      prev.map(v => v.id === newItem.vendorId ? { ...v, catalog: [newItem, ...v.catalog] } : v)
    );
  };

  // Update Item Rates in Vendor Dashboard
  const handleUpdateItemRates = (itemId: string, hourly: number, daily: number, weekend: number, available: boolean) => {
    setRentalItems(prev => 
      prev.map(item => item.id === itemId ? {
        ...item,
        hourlyRate: hourly,
        dailyRate: daily,
        weekendRate: weekend,
        isAvailable: available,
      } : item)
    );

    setVendors(prev => 
      prev.map(v => ({
        ...v,
        catalog: v.catalog.map(item => item.id === itemId ? {
          ...item,
          hourlyRate: hourly,
          dailyRate: daily,
          weekendRate: weekend,
          isAvailable: available,
        } : item)
      }))
    );
  };

  // Publish Concluded Event in Vendor Dashboard
  const handlePublishPortfolioEvent = (newEvent: PortfolioEvent) => {
    setVendors(prev => 
      prev.map(v => v.id === 'vendor-swara' ? {
        ...v,
        completedGigsCount: v.completedGigsCount + 1,
        portfolioEvents: [newEvent, ...v.portfolioEvents]
      } : v)
    );
  };

  const currentVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0];
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, curr) => acc + (curr.item.dailyRate * curr.quantity), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Full Website Top Navigation Bar (Zone 1 - Zone 2 - Zone 3) */}
      <WebsiteHeader
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => handleNavigate('booking-flow')}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Main Website Content Body */}
      <main className="flex-1 w-full">
        {currentScreen === 'client-home' && (
          <ClientHome
            vendors={vendors}
            bundles={bundles}
            rentalItems={rentalItems}
            onSelectVendor={handleSelectVendor}
            onAddToCart={handleAddToCart}
            onAddBundleToCart={handleAddBundleToCart}
            onNavigate={handleNavigate}
            onToggleRole={handleToggleRole}
            userRole={userRole}
            selectedCity={selectedCity}
          />
        )}

        {currentScreen === 'vendor-profile' && (
          <VendorProfile
            vendor={currentVendor}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onNavigateToBooking={() => handleNavigate('booking-flow')}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'vendor-dashboard' && (
          <VendorDashboard
            vendor={vendors.find(v => v.id === 'vendor-swara') || vendors[0]}
            bookings={bookings}
            rentalItems={rentalItems}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onAddNewRentalItem={handleAddNewRentalItem}
            onUpdateItemRates={handleUpdateItemRates}
            onPublishPortfolioEvent={handlePublishPortfolioEvent}
          />
        )}

        {currentScreen === 'booking-flow' && (
          <BookingFlow
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onConfirmBooking={handleConfirmBooking}
            onNavigate={handleNavigate}
            availableItems={rentalItems}
            onQuickAddItem={handleAddToCart}
          />
        )}
      </main>

      {/* Global Comprehensive Website Footer */}
      <WebsiteFooter
        onNavigate={handleNavigate}
        onToggleRole={handleToggleRole}
        userRole={userRole}
      />
    </div>
  );
}
