import { PmConsoleMountOptions } from './pm-console.types';

export type PortfolioConsolePage = 'workspace' | 'workspaces' | 'portfolio-workspace' | 'framework' | 'performance';
export type PortfolioWorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages' | 'quicklinks';

export interface PortfolioManagerMountOptions extends PmConsoleMountOptions {
  selectedPage?: PortfolioConsolePage;
  selectedView?: PortfolioWorkspaceView;
  portfolioWorkspaceTab?: string;
}
