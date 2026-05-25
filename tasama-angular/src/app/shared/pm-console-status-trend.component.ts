import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export type PmConsoleStatusTrendTone = 'green' | 'amber' | 'red' | 'blue' | 'neutral';
export type PmConsoleStatusTrendInput = string;

const DEFAULT_TREND_PERIODS = ['Mar', 'Apr', 'May'] as const;

@Component({
  selector: 'app-pm-console-status-trend',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: inline-flex;
        max-width: 100%;
        min-width: 0;
      }

      .pm-table-trend {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        display: inline-flex;
        height: 34px;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        width: min(100%, 204px);
      }

      .pm-table-trend-item {
        align-items: center;
        color: #404040;
        display: inline-flex;
        flex: 1 1 0;
        gap: 4px;
        justify-content: center;
        min-width: 0;
        padding: 0 6px;
        position: relative;
      }

      .pm-table-trend-item:not(:last-child)::after {
        background: #dcdfe6;
        content: "";
        height: 18px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
      }

      .pm-table-trend-item small {
        color: #404040;
        flex: 0 0 auto;
        font-size: 13px;
        line-height: 18px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-table-trend-dot {
        align-items: center;
        color: #9aa1ad;
        display: inline-flex;
        flex: 0 0 auto;
        height: 18px;
        justify-content: center;
        width: 18px;
      }

      .pm-table-trend-dot .icon {
        height: 18px;
        width: 18px;
      }

      .pm-table-trend-dot .icon svg {
        stroke-width: 2;
      }

      .pm-table-trend-dot.green {
        color: var(--green);
      }

      .pm-table-trend-dot.amber {
        color: var(--amber);
      }

      .pm-table-trend-dot.red {
        color: var(--red);
      }

      .pm-table-trend-dot.blue {
        color: var(--blue);
      }

      .pm-table-trend-dot.neutral {
        color: #9aa1ad;
      }

      @media (max-width: 1100px) {
        .pm-table-trend-item {
          gap: 2px;
          padding: 0 2px;
        }

        .pm-table-trend-item small {
          font-size: 12px;
        }

        .pm-table-trend-dot,
        .pm-table-trend-dot .icon {
          height: 16px;
          width: 16px;
        }
      }
    `,
  ],
  template: `
    <div class="pm-table-trend" [attr.aria-label]="ariaLabel">
      @for (tone of tones; track $index) {
        <span
          class="pm-table-trend-item"
          [ngClass]="normalizedTone(tone)"
          role="img"
          [attr.aria-label]="trendPointLabel(tone, $index)"
          [attr.title]="trendPointLabel(tone, $index)"
        >
          <span class="pm-table-trend-dot" [ngClass]="normalizedTone(tone)" aria-hidden="true">
            <span [pmConsoleIcon]="trendIcon(tone)"></span>
          </span>
          <small>{{ trendPeriodLabel($index) }}</small>
        </span>
      }
    </div>
  `,
})
export class PmConsoleStatusTrendComponent {
  @Input() tones: readonly PmConsoleStatusTrendInput[] = [];
  @Input() periodLabels: readonly string[] = DEFAULT_TREND_PERIODS;
  @Input() ariaLabel = 'Report status trend';

  normalizedTone(tone: PmConsoleStatusTrendInput): PmConsoleStatusTrendTone {
    const tones: Record<string, PmConsoleStatusTrendTone> = {
      green: 'green',
      amber: 'amber',
      red: 'red',
      blue: 'blue',
      neutral: 'neutral',
      check: 'green',
      bell: 'amber',
      cross: 'red',
    };

    return tones[tone] || 'neutral';
  }

  trendIcon(tone: PmConsoleStatusTrendInput): string {
    const icons: Record<PmConsoleStatusTrendTone, string> = {
      green: 'circle-check',
      amber: 'triangle-alert',
      red: 'circle-x',
      blue: 'circle-dot',
      neutral: 'circle-minus',
    };

    return icons[this.normalizedTone(tone)];
  }

  trendPeriodLabel(index: number): string {
    return this.periodLabels[index] || `M${index + 1}`;
  }

  trendPointLabel(tone: PmConsoleStatusTrendInput, index: number): string {
    return `${this.trendPeriodLabel(index)}: ${this.trendLabel(tone)}`;
  }

  private trendLabel(tone: PmConsoleStatusTrendInput): string {
    const labels: Record<PmConsoleStatusTrendTone, string> = {
      green: 'On track',
      amber: 'Alert',
      red: 'Off track',
      blue: 'Not started',
      neutral: 'No report',
    };

    return labels[this.normalizedTone(tone)];
  }
}
