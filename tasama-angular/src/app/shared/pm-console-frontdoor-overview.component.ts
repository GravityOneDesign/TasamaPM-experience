import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PmConsoleFrontdoorActionCardsComponent,
  type PmConsoleFrontdoorAction,
} from './pm-console-frontdoor-action-cards.component';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export type { PmConsoleFrontdoorAction } from './pm-console-frontdoor-action-cards.component';

export interface PmConsoleFrontdoorTrendDot {
  tone: 'green' | 'amber' | 'red' | 'blue' | 'neutral';
  label: string;
}

export interface PmConsoleFrontdoorCoverUploadRequest {
  projectId: string;
  projectName: string;
}

@Component({
  selector: 'app-pm-console-frontdoor-overview',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsoleFrontdoorActionCardsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .frontdoor-overview {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .frontdoor-hero {
        background: #173f48;
        border-radius: 12px;
        color: #ffffff;
        display: grid;
        min-height: 240px;
        overflow: hidden;
        padding: 16px;
        position: relative;
      }

      .frontdoor-hero-image,
      .frontdoor-hero::before,
      .frontdoor-hero::after {
        inset: 0;
        position: absolute;
      }

      .frontdoor-hero-image {
        height: 100%;
        object-fit: cover;
        width: 100%;
        z-index: 0;
      }

      .frontdoor-hero::before {
        background:
          linear-gradient(180deg, rgba(11, 11, 11, 0.05) 0%, rgba(11, 11, 11, 0.76) 100%),
          linear-gradient(90deg, rgba(8, 45, 49, 0.82) 0%, rgba(9, 38, 47, 0.58) 47%, rgba(8, 45, 49, 0.14) 100%);
        content: "";
        z-index: 1;
      }

      .frontdoor-hero::after {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 42%);
        content: "";
        pointer-events: none;
        z-index: 2;
      }

      .frontdoor-hero-content {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        min-height: 208px;
        position: relative;
        z-index: 3;
      }

      .frontdoor-hero-top {
        align-items: flex-start;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-width: 0;
      }

      .frontdoor-project-title {
        align-items: center;
        display: inline-flex;
        gap: 12px;
        min-width: 0;
      }

      .frontdoor-project-icon {
        align-items: center;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 8px;
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 auto;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .frontdoor-project-icon .icon {
        height: 20px;
        width: 20px;
      }

      .frontdoor-project-icon .icon svg,
      .frontdoor-project-icon .icon i {
        height: 20px;
        width: 20px;
      }

      .frontdoor-project-title h2 {
        color: #ffffff;
        font-size: 24px;
        font-weight: 500;
        line-height: 1.2;
        margin: 0;
        min-width: 0;
      }

      .frontdoor-hero-pills {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .frontdoor-hero-meta {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .frontdoor-cover-upload {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 0;
        color: #ffffff;
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 24px;
        height: 24px;
        justify-content: center;
        padding: 0;
        transition: color 180ms ease, transform 180ms ease;
        width: 24px;
      }

      .frontdoor-cover-upload:hover,
      .frontdoor-cover-upload:focus-visible {
        color: #addc91;
        outline: 2px solid rgba(173, 220, 145, 0.62);
        outline-offset: 2px;
        transform: translateY(-1px);
      }

      .frontdoor-cover-upload .icon {
        height: 20px;
        width: 20px;
      }

      .frontdoor-pill {
        align-items: center;
        background: rgba(47, 47, 47, 0.42);
        border-radius: 7px;
        color: #ffffff;
        display: inline-flex;
        font-size: 13px;
        font-weight: 500;
        gap: 8px;
        line-height: 18px;
        min-height: 24px;
        padding: 3px 10px;
        white-space: nowrap;
      }

      .frontdoor-pill.status {
        background: rgba(135, 190, 120, 0.72);
      }

      .frontdoor-pill.status.amber {
        background: rgba(232, 119, 34, 0.78);
      }

      .frontdoor-pill.status.red {
        background: rgba(185, 28, 28, 0.76);
      }

      .frontdoor-pill.status.blue,
      .frontdoor-pill.status.neutral {
        background: rgba(71, 105, 170, 0.72);
      }

      .frontdoor-pill-dot {
        background: #9dd66e;
        border-radius: 999px;
        height: 7px;
        width: 7px;
      }

      .frontdoor-hero-bottom {
        align-items: end;
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(220px, 1fr) auto;
      }

      .frontdoor-schedule {
        align-self: end;
        display: grid;
        gap: 8px;
        max-width: 360px;
        min-width: 0;
      }

      .frontdoor-schedule-label,
      .frontdoor-psr-line {
        color: rgba(255, 255, 255, 0.88);
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
      }

      .frontdoor-schedule-value {
        color: #ffffff;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }

      .frontdoor-schedule-track {
        align-items: center;
        background: rgba(255, 255, 255, 0.32);
        border-radius: 999px;
        display: flex;
        height: 6px;
        overflow: hidden;
        width: 240px;
      }

      .frontdoor-schedule-track span {
        background: #ffffff;
        border-radius: inherit;
        display: block;
        height: 100%;
      }

      .frontdoor-psr-row {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        min-width: 0;
      }

      .frontdoor-psr-dots {
        align-items: center;
        display: inline-flex;
        gap: 4px;
      }

      .frontdoor-psr-dot {
        border-radius: 3px;
        display: inline-flex;
        height: 10px;
        width: 10px;
      }

      .frontdoor-psr-dot.green {
        background: #22a06b;
      }

      .frontdoor-psr-dot.amber {
        background: #e87722;
      }

      .frontdoor-psr-dot.red {
        background: #e05252;
      }

      .frontdoor-psr-dot.blue {
        background: #2f5bea;
      }

      .frontdoor-psr-dot.neutral {
        background: rgba(255, 255, 255, 0.34);
      }

      .frontdoor-psr-line {
        align-items: center;
        display: inline-flex;
        gap: 8px;
      }

      .frontdoor-psr-line .icon {
        height: 14px;
        width: 14px;
      }

      .frontdoor-hero-cta {
        align-items: center;
        align-self: end;
        background: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 999px;
        color: #0b0b0b;
        display: inline-flex;
        font-size: 13px;
        font-weight: 500;
        gap: 12px;
        height: 42px;
        justify-content: center;
        line-height: 18px;
        padding: 4px 5px 4px 16px;
        white-space: nowrap;
      }

      .frontdoor-hero-cta:hover,
      .frontdoor-hero-cta:focus-visible {
        box-shadow: 0 8px 18px rgba(11, 11, 11, 0.18);
        outline: 0;
      }

      .frontdoor-hero-cta .icon {
        align-items: center;
        background: #a8dc83;
        border-radius: 999px;
        color: #0b0b0b;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      @media (max-width: 780px) {
        .frontdoor-project-title h2 {
          font-size: 22px;
        }

        .frontdoor-hero-top,
        .frontdoor-hero-bottom {
          align-items: start;
          grid-template-columns: minmax(0, 1fr);
        }

        .frontdoor-hero-top {
          flex-direction: column;
        }

        .frontdoor-hero-pills {
          justify-content: flex-start;
        }

        .frontdoor-hero-meta {
          justify-content: flex-start;
        }

        .frontdoor-hero-cta {
          justify-self: start;
        }
      }

      @media (max-width: 540px) {
        .frontdoor-schedule-track {
          width: 100%;
        }
      }
    `,
  ],
  template: `
    <section class="frontdoor-overview" [attr.aria-label]="projectName + ' overview'">
      <article class="frontdoor-hero">
        @if (heroImageSrc) {
          <img class="frontdoor-hero-image" [src]="heroImageSrc" alt="" aria-hidden="true" />
        }
        <div class="frontdoor-hero-content">
          <div class="frontdoor-hero-top">
            <div class="frontdoor-project-title">
              <span class="frontdoor-project-icon" aria-hidden="true">
                <span [pmConsoleIcon]="projectIcon"></span>
              </span>
              <h2>{{ projectName }}</h2>
            </div>
            <div class="frontdoor-hero-meta">
              @if (coverUploadEnabled && projectId) {
                <button
                  class="frontdoor-cover-upload"
                  type="button"
                  [attr.aria-label]="'Change cover image for ' + projectName"
                  [title]="'Change cover image for ' + projectName"
                  (click)="requestCoverUpload($event)"
                >
                  <span [pmConsoleIcon]="'image-plus'" aria-hidden="true"></span>
                </button>
              }
              <div class="frontdoor-hero-pills" aria-label="Project status">
                <span class="frontdoor-pill">{{ stageLabel }}</span>
                <span class="frontdoor-pill status {{ statusTone }}">
                  <i class="frontdoor-pill-dot" aria-hidden="true"></i>
                  {{ statusLabel }}
                </span>
              </div>
            </div>
          </div>

          <div aria-hidden="true"></div>

          <div class="frontdoor-hero-bottom">
            <div class="frontdoor-schedule">
              <span class="frontdoor-schedule-label">{{ scheduleLabel }}</span>
              <span class="frontdoor-schedule-value">{{ schedulePercent }}% complete</span>
              <span class="frontdoor-schedule-track" aria-hidden="true">
                <span [style.width.%]="schedulePercent"></span>
              </span>
              <span class="frontdoor-psr-row">
                <span class="frontdoor-psr-dots" aria-label="Last PSR statuses">
                  @for (dot of trendDots; track dot.label) {
                    <i class="frontdoor-psr-dot {{ dot.tone }}" [attr.title]="dot.label"></i>
                  }
                </span>
                <span class="frontdoor-psr-line">last 5 PSRs</span>
              </span>
              <span class="frontdoor-psr-line">
                <span pmConsoleIcon="clock-3" aria-hidden="true"></span>
                {{ nextPsrLabel }}
              </span>
            </div>

            <button class="frontdoor-hero-cta" type="button" (click)="projectOpen.emit()">
              <span>Go to Project Workspace</span>
              <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </article>

      <app-pm-console-frontdoor-action-cards
        data-tour-target="frontdoor-actions"
        [actions]="actions"
        [projectName]="projectName"
        (actionSelected)="selectAction($event)"
      ></app-pm-console-frontdoor-action-cards>
    </section>
  `,
})
export class PmConsoleFrontdoorOverviewComponent {
  @Input() projectId = '';
  @Input() projectName = 'Project';
  @Input() projectIcon = 'folder';
  @Input() heroImageSrc = '';
  @Input() coverUploadEnabled = false;
  @Input() stageLabel = 'Initiation stage';
  @Input() statusLabel = 'On Track';
  @Input() statusTone: 'green' | 'amber' | 'red' | 'blue' | 'neutral' | string = 'green';
  @Input() scheduleLabel = 'Project Schedule';
  @Input() schedulePercent = 72;
  @Input() trendDots: readonly PmConsoleFrontdoorTrendDot[] = [];
  @Input() nextPsrLabel = 'Next PSR due: 01 Jun 2026 · 3 days';
  @Input() actions: readonly PmConsoleFrontdoorAction[] = [];

  @Output() readonly projectOpen = new EventEmitter<void>();
  @Output() readonly actionSelected = new EventEmitter<string>();
  @Output() readonly coverUploadRequested = new EventEmitter<PmConsoleFrontdoorCoverUploadRequest>();

  selectAction(actionId: string): void {
    this.actionSelected.emit(actionId);
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
