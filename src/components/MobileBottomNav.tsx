import React from 'react';
import { Grid, Heart, Home, ShoppingBag, User } from 'lucide-react';
import { AppView, Language } from '../types';

interface MobileBottomNavProps {
  currentView: AppView;
  cartCount: number;
  lang: Language;
  onNavigate: (view: AppView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  cartCount,
  lang,
  onNavigate,
}) => {
  const tabs: {
    id: AppView;
    labelFr: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', labelFr: 'Accueil', labelEn: 'Home', icon: Home },
    { id: 'categories', labelFr: 'Rayons', labelEn: 'Browse', icon: Grid },
    { id: 'wishlist', labelFr: 'Favoris', labelEn: 'Saved', icon: Heart },
    { id: 'cart', labelFr: 'Panier', labelEn: 'Cart', icon: ShoppingBag },
    { id: 'account', labelFr: 'Compte', labelEn: 'Account', icon: User },
  ];

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-md md:hidden pb-safe"
    >
      <div className="grid h-14 grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentView === tab.id ||
            (tab.id === 'account' && currentView === 'orders') ||
            (tab.id === 'account' && currentView === 'tracking');
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
                isActive ? 'text-[#4F28E8] font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {tab.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#4F28E8] px-1 font-mono text-[10px] font-bold text-white tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="tracking-tight whitespace-nowrap">
                {lang === 'fr' ? tab.labelFr : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
