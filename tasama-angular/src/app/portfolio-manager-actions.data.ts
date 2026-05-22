export interface PortfolioActionItem {
  id: string;
  date: string;          // ISO date string, e.g. '2026-05-12'
  label: string;         // e.g. 'Review Plan'
  project: string;       // e.g. 'Vision 2030'
  type: string;          // e.g. 'Review Plan', 'Review Risk', 'Review Benefit', 'Review Stagegate Assesment'
  kind: 'report' | 'risk' | 'benefit' | 'milestone' | 'task' | 'dependency'; // mapped for filters
  tone: 'green' | 'red' | 'blue' | 'neutral'; // tone color class
  owner: string;         // initials, e.g. 'FA'
  meta: string;          // due label, e.g. 'Overdue by 5 days'
  cta: string;           // action label, e.g. 'Submit'
  column: 'Overdue' | 'This week' | 'Upcoming';
}

export interface PortfolioBoardColumn {
  column: 'Overdue' | 'This week' | 'Upcoming';
  tone: 'red' | 'blue' | 'amber';
  items: PortfolioActionItem[];
}

export interface PortfolioBoardFilter {
  id: string;
  label: string;
  icon: string;
}

export const portfolioBoardFilters: PortfolioBoardFilter[] = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'report', label: 'Reports', icon: 'plan' },
  { id: 'risk', label: 'Risks', icon: 'risks' },
  { id: 'dependency', label: 'Dependencies', icon: 'dependencies' },
  { id: 'benefit', label: 'Benefit', icon: 'benefit' },
  { id: 'milestone', label: 'Milestones', icon: 'milestone' },
  { id: 'task', label: 'Tasks', icon: 'checklist' },
];

export const portfolioActionItems: PortfolioActionItem[] = [
  {
    id: 'ACT-01',
    date: '2026-05-09',
    label: 'Review Plan',
    project: 'Vision 2030',
    type: 'Review Plan',
    kind: 'report',
    tone: 'blue',
    owner: 'SA',
    meta: 'Overdue by 5 days',
    cta: 'Submit',
    column: 'Overdue'
  },
  {
    id: 'ACT-02',
    date: '2026-05-09',
    label: 'Review Risk',
    project: 'NEOM Integration',
    type: 'Review Risk',
    kind: 'risk',
    tone: 'red',
    owner: 'AH',
    meta: 'High priority',
    cta: 'Resolve',
    column: 'Overdue'
  },
  {
    id: 'ACT-03',
    date: '2026-05-10',
    label: 'Review Benefit',
    project: 'Vision 2030',
    type: 'Review Benefit',
    kind: 'benefit',
    tone: 'blue',
    owner: 'MH',
    meta: 'Overdue by 2 days',
    cta: 'Review',
    column: 'Overdue'
  },
  {
    id: 'ACT-04',
    date: '2026-05-11',
    label: 'Review Task',
    project: 'UAE Research Map',
    type: 'Review Task',
    kind: 'task',
    tone: 'neutral',
    owner: 'FA',
    meta: 'Escalate today',
    cta: 'Chase',
    column: 'Overdue'
  },
  {
    id: 'ACT-05',
    date: '2026-05-12',
    label: 'Review Plan',
    project: 'Smart City Alpha',
    type: 'Review Plan',
    kind: 'report',
    tone: 'blue',
    owner: 'FA',
    meta: 'Due today',
    cta: 'Chase',
    column: 'This week'
  },
  {
    id: 'ACT-06',
    date: '2026-05-12',
    label: 'Review Benefit',
    project: 'Smart City Alpha',
    type: 'Review Benefit',
    kind: 'benefit',
    tone: 'blue',
    owner: 'FA',
    meta: 'Due in 2 days',
    cta: 'Review',
    column: 'This week'
  },
  {
    id: 'ACT-07',
    date: '2026-05-12',
    label: 'Review Stagegate Assesment',
    project: 'UAE Research Map',
    type: 'Review Stagegate Assesment',
    kind: 'milestone',
    tone: 'green',
    owner: 'MH',
    meta: 'Due Friday',
    cta: 'Open',
    column: 'This week'
  },
  {
    id: 'ACT-08',
    date: '2026-05-15',
    label: 'Review Risk',
    project: 'UAE Research Map',
    type: 'Review Risk',
    kind: 'risk',
    tone: 'red',
    owner: 'MH',
    meta: 'Due in 3 days',
    cta: 'Review',
    column: 'This week'
  },
  {
    id: 'ACT-09',
    date: '2026-05-15',
    label: 'Review Dependency',
    project: 'Vision 2030',
    type: 'Review Dependency',
    kind: 'dependency',
    tone: 'blue',
    owner: 'FA',
    meta: 'Due in 4 days',
    cta: 'Open',
    column: 'This week'
  },
  {
    id: 'ACT-10',
    date: '2026-05-22',
    label: 'Review Stagegate Assesment',
    project: 'Vision 2030',
    type: 'Review Stagegate Assesment',
    kind: 'milestone',
    tone: 'green',
    owner: 'MH',
    meta: 'Due Jun 12',
    cta: 'Open',
    column: 'Upcoming'
  },
  {
    id: 'ACT-11',
    date: '2026-05-25',
    label: 'Review Risk',
    project: 'NEOM Integration',
    type: 'Review Risk',
    kind: 'risk',
    tone: 'red',
    owner: 'AH',
    meta: 'Next week',
    cta: 'Plan',
    column: 'Upcoming'
  },
  {
    id: 'ACT-12',
    date: '2026-05-29',
    label: 'Review Benefit',
    project: 'Smart City Alpha',
    type: 'Review Benefit',
    kind: 'benefit',
    tone: 'blue',
    owner: 'MH',
    meta: 'In 2 weeks',
    cta: 'Resolve',
    column: 'Upcoming'
  }
];
