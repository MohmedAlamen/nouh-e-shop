import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `أنت مساعد خدمة عملاء ذكي لمتجر "NOUH STORE" المتخصص في بيع الهواتف الذكية والملحقات.

## معلومات المتجر:
- الاسم: NOUH STORE
- التخصص: هواتف ذكية وملحقات (سماعات، شواحن، حافظات، ساعات ذكية)
- العملة: ريال سعودي (ر.س / SAR)

## مهامك:
1. الرد على استفسارات العملاء حول المنتجات والأسعار
2. المساعدة في اختيار المنتج المناسب
3. الإجابة عن سياسة الإرجاع والاستبدال
4. المساعدة في تتبع الطلبات
5. حل المشكلات التقنية البسيطة

## سياسات المتجر:
- الإرجاع خلال 14 يوم من الاستلام
- الشحن مجاني للطلبات فوق 200 ر.س
- الدفع عند الاستلام متاح
- ضمان سنة على الهواتف

## تعليمات:
- كن ودوداً ومهنياً
- أجب باللغة التي يستخدمها العميل (عربي أو إنجليزي)
- اجعل إجاباتك مختصرة وواضحة
- إذا لم تعرف الإجابة، اقترح التواصل مع فريق الدعم`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "عدد الطلبات كثير، حاول بعد قليل" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "خدمة الذكاء الاصطناعي غير متاحة حالياً" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "حدث خطأ في الخدمة" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("customer-service error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
