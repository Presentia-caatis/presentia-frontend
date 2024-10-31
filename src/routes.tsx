import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/LoginPage';
import AdminLayout from './layout/AdminLayout';
import SchoolLayout from './layout/SchoolLayout';
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/school/dashboard/dashboard/MainPage';
import StudentListPage from './pages/school/dashboard/student/StudentListPage';
import StudentAttendanceInPage from './pages/school/dashboard/student/studentAttendance/StudentAttendanceInPage';
import StudentAttendanceOutPage from './pages/school/dashboard/student/studentAttendance/StudentAttendanceOutPage';
import StudentAttendanceRecordPage from './pages/school/dashboard/attendance/StudentAttendanceRecordPage';
import StudentAttendanceRecordResultPage from './pages/school/dashboard/attendance/StudentAttendanceRecordResultPage';
import CustomEventPage from './pages/school/dashboard/attendance/CustomEventPage';
import ClassroomListPage from './pages/school/dashboard/classroom/ClassroomListPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/*" element={<AdminLayout />}>
                    <Route path="dashboard" element={<Login />} />
                </Route>

                <Route path="/school/*" element={<SchoolLayout />}>
                    <Route path="mainpage" element={<MainPage />} />

                    <Route path="student">
                        <Route index element={<StudentListPage />} />
                    </Route>
                    <Route path='attendance-record' element={<StudentAttendanceRecordPage />} />
                    <Route path='attendance-record-result' element={<StudentAttendanceRecordResultPage />} />
                    <Route path='custom-event' element={<CustomEventPage />} />

                    <Route path='classroom' element={<ClassroomListPage />} />
                </Route>

                <Route path="/school/student/attendance/in" element={<StudentAttendanceInPage />} />
                <Route path="/school/student/attendance/out" element={<StudentAttendanceOutPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
