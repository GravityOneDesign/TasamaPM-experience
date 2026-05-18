import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

type AgentBannerVariant = 'benefit' | 'risk';

@Component({
  selector: 'app-pm-console-agent-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      .plan-agent-banner {
        background:
          radial-gradient(circle at 53% 2%, rgba(145, 185, 255, 0.88) 0, rgba(145, 185, 255, 0) 30%),
          radial-gradient(circle at 73% 51%, rgba(171, 10, 121, 0.76) 0, rgba(171, 10, 121, 0) 34%),
          linear-gradient(103deg, #02030d 0%, #051934 20%, #315ea6 42%, #427dff 54%, #91106d 73%, #03030d 100%);
        border-radius: 12px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        min-height: 122px;
        overflow: hidden;
        padding: 16px;
        position: relative;
      }

      .plan-agent-banner.risk {
        background:
          radial-gradient(circle at 52% 2%, rgba(145, 185, 255, 0.82) 0, rgba(145, 185, 255, 0) 31%),
          radial-gradient(circle at 72% 51%, rgba(155, 42, 143, 0.72) 0, rgba(155, 42, 143, 0) 34%),
          linear-gradient(103deg, #03040f 0%, #07203e 21%, #315ea6 43%, #3d77ee 55%, #7e115f 72%, #03030d 100%);
      }

      .plan-agent-main {
        align-items: center;
        display: flex;
        gap: 18px;
        justify-content: space-between;
        min-height: 90px;
        position: relative;
        z-index: 1;
      }

      .plan-agent-copy {
        display: grid;
        flex: 1 1 auto;
        gap: 13px;
        min-width: 0;
      }

      .plan-agent-kicker {
        align-items: center;
        color: #ffffff;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 8px;
        letter-spacing: 0.01em;
        line-height: 16px;
        text-shadow: 0 0 3px #91b9ff;
        width: fit-content;
      }

      .plan-agent-mark,
      .plan-agent-action-icon {
        display: inline-block;
        height: 16px;
        mask: url('/assets/ai-spark-star.svg') center / contain no-repeat;
        -webkit-mask: url('/assets/ai-spark-star.svg') center / contain no-repeat;
        width: 16px;
      }

      .plan-agent-mark {
        background: #ffffff;
      }

      .plan-agent-text {
        color: #ffffff;
        display: grid;
        gap: 4px;
        max-width: 805px;
        padding-left: 25px;
      }

      .plan-agent-text strong {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 24px;
      }

      .plan-agent-text p {
        font-size: 12px;
        font-weight: 500;
        line-height: 20.4px;
        margin: 0;
      }

      .plan-agent-action {
        align-items: center;
        background: #ffffff;
        border: 1px solid #ca95ff;
        border-radius: 10px;
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        gap: 5px;
        min-height: 38px;
        padding: 10px 8px;
        transition:
          box-shadow 160ms ease,
          transform 160ms ease;
        white-space: nowrap;
      }

      .plan-agent-action:hover {
        box-shadow: 0 8px 20px rgba(47, 78, 176, 0.18);
        transform: translateY(-1px);
      }

      .plan-agent-action:focus-visible {
        box-shadow:
          0 0 0 3px rgba(255, 255, 255, 0.72),
          0 0 0 5px rgba(85, 130, 255, 0.4);
        outline: 0;
      }

      .plan-agent-action-icon {
        background: linear-gradient(103deg, #9b2a8f 5%, #3891ea 102%);
        height: 14px;
        width: 14px;
      }

      .plan-agent-action-copy {
        background: linear-gradient(103deg, #9b2a8f 5%, #3891ea 102%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
      }

      @media (max-width: 720px) {
        .plan-agent-banner {
          min-height: 0;
        }

        .plan-agent-main {
          align-items: flex-start;
          flex-direction: column;
        }

        .plan-agent-text {
          padding-left: 0;
        }
      }
    `,
  ],
  template: `
    <article class="plan-agent-banner" [class.risk]="variant === 'risk'" [attr.aria-label]="ariaLabel">
      <div class="plan-agent-main">
        <div class="plan-agent-copy">
          <span class="plan-agent-kicker">
            <span class="plan-agent-mark" aria-hidden="true"></span>
            AI assistant
          </span>
          <div class="plan-agent-text">
            <strong>{{ title }}</strong>
            <p>{{ description }}</p>
          </div>
        </div>
        <button class="plan-agent-action" type="button" (click)="action.emit()">
          <span class="plan-agent-action-icon" aria-hidden="true"></span>
          <span class="plan-agent-action-copy">{{ actionLabel }}</span>
        </button>
      </div>
    </article>
  `,
})
export class PmConsoleAgentBannerComponent {
  @Input() variant: AgentBannerVariant = 'benefit';
  @Input() title = 'Benefit Agent';
  @Input() description = '';
  @Input() actionLabel = 'Generate Benefits';
  @Input() ariaLabel = 'Benefit agent';

  @Output() readonly action = new EventEmitter<void>();
}
