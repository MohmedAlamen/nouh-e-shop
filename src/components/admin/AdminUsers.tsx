import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, User as UserIcon } from 'lucide-react';

interface ProfileWithRole {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  role?: string;
}

const AdminUsers = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [profiles, setProfiles] = useState<ProfileWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
    setProfiles((profs || []).map(p => ({ ...p, role: roleMap.get(p.user_id) || 'user' })));
    setLoading(false);
  };

  const setRole = async (userId: string, newRole: string) => {
    if (newRole === 'user') {
      await supabase.from('user_roles').delete().eq('user_id', userId);
    } else {
      const { data: existing } = await supabase.from('user_roles').select('id').eq('user_id', userId).maybeSingle();
      if (existing) {
        await supabase.from('user_roles').update({ role: newRole as any }).eq('user_id', userId);
      } else {
        await supabase.from('user_roles').insert({ user_id: userId, role: newRole as any });
      }
    }
    toast.success(isAr ? 'تم تحديث الدور' : 'Role updated');
    setProfiles(prev => prev.map(p => p.user_id === userId ? { ...p, role: newRole } : p));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 hidden md:block">{isAr ? 'إدارة المستخدمين' : 'User Management'}</h1>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-secondary/50 rounded-xl animate-pulse" />)}</div>
      ) : profiles.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{isAr ? 'لا يوجد مستخدمين' : 'No users'}</p>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-start py-3 px-4">{isAr ? 'المستخدم' : 'User'}</th>
                  <th className="text-start py-3 px-4">{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th className="text-start py-3 px-4">{isAr ? 'التسجيل' : 'Joined'}</th>
                  <th className="text-start py-3 px-4">{isAr ? 'الدور' : 'Role'}</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-foreground">{p.display_name || (isAr ? 'مستخدم' : 'User')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{p.phone || '-'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</td>
                    <td className="py-3 px-4">
                      <Select value={p.role || 'user'} onValueChange={v => setRole(p.user_id, v)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">{isAr ? 'مستخدم' : 'User'}</SelectItem>
                          <SelectItem value="moderator">{isAr ? 'مشرف' : 'Moderator'}</SelectItem>
                          <SelectItem value="admin">{isAr ? 'مدير' : 'Admin'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        {isAr ? `${profiles.length} مستخدم` : `${profiles.length} users`}
      </p>
    </div>
  );
};

export default AdminUsers;
