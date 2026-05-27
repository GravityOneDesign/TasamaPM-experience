export type PmoGovernanceTabId = 'portfolio-register' | 'risk-register' | 'benefits-register' | 'issues-register' | 'governance';
export type PmoGovernanceSectionId = 'forums' | 'sources' | 'records' | 'reports';
export type PmoGovernanceForumScope = 'mine' | 'all';
export type PmoGovernanceSourceScope = 'mine' | 'all';
export type PmoGovernanceRecordScope = 'mine' | 'all';
export type PmoGovernanceForumDetailTabId = 'overview' | 'meetings' | 'sources' | 'records' | 'watchlist' | 'issues';
export type PmoGovernanceWatchlistCategoryId = 'risks' | 'projects' | 'programs';
export type PmoGovernanceWatchlistRiskPickerCategoryId = 'organisational' | 'project' | 'program' | 'other';

export interface PmoGovernanceWorkspaceTarget {
  readonly primaryTab: PmoGovernanceTabId;
  readonly sectionTab?: PmoGovernanceSectionId;
}

export interface PmoGovernanceTab {
  readonly id: PmoGovernanceTabId | PmoGovernanceSectionId | PmoGovernanceForumDetailTabId;
  readonly label: string;
  readonly icon?: string;
}

export interface PmoGovernanceForumRow {
  readonly id: string;
  readonly forumName: string;
  readonly forumId: string;
  readonly secretariat: string;
  readonly moreOwners?: string;
  readonly type: 'Substantiated' | 'Non-Substantiated';
  readonly category: string;
  readonly description: string;
  readonly createdOn: string;
  readonly createdBy: string;
  readonly chair: string;
  readonly secretariatMembers: readonly string[];
  readonly memberNames: readonly string[];
  readonly members: number;
  readonly tagCount: number;
  readonly favorite: boolean;
  readonly nextMeeting: string;
}

export type PmoGovernanceForumType = PmoGovernanceForumRow['type'];

export interface PmoGovernanceForumDraft {
  forumName: string;
  type: PmoGovernanceForumType;
  category: string;
  description: string;
  chair: string;
  secretariat: string[];
  members: string[];
  workflowEnabled: boolean;
}

export interface PmoGovernanceForumFormOptions {
  readonly typeOptions: readonly PmoGovernanceForumType[];
  readonly categoryOptions: readonly string[];
  readonly chairOptions: readonly string[];
  readonly secretariatOptions: readonly string[];
  readonly memberOptions: readonly string[];
}

export interface PmoGovernanceReportTemplateRow {
  readonly id: string;
  readonly reportName: string;
  readonly groupBy: string;
  readonly viewLabel: string;
}

export interface PmoGovernanceReportDraft {
  reportName: string;
  forum: string;
  recordType: string;
  progress: string;
  recordStatus: string;
  dueDateStatus: string;
  priority: string;
  division: string;
  people: string;
  timeFrame: string;
  groupBy: string;
}

export interface PmoGovernanceReportFormOptions {
  readonly forumOptions: readonly string[];
  readonly recordTypeOptions: readonly string[];
  readonly progressOptions: readonly string[];
  readonly recordStatusOptions: readonly string[];
  readonly dueDateStatusOptions: readonly string[];
  readonly priorityOptions: readonly string[];
  readonly divisionOptions: readonly string[];
  readonly peopleOptions: readonly string[];
  readonly timeFrameOptions: readonly string[];
  readonly groupByOptions: readonly string[];
}

export interface PmoGovernanceSourceRow {
  readonly id: string;
  readonly source: string;
  readonly type: 'Reporting' | 'Management' | 'DOA' | 'Compliance';
  readonly lastUpdatedOn: string;
  readonly recommendations: number;
  readonly associatedRecords: number;
}

export type PmoGovernanceSourceType = PmoGovernanceSourceRow['type'];
export type PmoGovernanceSourceMode = 'new' | 'existing';

export interface PmoGovernanceSourceDraft {
  sourceMode: PmoGovernanceSourceMode;
  type: PmoGovernanceSourceType | '';
  sourceName: string;
}

export interface PmoGovernanceSourceFormOptions {
  readonly typeOptions: readonly PmoGovernanceSourceType[];
}

export interface PmoGovernanceRecordRow {
  readonly id: string;
  readonly record: string;
  readonly recordTitle: string;
  readonly type: string;
  readonly owner: string;
  readonly dueOn: string;
  readonly status: string;
  readonly favorite: boolean;
}

export type PmoGovernanceRecordType = 'Action' | 'Decision';

export interface PmoGovernanceRecordDraft {
  forumName: string;
  meeting: string;
  recordTitle: string;
  recordType: PmoGovernanceRecordType;
  owner: string;
  agreedDue: string;
  details: string;
}

export interface PmoGovernanceRecordFormOptions {
  readonly forumOptions: readonly string[];
  readonly meetingOptions: readonly string[];
  readonly typeOptions: readonly PmoGovernanceRecordType[];
  readonly ownerOptions: readonly string[];
}

export interface PmoGovernanceRecordRelationItem {
  readonly title: string;
  readonly meta?: string;
}

export interface PmoGovernanceRecordRelationBlock {
  readonly id: string;
  readonly title: string;
  readonly emptyLabel: string;
  readonly items: readonly PmoGovernanceRecordRelationItem[];
}

export interface PmoGovernanceRecordSourceRecommendation {
  readonly sourceName: string;
  readonly linkLabel: string;
  readonly linkValue: string;
  readonly recommendations: readonly string[];
}

