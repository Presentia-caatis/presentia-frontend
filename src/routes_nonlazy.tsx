import { ProgressSpinner } from 'primereact/progressspinner';
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

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
const FingerprintPage = lazy(() => import('./pages/school/dashboard/admin/fingerprintRegisterPage'));
const SchoolCheckInStatusPage = lazy(() => import('./pages/school/dashboard/attendance/SchoolCheckInStatusPage'));


const CenteredLoader = () => {
    return (
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
};

const AppRoutes = () => {
    return (
        <Suspense fallback={<CenteredLoader />}>
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
                    <Route path='absence-permit/type' element={<AbsenceStatusListPage />} />

                    <Route path='classroom' element={<ClassroomListPage />} />

                    <Route path='fingerprint' element={<FingerprintPage />} />
                </Route>

                <Route path="/school/attendance" element={<SchoolStudentAttendanceListPage />} />
                <Route path="/school/student/attendance/in" element={<StudentAttendanceInPage />} />
                <Route path="/school/student/attendance/out" element={<StudentAttendanceOutPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;


