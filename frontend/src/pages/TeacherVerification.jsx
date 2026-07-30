import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const TeacherVerification = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      
{/*  TopAppBar  */}
<header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-14 bg-surface shadow-sm transition-colors duration-200">
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-primary transition-colors duration-200 active:scale-95 hover:bg-surface-variant/50 p-2 rounded-full">arrow_back</button>
<h1 className="font-title-lg text-title-lg text-primary">Verify Attendance</h1>
</div>
<div className="flex items-center gap-2">
<button className="material-symbols-outlined text-primary transition-colors duration-200 active:scale-95 hover:bg-surface-variant/50 p-2 rounded-full">more_vert</button>
</div>
</header>
<main className="pt-20 px-margin-mobile max-w-2xl mx-auto">
{/*  Header Text Section  */}
<section className="mb-lg">
<h2 className="font-headline-md text-headline-md text-on-surface">Verify Absent Students</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Confirm attendance for students not detected by AI during scanning.</p>
</section>
{/*  Student List  */}
<div className="space-y-md">
{/*  Student Card 1: Pending  */}
<div className="attendance-card bg-surface-container-lowest rounded-xl p-md flex flex-col gap-md border border-outline-variant/30">
<div className="flex items-start gap-md">
<div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a young male student with glasses, smiling gently, against a neutral light grey academic background. High-quality studio lighting, sharp focus on facial features, representing a modern university profile picture. Clean, minimalist aesthetic consistent with academic software." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbepjmzj6uC7USLRrD95NNTMjXR2M1kFRADbyLuTC9T65i5R06KN_-SNFCsbiWFyYQl4uYOPO-qF6wDdFXWduDAN7v8FDUyAEadh5N3jTBgRy0XYqz0ck7JtTNoERHoQHpUODq_QEnBDPGIkoHhSY3oFS6IXXywVrXPDwXR0-H3FFO0TQDCjnqef0JrcTtLDcoHzgCnyjuFMlJAAxwLMkz2iq-lrJBYils63-IQ6-QBGo129PZ7moLlQ"/>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<h3 className="font-title-lg text-title-lg text-on-surface">Chen Wei</h3>
<span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI not detected</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Reg No: 2023EE08</p>
</div>
</div>
<div className="grid grid-cols-2 gap-md pt-2">
<button className="border border-primary text-primary font-label-lg text-label-lg py-2.5 rounded-lg active:scale-95 transition-all hover:bg-primary/5 uppercase">Mark Present</button>
<button className="border border-error text-error font-label-lg text-label-lg py-2.5 rounded-lg active:scale-95 transition-all hover:bg-error/5 uppercase">Mark Absent</button>
</div>
</div>
{/*  Student Card 2: Edited State  */}
<div className="attendance-card bg-surface-container-lowest rounded-xl p-md flex flex-col gap-md border-2 border-primary/20 relative">
<div className="absolute -top-3 right-4">
<span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-amber-200">
<span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                        Edited by Teacher
                    </span>
</div>
<div className="flex items-start gap-md">
<div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="A close-up studio portrait of a female college student with dark hair tied back, looking directly at the camera with a confident expression. Soft natural lighting, professional academic setting background. Crisp details and neutral tones to match the Material Design interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5LJb-6YWQS5VwC8mNZu7XiLvmLdZrsElY4tDjQUz4R-8y91GRPEimbNk2_6yeSMSNu7cDcwhut_i-T0rLxRLN_i58jpBeAPQDol-BMwSOMDTnB9m9I4xzmGh-MZYGpXLKIR-nOu8gS-Pa_DEAyK6PeUyI3xexx4WgUtT6Vvd9f-xn44q7Ysvcgo7oKE76gh492vVAsbeiXL1DMdADDLk5x80Rv-aObyRDrF9oR-9F8RMFeseRpNYtfg"/>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<h3 className="font-title-lg text-title-lg text-on-surface">Amina Khalid</h3>
<span className="bg-error-container/50 text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase opacity-50">AI not detected</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Reg No: 2023CS42</p>
</div>
</div>
<div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1 border border-outline-variant/20">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Original AI: <span className="text-error font-bold">Absent</span></span>
<span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_forward</span>
<span className="font-label-md text-label-md text-on-surface-variant">Final: <span className="text-emerald-600 font-bold">Present</span></span>
</div>
</div>
<div className="grid grid-cols-1 pt-1">
<button className="bg-emerald-600 text-white font-label-lg text-label-lg py-2.5 rounded-lg flex items-center justify-center gap-2 uppercase tracking-wide">
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Present
                    </button>
