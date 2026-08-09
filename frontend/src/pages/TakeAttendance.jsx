import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const TakeAttendance = () => {
  const navigate = useNavigate();
  const setSelectedClass = useStore((state) => state.setSelectedClass);
  const setAttendanceSession = useStore((state) => state.setAttendanceSession);
  const [selectedClassForm, setSelectedClassForm] = useState({
    department: '',
    year: '',
    section: '',
    subject: '',
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClassChange = (event) => {
    const { name, value } = event.target;
    setSelectedClassForm((prev) => ({ ...prev, [name]: value }));
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
      setErrorMessage('Please select department, year, section, and subject.');
      return;
    }

    if (!selectedPhoto) {
      setErrorMessage('Please upload a classroom photo before scanning.');
      return;
    }

    setSelectedClass(selectedClassForm);
    setAttendanceSession({
      uploadedImage: selectedPhoto,
      date: new Date().toISOString(),
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
<option value="cs">Comp. Science</option>
<option value="ee">Electrical Eng.</option>
<option value="me">Mechanical Eng.</option>
<option value="ce">Civil Eng.</option>
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
<select className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" name="subject" value={selectedClassForm.subject} onChange={handleClassChange}>
<option disabled value="">Select Subject</option>
<option value="ai">Advanced AI</option>
<option value="dm">Discrete Math</option>
<option value="os">Operating Systems</option>
<option value="ds">Data Structures</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
</div>
</div>
{/*  Upload Action Section  */}
<div className="md:col-span-12">
<div className="relative group">
<input accept="image/png,image/jpeg,image/webp" className="hidden" id="photo-upload" type="file" onChange={handlePhotoUpload}/>
<label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group-hover:border-primary" htmlFor="photo-upload">
<div className="flex flex-col items-center justify-center pt-5 pb-6">
<div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-md shadow-lg group-hover:scale-110 transition-transform duration-300">
<span className="material-symbols-outlined text-on-primary-container text-[32px]" data-icon="add_a_photo">add_a_photo</span>
</div>
<p className="font-headline-sm text-headline-sm text-primary mb-xs">Upload Classroom Photo</p>
<p className="font-body-md text-body-md text-on-surface-variant">PNG, JPG or WEBP (Max 10MB)</p>
</div>
</label>
</div>
{selectedPhoto ? <p className="mt-sm font-body-md text-body-md text-primary">Selected: {selectedPhoto.name}</p> : null}
{errorMessage ? <p className="mt-sm font-body-md text-body-md text-error">{errorMessage}</p> : null}
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
{/*  Navigation Components Logic  */}
{/*  BottomNavBar (Mobile Only)  */}
<nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface px-base py-sm pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.04)] h-16">
<div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1 transition-all active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span className="font-label-lg text-label-lg">Home</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all hover:bg-surface-container-low active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="school">school</span>
<span className="font-label-lg text-label-lg">Classes</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all hover:bg-surface-container-low active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-label-lg text-label-lg">History</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all hover:bg-surface-container-low active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-lg text-label-lg">Profile</span>
</div>
</nav>
{/*  Side Navigation (Desktop Hint)  */}
<aside className="hidden md:flex fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-surface-container-lowest border-r border-surface-container flex-col py-lg px-md gap-sm">
<div className="flex items-center gap-md px-4 py-3 bg-primary-container text-on-primary-container font-bold rounded-lg mx-2 transition-all duration-200">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-body-md text-body-md">Dashboard</span>
</div>
<div className="flex items-center gap-md px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-lg mx-2 transition-all duration-200">
<span className="material-symbols-outlined" data-icon="event_note">event_note</span>
<span className="font-body-md text-body-md">Attendance Log</span>
</div>
<div className="flex items-center gap-md px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-lg mx-2 transition-all duration-200">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="font-body-md text-body-md">Student Roster</span>
</div>
<div className="flex items-center gap-md px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-lg mx-2 transition-all duration-200">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-body-md text-body-md">Settings</span>
</div>
<div className="mt-auto flex items-center gap-md px-4 py-3 text-error hover:bg-error-container/20 rounded-lg mx-2 transition-all duration-200">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-body-md text-body-md">Logout</span>
</div>
</aside>


    </>
  );
};

export default TakeAttendance;
