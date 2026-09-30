import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { DEPARTMENTS } from '../utils/timetableData';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const TakeAttendance = () => {
  const navigate = useNavigate();
  const setSelectedClass = useStore((state) => state.setSelectedClass);
  const setAttendanceSession = useStore((state) => state.setAttendanceSession);
  const selectedClass = useStore((state) => state.selectedClass) || {};

  const [selectedClassForm, setSelectedClassForm] = useState({
    department: selectedClass.department || '',
    year: selectedClass.year || '',
    semester: selectedClass.semester || '',
    section: selectedClass.section || '',
    subject: selectedClass.subject || '',
    date: new Date().toISOString().split('T')[0], // defaults to today
    timing: '09:00 AM - 10:30 AM',
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = React.useRef(null);

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'environment' }
      });
      setWebcamStream(stream);
      setUseWebcam(true);
      setErrorMessage('');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Failed to open webcam:', err);
      setErrorMessage('Could not access camera. Please check permissions or upload a file.');
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setUseWebcam(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const file = dataURLtoFile(dataUrl, `captured_classroom_${Date.now()}.jpg`);
    
    setSelectedPhoto(file);
    stopWebcam();
  };

  const handleClassChange = (event) => {
    const { name, value } = event.target;
    setSelectedClassForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'department' || name === 'year' || name === 'semester') {
        updated.subject = ''; // reset subject
      }
      return updated;
    });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedPhoto(null);
      setErrorMessage('Please upload a PNG, JPG, or WEBP image.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setSelectedPhoto(null);
      setErrorMessage('Photo size must be 10MB or less.');
      event.target.value = '';
      return;
    }

    setSelectedPhoto(file);
    setErrorMessage('');
  };

  const handleProceedToScan = () => {
    const isClassFormComplete = Object.values(selectedClassForm).every(Boolean);
    if (!isClassFormComplete) {
      setErrorMessage('Please select department, year, section, subject, date, and timing.');
      return;
    }

    if (!selectedPhoto) {
      setErrorMessage('Please upload a classroom photo before scanning.');
      return;
    }

    setSelectedClass(selectedClassForm);
    setAttendanceSession({
      uploadedImage: selectedPhoto,
      date: selectedClassForm.date,
      timing: selectedClassForm.timing,
    });
    navigate('/attendance/upload');
  };

  return (
    <>
      
{/*  TopAppBar  */}
<header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-14 bg-surface shadow-sm">
<div className="flex items-center gap-md">
<button className="p-base active:scale-95 duration-150 ease-in-out rounded-full hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-primary" data-icon="menu">menu</span>
</button>
<h1 className="font-headline-sm text-headline-sm font-bold text-primary">Smart Attendance System</h1>
</div>
<div className="flex items-center gap-md">
<div className="w-8 h-8 rounded-full bg-primary-fixed-dim overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a female professor in a modern university setting. She has a friendly, authoritative expression, wearing professional academic attire. The background is a softly blurred modern office with books and a window showing soft daylight. The lighting is bright and high-key, consistent with a clean, academic design system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh5cyxorKOBf4TthYK49JcMF9gXB15SvjE-h74FtXyVqm6Csxw2ekF3lvn5ksPsz_JcfreNq0Eoi55HarOV_IdbChfYyP1PUm3Wf-5uHOWDzQrX18la7crORkeNDlPMWuBCOxGqKxvKTHcgnLA64R6hUWQLFWuczyY1MO1DuM5TfMzvFs4NXmdoP-QxFKeFsxr4zwVEIgl8Ch9FISCfTRk6WVUKpiGT6E12tXX59WKIw-trD_4tOhyOg"/>
</div>
</div>
</header>
{/*  Main Content Area  */}
<main className="pt-20 px-margin-mobile md:px-margin-tablet max-w-4xl mx-auto">
{/*  Welcome & Breadcrumb  */}
<section className="mb-lg">
<div className="flex items-center gap-xs text-on-surface-variant font-label-lg text-label-lg mb-xs">
<span>Dashboard</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-primary font-bold">New Session</span>
</div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Take Attendance</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Select class details and upload a classroom photo to begin automated processing.</p>
</section>
{/*  Attendance Form Selection  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
{/*  Selection Card  */}
<div className="md:col-span-12 bg-surface-container-lowest rounded-xl p-lg custom-shadow border border-surface-container">
<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
{/*  Department  */}
<div className="space-y-base">
<label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Department</label>
<div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
<select className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" name="department" value={selectedClassForm.department} onChange={handleClassChange}>
<option disabled value="">Select Department</option>
{Object.entries(DEPARTMENTS).map(([key, dept]) => (
  key !== 'ee' ? <option key={key} value={key}>{dept.name}</option> : null
))}
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
{/*  Year  */}
<div className="space-y-base">
<label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Year</label>
<div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
<select className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" name="year" value={selectedClassForm.year} onChange={handleClassChange}>
<option disabled value="">Select Academic Year</option>
<option value="1">1st Year</option>
<option value="2">2nd Year</option>
<option value="3">3rd Year</option>
<option value="4">4th Year</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
{/*  Semester  */}
<div className="space-y-base">
<label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Semester</label>
<div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
<select 
  className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" 
  name="semester" 
  value={selectedClassForm.semester} 
  onChange={handleClassChange}
>
  <option disabled value="">Select Semester</option>
  <option value="1">1st Semester</option>
  <option value="2">2nd Semester</option>
  <option value="3">3rd Semester</option>
  <option value="4">4th Semester</option>
  <option value="5">5th Semester</option>
  <option value="6">6th Semester</option>
  <option value="7">7th Semester</option>
  <option value="8">8th Semester</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
{/*  Section  */}
<div className="space-y-base">
<label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Section</label>
<div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
<select className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" name="section" value={selectedClassForm.section} onChange={handleClassChange}>
<option disabled value="">Select Section</option>
<option value="A">Section A</option>
<option value="B">Section B</option>
<option value="C">Section C</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
{/*  Subject  */}
<div className="space-y-base">
<label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Subject</label>
<div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
<select 
  className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" 
  name="subject" 
  value={selectedClassForm.subject} 
  onChange={handleClassChange} 
  disabled={!selectedClassForm.department || !selectedClassForm.semester}
>
  <option disabled value="">Select Subject</option>
  {selectedClassForm.department && selectedClassForm.semester && 
    DEPARTMENTS[selectedClassForm.department]?.subjects
      ?.filter(sub => String(sub.semester) === String(selectedClassForm.semester))
      ?.map((sub) => (
        <option key={sub.id} value={sub.id}>{sub.name}</option>
      ))
  }
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
{/*  Date  */}
<div className="space-y-base">
<label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Date</label>
<div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
<input 
  type="date"
  className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer outline-none" 
  name="date" 
  value={selectedClassForm.date} 
  onChange={handleClassChange}
  required
/>
</div>
</div>
{/*  Timing  */}
<div className="space-y-base">
<label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Class Timing</label>
<div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
<select 
  className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" 
  name="timing" 
  value={selectedClassForm.timing} 
  onChange={handleClassChange}
>
  <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM</option>
  <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
  <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
</div>
</div>
{/*  Upload / Camera Action Section  */}
<div className="md:col-span-12">
  <div className="flex gap-4 mb-4 justify-center">
    <button 
      onClick={() => { stopWebcam(); }} 
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        !useWebcam 
          ? 'bg-primary text-on-primary shadow-md' 
          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="material-symbols-outlined">upload_file</span>
        Upload File
      </span>
    </button>
    <button 
      onClick={startWebcam} 
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        useWebcam 
          ? 'bg-primary text-on-primary shadow-md' 
          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="material-symbols-outlined">photo_camera</span>
        Use Camera
      </span>
    </button>
  </div>

  {useWebcam ? (
    <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-[4/3] flex flex-col items-center justify-center border border-outline-variant/30 shadow-inner">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 flex gap-4">
        <button 
          onClick={captureSnapshot} 
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">center_focus_strong</span>
          Capture Snapshot
        </button>
        <button 
          onClick={stopWebcam} 
          className="bg-surface/80 text-on-surface px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-surface hover:text-red-600 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">close</span>
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="relative group">
      <input accept="image/png,image/jpeg,image/webp" className="hidden" id="photo-upload" type="file" onChange={handlePhotoUpload}/>
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group-hover:border-primary" htmlFor="photo-upload">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-md shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-on-primary-container text-[32px]">add_a_photo</span>
          </div>
          <p className="font-headline-sm text-headline-sm text-primary mb-xs">Upload Classroom Photo</p>
          <p className="font-body-md text-body-md text-on-surface-variant">PNG, JPG or WEBP (Max 10MB)</p>
        </div>
      </label>
    </div>
  )}

  {selectedPhoto ? (
    <div className="mt-sm p-3 bg-primary-container/20 rounded-lg border border-primary/20 flex items-center justify-between">
      <p className="font-body-md text-body-md text-primary font-medium flex items-center gap-2">
        <span className="material-symbols-outlined">check_circle</span>
        Selected: {selectedPhoto.name} ({Math.round(selectedPhoto.size / 1024)} KB)
      </p>
      <button onClick={() => setSelectedPhoto(null)} className="text-outline hover:text-red-600 transition-colors">
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  ) : null}
  {errorMessage ? <p className="mt-sm font-body-md text-body-md text-error flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">error_outline</span>{errorMessage}</p> : null}
{/*  Secondary Info  */}
<div className="mt-lg p-md bg-surface-container-high rounded-lg flex items-start gap-md border border-outline-variant/20">
<span className="material-symbols-outlined text-primary-container">info</span>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        The AI engine will automatically scan the photo for student faces and cross-reference them with the <span className="text-primary font-bold">Section A</span> roster. You will be able to manually correct any discrepancies before final submission.
                    </p>
</div>
</div>
{/*  CTA Actions  */}
<div className="md:col-span-12 flex flex-col md:flex-row gap-md items-center justify-end mt-base">
<button className="w-full md:w-auto px-xl py-3 rounded-lg font-label-lg text-label-lg text-primary border border-primary hover:bg-primary/5 transition-colors active:scale-95">
                    VIEW STUDENT ROSTER
                </button>
<button className="w-full md:w-auto px-xl py-3 rounded-lg font-label-lg text-label-lg bg-primary text-on-primary shadow-md hover:shadow-lg transition-all active:scale-95 uppercase font-bold tracking-widest disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleProceedToScan} disabled={!selectedPhoto}>
                    PROCEED TO SCAN
                </button>
</div>
</div>
</main>
    </>
  );
};

export default TakeAttendance;
