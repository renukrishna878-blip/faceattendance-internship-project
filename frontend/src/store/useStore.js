import { create } from 'zustand';

const useStore = create((set) => ({
  // --- Teacher Context ---
  teacher: {
    teacherId: null,
    teacherName: typeof window !== 'undefined' ? (localStorage.getItem('teacherName') || '') : '',
    teacherPhoto: typeof window !== 'undefined' ? (localStorage.getItem('teacherPhoto') || '') : '',
    department: '',
  },
  setTeacher: (teacherData) => set((state) => ({ teacher: { ...state.teacher, ...teacherData } })),
  token: typeof window !== 'undefined' ? (localStorage.getItem('token') || '') : '',
  setToken: (token) => set({ token }),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('teacherName');
      localStorage.removeItem('teacherPhoto');
    }
    set({ token: '', teacher: { teacherId: null, teacherName: '', teacherPhoto: '', department: '' } });
  },

  // --- Selected Class Context ---
  selectedClass: {
    department: '',
    year: '',
    section: '',
    subject: '',
  },
  setSelectedClass: (classData) => set({ selectedClass: classData }),

  // --- Attendance Session Context ---
  attendanceSession: {
    attendanceId: null,
    attendanceRecordIds: {},
    date: null,
    uploadedImage: null,
    detectedFaces: [],
    recognizedStudents: [],
    absentStudents: [],
    attendanceStatus: {}, // e.g. { "studentId": "Present", "studentId2": "Absent" }
    initialAttendanceStatus: {}, // e.g. { "studentId": "Present" }
    confidenceScores: {}, // e.g. { "studentId": 0.95 }
    editedStudents: [],
    finalAttendance: [],
  },
  setAttendanceSession: (sessionData) => 
    set((state) => ({ 
      attendanceSession: { ...state.attendanceSession, ...sessionData } 
    })),
  resetAttendanceSession: () => set({
    attendanceSession: {
      attendanceId: null,
      attendanceRecordIds: {},
      date: null,
      uploadedImage: null,
      detectedFaces: [],
      recognizedStudents: [],
      absentStudents: [],
      attendanceStatus: {},
      initialAttendanceStatus: {},
      confidenceScores: {},
      editedStudents: [],
      finalAttendance: [],
    }
  }),
  updateStudentAttendanceStatus: (studentId, status) => 
    set((state) => ({
      attendanceSession: {
        ...state.attendanceSession,
        attendanceStatus: {
          ...state.attendanceSession.attendanceStatus,
          [studentId]: status
        },
        editedStudents: state.attendanceSession.editedStudents.includes(studentId) 
          ? state.attendanceSession.editedStudents 
          : [...state.attendanceSession.editedStudents, studentId]
      }
    })),

  // --- Student Database Cache ---
  students: [],
  setStudents: (studentsList) => set({ students: studentsList }),

  // --- Local Attendance Session History Cache ---
  attendanceHistory: [],
  addAttendanceSessionToHistory: (session) => set((state) => ({
    attendanceHistory: [...state.attendanceHistory, session]
  })),
}));

export default useStore;
