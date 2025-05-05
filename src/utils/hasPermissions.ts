import { User } from "../context/AuthContext";

export const hasAnyPermission = (user: User | null, permissions: string[]) => {
    return permissions.some(p => user?.permissions?.includes(p));
};
