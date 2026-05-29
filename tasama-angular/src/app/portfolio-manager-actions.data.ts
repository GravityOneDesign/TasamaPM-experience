import type {
  BenefitProfileMeasureRow,
  BenefitProfileObjectiveLink,
  BenefitProfileRecipientRow,
  BenefitProfileRecord,
} from './shared/pm-console-benefit-profile.component';
import type {
  RiskProfileOptions,
  RiskProfileRecord,
  RiskTreatmentDraftRecord,
  RiskTreatmentRecord,
} from './shared/pm-console-risk-profile.component';

export interface PortfolioActionItem {
  id: string;
  date: string;          // ISO date string, e.g. '2026-05-12'
  label: string;         // e.g. 'Review Plan'
  project: string;       // target workspace/entity name, e.g. 'Vision 2030'
  targetType: 'portfolio' | 'program' | 'project';
  type: string;          // e.g. 'Review Plan', 'Review Risk', 'Review Benefit', 'Review Stagegate Assesment'
  kind: 'plan' | 'report' | 'risk' | 'benefit' | 'change' | 'governance' | 'milestone' | 'task' | 'dependency'; // mapped for filters
  tone: 'green' | 'red' | 'blue' | 'neutral'; // tone color class
  owner: string;         // initials, e.g. 'FA'
  meta: string;          // due label, e.g. 'Overdue by 5 days'
  cta: string;           // action label, e.g. 'Submit'
  column: 'Overdue' | 'This week' | 'Upcoming';
  detailItems?: readonly PortfolioActionItem[];
  detailSummary?: string;
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
  { id: 'all', label: 'All types', icon: 'grid' },
  { id: 'benefit', label: 'Benefits', icon: 'benefit' },
  { id: 'change', label: 'Change requests', icon: 'changeRequest' },
  { id: 'risk', label: 'Risk', icon: 'risks' },
  { id: 'plan', label: 'Plans', icon: 'plan' },
  { id: 'governance', label: 'Governance committee', icon: 'building' },
  { id: 'report', label: 'Status reports', icon: 'chart' },
];

export const portfolioActionItems: PortfolioActionItem[] = [
  {
    id: 'ACT-01',
    date: '2026-05-09',
    label: 'Review Plan',
    project: 'Vision 2030',
    targetType: 'project',
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
    targetType: 'project',
    type: 'Review Risk',
    kind: 'governance',
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
    targetType: 'project',
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
    targetType: 'project',
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
    targetType: 'project',
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
    targetType: 'project',
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
    targetType: 'project',
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
    targetType: 'project',
    type: 'Review Risk',
    kind: 'governance',
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
    targetType: 'project',
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
    targetType: 'project',
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
    targetType: 'project',
    type: 'Review Risk',
    kind: 'governance',
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
    targetType: 'project',
    type: 'Review Benefit',
    kind: 'benefit',
    tone: 'blue',
    owner: 'MH',
    meta: 'In 2 weeks',
    cta: 'Resolve',
    column: 'Upcoming'
  },
  // Adding the 6 items for May 26, 2026 (Figma Image 5)
  {
    id: 'ACT-13',
    date: '2026-05-26',
    label: 'Benefit Name',
    project: 'Vision 2030',
    targetType: 'project',
    type: 'Review Benefit',
    kind: 'benefit',
    tone: 'green',
    owner: 'MH',
    meta: 'Due soon',
    cta: 'Review',
    column: 'Upcoming'
  },
  {
    id: 'ACT-14',
    date: '2026-05-26',
    label: 'Change Request Title',
    project: 'UAE Research Map',
    targetType: 'project',
    type: 'Assess Change',
    kind: 'change',
    tone: 'blue',
    owner: 'FA',
    meta: 'Due soon',
    cta: 'Assess',
    column: 'Upcoming'
  },
  {
    id: 'ACT-15',
    date: '2026-05-26',
    label: 'Benefit Name',
    project: 'Vision 2030',
    targetType: 'project',
    type: 'Review Risk',
    kind: 'risk',
    tone: 'red',
    owner: 'AH',
    meta: 'Due soon',
    cta: 'Review',
    column: 'Upcoming'
  },
  {
    id: 'ACT-16',
    date: '2026-05-26',
    label: 'UAE Research map (Project name)',
    project: 'UAE Research Map',
    targetType: 'project',
    type: 'Review Plan',
    kind: 'plan',
    tone: 'blue',
    owner: 'MH',
    meta: 'Due soon',
    cta: 'Open',
    column: 'Upcoming'
  },
  {
    id: 'ACT-17',
    date: '2026-05-26',
    label: 'Annual Performance Review (Meeting name)',
    project: 'Forum Name',
    targetType: 'project',
    type: 'Open Meeting',
    kind: 'governance',
    tone: 'blue',
    owner: 'FA',
    meta: 'Due soon',
    cta: 'Open',
    column: 'Upcoming'
  },
  {
    id: 'ACT-18',
    date: '2026-05-26',
    label: 'UAE Research map (Project / Program / Portfolio name)',
    project: 'UAE Research Map',
    targetType: 'project',
    type: 'Review Report',
    kind: 'report',
    tone: 'blue',
    owner: 'SA',
    meta: 'Due soon',
    cta: 'Open report',
    column: 'Upcoming'
  }
];

