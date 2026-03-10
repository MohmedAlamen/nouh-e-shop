import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const product = products.find(p => p.id === id);
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">
          {language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
        </p>
        <Link to="/products" className="text-primary mt-4 inline-block hover:underline">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <BackArrow className="w-4 h-4" />
        <span className="text-sm">{t('nav.products')}</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-2xl border border-border p-8 flex items-center justify-center aspect-square"
        >
          <img
            src={product.image}
            alt={product.name[language]}
            className="w-3/4 h-3/4 object-contain"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          {product.isNew && (
            <span className="self-start px-3 py-1 rounded-lg gradient-accent text-accent-foreground text-xs font-bold mb-3">
              {language === 'ar' ? 'جديد' : 'NEW'}
            </span>
          )}
          <h1 className="text-3xl font-bold text-foreground mb-2">{product.name[language]}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-border'}`} />
            ))}
            <span className="text-sm text-muted-foreground ms-2">({product.rating})</span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.description[language]}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-foreground">{product.price}</span>
            <span className="text-muted-foreground">{t('currency')}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{product.originalPrice} {t('currency')}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">{t('product.inStock')}</span>
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="mb-6">
              <h3 className="font-bold text-foreground mb-3">{t('product.specs')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.map((spec, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg bg-secondary text-sm text-secondary-foreground">
                    {spec[language]}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex gap-3">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity shadow-hero"
            >
              <ShoppingCart className="w-5 h-5" />
              {t('product.addToCart')}
            </button>
            <button
              onClick={async () => {
                if (!user) {
                  toast.error(language === 'ar' ? 'سجل الدخول أولاً' : 'Please sign in first');
                  return;
                }
                const liked = isInWishlist(product.id);
                await toggleWishlist(product.id);
                toast.success(liked
                  ? (language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist')
                  : (language === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Added to wishlist')
                );
              }}
              className="p-3.5 rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {language === 'ar' ? 'منتجات مشابهة' : 'Related Products'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