export interface PmoGovernanceRecordActivity {
  readonly id: string;
  readonly actor?: string;
  readonly timestamp?: string;
  readonly body: string;
  readonly meta?: string;
}

export interface PmoGovernanceRecordDetail {
  readonly id: string;
  readonly recordId: string;
  readonly title: string;
  readonly type: string;
  readonly status: string;
  readonly forum: string;
  readonly meeting: string;
  readonly priority: string;
  readonly category: string;
  readonly decisionDate: string;
  readonly createdBy: string;
  readonly description: string;
  readonly primaryAgenda: string;
  readonly owner: string;
  readonly businessUnit: string;
  readonly responsibleOfficer: string;
  readonly approver: string;
  readonly relatedAgendas: PmoGovernanceRecordRelationBlock;
  readonly relatedOutcomes: PmoGovernanceRecordRelationBlock;
  readonly relatedRecords: PmoGovernanceRecordRelationBlock;
  readonly relatedProjects: PmoGovernanceRecordRelationBlock;
  readonly relatedSource: PmoGovernanceRecordSourceRecommendation;
  readonly relatedRisks: PmoGovernanceRecordRelationBlock;
  readonly relatedCapabilities: PmoGovernanceRecordRelationBlock;
  readonly relatedValueStreams: PmoGovernanceRecordRelationBlock;
  readonly relatedLinks: PmoGovernanceRecordRelationBlock;
  readonly activity: readonly PmoGovernanceRecordActivity[];
}

export interface PmoGovernanceMeetingRow {
  readonly id: string;
  readonly meetingDate: string;
  readonly meetingName: string;
  readonly actions: number;
  readonly decisions: number;
}

export interface PmoGovernanceMeetingDraft {
  meetingName: string;
  meetingDate: string;
}

export type PmoGovernanceIssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type PmoGovernanceIssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface PmoGovernanceIssueDraft {
  issue: string;
  issueDescription: string;
  issuePriority: PmoGovernanceIssuePriority | '';
  resolution: string;
  issueStatus: PmoGovernanceIssueStatus | '';
  owner: string;
  dateRaised: string;
  issueDueDate: string;
  dateClosed: string;
}

export interface PmoGovernanceIssueFormOptions {
  readonly priorityOptions: readonly PmoGovernanceIssuePriority[];
  readonly statusOptions: readonly PmoGovernanceIssueStatus[];
  readonly ownerOptions: readonly string[];
}

export interface PmoGovernanceWatchlistCategory {
  readonly id: PmoGovernanceWatchlistCategoryId;
  readonly label: string;
  readonly total: number;
}

export interface PmoGovernanceWatchlistRow {
  readonly id: string;
  readonly categoryId: PmoGovernanceWatchlistCategoryId;
  readonly name: string;
  readonly relatedEntity: string;
  readonly owner: string;
  readonly expanded: boolean;
  readonly records: readonly string[];
}

export interface PmoGovernanceWatchlistRiskPickerCategory {
  readonly id: PmoGovernanceWatchlistRiskPickerCategoryId;
  readonly label: string;
  readonly selectionLabel: string;
}

export interface PmoGovernanceWatchlistRiskPickerRow {
  readonly id: string;
  readonly categoryId: PmoGovernanceWatchlistRiskPickerCategoryId;
  readonly name: string;
  readonly selected: boolean;
}

export interface PmoGovernanceWatchlistSelection {
  readonly categoryId: PmoGovernanceWatchlistRiskPickerCategoryId;
  readonly selectedRiskIds: readonly string[];
  readonly selectedRisks: readonly PmoGovernanceWatchlistRiskPickerRow[];
}

export interface PmoGovernanceForumIssueEmptyState {
  readonly message: string;
  readonly badgeLabel: string;
}

export const pmoGovernancePrimaryTabs: readonly PmoGovernanceTab[] = [
  { id: 'portfolio-register', label: 'Portfolio Register', icon: 'layout-grid' },
  { id: 'risk-register', label: 'Risk Register', icon: 'layout-grid' },
  { id: 'benefits-register', label: 'Benefits Register', icon: 'layout-grid' },
  { id: 'issues-register', label: 'Issues Register', icon: 'layout-grid' },
  { id: 'governance', label: 'Governance Register', icon: 'layout-grid' },
];

export const pmoGovernanceDefaultWorkspaceTarget: PmoGovernanceWorkspaceTarget = { primaryTab: 'portfolio-register' };

export const pmoGovernanceSectionTabs: readonly PmoGovernanceTab[] = [
  { id: 'forums', label: 'Forums' },
  { id: 'sources', label: 'Sources' },
  { id: 'records', label: 'Records' },
  { id: 'reports', label: 'Reports' },
];

export const pmoGovernanceForumDetailTabs: readonly PmoGovernanceTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'sources', label: 'Sources' },
  { id: 'records', label: 'Records' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'issues', label: 'Issues' },
];

export const pmoGovernanceForumFormOptions: PmoGovernanceForumFormOptions = {
  typeOptions: ['Substantiated', 'Non-Substantiated'],
  categoryOptions: ['Business Excellence', 'P3M Governance', 'Compliance', 'Management', 'DOA'],
  chairOptions: ['Hanady Amin', 'James T Kirk', 'Chethan Vijayadeva', 'Canning Santos', 'Rohit Sareen', 'Alex Vayne', 'Akshay K'],
  secretariatOptions: ['Akshay K', 'James T Kirk', 'Chethan Vijayadeva', 'Canning Santos', 'Rohit Sareen', 'Alex Vayne'],
  memberOptions: ['Chloe Gibson', 'Lisa Wynn', 'Akshay K', 'James T Kirk', 'Chethan Vijayadeva', 'Canning Santos', 'Rohit Sareen', 'Alex Vayne'],
};