export interface PortfolioActionReportDetail {
  intervalStart: string;
  intervalEnd: string;
  intervalStatus: string;
  stage: string;
  state: string;
  overallTrend: string;
  progress: number;
  baselineEnd: string;
  forecastEnd: string;
  comments: string;
  achievements: string;
  planned: string;
}

export interface PortfolioActionReportOption {
  label: string;
  simpleLabel?: string;
  value: string;
  tone: string;
  icon: string;
}

export interface PortfolioActionReportTrendOption {
  label: string;
  value: string;
  tone: string;
  icon: string;
}

export interface PortfolioActionReportTimelinePoint {
  date: string;
  tone: string;
  label: string;
}

export interface PortfolioActionReportCard {
  id: string;
  title: string;
  body: string;
  icon: string;
  status: string;
  tone: string;
  trend: string;
  comments: string;
  timeline: PortfolioActionReportTimelinePoint[];
}

export interface PortfolioActionReportOverviewField {
  label: string;
  hint: string;
  value: string;
  rows: number;
}

export interface PortfolioActionScopeProduct {
  title: string;
  icon?: string;
  type: string;
  owner: string;
  ownerInitials?: string;
  capability: string;
  dates: string;
  budget: string;
  status: string;
  actualStart: string;
  actualEnd: string;
  completed: string;
}

export interface PortfolioActionChecklistItem {
  label: string;
  meta: string;
  complete: boolean;
}

export const portfolioActionProjectOptions = ['Vision 2030', 'NEOM Integration', 'Smart City Alpha', 'UAE Research Map'];

export const portfolioActionReportStatusOptions: PortfolioActionReportOption[] = [
  { label: 'On track', simpleLabel: 'On track', value: 'On track', tone: 'green', icon: 'circle-check' },
  { label: 'Alert', simpleLabel: 'Alert', value: 'Alert', tone: 'amber', icon: 'triangle-alert' },
  { label: 'Off track', simpleLabel: 'Off track', value: 'Off track', tone: 'red', icon: 'circle-x' },
];

export const portfolioActionReportTrendOptions: PortfolioActionReportTrendOption[] = [
  { label: 'Improving', value: 'Improving', tone: 'green', icon: 'arrow-up' },
  { label: 'No change', value: 'No change', tone: 'neutral', icon: 'circle-minus' },
  { label: 'Declining', value: 'Declining', tone: 'red', icon: 'arrow-down' },
];

export const portfolioActionReportSections = ['Overview', 'Scope', 'Schedule', 'Budget', 'Risks', 'Benefits'];

export const portfolioActionRiskProfileConfig: RiskProfileOptions = {
  categoryOptions: ['Delivery', 'Strategic', 'Commercial', 'Operational', 'Technology'],
  ownerOptions: ['Fatima Qahtani', 'Muna Hassan', 'Ahmed Hassan', 'Sarah Al Saud'],
  statusOptions: ['Open', 'In treatment', 'Under review', 'Closed'],
  strategicRiskOptions: ['Yes', 'No'],
  impactedObjectiveOptions: ['Service continuity', 'Portfolio delivery confidence', 'Stakeholder readiness', 'Budget stewardship'],
  controlEffectivenessOptions: ['Effective', 'Partially effective', 'Needs improvement', 'Not rated'],
  treatmentApproachOptions: ['Mitigate the threat', 'Transfer the threat', 'Avoid the threat', 'Accept the threat'],
  treatmentTypeOptions: ['Mitigate', 'Transfer', 'Avoid', 'Accept'],
  treatmentCategoryOptions: ['Governance', 'Operational', 'Commercial', 'Technology', 'Stakeholder'],
  ownerPlaceholder: 'Select owner',
};

