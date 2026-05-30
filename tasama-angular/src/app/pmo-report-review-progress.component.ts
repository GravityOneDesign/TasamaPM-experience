import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Output } from '@angular/core';
import {
  isPmoReportReviewTabId,
  pmoReportReviewColumns,
  pmoReportReviewCustomColumns,
  pmoReportReviewFilters,
  pmoReportReviewTabs,
  type PmoReportReviewCard,
  type PmoReportReviewColumn,
  type PmoReportReviewTabId,
} from './pmo-report-review-progress.data';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmoGovernanceRegisterComponent } from './pmo-governance-register.component';
import { PmConsoleDateFieldComponent } from './shared/pm-console-date-field.component';

@Component({
  selector: 'app-pmo-report-review-progress',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsoleDateFieldComponent, PmoGovernanceRegisterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pmo-report-review-canvas">
      <div class="page-motion-host">
        <section class="pmo-report-review-page" aria-label="Report and review progress">
          <header class="pmo-report-review-header">
            <div class="pmo-report-title-group">
              <button class="pmo-report-back-button" type="button" aria-label="Back to PMO home" (click)="backSelected.emit()">
                <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
              </button>
              <h1>Governance & Reporting</h1>
            </div>

            <nav class="pmo-report-tabs" role="tablist" aria-label="Report review sections">
              @for (tab of tabs; track tab.id) {
                <button
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
          </header>

          @if (activeTabId === 'governance') {
            <app-pmo-governance-register></app-pmo-governance-register>
          } @else {
          <section class="pmo-report-review-body" aria-label="Reports">
            <div class="pmo-report-toolbar">
              <h2>{{ reportHeading }}</h2>

              <div class="pmo-report-actions" aria-label="Report filters">
                <button class="pmo-report-icon-button" type="button" aria-label="Search reports">
                  <span pmConsoleIcon="search" aria-hidden="true"></span>
                </button>
                <div class="pmo-report-date-filter" (click)="$event.stopPropagation()">
                  <button
                    class="pmo-report-icon-button"
                    [class.is-active]="!!selectedPublishedDateFilter"
                    type="button"
                    aria-label="Filter reports by published date"
                    [attr.aria-expanded]="showDateFilterMenu"
                    aria-controls="pmo-report-date-filter-menu"
                    (click)="toggleDateFilterMenu($event)"
                  >
                    <span pmConsoleIcon="funnel" aria-hidden="true"></span>
                  </button>

                  @if (showDateFilterMenu) {
                    <div class="pmo-report-date-filter-menu" id="pmo-report-date-filter-menu" role="dialog" aria-label="Date filter">
                      <label class="pmo-report-date-filter-field">
                        <span>Published date</span>
                        <app-pm-console-date-field
                          [value]="selectedPublishedDateFilter"
                          placeholder="Select date"
                          ariaLabel="Filter reports by published date"
                          (valueChange)="setPublishedDateFilter($event)"
                        />
                      </label>

                      <div class="pmo-report-date-filter-footer">
                        <span>{{ dateFilterSummary }}</span>
                        <button class="pmo-report-date-filter-clear" type="button" [disabled]="!selectedPublishedDateFilter" (click)="clearPublishedDateFilter()">
                          Clear
                        </button>
                      </div>
                    </div>
                  }
                </div>

                @for (filter of filters; track filter.id) {
                  <button class="pmo-report-filter" type="button">
                    <span [pmConsoleIcon]="filter.icon" aria-hidden="true"></span>
                    <span class="pmo-report-filter-label">{{ filter.label }}</span>
                    <span class="pmo-report-filter-count">{{ filter.count }}</span>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                  </button>
                }

                @if (activeTabId === 'custom') {
                  <button class="pmo-report-builder-button" type="button" (click)="reportBuilderRequested.emit()">
                    <span pmConsoleIcon="plus" aria-hidden="true"></span>
                    <span>Report Builder</span>
                  </button>
                }
              </div>
            </div>

            <div
              class="pmo-report-columns"
              [class.pmo-report-custom-columns]="activeTabId === 'custom'"
              aria-label="Report groups"
            >
              @for (column of visibleColumns; track column.id) {
                <section class="pmo-report-column" [attr.aria-label]="column.title + ' reports'">
                  <header class="pmo-report-column-header">
                    <span class="pmo-report-column-icon" aria-hidden="true">
                      <span [pmConsoleIcon]="column.icon"></span>
                    </span>
                    <h3>{{ column.title }}</h3>
                    <strong>{{ column.count }}</strong>
                  </header>

                  <div class="pmo-report-card-list" [class.pmo-report-custom-card-list]="activeTabId === 'custom'">
                    @if (column.reports.length) {
                      @for (report of column.reports; track report.id) {
                        <article
                          class="pmo-report-card"
                          [class.is-clickable]="activeTabId === 'standard'"
                          [class.pmo-report-custom-card]="activeTabId === 'custom'"
                          (click)="openReportDrawer(report)"
                        >
                          <h4>{{ report.title }}</h4>

                          <div class="pmo-report-card-meta" [class.is-date-only]="!report.creatorName && !report.recursOn">
                            @if (report.creatorName && report.creatorInitials) {
                              <div class="pmo-report-card-owner">
                                <span class="pmo-report-card-label">Created by</span>
                                <span class="pmo-report-card-person">
                                  <span class="pmo-report-avatar">{{ report.creatorInitials }}</span>
                                  <span>{{ report.creatorName }}</span>
                                </span>
                              </div>
                            } @else if (report.recursOn) {
                              <div class="pmo-report-card-owner">
                                <span class="pmo-report-card-label">Recurs on:</span>
                                <span class="pmo-report-card-value">{{ report.recursOn }}</span>
                              </div>
                            }

                            <div class="pmo-report-card-date">
                              <span class="pmo-report-card-label">Published on</span>
                              <span>{{ report.publishedOn }}</span>
                            </div>
                          </div>

                          <button
                            class="pmo-report-card-action"
                            type="button"
                            [attr.aria-label]="report.actionLabel + ' for ' + report.title"
                            (click)="openReportDrawer(report); $event.stopPropagation()"
                          >
                            <span>{{ report.actionLabel }}</span>
                            <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
                          </button>
                        </article>
                      }
                    } @else {
                      <div class="pmo-report-empty-filter">
                        <span pmConsoleIcon="calendar-days" aria-hidden="true"></span>
                        <p>No reports published on this date.</p>
                      </div>
                    }
                  </div>
                </section>
              }
            </div>
          </section>
          }
        </section>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-report-review-canvas {
        overflow: hidden;
        padding: 16px 24px 24px;
      }

      .pmo-report-review-page {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 16px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.08);
        display: grid;
        grid-template-rows: 108px minmax(0, 1fr);
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
      }

      .pmo-report-review-header {
        background:
          url('../assets/workspace-line-art.svg') right 3px top -40px / 858px 188px no-repeat,
          linear-gradient(90deg, #eef2ff 0%, #f0f2ff 56%, #eeeffc 100%),
          #eef2ff;
        border-bottom: 0;
        border-radius: 16px 16px 0 0;
        min-height: 108px;
        overflow: hidden;
        position: relative;
      }

      .pmo-report-title-group {
        align-items: center;
        display: flex;
        gap: 8px;
        left: 16px;
        min-width: 0;
        position: absolute;
        top: 17px;
        z-index: 2;
      }

      .pmo-report-title-group h1 {
        color: #0b0b0b;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
      }

      .pmo-report-back-button {
        align-items: center;
        border-radius: 6px;
        color: #828899;
        display: inline-flex;
        flex: 0 0 auto;
        height: 24px;
        justify-content: center;
        outline: none;
        transition:
          background var(--motion-fast) var(--motion-ease),
          color var(--motion-fast) var(--motion-ease);
        width: 24px;
      }

      .pmo-report-back-button:hover,
      .pmo-report-back-button:focus-visible {
        background: rgba(16, 6, 159, 0.08);
        color: #10069f;
      }

      .pmo-report-back-button .icon {
        height: 20px;
        width: 20px;
      }

      .pmo-report-tabs {
        align-items: flex-end;
        bottom: 0;
        display: flex;
        gap: 0;
        height: 44px;
        left: 16px;
        min-width: 0;
        position: absolute;
        z-index: 3;
      }

      .pmo-report-tabs button {
        align-items: center;
        border-radius: 8px 8px 0 0;
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
        position: relative;
        white-space: nowrap;
      }

      .pmo-report-tabs button .icon {
        height: 20px;
        width: 20px;
      }

      .pmo-report-tabs button.active {
        background: #ffffff;
        color: #10069f;
        z-index: 2;
      }

      .pmo-report-tabs button.active::before,
      .pmo-report-tabs button.active::after {
        background: #ffffff;
        bottom: 0;
        content: "";
        display: block;
        height: 14px;
        pointer-events: none;
        position: absolute;
        width: 14px;
      }

      .pmo-report-tabs button.active::before {
        background: radial-gradient(circle at left top, transparent 14px, #ffffff 14.5px);
        left: -14px;
      }

      .pmo-report-tabs button.active::after {
        background: radial-gradient(circle at right top, transparent 14px, #ffffff 14.5px);
        right: -14px;
      }

      .pmo-report-tabs button:focus-visible {
        outline: 2px solid rgba(16, 6, 159, 0.24);
        outline-offset: -2px;
      }

      .pmo-report-review-body {
        background: #ffffff;
        display: grid;
        gap: 16px;
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
        overflow: hidden;
        padding: 24px;
      }

      .pmo-report-toolbar {
        align-items: center;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-height: 42px;
        min-width: 0;
      }

      .pmo-report-toolbar h2 {
        color: #0b0b0b;
        flex: 1 1 auto;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        min-width: 0;
      }

      .pmo-report-actions {
        align-items: center;
        display: flex;
        flex: 0 0 auto;
        gap: 12px;
        justify-content: flex-end;
        min-width: 0;
      }

      .pmo-report-icon-button,
      .pmo-report-filter {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        color: #303645;
        display: inline-flex;
        height: 42px;
        outline: none;
      }

      .pmo-report-icon-button {
        color: #687182;
        flex: 0 0 42px;
        justify-content: center;
        width: 42px;
      }

      .pmo-report-icon-button .icon {
        height: 20px;
        width: 20px;
      }

      .pmo-report-date-filter {
        flex: 0 0 auto;
        position: relative;
      }

      .pmo-report-icon-button.is-active {
        background: rgba(16, 6, 159, 0.06);
        border-color: rgba(16, 6, 159, 0.3);
        color: #10069f;
      }

      .pmo-report-date-filter-menu {
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        box-shadow:
          0 1px 2px rgba(25, 33, 61, 0.05),
          0 14px 32px rgba(25, 33, 61, 0.14);
        display: grid;
        gap: 12px;
        min-width: 246px;
        padding: 12px;
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        z-index: 12;
      }

      .pmo-report-date-filter-field {
        color: #2f2f2f;
        display: grid;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        line-height: 16px;
      }

      .pmo-report-date-filter-field app-pm-console-date-field {
        font-size: 12px;
      }

      .pmo-report-date-filter-footer {
        align-items: center;
        border-top: 1px solid #edf0f6;
        color: #687182;
        display: flex;
        font-size: 11.5px;
        font-weight: 500;
        justify-content: space-between;
        line-height: 14px;
        min-width: 0;
        padding-top: 10px;
      }

      .pmo-report-date-filter-footer span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-report-date-filter-clear {
        border-radius: 6px;
        color: #10069f;
        flex: 0 0 auto;
        font-size: 11.5px;
        font-weight: 600;
        line-height: 14px;
        outline: none;
        padding: 4px 6px;
      }

      .pmo-report-date-filter-clear:disabled {
        color: #9ba3b2;
        cursor: not-allowed;
      }

      .pmo-report-date-filter-clear:not(:disabled):hover,
      .pmo-report-date-filter-clear:not(:disabled):focus-visible {
        background: rgba(16, 6, 159, 0.08);
      }

      .pmo-report-filter {
        gap: 7px;
        justify-content: flex-start;
        padding: 0 10px;
        width: 168px;
      }

      .pmo-report-filter > .icon:first-child {
        color: #10069f;
        height: 15px;
        width: 15px;
      }

      .pmo-report-filter > .icon:last-child {
        color: #8790a0;
        height: 13px;
        margin-left: auto;
        width: 13px;
      }

      .pmo-report-filter-label {
        color: #303645;
        font-size: 11.5px;
        font-weight: 500;
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-report-filter-count {
        align-items: center;
        background: #f0f2f7;
        border-radius: 999px;
        color: #596273;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10px;
        font-weight: 500;
        height: 18px;
        justify-content: center;
        line-height: 12px;
        min-width: 19px;
        padding: 0 5px;
      }

      .pmo-report-icon-button:hover,
      .pmo-report-icon-button:focus-visible,
      .pmo-report-filter:hover,
      .pmo-report-filter:focus-visible,
      .pmo-report-builder-button:hover,
      .pmo-report-builder-button:focus-visible {
        border-color: #d6d8df;
        box-shadow: 0 1px 2px rgba(25, 33, 61, 0.05);
      }

      .pmo-report-builder-button {
        align-items: center;
        background: #10069f;
        border: 1px solid #10069f;
        border-radius: 8px;
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 600;
        gap: 0;
        height: 40px;
        justify-content: center;
        line-height: 13.8px;
        outline: none;
        padding: 0 8px;
        white-space: nowrap;
        width: 127px;
      }

      .pmo-report-builder-button .icon {
        height: 20px;
        width: 20px;
      }

      .pmo-report-columns {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        height: auto;
        margin-top: 0;
        min-height: 0;
        min-width: 0;
      }

      .pmo-report-custom-columns {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-report-column {
        background: #f7f8fb;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        display: grid;
        grid-template-rows: 56px minmax(0, 1fr);
        min-height: 0;
        min-width: 0;
        overflow: hidden;
      }

      .pmo-report-column-header {
        align-items: center;
        border-bottom: 1px solid #e4e7ef;
        display: grid;
        gap: 9px;
        grid-template-columns: 34px minmax(0, 1fr) auto;
        min-width: 0;
        padding: 10px 20px 10px 18px;
      }

      .pmo-report-column-icon {
        align-items: center;
        background: #ffffff;
        border-radius: 6px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.12);
        color: #10069f;
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .pmo-report-column-icon .icon {
        height: 15px;
        width: 15px;
      }

      .pmo-report-column-header h3 {
        color: #2f2f2f;
        font-size: 13.5px;
        font-weight: 600;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-report-column-header strong {
        color: #252a34;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
      }

      .pmo-report-card-list {
        display: grid;
        gap: 18px;
        min-height: 0;
        overscroll-behavior: contain;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 14px 18px 18px;
        scrollbar-width: thin;
      }

      .pmo-report-custom-card-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-report-empty-filter {
        align-items: center;
        align-self: stretch;
        background: #ffffff;
        border: 1px dashed #dfe4ee;
        border-radius: 8px;
        color: #687182;
        display: grid;
        gap: 8px;
        grid-column: 1 / -1;
        justify-items: center;
        min-height: 132px;
        padding: 18px;
        text-align: center;
      }

      .pmo-report-empty-filter .icon {
        color: #10069f;
        height: 18px;
        width: 18px;
      }

      .pmo-report-empty-filter p {
        color: #687182;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        margin: 0;
      }

      .pmo-report-card {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(25, 33, 61, 0.05);
        display: grid;
        grid-template-rows: auto 40px 1fr;
        height: 166.5px;
        min-width: 0;
        overflow: hidden;
        padding: 16px 12px 0;
      }

      .pmo-report-card.is-clickable {
        cursor: pointer;
        transition:
          border-color var(--motion-fast) var(--motion-ease),
          box-shadow var(--motion-fast) var(--motion-ease);
      }

      .pmo-report-card.is-clickable:hover {
        border-color: #cfd5e2;
        box-shadow:
          0 1px 2px rgba(25, 33, 61, 0.05),
          0 8px 18px rgba(25, 33, 61, 0.08);
      }

      .pmo-report-custom-card {
        grid-template-rows: 40px 32px 1fr;
        height: 158.5px;
      }

      .pmo-report-card h4 {
        color: #0b0b0b;
        font-size: 14.5px;
        font-weight: 600;
        line-height: 19.575px;
        margin: 0;
        min-height: 40px;
      }

      .pmo-report-card-meta {
        align-items: start;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
        margin-top: 16px;
        min-width: 0;
      }

      .pmo-report-card-owner,
      .pmo-report-card-date,
      .pmo-report-card-person {
        min-width: 0;
      }

      .pmo-report-card-owner,
      .pmo-report-card-date {
        display: grid;
        gap: 4px;
      }

      .pmo-report-card-date {
        justify-items: end;
        text-align: right;
      }

      .pmo-report-card-label {
        color: #687182;
        font-size: 10px;
        font-style: italic;
        font-weight: 400;
        line-height: 13.8px;
      }

      .pmo-report-card-person {
        align-items: center;
        color: #687182;
        display: flex;
        font-size: 11.5px;
        font-weight: 500;
        gap: 6px;
        line-height: 13.8px;
      }

      .pmo-report-card-value {
        color: #687182;
        font-size: 11.5px;
        font-weight: 500;
        line-height: 13.8px;
      }

      .pmo-report-avatar {
        align-items: center;
        background: rgba(16, 6, 159, 0.07);
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 9px;
        font-weight: 600;
        height: 22px;
        justify-content: center;
        line-height: 10px;
        width: 23px;
      }

      .pmo-report-card-date > span:last-child {
        color: #687182;
        font-size: 11.5px;
        font-weight: 500;
        line-height: 13.8px;
      }

      .pmo-report-custom-card .pmo-report-card-meta {
        grid-template-columns: minmax(0, 1fr) auto;
        margin-top: 16px;
      }

      .pmo-report-card-meta.is-date-only {
        grid-template-columns: minmax(0, 1fr);
      }

      .pmo-report-card-meta.is-date-only .pmo-report-card-date {
        justify-items: start;
        text-align: left;
      }

      .pmo-report-custom-card .pmo-report-card-action {
        height: 38.5px;
      }

      .pmo-report-card-action {
        align-items: center;
        align-self: end;
        border-top: 1px solid #dddddd;
        color: #10069f;
        display: inline-flex;
        font-size: 11.5px;
        font-weight: 600;
        gap: 2px;
        height: 38.5px;
        justify-content: flex-end;
        line-height: 14px;
        outline: none;
        padding: 0 8px 0 0;
        text-align: right;
        width: 100%;
      }

      .pmo-report-card-action .icon {
        height: 15px;
        width: 15px;
      }

      .pmo-report-card-action:focus-visible {
        outline: 2px solid rgba(16, 6, 159, 0.22);
        outline-offset: -3px;
      }

      @media (max-width: 1180px) {
        .pmo-report-review-canvas {
          overflow: auto;
          padding: 14px 16px 20px;
        }

        .pmo-report-review-page {
          min-height: 706px;
        }

        .pmo-report-review-body {
          overflow-x: auto;
        }

        .pmo-report-columns {
          grid-template-columns: repeat(3, 414px);
          min-width: 1282px;
        }

        .pmo-report-custom-columns {
          grid-template-columns: repeat(2, 631px);
        }
      }

      @media (max-width: 760px) {
        .pmo-report-review-canvas {
          padding: 12px;
        }

        .pmo-report-review-header {
          min-height: 132px;
        }

        .pmo-report-review-page {
          grid-template-rows: 132px minmax(0, 1fr);
        }

        .pmo-report-tabs {
          left: 12px;
          max-width: calc(100% - 24px);
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .pmo-report-toolbar {
          align-items: flex-start;
          flex-direction: column;
        }

        .pmo-report-actions {
          flex-wrap: wrap;
          justify-content: flex-start;
          width: 100%;
        }

        .pmo-report-filter {
          flex: 1 1 168px;
        }

        .pmo-report-date-filter-menu {
          left: 0;
          min-width: 0;
          right: auto;
          width: min(246px, calc(100vw - 56px));
        }

        .pmo-report-review-body {
          overflow: auto;
          padding: 18px 16px;
        }

        .pmo-report-columns {
          grid-template-columns: minmax(0, 1fr);
          height: auto;
          min-width: 0;
        }

        .pmo-report-custom-card-list {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-report-column {
          min-height: 486px;
        }
      }
    `,
  ],
})
export class PmoReportReviewProgressComponent {
  @Output() readonly backSelected = new EventEmitter<void>();
  @Output() readonly reportDrawerRequested = new EventEmitter<PmoReportReviewCard>();
  @Output() readonly reportBuilderRequested = new EventEmitter<void>();

  readonly tabs = pmoReportReviewTabs;
  readonly filters = pmoReportReviewFilters;
  readonly columns = pmoReportReviewColumns;
  readonly customColumns = pmoReportReviewCustomColumns;

  activeTabId: PmoReportReviewTabId = 'standard';
  showDateFilterMenu = false;
  selectedPublishedDateFilter = '';

  get reportHeading(): string {
    return this.activeTabId === 'custom' ? 'Custom Reports' : 'Reports';
  }

  get visibleColumns(): readonly PmoReportReviewColumn[] {
    const columns = this.activeTabId === 'custom' ? this.customColumns : this.columns;
    if (!this.selectedPublishedDateFilter) return columns;

    return columns.map((column) => {
      const reports = column.reports.filter((report) => report.publishedOn === this.selectedPublishedDateFilter);
      return {
        ...column,
        count: reports.length,
        reports,
      };
    });
  }

  get dateFilterSummary(): string {
    return this.selectedPublishedDateFilter ? `Showing ${this.selectedPublishedDateFilter}` : 'All published dates';
  }

  setActiveTab(tabId: string): void {
    if (!isPmoReportReviewTabId(tabId) || this.activeTabId === tabId) return;
    this.activeTabId = tabId;
  }

  toggleDateFilterMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showDateFilterMenu = !this.showDateFilterMenu;
  }

  setPublishedDateFilter(value: string): void {
    this.selectedPublishedDateFilter = value;
  }

  clearPublishedDateFilter(): void {
    this.selectedPublishedDateFilter = '';
  }

  openReportDrawer(report: PmoReportReviewCard): void {
    if (this.activeTabId !== 'standard') return;
    this.reportDrawerRequested.emit(report);
  }

  @HostListener('document:click')
  closeDateFilterMenu(): void {
    this.showDateFilterMenu = false;
  }
}
