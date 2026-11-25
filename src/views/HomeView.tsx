import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Tag,
  Truck,
  Wallet,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { CATEGORIES, formatFCFA, IMAGES, VENDORS } from '../data/storeData';
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
  onOpenVendor,
  onTrackOrder,
}) => {
  const isOnline = useOnlineStatus();
  const [heroSlide, setHeroSlide] = useState(0);
  const [flashSeconds, setFlashSeconds] = useState(2 * 3600 + 45 * 60 + 18);
  const flashDealsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFlashSeconds((prev) => (prev > 0 ? prev - 1 : 2 * 3600 + 45 * 60 + 18));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(flashSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((flashSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(flashSeconds % 60).padStart(2, '0');

  type HeroSlide =
    | {
        kind: 'promo';
        id: string;
        kickerFr: string;
        kickerEn: string;
        titleFr: string;
        titleEn: string;
        subFr: string;
        subEn: string;
        ctaFr: string;
        ctaEn: string;
        image: string;
        badgeFr?: string;
        badgeEn?: string;
        onAction: () => void;
      }
    | {
        kind: 'product';
        id: string;
        product: Product;
      };

  const heroSlides = useMemo<HeroSlide[]>(() => {
    const promoSlides: HeroSlide[] = [
      {
        kind: 'promo',
        id: 'promo-cotonou2024',
        kickerFr: 'PROMO EN COURS · CODE COTONOU2024',
        kickerEn: 'LIVE PROMO · CODE COTONOU2024',
        titleFr: '-15.000 FCFA dès 200.000 FCFA d’achat',
        titleEn: '15.000 FCFA Off Orders Over 200.000 FCFA',
        subFr:
          'Code COTONOU2024 actif au panier (ou MINIB5 pour -5%) · Paiement MoMo, Wave & Crypto',
        subEn:
          'Use code COTONOU2024 at checkout (or MINIB5 for 5% off) · Pay via MoMo, Wave & Crypto',
        ctaFr: 'Profiter de la promo',
        ctaEn: 'Shop Promo Now',
        image: IMAGES.courierBanner,
        badgeFr: '-15.000 FCFA',
        badgeEn: '-15.000 FCFA',
        onAction: () => {
          onSelectCategory('all');
          onOpenCategories();
        },
      },
      {
        kind: 'promo',
        id: 'promo-flash-cashback',
        kickerFr: 'VENTES FLASH + 3% CASHBACK CLUB',
        kickerEn: 'FLASH DEALS + 3% CLUB CASHBACK',
        titleFr: "Jusqu'à -25% en Ventes Flash + 3% offerts",
        titleEn: 'Up to 25% Off Flash Deals + 3% Cashback',
        subFr:
          '3% remboursés automatiquement sur votre portefeuille MINI-B à chaque commande livrée en 2h',
        subEn:
          'Earn instant 3% MINI-B wallet cashback on every order with 2h express Cotonou delivery',
        ctaFr: 'Voir les Ventes Flash',
        ctaEn: 'See Flash Deals',
        image: IMAGES.heroElectronics,
        badgeFr: 'JUSQU’À -25%',
        badgeEn: 'UP TO -25%',
        onAction: () => {
          flashDealsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
      },
    ];

    const featuredIds = [
      'iphone-15-pro-max-256',
      'ensemble-cabas-rose-poudre-pochette',
      'macbook-pro-16-m2max',
      'palette-fards-nude-rose-gold',
      'batterie-externe-anker-20000',
    ];

    const productSlides: HeroSlide[] = featuredIds
      .map((pid) => products.find((p) => p.id === pid))
      .filter((p): p is Product => Boolean(p))
      .map((product) => ({
        kind: 'product',
        id: `prod-${product.id}`,
        product,
      }));

    return [...promoSlides, ...productSlides];
  }, [products, onSelectCategory, onOpenCategories]);

  useEffect(() => {
    if (heroSlide >= heroSlides.length) {
      setHeroSlide(0);
    }
  }, [heroSlide, heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const autoTimer = window.setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => window.clearInterval(autoTimer);
  }, [heroSlides.length, heroSlide]);

  const activeSlide = heroSlides[heroSlide] || heroSlides[0];

  const randomWeightsRef = useRef<Record<string, number>>({});
  const getOrderWeight = (id: string) => {
    if (randomWeightsRef.current[id] === undefined) {
      randomWeightsRef.current[id] = Math.random();
    }
    return randomWeightsRef.current[id];
  };

  const flashDeals = useMemo(() => {
    const seenIds = new Set<string>();
    const seenImages = new Set<string>();
    const unique = products.filter((p) => {
      if (!p.isFlashDeal) return false;
      if (seenIds.has(p.id) || seenImages.has(p.image)) return false;
      seenIds.add(p.id);
      seenImages.add(p.image);
      return true;
    });
    // Spread categories apart so adjacent flash deals look visually distinct
    const priorityOrder = [
      'iphone-15-pro-max-256',
      'pack-tshirts-coton-peigne',
      'sneakers-montantes-retro-rouge',
      'pendentif-joaillerie-saphir-rubis',
      'macbook-pro-16-m2max',
      'sac-cabas-cuir-camel',
      'eau-de-parfum-nuit-ambre',
      'costume-trois-pieces-anthracite',
      'escarpins-daim-rouge-stiletto',
      'montre-automatique-squelette-or',
    ];
    return [...unique].sort((a, b) => {
      const idxA = priorityOrder.indexOf(a.id);
      const idxB = priorityOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.id.localeCompare(b.id);
    });
  }, [products]);

  const recommendedProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const vendorName = VENDORS[p.vendorId]?.name.toLowerCase() ?? '';
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.categoryLabelFr.toLowerCase().includes(q) ||
        p.categoryLabelEn.toLowerCase().includes(q) ||
        vendorName.includes(q);
      return matchesCat && matchesSearch;
    });
    return [...filtered].sort((a, b) => getOrderWeight(a.id) - getOrderWeight(b.id));
  }, [products, selectedCategory, searchQuery]);

  const storeList = useMemo(() => {
    return [...Object.values(VENDORS)].sort(
      (a, b) => getOrderWeight(`vendor-${a.id}`) - getOrderWeight(`vendor-${b.id}`)
    );
  }, []);

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
                ? 'Rechercher iPhone, MacBook, vêtements, chaussures, bijoux...'
                : 'Search iPhone, MacBook, clothing, shoes, jewelry...'
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
        {activeSlide.kind === 'promo' ? (
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
                  onClick={activeSlide.onAction}
                  className="inline-flex min-h-[40px] sm:min-h-[44px] items-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-[#4F28E8] transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>{lang === 'fr' ? activeSlide.ctaFr : activeSlide.ctaEn}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            <div className="col-span-5 sm:col-span-5">
              <button
                type="button"
                onClick={activeSlide.onAction}
                className="relative block w-full aspect-[4/3] overflow-hidden rounded-2xl bg-slate-950/25 shadow-lg ring-1 ring-white/15 cursor-pointer"
              >
                <ProductImage
                  src={activeSlide.image}
                  alt={lang === 'fr' ? activeSlide.titleFr : activeSlide.titleEn}
                  className="h-full w-full object-cover"
                />
                {activeSlide.badgeFr && (
                  <span className="absolute top-2.5 left-2.5 rounded-lg bg-amber-400 px-2.5 py-1 font-mono text-[10px] sm:text-xs font-extrabold text-slate-950 shadow-xs">
                    {lang === 'fr' ? activeSlide.badgeFr : activeSlide.badgeEn}
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 items-center gap-4 sm:gap-8">
            <div className="col-span-7 sm:col-span-7 space-y-2.5 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wide text-white">
                <Tag className="h-3 w-3 shrink-0" />
                <span>
                  {lang === 'fr'
                    ? `NOS PRODUITS · ${activeSlide.product.categoryLabelFr.toUpperCase()}`
                    : `FEATURED ITEM · ${activeSlide.product.categoryLabelEn.toUpperCase()}`}
                </span>
              </div>

              <h1 className="font-display text-lg font-extrabold leading-tight tracking-tight text-balance sm:text-3xl lg:text-4xl line-clamp-2">
                {lang === 'fr' ? activeSlide.product.name : activeSlide.product.nameEn}
              </h1>

              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="font-mono text-lg sm:text-2xl font-extrabold text-white tabular-nums">
                  {formatFCFA(activeSlide.product.price)}
                </span>
                {activeSlide.product.originalPrice && (
                  <span className="font-mono text-xs sm:text-sm text-indigo-200 line-through tabular-nums">
                    {formatFCFA(activeSlide.product.originalPrice)}
                  </span>
                )}
                <span className="hidden sm:inline text-xs font-medium text-indigo-100">
                  ·{' '}
                  {lang === 'fr'
                    ? activeSlide.product.deliveryEtaFr
                    : activeSlide.product.deliveryEtaEn}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenProduct(activeSlide.product.id)}
                  className="inline-flex min-h-[40px] sm:min-h-[44px] items-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-[#4F28E8] transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>{lang === 'fr' ? 'Voir le produit' : 'View Product'}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onQuickAdd(activeSlide.product)}
                  className="hidden sm:inline-flex min-h-[44px] items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-white/20 cursor-pointer"
                >
                  + {lang === 'fr' ? 'Panier' : 'Add to Cart'}
                </button>
              </div>
            </div>

            <div className="col-span-5 sm:col-span-5">
              <button
                type="button"
                onClick={() => onOpenProduct(activeSlide.product.id)}
                className="relative block w-full aspect-[4/3] overflow-hidden rounded-2xl bg-slate-950/25 shadow-lg ring-1 ring-white/15 cursor-pointer"
              >
                <ProductImage
                  src={activeSlide.product.image}
                  alt={lang === 'fr' ? activeSlide.product.name : activeSlide.product.nameEn}
                  className="h-full w-full object-cover"
                />
                {activeSlide.product.highlightTag && (
                  <span className="absolute top-2.5 left-2.5 rounded-lg bg-white/95 px-2.5 py-1 font-mono text-[10px] sm:text-xs font-extrabold text-[#4F28E8] shadow-xs">
                    {activeSlide.product.highlightTag}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Carousel Navigation & Dots */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label={lang === 'fr' ? 'Slide précédent' : 'Previous slide'}
            onClick={() =>
              setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
            }
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                aria-label={
                  slide.kind === 'promo'
                    ? lang === 'fr'
                      ? slide.kickerFr
                      : slide.kickerEn
                    : lang === 'fr'
                    ? slide.product.name
                    : slide.product.nameEn
                }
                onClick={() => setHeroSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  heroSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label={lang === 'fr' ? 'Slide suivant' : 'Next slide'}
            onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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

        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-7 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className="group flex w-20 shrink-0 flex-col items-center text-center cursor-pointer sm:w-auto"
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
      <section ref={flashDealsSectionRef} className="space-y-3.5">
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

        <div className="flash-marquee-viewport relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]">
          <div className="animate-flash-marquee flex w-max items-stretch">
            {[0, 1].map((copyIdx) => (
              <div
                key={`flash-track-${copyIdx}`}
                aria-hidden={copyIdx === 1}
                className="flex shrink-0 gap-3.5 pr-3.5"
              >
                {flashDeals.map((product) => {
                  const title = lang === 'fr' ? product.name : product.nameEn;
                  const discountPct =
                    product.originalPrice && product.originalPrice > product.price
                      ? Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) * 100
                        )
                      : 0;
                  const isSaved = wishlist.includes(product.id);
                  const hiddenProps = copyIdx === 1 ? { tabIndex: -1 as const } : {};
                  return (
                    <article
                      key={`flash-${copyIdx}-${product.id}`}
                      className="w-56 shrink-0 overflow-hidden rounded-2xl border border-[#EAE8F5] bg-white p-3 transition-all hover:border-[#4F28E8]/35 hover:shadow-sm sm:w-64"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F4FB]">
                        <button
                          type="button"
                          onClick={() => onOpenProduct(product.id)}
                          {...hiddenProps}
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
                          {...hiddenProps}
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
                        {...hiddenProps}
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
                          {...hiddenProps}
                          className="rounded-lg bg-[#F2EFFB] px-2.5 py-1.5 text-[11px] font-bold text-[#4F28E8] hover:bg-[#4F28E8] hover:text-white transition-colors cursor-pointer"
                        >
                          + {lang === 'fr' ? 'Panier' : 'Add'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Row 6.5: Boutiques Partenaires à Découvrir */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              {lang === 'fr' ? 'Boutiques Partenaires à Cotonou' : 'Curated Local Stores'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'fr'
                ? 'Smartphones, ordinateurs, vêtements, chaussures, bijoux & beauté'
                : 'Phones, laptops, clothing, shoes, jewelry, fragrance & bags'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenVendor(storeList[0].id)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#4F28E8] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{lang === 'fr' ? 'Explorer' : 'Browse stores'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-1 no-scrollbar">
          {storeList.map((vendor) => {
            const itemCount = products.filter((p) => p.vendorId === vendor.id).length;
            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => onOpenVendor(vendor.id)}
                className="group w-60 shrink-0 overflow-hidden rounded-2xl border border-[#EAE8F5] bg-white text-left transition-all hover:border-[#4F28E8]/40 hover:shadow-sm cursor-pointer sm:w-64"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F5F4FB]">
                  <ProductImage
                    src={vendor.bannerImage}
                    alt={vendor.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent" />
                  <span className="absolute right-2.5 bottom-2.5 left-2.5 truncate text-xs font-bold text-white">
                    {lang === 'fr'
                      ? vendor.specialtyFr || vendor.district
                      : vendor.specialtyEn || vendor.district}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-sm font-bold text-slate-900 truncate group-hover:text-[#4F28E8]">
                      {vendor.name}
                    </h3>
                    <Store className="h-3.5 w-3.5 text-[#4F28E8] shrink-0" />
                  </div>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                    <span>{vendor.district}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-emerald-700 font-semibold">
                      {vendor.satisfaction}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {itemCount} {lang === 'fr' ? 'art.' : 'items'}
                    </span>
                  </p>
                </div>
              </button>
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