export const portfolioActionBenefitProfileOptions = {
  categoryOptions: ['Service improvement', 'Efficiency', 'Compliance', 'Customer experience', 'Financial'],
  ownerOptions: ['Fatima Qahtani', 'Muna Hassan', 'Ahmed Hassan', 'Sarah Al Saud'],
  productOptions: ['Portfolio operating rhythm', 'Citizen service platform', 'Governance evidence pack', 'Benefits dashboard'],
  strategicObjectiveOptions: ['Portfolio delivery confidence', 'Service continuity', 'Stakeholder readiness', 'Budget stewardship'],
};

export const portfolioActionRiskTreatmentDraftInitial: RiskTreatmentDraftRecord = {
  treatment: '',
  type: 'Mitigate',
  category: 'Governance',
  owner: '',
  manager: 'Fatima Qahtani',
  startDate: '',
  endDate: '',
  status: 'Proposed',
};

const defaultRiskTreatments: RiskTreatmentRecord[] = [
  {
    id: 'TRT-001',
    treatment: 'Confirm mitigation owner and next control checkpoint before the weekly portfolio review.',
    type: 'Mitigate',
    category: 'Governance',
    owner: 'Muna Hassan',
    manager: 'Fatima Qahtani',
    startDate: '2026-05-13',
    endDate: '2026-05-27',
    status: 'In progress',
  },
];

const portfolioActionRiskProfiles: Record<string, RiskProfileRecord> = {
  'NEOM Integration': {
    id: 'RSK-NEOM-014',
    riskCategory: 'Operational',
    riskName: 'Integration readiness exposure',
    description: 'Cross-workstream dependencies need an updated control view before the next governance checkpoint.',
    owner: 'Ahmed Hassan',
    manager: 'Fatima Qahtani',
    lead: 'Ahmed Hassan',
    startDate: '2026-05-01',
    endDate: '2026-06-14',
    reviewDueDate: '2026-05-25',
    status: 'Open',
    strategicRisk: 'Yes',
    enterpriseImpact: true,
    actualLikelihood: 'Likely',
    actualConsequence: 'Major',
    actualRating: 'High',
    residualLikelihood: 'Possible',
    residualConsequence: 'Moderate',
    residualRating: 'Medium',
    impactedObjective: 'Service continuity',
    sharedRisk: true,
    source: 'Program dependency review',
    consequence: 'Delayed integration handover could defer benefit realization and increase delivery cost.',
    controlSummary: 'Weekly readiness review is active, but the portfolio-level control evidence needs refresh.',
    overallControlEffectiveness: 'Partially effective',
    analysisComment: 'Escalation path and owner confirmation are required before the next stage review.',
    treatmentApproach: 'Mitigate the threat',
    treatmentType: 'Mitigate',
    treatmentComment: 'Bring the mitigation plan back into the active portfolio action cadence.',
    treatments: defaultRiskTreatments,
    createdOn: '2026-04-18',
  },
  'UAE Research Map': {
    id: 'RSK-UAE-021',
    riskCategory: 'Stakeholder',
    riskName: 'Evidence acceptance delay',
    description: 'Sponsor evidence packs need final acceptance before the next decision point.',
    owner: 'Muna Hassan',
    manager: 'Fatima Qahtani',
    lead: 'Muna Hassan',
    startDate: '2026-04-29',
    endDate: '2026-06-05',
    reviewDueDate: '2026-05-15',
    status: 'Under review',
    strategicRisk: 'No',
    enterpriseImpact: false,
    actualLikelihood: 'Possible',
    actualConsequence: 'Moderate',
    actualRating: 'Medium',
    residualLikelihood: 'Unlikely',
    residualConsequence: 'Moderate',
    residualRating: 'Low',
    impactedObjective: 'Stakeholder readiness',
    sharedRisk: false,
    source: 'Stage readiness check',
    consequence: 'Decision cycle may slip if acceptance evidence is incomplete.',
    controlSummary: 'PM has supplied draft evidence; PMO reviewer still needs the final sign-off note.',
    overallControlEffectiveness: 'Effective',
    analysisComment: 'The open exposure is narrow and can close once final evidence is attached.',
    treatmentApproach: 'Mitigate the threat',
    treatmentType: 'Mitigate',
    treatmentComment: 'Track evidence sign-off through the current stage gate action.',
    treatments: [
      {
        ...defaultRiskTreatments[0],
        id: 'TRT-002',
        treatment: 'Attach sponsor acceptance note and PMO review comment before gate submission.',
        owner: 'Fatima Qahtani',
        endDate: '2026-05-20',
      },
    ],
    createdOn: '2026-04-23',
  },
};

