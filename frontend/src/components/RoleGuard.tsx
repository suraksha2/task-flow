import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type Role = 'admin' | 'manager' | 'user';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
  redirectTo = '/dashboard',
}: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}

export function useHasRole(roles: Role | Role[]): boolean {
  const { user } = useAuthStore();
  if (!user) return false;
  
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

export function useIsAdmin(): boolean {
  return useHasRole('admin');
}

export function useIsManager(): boolean {
  return useHasRole(['admin', 'manager']);
}
