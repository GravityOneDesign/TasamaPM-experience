export interface KPICard {
  label: string;
  value: string;
  trend: string;
  icon: string;
}

export interface ObjectiveRow {
  title: string;
  measure: string;
  owner: string;
  status: 'On-Track' | 'Under Review' | 'Alert' | 'Delayed' | 'Completed' | 'Not Started';
}

export interface MilestoneRow {
  milestone: string;
  date: string;
  status: 'Completed' | 'On-Track' | 'Not Started' | 'Delayed';
}

export interface MandatoryWatchlistRow {
  id: string;
  item: string;
  owner: string;
  status: 'On-Track' | 'Under Review' | 'Alert' | 'Delayed' | 'Completed' | 'Not Started';
  dueDate: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  stage: string;
  trend: 'stable' | 'up' | 'down';
  manager: string;
  startDate: string;
  endDate: string;
  budgetUtilised: string;
  status: 'on-track' | 'off-track' | 'alert' | 'not-tracked' | 'not-started' | 'delayed' | 'completed' | 'under-review';
}

export interface ProgramRow {
  id: string;
  name: string;
  stage: string;
  trend: 'stable' | 'up' | 'down';
  manager: string;
  relatedPortfolio?: string;
  startDate: string;
  endDate: string;
  budgetUtilised: string;
  status: 'on-track' | 'off-track' | 'alert' | 'not-tracked' | 'not-started' | 'delayed' | 'completed' | 'under-review';
  isProgram: boolean;
  projects?: ProjectRow[];
}

export interface AwaitingReviewRow {
  interval: string;
  dueBy: string;
  reportingStatus: 'Draft' | 'Submitted' | 'Not Created';
  projectStatus: 'Alert' | 'On-Track' | 'Off-Track' | 'Under Review' | 'Delayed';
}

export interface ScheduledReportRow {
  name: string;
  scope: 'Portfolio' | 'Program' | 'Project';
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  nextDue: string;
  assignee: string;
  status: 'Active' | 'Paused';
}

export interface PastReportRow {
  name: string;
  period: string;
  status: 'Submitted' | 'Draft';
  createdBy: string;
  createdAt: string;
  portfolioStatus: 'On-Track' | 'Off-Track' | 'Alert';
}

export const portfolioSummary = {
  name: 'Safe Security',
  description: 'A cross-agency programme to secure national digital infrastructure and reduce cyber incident rates across government entities.',
  kpis: [
    { label: 'Overall Progress', value: '68%', trend: '+4%', icon: 'activity' },
    { label: 'Active Programs', value: '5', trend: 'Stable', icon: 'layers' },
    { label: 'Budget Utilisation', value: '42%', trend: '+2.4%', icon: 'wallet' },
    { label: 'Compliance Rate', value: '91%', trend: '+5.5%', icon: 'check-circle' }
  ] as KPICard[],
  objectives: [
    { title: 'Enhance Agency Firewall Policies', measure: '100% deployment on ministerial servers', owner: 'Dr. Khalid Al-Mansoori', status: 'On-Track' },
    { title: 'Incident Response Time Reduction', measure: 'Acknowledge P1 threats within 5 minutes', owner: 'Fatima Qahtani', status: 'Under Review' },
    { title: 'Secure Remote Access Framework', measure: 'Rollout of MFA across 45 national agencies', owner: 'Saeed Al-Mansoori', status: 'Alert' }
  ] as ObjectiveRow[],
  owner: 'Fatima Qahtani',
  sponsor: 'Dr. Khalid Al-Mansoori'
};

