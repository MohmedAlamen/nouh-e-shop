import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'store.name': 'NOUH STORE',
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.phones': 'الهواتف',
    'nav.accessories': 'الملحقات',
    'nav.cart': 'السلة',
    'nav.login': 'تسجيل الدخول',
    'hero.title': 'أحدث الهواتف الذكية',
    'hero.subtitle': 'اكتشف تشكيلتنا المميزة من الهواتف والملحقات بأفضل الأسعار',
    'hero.cta': 'تسوق الآن',
    'hero.explore': 'استكشف المنتجات',
    'section.featured': 'منتجات مميزة',
    'section.categories': 'التصنيفات',
    'section.new': 'وصل حديثاً',
    'section.deals': 'عروض خاصة',
    'category.phones': 'الهواتف الذكية',
    'category.accessories': 'الملحقات',
    'category.cases': 'الأغطية',
    'category.chargers': 'الشواحن',
    'product.addToCart': 'أضف للسلة',
    'product.details': 'التفاصيل',
    'product.specs': 'المواصفات',
    'product.reviews': 'التقييمات',
    'product.price': 'السعر',
    'product.inStock': 'متوفر',
    'product.outOfStock': 'غير متوفر',
    'cart.title': 'سلة المشتريات',
    'cart.empty': 'السلة فارغة',
    'cart.total': 'المجموع',
    'cart.checkout': 'إتمام الشراء',
    'cart.remove': 'إزالة',
    'cart.quantity': 'الكمية',
    'cart.continueShopping': 'متابعة التسوق',
    'footer.about': 'عن المتجر',
    'footer.aboutText': 'NOUH STORE متجرك الأول للهواتف الذكية وملحقاتها. نوفر أحدث المنتجات بأفضل الأسعار مع ضمان الجودة.',
    'footer.links': 'روابط سريعة',
    'footer.contact': 'تواصل معنا',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.newsletter': 'النشرة البريدية',
    'footer.subscribe': 'اشترك',
    'footer.email_placeholder': 'بريدك الإلكتروني',
    'filter.all': 'الكل',
    'filter.sort': 'ترتيب حسب',
    'filter.priceLow': 'السعر: الأقل',
    'filter.priceHigh': 'السعر: الأعلى',
    'filter.newest': 'الأحدث',
    'currency': 'ر.س',
    'search': 'ابحث عن منتج...',
  },
  en: {
    'store.name': 'NOUH STORE',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.phones': 'Phones',
    'nav.accessories': 'Accessories',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'hero.title': 'Latest Smartphones',
    'hero.subtitle': 'Discover our premium collection of phones and accessories at the best prices',
    'hero.cta': 'Shop Now',
    'hero.explore': 'Explore Products',
    'section.featured': 'Featured Products',
    'section.categories': 'Categories',
    'section.new': 'New Arrivals',
    'section.deals': 'Special Deals',
    'category.phones': 'Smartphones',
    'category.accessories': 'Accessories',
    'category.cases': 'Cases',
    'category.chargers': 'Chargers',
    'product.addToCart': 'Add to Cart',
    'product.details': 'Details',
    'product.specs': 'Specifications',
    'product.reviews': 'Reviews',
    'product.price': 'Price',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    'cart.continueShopping': 'Continue Shopping',
    'footer.about': 'About Us',
    'footer.aboutText': 'NOUH STORE is your go-to destination for smartphones and accessories. We offer the latest products at the best prices with quality guarantee.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All Rights Reserved',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'Subscribe',
    'footer.email_placeholder': 'Your email',
    'filter.all': 'All',
    'filter.sort': 'Sort by',
    'filter.priceLow': 'Price: Low',
    'filter.priceHigh': 'Price: High',
    'filter.newest': 'Newest',
    'currency': 'SAR',
    'search': 'Search products...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nouh-lang') as Language) || 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('nouh-lang', language);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, dir]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
