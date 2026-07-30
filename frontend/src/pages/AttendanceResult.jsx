import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AttendanceResult = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      
{/*  TopAppBar Shell Component  */}
<header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-14 bg-surface dark:bg-inverse-surface shadow-sm">
<div className="flex items-center gap-4">
<button className="p-2 text-primary dark:text-inverse-primary hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-150 ease-in-out rounded-full">
<span className="material-symbols-outlined">menu</span>
</button>
<h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-inverse-primary">Smart Attendance System</h1>
</div>
<div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant active:scale-95 duration-150 transition-transform">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a female university professor with glasses, smiling warmly, captured in a brightly lit academic office setting. The style is clean, modern, and trustworthy, using the blue and white palette of the higher education institution." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP6Yk0vZn6fUt3nzjTSIsCgSNR-qQeMimv5hyJS6mAuiJaU8MUtm5Je1vtfn4ONoKrhsA_xGAa3eZiw64HNh7W2XHg0VDaRmJ-Y5MeBP07a7DqP-0nhZlPWOSQ3fT0wOT609mXp1BenaUktkGdNf8wMDWn86FvJpAFS_7ELjebBQmBgx1tSbzEZPkySjhLgSA0UeM2h6t9RtK9crVh3-eC_xcffn6KhaNjsTjJrtFApHypk085vwBycg"/>
</div>
</header>
<main className="pt-14 pb-24">
{/*  Result Visualization Section  */}
<section className="relative w-full aspect-[4/3] bg-surface-container-highest overflow-hidden">
<img className="w-full h-full object-cover grayscale-[0.2]" data-alt="A wide-angle, high-resolution photograph of a modern university lecture hall filled with diverse students. The lighting is bright and professional. The scene is captured from the professor's perspective, showing several rows of students engaged in a lecture. The overall aesthetic is clean, academic, and technologically advanced." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuV5DtS7VzHhRPRrvEouHyYqGbpHv1t9KLWp4lZ73p-cPCBFdT2agEc_uO0veHveniHJEe2fmzMpZnIenS1947S4SblP5bYhkrkJmAwRQ2-M7Vl6THQd8DVT4z9sJnYpirqhjf759USK96bMfjPqWyerNb6sRbxUXSAiffRlCJPFx0SAlv5pKuhdjgO0SrKPZ9rvP33tmD_09s8JcNNM-9bbJStwsTL-B9JuPgLXjzJ_p6uCLM_peHzQ"/>
{/*  AI Detection Overlay Emulation  */}
<div className="absolute inset-0 pointer-events-none">
{/*  Bounding Box 1  */}
<div className="bounding-box w-[12%] h-[15%] left-[20%] top-[30%] rounded-sm shadow-[0_0_8px_rgba(74,222,128,0.5)]">
<span className="absolute -top-6 left-0 bg-[#4ade80] text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1">
<span className="material-symbols-outlined !text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Detected
                    </span>
</div>
{/*  Bounding Box 2  */}
<div className="bounding-box w-[10%] h-[13%] left-[45%] top-[25%] rounded-sm shadow-[0_0_8px_rgba(74,222,128,0.5)]">
<span className="absolute -top-6 left-0 bg-[#4ade80] text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1">
<span className="material-symbols-outlined !text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Detected
                    </span>
</div>
{/*  Bounding Box 3  */}
<div className="bounding-box w-[11%] h-[14%] left-[68%] top-[35%] rounded-sm shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
{/*  Bounding Box 4  */}
<div className="bounding-box w-[9%] h-[12%] left-[15%] top-[55%] rounded-sm shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
</div>
<div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
<span className="inline-flex items-center gap-2 bg-primary px-3 py-1 rounded-full text-white font-label-lg text-label-lg">
<span className="material-symbols-outlined !text-[16px]">visibility</span>
                    Scan Complete
                </span>
</div>
</section>
{/*  Summary Statistics Card  */}
<div className="px-margin-mobile -mt-6 relative z-10">
<div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-4 grid grid-cols-3 divide-x divide-outline-variant/30">
<div className="flex flex-col items-center">
<span className="text-on-surface-variant font-label-lg text-label-lg uppercase tracking-wider">Present</span>
<span className="font-headline-md text-headline-md text-primary mt-1">42</span>
</div>
<div className="flex flex-col items-center">
<span className="text-on-surface-variant font-label-lg text-label-lg uppercase tracking-wider">Absent</span>
<span className="font-headline-md text-headline-md text-error mt-1">3</span>
</div>
<div className="flex flex-col items-center">
<span className="text-on-surface-variant font-label-lg text-label-lg uppercase tracking-wider">Accuracy</span>
<span className="font-headline-md text-headline-md text-on-surface mt-1">98%</span>
</div>
</div>
</div>
{/*  Student List Section  */}
<section className="mt-8 px-margin-mobile">
<div className="flex items-center justify-between mb-4">
<h2 className="font-title-lg text-title-lg text-on-surface">Verification List</h2>
<button className="flex items-center gap-1 text-primary font-label-lg text-label-lg hover:underline transition-all">
<span className="material-symbols-outlined !text-[18px]">sort</span>
                    Filter
                </button>
