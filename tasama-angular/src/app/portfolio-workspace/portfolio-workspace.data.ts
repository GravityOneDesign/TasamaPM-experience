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
    budgetUtilised: '45%',
    status: 'on-track',
    isProgram: true,
    projects: [
      { id: 'proj-1-1', name: 'Ministerial SOC Hub Integration', stage: 'Execution', trend: 'stable', manager: 'Fatima Qahtani', startDate: '2026-02-01', budgetUtilised: '50%', status: 'on-track' },
      { id: 'proj-1-2', name: 'Cross-Agency Endpoint Protection Rollout', stage: 'Closeout', trend: 'up', manager: 'Ali Al-Hashimi', startDate: '2026-01-20', budgetUtilised: '98%', status: 'completed' }
    ]
  },
  {
    id: 'prog-2',
    name: 'Identity & Access Management',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Saeed Al-Mansoori',
    startDate: '2026-03-01',
    budgetUtilised: '12%',
    status: 'alert',
    isProgram: true,
    projects: [
      { id: 'proj-2-1', name: 'Multi-Factor Authentication Rollout', stage: 'Planning', trend: 'down', manager: 'Saeed Al-Mansoori', startDate: '2026-03-10', budgetUtilised: '15%', status: 'alert' },
      { id: 'proj-2-2', name: 'Centralised Directory Integration Services', stage: 'Initiation', trend: 'stable', manager: 'Mona Al-Mansoori', startDate: '2026-05-01', budgetUtilised: '2%', status: 'not-started' }
    ]
  },
  {
    id: 'prog-3',
    name: 'Cyber Threat Intelligence',
    stage: 'Execution',
    trend: 'up',
    manager: 'Robert Chen',
    startDate: '2026-02-10',
    budgetUtilised: '38%',
    status: 'on-track',
    isProgram: true,
    projects: [
      { id: 'proj-3-1', name: 'Shared Threat Intelligence Repository', stage: 'Execution', trend: 'up', manager: 'Amna Al-Hammadi', startDate: '2026-02-15', budgetUtilised: '40%', status: 'on-track' },
      { id: 'proj-3-2', name: 'Proactive Threat Hunting Operations', stage: 'Planning', trend: 'stable', manager: 'Robert Chen', startDate: '2026-04-01', budgetUtilised: '20%', status: 'under-review' }
    ]
  },
  {
    id: 'prog-4',
    name: 'Governance & Compliance Office',
    stage: 'Execution',
    trend: 'down',
    manager: 'Dr. Khalid Al-Mansoori',
    startDate: '2026-01-05',
    budgetUtilised: '60%',
    status: 'off-track',
    isProgram: true,
    projects: [
      { id: 'proj-4-1', name: 'Regulatory Framework Alignment Audits', stage: 'Execution', trend: 'down', manager: 'Fatima Qahtani', startDate: '2026-01-10', budgetUtilised: '75%', status: 'off-track' },
      { id: 'proj-4-2', name: 'Security Audit & Gaps Remediation Plan', stage: 'Execution', trend: 'stable', manager: 'Zainab Al-Baloushi', startDate: '2026-02-25', budgetUtilised: '45%', status: 'delayed' }
    ]
  },
  {
    id: 'prog-5',
    name: 'Incident Response Capability',
    stage: 'Initiation',
    trend: 'stable',
    manager: 'Yousef Al-Mulla',
    startDate: '2026-05-15',
    budgetUtilised: '0%',
    status: 'not-tracked',
    isProgram: true,
    projects: [
      { id: 'proj-5-1', name: 'Rapid Response Team Mobilization', stage: 'Initiation', trend: 'stable', manager: 'Yousef Al-Mulla', startDate: '2026-05-20', budgetUtilised: '0%', status: 'not-tracked' }
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
    budgetUtilised: '30%',
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
    budgetUtilised: '0%',
    status: 'not-started',
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
    { name: 'April 2026 Monthly Summary', period: '2026-04-01 - 2026-04-30', status: 'Submitted', createdBy: 'Fatima Qahtani', createdAt: '2026-05-02' },
    { name: 'Q1 2026 Performance Review', period: '2026-01-01 - 2026-03-31', status: 'Submitted', createdBy: 'Fatima Qahtani', createdAt: '2026-04-12' },
    { name: 'Central SOC Rollout Assessment', period: 'Ad-hoc', status: 'Submitted', createdBy: 'Dr. Khalid Al-Mansoori', createdAt: '2026-03-10' },
    { name: 'March 2026 Monthly Summary', period: '2026-03-01 - 2026-03-31', status: 'Submitted', createdBy: 'Fatima Qahtani', createdAt: '2026-04-02' },
    { name: 'February 2026 Monthly Summary', period: '2026-02-01 - 2026-02-28', status: 'Submitted', createdBy: 'Fatima Qahtani', createdAt: '2026-03-02' },
    { name: 'Safe Security Baseline Proposal', period: 'Initiation', status: 'Submitted', createdBy: 'Dr. Khalid Al-Mansoori', createdAt: '2026-01-20' }
  ] as PastReportRow[]
};

export const riskRegisterData = [
  { id: 'r-1', source: 'Internal Security Audit', description: 'MFA rollout delayed due to legacy identity providers integration issues.', owner: 'Saeed Al-Mansoori', category: 'Technical Integration', rating: 'Extreme', ratingColor: '#FF3B30' },
  { id: 'r-2', source: 'External Threat Report', description: 'Zero-day vulnerability found in core government proxy infrastructure.', owner: 'Amna Al-Hammadi', category: 'External Cyber Threat', rating: 'High', ratingColor: '#FF9500' },
  { id: 'r-3', source: 'Agency Feedback Survey', description: 'Low endpoint security agent compliance in local municipal offices.', owner: 'Ali Al-Hashimi', category: 'User Adoption', rating: 'Medium', ratingColor: '#FFCC00' }
];

export const benefitsRegisterData = [
  { id: 'b-1', benefit: 'Cyber Incident Rate Reduction', metric: 'Reduce monthly government cyber incidents by 45%', baseline: '4.8 incidents/month', target: '2.6 incidents/month', owner: 'Fatima Qahtani', status: 'On-Track' },
  { id: 'b-2', benefit: 'Improved SOC MTTR', metric: 'Lower Mean Time to Respond to critical threats', baseline: '45 mins average response', target: 'under 5 mins', owner: 'Dr. Khalid Al-Mansoori', status: 'On-Track' },
  { id: 'b-3', benefit: 'MFA Protection Level', metric: 'Attain 100% MFA enrolment for senior civil servants', baseline: '62% senior enrolment', target: '100% senior enrolment', owner: 'Saeed Al-Mansoori', status: 'Alert' }
];
