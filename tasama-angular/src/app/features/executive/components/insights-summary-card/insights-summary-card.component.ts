import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { ExecutiveInsightSummaryCard } from '../../data/insights.data';

@Component({
  selector: 'app-executive-insights-summary-card',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="summary-card"
      [class.summary-card--brand]="card.tone === 'brand'"
      [class.summary-card--success]="card.tone === 'success'"
      [class.summary-card--danger]="card.tone === 'danger'"
      [class.summary-card--warning]="card.tone === 'warning'"
      [class.summary-card--neutral]="card.tone === 'neutral'"
      [class.summary-card--score]="card.id === 'score'"
    >
      @if (card.id === 'score') {
        <img class="summary-card-pattern" src="assets/executive/score-pattern.svg" alt="" aria-hidden="true" />
      }
      @if (card.icon) {
        <span class="summary-card-icon" aria-hidden="true">
          <span [pmConsoleIcon]="card.icon"></span>
        </span>
      }
      <span class="summary-card-copy">
        <small>{{ card.label }}</small>
        <strong>{{ card.value }}</strong>
      </span>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .summary-card {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 6px;
        box-shadow: 0 1px 2px rgba(1, 10, 15, 0.05);
        color: #252a34;
        display: flex;
        gap: 12px;
        height: 74px;
        overflow: hidden;
        padding: 15px 18px;
        position: relative;
        width: 100%;
      }

      .summary-card--score {
        background: linear-gradient(135deg, #6859d7 0%, #10069f 100%);
        border-color: transparent;
        color: #ffffff;
        padding-left: 105px;
      }

      .summary-card-pattern {
        height: 139px;
        left: -29px;
        opacity: 1;
        position: absolute;
        top: -33px;
        width: 139px;
      }

      .summary-card-icon {
        align-items: center;
        border-radius: 8px;
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .summary-card-icon span {
        height: 17px;
        width: 17px;
      }

      .summary-card--success .summary-card-icon {
        background: #dcfce7;
        color: #22a06b;
      }

      .summary-card--danger .summary-card-icon {
        background: #fee2e2;
        color: #ef4444;
      }

      .summary-card--warning .summary-card-icon {
        background: #ffedd5;
        color: #f97316;
      }

      .summary-card--neutral .summary-card-icon {
        background: #f0f2f6;
        color: #7a8494;
      }

      .summary-card--brand .summary-card-icon {
        background: #e8efff;
        color: #2563eb;
      }

      .summary-card-copy {
        display: grid;
        gap: 0;
        min-width: 0;
        position: relative;
        z-index: 1;
      }

      .summary-card-copy small {
        color: #555866;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        white-space: nowrap;
      }

      .summary-card--score .summary-card-copy small {
        color: rgba(255, 255, 255, 0.76);
      }

      .summary-card-copy strong {
        color: #252a34;
        font-size: 24px;
        font-weight: 600;
        line-height: 28px;
        white-space: nowrap;
      }

      .summary-card--score .summary-card-copy strong {
        color: #ffffff;
      }
    `,
  ],
})
export class ExecutiveInsightsSummaryCardComponent {
  @Input({ required: true }) card!: ExecutiveInsightSummaryCard;
}


