import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Menu, X, ArrowRight, ArrowLeft, Bell } from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminStats from '@/components/admin/AdminStats';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminUsers from '@/components/admin/AdminUsers';

const tabs = [
  { id: 'stats', icon: LayoutDashboard, ar: 'الإحصائيات', en: 'Statistics' },
  { id: 'orders', icon: ShoppingBag, ar: 'الطلبات', en: 'Orders' },
  { id: 'products', icon: Package, ar: 'المنتجات', en: 'Products' },
  { id: 'users', icon: Users, ar: 'المستخدمين', en: 'Users' },
];

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdminCheck();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const ordersRefreshRef = useRef<(() => void) | null>(null);
  const isAr = language === 'ar';
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/');
  }, [loading, isAdmin]);

  // Realtime subscription for new orders
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as any;
          toast(isAr ? `🔔 طلب جديد من ${order.shipping_name}` : `🔔 New order from ${order.shipping_name}`, {
            description: `${order.total} ${isAr ? 'ر.س' : 'SAR'}`,
            action: {
              label: isAr ? 'عرض' : 'View',
              onClick: () => { setActiveTab('orders'); setNewOrderCount(0); },
            },
          });
          if (activeTab !== 'orders') {
            setNewOrderCount(prev => prev + 1);
          }
          ordersRefreshRef.current?.();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, isAr, activeTab]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'orders': return <AdminOrders onRefreshRef={(fn) => { ordersRefreshRef.current = fn; }} />;
      case 'products': return <AdminProducts />;
      case 'users': return <AdminUsers />;
      default: return <AdminStats />;
    }
  };

  return (
    <div className="min-h-[80vh] flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 z-40 md:z-0 h-screen md:h-auto w-64 bg-card border-e border-border p-4 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : isAr ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'} ${isAr ? 'right-0' : 'left-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-foreground">{isAr ? 'لوحة التحكم' : 'Dashboard'}</h2>
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-1 flex-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                <Icon className="w-5 h-5" />
                {isAr ? tab.ar : tab.en}
              </button>
            );
          })}
        </nav>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4">
          <BackArrow className="w-4 h-4" />
          {isAr ? 'العودة للمتجر' : 'Back to Store'}
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 min-w-0">
        <div className="flex items-center gap-3 mb-6 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg border border-border bg-card">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {isAr ? tabs.find(t => t.id === activeTab)?.ar : tabs.find(t => t.id === activeTab)?.en}
          </h1>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
