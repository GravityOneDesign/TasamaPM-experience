import type { PmConsoleDigestSection } from './shared/pm-console-digest-panel.component';
import type { PmConsoleFrontdoorAction } from './shared/pm-console-frontdoor-action-cards.component';
import type { PmConsoleModeTabItem } from './shared/pm-console-mode-tabs.component';

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

export interface PmoFrontdoorWorkItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly meta: string;
  readonly icon: string;
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
        parts: [{ text: 'You have 15 actions pending your review. Go to Manage my Work to view your calendar and clear your action board.' }],
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

export const pmoFrontdoorWorkItems: readonly PmoFrontdoorWorkItem[] = [
  {
    id: 'calendar',
    title: 'Review governance calendar',
    description: 'Check upcoming forums, reporting windows, and evidence review sessions.',
    meta: '6 events this week',
    icon: 'calendar-days',
  },
  {
    id: 'actions',
    title: 'Clear action board',
    description: 'Resolve pending decisions, source requests, and record approvals.',
    meta: '15 pending actions',
    icon: 'list-checks',
  },
  {
    id: 'reports',
    title: 'Submit portfolio report',
    description: 'Prepare the latest PMO portfolio update and route it for review.',
    meta: 'Due 01 Jun 2026',
    icon: 'file-text',
  },
];
