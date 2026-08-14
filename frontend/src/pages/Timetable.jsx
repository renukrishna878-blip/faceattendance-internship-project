import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS, WEEKLY_TIMETABLE } from '../utils/timetableData';

const Timetable = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('');

  const timetableEntries = selectedDept ? WEEKLY_TIMETABLE[selectedDept] || [] : [];
  
  // Group entries by day of week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const groupedTimetable = daysOfWeek.reduce((acc, day) => {
    acc[day] = timetableEntries.filter(entry => entry.day === day);
    return acc;
  }, {});

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-14 bg-surface shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="material-symbols-outlined text-primary transition-colors duration-200 active:scale-95 hover:bg-surface-variant/50 p-2 rounded-full cursor-pointer"
          >
            arrow_back
          </button>
          <h1 className="font-title-lg text-title-lg text-primary">Academic Timetable</h1>
        </div>
      </header>

      <main className="pt-20 pb-24 px-margin-mobile max-w-2xl mx-auto">
        <section className="mb-lg">
          <h2 className="font-headline-md text-headline-md text-on-surface">Weekly Schedule</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Select a department to view the weekly class schedule, subjects, timings, and faculty members.</p>
        </section>

        {/* Dropdown Box */}
        <section className="mb-8">
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant/30">
            <label className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-2">Choose Department</label>
            <div className="relative focus-ring rounded-lg border border-outline-variant bg-surface transition-all">
              <select 
                className="w-full bg-transparent border-none py-3 px-4 font-body-lg text-body-lg focus:ring-0 cursor-pointer" 
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">-- Select Department --</option>
                {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                  <option key={key} value={key}>{dept.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
            </div>
          </div>
        </section>

        {/* Timetable Schedule Grid */}
        {selectedDept ? (
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const entries = groupedTimetable[day] || [];
              return (
                <div key={day} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
                  <div className="bg-primary-container px-4 py-3 border-b border-outline-variant/20 flex items-center justify-between">
                    <h3 className="font-title-lg text-title-md text-on-primary-container font-bold">{day}</h3>
                    <span className="bg-white/80 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{entries.length} Classes</span>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {entries.length > 0 ? (
                      entries.map((entry, idx) => (
                        <div key={idx} className="p-4 hover:bg-surface-variant/5 transition-colors flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-title-md text-body-lg text-on-surface font-semibold">{entry.subject}</h4>
                              <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[14px]">person</span>
                                Faculty: <span className="text-primary font-medium">{entry.faculty}</span>
                              </p>
                            </div>
                            <span className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-2.5 py-1 rounded-md">
                              {entry.room}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                            <span>{entry.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-on-surface-variant italic text-sm">
                        No classes scheduled for {day}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-12 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-outline text-5xl">calendar_month</span>
            <p className="text-on-surface-variant text-sm font-medium">Please select a department above to see the weekly schedule.</p>
          </div>
        )}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container flex justify-around items-center h-20 px-base pb-safe shadow-lg">
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant active:scale-90 transition-transform duration-200" onClick={() => navigate('/dashboard')}>
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-label-md">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant active:scale-90 transition-transform duration-200" onClick={() => navigate('/students')}>
          <span className="material-symbols-outlined">school</span>
          <span className="font-label-md text-label-md">Students</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant active:scale-90 transition-transform duration-200" onClick={() => navigate('/reports')}>
          <span className="material-symbols-outlined">assessment</span>
          <span className="font-label-md text-label-md">Reports</span>
        </button>
      </nav>
    </>
  );
};

export default Timetable;
