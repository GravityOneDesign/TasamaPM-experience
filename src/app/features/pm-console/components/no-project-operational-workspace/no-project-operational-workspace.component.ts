import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PmConsoleFrontdoorActionCardsComponent,
  type PmConsoleFrontdoorAction,
} from '../frontdoor-action-cards/frontdoor-action-cards.component';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';

type AssignmentWorkspaceMode = 'unassigned' | 'assigned';

interface AssignmentWorkspaceCard {
  id: string;
  title: string;
  body: string;
  icon: string;
  decor: 'waves' | 'loops' | 'hex' | 'plus' | 'burst';
  actionId?: string;
  badge?: string;
}

const toFrontdoorActionCard = (card: AssignmentWorkspaceCard): PmConsoleFrontdoorAction => ({
  id: card.actionId || card.id,
  title: card.title,
  description: card.body,
  icon: card.icon,
  decor: card.decor,
  badgeLabel: card.badge,
  disabled: !card.actionId,
});

export interface AssignmentWorkspaceCoverUploadRequest {
  projectId: string;
  projectName: string;
}

const assignmentWorkspaceCards: readonly AssignmentWorkspaceCard[] = [
  {
    id: 'plan',
    title: 'Build project plan',
    body: 'Define scope, timelines and project milestones using the simple or detailed project plan template.',
    icon: 'file-text',
    decor: 'waves',
    actionId: 'build-plan',
  },
  {
    id: 'delivery',
    title: 'Manage delivery',
    body: 'Track risks, dependencies, and benefits through easy access registers in your workspace.',
    icon: 'network',
    decor: 'loops',
    badge: 'Coming Soon!',
  },
  {
    id: 'progress',
    title: 'Report progress',
    body: 'Provide periodic delivery updates through status reports, to gain insight on project trends.',
    icon: 'chart-column',
    decor: 'hex',
    badge: 'Coming Soon!',
  },
  {
    id: 'stage-gates',
    title: 'Review Stage Gates',
    body: 'Complete readiness checklists & approvals, to progress through the project lifecycle.',
    icon: 'clipboard-check',
    decor: 'plus',
    badge: 'Coming Soon!',
  },
  {
    id: 'learning',
    title: 'Access Learning',
    body: 'Explore PM Playbooks and frameworks, and understand PIF guidelines to delivery at your best!',
    icon: 'book-open',
    decor: 'burst',
    actionId: 'learning',
  },
];

const noProjectWorkspaceCards: readonly AssignmentWorkspaceCard[] = assignmentWorkspaceCards.map((card) =>
  card.id === 'plan' ? { ...card, actionId: undefined, badge: 'Coming Soon!' } : card,
);

const assignmentWorkspaceActionCards: readonly PmConsoleFrontdoorAction[] = assignmentWorkspaceCards.map(toFrontdoorActionCard);
const noProjectWorkspaceActionCards: readonly PmConsoleFrontdoorAction[] = noProjectWorkspaceCards.map(toFrontdoorActionCard);