export const planContent = {
  problemStatement: 'The rapid expansion of national digitisation initiatives has introduced fragmented cybersecurity postures across government entities. Current threat detection speeds are insufficient, risking disruption to critical public services. Safe Security establishes a unified cyber defense capability across all partner agencies to mitigate risks proactively.',
  schedule: {
    baselineStart: '2026-01-15',
    baselineEnd: '2027-12-20',
    milestones: [
      { milestone: 'Phase 1 - Security Audit Completion', date: '2026-06-30', status: 'Completed' },
      { milestone: 'Phase 2 - Central SOC Integration', date: '2026-12-15', status: 'On-Track' },
      { milestone: 'Phase 3 - Endpoint Deployment & Signoff', date: '2027-10-01', status: 'Not Started' }
    ] as MilestoneRow[]
  },
  budget: {
    total: '$18,500,000',
    spent: '$7,770,000',
    nonFinancialResources: '12 dedicated cybersecurity experts, central PMO facilitation suite'
  },
  mandatoryWatchlist: [
    { id: 'mw-1', item: 'Threat Intelligence Sharing Agreement', owner: 'Fatima Qahtani', status: 'On-Track', dueDate: '2026-08-01' },
    { id: 'mw-2', item: 'Quarterly External Vulnerability Scan', owner: 'Dr. Khalid Al-Mansoori', status: 'Under Review', dueDate: '2026-09-15' },
    { id: 'mw-3', item: 'MFA Enforcement Directive', owner: 'Saeed Al-Mansoori', status: 'Alert', dueDate: '2026-07-30' },
    { id: 'mw-4', item: 'Agency Endpoint Agent Install Progress', owner: 'Amna Al-Hammadi', status: 'Delayed', dueDate: '2026-11-30' },
    { id: 'mw-5', item: 'Incident Playbook Standardization', owner: 'Fatima Qahtani', status: 'Completed', dueDate: '2026-05-10' }
  ] as MandatoryWatchlistRow[]
};

