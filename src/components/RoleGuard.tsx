// components/RoleGuard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
    roles: string[];
    children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    const hasRole = roles.some(role => user.roles.includes(role));
    if (!hasRole) return <Navigate to="/not-found" />;

    return <>{children}</>;
};

export default RoleGuard;
