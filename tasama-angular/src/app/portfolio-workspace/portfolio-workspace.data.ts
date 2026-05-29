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
    { label: 'Active Programs', value: '11', trend: 'Stable', icon: 'layers' },
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
    name: 'Identity & Access Program',
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
      { id: 'proj-2-2', name: 'Centralised Directory Integration Services', stage: 'Initiation', trend: 'stable', manager: 'Mona Al-Mansoori', startDate: '2026-05-01', endDate: '2026-10-15', budgetUtilised: '$125K / $320K', status: 'not-started' },
      { id: 'proj-2-3', name: 'MFA Government Portal', stage: 'Execution', trend: 'down', manager: 'Amna Al-Hammadi', startDate: '2026-04-05', endDate: '2026-09-15', budgetUtilised: '$410K / $900K', status: 'alert' },
      { id: 'proj-2-4', name: 'Privileged Access Vault', stage: 'Planning', trend: 'stable', manager: 'Laila Noor', startDate: '2026-06-01', endDate: '2027-01-20', budgetUtilised: '$80K / $680K', status: 'under-review' }
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
      { id: 'proj-3-2', name: 'Proactive Threat Hunting Operations', stage: 'Planning', trend: 'stable', manager: 'Robert Chen', startDate: '2026-04-01', endDate: '2026-10-31', budgetUtilised: '$0 / $1.2M', status: 'under-review' },
      { id: 'proj-3-3', name: 'External Threat Feed Exchange', stage: 'Execution', trend: 'up', manager: 'Amna Al-Hammadi', startDate: '2026-05-12', endDate: '2026-12-15', budgetUtilised: '$620K / $1.4M', status: 'on-track' }
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
      { id: 'proj-4-2', name: 'Security Audit & Gaps Remediation Plan', stage: 'Execution', trend: 'stable', manager: 'Zainab Al-Baloushi', startDate: '2026-02-25', endDate: '2026-08-15', budgetUtilised: '$380K / $1.7M', status: 'delayed' },
      { id: 'proj-4-3', name: 'Evidence Automation Portal', stage: 'Planning', trend: 'stable', manager: 'Fatima Qahtani', startDate: '2026-06-10', endDate: '2026-12-20', budgetUtilised: '$95K / $550K', status: 'under-review' }
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
      { id: 'proj-5-1', name: 'Rapid Response Team Mobilization', stage: 'Initiation', trend: 'stable', manager: 'Yousef Al-Mulla', startDate: '2026-05-20', endDate: '2026-09-15', budgetUtilised: '$0 / $1.2M', status: 'not-tracked' },
      { id: 'proj-5-2', name: 'Incident Playbook Automation', stage: 'Planning', trend: 'stable', manager: 'Yousef Al-Mulla', startDate: '2026-06-15', endDate: '2026-11-30', budgetUtilised: '$40K / $750K', status: 'not-started' }
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
      { id: 'proj-6-2', name: 'Sovereign Cloud Gateway Infrastructure', stage: 'Planning', trend: 'up', manager: 'Sarah Jenkins', startDate: '2026-05-01', endDate: '2027-02-28', budgetUtilised: '$0 / $1.5M', status: 'under-review' },
      { id: 'proj-6-3', name: 'Classified Data Discovery', stage: 'Planning', trend: 'stable', manager: 'Hamad Al-Subaie', startDate: '2026-06-20', endDate: '2027-03-30', budgetUtilised: '$60K / $920K', status: 'not-started' }
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
      { id: 'proj-7-1', name: 'Real-time Threat Monitoring Console', stage: 'Planning', trend: 'down', manager: 'Ali Al-Hashimi', startDate: '2026-07-01', endDate: '2026-12-30', budgetUtilised: '$125K / $320K', status: 'alert' },
      { id: 'proj-7-2', name: 'Crisis Simulation Command Room', stage: 'Initiation', trend: 'stable', manager: 'Zainab Al-Baloushi', startDate: '2026-08-01', endDate: '2027-03-15', budgetUtilised: '$0 / $1.1M', status: 'not-started' }
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
      { id: 'proj-8-2', name: 'Edge Security Access Verification', stage: 'Closeout', trend: 'up', manager: 'Mona Al-Mansoori', startDate: '2026-03-20', endDate: '2026-08-15', budgetUtilised: '$2.0M / $3.0M', status: 'completed' },
      { id: 'proj-8-3', name: 'Policy Decision Point Rollout', stage: 'Execution', trend: 'up', manager: 'Robert Chen', startDate: '2026-06-01', endDate: '2027-02-15', budgetUtilised: '$740K / $1.8M', status: 'on-track' }
    ]
  },
  {
    id: 'prog-9',
    name: 'Network Security Upgrade Program',
    stage: 'Execution',
    trend: 'stable',
    manager: 'Dr. Khalid Al-Mansoori',
    startDate: '2026-02-01',
    endDate: '2027-05-30',
    budgetUtilised: '$2.8M / $5.4M',
    status: 'under-review',
    isProgram: true,
    projects: [
      { id: 'proj-9-1', name: 'Riyadh Core Switch Upgrade', stage: 'Execution', trend: 'down', manager: 'Muna Hassan', startDate: '2026-02-15', endDate: '2026-10-30', budgetUtilised: '$900K / $1.6M', status: 'alert' },
      { id: 'proj-9-2', name: 'Jeddah Database Migration', stage: 'Execution', trend: 'stable', manager: 'Fatima Ali', startDate: '2026-03-01', endDate: '2026-12-05', budgetUtilised: '$760K / $1.4M', status: 'under-review' },
      { id: 'proj-9-3', name: 'Branch Firewall Policy Harmonization', stage: 'Planning', trend: 'stable', manager: 'Dr. Khalid Al-Mansoori', startDate: '2026-06-01', endDate: '2027-01-30', budgetUtilised: '$120K / $850K', status: 'not-started' }
    ]
  },
  {
    id: 'prog-10',
    name: 'Cyber Resilience Program',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Laila Noor',
    startDate: '2026-06-01',
    endDate: '2027-04-30',
    budgetUtilised: '$180K / $2.4M',
    status: 'under-review',
    isProgram: true,
    projects: [
      { id: 'proj-10-1', name: 'National Recovery Exercise', stage: 'Planning', trend: 'stable', manager: 'Laila Noor', startDate: '2026-07-01', endDate: '2027-01-15', budgetUtilised: '$60K / $680K', status: 'not-started' },
      { id: 'proj-10-2', name: 'Continuity Scenario Simulator', stage: 'Initiation', trend: 'stable', manager: 'Yousef Al-Mulla', startDate: '2026-08-01', endDate: '2027-04-15', budgetUtilised: '$0 / $940K', status: 'not-started' }
    ]
  },
  {
    id: 'prog-11',
    name: 'Data Protection Program',
    stage: 'Planning',
    trend: 'up',
    manager: 'Mariam Al-Ali',
    startDate: '2026-06-15',
    endDate: '2027-06-30',
    budgetUtilised: '$220K / $3.2M',
    status: 'on-track',
    isProgram: true,
    projects: [
      { id: 'proj-11-1', name: 'Sensitive Data Discovery', stage: 'Planning', trend: 'stable', manager: 'Mariam Al-Ali', startDate: '2026-07-01', endDate: '2027-02-28', budgetUtilised: '$90K / $1.1M', status: 'under-review' },
      { id: 'proj-11-2', name: 'Data Loss Prevention Rollout', stage: 'Planning', trend: 'up', manager: 'Hamad Al-Subaie', startDate: '2026-08-10', endDate: '2027-06-15', budgetUtilised: '$60K / $1.5M', status: 'on-track' }
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
  },
  {
    id: 'sa-proj-5',
    name: 'Smart City Alpha',
    stage: 'Execution',
    trend: 'stable',
    manager: 'Muna Hassan',
    startDate: '2026-03-05',
    endDate: '2026-11-30',
    budgetUtilised: '$540K / $1.2M',
    status: 'on-track',
    isProgram: false
  },
  {
    id: 'sa-proj-6',
    name: 'API Integration Project',
    stage: 'Execution',
    trend: 'down',
    manager: 'Khalid Omar',
    startDate: '2026-04-15',
    endDate: '2027-01-20',
    budgetUtilised: '$320K / $900K',
    status: 'alert',
    isProgram: false
  },
  {
    id: 'sa-proj-7',
    name: 'Citizen Cyber Awareness Portal',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Mariam Al-Ali',
    startDate: '2026-07-01',
    endDate: '2027-02-15',
    budgetUtilised: '$40K / $520K',
    status: 'not-started',
    isProgram: false
  },
  {
    id: 'sa-proj-8',
    name: 'Legacy Certificate Rotation',
    stage: 'Planning',
    trend: 'stable',
    manager: 'Khalid Omar',
    startDate: '2026-06-15',
    endDate: '2026-12-30',
    budgetUtilised: '$30K / $300K',
    status: 'under-review',
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
    id: 'RSK-04',
    name: 'Portfolio dependency visibility gaps across agency security workstreams',
    category: 'Operational Risk',
    level: 'portfolio',
    linkedTo: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Refresh the cross-program dependency map and review unresolved blockers in the weekly portfolio standup.',
    lastReview: '05/18/2026',
    exposure: 'medium',
    status: 'monitoring'
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
  },
  {
    id: 'RSK-20',
    name: 'Executive assurance reporting cadence slips during quarterly consolidation',
    category: 'Compliance Risk',
    level: 'portfolio',
    linkedTo: 'Safe Security Portfolio',
    owner: { name: 'PMO Desk', initials: 'PM' },
    mitigation: 'Lock a shared reporting calendar and pre-clear required evidence with program leads.',
    lastReview: '05/19/2026',
    exposure: 'low',
    status: 'watching'
  },
  {
    id: 'RSK-21',
    name: 'Critical infrastructure onboarding sequence conflicts with agency blackout dates',
    category: 'Schedule Risk',
    level: 'program',
    linkedTo: 'National Infrastructure Protection',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Sarah Jenkins', initials: 'SJ' },
    mitigation: 'Re-sequence onboarding waves around blackout windows and reserve backup implementation slots.',
    lastReview: '05/17/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-22',
    name: 'Threat intelligence sharing rules slow cross-agency enrichment',
    category: 'Compliance Risk',
    level: 'program',
    linkedTo: 'Cyber Threat Intelligence',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Robert Chen', initials: 'RC' },
    mitigation: 'Agree a minimum data-sharing profile and route exceptions through legal and security leads.',
    lastReview: '05/18/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-23',
    name: 'Audit remediation backlog exceeds compliance office review capacity',
    category: 'Operational Risk',
    level: 'program',
    linkedTo: 'Governance & Compliance Office',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    mitigation: 'Prioritize high-impact remediation packs and assign temporary reviewers for overdue controls.',
    lastReview: '05/20/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-24',
    name: 'Incident response staffing model remains undefined for surge events',
    category: 'Operational Risk',
    level: 'program',
    linkedTo: 'Incident Response Capability',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Yousef Al-Mulla', initials: 'YA' },
    mitigation: 'Define surge rosters, backup responders, and agency escalation duties before exercises start.',
    lastReview: '05/21/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-25',
    name: 'Data residency assurance evidence incomplete for sovereign center onboarding',
    category: 'Compliance Risk',
    level: 'program',
    linkedTo: 'National Data Sovereign Center',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    mitigation: 'Collect hosting attestations, map residency controls, and review gaps with architecture governance.',
    lastReview: '05/21/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-26',
    name: 'Command operations requirements expand faster than platform readiness',
    category: 'Stakeholder Risk',
    level: 'program',
    linkedTo: 'Unified Command Operations',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Zainab Al-Baloushi', initials: 'ZA' },
    mitigation: 'Freeze the first release scope and defer non-critical dashboards to later increments.',
    lastReview: '05/22/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-27',
    name: 'Zero trust policy exceptions accumulate without expiry controls',
    category: 'Technology Risk',
    level: 'program',
    linkedTo: 'Zero Trust Network Access',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Ali Al-Hashimi', initials: 'AH' },
    mitigation: 'Attach expiry dates to exceptions and review unresolved cases with network security governance.',
    lastReview: '05/23/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-28',
    name: 'Recovery exercise scope remains too broad for first simulation window',
    category: 'Schedule Risk',
    level: 'program',
    linkedTo: 'Cyber Resilience Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Laila Noor', initials: 'LN' },
    mitigation: 'Narrow the first exercise to priority services and split lower-criticality scenarios into a second wave.',
    lastReview: '05/24/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-29',
    name: 'Data protection controls depend on incomplete agency classification inventories',
    category: 'Compliance Risk',
    level: 'program',
    linkedTo: 'Data Protection Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    mitigation: 'Baseline minimum classification fields and escalate agencies with missing inventories.',
    lastReview: '05/24/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-30',
    name: 'SOC hub integration event formats vary across ministerial platforms',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Ministerial SOC Hub Integration',
    parentProgram: 'National Infrastructure Protection',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Publish a normalized event schema and run integration tests before each agency cutover.',
    lastReview: '05/18/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-31',
    name: 'Endpoint agent coverage reports lag after regional deployment waves',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Cross-Agency Endpoint Protection Rollout',
    parentProgram: 'National Infrastructure Protection',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Ali Al-Hashimi', initials: 'AH' },
    mitigation: 'Automate deployment reconciliation and route missing coverage to agency technical owners.',
    lastReview: '05/19/2026',
    exposure: 'low',
    status: 'monitoring'
  },
  {
    id: 'RSK-32',
    name: 'Senior staff enrolment window conflicts with agency travel schedules',
    category: 'Schedule Risk',
    level: 'project',
    linkedTo: 'Multi-Factor Authentication Rollout',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    mitigation: 'Open remote enrolment slots and assign agency champions to confirm attendance.',
    lastReview: '05/20/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-33',
    name: 'Directory integration mapping differs across legacy identity stores',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Centralised Directory Integration Services',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mona Al-Mansoori', initials: 'MM' },
    mitigation: 'Confirm attribute mappings with each agency and validate a pilot synchronization batch.',
    lastReview: '05/21/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-34',
    name: 'Shared administrator accounts delay privileged vault onboarding',
    category: 'Compliance Risk',
    level: 'project',
    linkedTo: 'Privileged Access Vault',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Laila Noor', initials: 'LN' },
    mitigation: 'Identify shared accounts, assign accountable owners, and block onboarding without ownership evidence.',
    lastReview: '05/22/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-35',
    name: 'Threat repository enrichment backlog limits analyst confidence',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Shared Threat Intelligence Repository',
    parentProgram: 'Cyber Threat Intelligence',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Amna Al-Hammadi', initials: 'AA' },
    mitigation: 'Prioritize high-confidence feeds and run weekly data quality reviews with analyst leads.',
    lastReview: '05/20/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-36',
    name: 'Threat hunting playbooks not aligned to agency telemetry coverage',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Proactive Threat Hunting Operations',
    parentProgram: 'Cyber Threat Intelligence',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Robert Chen', initials: 'RC' },
    mitigation: 'Map playbooks to available telemetry and publish compensating evidence requirements.',
    lastReview: '05/22/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-37',
    name: 'External feed licensing terms restrict automated distribution',
    category: 'Financial Risk',
    level: 'project',
    linkedTo: 'External Threat Feed Exchange',
    parentProgram: 'Cyber Threat Intelligence',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Amna Al-Hammadi', initials: 'AA' },
    mitigation: 'Confirm redistribution terms and separate restricted feeds from shared enrichment pipelines.',
    lastReview: '05/23/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-38',
    name: 'Audit fieldwork evidence remains inconsistent across regional offices',
    category: 'Compliance Risk',
    level: 'project',
    linkedTo: 'Regulatory Framework Alignment Audits',
    parentProgram: 'Governance & Compliance Office',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Issue a single evidence checklist and validate samples before closing audit visits.',
    lastReview: '05/21/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-39',
    name: 'Remediation owners dispute severity ratings on control gaps',
    category: 'Stakeholder Risk',
    level: 'project',
    linkedTo: 'Security Audit & Gaps Remediation Plan',
    parentProgram: 'Governance & Compliance Office',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Zainab Al-Baloushi', initials: 'ZA' },
    mitigation: 'Run a severity calibration workshop and publish signed remediation acceptance criteria.',
    lastReview: '05/23/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-40',
    name: 'Evidence portal workflow lacks approval coverage for delegated reviewers',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Evidence Automation Portal',
    parentProgram: 'Governance & Compliance Office',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Add delegated reviewer roles and test approval routing before onboarding agencies.',
    lastReview: '05/24/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-41',
    name: 'Rapid response mobilization depends on unconfirmed agency contact lists',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Rapid Response Team Mobilization',
    parentProgram: 'Incident Response Capability',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Yousef Al-Mulla', initials: 'YA' },
    mitigation: 'Validate 24-hour contact rosters and run call-tree checks before the first mobilisation drill.',
    lastReview: '05/22/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-42',
    name: 'Automated playbook triggers may misclassify blended incidents',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Incident Playbook Automation',
    parentProgram: 'Incident Response Capability',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Yousef Al-Mulla', initials: 'YA' },
    mitigation: 'Keep human approval gates for blended scenarios and compare trigger decisions against analyst review.',
    lastReview: '05/24/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-43',
    name: 'Encrypted data lake key management runbooks are incomplete',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Encrypted Data Lake Foundation',
    parentProgram: 'National Data Sovereign Center',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Hamad Al-Subaie', initials: 'HS' },
    mitigation: 'Complete key rotation runbooks and rehearse recovery procedures with platform operations.',
    lastReview: '05/23/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-44',
    name: 'Cloud gateway dependency approvals delay secure connectivity design',
    category: 'Schedule Risk',
    level: 'project',
    linkedTo: 'Sovereign Cloud Gateway Infrastructure',
    parentProgram: 'National Data Sovereign Center',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Sarah Jenkins', initials: 'SJ' },
    mitigation: 'Pre-approve standard gateway patterns and escalate exceptions to architecture governance.',
    lastReview: '05/24/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-45',
    name: 'Classified data discovery scans require agency-specific handling rules',
    category: 'Compliance Risk',
    level: 'project',
    linkedTo: 'Classified Data Discovery',
    parentProgram: 'National Data Sovereign Center',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Hamad Al-Subaie', initials: 'HS' },
    mitigation: 'Document agency handling rules and test discovery outputs with privacy and records teams.',
    lastReview: '05/25/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-46',
    name: 'Monitoring console alert taxonomy is not agreed by all operations teams',
    category: 'Stakeholder Risk',
    level: 'project',
    linkedTo: 'Real-time Threat Monitoring Console',
    parentProgram: 'Unified Command Operations',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Ali Al-Hashimi', initials: 'AH' },
    mitigation: 'Run taxonomy design sessions and validate alert labels during command center rehearsals.',
    lastReview: '05/23/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-47',
    name: 'Crisis simulation facility readiness depends on late infrastructure fit-out',
    category: 'Schedule Risk',
    level: 'project',
    linkedTo: 'Crisis Simulation Command Room',
    parentProgram: 'Unified Command Operations',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Zainab Al-Baloushi', initials: 'ZA' },
    mitigation: 'Reserve a temporary exercise room and track fit-out milestones through weekly delivery checks.',
    lastReview: '05/25/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-48',
    name: 'Micro-segmentation policies create unexpected east-west traffic blocks',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Micro-segmentation Firewall Deployments',
    parentProgram: 'Zero Trust Network Access',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Robert Chen', initials: 'RC' },
    mitigation: 'Run policy simulation against dependency maps and approve staged enforcement by service tier.',
    lastReview: '05/24/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-49',
    name: 'Edge access verification user experience increases support load',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Edge Security Access Verification',
    parentProgram: 'Zero Trust Network Access',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mona Al-Mansoori', initials: 'MM' },
    mitigation: 'Pilot with high-volume user groups and publish self-service troubleshooting before wider rollout.',
    lastReview: '05/25/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-50',
    name: 'Policy decision point latency may affect high-volume service access',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Policy Decision Point Rollout',
    parentProgram: 'Zero Trust Network Access',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Robert Chen', initials: 'RC' },
    mitigation: 'Load-test policy decisions and deploy local cache rules for approved high-volume services.',
    lastReview: '05/26/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-51',
    name: 'Branch firewall rule normalization exposes undocumented local exceptions',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Branch Firewall Policy Harmonization',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    mitigation: 'Inventory local exceptions, validate owners, and retire stale rules before baseline deployment.',
    lastReview: '05/26/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-52',
    name: 'Recovery exercise scenarios do not reflect inter-agency service dependencies',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'National Recovery Exercise',
    parentProgram: 'Cyber Resilience Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Laila Noor', initials: 'LN' },
    mitigation: 'Validate scenarios against the portfolio dependency map and include joint decision checkpoints.',
    lastReview: '05/25/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-53',
    name: 'Continuity simulator data set is not representative of peak service demand',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Continuity Scenario Simulator',
    parentProgram: 'Cyber Resilience Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Yousef Al-Mulla', initials: 'YA' },
    mitigation: 'Load anonymized peak-period metrics and compare simulator outputs with live service baselines.',
    lastReview: '05/26/2026',
    exposure: 'low',
    status: 'watching'
  },
  {
    id: 'RSK-54',
    name: 'Sensitive data discovery misses unstructured repositories owned by agencies',
    category: 'Compliance Risk',
    level: 'project',
    linkedTo: 'Sensitive Data Discovery',
    parentProgram: 'Data Protection Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    mitigation: 'Collect unstructured repository inventories and add connectors for priority agency stores.',
    lastReview: '05/26/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-55',
    name: 'Data loss prevention policies generate false positives for citizen services',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Data Loss Prevention Rollout',
    parentProgram: 'Data Protection Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Hamad Al-Subaie', initials: 'HS' },
    mitigation: 'Tune DLP rules with service teams and pilot alert thresholds before enforcement.',
    lastReview: '05/27/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-56',
    name: 'Awareness campaign attendance drops without agency manager reinforcement',
    category: 'Stakeholder Risk',
    level: 'project',
    linkedTo: 'Standalone Cyber Security Awareness Campaign',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    mitigation: 'Send agency manager attendance packs and track low-participation teams weekly.',
    lastReview: '05/23/2026',
    exposure: 'low',
    status: 'watching'
  },
  {
    id: 'RSK-57',
    name: 'Legacy system decommissioning depends on unresolved archive retention rules',
    category: 'Compliance Risk',
    level: 'project',
    linkedTo: 'Standalone Legacy Government Systems Decommissioning',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Hamad Al-Subaie', initials: 'HS' },
    mitigation: 'Agree retention rules with records teams and document exception handling before shutdown.',
    lastReview: '05/24/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-58',
    name: 'Cryptographic policy update could conflict with active procurement clauses',
    category: 'Financial Risk',
    level: 'project',
    linkedTo: 'Standalone National Cryptographic Policy Update',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    mitigation: 'Review active procurement clauses and publish transition guidance for in-flight contracts.',
    lastReview: '05/25/2026',
    exposure: 'medium',
    status: 'watching'
  },
  {
    id: 'RSK-59',
    name: 'Red team drill findings may exceed available remediation capacity',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Standalone Inter-ministerial Red Team Drills',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Prioritize findings by service criticality and pre-book remediation squads for high-severity issues.',
    lastReview: '05/26/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-60',
    name: 'Citizen portal content approval chain delays campaign readiness',
    category: 'Stakeholder Risk',
    level: 'project',
    linkedTo: 'Citizen Cyber Awareness Portal',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    mitigation: 'Define final approvers and release reusable campaign modules in batches.',
    lastReview: '05/27/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-61',
    name: 'Legacy certificate rotation inventory omits unmanaged service endpoints',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Legacy Certificate Rotation',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Khalid Omar', initials: 'KO' },
    mitigation: 'Scan unmanaged endpoints and add certificate expiry owners before rotation windows open.',
    lastReview: '05/27/2026',
    exposure: 'medium',
    status: 'active'
  },
  {
    id: 'RSK-62',
    name: 'Agency onboarding test windows conflict with SOC integration capacity',
    category: 'Schedule Risk',
    level: 'program',
    linkedTo: 'National Infrastructure Protection',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Sarah Jenkins', initials: 'SJ' },
    mitigation: 'Stagger onboarding rehearsals and reserve SOC engineering capacity for priority agency cutovers.',
    lastReview: '05/28/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-63',
    name: 'Authentication policy exceptions remain unresolved before MFA cutover',
    category: 'Compliance Risk',
    level: 'program',
    linkedTo: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    mitigation: 'Create an exception expiry register and review unresolved waivers with the program steering group.',
    lastReview: '05/28/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-64',
    name: 'Legacy log sources drop critical fields during SOC normalization',
    category: 'Technology Risk',
    level: 'project',
    linkedTo: 'Ministerial SOC Hub Integration',
    parentProgram: 'National Infrastructure Protection',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Run field-level mapping checks and define fallback parsers before each ministerial integration wave.',
    lastReview: '05/28/2026',
    exposure: 'high',
    status: 'active'
  },
  {
    id: 'RSK-65',
    name: 'VIP enrolment support capacity may miss launch readiness',
    category: 'Stakeholder Risk',
    level: 'project',
    linkedTo: 'Multi-Factor Authentication Rollout',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    mitigation: 'Assign named agency champions and extend support hours during the final enrolment window.',
    lastReview: '05/28/2026',
    exposure: 'medium',
    status: 'monitoring'
  },
  {
    id: 'RSK-66',
    name: 'Approval workflow test data does not cover delegated reviewer paths',
    category: 'Operational Risk',
    level: 'project',
    linkedTo: 'Evidence Automation Portal',
    parentProgram: 'Governance & Compliance Office',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    mitigation: 'Add delegated reviewer scenarios to user acceptance testing and require sign-off before pilot launch.',
    lastReview: '05/28/2026',
    exposure: 'medium',
    status: 'watching'
  }
];


