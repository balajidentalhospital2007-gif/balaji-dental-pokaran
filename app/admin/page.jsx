'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
    { id: 1, name: 'Dr. Shashi Jangid', degree: 'BDS', role: 'Associate Dental Surgeon', type: 'Associate', image: '/images/doctor-1.jpeg' },
    { id: 2, name: 'Dr. Ashish Bhutra', degree: 'BDS', role: 'Associate Dental Surgeon', type: 'Associate', image: '/images/doctor-2.jpeg' },
    { id: 3, name: 'Dr. Jaydutt Paliwal', degree: 'BDS', role: 'Associate Dental Surgeon', type: 'Associate', image: '/images/doctor-3.jpeg' },
  ],
  gallery: [
    { id: 1, src: '/images/h1.jpeg', titleEn: 'Reception & Patient Lounge', titleHi: 'रिसेप्शन एवं वेटिंग एरिया' },
    { id: 2, src: '/images/h2.jpeg', titleEn: 'Modern Dental Operatory', titleHi: 'आधुनिक डेंटल चेयर एवं यूनिट' },
    { id: 3, src: '/images/a1.jpeg', titleEn: 'Advanced Sterilization Center', titleHi: 'स्टरलाइजेशन एवं स्वच्छता कक्ष' },
    { id: 4, src: '/images/a2.jpeg', titleEn: 'Digital RVG Diagnostic Unit', titleHi: 'डिजिटल डेंटल एक्सरे' },
  ],
  certificates: [],
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

  // Password Management State
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  // Doctor Form State
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    degree: 'BDS',
    role: 'Associate Dental Surgeon',
    type: 'Associate',
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

  // Load configuration and session on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionAuth = sessionStorage.getItem('balaji_admin_auth');
      if (sessionAuth === 'true') {
        setIsAuthenticated(true);
      }

      const storedConfig = localStorage.getItem('balaji_clinic_config');
      if (storedConfig) {
        try {
          const parsed = JSON.parse(storedConfig);
          setConfig((prev) => ({ ...prev, ...parsed }));
        } catch (err) {
          console.error('Failed to parse clinic config:', err);
        }
      }
    }
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

  // Save General Configuration to LocalStorage
  const saveConfiguration = (updatedConfig) => {
    const dataToSave = updatedConfig || config;
    setConfig(dataToSave);
    localStorage.setItem('balaji_clinic_config', JSON.stringify(dataToSave));
    setSaveSuccessMsg('All changes saved and synchronized successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // File Upload Helper (Encodes Image into clean base64 data)
  const handleImageFileRead = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
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
    setNewDoctor({ name: '', degree: 'BDS', role: 'Associate Dental Surgeon', type: 'Associate', image: '' });
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

  // ================= VIEW: LOGIN SCREEN (100% RESPONSIVE) =================
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

  // ================= VIEW: FULL DASHBOARD (RESPONSIVE FOR ALL DEVICES) =================
  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 pb-20 overflow-x-hidden">
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
        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="p-3 sm:p-4 bg-teal-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-md flex items-center justify-between gap-2">
            <span className="truncate">✓ {saveSuccessMsg}</span>
            <button type="button" onClick={() => setSaveSuccessMsg('')} className="text-white hover:text-teal-100 text-sm font-bold shrink-0 px-2">
              ✕
            </button>
          </div>
        )}

        {/* Mobile Horizontal Scrolling Tabs */}
        <div className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="bg-white rounded-xl sm:rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center gap-1.5 w-max min-w-full sm:w-full">
            {[
              { id: 'operations', label: '⏰ Operations & Notice' },
              { id: 'team', label: '👨‍⚕️ Doctors Directory' },
              { id: 'gallery', label: '🖼️ Tour Photos' },
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

        {/* ================= TAB 1: OPERATIONS & CLINIC TIMING ================= */}
        {activeTab === 'operations' && (
          <div className="space-y-4 sm:space-y-6 w-full">
            {/* Quick Status & Broadcast Banner */}
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

            {/* Schedule Timings */}
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

            {/* Location & Contacts */}
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
            {/* Add Doctor Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b pb-3">Add Doctor to Directory</h2>
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
                    placeholder="e.g. BDS, MDS"
                    value={newDoctor.degree}
                    onChange={(e) => setNewDoctor({ ...newDoctor, degree: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Specialty Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Dental Surgeon"
                    value={newDoctor.role}
                    onChange={(e) => setNewDoctor({ ...newDoctor, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Designation Type</label>
                  <select
                    value={newDoctor.type}
                    onChange={(e) => setNewDoctor({ ...newDoctor, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none bg-white"
                  >
                    <option value="Associate">Associate Surgeon</option>
                    <option value="Consultant">Visiting Consultant</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Doctor Photo (from Device)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileRead(e, (base64) => setNewDoctor({ ...newDoctor, image: base64 }))}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                  {newDoctor.image && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={newDoctor.image} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-teal-300" />
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

            {/* List Existing Doctors */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full">
              <div className="border-b pb-3 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Active Doctors</h2>
                <span className="text-[11px] text-slate-500 font-medium">{config.team?.length || 0} Doctors</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {config.team?.map((doc) => (
                  <div key={doc.id || doc.name} className="p-3.5 border border-slate-200 rounded-xl bg-white shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {doc.image ? (
                        <img src={doc.image} alt={doc.name} className="w-11 h-11 rounded-xl object-cover border border-teal-100 shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0 border">DR</div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-[10px] text-teal-700 font-semibold truncate">{doc.degree} • {doc.type}</p>
                        <p className="text-[10px] text-slate-500 truncate">{doc.role}</p>
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

        {/* ================= TAB 4: MEDICAL CERTIFICATES ================= */}
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

        {/* ================= TAB 5: SECURITY & PASSWORD ================= */}
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