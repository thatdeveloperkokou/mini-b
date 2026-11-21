import React, { useState } from 'react';
import { Bell, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { formatFCFA } from '../data/storeData';
import { Language, Product } from '../types';
import { ProductImage } from '../components/ProductImage';

interface WishlistViewProps {
  lang: Language;
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onQuickAdd: (product: Product) => void;
  onAddAllToCart: (products: Product[]) => void;
  onBrowseCatalog: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  lang,
  products,
  wishlist,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
  onAddAllToCart,
  onBrowseCatalog,
}) => {
  const [priceAlertEnabled, setPriceAlertEnabled] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'promo'>('all');

  const savedProducts = products.filter((p) => wishlist.includes(p.id));
  const displayed =
    filterMode === 'promo'
      ? savedProducts.filter((p) => p.originalPrice && p.originalPrice > p.price)
      : savedProducts;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {lang === 'fr' ? 'Mes Favoris' : 'Saved Wishlist'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-mono font-semibold text-slate-800 tabular-nums">
              {savedProducts.length}
            </span>{' '}
            {lang === 'fr'
              ? 'articles sauvegardés · Disponibilité locale Bénin'
              : 'saved items · Local Benin stock'}
          </p>
        </div>

        {savedProducts.length > 0 && (
          <button
            type="button"
            onClick={() => onAddAllToCart(savedProducts)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#4F28E8] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#3F1CC9] cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{lang === 'fr' ? 'Tout ajouter au panier' : 'Add all to cart'}</span>
          </button>
        )}
      </div>

      {/* Filter & WhatsApp Price Alert */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {lang === 'fr' ? `Tous (${savedProducts.length})` : `All (${savedProducts.length})`}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('promo')}
            className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'promo' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {lang === 'fr' ? 'En Promo' : 'On Sale'}
          </button>
        </div>

        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <Bell className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {lang === 'fr'
                ? 'Alerte baisse de prix WhatsApp'
                : 'WhatsApp price drop alerts'}
            </span>
          </span>
          <input
            type="checkbox"
            checked={priceAlertEnabled}
            onChange={(e) => setPriceAlertEnabled(e.target.checked)}
            className="h-5 w-5 accent-[#4F28E8] rounded cursor-pointer"
          />
        </label>
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
            {lang === 'fr' ? 'Votre liste d’envies est vide' : 'Your wishlist is empty'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {lang === 'fr'
              ? 'Sauvegardez vos coups de cœur pour suivre leur prix à Cotonou.'
              : 'Save favorite products to track prices and local availability.'}
          </p>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-[#4F28E8] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
          >
            {lang === 'fr' ? 'Découvrir le catalogue' : 'Browse catalog'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((product) => {
            const title = lang === 'fr' ? product.name : product.nameEn;
            return (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white"
              >
                <button
                  type="button"
                  onClick={() => onOpenProduct(product.id)}
                  className="aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <ProductImage src={product.image} alt={title} className="h-full w-full object-cover" />
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-slate-500">{product.district}</p>
                  <button
                    type="button"
                    onClick={() => onOpenProduct(product.id)}
                    className="mt-1 text-left font-display text-[15px] font-semibold text-slate-900 line-clamp-2 hover:text-[#4F28E8] cursor-pointer"
                  >
                    {title}
                  </button>
                  <p className="mt-2 font-mono text-base font-bold text-[#4F28E8] tabular-nums">
                    {formatFCFA(product.price)}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onQuickAdd(product)}
                      className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#4F28E8] px-3 py-2 text-xs font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{lang === 'fr' ? 'Panier' : 'Add to Cart'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label="Supprimer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
