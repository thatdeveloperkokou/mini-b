import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  ThumbsUp,
  Truck,
} from 'lucide-react';
import { formatFCFA, VENDORS } from '../data/storeData';
import { Language, Product, Review } from '../types';
import { ProductImage } from '../components/ProductImage';

interface ProductDetailViewProps {
  lang: Language;
  product: Product;
  isWishlisted: boolean;
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, quantity: number, variantId?: string, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, variantId?: string, color?: string) => void;
  onOpenVendor: (vendorId: string) => void;
  onAddReview: (productId: string, review: Review) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  lang,
  product,
  isWishlisted,
  onBack,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenVendor,
  onAddReview,
}) => {
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [spin360, setSpin360] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id);
  const [quantity, setQuantity] = useState(1);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewDistrict, setReviewDistrict] = useState('Haie Vive, Cotonou');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const unitPrice = product.price + (selectedVariant?.priceDelta ?? 0);
  const savings =
    product.originalPrice && product.originalPrice > unitPrice
      ? product.originalPrice - unitPrice
      : 0;

  const vendor = VENDORS[product.vendorId];
  const title = lang === 'fr' ? product.name : product.nameEn;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      district: reviewDistrict,
      rating: reviewRating,
      dateFr: "À l'instant",
      dateEn: 'Just now',
      commentFr: reviewComment.trim(),
      commentEn: reviewComment.trim(),
      verifiedVia: 'Achat Vérifié',
      helpfulCount: 1,
    });
    setReviewAuthor('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-10 pb-24 lg:pb-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#4F28E8] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{lang === 'fr' ? 'Retour au catalogue' : 'Back to catalog'}</span>
        </button>

        <span className="text-xs font-medium text-slate-500">
          {lang === 'fr' ? product.categoryLabelFr : product.categoryLabelEn}
        </span>
      </div>

      {/* Contiguous 2-Column Product Showcase */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sticky Gallery Left */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-20 space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div
                className={`h-full w-full transition-transform duration-500 ${
                  spin360 ? 'scale-105 rotate-1' : ''
                }`}
              >
                <ProductImage
                  src={gallery[activeImageIdx] || product.image}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label="Favori"
                className="absolute top-3.5 right-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white cursor-pointer"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setSpin360((s) => !s)}
                className="absolute right-3.5 bottom-3.5 inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-slate-900 cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>{spin360 ? 'Vue Standard' : 'Vue 360°'}</span>
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-[#4F28E8] ring-2 ring-[#4F28E8]/20'
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={img} alt={`${title} ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Purchase Module Right */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-[#4F28E8]">
                  {product.highlightTag || (lang === 'fr' ? 'Vérifié MINI-B' : 'MINI-B Verified')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-slate-800 tabular-nums">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)} ({product.reviewCount}{' '}
                  {lang === 'fr' ? 'avis' : 'reviews'})
                </span>
              </div>

              <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl text-balance">
                {title}
              </h1>

              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-3xl font-extrabold text-[#4F28E8] tabular-nums">
                  {formatFCFA(unitPrice)}
                </span>
                {product.originalPrice && product.originalPrice > unitPrice && (
                  <span className="font-mono text-base text-slate-400 line-through tabular-nums">
                    {formatFCFA(product.originalPrice)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                    {lang === 'fr'
                      ? `Économisez ${formatFCFA(savings)}`
                      : `Save ${formatFCFA(savings)}`}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-emerald-50/90 px-4 py-3 text-xs font-medium text-emerald-900">
                <Truck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  {lang === 'fr'
                    ? `En stock à ${product.district} · Livraison express 2h aujourd'hui`
                    : `In stock in ${product.district} · 2h express delivery today`}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {lang === 'fr' ? product.descriptionFr : product.descriptionEn}
              </p>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  {lang === 'fr' ? 'Finition :' : 'Finish:'}{' '}
                  <span className="text-slate-900">{selectedColor}</span>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`min-h-[40px] rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedColor === color
                          ? 'border-[#4F28E8] bg-[#4F28E8]/8 text-[#4F28E8]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  {lang === 'fr' ? 'Configuration :' : 'Configuration:'}
                </p>
                <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariantId;
                    const vPrice = product.price + variant.priceDelta;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#4F28E8] bg-[#4F28E8]/6'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{variant.label}</p>
                          <p className="mt-0.5 font-mono text-xs font-semibold text-[#4F28E8] tabular-nums">
                            {formatFCFA(vPrice)}
                          </p>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#4F28E8]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Desktop Purchase Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-white cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Augmenter"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-white cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(product, quantity, selectedVariantId, selectedColor)}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#4F28E8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3F1CC9] cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span>{lang === 'fr' ? 'Ajouter au Panier' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, quantity, selectedVariantId, selectedColor)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 cursor-pointer whitespace-nowrap"
              >
                {lang === 'fr' ? 'Acheter' : 'Buy Now'}
              </button>
            </div>

            {/* Guarantees Strip */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 text-center">
              <div>
                <ShieldCheck className="mx-auto h-5 w-5 text-[#4F28E8]" />
                <p className="mt-1.5 text-xs font-bold text-slate-900">
                  {lang === 'fr' ? 'Garantie 1 An' : '1-Year Warranty'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {lang === 'fr' ? 'SAV Bénin inclus' : 'Local service'}
                </p>
              </div>
              <div>
                <RotateCw className="mx-auto h-5 w-5 text-emerald-600" />
                <p className="mt-1.5 text-xs font-bold text-slate-900">
                  {lang === 'fr' ? 'Retour 7 Jours' : '7-Day Returns'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {lang === 'fr' ? 'Satisfait ou remboursé' : 'Full refund'}
                </p>
              </div>
              <div>
                <Store className="mx-auto h-5 w-5 text-slate-700" />
                <p className="mt-1.5 text-xs font-bold text-slate-900">
                  {lang === 'fr' ? 'Facture DGI' : 'DGI Invoice'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {lang === 'fr' ? 'MoMo / Livraison' : 'MoMo / COD'}
                </p>
              </div>
            </div>
          </div>

          {/* Verified Seller Card */}
          {vendor && (
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {lang === 'fr' ? 'Vendu & expédié par' : 'Sold & fulfilled by'}
                </p>
                <h2 className="mt-0.5 font-display text-base font-bold text-slate-900">
                  {vendor.name}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {vendor.district} · {vendor.satisfaction}{' '}
                  {lang === 'fr' ? 'satisfaction' : 'positive'} · {vendor.salesCount}{' '}
                  {lang === 'fr' ? 'ventes' : 'sales'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenVendor(vendor.id)}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-[#4F28E8] hover:text-[#4F28E8] cursor-pointer whitespace-nowrap shrink-0"
              >
                {lang === 'fr' ? 'Visiter la Boutique' : 'Visit Storefront'}
              </button>
            </div>
          )}

          {/* Technical Specifications */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <h2 className="font-display text-base font-bold text-slate-900">
              {lang === 'fr' ? 'Fiche Technique Détaillée' : 'Technical Specifications'}
            </h2>
            <dl className="mt-4 divide-y divide-slate-100">
              {product.specs.map((spec) => (
                <div key={spec.labelFr} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">
                    {lang === 'fr' ? spec.labelFr : spec.labelEn}
                  </dt>
                  <dd className="text-right font-semibold text-slate-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              {lang === 'fr' ? 'Avis & Témoignages Clients' : 'Verified Customer Reviews'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {product.rating.toFixed(1)} / 5 · {product.reviewCount}{' '}
              {lang === 'fr' ? 'avis certifiés au Bénin' : 'verified Benin reviews'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewForm((s) => !s)}
            className="inline-flex min-h-[42px] items-center rounded-xl border border-[#4F28E8]/30 bg-[#4F28E8]/8 px-4 py-2 text-xs font-bold text-[#4F28E8] hover:bg-[#4F28E8]/15 cursor-pointer"
          >
            {lang === 'fr' ? '+ Donner mon avis' : '+ Write a review'}
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="rounded-2xl bg-slate-50 p-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <input
                type="text"
                required
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder={lang === 'fr' ? 'Votre nom (ex: Koffi A.)' : 'Your name'}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm focus:border-[#4F28E8] focus:outline-none"
              />
              <input
                type="text"
                value={reviewDistrict}
                onChange={(e) => setReviewDistrict(e.target.value)}
                placeholder="Quartier, Ville"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm focus:border-[#4F28E8] focus:outline-none"
              />
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold focus:border-[#4F28E8] focus:outline-none"
              >
                <option value={5}>5 ★ — Excellent</option>
                <option value={4}>4 ★ — Très bien</option>
                <option value={3}>3 ★ — Correct</option>
              </select>
            </div>
            <textarea
              rows={3}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={
                lang === 'fr'
                  ? 'Partagez votre expérience de livraison et qualité produit...'
                  : 'Share your delivery and product experience...'
              }
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm focus:border-[#4F28E8] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="min-h-[40px] rounded-xl px-4 text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                {lang === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-xl bg-[#4F28E8] px-5 text-xs font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
              >
                {lang === 'fr' ? 'Publier' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-100">
          {product.reviews.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">
              {lang === 'fr'
                ? 'Soyez le premier client béninois à évaluer cet article.'
                : 'Be the first customer to review this product.'}
            </p>
          ) : (
            product.reviews.map((rev) => (
              <article key={rev.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-bold text-slate-900">{rev.author}</p>
                    <p className="text-xs text-slate-500">
                      {rev.district} · {rev.verifiedVia} ·{' '}
                      {lang === 'fr' ? rev.dateFr : rev.dateEn}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
                  {lang === 'fr' ? rev.commentFr : rev.commentEn}
                </p>
                {rev.vendorReply && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {lang === 'fr' ? 'Réponse du vendeur : ' : 'Merchant reply: '}
                    </span>
                    {rev.vendorReply}
                  </div>
                )}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>
                    {lang === 'fr' ? `Utile (${rev.helpfulCount})` : `Helpful (${rev.helpfulCount})`}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="fixed right-0 bottom-14 left-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-base font-extrabold text-[#4F28E8] tabular-nums">
              {formatFCFA(unitPrice * quantity)}
            </p>
            <p className="truncate text-[11px] text-slate-500">{product.district}</p>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product, quantity, selectedVariantId, selectedColor)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#4F28E8] px-5 py-2.5 text-xs font-bold text-white cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{lang === 'fr' ? 'Ajouter' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
