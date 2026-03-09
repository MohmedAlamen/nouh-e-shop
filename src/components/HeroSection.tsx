import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-6">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBanner} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent dark:from-background/90 dark:via-background/60" />
      </div>

      <div className="relative container mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-lg"
        >
          <span className="inline-block px-3 py-1 rounded-full gradient-accent text-accent-foreground text-xs font-bold mb-4">
            {language === 'ar' ? '🔥 عروض حصرية' : '🔥 Exclusive Deals'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-4 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-card/80 text-lg mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity shadow-hero"
            >
              {t('hero.cta')}
              <Arrow className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/20 text-card font-medium backdrop-blur-sm border border-card/30 hover:bg-card/30 transition-colors"
            >
              {t('hero.explore')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
