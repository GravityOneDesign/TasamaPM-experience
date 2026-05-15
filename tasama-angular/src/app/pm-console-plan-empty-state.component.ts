import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from './shared/pm-console-status-pill.component';

@Component({
  selector: 'app-pm-console-plan-empty-state',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="plan-empty-card" [attr.aria-label]="title">
      <header class="plan-empty-card-head">
        <div class="plan-empty-card-heading">
          <span class="plan-empty-card-icon" aria-hidden="true">
            <span [pmConsoleIcon]="iconName"></span>
          </span>
          <span class="plan-empty-card-copy">
            <strong>{{ title }}</strong>
            <small>{{ description }}</small>
          </span>
        </div>

        <div class="plan-empty-card-actions">
          <span [pmConsoleStatusPill]="countLabel" baseClass="plan-empty-card-count"></span>
          @if (actionLabel) {
            <button class="plan-empty-card-button" type="button" [attr.aria-label]="actionAriaLabel || actionLabel" (click)="action.emit()">
              <span pmConsoleIcon="plus" aria-hidden="true"></span>
              <span>{{ actionLabel }}</span>
            </button>
          }
        </div>
      </header>

      <section class="plan-empty-card-body">
        <div class="plan-empty-card-art" aria-hidden="true">
          <svg viewBox="0 0 132 106" fill="none" role="img">
            <path d="M24 64H10" stroke="#E8F0FE" stroke-width="6" stroke-linecap="round" />
            <path d="M119 66H104" stroke="#E8F0FE" stroke-width="6" stroke-linecap="round" />
            <path d="M95 58H80" stroke="#E8F0FE" stroke-width="6" stroke-linecap="round" />
            <path d="M38 75H30" stroke="#DCE8FF" stroke-width="5" stroke-linecap="round" />
            <path d="M106 78H102" stroke="#DCE8FF" stroke-width="5" stroke-linecap="round" />
            <text x="19" y="41" fill="#95CF5D" font-family="Montserrat, sans-serif" font-size="12" font-weight="600">z</text>
            <text x="30" y="31" fill="#B7D982" font-family="Montserrat, sans-serif" font-size="9" font-weight="600">z</text>
            <text x="40" y="47" fill="#CBE9A5" font-family="Montserrat, sans-serif" font-size="7" font-weight="600">z</text>
            <path d="M37.1 77.1H95.6C106.4 77.1 115.1 68.4 115.1 57.6C115.1 47.2 106.9 38.7 96.6 38.1C92.7 28.1 83 21 71.6 21C58.8 21 48 30 45.3 42.1C36.7 43.7 30.2 51.2 30.2 60.3C30.2 66.9 32.9 72.8 37.1 77.1Z" fill="#F3F7FF" stroke="#10069F" stroke-width="1.6" stroke-linejoin="round" />
            <path d="M54 57C55.4 59.5 57.9 61.1 60.8 61.1C63.7 61.1 66.2 59.5 67.6 57" stroke="#10069F" stroke-width="1.6" stroke-linecap="round" />
            <path d="M79 57C80.4 59.5 82.9 61.1 85.8 61.1C88.7 61.1 91.2 59.5 92.6 57" stroke="#10069F" stroke-width="1.6" stroke-linecap="round" />
            <path d="M67 70H79" stroke="#10069F" stroke-width="1.6" stroke-linecap="round" />
            <path d="M58 72H62" stroke="#75A4FE" stroke-width="1.5" stroke-linecap="round" />
            <path d="M85 72H89" stroke="#75A4FE" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="120" cy="79" r="3.2" fill="#E8F0FE" />
            <circle cx="13" cy="51" r="2.8" fill="#E8F0FE" />
          </svg>
        </div>
        <div class="plan-empty-card-message">
          <strong>{{ emptyTitle }}</strong>
          <p>{{ emptyBody }}</p>
        </div>
      </section>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: 100%;
      }

      .plan-empty-card {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.08);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        width: 100%;
      }

      .plan-empty-card-head {
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-width: 0;
        padding: 16px;
      }

      .plan-empty-card-heading,
      .plan-empty-card-actions {
        align-items: center;
        display: flex;
        min-width: 0;
      }

      .plan-empty-card-heading {
        gap: 12px;
      }

      .plan-empty-card-icon {
        align-items: center;
        background: rgba(16, 6, 159, 0.03);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.1);
        color: #10069f;
        display: inline-flex;
        flex: 0 0 40px;
        height: 40px;
        justify-content: center;
        width: 40px;
      }

      .plan-empty-card-icon .icon {
        height: 22px;
        width: 22px;
      }

      .plan-empty-card-copy {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .plan-empty-card-copy strong {
        color: #0b0b0b;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }

      .plan-empty-card-copy small {
        color: #777777;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }

      .plan-empty-card-actions {
        flex: 0 0 auto;
        gap: 10px;
      }

      .plan-empty-card-count {
        align-items: center;
        background: #f4f7fb;
        border-radius: 999px;
        color: #556072;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 600;
        height: 30px;
        justify-content: center;
        min-width: 61px;
        padding: 0 12px;
        white-space: nowrap;
      }

      .plan-empty-card-button {
        align-items: center;
        background: #ffffff;
        border: 1px solid #10069f;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 5px;
        height: 36px;
        justify-content: center;
        padding: 0 13px;
        white-space: nowrap;
      }

      .plan-empty-card-button:hover,
      .plan-empty-card-button:focus-visible {
        background: #f7f8ff;
        outline: none;
      }

      .plan-empty-card-button .icon {
        height: 14px;
        width: 14px;
      }

      .plan-empty-card-body {
        align-items: center;
        background: linear-gradient(180deg, #fcfeff 0%, #f8fbfd 100%);
        border-top: 1px solid #e5eef4;
        display: flex;
        gap: 24px;
        min-height: 152px;
        padding: 24px 28px;
      }

      .plan-empty-card-art {
        flex: 0 0 132px;
        height: 106px;
      }

      .plan-empty-card-art svg {
        display: block;
        height: 100%;
        overflow: visible;
        width: 100%;
      }

      .plan-empty-card-message {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .plan-empty-card-message strong {
        color: #202633;
        font-size: 15px;
        font-weight: 600;
        line-height: 18.75px;
      }

      .plan-empty-card-message p {
        color: #687182;
        font-size: 11px;
        font-weight: 500;
        line-height: 17px;
        margin: 0;
        max-width: 58ch;
      }

      @media (max-width: 760px) {
        .plan-empty-card-head,
        .plan-empty-card-body {
          align-items: flex-start;
          flex-direction: column;
        }

        .plan-empty-card-actions {
          width: 100%;
        }

        .plan-empty-card-button {
          flex: 1 1 auto;
        }

        .plan-empty-card-body {
          gap: 14px;
          padding: 20px;
        }
      }
    `,
  ],
})
export class PmConsolePlanEmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() countLabel = '0 records';
  @Input() actionLabel = '';
  @Input() actionAriaLabel = '';
  @Input() iconName = 'plus';
  @Input() emptyTitle = '';
  @Input() emptyBody = '';

  @Output() action = new EventEmitter<void>();
}
