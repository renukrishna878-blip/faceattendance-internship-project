import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const StudentDatabase = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Basic mock data
  const students = [
    { id: '2023CS01', name: 'Alex Rivera', dept: 'Computer Science', section: 'A', year: '3rd Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6t-3Ovyb8ooA_kyTGdJul7JfLImmJ947LFz4f5KYFDoAtKHjxD3QO6RZdcCkbmbrqUHlI2280VAu4Cr4OPHCZCAUSZ4V6lziCNNOVIGcoN_Ndl3UEVz3Zh5-SPvfqyCLk23cUrUmgmI1ig2m57CDClpMNcDhtCpkltjIduTf19JmZQX2WIGqJtsG95u4pUFrnzuHTd4V0B-RFbxJmFTtoeqcRV3D-44Rvi_lpu2yKpjuqNA7bK5o0RQ' },
    { id: '2023CS14', name: 'Priya Sharma', dept: 'Computer Science', section: 'B', year: '3rd Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5dPcS9zenyCTjbRIlPsAygqvhZCFvlTOOwfxCmZK3vmClsuM4vuZZaaHrfuAhOvByfzzJIFCjpBVnymFuTCCgYHj5pYEV5XH-s7hzkSql26iZWWBFkFUWdUQ3vVHC4YEgxW0OF2dRLpwO02fczzMzvUgfQnZR9Q-dTwXM4imrOl1Pd80WUIz9vRisNbQea699wo82grDAx22ihT1V739n3cTm-k_tWTueMNg9xpmvpJFG7TIxZONOHA' },
    { id: '2023EE08', name: 'Chen Wei', dept: 'Electrical Eng.', section: 'A', year: '2nd Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7J7DqVvkRMyL4fJXkY9Hy1HqiMlSDHyV6isHZ7ee2k6bptxt0Jmzx3tHK9_DdrpfBeGL_L2-Ycx_XrkbboaTOATLNkIEVmcGyvM0Xv7W49r2dbws33PI0au8pHzGUqTGxz_aRJKX6TimHYjYi6lyxbXlF05kX5xdKUTw5ZW5zHmJyHsbjOkjCSNAyM9RmBfXqqU2NJs2WVH6fVO8g8ltjqnx5f4jVdtziJ2kb35I8iQCwlvVWh4Dbug' },
    { id: '2023BA22', name: 'Sarah Johnson', dept: 'Business Admin', section: 'C', year: '4th Year', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1sK7ge7T_Ts0rEekOy8FVnGOJi0kqY32DB1yNcoco5PkMq3WckH_qAWJekGlDeBl_nxYeJfRCgErSrB6SAfa4gXFFGcu3dAL3D6wPprFg-nURKbHeGCLMrYbP--2_WYKl70DZokW_LV-7L3YJzQcYWtPZeFOUL4K96o13jpinMZ949mtb0HNPIk9J4x4qb4_4kv0deKFna1XfaSHQwtuzlD6hktdQqqfSkjaigzV1tLxMIaml5e7ZBQ' }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="font-sans text-on-surface bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-white shadow-sm md:pl-80 transition-all">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 hover:bg-gray-100 transition-colors active:scale-95 duration-150 rounded-full">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <h1 className="text-xl font-bold text-primary">Smart Attendance System</h1>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz7D3kyO6BiNFqVZHYb-H4bRdHrIm7QCZisbIuFk8rkN000Wr_tBEOrWC8ACJKZxD7gLsudTRaLu1CBKnAXB9a6xkbBXrWcUIoHUOTzAnkVPjr5urbbj4-hDzXVoFuuN9TV-fLCx6Xsu0fdtE4yILlYdW5I7Pq5MDl0N7kV-2FMi6SQBzGPSZnNt4GujRpseGZC_MmVinrcJ3WMY5E3mh-gXLVgIFZSW-TyifSUXpG6MvA2POWFOBT4w" 
              alt="Dr. Sarah Smith" 
            />
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-72 flex-col py-6 bg-white shadow-xl rounded-r-xl transition-transform border-r border-gray-100">
        <div className="px-6 pb-8 flex flex-col gap-1 mt-14">
          <div className="w-16 h-16 rounded-full bg-gray-100 mb-3 overflow-hidden border-2 border-primary">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0H4CaD7-8zexM52khgwhlZYDaKwfJQmi4i6ZZ-I3bSN1iZpJ812jmJfMKUN1zVfC-GvhUrh0uZ8mJhO8g9ebC74a3xmgin75a03m3ltsjSgURFucrTAazYOSoX0RZycj3HNG_Ih2FuYAoTnDViauF2eR9nuJ220eLiho_nF2VmzR3dbcFIaRvmQmPAWC6lXu80xLeBNRcYCHts1sKvkiRC3wgbPD52t6Ge5kUV3QE8rqJTFrqoSca6w" alt="Profile" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Dr. Sarah Smith</h2>
          <p className="text-sm text-gray-600">Computer Science Dept</p>
          <p className="text-xs text-gray-400">Faculty ID: 4829</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:bg-gray-100 mx-2 px-4 py-3 flex items-center gap-4 transition-all duration-200 rounded-lg text-left">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button className="bg-blue-100 text-blue-900 font-bold rounded-lg mx-2 px-4 py-3 flex items-center gap-4 transition-all duration-200 text-left">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            <span className="text-sm font-medium">Student Roster</span>
          </button>
          <button onClick={() => navigate('/reports')} className="text-gray-600 hover:bg-gray-100 mx-2 px-4 py-3 flex items-center gap-4 transition-all duration-200 rounded-lg text-left">
            <span className="material-symbols-outlined">event_note</span>
            <span className="text-sm font-medium">Attendance Log</span>
          </button>
          
          <div className="mt-auto absolute bottom-4 w-full flex flex-col gap-2">
            <button className="text-gray-600 hover:bg-gray-100 mx-2 px-4 py-3 flex items-center gap-4 transition-all duration-200 rounded-lg text-left">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button onClick={() => navigate('/login')} className="text-red-600 mx-2 px-4 py-3 flex items-center gap-4 hover:bg-red-50 transition-all duration-200 rounded-lg text-left">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4 md:ml-72 md:px-8 min-h-screen">
        <section className="max-w-5xl mx-auto mb-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-on-surface">Student Database</h2>
              <p className="text-sm text-gray-500">Manage academic profiles and enrollment data.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm shadow-sm" placeholder="Search by name, ID or department..." type="text"/>
            </div>
          </div>

          {/* Stats Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-bold text-primary mt-1">1,248</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Departments</p>
              <p className="text-2xl font-bold text-primary mt-1">12</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</p>
              <p className="text-2xl font-bold text-primary mt-1">48</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-primary mt-1">14</p>
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
              <div className="col-span-4">Student Identity</div>
              <div className="col-span-2">Reg. Number</div>
              <div className="col-span-3">Department</div>
              <div className="col-span-1 text-center">Sec</div>
              <div className="col-span-1 text-center">Year</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* List */}
            {students.map((student, index) => (
              <div 
                key={student.id}
                style={{ 
                  opacity: isLoaded ? 1 : 0, 
                  transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
                  transition: `all 0.4s ease-out ${index * 0.1}s`
                }}
                className="hover:shadow-md hover:-translate-y-0.5 bg-white border border-gray-200 rounded-xl px-4 py-3 transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/students/${student.id}`)}
              >
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                      <img className="w-full h-full object-cover" src={student.img} alt={student.name} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500 md:hidden">{student.id} • {student.dept}</p>
                    </div>
                  </div>
                  <div className="hidden md:block col-span-2 text-sm text-gray-600 font-medium">{student.id}</div>
                  <div className="hidden md:block col-span-3 text-sm text-gray-500">{student.dept}</div>
                  <div className="hidden md:block col-span-1 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg py-1">{student.section}</div>
                  <div className="hidden md:block col-span-1 text-center text-sm text-gray-500">{student.year}</div>
                  <div className="col-span-12 md:col-span-1 flex justify-end gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/students/${student.id}`); }}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 transition-colors rounded-full active:scale-90"
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FAB - Add Student */}
      <button 
        onClick={() => navigate('/students/add')}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-90 transition-all flex items-center justify-center z-40 group"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-white px-2 py-2 shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
        <a className="flex flex-col items-center justify-center text-gray-500 px-4 py-1 hover:bg-gray-50 transition-all active:scale-90" href="/dashboard">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-blue-100 text-primary rounded-xl px-4 py-1 active:scale-90" href="/students">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          <span className="text-[10px] font-medium mt-1">Students</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 px-4 py-1 hover:bg-gray-50 transition-all active:scale-90" href="/reports">
          <span className="material-symbols-outlined">assessment</span>
          <span className="text-[10px] font-medium mt-1">Reports</span>
        </a>
      </nav>
    </div>
  );
};

export default StudentDatabase;
