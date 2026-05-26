import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

@Component({
  selector: 'app-pm-console-plan-drawer',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="plan-entry-drawer-shell" aria-hidden="false">
      <button class="plan-entry-drawer-backdrop" type="button" [attr.aria-label]="closeAriaLabel" (click)="close.emit()"></button>
      <aside class="plan-entry-drawer" [ngClass]="panelClass" role="dialog" aria-modal="true" [attr.aria-label]="ariaLabel || title">
        <form class="plan-entry-drawer-form" (submit)="submitForm.emit($event)">
          <header class="plan-entry-drawer-head">
            <div class="plan-entry-drawer-title">
              @if (eyebrow) {
                <span>{{ eyebrow }}</span>
              }
              <h2>{{ title }}</h2>
              <p>{{ description }}</p>
            </div>
            <button class="plan-entry-drawer-close" type="button" [attr.aria-label]="closeAriaLabel" (click)="close.emit()">
              <span pmConsoleIcon="x" aria-hidden="true"></span>
            </button>
          </header>

          <section class="plan-entry-drawer-body">
            @if (summary || summaryLabel) {
              <div class="plan-entry-drawer-summary">
                @if (summaryLabel) {
                  <span>{{ summaryLabel }}</span>
                }
                @if (summary) {
                  <small>{{ summary }}</small>
                }
              </div>
            }
            <ng-content select="[planDrawerBody]"></ng-content>
          </section>

          <footer class="plan-entry-drawer-footer">
            <span class="plan-entry-drawer-footer-prefix">
              <ng-content select="[planDrawerFooterPrefix]"></ng-content>
            </span>
            @if (submitFirst) {
              <button class="plan-entry-drawer-submit" type="submit" [disabled]="submitDisabled">{{ submitLabel }}</button>
              <button class="plan-entry-drawer-cancel" type="button" (click)="close.emit()">{{ cancelLabel }}</button>
            } @else {
              <button class="plan-entry-drawer-cancel" type="button" (click)="close.emit()">{{ cancelLabel }}</button>
              <button class="plan-entry-drawer-submit" type="submit" [disabled]="submitDisabled">{{ submitLabel }}</button>
            }
          </footer>
        </form>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .plan-entry-drawer-shell {
        inset: 0;
        pointer-events: none;
        position: fixed;
        z-index: 81;
      }

      .plan-entry-drawer-backdrop {
        animation: motion-fade-in var(--motion-medium) var(--motion-ease) both;
        background: rgba(18, 24, 38, 0.24);
        inset: 0;
        pointer-events: auto;
        position: absolute;
      }

      .plan-entry-drawer {
        animation: motion-drawer-in var(--motion-medium) var(--motion-ease) backwards;
        background: #ffffff;
        bottom: 0;
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.2);
        display: flex;
        flex-direction: column;
        max-width: calc(100vw - 28px);
        overflow: hidden;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: min(640px, calc(100vw - 72px));
        will-change: opacity;
      }

      .plan-entry-drawer-form {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        overflow: hidden;
      }

      .plan-entry-drawer-head {
        align-items: flex-start;
        background: #f7f7fc;
        border-bottom: 1px solid #e4e7ef;
        display: flex;
        flex: 0 0 auto;
        gap: 18px;
        justify-content: space-between;
        min-height: 99px;
        padding: 28px 20px 17px;
      }

      .plan-entry-drawer-title {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .plan-entry-drawer-title span {
        color: #10069f;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        line-height: 1;
        text-transform: uppercase;
      }

      .plan-entry-drawer-title h2 {
        color: #202633;
        font-size: 20px;
        font-weight: 600;
        line-height: 23px;
        margin: 0;
      }

      .plan-entry-drawer-title p {
        color: #687182;
        font-size: 11px;
        font-weight: 500;
        line-height: 17px;
        margin: 0;
        max-width: 48ch;
      }

      .plan-entry-drawer-close {
        align-items: center;
        border-radius: 10px;
        color: #596273;
        display: inline-flex;
        flex: 0 0 36px;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .plan-entry-drawer-close:hover,
      .plan-entry-drawer-close:focus-visible {
        background: #eef1f7;
        outline: none;
      }

      .plan-entry-drawer-close .icon {
        height: 17px;
        width: 17px;
      }

      .plan-entry-drawer-body {
        align-content: start;
        display: grid;
        flex: 1 1 auto;
        gap: 20px;
        min-height: 0;
        overscroll-behavior: contain;
        overflow: auto;
        padding: 18px 20px;
      }

      .plan-entry-drawer-summary {
        align-content: start;
        display: grid;
        gap: 5px;
        justify-items: start;
      }

      .plan-entry-drawer-summary span,
      .plan-entry-drawer-summary small {
        color: #687182;
        font-size: 10.5px;
        font-weight: 500;
        line-height: 15px;
      }

      .plan-entry-drawer-summary span {
        align-items: center;
        align-self: start;
        background: #f4f7fb;
        border-radius: 999px;
        color: #556072;
        display: inline-flex;
        font-weight: 600;
        min-height: 28px;
        padding: 0 10px;
        width: fit-content;
      }

      .plan-entry-drawer-footer {
        align-items: center;
        background: rgba(255, 255, 255, 0.96);
        border-top: 1px solid #e4e7ef;
        display: flex;
        flex: 0 0 auto;
        gap: 10px;
        justify-content: flex-end;
        min-height: 56px;
        padding: 11px 16px 13px;
      }

      .plan-entry-drawer-footer-prefix {
        align-items: center;
        display: flex;
        margin-right: auto;
        min-width: 0;
      }

      .plan-entry-drawer-cancel,
      .plan-entry-drawer-submit {
        align-items: center;
        border-radius: 8px;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 600;
        height: 32px;
        justify-content: center;
        padding: 0 15px;
        white-space: nowrap;
      }

      .plan-entry-drawer-cancel {
        background: #ffffff;
        border: 1px solid #e4e7ef;
        color: #596273;
      }

      .plan-entry-drawer-submit {
        background: #10069f;
        border: 1px solid #10069f;
        color: #ffffff;
        min-width: 119px;
      }

      .plan-entry-drawer-submit:disabled {
        background: #c9d0e1;
        border-color: #c9d0e1;
        color: #f8fbff;
        cursor: default;
      }

      @media (max-width: 760px) {
        .plan-entry-drawer {
          max-width: 100vw;
          width: 100vw;
        }

        .plan-entry-drawer-head,
        .plan-entry-drawer-body {
          padding-left: 16px;
          padding-right: 16px;
        }
      }
    `,
  ],
})
export class PmConsolePlanDrawerComponent {
  @Input() title = '';
  @Input() eyebrow = '';
  @Input() description = '';
  @Input() summaryLabel = '';
  @Input() summary = '';
  @Input() submitLabel = 'Save';
  @Input() cancelLabel = 'Cancel';
  @Input() submitFirst = false;
  @Input() submitDisabled = false;
  @Input() closeAriaLabel = 'Close drawer';
  @Input() ariaLabel = '';
  @Input() panelClass: string | string[] | Set<string> | Record<string, unknown> = '';

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<Event>();
}
