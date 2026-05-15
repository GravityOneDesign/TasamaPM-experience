import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconService } from './pm-console-icon.service';

type ReportDetailMode = 'simple' | 'detailed';

interface ReportCreationDetailInput {
  intervalStart: string;
  intervalEnd: string;
  intervalStatus: string;
  stage: string;
  state: string;
  overallTrend: string;
}

interface ReportStatusOption {
  label: string;
  simpleLabel?: string;
  value: string;
  tone: string;
  icon: string;
}

interface ReportTrendOption {
  label: string;
  value: string;
  tone: string;
  icon: string;
}

interface ReportTimelinePoint {
  date: string;
  tone: string;
  label: string;
}

interface ReportDrawerCard {
  id: string;
  title: string;
  body: string;
  icon: string;
  status: string;
  tone: string;
  trend: string;
  comments: string;
  timeline: ReportTimelinePoint[];
}

interface ReportOverviewField {
  label: string;
  hint: string;
  value: string;
  rows: number;
}

interface ScopeProduct {
  title: string;
  icon?: string;
  type: string;
  owner: string;
  ownerInitials?: string;
  capability: string;
  dates: string;
  budget: string;
  status: string;
  actualStart: string;
  actualEnd: string;
  completed: string;
}

interface ReportDetailMetric {
  label: string;
  value: string;
}

interface ReportNotice {
  text: string;
  tone: string;
  icon?: string;
}

interface ReportSummaryRow {
  label: string;
  value?: string;
  tone?: string;
  chip?: boolean;
  dividerBefore?: boolean;
}

interface ReportSummaryCard {
  title: string;
  rows: ReportSummaryRow[];
  wide?: boolean;
  notice?: ReportNotice;
}

interface ReportSummaryGroup {
  title: string;
  cards: ReportSummaryCard[];
}

interface ReportSectionAction {
  label: string;
  icon?: string;
}

interface ReportTableColumn {
  key: string;
  label: string;
  width: number;
  align?: 'left' | 'center';
}

interface ReportTableCell {
  type: 'checkbox' | 'text' | 'person' | 'chip' | 'dateInput' | 'select' | 'iconBadge';
  value?: string;
  checked?: boolean;
  initials?: string;
  tone?: string;
  icon?: string;
  clampLines?: number;
  options?: string[];
}

interface ReportTableRow {
  id: string;
  cells: Record<string, ReportTableCell>;
}

interface ReportTableSelectFilter {
  label: string;
  value: string;
  options?: string[];
}

interface ReportTableRadioOption {
  label: string;
  value: string;
  checked?: boolean;
}

interface ReportTableRadioFilter {
  label: string;
  options: ReportTableRadioOption[];
}

interface ReportTableBlock {
  id: string;
  title: string;
  minWidth: number;
  selectorLabel?: string;
  hideHeader?: boolean;
  selectFilters?: ReportTableSelectFilter[];
  radioFilter?: ReportTableRadioFilter;
  columns: ReportTableColumn[];
  rows: ReportTableRow[];
  actions?: ReportSectionAction[];
}

interface ReportRecordField {
  label: string;
  value?: string;
  type?: 'text' | 'person';
  initials?: string;
  wide?: boolean;
}

interface ReportRecordItem {
  id: string;
  selected?: boolean;
  idLabel: string;
  idValue: string;
  status?: string;
  statusTone?: string;
  priorityLabel?: string;
  priorityTone?: string;
  fields: ReportRecordField[];
}

interface ReportRecordBlock {
  id: string;
  addLabel?: string;
  filters?: ReportTableSelectFilter[];
  items: ReportRecordItem[];
}

interface ReportSectionDetail {
  icon?: string;
  metrics?: ReportDetailMetric[];
  summaryGroups?: ReportSummaryGroup[];
  recordBlocks?: ReportRecordBlock[];
  tables?: ReportTableBlock[];
}

interface ReportDetailItem {
  title: string;
  body: string;
  icon: string;
  status: string;
  tone: string;
  meta: string;
  owner: string;
  progressLabel: string;
  progressValue: string;
  comment: string;
}

const reportIconMap: Record<string, string> = {
  alert: 'triangle-alert',
  arrowDown: 'arrow-down',
  arrowUp: 'arrow-up',
  benefit: 'thumbs-up',
  benefitGraph: 'chart-pie',
  bell: 'bell',
  calendar: 'calendar-days',
  calendarSearch: 'calendar-search',
  chart: 'chart-column',
  checkMark: 'check',
  checkCircle: 'circle-check',
  close: 'x',
  closeCircle: 'circle-x',
  database: 'database',
  dependencies: 'network',
  dollar: 'hand-coins',
  endProduct: 'package',
  info: 'info',
  issues: 'circle-x',
  link: 'link-2',
  management: 'file-text',
  milestone: 'flag',
  minusCircle: 'circle-minus',
  resources: 'book-open',
  risks: 'shield-alert',
  route: 'route',
  stageGate: 'clipboard-check',
  store: 'store',
  telescope: 'telescope',
};

