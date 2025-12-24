import { useAuth, AppRole } from '@/contexts/AuthContext';

// Define permission levels for different actions
export type Permission = 
  | 'view_kpis'
  | 'create_kpis'
  | 'edit_kpis'
  | 'delete_kpis'
  | 'view_actions'
  | 'create_actions'
  | 'edit_actions'
  | 'delete_actions'
  | 'complete_actions'
  | 'view_problems'
  | 'create_problems'
  | 'edit_problems'
  | 'delete_problems'
  | 'escalate_problems'
  | 'view_workstations'
  | 'manage_workstations'
  | 'view_reports'
  | 'generate_reports'
  | 'view_settings'
  | 'manage_users'
  | 'manage_categories';

// Permission matrix per role
const rolePermissions: Record<AppRole, Permission[]> = {
  admin: [
    'view_kpis', 'create_kpis', 'edit_kpis', 'delete_kpis',
    'view_actions', 'create_actions', 'edit_actions', 'delete_actions', 'complete_actions',
    'view_problems', 'create_problems', 'edit_problems', 'delete_problems', 'escalate_problems',
    'view_workstations', 'manage_workstations',
    'view_reports', 'generate_reports',
    'view_settings', 'manage_users', 'manage_categories',
  ],
  manager: [
    'view_kpis', 'create_kpis', 'edit_kpis',
    'view_actions', 'create_actions', 'edit_actions', 'delete_actions', 'complete_actions',
    'view_problems', 'create_problems', 'edit_problems', 'escalate_problems',
    'view_workstations', 'manage_workstations',
    'view_reports', 'generate_reports',
    'view_settings', 'manage_categories',
  ],
  team_leader: [
    'view_kpis', 'edit_kpis',
    'view_actions', 'create_actions', 'edit_actions', 'complete_actions',
    'view_problems', 'create_problems', 'edit_problems', 'escalate_problems',
    'view_workstations',
    'view_reports',
    'view_settings',
  ],
  operator: [
    'view_kpis',
    'view_actions', 'complete_actions',
    'view_problems', 'create_problems',
    'view_workstations',
    'view_settings',
  ],
};

// Role labels for display
export const roleLabels: Record<AppRole, string> = {
  admin: 'Administrateur',
  manager: 'Manager',
  team_leader: 'Chef d\'équipe',
  operator: 'Opérateur',
};

// Role colors for badges
export const roleColors: Record<AppRole, string> = {
  admin: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
  manager: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
  team_leader: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
  operator: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
};

export function usePermissions() {
  const { role } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!role) return false;
    return rolePermissions[role].includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!role) return false;
    return permissions.some(p => rolePermissions[role].includes(p));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!role) return false;
    return permissions.every(p => rolePermissions[role].includes(p));
  };

  const canCreate = (entity: 'kpis' | 'actions' | 'problems'): boolean => {
    return hasPermission(`create_${entity}` as Permission);
  };

  const canEdit = (entity: 'kpis' | 'actions' | 'problems'): boolean => {
    return hasPermission(`edit_${entity}` as Permission);
  };

  const canDelete = (entity: 'kpis' | 'actions' | 'problems'): boolean => {
    return hasPermission(`delete_${entity}` as Permission);
  };

  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isTeamLeader = role === 'team_leader';
  const isOperator = role === 'operator';

  const isManagerOrAbove = isAdmin || isManager;
  const isTeamLeaderOrAbove = isAdmin || isManager || isTeamLeader;

  return {
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canEdit,
    canDelete,
    isAdmin,
    isManager,
    isTeamLeader,
    isOperator,
    isManagerOrAbove,
    isTeamLeaderOrAbove,
    roleLabels,
    roleColors,
  };
}
