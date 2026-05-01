export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "rescue-plan",
    title: "خطة الإنقاذ قبل الإمتحان بـــ 3 ايام",
    description: "أقوى خطة مراجعة نهائية تضمن لك لم المنهج في وقت قياسي. استراتيجيات عملية مصممة للطلاب الذين يريدون النجاح بتفوق في اللحظات الأخيرة.",
    price: 99,
    oldPrice: 215,
    category: "أدلة الدراسة",
    images: [
      "https://storage.googleapis.com/test-full-stack-applet.appspot.com/6869e71c-4389-4116-8600-1c6e2101e4a1/input_file_0.png",
      "https://storage.googleapis.com/test-full-stack-applet.appspot.com/6869e71c-4389-4116-8600-1c6e2101e4a1/input_file_1.png"
    ],
    rating: 4.9,
    reviewsCount: 245,
    isAvailable: true
  },
  {
    id: "freelance-mobile",
    title: "دليل العمل الحر من الهاتف",
    description: "تعلم كيف تبدأ مسيرتك المهنية في العمل الحر باستخدام هاتفك الذكي فقط. دليل شامل للمبتدئين في السوق العربي.",
    price: 200,
    category: "أدلة الربح",
    images: ["https://picsum.photos/seed/vaultify-money/600/800"],
    rating: 4.9,
    reviewsCount: 89,
    isAvailable: false
  },
  {
    id: "time-management",
    title: "نظام تنظيم الوقت اليومي",
    description: "حول فوضى يومك إلى إنتاجية عالية مع هذا النظام المتكامل لتنظيم المهام والأولويات. مصمم للمحترفين والطلاب.",
    price: 315,
    category: "تطوير الذات",
    images: ["https://picsum.photos/seed/vaultify-productivity/600/800"],
    rating: 4.7,
    reviewsCount: 210,
    isAvailable: false
  }
];
