import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TeacherRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, department, phone } = formData;

    // Client-side validations
    if (!name || !email || !password || !confirmPassword || !department || !phone) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, department, phone })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        if (data.message && data.message.toLowerCase().includes('already exists')) {
          setError('Account already exists.');
        } else {
          setError(data.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface dark:bg-surface-dim flex flex-col md:flex-row">
      {/* Left Side - Brand Banner */}
      <section className="hidden md:flex flex-1 bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container/20 blur-3xl"></div>
        
        <div className="z-10 text-center max-w-md">
          <span className="material-symbols-outlined text-[80px] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
          <h1 className="font-display-md text-display-md mb-4 font-bold tracking-tight">Join Smart Attendance</h1>
          <p className="font-body-lg text-body-lg opacity-90 leading-relaxed">Register your teacher account to start managing classes, taking automated attendance, and generating detailed reports.</p>
        </div>
      </section>

      {/* Right Side - Register Form */}
      <section className="flex-1 flex flex-col justify-center p-6 sm:p-12 md:p-16 lg:p-20 max-w-[650px] w-full mx-auto relative overflow-y-auto">
        <div className="w-full">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-semibold tracking-tight">Create Account</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">Enter your details to register a new teacher account.</p>

          {error && <div className="mb-4 text-error font-bold text-center bg-error-container p-3 rounded-lg border border-error/20">{error}</div>}
          {successMsg && <div className="mb-4 text-primary font-bold text-center bg-primary-container p-3 rounded-lg border border-primary/20">{successMsg}</div>}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1 relative group">
              <label className="text-sm font-medium text-on-surface-variant ml-1" htmlFor="name">Full Name *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-12 pl-12 pr-4 bg-surface-container-highest dark:bg-surface-container border-b-2 border-outline-variant hover:border-on-surface focus:border-primary outline-none transition-all rounded-t-lg text-on-surface" 
                  placeholder="e.g. Dr. Jane Smith"
                  required 
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1 relative group">
              <label className="text-sm font-medium text-on-surface-variant ml-1" htmlFor="email">Email Address *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 pl-12 pr-4 bg-surface-container-highest dark:bg-surface-container border-b-2 border-outline-variant hover:border-on-surface focus:border-primary outline-none transition-all rounded-t-lg text-on-surface" 
                  placeholder="e.g. jane.smith@university.edu"
                  required 
                />
              </div>
            </div>

            {/* Department & Phone Number Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 relative group">
                <label className="text-sm font-medium text-on-surface-variant ml-1" htmlFor="department">Department *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">domain</span>
                  <input 
                    type="text" 
                    id="department" 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 bg-surface-container-highest dark:bg-surface-container border-b-2 border-outline-variant hover:border-on-surface focus:border-primary outline-none transition-all rounded-t-lg text-on-surface" 
                    placeholder="e.g. Computer Science"
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 relative group">
                <label className="text-sm font-medium text-on-surface-variant ml-1" htmlFor="phone">Phone Number *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">call</span>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 bg-surface-container-highest dark:bg-surface-container border-b-2 border-outline-variant hover:border-on-surface focus:border-primary outline-none transition-all rounded-t-lg text-on-surface" 
                    placeholder="e.g. +1 555 0192"
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 relative group">
                <label className="text-sm font-medium text-on-surface-variant ml-1" htmlFor="password">Password *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    type="password" 
                    id="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 bg-surface-container-highest dark:bg-surface-container border-b-2 border-outline-variant hover:border-on-surface focus:border-primary outline-none transition-all rounded-t-lg text-on-surface" 
                    placeholder="Min 6 chars"
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 relative group">
                <label className="text-sm font-medium text-on-surface-variant ml-1" htmlFor="confirmPassword">Confirm Password *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 bg-surface-container-highest dark:bg-surface-container border-b-2 border-outline-variant hover:border-on-surface focus:border-primary outline-none transition-all rounded-t-lg text-on-surface" 
                    placeholder="Re-enter password"
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 mt-4 bg-primary text-on-primary rounded-full font-label-lg text-label-lg active:scale-95 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-outline-variant/30 pt-6">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TeacherRegister;
