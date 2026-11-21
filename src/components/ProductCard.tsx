import React from 'react';
import { Heart, Plus, ShieldCheck, Star } from 'lucide-react';
import { formatFCFA } from '../data/storeData';
import { Language, Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  lang: Language;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  isWishlisted,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
}) => {
  const title = lang === 'fr' ? product.name : product.nameEn;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE8F5] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4F28E8]/30 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F4FB] p-2.5">
        <button
          type="button"
          onClick={() => onOpenProduct(product.id)}
          className="h-full w-full block overflow-hidden rounded-xl text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F28E8]"
        >
          <ProductImage
            src={product.image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>

        {product.highlightTag === 'Top Vente' && (
          <span className="pointer-events-none absolute top-3.5 left-3.5 rounded-lg bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
            Top Vente
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-xs transition-colors hover:text-[#4F28E8] cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center gap-1 text-xs text-slate-500 tabular-nums">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-800">{product.rating.toFixed(1)}</span>
          <span className="text-slate-400">({product.reviewCount})</span>
        </div>

        <button
          type="button"
          onClick={() => onOpenProduct(product.id)}
          className="mt-1.5 text-left font-display text-sm sm:text-[15px] font-semibold leading-snug text-slate-900 line-clamp-2 hover:text-[#4F28E8] transition-colors cursor-pointer"
        >
          {title}
        </button>

        <div className="mt-2.5">
          <p className="font-mono text-base sm:text-[17px] font-extrabold text-[#4F28E8] tabular-nums">
            {formatFCFA(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="font-mono text-[11px] text-slate-400 line-through tabular-nums">
              {formatFCFA(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-1 min-w-0 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.district}</span>
          </div>

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            aria-label={lang === 'fr' ? `Ajouter ${title}` : `Add ${title}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#4F28E8] text-white transition-colors hover:bg-[#3D1BC7] active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