export const portfolioProgramRows: ProgramRow[] = [
  {
    id: 'prog-1',
    name: 'National Infrastructure Protection',
    stage: 'Execution',
    trend: 'up',
    manager: 'Sarah Jenkins',
    startDate: '2026-01-15',
    endDate: '2027-06-30',
    budgetUtilised: '$2.5M / $4.3M',
    status: 'on-track',
    isProgram: true,
    projects: [
      { id: 'proj-1-1', name: 'Ministerial SOC Hub Integration', stage: 'Execution', trend: 'stable', manager: 'Fatima Qahtani', startDate: '2026-02-01', endDate: '2026-08-30', budgetUtilised: '$125K / $320K', status: 'on-track' },
      { id: 'proj-1-2', name: 'Cross-Agency Endpoint Protection Rollout', stage: 'Closeout', trend: 'up', manager: 'Ali Al-Hashimi', startDate: '2026-01-20', endDate: '2026-05-15', budgetUtilised: '$125K / $320K', status: 'completed' }
    ]
  },
  {
    id: 'prog-2',
    name: 'Identity & Access Management',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Saeed Al-Mansoori',
    startDate: '2026-03-01',
    endDate: '2026-11-30',
    budgetUtilised: '$125K / $320K',
    status: 'alert',
    isProgram: true,
    projects: [
      { id: 'proj-2-1', name: 'Multi-Factor Authentication Rollout', stage: 'Planning', trend: 'down', manager: 'Saeed Al-Mansoori', startDate: '2026-03-10', endDate: '2026-07-20', budgetUtilised: '$125K / $320K', status: 'alert' },
      { id: 'proj-2-2', name: 'Centralised Directory Integration Services', stage: 'Initiation', trend: 'stable', manager: 'Mona Al-Mansoori', startDate: '2026-05-01', endDate: '2026-10-15', budgetUtilised: '$125K / $320K', status: 'not-started' }
    ]
  },
  {
    id: 'prog-3',
    name: 'Cyber Threat Intelligence',
    stage: 'Execution',
    trend: 'up',
    manager: 'Robert Chen',
    startDate: '2026-02-10',
    endDate: '2026-12-15',
    budgetUtilised: '$2.5M / $4.3M',
    status: 'on-track',
    isProgram: true,
    projects: [
      { id: 'proj-3-1', name: 'Shared Threat Intelligence Repository', stage: 'Execution', trend: 'up', manager: 'Amna Al-Hammadi', startDate: '2026-02-15', endDate: '2026-09-30', budgetUtilised: '$2.5M / $4.3M', status: 'on-track' },
      { id: 'proj-3-2', name: 'Proactive Threat Hunting Operations', stage: 'Planning', trend: 'stable', manager: 'Robert Chen', startDate: '2026-04-01', endDate: '2026-10-31', budgetUtilised: '$0 / $1.2M', status: 'under-review' }
    ]
  },
  {
    id: 'prog-4',
    name: 'Governance & Compliance Office',
    stage: 'Execution',
    trend: 'down',
    manager: 'Dr. Khalid Al-Mansoori',
    startDate: '2026-01-05',
    endDate: '2026-09-30',
    budgetUtilised: '$3.1M / $3.1M',
    status: 'off-track',
    isProgram: true,
    projects: [
      { id: 'proj-4-1', name: 'Regulatory Framework Alignment Audits', stage: 'Execution', trend: 'down', manager: 'Fatima Qahtani', startDate: '2026-01-10', endDate: '2026-05-20', budgetUtilised: '$3.1M / $3.1M', status: 'off-track' },
      { id: 'proj-4-2', name: 'Security Audit & Gaps Remediation Plan', stage: 'Execution', trend: 'stable', manager: 'Zainab Al-Baloushi', startDate: '2026-02-25', endDate: '2026-08-15', budgetUtilised: '$380K / $1.7M', status: 'delayed' }
    ]
  },
  {
    id: 'prog-5',
    name: 'Incident Response Capability',
    stage: 'Initiation',
    trend: 'stable',
    manager: 'Yousef Al-Mulla',
    startDate: '2026-05-15',
    endDate: '2026-12-31',
    budgetUtilised: '$0 / $1.2M',
    status: 'not-tracked',
    isProgram: true,
    projects: [
      { id: 'proj-5-1', name: 'Rapid Response Team Mobilization', stage: 'Initiation', trend: 'stable', manager: 'Yousef Al-Mulla', startDate: '2026-05-20', endDate: '2026-09-15', budgetUtilised: '$0 / $1.2M', status: 'not-tracked' }
    ]
  },
  {
    id: 'prog-6',
    name: 'National Data Sovereign Center',
    stage: 'Execution',
    trend: 'up',
    manager: 'Mariam Al-Ali',
    startDate: '2026-04-01',
    endDate: '2027-08-30',
    budgetUtilised: '$4.2M / $8.5M',
    status: 'on-track',
    isProgram: true,
    projects: [
      { id: 'proj-6-1', name: 'Encrypted Data Lake Foundation', stage: 'Execution', trend: 'stable', manager: 'Hamad Al-Subaie', startDate: '2026-04-10', endDate: '2026-12-15', budgetUtilised: '$2.1M / $4.0M', status: 'on-track' },
      { id: 'proj-6-2', name: 'Sovereign Cloud Gateway Infrastructure', stage: 'Planning', trend: 'up', manager: 'Sarah Jenkins', startDate: '2026-05-01', endDate: '2027-02-28', budgetUtilised: '$0 / $1.5M', status: 'under-review' }
    ]
  },
  {
    id: 'prog-7',
    name: 'Unified Command Operations',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Zainab Al-Baloushi',
    startDate: '2026-06-15',
    endDate: '2027-05-10',
    budgetUtilised: '$125K / $320K',
    status: 'alert',
    isProgram: true,
    projects: [
      { id: 'proj-7-1', name: 'Real-time Threat Monitoring Console', stage: 'Planning', trend: 'down', manager: 'Ali Al-Hashimi', startDate: '2026-07-01', endDate: '2026-12-30', budgetUtilised: '$125K / $320K', status: 'alert' }
    ]
  },
  {
    id: 'prog-8',
    name: 'Zero Trust Network Access',
    stage: 'Execution',
    trend: 'up',
    manager: 'Ali Al-Hashimi',
    startDate: '2026-03-15',
    endDate: '2027-12-31',
    budgetUtilised: '$3.5M / $6.0M',
    status: 'on-track',
    isProgram: true,
    projects: [
      { id: 'proj-8-1', name: 'Micro-segmentation Firewall Deployments', stage: 'Execution', trend: 'stable', manager: 'Robert Chen', startDate: '2026-04-01', endDate: '2026-11-30', budgetUtilised: '$1.5M / $3.0M', status: 'on-track' },
      { id: 'proj-8-2', name: 'Edge Security Access Verification', stage: 'Closeout', trend: 'up', manager: 'Mona Al-Mansoori', startDate: '2026-03-20', endDate: '2026-08-15', budgetUtilised: '$2.0M / $3.0M', status: 'completed' }
    ]
  }
];

