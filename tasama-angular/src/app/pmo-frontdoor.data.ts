import type { PmConsoleDigestSection } from './shared/pm-console-digest-panel.component';
import type { PmConsoleFrontdoorAction } from './shared/pm-console-frontdoor-action-cards.component';
import type { PmConsoleModeTabItem } from './shared/pm-console-mode-tabs.component';
import type { PmoGovernanceWorkspaceTarget } from './pmo-governance-workspace.data';
import type { PortfolioActionItem, PortfolioBoardFilter } from './portfolio-manager-actions.data';
import { portfolioProgramRows } from './portfolio-workspace/portfolio-workspace.data';

export type PmoFrontdoorTab = 'overview' | 'manage-work' | 'quicklinks';

export interface PmoFrontdoorMetric {
  readonly value: string;
  readonly label: string;
}

export interface PmoFrontdoorHealthRow {
  readonly label: string;
  readonly onTrack: number;
  readonly delayed: number;
  readonly critical: number;
}

export type PmoFrontdoorWorkItem = PortfolioActionItem;

export interface PmoFrontdoorQuickLink {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly target?: PmoGovernanceWorkspaceTarget;
}

export interface PmoStatusReport {
  readonly id: string;
  readonly title: string;
  readonly project: string;
  readonly dueDate: string;
  readonly overdueText: string;
  readonly isOverdue: boolean;
  readonly ownerName: string;
  readonly ownerInitials: string;
}

export const pmoFrontdoorTabs: readonly PmConsoleModeTabItem[] = [
  { id: 'overview', label: 'Overview', icon: 'square-chart-gantt', widthPx: 143 },
  { id: 'manage-work', label: 'Manage My Work', icon: 'network', widthPx: 201 },
  { id: 'quicklinks', label: 'Quick links', icon: 'folder-symlink', widthPx: 155 },
];

export const pmoFrontdoorMetrics: readonly PmoFrontdoorMetric[] = [
  { value: '03', label: 'Active Portfolios' },
  { value: '10', label: 'Active Programs' },
  { value: '25', label: 'Active Projects' },
];

export const pmoFrontdoorHealthRows: readonly PmoFrontdoorHealthRow[] = [
  { label: 'Portfolio Performance', onTrack: 2, delayed: 1, critical: 0 },
  { label: 'Program Performance', onTrack: 3, delayed: 3, critical: 4 },
];

