import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const Reports = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      
{/*  TopAppBar  */}
<header className="w-full top-0 sticky z-40 bg-surface dark:bg-surface-dim shadow-sm flex justify-between items-center px-margin-mobile h-14">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim cursor-pointer active:scale-95 transition-transform" data-icon="account_circle">account_circle</span>
<h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">Attendance Reports</h1>
</div>
<div className="flex items-center">
<button className="p-2 hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors rounded-full active:scale-95">
<span className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant" data-icon="notifications">notifications</span>
</button>
</div>
</header>
<main className="pb-32 px-margin-mobile pt-4 flex flex-col gap-6 max-w-2xl mx-auto">
{/*  Filter Section  */}
<section>
<div className="flex items-center justify-between mb-3">
<h2 className="font-title-lg text-title-lg text-on-surface">Active Filters</h2>
<button className="flex items-center text-primary font-label-lg text-label-lg gap-1">
<span className="material-symbols-outlined text-[18px]" data-icon="filter_list">filter_list</span>
                    Refine
                </button>
</div>
<div className="flex overflow-x-auto no-scrollbar gap-2 -mx-margin-mobile px-margin-mobile pb-2">
{/*  Date Picker Pill  */}
<button className="flex items-center gap-2 bg-surface-container-highest border border-outline-variant px-3 py-2 rounded-lg whitespace-nowrap active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[18px]" data-icon="calendar_today">calendar_today</span>
<span className="font-label-lg text-label-lg">Oct 1 - Oct 31</span>
</button>
{/*  Department Pill  */}
<button className="flex items-center gap-2 bg-surface-container-highest border border-outline-variant px-3 py-2 rounded-lg whitespace-nowrap active:scale-95 transition-transform">
<span className="font-label-lg text-label-lg">Computer Science</span>
<span className="material-symbols-outlined text-[18px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
</button>
{/*  Year/Section Pill  */}
<button className="flex items-center gap-2 bg-surface-container-highest border border-outline-variant px-3 py-2 rounded-lg whitespace-nowrap active:scale-95 transition-transform">
<span className="font-label-lg text-label-lg">3rd Year (B)</span>
<span className="material-symbols-outlined text-[18px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
</button>
{/*  Subject Pill  */}
<button className="flex items-center gap-2 bg-surface-container-highest border border-outline-variant px-3 py-2 rounded-lg whitespace-nowrap active:scale-95 transition-transform">
<span className="font-label-lg text-label-lg">Database Systems</span>
<span className="material-symbols-outlined text-[18px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
</button>
</div>
</section>
{/*  Key Metrics Bento Grid  */}
<section className="grid grid-cols-2 gap-4">
{/*  Main Score Card  */}
<div className="col-span-2 bg-primary-container text-on-primary-container p-6 rounded-xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
{/*  Decorative Circle  */}
<div className="absolute -right-10 -top-10 w-32 h-32 bg-on-primary-container/10 rounded-full"></div>
<p className="font-label-lg text-label-lg uppercase tracking-widest opacity-90 mb-2">Overall Attendance Rate</p>
<div className="flex items-baseline gap-1">
<span className="font-headline-lg text-[48px] leading-none">88</span>
<span className="font-headline-sm text-headline-sm">%</span>
</div>
<p className="font-body-md text-body-md mt-2 opacity-80">+2.4% from last month</p>
</div>
{/*  Count Cards  */}
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.04)] flex flex-col">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-[#2E7D32]" data-icon="check_circle">check_circle</span>
<span className="font-label-lg text-label-lg text-on-surface-variant">Present</span>
</div>
<p className="font-headline-md text-headline-md">1,240</p>
<p className="font-label-md text-label-md text-on-surface-variant">Total instances</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.04)] flex flex-col">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-[#D32F2F]" data-icon="cancel">cancel</span>
<span className="font-label-lg text-label-lg text-on-surface-variant">Absent</span>
</div>
<p className="font-headline-md text-headline-md">160</p>
<p className="font-label-md text-label-md text-on-surface-variant">Total instances</p>
</div>
</section>
{/*  Visualizations  */}
<section className="flex flex-col gap-4">
<h2 className="font-title-lg text-title-lg text-on-surface">Data Visualizations</h2>
{/*  Trends Card  */}
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
<div className="flex justify-between items-center mb-6">
<h3 className="font-label-lg text-label-lg font-bold text-on-surface-variant uppercase">Weekly Trends</h3>
<div className="flex gap-2">
<span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-primary"></span>
                            Attendance
                        </span>
