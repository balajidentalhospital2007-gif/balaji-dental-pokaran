'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// डिफ़ॉल्ट सर्टिफिकेट डेटा (English + Hindi)
const initialCertificates = [
  {
    id: 1,
    titleEn: 'Fellow - Academy of Oral Implantology',
    titleHi: 'फैलो - एकेडमी ऑफ ओरल इम्प्लांटोलॉजी',
    issuerEn: 'AOI New Delhi (Reg: 2672)',
    issuerHi: 'एओआई नई दिल्ली (पंजीयन: 2672)',
    categoryEn: 'Implantology',
    categoryHi: 'इम्प्लांटोलॉजी',
    src: '/certificates/cert1.jpg',
  },
  {
    id: 2,
    titleEn: 'TMD Maxillofacial Certification',
    titleHi: 'टीएमडी मैक्सिलोफेशियल सर्टिफिकेशन',
    issuerEn: 'Facial Pain Clinical Society',
    issuerHi: 'फेशियल पेन क्लिनिकल सोसाइटी',
    categoryEn: 'Facial Pain & TMD',
    categoryHi: 'फेशियल पेन एवं जबड़ा विकार',
    src: '/certificates/cert2.jpg',
  },
  {
    id: 3,
    titleEn: 'Endodontic Mishaps & Management',
    titleHi: 'एंडोडोंटिक मिसहैप्स एंड मैनेजमेंट',
    issuerEn: 'Conservative Dentistry Forum',
    issuerHi: 'कंजर्वेटिव डेंटिस्ट्री फोरम',
    categoryEn: 'Endodontics',
    categoryHi: 'रूट कैनाल उपचार',
    src: '/certificates/cert3.jpg',
  },
  {
    id: 4,
    titleEn: 'Treat & Re-Treat Endodontics',
    issuerEn: 'Advanced Root Canal Academy',
    titleHi: 'ट्रीट एंड री-ट्रीट एंडोडोंटिक्स',
    issuerHi: 'एडवांस्ड रूट कैनाल एकेडमी',
    categoryEn: 'Endodontics',
    categoryHi: 'रूट कैनाल उपचार',
    src: '/certificates/cert4.jpg',
  },
  {
    id: 5,
    titleEn: 'Simplifying CBCT 3D Imaging',
    titleHi: 'सिम्पलीफाइंग सीबीसीटी 3D इमेजिंग',
    issuerEn: 'Oral Radiology Clinical Institute',
    issuerHi: 'ओरल रेडियोलॉजी क्लिनिकल इंस्टीट्यूट',
    categoryEn: 'Radiology & CBCT',
    categoryHi: 'डिजिटल एक्स-रे एवं 3D स्कैन',
    src: '/certificates/cert5.jpg',
  },
  {
    id: 6,
    titleEn: 'Elite Member Certificate',
    titleHi: 'एलीट मेंबर सर्टिफिकेट',
    issuerEn: 'Indian Dental Association (IDA)',
    issuerHi: 'इंडियन डेंटल एसोसिएशन (IDA)',
    categoryEn: 'Quality Care',
    categoryHi: 'उच्च गुणवत्ता मानक',
    src: '/certificates/cert6.jpg',
  },
];

