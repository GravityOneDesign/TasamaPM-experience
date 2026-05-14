import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleMountOptions } from './pm-console.types';

type ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground';
type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages';
type ActionWorkspaceView = 'board' | 'calendar';
type WorkspaceDisplay = 'table' | 'cards';
type WorkspaceRegister = 'projects' | 'benefits' | 'risks';
type ProjectPlanEntry = 'quick' | 'reports' | 'change-request' | 'closure';
type ProjectPlanDetailMode = 'simple' | 'detailed';
type ReportDetailMode = 'simple' | 'detailed';
type WorkspaceTableColumnId = 'project' | 'stage' | 'trend' | 'manager' | 'baselineStart' | 'baselineEnd' | 'budget' | 'status';
type WorkspaceTableColumnMotionState = 'visible' | 'entering' | 'exiting';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  page?: ConsolePage;
  entry?: string;
  view?: WorkspaceView;
}

interface BoardFilter {
  id: string;
  label: string;
  icon: string;
}

interface ProjectRow {
  id: string;
  code: string;
  title: string;
  stage: string;
  status: string;
  statusTone: string;
  trend: string[];
  manager: string;
  managerInitials: string;
  baselineStart: string;
  baselineEnd: string;
  budgetUsed: string;
  budgetTotal: string;
  priority: string;
}

interface WorkspaceRegisterTab {
  id: WorkspaceRegister;
  label: string;
  icon: string;
  count: number;
}

interface WorkspaceRegisterStat {
  label: string;
  value: number;
  icon: string;
  tone: string;
}

interface BenefitRegisterRow {
  id: string;
  benefit: string;
  project: string;
  owner: string;
  targetDate: string;
  measure: string;
  realization: string;
  realizationTone: string;
  status: string;
  statusTone: string;
}

interface RiskRegisterRow {
  id: string;
  risk: string;
  project: string;
  owner: string;
  mitigation: string;
  reviewDate: string;
  exposure: string;
  exposureTone: string;
  status: string;
  statusTone: string;
}

interface WorkspaceTableColumn {
  id: WorkspaceTableColumnId;
  label: string;
}

interface ReportCreationDetail {
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

interface SimplePlanField {
  label: string;
  value: string;
  kind?: string;
  wide?: boolean;
  avatarInitials?: string;
  mandatory?: boolean;
  options?: string[];
}

interface SimplePlanSection {
  title: string;
  body: string;
  icon: string;
  fields: SimplePlanField[];
  readOnly?: boolean;
}

interface SimpleReportGuide {
  focus: string;
  status: string;
  tone: string;
  action: string;
}

interface ReportTimelinePoint {
  date: string;
  tone: string;
  label: string;
}

interface ReportDrawerCard {
  id: string;
  title: string;
  body: string;
  status: string;
  tone: string;
  trend: string;
  comments: string;
  timeline: ReportTimelinePoint[];
}

interface SimplePlanTableConfig {
  action: string;
  description: string;
  columns: string[];
  rows: string[][];
}

interface ProjectPlanField {
  id: string;
  section: string;
  field: string;
  value: string;
  type: string;
  simple: boolean;
  intermediate: boolean;
  detailed: boolean;
  mandatory?: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
}

interface ProjectPlanFieldGroup {
  title: string;
  description: string;
  fields: ProjectPlanField[];
}

interface ProjectPlanFieldGroupConfig {
  title: string;
  description: string;
  fields: string[];
}

type DependencyRegisterKey = 'predecessor' | 'successor';

interface DependencyRegisterRow {
  id: string;
  project: string;
  impact: string;
  dependentProduct: string;
  baselineStart: string;
  baselineEnd: string;
  projectManager: string;
  nature: string;
  status: string;
}

interface DependencyRegisterDraft {
  project: string;
  impact: string;
  dependentProduct: string;
  baselineStart: string;
  baselineEnd: string;
  projectManager: string;
  nature: string;
}

interface DependencyRegisterConfig {
  key: DependencyRegisterKey;
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  projectPlaceholder: string;
  impactPlaceholder: string;
  dependentProductPlaceholder: string;
  projectOptions: string[];
  impactOptions: string[];
  dependentProductOptions: string[];
  rows: DependencyRegisterRow[];
  draft: DependencyRegisterDraft;
}

interface IssuePlanRow {
  id: string;
  issueType: string;
  criticality: string;
  issue: string;
  description: string;
  resolution: string;
  status: string;
  owner: string;
  dateRaised: string;
  dueDate: string;
  dateClosed: string;
}

interface IssuePlanDraft {
  issueType: string;
  criticality: string;
  issue: string;
  description: string;
  resolution: string;
  status: string;
  owner: string;
  dateRaised: string;
  dueDate: string;
  dateClosed: string;
}

interface IssuePlanConfig {
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  issueTypePlaceholder: string;
  ownerPlaceholder: string;
  issueTypeOptions: string[];
  criticalityOptions: string[];
  statusOptions: string[];
  ownerOptions: string[];
  rows: IssuePlanRow[];
  draft: IssuePlanDraft;
}

interface ChangeImpactRow {
  id: string;
  category: string;
  stakeholder: string;
  level: string;
  comment: string;
  strategies: string[];
}

interface ChangeImpactDraft {
  category: string;
  stakeholder: string;
  level: string;
  comment: string;
  strategyInput: string;
  strategies: string[];
}

type ChangeImpactDraftField = 'category' | 'stakeholder' | 'level' | 'comment' | 'strategyInput';

interface ChangeImpactConfig {
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  categoryPlaceholder: string;
  stakeholderPlaceholder: string;
  levelPlaceholder: string;
  strategyPlaceholder: string;
  categoryOptions: string[];
  stakeholderOptions: string[];
  levelOptions: string[];
  rows: ChangeImpactRow[];
  draft: ChangeImpactDraft;
}

interface RelatedLinkRow {
  id: string;
  name: string;
  description: string;
  documentLink: string;
}

interface RelatedLinkDraft {
  name: string;
  description: string;
  documentLink: string;
}

interface RelatedLinkConfig {
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  documentPlaceholder: string;
  rows: RelatedLinkRow[];
  draft: RelatedLinkDraft;
}

interface ResourcePlanRow {
  id: string;
  resource: string;
  resourceType: string;
  impact: string;
  businessUnit: string;
  fteCount: string;
  baselineStart: string;
  baselineEnd: string;
  comments: string;
}

interface ResourcePlanDraft {
  resource: string;
  resourceType: string;
  impact: string;
  businessUnit: string;
  fteCount: string;
  baselineStart: string;
  baselineEnd: string;
  comments: string;
}

interface ResourcePlanConfig {
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  resourcePlaceholder: string;
  resourceTypePlaceholder: string;
  impactPlaceholder: string;
  businessUnitPlaceholder: string;
  ftePlaceholder: string;
  resourceOptions: string[];
  resourceTypeOptions: string[];
  impactOptions: string[];
  businessUnitOptions: string[];
  rows: ResourcePlanRow[];
  draft: ResourcePlanDraft;
}

interface BenefitPlanRow {
  id: string;
  benefitType: string;
  category: string;
  benefitName: string;
  description: string;
  owner: string;
  realizationDate: string;
}

interface BenefitPlanDraft {
  benefitType: string;
  category: string;
  benefitName: string;
  description: string;
  owner: string;
  realizationDate: string;
}

interface BenefitPlanConfig {
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  benefitTypePlaceholder: string;
  benefitCategoryPlaceholder: string;
  ownerPlaceholder: string;
  benefitTypeOptions: string[];
  benefitCategoryOptions: string[];
  ownerOptions: string[];
  rows: BenefitPlanRow[];
  draft: BenefitPlanDraft;
}

interface GuidedTourStep {
  target: string;
  title: string;
  body: string;
  daily: string;
}

const iconMap: Record<string, string> = {
  alert: 'triangle-alert',
  arrow: 'chevron-right',
  benefit: 'circle-check',
  benefitGraph: 'chart-pie',
  bell: 'bell',
  book: 'book-open',
  building: 'building-2',
  calendar: 'calendar-days',
  calendarMinimal: 'calendar',
  chart: 'chart-column',
  check: 'circle-check',
  checklist: 'check-square',
  checkMark: 'check',
  changeRequest: 'git-pull-request',
  close: 'x',
  closure: 'file-x',
  columns: 'columns-3',
  database: 'database',
  dependencies: 'network',
  down: 'chevron-down',
  dollar: 'circle-dollar-sign',
  download: 'download',
  endProduct: 'package',
  eye: 'eye',
  eyeOff: 'eye-off',
  fileCheck: 'file-check-2',
  filter: 'filter',
  folderOpen: 'folder-open',
  grid: 'layout-grid',
  history: 'history',
  info: 'info',
  issues: 'circle-x',
  lessons: 'lightbulb',
  link: 'link-2',
  list: 'list',
  management: 'file-text',
  milestone: 'flag',
  moreVertical: 'ellipsis-vertical',
  pauseCircle: 'circle-pause',
  pin: 'pin',
  pinOff: 'pin-off',
  plan: 'file-text',
  playground: 'git-branch',
  prev: 'chevron-left',
  plus: 'plus',
  priority: 'chevrons-up',
  project: 'folder',
  quickGrid: 'layout-grid',
  registerRisk: 'panels-top-left',
  resources: 'users',
  risks: 'triangle-alert',
  rocket: 'rocket',
  route: 'route',
  search: 'search',
  save: 'save',
  settings: 'settings',
  send: 'send',
  sliders: 'sliders-horizontal',
  stageGate: 'clipboard-check',
  status: 'circle',
  store: 'store',
  widget: 'layout-grid',
  table: 'table-2',
  timeline: 'list-tree',
  todo: 'circle-dot',
  trendUp: 'trending-up',
  wbs: 'git-branch',
};

const projectQuickActions: QuickAction[] = [
  { id: 'project-plan', title: 'Project plan', icon: 'plan', page: 'project-plan', entry: 'quick' },
  { id: 'wbs', title: 'WBS', icon: 'wbs', page: 'wbs' },
  { id: 'stage-gate', title: 'Stage gate', icon: 'stageGate', view: 'stages' },
  { id: 'change-request', title: 'Change request', icon: 'changeRequest', page: 'project-plan', entry: 'change-request' },
  { id: 'dependencies', title: 'Dependencies', icon: 'dependencies' },
  { id: 'resources', title: 'Resources', icon: 'resources' },
  { id: 'risks', title: 'Risks', icon: 'risks' },
  { id: 'issues', title: 'Issues', icon: 'issues' },
  { id: 'project-closure', title: 'Project closure', icon: 'closure', page: 'project-plan', entry: 'closure' },
  { id: 'lessons-learnt', title: 'Lessons learnt', icon: 'lessons' },
  { id: 'benefits', title: 'Benefits', icon: 'benefit' },
  { id: 'management-products', title: 'Management products', icon: 'management' },
  { id: 'end-products', title: 'End products', icon: 'endProduct' },
  { id: 'milestones', title: 'Milestones', icon: 'milestone' },
  { id: 'reports', title: 'Reports', icon: 'list', page: 'project-plan', entry: 'reports' },
  { id: 'action-board', title: 'Action board', icon: 'columns', page: 'workspace', view: 'board' },
  { id: 'calendar', title: 'Calendar', icon: 'calendar', page: 'workspace', view: 'calendar' },
  { id: 'project-rooms', title: 'Project rooms', icon: 'building', page: 'workspaces' },
];

const unassignedJourneySteps = [
  {
    title: 'Project assigned',
    body: 'You’ll receive a PMO assignment notification.',
    icon: 'bell',
  },
  {
    title: 'Build project plan',
    body: 'Set scope, timeline, risks, and dependencies.',
    icon: 'plan',
  },
  {
    title: 'Submit for approval',
    body: 'Send your baseline for PMO review and endorsement.',
    icon: 'stageGate',
  },
  {
    title: 'Manage delivery',
    body: 'Track milestones, issues, and dependencies.',
    icon: 'playground',
  },
  {
    title: 'Report progress',
    body: 'Submit PSRs and maintain delivery health.',
    icon: 'chart',
  },
];

const firstAssignedProject = {
  id: 'UAE Research Map',
  name: 'UAE Research Map',
  stage: 'Initiation',
  owner: 'Muna Hassan',
  planDue: 'Jun 12',
};

const workspaceTableProjects: ProjectRow[] = [
  { id: 'UAE Research Map', code: 'ATRC-01', title: 'UAE Research Map', stage: 'Initiation', status: 'Alert', statusTone: 'amber', trend: ['green', 'amber', 'amber'], manager: 'Muna Hassan', managerInitials: 'MH', baselineStart: '01/15/2024', baselineEnd: '06/12/2026', budgetUsed: '$125K', budgetTotal: '$320K', priority: 'high' },
  { id: 'Global Anti-Scam Taskforce', code: 'ATRC-02', title: 'Global Anti-Scam Taskforce', stage: 'Closure', status: 'On-Track', statusTone: 'green', trend: ['green', 'green', 'amber'], manager: 'Sarah Ahmed', managerInitials: 'SA', baselineStart: '03/22/2024', baselineEnd: '03/22/2026', budgetUsed: '$125K', budgetTotal: '$320K', priority: 'normal' },
  { id: 'Counter Terrorism Operations', code: 'ATRC-03', title: 'Counter Terrorism Operations', stage: 'Execution', status: 'Off-Track', statusTone: 'red', trend: ['amber', 'red', 'amber'], manager: 'Ahmed Hadi', managerInitials: 'AH', baselineStart: '07/04/2023', baselineEnd: '11/30/2025', budgetUsed: '$125K', budgetTotal: '$320K', priority: 'high' },
  { id: 'Vision 2030', code: 'ATRC-04', title: 'Vision 2030', stage: 'Execution', status: 'On-Track', statusTone: 'green', trend: ['green', 'green', 'green'], manager: 'Muna Hassan', managerInitials: 'MH', baselineStart: '02/01/2024', baselineEnd: '10/30/2026', budgetUsed: '$2.5M', budgetTotal: '$4.3M', priority: 'normal' },
  { id: 'NEOM Integration', code: 'ATRC-05', title: 'NEOM Integration', stage: 'Planning', status: 'Alert', statusTone: 'amber', trend: ['amber', 'red', 'green'], manager: 'Fatima Ali', managerInitials: 'FA', baselineStart: '09/18/2024', baselineEnd: '01/16/2027', budgetUsed: '$3.1M', budgetTotal: '$3.1M', priority: 'normal' },
  { id: 'Smart City Alpha', code: 'ATRC-06', title: 'Smart City Alpha', stage: 'Execution', status: 'On-Track', statusTone: 'green', trend: ['green', 'amber', 'green'], manager: 'Khalid Omar', managerInitials: 'KO', baselineStart: '04/08/2025', baselineEnd: '12/15/2026', budgetUsed: '$980K', budgetTotal: '$1.7M', priority: 'normal' },
  { id: 'PMO Capability', code: 'ATRC-07', title: 'PMO Capability', stage: 'Initiation', status: 'Not Started', statusTone: 'blue', trend: ['neutral', 'neutral', 'blue'], manager: 'Laila Noor', managerInitials: 'LN', baselineStart: '05/20/2026', baselineEnd: '02/28/2027', budgetUsed: '$0', budgetTotal: '$1.2M', priority: 'not-started' },
];

const benefitRegisterRows: BenefitRegisterRow[] = [
  { id: 'BEN-01', benefit: 'Improve research capability discovery', project: 'UAE Research Map', owner: 'Research Leads Forum', targetDate: '10/15/2026', measure: '350 researchers onboarded', realization: 'In realization', realizationTone: 'amber', status: 'On Track', statusTone: 'green' },
  { id: 'BEN-02', benefit: 'Reduce duplicate funding calls', project: 'Vision 2030', owner: 'PMO Desk', targetDate: '09/30/2026', measure: '18% duplicate reduction', realization: 'Validating', realizationTone: 'amber', status: 'On Track', statusTone: 'green' },
  { id: 'BEN-03', benefit: 'Accelerate sponsor approvals', project: 'NEOM Integration', owner: 'Fatima Ali', targetDate: '07/15/2026', measure: '25% cycle-time reduction', realization: 'Planned', realizationTone: 'blue', status: 'Attention', statusTone: 'amber' },
  { id: 'BEN-04', benefit: 'Increase cross-border taskforce coordination', project: 'Global Anti-Scam Taskforce', owner: 'Sarah Ahmed', targetDate: '03/01/2026', measure: '4 joint operating protocols signed', realization: 'Realized', realizationTone: 'green', status: 'Realized', statusTone: 'green' },
  { id: 'BEN-05', benefit: 'Lift PMO adoption maturity', project: 'PMO Capability', owner: 'Laila Noor', targetDate: '12/18/2026', measure: '80% workflow adoption', realization: 'Planned', realizationTone: 'blue', status: 'Not Started', statusTone: 'blue' },
  { id: 'BEN-06', benefit: 'Improve predictive operations response', project: 'Smart City Alpha', owner: 'Khalid Omar', targetDate: '11/30/2026', measure: '15-minute faster dispatch time', realization: 'In realization', realizationTone: 'amber', status: 'On Track', statusTone: 'green' },
];

const riskRegisterRows: RiskRegisterRow[] = [
  { id: 'RSK-01', risk: 'Stakeholder data quality may delay baseline', project: 'UAE Research Map', owner: 'Muna Hassan', mitigation: 'Run a cleansing sprint and confirm source owners before sign-off.', reviewDate: '05/08/2026', exposure: 'Medium', exposureTone: 'amber', status: 'Monitoring', statusTone: 'amber' },
  { id: 'RSK-02', risk: 'Commercial overrun on integration scope', project: 'NEOM Integration', owner: 'Fatima Ali', mitigation: 'Rebaseline the contract package and secure finance approval this week.', reviewDate: '05/10/2026', exposure: 'Critical', exposureTone: 'red', status: 'Escalated', statusTone: 'red' },
  { id: 'RSK-03', risk: 'Vendor dependency slippage affects delivery dates', project: 'Smart City Alpha', owner: 'Khalid Omar', mitigation: 'Add recovery buffer and enforce a dual-supplier checkpoint.', reviewDate: '05/06/2026', exposure: 'High', exposureTone: 'red', status: 'Active', statusTone: 'amber' },
  { id: 'RSK-04', risk: 'Stage-gate evidence pack may miss the forum cutoff', project: 'Vision 2030', owner: 'PMO Desk', mitigation: 'Prepare the evidence pack early and assign an approval fallback.', reviewDate: '05/11/2026', exposure: 'Medium', exposureTone: 'amber', status: 'Active', statusTone: 'amber' },
  { id: 'RSK-05', risk: 'Benefits owner response is not yet confirmed', project: 'PMO Capability', owner: 'Laila Noor', mitigation: 'Follow up weekly with a named fallback approver in the forum.', reviewDate: '05/09/2026', exposure: 'Low', exposureTone: 'blue', status: 'Watching', statusTone: 'blue' },
];

const workspaceProjectCards = [
  { code: 'ATRC-01', title: 'UAE Research Map', stage: 'Initiation stage', status: 'On Track', statusTone: 'green', schedule: 72, budgetUsed: '$125K', budgetTotal: '$320K', budget: 39, nextDue: '01 Jun 2026 · 3 days', action: 'Submit PSR', reportProject: 'UAE Research Map' },
  { code: 'ATRC-02', title: 'Global Anti-Scam Taskforce', stage: 'Closure stage', status: 'On Track', statusTone: 'green', schedule: 41, budgetUsed: '$125K', budgetTotal: '$320K', budget: 39, nextDue: '01 Jun 2026 · 3 days', action: 'Open Project' },
  { code: 'ATRC-03', title: 'Counter Terrorism Operations', stage: 'Execution stage', status: 'At Risk', statusTone: 'amber', schedule: 82, budgetUsed: '$125K', budgetTotal: '$320K', budget: 39, nextDue: '01 Jun 2026 · 3 days', action: 'Submit PSR', reportProject: 'Counter Terrorism Operations' },
  { code: 'ATRC-04', title: 'Counter Terrorism Operations', stage: 'Draft', draft: true, nextDue: 'Plan not yet created', action: 'Create' },
];

const actions = [
  { column: 'Overdue', tone: 'red', items: [{ type: 'Project Status Report', title: 'Submit Vision 2030 weekly report', project: 'Vision 2030', meta: 'Overdue by 5 days', owner: 'SA', cta: 'Submit' }, { type: 'Risk Escalation', title: 'Budget overrun response', project: 'NEOM Integration', meta: 'High priority', owner: 'AH', cta: 'Resolve' }] },
  { column: 'This week', tone: 'blue', items: [{ type: 'Dependency', title: 'Confirm API dependency owner', project: 'Smart City Alpha', meta: 'Due today', owner: 'FA', cta: 'Chase' }, { type: 'Benefit', title: 'Benefits owner response', project: 'Smart City Alpha', meta: 'Due in 2 days', owner: 'FA', cta: 'Review' }] },
  { column: 'Upcoming', tone: 'amber', items: [{ type: 'Milestone', title: 'Execution gate readiness', project: 'Vision 2030', meta: 'Due Jun 12', owner: 'MH', cta: 'Open' }, { type: 'Risk', title: 'Initial RAID refresh', project: 'NEOM Integration', meta: 'Next week', owner: 'AH', cta: 'Plan' }] },
];

const boardFilters: BoardFilter[] = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'report', label: 'Reports', icon: 'plan' },
  { id: 'risk', label: 'Risks', icon: 'risks' },
  { id: 'dependency', label: 'Dependencies', icon: 'dependencies' },
  { id: 'benefit', label: 'Benefits', icon: 'benefit' },
  { id: 'milestone', label: 'Milestones', icon: 'milestone' },
  { id: 'task', label: 'Tasks', icon: 'checklist' },
];

const projectPlanFieldMatrix: ProjectPlanField[] = [
  { section: 'Project Setup', field: 'Project name', mandatory: true, simple: true, intermediate: true, detailed: true, type: 'text', value: 'UAE Research Map' },
  { section: 'Project Setup', field: 'Description', simple: false, intermediate: true, detailed: true, type: 'textarea', value: 'A centralized map for national research capabilities, partners, and funding touchpoints.' },
  { section: 'Project Setup', field: 'Category', simple: true, intermediate: true, detailed: true, type: 'select', value: 'Research & Development', options: ['Research & Development', 'Digital Transformation', 'Operations', 'Compliance'] },
  { section: 'Project Setup', field: 'Project Source', simple: false, intermediate: false, detailed: true, type: 'select', value: 'Strategic plan', options: ['Strategic plan', 'Audit finding', 'PMO request', 'Business unit request'] },
  { section: 'Project Setup', field: 'Is the Project Mandatory', simple: false, intermediate: true, detailed: true, type: 'boolean', value: 'No' },
  { section: 'Project Setup', field: 'Portfolio / Program', simple: false, intermediate: true, detailed: true, type: 'select', value: 'Innovation portfolio', options: ['Innovation portfolio', 'Digital services', 'Corporate services', 'Standalone'] },
  { section: 'Project Setup', field: 'Governance Board(s)/Forum(s)', simple: false, intermediate: false, detailed: true, type: 'text', value: 'PMO Steering Forum' },
  { section: 'Project Setup', field: 'Business Unit', simple: true, intermediate: true, detailed: true, type: 'select', value: 'Research Office', options: ['Research Office', 'Strategy', 'Corporate Services', 'Technology'] },
  { section: 'Project Setup', field: 'Project Initiator', simple: false, intermediate: false, detailed: true, type: 'text', value: 'Research Strategy Team' },
  { section: 'Project Setup', field: 'Project Director', simple: false, intermediate: true, detailed: true, type: 'text', value: 'Muna Hassan' },
  { section: 'Project Setup', field: 'Project Manager', simple: true, intermediate: true, detailed: true, type: 'text', value: 'Muna Hassan' },
  { section: 'Project Setup', field: 'Senior User', simple: false, intermediate: true, detailed: true, type: 'text', value: 'Research Leads Forum' },
  { section: 'Project Setup', field: 'Delivery Manager', simple: false, intermediate: false, detailed: true, type: 'text', value: 'Delivery Office' },
  { section: 'Project Setup', field: 'PMO Contact', mandatory: true, simple: true, intermediate: true, detailed: true, type: 'text', value: 'PMO Desk' },
  { section: 'Project Setup', field: 'Change Manager', simple: false, intermediate: true, detailed: true, type: 'text', value: 'Change team' },
  { section: 'Project Setup', field: 'Senior Supplier', simple: false, intermediate: false, detailed: true, type: 'text', value: 'TBD' },
  { section: 'Overview', field: 'Opportunity or Problem Statement', simple: true, intermediate: true, detailed: true, type: 'textarea', value: 'The UAE’s research ecosystem is fragmented and lacks a centralized, up-to-date platform to efficiently discover, connect, and leverage national R&D capabilities.' },
  { section: 'Overview', field: 'Business Drivers', simple: false, intermediate: true, detailed: true, type: 'table', value: 'Strategic research visibility' },
  { section: 'Overview', field: 'Driver for change / Analysis undertaken', simple: false, intermediate: false, detailed: true, type: 'textarea', value: 'Stakeholder mapping and portfolio reporting gaps indicate a need for a single research capability index.' },
  { section: 'Overview', field: 'Outcome', simple: true, intermediate: true, detailed: true, type: 'table', value: 'Reduce fragmentation in research efforts' },
  { section: 'Overview', field: 'Project Alignment (Objectives)', simple: false, intermediate: true, detailed: true, type: 'table', value: 'Boost regional sustainability and growth through partnerships and investment' },
  { section: 'Overview', field: 'Link Capabilities', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Regulatory Assurance' },
  { section: 'Overview', field: 'Link Services', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Material Master Maintenance' },
  { section: 'Overview', field: 'AI component', mandatory: true, simple: true, intermediate: true, detailed: true, type: 'boolean', value: 'No' },
  { section: 'Schedule & Scope', field: 'Baseline Start date', simple: true, intermediate: true, detailed: true, type: 'date', value: '2026-05-01' },
  { section: 'Schedule & Scope', field: 'Baseline End date', simple: true, intermediate: true, detailed: true, type: 'date', value: '2026-12-31' },
  { section: 'Schedule & Scope', field: 'Forecast Start date', simple: false, intermediate: true, detailed: true, type: 'date', value: '2026-05-08' },
  { section: 'Schedule & Scope', field: 'Forecast End date', simple: false, intermediate: true, detailed: true, type: 'date', value: '2026-12-31' },
  { section: 'Schedule & Scope', field: 'Milestones', simple: false, intermediate: true, detailed: true, type: 'table', value: 'Initiation gate' },
  { section: 'Schedule & Scope', field: 'Stages', simple: false, intermediate: false, detailed: true, type: 'select', value: 'Initiation', options: ['Initiation', 'Planning', 'Execution', 'Closure'] },
  { section: 'Schedule & Scope', field: 'In Scope', simple: true, intermediate: true, detailed: true, type: 'textarea', value: 'Research entities, universities, government stakeholders, industry partners, funding bodies, and R&D capability records.' },
  { section: 'Schedule & Scope', field: 'Out of Scope', simple: false, intermediate: false, detailed: true, type: 'textarea', value: 'Procurement execution, detailed grant administration, and non-research capability catalogues.' },
  { section: 'Schedule & Scope', field: 'End Product (Deliverables)', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Research capability map' },
  { section: 'Schedule & Scope', field: 'Management Product', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Project initiation documentation' },
  { section: 'Schedule & Scope', field: 'Detailed WBS', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Discovery and data model' },
  { section: 'Budget', field: 'CAPEX Baseline (FY)', simple: true, intermediate: true, detailed: true, type: 'money', value: '1,200,000' },
  { section: 'Budget', field: 'OPEX Baseline (FY)', simple: true, intermediate: true, detailed: true, type: 'money', value: '420,000' },
  { section: 'Budget', field: 'CAPEX Forecast (FY)', simple: false, intermediate: true, detailed: true, type: 'money', value: '1,180,000' },
  { section: 'Budget', field: 'OPEX Forecast (FY)', simple: false, intermediate: true, detailed: true, type: 'money', value: '435,000' },
  { section: 'Budget', field: 'Funding Sources', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Innovation fund' },
  { section: 'Budget', field: 'Monthly Budget Detail', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Monthly phasing' },
  { section: 'Budget', field: 'Budget Rules', simple: false, intermediate: false, detailed: true, type: 'textarea', value: 'Budget revisions require PMO review and sponsor approval before baseline changes are accepted.' },
  { section: 'Benefits', field: 'Benefits Register', simple: false, intermediate: true, detailed: true, type: 'table', value: 'Improved research discovery' },
  { section: 'Risk', field: 'Risks Register', simple: true, intermediate: true, detailed: true, type: 'table', value: 'Stakeholder data quality' },
  { section: 'Issues', field: 'Issues Register', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Open PMO decisions' },
  { section: 'Change Impact', field: 'Change Impact Assessment', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Process adoption impact' },
  { section: 'Related Links', field: 'Related Links / Documents', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Research source pack' },
  { section: 'Resource', field: 'Resource Plan', simple: false, intermediate: true, detailed: true, type: 'table', value: 'PM, analyst, data steward' },
  { section: 'Dependency', field: 'Predecessor Project(s)', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Data source onboarding' },
  { section: 'Dependency', field: 'Successor Project(s)', simple: false, intermediate: false, detailed: true, type: 'table', value: 'Research portal rollout' },
  {
    section: 'Miscellaneous',
    field: 'Old and Unsupportable Systems',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'number',
    value: '5',
    placeholder: '0',
    description: 'Capture the count or score for unsupported legacy systems affecting delivery.',
  },
  {
    section: 'Miscellaneous',
    field: 'High Maintenance Cost',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'number',
    value: '6',
    placeholder: '0',
    description: 'Record the count or score of cost-heavy systems that need ongoing support.',
  },
  {
    section: 'Miscellaneous',
    field: 'Out of Scope (legacy)',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'textarea',
    value: '7',
    placeholder: 'Add legacy exclusions or supporting context',
    description: 'Use when legacy work is intentionally excluded from this plan.',
  },
  {
    section: 'Miscellaneous',
    field: 'ICT Component',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'boolean',
    value: 'Yes',
    description: 'Flag whether this plan includes an ICT component.',
  },
  {
    section: 'Miscellaneous',
    field: 'Number of Assurance/Compliance Reviews Completed',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'number',
    value: '',
    placeholder: '0',
    description: 'Completed assurance or compliance reviews linked to the project.',
  },
  {
    section: 'Miscellaneous',
    field: 'Number of Recommendations Open',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'number',
    value: '',
    placeholder: '0',
    description: 'Outstanding assurance recommendations still open for follow-up.',
  },
  {
    section: 'Miscellaneous',
    field: 'Number of Recommendations Closed',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'number',
    value: '',
    placeholder: '0',
    description: 'Recommendations fully closed out and verified.',
  },
  {
    section: 'Miscellaneous',
    field: 'ADEO Status',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'choice',
    value: 'Not Tracked',
    options: ['On Track', 'Alert', 'Off Track', 'Not Tracked', 'NA'],
    description: 'Use when ADEO tracking applies to the project.',
  },
  {
    section: 'Miscellaneous',
    field: 'Commentary of admins',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'textarea',
    value: '',
    placeholder: 'Add admin notes or clarifications',
    description: 'Space for PMO or admin-only commentary.',
  },
  {
    section: 'Miscellaneous',
    field: 'Number of Grants submitted',
    simple: false,
    intermediate: false,
    detailed: true,
    type: 'number',
    value: '',
    placeholder: '0',
    description: 'Track grant submissions when the project uses grant-led delivery.',
  },
].map((field) => ({ ...field, id: slugifyPlanField(`${field.section}-${field.field}`), mandatory: Boolean(field.mandatory) }));

const projectPlanSectionFieldGroups: Record<string, ProjectPlanFieldGroupConfig[]> = {
  'Project Setup': [
    { title: 'Project identity', description: 'Core setup fields used to classify and route the project plan.', fields: ['Project name', 'Description', 'Category', 'Project Source', 'Is the Project Mandatory', 'Portfolio / Program', 'Governance Board(s)/Forum(s)'] },
    { title: 'Ownership and governance', description: 'People and forums accountable for delivery, change, and PMO coordination.', fields: ['Business Unit', 'Project Initiator', 'Project Director', 'Project Manager', 'Senior User', 'Delivery Manager', 'PMO Contact', 'Change Manager', 'Senior Supplier'] },
  ],
  Overview: [
    { title: 'Case for change', description: 'Why this project exists and what it is expected to achieve.', fields: ['Opportunity or Problem Statement', 'Business Drivers', 'Driver for change / Analysis undertaken', 'Outcome', 'AI component'] },
    { title: 'Strategic alignment', description: 'Objectives, capabilities, and services linked to the plan.', fields: ['Project Alignment (Objectives)', 'Link Capabilities', 'Link Services'] },
  ],
  'Schedule & Scope': [
    { title: 'Dates and stage', description: 'Baseline, forecast, and lifecycle position.', fields: ['Baseline Start date', 'Baseline End date', 'Forecast Start date', 'Forecast End date', 'Stages'] },
    { title: 'Scope and delivery products', description: 'Milestones, boundaries, deliverables, management products, and WBS.', fields: ['Milestones', 'In Scope', 'Out of Scope', 'End Product (Deliverables)', 'Management Product', 'Detailed WBS'] },
  ],
  Budget: [
    { title: 'Baseline and forecast', description: 'Financial baseline and current forecast by funding type.', fields: ['CAPEX Baseline (FY)', 'OPEX Baseline (FY)', 'CAPEX Forecast (FY)', 'OPEX Forecast (FY)'] },
    { title: 'Funding and controls', description: 'Funding source, monthly phasing, and budget governance rules.', fields: ['Funding Sources', 'Monthly Budget Detail', 'Budget Rules'] },
  ],
  Benefits: [{ title: 'Benefits register', description: 'Benefits, ownership, and realization status.', fields: ['Benefits Register'] }],
  Risk: [{ title: 'Risk register', description: 'Threats, ownership, and current exposure.', fields: ['Risks Register'] }],
  Issues: [{ title: 'Issues register', description: 'Open issues and decisions that need active management.', fields: ['Issues Register'] }],
  'Change Impact': [{ title: 'Change impact assessment', description: 'Operational impact, audience readiness, and adoption ownership.', fields: ['Change Impact Assessment'] }],
  'Related Links': [{ title: 'Documents and links', description: 'Evidence, reference documents, and supporting URLs.', fields: ['Related Links / Documents'] }],
  Resource: [{ title: 'Resource plan', description: 'Roles, owners, and planned allocation.', fields: ['Resource Plan'] }],
  Dependency: [{ title: 'Project dependencies', description: 'Upstream and downstream project relationships.', fields: ['Predecessor Project(s)', 'Successor Project(s)'] }],
  Miscellaneous: [
    {
      title: 'Legacy pressure',
      description: 'Legacy system, ICT, and maintenance considerations that only matter when the project needs extra context.',
      fields: ['Old and Unsupportable Systems', 'High Maintenance Cost', 'Out of Scope (legacy)', 'ICT Component'],
    },
    {
      title: 'Assurance tracking',
      description: 'Assurance counts, ADEO status, grants, and admin commentary used for extended reporting.',
      fields: [
        'Number of Assurance/Compliance Reviews Completed',
        'Number of Recommendations Open',
        'Number of Recommendations Closed',
        'ADEO Status',
        'Commentary of admins',
        'Number of Grants submitted',
      ],
    },
  ],
};

const dependencyRegisterConfigs: Record<DependencyRegisterKey, DependencyRegisterConfig> = {
  predecessor: {
    key: 'predecessor',
    fieldName: 'Predecessor Project(s)',
    title: 'Predecessor dependencies',
    description: 'Projects that must land first before this plan can move safely.',
    actionLabel: 'Add predecessor',
    emptyTitle: 'No predecessor dependencies yet',
    emptyBody: 'Track upstream projects, baseline timing, and impact once another initiative becomes a delivery blocker for this work.',
    projectPlaceholder: 'Select predecessor project',
    impactPlaceholder: 'Select predecessor impact',
    dependentProductPlaceholder: 'Select dependent product',
    projectOptions: ['Data source onboarding', 'Integration readiness', 'Commercial approval track', 'Grant intake refresh'],
    impactOptions: ['Quality & timing risk', 'Schedule dependency', 'Resource dependency', 'Compliance dependency'],
    dependentProductOptions: ['Capability data model', 'Discovery pack', 'Portal readiness plan', 'Governance checkpoint'],
    rows: [
      {
        id: 'dependency-predecessor-1',
        project: 'Data source onboarding',
        impact: 'Quality & timing risk',
        dependentProduct: 'Capability data model',
        baselineStart: '02 Mar 2026',
        baselineEnd: '17 Apr 2026',
        projectManager: 'Muna Hassan',
        nature: 'Foundational data onboarding must finish before discovery, capability mapping, and quality reviews can begin.',
        status: 'Tracking',
      },
    ],
    draft: {
      project: '',
      impact: '',
      dependentProduct: '',
      baselineStart: '',
      baselineEnd: '',
      projectManager: '',
      nature: '',
    },
  },
  successor: {
    key: 'successor',
    fieldName: 'Successor Project(s)',
    title: 'Successor dependencies',
    description: 'Downstream projects or products that depend on this plan finishing well.',
    actionLabel: 'Add successor',
    emptyTitle: 'No successor dependencies yet',
    emptyBody: 'Use this area for follow-on projects, downstream products, or handoffs that should start after this plan closes its work.',
    projectPlaceholder: 'Select successor project',
    impactPlaceholder: 'Select successor impact',
    dependentProductPlaceholder: 'Select dependent product',
    projectOptions: ['Research portal rollout', 'Partner activation wave', 'Grant reporting release', 'Service handoff sprint'],
    impactOptions: ['Delivery sequencing', 'Adoption dependency', 'Benefits dependency', 'Readiness dependency'],
    dependentProductOptions: ['Research portal rollout', 'Partner enablement pack', 'Grant reporting dashboard', 'Service transition plan'],
    rows: [],
    draft: {
      project: '',
      impact: '',
      dependentProduct: '',
      baselineStart: '',
      baselineEnd: '',
      projectManager: '',
      nature: '',
    },
  },
};

const changeImpactConfig: ChangeImpactConfig = {
  fieldName: 'Change Impact Assessment',
  title: 'Change impact register',
  description: 'Capture which audience is affected, how strong the impact is, and the adoption response needed before delivery friction appears.',
  actionLabel: 'Add change impact',
  emptyTitle: 'No change impacts captured yet',
  emptyBody: 'When a process, stakeholder group, or operating model will feel this project, log it here so change planning starts before the impact turns into delivery churn.',
  categoryPlaceholder: 'Select change impact category',
  stakeholderPlaceholder: 'Select stakeholder impacted',
  levelPlaceholder: 'Select level of impact',
  strategyPlaceholder: 'Type a change strategy',
  categoryOptions: ['Process change', 'Technology change', 'Policy or governance', 'People and roles', 'Data and reporting'],
  stakeholderOptions: ['PMO and leadership', 'Project delivery team', 'Business users', 'Shared services', 'External partners'],
  levelOptions: ['High', 'Medium', 'Low'],
  rows: [],
  draft: {
    category: '',
    stakeholder: '',
    level: '',
    comment: '',
    strategyInput: '',
    strategies: [],
  },
};

const relatedLinkConfig: RelatedLinkConfig = {
  fieldName: 'Related Links / Documents',
  title: 'Documents and links',
  description: 'Keep the project evidence pack, source links, and supporting references in one easy-to-open list.',
  actionLabel: 'Add related link',
  emptyTitle: 'No related links added yet',
  emptyBody: 'Add source packs, approvals, trackers, or reference documents here so reviewers can open the right evidence without hunting across tools.',
  namePlaceholder: 'Enter link name',
  descriptionPlaceholder: 'Add description',
  documentPlaceholder: 'Paste document link',
  rows: [],
  draft: {
    name: '',
    description: '',
    documentLink: '',
  },
};

const resourcePlanConfig: ResourcePlanConfig = {
  fieldName: 'Resource Plan',
  title: 'Resource plan',
  description: 'People, sourcing, and FTE assumptions needed to deliver this project.',
  actionLabel: 'Add resource',
  emptyTitle: 'No resources added yet',
  emptyBody: 'Start with the core role, business unit, and FTE need so planning and staffing conversations begin with a clear baseline.',
  resourcePlaceholder: 'Select resource role',
  resourceTypePlaceholder: 'Select resource type',
  impactPlaceholder: 'Select impact level',
  businessUnitPlaceholder: 'Select business unit',
  ftePlaceholder: 'Type FTE count',
  resourceOptions: ['Project Manager', 'Business Analyst', 'Data Steward', 'Delivery Lead', 'QA Analyst', 'Change Manager'],
  resourceTypeOptions: ['Internal FTE', 'Shared resource', 'External vendor', 'Contractor'],
  impactOptions: ['Critical', 'High', 'Medium', 'Low'],
  businessUnitOptions: ['Research Office', 'Strategy', 'Technology', 'Corporate Services'],
  rows: [],
  draft: {
    resource: '',
    resourceType: '',
    impact: '',
    businessUnit: '',
    fteCount: '',
    baselineStart: '',
    baselineEnd: '',
    comments: '',
  },
};

const benefitPlanConfig: BenefitPlanConfig = {
  fieldName: 'Benefits Register',
  title: 'Benefits register',
  description: 'Capture the value this project is expected to create, who owns it, and when realization should be visible.',
  actionLabel: 'Add benefit',
  emptyTitle: 'No benefits captured yet',
  emptyBody: 'Start with the first outcome this project should unlock. Add the benefit statement, owner, and realization timing so the team can track value as delivery moves forward.',
  benefitTypePlaceholder: 'Select benefit type',
  benefitCategoryPlaceholder: 'Select benefit category',
  ownerPlaceholder: 'Select benefit owner',
  benefitTypeOptions: ['Strategic benefit', 'Operational benefit', 'Financial benefit', 'Customer benefit', 'Compliance benefit'],
  benefitCategoryOptions: ['Cost Avoidance', 'Efficiency Gain', 'Service Quality', 'Risk Reduction', 'Revenue Protection'],
  ownerOptions: ['Research Leads Forum', 'PMO Desk', 'Fatima Ali', 'Muna Hassan', 'Delivery Office', 'Strategy Office'],
  rows: [],
  draft: {
    benefitType: '',
    category: 'Cost Avoidance',
    benefitName: '',
    description: '',
    owner: '',
    realizationDate: '',
  },
};

const issuePlanConfig: IssuePlanConfig = {
  fieldName: 'Issues Register',
  title: 'Issues register',
  description: 'Track blockers, open decisions, and delivery problems so ownership and next action are visible without opening another tool.',
  actionLabel: 'Add issue',
  emptyTitle: 'No issues logged yet',
  emptyBody: 'When a blocker, dependency problem, or unresolved decision appears, capture it here so the team can assign ownership and drive a resolution before the plan slows down.',
  issueTypePlaceholder: 'Select issue type',
  ownerPlaceholder: 'Select owner',
  issueTypeOptions: ['Scope issue', 'Schedule issue', 'Budget issue', 'Decision required', 'Dependency issue', 'Resource issue', 'Technical issue'],
  criticalityOptions: ['Low', 'Medium', 'High', 'Critical'],
  statusOptions: ['Open', 'In Progress', 'Pending Decision', 'Resolved', 'Closed'],
  ownerOptions: ['PMO Desk', 'Muna Hassan', 'Fatima Ali', 'Khalid Omar', 'Delivery Office', 'Change team'],
  rows: [],
  draft: {
    issueType: '',
    criticality: 'Low',
    issue: '',
    description: '',
    resolution: '',
    status: 'Open',
    owner: '',
    dateRaised: '2026-05-14',
    dueDate: '',
    dateClosed: '',
  },
};

function slugifyPlanField(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const guidedTourSteps: GuidedTourStep[] = [
  {
    target: 'project-switch',
    title: 'Choose your working scope',
    body: 'Start with all assigned projects for a portfolio scan, then switch into a single project when you need detail.',
    daily: 'Daily PM move: check what needs attention across every project before going deep.',
  },
  {
    target: 'frontdoor-actions',
    title: 'Open the right workspace quickly',
    body: 'Use Workspaces for project rooms and Learning Hub for playbooks, templates, and governance guidance.',
    daily: 'Use these when you need context before acting on a dependency, risk, or stage gate.',
  },
  {
    target: 'workspace-tabs',
    title: 'Move between work and lifecycle views',
    body: 'Actions is your day-to-day board. Stages shows where each project sits in its lifecycle and what gate evidence is needed.',
    daily: 'Start in Actions, then use Stages when a gate submission is due.',
  },
  {
    target: 'action-board',
    title: 'Clear the daily action board',
    body: 'Overdue, this week, and upcoming lanes organize what needs your attention. Filters help isolate reports, risks, benefits, and dependencies.',
    daily: 'Work left to right: overdue first, this week next, upcoming last.',
  },
  {
    target: 'create-psr',
    title: 'Create or update a PSR',
    body: 'Report actions open the PSR drawer where you update status, scope, trends, commentary, and reportable evidence.',
    daily: 'When the weekly report is due, open the PSR, review the sections, save the draft, and submit when ready.',
  },
  {
    target: 'right-report-widget',
    title: 'Watch reporting trends',
    body: 'The reporting widget shows recent PSR signals and gives you a fast create action for each project.',
    daily: 'Use it to spot off-track reports before they become escalations.',
  },
  {
    target: 'side-navigation',
    title: 'Navigate the PM console',
    body: 'The left rail keeps core spaces one click away: workspace, rooms, reports, messages, help, and logout.',
    daily: 'Use it when you need to leave the front door without losing the project context.',
  },
];

const timelineItems = [
  { date: '2026-05-04', label: 'PMO pack', tone: 'green', project: 'PMO Capability', kind: 'management-product' },
  { date: '2026-05-06', label: 'Benefit baseline', tone: 'green', project: 'Vision 2030', kind: 'benefit' },
  { date: '2026-05-09', label: 'Status report', tone: 'red', project: 'Vision 2030', kind: 'report' },
  { date: '2026-05-10', label: 'Budget risk', tone: 'red', project: 'NEOM Integration', kind: 'risk' },
  { date: '2026-05-15', label: 'Forum pack', tone: 'neutral', project: 'PMO Capability', kind: 'management-product' },
  { date: '2026-05-19', label: 'API dependency', tone: 'red', project: 'Smart City Alpha', kind: 'dependency' },
  { date: '2026-05-22', label: 'Product evidence', tone: 'neutral', project: 'Vision 2030', kind: 'end-product' },
  { date: '2026-05-25', label: 'CSAT target', tone: 'blue', project: 'Smart City Alpha', kind: 'benefit' },
  { date: '2026-05-29', label: 'Benefits review', tone: 'blue', project: 'Smart City Alpha', kind: 'benefit' },
];

const reportStatusHistory = [
  { project: 'UAE Research Map', dueLabel: 'On track', dueTone: 'green', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'submitted' }] },
  { project: 'Vision 2030', dueLabel: 'Overdue 5 days', dueTone: 'red', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'overdue' }] },
  { project: 'NEOM Integration', dueLabel: 'Due today', dueTone: 'amber', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'due' }] },
  { project: 'Smart City Alpha', dueLabel: 'On track', dueTone: 'green', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'submitted' }] },
  { project: 'PMO Capability', dueLabel: 'Due this week', dueTone: 'amber', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'draft' }] },
  { project: 'Counter Terrorism Operations', dueLabel: 'Overdue 2 days', dueTone: 'red', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'attention' }, { label: 'May', status: 'overdue' }] },
];

