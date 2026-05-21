import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

type AgentBannerVariant = 'benefit' | 'risk';

@Component({
  selector: 'app-pm-console-agent-banner',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      .plan-agent-banner {
        align-items: center;
        background:
          linear-gradient(90deg, rgba(16, 6, 159, 0.05) 0%, rgba(16, 6, 159, 0.025) 25%, rgba(151, 71, 255, 0.025) 75%, rgba(200, 125, 127, 0.1) 100%),
          #ffffff;
        border: 1px solid rgba(16, 6, 159, 0.5);
        border-radius: 12px;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-height: 78px;
        padding: 16px;
      }

      .plan-agent-banner.benefit {
        background:
          linear-gradient(90deg, rgba(16, 6, 159, 0.05) 0%, rgba(16, 6, 159, 0.025) 25%, rgba(49, 151, 115, 0.035) 75%, rgba(49, 151, 115, 0.1) 100%),
          #ffffff;
      }

      .plan-agent-main {
        display: flex;
        flex: 1 1 auto;
        gap: 8px;
        min-width: 0;
      }

      .plan-agent-icon-card {
        align-items: center;
        background:
          linear-gradient(90deg, rgba(16, 6, 159, 0.03), rgba(16, 6, 159, 0.03)),
          #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.1);
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        height: 40px;
        justify-content: center;
        width: 40px;
      }

      .plan-agent-icon-card .icon {
        height: 24px;
        width: 24px;
      }

      .plan-agent-copy {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .plan-agent-kicker {
        color: #10069f;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.12px;
        line-height: 16px;
      }

      .plan-agent-text {
        display: grid;
        gap: 4px;
        max-width: 720px;
        min-width: 0;
      }

      .plan-agent-text strong {
        color: #0b0b0b;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
      }

      .plan-agent-text p {
        color: #777777;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        margin: 0;
      }

      .plan-agent-action {
        align-items: center;
        background: linear-gradient(90deg, rgba(16, 6, 159, 0.075) 0%, rgba(16, 6, 159, 0.038) 25%, rgba(151, 71, 255, 0.038) 75%, rgba(200, 125, 127, 0.15) 100%);
        border: 1px solid rgba(16, 6, 159, 0.5);
        border-radius: 999px;
        color: #0b0b0b;
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        gap: 8px;
        justify-content: center;
        min-height: 36px;
        padding: 8px 12px;
        transition:
          box-shadow 160ms ease,
          transform 160ms ease;
        white-space: nowrap;
      }

      .plan-agent-action:hover {
        box-shadow: 0 8px 20px rgba(47, 78, 176, 0.18);
        transform: translateY(-1px);
      }

      .plan-agent-action:disabled {
        cursor: wait;
        opacity: 0.72;
        transform: none;
      }

      .plan-agent-action:focus-visible {
        box-shadow:
          0 0 0 3px rgba(255, 255, 255, 0.72),
          0 0 0 5px rgba(85, 130, 255, 0.4);
        outline: 0;
      }

      .plan-agent-action-icon {
        color: #10069f;
        height: 16px;
        width: 16px;
      }

      .plan-agent-action-copy {
        color: #0b0b0b;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }

      @media (max-width: 720px) {
        .plan-agent-banner {
          align-items: flex-start;
          flex-direction: column;
        }

        .plan-agent-main {
          width: 100%;
        }

        .plan-agent-action {
          width: 100%;
        }
      }
    `,
  ],
  template: `
    <article class="plan-agent-banner" [class.risk]="variant === 'risk'" [class.benefit]="variant === 'benefit'" [attr.aria-label]="ariaLabel">
      <div class="plan-agent-main">
        <span class="plan-agent-icon-card" aria-hidden="true">
          <span [pmConsoleIcon]="iconName"></span>
        </span>
        <div class="plan-agent-copy">
          <span class="plan-agent-kicker">AI assistant</span>
          <div class="plan-agent-text">
            <strong>{{ title }}</strong>
            <p>{{ description }}</p>
          </div>
        </div>
      </div>
      <button class="plan-agent-action" type="button" [disabled]="disabled || loading" (click)="action.emit()">
        <span class="plan-agent-action-icon" pmConsoleIcon="wand-sparkles" aria-hidden="true"></span>
        <span class="plan-agent-action-copy">{{ actionLabel }}</span>
      </button>
    </article>
  `,
})
export class PmConsoleAgentBannerComponent {
  @Input() variant: AgentBannerVariant = 'benefit';
  @Input() iconName = 'circle-check';
  @Input() title = 'Benefit Agent';
  @Input() description = '';
  @Input() actionLabel = 'Generate Benefits';
  @Input() ariaLabel = 'Benefit agent';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() readonly action = new EventEmitter<void>();
}