const emptyObjectiveLinks: BenefitProfileObjectiveLink[] = [];
const emptyRecipientRows: BenefitProfileRecipientRow[] = [];
const benefitMeasures: BenefitProfileMeasureRow[] = [
  {
    id: 'MEA-001',
    measure: 'Adoption milestone achieved',
    owner: 'Muna Hassan',
    description: 'Track whether the linked project has reached the expected adoption checkpoint.',
    metric: '% adoption',
    polarity: 'Higher is better',
    baselineValue: '42%',
    targetValue: '70%',
    frequency: 'Monthly',
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    status: 'Active',
    dependencies: 'Project report submission',
    informationSource: 'Portfolio benefits register',
  },
];

const portfolioActionBenefitProfiles: Record<string, BenefitProfileRecord> = {
  'Vision 2030': {
    id: 'BEN-VIS-009',
    project: 'Vision 2030',
    benefitType: 'Strategic',
    category: 'Service improvement',
    benefitName: 'Accelerated portfolio decision cycle',
    description: 'Reduce the decision latency for high-priority delivery items across the portfolio.',
    owner: 'Muna Hassan',
    realizationDate: '2026-07-31',
    state: 'Active',
    stage: 'Forecast',
    product: 'Portfolio operating rhythm',
    outcomes: 'More reliable escalation and quicker sponsor decisions.',
    strategicObjective: 'Portfolio delivery confidence',
    businessPlanObjectives: emptyObjectiveLinks,
    manager: 'Fatima Qahtani',
    recipients: emptyRecipientRows,
    impact: 'High',
    impactJustification: 'Improves decision confidence for multiple strategic projects.',
    likelihood: 'Medium',
    likelihoodJustification: 'Requires continued report compliance from project managers.',
    overallStatus: 'On track',
    statusComment: 'Benefit evidence is ready for PMO review.',
    measures: benefitMeasures,
    createdOn: '2026-04-20',
  },
  'Smart City Alpha': {
    id: 'BEN-SCA-004',
    project: 'Smart City Alpha',
    benefitType: 'Operational',
    category: 'Efficiency',
    benefitName: 'Smart service adoption uplift',
    description: 'Track the adoption uplift expected from the Smart City Alpha delivery release.',
    owner: 'Muna Hassan',
    realizationDate: '2026-08-15',
    state: 'Active',
    stage: 'Tracking',
    product: 'Citizen service platform',
    outcomes: 'Higher service usage and reduced manual processing.',
    strategicObjective: 'Service continuity',
    businessPlanObjectives: emptyObjectiveLinks,
    manager: 'Fatima Qahtani',
    recipients: emptyRecipientRows,
    impact: 'Medium',
    impactJustification: 'Benefit is visible in the next reporting period once adoption data lands.',
    likelihood: 'Medium',
    likelihoodJustification: 'Dependent on release adoption and data quality.',
    overallStatus: 'Needs review',
    statusComment: 'Confirm the latest measure values before portfolio review.',
    measures: benefitMeasures,
    createdOn: '2026-04-26',
  },
};

const defaultReportDetails: PortfolioActionReportDetail = {
  intervalStart: '01/05/2026',
  intervalEnd: '31/05/2026',
  intervalStatus: 'Draft',
  stage: 'Delivery',
  state: 'Active',
  overallTrend: 'No change',
  progress: 68,
  baselineEnd: '30/06/2026',
  forecastEnd: '07/07/2026',
  comments: 'Portfolio review is required before this report can be submitted.',
  achievements: 'Key workstreams reported progress, with one decision item pending PMO review.',
  planned: 'Close the outstanding action, refresh risks, and confirm benefit evidence.',
};

export function portfolioActionReportDetails(item: PortfolioActionItem): PortfolioActionReportDetail {
  const status = item.column === 'Overdue' ? 'Draft' : item.column === 'This week' ? 'Active' : 'Scheduled';
  const tone = item.column === 'Overdue' ? 'Alert' : 'On track';
  return {
    ...defaultReportDetails,
    intervalStatus: status,
    overallTrend: tone === 'Alert' ? 'No change' : 'Improving',
    comments: `${item.project} needs portfolio review for ${item.label.toLowerCase()} before the next governance update.`,
  };
}