const reportCreationDetails: Record<string, ReportCreationDetail> = {
  'UAE Research Map': {
    intervalStart: '29/05/2026',
    intervalEnd: '29/06/2026',
    intervalStatus: 'Not created',
    stage: 'Initiation',
    state: 'Active',
    overallTrend: 'Improving',
    progress: 20,
    baselineEnd: '31/12/2026',
    forecastEnd: '31/12/2026',
    comments: 'Initiation is active. Scope, stakeholder alignment, and plan evidence need to be captured for the first reporting cycle.',
    achievements: 'Project assignment accepted. Initial outcomes, capabilities, and sponsor context are being drafted.',
    planned: 'Complete baseline planning, confirm research owners, and prepare initiation gate evidence for PMO review.',
  },
  'Vision 2030': {
    intervalStart: '30/04/2026',
    intervalEnd: '29/05/2026',
    intervalStatus: 'Not created',
    stage: 'Execution',
    state: 'Active',
    overallTrend: 'Improving',
    progress: 11.6,
    baselineEnd: '31/12/2026',
    forecastEnd: '31/12/2026',
    comments: 'Delivery remains active. Latest steering risks and benefits evidence need to be reflected before submission.',
    achievements: 'Benefits baseline attached. Sponsor note drafted. Status report evidence is pending final review.',
    planned: 'Confirm sponsor sign-off, close RAID updates, and prepare next-stage owners for the execution checkpoint.',
  },
  'NEOM Integration': {
    intervalStart: '30 Apr 2026',
    intervalEnd: '29 May 2026',
    intervalStatus: 'Not created',
    stage: 'Planning',
    state: 'Active',
    overallTrend: 'Needs attention',
    progress: 45,
    baselineEnd: '30 Sep 2026',
    forecastEnd: '15 Oct 2026',
    comments: 'Budget response and dependency reset are the main items for this reporting period.',
    achievements: 'Dependency owner identified. Finance approval route confirmed.',
    planned: 'Update integration plan, attach risk response, and brief the steering group on revised dates.',
  },
  'Smart City Alpha': {
    intervalStart: '06 May 2026',
    intervalEnd: '19 May 2026',
    intervalStatus: 'Draft due',
    stage: 'Execution',
    state: 'Active',
    overallTrend: 'Stable',
    progress: 82,
    baselineEnd: '31 Mar 2027',
    forecastEnd: '31 Mar 2027',
    comments: 'Pilot evidence and benefits owner decisions are ready for the report.',
    achievements: 'Acceptance criteria checked. API dependency closure evidence uploaded.',
    planned: 'Complete benefits review and prepare the next pilot readiness pack.',
  },
  'PMO Capability': {
    intervalStart: '01 May 2026',
    intervalEnd: '31 May 2026',
    intervalStatus: 'Draft due',
    stage: 'Planning',
    state: 'Active',
    overallTrend: 'Stable',
    progress: 64,
    baselineEnd: '31 Dec 2026',
    forecastEnd: '31 Dec 2026',
    comments: 'Forum pack progress and rollout risks are ready for the next management update.',
    achievements: 'Training audience confirmed. Playbook draft linked.',
    planned: 'Publish rollout pack and confirm PMO forum actions.',
  },
  'Counter Terrorism Operations': {
    intervalStart: '30 Apr 2026',
    intervalEnd: '29 May 2026',
    intervalStatus: 'Not created',
    stage: 'Execution',
    state: 'Active',
    overallTrend: 'Declining',
    progress: 58,
    baselineEnd: '30 Nov 2025',
    forecastEnd: '15 Jun 2026',
    comments: 'Delivery status needs an exception update before PMO review.',
    achievements: 'Operational readiness checkpoint completed with follow-up actions.',
    planned: 'Reset the recovery plan, update the RAID log, and confirm revised completion evidence.',
  },
};

const stageDefinitions = [
  { id: 'initiation', label: 'Initiation', gate: 'Initiation gate' },
  { id: 'planning', label: 'Planning', gate: 'Planning gate' },
  { id: 'execution', label: 'Execution', gate: 'Execution gate' },
  { id: 'closure', label: 'Closure', gate: 'Closure gate' },
];

const stageProfiles = [
  {
    project: 'Vision 2030',
    currentStage: 2,
    tone: 'green',
    gateDue: 'Jun 12',
    gateDone: 3,
    gateTotal: 5,
    checkpoint: 'Benefits baseline and status report evidence',
    checklist: ['Scope narrative updated', 'RAID log reviewed', 'Benefits baseline attached', 'Sponsor sign-off drafted', 'Next-stage owners assigned'],
  },
  {
    project: 'UAE Research Map',
    currentStage: 0,
    tone: 'amber',
    gateDue: 'Jun 12',
    gateDone: 2,
    gateTotal: 5,
    checkpoint: 'Project identity, stakeholder scope, and initiation evidence',
    checklist: ['Project identity confirmed', 'Stakeholder scope drafted', 'Initial RAID log created', 'Sponsor route identified', 'Planning owners assigned'],
  },
  {
    project: 'NEOM Integration',
    currentStage: 1,
    tone: 'amber',
    gateDue: 'May 24',
    gateDone: 2,
    gateTotal: 5,
    checkpoint: 'Budget response and dependency reset',
    checklist: ['Commercial risk response added', 'Dependency owner confirmed', 'Integration plan refreshed', 'Finance approval requested', 'Steering note prepared'],
  },
  {
    project: 'Smart City Alpha',
    currentStage: 2,
    tone: 'blue',
    gateDue: 'May 29',
    gateDone: 4,
    gateTotal: 5,
    checkpoint: 'Product evidence and benefits owner response',
    checklist: ['Pilot evidence uploaded', 'API dependency closed', 'Benefits owner confirmed', 'Acceptance criteria checked', 'Go-forward decision captured'],
  },
  {
    project: 'PMO Capability',
    currentStage: 1,
    tone: 'green',
    gateDue: 'May 15',
    gateDone: 3,
    gateTotal: 4,
    checkpoint: 'Forum pack and rollout plan',
    checklist: ['Forum pack complete', 'Training audience confirmed', 'Playbook draft linked', 'Rollout risks logged'],
  },
];

type StageDefinition = (typeof stageDefinitions)[number];
type StageProfile = (typeof stageProfiles)[number];
type StageGateStatus = 'complete' | 'current' | 'upcoming';

interface StageGateContext {
  profile: StageProfile;
  stage: StageDefinition;
  stageIndex: number;
  status: StageGateStatus;
  checkedCount: number;
}

interface Pm101Step {
  title: string;
  body: string;
  iconAsset: string;
  decor: string;
  decorAssets: string[];
  footerLabel?: string;
  footerValue?: string;
  footerAction?: string;
  footerIconOnly?: boolean;
}

const projectReportsRows = [
  { period: 'Initiation', owner: 'Jordan Lee', date: '01/15/2024', budget: '$2.5M/$4.3M', priority: 'normal' },
  { period: 'Planning', owner: 'Alex Adams', date: '03/22/2026', budget: '$3.1M/$3.1M', priority: 'normal' },
  { period: 'Execution', owner: 'Taylor Reed', date: '07/04/2023', budget: '$4.0M/$4.0M', priority: 'high' },
  { period: 'On - Hold', owner: 'Jordan Blake', date: '11/30/2025', budget: '$2.2M/$2.2M', priority: 'paused' },
  { period: 'Initiation', owner: 'Taylor Reed', date: '09/19/2024', budget: '$2.9M/$2.9M', priority: 'normal' },
  { period: 'Execution', owner: 'Morgan Lee', date: '05/11/2027', budget: '$3.5M/$3.5M', priority: 'normal' },
  { period: 'Planning', owner: 'Casey Smith', date: '02/14/2023', budget: '$2.2M/$2.2M', priority: 'normal' },
];

const projectReportTrendPoints = [
  { date: '20/01/2025', tone: 'green', icon: 'check' },
  { date: '20/01/2025', tone: 'green', icon: 'check' },
  { date: '20/01/2025', tone: 'green', icon: 'check' },
  { date: '20/12/2024', tone: 'red', icon: 'close' },
  { date: '20/11/2024', tone: 'amber', icon: 'status' },
];

const pm101Steps: Pm101Step[] = [
  {
    title: 'Project assigned',
    body: 'You’ll receive a PMO assignment notification.',
    iconAsset: './assets/pm101/icon-1.svg',
    decor: 'burst',
    decorAssets: ['./assets/pm101/decor-1.svg'],
    footerLabel: 'Project assigned on',
    footerValue: 'Jul 25, 2026',
  },
  {
    title: 'Build project plan',
    body: 'Set scope, timeline, risks, and dependencies.',
    iconAsset: './assets/pm101/icon-2.svg',
    decor: 'rings',
    decorAssets: ['./assets/pm101/decor-2.svg'],
    footerAction: 'Create project plan',
  },
  {
    title: 'Manage delivery',
    body: 'Track milestones, issues, and dependencies.',
    iconAsset: './assets/pm101/icon-3.svg',
    decor: 'plus',
    decorAssets: ['./assets/pm101/decor-3-group-1.svg', './assets/pm101/decor-3-group-2.svg', './assets/pm101/decor-3-group-3.svg', './assets/pm101/decor-3-group-4.svg'],
    footerAction: 'Go to workspaces',
  },
  {
    title: 'Report progress',
    body: 'Submit PSRs and maintain delivery health.',
    iconAsset: './assets/pm101/icon-4.svg',
    decor: 'loops',
    decorAssets: ['./assets/pm101/decor-4.svg'],
    footerAction: 'Create Report',
  },
  {
    title: 'Access Learning Hub',
    body: 'Understand & align with latest PIF guidelines.',
    iconAsset: './assets/pm101/icon-5.svg',
    decor: 'hex',
    decorAssets: ['./assets/pm101/decor-5.svg'],
    footerIconOnly: true,
  },
];

const QUICK_LINK_PIN_LIMIT = 10;
const QUICK_LINK_PAGE_SIZE = 10;
const QUICK_LINK_STORAGE_KEY = 'tasama.quickLinks.pinned';
const WORKSPACE_TABLE_COLUMN_STORAGE_KEY = 'tasama.workspaceTable.visibleColumns';
const WORKSPACE_TABLE_COLUMN_MOTION_MS = 280;
const defaultPinnedQuickLinkIds = ['project-plan', 'wbs'];
const workspaceTableColumns: WorkspaceTableColumn[] = [
  { id: 'project', label: 'Project Name' },
  { id: 'stage', label: 'Stage' },
  { id: 'trend', label: 'Report Status Trend' },
  { id: 'manager', label: 'Project Manager' },
  { id: 'baselineStart', label: 'Baseline Start Date' },
  { id: 'baselineEnd', label: 'Baseline End Date' },
  { id: 'budget', label: 'Budget Utilised' },
  { id: 'status', label: 'Status' },
];
const defaultWorkspaceTableColumnIds: WorkspaceTableColumnId[] = ['project', 'stage', 'trend', 'manager', 'baselineStart', 'budget'];

