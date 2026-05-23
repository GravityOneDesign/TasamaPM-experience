import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { ExecutiveKpiRow } from './executive-insights.data';

@Component({
  selector: 'app-executive-insights-kpi-row',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="kpi-row" [class.kpi-row--tall]="row.tall">
      <div class="kpi-name">
        <span class="kpi-index">{{ row.index }}</span>
        <h3>{{ row.name }}</h3>
      </div>

      <div class="kpi-performance">
        <div class="performance-labels">
          <span>{{ row.current }}</span>
          <span>{{ row.target }}</span>
          <span>{{ row.max }}</span>
        </div>
        <div class="performance-track" aria-hidden="true">
          <span class="performance-fill" [class]="'performance-fill performance-fill--' + row.tone" [style.width.%]="row.progress"></span>
          <span class="performance-marker" [style.left.%]="row.targetPosition"></span>
        </div>
      </div>

      <div class="kpi-probability">
        <span class="probability-chip" [class]="'probability-chip probability-chip--' + row.tone">{{ row.probability }}</span>
        <span class="trend-date">
          <span class="trend-icon" [class]="'trend-icon trend-icon--' + row.tone" [pmConsoleIcon]="row.trendIcon" aria-hidden="true"></span>
          <small>{{ row.date }}</small>
        </span>
      </div>

      <div class="kpi-owner">
        <span>{{ row.owner }}</span>
      </div>

      <div class="kpi-action">
        <button type="button" aria-label="Open AI insight recommendation">
          <span pmConsoleIcon="wand-sparkles" aria-hidden="true"></span>
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .kpi-row {
        align-items: center;
        background: #ffffff;
        border: 1px solid rgba(229, 231, 236, 0.8);
        border-radius: 8px;
        column-gap: 8.5px;
        display: grid;
        grid-template-columns: minmax(220px, 1.08fr) minmax(280px, 1.35fr) minmax(210px, 0.95fr) 49px 31px;
        height: 64px;
        padding: 17px;
        width: 100%;
      }

      .kpi-row--tall {
        height: 86px;
      }

      .kpi-name,
      .kpi-performance,
      .kpi-probability,
      .kpi-owner,
      .kpi-action {
        min-width: 0;
      }

      .kpi-name {
        align-items: center;
        border-right: 1px solid #c7c5d6;
        display: flex;
        gap: 24px;
        height: 100%;
        padding-right: 17px;
      }

      .kpi-index {
        align-items: center;
        background: #edeeef;
        border-radius: 4px;
        color: #464554;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10px;
        font-weight: 600;
        height: 20px;
        justify-content: center;
        line-height: 12px;
        min-width: 20px;
        padding: 0 8px;
      }

      .kpi-name h3 {
        color: #191c1d;
        font-size: 14px;
        font-weight: 500;
        line-height: 25.6px;
        margin: 0;
      }

      .kpi-performance {
        display: grid;
        gap: 8px;
        padding-left: 24px;
        width: 100%;
      }

      .performance-labels {
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      .performance-labels span {
        color: #464554;
        font-size: 10px;
        font-weight: 500;
        line-height: 12px;
        white-space: nowrap;
      }

      .performance-track {
        background: #e1e3e4;
        border-radius: 8px;
        height: 8px;
        position: relative;
        width: 100%;
      }

      .performance-fill {
        border-radius: 8px;
        bottom: 0;
        left: 0;
        position: absolute;
        top: 0;
      }

      .performance-fill--success {
        background: #22a06b;
      }

      .performance-fill--danger {
        background: #c91f27;
      }

      .performance-fill--warning {
        background: #e87722;
      }

      .performance-marker {
        background: #191c1d;
        border-radius: 1px;
        bottom: -4px;
        display: block;
        position: absolute;
        top: -4px;
        transform: translateX(-50%);
        width: 1.4px;
      }

      .kpi-probability {
        align-items: center;
        border-left: 1px solid #c7c5d6;
        display: flex;
        height: 100%;
        justify-content: space-between;
        padding-left: 17px;
      }

      .probability-chip {
        align-items: center;
        border-radius: 8px;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        height: 24px;
        justify-content: center;
        line-height: 16px;
        width: 120px;
      }

      .probability-chip--success {
        background: #d9f0e8;
        color: #22a06b;
      }

      .probability-chip--danger {
        background: #fee2e2;
        color: #dc2626;
      }

      .probability-chip--warning {
        background: #fef3c7;
        color: #e87722;
      }

      .trend-date {
        align-items: flex-end;
        display: grid;
        justify-items: end;
        min-width: 80px;
      }

      .trend-icon {
        height: 20px;
        width: 20px;
      }

      .trend-icon--success {
        color: #477637;
      }

      .trend-icon--danger {
        color: #ef4444;
      }

      .trend-icon--warning {
        color: #e87722;
      }

      .trend-date small {
        color: #2f2f2f;
        font-size: 10px;
        font-weight: 500;
        line-height: 12px;
        white-space: nowrap;
      }

      .kpi-owner {
        align-items: center;
        border-left: 1px solid #c7c5d6;
        display: flex;
        height: 100%;
        justify-content: center;
        padding-left: 11px;
      }

      .kpi-owner span {
        align-items: center;
        background: #f0eefc;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        height: 30px;
        justify-content: center;
        line-height: 16px;
        width: 30px;
      }

      .kpi-action {
        align-items: center;
        border-left: 1px solid #c7c5d6;
        display: flex;
        height: 100%;
        justify-content: center;
        padding-left: 17px;
      }

      .kpi-action button {
        align-items: center;
        color: #7c3cff;
        display: inline-flex;
        height: 24px;
        justify-content: center;
        width: 24px;
      }

      .kpi-action button:focus-visible {
        outline: 3px solid rgba(124, 60, 255, 0.22);
        outline-offset: 2px;
      }

      .kpi-action span {
        height: 16px;
        width: 16px;
      }
    `,
  ],
})
export class ExecutiveInsightsKpiRowComponent {
  @Input({ required: true }) row!: ExecutiveKpiRow;
}
