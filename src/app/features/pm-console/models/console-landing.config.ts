import type { PmConsoleDigestSection } from '../../../shared/components/ui/digest-panel/digest-panel.component';
import type { PmConsoleFrontdoorAction } from '../components/frontdoor-action-cards/frontdoor-action-cards.component';
import type { RoleQuickLink } from '../components/role-quick-links-grid/role-quick-links-grid.component';

export const pmoQuickLinks: readonly RoleQuickLink[] = [
  {
    id: 'portfolio-register',
    title: 'Portfolio Register',
    description: 'Build and maintain scope, schedule, budget, and baseline.',
    icon: 'layout-grid',
  },
  {
    id: 'benefit-register',
    title: 'Benefit Register',
    description: 'Break the project into work packages and deliverables.',
    icon: 'gift',
  },
  {
    id: 'risk-register',
    title: 'Risk Register',
    description: 'Track linked work, owners, due dates, and delivery impact.',
    icon: 'triangle-alert',
  },
  {
    id: 'issues-register',
    title: 'Issues Register',
    description: 'Plan team assignments, capacity, and role ownership.',
    icon: 'circle-alert',
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Complete handover, lessons, benefits, and final approvals.',
    icon: 'user',
  },
  {
    id: 'lessons-learnt',
    title: 'Lessons learnt',
    description: 'Capture reusable lessons and recommendations for future delivery.',
    icon: 'book-open',
  },
  {
    id: 'upcoming-forums',
    title: 'Upcoming Forums',
    description: 'Review stage readiness, evidence, and approval status.',
    icon: 'calendar',
  },
  {
    id: 'change-request-register',
    title: 'Change request Register',
    description: 'Capture scope, timeline, or budget changes for approval.',
    icon: 'chart-pie',
  },
  {
    id: 'report-builder',
    title: 'Report Builder',
    description: 'Identify threats, assess exposure, and monitor treatments.',
    icon: 'file-text',
  },
  {
    id: 'dependency-register',
    title: 'Dependency Register',
    description: 'Log blockers, assign owners, and follow resolution progress.',
    icon: 'git-branch',
  },
];

export const portfolioManagerQuickLinks: readonly RoleQuickLink[] = [
  {
    id: 'framework-configuration',
    title: 'Framework & Configuration',
    description: 'Set governance controls, structures, users, workflows, and portfolio standards.',
    icon: 'settings',
  },
  {
    id: 'portfolio-workspace',
    title: 'Portfolio workspace',
    description: 'Open the portfolio workspace overview and continue monitoring delivery health.',
    icon: 'layout-grid',
  },
  {
    id: 'programs-projects',
    title: 'Programs & Projects',
    description: 'View portfolio programs and projects with their current delivery status.',
    icon: 'network',
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Create, review, and track portfolio status reports in one place.',
    icon: 'file-text',
  },
  {
    id: 'portfolio-performance',
    title: 'Portfolio performance',
    description: 'Track portfolio-level delivery, health, and financial performance insights.',
    icon: 'activity',
  },
  {
    id: 'action-review',
    title: 'Action review',
    description: 'Review pending approvals, follow-ups, and delivery actions for the portfolio.',
    icon: 'list-checks',
  },
];

export const pmoDigestSections: readonly PmConsoleDigestSection[] = [
  {
    label: 'Birds Eye View',
    items: [
      {
        parts: [
          { text: '3 of your 5 portfolios are' },
          { text: 'running on track!', emphasis: true },
        ],
      },
      {
        parts: [
          { text: 'You have' },
          { text: '15 actions', emphasis: true },
          { text: 'pending your review. Go to Manage my Work to view your calendar and clear your action board.' },
        ],
      },
    ],
  },
  {
    label: 'Portfolio Updates',
    items: [
      {
        parts: [
          { text: 'TASAMA Internal:', emphasis: true },
          { text: '14 items are delayed and 5 are critical.' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 1:', emphasis: true },
          { text: 'Reporting compliance is down to 74%... Follow up with managers...' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 2:', emphasis: true },
          { text: 'Has not submitted progress this month.' },
        ],
      },
    ],
  },
];

export const portfolioManagerDigestSections: readonly PmConsoleDigestSection[] = [
  {
    label: 'Birds Eye View',
    items: [
      {
        parts: [
          { text: 'Your portfolio is on track.' },
          { text: '72 of 91 items are running to schedule...', emphasis: true },
        ],
      },
    ],
  },
  {
    label: 'Portfolio Updates',
    items: [
      {
        parts: [
          { text: 'TASAMA Internal:', emphasis: true },
          { text: '14 items are delayed and 5 are critical.' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 1:', emphasis: true },
          { text: 'Reporting compliance is down to 74%... Follow up with managers...' },
        ],
      },
      {
        parts: [
          { text: 'Client Portfolio 2:', emphasis: true },
          { text: 'Has not submitted progress this month.' },
        ],
      },
    ],
  },
];

export const pmoOverviewActions: readonly PmConsoleFrontdoorAction[] = [
  {
    id: 'framework',
    title: 'Set up your framework',
    description: 'Define frameworks, governance controls, manage users, and set up your delivery standards.',
    icon: 'folder',
    decor: 'waves',
  },
  {
    id: 'create-manage',
    title: 'Portfolio Workspaces',
    description: 'Add new programs / projects to your portfolios, and manage risks, issues, and benefits.',
    icon: 'list',
    decor: 'loops',
  },
  {
    id: 'report-review',
    title: 'Governance & Reporting',
    description: 'Create scheduled or adhoc reports to monitor overall progress and review status reports.',
    icon: 'chart-column',
    decor: 'hex',
  },
  {
    id: 'insights',
    title: 'Insights & Decision Intelligence',
    description: 'Track delivery health and view performance trends across portfolios.',
    icon: 'layout-grid',
    decor: 'plus',
  },
  {
    id: 'learning-hub',
    title: 'Access & Manage Learning',
    description: 'Explore portfolio management playbooks, frameworks and guidelines to deliver at your best.',
    icon: 'book-open',
    decor: 'burst',
  },
];

export const portfolioManagerOverviewActions: readonly PmConsoleFrontdoorAction[] = [
  {
    id: 'framework',
    title: 'Set up your framework',
    description: 'Define frameworks, governance controls, manage users, and set up your delivery standards.',
    icon: 'folder',
    decor: 'waves',
  },
  {
    id: 'manage-portfolio',
    title: 'Manage portfolio',
    description: 'Add new programs / projects to your portfolios, and manage risks, issues, and benefits.',
    icon: 'network',
    decor: 'loops',
  },
  {
    id: 'report-progress',
    title: 'Report progress',
    description: 'Draft and submit status reports to monitor overall progress and review status reports.',
    icon: 'chart-column',
    decor: 'hex',
  },
  {
    id: 'portfolio-insights',
    title: 'Explore portfolio insights',
    description: 'Track delivery health and view performance trends across portfolios.',
    icon: 'layout-grid',
    decor: 'plus',
  },
  {
    id: 'learning-hub',
    title: 'Access Learning',
    description: 'Explore portfolio management playbooks, frameworks and guidelines to deliver at your best.',
    icon: 'book-open',
    decor: 'burst',
  },
];
