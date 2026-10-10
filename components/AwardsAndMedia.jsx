'use client';

import React, { useState, useEffect } from 'react';
import { Award, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// Default images aw1 to aw9 (Bina hardcoded titles ke)
const defaultImages = [
  { id: 1, src: '/images/aw1.jpeg' },
  { id: 2, src: '/images/aw2.jpeg' },
  { id: 3, src: '/images/aw3.jpeg' },
  { id: 4, src: '/images/aw4.jpeg' },
  { id: 5, src: '/images/aw5.jpeg' },
  { id: 6, src: '/images/aw6.jpeg' },
  { id: 7, src: '/images/aw7.jpeg' },
  { id: 8, src: '/images/aw8.jpeg' },
  { id: 9, src: '/images/aw9.jpeg' }
];

export default function AwardsAndMedia({ lang = 'en' }) {
  const [items, setItems] = useState(defaultImages);
  const [current, setCurrent] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const isHi = lang === 'hi';

  // Firestore sync & LocalStorage fallback
  useEffect(() => {
    try {
      const cached = localStorage.getItem('balaji_clinic_config');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.awardsMedia && parsed.awardsMedia.length > 0) {
          setItems(parsed.awardsMedia);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    try {
      const docRef = doc(db, 'settings', 'clinic_config');
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists() && snap.data()?.awardsMedia && snap.data().awardsMedia.length > 0) {
          setItems(snap.data().awardsMedia);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore sync error:', err);
    }
  }, []);

  // 4-Second Smooth Interval (Desktop hover ya touch pause supported)
  useEffect(() => {
    if (!items || items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  // iOS Safari & Android Optimized Touch Gestures
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;
    if (diff > 40) nextSlide();
    if (diff < -40) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80 overflow-hidden" id="media-awards">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        
        {/* Responsive Header */}
        <div className="text-center max-w-xl mx-auto mb-5 sm:mb-8">
          <span className="inline-flex items-center gap-1 text-teal-800 font-bold tracking-wider uppercase text-[10px] sm:text-xs bg-teal-50 px-3 py-1 rounded-full border border-teal-200/80 shadow-xs">
            <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            {isHi ? 'सम्मान एवं मीडिया कवरेज' : 'Awards & Media Spotlight'}
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight px-2">
            {isHi ? 'डॉ. राजेंद्र सिंह भाटी: उपलब्धियां एवं प्रेस कवरेज' : 'Dr. Rajendra Singh Bhati: Achievements & Press'}
          </h2>
        </div>

        {/* Universal Adaptive Slider Frame */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-3xl mx-auto bg-slate-950 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-slate-800/30 aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] group select-none touch-pan-y"
        >
          {/* Hardware-Accelerated Fluid Slide Container */}
          {items.map((item, index) => {
            const isActive = index === current;
            return (
              <div
                key={item.id || index}
                onClick={() => setSelectedPhoto(item.src)}
                className={`absolute inset-0 w-full h-full cursor-pointer transition-all duration-700 ease-in-out transform-gpu will-change-transform ${
                  isActive 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-[1.02] pointer-events-none z-0'
                }`}
              >
                {/* Ambient Blurry Backdrop for Aspect Ratio Mismatch */}
                <img
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
                />

                {/* Main High-Definition Image */}
                <img
                  src={item.src}
                  alt={`Award slide ${index + 1}`}
                  className="relative z-1 w-full h-full object-contain p-1 sm:p-2"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    e.currentTarget.src = '/images/h1.jpeg';
                  }}
                />
              </div>
            );
          })}

          {/* Zoom HD Button */}
          <button
            onClick={() => setSelectedPhoto(items[current]?.src)}
            type="button"
            className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 bg-black/60 active:bg-black/90 hover:bg-black/80 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md flex items-center gap-1 border border-white/10 transition shadow-md"
          >
            <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" />
            <span>{isHi ? 'बड़ा देखें' : 'View HD'}</span>
          </button>

          {/* Photo Counter */}
          <span className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10 shadow">
            {current + 1} / {items.length}
          </span>

          {/* Slide Arrow Controls (Touch-friendly size) */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                type="button"
                aria-label="Previous Slide"
                className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white active:scale-90 text-slate-800 p-2 sm:p-2.5 rounded-full shadow-lg backdrop-blur-md transition border border-slate-200"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                type="button"
                aria-label="Next Slide"
                className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white active:scale-90 text-slate-800 p-2 sm:p-2.5 rounded-full shadow-lg backdrop-blur-md transition border border-slate-200"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Indicator Pill Dots */}
              <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-20 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                      idx === current ? 'w-4 sm:w-5 bg-teal-400' : 'w-1 sm:w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mobile & Desktop HD Full-Screen Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 transition-all duration-300"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-5xl w-full max-h-[95vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close Preview"
                className="absolute top-2 right-2 sm:-top-12 sm:right-0 z-10 bg-white/20 active:bg-white/30 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-md transition border border-white/30"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <img
                src={selectedPhoto}
                alt="Full size award preview"
                className="max-h-[85vh] sm:max-h-[90vh] max-w-full w-auto object-contain rounded-lg sm:rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}