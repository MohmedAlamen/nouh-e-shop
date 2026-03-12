import { useState, useEffect } from 'react';
import { Star, Send, Trash2, Filter, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  display_name?: string;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const ReviewSection = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const isAr = language === 'ar';

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (data) {
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);
      setReviews(data.map(r => ({ ...r, display_name: profileMap.get(r.user_id) || (isAr ? 'مستخدم' : 'User') })));
    }
    setLoading(false);
  };

  const userReview = reviews.find(r => r.user_id === user?.id);

  const handleSubmit = async () => {
    if (!user) { toast.error(isAr ? 'سجل الدخول أولاً' : 'Please sign in first'); return; }
    if (rating === 0) { toast.error(isAr ? 'اختر تقييماً' : 'Please select a rating'); return; }
    setSubmitting(true);
    const { error } = userReview
      ? await supabase.from('reviews').update({ rating, comment: comment || null }).eq('id', userReview.id)
      : await supabase.from('reviews').insert({ user_id: user.id, product_id: productId, rating, comment: comment || null });
    if (error) { toast.error(isAr ? 'حدث خطأ' : 'Something went wrong'); }
    else { toast.success(userReview ? (isAr ? 'تم تحديث التقييم' : 'Review updated') : (isAr ? 'تم إضافة التقييم' : 'Review added')); setRating(0); setComment(''); fetchReviews(); }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    toast.success(isAr ? 'تم حذف التقييم' : 'Review deleted');
    fetchReviews();
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

  // Star distribution
  const starCounts = [5, 4, 3, 2, 1].map(s => ({ star: s, count: reviews.filter(r => r.rating === s).length }));

  // Filtered & sorted
  const filtered = filterStar ? reviews.filter(r => r.rating === filterStar) : reviews;
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const sortLabels: Record<SortOption, string> = {
    newest: isAr ? 'الأحدث' : 'Newest',
    oldest: isAr ? 'الأقدم' : 'Oldest',
    highest: isAr ? 'الأعلى تقييماً' : 'Highest rated',
    lowest: isAr ? 'الأقل تقييماً' : 'Lowest rated',
  };

  const sortOptions: SortOption[] = ['newest', 'oldest', 'highest', 'lowest'];

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {isAr ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
      </h2>

      {/* Summary + Distribution */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span className="text-4xl font-bold text-foreground">{avgRating}</span>
            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-accent text-accent' : 'text-border'}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">
              {reviews.length} {isAr ? 'تقييم' : reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Star bars */}
        <div className="flex-1 space-y-1.5">
          {starCounts.map(({ star, count }) => {
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            const isActive = filterStar === star;
            return (
              <button
                key={star}
                onClick={() => setFilterStar(isActive ? null : star)}
                className={`flex items-center gap-2 w-full text-start group transition-colors rounded-md px-1.5 py-0.5 ${isActive ? 'bg-accent/10' : 'hover:bg-secondary/50'}`}
              >
                <span className="text-xs font-medium text-muted-foreground w-4">{star}</span>
                <Star className="w-3 h-3 fill-accent text-accent" />
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-end">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter/Sort Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filterStar && (
          <button
            onClick={() => setFilterStar(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
          >
            <Filter className="w-3 h-3" />
            {filterStar} {isAr ? 'نجوم' : filterStar === 1 ? 'star' : 'stars'} ✕
          </button>
        )}
        <div className="ms-auto flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          {sortOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${sortBy === opt ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              {sortLabels[opt]}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Review Form */}
      {user && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-foreground mb-3">
            {userReview ? (isAr ? 'تعديل تقييمك' : 'Edit your review') : (isAr ? 'أضف تقييمك' : 'Write a review')}
          </h3>
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onMouseEnter={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(i + 1)} className="transition-transform hover:scale-110">
                <Star className={`w-7 h-7 ${i < (hoverRating || rating) ? 'fill-accent text-accent' : 'text-border'}`} />
              </button>
            ))}
            {rating > 0 && <span className="text-sm text-muted-foreground ms-2">{rating}/5</span>}
          </div>
          <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={isAr ? 'اكتب تعليقك هنا (اختياري)...' : 'Write your comment here (optional)...'} className="mb-4 resize-none" maxLength={500} rows={3} />
          <button onClick={handleSubmit} disabled={submitting || rating === 0} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
            <Send className="w-4 h-4" />
            {submitting ? (isAr ? 'جارٍ الإرسال...' : 'Submitting...') : (isAr ? 'إرسال' : 'Submit')}
          </button>
        </div>
      )}

      {!user && (
        <p className="text-muted-foreground mb-8 text-sm">
          {isAr ? 'سجل الدخول لإضافة تقييمك' : 'Sign in to write a review'}
        </p>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center text-muted-foreground py-8">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          {filterStar
            ? (isAr ? `لا توجد تقييمات بـ ${filterStar} نجوم` : `No ${filterStar}-star reviews`)
            : (isAr ? 'لا توجد تقييمات بعد. كن أول من يقيّم!' : 'No reviews yet. Be the first to review!')}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sorted.map(review => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-secondary/50 border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground text-sm">{review.display_name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-accent text-accent' : 'text-border'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
                    {user?.id === review.user_id && (
                      <button onClick={() => handleDelete(review.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {review.comment && <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
