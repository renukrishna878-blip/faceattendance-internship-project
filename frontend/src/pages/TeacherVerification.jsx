import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const TeacherVerification = () => {
  const navigate = useNavigate();
  const attendanceSession = useStore((state) => state.attendanceSession);
  const updateStudentAttendanceStatus = useStore((state) => state.updateStudentAttendanceStatus);

  const students = [
    { id: '2023CS01', name: 'Alex Rivera', dept: 'Computer Science', section: 'A', year: '3rd Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVofro8gHm7dcpU6xpd4g3GHG0UlO2YA86VSYLby_i8RQpPUpoc85GKqyDYUuNvyHEVxSDd0QJ2xma4rW1SLa-L-x9wHme3PFdhk9Wa0YNolhQ8v5CLXKKZpOE-5dh3FWJx4QZpFPikuU_i2G62af8QwudhOGu4YI4jKDyd5IeBPzDBgACC54Qt1MA2z8Hu9qN6wJIAeKBJc51hfZeyvN9SPB9_iXDRMEcwsgSrBZNqBKY7WJsIOjLEQ' },
    { id: '2023CS14', name: 'Priya Sharma', dept: 'Computer Science', section: 'B', year: '3rd Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsgImVvQZ5WDolynpEnIT6QvyC688tu4d4EE0W-av_vwl_Dg2tLK06WwIXq8N9ZYBDnCXyfaiLYH7Y-7h0xi0ttY-xozMLExcVxtFdDBheZ7Ikuw0JZfaDrYYHogE0H66OnWuY0j1lCYfxuN2XB7K41_inRIcm2TcwJhLMXXI1BFiZkKSB5TvIwxVTlgLpf8IPhyWXrWoxJQPD4nuvjeUkKG91z3u-vmLjKh_0XbWPZud_Ct-3PunwqQ' },
    { id: '2023EE08', name: 'Chen Wei', dept: 'Electrical Eng.', section: 'A', year: '2nd Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7J7DqVvkRMyL4fJXkY9Hy1HqiMlSDHyV6isHZ7ee2k6bptxt0Jmzx3tHK9_DdrpfBeGL_L2-Ycx_XrkbboaTOATLNkIEVmcGyvM0Xv7W49r2dbws33PI0au8pHzGUqTGxz_aRJKX6TimHYjYi6lyxbXlF05kX5xdKUTw5ZW5zHmJyHsbjOkjCSNAyM9RmBfXqqU2NJs2WVH6fVO8g8ltjqnx5f4jVdtziJ2kb35I8iQCwlvVWh4Dbug' },
    { id: '2023BA22', name: 'Sarah Johnson', dept: 'Business Admin', section: 'C', year: '4th Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1sK7ge7T_Ts0rEekOy8FVnGOJi0kqY32DB1yNcoco5PkMq3WckH_qAWJekGlDeBl_nxYeJfRCgErSrB6SAfa4gXFFGcu3dAL3D6wPprFg-nURKbHeGCLMrYbP--2_WYKl70DZokW_LV-7L3YJzQcYWtPZeFOUL4K96o13jpinMZ949mtb0HNPIk9J4x4qb4_4kv0deKFna1XfaSHQwtuzlD6hktdQqqfSkjaigzV1tLxMIaml5e7ZBQ' }
  ];

  const statusMap = attendanceSession.attendanceStatus || {};
  const editedList = attendanceSession.editedStudents || [];

  const getOriginalStatus = (studentId) => {
    if (studentId === '2023EE08') return 'Absent';
    return 'Present';
  };

  const totalCount = students.length;
  const presentCount = students.filter(s => (statusMap[s.id] || 'Absent') === 'Present').length;
  const absentCount = totalCount - presentCount;
  const editedCount = editedList.length;

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
<h2 className="font-headline-md text-headline-md text-on-surface">Verify Student Roster</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Review and override the attendance records predicted by AI.</p>
</section>
{/*  Student List  */}
<div className="space-y-md">
{students.map((student) => {
  const currentStatus = statusMap[student.id] || 'Absent';
  const originalStatus = getOriginalStatus(student.id);
  const isEdited = currentStatus !== originalStatus;

  return (
    <div key={student.id} className={`attendance-card bg-surface-container-lowest rounded-xl p-md flex flex-col gap-md border ${
      isEdited ? 'border-2 border-primary/20 relative' : 'border border-outline-variant/30'
    }`}>
      {isEdited && (
        <div className="absolute -top-3 right-4">
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-amber-200">
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
            Edited by Teacher
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-md">
        <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
          <img className="w-full h-full object-cover" src={student.img} alt={student.name} />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-title-lg text-title-lg text-on-surface">{student.name}</h3>
            {originalStatus === 'Absent' && (
              <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI not detected</span>
            )}
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Reg No: {student.id}</p>
        </div>
      </div>

      {isEdited && (
        <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1 border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">Original AI: <span className={originalStatus === 'Present' ? 'text-emerald-600 font-bold' : 'text-error font-bold'}>{originalStatus}</span></span>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_forward</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Final: <span className={currentStatus === 'Present' ? 'text-emerald-600 font-bold' : 'text-error font-bold'}>{currentStatus}</span></span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-md pt-2">
        <button 
          onClick={() => updateStudentAttendanceStatus(student.id, 'Present')}
          className={`py-2.5 rounded-lg font-label-lg text-label-lg transition-all uppercase ${
            currentStatus === 'Present' 
              ? 'bg-emerald-600 text-white font-bold' 
              : 'border border-primary text-primary hover:bg-primary/5'
          }`}
        >
          Present
        </button>
        <button 
          onClick={() => updateStudentAttendanceStatus(student.id, 'Absent')}
          className={`py-2.5 rounded-lg font-label-lg text-label-lg transition-all uppercase ${
            currentStatus === 'Absent' 
              ? 'bg-error text-white font-bold' 
              : 'border border-error text-error hover:bg-error/5'
          }`}
        >
          Absent
        </button>
      </div>
    </div>
  );
})}
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
<p className="font-headline-md text-headline-md text-on-surface">{totalCount}</p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">AI Detected</p>
<p className="font-headline-md text-headline-md text-primary">3</p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">Teacher Verified</p>
<p className="font-headline-md text-headline-md text-amber-600">{editedCount}</p>
</div>
<div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">Final Present</p>
<p className="font-headline-md text-headline-md text-emerald-600">{presentCount}</p>
</div>
<div className="col-span-2 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 flex justify-between items-center">
<p className="font-label-md text-label-md text-on-surface-variant uppercase">Final Absent</p>
<p className="font-headline-md text-headline-md text-error">{absentCount}</p>
</div>
</div>
</div>
</main>
{/*  Bottom Actions Container  */}
<div className="fixed bottom-0 left-0 w-full bg-surface p-margin-mobile shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex flex-col gap-3 z-40">
<button onClick={() => navigate('/attendance/confirm')} className="w-full bg-primary text-white font-title-lg text-title-lg py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3">
<span className="material-symbols-outlined">save</span>
            SAVE ATTENDANCE
        </button>
</div>
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-2 pt-1 bg-surface-container shadow-md md:hidden">
<button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all duration-200 active:scale-90 hover:text-primary" onClick={() => navigate('/dashboard')}>
<span className="material-symbols-outlined">home</span>
<span className="font-label-md text-label-md">Home</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all duration-200 active:scale-90 hover:text-primary" onClick={() => navigate('/students')}>
<span className="material-symbols-outlined">school</span>
<span className="font-label-md text-label-md">Students</span>
</button>
<button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 transition-all duration-200 active:scale-90 hover:text-primary" onClick={() => navigate('/reports')}>
<span className="material-symbols-outlined">assessment</span>
<span className="font-label-md text-label-md">Reports</span>
</button>
</nav>


    </>
  );
};

export default TeacherVerification;