</div>
<div className="space-y-3">
{/*  Alex Rivera  */}
<div className="flex items-center bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] duration-150">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container mr-4">
<img className="w-full h-full object-cover" data-alt="A clean, minimalist studio portrait of Alex Rivera, a male student with short dark hair, wearing a neutral-colored casual shirt. The background is a soft, out-of-focus academic hall, emphasizing a professional yet approachable student profile aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVofro8gHm7dcpU6xpd4g3GHG0UlO2YA86VSYLby_i8RQpPUpoc85GKqyDYUuNvyHEVxSDd0QJ2xma4rW1SLa-L-x9wHme3PFdhk9Wa0YNolhQ8v5CLXKKZpOE-5dh3FWJx4QZpFPikuU_i2G62af8QwudhOGu4YI4jKDyd5IeBPzDBgACC54Qt1MA2z8Hu9qN6wJIAeKBJc51hfZeyvN9SPB9_iXDRMEcwsgSrBZNqBKY7WJsIOjLEQ"/>
</div>
<div className="flex-grow">
<p className="font-title-lg text-body-lg font-semibold text-on-surface">Alex Rivera</p>
<p className="font-label-md text-label-md text-on-surface-variant">2023CS01</p>
</div>
<div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-label-lg text-label-lg border border-emerald-200">
                        Present
                    </div>
</div>
{/*  Priya Sharma  */}
<div className="flex items-center bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] duration-150">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container mr-4">
<img className="w-full h-full object-cover" data-alt="A high-quality profile photo of Priya Sharma, a female student of Indian descent with long dark hair, smiling confidently. She is wearing a modern college sweatshirt. The lighting is soft and even, suggesting a bright campus library environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsgImVvQZ5WDolynpEnIT6QvyC688tu4d4EE0W-av_vwl_Dg2tLK06WwIXq8N9ZYBDnCXyfaiLYH7Y-7h0xi0ttY-xozMLExcVxtFdDBheZ7Ikuw0JZfaDrYYHogE0H66OnWuY0j1lCYfxuN2XB7K41_inRIcm2TcwJhLMXXI1BFiZkKSB5TvIwxVTlgLpf8IPhyWXrWoxJQPD4nuvjeUkKG91z3u-vmLjKh_0XbWPZud_Ct-3PunwqQ"/>
</div>
<div className="flex-grow">
<p className="font-title-lg text-body-lg font-semibold text-on-surface">Priya Sharma</p>
<p className="font-label-md text-label-md text-on-surface-variant">2023CS14</p>
</div>
<div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-label-lg text-label-lg border border-emerald-200">
                        Present
                    </div>
</div>
{/*  Chen Wei  */}
<div className="flex items-center bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] duration-150">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container mr-4">
<img className="w-full h-full object-cover" data-alt="A professional headshot of Chen Wei, an East Asian male student with a calm expression. He is wearing a dark polo shirt. The aesthetic is clean and corporate, consistent with a digital university student directory." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnhkS57QG3k2dFySnTmwKg3gUcfY_lo77uEJLD08698e2NB_LF97mT7W1a_vg5qUKG8qW4TJ3-MKhAjdgKKVoOegSDEdQ6KwnhDx9TPekVlp38R6n_Jya59KRrgXSkQ0N6yY3VIRcDG0TP--Z4j9H6RaaSoOQH-baorXiKMdzN0p51tv7jYTDvnrbhQaAgm8O21RL07HyLzNefd2VXWW3JSpTJj_v3B2bj1s8Akzy3_shxaWMGefznLA"/>
</div>
<div className="flex-grow">
<p className="font-title-lg text-body-lg font-semibold text-on-surface">Chen Wei</p>
<p className="font-label-md text-label-md text-on-surface-variant">2023EE08</p>
</div>
<div className="px-3 py-1 rounded-full bg-error-container text-error font-label-lg text-label-lg border border-error/20">
                        Absent
                    </div>
</div>
{/*  Sarah Johnson  */}
<div className="flex items-center bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] duration-150">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container mr-4">
<img className="w-full h-full object-cover" data-alt="A portrait of Sarah Johnson, a Caucasian female student with blonde hair tied back, wearing a light-colored cardigan. She looks attentive and professional. The background is a soft blue-toned academic setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWVruR2d9mFWIL_jLFGSab7b8BraO40gGFT5y1Re__srCV74Tdds2OG91VOYciIk7MBMIdZEbqSfBzpjuyy9zm7m14-d9zTzVSV1bHm9aOgSWTnn-tfs5prynwee8j5QlcYj1SKpoU8WI12K1kFm1aoIcS4Hdme-lrc6sdYxm7J0fboIXQsUD0BR8ISCUCQEmOxByycjWtAX_QXiZrlnYUWuCfdA9jwRsK-Hmx_Ioxslek4AyCJt77RA"/>
</div>
<div className="flex-grow">
<p className="font-title-lg text-body-lg font-semibold text-on-surface">Sarah Johnson</p>
<p className="font-label-md text-label-md text-on-surface-variant">2023BA22</p>
</div>
<div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-label-lg text-label-lg border border-emerald-200">
                        Present
                    </div>
</div>
{/*  Extra padding for bottom scroll  */}
<div className="h-2"></div>
</div>
</section>
</main>
{/*  Finalize Action Shell  */}
<div className="fixed bottom-0 left-0 w-full z-[40] bg-surface/95 backdrop-blur-md px-margin-mobile py-4 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-outline-variant/10">
<button className="w-full bg-primary-container text-on-primary-container font-headline-sm text-headline-sm py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-3">
            CONTINUE
            <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
{/*  Micro-interaction Script  */}


    </>
  );
};

export default AttendanceResult;
