import { ProgressSpinner } from 'primereact/progressspinner';
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RoleGuard from './components/RoleGuard';
import { ForgotPasswordPage, ResetPasswordPage } from './components/public/ForgotPassword';
import PublicAttendancePage from './pages/public/PublicAttendancePage';
import SchoolAttendanceWindowPage from './pages/school/dashboard/attendance/SchoolAttendanceWindowPage';
import SchoolUsersPage from './pages/school/dashboard/admin/SchoolUsersPage';
import UserInvitationPage from './pages/user/Invitation/UserInvitationPage';

const Login = lazy(() => import('./pages/auth/LoginPage'));
const AdminLayout = lazy(() => import('./layout/AdminLayout'));
const SchoolLayout = lazy(() => import('./layout/SchoolLayout'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Dashboard = lazy(() => import('./pages/school/dashboard/dashboard/SchoolDashboardPage'));
const StudentListPage = lazy(() => import('./pages/school/dashboard/student/SchoolStudentPage'));
const StudentAttendanceInPage = lazy(() => import('./pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceInPage'));
const StudentAttendanceOutPage = lazy(() => import('./pages/school/dashboard/student/studentAttendance/SchoolStudentAttendanceOutPage'));
const StudentAttendancePage = lazy(() => import('./pages/school/dashboard/attendance/SchoolStudentAttendancePage'));
const StudentAttendanceRecordResultPage = lazy(() => import('./pages/school/dashboard/attendance/SchoolStudentAttendanceRecordResultPage'));
const CustomEventPage = lazy(() => import('./pages/school/dashboard/attendance/SchoolCustomEventPage'));
const ClassroomListPage = lazy(() => import('./pages/school/dashboard/classgroup/SchoolClassgroupPage'));
const DefaultAttendanceTimePage = lazy(() => import('./pages/school/dashboard/attendance/SchoolSetAttendanceTimePage'));
const AbsenceStatusListPage = lazy(() => import('./pages/school/dashboard/attendance/SchoolAbsenceStatusPage'));
const AdminDashboard = lazy(() => import('./pages/admin/dashboard/MainPage'));
const SchoolProfilePage = lazy(() => import('./pages/school/profile/SchoolProfilePage'));
const PublicLayout = lazy(() => import('./layout/PublicLayout'));
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const UserLayout = lazy(() => import('./layout/UserLayout'));
const UserDashboard = lazy(() => import('./pages/user/dashboard/dashboard/UserDashboardPage'));
const UserProfilePage = lazy(() => import('./pages/user/profile/UserProfilePage'));
const AdminSchoolPage = lazy(() => import('./pages/admin/school-management/AdminSchoolPage'));
const UserBillingPage = lazy(() => import('./pages/user/dashboard/invoice/UserInvoicePage'));
const UserInvoiceDetailPage = lazy(() => import('./pages/user/dashboard/invoice/UserInvoiceDetailPage'));
const UserSupportPage = lazy(() => import('./pages/user/dashboard/support/UserSupportPage'));
const UserSupportDetailPage = lazy(() => import('./pages/user/dashboard/support/UserSupportDetailPage'));
const AdminSubscribtionPage = lazy(() => import('./pages/admin/subscription/AdminSubscriptionPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const SchoolStudentAttendanceListPage = lazy(() => import('./pages/school/dashboard/student/SchoolAttendanceListPage'));
const FingerprintPage = lazy(() => import('./pages/school/dashboard/admin/FingerprintRegisterPage'));
const SchoolCheckInStatusPage = lazy(() => import('./pages/school/dashboard/attendance/SchoolCheckInStatusPage'));

const CenteredLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9'
    }}>
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
    </div>
);

const withSuspense = (Component: React.ComponentType): JSX.Element => (
    <Suspense fallback={<CenteredLoader />}>
        <Component />
    </Suspense>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={withSuspense(PublicLayout)}>
                <Route path="/" element={withSuspense(LandingPage)} />
            </Route>

            <Route path="/login" element={withSuspense(Login)} />
            <Route path="/register" element={withSuspense(RegisterPage)} />

            <Route path="/user" element={withSuspense(UserLayout)}>
                <Route path="dashboard" element={withSuspense(UserDashboard)} />
                <Route path="dashboard/invitation" element={withSuspense(UserInvitationPage)} />
                <Route path="dashboard/billing" element={withSuspense(UserBillingPage)} />
                <Route path="invoice/:id" element={withSuspense(UserInvoiceDetailPage)} />
                <Route path="dashboard/support" element={withSuspense(UserSupportPage)} />
                <Route path="support/ticket/:id" element={withSuspense(UserSupportDetailPage)} />
                <Route path="profile" element={withSuspense(UserProfilePage)} />
            </Route>

            <Route path="/admin/*" element={withSuspense(AdminLayout)}>
                <Route path="mainpage" element={withSuspense(AdminDashboard)} />
                <Route path="schools" element={withSuspense(AdminSchoolPage)} />
                <Route path="subscriptions" element={withSuspense(AdminSubscribtionPage)} />
            </Route>

            <Route path="/school/:schoolName/*" element={withSuspense(SchoolLayout)}>
                <Route path="dashboard" element={withSuspense(Dashboard)} />
                <Route path="profile" element={withSuspense(SchoolProfilePage)} />
                <Route path="student">
                    <Route index element={withSuspense(StudentListPage)} />
                </Route>
                <Route path="attendance" element={withSuspense(StudentAttendancePage)} />
                <Route path="attendance-record-result" element={withSuspense(StudentAttendanceRecordResultPage)} />
                <Route path="custom-event" element={withSuspense(CustomEventPage)} />
                <Route path="default-attendance-time" element={withSuspense(DefaultAttendanceTimePage)} />
                <Route path="attendance-window" element={withSuspense(SchoolAttendanceWindowPage)} />
                <Route path="check-in/status" element={withSuspense(SchoolCheckInStatusPage)} />
                <Route path="absence-permit/type" element={withSuspense(AbsenceStatusListPage)} />
                <Route path="classroom" element={withSuspense(ClassroomListPage)} />
                <Route path="fingerprint" element={<RoleGuard roles={['school_admin', 'super_admin', 'school_coadmin']}>
                    {withSuspense(FingerprintPage)}
                </RoleGuard>} />
                <Route path="users" element={<RoleGuard roles={['school_admin', 'super_admin', 'school_coadmin']}>
                    {withSuspense(SchoolUsersPage)}
                </RoleGuard>} />
            </Route>

            <Route path="/school/attendance" element={withSuspense(SchoolStudentAttendanceListPage)} />
            <Route path="/school/student/attendance/in" element={
                withSuspense(StudentAttendanceInPage)
            } />
            <Route path="/school/student/attendance/out" element={withSuspense(StudentAttendanceOutPage)} />
            <Route path="/forgot-password" element={withSuspense(ForgotPasswordPage)} />
            <Route path="/reset-password" element={withSuspense(ResetPasswordPage)} />
            <Route path="/kehadiran/:schoolId" element={<PublicAttendancePage />} />

            <Route path="*" element={withSuspense(NotFoundPage)} />
        </Routes>
    );
};

export default AppRoutes;
