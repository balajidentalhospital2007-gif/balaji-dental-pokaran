"use client";

import React, { useState } from "react";
import { 
  Clock, MapPin, Phone, Mail, Send, ShieldAlert, Globe, 
  MessageCircle, Navigation, ExternalLink, Compass
} from "lucide-react";

// ========================================================
// 1. GPS DIRECT NAVIGATION & VERIFIED BRANDING
// ========================================================
const GOOGLE_MAPS_NAV_URL = "https://www.google.com/maps/dir/?api=1&destination=Balaji+Dental+Clinic+Pokaran&dir_action=navigate";
const GOOGLE_MAPS_EMBED_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.0831777035996!2d71.91688647444153!3d26.92224625968268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39472db1ba1f36fd%3A0x3f79aac3d544e9d9!2sBalaji%20Dental%20Clinic%20Pokaran!5e1!3m2!1sen!2sin!4v1793030551818!5m2!1sen!2sin";

// Webnexa Contact Details
const WEBNEXA_RAW_PHONE = "8619089899";
const WEBNEXA_DISPLAY_PHONE = "+91 86190 89899";
const WEBNEXA_EMAIL = "webnexa2026@gmail.com";

export default function FooterAndTeam({ lang = "en", content = {}, dynamicTeam, dynamicLocation }) {
  const t = content[lang] || content.en || {
    address: "Pokaran, Rajasthan, India",
    tagline: "Advanced Dental Care & Implant Center",
    nav: {
      about: "About Us",
      services: "Services",
      certificates: "Credentials",
      doctors: "Specialists"
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    treatment: "General Consultation",
    date: "",
    message: ""
  });

  const defaultDoctors = [
    { name: "Dr. Shashi Jangid", degree: "BDS", role: "Associate Dental Surgeon", type: "Associate", image: "/images/doctor-3.jpeg" },
    { name: "Dr. Ashish Bhutra", degree: "BDS", role: "Associate Dental Surgeon", type: "Associate", image: "/images/doctor-2.jpeg" },
    { name: "Dr. Jaydutt Paliwal", degree: "BDS", role: "Associate Dental Surgeon", type: "Associate", image: "/images/doctor-1.jpeg" },
  ];

  const teamList = (dynamicTeam && dynamicTeam.length > 0) ? dynamicTeam : defaultDoctors;

  const clinicAddress = lang === "hi" 
    ? (dynamicLocation?.addressHi || t.address)
    : (dynamicLocation?.addressEn || t.address);

  // Phone and Validation Sanitizer
  const handleWhatsAppAppointment = (e) => {
    e.preventDefault();
    const cleanPhone = formData.phone.trim().replace(/[^\d+]/g, "");

    if (!formData.name.trim() || cleanPhone.length < 10) {
      alert(lang === "en" ? "Please enter a valid 10-digit mobile number." : "कृपया एक सही 10 अंकों का मोबाइल नंबर दर्ज करें।");
      return;
    }

    const msg = `*Appointment Request - Balaji Dental Clinic, Pokaran*%0A%0A` +
      `*Patient Name:* ${encodeURIComponent(formData.name.trim())}%0A` +
      `*Phone Number:* ${encodeURIComponent(cleanPhone)}%0A` +
      `*Treatment:* ${encodeURIComponent(formData.treatment)}%0A` +
      `*Preferred Date:* ${encodeURIComponent(formData.date || "Earliest Available")}%0A` +
      `*Symptoms / Notes:* ${encodeURIComponent(formData.message.trim() || "None")}`;

    window.open(`https://wa.me/919782687123?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-14 sm:space-y-24 pt-4 sm:pt-6 w-full overflow-hidden pb-16 sm:pb-24 select-none-touch">
      
      {/* 1. FLOATING WHATSAPP BUTTON (SAFE-AREA OPTIMIZED FOR IOS & ANDROID) */}
      <a
        href="https://wa.me/919782687123?text=Namaste%20Dr.%20Rajendra%20Singh%20Bhati,%20I%20want%20to%20consult%20regarding%20dental%20treatment."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 transform active:scale-90 touch-manipulation border border-white/20"
        aria-label="Direct WhatsApp Consultation"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-500 shrink-0" />
        <span className="font-semibold tracking-wide">WhatsApp</span>
      </a>

      {/* 2. DOCTORS & SPECIALISTS TEAM */}
      <section id="doctors" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5 px-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-teal-600 block">
            {lang === "en" ? "Medical Specialists" : "चिकित्सक दल"}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === "en" ? "Associate Dentists & Specialists" : "सहयोगी दंत चिकित्सक एवं विशेषज्ञ"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === "en"
              ? "Comprehensive dental care with visiting consultant surgeons."
              : "अनुभवी सहयोगी दंत चिकित्सकों एवं विशेषज्ञ सर्जनों का समर्पित दल।"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {teamList.map((member, idx) => (
            <div 
              key={member.name || idx} 
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-3.5 transition-shadow hover:shadow-md"
            >
              <img
                src={member.image || `/images/doctor-${(idx % 3) + 1}.jpeg`}
                alt={member.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `/images/doctor-1.jpeg`;
                }}
                className="w-12 h-12 rounded-xl object-cover border border-teal-100 shadow-sm shrink-0 bg-slate-100"
              />
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {member.name}
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold shrink-0">
                    {member.degree}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-teal-600 font-medium truncate">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CLINIC LOCATION & DIRECT APPOINTMENT FORM */}
      <section id="appointment" className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Clinic Address & Map Embed */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 p-5 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 shrink-0 text-teal-400" />
                <span>{lang === "en" ? "Visit Our Clinic" : "क्लिनिक पता एवं जीपीएस"}</span>
              </span>

              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Balaji Dental Clinic, Pokaran
                </h3>
                <a
                  href={GOOGLE_MAPS_NAV_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block text-xs sm:text-sm text-slate-300 hover:text-teal-300 transition-colors leading-relaxed"
                  title="Direct Live Route"
                >
                  <span>{clinicAddress}</span>
                  <span className="inline-flex items-center gap-1 ml-1.5 text-xs text-teal-400 font-semibold group-hover:underline">
                    (दिशा-निर्देश देखें <ExternalLink className="w-3 h-3 inline" />)
                  </span>
                </a>
              </div>

              <div className="space-y-3 pt-2 text-xs sm:text-sm border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white text-xs">OPD Hours:</p>
                    <p className="text-slate-300 text-xs">9:00 AM - 6:30 PM (Daily)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white text-xs">Call / WhatsApp:</p>
                    <a href="tel:+919782687123" className="text-slate-300 hover:text-teal-300 text-xs transition">
                      +91 9782687123
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white text-xs">Email:</p>
                    <a href="mailto:rajendrasingh0125@gmail.com" className="text-slate-300 hover:text-teal-300 text-xs transition break-all">
                      rajendrasingh0125@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-amber-300 text-[11px] sm:text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Dedicated Local Anaesthesia Clinical Protocols</span>
                </div>
              </div>
            </div>

            {/* Google Maps Embed & Instant Navigation */}
            <div className="space-y-3 mt-4">
              <div className="rounded-xl overflow-hidden border border-slate-700/80 h-44 sm:h-48 w-full shadow-inner bg-slate-950">
                <iframe
                  title="Balaji Dental Clinic Pokaran Live Navigation Map"
                  src={GOOGLE_MAPS_EMBED_SRC}
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              <a
                href={GOOGLE_MAPS_NAV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition transform active:scale-95 touch-manipulation"
              >
                <Navigation className="w-4 h-4 text-slate-950 fill-current shrink-0" />
                <span>{lang === "en" ? "Start GPS Route & Distance" : "सीधा GPS नेविगेशन चालू करें (दूरी व रास्ता)"}</span>
              </a>
            </div>
          </div>

          {/* WhatsApp Direct Appointment Booking Form */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {lang === "en" ? "Book Direct Consultation" : "अपॉइंटमेंट के लिए अनुरोध करें"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {lang === "en"
                  ? "Send your request directly to Dr. Bhati's WhatsApp with your symptoms."
                  : "फॉर्म भरें और सीधे डॉ. भाटी के व्हाट्सएप पर अपना स्लॉट प्राप्त करें।"}
              </p>
            </div>

            <form onSubmit={handleWhatsAppAppointment} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    {lang === "en" ? "Full Name *" : "पूरा नाम *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === "en" ? "Patient Name" : "मरीज का नाम"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-[16px] sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    {lang === "en" ? "Mobile Number *" : "मोबाइल नंबर *"}
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter 10 digits"
                    placeholder="10 डिजिट मोबाइल नंबर"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-[16px] sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    {lang === "en" ? "Treatment Required" : "उपचार / समस्या"}
                  </label>
                  <select
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-[16px] sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="General Checkup">General Consultation & Checkup</option>
                    <option value="Root Canal (RCT)">Root Canal Treatment (RCT)</option>
                    <option value="Dental Implants">Dental Implants (फिक्स दांत)</option>
                    <option value="Teeth Cleaning / Scaling">Ultrasonic Teeth Cleaning</option>
                    <option value="Braces & Aligners">Braces & Aligners (तार)</option>
                    <option value="Jaw / TMJ Pain">TMJ & Jaw Joint Pain Relief</option>
                    <option value="Tooth Extraction">Tooth Extraction (दर्द-रहित)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    {lang === "en" ? "Preferred Date" : "पसंदीदा तारीख"}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-[16px] sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">
                  {lang === "en" ? "Describe Symptoms (Optional)" : "समस्या या लक्षण (वैकल्पिक)"}
                </label>
                <textarea
                  rows="2"
                  placeholder={lang === "en" ? "e.g. Toothache since 2 days..." : "दांत में दर्द, मसूड़ों में सूजन या अन्य समस्या..."}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-[16px] sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{lang === "en" ? "Send via WhatsApp" : "व्हाट्सएप पर अपॉइंटमेंट भेजें"}</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 4. FOOTER & WEBNEXA BRANDING */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/90 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 sm:gap-8">
          
          <div className="space-y-2 sm:col-span-2">
            <span className="text-base sm:text-lg font-black text-white tracking-tight block">
              Balaji Dental Clinic, Pokaran
            </span>
            <p className="text-teal-400 font-bold text-xs">{t.tagline}</p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">{clinicAddress}</p>
            <p className="text-[10px] text-slate-500 pt-1 font-mono">
              Reg. No: A-2672 | Chief Surgeon: Dr. Rajendra Singh Bhati
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Navigation</p>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#about" className="hover:text-teal-400 transition-colors">{t.nav?.about || "About"}</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">{t.nav?.services || "Services"}</a></li>
              <li><a href="#credentials" className="hover:text-teal-400 transition-colors">{t.nav?.certificates || "Certificates"}</a></li>
              <li><a href="#doctors" className="hover:text-teal-400 transition-colors">{t.nav?.doctors || "Doctors"}</a></li>
            </ul>
          </div>

          {/* Webnexa Credits Card (+91 86190 89899) */}
          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Powered By</p>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-sm">
              <a
                href="https://webnexa-wine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-black text-xs flex items-center gap-1.5 hover:text-teal-400 transition"
              >
                <span>Webnexa</span>
                <Globe className="w-3.5 h-3.5 text-teal-400" />
              </a>
              <p className="text-[10px] text-slate-400">Web & Software Solutions</p>
              
              <div className="text-[10px] space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-400">Call / WA:</span>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`tel:+91${WEBNEXA_RAW_PHONE}`} 
                      className="text-teal-400 hover:underline font-mono text-[11px] font-semibold"
                    >
                      {WEBNEXA_DISPLAY_PHONE}
                    </a>
                    <a 
                      href={`https://wa.me/91${WEBNEXA_RAW_PHONE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Direct Chat"
                      className="text-emerald-400 hover:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30"
                    >
                      WA
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-400">Email:</span>
                  <a 
                    href={`mailto:${WEBNEXA_EMAIL}`} 
                    className="text-teal-400 hover:underline truncate text-[10px]"
                  >
                    {WEBNEXA_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-slate-900 py-3.5 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 max-w-7xl mx-auto gap-2">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Balaji Dental Clinic, Pokaran. All Rights Reserved.
          </p>
          <a
            href="/admin"
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>Admin Portal 🔐</span>
          </a>
        </div>
      </footer>

    </div>
  );
}
