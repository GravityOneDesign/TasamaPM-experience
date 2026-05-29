import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import type { PmoStatusReport } from './pmo-frontdoor.data';

@Component({
  selector: 'app-pmo-status-reports-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pmo-status-reports-drawer-shell" aria-live="polite">
      <button
        class="pmo-status-reports-drawer-backdrop"
        type="button"
        aria-label="Close status reports drawer"
        (click)="close.emit()"
      ></button>

      <aside class="pmo-status-reports-drawer" role="dialog" aria-modal="true" aria-label="Status Reports">
        <header class="pmo-status-reports-drawer-head">
          <div class="pmo-status-reports-drawer-title">
            <span class="pmo-status-reports-drawer-icon">
              <span pmConsoleIcon="chart-column" aria-hidden="true"></span>
            </span>
            <h2>Status Reports</h2>
            <span class="pmo-status-reports-badge {{ statusBadgeClass }}">{{ statusBadgeLabel }}</span>
          </div>

          <button class="pmo-status-reports-drawer-close" type="button" aria-label="Close status reports drawer" (click)="close.emit()">
            <span pmConsoleIcon="x" aria-hidden="true"></span>
          </button>
        </header>

        <div class="pmo-status-reports-drawer-body">
          <div class="pmo-status-reports-search-box">
            <span pmConsoleIcon="search" aria-hidden="true"></span>
            <input
              type="text"
              placeholder="Search..."
              class="pmo-status-reports-search-input"
              [value]="searchQuery"
              (input)="onSearchChange($event)"
              aria-label="Search status reports"
            />
          </div>

          <div class="pmo-status-reports-summary">
            <p>Showing all {{ filteredReports.length }} status reports</p>
          </div>

          <div class="pmo-status-reports-list">
            @for (report of filteredReports; track report.id) {
              <div class="pmo-status-report-card">
                <div class="pmo-status-report-date">
                  <span pmConsoleIcon="calendar" aria-hidden="true"></span>
                  <span>{{ report.dueDate }} ({{ report.overdueText }})</span>
                </div>

                <div class="pmo-status-report-content">
                  <h3>{{ report.title }}</h3>
                  <p class="pmo-status-report-project">{{ report.project }}</p>
                </div>

                <div class="pmo-status-report-footer">
                  <div class="pmo-status-report-owner">
                    <span class="pmo-status-report-avatar">{{ report.ownerInitials }}</span>
                    <span class="pmo-status-report-owner-name">{{ report.ownerName }}</span>
                  </div>
                  <button
                    class="pmo-status-report-open-btn"
                    type="button"
                    (click)="selectReport(report)"
                    [attr.aria-label]="'Open ' + report.title"
                  >
                    Open
                    <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-status-reports-drawer-shell {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: grid;
        z-index: 999;
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .pmo-status-reports-drawer-backdrop {
        grid-area: 1 / 1;
        background: rgba(0, 0, 0, 0.3);
        border: none;
        cursor: pointer;
        padding: 0;
      }

      .pmo-status-reports-drawer {
        grid-area: 1 / 1;
        margin-left: auto;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 480px;
        background: #ffffff;
        border-left: 1px solid #e0e0e0;
        box-shadow: -2px 4px 16px rgba(0, 0, 0, 0.08);
        animation: slideInRight 0.3s ease-out;
        overflow: hidden;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .pmo-status-reports-drawer-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
        background: #fafafa;
        flex-shrink: 0;
      }

      .pmo-status-reports-drawer-title {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }

      .pmo-status-reports-drawer-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: #e3f2fd;
        border-radius: 8px;
        flex-shrink: 0;
        color: #1976d2;
      }

      .pmo-status-reports-drawer-title h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #0b0b0b;
        white-space: nowrap;
      }

      .pmo-status-reports-badge {
        display: inline-block;
        padding: 4px 8px;
        background: #ffebee;
        color: #c62828;
        font-size: 12px;
        font-weight: 600;
        border-radius: 4px;
        white-space: nowrap;
        flex-shrink: 0;
        margin-left: auto;
      }

      .pmo-status-reports-badge.ok {
        background: #e8f5e9;
        color: #2e7d32;
      }

      .pmo-status-reports-drawer-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        flex-shrink: 0;
      }

      .pmo-status-reports-drawer-close:hover {
        color: #0b0b0b;
      }

      .pmo-status-reports-drawer-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
      }

      .pmo-status-reports-search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        height: 40px;
        color: #999;
      }

      .pmo-status-reports-search-input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 14px;
        color: #2f2f2f;
        outline: none;
        font-family: inherit;
      }

      .pmo-status-reports-search-input::placeholder {
        color: #999;
      }

      .pmo-status-reports-summary {
        padding: 0 4px;
        font-size: 12px;
        color: #999;
      }

      .pmo-status-reports-summary p {
        margin: 0;
      }

      .pmo-status-reports-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .pmo-status-report-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .pmo-status-report-card:hover {
        border-color: #bbb;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .pmo-status-report-date {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #999;
      }

      .pmo-status-report-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .pmo-status-report-content h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #0b0b0b;
        line-height: 1.3;
      }

      .pmo-status-report-project {
        margin: 0;
        font-size: 13px;
        color: #666;
      }

      .pmo-status-report-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding-top: 8px;
        border-top: 1px solid #f0f0f0;
      }

      .pmo-status-report-owner {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
      }

      .pmo-status-report-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: #cfe9f3;
        color: #0264c8;
        border-radius: 50%;
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .pmo-status-report-owner-name {
        font-size: 13px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-status-report-open-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        color: #0264c8;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        padding: 4px 0;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .pmo-status-report-open-btn:hover {
        opacity: 0.8;
      }
    `,
  ],
})
export class PmoStatusReportsDrawerComponent {
  @Input() reports: readonly PmoStatusReport[] = [];
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly reportSelected = new EventEmitter<PmoStatusReport>();

  searchQuery = '';

  get filteredReports(): readonly PmoStatusReport[] {
    if (!this.searchQuery.trim()) {
      return this.reports;
    }
    const query = this.searchQuery.toLowerCase();
    return this.reports.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.project.toLowerCase().includes(query) ||
        report.ownerName.toLowerCase().includes(query)
    );
  }

  get statusBadgeLabel(): string {
    const overdueCount = this.reports.filter((r) => r.isOverdue).length;
    if (overdueCount > 0) {
      return `${overdueCount > 1 ? overdueCount : ''} Overdue`.trim();
    }
    return 'On Track';
  }

  get statusBadgeClass(): string {
    const overdueCount = this.reports.filter((r) => r.isOverdue).length;
    return overdueCount > 0 ? 'overdue' : 'ok';
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  selectReport(report: PmoStatusReport): void {
    this.reportSelected.emit(report);
  }
}
