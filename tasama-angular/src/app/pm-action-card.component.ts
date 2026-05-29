import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

/**
 * Project Manager "My Actions" card. Implements the updated Figma card design
 * (User Flows – Design, node 2964-3221): colored type tag, title, subtitle,
 * a due row with a calendar icon, a divider, and a footer with the owner
 * (avatar + name) and an "Open" action.
 *
 * Presentational only — the host owns the data and decides whether the card is
 * interactive (`clickable`). Used only by PM > Manage My Work > My Actions.
 */
@Component({
  selector: 'app-pm-action-card',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pm-card"
      [class.is-static]="!clickable"
      [attr.data-event-type]="eventType"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable ? 0 : null"
      [attr.aria-label]="clickable ? title + ' — ' + actionLabel : null"
      (click)="activate($event)"
      (keydown.enter)="activate($event)"
      (keydown.space)="activate($event)"
    >
      <span class="pm-card-tag" [attr.data-event-type]="eventType">{{ tag }}</span>

      <span class="pm-card-body">
        <span class="pm-card-title">{{ title }}</span>
        @if (subtitle) {
          <span class="pm-card-subtitle">{{ subtitle }}</span>
        }
        @if (due) {
          <span class="pm-card-due">
            <span class="pm-card-due-icon" pmConsoleIcon="calendar-days" aria-hidden="true"></span>
            <span class="pm-card-due-text">{{ due }}</span>
          </span>
        }
      </span>

      <span class="pm-card-divider" aria-hidden="true"></span>

      <span class="pm-card-footer">
        <span class="pm-card-owner">
          @if (ownerInitials) {
            <span class="pm-card-avatar">{{ ownerInitials }}</span>
          }
          @if (ownerName) {
            <span class="pm-card-owner-name">{{ ownerName }}</span>
          }
        </span>
        <span class="pm-card-action">
          <span class="pm-card-action-label">{{ actionLabel }}</span>
          <span class="pm-card-action-icon" pmConsoleIcon="arrow-right" aria-hidden="true"></span>
        </span>
      </span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .pm-card {
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 12px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 13px;
        text-align: left;
        transition: border-color 140ms ease, box-shadow 140ms ease;
        width: 100%;
      }

      .pm-card[role='button'] {
        cursor: pointer;
      }

      .pm-card[role='button']:hover,
      .pm-card[role='button']:focus-visible {
        border-color: #c7ccd6;
        box-shadow: 0 8px 18px rgba(25, 33, 61, 0.08);
        outline: 0;
      }

      .pm-card.is-static {
        cursor: default;
      }

      /* Type tag — hugs its text and is left-aligned (does not stretch to card width). */
      .pm-card-tag {
        align-items: center;
        align-self: flex-start;
        background: #f5f7fb;
        border-radius: 6px;
        color: #536071;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 11px;
        font-weight: 500;
        justify-content: center;
        letter-spacing: 0.24px;
        line-height: 16px;
        max-width: 100%;
        padding: 2px 6px;
        white-space: nowrap;
      }

      /* Body: title + subtitle + due */
      .pm-card-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;
      }

      .pm-card-title {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-card-subtitle {
        color: #777777;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        white-space: nowrap;
      }

      .pm-card-due {
        align-items: center;
        color: #777777;
        display: flex;
        gap: 8px;
      }

      .pm-card-due-icon {
        color: #777777;
        flex: 0 0 auto;
        height: 16px;
        width: 16px;
      }

      .pm-card-due-icon .icon {
        height: 16px;
        width: 16px;
      }

      .pm-card-due-text {
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Divider */
      .pm-card-divider {
        background: #ededed;
        display: block;
        height: 1px;
        width: 100%;
      }

      /* Footer: owner + action */
      .pm-card-footer {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: space-between;
        width: 100%;
      }

      .pm-card-owner {
        align-items: center;
        display: flex;
        gap: 8px;
        min-width: 0;
      }

      .pm-card-avatar {
        align-items: center;
        background: rgba(16, 6, 159, 0.1);
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10px;
        font-weight: 500;
        height: 24px;
        justify-content: center;
        line-height: 12px;
        text-transform: uppercase;
        width: 24px;
      }

      .pm-card-owner-name {
        color: #777777;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-card-action {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        gap: 4px;
        justify-content: center;
      }

      .pm-card-action-label {
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        white-space: nowrap;
      }

      .pm-card-action-icon {
        color: #10069f;
        flex: 0 0 auto;
        height: 16px;
        width: 16px;
      }

      .pm-card-action-icon .icon {
        height: 16px;
        width: 16px;
      }

      /* Type tag colours — from the Figma card designs. */
      .pm-card-tag[data-event-type='Plans'] {
        background: rgba(49, 136, 181, 0.1);
        color: #3188b5;
      }
      .pm-card-tag[data-event-type='Status reports'] {
        background: rgba(111, 32, 149, 0.1);
        color: #6f2095;
      }
      .pm-card-tag[data-event-type='Benefits'] {
        background: rgba(22, 108, 73, 0.1);
        color: #166c49;
      }
      .pm-card-tag[data-event-type='Risk'] {
        background: rgba(185, 28, 28, 0.1);
        color: #b91c1c;
      }
      .pm-card-tag[data-event-type='Governance Committees'] {
        background: rgba(52, 84, 196, 0.1);
        color: #3454c4;
      }
      .pm-card-tag[data-event-type='Change requests'] {
        background: rgba(196, 52, 114, 0.1);
        color: #c43472;
      }
    `,
  ],
})
export class PmActionCardComponent {
  /** Calendar chip type used to pick the tag colour (e.g. "Plans", "Status reports", "Risk"). */
  @Input() eventType = '';
  /** Label shown inside the tag (the action's own type label). */
  @Input() tag = '';
  @Input() title = '';
  @Input() subtitle = '';
  /** Due / status line, e.g. "Overdue by 5 days". */
  @Input() due = '';
  @Input() ownerInitials = '';
  @Input() ownerName = '';
  @Input() actionLabel = 'Open';
  @Input() clickable = false;

  @Output() readonly cardClick = new EventEmitter<Event>();

  activate(event: Event): void {
    if (!this.clickable) return;
    if (event.type.startsWith('key')) event.preventDefault();
    this.cardClick.emit(event);
  }
}