</div>
</div>
{/*  Student Card 3: Pending  */}
<div className="attendance-card bg-surface-container-lowest rounded-xl p-md flex flex-col gap-md border border-outline-variant/30">
<div className="flex items-start gap-md">
<div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a young adult male student with a bright smile, wearing a simple blue polo shirt. The lighting is bright and even, highlighting facial features clearly for identification. Minimalist, modern campus photography style used in university administrative apps." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAro-SCmi1bPMe9Y8TPfoxjvUXUMrNY770sOpK-rIosnlxXzx5TyLYuzvZm_52SpFFtgGuf8W7KOJ3Q58Z48H33A2Udpdo0sBWRxxuNWl5QcXmQmjS0PvZk9q0kvYe4okG1AD4cvLY57qybFSLDzHpAoZ5GQlETjrlfdF-HaYO-DfOdZG5AntNrVeZkVQNhoHZ5AUac27L_wEBKZkIqfIPaP2jcZPQOXkbtZsxzLj5qlHCDmrm4zEy8jQ"/>
</div>
<div className="flex-grow">
<div className="flex justify-between items-start">
<h3 className="font-title-lg text-title-lg text-on-surface">James Wilson</h3>
<span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI not detected</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Reg No: 2023ME15</p>
</div>
</div>
<div className="grid grid-cols-2 gap-md pt-2">
<button className="border border-primary text-primary font-label-lg text-label-lg py-2.5 rounded-lg active:scale-95 transition-all hover:bg-primary/5 uppercase">Mark Present</button>
<button className="border border-error text-error font-label-lg text-label-lg py-2.5 rounded-lg active:scale-95 transition-all hover:bg-error/5 uppercase">Mark Absent</button>
</div>
</div>
{/*  Final Attendance Summary Card  */}
<div className="bg-surface-container-high rounded-xl p-lg mt-xl shadow-inner">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>assessment</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Attendance Summary</h3>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">Total Students</p>
<p className="font-headline-md text-headline-md text-on-surface">45</p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">AI Detected</p>
<p className="font-headline-md text-headline-md text-primary">42</p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">Teacher Verified</p>
<p className="font-headline-md text-headline-md text-amber-600">1</p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">Final Present</p>
<p className="font-headline-md text-headline-md text-emerald-600">43</p>
</div>
<div className="col-span-2 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 flex justify-between items-center">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">Final Absent</p>
<p className="font-headline-md text-headline-md text-error">2</p>
</div>
</div>
</div>
</div>
</main>
{/*  Bottom Actions Container  */}
<div className="fixed bottom-0 left-0 w-full bg-surface p-margin-mobile shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex flex-col gap-3 z-40">
<button className="w-full bg-primary text-white font-title-lg text-title-lg py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3">
<span className="material-symbols-outlined">save</span>
            SAVE ATTENDANCE
        </button>
</div>
{/*  BottomNavBar  */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-2 pt-1 bg-surface-container shadow-md md:hidden">
<a className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all duration-200 active:scale-90 hover:text-primary" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</a>
<a className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1 transition-all duration-200 active:scale-90" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
<span className="font-label-md text-label-md">Roster</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all duration-200 active:scale-90 hover:text-primary" href="#">
<span className="material-symbols-outlined">assessment</span>
<span className="font-label-md text-label-md">Reports</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all duration-200 active:scale-90 hover:text-primary" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</a>
</nav>


    </>
  );
};

export default TeacherVerification;
