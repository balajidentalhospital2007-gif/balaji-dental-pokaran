"use client";

import React, { useState, useEffect } from "react";
import { Phone, Clock, MapPin, Menu, X, AlertCircle, Shield, Megaphone, ArrowRight } from "lucide-react";

export default function Header({ lang, setLang, content, schedule, broadcast }) {
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = content[lang] || content.en;

  const showBroadcast = broadcast?.isActive !== false;
  const broadcastText = lang === "hi" 
    ? (broadcast?.textHi || "प्रत्येक रविवार निःशुल्क दंत परामर्श शिविर!")
    : (broadcast?.textEn || "Free Dental Consultation Camp Every Sunday!");

  const convertTo24Minutes = (h12, minStr, period) => {
    let h = parseInt(h12) || 9;
    const m = parseInt(minStr) || 0;
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  useEffect(() => {
    const evaluateStatus = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentDateStr = now.toISOString().split("T")[0];

      if (schedule?.isEmergencyClosed) {
        setIsOpenNow(false);
        setHolidayReason(schedule.emergencyReason || "Emergency Closed");
        return;
      }

      if (schedule?.weeklyOffDays && schedule.weeklyOffDays.includes(currentDay)) {
        setIsOpenNow(false);
        setHolidayReason("Weekly Off");
        return;
      }

      if (schedule?.annualHolidays && schedule.annualHolidays.some(h => h.date === currentDateStr)) {
        const found = schedule.annualHolidays.find(h => h.date === currentDateStr);
        setIsOpenNow(false);
        setHolidayReason(found?.name || "Holiday");
        return;
      }

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const openMinutes = convertTo24Minutes(
        schedule?.openHour12 ?? 9,
        schedule?.openMinute ?? "00",
        schedule?.openPeriod ?? "AM"
      );
      const closeMinutes = convertTo24Minutes(
        schedule?.closeHour12 ?? 6,
        schedule?.closeMinute ?? "30",
        schedule?.closePeriod ?? "PM"
      );

      setIsOpenNow(currentMinutes >= openMinutes && currentMinutes < closeMinutes);
      setHolidayReason("");
    };

    evaluateStatus();
    const interval = setInterval(evaluateStatus, 15000);
    return () => clearInterval(interval);
  }, [schedule]);

  const displayTimings = schedule?.openHour12 
    ? `${schedule.openHour12}:${schedule.openMinute} ${schedule.openPeriod} - ${schedule.closeHour12}:${schedule.closeMinute} ${schedule.closePeriod}`
    : t.timings;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      
      {/* 1. Broadcast Notice Bar - Mobile Optimized */}
      {showBroadcast && (
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white text-[11px] sm:text-xs py-1.5 px-3 border-b border-teal-700/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full uppercase shrink-0">
                Notice
              </span>
              <p className="font-medium text-slate-100 truncate">
                {broadcastText}
              </p>
            </div>
            <a
              href="#appointment"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5"
            >
              <span>Book</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Top Info & Quick Actions Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-3 sm:px-6 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-3 truncate">
            <span className="hidden md:flex items-center gap-1 text-slate-300 shrink-0">
              <MapPin className="w-3 h-3 text-teal-400" /> Pokaran
            </span>
            <span className="flex items-center gap-1 text-slate-300 truncate">
              <Clock className="w-3 h-3 text-teal-400 shrink-0" />
              <span className="truncate">{displayTimings}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Live Status Pill */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
              isOpenNow 
                ? "bg-emerald-950 text-emerald-400 border-emerald-500/40" 
                : "bg-rose-950 text-rose-400 border-rose-500/40"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOpenNow ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}></span>
              <span className="truncate max-w-[80px] sm:max-w-none">{isOpenNow ? "Open" : (holidayReason || "Closed")}</span>
            </span>

            {/* Language Switch */}
            <div className="flex items-center bg-slate-800 rounded-full p-0.5 border border-slate-700">
              <button
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  lang === "en" ? "bg-teal-500 text-white" : "text-slate-400"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  lang === "hi" ? "bg-teal-500 text-white" : "text-slate-400"
                }`}
              >
                HI
              </button>
            </div>

            {/* Admin Portal Button */}
            <a
              href="/admin"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 font-bold text-[10px]"
              title="Admin Portal"
            >
              <Shield className="w-2.5 h-2.5" />
              <span>Admin</span>
            </a>
          </div>

        </div>
      </div>

      {/* 3. Main Brand Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
        <a href="#" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white font-black text-base sm:text-xl shadow-md shrink-0">
            B
          </div>
          <div className="min-w-0">
            <span className="text-sm sm:text-lg font-black text-slate-900 tracking-tight block truncate leading-tight">
              {t.clinicName}
            </span>
            <span className="text-[9px] sm:text-[11px] text-teal-600 font-semibold tracking-wide uppercase block truncate">
              {t.tagline}
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-teal-600 transition">{lang === "en" ? "About" : "परिचय"}</a>
          <a href="#services" className="hover:text-teal-600 transition">{lang === "en" ? "Services" : "सेवाएं"}</a>
          <a href="#gallery" className="hover:text-teal-600 transition">{lang === "en" ? "Gallery" : "गैलरी"}</a>
          <a href="#blog" className="hover:text-teal-600 transition">{lang === "en" ? "Dental Guide" : "स्वास्थ्य ब्लॉग"}</a>
          <a href="#credentials" className="hover:text-teal-600 transition">{lang === "en" ? "Certificates" : "प्रमाणपत्र"}</a>
          <a href="#doctors" className="hover:text-teal-600 transition">{lang === "en" ? "Specialists" : "डॉक्टर्स"}</a>
          <a href="#appointment" className="hover:text-teal-600 transition">{lang === "en" ? "Location" : "लोकेशन"}</a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+919782687123"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span>+91 9782687123</span>
          </a>
          <a
            href="#appointment"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
          >
            {t.cta.bookAppointment}
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-700 rounded-lg hover:bg-slate-100 lg:hidden shrink-0 border border-slate-200"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2 shadow-lg">
          <nav className="flex flex-col gap-2 text-xs font-bold text-slate-700">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1">{lang === "en" ? "About Doctor" : "चिकित्सक परिचय"}</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-1">{lang === "en" ? "Services" : "उपलब्ध सेवाएं"}</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="py-1">{lang === "en" ? "Clinic Gallery" : "गैलरी"}</a>
            <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="py-1">{lang === "en" ? "Dental Health Guide" : "स्वास्थ्य ब्लॉग"}</a>
            <a href="#credentials" onClick={() => setMobileMenuOpen(false)} className="py-1">{lang === "en" ? "Certificates" : "प्रमाणपत्र"}</a>
            <a href="#doctors" onClick={() => setMobileMenuOpen(false)} className="py-1">{lang === "en" ? "Specialists Team" : "डॉक्टर टीम"}</a>
            <a href="#appointment" onClick={() => setMobileMenuOpen(false)} className="py-1">{lang === "en" ? "Location & Timings" : "पता व अपॉइंटमेंट"}</a>
          </nav>
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <a
              href="tel:+919782687123"
              className="flex-1 text-center py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs"
            >
              Call Clinic
            </a>
            <a
              href="#appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
            >
              Book Slot
            </a>
          </div>
        </div>
      )}
    </header>
  );
}