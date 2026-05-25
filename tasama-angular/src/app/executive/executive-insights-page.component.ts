import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { ExecutiveInsightsDimensionListComponent } from './executive-insights-dimension-list.component';
import {
  executiveInsightDimensions,
  executiveMoreInsightItems,
  executiveInsightSummaryCards,
  executiveKpiRows,
} from './executive-insights.data';
import { ExecutiveInsightsHeaderComponent } from './executive-insights-header.component';
import { ExecutiveInsightsKpiRowComponent } from './executive-insights-kpi-row.component';
import { ExecutiveInsightsSidebarComponent } from './executive-insights-sidebar.component';
import { ExecutiveInsightsSummaryCardComponent } from './executive-insights-summary-card.component';
import { ExecutiveMoreInsightsPanelComponent } from './executive-more-insights-panel.component';

const EXECUTIVE_INSIGHTS_STAGE_WIDTH = 1440;
const EXECUTIVE_INSIGHTS_STAGE_HEIGHT = 810;

@Component({
  selector: 'app-executive-insights-page',
  standalone: true,
  imports: [
    ExecutiveInsightsDimensionListComponent,
    ExecutiveInsightsHeaderComponent,
    ExecutiveInsightsKpiRowComponent,
    ExecutiveInsightsSidebarComponent,
    ExecutiveInsightsSummaryCardComponent,
    ExecutiveMoreInsightsPanelComponent,
    PmConsoleIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="executive-insights-page" aria-label="Executive insights deep dive">
      <div class="executive-insights-stage">
        <app-executive-insights-header (homeSelected)="homeSelected.emit()" />
        <app-executive-insights-sidebar (homeSelected)="homeSelected.emit()" />

        <section class="insights-shell" aria-label="Foundational KPI insights">
          <div class="summary-strip" aria-label="Project status summary">
            @for (card of summaryCards; track card.id) {
              <app-executive-insights-summary-card [card]="card" />
            }
          </div>

          <div class="deep-dive-shell">
            <aside class="dimension-column" aria-label="Dimension navigation">
              <app-executive-insights-dimension-list [dimensions]="dimensions" />
            </aside>

            <section class="kpi-content" aria-labelledby="executive-kpi-title">
              <header class="kpi-subheader">
                <div>
                  <p>Dimension Deep-Dive</p>
                  <h1 id="executive-kpi-title">Foundational KPIs</h1>
                </div>
                <div class="view-toggle" role="tablist" aria-label="KPI detail level">
                  <button class="is-active" type="button" role="tab" aria-selected="true">Overview</button>
                  <button type="button" role="tab" aria-selected="false">Detailed</button>
                </div>
              </header>

              <div class="kpi-table" role="table" aria-label="Foundational KPI list">
                <div class="kpi-table-header" role="row">
                  <span role="columnheader">KPI Name</span>
                  <span role="columnheader">YTD Performance v/s Annual Target</span>
                  <span role="columnheader">Probability to Meet</span>
                  <span role="columnheader">SPA</span>
                </div>
                <div class="kpi-table-body">
                  @for (row of rows; track row.id) {
                    <app-executive-insights-kpi-row [row]="row" />
                  }
                </div>
              </div>
            </section>
          </div>
        </section>

        @if (moreInsightsOpen) {
          <button
            class="more-insights-scrim"
            type="button"
            aria-label="Close more insights"
            (click)="closeMoreInsights()"
          ></button>
          <app-executive-more-insights-panel class="more-insights-panel-host" [items]="moreInsightItems" />
        }

        <button
          class="more-insights-tab"
          [class.is-open]="moreInsightsOpen"
          type="button"
          aria-label="More insights"
          [attr.aria-expanded]="moreInsightsOpen"
          (click)="toggleMoreInsights()"
        >
          <span class="more-insights-tab-icon" pmConsoleIcon="circle-arrow-left" aria-hidden="true"></span>
          <span class="more-insights-tab-label">
            <strong>More Insights</strong>
          </span>
        </button>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        --executive-insights-scale: 1;
        --executive-insights-stage-height: 810px;
        --executive-insights-stage-width: 1440px;
        display: block;
        height: 100%;
      }

      .executive-insights-page {
        animation: executiveInsightsPageEnter 320ms ease-out both;
        background: #ffffff;
        color: #2f2f2f;
        height: 100vh;
        min-height: 100%;
        overflow: hidden;
        position: relative;
        width: 100%;
      }

      .executive-insights-stage {
        background: #ffffff;
        height: var(--executive-insights-stage-height);
        left: 50%;
        overflow: hidden;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) scale(var(--executive-insights-scale));
        transform-origin: center;
        width: var(--executive-insights-stage-width);
      }

      app-executive-insights-header {
        animation: executiveInsightsChromeEnter 420ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 20ms both;
        display: block;
        height: 64px;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 4;
      }

      app-executive-insights-sidebar {
        animation: executiveInsightsSidebarEnter 460ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 80ms both;
        bottom: 0;
        display: block;
        left: 0;
        position: absolute;
        top: 64px;
        width: 64px;
        z-index: 3;
      }

      .insights-shell {
        animation: executiveInsightsSurfaceEnter 540ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 90ms both;
        background: #ffffff;
        border: 1px solid #eceef3;
        border-radius: 16px;
        box-shadow: 0 10px 28px rgba(25, 33, 61, 0.08), 0 1px 4px rgba(25, 33, 61, 0.04);
        bottom: 16px;
        height: auto;
        left: 80px;
        overflow: hidden;
        position: absolute;
        right: 16px;
        top: 80px;
        transform-origin: top center;
        width: auto;
        z-index: 1;
      }

      .summary-strip {
        animation: executiveInsightsContentEnter 420ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 190ms both;
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        height: 74px;
        left: 13px;
        position: absolute;
        right: 29px;
        top: 15px;
        width: auto;
      }

      .deep-dive-shell {
        background: #f7f7fc;
        border-top: 1px solid #e5e7ec;
        bottom: 0;
        height: auto;
        left: 1px;
        position: absolute;
        right: 1px;
        top: 102px;
        width: auto;
      }

      .dimension-column {
        background: #ffffff;
        border-right: 1px solid #eceef3;
        bottom: 0;
        box-shadow: 1px 0 2px rgba(1, 10, 15, 0.04);
        height: auto;
        left: 0;
        padding: 16px;
        position: absolute;
        top: 0;
        animation: executiveInsightsSidebarContentEnter 440ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 230ms both;
        width: 288px;
      }

      .kpi-content {
        animation: executiveInsightsContentEnter 460ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 270ms both;
        bottom: 12px;
        height: auto;
        left: 322px;
        position: absolute;
        right: 33px;
        top: 12px;
        width: auto;
      }

      .kpi-subheader {
        align-items: center;
        border-bottom: 1px solid #e5e7ec;
        display: flex;
        height: 68px;
        justify-content: space-between;
        width: 100%;
      }

      .kpi-subheader p,
      .kpi-subheader h1 {
        margin: 0;
      }

      .kpi-subheader p {
        color: #464554;
        font-size: 10px;
        font-weight: 400;
        letter-spacing: 1.1px;
        line-height: 16px;
        text-transform: uppercase;
      }

      .kpi-subheader h1 {
        color: #0b0b0b;
        font-size: 24px;
        font-weight: 600;
        line-height: 24px;
        margin-top: 5px;
      }

      .view-toggle {
        align-items: center;
        background: #eeeef8;
        border-radius: 6px;
        display: flex;
        gap: 4px;
        height: 36px;
        padding: 4px;
      }

      .view-toggle button {
        align-items: center;
        border-radius: 6px;
        color: #464554;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        height: 28px;
        justify-content: center;
        line-height: 16px;
        min-width: 76px;
        padding: 0 12px;
      }

      .view-toggle button.is-active {
        background: #ffffff;
        color: #10069f;
        font-weight: 600;
      }

      .view-toggle button:focus-visible {
        outline: 3px solid rgba(16, 6, 159, 0.22);
        outline-offset: 1px;
      }

      .kpi-table {
        height: calc(100% - 68px);
        position: relative;
        width: 100%;
      }

      .kpi-table-header {
        align-items: center;
        color: #464554;
        display: grid;
        font-size: 12px;
        font-weight: 500;
        gap: 8.5px;
        grid-template-columns: minmax(220px, 1.08fr) minmax(280px, 1.35fr) minmax(210px, 0.95fr) 88px;
        height: 36px;
        line-height: 16px;
        padding: 0 48px 0 80px;
        position: relative;
        width: 100%;
      }

      .kpi-table-header span {
        align-items: center;
        display: flex;
        height: 36px;
        white-space: nowrap;
      }

      .kpi-table-header span:nth-child(2),
      .kpi-table-header span:nth-child(3),
      .kpi-table-header span:nth-child(4) {
        border-left: 1px solid #d9deea;
        justify-content: center;
      }

      .kpi-table-body {
        display: grid;
        gap: 8px;
        padding-top: 12px;
      }

      .more-insights-tab {
        align-items: center;
        background: #10069f;
        border-radius: 12px 0 0 12px;
        box-shadow: -1px 1px 2px rgba(1, 10, 15, 0.15);
        color: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 6px;
        height: 155px;
        justify-content: center;
        overflow: hidden;
        padding: 16px 12px;
        position: absolute;
        right: 0;
        top: 160px;
        transition: right 180ms ease, top 180ms ease, border-radius 180ms ease;
        width: 44px;
        z-index: 12;
        animation: executiveInsightsTabEnter 440ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 360ms both;
      }

      .more-insights-tab.is-open {
        border-radius: 4px 0 0 4px;
        right: 312px;
        top: 156px;
      }

      .more-insights-tab-icon {
        flex: 0 0 16px;
        height: 16px;
        transform: rotate(180deg);
        width: 16px;
      }

      .more-insights-tab-label {
        align-items: center;
        display: flex;
        flex: 0 0 101px;
        height: 101px;
        justify-content: center;
        width: 20px;
      }

      .more-insights-tab-label strong {
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        line-height: 20px;
        text-transform: uppercase;
        transform: rotate(-90deg);
        white-space: nowrap;
        width: 101px;
      }

      .more-insights-tab:focus-visible {
        outline: 3px solid rgba(173, 220, 145, 0.58);
        outline-offset: -5px;
      }

      .more-insights-scrim {
        background: rgba(11, 11, 11, 0.34);
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 8;
      }

      .more-insights-panel-host {
        position: absolute;
        right: 16px;
        top: 119px;
        z-index: 11;
      }

      @keyframes executiveInsightsPageEnter {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }

      @keyframes executiveInsightsChromeEnter {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes executiveInsightsSidebarEnter {
        from {
          opacity: 0;
          transform: translateX(-14px);
        }

        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes executiveInsightsSurfaceEnter {
        from {
          opacity: 0;
          transform: translateY(18px) scale(0.988);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes executiveInsightsSidebarContentEnter {
        from {
          opacity: 0;
          transform: translateX(-12px);
        }

        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes executiveInsightsContentEnter {
        from {
          opacity: 0;
          transform: translateY(12px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes executiveInsightsTabEnter {
        from {
          opacity: 0;
          transform: translateX(18px);
        }

        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .executive-insights-page,
        app-executive-insights-header,
        app-executive-insights-sidebar,
        .insights-shell,
        .summary-strip,
        .dimension-column,
        .kpi-content,
        .more-insights-tab {
          animation: none;
        }
      }
    `,
  ],
})
export class ExecutiveInsightsPageComponent {
  @HostBinding('style.--executive-insights-scale')
  stageScale = '1';

  @HostBinding('style.--executive-insights-stage-width')
  stageWidth = `${EXECUTIVE_INSIGHTS_STAGE_WIDTH}px`;

  @HostBinding('style.--executive-insights-stage-height')
  stageHeight = `${EXECUTIVE_INSIGHTS_STAGE_HEIGHT}px`;

  @Output() readonly homeSelected = new EventEmitter<void>();

  readonly dimensions = executiveInsightDimensions;
  readonly moreInsightItems = executiveMoreInsightItems;
  readonly rows = executiveKpiRows;
  readonly summaryCards = executiveInsightSummaryCards;
  moreInsightsOpen = false;

  constructor() {
    this.updateStageMetrics();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateStageMetrics();
  }

  toggleMoreInsights(): void {
    this.moreInsightsOpen = !this.moreInsightsOpen;
  }

  closeMoreInsights(): void {
    this.moreInsightsOpen = false;
  }

  private updateStageMetrics(): void {
    const metrics = this.getStageMetrics();
    this.stageScale = String(metrics.scale);
    this.stageWidth = `${metrics.width}px`;
    this.stageHeight = `${metrics.height}px`;
  }

  private getStageMetrics(): { scale: number; width: number; height: number } {
    if (typeof window === 'undefined') {
      return {
        height: EXECUTIVE_INSIGHTS_STAGE_HEIGHT,
        scale: 1,
        width: EXECUTIVE_INSIGHTS_STAGE_WIDTH,
      };
    }

    const scale = Math.max(
      0.1,
      Math.min(
        1,
        window.innerWidth / EXECUTIVE_INSIGHTS_STAGE_WIDTH,
        window.innerHeight / EXECUTIVE_INSIGHTS_STAGE_HEIGHT,
      ),
    );

    return {
      height: Math.max(EXECUTIVE_INSIGHTS_STAGE_HEIGHT, window.innerHeight / scale),
      scale,
      width: Math.max(EXECUTIVE_INSIGHTS_STAGE_WIDTH, window.innerWidth / scale),
    };
  }
}
