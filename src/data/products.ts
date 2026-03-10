import phone1 from '@/assets/phone1.png';
import phone2 from '@/assets/phone2.png';
import phone3 from '@/assets/phone3.png';
import accessory1 from '@/assets/accessory1.png';
import accessory2 from '@/assets/accessory2.png';
import accessory3 from '@/assets/accessory3.png';
import accessory4 from '@/assets/accessory4.png';

export interface Product {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: number;
  originalPrice?: number;
  image: string;
  category: 'phones' | 'accessories';
  subcategory?: string;
  brand?: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  rating: number;
  specs?: { ar: string; en: string }[];
}

export const products: Product[] = [
  {
    id: '1',
    name: { ar: 'هاتف Galaxy Ultra Pro', en: 'Galaxy Ultra Pro' },
    description: {
      ar: 'هاتف ذكي متطور بشاشة AMOLED 6.8 بوصة وكاميرا 200 ميجابكسل وبطارية 5000 مللي أمبير',
      en: 'Advanced smartphone with 6.8" AMOLED display, 200MP camera, and 5000mAh battery',
    },
    price: 4299,
    originalPrice: 4999,
    image: phone1,
    category: 'phones',
    brand: 'Samsung',
    inStock: true,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    specs: [
      { ar: 'شاشة 6.8 بوصة AMOLED', en: '6.8" AMOLED Display' },
      { ar: 'كاميرا 200 ميجابكسل', en: '200MP Camera' },
      { ar: '12 جيجا رام', en: '12GB RAM' },
      { ar: '256 جيجا تخزين', en: '256GB Storage' },
    ],
  },
  {
    id: '2',
    name: { ar: 'هاتف Nova X5', en: 'Nova X5' },
    description: {
      ar: 'هاتف أنيق بتصميم زجاجي وكاميرا ثلاثية ومعالج فائق السرعة',
      en: 'Sleek glass design phone with triple camera and ultra-fast processor',
    },
    price: 2899,
    image: phone2,
    category: 'phones',
    brand: 'Huawei',
    inStock: true,
    isFeatured: true,
    rating: 4.5,
    specs: [
      { ar: 'شاشة 6.5 بوصة LCD', en: '6.5" LCD Display' },
      { ar: 'كاميرا ثلاثية 64 ميجابكسل', en: '64MP Triple Camera' },
      { ar: '8 جيجا رام', en: '8GB RAM' },
      { ar: '128 جيجا تخزين', en: '128GB Storage' },
    ],
  },
  {
    id: '3',
    name: { ar: 'هاتف Prestige Gold', en: 'Prestige Gold' },
    description: {
      ar: 'إصدار فاخر بتصميم ذهبي مميز ومواصفات استثنائية',
      en: 'Luxury gold edition with exceptional specifications',
    },
    price: 5499,
    originalPrice: 5999,
    image: phone3,
    category: 'phones',
    brand: 'Apple',
    inStock: true,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    specs: [
      { ar: 'شاشة 6.9 بوصة OLED', en: '6.9" OLED Display' },
      { ar: 'كاميرا 108 ميجابكسل', en: '108MP Camera' },
      { ar: '16 جيجا رام', en: '16GB RAM' },
      { ar: '512 جيجا تخزين', en: '512GB Storage' },
    ],
  },
  {
    id: '4',
    name: { ar: 'سماعات لاسلكية Pro', en: 'Wireless Earbuds Pro' },
    description: {
      ar: 'سماعات لاسلكية بتقنية إلغاء الضوضاء وجودة صوت فائقة',
      en: 'Wireless earbuds with noise cancellation and premium sound quality',
    },
    price: 349,
    originalPrice: 449,
    image: accessory1,
    category: 'accessories',
    subcategory: 'audio',
    brand: 'Sony',
    inStock: true,
    isFeatured: true,
    rating: 4.6,
  },
  {
    id: '5',
    name: { ar: 'غطاء حماية شفاف', en: 'Clear Protective Case' },
    description: {
      ar: 'غطاء حماية شفاف عالي الجودة يحمي هاتفك من الصدمات',
      en: 'High-quality transparent case that protects your phone from impacts',
    },
    price: 79,
    image: accessory2,
    category: 'accessories',
    subcategory: 'cases',
    brand: 'Spigen',
    inStock: true,
    rating: 4.3,
  },
  {
    id: '6',
    name: { ar: 'كيبل شحن سريع USB-C', en: 'Fast Charging USB-C Cable' },
    description: {
      ar: 'كيبل شحن سريع مضفر عالي الجودة يدعم الشحن السريع',
      en: 'Premium braided fast charging cable with quick charge support',
    },
    price: 49,
    image: accessory3,
    category: 'accessories',
    subcategory: 'chargers',
    brand: 'Anker',
    inStock: true,
    rating: 4.4,
  },
  {
    id: '7',
    name: { ar: 'شاحن لاسلكي', en: 'Wireless Charger' },
    description: {
      ar: 'شاحن لاسلكي أنيق بقدرة 15 واط للشحن السريع',
      en: 'Sleek 15W wireless charger for fast charging',
    },
    price: 149,
    originalPrice: 199,
    image: accessory4,
    category: 'accessories',
    subcategory: 'chargers',
    brand: 'Samsung',
    inStock: true,
    isNew: true,
    rating: 4.7,
  },
  // New products
  {
    id: '8',
    name: { ar: 'هاتف Pixel Vision', en: 'Pixel Vision' },
    description: {
      ar: 'هاتف بكاميرا ذكية مدعومة بالذكاء الاصطناعي وأداء استثنائي',
      en: 'AI-powered camera phone with exceptional performance',
    },
    price: 3599,
    originalPrice: 3999,
    image: phone1,
    category: 'phones',
    brand: 'Google',
    inStock: true,
    isNew: true,
    rating: 4.7,
    specs: [
      { ar: 'شاشة 6.7 بوصة OLED', en: '6.7" OLED Display' },
      { ar: 'كاميرا 50 ميجابكسل AI', en: '50MP AI Camera' },
      { ar: '12 جيجا رام', en: '12GB RAM' },
      { ar: '256 جيجا تخزين', en: '256GB Storage' },
    ],
  },
  {
    id: '9',
    name: { ar: 'هاتف Xperia Elite', en: 'Xperia Elite' },
    description: {
      ar: 'هاتف احترافي للتصوير بدقة سينمائية ومقاومة للماء',
      en: 'Professional cinema-grade camera phone, water resistant',
    },
    price: 3899,
    image: phone2,
    category: 'phones',
    brand: 'Sony',
    inStock: true,
    isFeatured: true,
    rating: 4.6,
    specs: [
      { ar: 'شاشة 6.5 بوصة 4K', en: '6.5" 4K Display' },
      { ar: 'كاميرا ثلاثية 48 ميجابكسل', en: '48MP Triple Camera' },
      { ar: '12 جيجا رام', en: '12GB RAM' },
      { ar: '256 جيجا تخزين', en: '256GB Storage' },
    ],
  },
  {
    id: '10',
    name: { ar: 'هاتف OnePlus Turbo', en: 'OnePlus Turbo' },
    description: {
      ar: 'هاتف فائق السرعة بشحن 100 واط ومعالج Snapdragon',
      en: 'Ultra-fast phone with 100W charging and Snapdragon processor',
    },
    price: 2499,
    image: phone3,
    category: 'phones',
    brand: 'OnePlus',
    inStock: true,
    rating: 4.4,
    specs: [
      { ar: 'شاشة 6.7 بوصة AMOLED', en: '6.7" AMOLED Display' },
      { ar: 'شحن سريع 100 واط', en: '100W Fast Charging' },
      { ar: '16 جيجا رام', en: '16GB RAM' },
      { ar: '256 جيجا تخزين', en: '256GB Storage' },
    ],
  },
  {
    id: '11',
    name: { ar: 'سماعة رأس لاسلكية', en: 'Wireless Headphones' },
    description: {
      ar: 'سماعة رأس فاخرة مع إلغاء ضوضاء نشط وبطارية 30 ساعة',
      en: 'Premium over-ear headphones with ANC and 30h battery',
    },
    price: 599,
    originalPrice: 749,
    image: accessory1,
    category: 'accessories',
    subcategory: 'audio',
    brand: 'Sony',
    inStock: true,
    isFeatured: true,
    rating: 4.8,
  },
  {
    id: '12',
    name: { ar: 'حامل هاتف للسيارة', en: 'Car Phone Mount' },
    description: {
      ar: 'حامل هاتف مغناطيسي للسيارة بتصميم أنيق وتثبيت قوي',
      en: 'Magnetic car phone mount with sleek design and strong hold',
    },
    price: 89,
    image: accessory2,
    category: 'accessories',
    subcategory: 'mounts',
    brand: 'Baseus',
    inStock: true,
    rating: 4.2,
  },
  {
    id: '13',
    name: { ar: 'باور بانك 20000', en: 'Power Bank 20000mAh' },
    description: {
      ar: 'بطارية متنقلة بسعة 20000 مللي أمبير مع شحن سريع',
      en: '20000mAh portable charger with fast charging support',
    },
    price: 199,
    originalPrice: 259,
    image: accessory3,
    category: 'accessories',
    subcategory: 'chargers',
    brand: 'Anker',
    inStock: true,
    isNew: true,
    rating: 4.5,
  },
  {
    id: '14',
    name: { ar: 'واقي شاشة زجاجي', en: 'Tempered Glass Screen Protector' },
    description: {
      ar: 'واقي شاشة من الزجاج المقوى بحماية 9H ومقاومة للخدوش',
      en: '9H hardness tempered glass screen protector, scratch resistant',
    },
    price: 39,
    image: accessory4,
    category: 'accessories',
    subcategory: 'cases',
    brand: 'Spigen',
    inStock: true,
    rating: 4.1,
  },
];
