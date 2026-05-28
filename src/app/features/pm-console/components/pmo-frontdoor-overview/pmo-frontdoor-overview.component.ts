import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PmConsoleFrontdoorActionCardsComponent,
  type PmConsoleFrontdoorAction,
} from '../frontdoor-action-cards/frontdoor-action-cards.component';

export interface PmoPerformanceSegment {
  label: string;
  tone: 'green' | 'amber' | 'red' | 'neutral';
  count: number;
}

export interface PmoHeroMetricChip {
  value: string;
  label: string;
}

@Component({
  selector: 'app-pm-console-pmo-frontdoor-overview',
  standalone: true,
  imports: [PmConsoleFrontdoorActionCardsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .pmo-frontdoor-overview {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .pmo-performance-hero {
        --pmo-hero-stage-width: clamp(976px, calc(100cqw - 178px), 1280px);
        background: radial-gradient(ellipse 62% 86% at 50% 50%, #0c5fe7, #1f227d), #10069f;
        border-radius: 12px;
        color: #fff;
        container-type: inline-size;
        height: 264px;
        min-width: 0;
        overflow: hidden;
        position: relative;
      }

      .pmo-performance-hero::before {
        content: '';
        display: none;
        pointer-events: none;
        position: absolute;
      }

      .pmo-performance-hero::after {
        content: '';
        display: none;
        pointer-events: none;
        position: absolute;
      }

      .pmo-performance-hero-stage {
        height: 264px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        transform-origin: center center;
        width: var(--pmo-hero-stage-width);
      }

      .pmo-hero-metrics {
        align-items: center;
        display: flex;
        gap: 8px;
        left: 16px;
        position: absolute;
        top: 16px;
        z-index: 4;
      }

      .pmo-hero-metric {
        align-items: center;
        background: rgba(255, 255, 255, 0.09);
        border: 1px solid #addc91;
        border-radius: 6.84px;
        box-shadow: 0 8px 18px rgba(1, 10, 15, 0.08);
        display: inline-flex;
        gap: 8px;
        height: 36px;
        padding: 8px 12px;
      }

      .pmo-hero-metric:nth-child(1) {
        width: 140px;
      }

      .pmo-hero-metric:nth-child(2) {
        width: 138px;
      }

      .pmo-hero-metric:nth-child(3) {
        width: 131px;
      }

      .pmo-hero-metric strong {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }

      .pmo-hero-metric span {
        color: #fff;
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
        white-space: nowrap;
      }

      .pmo-hero-health,
      .pmo-hero-budget {
        align-items: start;
        display: grid;
        position: absolute;
        z-index: 2;
      }

      .pmo-hero-health {
        gap: 11px;
        grid-template-columns: 230px 260px;
        left: 16px;
        top: 68px;
        transform: translateX(-44px);
        width: 501px;
      }

      .pmo-hero-budget {
        gap: 11px;
        grid-template-columns: 181px 251px;
        right: 29px;
        top: 62px;
        width: 443px;
      }

      .pmo-hero-visual {
        display: block;
        min-width: 0;
        overflow: visible;
        position: relative;
      }

      .pmo-hero-visual-performance {
        height: 180px;
        overflow: hidden;
        width: 230px;
      }

      .pmo-hero-visual-budget {
        height: 164px;
        width: 181px;
      }

      .pmo-hero-illustration {
        display: block;
        height: auto;
        pointer-events: none;
        position: absolute;
        user-select: none;
      }

      .pmo-hero-illustration-performance {
        left: -142px;
        top: -85px;
        width: 528px;
      }

      .pmo-hero-illustration-budget {
        left: -136px;
        top: -72px;
        width: 406px;
      }

      .pmo-hero-copy,
      .pmo-hero-budget-copy {
        display: grid;
        min-width: 0;
        position: relative;
        z-index: 3;
      }

      .pmo-hero-copy {
        gap: 12px;
        margin-top: 15px;
      }

      .pmo-hero-budget-copy {
        gap: 12px;
        margin-top: 21px;
      }

      .pmo-hero-copy h2,
      .pmo-hero-budget-copy h2 {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        margin: 0;
      }

      .pmo-health-rows {
        display: grid;
        gap: 16px;
      }

      .pmo-health-row {
        display: grid;
        gap: 5px;
        min-width: 0;
      }

      .pmo-health-row > span {
        color: rgba(255, 255, 255, 0.88);
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }

      .pmo-health-track {
        background: transparent;
        border-radius: 999px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        height: 8px;
        overflow: hidden;
        width: 260px;
      }

      .pmo-health-track i {
        display: block;
        min-width: 0;
      }

      .pmo-health-track .is-on-track {
        background: linear-gradient(90deg, #addc91 28.85%, rgba(152, 200, 152, 0.58));
      }

      .pmo-health-track .is-delayed {
        background: linear-gradient(90deg, rgba(255, 183, 16, 0.55) 47.12%, rgba(255, 183, 16, 0.2));
      }

      .pmo-health-track .is-critical {
        background: linear-gradient(90deg, rgba(240, 151, 151, 0.66), rgba(240, 151, 151, 0));
      }

      .pmo-health-labels {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 260px;
      }

      .pmo-health-labels span {
        color: rgba(255, 255, 255, 0.84);
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        white-space: nowrap;
      }

      .pmo-health-labels span:nth-child(2) {
        text-align: center;
      }

      .pmo-health-labels span:nth-child(3) {
        text-align: right;
      }

      .pmo-hero-divider {
        background: rgba(255, 255, 255, 0.76);
        border-radius: 999px;
        height: 120px;
        left: 50%;
        position: absolute;
        top: 90px;
        width: 1px;
        z-index: 4;
      }

      .pmo-budget-card {
        background: rgba(255, 255, 255, 0.09);
        border-radius: 8px;
        display: grid;
        gap: 4px;
        height: 106px;
        padding: 8px;
      }

      .pmo-budget-card > span {
        color: #fff;
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
      }

      .pmo-budget-card-body {
        align-items: center;
        display: grid;
        gap: 12px;
        grid-template-columns: 54px 169px;
        height: 70px;
      }

      .pmo-budget-bars {
        display: grid;
        gap: 3px;
      }

      .pmo-budget-bars i {
        background: rgba(255, 255, 255, 0.11);
        border-radius: 999px;
        height: 4px;
        width: 54px;
      }

      .pmo-budget-bars i:nth-child(n + 7) {
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.13));
      }

      .pmo-budget-values {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .pmo-budget-values p {
        align-items: baseline;
        color: #fff;
        display: flex;
        gap: 4px;
        margin: 0;
        min-width: 0;
      }

      .pmo-budget-values strong {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
      }

      .pmo-budget-values span {
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        line-height: 16px;
        white-space: nowrap;
      }

      .pmo-budget-values p:first-child span {
        color: rgba(255, 255, 255, 0.74);
        font-weight: 500;
      }

      .pmo-action-heading {
        display: grid;
        gap: 4px;
      }

      .pmo-action-heading h2 {
        color: #0b0b0b;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .pmo-action-heading p {
        color: #404040;
        font-size: 13px;
        line-height: 18px;
        margin: 0;
      }

      @container (min-width: 976px) {
        .pmo-hero-metrics {
          left: calc(16px - ((100cqw - var(--pmo-hero-stage-width)) / 2));
        }
      }

      @container (max-width: 975px) {
        .pmo-performance-hero-stage {
          transform: translate(-50%, -50%) scale(0.94);
        }
      }

      @container (max-width: 920px) {
        .pmo-performance-hero-stage {
          transform: translate(-50%, -50%) scale(0.89);
        }
      }

      @container (max-width: 860px) {
        .pmo-performance-hero-stage {
          transform: translate(-50%, -50%) scale(0.83);
        }
      }

      @container (max-width: 800px) {
        .pmo-performance-hero-stage {
          transform: translate(-50%, -50%) scale(0.77);
        }
      }

      @container (max-width: 740px) {
        .pmo-performance-hero {
          height: 430px;
        }

        .pmo-performance-hero-stage {
          height: 430px;
          transform: translate(-50%, -50%) scale(1);
          width: 100%;
        }

        .pmo-hero-metrics {
          flex-wrap: wrap;
          left: 16px;
          right: 16px;
        }

        .pmo-hero-health,
        .pmo-hero-budget {
          left: 50%;
          right: auto;
          transform: translateX(-50%);
        }

        .pmo-hero-health {
          top: 76px;
        }

        .pmo-hero-budget {
          top: 244px;
        }

        .pmo-hero-divider {
          display: none;
        }
      }
    `,
  ],
  template: `
    <section class="pmo-frontdoor-overview" aria-label="PMO portfolio overview">
      <article class="pmo-performance-hero" aria-label="Portfolio performance snapshot">
        <div class="pmo-performance-hero-stage">
          <div class="pmo-hero-metrics" aria-label="PMO scope metrics">
            @for (metric of metrics; track metric.label) {
              <span class="pmo-hero-metric">
                <strong>{{ metric.value }}</strong>
                <span>{{ metric.label }}</span>
              </span>
            }
          </div>

          <section class="pmo-hero-health" aria-label="Portfolio and program performance">
            <span class="pmo-hero-visual pmo-hero-visual-performance" aria-hidden="true">
              <img
                class="pmo-hero-illustration pmo-hero-illustration-performance"
                src="assets/executive/overall-portfolio-health.svg"
                alt=""
              />
            </span>
            <div class="pmo-hero-copy">
              <h2>Overall Portfolio Health</h2>

              <div class="pmo-health-rows">
                <div class="pmo-health-row">
                  <span>Portfolio Performance</span>
                  <div class="pmo-health-track" aria-hidden="true">
                    @for (segment of portfolioPerformance; track segment.label) {
                      <i
                        [class.is-on-track]="segment.tone === 'green'"
                        [class.is-delayed]="segment.tone === 'amber'"
                        [class.is-critical]="segment.tone === 'red'"
                      ></i>
                    }
                  </div>
                  <div class="pmo-health-labels">
                    @for (segment of portfolioPerformance; track segment.label) {
                      <span>{{ segment.label }}: {{ segment.count }}</span>
                    }
                  </div>
                </div>

                <div class="pmo-health-row">
                  <span>Program Performance</span>
                  <div class="pmo-health-track" aria-hidden="true">
                    @for (segment of programPerformance; track segment.label) {
                      <i
                        [class.is-on-track]="segment.tone === 'green'"
                        [class.is-delayed]="segment.tone === 'amber'"
                        [class.is-critical]="segment.tone === 'red'"
                      ></i>
                    }
                  </div>
                  <div class="pmo-health-labels">
                    @for (segment of programPerformance; track segment.label) {
                      <span>{{ segment.label }}: {{ segment.count }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="pmo-hero-budget" aria-label="Budget tracking snapshot">
            <span class="pmo-hero-visual pmo-hero-visual-budget" aria-hidden="true">
              <img
                class="pmo-hero-illustration pmo-hero-illustration-budget"
                src="assets/executive/budget-tracking.svg"
                alt=""
              />
            </span>
            <div class="pmo-hero-budget-copy">
              <h2>Budget Health</h2>
              <div class="pmo-budget-card">
                <span>Actual vs Planned Budget</span>
                <div class="pmo-budget-card-body">
                  <div class="pmo-budget-bars" aria-hidden="true">
                    @for (bar of budgetBars; track $index) {
                      <i></i>
                    }
                  </div>
                  <div class="pmo-budget-values">
                    <p>
                      <strong>{{ budgetActual }}</strong>
                      <span>/ {{ budgetPlanned }}</span>
                    </p>
                    <p>
                      <strong>{{ budgetUsedPercent }}%</strong>
                      <span>of total budget used</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <span class="pmo-hero-divider" aria-hidden="true"></span>
        </div>
      </article>

      <div class="pmo-action-heading">
        <h2>Run your portfolios, end to end</h2>
        <p>Navigate every key area of your portfolios, all in one place.</p>
      </div>

      <app-pm-console-frontdoor-action-cards
        ariaLabel="PMO portfolio actions"
        [actions]="actions"
        (actionSelected)="actionSelected.emit($event)"
      ></app-pm-console-frontdoor-action-cards>
    </section>
  `,
})
export class PmConsolePmoFrontdoorOverviewComponent {
  @Input() metrics: readonly PmoHeroMetricChip[] = [
    { value: '03', label: 'Active Portfolios' },
    { value: '10', label: 'Active Programs' },
    { value: '25', label: 'Active Projects' },
  ];

  @Input() portfolioPerformance: readonly PmoPerformanceSegment[] = [
    { label: 'On Track', tone: 'green', count: 2 },
    { label: 'Delayed', tone: 'amber', count: 1 },
    { label: 'Critical', tone: 'red', count: 0 },
  ];

  @Input() programPerformance: readonly PmoPerformanceSegment[] = [
    { label: 'On Track', tone: 'green', count: 3 },
    { label: 'Delayed', tone: 'amber', count: 3 },
    { label: 'Critical', tone: 'red', count: 4 },
  ];

  @Input() budgetActual = '$175.9M';
  @Input() budgetPlanned = '$479.9M';
  @Input() budgetUsedPercent = 40;
  @Input() actions: readonly PmConsoleFrontdoorAction[] = [];

  @Output() readonly actionSelected = new EventEmitter<string>();
  protected readonly budgetBars = Array.from({ length: 10 });
}
