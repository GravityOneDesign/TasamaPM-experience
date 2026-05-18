import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface PmConsoleOverviewCardSegment {
  label: string;
  value: string;
  percent: number;
  tone: 'green' | 'amber' | 'red' | 'blue' | 'neutral' | string;
}

export interface PmConsoleOverviewCard {
  id: string;
  label: string;
  value: string;
  icon: string;
  tone?: 'brand' | 'green' | 'amber' | 'red' | 'blue' | 'neutral' | string;
  progressPercent?: number;
  trendLabel?: string;
  trendIcon?: string;
  trendTone?: 'green' | 'amber' | 'red' | 'blue' | 'neutral' | string;
  segments?: PmConsoleOverviewCardSegment[];
}

@Component({
  selector: 'app-pm-console-overview-cards',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .pm-overview-card-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: minmax(210px, 0.78fr) minmax(250px, 0.9fr) minmax(420px, 3fr);
        min-width: 0;
      }

      .pm-overview-card {
        align-items: center;
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(11, 11, 11, 0.1);
        display: flex;
        gap: 12px;
        min-height: 70px;
        min-width: 0;
        padding: 12px;
      }

      .pm-overview-card.is-wide {
        min-width: 0;
      }

      .pm-overview-card-icon {
        align-items: center;
        background: #f7f6ff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.1);
        color: var(--brand);
        display: inline-flex;
        flex: 0 0 46px;
        height: 46px;
        justify-content: center;
        width: 46px;
      }

      .pm-overview-card-icon .icon {
        height: 22px;
        width: 22px;
      }

      .pm-overview-card-icon.green {
        background: #eefbf5;
        color: #1b8a5c;
      }

      .pm-overview-card-icon.amber {
        background: #fff5e6;
        color: #e87722;
      }

      .pm-overview-card-icon.red {
        background: #fff0f0;
        color: #b91c1c;
      }

      .pm-overview-card-icon.blue {
        background: #eef4ff;
        color: #315fcb;
      }

      .pm-overview-card-copy {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .pm-overview-card-label {
        color: #777777;
        display: block;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        white-space: normal;
      }

      .pm-overview-card-value-row {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        min-width: 0;
      }

      .pm-overview-card-value {
        color: #0b0b0b;
        font-size: 18px;
        font-weight: 700;
        line-height: 24px;
        white-space: nowrap;
      }

      .pm-overview-card-value.amber {
        color: #e87722;
      }

      .pm-overview-card-value.red {
        color: #b91c1c;
      }

      .pm-overview-card-trend {
        align-items: center;
        color: #15803d;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 3px;
        line-height: 16px;
        white-space: nowrap;
      }

      .pm-overview-card-trend .icon {
        height: 14px;
        width: 14px;
      }

      .pm-overview-card-trend.red {
        color: #b91c1c;
      }

      .pm-overview-card-trend.amber {
        color: #b85f00;
      }

      .pm-overview-card-progress-ring {
        --pm-overview-progress: 0%;
        background: conic-gradient(#b6ead1 0 var(--pm-overview-progress), #f1cfd2 var(--pm-overview-progress) 100%);
        border-radius: 999px;
        flex: 0 0 42px;
        height: 42px;
        margin-left: auto;
        position: relative;
        width: 42px;
      }

      .pm-overview-card-progress-ring::after {
        background: #ffffff;
        border-radius: inherit;
        content: '';
        inset: 5px;
        position: absolute;
      }

      .pm-overview-card-health {
        align-items: center;
        display: flex;
        flex: 1 1 auto;
        gap: 14px;
        min-width: 0;
      }

      .pm-overview-card-health-copy {
        flex: 0 0 112px;
      }

      .pm-overview-segments {
        display: grid;
        flex: 1 1 auto;
        gap: 10px;
        min-width: 0;
      }

      .pm-overview-segment-track {
        display: flex;
        gap: 2px;
        height: 8px;
        min-width: 0;
        overflow: hidden;
      }

      .pm-overview-segment-bar {
        background: rgba(119, 119, 119, 0.35);
        border-radius: 2px;
        min-width: 8px;
      }

      .pm-overview-segment-bar.red {
        background: rgba(185, 28, 28, 0.5);
      }

      .pm-overview-segment-bar.green {
        background: rgba(34, 160, 107, 0.5);
      }

      .pm-overview-segment-bar.amber {
        background: rgba(232, 119, 34, 0.5);
      }

      .pm-overview-segment-legend {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 10px 16px;
        min-width: 0;
      }

      .pm-overview-segment-legend span {
        align-items: center;
        color: #777777;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 4px;
        line-height: 16px;
        white-space: nowrap;
      }

      .pm-overview-segment-legend i {
        border-radius: 2px;
        display: inline-flex;
        height: 8px;
        width: 8px;
      }

      .pm-overview-segment-legend strong {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
      }

      @media (max-width: 1120px) {
        .pm-overview-card-grid {
          grid-template-columns: repeat(2, minmax(190px, 1fr));
        }

        .pm-overview-card.is-wide {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 720px) {
        .pm-overview-card-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .pm-overview-card-health {
          align-items: flex-start;
          flex-direction: column;
        }

        .pm-overview-card-health-copy {
          flex-basis: auto;
        }
      }
    `,
  ],
  template: `
    <section class="pm-overview-card-grid" [attr.aria-label]="ariaLabel">
      @for (card of cards; track card.id) {
        <article class="pm-overview-card" [class.is-wide]="card.segments?.length">
          <span class="pm-overview-card-icon {{ card.tone || 'brand' }}" aria-hidden="true">
            <span [pmConsoleIcon]="card.icon"></span>
          </span>

          @if (card.segments?.length) {
            <div class="pm-overview-card-health">
              <div class="pm-overview-card-copy pm-overview-card-health-copy">
                <span class="pm-overview-card-label">{{ card.label }}</span>
                <span class="pm-overview-card-value {{ card.tone || '' }}">{{ card.value }}</span>
              </div>
              <div class="pm-overview-segments" [attr.aria-label]="card.label + ' distribution'">
                <div class="pm-overview-segment-track" aria-hidden="true">
                  @for (segment of card.segments; track segment.label) {
                    <span class="pm-overview-segment-bar {{ segment.tone }}" [style.width.%]="segment.percent"></span>
                  }
                </div>
                <div class="pm-overview-segment-legend">
                  @for (segment of card.segments; track segment.label) {
                    <span><i class="{{ segment.tone }}" aria-hidden="true"></i>{{ segment.label }} <strong>{{ segment.value }}</strong></span>
                  }
                </div>
              </div>
            </div>
          } @else {
            <div class="pm-overview-card-copy">
              <span class="pm-overview-card-label">{{ card.label }}</span>
              <span class="pm-overview-card-value-row">
                <strong class="pm-overview-card-value {{ card.tone || '' }}">{{ card.value }}</strong>
                @if (card.trendLabel) {
                  <span class="pm-overview-card-trend {{ card.trendTone || 'green' }}">
                    {{ card.trendLabel }}
                    <span [pmConsoleIcon]="card.trendIcon || 'trending-up'"></span>
                  </span>
                }
              </span>
            </div>
            @if (card.progressPercent !== undefined) {
              <span class="pm-overview-card-progress-ring" [style.--pm-overview-progress]="card.progressPercent + '%'"></span>
            }
          }
        </article>
      }
    </section>
  `,
})
export class PmConsoleOverviewCardsComponent {
  @Input() cards: PmConsoleOverviewCard[] = [];
  @Input() ariaLabel = 'Overview metrics';
}
