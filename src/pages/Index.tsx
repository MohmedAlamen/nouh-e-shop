import { Link } from 'react-router-dom';
import { Smartphone, Headphones, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const Index = () => {
  const { t, language } = useLanguage();
  const featured = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.isNew);

  const categories = [
    { icon: Smartphone, name: language === 'ar' ? 'هواتف ذكية' : 'Smartphones', link: '/products?category=phones' },
    { icon: Headphones, name: language === 'ar' ? 'سماعات' : 'Audio', link: '/products?category=accessories' },
    { icon: ShieldCheck, name: language === 'ar' ? 'أغطية حماية' : 'Cases', link: '/products?category=accessories' },
    { icon: Zap, name: language === 'ar' ? 'شواحن' : 'Chargers', link: '/products?category=accessories' },
  ];

  return (
    <main>
      <HeroSection />

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">{t('section.categories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={cat.link}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                  <cat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground text-sm">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t('section.featured')}</h2>
          <Link to="/products" className="text-sm text-primary font-medium hover:underline">
            {language === 'ar' ? 'عرض الكل' : 'View All'}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('section.new')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Trust Banner */}
      <section className="container mx-auto px-4 py-12">
        <div className="gradient-hero rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            {language === 'ar' ? 'لماذا NOUH STORE؟' : 'Why NOUH STORE?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { title: language === 'ar' ? 'شحن سريع' : 'Fast Shipping', desc: language === 'ar' ? 'توصيل خلال 24 ساعة' : 'Delivery within 24 hours' },
              { title: language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee', desc: language === 'ar' ? 'منتجات أصلية 100%' : '100% Original Products' },
              { title: language === 'ar' ? 'دعم فني' : 'Tech Support', desc: language === 'ar' ? 'دعم على مدار الساعة' : '24/7 Support' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <h3 className="font-bold text-primary-foreground text-lg mb-1">{item.title}</h3>
                <p className="text-primary-foreground/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
