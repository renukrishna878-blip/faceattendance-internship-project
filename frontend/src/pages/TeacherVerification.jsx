import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const TeacherVerification = () => {
  const navigate = useNavigate();
  const attendanceSession = useStore((state) => state.attendanceSession);
  const updateStudentAttendanceStatus = useStore((state) => state.updateStudentAttendanceStatus);

  const students = attendanceSession.roster || [];

  const statusMap = attendanceSession.attendanceStatus || {};
  const editedList = attendanceSession.editedStudents || [];

  const getOriginalStatus = (studentId) => {
    return attendanceSession.initialAttendanceStatus?.[studentId] || 'Present';
  };

  const totalCount = students.length;
  const presentCount = students.filter(s => (statusMap[s.id] || 'Absent') === 'Present').length;
  const absentCount = totalCount - presentCount;
  const editedCount = editedList.length;
  const aiDetectedCount = students.filter(s => getOriginalStatus(s.id) === 'Present').length;

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
<p className="font-headline-md text-headline-md text-primary">{aiDetectedCount}</p>
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
<div className="bg-white p-margin-mobile border-t border-gray-100 flex flex-col gap-3 mt-6">
<button onClick={() => navigate('/attendance/confirm')} className="w-full bg-primary text-white font-title-lg text-title-lg py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3">
<span className="material-symbols-outlined">save</span>
            SAVE ATTENDANCE
        </button>
</div>


    </>
  );
};

export default TeacherVerification;
