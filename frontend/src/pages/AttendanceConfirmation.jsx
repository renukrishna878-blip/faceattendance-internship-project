import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AttendanceConfirmation = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      
{/*  TopAppBar  */}
<header className="bg-surface sticky top-0 left-0 w-full z-50 shadow-sm flex items-center justify-between px-md h-14">
<div className="flex items-center gap-4">
<button className="active:scale-95 transition-transform p-2 rounded-full hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 className="font-title-lg text-title-lg text-primary">Attendance Confirmation</h1>
</div>
<button className="active:scale-95 transition-transform p-2 rounded-full hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-primary">more_vert</span>
</button>
</header>
<main className="max-w-3xl mx-auto px-md pt-6">
{/*  Success Animation Container  */}
<section className="relative w-full aspect-video md:aspect-[21/9] flex flex-col items-center justify-center overflow-hidden rounded-xl mb-lg">
{/*  STITCH_THREEJS_START:ANIMATION_15 className="absolute inset-0 w-full h-full"  */}
<div className="absolute inset-0 w-full h-full" >

<div id="threejs-container-ANIMATION_15" ></div>

</div>
{/*  STITCH_THREEJS_END:ANIMATION_15  */}
<div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
<div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-4 shadow-lg">
<span className="material-symbols-outlined text-on-primary-container text-5xl" >check</span>
</div>
<h2 className="font-headline-md text-headline-md text-center text-primary mb-1">Session Completed Successfully!</h2>
<p className="font-body-md text-body-md text-on-surface-variant">The final roster has been verified.</p>
</div>
</section>
{/*  Class Information Card  */}
<section className="bg-surface-container-lowest rounded-xl p-md shadow-sm mb-md border border-outline-variant/20">
<div className="flex items-start justify-between">
<div>
<span className="font-label-md text-label-md text-primary uppercase tracking-wider mb-1 block">Course Name</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Advanced AI</h3>
<div className="space-y-3">
<div className="flex items-center gap-3 text-on-surface-variant">
<span className="material-symbols-outlined text-primary">calendar_today</span>
<span className="font-body-md text-body-md">Oct 24, 2023</span>
</div>
<div className="flex items-center gap-3 text-on-surface-variant">
<span className="material-symbols-outlined text-primary">schedule</span>
<span className="font-body-md text-body-md">10:00 AM - 11:30 AM</span>
</div>
</div>
</div>
<div className="hidden sm:block">
<div className="w-32 h-32 rounded-lg bg-cover bg-center shadow-sm" data-alt="A macro photograph of a sleek, modern architectural building with clean glass lines and blue sky reflections, representing an academic environment. The lighting is crisp and midday, creating sharp contrasts and a professional, organized atmosphere. The style is minimalist corporate photography with a focus on depth and clarity." ></div>
</div>
</div>
</section>
{/*  Metrics Grid  */}
<section className="grid grid-cols-2 gap-4 mb-xl">
{/*  Total  */}
<div className="bg-surface-container-low p-md rounded-xl flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-on-surface-variant mb-2">groups</span>
<span className="font-headline-md text-headline-md text-on-surface">45</span>
<span className="font-label-md text-label-md text-on-surface-variant">Total Students</span>
</div>
{/*  Present  */}
<div className="bg-primary-fixed p-md rounded-xl flex flex-col items-center justify-center text-center border-b-2 border-primary">
<span className="material-symbols-outlined text-primary mb-2">person_check</span>
<span className="font-headline-md text-headline-md text-primary">43</span>
<span className="font-label-md text-label-md text-primary">Present</span>
</div>
{/*  Absent  */}
<div className="bg-error-container p-md rounded-xl flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-on-error-container mb-2">person_off</span>
<span className="font-headline-md text-headline-md text-on-error-container">2</span>
<span className="font-label-md text-label-md text-on-error-container">Absent</span>
</div>
{/*  Corrections  */}
<div className="bg-secondary-container p-md rounded-xl flex flex-col items-center justify-center text-center border-l-4 border-primary">
<span className="material-symbols-outlined text-on-secondary-container mb-2">edit_square</span>
<span className="font-headline-md text-headline-md text-on-secondary-container">1</span>
<span className="font-label-md text-label-md text-on-secondary-container">Teacher Correction</span>
</div>
</section>
{/*  Action Buttons  */}
<section className="space-y-4">
<button className="w-full bg-primary-container text-on-primary-container py-4 px-6 rounded-full font-headline-sm text-headline-sm shadow-md active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2">
<span className="material-symbols-outlined">save</span>
                Save &amp; Finish Attendance
            </button>
<div className="grid grid-cols-2 gap-4">
<button className="flex items-center justify-center gap-2 border border-outline py-3 px-4 rounded-xl font-title-lg text-title-lg text-on-surface-variant hover:bg-surface-variant active:scale-95 transition-all">
<span className="material-symbols-outlined">picture_as_pdf</span>
                    Export PDF
                </button>
<button className="flex items-center justify-center gap-2 border border-outline py-3 px-4 rounded-xl font-title-lg text-title-lg text-on-surface-variant hover:bg-surface-variant active:scale-95 transition-all">
<span className="material-symbols-outlined">share</span>
                    Share Report
                </button>
</div>
<div className="text-center pt-4">
<button className="font-title-lg text-title-lg text-primary hover:underline underline-offset-4 decoration-2 decoration-primary-fixed active:scale-95 transition-all inline-flex items-center gap-2">
<span className="material-symbols-outlined">dashboard</span>
                    Return to Dashboard
                </button>
</div>
</section>
</main>
{/*  Bottom Navigation Bar  */}
<nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container flex justify-around items-center h-20 px-base pb-safe shadow-lg">
{/*  Home  */}
<button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant active:scale-90 transition-transform duration-200">
<span className="material-symbols-outlined">home</span>
<span className="font-label-md text-label-md">Home</span>
</button>
{/*  Classes  */}
<button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-200">
<span className="material-symbols-outlined">school</span>
<span className="font-label-md text-label-md">Classes</span>
</button>
{/*  History  */}
<button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant active:scale-90 transition-transform duration-200">
<span className="material-symbols-outlined">history</span>
<span className="font-label-md text-label-md">History</span>
</button>
{/*  Settings  */}
<button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant active:scale-90 transition-transform duration-200">
<span className="material-symbols-outlined">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</button>
</nav>


    </>
  );
};

export default AttendanceConfirmation;
