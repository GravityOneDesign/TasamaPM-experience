export type PmoReportReviewTabId = 'standard' | 'custom' | 'governance';

export interface PmoReportReviewTab {
  readonly id: PmoReportReviewTabId;
  readonly label: string;
  readonly icon: string;
  readonly widthPx: number;
}

export interface PmoReportReviewFilter {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly icon: string;
}

export interface PmoReportReviewCard {
  readonly id: string;
  readonly title: string;
  readonly drawerTitle?: string;
  readonly creatorInitials?: string;
  readonly creatorName?: string;
  readonly recursOn?: string;
  readonly publishedOn: string;
  readonly actionLabel: string;
}

export interface PmoReportReviewColumn {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly count: number;
  readonly reports: readonly PmoReportReviewCard[];
}

export type PmoReportReviewDrawerTabId = 'project-plan' | 'project-status-report';
export type PmoReportReviewDrawerChipTone = 'blue' | 'neutral' | 'amber' | 'green';
export type PmoReportReviewDrawerActionKind = 'create' | 'edit' | 'download';

export interface PmoReportReviewDrawerDocument {
  readonly id: string;
  readonly name: string;
}

export interface PmoReportReviewDrawerChip {
  readonly label: string;
  readonly tone: PmoReportReviewDrawerChipTone;
}

export interface PmoReportReviewDrawerStatusAction {
  readonly kind: PmoReportReviewDrawerActionKind;
  readonly label: string;
  readonly icon: string;
}

export interface PmoReportReviewDrawerStatusReport {
  readonly id: string;
  readonly intervalStartDate: string;
  readonly intervalEndDate: string;
  readonly dueApprovedDate: string;
  readonly reportStatus: PmoReportReviewDrawerChip;
  readonly projectStatus: PmoReportReviewDrawerChip;
  readonly reportType: string;
  readonly action: PmoReportReviewDrawerStatusAction;
}

export interface PmoReportReviewDrawerTab {
  readonly id: PmoReportReviewDrawerTabId;
  readonly label: string;
  readonly icon: string;
  readonly widthPx: number;
  readonly documents?: readonly PmoReportReviewDrawerDocument[];
  readonly statusReports?: readonly PmoReportReviewDrawerStatusReport[];
}

const standardReportTitle = 'Revisit current development and delivery model to enhance quality and timing';
const standardReportDrawerTitle = 'Revisit current development and delivery models to enhance quality and timing';
const customReportTitle = 'Revisit current development and delivery model to enhance quality';

const standardReportCards: readonly PmoReportReviewCard[] = [
  {
    id: 'delivery-model-review-1',
    title: standardReportTitle,
    drawerTitle: standardReportDrawerTitle,
    creatorInitials: 'JD',
    creatorName: 'John Doe',
    publishedOn: '07/05/2026',
    actionLabel: 'View Reports',
  },
  {
    id: 'delivery-model-review-2',
    title: standardReportTitle,
    drawerTitle: standardReportDrawerTitle,
    creatorInitials: 'JD',
    creatorName: 'John Doe',
    publishedOn: '07/05/2026',
    actionLabel: 'View Reports',
  },
  {
    id: 'delivery-model-review-3',
    title: standardReportTitle,
    drawerTitle: standardReportDrawerTitle,
    creatorInitials: 'JD',
    creatorName: 'John Doe',
    publishedOn: '07/05/2026',
    actionLabel: 'Preview',
  },
];

export const pmoReportReviewTabs: readonly PmoReportReviewTab[] = [
  { id: 'standard', label: 'Standard Reports', icon: 'square-chart-gantt', widthPx: 201 },
  { id: 'custom', label: 'Custom Reports', icon: 'network', widthPx: 192 },
  { id: 'governance', label: 'Governance Register', icon: 'layout-grid', widthPx: 215 },
];

export const pmoReportReviewFilters: readonly PmoReportReviewFilter[] = [
  { id: 'portfolio', label: 'Portfolio - All', count: 12, icon: 'layout-grid' },
  { id: 'program', label: 'Program', count: 12, icon: 'file-text' },
];

export const pmoReportReviewColumns: readonly PmoReportReviewColumn[] = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    icon: 'network',
    count: 4,
    reports: standardReportCards,
  },
  {
    id: 'programs',
    title: 'Programs',
    icon: 'layout-grid',
    count: 3,
    reports: standardReportCards,
  },
  {
    id: 'project',
    title: 'Project',
    icon: 'file-text',
    count: 5,
    reports: standardReportCards,
  },
];