export function portfolioActionReportCards(item: PortfolioActionItem): PortfolioActionReportCard[] {
  const isOverdue = item.column === 'Overdue';
  const tone = isOverdue ? 'amber' : 'green';
  const status = isOverdue ? 'Alert' : 'On track';
  const trend = isOverdue ? 'No change' : 'Improving';
  const timeline: PortfolioActionReportTimelinePoint[] = [
    { date: 'Mar', tone: 'green', label: 'March report on track' },
    { date: 'Apr', tone: isOverdue ? 'amber' : 'green', label: 'April review status' },
    { date: 'May', tone, label: 'Current action status' },
  ];

  return [
    {
      id: 'overview',
      title: 'Overview',
      body: 'Review the executive summary and current project status.',
      icon: 'info',
      status,
      tone,
      trend,
      comments: `${item.project} has an open portfolio action: ${item.meta}.`,
      timeline,
    },
    {
      id: 'scope',
      title: 'Dates and scope',
      body: 'Confirm whether schedule and scope remain valid for this reporting period.',
      icon: 'route',
      status,
      tone,
      trend,
      comments: 'Scope evidence is available, but the review needs final confirmation.',
      timeline,
    },
    {
      id: 'mandatory-watchlist',
      title: 'Risks',
      body: 'Check mandatory watchlist items before the report is submitted.',
      icon: 'risks',
      status: isOverdue ? 'Alert' : 'On track',
      tone,
      trend,
      comments: 'Risk and benefit updates should be reviewed as part of this action.',
      timeline,
    },
  ];
}

export function portfolioActionReportOverviewFields(item: PortfolioActionItem): PortfolioActionReportOverviewField[] {
  return [
    {
      label: 'Key achievements',
      hint: 'This period',
      value: `${item.project} completed the planned progress checks for the current reporting period.`,
      rows: 3,
    },
    {
      label: 'Planned activities',
      hint: 'Next period',
      value: 'Confirm open actions, refresh mandatory watchlist evidence, and prepare the next governance update.',
      rows: 3,
    },
  ];
}

export function portfolioActionScopeProducts(item: PortfolioActionItem): PortfolioActionScopeProduct[] {
  return [
    {
      title: `${item.project} governance evidence pack`,
      icon: 'management',
      type: 'Management product',
      owner: 'Fatima Qahtani',
      ownerInitials: 'FQ',
      capability: 'Portfolio assurance',
      dates: '01 May - 31 May 2026',
      budget: 'Within tolerance',
      status: item.column === 'Overdue' ? 'Alert' : 'On track',
      actualStart: '2026-05-01',
      actualEnd: '',
      completed: item.column === 'Overdue' ? '72' : '86',
    },
  ];
}

export function clonePortfolioActionRiskProfile(project: string): RiskProfileRecord {
  const source = portfolioActionRiskProfiles[project] || portfolioActionRiskProfiles['NEOM Integration'];
  return {
    ...source,
    treatments: source.treatments.map((treatment) => ({ ...treatment })),
  };
}

export function clonePortfolioActionBenefitProfile(project: string): BenefitProfileRecord {
  const source = portfolioActionBenefitProfiles[project] || portfolioActionBenefitProfiles['Vision 2030'];
  return {
    ...source,
    businessPlanObjectives: source.businessPlanObjectives.map((objective) => ({ ...objective })),
    recipients: source.recipients.map((recipient) => ({ ...recipient })),
    measures: source.measures.map((measure) => ({ ...measure })),
  };
}

export function portfolioActionStageChecklist(item: PortfolioActionItem): PortfolioActionChecklistItem[] {
  return [
    { label: 'Gate evidence pack', meta: `${item.project} evidence is attached for PMO review.`, complete: true },
    { label: 'Mandatory watchlist checked', meta: 'Risks, benefits, and dependencies have named owners.', complete: item.column !== 'Overdue' },
    { label: 'Sponsor decision note', meta: 'Confirm final sponsor note before approving the gate.', complete: false },
  ];
}

export function portfolioActionGenericChecklist(item: PortfolioActionItem): PortfolioActionChecklistItem[] {
  return [
    { label: 'Review action context', meta: `${item.project} · ${item.type}`, complete: true },
    { label: 'Confirm owner response', meta: `Assigned to ${item.owner}; ${item.meta}.`, complete: item.column !== 'Overdue' },
    { label: 'Record portfolio decision', meta: 'Capture the action outcome for the next digest.', complete: false },
  ];
}
