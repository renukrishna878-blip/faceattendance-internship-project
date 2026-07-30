import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-on-surface pb-20">
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 w-full bg-surface shadow-sm flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJj_HxsvAPV14Et7k6yzzDsc_UnWKmf4K1Lej2olPHZqzOU6lpj5TdcC1oyvgfa0mtLwB0kxgcpSzmSv5ccQXKBhlibpOEwq6rnAGaN-S_RyBHFL03yB-eLmHoXp8pmW3_TCuzAtzqF5EoNg7-_UD37byNPMBEyeMYEWkDundbu_ZGVPXlwqP6w_Rqwbn5_4KXcs5yRmzFBKEqtqB5g_FcCu3vUNlBQDgelJM7fcLy7zcPdV3n9c-L2g"
              alt="Profile"
            />
          </div>
          <h1 className="text-lg font-medium text-primary">Welcome, Dr. Smith</h1>
        </div>
        <div className="cursor-pointer active:scale-95 transition-transform hover:bg-gray-200 p-2 rounded-full">
          <span className="material-symbols-outlined text-primary">settings</span>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-6">
        {/* Hero/Summary Section */}
        <section className="bg-white shadow-sm rounded-xl p-6 flex flex-col gap-3 border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-medium text-secondary uppercase tracking-wider">Next Session</p>
              <h2 className="text-xl font-semibold text-on-surface">Advanced AI</h2>
            </div>
            <div className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-medium">
              10:00 AM
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="text-sm">Lecture Hall 4B • Science Block</span>
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

          {/* Profile */}
          <button 
            className="bg-white shadow-sm active:scale-95 transition-transform p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">person</span>
            </div>
            <span className="text-lg font-medium text-on-surface">Profile</span>
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
        <a className="flex flex-col items-center justify-center bg-blue-100 text-primary rounded-full px-4 py-1 active:scale-90 transition-all duration-200" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-xs font-medium">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 px-4 py-1 hover:bg-gray-100 active:scale-90 transition-all duration-200" href="/reports">
          <span className="material-symbols-outlined">assessment</span>
          <span className="text-xs font-medium">Reports</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 px-4 py-1 hover:bg-gray-100 active:scale-90 transition-all duration-200" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-xs font-medium">Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default Dashboard;
