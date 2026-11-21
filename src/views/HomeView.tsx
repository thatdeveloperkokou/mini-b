import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  Wallet,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { CATEGORIES, formatFCFA, IMAGES } from '../data/storeData';
import { BeninAddress, CategoryId, Language, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HomeViewProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  products: Product[];
  wishlist: string[];
  selectedCategory: CategoryId;
  searchQuery: string;
  defaultAddress: BeninAddress;
  activeOrderId?: string;
  onSelectCategory: (cat: CategoryId) => void;
  onSearchChange: (q: string) => void;
  onToggleWishlist: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onQuickAdd: (product: Product) => void;
  onOpenCategories: () => void;
  onOpenAddresses: () => void;
  onOpenVendor: (vendorId: string) => void;
  onTrackOrder: (orderId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lang,
  onChangeLang,
  products,
  wishlist,
  selectedCategory,
  searchQuery,
  defaultAddress,
  activeOrderId,
  onSelectCategory,
  onSearchChange,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
  onOpenCategories,
  onOpenAddresses,
  onTrackOrder,
}) => {
  const isOnline = useOnlineStatus();
  const [heroSlide, setHeroSlide] = useState(0);
  const [flashSeconds, setFlashSeconds] = useState(2 * 3600 + 45 * 60 + 18);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFlashSeconds((prev) => (prev > 0 ? prev - 1 : 2 * 3600 + 45 * 60 + 18));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(flashSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((flashSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(flashSeconds % 60).padStart(2, '0');

  const heroSlides = [
    {
      kickerFr: 'SUPER PROMO COTONOU',
      kickerEn: 'COTONOU SUPER DEALS',
      titleFr: "Jusqu'à -40% sur l'Électronique",
      titleEn: 'Up to 40% Off Electronics',
      subFr: 'Laptops pro & smartphones livrés en 2h à Cotonou',
      subEn: 'Pro laptops & smartphones delivered in 2h across Cotonou',
      ctaFr: 'Acheter',
      ctaEn: 'Shop Now',
      image: IMAGES.heroElectronics,
      targetCategory: 'tech' as CategoryId,
    },
    {
      kickerFr: 'CRÉATEURS & WAX BÉNIN',
      kickerEn: 'BENIN FASHION & WAX',
      titleFr: 'Pagnes Vlisco & Mode sur Mesure',
      titleEn: 'Authentic Vlisco Wax & Tailoring',
      subFr: 'Pièces certifiées Dantokpa · Paiement MTN MoMo & Wave',
      subEn: 'Certified Dantokpa fabrics · Pay with MTN MoMo & Wave',
      ctaFr: 'Découvrir',
      ctaEn: 'Explore',
      image: IMAGES.waxVlisco,
      targetCategory: 'fashion' as CategoryId,
    },
    {
      kickerFr: 'LIVRAISON EXPRESS ZÉMIDJAN',
      kickerEn: 'EXPRESS 2H DELIVERY',
      titleFr: 'Reçu chez vous en 2h Chrono',
      titleEn: 'Delivered to Your Door in 2h',
      subFr: 'Cotonou, Abomey-Calavi & Porto-Novo avec code OTP sécurisé',
      subEn: 'Cotonou, Abomey-Calavi & Porto-Novo with secure OTP handover',
      ctaFr: 'Explorer',
      ctaEn: 'Browse',
      image: IMAGES.courierBanner,
      targetCategory: 'all' as CategoryId,
    },
  ];

  const activeSlide = heroSlides[heroSlide];

  const flashDeals = products.filter((p) => p.isFlashDeal || (p.originalPrice && p.originalPrice > p.price));

  const recommendedProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.categoryLabelFr.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Row 1: Delivery Location + Live Connectivity + FR/EN + PWA Install */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onOpenAddresses}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#F1EEFC] px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-[#E7E2FA] cursor-pointer"
        >
          <MapPin className="h-3.5 w-3.5 text-[#4F28E8] shrink-0" />
          <span className="truncate max-w-[210px] sm:max-w-none">
            {lang === 'fr' ? 'Livrer à:' : 'Deliver to:'}{' '}
            <strong className="font-bold text-slate-900">
              {defaultAddress.city}, {defaultAddress.district}
            </strong>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isOnline ? (lang === 'fr' ? 'En ligne' : 'Online') : 'Hors ligne'}</span>
          </span>

          <div className="inline-flex items-center rounded-full bg-[#F1EEFC] p-0.5">
            <button
              type="button"
              onClick={() => onChangeLang('fr')}
              className={`min-h-[28px] rounded-full px-2.5 text-[11px] font-bold transition-colors cursor-pointer ${
                lang === 'fr' ? 'bg-[#4F28E8] text-white' : 'text-slate-600'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`min-h-[28px] rounded-full px-2.5 text-[11px] font-bold transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-[#4F28E8] text-white' : 'text-slate-600'
              }`}
            >
              EN
            </button>
          </div>

          <PWAInstallButton lang={lang} variant="compact" />
        </div>
      </div>

      {/* Row 2: Soft Lilac Search Bar */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              lang === 'fr'
                ? 'Rechercher téléphones, ordinateurs, mode wax...'
                : 'Search phones, laptops, wax fashion...'
            }
            className="h-12 w-full rounded-2xl border border-[#EAE6F8] bg-[#F2EFFB] pr-12 pl-11 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#4F28E8] focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={onOpenCategories}
            aria-label={lang === 'fr' ? 'Filtres avancés' : 'Filters'}
            className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-600 hover:bg-white hover:text-[#4F28E8] cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {activeOrderId && (
          <button
            type="button"
            onClick={() => onTrackOrder(activeOrderId)}
            className="hidden sm:inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-[#4F28E8]/25 bg-white px-4 text-xs font-bold text-[#4F28E8] hover:bg-[#F2EFFB] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Truck className="h-4 w-4" />
            <span>#{activeOrderId}</span>
          </button>
        )}
      </div>

      {/* Row 3: Electric Violet-Indigo Hero Promo Carousel (#5C2DF2 -> #421AD6) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5E30F5] via-[#4F28E8] to-[#3B19C8] p-5 text-white shadow-sm sm:p-8 lg:p-10">
        <div className="grid grid-cols-12 items-center gap-4 sm:gap-8">
          <div className="col-span-7 sm:col-span-7 space-y-2.5 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wide text-white">
              <Zap className="h-3 w-3 shrink-0" />
              <span>{lang === 'fr' ? activeSlide.kickerFr : activeSlide.kickerEn}</span>
            </div>

            <h1 className="font-display text-xl font-extrabold leading-tight tracking-tight text-balance sm:text-3xl lg:text-4xl">
              {lang === 'fr' ? activeSlide.titleFr : activeSlide.titleEn}
            </h1>

            <p className="max-w-md text-xs leading-relaxed text-indigo-100 sm:text-sm line-clamp-2">
              {lang === 'fr' ? activeSlide.subFr : activeSlide.subEn}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(activeSlide.targetCategory);
                  onOpenCategories();
                }}
                className="inline-flex min-h-[40px] sm:min-h-[44px] items-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-[#4F28E8] transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{lang === 'fr' ? activeSlide.ctaFr : activeSlide.ctaEn}</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          <div className="col-span-5 sm:col-span-5">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-950/25 shadow-lg ring-1 ring-white/15">
              <ProductImage
                src={activeSlide.image}
                alt={lang === 'fr' ? activeSlide.titleFr : activeSlide.titleEn}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                heroSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Row 4: Service Assurance Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#EAE8F5] bg-white px-3.5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F2EFFB] text-[#4F28E8]">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 truncate">
            {lang === 'fr' ? 'MoMo, Wave & Crypto' : 'MoMo, Wave & Crypto'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-[#EAE8F5] bg-white px-3.5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Truck className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 truncate">
            {lang === 'fr' ? 'Livraison Express 24h' : '24h Express Delivery'}
          </span>
        </div>

        <div className="col-span-2 flex items-center gap-2.5 rounded-2xl border border-[#EAE8F5] bg-white px-3.5 py-3 sm:col-span-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F2EFFB] text-[#4F28E8]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 truncate">
            {lang === 'fr' ? 'Séquestre & Facture DGI' : 'Escrow & DGI Invoice'}
          </span>
        </div>
      </div>

      {/* Row 5: Catégories Populaires */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            {lang === 'fr' ? 'Catégories Populaires' : 'Popular Categories'}
          </h2>
          <button
            type="button"
            onClick={onOpenCategories}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#4F28E8] hover:underline cursor-pointer"
          >
            <span>{lang === 'fr' ? 'Voir tout' : 'See all'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className="group flex flex-col items-center text-center cursor-pointer"
              >
                <div
                  className={`aspect-square w-full overflow-hidden rounded-2xl border bg-white p-1.5 transition-all ${
                    isSelected
                      ? 'border-[#4F28E8] ring-2 ring-[#4F28E8]/20'
                      : 'border-[#EAE8F5] group-hover:border-[#4F28E8]/40'
                  }`}
                >
                  <div className="h-full w-full overflow-hidden rounded-xl bg-[#F5F4FB]">
                    <ProductImage
                      src={cat.image}
                      alt={lang === 'fr' ? cat.titleFr : cat.titleEn}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                <span
                  className={`mt-2 w-full truncate text-[11px] sm:text-xs font-semibold ${
                    isSelected ? 'text-[#4F28E8]' : 'text-slate-800'
                  }`}
                >
                  {lang === 'fr' ? cat.titleFr : cat.titleEn}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Row 6: Ventes Flash with Countdown Timer */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-rose-500 shrink-0" />
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              {lang === 'fr' ? 'Ventes Flash' : 'Flash Deals'}
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1.5 font-mono text-xs font-bold text-rose-700 tabular-nums">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {hours}h : {mins}m : {secs}s
            </span>
          </div>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:overflow-visible">
          {flashDeals.slice(0, 4).map((product) => {
            const title = lang === 'fr' ? product.name : product.nameEn;
            const discountPct =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )
                : 0;
            const isSaved = wishlist.includes(product.id);
            return (
              <article
                key={`flash-${product.id}`}
                className="w-56 shrink-0 overflow-hidden rounded-2xl border border-[#EAE8F5] bg-white p-3 transition-all hover:border-[#4F28E8]/35 hover:shadow-sm sm:w-auto"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F4FB]">
                  <button
                    type="button"
                    onClick={() => onOpenProduct(product.id)}
                    className="h-full w-full block cursor-pointer"
                  >
                    <ProductImage
                      src={product.image}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  {discountPct > 0 && (
                    <span className="pointer-events-none absolute top-2 left-2 rounded-lg bg-rose-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white tabular-nums">
                      -{discountPct}%
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label="Favori"
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-xs cursor-pointer"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenProduct(product.id)}
                  className="mt-2.5 block w-full text-left font-display text-sm font-bold text-slate-900 truncate hover:text-[#4F28E8] cursor-pointer"
                >
                  {title}
                </button>

                <div className="mt-1 flex items-end justify-between gap-2">
                  <div>
                    <p className="font-mono text-base font-extrabold text-[#4F28E8] tabular-nums">
                      {formatFCFA(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="font-mono text-[11px] text-slate-400 line-through tabular-nums">
                        {formatFCFA(product.originalPrice)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onQuickAdd(product)}
                    className="rounded-lg bg-[#F2EFFB] px-2.5 py-1.5 text-[11px] font-bold text-[#4F28E8] hover:bg-[#4F28E8] hover:text-white transition-colors cursor-pointer"
                  >
                    + {lang === 'fr' ? 'Panier' : 'Add'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Row 7: Sélectionnés pour Vous (2-column mobile grid -> 3/4-column desktop) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              {lang === 'fr' ? 'Sélectionnés pour Vous' : 'Recommended for You'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'fr'
                ? 'Recommandés selon vos envies à Cotonou'
                : 'Handpicked stock available in Cotonou'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCategories}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#F2EFFB] px-3 py-1.5 text-xs font-bold text-[#4F28E8] hover:bg-[#E7E2FA] cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{lang === 'fr' ? 'Filtres' : 'Filters'}</span>
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>

        {recommendedProducts.length === 0 ? (
          <div className="rounded-2xl border border-[#EAE8F5] bg-white p-10 text-center">
            <p className="font-display text-sm font-bold text-slate-900">
              {lang === 'fr'
                ? 'Aucun article ne correspond à votre recherche.'
                : 'No products match your search.'}
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
              }}
              className="mt-4 inline-flex min-h-[40px] items-center rounded-xl bg-[#4F28E8] px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onOpenProduct={onOpenProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        )}
      </section>

      {/* Row 8: Transactions 100% Sécurisées Banner */}
      <section className="flex items-center gap-4 rounded-2xl border border-[#E7E3F8] bg-[#F2EFFB] p-4 sm:p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#4F28E8] shadow-xs">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-sm font-extrabold text-slate-900">
            {lang === 'fr' ? 'Transactions 100% Sécurisées' : '100% Secure Transactions'}
          </h3>
          <p className="mt-0.5 text-xs text-slate-600">
            {lang === 'fr'
              ? 'Paiement sécurisé via MTN MoMo, Moov Money, Wave, Crypto (USDT/BTC) & Cartes bancaires'
              : 'Encrypted payments via MTN MoMo, Moov Money, Wave, Crypto (USDT/BTC) & Bank Cards'}
          </p>
        </div>
      </section>
    </div>
  );
};
