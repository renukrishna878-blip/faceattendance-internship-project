import { create } from 'zustand';

const useStore = create((set) => ({
  // --- Teacher Context ---
  teacher: {
    teacherId: null,
    teacherName: '',
    department: '',
  },
  setTeacher: (teacherData) => set({ teacher: teacherData }),

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
    date: null,
    uploadedImage: null,
    detectedFaces: [],
    recognizedStudents: [],
    absentStudents: [],
    attendanceStatus: {}, // e.g. { "studentId": "Present", "studentId2": "Absent" }
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
      date: null,
      uploadedImage: null,
      detectedFaces: [],
      recognizedStudents: [],
      absentStudents: [],
      attendanceStatus: {},
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
}));

export default useStore;
