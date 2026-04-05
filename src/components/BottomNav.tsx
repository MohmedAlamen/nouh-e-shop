import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/products', icon: Search, label: t('nav.products') },
    { path: '/wishlist', icon: Heart, label: t('nav.wishlist') || 'المفضلة' },
    { path: '/cart', icon: ShoppingCart, label: t('nav.cart') || 'السلة' },
    { path: user ? '/profile' : '/auth', icon: User, label: t('nav.profile') || 'حسابي' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const badge =
            item.path === '/cart' ? totalItems :
            item.path === '/wishlist' ? wishlist.length : 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center font-bold"
                  >
                    {badge}
                  </motion.span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
