export interface PmoDecisionIntelligenceCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface PmoDecisionIntelligenceCategoryArtwork {
  readonly src: string;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface PmoDecisionIntelligenceSection {
  readonly id: string;
  readonly title: string;
  readonly count: number;
  readonly icon: string;
  readonly expanded: boolean;
  readonly categoryArtwork: PmoDecisionIntelligenceCategoryArtwork;
  readonly cards: readonly PmoDecisionIntelligenceCard[];
}

export const pmoDecisionIntelligenceSections: readonly PmoDecisionIntelligenceSection[] = [
  {
    id: 'manage-delivery',
    title: 'Manage Delivery',
    count: 3,
    icon: 'activity',
    expanded: true,
    categoryArtwork: {
      src: 'assets/pmo-decision-intelligence/manage-delivery-art.png',
      left: -3,
      top: -3,
      width: 136,
      height: 108,
    },
    cards: [
      {
        id: 'delivery-health',
        title: 'Delivery Health Insights',
        description: 'Compare portfolio, program, and project health signals before variance becomes an escalation.',
        icon: 'chart-no-axes-combined',
      },
      {
        id: 'decision-radar',
        title: 'Decision Readiness Radar',
        description: 'Track pending decisions, sponsor readiness, and evidence gaps across governance forums.',
        icon: 'radar',
      },
      {
        id: 'risk-dependency-trends',
        title: 'Risk & Dependency Trends',
        description: 'Connect risks, dependencies, and lagging actions to the delivery areas that need PMO attention.',
        icon: 'route',
      },
    ],
  },
  {
    id: 'performance-trends',
    title: 'Performance Trends',
    count: 2,
    icon: 'chart-column',
    expanded: false,
    categoryArtwork: {
      src: 'assets/pmo-decision-intelligence/performance-trends-art.png',
      left: -3,
      top: -3,
      width: 136,
      height: 108,
    },
    cards: [
      {
        id: 'portfolio-performance-trends',
        title: 'Portfolio Performance Trends',
        description: 'Spot movement in schedule, budget, benefits, and health trends across portfolio cycles.',
        icon: 'trending-up',
      },
      {
        id: 'budget-benefit-variance',
        title: 'Budget & Benefit Variance',
        description: 'Compare planned value, actual spend, and benefits confidence before exceptions need review.',
        icon: 'circle-dollar-sign',
      },
    ],
  },
  {
    id: 'governance-intelligence',
    title: 'Governance Intelligence',
    count: 3,
    icon: 'brain-circuit',
    expanded: false,
    categoryArtwork: {
      src: 'assets/pmo-decision-intelligence/governance-intelligence-art.png',
      left: -3,
      top: -3,
      width: 136,
      height: 108,
    },
    cards: [
      {
        id: 'forum-decision-traceability',
        title: 'Forum & Decision Traceability',
        description: 'Follow governance items from forum discussion through decisions, actions, and records.',
        icon: 'landmark',
      },
      {
        id: 'compliance-assurance-signals',
        title: 'Compliance Assurance Signals',
        description: 'Review evidence quality, overdue controls, and assurance gaps across delivery forums.',
        icon: 'shield-check',
      },
      {
        id: 'executive-escalation-briefs',
        title: 'Executive Escalation Briefs',
        description: 'Prepare decision-ready briefs for items that need sponsor attention or executive steer.',
        icon: 'clipboard-check',
      },
    ],
  },
];
