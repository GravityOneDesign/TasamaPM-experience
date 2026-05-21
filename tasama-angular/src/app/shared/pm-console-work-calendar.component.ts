import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface PmConsoleCalendarItem {
  date: string;
  label: string;
  tone: string;
  project: string;
  kind?: string;
}

export interface PmConsoleCalendarCell {
  key: string;
  day: number;
  current: boolean;
  today: boolean;
  items: PmConsoleCalendarItem[];
}

export interface PmConsoleCalendarFilter {
  id: string;
  label: string;
  icon: string;
  count: number;
}

type CalendarPopoverPlacement = 'above' | 'below';

@Component({
  selector: 'app-pm-console-work-calendar',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="calendar-command-row">
      <div class="calendar-month-picker" aria-label="Calendar month navigation">
        <button class="calendar-nav-button" type="button" (click)="monthShift.emit(-1)" aria-label="Previous month">
          <span pmConsoleIcon="chevron-left" aria-hidden="true"></span>
        </button>
        <div class="calendar-month-copy">
          <strong>{{ monthLabel }}</strong>
          <span>{{ monthItemCount }} item{{ monthItemCount === 1 ? '' : 's' }} this month</span>
        </div>
        <button class="calendar-nav-button" type="button" (click)="monthShift.emit(1)" aria-label="Next month">
          <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
        </button>
      </div>

      <div class="board-filter calendar-filter-bar" aria-label="Quick work filter">
        <span>Show</span>
        <details class="work-filter-dropdown">
          <summary [attr.aria-label]="'Filter work by ' + selectedFilterLabel">
            <span class="work-filter-selected-icon"><span [pmConsoleIcon]="selectedFilterIcon" aria-hidden="true"></span></span>
            <span>{{ selectedFilterLabel }}</span>
            <strong>{{ selectedFilterCount }}</strong>
            <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
          </summary>
          <div class="work-filter-menu" role="menu">
            @for (filter of filters; track filter.id) {
              <button
                [class.active]="selectedFilterId === filter.id"
                type="button"
                role="menuitemradio"
                [attr.aria-checked]="selectedFilterId === filter.id"
                (click)="selectFilter(filter.id, $event)"
              >
                <span class="work-filter-option-icon"><span [pmConsoleIcon]="filter.icon" aria-hidden="true"></span></span>
                <span>{{ filter.label }}</span>
                <strong>{{ filter.count }}</strong>
              </button>
            }
          </div>
        </details>
      </div>
    </div>

    <div class="timeline-calendar">
      <div class="weekdays" aria-hidden="true">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
      <div class="calendar-grid">
        @for (cell of cells; track cell.key) {
          <div
            class="calendar-cell"
            [class.muted]="!cell.current"
            [class.today]="cell.today"
            [class.has-items]="cell.items.length > 0"
            [class.has-overflow]="isCollapsedCell(cell)"
            (mouseenter)="showCellPreview(cell, $event)"
            (mouseleave)="hidePreviewSoon()"
          >
            <span class="calendar-day-number">{{ cell.day }}</span>
            @if (cell.items.length) {
              <div class="calendar-event-stack" [attr.aria-label]="cellAgendaLabel(cell)">
                @if (isCollapsedCell(cell)) {
                  <button
                    class="calendar-event calendar-action-summary"
                    type="button"
                    [attr.aria-label]="summaryItemsLabel(cell)"
                    aria-haspopup="dialog"
                    [attr.aria-expanded]="previewCell?.key === cell.key"
                    (mouseenter)="showDayPreview(cell, $event)"
                    (mouseleave)="hidePreviewSoon()"
                    (focus)="showDayPreview(cell, $event)"
                    (blur)="hidePreviewSoon()"
                    (click)="showDayPreviewFromClick(cell, $event)"
                  >
                    <span class="calendar-summary-count" aria-hidden="true">{{ cell.items.length }}</span>
                    <span class="calendar-event-title">actions</span>
                  </button>
                } @else {
                  @for (item of visibleCellItems(cell); track item.date + item.label + item.project) {
                    <button
                      class="calendar-event {{ item.tone }}"
                      type="button"
                      [attr.aria-label]="calendarEventLabel(item)"
                      (mouseenter)="showItemPreview(item, $event)"
                      (mouseleave)="hidePreviewSoon()"
                      (focus)="showItemPreview(item, $event)"
                      (blur)="hidePreviewSoon()"
                      (click)="openAgendaItem(item, $event)"
                    >
                      <span class="calendar-event-dot"></span>
                      <span class="calendar-event-title">{{ item.label }}</span>
                    </button>
                  }
                }
              </div>
            }
          </div>
        }
      </div>
    </div>

    @if (previewItem) {
      <aside
        class="calendar-hover-card calendar-item-hover-card is-actionable {{ previewPlacement }}"
        role="dialog"
        aria-modal="false"
        [attr.aria-label]="previewItem.label + ' details'"
        [style.top.px]="previewTop"
        [style.left.px]="previewLeft"
        (mouseenter)="keepPreview()"
        (mouseleave)="hidePreviewSoon()"
        (focusin)="keepPreview()"
        (focusout)="hidePreviewSoon()"
        (click)="$event.stopPropagation()"
      >
        <span class="calendar-popover-kind {{ previewItem.tone }}">{{ itemKindLabel(previewItem) }}</span>
        <strong>{{ previewItem.label }}</strong>
        <p>{{ previewItem.project }}</p>
        <div class="calendar-popover-meta">
          <span><b>Date</b>{{ dateLabel(previewItem.date) }}</span>
        </div>
        <button class="calendar-popover-action" type="button" (click)="openAgendaItem(previewItem, $event)">
          <span>{{ actionLabel(previewItem) }}</span>
          <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
        </button>
      </aside>
    }

    @if (previewCell) {
      <aside
        class="calendar-hover-card calendar-day-hover-card is-actionable {{ previewPlacement }}"
        role="dialog"
        aria-modal="false"
        [attr.aria-label]="dateLabel(previewCell.key) + ' agenda preview'"
        [style.top.px]="previewTop"
        [style.left.px]="previewLeft"
        (mouseenter)="keepPreview()"
        (mouseleave)="hidePreviewSoon()"
        (focusin)="keepPreview()"
        (focusout)="hidePreviewSoon()"
        (click)="$event.stopPropagation()"
      >
        <span class="calendar-popover-kind neutral">{{ dateLabel(previewCell.key) }}</span>
        <strong>{{ previewCell.items.length }} item{{ previewCell.items.length === 1 ? '' : 's' }} scheduled</strong>
        <div class="calendar-day-agenda-list preview-agenda-list">
          @for (item of previewCell.items; track item.date + item.label + item.project) {
            <button class="calendar-agenda-row" type="button" (click)="openAgendaItem(item, $event)">
              <span class="calendar-event-dot {{ item.tone }}"></span>
              <span>
                <strong>{{ item.label }}</strong>
                <small>{{ item.project }} - {{ itemKindLabel(item) }}</small>
              </span>
              <span class="calendar-agenda-cta">
                <span>{{ actionLabel(item) }}</span>
                <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
              </span>
            </button>
          }
        </div>
      </aside>
    }

  `,
  styles: [
    `
      :host {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 10px;
        min-height: 0;
        min-width: 0;
        overflow: visible;
        position: relative;
      }

      .calendar-cell {
        overflow: visible;
      }

      .calendar-cell:not(.has-items) {
        overflow: hidden;
      }

      .calendar-cell.has-items {
        padding: 5px 6px;
      }

      .calendar-day-number {
        height: 18px;
        line-height: 18px;
        margin-bottom: 3px;
      }

      .calendar-event-stack {
        display: grid;
        gap: 3px;
        justify-items: start;
        min-width: 0;
      }

      .calendar-event {
        cursor: pointer;
        font-size: 10.25px;
        height: 22px;
        margin-top: 0;
        max-width: calc(100% - 2px);
        padding: 0 8px;
      }

      .calendar-action-summary {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.24);
        border-style: dashed;
        color: #10069f;
        gap: 6px;
        max-width: 100%;
        padding-left: 5px;
        padding-right: 8px;
        width: fit-content;
      }

      .calendar-action-summary:hover,
      .calendar-action-summary:focus-visible,
      .calendar-action-summary[aria-expanded='true'] {
        background: #f1f0ff;
        border-color: rgba(16, 6, 159, 0.32);
      }

      .calendar-summary-count {
        align-items: center;
        background: #10069f;
        border-radius: 999px;
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 9px;
        font-weight: 700;
        height: 14px;
        justify-content: center;
        line-height: 1;
        min-width: 14px;
        padding: 0 4px;
      }

      .calendar-more-button {
        align-items: center;
        background: #ffffff;
        border: 1px dashed #cfd6e4;
        border-radius: 999px;
        color: #536071;
        cursor: pointer;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 500;
        height: 24px;
        justify-content: center;
        margin-top: 0;
        max-width: 100%;
        padding: 0 9px;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          color 160ms ease,
          box-shadow 160ms ease,
          transform 160ms ease;
        width: fit-content;
      }

      .calendar-more-button:hover,
      .calendar-more-button:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.28);
        box-shadow: 0 8px 18px rgba(25, 33, 61, 0.08);
        color: #10069f;
        outline: 0;
        transform: translateY(-1px);
      }

      .calendar-hover-card {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        box-shadow: 0 18px 40px rgba(25, 33, 61, 0.18);
        color: #252a34;
        max-width: 280px;
        min-width: 248px;
        padding: 12px;
        position: fixed;
        z-index: 80;
      }

      .calendar-hover-card {
        display: grid;
        gap: 7px;
        pointer-events: none;
      }

      .calendar-hover-card.is-actionable {
        max-width: 320px;
        min-width: 280px;
        pointer-events: auto;
      }

      .calendar-hover-card.above {
        transform: translateY(-100%);
      }

      .calendar-hover-card.below {
        transform: none;
      }

      .calendar-hover-card::after {
        background: #ffffff;
        border-bottom: 1px solid #dfe4ee;
        border-right: 1px solid #dfe4ee;
        bottom: -6px;
        content: "";
        height: 10px;
        left: 24px;
        position: absolute;
        transform: rotate(45deg);
        width: 10px;
      }

      .calendar-hover-card.below::after {
        border: 0;
        border-left: 1px solid #dfe4ee;
        border-top: 1px solid #dfe4ee;
        bottom: auto;
        top: -6px;
      }

      .calendar-popover-action .icon,
      .calendar-agenda-row .icon {
        height: 14px;
        width: 14px;
      }

      .calendar-popover-kind {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        font-size: 10px;
        font-weight: 600;
        justify-self: start;
        letter-spacing: 0;
        line-height: 1;
        padding: 6px 8px;
        text-transform: uppercase;
      }

      .calendar-popover-kind.green {
        background: #eefbf5;
        color: #166b49;
      }

      .calendar-popover-kind.red {
        background: #fff0f0;
        color: #9e2f2f;
      }

      .calendar-popover-kind.blue {
        background: #eef4ff;
        color: #1f4fb8;
      }

      .calendar-popover-kind.neutral {
        background: #f5f7fb;
        color: #536071;
      }

      .calendar-hover-card strong {
        color: #252a34;
        display: block;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.25;
        margin: 0;
      }

      .calendar-hover-card p {
        color: var(--muted);
        font-size: 11px;
        line-height: 1.35;
        margin: 0;
      }

      .calendar-popover-meta {
        display: grid;
        gap: 6px;
      }

      .calendar-popover-meta span {
        align-items: center;
        display: flex;
        font-size: 11px;
        gap: 12px;
        justify-content: space-between;
      }

      .calendar-popover-meta b {
        color: #303645;
        font-weight: 600;
      }

      .calendar-popover-action {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        color: #303645;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 8px;
        height: 32px;
        justify-content: center;
        justify-self: start;
        padding: 0 12px;
      }

      .calendar-popover-action:hover,
      .calendar-popover-action:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.22);
        color: #10069f;
        outline: 0;
      }

      .calendar-day-agenda-list {
        display: grid;
        gap: 6px;
        max-height: 240px;
        overflow: auto;
        padding-right: 2px;
      }

      .preview-agenda-list {
        margin-top: 8px;
      }

      .calendar-agenda-row {
        align-items: center;
        background: #fbfcff;
        border: 1px solid #edf0f6;
        border-radius: 8px;
        color: #303645;
        display: grid;
        gap: 8px;
        grid-template-columns: auto minmax(0, 1fr) auto;
        min-height: 44px;
        padding: 8px;
        text-align: left;
      }

      .calendar-agenda-row:hover,
      .calendar-agenda-row:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.22);
        color: #10069f;
        outline: 0;
      }

      .calendar-agenda-row strong,
      .calendar-agenda-row small {
        display: block;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .calendar-agenda-row strong {
        font-size: 12px;
        font-weight: 600;
        line-height: 1.25;
      }

      .calendar-agenda-row small {
        color: var(--muted);
        font-size: 10.5px;
        margin-top: 2px;
      }

      .calendar-agenda-cta {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 600;
        gap: 4px;
        justify-content: flex-end;
        min-width: 76px;
        white-space: nowrap;
      }

      .calendar-agenda-row .calendar-event-dot {
        margin: 0;
      }

      .calendar-agenda-row .calendar-event-dot.green {
        background: #22a06b;
      }

      .calendar-agenda-row .calendar-event-dot.red {
        background: #e05252;
      }

      .calendar-agenda-row .calendar-event-dot.blue {
        background: #2563eb;
      }

      .calendar-agenda-row .calendar-event-dot.neutral {
        background: #98a1b2;
      }

      @media (max-width: 700px) {
        .calendar-event.calendar-action-summary {
          justify-content: center;
          max-width: none;
          min-width: 58px;
          padding: 0 6px;
          width: max-content;
        }

        .calendar-event.calendar-action-summary .calendar-event-title {
          display: inline;
          overflow: visible;
          text-overflow: clip;
        }

        .calendar-summary-count {
          display: inline-flex;
        }

        .calendar-agenda-row {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .calendar-agenda-cta {
          grid-column: 2;
          justify-content: flex-start;
          min-width: 0;
        }

        .calendar-more-button {
          padding: 0 7px;
          width: auto;
        }

        .calendar-hover-card {
          left: 12px !important;
          max-width: none;
          min-width: 0;
          right: 12px;
          width: auto;
        }
      }
    `,
  ],
})
export class PmConsoleWorkCalendarComponent implements OnDestroy {
  @Input() monthLabel = '';
  @Input() monthItemCount = 0;
  @Input() cells: PmConsoleCalendarCell[] = [];
  @Input() filters: PmConsoleCalendarFilter[] = [];
  @Input() selectedFilterId = 'all';

  @Output() readonly monthShift = new EventEmitter<number>();
  @Output() readonly filterChange = new EventEmitter<string>();
  @Output() readonly itemOpen = new EventEmitter<PmConsoleCalendarItem>();

  readonly maxInlineItems = 2;
  readonly maxSummaryDots = 3;

  previewItem: PmConsoleCalendarItem | null = null;
  previewCell: PmConsoleCalendarCell | null = null;
  previewTop = 0;
  previewLeft = 0;
  previewPlacement: CalendarPopoverPlacement = 'above';

  private previewHideTimer: number | null = null;
  private previewPinned = false;

  ngOnDestroy(): void {
    this.clearPreviewHideTimer();
  }

  get selectedFilter(): PmConsoleCalendarFilter {
    return this.filters.find((filter) => filter.id === this.selectedFilterId) || this.filters[0] || { id: 'all', label: 'All', icon: 'grid-2x2', count: 0 };
  }

  get selectedFilterLabel(): string {
    return this.selectedFilter.label;
  }

  get selectedFilterIcon(): string {
    return this.selectedFilter.icon;
  }

  get selectedFilterCount(): number {
    return this.selectedFilter.count;
  }

  visibleCellItems(cell: PmConsoleCalendarCell): PmConsoleCalendarItem[] {
    return this.isCollapsedCell(cell) ? [] : cell.items.slice(0, this.maxInlineItems);
  }

  isCollapsedCell(cell: PmConsoleCalendarCell): boolean {
    return cell.items.length > this.maxInlineItems;
  }

  summaryToneItems(cell: PmConsoleCalendarCell): PmConsoleCalendarItem[] {
    return cell.items.slice(0, this.maxSummaryDots);
  }

  selectFilter(filterId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.hidePreview();
    filterChangeDetails(event)?.removeAttribute('open');
    this.filterChange.emit(filterId);
  }

  showItemPreview(item: PmConsoleCalendarItem, event: MouseEvent | FocusEvent): void {
    this.previewPinned = false;
    this.keepPreview();
    const anchor = this.eventAnchor(event);
    if (!anchor) return;
    const position = this.positionFor(anchor, 280, 156);
    this.previewItem = item;
    this.previewCell = null;
    this.previewTop = position.top;
    this.previewLeft = position.left;
    this.previewPlacement = position.placement;
  }

  showDayPreview(cell: PmConsoleCalendarCell, event: MouseEvent | FocusEvent): void {
    this.previewPinned = false;
    this.keepPreview();
    const anchor = this.eventAnchor(event);
    if (!anchor) return;
    const position = this.positionFor(anchor, 320, this.dayPopoverHeight(cell));
    this.previewItem = null;
    this.previewCell = cell;
    this.previewTop = position.top;
    this.previewLeft = position.left;
    this.previewPlacement = position.placement;
  }

  showCellPreview(cell: PmConsoleCalendarCell, event: MouseEvent): void {
    if (cell.items.length < 2) return;
    this.showDayPreview(cell, event);
  }

  showDayPreviewFromClick(cell: PmConsoleCalendarCell, event: MouseEvent): void {
    event.stopPropagation();
    this.showDayPreview(cell, event);
    this.previewPinned = true;
  }

  keepPreview(): void {
    this.clearPreviewHideTimer();
  }

  hidePreviewSoon(): void {
    if (this.previewPinned) return;
    this.clearPreviewHideTimer();
    this.previewHideTimer = window.setTimeout(() => {
      this.hidePreview();
    }, 140);
  }

  hidePreview(): void {
    this.clearPreviewHideTimer();
    this.previewPinned = false;
    this.previewItem = null;
    this.previewCell = null;
  }

  openAgendaItem(item: PmConsoleCalendarItem, event: MouseEvent): void {
    event.stopPropagation();
    this.hidePreview();
    this.itemOpen.emit(item);
  }

  calendarEventLabel(item: PmConsoleCalendarItem): string {
    return `${item.label}, ${item.project}, ${this.dateLabel(item.date)}. Open item.`;
  }

  cellAgendaLabel(cell: PmConsoleCalendarCell): string {
    return `${this.dateLabel(cell.key)} has ${cell.items.length} scheduled item${cell.items.length === 1 ? '' : 's'}`;
  }

  summaryItemsLabel(cell: PmConsoleCalendarCell): string {
    return `Show ${cell.items.length} actions on ${this.dateLabel(cell.key)}`;
  }

  itemKindLabel(item: PmConsoleCalendarItem): string {
    const kind = item.kind || 'task';
    return kind
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  actionLabel(item: PmConsoleCalendarItem): string {
    const kind = item.kind || 'task';
    if (kind === 'report') return 'Open report';
    if (kind === 'risk') return 'Open risk';
    if (kind === 'dependency') return 'Open dependency';
    if (kind === 'benefit') return 'Open benefit';
    if (kind === 'milestone' || kind === 'end-product' || kind === 'management-product') return 'Open schedule';
    return 'Open work item';
  }

  dateLabel(date: string): string {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  @HostListener('window:resize')
  handleWindowResize(): void {
    this.hidePreview();
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey(): void {
    this.hidePreview();
  }

  @HostListener('document:click')
  handleDocumentClick(): void {
    this.hidePreview();
  }

  private eventAnchor(event: MouseEvent | FocusEvent): HTMLElement | null {
    return event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  }

  private dayPopoverHeight(cell: PmConsoleCalendarCell): number {
    return Math.min(340, 118 + cell.items.length * 54);
  }

  private clearPreviewHideTimer(): void {
    if (this.previewHideTimer === null) return;
    window.clearTimeout(this.previewHideTimer);
    this.previewHideTimer = null;
  }

  private positionFor(anchor: HTMLElement, width: number, estimatedHeight: number): { top: number; left: number; placement: CalendarPopoverPlacement } {
    const rect = anchor.getBoundingClientRect();
    const margin = 12;
    const gap = 8;
    const placement: CalendarPopoverPlacement = rect.top - estimatedHeight - gap > margin ? 'above' : 'below';
    const rawTop = placement === 'above' ? rect.top - gap : rect.bottom + gap;
    const rawLeft = rect.left + rect.width / 2 - width / 2;
    const top = placement === 'above' ? Math.max(margin, rawTop) : Math.max(margin, Math.min(rawTop, window.innerHeight - estimatedHeight - margin));
    const left = Math.max(margin, Math.min(rawLeft, window.innerWidth - width - margin));
    return { top, left, placement };
  }
}

function filterChangeDetails(event: MouseEvent): HTMLDetailsElement | null {
  return event.currentTarget instanceof HTMLElement ? event.currentTarget.closest('details') : null;
}
