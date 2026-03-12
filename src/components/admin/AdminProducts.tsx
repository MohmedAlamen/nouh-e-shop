import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { products, Product } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star } from 'lucide-react';

const AdminProducts = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.ar.includes(search) || p.name.en.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground hidden md:block">{isAr ? 'المنتجات' : 'Products'}</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={isAr ? 'بحث...' : 'Search...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-start py-3 px-4">{isAr ? 'المنتج' : 'Product'}</th>
                <th className="text-start py-3 px-4">{isAr ? 'الفئة' : 'Category'}</th>
                <th className="text-start py-3 px-4">{isAr ? 'السعر' : 'Price'}</th>
                <th className="text-start py-3 px-4">{isAr ? 'التقييم' : 'Rating'}</th>
                <th className="text-start py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 object-contain rounded-lg bg-secondary/50 p-1" />
                      <div>
                        <p className="font-medium text-foreground">{p.name[language]}</p>
                        {p.brand && <p className="text-xs text-muted-foreground">{p.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="text-xs">
                      {p.category === 'phones' ? (isAr ? 'هواتف' : 'Phones') : (isAr ? 'ملحقات' : 'Accessories')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">{p.price} {t('currency')}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span>{p.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={p.inStock ? 'default' : 'destructive'} className="text-xs">
                      {p.inStock ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Out of Stock')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        {isAr ? `${filtered.length} منتج` : `${filtered.length} products`}
      </p>
    </div>
  );
};

export default AdminProducts;
