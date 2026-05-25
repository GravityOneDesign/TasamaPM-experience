import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PmConsoleFrontdoorActionCardsComponent,
  type PmConsoleFrontdoorAction,
} from './shared/pm-console-frontdoor-action-cards.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

export type PortfolioManagerFrontdoorAction = PmConsoleFrontdoorAction;

export interface PortfolioManagerFrontdoorTrendDot {
  tone: 'green' | 'amber' | 'red' | 'blue' | 'neutral';
  label: string;
}

@Component({
  selector: 'app-portfolio-manager-frontdoor-overview',
  standalone: true,
  imports: [PmConsoleFrontdoorActionCardsComponent, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .portfolio-frontdoor-overview {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .portfolio-frontdoor-hero {
        background: #173f48;
        border-radius: 12px;
        color: #ffffff;
        display: grid;
        min-height: 240px;
        overflow: hidden;
        padding: 16px;
        position: relative;
      }

      .portfolio-frontdoor-hero-image,
      .portfolio-frontdoor-hero::before,
      .portfolio-frontdoor-hero::after {
        inset: 0;
        position: absolute;
      }

      .portfolio-frontdoor-hero-image {
        height: 100%;
        object-fit: cover;
        width: 100%;
        z-index: 0;
      }

      .portfolio-frontdoor-hero::before {
        background:
          linear-gradient(180deg, rgba(11, 11, 11, 0.08) 0%, rgba(11, 11, 11, 0.72) 100%),
          linear-gradient(90deg, rgba(8, 45, 49, 0.72) 0%, rgba(9, 38, 47, 0.48) 48%, rgba(8, 45, 49, 0.12) 100%);
        content: "";
        z-index: 1;
      }

      .portfolio-frontdoor-hero::after {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 42%);
        content: "";
        pointer-events: none;
        z-index: 2;
      }

      .portfolio-frontdoor-hero-content {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        min-height: 208px;
        position: relative;
        z-index: 3;
      }

      .portfolio-frontdoor-hero-top {
        align-items: flex-start;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-width: 0;
      }

      .portfolio-frontdoor-project-title {
        align-items: center;
        display: inline-flex;
        gap: 12px;
        min-width: 0;
      }

      .portfolio-frontdoor-project-icon {
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

      .portfolio-frontdoor-project-icon .icon {
        height: 20px;
        width: 20px;
      }

      .portfolio-frontdoor-project-title h2 {
        color: #ffffff;
        font-size: 24px;
        font-weight: 500;
        line-height: 1.2;
        margin: 0;
        min-width: 0;
      }

      .portfolio-frontdoor-hero-pills {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .portfolio-frontdoor-pill {
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

      .portfolio-frontdoor-pill.status {
        background: rgba(135, 190, 120, 0.72);
      }

      .portfolio-frontdoor-pill-dot {
        background: #9dd66e;
        border-radius: 999px;
        height: 7px;
        width: 7px;
      }

      .portfolio-frontdoor-hero-bottom {
        align-items: end;
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(220px, 1fr) auto;
      }

      .portfolio-frontdoor-schedule {
        align-self: end;
        display: grid;
        gap: 8px;
        max-width: 360px;
        min-width: 0;
      }

      .portfolio-frontdoor-schedule-label,
      .portfolio-frontdoor-psr-line {
        color: rgba(255, 255, 255, 0.88);
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
      }

      .portfolio-frontdoor-schedule-value {
        color: #ffffff;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }

      .portfolio-frontdoor-schedule-track {
        align-items: center;
        background: rgba(255, 255, 255, 0.32);
        border-radius: 999px;
        display: flex;
        height: 6px;
        overflow: hidden;
        width: 240px;
      }

      .portfolio-frontdoor-schedule-track span {
        background: #ffffff;
        border-radius: inherit;
        display: block;
        height: 100%;
      }

      .portfolio-frontdoor-hero-cta {
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

      .portfolio-frontdoor-hero-cta .icon {
        align-items: center;
        background: #a8dc83;
        border-radius: 999px;
        color: #0b0b0b;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      .portfolio-frontdoor-journey {
        display: grid;
        gap: 6px;
        margin: 12px 0 0;
        min-width: 0;
      }

      .portfolio-frontdoor-journey h3 {
        color: #0b0b0b;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        margin: 0;
      }

      .portfolio-frontdoor-journey p {
        color: #535353;
        font-size: 13px;
        line-height: 18px;
        margin: 0;
      }

      @media (max-width: 780px) {
        .portfolio-frontdoor-hero-top,
        .portfolio-frontdoor-hero-bottom {
          align-items: start;
          grid-template-columns: minmax(0, 1fr);
        }

        .portfolio-frontdoor-hero-top {
          flex-direction: column;
        }

        .portfolio-frontdoor-hero-pills {
          justify-content: flex-start;
        }

        .portfolio-frontdoor-hero-cta {
          justify-self: start;
        }
      }
    `,
  ],
  template: `
    <section class="portfolio-frontdoor-overview" [attr.aria-label]="projectName + ' overview'">
      <article class="portfolio-frontdoor-hero">
        @if (heroImageSrc) {
          <img class="portfolio-frontdoor-hero-image" [src]="heroImageSrc" alt="" aria-hidden="true" />
        }
        <div class="portfolio-frontdoor-hero-content">
          <div class="portfolio-frontdoor-hero-top">
            <div class="portfolio-frontdoor-project-title">
              <span class="portfolio-frontdoor-project-icon" aria-hidden="true">
                <span [pmConsoleIcon]="projectIcon"></span>
              </span>
              <h2>{{ projectName }}</h2>
            </div>
            <div class="portfolio-frontdoor-hero-pills" aria-label="Portfolio status">
              <span class="portfolio-frontdoor-pill">{{ stageLabel }}</span>
              <span class="portfolio-frontdoor-pill status {{ statusTone }}">
                <i class="portfolio-frontdoor-pill-dot" aria-hidden="true"></i>
                {{ statusLabel }}
              </span>
            </div>
          </div>

          <div aria-hidden="true"></div>

          <div class="portfolio-frontdoor-hero-bottom">
            <div class="portfolio-frontdoor-schedule">
              @if (!hideSchedule) {
                <span class="portfolio-frontdoor-schedule-label">{{ scheduleLabel }}</span>
                <span class="portfolio-frontdoor-schedule-value">{{ schedulePercent }}% complete</span>
                <span class="portfolio-frontdoor-schedule-track" aria-hidden="true">
                  <span [style.width.%]="schedulePercent"></span>
                </span>
                <span class="portfolio-frontdoor-psr-line">{{ nextPsrLabel }}</span>
              }
            </div>

            <button class="portfolio-frontdoor-hero-cta" type="button" (click)="projectOpen.emit()">
              <span>{{ ctaLabel }}</span>
              <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </article>

      @if (journeyDescriptor || journeyDescriptorTitle) {
        <div class="portfolio-frontdoor-journey">
          @if (journeyDescriptorTitle) {
            <h3>{{ journeyDescriptorTitle }}</h3>
          }
          @if (journeyDescriptor) {
            <p>{{ journeyDescriptor }}</p>
          }
        </div>
      }

      <app-pm-console-frontdoor-action-cards
        data-tour-target="frontdoor-actions"
        [actions]="actions"
        [projectName]="projectName"
        (actionSelected)="selectAction($event)"
      ></app-pm-console-frontdoor-action-cards>
    </section>
  `,
})
export class PortfolioManagerFrontdoorOverviewComponent {
  @Input() hideSchedule = false;
  @Input() journeyDescriptor = '';
  @Input() journeyDescriptorTitle = '';
  @Input() projectName = 'Portfolio';
  @Input() projectIcon = 'folder';
  @Input() heroImageSrc = '';
  @Input() stageLabel = 'Active portfolio';
  @Input() statusLabel = 'On Track';
  @Input() statusTone: 'green' | 'amber' | 'red' | 'blue' | 'neutral' | string = 'green';
  @Input() scheduleLabel = 'Portfolio Schedule';
  @Input() schedulePercent = 72;
  @Input() trendDots: readonly PortfolioManagerFrontdoorTrendDot[] = [];
  @Input() nextPsrLabel = 'Next report due soon';
  @Input() actions: readonly PortfolioManagerFrontdoorAction[] = [];
  @Input() ctaLabel = 'Go to Portfolio Workspace';
  @Input() actionColumnCount = 5;

  @Output() readonly projectOpen = new EventEmitter<void>();
  @Output() readonly actionSelected = new EventEmitter<string>();

  selectAction(actionId: string): void {
    this.actionSelected.emit(actionId);
  }
}
