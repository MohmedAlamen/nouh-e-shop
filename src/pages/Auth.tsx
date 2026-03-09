import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register' | 'forgot';

const Auth = () => {
  const { t, language } = useLanguage();
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  const titles: Record<AuthMode, Record<string, string>> = {
    login: { ar: 'تسجيل الدخول', en: 'Sign In' },
    register: { ar: 'إنشاء حساب', en: 'Create Account' },
    forgot: { ar: 'نسيت كلمة المرور', en: 'Forgot Password' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully');
        navigate('/');
      } else if (mode === 'register') {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast.success(language === 'ar' ? 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني' : 'Account created. Check your email');
      } else {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast.success(language === 'ar' ? 'تم إرسال رابط إعادة التعيين' : 'Reset link sent to your email');
      }
    } catch (error: any) {
      toast.error(error.message || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <BackArrow className="w-4 h-4" />
          <span className="text-sm">{t('nav.home')}</span>
        </Link>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{titles[mode][language]}</h1>
            <p className="text-muted-foreground text-sm mt-1">NOUH STORE</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full ps-10 pe-4 py-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full ps-10 pe-4 py-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full ps-10 pe-10 py-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-primary hover:underline self-end"
              >
                {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading
                ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...')
                : titles[mode][language]
              }
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-muted-foreground">
                {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <button onClick={() => setMode('register')} className="text-primary font-medium hover:underline">
                  {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لديك حساب؟' : 'Already have an account?'}{' '}
                <button onClick={() => setMode('login')} className="text-primary font-medium hover:underline">
                  {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default Auth;
