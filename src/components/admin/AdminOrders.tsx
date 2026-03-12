import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered'];
const statusLabels: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  processing: { ar: 'جارٍ التجهيز', en: 'Processing' },
  shipped: { ar: 'تم الشحن', en: 'Shipped' },
  delivered: { ar: 'تم التوصيل', en: 'Delivered' },
};

const AdminOrders = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) { toast.error(isAr ? 'حدث خطأ' : 'Error updating'); return; }
    toast.success(isAr ? 'تم تحديث الحالة' : 'Status updated');
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground hidden md:block">{isAr ? 'إدارة الطلبات' : 'Order Management'}</h1>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isAr ? 'الكل' : 'All'}</SelectItem>
            {statusOptions.map(s => (
              <SelectItem key={s} value={s}>{isAr ? statusLabels[s].ar : statusLabels[s].en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-secondary/50 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{isAr ? 'لا توجد طلبات' : 'No orders'}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                    <p className="font-medium text-foreground">{order.shipping_name}</p>
                    <p className="text-xs text-muted-foreground">{order.shipping_city} · {order.shipping_phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{order.total} {t('currency')}</span>
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s} value={s}>{isAr ? statusLabels[s].ar : statusLabels[s].en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item: any, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {isAr ? item.name?.ar : item.name?.en || item.name} ×{item.quantity || 1}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{new Date(order.created_at).toLocaleString(isAr ? 'ar-SA' : 'en-US')}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
