'use client';

import Link from 'next/link';
import { 
  Home, 
  Package, 
  FlaskConical, 
  Trophy, 
  CircleDollarSign, 
  ShoppingBag, 
  Cpu, 
  Users, 
  MessagesSquare,
  Settings,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Package, label: 'All Models', href: '#produse' },
  { icon: FlaskConical, label: 'MakerLab', href: '#' },
  { icon: Trophy, label: 'Contests', href: '#' },
  { icon: CircleDollarSign, label: 'Crowdfunding', href: '#' },
];

const exploreItems = [
  { icon: ShoppingBag, label: "Maker's Supply", href: '#' },
  { icon: Cpu, label: 'CyberBrick', href: '#' },
  { icon: Users, label: 'Community', href: '#' },
  { icon: MessagesSquare, label: 'Forum', href: '#' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0A0A0A] border-r border-white/5 z-50 pt-6">
      {/* Brand Logo */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
        </div>
        <span className="text-xl font-display font-black tracking-tighter uppercase text-white">
          BLOOM<span className="text-secondary">FORM</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-8 overflow-y-auto no-scrollbar">
        {/* Main Nav */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group"
            >
              <item.icon size={20} className="group-hover:text-primary transition-colors" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Explore Section */}
        <div>
          <h4 className="px-4 mb-4 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-white/30">
            Explore
          </h4>
          <div className="space-y-1">
            {exploreItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group"
              >
                <item.icon size={20} className="group-hover:text-secondary transition-colors" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer Nav */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <HelpCircle size={20} />
          <span>Help Center</span>
        </button>
      </div>
    </aside>
  );
}
