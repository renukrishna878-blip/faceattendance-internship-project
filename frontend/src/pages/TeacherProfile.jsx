import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const TeacherProfile = () => {
  const navigate = useNavigate();
  const token = useStore(state => state.token);
  const logout = useStore(state => state.logout);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', department: '', phone: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setEditForm({
          name: data.data.name || '',
          department: data.data.department || '',
          phone: data.data.phone || ''
        });
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Network error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setMessage('Profile updated successfully!');
        setIsEditModalOpen(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error updating profile');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordSubmitting(true);
    setPasswordError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Password changed successfully!');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setIsPasswordModalOpen(false);
      } else {
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('Network error changing password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center text-on-surface">Loading profile...</div>;

  return (
    <div className="font-sans text-on-surface pb-24 min-h-screen bg-surface">
      {/* TopAppBar */}
      <header className="fixed top-0 z-40 w-full bg-surface shadow-sm flex items-center px-4 py-3 gap-4 border-b border-outline-variant">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-surface-container rounded-full active:scale-95 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-primary">Teacher Profile</h1>
      </header>

      <main className="pt-20 px-4 max-w-2xl mx-auto space-y-6">
        
        {message && <div className="bg-primary-container text-on-primary-container p-3 rounded-xl text-center font-semibold text-sm">{message}</div>}
        {error && <div className="bg-error-container text-error p-3 rounded-xl text-center font-semibold text-sm">{error}</div>}

        {/* Profile Card Header */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center text-3xl font-bold uppercase shadow-md">
            {profile?.name ? profile.name.substring(0, 2) : 'TR'}
          </div>
          <div className="space-y-1 flex-1">
            <h2 className="text-2xl font-bold text-on-surface">{profile?.name || 'Teacher'}</h2>
            <p className="text-sm text-on-surface-variant font-medium">{profile?.email}</p>
            <div className="inline-block bg-primary/10 text-primary font-semibold text-xs px-3 py-1 rounded-full uppercase mt-2">
              {profile?.role || 'Teacher'}
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant space-y-4">
          <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant pb-3">Personal Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-surface-container-low rounded-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Full Name</p>
              <p className="text-base font-semibold text-on-surface mt-0.5">{profile?.name || 'N/A'}</p>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Email Address</p>
              <p className="text-base font-semibold text-on-surface mt-0.5 truncate">{profile?.email || 'N/A'}</p>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Department</p>
              <p className="text-base font-semibold text-on-surface mt-0.5">{profile?.department || 'Not specified'}</p>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">Phone Number</p>
              <p className="text-base font-semibold text-on-surface mt-0.5">{profile?.phone || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-3.5 rounded-full font-bold text-on-primary bg-primary hover:bg-primary-container-dark active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Profile
          </button>

          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full py-3.5 rounded-full font-bold text-primary bg-primary-container hover:bg-primary-container-dark active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">lock_reset</span>
            Change Password
          </button>

          <button 
            onClick={handleLogout}
            className="w-full py-3.5 rounded-full font-bold text-error bg-error-container hover:bg-error-container-dark active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>

      </main>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 border border-outline-variant">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-3">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">Full Name *</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full mt-1 py-2.5 px-3 border border-outline-variant rounded-xl text-on-surface bg-surface-container-highest"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">Department</label>
                <input 
                  type="text" 
                  value={editForm.department}
                  onChange={e => setEditForm({...editForm, department: e.target.value})}
                  className="w-full mt-1 py-2.5 px-3 border border-outline-variant rounded-xl text-on-surface bg-surface-container-highest"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">Phone Number</label>
                <input 
                  type="tel" 
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full mt-1 py-2.5 px-3 border border-outline-variant rounded-xl text-on-surface bg-surface-container-highest"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full font-medium bg-surface-container text-on-surface-variant"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={editSubmitting}
                  className="flex-1 py-2.5 rounded-full font-bold bg-primary text-on-primary shadow-sm"
                >
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 border border-outline-variant">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-3">Change Password</h3>
            {passwordError && <div className="text-error font-medium text-xs bg-error-container p-2 rounded-lg text-center">{passwordError}</div>}
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">Old Password *</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword}
                  onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="w-full mt-1 py-2.5 px-3 border border-outline-variant rounded-xl text-on-surface bg-surface-container-highest"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">New Password *</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full mt-1 py-2.5 px-3 border border-outline-variant rounded-xl text-on-surface bg-surface-container-highest"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-on-surface-variant">Confirm New Password *</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full mt-1 py-2.5 px-3 border border-outline-variant rounded-xl text-on-surface bg-surface-container-highest"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full font-medium bg-surface-container text-on-surface-variant"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={passwordSubmitting}
                  className="flex-1 py-2.5 rounded-full font-bold bg-primary text-on-primary shadow-sm"
                >
                  {passwordSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
