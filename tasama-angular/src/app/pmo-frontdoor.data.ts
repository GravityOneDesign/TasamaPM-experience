import type { PmConsoleDigestSection } from './shared/pm-console-digest-panel.component';
import type { PmConsoleFrontdoorAction } from './shared/pm-console-frontdoor-action-cards.component';
import type { PmConsoleModeTabItem } from './shared/pm-console-mode-tabs.component';
import type { PmoGovernanceWorkspaceTarget } from './pmo-governance-workspace.data';
import type { PortfolioActionItem, PortfolioBoardFilter } from './portfolio-manager-actions.data';

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
  { label: 'Portfolio Performance', onTrack: 3, delayed: 3, critical: 3 },
  { label: 'Program Performance', onTrack: 3, delayed: 3, critical: 3 },
];

export const pmoFrontdoorDigestSections: readonly PmConsoleDigestSection[] = [
  {
    label: 'Birds Eye View',
    items: [
      {
        parts: [{ text: '3 of your 5 portfolios are running on track!' }],
      },
      {
        parts: [{ text: 'You have 77 PMO review actions pending across plans, status reports, benefits, change requests, and governance committees. Go to Manage my Work to clear the highest-volume queues.' }],
      },
    ],
  },
  {
    label: 'Portfolio Updates',
    items: [
      {
        parts: [
          { text: 'TASAMA Internal', emphasis: true },
          { text: ': 14 items are delayed and 5 are critical. Visit your portfolio workspace to see which programs and projects need attention.' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 1', emphasis: true },
          { text: ': Reporting compliance is down to 74% this month from 89% last month. Follow up with managers who have not yet reported.' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 2', emphasis: true },
          { text: ': You have not submitted a portfolio report this month. Head to Report Progress to submit your latest status update.' },
        ],
      },
    ],
  },
];

export const pmoFrontdoorActions: readonly PmConsoleFrontdoorAction[] = [
  {
    id: 'framework',
    title: 'Set up your framework',
    description: 'Define frameworks, governance controls, manage users, and set the standards portfolios will run on.',
    icon: 'folder',
    decor: 'waves',
  },
  {
    id: 'create-manage',
    title: 'Create & manage',
    description: 'Add new programs / projects to your portfolios and keep registers updated in your Workspace!',
    icon: 'folder-tree',
    decor: 'loops',
  },
  {
    id: 'report-review',
    title: 'Report & Review Progress',
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
  },
];

export const pmoFrontdoorWorkFilters: readonly PortfolioBoardFilter[] = [
  { id: 'all', label: 'All PMO actions', icon: 'grid' },
  { id: 'plan', label: 'Plans', icon: 'plan' },
  { id: 'report', label: 'Status reports', icon: 'chart' },
  { id: 'benefit', label: 'Benefits', icon: 'benefit' },
  { id: 'change', label: 'Change requests', icon: 'changeRequest' },
  { id: 'governance', label: 'Governance committees', icon: 'calendar' },
];

const pmoWorkTargets: readonly { readonly project: string; readonly targetType: PmoFrontdoorWorkItem['targetType']; readonly owner: string }[] = [
  { project: 'Client Portfolio 1', targetType: 'portfolio', owner: 'MH' },
  { project: 'Client Portfolio 2', targetType: 'portfolio', owner: 'JT' },
  { project: 'TASAMA Internal', targetType: 'portfolio', owner: 'VD' },
  { project: 'Business Excellence', targetType: 'portfolio', owner: 'AK' },
  { project: 'ICT Division', targetType: 'portfolio', owner: 'KA' },
  { project: 'Sustainable Infrastructure', targetType: 'portfolio', owner: 'RS' },
  { project: 'Farm Tech Initiative', targetType: 'project', owner: 'CS' },
  { project: 'I - Chamber Sustainability Network', targetType: 'project', owner: 'CN' },
  { project: 'Audit Committee', targetType: 'portfolio', owner: 'HA' },
  { project: 'Design Decisions Committee', targetType: 'portfolio', owner: 'CV' },
];

interface PmoWorkGroupConfig {
  readonly id: string;
  readonly date: string;
  readonly label: string;
  readonly project: string;
  readonly type: string;
  readonly kind: PmoFrontdoorWorkItem['kind'];
  readonly tone: PmoFrontdoorWorkItem['tone'];
  readonly owner: string;
  readonly meta: string;
  readonly cta: string;
  readonly column: PmoFrontdoorWorkItem['column'];
  readonly count: number;
  readonly detailLabel: string;
  readonly detailType?: string;
  readonly detailDates: readonly string[];
  readonly detailMetas: readonly string[];
  readonly detailSummary: string;
}

function createPmoWorkGroup(config: PmoWorkGroupConfig): PmoFrontdoorWorkItem {
  const detailItems = Array.from({ length: config.count }, (_, index): PmoFrontdoorWorkItem => {
    const target = pmoWorkTargets[index % pmoWorkTargets.length];
    const dueDate = config.detailDates[index % config.detailDates.length];
    return {
      id: `${config.id}-item-${String(index + 1).padStart(2, '0')}`,
      date: dueDate,
      label: `${config.detailLabel} ${target.project}`,
      project: target.project,
      targetType: target.targetType,
      type: config.detailType || config.type,
      kind: config.kind,
      tone: config.tone,
      owner: target.owner,
      meta: config.detailMetas[index % config.detailMetas.length],
      cta: config.kind === 'change' ? 'Assess' : config.kind === 'governance' ? 'Open' : 'Review',
      column: config.column,
    };
  });

  return {
    id: config.id,
    date: config.date,
    label: config.label,
    project: config.project,
    targetType: 'portfolio',
    type: config.type,
    kind: config.kind,
    tone: config.tone,
    owner: config.owner,
    meta: config.meta,
    cta: config.cta,
    column: config.column,
    detailSummary: config.detailSummary,
    detailItems,
  };
}

const overdueDates = ['2026-05-20', '2026-05-21', '2026-05-22', '2026-05-25'] as const;
const thisWeekDates = ['2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30'] as const;
const upcomingDates = ['2026-06-01', '2026-06-03', '2026-06-05', '2026-06-08', '2026-06-12'] as const;

export const pmoFrontdoorWorkItems: readonly PmoFrontdoorWorkItem[] = [
  createPmoWorkGroup({
    id: 'pmo-plan-overdue',
    date: '2026-05-20',
    label: 'Approve / review plans',
    project: '5 plans overdue',
    type: 'Plan Review',
    kind: 'plan',
    tone: 'blue',
    owner: 'MH',
    meta: '5 overdue',
    cta: 'Open list',
    column: 'Overdue',
    count: 5,
    detailLabel: 'Review plan for',
    detailDates: overdueDates,
    detailMetas: ['Overdue by 6 days', 'Overdue by 5 days', 'Overdue by 4 days', 'Overdue by 1 day'],
    detailSummary: 'Plans awaiting PMO approval before teams can proceed with execution baselines.',
  }),
  createPmoWorkGroup({
    id: 'pmo-report-overdue',
    date: '2026-05-21',
    label: 'Review status reports',
    project: '7 reports overdue',
    type: 'Status Report',
    kind: 'report',
    tone: 'blue',
    owner: 'MH',
    meta: '7 overdue',
    cta: 'Open list',
    column: 'Overdue',
    count: 7,
    detailLabel: 'Review status report for',
    detailDates: overdueDates,
    detailMetas: ['Overdue by 6 days', 'Overdue by 5 days', 'Overdue by 2 days'],
    detailSummary: 'Submitted status reports need PMO validation, comments, and follow-up decisions.',
  }),
  createPmoWorkGroup({
    id: 'pmo-cr-overdue',
    date: '2026-05-22',
    label: 'Assess change requests',
    project: '3 CRs overdue',
    type: 'Change Request',
    kind: 'change',
    tone: 'red',
    owner: 'JT',
    meta: '3 overdue',
    cta: 'Open list',
    column: 'Overdue',
    count: 3,
    detailLabel: 'Assess CR for',
    detailDates: overdueDates,
    detailMetas: ['Overdue by 4 days', 'Overdue by 3 days', 'Overdue by 1 day'],
    detailSummary: 'Change requests need impact validation before committee decisions are recorded.',
  }),
  createPmoWorkGroup({
    id: 'pmo-governance-overdue',
    date: '2026-05-25',
    label: 'Prepare governance committees',
    project: '2 committee packs overdue',
    type: 'Governance Committee',
    kind: 'governance',
    tone: 'green',
    owner: 'HA',
    meta: '2 overdue',
    cta: 'Open list',
    column: 'Overdue',
    count: 2,
    detailLabel: 'Prepare committee pack for',
    detailDates: overdueDates,
    detailMetas: ['Pack overdue', 'Decision record overdue'],
    detailSummary: 'Governance committee packs and decision records require PMO completion.',
  }),
  createPmoWorkGroup({
    id: 'pmo-plan-week',
    date: '2026-05-26',
    label: 'Approve / review plans',
    project: '10 plans this week',
    type: 'Plan Review',
    kind: 'plan',
    tone: 'blue',
    owner: 'MH',
    meta: '10 this week',
    cta: 'Open list',
    column: 'This week',
    count: 10,
    detailLabel: 'Review plan for',
    detailDates: thisWeekDates,
    detailMetas: ['Due today', 'Due tomorrow', 'Due in 2 days', 'Due Friday'],
    detailSummary: 'High-volume planning reviews due this week across active portfolios and projects.',
  }),
  createPmoWorkGroup({
    id: 'pmo-report-week',
    date: '2026-05-26',
    label: 'Review status reports',
    project: '9 reports this week',
    type: 'Status Report',
    kind: 'report',
    tone: 'blue',
    owner: 'MH',
    meta: '9 this week',
    cta: 'Open list',
    column: 'This week',
    count: 9,
    detailLabel: 'Review status report for',
    detailDates: thisWeekDates,
    detailMetas: ['Due today', 'Due tomorrow', 'Due in 2 days', 'Due this week'],
    detailSummary: 'Status reports need review before the portfolio digest and management update.',
  }),
  createPmoWorkGroup({
    id: 'pmo-benefit-week',
    date: '2026-05-28',
    label: 'Review benefits',
    project: '6 benefits this week',
    type: 'Benefit Review',
    kind: 'benefit',
    tone: 'blue',
    owner: 'CS',
    meta: '6 this week',
    cta: 'Open list',
    column: 'This week',
    count: 6,
    detailLabel: 'Review benefit evidence for',
    detailDates: thisWeekDates,
    detailMetas: ['Evidence due today', 'Measure due tomorrow', 'Owner response due Friday'],
    detailSummary: 'Benefit evidence and measure updates are ready for PMO assurance.',
  }),
  createPmoWorkGroup({
    id: 'pmo-cr-week',
    date: '2026-05-29',
    label: 'Assess change requests',
    project: '5 CRs this week',
    type: 'Change Request',
    kind: 'change',
    tone: 'red',
    owner: 'JT',
    meta: '5 this week',
    cta: 'Open list',
    column: 'This week',
    count: 5,
    detailLabel: 'Assess CR for',
    detailDates: thisWeekDates,
    detailMetas: ['Impact due today', 'Finance review due tomorrow', 'Committee route due Friday'],
    detailSummary: 'Change requests require PMO impact review, routing, and recommendation notes.',
  }),
  createPmoWorkGroup({
    id: 'pmo-governance-week',
    date: '2026-05-30',
    label: 'Prepare governance committees',
    project: '4 committees this week',
    type: 'Governance Committee',
    kind: 'governance',
    tone: 'green',
    owner: 'HA',
    meta: '4 this week',
    cta: 'Open list',
    column: 'This week',
    count: 4,
    detailLabel: 'Prepare committee pack for',
    detailDates: thisWeekDates,
    detailMetas: ['Agenda due today', 'Pack due tomorrow', 'Record due Friday'],
    detailSummary: 'Governance forums need agendas, evidence packs, and decision records prepared.',
  }),
  createPmoWorkGroup({
    id: 'pmo-plan-upcoming',
    date: '2026-06-01',
    label: 'Approve / review plans',
    project: '8 plans upcoming',
    type: 'Plan Review',
    kind: 'plan',
    tone: 'blue',
    owner: 'MH',
    meta: '8 upcoming',
    cta: 'Open list',
    column: 'Upcoming',
    count: 8,
    detailLabel: 'Review plan for',
    detailDates: upcomingDates,
    detailMetas: ['Due 01 Jun', 'Due 03 Jun', 'Due 05 Jun', 'Due 08 Jun'],
    detailSummary: 'Upcoming baseline and replanning submissions are queued for PMO review.',
  }),
  createPmoWorkGroup({
    id: 'pmo-report-upcoming',
    date: '2026-06-03',
    label: 'Review status reports',
    project: '6 reports upcoming',
    type: 'Status Report',
    kind: 'report',
    tone: 'blue',
    owner: 'MH',
    meta: '6 upcoming',
    cta: 'Open list',
    column: 'Upcoming',
    count: 6,
    detailLabel: 'Review status report for',
    detailDates: upcomingDates,
    detailMetas: ['Due 03 Jun', 'Due 05 Jun', 'Due 08 Jun'],
    detailSummary: 'Scheduled reports will need PMO review in the next reporting cycle.',
  }),
  createPmoWorkGroup({
    id: 'pmo-benefit-upcoming',
    date: '2026-06-05',
    label: 'Review benefits',
    project: '5 benefits upcoming',
    type: 'Benefit Review',
    kind: 'benefit',
    tone: 'blue',
    owner: 'CS',
    meta: '5 upcoming',
    cta: 'Open list',
    column: 'Upcoming',
    count: 5,
    detailLabel: 'Review benefit evidence for',
    detailDates: upcomingDates,
    detailMetas: ['Due 05 Jun', 'Due 08 Jun', 'Due 12 Jun'],
    detailSummary: 'Upcoming benefit assurance checks are queued for PMO validation.',
  }),
  createPmoWorkGroup({
    id: 'pmo-cr-upcoming',
    date: '2026-06-08',
    label: 'Assess change requests',
    project: '4 CRs upcoming',
    type: 'Change Request',
    kind: 'change',
    tone: 'red',
    owner: 'JT',
    meta: '4 upcoming',
    cta: 'Open list',
    column: 'Upcoming',
    count: 4,
    detailLabel: 'Assess CR for',
    detailDates: upcomingDates,
    detailMetas: ['Due 08 Jun', 'Due 12 Jun', 'Next committee'],
    detailSummary: 'Upcoming change requests need impact review before governance routing.',
  }),
  createPmoWorkGroup({
    id: 'pmo-governance-upcoming',
    date: '2026-06-12',
    label: 'Prepare governance committees',
    project: '3 committees upcoming',
    type: 'Governance Committee',
    kind: 'governance',
    tone: 'green',
    owner: 'HA',
    meta: '3 upcoming',
    cta: 'Open list',
    column: 'Upcoming',
    count: 3,
    detailLabel: 'Prepare committee pack for',
    detailDates: upcomingDates,
    detailMetas: ['Due 12 Jun', 'Next forum cycle', 'Decision record pending'],
    detailSummary: 'Upcoming governance committees need PMO agenda and evidence preparation.',
  }),
];

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
    title: 'Upcoming Forums',
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
