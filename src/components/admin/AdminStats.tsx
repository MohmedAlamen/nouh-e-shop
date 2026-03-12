import { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Users, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { products } from '@/data/products';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminStats = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, reviews: 0 });
  const [ordersByStatus, setOrdersByStatus] = useState<{ name: string; value: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [ordersRes, profilesRes, reviewsRes] = await Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('profiles').select('id'),
      supabase.from('reviews').select('id'),
    ]);

    const orders = ordersRes.data || [];
    const revenue = orders.reduce((s, o) => s + Number(o.total), 0);

    setStats({
      orders: orders.length,
      revenue,
      users: profilesRes.data?.length || 0,
      reviews: reviewsRes.data?.length || 0,
    });

    // Orders by status
    const statusMap: Record<string, number> = {};
    orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
    const statusLabels: Record<string, string> = {
      pending: isAr ? 'قيد الانتظار' : 'Pending',
      processing: isAr ? 'جارٍ التجهيز' : 'Processing',
      shipped: isAr ? 'تم الشحن' : 'Shipped',
      delivered: isAr ? 'تم التوصيل' : 'Delivered',
    };
    setOrdersByStatus(Object.entries(statusMap).map(([k, v]) => ({ name: statusLabels[k] || k, value: v })));
    setRecentOrders(orders.slice(0, 5));
  };

  const cards = [
    { label: isAr ? 'إجمالي الطلبات' : 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-500 bg-blue-500/10' },
    { label: isAr ? 'الإيرادات' : 'Revenue', value: `${stats.revenue} ${t('currency')}`, icon: DollarSign, color: 'text-green-500 bg-green-500/10' },
    { label: isAr ? 'المستخدمين' : 'Users', value: stats.users, icon: Users, color: 'text-purple-500 bg-purple-500/10' },
    { label: isAr ? 'التقييمات' : 'Reviews', value: stats.reviews, icon: Star, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const PIE_COLORS = ['hsl(38,90%,55%)', 'hsl(185,72%,32%)', 'hsl(270,60%,55%)', 'hsl(140,60%,40%)'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 hidden md:block">
        {isAr ? 'الإحصائيات' : 'Statistics'}
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders by status pie */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4">{isAr ? 'الطلبات حسب الحالة' : 'Orders by Status'}</h3>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={ordersByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {ordersByStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-10">{isAr ? 'لا توجد بيانات' : 'No data'}</p>
          )}
        </div>

        {/* Products by category bar */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4">{isAr ? 'المنتجات حسب الفئة' : 'Products by Category'}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { name: isAr ? 'هواتف' : 'Phones', count: products.filter(p => p.category === 'phones').length },
              { name: isAr ? 'ملحقات' : 'Accessories', count: products.filter(p => p.category === 'accessories').length },
            ]}>
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(185,72%,32%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-foreground mb-4">{isAr ? 'آخر الطلبات' : 'Recent Orders'}</h3>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-start py-2 px-3">#</th>
                  <th className="text-start py-2 px-3">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="text-start py-2 px-3">{isAr ? 'المبلغ' : 'Amount'}</th>
                  <th className="text-start py-2 px-3">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="text-start py-2 px-3">{isAr ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="py-3 px-3">{o.shipping_name}</td>
                    <td className="py-3 px-3 font-medium">{o.total} {t('currency')}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{o.status}</span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-6">{isAr ? 'لا توجد طلبات' : 'No orders yet'}</p>
        )}
      </div>
    </div>
  );
};

export default AdminStats;
