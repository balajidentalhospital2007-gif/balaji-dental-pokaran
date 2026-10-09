'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// 8 Default Clinic Photos
const defaultClinicPhotos = [
  { 
    id: 1, 
    src: '/images/h1.jpeg', 
    titleEn: 'Clinic Exterior View & Premises', 
    titleHi: 'क्लिनिक का बाहरी दृश्य एवं मुख्य परिसर' 
  },
  { 
    id: 2, 
    src: '/images/h2.jpeg', 
    titleEn: 'Main Entrance & Reception Desk', 
    titleHi: 'मुख्य प्रवेश द्वार एवं स्वागत कक्ष' 
  },
  { 
    id: 3, 
    src: '/images/a1.jpeg', 
    titleEn: 'Modern Dental Operatory & Chair Unit', 
    titleHi: 'आधुनिक डेंटल चेयर एवं यूनिट' 
  },
  { 
    id: 4, 
    src: '/images/a2.jpeg', 
    titleEn: 'Advanced Treatment & Surgical Operatory', 
    titleHi: 'उन्नत उपचार एवं सर्जिकल सेटअप' 
  },
  { 
    id: 5, 
    src: '/images/a3.jpeg', 
    titleEn: 'Hospital-Grade Sterilization & Hygiene Zone', 
    titleHi: 'ऑटोक्लेव स्टरलाइजेशन एवं स्वच्छता कक्ष' 
  },
  { 
    id: 6, 
    src: '/images/a4.jpeg', 
    titleEn: 'Comfortable Patient Waiting Lounge', 
    titleHi: 'मरीज प्रतीक्षालय एवं वेटिंग एरिया' 
  },
  { 
    id: 7, 
    src: '/images/a5.jpeg', 
    titleEn: 'Digital RVG Diagnostic X-Ray Setup', 
    titleHi: 'डिजिटल डेंटल एक्सरे एवं जांच उपकरण' 
  },
  { 
    id: 8, 
    src: '/images/c1.jpeg', 
    titleEn: 'Doctor Private Consultation Chamber', 
    titleHi: 'डॉक्टर व्यक्तिगत परामर्श कक्ष' 
  },
];

export default function ClinicSlider({ lang = 'en', dynamicGallery = [] }) {
  const [photos, setPhotos] = useState(defaultClinicPhotos);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Default 8 photos ke sath Admin panel ki nayi photos ko merge karne ka solid logic
  const mergePhotos = (incomingList) => {
    if (!Array.isArray(incomingList) || incomingList.length === 0) {
      return defaultClinicPhotos;
    }

    const validIncoming = incomingList.filter(
      (item) => item && typeof item === 'object' && item.src
    );

    if (validIncoming.length === 0) return defaultClinicPhotos;

    // Default photos ko base rakhein
    const merged = [...defaultClinicPhotos];

    // Admin se aayi hui photos agar default mein nahi hain to append karein,
    // aur agar default wali replace ki gayi ho to update karein
    validIncoming.forEach((item) => {
      const existingIdx = merged.findIndex((m) => m.src === item.src);
      if (existingIdx !== -1) {
        merged[existingIdx] = { ...merged[existingIdx], ...item };
      } else {
        merged.push(item);
      }
    });

    return merged;
  };

  useEffect(() => {
    // 1. Agar Parent component se dynamicGallery aayi ho
    if (dynamicGallery && dynamicGallery.length > 0) {
      setPhotos(mergePhotos(dynamicGallery));
      return;
    }

    // 2. LocalStorage Cache se merge karein
    try {
      const cached = localStorage.getItem('balaji_clinic_config');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.gallery && Array.isArray(parsed.gallery)) {
          setPhotos(mergePhotos(parsed.gallery));
        }
      }
    } catch (e) {
      console.warn('LocalStorage load warning:', e);
    }

    // 3. Firebase Cloud Firestore se real-time dynamic sync
    try {
      const docRef = doc(db, 'settings', 'clinic_config');
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists() && snap.data()?.gallery) {
            setPhotos(mergePhotos(snap.data().gallery));
          } else {
            setPhotos(defaultClinicPhotos);
          }
        },
        (error) => {
          console.warn('Firestore fallback active:', error);
          setPhotos(defaultClinicPhotos);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore listener error:', err);
      setPhotos(defaultClinicPhotos);
    }
  }, [dynamicGallery]);

  // Index bounds safeguard
  useEffect(() => {
    if (current >= photos.length) {
      setCurrent(0);
    }
  }, [photos.length, current]);

  // Auto Slider Timer
  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % photos.length);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const isHi = lang === 'hi';
  const activePhoto = photos[current] || defaultClinicPhotos[0];

  return (
    <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-200" id="clinic-tour">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <span className="text-teal-800 font-bold tracking-wider uppercase text-xs md:text-sm bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200 inline-block">
            {isHi ? 'विश्वस्तरीय सुविधाएं एवं आधुनिक तकनीक' : 'World-Class Facility & Modern Care'}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            {isHi ? 'क्लिनिक का आंतरिक एवं बाह्य अवलोकन' : 'Clinic Infrastructure & Tour'}
          </h2>
          <p className="text-slate-600 mt-2 text-xs md:text-sm leading-relaxed">
            {isHi 
              ? 'उन्नत उपकरण, दर्द-रहित तकनीक और स्वच्छता के उच्चतम मानकों के साथ तैयार हमारा क्लिनिक।' 
              : 'Take a virtual tour of our modern operatory, sterilization protocols, and advanced dental infrastructure in Pokaran.'}
          </p>
        </div>

        {/* Carousel Slider */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950 group select-none"
        >
          {/* Main Slide Image */}
          <img
            src={activePhoto?.src || '/images/h1.jpeg'}
            alt={isHi ? (activePhoto?.titleHi || 'क्लिनिक सुविधा') : (activePhoto?.titleEn || 'Clinic Facility')}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src = '/images/h1.jpeg';
            }}
          />

          {/* Bottom Gradient Overlay & Captions */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent flex items-end p-5 md:p-8">
            <div className="max-w-xl">
              <span className="text-[10px] md:text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">
                {isHi ? 'सुविधा अवलोकन' : 'Facility Preview'} • {current + 1} / {photos.length}
              </span>
              <p className="text-white text-base sm:text-lg md:text-xl font-bold drop-shadow-md">
                {isHi 
                  ? (activePhoto?.titleHi || 'क्लिनिक सुविधा') 
                  : (activePhoto?.titleEn || 'Clinic Infrastructure')}
              </p>
              <p className="text-slate-300 text-xs md:text-sm font-medium drop-shadow mt-0.5">
                {isHi ? 'बालाजी डेंटल क्लिनिक, पोकरण' : 'Balaji Dental Clinic, Pokaran'}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                type="button"
                aria-label="Previous Slide"
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 sm:p-2.5 rounded-full shadow-lg backdrop-blur-sm transition active:scale-90"
              >
                &#8592;
              </button>
              <button
                onClick={nextSlide}
                type="button"
                aria-label="Next Slide"
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 sm:p-2.5 rounded-full shadow-lg backdrop-blur-sm transition active:scale-90"
              >
                &#8594;
              </button>

              {/* Dynamic Dots Indicator */}
              <div className="absolute bottom-4 right-5 md:right-6 flex items-center gap-1.5 z-10 max-w-[50%] overflow-x-auto py-1">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 shrink-0 ${
                      idx === current ? 'w-6 bg-teal-400' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}