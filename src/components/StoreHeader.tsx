import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { AppView, Language } from '../types';

interface StoreHeaderProps {
  currentView: AppView;
  cartCount: number;
  lang: Language;
  onNavigate: (view: AppView) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  currentView,
  cartCount,
  lang,
  onNavigate,
}) => {
  const navItems: { id: AppView; labelFr: string; labelEn: string }[] = [
    { id: 'home', labelFr: 'Accueil', labelEn: 'Home' },
    { id: 'categories', labelFr: 'Catégories', labelEn: 'Categories' },
    { id: 'wishlist', labelFr: 'Favoris', labelEn: 'Wishlist' },
    { id: 'orders', labelFr: 'Commandes', labelEn: 'Orders' },
    { id: 'account', labelFr: 'Compte', labelEn: 'Account' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Logo */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          aria-label="Mini-B Accueil"
          className="flex h-11 items-center overflow-hidden whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4F28E8]"
        >
          <img
            src="/assets/aistudio/image-removebg-preview_5a6d89d0.svg"
            alt="Mini-B"
            className="h-20 w-auto max-w-none select-none"
          />
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Navigation principale">
          {navItems.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'orders' && currentView === 'tracking');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#4F28E8] font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'fr' ? item.labelFr : item.labelEn}
                {isActive && (
                  <span className="absolute right-0 -bottom-[17px] left-0 h-0.5 bg-[#4F28E8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4F28E8] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span>
              {lang === 'fr' ? 'Panier' : 'Cart'} ·{' '}
              <span className="font-mono tabular-nums">{cartCount}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
