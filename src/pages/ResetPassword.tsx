import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password updated successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
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
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'كلمة مرور جديدة' : 'New Password'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={language === 'ar' ? 'كلمة المرور الجديدة' : 'New password'}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? '...' : (language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password')}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
};

export default ResetPassword;
