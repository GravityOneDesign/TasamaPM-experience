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

export interface Risk {
  id: string;
  name: string;
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
    level: 'portfolio',
    linkedTo: 'National Security Portfolio',
    owner: { name: 'PMO Desk', initials: 'PM' },
    mitigation: 'Prepare templates and pre-approve standardized evidence packs.',
    lastReview: '05/11/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-02',
    name: 'Commercial overrun on third-party security integration APIs',
    level: 'program',
    linkedTo: 'SOC Expansion Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Fatima Ali', initials: 'FA' },
    mitigation: 'Rebaseline the contract scope with vendors and audit API calls.',
    lastReview: '05/10/2026',
    exposure: 'critical',
    status: 'escalated'
  },
  {
    id: 'RSK-03',
    name: 'Vendor delivery slip on Endpoint Agent integration milestones',
    level: 'project',
    linkedTo: 'NEOM SOC Integration',
    parentProgram: 'SOC Expansion Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Khalid Omar', initials: 'KO' },
    mitigation: 'Incorporate recovery buffers and evaluate secondary contractor options.',
    lastReview: '05/06/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-04',
    name: 'Database latency spikes during real-time SOC log ingestion',
    level: 'project',
    linkedTo: 'Riyadh SOC Baseline',
    parentProgram: 'SOC Expansion Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Muna Hassan', initials: 'MH' },
    mitigation: 'Optimize indexing on database tables and introduce Redis caching.',
    lastReview: '05/08/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-05',
    name: 'Stakeholder adoption delays due to training resource constraints',
    level: 'project',
    linkedTo: 'Smart City Alpha',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Muna Hassan', initials: 'MH' },
    mitigation: 'Deliver self-service learning modules and automate onboarding.',
    lastReview: '05/08/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-06',
    name: 'Benefits owner responsiveness limiting baseline sign-offs',
    level: 'program',
    linkedTo: 'Identity & Access Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Laila Noor', initials: 'LN' },
    mitigation: 'Run weekly alignment workshops with key senior stakeholders.',
    lastReview: '05/09/2026',
    exposure: 'low',
    status: 'watching'
  },
  {
    id: 'RSK-07',
    name: 'Government MFA portal security audit response delays',
    level: 'project',
    linkedTo: 'MFA Government Portal',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Amna Al-Hammadi', initials: 'AA' },
    mitigation: 'Set up a dedicated audit readiness squad to prepare standard responses.',
    lastReview: '05/12/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-08',
    name: 'Strategic misalignment with updated national compliance regulations',
    level: 'portfolio',
    linkedTo: 'Vision 2030 Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    mitigation: 'Perform a regulation gap analysis and update portfolio bylaws.',
    lastReview: '05/14/2026',
    exposure: 'critical',
    status: 'active'
  },
  {
    id: 'RSK-09',
    name: 'Integration delays with central citizen database',
    level: 'project',
    linkedTo: 'Vision 2030 Portal',
    parentPortfolio: 'Vision 2030 Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Leverage sandbox APIs and negotiate priority support SLA.',
    lastReview: '05/15/2026',
    exposure: 'high',
    status: 'monitoring'
  },
  {
    id: 'RSK-10',
    name: 'Core router bandwidth bottlenecks during backup syncs',
    level: 'program',
    linkedTo: 'Network Security Upgrade Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    mitigation: 'Schedule backups during off-peak hours and provision redundant link bandwidth.',
    lastReview: '05/18/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-11',
    name: 'Hardware delivery delay on core modular switches',
    level: 'project',
    linkedTo: 'Riyadh Core Switch Upgrade',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Muna Hassan', initials: 'MH' },
    mitigation: 'Engage secondary logistics provider and utilize pre-staged backup hardware.',
    lastReview: '05/19/2026',
    exposure: 'high',
    status: 'monitoring'
  },
  {
    id: 'RSK-12',
    name: 'Subnet collision risk during legacy database migrations',
    level: 'project',
    linkedTo: 'Jeddah Database Migration',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Fatima Ali', initials: 'FA' },
    mitigation: 'Perform subnet configuration dry-runs and deploy dynamic NAT mapping.',
    lastReview: '05/20/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-13',
    name: 'API authentication handshake timeouts with central registry',
    level: 'project',
    linkedTo: 'API Integration Project',
    parentPortfolio: 'National Security Portfolio',
    owner: { name: 'Khalid Omar', initials: 'KO' },
    mitigation: 'Establish a localized token caching layer and increase connection timeouts.',
    lastReview: '05/21/2026',
    exposure: 'high',
    status: 'active'
  }
];


export const benefitsRegisterData = [
  { id: 'b-1', benefit: 'Cyber Incident Rate Reduction', metric: 'Reduce monthly government cyber incidents by 45%', baseline: '4.8 incidents/month', target: '2.6 incidents/month', owner: 'Fatima Qahtani', status: 'On-Track' },
  { id: 'b-2', benefit: 'Improved SOC MTTR', metric: 'Lower Mean Time to Respond to critical threats', baseline: '45 mins average response', target: 'under 5 mins', owner: 'Dr. Khalid Al-Mansoori', status: 'On-Track' },
  { id: 'b-3', benefit: 'MFA Protection Level', metric: 'Attain 100% MFA enrolment for senior civil servants', baseline: '62% senior enrolment', target: '100% senior enrolment', owner: 'Saeed Al-Mansoori', status: 'Alert' }
];
