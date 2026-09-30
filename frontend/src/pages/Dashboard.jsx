import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { DEPARTMENTS } from '../utils/timetableData';

const Dashboard = () => {
  const navigate = useNavigate();
  const teacher = useStore((state) => state.teacher);
  const teacherName = teacher?.teacherName || localStorage.getItem('teacherName') || 'Dr. Smith';
  const teacherPhoto = teacher?.teacherPhoto || localStorage.getItem('teacherPhoto');

  const [currentDept, setCurrentDept] = useState('');
  const [currentSubjectId, setCurrentSubjectId] = useState('');

  // Get subjects for selected department
  const subjects = currentDept ? DEPARTMENTS[currentDept]?.subjects || [] : [];
  
  // Get currently selected subject details
  const currentSubject = subjects.find(s => s.id === currentSubjectId);

  // Find next session details
  const getNextSession = (dept, subjectId) => {
    const deptSubjects = DEPARTMENTS[dept]?.subjects || [];
    const currentIndex = deptSubjects.findIndex(s => s.id === subjectId);
    if (currentIndex === -1 || deptSubjects.length <= 1) return null;
    const nextIndex = (currentIndex + 1) % deptSubjects.length;
    return deptSubjects[nextIndex];
  };

  const nextSession = getNextSession(currentDept, currentSubjectId);

  return (
    <div className="font-sans text-on-surface">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-sm flex justify-between items-center px-4 py-2 md:pl-72 transition-all">
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
          title="Manage Profile"
        >
          {teacherPhoto && (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
              <img 
                className="w-full h-full object-cover" 
                src={teacherPhoto}
                alt="Profile"
              />
            </div>
          )}
          <h1 className="text-lg font-medium text-primary">Welcome, {teacherName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/timetable')}
            className="cursor-pointer active:scale-95 transition-transform hover:bg-gray-200 p-2 rounded-full text-primary"
            title="View Timetable"
          >
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="cursor-pointer active:scale-95 transition-transform hover:bg-gray-200 p-2 rounded-full text-primary"
            title="Profile Settings"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-6">
        
        {/* Session Selector Card */}
        <section className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <span className="material-symbols-outlined text-[20px]">school</span>
            <h3>Select Current Class Session</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</label>
              <div className="relative rounded-lg border border-gray-300 bg-surface">
                <select 
                  className="w-full bg-transparent border-none py-2.5 px-3 pr-10 text-sm focus:ring-0 cursor-pointer outline-none appearance-none" 
                  value={currentDept} 
                  onChange={(e) => {
                    setCurrentDept(e.target.value);
                    setCurrentSubjectId('');
                  }}
                >
                  <option value="">Select Department</option>
                  {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                    key !== 'ee' ? <option key={key} value={key}>{dept.name}</option> : null
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Present Session</label>
              <div className="relative rounded-lg border border-gray-300 bg-surface">
                <select 
                  className="w-full bg-transparent border-none py-2.5 px-3 pr-10 text-sm focus:ring-0 cursor-pointer outline-none appearance-none disabled:opacity-50"
                  value={currentSubjectId}
                  onChange={(e) => setCurrentSubjectId(e.target.value)}
                  disabled={!currentDept}
                >
                  <option value="">Select Session</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero/Summary Section */}
        <section className="bg-white shadow-sm rounded-xl p-6 flex flex-col gap-3 border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-medium text-secondary uppercase tracking-wider">Next Session</p>
              <h2 className="text-xl font-semibold text-on-surface">
                {nextSession ? nextSession.name : 'No Session Selected'}
              </h2>
              {nextSession && (
                <p className="text-xs text-gray-500 mt-1">
                  Faculty: <span className="text-primary font-medium">{nextSession.faculty}</span>
                </p>
              )}
            </div>
            <div className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-medium">
              {nextSession ? 'Next Slot' : '--:--'}
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="text-sm">
              {currentDept === 'cs' ? 'Lecture Hall 4B • Science Block' :
               currentDept === 'ee' ? 'Lecture Hall 2 • Engineering Block' :
               currentDept === 'me' ? 'Mechanical Hall 1 • Workshop Block' :
               currentDept === 'ce' ? 'Civil Room 10 • Infrastructure Block' :
               'Select Department above'}
            </span>
          </div>
        </section>

        {/* Google Form Biometric Registration & Testing Hub Card */}
        <section 
          onClick={() => navigate('/registrations')}
          className="bg-gradient-to-r from-blue-900 via-primary to-indigo-900 text-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all active:scale-98 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">how_to_reg</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Google Form Hub & Test Submission</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-emerald-950 uppercase">
                  Live Testing
                </span>
              </div>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Submit test registrations with face photos, sync Google Sheets, and test classroom attendance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-white font-bold text-xs bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-xl backdrop-blur-sm transition flex-shrink-0">
            <span>Open Hub</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </section>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Take Attendance */}
          <button 
            onClick={() => {
              if (currentDept || currentSubjectId) {
                let year = '3';
                let section = 'A';
                const match = currentSubjectId.match(/-(\d)-/);
                if (match) {
                  year = match[1];
                }
                
                useStore.getState().setSelectedClass({
                  department: currentDept,
                  year: year,
                  semester: year ? (parseInt(year) * 2 - 1).toString() : '',
                  section: section,
                  subject: currentSubjectId
                });
              }
              navigate('/attendance/select');
            }}
            className="bg-white shadow-sm hover:shadow-md hover:border-blue-200/60 border border-transparent active:scale-95 transition-all p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-on-surface">Take Attendance</span>
          </button>

          {/* Student Database */}
          <button 
            onClick={() => navigate('/students')}
            className="bg-white shadow-sm hover:shadow-md hover:border-emerald-200/60 border border-transparent active:scale-95 transition-all p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-on-surface">Student Database</span>
          </button>

          {/* Attendance Reports */}
          <button 
            onClick={() => navigate('/reports')}
            className="bg-white shadow-sm hover:shadow-md hover:border-violet-200/60 border border-transparent active:scale-95 transition-all p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>assessment</span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-on-surface">Attendance Reports</span>
          </button>

          {/* View Timetable */}
          <button 
            onClick={() => navigate('/timetable')}
            className="bg-white shadow-sm hover:shadow-md hover:border-amber-200/60 border border-transparent active:scale-95 transition-all p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-on-surface">View Timetable</span>
          </button>
        </div>


      </main>

    </div>
  );
};

export default Dashboard;
