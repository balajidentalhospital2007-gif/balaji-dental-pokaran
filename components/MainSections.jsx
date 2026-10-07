"use client";

import React, { useState } from "react";
import { 
  Award, ShieldCheck, Stethoscope, CheckCircle, Phone, 
  ChevronRight, X, ExternalLink, BookOpen, Image as ImageIcon, Calendar
} from "lucide-react";

export default function MainSections({ lang, content, dynamicGallery, dynamicBlogs }) {
  const [activeCert, setActiveCert] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const t = content[lang] || content.en;

  const defaultServices = [
    { titleEn: "General Dentistry", titleHi: "सामान्य दंत चिकित्सा", descEn: "Preventive care, routine checkups & cleanings.", descHi: "नियमित जांच एवं संपूर्ण दंत सुरक्षा।" },
    { titleEn: "Conservative & Endodontics", titleHi: "संरक्षी दंत चिकित्सा (RCT)", descEn: "Pain-free Root Canal (RCT) & restorations.", descHi: "दर्द-रहित आधुनिक रूट कैनाल और फिलिंग।" },
    { titleEn: "Oral Medicine & Radiology", titleHi: "मुख रोग व रेडियोलॉजी", descEn: "Digital X-rays & soft-tissue diagnostics.", descHi: "डिजिटल एक्स-रे एवं सटीक परीक्षण।" },
    { titleEn: "Prosthodontics", titleHi: "प्रोस्थोडॉन्टिक्स (क्राउन व बत्तीसी)", descEn: "Crowns, bridges, partial and complete dentures.", descHi: "सिरेमिक क्राउन एवं आधुनिक बत्तीसी।" },
    { titleEn: "Orthodontics", titleHi: "ऑर्थोडॉन्टिक्स (तार व ब्रेसेस)", descEn: "Teeth alignment with metal, ceramic & aligners.", descHi: "टेढ़े-मेढ़े दांतों के तार व अलाइनर्स।" },
    { titleEn: "Implantology", titleHi: "इम्प्लांटोलॉजी (डेंटल इम्प्लांट्स)", descEn: "Permanent tooth replacements with titanium implants.", descHi: "मजबूत स्थायी डेंटल इम्प्लांट्स।" }
  ];

  const certificatesData = [
    { id: "aoi-fellow", title: "Fellow - Academy of Oral Implantology", issuer: "AOI New Delhi (Aug 2023)", badge: "Fellowship & Medal", highlight: true },
    { id: "tmj-masterclass", title: "TMJ Masterclass Certification", issuer: "Fab32 Dental (2026)", badge: "Jaw Joint & TMD" },
    { id: "advanced-endo", title: "Endodontic Mishaps & Management", issuer: "Dentsply Sirona (2019)", badge: "Advanced RCT" },
    { id: "treat-retreat", title: "Treat & Re-Treat Endodontics", issuer: "Endo Grounds (2022)", badge: "Micro-Endodontics" },
    { id: "cbct-imaging", title: "Simplifying CBCT 3D Imaging", issuer: "IDA Jodhpur (2019)", badge: "Dental Radiology" },
    { id: "gc-membership", title: "Elite Member Certificate", issuer: "GC India Dental", badge: "Quality Care" }
  ];

  const galleryList = dynamicGallery && dynamicGallery.length > 0 ? dynamicGallery : [
    { id: 1, title: "Modern Dental Operatory", category: "clinic", label: "एडवांस्ड डेंटल चेयर" },
    { id: 2, title: "Class-B Autoclave Sterilization", category: "sterilization", label: "सख्त स्वच्छता व नसबंदी" },
    { id: 3, title: "Digital RVG Diagnostic Suite", category: "equipment", label: "डिजिटल एक्स-रे यूनिट" }
  ];

  const filteredGallery = galleryFilter === "all" 
    ? galleryList 
    : galleryList.filter(item => item.category === galleryFilter);

  const blogList = dynamicBlogs && dynamicBlogs.length > 0 ? dynamicBlogs : [
    {
      id: 1,
      titleEn: "Why Dental Implants Are the Gold Standard",
      titleHi: "खोए हुए दांतों के लिए डेंटल इम्प्लांट्स क्यों बेहतर हैं?",
      descEn: "Learn how permanent implants prevent jawbone loss and look natural.",
      descHi: "जानिए कैसे डेंटल इम्प्लांट्स जबड़े की हड्डी को सुरक्षित रखते हैं।",
      readTime: "3 min read"
    },
    {
      id: 2,
      titleEn: "Root Canal (RCT) Myths vs Facts",
      titleHi: "रूट कैनाल (RCT): भ्रम बनाम सच्चाई",
      descEn: "Modern local anaesthesia makes RCT completely comfortable.",
      descHi: "आधुनिक एनेस्थीसिया से अब रूट कैनाल दर्द-रहित प्रक्रिया है।",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10 w-full overflow-hidden px-3 sm:px-6 max-w-7xl mx-auto">
      
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-white shadow-xl border border-slate-700/50">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[10px] sm:text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>19+ Years Trusted Dental Care</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight break-words">
            Excellence in <span className="text-teal-400">Dental Implants</span> & Family Dentistry
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal break-words">
            Balaji Dental Clinic delivers hospital-grade sterilization, digital diagnostics, and painless advanced procedures under Chief Dental Surgeon Dr. Rajendra Singh Bhati.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <a
              href="#appointment"
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md"
            >
              {t.cta.bookAppointment}
            </a>
            <a
              href="tel:+919782687123"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>+91 9782687123</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ABOUT DOCTOR (FIXED OVERLAP BUG) */}
      <section id="about" className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Doctor Profile Card */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-slate-50 to-teal-50/50 rounded-2xl p-5 border border-slate-200 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0">
              DR
            </div>
            
            <div className="space-y-1 w-full">
              <h3 className="font-black text-slate-900 text-base sm:text-lg break-words">
                {t.chiefDoctor.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-teal-700 font-bold break-words">
                {t.chiefDoctor.degrees}
              </p>
              <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                Chief Implantologist & Surgeon
              </span>
            </div>

            {/* Award Badge - Clean separate block, NO overlap */}
            <div className="w-full bg-white p-3 rounded-xl border border-amber-200 shadow-sm flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-xs truncate">Fellow in AOI (New Delhi)</p>
                <p className="text-slate-500 text-[10px] truncate">Academy of Oral Implantology</p>
              </div>
            </div>
          </div>

          {/* Doctor Bio Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600 block">
                {lang === "en" ? "About Doctor" : "चिकित्सक परिचय"}
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words">
                {t.chiefDoctor.name}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold">{t.chiefDoctor.regNo}</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold">{t.chiefDoctor.experience}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
              {t.chiefDoctor.about}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">Hospital-Grade Sterilization</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">Digital X-Ray & RVG Diagnosis</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SERVICES */}
      <section id="services" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600">
            {lang === "en" ? "Dental Treatments" : "उपलब्ध सेवाएं"}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words">
            Specialised Clinical Care
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {defaultServices.map((item, index) => (
            <div key={index} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words">
                {lang === "en" ? item.titleEn : item.titleHi}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {lang === "en" ? item.descEn : item.descHi}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GALLERY */}
      <section id="gallery" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600">
            {lang === "en" ? "Photo Tour" : "क्लिनिक गैलरी"}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words">
            Clinic Infrastructure
          </h2>
          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
            {["all", "clinic", "equipment", "sterilization"].map((f) => (
              <button
                key={f}
                onClick={() => setGalleryFilter(f)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize transition ${
                  galleryFilter === f ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredGallery.map((img) => (
            <div key={img.id} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[4/3] p-4 flex flex-col justify-end text-white shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-25">
                <ImageIcon className="w-12 h-12 text-teal-400" />
              </div>
              <div className="relative z-20 space-y-0.5 min-w-0">
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/80 inline-block">
                  {img.category}
                </span>
                <h4 className="font-bold text-xs sm:text-sm truncate">{img.title}</h4>
                <p className="text-[10px] text-slate-300 truncate">{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BLOG / DENTAL GUIDE (FIXED TEXT OVERFLOW) */}
      <section id="blog" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600">
            {lang === "en" ? "Dental Health Guide" : "दंत स्वास्थ्य गाइड"}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words">
            Patient Education & Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {blogList.map((post) => (
            <article key={post.id} className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-teal-600 font-bold shrink-0">
                  <BookOpen className="w-3.5 h-3.5" /> Care Tip
                </span>
                <span className="shrink-0">{post.readTime}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug break-all sm:break-words">
                {lang === "en" ? post.titleEn : post.titleHi}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed break-all sm:break-words">
                {lang === "en" ? post.descEn : post.descHi}
              </p>
              <a href="#appointment" className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 pt-1">
                <span>{lang === "en" ? "Consult Doctor" : "परामर्श लें"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* 6. CREDENTIALS */}
      <section id="credentials" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600">
            Accreditations
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words">
            Verified Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {certificatesData.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setActiveCert(cert)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer bg-white shadow-sm flex flex-col justify-between gap-3 ${
                cert.highlight ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">{cert.badge}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm break-words">{cert.title}</h3>
                <p className="text-[11px] text-slate-500 break-words">{cert.issuer}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-teal-600 font-semibold">
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{activeCert.title}</h3>
                <button onClick={() => setActiveCert(null)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl text-center space-y-1.5">
                <Award className="w-10 h-10 text-teal-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">{activeCert.issuer}</p>
              </div>
              <button onClick={() => setActiveCert(null)} className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}