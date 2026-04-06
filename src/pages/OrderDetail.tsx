import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ArrowLeft, ArrowRight, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
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

const stages = [
  { key: 'pending', icon: Clock, ar: 'قيد الانتظار', en: 'Pending' },
  { key: 'processing', icon: Package, ar: 'جارٍ التجهيز', en: 'Processing' },
  { key: 'shipped', icon: Truck, ar: 'تم الشحن', en: 'Shipped' },
  { key: 'delivered', icon: CheckCircle, ar: 'تم التوصيل', en: 'Delivered' },
];

const paymentLabels: Record<string, { ar: string; en: string }> = {
  cod: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
  card: { ar: 'بطاقة ائتمانية', en: 'Credit Card' },
  bank: { ar: 'تحويل بنكي', en: 'Bank Transfer' },
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const isAr = language === 'ar';
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    if (id) fetchOrder();
  }, [user, id]);

  const fetchOrder = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id!)
      .maybeSingle();
    if (data) setOrder(data);
    setLoading(false);
  };

  if (!user) return null;

  const currentStageIndex = stages.findIndex(s => s.key === order?.status);
  const progressPercent = order ? Math.max(((currentStageIndex + 1) / stages.length) * 100, 25) : 0;
  const items = order ? (Array.isArray(order.items) ? order.items : []) : [];
  const payment = order ? (paymentLabels[order.payment_method] || paymentLabels.cod) : paymentLabels.cod;

  return (
    <main className="container mx-auto px-4 py-8 min-h-[60vh] max-w-2xl">
      <Link to="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <BackArrow className="w-4 h-4" />
        <span className="text-sm">{isAr ? 'طلباتي' : 'My Orders'}</span>
      </Link>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-secondary/50 animate-pulse" />)}
        </div>
      ) : !order ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">{isAr ? 'الطلب غير موجود' : 'Order not found'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-foreground">
                {isAr ? 'تفاصيل الطلب' : 'Order Details'}
              </h1>
              <span className="text-sm font-mono text-muted-foreground">#{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{new Date(order.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="font-bold text-foreground">{order.total} {t('currency')}</span>
            </div>
          </div>

          {/* Tracking Progress */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h2 className="font-bold text-foreground text-lg mb-6">
              {isAr ? 'تتبع الشحن' : 'Shipping Tracking'}
            </h2>

            <Progress value={progressPercent} className="h-2 mb-8" />

            <div className="grid grid-cols-4 gap-2">
              {stages.map((stage, i) => {
                const Icon = stage.icon;
                const isActive = i <= currentStageIndex;
                const isCurrent = i === currentStageIndex;
                return (
                  <div key={stage.key} className="flex flex-col items-center text-center">
                    <motion.div
                      initial={false}
                      animate={{ scale: isCurrent ? 1.15 : 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      } ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {isAr ? stage.ar : stage.en}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-bold text-foreground">{isAr ? 'المنتجات' : 'Items'} ({items.length})</h2>
            </div>
            <div className="space-y-3">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 px-3 rounded-xl bg-secondary/40 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image && <img src={item.image} alt="" className="w-12 h-12 object-contain rounded-lg" />}
                    <div className="min-w-0">
                      <p className="text-foreground font-medium truncate">{isAr ? item.name?.ar : item.name?.en || item.name}</p>
                      <p className="text-muted-foreground text-xs">×{item.quantity || 1}</p>
                    </div>
                  </div>
                  <span className="text-foreground font-bold whitespace-nowrap">{item.price} {t('currency')}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="font-bold text-foreground">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="text-lg font-bold text-primary">{order.total} {t('currency')}</span>
            </div>
          </motion.div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-bold text-foreground text-sm">{isAr ? 'عنوان الشحن' : 'Shipping Address'}</h3>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{order.shipping_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}</p>
                <p dir="ltr">{order.shipping_phone}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-bold text-foreground text-sm">{isAr ? 'طريقة الدفع' : 'Payment Method'}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{isAr ? payment.ar : payment.en}</p>
              <Badge variant="outline" className="mt-2 text-xs">
                {stages[currentStageIndex]
                  ? (isAr ? stages[currentStageIndex].ar : stages[currentStageIndex].en)
                  : (isAr ? 'قيد الانتظار' : 'Pending')}
              </Badge>
            </motion.div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderDetail;
