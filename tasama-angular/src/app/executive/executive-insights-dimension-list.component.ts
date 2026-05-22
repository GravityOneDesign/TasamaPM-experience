import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExecutiveInsightDimension } from './executive-insights.data';

@Component({
  selector: 'app-executive-insights-dimension-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dimension-list" aria-label="Executive insight dimensions">
      @for (dimension of dimensions; track dimension.id) {
        <button class="dimension-item" [class.is-active]="dimension.active" type="button">
          <span class="dimension-copy">
            <strong>{{ dimension.label }}</strong>
            @if (dimension.sublabel) {
              <small>{{ dimension.sublabel }}</small>
            }
          </span>
          <span class="dimension-status" [class]="'dimension-status dimension-status--' + dimension.tone">
            {{ dimension.status }}
          </span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dimension-list {
        display: grid;
        gap: 15px;
        width: 256px;
      }

      .dimension-item {
        align-items: center;
        border-radius: 8px;
        color: #2f2f2f;
        display: flex;
        min-height: 36px;
        justify-content: space-between;
        padding: 8px 12px;
        text-align: left;
        width: 256px;
      }

      .dimension-item.is-active {
        background: #f0eefc;
        border: 1px solid #10069f;
        min-height: 56px;
      }

      .dimension-item:focus-visible {
        outline: 3px solid rgba(16, 6, 159, 0.22);
        outline-offset: 2px;
      }

      .dimension-copy {
        display: grid;
        gap: 7px;
        min-width: 0;
      }

      .dimension-copy strong {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }

      .dimension-item.is-active .dimension-copy strong {
        color: #10069f;
        font-weight: 500;
      }

      .dimension-copy small {
        color: #ff5a66;
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
      }

      .dimension-status {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        font-size: 10px;
        font-weight: 400;
        height: 20px;
        justify-content: center;
        line-height: 16px;
        min-width: 61px;
        padding: 0 8px;
        white-space: nowrap;
      }

      .dimension-status--success {
        background: #dcfce7;
        border: 1px solid #9be7bd;
        color: #22a06b;
      }

      .dimension-status--danger {
        background: #fee2e2;
        border: 1px solid #ffb5b8;
        color: #ff5a66;
      }

      .dimension-status--warning {
        background: #ffedd5;
        border: 1px solid #fdcda8;
        color: #e87722;
      }
    `,
  ],
})
export class ExecutiveInsightsDimensionListComponent {
  @Input({ required: true }) dimensions!: readonly ExecutiveInsightDimension[];
}
