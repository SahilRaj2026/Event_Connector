import React from 'react';
import { Sparkles, ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';
import { ScreenType, UserRole } from '../types';

interface WebsiteFooterProps {
  onNavigate: (screen: ScreenType) => void;
  onToggleRole: () => void;
  userRole: UserRole;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({
  onNavigate,
  onToggleRole,
  userRole,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-20">
      {/* Trust Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block font-bold">₹2.5 Crore Liability & GSTIN Verified</strong>
              <span className="text-[11px] text-slate-400">Custom venue transit certificates issued in 2h</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block font-bold">100% Bench-Tested Gear</strong>
              <span className="text-[11px] text-slate-400">Audio drivers & beam heads verified</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block font-bold">Flexible Duration Tiers</strong>
              <span className="text-[11px] text-slate-400">Hourly slots, 24h daily & weekend runs</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block font-bold">White-Glove Staging Option</strong>
              <span className="text-[11px] text-slate-400">On-site audio technicians & riggers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black">
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              STAGED MARKETPLACE
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            The premier two-sided equipment rental and staging marketplace connecting event producers, festivals, and corporate organizers with vetted production houses.
          </p>
          <div className="pt-2 text-[11px] text-slate-500">
            Active hub coverage in Bengaluru, Mumbai, Delhi NCR, Goa, Jaipur & Udaipur.
          </div>
        </div>

        {/* Discovery Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Event Organizers</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>
              <button onClick={() => onNavigate('client-home')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Explore Gear Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('client-home')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Turnkey Production Bundles
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('vendor-profile')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Verified Vendor Directory
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('booking-flow')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Rental Duration Calculator
              </button>
            </li>
          </ul>
        </div>

        {/* Vendor Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Production Houses</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>
              <button onClick={() => onNavigate('vendor-dashboard')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Vendor Management Portal
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('vendor-dashboard')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Live Dispatches & Gigs
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('vendor-dashboard')} className="hover:text-amber-400 transition-colors cursor-pointer">
                Inventory & Pricing Matrix
              </button>
            </li>
            <li>
              <button onClick={onToggleRole} className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">
                {userRole === 'client' ? 'Enter Vendor Office →' : 'Switch to Client View'}
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">24/7 Operations Desk</h4>
          <div className="space-y-1.5 text-xs text-slate-400">
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 80 4567 8900 / +91 98201 45890</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>dispatch@staged.in</span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Central Depot: 100ft Rd, Indiranagar, Bengaluru</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800/80 py-6 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 STAGED Technologies Inc. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-white cursor-pointer">COI Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Deposit Terms</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Equipment Inspection Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
