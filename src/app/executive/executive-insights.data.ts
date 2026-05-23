export type ExecutiveInsightTone = 'success' | 'danger' | 'warning' | 'neutral' | 'brand';

export interface ExecutiveInsightSummaryCard {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly tone: ExecutiveInsightTone;
  readonly icon?: string;
}

export interface ExecutiveInsightNavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly active?: boolean;
}

export interface ExecutiveInsightDimension {
  readonly id: string;
  readonly label: string;
  readonly status: string;
  readonly tone: ExecutiveInsightTone;
  readonly sublabel?: string;
  readonly active?: boolean;
}

export interface ExecutiveMoreInsightItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly active?: boolean;
}

export interface ExecutiveKpiRow {
  readonly id: string;
  readonly index: number;
  readonly name: string;
  readonly current: string;
  readonly target: string;
  readonly max: string;
  readonly progress: number;
  readonly targetPosition: number;
  readonly probability: string;
  readonly tone: ExecutiveInsightTone;
  readonly trendIcon: string;
  readonly date: string;
  readonly owner: string;
  readonly tall?: boolean;
}

export const executiveInsightSummaryCards: readonly ExecutiveInsightSummaryCard[] = [
  {
    id: 'score',
    label: 'Overall Score',
    value: '74.76%',
    tone: 'brand',
  },
  {
    id: 'on-track',
    label: 'On-Track',
    value: '30',
    tone: 'success',
    icon: 'circle-check',
  },
  {
    id: 'off-track',
    label: 'Off-Track',
    value: '15',
    tone: 'danger',
    icon: 'triangle-alert',
  },
  {
    id: 'alert',
    label: 'Alert',
    value: '20',
    tone: 'warning',
    icon: 'triangle-alert',
  },
  {
    id: 'not-tracked',
    label: 'Not tracked',
    value: '0',
    tone: 'neutral',
    icon: 'eye-off',
  },
  {
    id: 'not-started',
    label: 'Not Started',
    value: '1',
    tone: 'brand',
    icon: 'circle-dot',
  },
];

export const executiveInsightNavItems: readonly ExecutiveInsightNavItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'register', label: 'Project register', icon: 'grid-2x2', active: true },
  { id: 'reports', label: 'Reports', icon: 'chart-column' },
  { id: 'departments', label: 'Departments', icon: 'building-2' },
  { id: 'benefits', label: 'Benefits', icon: 'circle-dollar-sign' },
  { id: 'people', label: 'People', icon: 'user' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const executiveInsightUtilityNavItems: readonly ExecutiveInsightNavItem[] = [
  { id: 'help', label: 'Help', icon: 'circle-help' },
  { id: 'logout', label: 'Log out', icon: 'log-out' },
];

export const executiveInsightDimensions: readonly ExecutiveInsightDimension[] = [
  {
    id: 'foundational',
    label: 'Foundational KPIs',
    status: 'Off-track',
    sublabel: '5 Off-track',
    tone: 'danger',
    active: true,
  },
  {
    id: 'execution',
    label: 'Execution Health',
    status: 'On Track',
    tone: 'success',
  },
  {
    id: 'planning',
    label: 'Planning & Setup Quality',
    status: 'Off-track',
    tone: 'danger',
  },
  {
    id: 'risk',
    label: 'Risk & Delivery Assurance',
    status: 'At Risk',
    tone: 'warning',
  },
  {
    id: 'governance',
    label: 'Governance & Discipline',
    status: 'On Track',
    tone: 'success',
  },
  {
    id: 'strategic',
    label: 'Strategic Alignment & Value',
    status: 'On Track',
    tone: 'success',
  },
];

export const executiveMoreInsightItems: readonly ExecutiveMoreInsightItem[] = [
  {
    id: 'strategic-alignment',
    label: 'Strategic Alignment',
    icon: 'align-right',
    active: true,
  },
  {
    id: 'portfolio-performance',
    label: 'Portfolio Performance',
    icon: 'chart-column',
  },
  {
    id: 'compliance-assurance',
    label: 'Compliance & Assurance',
    icon: 'handshake',
  },
  {
    id: 'governance-risks',
    label: 'Governance and Risks',
    icon: 'triangle-alert',
  },
  {
    id: 'benefits-change',
    label: 'Benefits & Change',
    icon: 'gift',
  },
  {
    id: 'resource-demand',
    label: 'Resource Demand Overview',
    icon: 'circle-check',
  },
];

export const executiveKpiRows: readonly ExecutiveKpiRow[] = [
  {
    id: 'project-registration-1',
    index: 1,
    name: 'Project Registration Compliance',
    current: 'Current: 10B',
    target: 'Target: 9B',
    max: 'Max: 34B',
    progress: 52.4,
    targetPosition: 45,
    probability: '92.4%',
    tone: 'success',
    trendIcon: 'trending-up',
    date: 'Apr 2026',
    owner: 'AH',
    tall: true,
  },
  {
    id: 'named-ownership-1',
    index: 2,
    name: 'Named Ownership',
    current: 'Current: 10B',
    target: 'Target: 9B',
    max: 'Max: 34B',
    progress: 52.4,
    targetPosition: 45,
    probability: '10.1%',
    tone: 'danger',
    trendIcon: 'trending-down',
    date: 'Apr 2026',
    owner: 'OH',
  },
  {
    id: 'defined-timeline',
    index: 3,
    name: 'Defined Timeline Presence',
    current: 'Current: 10B',
    target: 'Target: 9B',
    max: 'Max: 34B',
    progress: 52.4,
    targetPosition: 45,
    probability: '52.4%',
    tone: 'warning',
    trendIcon: 'arrow-right',
    date: 'Oct 2026',
    owner: 'OM',
  },
  {
    id: 'milestone-baseline',
    index: 4,
    name: 'Milestone Baseline Defined',
    current: 'Current: 10B',
    target: 'Target: 9B',
    max: 'Max: 34B',
    progress: 52.4,
    targetPosition: 45,
    probability: '52.4%',
    tone: 'warning',
    trendIcon: 'arrow-right',
    date: 'Oct 2026',
    owner: 'OM',
  },
  {
    id: 'project-registration-2',
    index: 5,
    name: 'Project Registration Compliance',
    current: 'Current: 10B',
    target: 'Target: 9B',
    max: 'Max: 34B',
    progress: 52.4,
    targetPosition: 45,
    probability: '92.4%',
    tone: 'success',
    trendIcon: 'trending-up',
    date: 'Apr 2026',
    owner: 'AH',
    tall: true,
  },
  {
    id: 'named-ownership-2',
    index: 6,
    name: 'Named Ownership',
    current: 'Current: 10B',
    target: 'Target: 9B',
    max: 'Max: 34B',
    progress: 52.4,
    targetPosition: 45,
    probability: '10.1%',
    tone: 'danger',
    trendIcon: 'trending-down',
    date: 'Apr 2026',
    owner: 'OH',
  },
];
