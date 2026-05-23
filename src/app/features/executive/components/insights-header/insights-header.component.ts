import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-executive-insights-header',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="executive-insights-header" aria-label="Executive console header">
      <div class="header-left">
        <button class="logo-button" type="button" aria-label="Return to executive front door" (click)="homeSelected.emit()">
          <img src="assets/executive/tasama-logo-blue.svg" alt="Tasama" />
        </button>
        <span class="header-divider" aria-hidden="true"></span>
        <p>Executive Console</p>
        <button class="scope-picker" type="button" aria-label="Viewing all portfolios">
          <span><small>Viewing</small><strong>All portfolios</strong></span>
          <span class="picker-icon" pmConsoleIcon="chevron-down" aria-hidden="true"></span>
        </button>
      </div>

      <div class="header-actions" aria-label="Executive console tools">
        <button class="period-picker" type="button" aria-label="Reporting period FY 2026 April">
          <span>FY 2026 April</span>
          <span class="picker-icon" pmConsoleIcon="chevron-down" aria-hidden="true"></span>
        </button>
        <button class="icon-button" type="button" aria-label="Print executive insights">
          <span pmConsoleIcon="printer" aria-hidden="true"></span>
        </button>
        <button class="icon-button" type="button" aria-label="Search executive insights">
          <span pmConsoleIcon="search" aria-hidden="true"></span>
        </button>
        <button class="icon-button icon-button--raised" type="button" aria-label="Notifications">
          <span pmConsoleIcon="bell" aria-hidden="true"></span>
        </button>
        <button class="avatar-button" type="button" aria-label="Executive profile MH">
          <span>MH</span>
          <i aria-hidden="true"></i>
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .executive-insights-header {
        align-items: center;
        background: #ffffff;
        border-bottom: 1px solid #e6e6e6;
        color: #0b0b0b;
        display: flex;
        height: 64px;
        justify-content: space-between;
        left: 0;
        padding: 12px 16px;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 4;
      }

      .header-left,
      .header-actions {
        align-items: center;
        display: flex;
        gap: 12px;
      }

      .header-left {
        gap: 16px;
      }

      .logo-button {
        align-items: center;
        border-radius: 12px;
        display: inline-flex;
        height: 40px;
        justify-content: center;
        width: 109px;
      }

      .logo-button:focus-visible,
      .scope-picker:focus-visible,
      .period-picker:focus-visible,
      .icon-button:focus-visible,
      .avatar-button:focus-visible {
        outline: 3px solid rgba(16, 6, 159, 0.24);
        outline-offset: 2px;
      }

      .logo-button img {
        display: block;
        height: 12px;
        width: 109px;
      }

      .header-divider {
        background: #e6e6e6;
        display: inline-block;
        height: 24px;
        width: 1px;
      }

      .header-left p {
        color: #0b0b0b;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        margin: 0;
        white-space: nowrap;
      }

      .scope-picker,
      .period-picker,
      .icon-button,
      .avatar-button {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 999px;
        display: inline-flex;
        justify-content: center;
      }

      .scope-picker {
        background: #f8f9fc;
        gap: 16px;
        height: 40px;
        justify-content: space-between;
        padding: 0 12px;
        width: 200px;
      }

      .scope-picker > span:first-child {
        align-items: center;
        display: flex;
        gap: 4px;
        min-width: 0;
      }

      .scope-picker small {
        color: #777777;
        font-size: 11px;
        font-weight: 500;
        line-height: 16px;
        text-transform: uppercase;
      }

      .scope-picker strong,
      .period-picker span:first-child {
        color: #0b0b0b;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        white-space: nowrap;
      }

      .picker-icon {
        color: #5f6573;
        height: 14px;
        width: 14px;
      }

      .period-picker {
        gap: 8px;
        height: 40px;
        padding: 0 12px;
      }

      .icon-button {
        color: #5b6574;
        height: 40px;
        width: 40px;
      }

      .icon-button--raised {
        box-shadow: 0 4px 12px rgba(1, 10, 15, 0.1);
      }

      .icon-button span {
        height: 20px;
        width: 20px;
      }

      .avatar-button {
        background: rgba(16, 6, 159, 0.1);
        border-color: transparent;
        color: #10069f;
        height: 40px;
        position: relative;
        width: 40px;
      }

      .avatar-button span {
        font-size: 14px;
        font-weight: 600;
        line-height: 24px;
      }

      .avatar-button i {
        background: #16a34a;
        border: 1px solid #ffffff;
        border-radius: 6px;
        bottom: 1px;
        height: 12px;
        position: absolute;
        right: 1px;
        width: 12px;
      }
    `,
  ],
})
export class ExecutiveInsightsHeaderComponent {
  @Output() readonly homeSelected = new EventEmitter<void>();
}


