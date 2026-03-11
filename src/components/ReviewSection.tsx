import { useState, useEffect } from 'react';
import { Star, Send, Trash2 } from 'lucide-react';
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

const ReviewSection = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      // Fetch display names for reviewers
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
    if (!user) {
      toast.error(isAr ? 'سجل الدخول أولاً' : 'Please sign in first');
      return;
    }
    if (rating === 0) {
      toast.error(isAr ? 'اختر تقييماً' : 'Please select a rating');
      return;
    }
    setSubmitting(true);

    const { error } = userReview
      ? await supabase.from('reviews').update({ rating, comment: comment || null }).eq('id', userReview.id)
      : await supabase.from('reviews').insert({ user_id: user.id, product_id: productId, rating, comment: comment || null });

    if (error) {
      toast.error(isAr ? 'حدث خطأ' : 'Something went wrong');
    } else {
      toast.success(userReview ? (isAr ? 'تم تحديث التقييم' : 'Review updated') : (isAr ? 'تم إضافة التقييم' : 'Review added'));
      setRating(0);
      setComment('');
      fetchReviews();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    toast.success(isAr ? 'تم حذف التقييم' : 'Review deleted');
    fetchReviews();
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {isAr ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
      </h2>

      {/* Summary */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(avgRating)) ? 'fill-accent text-accent' : 'text-border'}`} />
          ))}
        </div>
        <span className="text-lg font-bold text-foreground">{avgRating}</span>
        <span className="text-muted-foreground text-sm">
          ({reviews.length} {isAr ? 'تقييم' : reviews.length === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Add/Edit Review Form */}
      {user && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-foreground mb-3">
            {userReview ? (isAr ? 'تعديل تقييمك' : 'Edit your review') : (isAr ? 'أضف تقييمك' : 'Write a review')}
          </h3>

          {/* Star selector */}
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i + 1)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`w-7 h-7 ${i < (hoverRating || rating) ? 'fill-accent text-accent' : 'text-border'}`} />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-muted-foreground ms-2">{rating}/5</span>
            )}
          </div>

          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={isAr ? 'اكتب تعليقك هنا (اختياري)...' : 'Write your comment here (optional)...'}
            className="mb-4 resize-none"
            maxLength={500}
            rows={3}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
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
      ) : reviews.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          {isAr ? 'لا توجد تقييمات بعد. كن أول من يقيّم!' : 'No reviews yet. Be the first to review!'}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map(review => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-secondary/50 border border-border rounded-xl p-5"
              >
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
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                    </span>
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
