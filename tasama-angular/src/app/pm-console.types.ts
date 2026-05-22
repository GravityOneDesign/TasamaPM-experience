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
  portfolioWorkspaceTab?: string;
}

export interface ProjectOption {
  id: string;
  name: string;
}
