import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const logout = useStore((state) => state.logout);
  const teacher = useStore((state) => state.teacher);
  const teacherName = teacher?.teacherName || localStorage.getItem('teacherName') || 'Dr. Smith';
  const teacherPhoto = teacher?.teacherPhoto || localStorage.getItem('teacherPhoto') || '';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Take Attendance', path: '/attendance/select', icon: 'photo_camera' },
    { name: 'Student Database', path: '/students', icon: 'school' },
    { name: 'Form Registrations', path: '/registrations', icon: 'how_to_reg' },
    { name: 'Attendance Reports', path: '/reports', icon: 'assessment' },
    { name: 'View Timetable', path: '/timetable', icon: 'calendar_today' },
    { name: 'My Profile', path: '/profile', icon: 'manage_accounts' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-on-surface md:pl-72 pb-20 md:pb-0">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-72 flex-col py-6 bg-white shadow-xl rounded-r-xl border-r border-gray-100">
        {/* App Logo/Header */}
        <div className="px-6 pb-6 flex items-center gap-3 border-b border-gray-100">
          <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
          <div>
            <h1 className="text-lg font-bold text-primary leading-tight">Smart Attendance</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">AI Powered System</p>
          </div>
        </div>

        {/* Faculty Profile Summary */}
        <div 
          onClick={() => navigate('/profile')} 
          className="px-6 py-5 flex items-center gap-4 bg-gray-50/50 hover:bg-gray-100/80 my-4 border-y border-gray-100/60 cursor-pointer transition-colors"
          title="Manage Faculty Profile"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-blue-100 flex items-center justify-center flex-shrink-0">
            {teacherPhoto ? (
              <img className="w-full h-full object-cover" src={teacherPhoto} alt="Faculty portrait" />
            ) : (
              <span className="material-symbols-outlined text-primary text-xl">person</span>
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-gray-900 truncate" title={teacherName}>{teacherName}</h4>
            <p className="text-xs text-gray-500">Faculty Member</p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full px-4 py-3 flex items-center gap-4 rounded-xl text-left transition-all duration-200 cursor-pointer active:scale-98 ${
                  active
                    ? 'bg-blue-100/70 text-primary font-bold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer actions */}
        <div className="px-3 pt-4 border-t border-gray-100 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-4 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-100 z-50 flex justify-around items-center rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 cursor-pointer ${
                active
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold mt-0.5">{item.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Pages Content Injection */}
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
