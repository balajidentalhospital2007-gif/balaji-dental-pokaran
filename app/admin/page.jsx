'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { compressImage } from '../../lib/compressImage';

// Default Hardened Administrator Password
const DEFAULT_ADMIN_PASSWORD = 'Balaji@Pokaran#2026';

// Fallback initial data structure matching the main clinic system
const initialClinicConfig = {
  schedule: {
    daysEn: 'Monday - Saturday',
    daysHi: 'सोमवार - शनिवार',
    morningSlot: '09:00 AM - 01:30 PM',
    eveningSlot: '04:30 PM - 08:30 PM',
    sundaySlotEn: 'Sunday: Closed (Emergency on call)',
    sundaySlotHi: 'रविवार: अवकाश (आपातकालीन कॉल पर)',
    isOpenToday: true,
  },
  broadcast: {
    enabled: false,
    textEn: 'Notice: Clinic will remain closed this Sunday for scheduled sterilization.',
    textHi: 'सूचना: आगामी रविवार को विशेष स्वच्छता एवं स्टरलाइज़ेशन के कारण क्लिनिक बंद रहेगा।',
  },
  location: {
    addressEn: 'Near Government Hospital, Jaisalmer Road, Pokaran, Rajasthan 345021',
    addressHi: 'राजकीय अस्पताल के पास, जैसलमेर रोड, पोकरण, राजस्थान 345021',
    mapQuery: 'Balaji Dental Clinic Pokaran',
    phone: '+91 94149 84524',
    whatsapp: '919414984524',
  },
  team: [
    { id: 1, name: 'Dr. Shashi Jangid', degree: 'BDS', role: 'Associate Dental Surgeon', type: 'Associate', specialty: 'Pediatric Dental Care, Crown & Bridge', schedule: 'Daily OPD', image: '/images/doctor-1.jpeg' },
    { id: 2, name: 'Dr. Ashish Bhutra', degree: 'BDS', role: 'Associate Dental Surgeon', type: 'Associate', specialty: 'Single Sitting RCT, Teeth Whitening', schedule: 'Daily OPD', image: '/images/doctor-2.jpeg' },
    { id: 3, name: 'Dr. Jaydutt Paliwal', degree: 'BDS', role: 'Associate Dental Surgeon', type: 'Associate', specialty: 'General Consultation, Extraction', schedule: 'Daily OPD', image: '/images/doctor-3.jpeg' },
  ],
  gallery: [
    { id: 1, src: '/images/h1.jpeg', titleEn: 'Reception & Patient Lounge', titleHi: 'रिसेप्शन एवं वेटिंग एरिया' },
    { id: 2, src: '/images/h2.jpeg', titleEn: 'Modern Dental Operatory', titleHi: 'आधुनिक डेंटल चेयर एवं यूनिट' },
    { id: 3, src: '/images/a1.jpeg', titleEn: 'Advanced Sterilization Center', titleHi: 'स्टरलाइजेशन एवं स्वच्छता कक्ष' },
    { id: 4, src: '/images/a2.jpeg', titleEn: 'Digital RVG Diagnostic Unit', titleHi: 'डिजिटल डेंटल एक्सरे' },
  ],
  certificates: [],
  awardsMedia: [
    { id: 1, type: 'award', src: '/images/award-1.jpeg', titleEn: 'Excellence in Clinical Dentistry Award', titleHi: 'उत्कृष्ट दंत चिकित्सा सम्मान', publisher: 'State Dental Association', year: '2025' },
    { id: 2, type: 'media', src: '/images/media-1.jpeg', titleEn: 'Dainik Bhaskar Feature on Painless Dentistry', titleHi: 'दैनिक भास्कर: दर्द-रहित डेंटल तकनीक पर विशेष रिपोर्ट', publisher: 'Dainik Bhaskar', year: '2025' },
    { id: 3, type: 'media', src: '/images/media-2.jpeg', titleEn: 'Rajasthan Patrika Health Spotlight', titleHi: 'राजस्थान पत्रिका: मुख स्वास्थ्य एवं आधुनिक इंप्लांट', publisher: 'Rajasthan Patrika', year: '2024' },
    { id: 4, type: 'award', src: '/images/award-2.jpeg', titleEn: 'Community Healthcare Leadership Honor', titleHi: 'सामुदायिक स्वास्थ्य सेवा सम्मान', publisher: 'Regional Health Summit', year: '2024' }
  ],
  dentalAdvisory: {
    noticeEn: 'This informational portal does not constitute a doctor-patient relationship, medical diagnosis, or pharmacological prescription under the NMC Act. Self-medication or home treatments without clinical oral examination and RVG radiography are strictly hazardous. Always consult Dr. Rajendra Singh Bhati in person before taking any decision.',
    noticeHi: 'यह जानकारी केवल सामान्य जागरूकता हेतु है और इसे मेडिकल डायग्नोसिस या दवा का पर्चा (Prescription) न माना जाए। क्लिनिकल जांच व एक्स-रे के बिना कोई भी दवा या घरेलू उपचार अपनाना पूर्णतः वर्जित है। किसी भी स्व-उपचार (Self-Treatment) के लिए मरीज स्वयं उत्तरदायी होगा।',
    noticeHn: 'Yeh content sirf jankari ke liye hai, prescription nahi hai. Bina clinic par doctor ko dikhaye koi bhi goli ya gharelu tarika na aazmayein. Kuch bhi karne se pehle Dr. Rajendra Singh Bhati se personalized checkup karwayein.',
  },
  dentalFaqs: []
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('operations');

  // Main Configuration State
  const [config, setConfig] = useState(initialClinicConfig);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Password Management State
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  // Doctor Form State
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    degree: 'BDS',
    role: 'Associate Dental Surgeon',
    type: 'Associate',
    specialty: '',
    schedule: 'Daily OPD (9:00 AM - 6:30 PM)',
    image: '',
  });

  // Clinic Tour Photo Form State
  const [newTourImage, setNewTourImage] = useState({
    titleEn: '',
    titleHi: '',
    src: '',
  });

  // Certificate Form State
  const [newCert, setNewCert] = useState({
    titleEn: '',
    titleHi: '',
    issuerEn: '',
    issuerHi: '',
    categoryEn: 'General',
    categoryHi: 'सामान्य',
    src: '',
  });

  // Awards & Media Form State
  const [newAwardMedia, setNewAwardMedia] = useState({
    type: 'award',
    titleEn: '',
    titleHi: '',
    publisher: '',
    year: '2026',
    src: '',
  });

  // Dental FAQ / Guideline Form State
  const [newFaq, setNewFaq] = useState({
    cat: 'emergency',
    qEn: '',
    qHi: '',
    qHn: '',
    aEn: '',
    aHi: '',
    aHn: '',
  });

  // Load configuration and session on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionAuth = sessionStorage.getItem('balaji_admin_auth');
      if (sessionAuth === 'true') {
        setIsAuthenticated(true);
      }
    }

    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'clinic_config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          setConfig((prev) => ({
            ...prev,
            ...cloudData,
            awardsMedia: cloudData.awardsMedia || prev.awardsMedia || initialClinicConfig.awardsMedia,
            dentalAdvisory: cloudData.dentalAdvisory || prev.dentalAdvisory || initialClinicConfig.dentalAdvisory,
            dentalFaqs: cloudData.dentalFaqs || prev.dentalFaqs || initialClinicConfig.dentalFaqs,
          }));
          localStorage.setItem('balaji_clinic_config', JSON.stringify(cloudData));
          return;
        }
      } catch (err) {
        console.warn('Firestore load failed, checking local backup:', err);
      }

      if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem('balaji_clinic_config');
        if (storedConfig) {
          try {
            const parsed = JSON.parse(storedConfig);
            setConfig((prev) => ({
              ...prev,
              ...parsed,
              awardsMedia: parsed.awardsMedia || prev.awardsMedia || initialClinicConfig.awardsMedia,
              dentalAdvisory: parsed.dentalAdvisory || prev.dentalAdvisory || initialClinicConfig.dentalAdvisory,
              dentalFaqs: parsed.dentalFaqs || prev.dentalFaqs || initialClinicConfig.dentalFaqs,
            }));
          } catch (err) {
            console.error('Failed to parse clinic config:', err);
          }
        }
      }
    };

    fetchConfig();
  }, []);

  // Secure Password Retrieval
  const getStoredPassword = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('balaji_admin_pwd') || DEFAULT_ADMIN_PASSWORD;
    }
    return DEFAULT_ADMIN_PASSWORD;
  };

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === getStoredPassword()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('balaji_admin_auth', 'true');
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid access password. Please try again.');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('balaji_admin_auth');
  };

  // Change Password Handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (pwdForm.oldPassword !== getStoredPassword()) {
      setPwdMsg({ text: 'Current password does not match.', type: 'error' });
      return;
    }
    if (pwdForm.newPassword.length < 8) {
      setPwdMsg({ text: 'New password must be at least 8 characters long.', type: 'error' });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ text: 'New password and confirm password do not match.', type: 'error' });
      return;
    }

    localStorage.setItem('balaji_admin_pwd', pwdForm.newPassword);
    setPwdMsg({ text: 'Password successfully updated!', type: 'success' });
    setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Save General Configuration to LocalStorage & Firestore
  const saveConfiguration = async (updatedConfig) => {
    const dataToSave = updatedConfig || config;
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      setConfig(dataToSave);
      localStorage.setItem('balaji_clinic_config', JSON.stringify(dataToSave));
      window.dispatchEvent(new Event('balaji_data_changed'));

      const docRef = doc(db, 'settings', 'clinic_config');
      await setDoc(docRef, dataToSave, { merge: true });
      setSaveSuccessMsg('✅ All changes saved to Cloud & live across devices!');
    } catch (error) {
      console.error('Firebase save error:', error);
      setSaveSuccessMsg('Saved locally, but Cloud sync error: ' + error.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccessMsg(''), 5000);
    }
  };

  // File Upload Helper
  const handleImageFileRead = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImage(file, 800, 0.7);
      callback(compressedBase64);
    } catch (err) {
      console.error("Image compression error:", err);
      alert("Photo process karne mein error aaya. Kripya dusri photo chunein.");
    }
  };

  // Doctor Management Handlers
  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDoctor.name.trim()) {
      alert('Please enter doctor name.');
      return;
    }
    const updatedTeam = [
      ...(config.team || []),
      {
        id: Date.now(),
        ...newDoctor,
        image: newDoctor.image || '/images/doctor-1.jpeg',
      },
    ];
    const updatedConfig = { ...config, team: updatedTeam };
    saveConfiguration(updatedConfig);
    setNewDoctor({
      name: '',
      degree: 'BDS',
      role: 'Associate Dental Surgeon',
      type: 'Associate',
      specialty: '',
      schedule: 'Daily OPD (9:00 AM - 6:30 PM)',
      image: '',
    });
  };

  const handleRemoveDoctor = (id) => {
    if (confirm('Are you sure you want to remove this doctor from the directory?')) {
      const updatedTeam = (config.team || []).filter((doc) => doc.id !== id);
      const updatedConfig = { ...config, team: updatedTeam };
      saveConfiguration(updatedConfig);
    }
  };

  // Clinic Tour Photo Handlers
  const handleAddTourImage = (e) => {
    e.preventDefault();
    if (!newTourImage.src) {
      alert('Please upload or select an image first.');
      return;
    }
    const updatedGallery = [
      ...(config.gallery || []),
      {
        id: Date.now(),
        src: newTourImage.src,
        titleEn: newTourImage.titleEn || 'Clinic Facility',
        titleHi: newTourImage.titleHi || 'क्लिनिक सुविधा',
      },
    ];
    const updatedConfig = { ...config, gallery: updatedGallery };
    saveConfiguration(updatedConfig);
    setNewTourImage({ titleEn: '', titleHi: '', src: '' });
  };

  const handleRemoveTourImage = (id) => {
    if (confirm('Are you sure you want to delete this photo from the clinic tour?')) {
      const updatedGallery = (config.gallery || []).filter((img) => img.id !== id);
      const updatedConfig = { ...config, gallery: updatedGallery };
      saveConfiguration(updatedConfig);
    }
  };

  // Certificate Management Handlers
  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!newCert.titleEn.trim() || !newCert.src) {
      alert('Please provide certificate title and upload scanned copy.');
      return;
    }
    const updatedCertificates = [
      ...(config.certificates || []),
      {
        id: Date.now(),
        ...newCert,
      },
    ];
    const updatedConfig = { ...config, certificates: updatedCertificates };
    saveConfiguration(updatedConfig);
    setNewCert({ titleEn: '', titleHi: '', issuerEn: '', issuerHi: '', categoryEn: 'General', categoryHi: 'सामान्य', src: '' });
  };

  const handleRemoveCertificate = (id) => {
    if (confirm('Delete this certificate?')) {
      const updatedCertificates = (config.certificates || []).filter((c) => c.id !== id);
      const updatedConfig = { ...config, certificates: updatedCertificates };
      saveConfiguration(updatedConfig);
    }
  };

  // Awards & Media Handlers
  const handleAddAwardMedia = (e) => {
    e.preventDefault();
    if (!newAwardMedia.src) {
      alert('Kripya award ya news cutting ki photo upload karein.');
      return;
    }
    if (!newAwardMedia.titleEn.trim() && !newAwardMedia.titleHi.trim()) {
      alert('Kripya Award ya News ka title enter karein.');
      return;
    }

    const newItem = {
      id: Date.now(),
      type: newAwardMedia.type,
      titleEn: newAwardMedia.titleEn.trim() || newAwardMedia.titleHi.trim(),
      titleHi: newAwardMedia.titleHi.trim() || newAwardMedia.titleEn.trim(),
      publisher: newAwardMedia.publisher.trim() || 'Balaji Dental Clinic',
      year: newAwardMedia.year.trim() || '2026',
      src: newAwardMedia.src,
    };

    const updatedAwardsMedia = [newItem, ...(config.awardsMedia || [])];
    const updatedConfig = { ...config, awardsMedia: updatedAwardsMedia };
    saveConfiguration(updatedConfig);

    setNewAwardMedia({
      type: 'award',
      titleEn: '',
      titleHi: '',
      publisher: '',
      year: '2026',
      src: '',
    });
  };

  const handleRemoveAwardMedia = (id) => {
    if (confirm('Kya aap is Award/News photo ko slider se delete karna chahte hain?')) {
      const updatedAwardsMedia = (config.awardsMedia || []).filter((item) => item.id !== id);
      const updatedConfig = { ...config, awardsMedia: updatedAwardsMedia };
      saveConfiguration(updatedConfig);
    }
  };

  // Dental FAQ / Guideline Handlers
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaq.qEn.trim() && !newFaq.qHi.trim() && !newFaq.qHn.trim()) {
      alert('Kripya sawaal enter karein.');
      return;
    }
    if (!newFaq.aEn.trim() && !newFaq.aHi.trim() && !newFaq.aHn.trim()) {
      alert('Kripya jawaab enter karein.');
      return;
    }

    const createdFaq = {
      id: Date.now(),
      cat: newFaq.cat,
      qEn: newFaq.qEn.trim() || newFaq.qHi.trim() || newFaq.qHn.trim(),
      qHi: newFaq.qHi.trim() || newFaq.qEn.trim() || newFaq.qHn.trim(),
      qHn: newFaq.qHn.trim() || newFaq.qHi.trim() || newFaq.qEn.trim(),
      aEn: newFaq.aEn.trim() || newFaq.aHi.trim() || newFaq.aHn.trim(),
      aHi: newFaq.aHi.trim() || newFaq.aEn.trim() || newFaq.aHn.trim(),
      aHn: newFaq.aHn.trim() || newFaq.aHi.trim() || newFaq.aEn.trim(),
    };

    const updatedFaqs = [createdFaq, ...(config.dentalFaqs || [])];
    const updatedConfig = { ...config, dentalFaqs: updatedFaqs };
    saveConfiguration(updatedConfig);

    setNewFaq({
      cat: 'emergency',
      qEn: '',
      qHi: '',
      qHn: '',
      aEn: '',
      aHi: '',
      aHn: '',
    });
  };

  const handleRemoveFaq = (id) => {
    if (confirm('Kya aap is FAQ / Guide item ko delete karna chahte hain?')) {
      const updatedFaqs = (config.dentalFaqs || []).filter((item) => item.id !== id);
      const updatedConfig = { ...config, dentalFaqs: updatedFaqs };
      saveConfiguration(updatedConfig);
    }
  };

  // ================= VIEW: LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-50 text-teal-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto text-xl sm:text-2xl font-black border border-teal-100">
              🛡️
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Balaji Dental Admin</h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Authorized Administrator Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-[0.98]"
            >
              Sign In to Dashboard →
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <Link href="/" className="text-xs font-bold text-teal-700 hover:text-teal-900">
              ← Return to Clinic Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW: FULL DASHBOARD =================
  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 pb-20 overflow-x-hidden">
      {/* 1. Top Green Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm md:text-base font-semibold animate-bounce">
          <span>{saveSuccessMsg}</span>
          <button 
            onClick={() => setSaveSuccessMsg('')} 
            className="ml-3 text-emerald-200 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Floating Quick Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => saveConfiguration()}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-bold shadow-2xl text-white transition-all transform hover:scale-105 active:scale-95 ${
            isSaving 
              ? 'bg-slate-500 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-300/40'
          }`}
        >
          {isSaving ? (
            <>
              <span className="inline-block animate-spin">⏳</span>
              <span>Saving to Cloud...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save Changes Now</span>
            </>
          )}
        </button>
      </div>

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-black text-base sm:text-lg text-teal-800 tracking-tight truncate">
              Balaji Admin
            </span>
            <span className="text-[9px] sm:text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
              Active
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/dental-guide"
              target="_blank"
              className="text-[11px] sm:text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1"
            >
              <span>🦷</span>
              <span>View Guide Page</span>
            </Link>
            <Link
              href="/doctors"
              target="_blank"
              className="text-[11px] sm:text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200"
            >
              👨‍⚕️ View Doctors Page
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-[11px] sm:text-xs font-bold text-teal-700 hover:text-teal-900 hidden sm:inline"
            >
              🌐 View Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-bold border border-slate-200 hover:border-red-200 transition"
            >
              Logout ⎋
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6 w-full">
        {/* Mobile Horizontal Scrolling Tabs */}
        <div className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="bg-white rounded-xl sm:rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center gap-1.5 w-max min-w-full sm:w-full">
            {[
              { id: 'operations', label: '⏰ Operations & Notice' },
              { id: 'guide', label: '🩺 Dental Guide & Advisory' },
              { id: 'team', label: '👨‍⚕️ Doctors Directory' },
              { id: 'gallery', label: '🖼️ Tour Photos' },
              { id: 'awards', label: '🏆 Awards & Media' },
              { id: 'certificates', label: '📜 Certificates' },
              { id: 'security', label: '🔒 Security & Password' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TAB: DENTAL GUIDE & LEGAL ADVISORY ================= */}
        {activeTab === 'guide' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            {/* 1. Legal Warning & Notice Bar Editor */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Official Medical Disclaimer & Legal Protection Notice
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Yeh notice har patient ko guide page ke sabse upar dikhega taaki koi self-medication na kare.
                  </p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-1 rounded-full border border-amber-300">
                  Legal Immunity Clause
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Notice Text (Hindi) *
                  </label>
                  <textarea
                    rows={2}
                    value={config.dentalAdvisory?.noticeHi || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      dentalAdvisory: { ...config.dentalAdvisory, noticeHi: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Notice Text (English) *
                  </label>
                  <textarea
                    rows={2}
                    value={config.dentalAdvisory?.noticeEn || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      dentalAdvisory: { ...config.dentalAdvisory, noticeEn: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Notice Text (Hinglish)
                  </label>
                  <textarea
                    rows={2}
                    value={config.dentalAdvisory?.noticeHn || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      dentalAdvisory: { ...config.dentalAdvisory, noticeHn: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
              </div>

              <div className="text-right pt-2 border-t">
                <button
                  type="button"
                  onClick={() => saveConfiguration()}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                >
                  Save Advisory Notice
                </button>
              </div>
            </div>

            {/* 2. Add New Clinical FAQ / Guideline Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Add New Clinical Question / Patient Guideline
                </h2>
                <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Multilingual Ready
                </span>
              </div>

              <form onSubmit={handleAddFaq} className="space-y-3.5">
                <div className="w-full sm:w-1/2">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Category Topic *
                  </label>
                  <select
                    value={newFaq.cat}
                    onChange={(e) => setNewFaq({ ...newFaq, cat: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none bg-white font-semibold"
                  >
                    <option value="emergency">⚡ Emergency & Severe Pain (रात का दर्द / इमरजेंसी)</option>
                    <option value="rct">🦷 Root Canal & Caps (रूट कैनाल व कैप)</option>
                    <option value="gums">🩸 Gums, Bleeding & Pyorrhea (मसूड़े व पायरिया)</option>
                    <option value="medical">🩺 Diabetes, BP & Medical Safety (शुगर / बीपी सावधानी)</option>
                    <option value="implants">🔩 Fixed Dental Implants (फिक्स्ड नकली दांत)</option>
                    <option value="wisdom">⚠️ Wisdom Teeth (अकल दाढ़ व सर्जरी)</option>
                    <option value="kids">🧒 Braces & Alignment (तार व सीधे दांत)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Question (Hindi) *</label>
                    <input
                      type="text"
                      placeholder="उदा. क्या रूट कैनाल में दर्द होता है?"
                      value={newFaq.qHi}
                      onChange={(e) => setNewFaq({ ...newFaq, qHi: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Question (English) *</label>
                    <input
                      type="text"
                      placeholder="e.g. Does Root Canal Treatment hurt?"
                      value={newFaq.qEn}
                      onChange={(e) => setNewFaq({ ...newFaq, qEn: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Question (Hinglish)</label>
                    <input
                      type="text"
                      placeholder="e.g. Kya RCT me dard hota hai?"
                      value={newFaq.qHn}
                      onChange={(e) => setNewFaq({ ...newFaq, qHn: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Doctor Advice / Answer (Hindi) *</label>
                    <textarea
                      rows={3}
                      placeholder="प्रामाणिक चिकित्सीय उत्तर लिखें..."
                      value={newFaq.aHi}
                      onChange={(e) => setNewFaq({ ...newFaq, aHi: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Doctor Advice / Answer (English) *</label>
                    <textarea
                      rows={3}
                      placeholder="Clinical answer in English..."
                      value={newFaq.aEn}
                      onChange={(e) => setNewFaq({ ...newFaq, aEn: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Doctor Advice / Answer (Hinglish)</label>
                    <textarea
                      rows={3}
                      placeholder="Saral Hinglish me jawab..."
                      value={newFaq.aHn}
                      onChange={(e) => setNewFaq({ ...newFaq, aHn: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                </div>

                <div className="text-right pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                  >
                    + Add Question to Guide
                  </button>
                </div>
              </form>
            </div>

            {/* 3. Manage Custom FAQs List */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Custom Added Clinical FAQs ({config.dentalFaqs?.length || 0})
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">Click ✕ to remove any question</span>
              </div>

              {(!config.dentalFaqs || config.dentalFaqs.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No custom questions added yet. Default verified clinical questions are currently active.</p>
              ) : (
                <div className="space-y-2.5">
                  {config.dentalFaqs.map((faq) => (
                    <div key={faq.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <span className="text-[9px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 rounded uppercase">
                          {faq.cat}
                        </span>
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          {faq.qHi || faq.qEn}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {faq.aHi || faq.aEn}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(faq.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs px-2 py-1 rounded hover:bg-red-50 transition shrink-0"
                        title="Delete Question"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 1: OPERATIONS & CLINIC TIMING ================= */}
        {activeTab === 'operations' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Status & Public Broadcast
                </h2>
                <span className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold ${config.schedule.isOpenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {config.schedule.isOpenToday ? 'Clinic OPEN Today' : 'Clinic CLOSED Today'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.schedule.isOpenToday}
                    onChange={(e) => {
                      const updated = {
                        ...config,
                        schedule: { ...config.schedule, isOpenToday: e.target.checked },
                      };
                      saveConfiguration(updated);
                    }}
                    className="w-4 h-4 mt-0.5 accent-teal-600 rounded cursor-pointer shrink-0"
                  />
                  <div className="text-xs font-bold text-slate-800">
                    Clinic Open Today
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Toggle off if clinic is shut today</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.broadcast.enabled}
                    onChange={(e) => {
                      const updated = {
                        ...config,
                        broadcast: { ...config.broadcast, enabled: e.target.checked },
                      };
                      saveConfiguration(updated);
                    }}
                    className="w-4 h-4 mt-0.5 accent-teal-600 rounded cursor-pointer shrink-0"
                  />
                  <div className="text-xs font-bold text-slate-800">
                    Show Alert Banner
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Displays top alert message on site</span>
                  </div>
                </label>
              </div>

              {config.broadcast.enabled && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Notice Message (English)</label>
                    <input
                      type="text"
                      value={config.broadcast.textEn}
                      onChange={(e) => setConfig({ ...config, broadcast: { ...config.broadcast, textEn: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Notice Message (Hindi)</label>
                    <input
                      type="text"
                      value={config.broadcast.textHi}
                      onChange={(e) => setConfig({ ...config, broadcast: { ...config.broadcast, textHi: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-3">OPD Working Hours</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Morning Slot</label>
                  <input
                    type="text"
                    value={config.schedule.morningSlot}
                    onChange={(e) => setConfig({ ...config, schedule: { ...config.schedule, morningSlot: e.target.value } })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Evening Slot</label>
                  <input
                    type="text"
                    value={config.schedule.eveningSlot}
                    onChange={(e) => setConfig({ ...config, schedule: { ...config.schedule, eveningSlot: e.target.value } })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Sunday Status</label>
                  <input
                    type="text"
                    value={config.schedule.sundaySlotEn}
                    onChange={(e) => setConfig({ ...config, schedule: { ...config.schedule, sundaySlotEn: e.target.value } })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-3">Clinic Location & Contacts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Address (English)</label>
                  <input
                    type="text"
                    value={config.location.addressEn}
                    onChange={(e) => setConfig({ ...config, location: { ...config.location, addressEn: e.target.value } })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Address (Hindi)</label>
                  <input
                    type="text"
                    value={config.location.addressHi}
                    onChange={(e) => setConfig({ ...config, location: { ...config.location, addressHi: e.target.value } })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Inquiry Phone</label>
                  <input
                    type="text"
                    value={config.location.phone}
                    onChange={(e) => setConfig({ ...config, location: { ...config.location, phone: e.target.value } })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Google Maps Query</label>
                  <input
                    type="text"
                    value={config.location.mapQuery}
                    onChange={(e) => setConfig({ ...config, location: { ...config.location, mapQuery: e.target.value } })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
              </div>

              <div className="text-right pt-3 border-t">
                <button
                  type="button"
                  onClick={() => saveConfiguration()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                >
                  Save Operations Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DOCTORS DIRECTORY ================= */}
        {activeTab === 'team' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-3">
                Add Doctor to Directory (Permanent / Sunday Visiting Specialist)
              </h2>
              <form onSubmit={handleAddDoctor} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. BDS, MDS (Ex-AIIMS Delhi)"
                    value={newDoctor.degree}
                    onChange={(e) => setNewDoctor({ ...newDoctor, degree: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Specialty Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Consultant Orthodontist"
                    value={newDoctor.role}
                    onChange={(e) => setNewDoctor({ ...newDoctor, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Doctor Category / Type</label>
                  <select
                    value={newDoctor.type}
                    onChange={(e) => setNewDoctor({ ...newDoctor, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none bg-white"
                  >
                    <option value="Associate">Regular Associate Doctor</option>
                    <option value="Guest">Sunday Visiting Specialist (Delhi)</option>
                    <option value="Consultant">Visiting Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">विशेषज्ञता (Key Specialty)</label>
                  <input
                    type="text"
                    placeholder="e.g. Invisible Braces, Painless RCT, Dental Implants"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">OPD Schedule / Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Every Sunday (10 AM - 4 PM) या Daily OPD"
                    value={newDoctor.schedule}
                    onChange={(e) => setNewDoctor({ ...newDoctor, schedule: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Doctor Photo (from Device)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileRead(e, (base64) => setNewDoctor({ ...newDoctor, image: base64 }))}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                  {newDoctor.image && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={newDoctor.image} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-teal-300 shadow-sm" />
                      <span className="text-xs text-teal-700 font-semibold">✓ Photo attached</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 md:col-span-3 text-right pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                  >
                    + Add Doctor Profile
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Active Doctors Directory</h2>
                <span className="text-[11px] text-slate-500 font-medium">{config.team?.length || 0} Doctors</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {config.team?.map((doc) => (
                  <div key={doc.id || doc.name} className="p-3.5 border border-slate-200 rounded-2xl bg-white shadow-sm flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      {doc.image ? (
                        <img 
                          src={doc.image} 
                          alt={doc.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-teal-100 shrink-0" 
                          onError={(e) => { e.currentTarget.src = '/images/doctor-1.jpeg'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0 border">DR</div>
                      )}
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                          {doc.type === 'Guest' && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded">
                              Sunday Guest
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-teal-700 font-semibold truncate">{doc.degree} • {doc.role}</p>
                        {doc.specialty && (
                          <p className="text-[9px] text-slate-500 line-clamp-1 italic">{doc.specialty}</p>
                        )}
                        {doc.schedule && (
                          <p className="text-[9px] text-amber-700 font-medium">{doc.schedule}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoctor(doc.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs px-2 py-1 rounded hover:bg-red-50 transition shrink-0"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CLINIC TOUR PHOTOS ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-3">Add Tour Photo</h2>
              <form onSubmit={handleAddTourImage} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Caption (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Dental Operatory"
                    value={newTourImage.titleEn}
                    onChange={(e) => setNewTourImage({ ...newTourImage, titleEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Caption (Hindi)</label>
                  <input
                    type="text"
                    placeholder="उदा. आधुनिक डेंटल चेयर एवं यूनिट"
                    value={newTourImage.titleHi}
                    onChange={(e) => setNewTourImage({ ...newTourImage, titleHi: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Select Facility Photo *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileRead(e, (base64) => setNewTourImage({ ...newTourImage, src: base64 }))}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                  {newTourImage.src && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={newTourImage.src} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-teal-300" />
                      <span className="text-xs text-teal-700 font-semibold">✓ Photo selected</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 text-right pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                  >
                    + Add to Tour Slider
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Active Slider Photos</h2>
                <span className="text-[11px] text-slate-500 font-medium">{config.gallery?.length || 0} Photos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {config.gallery?.map((img) => (
                  <div key={img.id || img.src} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                    <img src={img.src} alt={img.titleEn} className="w-full aspect-[4/3] object-cover" />
                    <div className="p-2.5 bg-white flex-1 flex flex-col justify-between">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{img.titleEn}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveTourImage(img.id)}
                        className="mt-2 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 py-1 px-2 rounded-lg text-center transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: AWARDS & MEDIA COVERAGE ================= */}
        {activeTab === 'awards' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Add Award Photo or Newspaper Article (Media Coverage)
                </h2>
                <span className="text-[10px] sm:text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Auto-syncs to Home Slider
                </span>
              </div>

              <form onSubmit={handleAddAwardMedia} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Category Type *</label>
                  <select
                    value={newAwardMedia.type}
                    onChange={(e) => setNewAwardMedia({ ...newAwardMedia, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none bg-white font-medium"
                  >
                    <option value="award">🏆 Award & Honor (सम्मान)</option>
                    <option value="media">📰 Newspaper Article (अखबार की कटिंग / मीडिया)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    placeholder="e.g. State Dental Excellence Award"
                    value={newAwardMedia.titleEn}
                    onChange={(e) => setNewAwardMedia({ ...newAwardMedia, titleEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    placeholder="उदा. राज्य स्तरीय दंत चिकित्सा सम्मान"
                    value={newAwardMedia.titleHi}
                    onChange={(e) => setNewAwardMedia({ ...newAwardMedia, titleHi: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Publisher / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Dainik Bhaskar / IDA"
                    value={newAwardMedia.publisher}
                    onChange={(e) => setNewAwardMedia({ ...newAwardMedia, publisher: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025"
                    value={newAwardMedia.year}
                    onChange={(e) => setNewAwardMedia({ ...newAwardMedia, year: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Upload Photo / Scanned Article *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileRead(e, (base64) => setNewAwardMedia({ ...newAwardMedia, src: base64 }))}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                  {newAwardMedia.src && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={newAwardMedia.src} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-teal-300 shadow-sm" />
                      <span className="text-xs text-teal-700 font-semibold">✓ Photo attached & compressed</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 md:col-span-3 text-right pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                  >
                    + Add to Awards & Media Slider
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Active Awards & Media ({config.awardsMedia?.length || 0})
                </h2>
                <span className="text-xs text-slate-500 font-medium">Click Remove to delete from slider</span>
              </div>

              {(!config.awardsMedia || config.awardsMedia.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No awards or media items added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {config.awardsMedia.map((item) => (
                    <div key={item.id} className="p-3 border border-slate-200 rounded-xl flex items-start gap-3 bg-white shadow-sm">
                      <img 
                        src={item.src} 
                        alt={item.titleEn} 
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-50"
                        onError={(e) => { e.currentTarget.src = '/images/h1.jpeg'; }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            item.type === 'media' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.type === 'media' ? '📰 News' : '🏆 Award'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{item.year}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate mt-1">{item.titleEn}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.publisher}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAwardMedia(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 hover:bg-red-50 rounded transition shrink-0"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: MEDICAL CERTIFICATES ================= */}
        {activeTab === 'certificates' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-3">Upload Certificate</h2>
              <form onSubmit={handleAddCertificate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Fellow in Oral Implantology"
                    value={newCert.titleEn}
                    onChange={(e) => setNewCert({ ...newCert, titleEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    placeholder="उदा. ओरल इम्प्लांटोलॉजी फेलोशिप"
                    value={newCert.titleHi}
                    onChange={(e) => setNewCert({ ...newCert, titleHi: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. Indian Dental Association"
                    value={newCert.issuerEn}
                    onChange={(e) => setNewCert({ ...newCert, issuerEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Implantology"
                    value={newCert.categoryEn}
                    onChange={(e) => setNewCert({ ...newCert, categoryEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Certificate Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileRead(e, (base64) => setNewCert({ ...newCert, src: base64 }))}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                  {newCert.src && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={newCert.src} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-teal-200" />
                      <span className="text-xs text-teal-700 font-semibold">✓ Certificate image ready</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 text-right pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                  >
                    + Upload Certificate
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-3">Uploaded Certificates ({config.certificates?.length || 0})</h2>
              {(!config.certificates || config.certificates.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No custom uploaded certificates yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {config.certificates.map((c) => (
                    <div key={c.id} className="p-3 border border-slate-200 rounded-xl flex items-center gap-2.5 bg-white">
                      <img src={c.src} alt={c.titleEn} className="w-11 h-11 object-cover rounded-lg border shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{c.titleEn}</p>
                        <p className="text-[10px] text-slate-500 truncate">{c.issuerEn}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificate(c.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SECURITY & PASSWORD ================= */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm space-y-5 max-w-lg mx-auto w-full">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Change Admin Password</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                Update access credentials for the clinic administration portal.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={pwdForm.oldPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">New Strong Password * (Min. 8 characters)</label>
                <input
                  type="password"
                  placeholder="New Strong Password"
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={pwdForm.confirmPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                  required
                />
              </div>

              {pwdMsg.text && (
                <div className={`p-3 text-xs font-semibold rounded-xl text-center border ${pwdMsg.type === 'success' ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-600'}`}>
                  {pwdMsg.text}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
              >
                Save New Password
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}