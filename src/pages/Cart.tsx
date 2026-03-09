import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { t, language } = useLanguage();
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity"
        >
          {t('cart.continueShopping')}
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 flex-shrink-0 rounded-lg bg-secondary flex items-center justify-center">
                  <img src={item.product.image} alt={item.product.name[language]} className="w-16 h-16 object-contain" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-foreground text-sm hover:text-primary transition-colors">
                      {item.product.name[language]}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-1">
                    {item.product.description[language]}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-foreground w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">
                        {item.product.price * item.quantity} {t('currency')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
            <h2 className="font-bold text-foreground text-lg mb-4">
              {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            <div className="flex flex-col gap-3 border-b border-border pb-4 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name[language]} × {item.quantity}
                  </span>
                  <span className="text-foreground font-medium">
                    {item.product.price * item.quantity} {t('currency')}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-foreground text-lg">{t('cart.total')}</span>
              <span className="font-bold text-foreground text-2xl">{totalPrice} {t('currency')}</span>
            </div>
            <button className="w-full py-3.5 rounded-xl gradient-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity">
              {t('cart.checkout')}
            </button>
            <Link
              to="/products"
              className="block text-center text-sm text-primary mt-4 hover:underline"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
