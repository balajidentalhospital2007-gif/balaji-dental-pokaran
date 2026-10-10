"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MainSections from "../components/MainSections";
import FooterAndTeam from "../components/FooterAndTeam";
import { clinicContent } from "../clinicData";
import ClinicSlider from '../components/ClinicSlider';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';


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
    // 1. Firebase Cloud Firestore se Live Sync
    const docRef = doc(db, 'settings', 'clinic_config');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        setConfig((prev) => ({ ...prev, ...cloudData }));
        localStorage.setItem('balaji_clinic_config', JSON.stringify(cloudData));
      }
    }, (error) => {
      console.warn('Realtime listener error, fallback to local:', error);
    });

    // 2. Local backup
    const local = localStorage.getItem('balaji_clinic_config');
    if (local) {
      try {
        setConfig((prev) => ({ ...prev, ...JSON.parse(local) }));
      } catch (e) {
        console.error(e);
      }
    }

    return () => unsubscribe();
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
        gallery={config.gallery && config.gallery.length > 0 ? config.gallery : clinicContent.gallery}
        dynamicGallery={config.gallery}
        dynamicBlogs={config.blogs}
      />
       
      <ClinicSlider 
        lang={lang} 
        gallery={config.gallery && config.gallery.length > 0 ? config.gallery : clinicContent.gallery}
        dynamicGallery={config.gallery} 
      />
     
      <FooterAndTeam 
        lang={lang} 
        content={clinicContent} 
        team={config.team && config.team.length > 0 ? config.team : clinicContent.team}
        dynamicTeam={config.team}
        dynamicLocation={config.location}
      />
    </div>
  );
}