const pmoGovernanceForumDefaultDraft: PmoGovernanceForumDraft = {
  forumName: '',
  type: 'Substantiated',
  category: '',
  description: '',
  chair: '',
  secretariat: ['Akshay K'],
  members: [],
  workflowEnabled: false,
};

export function createPmoGovernanceForumDraft(): PmoGovernanceForumDraft {
  return {
    ...pmoGovernanceForumDefaultDraft,
    secretariat: [...pmoGovernanceForumDefaultDraft.secretariat],
    members: [...pmoGovernanceForumDefaultDraft.members],
  };
}

export const pmoGovernanceSourceFormOptions: PmoGovernanceSourceFormOptions = {
  typeOptions: ['Management', 'Reporting', 'DOA', 'Compliance'],
};

const pmoGovernanceSourceDefaultDraft: PmoGovernanceSourceDraft = {
  sourceMode: 'new',
  type: 'Management',
  sourceName: '',
};

export function createPmoGovernanceSourceDraft(): PmoGovernanceSourceDraft {
  return { ...pmoGovernanceSourceDefaultDraft };
}

export const pmoGovernanceRecordFormOptions: PmoGovernanceRecordFormOptions = {
  forumOptions: ['Business Excellence', 'Audit Committee', 'Compliance & Assurance', 'Compliance Statements', 'Design Decisions Committee'],
  meetingOptions: ['Annual Performance Review', 'DHAM Quarterly Review', 'Discussion on Strategic Objectives', 'End of the year', 'future meeting'],
  typeOptions: ['Action', 'Decision'],
  ownerOptions: ['James T Kirk', 'Chethan Vijayadeva', 'Canning Santos', 'Rohit Sareen', 'Alex Vayne', 'Akshay K', 'Geoff Neideck', 'Chris Stan'],
};

const pmoGovernanceRecordDefaultDraft: PmoGovernanceRecordDraft = {
  forumName: 'Business Excellence',
  meeting: '',
  recordTitle: '',
  recordType: 'Action',
  owner: '',
  agreedDue: '',
  details: '',
};

export function createPmoGovernanceRecordDraft(): PmoGovernanceRecordDraft {
  return { ...pmoGovernanceRecordDefaultDraft };
}

const pmoGovernanceMeetingDefaultDraft: PmoGovernanceMeetingDraft = {
  meetingName: '',
  meetingDate: '',
};

export function createPmoGovernanceMeetingDraft(): PmoGovernanceMeetingDraft {
  return { ...pmoGovernanceMeetingDefaultDraft };
}

export const pmoGovernanceIssueFormOptions: PmoGovernanceIssueFormOptions = {
  priorityOptions: ['Low', 'Medium', 'High', 'Critical'],
  statusOptions: ['Open', 'In Progress', 'Resolved', 'Closed'],
  ownerOptions: ['James T Kirk', 'Chethan Vijayadeva', 'Canning Santos', 'Rohit Sareen', 'Alex Vayne', 'Akshay K', 'Geoff Neideck', 'Chris Stan'],
};

export function createPmoGovernanceIssueDraft(): PmoGovernanceIssueDraft {
  const today = pmoGovernanceTodayInputDate();
  return {
    issue: '',
    issueDescription: '',
    issuePriority: '',
    resolution: '',
    issueStatus: '',
    owner: '',
    dateRaised: today,
    issueDueDate: today,
    dateClosed: today,
  };
}

