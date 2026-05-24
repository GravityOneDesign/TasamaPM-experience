import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioWorkspaceComponent } from './portfolio-workspace/portfolio-workspace.component';
import { PortfolioManagerLandingComponent } from './portfolio-manager-landing.component';
import { PortfolioWorkspaceFrameworkComponent } from './portfolio-workspace/portfolio-workspace-framework.component';
import { PortfolioWorkspacePerformanceComponent } from './portfolio-workspace/portfolio-workspace-performance.component';
import { ConsolePage, PmConsoleMountOptions, ProjectOption } from './pm-console.types';

type WorkspaceView = 'calendar' | 'board' | 'pm101' | 'stages' | 'quicklinks';

@Component({
  selector: 'app-portfolio-manager-console',
  standalone: true,
  imports: [
    CommonModule,
    PortfolioWorkspaceComponent,
    PortfolioManagerLandingComponent,
    PortfolioWorkspaceFrameworkComponent,
    PortfolioWorkspacePerformanceComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (selectedPage) {
      @case ('portfolio-workspace') {
        <app-portfolio-workspace
          [activeTab]="$any(portfolioWorkspaceTab)"
          (activeTabChange)="consoleStateChange.emit({ portfolioWorkspaceTab: $event })"
          (back)="consoleStateChange.emit({ selectedPage: 'workspace' })"
        />
      }
      @case ('framework') {
        <div class="portfolio-workspace-page-container">
          <div class="project-plan-card-frame" style="flex: 1; min-height: 0;">
            <app-portfolio-workspace-framework
              (back)="consoleStateChange.emit({ selectedPage: 'workspace' })"
            />
          </div>
        </div>
      }
      @case ('performance') {
        <div class="portfolio-workspace-page-container">
          <div class="pm-projects-shell" style="flex: 1; min-height: 0;">
            <div class="pm-projects-board">
              <main class="pm-projects-board-body portfolio-workspace-body">
                <app-portfolio-workspace-performance />
              </main>
            </div>
          </div>
        </div>
      }
      @default {
        <app-portfolio-manager-landing
          (consoleStateChange)="consoleStateChange.emit($event)"
        />
      }
    }
  `,
  styles: [`
    .portfolio-workspace-page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: transparent;
      color: #202633;
      padding: 16px 24px 24px 24px;
    }

    .pm-projects-shell {
      background: transparent;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      height: 100%;
      margin-top: 12px;
      min-height: 0;
      overflow: visible;
      padding: 0;
      position: relative;
    }

    .pm-projects-board {
      background: #ffffff;
      border: 1px solid #eeeeee;
      border-radius: 22px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      padding: 0;
      position: relative;
    }

    .portfolio-workspace-body {
      flex-grow: 1;
      overflow-y: auto;
      background: #ffffff;
      padding: 20px 10px 10px;
    }
  `]
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
