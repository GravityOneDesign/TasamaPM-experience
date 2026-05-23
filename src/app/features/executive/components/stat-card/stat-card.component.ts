import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExecutiveScopeMetric } from '../../data/dashboard.data';

@Component({
  selector: 'app-executive-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <strong>{{ metric.value }}</strong>
    <span>{{ metric.label }}</span>
  `,
  styles: [
    `
      :host {
        align-items: center;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        color: #ffffff;
        display: flex;
        gap: 10px;
        height: 65px;
        padding: 8px 16px;
        width: 186px;
      }

      strong {
        font-size: 28px;
        font-weight: 600;
        line-height: 49px;
      }

      span {
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        white-space: nowrap;
      }
    `,
  ],
})
export class ExecutiveStatCardComponent {
  @Input({ required: true }) metric!: ExecutiveScopeMetric;
}

