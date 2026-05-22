import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getPersonaFlowOption, PersonaFlowId, PersonaFlowOption } from './persona-flow.config';
import { PmConsoleMountOptions } from './pm-console.types';
import { PmConsoleLoginComponent } from './pm-console-login.component';
import { PmConsoleOnboardingComponent } from './pm-console-onboarding.component';
import { PmConsoleShellComponent } from './pm-console-shell.component';
import { PersonaFlowPlaceholderComponent } from './persona-flow-placeholder.component';

type AppView = 'login' | 'onboarding' | 'console' | 'persona';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PersonaFlowPlaceholderComponent, PmConsoleLoginComponent, PmConsoleOnboardingComponent, PmConsoleShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (view) {
      @case ('console') {
        @if (consoleInitialState; as initialState) {
          <app-pm-console-shell [initialState]="initialState" />
        }
      }
      @case ('persona') {
        @if (selectedPersona; as persona) {
          <app-persona-flow-placeholder [persona]="persona" (backToLogin)="returnToLogin()" />
        }
      }
      @case ('onboarding') {
        <app-pm-console-onboarding (takeTour)="takeTour()" (proceed)="proceedToFrontDoor()" />
      }
      @default {
        <app-pm-console-login (signIn)="enterPersona($event)" (startOnboarding)="startOnboarding()" />
      }
    }
  `,
})
export class AppComponent {
  view: AppView = 'login';
  consoleInitialState: PmConsoleMountOptions | null = null;
  selectedPersona: PersonaFlowOption | null = null;

  enterPersona(personaId: PersonaFlowId): void {
    const persona = getPersonaFlowOption(personaId);
    this.selectedPersona = persona;
    if (persona.entryState) {
      this.mountConsole(persona.entryState);
      return;
    }
    this.consoleInitialState = null;
    this.view = 'persona';
  }

  startOnboarding(): void {
    this.view = 'onboarding';
  }

  returnToLogin(): void {
    this.consoleInitialState = null;
    this.selectedPersona = null;
    this.view = 'login';
  }

  takeTour(): void {
    this.mountConsole({
      authenticated: true,
      projectId: 'all',
      selectedPage: 'workspace',
      selectedView: 'pm101',
      frontDoorMode: 'assigned',
      guidedTourActive: true,
      guidedTourExitMode: 'onboarding-assignment-flow',
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
