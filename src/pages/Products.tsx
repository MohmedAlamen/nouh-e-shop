import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const allBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brands) as string[];
  }, []);

  const allSubcategories = useMemo(() => {
    const subs = new Set(products.map(p => p.subcategory).filter(Boolean));
    return Array.from(subs) as string[];
  }, []);

  const subcategoryLabels: Record<string, { ar: string; en: string }> = {
    audio: { ar: 'سماعات', en: 'Audio' },
    cases: { ar: 'أغطية وحماية', en: 'Cases & Protection' },
    chargers: { ar: 'شواحن وكوابل', en: 'Chargers & Cables' },
    mounts: { ar: 'حوامل', en: 'Mounts' },
  };

  const filtered = useMemo(() => {
    let result = products;
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.ar.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.description.ar.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q)
      );
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
    }
    if (selectedSubcategory) {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'priceLow': return [...result].sort((a, b) => a.price - b.price);
      case 'priceHigh': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      default: return result;
    }
  }, [categoryFilter, search, sortBy, selectedBrands, selectedSubcategory, inStockOnly, minRating, priceRange]);

  const activeFiltersCount = [
    selectedBrands.length > 0,
    selectedSubcategory !== '',
    inStockOnly,
    minRating > 0,
    priceRange[0] > 0 || priceRange[1] < 6000,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSubcategory('');
    setInStockOnly(false);
    setMinRating(0);
    setPriceRange([0, 6000]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const categories = [
    { value: '', label: t('filter.all') },
    { value: 'phones', label: t('nav.phones') },
    { value: 'accessories', label: t('nav.accessories') },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('nav.products')}</h1>
        <span className="text-sm text-muted-foreground">
          {filtered.length} {language === 'ar' ? 'منتج' : 'products'}
        </span>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => {
                if (cat.value) {
                  setSearchParams({ category: cat.value });
                } else {
                  setSearchParams({});
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                (categoryFilter || '') === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showFilters || activeFiltersCount > 0
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {language === 'ar' ? 'فلاتر' : 'Filters'}
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary ms-auto"
          >
            <option value="newest">{t('filter.newest')}</option>
            <option value="priceLow">{t('filter.priceLow')}</option>
            <option value="priceHigh">{t('filter.priceHigh')}</option>
            <option value="rating">{language === 'ar' ? 'التقييم' : 'Rating'}</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  {language === 'ar' ? 'فلاتر متقدمة' : 'Advanced Filters'}
                </h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                    {language === 'ar' ? 'مسح الكل' : 'Clear all'}
                  </button>
                )}
              </div>

              {/* Brands */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {language === 'ar' ? 'العلامة التجارية' : 'Brand'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {allBrands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedBrands.includes(brand)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              {categoryFilter === 'accessories' && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedSubcategory('')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        !selectedSubcategory
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {t('filter.all')}
                    </button>
                    {allSubcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedSubcategory === sub
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {subcategoryLabels[sub]?.[language] || sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {language === 'ar' ? 'السعر' : 'Price'}: {priceRange[0]} - {priceRange[1]} {t('currency')}
                </p>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min={0}
                    max={6000}
                    step={100}
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1 accent-primary"
                  />
                  <input
                    type="range"
                    min={0}
                    max={6000}
                    step={100}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-primary"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {language === 'ar' ? 'الحد الأدنى للتقييم' : 'Min Rating'}
                </p>
                <div className="flex gap-1.5">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                        minRating === r
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {r === 0 ? (language === 'ar' ? 'الكل' : 'All') : (
                        <>
                          {r}+
                          <Star className="w-3 h-3 fill-current" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-xs text-foreground">
                  {language === 'ar' ? 'المتوفر فقط' : 'In stock only'}
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {selectedBrands.map(brand => (
            <span
              key={brand}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
            >
              {brand}
              <button onClick={() => toggleBrand(brand)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedSubcategory && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
              {subcategoryLabels[selectedSubcategory]?.[language] || selectedSubcategory}
              <button onClick={() => setSelectedSubcategory('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-4">
            {language === 'ar' ? 'لا توجد منتجات مطابقة' : 'No matching products found'}
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
          </button>
        </div>
      )}
    </main>
  );
};

export default Products;