@Component({
  selector: 'app-pm-console-content',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas" [class.workspaces-canvas]="selectedPage === 'workspaces'" [class.wbs-canvas]="selectedPage === 'wbs'" [class.project-plan-canvas]="selectedPage === 'project-plan'" [class.playground-canvas]="selectedPage === 'playground'" [class.unassigned-canvas]="frontDoorMode === 'unassigned'" [class.pm101-locked-canvas]="onboardingPm101Locked || isPm101OnboardingWorkspaceFlow">
      @switch (selectedPage) {
        @case ('workspaces') {
          <section class="pm-projects-page" [class.table-mode]="!isWorkspaceCardMode" [class.card-mode]="isWorkspaceCardMode" [attr.aria-label]="workspaceRegisterAriaLabel">
            <div class="pm-projects-shell">
              <div class="pm-register-tabs" role="tablist" aria-label="Workspace registers">
                @for (tab of workspaceRegisterTabs; track tab.id) {
                  <button class="pm-register-tab" [class.active]="workspaceRegister === tab.id" type="button" role="tab" [attr.aria-selected]="workspaceRegister === tab.id" [style.width]="workspaceRegisterTabWidth(tab.id)" (click)="setWorkspaceRegister(tab.id)">
                    <span class="pm-register-tab-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(tab.icon)"></i></span></span>
                    <span class="pm-register-tab-copy"><strong>{{ tab.label }}</strong></span>
                  </button>
                }
              </div>

              <div class="pm-projects-board">
                <div class="pm-projects-board-body">
                @if (workspaceRegister === 'projects' && workspaceDisplay === 'table') {
                  <div class="pm-project-table-view">
                    <div class="pm-project-table-stats" aria-label="Project status summary">
                      @for (stat of workspaceStats; track stat.label) {
                        <article class="pm-project-table-stat {{ stat.tone }}">
                          <span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(stat.icon)"></i></span></span>
                          <div><small>{{ stat.label }}</small><strong>{{ stat.value }}</strong></div>
                        </article>
                      }
                    </div>
                    <div class="pm-project-table-toolbar">
                      <span>Items: {{ workspaceTableProjects.length }}</span>
                      <div>
                        <button class="pm-table-tool square" type="button" aria-label="Search projects"><span class="icon" aria-hidden="true"><i data-lucide="search"></i></span></button>
                        <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="filter"></i></span><span>Filter</span></button>
                        <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="sliders-horizontal"></i></span><span>Group by</span></button>
                        <div class="pm-project-view-toggle" aria-label="Project display">
                          <button type="button" aria-label="Card view" aria-pressed="false" (click)="setWorkspaceDisplay('cards')"><span class="icon" aria-hidden="true"><i data-lucide="layout-grid"></i></span></button>
                          <button class="active" type="button" aria-label="List view" aria-pressed="true" (click)="setWorkspaceDisplay('table')"><span class="icon" aria-hidden="true"><i data-lucide="list"></i></span></button>
                        </div>
                        <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="download"></i></span><span>Export</span></button>
                        <button class="pm-table-add-project" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span><span>Add Project</span></button>
                        <div class="pm-table-settings-menu" data-workspace-columns-menu>
                          <button class="pm-table-tool square" type="button" aria-label="Table settings" aria-haspopup="dialog" [attr.aria-expanded]="workspaceColumnMenuOpen" aria-controls="workspace-column-picker" (click)="toggleWorkspaceColumnMenu()"><span class="icon" aria-hidden="true"><i data-lucide="settings"></i></span></button>
                          @if (workspaceColumnMenuOpen) {
                            <section class="pm-table-column-popover" id="workspace-column-picker" role="dialog" aria-label="Choose visible table columns">
                              <div class="pm-table-column-popover-head">
                                <div>
                                  <strong>Visible columns</strong>
                                  <small>{{ visibleWorkspaceTableColumns.length }} of {{ workspaceTableColumns.length }} selected</small>
                                </div>
                                <button class="pm-table-column-reset" type="button" [disabled]="visibleWorkspaceTableColumns.length === workspaceTableColumns.length" (click)="resetWorkspaceTableColumns()">Reset</button>
                              </div>
                              <div class="pm-table-column-options" role="group" aria-label="Workspace table columns">
                                @for (column of workspaceTableColumns; track column.id) {
                                  <label class="pm-table-column-option" [class.is-locked]="isWorkspaceTableColumnLocked(column.id)">
                                    <input type="checkbox" [checked]="isWorkspaceTableColumnVisible(column.id)" [disabled]="isWorkspaceTableColumnLocked(column.id)" (change)="toggleWorkspaceTableColumn(column.id, $event)" />
                                    <span>{{ column.label }}</span>
                                  </label>
                                }
                              </div>
                              <p class="pm-table-column-hint">Keep at least one column visible in the table.</p>
                            </section>
                          }
                        </div>
                      </div>
                    </div>
                    <div class="pm-project-table-scroll" tabindex="0">
                      <table class="pm-project-table pm-workspace-project-table" [style.--workspace-table-min-width.px]="workspaceTableMinWidth()">
                        <thead>
                          <tr>
                            <th class="pm-table-check-cell"><input type="checkbox" aria-label="Select all projects" /></th>
                            @for (column of renderedWorkspaceTableColumns; track column.id) {
                              <th class="pm-table-column-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)">
                                <div class="pm-table-column-frame">
                                  <span class="pm-table-column-header">{{ column.label }}</span>
                                </div>
                              </th>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          @for (project of workspaceTableProjects; track project.id) {
                            <tr>
                              <td class="pm-table-check-cell"><input type="checkbox" [attr.aria-label]="'Select ' + project.title" /></td>
                              @for (column of renderedWorkspaceTableColumns; track column.id) {
                                @switch (column.id) {
                                  @case ('project') {
                                    <td class="pm-table-column-cell pm-table-project-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><button type="button" (click)="openProject(project.id)"><span>{{ project.code }}</span><strong>{{ project.title }}</strong></button></div></td>
                                  }
                                  @case ('stage') {
                                    <td class="pm-table-column-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><span class="pm-table-stage">{{ project.stage }}</span></div></td>
                                  }
                                  @case ('trend') {
                                    <td class="pm-table-column-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><div class="pm-table-trend" [attr.aria-label]="project.title + ' report status trend'">@for (tone of project.trend; track $index) { <span class="pm-table-trend-dot {{ tone }}" role="img" [attr.aria-label]="trendLabel(tone)" [attr.title]="trendLabel(tone)"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(tone)"></i></span></span> }</div></div></td>
                                  }
                                  @case ('manager') {
                                    <td class="pm-table-column-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><span class="pm-table-manager"><i>{{ project.managerInitials }}</i>{{ project.manager }}</span></div></td>
                                  }
                                  @case ('baselineStart') {
                                    <td class="pm-table-column-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><span class="pm-table-column-text">{{ project.baselineStart }}</span></div></td>
                                  }
                                  @case ('baselineEnd') {
                                    <td class="pm-table-column-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><span class="pm-table-column-text">{{ project.baselineEnd }}</span></div></td>
                                  }
                                  @case ('budget') {
                                    <td class="pm-table-column-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><span class="pm-table-budget"><strong>{{ project.budgetUsed }}</strong><small>/ {{ project.budgetTotal }}</small></span></div></td>
                                  }
                                  @case ('status') {
                                    <td class="pm-table-column-cell pm-table-status-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><span class="pm-table-row-status {{ project.statusTone }}">{{ project.status }}</span></div></td>
                                  }
                                }
                              }
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                } @else if (workspaceRegister === 'projects') {
                  <div class="pm-project-table-toolbar pm-project-card-toolbar">
                    <span>Items: {{ workspaceProjectCards.length }}</span>
                    <div>
                      <button class="pm-table-tool square" type="button" aria-label="Search projects"><span class="icon" aria-hidden="true"><i data-lucide="search"></i></span></button>
                      <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="filter"></i></span><span>Filter</span></button>
                      <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="sliders-horizontal"></i></span><span>Group by</span></button>
                      <div class="pm-project-view-toggle" aria-label="Project display">
                        <button class="active" type="button" aria-label="Card view" aria-pressed="true" (click)="setWorkspaceDisplay('cards')"><span class="icon" aria-hidden="true"><i data-lucide="layout-grid"></i></span></button>
                        <button type="button" aria-label="List view" aria-pressed="false" (click)="setWorkspaceDisplay('table')"><span class="icon" aria-hidden="true"><i data-lucide="list"></i></span></button>
                      </div>
                      <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="download"></i></span><span>Export</span></button>
                      <button class="pm-table-add-project" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span><span>Add Project</span></button>
                      <button class="pm-table-tool square" type="button" aria-label="Card view settings"><span class="icon" aria-hidden="true"><i data-lucide="settings"></i></span></button>
                    </div>
                  </div>
                  <div class="pm-project-card-grid">
                    @for (project of workspaceProjectCards; track project.title + project.stage) {
                      <article class="pm-project-card" [class.draft]="project.draft">
                        <span class="pm-project-status {{ project.statusTone || 'neutral' }}">{{ project.draft ? 'Draft' : project.status }}</span>
                        <div class="pm-project-card-head"><span class="pm-project-code"><span class="icon" aria-hidden="true"><i data-lucide="folder"></i></span>{{ project.code }}</span><span class="pm-project-stage" [class.muted]="project.draft">{{ project.stage }}</span></div>
                        <h3>{{ project.title }}</h3>
                        @if (project.draft) {
                          <div class="pm-ai-analysis"><span>AI Insight Analysis</span><p>You've been assigned a new project. First step: create your project plan. PMO requires baseline submission within 4 weeks of assignment.</p></div>
                        } @else {
                          <div class="pm-project-metrics">
                            <div class="pm-project-metric"><span>Schedule</span><strong>{{ project.schedule }}% <small>complete</small></strong><div class="pm-project-progress" [style.--progress]="project.schedule + '%'"><i></i></div></div>
                            <div class="pm-project-metric pm-project-budget"><div class="pm-project-budget-ring" [style.--budget]="project.budget + '%'" aria-hidden="true"><i></i></div><span>Budget used</span><strong>{{ project.budgetUsed }} <small>/ {{ project.budgetTotal }}</small></strong><p>39%, well within threshold</p></div>
                          </div>
                        }
                        <div class="pm-project-footer"><span class="pm-project-due"><span class="icon" aria-hidden="true"><i data-lucide="history"></i></span><small>Next PSR due:</small><strong>{{ project.nextDue }}</strong></span><div class="pm-project-actions"><button class="pm-project-icon-button" type="button" (click)="openProject(project.title)" [attr.aria-label]="'Open ' + project.title + ' project plan'"><span class="icon" aria-hidden="true"><i data-lucide="eye"></i></span></button><button class="pm-project-primary" type="button" (click)="handleProjectCardAction(project)">{{ project.action }}</button></div></div>
                      </article>
                    }
                  </div>
                } @else if (workspaceRegister === 'benefits') {
                  <div class="pm-project-table-view">
                    <div class="pm-project-table-stats" aria-label="Benefit register summary">
                      @for (stat of benefitRegisterStats; track stat.label) {
                        <article class="pm-project-table-stat {{ stat.tone }}">
                          <span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(stat.icon)"></i></span></span>
                          <div><small>{{ stat.label }}</small><strong>{{ stat.value }}</strong></div>
                        </article>
                      }
                    </div>
                    <div class="pm-project-table-toolbar">
                      <span>Items: {{ visibleBenefitRegisterRows.length }}</span>
                      <div>
                        <button class="pm-table-tool square" type="button" aria-label="Search benefits"><span class="icon" aria-hidden="true"><i data-lucide="search"></i></span></button>
                        <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="filter"></i></span><span>Filter</span></button>
                        <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="download"></i></span><span>Export</span></button>
                        <button class="pm-table-add-project" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span><span>Add Benefit</span></button>
                      </div>
                    </div>
                    <div class="pm-project-table-scroll" tabindex="0">
                      <table class="pm-project-table pm-register-table">
                        <thead><tr><th>Benefit ID</th><th>Benefit</th><th>Linked Project</th><th>Owner</th><th>Target Date</th><th>KPI / Measure</th><th>Realization</th><th>Status</th></tr></thead>
                        <tbody>
                          @for (benefit of visibleBenefitRegisterRows; track benefit.id) {
                            <tr>
                              <td><span class="pm-table-code">{{ benefit.id }}</span></td>
                              <td class="pm-table-detail-cell"><strong>{{ benefit.benefit }}</strong></td>
                              <td>{{ benefit.project }}</td>
                              <td>{{ benefit.owner }}</td>
                              <td>{{ benefit.targetDate }}</td>
                              <td class="pm-table-detail-cell">{{ benefit.measure }}</td>
                              <td><span class="pm-table-row-status {{ benefit.realizationTone }}">{{ benefit.realization }}</span></td>
                              <td class="pm-table-status-cell"><span class="pm-table-row-status {{ benefit.statusTone }}">{{ benefit.status }}</span></td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                } @else {
                  <div class="pm-project-table-view">
                    <div class="pm-project-table-stats" aria-label="Risk register summary">
                      @for (stat of riskRegisterStats; track stat.label) {
                        <article class="pm-project-table-stat {{ stat.tone }}">
                          <span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(stat.icon)"></i></span></span>
                          <div><small>{{ stat.label }}</small><strong>{{ stat.value }}</strong></div>
                        </article>
                      }
                    </div>
                    <div class="pm-project-table-toolbar">
                      <span>Items: {{ visibleRiskRegisterRows.length }}</span>
                      <div>
                        <button class="pm-table-tool square" type="button" aria-label="Search risks"><span class="icon" aria-hidden="true"><i data-lucide="search"></i></span></button>
                        <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="filter"></i></span><span>Filter</span></button>
                        <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="download"></i></span><span>Export</span></button>
                        <button class="pm-table-add-project" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span><span>Add Risk</span></button>
                      </div>
                    </div>
                    <div class="pm-project-table-scroll" tabindex="0">
                      <table class="pm-project-table pm-register-table">
                        <thead><tr><th>Risk ID</th><th>Risk</th><th>Linked Project</th><th>Owner</th><th>Mitigation</th><th>Last Review</th><th>Exposure</th><th>Status</th></tr></thead>
                        <tbody>
                          @for (risk of visibleRiskRegisterRows; track risk.id) {
                            <tr>
                              <td><span class="pm-table-code">{{ risk.id }}</span></td>
                              <td class="pm-table-detail-cell"><strong>{{ risk.risk }}</strong></td>
                              <td>{{ risk.project }}</td>
                              <td>{{ risk.owner }}</td>
                              <td class="pm-table-detail-cell">{{ risk.mitigation }}</td>
                              <td>{{ risk.reviewDate }}</td>
                              <td><span class="pm-table-row-status {{ risk.exposureTone }}">{{ risk.exposure }}</span></td>
                              <td class="pm-table-status-cell"><span class="pm-table-row-status {{ risk.statusTone }}">{{ risk.status }}</span></td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
                </div>
              </div>
            </div>
          </section>
        }
        @case ('wbs') {
          <section class="wbs-page" aria-label="WBS Gantt">
            <div class="wbs-header"><button class="wbs-back" type="button" aria-label="Back to front door" (click)="navigate('workspace')"><span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span></button><div><span>Work breakdown structure</span><h1>{{ scopedProjectName }}</h1><p>Management products, milestones, and stage gates for delivery tracking.</p></div></div>
            <div class="wbs-shell">
              <div class="wbs-toolbar"><label><span class="icon" aria-hidden="true"><i data-lucide="search"></i></span><input type="search" placeholder="Search WBS" /></label><button type="button" class="active">Months</button><button type="button">Quarters</button></div>
              <div class="wbs-split">
                <div class="wbs-table"><div class="wbs-table-head"><span>Name</span><span>Owner</span><span>Progress</span></div>@for (item of wbsItems; track item.title) { <div class="wbs-table-row" [style.--wbs-level]="item.level"><span><i></i>{{ item.title }}</span><small>{{ item.owner }}</small><strong>{{ item.progress }}</strong></div> }</div>
                <div class="wbs-timeline"><div class="wbs-timeline-head">@for (month of months; track month) { <span>{{ month }}</span> }</div>@for (item of wbsItems; track item.title) { <div class="wbs-timeline-row"><span class="wbs-bar {{ item.tone }}" [style.left]="item.left" [style.width]="item.width">{{ item.title }}</span></div> }</div>
              </div>
            </div>
          </section>
        }
        @case ('project-plan') {
          <section
            class="project-plan-page plan-builder-page has-project-modebar"
            [class.simple-plan-mode]="projectPlanEntry === 'quick' && projectPlanDetailMode === 'simple'"
            [class.detailed-plan-mode]="projectPlanEntry === 'quick' && projectPlanDetailMode === 'detailed'"
            [class.report-plan-mode]="projectPlanEntry !== 'quick'"
            aria-label="Project plan"
          >
            <div class="project-plan-card-frame" [class.project-report-card-frame]="projectPlanEntry !== 'quick'" [class.project-secondary-card-frame]="projectPlanEntry === 'change-request' || projectPlanEntry === 'closure'">
              <header class="project-plan-hero plan-builder-hero project-scope-hero project-plan-card-hero">
                <img class="project-plan-hero-art" src="./assets/workspace-line-art.svg" alt="" aria-hidden="true" />
                <div class="project-plan-hero-inner">
                  <div class="project-plan-summary">
                    <div class="project-plan-title plan-builder-title">
                      <button class="project-plan-back" type="button" aria-label="Back to workspace" (click)="navigate('workspace')"><span class="icon" aria-hidden="true"><i data-lucide="arrow-left"></i></span></button>
                      <h1>{{ scopedProjectName }}</h1>
                    </div>
                    <div class="project-plan-meta"><span>Stage: <b class="blue">{{ projectPlanStage }}</b></span><span>State: <b class="green">Active</b></span><span>Plan: <b class="draft">Draft</b></span></div>
                  </div>
                  <div class="plan-builder-modebar project-modebar project-modebar-inline" aria-label="Project workspace mode">
                    <div class="plan-builder-mode-toggle project-mode-toggle">
                      <button [class.active]="projectPlanEntry === 'quick'" type="button" (click)="setProjectPlanEntry('quick')"><span class="icon" aria-hidden="true"><i data-lucide="folder"></i></span>Project Plan</button>
                      <button [class.active]="projectPlanEntry === 'reports'" type="button" (click)="setProjectPlanEntry('reports')"><span class="icon" aria-hidden="true"><i data-lucide="panels-top-left"></i></span>Reports</button>
                      <button [class.active]="projectPlanEntry === 'change-request'" type="button" (click)="setProjectPlanEntry('change-request')"><span class="icon" aria-hidden="true"><i data-lucide="chart-pie"></i></span>Change requests</button>
                      <button [class.active]="projectPlanEntry === 'closure'" type="button" (click)="setProjectPlanEntry('closure')"><span class="icon" aria-hidden="true"><i data-lucide="chart-pie"></i></span>Closure</button>
                    </div>
                  </div>
                </div>
              </header>
              @if (projectPlanEntry === 'quick') {
                <div class="project-plan-shell plan-builder-shell quick-plan-shell" [class.simple-plan-shell]="projectPlanDetailMode === 'simple'" [class.detailed-plan-shell]="projectPlanDetailMode === 'detailed'">
                  @if (projectPlanDetailMode === 'detailed') {
                    <aside class="project-plan-sections plan-builder-nav quick-plan-nav matrix-plan-nav" aria-label="Project plan sections">
                      @for (section of primaryProjectPlanSections; track section) {
                        <button [class.active]="projectPlanActiveSection === section" type="button" (click)="setProjectPlanSection(section)"><span>{{ section }}</span></button>
                      }
                      <button class="matrix-show-sections" [class.is-expanded]="projectPlanSectionsExpanded" type="button" (click)="toggleProjectPlanSections()" [attr.aria-expanded]="projectPlanSectionsExpanded">
                        <span class="matrix-show-sections-copy"><strong>Additional sections ({{ additionalProjectPlanSections.length }})</strong><small>{{ additionalProjectPlanSections.join(', ') }}</small></span>
                        <span class="matrix-show-sections-indicator" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="projectPlanSectionsExpanded ? 'minus' : 'plus'"></i></span></span>
                      </button>
                      @if (projectPlanSectionsExpanded) {
                        <div class="matrix-extra-sections">
                          @for (section of additionalProjectPlanSections; track section) {
                            <button class="detailed-only" [class.active]="projectPlanActiveSection === section" type="button" (click)="setProjectPlanSection(section)"><span>{{ section }}</span><small>Detailed</small></button>
                          }
                        </div>
                      }
                    </aside>
                  }
                  <main class="project-plan-content plan-builder-workspace quick-plan-workspace" [class.simple-plan-workspace]="projectPlanDetailMode === 'simple'" [class.detailed-plan-workspace]="projectPlanDetailMode === 'detailed'">
                    <div class="project-plan-content-modebar" [class.has-section-title]="true">
                      <h2>{{ projectPlanDetailMode === 'simple' ? 'Project Plan' : projectPlanActiveSection }}</h2>
                      <div class="project-plan-detail-toggle" role="tablist" aria-label="Project plan detail mode">
                        <button [class.active]="projectPlanDetailMode === 'simple'" type="button" role="tab" [attr.aria-selected]="projectPlanDetailMode === 'simple'" (click)="setProjectPlanDetailMode('simple')">Simple view</button>
                        <button [class.active]="projectPlanDetailMode === 'detailed'" type="button" role="tab" [attr.aria-selected]="projectPlanDetailMode === 'detailed'" (click)="setProjectPlanDetailMode('detailed')">Detailed view</button>
                      </div>
                    </div>
                    <div class="plan-builder-main quick-plan-main project-plan-matrix-main">
                      @if (projectPlanDetailMode === 'simple') {
                        <section class="project-plan-form-card plan-builder-card project-plan-matrix-card simple-plan-card">
                          <div class="simple-plan-sections">
                            @for (section of simplePlanSections; track section.title) {
                              <article class="matrix-field-group simple-plan-section-card simple-field-card" [class.read-only-card]="section.readOnly">
                                <div class="simple-field-card-head">
                                  <span class="simple-plan-section-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(section.icon)"></i></span></span>
                                  <span class="matrix-field-group-copy"><strong>{{ section.title }}</strong><small>{{ section.body }}</small></span>
                                </div>
                                <div class="matrix-field-group-grid simple-plan-section-fields">
                                  @for (field of section.fields; track field.label) {
                                    @if (section.readOnly) {
                                      <div class="simple-readonly-field" [class.wide]="field.wide">
                                        <span class="matrix-field-label">{{ field.label }}</span>
                                        <span class="simple-readonly-value" [class.has-avatar]="field.avatarInitials">
                                          @if (field.avatarInitials) { <span class="simple-person-avatar" aria-hidden="true">{{ field.avatarInitials }}</span> }
                                          <strong>{{ field.value }}</strong>
                                        </span>
                                      </div>
                                    } @else {
                                      @if (field.kind === 'table') {
                                        <article class="matrix-field matrix-field-table simple-field-control wide">
                                          <div class="matrix-register-head">
                                            <div>
                                              <span class="matrix-field-label">{{ field.label }} @if (field.mandatory) { <b>*</b> }</span>
                                              <small>{{ simplePlanTableConfig(field).description }}</small>
                                            </div>
                                            <button type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ simplePlanTableConfig(field).action }}</button>
                                          </div>
                                          <div class="matrix-register-table" role="table" [attr.aria-label]="field.label">
                                            <div class="matrix-register-row head" [class.columns-2]="simplePlanTableConfig(field).columns.length === 2" [class.columns-3]="simplePlanTableConfig(field).columns.length === 3" [class.columns-4]="simplePlanTableConfig(field).columns.length === 4" [class.columns-5]="simplePlanTableConfig(field).columns.length >= 5" role="row">
                                              @for (column of simplePlanTableConfig(field).columns; track column) { <span>{{ column }}</span> }
                                            </div>
                                            @for (row of simplePlanTableConfig(field).rows; track row[0]) {
                                              <div class="matrix-register-row" [class.columns-2]="simplePlanTableConfig(field).columns.length === 2" [class.columns-3]="simplePlanTableConfig(field).columns.length === 3" [class.columns-4]="simplePlanTableConfig(field).columns.length === 4" [class.columns-5]="simplePlanTableConfig(field).columns.length >= 5" role="row">
                                                @for (cell of row; track $index) { <span>@if ($index === row.length - 1) { <b>{{ cell }}</b> } @else { <ng-container>{{ cell }}</ng-container> }</span> }
                                              </div>
                                            }
                                          </div>
                                        </article>
                                      } @else if (field.kind === 'boolean') {
                                        <div class="matrix-field matrix-field-boolean simple-field-control">
                                          <span class="matrix-field-label">{{ field.label }} @if (field.mandatory) { <b>*</b> }</span>
                                          <div class="matrix-boolean" role="radiogroup" [attr.aria-label]="field.label">
                                            <label><input type="radio" [name]="field.label" [checked]="field.value === 'Yes'" /> <span>Yes</span></label>
                                            <label><input type="radio" [name]="field.label" [checked]="field.value !== 'Yes'" /> <span>No</span></label>
                                          </div>
                                        </div>
                                      } @else if (field.kind === 'select') {
                                        <label class="matrix-field matrix-field-select simple-field-control" [class.wide]="field.wide"><span class="matrix-field-label">{{ field.label }} @if (field.mandatory) { <b>*</b> }</span>
                                          <span class="matrix-select-wrap">
                                            <select [attr.aria-label]="field.label">
                                              @for (option of field.options || [field.value]; track option) { <option [selected]="option === field.value">{{ option }}</option> }
                                            </select>
                                            <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                          </span>
                                        </label>
                                      } @else if (field.kind === 'money') {
                                        <label class="matrix-field matrix-field-money simple-field-control" [class.wide]="field.wide"><span class="matrix-field-label">{{ field.label }} @if (field.mandatory) { <b>*</b> }</span>
                                          <span class="matrix-money-wrap"><small>SAR</small><input type="text" [value]="field.value" [attr.aria-label]="field.label" /></span>
                                        </label>
                                      } @else {
                                        <label class="matrix-field simple-field-control" [class.wide]="field.wide" [class.matrix-field-textarea]="field.kind === 'textarea'"><span class="matrix-field-label">{{ field.label }} @if (field.mandatory) { <b>*</b> }</span>
                                          @if (field.kind === 'textarea') { <textarea [value]="field.value" [attr.aria-label]="field.label"></textarea> } @else { <input [type]="field.kind || 'text'" [value]="field.value" [attr.aria-label]="field.label" /> }
                                        </label>
                                      }
                                    }
                                  }
                                </div>
                              </article>
                            }
                          </div>
                        </section>
                      } @else {
                        <section class="project-plan-form-card plan-builder-card project-plan-matrix-card detailed-plan-card">
                          <div class="project-plan-section-fields">
                            @if (projectPlanActiveSection === 'Overview') {
                              @let identitySection = projectPlanIdentityCard;
                              <article class="matrix-field-group simple-plan-section-card simple-field-card read-only-card detailed-plan-identity-card">
                                <div class="simple-field-card-head">
                                  <span class="simple-plan-section-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(identitySection.icon)"></i></span></span>
                                  <span class="matrix-field-group-copy"><strong>{{ identitySection.title }}</strong><small>{{ identitySection.body }}</small></span>
                                </div>
                                <div class="matrix-field-group-grid simple-plan-section-fields">
                                  @for (field of identitySection.fields; track field.label) {
                                    <div class="simple-readonly-field" [class.wide]="field.wide">
                                      <span class="matrix-field-label">{{ field.label }}</span>
                                      <span class="simple-readonly-value" [class.has-avatar]="field.avatarInitials">
                                        @if (field.avatarInitials) { <span class="simple-person-avatar" aria-hidden="true">{{ field.avatarInitials }}</span> }
                                        <strong>{{ field.value }}</strong>
                                      </span>
                                    </div>
                                  }
                                </div>
                              </article>
                            }
                            @if (projectPlanActiveSection === 'Benefits') {
                              @let register = activeBenefitPlan;
                              <section class="dependency-register-stack benefit-register-stack" aria-label="Benefits register">
                                <article class="benefit-agent-banner" aria-label="Benefit agent">
                                  <div class="benefit-agent-copy">
                                    <span class="benefit-agent-eyebrow"><img src="./assets/ai-spark-star.svg" alt="" aria-hidden="true" />AI assisted</span>
                                    <strong>Benefit Agent</strong>
                                    <p>Turn the case for change for {{ scopedProjectName }} into first-pass benefit statements, owners, and realization timing before you refine the register manually.</p>
                                  </div>
                                  <div class="benefit-agent-highlights" aria-label="Benefit agent capabilities">
                                    <span>Draft benefit statements</span>
                                    <span>Suggest categories</span>
                                    <span>Recommend owners</span>
                                  </div>
                                </article>

                                <article class="dependency-register-card benefit-register-card">
                                  <div class="dependency-register-head">
                                    <div class="dependency-register-copy">
                                      <span class="dependency-register-eyebrow">{{ register.fieldName }} <small>Benefit tracking</small></span>
                                      <strong>{{ register.title }}</strong>
                                      <small>{{ register.description }}</small>
                                    </div>
                                    <div class="dependency-register-actions">
                                      <span class="dependency-register-count">{{ benefitCountLabel(register) }}</span>
                                      @if (register.rows.length) {
                                        <button class="dependency-register-add" type="button" (click)="openBenefitDrawer()">
                                          <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ register.actionLabel }}
                                        </button>
                                      }
                                    </div>
                                  </div>

                                  @if (register.rows.length) {
                                    <div class="dependency-register-table-shell benefit-register-table-shell">
                                      <table class="dependency-register-table benefit-register-table" [attr.aria-label]="register.fieldName">
                                        <thead>
                                          <tr>
                                            <th>Benefit</th>
                                            <th>Type</th>
                                            <th>Category</th>
                                            <th>Owner</th>
                                            <th>Realisation Date</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of register.rows; track row.id) {
                                            <tr>
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.benefitName }}</strong>
                                                <small>{{ row.description || 'No description added' }}</small>
                                              </td>
                                              <td><span class="benefit-register-type-pill">{{ row.benefitType }}</span></td>
                                              <td><span class="benefit-register-category-pill">{{ row.category }}</span></td>
                                              <td>{{ row.owner }}</td>
                                              <td class="dependency-register-baseline benefit-register-realization">
                                                <strong>{{ row.realizationDate }}</strong>
                                                <small>Planned realization</small>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state benefit-empty-state">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>{{ register.emptyTitle }}</strong>
                                        <p>{{ register.emptyBody }}</p>
                                        <div class="benefit-empty-state-actions">
                                          <button class="dependency-register-add" type="button" (click)="openBenefitDrawer()">
                                            <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>Add first benefit
                                          </button>
                                          <span class="benefit-empty-state-note">Use the Benefit Agent banner above when you want help framing the first draft before you save it.</span>
                                        </div>
                                      </div>
                                    </div>
                                  }
                                </article>
                              </section>
                            } @else if (projectPlanActiveSection === 'Issues') {
                              @let register = activeIssuePlan;
                              <section class="dependency-register-stack issue-register-stack" aria-label="Issues register">
                                <article class="dependency-register-card issue-register-card">
                                  <div class="dependency-register-head">
                                    <div class="dependency-register-copy">
                                      <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                                      <strong>{{ register.title }}</strong>
                                      <small>{{ register.description }}</small>
                                    </div>
                                    <div class="dependency-register-actions">
                                      <span class="dependency-register-count">{{ issueCountLabel(register) }}</span>
                                      <button class="dependency-register-add" type="button" (click)="openIssueDrawer()">
                                        <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ register.actionLabel }}
                                      </button>
                                    </div>
                                  </div>

                                  @if (register.rows.length) {
                                    <div class="dependency-register-table-shell">
                                      <table class="dependency-register-table issue-register-table" [attr.aria-label]="register.fieldName">
                                        <thead>
                                          <tr>
                                            <th>Issue</th>
                                            <th>Type</th>
                                            <th>Criticality</th>
                                            <th>Owner</th>
                                            <th>Timeline</th>
                                            <th>Status</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of register.rows; track row.id) {
                                            <tr>
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.issue }}</strong>
                                                <small>{{ row.description || row.resolution }}</small>
                                              </td>
                                              <td><span class="issue-register-type-pill">{{ row.issueType }}</span></td>
                                              <td><span class="issue-register-criticality-pill {{ issueCriticalityTone(row.criticality) }}">{{ row.criticality }}</span></td>
                                              <td>{{ row.owner }}</td>
                                              <td class="dependency-register-baseline issue-register-timeline">
                                                <strong>{{ row.dateRaised || 'Raised date TBD' }}</strong>
                                                <small>{{ row.dueDate ? 'Due ' + row.dueDate : 'Due date TBD' }}</small>
                                                @if (row.dateClosed) { <small>Closed {{ row.dateClosed }}</small> }
                                              </td>
                                              <td class="dependency-register-status"><span class="dependency-register-pill {{ issueStatusTone(row.status) }}">{{ row.status }}</span></td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state issue-empty-state">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>{{ register.emptyTitle }}</strong>
                                        <p>{{ register.emptyBody }}</p>
                                      </div>
                                    </div>
                                  }
                                </article>
                              </section>
                            } @else if (projectPlanActiveSection === 'Related Links') {
                              @let register = activeRelatedLinksRegister;
                              <section class="dependency-register-stack" aria-label="Related links register">
                                <article class="dependency-register-card">
                                  <div class="dependency-register-head">
                                    <div class="dependency-register-copy">
                                      <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                                      <strong>{{ register.title }}</strong>
                                      <small>{{ register.description }}</small>
                                    </div>
                                    <div class="dependency-register-actions">
                                      <span class="dependency-register-count">{{ relatedLinksCountLabel(register) }}</span>
                                      <button class="dependency-register-add" type="button" (click)="openRelatedLinksDrawer()">
                                        <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ register.actionLabel }}
                                      </button>
                                    </div>
                                  </div>

                                  @if (register.rows.length) {
                                    <div class="dependency-register-table-shell">
                                      <table class="dependency-register-table" [attr.aria-label]="register.fieldName">
                                        <thead>
                                          <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Document</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of register.rows; track row.id) {
                                            <tr>
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.name }}</strong>
                                                <small>Related document</small>
                                              </td>
                                              <td>{{ row.description || 'No description added' }}</td>
                                              <td class="dependency-register-baseline related-links-register-access">
                                                <strong><a [href]="relatedLinkHref(row.documentLink)" target="_blank" rel="noreferrer">Open document</a></strong>
                                                <small>{{ row.documentLink }}</small>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>{{ register.emptyTitle }}</strong>
                                        <p>{{ register.emptyBody }}</p>
                                      </div>
                                    </div>
                                  }
                                </article>
                              </section>
                            } @else if (projectPlanActiveSection === 'Resource') {
                              @let register = activeResourcePlan;
                              <section class="dependency-register-stack" aria-label="Resource plan">
                                <article class="dependency-register-card">
                                  <div class="dependency-register-head">
                                    <div class="dependency-register-copy">
                                      <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                                      <strong>{{ register.title }}</strong>
                                      <small>{{ register.description }}</small>
                                    </div>
                                    <div class="dependency-register-actions">
                                      <span class="dependency-register-count">{{ resourceCountLabel(register) }}</span>
                                      <button class="dependency-register-add" type="button" (click)="openResourceDrawer()">
                                        <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ register.actionLabel }}
                                      </button>
                                    </div>
                                  </div>

                                  @if (register.rows.length) {
                                    <div class="dependency-register-table-shell">
                                      <table class="dependency-register-table" [attr.aria-label]="register.fieldName">
                                        <thead>
                                          <tr>
                                            <th>Resource</th>
                                            <th>Type</th>
                                            <th>Impact</th>
                                            <th>Business Unit</th>
                                            <th>FTE</th>
                                            <th>Timeline</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of register.rows; track row.id) {
                                            <tr>
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.resource }}</strong>
                                                <small>{{ row.comments || 'No comment added' }}</small>
                                              </td>
                                              <td>{{ row.resourceType }}</td>
                                              <td>{{ row.impact }}</td>
                                              <td>{{ row.businessUnit }}</td>
                                              <td>{{ row.fteCount }}</td>
                                              <td class="dependency-register-baseline">
                                                <strong>{{ row.baselineStart || 'Start date TBD' }}</strong>
                                                <small>{{ row.baselineEnd || 'End date TBD' }}</small>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>{{ register.emptyTitle }}</strong>
                                        <p>{{ register.emptyBody }}</p>
                                      </div>
                                    </div>
                                  }
                                </article>
                              </section>
                            } @else if (projectPlanActiveSection === 'Change Impact') {
                              @let register = changeImpactRegister;
                              <section class="dependency-register-stack change-impact-register-stack" aria-label="Change impact register">
                                <article class="dependency-register-card change-impact-register-card">
                                  <div class="dependency-register-head change-impact-register-head">
                                    <div class="dependency-register-copy">
                                      <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                                      <strong>{{ register.title }}</strong>
                                      <small>{{ register.description }}</small>
                                    </div>
                                    <div class="dependency-register-actions">
                                      <span class="dependency-register-count">{{ changeImpactCountLabel(register) }}</span>
                                      <button class="dependency-register-add" type="button" (click)="openChangeImpactDrawer()">
                                        <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ register.actionLabel }}
                                      </button>
                                    </div>
                                  </div>

                                  @if (register.rows.length) {
                                    <div class="change-impact-card-list">
                                      @for (row of register.rows; track row.id) {
                                        <article class="change-impact-entry-card">
                                          <div class="change-impact-entry-head">
                                            <div class="change-impact-entry-title">
                                              <span class="change-impact-entry-eyebrow">{{ row.category }}</span>
                                              <strong>{{ row.stakeholder }}</strong>
                                              <small>Stakeholder impacted</small>
                                            </div>
                                            <span class="change-impact-level-pill {{ changeImpactLevelTone(row.level) }}">{{ row.level }} impact</span>
                                          </div>
                                          @if (row.strategies.length) {
                                            <div class="change-impact-strategy-list" aria-label="Change strategies">
                                              @for (strategy of row.strategies; track strategy) {
                                                <span class="change-impact-strategy-pill">{{ strategy }}</span>
                                              }
                                            </div>
                                          }
                                          <p class="change-impact-entry-comment" [class.is-empty]="!row.comment">{{ row.comment || 'No comment added for this impact yet.' }}</p>
                                        </article>
                                      }
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state change-impact-empty-state">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>{{ register.emptyTitle }}</strong>
                                        <p>{{ register.emptyBody }}</p>
                                      </div>
                                    </div>
                                  }
                                </article>
                              </section>
                            } @else if (projectPlanActiveSection === 'Dependency') {
                              <section class="dependency-register-stack" aria-label="Dependency registers">
                                @for (register of visibleDependencyRegisters; track register.key) {
                                  <article class="dependency-register-card">
                                    <div class="dependency-register-head">
                                      <div class="dependency-register-copy">
                                        <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                                        <strong>{{ register.title }}</strong>
                                        <small>{{ register.description }}</small>
                                      </div>
                                      <div class="dependency-register-actions">
                                        <span class="dependency-register-count">{{ dependencyCountLabel(register) }}</span>
                                        <button class="dependency-register-add" type="button" (click)="openDependencyDrawer(register.key)">
                                          <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ register.actionLabel }}
                                        </button>
                                      </div>
                                    </div>

                                    @if (register.rows.length) {
                                      <div class="dependency-register-table-shell">
                                        <table class="dependency-register-table" [attr.aria-label]="register.fieldName">
                                          <thead>
                                            <tr>
                                              <th>{{ register.fieldName }}</th>
                                              <th>Impact</th>
                                              <th>Dependent Product</th>
                                              <th>Baseline</th>
                                              <th>Project Manager</th>
                                              <th>Status</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            @for (row of register.rows; track row.id) {
                                              <tr>
                                                <td class="dependency-register-primary">
                                                  <strong>{{ row.project }}</strong>
                                                  <small>{{ row.nature }}</small>
                                                </td>
                                                <td>{{ row.impact }}</td>
                                                <td>{{ row.dependentProduct }}</td>
                                                <td class="dependency-register-baseline">
                                                  <strong>{{ row.baselineStart }}</strong>
                                                  <small>{{ row.baselineEnd }}</small>
                                                </td>
                                                <td>{{ row.projectManager }}</td>
                                                <td class="dependency-register-status"><span class="dependency-register-pill {{ dependencyStatusTone(row.status) }}">{{ row.status }}</span></td>
                                              </tr>
                                            }
                                          </tbody>
                                        </table>
                                      </div>
                                    } @else {
                                      <div class="dependency-empty-state">
                                        <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                        <div class="dependency-empty-state-copy">
                                          <strong>{{ register.emptyTitle }}</strong>
                                          <p>{{ register.emptyBody }}</p>
                                        </div>
                                      </div>
                                    }
                                  </article>
                                }
                              </section>

                              @if (activeProjectPlanHasVisibleFields && hiddenDependencyRegisters.length) {
                                <button class="matrix-show-fields" [class.is-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)" type="button" (click)="toggleProjectPlanFieldSection(projectPlanActiveSection)" [attr.aria-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)">
                                  <span class="matrix-show-fields-copy"><strong>{{ activeProjectPlanHiddenFieldButtonLabel }} ({{ hiddenDependencyRegisters.length }})</strong><small>{{ activeProjectPlanHiddenFieldPreview }}</small></span>
                                  <span class="matrix-show-fields-indicator" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection) ? 'minus' : 'plus'"></i></span></span>
                                </button>
                                @if (isProjectPlanFieldSectionExpanded(projectPlanActiveSection)) {
                                  <div class="matrix-hidden-fields is-expanded">
                                    <section class="dependency-register-stack dependency-register-stack-hidden" aria-label="Additional dependency fields">
                                      @for (register of hiddenDependencyRegisters; track register.key) {
                                        <article class="dependency-register-card">
                                          <div class="dependency-register-head">
                                            <div class="dependency-register-copy">
                                              <span class="dependency-register-eyebrow">{{ register.fieldName }} <small>Detailed only</small></span>
                                              <strong>{{ register.title }}</strong>
                                              <small>{{ register.description }}</small>
                                            </div>
                                            <div class="dependency-register-actions">
                                              <span class="dependency-register-count">{{ dependencyCountLabel(register) }}</span>
                                              <button class="dependency-register-add" type="button" (click)="openDependencyDrawer(register.key)">
                                                <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ register.actionLabel }}
                                              </button>
                                            </div>
                                          </div>

                                          @if (register.rows.length) {
                                            <div class="dependency-register-table-shell">
                                              <table class="dependency-register-table" [attr.aria-label]="register.fieldName">
                                                <thead>
                                                  <tr>
                                                    <th>{{ register.fieldName }}</th>
                                                    <th>Impact</th>
                                                    <th>Dependent Product</th>
                                                    <th>Baseline</th>
                                                    <th>Project Manager</th>
                                                    <th>Status</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  @for (row of register.rows; track row.id) {
                                                    <tr>
                                                      <td class="dependency-register-primary">
                                                        <strong>{{ row.project }}</strong>
                                                        <small>{{ row.nature }}</small>
                                                      </td>
                                                      <td>{{ row.impact }}</td>
                                                      <td>{{ row.dependentProduct }}</td>
                                                      <td class="dependency-register-baseline">
                                                        <strong>{{ row.baselineStart }}</strong>
                                                        <small>{{ row.baselineEnd }}</small>
                                                      </td>
                                                      <td>{{ row.projectManager }}</td>
                                                      <td class="dependency-register-status"><span class="dependency-register-pill {{ dependencyStatusTone(row.status) }}">{{ row.status }}</span></td>
                                                    </tr>
                                                  }
                                                </tbody>
                                              </table>
                                            </div>
                                          } @else {
                                            <div class="dependency-empty-state">
                                              <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                              <div class="dependency-empty-state-copy">
                                                <strong>{{ register.emptyTitle }}</strong>
                                                <p>{{ register.emptyBody }}</p>
                                              </div>
                                            </div>
                                          }
                                        </article>
                                      }
                                    </section>
                                  </div>
                                }
                              }
                            } @else {
                              @for (group of activeProjectPlanVisibleGroups; track group.title) {
                                <details class="matrix-field-group" open>
                                  <summary><span class="matrix-field-group-copy"><strong>{{ group.title }}</strong><small>{{ group.description }}</small></span><span class="matrix-field-group-meta"><b>{{ group.fields.length }}</b><span class="icon"><i data-lucide="chevron-down"></i></span></span></summary>
                                  <div class="matrix-field-group-grid">
                                    @for (field of group.fields; track field.id) {
                                      @if (field.type === 'table') {
                                        <article class="matrix-field matrix-field-table wide">
                                          <div class="matrix-register-head">
                                            <div><span class="matrix-field-label">{{ field.field }} @if (field.mandatory) { <b>*</b> }</span><small>{{ simplePlanTableConfig(field).description }}</small></div>
                                            <button type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ simplePlanTableConfig(field).action }}</button>
                                          </div>
                                          <div class="matrix-register-table" role="table" [attr.aria-label]="field.field">
                                            <div class="matrix-register-row head" [class.columns-2]="simplePlanTableConfig(field).columns.length === 2" [class.columns-3]="simplePlanTableConfig(field).columns.length === 3" [class.columns-4]="simplePlanTableConfig(field).columns.length === 4" [class.columns-5]="simplePlanTableConfig(field).columns.length >= 5" role="row">
                                              @for (column of simplePlanTableConfig(field).columns; track column) { <span>{{ column }}</span> }
                                            </div>
                                            @for (row of simplePlanTableConfig(field).rows; track row[0]) {
                                              <div class="matrix-register-row" [class.columns-2]="simplePlanTableConfig(field).columns.length === 2" [class.columns-3]="simplePlanTableConfig(field).columns.length === 3" [class.columns-4]="simplePlanTableConfig(field).columns.length === 4" [class.columns-5]="simplePlanTableConfig(field).columns.length >= 5" role="row">
                                                @for (cell of row; track $index) { <span>@if ($index === row.length - 1) { <b>{{ cell }}</b> } @else { <ng-container>{{ cell }}</ng-container> }</span> }
                                              </div>
                                            }
                                          </div>
                                        </article>
                                      } @else if (field.type === 'boolean' || field.type === 'choice') {
                                        <div class="matrix-field matrix-field-boolean" [class.wide]="field.type === 'choice'">
                                          <span class="matrix-field-label">{{ field.field }} @if (field.mandatory) { <b>*</b> }</span>
                                          @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                          <div class="matrix-boolean" role="radiogroup" [attr.aria-label]="field.field">
                                            @for (option of projectPlanFieldOptions(field); track option) {
                                              <label><input type="radio" [name]="field.id" [checked]="field.value === option" /> <span>{{ option }}</span></label>
                                            }
                                          </div>
                                        </div>
                                      } @else if (field.type === 'select') {
                                        <label class="matrix-field matrix-field-select"><span class="matrix-field-label">{{ field.field }} @if (field.mandatory) { <b>*</b> }</span>
                                          @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                          <span class="matrix-select-wrap">
                                            <select [attr.aria-label]="field.field">
                                              @for (option of field.options || [field.value]; track option) { <option [selected]="option === field.value">{{ option }}</option> }
                                            </select>
                                            <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                          </span>
                                        </label>
                                      } @else if (field.type === 'money') {
                                        <label class="matrix-field matrix-field-money"><span class="matrix-field-label">{{ field.field }} @if (field.mandatory) { <b>*</b> }</span>
                                          @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                          <span class="matrix-money-wrap"><small>SAR</small><input type="text" [value]="field.value" [attr.aria-label]="field.field" [attr.placeholder]="field.placeholder || null" /></span>
                                        </label>
                                      } @else {
                                        <label class="matrix-field matrix-field-{{ field.type }}" [class.wide]="field.type === 'textarea'"><span class="matrix-field-label">{{ field.field }} @if (field.mandatory) { <b>*</b> }</span>
                                          @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                          @if (field.type === 'textarea') { <textarea [value]="field.value" [attr.aria-label]="field.field" [attr.placeholder]="field.placeholder || null"></textarea> } @else { <input [type]="field.type || 'text'" [value]="field.value" [attr.aria-label]="field.field" [attr.placeholder]="field.placeholder || null" /> }
                                        </label>
                                      }
                                    }
                                  </div>
                                </details>
                              }
                              @if (activeProjectPlanHasVisibleFields && activeProjectPlanHiddenFields.length) {
                                <button class="matrix-show-fields" [class.is-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)" type="button" (click)="toggleProjectPlanFieldSection(projectPlanActiveSection)" [attr.aria-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)">
                                  <span class="matrix-show-fields-copy"><strong>{{ activeProjectPlanHiddenFieldButtonLabel }} ({{ activeProjectPlanHiddenFields.length }})</strong><small>{{ activeProjectPlanHiddenFieldPreview }}</small></span>
                                  <span class="matrix-show-fields-indicator" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection) ? 'minus' : 'plus'"></i></span></span>
                                </button>
                                @if (activeProjectPlanHasVisibleFields && isProjectPlanFieldSectionExpanded(projectPlanActiveSection)) {
                                  <div class="matrix-hidden-fields is-expanded">
                                    @for (group of activeProjectPlanHiddenGroups; track group.title) {
                                      <section class="matrix-hidden-field-cluster">
                                        <div class="matrix-hidden-field-cluster-head">
                                          <span class="matrix-field-group-copy"><strong>{{ group.title }}</strong><small>{{ group.description }}</small></span>
                                          <span class="matrix-field-group-meta"><b>{{ group.fields.length }}</b></span>
                                        </div>
                                        <div class="matrix-field-group-grid">
                                          @for (field of group.fields; track field.id) {
                                            @if (field.type === 'table') {
                                              <article class="matrix-field matrix-field-table wide">
                                                <div class="matrix-register-head">
                                                  <div><span class="matrix-field-label">{{ field.field }} <small>Detailed only</small> @if (field.mandatory) { <b>*</b> }</span><small>{{ simplePlanTableConfig(field).description }}</small></div>
                                                  <button type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>{{ simplePlanTableConfig(field).action }}</button>
                                                </div>
                                                <div class="matrix-register-table" role="table" [attr.aria-label]="field.field">
                                                  <div class="matrix-register-row head" [class.columns-2]="simplePlanTableConfig(field).columns.length === 2" [class.columns-3]="simplePlanTableConfig(field).columns.length === 3" [class.columns-4]="simplePlanTableConfig(field).columns.length === 4" [class.columns-5]="simplePlanTableConfig(field).columns.length >= 5" role="row">
                                                    @for (column of simplePlanTableConfig(field).columns; track column) { <span>{{ column }}</span> }
                                                  </div>
                                                  @for (row of simplePlanTableConfig(field).rows; track row[0]) {
                                                    <div class="matrix-register-row" [class.columns-2]="simplePlanTableConfig(field).columns.length === 2" [class.columns-3]="simplePlanTableConfig(field).columns.length === 3" [class.columns-4]="simplePlanTableConfig(field).columns.length === 4" [class.columns-5]="simplePlanTableConfig(field).columns.length >= 5" role="row">
                                                      @for (cell of row; track $index) { <span>@if ($index === row.length - 1) { <b>{{ cell }}</b> } @else { <ng-container>{{ cell }}</ng-container> }</span> }
                                                    </div>
                                                  }
                                                </div>
                                              </article>
                                            } @else if (field.type === 'boolean' || field.type === 'choice') {
                                              <div class="matrix-field matrix-field-boolean" [class.wide]="field.type === 'choice'">
                                                <span class="matrix-field-label">{{ field.field }} <small>Detailed only</small> @if (field.mandatory) { <b>*</b> }</span>
                                                @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                                <div class="matrix-boolean" role="radiogroup" [attr.aria-label]="field.field">
                                                  @for (option of projectPlanFieldOptions(field); track option) {
                                                    <label><input type="radio" [name]="field.id" [checked]="field.value === option" /> <span>{{ option }}</span></label>
                                                  }
                                                </div>
                                              </div>
                                            } @else if (field.type === 'select') {
                                              <label class="matrix-field matrix-field-select"><span class="matrix-field-label">{{ field.field }} <small>Detailed only</small> @if (field.mandatory) { <b>*</b> }</span>
                                                @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                                <span class="matrix-select-wrap">
                                                  <select [attr.aria-label]="field.field">
                                                    @for (option of field.options || [field.value]; track option) { <option [selected]="option === field.value">{{ option }}</option> }
                                                  </select>
                                                  <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                                </span>
                                              </label>
                                            } @else if (field.type === 'money') {
                                              <label class="matrix-field matrix-field-money"><span class="matrix-field-label">{{ field.field }} <small>Detailed only</small> @if (field.mandatory) { <b>*</b> }</span>
                                                @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                                <span class="matrix-money-wrap"><small>SAR</small><input type="text" [value]="field.value" [attr.aria-label]="field.field" [attr.placeholder]="field.placeholder || null" /></span>
                                              </label>
                                            } @else {
                                              <label class="matrix-field matrix-field-{{ field.type }}" [class.wide]="field.type === 'textarea'"><span class="matrix-field-label">{{ field.field }} <small>Detailed only</small> @if (field.mandatory) { <b>*</b> }</span>
                                                @if (field.description) { <small class="matrix-field-description">{{ field.description }}</small> }
                                                @if (field.type === 'textarea') { <textarea [value]="field.value" [attr.aria-label]="field.field" [attr.placeholder]="field.placeholder || null"></textarea> } @else { <input [type]="field.type || 'text'" [value]="field.value" [attr.aria-label]="field.field" [attr.placeholder]="field.placeholder || null" /> }
                                              </label>
                                            }
                                          }
                                        </div>
                                      </section>
                                    }
                                  </div>
                                }
                              }
                            }
                          </div>
                        </section>
                      }
                    </div>
                  </main>
                </div>
                @if (activeBenefitDrawer; as register) {
                  <div class="dependency-drawer-shell" aria-hidden="false">
                    <button class="dependency-drawer-backdrop" type="button" aria-label="Close benefit drawer" (click)="closeBenefitDrawer()"></button>
                    <aside class="dependency-drawer benefit-drawer" [attr.aria-label]="register.title">
                      <form class="dependency-drawer-form benefit-drawer-form" (submit)="saveBenefitDrawer($event)">
                        <div class="dependency-drawer-top benefit-drawer-top">
                          <div class="dependency-drawer-title">
                            <span class="dependency-register-eyebrow">{{ register.fieldName }} <small>AI ready</small></span>
                            <h2>{{ register.title }}</h2>
                            <p>{{ register.description }}</p>
                          </div>
                          <button class="drawer-close" type="button" aria-label="Close benefit drawer" (click)="closeBenefitDrawer()"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                        </div>
                        <div class="dependency-drawer-body benefit-drawer-body">
                          <div class="dependency-drawer-summary">
                            <span class="dependency-register-count">{{ benefitCountLabel(register) }}</span>
                            <small>Capture the benefit statement first, then layer more evidence and realization commentary later through reporting.</small>
                          </div>
                          <div class="dependency-drawer-grid benefit-drawer-grid">
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Benefit Type</span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.benefitType" (change)="updateBenefitDraft('benefitType', $any($event.target).value)" aria-label="Benefit Type">
                                  <option value="" disabled>{{ register.benefitTypePlaceholder }}</option>
                                  @for (option of register.benefitTypeOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Benefit Category</span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.category" (change)="updateBenefitDraft('category', $any($event.target).value)" aria-label="Benefit Category">
                                  <option value="" disabled>{{ register.benefitCategoryPlaceholder }}</option>
                                  @for (option of register.benefitCategoryOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field dependency-drawer-field wide">
                              <span class="matrix-field-label">Benefit Name <b>*</b></span>
                              <input type="text" [value]="register.draft.benefitName" (input)="updateBenefitDraft('benefitName', $any($event.target).value)" aria-label="Benefit Name" placeholder="Enter benefit name" />
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Description</span>
                              <textarea [value]="register.draft.description" (input)="updateBenefitDraft('description', $any($event.target).value)" aria-label="Description" placeholder="Enter description"></textarea>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Benefit Owner</span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.owner" (change)="updateBenefitDraft('owner', $any($event.target).value)" aria-label="Benefit Owner">
                                  <option value="" disabled>{{ register.ownerPlaceholder }}</option>
                                  @for (option of register.ownerOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Realisation Date <b>*</b></span>
                              <input type="date" [value]="register.draft.realizationDate" (input)="updateBenefitDraft('realizationDate', $any($event.target).value)" aria-label="Realisation Date" />
                            </label>
                          </div>
                        </div>
                        <div class="report-drawer-footer dependency-drawer-footer">
                          <button class="report-secondary-button" type="button" (click)="closeBenefitDrawer()">Cancel</button>
                          <button class="report-submit-button" type="submit" [disabled]="!canSaveBenefitDraft(register)">{{ register.actionLabel }}</button>
                        </div>
                      </form>
                    </aside>
                  </div>
                }
                @if (isIssueDrawerOpen) {
                  @let register = activeIssuePlan;
                  <div class="dependency-drawer-shell" aria-hidden="false">
                    <button class="dependency-drawer-backdrop" type="button" aria-label="Close issue drawer" (click)="closeIssueDrawer()"></button>
                    <aside class="dependency-drawer issue-drawer" [attr.aria-label]="register.title">
                      <form class="dependency-drawer-form issue-drawer-form" (submit)="saveIssueDrawer($event)">
                        <div class="dependency-drawer-top issue-drawer-top">
                          <div class="dependency-drawer-title">
                            <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                            <h2>{{ register.title }}</h2>
                            <p>{{ register.description }}</p>
                          </div>
                          <button class="drawer-close" type="button" aria-label="Close issue drawer" (click)="closeIssueDrawer()"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                        </div>
                        <div class="dependency-drawer-body issue-drawer-body">
                          <div class="dependency-drawer-summary">
                            <span class="dependency-register-count">{{ issueCountLabel(register) }}</span>
                            <small>Capture the issue once with owner, dates, and the current resolution path so project reviews can see what still needs action.</small>
                          </div>
                          <div class="dependency-drawer-grid issue-drawer-grid">
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Issue Type <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.issueType" (change)="updateIssueDraft('issueType', $any($event.target).value)" aria-label="Issue Type">
                                  <option value="" disabled>{{ register.issueTypePlaceholder }}</option>
                                  @for (option of register.issueTypeOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Criticality</span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.criticality" (change)="updateIssueDraft('criticality', $any($event.target).value)" aria-label="Criticality">
                                  @for (option of register.criticalityOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Issue <b>*</b></span>
                              <textarea [value]="register.draft.issue" (input)="updateIssueDraft('issue', $any($event.target).value)" aria-label="Issue" placeholder="Describe the issue or blocker"></textarea>
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Description</span>
                              <textarea [value]="register.draft.description" (input)="updateIssueDraft('description', $any($event.target).value)" aria-label="Description" placeholder="Add supporting context"></textarea>
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Resolution <b>*</b></span>
                              <textarea [value]="register.draft.resolution" (input)="updateIssueDraft('resolution', $any($event.target).value)" aria-label="Resolution" placeholder="Describe the current resolution path"></textarea>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Status <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.status" (change)="updateIssueDraft('status', $any($event.target).value)" aria-label="Status">
                                  @for (option of register.statusOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Owner <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.owner" (change)="updateIssueDraft('owner', $any($event.target).value)" aria-label="Owner">
                                  <option value="" disabled>{{ register.ownerPlaceholder }}</option>
                                  @for (option of register.ownerOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Date Raised <b>*</b></span>
                              <input type="date" [value]="register.draft.dateRaised" (input)="updateIssueDraft('dateRaised', $any($event.target).value)" aria-label="Date Raised" />
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Due Date</span>
                              <input type="date" [value]="register.draft.dueDate" (input)="updateIssueDraft('dueDate', $any($event.target).value)" aria-label="Due Date" />
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Date Closed</span>
                              <input type="date" [value]="register.draft.dateClosed" (input)="updateIssueDraft('dateClosed', $any($event.target).value)" aria-label="Date Closed" />
                            </label>
                          </div>
                        </div>
                        <div class="report-drawer-footer dependency-drawer-footer">
                          <button class="report-secondary-button" type="button" (click)="closeIssueDrawer()">Cancel</button>
                          <button class="report-submit-button" type="submit" [disabled]="!canSaveIssueDraft(register)">{{ register.actionLabel }}</button>
                        </div>
                      </form>
                    </aside>
                  </div>
                }
                @if (isRelatedLinksDrawerOpen) {
                  @let register = activeRelatedLinksRegister;
                  <div class="dependency-drawer-shell" aria-hidden="false">
                    <button class="dependency-drawer-backdrop" type="button" aria-label="Close related links drawer" (click)="closeRelatedLinksDrawer()"></button>
                    <aside class="dependency-drawer" [attr.aria-label]="register.title">
                      <form class="dependency-drawer-form" (submit)="saveRelatedLinksDrawer($event)">
                        <div class="dependency-drawer-top">
                          <div class="dependency-drawer-title">
                            <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                            <h2>{{ register.title }}</h2>
                            <p>{{ register.description }}</p>
                          </div>
                          <button class="drawer-close" type="button" aria-label="Close related links drawer" (click)="closeRelatedLinksDrawer()"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                        </div>
                        <div class="dependency-drawer-body">
                          <div class="dependency-drawer-summary">
                            <span class="dependency-register-count">{{ relatedLinksCountLabel(register) }}</span>
                            <small>Capture the document name, destination link, and a quick note once so reviewers can open evidence directly from this tab.</small>
                          </div>
                          <div class="dependency-drawer-grid">
                            <label class="matrix-field dependency-drawer-field wide">
                              <span class="matrix-field-label">Name <b>*</b></span>
                              <input type="text" [value]="register.draft.name" (input)="updateRelatedLinksDraft('name', $any($event.target).value)" aria-label="Name" [attr.placeholder]="register.namePlaceholder" />
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Description</span>
                              <textarea [value]="register.draft.description" (input)="updateRelatedLinksDraft('description', $any($event.target).value)" aria-label="Description" [attr.placeholder]="register.descriptionPlaceholder"></textarea>
                            </label>
                            <label class="matrix-field dependency-drawer-field wide">
                              <span class="matrix-field-label">Link To Document <b>*</b></span>
                              <input type="text" [value]="register.draft.documentLink" (input)="updateRelatedLinksDraft('documentLink', $any($event.target).value)" aria-label="Link To Document" [attr.placeholder]="register.documentPlaceholder" />
                            </label>
                          </div>
                        </div>
                        <div class="report-drawer-footer dependency-drawer-footer">
                          <button class="report-secondary-button" type="button" (click)="closeRelatedLinksDrawer()">Cancel</button>
                          <button class="report-submit-button" type="submit" [disabled]="!canSaveRelatedLinksDraft(register)">{{ register.actionLabel }}</button>
                        </div>
                      </form>
                    </aside>
                  </div>
                }
                @if (isResourceDrawerOpen) {
                  @let register = activeResourcePlan;
                  <div class="dependency-drawer-shell" aria-hidden="false">
                    <button class="dependency-drawer-backdrop" type="button" aria-label="Close resource drawer" (click)="closeResourceDrawer()"></button>
                    <aside class="dependency-drawer" [attr.aria-label]="register.title">
                      <form class="dependency-drawer-form" (submit)="saveResourceDrawer($event)">
                        <div class="dependency-drawer-top">
                          <div class="dependency-drawer-title">
                            <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                            <h2>{{ register.title }}</h2>
                            <p>{{ register.description }}</p>
                          </div>
                          <button class="drawer-close" type="button" aria-label="Close resource drawer" (click)="closeResourceDrawer()"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                        </div>
                        <div class="dependency-drawer-body">
                          <div class="dependency-drawer-summary">
                            <span class="dependency-register-count">{{ resourceCountLabel(register) }}</span>
                            <small>Capture the role, FTE demand, and timing once so resourcing can be reviewed directly from this section.</small>
                          </div>
                          <div class="dependency-drawer-grid">
                            <label class="matrix-field matrix-field-select dependency-drawer-field wide">
                              <span class="matrix-field-label">Resource <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.resource" (change)="updateResourceDraft('resource', $any($event.target).value)" aria-label="Resource">
                                  <option value="" disabled>{{ register.resourcePlaceholder }}</option>
                                  @for (option of register.resourceOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Resource type <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.resourceType" (change)="updateResourceDraft('resourceType', $any($event.target).value)" aria-label="Resource type">
                                  <option value="" disabled>{{ register.resourceTypePlaceholder }}</option>
                                  @for (option of register.resourceTypeOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Level of Impact <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.impact" (change)="updateResourceDraft('impact', $any($event.target).value)" aria-label="Level of Impact">
                                  <option value="" disabled>{{ register.impactPlaceholder }}</option>
                                  @for (option of register.impactOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Business Unit <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.businessUnit" (change)="updateResourceDraft('businessUnit', $any($event.target).value)" aria-label="Business Unit">
                                  <option value="" disabled>{{ register.businessUnitPlaceholder }}</option>
                                  @for (option of register.businessUnitOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Resources (FTE Count) <b>*</b></span>
                              <input type="text" [value]="register.draft.fteCount" (input)="updateResourceDraft('fteCount', $any($event.target).value)" aria-label="Resources" [attr.placeholder]="register.ftePlaceholder" />
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Baseline Start Date</span>
                              <input type="date" [value]="register.draft.baselineStart" (input)="updateResourceDraft('baselineStart', $any($event.target).value)" aria-label="Baseline Start Date" />
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">End Date</span>
                              <input type="date" [value]="register.draft.baselineEnd" (input)="updateResourceDraft('baselineEnd', $any($event.target).value)" aria-label="End Date" />
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Comments</span>
                              <textarea [value]="register.draft.comments" (input)="updateResourceDraft('comments', $any($event.target).value)" aria-label="Comments" placeholder="Type comments here"></textarea>
                            </label>
                          </div>
                        </div>
                        <div class="report-drawer-footer dependency-drawer-footer">
                          <button class="report-secondary-button" type="button" (click)="closeResourceDrawer()">Cancel</button>
                          <button class="report-submit-button" type="submit" [disabled]="!canSaveResourceDraft(register)">{{ register.actionLabel }}</button>
                        </div>
                      </form>
                    </aside>
                  </div>
                }
                @if (activeChangeImpactDrawer; as register) {
                  <div class="dependency-drawer-shell change-impact-drawer-shell" aria-hidden="false">
                    <button class="dependency-drawer-backdrop change-impact-drawer-backdrop" type="button" aria-label="Close change impact drawer" (click)="closeChangeImpactDrawer()"></button>
                    <aside class="dependency-drawer change-impact-drawer" [attr.aria-label]="register.title">
                      <form class="dependency-drawer-form change-impact-drawer-form" (submit)="saveChangeImpactDrawer($event)">
                        <div class="dependency-drawer-top change-impact-drawer-top">
                          <div class="dependency-drawer-title">
                            <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                            <h2>{{ register.title }}</h2>
                            <p>{{ register.description }}</p>
                          </div>
                          <button class="drawer-close" type="button" aria-label="Close change impact drawer" (click)="closeChangeImpactDrawer()"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                        </div>
                        <div class="dependency-drawer-body change-impact-drawer-body">
                          <div class="dependency-drawer-summary">
                            <span class="dependency-register-count">{{ changeImpactCountLabel(register) }}</span>
                            <small>Capture the impacted audience, the level of disruption, and the first change strategy before adoption risk starts landing in delivery.</small>
                          </div>
                          <div class="dependency-drawer-grid change-impact-drawer-grid">
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Change Impact Category <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.category" (change)="updateChangeImpactDraft('category', $any($event.target).value)" aria-label="Change Impact Category">
                                  <option value="" disabled>{{ register.categoryPlaceholder }}</option>
                                  @for (option of register.categoryOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Stakeholder Impacted <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.stakeholder" (change)="updateChangeImpactDraft('stakeholder', $any($event.target).value)" aria-label="Stakeholder Impacted">
                                  <option value="" disabled>{{ register.stakeholderPlaceholder }}</option>
                                  @for (option of register.stakeholderOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Level of Impact <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.level" (change)="updateChangeImpactDraft('level', $any($event.target).value)" aria-label="Level of Impact">
                                  <option value="" disabled>{{ register.levelPlaceholder }}</option>
                                  @for (option of register.levelOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Comment</span>
                              <small class="matrix-field-description">Add the business context, behavior shift, or delivery friction this impact is likely to create.</small>
                              <textarea maxlength="3000" [value]="register.draft.comment" (input)="updateChangeImpactDraft('comment', $any($event.target).value)" aria-label="Comment" placeholder="Describe the impact in plain language"></textarea>
                              <small class="change-impact-comment-count">{{ changeImpactCommentCharactersRemaining }} characters remaining</small>
                            </label>
                            <section class="change-impact-strategy-builder wide" aria-label="Change strategies">
                              <div class="change-impact-strategy-head">
                                <div>
                                  <span class="matrix-field-label">Change Strategy</span>
                                  <small class="matrix-field-description">Add the actions that will reduce the impact or prepare the audience.</small>
                                </div>
                              </div>
                              <div class="change-impact-strategy-compose">
                                <input type="text" [value]="register.draft.strategyInput" (input)="updateChangeImpactDraft('strategyInput', $any($event.target).value)" aria-label="Change Strategy" [attr.placeholder]="register.strategyPlaceholder" />
                                <button class="change-impact-strategy-add" type="button" (click)="addChangeImpactStrategy()">Add strategy</button>
                              </div>
                              @if (register.draft.strategies.length) {
                                <div class="change-impact-strategy-list is-editor" aria-label="Draft change strategies">
                                  @for (strategy of register.draft.strategies; track strategy) {
                                    <span class="change-impact-strategy-pill">
                                      <span>{{ strategy }}</span>
                                      <button type="button" aria-label="Remove strategy {{ strategy }}" (click)="removeChangeImpactStrategy(strategy)"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                                    </span>
                                  }
                                </div>
                              } @else {
                                <p class="change-impact-strategy-empty">No strategies added yet. Add the adoption, communication, or training response you want tracked with this impact.</p>
                              }
                            </section>
                          </div>
                        </div>
                        <div class="report-drawer-footer dependency-drawer-footer">
                          <button class="report-secondary-button" type="button" (click)="closeChangeImpactDrawer()">Cancel</button>
                          <button class="report-submit-button" type="submit" [disabled]="!canSaveChangeImpactDraft(register)">{{ register.actionLabel }}</button>
                        </div>
                      </form>
                    </aside>
                  </div>
                }
                @if (activeDependencyRegister; as register) {
                  <div class="dependency-drawer-shell" aria-hidden="false">
                    <button class="dependency-drawer-backdrop" type="button" aria-label="Close dependency drawer" (click)="closeDependencyDrawer()"></button>
                    <aside class="dependency-drawer" [attr.aria-label]="register.title">
                      <form class="dependency-drawer-form" (submit)="saveDependencyDrawer($event)">
                        <div class="dependency-drawer-top">
                          <div class="dependency-drawer-title">
                            <span class="dependency-register-eyebrow">{{ register.fieldName }}</span>
                            <h2>{{ register.title }}</h2>
                            <p>{{ register.description }}</p>
                          </div>
                          <button class="drawer-close" type="button" aria-label="Close dependency drawer" (click)="closeDependencyDrawer()"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                        </div>
                        <div class="dependency-drawer-body">
                          <div class="dependency-drawer-summary">
                            <span class="dependency-register-count">{{ dependencyCountLabel(register) }}</span>
                            <small>Add the relationship once, then manage it from the dependency table in this section.</small>
                          </div>
                          <div class="dependency-drawer-grid">
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">{{ register.key === 'predecessor' ? 'Predecessor Project' : 'Successor Project' }} <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.project" (change)="updateDependencyDraft('project', $any($event.target).value)" [attr.aria-label]="register.key === 'predecessor' ? 'Predecessor Project' : 'Successor Project'">
                                  <option value="" disabled>{{ register.projectPlaceholder }}</option>
                                  @for (option of register.projectOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Impact of Dependency <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.impact" (change)="updateDependencyDraft('impact', $any($event.target).value)" aria-label="Impact of Dependency">
                                  <option value="" disabled>{{ register.impactPlaceholder }}</option>
                                  @for (option of register.impactOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field matrix-field-select dependency-drawer-field">
                              <span class="matrix-field-label">Dependent Product <b>*</b></span>
                              <span class="matrix-select-wrap">
                                <select [value]="register.draft.dependentProduct" (change)="updateDependencyDraft('dependentProduct', $any($event.target).value)" aria-label="Dependent Product">
                                  <option value="" disabled>{{ register.dependentProductPlaceholder }}</option>
                                  @for (option of register.dependentProductOptions; track option) {
                                    <option [value]="option">{{ option }}</option>
                                  }
                                </select>
                                <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                              </span>
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Project Manager <b>*</b></span>
                              <input type="text" [value]="register.draft.projectManager" (input)="updateDependencyDraft('projectManager', $any($event.target).value)" aria-label="Project Manager" placeholder="Type project manager name" />
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Baseline Start Date <b>*</b></span>
                              <input type="date" [value]="register.draft.baselineStart" (input)="updateDependencyDraft('baselineStart', $any($event.target).value)" aria-label="Baseline Start Date" />
                            </label>
                            <label class="matrix-field dependency-drawer-field">
                              <span class="matrix-field-label">Baseline End Date <b>*</b></span>
                              <input type="date" [value]="register.draft.baselineEnd" (input)="updateDependencyDraft('baselineEnd', $any($event.target).value)" aria-label="Baseline End Date" />
                            </label>
                            <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                              <span class="matrix-field-label">Nature of Dependency <b>*</b></span>
                              <small class="matrix-field-description">Explain the handoff, blocker, or downstream reliance in plain language.</small>
                              <textarea [value]="register.draft.nature" (input)="updateDependencyDraft('nature', $any($event.target).value)" aria-label="Nature of Dependency" placeholder="Describe how this dependency affects delivery"></textarea>
                            </label>
                          </div>
                        </div>
                        <div class="report-drawer-footer dependency-drawer-footer">
                          <button class="report-secondary-button" type="button" (click)="closeDependencyDrawer()">Cancel</button>
                          <button class="report-submit-button" type="submit" [disabled]="!canSaveDependencyDraft(register)">{{ register.actionLabel }}</button>
                        </div>
                      </form>
                    </aside>
                  </div>
                }
              } @else if (projectPlanEntry === 'reports') {
                <div class="project-plan-shell plan-builder-shell quick-plan-shell project-report-shell project-reports-shell">
                  <main class="project-plan-content plan-builder-workspace quick-plan-workspace project-report-workspace">
                    <section class="project-report-surface project-reports-dashboard" [attr.aria-label]="scopedProjectName + ' reports dashboard'">
                      <div class="project-reports-summary-grid" aria-label="Report summary">
                        @for (metric of projectReportMetrics; track metric) {
                          <article class="project-report-metric-card"><div class="project-report-metric-copy"><span>{{ metric }}</span><strong>40% <small><span class="icon" aria-hidden="true"><i data-lucide="trending-up"></i></span>21%</small></strong></div><span class="project-report-metric-icon"><span class="icon" aria-hidden="true"><i data-lucide="file-text"></i></span></span></article>
                        }
                        <article class="project-report-trend-panel" aria-label="Reporting trend"><div class="project-report-trend-copy"><span>Reporting Trend</span></div><div class="project-report-trend-track">@for (point of projectReportTrendPoints; track point.date + point.tone) { <span class="project-report-trend-point {{ point.tone }}"><small>{{ point.date }}</small><i><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(point.icon)"></i></span></i></span> }</div></article>
                      </div>
                      <div class="pm-project-table-scroll project-reports-table-scroll" tabindex="0">
                        <table class="pm-project-table project-reports-table">
                          <thead><tr><th class="pm-table-check-cell"><input type="checkbox" aria-label="Select all reports" /></th><th>Reporting Period <span class="project-report-sort"><span class="icon" aria-hidden="true"><i data-lucide="trending-up"></i></span></span></th><th>Reporting Status</th><th>Project Status</th><th>Report Type</th><th aria-label="Row actions"></th></tr></thead>
                          <tbody>
                            @for (row of projectReportsRows; track row.period + row.owner) {
                              <tr class="project-report-open-row" role="button" tabindex="0" [attr.aria-label]="'Open ' + row.period + ' report drawer for ' + scopedProjectName" (click)="openProjectReportRow(scopedProjectName)" (keydown.enter)="openProjectReportRowKey($event, scopedProjectName)" (keydown.space)="openProjectReportRowKey($event, scopedProjectName)"><td class="pm-table-check-cell"><input type="checkbox" [attr.aria-label]="'Select ' + row.period + ' report'" (click)="$event.stopPropagation()" /></td><td class="pm-table-project-cell project-report-period-cell"><button type="button" (click)="openReport(scopedProjectName); $event.stopPropagation()"><strong>{{ row.period }}</strong>@if (row.priority === 'high') { <span class="project-report-row-marker high" title="High priority"><span class="icon" aria-hidden="true"><i data-lucide="chevrons-up"></i></span></span> } @if (row.priority === 'paused') { <span class="project-report-row-marker paused" title="Paused"><span class="icon" aria-hidden="true"><i data-lucide="circle-pause"></i></span></span> }</button></td><td><span class="project-report-owner">{{ row.owner }}</span></td><td>{{ row.date }}</td><td><span class="pm-table-budget"><strong>{{ row.budget }}</strong></span></td><td class="pm-table-actions-cell"><button type="button" [attr.aria-label]="'More actions for ' + row.period + ' report'" (click)="$event.stopPropagation()"><span class="icon" aria-hidden="true"><i data-lucide="ellipsis-vertical"></i></span></button></td></tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </main>
                </div>
              } @else {
                <div class="project-plan-shell plan-builder-shell quick-plan-shell project-secondary-shell">
                  <main class="project-plan-content plan-builder-workspace quick-plan-workspace project-report-workspace project-secondary-workspace">
                    <section class="project-report-surface" [attr.aria-label]="projectPlanEntryLabel + ' workspace'">
                      <article class="project-report-placeholder-card" [attr.aria-label]="projectPlanEntryLabel + ' content'"></article>
                    </section>
                  </main>
                </div>
              }
            </div>
          </section>
        }
        @case ('playground') {
          <section class="playground-page" aria-label="Project playground">
            <div class="playground-topbar"><button class="playground-back" type="button" (click)="navigate('workspace')"><span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span></button><div><span>Project Playground</span><h1>{{ scopedProjectName }}</h1></div></div>
            <div class="playground-shell"><aside class="playground-palette"><h2>Relationships</h2>@for (action of projectQuickActions.slice(4, 13); track action.id) { <button class="playground-palette-item" type="button"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(action.icon)"></i></span><strong>{{ action.title }}</strong></button> }</aside><div class="playground-surface"><article class="playground-node playground-project-node"><div class="playground-project-copy"><span>Project</span><h2>{{ scopedProjectName }}</h2></div></article></div></div>
          </section>
        }
        @default {
          @if (frontDoorMode === 'unassigned') {
            <section class="unassigned-frontdoor" [class.assignment-ready]="pmoAssignmentReady" [attr.aria-label]="pmoAssignmentReady ? 'Project assigned' : 'No projects assigned yet'">
              <div class="unassigned-hero">
                <div class="unassigned-hero-copy">
                  <span class="unassigned-kicker">{{ pmoAssignmentReady ? 'PMO assignment received' : 'New PM workspace' }}</span>
                  <h1>{{ pmoAssignmentReady ? 'Your first project is ready to plan' : 'Welcome to your PM front door' }}</h1>
                  <p>{{ pmoAssignmentReady ? pmoAssignmentMessage : noAssignmentMessage }}</p>
                  <button class="unassigned-status-pill" [class.is-ready]="pmoAssignmentReady" type="button" (click)="handleAssignmentPrimaryAction()" [attr.aria-label]="pmoAssignmentReady ? 'Create project plan' : 'Simulate PMO project assignment'">
                    <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(pmoAssignmentReady ? 'plan' : 'bell')"></i></span>
                    <span>{{ pmoAssignmentReady ? 'Create project plan' : 'Waiting for PMO assignment' }}</span>
                  </button>
                </div>
              </div>

              <div class="unassigned-layout">
                <section class="unassigned-card journey-card">
                  <div class="journey-overview">
                    <div class="unassigned-section-head journey-heading">
                      <span>What happens next</span>
                      <h2>Your project management journey</h2>
                      <p>From assignment to regular reporting, these are the steps you will work through in TASAMA.</p>
                    </div>
                    <div class="journey-status-panel">
                      <span class="journey-status-icon">
                        <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(pmoAssignmentReady ? 'plan' : 'bell')"></i></span>
                      </span>
                      <div>
                        <small>Current state</small>
                        <strong>{{ pmoAssignmentReady ? firstAssignedProject.name : 'Awaiting first assignment' }}</strong>
                        <p>{{ pmoAssignmentReady ? 'Build the baseline plan, then send it for PMO review.' : 'Your workspace is ready. PMO assignment will unlock project planning.' }}</p>
                      </div>
                      <button class="journey-status-action" [class.is-ready]="pmoAssignmentReady" type="button" (click)="handleAssignmentPrimaryAction()">
                        <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(pmoAssignmentReady ? 'plan' : 'bell')"></i></span>
                        <span>{{ pmoAssignmentReady ? 'Create project plan' : 'Waiting for PMO assignment' }}</span>
                      </button>
                    </div>
                  </div>
                  <ol class="journey-map">
                    @for (step of unassignedJourneySteps; track step.title; let index = $index) {
                      <li [class.is-complete]="pmoAssignmentReady && index === 0" [class.is-current]="pmoAssignmentReady && index === 1">
                        <div class="journey-step-head">
                          <span class="journey-step-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(step.icon)"></i></span></span>
                          <small>{{ stepNumber(index) }}</small>
                        </div>
                        <div class="journey-step-copy">
                          <strong>{{ step.title }}</strong>
                          <p>{{ step.body }}</p>
                          @if (pmoAssignmentReady && index === 1) {
                            <button class="journey-plan-cta" type="button" (click)="openAssignedProjectPlan()">
                              <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName('plan')"></i></span>
                              <span>Create project plan</span>
                            </button>
                          }
                        </div>
                      </li>
                    }
                  </ol>
                </section>
              </div>
            </section>
          } @else {
            <div class="content-grid" [class.pm101-locked-grid]="onboardingPm101Locked || isPm101OnboardingWorkspaceFlow">
              <div class="left-column">
                <section class="workspace-panel" [class.project-workspace-panel]="!isAllProjects && !onboardingPm101Locked && !isPm101OnboardingWorkspaceFlow" [class.board-workspace-panel]="selectedView === 'board'" [class.pm101-locked-workspace]="onboardingPm101Locked || isPm101OnboardingWorkspaceFlow">
                  <div class="workspace-shell-head" [class.pm101-locked-shell-head]="onboardingPm101Locked || isPm101OnboardingWorkspaceFlow" [class.pm101-ready-shell-head]="isPm101OnboardingWorkspaceFlow">
                    @if (onboardingPm101Locked || isPm101OnboardingWorkspaceFlow) {
                      <img class="workspace-line-art" src="./assets/workspace-line-art.svg" alt="" aria-hidden="true" />
                      <div class="workspace-shell-actions" aria-label="Workspace utilities">
                        <button class="workspace-filter-button" type="button" aria-label="Refresh workspace">
                          <span class="icon" aria-hidden="true"><i data-lucide="refresh-cw"></i></span>
                        </button>
                        <button class="workspace-filter-button" type="button" aria-label="Expand workspace">
                          <span class="icon" aria-hidden="true"><i data-lucide="expand"></i></span>
                        </button>
                      </div>
                      <div class="workspace-locked-title-row">
                        <span class="workspace-pane-icon" aria-hidden="true">
                          <img src="./assets/pane-top-icon.svg" alt="" />
                        </span>
                        <div class="workspace-title">
                          <h2>{{ workspaceTitle }}</h2>
                          <p>{{ workspaceSubtitle }}</p>
                        </div>
                      </div>
                    } @else {
                      <div class="workspace-title">
                        <h2>{{ workspaceTitle }}</h2>
                        <p>{{ workspaceSubtitle }}</p>
                      </div>
                      <aside class="ai-insight-widget red" aria-label="AI insights from front door">
                        <div class="ai-insight-main">
                          <div class="ai-insight-copy">
                            <span>Needs attention</span>
                            <strong>Submit Vision 2030 status report</strong>
                            <p>Overdue by 5 days. Clear this before the next steering check.</p>
                          </div>
                          <div class="ai-insight-bubbles ai-insight-bubbles-bottom" aria-label="AI insight slides">
                            <button class="ai-insight-dot active" type="button" aria-label="Show AI insight 1"></button>
                            <button class="ai-insight-dot" type="button" aria-label="Show AI insight 2"></button>
                            <button class="ai-insight-dot" type="button" aria-label="Show AI insight 3"></button>
                          </div>
                        </div>
                      </aside>
                    }
                    <div class="workspace-tabs" role="tablist" aria-label="Workspace view" data-tour-target="workspace-tabs">
                      <button
                        [class.active]="isActionWorkspaceActive"
                        [class.is-locked]="onboardingPm101Locked"
                        type="button"
                        data-view-target="actions"
                        [attr.aria-selected]="isActionWorkspaceActive"
                        (click)="setView(topActionWorkspaceView)"
                        [disabled]="onboardingPm101Locked"
                        [attr.aria-disabled]="onboardingPm101Locked ? 'true' : null"
                        [attr.title]="onboardingPm101Locked ? 'Available after PM 101 onboarding' : null"
                      >
                        <span class="icon" aria-hidden="true"><i data-lucide="check-square"></i></span>
                        <span>Actions</span>
                      </button>
                      <button
                        [class.active]="selectedView === 'pm101'"
                        type="button"
                        data-view-target="pm101"
                        [attr.aria-selected]="selectedView === 'pm101'"
                        (click)="setView('pm101')"
                      >
                        <span class="icon" aria-hidden="true"><i data-lucide="book-open"></i></span>
                        <span>PM101</span>
                      </button>
                      <button
                        [class.active]="selectedView === 'stages'"
                        [class.is-locked]="onboardingPm101Locked"
                        type="button"
                        data-view-target="stages"
                        [attr.aria-selected]="selectedView === 'stages'"
                        (click)="setView('stages')"
                        [disabled]="onboardingPm101Locked"
                        [attr.aria-disabled]="onboardingPm101Locked ? 'true' : null"
                        [attr.title]="onboardingPm101Locked ? 'Available after PM 101 onboarding' : null"
                      >
                        <span class="icon" aria-hidden="true"><i data-lucide="list-tree"></i></span>
                        <span>Stages</span>
                      </button>
                    </div>
                  </div>
                  @if (selectedView !== 'stages') {
                    <div class="workspace-control-row">
                      <label class="workspace-search">
                        <span class="icon" aria-hidden="true"><i data-lucide="search"></i></span>
                        <input type="search" [attr.aria-label]="workspaceSearchPlaceholder" [placeholder]="workspaceSearchPlaceholder" />
                      </label>
                      @if (isActionWorkspaceActive) {
                        <div class="action-view-switch" role="tablist" aria-label="Actions view format">
                          <button [class.active]="selectedView === 'board'" type="button" data-view-target="board" (click)="setView('board')">
                            <span class="icon" aria-hidden="true"><i data-lucide="columns-3"></i></span>
                            <span>Board</span>
                          </button>
                          <button [class.active]="selectedView === 'calendar'" type="button" data-view-target="calendar" (click)="setView('calendar')">
                            <span class="icon" aria-hidden="true"><i data-lucide="calendar-days"></i></span>
                            <span>Calendar</span>
                          </button>
                        </div>
                      }
                    </div>
                  }
                  <div class="workspace-body">
                    <div class="board-view" [class.is-hidden]="selectedView !== 'board'" data-work-view="board" data-tour-target="action-board">
                      <div class="board-filter" aria-label="Action board filters"><span>Show</span><details class="work-filter-dropdown"><summary [attr.aria-label]="'Filter actions by ' + selectedBoardFilterOption.label"><span class="work-filter-selected-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(selectedBoardFilterOption.icon)"></i></span></span><span>{{ selectedBoardFilterOption.label }}</span><strong>{{ countForFilter(selectedBoardFilterOption) }}</strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></summary><div class="work-filter-menu" role="menu">@for (filter of boardFilters; track filter.id) { <button [class.active]="selectedBoardFilter === filter.id" type="button" role="menuitemradio" [attr.aria-checked]="selectedBoardFilter === filter.id" (click)="setBoardFilter(filter.id, $event)"><span class="work-filter-option-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(filter.icon)"></i></span></span><span>{{ filter.label }}</span><strong>{{ countForFilter(filter) }}</strong></button> }</div></details></div>
                      <div class="kanban-board">@for (column of visibleBoardColumns; track column.column) { <section class="kanban-column {{ column.tone }}"><header><div><span class="board-column-icon {{ column.tone }}"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="boardColumnIcon(column.column)"></i></span></span><h3>{{ column.column }}</h3></div><strong>{{ column.items.length }}</strong></header><div class="task-stack">@for (item of column.items; track item.title) { <article class="task-card {{ taskCardClass(item.type) }}" [attr.data-card-kind]="filterKind(item.type)"><div class="task-top"><span>{{ item.type }}</span></div><h3>{{ item.title }}</h3><p>{{ item.project }}</p><div class="task-bottom"><span class="avatar-sm">{{ item.owner }}</span><small>{{ item.meta }}</small><button class="task-action" type="button" [attr.data-tour-target]="filterKind(item.type) === 'report' ? 'create-psr' : null" (click)="handleTaskAction(item)"><span>{{ item.cta }}</span><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></button></div></article> } @empty { <div class="empty-column">No {{ selectedBoardFilterOption.label.toLowerCase() }} in this lane.</div> }</div></section> }</div>
                    </div>
                    <div class="calendar-view" [class.is-hidden]="selectedView !== 'calendar'" data-work-view="calendar">
                      <div class="calendar-command-row"><div class="calendar-month-picker" aria-label="Calendar month navigation"><button class="calendar-nav-button" type="button" (click)="shiftMonth(-1)" aria-label="Previous month"><span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span></button><div class="calendar-month-copy"><strong>{{ calendarMonthLabel }}</strong><span>{{ visibleMonthItems.length }} item{{ visibleMonthItems.length === 1 ? '' : 's' }} this month</span></div><button class="calendar-nav-button" type="button" (click)="shiftMonth(1)" aria-label="Next month"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></button></div><div class="board-filter calendar-filter-bar" aria-label="Quick work filter"><span>Show</span><details class="work-filter-dropdown"><summary [attr.aria-label]="'Filter work by ' + selectedBoardFilterOption.label"><span class="work-filter-selected-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(selectedBoardFilterOption.icon)"></i></span></span><span>{{ selectedBoardFilterOption.label }}</span><strong>{{ countCalendarFilter(selectedBoardFilterOption) }}</strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></summary><div class="work-filter-menu" role="menu">@for (filter of boardFilters; track filter.id) { <button [class.active]="selectedBoardFilter === filter.id" type="button" role="menuitemradio" [attr.aria-checked]="selectedBoardFilter === filter.id" (click)="setBoardFilter(filter.id, $event)"><span class="work-filter-option-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(filter.icon)"></i></span></span><span>{{ filter.label }}</span><strong>{{ countCalendarFilter(filter) }}</strong></button> }</div></details></div></div>
                      <div class="timeline-calendar"><div class="weekdays"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div class="calendar-grid">@for (cell of calendarCells; track cell.key) { <div class="calendar-cell" [class.muted]="!cell.current" [class.today]="cell.today"><span>{{ cell.day }}</span>@for (item of cell.items; track item.label + item.project) { <button class="calendar-event {{ item.tone }}" type="button"><span class="calendar-event-dot"></span><span class="calendar-event-title">{{ item.label }}</span></button> }</div> }</div></div>
                    </div>
                    <div class="pm101-view" [class.is-hidden]="selectedView !== 'pm101'" data-work-view="pm101">
                      @if (onboardingPm101Locked) {
                        <article class="pm101-assignment-banner" aria-label="PM 101 assignment status">
                          <img class="pm101-assignment-banner-art" src="./assets/pm101-assignment-banner.png" alt="" aria-hidden="true" />
                          <div class="pm101-assignment-banner-copy">
                            <strong>Awaiting first assignment</strong>
                            <p>Your workspace is ready. PMO assignment will unlock project planning.</p>
                            <button class="pm101-assignment-pill" type="button" (click)="openPm101OnboardingWorkspace()" aria-label="Open first assigned project flow">
                              <span class="icon" aria-hidden="true"><i data-lucide="bell"></i></span>
                              <span>Waiting for PMO assignment</span>
                            </button>
                          </div>
                          <span class="pm101-assignment-banner-icon" aria-hidden="true">
                            <img src="./assets/workspace-card-box-dark.svg" alt="" />
                          </span>
                        </article>
                        <div class="pm101-journey-head">
                          <span>What happens next?</span>
                          <h3>Your project management journey</h3>
                          <p>From assignment to regular reporting, these are the steps you will work through in TASAMA.</p>
                        </div>
                      } @else if (isPm101OnboardingWorkspaceFlow) {
                        <div class="pm101-ready-hero-grid" aria-label="First assigned project overview">
                          <article class="pm101-ready-banner">
                            <img class="pm101-ready-banner-art" src="./assets/pm101-first-project-banner-bg.png" alt="" aria-hidden="true" />
                            <div class="pm101-ready-banner-copy">
                              <strong>Your first project is ready to plan!</strong>
                              <p>PMO assigned UAE Research Map to your workspace. Start with building the baseline project plan, then get it endorsed and start tracking progress!</p>
                            </div>
                          </article>
                          <article class="pm101-ready-project-card">
                            <img class="pm101-ready-project-card-art" src="./assets/pm101-first-project-card-bg.png" alt="" aria-hidden="true" />
                            <span class="pm101-ready-project-chip">New project assigned by PMO</span>
                            <strong class="pm101-ready-project-title">UAE Research Map</strong>
                            <button class="pm101-ready-project-cta" type="button" (click)="openAssignedProjectPlan()" aria-label="Create project plan for UAE Research Map">
                              <span>Create project plan</span>
                              <span class="pm101-ready-project-cta-arrow" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                            </button>
                            <span class="pm101-ready-project-icon" aria-hidden="true">
                              <img src="./assets/workspace-card-box-dark.svg" alt="" />
                            </span>
                          </article>
                        </div>
                        <div class="pm101-journey-head">
                          <span>What happens next?</span>
                          <h3>Your project management journey</h3>
                          <p>From assignment to regular reporting, these are the steps you will work through in TASAMA.</p>
                        </div>
                      }
                      <div class="pm101-flow" aria-label="PM 101 project delivery flow">
                        <ol class="pm101-step-list">
                          @for (step of pm101Steps; track step.title) {
                            <li class="pm101-step">
                              <article class="pm101-card">
                                <span class="pm101-card-icon">
                                  <img class="pm101-card-icon-asset" [src]="step.iconAsset" alt="" />
                                </span>
                                <strong>{{ step.title }}</strong>
                                <p>{{ step.body }}</p>
                                <span [class]="'pm101-decor pm101-decor-' + step.decor" aria-hidden="true">
                                  @for (asset of step.decorAssets; track asset; let assetIndex = $index) {
                                    <img class="pm101-decor-asset pm101-decor-asset-{{ assetIndex + 1 }}" [src]="asset" alt="" />
                                  }
                                </span>
                                @if (step.footerLabel && step.footerValue) {
                                  <div class="pm101-card-footer pm101-card-footer-meta">
                                    <span>{{ step.footerLabel }}</span>
                                    <strong>{{ step.footerValue }}</strong>
                                  </div>
                                } @else if (step.footerAction) {
                                  <div class="pm101-card-footer pm101-card-footer-link">
                                    <span>{{ step.footerAction }}</span>
                                    <span class="pm101-card-footer-arrow" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                                  </div>
                                } @else if (step.footerIconOnly) {
                                  <div class="pm101-card-footer pm101-card-footer-icon-only">
                                    <span class="pm101-card-footer-arrow" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                                  </div>
                                }
                              </article>
                            </li>
                          }
                        </ol>
                      </div>
                    </div>
                    <div class="stages-view" [class.is-hidden]="selectedView !== 'stages'" data-work-view="stages">
                      <div class="view-toolbar">
                        <div>
                          <strong>{{ isAllProjects ? 'All assigned project stages' : scopedProjectName + ' stages' }}</strong>
                          <span>{{ stageProfilesForSelection.length }} project{{ stageProfilesForSelection.length === 1 ? '' : 's' }} shown. Open a stage gate to review readiness.</span>
                        </div>
                      </div>
                      <div class="portfolio-stage-overview">
                        @for (profile of stageProfilesForSelection; track profile.project) {
                          <article class="portfolio-stage-row {{ profile.tone }}">
                            <div class="portfolio-stage-project">
                              <strong>{{ profile.project }}</strong>
                              <span>{{ stageDefinitions[profile.currentStage].label }} stage · {{ profile.gateDone }}/{{ profile.gateTotal }} ready</span>
                            </div>
                            <div class="portfolio-stage-flow" [attr.aria-label]="profile.project + ' lifecycle stage flow'">
                              @for (stage of stageDefinitions; track stage.id; let index = $index) {
                                <span class="portfolio-flow-step" [class.complete]="index < profile.currentStage" [class.current]="index === profile.currentStage" [class.upcoming]="index > profile.currentStage">
                                  <i>{{ index + 1 }}</i>
                                  <b>{{ stage.label }}</b>
                                </span>
                              }
                            </div>
                            <div class="portfolio-stage-status">
                              <strong>{{ stageDefinitions[profile.currentStage].label }}</strong>
                              <span>{{ profile.gateDone }}/{{ profile.gateTotal }} ready</span>
                              <span>Due {{ profile.gateDue }}</span>
                            </div>
                            <button class="portfolio-stage-action" type="button" (click)="openStageGate(profile)" [attr.aria-label]="'Open ' + profile.project + ' ' + stageDefinitions[profile.currentStage].gate">
                              <span>Review gate</span>
                              <span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                            </button>
                          </article>
                        }
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div class="right-column" [class.portfolio-frontdoor]="isAllProjects || onboardingPm101Locked || isPm101OnboardingWorkspaceFlow" [class.project-frontdoor]="!isAllProjects && !onboardingPm101Locked && !isPm101OnboardingWorkspaceFlow" [class.pm101-locked-right]="onboardingPm101Locked || isPm101OnboardingWorkspaceFlow">
                @if (isPm101OnboardingWorkspaceFlow) {
                  <section class="top-deck" aria-label="PM front door actions" data-tour-target="frontdoor-actions">
                    <button class="action-card workspace-command" type="button" (click)="navigate('workspaces')">
                      <span class="action-icon"><img src="./assets/workspace-card-box.svg" alt="" aria-hidden="true" /></span>
                      <span class="action-copy"><strong>Workspaces</strong><small>Open project rooms</small></span>
                      <span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span>
                    </button>
                    <button class="action-card learning-command" type="button" (click)="setView('pm101')">
                      <span class="action-icon"><img src="./assets/workspace-card-notebook.svg" alt="" aria-hidden="true" /></span>
                      <span class="action-copy"><strong>Learning Hub</strong><small>Guides and playbooks</small></span>
                      <span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span>
                    </button>
                  </section>
                  <section class="side-card report-widget locked-empty-report-widget pm101-ready-report-widget" data-tour-target="right-report-widget">
                    <div class="report-widget-head">
                      <div>
                        <h2>Reporting trends</h2>
                        <small>View latest status reports here</small>
                      </div>
                    </div>
                    <div class="locked-report-illustration" aria-hidden="true">
                      <article class="locked-report-card locked-report-card-vision">
                        <div class="locked-report-card-head">
                          <strong>Vision 2030</strong>
                          <span class="locked-report-chip off-track">Off track</span>
                        </div>
                        <div class="locked-report-status-bar">
                          <span><span class="icon"><i data-lucide="triangle-alert"></i></span><small>Mar</small></span>
                          <span><span class="icon"><i data-lucide="circle-check"></i></span><small>Apr</small></span>
                          <span><span class="icon"><i data-lucide="circle-x"></i></span><small>May</small></span>
                        </div>
                        <div class="locked-report-card-foot">
                          <span class="locked-report-foot-copy"><span class="icon"><i data-lucide="history"></i></span><small>Overdue by 5 days</small></span>
                          <span class="locked-report-create"><span class="icon"><i data-lucide="file-text"></i></span><small>Create</small></span>
                        </div>
                      </article>
                      <article class="locked-report-card locked-report-card-neom">
                        <div class="locked-report-card-head">
                          <strong>NEOM Integration</strong>
                          <span class="locked-report-chip on-track">On track</span>
                        </div>
                        <div class="locked-report-status-bar compact">
                          <span><span class="icon"><i data-lucide="circle-check"></i></span><small>Mar</small></span>
                          <span><span class="icon"><i data-lucide="triangle-alert"></i></span><small>Apr</small></span>
                          <span><span class="icon"><i data-lucide="circle-x"></i></span><small>May</small></span>
                        </div>
                        <div class="locked-report-card-foot">
                          <span class="locked-report-foot-copy"><span class="icon"><i data-lucide="history"></i></span><small>Overdue by 5 days</small></span>
                          <span class="locked-report-create"><span class="icon"><i data-lucide="file-text"></i></span><small>Create</small></span>
                        </div>
                      </article>
                      <div class="locked-report-magnifier">
                        <span class="locked-report-chip on-track">On track</span>
                      </div>
                      <div class="locked-report-timeline">
                        <span><span class="icon"><i data-lucide="circle-check"></i></span><small>Mar</small></span>
                        <span><span class="icon"><i data-lucide="triangle-alert"></i></span><small>Apr</small></span>
                        <span><span class="icon"><i data-lucide="circle-x"></i></span><small>May</small></span>
                      </div>
                    </div>
                    <div class="locked-report-copy">
                      <strong>You haven't reach reporting yet</strong>
                      <p>Once you have active projects and start reporting progress - your reporting trends &amp; upcoming reports will appear in this section</p>
                    </div>
                  </section>
                } @else if (onboardingPm101Locked) {
                  <section class="top-deck" aria-label="PM front door actions" data-tour-target="frontdoor-actions">
                    <button class="action-card workspace-command is-locked" type="button" (click)="navigate('workspaces')" aria-disabled="true" title="Available after PM 101 onboarding">
                      <span class="action-icon"><img src="./assets/workspace-card-box.svg" alt="" aria-hidden="true" /></span>
                      <span class="action-copy"><strong>Workspaces</strong><small>Open project rooms</small></span>
                      <span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span>
                    </button>
                    <button class="action-card learning-command" type="button" (click)="setView('pm101')">
                      <span class="action-icon"><img src="./assets/workspace-card-notebook.svg" alt="" aria-hidden="true" /></span>
                      <span class="action-copy"><strong>Learning Hub</strong><small>Guides and playbooks</small></span>
                      <span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span>
                    </button>
                  </section>
                  <section class="side-card report-widget locked-empty-report-widget" data-tour-target="right-report-widget">
                    <div class="report-widget-head">
                      <div>
                        <h2>Reporting trends</h2>
                        <small>View latest status reports here</small>
                      </div>
                    </div>
                    <div class="locked-report-illustration" aria-hidden="true">
                      <article class="locked-report-card locked-report-card-vision">
                        <div class="locked-report-card-head">
                          <strong>Vision 2030</strong>
                          <span class="locked-report-chip off-track">Off track</span>
                        </div>
                        <div class="locked-report-status-bar">
                          <span><span class="icon"><i data-lucide="triangle-alert"></i></span><small>Mar</small></span>
                          <span><span class="icon"><i data-lucide="circle-check"></i></span><small>Apr</small></span>
                          <span><span class="icon"><i data-lucide="circle-x"></i></span><small>May</small></span>
                        </div>
                        <div class="locked-report-card-foot">
                          <span class="locked-report-foot-copy"><span class="icon"><i data-lucide="history"></i></span><small>Overdue by 5 days</small></span>
                          <span class="locked-report-create"><span class="icon"><i data-lucide="file-text"></i></span><small>Create</small></span>
                        </div>
                      </article>
                      <article class="locked-report-card locked-report-card-neom">
                        <div class="locked-report-card-head">
                          <strong>NEOM Integration</strong>
                          <span class="locked-report-chip on-track">On track</span>
                        </div>
                        <div class="locked-report-status-bar compact">
                          <span><span class="icon"><i data-lucide="circle-check"></i></span><small>Mar</small></span>
                          <span><span class="icon"><i data-lucide="triangle-alert"></i></span><small>Apr</small></span>
                          <span><span class="icon"><i data-lucide="circle-x"></i></span><small>May</small></span>
                        </div>
                        <div class="locked-report-card-foot">
                          <span class="locked-report-foot-copy"><span class="icon"><i data-lucide="history"></i></span><small>Overdue by 5 days</small></span>
                          <span class="locked-report-create"><span class="icon"><i data-lucide="file-text"></i></span><small>Create</small></span>
                        </div>
                      </article>
                      <div class="locked-report-magnifier">
                        <span class="locked-report-chip on-track">On track</span>
                      </div>
                      <div class="locked-report-timeline">
                        <span><span class="icon"><i data-lucide="circle-check"></i></span><small>Mar</small></span>
                        <span><span class="icon"><i data-lucide="triangle-alert"></i></span><small>Apr</small></span>
                        <span><span class="icon"><i data-lucide="circle-x"></i></span><small>May</small></span>
                      </div>
                    </div>
                    <div class="locked-report-copy">
                      <strong>You haven't reach reporting yet</strong>
                      <p>Once you have active projects and start reporting progress - your reporting trends &amp; upcoming reports will appear in this section</p>
                    </div>
                  </section>
                } @else {
                  @if (isAllProjects) { <section class="top-deck" aria-label="PM front door actions" data-tour-target="frontdoor-actions"><button class="action-card workspace-command" type="button" (click)="navigate('workspaces')" [disabled]="onboardingPm101Locked" [attr.aria-disabled]="onboardingPm101Locked ? 'true' : null" [attr.title]="onboardingPm101Locked ? 'Available after PM 101 onboarding' : null"><span class="action-icon"><img src="./assets/workspace-card-box.svg" alt="" aria-hidden="true" /></span><span class="action-copy"><strong>Workspaces</strong><small>Open project rooms</small></span><span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span></button><button class="action-card learning-command" type="button" (click)="setView('pm101')"><span class="action-icon"><img src="./assets/workspace-card-notebook.svg" alt="" aria-hidden="true" /></span><span class="action-copy"><strong>Learning Hub</strong><small>Guides and playbooks</small></span><span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span></button></section> }
                  <section class="side-card report-widget" [class.portfolio-report-widget]="isAllProjects" data-tour-target="right-report-widget"><div class="report-widget-head"><div><h2>{{ isAllProjects ? 'Reporting trends' : 'Project report trend' }}</h2><small>Last 3 PSR statuses</small></div></div><div class="report-trend-list">@for (report of visibleReportRows; track report.project) { <article class="report-trend-row {{ reportFrontdoorTone(report) }}"><div class="report-trend-row-head"><strong>{{ report.project }}</strong><span class="report-health-chip {{ reportFrontdoorTone(report) }}">{{ reportDueToneLabel(reportFrontdoorTone(report)) }}</span></div><div class="report-trend" style="--report-trend-count:3" aria-label="Status report trend">@for (point of report.trend; track point.label) { <span class="report-trend-point {{ reportStatusTone(point.status) }}"><span class="report-status-icon {{ reportStatusTone(point.status) }}" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="reportStatusIcon(point.status)"></i></span></span><small>{{ point.label }}</small></span> }</div><div class="report-trend-row-foot"><span class="report-row-due"><span class="icon" aria-hidden="true"><i data-lucide="history"></i></span><span>{{ reportDueText(report) }}</span></span><button class="report-row-create" type="button" (click)="openReport(report.project)"><span class="icon" aria-hidden="true"><i data-lucide="file-text"></i></span><span>Create</span></button></div></article> }</div></section>
                  @if (!isAllProjects) { <ng-container [ngTemplateOutlet]="quickLinksPanel"></ng-container> }
                }
              </div>
            </div>
          }
        }
      }
    </main>

    @if (activeReportProject) {
      <div class="report-drawer-shell" aria-live="polite">
        <button class="report-drawer-backdrop" type="button" (click)="closeReport()" aria-label="Close report drawer"></button>
        <aside class="report-drawer" [attr.aria-label]="activeReport.project + ' report draft'">
          <form class="report-compose-form" (submit)="saveReport($event)">
            <div class="report-drawer-top report-drawer-top-simple">
              <button class="drawer-close report-simple-close" type="button" (click)="closeReport()" aria-label="Close drawer"><span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span></button>
              <div class="report-simple-header">
                <div class="report-simple-header-row">
                  <div class="report-drawer-title"><h2>{{ activeReport.project }}</h2><p>Project Report</p></div>
                  <div class="report-simple-meta">
                    <span>Stage: <strong class="report-simple-chip indigo">{{ activeReportDetails.stage }}</strong></span>
                    <span>State: <strong class="report-simple-chip {{ reportBadgeTone(activeReportDetails.state, 'neutral') }}">{{ activeReportDetails.state }}</strong></span>
                    <span>Plan: <strong class="report-simple-chip {{ simpleReportPlanChipTone }}">{{ simpleReportPlanLabel }}</strong></span>
                  </div>
                </div>

                <div class="report-simple-toolbar">
                  <div class="report-simple-mode-tabs" [class.is-detailed]="activeReportMode === 'detailed'" role="tablist" aria-label="Report view">
                    <button [class.active]="activeReportMode === 'simple'" type="button" [attr.aria-selected]="activeReportMode === 'simple'" role="tab" (click)="setReportMode('simple')"><span class="icon" aria-hidden="true"><i data-lucide="calendar"></i></span><span>Simple</span></button>
                    <button [class.active]="activeReportMode === 'detailed'" type="button" [attr.aria-selected]="activeReportMode === 'detailed'" role="tab" (click)="setReportMode('detailed')"><span class="icon" aria-hidden="true"><i data-lucide="layout-grid"></i></span><span>Detailed</span></button>
                  </div>
                  <div class="report-simple-toolbar-copy">
                    <span>Reporting Interval - <strong>{{ simpleReportIntervalLabel }}</strong></span>
                    <span>Report Status: <strong class="{{ simpleReportStatusTone }}">{{ simpleReportPlanLabel }}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="report-drawer-body" [class.report-drawer-body-detailed]="activeReportMode === 'detailed'">
              @if (activeReportMode === 'simple') {
                <section class="report-layout-stack" aria-label="Simple project plan report">
                  @let overviewCard = simpleReportOverviewCard;
                  <article class="report-layout-card report-layout-card-overview {{ overviewCard.tone }}">
                    <div class="report-layout-card-head">
                      <div>
                        <h3>{{ overviewCard.title }}</h3>
                        <p>{{ overviewCard.body }}</p>
                      </div>
                      <strong class="report-layout-pill {{ overviewCard.tone }}">{{ overviewCard.status }}</strong>
                    </div>

                    <div class="report-layout-summary">
                      <div class="report-layout-summary-box report-layout-status-box">
                        <span class="report-layout-box-label">Status</span>
                        <div class="report-inline-status" role="radiogroup" aria-label="Simple report overall status">
                          @for (option of reportStatusOptions; track option.label) {
                            <label class="{{ option.tone }}"><input type="radio" name="simple-overall-status" [checked]="isReportStatusSelected(option.value, overviewCard.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                          }
                        </div>
                      </div>
                      <div class="report-layout-summary-box report-layout-trend-box">
                        <span class="report-layout-box-label">Overall Status Trend</span>
                        <strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>{{ overviewCard.trend }}</strong>
                      </div>
                      <div class="report-layout-summary-box report-layout-past-box">
                        <span class="report-layout-box-label">Past Trend</span>
                        <div class="report-status-timeline">
                          @for (point of overviewCard.timeline; track point.date) {
                            <span class="{{ point.tone }}" [title]="point.label"><i><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></i><small>{{ point.date }}</small></span>
                          }
                        </div>
                      </div>
                    </div>

                    <label class="report-layout-comment">
                      <span>Comments</span>
                      <textarea rows="4" maxlength="3000"></textarea>
                    </label>
                  </article>

                  @for (card of simpleReportCards; track card.id; let cardIndex = $index) {
                    <article class="report-layout-card report-layout-card-section {{ card.tone }}">
                      <div class="report-layout-card-head">
                        <div>
                          <h3>{{ card.title }}</h3>
                          <p>{{ card.body }}</p>
                        </div>
                        <strong class="report-layout-pill {{ card.tone }}">{{ card.status }}</strong>
                      </div>

                      <div class="report-layout-summary">
                      <div class="report-layout-summary-box report-layout-status-box">
                          <span class="report-layout-box-label">Status</span>
                          <div class="report-inline-status" role="radiogroup" [attr.aria-label]="card.title + ' status'">
                            @for (option of reportStatusOptions; track option.label) {
                              <label class="{{ option.tone }}"><input type="radio" [attr.name]="'simple-card-status-' + cardIndex" [checked]="isReportStatusSelected(option.value, card.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                            }
                          </div>
                        </div>
                        <div class="report-layout-summary-box report-layout-trend-box">
                          <span class="report-layout-box-label">Overall Status Trend</span>
                          <strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>{{ card.trend }}</strong>
                        </div>
                        <div class="report-layout-summary-box report-layout-past-box">
                          <span class="report-layout-box-label">Past Trend</span>
                          <div class="report-status-timeline">
                            @for (point of card.timeline; track point.date) {
                              <span class="{{ point.tone }}" [title]="point.label"><i><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></i><small>{{ point.date }}</small></span>
                            }
                          </div>
                        </div>
                      </div>

                      <label class="report-layout-comment">
                        <span>Comments</span>
                        <textarea rows="4" maxlength="3000"></textarea>
                      </label>
                    </article>
                  }
                </section>
              } @else {
                <nav class="report-section-nav" aria-label="Report sections" role="tablist">
                  @for (section of reportSections; track section) {
                    <button
                      type="button"
                      [class.active]="activeReportSection === section"
                      [attr.aria-selected]="activeReportSection === section"
                      (click)="setReportSection(section)"
                      role="tab"
                    >
                      <span class="report-section-name">{{ section }}</span>
                      <span class="report-section-fill" [class.complete]="section === 'Overview'" [class.partial]="section !== 'Overview'" aria-hidden="true">
                        @if (section === 'Overview') { <span class="icon"><i data-lucide="circle-check"></i></span> }
                      </span>
                    </button>
                  }
                </nav>

                <div class="report-section-stack">
                  <div class="report-overview-group" [hidden]="activeReportSection !== 'Overview'" role="tabpanel">
                    @let overviewCard = simpleReportOverviewCard;
                    <article class="report-layout-card {{ overviewCard.tone }} report-detail-overview-card">
                      <div class="report-layout-card-head">
                        <div>
                          <h3>{{ overviewCard.title }}</h3>
                          <p>{{ overviewCard.body }}</p>
                        </div>
                        <strong class="report-layout-pill {{ overviewCard.tone }}">{{ overviewCard.status }}</strong>
                      </div>

                      <div class="report-layout-summary">
                        <div class="report-layout-summary-box report-layout-status-box">
                          <span class="report-layout-box-label">Status</span>
                          <div class="report-inline-status" role="radiogroup" aria-label="Overall status">
                            @for (option of reportStatusOptions; track option.label) {
                              <label class="{{ option.tone }}"><input type="radio" name="overall-status" [checked]="isReportStatusSelected(option.value, overviewCard.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                            }
                          </div>
                        </div>
                        <div class="report-layout-summary-box report-layout-trend-box">
                          <span class="report-layout-box-label">Overall Status Trend</span>
                          <strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>{{ overviewCard.trend }}</strong>
                        </div>
                        <div class="report-layout-summary-box report-layout-past-box">
                          <span class="report-layout-box-label">Past Trend</span>
                          <div class="report-status-timeline">
                            @for (point of overviewCard.timeline; track point.date) {
                              <span class="{{ point.tone }}" [title]="point.label"><i><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></i><small>{{ point.date }}</small></span>
                            }
                          </div>
                        </div>
                      </div>

                      <label class="report-layout-comment">
                        <span>Comments</span>
                        <textarea rows="4" maxlength="3000"></textarea>
                      </label>
                    </article>

                    <div class="report-detail-narratives">
                      @for (field of detailedOverviewFields; track field.label) {
                        <label class="report-layout-field">
                          <span>{{ field.label }} @if (field.hint) { <small>{{ field.hint }}</small> }</span>
                          <textarea [rows]="field.rows" maxlength="3000"></textarea>
                        </label>
                      }
                    </div>
                  </div>

                  @for (area of reportReviewAreas; track area.label) {
                    @if (area.label === 'Scope') {
                      <section class="report-area-section report-scope-section" [hidden]="activeReportSection !== area.label" role="tabpanel">
                        <article class="report-layout-card report-detail-overview-card report-scope-overview-card red">
                          <div class="report-layout-card-head">
                            <div>
                              <h3>Overall Status</h3>
                              <p>Define your project overall status.</p>
                            </div>
                            <strong class="report-layout-pill {{ reportBadgeTone(area.status) }}">{{ area.status }}</strong>
                          </div>

                          <div class="report-layout-summary">
                            <div class="report-layout-summary-box report-layout-status-box">
                              <span class="report-layout-box-label">Status:</span>
                              <div class="report-inline-status" role="radiogroup" aria-label="Scope overall status">
                                @for (option of reportStatusOptions; track option.label) {
                                  <label class="{{ option.tone }}"><input type="radio" name="scope-overall-status" [checked]="isReportStatusSelected(option.value, area.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                                }
                              </div>
                            </div>
                            <div class="report-layout-summary-box report-layout-trend-box">
                              <span class="report-layout-box-label">Overall Status Trend:</span>
                              <strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>{{ reportTrendForTone(area.tone) }}</strong>
                            </div>
                            <div class="report-layout-summary-box report-layout-past-box">
                              <span class="report-layout-box-label">Past reported statuses</span>
                              <div class="scope-status-timeline">
                                @for (past of scopePastStatuses; track past.date) {
                                  <span class="{{ past.tone }}" [title]="past.label"><i><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(past.tone)"></i></span></i><small>{{ past.date }}</small></span>
                                }
                              </div>
                            </div>
                          </div>

                          <label class="report-layout-comment">
                            <span>Comments</span>
                            <textarea rows="4" maxlength="3000"></textarea>
                          </label>
                        </article>

                        <section class="scope-group-card scope-products-section" aria-label="Scope end products">
                          <div class="scope-group-head">
                            <div><strong>End Product</strong><span>{{ scopeProducts.length }} items</span></div>
                            <button class="scope-group-link" type="button">Add to report</button>
                          </div>
                          <div class="scope-product-list">
                            @for (product of scopeProducts; track product.title) {
                              <article class="scope-product-card">
                                <div class="scope-product-head">
                                  <div class="scope-product-title">
                                    @if (product.icon) {
                                      <span class="scope-product-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(product.icon)"></i></span></span>
                                    } @else {
                                      <span class="scope-product-check" aria-hidden="true"></span>
                                    }
                                    <strong>{{ product.title }}</strong>
                                  </div>
                                  <button class="scope-select-pill" type="button">
                                    <span class="scope-select-pill-knob" aria-hidden="true"></span>
                                    <span>Select</span>
                                  </button>
                                </div>

                                <div class="scope-product-grid">
                                  <span><small>Type</small><strong>{{ product.type }}</strong></span>
                                  <span><small>Product owner</small><strong>{{ product.owner }}</strong></span>
                                  <span><small>Capability</small><strong>{{ product.capability }}</strong></span>
                                  <span><small>Start - end date</small><strong>{{ product.dates }}</strong></span>
                                  <span><small>Budget</small><strong>{{ product.budget }}</strong></span>
                                </div>

                                <div class="scope-product-controls">
                                  <label class="scope-product-field scope-product-field-select">
                                    <span>Report status</span>
                                    <span class="scope-field-control scope-field-control-select">
                                      <select [attr.aria-label]="'Report status for ' + product.title">
                                        <option value=""></option>
                                        <option>On track</option>
                                        <option>Alert</option>
                                        <option>Off track</option>
                                      </select>
                                      <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                    </span>
                                  </label>
                                  <label class="scope-product-field">
                                    <span>Actual start</span>
                                    <input type="text" [value]="product.actualStart" />
                                  </label>
                                  <label class="scope-product-field">
                                    <span>Actual end</span>
                                    <input type="text" [value]="product.actualEnd" />
                                  </label>
                                  <label class="scope-product-field">
                                    <span>Completed</span>
                                    <span class="scope-percent-input"><input type="text" [value]="product.completed" /><span>%</span></span>
                                  </label>
                                </div>
                              </article>
                            }
                          </div>
                        </section>
                      </section>
                    } @else {
                      <section class="report-section-stack report-area-section" [hidden]="activeReportSection !== area.label" role="tabpanel">
                        @let areaCard = detailedReportAreaCard(area);
                        <article class="report-layout-card report-detail-overview-card {{ areaCard.tone }}">
                          <div class="report-layout-card-head">
                            <div>
                              <h3>Overall Status</h3>
                              <p>Define your project overall status.</p>
                            </div>
                            <strong class="report-layout-pill {{ areaCard.tone }}">{{ areaCard.status }}</strong>
                          </div>

                          <div class="report-layout-summary">
                            <div class="report-layout-summary-box report-layout-status-box">
                              <span class="report-layout-box-label">Status:</span>
                              <div class="report-inline-status" role="radiogroup" [attr.aria-label]="area.label + ' overall status'">
                                @for (option of reportStatusOptions; track option.label) {
                                  <label class="{{ option.tone }}"><input type="radio" [attr.name]="areaCard.id + '-overall-status'" [checked]="isReportStatusSelected(option.value, areaCard.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                                }
                              </div>
                            </div>
                            <div class="report-layout-summary-box report-layout-trend-box">
                              <span class="report-layout-box-label">Overall Status Trend:</span>
                              <strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>{{ areaCard.trend }}</strong>
                            </div>
                            <div class="report-layout-summary-box report-layout-past-box">
                              <span class="report-layout-box-label">Past reported statuses</span>
                              <div class="report-status-timeline">
                                @for (point of areaCard.timeline; track point.date) {
                                  <span class="{{ point.tone }}" [title]="point.label"><i><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></i><small>{{ point.date }}</small></span>
                                }
                              </div>
                            </div>
                          </div>

                          <label class="report-layout-comment">
                            <span>Comments</span>
                            <textarea rows="4" maxlength="3000">{{ areaCard.comments }}</textarea>
                          </label>
                        </article>

                        <section class="report-form-section">
                          <div class="report-section-head"><div><h3>{{ area.label }}</h3></div><span class="report-area-pill {{ area.tone }}">{{ area.status }}</span></div>
                          <label class="report-form-field"><span>Update</span><textarea rows="2">{{ area.note }}</textarea></label>
                        </section>
                      </section>
                    }
                  }
                </div>
              }
            </div>

            <div class="report-drawer-footer">
              <button class="report-secondary-button" type="button" (click)="closeReport()">Cancel</button>
              <button class="report-submit-button" type="submit">Save</button>
            </div>
          </form>
        </aside>
      </div>
    }

    @if (selectedStageGateContext; as gate) {
      <div class="stage-drawer-shell" aria-live="polite">
        <button class="stage-drawer-backdrop" type="button" (click)="closeStageGate()" aria-label="Close stage gate drawer"></button>
        <aside class="stage-gate-drawer" [attr.aria-label]="gate.profile.project + ' ' + gate.stage.gate + ' submission'">
          <div class="drawer-head">
            <button class="drawer-close" type="button" (click)="closeStageGate()" aria-label="Close drawer"><span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span></button>
            <div>
              <span class="eyebrow">{{ gate.profile.project }}</span>
              <h2>{{ gate.stage.gate }}</h2>
              <p>{{ gate.stage.label }} stage gate submission</p>
            </div>
          </div>
          <div class="drawer-status-card {{ gate.status }}">
            <strong>{{ stageStatusLabel(gate.status) }}</strong>
            <span>{{ gateReadinessText(gate.profile, gate.status) }} • Due {{ gate.profile.gateDue }}</span>
          </div>
          <form class="stage-gate-form" (submit)="submitStageGate($event, gate.status)">
            <div class="drawer-section">
              <span class="drawer-section-title">Checklist</span>
              @for (item of gate.profile.checklist; track item; let index = $index) {
                <label>
                  <input type="checkbox" [checked]="index < gate.checkedCount" [disabled]="gate.status === 'complete'" />
                  <span>{{ item }}</span>
                </label>
              }
            </div>
            <div class="drawer-section compact">
              <span class="drawer-section-title">Evidence</span>
              <p>{{ gate.profile.checkpoint }}</p>
            </div>
            <button class="drawer-submit" type="submit" [disabled]="!canSubmitStageGate(gate.status)">
              {{ stageGateSubmitLabel(gate.status) }}
            </button>
          </form>
        </aside>
      </div>
    }

    <ng-template #quickLinksPanel>
      <section class="side-card context-card quick-actions-card" aria-label="Project Quick links">
        <div class="quick-card-head"><h2>Project Quick links</h2></div>
        <div class="quick-action-list">
          <div class="quick-action-grid">
            @for (action of quickLinksPageActions; track action.id) {
              <ng-container [ngTemplateOutlet]="quickLinkCard" [ngTemplateOutletContext]="{ action, pinnedIds }"></ng-container>
            }
          </div>
          @if (quickLinksTotalPages > 1) {
            <div class="quick-links-pager" aria-label="Quick links pages">
              <button class="quick-links-page-button" type="button" (click)="shiftQuickLinksPage(-1)" [disabled]="quickLinksPageIndex === 0" aria-label="Previous quick links page">
                <span class="icon" aria-hidden="true"><i data-lucide="arrow-left"></i></span>
              </button>
              <div class="quick-links-page-dots" aria-hidden="true">
                @for (page of quickLinksPageDots; track page) {
                  <span [class.active]="page === quickLinksPageIndex"></span>
                }
              </div>
              <button class="quick-links-page-button" type="button" (click)="shiftQuickLinksPage(1)" [disabled]="quickLinksPageIndex >= quickLinksTotalPages - 1" aria-label="Next quick links page">
                <span class="icon" aria-hidden="true"><i data-lucide="arrow-right"></i></span>
              </button>
            </div>
          }
        </div>
      </section>
    </ng-template>

    <ng-template #quickLinkCard let-action="action" let-pinnedIds="pinnedIds">
      <article class="quick-action quick-link-card" [class.is-pinned]="pinnedIds.includes(action.id)" [attr.data-quick-link-id]="action.id">
        <button class="quick-action-main" type="button" [attr.aria-label]="action.title + ' for ' + scopedProjectName" (click)="openQuickAction(action)"><span class="quick-action-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(action.icon)"></i></span></span><span class="quick-action-label">{{ action.title }}</span></button>
        <button class="quick-pin-button" type="button" (click)="togglePinned(action.id)" [attr.aria-label]="(pinnedIds.includes(action.id) ? 'Unpin ' : 'Pin ') + action.title" [title]="pinnedIds.includes(action.id) ? 'Unpin' : 'Pin'" [attr.data-pin-label]="pinnedIds.includes(action.id) ? 'Unpin' : 'Pin'"><span class="icon quick-pin-default" aria-hidden="true"><i data-lucide="pin"></i></span><span class="icon quick-pin-unpin" aria-hidden="true"><i data-lucide="pin-off"></i></span></button>
      </article>
    </ng-template>

    @if (quickLinksToast) {
      <div class="quick-links-toast" role="status" aria-live="polite">
        <span class="icon" aria-hidden="true"><i data-lucide="triangle-alert"></i></span>
        <span>{{ quickLinksToast }}</span>
      </div>
    }

    @if (guidedTourActive) {
      @let step = activeGuidedTourStep;
      <div class="guided-tour-overlay" data-tour-overlay [attr.data-tour-target-name]="step.target" aria-live="polite">
        <div class="guided-tour-shade" aria-hidden="true"></div>
        <div class="guided-tour-spotlight" data-tour-spotlight aria-hidden="true"></div>
        <section class="guided-tour-card" data-tour-card role="dialog" aria-modal="true" [attr.aria-label]="step.title">
          <button class="guided-tour-close" type="button" (click)="completeGuidedTour()" aria-label="End guided tour">
            <span class="icon" aria-hidden="true"><i data-lucide="x"></i></span>
          </button>
          <span class="guided-tour-kicker">Guided tour · {{ guidedTourStep + 1 }} of {{ guidedTourSteps.length }}</span>
          <h2>{{ step.title }}</h2>
          <p>{{ step.body }}</p>
          <div class="guided-tour-progress" aria-hidden="true">
            @for (tourStep of guidedTourSteps; track tourStep.target; let index = $index) {
              <span [class.active]="index === guidedTourStep"></span>
            }
          </div>
          <div class="guided-tour-actions">
            <button class="guided-tour-secondary" type="button" (click)="previousGuidedTourStep()" [disabled]="guidedTourStep === 0">Back</button>
            <button class="guided-tour-secondary" type="button" (click)="completeGuidedTour()">Skip</button>
            <button class="guided-tour-primary" type="button" (click)="nextGuidedTourStep()">{{ isLastGuidedTourStep ? 'Finish' : 'Next' }}</button>
          </div>
        </section>
      </div>
    }
  `,
})
export class PmConsoleContentComponent implements AfterViewChecked, OnChanges, OnDestroy {
  @Input() selectedProject = 'all';
  @Input() selectedPage: ConsolePage = 'workspace';
  @Input() selectedView: WorkspaceView = 'calendar';
  @Input() frontDoorMode = 'assigned';
  @Input() pmoAssignmentReady = false;
  @Input() guidedTourActive = false;
  @Input() guidedTourExitMode: string | null = null;
  @Input() onboardingPm101Locked = false;
  @Output() readonly consoleStateChange = new EventEmitter<Partial<PmConsoleMountOptions>>();

  readonly workspaceTableProjects = workspaceTableProjects;
  readonly benefitRegisterRows = benefitRegisterRows;
  readonly riskRegisterRows = riskRegisterRows;
  readonly workspaceTableColumns = workspaceTableColumns;
  readonly workspaceProjectCards = workspaceProjectCards;
  readonly projectQuickActions = projectQuickActions;
  readonly unassignedJourneySteps = unassignedJourneySteps;
  readonly firstAssignedProject = firstAssignedProject;
  readonly boardFilters = boardFilters;
  readonly pm101Steps = pm101Steps;
  readonly guidedTourSteps = guidedTourSteps;
  readonly stageDefinitions = stageDefinitions;
  readonly quickLinkPinLimit = QUICK_LINK_PIN_LIMIT;
  readonly primaryProjectPlanSections = ['Overview', 'Schedule & Scope', 'Budget', 'Benefits', 'Risk', 'Resource'];
  readonly additionalProjectPlanSections = ['Issues', 'Change Impact', 'Related Links', 'Dependency', 'Miscellaneous'];
  readonly projectReportMetrics = ['Total Reports', 'Reports Overview', 'Reporting Compliance'];
  readonly projectReportsRows = projectReportsRows;
  readonly projectReportTrendPoints = projectReportTrendPoints;
  readonly reportSections = ['Overview', 'Scope', 'Schedule', 'Budget', 'Benefits', 'Risks', 'Issues', 'Resource', 'Dependency'];
  readonly reportStatusOptions = [
    { label: 'On track', simpleLabel: 'On track', value: 'On track', tone: 'green', icon: 'checkMark' },
    { label: 'Alert/Discuss', simpleLabel: 'Alert', value: 'Alert', tone: 'amber', icon: 'bell' },
    { label: 'Off track', simpleLabel: 'Off track', value: 'Off Track', tone: 'red', icon: 'close' },
  ];
  readonly pastOverviewTrend = ['31/03/2026', '31/12/2025', '30/09/2025', '30/06/2025', '31/12/2024'];
  readonly scopePastStatuses = [
    { date: '31/03/2026', tone: 'red', label: 'Off track' },
    { date: '31/12/2025', tone: 'amber', label: 'Alert/Discuss' },
    { date: '30/09/2025', tone: 'red', label: 'Off track' },
    { date: '30/06/2025', tone: 'amber', label: 'Alert/Discuss' },
    { date: '31/12/2024', tone: 'red', label: 'Off track' },
  ];
  readonly scopeProducts = [
    { title: 'Collaboration platform', icon: 'dependencies', type: 'Technology', owner: 'Richelle Hilton', capability: 'Richelle Hilton', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: '', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
    { title: 'National R&D database', icon: 'database', type: 'Technology', owner: 'Richelle Hilton', capability: 'Richelle Hilton', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: '', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
    { title: 'Opportunity marketplace', icon: 'store', type: 'Technology', owner: 'Richelle Hilton', capability: 'Richelle Hilton', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: '', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
    { title: 'CRM', icon: '', type: 'Technology', owner: 'Richelle Hilton', capability: 'Richelle Hilton', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: '', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
  ];
  readonly reportReviewAreas = [
    { label: 'Scope', status: 'On track', note: 'Baseline unchanged', tone: 'green' },
    { label: 'Schedule', status: 'Alert', note: 'Gate evidence due this week', tone: 'amber' },
    { label: 'Budget', status: 'On track', note: 'No variance reported', tone: 'green' },
    { label: 'Benefits', status: 'Alert', note: 'Owner response pending', tone: 'amber' },
    { label: 'Risks', status: 'Off track', note: 'RAID refresh required', tone: 'red' },
    { label: 'Issues', status: 'On track', note: 'No blocker escalated', tone: 'green' },
    { label: 'Resource', status: 'On track', note: 'Core team assigned', tone: 'green' },
    { label: 'Dependency', status: 'Alert', note: 'External owner to confirm', tone: 'amber' },
  ];
  readonly planCards = [
    { title: 'Project setup', body: 'Core identifiers, baseline dates, and ownership.', icon: 'project' },
    { title: 'Scope and deliverables', body: 'Outputs, acceptance criteria, and management products.', icon: 'endProduct' },
    { title: 'Risks and dependencies', body: 'RAID controls and cross-project relationships.', icon: 'risks' },
    { title: 'Reporting', body: 'PSR cadence, trend history, and PMO evidence.', icon: 'list' },
  ];
  readonly simplePlanSections: SimplePlanSection[] = [
    {
      title: 'Project identity',
      body: 'Name the project and confirm who owns the first PMO handoff.',
      icon: 'rocket',
      readOnly: true,
      fields: [
        { label: 'Project name', value: 'UAE Research Map', mandatory: true },
        { label: 'Category', value: 'Research & Development', kind: 'select', options: ['Research & Development', 'Digital Transformation', 'Operations', 'Compliance'] },
        { label: 'Business Unit', value: 'Research Office', kind: 'select', options: ['Research Office', 'Strategy', 'Corporate Services', 'Technology'] },
        { label: 'PMO Contact', value: 'PMO Desk', mandatory: true },
        { label: 'Project Manager', value: 'Muna Hassan', avatarInitials: 'MH' },
      ],
    },
    {
      title: 'Purpose and outcome',
      body: 'Explain why this work exists and what success should produce.',
      icon: 'info',
      fields: [
        { label: 'Opportunity or Problem Statement', value: "The UAE's research ecosystem is fragmented and lacks a centralized, up-to-date platform to efficiently discover, connect, and leverage national R&D capabilities.", kind: 'textarea', wide: true },
        { label: 'Outcome', value: 'Reduce fragmentation in research efforts', kind: 'table', wide: true },
        { label: 'AI component', value: 'No', kind: 'boolean', mandatory: true },
      ],
    },
    {
      title: 'Dates and scope',
      body: 'Baseline, forecast, and delivery boundaries.',
      icon: 'calendar',
      fields: [
        { label: 'Baseline Start date', value: '2026-05-01', kind: 'date' },
        { label: 'Baseline End date', value: '2026-12-31', kind: 'date' },
        { label: 'In Scope', value: 'Research entities, universities, government stakeholders, industry partners, funding bodies, and R&D capability records.', kind: 'textarea', wide: true },
      ],
    },
    {
      title: 'Budget baseline',
      body: 'Capture the first approved funding view before detailed phasing.',
      icon: 'dollar',
      fields: [
        { label: 'CAPEX Baseline (FY)', value: '1,200,000', kind: 'money' },
        { label: 'OPEX Baseline (FY)', value: '420,000', kind: 'money' },
      ],
    },
    {
      title: 'Deliverables',
      body: 'Log the first risk PMO should see before endorsement.',
      icon: 'risks',
      fields: [
        { label: 'Risks Register', value: 'Stakeholder data quality', kind: 'table', wide: true },
      ],
    },
  ];
  readonly simpleReportSections = this.simplePlanSections.slice(1);
  readonly simpleReportGuides: SimpleReportGuide[] = [
    { focus: 'Overview', status: 'On track', tone: 'green', action: 'Attach outcome evidence' },
    { focus: 'Schedule & scope', status: 'Alert', tone: 'amber', action: 'Confirm forecast date or scope change' },
    { focus: 'Budget', status: 'On track', tone: 'green', action: 'Add finance baseline evidence' },
    { focus: 'Risk', status: 'Alert', tone: 'amber', action: 'Update owner and mitigation' },
  ];
  readonly wbsItems = [
    { title: 'Baselined Project Plan', owner: 'Sophia Brown', progress: '0%', level: 0, tone: 'late', left: '4%', width: '18%' },
    { title: 'Benefits baseline evidence', owner: 'Muna Hassan', progress: '45%', level: 1, tone: 'active', left: '10%', width: '20%' },
    { title: 'Citizen Service Portal', owner: 'Muna Hassan', progress: '38%', level: 0, tone: 'active', left: '22%', width: '32%' },
    { title: 'Execution stage gate', owner: 'Muna Hassan', progress: 'Planned', level: 0, tone: 'planned', left: '47%', width: '12%' },
  ];
  readonly months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  workspaceDisplay: WorkspaceDisplay = 'table';
  workspaceRegister: WorkspaceRegister = 'projects';
  calendarMonth = new Date(2026, 4, 1);
  pinnedIds = this.loadPinnedQuickLinks();
  visibleWorkspaceTableColumnIds = this.loadWorkspaceTableColumns();
  renderedWorkspaceTableColumnIds = [...this.visibleWorkspaceTableColumnIds];
  workspaceTableColumnMotionStates = this.createWorkspaceTableColumnMotionStates(this.renderedWorkspaceTableColumnIds);
  workspaceColumnMenuOpen = false;
  quickLinksPage = 0;
  quickLinksPageSize = QUICK_LINK_PAGE_SIZE;
  quickLinksToast: string | null = null;
  selectedBoardFilter = 'all';
  activeReportProject: string | null = null;
  activeReportMode: ReportDetailMode = 'simple';
  selectedStageGateKey: string | null = null;
  isBenefitDrawerOpen = false;
  isIssueDrawerOpen = false;
  isRelatedLinksDrawerOpen = false;
  isResourceDrawerOpen = false;
  isChangeImpactDrawerOpen = false;
  activeDependencyRegisterKey: DependencyRegisterKey | null = null;
  benefitPlanRows: BenefitPlanRow[] = benefitPlanConfig.rows.map((row) => ({ ...row }));
  benefitPlanDraft: BenefitPlanDraft = { ...benefitPlanConfig.draft };
  issuePlanRows: IssuePlanRow[] = issuePlanConfig.rows.map((row) => ({ ...row }));
  issuePlanDraft: IssuePlanDraft = { ...issuePlanConfig.draft };
  relatedLinkRows: RelatedLinkRow[] = relatedLinkConfig.rows.map((row) => ({ ...row }));
  relatedLinkDraft: RelatedLinkDraft = { ...relatedLinkConfig.draft };
  resourcePlanRows: ResourcePlanRow[] = resourcePlanConfig.rows.map((row) => ({ ...row }));
  resourcePlanDraft: ResourcePlanDraft = { ...resourcePlanConfig.draft };
  changeImpactRows: ChangeImpactRow[] = changeImpactConfig.rows.map((row) => ({ ...row, strategies: [...row.strategies] }));
  changeImpactDraft: ChangeImpactDraft = { ...changeImpactConfig.draft, strategies: [...changeImpactConfig.draft.strategies] };
  dependencyRegisterRows: Record<DependencyRegisterKey, DependencyRegisterRow[]> = {
    predecessor: dependencyRegisterConfigs.predecessor.rows.map((row) => ({ ...row })),
    successor: dependencyRegisterConfigs.successor.rows.map((row) => ({ ...row })),
  };
  dependencyRegisterDrafts: Record<DependencyRegisterKey, DependencyRegisterDraft> = {
    predecessor: { ...dependencyRegisterConfigs.predecessor.draft },
    successor: { ...dependencyRegisterConfigs.successor.draft },
  };
  activeReportSection = 'Overview';
  projectPlanEntry: ProjectPlanEntry = 'quick';
  projectPlanDetailMode: ProjectPlanDetailMode = 'simple';
  projectPlanActiveSection = 'Overview';
  projectPlanSectionsExpanded = false;
  projectPlanExpandedFieldSections: Record<string, boolean> = {};
  guidedTourStep = 0;

  private iconsHydrated = false;
  private lastActionWorkspaceView: ActionWorkspaceView = 'calendar';
  private quickLinksLayoutFrame: number | null = null;
  private quickLinksPagerBlockHeight = 0;
  private quickLinksToastTimer: number | null = null;
  private guidedTourFrame: number | null = null;
  private workspaceTableColumnTimers: Partial<Record<WorkspaceTableColumnId, number>> = {};
  private workspaceTableColumnFrames: Partial<Record<WorkspaceTableColumnId, number>> = {};

  constructor(
    private readonly iconsService: PmConsoleIconService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  get isAllProjects(): boolean {
    return this.selectedProject === 'all';
  }

  get scopedProjectName(): string {
    return this.isAllProjects ? 'All projects' : this.selectedProject;
  }

  get projectPlanStage(): string {
    if (this.onboardingPm101Locked && this.selectedProject === firstAssignedProject.id) return 'Planning';
    const profile = stageProfiles.find((item) => item.project === this.selectedProject);
    return profile ? stageDefinitions[profile.currentStage]?.label || 'Execution' : 'Execution';
  }

  get visibleProjectPlanSections(): string[] {
    return this.projectPlanSectionsExpanded ? [...this.primaryProjectPlanSections, ...this.additionalProjectPlanSections] : this.primaryProjectPlanSections;
  }

  get activeProjectPlanGroup(): SimplePlanSection {
    return this.projectPlanGroupForSection(this.projectPlanActiveSection);
  }

  get projectPlanIdentityCard(): SimplePlanSection {
    return this.simplePlanSections[0];
  }

  get activeProjectPlanVisibleGroups(): ProjectPlanFieldGroup[] {
    return this.projectPlanFieldGroupsForSection(this.projectPlanActiveSection, this.activeProjectPlanVisibleFields);
  }

  get activeProjectPlanHiddenGroups(): ProjectPlanFieldGroup[] {
    return this.projectPlanFieldGroupsForSection(this.projectPlanActiveSection, this.activeProjectPlanHiddenFields);
  }

  get activeProjectPlanHasVisibleFields(): boolean {
    return this.activeProjectPlanVisibleFields.length > 0;
  }

  get activeProjectPlanHiddenFields(): ProjectPlanField[] {
    if (!this.activeProjectPlanUsesIntermediateSplit) return [];
    const fields = this.projectPlanFieldsForSection(this.projectPlanActiveSection);
    return fields.filter((field) => this.isProjectPlanDetailedOnlyField(field));
  }

  get activeProjectPlanHiddenFieldPreview(): string {
    const labels = this.activeProjectPlanHiddenFields.map((field) => field.field);
    if (labels.length <= 3) return labels.join(', ');
    return `${labels.slice(0, 3).join(', ')} +${labels.length - 3} more`;
  }

  get activeProjectPlanVisibleFields(): ProjectPlanField[] {
    const fields = this.projectPlanFieldsForSection(this.projectPlanActiveSection);
    if (!this.activeProjectPlanUsesIntermediateSplit) return fields;
    if (this.isProjectPlanDetailedOnlySection(this.projectPlanActiveSection)) return fields;
    return fields.filter((field) => field.intermediate);
  }

  get activeProjectPlanHiddenFieldButtonLabel(): string {
    return this.activeProjectPlanHasVisibleFields ? 'Additional detailed fields' : 'Detailed fields';
  }

  get activeProjectPlanUsesIntermediateSplit(): boolean {
    const fields = this.projectPlanFieldsForSection(this.projectPlanActiveSection);
    return fields.some((field) => field.intermediate) && !this.isProjectPlanDetailedOnlySection(this.projectPlanActiveSection);
  }

  get activeBenefitPlan(): BenefitPlanConfig {
    return {
      ...benefitPlanConfig,
      rows: this.benefitPlanRows,
      draft: this.benefitPlanDraft,
    };
  }

  get activeBenefitDrawer(): BenefitPlanConfig | null {
    return this.isBenefitDrawerOpen ? this.activeBenefitPlan : null;
  }

  get activeIssuePlan(): IssuePlanConfig {
    return {
      ...issuePlanConfig,
      rows: this.issuePlanRows,
      draft: this.issuePlanDraft,
    };
  }

  get activeIssueDrawer(): IssuePlanConfig | null {
    return this.isIssueDrawerOpen ? this.activeIssuePlan : null;
  }

  get activeRelatedLinksRegister(): RelatedLinkConfig {
    return {
      ...relatedLinkConfig,
      rows: this.relatedLinkRows,
      draft: this.relatedLinkDraft,
    };
  }

  get activeResourcePlan(): ResourcePlanConfig {
    return {
      ...resourcePlanConfig,
      rows: this.resourcePlanRows,
      draft: this.resourcePlanDraft,
    };
  }

  get changeImpactRegister(): ChangeImpactConfig {
    return this.changeImpactRegisterWithState();
  }

  get activeChangeImpactDrawer(): ChangeImpactConfig | null {
    return this.isChangeImpactDrawerOpen ? this.changeImpactRegisterWithState() : null;
  }

  get changeImpactCommentCharactersRemaining(): number {
    return Math.max(0, 3000 - this.changeImpactDraft.comment.length);
  }

  get visibleDependencyRegisters(): DependencyRegisterConfig[] {
    return this.projectPlanFieldsToDependencyRegisters(this.activeProjectPlanVisibleFields);
  }

  get hiddenDependencyRegisters(): DependencyRegisterConfig[] {
    return this.projectPlanFieldsToDependencyRegisters(this.activeProjectPlanHiddenFields);
  }

  get activeDependencyRegister(): DependencyRegisterConfig | null {
    if (!this.activeDependencyRegisterKey) return null;
    return this.dependencyRegisterWithState(this.activeDependencyRegisterKey);
  }

  get projectPlanEntryLabel(): string {
    if (this.projectPlanEntry === 'change-request') return 'Change Request';
    if (this.projectPlanEntry === 'closure') return 'Closure';
    if (this.projectPlanEntry === 'reports') return 'Reports';
    return 'Project Plan';
  }

  get workspaceTitle(): string {
    if (this.onboardingPm101Locked || this.isPm101OnboardingWorkspaceFlow) return 'Welcome!';
    return this.isAllProjects ? 'Operational Workspace' : `${this.scopedProjectName} | Operational Workspace`;
  }

  get workspaceSubtitle(): string {
    return 'Plan your month, clear overdue work, and track project stages without opening every project.';
  }

  get workspaceSearchPlaceholder(): string {
    if (this.selectedView === 'pm101') return 'Search PM 101';
    if (this.selectedView === 'board') return 'Search actions';
    if (this.selectedView === 'stages') return 'Search stages';
    return 'Search calendar';
  }

  get isActionWorkspaceActive(): boolean {
    return this.isActionWorkspaceView(this.selectedView);
  }

  get topActionWorkspaceView(): ActionWorkspaceView {
    return this.isActionWorkspaceView(this.selectedView) ? this.selectedView : this.lastActionWorkspaceView;
  }

  get isPm101OnboardingWorkspaceFlow(): boolean {
    return this.frontDoorMode === 'assigned' && this.pmoAssignmentReady && !this.onboardingPm101Locked && this.selectedPage === 'workspace' && this.selectedProject === 'all';
  }

  get isWorkspaceCardMode(): boolean {
    return this.workspaceRegister === 'projects' && this.workspaceDisplay === 'cards';
  }

  get workspaceRegisterTabs(): WorkspaceRegisterTab[] {
    return [
      { id: 'projects', label: 'Project Register', icon: 'calendarMinimal', count: this.workspaceTableProjects.length },
      { id: 'risks', label: 'Risk Register', icon: 'widget', count: this.visibleRiskRegisterRows.length },
      { id: 'benefits', label: 'Benefits Register', icon: 'benefitGraph', count: this.visibleBenefitRegisterRows.length },
    ];
  }

  workspaceRegisterTabWidth(id: WorkspaceRegister): string {
    const widths: Record<WorkspaceRegister, string> = {
      projects: '186px',
      risks: '165px',
      benefits: '194px',
    };
    return widths[id];
  }

  get workspaceRegisterAriaLabel(): string {
    if (this.workspaceRegister === 'benefits') return 'PM Console benefit register';
    if (this.workspaceRegister === 'risks') return 'PM Console risk register';
    return 'PM Console project register';
  }

  get workspaceRegisterSubtitle(): string {
    if (this.workspaceRegister === 'benefits') return `Tracking ${this.visibleBenefitRegisterRows.length} benefit records across the workspace`;
    if (this.workspaceRegister === 'risks') return `Monitoring ${this.visibleRiskRegisterRows.length} active risk records across the workspace`;
    return `Showing all ${this.workspaceTableProjects.length} projects`;
  }

  get workspaceRegisterSearchPlaceholder(): string {
    if (this.workspaceRegister === 'benefits') return 'Search benefits';
    if (this.workspaceRegister === 'risks') return 'Search risks';
    return 'Search for projects';
  }

  get workspaceSearchAriaLabel(): string {
    if (this.workspaceRegister === 'benefits') return 'Search benefits';
    if (this.workspaceRegister === 'risks') return 'Search risks';
    return 'Search for projects';
  }

  get workspaceFilterAriaLabel(): string {
    if (this.workspaceRegister === 'benefits') return 'Filter benefits';
    if (this.workspaceRegister === 'risks') return 'Filter risks';
    return 'Project filter';
  }

  get workspaceRegisterFilterLabel(): string {
    if (this.workspaceRegister === 'benefits') return 'All benefits';
    if (this.workspaceRegister === 'risks') return 'All risks';
    return 'All projects';
  }

  get noAssignmentMessage(): string {
    return 'No projects have been assigned to you yet. We’ll notify you when PMO assigns one. Meanwhile, here is what this workspace will help you do once your project is ready.';
  }

  get pmoAssignmentMessage(): string {
    return `PMO assigned ${firstAssignedProject.name} to your workspace. Start with the project plan, then submit it for review before delivery tracking begins.`;
  }

  get activeGuidedTourStep(): GuidedTourStep {
    return guidedTourSteps[this.guidedTourStep] || guidedTourSteps[0];
  }

  get isLastGuidedTourStep(): boolean {
    return this.guidedTourStep >= guidedTourSteps.length - 1;
  }

  get workspaceStats(): Array<{ label: string; value: number; icon: string; tone: string }> {
    const count = (status: string) => workspaceTableProjects.filter((project) => project.status === status).length;
    return [
      { label: 'All Projects', value: workspaceTableProjects.length, icon: 'folderOpen', tone: 'brand' },
      { label: 'On-Track', value: count('On-Track'), icon: 'check', tone: 'green' },
      { label: 'Off-Track', value: count('Off-Track'), icon: 'alert', tone: 'red' },
      { label: 'Alert', value: count('Alert'), icon: 'alert', tone: 'amber' },
      { label: 'Not tracked', value: count('Not tracked'), icon: 'eyeOff', tone: 'neutral' },
      { label: 'Not Started', value: count('Not Started'), icon: 'todo', tone: 'blue' },
    ];
  }

  get benefitRegisterStats(): WorkspaceRegisterStat[] {
    const rows = this.visibleBenefitRegisterRows;
    const countRealization = (realization: string) => rows.filter((row) => row.realization === realization).length;
    const countStatus = (status: string) => rows.filter((row) => row.status === status).length;
    return [
      { label: 'All Benefits', value: rows.length, icon: 'benefit', tone: 'brand' },
      { label: 'Realized', value: countRealization('Realized'), icon: 'check', tone: 'green' },
      { label: 'In Realization', value: countRealization('In realization'), icon: 'timeline', tone: 'blue' },
      { label: 'Planned', value: countRealization('Planned'), icon: 'pauseCircle', tone: 'neutral' },
      { label: 'Attention', value: countStatus('Attention'), icon: 'alert', tone: 'amber' },
    ];
  }

  get riskRegisterStats(): WorkspaceRegisterStat[] {
    const rows = this.visibleRiskRegisterRows;
    const countExposure = (exposure: string) => rows.filter((row) => row.exposure === exposure).length;
    const countStatus = (status: string) => rows.filter((row) => row.status === status).length;
    return [
      { label: 'All Risks', value: rows.length, icon: 'risks', tone: 'brand' },
      { label: 'Critical', value: countExposure('Critical'), icon: 'alert', tone: 'red' },
      { label: 'High', value: countExposure('High'), icon: 'trendUp', tone: 'amber' },
      { label: 'Medium', value: countExposure('Medium'), icon: 'eyeOff', tone: 'neutral' },
      { label: 'Escalated', value: countStatus('Escalated'), icon: 'bell', tone: 'red' },
    ];
  }

  get visibleBenefitRegisterRows(): BenefitRegisterRow[] {
    return this.isAllProjects ? benefitRegisterRows : benefitRegisterRows.filter((row) => row.project === this.selectedProject);
  }

  get visibleRiskRegisterRows(): RiskRegisterRow[] {
    return this.isAllProjects ? riskRegisterRows : riskRegisterRows.filter((row) => row.project === this.selectedProject);
  }

  get renderedWorkspaceTableColumns(): WorkspaceTableColumn[] {
    const rendered = new Set(this.renderedWorkspaceTableColumnIds);
    return workspaceTableColumns.filter((column) => rendered.has(column.id));
  }

  get visibleWorkspaceTableColumns(): WorkspaceTableColumn[] {
    const visible = new Set(this.visibleWorkspaceTableColumnIds);
    return workspaceTableColumns.filter((column) => visible.has(column.id));
  }

  get visibleBoardColumns(): typeof actions {
    const filterId = this.selectedBoardFilter;
    return actions.map((column) => ({
      ...column,
      items: column.items
        .filter((item) => this.isAllProjects || item.project === this.selectedProject)
        .filter((item) => filterId === 'all' || this.filterKind(item.type) === filterId),
    }));
  }

  get boardProjectItems(): Array<(typeof actions)[number]['items'][number]> {
    return actions
      .flatMap((column) => column.items)
      .filter((item) => this.isAllProjects || item.project === this.selectedProject);
  }

  get selectedBoardFilterOption(): BoardFilter {
    return boardFilters.find((filter) => filter.id === this.selectedBoardFilter) || boardFilters[0];
  }

  get monthItems(): typeof timelineItems {
    return timelineItems.filter((item) => this.sameMonth(this.parseDate(item.date), this.calendarMonth));
  }

  get visibleMonthItems(): typeof timelineItems {
    return this.monthItems.filter((item) => this.selectedBoardFilter === 'all' || this.timelineItemKind(item) === this.selectedBoardFilter);
  }

  get calendarMonthLabel(): string {
    return this.calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get calendarCells(): Array<{ key: string; day: number; current: boolean; today: boolean; items: typeof timelineItems }> {
    const month = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth(), 1);
    const firstDayOffset = (month.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
    const gridStart = this.addDays(month, -firstDayOffset);
    return Array.from({ length: totalCells }, (_, index) => {
      const date = this.addDays(gridStart, index);
      const key = this.dateKey(date);
      const current = this.sameMonth(date, month);
      return {
        key,
        day: date.getDate(),
        current,
        today: key === '2026-05-12',
        items: current ? this.visibleMonthItems.filter((item) => item.date === key) : [],
      };
    });
  }

  get visibleReportRows(): typeof reportStatusHistory {
    const rows = reportStatusHistory.filter((report) => this.isAllProjects || report.project === this.selectedProject);
    if (!this.isAllProjects) return rows;
    const order = ['Vision 2030', 'NEOM Integration', 'PMO Capability'];
    return order.map((project) => rows.find((row) => row.project === project)).filter((row): row is (typeof reportStatusHistory)[number] => Boolean(row));
  }

  get activeReport(): (typeof reportStatusHistory)[number] {
    const project = this.activeReportProject || 'Vision 2030';
    return reportStatusHistory.find((report) => report.project === project) || reportStatusHistory[0];
  }

  get activeReportDetails(): ReportCreationDetail {
    return reportCreationDetails[this.activeReport.project] || reportCreationDetails['Vision 2030'];
  }

  get activeReportStatus(): string {
    const latest = this.activeReport.trend.at(-1);
    const tone = this.reportStatusTone(latest?.status || 'due');
    if (tone === 'off-track') return 'Off track';
    if (tone === 'alert') return 'Alert';
    return 'On track';
  }

  get simpleReportIntervalLabel(): string {
    return `${this.formatSimpleReportDate(this.activeReportDetails.intervalStart)} - ${this.formatSimpleReportDate(this.activeReportDetails.intervalEnd)}`;
  }

  get simpleReportPlanLabel(): string {
    const normalized = this.activeReportDetails.intervalStatus.toLowerCase();
    if (normalized.includes('submitted') || normalized.includes('complete')) return 'Submitted';
    if (normalized.includes('active')) return 'Active';
    if (normalized.includes('draft') || normalized.includes('not created')) return 'Draft';
    return this.activeReportDetails.intervalStatus;
  }

  get simpleReportPlanChipTone(): string {
    if (this.simpleReportPlanLabel === 'Draft') return 'neutral';
    return this.reportBadgeTone(this.simpleReportPlanLabel, 'neutral');
  }

  get simpleReportStatusTone(): string {
    return this.reportBadgeTone(this.simpleReportPlanLabel, 'neutral');
  }

  get reportNarrativeFields(): Array<{ label: string; hint: string; value: string; rows: number }> {
    const details = this.activeReportDetails;
    return [
      { label: 'Comments', hint: '', value: details.comments, rows: 4 },
      { label: 'Key Achievements and Notable Events', hint: 'Achievements / delays / challenges / risk', value: details.achievements, rows: 4 },
      { label: 'Planned Activities for the next reporting period', hint: '', value: details.planned, rows: 4 },
    ];
  }

  get detailedOverviewFields(): Array<{ label: string; hint: string; value: string; rows: number }> {
    return this.reportNarrativeFields.filter((field) => field.label !== 'Comments');
  }

  get simpleReportOverviewCard(): ReportDrawerCard {
    return {
      id: 'simple-overview',
      title: 'Overall Status',
      body: 'Define your project overall status.',
      status: this.activeReportStatus,
      tone: this.reportToneToken(this.activeReportStatus),
      trend: this.activeReportDetails.overallTrend,
      comments: '',
      timeline: this.reportTimelineForTone(this.reportToneToken(this.activeReportStatus)),
    };
  }

  get simpleReportCards(): ReportDrawerCard[] {
    return this.simpleReportSections.map((section, index) => {
      const guide = this.simpleReportGuide(index);
      return {
        id: `simple-${slugifyPlanField(section.title)}`,
        title: section.title,
        body: section.body,
        status: guide.status,
        tone: guide.tone,
        trend: this.reportTrendForTone(guide.tone),
        comments: '',
        timeline: this.reportTimelineForTone(guide.tone),
      };
    });
  }

  get detailedReportCards(): ReportDrawerCard[] {
    const overview: ReportDrawerCard = {
      id: 'overview',
      title: 'Overview',
      body: 'Overall project narrative and current delivery position.',
      status: this.activeReportStatus,
      tone: this.reportToneToken(this.activeReportStatus),
      trend: this.activeReportDetails.overallTrend,
      comments: this.activeReportDetails.comments,
      timeline: this.pastOverviewTrend.map((date) => ({ date, tone: 'green', label: 'On track' })),
    };
    const sections = this.reportReviewAreas.map((area) => ({
      id: slugifyPlanField(area.label),
      title: area.label,
      body: this.reportBodyForSection(area.label),
      status: area.status,
      tone: area.tone,
      trend: this.reportTrendForTone(area.tone),
      comments: area.note,
      timeline: area.label === 'Scope' ? this.scopePastStatuses : this.reportTimelineForTone(area.tone),
    }));
    return [overview, ...sections];
  }

  get quickLinksOrderedActions(): QuickAction[] {
    const pinned = this.actionsFromIds(this.pinnedIds);
    const pinnedSet = new Set(this.pinnedIds);
    return [...pinned, ...projectQuickActions.filter((action) => !pinnedSet.has(action.id))];
  }

  get quickLinksTotalPages(): number {
    return Math.max(1, Math.ceil(this.quickLinksOrderedActions.length / this.quickLinksPageSize));
  }

  get quickLinksPageIndex(): number {
    return Math.min(this.quickLinksPage, this.quickLinksTotalPages - 1);
  }

  get quickLinksPageActions(): QuickAction[] {
    const start = this.quickLinksPageIndex * this.quickLinksPageSize;
    return this.quickLinksOrderedActions.slice(start, start + this.quickLinksPageSize);
  }

  get quickLinksPageDots(): number[] {
    return Array.from({ length: this.quickLinksTotalPages }, (_, index) => index);
  }

  get stageProfilesForSelection(): StageProfile[] {
    if (this.onboardingPm101Locked) {
      const profile = this.stageProfileForProject(firstAssignedProject.id);
      return profile ? [profile] : [];
    }
    return stageProfiles.filter((profile) => this.isAllProjects || profile.project === this.selectedProject);
  }

  get selectedStageGateContext(): StageGateContext | null {
    return this.stageGateContext(this.selectedStageGateKey);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedView' in changes) {
      this.syncLastActionWorkspaceView(this.selectedView);
    }
    if ('guidedTourActive' in changes) {
      if (this.guidedTourActive) {
        this.guidedTourStep = 0;
        this.prepareGuidedTourTarget();
        this.scheduleGuidedTourPosition();
      } else {
        this.guidedTourStep = 0;
      }
      this.iconsHydrated = false;
    }
  }

  ngOnDestroy(): void {
    if (this.quickLinksLayoutFrame !== null) {
      window.cancelAnimationFrame(this.quickLinksLayoutFrame);
      this.quickLinksLayoutFrame = null;
    }
    if (this.guidedTourFrame !== null) {
      window.cancelAnimationFrame(this.guidedTourFrame);
      this.guidedTourFrame = null;
    }
    if (this.quickLinksToastTimer !== null) {
      window.clearTimeout(this.quickLinksToastTimer);
      this.quickLinksToastTimer = null;
    }
    for (const handle of Object.values(this.workspaceTableColumnTimers)) {
      if (handle) window.clearTimeout(handle);
    }
    for (const handle of Object.values(this.workspaceTableColumnFrames)) {
      if (handle) window.cancelAnimationFrame(handle);
    }
  }

  @HostListener('window:resize')
  handleWindowResize(): void {
    if (this.guidedTourActive) {
      this.scheduleGuidedTourPosition();
    }
    this.scheduleQuickLinksLayoutMeasurement();
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.workspaceColumnMenuOpen) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    const menu = this.elementRef.nativeElement.querySelector<HTMLElement>('[data-workspace-columns-menu]');
    if (menu?.contains(target)) return;
    this.closeWorkspaceColumnMenu();
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey(): void {
    if (this.workspaceColumnMenuOpen) {
      this.closeWorkspaceColumnMenu();
      return;
    }
    if (this.isBenefitDrawerOpen || this.isIssueDrawerOpen || this.isRelatedLinksDrawerOpen || this.isResourceDrawerOpen || this.isChangeImpactDrawerOpen || this.activeDependencyRegister) {
      this.closeProjectPlanDrawers();
      return;
    }
    if (this.guidedTourActive) {
      this.completeGuidedTour();
    }
  }

  ngAfterViewChecked(): void {
    if (this.guidedTourActive) {
      this.scheduleGuidedTourPosition();
    }
    this.scheduleQuickLinksLayoutMeasurement();
    if (this.iconsHydrated) return;
    this.refreshIcons();
  }

  private scheduleQuickLinksLayoutMeasurement(): void {
    if (this.quickLinksLayoutFrame !== null) return;
    this.quickLinksLayoutFrame = window.requestAnimationFrame(() => {
      this.quickLinksLayoutFrame = null;
      this.updateQuickLinksPageSize();
    });
  }

  private updateQuickLinksPageSize(): void {
    const host = this.elementRef.nativeElement;
    const quickLinksList = host.querySelector<HTMLElement>('.quick-actions-card .quick-action-list');
    const quickLinksGrid = quickLinksList?.querySelector<HTMLElement>('.quick-action-grid');
    const quickLinkCards = quickLinksGrid?.querySelectorAll<HTMLElement>('.quick-link-card');

    if (!quickLinksList || !quickLinksGrid || !quickLinkCards?.length) {
      this.quickLinksPageSize = QUICK_LINK_PAGE_SIZE;
      return;
    }

    const rowHeight = quickLinkCards[0].getBoundingClientRect().height || quickLinkCards[0].offsetHeight;
    const listHeight = quickLinksList.clientHeight;
    if (!rowHeight || !listHeight) return;

    const gridStyles = window.getComputedStyle(quickLinksGrid);
    const rowGap = Number.parseFloat(gridStyles.rowGap || gridStyles.gap || '0') || 0;
    const columns = this.quickLinksGridColumnCount(quickLinkCards);
    const pagerElement = quickLinksList.querySelector<HTMLElement>('.quick-links-pager');
    const pagerMarginTop = pagerElement ? Number.parseFloat(window.getComputedStyle(pagerElement).marginTop || '0') || 0 : 0;
    const pagerBlockHeight = pagerElement ? pagerElement.offsetHeight + pagerMarginTop : this.quickLinksPagerBlockHeight;

    if (pagerElement && pagerBlockHeight > 0) {
      this.quickLinksPagerBlockHeight = pagerBlockHeight;
    }

    const totalActions = this.quickLinksOrderedActions.length;
    const maxWithoutPager = this.quickLinksCapacity(listHeight, rowHeight, rowGap, columns);
    let nextPageSize = maxWithoutPager;

    if (totalActions > nextPageSize) {
      const availableGridHeight = Math.max(listHeight - pagerBlockHeight, rowHeight);
      const maxWithPager = this.quickLinksCapacity(availableGridHeight, rowHeight, rowGap, columns);
      nextPageSize = maxWithPager;
    }

    if (nextPageSize === this.quickLinksPageSize) return;

    const currentStart = this.quickLinksPageIndex * this.quickLinksPageSize;
    this.quickLinksPageSize = nextPageSize;
    this.quickLinksPage = Math.min(Math.floor(currentStart / this.quickLinksPageSize), this.quickLinksTotalPages - 1);
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  private quickLinksCapacity(availableHeight: number, rowHeight: number, rowGap: number, columns: number): number {
    const safeColumns = Math.max(1, columns);
    const safeHeight = Math.max(availableHeight, rowHeight);
    const rows = Math.max(1, Math.floor((safeHeight + rowGap) / (rowHeight + rowGap)));
    return rows * safeColumns;
  }

  private quickLinksGridColumnCount(cards: NodeListOf<HTMLElement>): number {
    const firstTop = cards[0]?.offsetTop ?? 0;
    let columns = 0;
    for (const card of Array.from(cards)) {
      if (Math.abs(card.offsetTop - firstTop) > 1) break;
      columns += 1;
    }
    return Math.max(1, columns);
  }

  refreshIcons(): void {
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  iconName(name: string): string {
    return iconMap[name] || iconMap['grid'];
  }

  stepNumber(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  nextGuidedTourStep(): void {
    if (this.isLastGuidedTourStep) {
      this.completeGuidedTour();
      return;
    }
    this.showGuidedTourStep(this.guidedTourStep + 1);
  }

  previousGuidedTourStep(): void {
    this.showGuidedTourStep(this.guidedTourStep - 1);
  }

  completeGuidedTour(): void {
    this.guidedTourActive = false;
    this.guidedTourStep = 0;

    if (this.guidedTourExitMode === 'unassigned') {
      this.frontDoorMode = 'unassigned';
      this.pmoAssignmentReady = false;
      this.selectedPage = 'workspace';
      this.selectedProject = 'all';
      this.selectedView = 'calendar';
      this.selectedBoardFilter = 'all';
      this.activeReportProject = null;
      this.selectedStageGateKey = null;
      this.projectPlanEntry = 'quick';
      this.projectPlanDetailMode = 'simple';
      this.projectPlanActiveSection = 'Overview';
      this.projectPlanSectionsExpanded = false;
      this.projectPlanExpandedFieldSections = {};
      this.onboardingPm101Locked = false;
    } else if (this.guidedTourExitMode === 'pm101-lock') {
      this.frontDoorMode = 'assigned';
      this.pmoAssignmentReady = false;
      this.selectedPage = 'workspace';
      this.selectedProject = 'all';
      this.selectedView = 'pm101';
      this.selectedBoardFilter = 'all';
      this.activeReportProject = null;
      this.selectedStageGateKey = null;
      this.projectPlanEntry = 'quick';
      this.projectPlanDetailMode = 'simple';
      this.projectPlanActiveSection = 'Overview';
      this.projectPlanSectionsExpanded = false;
      this.projectPlanExpandedFieldSections = {};
      this.onboardingPm101Locked = true;
    }

    this.guidedTourExitMode = null;
    this.emitState();
  }

  handleAssignmentPrimaryAction(): void {
    if (this.pmoAssignmentReady) {
      this.openAssignedProjectPlan();
      return;
    }
    this.assignFirstProject();
  }

  openPm101OnboardingWorkspace(): void {
    this.frontDoorMode = 'assigned';
    this.pmoAssignmentReady = true;
    this.onboardingPm101Locked = false;
    this.selectedProject = 'all';
    this.selectedPage = 'workspace';
    this.selectedView = 'pm101';
    this.selectedBoardFilter = 'all';
    this.activeReportProject = null;
    this.selectedStageGateKey = null;
    this.projectPlanEntry = 'quick';
    this.projectPlanDetailMode = 'simple';
    this.projectPlanActiveSection = 'Overview';
    this.projectPlanSectionsExpanded = false;
    this.projectPlanExpandedFieldSections = {};
    this.emitState();
  }

  openAssignedProjectPlan(): void {
    this.frontDoorMode = 'assigned';
    this.pmoAssignmentReady = true;
    this.selectedProject = firstAssignedProject.id;
    this.selectedPage = 'project-plan';
    this.selectedView = 'calendar';
    this.projectPlanEntry = 'quick';
    this.projectPlanDetailMode = 'simple';
    this.projectPlanActiveSection = 'Overview';
    this.projectPlanSectionsExpanded = false;
    this.projectPlanExpandedFieldSections = {};
    this.activeReportProject = null;
    this.selectedStageGateKey = null;
    this.emitState();
  }

  trendIcon(tone: string): string {
    const icons: Record<string, string> = {
      green: 'check',
      amber: 'bell',
      red: 'x',
      blue: 'circle-dot',
      neutral: 'minus',
    };
    return icons[tone] || 'circle';
  }

  trendLabel(tone: string): string {
    const labels: Record<string, string> = {
      green: 'On track',
      amber: 'Alert',
      red: 'Off track',
      blue: 'Not started',
      neutral: 'No report',
    };
    return labels[tone] || 'No report';
  }

  setWorkspaceRegister(register: WorkspaceRegister): void {
    if (this.workspaceRegister === register) return;
    this.workspaceRegister = register;
    this.iconsHydrated = false;
  }

  setWorkspaceDisplay(display: WorkspaceDisplay): void {
    if (this.workspaceDisplay === display) return;
    this.workspaceDisplay = display;
    this.closeWorkspaceColumnMenu();
    this.iconsHydrated = false;
  }

  setProjectPlanEntry(entry: ProjectPlanEntry): void {
    this.closeProjectPlanDrawers();
    this.projectPlanEntry = entry;
    this.projectPlanActiveSection = 'Overview';
    this.projectPlanExpandedFieldSections = {};
    this.iconsHydrated = false;
  }

  setProjectPlanDetailMode(mode: ProjectPlanDetailMode): void {
    if (mode !== 'detailed') this.closeProjectPlanDrawers();
    this.projectPlanDetailMode = mode;
    this.iconsHydrated = false;
  }

  setProjectPlanSection(section: string): void {
    this.closeProjectPlanDrawers();
    this.projectPlanActiveSection = section;
    this.iconsHydrated = false;
  }

  isProjectPlanFieldSectionExpanded(section: string): boolean {
    return Boolean(this.projectPlanExpandedFieldSections[section]);
  }

  toggleProjectPlanFieldSection(section: string): void {
    this.projectPlanExpandedFieldSections = {
      ...this.projectPlanExpandedFieldSections,
      [section]: !this.projectPlanExpandedFieldSections[section],
    };
    this.iconsHydrated = false;
  }

  toggleProjectPlanSections(): void {
    this.projectPlanSectionsExpanded = !this.projectPlanSectionsExpanded;
    if (!this.projectPlanSectionsExpanded && this.additionalProjectPlanSections.includes(this.projectPlanActiveSection)) {
      this.closeProjectPlanDrawers();
      this.projectPlanActiveSection = 'Overview';
    }
    this.iconsHydrated = false;
  }

  setView(view: WorkspaceView): void {
    if (this.isOnboardingPm101BlockedView(view)) return;
    this.closeProjectPlanDrawers();
    this.closeReport();
    this.closeStageGate();
    this.selectedView = view;
    this.selectedPage = 'workspace';
    this.emitState();
  }

  navigate(page: ConsolePage, projectPlanEntry: ProjectPlanEntry = 'quick'): void {
    if (this.onboardingPm101Locked && page === 'workspaces') return;
    this.closeProjectPlanDrawers();
    this.closeReport();
    this.closeStageGate();
    this.selectedPage = page;
    if (page === 'project-plan') {
      this.projectPlanEntry = projectPlanEntry;
      this.projectPlanActiveSection = 'Overview';
      this.projectPlanExpandedFieldSections = {};
    }
    if ((page === 'project-plan' || page === 'wbs' || page === 'playground') && this.isAllProjects) {
      this.selectedProject = 'Vision 2030';
    }
    this.emitState();
  }

  openProject(projectId: string): void {
    this.closeProjectPlanDrawers();
    this.closeReport();
    this.closeStageGate();
    this.selectedProject = projectId;
    this.selectedPage = 'project-plan';
    this.projectPlanEntry = 'quick';
    this.projectPlanActiveSection = 'Overview';
    this.projectPlanExpandedFieldSections = {};
    this.emitState();
  }

  openQuickAction(action: QuickAction): void {
    this.closeProjectPlanDrawers();
    this.closeReport();
    this.closeStageGate();
    if (action.view && !this.isOnboardingPm101BlockedView(action.view)) this.selectedView = action.view;
    if (this.onboardingPm101Locked && action.page === 'workspaces') return;
    if (action.page) this.navigate(action.page, this.projectPlanEntryFromAction(action.entry));
    this.emitState();
  }

  openReport(project: string): void {
    this.closeProjectPlanDrawers();
    this.closeStageGate();
    this.activeReportProject = project;
    this.activeReportMode = 'simple';
    this.activeReportSection = 'Overview';
    this.iconsHydrated = false;
  }

  openProjectReportRow(project: string): void {
    this.openReport(project);
  }

  openProjectReportRowKey(event: Event, project: string): void {
    event.preventDefault();
    this.openReport(project);
  }

  closeReport(): void {
    if (!this.activeReportProject) return;
    this.activeReportProject = null;
    this.activeReportMode = 'simple';
    this.activeReportSection = 'Overview';
    this.iconsHydrated = false;
  }

  openStageGate(profile: StageProfile): void {
    this.closeProjectPlanDrawers();
    this.closeReport();
    const currentStage = stageDefinitions[this.stageCurrentIndex(profile)] || stageDefinitions[0];
    this.selectedStageGateKey = this.stageGateKey(profile.project, currentStage.id);
    this.iconsHydrated = false;
  }

  closeStageGate(): void {
    if (!this.selectedStageGateKey) return;
    this.selectedStageGateKey = null;
    this.iconsHydrated = false;
  }

  openBenefitDrawer(): void {
    this.closeProjectPlanDrawers();
    this.resetBenefitDraft();
    this.isBenefitDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeBenefitDrawer(): void {
    if (!this.isBenefitDrawerOpen) return;
    this.isBenefitDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveBenefitDrawer(event: Event): void {
    event.preventDefault();
    const register = this.activeBenefitDrawer;
    if (!register || !this.canSaveBenefitDraft(register)) return;

    const draft = this.benefitPlanDraft;
    const nextRow: BenefitPlanRow = {
      id: `benefit-plan-${Date.now()}`,
      benefitType: draft.benefitType.trim() || 'Strategic benefit',
      category: draft.category.trim() || 'Cost Avoidance',
      benefitName: draft.benefitName.trim(),
      description: draft.description.trim(),
      owner: draft.owner.trim() || 'Owner to confirm',
      realizationDate: this.formatProjectPlanDate(draft.realizationDate),
    };

    this.benefitPlanRows = [...this.benefitPlanRows, nextRow];
    this.resetBenefitDraft();
    this.closeBenefitDrawer();
  }

  updateBenefitDraft(field: keyof BenefitPlanDraft, value: string): void {
    this.benefitPlanDraft = {
      ...this.benefitPlanDraft,
      [field]: value,
    };
  }

  canSaveBenefitDraft(register: BenefitPlanConfig | null): boolean {
    if (!register) return false;
    const draft = this.benefitPlanDraft;
    return Boolean(draft.benefitName.trim() && draft.realizationDate.trim());
  }

  openIssueDrawer(): void {
    this.closeProjectPlanDrawers();
    this.resetIssueDraft();
    this.isIssueDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeIssueDrawer(): void {
    if (!this.isIssueDrawerOpen) return;
    this.isIssueDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveIssueDrawer(event: Event): void {
    event.preventDefault();
    const register = this.activeIssueDrawer;
    if (!register || !this.canSaveIssueDraft(register)) return;

    const draft = this.issuePlanDraft;
    const nextRow: IssuePlanRow = {
      id: `issue-plan-${Date.now()}`,
      issueType: draft.issueType.trim(),
      criticality: draft.criticality.trim() || 'Low',
      issue: draft.issue.trim(),
      description: draft.description.trim(),
      resolution: draft.resolution.trim(),
      status: draft.status.trim() || 'Open',
      owner: draft.owner.trim(),
      dateRaised: this.formatProjectPlanDate(draft.dateRaised),
      dueDate: this.formatProjectPlanDate(draft.dueDate),
      dateClosed: this.formatProjectPlanDate(draft.dateClosed),
    };

    this.issuePlanRows = [...this.issuePlanRows, nextRow];
    this.resetIssueDraft();
    this.closeIssueDrawer();
  }

  updateIssueDraft(field: keyof IssuePlanDraft, value: string): void {
    this.issuePlanDraft = {
      ...this.issuePlanDraft,
      [field]: value,
    };
  }

  canSaveIssueDraft(register: IssuePlanConfig | null): boolean {
    if (!register) return false;
    const draft = this.issuePlanDraft;
    return Boolean(
      draft.issueType.trim() &&
        draft.issue.trim() &&
        draft.resolution.trim() &&
        draft.status.trim() &&
        draft.owner.trim() &&
        draft.dateRaised.trim(),
    );
  }

  openRelatedLinksDrawer(): void {
    this.closeProjectPlanDrawers();
    this.resetRelatedLinksDraft();
    this.isRelatedLinksDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeRelatedLinksDrawer(): void {
    if (!this.isRelatedLinksDrawerOpen) return;
    this.isRelatedLinksDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveRelatedLinksDrawer(event: Event): void {
    event.preventDefault();
    const register = this.activeRelatedLinksRegister;
    if (!this.canSaveRelatedLinksDraft(register)) return;

    const draft = this.relatedLinkDraft;
    const nextRow: RelatedLinkRow = {
      id: `related-link-${Date.now()}`,
      name: draft.name.trim(),
      description: draft.description.trim(),
      documentLink: draft.documentLink.trim(),
    };

    this.relatedLinkRows = [...this.relatedLinkRows, nextRow];
    this.resetRelatedLinksDraft();
    this.closeRelatedLinksDrawer();
  }

  updateRelatedLinksDraft(field: keyof RelatedLinkDraft, value: string): void {
    this.relatedLinkDraft = {
      ...this.relatedLinkDraft,
      [field]: value,
    };
  }

  canSaveRelatedLinksDraft(register: RelatedLinkConfig | null): boolean {
    if (!register) return false;
    const draft = this.relatedLinkDraft;
    return Boolean(draft.name.trim() && draft.documentLink.trim());
  }

  relatedLinkHref(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '#';
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('//')) return `https:${trimmed}`;
    return `https://${trimmed}`;
  }

  openResourceDrawer(): void {
    this.closeProjectPlanDrawers();
    this.resetResourcePlanDraft();
    this.isResourceDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeResourceDrawer(): void {
    if (!this.isResourceDrawerOpen) return;
    this.isResourceDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveResourceDrawer(event: Event): void {
    event.preventDefault();
    const register = this.activeResourcePlan;
    if (!this.canSaveResourceDraft(register)) return;

    const draft = this.resourcePlanDraft;
    const nextRow: ResourcePlanRow = {
      id: `resource-${Date.now()}`,
      resource: draft.resource.trim(),
      resourceType: draft.resourceType.trim(),
      impact: draft.impact.trim(),
      businessUnit: draft.businessUnit.trim(),
      fteCount: draft.fteCount.trim(),
      baselineStart: this.formatResourcePlanDate(draft.baselineStart),
      baselineEnd: this.formatResourcePlanDate(draft.baselineEnd),
      comments: draft.comments.trim(),
    };

    this.resourcePlanRows = [...this.resourcePlanRows, nextRow];
    this.resetResourcePlanDraft();
    this.closeResourceDrawer();
  }

  updateResourceDraft(field: keyof ResourcePlanDraft, value: string): void {
    this.resourcePlanDraft = {
      ...this.resourcePlanDraft,
      [field]: value,
    };
  }

  canSaveResourceDraft(register: ResourcePlanConfig | null): boolean {
    if (!register) return false;
    const draft = this.resourcePlanDraft;
    return Boolean(
      draft.resource.trim() &&
        draft.resourceType.trim() &&
        draft.impact.trim() &&
        draft.businessUnit.trim() &&
        draft.fteCount.trim(),
    );
  }

  openChangeImpactDrawer(): void {
    this.closeProjectPlanDrawers();
    this.resetChangeImpactDraft();
    this.isChangeImpactDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeChangeImpactDrawer(): void {
    if (!this.isChangeImpactDrawerOpen) return;
    this.isChangeImpactDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveChangeImpactDrawer(event: Event): void {
    event.preventDefault();
    const register = this.activeChangeImpactDrawer;
    if (!register || !this.canSaveChangeImpactDraft(register)) return;

    const draft = this.changeImpactDraft;
    const nextRow: ChangeImpactRow = {
      id: `change-impact-${Date.now()}`,
      category: draft.category.trim(),
      stakeholder: draft.stakeholder.trim(),
      level: draft.level.trim(),
      comment: draft.comment.trim(),
      strategies: draft.strategies.map((strategy) => strategy.trim()).filter(Boolean),
    };

    this.changeImpactRows = [...this.changeImpactRows, nextRow];
    this.resetChangeImpactDraft();
    this.closeChangeImpactDrawer();
  }

  updateChangeImpactDraft(field: ChangeImpactDraftField, value: string): void {
    this.changeImpactDraft = {
      ...this.changeImpactDraft,
      [field]: value,
    };
  }

  addChangeImpactStrategy(): void {
    const nextStrategy = this.changeImpactDraft.strategyInput.trim();
    if (!nextStrategy) return;
    const exists = this.changeImpactDraft.strategies.some((strategy) => strategy.toLowerCase() === nextStrategy.toLowerCase());
    this.changeImpactDraft = {
      ...this.changeImpactDraft,
      strategyInput: '',
      strategies: exists ? [...this.changeImpactDraft.strategies] : [...this.changeImpactDraft.strategies, nextStrategy],
    };
  }

  removeChangeImpactStrategy(strategyToRemove: string): void {
    this.changeImpactDraft = {
      ...this.changeImpactDraft,
      strategies: this.changeImpactDraft.strategies.filter((strategy) => strategy !== strategyToRemove),
    };
  }

  canSaveChangeImpactDraft(register: ChangeImpactConfig | null): boolean {
    if (!register) return false;
    const draft = this.changeImpactDraft;
    return Boolean(draft.category.trim() && draft.stakeholder.trim() && draft.level.trim());
  }

  openDependencyDrawer(key: DependencyRegisterKey): void {
    this.closeProjectPlanDrawers();
    this.resetDependencyDraft(key);
    this.activeDependencyRegisterKey = key;
    this.iconsHydrated = false;
  }

  closeDependencyDrawer(): void {
    if (!this.activeDependencyRegisterKey) return;
    this.activeDependencyRegisterKey = null;
    this.iconsHydrated = false;
  }

  saveDependencyDrawer(event: Event): void {
    event.preventDefault();
    const register = this.activeDependencyRegister;
    if (!register || !this.canSaveDependencyDraft(register)) return;

    const draft = this.dependencyRegisterDrafts[register.key];
    const nextRow: DependencyRegisterRow = {
      id: `dependency-${register.key}-${Date.now()}`,
      project: draft.project.trim(),
      impact: draft.impact.trim(),
      dependentProduct: draft.dependentProduct.trim(),
      baselineStart: this.formatDependencyDate(draft.baselineStart),
      baselineEnd: this.formatDependencyDate(draft.baselineEnd),
      projectManager: draft.projectManager.trim(),
      nature: draft.nature.trim(),
      status: register.key === 'predecessor' ? 'Tracking' : 'Planned',
    };

    this.dependencyRegisterRows = {
      ...this.dependencyRegisterRows,
      [register.key]: [...this.dependencyRegisterRows[register.key], nextRow],
    };
    this.resetDependencyDraft(register.key);
    this.closeDependencyDrawer();
  }

  updateDependencyDraft(field: keyof DependencyRegisterDraft, value: string): void {
    const key = this.activeDependencyRegisterKey;
    if (!key) return;
    this.dependencyRegisterDrafts = {
      ...this.dependencyRegisterDrafts,
      [key]: {
        ...this.dependencyRegisterDrafts[key],
        [field]: value,
      },
    };
  }

  canSaveDependencyDraft(register: DependencyRegisterConfig | null): boolean {
    if (!register) return false;
    const draft = this.dependencyRegisterDrafts[register.key];
    return Boolean(
      draft.project.trim() &&
        draft.impact.trim() &&
        draft.dependentProduct.trim() &&
        draft.projectManager.trim() &&
        draft.baselineStart.trim() &&
        draft.baselineEnd.trim() &&
        draft.nature.trim(),
    );
  }

  submitStageGate(event: Event, status: StageGateStatus): void {
    event.preventDefault();
    if (!this.canSubmitStageGate(status)) return;
    this.closeStageGate();
  }

  stageStatusLabel(status: StageGateStatus): string {
    if (status === 'complete') return 'Complete';
    if (status === 'current') return 'Current stage';
    return 'Upcoming';
  }

  gateReadinessText(profile: StageProfile, status: StageGateStatus): string {
    if (status === 'complete') return `${profile.gateTotal}/${profile.gateTotal} submitted`;
    if (status === 'current') return `${profile.gateDone}/${profile.gateTotal} ready`;
    return 'Not started';
  }

  canSubmitStageGate(status: StageGateStatus): boolean {
    return status === 'current';
  }

  stageGateSubmitLabel(status: StageGateStatus): string {
    if (status === 'current') return 'Submit and advance stage';
    if (status === 'complete') return 'Gate already submitted';
    return 'Current stage required first';
  }

  saveReport(event: Event): void {
    event.preventDefault();
    this.closeReport();
  }

  setReportSection(section: string): void {
    this.activeReportSection = section;
    this.iconsHydrated = false;
  }

  setReportMode(mode: ReportDetailMode): void {
    this.activeReportMode = mode;
    if (mode === 'simple') {
      this.activeReportSection = 'Overview';
    }
    this.iconsHydrated = false;
  }

  simpleReportGuide(index: number): SimpleReportGuide {
    return this.simpleReportGuides[index] || this.simpleReportGuides[0];
  }

  simpleReportFieldValue(field: SimplePlanField): string {
    return field.value.trim() || 'Not captured';
  }

  isReportStatusSelected(optionValue: string, status: string): boolean {
    return this.reportToneToken(optionValue) === this.reportToneToken(status);
  }

  reportBadgeTone(value: string, fallback: string = 'neutral'): string {
    const normalized = value.toLowerCase();
    if (normalized.includes('off')) return 'red';
    if (normalized.includes('alert') || normalized.includes('attention') || normalized.includes('draft') || normalized.includes('due')) return 'amber';
    if (normalized.includes('active') || normalized.includes('track') || normalized.includes('submitted') || normalized.includes('complete')) return 'green';
    return fallback;
  }

  handleProjectCardAction(project: (typeof workspaceProjectCards)[number]): void {
    const reportProject = 'reportProject' in project ? project.reportProject : undefined;
    if (reportProject || project.action === 'Submit PSR') {
      this.openReport(reportProject || project.title);
      return;
    }
    this.openProject(project.title);
  }

  handleTaskAction(item: (typeof actions)[number]['items'][number]): void {
    if (this.filterKind(item.type) === 'report') {
      this.openReport(item.project);
      return;
    }
    this.iconsHydrated = false;
  }

  assignFirstProject(): void {
    this.pmoAssignmentReady = true;
    this.frontDoorMode = 'unassigned';
    this.selectedProject = firstAssignedProject.id;
    this.selectedPage = 'workspace';
    this.activeReportProject = null;
    this.selectedStageGateKey = null;
    this.emitState();
  }

  shiftMonth(delta: number): void {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + delta, 1);
    this.iconsHydrated = false;
  }

  setBoardFilter(filterId: string, event?: Event): void {
    this.selectedBoardFilter = filterId;
    (event?.currentTarget as HTMLElement | null)?.closest('details')?.removeAttribute('open');
    this.iconsHydrated = false;
  }

  countForFilter(filter: BoardFilter): number {
    if (filter.id === 'all') return this.boardProjectItems.length;
    return this.boardProjectItems.filter((item) => this.filterKind(item.type) === filter.id).length;
  }

  countCalendarFilter(filter: BoardFilter): number {
    if (filter.id === 'all') return this.monthItems.length;
    return this.monthItems.filter((item) => this.timelineItemKind(item) === filter.id).length;
  }

  shiftQuickLinksPage(delta: number): void {
    this.quickLinksPage = Math.min(Math.max(this.quickLinksPageIndex + delta, 0), this.quickLinksTotalPages - 1);
    this.iconsHydrated = false;
  }

  togglePinned(id: string): void {
    const isPinned = this.pinnedIds.includes(id);
    if (!isPinned && this.pinnedIds.length >= QUICK_LINK_PIN_LIMIT) {
      this.showQuickLinksToast(`You can't pin more than ${QUICK_LINK_PIN_LIMIT} quick links.`);
      return;
    }

    this.pinnedIds = isPinned
      ? this.normalizePinnedQuickLinks(this.pinnedIds.filter((item) => item !== id))
      : this.normalizePinnedQuickLinks([...this.pinnedIds, id]);
    this.quickLinksPage = 0;
    this.persistPinnedQuickLinks();
    this.iconsHydrated = false;
  }

  toggleWorkspaceColumnMenu(): void {
    this.workspaceColumnMenuOpen = !this.workspaceColumnMenuOpen;
  }

  closeWorkspaceColumnMenu(): void {
    if (!this.workspaceColumnMenuOpen) return;
    this.workspaceColumnMenuOpen = false;
    this.changeDetector.markForCheck();
  }

  isWorkspaceTableColumnVisible(id: WorkspaceTableColumnId): boolean {
    return this.visibleWorkspaceTableColumnIds.includes(id);
  }

  isWorkspaceTableColumnLocked(id: WorkspaceTableColumnId): boolean {
    return this.visibleWorkspaceTableColumnIds.length === 1 && this.visibleWorkspaceTableColumnIds[0] === id;
  }

  workspaceTableColumnMotionState(id: WorkspaceTableColumnId): WorkspaceTableColumnMotionState {
    return this.workspaceTableColumnMotionStates[id] || 'visible';
  }

  workspaceTableColumnWidth(id: WorkspaceTableColumnId): string {
    const maxWidths: Record<WorkspaceTableColumnId, number> = {
      project: 361.82,
      stage: 129.758,
      trend: 224.789,
      manager: 248.102,
      baselineStart: 216.883,
      baselineEnd: 216.883,
      budget: 194.648,
      status: 122,
    };
    const minWidths: Record<WorkspaceTableColumnId, number> = {
      project: 220,
      stage: 96,
      trend: 148,
      manager: 180,
      baselineStart: 140,
      baselineEnd: 140,
      budget: 150,
      status: 108,
    };
    const totalVisibleWidth = this.visibleWorkspaceTableColumnIds.reduce((sum, columnId) => sum + maxWidths[columnId], 0) || 1;
    const widthShare = (maxWidths[id] / totalVisibleWidth) * 100;
    return `clamp(${minWidths[id]}px, ${widthShare.toFixed(3)}%, ${maxWidths[id].toFixed(3)}px)`;
  }

  workspaceTableMinWidth(): number {
    const minWidths: Record<WorkspaceTableColumnId, number> = {
      project: 220,
      stage: 96,
      trend: 148,
      manager: 180,
      baselineStart: 140,
      baselineEnd: 140,
      budget: 150,
      status: 108,
    };
    return 48 + this.visibleWorkspaceTableColumnIds.reduce((sum, columnId) => sum + minWidths[columnId], 0);
  }

  toggleWorkspaceTableColumn(id: WorkspaceTableColumnId, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const shouldShow = Boolean(input?.checked);
    const isVisible = this.isWorkspaceTableColumnVisible(id);
    if (shouldShow === isVisible) return;

    if (shouldShow) {
      this.visibleWorkspaceTableColumnIds = this.normalizeWorkspaceTableColumns([...this.visibleWorkspaceTableColumnIds, id]);
      this.showWorkspaceTableColumn(id);
    } else {
      if (this.isWorkspaceTableColumnLocked(id)) return;
      this.visibleWorkspaceTableColumnIds = this.normalizeWorkspaceTableColumns(this.visibleWorkspaceTableColumnIds.filter((columnId) => columnId !== id));
      this.hideWorkspaceTableColumn(id);
    }

    this.persistWorkspaceTableColumns();
  }

  resetWorkspaceTableColumns(): void {
    const nextVisible = [...defaultWorkspaceTableColumnIds];
    const nextVisibleSet = new Set(nextVisible);
    for (const id of defaultWorkspaceTableColumnIds) {
      if (!this.visibleWorkspaceTableColumnIds.includes(id)) {
        this.showWorkspaceTableColumn(id);
      }
    }
    for (const id of this.visibleWorkspaceTableColumnIds) {
      if (!nextVisibleSet.has(id)) {
        this.hideWorkspaceTableColumn(id);
      }
    }
    this.visibleWorkspaceTableColumnIds = nextVisible;
    this.persistWorkspaceTableColumns();
  }

  filterKind(type: string): string {
    const normalized = type.toLowerCase();
    if (normalized.includes('risk')) return 'risk';
    if (normalized.includes('dependency')) return 'dependency';
    if (normalized.includes('benefit')) return 'benefit';
    if (normalized.includes('report')) return 'report';
    if (normalized.includes('milestone') || normalized.includes('gate')) return 'milestone';
    return 'task';
  }

  timelineItemKind(item: (typeof timelineItems)[number]): string {
    return item.kind || this.filterKind(item.label);
  }

  taskCardClass(type: string): string {
    return type
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  boardColumnIcon(column: string): string {
    if (column === 'Overdue') return 'triangle-alert';
    if (column === 'This week') return 'calendar-days';
    return 'clock-3';
  }

  reportStatusTone(status: string): string {
    if (status === 'missed' || status === 'overdue') return 'off-track';
    if (status === 'due' || status === 'attention' || status === 'draft') return 'alert';
    return 'on-track';
  }

  reportStatusIcon(status: string): string {
    return this.reportStatusTone(status) === 'off-track' ? 'circle-x' : this.reportStatusTone(status) === 'alert' ? 'triangle-alert' : 'circle-check';
  }

  reportFrontdoorTone(report: { project: string; dueTone: string }): string {
    return ({ 'Vision 2030': 'red', 'NEOM Integration': 'green', 'PMO Capability': 'amber' } as Record<string, string>)[report.project] || report.dueTone;
  }

  reportDueToneLabel(tone: string): string {
    if (tone === 'red') return 'Off track';
    if (tone === 'amber') return 'Alert';
    if (tone === 'green') return 'On track';
    return 'Review';
  }

  reportDueText(report: { dueLabel: string }): string {
    return report.dueLabel === 'Overdue 5 days' ? 'Overdue by 5 days' : report.dueLabel;
  }

  private reportToneToken(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('off')) return 'red';
    if (normalized.includes('alert') || normalized.includes('attention') || normalized.includes('due') || normalized.includes('draft')) return 'amber';
    return 'green';
  }

  reportTrendForTone(tone: string): string {
    if (tone === 'red') return 'Declining';
    if (tone === 'amber') return 'Needs attention';
    return 'Improving';
  }

  detailedReportAreaCard(area: { label: string; status: string; tone: string; note: string }): ReportDrawerCard {
    return {
      id: slugifyPlanField(area.label),
      title: area.label,
      body: this.reportBodyForSection(area.label),
      status: area.status,
      tone: area.tone,
      trend: this.reportTrendForTone(area.tone),
      comments: area.note,
      timeline: area.label === 'Scope' ? this.scopePastStatuses : this.reportTimelineForTone(area.tone),
    };
  }

  private reportTimelineForTone(tone: string): ReportTimelinePoint[] {
    const label = tone === 'red' ? 'Off track' : tone === 'amber' ? 'Alert/Discuss' : 'On track';
    return this.pastOverviewTrend.map((date) => ({ date, tone, label }));
  }

  private reportBodyForSection(section: string): string {
    const descriptions: Record<string, string> = {
      Scope: 'Baseline, forecast, and delivery boundaries.',
      Schedule: 'Milestones, stage progress, and forecast dates.',
      Budget: 'Funding profile, burn, and approved controls.',
      Benefits: 'Benefits evidence, owners, and realization signals.',
      Risks: 'Threats, mitigations, and current exposure.',
      Issues: 'Escalations, blockers, and decision points.',
      Resource: 'Capacity, roles, and delivery coverage.',
      Dependency: 'Cross-project handoffs, constraints, and owner follow-ups.',
    };
    return descriptions[section] || 'Capture the latest delivery signal for this reporting area.';
  }

  private formatSimpleReportDate(value: string): string {
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/').map(Number);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(year, month - 1, day)));
    }
    return value;
  }

  simplePlanTableConfig(field: SimplePlanField | ProjectPlanField): SimplePlanTableConfig {
    const fieldName = 'field' in field ? field.field : field.label;
    const configs: Record<string, SimplePlanTableConfig> = {
      'Business Drivers': {
        action: 'Add driver',
        description: 'Business trigger, source, and priority.',
        columns: ['Driver', 'Source', 'Priority'],
        rows: [[field.value || 'Strategic research visibility', 'Strategy', 'High']],
      },
      Outcome: {
        action: 'Add outcome',
        description: 'Measurable outcomes expected from the project.',
        columns: ['Outcome', 'Measure', 'Status'],
        rows: [[field.value || 'Reduce fragmentation in research efforts', 'Discovery coverage', 'Draft']],
      },
      'Project Alignment (Objectives)': {
        action: 'Add objective',
        description: 'Strategic and project objectives linked to the plan.',
        columns: ['Objective', 'Level', 'Status'],
        rows: [[field.value || 'Boost regional sustainability and growth through partnerships and investment', 'Strategic', 'Linked']],
      },
      'Link Capabilities': {
        action: 'Link capability',
        description: 'Business capabilities affected by the project.',
        columns: ['Capability', 'Owner', 'Status'],
        rows: [[field.value || 'Regulatory Assurance', 'Strategy', 'Linked']],
      },
      'Link Services': {
        action: 'Link service',
        description: 'Service mapping connected to the selected capabilities.',
        columns: ['Service group', 'Value stream', 'Service', 'Status'],
        rows: [['Corporate Services', 'Procure to Pay', field.value || 'Material Master Maintenance', 'Linked']],
      },
      Milestones: {
        action: 'Add milestone',
        description: 'Milestone, owner, and planned due date.',
        columns: ['Milestone', 'Owner', 'Due date', 'Status'],
        rows: [[field.value || 'Initiation gate', 'Project Manager', '2026-06-12', 'Planned']],
      },
      'End Product (Deliverables)': {
        action: 'Add deliverable',
        description: 'End deliverables produced by the project.',
        columns: ['Deliverable', 'Owner', 'Status'],
        rows: [[field.value || 'Research capability map', 'Delivery Office', 'Draft']],
      },
      'Management Product': {
        action: 'Add product',
        description: 'Management products required for governance.',
        columns: ['Product', 'Owner', 'Status'],
        rows: [[field.value || 'Project initiation documentation', 'PMO', 'Draft']],
      },
      'Detailed WBS': {
        action: 'Add WBS item',
        description: 'Work packages and delivery ownership.',
        columns: ['Work package', 'Owner', 'Status'],
        rows: [[field.value || 'Discovery and data model', 'Project Manager', 'Planned']],
      },
      'Funding Sources': {
        action: 'Add source',
        description: 'Funding source and allocation details.',
        columns: ['Source', 'Type', 'Amount'],
        rows: [[field.value || 'Innovation fund', 'CAPEX', 'SAR 1.2M']],
      },
      'Monthly Budget Detail': {
        action: 'Add month',
        description: 'Monthly CAPEX and OPEX phasing.',
        columns: ['Month', 'CAPEX', 'OPEX', 'Status'],
        rows: [[field.value || 'Monthly phasing', 'SAR 120K', 'SAR 42K', 'Draft']],
      },
      'Benefits Register': {
        action: 'Add benefit',
        description: 'Benefit, owner, and realization status.',
        columns: ['Benefit', 'Owner', 'Realization'],
        rows: [[field.value || 'Improved research discovery', 'Research Office', 'Planned']],
      },
      'Risks Register': {
        action: 'Add risk',
        description: 'Risk, owner, and current exposure.',
        columns: ['Risk', 'Owner', 'Rating'],
        rows: [[field.value || 'Stakeholder data quality', 'PMO', 'High']],
      },
      'Issues Register': {
        action: 'Add issue',
        description: 'Issue, owner, and decision status.',
        columns: ['Issue', 'Owner', 'Status'],
        rows: [[field.value || 'Open PMO decisions', 'PMO', 'Open']],
      },
      'Change Impact Assessment': {
        action: 'Add impact',
        description: 'Impacted audience and readiness.',
        columns: ['Impact area', 'Owner', 'Readiness'],
        rows: [[field.value || 'Process adoption impact', 'Change team', 'Assessing']],
      },
      'Related Links / Documents': {
        action: 'Add link',
        description: 'Project evidence and supporting documents.',
        columns: ['Document', 'Type', 'Status'],
        rows: [[field.value || 'Research source pack', 'Reference', 'Linked']],
      },
      'Resource Plan': {
        action: 'Add resource',
        description: 'Role, named owner, and allocation.',
        columns: ['Role', 'Owner', 'Allocation'],
        rows: [[field.value || 'PM, analyst, data steward', 'Muna Hassan', 'Planned']],
      },
      'Predecessor Project(s)': {
        action: 'Add predecessor',
        description: 'Upstream project dependency.',
        columns: ['Project', 'Relationship', 'Status'],
        rows: [[field.value || 'Data source onboarding', 'Predecessor', 'Tracking']],
      },
      'Successor Project(s)': {
        action: 'Add successor',
        description: 'Downstream project dependency.',
        columns: ['Project', 'Relationship', 'Status'],
        rows: [[field.value || 'Research portal rollout', 'Successor', 'Planned']],
      },
    };

    return configs[fieldName] || {
      action: 'Add item',
      description: 'Register item, owner, and current status.',
      columns: ['Name', 'Owner', 'Status'],
      rows: [[field.value || fieldName, 'Project Manager', 'Draft']],
    };
  }

  private showGuidedTourStep(index: number): void {
    this.guidedTourStep = Math.min(Math.max(index, 0), guidedTourSteps.length - 1);
    this.prepareGuidedTourTarget();
    this.iconsHydrated = false;
    this.scheduleGuidedTourPosition();
    this.changeDetector.markForCheck();
  }

  private prepareGuidedTourTarget(): void {
    const target = this.activeGuidedTourStep.target;
    if (target === 'action-board' || target === 'create-psr') {
      this.selectedPage = 'workspace';
      this.selectedView = 'board';
    }
    if (target === 'frontdoor-actions' || target === 'workspace-tabs' || target === 'right-report-widget') {
      this.selectedPage = 'workspace';
    }
  }

  private scheduleGuidedTourPosition(): void {
    if (this.guidedTourFrame !== null) return;
    this.guidedTourFrame = window.requestAnimationFrame(() => {
      this.guidedTourFrame = null;
      this.positionGuidedTour();
    });
  }

  private positionGuidedTour(): void {
    const doc = this.elementRef.nativeElement.ownerDocument;
    const overlay = doc.querySelector<HTMLElement>('[data-tour-overlay]');
    if (!overlay) return;

    const targetName = overlay.dataset['tourTargetName'];
    let target = targetName ? doc.querySelector<HTMLElement>(`[data-tour-target="${targetName}"]`) : null;
    target = target || doc.querySelector<HTMLElement>('.app-canvas');
    if (!target) return;

    let rect = target.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) {
      target = doc.querySelector<HTMLElement>('.app-canvas') || target;
      rect = target.getBoundingClientRect();
    }

    const spotlight = overlay.querySelector<HTMLElement>('[data-tour-spotlight]');
    const card = overlay.querySelector<HTMLElement>('[data-tour-card]');
    if (!spotlight || !card) return;

    const padding = 8;
    const isRailTour = targetName === 'side-navigation';
    const railWidth = Math.min(rect.width, 68);
    const x = isRailTour
      ? Math.max(8, rect.left + Math.max(0, (rect.width - railWidth) / 2) - padding)
      : Math.max(8, rect.left - padding);
    const y = isRailTour ? Math.max(8, rect.top + 8) : Math.max(8, rect.top - padding);
    const width = isRailTour
      ? Math.min(window.innerWidth - x - 8, railWidth + padding * 2)
      : Math.min(window.innerWidth - x - 8, rect.width + padding * 2);
    const height = isRailTour
      ? Math.min(window.innerHeight - y - 8, rect.height - 16)
      : Math.min(window.innerHeight - y - 8, rect.height + padding * 2);

    spotlight.style.left = `${Math.round(x)}px`;
    spotlight.style.top = `${Math.round(y)}px`;
    spotlight.style.width = `${Math.round(width)}px`;
    spotlight.style.height = `${Math.round(height)}px`;

    const cardWidth = card.offsetWidth || 330;
    const cardHeight = card.offsetHeight || 270;
    let cardX = isRailTour ? x + width + 24 : rect.right + 18;
    if (cardX + cardWidth > window.innerWidth - 18) {
      cardX = rect.left - cardWidth - 18;
    }
    if (cardX < 18) {
      cardX = Math.max(18, Math.min(window.innerWidth - cardWidth - 18, rect.left + rect.width / 2 - cardWidth / 2));
    }

    const cardY = isRailTour
      ? Math.max(96, Math.min(window.innerHeight - cardHeight - 18, rect.top + 24))
      : Math.max(84, Math.min(window.innerHeight - cardHeight - 18, rect.top));
    card.style.left = `${Math.round(cardX)}px`;
    card.style.top = `${Math.round(cardY)}px`;
  }

  private stageGateContext(key: string | null): StageGateContext | null {
    if (!key) return null;
    const [project, stageId] = key.split('|');
    const profile = this.stageProfileForProject(project);
    const stageIndex = stageDefinitions.findIndex((stage) => stage.id === stageId);
    if (!profile || stageIndex < 0) return null;
    const status = this.stageStatus(profile, stageIndex);
    return {
      profile,
      stage: stageDefinitions[stageIndex],
      stageIndex,
      status,
      checkedCount: status === 'complete' ? profile.gateTotal : profile.gateDone,
    };
  }

  private stageGateKey(project: string, stageId: string): string {
    return `${project}|${stageId}`;
  }

  private stageCurrentIndex(profile: StageProfile): number {
    return Math.min(Math.max(profile.currentStage, 0), stageDefinitions.length - 1);
  }

  private stageStatus(profile: StageProfile, stageIndex: number): StageGateStatus {
    const currentIndex = this.stageCurrentIndex(profile);
    if (stageIndex < currentIndex) return 'complete';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  }

  private stageProfileForProject(project: string): StageProfile | undefined {
    const profile = stageProfiles.find((item) => item.project === project);
    if (this.onboardingPm101Locked && project === firstAssignedProject.id && profile) {
      return {
        ...profile,
        currentStage: 1,
        tone: 'amber',
        checkpoint: 'Project plan baseline and planning evidence',
        checklist: ['Planning scope confirmed', 'Schedule baseline drafted', 'Budget assumptions captured', 'RAID owners assigned', 'Planning gate pack prepared'],
      };
    }
    return profile;
  }

  private projectPlanEntryFromAction(entry: string | undefined): ProjectPlanEntry {
    return entry === 'reports' || entry === 'change-request' || entry === 'closure' ? entry : 'quick';
  }

  projectPlanFieldOptions(field: ProjectPlanField): string[] {
    if (field.type === 'boolean') return ['Yes', 'No'];
    return field.options || [];
  }

  dependencyCountLabel(register: DependencyRegisterConfig): string {
    return register.rows.length === 1 ? '1 record' : `${register.rows.length} records`;
  }

  benefitCountLabel(register: BenefitPlanConfig): string {
    return register.rows.length === 1 ? '1 benefit' : `${register.rows.length} benefits`;
  }

  issueCountLabel(register: IssuePlanConfig): string {
    return register.rows.length === 1 ? '1 issue' : `${register.rows.length} issues`;
  }

  changeImpactCountLabel(register: ChangeImpactConfig): string {
    return register.rows.length === 1 ? '1 impact' : `${register.rows.length} impacts`;
  }

  relatedLinksCountLabel(register: RelatedLinkConfig): string {
    return register.rows.length === 1 ? '1 link' : `${register.rows.length} links`;
  }

  resourceCountLabel(register: ResourcePlanConfig): string {
    return register.rows.length === 1 ? '1 resource' : `${register.rows.length} resources`;
  }

  changeImpactLevelTone(level: string): string {
    const normalized = level.toLowerCase();
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('medium')) return 'medium';
    if (normalized.includes('low')) return 'low';
    return 'neutral';
  }

  issueCriticalityTone(level: string): string {
    const normalized = level.toLowerCase();
    if (normalized.includes('critical')) return 'critical';
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('medium')) return 'medium';
    if (normalized.includes('low')) return 'low';
    return 'neutral';
  }

  issueStatusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('closed') || normalized.includes('resolved')) return 'success';
    if (normalized.includes('progress')) return 'indigo';
    if (normalized.includes('pending')) return 'amber';
    if (normalized.includes('open')) return 'neutral';
    return 'neutral';
  }

  dependencyStatusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('track')) return 'indigo';
    if (normalized.includes('plan')) return 'neutral';
    if (normalized.includes('risk') || normalized.includes('block')) return 'amber';
    return 'neutral';
  }

  private projectPlanFieldsToDependencyRegisters(fields: ProjectPlanField[]): DependencyRegisterConfig[] {
    const fieldToRegister: Partial<Record<string, DependencyRegisterConfig>> = {
      'Predecessor Project(s)': dependencyRegisterConfigs.predecessor,
      'Successor Project(s)': dependencyRegisterConfigs.successor,
    };
    return fields
      .map((field) => fieldToRegister[field.field])
      .map((register) => (register ? this.dependencyRegisterWithState(register.key) : null))
      .filter((register): register is DependencyRegisterConfig => Boolean(register));
  }

  private dependencyRegisterWithState(key: DependencyRegisterKey): DependencyRegisterConfig {
    const register = dependencyRegisterConfigs[key];
    return {
      ...register,
      rows: this.dependencyRegisterRows[key],
      draft: this.dependencyRegisterDrafts[key],
    };
  }

  private resetDependencyDraft(key: DependencyRegisterKey): void {
    this.dependencyRegisterDrafts = {
      ...this.dependencyRegisterDrafts,
      [key]: { ...dependencyRegisterConfigs[key].draft },
    };
  }

  private resetBenefitDraft(): void {
    this.benefitPlanDraft = { ...benefitPlanConfig.draft };
  }

  private resetIssueDraft(): void {
    this.issuePlanDraft = { ...issuePlanConfig.draft };
  }

  private resetRelatedLinksDraft(): void {
    this.relatedLinkDraft = { ...relatedLinkConfig.draft };
  }

  private changeImpactRegisterWithState(): ChangeImpactConfig {
    return {
      ...changeImpactConfig,
      rows: this.changeImpactRows.map((row) => ({ ...row, strategies: [...row.strategies] })),
      draft: { ...this.changeImpactDraft, strategies: [...this.changeImpactDraft.strategies] },
    };
  }

  private resetChangeImpactDraft(): void {
    this.changeImpactDraft = {
      ...changeImpactConfig.draft,
      strategies: [...changeImpactConfig.draft.strategies],
    };
  }

  private formatProjectPlanDate(value: string): string {
    if (!value) return '';
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const parsed = dateOnlyMatch
      ? new Date(Date.UTC(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3])))
      : new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(parsed);
  }

  private formatDependencyDate(value: string): string {
    return this.formatProjectPlanDate(value);
  }

  private resetResourcePlanDraft(): void {
    this.resourcePlanDraft = { ...resourcePlanConfig.draft };
  }

  private formatResourcePlanDate(value: string): string {
    return this.formatProjectPlanDate(value);
  }

  private closeProjectPlanDrawers(): void {
    this.closeBenefitDrawer();
    this.closeIssueDrawer();
    this.closeRelatedLinksDrawer();
    this.closeResourceDrawer();
    this.closeChangeImpactDrawer();
    this.closeDependencyDrawer();
  }

  private projectPlanFieldsForSection(section: string): ProjectPlanField[] {
    return projectPlanFieldMatrix.filter((field) => field.section === section && field.detailed);
  }

  private isProjectPlanDetailedOnlyField(field: ProjectPlanField): boolean {
    return field.detailed && !field.intermediate;
  }

  private isProjectPlanDetailedOnlySection(section: string): boolean {
    return this.additionalProjectPlanSections.includes(section);
  }

  private projectPlanFieldGroupsForSection(section: string, fields: ProjectPlanField[]): ProjectPlanFieldGroup[] {
    if (!fields.length) return [];
    const availableFields = new Map(fields.map((field) => [field.field, field]));
    const usedFields = new Set<string>();
    const groups = (projectPlanSectionFieldGroups[section] || [])
      .map((group) => {
        const groupFields = group.fields
          .map((fieldName) => availableFields.get(fieldName))
          .filter((field): field is ProjectPlanField => Boolean(field));
        groupFields.forEach((field) => usedFields.add(field.field));
        return { title: group.title, description: group.description, fields: groupFields };
      })
      .filter((group) => group.fields.length);
    const remainingFields = fields.filter((field) => !usedFields.has(field.field));
    if (remainingFields.length) {
      groups.push({
        title: 'Additional fields',
        description: 'Other fields retained from the project plan matrix.',
        fields: remainingFields,
      });
    }
    return groups;
  }

  private projectPlanGroupForSection(section: string): SimplePlanSection {
    const groups: Record<string, SimplePlanSection> = {
      'Project Setup': this.simplePlanSections[0],
      Overview: this.simplePlanSections[1],
      'Schedule & Scope': this.simplePlanSections[2],
      Budget: this.simplePlanSections[3],
      Benefits: {
        title: 'Benefits register',
        body: 'Benefits, ownership, and realization status.',
        icon: 'benefit',
        fields: [
          { label: 'Benefits Register', value: 'Improved research discovery', wide: true },
          { label: 'Benefit Owner', value: 'Research Leads Forum' },
          { label: 'Realization Target', value: 'Q4 2026' },
        ],
      },
      Risk: {
        title: 'Risk register',
        body: 'Threats, ownership, and current exposure.',
        icon: 'risks',
        fields: [
          { label: 'Risks Register', value: 'Stakeholder data quality', wide: true },
          { label: 'Risk Owner', value: 'Muna Hassan' },
          { label: 'Current Exposure', value: 'Medium' },
        ],
      },
      Resource: {
        title: 'Resource plan',
        body: 'Roles, owners, and planned allocation.',
        icon: 'resources',
        fields: [
          { label: 'Resource Plan', value: 'PM, analyst, data steward', wide: true },
          { label: 'Delivery Manager', value: 'Delivery Office' },
          { label: 'PMO Contact', value: 'PMO Desk' },
        ],
      },
      Issues: {
        title: 'Issues register',
        body: 'Open issues and decisions that need active management.',
        icon: 'issues',
        fields: [
          { label: 'Issues Register', value: 'Open PMO decisions', wide: true },
          { label: 'Issue Owner', value: 'PMO Desk' },
        ],
      },
      'Change Impact': {
        title: 'Change impact assessment',
        body: 'Operational impact, audience readiness, and adoption ownership.',
        icon: 'changeRequest',
        fields: [
          { label: 'Change Impact Assessment', value: 'Process adoption impact', wide: true },
          { label: 'Change Manager', value: 'Change team' },
        ],
      },
      'Related Links': {
        title: 'Documents and links',
        body: 'Evidence, reference documents, and supporting URLs.',
        icon: 'link',
        fields: [
          { label: 'Related Links / Documents', value: 'Research source pack', wide: true },
          { label: 'Governance Board(s)/Forum(s)', value: 'PMO Steering Forum' },
        ],
      },
      Dependency: {
        title: 'Project dependencies',
        body: 'Upstream and downstream project relationships.',
        icon: 'dependencies',
        fields: [
          { label: 'Predecessor Project(s)', value: 'Data source onboarding', wide: true },
          { label: 'Successor Project(s)', value: 'Research portal rollout', wide: true },
        ],
      },
      Miscellaneous: {
        title: 'Assurance tracking',
        body: 'Compliance review counts, recommendations, and admin commentary.',
        icon: 'settings',
        fields: [
          { label: 'ICT Component', value: 'Yes' },
          { label: 'Number of Assurance/Compliance Reviews Completed', value: '0', kind: 'number' },
          { label: 'Commentary of admins', value: '', kind: 'textarea', wide: true },
        ],
      },
    };
    return groups[section] || this.simplePlanSections[1];
  }

  private emitState(): void {
    this.syncLastActionWorkspaceView(this.selectedView);
    this.iconsHydrated = false;
    this.consoleStateChange.emit({
      projectId: this.selectedProject,
      selectedPage: this.selectedPage,
      selectedView: this.selectedView,
      frontDoorMode: this.frontDoorMode,
      pmoAssignmentReady: this.pmoAssignmentReady,
      guidedTourActive: this.guidedTourActive,
      guidedTourExitMode: this.guidedTourExitMode,
      onboardingPm101Locked: this.onboardingPm101Locked,
    });
  }

  private isOnboardingPm101BlockedView(view: WorkspaceView | undefined): boolean {
    return Boolean(this.onboardingPm101Locked && (view === 'board' || view === 'calendar' || view === 'stages'));
  }

  private isActionWorkspaceView(view: WorkspaceView): view is ActionWorkspaceView {
    return view === 'board' || view === 'calendar';
  }

  private syncLastActionWorkspaceView(view: WorkspaceView): void {
    if (!this.isActionWorkspaceView(view)) return;
    this.lastActionWorkspaceView = view;
  }

  private loadPinnedQuickLinks(): string[] {
    try {
      const stored = window.localStorage.getItem(QUICK_LINK_STORAGE_KEY);
      return this.normalizePinnedQuickLinks(stored ? JSON.parse(stored) : defaultPinnedQuickLinkIds);
    } catch {
      return this.normalizePinnedQuickLinks(defaultPinnedQuickLinkIds);
    }
  }

  private persistPinnedQuickLinks(): void {
    try {
      window.localStorage.setItem(QUICK_LINK_STORAGE_KEY, JSON.stringify(this.pinnedIds));
    } catch {
      // Ignore locked-down storage; in-memory pins still work for this session.
    }
  }

  private loadWorkspaceTableColumns(): WorkspaceTableColumnId[] {
    try {
      const stored = window.localStorage.getItem(WORKSPACE_TABLE_COLUMN_STORAGE_KEY);
      return this.normalizeWorkspaceTableColumns(stored ? JSON.parse(stored) : defaultWorkspaceTableColumnIds);
    } catch {
      return [...defaultWorkspaceTableColumnIds];
    }
  }

  private persistWorkspaceTableColumns(): void {
    try {
      window.localStorage.setItem(WORKSPACE_TABLE_COLUMN_STORAGE_KEY, JSON.stringify(this.visibleWorkspaceTableColumnIds));
    } catch {
      // Ignore locked-down storage; in-memory preferences still work for this session.
    }
  }

  private showQuickLinksToast(message: string): void {
    this.quickLinksToast = message;
    this.iconsHydrated = false;
    if (this.quickLinksToastTimer !== null) {
      window.clearTimeout(this.quickLinksToastTimer);
    }
    this.quickLinksToastTimer = window.setTimeout(() => {
      this.quickLinksToast = null;
      this.quickLinksToastTimer = null;
      this.changeDetector.markForCheck();
    }, 2800);
  }

  private normalizePinnedQuickLinks(ids: string[]): string[] {
    const validIds = new Set(projectQuickActions.map((action) => action.id));
    return [...new Set(ids.filter((id) => validIds.has(id)))].slice(0, QUICK_LINK_PIN_LIMIT);
  }

  private createWorkspaceTableColumnMotionStates(ids: WorkspaceTableColumnId[]): Partial<Record<WorkspaceTableColumnId, WorkspaceTableColumnMotionState>> {
    return ids.reduce<Partial<Record<WorkspaceTableColumnId, WorkspaceTableColumnMotionState>>>((states, id) => {
      states[id] = 'visible';
      return states;
    }, {});
  }

  private showWorkspaceTableColumn(id: WorkspaceTableColumnId): void {
    this.clearWorkspaceTableColumnAnimation(id);
    this.renderedWorkspaceTableColumnIds = this.normalizeWorkspaceTableRenderedColumns([...this.renderedWorkspaceTableColumnIds, id]);
    this.workspaceTableColumnMotionStates = {
      ...this.workspaceTableColumnMotionStates,
      [id]: 'entering',
    };
    this.workspaceTableColumnFrames[id] = window.requestAnimationFrame(() => {
      this.workspaceTableColumnFrames[id] = undefined;
      this.workspaceTableColumnMotionStates = {
        ...this.workspaceTableColumnMotionStates,
        [id]: 'visible',
      };
      this.changeDetector.markForCheck();
    });
  }

  private hideWorkspaceTableColumn(id: WorkspaceTableColumnId): void {
    this.clearWorkspaceTableColumnAnimation(id);
    this.workspaceTableColumnMotionStates = {
      ...this.workspaceTableColumnMotionStates,
      [id]: 'exiting',
    };
    this.workspaceTableColumnTimers[id] = window.setTimeout(() => {
      this.workspaceTableColumnTimers[id] = undefined;
      this.renderedWorkspaceTableColumnIds = this.renderedWorkspaceTableColumnIds.filter((columnId) => columnId !== id);
      const nextStates = { ...this.workspaceTableColumnMotionStates };
      delete nextStates[id];
      this.workspaceTableColumnMotionStates = nextStates;
      this.changeDetector.markForCheck();
    }, WORKSPACE_TABLE_COLUMN_MOTION_MS);
  }

  private clearWorkspaceTableColumnAnimation(id: WorkspaceTableColumnId): void {
    const timer = this.workspaceTableColumnTimers[id];
    if (timer) {
      window.clearTimeout(timer);
      this.workspaceTableColumnTimers[id] = undefined;
    }
    const frame = this.workspaceTableColumnFrames[id];
    if (frame) {
      window.cancelAnimationFrame(frame);
      this.workspaceTableColumnFrames[id] = undefined;
    }
  }

  private normalizeWorkspaceTableColumns(ids: WorkspaceTableColumnId[]): WorkspaceTableColumnId[] {
    const requested = new Set(ids);
    const normalized = defaultWorkspaceTableColumnIds.filter((id) => requested.has(id));
    return normalized.length ? normalized : [...defaultWorkspaceTableColumnIds];
  }

  private normalizeWorkspaceTableRenderedColumns(ids: WorkspaceTableColumnId[]): WorkspaceTableColumnId[] {
    const requested = new Set(ids);
    return defaultWorkspaceTableColumnIds.filter((id) => requested.has(id));
  }

  private actionsFromIds(ids: string[]): QuickAction[] {
    return this.normalizePinnedQuickLinks(ids)
      .map((id) => projectQuickActions.find((action) => action.id === id))
      .filter((action): action is QuickAction => Boolean(action));
  }

  private parseDate(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private dateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private sameMonth(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
  }
}
