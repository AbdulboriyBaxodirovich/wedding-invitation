import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, CreditCard, Heart } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const BALL_COUNT = 50;

function App() {
  const containerRef = useRef(null);
  const [balls, setBalls] = useState([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- 1. AUTO-RESET LOGIKASI ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.scrollTo(0, 0); 
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // --- 2. ANIMATSIYA INTERVALLARI (Yangi bo'lim bilan) ---

  // Blok 1: Ismlar (0 -> 0.1 da watermarkka aylanadi)
  const mainNamesOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.2]);
  const mainNamesScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.7]);
  const mainNamesY = useTransform(scrollYProgress, [0, 0.1], [0, -window.innerHeight * 0.35]);

  // Blok 2: Oyat (0.15 da paydo bo'ladi, 0.3 da yo'qoladi)
  const oyatOpacity = useTransform(scrollYProgress, [0.12, 0.2, 0.28, 0.35], [0, 1, 1, 0]);
  const oyatY = useTransform(scrollYProgress, [0.12, 0.2, 0.35], [100, 0, -100]);

  // Blok 3: Taklifnoma matni (0.4 da paydo bo'ladi, 0.55 da yo'qoladi)
  const wishOpacity = useTransform(scrollYProgress, [0.38, 0.45, 0.55, 0.62], [0, 1, 1, 0]);
  const wishY = useTransform(scrollYProgress, [0.38, 0.45, 0.62], [100, 0, -100]);
  
  // Blok 4: Kalendar (0.65 da paydo bo'ladi, 0.8 da yo'qoladi)
  const calOpacity = useTransform(scrollYProgress, [0.62, 0.7, 0.8, 0.88], [0, 1, 1, 0]);
  const calY = useTransform(scrollYProgress, [0.62, 0.7, 0.88], [100, 0, -100]);
  
  // Blok 5: Tugmalar (0.9 dan keyin paydo bo'ladi)
  const buttonsOpacity = useTransform(scrollYProgress, [0.88, 0.98], [0, 1]);
  const buttonsY = useTransform(scrollYProgress, [0.88, 0.98], [100, 0]);

  // --- 3. MOLEKULALAR PHYSICS ENGINE ---
  useEffect(() => {
    let animationFrameId;
    const initialBalls = Array.from({ length: BALL_COUNT }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: 180 
    }));

    const update = () => {
      initialBalls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;
        if (ball.x <= 0 || ball.x >= window.innerWidth - ball.size) ball.vx *= -1;
        if (ball.y <= 0 || ball.y >= window.innerHeight - 50) ball.vy *= -1;
      });
      setBalls([...initialBalls]);
      animationFrameId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} className="h-[700vh] bg-[#fffcf9] text-[#4a3f35] overflow-x-hidden">
      
      {/* FONDA DOIMIY AYLANUVCHI MOLEKULALAR */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {balls.map((ball, i) => (
          <div key={i} className="absolute font-great-vibes text-xl text-pink-600 opacity-[0.15] whitespace-nowrap"
            style={{ transform: `translate(${ball.x}px, ${ball.y}px) rotate(-15deg)` }}>
            Abdulboriy & Kelin
          </div>
        ))}
      </div>

      {/* ZANAVES EFFEKTI */}
      <motion.div initial={{ x: 0 }} animate={{ x: "-100%" }} transition={{ delay: 0.5, duration: 1.5 }} className="fixed inset-y-0 left-0 w-1/2 bg-[#1a1a1a] z-[100]" />
      <motion.div initial={{ x: 0 }} animate={{ x: "100%" }} transition={{ delay: 0.5, duration: 1.5 }} className="fixed inset-y-0 right-0 w-1/2 bg-[#1a1a1a] z-[100]" />

      <div className="relative z-10">
        
        {/* BLOK 1: ISMLAR (Watermarkka aylanadi) */}
        <motion.section 
          style={{ opacity: mainNamesOpacity, scale: mainNamesScale, y: mainNamesY }} 
          className="fixed inset-0 flex flex-col items-center justify-center p-6 pointer-events-none"
        >
          <Heart className="text-pink-400 mb-6 fill-pink-400/20" size={48} />
          <h1 className="text-7xl font-great-vibes text-pink-700">Abdulboriy</h1>
          <p className="text-4xl my-4 font-light italic">&</p>
          <h1 className="text-7xl font-great-vibes text-pink-700 font-bold">Kelinning Ismi</h1>
          <motion.p style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [0.4, 0]) }} 
            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} 
            className="mt-20 uppercase tracking-[0.5em] text-xs">Pastga tushing</motion.p>
        </motion.section>

        {/* BLOK 2: OYAT (Yangi bo'lim) */}
        <motion.section style={{ opacity: oyatOpacity, y: oyatY }} className="fixed inset-0 flex flex-col items-center justify-center px-12 text-center pointer-events-none">
          <div className="max-w-xl p-10 border-x border-pink-100 bg-white/40 backdrop-blur-sm rounded-[3rem]">
            <p className="text-2xl font-serif leading-relaxed text-gray-800 italic">
              "Alloh ularning qalbini sevgi ila birlashtirdi."
                                                    Anfol 63
            </p>
          </div>
        </motion.section>

        {/* BLOK 3: TAKLIFNOMA MATNI */}
        <motion.section style={{ opacity: wishOpacity, y: wishY }} className="fixed inset-0 flex flex-col items-center justify-center px-12 text-center pointer-events-none">
          <div className="max-w-md p-10 border-y border-pink-100 bg-white/60 backdrop-blur-sm rounded-[3rem]">
            <h2 className="text-4xl font-serif mb-8 text-pink-800 italic text-center">Baxshida...</h2>
            <p className="text-2xl font-light leading-relaxed text-gray-700 text-center">
              "Ikki qalbning bir butunlik sari tashlagan ilk qadami, sizdek aziz insonlar davrasida yanada munavvardir."
            </p>
          </div>
        </motion.section>

        {/* BLOK 4: KALENDAR (To'g'rilangan) */}
        <motion.section style={{ opacity: calOpacity, y: calY }} className="fixed inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-pink-50 w-full max-w-sm">
            <h3 className="text-3xl font-serif mb-6 text-center border-b pb-4 text-pink-800 font-bold">May 2026</h3>
              
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {/* Hafta kunlari nomlari */}
              {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(d => (
                <div key={d} className="font-bold text-pink-300 pb-2 uppercase text-[10px]">{d}</div>
              ))}
        
              {/* 2026-yil may oyi Juma kunidan boshlanadi. Shuning uchun 4 ta bo'sh katak kerak */}
              {[...Array(4)].map((_, i) => <div key={`empty-${i}`}></div>)}
            
              {/* Oy kunlari (31 kungacha) */}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isWeddingDay = day === 15; // 15-mayni belgilash
              
                return (
                  <div key={day} className="relative py-2 flex items-center justify-center text-lg">
                    {isWeddingDay && (
                      <motion.div 
                        layoutId="highlight" 
                        className="absolute w-10 h-10 bg-pink-500 rounded-full -z-10" 
                        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }} 
                        transition={{ repeat: Infinity, duration: 2 }} 
                      />
                    )}
                    <span className={`${isWeddingDay ? "text-white font-bold" : "text-gray-700"}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-center text-pink-900 font-serif text-lg">Juma kuni, soat 18:00 da</p>
          </div>
        </motion.section>

        {/* BLOK 5: TUGMALAR */}
        <motion.section style={{ opacity: buttonsOpacity, y: buttonsY }} className="fixed inset-0 flex flex-col items-center justify-center px-8">
          <div className="w-full max-w-sm space-y-6">
            <h2 className="text-center font-serif text-3xl mb-10 tracking-[0.2em] text-pink-900 uppercase font-bold">Sizni Kutamiz</h2>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://yandex.uz/maps?whatshere%5Bpoint%5D=71.613076%2C40.467666&whatshere%5Bzoom%5D=16.0&ll=71.61307600955409%2C40.46766596108677&z=16.0&si=2bfujhypwc22967vzgy2c0jd60" target="_blank"
              className="flex items-center justify-center gap-4 w-full py-6 bg-[#FFCC00] text-black font-bold rounded-3xl shadow-2xl border-b-4 border-yellow-600">
              <MapPin size={24} /> YANDEX XARITA
            </motion.a>
            <motion.button onClick={() => { navigator.clipboard.writeText("8600..."); alert("Karta raqami nusxalandi!") }}
              className="flex items-center justify-center gap-4 w-full py-6 bg-white border-2 border-pink-200 text-pink-600 font-bold rounded-3xl shadow-xl">
              <CreditCard size={24} /> KARTA RAQAMI
            </motion.button>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

export default App;