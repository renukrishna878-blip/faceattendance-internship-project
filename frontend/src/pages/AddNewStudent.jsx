import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AddNewStudent = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      
{/*  TopAppBar  */}
<header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-14 bg-surface shadow-sm">
<div className="flex items-center gap-md">
<button className="p-base active:scale-95 duration-150 ease-in-out hover:bg-surface-container-high transition-colors rounded-full">
<span className="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 className="font-headline-sm text-headline-sm font-bold text-primary">Add New Student</h1>
</div>
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="A professional portrait of a university professor in a bright modern office setting. The lighting is soft and natural, emphasizing a professional and welcoming atmosphere. The overall style is clean and high-definition, consistent with a professional faculty management system dashboard." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHYMuhFejRUWOaNYFAnM2DxIrtAcfion1XAnPskaU-s7lSUrvLe39gO1N1orC-XcPOC-LUzBQjJdoMPbfF9Vst58uXwMF0T4ztA25W3CU8cqsSvEcYsJifggwkLVFSnKouJ1v0BxAqDWl-Igk4WlPebBLJtVOaXO8C7_40kqNhF5UkrlGFb2PZ-KbnPIMgfZNTvr8uDUf6BjUY-yqcFxxXMwrsnrO9QqPRNjLqDB2uWARq-M8tKqd6nQ"/>
</div>
</header>
<main className="pt-20 pb-28 px-margin-mobile max-w-4xl mx-auto">
{/*  Identity Form Section  */}
<section className="mb-lg">
<div className="flex items-center gap-base mb-md">
<span className="material-symbols-outlined text-primary">badge</span>
<h2 className="font-title-lg text-title-lg text-on-surface">Student Information</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-md bg-surface-container-lowest p-lg rounded-xl custom-shadow">
{/*  Name  */}
<div className="relative flex flex-col group">
<label className="font-label-md text-label-md text-outline mb-xs transition-all">Full Name</label>
<input className="w-full h-12 bg-transparent border border-outline rounded-lg px-md font-body-md text-body-md focus:border-primary focus:ring-0 outline-none" placeholder="e.g. John Doe" type="text"/>
</div>
{/*  Register Number  */}
<div className="relative flex flex-col group">
<label className="font-label-md text-label-md text-outline mb-xs transition-all">Register Number</label>
<input className="w-full h-12 bg-transparent border border-outline rounded-lg px-md font-body-md text-body-md focus:border-primary focus:ring-0 outline-none" placeholder="e.g. 2024CS101" type="text"/>
</div>
{/*  Department  */}
<div className="relative flex flex-col group">
<label className="font-label-md text-label-md text-outline mb-xs transition-all">Department</label>
<select className="w-full h-12 bg-transparent border border-outline rounded-lg px-md font-body-md text-body-md focus:border-primary focus:ring-0 outline-none appearance-none">
<option>Computer Science &amp; Engineering</option>
<option>Information Technology</option>
<option>Mechanical Engineering</option>
<option>Business Administration</option>
</select>
<span className="material-symbols-outlined absolute right-md bottom-3 text-outline pointer-events-none">expand_more</span>
</div>
{/*  Section & Year  */}
<div className="grid grid-cols-2 gap-md">
<div className="relative flex flex-col group">
<label className="font-label-md text-label-md text-outline mb-xs transition-all">Section</label>
<input className="w-full h-12 bg-transparent border border-outline rounded-lg px-md font-body-md text-body-md focus:border-primary focus:ring-0 outline-none" placeholder="A" type="text"/>
</div>
<div className="relative flex flex-col group">
<label className="font-label-md text-label-md text-outline mb-xs transition-all">Year</label>
<select className="w-full h-12 bg-transparent border border-outline rounded-lg px-md font-body-md text-body-md focus:border-primary focus:ring-0 outline-none appearance-none">
<option>1st Year</option>
<option>2nd Year</option>
<option>3rd Year</option>
<option>4th Year</option>
</select>
<span className="material-symbols-outlined absolute right-md bottom-3 text-outline pointer-events-none">expand_more</span>
</div>
</div>
</div>
</section>
{/*  Biometric Enrollment Section  */}
<section className="mb-lg">
<div className="flex items-center gap-base mb-md">
<span className="material-symbols-outlined text-primary">drafts</span>
<h2 className="font-title-lg text-title-lg text-on-surface">Biometric Enrollment</h2>
</div>
<div className="bg-surface-container-lowest p-lg rounded-xl custom-shadow">
<p className="font-body-md text-body-md text-on-surface-variant mb-lg">Capture or upload four specific facial angles to ensure high accuracy for the facial recognition system.</p>
<div className="grid grid-cols-2 md:grid-cols-4 gap-md">
{/*  Front Face  */}
<div className="flex flex-col items-center gap-sm">
<div className="relative w-full aspect-square bg-surface-container rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-4xl">add_a_photo</span>
<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="font-label-lg text-label-lg text-on-surface-variant font-bold">Front Face</span>
</div>
{/*  Left Side  */}
<div className="flex flex-col items-center gap-sm">
<div className="relative w-full aspect-square bg-surface-container rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-4xl">add_a_photo</span>
<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="font-label-lg text-label-lg text-on-surface-variant font-bold">Left Side</span>
</div>
{/*  Right Side  */}
<div className="flex flex-col items-center gap-sm">
<div className="relative w-full aspect-square bg-surface-container rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-4xl">add_a_photo</span>
<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="font-label-lg text-label-lg text-on-surface-variant font-bold">Right Side</span>
</div>
{/*  Smiling Face  */}
<div className="flex flex-col items-center gap-sm">
<div className="relative w-full aspect-square bg-surface-container rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-4xl">add_a_photo</span>
<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="font-label-lg text-label-lg text-on-surface-variant font-bold">Smiling Face</span>
</div>
</div>
{/*  Gallery Preview Area  */}
<div className="mt-xl pt-lg border-t border-outline-variant">
<h3 className="font-label-lg text-label-lg text-outline uppercase tracking-widest mb-md">Enrollment Queue</h3>
<div className="flex flex-wrap gap-md">
{/*  Example Thumbnails (Empty State)  */}
<div className="w-16 h-16 rounded-lg bg-surface-variant flex items-center justify-center relative overflow-hidden group">
<img className="w-full h-full object-cover opacity-40" data-alt="A small, sharp thumbnail of a young student's front face profile shot for biometric enrollment. The background is neutral grey, and the lighting is even and flat to capture features clearly. The image is framed as a tight headshot." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF4tzACnJG6q2cl6RGb0-EZE70gInen2q1j8vKHoDfz7kqDYkzSM-NyAdkwfTBvRwAaRbrl1iH3SVT2gJjYpcdig031R2KnL9LEXHiI5Q5OXHDlDfhpBHeDY8v6TVRp0YyQWWUtriCH6qCkAIEk7haA0wsDbiA59DBy69RiUdTrIY8PnCeeT14qzvKi-BsHl_qOVM9LvSdfgkk5F5uwZBoq3C6O9oi1JQIeUmeJ9D2B6fdQFfGF5wcFQ"/>
<div className="absolute inset-0 flex items-center justify-center bg-black/20">
<span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
</div>
{/*  Placeholder for pending uploads  */}
<div className="w-16 h-16 rounded-lg border border-outline-variant border-dotted flex items-center justify-center text-outline-variant">
<span className="material-symbols-outlined text-xs">hourglass_empty</span>
</div>
<div className="w-16 h-16 rounded-lg border border-outline-variant border-dotted flex items-center justify-center text-outline-variant">
<span className="material-symbols-outlined text-xs">hourglass_empty</span>
</div>
<div className="w-16 h-16 rounded-lg border border-outline-variant border-dotted flex items-center justify-center text-outline-variant">
<span className="material-symbols-outlined text-xs">hourglass_empty</span>
</div>
</div>
</div>
</div>
</section>
{/*  Terms / Notice  */}
<div className="px-md mb-xl flex gap-sm items-start">
<span className="material-symbols-outlined text-outline text-body-lg">info</span>
<p className="font-body-md text-body-md text-on-surface-variant">By saving, you confirm that this biometric data is being processed in compliance with the institution's privacy policy for attendance tracking purposes only.</p>
</div>
</main>
{/*  Bottom Action Bar  */}
<div className="bg-white p-md border-t border-outline-variant md:flex md:justify-center mt-6">
<div className="max-w-4xl w-full flex flex-col md:flex-row gap-md">
<button className="flex-1 h-12 bg-primary text-white font-title-lg text-title-lg rounded-full flex items-center justify-center gap-sm active:scale-95 transition-all shadow-lg hover:bg-surface-tint">
<span className="material-symbols-outlined">save</span>
                Save Student
            </button>
<button className="flex-none h-12 px-xl border border-outline text-primary font-title-lg text-title-lg rounded-full flex items-center justify-center active:scale-95 transition-all md:order-first">
                Cancel
            </button>
</div>
</div>
{/*  Success Modal (Hidden by default)  */}
<div className="hidden fixed inset-0 z-[100] flex items-center justify-center p-md" id="successModal">
<div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
<div className="relative bg-surface-container-lowest p-xl rounded-2xl max-w-sm w-full text-center shadow-2xl scale-95 transition-transform duration-300">
<div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-lg">
<span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Student Enrolled</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-xl">Student profile and biometric data have been successfully added to the system.</p>
<button className="w-full h-12 bg-primary text-white rounded-full font-title-lg transition-all active:scale-95" onclick="toggleModal()">Done</button>
</div>
</div>


    </>
  );
};

export default AddNewStudent;
