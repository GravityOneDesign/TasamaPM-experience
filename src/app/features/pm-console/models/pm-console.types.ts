export interface PmConsoleMountOptions {
  authenticated?: boolean;
  projectId?: string;
  selectedPage?: string;
  selectedView?: string;
  frontDoorMode?: string;
  guidedTourActive?: boolean;
  guidedTourExitMode?: string | null;
  onboardingAssignmentFlow?: boolean;
  onboardingPm101Locked?: boolean;
  onboardingProjectSetup?: boolean;
  notificationPanelOpen?: boolean;
  pmoAssignmentReady?: boolean;
}

export interface ProjectOption {
  id: string;
  name: string;
}

export interface P3MProjectListRequest {
  ProjectStage: string;
  ProjectStatus: string | null;
  PagingParams: {
    PageNumber: number;
    PageSize: number;
  };
  SortDirections: number;
  SortKeyColumn: number;
  SearchParameter: string;
}

export interface P3MProject {
  Id: number;
  ProjectCode: string;
  ProjectName: string;
  Stages: string;
  PlanStatus: string;
  ReportStatus: number;
  OrderedReportStatus: number;
  ProjectManager: string;
  ProjectSponsor: string;
  Tier: string;
  StartDate: string;
  EndDate: string;
  Budget: number;
  ActualBudget: number;
  CompanyID: number;
  OnHoldStatus: string | null;
  OnHoldStartDate: string | null;
  LinkedTags: unknown[];
  businessUnit: string;
  IsSVCTracked: boolean;
}

export interface P3MProjectListResponse {
  TotalItems: number;
  PageNumber: number;
  PageSize: number;
  List: P3MProject[];
  TotalPages: number;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
  NextPageNumber: number;
  PreviousPageNumber: number;
}
