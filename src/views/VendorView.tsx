import React from 'react';
import { ArrowLeft, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { Language, Product, Vendor } from '../types';
import { VENDORS } from '../data/storeData';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';

interface VendorViewProps {
  lang: Language;
  vendor: Vendor;
  products: Product[];
  wishlist: string[];
  onBack: () => void;
  onSelectVendor: (vendorId: string) => void;
  onToggleWishlist: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onQuickAdd: (product: Product) => void;
  onOpenSupport: () => void;
}

export const VendorView: React.FC<VendorViewProps> = ({
  lang,
  vendor,
  products,
  wishlist,
  onBack,
  onSelectVendor,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
  onOpenSupport,
}) => {
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
  const allVendors = Object.values(VENDORS);

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#4F28E8] cursor-pointer self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{lang === 'fr' ? 'Retour' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {allVendors.map((v) => {
            const active = v.id === vendor.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVendor(v.id)}
                className={`min-h-[36px] shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#4F28E8] text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#4F28E8]/40 hover:text-[#4F28E8]'
                }`}
              >
                {v.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Merchant Profile Card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
        <div className="relative h-44 sm:h-56 w-full bg-slate-900">
          <ProductImage
            src={vendor.bannerImage}
            alt={vendor.name}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute right-6 bottom-5 left-6 flex flex-col gap-1 text-white">
            <p className="text-xs font-semibold text-emerald-300">
              {lang === 'fr' ? 'Boutique Officielle Certifiée MINI-B' : 'Certified MINI-B Official Merchant'}
            </p>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{vendor.name}</h1>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-[#4F28E8] shrink-0" />
                <span>{vendor.address}</span>
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                {lang === 'fr' ? vendor.descriptionFr : vendor.descriptionEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenSupport}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </button>
              <a
                href="tel:+22980002229"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:border-slate-300"
              >
                <Phone className="h-4 w-4" />
                <span>{lang === 'fr' ? 'Appeler' : 'Call'}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
            <div>
              <p className="font-mono text-lg font-extrabold text-emerald-700 tabular-nums">
                {vendor.satisfaction}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? 'Avis positifs' : 'Positive reviews'}
              </p>
            </div>
            <div>
              <p className="font-mono text-lg font-extrabold text-slate-900 tabular-nums">
                {vendor.responseTime}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? 'Temps de réponse' : 'Response time'}
              </p>
            </div>
            <div>
              <p className="font-mono text-lg font-extrabold text-[#4F28E8] tabular-nums">
                {vendor.salesCount}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? 'Ventes réussies' : 'Completed orders'}
              </p>
            </div>
            <div>
              <p className="font-mono text-lg font-extrabold text-slate-900 tabular-nums">
                {vendor.memberSince}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'fr' ? 'Ancienneté' : 'Member tenure'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-4 text-xs text-slate-700">
            <ShieldCheck className="h-5 w-5 text-[#4F28E8] shrink-0" />
            <div>
              <p className="font-bold text-slate-900">
                {lang === 'fr' ? 'Garantie & Séquestre MINI-B Bénin' : 'MINI-B Benin Escrow Guarantee'}
              </p>
              <p className="mt-0.5 leading-relaxed">
                {lang === 'fr'
                  ? 'Paiement conservé sous séquestre jusqu’à validation de conformité de votre colis lors de la livraison à Cotonou et Calavi.'
                  : 'Funds remain in escrow until you inspect your parcel and confirm handover with your OTP code.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Merchant Inventory */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">
          {lang === 'fr'
            ? `Catalogue du vendeur (${vendorProducts.length})`
            : `Merchant Catalog (${vendorProducts.length})`}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendorProducts.map((product) => (
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
      </section>
    </div>
  );
};
