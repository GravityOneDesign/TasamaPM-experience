import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { ExecutiveMoreInsightItem } from '../../data/insights.data';

@Component({
  selector: 'app-executive-more-insights-panel',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="more-insights-panel" aria-label="More insights navigation">
      <nav class="more-insights-nav">
        @for (item of items; track item.id) {
          <button class="more-insights-option" type="button" [class.is-active]="item.active">
            <span class="more-insights-option-icon">
              <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
            </span>
            <span class="more-insights-option-label">{{ item.label }}</span>
          </button>
        }
      </nav>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 464px;
        width: 338px;
      }

      .more-insights-panel {
        background: #ffffff;
        border: 1px solid #eceef3;
        border-radius: 12px;
        box-shadow: -1px 1px 2px rgba(1, 10, 15, 0.15);
        height: 464px;
        padding: 16px 9px 16px 8px;
        width: 338px;
      }

      .more-insights-nav {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding-left: 20px;
        width: 303px;
      }

      .more-insights-option {
        align-items: center;
        color: #10069f;
        display: flex;
        gap: 10px;
        min-height: 48px;
        padding: 0;
        text-align: left;
        width: 276px;
      }

      .more-insights-option:hover .more-insights-option-icon,
      .more-insights-option.is-active .more-insights-option-icon {
        background: #f3f2fa;
      }

      .more-insights-option:focus-visible {
        outline: 3px solid rgba(16, 6, 159, 0.18);
        outline-offset: 4px;
        border-radius: 8px;
      }

      .more-insights-option-icon {
        align-items: center;
        background: #f7f7fc;
        border: 1px solid #e3e5e9;
        border-radius: 24px;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 48px;
        height: 48px;
        justify-content: center;
        transition: background 160ms ease, border-color 160ms ease;
        width: 48px;
      }

      .more-insights-option-icon span {
        height: 24px;
        width: 24px;
      }

      .more-insights-option-label {
        color: #10069f;
        display: block;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        white-space: nowrap;
      }
    `,
  ],
})
export class ExecutiveMoreInsightsPanelComponent {
  @Input({ required: true }) items!: readonly ExecutiveMoreInsightItem[];
}


