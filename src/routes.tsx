import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/LoginPage';
import AdminLayout from './layout/AdminLayout';
import SchoolLayout from './layout/SchoolLayout';
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/school/dashboard/dashboard/SchoolMainPage';
import StudentListPage from './pages/school/dashboard/student/SchoolStudentPage';
import StudentAttendanceInPage from './pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceInPage';
import StudentAttendanceOutPage from './pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceOutPage';
import StudentAttendanceRecordPage from './pages/school/dashboard/attendance/SchoolStudentAttendanceRecordPage';
import StudentAttendanceRecordResultPage from './pages/school/dashboard/attendance/SchoolStudentAttendanceRecordResultPage';
import CustomEventPage from './pages/school/dashboard/attendance/SchoolCustomEventPage';
import ClassroomListPage from './pages/school/dashboard/classroom/SchoolClassroomPage';
import DefaultAttendanceTimePage from './pages/school/dashboard/attendance/SchoolSetAttendanceTimePage';
import AttendanceStatusListPage from './pages/school/dashboard/attendance/SchoolAttendanceStatusPage';
import AchievementListPage from './pages/school/dashboard/achievement/SchoolAchievementPage';
import StudentAchievementListPage from './pages/school/dashboard/achievement/SchoolStudentAchievementPage';
import ViolationPage from './pages/school/dashboard/violation/SchoolViolationPage';
import StudentViolationPage from './pages/school/dashboard/violation/SchoolStudentViolationPage';
import ViolationStudentPointReport from './pages/school/dashboard/violation/SchoolViolationStudentPointReport';
import AdminDashboard from './pages/admin/MainPage';
import SchoolProfilePage from './pages/school/profile/SchoolProfilePage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/*" element={<AdminLayout />}>
                    <Route path="mainpage" element={<AdminDashboard />} />
                </Route>

                <Route path="/school/*" element={<SchoolLayout />}>
                    <Route path="mainpage" element={<MainPage />} />
                    <Route path="profile" element={<SchoolProfilePage />} />

                    <Route path="student">
                        <Route index element={<StudentListPage />} />
                    </Route>
                    <Route path='attendance-record' element={<StudentAttendanceRecordPage />} />
                    <Route path='attendance-record-result' element={<StudentAttendanceRecordResultPage />} />
                    <Route path='custom-event' element={<CustomEventPage />} />
                    <Route path='default-attendance-time' element={<DefaultAttendanceTimePage />} />
                    <Route path='attendance/status' element={<AttendanceStatusListPage />} />

                    <Route path='classroom' element={<ClassroomListPage />} />

                    <Route path='achievement' element={<AchievementListPage />} />
                    <Route path='achievement/student' element={<StudentAchievementListPage />} />

                    <Route path='violation' element={<ViolationPage />} />
                    <Route path='violation/student' element={<StudentViolationPage />} />
                    <Route path='violation/student-point-report' element={<ViolationStudentPointReport />} />
                </Route>

                <Route path="/school/student/attendance/in" element={<StudentAttendanceInPage />} />
                <Route path="/school/student/attendance/out" element={<StudentAttendanceOutPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
