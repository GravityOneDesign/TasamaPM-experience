import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface PmConsoleReportingTrendPoint {
  label: string;
  status: string;
}

export interface PmConsoleReportingTrendRow {
  project: string;
  dueLabel: string;
  dueTone: string;
  trend: PmConsoleReportingTrendPoint[];
  statusLabel?: string;
  statusTone?: string;
  actionLabel?: string;
  actionIcon?: string;
  footerLabel?: string;
}

@Component({
  selector: 'app-pm-console-reporting-trends',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: flex;
        flex: 0 0 auto;
        min-width: 0;
      }

      :host-context(.portfolio-frontdoor) {
        flex: 1 1 auto;
        min-height: 0;
      }

      .pm-reporting-trend-widget {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 16px;
        box-shadow: 0 1px 2px rgba(1, 10, 15, 0.04);
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 16px;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
        padding: 15px;
        width: 100%;
      }

      .pm-reporting-trends__head {
        flex: 0 0 auto;
        align-items: flex-start;
        display: flex;
        justify-content: space-between;
        min-width: 0;
      }

      .pm-reporting-trends__head h2 {
        color: #252a34;
        font-size: var(--console-fluid-md, 16px);
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .pm-reporting-trends__head small {
        color: #687182;
        display: block;
        font-size: var(--console-fluid-xs, 12px);
        font-weight: 400;
        line-height: 16px;
        margin-top: 0;
      }

      .pm-reporting-trends__list {
        align-content: start;
        display: grid;
        flex: 1 1 auto;
        gap: 16px;
        min-height: 0;
        min-width: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding-right: 2px;
        scrollbar-width: thin;
      }

      .pm-reporting-trends__card {
        --report-border: #dfe4ee;
        --report-chip-bg: rgba(104, 113, 130, 0.09);
        --report-chip-text: #687182;
        background: #ffffff;
        border: 1px solid var(--report-border);
        border-radius: 12px;
        box-shadow: 0 1px 1px rgba(1, 10, 15, 0.04);
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 114px;
        min-width: 0;
        overflow: hidden;
        padding: 13px;
        position: relative;
      }

      .pm-reporting-trends__card.red {
        --report-border: #ffbdbd;
        --report-chip-bg: rgba(185, 28, 28, 0.1);
        --report-chip-text: #b91c1c;
      }

      .pm-reporting-trends__card.green {
        --report-border: #74bc9e;
        --report-chip-bg: rgba(34, 160, 107, 0.1);
        --report-chip-text: #15803d;
      }

      .pm-reporting-trends__card.amber {
        --report-border: #ffbd8c;
        --report-chip-bg: rgba(232, 119, 34, 0.1);
        --report-chip-text: #e87722;
      }

      .pm-reporting-trends__row-head {
        min-height: 20px;
        min-width: 0;
        padding-right: 64px;
      }

      .pm-reporting-trends__row-head strong {
        color: #0b0b0b;
        display: block;
        font-size: 13px;
        font-weight: 600;
        line-height: 20px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-reporting-trends__status {
        align-items: center;
        background: var(--report-chip-bg);
        border-radius: 0 0 0 12px;
        color: var(--report-chip-text);
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        height: 20px;
        line-height: 12px;
        max-width: 116px;
        padding: 4px 8px;
        position: absolute;
        right: -1px;
        top: -1px;
        white-space: nowrap;
      }

      .pm-reporting-trends__trend {
        align-items: center;
        background: #ffffff;
        border: 1px solid rgba(223, 228, 238, 0.86);
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(25, 33, 61, 0.04);
        display: grid;
        grid-template-columns: repeat(var(--report-trend-count), minmax(0, 1fr));
        min-height: 34px;
        min-width: 0;
        overflow: hidden;
      }

      .pm-reporting-trends__point {
        align-items: center;
        display: flex;
        gap: 4px;
        justify-content: center;
        min-height: 32px;
        min-width: 0;
        padding: 8px;
        position: relative;
      }

      .pm-reporting-trends__point:not(:last-child)::after {
        background: #e4e4e4;
        content: '';
        height: 16px;
        position: absolute;
        right: 0;
        top: 8px;
        width: 1px;
      }

      .pm-reporting-trends__point-icon {
        align-items: center;
        color: #22a06b;
        display: inline-flex;
        flex: 0 0 auto;
        height: 16px;
        justify-content: center;
        width: 16px;
      }

      .pm-reporting-trends__point-icon.alert {
        color: #e87722;
      }

      .pm-reporting-trends__point-icon.off-track {
        color: #e05252;
      }

      .pm-reporting-trends__point-icon.not-created {
        color: #974780;
      }

      .pm-reporting-trends__point-icon .icon {
        height: 16px;
        width: 16px;
      }

      .pm-reporting-trends__point small {
        color: #404040;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-reporting-trends__point.not-created small {
        color: #974780;
      }

      .pm-reporting-trends__foot {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: space-between;
        min-width: 0;
      }

      .pm-reporting-trends__due {
        color: #595959;
        flex: 1 1 auto;
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-reporting-trends__action {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 500;
        gap: 4px;
        height: 16px;
        justify-content: center;
        line-height: 16px;
        padding: 0;
      }

      .pm-reporting-trends__action .icon {
        height: 16px;
        width: 16px;
      }

      .pm-reporting-trends__action.preview .icon {
        height: 20px;
        width: 20px;
      }

      .pm-reporting-trends__action:hover,
      .pm-reporting-trends__action:focus-visible {
        background: transparent;
        color: #1b10bd;
        outline: 2px solid rgba(16, 6, 159, 0.18);
        outline-offset: 3px;
      }

      .pm-reporting-trends__empty {
        align-items: center;
        border: 1px dashed rgba(223, 228, 238, 0.86);
        border-radius: 12px;
        color: #687182;
        display: flex;
        font-size: 12px;
        justify-content: center;
        line-height: 16px;
        min-height: 96px;
        padding: 16px;
        text-align: center;
      }

      @container pm-console-right-rail (max-width: 286px) {
        .pm-reporting-trends__row-head {
          padding-right: 64px;
        }

        .pm-reporting-trends__point {
          padding-inline: 5px;
        }

        .pm-reporting-trends__point small,
        .pm-reporting-trends__action {
          font-size: 11px;
        }
      }
    `,
  ],
  template: `
    <section class="side-card report-widget pm-reporting-trend-widget" [class.portfolio-report-widget]="portfolio" data-tour-target="right-report-widget">
      <div class="report-widget-head pm-reporting-trends__head">
        <div>
          <h2>{{ title }}</h2>
          <small>{{ subtitle }}</small>
        </div>
      </div>

      <div class="report-trend-list pm-reporting-trends__list">
        @for (report of rows; track report.project) {
          <article class="report-trend-row pm-reporting-trends__card {{ reportTone(report) }}">
            <div class="report-trend-row-head pm-reporting-trends__row-head">
              <strong>{{ report.project }}</strong>
              <span class="report-health-chip pm-reporting-trends__status {{ reportTone(report) }}">{{ reportStatusLabel(report) }}</span>
            </div>

            <div class="report-trend pm-reporting-trends__trend" [style.--report-trend-count]="report.trend.length" aria-label="Status report trend">
              @for (point of report.trend; track point.label) {
                <span class="report-trend-point pm-reporting-trends__point {{ reportStatusTone(point.status) }}">
                  <span class="report-status-icon pm-reporting-trends__point-icon {{ reportStatusTone(point.status) }}" aria-hidden="true">
                    <span [pmConsoleIcon]="reportStatusIcon(point.status)"></span>
                  </span>
                  <small>{{ point.label }}</small>
                </span>
              }
            </div>

            <div class="report-trend-row-foot pm-reporting-trends__foot">
              <span class="report-row-due pm-reporting-trends__due">{{ reportFooterLabel(report) }}</span>
              <button
                class="report-row-create pm-reporting-trends__action {{ reportActionClass(report) }}"
                type="button"
                [attr.aria-label]="reportActionLabel(report) + ' report for ' + report.project"
                (click)="reportAction.emit(report.project)"
              >
                <span [pmConsoleIcon]="reportActionIcon(report)"></span>
                <span>{{ reportActionLabel(report) }}</span>
              </button>
            </div>
          </article>
        } @empty {
          <p class="pm-reporting-trends__empty">No reporting trends available.</p>
        }
      </div>
    </section>
  `,
})
export class PmConsoleReportingTrendsComponent {
  @Input() rows: PmConsoleReportingTrendRow[] = [];
  @Input() title = 'Reporting trends';
  @Input() subtitle = 'Last 3 PSR statuses';
  @Input() portfolio = false;
  @Output() reportAction = new EventEmitter<string>();

  reportTone(report: PmConsoleReportingTrendRow): string {
    return report.statusTone || report.dueTone || 'neutral';
  }

  reportStatusLabel(report: PmConsoleReportingTrendRow): string {
    if (report.statusLabel) return report.statusLabel;

    const tone = this.reportTone(report);
    if (tone === 'red') return 'Off track';
    if (tone === 'amber') return 'Alert';
    if (tone === 'green') return 'On track';
    return 'Review';
  }

  reportFooterLabel(report: PmConsoleReportingTrendRow): string {
    if (report.footerLabel) return report.footerLabel;
    return report.dueLabel === 'Overdue 5 days' ? 'Overdue by 5 days' : report.dueLabel;
  }

  reportActionLabel(report: PmConsoleReportingTrendRow): string {
    return report.actionLabel || 'Create';
  }

  reportActionIcon(report: PmConsoleReportingTrendRow): string {
    if (report.actionIcon) return report.actionIcon;
    return this.reportActionLabel(report) === 'Preview' ? 'eye' : 'file-text';
  }

  reportActionClass(report: PmConsoleReportingTrendRow): string {
    return this.reportActionLabel(report).toLowerCase();
  }

  reportStatusTone(status: string): string {
    if (status === 'missed' || status === 'overdue') return 'off-track';
    if (status === 'not-created' || status === 'planned') return 'not-created';
    if (status === 'due' || status === 'attention' || status === 'draft') return 'alert';
    return 'on-track';
  }

  reportStatusIcon(status: string): string {
    const tone = this.reportStatusTone(status);
    if (tone === 'off-track') return 'circle-x';
    if (tone === 'not-created') return 'hourglass';
    if (tone === 'alert') return 'triangle-alert';
    return 'circle-check';
  }
}
