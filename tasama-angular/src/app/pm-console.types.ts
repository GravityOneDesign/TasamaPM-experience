export interface PmConsoleMountOptions {
  authenticated?: boolean;
  projectId?: string;
  selectedPage?: string;
  selectedView?: string;
  frontDoorMode?: string;
  guidedTourActive?: boolean;
  guidedTourExitMode?: string | null;
  onboardingPm101Locked?: boolean;
  notificationPanelOpen?: boolean;
  pmoAssignmentReady?: boolean;
}
