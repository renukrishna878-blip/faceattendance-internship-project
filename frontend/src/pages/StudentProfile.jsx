import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const StudentProfile = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      
{/*  TopAppBar  */}
<nav className="fixed top-0 w-full z-50 bg-surface dark:bg-surface-container-low shadow-sm dark:shadow-none flex items-center justify-between px-margin-mobile h-14 w-full">
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80 transition-opacity">
<span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">arrow_back</span>
</button>
<h1 className="font-title-lg text-title-lg text-primary dark:text-primary-fixed-dim">Student Profile</h1>
</div>
<button className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80 transition-opacity">
<span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">more_vert</span>
</button>
</nav>
<main className="pt-20 pb-32 px-margin-mobile md:px-margin-tablet max-w-4xl mx-auto">
{/*  Profile Header Section  */}
<section className="bg-surface-container-lowest rounded-xl p-lg card-elevation mb-lg flex flex-col md:flex-row items-center md:items-start gap-lg text-center md:text-left">
<div className="relative">
<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10">
<img className="w-full h-full object-cover" data-alt="A clean, professional headshot of a university student named Alex Thompson. He is wearing a light gray academic polo shirt, standing against a soft-focus campus background. The lighting is bright and even, reflecting an organized academic environment with a warm, modern corporate photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS_C9b4tCdxPCc-Ys6VeIEtGzfZlRCBTtG15fvlk7BxdfgfPDNxmupt2FQqTb2ZLzm3IBZX1_7MWIELbJGz2D32LXHQXdyiLagyx-Y-WliFZHfUQ-LopAS6p4ygPR_fH1hLinmv1DPdFWp-SoJNd6baFG5I7X36ND6qV5WT9Fe8sEtDFj553UIl7ArUjMhRtLZZza1kJ0UcFHgIOdEJtsI-EZA5NpzUHBXh3kjI8V4A640-tRLGxMXPg"/>
</div>
<div className="absolute bottom-1 right-1 bg-primary text-on-primary p-1.5 rounded-full shadow-lg">
<span className="material-symbols-outlined text-[18px]">verified</span>
</div>
</div>
<div className="flex-1 space-y-2">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Alex Thompson</h2>
<div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center md:items-start text-on-surface-variant font-body-md text-body-md">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px]">badge</span>
<span>ID: 2024CS089</span>
</div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px]">account_balance</span>
<span>Computer Science</span>
</div>
</div>
<div className="pt-2">
<span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-lg text-label-lg uppercase tracking-wider">Active Enrollment</span>
</div>
</div>
</section>
{/*  Metrics Grid Section  */}
<section className="mb-lg">
<h3 className="font-headline-sm text-headline-sm mb-md px-1">Attendance Performance</h3>
<div className="grid grid-cols-2 md:grid-cols-4 gap-md">
{/*  Attendance Percentage (Warning)  */}
<div className="bg-error-container/20 border border-error/10 rounded-lg p-md card-elevation flex flex-col items-center justify-center text-center">
<span className="font-label-md text-label-md text-error mb-1 uppercase">Attendance</span>
<div className="font-headline-md text-headline-md text-error">64%</div>
<div className="flex items-center gap-1 text-error text-[12px] mt-1">
<span className="material-symbols-outlined text-[14px]">warning</span>
<span className="font-medium">Below Target</span>
</div>
</div>
{/*  Total Classes  */}
<div className="bg-surface-container-lowest rounded-lg p-md card-elevation flex flex-col items-center justify-center text-center">
<span className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase">Total Sessions</span>
<div className="font-headline-md text-headline-md text-primary">45</div>
</div>
{/*  Present  */}
<div className="bg-surface-container-lowest rounded-lg p-md card-elevation flex flex-col items-center justify-center text-center border-b-4 border-emerald-500">
<span className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase">Present</span>
<div className="font-headline-md text-headline-md text-on-surface">29</div>
</div>
{/*  Absent  */}
<div className="bg-surface-container-lowest rounded-lg p-md card-elevation flex flex-col items-center justify-center text-center border-b-4 border-error">
<span className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase">Absent</span>
<div className="font-headline-md text-headline-md text-on-surface">16</div>
</div>
</div>
</section>
{/*  Biometric Data Section  */}
<section className="mb-xl">
<div className="flex items-center justify-between mb-md px-1">
<h3 className="font-headline-sm text-headline-sm">Stored Face Recognition Data</h3>
<span className="material-symbols-outlined text-outline">info</span>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-md">
<div className="group relative bg-surface-container rounded-xl overflow-hidden aspect-square card-elevation cursor-pointer transition-transform hover:scale-[1.02]">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Close up face biometric sample: Front angle. The lighting is neutral and studio-like, emphasizing facial features for identification. Part of a professional security system UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-SMrguCop8wqw9d6z60DerBo74Jj-SbCREbBJkQmkh66xahO2ktqYoC8eWIqJnliOsutalWI39yag6OFQtsmbb168n_VTJYhOUZgCMCOd68Y9YxAsssyKoXWebwD2vbvSPe2Hs_oXc8YPRX44hKnhYQVUbBkTd5OgOGtzJZ95HLuo0U2-qJ5tgfJZipAoPmMPUXh4ckb_-DoCSLf6VvIo7SVnIsdR33ZU9o62Wu7CSb-7UN2wx9wqCw"/>
<div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
<p className="text-white font-label-md text-label-md text-center">FRONT</p>
</div>
</div>
<div className="group relative bg-surface-container rounded-xl overflow-hidden aspect-square card-elevation cursor-pointer transition-transform hover:scale-[1.02]">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Close up face biometric sample: Left profile angle. High-clarity digital image used for identity verification in an academic attendance system. Soft shadows and professional lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk6Tu1IRgahn-lxQ8q9z-u-EsJp6x2QW6oy47V6_LRvxeXgBitArqP-gvNnG6lMTWtmCN9AWNv6t9IhkJenZF93rdynid1gecKLYSXxNQ7Lwukt5tZP0sBlMpu-LnuupQnTHGNE53VEvUvIjnJ2816QbqrSJe5udpapMxUBGylOuugub8Kl5ATUep_dfAhfHCDGJDcLi_HaEUgbgg8OjwkZ3VTEiuRtxbgqOOVVzkpMl6mQ0MZpExWSQ"/>
<div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
<p className="text-white font-label-md text-label-md text-center">LEFT</p>
</div>
</div>
<div className="group relative bg-surface-container rounded-xl overflow-hidden aspect-square card-elevation cursor-pointer transition-transform hover:scale-[1.02]">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Close up face biometric sample: Right profile angle. Sharp focus on facial contouring for 3D reconstruction algorithms. Modern lighting style with a clean white background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhIen0QAFxfDaDlX2tRMoAD5pNt8gVABH8eabE8n6MtSWyTKG1qpPvBSI1-pFFmmqXlUvjpb7Q22OWfv4a3vhI3pIR71HCHH0_PncYNmjbI68boEHkFNYVr6n-f1oIDC4IXIxFjPzLyzmuej955rUAapXXmSHyIY8pR0hTEL5WabxFvDQSOD5yXQxkSzsqHRg1zyvpflO4d0bzo599CxCvwa5Mhn7e_N6FDjlvcv0UVODTXfkgW_FGqQ"/>
<div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
<p className="text-white font-label-md text-label-md text-center">RIGHT</p>
</div>
</div>
<div className="group relative bg-surface-container rounded-xl overflow-hidden aspect-square card-elevation cursor-pointer transition-transform hover:scale-[1.02]">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" data-alt="Close up face biometric sample: Smiling expression. Captured for dynamic recognition testing. Warm, bright light-mode aesthetic with clean lines and high definition." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC11L57GjysCI4BowezEIXrr0zEkcCCf1O0XGf-pJiy3nKRrhWfyVU2B3AIMYGCrJAF5BdBYfb4xX-lhs6V3u5JBo_ZmY48uksaBPkkB9pGiMBKNJRkz2sCR-0JnUN5XKi9SPFGUv6aVYnR_xwB1_le5-X8KmEr3Fik-8RkNH00Fdhsx8fcxAYvGp0HQl8xL2K5u3EyZIlQeGkVLT4iFAhJ-xplXVhTW6765vjnS1WIe8MoiTyguWdNtQ"/>
<div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
<p className="text-white font-label-md text-label-md text-center">SMILING</p>
</div>
</div>
</div>
</section>
{/*  Action Buttons  */}
<section className="flex flex-col sm:flex-row gap-md">
<button className="flex-1 bg-primary text-on-primary py-4 rounded-xl active-state transition-all hover:brightness-110 flex items-center justify-center gap-2 font-body-lg text-body-lg uppercase tracking-wide">
<span className="material-symbols-outlined">edit</span>
                Edit Profile
            </button>
