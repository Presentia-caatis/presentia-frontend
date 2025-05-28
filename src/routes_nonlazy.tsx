import { Routes, Route } from 'react-router-dom';
import RoleGuard from './components/RoleGuard';

import Login from './pages/auth/LoginPage';
import AdminLayout from './layout/AdminLayout';
import SchoolLayout from './layout/SchoolLayout';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './pages/school/dashboard/dashboard/SchoolDashboardPage';
import StudentListPage from './pages/school/dashboard/student/SchoolStudentPage';
import StudentAttendanceInPage from './pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceInPage';
import StudentAttendanceOutPage from './pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceOutPage';
import StudentAttendancePage from './pages/school/dashboard/attendance/SchoolStudentAttendancePage';
import StudentAttendanceRecordResultPage from './pages/school/dashboard/attendance/SchoolStudentAttendanceRecordResultPage';
import CustomEventPage from './pages/school/dashboard/attendance/SchoolCustomEventPage';
import ClassroomListPage from './pages/school/dashboard/classgroup/SchoolClassgroupPage';
import DefaultAttendanceTimePage from './pages/school/dashboard/attendance/SchoolSetAttendanceTimePage';
import AbsenceStatusListPage from './pages/school/dashboard/attendance/SchoolAbsenceStatusPage';
import AdminDashboard from './pages/admin/dashboard/MainPage';
import SchoolProfilePage from './pages/school/profile/SchoolProfilePage';
import PublicLayout from './layout/PublicLayout';
import LandingPage from './pages/public/LandingPage';
import UserLayout from './layout/UserLayout';
import UserDashboard from './pages/user/dashboard/dashboard/UserDashboardPage';
import UserProfilePage from './pages/user/profile/UserProfilePage';
import AdminSchoolPage from './pages/admin/school-management/AdminSchoolPage';
import UserBillingPage from './pages/user/dashboard/invoice/UserInvoicePage';
import UserInvoiceDetailPage from './pages/user/dashboard/invoice/UserInvoiceDetailPage';
import UserSupportPage from './pages/user/dashboard/support/UserSupportPage';
import UserSupportDetailPage from './pages/user/dashboard/support/UserSupportDetailPage';
import AdminSubscribtionPage from './pages/admin/subscription/AdminSubscriptionPage';
import RegisterPage from './pages/auth/RegisterPage';
import SchoolStudentAttendanceListPage from './pages/school/dashboard/student/SchoolAttendanceListPage';
import FingerprintPage from './pages/school/dashboard/admin/fingerprintRegisterPage';
import SchoolCheckInStatusPage from './pages/school/dashboard/attendance/SchoolCheckInStatusPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/user" element={<UserLayout />}>
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
                <Route path="attendance" element={<StudentAttendancePage />} />
                <Route path="attendance-record-result" element={<StudentAttendanceRecordResultPage />} />
                <Route path="custom-event" element={<CustomEventPage />} />
                <Route path="default-attendance-time" element={<DefaultAttendanceTimePage />} />
                <Route path="check-in/status" element={<SchoolCheckInStatusPage />} />
                <Route path="absence-permit/type" element={<AbsenceStatusListPage />} />
                <Route path="classroom" element={<ClassroomListPage />} />
                <Route path="fingerprint" element={
                    <RoleGuard roles={['schools_admin', 'super_admin']}>
                        <FingerprintPage />
                    </RoleGuard>
                } />
            </Route>

            <Route path="/school/attendance" element={<SchoolStudentAttendanceListPage />} />
            <Route path="/school/student/attendance/in" element={
                <RoleGuard roles={['schools_admin', 'super_admin']}>
                    <StudentAttendanceInPage />
                </RoleGuard>
            } />
            <Route path="/school/student/attendance/out" element={<StudentAttendanceOutPage />} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
