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
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsolePlanEmptyStateComponent } from './pm-console-plan-empty-state.component';
import { PmConsolePlanTableComponent } from './pm-console-plan-table.component';
import { PmConsoleReportDrawerComponent } from './pm-console-report-drawer.component';
import { PmConsoleMountOptions } from './pm-console.types';
import { PmConsoleFieldComponent } from './shared/pm-console-field.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from './shared/pm-console-row-action-menu.component';
import { PmConsoleRiskMatrixComponent, PmConsoleRiskMatrixSelection } from './shared/pm-console-risk-matrix.component';
import { PmConsoleStatusPillComponent } from './shared/pm-console-status-pill.component';
import { PmConsoleTableActionComponent } from './shared/pm-console-table-action.component';
import { PmConsoleToolbarComponent } from './shared/pm-console-toolbar.component';

type ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground';
type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages';
type ActionWorkspaceView = 'board' | 'calendar';
type WorkspaceDisplay = 'table' | 'cards';
type WorkspaceRegister = 'projects' | 'benefits' | 'risks';
type ProjectPlanEntry = 'quick' | 'reports' | 'stages' | 'change-request' | 'closure';
type ProjectPlanDetailMode = 'simple' | 'detailed';
type ReportDetailMode = 'simple' | 'detailed';
type RiskProfileTab = 'identification' | 'analysis' | 'treatment';
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
  icon: string;
  status: string;
  tone: string;
  trend: string;
  comments: string;
  timeline: ReportTimelinePoint[];
}

interface ReportDetailItem {
  title: string;
  body: string;
  icon: string;
  status: string;
  tone: string;
  meta: string;
  owner: string;
  progressLabel: string;
  progressValue: string;
  comment: string;
}

interface ReportDetailMetric {
  label: string;
  value: string;
}

interface ReportNotice {
  text: string;
  tone: string;
  icon?: string;
}

interface ReportSummaryRow {
  label: string;
  value?: string;
  tone?: string;
  chip?: boolean;
  dividerBefore?: boolean;
}

interface ReportSummaryCard {
  title: string;
  rows: ReportSummaryRow[];
  wide?: boolean;
  notice?: ReportNotice;
}

interface ReportSummaryGroup {
  title: string;
  cards: ReportSummaryCard[];
}

interface ReportSectionAction {
  label: string;
  icon?: string;
}

interface ReportTableColumn {
  key: string;
  label: string;
  width: number;
  align?: 'left' | 'center';
}

interface ReportTableCell {
  type: 'checkbox' | 'text' | 'person' | 'chip' | 'dateInput' | 'select' | 'iconBadge';
  value?: string;
  checked?: boolean;
  initials?: string;
  tone?: string;
  icon?: string;
  clampLines?: number;
  options?: string[];
}

interface ReportTableRow {
  id: string;
  cells: Record<string, ReportTableCell>;
}

interface ReportTableSelectFilter {
  label: string;
  value: string;
  options?: string[];
}

interface ReportTableRadioOption {
  label: string;
  value: string;
  checked?: boolean;
}

interface ReportTableRadioFilter {
  label: string;
  options: ReportTableRadioOption[];
}

interface ReportTableBlock {
  id: string;
  title: string;
  minWidth: number;
  selectorLabel?: string;
  hideHeader?: boolean;
  selectFilters?: ReportTableSelectFilter[];
  radioFilter?: ReportTableRadioFilter;
  columns: ReportTableColumn[];
  rows: ReportTableRow[];
  actions?: ReportSectionAction[];
}

interface ReportRecordField {
  label: string;
  value?: string;
  type?: 'text' | 'person';
  initials?: string;
  wide?: boolean;
}

interface ReportRecordItem {
  id: string;
  selected?: boolean;
  idLabel: string;
  idValue: string;
  status?: string;
  statusTone?: string;
  priorityLabel?: string;
  priorityTone?: string;
  fields: ReportRecordField[];
}

interface ReportRecordBlock {
  id: string;
  addLabel?: string;
  filters?: ReportTableSelectFilter[];
  items: ReportRecordItem[];
}

interface ReportSectionDetail {
  icon?: string;
  metrics?: ReportDetailMetric[];
  summaryGroups?: ReportSummaryGroup[];
  recordBlocks?: ReportRecordBlock[];
  tables?: ReportTableBlock[];
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

interface OverviewState {
  opportunityStatement: string;
  driverAnalysis: string;
  aiComponent: string;
}

interface OverviewBusinessDriverOption {
  driver: string;
  source: string;
  priority: string;
  note: string;
}

interface OverviewBusinessDriverRow {
  id: string;
  driver: string;
  source: string;
  priority: string;
  note: string;
}

interface OverviewBusinessDriverDraft {
  driver: string;
  source: string;
  priority: string;
  note: string;
}

interface OverviewOutcomeRow {
  id: string;
  outcome: string;
  measure: string;
  owner: string;
  status: string;
}

interface OverviewOutcomeDraft {
  outcome: string;
  measure: string;
  owner: string;
  status: string;
}

interface OverviewObjectiveRow {
  id: string;
  objective: string;
  linkedObjective: string;
  status: string;
}

interface OverviewObjectiveDraft {
  objective: string;
  linkedObjective: string;
  status: string;
}

interface OverviewCapabilityOption {
  capability: string;
  domain: string;
  owner: string;
}

interface OverviewCapabilityRow {
  id: string;
  capability: string;
  domain: string;
  owner: string;
}

interface OverviewCapabilityDraft {
  selectedCapabilities: string[];
}

interface OverviewServiceOption {
  serviceGroup: string;
  valueStream: string;
  phase: string;
  service: string;
}

interface OverviewServiceRow {
  id: string;
  serviceGroup: string;
  valueStream: string;
  phase: string;
  service: string;
}

interface OverviewServiceDraft {
  serviceGroup: string;
  valueStream: string;
  phase: string;
  service: string;
}

type ScheduleScopeDrawerMode = 'create' | 'edit';
type ScheduleScopeProductSource = 'new' | 'existing';

interface ScheduleScopeState {
  baselineStart: string;
  baselineEnd: string;
  forecastStart: string;
  forecastEnd: string;
  inScope: string;
  outOfScope: string;
}

interface ScheduleMilestoneRow {
  id: string;
  milestone: string;
  dueDate: string;
  owner: string;
  priority: string;
  note: string;
}

interface ScheduleMilestoneDraft {
  milestone: string;
  dueDate: string;
  owner: string;
  priority: string;
  note: string;
}

interface ScheduleScopeProductRow {
  id: string;
  product: string;
  description: string;
  owner: string;
  category: string;
  capability: string;
  startDate: string;
  endDate: string;
  capex: string;
  opex: string;
  predecessors: string[];
  successors: string[];
}

interface ScheduleScopeProductDraft {
  sourceType: ScheduleScopeProductSource;
  product: string;
  description: string;
  owner: string;
  category: string;
  capability: string;
  startDate: string;
  endDate: string;
  capex: string;
  opex: string;
  predecessors: string;
  successors: string;
}

interface ScheduleManagementProductRow {
  id: string;
  product: string;
  description: string;
  owner: string;
  category: string;
  startDate: string;
  endDate: string;
  capex: string;
  opex: string;
}

interface ScheduleManagementProductDraft {
  product: string;
  description: string;
  owner: string;
  category: string;
  startDate: string;
  endDate: string;
  capex: string;
  opex: string;
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

type ChangeRequestStatusFilter = 'active' | 'overdue' | 'closed';
type ChangeRequestDrawerTab = 'overview' | 'impact' | 'links';
type ChangeRequestImpactTab = 'benefits' | 'capabilities' | 'projects';
type ChangeRequestType = 'Budget' | 'Schedule' | 'Scope';

interface ChangeRequestRow {
  id: string;
  pcrNumber: string;
  project: string;
  pmo: string;
  types: ChangeRequestType[];
  createdDate: string;
  dueDate: string;
  priority: string;
  status: string;
  trigger: string;
  changeDetails: string;
  businessJustification: string;
  riskImpact: string;
  releasesImpacted: string;
  impactToResource: string;
  impactToQuality: string;
  relatedLinks: RelatedLinkRow[];
}

interface ChangeRequestDraft {
  project: string;
  pmo: string;
  dueDate: string;
  trigger: string;
  priority: string;
  types: ChangeRequestType[];
  changeDetails: string;
  businessJustification: string;
  riskImpact: string;
  releasesImpacted: string;
  impactToResource: string;
  impactToQuality: string;
  relatedLinks: RelatedLinkRow[];
  relatedLinkName: string;
  relatedLinkDescription: string;
  relatedLinkUrl: string;
}

type ChangeRequestDraftField =
  | 'project'
  | 'pmo'
  | 'dueDate'
  | 'trigger'
  | 'priority'
  | 'changeDetails'
  | 'businessJustification'
  | 'riskImpact'
  | 'releasesImpacted'
  | 'impactToResource'
  | 'impactToQuality';

type ChangeRequestRelatedLinkDraftField = 'relatedLinkName' | 'relatedLinkDescription' | 'relatedLinkUrl';

interface ChangeRequestMetric {
  label: string;
  value: number;
  icon: string;
  tone: string;
}

interface ChangeRequestTab {
  id: ChangeRequestStatusFilter;
  label: string;
  count: number;
}

interface ChangeRequestImpactBenefitRow {
  benefit: string;
  profile: string;
  owner: string;
  product: string;
}

interface ChangeRequestImpactCapabilityRow {
  group: string;
  capability: string;
  manager: string;
  products: string;
}

interface ChangeRequestImpactProjectRow {
  project: string;
  manager: string;
  products: string[];
}

type ClosureSectionId = 'overview' | 'budget' | 'benefits' | 'risk' | 'issues' | 'lessons';

interface ClosureNavItem {
  id: ClosureSectionId;
  label: string;
  icon: string;
  count?: number;
}

interface ClosureMetric {
  label: string;
  value: string;
  helper: string;
  icon: string;
  tone: string;
}

interface ClosureTextBlock {
  id: string;
  title: string;
  description: string;
  value: string;
  maxLength: number;
  icon: string;
}

interface ClosureChecklistItem {
  label: string;
  state: string;
  tone: string;
}

interface ClosureFollowUpAction {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  status: string;
  tone: string;
}

interface ClosureRecommendation {
  id: string;
  recommendation: string;
  owner: string;
  category: string;
  status: string;
  tone: string;
}

interface ClosureBenefitRow {
  category: string;
  benefit: string;
  owner: string;
  realizationDate: string;
  measures: number;
  status: string;
  tone: string;
}

interface ClosureRiskRow {
  id: string;
  risk: string;
  actualRating: string;
  treatments: number;
  residualRating: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ClosureIssueRow {
  id: string;
  issue: string;
  type: string;
  resolution: string;
  criticality: string;
  status: string;
  owner: string;
  dueDate: string;
}

interface ClosureLessonRow {
  title: string;
  category: string;
  issue: string;
  recommendation: string;
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

interface RiskTreatmentRow {
  id: string;
  treatment: string;
  type: string;
  category: string;
  owner: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface RiskTreatmentDraft {
  treatment: string;
  type: string;
  category: string;
  owner: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface RiskPlanRow {
  id: string;
  riskCategory: string;
  riskName: string;
  description: string;
  owner: string;
  manager: string;
  lead: string;
  startDate: string;
  endDate: string;
  reviewDueDate: string;
  status: string;
  strategicRisk: string;
  enterpriseImpact: boolean;
  actualLikelihood: string;
  actualConsequence: string;
  actualRating: string;
  residualLikelihood: string;
  residualConsequence: string;
  residualRating: string;
  impactedObjective: string;
  sharedRisk: boolean;
  source: string;
  consequence: string;
  controlSummary: string;
  overallControlEffectiveness: string;
  analysisComment: string;
  treatmentApproach: string;
  treatmentType: string;
  treatmentComment: string;
  treatments: RiskTreatmentRow[];
  createdOn: string;
}

interface RiskPlanDraft {
  riskCategory: string;
  riskName: string;
  description: string;
  owner: string;
  manager: string;
  lead: string;
  startDate: string;
  endDate: string;
  reviewDueDate: string;
  status: string;
  strategicRisk: string;
  enterpriseImpact: boolean;
  actualLikelihood: string;
  actualConsequence: string;
  actualRating: string;
  residualLikelihood: string;
  residualConsequence: string;
  residualRating: string;
  impactedObjective: string;
  sharedRisk: boolean;
  source: string;
  consequence: string;
  controlSummary: string;
  overallControlEffectiveness: string;
  analysisComment: string;
  treatmentApproach: string;
  treatmentType: string;
  treatmentComment: string;
  treatments: RiskTreatmentRow[];
}

type RiskPlanDraftField = Exclude<keyof RiskPlanDraft, 'enterpriseImpact' | 'sharedRisk' | 'treatments'>;
type RiskPlanRowField = Exclude<keyof RiskPlanDraft, 'enterpriseImpact' | 'sharedRisk' | 'treatments'>;

interface RiskPlanConfig {
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  categoryPlaceholder: string;
  ownerPlaceholder: string;
  leadPlaceholder: string;
  statusPlaceholder: string;
  strategicRiskPlaceholder: string;
  categoryOptions: string[];
  ownerOptions: string[];
  statusOptions: string[];
  strategicRiskOptions: string[];
  likelihoodOptions: string[];
  consequenceOptions: string[];
  impactedObjectiveOptions: string[];
  controlEffectivenessOptions: string[];
  treatmentApproachOptions: string[];
  treatmentTypeOptions: string[];
  treatmentCategoryOptions: string[];
  rows: RiskPlanRow[];
  draft: RiskPlanDraft;
}

interface BudgetRuleItem {
  title: string;
  body: string;
}

interface BudgetFundingSourceRow {
  id: string;
  source: string;
  type: string;
  amount: number;
  status: string;
  notes: string;
}

interface BudgetFundingSourceDraft {
  source: string;
  type: string;
  amount: string;
  status: string;
  notes: string;
}

interface BudgetMonthlyRow {
  id: string;
  month: string;
  capexBudget: number;
  opexBudget: number;
  capexForecast: number;
  opexForecast: number;
  capexActual: number;
  opexActual: number;
  capexCommitted: number;
  opexCommitted: number;
}

type BudgetMonthlyField =
  | 'capexForecast'
  | 'opexForecast'
  | 'capexActual'
  | 'opexActual'
  | 'capexCommitted'
  | 'opexCommitted';

interface BudgetYearPlan {
  id: string;
  fy: string;
  baselineCapex: number;
  baselineOpex: number;
  forecastCapex: number;
  forecastOpex: number;
  fundingSources: BudgetFundingSourceRow[];
  monthlyRows: BudgetMonthlyRow[];
  approvedBudgetLabel?: string;
}

interface BudgetYearDraft {
  fy: string;
  baselineCapex: string;
  baselineOpex: string;
  forecastCapex: string;
  forecastOpex: string;
}

interface BudgetPlanState {
  selectedFy: string;
  years: BudgetYearPlan[];
  lastSavedLabel: string;
}

interface BudgetPlanMetric {
  label: string;
  value: string;
  helper: string;
  tone: 'neutral' | 'green' | 'amber' | 'red';
}

interface BudgetBreakdownRow {
  stream: string;
  baseline: number;
  forecast: number;
  actual: number;
  committed: number;
}

type BudgetBreakdownEditableField = 'baseline' | 'forecast' | 'committed' | 'actual';
type BudgetSubtab = 'project' | 'funding' | 'monthly';

interface BudgetPlanConfig {
  fieldName: string;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  drawerTitle: string;
  drawerBody: string;
  fundingTitle: string;
  fundingBody: string;
  fundingEmptyTitle: string;
  fundingEmptyBody: string;
  monthlyTitle: string;
  monthlyBody: string;
  monthlyEmptyTitle: string;
  monthlyEmptyBody: string;
  ruleButtonLabel: string;
  fyPlaceholder: string;
  amountPlaceholder: string;
  sourcePlaceholder: string;
  sourceTypePlaceholder: string;
  sourceStatusPlaceholder: string;
  fyOptions: string[];
  sourceTypeOptions: string[];
  sourceStatusOptions: string[];
  rules: BudgetRuleItem[];
  yearDraft: BudgetYearDraft;
  fundingDraft: BudgetFundingSourceDraft;
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
  arrowDown: 'arrow-down',
  arrowUp: 'arrow-up',
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
  driver: 'rocket',
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
  lock: 'lock',
  management: 'file-text',
  milestone: 'flag',
  moreVertical: 'ellipsis-vertical',
  minusCircle: 'circle-minus',
  outcomes: 'circle-check',
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
  target: 'target',
  telescope: 'telescope',
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
    { title: 'Dates', description: 'Baseline and forecast timing for the plan.', fields: ['Baseline Start date', 'Baseline End date', 'Forecast Start date', 'Forecast End date'] },
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

const overviewStateInitial: OverviewState = {
  opportunityStatement:
    'Develop an online platform that makes research capabilities, partnerships, and delivery opportunities easier to discover regardless of geography, function, or owning entity.',
  driverAnalysis:
    'Stakeholder mapping, portfolio reporting gaps, and inconsistent capability records show a need for one governed front door for research collaboration and delivery planning.',
  aiComponent: 'No',
};

const overviewBusinessDriverOptionSeeds: OverviewBusinessDriverOption[] = [
  {
    driver: 'Strategic research visibility',
    source: 'Strategy Office',
    priority: 'High',
    note: 'Supports one national view of capabilities, investment focus, and sponsor reporting.',
  },
  {
    driver: 'Accessible citizen and partner services',
    source: 'Transformation Office',
    priority: 'High',
    note: 'Improves discoverability and access across agencies, delivery teams, and external partners.',
  },
  {
    driver: 'Stronger governance for delivery planning',
    source: 'PMO',
    priority: 'Medium',
    note: 'Creates consistent intake, alignment, and assurance data before projects scale.',
  },
  {
    driver: 'Faster ecosystem collaboration',
    source: 'Research Office',
    priority: 'Medium',
    note: 'Reduces duplication and makes it easier to connect funders, researchers, and delivery owners.',
  },
];

const overviewStrategicObjectiveLinkSeeds = [
  'Accelerate innovation to bring healthy products to the market that suit all needs and tastes.',
  'Strengthen ecosystem collaboration across research, delivery, and partner teams.',
];

const overviewBusinessPlanSignalSeeds = [
  {
    label: 'Business plan objective',
    body: 'No business plan objective linked yet. Add one later if this project becomes part of a formal business-plan commitment.',
  },
  {
    label: 'Business plan output',
    body: 'No business plan output linked yet. Keep this blank until the project is connected to a tracked business-plan deliverable.',
  },
];

const overviewOutcomeStatusOptions = ['Draft', 'Defined', 'Committed'];

const overviewObjectiveStatusOptions = ['Draft', 'Linked', 'Approved'];

const overviewCapabilityOptionSeeds: OverviewCapabilityOption[] = [
  { capability: 'Monitoring & Surveillance', domain: 'Operations', owner: 'Technology Office' },
  { capability: 'IT Management', domain: 'Technology', owner: 'Technology Office' },
  { capability: 'Regulatory Assurance', domain: 'Governance', owner: 'PMO Desk' },
  { capability: 'Experience Design', domain: 'Customer', owner: 'Design Office' },
  { capability: 'Knowledge Management', domain: 'Information', owner: 'Research Office' },
];

const overviewServiceOptionSeeds: OverviewServiceOption[] = [
  {
    serviceGroup: 'Corporate Services',
    valueStream: 'Procure to Pay',
    phase: 'Execution',
    service: 'Material Master Maintenance',
  },
  {
    serviceGroup: 'Corporate Services',
    valueStream: 'Procure to Pay',
    phase: 'Planning',
    service: 'Supplier Enablement',
  },
  {
    serviceGroup: 'Digital Services',
    valueStream: 'Discover to Deliver',
    phase: 'Design',
    service: 'Knowledge Catalogue Support',
  },
  {
    serviceGroup: 'Digital Services',
    valueStream: 'Discover to Deliver',
    phase: 'Execution',
    service: 'Platform Release Management',
  },
  {
    serviceGroup: 'Technology Services',
    valueStream: 'Operate to Improve',
    phase: 'Execution',
    service: 'Service Monitoring',
  },
];

const overviewBusinessDriverDraftInitial: OverviewBusinessDriverDraft = {
  driver: '',
  source: '',
  priority: 'High',
  note: '',
};

const overviewOutcomeDraftInitial: OverviewOutcomeDraft = {
  outcome: '',
  measure: '',
  owner: '',
  status: 'Draft',
};

const overviewObjectiveDraftInitial: OverviewObjectiveDraft = {
  objective: '',
  linkedObjective: overviewStrategicObjectiveLinkSeeds[0] || '',
  status: 'Draft',
};

const overviewCapabilityDraftInitial: OverviewCapabilityDraft = {
  selectedCapabilities: [],
};

const overviewServiceDraftInitial: OverviewServiceDraft = {
  serviceGroup: '',
  valueStream: '',
  phase: '',
  service: '',
};

const overviewBusinessDriverRowsInitial: OverviewBusinessDriverRow[] = [
  {
    id: 'overview-driver-visibility',
    driver: 'Strategic research visibility',
    source: 'Strategy Office',
    priority: 'High',
    note: 'Provides a shared baseline for sponsor reporting and portfolio discussions.',
  },
  {
    id: 'overview-driver-accessibility',
    driver: 'Accessible citizen and partner services',
    source: 'Transformation Office',
    priority: 'High',
    note: 'Brings the user case forward so the platform remains useful beyond the core PMO audience.',
  },
];

const overviewOutcomeRowsInitial: OverviewOutcomeRow[] = [
  {
    id: 'overview-outcome-reach',
    outcome: 'Enhance accessibility and reach',
    measure: 'Users can discover, compare, and access delivery information from one governed workspace.',
    owner: 'Muna Hassan',
    status: 'Defined',
  },
];

const overviewObjectiveRowsInitial: OverviewObjectiveRow[] = [
  {
    id: 'overview-objective-accessibility',
    objective: 'Enhance accessibility and reach',
    linkedObjective: overviewStrategicObjectiveLinkSeeds[0],
    status: 'Linked',
  },
];

const overviewCapabilityRowsInitial: OverviewCapabilityRow[] = [
  { id: 'overview-capability-monitoring', capability: 'Monitoring & Surveillance', domain: 'Operations', owner: 'Technology Office' },
  { id: 'overview-capability-it', capability: 'IT Management', domain: 'Technology', owner: 'Technology Office' },
];

const overviewServiceRowsInitial: OverviewServiceRow[] = [
  {
    id: 'overview-service-material-master',
    serviceGroup: 'Corporate Services',
    valueStream: 'Procure to Pay',
    phase: 'Execution',
    service: 'Material Master Maintenance',
  },
];

const scheduleScopeStateInitial: ScheduleScopeState = {
  baselineStart: '2026-05-01',
  baselineEnd: '2026-12-31',
  forecastStart: '2026-05-08',
  forecastEnd: '2027-01-14',
  inScope:
    'Research entities, universities, government stakeholders, industry partners, funding bodies, and R&D capability records.',
  outOfScope:
    'Procurement execution, grant administration, and supporting catalogues that are not required for the baseline launch of the research map.',
};

const scheduleScopeOwnerOptions = [
  'Muna Hassan',
  'Chethan Vijayadeva',
  'Vikas Nagpal',
  'Richelle Hilton',
  'PMO Desk',
  'Delivery Office',
];

const scheduleScopePriorityOptions = ['High', 'Medium', 'Low'];

const scheduleScopeCategoryOptions = ['Information', 'Technology', 'Process', 'People', 'Governance'];

const scheduleScopeCapabilityOptions = [
  'Discovery & Research',
  'Digital Platform',
  'Experience Design',
  'Data Management',
  'Governance & Controls',
];

const scheduleScopeExistingEndProducts = [
  {
    product: 'Collaboration platform',
    description: 'Workspace for cross-agency collaboration and knowledge sharing.',
    owner: 'Richelle Hilton',
    category: 'Technology',
    capability: 'Digital Platform',
  },
  {
    product: 'National R&D database',
    description: 'Central searchable register of national research capabilities.',
    owner: 'Muna Hassan',
    category: 'Information',
    capability: 'Data Management',
  },
  {
    product: 'Opportunity marketplace',
    description: 'Matching experience for funders, researchers, and partners.',
    owner: 'Delivery Office',
    category: 'Technology',
    capability: 'Discovery & Research',
  },
  {
    product: 'CRM',
    description: 'Partner relationship layer supporting engagement tracking.',
    owner: 'PMO Desk',
    category: 'Process',
    capability: 'Governance & Controls',
  },
];

const scheduleMilestoneDraftInitial: ScheduleMilestoneDraft = {
  milestone: '',
  dueDate: '',
  owner: '',
  priority: 'Medium',
  note: '',
};

const scheduleEndProductDraftInitial: ScheduleScopeProductDraft = {
  sourceType: 'new',
  product: '',
  description: '',
  owner: '',
  category: 'Information',
  capability: '',
  startDate: '',
  endDate: '',
  capex: '0',
  opex: '0',
  predecessors: '',
  successors: '',
};

const scheduleManagementProductDraftInitial: ScheduleManagementProductDraft = {
  product: '',
  description: '',
  owner: '',
  category: 'Governance',
  startDate: '',
  endDate: '',
  capex: '0',
  opex: '0',
};

const scheduleMilestoneRowsInitial: ScheduleMilestoneRow[] = [
  {
    id: 'milestone-initiation',
    milestone: 'Project initiation and planning',
    dueDate: '2026-07-05',
    owner: 'Chethan Vijayadeva',
    priority: 'High',
    note: 'Baseline submission pack ready for PMO review.',
  },
  {
    id: 'milestone-design',
    milestone: 'Product design',
    dueDate: '2026-09-22',
    owner: 'Vikas Nagpal',
    priority: 'Medium',
    note: 'User journeys and product blueprint aligned with sponsors.',
  },
  {
    id: 'milestone-execution',
    milestone: 'Execution readiness',
    dueDate: '2027-02-22',
    owner: '',
    priority: 'Low',
    note: 'Execution gate planned once delivery products are approved.',
  },
];

const scheduleEndProductRowsInitial: ScheduleScopeProductRow[] = [
  {
    id: 'end-product-uiux',
    product: 'User interface (UI) and user experience (UX) design',
    description: 'Research map interaction model, core templates, and design system coverage.',
    owner: 'Vikas Nagpal',
    category: 'Information',
    capability: 'Experience Design',
    startDate: '2026-05-08',
    endDate: '2026-08-28',
    capex: '0',
    opex: '0',
    predecessors: [],
    successors: ['National R&D database'],
  },
  {
    id: 'end-product-cms',
    product: 'Course management system (CMS)',
    description: 'Content operations tooling for launching and maintaining knowledge assets.',
    owner: 'Richelle Hilton',
    category: 'Technology',
    capability: 'Digital Platform',
    startDate: '2026-06-12',
    endDate: '2026-11-18',
    capex: '180000',
    opex: '24000',
    predecessors: ['Data source onboarding'],
    successors: [],
  },
];

const scheduleManagementProductRowsInitial: ScheduleManagementProductRow[] = [
  {
    id: 'management-product-pid',
    product: 'Project initiation document',
    description: 'Baselined PID package submitted for endorsement.',
    owner: 'PMO Desk',
    category: 'Governance',
    startDate: '2026-05-01',
    endDate: '2026-06-05',
    capex: '0',
    opex: '0',
  },
  {
    id: 'management-product-comms-plan',
    product: 'Communication plan',
    description: 'Stakeholder communication rhythm and escalation rules.',
    owner: 'Muna Hassan',
    category: 'People',
    startDate: '2026-05-10',
    endDate: '2026-06-20',
    capex: '0',
    opex: '12000',
  },
];

const dependencyRegisterConfigs: Record<DependencyRegisterKey, DependencyRegisterConfig> = {
  predecessor: {
    key: 'predecessor',
    fieldName: 'Predecessor Project(s)',
    title: 'Predecessor dependencies',
    description: 'Projects that must land first before this plan can move safely.',
    actionLabel: 'Add predecessor',
    emptyTitle: 'No predecessor dependencies yet',
    emptyBody: 'Add upstream projects, handoff dates, affected products, and owner details once another initiative becomes a delivery blocker for this work.',
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
    emptyBody: 'Add downstream projects, product handoffs, baseline windows, and the PM who needs this work completed before their plan can move.',
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
  emptyBody: 'Add the audience, impact level, and adoption response when a process, stakeholder group, or operating model will feel this project.',
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

const changeRequestTypeOptions: ChangeRequestType[] = ['Budget', 'Schedule', 'Scope'];
const changeRequestPriorityOptions = ['Low', 'Medium', 'High'];
const changeRequestTriggerOptions = ['Resource unavailability', 'Scope refinement', 'Schedule dependency', 'Budget reforecast', 'Quality concern', 'Policy update'];

const changeRequestDraftInitial: ChangeRequestDraft = {
  project: 'Advanced Threat Analytics Engine',
  pmo: 'James T Kirk',
  dueDate: '2026-05-25',
  trigger: 'Resource unavailability',
  priority: 'Low',
  types: [],
  changeDetails: '',
  businessJustification: '',
  riskImpact: '',
  releasesImpacted: '',
  impactToResource: '',
  impactToQuality: '',
  relatedLinks: [],
  relatedLinkName: '',
  relatedLinkDescription: '',
  relatedLinkUrl: '',
};

const changeRequestRowsInitial: ChangeRequestRow[] = [
  {
    id: 'change-request-pcr226',
    pcrNumber: 'PCR226',
    project: 'Advanced Threat Analytics Engine',
    pmo: 'James T Kirk',
    types: ['Scope'],
    createdDate: '2024-07-10',
    dueDate: '2024-07-20',
    priority: 'Medium',
    status: 'IN DRAFT',
    trigger: 'Scope refinement',
    changeDetails: 'Update the delivery boundary for analytics onboarding so the team can absorb new threat data sources without disrupting the current stage gate.',
    businessJustification: 'The additional scope improves coverage for high-priority monitoring scenarios already requested by the business owner.',
    riskImpact: 'Moderate delivery risk if the scope change is not triaged before the next project report.',
    releasesImpacted: 'Threat analytics beta release',
    impactToResource: 'Requires analyst and data engineering review capacity for the revised onboarding scope.',
    impactToQuality: 'Improves completeness of detection scenarios, but requires additional validation of source data quality.',
    relatedLinks: [],
  },
  {
    id: 'change-request-pcr184',
    pcrNumber: 'PCR184',
    project: 'Advanced Threat Analytics Engine',
    pmo: 'James T Kirk',
    types: ['Schedule'],
    createdDate: '2022-02-11',
    dueDate: '2022-02-10',
    priority: 'Low',
    status: 'ENDORSEMENT IN PROGRESS',
    trigger: 'Resource unavailability',
    changeDetails: 'Move the impacted schedule checkpoint while the project waits for shared resource availability.',
    businessJustification: 'The schedule movement keeps the project realistic and avoids false escalation while resource cover is being confirmed.',
    riskImpact: 'Low impact if PMO endorsement is completed before the next weekly report cycle.',
    releasesImpacted: 'Planning gate pack',
    impactToResource: 'Temporary resource gap across the project delivery team.',
    impactToQuality: 'No direct quality impact expected if the revised dates are reflected in the baseline.',
    relatedLinks: [],
  },
  {
    id: 'change-request-pcr173',
    pcrNumber: 'PCR173',
    project: 'Advanced Threat Analytics Engine',
    pmo: 'James T Kirk',
    types: ['Schedule'],
    createdDate: '2021-12-02',
    dueDate: '2021-12-16',
    priority: 'Medium',
    status: 'CLOSED',
    trigger: 'Schedule dependency',
    changeDetails: 'Closed schedule adjustment from the previous planning cycle.',
    businessJustification: 'Dependency handoff completed and accepted by PMO.',
    riskImpact: 'No residual impact.',
    releasesImpacted: 'Planning baseline',
    impactToResource: '',
    impactToQuality: '',
    relatedLinks: [],
  },
  {
    id: 'change-request-pcr149',
    pcrNumber: 'PCR149',
    project: 'Advanced Threat Analytics Engine',
    pmo: 'James T Kirk',
    types: ['Scope'],
    createdDate: '2021-09-14',
    dueDate: '2021-09-30',
    priority: 'Low',
    status: 'CLOSED',
    trigger: 'Policy update',
    changeDetails: 'Closed scope clarification for governance evidence.',
    businessJustification: 'Evidence requirements were clarified for audit readiness.',
    riskImpact: 'No residual impact.',
    releasesImpacted: 'Governance pack',
    impactToResource: '',
    impactToQuality: '',
    relatedLinks: [],
  },
  {
    id: 'change-request-pcr118',
    pcrNumber: 'PCR118',
    project: 'Advanced Threat Analytics Engine',
    pmo: 'James T Kirk',
    types: ['Budget'],
    createdDate: '2021-05-03',
    dueDate: '2021-05-21',
    priority: 'High',
    status: 'CLOSED',
    trigger: 'Budget reforecast',
    changeDetails: 'Closed budget movement for early supplier discovery.',
    businessJustification: 'Supplier discovery was completed within the approved envelope.',
    riskImpact: 'No residual impact.',
    releasesImpacted: 'Discovery phase',
    impactToResource: '',
    impactToQuality: '',
    relatedLinks: [],
  },
  {
    id: 'change-request-pcr102',
    pcrNumber: 'PCR102',
    project: 'Advanced Threat Analytics Engine',
    pmo: 'James T Kirk',
    types: ['Scope'],
    createdDate: '2021-02-08',
    dueDate: '2021-02-22',
    priority: 'Medium',
    status: 'CLOSED',
    trigger: 'Quality concern',
    changeDetails: 'Closed scope quality correction for test evidence.',
    businessJustification: 'Quality correction was accepted by the sponsor.',
    riskImpact: 'No residual impact.',
    releasesImpacted: 'Test evidence pack',
    impactToResource: '',
    impactToQuality: '',
    relatedLinks: [],
  },
];

const changeRequestImpactBenefits: ChangeRequestImpactBenefitRow[] = [
  {
    benefit: 'Cost Reduction',
    profile: 'Lower operational costs compared to traditional brick-and-mortar institutions.',
    owner: '-',
    product: '-',
  },
  {
    benefit: 'Increased Client Satisfaction',
    profile: 'Wider Reach and Inclusivity',
    owner: 'Claire Philips',
    product: '-',
  },
];

const changeRequestImpactCapabilities: ChangeRequestImpactCapabilityRow[] = [
  {
    group: 'Crime Prevention & Public Safety',
    capability: 'IT Management',
    manager: '-',
    products: 'No Products',
  },
  {
    group: 'Intelligence Analysis & Assessment',
    capability: 'Monitoring & Surveillance',
    manager: 'Kenneth Ganya',
    products: 'No Products',
  },
];

const changeRequestImpactProjects: ChangeRequestImpactProjectRow[] = [
  {
    project: '1 - Skills Development and Training',
    manager: '-',
    products: [
      'Green Product',
      'T1A-E70 Security Risk Management Plan (SRMP)',
      'Payment gateway',
      'T1A-E28 Technical Solution Blueprint including the integration of on-premise and cloud-solutions',
      'internet bandwidth',
      'T1A-E71 Solution Overview Document (SOD)',
      'T1B-E11 Business Intelligence & Analytics Blueprint',
      'T1B-E72 Executive Summary',
      'T1B-E08 Gap List & WRICEFX List',
    ],
  },
];

const closureReasonOptions = ['Delivered as planned', 'Closed with approved variance', 'Superseded by another initiative', 'Cancelled by sponsor', 'Merged into BAU'];

const closureOverviewBlocks: ClosureTextBlock[] = [
  {
    id: 'executive-summary',
    title: 'Executive summary',
    description: 'Summarize the delivery outcome, residual decisions, and sponsor position.',
    value:
      'The project has completed its planned close-out review. Core deliverables are accepted, residual actions have owners, and the remaining work is ready for BAU transition tracking.',
    maxLength: 3000,
    icon: 'fileCheck',
  },
  {
    id: 'performance-against-plan',
    title: 'Performance against project plan',
    description: 'Capture schedule, scope, and cost performance against the approved baseline.',
    value:
      'Delivery stayed within the approved scope with minor schedule movement absorbed through the final readiness window. Forecast variance remains controlled and no new baseline change is required.',
    maxLength: 3000,
    icon: 'chart',
  },
  {
    id: 'quality',
    title: 'Quality',
    description: 'Record quality assurance results, accepted exceptions, and final quality confidence.',
    value:
      'Quality checks are complete for priority records, with source-owner validation exceptions converted into follow-up actions. No unresolved quality blocker prevents closure.',
    maxLength: 3000,
    icon: 'check',
  },
  {
    id: 'bau-transition',
    title: 'BAU transition',
    description: 'Explain how service ownership, support, knowledge, and data upkeep move into operations.',
    value:
      'Operational ownership transfers to the Research Office with PMO reporting support for the first month after closure. A named data steward and escalation route are in place.',
    maxLength: 3000,
    icon: 'store',
  },
  {
    id: 'capitalisation',
    title: 'Capitalisation',
    description: 'Capture capitalization, asset handover, and any finance evidence required at closure.',
    value:
      'Capitalizable project assets have been identified for finance review. Funding source evidence and monthly actuals are ready for final reconciliation.',
    maxLength: 3000,
    icon: 'dollar',
  },
];

const closureChecklistItems: ClosureChecklistItem[] = [
  { label: 'Sponsor acceptance recorded', state: 'Ready', tone: 'green' },
  { label: 'Financial reconciliation reviewed', state: 'In review', tone: 'amber' },
  { label: 'BAU owner confirmed', state: 'Ready', tone: 'green' },
  { label: 'Lessons captured', state: 'Draft', tone: 'blue' },
];

const closureFollowUpActions: ClosureFollowUpAction[] = [
  {
    id: 'closure-action-1',
    action: 'Confirm final source-owner validation exceptions and add the signed exception list to the evidence pack.',
    owner: 'Muna Hassan',
    dueDate: '2026-06-16',
    status: 'Open',
    tone: 'amber',
  },
  {
    id: 'closure-action-2',
    action: 'Run first BAU service review with Research Office and PMO reporting support.',
    owner: 'Research Leads Forum',
    dueDate: '2026-07-03',
    status: 'Planned',
    tone: 'blue',
  },
];

const closureRecommendations: ClosureRecommendation[] = [
  {
    id: 'closure-rec-1',
    recommendation: 'Keep monthly data stewardship reporting active for the first quarter after closure.',
    owner: 'PMO Desk',
    category: 'BAU transition',
    status: 'Recommended',
    tone: 'indigo',
  },
  {
    id: 'closure-rec-2',
    recommendation: 'Use the same source-owner validation model for future ecosystem mapping initiatives.',
    owner: 'Strategy Office',
    category: 'Reuse',
    status: 'Accepted',
    tone: 'green',
  },
];

const closureBenefitRows: ClosureBenefitRow[] = [
  {
    category: 'Increased Quality',
    benefit: 'Improved ecosystem visibility - Single source of truth reduces fragmentation in research data',
    owner: 'Chethan Vijayadeva',
    realizationDate: '2026-10-13',
    measures: 0,
    status: 'Tracking',
    tone: 'indigo',
  },
  {
    category: 'Cost Reduction',
    benefit: 'Better funding allocation - Centralized visibility enables policymakers and funding bodies to direct investments toward high-impact and underrepresented research areas',
    owner: 'Chethan Vijayadeva',
    realizationDate: '2026-11-26',
    measures: 0,
    status: 'Tracking',
    tone: 'indigo',
  },
  {
    category: 'Increase in Revenue',
    benefit: 'Stronger policy and strategic decision-making - Aggregated R&D data supports evidence-based planning and national innovation strategy development',
    owner: 'Andrew Bullock',
    realizationDate: '2026-03-07',
    measures: 0,
    status: 'Realized',
    tone: 'green',
  },
  {
    category: 'Increased Quality',
    benefit: 'Faster collaboration and innovation - Easier discovery of partners accelerates the research-to-impact cycle',
    owner: 'James T Kirk',
    realizationDate: '2026-09-23',
    measures: 2,
    status: 'Tracking',
    tone: 'indigo',
  },
  {
    category: 'Cost Reduction',
    benefit: 'Reduction in operational costs through local partnerships',
    owner: 'James T Kirk',
    realizationDate: '2026-12-29',
    measures: 2,
    status: 'Tracking',
    tone: 'indigo',
  },
  {
    category: 'Cost Reduction',
    benefit: 'Sustained growth support during the first year of operations in Dubai',
    owner: 'James T Kirk',
    realizationDate: '2026-04-27',
    measures: 2,
    status: 'In review',
    tone: 'amber',
  },
];

const closureRiskRows: ClosureRiskRow[] = [
  {
    id: 'R839',
    risk: 'High handover dependency if BAU owners are not ready to accept reporting ownership',
    actualRating: 'Medium',
    treatments: 0,
    residualRating: 'Medium',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'Open',
  },
  {
    id: 'R834',
    risk: 'Data quality risk - Inaccurate or outdated entries can reduce platform credibility',
    actualRating: 'High',
    treatments: 0,
    residualRating: 'Medium',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'Open',
  },
  {
    id: 'R822',
    risk: "Low adoption risk - Value diminishes if key institutions/researchers don't actively participate",
    actualRating: 'Medium',
    treatments: 1,
    residualRating: 'Low',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'Open',
  },
];

const closureIssueRows: ClosureIssueRow[] = [
  {
    id: 'I59',
    issue: 'Stakeholder alignment gaps - Different priorities across academia, government, and industry can slow usage',
    type: 'Stakeholders',
    resolution: 'Create a cross-sector governance framework with clearly defined roles, incentives, and accountability mechanisms.',
    criticality: 'Low',
    status: 'Open',
    owner: '-',
    dueDate: '2026-07-16',
  },
  {
    id: 'I70',
    issue: 'Data standardization challenge - Difficulty in harmonizing inputs across diverse institutions',
    type: 'Resource',
    resolution: 'Establish a unified data model with mandatory input standards and validation protocols across all participating entities.',
    criticality: 'Medium',
    status: 'Open',
    owner: 'Chloe Gibson',
    dueDate: '2026-01-23',
  },
];

const closureLessonRows: ClosureLessonRow[] = [
  {
    title: 'Lesson 1',
    category: 'Vendor Performance',
    issue: 'Opportunity',
    recommendation: 'Gather success stories and case studies from vendors to better understand quality of services and deliverables.',
  },
  {
    title: 'Lesson 2',
    category: 'Architecture & Design',
    issue: 'This is an issue',
    recommendation: 'Architecture reviews need to be done more rigorously. Identifying design flaws earlier will eliminate execution delays.',
  },
];

const resourcePlanConfig: ResourcePlanConfig = {
  fieldName: 'Resource Plan',
  title: 'Resource plan',
  description: 'People, sourcing, and FTE assumptions needed to deliver this project.',
  actionLabel: 'Add resource',
  emptyTitle: 'No resources added yet',
  emptyBody: 'Add the role, source type, FTE need, business unit, and planned date window so staffing conversations start from a clear baseline.',
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
  emptyBody: 'Add the first outcome this project should unlock, then capture the category, owner, and realization date so value tracking starts early.',
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

const riskTreatmentDraftInitial: RiskTreatmentDraft = {
  treatment: '',
  type: 'Mitigate',
  category: 'Preventive',
  owner: '',
  manager: 'James T Kirk',
  startDate: '',
  endDate: '',
  status: 'Planned',
};

const riskPlanConfig: RiskPlanConfig = {
  fieldName: 'Risks Register',
  title: 'Risk register',
  description: 'Capture delivery threats, their exposure, owners, and the response needed before the risk lands in project reporting.',
  actionLabel: 'Add risk',
  emptyTitle: 'No risks logged yet',
  emptyBody: 'Add potential delivery threats, exposure, owner, and mitigation response once the first risk needs PMO visibility.',
  categoryPlaceholder: 'Select risk category',
  ownerPlaceholder: 'Select risk owner',
  leadPlaceholder: 'Select risk lead',
  statusPlaceholder: 'Select risk status',
  strategicRiskPlaceholder: 'Select strategic risk',
  categoryOptions: ['Reputational', 'Technology Risk', 'Schedule Risk', 'Financial Risk', 'Operational Risk', 'Compliance Risk', 'Stakeholder Risk'],
  ownerOptions: ['James T Kirk', 'Richelle Hilton', 'Muna Hassan', 'Fatima Ali', 'Khalid Omar', 'PMO Desk', 'Delivery Office'],
  statusOptions: ['Open', 'Monitoring', 'Escalated', 'Closed'],
  strategicRiskOptions: ['No', 'Yes', 'Strategic objective exposure', 'Enterprise dependency'],
  likelihoodOptions: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain'],
  consequenceOptions: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe'],
  impactedObjectiveOptions: [
    'Boost regional sustainability and growth through partnerships and investment',
    'Improve national research capability discovery',
    'Increase partner adoption of the research map',
    'Protect credibility of strategic portfolio data',
  ],
  controlEffectivenessOptions: ['Not Rated', 'Ineffective', 'Partially Effective', 'Effective', 'Highly Effective'],
  treatmentApproachOptions: ['Mitigate the threat', 'Transfer the threat', 'Accept the threat', 'Avoid the threat', 'Take the opportunity'],
  treatmentTypeOptions: ['Mitigate', 'Avoid', 'Transfer', 'Accept', 'Exploit', 'Enhance'],
  treatmentCategoryOptions: ['Preventive', 'Corrective', 'Detective', 'Contingency'],
  rows: [
    {
      id: 'R822',
      riskCategory: 'Reputational',
      riskName: "Low adoption risk - Value diminishes if key institutions/researchers don't actively participate",
      description:
        'If key institutions and researchers do not actively maintain their profiles or promote the map, the platform may not become the trusted national entry point for research discovery.',
      owner: 'James T Kirk',
      manager: 'James T Kirk',
      lead: 'James T Kirk',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      reviewDueDate: '',
      status: 'Open',
      strategicRisk: 'No',
      enterpriseImpact: false,
      actualLikelihood: 'Possible',
      actualConsequence: 'Minor',
      actualRating: 'Medium',
      residualLikelihood: 'Unlikely',
      residualConsequence: 'Moderate',
      residualRating: 'Medium',
      impactedObjective: 'Increase partner adoption of the research map',
      sharedRisk: false,
      source: 'Partner onboarding depends on research institutions dedicating time to validate profiles, nominate administrators, and keep research capability data fresh.',
      consequence: 'Low participation would weaken credibility, reduce discovery value, and make it harder for the project to demonstrate strategic adoption benefits.',
      controlSummary: 'Stakeholder engagement cadence, named institutional champions, and monthly adoption tracking through the PMO dashboard.',
      overallControlEffectiveness: 'Partially Effective',
      analysisComment: 'Adoption controls are in place, but they need stronger sponsor follow-up before the execution stage.',
      treatmentApproach: 'Mitigate the threat',
      treatmentType: 'Mitigate',
      treatmentComment: 'Focus on early adopter institutions first, then publish participation evidence to encourage wider uptake.',
      treatments: [
        {
          id: 'risk-treatment-r822-1',
          treatment: 'Confirm champions for priority research institutions and add participation checkpoints to the monthly steering pack.',
          type: 'Mitigate',
          category: 'Preventive',
          owner: 'James T Kirk',
          manager: 'James T Kirk',
          startDate: '2026-05-15',
          endDate: '2026-07-31',
          status: 'Planned',
        },
      ],
      createdOn: '2026-05-13',
    },
    {
      id: 'R834',
      riskCategory: 'Technology Risk',
      riskName: 'Data quality risk - Inaccurate or outdated entries can reduce platform credibility',
      description:
        'Institution, capability, and researcher records may become stale if source owners do not validate changes quickly enough after launch.',
      owner: 'Richelle Hilton',
      manager: 'James T Kirk',
      lead: 'Richelle Hilton',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      reviewDueDate: '',
      status: 'Open',
      strategicRisk: 'No',
      enterpriseImpact: false,
      actualLikelihood: 'Likely',
      actualConsequence: 'Major',
      actualRating: 'High',
      residualLikelihood: 'Possible',
      residualConsequence: 'Moderate',
      residualRating: 'Medium',
      impactedObjective: 'Protect credibility of strategic portfolio data',
      sharedRisk: false,
      source: 'Source data arrives from multiple institutions with uneven update cycles, data owners, and validation standards.',
      consequence: 'Outdated records could cause users to question the platform, reduce repeat use, and increase manual correction work for the PMO.',
      controlSummary: 'Data steward review workflow, required source owner confirmations, and exception reports for stale records.',
      overallControlEffectiveness: 'Partially Effective',
      analysisComment: 'Controls need stronger automation support before the public launch window.',
      treatmentApproach: 'Mitigate the threat',
      treatmentType: 'Mitigate',
      treatmentComment: 'Prioritize validation rules, stale data reporting, and source owner escalation before launch readiness review.',
      treatments: [],
      createdOn: '2026-05-13',
    },
  ],
  draft: {
    riskCategory: '',
    riskName: '',
    description: '',
    owner: '',
    manager: 'James T Kirk',
    lead: '',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    reviewDueDate: '',
    status: 'Open',
    strategicRisk: 'No',
    enterpriseImpact: false,
    actualLikelihood: '',
    actualConsequence: '',
    actualRating: '',
    residualLikelihood: '',
    residualConsequence: '',
    residualRating: '',
    impactedObjective: '',
    sharedRisk: false,
    source: '',
    consequence: '',
    controlSummary: '',
    overallControlEffectiveness: 'Not Rated',
    analysisComment: '',
    treatmentApproach: 'Mitigate the threat',
    treatmentType: 'Mitigate',
    treatmentComment: '',
    treatments: [],
  },
};

const issuePlanConfig: IssuePlanConfig = {
  fieldName: 'Issues Register',
  title: 'Issues register',
  description: 'Track blockers, open decisions, and delivery problems so ownership and next action are visible without opening another tool.',
  actionLabel: 'Add issue',
  emptyTitle: 'No issues logged yet',
  emptyBody: 'Add blockers, dependency problems, or unresolved decisions with owner, due date, and resolution notes before the plan starts to slow down.',
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

const riskPlanEmptyState = {
  title: 'Risk register',
  description: 'Capture threats, exposure, mitigation ownership, and review cadence before they affect delivery.',
  actionLabel: 'Add risk',
  emptyTitle: 'No risks logged yet',
  emptyBody: 'Add potential delivery threats, exposure, owner, and mitigation response once the first risk needs PMO visibility.',
  icon: 'risks',
  countLabel: '0 risks',
};

const budgetPlanConfig: BudgetPlanConfig = {
  fieldName: 'Budget',
  title: 'Budget',
  description: 'Review the approved project budget, then manage the selected financial year below.',
  actionLabel: 'Edit FY budget',
  emptyTitle: 'Budget will appear once the PM assignment is ready',
  emptyBody: 'Budget overview is populated from the approved project allocation. Project budget details are managed by financial year.',
  drawerTitle: 'FY budget',
  drawerBody: 'Adjust the selected financial year baseline and forecast split.',
  fundingTitle: 'Funding sources',
  fundingBody: 'Track where this year’s money is coming from, how much is allocated, and whether each source is already confirmed.',
  fundingEmptyTitle: 'No funding sources added yet',
  fundingEmptyBody: 'Add confirmed or pending funding lines here once the baseline is agreed so finance reviews can trace how the FY budget is covered.',
  monthlyTitle: 'Monthly budget phasing',
  monthlyBody: 'Monthly phasing rolls up to the FY forecast. Forecast, actual, and committed values are easiest to manage in a focused drawer rather than a long page table.',
  monthlyEmptyTitle: 'No monthly phasing yet',
  monthlyEmptyBody: 'Once an FY budget is saved we will generate monthly phasing automatically so you can refine the forecast and track actuals without building the structure from scratch.',
  ruleButtonLabel: 'Budget rules',
  fyPlaceholder: 'Select fiscal year',
  amountPlaceholder: '0',
  sourcePlaceholder: 'Enter funding source',
  sourceTypePlaceholder: 'Select funding type',
  sourceStatusPlaceholder: 'Select status',
  fyOptions: ['FY 2025-2026', 'FY 2026-2027', 'FY 2027-2028', 'FY 2028-2029'],
  sourceTypeOptions: ['CAPEX', 'OPEX', 'Grant', 'Co-funding'],
  sourceStatusOptions: ['Confirmed', 'Pending approval', 'At risk'],
  rules: [
    {
      title: 'Approved project budget',
      body: 'The total project budget comes from the approved allocation and is not edited inside this plan page.',
    },
    {
      title: 'Financial year split',
      body: 'The PM can break the approved budget into financial year baseline and forecast values before submission.',
    },
    {
      title: 'Actuals during delivery',
      body: 'Committed and actual values are updated during project delivery and roll into available budget.',
    },
    {
      title: 'Monthly budget',
      body: 'Monthly budget values sit under the selected FY and roll up into the Project Budget table.',
    },
  ],
  yearDraft: {
    fy: 'FY 2026-2027',
    baselineCapex: '',
    baselineOpex: '',
    forecastCapex: '',
    forecastOpex: '',
  },
  fundingDraft: {
    source: '',
    type: '',
    amount: '',
    status: 'Confirmed',
    notes: '',
  },
};

function parseBudgetFiscalYears(fy: string): [number, number] {
  const match = fy.match(/(\d{4})\D+(\d{4})/);
  if (!match) return [2026, 2027];
  return [Number(match[1]), Number(match[2])];
}

function distributeBudgetAmountEvenly(total: number, count: number): number[] {
  if (!count) return [];
  const totalCents = Math.round(total * 100);
  const base = Math.floor(totalCents / count);
  const remainder = totalCents - base * count;
  return Array.from({ length: count }, (_, index) => (base + (index < remainder ? 1 : 0)) / 100);
}

function budgetMonthLabelsForFy(fy: string): string[] {
  const [startYear, endYear] = parseBudgetFiscalYears(fy);
  const order = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
  return order.map((monthIndex) => {
    const year = monthIndex >= 6 ? startYear : endYear;
    return new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  });
}

function buildBudgetMonthlyRows(
  fy: string,
  totals: Pick<BudgetYearPlan, 'baselineCapex' | 'baselineOpex' | 'forecastCapex' | 'forecastOpex'>,
  overrides: Array<Partial<BudgetMonthlyRow> & { month: string }> = [],
): BudgetMonthlyRow[] {
  const months = budgetMonthLabelsForFy(fy);
  const capexBudget = distributeBudgetAmountEvenly(totals.baselineCapex, months.length);
  const opexBudget = distributeBudgetAmountEvenly(totals.baselineOpex, months.length);
  const capexForecast = distributeBudgetAmountEvenly(totals.forecastCapex, months.length);
  const opexForecast = distributeBudgetAmountEvenly(totals.forecastOpex, months.length);
  const overrideMap = new Map(overrides.map((override) => [override.month, override]));

  return months.map((month, index) => {
    const override = overrideMap.get(month);
    return {
      id: `budget-month-${slugifyPlanField(`${fy}-${month}`)}`,
      month,
      capexBudget: capexBudget[index],
      opexBudget: opexBudget[index],
      capexForecast: override?.capexForecast ?? capexForecast[index],
      opexForecast: override?.opexForecast ?? opexForecast[index],
      capexActual: override?.capexActual ?? 0,
      opexActual: override?.opexActual ?? 0,
      capexCommitted: override?.capexCommitted ?? 0,
      opexCommitted: override?.opexCommitted ?? 0,
    };
  });
}

function createBudgetYearPlan(
  id: string,
  fy: string,
  baselineCapex: number,
  baselineOpex: number,
  forecastCapex: number,
  forecastOpex: number,
  fundingSources: BudgetFundingSourceRow[],
  overrides: Array<Partial<BudgetMonthlyRow> & { month: string }> = [],
  approvedBudgetLabel?: string,
): BudgetYearPlan {
  return {
    id,
    fy,
    baselineCapex,
    baselineOpex,
    forecastCapex,
    forecastOpex,
    fundingSources,
    monthlyRows: buildBudgetMonthlyRows(
      fy,
      { baselineCapex, baselineOpex, forecastCapex, forecastOpex },
      overrides,
    ),
    approvedBudgetLabel,
  };
}

const budgetPlanSeeds: Record<string, BudgetPlanState> = {
  default: {
    selectedFy: 'FY 2026-2027',
    lastSavedLabel: 'Saved yesterday',
    years: [
      createBudgetYearPlan(
        'budget-year-2025',
        'FY 2025-2026',
        480000,
        180000,
        492000,
        188000,
        [
          { id: 'funding-2025-1', source: 'Strategy allocation', type: 'CAPEX', amount: 350000, status: 'Confirmed', notes: 'Core transformation allocation' },
          { id: 'funding-2025-2', source: 'Sponsor reserve', type: 'CAPEX', amount: 130000, status: 'Pending approval', notes: 'Release expected after steering review' },
          { id: 'funding-2025-3', source: 'Operations envelope', type: 'OPEX', amount: 180000, status: 'Confirmed', notes: 'Research office operating budget' },
        ],
        [
          { month: 'Jul 2025', capexActual: 18000, opexActual: 9000, capexCommitted: 12000, opexCommitted: 3000 },
          { month: 'Aug 2025', capexActual: 22000, opexActual: 11000, capexCommitted: 8000, opexCommitted: 2000 },
          { month: 'Sep 2025', capexActual: 24000, opexActual: 12000, capexCommitted: 7000, opexCommitted: 2500 },
        ],
        'Original approved budget SAR 660K',
      ),
      createBudgetYearPlan(
        'budget-year-2026',
        'FY 2026-2027',
        1200000,
        420000,
        1180000,
        435000,
        [
          { id: 'funding-2026-1', source: 'Innovation fund', type: 'CAPEX', amount: 700000, status: 'Confirmed', notes: 'Primary capital envelope' },
          { id: 'funding-2026-2', source: 'Corporate co-funding', type: 'CAPEX', amount: 500000, status: 'Pending approval', notes: 'Approval expected at Q2 forum' },
          { id: 'funding-2026-3', source: 'Research operations', type: 'OPEX', amount: 420000, status: 'Confirmed', notes: 'Operating cost allocation' },
        ],
        [
          { month: 'Jul 2026', capexActual: 24000, opexActual: 10000, capexCommitted: 18000, opexCommitted: 5000 },
          { month: 'Aug 2026', capexActual: 31000, opexActual: 13000, capexCommitted: 14000, opexCommitted: 4000 },
          { month: 'Sep 2026', capexActual: 27000, opexActual: 12000, capexCommitted: 12000, opexCommitted: 3000 },
          { month: 'Oct 2026', capexActual: 15000, opexActual: 9000, capexCommitted: 10000, opexCommitted: 2500 },
        ],
        'Original approved budget SAR 1.62M',
      ),
    ],
  },
  'Vision 2030': {
    selectedFy: 'FY 2026-2027',
    lastSavedLabel: 'Saved yesterday',
    years: [
      createBudgetYearPlan(
        'vision-budget-2025',
        'FY 2025-2026',
        480000,
        180000,
        492000,
        188000,
        [
          { id: 'vision-funding-2025-1', source: 'Strategy allocation', type: 'CAPEX', amount: 350000, status: 'Confirmed', notes: 'Core transformation allocation' },
          { id: 'vision-funding-2025-2', source: 'Sponsor reserve', type: 'CAPEX', amount: 130000, status: 'Pending approval', notes: 'Release expected after steering review' },
          { id: 'vision-funding-2025-3', source: 'Operations envelope', type: 'OPEX', amount: 180000, status: 'Confirmed', notes: 'Research office operating budget' },
        ],
        [
          { month: 'Jul 2025', capexActual: 18000, opexActual: 9000, capexCommitted: 12000, opexCommitted: 3000 },
          { month: 'Aug 2025', capexActual: 22000, opexActual: 11000, capexCommitted: 8000, opexCommitted: 2000 },
          { month: 'Sep 2025', capexActual: 24000, opexActual: 12000, capexCommitted: 7000, opexCommitted: 2500 },
        ],
        'Original approved budget SAR 660K',
      ),
      createBudgetYearPlan(
        'vision-budget-2026',
        'FY 2026-2027',
        1200000,
        420000,
        1180000,
        435000,
        [
          { id: 'vision-funding-2026-1', source: 'Innovation fund', type: 'CAPEX', amount: 700000, status: 'Confirmed', notes: 'Primary capital envelope' },
          { id: 'vision-funding-2026-2', source: 'Corporate co-funding', type: 'CAPEX', amount: 500000, status: 'Pending approval', notes: 'Approval expected at Q2 forum' },
          { id: 'vision-funding-2026-3', source: 'Research operations', type: 'OPEX', amount: 420000, status: 'Confirmed', notes: 'Operating cost allocation' },
        ],
        [
          { month: 'Jul 2026', capexActual: 24000, opexActual: 10000, capexCommitted: 18000, opexCommitted: 5000 },
          { month: 'Aug 2026', capexActual: 31000, opexActual: 13000, capexCommitted: 14000, opexCommitted: 4000 },
          { month: 'Sep 2026', capexActual: 27000, opexActual: 12000, capexCommitted: 12000, opexCommitted: 3000 },
          { month: 'Oct 2026', capexActual: 15000, opexActual: 9000, capexCommitted: 10000, opexCommitted: 2500 },
        ],
        'Original approved budget SAR 1.62M',
      ),
    ],
  },
  'NEOM Integration': {
    selectedFy: 'FY 2026-2027',
    lastSavedLabel: 'Saved this morning',
    years: [
      createBudgetYearPlan(
        'neom-budget-2026',
        'FY 2026-2027',
        1650000,
        520000,
        1720000,
        560000,
        [
          { id: 'neom-funding-1', source: 'Digital integration fund', type: 'CAPEX', amount: 1200000, status: 'Confirmed', notes: 'Approved in Q1' },
          { id: 'neom-funding-2', source: 'Contingency reserve', type: 'CAPEX', amount: 450000, status: 'At risk', notes: 'Released only if scope stays approved' },
          { id: 'neom-funding-3', source: 'Operations transition budget', type: 'OPEX', amount: 520000, status: 'Confirmed', notes: 'Shared services support' },
        ],
        [
          { month: 'Jul 2026', capexActual: 42000, opexActual: 15000, capexCommitted: 30000, opexCommitted: 6000 },
          { month: 'Aug 2026', capexActual: 38000, opexActual: 17000, capexCommitted: 26000, opexCommitted: 7000 },
          { month: 'Sep 2026', capexActual: 51000, opexActual: 18000, capexCommitted: 18000, opexCommitted: 6000 },
        ],
        'Original approved budget SAR 2.17M',
      ),
    ],
  },
  'UAE Research Map': {
    selectedFy: 'FY 2026-2027',
    lastSavedLabel: 'Not yet saved',
    years: [],
  },
  'PMO Capability': {
    selectedFy: 'FY 2026-2027',
    lastSavedLabel: 'Not yet saved',
    years: [],
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

const projectPlanStageDateWindows: Record<string, { start: string; end: string }> = {
  initiation: { start: '01/05/2026', end: '07/05/2026' },
  planning: { start: '08/05/2026', end: '12/06/2026' },
  execution: { start: '15/06/2026', end: '30/11/2026' },
  closure: { start: '01/12/2026', end: '31/12/2026' },
};

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
type StageGateStatus = 'complete' | 'submitted' | 'current' | 'upcoming' | 'revoked';

interface StageGateContext {
  profile: StageProfile;
  stage: StageDefinition;
  stageIndex: number;
  status: StageGateStatus;
  checkedCount: number;
}

interface ProjectPlanStageRow {
  stage: StageDefinition;
  stageIndex: number;
  status: StageGateStatus;
  statusLabel: string;
  statusTone: string;
  startDate: string;
  endDate: string;
  actionLabel: string;
  actionIcon: string;
  actionDisabled: boolean;
  canRevoke: boolean;
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
  footerStandalone?: boolean;
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
    iconAsset: './assets/pm101/figma-step-1.svg',
    decor: 'burst',
    decorAssets: ['./assets/pm101/decor-1.svg'],
    footerLabel: 'Project assigned on',
    footerValue: 'Jul 25, 2026',
  },
  {
    title: 'Build project plan',
    body: 'Set scope, timeline, risks, and dependencies.',
    iconAsset: './assets/pm101/figma-step-2.svg',
    decor: 'rings',
    decorAssets: ['./assets/pm101/decor-2.svg'],
    footerAction: 'Project Plan Created',
    footerStandalone: true,
  },
  {
    title: 'Manage delivery',
    body: 'Track milestones, issues, and dependencies.',
    iconAsset: './assets/pm101/figma-step-3.svg',
    decor: 'loops',
    decorAssets: ['./assets/pm101/decor-4.svg'],
    footerAction: 'Go to workspaces',
  },
  {
    title: 'Report progress',
    body: 'Submit PSRs and maintain delivery health.',
    iconAsset: './assets/pm101/figma-step-4.svg',
    decor: 'hex',
    decorAssets: ['./assets/pm101/decor-5.svg'],
    footerAction: 'Create Report',
  },
  {
    title: 'Access Learning Hub',
    body: 'Understand & align with latest PIF guidelines.',
    iconAsset: './assets/pm101/figma-step-5.svg',
    decor: 'plus',
    decorAssets: ['./assets/pm101/decor-3-group-1.svg', './assets/pm101/decor-3-group-2.svg', './assets/pm101/decor-3-group-3.svg', './assets/pm101/decor-3-group-4.svg'],
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
  imports: [
    CommonModule,
    PmConsoleFieldComponent,
    PmConsoleIconComponent,
    PmConsolePlanDrawerComponent,
    PmConsolePlanEmptyStateComponent,
    PmConsolePlanTableComponent,
    PmConsoleReportDrawerComponent,
    PmConsoleRiskMatrixComponent,
    PmConsoleRowActionMenuComponent,
    PmConsoleStatusPillComponent,
    PmConsoleTableActionComponent,
    PmConsoleToolbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas" [class.workspaces-canvas]="selectedPage === 'workspaces'" [class.wbs-canvas]="selectedPage === 'wbs'" [class.project-plan-canvas]="selectedPage === 'project-plan'" [class.playground-canvas]="selectedPage === 'playground'" [class.unassigned-canvas]="frontDoorMode === 'unassigned'" [class.pm101-locked-canvas]="onboardingPm101Locked || isPm101WelcomeWorkspace" [class.pm101-operational-canvas]="isNormalPm101Workspace">
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
                    <app-pm-console-toolbar [itemLabel]="'Items: ' + workspaceTableProjects.length">
                        <button class="pm-table-tool square" type="button" aria-label="Search projects"><span pmConsoleIcon="search" aria-hidden="true"></span></button>
                        <button class="pm-table-tool" type="button"><span pmConsoleIcon="filter" aria-hidden="true"></span><span>Filter</span></button>
                        <button class="pm-table-tool" type="button"><span pmConsoleIcon="sliders-horizontal" aria-hidden="true"></span><span>Group by</span></button>
                        <div class="pm-project-view-toggle" aria-label="Project display">
                          <button type="button" aria-label="Card view" aria-pressed="false" (click)="setWorkspaceDisplay('cards')"><span pmConsoleIcon="layout-grid" aria-hidden="true"></span></button>
                          <button class="active" type="button" aria-label="List view" aria-pressed="true" (click)="setWorkspaceDisplay('table')"><span pmConsoleIcon="list" aria-hidden="true"></span></button>
                        </div>
                        <button class="pm-table-tool" type="button"><span pmConsoleIcon="download" aria-hidden="true"></span><span>Export</span></button>
                        <button class="pm-table-add-project" type="button"><span pmConsoleIcon="plus" aria-hidden="true"></span><span>Add Project</span></button>
                        <div class="pm-table-settings-menu" data-workspace-columns-menu>
                          <button class="pm-table-tool square" type="button" aria-label="Table settings" aria-haspopup="dialog" [attr.aria-expanded]="workspaceColumnMenuOpen" aria-controls="workspace-column-picker" (click)="toggleWorkspaceColumnMenu()"><span pmConsoleIcon="settings" aria-hidden="true"></span></button>
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
                    </app-pm-console-toolbar>
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
                                    <td class="pm-table-column-cell pm-table-status-cell" [class.is-entering]="workspaceTableColumnMotionState(column.id) === 'entering'" [class.is-exiting]="workspaceTableColumnMotionState(column.id) === 'exiting'" [style.--column-open-width]="workspaceTableColumnWidth(column.id)"><div class="pm-table-column-frame"><span [pmConsoleStatusPill]="project.status" baseClass="pm-table-row-status" [tone]="project.statusTone"></span></div></td>
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
                  <app-pm-console-toolbar [itemLabel]="'Items: ' + workspaceProjectCards.length" toolbarClass="pm-project-card-toolbar">
                      <button class="pm-table-tool square" type="button" aria-label="Search projects"><span pmConsoleIcon="search" aria-hidden="true"></span></button>
                      <button class="pm-table-tool" type="button"><span pmConsoleIcon="filter" aria-hidden="true"></span><span>Filter</span></button>
                      <button class="pm-table-tool" type="button"><span pmConsoleIcon="sliders-horizontal" aria-hidden="true"></span><span>Group by</span></button>
                      <div class="pm-project-view-toggle" aria-label="Project display">
                        <button class="active" type="button" aria-label="Card view" aria-pressed="true" (click)="setWorkspaceDisplay('cards')"><span pmConsoleIcon="layout-grid" aria-hidden="true"></span></button>
                        <button type="button" aria-label="List view" aria-pressed="false" (click)="setWorkspaceDisplay('table')"><span pmConsoleIcon="list" aria-hidden="true"></span></button>
                      </div>
                      <button class="pm-table-tool" type="button"><span pmConsoleIcon="download" aria-hidden="true"></span><span>Export</span></button>
                      <button class="pm-table-add-project" type="button"><span pmConsoleIcon="plus" aria-hidden="true"></span><span>Add Project</span></button>
                      <button class="pm-table-tool square" type="button" aria-label="Card view settings"><span pmConsoleIcon="settings" aria-hidden="true"></span></button>
                  </app-pm-console-toolbar>
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
                    <app-pm-console-toolbar [itemLabel]="'Items: ' + visibleBenefitRegisterRows.length">
                        <button class="pm-table-tool square" type="button" aria-label="Search benefits"><span pmConsoleIcon="search" aria-hidden="true"></span></button>
                        <button class="pm-table-tool" type="button"><span pmConsoleIcon="filter" aria-hidden="true"></span><span>Filter</span></button>
                        <button class="pm-table-tool" type="button"><span pmConsoleIcon="download" aria-hidden="true"></span><span>Export</span></button>
                        <button class="pm-table-add-project" type="button"><span pmConsoleIcon="plus" aria-hidden="true"></span><span>Add Benefit</span></button>
                    </app-pm-console-toolbar>
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
                              <td><span [pmConsoleStatusPill]="benefit.realization" baseClass="pm-table-row-status" [tone]="benefit.realizationTone"></span></td>
                              <td class="pm-table-status-cell"><span [pmConsoleStatusPill]="benefit.status" baseClass="pm-table-row-status" [tone]="benefit.statusTone"></span></td>
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
                    <app-pm-console-toolbar [itemLabel]="'Items: ' + visibleRiskRegisterRows.length">
                        <button class="pm-table-tool square" type="button" aria-label="Search risks"><span pmConsoleIcon="search" aria-hidden="true"></span></button>
                        <button class="pm-table-tool" type="button"><span pmConsoleIcon="filter" aria-hidden="true"></span><span>Filter</span></button>
                        <button class="pm-table-tool" type="button"><span pmConsoleIcon="download" aria-hidden="true"></span><span>Export</span></button>
                        <button class="pm-table-add-project" type="button"><span pmConsoleIcon="plus" aria-hidden="true"></span><span>Add Risk</span></button>
                    </app-pm-console-toolbar>
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
                              <td><span [pmConsoleStatusPill]="risk.exposure" baseClass="pm-table-row-status" [tone]="risk.exposureTone"></span></td>
                              <td class="pm-table-status-cell"><span [pmConsoleStatusPill]="risk.status" baseClass="pm-table-row-status" [tone]="risk.statusTone"></span></td>
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
            [class.change-request-plan-mode]="projectPlanEntry === 'change-request'"
            [class.closure-plan-mode]="projectPlanEntry === 'closure'"
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
                      <button [class.active]="projectPlanEntry === 'stages'" type="button" (click)="setProjectPlanEntry('stages')"><span class="icon" aria-hidden="true"><i data-lucide="route"></i></span>Stages</button>
                      <button [class.active]="projectPlanEntry === 'change-request'" type="button" (click)="setProjectPlanEntry('change-request')"><span class="icon" aria-hidden="true"><i data-lucide="chart-pie"></i></span>Change requests</button>
                      <button [class.active]="projectPlanEntry === 'closure'" type="button" (click)="setProjectPlanEntry('closure')"><span class="icon" aria-hidden="true"><i data-lucide="chart-pie"></i></span>Closure</button>
                    </div>
                  </div>
                </div>
              </header>
              @if (projectPlanEntry === 'quick') {
                <div class="project-plan-shell plan-builder-shell quick-plan-shell" [class.simple-plan-shell]="projectPlanDetailMode === 'simple'" [class.detailed-plan-shell]="projectPlanDetailMode === 'detailed'">
                  <div class="project-plan-content-modebar" [class.has-section-title]="true">
                    <h2>{{ projectPlanDetailMode === 'simple' ? 'Project Plan' : projectPlanActiveSection }}</h2>
                    <div class="project-plan-detail-toggle" role="tablist" aria-label="Project plan detail mode">
                      <button [class.active]="projectPlanDetailMode === 'simple'" type="button" role="tab" [attr.aria-selected]="projectPlanDetailMode === 'simple'" (click)="setProjectPlanDetailMode('simple')">Simple view</button>
                      <button [class.active]="projectPlanDetailMode === 'detailed'" type="button" role="tab" [attr.aria-selected]="projectPlanDetailMode === 'detailed'" (click)="setProjectPlanDetailMode('detailed')">Detailed view</button>
                    </div>
                  </div>
                  @if (projectPlanDetailMode === 'detailed') {
                    <aside
                      class="project-plan-sections plan-builder-nav quick-plan-nav matrix-plan-nav"
                      [class.is-additional-expanded]="projectPlanSectionsExpanded"
                      [class.is-additional-collapsed]="!projectPlanSectionsExpanded"
                      aria-label="Project plan sections"
                    >
                      <div class="matrix-nav-group">
                        <span class="matrix-nav-label">Core Planning</span>
                        <div class="matrix-nav-list">
                          @for (section of primaryProjectPlanSections; track section) {
                            <button [class.active]="projectPlanActiveSection === section" type="button" (click)="setProjectPlanSection(section)"><span>{{ projectPlanNavLabel(section) }}</span></button>
                          }
                        </div>
                      </div>
                      <span class="matrix-nav-divider" aria-hidden="true"></span>
                      <div class="matrix-nav-group matrix-nav-actions">
                        <button
                          class="matrix-nav-heading"
                          type="button"
                          (click)="toggleProjectPlanSections()"
                          [attr.aria-expanded]="projectPlanSectionsExpanded"
                          aria-controls="project-plan-extra-sections"
                        >
                          <span class="matrix-nav-label">Additional Actions</span>
                          <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                        </button>
                        @if (projectPlanSectionsExpanded) {
                          <div id="project-plan-extra-sections" class="matrix-nav-list matrix-extra-sections">
                            @for (section of additionalProjectPlanSections; track section) {
                              <button class="detailed-only" [class.active]="projectPlanActiveSection === section" type="button" (click)="setProjectPlanSection(section)"><span>{{ projectPlanNavLabel(section) }}</span></button>
                            }
                          </div>
                        }
                      </div>
                    </aside>
                  }
                  <main class="project-plan-content plan-builder-workspace quick-plan-workspace" [class.simple-plan-workspace]="projectPlanDetailMode === 'simple'" [class.detailed-plan-workspace]="projectPlanDetailMode === 'detailed'">
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
                                        <app-pm-console-plan-table
                                          [title]="field.label"
                                          [description]="simplePlanTableConfig(field).description"
                                          [countLabel]="simplePlanTableConfig(field).rows.length + ' records'"
                                          [actionLabel]="simplePlanTableConfig(field).action"
                                          [iconName]="iconName('table')"
                                          panelClass="matrix-field-table simple-field-control wide"
                                        >
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
                                        </app-pm-console-plan-table>
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
                            @if (projectPlanActiveSection === 'Overview') {
                              <section class="overview-plan-workspace" aria-label="Overview workspace">
                                <article class="overview-form-card">
                                  <div class="overview-form-head">
                                    <div class="overview-form-title">
                                      <span class="overview-form-title-icon" aria-hidden="true">
                                        <span [pmConsoleIcon]="iconName('info')"></span>
                                      </span>
                                      <div>
                                        <h3>Case for change</h3>
                                        <p>Capture the project narrative first, then confirm the AI governance flag before moving into drivers, outcomes, and alignment.</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="overview-form-body">
                                    <label class="matrix-field wide">
                                      <span class="matrix-field-label">Opportunity or Problem Statement</span>
                                      <textarea [value]="overviewState.opportunityStatement" (input)="updateOverviewState('opportunityStatement', $any($event.target).value)"></textarea>
                                    </label>
                                    <div class="overview-form-helper">
                                      Keep this concise and readable. This is the first thing a reviewer should understand on the page.
                                    </div>
                                    <div class="overview-radio-field">
                                      <span class="matrix-field-label">AI component <b>*</b></span>
                                      <small class="matrix-field-description">Mandatory governance flag shown in every detail level.</small>
                                      <div class="overview-radio-group" role="radiogroup" aria-label="AI component">
                                        <label>
                                          <input type="radio" name="overview-ai-component" [checked]="overviewState.aiComponent === 'Yes'" (change)="updateOverviewState('aiComponent', 'Yes')" />
                                          <span>Yes</span>
                                        </label>
                                        <label>
                                          <input type="radio" name="overview-ai-component" [checked]="overviewState.aiComponent !== 'Yes'" (change)="updateOverviewState('aiComponent', 'No')" />
                                          <span>No</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </article>

                                <app-pm-console-plan-table
                                  title="Business drivers"
                                  eyebrow="Business Drivers"
                                  description="Strategic and business reasons that explain why this project needs to move forward."
                                  [countLabel]="overviewCountLabel(overviewBusinessDriverRows.length, 'driver')"
                                  actionLabel="Add business driver"
                                  actionAriaLabel="Add business driver"
                                  [iconName]="iconName('driver')"
                                  panelClass="overview-register-card"
                                  (action)="openOverviewBusinessDriverDrawer()"
                                >
                                  @if (overviewBusinessDriverRows.length) {
                                    <div class="dependency-register-table-shell">
                                      <table class="dependency-register-table overview-driver-table" aria-label="Business drivers">
                                        <thead>
                                          <tr>
                                            <th>Driver</th>
                                            <th>Source</th>
                                            <th>Priority</th>
                                            <th>Why it matters</th>
                                            <th aria-label="Actions"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of overviewBusinessDriverRows; track row.id) {
                                            <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open business driver details for ' + row.driver" (click)="openOverviewBusinessDriverDrawer(row)" (keydown.enter)="openOverviewBusinessDriverDrawer(row)" (keydown.space)="$event.preventDefault(); openOverviewBusinessDriverDrawer(row)">
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.driver }}</strong>
                                                <small>Business driver carried into the project brief</small>
                                              </td>
                                              <td>{{ row.source }}</td>
                                              <td><span [pmConsoleStatusPill]="row.priority" baseClass="schedule-priority-pill" [tone]="scheduleMilestonePriorityTone(row.priority)"></span></td>
                                              <td>{{ row.note || 'No additional note captured' }}</td>
                                              <td class="schedule-table-actions">
                                                <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + row.driver">
                                                  <button type="button" role="menuitem" (click)="openOverviewBusinessDriverDrawer(row)">
                                                    <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                                    Edit
                                                  </button>
                                                  <button class="danger" type="button" role="menuitem" (click)="removeOverviewBusinessDriver(row.id)">
                                                    <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                                    Delete
                                                  </button>
                                                </app-pm-console-row-action-menu>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state overview-empty-state">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>No business drivers linked yet</strong>
                                        <p>Add the main business reasons here so the overview does not read like an isolated request.</p>
                                      </div>
                                    </div>
                                  }
                                </app-pm-console-plan-table>

                                <app-pm-console-plan-table
                                  title="Outcomes"
                                  eyebrow="Outcome"
                                  description="Expected results and measures that define what success should look like."
                                  [countLabel]="overviewCountLabel(overviewOutcomeRows.length, 'outcome')"
                                  actionLabel="Add outcome"
                                  actionAriaLabel="Add outcome"
                                  [iconName]="iconName('outcomes')"
                                  panelClass="overview-register-card"
                                  (action)="openOverviewOutcomeDrawer()"
                                >
                                  @if (overviewOutcomeRows.length) {
                                    <div class="dependency-register-table-shell">
                                      <table class="dependency-register-table" aria-label="Outcomes">
                                        <thead>
                                          <tr>
                                            <th>Outcome</th>
                                            <th>Measure</th>
                                            <th>Owner</th>
                                            <th>Status</th>
                                            <th aria-label="Actions"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of overviewOutcomeRows; track row.id) {
                                            <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open outcome details for ' + row.outcome" (click)="openOverviewOutcomeDrawer(row)" (keydown.enter)="openOverviewOutcomeDrawer(row)" (keydown.space)="$event.preventDefault(); openOverviewOutcomeDrawer(row)">
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.outcome }}</strong>
                                                <small>Outcome visible in the project overview</small>
                                              </td>
                                              <td>{{ row.measure }}</td>
                                              <td>{{ row.owner }}</td>
                                              <td><span [pmConsoleStatusPill]="row.status" baseClass="overview-status-pill" [tone]="overviewStatusTone(row.status)"></span></td>
                                              <td class="schedule-table-actions">
                                                <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + row.outcome">
                                                  <button type="button" role="menuitem" (click)="openOverviewOutcomeDrawer(row)">
                                                    <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                                    Edit
                                                  </button>
                                                  <button class="danger" type="button" role="menuitem" (click)="removeOverviewOutcome(row.id)">
                                                    <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                                    Delete
                                                  </button>
                                                </app-pm-console-row-action-menu>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state overview-empty-state compact">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>No outcomes saved yet</strong>
                                        <p>Use at least one outcome so the project brief stays tied to measurable value.</p>
                                      </div>
                                    </div>
                                  }
                                </app-pm-console-plan-table>

                                <app-pm-console-plan-table
                                  title="Project alignment"
                                  eyebrow="Project Alignment (Objectives)"
                                  description="Connect project objectives to the strategic objectives the work is meant to support."
                                  [countLabel]="overviewCountLabel(overviewObjectiveRows.length, 'objective')"
                                  actionLabel="Add project objective"
                                  actionAriaLabel="Add project objective"
                                  [iconName]="iconName('target')"
                                  panelClass="overview-register-card overview-alignment-card"
                                  (action)="openOverviewObjectiveDrawer()"
                                >

                                  <div class="overview-alignment-summary overview-alignment-summary-simple">
                                    <div class="overview-alignment-block">
                                      <span class="matrix-field-label">Strategic objectives</span>
                                      <div class="overview-alignment-pill-list">
                                        @for (item of overviewStrategicObjectiveLinks; track item) {
                                          <span class="overview-alignment-pill">{{ item }}</span>
                                        }
                                      </div>
                                    </div>
                                    <div class="overview-alignment-block overview-plan-notes">
                                      @for (signal of overviewBusinessPlanSignals; track signal.label) {
                                        <article class="overview-plan-signal">
                                          <strong>{{ signal.label }}</strong>
                                          <p>{{ signal.body }}</p>
                                        </article>
                                      }
                                    </div>
                                  </div>

                                  @if (overviewObjectiveRows.length) {
                                    <div class="dependency-register-table-shell">
                                      <table class="dependency-register-table" aria-label="Project objectives">
                                        <thead>
                                          <tr>
                                            <th>Project objective</th>
                                            <th>Linked strategic objective</th>
                                            <th>Status</th>
                                            <th aria-label="Actions"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of overviewObjectiveRows; track row.id) {
                                            <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open project objective details for ' + row.objective" (click)="openOverviewObjectiveDrawer(row)" (keydown.enter)="openOverviewObjectiveDrawer(row)" (keydown.space)="$event.preventDefault(); openOverviewObjectiveDrawer(row)">
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.objective }}</strong>
                                                <small>Project-level objective saved in the overview</small>
                                              </td>
                                              <td>{{ row.linkedObjective }}</td>
                                              <td><span [pmConsoleStatusPill]="row.status" baseClass="overview-status-pill" [tone]="overviewStatusTone(row.status)"></span></td>
                                              <td class="schedule-table-actions">
                                                <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + row.objective">
                                                  <button type="button" role="menuitem" (click)="openOverviewObjectiveDrawer(row)">
                                                    <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                                    Edit
                                                  </button>
                                                  <button class="danger" type="button" role="menuitem" (click)="removeOverviewObjective(row.id)">
                                                    <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                                    Delete
                                                  </button>
                                                </app-pm-console-row-action-menu>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <div class="dependency-empty-state overview-empty-state compact">
                                      <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                      <div class="dependency-empty-state-copy">
                                        <strong>No project objectives linked yet</strong>
                                        <p>Add objectives here so the strategic intent becomes concrete and reviewable.</p>
                                      </div>
                                    </div>
                                  }
                                </app-pm-console-plan-table>

                                @if (activeProjectPlanHasVisibleFields && activeProjectPlanHiddenFields.length) {
                                  <button
                                    class="schedule-scope-advanced-toggle overview-advanced-toggle"
                                    [class.is-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)"
                                    type="button"
                                    (click)="toggleProjectPlanFieldSection(projectPlanActiveSection)"
                                    [attr.aria-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)"
                                  >
                                    <span [pmConsoleIcon]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection) ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                                    <span>
                                      {{ isProjectPlanFieldSectionExpanded(projectPlanActiveSection) ? 'View less' : 'View more' }}
                                      <small>(Advanced governance fields)</small>
                                    </span>
                                  </button>
                                  @if (isProjectPlanFieldSectionExpanded(projectPlanActiveSection)) {
                                    <div class="matrix-hidden-fields is-expanded">
                                      <section class="overview-hidden-stack" aria-label="Additional overview fields">
                                        <article class="overview-form-card overview-form-card-secondary">
                                          <div class="overview-form-head">
                                            <div class="overview-form-title">
                                              <span class="overview-form-title-icon" aria-hidden="true">
                                                <span [pmConsoleIcon]="iconName('sliders')"></span>
                                              </span>
                                              <div>
                                                <h3>Additional fields</h3>
                                                <p>Detailed fields that support deeper governance and architecture conversations.</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="overview-form-body">
                                            <label class="matrix-field wide">
                                              <span class="matrix-field-label">Driver for change / Analysis undertaken</span>
                                              <textarea [value]="overviewState.driverAnalysis" (input)="updateOverviewState('driverAnalysis', $any($event.target).value)"></textarea>
                                            </label>
                                          </div>
                                        </article>

                                        <app-pm-console-plan-table
                                          title="Capabilities"
                                          eyebrow="Link Capabilities"
                                          description="Capability mapping for detailed governance, architecture, or operating model alignment."
                                          [countLabel]="overviewCountLabel(overviewCapabilityRows.length, 'capability')"
                                          actionLabel="Link capabilities"
                                          actionAriaLabel="Link capabilities"
                                          [iconName]="iconName('columns')"
                                          panelClass="overview-register-card"
                                          (action)="openOverviewCapabilityDrawer()"
                                        >
                                          @if (overviewCapabilityRows.length) {
                                            <div class="dependency-register-table-shell">
                                              <table class="dependency-register-table" aria-label="Linked capabilities">
                                                <thead>
                                                  <tr>
                                                    <th>Capability</th>
                                                    <th>Domain</th>
                                                    <th>Owner</th>
                                                    <th aria-label="Actions"></th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  @for (row of overviewCapabilityRows; track row.id) {
                                                    <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open capability details for ' + row.capability" (click)="openOverviewCapabilityDrawer(row)" (keydown.enter)="openOverviewCapabilityDrawer(row)" (keydown.space)="$event.preventDefault(); openOverviewCapabilityDrawer(row)">
                                                      <td class="dependency-register-primary">
                                                        <strong>{{ row.capability }}</strong>
                                                        <small>Detailed governance mapping</small>
                                                      </td>
                                                      <td>{{ row.domain }}</td>
                                                      <td>{{ row.owner }}</td>
                                                      <td class="schedule-table-actions">
                                                        <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + row.capability">
                                                          <button type="button" role="menuitem" (click)="openOverviewCapabilityDrawer(row)">
                                                            <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                                            Edit
                                                          </button>
                                                          <button class="danger" type="button" role="menuitem" (click)="removeOverviewCapability(row.id)">
                                                            <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                                            Delete
                                                          </button>
                                                        </app-pm-console-row-action-menu>
                                                      </td>
                                                    </tr>
                                                  }
                                                </tbody>
                                              </table>
                                            </div>
                                          } @else {
                                            <div class="dependency-empty-state overview-empty-state compact">
                                              <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                              <div class="dependency-empty-state-copy">
                                                <strong>No capabilities linked yet</strong>
                                                <p>Add capabilities only when the detailed plan needs that mapping.</p>
                                              </div>
                                            </div>
                                          }
                                        </app-pm-console-plan-table>

                                        <app-pm-console-plan-table
                                          title="Services"
                                          eyebrow="Link Services"
                                          description="Service group, value stream, phase, and service mapping for the detailed layer."
                                          [countLabel]="overviewCountLabel(overviewServiceRows.length, 'service')"
                                          actionLabel="Link service"
                                          actionAriaLabel="Link service"
                                          [iconName]="iconName('store')"
                                          panelClass="overview-register-card"
                                          (action)="openOverviewServiceDrawer()"
                                        >
                                          @if (overviewServiceRows.length) {
                                            <div class="dependency-register-table-shell">
                                              <table class="dependency-register-table" aria-label="Linked services">
                                                <thead>
                                                  <tr>
                                                    <th>Service group</th>
                                                    <th>Value stream</th>
                                                    <th>Phase</th>
                                                    <th>Service</th>
                                                    <th aria-label="Actions"></th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  @for (row of overviewServiceRows; track row.id) {
                                                    <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open service details for ' + row.service" (click)="openOverviewServiceDrawer(row)" (keydown.enter)="openOverviewServiceDrawer(row)" (keydown.space)="$event.preventDefault(); openOverviewServiceDrawer(row)">
                                                      <td class="dependency-register-primary">
                                                        <strong>{{ row.serviceGroup }}</strong>
                                                        <small>Service catalogue connection</small>
                                                      </td>
                                                      <td>{{ row.valueStream }}</td>
                                                      <td>{{ row.phase }}</td>
                                                      <td>{{ row.service }}</td>
                                                      <td class="schedule-table-actions">
                                                        <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + row.service">
                                                          <button type="button" role="menuitem" (click)="openOverviewServiceDrawer(row)">
                                                            <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                                            Edit
                                                          </button>
                                                          <button class="danger" type="button" role="menuitem" (click)="removeOverviewService(row.id)">
                                                            <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                                            Delete
                                                          </button>
                                                        </app-pm-console-row-action-menu>
                                                      </td>
                                                    </tr>
                                                  }
                                                </tbody>
                                              </table>
                                            </div>
                                          } @else {
                                            <div class="dependency-empty-state overview-empty-state compact">
                                              <img src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
                                              <div class="dependency-empty-state-copy">
                                                <strong>No services linked yet</strong>
                                                <p>Add services only when the detailed plan needs service catalogue traceability.</p>
                                              </div>
                                            </div>
                                          }
                                        </app-pm-console-plan-table>
                                      </section>
                                    </div>
                                  }
                                }
                              </section>
                            } @else if (projectPlanActiveSection === 'Budget') {
                              @let plan = activeBudgetPlan;
                              @let year = activeBudgetYear;
                              <section class="budget-workspace budget-design-workspace" aria-label="Budget">
                                <article class="budget-design-card">
                                  <header class="budget-design-card-head">
                                    <div class="budget-design-title">
                                      <span class="budget-design-title-icon" aria-hidden="true">
                                        <span [pmConsoleIcon]="iconName('dollar')"></span>
                                      </span>
                                      <div>
                                        <h3>Budget Overview</h3>
                                        <p>Approved budget summary for the project. These totals give the PM a stable reference while the project budget is managed below.</p>
                                      </div>
                                    </div>
                                  </header>

                                  <section class="budget-overview-block" aria-label="Budget overview">
                                    <div class="budget-overview-summary-grid" aria-label="Budget overview totals">
                                      @for (metric of activeBudgetOverviewMetrics; track metric.label) {
                                        <article class="budget-summary-cell {{ metric.tone }}">
                                          <span>{{ metric.label }}</span>
                                          <strong>{{ metric.value }}</strong>
                                          <small>{{ metric.helper }}</small>
                                        </article>
                                      }
                                    </div>

                                    <div class="budget-table-wrap budget-overview-table-wrap">
                                      <table class="budget-table budget-overview-table" aria-label="Budget overview by fiscal year">
                                        <thead>
                                          <tr>
                                            <th>FY</th>
                                            <th>Budget</th>
                                            <th>Forecast</th>
                                            <th>Forecast Variance</th>
                                            <th>Committed (Unspent)</th>
                                            <th>Actual</th>
                                            <th>Total Committed (C + A)</th>
                                            <th>Available Budget</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of plan.years; track row.id) {
                                            <tr [class.is-selected]="row.fy === plan.selectedFy">
                                              <td>{{ row.fy }}</td>
                                              <td>{{ formatBudgetCurrency(budgetYearBaselineTotal(row)) }}</td>
                                              <td>{{ formatBudgetCurrency(budgetYearForecastTotal(row)) }}</td>
                                              <td class="budget-variance-cell {{ budgetVarianceTone(budgetYearVariance(row)) }}">
                                                <strong>{{ formatBudgetSignedCurrency(budgetYearVariance(row)) }}</strong>
                                                <small>{{ formatBudgetPercent(budgetYearVariance(row), budgetYearBaselineTotal(row)) }}</small>
                                              </td>
                                              <td>{{ formatBudgetCurrency(budgetYearCommittedTotal(row)) }}</td>
                                              <td>{{ formatBudgetCurrency(budgetYearActualTotal(row)) }}</td>
                                              <td>{{ formatBudgetCurrency(budgetYearActualTotal(row) + budgetYearCommittedTotal(row)) }}</td>
                                              <td class="budget-available-cell {{ budgetYearAvailableTotal(row) < 0 ? 'red' : 'green' }}">{{ formatBudgetCurrency(budgetYearAvailableTotal(row)) }}</td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>

                                    <button class="budget-view-less" type="button" aria-expanded="true">
                                      <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                                      <strong>View less</strong>
                                      <span>(Advanced governance fields)</span>
                                    </button>
                                  </section>

                                  @if (year) {
                                    <section class="budget-detail-card" aria-label="Project budget details">
                                      <header class="budget-project-head">
                                        <div>
                                          <h3>Project Budget <span class="icon budget-info-icon" aria-hidden="true"><i data-lucide="info"></i></span></h3>
                                          <p>Manage the selected financial year here. Baseline and forecast are the plan breakdown; actual and committed values are updated as the project runs.</p>
                                        </div>
                                        <div class="budget-project-tools">
                                          <label class="budget-fy-select">
                                            <span>FY</span>
                                            <select [value]="plan.selectedFy" (change)="selectBudgetFy($any($event.target).value)" aria-label="Current fiscal year">
                                              @for (option of budgetPlanConfig.fyOptions; track option) {
                                                <option [value]="option" [selected]="option === plan.selectedFy" [disabled]="!budgetPlanHasFy(plan, option)">{{ option }}</option>
                                              }
                                            </select>
                                          </label>
                                          <button class="budget-rules-link" data-budget-rules-trigger type="button" (click)="toggleBudgetRules()">{{ budgetPlanConfig.ruleButtonLabel }}</button>
                                        </div>
                                        @if (isBudgetRulesOpen) {
                                          <div class="budget-rules-popover budget-rules-popover-compact" data-budget-rules-popover>
                                            <div class="budget-rules-popover-head">
                                              <strong>{{ budgetPlanConfig.ruleButtonLabel }}</strong>
                                              <small>How budget values roll up and when they become locked.</small>
                                            </div>
                                            <div class="budget-rules-list">
                                              @for (rule of budgetPlanConfig.rules; track rule.title) {
                                                <article class="budget-rule-entry">
                                                  <strong>{{ rule.title }}</strong>
                                                  <p>{{ rule.body }}</p>
                                                </article>
                                              }
                                            </div>
                                          </div>
                                        }
                                      </header>

                                      <div class="budget-tab-row" role="tablist" aria-label="Budget detail views">
                                        <button type="button" role="tab" [class.is-active]="activeBudgetSubtab === 'project'" [attr.aria-selected]="activeBudgetSubtab === 'project'" (click)="selectBudgetTab('project')">Project Budget</button>
                                        <button type="button" role="tab" [class.is-active]="activeBudgetSubtab === 'funding'" [attr.aria-selected]="activeBudgetSubtab === 'funding'" (click)="selectBudgetTab('funding')">Funding Sources <span>{{ year.fundingSources.length }}</span></button>
                                        <button type="button" role="tab" [class.is-active]="activeBudgetSubtab === 'monthly'" [attr.aria-selected]="activeBudgetSubtab === 'monthly'" (click)="selectBudgetTab('monthly')">Monthly Budget</button>
                                      </div>

                                      @if (activeBudgetSubtab === 'project') {
                                        <div class="budget-tab-panel">
                                          <div class="budget-subview-head">
                                            <div>
                                              <strong>Project budget</strong>
                                              <small>Baseline, forecast, actual, committed, and available values for {{ year.fy }}</small>
                                            </div>
                                            <button class="budget-primary-action" type="button" (click)="saveBudgetChanges()">Save budget changes</button>
                                          </div>
                                          <div class="budget-table-wrap budget-detail-table-wrap">
                                            <table class="budget-table budget-project-table" aria-label="Project budget for selected fiscal year">
                                              <thead>
                                                <tr>
                                                  <th>Stream</th>
                                                  <th>FY Baseline</th>
                                                  <th>FY Forecast</th>
                                                  <th>Forecast Variance</th>
                                                  <th>Committed</th>
                                                  <th>YTD Baseline</th>
                                                  <th>YTD Actual</th>
                                                  <th>Available Budget</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                @for (row of activeBudgetBreakdownRows; track row.stream) {
                                                  <tr [class.is-total]="row.stream === 'Total'">
                                                    <th scope="row">{{ row.stream }}</th>
                                                    @if (row.stream === 'Total') {
                                                      <td>{{ formatBudgetCurrency(row.baseline) }}</td>
                                                      <td>{{ formatBudgetCurrency(row.forecast) }}</td>
                                                      <td class="budget-variance-cell {{ budgetVarianceTone(budgetStreamVariance(row)) }}">
                                                        <strong>{{ formatBudgetSignedCurrency(budgetStreamVariance(row)) }}</strong>
                                                        <small>{{ formatBudgetPercent(budgetStreamVariance(row), row.baseline) }}</small>
                                                      </td>
                                                      <td>{{ formatBudgetCurrency(row.committed) }}</td>
                                                      <td>{{ formatBudgetCurrency(row.baseline) }}</td>
                                                      <td>{{ formatBudgetCurrency(row.actual) }}</td>
                                                      <td class="budget-available-cell {{ budgetStreamAvailable(row) < 0 ? 'red' : 'green' }}">{{ formatBudgetCurrency(budgetStreamAvailable(row)) }}</td>
                                                    } @else {
                                                      <td><label class="budget-money-input"><span>SAR</span><input type="number" min="0" step="100" [value]="budgetBreakdownInputValue(row, 'baseline')" (input)="updateBudgetBreakdown(row.stream, 'baseline', $any($event.target).value)" [attr.aria-label]="row.stream + ' FY baseline'" /></label></td>
                                                      <td><label class="budget-money-input"><span>SAR</span><input type="number" min="0" step="100" [value]="budgetBreakdownInputValue(row, 'forecast')" (input)="updateBudgetBreakdown(row.stream, 'forecast', $any($event.target).value)" [attr.aria-label]="row.stream + ' FY forecast'" /></label></td>
                                                      <td class="budget-variance-cell {{ budgetVarianceTone(budgetStreamVariance(row)) }}">
                                                        <strong>{{ formatBudgetSignedCurrency(budgetStreamVariance(row)) }}</strong>
                                                        <small>{{ formatBudgetPercent(budgetStreamVariance(row), row.baseline) }}</small>
                                                      </td>
                                                      <td><label class="budget-money-input"><span>SAR</span><input type="number" min="0" step="100" [value]="budgetBreakdownInputValue(row, 'committed')" (input)="updateBudgetBreakdown(row.stream, 'committed', $any($event.target).value)" [attr.aria-label]="row.stream + ' committed'" /></label></td>
                                                      <td>{{ formatBudgetCurrency(row.baseline) }}</td>
                                                      <td><label class="budget-money-input"><span>SAR</span><input type="number" min="0" step="100" [value]="budgetBreakdownInputValue(row, 'actual')" (input)="updateBudgetBreakdown(row.stream, 'actual', $any($event.target).value)" [attr.aria-label]="row.stream + ' YTD actual'" /></label></td>
                                                      <td class="budget-available-cell {{ budgetStreamAvailable(row) < 0 ? 'red' : 'green' }}">{{ formatBudgetCurrency(budgetStreamAvailable(row)) }}</td>
                                                    }
                                                  </tr>
                                                }
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      } @else if (activeBudgetSubtab === 'funding') {
                                        <div class="budget-tab-panel">
                                          <div class="budget-subview-head">
                                            <div>
                                              <strong>{{ budgetPlanConfig.fundingTitle }}</strong>
                                              <small [ngClass]="budgetFundingCoverageTone(year)">{{ budgetFundingCoverageLabel(year) }}</small>
                                            </div>
                                            <button class="budget-primary-action" type="button" (click)="openBudgetFundingDrawer()">Add funding source</button>
                                          </div>
                                          @if (year.fundingSources.length) {
                                            <div class="budget-table-wrap budget-detail-table-wrap">
                                              <table class="budget-table budget-secondary-table" aria-label="Funding sources">
                                                <thead>
                                                  <tr>
                                                    <th>Source</th>
                                                    <th>Type</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Notes</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  @for (row of year.fundingSources; track row.id) {
                                                    <tr>
                                                      <td>{{ row.source }}</td>
                                                      <td>{{ row.type }}</td>
                                                      <td>{{ formatBudgetCurrency(row.amount) }}</td>
                                                      <td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.status === 'Confirmed' ? 'indigo' : row.status === 'Pending approval' ? 'amber' : 'neutral'"></span></td>
                                                      <td>{{ row.notes || '-' }}</td>
                                                    </tr>
                                                  }
                                                </tbody>
                                              </table>
                                            </div>
                                          } @else {
                                            <div class="budget-quiet-empty">
                                              <strong>No funding sources added</strong>
                                              <span>Add a funding source only when finance needs the FY baseline traced back to an allocation line.</span>
                                            </div>
                                          }
                                        </div>
                                      } @else {
                                        <div class="budget-tab-panel">
                                          <div class="budget-subview-head">
                                            <div>
                                              <strong>{{ budgetPlanConfig.monthlyTitle }}</strong>
                                              <small>{{ budgetMonthlyCountLabel(year) }} for {{ year.fy }}</small>
                                            </div>
                                            <button class="budget-primary-action" type="button" (click)="openBudgetMonthlyDrawer()">Edit monthly values</button>
                                          </div>
                                          <div class="budget-table-wrap budget-detail-table-wrap budget-monthly-table-wrap">
                                            <table class="budget-table budget-monthly-table" aria-label="Monthly budget for selected fiscal year">
                                              <thead>
                                                <tr>
                                                  <th>Month</th>
                                                  <th>Budget</th>
                                                  <th>Forecast</th>
                                                  <th>Committed</th>
                                                  <th>Actual</th>
                                                  <th>Actual Variance</th>
                                                  <th>Available Budget</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                @for (row of year.monthlyRows; track row.id) {
                                                  <tr>
                                                    <td>{{ row.month }}</td>
                                                    <td>{{ formatBudgetCurrency(budgetMonthlyTotal(row, 'budget')) }}</td>
                                                    <td>{{ formatBudgetCurrency(budgetMonthlyTotal(row, 'forecast')) }}</td>
                                                    <td>{{ formatBudgetCurrency(budgetMonthlyTotal(row, 'committed')) }}</td>
                                                    <td>{{ formatBudgetCurrency(budgetMonthlyTotal(row, 'actual')) }}</td>
                                                    <td class="budget-variance-cell {{ budgetVarianceTone(budgetMonthlyActualVariance(row)) }}">
                                                      <strong>{{ formatBudgetSignedCurrency(budgetMonthlyActualVariance(row)) }}</strong>
                                                      <small>{{ formatBudgetPercent(budgetMonthlyActualVariance(row), budgetMonthlyTotal(row, 'forecast')) }}</small>
                                                    </td>
                                                    <td class="budget-available-cell {{ budgetMonthlyAvailable(row) < 0 ? 'red' : 'green' }}">{{ formatBudgetCurrency(budgetMonthlyAvailable(row)) }}</td>
                                                  </tr>
                                                }
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      }
                                    </section>
                                  }
                                </article>
                              </section>
                            } @else if (projectPlanActiveSection === 'Schedule & Scope') {
                              <section class="schedule-scope-workspace schedule-scope-design-workspace" aria-label="Schedule and scope workspace">
                                <app-pm-console-plan-table
                                  title="Schedule and scope"
                                  description="Approved dates, current forecast, milestone checkpoints, and the core scope statement in one place."
                                  countLabel="0 links"
                                  actionLabel="Manage WBS"
                                  actionAriaLabel="Open WBS workspace"
                                  [actionIconName]="iconName('settings')"
                                  [iconName]="iconName('plan')"
                                  panelClass="schedule-scope-design-card"
                                  (action)="navigate('wbs')"
                                >
                                  <div class="schedule-scope-design-body">
                                    <div class="schedule-scope-design-grid" aria-label="Forecast dates">
                                      <label class="schedule-scope-design-field">
                                        <span>Forecast start date</span>
                                        <span class="schedule-scope-design-input schedule-scope-design-date">
                                          <input
                                            type="text"
                                            [value]="scheduleScopeInputDate(scheduleScopeState.forecastStart)"
                                            placeholder="DD/MM/YYYY"
                                            inputmode="numeric"
                                            autocomplete="off"
                                            aria-label="Forecast start date"
                                            (input)="updateScheduleScopeDateInput('forecastStart', $any($event.target).value)"
                                          />
                                          <span pmConsoleIcon="calendar" aria-hidden="true"></span>
                                        </span>
                                      </label>
                                      <label class="schedule-scope-design-field">
                                        <span>Forecast end date</span>
                                        <span class="schedule-scope-design-input schedule-scope-design-date">
                                          <input
                                            type="text"
                                            [value]="scheduleScopeInputDate(scheduleScopeState.forecastEnd)"
                                            placeholder="DD/MM/YYYY"
                                            inputmode="numeric"
                                            autocomplete="off"
                                            aria-label="Forecast end date"
                                            (input)="updateScheduleScopeDateInput('forecastEnd', $any($event.target).value)"
                                          />
                                          <span pmConsoleIcon="calendar" aria-hidden="true"></span>
                                        </span>
                                      </label>
                                    </div>

                                    <label class="schedule-scope-design-field schedule-scope-design-field-wide">
                                      <span>In Scope</span>
                                      <span class="schedule-scope-design-input">
                                        <input
                                          type="text"
                                          [value]="scheduleScopeState.inScope"
                                          placeholder="Start typing"
                                          aria-label="In Scope"
                                          (input)="updateScheduleScopeField('inScope', $any($event.target).value)"
                                        />
                                      </span>
                                    </label>

                                    <section class="schedule-scope-design-section" aria-label="Milestones">
                                      <div class="schedule-scope-design-section-head">
                                        <h3>Milestones</h3>
                                        <div class="schedule-scope-design-section-actions">
                                          <span class="schedule-scope-design-count">0 links</span>
                                          <button class="schedule-scope-design-add" type="button" (click)="openScheduleMilestoneDrawer()" aria-label="Add milestone">
                                            <span pmConsoleIcon="plus" aria-hidden="true"></span>
                                            Add Milestone
                                          </button>
                                        </div>
                                      </div>
                                      <div class="dependency-register-table-shell schedule-overview-table-shell schedule-scope-design-table-shell">
                                        <table class="dependency-register-table schedule-milestone-table schedule-scope-design-table" aria-label="Milestones">
                                          <thead>
                                            <tr>
                                              <th>Milestone</th>
                                              <th>Due Date</th>
                                              <th>Person Responsible</th>
                                              <th>Milestone Priority</th>
                                              <th>Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            @for (row of scheduleMilestoneRows; track row.id) {
                                              <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open milestone details for ' + row.milestone" (click)="openScheduleMilestoneDrawer(row)" (keydown.enter)="openScheduleMilestoneDrawer(row)" (keydown.space)="$event.preventDefault(); openScheduleMilestoneDrawer(row)">
                                                <td class="dependency-register-primary">
                                                  <strong>{{ row.milestone }}</strong>
                                                  <small>{{ row.note || 'No additional milestone note' }}</small>
                                                </td>
                                                <td>{{ scheduleScopeDateLabel(row.dueDate) }}</td>
                                                <td>{{ row.owner || 'Owner to confirm' }}</td>
                                                <td><span [pmConsoleStatusPill]="row.priority || 'TBD'" baseClass="schedule-priority-pill" [tone]="scheduleMilestonePriorityTone(row.priority)"></span></td>
                                                <td class="schedule-table-actions">
                                                  <button pmConsoleTableAction iconName="pencil" type="button" (click)="$event.stopPropagation(); openScheduleMilestoneDrawer(row)" [attr.aria-label]="'Edit ' + row.milestone"></button>
                                                  <button pmConsoleTableAction iconName="trash-2" actionClass="schedule-table-action danger" type="button" (click)="$event.stopPropagation(); removeScheduleMilestone(row.id)" [attr.aria-label]="'Delete ' + row.milestone"></button>
                                                </td>
                                              </tr>
                                            }
                                          </tbody>
                                        </table>
                                      </div>
                                    </section>

                                    @if (activeProjectPlanHiddenFields.length) {
                                      <button
                                        class="schedule-scope-advanced-toggle"
                                        [class.is-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)"
                                        type="button"
                                        (click)="toggleProjectPlanFieldSection(projectPlanActiveSection)"
                                        [attr.aria-expanded]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection)"
                                      >
                                        <span [pmConsoleIcon]="isProjectPlanFieldSectionExpanded(projectPlanActiveSection) ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                                        <span>
                                          {{ isProjectPlanFieldSectionExpanded(projectPlanActiveSection) ? 'View less' : 'View more' }}
                                          <small>(Advanced governance fields)</small>
                                        </span>
                                      </button>

                                      @if (isProjectPlanFieldSectionExpanded(projectPlanActiveSection)) {
                                        <div class="schedule-scope-advanced-content">
                                          <label class="schedule-scope-design-field schedule-scope-design-field-wide">
                                            <span>Out of Scope</span>
                                            <span class="schedule-scope-design-input">
                                              <input
                                                type="text"
                                                [value]="scheduleScopeState.outOfScope"
                                                placeholder="Start typing"
                                                aria-label="Out of Scope"
                                                (input)="updateScheduleScopeField('outOfScope', $any($event.target).value)"
                                              />
                                            </span>
                                          </label>

                                          <section class="schedule-scope-design-section" aria-label="End products">
                                            <div class="schedule-scope-design-section-head">
                                              <h3>End Product</h3>
                                              <div class="schedule-scope-design-section-actions">
                                                <span class="schedule-scope-design-count">0 links</span>
                                                <button class="schedule-scope-design-add" type="button" (click)="openScheduleEndProductDrawer()" aria-label="Add end product">
                                                  <span pmConsoleIcon="plus" aria-hidden="true"></span>
                                                  Add End Product
                                                </button>
                                              </div>
                                            </div>
                                            <div class="dependency-register-table-shell schedule-overview-table-shell schedule-scope-design-table-shell schedule-product-table-shell">
                                              <table class="dependency-register-table schedule-product-table schedule-scope-design-table schedule-scope-design-product-table" aria-label="End products">
                                                <thead>
                                                  <tr>
                                                    <th>Product</th>
                                                    <th>Type</th>
                                                    <th>Product Owner</th>
                                                    <th>Capability</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Budget</th>
                                                    <th>PRED</th>
                                                    <th>SUCCR</th>
                                                    <th>Actions</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  @for (row of scheduleEndProductRows; track row.id) {
                                                    <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open end product details for ' + row.product" (click)="openScheduleEndProductDrawer(row)" (keydown.enter)="openScheduleEndProductDrawer(row)" (keydown.space)="$event.preventDefault(); openScheduleEndProductDrawer(row)">
                                                      <td class="dependency-register-primary"><strong>{{ row.product }}</strong></td>
                                                      <td>{{ row.category }}</td>
                                                      <td>{{ row.owner || 'Owner to confirm' }}</td>
                                                      <td>{{ row.capability || '-' }}</td>
                                                      <td>{{ scheduleScopeDateLabel(row.startDate) }}</td>
                                                      <td>{{ scheduleScopeDateLabel(row.endDate) }}</td>
                                                      <td>{{ scheduleScopeProductBudgetTotal(row.capex, row.opex) }}</td>
                                                      <td>{{ row.predecessors.length }}</td>
                                                      <td>{{ row.successors.length }}</td>
                                                      <td class="schedule-table-actions">
                                                        <button pmConsoleTableAction iconName="pencil" type="button" (click)="$event.stopPropagation(); openScheduleEndProductDrawer(row)" [attr.aria-label]="'Edit ' + row.product"></button>
                                                        <button pmConsoleTableAction iconName="trash-2" actionClass="schedule-table-action danger" type="button" (click)="$event.stopPropagation(); removeScheduleEndProduct(row.id)" [attr.aria-label]="'Delete ' + row.product"></button>
                                                      </td>
                                                    </tr>
                                                  }
                                                </tbody>
                                              </table>
                                            </div>
                                          </section>
                                        </div>
                                      }
                                    }
                                  </div>
                                </app-pm-console-plan-table>
                              </section>
                            } @else if (projectPlanActiveSection === 'Benefits') {
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

                                @if (register.rows.length) {
                                <app-pm-console-plan-table
                                  [title]="register.title"
                                  [eyebrow]="register.fieldName + ' · Benefit tracking'"
                                  [description]="register.description"
                                  [countLabel]="benefitCountLabel(register)"
                                  [actionLabel]="register.actionLabel"
                                  actionAriaLabel="Add benefit"
                                  [iconName]="iconName('benefit')"
                                  panelClass="benefit-register-card"
                                  (action)="openBenefitDrawer()"
                                >

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
                                </app-pm-console-plan-table>
                                } @else {
                                  <app-pm-console-plan-empty-state
                                    [title]="register.title"
                                    [description]="register.description"
                                    [countLabel]="benefitCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    [actionAriaLabel]="'Add first benefit'"
                                    [iconName]="iconName('benefit')"
                                    [emptyTitle]="register.emptyTitle"
                                    [emptyBody]="register.emptyBody"
                                    (action)="openBenefitDrawer()"
                                  ></app-pm-console-plan-empty-state>
                                }
                              </section>
                            } @else if (projectPlanActiveSection === 'Risk') {
                              @let register = activeRiskPlan;
                              <section class="dependency-register-stack risk-register-stack" aria-label="Risk register">
                                @if (activeRiskProfile; as risk) {
                                  <article class="risk-profile-shell" aria-label="Risk profile">
                                    <header class="risk-profile-header">
                                      <div class="risk-profile-title">
                                        <button class="risk-profile-back" type="button" (click)="closeRiskProfile()" aria-label="Back to risk register">
                                          <span pmConsoleIcon="chevron-left" aria-hidden="true"></span>
                                        </button>
                                        <div>
                                          <span class="risk-profile-eyebrow">{{ risk.id }} · {{ risk.actualRating || 'Not rated' }}</span>
                                          <h3>{{ risk.riskName }}</h3>
                                          <small>Created on {{ riskDateLabel(risk.createdOn) }} · Owner {{ risk.owner }}</small>
                                        </div>
                                      </div>
                                      <div class="risk-profile-actions">
                                        <span [pmConsoleStatusPill]="risk.status" baseClass="dependency-register-pill" [tone]="riskStatusTone(risk.status)"></span>
                                        <button class="risk-profile-secondary" type="button">View activity</button>
                                        <button class="risk-profile-primary" type="button" (click)="saveRiskProfile()">Save</button>
                                        <button class="risk-profile-primary" type="button" (click)="completeRiskAssessment(risk.id)">Complete assessment</button>
                                      </div>
                                    </header>

                                    <div class="risk-profile-layout">
                                      <nav class="risk-profile-nav" aria-label="Risk profile sections">
                                        @for (tab of riskProfileTabs; track tab.id) {
                                          <button type="button" [class.active]="activeRiskProfileTab === tab.id" (click)="setRiskProfileTab(tab.id)">
                                            <span [pmConsoleIcon]="iconName(tab.icon)" aria-hidden="true"></span>
                                            <span>{{ tab.label }}</span>
                                          </button>
                                        }
                                      </nav>

                                      <section class="risk-profile-panel">
                                        @if (activeRiskProfileTab === 'identification') {
                                          <div class="risk-profile-form-grid">
                                            <app-pm-console-field label="Risk Status" type="select" [value]="risk.status" [options]="register.statusOptions" ariaLabel="Risk Status" fieldClass="risk-profile-field" (valueChange)="updateRiskProfileField('status', $event)" />
                                            <app-pm-console-field label="Risk Name" type="textarea" [value]="risk.riskName" placeholder="Type risk name" ariaLabel="Risk Name" fieldClass="risk-profile-field" [mandatory]="true" [wide]="true" [maxLength]="500" (valueChange)="updateRiskProfileField('riskName', $event)" />
                                            <app-pm-console-field label="Start Date" type="date" [value]="risk.startDate" ariaLabel="Start Date" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="updateRiskProfileField('startDate', $event)" />
                                            <app-pm-console-field label="End Date" type="date" [value]="risk.endDate" ariaLabel="End Date" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="updateRiskProfileField('endDate', $event)" />
                                            <app-pm-console-field label="Risk Description" type="textarea" [value]="risk.description" placeholder="Describe the risk" ariaLabel="Risk Description" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('description', $event)" />
                                            <app-pm-console-field label="Risk Category" type="select" [value]="risk.riskCategory" [options]="register.categoryOptions" ariaLabel="Risk Category" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="updateRiskProfileField('riskCategory', $event)" />
                                            <app-pm-console-field label="Strategic Risk" type="select" [value]="risk.strategicRisk" [options]="register.strategicRiskOptions" ariaLabel="Strategic Risk" fieldClass="risk-profile-field" (valueChange)="updateRiskProfileField('strategicRisk', $event)" />
                                            <app-pm-console-field label="Risk Lead" type="select" [value]="risk.lead" [options]="register.ownerOptions" ariaLabel="Risk Lead" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="updateRiskProfileField('lead', $event)" />
                                            <app-pm-console-field label="Risk Manager" type="select" [value]="risk.manager" [options]="register.ownerOptions" ariaLabel="Risk Manager" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="updateRiskProfileField('manager', $event)" />
                                          </div>
                                        } @else if (activeRiskProfileTab === 'analysis') {
                                          <div class="risk-profile-analysis">
                                            <div class="risk-profile-form-grid">
                                              <app-pm-console-field label="Impacted Objective" type="select" [value]="risk.impactedObjective" [options]="register.impactedObjectiveOptions" ariaLabel="Impacted Objective" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('impactedObjective', $event)" />
                                              <section class="risk-linked-strip wide" aria-label="Linked risks">
                                                <span class="matrix-field-label">Linked risks</span>
                                                <div>
                                                  <span>Division risks <b>0</b></span>
                                                  <span>Branch risks <b>0</b></span>
                                                  <span>Section risks <b>0</b></span>
                                                  <span>Project risks <b>{{ register.rows.length }}</b></span>
                                                  <span>Program risks <b>0</b></span>
                                                </div>
                                              </section>
                                              <app-pm-console-field label="Source" type="textarea" [value]="risk.source" placeholder="Add source" ariaLabel="Source" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('source', $event)" />
                                              <app-pm-console-field label="Consequence" type="textarea" [value]="risk.consequence" placeholder="Add consequence" ariaLabel="Consequence" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('consequence', $event)" />
                                              <section class="risk-radio-field wide" aria-label="Shared risk">
                                                <span class="matrix-field-label">Is this a shared risk?</span>
                                                <label><input type="radio" name="risk-shared-profile" [checked]="risk.sharedRisk" (change)="updateRiskProfileSharedRisk(true)" /> Yes</label>
                                                <label><input type="radio" name="risk-shared-profile" [checked]="!risk.sharedRisk" (change)="updateRiskProfileSharedRisk(false)" /> No</label>
                                              </section>
                                            </div>

                                            <section class="risk-control-card">
                                              <header>
                                                <div>
                                                  <span class="risk-profile-section-eyebrow">Control</span>
                                                  <strong>Current control view</strong>
                                                </div>
                                                <span class="dependency-register-count">{{ risk.overallControlEffectiveness }}</span>
                                              </header>
                                              <p>{{ risk.controlSummary || 'No control added yet.' }}</p>
                                              <app-pm-console-field label="Control summary" type="textarea" [value]="risk.controlSummary" placeholder="Describe the control or assurance activity" ariaLabel="Control summary" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('controlSummary', $event)" />
                                              <app-pm-console-field label="Overall Control Effectiveness" type="select" [value]="risk.overallControlEffectiveness" [options]="register.controlEffectivenessOptions" ariaLabel="Overall Control Effectiveness" fieldClass="risk-profile-field" (valueChange)="updateRiskProfileField('overallControlEffectiveness', $event)" />
                                              <app-pm-console-field label="Comment" type="textarea" [value]="risk.analysisComment" placeholder="Add analysis comments" ariaLabel="Analysis comment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('analysisComment', $event)" />
                                            </section>

                                            <div class="risk-rating-section">
                                              <div class="risk-rating-summary">
                                                <span class="risk-profile-section-eyebrow">Actual Risk Rating</span>
                                                <strong>{{ risk.actualRating || '-' }}</strong>
                                                <small>{{ risk.actualConsequence || '-' }} consequence · {{ risk.actualLikelihood || '-' }} likelihood</small>
                                              </div>
                                              <app-pm-console-risk-matrix
                                                title="Actual risk rating"
                                                description="Select the current consequence and likelihood."
                                                [likelihood]="risk.actualLikelihood"
                                                [consequence]="risk.actualConsequence"
                                                (selectionChange)="updateRiskProfileMatrix('actual', $event)"
                                              ></app-pm-console-risk-matrix>
                                            </div>
                                          </div>
                                        } @else {
                                          <div class="risk-profile-treatment">
                                            <div class="risk-profile-form-grid">
                                              <app-pm-console-field label="Treatment Approach" type="select" [value]="risk.treatmentApproach" [options]="register.treatmentApproachOptions" ariaLabel="Treatment Approach" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('treatmentApproach', $event)" />
                                              <app-pm-console-field label="Treatment Type" type="select" [value]="risk.treatmentType" [options]="register.treatmentTypeOptions" ariaLabel="Treatment Type" fieldClass="risk-profile-field" (valueChange)="updateRiskProfileField('treatmentType', $event)" />
                                              <app-pm-console-field label="Comment" type="textarea" [value]="risk.treatmentComment" placeholder="Add treatment comment" ariaLabel="Treatment comment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskProfileField('treatmentComment', $event)" />
                                            </div>

                                            <section class="risk-treatment-card">
                                              <header>
                                                <div>
                                                  <span class="risk-profile-section-eyebrow">Treatment</span>
                                                  <strong>{{ riskTreatmentCountLabel(risk.treatments) }}</strong>
                                                </div>
                                              </header>
                                              <div class="risk-treatment-compose">
                                                <app-pm-console-field label="Proposed Treatment" type="textarea" [value]="riskTreatmentDraft.treatment" placeholder="Describe the treatment action" ariaLabel="Proposed Treatment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskTreatmentDraft('treatment', $event)" />
                                                <app-pm-console-field label="Type" type="select" [value]="riskTreatmentDraft.type" [options]="register.treatmentTypeOptions" ariaLabel="Treatment Type" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('type', $event)" />
                                                <app-pm-console-field label="Category" type="select" [value]="riskTreatmentDraft.category" [options]="register.treatmentCategoryOptions" ariaLabel="Treatment Category" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('category', $event)" />
                                                <app-pm-console-field label="Owner" type="select" [value]="riskTreatmentDraft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Treatment Owner" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('owner', $event)" />
                                                <app-pm-console-field label="Manager" type="select" [value]="riskTreatmentDraft.manager" [options]="register.ownerOptions" ariaLabel="Treatment Manager" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('manager', $event)" />
                                                <app-pm-console-field label="Start Date" type="date" [value]="riskTreatmentDraft.startDate" ariaLabel="Treatment Start Date" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('startDate', $event)" />
                                                <app-pm-console-field label="End Date" type="date" [value]="riskTreatmentDraft.endDate" ariaLabel="Treatment End Date" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('endDate', $event)" />
                                                <button class="risk-profile-add-treatment" type="button" [disabled]="!canAddRiskTreatmentDraft()" (click)="addRiskTreatmentToProfile()"><span pmConsoleIcon="plus" aria-hidden="true"></span>Add treatment</button>
                                              </div>
                                              @if (risk.treatments.length) {
                                                <div class="dependency-register-table-shell risk-treatment-table-shell">
                                                  <table class="dependency-register-table risk-treatment-table" aria-label="Risk treatments">
                                                    <thead>
                                                      <tr><th>Proposed Treatment</th><th>Type</th><th>Category</th><th>Owner</th><th>Dates</th><th></th></tr>
                                                    </thead>
                                                    <tbody>
                                                      @for (treatment of risk.treatments; track treatment.id) {
                                                        <tr>
                                                          <td class="dependency-register-primary"><strong>{{ treatment.treatment }}</strong><small>{{ treatment.status }}</small></td>
                                                          <td>{{ treatment.type }}</td>
                                                          <td>{{ treatment.category }}</td>
                                                          <td>{{ treatment.owner }}</td>
                                                          <td class="dependency-register-baseline"><strong>{{ riskDateLabel(treatment.startDate) }}</strong><small>{{ riskDateLabel(treatment.endDate) }}</small></td>
                                                          <td class="schedule-table-actions">
                                                            <app-pm-console-row-action-menu ariaLabel="Treatment actions">
                                                              <button class="danger" type="button" role="menuitem" (click)="removeRiskTreatmentFromProfile(treatment.id)">
                                                                <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                                                Delete
                                                              </button>
                                                            </app-pm-console-row-action-menu>
                                                          </td>
                                                        </tr>
                                                      }
                                                    </tbody>
                                                  </table>
                                                </div>
                                              } @else {
                                                <p class="risk-profile-empty-note">No treatment added yet.</p>
                                              }
                                            </section>

                                            <div class="risk-rating-section">
                                              <div class="risk-rating-summary">
                                                <span class="risk-profile-section-eyebrow">Residual Risk Rating</span>
                                                <strong>{{ risk.residualRating || '-' }}</strong>
                                                <small>{{ risk.residualConsequence || '-' }} consequence · {{ risk.residualLikelihood || '-' }} likelihood</small>
                                              </div>
                                              <app-pm-console-risk-matrix
                                                title="Residual risk rating"
                                                description="Select the expected rating after treatment."
                                                [likelihood]="risk.residualLikelihood"
                                                [consequence]="risk.residualConsequence"
                                                (selectionChange)="updateRiskProfileMatrix('residual', $event)"
                                              ></app-pm-console-risk-matrix>
                                            </div>
                                          </div>
                                        }
                                      </section>
                                    </div>
                                  </article>
                                } @else if (register.rows.length) {
                                  <article class="risk-agent-banner" aria-label="Risk generator">
                                    <div class="risk-agent-copy">
                                      <span class="benefit-agent-eyebrow"><img src="./assets/ai-spark-star.svg" alt="" aria-hidden="true" />AI assisted</span>
                                      <strong>Risk Generator</strong>
                                      <p>Seed likely project risks from scope, schedule, stakeholders, and dependency data, then refine ownership and treatment details manually.</p>
                                    </div>
                                    <div class="benefit-agent-highlights" aria-label="Risk generator capabilities">
                                      <span>Draft risk statements</span>
                                      <span>Suggest ratings</span>
                                      <span>Recommend treatments</span>
                                    </div>
                                  </article>

                                  <app-pm-console-plan-table
                                    [title]="register.title"
                                    [eyebrow]="register.fieldName + ' · Risk tracking'"
                                    [description]="register.description"
                                    [countLabel]="riskCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    actionAriaLabel="Add risk"
                                    [iconName]="iconName('risks')"
                                    panelClass="risk-register-card"
                                    (action)="openRiskDrawer()"
                                  >
                                    <div class="dependency-register-table-shell risk-register-table-shell">
                                      <table class="dependency-register-table risk-register-table" [attr.aria-label]="register.fieldName">
                                        <thead>
                                          <tr>
                                            <th>Risk ID</th>
                                            <th>Risk Category</th>
                                            <th>Risk Name</th>
                                            <th>Strategic<br />Impact</th>
                                            <th>AR</th>
                                            <th>Treatment</th>
                                            <th>RR</th>
                                            <th>Risk Owner</th>
                                            <th>End Date</th>
                                            <th>Review<br />Due Date</th>
                                            <th>Status</th>
                                            <th aria-label="Actions"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of register.rows; track row.id) {
                                            <tr class="plan-table-clickable-row" role="button" tabindex="0" [attr.aria-label]="'Open full profile for ' + row.id" (click)="openRiskProfile(row)" (keydown.enter)="openRiskProfile(row)" (keydown.space)="$event.preventDefault(); openRiskProfile(row)">
                                              <td><span class="pm-table-code">{{ row.id }}</span></td>
                                              <td>{{ row.riskCategory }}</td>
                                              <td class="dependency-register-primary">
                                                <strong>{{ row.riskName }}</strong>
                                                <small>{{ row.description || 'No description added' }}</small>
                                              </td>
                                              <td>{{ riskStrategicLabel(row) }}</td>
                                              <td><span class="risk-rating-swatch {{ riskRatingTone(row.actualRating) }}" [attr.aria-label]="'Actual rating ' + (row.actualRating || 'not rated')"></span></td>
                                              <td>{{ row.treatments.length }}</td>
                                              <td><span class="risk-rating-swatch {{ riskRatingTone(row.residualRating) }}" [attr.aria-label]="'Residual rating ' + (row.residualRating || 'not rated')"></span></td>
                                              <td>{{ row.owner }}</td>
                                              <td>{{ riskDateLabel(row.endDate) }}</td>
                                              <td>{{ riskDateLabel(row.reviewDueDate) }}</td>
                                              <td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="riskStatusTone(row.status)"></span></td>
                                              <td class="schedule-table-actions">
                                                <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + row.id">
                                                  <button type="button" role="menuitem" (click)="openRiskProfile(row)">
                                                    <span pmConsoleIcon="panel-right-open" aria-hidden="true"></span>
                                                    Open details
                                                  </button>
                                                  <button type="button" role="menuitem" (click)="openRiskDrawer(row)">
                                                    <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                                    Edit
                                                  </button>
                                                </app-pm-console-row-action-menu>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  </app-pm-console-plan-table>
                                } @else {
                                  <app-pm-console-plan-empty-state
                                    [title]="register.title"
                                    [description]="register.description"
                                    [countLabel]="riskCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    [actionAriaLabel]="'Add risk'"
                                    [iconName]="iconName('risks')"
                                    [emptyTitle]="register.emptyTitle"
                                    [emptyBody]="register.emptyBody"
                                    (action)="openRiskDrawer()"
                                  ></app-pm-console-plan-empty-state>
                                }
                              </section>
                            } @else if (projectPlanActiveSection === 'Issues') {
                              @let register = activeIssuePlan;
                              <section class="dependency-register-stack issue-register-stack" aria-label="Issues register">
                                @if (register.rows.length) {
                                <app-pm-console-plan-table
                                  [title]="register.title"
                                  [eyebrow]="register.fieldName"
                                  [description]="register.description"
                                  [countLabel]="issueCountLabel(register)"
                                  [actionLabel]="register.actionLabel"
                                  actionAriaLabel="Add issue"
                                  [iconName]="iconName('issues')"
                                  panelClass="issue-register-card"
                                  (action)="openIssueDrawer()"
                                >

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
                                              <td class="dependency-register-status"><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="issueStatusTone(row.status)"></span></td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                </app-pm-console-plan-table>
                                } @else {
                                  <app-pm-console-plan-empty-state
                                    [title]="register.title"
                                    [description]="register.description"
                                    [countLabel]="issueCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    [actionAriaLabel]="'Add first issue'"
                                    [iconName]="iconName('issues')"
                                    [emptyTitle]="register.emptyTitle"
                                    [emptyBody]="register.emptyBody"
                                    (action)="openIssueDrawer()"
                                  ></app-pm-console-plan-empty-state>
                                }
                              </section>
                            } @else if (projectPlanActiveSection === 'Related Links') {
                              @let register = activeRelatedLinksRegister;
                              <section class="dependency-register-stack" aria-label="Related links register">
                                @if (register.rows.length) {
                                <app-pm-console-plan-table
                                  [title]="register.title"
                                  [eyebrow]="register.fieldName"
                                  [description]="register.description"
                                  [countLabel]="relatedLinksCountLabel(register)"
                                  [actionLabel]="register.actionLabel"
                                  actionAriaLabel="Add related link"
                                  [iconName]="iconName('link')"
                                  (action)="openRelatedLinksDrawer()"
                                >

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
                                </app-pm-console-plan-table>
                                } @else {
                                  <app-pm-console-plan-empty-state
                                    [title]="register.title"
                                    [description]="register.description"
                                    [countLabel]="relatedLinksCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    [actionAriaLabel]="'Add related link'"
                                    [iconName]="iconName('link')"
                                    [emptyTitle]="register.emptyTitle"
                                    [emptyBody]="register.emptyBody"
                                    (action)="openRelatedLinksDrawer()"
                                  ></app-pm-console-plan-empty-state>
                                }
                              </section>
                            } @else if (projectPlanActiveSection === 'Resource') {
                              @let register = activeResourcePlan;
                              <section class="dependency-register-stack" aria-label="Resource plan">
                                @if (register.rows.length) {
                                <app-pm-console-plan-table
                                  [title]="register.title"
                                  [eyebrow]="register.fieldName"
                                  [description]="register.description"
                                  [countLabel]="resourceCountLabel(register)"
                                  [actionLabel]="register.actionLabel"
                                  actionAriaLabel="Add resource"
                                  [iconName]="iconName('resources')"
                                  (action)="openResourceDrawer()"
                                >

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
                                </app-pm-console-plan-table>
                                } @else {
                                  <app-pm-console-plan-empty-state
                                    [title]="register.title"
                                    [description]="register.description"
                                    [countLabel]="resourceCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    [actionAriaLabel]="'Add resource'"
                                    [iconName]="iconName('resources')"
                                    [emptyTitle]="register.emptyTitle"
                                    [emptyBody]="register.emptyBody"
                                    (action)="openResourceDrawer()"
                                  ></app-pm-console-plan-empty-state>
                                }
                              </section>
                            } @else if (projectPlanActiveSection === 'Change Impact') {
                              @let register = changeImpactRegister;
                              <section class="dependency-register-stack change-impact-register-stack" aria-label="Change impact register">
                                @if (register.rows.length) {
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
                                </article>
                                } @else {
                                  <app-pm-console-plan-empty-state
                                    [title]="register.title"
                                    [description]="register.description"
                                    [countLabel]="changeImpactCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    [actionAriaLabel]="'Add change impact'"
                                    [iconName]="iconName('changeRequest')"
                                    [emptyTitle]="register.emptyTitle"
                                    [emptyBody]="register.emptyBody"
                                    (action)="openChangeImpactDrawer()"
                                  ></app-pm-console-plan-empty-state>
                                }
                              </section>
                            } @else if (projectPlanActiveSection === 'Dependency') {
                              <section class="dependency-register-stack" aria-label="Dependency registers">
                                @for (register of visibleDependencyRegisters; track register.key) {
                                  @if (register.rows.length) {
                                  <app-pm-console-plan-table
                                    [title]="register.title"
                                    [eyebrow]="register.fieldName"
                                    [description]="register.description"
                                    [countLabel]="dependencyCountLabel(register)"
                                    [actionLabel]="register.actionLabel"
                                    [actionAriaLabel]="'Add ' + register.title.toLowerCase()"
                                    [iconName]="iconName('dependencies')"
                                    (action)="openDependencyDrawer(register.key)"
                                  >

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
                                                <td class="dependency-register-status"><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="dependencyStatusTone(row.status)"></span></td>
                                              </tr>
                                            }
                                          </tbody>
                                        </table>
                                      </div>
                                  </app-pm-console-plan-table>
                                  } @else {
                                    <app-pm-console-plan-empty-state
                                      [title]="register.title"
                                      [description]="register.description"
                                      [countLabel]="dependencyCountLabel(register)"
                                      [actionLabel]="register.actionLabel"
                                      [actionAriaLabel]="'Add ' + register.title.toLowerCase()"
                                      [iconName]="iconName('dependencies')"
                                      [emptyTitle]="register.emptyTitle"
                                      [emptyBody]="register.emptyBody"
                                      (action)="openDependencyDrawer(register.key)"
                                    ></app-pm-console-plan-empty-state>
                                  }
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
                                        @if (register.rows.length) {
                                        <app-pm-console-plan-table
                                          [title]="register.title"
                                          [eyebrow]="register.fieldName + ' · Detailed only'"
                                          [description]="register.description"
                                          [countLabel]="dependencyCountLabel(register)"
                                          [actionLabel]="register.actionLabel"
                                          [actionAriaLabel]="'Add ' + register.title.toLowerCase()"
                                          [iconName]="iconName('dependencies')"
                                          (action)="openDependencyDrawer(register.key)"
                                        >

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
                                                      <td class="dependency-register-status"><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="dependencyStatusTone(row.status)"></span></td>
                                                    </tr>
                                                  }
                                                </tbody>
                                              </table>
                                            </div>
                                        </app-pm-console-plan-table>
                                        } @else {
                                          <app-pm-console-plan-empty-state
                                            [title]="register.title"
                                            [description]="register.description"
                                            [countLabel]="dependencyCountLabel(register)"
                                            [actionLabel]="register.actionLabel"
                                            [actionAriaLabel]="'Add ' + register.title.toLowerCase()"
                                            [iconName]="iconName('dependencies')"
                                            [emptyTitle]="register.emptyTitle"
                                            [emptyBody]="register.emptyBody"
                                            (action)="openDependencyDrawer(register.key)"
                                          ></app-pm-console-plan-empty-state>
                                        }
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
                                        <app-pm-console-plan-table
                                          [title]="field.field"
                                          [description]="simplePlanTableConfig(field).description"
                                          [countLabel]="simplePlanTableConfig(field).rows.length + ' records'"
                                          [actionLabel]="simplePlanTableConfig(field).action"
                                          [iconName]="iconName('table')"
                                          panelClass="matrix-field-table wide"
                                        >
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
                                        </app-pm-console-plan-table>
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
                                              <app-pm-console-plan-table
                                                [title]="field.field"
                                                eyebrow="Detailed only"
                                                [description]="simplePlanTableConfig(field).description"
                                                [countLabel]="simplePlanTableConfig(field).rows.length + ' records'"
                                                [actionLabel]="simplePlanTableConfig(field).action"
                                                [iconName]="iconName('table')"
                                                panelClass="matrix-field-table wide"
                                              >
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
                                              </app-pm-console-plan-table>
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
                @if (isBudgetDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="budgetPlanConfig.drawerTitle"
                    [eyebrow]="budgetPlanConfig.fieldName"
                    [description]="budgetPlanConfig.drawerBody"
                    [summaryLabel]="activeBudgetHasData ? budgetPlanYearCountLabel(activeBudgetPlan) : 'New FY budget'"
                    summary="Use this only when the FY baseline or forecast split needs a focused edit."
                    [submitLabel]="budgetPlanConfig.actionLabel"
                    [submitDisabled]="!canSaveBudgetYearDraft()"
                    closeAriaLabel="Close budget drawer"
                    panelClass="budget-drawer"
                    (close)="closeBudgetDrawer()"
                    (submitForm)="saveBudgetDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid budget-drawer-grid">
                      <app-pm-console-field label="Fiscal year" type="select" [value]="budgetYearDraft.fy" [options]="budgetPlanConfig.fyOptions" [placeholder]="budgetPlanConfig.fyPlaceholder" ariaLabel="Fiscal year" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateBudgetYearDraft('fy', $event)" />
                      <app-pm-console-field label="CAPEX Baseline (FY)" type="money" inputType="number" [value]="budgetYearDraft.baselineCapex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="CAPEX Baseline (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('baselineCapex', $event)" />
                      <app-pm-console-field label="OPEX Baseline (FY)" type="money" inputType="number" [value]="budgetYearDraft.baselineOpex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="OPEX Baseline (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('baselineOpex', $event)" />
                      <app-pm-console-field label="CAPEX Forecast (FY)" type="money" inputType="number" [value]="budgetYearDraft.forecastCapex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="CAPEX Forecast (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('forecastCapex', $event)" />
                      <app-pm-console-field label="OPEX Forecast (FY)" type="money" inputType="number" [value]="budgetYearDraft.forecastOpex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="OPEX Forecast (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('forecastOpex', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isBudgetFundingDrawerOpen) {
                  @let year = activeBudgetYear;
                  <app-pm-console-plan-drawer
                    [title]="budgetPlanConfig.fundingTitle"
                    [eyebrow]="budgetPlanConfig.fieldName"
                    [description]="budgetPlanConfig.fundingBody"
                    [summaryLabel]="budgetFundingSourceCountLabel(year)"
                    [summary]="year ? budgetFundingCoverageLabel(year) : 'Capture the funding source, amount, status, and notes for this fiscal year.'"
                    submitLabel="Add funding source"
                    [submitDisabled]="!canSaveBudgetFundingDraft()"
                    closeAriaLabel="Close funding sources drawer"
                    panelClass="budget-funding-drawer"
                    (close)="closeBudgetFundingDrawer()"
                    (submitForm)="saveBudgetFundingDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid budget-funding-drawer-grid">
                      <app-pm-console-field
                        label="Funding source"
                        [value]="budgetFundingSourceDraft.source"
                        [placeholder]="budgetPlanConfig.sourcePlaceholder"
                        ariaLabel="Funding source"
                        fieldClass="dependency-drawer-field"
                        [mandatory]="true"
                        [wide]="true"
                        (valueChange)="updateBudgetFundingDraft('source', $event)"
                      />
                      <app-pm-console-field
                        label="Type"
                        type="select"
                        [value]="budgetFundingSourceDraft.type"
                        [options]="budgetPlanConfig.sourceTypeOptions"
                        [placeholder]="budgetPlanConfig.sourceTypePlaceholder"
                        ariaLabel="Funding type"
                        fieldClass="dependency-drawer-field"
                        [mandatory]="true"
                        (valueChange)="updateBudgetFundingDraft('type', $event)"
                      />
                      <app-pm-console-field label="Amount" type="money" inputType="number" [value]="budgetFundingSourceDraft.amount" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="Funding amount" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetFundingDraft('amount', $event)" />
                      <app-pm-console-field
                        label="Status"
                        type="select"
                        [value]="budgetFundingSourceDraft.status"
                        [options]="budgetPlanConfig.sourceStatusOptions"
                        ariaLabel="Funding status"
                        fieldClass="dependency-drawer-field"
                        (valueChange)="updateBudgetFundingDraft('status', $event)"
                      />
                      <app-pm-console-field
                        label="Notes"
                        type="textarea"
                        [value]="budgetFundingSourceDraft.notes"
                        placeholder="Add allocation or approval notes"
                        ariaLabel="Funding notes"
                        fieldClass="dependency-drawer-field"
                        [wide]="true"
                        (valueChange)="updateBudgetFundingDraft('notes', $event)"
                      />
                    </div>
                    @if ((year?.fundingSources?.length || 0) > 0) {
                      <div planDrawerBody class="dependency-register-table-shell budget-drawer-table-shell">
                        <table class="dependency-register-table budget-secondary-table" aria-label="Saved funding sources">
                          <thead>
                            <tr>
                              <th>Source</th>
                              <th>Type</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (row of year?.fundingSources || []; track row.id) {
                              <tr>
                                <td class="dependency-register-primary">
                                  <strong>{{ row.source }}</strong>
                                  <small>{{ row.notes || 'Funding source detail' }}</small>
                                </td>
                                <td>{{ row.type }}</td>
                                <td>{{ formatBudgetCurrency(row.amount) }}</td>
                                <td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.status === 'Confirmed' ? 'indigo' : row.status === 'Pending approval' ? 'amber' : 'neutral'"></span></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                  </app-pm-console-plan-drawer>
                }
                @if (isBudgetMonthlyDrawerOpen) {
                  @let year = activeBudgetYear;
                  <app-pm-console-plan-drawer
                    [title]="budgetPlanConfig.monthlyTitle"
                    [eyebrow]="budgetPlanConfig.fieldName"
                    [description]="budgetPlanConfig.monthlyBody"
                    [summaryLabel]="year ? year.fy : budgetPlanConfig.monthlyTitle"
                    summary="Budget phasing stays visible, while forecast, actual, and committed values can be adjusted month by month with one explicit save."
                    submitLabel="Save monthly budget"
                    closeAriaLabel="Close monthly budget drawer"
                    panelClass="budget-monthly-drawer"
                    (close)="closeBudgetMonthlyDrawer()"
                    (submitForm)="saveBudgetMonthlyDrawer($event)"
                  >
                    <div planDrawerBody class="budget-month-card-list">
                      @for (row of budgetMonthlyEditorRows; track row.id) {
                        <article class="budget-month-card">
                          <div class="budget-month-card-head">
                            <div>
                              <strong>{{ row.month }}</strong>
                              <small>{{ formatBudgetCurrency(budgetMonthlyTotal(row, 'budget')) }} baseline phasing</small>
                            </div>
                            <span class="dependency-register-count">{{ formatBudgetCurrency(budgetMonthlyAvailable(row)) }} available</span>
                          </div>
                          <div class="budget-month-card-grid">
                            <article class="budget-month-stream">
                              <strong>CAPEX</strong>
                              <label><span>Budget</span><input type="number" [value]="row.capexBudget" aria-label="CAPEX budget for {{ row.month }}" disabled /></label>
                              <label><span>Forecast</span><input type="number" min="0" step="100" [value]="row.capexForecast" (input)="updateBudgetMonthlyRow(row.id, 'capexForecast', $any($event.target).value)" aria-label="CAPEX forecast for {{ row.month }}" /></label>
                              <label><span>Actual</span><input type="number" min="0" step="100" [value]="row.capexActual" (input)="updateBudgetMonthlyRow(row.id, 'capexActual', $any($event.target).value)" aria-label="CAPEX actual for {{ row.month }}" /></label>
                              <label><span>Committed</span><input type="number" min="0" step="100" [value]="row.capexCommitted" (input)="updateBudgetMonthlyRow(row.id, 'capexCommitted', $any($event.target).value)" aria-label="CAPEX committed for {{ row.month }}" /></label>
                            </article>
                            <article class="budget-month-stream">
                              <strong>OPEX</strong>
                              <label><span>Budget</span><input type="number" [value]="row.opexBudget" aria-label="OPEX budget for {{ row.month }}" disabled /></label>
                              <label><span>Forecast</span><input type="number" min="0" step="100" [value]="row.opexForecast" (input)="updateBudgetMonthlyRow(row.id, 'opexForecast', $any($event.target).value)" aria-label="OPEX forecast for {{ row.month }}" /></label>
                              <label><span>Actual</span><input type="number" min="0" step="100" [value]="row.opexActual" (input)="updateBudgetMonthlyRow(row.id, 'opexActual', $any($event.target).value)" aria-label="OPEX actual for {{ row.month }}" /></label>
                              <label><span>Committed</span><input type="number" min="0" step="100" [value]="row.opexCommitted" (input)="updateBudgetMonthlyRow(row.id, 'opexCommitted', $any($event.target).value)" aria-label="OPEX committed for {{ row.month }}" /></label>
                            </article>
                          </div>
                        </article>
                      }
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (activeBenefitDrawer; as register) {
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName + ' · AI ready'"
                    [description]="register.description"
                    [summaryLabel]="benefitCountLabel(register)"
                    summary="Capture the benefit statement first, then layer more evidence and realization commentary later through reporting."
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveBenefitDraft(register)"
                    closeAriaLabel="Close benefit drawer"
                    panelClass="benefit-drawer"
                    (close)="closeBenefitDrawer()"
                    (submitForm)="saveBenefitDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid benefit-drawer-grid">
                            <app-pm-console-field label="Benefit Type" type="select" [value]="register.draft.benefitType" [options]="register.benefitTypeOptions" [placeholder]="register.benefitTypePlaceholder" ariaLabel="Benefit Type" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('benefitType', $event)" />
                            <app-pm-console-field label="Benefit Category" type="select" [value]="register.draft.category" [options]="register.benefitCategoryOptions" [placeholder]="register.benefitCategoryPlaceholder" ariaLabel="Benefit Category" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('category', $event)" />
                            <app-pm-console-field label="Benefit Name" [value]="register.draft.benefitName" placeholder="Enter benefit name" ariaLabel="Benefit Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateBenefitDraft('benefitName', $event)" />
                            <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Enter description" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateBenefitDraft('description', $event)" />
                            <app-pm-console-field label="Benefit Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Benefit Owner" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('owner', $event)" />
                            <app-pm-console-field label="Realisation Date" type="date" [value]="register.draft.realizationDate" ariaLabel="Realisation Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateBenefitDraft('realizationDate', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (activeRiskDrawer; as register) {
                  <app-pm-console-plan-drawer
                    [title]="riskDrawerTitle"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [summaryLabel]="riskCountLabel(register)"
                    summary="Capture the quick risk record here. Use the full profile option when source, consequence, controls, and treatment detail need a richer assessment."
                    [submitLabel]="riskDrawerOpenProfileAfterSave ? 'Save risk and open profile' : editingRiskPlanId ? 'Save changes' : register.actionLabel"
                    [submitDisabled]="!canSaveRiskDraft(register)"
                    closeAriaLabel="Close risk drawer"
                    panelClass="risk-drawer"
                    (close)="closeRiskDrawer()"
                    (submitForm)="saveRiskDrawer($event)"
                  >
                    <div planDrawerBody class="risk-drawer-profile-cta" [class.is-selected]="riskDrawerOpenProfileAfterSave">
                      <div>
                        <strong>Complete risk profile</strong>
                        <small>Open Identification, Analysis, and Treatment after saving this quick risk.</small>
                      </div>
                      <button type="button" (click)="markRiskDrawerForFullProfile()">
                        <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
                        Create full profile
                      </button>
                    </div>

                    <div planDrawerBody class="risk-drawer-layout">
                      <div class="dependency-drawer-grid risk-drawer-grid">
                        <app-pm-console-field label="Risk Category" type="select" [value]="register.draft.riskCategory" [options]="register.categoryOptions" [placeholder]="register.categoryPlaceholder" ariaLabel="Risk Category" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('riskCategory', $event)" />
                        <app-pm-console-field label="Risk Status" type="select" [value]="register.draft.status" [options]="register.statusOptions" [placeholder]="register.statusPlaceholder" ariaLabel="Risk Status" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('status', $event)" />
                        <app-pm-console-field label="Risk Name" type="textarea" [value]="register.draft.riskName" placeholder="Type risk name here" ariaLabel="Risk Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" [maxLength]="500" [afterText]="riskDrawerCharacterCount + ' characters remaining'" (valueChange)="updateRiskDraft('riskName', $event)" />
                        <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Type risk description here" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateRiskDraft('description', $event)" />
                        <app-pm-console-field label="Risk Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Risk Owner" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('owner', $event)" />
                        <app-pm-console-field label="Risk Manager" type="select" [value]="register.draft.manager" [options]="register.ownerOptions" ariaLabel="Risk Manager" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('manager', $event)" />
                        <app-pm-console-field label="Start Date" type="date" [value]="register.draft.startDate" ariaLabel="Start Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('startDate', $event)" />
                        <app-pm-console-field label="End Date" type="date" [value]="register.draft.endDate" ariaLabel="End Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('endDate', $event)" />
                        <app-pm-console-field label="Actual Risk Likelihood" type="select" [value]="register.draft.actualLikelihood" [options]="register.likelihoodOptions" placeholder="Select likelihood" ariaLabel="Actual Risk Likelihood" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('actualLikelihood', $event)" />
                        <app-pm-console-field label="Actual Risk Consequence" type="select" [value]="register.draft.actualConsequence" [options]="register.consequenceOptions" placeholder="Select consequence" ariaLabel="Actual Risk Consequence" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('actualConsequence', $event)" />
                        <app-pm-console-field label="Actual Risk Rating" [value]="register.draft.actualRating || '-'" ariaLabel="Actual Risk Rating" fieldClass="dependency-drawer-field" [disabled]="true" />
                        <app-pm-console-field label="Residual Risk Likelihood" type="select" [value]="register.draft.residualLikelihood" [options]="register.likelihoodOptions" placeholder="Select likelihood" ariaLabel="Residual Risk Likelihood" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('residualLikelihood', $event)" />
                        <app-pm-console-field label="Residual Risk Consequence" type="select" [value]="register.draft.residualConsequence" [options]="register.consequenceOptions" placeholder="Select consequence" ariaLabel="Residual Risk Consequence" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('residualConsequence', $event)" />
                        <app-pm-console-field label="Residual Risk Rating" [value]="register.draft.residualRating || '-'" ariaLabel="Residual Risk Rating" fieldClass="dependency-drawer-field" [disabled]="true" />
                        <section class="risk-radio-field wide" aria-label="Enterprise wide impact">
                          <span class="matrix-field-label">Does this risk have an enterprise wide impact?</span>
                          <label><input type="radio" name="risk-enterprise-drawer" [checked]="register.draft.enterpriseImpact" (change)="updateRiskDraftEnterpriseImpact(true)" /> Yes</label>
                          <label><input type="radio" name="risk-enterprise-drawer" [checked]="!register.draft.enterpriseImpact" (change)="updateRiskDraftEnterpriseImpact(false)" /> No</label>
                        </section>
                      </div>

                      <aside class="risk-drawer-matrix-stack">
                        <app-pm-console-risk-matrix
                          title="Actual risk rating"
                          description="Click the consequence and likelihood cell."
                          [likelihood]="register.draft.actualLikelihood"
                          [consequence]="register.draft.actualConsequence"
                          [compact]="true"
                          (selectionChange)="updateRiskDraftMatrix('actual', $event)"
                        ></app-pm-console-risk-matrix>
                        <app-pm-console-risk-matrix
                          title="Residual risk rating"
                          description="Expected level after treatment."
                          [likelihood]="register.draft.residualLikelihood"
                          [consequence]="register.draft.residualConsequence"
                          [compact]="true"
                          (selectionChange)="updateRiskDraftMatrix('residual', $event)"
                        ></app-pm-console-risk-matrix>
                      </aside>
                    </div>

                    <section planDrawerBody class="risk-treatment-card risk-drawer-treatment-card">
                      <header>
                        <div>
                          <span class="risk-profile-section-eyebrow">Treatment</span>
                          <strong>{{ riskTreatmentCountLabel(register.draft.treatments) }}</strong>
                        </div>
                      </header>
                      <div class="risk-treatment-compose">
                        <app-pm-console-field label="Proposed Treatment" type="textarea" [value]="riskTreatmentDraft.treatment" placeholder="Describe the treatment action" ariaLabel="Proposed Treatment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskTreatmentDraft('treatment', $event)" />
                        <app-pm-console-field label="Type" type="select" [value]="riskTreatmentDraft.type" [options]="register.treatmentTypeOptions" ariaLabel="Treatment Type" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('type', $event)" />
                        <app-pm-console-field label="Category" type="select" [value]="riskTreatmentDraft.category" [options]="register.treatmentCategoryOptions" ariaLabel="Treatment Category" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('category', $event)" />
                        <app-pm-console-field label="Owner" type="select" [value]="riskTreatmentDraft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Treatment Owner" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('owner', $event)" />
                        <app-pm-console-field label="End Date" type="date" [value]="riskTreatmentDraft.endDate" ariaLabel="Treatment End Date" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('endDate', $event)" />
                        <button class="risk-profile-add-treatment" type="button" [disabled]="!canAddRiskTreatmentDraft()" (click)="addRiskTreatmentToDraft()"><span pmConsoleIcon="plus" aria-hidden="true"></span>Add risk treatment</button>
                      </div>
                      @if (register.draft.treatments.length) {
                        <div class="risk-treatment-pill-list">
                          @for (treatment of register.draft.treatments; track treatment.id) {
                            <span>
                              {{ treatment.treatment }}
                              <button type="button" (click)="removeRiskTreatmentFromDraft(treatment.id)" [attr.aria-label]="'Remove treatment'"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                            </span>
                          }
                        </div>
                      }
                    </section>
                  </app-pm-console-plan-drawer>
                }
                @if (isIssueDrawerOpen) {
                  @let register = activeIssuePlan;
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [summaryLabel]="issueCountLabel(register)"
                    summary="Capture the issue once with owner, dates, and the current resolution path so project reviews can see what still needs action."
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveIssueDraft(register)"
                    closeAriaLabel="Close issue drawer"
                    panelClass="issue-drawer"
                    (close)="closeIssueDrawer()"
                    (submitForm)="saveIssueDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid issue-drawer-grid">
                            <app-pm-console-field label="Issue Type" type="select" [value]="register.draft.issueType" [options]="register.issueTypeOptions" [placeholder]="register.issueTypePlaceholder" ariaLabel="Issue Type" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('issueType', $event)" />
                            <app-pm-console-field label="Criticality" type="select" [value]="register.draft.criticality" [options]="register.criticalityOptions" ariaLabel="Criticality" fieldClass="dependency-drawer-field" (valueChange)="updateIssueDraft('criticality', $event)" />
                            <app-pm-console-field label="Issue" type="textarea" [value]="register.draft.issue" placeholder="Describe the issue or blocker" ariaLabel="Issue" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateIssueDraft('issue', $event)" />
                            <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Add supporting context" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateIssueDraft('description', $event)" />
                            <app-pm-console-field label="Resolution" type="textarea" [value]="register.draft.resolution" placeholder="Describe the current resolution path" ariaLabel="Resolution" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateIssueDraft('resolution', $event)" />
                            <app-pm-console-field label="Status" type="select" [value]="register.draft.status" [options]="register.statusOptions" ariaLabel="Status" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('status', $event)" />
                            <app-pm-console-field label="Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Owner" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('owner', $event)" />
                            <app-pm-console-field label="Date Raised" type="date" [value]="register.draft.dateRaised" ariaLabel="Date Raised" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('dateRaised', $event)" />
                            <app-pm-console-field label="Due Date" type="date" [value]="register.draft.dueDate" ariaLabel="Due Date" fieldClass="dependency-drawer-field" (valueChange)="updateIssueDraft('dueDate', $event)" />
                            <app-pm-console-field label="Date Closed" type="date" [value]="register.draft.dateClosed" ariaLabel="Date Closed" fieldClass="dependency-drawer-field" (valueChange)="updateIssueDraft('dateClosed', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isRelatedLinksDrawerOpen) {
                  @let register = activeRelatedLinksRegister;
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [summaryLabel]="relatedLinksCountLabel(register)"
                    summary="Capture the document name, destination link, and a quick note once so reviewers can open evidence directly from this tab."
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveRelatedLinksDraft(register)"
                    closeAriaLabel="Close related links drawer"
                    (close)="closeRelatedLinksDrawer()"
                    (submitForm)="saveRelatedLinksDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid">
                            <app-pm-console-field label="Name" [value]="register.draft.name" [placeholder]="register.namePlaceholder" ariaLabel="Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateRelatedLinksDraft('name', $event)" />
                            <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" [placeholder]="register.descriptionPlaceholder" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateRelatedLinksDraft('description', $event)" />
                            <app-pm-console-field label="Link To Document" [value]="register.draft.documentLink" [placeholder]="register.documentPlaceholder" ariaLabel="Link To Document" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateRelatedLinksDraft('documentLink', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isResourceDrawerOpen) {
                  @let register = activeResourcePlan;
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [summaryLabel]="resourceCountLabel(register)"
                    summary="Capture the role, FTE demand, and timing once so resourcing can be reviewed directly from this section."
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveResourceDraft(register)"
                    closeAriaLabel="Close resource drawer"
                    (close)="closeResourceDrawer()"
                    (submitForm)="saveResourceDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid">
                            <app-pm-console-field label="Resource" type="select" [value]="register.draft.resource" [options]="register.resourceOptions" [placeholder]="register.resourcePlaceholder" ariaLabel="Resource" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateResourceDraft('resource', $event)" />
                            <app-pm-console-field label="Resource type" type="select" [value]="register.draft.resourceType" [options]="register.resourceTypeOptions" [placeholder]="register.resourceTypePlaceholder" ariaLabel="Resource type" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('resourceType', $event)" />
                            <app-pm-console-field label="Level of Impact" type="select" [value]="register.draft.impact" [options]="register.impactOptions" [placeholder]="register.impactPlaceholder" ariaLabel="Level of Impact" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('impact', $event)" />
                            <app-pm-console-field label="Business Unit" type="select" [value]="register.draft.businessUnit" [options]="register.businessUnitOptions" [placeholder]="register.businessUnitPlaceholder" ariaLabel="Business Unit" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('businessUnit', $event)" />
                            <app-pm-console-field label="Resources (FTE Count)" [value]="register.draft.fteCount" [placeholder]="register.ftePlaceholder" ariaLabel="Resources" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('fteCount', $event)" />
                            <app-pm-console-field label="Baseline Start Date" type="date" [value]="register.draft.baselineStart" ariaLabel="Baseline Start Date" fieldClass="dependency-drawer-field" (valueChange)="updateResourceDraft('baselineStart', $event)" />
                            <app-pm-console-field label="End Date" type="date" [value]="register.draft.baselineEnd" ariaLabel="End Date" fieldClass="dependency-drawer-field" (valueChange)="updateResourceDraft('baselineEnd', $event)" />
                            <app-pm-console-field label="Comments" type="textarea" [value]="register.draft.comments" placeholder="Type comments here" ariaLabel="Comments" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateResourceDraft('comments', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (activeChangeImpactDrawer; as register) {
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [summaryLabel]="changeImpactCountLabel(register)"
                    summary="Capture the impacted audience, the level of disruption, and the first change strategy before adoption risk starts landing in delivery."
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveChangeImpactDraft(register)"
                    closeAriaLabel="Close change impact drawer"
                    panelClass="change-impact-drawer"
                    (close)="closeChangeImpactDrawer()"
                    (submitForm)="saveChangeImpactDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid change-impact-drawer-grid">
                            <app-pm-console-field label="Change Impact Category" type="select" [value]="register.draft.category" [options]="register.categoryOptions" [placeholder]="register.categoryPlaceholder" ariaLabel="Change Impact Category" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeImpactDraft('category', $event)" />
                            <app-pm-console-field label="Stakeholder Impacted" type="select" [value]="register.draft.stakeholder" [options]="register.stakeholderOptions" [placeholder]="register.stakeholderPlaceholder" ariaLabel="Stakeholder Impacted" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeImpactDraft('stakeholder', $event)" />
                            <app-pm-console-field label="Level of Impact" type="select" [value]="register.draft.level" [options]="register.levelOptions" [placeholder]="register.levelPlaceholder" ariaLabel="Level of Impact" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeImpactDraft('level', $event)" />
                            <app-pm-console-field label="Comment" type="textarea" [value]="register.draft.comment" placeholder="Describe the impact in plain language" description="Add the business context, behavior shift, or delivery friction this impact is likely to create." ariaLabel="Comment" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" [afterText]="changeImpactCommentCharactersRemaining + ' characters remaining'" afterClass="change-impact-comment-count" (valueChange)="updateChangeImpactDraft('comment', $event)" />
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
                  </app-pm-console-plan-drawer>
                }
                @if (activeDependencyRegister; as register) {
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [summaryLabel]="dependencyCountLabel(register)"
                    summary="Add the relationship once, then manage it from the dependency table in this section."
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveDependencyDraft(register)"
                    closeAriaLabel="Close dependency drawer"
                    (close)="closeDependencyDrawer()"
                    (submitForm)="saveDependencyDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid">
                            <app-pm-console-field [label]="register.key === 'predecessor' ? 'Predecessor Project' : 'Successor Project'" type="select" [value]="register.draft.project" [options]="register.projectOptions" [placeholder]="register.projectPlaceholder" [ariaLabel]="register.key === 'predecessor' ? 'Predecessor Project' : 'Successor Project'" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('project', $event)" />
                            <app-pm-console-field label="Impact of Dependency" type="select" [value]="register.draft.impact" [options]="register.impactOptions" [placeholder]="register.impactPlaceholder" ariaLabel="Impact of Dependency" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('impact', $event)" />
                            <app-pm-console-field label="Dependent Product" type="select" [value]="register.draft.dependentProduct" [options]="register.dependentProductOptions" [placeholder]="register.dependentProductPlaceholder" ariaLabel="Dependent Product" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('dependentProduct', $event)" />
                            <app-pm-console-field label="Project Manager" [value]="register.draft.projectManager" placeholder="Type project manager name" ariaLabel="Project Manager" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('projectManager', $event)" />
                            <app-pm-console-field label="Baseline Start Date" type="date" [value]="register.draft.baselineStart" ariaLabel="Baseline Start Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('baselineStart', $event)" />
                            <app-pm-console-field label="Baseline End Date" type="date" [value]="register.draft.baselineEnd" ariaLabel="Baseline End Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('baselineEnd', $event)" />
                            <app-pm-console-field label="Nature of Dependency" type="textarea" [value]="register.draft.nature" placeholder="Describe how this dependency affects delivery" description="Explain the handoff, blocker, or downstream reliance in plain language." ariaLabel="Nature of Dependency" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateDependencyDraft('nature', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewBusinessDriverDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewDriverDrawerTitle"
                    eyebrow="Business Drivers"
                    description="Capture the strategic reason cleanly in the drawer, then come back to the register to compare all drivers at a glance."
                    [summaryLabel]="overviewCountLabel(overviewBusinessDriverRows.length, 'driver')"
                    [summary]="'Priority: ' + (overviewBusinessDriverDraft.priority || 'High')"
                    [submitLabel]="editingOverviewBusinessDriverId ? 'Save changes' : 'Add business driver'"
                    [submitDisabled]="!canSaveOverviewBusinessDriverDraft()"
                    closeAriaLabel="Close business driver drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewBusinessDriverDrawer()"
                    (submitForm)="saveOverviewBusinessDriverDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Business driver" type="select" [value]="overviewBusinessDriverDraft.driver" [options]="overviewBusinessDriverOptionLabels" placeholder="Select business driver" ariaLabel="Business driver" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateOverviewBusinessDriverDraft('driver', $event)" />
                      <app-pm-console-field label="Source" [value]="overviewBusinessDriverDraft.source" placeholder="Strategy Office" ariaLabel="Source" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewBusinessDriverDraft('source', $event)" />
                      <app-pm-console-field label="Priority" type="select" [value]="overviewBusinessDriverDraft.priority" [options]="scheduleScopePriorityOptions" ariaLabel="Priority" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewBusinessDriverDraft('priority', $event)" />
                      <app-pm-console-field label="Why it matters" type="textarea" [value]="overviewBusinessDriverDraft.note" placeholder="Add the strategic or operational reason for this driver" description="Keep this short and specific so the driver reads well in the register table." ariaLabel="Why it matters" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateOverviewBusinessDriverDraft('note', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewOutcomeDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewOutcomeDrawerTitle"
                    eyebrow="Outcome"
                    description="Move the old inline outcome form into the drawer so the page stays focused on reading, while the form stays focused on writing."
                    [summaryLabel]="overviewCountLabel(overviewOutcomeRows.length, 'outcome')"
                    [summary]="'Status: ' + (overviewOutcomeDraft.status || 'Draft')"
                    [submitLabel]="editingOverviewOutcomeId ? 'Save changes' : 'Add outcome'"
                    [submitDisabled]="!canSaveOverviewOutcomeDraft()"
                    closeAriaLabel="Close outcome drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewOutcomeDrawer()"
                    (submitForm)="saveOverviewOutcomeDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Outcome" type="textarea" [value]="overviewOutcomeDraft.outcome" placeholder="Describe the outcome users should see" ariaLabel="Outcome" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateOverviewOutcomeDraft('outcome', $event)" />
                      <app-pm-console-field label="Measure" [value]="overviewOutcomeDraft.measure" placeholder="How will this be measured?" ariaLabel="Measure" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateOverviewOutcomeDraft('measure', $event)" />
                      <app-pm-console-field label="Owner" type="select" [value]="overviewOutcomeDraft.owner" [options]="scheduleScopeOwnerOptions" placeholder="Select owner" [placeholderDisabled]="false" ariaLabel="Owner" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewOutcomeDraft('owner', $event)" />
                      <app-pm-console-field label="Status" type="select" [value]="overviewOutcomeDraft.status" [options]="overviewOutcomeStatusOptions" ariaLabel="Status" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewOutcomeDraft('status', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewObjectiveDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewObjectiveDrawerTitle"
                    eyebrow="Project Alignment (Objectives)"
                    description="Project objectives now sit in the same right-drawer pattern, with the linked strategic objective visible at the same time."
                    [summaryLabel]="overviewCountLabel(overviewObjectiveRows.length, 'objective')"
                    [summary]="'Status: ' + (overviewObjectiveDraft.status || 'Draft')"
                    [submitLabel]="editingOverviewObjectiveId ? 'Save changes' : 'Add project objective'"
                    [submitDisabled]="!canSaveOverviewObjectiveDraft()"
                    closeAriaLabel="Close project objective drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewObjectiveDrawer()"
                    (submitForm)="saveOverviewObjectiveDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Project objective" type="textarea" [value]="overviewObjectiveDraft.objective" placeholder="Describe the project objective" ariaLabel="Project objective" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateOverviewObjectiveDraft('objective', $event)" />
                      <app-pm-console-field label="Linked strategic objective" type="select" [value]="overviewObjectiveDraft.linkedObjective" [options]="overviewStrategicObjectiveLinks" ariaLabel="Linked strategic objective" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateOverviewObjectiveDraft('linkedObjective', $event)" />
                      <app-pm-console-field label="Status" type="select" [value]="overviewObjectiveDraft.status" [options]="overviewObjectiveStatusOptions" ariaLabel="Objective status" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewObjectiveDraft('status', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewCapabilityDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewCapabilityDrawerTitle"
                    eyebrow="Link Capabilities"
                    description="Keep capability mapping detailed and deliberate without forcing users to open an inline editor inside the page."
                    [summaryLabel]="overviewCountLabel(overviewCapabilityRows.length, 'capability')"
                    [summary]="overviewCountLabel(overviewSelectedCapabilityCount, 'capability') + ' selected now'"
                    [submitLabel]="editingOverviewCapabilityId ? 'Save changes' : 'Link capabilities'"
                    [submitDisabled]="!canSaveOverviewCapabilityDraft()"
                    closeAriaLabel="Close capability drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewCapabilityDrawer()"
                    (submitForm)="saveOverviewCapabilityDrawer($event)"
                  >
                    <section planDrawerBody class="schedule-drawer-section">
                      <div class="schedule-drawer-section-head">
                        <div>
                          <strong>Choose capabilities</strong>
                          <small>Select the capabilities this project influences. The register will add one row per selected capability.</small>
                        </div>
                      </div>
                      <div class="overview-capability-selector" role="group" aria-label="Capability selection">
                        @for (option of overviewCapabilityOptions; track option.capability) {
                          <label class="overview-capability-option" [class.is-selected]="overviewCapabilityDraft.selectedCapabilities.includes(option.capability)">
                            <input type="checkbox" [checked]="overviewCapabilityDraft.selectedCapabilities.includes(option.capability)" (change)="toggleOverviewCapabilitySelection(option.capability)" />
                            <span>
                              <strong>{{ option.capability }}</strong>
                              <small>{{ option.domain }} · {{ option.owner }}</small>
                            </span>
                          </label>
                        }
                      </div>
                    </section>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewServiceDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewServiceDrawerTitle"
                    eyebrow="Link Services"
                    description="Keep the service mapping flow structured, but contained, so users can complete it without losing the overview context behind the drawer."
                    [summaryLabel]="overviewCountLabel(overviewServiceRows.length, 'service')"
                    [summary]="'Selected service: ' + (overviewServiceDraft.service || 'Not chosen')"
                    [submitLabel]="editingOverviewServiceId ? 'Save changes' : 'Link service'"
                    [submitDisabled]="!canSaveOverviewServiceDraft()"
                    closeAriaLabel="Close service drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewServiceDrawer()"
                    (submitForm)="saveOverviewServiceDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Service group" type="select" [value]="overviewServiceDraft.serviceGroup" [options]="overviewServiceGroupOptions" placeholder="Select service group" ariaLabel="Service group" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateOverviewServiceDraft('serviceGroup', $event)" />
                      <app-pm-console-field label="Value stream" type="select" [value]="overviewServiceDraft.valueStream" [options]="overviewServiceValueStreamOptions" placeholder="Select value stream" ariaLabel="Value stream" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateOverviewServiceDraft('valueStream', $event)" />
                      <app-pm-console-field label="Phase" type="select" [value]="overviewServiceDraft.phase" [options]="overviewServicePhaseOptions" placeholder="Select phase" [placeholderDisabled]="false" ariaLabel="Phase" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewServiceDraft('phase', $event)" />
                      <app-pm-console-field label="Service" type="select" [value]="overviewServiceDraft.service" [options]="overviewServiceOptions" placeholder="Select service" ariaLabel="Service" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateOverviewServiceDraft('service', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isScheduleMilestoneDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="scheduleScopeMilestoneDrawerTitle"
                    eyebrow="Milestones"
                    description="Keep schedule checkpoints focused, then manage them from the register instead of expanding an inline form."
                    [summaryLabel]="scheduleScopeCountLabel(scheduleMilestoneRows.length, 'milestone')"
                    [summary]="'Due date: ' + (scheduleMilestoneDraft.dueDate ? scheduleScopeDateLabel(scheduleMilestoneDraft.dueDate) : 'Not set')"
                    [submitLabel]="editingScheduleMilestoneId ? 'Save changes' : 'Add milestone'"
                    [submitDisabled]="!canSaveScheduleMilestoneDraft()"
                    closeAriaLabel="Close milestone drawer"
                    panelClass="schedule-drawer"
                    (close)="closeScheduleMilestoneDrawer()"
                    (submitForm)="saveScheduleMilestoneDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Milestone" [value]="scheduleMilestoneDraft.milestone" placeholder="Name the milestone" ariaLabel="Milestone" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateScheduleMilestoneDraft('milestone', $event)" />
                      <app-pm-console-field label="Due date" type="date" [value]="scheduleMilestoneDraft.dueDate" ariaLabel="Due date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateScheduleMilestoneDraft('dueDate', $event)" />
                      <app-pm-console-field label="Person responsible" type="select" [value]="scheduleMilestoneDraft.owner" [options]="scheduleScopeOwnerOptions" placeholder="Select owner" [placeholderDisabled]="false" ariaLabel="Person responsible" fieldClass="dependency-drawer-field" (valueChange)="updateScheduleMilestoneDraft('owner', $event)" />
                      <app-pm-console-field label="Milestone priority" type="select" [value]="scheduleMilestoneDraft.priority" [options]="scheduleScopePriorityOptions" ariaLabel="Milestone priority" fieldClass="dependency-drawer-field" (valueChange)="updateScheduleMilestoneDraft('priority', $event)" />
                      <app-pm-console-field label="Milestone note" type="textarea" [value]="scheduleMilestoneDraft.note" placeholder="Add context, dependencies, or assumptions" description="Optional context for PMO or delivery reviewers." ariaLabel="Milestone note" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateScheduleMilestoneDraft('note', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isScheduleEndProductDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="scheduleScopeEndProductDrawerTitle"
                    eyebrow="End Product (Deliverables)"
                    description="Use the drawer for product setup, then come back to the register table for comparison and review."
                    [summaryLabel]="scheduleScopeProductBudgetTotal(scheduleEndProductDraft.capex, scheduleEndProductDraft.opex)"
                    [summary]="'Delivery timeline: ' + scheduleScopeDateRange(scheduleEndProductDraft.startDate, scheduleEndProductDraft.endDate)"
                    [submitLabel]="editingScheduleEndProductId ? 'Save changes' : 'Add end product'"
                    [submitDisabled]="!canSaveScheduleEndProductDraft()"
                    closeAriaLabel="Close end product drawer"
                    panelClass="schedule-product-drawer"
                    (close)="closeScheduleEndProductDrawer()"
                    (submitForm)="saveScheduleEndProductDrawer($event)"
                  >
                    <section planDrawerBody class="schedule-drawer-section">
                      <div class="schedule-drawer-section-head">
                        <div>
                          <strong>Product source</strong>
                          <small>Mirror the current workflow but keep it consistent with the new right-drawer pattern.</small>
                        </div>
                      </div>
                      <div class="schedule-source-toggle" role="radiogroup" aria-label="End product source">
                        <label>
                          <input type="radio" name="end-product-source" [checked]="scheduleEndProductDraft.sourceType === 'new'" (change)="setScheduleEndProductSource('new')" />
                          <span>Add product</span>
                        </label>
                        <label>
                          <input type="radio" name="end-product-source" [checked]="scheduleEndProductDraft.sourceType === 'existing'" (change)="setScheduleEndProductSource('existing')" />
                          <span>Add an existing product</span>
                        </label>
                      </div>
                    </section>

                    <div planDrawerBody class="dependency-drawer-grid">
                      @if (scheduleEndProductDraft.sourceType === 'existing') {
                        <label class="matrix-field matrix-field-select dependency-drawer-field wide">
                          <span class="matrix-field-label">Existing product <b>*</b></span>
                          <span class="matrix-select-wrap">
                            <select [value]="scheduleEndProductDraft.product" (change)="applyExistingEndProductSelection($any($event.target).value)" aria-label="Existing product">
                              <option value="" disabled>Select existing product</option>
                              @for (option of scheduleScopeExistingEndProducts; track option.product) {
                                <option [value]="option.product">{{ option.product }}</option>
                              }
                            </select>
                            <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                          </span>
                        </label>
                      } @else {
                        <label class="matrix-field dependency-drawer-field wide">
                          <span class="matrix-field-label">Product <b>*</b></span>
                          <input type="text" [value]="scheduleEndProductDraft.product" (input)="updateScheduleEndProductDraft('product', $any($event.target).value)" aria-label="Product" placeholder="Name the end product" />
                        </label>
                      }

                      <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                        <span class="matrix-field-label">Product description</span>
                        <textarea [value]="scheduleEndProductDraft.description" (input)="updateScheduleEndProductDraft('description', $any($event.target).value)" aria-label="Product description" placeholder="Describe what the product delivers"></textarea>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product owner <b>*</b></span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleEndProductDraft.owner" (change)="updateScheduleEndProductDraft('owner', $any($event.target).value)" aria-label="Product owner">
                            <option value="">Select owner</option>
                            @for (option of scheduleScopeOwnerOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product category</span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleEndProductDraft.category" (change)="updateScheduleEndProductDraft('category', $any($event.target).value)" aria-label="Product category">
                            @for (option of scheduleScopeCategoryOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field wide">
                        <span class="matrix-field-label">Capability</span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleEndProductDraft.capability" (change)="updateScheduleEndProductDraft('capability', $any($event.target).value)" aria-label="Capability">
                            <option value="">Select capability</option>
                            @for (option of scheduleScopeCapabilityOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                    </div>

                    <section planDrawerBody class="schedule-drawer-section">
                      <div class="schedule-drawer-section-head">
                        <div>
                          <strong>Timing and budget</strong>
                          <small>These are still detailed-only fields, but now they’re grouped logically instead of stacked in one long modal.</small>
                        </div>
                      </div>
                      <div class="dependency-drawer-grid">
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">Start date</span>
                          <input type="date" [value]="scheduleEndProductDraft.startDate" (input)="updateScheduleEndProductDraft('startDate', $any($event.target).value)" aria-label="Start date" />
                        </label>
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">End date</span>
                          <input type="date" [value]="scheduleEndProductDraft.endDate" (input)="updateScheduleEndProductDraft('endDate', $any($event.target).value)" aria-label="End date" />
                        </label>
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">CAPEX</span>
                          <input type="text" [value]="scheduleEndProductDraft.capex" (input)="updateScheduleEndProductDraft('capex', $any($event.target).value)" aria-label="CAPEX" placeholder="0" />
                        </label>
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">OPEX</span>
                          <input type="text" [value]="scheduleEndProductDraft.opex" (input)="updateScheduleEndProductDraft('opex', $any($event.target).value)" aria-label="OPEX" placeholder="0" />
                        </label>
                      </div>
                    </section>

                    <section planDrawerBody class="schedule-drawer-section">
                      <div class="schedule-drawer-section-head">
                        <div>
                          <strong>Delivery links</strong>
                          <small>Keep predecessor and successor relationships close to the product instead of pushing them into a separate modal context.</small>
                        </div>
                      </div>
                      <div class="dependency-drawer-grid">
                        <label class="matrix-field dependency-drawer-field wide">
                          <span class="matrix-field-label">Predecessors</span>
                          <input type="text" [value]="scheduleEndProductDraft.predecessors" (input)="updateScheduleEndProductDraft('predecessors', $any($event.target).value)" aria-label="Predecessors" placeholder="Comma-separated linked projects" />
                        </label>
                        <label class="matrix-field dependency-drawer-field wide">
                          <span class="matrix-field-label">Successors</span>
                          <input type="text" [value]="scheduleEndProductDraft.successors" (input)="updateScheduleEndProductDraft('successors', $any($event.target).value)" aria-label="Successors" placeholder="Comma-separated linked projects" />
                        </label>
                      </div>
                    </section>
                  </app-pm-console-plan-drawer>
                }
                @if (isScheduleManagementProductDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="scheduleScopeManagementProductDrawerTitle"
                    eyebrow="Management Product"
                    description="Keep governance artefacts in the same drawer pattern so the experience stays consistent across the whole Schedule & Scope tab."
                    [summaryLabel]="scheduleScopeProductBudgetTotal(scheduleManagementProductDraft.capex, scheduleManagementProductDraft.opex)"
                    [summary]="'Timeline: ' + scheduleScopeDateRange(scheduleManagementProductDraft.startDate, scheduleManagementProductDraft.endDate)"
                    [submitLabel]="editingScheduleManagementProductId ? 'Save changes' : 'Add management product'"
                    [submitDisabled]="!canSaveScheduleManagementProductDraft()"
                    closeAriaLabel="Close management product drawer"
                    panelClass="schedule-drawer"
                    (close)="closeScheduleManagementProductDrawer()"
                    (submitForm)="saveScheduleManagementProductDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <label class="matrix-field dependency-drawer-field wide">
                        <span class="matrix-field-label">Product <b>*</b></span>
                        <input type="text" [value]="scheduleManagementProductDraft.product" (input)="updateScheduleManagementProductDraft('product', $any($event.target).value)" aria-label="Product" placeholder="Name the management product" />
                      </label>
                      <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                        <span class="matrix-field-label">Product description</span>
                        <textarea [value]="scheduleManagementProductDraft.description" (input)="updateScheduleManagementProductDraft('description', $any($event.target).value)" aria-label="Product description" placeholder="Describe the governance artefact"></textarea>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product owner <b>*</b></span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleManagementProductDraft.owner" (change)="updateScheduleManagementProductDraft('owner', $any($event.target).value)" aria-label="Product owner">
                            <option value="">Select owner</option>
                            @for (option of scheduleScopeOwnerOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product category</span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleManagementProductDraft.category" (change)="updateScheduleManagementProductDraft('category', $any($event.target).value)" aria-label="Product category">
                            @for (option of scheduleScopeCategoryOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">Start date</span>
                        <input type="date" [value]="scheduleManagementProductDraft.startDate" (input)="updateScheduleManagementProductDraft('startDate', $any($event.target).value)" aria-label="Start date" />
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">End date</span>
                        <input type="date" [value]="scheduleManagementProductDraft.endDate" (input)="updateScheduleManagementProductDraft('endDate', $any($event.target).value)" aria-label="End date" />
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">CAPEX</span>
                        <input type="text" [value]="scheduleManagementProductDraft.capex" (input)="updateScheduleManagementProductDraft('capex', $any($event.target).value)" aria-label="CAPEX" placeholder="0" />
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">OPEX</span>
                        <input type="text" [value]="scheduleManagementProductDraft.opex" (input)="updateScheduleManagementProductDraft('opex', $any($event.target).value)" aria-label="OPEX" placeholder="0" />
                      </label>
                    </div>
                  </app-pm-console-plan-drawer>
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
              } @else if (projectPlanEntry === 'stages') {
                @let activeStage = projectPlanActiveStageRow;
                @let nextStage = projectPlanNextStageRow;
                <div class="project-plan-shell plan-builder-shell quick-plan-shell project-report-shell project-reports-shell project-stages-shell">
                  <main class="project-plan-content plan-builder-workspace quick-plan-workspace project-report-workspace project-stages-workspace">
                    <section class="project-stages-surface" [attr.aria-label]="scopedProjectName + ' stage roadmap'">
                      <div class="project-stages-roadmap-band">
                        <div class="project-stages-head">
                          <div>
                            <span class="project-stages-kicker">Stage roadmap</span>
                            <h2>{{ scopedProjectName }}</h2>
                            <p>Track every project stage, planned dates, PMO gate status, and the next handoff action from one place.</p>
                          </div>
                          <div class="project-stages-active-summary {{ activeStage.statusTone }}">
                            <span>Active stage</span>
                            <strong>{{ activeStage.stage.label }}</strong>
                            <small>{{ activeStage.statusLabel }} · {{ activeStage.startDate }} - {{ activeStage.endDate }}</small>
                          </div>
                        </div>

                        <div class="project-stages-progress-panel">
                          <div class="project-stages-progress-copy">
                            <span>{{ projectPlanApprovedStageCount }} of {{ projectPlanStageRows.length }} gates approved</span>
                            <strong>{{ activeStage.stage.gate }}</strong>
                            <small>{{ projectPlanStageReadinessLabel }}</small>
                          </div>
                          <div class="project-stages-progress-track" aria-hidden="true">
                            <span [style.width]="projectPlanStageProgressWidth"></span>
                          </div>
                        </div>

                        <div class="project-stage-roadmap" [style.--stage-count]="projectPlanStageRows.length">
                          @for (row of projectPlanStageRows; track row.stage.id) {
                            <article class="project-stage-node {{ row.statusTone }}" [class.is-active]="row.stageIndex === activeStage.stageIndex" [class.is-disabled]="row.actionDisabled">
                              <div class="project-stage-node-top">
                                <span class="project-stage-number">{{ row.stageIndex + 1 }}</span>
                                <span class="project-stage-status-pill {{ row.statusTone }}">{{ row.statusLabel }}</span>
                              </div>
                              <h3>{{ row.stage.label }}</h3>
                              <div class="project-stage-dates" aria-label="Planned stage dates">
                                <span><small>Planned start</small><strong>{{ row.startDate }}</strong></span>
                                <span><small>Planned end</small><strong>{{ row.endDate }}</strong></span>
                              </div>
                              <div class="project-stage-node-footer">
                                <button class="project-stage-action-button {{ row.statusTone }}" type="button" (click)="handleProjectPlanStageAction(row)" [disabled]="row.actionDisabled">
                                  <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(row.actionIcon)"></i></span>
                                  <span>{{ row.actionLabel }}</span>
                                </button>
                                @if (row.canRevoke) {
                                  <button class="project-stage-revoke-button" type="button" (click)="openStageRevoke(row)" [attr.aria-label]="'Revoke ' + row.stage.label + ' stage approval'">
                                    <span class="icon" aria-hidden="true"><i data-lucide="rotate-ccw"></i></span>
                                    <span>Revoke</span>
                                  </button>
                                }
                              </div>
                            </article>
                          }
                        </div>
                      </div>

                      <aside class="project-stages-handoff-panel">
                        <div class="project-stages-handoff-card {{ activeStage.statusTone }}">
                          <span class="project-stages-handoff-icon" aria-hidden="true"><span class="icon"><i data-lucide="clipboard-check"></i></span></span>
                          <div>
                            <span>Next PMO handoff</span>
                            <h3>{{ activeStage.stage.gate }}</h3>
                            <p>{{ nextStage ? 'Complete the gate checklist and submit to PMO before moving into ' + nextStage.stage.label + '.' : 'Complete closure gate approval before project close-out.' }}</p>
                          </div>
                          <button type="button" (click)="handleProjectPlanStageAction(activeStage)" [disabled]="activeStage.actionDisabled">
                            <span>{{ activeStage.actionLabel }}</span>
                            <span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                          </button>
                        </div>

                        <div class="project-stages-mini-list project-stages-workflow-card">
                          <div class="project-stages-workflow-head">
                            <span>Gate workflow</span>
                            <strong>{{ projectPlanWorkflowPositionLabel }}</strong>
                          </div>
                          <ol class="project-stages-workflow-steps">
                            <li class="project-workflow-step" [class.current]="activeStage.status === 'current'" [class.complete]="activeStage.status === 'submitted' || activeStage.status === 'complete'">
                              <i aria-hidden="true"><span class="icon"><i [attr.data-lucide]="activeStage.status === 'current' ? 'map-pin' : 'check'"></i></span></i>
                              <div>
                                <span>{{ activeStage.status === 'current' ? 'You are here' : 'Done' }}</span>
                                <strong>Complete formalities</strong>
                                <small>Checklist and evidence prepared</small>
                              </div>
                            </li>
                            <li class="project-workflow-step" [class.current]="activeStage.status === 'submitted'" [class.complete]="activeStage.status === 'complete'" [class.pending]="activeStage.status === 'current'">
                              <i aria-hidden="true"><span class="icon"><i [attr.data-lucide]="activeStage.status === 'submitted' ? 'hourglass' : activeStage.status === 'complete' ? 'check' : 'send'"></i></span></i>
                              <div>
                                <span>{{ activeStage.status === 'submitted' ? 'You are here' : activeStage.status === 'complete' ? 'Done' : 'Next' }}</span>
                                <strong>Submitted to PMO</strong>
                                <small>Gate waits for PMO review</small>
                              </div>
                            </li>
                            <li class="project-workflow-step" [class.current]="activeStage.status === 'complete'" [class.pending]="activeStage.status !== 'complete'">
                              <i aria-hidden="true"><span class="icon"><i [attr.data-lucide]="activeStage.status === 'complete' ? 'check' : 'badge-check'"></i></span></i>
                              <div>
                                <span>{{ activeStage.status === 'complete' ? 'You are here' : 'Final step' }}</span>
                                <strong>Approved by PMO</strong>
                                <small>Project moves to the next stage</small>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </aside>
                    </section>
                  </main>
                </div>
              } @else if (projectPlanEntry === 'change-request') {
                <div class="project-plan-shell plan-builder-shell quick-plan-shell project-secondary-shell change-request-shell">
                  <main class="project-plan-content plan-builder-workspace quick-plan-workspace project-report-workspace project-secondary-workspace change-request-workspace">
                    <section class="change-request-surface" [attr.aria-label]="scopedProjectName + ' change requests'">
                      <div class="change-request-board">
                        <div class="pm-project-table-stats change-request-stats" aria-label="Change request summary">
                          @for (metric of changeRequestMetrics; track metric.label) {
                            <article class="pm-project-table-stat change-request-stat {{ metric.tone }}">
                              <span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(metric.icon)"></i></span></span>
                              <div><small>{{ metric.label }}</small><strong>{{ metric.value }}</strong></div>
                            </article>
                          }
                        </div>

                        <app-pm-console-toolbar toolbarClass="change-request-table-toolbar">
                          <nav toolbarLabel class="change-request-tabs change-request-toolbar-tabs" role="tablist" aria-label="Change request status">
                            @for (tab of changeRequestTabs; track tab.id) {
                              <button
                                type="button"
                                role="tab"
                                [class.active]="changeRequestStatusFilter === tab.id"
                                [attr.aria-selected]="changeRequestStatusFilter === tab.id"
                                (click)="setChangeRequestStatusFilter(tab.id)"
                              >
                                <span>{{ tab.label }}</span>
                                <strong>{{ tab.count }}</strong>
                              </button>
                            }
                          </nav>
                          <button class="pm-table-tool square" type="button" aria-label="Search change requests"><span pmConsoleIcon="search" aria-hidden="true"></span></button>
                          <button class="pm-table-tool" type="button"><span pmConsoleIcon="filter" aria-hidden="true"></span><span>Filter</span></button>
                          <button class="pm-table-tool" type="button"><span pmConsoleIcon="download" aria-hidden="true"></span><span>Export</span></button>
                          <button class="pm-table-add-project" type="button" (click)="openChangeRequestDrawer()"><span pmConsoleIcon="plus" aria-hidden="true"></span><span>Add new</span></button>
                        </app-pm-console-toolbar>

                        <div class="pm-project-table-scroll change-request-table-scroll" tabindex="0">
                          <table class="pm-project-table change-request-table" aria-label="Project change requests">
                            <thead>
                              <tr>
                                <th>PCR Number</th>
                                <th>Type</th>
                                <th>Created Date</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th aria-label="View"></th>
                                <th aria-label="Edit"></th>
                                <th aria-label="Delete"></th>
                                <th aria-label="Print"></th>
                              </tr>
                            </thead>
                            <tbody>
                              @for (row of visibleChangeRequestRows; track row.id) {
                                <tr>
                                  <td><button class="change-request-code" type="button" (click)="openChangeRequestDrawer(row)">{{ row.pcrNumber }}</button></td>
                                  <td>
                                    <span class="change-request-type-list">
                                      @for (type of row.types; track type) {
                                        <span>{{ type }}</span>
                                      }
                                    </span>
                                  </td>
                                  <td>{{ changeRequestDateLabel(row.createdDate) }}</td>
                                  <td>
                                    <span class="change-request-due" [class.is-overdue]="isOverdueChangeRequest(row)">
                                      {{ changeRequestDateLabel(row.dueDate) }}
                                    </span>
                                  </td>
                                  <td><span class="change-request-priority {{ changeRequestPriorityTone(row.priority) }}">{{ row.priority }}</span></td>
                                  <td><span [pmConsoleStatusPill]="row.status" baseClass="pm-table-row-status" [tone]="changeRequestStatusTone(row.status)"></span></td>
                                  <td class="change-request-action-cell"><button pmConsoleTableAction iconName="eye" type="button" (click)="openChangeRequestDrawer(row)" [attr.aria-label]="'View ' + row.pcrNumber"></button></td>
                                  <td class="change-request-action-cell"><button pmConsoleTableAction iconName="pencil" type="button" (click)="openChangeRequestDrawer(row)" [attr.aria-label]="'Edit ' + row.pcrNumber"></button></td>
                                  <td class="change-request-action-cell"><button pmConsoleTableAction iconName="trash-2" actionClass="schedule-table-action danger" type="button" (click)="removeChangeRequest(row.id)" [attr.aria-label]="'Delete ' + row.pcrNumber"></button></td>
                                  <td class="change-request-action-cell"><button pmConsoleTableAction iconName="printer" type="button" [attr.aria-label]="'Print ' + row.pcrNumber"></button></td>
                                </tr>
                              } @empty {
                                <tr>
                                  <td colspan="10">
                                    <div class="change-request-empty">
                                      <strong>No change requests in this view</strong>
                                      <span>Create a change request or switch status tabs to review older PCRs.</span>
                                    </div>
                                  </td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>

                    @if (isChangeRequestDrawerOpen) {
                      <app-pm-console-plan-drawer
                        [title]="changeRequestDrawerTitle"
                        eyebrow="Project change request"
                        description="Create a single PCR with overview, impact assessment, and evidence links in one side drawer."
                        [summaryLabel]="changeRequestDrawerSummary"
                        summary="Save the request as a draft, then submit it to PMO once the impact tabs and supporting links are ready."
                        [submitLabel]="editingChangeRequestId ? 'Save request' : 'Create request'"
                        [submitDisabled]="!canSaveChangeRequestDraft()"
                        closeAriaLabel="Close change request drawer"
                        panelClass="change-request-drawer"
                        (close)="closeChangeRequestDrawer()"
                        (submitForm)="saveChangeRequestDrawer($event)"
                      >
                        <div planDrawerBody class="change-request-drawer-body">
                          <nav class="change-request-drawer-nav" role="tablist" aria-label="Change request drawer sections">
                            @for (tab of changeRequestDrawerTabs; track tab.id) {
                              <button
                                type="button"
                                role="tab"
                                [class.active]="changeRequestDrawerTab === tab.id"
                                [attr.aria-selected]="changeRequestDrawerTab === tab.id"
                                (click)="setChangeRequestDrawerTab(tab.id)"
                              >
                                <span [pmConsoleIcon]="iconName(tab.icon)" aria-hidden="true"></span>
                                <span>{{ tab.label }}</span>
                              </button>
                            }
                          </nav>

                          @if (changeRequestDrawerTab === 'overview') {
                            <section class="change-request-drawer-section" aria-label="Change request overview">
                              <div class="change-request-context-grid">
                                <div>
                                  <span>Project</span>
                                  <strong>{{ changeRequestDraft.project }}</strong>
                                </div>
                                <div>
                                  <span>PMO</span>
                                  <strong>{{ changeRequestDraft.pmo }}</strong>
                                </div>
                              </div>

                              <div class="dependency-drawer-grid change-request-overview-grid">
                                <app-pm-console-field label="Due Date" type="date" [value]="changeRequestDraft.dueDate" ariaLabel="Due Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeRequestDraft('dueDate', $event)" />
                                <app-pm-console-field label="Trigger" type="select" [value]="changeRequestDraft.trigger" [options]="changeRequestTriggerOptions" placeholder="Select trigger" ariaLabel="Trigger" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeRequestDraft('trigger', $event)" />

                                <section class="change-request-choice-card wide" aria-label="Priority">
                                  <span class="matrix-field-label">Priority <b>*</b></span>
                                  <div class="change-request-radio-row">
                                    @for (priority of changeRequestPriorityOptions; track priority) {
                                      <label>
                                        <input type="radio" name="change-request-priority" [checked]="changeRequestDraft.priority === priority" (change)="updateChangeRequestDraft('priority', priority)" />
                                        <span>{{ priority }}</span>
                                      </label>
                                    }
                                  </div>
                                </section>

                                <section class="change-request-choice-card wide" aria-label="Change request type">
                                  <span class="matrix-field-label">Type of change <b>*</b></span>
                                  <div class="change-request-type-options">
                                    @for (type of changeRequestTypeOptions; track type) {
                                      <label [class.active]="isChangeRequestTypeSelected(type)">
                                        <input type="checkbox" [checked]="isChangeRequestTypeSelected(type)" (change)="toggleChangeRequestType(type, $any($event.target).checked)" />
                                        <span>{{ type }}</span>
                                      </label>
                                    }
                                  </div>
                                </section>

                                <app-pm-console-field label="Change Details" type="textarea" [value]="changeRequestDraft.changeDetails" placeholder="Describe the requested change" ariaLabel="Change Details" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" [afterText]="changeRequestCommentCharactersRemaining + ' characters remaining'" afterClass="change-impact-comment-count" (valueChange)="updateChangeRequestDraft('changeDetails', $event)" />
                                <app-pm-console-field label="Business Justification" type="textarea" [value]="changeRequestDraft.businessJustification" placeholder="Explain why the project needs this change" ariaLabel="Business Justification" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('businessJustification', $event)" />
                                <app-pm-console-field label="Risk / Impact of Change" type="textarea" [value]="changeRequestDraft.riskImpact" placeholder="Summarize delivery, governance, and adoption risk" ariaLabel="Risk / Impact of Change" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('riskImpact', $event)" />
                                <app-pm-console-field label="Release(s) Impacted" type="textarea" [value]="changeRequestDraft.releasesImpacted" placeholder="List impacted releases or governance packs" ariaLabel="Releases Impacted" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('releasesImpacted', $event)" />
                              </div>
                            </section>
                          } @else if (changeRequestDrawerTab === 'impact') {
                            <section class="change-request-drawer-section" aria-label="Impact assessment">
                              <div class="dependency-drawer-grid change-request-impact-fields">
                                <app-pm-console-field label="Impact to Resource" type="textarea" [value]="changeRequestDraft.impactToResource" placeholder="Describe resource impact" ariaLabel="Impact to Resource" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('impactToResource', $event)" />
                                <app-pm-console-field label="Impact to Quality" type="textarea" [value]="changeRequestDraft.impactToQuality" placeholder="Describe quality impact" ariaLabel="Impact to Quality" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('impactToQuality', $event)" />
                              </div>

                              <div class="change-request-impact-tabs" role="tablist" aria-label="Impact assessment tables">
                                @for (tab of changeRequestImpactTabs; track tab.id) {
                                  <button type="button" role="tab" [class.active]="changeRequestImpactTab === tab.id" [attr.aria-selected]="changeRequestImpactTab === tab.id" (click)="setChangeRequestImpactTab(tab.id)">{{ tab.label }}</button>
                                }
                              </div>

                              @if (changeRequestImpactTab === 'benefits') {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table" aria-label="Impacted benefits">
                                    <thead><tr><th>End Benefit</th><th>Benefit Profile</th><th>Benefit Owner</th><th>Product</th></tr></thead>
                                    <tbody>
                                      @for (row of changeRequestImpactBenefits; track row.benefit) {
                                        <tr><td class="dependency-register-primary"><strong>{{ row.benefit }}</strong></td><td>{{ row.profile }}</td><td>{{ row.owner }}</td><td>{{ row.product }}</td></tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              } @else if (changeRequestImpactTab === 'capabilities') {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table" aria-label="Impacted capabilities">
                                    <thead><tr><th>Capability Group Name</th><th>Capability Name</th><th>Capability Manager</th><th>Products</th></tr></thead>
                                    <tbody>
                                      @for (row of changeRequestImpactCapabilities; track row.group + row.capability) {
                                        <tr><td>{{ row.group }}</td><td class="dependency-register-primary"><strong>{{ row.capability }}</strong></td><td>{{ row.manager }}</td><td>{{ row.products }}</td></tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              } @else {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table change-request-project-impact-table" aria-label="Impacted projects and products">
                                    <thead><tr><th>Impacted Project</th><th>Project Manager</th><th>Products</th></tr></thead>
                                    <tbody>
                                      @for (row of changeRequestImpactProjects; track row.project) {
                                        <tr>
                                          <td class="dependency-register-primary"><strong>{{ row.project }}</strong></td>
                                          <td>{{ row.manager }}</td>
                                          <td>
                                            <ul class="change-request-product-list">
                                              @for (product of row.products; track product) {
                                                <li>{{ product }}</li>
                                              }
                                            </ul>
                                          </td>
                                        </tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              }
                            </section>
                          } @else {
                            <section class="change-request-drawer-section" aria-label="Related links">
                              <div class="dependency-drawer-grid change-request-link-grid">
                                <app-pm-console-field label="Name" [value]="changeRequestDraft.relatedLinkName" placeholder="Enter link name" ariaLabel="Related link name" fieldClass="dependency-drawer-field" (valueChange)="updateChangeRequestRelatedLinkDraft('relatedLinkName', $event)" />
                                <app-pm-console-field label="Link To Document" [value]="changeRequestDraft.relatedLinkUrl" placeholder="Paste document link" ariaLabel="Related link document" fieldClass="dependency-drawer-field" (valueChange)="updateChangeRequestRelatedLinkDraft('relatedLinkUrl', $event)" />
                                <app-pm-console-field label="Description" type="textarea" [value]="changeRequestDraft.relatedLinkDescription" placeholder="Add description" ariaLabel="Related link description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateChangeRequestRelatedLinkDraft('relatedLinkDescription', $event)" />
                                <button class="change-request-add-link wide" type="button" [disabled]="!canAddChangeRequestRelatedLink()" (click)="addChangeRequestRelatedLink()">
                                  <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>
                                  <span>Add related link</span>
                                </button>
                              </div>

                              @if (changeRequestDraft.relatedLinks.length) {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table" aria-label="Related links added to change request">
                                    <thead><tr><th>Name</th><th>Description</th><th>Document</th><th></th></tr></thead>
                                    <tbody>
                                      @for (link of changeRequestDraft.relatedLinks; track link.id) {
                                        <tr>
                                          <td class="dependency-register-primary"><strong>{{ link.name }}</strong></td>
                                          <td>{{ link.description || 'No description added' }}</td>
                                          <td class="related-links-register-access"><strong><a [href]="relatedLinkHref(link.documentLink)" target="_blank" rel="noreferrer">Open document</a></strong><small>{{ link.documentLink }}</small></td>
                                          <td class="schedule-table-actions"><button pmConsoleTableAction iconName="trash-2" actionClass="schedule-table-action danger" type="button" (click)="removeChangeRequestRelatedLink(link.id)" [attr.aria-label]="'Remove ' + link.name"></button></td>
                                        </tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              } @else {
                                <div class="change-request-related-empty">
                                  <span class="icon" aria-hidden="true"><i data-lucide="link-2-off"></i></span>
                                  <strong>No related link(s) added.</strong>
                                  <p>Add approvals, source packs, or supporting documents that PMO should review with this PCR.</p>
                                </div>
                              }
                            </section>
                          }
                        </div>
                      </app-pm-console-plan-drawer>
                    }
                  </main>
                </div>
              } @else if (projectPlanEntry === 'closure') {
                <div class="project-plan-shell plan-builder-shell quick-plan-shell project-secondary-shell project-closure-shell">
                  <main class="project-plan-content plan-builder-workspace quick-plan-workspace project-report-workspace project-secondary-workspace project-closure-workspace">
                    <section class="project-closure-surface" [attr.aria-label]="scopedProjectName + ' closure workspace'">
                      <aside class="project-closure-nav" aria-label="Closure sections">
                        <div class="project-closure-nav-head">
                          <span class="icon" aria-hidden="true"><i data-lucide="file-check-2"></i></span>
                          <div>
                            <strong>Closure report</strong>
                            <small>Draft evidence pack</small>
                          </div>
                        </div>
                        <div class="project-closure-nav-list" role="tablist" aria-label="Closure report sections">
                          @for (item of closureNavigationItems; track item.id) {
                            <button
                              type="button"
                              role="tab"
                              [class.active]="activeClosureSection === item.id"
                              [attr.aria-selected]="activeClosureSection === item.id"
                              (click)="setClosureSection(item.id)"
                            >
                              <span class="project-closure-nav-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(item.icon)"></i></span></span>
                              <span>{{ item.label }}</span>
                              @if (item.count !== undefined) { <strong>{{ item.count }}</strong> }
                            </button>
                          }
                        </div>
                      </aside>

                      <div class="project-closure-board">
                        <header class="project-closure-head">
                          <div>
                            <span class="change-request-kicker">Project closure</span>
                            <h2>{{ activeClosureNavItem.label }}</h2>
                            <p>Record final evidence, open actions, and handover notes for PMO review.</p>
                          </div>
                          <div class="project-closure-actions" aria-label="Closure actions">
                            <button class="project-closure-secondary" type="button"><span pmConsoleIcon="save" aria-hidden="true"></span><span>Save draft</span></button>
                            <button class="change-request-primary" type="button"><span pmConsoleIcon="send" aria-hidden="true"></span><span>Submit closure</span></button>
                          </div>
                        </header>

                        <div class="project-closure-metric-grid" aria-label="Closure summary">
                          @for (metric of closureOverviewMetrics; track metric.label) {
                            <article class="project-closure-metric {{ metric.tone }}">
                              <span class="project-closure-metric-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(metric.icon)"></i></span></span>
                              <div><small>{{ metric.label }}</small><strong>{{ metric.value }}</strong><p>{{ metric.helper }}</p></div>
                            </article>
                          }
                        </div>

                        @switch (activeClosureSection) {
                          @case ('overview') {
                            <section class="project-closure-section" aria-label="Closure overview">
                              <div class="closure-overview-layout">
                                <div class="closure-overview-main">
                                  <article class="closure-form-card">
                                    <div class="closure-form-head">
                                      <div>
                                        <span>Close-out controls</span>
                                        <h3>Closure overview</h3>
                                        <p>Confirm the reason, owner, reviewer, and target gate before completing the closure notes.</p>
                                      </div>
                                    </div>
                                    <div class="closure-overview-fields">
                                      <label class="matrix-field matrix-field-select closure-reason-field">
                                        <span class="matrix-field-label">Reason for closure <b>*</b></span>
                                        <span class="matrix-select-wrap">
                                          <select aria-label="Reason for closure">
                                            @for (option of closureReasonOptionsList; track option) {
                                              <option [selected]="option === 'Delivered as planned'">{{ option }}</option>
                                            }
                                          </select>
                                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                        </span>
                                      </label>
                                      <div class="closure-readonly-field"><span>Closure owner</span><strong>Muna Hassan</strong></div>
                                      <div class="closure-readonly-field"><span>PMO reviewer</span><strong>PMO Desk</strong></div>
                                      <div class="closure-readonly-field"><span>Gate target</span><strong>31/12/2026</strong></div>
                                    </div>
                                  </article>

                                  <div class="closure-editor-grid">
                                    @for (block of closureOverviewBlockList; track block.id) {
                                      <article class="closure-editor-card">
                                        <header>
                                          <span class="closure-editor-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(block.icon)"></i></span></span>
                                          <div><strong>{{ block.title }}</strong><small>{{ block.description }}</small></div>
                                        </header>
                                        <textarea [value]="block.value" [attr.aria-label]="block.title" [attr.maxlength]="block.maxLength"></textarea>
                                        <span class="closure-character-count">Characters: {{ closureCharacterCount(block) }}</span>
                                      </article>
                                    }
                                  </div>
                                </div>

                                <aside class="closure-readiness-panel" aria-label="Closure readiness checklist">
                                  <div class="closure-readiness-head">
                                    <span>{{ closureReadinessPercent }}%</span>
                                    <div>
                                      <strong>Readiness</strong>
                                      <small>{{ closureReadyItemCount }} of {{ closureChecklistList.length }} checks ready</small>
                                    </div>
                                  </div>
                                  <div class="closure-readiness-track" aria-hidden="true"><span [style.width.%]="closureReadinessPercent"></span></div>
                                  <div class="closure-checklist">
                                    @for (item of closureChecklistList; track item.label) {
                                      <article class="{{ item.tone }}">
                                        <span class="icon" aria-hidden="true"><i [attr.data-lucide]="item.tone === 'green' ? 'check' : item.tone === 'amber' ? 'clock-3' : 'circle-dot'"></i></span>
                                        <div><strong>{{ item.label }}</strong><small>{{ item.state }}</small></div>
                                      </article>
                                    }
                                  </div>
                                </aside>
                              </div>

                              <div class="closure-two-column">
                                <app-pm-console-plan-table
                                  title="Follow up actions"
                                  eyebrow="Closure"
                                  description="Actions that remain open after closure submission."
                                  [countLabel]="closureFollowUpActionList.length + ' actions'"
                                  actionLabel="Add action"
                                  [iconName]="iconName('todo')"
                                  panelClass="closure-table-card"
                                >
                                  <div class="dependency-register-table-shell">
                                    <table class="dependency-register-table closure-action-table" aria-label="Closure follow up actions">
                                      <thead><tr><th>Action</th><th>Owner</th><th>Due date</th><th>Status</th></tr></thead>
                                      <tbody>
                                        @for (row of closureFollowUpActionList; track row.id) {
                                          <tr><td class="dependency-register-primary"><strong>{{ row.action }}</strong></td><td>{{ row.owner }}</td><td>{{ closureDateLabel(row.dueDate) }}</td><td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.tone"></span></td></tr>
                                        }
                                      </tbody>
                                    </table>
                                  </div>
                                </app-pm-console-plan-table>

                                <app-pm-console-plan-table
                                  title="Recommendations"
                                  eyebrow="Closure"
                                  description="Recommendations carried into BAU or future projects."
                                  [countLabel]="closureRecommendationList.length + ' recommendations'"
                                  actionLabel="Add recommendation"
                                  [iconName]="iconName('lessons')"
                                  panelClass="closure-table-card"
                                >
                                  <div class="closure-recommendation-list">
                                    @for (row of closureRecommendationList; track row.id) {
                                      <article>
                                        <span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.tone"></span>
                                        <strong>{{ row.recommendation }}</strong>
                                        <small>{{ row.category }} · {{ row.owner }}</small>
                                      </article>
                                    }
                                  </div>
                                </app-pm-console-plan-table>
                              </div>
                            </section>
                          }

                          @case ('budget') {
                            @let year = activeBudgetYear;
                            <section class="project-closure-section closure-budget-section" aria-label="Closure budget">
                              <article class="budget-section budget-overview-panel closure-budget-panel">
                                <div class="budget-section-head">
                                  <div>
                                    <h3>Budget overview <span class="icon budget-info-icon" aria-hidden="true"><i data-lucide="info"></i></span></h3>
                                    <p>Final budget position reused from the project plan budget model for closure reconciliation.</p>
                                  </div>
                                  <button class="budget-outline-action" type="button">View monthly evidence</button>
                                </div>
                                <div class="budget-overview-summary-grid closure-budget-summary-grid" aria-label="Closure budget overview totals">
                                  @for (metric of activeBudgetOverviewMetrics; track metric.label) {
                                    <article class="budget-summary-cell {{ metric.tone }}"><span>{{ metric.label }}</span><strong>{{ metric.value }}</strong><small>{{ metric.helper }}</small></article>
                                  }
                                </div>
                              </article>

                              <app-pm-console-plan-table
                                title="Project budget at closure"
                                eyebrow="Budget"
                                [description]="closureBudgetSummaryLabel"
                                [countLabel]="year ? year.fy : 'No FY selected'"
                                [iconName]="iconName('dollar')"
                                panelClass="budget-table-card closure-table-card"
                              >
                                <div class="budget-table-wrap">
                                  <table class="budget-table budget-project-table" aria-label="Closure budget by stream">
                                    <thead><tr><th></th><th>FY Baseline</th><th>FY Forecast</th><th>Forecast Variance</th><th>Committed</th><th>YTD Actual</th><th>Available Budget</th></tr></thead>
                                    <tbody>
                                      @for (row of activeBudgetBreakdownRows; track row.stream) {
                                        <tr [class.is-total]="row.stream === 'Total'">
                                          <th scope="row">{{ row.stream }}</th>
                                          <td>{{ formatBudgetCurrency(row.baseline) }}</td>
                                          <td>{{ formatBudgetCurrency(row.forecast) }}</td>
                                          <td class="budget-variance-cell {{ budgetVarianceTone(budgetStreamVariance(row)) }}"><strong>{{ formatBudgetSignedCurrency(budgetStreamVariance(row)) }}</strong><small>{{ formatBudgetPercent(budgetStreamVariance(row), row.baseline) }}</small></td>
                                          <td>{{ formatBudgetCurrency(row.committed) }}</td>
                                          <td>{{ formatBudgetCurrency(row.actual) }}</td>
                                          <td class="budget-available-cell {{ budgetStreamAvailable(row) < 0 ? 'red' : 'green' }}">{{ formatBudgetCurrency(budgetStreamAvailable(row)) }}</td>
                                        </tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                                <div class="budget-table-footer"><span>{{ closureBudgetEvidenceCount }} linked across funding sources and monthly phasing.</span><button class="budget-primary-action" type="button">Confirm reconciliation</button></div>
                              </app-pm-console-plan-table>

                              <article class="closure-comment-card">
                                <label class="matrix-field matrix-field-textarea wide"><span class="matrix-field-label">Overall budget comments</span><textarea aria-label="Overall budget comments">Final budget position is within tolerance. Finance reconciliation should confirm funding source allocation before PMO approval.</textarea></label>
                              </article>
                            </section>
                          }

                          @case ('benefits') {
                            <section class="project-closure-section" aria-label="Closure benefits">
                              <article class="closure-section-intro">
                                <div><span>Benefit Manager</span><strong>{{ closureBenefitManager }}</strong></div>
                                <p>Benefits are carried forward from the project plan register so realization ownership survives closure.</p>
                              </article>
                              <app-pm-console-plan-table
                                title="Benefits"
                                eyebrow="Closure"
                                description="Benefit categories, owner, realization date, and measurement coverage."
                                [countLabel]="closureBenefitRowList.length + ' benefits'"
                                [iconName]="iconName('benefit')"
                                panelClass="closure-table-card"
                              >
                                <div class="dependency-register-table-shell closure-wide-table">
                                  <table class="dependency-register-table closure-benefit-table" aria-label="Closure benefits">
                                    <thead><tr><th>Benefit category</th><th>Benefit name</th><th>Owner</th><th>Realization date</th><th>Measures</th><th>Status</th></tr></thead>
                                    <tbody>
                                      @for (row of closureBenefitRowList; track row.benefit) {
                                        <tr><td>{{ row.category }}</td><td class="dependency-register-primary"><strong>{{ row.benefit }}</strong></td><td>{{ row.owner }}</td><td>{{ closureDateLabel(row.realizationDate) }}</td><td>{{ row.measures }}</td><td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.tone"></span></td></tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              </app-pm-console-plan-table>
                              <article class="closure-comment-card"><label class="matrix-field matrix-field-textarea wide"><span class="matrix-field-label">Overall benefits comments</span><textarea aria-label="Overall benefits comments">Realization tracking continues after close-out with the named benefit owners. Measures without targets should be reviewed in the first BAU checkpoint.</textarea></label></article>
                            </section>
                          }

                          @case ('risk') {
                            <section class="project-closure-section" aria-label="Closure risks">
                              <app-pm-console-plan-table
                                title="Major known risks"
                                eyebrow="Closure"
                                description="Residual risks that remain visible at closure."
                                [countLabel]="closureRiskRowList.length + ' risks'"
                                [iconName]="iconName('risks')"
                                panelClass="closure-table-card"
                              >
                                <div class="dependency-register-table-shell closure-wide-table">
                                  <table class="dependency-register-table closure-risk-table" aria-label="Closure risks">
                                    <thead><tr><th>Risk ID</th><th>Risk name</th><th>AR</th><th>Treatment</th><th>RR</th><th>Start date</th><th>End date</th><th>Status</th></tr></thead>
                                    <tbody>
                                      @for (row of closureRiskRowList; track row.id) {
                                        <tr><td><span class="pm-table-code">{{ row.id }}</span></td><td class="dependency-register-primary"><strong>{{ row.risk }}</strong></td><td><span class="risk-rating-swatch {{ riskRatingTone(row.actualRating) }}"></span></td><td>{{ row.treatments }}</td><td><span class="risk-rating-swatch {{ riskRatingTone(row.residualRating) }}"></span></td><td>{{ closureDateLabel(row.startDate) }}</td><td>{{ closureDateLabel(row.endDate) }}</td><td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="riskStatusTone(row.status)"></span></td></tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              </app-pm-console-plan-table>
                              <article class="closure-comment-card"><label class="matrix-field matrix-field-textarea wide"><span class="matrix-field-label">Overall risk comments</span><textarea aria-label="Overall risk comments">Residual risks are acceptable for closure once BAU ownership confirms the monitoring cadence and escalations path.</textarea></label></article>
                            </section>
                          }

                          @case ('issues') {
                            <section class="project-closure-section" aria-label="Closure issues">
                              <app-pm-console-toolbar [itemLabel]="'Items: ' + closureIssueRowList.length">
                                <button class="pm-table-tool square" type="button" aria-label="Search closure issues"><span pmConsoleIcon="search" aria-hidden="true"></span></button>
                                <button class="pm-table-tool" type="button"><span pmConsoleIcon="filter" aria-hidden="true"></span><span>Filter</span></button>
                                <button class="pm-table-tool" type="button"><span pmConsoleIcon="download" aria-hidden="true"></span><span>Export</span></button>
                              </app-pm-console-toolbar>
                              <div class="pm-project-table-scroll closure-issue-table-scroll" tabindex="0">
                                <table class="pm-project-table closure-issue-table" aria-label="Closure issues">
                                  <thead><tr><th>Issue ID</th><th>Issue</th><th>Issue type</th><th>Resolution</th><th>Criticality</th><th>Status</th><th>Owner</th><th>Due date</th></tr></thead>
                                  <tbody>
                                    @for (row of closureIssueRowList; track row.id) {
                                      <tr><td>{{ row.id }}</td><td>{{ row.issue }}</td><td>{{ row.type }}</td><td>{{ row.resolution }}</td><td><span class="issue-register-criticality-pill {{ issueCriticalityTone(row.criticality) }}">{{ row.criticality }}</span></td><td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="issueStatusTone(row.status)"></span></td><td>{{ row.owner }}</td><td>{{ closureDateLabel(row.dueDate) }}</td></tr>
                                    }
                                  </tbody>
                                </table>
                              </div>
                              <article class="closure-comment-card"><label class="matrix-field matrix-field-textarea wide"><span class="matrix-field-label">Overall issue comments</span><textarea aria-label="Overall issue comments">Open issues have resolutions and owners. PMO should confirm no issue blocks sponsor acceptance before closure approval.</textarea></label></article>
                            </section>
                          }

                          @case ('lessons') {
                            <section class="project-closure-section" aria-label="Closure lessons learnt">
                              <div class="closure-lessons-head">
                                <div><span class="change-request-kicker">Lessons learnt</span><h3>Learning captured for future projects</h3></div>
                                <button class="project-closure-secondary" type="button"><span pmConsoleIcon="plus" aria-hidden="true"></span><span>Add new</span></button>
                              </div>
                              <div class="dependency-register-table-shell closure-wide-table">
                                <table class="dependency-register-table closure-lessons-table" aria-label="Closure lessons learnt">
                                  <thead><tr><th>Title</th><th>Category</th><th>Issues</th><th>Recommendations</th><th aria-label="Edit"></th><th aria-label="Delete"></th></tr></thead>
                                  <tbody>
                                    @for (row of closureLessonRowList; track row.title) {
                                      <tr><td>{{ row.title }}</td><td>{{ row.category }}</td><td>{{ row.issue }}</td><td>{{ row.recommendation }}</td><td class="change-request-action-cell"><button pmConsoleTableAction iconName="pencil" type="button" [attr.aria-label]="'Edit ' + row.title"></button></td><td class="change-request-action-cell"><button pmConsoleTableAction iconName="trash-2" actionClass="schedule-table-action danger" type="button" [attr.aria-label]="'Delete ' + row.title"></button></td></tr>
                                    }
                                  </tbody>
                                </table>
                              </div>
                            </section>
                          }
                        }
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
            <div class="content-grid" [class.pm101-locked-grid]="onboardingPm101Locked || isPm101WelcomeWorkspace" [class.pm101-operational-grid]="isNormalPm101Workspace">
              <div class="left-column">
                <section class="workspace-panel" [class.project-workspace-panel]="!isAllProjects && !onboardingPm101Locked && !isPm101WelcomeWorkspace" [class.board-workspace-panel]="selectedView === 'board'" [class.pm101-locked-workspace]="onboardingPm101Locked || isPm101WelcomeWorkspace" [class.pm101-operational-workspace]="isNormalPm101Workspace">
                  <div class="workspace-shell-head" [class.pm101-locked-shell-head]="onboardingPm101Locked || isPm101WelcomeWorkspace" [class.pm101-operational-shell-head]="isNormalPm101Workspace">
                    @if (onboardingPm101Locked || isPm101WelcomeWorkspace) {
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
                      @if (onboardingPm101Locked || isPm101OnboardingWorkspaceFlow) {
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
                      } @else {
                        <button
                          [class.active]="selectedView === 'pm101'"
                          type="button"
                          data-view-target="pm101"
                          [attr.aria-selected]="selectedView === 'pm101'"
                          (click)="setView('pm101')"
                        >
                          <span class="icon" aria-hidden="true"><i data-lucide="calendar"></i></span>
                          <span>PM101</span>
                        </button>
                        <button
                          [class.active]="selectedView === 'calendar'"
                          type="button"
                          data-view-target="calendar"
                          [attr.aria-selected]="selectedView === 'calendar'"
                          (click)="setView('calendar')"
                        >
                          <span class="icon" aria-hidden="true"><i data-lucide="panels-top-left"></i></span>
                          <span>Calendar</span>
                        </button>
                        <button
                          [class.active]="selectedView === 'board'"
                          type="button"
                          data-view-target="board"
                          [attr.aria-selected]="selectedView === 'board'"
                          (click)="setView('board')"
                        >
                          <span class="icon" aria-hidden="true"><i data-lucide="panels-top-left"></i></span>
                          <span>Board</span>
                        </button>
                        <button
                          [class.active]="selectedView === 'stages'"
                          type="button"
                          data-view-target="stages"
                          [attr.aria-selected]="selectedView === 'stages'"
                          (click)="setView('stages')"
                        >
                          <span class="icon" aria-hidden="true"><i data-lucide="radar"></i></span>
                          <span>Stages</span>
                        </button>
                      }
                    </div>
                  </div>
                  @if (selectedView !== 'stages' && selectedView !== 'pm101') {
                    <div class="workspace-control-row">
                      <label class="workspace-search">
                        <span class="icon" aria-hidden="true"><i data-lucide="search"></i></span>
                        <input type="search" [attr.aria-label]="workspaceSearchPlaceholder" [placeholder]="workspaceSearchPlaceholder" />
                      </label>
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
                    <div class="pm101-view" [class.pm101-operational-view]="isNormalPm101Workspace" [class.is-hidden]="selectedView !== 'pm101'" data-work-view="pm101">
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
                      } @else if (isNormalPm101Workspace) {
                        <div class="pm101-project-strip" aria-label="PM101 project overview">
                          <article class="pm101-project-card pm101-project-card-assigned">
                            <img class="pm101-project-card-art" src="./assets/pm101-vision-card-bg.jpg" alt="" aria-hidden="true" />
                            <span class="pm101-project-chip">New project assigned by PMO</span>
                            <strong>Vision 2030</strong>
                            <button class="pm101-project-cta" type="button" (click)="selectPm101Project('Vision 2030')" aria-label="Go to Vision 2030 project">
                              <span>Go to Project</span>
                              <span class="pm101-project-cta-arrow" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                            </button>
                          </article>
                          <article class="pm101-project-card pm101-project-card-active">
                            <img class="pm101-project-card-art" src="./assets/pm101-active-card-bg.jpg" alt="" aria-hidden="true" />
                            <span class="pm101-project-chip">Active Project</span>
                            <strong>NEOM Integration</strong>
                          </article>
                          <article class="pm101-project-card pm101-project-card-active">
                            <img class="pm101-project-card-art" src="./assets/pm101-active-card-bg.jpg" alt="" aria-hidden="true" />
                            <span class="pm101-project-chip">Active Project</span>
                            <strong>Project 3</strong>
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
                                } @else if (step.footerAction && step.footerStandalone) {
                                  <div class="pm101-card-footer pm101-card-footer-link pm101-card-footer-text-only">
                                    <span>{{ step.footerAction }}</span>
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
              <div class="right-column" [class.portfolio-frontdoor]="isAllProjects || onboardingPm101Locked" [class.project-frontdoor]="!isAllProjects && !onboardingPm101Locked" [class.pm101-locked-right]="onboardingPm101Locked || isPm101OnboardingWorkspaceFlow">
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
      <app-pm-console-report-drawer
        [projectName]="activeReport.project"
        [details]="activeReportDetails"
        [activeMode]="activeReportMode"
        [activeSection]="activeReportSection"
        [reportSections]="reportSections"
        [statusOptions]="reportStatusOptions"
        [trendOptions]="simpleReportTrendOptions"
        [overviewCard]="simpleReportOverviewCard"
        [simpleCards]="simpleReportCards"
        [detailedCards]="detailedReportCards"
        [overviewFields]="detailedOverviewFields"
        [scopeProducts]="scopeProducts"
        [sectionDetails]="reportSectionDetails"
        [detailItemMap]="detailedReportItemMap"
        (close)="closeReport()"
        (save)="saveReport($event)"
        (modeChange)="setReportMode($event)"
        (sectionChange)="setReportSection($event)"
      ></app-pm-console-report-drawer>
    }

    @if (false && activeReportProject) {
      <div class="report-drawer-shell" aria-live="polite">
        <button class="report-drawer-backdrop" type="button" (click)="closeReport()" aria-label="Close report drawer"></button>
        <aside class="report-drawer" [attr.aria-label]="activeReport.project + ' report draft'">
          <form class="report-compose-form" (submit)="saveReport($event)">
            <div class="report-drawer-top report-drawer-top-simple">
              <div class="report-simple-header">
                <div class="report-simple-header-row">
                  <div class="report-simple-title-group">
                    <button class="drawer-close report-simple-close" type="button" (click)="closeReport()" aria-label="Close drawer"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                    <div class="report-drawer-title report-simple-title-line"><h2>Project Report</h2><span aria-hidden="true">|</span><p>{{ activeReport.project }}</p></div>
                  </div>
                  <div class="report-simple-meta">
                    <span>Stage: <strong class="report-simple-chip indigo">{{ activeReportDetails.stage }}</strong></span>
                    <span>State: <strong class="report-simple-chip {{ reportBadgeTone(activeReportDetails.state, 'neutral') }}">{{ activeReportDetails.state }}</strong></span>
                    <span>Plan: <strong class="report-simple-chip {{ simpleReportPlanChipTone }}">{{ simpleReportPlanLabel }}</strong></span>
                  </div>
                </div>

                <div class="report-simple-toolbar">
                  <div class="report-simple-toolbar-copy">
                    <span>Reporting Interval: <strong>{{ simpleReportIntervalLabel }}</strong></span>
                    <span>Report Status: <strong class="report-simple-chip report-status-inline-chip {{ simpleReportStatusTone }}">{{ simpleReportPlanLabel }}</strong></span>
                  </div>
                  <div class="report-simple-mode-tabs" [class.is-detailed]="activeReportMode === 'detailed'" role="tablist" aria-label="Report view">
                    <button [class.active]="activeReportMode === 'simple'" type="button" [attr.aria-selected]="activeReportMode === 'simple'" role="tab" (click)="setReportMode('simple')">Simple view</button>
                    <button [class.active]="activeReportMode === 'detailed'" type="button" [attr.aria-selected]="activeReportMode === 'detailed'" role="tab" (click)="setReportMode('detailed')">Detailed view</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="report-drawer-body" [class.report-drawer-body-detailed]="activeReportMode === 'detailed'">
              @if (activeReportMode === 'simple') {
                <section class="report-layout-stack report-simple-card-stack" aria-label="Simple project plan report">
                  @let overviewCard = simpleReportOverviewCard;
                  <article class="report-layout-card report-simple-card report-simple-overall-card {{ overviewCard.tone }}">
                    <div class="report-simple-card-head">
                      <div class="report-simple-title-area">
                        <span class="report-simple-card-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(overviewCard.icon)"></i></span></span>
                        <div class="report-simple-section-title">
                          <h3>{{ overviewCard.title }}</h3>
                          <span class="icon" aria-hidden="true"><i data-lucide="info"></i></span>
                        </div>
                      </div>
                      <div class="report-simple-history" [attr.aria-label]="overviewCard.title + ' past statuses'">
                        @for (point of overviewCard.timeline; track point.date) {
                          <span class="{{ point.tone }}" [title]="point.label"><span class="report-simple-history-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></span><small>{{ point.date }}</small></span>
                        }
                      </div>
                    </div>

                    <div class="report-simple-control-row">
                      <div class="report-simple-field">
                        <span class="report-simple-field-label">Status<small>*</small></span>
                        <div class="report-simple-status-control" role="radiogroup" aria-label="Simple report overall status">
                          @for (option of reportStatusOptions; track option.label) {
                            <label class="{{ option.tone }}"><input type="radio" name="simple-overall-status" [checked]="isReportStatusSelected(option.value, overviewCard.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                          }
                        </div>
                      </div>
                      <div class="report-simple-field">
                        <span class="report-simple-field-label">Overall Status Trend</span>
                        <strong class="report-simple-trend-chip {{ simpleReportTrendTone(overviewCard.trend, overviewCard.tone) }}"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="simpleReportTrendIcon(overviewCard.trend, overviewCard.tone)"></i></span>{{ simpleReportTrendLabel(overviewCard.trend, overviewCard.tone) }}</strong>
                      </div>
                    </div>

                    <label class="report-layout-comment">
                      <span>Comments</span>
                      <textarea rows="3" maxlength="3000" placeholder="Add the comments here..." [value]="overviewCard.comments"></textarea>
                    </label>
                  </article>

                  @for (card of simpleReportCards; track card.id; let cardIndex = $index) {
                    <article class="report-layout-card report-simple-card report-layout-card-section {{ card.tone }}">
                      <div class="report-simple-card-head">
                        <div class="report-simple-title-area">
                          <span class="report-simple-card-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(card.icon)"></i></span></span>
                          <div class="report-simple-section-title">
                            <h3>{{ simpleReportSectionTitle(card.title) }}</h3>
                            <span class="icon" aria-hidden="true"><i data-lucide="info"></i></span>
                          </div>
                        </div>
                        <div class="report-simple-history" [attr.aria-label]="card.title + ' past statuses'">
                          @for (point of card.timeline; track point.date) {
                            <span class="{{ point.tone }}" [title]="point.label"><span class="report-simple-history-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></span><small>{{ point.date }}</small></span>
                          }
                        </div>
                      </div>

                      <div class="report-simple-control-row">
                        <div class="report-simple-field">
                          <span class="report-simple-field-label">Status<small>*</small></span>
                          <div class="report-simple-status-control" role="radiogroup" [attr.aria-label]="card.title + ' status'">
                            @for (option of reportStatusOptions; track option.label) {
                              <label class="{{ option.tone }}"><input type="radio" [attr.name]="'simple-card-status-' + cardIndex" [checked]="isReportStatusSelected(option.value, card.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                            }
                          </div>
                        </div>
                        <div class="report-simple-field">
                          <span class="report-simple-field-label">Overall Status Trend</span>
                          <div class="report-simple-trend-control" role="radiogroup" [attr.aria-label]="card.title + ' trend'">
                            @for (option of simpleReportTrendOptions; track option.value) {
                              <label class="{{ option.tone }}"><input type="radio" [attr.name]="'simple-card-trend-' + cardIndex" [checked]="isReportTrendSelected(option.value, card.trend)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="option.icon"></i></span>{{ option.label }}</span></label>
                            }
                          </div>
                        </div>
                      </div>

                      <label class="report-layout-comment">
                        <span>Comments</span>
                        <textarea rows="3" maxlength="3000" placeholder="Add the comments here..." [value]="card.comments"></textarea>
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

                <div class="report-detailed-shell">
                  @for (card of detailedReportCards; track card.id) {
                    <section class="report-detailed-tab-panel" [hidden]="activeReportSection !== card.title" role="tabpanel">
                      <article class="report-layout-card report-simple-card report-detailed-summary-card {{ card.tone }}">
                        <div class="report-simple-card-head">
                          <div class="report-simple-title-area">
                            <span class="report-simple-card-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(card.icon)"></i></span></span>
                            <div class="report-simple-section-title">
                              <h3>{{ card.title === 'Overview' ? 'Overall Status' : card.title + ' Status' }}</h3>
                              <span class="icon" aria-hidden="true"><i data-lucide="info"></i></span>
                            </div>
                          </div>
                          <div class="report-simple-history" [attr.aria-label]="card.title + ' past statuses'">
                            @for (point of card.timeline; track point.date) {
                              <span class="{{ point.tone }}" [title]="point.label"><span class="report-simple-history-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></span><small>{{ point.date }}</small></span>
                            }
                          </div>
                        </div>

                        <div class="report-simple-control-row">
                          <div class="report-simple-field">
                            <span class="report-simple-field-label">Status<small>*</small></span>
                            <div class="report-simple-status-control" role="radiogroup" [attr.aria-label]="card.title + ' detailed status'">
                              @for (option of reportStatusOptions; track option.label) {
                                <label class="{{ option.tone }}"><input type="radio" [attr.name]="'detailed-card-status-' + card.id" [checked]="isReportStatusSelected(option.value, card.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                              }
                            </div>
                          </div>
                          <div class="report-simple-field">
                            <span class="report-simple-field-label">Overall Status Trend</span>
                            <div class="report-simple-trend-control" role="radiogroup" [attr.aria-label]="card.title + ' detailed trend'">
                              @for (option of simpleReportTrendOptions; track option.value) {
                                <label class="{{ option.tone }}"><input type="radio" [attr.name]="'detailed-card-trend-' + card.id" [checked]="isReportTrendSelected(option.value, card.trend)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="option.icon"></i></span>{{ option.label }}</span></label>
                              }
                            </div>
                          </div>
                        </div>

                        <label class="report-layout-comment">
                          <span>Comments</span>
                          <textarea rows="3" maxlength="3000" placeholder="Add the comments here..." [value]="card.comments"></textarea>
                        </label>
                      </article>

                      @if (card.title === 'Overview') {
                        <section class="report-detail-record-section" aria-label="Overview narrative updates">
                          <div class="report-detail-section-head">
                            <div><strong>Narrative updates</strong><span>Capture the longer report text for this period.</span></div>
                          </div>
                          <div class="report-detail-narrative-grid">
                            @for (field of detailedOverviewFields; track field.label) {
                              <label class="report-layout-field">
                                <span>{{ field.label }} @if (field.hint) { <small>{{ field.hint }}</small> }</span>
                                <textarea [rows]="field.rows" maxlength="3000" [value]="field.value"></textarea>
                              </label>
                            }
                          </div>
                        </section>
                      } @else if (card.title === 'Scope') {
                        <section class="report-detail-record-section report-detail-scope-section" aria-label="Scope end products">
                          <div class="report-detail-section-head">
                            <div><strong>End Product</strong><span>{{ scopeProducts.length }} items selected for this report.</span></div>
                            <button class="scope-group-link" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>Add to report</button>
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
                      } @else {
                        <section class="report-detail-record-section" [attr.aria-label]="card.title + ' report items'">
                          <div class="report-detail-section-head">
                            <div><strong>{{ card.title }} details</strong><span>{{ card.body }}</span></div>
                            <button class="scope-group-link" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>Add to report</button>
                          </div>
                          <div class="report-detail-record-list">
                            @for (item of detailedReportItems(card.title); track item.title) {
                              <article class="report-detail-record-card {{ item.tone }}">
                                <div class="report-detail-record-head">
                                  <span class="report-detail-record-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(item.icon)"></i></span></span>
                                  <div class="report-detail-record-copy">
                                    <strong>{{ item.title }}</strong>
                                    <span>{{ item.meta }}</span>
                                  </div>
                                  <span class="report-area-pill {{ item.tone }}">{{ item.status }}</span>
                                </div>
                                <p>{{ item.body }}</p>
                                <div class="report-detail-record-fields">
                                  <label class="scope-product-field scope-product-field-select">
                                    <span>Report status</span>
                                    <span class="scope-field-control scope-field-control-select">
                                      <select [attr.aria-label]="'Report status for ' + item.title">
                                        <option>{{ item.status }}</option>
                                        <option>On track</option>
                                        <option>Alert</option>
                                        <option>Off track</option>
                                      </select>
                                      <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                    </span>
                                  </label>
                                  <label class="scope-product-field">
                                    <span>Owner</span>
                                    <input type="text" [value]="item.owner" />
                                  </label>
                                  <label class="scope-product-field">
                                    <span>{{ item.progressLabel }}</span>
                                    <input type="text" [value]="item.progressValue" />
                                  </label>
                                </div>
                                <label class="report-layout-comment">
                                  <span>Comments</span>
                                  <textarea rows="2" maxlength="3000" placeholder="Add the comments here..." [value]="item.comment"></textarea>
                                </label>
                              </article>
                            }
                          </div>
                        </section>
                      }
                    </section>
                  }
                </div>
              }
            </div>

            <div class="report-drawer-footer">
              <button class="report-secondary-button" type="button" (click)="closeReport()">Cancel</button>
              <button class="report-more-button" type="button">More actions <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></button>
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
              <p>{{ gate.stage.label }} stage gate submission to PMO</p>
            </div>
          </div>
          <div class="drawer-status-card {{ gate.status }}">
            <strong>{{ stageStatusLabel(gate.status) }}</strong>
            <span>{{ gateReadinessText(gate) }} · Due {{ gate.profile.gateDue }}</span>
          </div>
          <form class="stage-gate-form" (submit)="submitStageGate($event, gate)">
            <div class="stage-gate-drawer-body">
              <div class="drawer-section stage-checklist-section">
                <div class="drawer-section-headline">
                  <span class="drawer-section-title">PMO checklist</span>
                  <small>{{ gate.checkedCount }}/{{ gate.profile.gateTotal }} complete</small>
                </div>
              @for (item of gate.profile.checklist; track item; let index = $index) {
                <label class="stage-checklist-item" [class.checked]="isStageGateChecklistChecked(gate, index)">
                  <input type="checkbox" [checked]="isStageGateChecklistChecked(gate, index)" [disabled]="!canEditStageGateChecklist(gate.status)" (change)="toggleStageGateChecklistItem(gate, index, $any($event.target).checked)" />
                  <i aria-hidden="true"><span class="icon"><i data-lucide="check"></i></span></i>
                  <span>{{ item }}</span>
                </label>
              }
              </div>

              <div class="drawer-section stage-evidence-section" [class.is-attached]="isStageGateEvidenceAttached(gate)">
                <div class="drawer-section-headline">
                  <span class="drawer-section-title">Evidence</span>
                  <small>{{ stageGateEvidenceEnabled(gate) ? (isStageGateEvidenceAttached(gate) ? 'Attached' : 'Required') : 'Not required' }}</small>
                </div>
                @if (stageGateEvidenceEnabled(gate)) {
                  <p>{{ gate.profile.checkpoint }}</p>
                  <label class="stage-evidence-upload">
                    <input type="file" (change)="markStageGateEvidenceAttached(gate)" [disabled]="!canEditStageGateChecklist(gate.status)" />
                    <span class="icon" aria-hidden="true"><i [attr.data-lucide]="isStageGateEvidenceAttached(gate) ? 'file-check-2' : 'upload-cloud'"></i></span>
                    <strong>{{ isStageGateEvidenceAttached(gate) ? 'Evidence pack attached' : 'Attach proof of work' }}</strong>
                    <small>{{ isStageGateEvidenceAttached(gate) ? 'Ready to submit with checklist' : 'Upload artefact, sign-off, or work proof requested by PMO' }}</small>
                  </label>
                } @else {
                  <p>PMO has not enabled evidence capture for this gate.</p>
                }
              </div>

              <div class="stage-gate-review-flow" aria-label="Stage gate workflow">
                <span [class.active]="gate.status === 'current'">Ready</span>
                <i></i>
                <span [class.active]="gate.status === 'submitted'">Submitted</span>
                <i></i>
                <span [class.active]="gate.status === 'complete'">Approved</span>
              </div>
            </div>
            <button class="drawer-submit" type="submit" [disabled]="!canSubmitStageGate(gate)">
              {{ stageGateSubmitLabel(gate.status) }}
            </button>
          </form>
        </aside>
      </div>
    }

    @if (selectedStageRevokeContext; as revokeGate) {
      <div class="stage-revoke-dialog-shell" aria-live="polite">
        <button class="stage-revoke-backdrop" type="button" (click)="closeStageRevoke()" aria-label="Cancel stage revoke"></button>
        <section class="stage-revoke-dialog" role="dialog" aria-modal="true" [attr.aria-label]="'Revoke ' + revokeGate.stage.label + ' stage approval'">
          <button class="drawer-close stage-revoke-close" type="button" (click)="closeStageRevoke()" aria-label="Close revoke confirmation"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
          <span class="project-stages-kicker">Revoke stage</span>
          <h2>{{ revokeGate.stage.label }} approval will be revoked</h2>
          <p>The project will move back to {{ revokeGate.stage.label }}. Later stage progress and PMO approvals will need to be resubmitted.</p>
          <div class="stage-revoke-actions">
            <button class="report-secondary-button" type="button" (click)="closeStageRevoke()">Cancel</button>
            <button class="report-submit-button danger" type="button" (click)="confirmStageRevoke(revokeGate)">Revoke stage</button>
          </div>
        </section>
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
  readonly reportSections = ['Overview', 'Scope', 'Schedule', 'Budget', 'Benefits', 'Risks', 'Issues', 'Resource', 'Dependencies'];
  readonly reportStatusOptions = [
    { label: 'On track', simpleLabel: 'On track', value: 'On track', tone: 'green', icon: 'checkMark' },
    { label: 'Alert/Discuss', simpleLabel: 'Alert', value: 'Alert', tone: 'amber', icon: 'alert' },
    { label: 'Off track', simpleLabel: 'Off track', value: 'Off Track', tone: 'red', icon: 'close' },
  ];
  readonly simpleReportTrendOptions = [
    { label: 'Improving', value: 'Improving', tone: 'green', icon: 'arrow-up' },
    { label: 'No change', value: 'No change', tone: 'neutral', icon: 'circle-minus' },
    { label: 'Declining', value: 'Declining', tone: 'red', icon: 'arrow-down' },
  ];
  readonly pastOverviewTrend = ['31/03/2026', '31/12/2025', '30/09/2025', '30/06/2025', '31/12/2024'];
  readonly scopePastStatuses = [
    { date: '20/01/2025', tone: 'green', label: 'On track' },
    { date: '20/01/2025', tone: 'amber', label: 'Alert/Discuss' },
    { date: '20/01/2025', tone: 'red', label: 'Off track' },
    { date: '20/01/2025', tone: 'amber', label: 'Alert/Discuss' },
    { date: '20/01/2025', tone: 'red', label: 'Off track' },
  ];
  readonly detailedReportSharedTimelineSections = new Set(['Scope', 'Schedule', 'Budget', 'Benefits', 'Issues', 'Resource', 'Dependencies']);
  readonly scopeProducts = [
    { title: 'Collaboration platform', icon: 'dependencies', type: 'Technology', owner: 'Richelle Hilton', ownerInitials: 'MH', capability: '-', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: 'Not started', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
    { title: 'National R&D database', icon: 'database', type: 'Technology', owner: 'Richelle Hilton', ownerInitials: 'MH', capability: '-', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: 'Not started', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
    { title: 'Opportunity marketplace', icon: 'store', type: 'Technology', owner: 'Richelle Hilton', ownerInitials: 'MH', capability: '-', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: 'Not started', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
    { title: 'CRM', icon: '', type: 'Technology', owner: 'Richelle Hilton', ownerInitials: 'MH', capability: '-', dates: '11/02/2026 - 26/06/2026', budget: '$0', status: 'Not started', actualStart: '11/02/2026', actualEnd: '26/06/2026', completed: '33' },
  ];
  readonly reportSectionDetails: Record<string, ReportSectionDetail> = {
    Schedule: {
      icon: 'calendarSearch',
      metrics: [
        { label: 'Baseline Start date', value: '01/01/2026' },
        { label: 'Forecast Start date', value: '01/01/2026' },
        { label: 'Baseline End date', value: '31/12/2026' },
        { label: 'Forecast End date', value: '31/12/2026' },
      ],
      tables: [
        {
          id: 'schedule-milestones',
          title: 'Milestones',
          minWidth: 968,
          columns: [
            { key: 'selected', label: '', width: 44, align: 'center' },
            { key: 'milestone', label: 'Milestone', width: 240 },
            { key: 'dueDate', label: 'Due Date', width: 96 },
            { key: 'owner', label: 'Person Responsible', width: 160 },
            { key: 'priority', label: 'Priority', width: 96 },
            { key: 'currentDueDate', label: 'Current Due Date', width: 160 },
            { key: 'completionStatus', label: 'Completion Status', width: 160 },
          ],
          rows: [
            {
              id: 'platform-launch',
              cells: {
                selected: { type: 'checkbox', checked: true },
                milestone: { type: 'text', value: 'Platform launch (2024) - Initial release of a centralized national R&D mapping portal' },
                dueDate: { type: 'text', value: '31/08/2026' },
                owner: { type: 'person', value: 'Muna Hasan', initials: 'MH' },
                priority: { type: 'chip', value: 'High', tone: 'red' },
                currentDueDate: { type: 'dateInput', value: '11/02/2026' },
                completionStatus: { type: 'select', value: 'Pending', options: ['Pending', 'In progress', 'Complete'] },
              },
            },
            {
              id: 'ecosystem-onboarding',
              cells: {
                selected: { type: 'checkbox', checked: true },
                milestone: { type: 'text', value: 'Ecosystem onboarding - Universities, research centers, and entities integrated into the platform' },
                dueDate: { type: 'text', value: '31/08/2026' },
                owner: { type: 'text', value: '-' },
                priority: { type: 'chip', value: 'High', tone: 'red' },
                currentDueDate: { type: 'dateInput', value: '11/02/2026' },
                completionStatus: { type: 'select', value: 'Pending', options: ['Pending', 'In progress', 'Complete'] },
              },
            },
            {
              id: 'feature-expansion',
              cells: {
                selected: { type: 'checkbox', checked: true },
                milestone: { type: 'text', value: 'Feature expansion - Addition of collaboration tools, funding listings, and analytics capabilities' },
                dueDate: { type: 'text', value: '31/08/2026' },
                owner: { type: 'text', value: '-' },
                priority: { type: 'chip', value: 'Medium', tone: 'amber' },
                currentDueDate: { type: 'dateInput', value: '11/02/2026' },
                completionStatus: { type: 'select', value: 'Pending', options: ['Pending', 'In progress', 'Complete'] },
              },
            },
          ],
        },
      ],
    },
    Budget: {
      summaryGroups: [
        {
          title: 'Budget overview',
          cards: [
            {
              title: 'Budget vs actual',
              rows: [
                { label: 'Total project budget', value: '$332k' },
                { label: 'Original approved budget: $1.7M', chip: true, tone: 'indigo' },
                { label: 'Actual spend', value: '$0' },
                { label: 'Budget actual', value: '$332k', dividerBefore: true },
              ],
            },
            {
              title: 'Budget vs forecast',
              rows: [
                { label: 'Total project budget', value: '$332k' },
                { label: 'Forecast (EAC)', value: '$25k' },
                { label: 'Forecast variance', value: '$295k(92.19%)', tone: 'green' },
                { label: 'Budget actual', value: '$332k', dividerBefore: true },
              ],
            },
            {
              title: 'Available funds',
              wide: true,
              rows: [
                { label: 'Total project budget', value: '$332k' },
                { label: 'Actual spent', value: '$0' },
                { label: 'Committed (unspent)', value: '-' },
                { label: 'Available budget', value: '-' },
              ],
              notice: {
                tone: 'amber',
                icon: 'info',
                text: 'Committed budget no entered. Go to project plan - budget to enter committed values',
              },
            },
          ],
        },
      ],
      tables: [
        {
          id: 'budget-project-budget',
          title: 'Project budget',
          selectorLabel: 'FY 2025 - 2026',
          minWidth: 1112,
          columns: [
            { key: 'category', label: '', width: 80 },
            { key: 'fyBaseline', label: 'FY baseline', width: 144 },
            { key: 'fyForecast', label: 'FY forecast', width: 144 },
            { key: 'forecastVariance', label: 'Forecast Variance', width: 144 },
            { key: 'committed', label: 'Committed', width: 144 },
            { key: 'ytdBaseline', label: 'YTD baseline', width: 144 },
            { key: 'ytdActual', label: 'YTD actual', width: 144 },
            { key: 'availableBudget', label: 'Available Budget', width: 144 },
          ],
          rows: [
            {
              id: 'budget-capex',
              cells: {
                category: { type: 'text', value: 'CAPEX' },
                fyBaseline: { type: 'text', value: '$100K' },
                fyForecast: { type: 'text', value: '$100K' },
                forecastVariance: { type: 'text', value: '$-20K(-20%)', tone: 'red' },
                committed: { type: 'text', value: '$0' },
                ytdBaseline: { type: 'text', value: '$0' },
                ytdActual: { type: 'text', value: '$0' },
                availableBudget: { type: 'text', value: '$100K' },
              },
            },
            {
              id: 'budget-opex',
              cells: {
                category: { type: 'text', value: 'OPEX' },
                fyBaseline: { type: 'text', value: '$100K' },
                fyForecast: { type: 'text', value: '$100K' },
                forecastVariance: { type: 'text', value: '$-20K(-20%)', tone: 'red' },
                committed: { type: 'text', value: '$0' },
                ytdBaseline: { type: 'text', value: '$0' },
                ytdActual: { type: 'text', value: '$0' },
                availableBudget: { type: 'text', value: '$100K' },
              },
            },
            {
              id: 'budget-total',
              cells: {
                category: { type: 'text', value: 'Total' },
                fyBaseline: { type: 'text', value: '$100K' },
                fyForecast: { type: 'text', value: '$100K' },
                forecastVariance: { type: 'text', value: '$-20K(-20%)', tone: 'red' },
                committed: { type: 'text', value: '$0' },
                ytdBaseline: { type: 'text', value: '$0' },
                ytdActual: { type: 'text', value: '$0' },
                availableBudget: { type: 'text', value: '$100K' },
              },
            },
          ],
          actions: [
            { label: 'View funding sources' },
            { label: 'View monthly budget' },
          ],
        },
      ],
    },
    Benefits: {
      tables: [
        {
          id: 'benefits-report',
          title: 'Benefits',
          minWidth: 556,
          columns: [
            { key: 'selected', label: '', width: 44, align: 'center' },
            { key: 'benefitName', label: 'Benefit Name', width: 208 },
            { key: 'type', label: 'Type', width: 88 },
            { key: 'realisationDate', label: 'Realisation Date', width: 104 },
            { key: 'status', label: 'Status', width: 112 },
          ],
          rows: [
            {
              id: 'benefit-ecosystem-visibility',
              cells: {
                selected: { type: 'checkbox', checked: true },
                benefitName: {
                  type: 'text',
                  value: 'Improved ecosystem visibility - Single source of truth reduces fragmentation in research data',
                  clampLines: 3,
                },
                type: { type: 'text', value: 'Financial' },
                realisationDate: { type: 'text', value: '31/08/2026' },
                status: { type: 'chip', value: 'To Commence', tone: 'indigo' },
              },
            },
            {
              id: 'benefit-funding-allocation',
              cells: {
                selected: { type: 'checkbox', checked: true },
                benefitName: {
                  type: 'text',
                  value:
                    'Better funding allocation - Centralized visibility enables policymakers and funding bodies to direct investments toward high-impact and underrepresented research areas',
                  clampLines: 3,
                },
                type: { type: 'text', value: 'Financial' },
                realisationDate: { type: 'text', value: '26/11/2026' },
                status: { type: 'chip', value: 'To Commence', tone: 'indigo' },
              },
            },
            {
              id: 'benefit-policy-decisions',
              cells: {
                selected: { type: 'checkbox', checked: true },
                benefitName: {
                  type: 'text',
                  value:
                    'Stronger policy and strategic decision-making - Aggregated R&D data supports evidence-based planning and national innovation strategy development',
                  clampLines: 3,
                },
                type: { type: 'text', value: 'Financial' },
                realisationDate: { type: 'text', value: '07/03/2026' },
                status: { type: 'chip', value: 'To Commence', tone: 'indigo' },
              },
            },
          ],
        },
      ],
    },
    Risks: {
      tables: [
        {
          id: 'risk-register-report',
          title: 'Risks',
          hideHeader: true,
          minWidth: 1288,
          selectFilters: [
            {
              label: 'Actual Risk Rating',
              value: 'Select Residual Risk Rating',
              options: ['Select Residual Risk Rating', 'Low', 'Medium', 'High', 'Extreme'],
            },
            {
              label: 'Select Residual Risk Rating',
              value: 'Pending',
              options: ['Pending', 'Low', 'Medium', 'High', 'Extreme'],
            },
          ],
          radioFilter: {
            label: 'Show only',
            options: [
              { label: 'Overdue Risk(s)', value: 'overdue' },
              { label: 'Closed Risk(s)', value: 'closed' },
            ],
          },
          columns: [
            { key: 'selected', label: '', width: 44, align: 'center' },
            { key: 'riskId', label: 'Risk ID', width: 96 },
            { key: 'riskName', label: 'Risk Name', width: 264 },
            { key: 'owner', label: 'Risk Owner', width: 160 },
            { key: 'actualRating', label: 'AR', width: 48, align: 'center' },
            { key: 'treatment', label: 'Treatment', width: 96 },
            { key: 'residualRating', label: 'RR', width: 48, align: 'center' },
            { key: 'startDate', label: 'Start Date', width: 96 },
            { key: 'endDate', label: 'End Date', width: 96 },
            { key: 'reviewDueDate', label: 'Review Due Date', width: 144 },
            { key: 'status', label: 'Risk Status', width: 120 },
          ],
          rows: [
            {
              id: 'risk-r839',
              cells: {
                selected: { type: 'checkbox', checked: true },
                riskId: { type: 'text', value: 'R839' },
                riskName: { type: 'text', value: 'Data quality risk - Inaccurate or outdated entries can reduce platform credibility' },
                owner: { type: 'person', value: 'Muna Hasan', initials: 'MH' },
                actualRating: { type: 'iconBadge', icon: 'alert', tone: 'amber' },
                treatment: { type: 'text', value: '0' },
                residualRating: { type: 'iconBadge', icon: 'closeCircle', tone: 'red' },
                startDate: { type: 'text', value: '01/01/2026' },
                endDate: { type: 'text', value: '31/08/2026' },
                reviewDueDate: { type: 'text', value: 'N/A' },
                status: { type: 'chip', value: 'Open', tone: 'indigo' },
              },
            },
            {
              id: 'risk-r822',
              cells: {
                selected: { type: 'checkbox', checked: true },
                riskId: { type: 'text', value: 'R822' },
                riskName: { type: 'text', value: "Low adoption risk - Value diminishes if key institutions/researchers don't actively participate" },
                owner: { type: 'person', value: 'Muna Hasan', initials: 'MH' },
                actualRating: { type: 'iconBadge', icon: 'checkCircle', tone: 'green' },
                treatment: { type: 'text', value: '0' },
                residualRating: { type: 'iconBadge', icon: 'minusCircle', tone: 'neutral' },
                startDate: { type: 'text', value: '01/01/2026' },
                endDate: { type: 'text', value: '31/08/2026' },
                reviewDueDate: { type: 'text', value: 'N/A' },
                status: { type: 'chip', value: 'Open', tone: 'indigo' },
              },
            },
          ],
        },
      ],
    },
    Issues: {
      recordBlocks: [
        {
          id: 'issues-report',
          addLabel: 'Add to report',
          filters: [
            {
              label: 'Issue Type',
              value: 'Select Issue Type',
              options: ['Select Issue Type', 'Stakeholders', 'Schedule', 'Budget', 'Scope'],
            },
            {
              label: 'Status',
              value: 'Select Issue Type',
              options: ['Select Issue Type', 'Open', 'In progress', 'Closed'],
            },
            {
              label: 'Priority',
              value: 'Select Issue Type',
              options: ['Select Issue Type', 'Low', 'Medium', 'High'],
            },
          ],
          items: [
            {
              id: 'issue-i59',
              selected: true,
              idLabel: 'Issue ID',
              idValue: 'I59',
              status: 'Open',
              statusTone: 'indigo',
              priorityLabel: 'Priority: Low',
              priorityTone: 'low',
              fields: [
                {
                  label: 'Issue',
                  value: 'Stakeholder alignment gaps - Different priorities across academia, government, and industry can slow usage',
                  wide: true,
                },
                {
                  label: 'Resolution',
                  value: 'Create a cross-sector governance framework with clearly defined roles, incentives, and accountability mechanisms',
                  wide: true,
                },
                { label: 'Issue Type', value: 'Stakeholders' },
                { label: 'Owner', value: 'Richelle Hilton', initials: 'MH', type: 'person' },
                { label: 'Due Date', value: '16/07/2026' },
              ],
            },
            {
              id: 'issue-i70',
              selected: true,
              idLabel: 'Issue ID',
              idValue: 'I70',
              status: 'Open',
              statusTone: 'indigo',
              priorityLabel: 'Priority: Medium',
              priorityTone: 'medium',
              fields: [
                {
                  label: 'Issue',
                  value: 'Stakeholder alignment gaps - Different priorities across academia, government, and industry can slow usage',
                  wide: true,
                },
                {
                  label: 'Resolution',
                  value: 'Create a cross-sector governance framework with clearly defined roles, incentives, and accountability mechanisms',
                  wide: true,
                },
                { label: 'Issue Type', value: 'Stakeholders' },
                { label: 'Owner', value: 'Richelle Hilton', initials: 'MH', type: 'person' },
                { label: 'Due Date', value: '16/07/2026' },
              ],
            },
          ],
        },
      ],
    },
    Resource: {},
    Dependencies: {},
  };
  readonly reportReviewAreas = [
    { label: 'Scope', status: 'On track', note: 'Baseline unchanged', tone: 'green' },
    { label: 'Schedule', status: 'On track', note: '', tone: 'green' },
    { label: 'Budget', status: 'On track', note: '', tone: 'green' },
    { label: 'Benefits', status: 'On track', note: '', tone: 'green' },
    { label: 'Risks', status: 'Off track', note: 'RAID refresh required', tone: 'red' },
    { label: 'Issues', status: 'On track', note: '', tone: 'green' },
    { label: 'Resource', status: 'On track', note: '', tone: 'green' },
    { label: 'Dependencies', status: 'On track', note: '', tone: 'green' },
  ];
  readonly detailedReportItemMap: Record<string, ReportDetailItem[]> = {
    Schedule: [
      {
        title: 'Initiation stage gate',
        body: 'Evidence pack and approval route for the current stage.',
        icon: 'stageGate',
        status: 'Alert',
        tone: 'amber',
        meta: 'Due 22 May 2026',
        owner: 'PMO Desk',
        progressLabel: 'Completion',
        progressValue: '68%',
        comment: 'Gate evidence is mostly ready. Sponsor confirmation is still pending.',
      },
      {
        title: 'Product design milestone',
        body: 'Design sign-off, user journey coverage, and acceptance checks.',
        icon: 'milestone',
        status: 'On track',
        tone: 'green',
        meta: 'Forecast 22 Sep 2026',
        owner: 'Vikas Nagpal',
        progressLabel: 'Completion',
        progressValue: '42%',
        comment: 'Design activities remain aligned to the current forecast.',
      },
    ],
    Budget: [
      {
        title: 'FY 2026-2027 baseline',
        body: 'Approved CAPEX and OPEX baseline for the active reporting year.',
        icon: 'dollar',
        status: 'On track',
        tone: 'green',
        meta: 'SAR 1.62M approved',
        owner: 'Finance Office',
        progressLabel: 'Variance',
        progressValue: '0%',
        comment: 'No variance to report against the approved baseline.',
      },
      {
        title: 'Funding sources',
        body: 'Confirmed and pending source lines backing this reporting period.',
        icon: 'checklist',
        status: 'Alert',
        tone: 'amber',
        meta: '1 pending approval',
        owner: 'Corporate Finance',
        progressLabel: 'Confirmed',
        progressValue: '69%',
        comment: 'Corporate co-funding approval remains the only open funding item.',
      },
    ],
    Benefits: [
      {
        title: 'Research discovery benefit',
        body: 'Improved ability to find capabilities, owners, and partnership routes.',
        icon: 'benefitGraph',
        status: 'Alert',
        tone: 'amber',
        meta: 'Owner response pending',
        owner: 'Research Leads Forum',
        progressLabel: 'Realization',
        progressValue: '35%',
        comment: 'Owner confirmation is needed before the benefit can be marked committed.',
      },
      {
        title: 'Reduced duplicate intake',
        body: 'Reusable intake records reduce repeated stakeholder discovery work.',
        icon: 'benefit',
        status: 'On track',
        tone: 'green',
        meta: 'Evidence drafted',
        owner: 'PMO Desk',
        progressLabel: 'Realization',
        progressValue: '28%',
        comment: 'Baseline measure has been drafted for PMO review.',
      },
    ],
    Risks: [
      {
        title: 'Stakeholder data quality',
        body: 'Capability and owner records may remain incomplete without source validation.',
        icon: 'risks',
        status: 'Off track',
        tone: 'red',
        meta: 'High exposure',
        owner: 'Data Steward',
        progressLabel: 'Mitigation',
        progressValue: '22%',
        comment: 'RAID refresh is required before this risk can move back to alert.',
      },
      {
        title: 'Sponsor availability',
        body: 'Steering decisions may slip if sponsor review windows compress.',
        icon: 'bell',
        status: 'Alert',
        tone: 'amber',
        meta: 'Review this week',
        owner: 'Muna Hassan',
        progressLabel: 'Mitigation',
        progressValue: '54%',
        comment: 'Backup reviewer identified; sponsor confirmation is still preferred.',
      },
    ],
    Issues: [
      {
        title: 'Open PMO decision',
        body: 'Clarify which evidence artefacts are mandatory for initiation approval.',
        icon: 'issues',
        status: 'On track',
        tone: 'green',
        meta: 'Decision due 16 May',
        owner: 'PMO Desk',
        progressLabel: 'Resolution',
        progressValue: '60%',
        comment: 'No blocker escalated; decision is tracking inside the PMO window.',
      },
      {
        title: 'Access request queue',
        body: 'Research partner access requests need final routing confirmation.',
        icon: 'link',
        status: 'Alert',
        tone: 'amber',
        meta: '3 requests queued',
        owner: 'Delivery Office',
        progressLabel: 'Resolution',
        progressValue: '45%',
        comment: 'Routing rule is drafted and waiting for stakeholder validation.',
      },
    ],
    Resource: [
      {
        title: 'Core delivery team',
        body: 'Project manager, analyst, and data steward coverage for the next period.',
        icon: 'resources',
        status: 'On track',
        tone: 'green',
        meta: '3 roles assigned',
        owner: 'Muna Hassan',
        progressLabel: 'Coverage',
        progressValue: '100%',
        comment: 'Core team remains assigned for the upcoming reporting period.',
      },
      {
        title: 'Change support',
        body: 'Part-time change support for stakeholder briefings and adoption planning.',
        icon: 'changeRequest',
        status: 'Alert',
        tone: 'amber',
        meta: '0.4 FTE requested',
        owner: 'Change team',
        progressLabel: 'Coverage',
        progressValue: '40%',
        comment: 'Shared resource approval is pending but not yet blocking delivery.',
      },
    ],
    Dependencies: [
      {
        title: 'Data source onboarding',
        body: 'Upstream onboarding must finish before validation and discovery build-out.',
        icon: 'dependencies',
        status: 'Alert',
        tone: 'amber',
        meta: 'External owner',
        owner: 'Muna Hassan',
        progressLabel: 'Readiness',
        progressValue: '48%',
        comment: 'External owner needs to confirm the final source onboarding date.',
      },
      {
        title: 'Research portal rollout',
        body: 'Downstream rollout depends on capability data and service readiness.',
        icon: 'route',
        status: 'On track',
        tone: 'green',
        meta: 'Successor project',
        owner: 'Delivery Office',
        progressLabel: 'Readiness',
        progressValue: '65%',
        comment: 'Successor team is aligned to the current forecast.',
      },
    ],
  };
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
  readonly budgetPlanConfig = budgetPlanConfig;
  readonly riskPlanEmptyState = riskPlanEmptyState;
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
  readonly overviewStrategicObjectiveLinks = overviewStrategicObjectiveLinkSeeds;
  readonly overviewBusinessPlanSignals = overviewBusinessPlanSignalSeeds;
  readonly changeRequestTypeOptions = changeRequestTypeOptions;
  readonly changeRequestPriorityOptions = changeRequestPriorityOptions;
  readonly changeRequestTriggerOptions = changeRequestTriggerOptions;
  readonly changeRequestImpactBenefits = changeRequestImpactBenefits;
  readonly changeRequestImpactCapabilities = changeRequestImpactCapabilities;
  readonly changeRequestImpactProjects = changeRequestImpactProjects;
  readonly changeRequestDrawerTabs: { id: ChangeRequestDrawerTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'info' },
    { id: 'impact', label: 'Impact Assessment', icon: 'chart' },
    { id: 'links', label: 'Related Links', icon: 'link' },
  ];
  readonly changeRequestImpactTabs: { id: ChangeRequestImpactTab; label: string }[] = [
    { id: 'benefits', label: 'Impacted Benefits' },
    { id: 'capabilities', label: 'Impacted Capabilities' },
    { id: 'projects', label: 'Impacted Projects / Products' },
  ];

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
  activeReportMode: ReportDetailMode = 'detailed';
  selectedStageGateKey: string | null = null;
  selectedStageRevokeKey: string | null = null;
  submittedStageGateKeys: string[] = [];
  attachedStageGateEvidenceKeys: string[] = [];
  stageGateChecklistState: Record<string, boolean[]> = {};
  projectStageOverrideIndex: Record<string, number> = {};
  overviewState: OverviewState = { ...overviewStateInitial };
  isOverviewBusinessDriverDrawerOpen = false;
  editingOverviewBusinessDriverId: string | null = null;
  overviewBusinessDriverRows: OverviewBusinessDriverRow[] = overviewBusinessDriverRowsInitial.map((row) => ({ ...row }));
  overviewBusinessDriverDraft: OverviewBusinessDriverDraft = { ...overviewBusinessDriverDraftInitial };
  isOverviewOutcomeDrawerOpen = false;
  editingOverviewOutcomeId: string | null = null;
  overviewOutcomeRows: OverviewOutcomeRow[] = overviewOutcomeRowsInitial.map((row) => ({ ...row }));
  overviewOutcomeDraft: OverviewOutcomeDraft = { ...overviewOutcomeDraftInitial };
  isOverviewObjectiveDrawerOpen = false;
  editingOverviewObjectiveId: string | null = null;
  overviewObjectiveRows: OverviewObjectiveRow[] = overviewObjectiveRowsInitial.map((row) => ({ ...row }));
  overviewObjectiveDraft: OverviewObjectiveDraft = { ...overviewObjectiveDraftInitial };
  isOverviewCapabilityDrawerOpen = false;
  editingOverviewCapabilityId: string | null = null;
  overviewCapabilityRows: OverviewCapabilityRow[] = overviewCapabilityRowsInitial.map((row) => ({ ...row }));
  overviewCapabilityDraft: OverviewCapabilityDraft = {
    selectedCapabilities: [...overviewCapabilityDraftInitial.selectedCapabilities],
  };
  isOverviewServiceDrawerOpen = false;
  editingOverviewServiceId: string | null = null;
  overviewServiceRows: OverviewServiceRow[] = overviewServiceRowsInitial.map((row) => ({ ...row }));
  overviewServiceDraft: OverviewServiceDraft = { ...overviewServiceDraftInitial };
  scheduleScopeState: ScheduleScopeState = { ...scheduleScopeStateInitial };
  isScheduleMilestoneDrawerOpen = false;
  editingScheduleMilestoneId: string | null = null;
  scheduleMilestoneRows: ScheduleMilestoneRow[] = scheduleMilestoneRowsInitial.map((row) => ({ ...row }));
  scheduleMilestoneDraft: ScheduleMilestoneDraft = { ...scheduleMilestoneDraftInitial };
  isScheduleEndProductDrawerOpen = false;
  editingScheduleEndProductId: string | null = null;
  scheduleEndProductRows: ScheduleScopeProductRow[] = scheduleEndProductRowsInitial.map((row) => ({
    ...row,
    predecessors: [...row.predecessors],
    successors: [...row.successors],
  }));
  scheduleEndProductDraft: ScheduleScopeProductDraft = { ...scheduleEndProductDraftInitial };
  isScheduleManagementProductDrawerOpen = false;
  editingScheduleManagementProductId: string | null = null;
  scheduleManagementProductRows: ScheduleManagementProductRow[] = scheduleManagementProductRowsInitial.map((row) => ({ ...row }));
  scheduleManagementProductDraft: ScheduleManagementProductDraft = { ...scheduleManagementProductDraftInitial };
  isBudgetDrawerOpen = false;
  isBudgetFundingDrawerOpen = false;
  isBudgetMonthlyDrawerOpen = false;
  isBudgetRulesOpen = false;
  isBenefitDrawerOpen = false;
  isRiskDrawerOpen = false;
  isIssueDrawerOpen = false;
  isRelatedLinksDrawerOpen = false;
  isResourceDrawerOpen = false;
  isChangeImpactDrawerOpen = false;
  isChangeRequestDrawerOpen = false;
  editingChangeRequestId: string | null = null;
  changeRequestStatusFilter: ChangeRequestStatusFilter = 'active';
  changeRequestDrawerTab: ChangeRequestDrawerTab = 'overview';
  changeRequestImpactTab: ChangeRequestImpactTab = 'benefits';
  editingRiskPlanId: string | null = null;
  activeRiskProfileId: string | null = null;
  activeRiskProfileTab: RiskProfileTab = 'identification';
  riskDrawerOpenProfileAfterSave = false;
  activeDependencyRegisterKey: DependencyRegisterKey | null = null;
  budgetPlanStates: Record<string, BudgetPlanState> = this.cloneBudgetPlanStateMap(budgetPlanSeeds);
  budgetYearDraft: BudgetYearDraft = { ...budgetPlanConfig.yearDraft };
  budgetFundingSourceDraft: BudgetFundingSourceDraft = { ...budgetPlanConfig.fundingDraft };
  budgetMonthlyEditorRows: BudgetMonthlyRow[] = [];
  activeBudgetSubtab: BudgetSubtab = 'funding';
  benefitPlanRows: BenefitPlanRow[] = benefitPlanConfig.rows.map((row) => ({ ...row }));
  benefitPlanDraft: BenefitPlanDraft = { ...benefitPlanConfig.draft };
  riskPlanRows: RiskPlanRow[] = riskPlanConfig.rows.map((row) => ({
    ...row,
    treatments: row.treatments.map((treatment) => ({ ...treatment })),
  }));
  riskPlanDraft: RiskPlanDraft = {
    ...riskPlanConfig.draft,
    treatments: riskPlanConfig.draft.treatments.map((treatment) => ({ ...treatment })),
  };
  riskTreatmentDraft: RiskTreatmentDraft = { ...riskTreatmentDraftInitial };
  issuePlanRows: IssuePlanRow[] = issuePlanConfig.rows.map((row) => ({ ...row }));
  issuePlanDraft: IssuePlanDraft = { ...issuePlanConfig.draft };
  relatedLinkRows: RelatedLinkRow[] = relatedLinkConfig.rows.map((row) => ({ ...row }));
  relatedLinkDraft: RelatedLinkDraft = { ...relatedLinkConfig.draft };
  resourcePlanRows: ResourcePlanRow[] = resourcePlanConfig.rows.map((row) => ({ ...row }));
  resourcePlanDraft: ResourcePlanDraft = { ...resourcePlanConfig.draft };
  changeImpactRows: ChangeImpactRow[] = changeImpactConfig.rows.map((row) => ({ ...row, strategies: [...row.strategies] }));
  changeImpactDraft: ChangeImpactDraft = { ...changeImpactConfig.draft, strategies: [...changeImpactConfig.draft.strategies] };
  readonly closureReasonOptionsList = closureReasonOptions;
  readonly closureOverviewBlockList = closureOverviewBlocks;
  readonly closureChecklistList = closureChecklistItems;
  readonly closureFollowUpActionList = closureFollowUpActions;
  readonly closureRecommendationList = closureRecommendations;
  readonly closureBenefitRowList = closureBenefitRows;
  readonly closureRiskRowList = closureRiskRows;
  readonly closureIssueRowList = closureIssueRows;
  readonly closureLessonRowList = closureLessonRows;
  changeRequestRows: ChangeRequestRow[] = changeRequestRowsInitial.map((row) => ({
    ...row,
    types: [...row.types],
    relatedLinks: row.relatedLinks.map((link) => ({ ...link })),
  }));
  changeRequestDraft: ChangeRequestDraft = {
    ...changeRequestDraftInitial,
    types: [...changeRequestDraftInitial.types],
    relatedLinks: changeRequestDraftInitial.relatedLinks.map((link) => ({ ...link })),
  };
  dependencyRegisterRows: Record<DependencyRegisterKey, DependencyRegisterRow[]> = {
    predecessor: dependencyRegisterConfigs.predecessor.rows.map((row) => ({ ...row })),
    successor: dependencyRegisterConfigs.successor.rows.map((row) => ({ ...row })),
  };
  dependencyRegisterDrafts: Record<DependencyRegisterKey, DependencyRegisterDraft> = {
    predecessor: { ...dependencyRegisterConfigs.predecessor.draft },
    successor: { ...dependencyRegisterConfigs.successor.draft },
  };
  activeReportSection = 'Scope';
  projectPlanEntry: ProjectPlanEntry = 'quick';
  projectPlanDetailMode: ProjectPlanDetailMode = 'simple';
  projectPlanActiveSection = 'Overview';
  projectPlanSectionsExpanded = false;
  projectPlanExpandedFieldSections: Record<string, boolean> = { 'Schedule & Scope': true };
  activeClosureSection: ClosureSectionId = 'overview';
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
    return [...this.primaryProjectPlanSections, ...this.additionalProjectPlanSections];
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
    return 'Additional fields';
  }

  get activeProjectPlanUsesIntermediateSplit(): boolean {
    const fields = this.projectPlanFieldsForSection(this.projectPlanActiveSection);
    return fields.some((field) => field.intermediate) && !this.isProjectPlanDetailedOnlySection(this.projectPlanActiveSection);
  }

  get overviewDriverDrawerTitle(): string {
    return this.editingOverviewBusinessDriverId ? 'Edit business driver' : 'Add business driver';
  }

  get overviewOutcomeDrawerTitle(): string {
    return this.editingOverviewOutcomeId ? 'Edit outcome' : 'Add outcome';
  }

  get overviewObjectiveDrawerTitle(): string {
    return this.editingOverviewObjectiveId ? 'Edit project objective' : 'Add project objective';
  }

  get overviewCapabilityDrawerTitle(): string {
    return this.editingOverviewCapabilityId ? 'Edit linked capability' : 'Link capabilities';
  }

  get overviewServiceDrawerTitle(): string {
    return this.editingOverviewServiceId ? 'Edit linked service' : 'Link service';
  }

  get overviewBusinessDriverOptions(): OverviewBusinessDriverOption[] {
    return overviewBusinessDriverOptionSeeds;
  }

  get overviewBusinessDriverOptionLabels(): string[] {
    return overviewBusinessDriverOptionSeeds.map((option) => option.driver);
  }

  get overviewOutcomeStatusOptions(): string[] {
    return overviewOutcomeStatusOptions;
  }

  get overviewObjectiveStatusOptions(): string[] {
    return overviewObjectiveStatusOptions;
  }

  get overviewCapabilityOptions(): OverviewCapabilityOption[] {
    return overviewCapabilityOptionSeeds;
  }

  get overviewServiceGroupOptions(): string[] {
    return Array.from(new Set(overviewServiceOptionSeeds.map((item) => item.serviceGroup)));
  }

  get overviewServiceValueStreamOptions(): string[] {
    return Array.from(
      new Set(
        overviewServiceOptionSeeds
          .filter((item) => !this.overviewServiceDraft.serviceGroup || item.serviceGroup === this.overviewServiceDraft.serviceGroup)
          .map((item) => item.valueStream),
      ),
    );
  }

  get overviewServicePhaseOptions(): string[] {
    return Array.from(
      new Set(
        overviewServiceOptionSeeds
          .filter((item) => !this.overviewServiceDraft.serviceGroup || item.serviceGroup === this.overviewServiceDraft.serviceGroup)
          .filter((item) => !this.overviewServiceDraft.valueStream || item.valueStream === this.overviewServiceDraft.valueStream)
          .map((item) => item.phase),
      ),
    );
  }

  get overviewServiceOptions(): string[] {
    return Array.from(
      new Set(
        overviewServiceOptionSeeds
          .filter((item) => !this.overviewServiceDraft.serviceGroup || item.serviceGroup === this.overviewServiceDraft.serviceGroup)
          .filter((item) => !this.overviewServiceDraft.valueStream || item.valueStream === this.overviewServiceDraft.valueStream)
          .filter((item) => !this.overviewServiceDraft.phase || item.phase === this.overviewServiceDraft.phase)
          .map((item) => item.service),
      ),
    );
  }

  get overviewGovernanceLinkCount(): number {
    return this.overviewCapabilityRows.length + this.overviewServiceRows.length;
  }

  get overviewSelectedCapabilityCount(): number {
    return this.overviewCapabilityDraft.selectedCapabilities.length;
  }

  get scheduleScopeOwnerOptions(): string[] {
    return scheduleScopeOwnerOptions;
  }

  get scheduleScopePriorityOptions(): string[] {
    return scheduleScopePriorityOptions;
  }

  get scheduleScopeCategoryOptions(): string[] {
    return scheduleScopeCategoryOptions;
  }

  get scheduleScopeCapabilityOptions(): string[] {
    return scheduleScopeCapabilityOptions;
  }

  get scheduleScopeExistingEndProducts(): typeof scheduleScopeExistingEndProducts {
    return scheduleScopeExistingEndProducts;
  }

  get scheduleScopeMilestoneDrawerTitle(): string {
    return this.editingScheduleMilestoneId ? 'Edit milestone' : 'Add milestone';
  }

  get scheduleScopeEndProductDrawerTitle(): string {
    return this.editingScheduleEndProductId ? 'Edit end product' : 'Add end product';
  }

  get scheduleScopeManagementProductDrawerTitle(): string {
    return this.editingScheduleManagementProductId ? 'Edit management product' : 'Add management product';
  }

  get scheduleScopeForecastShiftLabel(): string {
    return this.scheduleScopeDateShiftLabel(this.scheduleScopeState.baselineEnd, this.scheduleScopeState.forecastEnd);
  }

  get scheduleScopeRegisterCount(): number {
    return this.scheduleEndProductRows.length + this.scheduleManagementProductRows.length;
  }

  get scheduleScopeWbsHighlights() {
    return this.wbsItems.slice(0, 3);
  }

  get activeBudgetPlan(): BudgetPlanState {
    const plan = this.budgetPlanStates[this.activeBudgetPlanKey()] || this.budgetPlanStates['default'];
    return plan.years.length ? plan : this.budgetPlanStates['default'];
  }

  get activeBudgetYear(): BudgetYearPlan | null {
    const plan = this.activeBudgetPlan;
    if (!plan.years.length) return null;
    return plan.years.find((year) => year.fy === plan.selectedFy) || plan.years[0];
  }

  get activeBudgetHasData(): boolean {
    return this.activeBudgetPlan.years.length > 0;
  }

  get activeBudgetOverviewMetrics(): BudgetPlanMetric[] {
    const plan = this.activeBudgetPlan;
    const baseline = plan.years.reduce((total, year) => total + this.budgetYearBaselineTotal(year), 0);
    const forecast = plan.years.reduce((total, year) => total + this.budgetYearForecastTotal(year), 0);
    const actual = plan.years.reduce((total, year) => total + this.budgetYearActualTotal(year), 0);
    const committed = plan.years.reduce((total, year) => total + this.budgetYearCommittedTotal(year), 0);
    const available = forecast - actual - committed;
    const variance = forecast - baseline;

    return [
      {
        label: 'Total project budget',
        value: this.formatBudgetCurrency(baseline),
        helper: plan.years.length ? `${plan.years.length} FYs tracked` : 'No fiscal years set up yet',
        tone: 'neutral',
      },
      {
        label: 'Forecast',
        value: this.formatBudgetCurrency(forecast),
        helper: 'Rolls up from FY and monthly phasing',
        tone: 'neutral',
      },
      {
        label: 'Forecast variance',
        value: this.formatBudgetSignedCurrency(variance),
        helper: this.formatBudgetPercent(variance, baseline),
        tone: this.budgetVarianceTone(variance),
      },
      {
        label: 'Committed',
        value: this.formatBudgetCurrency(committed),
        helper: 'From monthly committed values',
        tone: committed > 0 ? 'amber' : 'neutral',
      },
      {
        label: 'Actual spent',
        value: this.formatBudgetCurrency(actual),
        helper: 'From monthly actuals',
        tone: actual > 0 ? 'neutral' : 'amber',
      },
      {
        label: 'Available budget',
        value: this.formatBudgetCurrency(available),
        helper: 'Forecast - actual - committed',
        tone: available < 0 ? 'red' : 'green',
      },
    ];
  }

  get activeBudgetBreakdownRows(): BudgetBreakdownRow[] {
    const year = this.activeBudgetYear;
    if (!year) return [];
    const capexActual = year.monthlyRows.reduce((total, row) => total + row.capexActual, 0);
    const opexActual = year.monthlyRows.reduce((total, row) => total + row.opexActual, 0);
    const capexCommitted = year.monthlyRows.reduce((total, row) => total + row.capexCommitted, 0);
    const opexCommitted = year.monthlyRows.reduce((total, row) => total + row.opexCommitted, 0);

    return [
      {
        stream: 'CAPEX',
        baseline: year.baselineCapex,
        forecast: year.forecastCapex,
        actual: capexActual,
        committed: capexCommitted,
      },
      {
        stream: 'OPEX',
        baseline: year.baselineOpex,
        forecast: year.forecastOpex,
        actual: opexActual,
        committed: opexCommitted,
      },
      {
        stream: 'Total',
        baseline: year.baselineCapex + year.baselineOpex,
        forecast: year.forecastCapex + year.forecastOpex,
        actual: capexActual + opexActual,
        committed: capexCommitted + opexCommitted,
      },
    ];
  }

  get activeBudgetFundingPreviewRows(): BudgetFundingSourceRow[] {
    return this.activeBudgetYear?.fundingSources.slice(0, 3) || [];
  }

  get activeBudgetMonthlyPreviewRows(): BudgetMonthlyRow[] {
    return this.activeBudgetYear?.monthlyRows.slice(0, 4) || [];
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

  get activeRiskPlan(): RiskPlanConfig {
    return {
      ...riskPlanConfig,
      rows: this.riskPlanRows,
      draft: this.riskPlanDraft,
    };
  }

  get activeRiskDrawer(): RiskPlanConfig | null {
    return this.isRiskDrawerOpen ? this.activeRiskPlan : null;
  }

  get activeRiskProfile(): RiskPlanRow | null {
    if (!this.activeRiskProfileId) return null;
    return this.riskPlanRows.find((row) => row.id === this.activeRiskProfileId) || null;
  }

  get riskDrawerTitle(): string {
    return this.editingRiskPlanId ? 'Edit risk' : 'Add risk';
  }

  get riskDrawerCharacterCount(): number {
    return Math.max(0, 500 - this.riskPlanDraft.riskName.length);
  }

  get riskProfileTabs(): { id: RiskProfileTab; label: string; icon: string }[] {
    return [
      { id: 'identification', label: 'Identification', icon: 'info' },
      { id: 'analysis', label: 'Analysis', icon: 'chart' },
      { id: 'treatment', label: 'Treatment', icon: 'checklist' },
    ];
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

  get activeChangeRequestRows(): ChangeRequestRow[] {
    return this.changeRequestRows.filter((row) => !this.isClosedChangeRequest(row));
  }

  get visibleChangeRequestRows(): ChangeRequestRow[] {
    if (this.changeRequestStatusFilter === 'closed') {
      return this.changeRequestRows.filter((row) => this.isClosedChangeRequest(row));
    }
    if (this.changeRequestStatusFilter === 'overdue') {
      return this.activeChangeRequestRows.filter((row) => this.isOverdueChangeRequest(row));
    }
    return this.activeChangeRequestRows;
  }

  get changeRequestTabs(): ChangeRequestTab[] {
    return [
      { id: 'active', label: 'Active', count: this.activeChangeRequestRows.length },
      { id: 'overdue', label: 'Overdue', count: this.activeChangeRequestRows.filter((row) => this.isOverdueChangeRequest(row)).length },
      { id: 'closed', label: 'Closed', count: this.changeRequestRows.filter((row) => this.isClosedChangeRequest(row)).length },
    ];
  }

  get changeRequestMetrics(): ChangeRequestMetric[] {
    return [
      { label: 'Budget(s)', value: this.changeRequestTypeCount('Budget'), icon: 'dollar', tone: 'neutral' },
      { label: 'Schedule(s)', value: this.changeRequestTypeCount('Schedule'), icon: 'calendar', tone: 'blue' },
      { label: 'Scope(s)', value: this.changeRequestTypeCount('Scope'), icon: 'target', tone: 'green' },
      { label: 'Total', value: this.activeChangeRequestRows.length, icon: 'changeRequest', tone: 'brand' },
    ];
  }

  get changeRequestDrawerTitle(): string {
    return this.editingChangeRequestId ? 'Edit change request' : 'Create change request';
  }

  get changeRequestDrawerSummary(): string {
    const selectedTypes = this.changeRequestDraft.types.length ? this.changeRequestDraft.types.join(', ') : 'No type selected';
    return `${selectedTypes} · ${this.changeRequestDraft.priority || 'Priority not set'}`;
  }

  get changeRequestCommentCharactersRemaining(): number {
    return Math.max(0, 3000 - this.changeRequestDraft.changeDetails.length);
  }

  get closureNavigationItems(): ClosureNavItem[] {
    return [
      { id: 'overview', label: 'Overview', icon: 'closure' },
      { id: 'budget', label: 'Budget', icon: 'dollar', count: this.activeBudgetBreakdownRows.length },
      { id: 'benefits', label: 'Benefits', icon: 'benefit', count: this.closureBenefitRowList.length },
      { id: 'risk', label: 'Risk', icon: 'risks', count: this.closureRiskRowList.length },
      { id: 'issues', label: 'Issues', icon: 'issues', count: this.closureIssueRowList.length },
      { id: 'lessons', label: 'Lessons learnt', icon: 'lessons', count: this.closureLessonRowList.length },
    ];
  }

  get activeClosureNavItem(): ClosureNavItem {
    return this.closureNavigationItems.find((item) => item.id === this.activeClosureSection) || this.closureNavigationItems[0];
  }

  get closureReadyItemCount(): number {
    return this.closureChecklistList.filter((item) => item.tone === 'green').length;
  }

  get closureReadinessPercent(): number {
    if (!this.closureChecklistList.length) return 0;
    return Math.round((this.closureReadyItemCount / this.closureChecklistList.length) * 100);
  }

  get closureOpenActionCount(): number {
    return this.closureFollowUpActionList.filter((row) => row.status.toLowerCase().includes('open')).length;
  }

  get closureOverviewMetrics(): ClosureMetric[] {
    const budgetVariance = this.activeBudgetOverviewMetrics.find((metric) => metric.label.toLowerCase().includes('variance'));
    return [
      {
        label: 'Closure status',
        value: 'Draft',
        helper: 'Ready for PMO review once open checks are cleared',
        icon: 'closure',
        tone: 'amber',
      },
      {
        label: 'Readiness',
        value: `${this.closureReadinessPercent}%`,
        helper: `${this.closureReadyItemCount} of ${this.closureChecklistList.length} closure checks ready`,
        icon: 'checklist',
        tone: this.closureReadinessPercent >= 75 ? 'green' : 'amber',
      },
      {
        label: 'Budget variance',
        value: budgetVariance?.value || 'SAR 0',
        helper: budgetVariance?.helper || 'No variance recorded',
        icon: 'dollar',
        tone: budgetVariance?.tone || 'neutral',
      },
      {
        label: 'Open follow-ups',
        value: String(this.closureOpenActionCount),
        helper: `${this.closureFollowUpActionList.length} actions captured for closure`,
        icon: 'todo',
        tone: this.closureOpenActionCount ? 'amber' : 'green',
      },
    ];
  }

  get closureBudgetSummaryLabel(): string {
    const year = this.activeBudgetYear;
    return year ? `${year.fy} closure budget position` : 'Budget position';
  }

  get closureBudgetEvidenceCount(): string {
    const year = this.activeBudgetYear;
    if (!year) return 'No evidence';
    const count = year.fundingSources.length + year.monthlyRows.length;
    return count === 1 ? '1 evidence item' : `${count} evidence items`;
  }

  get closureBenefitManager(): string {
    return this.closureBenefitRowList[0]?.owner || 'Benefit owner TBD';
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
    if (this.projectPlanEntry === 'stages') return 'Stages';
    return 'Project Plan';
  }

  get workspaceTitle(): string {
    if (this.onboardingPm101Locked || this.isPm101WelcomeWorkspace) return 'Welcome!';
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

  get isNormalPm101Workspace(): boolean {
    return this.frontDoorMode === 'assigned' && !this.pmoAssignmentReady && !this.onboardingPm101Locked && this.selectedPage === 'workspace' && this.selectedProject === 'all';
  }

  get isPm101WelcomeWorkspace(): boolean {
    return this.isPm101OnboardingWorkspaceFlow || this.isNormalPm101Workspace;
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
      icon: 'info',
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
        icon: this.simpleReportSectionIcon(section),
        status: guide.status,
        tone: guide.tone,
        trend: this.simpleReportTrendForTone(guide.tone),
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
      icon: 'info',
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
      icon: this.reportSectionIcon(area.label),
      status: area.status,
      tone: area.tone,
      trend: this.reportTrendForTone(area.tone),
      comments: area.label === 'Scope' ? '' : area.note,
      timeline: this.detailedReportSharedTimelineSections.has(area.label) ? this.scopePastStatuses : this.reportTimelineForTone(area.tone),
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

  get selectedStageRevokeContext(): StageGateContext | null {
    return this.stageGateContext(this.selectedStageRevokeKey);
  }

  get projectPlanStageProfile(): StageProfile {
    return this.stageProfileForProject(this.scopedProjectName) || this.stageProfilesForSelection[0] || stageProfiles[0];
  }

  get projectPlanStageRows(): ProjectPlanStageRow[] {
    const profile = this.projectPlanStageProfile;
    return stageDefinitions.map((stage, stageIndex) => {
      const status = this.stageStatus(profile, stageIndex);
      const dates = projectPlanStageDateWindows[stage.id] || { start: 'TBD', end: 'TBD' };
      return {
        stage,
        stageIndex,
        status,
        statusLabel: this.projectPlanStageStatusLabel(status),
        statusTone: this.projectPlanStageStatusTone(status),
        startDate: dates.start,
        endDate: dates.end,
        actionLabel: this.projectPlanStageActionLabel(profile, stageIndex, status),
        actionIcon: this.projectPlanStageActionIcon(status),
        actionDisabled: this.projectPlanStageActionDisabled(status),
        canRevoke: this.canRevokeProjectPlanStage(profile, stageIndex, status),
      };
    });
  }

  get projectPlanActiveStageRow(): ProjectPlanStageRow {
    return this.projectPlanStageRows.find((row) => row.status === 'current' || row.status === 'submitted' || row.status === 'revoked') || this.projectPlanStageRows[0];
  }

  get projectPlanNextStageRow(): ProjectPlanStageRow | null {
    return this.projectPlanStageRows.find((row) => row.stageIndex === this.projectPlanActiveStageRow.stageIndex + 1) || null;
  }

  get projectPlanApprovedStageCount(): number {
    return this.projectPlanStageRows.filter((row) => row.status === 'complete').length;
  }

  get projectPlanStageProgressWidth(): string {
    const total = Math.max(1, this.projectPlanStageRows.length - 1);
    const progress = Math.min(100, Math.max(0, (this.projectPlanActiveStageRow.stageIndex / total) * 100));
    return `${progress}%`;
  }

  get projectPlanStageReadinessLabel(): string {
    const profile = this.projectPlanStageProfile;
    const key = this.stageGateKey(profile.project, this.projectPlanActiveStageRow.stage.id);
    if (this.submittedStageGateKeys.includes(key)) return 'Submitted to PMO and awaiting approval';
    return `${this.stageGateCheckedCount(profile, this.projectPlanActiveStageRow.stageIndex)}/${profile.gateTotal} PMO checklist items ready`;
  }

  get projectPlanWorkflowPositionLabel(): string {
    const status = this.projectPlanActiveStageRow.status;
    if (status === 'submitted') return 'Waiting on PMO';
    if (status === 'complete') return 'Approved';
    return 'Preparing gate';
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
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (this.workspaceColumnMenuOpen) {
      const menu = this.elementRef.nativeElement.querySelector<HTMLElement>('[data-workspace-columns-menu]');
      if (!menu?.contains(target)) this.closeWorkspaceColumnMenu();
    }
    if (this.isBudgetRulesOpen) {
      const popover = this.elementRef.nativeElement.querySelector<HTMLElement>('[data-budget-rules-popover]');
      const trigger = this.elementRef.nativeElement.querySelector<HTMLElement>('[data-budget-rules-trigger]');
      if (!popover?.contains(target) && !trigger?.contains(target)) this.closeBudgetRulesPopover();
    }
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey(): void {
    if (this.workspaceColumnMenuOpen) {
      this.closeWorkspaceColumnMenu();
      return;
    }
    if (this.isBudgetRulesOpen) {
      this.closeBudgetRulesPopover();
      return;
    }
    if (this.isBudgetDrawerOpen || this.isBudgetFundingDrawerOpen || this.isBudgetMonthlyDrawerOpen || this.isBenefitDrawerOpen || this.isIssueDrawerOpen || this.isRelatedLinksDrawerOpen || this.isResourceDrawerOpen || this.isChangeImpactDrawerOpen || this.isChangeRequestDrawerOpen || this.activeDependencyRegister) {
      this.closeProjectPlanDrawers();
      return;
    }
    if (this.selectedStageGateKey) {
      this.closeStageGate();
      return;
    }
    if (this.selectedStageRevokeKey) {
      this.closeStageRevoke();
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
      this.selectedStageRevokeKey = null;
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
      this.selectedStageRevokeKey = null;
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
    this.selectedStageRevokeKey = null;
    this.projectPlanEntry = 'quick';
    this.projectPlanDetailMode = 'simple';
    this.projectPlanActiveSection = 'Overview';
    this.projectPlanSectionsExpanded = false;
    this.projectPlanExpandedFieldSections = {};
    this.emitState();
  }

  selectPm101Project(projectId: string): void {
    this.frontDoorMode = 'assigned';
    this.onboardingPm101Locked = false;
    this.selectedProject = projectId;
    this.selectedPage = 'workspace';
    this.selectedView = 'calendar';
    this.selectedBoardFilter = 'all';
    this.activeReportProject = null;
    this.selectedStageGateKey = null;
    this.selectedStageRevokeKey = null;
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
    this.selectedStageRevokeKey = null;
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
    if (entry === 'closure') this.activeClosureSection = 'overview';
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

  setChangeRequestStatusFilter(filter: ChangeRequestStatusFilter): void {
    this.changeRequestStatusFilter = filter;
    this.iconsHydrated = false;
  }

  setClosureSection(section: ClosureSectionId): void {
    if (this.activeClosureSection === section) return;
    this.activeClosureSection = section;
    this.iconsHydrated = false;
  }

  closureCharacterCount(block: ClosureTextBlock): string {
    return `${block.value.length}/${block.maxLength}`;
  }

  closureDateLabel(value: string): string {
    return this.formatProjectPlanDate(value);
  }

  setChangeRequestDrawerTab(tab: ChangeRequestDrawerTab): void {
    this.changeRequestDrawerTab = tab;
    this.iconsHydrated = false;
  }

  setChangeRequestImpactTab(tab: ChangeRequestImpactTab): void {
    this.changeRequestImpactTab = tab;
    this.iconsHydrated = false;
  }

  projectPlanNavLabel(section: string): string {
    const labels: Record<string, string> = {
      'Change Impact': 'Change impact',
      'Related Links': 'Related links',
    };
    return labels[section] || section;
  }

  isProjectPlanFieldSectionExpanded(section: string): boolean {
    if (section === 'Schedule & Scope' && this.projectPlanExpandedFieldSections[section] === undefined) return true;
    return Boolean(this.projectPlanExpandedFieldSections[section]);
  }

  toggleProjectPlanFieldSection(section: string): void {
    this.projectPlanExpandedFieldSections = {
      ...this.projectPlanExpandedFieldSections,
      [section]: !this.isProjectPlanFieldSectionExpanded(section),
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
    this.closeStageRevoke();
    this.selectedView = view;
    this.selectedPage = 'workspace';
    this.emitState();
  }

  navigate(page: ConsolePage, projectPlanEntry: ProjectPlanEntry = 'quick'): void {
    if (this.onboardingPm101Locked && page === 'workspaces') return;
    this.closeProjectPlanDrawers();
    this.closeReport();
    this.closeStageGate();
    this.closeStageRevoke();
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
    this.closeStageRevoke();
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
    this.closeStageRevoke();
    if (action.view && !this.isOnboardingPm101BlockedView(action.view)) this.selectedView = action.view;
    if (this.onboardingPm101Locked && action.page === 'workspaces') return;
    if (action.page) this.navigate(action.page, this.projectPlanEntryFromAction(action.entry));
    this.emitState();
  }

  openReport(project: string): void {
    this.closeProjectPlanDrawers();
    this.closeStageGate();
    this.closeStageRevoke();
    this.activeReportProject = project;
    this.activeReportMode = 'detailed';
    this.activeReportSection = 'Scope';
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
    this.activeReportMode = 'detailed';
    this.activeReportSection = 'Scope';
    this.iconsHydrated = false;
  }

  openStageGate(profile: StageProfile, stageIndex = this.stageCurrentIndex(profile)): void {
    this.closeProjectPlanDrawers();
    this.closeReport();
    this.closeStageRevoke();
    const stage = stageDefinitions[stageIndex] || stageDefinitions[this.stageCurrentIndex(profile)] || stageDefinitions[0];
    this.ensureStageGateChecklistState(profile, stageIndex);
    this.selectedStageGateKey = this.stageGateKey(profile.project, stage.id);
    this.iconsHydrated = false;
  }

  closeStageGate(): void {
    if (!this.selectedStageGateKey) return;
    this.selectedStageGateKey = null;
    this.iconsHydrated = false;
  }

  handleProjectPlanStageAction(row: ProjectPlanStageRow): void {
    if (row.actionDisabled) return;
    const profile = this.projectPlanStageProfile;
    this.openStageGate(profile, row.stageIndex);
  }

  openStageRevoke(row: ProjectPlanStageRow): void {
    const profile = this.projectPlanStageProfile;
    this.closeProjectPlanDrawers();
    this.closeReport();
    this.closeStageGate();
    this.selectedStageRevokeKey = this.stageGateKey(profile.project, row.stage.id);
    this.iconsHydrated = false;
  }

  closeStageRevoke(): void {
    if (!this.selectedStageRevokeKey) return;
    this.selectedStageRevokeKey = null;
    this.iconsHydrated = false;
  }

  confirmStageRevoke(gate: StageGateContext): void {
    this.projectStageOverrideIndex = {
      ...this.projectStageOverrideIndex,
      [gate.profile.project]: gate.stageIndex,
    };
    this.submittedStageGateKeys = this.submittedStageGateKeys.filter((key) => !key.startsWith(`${gate.profile.project}|`));
    this.closeStageRevoke();
    this.iconsHydrated = false;
  }

  budgetPlanYearCountLabel(plan: BudgetPlanState): string {
    return plan.years.length === 1 ? '1 FY tracked' : `${plan.years.length} FYs tracked`;
  }

  budgetPlanHasFy(plan: BudgetPlanState, fy: string): boolean {
    return plan.years.some((year) => year.fy === fy);
  }

  budgetFundingSourceCountLabel(year: BudgetYearPlan | null): string {
    if (!year) return 'No sources';
    return year.fundingSources.length === 1 ? '1 source' : `${year.fundingSources.length} sources`;
  }

  budgetMonthlyCountLabel(year: BudgetYearPlan | null): string {
    if (!year) return 'No months';
    return year.monthlyRows.length === 1 ? '1 month' : `${year.monthlyRows.length} months`;
  }

  budgetYearBaselineTotal(year: BudgetYearPlan): number {
    return year.baselineCapex + year.baselineOpex;
  }

  budgetYearForecastTotal(year: BudgetYearPlan): number {
    return year.forecastCapex + year.forecastOpex;
  }

  budgetYearActualTotal(year: BudgetYearPlan): number {
    return year.monthlyRows.reduce((total, row) => total + row.capexActual + row.opexActual, 0);
  }

  budgetYearCommittedTotal(year: BudgetYearPlan): number {
    return year.monthlyRows.reduce((total, row) => total + row.capexCommitted + row.opexCommitted, 0);
  }

  budgetYearAvailableTotal(year: BudgetYearPlan): number {
    return this.budgetYearForecastTotal(year) - this.budgetYearActualTotal(year) - this.budgetYearCommittedTotal(year);
  }

  budgetYearVariance(year: BudgetYearPlan): number {
    return this.budgetYearForecastTotal(year) - this.budgetYearBaselineTotal(year);
  }

  budgetFundingAllocatedTotal(year: BudgetYearPlan): number {
    return year.fundingSources.reduce((total, row) => total + row.amount, 0);
  }

  budgetFundingCoverageLabel(year: BudgetYearPlan): string {
    const baseline = this.budgetYearBaselineTotal(year);
    const allocated = this.budgetFundingAllocatedTotal(year);
    const delta = allocated - baseline;
    if (!baseline) return 'No FY baseline to compare yet';
    if (delta === 0) return 'Funding lines match the FY baseline';
    const direction = delta > 0 ? 'over' : 'under';
    return `${this.formatBudgetCurrency(Math.abs(delta))} ${direction} the FY baseline`;
  }

  budgetFundingCoverageTone(year: BudgetYearPlan): string {
    const delta = this.budgetFundingAllocatedTotal(year) - this.budgetYearBaselineTotal(year);
    if (delta === 0) return 'neutral';
    return delta > 0 ? 'amber' : 'red';
  }

  budgetStreamVariance(row: BudgetBreakdownRow): number {
    return row.forecast - row.baseline;
  }

  budgetStreamAvailable(row: BudgetBreakdownRow): number {
    return row.forecast - row.actual - row.committed;
  }

  budgetMonthlyTotal(row: BudgetMonthlyRow, kind: 'budget' | 'forecast' | 'actual' | 'committed'): number {
    if (kind === 'budget') return row.capexBudget + row.opexBudget;
    if (kind === 'forecast') return row.capexForecast + row.opexForecast;
    if (kind === 'actual') return row.capexActual + row.opexActual;
    return row.capexCommitted + row.opexCommitted;
  }

  budgetMonthlyAvailable(row: BudgetMonthlyRow): number {
    return this.budgetMonthlyTotal(row, 'forecast') - this.budgetMonthlyTotal(row, 'actual') - this.budgetMonthlyTotal(row, 'committed');
  }

  budgetMonthlyActualVariance(row: BudgetMonthlyRow): number {
    return this.budgetMonthlyTotal(row, 'forecast') - this.budgetMonthlyTotal(row, 'actual');
  }

  budgetBreakdownInputValue(row: BudgetBreakdownRow, field: BudgetBreakdownEditableField): string {
    const value = row[field];
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }

  formatBudgetCurrency(value: number): string {
    const absolute = Math.abs(value);
    const prefix = value < 0 ? '-' : '';
    if (absolute >= 1_000_000) {
      const millions = absolute / 1_000_000;
      const decimals = millions >= 10 ? 1 : 2;
      return `${prefix}SAR ${Number(millions.toFixed(decimals)).toLocaleString('en-US')}M`;
    }
    if (absolute >= 1_000) {
      const thousands = absolute / 1_000;
      const decimals = thousands >= 100 ? 0 : thousands >= 10 ? 1 : 2;
      return `${prefix}SAR ${Number(thousands.toFixed(decimals)).toLocaleString('en-US')}K`;
    }
    return `${prefix}SAR ${Number(absolute.toFixed(0)).toLocaleString('en-US')}`;
  }

  formatBudgetSignedCurrency(value: number): string {
    if (value === 0) return 'SAR 0';
    return `${value > 0 ? '+' : '-'}${this.formatBudgetCurrency(Math.abs(value))}`;
  }

  formatBudgetPercent(value: number, base: number): string {
    if (!base) return '0%';
    const percent = Math.abs(value / base) * 100;
    return `${value < 0 ? '-' : ''}${percent.toFixed(percent >= 10 ? 1 : 2)}%`;
  }

  budgetVarianceTone(value: number): 'neutral' | 'green' | 'amber' | 'red' {
    if (value === 0) return 'neutral';
    if (value > 0) return 'amber';
    return 'green';
  }

  selectBudgetFy(fy: string): void {
    if (!fy) return;
    this.updateActiveBudgetPlanState((plan) => ({
      ...plan,
      selectedFy: fy,
    }));
    this.closeBudgetRulesPopover();
    this.iconsHydrated = false;
  }

  selectBudgetTab(tab: BudgetSubtab): void {
    this.activeBudgetSubtab = tab;
    this.closeBudgetRulesPopover();
    this.iconsHydrated = false;
  }

  updateBudgetBreakdown(stream: string, field: BudgetBreakdownEditableField, value: string): void {
    const year = this.activeBudgetYear;
    if (!year || stream === 'Total') return;

    const amount = Math.max(0, this.parseBudgetInput(value));
    const budgetStream = stream === 'OPEX' ? 'OPEX' : 'CAPEX';

    this.updateActiveBudgetPlanState((plan) => ({
      ...plan,
      years: plan.years.map((entry) => {
        if (entry.fy !== year.fy) return entry;

        if (field === 'baseline' || field === 'forecast') {
          const nextYear: BudgetYearPlan = {
            ...entry,
            baselineCapex: field === 'baseline' && budgetStream === 'CAPEX' ? amount : entry.baselineCapex,
            baselineOpex: field === 'baseline' && budgetStream === 'OPEX' ? amount : entry.baselineOpex,
            forecastCapex: field === 'forecast' && budgetStream === 'CAPEX' ? amount : entry.forecastCapex,
            forecastOpex: field === 'forecast' && budgetStream === 'OPEX' ? amount : entry.forecastOpex,
          };

          return {
            ...nextYear,
            monthlyRows: this.redistributeBudgetMonthlyRows(entry.monthlyRows, entry.fy, nextYear),
          };
        }

        return {
          ...entry,
          monthlyRows: this.replaceBudgetMonthlyRollupTotal(entry.monthlyRows, budgetStream, field, amount),
        };
      }),
      lastSavedLabel: 'Unsaved changes',
    }));
  }

  saveBudgetChanges(): void {
    this.updateActiveBudgetPlanState((plan) => ({
      ...plan,
      lastSavedLabel: 'Saved just now',
    }));
    this.iconsHydrated = false;
  }

  openBudgetDrawer(): void {
    const year = this.activeBudgetYear;
    this.closeProjectPlanDrawers();
    this.budgetYearDraft = year
      ? {
          fy: year.fy,
          baselineCapex: String(year.baselineCapex),
          baselineOpex: String(year.baselineOpex),
          forecastCapex: String(year.forecastCapex),
          forecastOpex: String(year.forecastOpex),
        }
      : {
          ...budgetPlanConfig.yearDraft,
          fy: this.activeBudgetPlan.selectedFy || budgetPlanConfig.fyOptions[0],
        };
    this.isBudgetDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeBudgetDrawer(): void {
    if (!this.isBudgetDrawerOpen) return;
    this.isBudgetDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveBudgetDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveBudgetYearDraft()) return;

    const draft = this.budgetYearDraft;
    const fy = draft.fy.trim();
    const baselineCapex = this.parseBudgetInput(draft.baselineCapex);
    const baselineOpex = this.parseBudgetInput(draft.baselineOpex);
    const forecastCapex = this.parseBudgetInput(draft.forecastCapex);
    const forecastOpex = this.parseBudgetInput(draft.forecastOpex);

    this.updateActiveBudgetPlanState((plan) => {
      const existing = plan.years.find((year) => year.fy === fy);
      const nextYear = existing
        ? {
            ...existing,
            fy,
            baselineCapex,
            baselineOpex,
            forecastCapex,
            forecastOpex,
            monthlyRows: this.redistributeBudgetMonthlyRows(existing.monthlyRows, fy, {
              baselineCapex,
              baselineOpex,
              forecastCapex,
              forecastOpex,
            }),
          }
        : createBudgetYearPlan(
            `budget-year-${slugifyPlanField(`${this.activeBudgetPlanKey()}-${fy}`)}-${Date.now()}`,
            fy,
            baselineCapex,
            baselineOpex,
            forecastCapex,
            forecastOpex,
            [],
          );

      const years = existing
        ? plan.years.map((year) => (year.fy === fy ? nextYear : year))
        : [...plan.years, nextYear].sort((first, second) => this.budgetFySortValue(first.fy) - this.budgetFySortValue(second.fy));

      return {
        ...plan,
        selectedFy: fy,
        years,
        lastSavedLabel: 'Saved just now',
      };
    });

    this.closeBudgetDrawer();
  }

  updateBudgetYearDraft(field: keyof BudgetYearDraft, value: string): void {
    this.budgetYearDraft = {
      ...this.budgetYearDraft,
      [field]: value,
    };
  }

  canSaveBudgetYearDraft(): boolean {
    const draft = this.budgetYearDraft;
    return Boolean(
      draft.fy.trim() &&
        draft.baselineCapex.trim() &&
        draft.baselineOpex.trim() &&
        draft.forecastCapex.trim() &&
        draft.forecastOpex.trim(),
    );
  }

  openBudgetFundingDrawer(): void {
    if (!this.activeBudgetYear) {
      this.openBudgetDrawer();
      return;
    }
    this.closeProjectPlanDrawers();
    this.resetBudgetFundingDraft();
    this.isBudgetFundingDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeBudgetFundingDrawer(): void {
    if (!this.isBudgetFundingDrawerOpen) return;
    this.isBudgetFundingDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveBudgetFundingDrawer(event: Event): void {
    event.preventDefault();
    const year = this.activeBudgetYear;
    if (!year || !this.canSaveBudgetFundingDraft()) return;

    const draft = this.budgetFundingSourceDraft;
    const nextRow: BudgetFundingSourceRow = {
      id: `funding-source-${Date.now()}`,
      source: draft.source.trim(),
      type: draft.type.trim(),
      amount: this.parseBudgetInput(draft.amount),
      status: draft.status.trim() || 'Confirmed',
      notes: draft.notes.trim(),
    };

    this.updateActiveBudgetPlanState((plan) => ({
      ...plan,
      years: plan.years.map((entry) =>
        entry.fy === year.fy
          ? {
              ...entry,
              fundingSources: [...entry.fundingSources, nextRow],
            }
          : entry,
      ),
      lastSavedLabel: 'Saved just now',
    }));

    this.resetBudgetFundingDraft();
    this.closeBudgetFundingDrawer();
  }

  updateBudgetFundingDraft(field: keyof BudgetFundingSourceDraft, value: string): void {
    this.budgetFundingSourceDraft = {
      ...this.budgetFundingSourceDraft,
      [field]: value,
    };
  }

  canSaveBudgetFundingDraft(): boolean {
    const draft = this.budgetFundingSourceDraft;
    return Boolean(draft.source.trim() && draft.type.trim() && draft.amount.trim());
  }

  openBudgetMonthlyDrawer(): void {
    const year = this.activeBudgetYear;
    if (!year) {
      this.openBudgetDrawer();
      return;
    }
    this.closeProjectPlanDrawers();
    this.budgetMonthlyEditorRows = year.monthlyRows.map((row) => ({ ...row }));
    this.isBudgetMonthlyDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeBudgetMonthlyDrawer(): void {
    if (!this.isBudgetMonthlyDrawerOpen) return;
    this.isBudgetMonthlyDrawerOpen = false;
    this.iconsHydrated = false;
  }

  saveBudgetMonthlyDrawer(event: Event): void {
    event.preventDefault();
    const year = this.activeBudgetYear;
    if (!year) return;
    const nextRows = this.budgetMonthlyEditorRows.map((row) => ({ ...row }));
    const forecastCapex = nextRows.reduce((total, row) => total + row.capexForecast, 0);
    const forecastOpex = nextRows.reduce((total, row) => total + row.opexForecast, 0);

    this.updateActiveBudgetPlanState((plan) => ({
      ...plan,
      years: plan.years.map((entry) =>
        entry.fy === year.fy
          ? {
              ...entry,
              forecastCapex,
              forecastOpex,
              monthlyRows: nextRows,
            }
          : entry,
      ),
      lastSavedLabel: 'Saved just now',
    }));

    this.closeBudgetMonthlyDrawer();
  }

  updateBudgetMonthlyRow(rowId: string, field: BudgetMonthlyField, value: string): void {
    const nextValue = this.parseBudgetInput(value);
    this.budgetMonthlyEditorRows = this.budgetMonthlyEditorRows.map((row) =>
      row.id === rowId
        ? {
            ...row,
            [field]: nextValue,
          }
        : row,
    );
  }

  toggleBudgetRules(): void {
    this.isBudgetRulesOpen = !this.isBudgetRulesOpen;
    this.iconsHydrated = false;
  }

  closeBudgetRulesPopover(): void {
    if (!this.isBudgetRulesOpen) return;
    this.isBudgetRulesOpen = false;
    this.iconsHydrated = false;
  }

  updateOverviewState(field: keyof OverviewState, value: string): void {
    this.overviewState = {
      ...this.overviewState,
      [field]: value,
    };
  }

  overviewCountLabel(count: number, singular: string, plural: string = `${singular}s`): string {
    return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
  }

  overviewStatusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('approved') || normalized.includes('committed') || normalized.includes('linked') || normalized.includes('defined')) return 'green';
    if (normalized.includes('draft')) return 'blue';
    return 'amber';
  }

  openOverviewBusinessDriverDrawer(row?: OverviewBusinessDriverRow): void {
    this.closeProjectPlanDrawers();
    this.editingOverviewBusinessDriverId = row?.id || null;
    this.overviewBusinessDriverDraft = row
      ? {
          driver: row.driver,
          source: row.source,
          priority: row.priority,
          note: row.note,
        }
      : { ...overviewBusinessDriverDraftInitial };
    this.isOverviewBusinessDriverDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeOverviewBusinessDriverDrawer(): void {
    if (!this.isOverviewBusinessDriverDrawerOpen) return;
    this.isOverviewBusinessDriverDrawerOpen = false;
    this.editingOverviewBusinessDriverId = null;
    this.iconsHydrated = false;
  }

  updateOverviewBusinessDriverDraft(field: keyof OverviewBusinessDriverDraft, value: string): void {
    let nextDraft: OverviewBusinessDriverDraft = {
      ...this.overviewBusinessDriverDraft,
      [field]: value,
    };

    if (field === 'driver') {
      const selected = overviewBusinessDriverOptionSeeds.find((option) => option.driver === value);
      if (selected) {
        nextDraft = {
          ...nextDraft,
          source: nextDraft.source || selected.source,
          priority: nextDraft.priority || selected.priority,
          note: nextDraft.note || selected.note,
        };
      }
    }

    this.overviewBusinessDriverDraft = nextDraft;
  }

  canSaveOverviewBusinessDriverDraft(): boolean {
    return Boolean(this.overviewBusinessDriverDraft.driver.trim());
  }

  saveOverviewBusinessDriverDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveOverviewBusinessDriverDraft()) return;

    const draft = this.overviewBusinessDriverDraft;
    const selected = overviewBusinessDriverOptionSeeds.find((option) => option.driver === draft.driver.trim());
    const nextRow: OverviewBusinessDriverRow = {
      id: this.editingOverviewBusinessDriverId || `overview-business-driver-${Date.now()}`,
      driver: draft.driver.trim(),
      source: draft.source.trim() || selected?.source || 'Strategy Office',
      priority: draft.priority.trim() || selected?.priority || 'Medium',
      note: draft.note.trim() || selected?.note || '',
    };

    this.overviewBusinessDriverRows = this.editingOverviewBusinessDriverId
      ? this.overviewBusinessDriverRows.map((row) => (row.id === this.editingOverviewBusinessDriverId ? nextRow : row))
      : [...this.overviewBusinessDriverRows, nextRow];

    this.overviewBusinessDriverDraft = { ...overviewBusinessDriverDraftInitial };
    this.closeOverviewBusinessDriverDrawer();
  }

  removeOverviewBusinessDriver(id: string): void {
    this.overviewBusinessDriverRows = this.overviewBusinessDriverRows.filter((row) => row.id !== id);
    this.iconsHydrated = false;
  }

  openOverviewOutcomeDrawer(row?: OverviewOutcomeRow): void {
    this.closeProjectPlanDrawers();
    this.editingOverviewOutcomeId = row?.id || null;
    this.overviewOutcomeDraft = row
      ? {
          outcome: row.outcome,
          measure: row.measure,
          owner: row.owner,
          status: row.status,
        }
      : { ...overviewOutcomeDraftInitial };
    this.isOverviewOutcomeDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeOverviewOutcomeDrawer(): void {
    if (!this.isOverviewOutcomeDrawerOpen) return;
    this.isOverviewOutcomeDrawerOpen = false;
    this.editingOverviewOutcomeId = null;
    this.iconsHydrated = false;
  }

  updateOverviewOutcomeDraft(field: keyof OverviewOutcomeDraft, value: string): void {
    this.overviewOutcomeDraft = {
      ...this.overviewOutcomeDraft,
      [field]: value,
    };
  }

  canSaveOverviewOutcomeDraft(): boolean {
    return Boolean(this.overviewOutcomeDraft.outcome.trim());
  }

  saveOverviewOutcomeDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveOverviewOutcomeDraft()) return;

    const draft = this.overviewOutcomeDraft;
    const nextRow: OverviewOutcomeRow = {
      id: this.editingOverviewOutcomeId || `overview-outcome-${Date.now()}`,
      outcome: draft.outcome.trim(),
      measure: draft.measure.trim() || 'Measure to confirm',
      owner: draft.owner.trim() || 'Owner to confirm',
      status: draft.status.trim() || 'Draft',
    };

    this.overviewOutcomeRows = this.editingOverviewOutcomeId
      ? this.overviewOutcomeRows.map((row) => (row.id === this.editingOverviewOutcomeId ? nextRow : row))
      : [...this.overviewOutcomeRows, nextRow];

    this.overviewOutcomeDraft = { ...overviewOutcomeDraftInitial };
    this.closeOverviewOutcomeDrawer();
  }

  removeOverviewOutcome(id: string): void {
    this.overviewOutcomeRows = this.overviewOutcomeRows.filter((row) => row.id !== id);
    this.iconsHydrated = false;
  }

  openOverviewObjectiveDrawer(row?: OverviewObjectiveRow): void {
    this.closeProjectPlanDrawers();
    this.editingOverviewObjectiveId = row?.id || null;
    this.overviewObjectiveDraft = row
      ? {
          objective: row.objective,
          linkedObjective: row.linkedObjective,
          status: row.status,
        }
      : { ...overviewObjectiveDraftInitial };
    this.isOverviewObjectiveDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeOverviewObjectiveDrawer(): void {
    if (!this.isOverviewObjectiveDrawerOpen) return;
    this.isOverviewObjectiveDrawerOpen = false;
    this.editingOverviewObjectiveId = null;
    this.iconsHydrated = false;
  }

  updateOverviewObjectiveDraft(field: keyof OverviewObjectiveDraft, value: string): void {
    this.overviewObjectiveDraft = {
      ...this.overviewObjectiveDraft,
      [field]: value,
    };
  }

  canSaveOverviewObjectiveDraft(): boolean {
    return Boolean(this.overviewObjectiveDraft.objective.trim());
  }

  saveOverviewObjectiveDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveOverviewObjectiveDraft()) return;

    const draft = this.overviewObjectiveDraft;
    const nextRow: OverviewObjectiveRow = {
      id: this.editingOverviewObjectiveId || `overview-objective-${Date.now()}`,
      objective: draft.objective.trim(),
      linkedObjective: draft.linkedObjective.trim() || overviewStrategicObjectiveLinkSeeds[0] || 'Strategic objective to confirm',
      status: draft.status.trim() || 'Draft',
    };

    this.overviewObjectiveRows = this.editingOverviewObjectiveId
      ? this.overviewObjectiveRows.map((row) => (row.id === this.editingOverviewObjectiveId ? nextRow : row))
      : [...this.overviewObjectiveRows, nextRow];

    this.overviewObjectiveDraft = { ...overviewObjectiveDraftInitial };
    this.closeOverviewObjectiveDrawer();
  }

  removeOverviewObjective(id: string): void {
    this.overviewObjectiveRows = this.overviewObjectiveRows.filter((row) => row.id !== id);
    this.iconsHydrated = false;
  }

  openOverviewCapabilityDrawer(row?: OverviewCapabilityRow): void {
    this.closeProjectPlanDrawers();
    this.editingOverviewCapabilityId = row?.id || null;
    this.overviewCapabilityDraft = row
      ? {
          selectedCapabilities: [row.capability],
        }
      : {
          selectedCapabilities: [...overviewCapabilityDraftInitial.selectedCapabilities],
        };
    this.isOverviewCapabilityDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeOverviewCapabilityDrawer(): void {
    if (!this.isOverviewCapabilityDrawerOpen) return;
    this.isOverviewCapabilityDrawerOpen = false;
    this.editingOverviewCapabilityId = null;
    this.iconsHydrated = false;
  }

  toggleOverviewCapabilitySelection(capability: string): void {
    const selected = new Set(this.overviewCapabilityDraft.selectedCapabilities);
    if (selected.has(capability)) {
      selected.delete(capability);
    } else {
      selected.add(capability);
    }
    this.overviewCapabilityDraft = {
      selectedCapabilities: Array.from(selected),
    };
  }

  canSaveOverviewCapabilityDraft(): boolean {
    return this.overviewCapabilityDraft.selectedCapabilities.length > 0;
  }

  saveOverviewCapabilityDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveOverviewCapabilityDraft()) return;

    const availableRows = overviewCapabilityOptionSeeds.filter((option) =>
      this.overviewCapabilityDraft.selectedCapabilities.includes(option.capability),
    );
    if (!availableRows.length) return;

    const currentRow = this.overviewCapabilityRows.find((row) => row.id === this.editingOverviewCapabilityId) || null;
    const existingRows = this.overviewCapabilityRows.filter((row) => row.id !== this.editingOverviewCapabilityId);
    const existingCapabilities = new Set(existingRows.map((row) => row.capability));
    const nextRows = availableRows
      .filter((option) => !existingCapabilities.has(option.capability) || currentRow?.capability === option.capability)
      .map((option, index) => ({
        id: this.editingOverviewCapabilityId && index === 0 ? this.editingOverviewCapabilityId : `overview-capability-${Date.now()}-${index}`,
        capability: option.capability,
        domain: option.domain,
        owner: option.owner,
      }));

    if (!nextRows.length && this.editingOverviewCapabilityId) {
      this.closeOverviewCapabilityDrawer();
      return;
    }

    this.overviewCapabilityRows = [...existingRows, ...nextRows];
    this.overviewCapabilityDraft = {
      selectedCapabilities: [...overviewCapabilityDraftInitial.selectedCapabilities],
    };
    this.closeOverviewCapabilityDrawer();
  }

  removeOverviewCapability(id: string): void {
    this.overviewCapabilityRows = this.overviewCapabilityRows.filter((row) => row.id !== id);
    this.iconsHydrated = false;
  }

  openOverviewServiceDrawer(row?: OverviewServiceRow): void {
    this.closeProjectPlanDrawers();
    this.editingOverviewServiceId = row?.id || null;
    this.overviewServiceDraft = row
      ? {
          serviceGroup: row.serviceGroup,
          valueStream: row.valueStream,
          phase: row.phase,
          service: row.service,
        }
      : { ...overviewServiceDraftInitial };
    this.isOverviewServiceDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeOverviewServiceDrawer(): void {
    if (!this.isOverviewServiceDrawerOpen) return;
    this.isOverviewServiceDrawerOpen = false;
    this.editingOverviewServiceId = null;
    this.iconsHydrated = false;
  }

  updateOverviewServiceDraft(field: keyof OverviewServiceDraft, value: string): void {
    if (field === 'serviceGroup') {
      this.overviewServiceDraft = {
        serviceGroup: value,
        valueStream: '',
        phase: '',
        service: '',
      };
      return;
    }

    if (field === 'valueStream') {
      this.overviewServiceDraft = {
        ...this.overviewServiceDraft,
        valueStream: value,
        phase: '',
        service: '',
      };
      return;
    }

    if (field === 'phase') {
      this.overviewServiceDraft = {
        ...this.overviewServiceDraft,
        phase: value,
        service: '',
      };
      return;
    }

    this.overviewServiceDraft = {
      ...this.overviewServiceDraft,
      [field]: value,
    };
  }

  canSaveOverviewServiceDraft(): boolean {
    const draft = this.overviewServiceDraft;
    return Boolean(draft.serviceGroup.trim() && draft.valueStream.trim() && draft.service.trim());
  }

  saveOverviewServiceDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveOverviewServiceDraft()) return;

    const draft = this.overviewServiceDraft;
    const matchedOption = overviewServiceOptionSeeds.find(
      (option) =>
        option.serviceGroup === draft.serviceGroup &&
        option.valueStream === draft.valueStream &&
        (!draft.phase || option.phase === draft.phase) &&
        option.service === draft.service,
    );

    const nextRow: OverviewServiceRow = {
      id: this.editingOverviewServiceId || `overview-service-${Date.now()}`,
      serviceGroup: draft.serviceGroup.trim(),
      valueStream: draft.valueStream.trim(),
      phase: draft.phase.trim() || matchedOption?.phase || 'Phase to confirm',
      service: draft.service.trim(),
    };

    this.overviewServiceRows = this.editingOverviewServiceId
      ? this.overviewServiceRows.map((row) => (row.id === this.editingOverviewServiceId ? nextRow : row))
      : [...this.overviewServiceRows, nextRow];

    this.overviewServiceDraft = { ...overviewServiceDraftInitial };
    this.closeOverviewServiceDrawer();
  }

  removeOverviewService(id: string): void {
    this.overviewServiceRows = this.overviewServiceRows.filter((row) => row.id !== id);
    this.iconsHydrated = false;
  }

  updateScheduleScopeField(field: keyof ScheduleScopeState, value: string): void {
    this.scheduleScopeState = {
      ...this.scheduleScopeState,
      [field]: value,
    };
  }

  updateScheduleScopeDateInput(field: keyof ScheduleScopeState, value: string): void {
    this.updateScheduleScopeField(field, this.parseScheduleScopeDateInput(value));
  }

  scheduleScopeInputDate(value: string): string {
    if (!value) return '';
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!isoMatch) return value;
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  scheduleScopeCountLabel(count: number, singular: string, plural: string = `${singular}s`): string {
    return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
  }

  scheduleScopeDateRange(start: string, end: string): string {
    const startLabel = start ? this.formatProjectPlanDate(start) : 'Start TBD';
    const endLabel = end ? this.formatProjectPlanDate(end) : 'End TBD';
    return `${startLabel} - ${endLabel}`;
  }

  scheduleScopeDateLabel(value: string): string {
    return value ? this.formatProjectPlanDate(value) : 'TBD';
  }

  scheduleScopeProductBudgetTotal(capex: string, opex: string): string {
    return this.formatBudgetCurrency(this.scheduleScopeBudgetValue(capex) + this.scheduleScopeBudgetValue(opex));
  }

  scheduleScopeDependencySummary(row: ScheduleScopeProductRow): string {
    const dependencyCount = row.predecessors.length + row.successors.length;
    if (!dependencyCount) return 'No linked projects';
    return this.scheduleScopeCountLabel(dependencyCount, 'linked project');
  }

  scheduleMilestonePriorityTone(priority: string): string {
    const normalized = priority.toLowerCase();
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('medium')) return 'medium';
    if (normalized.includes('low')) return 'low';
    return 'neutral';
  }

  openScheduleMilestoneDrawer(row?: ScheduleMilestoneRow): void {
    this.closeProjectPlanDrawers();
    this.editingScheduleMilestoneId = row?.id || null;
    this.scheduleMilestoneDraft = row
      ? {
          milestone: row.milestone,
          dueDate: row.dueDate,
          owner: row.owner,
          priority: row.priority || 'Medium',
          note: row.note,
        }
      : { ...scheduleMilestoneDraftInitial };
    this.isScheduleMilestoneDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeScheduleMilestoneDrawer(): void {
    if (!this.isScheduleMilestoneDrawerOpen) return;
    this.isScheduleMilestoneDrawerOpen = false;
    this.editingScheduleMilestoneId = null;
    this.iconsHydrated = false;
  }

  saveScheduleMilestoneDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveScheduleMilestoneDraft()) return;

    const draft = this.scheduleMilestoneDraft;
    const nextRow: ScheduleMilestoneRow = {
      id: this.editingScheduleMilestoneId || `schedule-milestone-${Date.now()}`,
      milestone: draft.milestone.trim(),
      dueDate: draft.dueDate.trim(),
      owner: draft.owner.trim(),
      priority: draft.priority.trim() || 'Medium',
      note: draft.note.trim(),
    };

    this.scheduleMilestoneRows = this.editingScheduleMilestoneId
      ? this.scheduleMilestoneRows.map((row) => (row.id === this.editingScheduleMilestoneId ? nextRow : row))
      : [...this.scheduleMilestoneRows, nextRow];

    this.scheduleMilestoneDraft = { ...scheduleMilestoneDraftInitial };
    this.closeScheduleMilestoneDrawer();
  }

  updateScheduleMilestoneDraft(field: keyof ScheduleMilestoneDraft, value: string): void {
    this.scheduleMilestoneDraft = {
      ...this.scheduleMilestoneDraft,
      [field]: value,
    };
  }

  canSaveScheduleMilestoneDraft(): boolean {
    const draft = this.scheduleMilestoneDraft;
    return Boolean(draft.milestone.trim() && draft.dueDate.trim());
  }

  removeScheduleMilestone(id: string): void {
    this.scheduleMilestoneRows = this.scheduleMilestoneRows.filter((row) => row.id !== id);
    this.iconsHydrated = false;
  }

  openScheduleEndProductDrawer(row?: ScheduleScopeProductRow): void {
    this.closeProjectPlanDrawers();
    this.editingScheduleEndProductId = row?.id || null;
    this.scheduleEndProductDraft = row
      ? {
          sourceType: 'new',
          product: row.product,
          description: row.description,
          owner: row.owner,
          category: row.category,
          capability: row.capability,
          startDate: row.startDate,
          endDate: row.endDate,
          capex: row.capex,
          opex: row.opex,
          predecessors: row.predecessors.join(', '),
          successors: row.successors.join(', '),
        }
      : { ...scheduleEndProductDraftInitial };
    this.isScheduleEndProductDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeScheduleEndProductDrawer(): void {
    if (!this.isScheduleEndProductDrawerOpen) return;
    this.isScheduleEndProductDrawerOpen = false;
    this.editingScheduleEndProductId = null;
    this.iconsHydrated = false;
  }

  saveScheduleEndProductDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveScheduleEndProductDraft()) return;

    const draft = this.scheduleEndProductDraft;
    const nextRow: ScheduleScopeProductRow = {
      id: this.editingScheduleEndProductId || `schedule-end-product-${Date.now()}`,
      product: draft.product.trim(),
      description: draft.description.trim(),
      owner: draft.owner.trim() || 'Owner to confirm',
      category: draft.category.trim() || 'Information',
      capability: draft.capability.trim() || 'Capability to confirm',
      startDate: draft.startDate.trim(),
      endDate: draft.endDate.trim(),
      capex: draft.capex.trim() || '0',
      opex: draft.opex.trim() || '0',
      predecessors: this.scheduleScopeSplitList(draft.predecessors),
      successors: this.scheduleScopeSplitList(draft.successors),
    };

    this.scheduleEndProductRows = this.editingScheduleEndProductId
      ? this.scheduleEndProductRows.map((row) => (row.id === this.editingScheduleEndProductId ? nextRow : row))
      : [...this.scheduleEndProductRows, nextRow];

    this.scheduleEndProductDraft = { ...scheduleEndProductDraftInitial };
    this.closeScheduleEndProductDrawer();
  }

  updateScheduleEndProductDraft(field: keyof ScheduleScopeProductDraft, value: string): void {
    this.scheduleEndProductDraft = {
      ...this.scheduleEndProductDraft,
      [field]: value,
    };
  }

  setScheduleEndProductSource(source: ScheduleScopeProductSource): void {
    this.scheduleEndProductDraft = {
      ...this.scheduleEndProductDraft,
      sourceType: source,
    };
    if (source === 'existing' && !this.scheduleEndProductDraft.product.trim()) {
      this.applyExistingEndProductSelection(scheduleScopeExistingEndProducts[0]?.product || '');
    }
  }

  applyExistingEndProductSelection(productName: string): void {
    const selected = scheduleScopeExistingEndProducts.find((product) => product.product === productName);
    if (!selected) return;
    this.scheduleEndProductDraft = {
      ...this.scheduleEndProductDraft,
      sourceType: 'existing',
      product: selected.product,
      description: selected.description,
      owner: selected.owner,
      category: selected.category,
      capability: selected.capability,
    };
  }

  canSaveScheduleEndProductDraft(): boolean {
    const draft = this.scheduleEndProductDraft;
    return Boolean(draft.product.trim() && draft.owner.trim());
  }

  removeScheduleEndProduct(id: string): void {
    this.scheduleEndProductRows = this.scheduleEndProductRows.filter((row) => row.id !== id);
    this.iconsHydrated = false;
  }

  openScheduleManagementProductDrawer(row?: ScheduleManagementProductRow): void {
    this.closeProjectPlanDrawers();
    this.editingScheduleManagementProductId = row?.id || null;
    this.scheduleManagementProductDraft = row
      ? {
          product: row.product,
          description: row.description,
          owner: row.owner,
          category: row.category,
          startDate: row.startDate,
          endDate: row.endDate,
          capex: row.capex,
          opex: row.opex,
        }
      : { ...scheduleManagementProductDraftInitial };
    this.isScheduleManagementProductDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeScheduleManagementProductDrawer(): void {
    if (!this.isScheduleManagementProductDrawerOpen) return;
    this.isScheduleManagementProductDrawerOpen = false;
    this.editingScheduleManagementProductId = null;
    this.iconsHydrated = false;
  }

  saveScheduleManagementProductDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveScheduleManagementProductDraft()) return;

    const draft = this.scheduleManagementProductDraft;
    const nextRow: ScheduleManagementProductRow = {
      id: this.editingScheduleManagementProductId || `schedule-management-product-${Date.now()}`,
      product: draft.product.trim(),
      description: draft.description.trim(),
      owner: draft.owner.trim() || 'Owner to confirm',
      category: draft.category.trim() || 'Governance',
      startDate: draft.startDate.trim(),
      endDate: draft.endDate.trim(),
      capex: draft.capex.trim() || '0',
      opex: draft.opex.trim() || '0',
    };

    this.scheduleManagementProductRows = this.editingScheduleManagementProductId
      ? this.scheduleManagementProductRows.map((row) =>
          row.id === this.editingScheduleManagementProductId ? nextRow : row,
        )
      : [...this.scheduleManagementProductRows, nextRow];

    this.scheduleManagementProductDraft = { ...scheduleManagementProductDraftInitial };
    this.closeScheduleManagementProductDrawer();
  }

  updateScheduleManagementProductDraft(field: keyof ScheduleManagementProductDraft, value: string): void {
    this.scheduleManagementProductDraft = {
      ...this.scheduleManagementProductDraft,
      [field]: value,
    };
  }

  canSaveScheduleManagementProductDraft(): boolean {
    const draft = this.scheduleManagementProductDraft;
    return Boolean(draft.product.trim() && draft.owner.trim());
  }

  removeScheduleManagementProduct(id: string): void {
    this.scheduleManagementProductRows = this.scheduleManagementProductRows.filter((row) => row.id !== id);
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

  openRiskDrawer(row?: RiskPlanRow): void {
    this.closeProjectPlanDrawers();
    this.editingRiskPlanId = row?.id || null;
    this.riskPlanDraft = row
      ? this.riskDraftFromRow(row)
      : {
          ...riskPlanConfig.draft,
          treatments: riskPlanConfig.draft.treatments.map((treatment) => ({ ...treatment })),
        };
    this.riskTreatmentDraft = { ...riskTreatmentDraftInitial };
    this.riskDrawerOpenProfileAfterSave = false;
    this.isRiskDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeRiskDrawer(): void {
    if (!this.isRiskDrawerOpen) return;
    this.isRiskDrawerOpen = false;
    this.editingRiskPlanId = null;
    this.riskDrawerOpenProfileAfterSave = false;
    this.iconsHydrated = false;
  }

  saveRiskDrawer(event: Event): void {
    event.preventDefault();
    const register = this.activeRiskDrawer;
    if (!register || !this.canSaveRiskDraft(register)) return;

    const draft = this.riskPlanDraft;
    const rowId = this.editingRiskPlanId || this.nextRiskPlanId();
    const existing = this.riskPlanRows.find((row) => row.id === rowId) || null;
    const nextRow: RiskPlanRow = {
      id: rowId,
      riskCategory: draft.riskCategory.trim(),
      riskName: draft.riskName.trim(),
      description: draft.description.trim(),
      owner: draft.owner.trim() || 'Owner to confirm',
      manager: draft.manager.trim() || 'James T Kirk',
      lead: draft.lead.trim() || draft.owner.trim() || 'Risk lead to confirm',
      startDate: draft.startDate.trim(),
      endDate: draft.endDate.trim(),
      reviewDueDate: draft.reviewDueDate.trim(),
      status: draft.status.trim() || 'Open',
      strategicRisk: draft.strategicRisk.trim() || 'No',
      enterpriseImpact: draft.enterpriseImpact,
      actualLikelihood: draft.actualLikelihood.trim(),
      actualConsequence: draft.actualConsequence.trim(),
      actualRating: draft.actualRating.trim() || this.riskRatingFor(draft.actualLikelihood, draft.actualConsequence),
      residualLikelihood: draft.residualLikelihood.trim(),
      residualConsequence: draft.residualConsequence.trim(),
      residualRating: draft.residualRating.trim() || this.riskRatingFor(draft.residualLikelihood, draft.residualConsequence),
      impactedObjective: draft.impactedObjective.trim(),
      sharedRisk: draft.sharedRisk,
      source: draft.source.trim(),
      consequence: draft.consequence.trim(),
      controlSummary: draft.controlSummary.trim(),
      overallControlEffectiveness: draft.overallControlEffectiveness.trim() || 'Not Rated',
      analysisComment: draft.analysisComment.trim(),
      treatmentApproach: draft.treatmentApproach.trim() || 'Mitigate the threat',
      treatmentType: draft.treatmentType.trim() || 'Mitigate',
      treatmentComment: draft.treatmentComment.trim(),
      treatments: this.cloneRiskTreatments(draft.treatments),
      createdOn: existing?.createdOn || this.todayIsoDate(),
    };

    this.riskPlanRows = existing
      ? this.riskPlanRows.map((row) => (row.id === rowId ? nextRow : row))
      : [...this.riskPlanRows, nextRow];

    const shouldOpenProfile = this.riskDrawerOpenProfileAfterSave;
    this.resetRiskDraft();
    this.closeRiskDrawer();
    if (shouldOpenProfile) {
      this.openRiskProfile(nextRow);
    }
  }

  updateRiskDraft(field: RiskPlanDraftField, value: string): void {
    const nextDraft: RiskPlanDraft = {
      ...this.riskPlanDraft,
      [field]: value,
    };

    if (field === 'actualLikelihood' || field === 'actualConsequence') {
      nextDraft.actualRating = this.riskRatingFor(nextDraft.actualLikelihood, nextDraft.actualConsequence);
    }

    if (field === 'residualLikelihood' || field === 'residualConsequence') {
      nextDraft.residualRating = this.riskRatingFor(nextDraft.residualLikelihood, nextDraft.residualConsequence);
    }

    this.riskPlanDraft = nextDraft;
  }

  updateRiskDraftEnterpriseImpact(value: boolean): void {
    this.riskPlanDraft = {
      ...this.riskPlanDraft,
      enterpriseImpact: value,
    };
  }

  updateRiskDraftSharedRisk(value: boolean): void {
    this.riskPlanDraft = {
      ...this.riskPlanDraft,
      sharedRisk: value,
    };
  }

  updateRiskDraftMatrix(kind: 'actual' | 'residual', selection: PmConsoleRiskMatrixSelection): void {
    this.riskPlanDraft =
      kind === 'actual'
        ? {
            ...this.riskPlanDraft,
            actualLikelihood: selection.likelihood,
            actualConsequence: selection.consequence,
            actualRating: selection.rating,
          }
        : {
            ...this.riskPlanDraft,
            residualLikelihood: selection.likelihood,
            residualConsequence: selection.consequence,
            residualRating: selection.rating,
          };
  }

  canSaveRiskDraft(register: RiskPlanConfig | null): boolean {
    if (!register) return false;
    const draft = this.riskPlanDraft;
    return Boolean(draft.riskCategory.trim() && draft.riskName.trim() && draft.startDate.trim() && draft.endDate.trim() && draft.status.trim());
  }

  markRiskDrawerForFullProfile(): void {
    this.riskDrawerOpenProfileAfterSave = true;
  }

  openRiskProfile(row: RiskPlanRow): void {
    this.closeProjectPlanDrawers();
    this.activeRiskProfileId = row.id;
    this.activeRiskProfileTab = 'identification';
    this.riskTreatmentDraft = { ...riskTreatmentDraftInitial };
    this.iconsHydrated = false;
  }

  closeRiskProfile(): void {
    if (!this.activeRiskProfileId) return;
    this.activeRiskProfileId = null;
    this.activeRiskProfileTab = 'identification';
    this.iconsHydrated = false;
  }

  setRiskProfileTab(tab: RiskProfileTab): void {
    this.activeRiskProfileTab = tab;
    this.iconsHydrated = false;
  }

  saveRiskProfile(): void {
    this.iconsHydrated = false;
  }

  completeRiskAssessment(riskId: string): void {
    this.riskPlanRows = this.riskPlanRows.map((row) =>
      row.id === riskId
        ? {
            ...row,
            status: row.status === 'Closed' ? row.status : 'Monitoring',
            reviewDueDate: row.reviewDueDate || '2026-06-15',
          }
        : row,
    );
    this.iconsHydrated = false;
  }

  updateRiskProfileField(field: RiskPlanRowField, value: string): void {
    const riskId = this.activeRiskProfileId;
    if (!riskId) return;
    this.riskPlanRows = this.riskPlanRows.map((row) => {
      if (row.id !== riskId) return row;
      const nextRow: RiskPlanRow = {
        ...row,
        [field]: value,
      };
      if (field === 'actualLikelihood' || field === 'actualConsequence') {
        nextRow.actualRating = this.riskRatingFor(nextRow.actualLikelihood, nextRow.actualConsequence);
      }
      if (field === 'residualLikelihood' || field === 'residualConsequence') {
        nextRow.residualRating = this.riskRatingFor(nextRow.residualLikelihood, nextRow.residualConsequence);
      }
      return nextRow;
    });
  }

  updateRiskProfileEnterpriseImpact(value: boolean): void {
    this.updateRiskProfileBoolean('enterpriseImpact', value);
  }

  updateRiskProfileSharedRisk(value: boolean): void {
    this.updateRiskProfileBoolean('sharedRisk', value);
  }

  updateRiskProfileMatrix(kind: 'actual' | 'residual', selection: PmConsoleRiskMatrixSelection): void {
    const riskId = this.activeRiskProfileId;
    if (!riskId) return;
    this.riskPlanRows = this.riskPlanRows.map((row) =>
      row.id === riskId
        ? kind === 'actual'
          ? {
              ...row,
              actualLikelihood: selection.likelihood,
              actualConsequence: selection.consequence,
              actualRating: selection.rating,
            }
          : {
              ...row,
              residualLikelihood: selection.likelihood,
              residualConsequence: selection.consequence,
              residualRating: selection.rating,
            }
        : row,
    );
  }

  updateRiskTreatmentDraft(field: keyof RiskTreatmentDraft, value: string): void {
    this.riskTreatmentDraft = {
      ...this.riskTreatmentDraft,
      [field]: value,
    };
  }

  canAddRiskTreatmentDraft(): boolean {
    return Boolean(this.riskTreatmentDraft.treatment.trim());
  }

  addRiskTreatmentToDraft(): void {
    if (!this.canAddRiskTreatmentDraft()) return;
    this.riskPlanDraft = {
      ...this.riskPlanDraft,
      treatments: [...this.riskPlanDraft.treatments, this.riskTreatmentFromDraft()],
    };
    this.riskTreatmentDraft = { ...riskTreatmentDraftInitial };
  }

  addRiskTreatmentToProfile(): void {
    const riskId = this.activeRiskProfileId;
    if (!riskId || !this.canAddRiskTreatmentDraft()) return;
    const nextTreatment = this.riskTreatmentFromDraft();
    this.riskPlanRows = this.riskPlanRows.map((row) =>
      row.id === riskId
        ? {
            ...row,
            treatments: [...row.treatments, nextTreatment],
          }
        : row,
    );
    this.riskTreatmentDraft = { ...riskTreatmentDraftInitial };
  }

  removeRiskTreatmentFromDraft(id: string): void {
    this.riskPlanDraft = {
      ...this.riskPlanDraft,
      treatments: this.riskPlanDraft.treatments.filter((treatment) => treatment.id !== id),
    };
  }

  removeRiskTreatmentFromProfile(id: string): void {
    const riskId = this.activeRiskProfileId;
    if (!riskId) return;
    this.riskPlanRows = this.riskPlanRows.map((row) =>
      row.id === riskId
        ? {
            ...row,
            treatments: row.treatments.filter((treatment) => treatment.id !== id),
          }
        : row,
    );
  }

  riskCountLabel(register: RiskPlanConfig): string {
    return register.rows.length === 1 ? '1 risk' : `${register.rows.length} risks`;
  }

  riskTreatmentCountLabel(treatments: RiskTreatmentRow[]): string {
    return treatments.length === 1 ? '1 treatment' : `${treatments.length} treatments`;
  }

  riskDateLabel(value: string): string {
    return value ? this.formatProjectPlanDate(value) : 'N/A';
  }

  riskStrategicLabel(row: RiskPlanRow): string {
    return row.strategicRisk.toLowerCase() === 'yes' || row.enterpriseImpact ? 'Yes' : row.strategicRisk || 'No';
  }

  riskRatingTone(rating: string): string {
    const normalized = rating.toLowerCase();
    if (normalized === 'low') return 'low';
    if (normalized === 'medium') return 'medium';
    if (normalized === 'high') return 'high';
    if (normalized === 'extreme') return 'extreme';
    return 'neutral';
  }

  riskStatusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('closed')) return 'success';
    if (normalized.includes('escalated')) return 'critical';
    if (normalized.includes('monitor')) return 'amber';
    if (normalized.includes('open')) return 'indigo';
    return 'neutral';
  }

  riskRatingFor(likelihood: string, consequence: string): string {
    const likelihoodOptions = ['Almost certain', 'Likely', 'Possible', 'Unlikely', 'Rare'];
    const consequenceOptions = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe'];
    const row = likelihoodOptions.indexOf(likelihood);
    const column = consequenceOptions.indexOf(consequence);
    if (row < 0 || column < 0) return '';
    const matrix = [
      ['Medium', 'High', 'High', 'High', 'Extreme'],
      ['Medium', 'Medium', 'High', 'High', 'Extreme'],
      ['Low', 'Medium', 'Medium', 'High', 'Extreme'],
      ['Low', 'Low', 'Medium', 'Medium', 'High'],
      ['Low', 'Low', 'Low', 'Medium', 'Medium'],
    ];
    return matrix[row]?.[column] || '';
  }

  private updateRiskProfileBoolean(field: 'enterpriseImpact' | 'sharedRisk', value: boolean): void {
    const riskId = this.activeRiskProfileId;
    if (!riskId) return;
    this.riskPlanRows = this.riskPlanRows.map((row) =>
      row.id === riskId
        ? {
            ...row,
            [field]: value,
          }
        : row,
    );
  }

  private riskDraftFromRow(row: RiskPlanRow): RiskPlanDraft {
    return {
      riskCategory: row.riskCategory,
      riskName: row.riskName,
      description: row.description,
      owner: row.owner,
      manager: row.manager,
      lead: row.lead,
      startDate: row.startDate,
      endDate: row.endDate,
      reviewDueDate: row.reviewDueDate,
      status: row.status,
      strategicRisk: row.strategicRisk,
      enterpriseImpact: row.enterpriseImpact,
      actualLikelihood: row.actualLikelihood,
      actualConsequence: row.actualConsequence,
      actualRating: row.actualRating,
      residualLikelihood: row.residualLikelihood,
      residualConsequence: row.residualConsequence,
      residualRating: row.residualRating,
      impactedObjective: row.impactedObjective,
      sharedRisk: row.sharedRisk,
      source: row.source,
      consequence: row.consequence,
      controlSummary: row.controlSummary,
      overallControlEffectiveness: row.overallControlEffectiveness,
      analysisComment: row.analysisComment,
      treatmentApproach: row.treatmentApproach,
      treatmentType: row.treatmentType,
      treatmentComment: row.treatmentComment,
      treatments: this.cloneRiskTreatments(row.treatments),
    };
  }

  private riskTreatmentFromDraft(): RiskTreatmentRow {
    return {
      id: `risk-treatment-${Date.now()}`,
      treatment: this.riskTreatmentDraft.treatment.trim(),
      type: this.riskTreatmentDraft.type.trim() || 'Mitigate',
      category: this.riskTreatmentDraft.category.trim() || 'Preventive',
      owner: this.riskTreatmentDraft.owner.trim() || 'Owner to confirm',
      manager: this.riskTreatmentDraft.manager.trim() || 'James T Kirk',
      startDate: this.riskTreatmentDraft.startDate.trim(),
      endDate: this.riskTreatmentDraft.endDate.trim(),
      status: this.riskTreatmentDraft.status.trim() || 'Planned',
    };
  }

  private cloneRiskTreatments(treatments: RiskTreatmentRow[]): RiskTreatmentRow[] {
    return treatments.map((treatment) => ({ ...treatment }));
  }

  private nextRiskPlanId(): string {
    const highest = this.riskPlanRows.reduce((max, row) => {
      const numeric = Number(row.id.replace(/\D/g, ''));
      return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
    }, 840);
    return `R${highest + 1}`;
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
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

  openChangeRequestDrawer(row?: ChangeRequestRow): void {
    this.closeProjectPlanDrawers();
    this.editingChangeRequestId = row?.id || null;
    this.changeRequestDraft = row
      ? {
          project: row.project,
          pmo: row.pmo,
          dueDate: row.dueDate,
          trigger: row.trigger,
          priority: row.priority,
          types: [...row.types],
          changeDetails: row.changeDetails,
          businessJustification: row.businessJustification,
          riskImpact: row.riskImpact,
          releasesImpacted: row.releasesImpacted,
          impactToResource: row.impactToResource,
          impactToQuality: row.impactToQuality,
          relatedLinks: row.relatedLinks.map((link) => ({ ...link })),
          relatedLinkName: '',
          relatedLinkDescription: '',
          relatedLinkUrl: '',
        }
      : this.createChangeRequestDraft();
    this.changeRequestDrawerTab = 'overview';
    this.changeRequestImpactTab = 'benefits';
    this.isChangeRequestDrawerOpen = true;
    this.iconsHydrated = false;
  }

  closeChangeRequestDrawer(): void {
    if (!this.isChangeRequestDrawerOpen) return;
    this.isChangeRequestDrawerOpen = false;
    this.editingChangeRequestId = null;
    this.changeRequestDrawerTab = 'overview';
    this.changeRequestImpactTab = 'benefits';
    this.resetChangeRequestDraft();
    this.iconsHydrated = false;
  }

  saveChangeRequestDrawer(event: Event): void {
    event.preventDefault();
    if (!this.canSaveChangeRequestDraft()) return;

    const existing = this.editingChangeRequestId ? this.changeRequestRows.find((row) => row.id === this.editingChangeRequestId) || null : null;
    const draft = this.changeRequestDraft;
    const nextRow: ChangeRequestRow = {
      id: existing?.id || `change-request-${Date.now()}`,
      pcrNumber: existing?.pcrNumber || this.nextChangeRequestNumber(),
      project: draft.project.trim() || this.scopedProjectName,
      pmo: draft.pmo.trim() || 'James T Kirk',
      types: [...draft.types],
      createdDate: existing?.createdDate || this.todayIsoDate(),
      dueDate: draft.dueDate.trim(),
      priority: draft.priority.trim(),
      status: existing?.status || 'IN DRAFT',
      trigger: draft.trigger.trim(),
      changeDetails: draft.changeDetails.trim(),
      businessJustification: draft.businessJustification.trim(),
      riskImpact: draft.riskImpact.trim(),
      releasesImpacted: draft.releasesImpacted.trim(),
      impactToResource: draft.impactToResource.trim(),
      impactToQuality: draft.impactToQuality.trim(),
      relatedLinks: draft.relatedLinks.map((link) => ({ ...link })),
    };

    this.changeRequestRows = existing
      ? this.changeRequestRows.map((row) => (row.id === existing.id ? nextRow : row))
      : [nextRow, ...this.changeRequestRows];

    this.closeChangeRequestDrawer();
  }

  updateChangeRequestDraft(field: ChangeRequestDraftField, value: string): void {
    this.changeRequestDraft = {
      ...this.changeRequestDraft,
      [field]: value,
    };
  }

  updateChangeRequestRelatedLinkDraft(field: ChangeRequestRelatedLinkDraftField, value: string): void {
    this.changeRequestDraft = {
      ...this.changeRequestDraft,
      [field]: value,
    };
  }

  toggleChangeRequestType(type: ChangeRequestType, checked: boolean): void {
    const current = new Set(this.changeRequestDraft.types);
    if (checked) {
      current.add(type);
    } else {
      current.delete(type);
    }
    this.changeRequestDraft = {
      ...this.changeRequestDraft,
      types: changeRequestTypeOptions.filter((option) => current.has(option)),
    };
  }

  isChangeRequestTypeSelected(type: ChangeRequestType): boolean {
    return this.changeRequestDraft.types.includes(type);
  }

  canSaveChangeRequestDraft(): boolean {
    const draft = this.changeRequestDraft;
    return Boolean(draft.dueDate.trim() && draft.trigger.trim() && draft.priority.trim() && draft.types.length);
  }

  canAddChangeRequestRelatedLink(): boolean {
    return Boolean(this.changeRequestDraft.relatedLinkName.trim() && this.changeRequestDraft.relatedLinkUrl.trim());
  }

  addChangeRequestRelatedLink(): void {
    if (!this.canAddChangeRequestRelatedLink()) return;
    const draft = this.changeRequestDraft;
    const nextLink: RelatedLinkRow = {
      id: `change-request-link-${Date.now()}`,
      name: draft.relatedLinkName.trim(),
      description: draft.relatedLinkDescription.trim(),
      documentLink: draft.relatedLinkUrl.trim(),
    };
    this.changeRequestDraft = {
      ...draft,
      relatedLinks: [...draft.relatedLinks, nextLink],
      relatedLinkName: '',
      relatedLinkDescription: '',
      relatedLinkUrl: '',
    };
  }

  removeChangeRequestRelatedLink(id: string): void {
    this.changeRequestDraft = {
      ...this.changeRequestDraft,
      relatedLinks: this.changeRequestDraft.relatedLinks.filter((link) => link.id !== id),
    };
  }

  removeChangeRequest(id: string): void {
    this.changeRequestRows = this.changeRequestRows.filter((row) => row.id !== id);
    if (this.editingChangeRequestId === id) this.closeChangeRequestDrawer();
    this.iconsHydrated = false;
  }

  changeRequestDateLabel(value: string): string {
    return this.formatProjectPlanDate(value);
  }

  changeRequestStatusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('draft')) return 'neutral';
    if (normalized.includes('endorsement') || normalized.includes('progress')) return 'blue';
    if (normalized.includes('closed') || normalized.includes('approved')) return 'green';
    if (normalized.includes('rejected')) return 'red';
    return 'neutral';
  }

  changeRequestPriorityTone(priority: string): string {
    const normalized = priority.toLowerCase();
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('medium')) return 'medium';
    if (normalized.includes('low')) return 'low';
    return 'neutral';
  }

  isOverdueChangeRequest(row: ChangeRequestRow): boolean {
    if (this.isClosedChangeRequest(row)) return false;
    const due = new Date(`${row.dueDate}T00:00:00`);
    if (Number.isNaN(due.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
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

  submitStageGate(event: Event, gate: StageGateContext): void {
    event.preventDefault();
    if (!this.canSubmitStageGate(gate)) return;
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    if (!this.submittedStageGateKeys.includes(key)) {
      this.submittedStageGateKeys = [...this.submittedStageGateKeys, key];
    }
    this.closeStageGate();
  }

  stageStatusLabel(status: StageGateStatus): string {
    if (status === 'complete') return 'Complete';
    if (status === 'submitted') return 'Stage gate submitted';
    if (status === 'revoked') return 'Revoked';
    if (status === 'current') return 'Current stage';
    return 'Upcoming';
  }

  gateReadinessText(gate: StageGateContext): string {
    if (gate.status === 'complete') return `${gate.profile.gateTotal}/${gate.profile.gateTotal} approved by PMO`;
    if (gate.status === 'submitted') return 'Submitted to PMO and waiting for approval';
    if (gate.status === 'current' || gate.status === 'revoked') return `${gate.checkedCount}/${gate.profile.gateTotal} ready`;
    return 'Not started';
  }

  canSubmitStageGate(gate: StageGateContext): boolean {
    return (
      gate.status === 'current' &&
      this.isStageGateChecklistComplete(gate) &&
      (!this.stageGateEvidenceEnabled(gate) || this.isStageGateEvidenceAttached(gate))
    );
  }

  stageGateSubmitLabel(status: StageGateStatus): string {
    if (status === 'current') return 'Submit stage gate to PMO';
    if (status === 'submitted') return 'Already submitted to PMO';
    if (status === 'complete') return 'Approved by PMO';
    if (status === 'revoked') return 'Rework required before submit';
    return 'Current stage required first';
  }

  canEditStageGateChecklist(status: StageGateStatus): boolean {
    return status === 'current';
  }

  isStageGateChecklistChecked(gate: StageGateContext, index: number): boolean {
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    const state = this.stageGateChecklistState[key];
    if (state) return Boolean(state[index]);
    return index < gate.checkedCount;
  }

  toggleStageGateChecklistItem(gate: StageGateContext, index: number, checked: boolean): void {
    if (!this.canEditStageGateChecklist(gate.status)) return;
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    const current = this.stageGateChecklistState[key] || this.initialStageGateChecklistState(gate.profile, gate.stageIndex);
    const next = [...current];
    next[index] = checked;
    this.stageGateChecklistState = {
      ...this.stageGateChecklistState,
      [key]: next,
    };
    this.iconsHydrated = false;
  }

  stageGateEvidenceEnabled(gate: StageGateContext): boolean {
    return gate.status === 'current' || gate.status === 'submitted' || gate.status === 'complete';
  }

  isStageGateEvidenceAttached(gate: StageGateContext): boolean {
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    return gate.status === 'complete' || this.attachedStageGateEvidenceKeys.includes(key);
  }

  markStageGateEvidenceAttached(gate: StageGateContext): void {
    if (!this.canEditStageGateChecklist(gate.status)) return;
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    if (!this.attachedStageGateEvidenceKeys.includes(key)) {
      this.attachedStageGateEvidenceKeys = [...this.attachedStageGateEvidenceKeys, key];
    }
    this.iconsHydrated = false;
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

  simpleReportSectionTitle(title: string): string {
    const titles: Record<string, string> = {
      'Purpose and outcome': 'Purpose & outcome',
      'Dates and scope': 'Dates & scope',
    };
    return titles[title] || title;
  }

  simpleReportTrendLabel(trend: string, tone?: string): string {
    const normalized = trend.toLowerCase();
    if (normalized.includes('declin') || tone === 'red') return 'Declining';
    if (normalized.includes('stable') || normalized.includes('same') || normalized.includes('no change') || normalized.includes('attention') || tone === 'amber') return 'No change';
    return 'Improving';
  }

  simpleReportTrendTone(trend: string, tone?: string): string {
    const label = this.simpleReportTrendLabel(trend, tone);
    if (label === 'Declining') return 'red';
    if (label === 'No change') return 'neutral';
    return 'green';
  }

  simpleReportTrendIcon(trend: string, tone?: string): string {
    const label = this.simpleReportTrendLabel(trend, tone);
    if (label === 'Declining') return 'arrow-down';
    if (label === 'No change') return 'circle-minus';
    return 'arrow-up';
  }

  isReportTrendSelected(optionValue: string, trend: string): boolean {
    return this.simpleReportTrendLabel(trend).toLowerCase() === optionValue.toLowerCase();
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

  private simpleReportTrendForTone(tone: string): string {
    if (tone === 'red') return 'Declining';
    if (tone === 'amber') return 'No change';
    return 'Improving';
  }

  private simpleReportSectionIcon(section: SimplePlanSection): string {
    if (section.title === 'Purpose and outcome') return 'chart';
    if (section.title === 'Dates and scope') return 'calendar';
    if (section.title === 'Budget baseline') return 'dollar';
    if (section.title === 'Deliverables') return 'endProduct';
    return section.icon || 'info';
  }

  private reportSectionIcon(section: string): string {
    const icons: Record<string, string> = {
      Overview: 'info',
      Scope: 'telescope',
      Schedule: 'calendar',
      Budget: 'dollar',
      Benefits: 'benefit',
      Risks: 'risks',
      Issues: 'issues',
      Resource: 'resources',
      Dependency: 'dependencies',
      Dependencies: 'dependencies',
    };
    return icons[section] || 'info';
  }

  detailedReportAreaCard(area: { label: string; status: string; tone: string; note: string }): ReportDrawerCard {
    return {
      id: slugifyPlanField(area.label),
      title: area.label,
      body: this.reportBodyForSection(area.label),
      icon: this.reportSectionIcon(area.label),
      status: area.status,
      tone: area.tone,
      trend: this.reportTrendForTone(area.tone),
      comments: area.note,
      timeline: this.detailedReportSharedTimelineSections.has(area.label) ? this.scopePastStatuses : this.reportTimelineForTone(area.tone),
    };
  }

  detailedReportItems(section: string): ReportDetailItem[] {
    return this.detailedReportItemMap[section] || [];
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
      Dependencies: 'Cross-project handoffs, constraints, and owner follow-ups.',
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
      checkedCount: this.stageGateCheckedCount(profile, stageIndex, status),
    };
  }

  private stageGateKey(project: string, stageId: string): string {
    return `${project}|${stageId}`;
  }

  private stageCurrentIndex(profile: StageProfile): number {
    const override = this.projectStageOverrideIndex[profile.project];
    const currentStage = typeof override === 'number' ? override : profile.currentStage;
    return Math.min(Math.max(currentStage, 0), stageDefinitions.length - 1);
  }

  private stageStatus(profile: StageProfile, stageIndex: number): StageGateStatus {
    const currentIndex = this.stageCurrentIndex(profile);
    const stage = stageDefinitions[stageIndex];
    const key = stage ? this.stageGateKey(profile.project, stage.id) : '';
    if (stageIndex < currentIndex) return 'complete';
    if (stageIndex === currentIndex) return this.submittedStageGateKeys.includes(key) ? 'submitted' : 'current';
    return 'upcoming';
  }

  private stageGateCheckedCount(profile: StageProfile, stageIndex: number, status = this.stageStatus(profile, stageIndex)): number {
    if (status === 'complete' || status === 'submitted') return profile.gateTotal;
    const stage = stageDefinitions[stageIndex];
    if (!stage) return 0;
    const key = this.stageGateKey(profile.project, stage.id);
    const state = this.stageGateChecklistState[key];
    if (state) return state.filter(Boolean).length;
    if (status === 'current') return Math.min(profile.gateDone, profile.gateTotal);
    return 0;
  }

  private ensureStageGateChecklistState(profile: StageProfile, stageIndex: number): void {
    const stage = stageDefinitions[stageIndex];
    if (!stage) return;
    const key = this.stageGateKey(profile.project, stage.id);
    if (this.stageGateChecklistState[key]) return;
    this.stageGateChecklistState = {
      ...this.stageGateChecklistState,
      [key]: this.initialStageGateChecklistState(profile, stageIndex),
    };
  }

  private initialStageGateChecklistState(profile: StageProfile, stageIndex: number): boolean[] {
    const status = this.stageStatus(profile, stageIndex);
    const checkedCount = status === 'complete' || status === 'submitted' ? profile.gateTotal : status === 'current' ? profile.gateDone : 0;
    return profile.checklist.map((_, index) => index < checkedCount);
  }

  private isStageGateChecklistComplete(gate: StageGateContext): boolean {
    return gate.profile.checklist.every((_, index) => this.isStageGateChecklistChecked(gate, index));
  }

  private projectPlanStageStatusLabel(status: StageGateStatus): string {
    if (status === 'complete') return 'Approved';
    if (status === 'submitted') return 'Submitted to PMO';
    if (status === 'current') return 'Not submitted';
    if (status === 'revoked') return 'Revoked';
    return 'Not submitted';
  }

  private projectPlanStageStatusTone(status: StageGateStatus): string {
    if (status === 'complete') return 'green';
    if (status === 'submitted') return 'blue';
    if (status === 'current') return 'amber';
    if (status === 'revoked') return 'red';
    return 'neutral';
  }

  private projectPlanStageActionLabel(profile: StageProfile, stageIndex: number, status: StageGateStatus): string {
    if (status === 'complete') return 'View approval';
    if (status === 'submitted') return 'View submission';
    if (status === 'current') {
      const nextStage = stageDefinitions[stageIndex + 1];
      return nextStage ? `Progress to ${nextStage.label} stage` : 'Submit closure gate';
    }
    if (status === 'revoked') return 'Rework gate';
    const currentStage = stageDefinitions[this.stageCurrentIndex(profile)] || stageDefinitions[0];
    return `Waiting for ${currentStage.gate}`;
  }

  private projectPlanStageActionIcon(status: StageGateStatus): string {
    if (status === 'complete') return 'eye';
    if (status === 'submitted') return 'send';
    if (status === 'current') return 'stageGate';
    if (status === 'revoked') return 'alert';
    return 'lock';
  }

  private projectPlanStageActionDisabled(status: StageGateStatus): boolean {
    return status === 'upcoming';
  }

  private canRevokeProjectPlanStage(profile: StageProfile, stageIndex: number, status: StageGateStatus): boolean {
    return status === 'complete' && stageIndex === this.stageCurrentIndex(profile) - 1;
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
    return entry === 'reports' || entry === 'stages' || entry === 'change-request' || entry === 'closure' ? entry : 'quick';
  }

  projectPlanFieldOptions(field: ProjectPlanField): string[] {
    if (field.type === 'boolean') return ['Yes', 'No'];
    return field.options || [];
  }

  dependencyCountLabel(register: DependencyRegisterConfig): string {
    return register.rows.length === 1 ? '1 dependency' : `${register.rows.length} dependencies`;
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

  private activeBudgetPlanKey(): string {
    if (this.selectedProject !== 'all' && this.budgetPlanStates[this.selectedProject]) return this.selectedProject;
    return 'default';
  }

  private cloneBudgetPlanStateMap(source: Record<string, BudgetPlanState>): Record<string, BudgetPlanState> {
    return Object.fromEntries(Object.entries(source).map(([key, value]) => [key, this.cloneBudgetPlanState(value)]));
  }

  private cloneBudgetPlanState(plan: BudgetPlanState): BudgetPlanState {
    return {
      selectedFy: plan.selectedFy,
      lastSavedLabel: plan.lastSavedLabel,
      years: plan.years.map((year) => ({
        ...year,
        fundingSources: year.fundingSources.map((row) => ({ ...row })),
        monthlyRows: year.monthlyRows.map((row) => ({ ...row })),
      })),
    };
  }

  private updateActiveBudgetPlanState(updater: (plan: BudgetPlanState) => BudgetPlanState): void {
    const key = this.activeBudgetPlanKey();
    const current = this.budgetPlanStates[key] || this.budgetPlanStates['default'];
    const next = updater(this.cloneBudgetPlanState(current));
    this.budgetPlanStates = {
      ...this.budgetPlanStates,
      [key]: next,
    };
  }

  private resetBudgetFundingDraft(): void {
    this.budgetFundingSourceDraft = { ...budgetPlanConfig.fundingDraft };
  }

  private parseBudgetInput(value: string): number {
    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private redistributeBudgetMonthlyRows(
    existingRows: BudgetMonthlyRow[],
    fy: string,
    totals: Pick<BudgetYearPlan, 'baselineCapex' | 'baselineOpex' | 'forecastCapex' | 'forecastOpex'>,
  ): BudgetMonthlyRow[] {
    const redistributed = buildBudgetMonthlyRows(fy, totals);
    const existingByMonth = new Map(existingRows.map((row) => [row.month, row]));
    return redistributed.map((row) => {
      const existing = existingByMonth.get(row.month);
      return existing
        ? {
            ...row,
            id: existing.id,
            capexActual: existing.capexActual,
            opexActual: existing.opexActual,
            capexCommitted: existing.capexCommitted,
            opexCommitted: existing.opexCommitted,
          }
        : row;
    });
  }

  private replaceBudgetMonthlyRollupTotal(
    rows: BudgetMonthlyRow[],
    stream: 'CAPEX' | 'OPEX',
    field: 'actual' | 'committed',
    target: number,
  ): BudgetMonthlyRow[] {
    if (!rows.length) return rows;

    const key = `${stream.toLowerCase()}${field === 'actual' ? 'Actual' : 'Committed'}` as BudgetMonthlyField;
    const currentTotal = rows.reduce((total, row) => total + row[key], 0);

    if (currentTotal <= 0) {
      return rows.map((row, index) => ({
        ...row,
        [key]: index === 0 ? target : 0,
      }));
    }

    let runningTotal = 0;
    return rows.map((row, index) => {
      const nextValue = index === rows.length - 1 ? Math.max(0, target - runningTotal) : Math.round(row[key] * (target / currentTotal) * 100) / 100;
      runningTotal += nextValue;
      return {
        ...row,
        [key]: nextValue,
      };
    });
  }

  private budgetFySortValue(fy: string): number {
    return parseBudgetFiscalYears(fy)[0];
  }

  private resetBenefitDraft(): void {
    this.benefitPlanDraft = { ...benefitPlanConfig.draft };
  }

  private resetRiskDraft(): void {
    this.riskPlanDraft = {
      ...riskPlanConfig.draft,
      treatments: riskPlanConfig.draft.treatments.map((treatment) => ({ ...treatment })),
    };
    this.riskTreatmentDraft = { ...riskTreatmentDraftInitial };
    this.riskDrawerOpenProfileAfterSave = false;
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

  private createChangeRequestDraft(): ChangeRequestDraft {
    return {
      ...changeRequestDraftInitial,
      project: this.isAllProjects ? changeRequestDraftInitial.project : this.scopedProjectName,
      types: [...changeRequestDraftInitial.types],
      relatedLinks: changeRequestDraftInitial.relatedLinks.map((link) => ({ ...link })),
    };
  }

  private resetChangeRequestDraft(): void {
    this.changeRequestDraft = this.createChangeRequestDraft();
  }

  private isClosedChangeRequest(row: ChangeRequestRow): boolean {
    return row.status.toLowerCase().includes('closed');
  }

  private changeRequestTypeCount(type: ChangeRequestType): number {
    return this.activeChangeRequestRows.filter((row) => row.types.includes(type)).length;
  }

  private nextChangeRequestNumber(): string {
    const highest = this.changeRequestRows.reduce((max, row) => {
      const numeric = Number(row.pcrNumber.replace(/\D/g, ''));
      return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
    }, 226);
    return `PCR${highest + 1}`;
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

  private scheduleScopeBudgetValue(value: string): number {
    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private scheduleScopeSplitList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private parseScheduleScopeDateInput(value: string): string {
    const trimmed = value.trim();
    const displayMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
    if (!displayMatch) return trimmed;
    const [, day, month, year] = displayMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private scheduleScopeDateShiftLabel(baseline: string, forecast: string): string {
    if (!baseline || !forecast) return 'Dates incomplete';
    const baselineDate = new Date(`${baseline}T00:00:00`);
    const forecastDate = new Date(`${forecast}T00:00:00`);
    if (Number.isNaN(baselineDate.getTime()) || Number.isNaN(forecastDate.getTime())) return 'Dates incomplete';
    const diffDays = Math.round((forecastDate.getTime() - baselineDate.getTime()) / 86400000);
    if (diffDays === 0) return 'Forecast aligned with baseline';
    if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? '' : 's'} later than baseline`;
    const absolute = Math.abs(diffDays);
    return `${absolute} day${absolute === 1 ? '' : 's'} earlier than baseline`;
  }

  private closeProjectPlanDrawers(): void {
    this.closeOverviewBusinessDriverDrawer();
    this.closeOverviewOutcomeDrawer();
    this.closeOverviewObjectiveDrawer();
    this.closeOverviewCapabilityDrawer();
    this.closeOverviewServiceDrawer();
    this.closeScheduleMilestoneDrawer();
    this.closeScheduleEndProductDrawer();
    this.closeScheduleManagementProductDrawer();
    this.closeBudgetRulesPopover();
    this.closeBudgetDrawer();
    this.closeBudgetFundingDrawer();
    this.closeBudgetMonthlyDrawer();
    this.closeBenefitDrawer();
    this.closeRiskDrawer();
    this.closeRiskProfile();
    this.closeIssueDrawer();
    this.closeRelatedLinksDrawer();
    this.closeResourceDrawer();
    this.closeChangeImpactDrawer();
    this.closeChangeRequestDrawer();
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