<button className="flex-1 bg-surface-container-lowest text-error border-2 border-error py-4 rounded-xl hover:bg-error-container/10 transition-colors flex items-center justify-center gap-2 font-body-lg text-body-lg uppercase tracking-wide">
<span className="material-symbols-outlined">delete</span>
                Delete Student
            </button>
</section>
</main>
{/*  Bottom Navigation  */}
<nav className="fixed bottom-0 left-0 w-full bg-surface dark:bg-inverse-surface shadow-[0_-1px_4px_0_rgba(0,0,0,0.04)] flex justify-around items-center h-20 px-2 pb-safe z-50">
<button className="flex flex-col items-center justify-center text-on-surface-variant dark:text-tertiary-fixed-dim px-4 py-1 hover:bg-surface-variant/50 transition-colors" onClick={() => navigate('/dashboard')}>
<span className="material-symbols-outlined">home</span>
<span className="font-label-md text-label-md mt-1">Home</span>
</button>
<button className="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary-fixed-dim text-on-secondary-container dark:text-on-secondary-fixed-variant rounded-full px-4 py-1 active:scale-95 transition-transform duration-150" onClick={() => navigate('/students')}>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
<span className="font-label-md text-label-md mt-1">Students</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant dark:text-tertiary-fixed-dim px-4 py-1 hover:bg-surface-variant/50 transition-colors" onClick={() => navigate('/reports')}>
<span className="material-symbols-outlined">assessment</span>
<span className="font-label-md text-label-md mt-1">Reports</span>
</button>
</nav>
{/*  JavaScript for micro-interactions  */}


    </>
  );
};

export default StudentProfile;
