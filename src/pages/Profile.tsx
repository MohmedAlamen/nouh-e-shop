import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, User, Phone, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setDisplayName(data.display_name || '');
      setPhone(data.phone || '');
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(language === 'ar' ? 'الحد الأقصى 2 ميجابايت' : 'Max file size is 2MB');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(language === 'ar' ? 'فشل رفع الصورة' : 'Upload failed');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const url = `${publicUrl}?t=${Date.now()}`;
    setAvatarUrl(url);

    await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('user_id', user.id);

    toast.success(language === 'ar' ? 'تم تحديث الصورة' : 'Avatar updated');
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        phone: phone,
      })
      .eq('user_id', user.id);

    if (error) {
      toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    } else {
      toast.success(language === 'ar' ? 'تم حفظ البيانات' : 'Profile updated');
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-card"
      >
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
          {language === 'ar' ? 'الملف الشخصي' : 'My Profile'}
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border-4 border-primary/20 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 end-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground text-sm cursor-not-allowed"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {language === 'ar' ? 'الاسم' : 'Display Name'}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={language === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx'}
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl gradient-hero text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default Profile;