export const pmoFrontdoorDigestSections: readonly PmConsoleDigestSection[] = [
  {
    label: 'Birds Eye View',
    items: [
      {
        parts: [{ text: '3 of your 5 portfolios are running on track!' }],
      },
      {
        parts: [{ text: 'You have 15 actions pending your review. Go to Manage my Work to view your calendar and clear your action board.' }],
      },
    ],
  },
  {
    label: 'Portfolio Updates',
    items: [
      {
        parts: [
          { text: 'TASAMA Internal :', emphasis: true },
          { text: '14 items are delayed and 5 are critical. Visit your portfolio workspace to see what needs attention.' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 1 :', emphasis: true },
          { text: 'Reporting compliance is down to 74% this month from 89% last month. Follow up with managers who have not yet reported.' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 2 :', emphasis: true },
          { text: 'Has not submitted progress this month.' },
        ],
      },
    ],
  },
];

export const pmoFrontdoorActions: PmConsoleFrontdoorAction[] = [
  {
    id: 'framework',
    title: 'Set Up Your Framework',
    description: 'Configure hierarchical domains for this workspace to track divisions, brands, programs or other groups.',
    icon: 'layout-template',
    disabled: false,
    decor: 'waves',
    ctaLabel: 'Configure Framework',
  },
  {
    id: 'create-manage',
    title: 'Manage Portfolio Workspaces',
    description: 'Add new programs / projects to your portfolios and keep registers updated in your Workspace!',
    icon: 'folder-tree',
    decor: 'loops',
  },
  {
    id: 'report-review',
    title: 'Governance & Reporting',
    description: 'Create scheduled or adhoc reports to monitor overall progress and review status reports sent to you by managers.',
    icon: 'chart-column',
    decor: 'hex',
  },
  {
    id: 'decision-intelligence',
    title: 'Insights & Decision Intelligence',
    description: 'Track delivery health and view performance trends across portfolios.',
    icon: 'cpu',
    decor: 'plus',
  },
  {
    id: 'learning',
    title: 'Access & Manage Learning',
    description: 'Explore portfolio management playbooks, frameworks and guidelines to support your practice.',
    icon: 'book-open',
    decor: 'burst',
    disabled: true,
  },
];

export const pmoFrontdoorWorkFilters: readonly PortfolioBoardFilter[] = [
  { id: 'all', label: 'All PMO actions', icon: 'grid' },
  { id: 'plan', label: 'Plans', icon: 'plan' },
  { id: 'report', label: 'Status reports', icon: 'chart' },
  { id: 'benefit', label: 'Benefits', icon: 'benefit' },
  { id: 'change', label: 'Change requests', icon: 'changeRequest' },
  { id: 'governance', label: 'Governance Committees', icon: 'calendar' },
];

// Generate randomized calendar work items for PMO calendar view
function generatePmoCalendarWorkItems(): readonly PmoFrontdoorWorkItem[] {
  const projects = portfolioProgramRows.flatMap((program) => (program.projects || []).map((project) => project.name));
  const tasks = [
    { label: 'Status reports', kind: 'report' as const, tone: 'blue' as const },
    { label: 'Plans', kind: 'plan' as const, tone: 'blue' as const },
    { label: 'Change requests', kind: 'change' as const, tone: 'red' as const },
    { label: 'Benefits', kind: 'benefit' as const, tone: 'blue' as const },
    { label: 'Governance Committees', kind: 'governance' as const, tone: 'green' as const },
  ];

  const calendarItems: PmoFrontdoorWorkItem[] = [];
  const months = [
    { monthIndex: 3, monthNumber: '04' },
    { monthIndex: 4, monthNumber: '05' },
    { monthIndex: 5, monthNumber: '06' },
  ];

  for (const month of months) {
    const daysInMonth = new Date(2026, month.monthIndex + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      let numTasks = 0;

      if (month.monthIndex === 4 && (day === 25 || day === 26)) {
        numTasks = Math.floor(Math.random() * 2) + 3;
      } else if (month.monthIndex === 4 && day >= 28) {
        numTasks = Math.floor(Math.random() * 2) + 2;
      } else {
        const rand = Math.random();
        if (rand < 0.4) {
          numTasks = 0;
        } else if (rand < 0.75) {
          numTasks = Math.random() < 0.5 ? 1 : 2;
        } else {
          numTasks = Math.floor(Math.random() * 3) + 3;
        }
      }

      for (let i = 0; i < numTasks; i++) {
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        const project = projects[Math.floor(Math.random() * projects.length)];
        const dateStr = `2026-${month.monthNumber}-${String(day).padStart(2, '0')}`;
        const itemDate = new Date(2026, month.monthIndex, day);

        let column: 'Overdue' | 'This week' | 'Upcoming';
        if (itemDate < new Date(2026, 4, 22)) {
          column = 'Overdue';
        } else if (itemDate <= new Date(2026, 4, 27)) {
          column = 'This week';
        } else {
          column = 'Upcoming';
        }

        let taskName = '';
        if (randomTask.kind === 'report') {
          taskName = `Review ${project} weekly report`;
        } else if (randomTask.kind === 'plan') {
          taskName = `Review ${project} baseline plan`;
        } else if (randomTask.kind === 'change') {
          taskName = `Approve ${project} change request`;
        } else if (randomTask.kind === 'benefit') {
          taskName = `Verify ${project} benefit evidence`;
        } else {
          taskName = `Convene ${project} governance committee`;
        }

        calendarItems.push({
          id: `pmo-cal-${dateStr}-${i}`,
          date: dateStr,
          label: taskName,
          project: project,
          targetType: 'project',
          type: randomTask.label,
          kind: randomTask.kind,
          tone: randomTask.tone,
          owner: 'PMO',
          meta: 'Pending',
          cta: 'Review',
          column: column,
          detailItems: [],
          detailSummary: `Review ${randomTask.label}`,
        });
      }
    }
  }

  return calendarItems;
}

export const pmoFrontdoorWorkItems: readonly PmoFrontdoorWorkItem[] = generatePmoCalendarWorkItems();

export const pmoFrontdoorQuickLinks: readonly PmoFrontdoorQuickLink[] = [
  {
    id: 'portfolio-register',
    title: 'Portfolio Register',
    description: 'Build and maintain scope, schedule, budget, and baseline.',
    icon: 'layout-grid',
    target: { primaryTab: 'portfolio-register' },
  },
  {
    id: 'benefit-register',
    title: 'Benefit Register',
    description: 'Break the project into work packages and deliverables.',
    icon: 'gift',
    target: { primaryTab: 'benefits-register' },
  },
  {
    id: 'risk-register',
    title: 'Risk Register',
    description: 'Track linked work, owners, due dates, and delivery impact.',
    icon: 'triangle-alert',
    target: { primaryTab: 'risk-register' },
  },
  {
    id: 'issues-register',
    title: 'Issues Register',
    description: 'Plan team assignments, capacity, and role ownership.',
    icon: 'circle-alert',
    target: { primaryTab: 'issues-register' },
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Complete handover, lessons, benefits, and final approvals.',
    icon: 'users',
    target: { primaryTab: 'governance', sectionTab: 'records' },
  },
  {
    id: 'lessons-learnt',
    title: 'Lessons learnt',
    description: 'Capture reusable lessons and recommendations for future delivery.',
    icon: 'book-open',
    target: { primaryTab: 'governance', sectionTab: 'records' },
  },
  {
    id: 'upcoming-forums',
    title: 'Governance Register',
    description: 'Review stage readiness, evidence, and approval status.',
    icon: 'calendar-days',
    target: { primaryTab: 'governance', sectionTab: 'forums' },
  },
  {
    id: 'change-request-register',
    title: 'Change request Register',
    description: 'Capture scope, timeline, or budget changes for approval.',
    icon: 'chart-pie',
    target: { primaryTab: 'governance', sectionTab: 'records' },
  },
  {
    id: 'report-builder',
    title: 'Report Builder',
    description: 'Identify threats, assess exposure, and monitor treatments.',
    icon: 'file-text',
    target: { primaryTab: 'governance', sectionTab: 'reports' },
  },
  {
    id: 'dependency-register',
    title: 'Dependency Register',
    description: 'Log blockers, assign owners, and follow resolution progress.',
    icon: 'network',
    target: { primaryTab: 'portfolio-register' },
  },
];

export const pmoStatusReports: readonly PmoStatusReport[] = [
  {
    id: 'status-report-01',
    title: 'Submit Vision 2030 weekly report',
    project: 'Vision 2030',
    dueDate: 'May 12',
    overdueText: 'Overdue by 5 days',
    isOverdue: true,
    ownerName: 'Muna Hasan',
    ownerInitials: 'MH',
  },
  {
    id: 'status-report-02',
    title: 'Submit Tasama 2026 weekly report',
    project: 'Tasama',
    dueDate: 'May 15',
    overdueText: 'Overdue by 2 days',
    isOverdue: true,
    ownerName: 'Osman Khan',
    ownerInitials: 'OK',
  },
  {
    id: 'status-report-03',
    title: 'Prepare budget analysis for Q3',
    project: 'UAE research',
    dueDate: 'May 18',
    overdueText: 'Overdue by 3 days',
    isOverdue: true,
    ownerName: 'Nadia Hossain',
    ownerInitials: 'NH',
  },
  {
    id: 'status-report-04',
    title: 'Prepare budget analysis for Q3',
    project: 'Shell',
    dueDate: 'May 25',
    overdueText: 'Overdue by 4 days',
    isOverdue: true,
    ownerName: 'Jasmine Smith',
    ownerInitials: 'JS',
  },
  {
    id: 'status-report-05',
    title: 'Finalize project timeline for Saudi Initiative',
    project: 'ARAMCO',
    dueDate: 'May 20',
    overdueText: 'Overdue by 1 day',
    isOverdue: true,
    ownerName: 'David Garcia',
    ownerInitials: 'DG',
  },
];
