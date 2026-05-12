import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleMountOptions } from './pm-console.types';

type ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground';
type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages';
type WorkspaceDisplay = 'table' | 'cards';
type ProjectPlanEntry = 'quick' | 'reports' | 'change-request' | 'closure';
type ProjectPlanDetailMode = 'simple' | 'detailed';

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

interface SimplePlanTableConfig {
  action: string;
  description: string;
  columns: string[];
  rows: string[][];
}

const iconMap: Record<string, string> = {
  alert: 'triangle-alert',
  arrow: 'chevron-right',
  benefit: 'circle-check',
  bell: 'bell',
  book: 'book-open',
  building: 'building-2',
  calendar: 'calendar-days',
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

const workspaceTableProjects: ProjectRow[] = [
  { id: 'UAE Research Map', code: 'ATRC-01', title: 'UAE Research Map', stage: 'Initiation', status: 'Alert', statusTone: 'amber', trend: ['green', 'amber', 'amber'], manager: 'Muna Hassan', managerInitials: 'MH', baselineStart: '01/15/2024', baselineEnd: '06/12/2026', budgetUsed: '$125K', budgetTotal: '$320K', priority: 'high' },
  { id: 'Global Anti-Scam Taskforce', code: 'ATRC-02', title: 'Global Anti-Scam Taskforce', stage: 'Closure', status: 'On-Track', statusTone: 'green', trend: ['green', 'green', 'amber'], manager: 'Sarah Ahmed', managerInitials: 'SA', baselineStart: '03/22/2024', baselineEnd: '03/22/2026', budgetUsed: '$125K', budgetTotal: '$320K', priority: 'normal' },
  { id: 'Counter Terrorism Operations', code: 'ATRC-03', title: 'Counter Terrorism Operations', stage: 'Execution', status: 'Off-Track', statusTone: 'red', trend: ['amber', 'red', 'amber'], manager: 'Ahmed Hadi', managerInitials: 'AH', baselineStart: '07/04/2023', baselineEnd: '11/30/2025', budgetUsed: '$125K', budgetTotal: '$320K', priority: 'high' },
  { id: 'Vision 2030', code: 'ATRC-04', title: 'Vision 2030', stage: 'Execution', status: 'On-Track', statusTone: 'green', trend: ['green', 'green', 'green'], manager: 'Muna Hassan', managerInitials: 'MH', baselineStart: '02/01/2024', baselineEnd: '10/30/2026', budgetUsed: '$2.5M', budgetTotal: '$4.3M', priority: 'normal' },
  { id: 'NEOM Integration', code: 'ATRC-05', title: 'NEOM Integration', stage: 'Planning', status: 'Alert', statusTone: 'amber', trend: ['amber', 'red', 'green'], manager: 'Fatima Ali', managerInitials: 'FA', baselineStart: '09/18/2024', baselineEnd: '01/16/2027', budgetUsed: '$3.1M', budgetTotal: '$3.1M', priority: 'normal' },
  { id: 'Smart City Alpha', code: 'ATRC-06', title: 'Smart City Alpha', stage: 'Execution', status: 'On-Track', statusTone: 'green', trend: ['green', 'amber', 'green'], manager: 'Khalid Omar', managerInitials: 'KO', baselineStart: '04/08/2025', baselineEnd: '12/15/2026', budgetUsed: '$980K', budgetTotal: '$1.7M', priority: 'normal' },
  { id: 'PMO Capability', code: 'ATRC-07', title: 'PMO Capability', stage: 'Initiation', status: 'Not Started', statusTone: 'blue', trend: ['neutral', 'neutral', 'blue'], manager: 'Laila Noor', managerInitials: 'LN', baselineStart: '05/20/2026', baselineEnd: '02/28/2027', budgetUsed: '$0', budgetTotal: '$1.2M', priority: 'not-started' },
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
  { project: 'UAE Research Map', dueLabel: 'Due today', dueTone: 'amber', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'attention' }, { label: 'May', status: 'due' }] },
  { project: 'Vision 2030', dueLabel: 'Overdue 5 days', dueTone: 'red', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'overdue' }] },
  { project: 'NEOM Integration', dueLabel: 'Due today', dueTone: 'amber', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'due' }] },
  { project: 'Smart City Alpha', dueLabel: 'On track', dueTone: 'green', trend: [{ label: 'Mar', status: 'attention' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'submitted' }] },
  { project: 'PMO Capability', dueLabel: 'Due this week', dueTone: 'amber', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'submitted' }, { label: 'May', status: 'draft' }] },
  { project: 'Counter Terrorism Operations', dueLabel: 'Overdue 2 days', dueTone: 'red', trend: [{ label: 'Mar', status: 'submitted' }, { label: 'Apr', status: 'attention' }, { label: 'May', status: 'overdue' }] },
];

