"use client";

import React, { useState } from "react";
import { 
  Clock, MapPin, Phone, Mail, Send, ShieldAlert, Globe, 
  MessageCircle, Navigation, Calendar, User, Stethoscope
} from "lucide-react";

export default function FooterAndTeam({ lang, content, dynamicTeam, dynamicLocation }) {
  const t = content[lang] || content.en;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    treatment: "General Consultation",
    date: "",
    message: ""
  });

const teamList = [
    { name: "Dr. Shashi Jangid", degree: "BDS", role: "Associate Dental Surgeon", type: "Associate", image: "/images/doctor-3.jpeg" },
    { name: "Dr. Ashish Bhutra", degree: "BDS", role: "Associate Dental Surgeon", type: "Associate", image: "/images/doctor-2.jpeg" },
    { name: "Dr. Jaydutt Paliwal", degree: "BDS", role: "Associate Dental Surgeon", type: "Associate", image: "/images/doctor-1.jpeg" },
  ];

  const clinicAddress = lang === "hi" 
    ? (dynamicLocation?.addressHi || t.address)
    : (dynamicLocation?.addressEn || t.address);

  const mapQuery = dynamicLocation?.mapQuery || "Pokaran,Government Hospital,Rajasthan,India";

  const handleWhatsAppAppointment = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert(lang === "en" ? "Please fill Name and Mobile Number" : "कृपया नाम और मोबाइल नंबर भरें");
      return;
    }

    const msg = `*Appointment Request - Balaji Dental Clinic, Pokaran*%0A%0A` +
      `*Patient Name:* ${encodeURIComponent(formData.name)}%0A` +
      `*Phone Number:* ${encodeURIComponent(formData.phone)}%0A` +
      `*Treatment Service:* ${encodeURIComponent(formData.treatment)}%0A` +
      `*Preferred Date:* ${encodeURIComponent(formData.date || "Earliest Available")}%0A` +
      `*Symptoms/Note:* ${encodeURIComponent(formData.message || "None")}`;

    window.open(`https://wa.me/919782687123?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-16 sm:space-y-24 pt-4 sm:pt-6 w-full overflow-hidden pb-20 sm:pb-24">
      
      {/* 1. FLOATING WHATSAPP BUTTON (SAFE MARGIN ON MOBILE) */}
      <a
        href="https://wa.me/919782687123?text=Namaste%20Dr.%20Rajendra%20Singh%20Bhati,%20I%20want%20to%20consult%20regarding%20dental%20treatment."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] sm:text-xs px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 border border-emerald-400/40"
        aria-label="Direct WhatsApp Consultation"
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-emerald-500 shrink-0" />
        <span className="hidden sm:inline font-bold">WhatsApp</span>
      </a>

      {/* 2. DOCTORS & SPECIALISTS TEAM */}
      <section id="doctors" className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600 block">
            {lang === "en" ? "Medical Specialists" : "चिकित्सक दल"}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words">
            {lang === "en" ? "Associate Dentists & Specialists" : "सहयोगी दंत चिकित्सक एवं विशेषज्ञ"}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 break-words">
            {lang === "en"
              ? "Comprehensive dental care with visiting consultant surgeons."
              : "अनुभवी सहयोगी दंत चिकित्सकों एवं विशेषज्ञ सर्जनों का समर्पित दल।"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {teamList.map((member, idx) => (
            <div 
              key={idx} 
              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 min-w-0"
            >
            {member.image ? (
    <img
      src={member.image}
      alt={member.name}
      className="w-11 h-11 rounded-xl object-cover border border-teal-200 shadow-sm shrink-0"
    />
  ) : (
    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-700 text-xs shrink-0">
      DR
    </div>
)}
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {member.name}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold shrink-0">
                    {member.degree}
                  </span>
                </div>
                <p className="text-[11px] text-teal-600 font-medium truncate">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CLINIC LOCATION & DIRECT APPOINTMENT FORM */}
      <section id="appointment" className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Clinic Address & Map Embed */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-3.5 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === "en" ? "Visit Our Clinic" : "क्लिनिक पता एवं संपर्क"}</span>
              </span>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black break-words">
                  Balaji Dental Clinic, Pokaran
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed break-words">
                  {clinicAddress}
                </p>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px]">OPD Hours:</p>
                    <p className="text-slate-300 text-[11px]">9:00 AM - 6:30 PM (Daily)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px]">Phone / WhatsApp:</p>
                    <a href="tel:+919782687123" className="text-slate-300 hover:text-teal-300 text-[11px] truncate block">
                      +91 9782687123
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px]">Email:</p>
                    <span className="text-slate-300 text-[11px] truncate block">rajendrasingh0125@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-amber-300 text-[10px] sm:text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>Dedicated Local Anaesthesia Clinical Protocols</span>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden border border-slate-700 h-44 sm:h-48 w-full shadow-inner mt-4">
              <iframe
                title="Clinic Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* WhatsApp Direct Appointment Booking Form */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 break-words">
                {lang === "en" ? "Book Direct Consultation" : "अपॉइंटमेंट के लिए अनुरोध करें"}
              </h3>
              <p className="text-xs text-slate-500 break-words">
                {lang === "en"
                  ? "Send your request directly to Dr. Bhati's WhatsApp with your symptoms."
                  : "फॉर्म भरें और सीधे डॉ. भाटी के व्हाट्सएप पर अपना स्लॉट प्राप्त करें।"}
              </p>
            </div>

            <form onSubmit={handleWhatsAppAppointment} className="space-y-3 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    {lang === "en" ? "Full Name *" : "पूरा नाम *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === "en" ? "Patient Name" : "मरीज का नाम"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    {lang === "en" ? "Mobile Number *" : "मोबाइल नंबर *"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    {lang === "en" ? "Treatment Required" : "उपचार / समस्या"}
                  </label>
                  <select
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
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
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    {lang === "en" ? "Preferred Date" : "पसंदीदा तारीख"}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                  {lang === "en" ? "Describe Symptoms (Optional)" : "समस्या या लक्षण (वैकल्पिक)"}
                </label>
                <textarea
                  rows="2"
                  placeholder={lang === "en" ? "e.g. Toothache since 2 days..." : "दांत में दर्द, सूजन या कोई अन्य समस्या..."}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "Send via WhatsApp" : "व्हाट्सएप पर अपॉइंटमेंट भेजें"}</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 4. FOOTER & WEBNEXA BRANDING */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="space-y-2.5 sm:col-span-2">
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
            <ul className="space-y-1 text-[11px]">
              <li><a href="#about" className="hover:text-teal-400 transition">{t.nav.about}</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition">{t.nav.services}</a></li>
              <li><a href="#gallery" className="hover:text-teal-400 transition">Gallery</a></li>
              <li><a href="#blog" className="hover:text-teal-400 transition">Dental Guide</a></li>
              <li><a href="#credentials" className="hover:text-teal-400 transition">{t.nav.certificates}</a></li>
              <li><a href="#doctors" className="hover:text-teal-400 transition">{t.nav.doctors}</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Credits</p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <a
                href="https://webnexa-wine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-black text-xs flex items-center gap-1 hover:text-teal-400"
              >
                <span>Webnexa</span>
                <Globe className="w-3 h-3 text-teal-400" />
              </a>
              <p className="text-[10px] text-slate-400">Web & Software Solutions</p>
              <div className="text-[10px] space-y-0.5 text-slate-300">
                <p>WhatsApp: <a href="https://wa.me/919587289899" className="text-teal-400">9587289899</a></p>
                <p>Email: <a href="mailto:webnexa2026@gmail.com" className="text-teal-400">webnexa2026@gmail.com</a></p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & ADMIN PORTAL LINK */}
        <div className="border-t border-slate-900 py-3.5 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 max-w-7xl mx-auto gap-2">
          <p>© {new Date().getFullYear()} Balaji Dental Clinic, Pokaran. All Rights Reserved.</p>
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