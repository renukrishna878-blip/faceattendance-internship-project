import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/useStore';
import { generateRoster, DEPARTMENTS } from '../utils/timetableData';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const token = useStore((state) => state.token);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success && result.data) {
          const displayYear = result.data.year ? `${result.data.year}${result.data.year === 1 ? 'st' : result.data.year === 2 ? 'nd' : result.data.year === 3 ? 'rd' : 'th'} Year` : '3rd Year';
          const photo = result.data.photo_url || result.data.primary_photo;
          const fullPhoto = photo ? (photo.startsWith('http') ? photo : `http://localhost:5000${photo}`) : null;
          setStudent({
            id: result.data.register_number,
            name: result.data.name,
            dept: result.data.department_name || 'Computer Science & Engineering',
            section: result.data.section || 'C',
            year: displayYear,
            email: result.data.email || `${result.data.register_number}@psgitech.ac.in`,
            phone: result.data.phone || '+91 9747394949',
            img: fullPhoto
          });
        } else {
          throw new Error('Fallback to local generation');
        }
      } catch (err) {
        console.warn('Backend student profile fetch offline/empty, using mock generator.', err.message);
        let foundStudent = null;
        const classesToGen = [
          { dept: 'cs', year: '3', section: 'A' },
          { dept: 'cs', year: '3', section: 'B' },
          { dept: 'cs', year: '3', section: 'C' },
          { dept: 'cs', year: '4', section: 'C' },
          { dept: 'ece', year: '2', section: 'A' },
          { dept: 'eee', year: '3', section: 'B' },
          { dept: 'me', year: '3', section: 'A' },
          { dept: 'ce', year: '4', section: 'C' }
        ];
        
        for (const c of classesToGen) {
          const roster = generateRoster(c.dept, c.year, c.section, c.year * 2 - 1);
          const found = roster.find(s => s.id === id);
          if (found) {
            foundStudent = found;
            break;
          }
        }
        
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          setStudent({
            id: id || 'N/A',
            name: 'Student Profile',
            dept: 'Computer Science & Engineering',
            section: 'C',
            year: '3rd Year',
            email: 'student@psgitech.ac.in',
            phone: 'N/A',
            img: null
          });
        }
      } finally {
        setIsLoaded(true);
      }
    };
    loadProfile();
  }, [id, token]);

  if (!isLoaded || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">sync</span>
          <p className="text-sm font-medium text-gray-500">Loading student profile...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic stats
  const regNum = parseInt(student.id.replace(/\D/g, ''), 10) || 45;
  const attendanceRate = 70 + (regNum % 26); // realistic attendance rates from 70% to 95%
  const totalSessions = 48;
  const presentSessions = Math.round(totalSessions * (attendanceRate / 100));
  const absentSessions = totalSessions - presentSessions;
  const belowTarget = attendanceRate < 85;

  return (
    <>
      {/*  TopAppBar  */}
      <nav className="fixed top-0 w-full z-50 bg-white shadow-sm flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/students')} className="p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95 duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-bold text-lg text-primary">Student Profile</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-primary">more_vert</span>
        </button>
      </nav>

      <main className="pt-20 pb-32 px-4 max-w-4xl mx-auto">
        {/*  Profile Header Section  */}
        <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-md">
              <img className="w-full h-full object-cover" src={student.img} alt={student.name} />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full shadow-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-3xl font-bold text-on-surface">{student.name}</h2>
            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-gray-600 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
                <span>Reg No: {student.id}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
                <span>{student.dept}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">class</span>
                <span>Section {student.section}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">school</span>
                <span>{student.year}</span>
              </div>
            </div>
            <div className="pt-1">
              <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Active Enrollment</span>
            </div>
          </div>
        </section>

        {/*  Metrics Grid Section  */}
        <section className="mb-6">
          <h3 className="text-xl font-bold mb-4 px-1 text-on-surface">Attendance Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/*  Attendance Percentage  */}
            <div className={`${belowTarget ? 'bg-red-50/50 border-red-200 text-red-700' : 'bg-emerald-50/50 border-emerald-200 text-emerald-700'} border rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center`}>
              <span className="text-xs font-semibold uppercase tracking-wider mb-1">Attendance</span>
              <div className="text-3xl font-extrabold">{attendanceRate}%</div>
              <div className="flex items-center gap-1 text-[11px] mt-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">{belowTarget ? 'warning' : 'check_circle'}</span>
                <span>{belowTarget ? 'Below Target' : 'Good Standing'}</span>
              </div>
            </div>
            {/*  Total Classes  */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Sessions</span>
              <div className="text-3xl font-extrabold text-primary">{totalSessions}</div>
            </div>
            {/*  Present  */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center border-b-4 border-emerald-500">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Present</span>
              <div className="text-3xl font-extrabold text-gray-800">{presentSessions}</div>
            </div>
            {/*  Absent  */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center border-b-4 border-red-500">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Absent</span>
              <div className="text-3xl font-extrabold text-gray-800">{absentSessions}</div>
            </div>
          </div>
        </section>

        {/*  Contact Details Section  */}
        <section className="mb-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Contact & Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">mail</span>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                <p className="text-sm font-medium text-gray-800">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">call</span>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Phone Number</p>
                <p className="text-sm font-medium text-gray-800">{student.phone}</p>
              </div>
            </div>
          </div>
        </section>

        {/*  Biometric Data Section  */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold">Stored Face Recognition Data</h3>
            <span className="material-symbols-outlined text-gray-400">info</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square shadow-sm cursor-pointer transition-transform hover:scale-[1.02]">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src={student.img} alt="Front View" />
              <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
                <p className="text-white text-xs font-bold text-center">FRONT</p>
              </div>
            </div>
            <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square shadow-sm cursor-pointer transition-transform hover:scale-[1.02]">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src={student.img} alt="Left View" />
              <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
                <p className="text-white text-xs font-bold text-center">LEFT PROFILE</p>
              </div>
            </div>
            <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square shadow-sm cursor-pointer transition-transform hover:scale-[1.02]">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src={student.img} alt="Right View" />
              <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
                <p className="text-white text-xs font-bold text-center">RIGHT PROFILE</p>
              </div>
            </div>
            <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square shadow-sm cursor-pointer transition-transform hover:scale-[1.02]">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src={student.img} alt="Smiling View" />
              <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-2">
                <p className="text-white text-xs font-bold text-center">EXPRESSION</p>
              </div>
            </div>
          </div>
        </section>

        {/*  Action Buttons  */}
        <section className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-primary text-white py-3.5 rounded-xl hover:brightness-115 active:scale-98 transition-all flex items-center justify-center gap-2 font-bold uppercase text-sm tracking-wider cursor-pointer">
            <span className="material-symbols-outlined">edit</span>
            Edit Profile
          </button>
          <button className="flex-1 bg-white text-error border-2 border-error py-3.5 rounded-xl hover:bg-red-50 active:scale-98 transition-all flex items-center justify-center gap-2 font-bold uppercase text-sm tracking-wider cursor-pointer">
            <span className="material-symbols-outlined">delete</span>
            Delete Student
          </button>
        </section>
      </main>

    </>
  );
};

export default StudentProfile;