</div>
</div>
{/*  Simulated Bar Chart  */}
<div className="flex items-end justify-between h-32 px-2 gap-2">
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-primary rounded-t-sm h-[65%]"></div>
<span className="font-label-md text-label-md mt-2 text-on-surface-variant">M</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-primary rounded-t-sm h-[70%]"></div>
<span className="font-label-md text-label-md mt-2 text-on-surface-variant">T</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-primary rounded-t-sm h-[85%]"></div>
<span className="font-label-md text-label-md mt-2 text-on-surface-variant">W</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-primary rounded-t-sm h-[40%]"></div>
<span className="font-label-md text-label-md mt-2 text-on-surface-variant">T</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-primary rounded-t-sm h-[75%]"></div>
<span className="font-label-md text-label-md mt-2 text-on-surface-variant">F</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-primary/20 rounded-t-sm h-[10%]"></div>
<span className="font-label-md text-label-md mt-2 text-on-surface-variant">S</span>
</div>
</div>
</div>
{/*  Distribution Card  */}
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm grid grid-cols-2 items-center">
<div className="relative w-32 h-32 mx-auto">
{/*  Fake Pie Chart via CSS Conic Gradient  */}
<div className="w-full h-full rounded-full" ></div>
{/*  Inner hole for donut look  */}
<div className="absolute inset-4 bg-surface-container-lowest rounded-full flex items-center justify-center">
<span className="font-bold text-primary">88%</span>
</div>
</div>
<div className="flex flex-col gap-3 pl-4">
<h3 className="font-label-lg text-label-lg font-bold text-on-surface-variant uppercase">Distribution</h3>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-primary"></span>
<div className="flex flex-col">
<span className="font-body-md text-body-md leading-none">Present</span>
<span className="font-label-md text-label-md text-on-surface-variant">88.5%</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-error"></span>
<div className="flex flex-col">
<span className="font-body-md text-body-md leading-none">Absent</span>
<span className="font-label-md text-label-md text-on-surface-variant">11.5%</span>
</div>
</div>
</div>
</div>
</section>
{/*  Risk Section  */}
<section className="flex flex-col gap-4">
<div className="flex items-center justify-between">
<h2 className="font-title-lg text-title-lg text-on-surface">Students at Risk</h2>
<span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-label-md text-label-md">Below 75%</span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
{/*  Risk Item  */}
<div className="flex items-center p-4 border-b border-outline-variant gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="person">person</span>
</div>
<div className="flex-1">
<p className="font-title-lg text-[16px] text-on-surface">Alex Thompson</p>
<p className="font-label-md text-label-md text-on-surface-variant">ID: 2024CS089</p>
</div>
<div className="text-right">
<p className="font-headline-sm text-headline-sm text-error">64%</p>
<p className="font-label-md text-label-md text-error-container bg-error px-1 rounded-sm inline-block">CRITICAL</p>
</div>
</div>
{/*  Risk Item  */}
<div className="flex items-center p-4 border-b border-outline-variant gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="person">person</span>
</div>
<div className="flex-1">
<p className="font-title-lg text-[16px] text-on-surface">Elena Rodriguez</p>
<p className="font-label-md text-label-md text-on-surface-variant">ID: 2024CS112</p>
</div>
<div className="text-right">
<p className="font-headline-sm text-headline-sm text-[#FFB300]">72%</p>
<p className="font-label-md text-label-md text-on-surface-variant">WARNING</p>
</div>
</div>
{/*  Risk Item  */}
<div className="flex items-center p-4 gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="person">person</span>
</div>
<div className="flex-1">
<p className="font-title-lg text-[16px] text-on-surface">Marcus Chen</p>
<p className="font-label-md text-label-md text-on-surface-variant">ID: 2024CS045</p>
</div>
<div className="text-right">
<p className="font-headline-sm text-headline-sm text-[#FFB300]">74%</p>
<p className="font-label-md text-label-md text-on-surface-variant">WARNING</p>
</div>
</div>
</div>
<button className="w-full py-3 text-primary font-label-lg text-label-lg hover:underline transition-all">View All 12 Students</button>
</section>
</main>
{/*  FAB Action (Export PDF)  */}
<button className="fixed bottom-24 right-6 bg-primary text-on-primary h-14 px-6 rounded-2xl shadow-lg flex items-center gap-3 active:scale-95 transition-all z-40 hover:brightness-110">
<span className="material-symbols-outlined" data-icon="picture_as_pdf">picture_as_pdf</span>
<span className="font-label-lg text-label-lg font-bold tracking-wide">EXPORT PDF REPORT</span>
</button>
{/*  BottomNavBar  */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-2 pb-safe px-4 bg-surface dark:bg-surface-dim border-t border-outline-variant shadow-lg h-20">
<a className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant py-1 hover:bg-secondary-container/50 dark:hover:bg-secondary/20 transition-all rounded-full px-4 group active:scale-90 duration-200" href="#">
<span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform" data-icon="dashboard">dashboard</span>
<span className="font-label-md text-label-md">Home</span>
</a>
<a className="flex flex-col items-center justify-center bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary rounded-full px-4 py-1 active:scale-90 duration-200" href="#">
<span className="material-symbols-outlined mb-1" data-icon="assessment" style={{ fontVariationSettings: "'FILL' 1" }}>assessment</span>
<span className="font-label-md text-label-md">Reports</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant py-1 hover:bg-secondary-container/50 dark:hover:bg-secondary/20 transition-all rounded-full px-4 group active:scale-90 duration-200" href="#">
<span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform" data-icon="person">person</span>
<span className="font-label-md text-label-md">Profile</span>
</a>
</nav>


    </>
  );
};

export default Reports;
