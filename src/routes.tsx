import { Route, Routes } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import SchoolLayout from './layout/SchoolLayout';
import Login from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AbsenceStatusListPage from './pages/school/dashboard/attendance/SchoolAbsenceStatusPage';
import CustomEventPage from './pages/school/dashboard/attendance/SchoolCustomEventPage';
import DefaultAttendanceTimePage from './pages/school/dashboard/attendance/SchoolSetAttendanceTimePage';
import StudentAttendancePage from './pages/school/dashboard/attendance/SchoolStudentAttendancePage';
import StudentAttendanceRecordResultPage from './pages/school/dashboard/attendance/SchoolStudentAttendanceRecordResultPage';
import ClassroomListPage from './pages/school/dashboard/classgroup/SchoolClassgroupPage';
import Dashboard from './pages/school/dashboard/dashboard/SchoolDashboardPage';
import StudentListPage from './pages/school/dashboard/student/SchoolStudentPage';
import StudentAttendanceInPage from './pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceInPage';
import StudentAttendanceOutPage from './pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceOutPage';
// import AchievementListPage from './pages/school/dashboard/achievement/SchoolAchievementPage';
// import StudentAchievementListPage from './pages/school/dashboard/achievement/SchoolStudentAchievementPage';
// import ViolationPage from './pages/school/dashboard/violation/SchoolViolationPage';
// import StudentViolationPage from './pages/school/dashboard/violation/SchoolStudentViolationPage';
// import ViolationStudentPointReport from './pages/school/dashboard/violation/SchoolViolationStudentPointReport';
import PublicLayout from './layout/PublicLayout';
import UserLayout from './layout/UserLayout';
import AdminDashboard from './pages/admin/dashboard/MainPage';
import AdminSchoolPage from './pages/admin/school-management/AdminSchoolPage';
import AdminSubscribtionPage from './pages/admin/subscription/AdminSubscriptionPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/public/LandingPage';
import FingerprintPage from './pages/school/dashboard/admin/fingerprintRegisterPage';
import SchoolCheckInStatusPage from './pages/school/dashboard/attendance/SchoolCheckInStatusPage';
import SchoolStudentAttendanceListPage from './pages/school/dashboard/student/SchoolAttendanceListPage';
import SchoolProfilePage from './pages/school/profile/SchoolProfilePage';
import UserDashboard from './pages/user/dashboard/dashboard/UserDashboardPage';
import UserInvoiceDetailPage from './pages/user/dashboard/invoice/UserInvoiceDetailPage';
import UserBillingPage from './pages/user/dashboard/invoice/UserInvoicePage';
import UserSupportDetailPage from './pages/user/dashboard/support/UserSupportDetailPage';
import UserSupportPage from './pages/user/dashboard/support/UserSupportPage';
import UserProfilePage from './pages/user/profile/UserProfilePage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />} >
                <Route path='/' element={<LandingPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="user" element={<UserLayout />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="dashboard/billing" element={<UserBillingPage />} />
                <Route path="invoice/:id" element={<UserInvoiceDetailPage />} />
                <Route path="dashboard/support" element={<UserSupportPage />} />
                <Route path="support/ticket/:id" element={<UserSupportDetailPage />} />
                <Route path="profile" element={<UserProfilePage />} />
            </Route>

            <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="mainpage" element={<AdminDashboard />} />
                <Route path="schools" element={<AdminSchoolPage />} />
                <Route path="subscriptions" element={<AdminSubscribtionPage />} />
            </Route>

            <Route path="/school/:schoolName/*" element={<SchoolLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<SchoolProfilePage />} />

                <Route path="student">
                    <Route index element={<StudentListPage />} />
                </Route>
                <Route path='attendance' element={<StudentAttendancePage />} />
                <Route path='attendance-record-result' element={<StudentAttendanceRecordResultPage />} />
                <Route path='custom-event' element={<CustomEventPage />} />
                <Route path='default-attendance-time' element={<DefaultAttendanceTimePage />} />
                <Route path='check-in/status' element={<SchoolCheckInStatusPage />} />
                <Route path='attendance/status' element={<AbsenceStatusListPage />} />

                <Route path='classroom' element={<ClassroomListPage />} />

                {/* <Route path='achievement' element={<AchievementListPage />} />
                    <Route path='achievement/student' element={<StudentAchievementListPage />} />

                    <Route path='violation' element={<ViolationPage />} />
                    <Route path='violation/student' element={<StudentViolationPage />} />
                    <Route path='violation/student-point-report' element={<ViolationStudentPointReport />} /> */}
                <Route path='fingerprint' element={<FingerprintPage />} />
            </Route>

            <Route path="/school/attendance" element={<SchoolStudentAttendanceListPage />} />
            <Route path="/school/student/attendance/in" element={<StudentAttendanceInPage />} />
            <Route path="/school/student/attendance/out" element={<StudentAttendanceOutPage />} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
