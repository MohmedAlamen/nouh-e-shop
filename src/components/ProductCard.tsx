import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Badges */}
      <div className="absolute top-3 start-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="px-2 py-0.5 rounded-md gradient-accent text-accent-foreground text-xs font-bold">
            {language === 'ar' ? 'جديد' : 'NEW'}
          </span>
        )}
        {product.originalPrice && (
          <span className="px-2 py-0.5 rounded-md bg-destructive text-destructive-foreground text-xs font-bold">
            {Math.round((1 - product.price / product.originalPrice) * 100)}%-
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block p-6 pb-2">
        <div className="aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-secondary/50">
          <img
            src={product.image}
            alt={product.name[language]}
            className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 pt-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-foreground text-sm mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name[language]}
          </h3>
        </Link>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
          {product.description[language]}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-border'}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ms-1">({product.rating})</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-lg">
              {product.price}
            </span>
            <span className="text-xs text-muted-foreground">{t('currency')}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            aria-label={t('product.addToCart')}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