export interface Benefit {
  id: string;
  name: string;
  benefit: string; // for compatibility with performance dashboard
  category: string;
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

export type IssueLevel = 'portfolio' | 'program' | 'project';
export type IssueCriticality = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'open' | 'in-progress' | 'pending-decision' | 'resolved' | 'closed';

export interface Issue {
  id: string;
  issueType: string;
  issue: string;
  criticality: IssueCriticality;
  resolution: string;
  level: IssueLevel;
  linkedTo: string;
  parentProgram?: string;
  parentPortfolio?: string;
  owner: { name: string; initials: string };
  dueDate: string;
  status: IssueStatus;
}

export const issuesRegisterData: Issue[] = [
  {
    id: 'ISS-01',
    issueType: 'Decision required',
    issue: 'Agree cross-agency assurance escalation route',
    criticality: 'high',
    resolution: 'Confirm the escalation owner and publish the decision route before the next portfolio checkpoint.',
    level: 'portfolio',
    linkedTo: 'Safe Security Portfolio',
    owner: { name: 'PMO Desk', initials: 'PM' },
    dueDate: '06/07/2026',
    status: 'pending-decision'
  },
  {
    id: 'ISS-02',
    issueType: 'Dependency issue',
    issue: 'Quarterly assurance pack missing agency attestations',
    criticality: 'medium',
    resolution: 'Collect the two outstanding attestations and attach them to the consolidated evidence pack.',
    level: 'portfolio',
    linkedTo: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    dueDate: '06/12/2026',
    status: 'in-progress'
  },
  {
    id: 'ISS-03',
    issueType: 'Resource issue',
    issue: 'SOC integration test window conflicts with endpoint rollout',
    criticality: 'high',
    resolution: 'Move endpoint testing to the reserve slot and keep the SOC integration window protected.',
    level: 'program',
    linkedTo: 'National Infrastructure Protection',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Sarah Jenkins', initials: 'SJ' },
    dueDate: '06/10/2026',
    status: 'open'
  },
  {
    id: 'ISS-04',
    issueType: 'Technical issue',
    issue: 'SIEM connector schema mismatch blocking SOC ingest',
    criticality: 'critical',
    resolution: 'Apply the normalized event schema and rerun the integration validation batch.',
    level: 'project',
    linkedTo: 'Ministerial SOC Hub Integration',
    parentProgram: 'National Infrastructure Protection',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Fatima Qahtani', initials: 'FQ' },
    dueDate: '06/05/2026',
    status: 'in-progress'
  },
  {
    id: 'ISS-05',
    issueType: 'Decision required',
    issue: 'Agency token distribution policy not approved',
    criticality: 'high',
    resolution: 'Secure policy sign-off from Identity governance and confirm the alternate delivery channel.',
    level: 'program',
    linkedTo: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    dueDate: '06/14/2026',
    status: 'pending-decision'
  },
  {
    id: 'ISS-06',
    issueType: 'Schedule issue',
    issue: 'MFA senior staff enrolment window under-booked',
    criticality: 'medium',
    resolution: 'Open additional remote enrolment slots and ask agency champions to confirm attendance.',
    level: 'project',
    linkedTo: 'Multi-Factor Authentication Rollout',
    parentProgram: 'Identity & Access Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Saeed Al-Mansoori', initials: 'SA' },
    dueDate: '06/18/2026',
    status: 'open'
  },
  {
    id: 'ISS-07',
    issueType: 'Compliance issue',
    issue: 'Audit evidence samples incomplete for regional offices',
    criticality: 'critical',
    resolution: 'Issue one evidence checklist and validate a sample pack with each regional audit lead.',
    level: 'program',
    linkedTo: 'Governance & Compliance Office',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Dr. Khalid Al-Mansoori', initials: 'KM' },
    dueDate: '06/09/2026',
    status: 'in-progress'
  },
  {
    id: 'ISS-08',
    issueType: 'Vendor issue',
    issue: 'Core switch customs hold delaying installation pack',
    criticality: 'high',
    resolution: 'Escalate with logistics, confirm clearance date, and reserve the backup install window.',
    level: 'project',
    linkedTo: 'Riyadh Core Switch Upgrade',
    parentProgram: 'Network Security Upgrade Program',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Muna Hassan', initials: 'MH' },
    dueDate: '06/11/2026',
    status: 'open'
  },
  {
    id: 'ISS-09',
    issueType: 'Communications issue',
    issue: 'Bilingual awareness content approval queue not cleared',
    criticality: 'medium',
    resolution: 'Lock the bilingual content owner and approve the first campaign pack before agency rollout.',
    level: 'project',
    linkedTo: 'Standalone Cyber Security Awareness Campaign',
    parentPortfolio: 'Safe Security Portfolio',
    owner: { name: 'Mariam Al-Ali', initials: 'MA' },
    dueDate: '06/20/2026',
    status: 'open'
  }
];

export const benefitsRegisterData: Benefit[] = [
  {
    id: 'BEN-01',
    name: 'Cyber Incident Rate Reduction',
    benefit: 'Cyber Incident Rate Reduction',
    category: 'Risk Reduction',
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
    category: 'Operational Efficiency',
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
    category: 'Compliance Assurance',
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
    category: 'Information Sharing',
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
    category: 'Adoption & Awareness',
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
