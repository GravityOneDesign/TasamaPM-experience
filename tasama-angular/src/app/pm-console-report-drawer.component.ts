import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleDateFieldComponent } from './shared/pm-console-date-field.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

type ReportDetailMode = 'simple' | 'detailed';
type ReportDrawerPresentationMode = 'compose' | 'pdf-preview';

interface ReportCreationDetailInput {
  intervalStart: string;
  intervalEnd: string;
  intervalStatus: string;
  stage: string;
  state: string;
  overallTrend: string;
  progress?: number;
  baselineEnd?: string;
  forecastEnd?: string;
  comments?: string;
  achievements?: string;
  planned?: string;
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

interface ScopeProductDateChange {
  productTitle: string;
  field: 'actualStart' | 'actualEnd';
  value: string;
}

interface ReportTableDateChange {
  section: string;
  tableId: string;
  rowId: string;
  columnKey: string;
  value: string;
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
  imports: [CommonModule, PmConsoleDateFieldComponent, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (details; as reportDetails) {
      <div class="report-drawer-shell" aria-live="polite">
        <button class="report-drawer-backdrop" type="button" (click)="close.emit()" aria-label="Close report drawer"></button>
        <aside
          class="report-drawer report-drawer-create"
          [class.report-drawer-expanded]="isExpanded"
          [class.report-drawer-submitted]="submitted"
          [class.report-drawer-pdf]="presentationMode === 'pdf-preview'"
          [attr.aria-label]="presentationMode === 'pdf-preview' ? projectName + ' PDF report preview' : projectName + (submitted ? ' submitted report' : ' report draft')"
        >
          @if (presentationMode === 'pdf-preview') {
            <section class="report-pdf-preview" [attr.aria-label]="projectName + ' PDF report preview'">
              <header class="report-pdf-toolbar">
                <button class="report-preview-back-button" type="button" (click)="previewBack.emit()" aria-label="Back to report creation UI">
                  <span class="icon" aria-hidden="true"><i data-lucide="chevron-left"></i></span>
                  <span>Back</span>
                </button>
                <div class="report-pdf-toolbar-title">
                  <span>PDF preview</span>
                  <h2>Project Status Report</h2>
                  <p>{{ projectName }}</p>
                </div>
                <button class="report-top-icon-button" type="button" (click)="close.emit()" aria-label="Close drawer">
                  <span class="icon" aria-hidden="true"><i data-lucide="x"></i></span>
                </button>
              </header>

              <div class="report-pdf-scroll">
                <article class="report-pdf-page">
                  <div class="report-pdf-page-head">
                    <div>
                      <span>Project Status Report</span>
                      <h3>{{ projectName }}</h3>
                    </div>
                    <strong>{{ planLabel(reportDetails) }}</strong>
                  </div>

                  <div class="report-pdf-meta-grid">
                    <span><small>Reporting interval</small><strong>{{ intervalLabel(reportDetails) }}</strong></span>
                    <span><small>Stage</small><strong>{{ reportDetails.stage }}</strong></span>
                    <span><small>State</small><strong>{{ reportDetails.state }}</strong></span>
                    <span><small>Overall trend</small><strong>{{ reportDetails.overallTrend }}</strong></span>
                    <span><small>Progress</small><strong>{{ reportDetails.progress || 0 }}%</strong></span>
                    <span><small>Forecast end</small><strong>{{ reportDetails.forecastEnd || '-' }}</strong></span>
                  </div>

                  @if (overviewCard; as summaryCard) {
                    <section class="report-pdf-section">
                      <div class="report-pdf-section-title">
                        <span class="report-table-chip {{ summaryCard.tone }}">{{ summaryCard.status }}</span>
                        <h4>Executive summary</h4>
                      </div>
                      <p>{{ summaryCard.comments || reportDetails.comments || 'Submitted report content is ready for PMO review.' }}</p>
                    </section>
                  }

                  <section class="report-pdf-section report-pdf-two-column">
                    <div>
                      <h4>Key achievements</h4>
                      <p>{{ reportDetails.achievements || 'Project updates have been captured for this reporting period.' }}</p>
                    </div>
                    <div>
                      <h4>Planned activities</h4>
                      <p>{{ reportDetails.planned || 'Next-period activities are captured in the submitted report.' }}</p>
                    </div>
                  </section>

                  <section class="report-pdf-section">
                    <h4>Report sections</h4>
                    <div class="report-pdf-section-list">
                      @for (card of detailedCards; track card.id) {
                        <article>
                          <span class="report-table-chip {{ card.tone }}">{{ card.status }}</span>
                          <strong>{{ card.title }}</strong>
                          <p>{{ card.comments || card.body }}</p>
                        </article>
                      }
                    </div>
                  </section>

                  <section class="report-pdf-section">
                    <h4>Scope snapshot</h4>
                    <div class="report-pdf-scope-list">
                      @for (product of scopeProducts; track product.title) {
                        <span><strong>{{ product.title }}</strong><small>{{ product.status }} · {{ product.completed }}% complete</small></span>
                      }
                    </div>
                  </section>
                </article>
              </div>
            </section>
          } @else {
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
                      <button
                        class="report-top-icon-button"
                        type="button"
                        [attr.aria-label]="isExpanded ? 'Restore report drawer' : 'Expand report drawer'"
                        [attr.aria-pressed]="isExpanded"
                        [attr.title]="isExpanded ? 'Restore drawer' : 'Expand drawer'"
                        (click)="toggleExpanded()"
                      >
                        @if (isExpanded) {
                          <span class="icon" aria-hidden="true"><i data-lucide="minimize-2"></i></span>
                        } @else {
                          <span class="icon" aria-hidden="true"><i data-lucide="maximize-2"></i></span>
                        }
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
                              <ng-container [ngTemplateOutlet]="scopeProductsBlock"></ng-container>
                            </section>
                          } @else if (sectionDetail(card.title); as detail) {
                            @if (hasSectionDetailContent(detail)) {
                              <section class="report-detail-record-section" [attr.aria-label]="card.title + ' detail content'">
                                @if (detail.metrics?.length) {
                                  <ng-container [ngTemplateOutlet]="reportMetricStrip" [ngTemplateOutletContext]="{ detail: detail }"></ng-container>
                                }

                                <ng-container [ngTemplateOutlet]="reportSummaryGroups" [ngTemplateOutletContext]="{ groups: detail.summaryGroups || [] }"></ng-container>

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
                                  <ng-container [ngTemplateOutlet]="reportTableBlock" [ngTemplateOutletContext]="{ block: block, sectionTitle: card.title }"></ng-container>
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
              @if (submitted) {
                <button class="report-submit-button report-preview-button" type="button" (click)="preview.emit()">
                  <span class="icon" aria-hidden="true"><i data-lucide="file-search"></i></span>
                  <span>Preview</span>
                </button>
              } @else {
                <button class="report-secondary-button" type="button" (click)="close.emit()">Cancel</button>
                <button class="report-more-button" type="button">More actions <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span></button>
                <button class="report-submit-button" type="submit">Save</button>
              }
            </footer>
          </form>
          }
        </aside>
      </div>

      <ng-template #simpleReportCard let-card="card" let-index="index" let-isOverview="isOverview">
        <article
          class="report-layout-card report-simple-card report-layout-card-section {{ card.tone }}"
          [class.is-collapsible]="true"
          [class.is-collapsed]="!isSimpleReportCardExpanded(card, index)"
          [class.report-simple-overall-card]="isOverview || isSimpleReportOverviewCard(card)"
          [class.report-simple-schedule-scope-card]="isSimpleScheduleScopeCard(card)"
          [class.report-simple-watchlist-card]="isSimpleMandatoryWatchlistCard(card)"
          [class.report-simple-budget-card]="isSimpleReportBudgetCard(card)"
        >
          <div class="report-simple-card-head">
            <div class="report-simple-title-area">
              <span class="report-simple-card-icon" aria-hidden="true"><span class="icon"><i [attr.data-lucide]="iconName(card.icon)"></i></span></span>
              <div class="report-simple-section-title">
                <h3 [id]="simpleReportCardTitleId(card, index)">{{ isOverview ? card.title : simpleReportSectionTitle(card.title) }}</h3>
                <span class="icon" aria-hidden="true"><i data-lucide="info"></i></span>
              </div>
            </div>
            <div class="report-simple-card-head-actions">
              <div class="report-simple-history" [attr.aria-label]="card.title + ' past statuses'">
                @for (point of card.timeline; track point.date + point.tone + $index) {
                  <span class="{{ point.tone }}" [title]="point.label"><span class="report-simple-history-icon"><span class="icon" aria-hidden="true"><i [attr.data-lucide]="trendIcon(point.tone)"></i></span></span><small>{{ point.date }}</small></span>
                }
              </div>
              <button
                class="report-simple-card-toggle"
                type="button"
                [attr.aria-label]="(isSimpleReportCardExpanded(card, index) ? 'Collapse ' : 'Expand ') + (isOverview ? card.title : simpleReportSectionTitle(card.title))"
                [attr.aria-expanded]="isSimpleReportCardExpanded(card, index)"
                [attr.aria-controls]="simpleReportCardPanelId(card, index)"
                (click)="toggleSimpleReportCard(card, index)"
              >
                <span [pmConsoleIcon]="isSimpleReportCardExpanded(card, index) ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
              </button>
            </div>
          </div>

          <section
            class="report-simple-card-body"
            [id]="simpleReportCardPanelId(card, index)"
            [attr.aria-labelledby]="simpleReportCardTitleId(card, index)"
            [hidden]="!isSimpleReportCardExpanded(card, index)"
          >
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

            @if (isSimpleReportBudgetCard(card) && budgetSummaryGroups.length) {
              <section class="report-simple-linked-details report-simple-budget-overview-section" aria-label="Budget overview">
                <ng-container [ngTemplateOutlet]="reportSummaryGroups" [ngTemplateOutletContext]="{ groups: budgetSummaryGroups }"></ng-container>
              </section>
            }

            @if (isSimpleReportOverviewCard(card) && overviewFields.length) {
              <section class="report-simple-narrative-section" aria-label="Overview narrative updates">
                <div class="report-detail-section-head">
                  <div><strong>Narrative updates</strong><span>Capture the longer report text for this period.</span></div>
                </div>
                <div class="report-detail-narrative-grid report-simple-narrative-grid">
                  @for (field of overviewFields; track field.label) {
                    <label class="report-layout-field">
                      <span>{{ field.label }} @if (field.hint) { <small>{{ field.hint }}</small> }</span>
                      <textarea [rows]="field.rows" maxlength="3000" [value]="field.value"></textarea>
                    </label>
                  }
                </div>
              </section>
            }

            @if (isSimpleScheduleScopeCard(card)) {
              <section class="report-simple-linked-details" aria-label="Schedule and scope report details">
                @if (sectionDetail('Schedule'); as scheduleDetail) {
                  <section class="report-detail-record-section report-simple-embedded-section report-simple-schedule-section" aria-label="Schedule milestones">
                    @if (scheduleDetail.metrics?.length) {
                      <ng-container [ngTemplateOutlet]="reportMetricStrip" [ngTemplateOutletContext]="{ detail: scheduleDetail }"></ng-container>
                    }

                    @for (block of scheduleDetail.tables || []; track block.id) {
                      <ng-container [ngTemplateOutlet]="reportTableBlock" [ngTemplateOutletContext]="{ block: block, sectionTitle: 'Schedule' }"></ng-container>
                    }
                  </section>
                }

                <section class="report-detail-record-section report-detail-scope-section report-simple-embedded-section" aria-label="Scope end products">
                  <ng-container [ngTemplateOutlet]="scopeProductsBlock"></ng-container>
                </section>
              </section>
            }

            @if (isSimpleMandatoryWatchlistCard(card)) {
              <section class="report-simple-linked-details report-simple-watchlist-details" aria-label="Mandatory watchlist report details">
                @if (sectionDetail('Risks'); as riskDetail) {
                  <section class="report-detail-record-section report-simple-embedded-section" aria-label="Mandatory watchlist risks">
                    @for (block of riskDetail.tables || []; track block.id) {
                      <ng-container [ngTemplateOutlet]="reportTableBlock" [ngTemplateOutletContext]="{ block: block, sectionTitle: 'Risks' }"></ng-container>
                    }
                  </section>
                }

                @if (sectionDetail('Benefits'); as benefitDetail) {
                  <section class="report-detail-record-section report-simple-embedded-section" aria-label="Mandatory watchlist benefits">
                    @for (block of benefitDetail.tables || []; track block.id) {
                      <ng-container [ngTemplateOutlet]="reportTableBlock" [ngTemplateOutletContext]="{ block: block, sectionTitle: 'Benefits' }"></ng-container>
                    }
                  </section>
                }
              </section>
            }
          </section>
        </article>
      </ng-template>

      <ng-template #reportMetricStrip let-detail="detail">
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
      </ng-template>

      <ng-template #reportSummaryGroups let-groups="groups">
        @for (group of groups; track group.title) {
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
      </ng-template>

      <ng-template #scopeProductsBlock>
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
                    <app-pm-console-date-field
                      [value]="product.actualStart"
                      [ariaLabel]="'Actual start for ' + product.title"
                      (valueChange)="scopeProductDateChange.emit({ productTitle: product.title, field: 'actualStart', value: $event })"
                    />
                  </label>
                  <label class="scope-product-field">
                    <span>Actual end</span>
                    <app-pm-console-date-field
                      [value]="product.actualEnd"
                      [ariaLabel]="'Actual end for ' + product.title"
                      (valueChange)="scopeProductDateChange.emit({ productTitle: product.title, field: 'actualEnd', value: $event })"
                    />
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
      </ng-template>

      <ng-template #reportTableBlock let-block="block" let-sectionTitle="sectionTitle">
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

          <div class="dependency-register-table-shell report-detail-table-scroll">
            <table class="dependency-register-table report-detail-table" [style.min-width.px]="reportTableMinWidth(block)">
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
                            <span class="dependency-register-pill report-table-pill {{ cell.tone || 'neutral' }}">{{ cell.value }}</span>
                          }
                          @case ('dateInput') {
                            <app-pm-console-date-field
                              [value]="cell.value"
                              [ariaLabel]="column.label"
                              (valueChange)="tableDateChange.emit({ section: sectionTitle, tableId: block.id, rowId: row.id, columnKey: column.key, value: $event })"
                            />
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
      </ng-template>
    }
  `,
})
export class PmConsoleReportDrawerComponent implements AfterViewChecked, OnChanges {
  @Input() projectName = 'Project';
  @Input() details: ReportCreationDetailInput | null = null;
  @Input() submitted = false;
  @Input() presentationMode: ReportDrawerPresentationMode = 'compose';
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
  @Output() preview = new EventEmitter<void>();
  @Output() previewBack = new EventEmitter<void>();
  @Output() modeChange = new EventEmitter<ReportDetailMode>();
  @Output() sectionChange = new EventEmitter<string>();
  @Output() scopeProductDateChange = new EventEmitter<ScopeProductDateChange>();
  @Output() tableDateChange = new EventEmitter<ReportTableDateChange>();

  private iconsHydrated = false;
  private simpleReportExpandedCards: Record<string, boolean> = {};
  isExpanded = false;

  constructor(private readonly iconsService: PmConsoleIconService) {}

  ngOnChanges(): void {
    this.iconsHydrated = false;
  }

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  iconName(name: string): string {
    return reportIconMap[name] || name || 'layout-grid';
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
    this.iconsHydrated = false;
  }

  isSimpleReportCardExpanded(card: ReportDrawerCard, index: number): boolean {
    return this.simpleReportExpandedCards[card.id] ?? index === 0;
  }

  toggleSimpleReportCard(card: ReportDrawerCard, index: number): void {
    this.simpleReportExpandedCards = {
      ...this.simpleReportExpandedCards,
      [card.id]: !this.isSimpleReportCardExpanded(card, index),
    };
    this.iconsHydrated = false;
  }

  simpleReportCardPanelId(card: ReportDrawerCard, index: number): string {
    return `report-simple-card-panel-${this.simpleReportCardDomId(card, index)}`;
  }

  simpleReportCardTitleId(card: ReportDrawerCard, index: number): string {
    return `report-simple-card-title-${this.simpleReportCardDomId(card, index)}`;
  }

  private simpleReportCardDomId(card: ReportDrawerCard, index: number): string {
    return `${card.id || 'card'}-${index}`.replace(/[^a-zA-Z0-9_-]/g, '-');
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

  reportTableMinWidth(block: ReportTableBlock): number {
    return Math.max(block.minWidth, 720);
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
      'Purpose and outcome': 'Overview',
      'Dates and scope': 'Schedule and scope',
      'Budget baseline': 'Budget',
      Risks: 'Mandatory watchlist',
    };
    return titles[title] || title;
  }

  isSimpleReportOverviewCard(card: ReportDrawerCard): boolean {
    return this.simpleReportSectionTitle(card.title) === 'Overview';
  }

  isSimpleScheduleScopeCard(card: ReportDrawerCard): boolean {
    return this.simpleReportSectionTitle(card.title) === 'Schedule and scope';
  }

  isSimpleReportBudgetCard(card: ReportDrawerCard): boolean {
    return this.simpleReportSectionTitle(card.title) === 'Budget';
  }

  isSimpleMandatoryWatchlistCard(card: ReportDrawerCard): boolean {
    return this.simpleReportSectionTitle(card.title) === 'Mandatory watchlist';
  }

  get budgetSummaryGroups(): ReportSummaryGroup[] {
    return this.sectionDetail('Budget')?.summaryGroups || [];
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