export const scheduledReports: PmoReportReviewCard[] = [...createCustomReports('scheduled-report', true)];
export const adHocReports: PmoReportReviewCard[] = [...createCustomReports('ad-hoc-report', false)];

export const pmoReportReviewCustomColumns: readonly PmoReportReviewColumn[] = [
  {
    id: 'scheduled',
    title: 'Scheduled Reports',
    icon: 'network',
    get count() { return scheduledReports.length; },
    get reports() { return scheduledReports; }
  },
  {
    id: 'ad-hoc',
    title: 'Ad-hoc Reports',
    icon: 'layout-grid',
    get count() { return adHocReports.length; },
    get reports() { return adHocReports; }
  },
];

export const pmoReportReviewDrawerTabs: readonly PmoReportReviewDrawerTab[] = [
  {
    id: 'project-plan',
    label: 'Project Plan',
    icon: 'calendar-days',
    widthPx: 159,
    documents: [
      { id: 'project-plan', name: 'Project Plan' },
      { id: 'project-risk-plan', name: 'Project Risk Plan' },
      { id: 'project-lessons-learnt-register', name: 'Project Lessons Learnt Register' },
    ],
  },
  {
    id: 'project-status-report',
    label: 'Project Status Report',
    icon: 'sliders-horizontal',
    widthPx: 224,
    statusReports: [
      {
        id: 'status-report-august-open',
        intervalStartDate: '31/08/2026',
        intervalEndDate: '31/08/2026',
        dueApprovedDate: '31/08/2026',
        reportStatus: { label: 'Not Created', tone: 'blue' },
        projectStatus: { label: 'Not Tracked', tone: 'neutral' },
        reportType: 'Standard',
        action: { kind: 'create', label: 'Create', icon: 'plus' },
      },
      {
        id: 'status-report-august-draft',
        intervalStartDate: '31/08/2026',
        intervalEndDate: '31/08/2026',
        dueApprovedDate: '26/11/2026',
        reportStatus: { label: 'Draft', tone: 'neutral' },
        projectStatus: { label: 'Alert/Discuss', tone: 'amber' },
        reportType: 'Standard',
        action: { kind: 'edit', label: 'Edit', icon: 'pencil' },
      },
      {
        id: 'status-report-may-draft',
        intervalStartDate: '05/08/2026',
        intervalEndDate: '31/05/2026',
        dueApprovedDate: '07/03/2026',
        reportStatus: { label: 'Draft', tone: 'neutral' },
        projectStatus: { label: 'On Track', tone: 'green' },
        reportType: 'Standard',
        action: { kind: 'edit', label: 'Edit', icon: 'pencil' },
      },
      {
        id: 'status-report-april-open',
        intervalStartDate: '01/04/2026',
        intervalEndDate: '31/04/2026',
        dueApprovedDate: '07/03/2026',
        reportStatus: { label: 'Not Created', tone: 'blue' },
        projectStatus: { label: 'Not Tracked', tone: 'neutral' },
        reportType: 'Standard',
        action: { kind: 'create', label: 'Create', icon: 'plus' },
      },
      {
        id: 'status-report-march-submitted',
        intervalStartDate: '01/03/2026',
        intervalEndDate: '31/03/2026',
        dueApprovedDate: '07/03/2026',
        reportStatus: { label: 'Submitted', tone: 'green' },
        projectStatus: { label: 'Not Tracked', tone: 'neutral' },
        reportType: 'Standard',
        action: { kind: 'download', label: 'Download', icon: 'download' },
      },
    ],
  },
];

export function isPmoReportReviewTabId(tabId: string): tabId is PmoReportReviewTabId {
  return tabId === 'standard' || tabId === 'custom' || tabId === 'governance';
}

export function isPmoReportReviewDrawerTabId(tabId: string): tabId is PmoReportReviewDrawerTabId {
  return tabId === 'project-plan' || tabId === 'project-status-report';
}

function createCustomReports(prefix: string, includeRecurrence: boolean): readonly PmoReportReviewCard[] {
  return Array.from({ length: 6 }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    title: customReportTitle,
    recursOn: includeRecurrence ? '5th Monthly' : undefined,
    publishedOn: '07/05/2026',
    actionLabel: 'Preview',
  }));
}

export function addScheduledReport(title: string, recursOn: string): void {
  const today = new Date();
  const publishedOn = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  
  scheduledReports.unshift({
    id: `scheduled-report-new-${Date.now()}`,
    title,
    recursOn,
    publishedOn,
    actionLabel: 'Preview',
    creatorInitials: 'MH',
    creatorName: 'Muna Hassan'
  });
}
