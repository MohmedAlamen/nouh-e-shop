import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, CreditCard, Banknote, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const Checkout = () => {
  const { language, t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = language === 'ar';
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg mb-4">
          {isAr ? 'سجل الدخول لإتمام الشراء' : 'Please sign in to checkout'}
        </p>
        <Link to="/auth" className="text-primary hover:underline font-medium">
          {isAr ? 'تسجيل الدخول' : 'Sign In'}
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg mb-4">
          {isAr ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
        </p>
        <Link to="/products" className="text-primary hover:underline font-medium">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-20 text-center max-w-md"
      >
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {isAr ? 'تم تأكيد الطلب!' : 'Order Confirmed!'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isAr ? 'شكراً لك! سيتم التواصل معك قريباً لتأكيد التوصيل.' : 'Thank you! We will contact you soon to confirm delivery.'}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity"
        >
          {t('cart.continueShopping')}
        </Link>
      </motion.div>
    );
  }

  const shipping = 25;
  const grandTotal = totalPrice + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      toast.error(isAr ? 'يرجى تعبئة جميع الحقول' : 'Please fill in all fields');
      return;
    }

    setSubmitting(true);

    const orderItems = items.map(item => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      items: orderItems as any,
      total: grandTotal,
      payment_method: paymentMethod,
      shipping_name: form.name.trim(),
      shipping_phone: form.phone.trim(),
      shipping_address: form.address.trim(),
      shipping_city: form.city.trim(),
    });

    if (error) {
      toast.error(isAr ? 'حدث خطأ أثناء إنشاء الطلب' : 'Error placing order');
    } else {
      clearCart();
      setOrderPlaced(true);
    }
    setSubmitting(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <BackArrow className="w-4 h-4" />
        <span className="text-sm">{isAr ? 'العودة للسلة' : 'Back to cart'}</span>
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isAr ? 'إتمام الشراء' : 'Checkout'}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-3 space-y-8">
          {/* Shipping Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {isAr ? 'عنوان التوصيل' : 'Shipping Address'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5 text-sm">
                  <User className="w-3.5 h-3.5" />
                  {isAr ? 'الاسم الكامل' : 'Full Name'}
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'}
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm">
                  <Phone className="w-3.5 h-3.5" />
                  {isAr ? 'رقم الهاتف' : 'Phone Number'}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder={isAr ? '05xxxxxxxx' : '05xxxxxxxx'}
                  maxLength={15}
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address" className="text-sm">
                  {isAr ? 'العنوان التفصيلي' : 'Detailed Address'}
                </Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder={isAr ? 'الحي، الشارع، رقم المبنى' : 'District, Street, Building No.'}
                  maxLength={200}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm">
                  {isAr ? 'المدينة' : 'City'}
                </Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder={isAr ? 'الرياض' : 'Riyadh'}
                  maxLength={50}
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {isAr ? 'طريقة الدفع' : 'Payment Method'}
            </h2>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <label
                htmlFor="cod"
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}`}
              >
                <RadioGroupItem value="cod" id="cod" />
                <Banknote className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? 'ادفع نقداً عند استلام الطلب' : 'Pay cash when you receive your order'}</p>
                </div>
              </label>

              <label
                htmlFor="card"
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}`}
              >
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">{isAr ? 'بطاقة ائتمان' : 'Credit Card'}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? 'فيزا، ماستركارد، مدى' : 'Visa, Mastercard, Mada'}</p>
                </div>
              </label>

              <label
                htmlFor="transfer"
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}`}
              >
                <RadioGroupItem value="transfer" id="transfer" />
                <Banknote className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">{isAr ? 'تحويل بنكي' : 'Bank Transfer'}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? 'حوّل المبلغ وأرسل الإيصال' : 'Transfer and send receipt'}</p>
                </div>
              </label>
            </RadioGroup>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-5">
              {isAr ? 'ملخص الطلب' : 'Order Summary'}
            </h2>

            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.image} alt="" className="w-12 h-12 object-contain rounded-lg bg-secondary p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.product.name[language]}</p>
                    <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">
                    {item.product.price * item.quantity} {t('currency')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="text-foreground">{totalPrice} {t('currency')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isAr ? 'التوصيل' : 'Shipping'}</span>
                <span className="text-foreground">{shipping} {t('currency')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span className="text-foreground">{isAr ? 'الإجمالي' : 'Total'}</span>
                <span className="text-primary">{grandTotal} {t('currency')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-3.5 rounded-xl gradient-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-hero"
            >
              {submitting
                ? (isAr ? 'جارٍ تأكيد الطلب...' : 'Placing order...')
                : (isAr ? 'تأكيد الطلب' : 'Place Order')}
            </button>
          </div>
        </motion.div>
      </form>
    </main>
  );
};

export default Checkout;
