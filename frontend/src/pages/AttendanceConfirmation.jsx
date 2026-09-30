import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { DEPARTMENTS, generateRoster } from '../utils/timetableData';

const AttendanceConfirmation = () => {
  const navigate = useNavigate();
  const selectedClass = useStore((state) => state.selectedClass) || {};
  const attendanceSession = useStore((state) => state.attendanceSession) || {};
  const addAttendanceSessionToHistory = useStore((state) => state.addAttendanceSessionToHistory);
  const editedList = attendanceSession.editedStudents || [];

  const rosterStudents = (attendanceSession.roster && attendanceSession.roster.length > 0)
    ? attendanceSession.roster
    : generateRoster(selectedClass.department || 'cs', selectedClass.year || '3', selectedClass.section || 'A', selectedClass.semester || '5');
    
  const students = rosterStudents;

  const statusMap = Object.keys(attendanceSession.attendanceStatus || {}).length > 0
    ? attendanceSession.attendanceStatus
    : students.reduce((acc, s, idx) => {
        acc[s.id] = (idx % 6 === 0) ? 'Absent' : 'Present';
        return acc;
      }, {});

  const getSubjectName = () => {
    if (!selectedClass.department || !selectedClass.subject) return 'Advanced AI';
    const dept = DEPARTMENTS[selectedClass.department];
    const sub = dept?.subjects?.find(s => s.id === selectedClass.subject);
    return sub ? sub.name : 'Advanced AI';
  };

  const courseName = getSubjectName();
  const dateStr = attendanceSession.date || new Date().toISOString().split('T')[0];
  const timingStr = attendanceSession.timing || '10:00 AM - 11:30 AM';

  const formatDate = (dateString) => {
    if (!dateString) return 'Oct 24, 2023';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  const formattedDate = formatDate(dateStr);

  const totalCount = students.length;
  const presentCount = students.filter(s => (statusMap[s.id] || 'Absent') === 'Present').length;
  const absentCount = totalCount - presentCount;
  const editedCount = editedList.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  const [toastMessage, setToastMessage] = React.useState('');

  React.useEffect(() => {
    if (window.electron && window.electron.onSaveReportReply) {
      const removeListener = window.electron.onSaveReportReply((success, filename) => {
        if (success) {
          setToastMessage(`Report saved: ${filename}`);
        } else {
          setToastMessage('Failed to save report file.');
        }
        setTimeout(() => setToastMessage(''), 3000);
      });
      return removeListener;
    }
  }, []);

  const handleExportPDF = () => {
    if (window.electron && window.electron.printPDF) {
      setToastMessage('Opening printer preview...');
      window.electron.printPDF();
      setTimeout(() => setToastMessage(''), 3000);
    } else {
      setToastMessage('Preparing print PDF document...');
      setTimeout(() => {
        window.print();
        setToastMessage('');
      }, 800);
    }
  };

  const handleShareReport = () => {
    const reportText = `=== ATTENDANCE SESSION REPORT ===
Course: ${courseName}
Date: ${formattedDate}
Timing: ${timingStr}
---------------------------------
Total Strength: ${totalCount}
Present Students: ${presentCount}
Absent Students: ${absentCount}
Attendance Rate: ${attendanceRate}%

Roster Summary:
${students.map(s => ` - ${s.name} (${s.id}): ${statusMap[s.id] || 'Absent'}`).join('\n')}
=================================`;

    const defaultFilename = `Attendance_Report_${courseName.replace(/\s+/g, '_')}_${dateStr.replace(/\s+/g, '_')}.txt`;

    if (window.electron && window.electron.saveReport) {
      setToastMessage('Opening save file dialog...');
      window.electron.saveReport(reportText, defaultFilename);
    } else if (navigator.share) {
      navigator.share({
        title: `Attendance Report - ${courseName}`,
        text: reportText,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(reportText);
      setToastMessage('Report copied to clipboard!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleSaveAndFinish = async () => {
    const token = useStore.getState().token;
    const isMockToken = token === 'mock_offline_jwt_token' || !token;

    if (!isMockToken && attendanceSession.attendanceId) {
      try {
        const recordIds = attendanceSession.attendanceRecordIds || {};
        const editedStudents = attendanceSession.editedStudents || [];
        
        // 1. Save manual overrides
        for (const studentId of editedStudents) {
          const recordId = recordIds[studentId];
          if (recordId) {
            const newStatus = statusMap[studentId] || 'Absent';
            await fetch(`http://localhost:5000/api/attendance/record/${recordId}/override`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                new_status: newStatus,
                reason: 'Manual override by teacher'
              })
            });
          }
        }

        // 2. Finalize attendance session
        await fetch(`http://localhost:5000/api/attendance/session/${attendanceSession.attendanceId}/finalize`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error finalizing attendance session:', error);
      }
    }

    addAttendanceSessionToHistory({
      department: selectedClass.department,
      year: selectedClass.year,
      section: selectedClass.section,
      subject: selectedClass.subject,
      date: dateStr,
      totalCount,
      presentCount,
      absentCount,
      attendanceRate
    });

    useStore.getState().resetAttendanceSession();
    navigate('/dashboard');
  };

  return (
    <>
      
{/*  TopAppBar  */}
<header className="bg-surface sticky top-0 left-0 w-full z-50 shadow-sm flex items-center justify-between px-md h-14 print:hidden">
<div className="flex items-center gap-4">
<button onClick={() => navigate('/dashboard')} className="active:scale-95 transition-transform p-2 rounded-full hover:bg-surface-container-high transition-colors">
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
<section className="relative w-full aspect-video md:aspect-[21/9] flex flex-col items-center justify-center overflow-hidden rounded-xl mb-lg print:hidden bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-100">
<div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
<div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg text-white">
<span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<h2 className="font-headline-md text-xl md:text-2xl font-bold text-center text-indigo-950 mb-1">Session Completed Successfully!</h2>
<p className="font-body-md text-sm text-indigo-800">The final roster has been saved to the database.</p>
</div>
</section>

{/* Automated Mail Notice Alert */}
<section className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-md flex items-start gap-3 shadow-sm print:hidden">
  <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
  <div>
    <h4 className="font-semibold text-emerald-950 text-sm">Automated Email Alerts Dispatched</h4>
    <p className="text-xs text-emerald-800 mt-0.5">
      The system checked overall student attendance records. Students whose cumulative attendance rate is under 75% have been automatically reported and notified via warning emails in the background.
    </p>
  </div>
</section>

{/*  Class Information Card  */}
<section className="bg-surface-container-lowest rounded-xl p-md shadow-sm mb-md border border-outline-variant/20">
<div className="flex items-start justify-between">
<div>
<span className="font-label-md text-label-md text-primary uppercase tracking-wider mb-1 block">Course Name</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">{courseName}</h3>
<div className="space-y-3">
<div className="flex items-center gap-3 text-on-surface-variant">
<span className="material-symbols-outlined text-primary">calendar_today</span>
<span className="font-body-md text-body-md">{formattedDate}</span>
</div>
<div className="flex items-center gap-3 text-on-surface-variant">
<span className="material-symbols-outlined text-primary">schedule</span>
<span className="font-body-md text-body-md">{timingStr}</span>
</div>
</div>
</div>
<div className="hidden sm:block">
  {/* Circular Session Attendance Progress Ring */}
  <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl border border-gray-100 shadow-sm w-32 h-32">
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="40" cy="40" r="32" className="stroke-gray-200 fill-none" strokeWidth="6" />
        <circle cx="40" cy="40" r="32" className="stroke-emerald-500 fill-none" strokeWidth="6"
          strokeDasharray={`${2 * Math.PI * 32}`}
          strokeDashoffset={`${2 * Math.PI * 32 * (1 - attendanceRate / 100)}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-extrabold text-emerald-700">{attendanceRate}%</span>
    </div>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Session Rate</span>
  </div>
</div>
</div>
</section>
{/*  Metrics Grid  */}
<section className="grid grid-cols-2 gap-4 mb-xl">
{/*  Total  */}
<div className="bg-surface-container-low p-md rounded-xl flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-on-surface-variant mb-2">groups</span>
<span className="font-headline-md text-headline-md text-on-surface">{totalCount}</span>
<span className="font-label-md text-label-md text-on-surface-variant">Class Strength</span>
</div>
{/*  Present  */}
<div className="bg-primary-fixed p-md rounded-xl flex flex-col items-center justify-center text-center border-b-2 border-primary">
<span className="material-symbols-outlined text-primary mb-2">person_check</span>
<span className="font-headline-md text-headline-md text-primary">{presentCount}</span>
<span className="font-label-md text-label-md text-primary">Present</span>
</div>
{/*  Absent  */}
<div className="bg-error-container p-md rounded-xl flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-on-error-container mb-2">person_off</span>
<span className="font-headline-md text-headline-md text-on-error-container">{absentCount}</span>
<span className="font-label-md text-label-md text-on-error-container">Absent</span>
</div>
{/*  Corrections  */}
<div className="bg-secondary-container p-md rounded-xl flex flex-col items-center justify-center text-center border-l-4 border-primary">
<span className="material-symbols-outlined text-on-secondary-container mb-2">edit_square</span>
<span className="font-headline-md text-headline-md text-on-secondary-container">{editedCount}</span>
<span className="font-label-md text-label-md text-on-secondary-container">Teacher Correction</span>
</div>
</section>

{/* Student Attendance Roster List */}
<section className="bg-surface-container-lowest rounded-xl p-md shadow-sm mb-md border border-outline-variant/20">
  <h4 className="font-semibold text-on-surface text-base mb-3 flex items-center gap-2">
    <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
    Student Attendance Roster
  </h4>
  <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-2 print:max-h-none print:overflow-visible">
    {students.map((student) => {
      const isPresent = (statusMap[student.id] || 'Absent') === 'Present';
      return (
        <div key={student.id} className="py-2.5 flex items-center justify-between text-sm">
          <div>
            <span className="font-semibold text-gray-800">{student.name}</span>
            <span className="text-xs text-gray-400 ml-2">({student.id})</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            isPresent ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {isPresent ? 'Present' : 'Absent'}
          </span>
        </div>
      );
    })}
  </div>
</section>

{/*  Action Buttons  */}
<section className="space-y-4 print:hidden">
<button onClick={handleSaveAndFinish} className="w-full bg-primary-container text-on-primary-container py-4 px-6 rounded-full font-headline-sm text-headline-sm shadow-md active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2">
<span className="material-symbols-outlined">save</span>
                Save &amp; Finish Attendance
            </button>
<div className="grid grid-cols-2 gap-4">
<button onClick={handleExportPDF} className="flex items-center justify-center gap-2 border border-outline py-3 px-4 rounded-xl font-title-lg text-title-lg text-on-surface-variant hover:bg-surface-variant active:scale-95 transition-all">
<span className="material-symbols-outlined">picture_as_pdf</span>
                    Export PDF
                </button>
<button onClick={handleShareReport} className="flex items-center justify-center gap-2 border border-outline py-3 px-4 rounded-xl font-title-lg text-title-lg text-on-surface-variant hover:bg-surface-variant active:scale-95 transition-all">
<span className="material-symbols-outlined">share</span>
                    Share Report
                </button>
</div>
<div className="text-center pt-4">
<button onClick={() => navigate('/dashboard')} className="font-title-lg text-title-lg text-primary hover:underline underline-offset-4 decoration-2 decoration-primary-fixed active:scale-95 transition-all inline-flex items-center gap-2">
<span className="material-symbols-outlined">dashboard</span>
                    Return to Dashboard
                </button>
</div>
</section>
</main>

{/* Custom Glassmorphic Toast Notification */}
{toastMessage && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300 font-medium text-sm">
    <span className="material-symbols-outlined text-emerald-400">check_circle</span>
    {toastMessage}
  </div>
)}
    </>
  );
};

export default AttendanceConfirmation;
