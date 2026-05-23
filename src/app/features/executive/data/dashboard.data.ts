export interface ExecutiveScopeMetric {
  readonly value: string;
  readonly label: string;
}

export interface ExecutiveBulletinItem {
  readonly title: string;
  readonly body: string;
}

export interface ExecutiveBudgetSummary {
  readonly label: string;
  readonly actual: string;
  readonly planned: string;
  readonly percentage: string;
  readonly usageLabel: string;
}

export interface ExecutiveIllustrationLayer {
  readonly id: 'portfolio-performing' | 'budget-tracking';
  readonly src: string;
}

export interface ExecutiveInsightCard {
  readonly id: 'portfolio' | 'budget';
  readonly title: string;
  readonly illustrationLayers: readonly ExecutiveIllustrationLayer[];
  readonly statusLabel?: string;
  readonly budgetSummary?: ExecutiveBudgetSummary;
}

export const executiveScopeMetrics: readonly ExecutiveScopeMetric[] = [
  {
    value: '10',
    label: 'Total Programs',
  },
  {
    value: '25',
    label: 'Total Projects',
  },
];

export const executiveBulletins: readonly ExecutiveBulletinItem[] = [
  {
    title: 'Rolling AI Commentary',
    body: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
  },
  {
    title: 'Rolling AI Commentary',
    body: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
  },
  {
    title: 'Rolling AI Commentary',
    body: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
  },
  {
    title: 'Rolling AI Commentary',
    body: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
  },
];

export const executiveInsightCards: readonly ExecutiveInsightCard[] = [
  {
    id: 'portfolio',
    title: 'How is my Portfolio Performing?',
    illustrationLayers: [
      {
        id: 'portfolio-performing',
        src: 'assets/executive/portfolio-performing.svg',
      },
    ],
    statusLabel: 'Overall Status : On Track',
  },
  {
    id: 'budget',
    title: 'How are we tracking against our Budgets?',
    illustrationLayers: [
      {
        id: 'budget-tracking',
        src: 'assets/executive/budget-tracking.svg',
      },
    ],
    budgetSummary: {
      label: 'Actual Vs Planned Budget',
      actual: '$175.9M',
      planned: '$479.9M',
      percentage: '40%',
      usageLabel: 'Of Total Budget Used',
    },
  },
];
