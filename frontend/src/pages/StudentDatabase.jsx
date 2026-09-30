import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { DEPARTMENTS, generateRoster } from '../utils/timetableData';

const StudentDatabase = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const teacher = useStore((state) => state.teacher);
  const token = useStore((state) => state.token);
  const teacherName = teacher?.teacherName || localStorage.getItem('teacherName') || 'Dr. Sarah Smith';
  const teacherPhoto = teacher?.teacherPhoto || localStorage.getItem('teacherPhoto');

  const [studentsList, setStudentsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        const formatted = data.data.map(student => {
          const displayYear = student.year ? `${student.year}${student.year === 1 ? 'st' : student.year === 2 ? 'nd' : student.year === 3 ? 'rd' : 'th'} Year` : '3rd Year';
          const photo = student.photo_url || student.primary_photo;
          const fullImgUrl = photo
            ? (photo.startsWith('http') ? photo : `http://localhost:5000${photo}`)
            : null;

          return {
            id: student.register_number,
            name: student.name,
            dept: student.department_name || 'Computer Science & Engineering',
            section: student.section || 'C',
            year: displayYear,
            img: fullImgUrl
          };
        });
        setStudentsList(formatted);
      } else {
        setStudentsList([]);
      }
    } catch (err) {
      console.warn('Backend API student fetch error:', err.message);
      setStudentsList([]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [token]);

  const handleDownloadTemplate = () => {
    window.open('http://localhost:5000/api/students/sample-excel', '_blank');
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setToastMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/students/import-excel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setToastMessage({
          type: 'success',
          text: `Import Complete! ${result.data?.inserted || 0} students added, ${result.data?.updated || 0} records updated in database.`
        });
        loadStudents();
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (err) {
      console.warn('Backend CSV import failed, falling back to local CSV parser:', err.message);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 1) {
            const imported = [];
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
              if (cols.length >= 2 && cols[0] && cols[1]) {
                imported.push({
                  id: cols[0],
                  name: cols[1],
                  dept: cols[2] || 'Computer Science & Engineering',
                  year: cols[3] ? `${cols[3]} Year` : '3rd Year',
                  section: cols[4] || 'A',
                  img: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cols[0]}`
                });
              }
            }
            if (imported.length > 0) {
              setStudentsList(prev => [...imported, ...prev]);
              setToastMessage({
                type: 'success',
                text: `Successfully imported ${imported.length} student records from ${file.name}!`
              });
            }
          }
        } catch (parseErr) {
          setToastMessage({ type: 'error', text: 'Could not read CSV file.' });
        }
      };
      reader.readAsText(file);
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (student.dept && student.dept.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDept = !filterDept || 
                        (student.dept && student.dept.toLowerCase().includes(DEPARTMENTS[filterDept]?.name.toLowerCase())) ||
                        (student.id && student.id.toLowerCase().includes(filterDept.toLowerCase()));

    const matchesYear = !filterYear || 
                        (student.year && String(student.year).includes(filterYear));

    const matchesSection = !filterSection || 
                           (student.section && student.section === filterSection);

    return matchesSearch && matchesDept && matchesYear && matchesSection;
  });

  const totalStudents = filteredStudents.length;
  const departmentsCount = new Set(filteredStudents.map(s => s.dept)).size;
  const sectionsCount = new Set(filteredStudents.map(s => `${s.dept}-${s.year}-${s.section}`)).size;
  const matchCount = filteredStudents.length;

  return (
    <div className="font-sans text-on-surface bg-gray-50 min-h-screen">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-white border-l-4 border-emerald-500 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-emerald-500">check_circle</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Google Form Sync</p>
            <p className="text-xs text-gray-600 mt-1">{toastMessage.text}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-white shadow-sm md:pl-72 transition-all">
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
              alt={teacherName} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4 md:px-8 min-h-screen">
        <section className="max-w-5xl mx-auto mb-6">
          
          <div className="flex flex-col gap-4 mb-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Student Database</h2>
                <p className="text-xs sm:text-sm text-gray-500">Manage academic profiles and enrollment data.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => navigate('/registrations')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                  title="Configure Google Form details and test real-time student registration"
                >
                  <span className="material-symbols-outlined text-[16px]">dynamic_form</span>
                  <span>Google Form & Live Testing</span>
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                  title="Download sample Google Form / CSV template"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>CSV Template</span>
                </button>
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>{isImporting ? 'Importing...' : 'Import Form (CSV)'}</span>
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleFileImport}
                    disabled={isImporting}
                    className="hidden" 
                  />
                </label>
                <button
                  onClick={() => navigate('/students/add')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:brightness-110 text-white rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            <div className="relative w-full group mt-2">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm shadow-inner" 
                placeholder="Search by name, ID, or department..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
                <select 
                  value={filterDept} 
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                    key !== 'ee' ? <option key={key} value={key}>{dept.name}</option> : null
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Academic Year</label>
                <select 
                  value={filterYear} 
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Section</label>
                <select 
                  value={filterSection} 
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  <option value="">All Sections</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-bold text-primary mt-1">{totalStudents}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Departments</p>
              <p className="text-2xl font-bold text-primary mt-1">{departmentsCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</p>
              <p className="text-2xl font-bold text-primary mt-1">{sectionsCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filtered Match</p>
              <p className="text-2xl font-bold text-primary mt-1">{matchCount}</p>
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
            {filteredStudents.map((student, index) => (
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

    </div>
  );
};

export default StudentDatabase;
