"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MainSections from "../components/MainSections";
import FooterAndTeam from "../components/FooterAndTeam";
import { clinicContent } from "../clinicData";

export default function HomePage() {
  const [lang, setLang] = useState("en");

  const defaultState = {
    schedule: { openHour: 9, openMinute: 0, closeHour: 18, closeMinute: 30, isHoliday: false },
    broadcast: {
      isActive: true,
      textEn: "Free Dental Consultation & Checkup Camp Every Sunday! Call now to book.",
      textHi: "प्रत्येक रविवार निःशुल्क दंत परामर्श एवं जांच शिविर! तुरंत स्लॉट बुक करें।"
    },
    location: {
      addressEn: "Plot No. 34, Near Govt. Hospital, Jodhpur Road, Pokaran, Rajasthan - 345021",
      addressHi: "प्लॉट नं. 34, राजकीय अस्पताल के पास, जोधपुर रोड, पोकरण, राजस्थान - 345021",
      mapQuery: "Pokaran,Government Hospital,Rajasthan,India"
    },
    gallery: [],
    blogs: [],
    team: []
  };

  const [config, setConfig] = useState(defaultState);

  useEffect(() => {
    const syncData = () => {
      const saved = localStorage.getItem("balaji_clinic_config");
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse config", e);
        }
      }
    };

    syncData();
    window.addEventListener("storage", syncData);
    window.addEventListener("balaji_data_changed", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("balaji_data_changed", syncData);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 w-full overflow-x-hidden">
      <Header 
        lang={lang} 
        setLang={setLang} 
        content={clinicContent} 
        schedule={config.schedule} 
        broadcast={config.broadcast} 
      />
      <MainSections 
        lang={lang} 
        content={clinicContent} 
        dynamicGallery={config.gallery}
        dynamicBlogs={config.blogs}
      />
      <FooterAndTeam 
        lang={lang} 
        content={clinicContent} 
        dynamicTeam={config.team}
        dynamicLocation={config.location}
      />
    </div>
  );
}