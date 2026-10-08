'use client';
import { useState, useEffect } from 'react';

const clinicPhotos = [
  { src: '/images/h1.jpeg', titleEn: 'Hospital Exterior View', titleHi: 'क्लिनिक का बाहरी दृश्य' },
  { src: '/images/h2.jpeg', titleEn: 'Clinic Front Entrance', titleHi: 'मुख्य प्रवेश द्वार' },
  { src: '/images/a1.jpeg', titleEn: 'Modern Dental Operatory', titleHi: 'उन्नत डेंटल चेयर सेटअप' },
  { src: '/images/a2.jpeg', titleEn: 'Advanced Treatment Setup', titleHi: 'आधुनिक उपचार कक्ष' },
  { src: '/images/a3.jpeg', titleEn: 'Sterilization & Hygiene Zone', titleHi: 'स्टेरिलाइजेशन एवं स्वच्छता क्षेत्र' },
  { src: '/images/a4.jpeg', titleEn: 'Patient Waiting Lounge', titleHi: 'प्रतीक्षा कक्ष' },
  { src: '/images/a5.jpeg', titleEn: 'Digital Diagnostic Equipment', titleHi: 'डिजिटल जांच उपकरण' },
  { src: '/images/c1.jpeg', titleEn: 'Consultation Room', titleHi: 'डॉक्टर परामर्श कक्ष' },
];

export default function ClinicSlider({ lang = 'en', dynamicGallery = [] }) {
  const photos = dynamicGallery && dynamicGallery.length > 0 ? dynamicGallery : clinicPhotos;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [photos.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % photos.length);
  };

  const isHi = lang === 'hi';
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200" id="clinic-tour">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-cyan-700 font-semibold tracking-wider uppercase text-xs md:text-sm bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            {isHi ? 'विश्वस्तरीय सुविधाएं एवं आधुनिक तकनीक' : 'World-Class Facility & Modern Care'}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">
            {isHi ? 'क्लिनिक का आंतरिक एवं बाह्य अवलोकन' : 'Clinic Infrastructure & Tour'}
          </h2>
          <p className="text-slate-600 mt-2 text-xs md:text-sm">
            {isHi 
              ? 'उन्नत उपकरण, दर्द-रहित तकनीक और स्वच्छता के उच्चतम मानकों के साथ तैयार हमारा क्लिनिक।' 
              : 'Take a virtual tour of our modern equipment, hygienic environment, and advanced dental facilities.'}
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="relative w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-black">
          <img
            src={clinicPhotos[current].src}
            alt={isHi ? clinicPhotos[current].titleHi : clinicPhotos[current].titleEn}
            className="w-full h-full object-cover transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6 md:p-8">
            <div>
              <p className="text-white text-lg md:text-xl font-semibold drop-shadow">
                {isHi ? clinicPhotos[current].titleHi : clinicPhotos[current].titleEn}
              </p>
              <p className="text-slate-200 text-xs md:text-sm drop-shadow">
                {isHi ? 'बालाजी डेंटल क्लिनिक, पोकरण' : 'Balaji Dental Clinic, Pokaran'}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            type="button"
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md backdrop-blur-sm transition"
          >
            &#8592;
          </button>
          <button
            onClick={nextSlide}
            type="button"
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md backdrop-blur-sm transition"
          >
            &#8594;
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
            {clinicPhotos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${idx === current ? 'w-6 bg-cyan-500' : 'w-2 bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}