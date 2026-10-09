"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, ArrowLeft, Sparkles, CheckCircle2, Clock, 
  MapPin, ShieldCheck, MessageCircle, Calendar, Star, ChevronRight
} from "lucide-react";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function DoctorsPage() {
  const [team, setTeam] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Dr. Rajendra Singh Bhati - Permanent Official Profile
  const chiefDoctorProfile = {
    id: "chief-rajendra-bhati",
    name: "Dr. Rajendra Singh Bhati",
    degree: "BDS | Reg. No. A-2672",
    role: "Chief Dental Surgeon & Implantologist",
    experience: "12+ Years of Clinical Mastery",
    specialty: "Full Mouth Rehabilitation, Painless Dental Implants, Cosmetic Smile Makeovers, and Laser Endodontics.",
    schedule: "Mon – Sat (09:00 AM – 06:30 PM)",
    image: "/images/doctor-main.jpeg",
    stats: [
      { label: "Clinical Experience", value: "12+ Yrs" },
      { label: "Successful Treatments", value: "15,000+" },
      { label: "Advanced Procedures", value: "Painless" }
    ],
    features: [
      "Class-B Autoclave Sterilization",
      "Digital RVG Instant Radiography",
      "Computerized Local Anesthesia",
      "Rotary Endodontic System"
    ]
  };

  const defaultVisitingDoctors = [
    {
      id: "guest-delhi-1",
      name: "Senior Visiting Specialist (AIIMS / Delhi NCR)",
      degree: "MDS (Orthodontics & Dentofacial Orthopedics)",
      role: "Visiting Consultant Orthodontist",
      experience: "Ex-AIIMS Delhi Academician",
      specialty: "Invisible Aligners (Invisalign), Ceramic Braces, Surgical Orthodontics, and Complex Jaw Realignment.",
      schedule: "Every Sunday Exclusive OPD (10:00 AM – 04:00 PM)",
      type: "Guest",
      image: "/images/doctor-2.jpeg",
      isDelhiGuest: true
    },
    {
      id: "assoc-1",
      name: "Dr. Ashish Bhutra",
      degree: "BDS",
      role: "Associate Dental Surgeon",
      experience: "6+ Years Experience",
      specialty: "Single-Sitting Rotary Root Canal Treatments (RCT), Composite Veneers, and Teeth Whitening.",
      schedule: "Monday – Saturday (Regular OPD)",
      type: "Associate",
      image: "/images/doctor-2.jpeg",
      isDelhiGuest: false
    },
    {
      id: "assoc-2",
      name: "Dr. Shashi Jangid",
      degree: "BDS",
      role: "Associate Dental Surgeon",
      experience: "5+ Years Experience",
      specialty: "Pediatric Dentistry, Crown & Bridge Prosthetics, and Preventive Oral Wellness.",
      schedule: "Monday – Saturday (Regular OPD)",
      type: "Associate",
      image: "/images/doctor-3.jpeg",
      isDelhiGuest: false
    }
  ];

  useEffect(() => {
    const docRef = doc(db, "settings", "clinic_config");
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists() && snap.data().team && snap.data().team.length > 0) {
          const cloudTeam = snap.data().team;
          const filtered = cloudTeam.filter(
            (d) => !d.name.toLowerCase().includes("rajendra") && d.type !== "Chief"
          );
          setTeam(filtered.length > 0 ? filtered : defaultVisitingDoctors);
        } else {
          setTeam(defaultVisitingDoctors);
        }
      },
      () => {
        setTeam(defaultVisitingDoctors);
      }
    );

    return () => unsubscribe();
  }, []);

  const displayedTeam = team.filter((d) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "guest") return d.type === "Guest" || d.isDelhiGuest;
    if (selectedFilter === "associate") return d.type !== "Guest" && !d.isDelhiGuest;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased overflow-x-hidden">
      
      {/* 1. TOP MINIMAL NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 px-3.5 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4 text-teal-600" />
            <span>Back to Home</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Balaji Dental Clinic • Medical Directory
          </div>

          <a 
            href="tel:+919782687123" 
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            <span>Emergency Call</span>
          </a>
        </div>
      </header>

      {/* 2. HERO HEADER */}
      <section className="bg-white border-b border-slate-200/60 py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-teal-800 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Trusted Dental Care in Pokaran
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Our Medical Doctors & Specialists
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Providing evidence-based oral healthcare led by Chief Dental Surgeon Dr. Rajendra Singh Bhati at Balaji Dental Clinic, supported by visiting consultants from Delhi NCR.
          </p>
        </div>
      </section>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-14">

        {/* --- CHIEF DOCTOR SHOWCASE CARD --- */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 bg-teal-600 rounded-full"></span>
            <h2 className="text-xs font-black uppercase tracking-wider text-teal-900">
              Chief Dental Surgeon & Founder
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              
              {/* Photo Box */}
              <div className="w-full sm:w-64 shrink-0 flex flex-col items-center">
                <div className="w-48 sm:w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
                  <img
                    src={chiefDoctorProfile.image}
                    alt={chiefDoctorProfile.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = "/images/doctor-1.jpeg";
                    }}
                  />
                  <span className="absolute bottom-2.5 left-2.5 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    Lead Surgeon
                  </span>
                </div>

                <div className="mt-3 w-48 sm:w-full grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="block text-xs font-black text-slate-900">12+ Years</span>
                    <span className="block text-[10px] text-slate-500">Experience</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="block text-xs font-black text-slate-900">A-2672</span>
                    <span className="block text-[10px] text-slate-500">Reg. Council</span>
                  </div>
                </div>
              </div>

              {/* Information Side */}
              <div className="flex-1 w-full space-y-5 text-left">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {chiefDoctorProfile.name}
                    </h3>
                    <span className="bg-teal-50 text-teal-800 border border-teal-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      BDS
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-teal-700 mt-1">
                    {chiefDoctorProfile.role}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Clinical Expertise
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
                    {chiefDoctorProfile.specialty}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {chiefDoctorProfile.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Timings & WhatsApp CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{chiefDoctorProfile.schedule}</span>
                  </div>

                  <a
                    href="https://wa.me/919782687123?text=Hello%20Dr.%20Bhati,%20I%20would%20like%20to%20consult%20for%20dental%20treatment%20at%20Balaji%20Dental%20Clinic."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Book Direct Consultation</span>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* --- VISITING SPECIALISTS & ASSOCIATE TEAM --- */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Medical Directory & Visiting Surgeons
              </h3>
              <p className="text-xs text-slate-500">
                Specialized orthodontic and restorative dental consultants.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter("guest")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedFilter === "guest" ? "bg-amber-500 text-white shadow-sm" : "text-slate-600"
                }`}
              >
                Sunday Delhi OPD
              </button>
              <button
                onClick={() => setSelectedFilter("associate")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedFilter === "associate" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                Associate Doctors
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedTeam.map((doc, idx) => {
              const isGuest = doc.type === "Guest" || doc.isDelhiGuest;
              return (
                <div
                  key={doc.id || idx}
                  className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    isGuest 
                      ? "border-amber-300 ring-1 ring-amber-300/40 bg-amber-50/20" 
                      : "border-slate-200/80 hover:border-teal-200"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Mini Avatar + Names */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border shrink-0">
                        <img
                          src={doc.image || `/images/doctor-${(idx % 3) + 1}.jpeg`}
                          alt={doc.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src = `/images/doctor-${(idx % 3) + 1}.jpeg`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {doc.name}
                          </h4>
                          {isGuest && (
                            <span className="bg-amber-100 text-amber-900 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                              Sunday Delhi Specialist
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-teal-700 mt-0.5">
                          {doc.degree} • {doc.role}
                        </p>
                      </div>
                    </div>

                    {/* Expertise Description */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Focus Area
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {doc.specialty || "Comprehensive conservative dentistry and preventive clinical procedures."}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Schedule & Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 truncate">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doc.schedule || "Regular Clinical Hours"}</span>
                    </span>

                    <a
                      href={`https://wa.me/919782687123?text=Hello,%20I%20would%20like%20to%20consult%20with%20${encodeURIComponent(doc.name)}%20at%20Balaji%20Dental%20Clinic.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0 ${
                        isGuest 
                          ? "bg-amber-500 hover:bg-amber-600 text-white" 
                          : "bg-slate-100 hover:bg-teal-600 text-slate-700 hover:text-white"
                      }`}
                    >
                      Book Slot →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. CLINICAL SAFETY BANNER */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
              Clinic Sterilization & Diagnostics
            </span>
            <h4 className="text-lg sm:text-xl font-bold">
              Unsure which dental specialist you need?
            </h4>
            <p className="text-xs text-slate-400 max-w-lg">
              Contact Balaji Dental Clinic with your symptoms for immediate guidance and prioritized appointments with Dr. Bhati.
            </p>
          </div>

          <a
            href="tel:+919782687123"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shrink-0 transition"
          >
            <Phone className="w-4 h-4" />
            <span>Call +91 9782687123</span>
          </a>
        </section>

      </main>
    </div>
  );
}