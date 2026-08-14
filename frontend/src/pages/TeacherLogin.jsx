import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const TeacherLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherPhoto, setTeacherPhoto] = useState('');
  const navigate = useNavigate();
  const setTeacher = useStore((state) => state.setTeacher);

  const handleLogin = (e) => {
    e.preventDefault();
    const normalizedName = teacherName.trim() || 'Dr. Smith';
    setTeacher({
      teacherId: 1,
      teacherName: normalizedName,
      teacherPhoto: teacherPhoto || '',
      department: 'Computer Science',
    });
    try {
      localStorage.setItem('teacherName', normalizedName);
      if (teacherPhoto) {
        localStorage.setItem('teacherPhoto', teacherPhoto);
      } else {
        localStorage.removeItem('teacherPhoto');
      }
    } catch (storageError) {
      console.warn('Could not save teacher credentials to localStorage:', storageError);
    }
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        
        {/* Logo Section */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <img 
              className="w-full h-full object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9jjdQVFgX3uD4uGMNdLaUuJVr2yjSBV3Ww_mzPrGUjuQNv2uvyuH8upimXdu9rknsUh241g9X7P9gZjqb0KcH18wr7-vmA0qZ2-UsQToRZzIoh4qy_yPbyilhgzP9iTWsK-jYVG-Nog-vo2vwzXCil2ZLjKrxcIl3mlpZz68w8gD1_TWQv5WYgVC3qyrFcPMslaY7vei4LvAlKMSfy9E0XPj40l7egph5jMw23Wxlf_RU3Lex1Lu1ag" 
              alt="Logo" 
            />
          </div>
          <h1 className="text-2xl font-bold text-primary text-center tracking-tight">
            Smart Attendance System
          </h1>
          <p className="text-sm text-secondary mt-1 opacity-80">
            Teacher Login
          </p>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow border border-gray-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Teacher's Name Field */}
            <div className="relative group">
              <label 
                className="absolute left-3 -top-2 px-1 bg-white text-xs font-medium text-primary transition-all" 
                htmlFor="teacherName"
              >
                Teacher's Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                <span className="material-symbols-outlined text-gray-500 mr-2 text-sm">person</span>
                <input 
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-900 outline-none" 
                  id="teacherName" 
                  name="teacherName" 
                  placeholder="e.g. Dr. Sarah Smith" 
                  required 
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </div>
            </div>

            {/* Profile Photo Upload Field (Optional) */}
            <div className="relative group">
              <label 
                className="absolute left-3 -top-2 px-1 bg-white text-xs font-medium text-gray-500 group-focus-within:text-primary transition-all" 
                htmlFor="teacherPhoto"
              >
                Profile Photo (Optional)
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors bg-white">
                <span className="material-symbols-outlined text-gray-500 mr-2 text-sm">photo_camera</span>
                <input 
                  className="w-full text-xs text-gray-900 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  id="teacherPhoto" 
                  name="teacherPhoto" 
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setTeacherPhoto(reader.result);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setTeacherPhoto('');
                    }
                  }}
                />
              </div>
              {teacherPhoto && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={teacherPhoto} className="w-10 h-10 rounded-full object-cover border border-gray-300" alt="Preview" />
                  <button type="button" onClick={() => setTeacherPhoto('')} className="text-xs text-error font-medium hover:underline">Remove photo</button>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="relative group">
              <label 
                className="absolute left-3 -top-2 px-1 bg-white text-xs font-medium text-gray-500 group-focus-within:text-primary transition-all" 
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                <span className="material-symbols-outlined text-gray-500 mr-2 text-sm">mail</span>
                <input 
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-900 outline-none" 
                  id="email" 
                  name="email" 
                  placeholder="dr.smith@university.edu" 
                  required 
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group mt-6">
              <label 
                className="absolute left-3 -top-2 px-1 bg-white text-xs font-medium text-gray-500 group-focus-within:text-primary transition-all" 
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                <span className="material-symbols-outlined text-gray-500 mr-2 text-sm">lock</span>
                <input 
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-900 outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  className="text-gray-500 hover:text-primary transition-colors" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Login Action */}
            <div className="pt-2">
              <button 
                className={`w-full text-white py-3 rounded-lg font-medium shadow-md active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 ${isSuccess ? 'bg-green-600' : 'bg-primary'}`} 
                type="submit"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span> Authenticating...
                  </>
                ) : isSuccess ? (
                  <>
                    <span className="material-symbols-outlined">check_circle</span> Success
                  </>
                ) : (
                  <>
                    Login
                    <span className="material-symbols-outlined">login</span>
                  </>
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <a className="text-xs font-medium text-primary hover:underline underline-offset-4" href="#">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>

        {/* Help / Support Hint */}
        <p className="mt-8 text-xs text-gray-500 text-center px-6">
          Need help accessing your account? <br/>Contact the IT Support Desk.
        </p>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-400 tracking-widest uppercase">
          Smart Attendance v1.0
        </p>
      </footer>
    </div>
  );
};

export default TeacherLogin;