const reportCreationDetails: Record<string, ReportCreationDetail> = {
  'UAE Research Map': {
    intervalStart: '30/04/2026',
    intervalEnd: '29/05/2026',
    intervalStatus: 'Not created',
    stage: 'Initiation',
    state: 'Active',
    overallTrend: 'Needs attention',
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

const pm101Steps = [
  { title: 'Project assigned', body: 'You’ll receive a PMO assignment notification.', iconAsset: './assets/pm101/icon-1.svg', decor: 'burst', decorAssets: ['./assets/pm101/decor-1.svg'] },
  { title: 'Build project plan', body: 'Set scope, timeline, risks, and dependencies.', iconAsset: './assets/pm101/icon-2.svg', decor: 'rings', decorAssets: ['./assets/pm101/decor-2.svg'] },
  { title: 'Submit for approval', body: 'Send your baseline for PMO review and endorsement.', iconAsset: './assets/pm101/icon-3.svg', decor: 'plus', decorAssets: ['./assets/pm101/decor-3-group-1.svg', './assets/pm101/decor-3-group-2.svg', './assets/pm101/decor-3-group-3.svg', './assets/pm101/decor-3-group-4.svg'] },
  { title: 'Manage delivery', body: 'Track milestones, issues, and dependencies.', iconAsset: './assets/pm101/icon-4.svg', decor: 'loops', decorAssets: ['./assets/pm101/decor-4.svg'] },
  { title: 'Report progress', body: 'Submit PSRs and maintain delivery health.', iconAsset: './assets/pm101/icon-5.svg', decor: 'hex', decorAssets: ['./assets/pm101/decor-5.svg'] },
];

const QUICK_LINK_PIN_LIMIT = 10;
const QUICK_LINK_PAGE_SIZE = 10;
const QUICK_LINK_STORAGE_KEY = 'tasama.quickLinks.pinned';
const defaultPinnedQuickLinkIds = ['project-plan', 'wbs'];

@Component({
  selector: 'app-pm-console-content',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas" [class.workspaces-canvas]="selectedPage === 'workspaces'" [class.wbs-canvas]="selectedPage === 'wbs'" [class.project-plan-canvas]="selectedPage === 'project-plan'" [class.playground-canvas]="selectedPage === 'playground'" [class.unassigned-canvas]="frontDoorMode === 'unassigned'">
      @switch (selectedPage) {
        @case ('workspaces') {
          <section class="pm-projects-page" [class.table-mode]="workspaceDisplay === 'table'" [class.card-mode]="workspaceDisplay === 'cards'" aria-label="PM Console projects">
            <div class="pm-projects-board">
              <div class="pm-projects-title-row">
                <div>
                  <h1>Workspaces</h1>
                  <p>Showing all {{ workspaceTableProjects.length }} projects</p>
                </div>
                <div class="pm-projects-controls">
                  <label class="pm-project-search"><span class="icon" aria-hidden="true"><i data-lucide="search"></i></span><input type="search" aria-label="Search for projects" placeholder="Search for projects" /></label>
                  <div class="pm-project-view-toggle" aria-label="Project display">
                    <button [class.active]="workspaceDisplay === 'table'" type="button" aria-label="Table view" [attr.aria-pressed]="workspaceDisplay === 'table'" (click)="workspaceDisplay = 'table'; refreshIcons()"><span class="icon" aria-hidden="true"><i data-lucide="table-2"></i></span></button>
                    <button [class.active]="workspaceDisplay === 'cards'" type="button" aria-label="Card view" [attr.aria-pressed]="workspaceDisplay === 'cards'" (click)="workspaceDisplay = 'cards'; refreshIcons()"><span class="icon" aria-hidden="true"><i data-lucide="layout-grid"></i></span></button>
                  </div>
                  <label class="pm-project-select"><select aria-label="Project filter"><option>All projects</option></select><span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></label>
                  <button class="pm-project-filter" type="button" aria-label="Filter projects"><span class="icon" aria-hidden="true"><i data-lucide="filter"></i></span></button>
                </div>
              </div>

              @if (workspaceDisplay === 'table') {
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
                      <button class="pm-table-tool" type="button"><span class="icon" aria-hidden="true"><i data-lucide="download"></i></span><span>Export</span></button>
                      <button class="pm-table-add-project" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span><span>Add Project</span></button>
                      <button class="pm-table-tool square" type="button" aria-label="Table settings"><span class="icon" aria-hidden="true"><i data-lucide="settings"></i></span></button>
                    </div>
                  </div>
                  <div class="pm-project-table-scroll" tabindex="0">
                    <table class="pm-project-table">
                      <thead><tr><th class="pm-table-check-cell"><input type="checkbox" aria-label="Select all projects" /></th><th>Project Name</th><th>Stage</th><th>Report Status Trend</th><th>Project Manager</th><th>Baseline Start Date</th><th>Baseline End Date</th><th>Budget Utilised</th><th>Status</th></tr></thead>
                      <tbody>
                        @for (project of workspaceTableProjects; track project.id) {
                          <tr>
                            <td class="pm-table-check-cell"><input type="checkbox" [attr.aria-label]="'Select ' + project.title" /></td>
                            <td class="pm-table-project-cell"><button type="button" (click)="openProject(project.id)"><span>{{ project.code }}</span><strong>{{ project.title }}</strong></button></td>
                            <td><span class="pm-table-stage">{{ project.stage }}</span></td>
                            <td><div class="pm-table-trend" [attr.aria-label]="project.title + ' report status trend'">@for (tone of project.trend; track $index) { <span class="pm-table-trend-dot {{ tone }}" role="img" [attr.aria-label]="trendLabel(tone)" [attr.title]="trendLabel(tone)"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(tone)"></i></span></span> }</div></td>
                            <td><span class="pm-table-manager"><i>{{ project.managerInitials }}</i>{{ project.manager }}</span></td>
                            <td>{{ project.baselineStart }}</td>
                            <td>{{ project.baselineEnd }}</td>
                            <td><span class="pm-table-budget"><strong>{{ project.budgetUsed }}</strong><small>/ {{ project.budgetTotal }}</small></span></td>
                            <td class="pm-table-status-cell"><span class="pm-table-row-status {{ project.statusTone }}">{{ project.status }}</span></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              } @else {
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
              }
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
                            <details class="matrix-field-group" open>
                              <summary><span class="matrix-field-group-copy"><strong>{{ activeProjectPlanGroup.title }}</strong><small>{{ activeProjectPlanGroup.body }}</small></span><span class="matrix-field-group-meta"><b>{{ activeProjectPlanGroup.fields.length }}</b><span class="icon"><i data-lucide="chevron-down"></i></span></span></summary>
                              <div class="matrix-field-group-grid">
                                @for (field of activeProjectPlanGroup.fields; track field.label) {
                                  <label class="matrix-field" [class.wide]="field.wide" [class.matrix-field-textarea]="field.kind === 'textarea'"><span class="matrix-field-label">{{ field.label }}</span>
                                    @if (field.kind === 'textarea') { <textarea [value]="field.value"></textarea> } @else { <input [type]="field.kind || 'text'" [value]="field.value" /> }
                                  </label>
                                }
                              </div>
                            </details>
                          </div>
                        </section>
                      }
                    </div>
                  </main>
                </div>
                @if (projectPlanDetailMode === 'simple') {
                  <div class="project-plan-bottom-actions">
                    <button class="project-plan-save-draft" type="button"><span class="icon" aria-hidden="true"><i data-lucide="save"></i></span>Save as draft</button>
                    <button class="project-plan-submit" type="button"><span class="icon" aria-hidden="true"><i data-lucide="send"></i></span>Submit for approval</button>
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
            <section class="unassigned-frontdoor" aria-label="No projects assigned yet"><div class="unassigned-hero"><div class="unassigned-hero-copy"><span class="unassigned-kicker">New PM workspace</span><h1>Welcome to your PM front door</h1><p>No projects have been assigned to you yet. We’ll notify you when PMO assigns one.</p><button class="unassigned-status-pill" type="button" (click)="assignFirstProject()"><span class="icon" aria-hidden="true"><i data-lucide="bell"></i></span><span>Waiting for PMO assignment</span></button></div></div></section>
          } @else {
            <div class="content-grid">
              <div class="left-column">
                <section class="workspace-panel" [class.project-workspace-panel]="!isAllProjects" [class.board-workspace-panel]="selectedView === 'board'">
                  <div class="workspace-shell-head">
                    <div class="workspace-title"><h2>{{ workspaceTitle }}</h2><p>Plan this month, clear overdue work, and track stage-gates without opening every project.</p></div>
                    <aside class="ai-insight-widget red" aria-label="AI insights from front door"><div class="ai-insight-main"><div class="ai-insight-copy"><span>Needs attention</span><strong>Submit Vision 2030 status report</strong><p>Overdue by 5 days. Clear this before the next steering check.</p></div><div class="ai-insight-bubbles ai-insight-bubbles-bottom" aria-label="AI insight slides"><button class="ai-insight-dot active" type="button" aria-label="Show AI insight 1"></button><button class="ai-insight-dot" type="button" aria-label="Show AI insight 2"></button><button class="ai-insight-dot" type="button" aria-label="Show AI insight 3"></button></div></div></aside>
                    <div class="workspace-tabs" role="tablist" aria-label="Workspace view" data-tour-target="workspace-tabs"><button [class.active]="selectedView !== 'stages'" type="button" aria-selected="true" (click)="setView('calendar')"><span class="icon" aria-hidden="true"><i data-lucide="check-square"></i></span> Actions</button><button [class.active]="selectedView === 'stages'" type="button" [attr.aria-selected]="selectedView === 'stages'" (click)="setView('stages')"><span class="icon" aria-hidden="true"><i data-lucide="list-tree"></i></span> Stages</button></div>
                  </div>
                  @if (selectedView !== 'stages') {
                    <div class="workspace-control-row">
                      <label class="workspace-search"><span class="icon" aria-hidden="true"><i data-lucide="search"></i></span><input type="search" [attr.aria-label]="'Search ' + selectedView" [placeholder]="workspaceSearchPlaceholder" /></label>
                      <div class="action-view-switch" role="tablist" aria-label="Actions view format"><button [class.active]="selectedView === 'board'" type="button" (click)="setView('board')"><span class="icon" aria-hidden="true"><i data-lucide="columns-3"></i></span> Board</button><button [class.active]="selectedView === 'calendar'" type="button" (click)="setView('calendar')"><span class="icon" aria-hidden="true"><i data-lucide="calendar-days"></i></span> Calendar</button><button [class.active]="selectedView === 'pm101'" type="button" (click)="setView('pm101')"><span class="icon" aria-hidden="true"><i data-lucide="book-open"></i></span> PM 101</button></div>
                    </div>
                  }
                  <div class="workspace-body">
                    <div class="board-view" [class.is-hidden]="selectedView !== 'board'" data-work-view="board" data-tour-target="action-board">
                      <div class="board-filter" aria-label="Action board filters"><span>Show</span><details class="work-filter-dropdown"><summary [attr.aria-label]="'Filter actions by ' + selectedBoardFilterOption.label"><span class="work-filter-selected-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(selectedBoardFilterOption.icon)"></i></span></span><span>{{ selectedBoardFilterOption.label }}</span><strong>{{ countForFilter(selectedBoardFilterOption) }}</strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></summary><div class="work-filter-menu" role="menu">@for (filter of boardFilters; track filter.id) { <button [class.active]="selectedBoardFilter === filter.id" type="button" role="menuitemradio" [attr.aria-checked]="selectedBoardFilter === filter.id" (click)="setBoardFilter(filter.id, $event)"><span class="work-filter-option-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(filter.icon)"></i></span></span><span>{{ filter.label }}</span><strong>{{ countForFilter(filter) }}</strong></button> }</div></details></div>
                      <div class="kanban-board">@for (column of visibleBoardColumns; track column.column) { <section class="kanban-column {{ column.tone }}"><header><div><span class="board-column-icon {{ column.tone }}"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="boardColumnIcon(column.column)"></i></span></span><h3>{{ column.column }}</h3></div><strong>{{ column.items.length }}</strong></header><div class="task-stack">@for (item of column.items; track item.title) { <article class="task-card {{ taskCardClass(item.type) }}" [attr.data-card-kind]="filterKind(item.type)"><div class="task-top"><span>{{ item.type }}</span></div><h3>{{ item.title }}</h3><p>{{ item.project }}</p><div class="task-bottom"><span class="avatar-sm">{{ item.owner }}</span><small>{{ item.meta }}</small><button class="task-action" type="button" (click)="handleTaskAction(item)"><span>{{ item.cta }}</span><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></button></div></article> } @empty { <div class="empty-column">No {{ selectedBoardFilterOption.label.toLowerCase() }} in this lane.</div> }</div></section> }</div>
                    </div>
                    <div class="calendar-view" [class.is-hidden]="selectedView !== 'calendar'" data-work-view="calendar">
                      <div class="calendar-command-row"><div class="calendar-month-picker" aria-label="Calendar month navigation"><button class="calendar-nav-button" type="button" (click)="shiftMonth(-1)" aria-label="Previous month"><span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span></button><div class="calendar-month-copy"><strong>{{ calendarMonthLabel }}</strong><span>{{ visibleMonthItems.length }} item{{ visibleMonthItems.length === 1 ? '' : 's' }} this month</span></div><button class="calendar-nav-button" type="button" (click)="shiftMonth(1)" aria-label="Next month"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></button></div><div class="board-filter calendar-filter-bar" aria-label="Quick work filter"><span>Show</span><details class="work-filter-dropdown"><summary [attr.aria-label]="'Filter work by ' + selectedBoardFilterOption.label"><span class="work-filter-selected-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(selectedBoardFilterOption.icon)"></i></span></span><span>{{ selectedBoardFilterOption.label }}</span><strong>{{ countCalendarFilter(selectedBoardFilterOption) }}</strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></summary><div class="work-filter-menu" role="menu">@for (filter of boardFilters; track filter.id) { <button [class.active]="selectedBoardFilter === filter.id" type="button" role="menuitemradio" [attr.aria-checked]="selectedBoardFilter === filter.id" (click)="setBoardFilter(filter.id, $event)"><span class="work-filter-option-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(filter.icon)"></i></span></span><span>{{ filter.label }}</span><strong>{{ countCalendarFilter(filter) }}</strong></button> }</div></details></div></div>
                      <div class="timeline-calendar"><div class="weekdays"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div class="calendar-grid">@for (cell of calendarCells; track cell.key) { <div class="calendar-cell" [class.muted]="!cell.current" [class.today]="cell.today"><span>{{ cell.day }}</span>@for (item of cell.items; track item.label + item.project) { <button class="calendar-event {{ item.tone }}" type="button"><span class="calendar-event-dot"></span><span class="calendar-event-title">{{ item.label }}</span></button> }</div> }</div></div>
                    </div>
                    <div class="pm101-view" [class.is-hidden]="selectedView !== 'pm101'" data-work-view="pm101"><div class="pm101-flow" aria-label="PM 101 project delivery flow"><ol class="pm101-step-list">@for (step of pm101Steps; track step.title; let index = $index) { <li class="pm101-step"><article class="pm101-card"><span class="pm101-card-icon"><img class="pm101-card-icon-asset" [src]="step.iconAsset" alt="" /></span><strong>{{ step.title }}</strong><p>{{ step.body }}</p><span [class]="'pm101-decor pm101-decor-' + step.decor" aria-hidden="true">@for (asset of step.decorAssets; track asset; let assetIndex = $index) { <img class="pm101-decor-asset pm101-decor-asset-{{ assetIndex + 1 }}" [src]="asset" alt="" /> }</span><span class="pm101-step-number" aria-hidden="true">{{ index + 1 }}</span></article></li> }</ol></div></div>
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
              <div class="right-column" [class.portfolio-frontdoor]="isAllProjects" [class.project-frontdoor]="!isAllProjects">
                @if (isAllProjects) { <section class="top-deck" aria-label="PM front door actions" data-tour-target="frontdoor-actions"><button class="action-card workspace-command" type="button" (click)="navigate('workspaces')"><span class="action-icon"><img src="./assets/workspace-card-box.svg" alt="" aria-hidden="true" /></span><span class="action-copy"><strong>Workspaces</strong><small>Open project rooms</small></span><span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span></button><button class="action-card learning-command" type="button" (click)="setView('pm101')"><span class="action-icon"><img src="./assets/workspace-card-notebook.svg" alt="" aria-hidden="true" /></span><span class="action-copy"><strong>Learning Hub</strong><small>Guides and playbooks</small></span><span class="action-arrow"><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span></span></button></section> }
                <section class="side-card report-widget" [class.portfolio-report-widget]="isAllProjects" data-tour-target="right-report-widget"><div class="report-widget-head"><div><h2>{{ isAllProjects ? 'Reporting trends' : 'Project report trend' }}</h2><small>Last 3 PSR statuses</small></div></div><div class="report-trend-list">@for (report of visibleReportRows; track report.project) { <article class="report-trend-row {{ reportFrontdoorTone(report) }}"><div class="report-trend-row-head"><strong>{{ report.project }}</strong><span class="report-health-chip {{ reportFrontdoorTone(report) }}">{{ reportDueToneLabel(reportFrontdoorTone(report)) }}</span></div><div class="report-trend" style="--report-trend-count:3" aria-label="Status report trend">@for (point of report.trend; track point.label) { <span class="report-trend-point {{ reportStatusTone(point.status) }}"><span class="report-status-icon {{ reportStatusTone(point.status) }}" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="reportStatusIcon(point.status)"></i></span></span><small>{{ point.label }}</small></span> }</div><div class="report-trend-row-foot"><span class="report-row-due"><span class="icon" aria-hidden="true"><i data-lucide="history"></i></span><span>{{ reportDueText(report) }}</span></span><button class="report-row-create" type="button" (click)="openReport(report.project)"><span class="icon" aria-hidden="true"><i data-lucide="file-text"></i></span><span>Create</span></button></div></article> }</div></section>
                @if (!isAllProjects) { <ng-container [ngTemplateOutlet]="quickLinksPanel"></ng-container> }
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
            <div class="report-drawer-top">
              <div class="report-common-row">
                <button class="drawer-close" type="button" (click)="closeReport()" aria-label="Close drawer"><span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span></button>
                <div class="report-drawer-title"><h2>{{ activeReport.project }}</h2><p>Project Report</p></div>
                <div class="report-common-meta"><span>Stage: <strong>{{ activeReportDetails.stage }}</strong></span><span>State: <strong>{{ activeReportDetails.state }}</strong></span></div>
                <span class="report-due-pill {{ activeReport.dueTone }}">{{ activeReport.dueLabel }}</span>
                <div class="report-top-actions"><button class="report-top-cancel" type="button" (click)="closeReport()">Cancel</button><button class="report-top-save" type="submit">Save</button></div>
              </div>

              <div class="report-interval-row">
                <span>Interval start date: <strong>{{ activeReportDetails.intervalStart }}</strong></span>
                <span>Interval end date: <strong>{{ activeReportDetails.intervalEnd }}</strong></span>
                <span>Interval Status: <strong>{{ activeReportDetails.intervalStatus.toUpperCase() }}</strong></span>
              </div>
            </div>

            <div class="report-drawer-body">
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
                  <section class="report-form-section report-overview-section">
                    <div class="report-overview-top">
                      <div class="report-overview-status">
                        <span class="report-overview-label">Overall Status</span>
                        <div class="report-inline-status" role="radiogroup" aria-label="Overall status">
                          @for (option of reportStatusOptions; track option.label) {
                            <label class="{{ option.tone }}"><input type="radio" name="overall-status" [checked]="option.value === activeReportStatus" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.label }}</span></label>
                          }
                        </div>
                      </div>
                      <div class="report-overview-trend"><span class="report-overview-label">Overall Status Trend</span><strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span> {{ activeReportDetails.overallTrend }}</strong></div>
                      <div class="report-overview-past"><span class="report-overview-label">Past Overview Trend</span><div class="report-past-trend">@for (date of pastOverviewTrend; track date) { <span><span class="icon" aria-hidden="true"><i data-lucide="circle-check"></i></span><small>{{ date }}</small></span> }</div></div>
                    </div>

                    <div class="report-narrative-grid">
                      @for (field of reportNarrativeFields; track field.label) {
                        <label class="report-editor-field"><span class="report-editor-label">{{ field.label }} @if (field.hint) { <small>{{ field.hint }}</small> }</span><textarea class="report-description-input" [rows]="field.rows" maxlength="3000"></textarea></label>
                      }
                    </div>
                  </section>
                </div>

                @for (area of reportReviewAreas; track area.label) {
                  @if (area.label === 'Scope') {
                    <section class="report-form-section report-area-section report-scope-section" [hidden]="activeReportSection !== area.label" role="tabpanel">
                      <div class="report-overview-top scope-overview-top">
                        <div class="report-overview-status">
                          <span class="report-overview-label">Overall Status</span>
                          <div class="report-inline-status" role="radiogroup" aria-label="Scope overall status">
                            @for (option of reportStatusOptions; track option.label) {
                              <label class="{{ option.tone }}"><input type="radio" name="scope-overall-status" [checked]="option.value === activeReportStatus" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.label }}</span></label>
                            }
                          </div>
                        </div>
                        <div class="report-overview-trend"><span class="report-overview-label">Overall Status Trend</span><strong><span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span> {{ activeReportDetails.overallTrend }}</strong></div>
                        <div class="report-overview-past"><span class="report-overview-label">Past Overview Trend</span><div class="report-past-trend">@for (date of pastOverviewTrend; track date) { <span><span class="icon" aria-hidden="true"><i data-lucide="circle-check"></i></span><small>{{ date }}</small></span> }</div></div>
                      </div>

                      <label class="report-editor-field scope-comments-field">
                        <span class="report-editor-label">Comments</span>
                        <textarea class="report-description-input" rows="4" maxlength="3000"></textarea>
                      </label>

                      <div class="scope-panel scope-past-panel">
                        <span class="scope-panel-label">Past reported statuses</span>
                        <div class="scope-status-timeline">@for (past of scopePastStatuses; track past.date) { <span class="{{ past.tone }}" [title]="past.label"><i><span class="icon" aria-hidden="true"><i [attr.data-lucide]="past.tone === 'amber' ? 'bell' : 'x'"></i></span></i><small>{{ past.date }}</small></span> }</div>
                      </div>

                      <div class="scope-group-card">
                        <div class="scope-group-head">
                          <div><strong>End Product</strong><span>{{ scopeProducts.length }} items</span></div>
                          <label class="report-include-toggle"><input type="checkbox" /><span>Add to report</span></label>
                        </div>
                        <div class="scope-product-list">
                          @for (product of scopeProducts; track product.title) {
                            <article class="scope-product-card">
                              <div class="scope-product-title">
                                @if (product.icon) {
                                  <span class="scope-product-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(product.icon)"></i></span></span>
                                } @else {
                                  <input type="checkbox" [attr.aria-label]="'Add ' + product.title + ' to report'" />
                                }
                                <strong>{{ product.title }}</strong>
                              </div>
                              <div class="scope-product-grid">
                                <span><small>Type</small><strong>{{ product.type }}</strong></span>
                                <span><small>Product owner</small><strong>{{ product.owner }}</strong></span>
                                <span><small>Capability</small><strong>{{ product.capability }}</strong></span>
                                <span><small>Start - end date</small><strong>{{ product.dates }}</strong></span>
                                <span><small>Budget</small><strong>{{ product.budget }}</strong></span>
                              </div>
                              <div class="scope-product-controls">
                                <label><span>Report status</span><select [attr.aria-label]="'Report status for ' + product.title"><option>{{ product.status }}</option><option>On track</option><option>Alert/Discuss</option><option>Off track</option></select></label>
                                <label><span>Actual start</span><input type="text" [value]="product.actualStart" /></label>
                                <label><span>Actual end</span><input type="text" [value]="product.actualEnd" /></label>
                                <label><span>Completed</span><span class="scope-percent-input"><input type="text" [value]="product.completed" /><span>%</span></span></label>
                              </div>
                            </article>
                          }
                        </div>
                      </div>

                      <div class="scope-group-card compact">
                        <div class="scope-group-head">
                          <div><strong>Management Product</strong><span>0 items</span></div>
                          <label class="report-include-toggle"><input type="checkbox" /><span>Add to report</span></label>
                        </div>
                        <p class="scope-empty-note">No management products are linked to this reporting interval.</p>
                      </div>
                    </section>
                    } @else {
                      <section class="report-form-section report-area-section" [hidden]="activeReportSection !== area.label" role="tabpanel">
                        <div class="report-section-head"><div><h3>{{ area.label }}</h3></div><span class="report-area-pill {{ area.tone }}">{{ area.status }}</span></div>
                        <label class="report-form-field"><span>Update</span><textarea rows="2">{{ area.note }}</textarea></label>
                      </section>
                    }
                }
              </div>
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
      <div class="guided-tour-overlay" data-tour-overlay data-tour-target-name="frontdoor-actions" role="dialog" aria-modal="true" aria-label="Guided tour">
        <span class="guided-tour-spotlight" data-tour-spotlight></span>
        <article class="guided-tour-card" data-tour-card>
          <span class="guided-tour-kicker">Guided tour · 1 of 7</span>
          <h2>Your PM front door</h2>
          <p>Use Workspaces for project rooms and Learning Hub for playbooks, templates, and governance guidance.</p>
          <div class="guided-tour-actions"><button class="guided-tour-secondary" type="button" (click)="guidedTourActive = false">Skip</button><button class="guided-tour-primary" type="button" (click)="guidedTourActive = false">Next</button></div>
        </article>
      </div>
    }
  `,
})
export class PmConsoleContentComponent implements AfterViewChecked {
  @Input() selectedProject = 'all';
  @Input() selectedPage: ConsolePage = 'workspace';
  @Input() selectedView: WorkspaceView = 'calendar';
  @Input() frontDoorMode = 'assigned';
  @Input() pmoAssignmentReady = false;
  @Input() guidedTourActive = false;
  @Output() readonly consoleStateChange = new EventEmitter<Partial<PmConsoleMountOptions>>();

  readonly workspaceTableProjects = workspaceTableProjects;
  readonly workspaceProjectCards = workspaceProjectCards;
  readonly projectQuickActions = projectQuickActions;
  readonly boardFilters = boardFilters;
  readonly pm101Steps = pm101Steps;
  readonly stageDefinitions = stageDefinitions;
  readonly quickLinkPinLimit = QUICK_LINK_PIN_LIMIT;
  readonly primaryProjectPlanSections = ['Project Setup', 'Overview', 'Schedule & Scope', 'Budget', 'Benefits', 'Risk', 'Resource'];
  readonly additionalProjectPlanSections = ['Issues', 'Change Impact', 'Related Links', 'Dependency', 'Miscellaneous'];
  readonly projectReportMetrics = ['Total Reports', 'Reports Overview', 'Reporting Compliance'];
  readonly projectReportsRows = projectReportsRows;
  readonly projectReportTrendPoints = projectReportTrendPoints;
  readonly reportSections = ['Overview', 'Scope', 'Schedule', 'Budget', 'Benefits', 'Risks', 'Issues', 'Resource', 'Dependency'];
  readonly reportStatusOptions = [
    { label: 'On track', value: 'On track', tone: 'green', icon: 'checkMark' },
    { label: 'Alert/Discuss', value: 'Alert', tone: 'amber', icon: 'bell' },
    { label: 'Off track', value: 'Off Track', tone: 'red', icon: 'close' },
  ];
  readonly pastOverviewTrend = ['31/3/2026', '31/12/2025', '30/9/2025', '30/06/2025', '31/12/2024'];
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
      title: 'First watch item',
      body: 'Log the first risk PMO should see before endorsement.',
      icon: 'risks',
      fields: [
        { label: 'Risks Register', value: 'Stakeholder data quality', kind: 'table', wide: true },
      ],
    },
  ];
  readonly wbsItems = [
    { title: 'Baselined Project Plan', owner: 'Sophia Brown', progress: '0%', level: 0, tone: 'late', left: '4%', width: '18%' },
    { title: 'Benefits baseline evidence', owner: 'Muna Hassan', progress: '45%', level: 1, tone: 'active', left: '10%', width: '20%' },
    { title: 'Citizen Service Portal', owner: 'Muna Hassan', progress: '38%', level: 0, tone: 'active', left: '22%', width: '32%' },
    { title: 'Execution stage gate', owner: 'Muna Hassan', progress: 'Planned', level: 0, tone: 'planned', left: '47%', width: '12%' },
  ];
  readonly months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  workspaceDisplay: WorkspaceDisplay = 'table';
  calendarMonth = new Date(2026, 4, 1);
  pinnedIds = this.loadPinnedQuickLinks();
  quickLinksPage = 0;
  quickLinksToast: string | null = null;
  selectedBoardFilter = 'all';
  activeReportProject: string | null = null;
  selectedStageGateKey: string | null = null;
  activeReportSection = 'Overview';
  projectPlanEntry: ProjectPlanEntry = 'quick';
  projectPlanDetailMode: ProjectPlanDetailMode = 'simple';
  projectPlanActiveSection = 'Overview';
  projectPlanSectionsExpanded = false;

  private iconsHydrated = false;
  private quickLinksToastTimer: number | null = null;

  constructor(
    private readonly iconsService: PmConsoleIconService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get isAllProjects(): boolean {
    return this.selectedProject === 'all';
  }

  get scopedProjectName(): string {
    return this.isAllProjects ? 'All projects' : this.selectedProject;
  }

  get projectPlanStage(): string {
    const profile = stageProfiles.find((item) => item.project === this.selectedProject);
    return profile ? stageDefinitions[profile.currentStage]?.label || 'Execution' : 'Execution';
  }

  get visibleProjectPlanSections(): string[] {
    return this.projectPlanSectionsExpanded ? [...this.primaryProjectPlanSections, ...this.additionalProjectPlanSections] : this.primaryProjectPlanSections;
  }

  get activeProjectPlanGroup(): SimplePlanSection {
    return this.projectPlanGroupForSection(this.projectPlanActiveSection);
  }

  get projectPlanEntryLabel(): string {
    if (this.projectPlanEntry === 'change-request') return 'Change Request';
    if (this.projectPlanEntry === 'closure') return 'Closure';
    if (this.projectPlanEntry === 'reports') return 'Reports';
    return 'Project Plan';
  }

  get workspaceTitle(): string {
    return this.isAllProjects ? 'Operational Workspace' : `${this.scopedProjectName} | Operational Workspace`;
  }

  get workspaceSearchPlaceholder(): string {
    return this.selectedView === 'pm101' ? 'Search PM 101' : this.selectedView === 'board' ? 'Search actions' : 'Search calendar';
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
    if (tone === 'off-track') return 'Off Track';
    if (tone === 'alert') return 'Alert';
    return 'On track';
  }

  get reportNarrativeFields(): Array<{ label: string; hint: string; value: string; rows: number }> {
    const details = this.activeReportDetails;
    return [
      { label: 'Comments', hint: '', value: details.comments, rows: 4 },
      { label: 'Key Achievements and Notable Events', hint: 'Achievements / delays / challenges / risk', value: details.achievements, rows: 4 },
      { label: 'Planned Activities for the next reporting period', hint: '', value: details.planned, rows: 4 },
    ];
  }

  get quickLinksOrderedActions(): QuickAction[] {
    const pinned = this.actionsFromIds(this.pinnedIds);
    const pinnedSet = new Set(this.pinnedIds);
    return [...pinned, ...projectQuickActions.filter((action) => !pinnedSet.has(action.id))];
  }

  get quickLinksTotalPages(): number {
    return Math.max(1, Math.ceil(this.quickLinksOrderedActions.length / QUICK_LINK_PAGE_SIZE));
  }

  get quickLinksPageIndex(): number {
    return Math.min(this.quickLinksPage, this.quickLinksTotalPages - 1);
  }

  get quickLinksPageActions(): QuickAction[] {
    const start = this.quickLinksPageIndex * QUICK_LINK_PAGE_SIZE;
    return this.quickLinksOrderedActions.slice(start, start + QUICK_LINK_PAGE_SIZE);
  }

  get quickLinksPageDots(): number[] {
    return Array.from({ length: this.quickLinksTotalPages }, (_, index) => index);
  }

  get stageProfilesForSelection(): typeof stageProfiles {
    return stageProfiles.filter((profile) => this.isAllProjects || profile.project === this.selectedProject);
  }

  get selectedStageGateContext(): StageGateContext | null {
    return this.stageGateContext(this.selectedStageGateKey);
  }

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.refreshIcons();
  }

  refreshIcons(): void {
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  iconName(name: string): string {
    return iconMap[name] || iconMap['grid'];
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

  setProjectPlanEntry(entry: ProjectPlanEntry): void {
    this.projectPlanEntry = entry;
    this.projectPlanActiveSection = 'Overview';
    this.iconsHydrated = false;
  }

  setProjectPlanDetailMode(mode: ProjectPlanDetailMode): void {
    this.projectPlanDetailMode = mode;
    this.iconsHydrated = false;
  }

  setProjectPlanSection(section: string): void {
    this.projectPlanActiveSection = section;
    this.iconsHydrated = false;
  }

  toggleProjectPlanSections(): void {
    this.projectPlanSectionsExpanded = !this.projectPlanSectionsExpanded;
    this.iconsHydrated = false;
  }

  setView(view: WorkspaceView): void {
    this.closeReport();
    this.closeStageGate();
    this.selectedView = view;
    this.selectedPage = 'workspace';
    this.emitState();
  }

  navigate(page: ConsolePage, projectPlanEntry: ProjectPlanEntry = 'quick'): void {
    this.closeReport();
    this.closeStageGate();
    this.selectedPage = page;
    if (page === 'project-plan') {
      this.projectPlanEntry = projectPlanEntry;
      this.projectPlanActiveSection = 'Overview';
    }
    if ((page === 'project-plan' || page === 'wbs' || page === 'playground') && this.isAllProjects) {
      this.selectedProject = 'Vision 2030';
    }
    this.emitState();
  }

  openProject(projectId: string): void {
    this.closeReport();
    this.closeStageGate();
    this.selectedProject = projectId;
    this.selectedPage = 'project-plan';
    this.projectPlanEntry = 'quick';
    this.projectPlanActiveSection = 'Overview';
    this.emitState();
  }

  openQuickAction(action: QuickAction): void {
    this.closeReport();
    this.closeStageGate();
    if (action.view) this.selectedView = action.view;
    if (action.page) this.navigate(action.page, this.projectPlanEntryFromAction(action.entry));
    this.emitState();
  }

  openReport(project: string): void {
    this.closeStageGate();
    this.activeReportProject = project;
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
    this.activeReportSection = 'Overview';
    this.iconsHydrated = false;
  }

  openStageGate(profile: StageProfile): void {
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
    this.frontDoorMode = 'assigned';
    this.pmoAssignmentReady = true;
    this.selectedProject = 'UAE Research Map';
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

  simplePlanTableConfig(field: SimplePlanField): SimplePlanTableConfig {
    const configs: Record<string, SimplePlanTableConfig> = {
      Outcome: {
        action: 'Add outcome',
        description: 'Measurable outcomes expected from the project.',
        columns: ['Outcome', 'Measure', 'Status'],
        rows: [[field.value || 'Reduce fragmentation in research efforts', 'Discovery coverage', 'Draft']],
      },
      'Risks Register': {
        action: 'Add risk',
        description: 'Risk, owner, and current exposure.',
        columns: ['Risk', 'Owner', 'Rating'],
        rows: [[field.value || 'Stakeholder data quality', 'PMO', 'High']],
      },
    };

    return configs[field.label] || {
      action: 'Add item',
      description: 'Register item, owner, and current status.',
      columns: ['Name', 'Owner', 'Status'],
      rows: [[field.value || field.label, 'Project Manager', 'Draft']],
    };
  }

  private stageGateContext(key: string | null): StageGateContext | null {
    if (!key) return null;
    const [project, stageId] = key.split('|');
    const profile = stageProfiles.find((item) => item.project === project);
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

  private projectPlanEntryFromAction(entry: string | undefined): ProjectPlanEntry {
    return entry === 'reports' || entry === 'change-request' || entry === 'closure' ? entry : 'quick';
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
    this.iconsHydrated = false;
    this.consoleStateChange.emit({
      projectId: this.selectedProject,
      selectedPage: this.selectedPage,
      selectedView: this.selectedView,
      frontDoorMode: this.frontDoorMode,
      pmoAssignmentReady: this.pmoAssignmentReady,
      guidedTourActive: this.guidedTourActive,
    });
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