@Component({
  selector: 'app-pm-console-report-drawer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (details; as reportDetails) {
      <div class="report-drawer-shell" aria-live="polite">
        <button class="report-drawer-backdrop" type="button" (click)="close.emit()" aria-label="Close report drawer"></button>
        <aside class="report-drawer report-drawer-create" [attr.aria-label]="projectName + ' report draft'">
          <form class="report-compose-form" (submit)="save.emit($event)">
            <header class="report-drawer-top report-drawer-top-simple">
              <div class="report-simple-header">
                <div class="report-simple-header-row">
                  <div class="report-drawer-title report-simple-title-line">
                    <h2>Project Report</h2>
                    <span aria-hidden="true">|</span>
                    <p>{{ projectName }}</p>
                  </div>

                  <div class="report-simple-header-meta">
                    <div class="report-simple-meta">
                      <span>Stage: <strong class="report-simple-chip indigo">{{ reportDetails.stage }}</strong></span>
                      <span>State: <strong class="report-simple-chip {{ reportBadgeTone(reportDetails.state, 'neutral') }}">{{ reportDetails.state }}</strong></span>
                      <span>Plan: <strong class="report-simple-chip {{ planChipTone(reportDetails) }}">{{ planLabel(reportDetails) }}</strong></span>
                    </div>
                    <div class="report-top-actions">
                      <button class="report-top-icon-button" type="button" aria-label="Expand report drawer">
                        <span class="icon" aria-hidden="true"><i data-lucide="maximize-2"></i></span>
                      </button>
                      <button class="report-top-icon-button" type="button" (click)="close.emit()" aria-label="Close drawer">
                        <span class="icon" aria-hidden="true"><i data-lucide="x"></i></span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="report-simple-toolbar">
                  <div class="report-simple-toolbar-copy">
                    <span>Reporting Interval: <strong>{{ intervalLabel(reportDetails) }}</strong></span>
                    <span>Report Status: <strong class="report-simple-chip report-status-inline-chip {{ statusChipTone(reportDetails) }}">{{ planLabel(reportDetails) }}</strong></span>
                  </div>
                  <div class="report-simple-mode-tabs" [class.is-detailed]="activeMode === 'detailed'" role="tablist" aria-label="Report view">
                    <button [class.active]="activeMode === 'simple'" type="button" [attr.aria-selected]="activeMode === 'simple'" role="tab" (click)="modeChange.emit('simple')">Simple view</button>
                    <button [class.active]="activeMode === 'detailed'" type="button" [attr.aria-selected]="activeMode === 'detailed'" role="tab" (click)="modeChange.emit('detailed')">Detailed view</button>
                  </div>
                </div>
              </div>
            </header>

            <div class="report-drawer-body" [class.report-drawer-body-detailed]="activeMode === 'detailed'">
              @if (activeMode === 'simple') {
                <section class="report-layout-stack report-simple-card-stack" aria-label="Simple project plan report">
                  @if (overviewCard; as card) {
                    <ng-container [ngTemplateOutlet]="simpleReportCard" [ngTemplateOutletContext]="{ card: card, index: 'overview', isOverview: true }"></ng-container>
                  }

                  @for (card of simpleCards; track card.id; let cardIndex = $index) {
                    <ng-container [ngTemplateOutlet]="simpleReportCard" [ngTemplateOutletContext]="{ card: card, index: cardIndex, isOverview: false }"></ng-container>
                  }
                </section>
              } @else {
                <div class="report-detailed-workspace">
                  <nav class="report-section-nav" aria-label="Report sections" role="tablist">
                    @for (section of reportSections; track section) {
                      <button
                        type="button"
                        [class.active]="activeSection === section"
                        [attr.aria-selected]="activeSection === section"
                        (click)="sectionChange.emit(section)"
                        role="tab"
                      >
                        <span class="report-section-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="reportSectionIcon(section)"></i></span></span>
                        <span class="report-section-name">{{ section }}</span>
                        <span class="report-section-fill" [class.complete]="section === 'Overview'" [class.current]="section === activeSection" [class.partial]="section !== 'Overview' && section !== activeSection" aria-hidden="true"></span>
                      </button>
                    }
                  </nav>

                  <div class="report-detailed-main">
                    @for (card of detailedCards; track card.id) {
                      <section class="report-detailed-tab-panel" [hidden]="activeSection !== card.title" role="tabpanel">
                        <div class="report-detailed-section-bar">
                          <div class="report-simple-title-area">
                            <span class="report-simple-card-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="reportSectionIcon(card.title)"></i></span></span>
                            <div class="report-simple-section-title">
                              <h3>{{ card.title }}</h3>
                              <span class="icon" aria-hidden="true"><i data-lucide="info"></i></span>
                            </div>
                          </div>
                          <div class="report-simple-history" [attr.aria-label]="card.title + ' past statuses'">
                            @for (point of card.timeline; track point.date + point.tone + $index) {
                              <span class="{{ point.tone }}" [title]="point.label"><span class="report-simple-history-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></span><small>{{ point.date }}</small></span>
                            }
                          </div>
                        </div>

                        <div class="report-detailed-content">
                          <article class="report-layout-card report-simple-card report-detailed-summary-card {{ card.tone }}">
                            <div class="report-simple-control-row">
                              <div class="report-simple-field">
                                <span class="report-simple-field-label">Status<small>*</small></span>
                                <div class="report-simple-status-control" role="radiogroup" [attr.aria-label]="card.title + ' detailed status'">
                                  @for (option of statusOptions; track option.label) {
                                    <label class="{{ option.tone }}"><input type="radio" [attr.name]="'detailed-card-status-' + card.id" [checked]="isReportStatusSelected(option.value, card.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                                  }
                                </div>
                              </div>
                              <div class="report-simple-field">
                                <span class="report-simple-field-label">Overall Status Trend</span>
                                <div class="report-simple-trend-control" role="radiogroup" [attr.aria-label]="card.title + ' detailed trend'">
                                  @for (option of trendOptions; track option.value) {
                                    <label class="{{ option.tone }}"><input type="radio" [attr.name]="'detailed-card-trend-' + card.id" [checked]="isReportTrendSelected(option.value, card.trend)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="option.icon"></i></span>{{ option.label }}</span></label>
                                  }
                                </div>
                              </div>
                            </div>

                            <label class="report-layout-comment">
                              <span>Comments</span>
                              <textarea rows="3" maxlength="3000" placeholder="Add the comments here..." [value]="card.comments"></textarea>
                            </label>
                          </article>

                          @if (card.title === 'Overview') {
                            <section class="report-detail-record-section" aria-label="Overview narrative updates">
                              <div class="report-detail-section-head">
                                <div><strong>Narrative updates</strong><span>Capture the longer report text for this period.</span></div>
                              </div>
                              <div class="report-detail-narrative-grid">
                                @for (field of overviewFields; track field.label) {
                                  <label class="report-layout-field">
                                    <span>{{ field.label }} @if (field.hint) { <small>{{ field.hint }}</small> }</span>
                                    <textarea [rows]="field.rows" maxlength="3000" [value]="field.value"></textarea>
                                  </label>
                                }
                              </div>
                            </section>
                          } @else if (card.title === 'Scope') {
                            <section class="report-detail-record-section report-detail-scope-section" aria-label="Scope end products">
                              <article class="report-detail-group-card scope-report-group-card">
                                <div class="report-detail-group-head scope-report-group-head">
                                  <div class="report-detail-group-title scope-report-group-title"><strong>End Product</strong><span aria-hidden="true">|</span><small>{{ scopeProducts.length }} items</small></div>
                                  <button class="report-detail-add-toggle scope-report-add-toggle" type="button" aria-pressed="true">
                                    <span class="scope-report-toggle" aria-hidden="true"><span class="icon"><i data-lucide="x"></i></span></span>
                                    <span>Add to report</span>
                                    <span class="icon" aria-hidden="true"><i data-lucide="chevron-up"></i></span>
                                  </button>
                                </div>
                                <div class="scope-product-list">
                                  @for (product of scopeProducts; track product.title) {
                                    <article class="scope-product-card">
                                      <div class="scope-product-checkline">
                                        <span class="scope-report-checkbox is-checked" aria-hidden="true"><span class="icon"><i data-lucide="check"></i></span></span>
                                        <strong>{{ product.title }}</strong>
                                      </div>

                                      <div class="scope-product-grid">
                                        <span><small>Type</small><strong>{{ product.type }}</strong></span>
                                        <span><small>Product owner</small><strong class="scope-owner-value"><span class="scope-owner-avatar">{{ ownerInitials(product) }}</span>{{ product.owner }}</strong></span>
                                        <span><small>Capability</small><strong>{{ product.capability }}</strong></span>
                                        <span><small>Start - end date</small><strong>{{ product.dates }}</strong></span>
                                        <span><small>Budget</small><strong>{{ product.budget }}</strong></span>
                                      </div>

                                      <div class="scope-product-controls">
                                        <label class="scope-product-field scope-product-field-select">
                                          <span>Report status</span>
                                          <span class="scope-field-control scope-field-control-select">
                                            <select [attr.aria-label]="'Report status for ' + product.title">
                                              <option>{{ product.status || 'Not started' }}</option>
                                              <option>On track</option>
                                              <option>Alert</option>
                                              <option>Off track</option>
                                            </select>
                                            <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                          </span>
                                        </label>
                                        <label class="scope-product-field">
                                          <span>Actual start</span>
                                          <span class="scope-field-control scope-field-control-input"><input type="text" [value]="product.actualStart" /><span class="icon" aria-hidden="true"><i data-lucide="calendar-days"></i></span></span>
                                        </label>
                                        <label class="scope-product-field">
                                          <span>Actual end</span>
                                          <span class="scope-field-control scope-field-control-input"><input type="text" [value]="product.actualEnd" /><span class="icon" aria-hidden="true"><i data-lucide="calendar-days"></i></span></span>
                                        </label>
                                        <label class="scope-product-field scope-product-field-completed">
                                          <span>Completed</span>
                                          <span class="scope-percent-input"><input type="text" [value]="product.completed" /><span>%</span></span>
                                        </label>
                                      </div>
                                    </article>
                                  }
                                </div>
                              </article>
                            </section>
                          } @else if (sectionDetail(card.title); as detail) {
                            @if (hasSectionDetailContent(detail)) {
                              <section class="report-detail-record-section" [attr.aria-label]="card.title + ' detail content'">
                                @if (detail.metrics?.length) {
                                  <article class="report-detail-metric-strip">
                                    @if (detail.icon) {
                                      <span class="report-detail-metric-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(detail.icon)"></i></span></span>
                                    }
                                    <div class="report-detail-metric-grid">
                                      @for (metric of detail.metrics; track metric.label) {
                                        <span class="report-detail-metric">
                                          <small>{{ metric.label }}</small>
                                          <strong>{{ metric.value }}</strong>
                                        </span>
                                      }
                                    </div>
                                  </article>
                                }

                                @for (group of detail.summaryGroups || []; track group.title) {
                                  <article class="report-detail-group-card report-summary-group-card">
                                    <div class="report-detail-group-head">
                                      <div class="report-detail-group-title">
                                        <strong>{{ group.title }}</strong>
                                        <span class="icon report-table-title-info" aria-hidden="true"><i data-lucide="info"></i></span>
                                      </div>
                                      <button class="report-table-collapse" type="button" [attr.aria-label]="'Collapse ' + group.title">
                                        <span class="icon" aria-hidden="true"><i data-lucide="chevron-up"></i></span>
                                      </button>
                                    </div>

                                    <div class="report-summary-card-grid">
                                      @for (summary of group.cards; track summary.title) {
                                        <article class="report-summary-card" [class.wide]="summary.wide">
                                          <div class="report-summary-card-title">{{ summary.title }}</div>
                                          <div class="report-summary-card-body">
                                            @for (row of summary.rows; track row.label + $index) {
                                              <div class="report-summary-row" [class.divider-before]="row.dividerBefore" [class.is-chip]="row.chip">
                                                @if (row.chip) {
                                                  <span class="report-summary-chip {{ row.tone || 'indigo' }}">{{ row.label }}</span>
                                                } @else {
                                                  <span>{{ row.label }}</span>
                                                  <strong class="{{ row.tone || 'neutral' }}">{{ row.value || '-' }}</strong>
                                                }
                                              </div>
                                            }
                                            @if (summary.notice) {
                                              <div class="report-summary-notice {{ summary.notice.tone || 'amber' }}">
                                                <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(summary.notice.icon || 'info')"></i></span>
                                                <span>{{ summary.notice.text }}</span>
                                              </div>
                                            }
                                          </div>
                                        </article>
                                      }
                                    </div>
                                  </article>
                                }

                                @for (block of detail.recordBlocks || []; track block.id) {
                                  <article class="report-detail-group-card report-record-list-card">
                                    @if (block.filters?.length) {
                                      <div class="report-record-filter-grid">
                                        @for (filter of block.filters || []; track filter.label) {
                                          <label class="report-record-filter-field">
                                            <span>{{ filter.label }}</span>
                                            <span class="report-table-input report-table-select">
                                              <select [attr.aria-label]="filter.label">
                                                <option>{{ filter.value }}</option>
                                                @for (option of filter.options || []; track option) {
                                                  @if (option !== filter.value) { <option>{{ option }}</option> }
                                                }
                                              </select>
                                              <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                            </span>
                                          </label>
                                        }
                                      </div>
                                    }

                                    <div class="report-record-add-panel">
                                      <div class="report-record-toggle-row">
                                        <span class="report-record-toggle is-on" aria-hidden="true">
                                          <span class="report-record-toggle-handle"><span class="icon"><i data-lucide="check"></i></span></span>
                                        </span>
                                        <span>{{ block.addLabel || 'Add to report' }}</span>
                                      </div>

                                      @for (record of block.items; track record.id) {
                                        <article class="report-record-card">
                                          @if (record.priorityLabel) {
                                            <span class="report-record-priority {{ record.priorityTone || 'amber' }}">{{ record.priorityLabel }}</span>
                                          }
                                          <div class="report-record-card-head">
                                            <span class="report-table-checkbox" [class.is-checked]="record.selected" aria-hidden="true"><span class="icon"><i data-lucide="check"></i></span></span>
                                            <strong>{{ record.idLabel }}: {{ record.idValue }}</strong>
                                            @if (record.status) {
                                              <span class="report-table-chip {{ record.statusTone || 'indigo' }}">{{ record.status }}</span>
                                            }
                                          </div>

                                          <div class="report-record-fields">
                                            @for (field of record.fields; track field.label + $index) {
                                              <div class="report-record-field" [class.wide]="field.wide">
                                                <span>{{ field.label }}</span>
                                                @if (field.type === 'person') {
                                                  <span class="report-table-person">
                                                    @if (field.initials) { <span class="report-table-avatar">{{ field.initials }}</span> }
                                                    <strong>{{ field.value || '-' }}</strong>
                                                  </span>
                                                } @else {
                                                  <strong>{{ field.value || '-' }}</strong>
                                                }
                                              </div>
                                            }
                                          </div>
                                        </article>
                                      }
                                    </div>
                                  </article>
                                }

                                @for (block of detail.tables || []; track block.id) {
                                  <article class="report-detail-group-card report-detail-table-card" [class.headerless]="block.hideHeader">
                                    @if (!block.hideHeader) {
                                      <div class="report-detail-group-head report-table-card-head">
                                        <div class="report-detail-group-title">
                                          <strong>{{ block.title }}</strong>
                                          <span class="icon report-table-title-info" aria-hidden="true"><i data-lucide="info"></i></span>
                                        </div>
                                        <button class="report-table-collapse" type="button" [attr.aria-label]="'Collapse ' + block.title">
                                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-up"></i></span>
                                        </button>
                                      </div>
                                    }

                                    @if (block.selectorLabel) {
                                      <button class="report-table-filter-chip" type="button">
                                        <span>{{ block.selectorLabel }}</span>
                                        <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                      </button>
                                    }

                                    @if (block.selectFilters?.length || block.radioFilter) {
                                      <div class="report-table-filter-panel">
                                        @if (block.selectFilters?.length) {
                                          <div class="report-table-select-grid">
                                            @for (filter of block.selectFilters || []; track filter.label) {
                                              <label class="report-table-select-field">
                                                <span>{{ filter.label }}</span>
                                                <span class="report-table-input report-table-select">
                                                  <select [attr.aria-label]="filter.label">
                                                    <option>{{ filter.value }}</option>
                                                    @for (option of filter.options || []; track option) {
                                                      @if (option !== filter.value) { <option>{{ option }}</option> }
                                                    }
                                                  </select>
                                                  <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                                </span>
                                              </label>
                                            }
                                          </div>
                                        }
                                        @if (block.radioFilter) {
                                          <fieldset class="report-table-radio-filter">
                                            <legend>{{ block.radioFilter.label }}</legend>
                                            <div class="report-table-radio-options">
                                              @for (option of block.radioFilter.options; track option.value) {
                                                <label>
                                                  <input type="radio" [name]="block.id + '-filter'" [value]="option.value" [checked]="option.checked" />
                                                  <span>{{ option.label }}</span>
                                                </label>
                                              }
                                            </div>
                                          </fieldset>
                                        }
                                      </div>
                                    }

                                    <div class="report-detail-table-scroll">
                                      <table class="report-detail-table" [style.min-width.px]="block.minWidth">
                                        <colgroup>
                                          @for (column of block.columns; track column.key) {
                                            <col [style.width.px]="column.width" />
                                          }
                                        </colgroup>
                                        <thead>
                                          <tr>
                                            @for (column of block.columns; track column.key) {
                                              <th [class.center]="column.align === 'center'">
                                                @if (column.key === 'selected') {
                                                  <span class="report-table-checkbox is-checked" aria-hidden="true"><span class="icon"><i data-lucide="check"></i></span></span>
                                                } @else {
                                                  {{ column.label }}
                                                }
                                              </th>
                                            }
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (row of block.rows; track row.id) {
                                            <tr>
                                              @for (column of block.columns; track column.key) {
                                                @let cell = tableCell(row, column.key);
                                                <td [class.center]="column.align === 'center'" [class.report-table-cell-input]="cell.type === 'dateInput' || cell.type === 'select'">
                                                  @switch (cell.type) {
                                                    @case ('checkbox') {
                                                      <span class="report-table-checkbox" [class.is-checked]="cell.checked" aria-hidden="true"><span class="icon"><i data-lucide="check"></i></span></span>
                                                    }
                                                    @case ('person') {
                                                      <span class="report-table-person">
                                                        @if (cell.initials) { <span class="report-table-avatar">{{ cell.initials }}</span> }
                                                        <span>{{ cell.value || '-' }}</span>
                                                      </span>
                                                    }
                                                    @case ('chip') {
                                                      <span class="report-table-chip {{ cell.tone || 'neutral' }}">{{ cell.value }}</span>
                                                    }
                                                    @case ('dateInput') {
                                                      <span class="report-table-input">
                                                        <input type="text" [value]="cell.value" [attr.aria-label]="column.label" />
                                                        <span class="icon" aria-hidden="true"><i data-lucide="calendar-days"></i></span>
                                                      </span>
                                                    }
                                                    @case ('select') {
                                                      <span class="report-table-input report-table-select">
                                                        <select [attr.aria-label]="column.label">
                                                          <option>{{ cell.value }}</option>
                                                          @for (option of cell.options || []; track option) {
                                                            @if (option !== cell.value) { <option>{{ option }}</option> }
                                                          }
                                                        </select>
                                                        <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                                      </span>
                                                    }
                                                    @case ('iconBadge') {
                                                      <span class="report-table-icon-badge {{ cell.tone || 'neutral' }}">
                                                        <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(cell.icon || 'info')"></i></span>
                                                      </span>
                                                    }
                                                    @default {
                                                      <span
                                                        class="report-table-text {{ cell.tone || 'neutral' }}"
                                                        [class.is-clamped]="cell.clampLines"
                                                        [style.--report-table-line-clamp]="cell.clampLines || null"
                                                      >
                                                        {{ cell.value || '-' }}
                                                      </span>
                                                    }
                                                  }
                                                </td>
                                              }
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>

                                    @if (block.actions?.length) {
                                      <div class="report-table-actions">
                                        @for (action of block.actions; track action.label) {
                                          <button type="button">
                                            @if (action.icon) { <span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(action.icon)"></i></span> }
                                            <span>{{ action.label }}</span>
                                          </button>
                                        }
                                      </div>
                                    }
                                  </article>
                                }
                              </section>
                            }
                          } @else {
                            <section class="report-detail-record-section" [attr.aria-label]="card.title + ' report items'">
                              <div class="report-detail-section-head">
                                <div><strong>{{ card.title }} details</strong><span>{{ card.body }}</span></div>
                                <button class="scope-group-link" type="button"><span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>Add to report</button>
                              </div>
                              <div class="report-detail-record-list">
                                @for (item of detailedReportItems(card.title); track item.title) {
                                  <article class="report-detail-record-card {{ item.tone }}">
                                    <div class="report-detail-record-head">
                                      <span class="report-detail-record-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(item.icon)"></i></span></span>
                                      <div class="report-detail-record-copy">
                                        <strong>{{ item.title }}</strong>
                                        <span>{{ item.meta }}</span>
                                      </div>
                                      <span class="report-area-pill {{ item.tone }}">{{ item.status }}</span>
                                    </div>
                                    <p>{{ item.body }}</p>
                                    <div class="report-detail-record-fields">
                                      <label class="scope-product-field scope-product-field-select">
                                        <span>Report status</span>
                                        <span class="scope-field-control scope-field-control-select">
                                          <select [attr.aria-label]="'Report status for ' + item.title">
                                            <option>{{ item.status }}</option>
                                            <option>On track</option>
                                            <option>Alert</option>
                                            <option>Off track</option>
                                          </select>
                                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                                        </span>
                                      </label>
                                      <label class="scope-product-field">
                                        <span>Owner</span>
                                        <input type="text" [value]="item.owner" />
                                      </label>
                                      <label class="scope-product-field">
                                        <span>{{ item.progressLabel }}</span>
                                        <input type="text" [value]="item.progressValue" />
                                      </label>
                                    </div>
                                    <label class="report-layout-comment">
                                      <span>Comments</span>
                                      <textarea rows="2" maxlength="3000" placeholder="Add the comments here..." [value]="item.comment"></textarea>
                                    </label>
                                  </article>
                                }
                              </div>
                            </section>
                          }
                        </div>
                      </section>
                    }
                  </div>
                </div>
              }
            </div>

            <footer class="report-drawer-footer">
              <button class="report-secondary-button" type="button" (click)="close.emit()">Cancel</button>
              <button class="report-more-button" type="button">More actions <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></button>
              <button class="report-submit-button" type="submit">Save</button>
            </footer>
          </form>
        </aside>
      </div>

      <ng-template #simpleReportCard let-card="card" let-index="index" let-isOverview="isOverview">
        <article class="report-layout-card report-simple-card report-layout-card-section {{ card.tone }}" [class.report-simple-overall-card]="isOverview">
          <div class="report-simple-card-head">
            <div class="report-simple-title-area">
              <span class="report-simple-card-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(card.icon)"></i></span></span>
              <div class="report-simple-section-title">
                <h3>{{ isOverview ? card.title : simpleReportSectionTitle(card.title) }}</h3>
                <span class="icon" aria-hidden="true"><i data-lucide="info"></i></span>
              </div>
            </div>
            <div class="report-simple-history" [attr.aria-label]="card.title + ' past statuses'">
              @for (point of card.timeline; track point.date + point.tone + $index) {
                <span class="{{ point.tone }}" [title]="point.label"><span class="report-simple-history-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></span><small>{{ point.date }}</small></span>
              }
            </div>
          </div>

          <div class="report-simple-control-row">
            <div class="report-simple-field">
              <span class="report-simple-field-label">Status<small>*</small></span>
              <div class="report-simple-status-control" role="radiogroup" [attr.aria-label]="card.title + ' status'">
                @for (option of statusOptions; track option.label) {
                  <label class="{{ option.tone }}"><input type="radio" [attr.name]="'simple-card-status-' + index" [checked]="isReportStatusSelected(option.value, card.status)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="iconName(option.icon)"></i></span>{{ option.simpleLabel || option.label }}</span></label>
                }
              </div>
            </div>
            <div class="report-simple-field">
              <span class="report-simple-field-label">Overall Status Trend</span>
              @if (isOverview) {
                <strong class="report-simple-trend-chip {{ simpleReportTrendTone(card.trend, card.tone) }}"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="simpleReportTrendIcon(card.trend, card.tone)"></i></span>{{ simpleReportTrendLabel(card.trend, card.tone) }}</strong>
              } @else {
                <div class="report-simple-trend-control" role="radiogroup" [attr.aria-label]="card.title + ' trend'">
                  @for (option of trendOptions; track option.value) {
                    <label class="{{ option.tone }}"><input type="radio" [attr.name]="'simple-card-trend-' + index" [checked]="isReportTrendSelected(option.value, card.trend)" /><span><span class="icon" aria-hidden="true"><i [attr.data-lucide]="option.icon"></i></span>{{ option.label }}</span></label>
                  }
                </div>
              }
            </div>
          </div>

          <label class="report-layout-comment">
            <span>Comments</span>
            <textarea rows="3" maxlength="3000" placeholder="Add the comments here..." [value]="card.comments"></textarea>
          </label>
        </article>
      </ng-template>
    }
  `,
})
export class PmConsoleReportDrawerComponent implements AfterViewChecked {
  @Input() projectName = 'Project';
  @Input() details: ReportCreationDetailInput | null = null;
  @Input() activeMode: ReportDetailMode = 'detailed';
  @Input() activeSection = 'Scope';
  @Input() reportSections: string[] = [];
  @Input() statusOptions: ReportStatusOption[] = [];
  @Input() trendOptions: ReportTrendOption[] = [];
  @Input() overviewCard: ReportDrawerCard | null = null;
  @Input() simpleCards: ReportDrawerCard[] = [];
  @Input() detailedCards: ReportDrawerCard[] = [];
  @Input() overviewFields: ReportOverviewField[] = [];
  @Input() scopeProducts: ScopeProduct[] = [];
  @Input() sectionDetails: Record<string, ReportSectionDetail> = {};
  @Input() detailItemMap: Record<string, ReportDetailItem[]> = {};

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Event>();
  @Output() modeChange = new EventEmitter<ReportDetailMode>();
  @Output() sectionChange = new EventEmitter<string>();

  private iconsHydrated = false;

  constructor(private readonly iconsService: PmConsoleIconService) {}

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  iconName(name: string): string {
    return reportIconMap[name] || name || 'layout-grid';
  }

  reportSectionIcon(section: string): string {
    const icons: Record<string, string> = {
      Overview: 'info',
      Scope: 'telescope',
      Schedule: 'calendar-days',
      Budget: 'hand-coins',
      Benefits: 'thumbs-up',
      Risks: 'shield-alert',
      Issues: 'circle-x',
      Resource: 'book-open',
      Dependency: 'network',
      Dependencies: 'network',
    };
    return icons[section] || 'info';
  }

  trendIcon(tone: string): string {
    const icons: Record<string, string> = {
      green: 'circle-check',
      amber: 'triangle-alert',
      red: 'circle-x',
      blue: 'circle-dot',
      neutral: 'circle-minus',
    };
    return icons[tone] || 'circle';
  }

  detailedReportItems(section: string): ReportDetailItem[] {
    return this.detailItemMap[section] || this.detailItemMap[section.replace(/s$/, '')] || [];
  }

  sectionDetail(section: string): ReportSectionDetail | null {
    return this.sectionDetails[section] || null;
  }

  hasSectionDetailContent(detail: ReportSectionDetail): boolean {
    return Boolean(detail.metrics?.length || detail.summaryGroups?.length || detail.recordBlocks?.length || detail.tables?.length);
  }

  tableCell(row: ReportTableRow, key: string): ReportTableCell {
    return row.cells[key] || { type: 'text', value: '-' };
  }

  ownerInitials(product: ScopeProduct): string {
    if (product.ownerInitials) return product.ownerInitials;
    return product.owner
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');
  }

  intervalLabel(details: ReportCreationDetailInput): string {
    return `${this.formatReportDate(details.intervalStart)} - ${this.formatReportDate(details.intervalEnd)}`;
  }

  planLabel(details: ReportCreationDetailInput): string {
    const normalized = details.intervalStatus.toLowerCase();
    if (normalized.includes('submitted') || normalized.includes('complete')) return 'Submitted';
    if (normalized.includes('active')) return 'Active';
    if (normalized.includes('draft') || normalized.includes('not created')) return 'Draft';
    return details.intervalStatus;
  }

  planChipTone(details: ReportCreationDetailInput): string {
    const label = this.planLabel(details);
    if (label === 'Draft') return 'neutral';
    return this.reportBadgeTone(label, 'neutral');
  }

  statusChipTone(details: ReportCreationDetailInput): string {
    return this.reportBadgeTone(this.planLabel(details), 'neutral');
  }

  reportBadgeTone(value: string, fallback = 'neutral'): string {
    const normalized = value.toLowerCase();
    if (normalized.includes('off')) return 'red';
    if (normalized.includes('alert') || normalized.includes('attention') || normalized.includes('draft') || normalized.includes('due')) return 'amber';
    if (normalized.includes('active') || normalized.includes('track') || normalized.includes('submitted') || normalized.includes('complete')) return 'green';
    return fallback;
  }

  simpleReportSectionTitle(title: string): string {
    const titles: Record<string, string> = {
      'Purpose and outcome': 'Purpose & outcome',
      'Dates and scope': 'Dates & scope',
    };
    return titles[title] || title;
  }

  simpleReportTrendLabel(trend: string, tone?: string): string {
    const normalized = trend.toLowerCase();
    if (normalized.includes('declin') || tone === 'red') return 'Declining';
    if (normalized.includes('stable') || normalized.includes('same') || normalized.includes('no change') || normalized.includes('attention') || tone === 'amber') return 'No change';
    return 'Improving';
  }

  simpleReportTrendTone(trend: string, tone?: string): string {
    const label = this.simpleReportTrendLabel(trend, tone);
    if (label === 'Declining') return 'red';
    if (label === 'No change') return 'neutral';
    return 'green';
  }

  simpleReportTrendIcon(trend: string, tone?: string): string {
    const label = this.simpleReportTrendLabel(trend, tone);
    if (label === 'Declining') return 'arrow-down';
    if (label === 'No change') return 'circle-minus';
    return 'arrow-up';
  }

  isReportTrendSelected(optionValue: string, trend: string): boolean {
    return this.simpleReportTrendLabel(trend).toLowerCase() === optionValue.toLowerCase();
  }

  isReportStatusSelected(optionValue: string, status: string): boolean {
    return this.reportToneToken(optionValue) === this.reportToneToken(status);
  }

  private reportToneToken(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('off')) return 'red';
    if (normalized.includes('alert') || normalized.includes('attention') || normalized.includes('due') || normalized.includes('draft')) return 'amber';
    return 'green';
  }

  private formatReportDate(value: string): string {
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/').map(Number);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(year, month - 1, day)));
    }
    return value;
  }
}
