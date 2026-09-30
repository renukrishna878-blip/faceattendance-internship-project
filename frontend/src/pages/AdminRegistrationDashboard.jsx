import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { DEPARTMENTS } from '../utils/timetableData';

const AdminRegistrationDashboard = () => {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);
  const setSelectedClass = useStore((state) => state.setSelectedClass);

  // Data states
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Configuration modal
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [previewFormOpen, setPreviewFormOpen] = useState(false);
  const [formConfig, setFormConfig] = useState({
    form_url: localStorage.getItem('gf_form_url') || '',
    sheet_url: localStorage.getItem('gf_sheet_url') || '',
    webhook_url: 'http://localhost:5000/api/students/google-form-register',
    api_key: 'smart_attend_gf_sec_2026_x9k'
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Simulator / Test Registration Modal
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simData, setSimData] = useState({
    student_id: '',
    name: '',
    department: 'Computer Science & Engineering',
    year: '3',
    section: 'A',
    email: '',
    consent: true
  });
  const [simPhotoFile, setSimPhotoFile] = useState(null);
  const [simPhotoPreview, setSimPhotoPreview] = useState(null);
  const [simSubmitting, setSimSubmitting] = useState(false);
  const [simCameraActive, setSimCameraActive] = useState(false);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // Google Sheet Sync Modal
  const [sheetSyncOpen, setSheetSyncOpen] = useState(false);
  const [syncSheetUrl, setSyncSheetUrl] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  // Retry Modal
  const [selectedLog, setSelectedLog] = useState(null);
  const [retryModalOpen, setRetryModalOpen] = useState(false);
  const [retryPhotoFile, setRetryPhotoFile] = useState(null);
  const [retryLoading, setRetryLoading] = useState(false);

  // Guide Modal
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Selected class for real-time testing
  const [testClassId, setTestClassId] = useState('');

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  // Fetch registration logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/students/registration-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching registration logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Google Form config & stats
  const fetchConfigAndStats = async () => {
    try {
      const [cfgRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/students/google-form-config', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/students/google-form-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const cfgData = await cfgRes.json();
      if (cfgData.success && cfgData.data) {
        setFormConfig(prev => ({
          ...prev,
          form_url: cfgData.data.form_url || prev.form_url,
          sheet_url: cfgData.data.sheet_url || prev.sheet_url,
          webhook_url: cfgData.data.webhook_url || prev.webhook_url,
          api_key: cfgData.data.api_key || prev.api_key
        }));
      }

      const statsData = await statsRes.json();
      if (statsData.success && statsData.data) {
        setStats(statsData.data);
        if (statsData.data.classes_ready_for_attendance?.length > 0) {
          setTestClassId(statsData.data.classes_ready_for_attendance[0].class_id);
        }
      }
    } catch (err) {
      console.warn('Config/stats fetch error:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchConfigAndStats();
  }, [token]);

  // Handle Save Google Form Details
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('http://localhost:5000/api/students/google-form-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formConfig)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('gf_form_url', formConfig.form_url);
        localStorage.setItem('gf_sheet_url', formConfig.sheet_url);
        showToast('Google Form details saved successfully!', 'success');
        setConfigModalOpen(false);
      } else {
        showToast(data.message || 'Failed to save config', 'error');
      }
    } catch (err) {
      showToast(`Error saving configuration: ${err.message}`, 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  // Camera handling for simulator
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      cameraStreamRef.current = stream;
      setSimCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      showToast('Could not access webcam: ' + err.message, 'error');
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setSimCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSimPhotoFile(file);
      setSimPhotoPreview(URL.createObjectURL(file));
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSimPhotoFile(file);
      setSimPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Submit Simulator Form
  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    if (!simData.student_id || !simData.name) {
      showToast('Student ID and Full Name are required!', 'error');
      return;
    }
    if (!simPhotoFile) {
      showToast('Please upload or capture a face photograph!', 'error');
      return;
    }

    setSimSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('student_id', simData.student_id.trim());
      formData.append('name', simData.name.trim());
      formData.append('department', simData.department);
      formData.append('class_section', `${simData.year}-${simData.section}`);
      formData.append('email', simData.email.trim() || `${simData.student_id.toLowerCase()}@college.edu`);
      formData.append('consent', simData.consent ? 'Yes' : 'No');
      formData.append('face_photo', simPhotoFile);

      const res = await fetch('http://localhost:5000/api/students/google-form-register', {
        method: 'POST',
        headers: {
          'X-API-KEY': formConfig.api_key || 'smart_attend_gf_sec_2026_x9k'
        },
        body: formData
      });

      const data = await res.json();

      if (res.status === 201 && data.status === 'REGISTERED') {
        showToast(`🎉 Student ${simData.student_id} verified via YuNet & SFace! Added to database.`, 'success');
        setSimModalOpen(false);
        setSimPhotoFile(null);
        setSimPhotoPreview(null);
        setSimData({
          student_id: '',
          name: '',
          department: 'Computer Science & Engineering',
          year: '3',
          section: 'A',
          email: '',
          consent: true
        });
        fetchLogs();
        fetchConfigAndStats();
      } else {
        const errorMsg = data.error || data.message || `Registration rejected: ${data.status}`;
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      showToast(`Submission failed: ${err.message}`, 'error');
    } finally {
      setSimSubmitting(false);
    }
  };

  // Sync Google Sheet
  const handleSyncSheet = async () => {
    if (!syncSheetUrl) {
      showToast('Please enter a Google Sheet URL or ID.', 'error');
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('http://localhost:5000/api/students/google-sheet-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sheet_url: syncSheetUrl })
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(data.data);
        showToast(data.message, 'success');
        fetchLogs();
        fetchConfigAndStats();
      } else {
        showToast(data.message || 'Sync failed', 'error');
      }
    } catch (err) {
      showToast(`Sync error: ${err.message}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Sync Demo Sample Data
  const handleSyncDemoData = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const demoRows = [
        {
          "Student ID": "24CS801",
          "Student Name": "Arjun Kumar",
          "Department": "Computer Science & Engineering",
          "Class/Section": "3-A",
          "Email": "arjun.kumar@college.edu",
          "Face Photograph": "http://localhost:5000/uploads/students/student_1.png"
        },
        {
          "Student ID": "24CS802",
          "Student Name": "Meera Nambiar",
          "Department": "Computer Science & Engineering",
          "Class/Section": "3-A",
          "Email": "meera.nambiar@college.edu",
          "Face Photograph": "http://localhost:5000/uploads/students/face_r1_c02.jpg"
        },
        {
          "Student ID": "24CS803",
          "Student Name": "Kiran Reddy",
          "Department": "Computer Science & Engineering",
          "Class/Section": "3-A",
          "Email": "kiran.reddy@college.edu",
          "Face Photograph": "http://localhost:5000/uploads/students/face_r1_c03.jpg"
        }
      ];

      const res = await fetch('http://localhost:5000/api/students/google-sheet-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rows_data: demoRows })
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(data.data);
        showToast(data.message || 'Demo sheet data synced successfully!', 'success');
        fetchLogs();
        fetchConfigAndStats();
      } else {
        showToast(data.message || 'Sync failed', 'error');
      }
    } catch (err) {
      showToast(`Demo sync error: ${err.message}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Retry execution
  const handleOpenRetry = (log) => {
    setSelectedLog(log);
    setRetryPhotoFile(null);
    setRetryModalOpen(true);
  };

  const handleExecuteRetry = async () => {
    if (!selectedLog) return;
    try {
      setRetryLoading(true);
      const formData = new FormData();
      if (retryPhotoFile) {
        formData.append('face_photo', retryPhotoFile);
      }

      const res = await fetch(`http://localhost:5000/api/students/registration-logs/${selectedLog.id}/retry`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Student verified and registered successfully!', 'success');
        setRetryModalOpen(false);
        fetchLogs();
        fetchConfigAndStats();
      } else {
        showToast(data.message || data.error || 'Retry failed. Check face quality.', 'error');
      }
    } catch (err) {
      showToast(`Retry failed: ${err.message}`, 'error');
    } finally {
      setRetryLoading(false);
    }
  };

  // Launch Classroom Attendance Test with registered database
  const handleLaunchClassroomTest = () => {
    let targetClass = null;
    if (stats?.classes_ready_for_attendance?.length > 0) {
      targetClass = stats.classes_ready_for_attendance.find(c => String(c.class_id) === String(testClassId)) || stats.classes_ready_for_attendance[0];
    }

    if (targetClass) {
      setSelectedClass({
        classId: targetClass.class_id,
        department: targetClass.department_code || targetClass.department_name,
        year: String(targetClass.year),
        semester: String(targetClass.year * 2 - 1),
        section: targetClass.section,
        subject: 'General Attendance Testing',
        subjectName: 'Live Classroom Face Attendance'
      });
    } else {
      setSelectedClass({
        department: 'cs',
        year: '3',
        semester: '5',
        section: 'A',
        subject: 'General Attendance Testing'
      });
    }

    navigate('/attendance/select');
  };

  // Filtered list
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.register_number && log.register_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.name && log.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.department && log.department.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'ALL') return true;
    if (activeTab === 'REGISTERED') return log.registration_status === 'REGISTERED';
    if (activeTab === 'DUPLICATE') return log.registration_status === 'DUPLICATE';
    if (activeTab === 'FAILED') {
      return ['INVALID_FACE', 'MULTIPLE_FACES', 'LOW_QUALITY', 'PROCESSING_FAILED'].includes(log.registration_status);
    }
    return true;
  });

  const totalCount = logs.length;
  const verifiedCount = logs.filter(l => l.registration_status === 'REGISTERED').length;
  const failedCount = logs.filter(l => ['INVALID_FACE', 'MULTIPLE_FACES', 'LOW_QUALITY', 'PROCESSING_FAILED'].includes(l.registration_status)).length;
  const duplicateCount = logs.filter(l => l.registration_status === 'DUPLICATE').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REGISTERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            REGISTERED
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-spin"></span>
            PROCESSING
          </span>
        );
      case 'DUPLICATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="material-symbols-outlined text-[13px]">content_copy</span>
            DUPLICATE
          </span>
        );
      case 'MULTIPLE_FACES':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="material-symbols-outlined text-[13px]">groups</span>
            MULTIPLE_FACES
          </span>
        );
      case 'INVALID_FACE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="material-symbols-outlined text-[13px]">no_accounts</span>
            INVALID_FACE
          </span>
        );
      case 'LOW_QUALITY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="material-symbols-outlined text-[13px]">lens_blur</span>
            LOW_QUALITY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="material-symbols-outlined text-[13px]">error</span>
            {status || 'FAILED'}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white font-medium text-sm animate-fade-in ${
          toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toastMessage.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toastMessage.text}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-primary to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
              <span className="material-symbols-outlined text-sm">dynamic_form</span>
              Live Biometric Onboarding & Real-Time Testing
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Google Form Student Database & Testing Hub
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Connect your Google Form, sync student portraits automatically into the database via YuNet & SFace AI models, and instantly run real-time classroom attendance recognition.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPreviewFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/80 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm border border-white/20"
              title="Open embedded live Google Form view"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              Live Form View
            </button>
            <button
              onClick={() => setConfigModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition shadow-sm backdrop-blur-sm"
              title="Configure Google Form URL, Sheet & Webhook"
            >
              <span className="material-symbols-outlined text-base text-blue-300">settings</span>
              Form Details & Setup
            </button>
            <button
              onClick={() => setSimModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30"
              title="Test Student Registration directly with Face Photo"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              + Test Form Submission
            </button>
            <button
              onClick={() => setSheetSyncOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm"
              title="Sync responses from Google Sheet"
            >
              <span className="material-symbols-outlined text-base">sync_alt</span>
              Sync from Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Classroom Attendance Testing Bridge */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-blue-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-2xl">photo_camera_front</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">Real-Time Classroom Testing Hub</h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {verifiedCount} Students Ready
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a registered class to test real-time crowd facial recognition with the active student database.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {stats?.classes_ready_for_attendance?.length > 0 ? (
            <select
              value={testClassId}
              onChange={(e) => setTestClassId(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {stats.classes_ready_for_attendance.map((c) => (
                <option key={c.class_id} value={c.class_id}>
                  {c.department_name} • Year {c.year} - {c.section} ({c.student_count} students)
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-gray-400 italic px-2">No active classes yet</div>
          )}

          <button
            onClick={handleLaunchClassroomTest}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            Launch Attendance Test
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Submissions</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">{totalCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Registered & Verified</p>
            <h3 className="text-2xl md:text-3xl font-black text-emerald-700 mt-1">{verifiedCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Attention Needed</p>
            <h3 className="text-2xl md:text-3xl font-black text-rose-600 mt-1">{failedCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Duplicate IDs</p>
            <h3 className="text-2xl md:text-3xl font-black text-purple-700 mt-1">{duplicateCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">content_copy</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Controls: Tabs & Search */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'ALL'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('REGISTERED')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'REGISTERED'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Registered ({verifiedCount})
            </button>
            <button
              onClick={() => setActiveTab('FAILED')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'FAILED'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Attention Needed ({failedCount})
            </button>
            <button
              onClick={() => setActiveTab('DUPLICATE')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'DUPLICATE'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Duplicates ({duplicateCount})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Search Student ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="p-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
              title="Refresh List"
            >
              <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>sync</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Student ID</th>
                <th className="py-3 px-6">Student Name</th>
                <th className="py-3 px-6">Department & Class</th>
                <th className="py-3 px-6">Registration Status</th>
                <th className="py-3 px-6">Biometrics (YuNet & SFace)</th>
                <th className="py-3 px-6">Submitted Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">progress_activity</span>
                    <p className="text-xs">Loading registration submissions...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">inbox</span>
                    <p className="text-sm font-semibold text-gray-600">No submissions found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery ? 'Try changing your search query.' : 'Click "+ Test Form Submission" to register a student for real-time testing!'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateStr = log.created_at
                    ? new Date(log.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Just now';

                  const isFailed = ['INVALID_FACE', 'MULTIPLE_FACES', 'LOW_QUALITY', 'PROCESSING_FAILED'].includes(log.registration_status);

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-gray-900">
                        {log.register_number}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-gray-800">
                        <div className="flex items-center gap-3">
                          {log.photo_url ? (
                            <img
                              src={`http://localhost:5000${log.photo_url}`}
                              alt={log.name}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs">
                              {log.name ? log.name.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          <span>{log.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-gray-600 text-xs">
                        <div className="font-semibold text-gray-800">{log.class_section || '-'}</div>
                        <div className="text-[11px] text-gray-400">{log.department || 'General'}</div>
                      </td>
                      <td className="py-3.5 px-6">
                        {getStatusBadge(log.registration_status)}
                        {log.error_message && (
                          <p className="text-[11px] text-rose-500 mt-1 max-w-xs truncate" title={log.error_message}>
                            {log.error_message}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        {log.face_status === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            VERIFIED (128-D)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {log.face_status || 'PENDING'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-xs text-gray-500">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {isFailed ? (
                          <button
                            onClick={() => handleOpenRetry(log)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
                          >
                            <span className="material-symbols-outlined text-[14px]">replay</span>
                            Retry
                          </button>
                        ) : log.registration_status === 'REGISTERED' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            Ready
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. Google Form Configuration & Details Modal */}
      {/* ========================================================================= */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">dynamic_form</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Google Form Configuration</h3>
                  <p className="text-xs text-gray-500">Connect Google Form & Google Sheet to your Attendance Database</p>
                </div>
              </div>
              <button
                onClick={() => setConfigModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-6 space-y-5 overflow-y-auto">
              {/* Form Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">Google Form Public Link</label>
                  {formConfig.form_url && (
                    <a
                      href={formConfig.form_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      Open Live Form
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  value={formConfig.form_url}
                  onChange={(e) => setFormConfig({ ...formConfig, form_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {formConfig.form_url && formConfig.form_url.includes('EXAMPLE') ? (
                  <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span className="material-symbols-outlined text-[14px] text-amber-600">warning</span>
                    Notice: "1FAIpQLSc_EXAMPLE" is a documentation placeholder. Replace it with your actual Google Form link from Google Drive.
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-400">Share this link with students to collect registration portraits.</p>
                )}
              </div>

              {/* Sheet Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">Google Sheet Responses Link</label>
                  {formConfig.sheet_url && (
                    <a
                      href={formConfig.sheet_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      Open Sheet
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={formConfig.sheet_url}
                  onChange={(e) => setFormConfig({ ...formConfig, sheet_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Webhook Endpoint */}
              <div className="space-y-1.5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">webhook</span>
                    Backend Webhook URL
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formConfig.webhook_url, 'Webhook URL')}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    Copy URL
                  </button>
                </div>
                <p className="font-mono text-xs text-gray-600 break-all bg-white p-2.5 rounded-lg border border-gray-200 select-all">
                  {formConfig.webhook_url}
                </p>
                <p className="text-[11px] text-gray-400">Target endpoint for Google Apps Script <code>onFormSubmit</code> triggers.</p>
              </div>

              {/* API Key */}
              <div className="space-y-1.5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-600">key</span>
                    Secret API Key (X-API-KEY)
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formConfig.api_key, 'API Key')}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    Copy Key
                  </button>
                </div>
                <input
                  type="text"
                  value={formConfig.api_key}
                  onChange={(e) => setFormConfig({ ...formConfig, api_key: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white font-mono text-xs border border-gray-200 rounded-lg"
                />
              </div>

              {/* Modal footer */}
              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(true)}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  View Apps Script Guide
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfigModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 transition shadow-sm disabled:opacity-50"
                  >
                    {savingConfig ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Interactive Google Form Simulator / Real-Time Student Test Modal */}
      {/* ========================================================================= */}
      {simModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Google Form Registration Simulator</h3>
                  <p className="text-xs text-gray-500">Test live student entry with real YuNet & SFace biometrics</p>
                </div>
              </div>
              <button
                onClick={() => { stopCamera(); setSimModalOpen(false); }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Student Roll / Register Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24CS101"
                    value={simData.student_id}
                    onChange={(e) => setSimData({ ...simData, student_id: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Rao"
                    value={simData.name}
                    onChange={(e) => setSimData({ ...simData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-bold text-gray-700">Department</label>
                  <select
                    value={simData.department}
                    onChange={(e) => setSimData({ ...simData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {Object.entries(DEPARTMENTS).map(([code, dept]) => (
                      <option key={code} value={dept.name}>{code.toUpperCase()} - {dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Year</label>
                  <select
                    value={simData.year}
                    onChange={(e) => setSimData({ ...simData, year: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section</label>
                  <select
                    value={simData.section}
                    onChange={(e) => setSimData({ ...simData, section: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="student@college.edu"
                  value={simData.email}
                  onChange={(e) => setSimData({ ...simData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Photo Upload or Webcam Section */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-emerald-600">add_a_photo</span>
                    Face Photograph (Single portrait, clear lighting) *
                  </label>
                  <div className="flex items-center gap-2">
                    {!simCameraActive ? (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition"
                      >
                        <span className="material-symbols-outlined text-[13px]">videocam</span>
                        Use Webcam
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition"
                      >
                        Cancel Camera
                      </button>
                    )}
                  </div>
                </div>

                {/* Webcam Stream */}
                {simCameraActive && (
                  <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500 shadow-md">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover" />
                    <div className="absolute bottom-3 inset-x-0 flex justify-center">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">camera</span>
                        Take Snapshot
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload from file */}
                {!simCameraActive && (
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    {simPhotoPreview && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-300 flex-shrink-0">
                        <img src={simPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Consent checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sim-consent"
                  checked={simData.consent}
                  onChange={(e) => setSimData({ ...simData, consent: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="sim-consent" className="text-xs text-gray-600 cursor-pointer">
                  Student consents to facial biometric attendance registration
                </label>
              </div>

              {/* Modal footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { stopCamera(); setSimModalOpen(false); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simSubmitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md shadow-emerald-600/30 disabled:opacity-50"
                >
                  {simSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Verifying Face & Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">how_to_reg</span>
                      Register & Verify Biometrics
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. Google Sheet Sync Modal */}
      {/* ========================================================================= */}
      {sheetSyncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">sync_alt</span>
                Sync Responses from Google Sheet
              </h3>
              <button onClick={() => setSheetSyncOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Paste the public link to your Google Form response spreadsheet. The server will extract all student rows and automatically process face embeddings into MySQL:
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Google Sheet URL</label>
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                value={syncSheetUrl}
                onChange={(e) => setSyncSheetUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {syncSheetUrl && syncSheetUrl.includes('docs.google.com/forms/') && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1.5 animate-fade-in">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <span className="material-symbols-outlined text-base text-amber-600">info</span>
                  Notice: You entered a Google Form link instead of a Google Sheet link!
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Google Forms (<code>.../viewform</code>) are questionnaire pages for students to fill out. The actual database responses and photos are collected in the <strong>linked Google Sheet</strong>.
                </p>
                <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 text-[11px] space-y-1">
                  <p className="font-bold text-gray-900">How to get your Google Sheet URL:</p>
                  <ol className="list-decimal pl-4 space-y-0.5 text-gray-700">
                    <li>Open your Google Form in Google Drive.</li>
                    <li>Click the <strong>Responses</strong> tab at the top.</li>
                    <li>Click the green <strong>Link to Sheets</strong> icon.</li>
                    <li>Copy that Google Sheet URL (starts with <code>https://docs.google.com/spreadsheets/d/...</code>) and paste it here!</li>
                  </ol>
                </div>
              </div>
            )}

            {syncResult && (
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                <p className="font-bold text-gray-800">Sync Results:</p>
                <div className="flex gap-4">
                  <span className="text-emerald-600 font-bold">✓ {syncResult.registered} Registered</span>
                  <span className="text-purple-600 font-bold">⧉ {syncResult.duplicates} Duplicates</span>
                  <span className="text-rose-600 font-bold">✗ {syncResult.failed} Failed</span>
                </div>
              </div>
            )}

            {syncSheetUrl && syncSheetUrl.includes('EXAMPLE') && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base">warning</span>
                <span>You entered a placeholder URL ("EXAMPLE"). Please paste your actual Google Sheet URL.</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSyncDemoData}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition shadow-sm"
                title="Immediately test with 3 sample students and faces without creating a Google Sheet"
              >
                <span className="material-symbols-outlined text-sm">science</span>
                Load Demo Sheet Data
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSheetSyncOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSyncSheet}
                  disabled={syncing}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm disabled:opacity-50"
                >
                  {syncing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Processing Sheet Rows...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">cloud_download</span>
                      Start Batch Sync
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retry Modal */}
      {retryModalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">replay</span>
                Retry Student Registration
              </h3>
              <button onClick={() => setRetryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800">
                <p className="font-bold">Current Status: {selectedLog.registration_status}</p>
                <p className="mt-0.5">{selectedLog.error_message || 'Face validation failed during initial processing.'}</p>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-gray-500">Student ID: <span className="font-bold text-gray-800 font-mono">{selectedLog.register_number}</span></p>
                <p className="text-gray-500">Name: <span className="font-bold text-gray-800">{selectedLog.name}</span></p>
                <p className="text-gray-500">Class: <span className="font-bold text-gray-800">{selectedLog.class_section} ({selectedLog.department})</span></p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Replacement Photograph (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRetryPhotoFile(e.target.files[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setRetryModalOpen(false)}
                disabled={retryLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200/60 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRetry}
                disabled={retryLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 transition shadow-sm disabled:opacity-50"
              >
                {retryLoading ? 'Processing...' : 'Re-run Verification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">integration_instructions</span>
                Google Form & Apps Script Setup Guide
              </h3>
              <button onClick={() => setGuideModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs text-gray-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">1. Webhook Endpoint Details</h4>
                <div className="bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                  <p><span className="text-gray-400">Method:</span> POST</p>
                  <p><span className="text-gray-400">URL:</span> {formConfig.webhook_url}</p>
                  <p><span className="text-gray-400">Header:</span> X-API-KEY: {formConfig.api_key}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">2. Google Sheet & Apps Script Trigger</h4>
                <p>
                  In your response Google Sheet, open <strong>Extensions &rarr; Apps Script</strong> and paste the trigger code from <code>Face_attendance/google_apps_script/GoogleAppsScript_Trigger.js</code>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">3. Automated Processing Pipeline</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-500">
                  <li><strong>YuNet Face Detection:</strong> Validates single-person photo (rejects 0 faces or multiple faces).</li>
                  <li><strong>Face Quality Filter:</strong> Checks sharpness, resolution, and landmark confidence.</li>
                  <li><strong>SFace Feature Extractor:</strong> Computes 128-D normalized face representation.</li>
                  <li><strong>Automatic Attendance Readiness:</strong> Student is saved to MySQL and immediately recognized in classroom group photos.</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setGuideModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 transition shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Embedded Google Form Viewer Modal */}
      {previewFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-[88vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">dynamic_form</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Live Google Form Preview</h3>
                  <p className="text-xs text-gray-500">Preview or fill out your student registration form inside the app</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {formConfig.form_url && !formConfig.form_url.includes('EXAMPLE') && (
                  <a
                    href={formConfig.form_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-primary border border-gray-200 hover:bg-gray-50 shadow-sm transition"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Open in New Tab
                  </a>
                )}
                <button
                  onClick={() => setPreviewFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {(!formConfig.form_url || formConfig.form_url.includes('EXAMPLE')) ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">link_off</span>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-gray-900">
                    {formConfig.form_url?.includes('EXAMPLE') ? 'Placeholder Example URL Detected' : 'No Google Form Link Connected'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formConfig.form_url?.includes('EXAMPLE')
                      ? 'The URL contains "1FAIpQLSc_EXAMPLE". That is a documentation sample and does not exist on Google servers.'
                      : 'Please paste the public link to your active Google Form to preview it here.'}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 text-left space-y-1.5 w-full">
                  <p className="font-bold flex items-center gap-1 text-blue-800">
                    <span className="material-symbols-outlined text-[15px]">tips_and_updates</span>
                    How to get your real form link:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-gray-700">
                    <li>Open your Google Form in Google Drive.</li>
                    <li>Click the <strong>Send</strong> button (top right).</li>
                    <li>Click the link icon 🔗 and copy the URL.</li>
                    <li>Paste it in <strong>Form Details & Setup</strong>!</li>
                  </ol>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => { setPreviewFormOpen(false); setConfigModalOpen(true); }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 shadow-sm"
                  >
                    Open Form Details & Setup
                  </button>
                  <button
                    onClick={() => { setPreviewFormOpen(false); setSimModalOpen(true); }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  >
                    Use Simulator Instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-gray-100 p-2">
                <iframe
                  src={formConfig.form_url.includes('?') ? `${formConfig.form_url}&embedded=true` : `${formConfig.form_url}?embedded=true`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="w-full h-full rounded-2xl bg-white shadow-inner"
                  title="Google Form Live Viewer"
                >
                  Loading Google Form...
                </iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrationDashboard;
