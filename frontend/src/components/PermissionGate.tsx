import { useAuthStore } from '../store/authStore';

type Role = 'admin' | 'manager' | 'user';

interface PermissionGateProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

export default function PermissionGate({
  children,
  allowedRoles,
  fallback = null,
}: PermissionGateProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function AdminOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGate allowedRoles={['admin']} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function ManagerOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGate allowedRoles={['admin', 'manager']} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}
