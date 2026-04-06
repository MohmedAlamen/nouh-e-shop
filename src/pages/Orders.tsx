import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  items: any;
  total: number;
  status: string;
  payment_method: string;
  shipping_name: string;
  shipping_city: string;
  shipping_address: string;
  shipping_phone: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: any; colorClass: string; ar: string; en: string }> = {
  pending: { icon: Clock, colorClass: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', ar: 'قيد الانتظار', en: 'Pending' },
  processing: { icon: Package, colorClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20', ar: 'جارٍ التجهيز', en: 'Processing' },
  shipped: { icon: Truck, colorClass: 'bg-purple-500/10 text-purple-600 border-purple-500/20', ar: 'تم الشحن', en: 'Shipped' },
  delivered: { icon: CheckCircle, colorClass: 'bg-green-500/10 text-green-600 border-green-500/20', ar: 'تم التوصيل', en: 'Delivered' },
};

const paymentLabels: Record<string, { ar: string; en: string }> = {
  cod: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
  card: { ar: 'بطاقة ائتمانية', en: 'Credit Card' },
  bank: { ar: 'تحويل بنكي', en: 'Bank Transfer' },
};

const Orders = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isAr = language === 'ar';
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <main className="container mx-auto px-4 py-8 min-h-[60vh]">
      <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <BackArrow className="w-4 h-4" />
        <span className="text-sm">{isAr ? 'الملف الشخصي' : 'Profile'}</span>
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isAr ? 'طلباتي' : 'My Orders'}
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-secondary/50 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-4">
            {isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity">
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const isExpanded = expandedId === order.id;
            const items = Array.isArray(order.items) ? order.items : [];
            const payment = paymentLabels[order.payment_method] || paymentLabels.cod;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <Link
                  to={`/order/${order.id}`}
                  className="w-full flex items-center justify-between p-5 text-start hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-sm font-mono text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <Badge variant="outline" className={`${status.colorClass} border text-xs`}>
                        <StatusIcon className="w-3 h-3 me-1" />
                        {isAr ? status.ar : status.en}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{new Date(order.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
                      <span>{items.length} {isAr ? 'منتجات' : 'items'}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-lg font-bold text-foreground">{order.total}</span>
                    <span className="text-sm text-muted-foreground ms-1">{t('currency')}</span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-border px-5 pb-5"
                  >
                    {/* Items */}
                    <div className="pt-4 mb-4">
                      <h4 className="text-sm font-bold text-foreground mb-3">
                        {isAr ? 'المنتجات' : 'Items'}
                      </h4>
                      <div className="space-y-2">
                        {items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 text-sm">
                            <div className="flex items-center gap-3 min-w-0">
                              {item.image && <img src={item.image} alt="" className="w-10 h-10 object-contain rounded" />}
                              <span className="text-foreground truncate">{isAr ? item.name?.ar : item.name?.en || item.name}</span>
                              <span className="text-muted-foreground">×{item.quantity || 1}</span>
                            </div>
                            <span className="text-foreground font-medium whitespace-nowrap">
                              {item.price} {t('currency')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-secondary/30">
                        <h4 className="text-sm font-bold text-foreground mb-2">
                          {isAr ? 'عنوان الشحن' : 'Shipping Address'}
                        </h4>
                        <p className="text-sm text-muted-foreground">{order.shipping_name}</p>
                        <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
                        <p className="text-sm text-muted-foreground">{order.shipping_city}</p>
                        <p className="text-sm text-muted-foreground">{order.shipping_phone}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/30">
                        <h4 className="text-sm font-bold text-foreground mb-2">
                          {isAr ? 'طريقة الدفع' : 'Payment Method'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isAr ? payment.ar : payment.en}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Orders;
