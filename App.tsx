import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingCart, Star, BookOpen, DollarSign, Brain, CheckCircle, 
  ChevronRight, Menu, X, Facebook, Instagram, Phone, MessageCircle, 
  HelpCircle, Info, ShieldCheck, Mail, Lock, ChevronLeft, Copy, Check, Share2,
  Eye, EyeOff, User as UserIcon, LogIn, LogOut, Settings, Shield, Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { PRODUCTS, type Product } from "./data";
import { auth, db } from "./lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const CopyableText = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-brand-blue/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="text-xs text-gray-400 font-bold">{label}</div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-black text-brand-blue tracking-wider">{text}</span>
        <button 
          onClick={(e) => { e.preventDefault(); handleCopy(); }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${copied ? 'bg-brand-green text-white' : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue hover:text-white'}`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
        </button>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const randomSeconds = Math.floor(Math.random() * (7200 - 1800 + 1)) + 1800;
    let totalSeconds = randomSeconds;

    const timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timer);
        return;
      }
      totalSeconds -= 1;
      
      const d = Math.floor(totalSeconds / (3600 * 24));
      const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      
      setTimeLeft({ d, h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-row-reverse gap-3 justify-center md:justify-end mb-6 font-sans">
      <div className="flex flex-col items-center bg-red-50 text-red-600 px-3 py-2 rounded-xl min-w-[60px] border border-red-100">
        <span className="text-xl font-black">{timeLeft.s}</span>
        <span className="text-[10px] uppercase font-bold">ثانية</span>
      </div>
      <div className="flex flex-col items-center bg-red-50 text-red-600 px-3 py-2 rounded-xl min-w-[60px] border border-red-100">
        <span className="text-xl font-black">{timeLeft.m}</span>
        <span className="text-[10px] uppercase font-bold">دقيقة</span>
      </div>
      <div className="flex flex-col items-center bg-red-50 text-red-600 px-3 py-2 rounded-xl min-w-[60px] border border-red-100">
        <span className="text-xl font-black">{timeLeft.h}</span>
        <span className="text-[10px] uppercase font-bold">ساعة</span>
      </div>
      <div className="flex flex-col items-center bg-red-50 text-red-600 px-3 py-2 rounded-xl min-w-[60px] border border-red-100">
        <span className="text-xl font-black">{timeLeft.d}</span>
        <span className="text-[10px] uppercase font-bold">يوم</span>
      </div>
      <div className="flex items-center font-black text-red-600 mr-2 text-sm italic">ينتهي العرض خلال:</div>
    </div>
  );
};

