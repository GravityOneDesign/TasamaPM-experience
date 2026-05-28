export interface UserSessionInfo {
  userName?: string | null;
  id?: number | null;
  email?: string | null;
  personFirstName?: string | null;
  personLastName?: string | null;
  contactNumber?: string | null;
  isDisabled?: boolean;
  roleId?: number | string | null;
  userRoleName?: string | null;
  isPermittedExecutiveDashboard?: boolean;
  isPermittedConfigrableuDashboard?: boolean;
  allowWorkspaceNavigation?: boolean;
  dashboardType?: number | null;
  isExternal?: boolean | string | null;
  externalClientID?: number | string | null;
  defaultDashboardID?: number | null;
  amplitudeIsEnabled?: string | boolean | null;
  amplitudeKey?: string | null;
  expiryMinute?: number | null;
  isAppcuesEnabled?: boolean;
  isPowerBiServerOnPrem?: boolean;
  isPowerBiServerOnPremWithinSDZ?: boolean;
  companyId?: number | string | null;
  aiDashboardId?: number | string | null;
}

export type ConsoleLandingRole = 'project-manager' | 'pmo' | 'portfolio-manager';

export function resolveConsoleLandingRole(userRoleName: string | null | undefined): ConsoleLandingRole {
  const normalized = (userRoleName ?? '').toLowerCase().replace(/[\s_-]/g, '');

  if (normalized.includes('portfoliomanager') || normalized === 'portfolio') {
    return 'portfolio-manager';
  }

  if (normalized === 'pmo' || normalized.endsWith('pmo') || normalized.startsWith('pmo')) {
    return 'pmo';
  }

  return 'project-manager';
}

export function formatUserRoleLabel(userRoleName: string | null | undefined): string {
  const normalized = (userRoleName ?? '').trim();
  if (!normalized) {
    return 'User';
  }

  return normalized
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function buildUserDisplayName(session: UserSessionInfo | null): string {
  if (!session) {
    return 'User';
  }

  const first = (session.personFirstName ?? '').trim();
  const last = (session.personLastName ?? '').trim();
  const fullName = `${first} ${last}`.trim();
  if (fullName) {
    return fullName;
  }

  const userName = (session.userName ?? '').trim();
  if (userName) {
    return userName.includes('@') ? userName.split('@')[0] : userName;
  }

  return 'User';
}

export function buildUserInitials(session: UserSessionInfo | null): string {
  if (!session) {
    return 'U';
  }

  const first = (session.personFirstName ?? '').trim();
  const last = (session.personLastName ?? '').trim();
  if (first || last) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || first.charAt(0).toUpperCase();
  }

  const userName = (session.userName ?? '').trim();
  if (!userName) {
    return 'U';
  }

  const localPart = userName.includes('@') ? userName.split('@')[0] : userName;
  const parts = localPart.split(/[.\s_-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }

  return localPart.slice(0, 2).toUpperCase();
}
