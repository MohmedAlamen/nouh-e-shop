import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const UserDashboard = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { isAdmin } = useAdminCheck();
  const isAr = language === 'ar';

  const [stats, setStats] = useState({ orders: 0, totalSpent: 0, reviews: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const [ordersRes, reviewsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('id').eq('user_id', user!.id),
    ]);
    const orders = ordersRes.data || [];
    setStats({
      orders: orders.length,
      totalSpent: orders.reduce((s, o) => s + Number(o.total), 0),
      reviews: reviewsRes.data?.length || 0,
    });
    setRecentOrders(orders.slice(0, 3));
  };

  if (!user) return null;

  const cards = [
    { label: isAr ? 'طلباتي' : 'My Orders', value: stats.orders, icon: ShoppingBag, link: '/orders', color: 'text-blue-500 bg-blue-500/10' },
    { label: isAr ? 'المفضلة' : 'Wishlist', value: wishlist.length, icon: Heart, link: '/wishlist', color: 'text-red-500 bg-red-500/10' },
    { label: isAr ? 'تقييماتي' : 'My Reviews', value: stats.reviews, icon: Star, link: '/products', color: 'text-amber-500 bg-amber-500/10' },
    { label: isAr ? 'إجمالي الإنفاق' : 'Total Spent', value: `${stats.totalSpent} ${t('currency')}`, icon: Package, link: '/orders', color: 'text-green-500 bg-green-500/10' },
  ];

  const statusLabels: Record<string, string> = {
    pending: isAr ? 'قيد الانتظار' : 'Pending',
    processing: isAr ? 'جارٍ التجهيز' : 'Processing',
    shipped: isAr ? 'تم الشحن' : 'Shipped',
    delivered: isAr ? 'تم التوصيل' : 'Delivered',
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">{isAr ? 'لوحة التحكم' : 'Dashboard'}</h1>
        {isAdmin && (
          <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-accent text-accent-foreground text-sm font-bold hover:opacity-90 transition-opacity">
            {isAr ? 'لوحة الأدمن' : 'Admin Panel'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} to={card.link}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-foreground text-lg">{isAr ? 'آخر الطلبات' : 'Recent Orders'}</h2>
          <Link to="/orders" className="text-sm text-primary hover:underline">{isAr ? 'عرض الكل' : 'View all'}</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => {
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                    <p className="text-sm text-muted-foreground">{items.length} {isAr ? 'منتجات' : 'items'}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-foreground">{order.total} {t('currency')}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default UserDashboard;
