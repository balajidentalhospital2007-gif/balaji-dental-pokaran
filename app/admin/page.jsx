"use client";

import React, { useState, useEffect } from "react";
import { 
  Lock, Clock, Megaphone, MapPin, Image as ImageIcon, BookOpen, Users, 
  Save, Trash2, Plus, Power, CheckCircle, ArrowLeft, Eye, EyeOff, AlertOctagon, Calendar, Check
} from "lucide-react";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState("timing");
  const [saveAlert, setSaveAlert] = useState(false);

  const defaultData = {
    schedule: { 
      openHour12: 9, 
      openMinute: "00", 
      openPeriod: "AM",
      closeHour12: 6, 
      closeMinute: "30", 
      closePeriod: "PM",
      isEmergencyClosed: false,
      emergencyReason: "क्लिनिक आज आपातकालीन कारणों से बंद है।",
      weeklyOffDays: [0],
      annualHolidays: [
        { name: "दिवाली अवकाश", date: "2026-11-08" },
        { name: "होली अवकाश", date: "2027-03-24" }
      ]
    },
    broadcast: { 
      isActive: true, 
      textEn: "Free Dental Consultation & Checkup Camp Every Sunday! Call to book.", 
      textHi: "प्रत्येक रविवार निःशुल्क दंत परामर्श एवं जांच शिविर! तुरंत स्लॉट बुक करें।" 
    },
    location: {
      addressEn: "Plot No. 34, Near Govt. Hospital, Jodhpur Road, Pokaran, Rajasthan - 345021",
      addressHi: "प्लॉट नं. 34, राजकीय अस्पताल के पास, जोधपुर रोड, पोकरण, राजस्थान - 345021",
      mapQuery: "Pokaran,Government Hospital,Rajasthan,India"
    },
    gallery: [
      { id: 1, title: "Modern Dental Operatory", category: "clinic", label: "एडवांस्ड डेंटल चेयर" },
      { id: 2, title: "Class-B Autoclave Sterilization", category: "sterilization", label: "सख्त स्वच्छता व नसबंदी" },
      { id: 3, title: "Digital RVG Diagnostic Suite", category: "equipment", label: "डिजिटल एक्स-रे यूनिट" }
    ],
    blogs: [
      {
        id: 1,
        titleEn: "Why Dental Implants Are the Gold Standard",
        titleHi: "डेंटल इम्प्लांट्स क्यों हैं सबसे सुरक्षित?",
        descEn: "Learn how permanent implants prevent jawbone resorption.",
        descHi: "जानिए कैसे डेंटल इम्प्लांट्स जबड़े की हड्डी को सुरक्षित रखते हैं।",
        readTime: "3 min read"
      }
    ],
    team: [
      { name: "Dr. Shashi Jangid", degree: "BDS", role: "Associate Dental Surgeon" },
      { name: "Dr. Ashish Bhutra", degree: "BDS", role: "Associate Dental Surgeon" },
      { name: "Dr. Dushyant Soni", degree: "MDS", role: "Consultant Prosthodontist" }
    ]
  };

  const [clinicData, setClinicData] = useState(defaultData);
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
  const [newGalleryItem, setNewGalleryItem] = useState({ title: "", category: "clinic", label: "" });
  const [newBlog, setNewBlog] = useState({ titleEn: "", titleHi: "", descEn: "", descHi: "", readTime: "3 min read" });
  const [newDoc, setNewDoc] = useState({ name: "", degree: "BDS", role: "Associate Dental Surgeon" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("balaji_clinic_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.schedule?.openHour12) {
          parsed.schedule = { ...defaultData.schedule, ...parsed.schedule };
        }
        setClinicData(parsed);
      }
    } catch (e) {
      console.error("Config load error", e);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === "balaji2026") {
      setAuth(true);
    } else {
      alert("गलत पासकोड! दर्ज करें: balaji2026");
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem("balaji_clinic_config", JSON.stringify(clinicData));
      window.dispatchEvent(new Event("balaji_data_changed"));
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 2500);
    } catch (err) {
      alert("सेव करने में समस्या आई!");
    }
  };

  const toggleDayOff = (dayIndex) => {
    const current = clinicData.schedule.weeklyOffDays || [];
    const updated = current.includes(dayIndex)
      ? current.filter(d => d !== dayIndex)
      : [...current, dayIndex];
    setClinicData({
      ...clinicData,
      schedule: { ...clinicData.schedule, weeklyOffDays: updated }
    });
  };

  const daysOfWeek = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
  const hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutesList = ["00", "15", "30", "45"];

  if (!auth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-3 sm:p-4">
        <div className="max-w-xs sm:max-w-sm w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              Balaji Dental Clinic, Pokaran
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold">Admin Panel Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Passcode</label>
              <input
                type="password"
                placeholder="balaji2026"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
            >
              Login to Dashboard
            </button>
          </form>

          <div className="text-center pt-1">
            <a href="/" className="text-[11px] text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3 h-3" /> Back to Clinic Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16 w-full overflow-x-hidden">
      
      {/* 1. कॉम्पैक्ट मोबाइल-फ़्रेंडली टॉपबार */}
      <header className="bg-slate-900 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 min-w-0">
            <a href="/" className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white shrink-0" title="Back to Website">
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
            <div className="min-w-0">
              <h1 className="font-black text-xs sm:text-base text-white truncate leading-tight">
                Balaji Dental, Pokaran
              </h1>
              <p className="text-[9px] sm:text-[11px] text-teal-400 font-bold truncate">Master Admin Control</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[11px] sm:text-xs shadow transition active:scale-95"
            >
              <Save className="w-3.5 h-3.5 shrink-0" />
              <span>Save</span>
            </button>
            <button 
              onClick={() => setAuth(false)} 
              className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-400 rounded-lg shrink-0"
              title="Logout"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* सेव कन्फर्मेशन अलर्ट */}
      {saveAlert && (
        <div className="bg-emerald-600 text-white text-[11px] sm:text-xs py-2 px-3 text-center font-bold flex items-center justify-center gap-1.5 sticky top-12 z-30 shadow">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          <span>सफलतापूर्वक सेव हो गया! वेबसाइट लाइव अपडेट हो चुकी है।</span>
        </div>
      )}

      {/* 2. हॉरिजॉन्टल स्क्रॉल टैब्स (आईफ़ोन, एंड्रॉइड और डेस्कटॉप पर 100% फिट) */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          {[
            { id: "timing", label: "Timing & Chhutti", icon: Clock },
            { id: "broadcast", label: "Notice Bar", icon: Megaphone },
            { id: "location", label: "Location", icon: MapPin },
            { id: "gallery", label: "Gallery", icon: ImageIcon },
            { id: "blogs", label: "Blogs", icon: BookOpen },
            { id: "team", label: "Doctors", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. मुख्य एडमिन फॉर्म्स */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 space-y-4">

        {/* टैब 1: TIMINGS & HOLIDAYS */}
        {activeTab === "timing" && (
          <div className="space-y-4">
            
            {/* आपातकालीन अवकाश टॉगल */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              clinicData.schedule.isEmergencyClosed 
                ? "bg-rose-50 border-rose-300 ring-2 ring-rose-200" 
                : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <AlertOctagon className={`w-4 h-4 shrink-0 ${clinicData.schedule.isEmergencyClosed ? "text-rose-600" : "text-slate-400"}`} />
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      Emergency Chhutti / Today Closed
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    आपातकालीन स्थिति में क्लिनिक को आज बंद दिखाने के लिए इसे ऑन करें।
                  </p>
                </div>

                <button
                  onClick={() => setClinicData({
                    ...clinicData,
                    schedule: { ...clinicData.schedule, isEmergencyClosed: !clinicData.schedule.isEmergencyClosed }
                  })}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition shrink-0 ${
                    clinicData.schedule.isEmergencyClosed
                      ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                  }`}
                >
                  {clinicData.schedule.isEmergencyClosed ? "CHHUTTI ON (Click to Open)" : "MARK TODAY CLOSED"}
                </button>
              </div>

              {clinicData.schedule.isEmergencyClosed && (
                <div className="mt-3 pt-3 border-t border-rose-200">
                  <label className="block text-[10px] font-bold text-rose-900 mb-1">वेबसाइट पर दिखने वाला संदेश:</label>
                  <input
                    type="text"
                    value={clinicData.schedule.emergencyReason}
                    onChange={(e) => setClinicData({
                      ...clinicData,
                      schedule: { ...clinicData.schedule, emergencyReason: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border border-rose-300 rounded-xl text-xs bg-white text-rose-950 focus:outline-none"
                    placeholder="उदा. क्लिनिक आज आपातकालीन कारणों से बंद है।"
                  />
                </div>
              )}
            </div>

            {/* 12-Hour समय ड्रॉपडाउन */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Daily Timings (12-Hour Format)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* खुलने का समय */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="font-bold text-slate-800 block text-[11px]">सुबह खुलने का समय:</label>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={clinicData.schedule.openHour12}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        schedule: { ...clinicData.schedule, openHour12: parseInt(e.target.value) }
                      })}
                      className="px-2.5 py-1.5 border rounded-lg bg-white font-bold text-xs"
                    >
                      {hoursList.map(h => <option key={h} value={h}>{h < 10 ? `0${h}` : h}</option>)}
                    </select>

                    <span className="font-black text-slate-400">:</span>

                    <select
                      value={clinicData.schedule.openMinute}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        schedule: { ...clinicData.schedule, openMinute: e.target.value }
                      })}
                      className="px-2.5 py-1.5 border rounded-lg bg-white font-bold text-xs"
                    >
                      {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <select
                      value={clinicData.schedule.openPeriod}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        schedule: { ...clinicData.schedule, openPeriod: e.target.value }
                      })}
                      className="px-2.5 py-1.5 border rounded-lg bg-teal-50 border-teal-200 font-bold text-teal-800 text-xs"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* बंद होने का समय */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="font-bold text-slate-800 block text-[11px]">शाम बंद होने का समय:</label>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={clinicData.schedule.closeHour12}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        schedule: { ...clinicData.schedule, closeHour12: parseInt(e.target.value) }
                      })}
                      className="px-2.5 py-1.5 border rounded-lg bg-white font-bold text-xs"
                    >
                      {hoursList.map(h => <option key={h} value={h}>{h < 10 ? `0${h}` : h}</option>)}
                    </select>

                    <span className="font-black text-slate-400">:</span>

                    <select
                      value={clinicData.schedule.closeMinute}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        schedule: { ...clinicData.schedule, closeMinute: e.target.value }
                      })}
                      className="px-2.5 py-1.5 border rounded-lg bg-white font-bold text-xs"
                    >
                      {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <select
                      value={clinicData.schedule.closePeriod}
                      onChange={(e) => setClinicData({
                        ...clinicData,
                        schedule: { ...clinicData.schedule, closePeriod: e.target.value }
                      })}
                      className="px-2.5 py-1.5 border rounded-lg bg-teal-50 border-teal-200 font-bold text-teal-800 text-xs"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* साप्ताहिक अवकाश */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">साप्ताहिक अवकाश (Weekly Off)</h3>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((day, idx) => {
                  const isOff = (clinicData.schedule.weeklyOffDays || []).includes(idx);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDayOff(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        isOff
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {day} {isOff ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* वार्षिक अवकाश कैलेंडर */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">त्यौहार व अवकाश कैलेंडर</h3>
              <div className="space-y-1.5">
                {(clinicData.schedule.annualHolidays || []).map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{h.name}</p>
                      <p className="text-slate-500 text-[10px] font-mono">{h.date}</p>
                    </div>
                    <button
                      onClick={() => setClinicData({
                        ...clinicData,
                        schedule: {
                          ...clinicData.schedule,
                          annualHolidays: clinicData.schedule.annualHolidays.filter((_, i) => i !== idx)
                        }
                      })}
                      className="text-rose-600 font-bold p-1 shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="अवकाश का नाम (उदा. दिवाली)"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                  className="px-3 py-1.5 border rounded-lg text-xs bg-white flex-1"
                />
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  className="px-3 py-1.5 border rounded-lg text-xs bg-white"
                />
                <button
                  onClick={() => {
                    if (!newHoliday.name || !newHoliday.date) return alert("कृपया नाम और तारीख भरें!");
                    setClinicData({
                      ...clinicData,
                      schedule: {
                        ...clinicData.schedule,
                        annualHolidays: [...(clinicData.schedule.annualHolidays || []), newHoliday]
                      }
                    });
                    setNewHoliday({ name: "", date: "" });
                  }}
                  className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs shrink-0"
                >
                  जोड़ें
                </button>
              </div>
            </div>

          </div>
        )}

        {/* टैब 2: BROADCAST NOTICE */}
        {activeTab === "broadcast" && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Header Broadcast Bar</h3>
              <button
                onClick={() => setClinicData({
                  ...clinicData,
                  broadcast: { ...clinicData.broadcast, isActive: !clinicData.broadcast.isActive }
                })}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                  clinicData.broadcast.isActive ? "bg-emerald-600 text-white" : "bg-rose-100 text-rose-800"
                }`}
              >
                {clinicData.broadcast.isActive ? "Active (दिख रहा है)" : "Hidden (छुपा हुआ)"}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-[11px]">Notice in English</label>
                <input
                  type="text"
                  value={clinicData.broadcast.textEn}
                  onChange={(e) => setClinicData({
                    ...clinicData,
                    broadcast: { ...clinicData.broadcast, textEn: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-[11px]">सूचना हिंदी में</label>
                <input
                  type="text"
                  value={clinicData.broadcast.textHi}
                  onChange={(e) => setClinicData({
                    ...clinicData,
                    broadcast: { ...clinicData.broadcast, textHi: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* टैब 3: LOCATION */}
        {activeTab === "location" && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 border-b pb-2">क्लिनिक पता एवं लोकेशन</h3>
            <div>
              <label className="font-bold block mb-1 text-[11px]">Address (English)</label>
              <input
                type="text"
                value={clinicData.location.addressEn}
                onChange={(e) => setClinicData({
                  ...clinicData,
                  location: { ...clinicData.location, addressEn: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-[11px]">पता (हिंदी)</label>
              <input
                type="text"
                value={clinicData.location.addressHi}
                onChange={(e) => setClinicData({
                  ...clinicData,
                  location: { ...clinicData.location, addressHi: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>
        )}

        {/* टैब 4: GALLERY */}
        {activeTab === "gallery" && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 border-b pb-2">क्लिनिक गैलरी</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {clinicData.gallery.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl relative text-xs">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold uppercase">{item.category}</span>
                  <p className="font-bold text-slate-900 mt-1 truncate">{item.title}</p>
                  <p className="text-slate-500 text-[10px] truncate">{item.label}</p>
                  <button
                    onClick={() => setClinicData({
                      ...clinicData,
                      gallery: clinicData.gallery.filter((_, i) => i !== idx)
                    })}
                    className="absolute top-2 right-2 text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2 text-xs">
              <p className="font-bold text-teal-900 text-[11px]">नया फोटो कार्ड जोड़ें</p>
              <input
                type="text"
                placeholder="Title (English)"
                value={newGalleryItem.title}
                onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="विवरण (हिंदी)"
                value={newGalleryItem.label}
                onChange={(e) => setNewGalleryItem({ ...newGalleryItem, label: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg bg-white"
              />
              <button
                onClick={() => {
                  if (!newGalleryItem.title) return;
                  setClinicData({ ...clinicData, gallery: [...clinicData.gallery, newGalleryItem] });
                  setNewGalleryItem({ title: "", category: "clinic", label: "" });
                }}
                className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs"
              >
                कार्ड जोड़ें
              </button>
            </div>
          </div>
        )}

        {/* टैब 5: BLOGS */}
        {activeTab === "blogs" && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 border-b pb-2">दंत स्वास्थ्य ब्लॉग</h3>
            <div className="space-y-2">
              {clinicData.blogs.map((b, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate break-all">{b.titleEn}</p>
                    <p className="text-slate-500 text-[10px] truncate break-all">{b.descEn}</p>
                  </div>
                  <button
                    onClick={() => setClinicData({
                      ...clinicData,
                      blogs: clinicData.blogs.filter((_, i) => i !== idx)
                    })}
                    className="text-rose-600 p-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2 text-xs">
              <p className="font-bold text-teal-900 text-[11px]">नया ब्लॉग पोस्ट जोड़ें</p>
              <input
                type="text"
                placeholder="Title (English)"
                value={newBlog.titleEn}
                onChange={(e) => setNewBlog({ ...newBlog, titleEn: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="शीर्षक (हिंदी)"
                value={newBlog.titleHi}
                onChange={(e) => setNewBlog({ ...newBlog, titleHi: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg bg-white"
              />
              <button
                onClick={() => {
                  if (!newBlog.titleEn) return;
                  setClinicData({ ...clinicData, blogs: [...clinicData.blogs, newBlog] });
                  setNewBlog({ titleEn: "", titleHi: "", descEn: "", descHi: "", readTime: "3 min read" });
                }}
                className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs"
              >
                ब्लॉग जोड़ें
              </button>
            </div>
          </div>
        )}

        {/* टैब 6: DOCTORS TEAM */}
        {activeTab === "team" && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 border-b pb-2">डॉक्टर्स टीम</h3>
            <div className="space-y-2">
              {clinicData.team.map((d, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{d.name} ({d.degree})</p>
                    <p className="text-teal-600 text-[10px] truncate">{d.role}</p>
                  </div>
                  <button
                    onClick={() => setClinicData({
                      ...clinicData,
                      team: clinicData.team.filter((_, i) => i !== idx)
                    })}
                    className="text-rose-600 p-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2 text-xs">
              <p className="font-bold text-teal-900 text-[11px]">नया डॉक्टर जोड़ें</p>
              <input
                type="text"
                placeholder="Doctor Name"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg bg-white"
              />
              <button
                onClick={() => {
                  if (!newDoc.name) return;
                  setClinicData({ ...clinicData, team: [...clinicData.team, newDoc] });
                  setNewDoc({ name: "", degree: "BDS", role: "Associate Dental Surgeon" });
                }}
                className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs"
              >
                डॉक्टर जोड़ें
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}