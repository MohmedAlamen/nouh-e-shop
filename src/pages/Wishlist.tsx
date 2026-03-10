import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const Wishlist = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {language === 'ar' ? 'قائمة المفضلة' : 'Wishlist'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === 'ar' ? 'سجل الدخول لحفظ منتجاتك المفضلة' : 'Sign in to save your favorite products'}
        </p>
        <Link to="/auth" className="inline-block px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity">
          {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <BackArrow className="w-4 h-4" />
        <span className="text-sm">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {language === 'ar' ? 'قائمة المفضلة' : 'Wishlist'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === 'ar' ? `${wishlistProducts.length} منتج` : `${wishlistProducts.length} product(s)`}
        </p>
      </motion.div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-4">
            {language === 'ar' ? 'لا توجد منتجات في المفضلة' : 'Your wishlist is empty'}
          </p>
          <Link to="/products" className="inline-block px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity">
            {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Wishlist;