export const standaloneProjects: ProgramRow[] = [
  {
    id: 'sa-proj-1',
    name: 'Standalone Cyber Security Awareness Campaign',
    stage: 'Execution',
    trend: 'stable',
    manager: 'Mariam Al-Ali',
    startDate: '2026-02-18',
    endDate: '2026-06-30',
    budgetUtilised: '$380K / $1.7M',
    status: 'on-track',
    isProgram: false
  },
  {
    id: 'sa-proj-2',
    name: 'Standalone Legacy Government Systems Decommissioning',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Hamad Al-Subaie',
    startDate: '2026-06-01',
    endDate: '2027-02-28',
    budgetUtilised: '$0 / $1.2M',
    status: 'not-started',
    isProgram: false
  },
  {
    id: 'sa-proj-3',
    name: 'Standalone National Cryptographic Policy Update',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Saeed Al-Mansoori',
    startDate: '2026-08-01',
    endDate: '2027-01-31',
    budgetUtilised: '$0 / $350K',
    status: 'under-review',
    isProgram: false
  },
  {
    id: 'sa-proj-4',
    name: 'Standalone Inter-ministerial Red Team Drills',
    stage: 'Execution',
    trend: 'up',
    manager: 'Fatima Qahtani',
    startDate: '2026-05-10',
    endDate: '2026-09-30',
    budgetUtilised: '$450K / $800K',
    status: 'on-track',
    isProgram: false
  }
];

export const portfolioReports = {
  awaitingReview: [
    { interval: 'Q2 2026', dueBy: '2026-07-15', reportingStatus: 'Draft', projectStatus: 'Alert' },
    { interval: 'May 2026', dueBy: '2026-06-05', reportingStatus: 'Submitted', projectStatus: 'On-Track' },
    { interval: 'Q1 2026', dueBy: '2026-04-15', reportingStatus: 'Submitted', projectStatus: 'On-Track' },
    { interval: 'April 2026', dueBy: '2026-05-05', reportingStatus: 'Submitted', projectStatus: 'On-Track' },
    { interval: 'March 2026', dueBy: '2026-04-05', reportingStatus: 'Submitted', projectStatus: 'Under Review' },
    { interval: 'Q4 2025', dueBy: '2026-01-15', reportingStatus: 'Submitted', projectStatus: 'Delayed' },
    { interval: 'Q3 2025', dueBy: '2025-10-15', reportingStatus: 'Not Created', projectStatus: 'Alert' }
  ] as AwaitingReviewRow[],
  scheduled: [
    { name: 'Cyber Incident Rate Report', scope: 'Portfolio', frequency: 'Weekly', nextDue: '2026-05-26', assignee: 'Fatima Qahtani', status: 'Active' },
    { name: 'MFA Enrolment Metrics', scope: 'Program', frequency: 'Monthly', nextDue: '2026-06-01', assignee: 'Saeed Al-Mansoori', status: 'Active' },
    { name: 'Endpoint Agent Compliance', scope: 'Project', frequency: 'Monthly', nextDue: '2026-06-05', assignee: 'Amna Al-Hammadi', status: 'Active' },
    { name: 'External Threat Briefing', scope: 'Portfolio', frequency: 'Quarterly', nextDue: '2026-07-15', assignee: 'Dr. Khalid Al-Mansoori', status: 'Active' },
    { name: 'Annual Security Governance Audit', scope: 'Portfolio', frequency: 'Annually', nextDue: '2027-01-15', assignee: 'Fatima Qahtani', status: 'Paused' }
  ] as ScheduledReportRow[],
  past: [
    { name: 'April 2026 Monthly Summary', period: '2026-04-01 - 2026-04-30', status: 'Submitted', createdBy: 'Fatima Qahtani', createdAt: '2026-05-02', portfolioStatus: 'On-Track' },
    { name: 'Q1 2026 Performance Review', period: '2026-01-01 - 2026-03-31', status: 'Submitted', createdBy: 'Fatima Qahtani', createdAt: '2026-04-12', portfolioStatus: 'On-Track' },
    { name: 'Central SOC Rollout Assessment', period: 'Ad-hoc', status: 'Submitted', createdBy: 'Dr. Khalid Al-Mansoori', createdAt: '2026-03-10', portfolioStatus: 'Off-Track' },
    { name: 'March 2026 Monthly Summary', period: '2026-03-01 - 2026-03-31', status: 'Draft', createdBy: 'Fatima Qahtani', createdAt: '2026-04-02', portfolioStatus: 'Alert' },
    { name: 'February 2026 Monthly Summary', period: '2026-02-01 - 2026-02-28', status: 'Draft', createdBy: 'Fatima Qahtani', createdAt: '2026-03-02', portfolioStatus: 'On-Track' },
    { name: 'Safe Security Baseline Proposal', period: 'Initiation', status: 'Submitted', createdBy: 'Dr. Khalid Al-Mansoori', createdAt: '2026-01-20', portfolioStatus: 'Alert' }
  ] as PastReportRow[]
};

