import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AttendanceResult = () => {
  const navigate = useNavigate();
  const attendanceSession = useStore((state) => state.attendanceSession);
  const updateStudentAttendanceStatus = useStore((state) => state.updateStudentAttendanceStatus);
  const statusMap = attendanceSession.attendanceStatus || {};

  const students = [
    { id: '2023CS01', name: 'Alex Rivera', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVofro8gHm7dcpU6xpd4g3GHG0UlO2YA86VSYLby_i8RQpPUpoc85GKqyDYUuNvyHEVxSDd0QJ2xma4rW1SLa-L-x9wHme3PFdhk9Wa0YNolhQ8v5CLXKKZpOE-5dh3FWJx4QZpFPikuU_i2G62af8QwudhOGu4YI4jKDyd5IeBPzDBgACC54Qt1MA2z8Hu9qN6wJIAeKBJc51hfZeyvN9SPB9_iXDRMEcwsgSrBZNqBKY7WJsIOjLEQ' },
    { id: '2023CS14', name: 'Priya Sharma', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsgImVvQZ5WDolynpEnIT6QvyC688tu4d4EE0W-av_vwl_Dg2tLK06WwIXq8N9ZYBDnCXyfaiLYH7Y-7h0xi0ttY-xozMLExcVxtFdDBheZ7Ikuw0JZfaDrYYHogE0H66OnWuY0j1lCYfxuN2XB7K41_inRIcm2TcwJhLMXXI1BFiZkKSB5TvIwxVTlgLpf8IPhyWXrWoxJQPD4nuvjeUkKG91z3u-vmLjKh_0XbWPZud_Ct-3PunwqQ' },
    { id: '2023EE08', name: 'Chen Wei', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7J7DqVvkRMyL4fJXkY9Hy1HqiMlSDHyV6isHZ7ee2k6bptxt0Jmzx3tHK9_DdrpfBeGL_L2-Ycx_XrkbboaTOATLNkIEVmcGyvM0Xv7W49r2dbws33PI0au8pHzGUqTGxz_aRJKX6TimHYjYi6lyxbXlF05kX5xdKUTw5ZW5zHmJyHsbjOkjCSNAyM9RmBfXqqU2NJs2WVH6fVO8g8ltjqnx5f4jVdtziJ2kb35I8iQCwlvVWh4Dbug' },
    { id: '2023BA22', name: 'Sarah Johnson', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1sK7ge7T_Ts0rEekOy8FVnGOJi0kqY32DB1yNcoco5PkMq3WckH_qAWJekGlDeBl_nxYeJfRCgErSrB6SAfa4gXFFGcu3dAL3D6wPprFg-nURKbHeGCLMrYbP--2_WYKl70DZokW_LV-7L3YJzQcYWtPZeFOUL4K96o13jpinMZ949mtb0HNPIk9J4x4qb4_4kv0deKFna1XfaSHQwtuzlD6hktdQqqfSkjaigzV1tLxMIaml5e7ZBQ' }
  ];

  const faceBoxes = [
    { id: '2023CS01', name: 'Alex Rivera', left: '20%', top: '30%', width: '12%', height: '15%' },
    { id: '2023CS14', name: 'Priya Sharma', left: '45%', top: '25%', width: '10%', height: '13%' },
    { id: '2023EE08', name: 'Chen Wei', left: '68%', top: '35%', width: '11%', height: '14%' },
    { id: '2023BA22', name: 'Sarah Johnson', left: '15%', top: '55%', width: '9%', height: '12%' },
  ];

  const totalCount = students.length;
  const presentCount = students.filter(s => (statusMap[s.id] || 'Absent') === 'Present').length;
  const absentCount = totalCount - presentCount;
  const accuracy = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  const handleToggleStatus = (studentId) => {
    const currentStatus = statusMap[studentId] || 'Absent';
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    updateStudentAttendanceStatus(studentId, newStatus);
  };

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
  {faceBoxes.map((box) => {
    const isPresent = (statusMap[box.id] || 'Absent') === 'Present';
    return (
      <div 
        key={box.id} 
        onClick={() => handleToggleStatus(box.id)}
        style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
        className={`absolute rounded-sm border-2 pointer-events-auto cursor-pointer transition-all duration-200 active:scale-95 ${
          isPresent 
            ? 'border-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]' 
            : 'border-[#ea4335] shadow-[0_0_8px_rgba(234,67,53,0.6)]'
        }`}
        title={`Click to toggle ${box.name} attendance`}
      >
        <span className={`absolute -top-6 left-0 text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1 whitespace-nowrap transition-colors duration-200 ${
          isPresent ? 'bg-[#4ade80]' : 'bg-[#ea4335]'
        }`}>
          <span className="material-symbols-outlined !text-[12px]">
            {isPresent ? 'check_circle' : 'cancel'}
          </span>
          {box.name} {isPresent ? '' : '(Absent)'}
        </span>
      </div>
    );
  })}
</div>

<div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
<span className="inline-flex items-center gap-2 bg-primary px-3 py-1 rounded-full text-white font-label-lg text-label-lg">
<span className="material-symbols-outlined !text-[16px]">visibility</span>
                    Scan Complete • Click faces to toggle status
                </span>
</div>
</section>

{/*  Summary Statistics Card  */}
<div className="px-margin-mobile -mt-6 relative z-10">
<div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-4 grid grid-cols-3 divide-x divide-outline-variant/30">
<div className="flex flex-col items-center">
<span className="text-on-surface-variant font-label-lg text-label-lg uppercase tracking-wider">Present</span>
<span className="font-headline-md text-headline-md text-primary mt-1">{presentCount}</span>
</div>
<div className="flex flex-col items-center">
<span className="text-on-surface-variant font-label-lg text-label-lg uppercase tracking-wider">Absent</span>
<span className="font-headline-md text-headline-md text-error mt-1">{absentCount}</span>
</div>
<div className="flex flex-col items-center">
<span className="text-on-surface-variant font-label-lg text-label-lg uppercase tracking-wider">Accuracy</span>
<span className="font-headline-md text-headline-md text-on-surface mt-1">{accuracy}%</span>
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
{students.map((student) => {
  const isPresent = (statusMap[student.id] || 'Absent') === 'Present';
  return (
    <div key={student.id} className="flex items-center bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] duration-150">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container mr-4">
        <img className="w-full h-full object-cover" src={student.img} alt={student.name} />
      </div>
      <div className="flex-grow">
        <p className="font-title-lg text-body-lg font-semibold text-on-surface">{student.name}</p>
        <p className="font-label-md text-label-md text-on-surface-variant">{student.id}</p>
      </div>
      <button 
        onClick={() => handleToggleStatus(student.id)} 
        className={`px-3 py-1 rounded-full font-label-lg text-label-lg border cursor-pointer active:scale-95 transition-all duration-150 ${
          isPresent 
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' 
            : 'bg-error-container text-error border-error/20 hover:bg-error-container/80'
        }`}
      >
        {isPresent ? 'Present' : 'Absent'}
      </button>
    </div>
  );
})}
{/*  Extra padding for bottom scroll  */}
<div className="h-2"></div>
</div>
</section>
</main>
{/*  Finalize Action Shell  */}
<div className="fixed bottom-0 left-0 w-full z-[40] bg-surface/95 backdrop-blur-md px-margin-mobile py-4 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-outline-variant/10">
<button onClick={() => navigate('/attendance/verify')} className="w-full bg-primary-container text-on-primary-container font-headline-sm text-headline-sm py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-3">
            VERIFY &amp; EDIT ATTENDANCE
            <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
{/*  Micro-interaction Script  */}


    </>
  );
};

export default AttendanceResult;
