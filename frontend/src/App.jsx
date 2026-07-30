import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useStore from './store/useStore';

// Layout
import Layout from './layouts/Layout';

// Pages
import TeacherLogin from './pages/TeacherLogin';
import Dashboard from './pages/Dashboard';
import StudentDatabase from './pages/StudentDatabase';
import AddNewStudent from './pages/AddNewStudent';
import StudentProfile from './pages/StudentProfile';
import TakeAttendance from './pages/TakeAttendance';
import UploadClassroomPhoto from './pages/UploadClassroomPhoto';
import AIProcessing from './pages/AIProcessing';
import AttendanceResult from './pages/AttendanceResult';
import TeacherVerification from './pages/TeacherVerification';
import AttendanceConfirmation from './pages/AttendanceConfirmation';
import Reports from './pages/Reports';
import ReportDetails from './pages/ReportDetails';

// Route Guard Component
const RequireClassSelection = ({ children }) => {
  const selectedClass = useStore((state) => state.selectedClass);
  // If no department is set, we assume no class was selected
  if (!selectedClass.department) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<TeacherLogin />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="students">
            <Route index element={<StudentDatabase />} />
            <Route path="add" element={<AddNewStudent />} />
            <Route path=":id" element={<StudentProfile />} />
          </Route>

          <Route path="attendance">
            <Route path="select" element={<TakeAttendance />} />
            <Route element={<RequireClassSelection><Outlet /></RequireClassSelection>}>
              <Route path="upload" element={<UploadClassroomPhoto />} />
              <Route path="processing" element={<AIProcessing />} />
              <Route path="result" element={<AttendanceResult />} />
              <Route path="verify" element={<TeacherVerification />} />
              <Route path="confirm" element={<AttendanceConfirmation />} />
            </Route>
          </Route>

          <Route path="reports">
            <Route index element={<Reports />} />
            <Route path=":id" element={<ReportDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
