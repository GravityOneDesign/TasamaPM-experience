import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioWorkspaceComponent } from './portfolio-workspace/portfolio-workspace.component';
import { PortfolioManagerLandingComponent } from './portfolio-manager-landing.component';
import { PmConsoleMountOptions, ProjectOption } from './pm-console.types';

type ConsolePage = 'workspace' | 'workspaces' | 'wbs' | 'project-plan' | 'playground' | 'portfolio-workspace';
type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages';

@Component({
  selector: 'app-portfolio-manager-console',
  standalone: true,
  imports: [CommonModule, PortfolioWorkspaceComponent, PortfolioManagerLandingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (selectedPage) {
      @case ('portfolio-workspace') {
        <app-portfolio-workspace [activeTab]="$any(portfolioWorkspaceTab)" (activeTabChange)="consoleStateChange.emit({ portfolioWorkspaceTab: $event })" />
      }
      @default {
        <app-portfolio-manager-landing
          (consoleStateChange)="consoleStateChange.emit($event)"
        />
      }
    }
  `,
})
export class PortfolioManagerConsoleComponent {
  @Input() projectOptions: readonly ProjectOption[] = [];
  @Input() selectedProject = 'all';
  @Input() selectedPage: ConsolePage = 'workspace';
  @Input() selectedView: WorkspaceView = 'board';
  @Input() frontDoorMode = 'assigned';
  @Input() pmoAssignmentReady = false;
  @Input() guidedTourActive = false;
  @Input() guidedTourExitMode: string | null = null;
  @Input() onboardingAssignmentFlow = false;
  @Input() onboardingPm101Locked = false;
  @Input() onboardingProjectSetup = false;
  @Input() portfolioWorkspaceTab: any = 'overview';
  @Output() readonly consoleStateChange = new EventEmitter<Partial<PmConsoleMountOptions>>();
}
