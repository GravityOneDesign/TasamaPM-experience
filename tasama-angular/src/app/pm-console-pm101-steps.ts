export type Pm101StepAction = 'project-plan' | 'project-workspace' | 'reports' | 'learning-hub' | 'framework' | 'registers';

export interface Pm101Step {
  title: string;
  body: string;
  icon: string;
  decor: string;
  decorAssets: string[];
  footerLabel?: string;
  footerValue?: string;
  footerAction?: string;
  footerActionId?: Pm101StepAction;
  completedLabel?: string;
  completedValue?: string;
  footerStandalone?: boolean;
  footerIconOnly?: boolean;
  comingSoon?: boolean;
}

export const pm101Steps: Pm101Step[] = [
  {
    title: 'Framework and configuration',
    body: 'Set up governance controls, onboard users, and define your portfolio standards.',
    icon: 'rocket',
    decor: 'burst',
    decorAssets: ['./assets/pm101/decor-1.svg'],
    footerAction: 'Configure Portfolio',
    footerActionId: 'project-plan',
  },
  {
    title: 'Portfolio design',
    body: 'Define objectives, add programs and projects, and structure your portfolio.',
    icon: 'plan',
    decor: 'rings',
    decorAssets: ['./assets/pm101/decor-2.svg'],
    footerAction: 'Add Programs & Projects',
    footerActionId: 'project-plan',
  },
  {
    title: 'Manage portfolio',
    body: 'Review program and project statuses, approve plans, and action flagged risks and benefits.',
    icon: 'playground',
    decor: 'loops',
    decorAssets: ['./assets/pm101/decor-4.svg'],
    footerAction: 'View Programs & Projects',
    footerActionId: 'project-workspace',
  },
  {
    title: 'Report and review',
    body: 'Draft and submit portfolio status reports and review reports from your programs and projects.',
    icon: 'chart',
    decor: 'hex',
    decorAssets: ['./assets/pm101/decor-5.svg'],
    footerAction: 'View Reports',
    footerActionId: 'reports',
  },
  {
    title: 'Portfolio performance',
    body: 'Track delivery health and view insights across your portfolio in one place.',
    icon: 'stageGate',
    decor: 'plus',
    decorAssets: ['./assets/pm101/decor-3-group-1.svg', './assets/pm101/decor-3-group-2.svg', './assets/pm101/decor-3-group-3.svg', './assets/pm101/decor-3-group-4.svg'],
    footerAction: 'View Performance',
    footerActionId: 'learning-hub',
  },
];

export const portfolioManagerSteps: Pm101Step[] = [
  {
    title: 'Set Up Your Framework',
    body: 'Set up governance controls, onboard users, and define your portfolio standards.',
    icon: 'rocket',
    decor: 'burst',
    decorAssets: ['./assets/pm101/decor-1.svg'],
    footerAction: 'Configure Portfolio',
    footerActionId: 'framework',
  },
  {
    title: 'Manage Portfolio',
    body: 'Review program and project statuses, approve plans, and action flagged risks and benefits.',
    icon: 'playground',
    decor: 'loops',
    decorAssets: ['./assets/pm101/decor-4.svg'],
    footerAction: 'View Programs & Projects',
    footerActionId: 'registers',
  },
  {
    title: 'Report and Review',
    body: 'Draft and submit portfolio status reports and review reports from your programs and projects.',
    icon: 'chart',
    decor: 'hex',
    decorAssets: ['./assets/pm101/decor-5.svg'],
    footerAction: 'View Reports',
    footerActionId: 'reports',
  },
  {
    title: 'Access Portfolio Insights',
    body: 'Track delivery health and view insights across your portfolio in one place.',
    icon: 'stageGate',
    decor: 'plus',
    decorAssets: ['./assets/pm101/decor-3-group-1.svg', './assets/pm101/decor-3-group-2.svg', './assets/pm101/decor-3-group-3.svg', './assets/pm101/decor-3-group-4.svg'],
    footerAction: 'View Performance',
    footerActionId: 'learning-hub',
    comingSoon: true,
  },
];

