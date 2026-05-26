import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  isPmoReportReviewDrawerTabId,
  pmoReportReviewDrawerTabs,
  type PmoReportReviewCard,
  type PmoReportReviewDrawerDocument,
  type PmoReportReviewDrawerTab,
  type PmoReportReviewDrawerTabId,
  type PmoReportReviewDrawerStatusReport,
} from './pmo-report-review-progress.data';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

@Component({
  selector: 'app-pmo-report-review-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pmo-report-drawer-shell" aria-live="polite">
      <button class="pmo-report-drawer-backdrop" type="button" aria-label="Close report drawer" (click)="close.emit()"></button>

      <aside class="pmo-report-drawer" role="dialog" aria-modal="true" [attr.aria-label]="reportTitle + ' report log'">
        <header class="pmo-report-drawer-head">
          <div class="pmo-report-drawer-title">
            <span>REPORT Log</span>
            <h2>{{ reportTitle }}</h2>
          </div>

          <nav class="pmo-report-drawer-tabs" role="tablist" aria-label="Report log document groups">
            @for (tab of tabs; track tab.id) {
              <button
                class="pmo-report-drawer-tab"
                [class.active]="activeTabId === tab.id"
                [style.width.px]="tab.widthPx"
                type="button"
                role="tab"
                [attr.aria-selected]="activeTabId === tab.id"
                (click)="setActiveTab(tab.id)"
              >
                <span [pmConsoleIcon]="tab.icon" aria-hidden="true"></span>
                <span>{{ tab.label }}</span>
              </button>
            }
          </nav>

          <button class="pmo-report-drawer-close" type="button" aria-label="Close report drawer" (click)="close.emit()">
            <span pmConsoleIcon="x" aria-hidden="true"></span>
          </button>
        </header>

        <section class="pmo-report-drawer-body" [attr.aria-label]="activeTab.label + ' reports'">
          @if (isStatusReportTab) {
            <div class="pmo-report-drawer-table-shell pmo-report-status-table-shell">
              <table class="pmo-report-status-table">
                <colgroup>
                  <col class="status-col-start" />
                  <col class="status-col-end" />
                  <col class="status-col-due" />
                  <col class="status-col-report" />
                  <col class="status-col-project" />
                  <col class="status-col-type" />
                  <col class="status-col-action" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Interval Start Date</th>
                    <th scope="col">Interval End Date</th>
                    <th scope="col">Due/ApprovedDate</th>
                    <th scope="col">Report Status</th>
                    <th scope="col">Project Status</th>
                    <th scope="col">Report Type</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of activeStatusReports; track row.id) {
                    <tr>
                      <td>{{ row.intervalStartDate }}</td>
                      <td>{{ row.intervalEndDate }}</td>
                      <td>{{ row.dueApprovedDate }}</td>
                      <td>
                        <span class="pmo-report-status-chip {{ chipToneClass(row.reportStatus.tone) }}">
                          {{ row.reportStatus.label }}
                        </span>
                      </td>
                      <td>
                        <span class="pmo-report-status-chip {{ chipToneClass(row.projectStatus.tone) }}">
                          {{ row.projectStatus.label }}
                        </span>
                      </td>
                      <td>{{ row.reportType }}</td>
                      <td>
                        <button
                          class="pmo-report-status-action"
                          type="button"
                          [attr.aria-label]="row.action.label + ' project status report for interval starting ' + row.intervalStartDate"
                        >
                          <span [pmConsoleIcon]="row.action.icon" aria-hidden="true"></span>
                          <span>{{ row.action.label }}</span>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="pmo-report-drawer-table-shell">
              <table class="pmo-report-drawer-table">
                <thead>
                  <tr>
                    <th scope="col">Report Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (document of activeDocuments; track document.id) {
                    <tr>
                      <td>{{ document.name }}</td>
                      <td>
                        <button type="button" [attr.aria-label]="'Download ' + document.name">
                          <span pmConsoleIcon="download" aria-hidden="true"></span>
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-report-drawer-shell {
        inset: 0;
        isolation: isolate;
        pointer-events: none;
        position: fixed;
        z-index: 1000;
      }

      .pmo-report-drawer-backdrop {
        animation: motion-fade-in var(--motion-medium) var(--motion-ease) both;
        background: rgba(18, 24, 38, 0.24);
        inset: 0;
        pointer-events: auto;
        position: absolute;
      }

      .pmo-report-drawer {
        animation: motion-drawer-in var(--motion-medium) var(--motion-ease) backwards;
        background: #ffffff;
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.2);
        display: grid;
        grid-template-rows: 147px minmax(0, 1fr);
        max-width: calc(100vw - 28px);
        overflow: hidden;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: min(833px, calc(100vw - 72px));
        will-change: opacity;
      }

      .pmo-report-drawer-head {
        background: linear-gradient(101deg, #eef2ff 0%, #f7f7fc 53%, #f4f4f4 100%);
        min-height: 147px;
        overflow: hidden;
        padding: 24px 16px 0;
        position: relative;
      }

      .pmo-report-drawer-title {
        display: grid;
        gap: 8px;
        max-width: 500px;
        min-width: 0;
      }

      .pmo-report-drawer-title span {
        color: #10069f;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.8px;
        line-height: 10px;
        text-transform: uppercase;
      }

      .pmo-report-drawer-title h2 {
        color: #202633;
        font-size: 20px;
        font-weight: 600;
        line-height: 23px;
        margin: 0;
      }

      .pmo-report-drawer-close {
        align-items: center;
        border-radius: 10px;
        color: #596273;
        display: inline-flex;
        height: 36px;
        justify-content: center;
        outline: none;
        position: absolute;
        right: 16px;
        top: 24px;
        transition:
          background var(--motion-fast) var(--motion-ease),
          color var(--motion-fast) var(--motion-ease);
        width: 36px;
      }

      .pmo-report-drawer-close:hover,
      .pmo-report-drawer-close:focus-visible {
        background: rgba(89, 98, 115, 0.1);
        color: #202633;
      }

      .pmo-report-drawer-close .icon {
        height: 17px;
        width: 17px;
      }

      .pmo-report-drawer-tabs {
        align-items: flex-end;
        bottom: 0;
        display: flex;
        height: 44px;
        left: 16px;
        min-width: 0;
        position: absolute;
      }

      .pmo-report-drawer-tab {
        align-items: center;
        border-radius: 12px 12px 0 0;
        color: #404040;
        display: inline-flex;
        font-size: 14px;
        font-weight: 500;
        gap: 8px;
        height: 44px;
        justify-content: center;
        line-height: 20px;
        outline: none;
        padding: 0 24px;
        white-space: nowrap;
      }

      .pmo-report-drawer-tab .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-report-drawer-tab.active {
        background: #ffffff;
        color: #10069f;
      }

      .pmo-report-drawer-tab:focus-visible {
        outline: 2px solid rgba(16, 6, 159, 0.22);
        outline-offset: -3px;
      }

      .pmo-report-drawer-body {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-bottom: 0;
        border-radius: 12px 0 0 0;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.08);
        min-height: 0;
        overflow: auto;
        padding: 16px;
      }

      .pmo-report-drawer-table-shell {
        border: 1px solid #d6d8df;
        border-radius: 8px;
        min-width: 0;
        overflow: hidden;
      }

      .pmo-report-status-table-shell {
        border-color: #dddddd;
      }

      .pmo-report-drawer-table {
        border-collapse: collapse;
        color: #0b0b0b;
        font-size: 13px;
        line-height: 20px;
        table-layout: fixed;
        width: 100%;
      }

      .pmo-report-drawer-table th {
        background: #f4f3fb;
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
        height: 38px;
        line-height: 16px;
        padding: 0 20px;
        text-align: left;
      }

      .pmo-report-drawer-table th:first-child {
        width: calc(100% - 119px);
      }

      .pmo-report-drawer-table th:last-child {
        border-left: 1px solid #e4e7ef;
        width: 119px;
      }

      .pmo-report-drawer-table td {
        background: #ffffff;
        border-top: 1px solid #dddddd;
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 400;
        height: 43px;
        line-height: 20px;
        padding: 0 20px;
        vertical-align: middle;
      }

      .pmo-report-drawer-table td:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-report-drawer-table td:last-child {
        padding: 0 24px 0 8px;
        text-align: right;
      }

      .pmo-report-drawer-table button {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        height: 24px;
        justify-content: flex-end;
        line-height: 16px;
        outline: none;
        white-space: nowrap;
      }

      .pmo-report-drawer-table button .icon {
        height: 15px;
        width: 15px;
      }

      .pmo-report-drawer-table button:hover,
      .pmo-report-drawer-table button:focus-visible {
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .pmo-report-status-table {
        border-collapse: collapse;
        color: #0b0b0b;
        font-size: 12px;
        line-height: 20px;
        min-width: 800px;
        table-layout: fixed;
        width: 100%;
      }

      .status-col-start {
        width: 127px;
      }

      .status-col-end {
        width: 122px;
      }

      .status-col-due {
        width: 128px;
      }

      .status-col-report,
      .status-col-project {
        width: 111px;
      }

      .status-col-type {
        width: 98px;
      }

      .status-col-action {
        width: 103px;
      }

      .pmo-report-status-table th {
        background: rgba(16, 6, 159, 0.05);
        border-bottom: 1px solid #dddddd;
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 400;
        height: 37px;
        line-height: 16px;
        padding: 0 8px;
        text-align: left;
        white-space: nowrap;
      }

      .pmo-report-status-table th:not(:last-child) {
        border-right: 1px solid #e4e7ef;
      }

      .pmo-report-status-table td {
        background: #ffffff;
        border-bottom: 1px solid #dedede;
        color: #0b0b0b;
        font-size: 12px;
        font-weight: 400;
        height: 47px;
        line-height: 20px;
        overflow: hidden;
        padding: 0 8px;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
      }

      .pmo-report-status-table tbody tr:last-child td {
        border-bottom: 0;
      }

      .pmo-report-status-chip {
        align-items: center;
        border-radius: 8px;
        display: inline-flex;
        font-size: 12px;
        font-weight: 400;
        justify-content: center;
        letter-spacing: 0.2px;
        line-height: 16px;
        min-height: 23px;
        padding: 3px 9px 4px;
        white-space: nowrap;
      }

      .pmo-report-status-chip.tone-blue {
        background: #e6ecf8;
        color: #244980;
      }

      .pmo-report-status-chip.tone-neutral {
        background: #f3f3f3;
        color: #595959;
      }

      .pmo-report-status-chip.tone-amber {
        background: #fff7df;
        border: 1px solid rgba(214, 143, 0, 0.28);
        color: #d28a00;
      }

      .pmo-report-status-chip.tone-green {
        background: #e8f7ee;
        border: 1px solid rgba(22, 161, 95, 0.2);
        color: #16a15f;
      }

      .pmo-report-status-action {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 4px;
        height: 24px;
        justify-content: flex-start;
        line-height: 16px;
        outline: none;
        white-space: nowrap;
      }

      .pmo-report-status-action .icon {
        height: 15px;
        width: 15px;
      }

      .pmo-report-status-action:hover,
      .pmo-report-status-action:focus-visible {
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      @media (max-width: 760px) {
        .pmo-report-drawer {
          max-width: calc(100vw - 72px);
          width: calc(100vw - 72px);
        }

        .pmo-report-drawer-head {
          min-height: 164px;
        }

        .pmo-report-drawer-title {
          max-width: calc(100% - 52px);
        }

        .pmo-report-drawer-tabs {
          max-width: calc(100% - 32px);
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .pmo-report-drawer-body {
          overflow: auto;
        }

        .pmo-report-drawer-table-shell {
          min-width: 620px;
        }

        .pmo-report-status-table-shell {
          min-width: 800px;
        }
      }
    `,
  ],
})
export class PmoReportReviewDrawerComponent implements OnChanges {
  @Input({ required: true }) report!: PmoReportReviewCard;
  @Output() readonly close = new EventEmitter<void>();

  readonly tabs = pmoReportReviewDrawerTabs;

  activeTabId: PmoReportReviewDrawerTabId = this.tabs[0].id;

  get reportTitle(): string {
    return this.report.drawerTitle ?? this.report.title;
  }

  get activeTab(): PmoReportReviewDrawerTab {
    return this.tabs.find((tab) => tab.id === this.activeTabId) ?? this.tabs[0];
  }

  get activeDocuments(): readonly PmoReportReviewDrawerDocument[] {
    return this.activeTab.documents ?? [];
  }

  get activeStatusReports(): readonly PmoReportReviewDrawerStatusReport[] {
    return this.activeTab.statusReports ?? [];
  }

  get isStatusReportTab(): boolean {
    return this.activeTabId === 'project-status-report';
  }

  ngOnChanges(): void {
    this.activeTabId = this.tabs[0].id;
  }

  setActiveTab(tabId: string): void {
    if (!isPmoReportReviewDrawerTabId(tabId) || this.activeTabId === tabId) return;
    this.activeTabId = tabId;
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.close.emit();
  }

  chipToneClass(tone: PmoReportReviewDrawerStatusReport['reportStatus']['tone']): string {
    return `tone-${tone}`;
  }
}
