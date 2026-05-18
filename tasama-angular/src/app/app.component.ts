import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PmConsoleMountOptions } from './pm-console.types';
import { PmConsoleLoginComponent } from './pm-console-login.component';
import { PmConsoleOnboardingComponent } from './pm-console-onboarding.component';
import { PmConsoleShellComponent } from './pm-console-shell.component';

type AppView = 'login' | 'onboarding' | 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PmConsoleLoginComponent, PmConsoleOnboardingComponent, PmConsoleShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (view) {
      @case ('console') {
        @if (consoleInitialState; as initialState) {
          <app-pm-console-shell [initialState]="initialState" />
        }
      }
      @case ('onboarding') {
        <app-pm-console-onboarding (takeTour)="takeTour()" (proceed)="proceedToFrontDoor()" />
      }
      @default {
        <app-pm-console-login (signIn)="enterConsole()" (startOnboarding)="startOnboarding()" />
      }
    }
  `,
})
export class AppComponent {
  view: AppView = 'login';
  consoleInitialState: PmConsoleMountOptions | null = null;

  enterConsole(): void {
    this.mountConsole({
      authenticated: true,
      projectId: 'all',
      selectedPage: 'workspace',
      selectedView: 'pm101',
      frontDoorMode: 'assigned',
    });
  }

  startOnboarding(): void {
    this.view = 'onboarding';
  }

  takeTour(): void {
    this.mountConsole({
      authenticated: true,
      projectId: 'all',
      selectedPage: 'workspace',
      selectedView: 'calendar',
      frontDoorMode: 'assigned',
      guidedTourActive: true,
      guidedTourExitMode: 'onboarding-assignment-flow',
      onboardingAssignmentFlow: true,
    });
  }

  proceedToFrontDoor(): void {
    this.mountConsole({
      authenticated: true,
      projectId: 'all',
      selectedPage: 'workspace',
      selectedView: 'pm101',
      frontDoorMode: 'assigned',
      pmoAssignmentReady: false,
      onboardingAssignmentFlow: true,
      onboardingPm101Locked: true,
    });
  }

  private mountConsole(initialState: PmConsoleMountOptions): void {
    this.consoleInitialState = initialState;
    this.view = 'console';
  }
}