function pmoGovernanceTodayInputDate(): string {
  const today = new Date();
  const timezoneOffsetMs = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

export const pmoGovernanceReportFormOptions: PmoGovernanceReportFormOptions = {
  forumOptions: ['All Forum', 'Business Excellence', 'Audit Committee', 'Compliance & Assurance', 'Compliance Statements', 'Design Decisions Committee'],
  recordTypeOptions: ['All', 'Action', 'Decision'],
  progressOptions: ['All Status', 'Not Started', 'In Progress', 'Complete', 'Blocked'],
  recordStatusOptions: ['All Status', 'Open', 'Closed', 'Pending closure', 'N/A'],
  dueDateStatusOptions: ['All', 'On Track', 'Due Soon', 'Overdue', 'No Due Date'],
  priorityOptions: ['All', 'Low', 'Medium', 'High', 'Critical'],
  divisionOptions: ['All Division', 'ICT Division', 'Strategy Office', 'Corporate Services', 'Operations'],
  peopleOptions: ['All People', 'James T Kirk', 'Chethan Vijayadeva', 'Canning Santos', 'Rohit Sareen', 'Akshay K', 'Geoff Neideck', 'Chris Stan'],
  timeFrameOptions: ['None', 'This Month', 'This Quarter', 'This Year', 'Custom'],
  groupByOptions: ['Forum', 'Division', 'People', 'Record Type', 'Priority', 'Status'],
};

const pmoGovernanceReportDefaultDraft: PmoGovernanceReportDraft = {
  reportName: '',
  forum: 'All Forum',
  recordType: 'All',
  progress: 'All Status',
  recordStatus: 'All Status',
  dueDateStatus: 'All',
  priority: 'All',
  division: 'All Division',
  people: 'All People',
  timeFrame: 'None',
  groupBy: 'Forum',
};

export function createPmoGovernanceReportDraft(): PmoGovernanceReportDraft {
  return { ...pmoGovernanceReportDefaultDraft };
}

export function pmoGovernanceReportTemplateRowFromDraft(draft: PmoGovernanceReportDraft, id: string): PmoGovernanceReportTemplateRow {
  return {
    id,
    reportName: draft.reportName.trim(),
    groupBy: draft.groupBy,
    viewLabel: 'View/Print',
  };
}

export const pmoGovernanceReportTemplateRows: readonly PmoGovernanceReportTemplateRow[] = [];

export const pmoGovernanceRecordRows: readonly PmoGovernanceRecordRow[] = [
  {
    id: 'r65',
    record: 'R65',
    recordTitle: 'Improve transparency of information shared with staff and citizens',
    type: 'Decision',
    owner: 'Geoff Neideck',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
  {
    id: 'r67',
    record: 'R67',
    recordTitle: 'Yearly Audit',
    type: 'Decision',
    owner: 'James T Kirk',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
  {
    id: 'r68',
    record: 'R68',
    recordTitle: 'Audit Reviews should be done on monthly basic',
    type: 'Decision',
    owner: 'James T Kirk',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
  {
    id: 'r82',
    record: 'R82',
    recordTitle: 'Understanding the goals of my Organisation',
    type: 'Decision',
    owner: 'Chris Stan',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
  {
    id: 'r83',
    record: 'R83',
    recordTitle: 'Audit Committee Record',
    type: 'Action',
    owner: 'James T Kirk',
    dueOn: '31/10/2018',
    status: 'Closed',
    favorite: false,
  },
  {
    id: 'r84',
    record: 'R84',
    recordTitle: 'Digital First status report',
    type: 'Action',
    owner: 'James T Kirk',
    dueOn: '30/07/2021',
    status: 'Open',
    favorite: false,
  },
  {
    id: 'r85',
    record: 'R85',
    recordTitle: 'Shortlist concept XYZ',
    type: 'Decision',
    owner: 'James T Kirk',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
  {
    id: 'r86',
    record: 'R86',
    recordTitle: 'Can project x to report current status',
    type: 'Action',
    owner: 'Tony Romo',
    dueOn: '16/03/2020',
    status: 'Pending closure',
    favorite: false,
  },
];

export const pmoGovernanceForumRecordRows: readonly PmoGovernanceRecordRow[] = [
  {
    id: 'forum-r67',
    record: 'R67',
    recordTitle: 'Yearly Audit',
    type: 'Decision',
    owner: 'James T Kirk',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
  {
    id: 'forum-r82',
    record: 'R82',
    recordTitle: 'Understanding the goals of my Organisation',
    type: 'Decision',
    owner: 'Chris Stan',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
  {
    id: 'forum-r83',
    record: 'R83',
    recordTitle: 'Audit Committee Record',
    type: 'Action',
    owner: 'James T Kirk',
    dueOn: '31/10/2018',
    status: 'Closed',
    favorite: false,
  },
  {
    id: 'forum-r84',
    record: 'R84',
    recordTitle: 'Digital First status report',
    type: 'Action',
    owner: 'James T Kirk',
    dueOn: '30/07/2021',
    status: 'Open',
    favorite: false,
  },
  {
    id: 'forum-r85',
    record: 'R85',
    recordTitle: 'Shortlist concept XYZ',
    type: 'Decision',
    owner: 'James T Kirk',
    dueOn: 'N/A',
    status: 'N/A',
    favorite: false,
  },
];

export const pmoGovernanceWatchlistCategories: readonly PmoGovernanceWatchlistCategory[] = [
  { id: 'risks', label: 'Risks', total: 5 },
  { id: 'projects', label: 'Projects', total: 0 },
  { id: 'programs', label: 'Programs', total: 0 },
];

export const pmoGovernanceWatchlistRows: readonly PmoGovernanceWatchlistRow[] = [
  {
    id: 'self-service-churn',
    categoryId: 'risks',
    name: 'Break in self-service system user experience causing high churn',
    relatedEntity: 'ICT Division (Division)',
    owner: 'Kerri Atkinson',
    expanded: true,
    records: [],
  },
  {
    id: 'budget-release-delay',
    categoryId: 'risks',
    name: 'Budget not spent for intended purposes due to delayed approval and release.',
    relatedEntity: 'ICT Division (Division)',
    owner: 'Venya Dalmeida',
    expanded: false,
    records: [],
  },
  {
    id: 'building-insurance-renewal',
    categoryId: 'risks',
    name: 'Building insurance needs to be configured to auto-renewal',
    relatedEntity: 'Technology & Major Capability (Division)',
    owner: '-',
    expanded: false,
    records: [],
  },
  {
    id: 'client-service-injury',
    categoryId: 'risks',
    name: 'Client Service Officer Injury',
    relatedEntity: 'Sustainable Infrastructure (Division)',
    owner: 'James T Kirk',
    expanded: false,
    records: [],
  },
  {
    id: 'data-breach-security',
    categoryId: 'risks',
    name: 'Data breach security',
    relatedEntity: 'Corporate (Old) (Division)',
    owner: 'Tyler Alborn',
    expanded: false,
    records: [],
  },
];

export const pmoGovernanceWatchlistRiskPickerCategories: readonly PmoGovernanceWatchlistRiskPickerCategory[] = [
  { id: 'organisational', label: 'Organisational Risks', selectionLabel: 'Organisational Risks' },
  { id: 'project', label: 'Project Risks', selectionLabel: 'Project Risks' },
  { id: 'program', label: 'Program Risks', selectionLabel: 'Program Risks' },
  { id: 'other', label: 'Other Risks', selectionLabel: 'Other Risks' },
];

export const pmoGovernanceWatchlistRiskPickerRows: readonly PmoGovernanceWatchlistRiskPickerRow[] = [
  {
    id: 'limited-interest-partners',
    categoryId: 'organisational',
    name: 'Limited interest from potential partners',
    selected: false,
  },
  {
    id: 'risk-1',
    categoryId: 'organisational',
    name: 'Risk 1',
    selected: false,
  },
  {
    id: 'bio-gas-leakage',
    categoryId: 'organisational',
    name: 'Bio gas leakage',
    selected: false,
  },
  {
    id: 'self-service-system-churn',
    categoryId: 'organisational',
    name: 'Break in self-service system user experience causing high churn',
    selected: true,
  },
  {
    id: 'budget-release-approval-delay',
    categoryId: 'organisational',
    name: 'Budget not spent for intended purposes due to delayed approval and release.',
    selected: true,
  },
  {
    id: 'building-insurance-auto-renewal',
    categoryId: 'organisational',
    name: 'Building insurance needs to be configured to auto-renewal',
    selected: true,
  },
  {
    id: 'centralization-of-data',
    categoryId: 'organisational',
    name: 'Centralization of data',
    selected: false,
  },
  {
    id: 'client-service-officer-injury',
    categoryId: 'organisational',
    name: 'Client Service Officer Injury',
    selected: true,
  },
  {
    id: 'marketing-collateral-change-gap',
    categoryId: 'organisational',
    name: 'Collaterals not updated with latest changes in marketing strategy',
    selected: false,
  },
  {
    id: 'competition-other-organizations',
    categoryId: 'organisational',
    name: 'Competition from other organizations',
    selected: false,
  },
  {
    id: 'data-breach-security',
    categoryId: 'organisational',
    name: 'Data breach security',
    selected: true,
  },
  {
    id: 'account-migration-information-leakage',
    categoryId: 'organisational',
    name: 'Leakage of crucial information during account migration',
    selected: false,
  },
  {
    id: 'procurement-cycle-delay',
    categoryId: 'organisational',
    name: 'Procurement cycle exceeds delegated timelines',
    selected: false,
  },
  {
    id: 'manual-data-matching-rework',
    categoryId: 'organisational',
    name: 'Manual data matching creates operational rework',
    selected: false,
  },
  {
    id: 'field-equipment-response-delay',
    categoryId: 'organisational',
    name: 'Ageing field equipment increases response times',
    selected: false,
  },
  {
    id: 'supplier-assurance-gap',
    categoryId: 'organisational',
    name: 'Supplier assurance evidence is not refreshed before contract renewal',
    selected: false,
  },
  {
    id: 'asset-register-cleanup',
    categoryId: 'project',
    name: 'Asset register clean-up project dependency is delayed',
    selected: false,
  },
  {
    id: 'customer-portal-cutover',
    categoryId: 'project',
    name: 'Customer portal cutover window may move past approved release date',
    selected: false,
  },
  {
    id: 'heritage-review-permit',
    categoryId: 'project',
    name: 'Heritage review permit decision may delay civil works',
    selected: false,
  },
  {
    id: 'mobile-workforce-adoption',
    categoryId: 'project',
    name: 'Mobile workforce adoption is below the expected pilot threshold',
    selected: false,
  },
  {
    id: 'project-vendor-testing',
    categoryId: 'project',
    name: 'Vendor testing environment is not aligned with project acceptance criteria',
    selected: false,
  },
  {
    id: 'program-benefits-baseline',
    categoryId: 'program',
    name: 'Program benefits baseline is incomplete for quarterly reporting',
    selected: false,
  },
  {
    id: 'shared-platform-capacity',
    categoryId: 'program',
    name: 'Shared platform capacity may constrain dependent delivery streams',
    selected: false,
  },
  {
    id: 'change-adoption-readiness',
    categoryId: 'program',
    name: 'Change adoption readiness is inconsistent across workstreams',
    selected: false,
  },
  {
    id: 'funding-sequencing',
    categoryId: 'program',
    name: 'Funding sequencing may defer mandatory compliance deliverables',
    selected: false,
  },
  {
    id: 'external-policy-change',
    categoryId: 'other',
    name: 'External policy change may require a revised assurance position',
    selected: false,
  },
  {
    id: 'community-feedback-volume',
    categoryId: 'other',
    name: 'Community feedback volume may exceed response capacity',
    selected: false,
  },
  {
    id: 'regulatory-decision-lag',
    categoryId: 'other',
    name: 'Regulatory decision lag could affect executive reporting confidence',
    selected: false,
  },
];

export const pmoGovernanceForumIssueEmptyState: PmoGovernanceForumIssueEmptyState = {
  message: 'Looks like there are no issues related to this Forum. To add new, click on the "Add Issue" button.',
  badgeLabel: 'No issues',
};

export const pmoGovernanceRecordDetails: Readonly<Record<string, PmoGovernanceRecordDetail>> = {
  r65: {
    id: 'r65',
    recordId: 'R65',
    title: 'Improve transparency of information shared with staff and citizens',
    type: 'Decision',
    status: 'N/A',
    forum: 'People & Culture Committee',
    meeting: '-',
    priority: 'Low',
    category: 'None',
    decisionDate: '16/08/2018',
    createdBy: 'James T Kirk',
    description:
      'The meeting will cover regulations and policies in place that are responsible for the sharing of information with our staff as well as the citizens.',
    primaryAgenda: '-',
    owner: 'Geoff Neideck',
    businessUnit: '-',
    responsibleOfficer: 'Chris Stan',
    approver: 'Chris Stan',
    relatedAgendas: {
      id: 'agendas',
      title: 'Related Agendas',
      emptyLabel: 'No Agendas',
      items: [],
    },
    relatedOutcomes: {
      id: 'outcomes',
      title: 'Related Outcomes',
      emptyLabel: 'No Outcomes',
      items: [],
    },
    relatedRecords: {
      id: 'records',
      title: 'Related Records',
      emptyLabel: 'No Records',
      items: [],
    },
    relatedProjects: {
      id: 'projects',
      title: 'Related Projects',
      emptyLabel: 'No Projects',
      items: [
        { title: 'Ageing and disability project - Stage 1 literature review', meta: '0 Benefit(s)' },
        { title: 'Farm Tech Initiative', meta: '0 Benefit(s)' },
        { title: 'I - Chamber Sustainability Network', meta: '0 Benefit(s)' },
      ],
    },
    relatedSource: {
      sourceName: 'Operational & IT Audit',
      linkLabel: 'Source Link',
      linkValue: '-',
      recommendations: [
        'Leakage of crucial information during account migration',
        'Centralization of data',
        'Collaterals not updated with latest changes in marketing strategy',
      ],
    },
    relatedRisks: {
      id: 'risks',
      title: 'Related Risks',
      emptyLabel: 'No Risks',
      items: [
        { title: 'Leakage of crucial information during account migration' },
        { title: 'Centralization of data' },
        { title: 'Collaterals not updated with latest changes in marketing strategy' },
      ],
    },
    relatedCapabilities: {
      id: 'capabilities',
      title: 'Related Capabilities',
      emptyLabel: 'No Capabilities',
      items: [],
    },
    relatedValueStreams: {
      id: 'value-streams',
      title: 'Related Value Streams',
      emptyLabel: 'No Value Streams',
      items: [],
    },
    relatedLinks: {
      id: 'links',
      title: 'Related Links',
      emptyLabel: 'No Links',
      items: [],
    },
    activity: [
      {
        id: 'comment-2021-02-18',
        actor: 'James T Kirk',
        timestamp: '18/02/2021 12:21',
        body: 'Add Comment',
      },
      {
        id: 'comment-2020-03-23',
        actor: 'James T Kirk',
        timestamp: '23/03/2020 15:21',
        body: 'asasasa',
      },
      {
        id: 'link-added',
        body: '1 Added Link(s)',
        meta: 'Related link update',
      },
      {
        id: 'owner-updated',
        actor: 'James T Kirk',
        timestamp: '10/04/2018 00:54',
        body: 'Updated Owner from Chris Stan to Geoff Neideck',
      },
    ],
  },
};

export function pmoGovernanceRecordDetailFor(record: PmoGovernanceRecordRow): PmoGovernanceRecordDetail {
  return pmoGovernanceRecordDetails[record.id] ?? createPmoGovernanceRecordDetail(record);
}

function createPmoGovernanceRecordDetail(record: PmoGovernanceRecordRow): PmoGovernanceRecordDetail {
  const recordDate = record.dueOn === 'N/A' ? '-' : record.dueOn;
  return {
    id: record.id,
    recordId: record.record,
    title: record.recordTitle,
    type: record.type,
    status: record.status,
    forum: 'People & Culture Committee',
    meeting: '-',
    priority: 'Low',
    category: 'None',
    decisionDate: recordDate,
    createdBy: record.owner,
    description: `${record.recordTitle} is tracked as a ${record.type.toLowerCase()} record in the PMO governance workspace.`,
    primaryAgenda: '-',
    owner: record.owner,
    businessUnit: '-',
    responsibleOfficer: record.owner,
    approver: record.owner,
    relatedAgendas: emptyRecordRelationBlock('agendas', 'Related Agendas', 'No Agendas'),
    relatedOutcomes: emptyRecordRelationBlock('outcomes', 'Related Outcomes', 'No Outcomes'),
    relatedRecords: emptyRecordRelationBlock('records', 'Related Records', 'No Records'),
    relatedProjects: emptyRecordRelationBlock('projects', 'Related Projects', 'No Projects'),
    relatedSource: {
      sourceName: 'No source available for this forum',
      linkLabel: 'Source Link',
      linkValue: '-',
      recommendations: [],
    },
    relatedRisks: emptyRecordRelationBlock('risks', 'Related Risks', 'No Risks'),
    relatedCapabilities: emptyRecordRelationBlock('capabilities', 'Related Capabilities', 'No Capabilities'),
    relatedValueStreams: emptyRecordRelationBlock('value-streams', 'Related Value Streams', 'No Value Streams'),
    relatedLinks: emptyRecordRelationBlock('links', 'Related Links', 'No Links'),
    activity: [
      {
        id: `${record.id}-opened`,
        actor: record.owner,
        body: `${record.record} opened from All Records.`,
      },
    ],
  };
}

function emptyRecordRelationBlock(id: string, title: string, emptyLabel: string): PmoGovernanceRecordRelationBlock {
  return {
    id,
    title,
    emptyLabel,
    items: [],
  };
}

export const pmoGovernancePastMeetingRows: readonly PmoGovernanceMeetingRow[] = [
  {
    id: 'annual-performance-review',
    meetingDate: '30/06/2025',
    meetingName: 'Annual Performance Review',
    actions: 0,
    decisions: 0,
  },
  {
    id: 'dham-quarterly-review',
    meetingDate: '30/03/2025',
    meetingName: 'DHAM Quarterly Review',
    actions: 1,
    decisions: 2,
  },
  {
    id: 'strategic-objectives',
    meetingDate: '07/11/2018',
    meetingName: 'Discussion on Strategic Objectives',
    actions: 1,
    decisions: 0,
  },
  {
    id: 'end-of-the-year',
    meetingDate: '30/11/2018',
    meetingName: 'End of the year',
    actions: 1,
    decisions: 0,
  },
  {
    id: 'future-meeting',
    meetingDate: '13/02/2020',
    meetingName: 'future meeting',
    actions: 0,
    decisions: 1,
  },
];

export const pmoGovernanceForumSourceRows: readonly PmoGovernanceSourceRow[] = [
  {
    id: 'compliance-audit',
    source: 'Compliance Audit',
    type: 'Compliance',
    lastUpdatedOn: '09/06/2025',
    recommendations: 6,
    associatedRecords: 5,
  },
  {
    id: 'dham-business-excellence-delegation',
    source: 'DHAM Business Excellence Delegation of Authority',
    type: 'DOA',
    lastUpdatedOn: '09/06/2025',
    recommendations: 1,
    associatedRecords: 0,
  },
  {
    id: 'performance-review-forum',
    source: 'Performance Review',
    type: 'Reporting',
    lastUpdatedOn: '09/06/2025',
    recommendations: 2,
    associatedRecords: 0,
  },
  {
    id: 'operational-it-audit-forum',
    source: 'Operational & IT Audit',
    type: 'Reporting',
    lastUpdatedOn: '06/04/2020',
    recommendations: 3,
    associatedRecords: 2,
  },
  {
    id: 'report-validation-forum',
    source: 'Report Validation',
    type: 'Reporting',
    lastUpdatedOn: '-',
    recommendations: 1,
    associatedRecords: 1,
  },
];

export const pmoGovernanceSourceRows: readonly PmoGovernanceSourceRow[] = [
  {
    id: 'performance-review',
    source: 'Performance Review',
    type: 'Reporting',
    lastUpdatedOn: '09/06/2025',
    recommendations: 2,
    associatedRecords: 1,
  },
  {
    id: 'operational-it-audit',
    source: 'Operational & IT Audit',
    type: 'Reporting',
    lastUpdatedOn: '06/04/2020',
    recommendations: 3,
    associatedRecords: 4,
  },
  {
    id: 'report-validation',
    source: 'Report Validation',
    type: 'Reporting',
    lastUpdatedOn: '-',
    recommendations: 1,
    associatedRecords: 1,
  },
  {
    id: 'audit-report-2021',
    source: 'Audit Report 2021',
    type: 'Reporting',
    lastUpdatedOn: '-',
    recommendations: 0,
    associatedRecords: 0,
  },
  {
    id: 'ipo-quarterly-health-check',
    source: 'IPO Quarterly Health Check',
    type: 'Reporting',
    lastUpdatedOn: '-',
    recommendations: 1,
    associatedRecords: 0,
  },
  {
    id: 'test',
    source: 'test',
    type: 'Reporting',
    lastUpdatedOn: '08/06/2025',
    recommendations: 0,
    associatedRecords: 0,
  },
  {
    id: 'project-reporting',
    source: 'Project Reporting',
    type: 'Management',
    lastUpdatedOn: '12/01/2022',
    recommendations: 1,
    associatedRecords: 0,
  },
  {
    id: 'doa-stest',
    source: 'DOA STEST',
    type: 'Management',
    lastUpdatedOn: '-',
    recommendations: 1,
    associatedRecords: 1,
  },
  {
    id: 'tor',
    source: 'TOR',
    type: 'Management',
    lastUpdatedOn: '-',
    recommendations: 1,
    associatedRecords: 0,
  },
  {
    id: 'dham-investment-approval-framework',
    source: 'DHAM Investment Approval Framework',
    type: 'DOA',
    lastUpdatedOn: '09/06/2025',
    recommendations: 1,
    associatedRecords: 1,
  },
];

export const pmoGovernanceForumRows: readonly PmoGovernanceForumRow[] = [
  {
    id: 'audit-committee',
    forumName: 'Audit Committee',
    forumId: 'F69',
    secretariat: 'James T Kirk',
    type: 'Substantiated',
    category: 'Business Excellence',
    description:
      "The Audit Committee provides independent oversight of Dubai Holding Asset Management's financial reporting, internal controls, and risk management frameworks. It reviews audit plans and findings from internal and external auditors, ensures compliance with regulatory and governance standards, and monitors the remediation of audit issues. By fostering transparent dialogue between management and auditors, the committee helps safeguard the organization's financial integrity and stakeholder trust.",
    createdOn: '08/06/2025',
    createdBy: 'James T Kirk',
    chair: 'Hanady Amin',
    secretariatMembers: ['James T Kirk'],
    memberNames: ['Chloe Gibson', 'Lisa Wynn'],
    members: 2,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'bbb-board',
    forumName: 'BBB Board',
    forumId: 'F66',
    secretariat: 'Chethan Vijayadeva',
    type: 'Non-Substantiated',
    category: 'P3M Governance',
    description:
      'The BBB Board reviews governance papers, delivery exceptions, and decisions that need cross-functional sponsorship before they move into execution forums.',
    createdOn: '08/06/2025',
    createdBy: 'Chethan Vijayadeva',
    chair: 'James T Kirk',
    secretariatMembers: ['Chethan Vijayadeva'],
    memberNames: ['Akshay K', 'Rohit Sareen'],
    members: 2,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'business-excellence',
    forumName: 'Business Excellence',
    forumId: 'F18',
    secretariat: 'James T Kirk',
    moreOwners: '+2 more',
    type: 'Substantiated',
    category: 'Business Excellence',
    description:
      'The Business Excellence forum maintains governance oversight for operational excellence initiatives, maturity improvements, and performance recommendations across the portfolio.',
    createdOn: '08/06/2025',
    createdBy: 'James T Kirk',
    chair: 'Chethan Vijayadeva',
    secretariatMembers: ['James T Kirk', 'Akshay K', 'Alex Vayne'],
    memberNames: ['Chloe Gibson', 'Lisa Wynn', 'Rohit Sareen', 'Canning Santos'],
    members: 14,
    tagCount: 1,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'ciic-committee',
    forumName: 'CIIC Committee',
    forumId: 'F58',
    secretariat: 'Canning Santos',
    type: 'Non-Substantiated',
    category: '-',
    description: 'The CIIC Committee captures emerging governance items and prepares candidate decisions for substantiated governance forums.',
    createdOn: '08/06/2025',
    createdBy: 'Canning Santos',
    chair: 'Rohit Sareen',
    secretariatMembers: ['Canning Santos'],
    memberNames: [],
    members: 0,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'compliance-assurance',
    forumName: 'Compliance & Assurance',
    forumId: 'F70',
    secretariat: 'James T Kirk',
    type: 'Substantiated',
    category: 'Business Excellence',
    description:
      'The Compliance & Assurance forum tracks assurance actions, compliance recommendations, and the closure of audit-linked governance commitments.',
    createdOn: '08/06/2025',
    createdBy: 'James T Kirk',
    chair: 'Akshay K',
    secretariatMembers: ['James T Kirk'],
    memberNames: [],
    members: 0,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'compliance-statements',
    forumName: 'Compliance Statements',
    forumId: 'F52',
    secretariat: 'Rohit Sareen',
    type: 'Substantiated',
    category: 'Compliance',
    description:
      'The Compliance Statements forum reviews compliance positions, evidence quality, and sign-off readiness for governance reporting cycles.',
    createdOn: '08/06/2025',
    createdBy: 'Rohit Sareen',
    chair: 'Canning Santos',
    secretariatMembers: ['Rohit Sareen'],
    memberNames: ['Akshay K', 'James T Kirk'],
    members: 2,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'design-decisions-committee',
    forumName: 'Design Decisions Committee',
    forumId: 'F55',
    secretariat: 'Alex Vayne',
    moreOwners: '+1 more',
    type: 'Non-Substantiated',
    category: '-',
    description:
      'The Design Decisions Committee records architecture and design recommendations that need validation before they become formal governance records.',
    createdOn: '08/06/2025',
    createdBy: 'Alex Vayne',
    chair: 'James T Kirk',
    secretariatMembers: ['Alex Vayne', 'Akshay K'],
    memberNames: ['Chethan Vijayadeva', 'Canning Santos', 'Rohit Sareen'],
    members: 3,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'external-auditor-committee',
    forumName: 'External Auditor committee',
    forumId: 'F65',
    secretariat: 'Chethan Vijayadeva',
    type: 'Non-Substantiated',
    category: '-',
    description:
      'The External Auditor committee coordinates independent audit observations, evidence requests, and management responses for governance review.',
    createdOn: '08/06/2025',
    createdBy: 'Chethan Vijayadeva',
    chair: 'Alex Vayne',
    secretariatMembers: ['Chethan Vijayadeva'],
    memberNames: ['James T Kirk', 'Akshay K'],
    members: 2,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'investment-committee',
    forumName: 'Investment Committee',
    forumId: 'F20',
    secretariat: 'James T Kirk',
    type: 'Substantiated',
    category: 'Compliance',
    description:
      'The Investment Committee governs investment approvals, compliance dependencies, and risk recommendations connected to capital allocation decisions.',
    createdOn: '08/06/2025',
    createdBy: 'James T Kirk',
    chair: 'Rohit Sareen',
    secretariatMembers: ['James T Kirk'],
    memberNames: ['Akshay K', 'Chethan Vijayadeva', 'Canning Santos'],
    members: 6,
    tagCount: 1,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
  {
    id: 'lidcombe-switchgear-replacement-board',
    forumName: 'Lidcombe Switchgear Replacement Board',
    forumId: 'F53',
    secretariat: 'Chethan Vijayadeva',
    type: 'Non-Substantiated',
    category: '-',
    description:
      'The Lidcombe Switchgear Replacement Board captures project-specific governance items before they are escalated into substantiated forums.',
    createdOn: '08/06/2025',
    createdBy: 'Chethan Vijayadeva',
    chair: 'Akshay K',
    secretariatMembers: ['Chethan Vijayadeva'],
    memberNames: [],
    members: 0,
    tagCount: 0,
    favorite: false,
    nextMeeting: 'No meeting scheduled',
  },
];
