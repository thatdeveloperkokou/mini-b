import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, VENDORS } from '../data/storeData';
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
  const [showAllTopProducts, setShowAllTopProducts] = useState(false);
  const [activeBottomCategory, setActiveBottomCategory] = useState<Exclude<CategoryId, 'all'>>(
    selectedCategory !== 'all' ? selectedCategory : CATEGORIES[0].id
  );

  const categoryProductsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      setActiveBottomCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const randomWeightsRef = useRef<Record<string, number>>({});
  const getOrderWeight = (id: string) => {
    if (randomWeightsRef.current[id] === undefined) {
      randomWeightsRef.current[id] = Math.random();
    }
    return randomWeightsRef.current[id];
  };

  const filteredTopProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (under50k && p.price > 50000) return false;
        const q = searchQuery.trim().toLowerCase();
        const vendorName = VENDORS[p.vendorId]?.name.toLowerCase() ?? '';
        if (
          q &&
          !p.name.toLowerCase().includes(q) &&
          !p.nameEn.toLowerCase().includes(q) &&
          !p.district.toLowerCase().includes(q) &&
          !p.categoryLabelFr.toLowerCase().includes(q) &&
          !p.categoryLabelEn.toLowerCase().includes(q) &&
          !vendorName.includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return getOrderWeight(a.id) - getOrderWeight(b.id);
      });
  }, [products, under50k, searchQuery, sortBy]);

  const isFilteringTop = Boolean(searchQuery.trim()) || under50k || sortBy !== 'featured';
  const visibleTopProducts =
    isFilteringTop || showAllTopProducts
      ? filteredTopProducts
      : filteredTopProducts.slice(0, 8);

  const activeCategoryMeta =
    CATEGORIES.find((c) => c.id === activeBottomCategory) || CATEGORIES[0];

  const categoryProducts = useMemo(() => {
    return products
      .filter((p) => p.category === activeBottomCategory)
      .sort((a, b) => getOrderWeight(`cat-${a.id}`) - getOrderWeight(`cat-${b.id}`));
  }, [products, activeBottomCategory]);

  const handleCategoryClick = (catId: Exclude<CategoryId, 'all'>) => {
    setActiveBottomCategory(catId);
    onSelectCategory(catId);
    window.setTimeout(() => {
      categoryProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="space-y-10 pb-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#4F28E8]">
            {lang === 'fr' ? 'Catalogue & Rayons Bénin' : 'Benin Catalog & Departments'}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {lang === 'fr' ? 'Explorer le Catalogue' : 'Browse Marketplace'}
          </h1>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              lang === 'fr' ? 'Rechercher un produit ou quartier...' : 'Search product or district...'
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4F28E8] focus:outline-none"
          />
        </div>
      </div>

      {/* 1. Products Section (Top after Search) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#4F28E8]" />
              {lang === 'fr' ? 'Produits' : 'Products'}
              <span className="font-mono text-slate-400 tabular-nums">
                ({filteredTopProducts.length})
              </span>
            </span>

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

            {(under50k || searchQuery.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setUnder50k(false);
                  onSearchChange('');
                }}
                className="min-h-[36px] rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
              >
                {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
              </button>
            )}
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

        {filteredTopProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-slate-600">
              {lang === 'fr'
                ? 'Aucun produit disponible pour cette recherche.'
                : 'No products found for your search.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setUnder50k(false);
                onSearchChange('');
              }}
              className="mt-4 inline-flex min-h-[40px] items-center rounded-xl bg-[#4F28E8] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              {lang === 'fr' ? 'Voir tout le catalogue' : 'Show full catalog'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
              {visibleTopProducts.map((product) => (
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

            {!isFilteringTop && filteredTopProducts.length > 8 && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowAllTopProducts((prev) => !prev)}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#4F28E8]/25 bg-white px-5 py-2 text-xs font-bold text-[#4F28E8] transition-colors hover:bg-[#F2EFFB] cursor-pointer"
                >
                  <span>
                    {showAllTopProducts
                      ? lang === 'fr'
                        ? 'Réduire la liste'
                        : 'Show fewer products'
                      : lang === 'fr'
                      ? `Afficher tous les ${filteredTopProducts.length} produits`
                      : `Show all ${filteredTopProducts.length} products`}
                  </span>
                  {showAllTopProducts ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 2. Categories Section (Under Products) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {lang === 'fr' ? 'Toutes les Catégories' : 'Browse by Category'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'fr'
                ? 'Cliquez sur une catégorie pour découvrir ses articles juste en dessous'
                : 'Click any category to jump to its products section below'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const isSelected = activeBottomCategory === cat.id;
            const actualCount = products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`group flex flex-col overflow-hidden rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#4F28E8] bg-white ring-2 ring-[#4F28E8]/20 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-[#4F28E8]/40'
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
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#4F28E8]">
                    {lang === 'fr' ? cat.titleFr : cat.titleEn}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 truncate">
                    {lang === 'fr' ? cat.subtitleFr : cat.subtitleEn}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#4F28E8]">
                    <span className="font-mono tabular-nums">
                      {actualCount} {lang === 'fr' ? 'articles' : 'items'}
                    </span>
                    {isSelected ? (
                      <ArrowDown className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Selected Category Products Section (Directly Under Categories) */}
      <section
        ref={categoryProductsRef}
        id="category-products-section"
        className="scroll-mt-24 space-y-4 rounded-3xl border border-[#E7E3F8] bg-[#F5F3FC] p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#4F28E8]">
              {lang === 'fr' ? 'Rayon Sélectionné' : 'Selected Category'}
            </p>
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              {lang === 'fr' ? activeCategoryMeta.titleFr : activeCategoryMeta.titleEn}{' '}
              <span className="font-mono text-sm font-bold text-[#4F28E8] tabular-nums">
                ({categoryProducts.length})
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={`pill-${cat.id}`}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  activeBottomCategory === cat.id
                    ? 'bg-[#4F28E8] text-white'
                    : 'bg-white text-slate-700 hover:bg-[#EAE5FA]'
                }`}
              >
                {lang === 'fr' ? cat.titleFr : cat.titleEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard
              key={`cat-section-${product.id}`}
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