export const reportsStats = {
  submittedReports: 4,
  drafts: 2,
  lastSubmitted: '2026-04-01',
  portfolioHealth: 'Poor',
  healthBreakdown: {
    onTrack: 15,
    alert: 25,
    offTrack: 60
  }
};

export type RiskLevel = 'portfolio' | 'program' | 'project';
export type RiskExposure = 'critical' | 'high' | 'medium' | 'low';
export type RiskStatus = 'escalated' | 'active' | 'monitoring' | 'watching';
export type RiskCategory =
  | 'Reputational'
  | 'Technology Risk'
  | 'Schedule Risk'
  | 'Financial Risk'
  | 'Operational Risk'
  | 'Compliance Risk'
  | 'Stakeholder Risk';

export const riskCategoryOptions: RiskCategory[] = [
  'Reputational',
  'Technology Risk',
  'Schedule Risk',
  'Financial Risk',
  'Operational Risk',
  'Compliance Risk',
  'Stakeholder Risk',
];

export interface Risk {
  id: string;
  name: string;
  category: RiskCategory;
  level: RiskLevel;
  linkedTo: string;
  parentProgram?: string;
  parentPortfolio?: string;
  owner: { name: string; initials: string };
  mitigation: string;
  lastReview: string;
  exposure: RiskExposure;
  status: RiskStatus;
}

export const riskRegisterData: Risk[] = [
  {
    id: 'RSK-01',
    name: 'Compliance evidence delay across local office stage-gates',
    category: 'Compliance Risk',
    level: 'portfolio',
    linkedTo: 'Safe Security Portfolio',
    owner: { name: 'PMO Desk', initials: 'PM' },
    mitigation: 'Prepare templates and pre-approve standardized evidence packs.',
    lastReview: '05/11/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-02',
    name: 'Cross-agency security policy adoption variance delaying portfolio assurance',
    category: 'Operational Risk',
    level: 'portfolio',
    linkedTo: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Use a single portfolio assurance checklist and escalate late agency confirmations through the steering forum.',
    lastReview: '05/14/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-03',
    name: 'Public confidence impact if cyber-readiness milestones slip across priority agencies',
    category: 'Reputational',
    level: 'portfolio',
    linkedTo: 'Safe Security Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    mitigation: 'Maintain executive communications, publish milestone recovery actions, and align agency launch messaging.',
    lastReview: '05/16/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-05',
    name: 'Stakeholder adoption delays due to training resource constraints',
    category: 'Reputational',
    level: 'project',
    linkedTo: 'Smart City Alpha',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Muna Hassan', initials: 'MH' },
    mitigation: 'Deliver self-service learning modules and automate onboarding.',
    lastReview: '05/08/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-06',
    name: 'Benefits owner responsiveness limiting baseline sign-offs',
    category: 'Operational Risk',
    level: 'program',
    linkedTo: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Laila Noor', initials: 'LN' },
    mitigation: 'Run weekly alignment workshops with key senior stakeholders.',
    lastReview: '05/09/2026',
    exposure: 'low',
    status: 'watching'
  },
  {
    id: 'RSK-07',
    name: 'Government MFA portal security audit response delays',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'MFA Government Portal',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Amna Al-Hammadi', initials: 'AA' },
    mitigation: 'Set up a dedicated audit readiness squad to prepare standard responses.',
    lastReview: '05/12/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-08',
    name: 'Identity governance approval queue delays affecting access control rollout',
    category: 'Stakeholder Risk',
    level: 'program',
    linkedTo: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    mitigation: 'Add approval service levels and route unresolved sign-offs through the program steering group.',
    lastReview: '05/13/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-09',
    name: 'Agency helpdesk readiness gaps for MFA cutover support',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'MFA Government Portal',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    mitigation: 'Run helpdesk simulations and publish cutover scripts before the next enrolment wave.',
    lastReview: '05/14/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-10',
    name: 'Core router bandwidth bottlenecks during backup syncs',
    category: 'Technology Risk',
    level: 'program',
    linkedTo: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    mitigation: 'Schedule backups during off-peak hours and provision redundant link bandwidth.',
    lastReview: '05/18/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-14',
    name: 'Token delivery failures during remote enrolment windows',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'MFA Government Portal',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Amna Al-Hammadi', initials: 'AA' },
    mitigation: 'Pre-stage alternate token channels and monitor failed delivery queues daily.',
    lastReview: '05/15/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-15',
    name: 'Network change freeze conflicts with backup sync remediation',
    category: 'Schedule Risk',
    level: 'program',
    linkedTo: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    mitigation: 'Reserve emergency change windows and sequence remediation work around freeze periods.',
    lastReview: '05/18/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-11',
    name: 'Hardware delivery delay on core modular switches',
    category: 'Schedule Risk',
    level: 'project',
    linkedTo: 'Riyadh Core Switch Upgrade',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Muna Hassan', initials: 'MH' },
    mitigation: 'Engage secondary logistics provider and utilize pre-staged backup hardware.',
    lastReview: '05/19/2026',
    exposure: 'high',
    status: 'monitoring'
  },
  {
    id: 'RSK-16',
    name: 'Data-center access permit delays for core switch installation',
    category: 'Schedule Risk',
    level: 'project',
    linkedTo: 'Riyadh Core Switch Upgrade',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Muna Hassan', initials: 'MH' },
    mitigation: 'Submit permit packs earlier and nominate backup installation windows with facilities teams.',
    lastReview: '05/20/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-12',
    name: 'Subnet collision risk during legacy database migrations',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Jeddah Database Migration',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Ali', initials: 'FA' },
    mitigation: 'Perform subnet configuration dry-runs and deploy dynamic NAT mapping.',
    lastReview: '05/20/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-17',
    name: 'Legacy firewall rule exports missing dependency mappings',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Jeddah Database Migration',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Ali', initials: 'FA' },
    mitigation: 'Reconcile rule exports with application dependency scans before migration rehearsals.',
    lastReview: '05/21/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-13',
    name: 'API authentication handshake timeouts with central registry',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'API Integration Project',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Khalid Omar', initials: 'KO' },
    mitigation: 'Establish a localized token caching layer and increase connection timeouts.',
    lastReview: '05/21/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-18',
    name: 'Awareness content localization approvals slow campaign launch',
    category: 'Stakeholder Risk',
    level: 'project',
    linkedTo: 'Smart City Alpha',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    mitigation: 'Lock bilingual content owners and approve standard campaign packs before agency rollout.',
    lastReview: '05/15/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-19',
    name: 'Vendor certificate rotation cadence misaligned with registry gateway',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'API Integration Project',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Khalid Omar', initials: 'KO' },
    mitigation: 'Align certificate rotation calendars and automate expiry alerts for registry endpoints.',
    lastReview: '05/22/2026',
    exposure: 'medium',
    status: 'active'
  }
];


