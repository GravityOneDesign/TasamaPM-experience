import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getPersonaFlowOption, PersonaFlowId, PersonaFlowOption } from './persona-flow.config';
import { ExecutiveDashboardComponent } from './executive/executive-dashboard.component';
import { PmConsoleMountOptions } from './pm-console.types';
import { PmConsoleLoginComponent } from './pm-console-login.component';
import { PmConsoleOnboardingComponent } from './pm-console-onboarding.component';
import { PmConsoleShellComponent } from './pm-console-shell.component';
import { PmoGovernanceShellComponent } from './pmo-governance-shell.component';
import { PortfolioManagerShellComponent } from './portfolio-manager-shell.component';
import { PortfolioManagerMountOptions } from './portfolio-manager.types';
import { PersonaFlowPlaceholderComponent } from './persona-flow-placeholder.component';

type AppView = 'login' | 'onboarding' | 'console' | 'portfolio' | 'pmo' | 'persona' | 'executive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ExecutiveDashboardComponent,
    PersonaFlowPlaceholderComponent,
    PmConsoleLoginComponent,
    PmConsoleOnboardingComponent,
    PmConsoleShellComponent,
    PmoGovernanceShellComponent,
    PortfolioManagerShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (view) {
      @case ('executive') {
        <app-executive-dashboard />
      }
      @case ('console') {
        @if (consoleInitialState; as initialState) {
          <app-pm-console-shell [initialState]="initialState" />
        }
      }
      @case ('portfolio') {
        @if (portfolioInitialState; as initialState) {
          <app-portfolio-manager-shell [initialState]="initialState" />
        }
      }
      @case ('pmo') {
        <app-pmo-governance-shell />
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
  portfolioInitialState: PortfolioManagerMountOptions | null = null;
  selectedPersona: PersonaFlowOption | null = null;

  enterPersona(personaId: PersonaFlowId): void {
    const persona = getPersonaFlowOption(personaId);
    this.selectedPersona = persona;
    if (persona.id === 'executive') {
      this.consoleInitialState = null;
      this.portfolioInitialState = null;
      this.view = 'executive';
      return;
    }
    if (persona.id === 'portfolio-manager' && persona.entryState) {
      this.mountPortfolioConsole(persona.entryState);
      return;
    }
    if (persona.id === 'pmo') {
      this.consoleInitialState = null;
      this.portfolioInitialState = null;
      this.view = 'pmo';
      return;
    }
    if (persona.entryState) {
      this.mountConsole(persona.entryState);
      return;
    }
    this.consoleInitialState = null;
    this.portfolioInitialState = null;
    this.view = 'persona';
  }

  startOnboarding(): void {
    this.view = 'onboarding';
  }

  returnToLogin(): void {
    this.consoleInitialState = null;
    this.portfolioInitialState = null;
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
    this.portfolioInitialState = null;
    this.view = 'console';
  }

  private mountPortfolioConsole(initialState: PmConsoleMountOptions): void {
    this.consoleInitialState = null;
    this.portfolioInitialState = initialState as PortfolioManagerMountOptions;
    this.view = 'portfolio';
  }
}