export default function CertificatesPage() {
  const [lang, setLang] = useState('en'); // प्राइमरी डिफ़ॉल्ट English
  const [certificates, setCertificates] = useState(initialCertificates);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' या 'images'
  const [selectedImage, setSelectedImage] = useState(null);

  // एडमिन से डायनामिक डेटा लोड करना
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('balaji_clinic_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.certificates && parsed.certificates.length > 0) {
          setCertificates(parsed.certificates);
        }
      }
    } catch (e) {
      console.error('Error loading dynamic certificates:', e);
    }
  }, []);

  const isHi = lang === 'hi';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold text-xs md:text-sm transition"
          >
            ← {isHi ? 'मुख्य पेज पर वापस' : 'Back to Home'}
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-slate-500 font-medium">
              Balaji Dental Clinic, Pokaran
            </span>

            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={() => setLang(isHi ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-300 bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 transition shadow-sm"
            >
              <span>🌐</span>
              <span>{isHi ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-10">
        {/* Title & Badge */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-teal-700 font-semibold tracking-wider uppercase text-xs bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
            {isHi ? 'आधिकारिक मान्यता एवं योग्यताएं' : 'Official Accreditations & Credentials'}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-3">
            {isHi ? 'सत्यापित प्रमाणपत्र' : 'Verified Medical Certifications'}
          </h1>
          <p className="text-slate-600 mt-2 text-xs md:text-sm">
            {isHi
              ? 'चीफ डेंटल सर्जन एवं विशेषज्ञ डॉक्टरों के आधिकारिक काउंसिल व एसोसिएशन द्वारा सत्यापित दस्तावेज।'
              : 'Verified licenses and clinical accreditations recognized by dental councils and associations.'}
          </p>
        </div>

        {/* 2-View Tab Buttons */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl shadow-inner gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                activeTab === 'cards'
                  ? 'bg-white text-teal-800 shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 {isHi ? 'प्रमाणपत्र विवरण' : 'Credentials & Details'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                activeTab === 'images'
                  ? 'bg-white text-teal-800 shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🖼️ {isHi ? 'संपूर्ण इमेज गैलरी' : 'All Certificate Images'}
            </button>
          </div>
        </div>

        {/* SECTION 1: DETAILS & CARDS VIEW */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fadeIn">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedImage(cert)}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-100 inline-block mb-3">
                    {isHi ? (cert.categoryHi || cert.categoryEn) : cert.categoryEn}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {isHi ? (cert.titleHi || cert.titleEn) : cert.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isHi ? (cert.issuerHi || cert.issuerEn) : cert.issuerEn}
                  </p>
                </div>

                <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-600 font-semibold bg-slate-50/50">
                  <span>{isHi ? 'ओरिजिनल कॉपी देखें' : 'View Certificate Copy'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 2: ALL IMAGES VIEW */}
        {activeTab === 'images' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedImage(cert)}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col"
              >
                <div className="w-full aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={cert.src}
                    alt={isHi ? (cert.titleHi || cert.titleEn) : cert.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    style={{ display: 'none' }}
                    className="w-full h-full flex-col items-center justify-center p-3 text-center text-xs text-slate-400 bg-slate-100"
                  >
                    <span className="text-2xl mb-1">📄</span>
                    <span className="font-semibold text-slate-600">
                      {isHi ? (cert.titleHi || cert.titleEn) : cert.titleEn}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {isHi ? 'इमेज अपलोड प्रतीक्षारत' : 'Image pending upload'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {isHi ? (cert.titleHi || cert.titleEn) : cert.titleEn}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {isHi ? (cert.issuerHi || cert.issuerEn) : cert.issuerEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox / Full-Screen Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  {isHi ? (selectedImage.titleHi || selectedImage.titleEn) : selectedImage.titleEn}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHi ? (selectedImage.issuerHi || selectedImage.issuerEn) : selectedImage.issuerEn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Image Zoom View */}
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-900 min-h-[350px]">
              <img
                src={selectedImage.src}
                alt={isHi ? (selectedImage.titleHi || selectedImage.titleEn) : selectedImage.titleEn}
                className="max-h-[72vh] w-auto object-contain rounded shadow"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                style={{ display: 'none' }}
                className="text-center p-8 text-slate-300 text-sm"
              >
                {isHi ? (
                  <>
                    प्रमाणपत्र की इमेज फ़ाइल <code className="text-teal-400 font-mono">{selectedImage.src}</code> अभी उपलब्ध नहीं है।
                    <br />
                    एडमिन पैनल से इमेज अपलोड होने के बाद यहाँ प्रदर्शित होगी।
                  </>
                ) : (
                  <>
                    Certificate image for <span className="text-teal-400 font-mono">{selectedImage.src}</span> is pending upload.
                    <br />
                    It will appear here once uploaded via the admin panel.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}