export interface Benefit {
  id: string;
  name: string;
  benefit: string; // for compatibility with performance dashboard
  level: 'program' | 'project';
  linkedTo: string;
  parentProgram?: string; // nested project benefits in grouped view
  owner: { name: string; initials: string };
  targetDate: string;
  kpiMeasure: string;
  metric: string; // for compatibility with performance dashboard
  baseline: string; // for compatibility with performance dashboard
  target: string; // for compatibility with performance dashboard
  realization: string;
  status: 'On-Track' | 'Under Review' | 'Alert' | 'Delayed' | 'Completed' | 'on-track' | 'under-review' | 'alert' | 'delayed' | 'completed';
}

export const benefitsRegisterData: Benefit[] = [
  {
    id: 'BEN-01',
    name: 'Cyber Incident Rate Reduction',
    benefit: 'Cyber Incident Rate Reduction',
    level: 'program',
    linkedTo: 'National Infrastructure Protection',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    targetDate: '06/30/2027',
    kpiMeasure: 'Reduce monthly government cyber incidents by 45%',
    metric: 'Reduce monthly government cyber incidents by 45%',
    baseline: '4.8 incidents/month',
    target: '2.6 incidents/month',
    realization: '4.8 to 2.6 incidents/mo',
    status: 'On-Track'
  },
  {
    id: 'BEN-02',
    name: 'Improved SOC MTTR',
    benefit: 'Improved SOC MTTR',
    level: 'project',
    linkedTo: 'Ministerial SOC Hub Integration',
    parentProgram: 'National Infrastructure Protection',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    targetDate: '08/30/2026',
    kpiMeasure: 'Lower Mean Time to Respond to critical threats',
    metric: 'Lower Mean Time to Respond to critical threats',
    baseline: '45 mins average response',
    target: 'under 5 mins',
    realization: '45m to under 5m',
    status: 'On-Track'
  },
  {
    id: 'BEN-03',
    name: 'MFA Protection Level',
    benefit: 'MFA Protection Level',
    level: 'project',
    linkedTo: 'Multi-Factor Authentication Rollout',
    parentProgram: 'Identity & Access Program',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    targetDate: '07/20/2026',
    kpiMeasure: 'Attain 100% MFA enrolment for senior civil servants',
    metric: 'Attain 100% MFA enrolment for senior civil servants',
    baseline: '62% senior enrolment',
    target: '100% senior enrolment',
    realization: '62% to 100% senior',
    status: 'Alert'
  },
  {
    id: 'BEN-04',
    name: 'Unified Threat Feed Integration',
    benefit: 'Unified Threat Feed Integration',
    level: 'program',
    linkedTo: 'Cyber Threat Intelligence',
    owner: { name: 'Amna Al-Hammadi', initials: 'AA' },
    targetDate: '12/15/2026',
    kpiMeasure: 'Automated sharing across 45 agencies',
    metric: 'Automated sharing across 45 agencies',
    baseline: '12 agencies integrated',
    target: '45 agencies integrated',
    realization: '12 to 45 agencies',
    status: 'Under Review'
  },
  {
    id: 'BEN-05',
    name: 'Security awareness coverage',
    benefit: 'Security awareness coverage',
    level: 'project',
    linkedTo: 'Standalone Cyber Security Awareness Campaign',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    targetDate: '06/30/2026',
    kpiMeasure: 'Train 10,000+ government employees',
    metric: 'Train 10,000+ government employees',
    baseline: '1,200 trained',
    target: '10,000 trained',
    realization: '1,200 / 10k staff',
    status: 'On-Track'
  }
];