const SocialProof = () => {
  const [notification, setNotification] = useState<{ name: string; product: string } | null>(null);
  const names = [
    "أحمد محمد", "سارة علي", "محمد خالد", "ليلى بكري", "عمر سليمان", 
    "مريم ناصر", "يحيى هاشم", "فاطمة زهير", "عبدالرحمن جابر", "نورا كامل",
    "خالد عبدالله", "منى زكي", "يوسف محمود", "أمل سعيد", "رمضان صبحي"
  ];
  const productName = "خطة الإنقاذ قبل الامتحان بـ ٣ أيام";

  useEffect(() => {
    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      setNotification({ name, product: productName });

      setTimeout(() => setNotification(null), 5000);
      
      const nextTime = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
      setTimeout(showNotification, nextTime);
    };

    const initialDelay = setTimeout(showNotification, 7000);
    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="fixed bottom-4 left-4 z-[9999] bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 flex items-center gap-3 min-w-[300px]"
        >
          <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green flex-shrink-0">
            <CheckCircle size={24} />
          </div>
          <div className="text-right flex-1">
            <p className="text-sm font-bold text-gray-800">طلب ناجح!</p>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">
              قام <span className="text-brand-blue font-black">{notification.name}</span> بشراء {notification.product}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 italic font-sans uppercase font-bold text-left">منذ ثوانٍ قليلة</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAdmin = currentUser?.email === 'bamwrv2@gmail.com';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm h-16' : 'bg-white h-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-blue p-2 rounded-lg">
              <ShoppingCart className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-brand-blue uppercase">VAULTIFY</span>
          </Link>

            <div className="hidden md:flex items-center gap-8 font-medium">
              <Link to="/" className="hover:text-brand-blue transition-colors">الرئيسية</Link>
              <Link to="/about" className="hover:text-brand-blue transition-colors">عن المنصة</Link>
              <Link to="/faq" className="hover:text-brand-blue transition-colors">الأسئلة الشائعة</Link>
              <Link to="/contact" className="hover:text-brand-blue transition-colors">اتصل بنا</Link>
              
              {currentUser ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link to="/admin" className="text-brand-green flex items-center gap-1 font-bold">
                      <Shield size={18} /> لوحة الإدارة
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 bg-brand-blue/5 text-brand-blue px-4 py-2 rounded-full hover:bg-brand-blue/10 transition-all">
                    <UserIcon size={18} /> حسابي
                  </Link>
                  <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-brand-blue">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-0 top-16 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col p-6 gap-6 text-lg font-bold text-gray-800">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><BookOpen className="text-brand-blue" /> الرئيسية</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><Info className="text-brand-blue" /> عن المنصة</Link>
              <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><HelpCircle className="text-brand-blue" /> الأسئلة الشائعة</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><Mail className="text-brand-blue" /> اتصل بنا</Link>
              <Link to="/terms" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><ShieldCheck className="text-brand-blue" /> سياسة الاستخدام</Link>
              
              {currentUser ? (
                <>
                  {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-brand-green"><Shield /> لوحة الإدارة</Link>}
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><UserIcon /> حسابي</Link>
                  <button onClick={() => { signOut(auth); setIsMenuOpen(false); }} className="flex items-center gap-3 text-red-500"><LogOut /> تسجيل الخروج</button>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-800 text-right">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6 text-white justify-end">
            <span className="text-2xl font-bold tracking-tight uppercase">VAULTIFY</span>
            <div className="bg-brand-blue p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <p className="max-w-sm mb-6 leading-relaxed mr-auto">
            منصة فولتفاي التعليمية - دليلك الأول للنجاح الأكاديمي والعمل الرقمي من خلال منتجات معرفية مركزة واحترافية.
          </p>
          <div className="flex gap-4 justify-end">
            <a href="#" className="bg-gray-900 p-3 rounded-xl hover:text-white transition-colors border border-gray-800 hover:border-brand-blue"><Facebook size={20} /></a>
            <a href="https://instagram.com/vaultify2026" target="_blank" rel="noreferrer" className="bg-gray-900 p-3 rounded-xl hover:text-white transition-colors border border-gray-800 hover:border-brand-blue"><Instagram size={20} /></a>
            <a href="#" className="flex items-center justify-center bg-gray-900 p-3 rounded-xl hover:text-white transition-colors border border-gray-800 hover:border-brand-blue">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a href="https://wa.me/201022449197" target="_blank" rel="noreferrer" className="bg-gray-900 p-3 rounded-xl hover:text-white transition-colors border border-gray-800 hover:border-brand-blue"><MessageCircle size={20} /></a>
          </div>
        </div>
        
        <div>
          <h5 className="text-white font-bold mb-6">روابط هامة</h5>
          <ul className="space-y-4">
            <li><Link to="/about" className="hover:text-white transition-colors">عن المنصة</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">سياسة الاستخدام</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold mb-6">الدعم الفني</h5>
          <div className="flex flex-col gap-4">
            <a href="https://wa.me/201022449197" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-brand-green/10 text-brand-green p-3 rounded-xl hover:bg-brand-green/20 transition-all font-bold">
              <Phone size={18} /> تواصل واتساب
            </a>
            <p className="text-xs">01022449197</p>
            <p className="text-[10px]">متاحون للرد على استفساراتكم على مدار الساعة</p>
          </div>
        </div>
      </div>
      
      <div className="pt-8 border-t border-gray-800 text-center text-xs opacity-50 font-sans">
        &copy; 2026 Vaultify. جميع الحقوق محفوظة. صنع بكل حب للعالم العربي.
      </div>
    </div>
  </footer>
);

const Home = () => {
  const activeProduct = PRODUCTS.find(p => p.id === 'rescue-plan');

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-10 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-right">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1 bg-brand-blue/10 text-brand-blue rounded-full mb-6 font-bold text-sm"
              >
                <CheckCircle size={16} className="text-brand-green" />
                <span>+500 موثوق من قبل مستخدم عربي</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-7xl font-black text-brand-blue leading-[1.2] mb-8"
              >
                افتح المعرفة التي <br /> <span className="text-brand-green">تغير حياتك</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl ml-auto leading-relaxed"
              >
                أدوات ومنتجات معرفية متكاملة تهدف لتمكينك من التفوق العلمي، تحقيق الاستقلال المادي، وتطوير مهاراتك لمواكبة سوق العمل الحديث بأفضل الاستراتيجيات العملية.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                {activeProduct && (
                  <Link to={`/product/${activeProduct.id}`} className="bg-brand-blue text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl shadow-brand-blue/30 inline-flex items-center gap-2">
                    شراء خطة الإنقاذ <ChevronRight className="w-5 h-5 rotate-180" />
                  </Link>
                )}
                <a href="#more" className="bg-white border text-gray-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-colors">
                  تصفح الأقسام
                </a>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <Link to={`/product/${activeProduct?.id}`} className="block relative z-10 p-2 md:p-4 bg-white rounded-3xl shadow-2xl skew-y-3 hover:skew-y-0 transition-all duration-500">
                <img 
                  src={activeProduct?.images[0]} 
                  alt="Rescue Plan" 
                  className="rounded-2xl w-full object-cover"
                />
              </Link>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-blue/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="more" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-6"><BookOpen size={32} /></div>
              <h3 className="text-xl font-bold mb-3">أدلة الدراسة</h3>
              <p className="text-gray-500 text-sm">كل ما تحتاجه لتقليص وقت المذاكرة وزيادة التحصيل الدراسي.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green mb-6"><DollarSign size={32} /></div>
              <h3 className="text-xl font-bold mb-3">طرق الربح</h3>
              <p className="text-gray-500 text-sm">استغل هاتفك في كسب دولارات حقيقية من خلال مهارات مطلوبة.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-6"><Brain size={32} /></div>
              <h3 className="text-xl font-bold mb-3">تطوير الذات</h3>
              <p className="text-gray-500 text-sm">أدلة نفسية وتنظيمية تساعدك على بناء شخصية أقوى وأكثر تركيزاً.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">منتجاتنا الرقمية</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">نركز حالياً على إطلاق أفضل المنتجات التعليمية والعملية واحداً تلو الآخر لضمان أعلى جودة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="relative group">
                <div className={`bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-500 border border-gray-100 ${!p.isAvailable ? 'opacity-50 blur-[1px]' : 'hover:shadow-2xl hover:-translate-y-2'}`}>
                  <div className="aspect-[3/4] relative">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    {!p.isAvailable && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white px-6 py-2 rounded-full font-bold flex items-center gap-2">
                          <Lock size={16} /> مغلق حالياً
                        </div>
                      </div>
                    )}
                    {p.oldPrice && p.isAvailable && (
                    <div className="absolute top-4 left-4 bg-brand-green text-white px-4 py-1 rounded-lg font-bold shadow-lg">
                      خصم {(100 - (p.price / p.oldPrice) * 100).toFixed(0)}%
                    </div>
                    )}
                  </div>
                  <div className="p-8 text-right">
                    <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-3xl font-black text-brand-blue">{p.price}ج</div>
                      {p.oldPrice && <div className="text-xl text-gray-400 line-through">{p.oldPrice}ج</div>}
                    </div>
                    {p.isAvailable ? (
                      <Link to={`/product/${p.id}`} className="block w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-center hover:bg-opacity-90 transition-all">
                        تصفح الدليل
                      </Link>
                    ) : (
                      <button disabled className="w-full bg-gray-200 text-gray-400 py-4 rounded-xl font-bold cursor-not-allowed text-sm">
                        قريباً جداً
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around gap-10 text-center">
            <div>
              <div className="text-5xl font-black text-brand-blue mb-2">+500</div>
              <div className="text-gray-500 font-bold">مستخدم سعيد</div>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-green mb-2">+50</div>
              <div className="text-gray-500 font-bold">تقييم 5 نجوم</div>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-blue mb-2">100%</div>
              <div className="text-gray-500 font-bold">محتوى رقمي PDF</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const showSuccess = () => {
    setIsSuccessVisible(true);
    setTimeout(() => setIsSuccessVisible(false), 5000);
  };

  if (!product) return <div className="py-20 text-center">المنتج غير موجود</div>;

  const nextImg = () => setActiveImg((prev) => (prev + 1) % product.images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImg}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  src={product.images[activeImg]} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg"><ChevronLeft /></button>
              <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg"><ChevronLeft className="rotate-180" /></button>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === activeImg ? 'bg-brand-blue w-8' : 'bg-white/50'}`} />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-6">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${i === activeImg ? 'border-brand-blue' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 text-right">
            <div className="flex flex-row-reverse items-center justify-between gap-4 mb-4">
              <div className="inline-block px-4 py-1 bg-brand-green/10 text-brand-green rounded-lg font-bold">متوفر الآن ولأول مرة</div>
              <button 
                onClick={() => {
                  const shareData = {
                    title: `منصة فولتفاي - ${product.title}`,
                    text: `🚀 اكتشف "${product.title}" على منصة فولتفاي للتعليم الرقمي!\n\n${product.description}\n\nابدأ رحلة تفوقك الآن عبر الرابط:`,
                    url: window.location.href,
                  };
                  
                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {
                      const fullText = `${shareData.text}\n${shareData.url}`;
                      navigator.clipboard.writeText(fullText);
                    });
                  } else {
                    const fullText = `${shareData.text}\n${shareData.url}`;
                    navigator.clipboard.writeText(fullText);
                  }
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors font-bold text-sm"
              >
                <span>مشاركة</span>
                <Share2 size={18} />
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-brand-blue mb-6 leading-[1.3]">{product.title}</h1>
            
            <CountdownTimer />

            <div className="flex items-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
              <span className="text-gray-500 mr-3 font-bold">(٢٤٥ تقييم)</span>
            </div>

            <p className="text-xl text-gray-600 mb-8 leading-loose">{product.description}</p>
            
            <div className="text-red-500 text-xs font-bold mb-6">ملاحظة: هذا الدليل بصيغة PDF وسوف يتم إرساله لك عبر واتساب.</div>

            <div className="bg-gray-50 p-8 rounded-3xl mb-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-500 font-bold">سعر العرض المميز:</span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-brand-blue">{product.price}ج</span>
                  <span className="text-xl text-gray-400 line-through">{product.oldPrice}ج</span>
                </div>
              </div>
              <button 
                onClick={() => setShowForm(true)}
                className="w-full bg-brand-blue text-white py-5 rounded-2xl text-xl font-black shadow-xl shadow-brand-blue/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
              >
                <ShoppingCart /> اشتري الدليل الآن
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black border-r-4 border-brand-green pr-4">لماذا تشتري هذا الدليل؟</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 justify-end text-lg"><span className="text-gray-700">توفير أكثر من ٧٠ ساعة من المذاكرة العشوائية</span> <CheckCircle className="text-brand-green" /></li>
                <li className="flex items-center gap-3 justify-end text-lg"><span className="text-gray-700">التركيز على أهم الماوضوعات التي تضمن لك النجاح</span> <CheckCircle className="text-brand-green" /></li>
                <li className="flex items-center gap-3 justify-end text-lg"><span className="text-gray-700">جداول مذاكرة عملية دقيقة لكل دقيقة</span> <CheckCircle className="text-brand-green" /></li>
                <li className="flex items-center gap-3 justify-end text-lg"><span className="text-gray-700">تحميل فوري بصيغة PDF على هاتفك</span> <CheckCircle className="text-brand-green" /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowForm(false)} className="absolute top-6 left-6 text-gray-400 hover:text-black"><X /></button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mx-auto mb-4"><ShoppingCart size={32} /></div>
                <h3 className="text-2xl font-black mb-2">تأكيد عملية الشراء</h3>
                <p className="text-sm text-gray-500 leading-relaxed italic mb-6">يرجى تحويل مبلغ <span className="font-bold text-brand-blue">{product.price}ج</span> ثم ملئ البيانات التالية بدقة.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right mb-4">
                  <CopyableText label="فودافون كاش" text="01287702619" />
                  <CopyableText label="انستا باي" text="01036246645" />
                </div>
              </div>

              <form 
                className="space-y-5 text-right font-bold text-sm" 
                onSubmit={async (e) => { 
                  e.preventDefault();
                  const form = e.currentTarget;
                  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  const originalText = submitBtn.innerText;
                  
                  try {
                    submitBtn.disabled = true;
                    submitBtn.innerText = 'جاري المعالجة...';
                    
                    const formData = new FormData(form);
                    const data = {
                      productId: product.id,
                      productTitle: product.title,
                      fullName: formData.get('fullName') as string,
                      email: formData.get('email') as string,
                      whatsapp: formData.get('whatsapp') as string,
                      paymentMethod: formData.get('paymentMethod') as string,
                      lastThreeDigits: formData.get('lastThreeDigits') as string,
                      status: 'pending',
                      userId: auth.currentUser?.uid || null,
                      createdAt: serverTimestamp()
                    };

                    await addDoc(collection(db, "orders"), data);

                    await fetch("https://formsubmit.co/ajax/bamwrv2@gmail.com", {
                      method: "POST",
                      body: formData
                    });

                    setShowForm(false);
                    showSuccess();
                  } catch (error) {
                    console.error(error);
                    alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
                  } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                  }
                }}
              >
                <div>
                  <label className="block mb-2">الاسم بالكامل</label>
                  <input name="fullName" required type="text" placeholder="اكتب اسمك كاملاً" className="w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue border-none" />
                </div>
                <div>
                  <label className="block mb-2">الجيميل (Gmail)</label>
                  <input name="email" required type="email" placeholder="example@gmail.com" className="w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue border-none text-left font-sans" />
                </div>
                <div>
                  <label className="block mb-2">رقم الواتساب</label>
                  <input name="whatsapp" required type="tel" placeholder="01xxxxxxxxx" className="w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue border-none text-left font-sans" />
                </div>
                <div>
                  <label className="block mb-2">طريقة التحويل</label>
                  <select name="paymentMethod" required className="w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue border-none appearance-none">
                    <option value="">اختر الطريقة</option>
                    <option value="vodafone">فودافون كاش</option>
                    <option value="instapay">انستا باي</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-2">أخر ٣ أرقام من الرقم الذي حوّلت منه</label>
                    <input name="lastThreeDigits" required type="text" maxLength={3} placeholder="مثال: 123" className="w-full p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue border-none text-center" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-brand-green text-white py-5 rounded-2xl text-xl font-black mt-6 shadow-lg shadow-brand-green/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase">تأكيد وإرسال الطلب</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccessVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-brand-green text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 font-bold"
          >
            <div className="bg-white/20 p-2 rounded-full"><Check size={20} /></div>
            <span>تم استلام طلبك بنجاح! سنتواصل معك قريباً.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const About = () => (
  <div className="py-20 max-w-4xl mx-auto px-4 text-right">
    <h1 className="text-4xl md:text-5xl font-black text-brand-blue mb-10">من نحن؟</h1>
    <div className="prose prose-lg leading-loose space-y-8 text-gray-700 font-bold">
      <p>
        فولتفاي هي منصة تعليمية رقمية متخصصة في تقديم حلول معرفية ذكية ومبتكرة للطلاب والشباب في العالم العربي. انطلقت فولتفاي برؤية واضحة: سد الفجوة بين التعليم التقليدي ومتطلبات العصر الحديث من خلال منتجات رقمية فائقة الجودة.
      </p>
      <p>
        نحن نؤمن بأن المعرفة هي القوة الحقيقية، ولكن الوصول إليها يجب أن يكون سهلاً، منظماً، وقابلاً للتطبيق الفوري. لذلك، نقوم بتصميم أدلة دراسية، خطط إنقاذ أكاديمية، وكورسات مصغرة بصيغة PDF لتكون رفيقة دربك على هاتفك في أي وقت وأي مكان.
      </p>
      <p>
        رؤيتنا هي أن التعليم لا يجب أن يكون معقداً أو طويلاً، بل يجب أن يكون فعالاً وموجهاً. جميع منتجاتنا مصممة بأحدث استراتيجيات المذاكرة والعمل الرقمي لضمان تحقيقك لأقصى استفادة في أقل وقت.
      </p>
    </div>
  </div>
);

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "كيف أحصل على الدليل بعد الدفع؟", a: "بمجرد تأكيد عملية الشراء وملئ نموذج البيانات، سيقوم فريق الدعم الفني بمراجعة التحويل وإرسال الدليل لك مباشرة بصيغة PDF عبر تطبيق الواتساب خلال دقائق." },
    { q: "هل الأدلة مطبوعة أم رقمية؟", a: "جميع أدلة فولتفاي هي أدلة رقمية بصيغة PDF عالية الجودة مصممة للقراءة من الموبايل أو التابلت أو الطباعة الشخصية." },
    { q: "ما هي طرق الدفع المتاحة؟", a: "ندعم حالياً الدفع عبر فودافون كاش (Vodafone Cash) وتطبيق انستا باي (InstaPay) لتسهيل الوصول للجميع في مصر." },
    { q: "هل خطة الإنقاذ تغني عن المذاكرة؟", a: "خطة الإنقاذ هي 'مساعد ذكي' يوجهك للمواضيع الأكثر أهمية وكيفية مذاكرتها بفعالية، فهي تختصر لك الطريق وتوفر عليك الوقت، لكنها تتطلب التزامك بالتنفيذ." }
  ];

  return (
    <div className="py-20 max-w-4xl mx-auto px-4 text-right">
      <h1 className="text-5xl font-black text-brand-blue mb-16 text-center">الأسئلة الشائعة</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-8 text-xl font-bold hover:bg-gray-50 transition-colors">
              <ChevronLeft className={`transition-transform duration-300 ${open === i ? '-rotate-90' : 'rotate-180'}`} />
              <span>{f.q}</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="p-8 pt-0 text-gray-600 leading-bold">{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const Contact = () => (
  <div className="py-20 max-w-4xl mx-auto px-4 text-center">
    <div className="w-24 h-24 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-10"><Phone size={48} /></div>
    <h1 className="text-5xl font-black text-brand-blue mb-6">تواصل معنا</h1>
    <p className="text-xl text-gray-500 mb-12 font-bold">نحن متواجدون لمساعدتك في أي استفسار حول طلبك أو منتجاتنا الرقمية.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 font-bold">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <Mail className="text-brand-blue mx-auto mb-4" size={32} />
        <h3 className="text-2xl mb-2">عبر الإيميل</h3>
        <p className="text-gray-500 font-sans">bamwrv2@gmail.com</p>
      </div>
      <a href="https://wa.me/201022449197" target="_blank" rel="noreferrer" className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:border-brand-green transition-all group">
        <MessageCircle className="text-brand-green mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
        <h3 className="text-2xl mb-2">عبر واتساب</h3>
        <p className="text-gray-500 font-sans">01022449197</p>
      </a>
    </div>
  </div>
);

const Terms = () => (
  <div className="py-20 max-w-4xl mx-auto px-4 text-right">
    <h1 className="text-5xl font-black text-brand-blue mb-10">سياسة الاستخدام</h1>
    <div className="prose prose-lg leading-loose space-y-8 text-gray-700 font-bold">
      <div className="bg-red-50 p-6 rounded-2xl border-r-4 border-red-500 mb-8">
        <h3 className="text-red-700 text-xl font-black mb-2">تنبيه هام جداً</h3>
        <p>
          جميع المنتجات الرقمية (PDF) التي يتم شراؤها من فولتفاي هي مرخصة **لاستخدام شخص واحد فقط**. 
          لا يسمح بمشاركة المحتوى، إرسال الملف، أو نشره لأي شخص آخر. 
          في حال ثبوت ذلك، سيتم **حظرك من الخدمة ومنعك من الوصول لأي تحديثات أو منتجات القادمة بشكل نهائي**.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-black text-brand-blue mb-4">١. الحقوق الفكرية</h2>
        <p>جميع الأدلة الرقمية (PDF) المباعة عبر Vaultify هي ملكية فكرية خاصة بالمنصة. يمنع منعاً باتاً إعادة توزيع، بيع، أو مشاركة المحتوى مع أشخاص آخرين تحت طائلة المساءلة القانونية وحظر الحساب.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-brand-blue mb-4">٢. سياسة الاسترجاع</h2>
        <p>نظراً لطبيعة المنتجات الرقمية التي يتم استهلاكها فور التحميل، فإنه لا يوجد سياسة استرجاع للأموال بعد إرسال الدليل للعميل إلا في حال وجود خطأ تقني جسيم في الملف يمنع فتحه.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-brand-blue mb-4">٣. دقة البيانات</h2>
        <p>العميل مسؤول مسؤولية كاملة عن صحة البيانات المدخلة (الإيميل، رقم الواتساب). في حال إدخال بيانات خاطئة قد يتأخر وصول الطلب.</p>
      </section>
    </div>
  </div>
);

const LoginPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
      >
        <div className="bg-orange-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">التسجيل مغلق</h2>
        <p className="text-gray-500 font-bold leading-relaxed">
          نعتذر منك، نظام العضوية مغلق حالياً لإجراء بعض التحديثات والتحسينات. 
          <br /><br />
          يمكنك شراء "خطة الإنقاذ" مباشرة بدون الحاجة لتسجيل حساب.
        </p>
        <Link to="/" className="mt-8 inline-block bg-brand-blue text-white px-8 py-3 rounded-xl font-bold">
          العودة للرئيسية
        </Link>
      </motion.div>
    </div>
  );
};

const SignupPage = () => {
  return <LoginPage />;
};

const ProfilePage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }

      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(d => d.data());
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="py-20 text-center font-bold">جاري تحميل البيانات...</div>;

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-brand-blue/10 rounded-3xl flex items-center justify-center text-brand-blue mb-6">
              <UserIcon size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{userData?.fullName}</h2>
            <p className="text-gray-500 font-bold mb-6 font-sans">{userData?.email}</p>
            <div className="w-full space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="font-sans text-gray-950 font-bold">{userData?.whatsapp}</span>
                <span className="text-gray-400">رقم الواتساب:</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-sans text-gray-950 font-bold">
                  {userData?.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString('ar-EG') : 'قيد المعالجة'}
                </span>
                <span className="text-gray-400">تاريخ الانضمام:</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 space-y-12">
          <section>
            <h3 className="text-3xl font-black text-brand-blue mb-8 flex items-center gap-4 justify-end">
              مشترياتي الرقمية <BookOpen className="text-brand-green" />
            </h3>
            {userData?.purchasedProducts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.purchasedProducts.map((pid: string) => {
                  const p = PRODUCTS.find(prod => prod.id === pid);
                  return (
                    <div key={pid} className="bg-white p-6 rounded-3xl shadow-md border border-brand-green/20 flex gap-6 items-center">
                      <img src={p?.images[0]} className="w-20 h-28 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="font-black text-lg mb-2">{p?.title}</h4>
                        <button className="bg-brand-green text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mr-auto">
                          تحميل PDF <Clock size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-10 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-bold">لم تقم بشراء أي أدلة رقمية بعد.</p>
                <Link to="/" className="text-brand-blue mt-4 inline-block font-bold hover:underline">تصفح المنتجات الآن</Link>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-3xl font-black text-brand-blue mb-8 flex items-center gap-4 justify-end">
              طلباتي المعلقة <Clock className="text-brand-green" />
            </h3>
            <div className="space-y-4">
              {orders.filter(o => o.status === 'pending').map((order, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                    قيد المراجعة
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{order.productTitle}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString('ar-EG') : 'الآن'}
                    </div>
                  </div>
                </div>
              ))}
              {orders.filter(o => o.status === 'pending').length === 0 && (
                <p className="text-center text-gray-400 font-bold text-sm">لا توجد طلبات معلقة.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'users' | 'orders'>('orders');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'bamwrv2@gmail.com') {
        navigate('/');
        return;
      }
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubUsers();
      unsubOrders();
    };
  }, []);

  if (loading) return <div className="py-20 text-center font-bold uppercase tracking-widest text-brand-blue">🔐 Admin Access...</div>;

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex gap-4">
          <button 
            onClick={() => setView('users')} 
            className={`px-8 py-3 rounded-2xl font-black transition-all ${view === 'users' ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30' : 'bg-white text-gray-500'}`}
          >
            المستخدمين ({users.length})
          </button>
          <button 
            onClick={() => setView('orders')} 
            className={`px-8 py-3 rounded-2xl font-black transition-all ${view === 'orders' ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30' : 'bg-white text-gray-500'}`}
          >
            الطلبات ({orders.length})
          </button>
        </div>
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4">
          لوحة الإشراف <Shield size={32} className="text-brand-green" />
        </h1>
      </div>

      {view === 'users' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6 border-b pb-4 border-gray-50">
                <div className="bg-brand-blue/10 p-4 rounded-2xl text-brand-blue"><UserIcon /></div>
                <div className="text-right">
                  <div className="font-black text-lg">{u.fullName}</div>
                  <div className="text-xs text-gray-400 font-sans">{u.email}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-sans font-bold">{u.whatsapp}</span>
                  <span className="text-gray-400">واتساب:</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-sans font-bold">{u.purchasedProducts?.length || 0}</span>
                  <span className="text-gray-400">الكتب:</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-6 items-center">
                <div className={`p-4 rounded-2xl ${o.status === 'completed' ? 'bg-brand-green/10 text-brand-green' : 'bg-orange-100 text-orange-600'}`}>
                  <Clock size={28} />
                </div>
                <div className="text-right">
                  <div className="font-black text-xl">{o.productTitle}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 font-sans">{o.email}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500 font-sans">{o.whatsapp}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-right bg-gray-50/50 p-4 rounded-2xl flex-1 mx-0 md:mx-12">
                <div>
                  <div className="text-xs text-gray-400 mb-1">الاسم</div>
                  <div className="text-sm font-bold">{o.fullName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">طريقة الدفع</div>
                  <div className="text-sm font-bold uppercase">{o.paymentMethod}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">أخر ٣ أرقام</div>
                  <div className="text-sm font-bold font-sans">{o.lastThreeDigits}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">التاريخ</div>
                  <div className="text-xs font-bold font-sans">{o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString('ar-EG') : '...'}</div>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {o.status === 'pending' && (
                  <button onClick={() => alert('تحتاج هذه العملية لإضافة صك الربط بين الطلب وتفعيل الكتاب في حساب المستخدم')} className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex-1 md:flex-none">تفعيل الآن</button>
                )}
                <button className={`px-6 py-3 rounded-xl font-bold border ${o.status === 'completed' ? 'border-brand-green text-brand-green' : 'border-orange-200 text-orange-500'}`}>
                  {o.status === 'completed' ? 'مكتمل' : 'قيد المراجعة'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SocialProof />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
