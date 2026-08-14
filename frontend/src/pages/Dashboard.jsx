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
    <div className="font-sans text-on-surface pb-20">
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 w-full bg-surface shadow-sm flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-4">
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
          <div className="cursor-pointer active:scale-95 transition-transform hover:bg-gray-200 p-2 rounded-full text-primary">
            <span className="material-symbols-outlined">settings</span>
          </div>
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
                  className="w-full bg-transparent border-none py-2 px-3 text-sm focus:ring-0 cursor-pointer outline-none" 
                  value={currentDept} 
                  onChange={(e) => {
                    setCurrentDept(e.target.value);
                    setCurrentSubjectId('');
                  }}
                >
                  <option value="">Select Department</option>
                  {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                    <option key={key} value={key}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Present Session</label>
              <div className="relative rounded-lg border border-gray-300 bg-surface">
                <select 
                  className="w-full bg-transparent border-none py-2 px-3 text-sm focus:ring-0 cursor-pointer outline-none"
                  value={currentSubjectId}
                  onChange={(e) => setCurrentSubjectId(e.target.value)}
                  disabled={!currentDept}
                >
                  <option value="">Select Session</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
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

        {/* Main Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Take Attendance */}
          <button 
            onClick={() => navigate('/attendance/select')}
            className="bg-white shadow-sm active:scale-95 transition-transform p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">photo_camera</span>
            </div>
            <span className="text-lg font-medium text-on-surface">Take Attendance</span>
          </button>

          {/* Student Database */}
          <button 
            onClick={() => navigate('/students')}
            className="bg-white shadow-sm active:scale-95 transition-transform p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">group</span>
            </div>
            <span className="text-lg font-medium text-on-surface">Student Database</span>
          </button>

          {/* Attendance Reports */}
          <button 
            onClick={() => navigate('/reports')}
            className="bg-white shadow-sm active:scale-95 transition-transform p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">assessment</span>
            </div>
            <span className="text-lg font-medium text-on-surface">Attendance Reports</span>
          </button>

          {/* View Timetable */}
          <button 
            onClick={() => navigate('/timetable')}
            className="bg-white shadow-sm active:scale-95 transition-transform p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">calendar_today</span>
            </div>
            <span className="text-lg font-medium text-on-surface">View Timetable</span>
          </button>
        </div>

        {/* Recent Activity */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-on-surface px-1">Recent Activity</h3>
          <div className="bg-white shadow-sm rounded-xl divide-y divide-gray-200 overflow-hidden">
            
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>
                <div>
                  <p className="text-base text-on-surface">Low Attendance Alert</p>
                  <p className="text-sm text-gray-500">Discrete Math • 3 Students flagged</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                </div>
                <div>
                  <p className="text-base text-on-surface">Report Finalized</p>
                  <p className="text-sm text-gray-500">Machine Learning • Week 12</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </div>

          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-16 px-2 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 rounded-t-xl">
        <button className="flex flex-col items-center justify-center bg-blue-100 text-primary rounded-full px-4 py-1 active:scale-90 transition-all duration-200" onClick={() => navigate('/dashboard')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-500 px-4 py-1 hover:bg-gray-100 active:scale-90 transition-all duration-200" onClick={() => navigate('/students')}>
          <span className="material-symbols-outlined">school</span>
          <span className="text-xs font-medium">Students</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-500 px-4 py-1 hover:bg-gray-100 active:scale-90 transition-all duration-200" onClick={() => navigate('/reports')}>
          <span className="material-symbols-outlined">assessment</span>
          <span className="text-xs font-medium">Reports</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