export interface GlossaryItem {
  id: string;
  systemLabel: string;
  customLabel: string;
  contextualHelp: string;
}

export const initialP3mGlossary: GlossaryItem[] = [
  { id: 'g1', systemLabel: 'Issue Priority', customLabel: 'Criticality', contextualHelp: 'Level of attention required on an issue' },
  { id: 'g2', systemLabel: 'Change Assessment Comment', customLabel: 'Comment', contextualHelp: 'A summary of the assessment conducted on the change request of the project/ program' },
  { id: 'g3', systemLabel: 'Resource Comment', customLabel: 'Comment', contextualHelp: 'Capture additional information regarding the resource requirement' },
  { id: 'g4', systemLabel: 'Project Business Unit', customLabel: 'Business Unit', contextualHelp: 'The Business Unit that own the project.' },
  { id: 'g5', systemLabel: 'Resource Business Unit', customLabel: 'Business Unit', contextualHelp: 'The Business Unit to which the Resource belongs to Or the Business Unit that would be involved with making the resource available for the project.' },
  { id: 'g6', systemLabel: 'Issue Status', customLabel: 'Status', contextualHelp: 'Level of attention required on an issue' },
  { id: 'g7', systemLabel: 'Benefit Owner', customLabel: 'Owner', contextualHelp: 'A role responsible for the realisation/harvesting of a specific benefit' },
  { id: 'g8', systemLabel: 'Project Description', customLabel: 'Description', contextualHelp: 'A brief description of the project including the salient features of the project.' },
  { id: 'g9', systemLabel: 'Product Description', customLabel: 'Description', contextualHelp: "A description of a product's purpose." },
  { id: 'g10', systemLabel: 'Stage Gate Status', customLabel: 'Approval Status', contextualHelp: 'The current stage-gate review status for this project lifecycle phase.' },
  { id: 'g11', systemLabel: 'Portfolio Owner', customLabel: 'Executive Sponsor', contextualHelp: 'The primary individual accountable for strategic alignment and funding approval at the portfolio level.' },
  { id: 'g12', systemLabel: 'Program Manager', customLabel: 'Strategic Lead', contextualHelp: 'The person responsible for coordinating and directing related projects within a strategic program.' },
  { id: 'g13', systemLabel: 'Project Manager', customLabel: 'Delivery Lead', contextualHelp: 'The person responsible for managing day-to-day execution and delivery of a project.' },
  { id: 'g14', systemLabel: 'Work Package', customLabel: 'Task Group', contextualHelp: 'A subset of a project that can be assigned to a specific team or department for execution.' }
];