@Component({
  selector: 'app-pm-console-no-project-operational-workspace',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsoleFrontdoorActionCardsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: 100%;
      }

      .no-project-operational {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
        width: 100%;
      }

      .assigned-project-hero-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: minmax(260px, 1fr) minmax(0, 2.06fr);
        min-width: 0;
        width: 100%;
      }

      .assigned-project-card,
      .assigned-project-banner {
        border-radius: 12px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.12);
        min-height: 144px;
        overflow: hidden;
        position: relative;
      }

      .assigned-project-card {
        align-items: flex-start;
        background: #183733;
        display: flex;
        flex-direction: column;
        padding: 16px;
      }

      .assigned-project-card::after {
        background: linear-gradient(215.98deg, rgba(11, 11, 11, 0) 2.78%, rgba(11, 11, 11, 0.5) 98.05%);
        content: "";
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .assigned-project-card-art,
      .assigned-project-banner-art {
        display: block;
        height: 100%;
        inset: 0;
        object-fit: cover;
        position: absolute;
        width: 100%;
      }

      .assigned-project-card-art {
        object-position: center 46%;
      }

      .assigned-project-banner::after {
        background: linear-gradient(90deg, rgba(6, 2, 57, 0.5) 2.66%, rgba(16, 6, 159, 0.5) 97.34%);
        content: "";
        inset: 0;
        mix-blend-mode: multiply;
        position: absolute;
      }

      .assigned-project-chip,
      .assigned-project-title,
      .assigned-project-banner-copy,
      .assigned-project-cover-upload {
        position: relative;
        z-index: 1;
      }

      .assigned-project-cover-upload {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 0;
        color: #ffffff;
        cursor: pointer;
        display: inline-flex;
        height: 24px;
        justify-content: center;
        padding: 0;
        position: absolute;
        right: 16px;
        top: 16px;
        transition: color 180ms ease, transform 180ms ease;
        width: 24px;
      }

      .assigned-project-cover-upload:hover,
      .assigned-project-cover-upload:focus-visible {
        color: #addc91;
        outline: 2px solid rgba(173, 220, 145, 0.62);
        outline-offset: 2px;
        transform: translateY(-1px);
      }

      .assigned-project-cover-upload .icon {
        height: 20px;
        width: 20px;
      }

      .assigned-project-chip {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 999px;
        color: #ffffff;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        margin-bottom: 10px;
        padding: 4px 8px;
      }

      .assigned-project-title {
        color: #ffffff;
        display: block;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        max-width: 220px;
      }

      .assigned-project-banner-copy {
        display: flex;
        flex-direction: column;
        gap: 8px;
        left: 23px;
        max-width: 449px;
        position: absolute;
        top: 20px;
      }

      .assigned-project-banner-copy strong {
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
      }

      .assigned-project-banner-copy p {
        color: #eeeeee;
        font-size: 12px;
        line-height: 16px;
        margin: 0;
        max-width: 383px;
      }

      .no-project-hero {
        background: #06122a;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(11, 11, 11, 0.08);
        color: #ffffff;
        min-height: 144px;
        overflow: hidden;
        padding: 20px 23px;
        position: relative;
      }

      .no-project-hero-art {
        height: 100%;
        inset: 0;
        object-fit: cover;
        position: absolute;
        width: 100%;
      }

      .no-project-hero::after {
        background: linear-gradient(90deg, rgba(6, 2, 57, 0.5) 2.66%, rgba(16, 6, 159, 0.5) 97.34%);
        content: "";
        inset: 0;
        mix-blend-mode: multiply;
        position: absolute;
      }

      .no-project-hero-copy {
        max-width: 582px;
        position: relative;
        z-index: 1;
      }

      .no-project-hero-copy strong {
        color: #ffffff;
        display: block;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin-bottom: 8px;
      }

      .no-project-hero-copy p {
        color: rgba(255, 255, 255, 0.92);
        font-size: 12px;
        line-height: 16px;
        margin: 0;
        max-width: 580px;
      }

      .no-project-status {
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 999px;
        color: #ffffff;
        display: inline-flex;
        gap: 8px;
        height: 32px;
        margin-top: 16px;
        padding: 0 16px;
      }

      .no-project-status .icon {
        height: 16px;
        width: 16px;
      }

      .no-project-status span:last-child {
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
      }

      @media (max-width: 760px) {
        .assigned-project-hero-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
  template: `
    <section class="no-project-operational" [attr.aria-label]="mode === 'assigned' ? 'Operational workspace with assigned project' : 'Operational workspace awaiting project assignment'">
      @if (mode === 'assigned') {
        <div class="assigned-project-hero-grid" aria-label="Assigned project overview">
          <article class="assigned-project-card" [attr.aria-label]="projectName + ' assigned by PMO'">
            <img class="assigned-project-card-art" [src]="projectCoverImageSrc" alt="" aria-hidden="true" />
            @if (coverUploadEnabled && projectId) {
              <button
                class="assigned-project-cover-upload"
                type="button"
                [attr.aria-label]="'Change cover image for ' + projectName"
                [title]="'Change cover image for ' + projectName"
                (click)="requestCoverUpload($event)"
              >
                <span [pmConsoleIcon]="'image-plus'" aria-hidden="true"></span>
              </button>
            }
            <span class="assigned-project-chip">New project assigned by PMO</span>
            <strong class="assigned-project-title">{{ projectName }}</strong>
          </article>
          <article class="assigned-project-banner" aria-label="Project planning is ready">
            <img class="assigned-project-banner-art" src="./assets/pm101-first-project-banner-bg.png" alt="" aria-hidden="true" />
            <div class="assigned-project-banner-copy">
              <strong>Your first project is ready to plan!</strong>
              <p>Your PMO has assigned {{ projectName }} to your workspace. Build the baseline project plan, and start tracking progress!</p>
            </div>
          </article>
        </div>
      } @else {
        <article class="no-project-hero" aria-label="Assignment status">
          <img class="no-project-hero-art" src="./assets/onboarding-workspace/no-project-operational-hero.png" alt="" aria-hidden="true" />
          <div class="no-project-hero-copy">
            <strong>Awaiting first assignment</strong>
            <p>Your workspace is ready. Once you're assigned a project, planning will unlock!<br />Build the baseline project plan, and start tracking progress!</p>
            <button class="no-project-status" type="button" (click)="workspaceAction.emit('assignment')" aria-label="Awaiting project assignment">
              <span pmConsoleIcon="bell" aria-hidden="true"></span>
              <span>Awaiting project assignment</span>
            </button>
          </div>
        </article>
      }

      <app-pm-console-frontdoor-action-cards
        data-tour-target="frontdoor-actions"
        [actions]="cards"
        [edgeBleed]="false"
        [projectName]="mode === 'assigned' ? projectName : ''"
        [ariaLabel]="'Workspace areas available after assignment'"
        (actionSelected)="workspaceAction.emit($event)"
      ></app-pm-console-frontdoor-action-cards>
    </section>
  `,
})
export class PmConsoleNoProjectOperationalWorkspaceComponent {
  @Input() mode: AssignmentWorkspaceMode = 'unassigned';
  @Input() projectId = '';
  @Input() projectName = 'UAE Research Map';
  @Input() projectCoverImageSrc = './assets/pm101-first-project-card-bg.png';
  @Input() coverUploadEnabled = false;

  @Output() readonly workspaceAction = new EventEmitter<string>();
  @Output() readonly coverUploadRequested = new EventEmitter<AssignmentWorkspaceCoverUploadRequest>();

  get cards(): readonly PmConsoleFrontdoorAction[] {
    if (this.mode === 'assigned') return assignmentWorkspaceActionCards;
    return noProjectWorkspaceActionCards;
  }

  requestCoverUpload(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.projectId) return;
    this.coverUploadRequested.emit({
      projectId: this.projectId,
      projectName: this.projectName,
    });
  }
}

