import React, { useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../data/storeData';
import { CategoryId, Language, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';

interface CategoriesViewProps {
  lang: Language;
  products: Product[];
  wishlist: string[];
  selectedCategory: CategoryId;
  searchQuery: string;
  onSelectCategory: (cat: CategoryId) => void;
  onSearchChange: (q: string) => void;
  onToggleWishlist: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onQuickAdd: (product: Product) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  lang,
  products,
  wishlist,
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [under50k, setUnder50k] = useState(false);

  const filtered = products
    .filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (under50k && p.price > 50000) return false;
      const q = searchQuery.trim().toLowerCase();
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.nameEn.toLowerCase().includes(q) &&
        !p.district.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#4F28E8]">
            {lang === 'fr' ? 'Rayons & Univers Bénin' : 'Benin Departments & Catalog'}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {lang === 'fr' ? 'Toutes les Catégories' : 'All Categories'}
          </h1>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              lang === 'fr' ? 'Filtrer par nom ou quartier...' : 'Filter by product or district...'
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4F28E8] focus:outline-none"
          />
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`group flex flex-col overflow-hidden rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#4F28E8] bg-white ring-2 ring-[#4F28E8]/15'
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <ProductImage
                  src={cat.image}
                  alt={lang === 'fr' ? cat.titleFr : cat.titleEn}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <h2 className="font-display text-base font-bold text-slate-900">
                  {lang === 'fr' ? cat.titleFr : cat.titleEn}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  {lang === 'fr' ? cat.subtitleFr : cat.subtitleEn}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#4F28E8]">
                  <span className="font-mono tabular-nums">
                    {cat.itemCount.toLocaleString('fr-FR')} {lang === 'fr' ? 'articles' : 'items'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {lang === 'fr' ? 'Filtres :' : 'Filters:'}
          </span>

          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#4F28E8] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'fr' ? 'Tous les rayons' : 'All departments'}
          </button>

          <button
            type="button"
            onClick={() => setUnder50k((v) => !v)}
            className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              under50k
                ? 'bg-[#4F28E8] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'fr' ? '< 50.000 FCFA' : 'Under 50,000 FCFA'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500">
            {lang === 'fr' ? 'Trier :' : 'Sort:'}
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 focus:border-[#4F28E8] focus:outline-none"
          >
            <option value="featured">{lang === 'fr' ? 'Pertinence' : 'Featured'}</option>
            <option value="price_asc">{lang === 'fr' ? 'Prix croissant' : 'Price: Low to High'}</option>
            <option value="price_desc">{lang === 'fr' ? 'Prix décroissant' : 'Price: High to Low'}</option>
            <option value="rating">{lang === 'fr' ? 'Mieux notés' : 'Top Rated'}</option>
          </select>
        </div>
      </div>

      {/* Filtered Catalog Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            {lang === 'fr'
              ? 'Aucun produit disponible pour cette combinaison de filtres.'
              : 'No products found for these filter criteria.'}
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              setUnder50k(false);
              onSearchChange('');
            }}
            className="mt-4 inline-flex min-h-[40px] items-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            {lang === 'fr' ? 'Voir tout le catalogue' : 'Show full catalog'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
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
    </div>
  );
};