export const initialRiskGlossary: GlossaryItem[] = [
  { id: 'r1', systemLabel: 'Inherent Risk', customLabel: 'Pre-control Risk', contextualHelp: 'The level of risk before any controls or mitigation actions have been applied.' },
  { id: 'r2', systemLabel: 'Residual Risk', customLabel: 'Post-control Risk', contextualHelp: 'The remaining level of risk after controls and mitigations have been implemented.' },
  { id: 'r3', systemLabel: 'Risk Owner', customLabel: 'Accountable Lead', contextualHelp: 'The individual responsible for monitoring the risk and implementing mitigation actions.' },
  { id: 'r4', systemLabel: 'Risk Treatment', customLabel: 'Mitigation Category', contextualHelp: 'The strategy chosen to manage a risk (e.g., Avoid, Mitigate, Transfer, Accept).' },
  { id: 'r5', systemLabel: 'Risk Probability', customLabel: 'Likelihood', contextualHelp: 'The estimated likelihood or frequency of a risk occurring during project delivery.' },
  { id: 'r6', systemLabel: 'Risk Impact', customLabel: 'Severity', contextualHelp: 'The degree of damage or disruption to strategic objectives if a risk is realized.' },
  { id: 'r7', systemLabel: 'Risk Category', customLabel: 'Domain', contextualHelp: 'The grouping of risks by common sources (e.g., Financial, Operational, Security, Reputational).' },
  { id: 'r8', systemLabel: 'Risk Control', customLabel: 'Mitigation Action', contextualHelp: 'The specific process or system deployed to reduce either the probability or impact of a risk.' },
  { id: 'r9', systemLabel: 'Control Effectiveness', customLabel: 'Effectiveness Rating', contextualHelp: 'The assessment of how successful a specific control is in mitigating risk.' },
  { id: 'r10', systemLabel: 'Risk Appetite', customLabel: 'Risk Tolerance', contextualHelp: 'The level of risk that an organization is willing to accept in pursuit of strategic value.' },
  { id: 'r11', systemLabel: 'Risk Register', customLabel: 'Risk Ledger', contextualHelp: 'The centralized repository where all identified risks, owners, mitigations, and histories are logged.' },
  { id: 'r12', systemLabel: 'Risk Review Frequency', customLabel: 'Review Interval', contextualHelp: 'The standard interval (e.g. weekly, monthly) at which risk exposures are reassessed.' }
];

export const initialBenefitsGlossary: GlossaryItem[] = [
  { id: 'b1', systemLabel: 'Financial Benefit', customLabel: 'Tangible Return', contextualHelp: 'A benefit that can be quantified and expressed in financial terms (e.g., cost savings, revenue growth).' },
  { id: 'b2', systemLabel: 'Non-Financial Benefit', customLabel: 'Qualitative Gain', contextualHelp: 'A benefit that cannot be easily quantified in financial terms but provides strategic value (e.g., brand reputation, citizen satisfaction).' },
  { id: 'b3', systemLabel: 'Baseline Value', customLabel: 'Starting Point', contextualHelp: 'The pre-program level of a metric against which improvements will be measured.' },
  { id: 'b4', systemLabel: 'Target Value', customLabel: 'Goal Metric', contextualHelp: 'The expected level of achievement for a benefit metric at a specific future date.' },
  { id: 'b5', systemLabel: 'Realization Date', customLabel: 'Delivery Target', contextualHelp: 'The specific calendar date by which a benefit is expected to be achieved and measured.' },
  { id: 'b6', systemLabel: 'Benefit Owner', customLabel: 'Harvesting Lead', contextualHelp: 'The individual responsible for ensuring that actions are taken to realize and harvest a specific benefit.' },
  { id: 'b7', systemLabel: 'KPI Measure', customLabel: 'Success Metric', contextualHelp: 'The key performance indicator used to verify benefit realization.' },
  { id: 'b8', systemLabel: 'Disbenefit', customLabel: 'Negative Side Effect', contextualHelp: 'A negative consequence of program or project delivery that must be managed alongside positive outcomes.' },
  { id: 'b9', systemLabel: 'Benefit Category', customLabel: 'Outcome Type', contextualHelp: 'The classification of benefits into functional areas (e.g., Process Efficiency, Risk Reduction, Citizen Experience).' },
  { id: 'b10', systemLabel: 'Benefit Enablement', customLabel: 'Business Change', contextualHelp: 'The changes in business operations or systems required to enable the realization of a benefit.' },
  { id: 'b11', systemLabel: 'Benefit Map', customLabel: 'Dependency Map', contextualHelp: 'A visual diagram showing how project deliverables connect to business changes and strategic outcomes.' },
  { id: 'b12', systemLabel: 'Review Frequency', customLabel: 'Harvesting Interval', contextualHelp: 'The interval at which benefit indicators are captured and reported.' }
];
