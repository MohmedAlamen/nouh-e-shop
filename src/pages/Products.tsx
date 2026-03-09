import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const Products = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(() => {
    let result = products;
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.ar.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'priceLow': return [...result].sort((a, b) => a.price - b.price);
      case 'priceHigh': return [...result].sort((a, b) => b.price - a.price);
      default: return result;
    }
  }, [categoryFilter, search, sortBy]);

  const categories = [
    { value: '', label: t('filter.all') },
    { value: 'phones', label: t('nav.phones') },
    { value: 'accessories', label: t('nav.accessories') },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t('nav.products')}</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <a
              key={cat.value}
              href={cat.value ? `/products?category=${cat.value}` : '/products'}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                (categoryFilter || '') === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </a>
          ))}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">{t('filter.newest')}</option>
            <option value="priceLow">{t('filter.priceLow')}</option>
            <option value="priceHigh">{t('filter.priceHigh')}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            {language === 'ar' ? 'لا توجد منتجات مطابقة' : 'No matching products found'}
          </p>
        </div>
      )}
    </main>
  );
};

export default Products;
