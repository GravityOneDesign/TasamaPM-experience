import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export type PmConsoleCalendarTargetType = 'portfolio' | 'program' | 'project';

export interface PmConsoleCalendarItem {
  id?: string;
  date: string;
  label: string;
  tone: string;
  project: string;
  targetType?: PmConsoleCalendarTargetType;
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

interface CalendarPopoverPosition {
  top: number;
  left: number;
  arrowLeft: number;
  placement: CalendarPopoverPlacement;
}

@Component({
  selector: 'app-pm-console-work-calendar',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="timeline-calendar">
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
        @if (showFilterBar) {
          <div class="calendar-filter-bar" aria-label="Calendar filters">
            <span class="calendar-filter-label">SHOW</span>
            <details class="calendar-filter-dropdown">
              <summary [attr.aria-label]="'Filter calendar by ' + selectedFilterLabel">
                <span class="calendar-filter-icon" [pmConsoleIcon]="selectedFilterIcon" aria-hidden="true"></span>
                <span>{{ selectedFilterLabel }}</span>
                <strong>{{ selectedFilterCount }}</strong>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </summary>
              <div class="calendar-filter-menu" role="menu">
                @for (filter of filters; track filter.id) {
                  <button
                    [class.active]="filter.id === selectedFilterId"
                    type="button"
                    role="menuitemradio"
                    [attr.aria-checked]="filter.id === selectedFilterId"
                    (click)="selectFilter(filter.id, $event)"
                  >
                    <span class="calendar-filter-icon" [pmConsoleIcon]="filter.icon" aria-hidden="true"></span>
                    <span>{{ filter.label }}</span>
                    <strong>{{ filter.count }}</strong>
                  </button>
                }
              </div>
            </details>
          </div>
        }
      </div>
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
            (mouseenter)="queueCellPreview(cell, $event)"
            (mouseleave)="hidePreviewSoon()"
          >
            <span class="calendar-day-number">{{ cell.day }}</span>
            @if (cell.items.length) {
              <div class="calendar-event-stack" [attr.aria-label]="cellAgendaLabel(cell)">
                @if (isCollapsedCell(cell)) {
                  <button
                    class="calendar-event"
                    [attr.data-event-type]="getCalendarChipType(cell.items[0])"
                    type="button"
                    [attr.aria-label]="calendarEventLabel(cell.items[0])"
                    [attr.title]="cell.items[0].project"
                    (mouseenter)="queueDayPreview(cell, $event)"
                    (mouseleave)="hidePreviewSoon()"
                    (focus)="showDayPreview(cell, $event)"
                    (blur)="hidePreviewSoon()"
                    (click)="openAgendaItem(cell.items[0], $event)"
                  >
                    <span class="calendar-event-dot"></span>
                    <span class="calendar-event-title">{{ calendarChipLabel(cell.items[0]) }}</span>
                  </button>

                  <div class="calendar-event-with-more">
                    <button
                      class="calendar-event"
                      [attr.data-event-type]="getCalendarChipType(cell.items[1])"
                      type="button"
                      [attr.aria-label]="calendarEventLabel(cell.items[1])"
                      [attr.title]="cell.items[1].project"
                      (mouseenter)="queueDayPreview(cell, $event)"
                      (mouseleave)="hidePreviewSoon()"
                      (focus)="showDayPreview(cell, $event)"
                      (blur)="hidePreviewSoon()"
                      (click)="openAgendaItem(cell.items[1], $event)"
                    >
                      <span class="calendar-event-dot"></span>
                      <span class="calendar-event-title">{{ calendarChipLabel(cell.items[1]) }}</span>
                    </button>
                    <button
                      class="calendar-more-badge"
                      type="button"
                      [attr.aria-label]="summaryItemsLabel(cell)"
                      (click)="showDayPreviewFromClick(cell, $event)"
                      (mouseenter)="queueDayPreview(cell, $event)"
                      (mouseleave)="hidePreviewSoon()"
                    >
                      +{{ cell.items.length - 2 }}
                    </button>
                  </div>
                } @else {
                  @for (item of visibleCellItems(cell); track item.date + item.label + item.project) {
                    <button
                      class="calendar-event"
                      [attr.data-event-type]="getCalendarChipType(item)"
                      type="button"
                      [attr.aria-label]="calendarEventLabel(item)"
                      [attr.title]="item.label"
                      (mouseenter)="queueItemPreview(item, $event)"
                      (mouseleave)="hidePreviewSoon()"
                      (focus)="showItemPreview(item, $event)"
                      (blur)="hidePreviewSoon()"
                      (click)="openAgendaItem(item, $event)"
                    >
                      <span class="calendar-event-dot"></span>
                      <span class="calendar-event-title">{{ calendarChipLabel(item) }}</span>
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
        [style.--calendar-popover-arrow-left]="previewArrowLeft + 'px'"
        (mouseenter)="keepPreview()"
        (mouseleave)="hidePreviewSoon()"
        (focusin)="keepPreview()"
        (focusout)="hidePreviewSoon()"
        (click)="$event.stopPropagation()"
      >
        <div class="calendar-popover-tag-row">
          <span class="calendar-popover-kind" [attr.data-event-type]="getCalendarChipType(previewItem)">{{ calendarChipLabel(previewItem) }}</span>
          <span class="calendar-popover-arrow" pmConsoleIcon="arrow-right" aria-hidden="true"></span>
        </div>
        <strong>{{ previewTitle(previewItem) }}</strong>
        <p>{{ previewSubtitle(previewItem) }}</p>
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
        [style.--calendar-popover-arrow-left]="previewArrowLeft + 'px'"
        (mouseenter)="keepPreview()"
        (mouseleave)="hidePreviewSoon()"
        (focusin)="keepPreview()"
        (focusout)="hidePreviewSoon()"
        (click)="$event.stopPropagation()"
      >
        <div class="calendar-hover-header">
          <span class="hover-date">{{ dateLabel(previewCell.key) }}</span>
          <span class="hover-count">{{ previewCell.items.length }} item{{ previewCell.items.length === 1 ? '' : 's' }}</span>
        </div>
        <div class="calendar-day-agenda-list preview-agenda-list">
          @for (item of previewCell.items; track item.date + item.label + item.project; let last = $last) {
            <button class="calendar-agenda-row" [class.is-last]="last" type="button" (click)="openAgendaItem(item, $event)">
              <div class="agenda-row-header">
                <span class="calendar-popover-kind" [attr.data-event-type]="getCalendarChipType(item)">{{ getCalendarChipType(item) }}</span>
                <span class="arrow-icon" pmConsoleIcon="arrow-right" aria-hidden="true"></span>
              </div>
              <span class="agenda-row-title">{{ item.label }}</span>
              <span class="agenda-row-subtitle">Project : {{ item.project }}</span>
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
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: visible;
        position: relative;
      }

      .timeline-calendar {
        flex: 1 1 auto;
        height: 100%;
        min-height: 0;
      }

      .calendar-cell {
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
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        width: 100%;
      }

      .calendar-event {
        align-items: center;
        border: 0;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-flex;
        font-size: 10px;
        font-weight: 500;
        height: 18px;
        justify-content: center;
        letter-spacing: 0.24px;
        line-height: 16px;
        margin-top: 0;
        max-width: calc(100% - 2px);
        min-width: 0;
        overflow: hidden;
        padding: 1px 5px;
        position: relative;
        text-transform: none;
        width: fit-content;
        z-index: 70;
      }

      .calendar-event-dot {
        display: none;
      }

      .calendar-event-title {
        display: block;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

      .calendar-event-with-more {
        align-items: center;
        display: flex;
        gap: 4px;
        justify-content: flex-start;
        max-width: 100%;
        width: 100%;
      }

      .calendar-event-with-more .calendar-event {
        flex: 0 1 auto;
        max-width: calc(100% - 32px);
        min-width: 0;
      }

      .calendar-more-badge {
        align-items: center;
        background: #f7f7ff;
        border: 1px solid rgba(16, 6, 159, 0.24);
        border-radius: 999px;
        color: #10069f;
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 9px;
        font-weight: 700;
        height: 18px;
        justify-content: center;
        min-width: 18px;
        padding: 0 4px;
        transition: all 120ms ease;
      }

      .calendar-more-badge:hover {
        background: #f1f0ff;
        border-color: rgba(16, 6, 159, 0.32);
        color: #1c16b8;
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

      .calendar-filter-bar {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        gap: 12px;
        justify-content: flex-end;
        min-width: 0;
      }

      .calendar-filter-label {
        color: #596273;
        flex: 0 0 auto;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 16px;
      }

      .calendar-filter-dropdown {
        flex: 0 0 auto;
        position: relative;
      }

      .calendar-filter-dropdown summary {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 999px;
        color: #404756;
        cursor: pointer;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        height: 36px;
        justify-content: center;
        list-style: none;
        min-width: 154px;
        padding: 0 12px;
      }

      .calendar-filter-dropdown summary::-webkit-details-marker {
        display: none;
      }

      .calendar-filter-dropdown summary:focus-visible {
        outline: 2px solid rgba(16, 6, 159, 0.18);
        outline-offset: 2px;
      }

      .calendar-filter-dropdown summary > .icon:last-child {
        color: #8290a4;
        height: 14px;
        margin-left: auto;
        width: 14px;
      }

      .calendar-filter-icon {
        color: #10069f;
        flex: 0 0 auto;
        height: 16px;
        width: 16px;
      }

      .calendar-filter-dropdown strong {
        align-items: center;
        background: #edf0f7;
        border-radius: 999px;
        color: #6b7484;
        display: inline-flex;
        font-size: 10px;
        font-weight: 600;
        height: 20px;
        justify-content: center;
        min-width: 20px;
        padding: 0 6px;
      }

      .calendar-filter-menu {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 10px;
        box-shadow: 0 18px 36px rgba(25, 33, 61, 0.14);
        display: grid;
        gap: 3px;
        padding: 6px;
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        width: 220px;
        z-index: 60;
      }

      .calendar-filter-menu button {
        align-items: center;
        border-radius: 8px;
        color: #404756;
        display: grid;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        grid-template-columns: 18px minmax(0, 1fr) auto;
        min-height: 34px;
        padding: 0 8px;
        text-align: left;
      }

      .calendar-filter-menu button:hover,
      .calendar-filter-menu button:focus-visible,
      .calendar-filter-menu button.active {
        background: #f5f6ff;
        color: #10069f;
        outline: 0;
      }

      .calendar-hover-card {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        box-shadow: 0 18px 40px rgba(25, 33, 61, 0.18);
        color: #252a34;
        max-width: 370px;
        min-width: 248px;
        padding: 12px;
        position: fixed;
        z-index: 120;
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

      .calendar-item-hover-card {
        border: 0;
        border-bottom: 1px solid #eeeeee;
        border-radius: 0;
        box-shadow: 0 10px 24px rgba(25, 33, 61, 0.12);
        gap: 4px;
        max-width: 324px;
        min-width: 324px;
        padding: 10px 16px;
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
        left: var(--calendar-popover-arrow-left, 24px);
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

      .calendar-item-hover-card::after {
        display: none;
      }

      .calendar-popover-action .icon,
      .calendar-agenda-row .icon {
        height: 14px;
        width: 14px;
      }

      .calendar-popover-tag-row {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: space-between;
        min-width: 0;
        width: 100%;
      }

      .calendar-popover-kind {
        align-items: center;
        border-radius: 6px;
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        justify-self: start;
        letter-spacing: 0.24px;
        line-height: 16px;
        padding: 2px 6px;
        text-transform: none;
        white-space: nowrap;
      }

      .calendar-popover-arrow {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        height: 16px;
        justify-content: center;
        width: 16px;
      }

      .calendar-popover-arrow .icon {
        height: 16px;
        width: 16px;
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
        color: #0b0b0b;
        display: block;
        font-size: 13px;
        font-weight: 600;
        line-height: 20px;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      .calendar-hover-card p {
        color: #777777;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        margin: 0;
        text-transform: capitalize;
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
        border-radius: 999px;
        color: #303645;
        display: inline-flex;
        font-size: 13px;
        font-weight: 600;
        gap: 8px;
        height: 36px;
        justify-content: center;
        justify-self: start;
        padding: 0 16px;
      }

      .calendar-popover-action:hover,
      .calendar-popover-action:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.22);
        color: #10069f;
        outline: 0;
      }

      .calendar-day-hover-card {
        padding: 0;
        gap: 0;
        border-radius: 12px;
        overflow: hidden;
      }

      .calendar-hover-header {
        background: #f4f4f5;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dfe4ee;
      }

      .calendar-hover-header .hover-date {
        font-weight: 500;
        color: #111827;
        font-size: 13px;
      }

      .calendar-hover-header .hover-count {
        color: #4b5563;
        font-size: 12px;
      }

      .calendar-day-agenda-list {
        display: flex;
        flex-direction: column;
        background: #ffffff;
        max-height: 400px;
        overflow-y: auto;
      }

      .calendar-agenda-row {
        background: #ffffff;
        border: none;
        border-bottom: 1px solid #edf0f6;
        border-radius: 0;
        color: #303645;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        text-align: left;
        transition: background 120ms ease;
        width: 100%;
        cursor: pointer;
      }

      .calendar-agenda-row.is-last {
        border-bottom: none;
      }

      .calendar-agenda-row:hover,
      .calendar-agenda-row:focus-visible {
        background: #f7f9fc;
        outline: 0;
      }

      .agenda-row-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .agenda-row-header .arrow-icon {
        color: #1f4fb8;
        height: 16px;
        width: 16px;
      }

      .agenda-row-title {
        color: #0b0b0b;
        display: block;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.4;
      }

      .agenda-row-subtitle {
        color: #8290a4;
        display: block;
        font-size: 12px;
        font-weight: 400;
        line-height: 1.4;
      }

      .calendar-agenda-cta {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        font-size: 11.5px;
        font-weight: 600;
        gap: 4px;
        justify-content: flex-end;
        min-width: 0;
        white-space: nowrap;
      }

      .calendar-agenda-cta:hover {
        color: #1c16b8;
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
        .calendar-filter-bar {
          align-items: stretch;
          width: 100%;
        }

        .calendar-filter-dropdown,
        .calendar-filter-dropdown summary {
          width: 100%;
        }

        .calendar-filter-menu {
          left: 0;
          right: auto;
          width: min(260px, 100%);
        }

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

        .calendar-event:not(.calendar-action-summary) .calendar-event-title {
          display: none;
        }

        .calendar-summary-count {
          display: inline-flex;
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

      /* Custom Event Type styles for Calendar Chips/Pills & Popovers */
      .calendar-event[data-event-type="Plans"] {
        background: rgba(49, 136, 181, 0.09) !important;
        border-color: rgba(141, 200, 232, 0.225) !important;
        color: #3188b5 !important;
      }
      .calendar-event[data-event-type="Plans"] .calendar-event-dot {
        background: #3188b5 !important;
      }

      .calendar-event[data-event-type="Governance Committees"] {
        background: rgba(52, 84, 196, 0.09) !important;
        border-color: rgba(52, 84, 196, 0.225) !important;
        color: #3454c4 !important;
      }
      .calendar-event[data-event-type="Governance Committees"] .calendar-event-dot {
        background: #3454c4 !important;
      }

      .calendar-event[data-event-type="Status reports"] {
        background: rgba(111, 32, 149, 0.09) !important;
        border-color: rgba(111, 32, 149, 0.225) !important;
        color: #6f2095 !important;
      }
      .calendar-event[data-event-type="Status reports"] .calendar-event-dot {
        background: #6f2095 !important;
      }

      .calendar-event[data-event-type="Change requests"] {
        background: rgba(229, 144, 47, 0.09) !important;
        border-color: rgba(229, 144, 47, 0.225) !important;
        color: #e5902f !important;
      }
      .calendar-event[data-event-type="Change requests"] .calendar-event-dot {
        background: #e5902f !important;
      }

      .calendar-event[data-event-type="Benefits"] {
        background: rgba(22, 107, 73, 0.09) !important;
        border-color: rgba(22, 107, 73, 0.225) !important;
        color: #166b49 !important;
      }
      .calendar-event[data-event-type="Benefits"] .calendar-event-dot {
        background: #166b49 !important;
      }

      /* Popover kinds */
      .calendar-popover-kind[data-event-type="Plans"] {
        background: rgba(49, 136, 181, 0.1) !important;
        color: #3188b5 !important;
      }
      .calendar-popover-kind[data-event-type="Governance Committees"] {
        background: rgba(52, 84, 196, 0.1) !important;
        color: #3454c4 !important;
      }
      .calendar-popover-kind[data-event-type="Status reports"] {
        background: rgba(111, 32, 149, 0.1) !important;
        color: #6f2095 !important;
      }
      .calendar-popover-kind[data-event-type="Change requests"] {
        background: rgba(229, 144, 47, 0.1) !important;
        color: #e5902f !important;
      }
      .calendar-popover-kind[data-event-type="Benefits"] {
        background: rgba(22, 107, 73, 0.1) !important;
        color: #166b49 !important;
      }

      /* Agenda rows */
      .calendar-agenda-row[data-event-type="Plans"] {
        background: #ffffff !important;
        border-color: rgba(141, 200, 232, 0.25) !important;
      }
      .calendar-agenda-row[data-event-type="Plans"] .calendar-event-dot {
        background: #8dc8e8 !important;
      }
      .calendar-agenda-row[data-event-type="Plans"]:hover {
        background: rgba(141, 200, 232, 0.05) !important;
        border-color: rgba(141, 200, 232, 0.4) !important;
      }

      .calendar-agenda-row[data-event-type="Governance Committees"] {
        background: #ffffff !important;
        border-color: rgba(52, 84, 196, 0.25) !important;
      }
      .calendar-agenda-row[data-event-type="Governance Committees"] .calendar-event-dot {
        background: #3454c4 !important;
      }
      .calendar-agenda-row[data-event-type="Governance Committees"]:hover {
        background: rgba(52, 84, 196, 0.05) !important;
        border-color: rgba(52, 84, 196, 0.4) !important;
      }

      .calendar-agenda-row[data-event-type="Status reports"] {
        background: #ffffff !important;
        border-color: rgba(111, 32, 149, 0.25) !important;
      }
      .calendar-agenda-row[data-event-type="Status reports"] .calendar-event-dot {
        background: #6f2095 !important;
      }
      .calendar-agenda-row[data-event-type="Status reports"]:hover {
        background: rgba(111, 32, 149, 0.05) !important;
        border-color: rgba(111, 32, 149, 0.4) !important;
      }

      .calendar-agenda-row[data-event-type="Change requests"] {
        background: #ffffff !important;
        border-color: rgba(196, 52, 114, 0.25) !important;
      }
      .calendar-agenda-row[data-event-type="Change requests"] .calendar-event-dot {
        background: #c43472 !important;
      }
      .calendar-agenda-row[data-event-type="Change requests"]:hover {
        background: rgba(196, 52, 114, 0.05) !important;
        border-color: rgba(196, 52, 114, 0.4) !important;
      }

      .calendar-agenda-row[data-event-type="Benefits"] {
        background: #ffffff !important;
        border-color: rgba(22, 107, 73, 0.25) !important;
      }
      .calendar-agenda-row[data-event-type="Benefits"] .calendar-event-dot {
        background: #166b49 !important;
      }
      .calendar-agenda-row[data-event-type="Benefits"]:hover {
        background: rgba(22, 107, 73, 0.05) !important;
        border-color: rgba(22, 107, 73, 0.4) !important;
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
  @Input() showFilterBar = true;
  @Input() truncateInlineLabels = false;

  @Output() readonly monthShift = new EventEmitter<number>();
  @Output() readonly filterChange = new EventEmitter<string>();
  @Output() readonly itemOpen = new EventEmitter<PmConsoleCalendarItem>();

  readonly maxInlineItems = 2;
  readonly maxSummaryDots = 3;
  readonly maxInlineLabelLength = 22;

  previewItem: PmConsoleCalendarItem | null = null;
  previewCell: PmConsoleCalendarCell | null = null;
  previewTop = 0;
  previewLeft = 0;
  previewArrowLeft = 24;
  previewPlacement: CalendarPopoverPlacement = 'above';

  private previewHideTimer: number | null = null;
  private previewShowTimer: number | null = null;
  private previewPinned = false;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnDestroy(): void {
    this.clearPreviewHideTimer();
    this.clearPreviewShowTimer();
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

  queueItemPreview(item: PmConsoleCalendarItem, event: MouseEvent): void {
    this.queuePreview(event, (anchor) => this.showItemPreviewFromAnchor(item, anchor));
  }

  showItemPreview(item: PmConsoleCalendarItem, event: MouseEvent | FocusEvent): void {
    const anchor = this.eventAnchor(event);
    if (!anchor) return;
    this.showItemPreviewFromAnchor(item, anchor);
  }

  private showItemPreviewFromAnchor(item: PmConsoleCalendarItem, anchor: HTMLElement): void {
    this.previewPinned = false;
    this.keepPreview();
    const position = this.positionFor(anchor, 370, 156);
    this.previewItem = item;
    this.previewCell = null;
    this.previewTop = position.top;
    this.previewLeft = position.left;
    this.previewArrowLeft = position.arrowLeft;
    this.previewPlacement = position.placement;
    this.changeDetectorRef.markForCheck();
  }

  queueDayPreview(cell: PmConsoleCalendarCell, event: MouseEvent): void {
    this.queuePreview(event, (anchor) => this.showDayPreviewFromAnchor(cell, anchor));
  }

  showDayPreview(cell: PmConsoleCalendarCell, event: MouseEvent | FocusEvent): void {
    const anchor = this.eventAnchor(event);
    if (!anchor) return;
    this.showDayPreviewFromAnchor(cell, anchor);
  }

  private showDayPreviewFromAnchor(cell: PmConsoleCalendarCell, anchor: HTMLElement): void {
    this.previewPinned = false;
    this.keepPreview();
    const position = this.positionFor(anchor, 370, this.dayPopoverHeight(cell));
    this.previewItem = null;
    this.previewCell = cell;
    this.previewTop = position.top;
    this.previewLeft = position.left;
    this.previewArrowLeft = position.arrowLeft;
    this.previewPlacement = position.placement;
    this.changeDetectorRef.markForCheck();
  }

  queueCellPreview(cell: PmConsoleCalendarCell, event: MouseEvent): void {
    if (cell.items.length < 2) return;
    this.queueDayPreview(cell, event);
  }

  showDayPreviewFromClick(cell: PmConsoleCalendarCell, event: MouseEvent): void {
    event.stopPropagation();
    this.clearPreviewShowTimer();
    this.showDayPreview(cell, event);
    this.previewPinned = true;
  }

  keepPreview(): void {
    this.clearPreviewShowTimer();
    this.clearPreviewHideTimer();
  }

  hidePreviewSoon(): void {
    this.clearPreviewShowTimer();
    if (this.previewPinned) return;
    this.clearPreviewHideTimer();
    this.previewHideTimer = window.setTimeout(() => {
      this.hidePreview();
    }, 140);
  }

  hidePreview(): void {
    this.clearPreviewShowTimer();
    this.clearPreviewHideTimer();
    this.previewPinned = false;
    this.previewItem = null;
    this.previewCell = null;
    this.changeDetectorRef.markForCheck();
  }

  openAgendaItem(item: PmConsoleCalendarItem, event: MouseEvent): void {
    event.stopPropagation();
    this.hidePreview();
    this.itemOpen.emit(item);
  }

  calendarEventLabel(item: PmConsoleCalendarItem): string {
    return `${item.label}, ${this.itemTargetLabel(item)}, ${this.dateLabel(item.date)}. Open item.`;
  }

  calendarEventTitle(item: PmConsoleCalendarItem): string {
    const label = item.label.trim();
    if (label.length <= this.maxInlineLabelLength) return label;
    return `${label.slice(0, this.maxInlineLabelLength).trimEnd()}...`;
  }

  calendarEventProjectTitle(item: PmConsoleCalendarItem): string {
    const project = item.project.trim();
    if (project.length <= this.maxInlineLabelLength) return project;
    return `${project.slice(0, this.maxInlineLabelLength).trimEnd()}...`;
  }

  cellAgendaLabel(cell: PmConsoleCalendarCell): string {
    return `${this.dateLabel(cell.key)} has ${cell.items.length} scheduled item${cell.items.length === 1 ? '' : 's'}`;
  }

  summaryItemsLabel(cell: PmConsoleCalendarCell): string {
    return `Show ${cell.items.length} actions on ${this.dateLabel(cell.key)}`;
  }

  getCalendarChipType(item: PmConsoleCalendarItem): string {
    const kind = item.kind || 'task';
    if (kind === 'report') return 'Status reports';
    if (kind === 'benefit') return 'Benefits';
    if (kind === 'change') return 'Change requests';
    if (kind === 'governance' || kind === 'risk') return 'Governance Committees';
    return 'Plans';
  }

  calendarChipLabel(item: PmConsoleCalendarItem): string {
    const kind = item.kind || 'task';
    if (kind === 'report') return 'Status report';
    if (kind === 'benefit') return 'Benefit';
    if (kind === 'change') return 'Change request';
    if (kind === 'governance' || kind === 'risk') return 'Governance committee';
    return 'Project Plan';
  }

  previewTitle(item: PmConsoleCalendarItem): string {
    const kind = item.kind || 'task';
    if (kind === 'report' || kind === 'plan') return item.project;
    return item.label;
  }

  previewSubtitle(item: PmConsoleCalendarItem): string {
    const kind = item.kind || 'task';
    if (kind === 'report') return 'Portfolio Status Report';
    if (kind === 'governance' || kind === 'risk') return 'Forum Name';
    if (kind === 'plan') return 'Project Plan';
    return `Project : ${item.project}`;
  }

  itemKindLabel(item: PmConsoleCalendarItem): string {
    const kind = item.kind || 'task';
    return kind
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  itemTargetLabel(item: PmConsoleCalendarItem): string {
    return `${this.targetTypeLabel(item.targetType)}: ${item.project}`;
  }

  targetTypeLabel(targetType: PmConsoleCalendarTargetType = 'project'): string {
    return targetType.charAt(0).toUpperCase() + targetType.slice(1);
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
    return Math.min(460, 56 + cell.items.length * 138);
  }

  private clearPreviewHideTimer(): void {
    if (this.previewHideTimer === null) return;
    window.clearTimeout(this.previewHideTimer);
    this.previewHideTimer = null;
  }

  private clearPreviewShowTimer(): void {
    if (this.previewShowTimer === null) return;
    window.clearTimeout(this.previewShowTimer);
    this.previewShowTimer = null;
  }

  private queuePreview(event: MouseEvent, showPreview: (anchor: HTMLElement) => void): void {
    this.previewPinned = false;
    this.clearPreviewShowTimer();
    this.clearPreviewHideTimer();
    const anchor = this.eventAnchor(event);
    if (!anchor) return;
    this.previewShowTimer = window.setTimeout(() => {
      this.previewShowTimer = null;
      showPreview(anchor);
    }, 80);
  }

  private positionFor(anchor: HTMLElement, width: number, estimatedHeight: number): CalendarPopoverPosition {
    const rect = anchor.getBoundingClientRect();
    const calendarRect = this.elementRef.nativeElement.getBoundingClientRect();
    const containingBlockOffset = this.fixedContainingBlockOffset();
    const margin = 12;
    const gap = 8;
    const arrowSize = 10;
    const minTop = calendarRect.top + margin;
    const maxTop = calendarRect.bottom - margin;
    
    const placement: CalendarPopoverPlacement = rect.top - estimatedHeight - gap > minTop ? 'above' : 'below';
    const rawTop = placement === 'above' ? rect.top - gap : rect.bottom + gap;
    const rawLeft = rect.left + rect.width / 2 - width / 2;
    
    const viewportTop = placement === 'above' ? Math.max(minTop, rawTop) : Math.max(minTop, Math.min(rawTop, maxTop - estimatedHeight));
    
    const minLeft = calendarRect.left + margin;
    const maxLeft = calendarRect.right - margin;
    const viewportLeft = Math.max(minLeft, Math.min(rawLeft, maxLeft - width));
    
    const anchorCenter = rect.left + rect.width / 2;
    const arrowLeft = Math.max(16, Math.min(anchorCenter - viewportLeft - arrowSize / 2, width - 26));
    const top = viewportTop - containingBlockOffset.top;
    const left = viewportLeft - containingBlockOffset.left;
    return { top, left, arrowLeft, placement };
  }

  private fixedContainingBlockOffset(): { left: number; top: number } {
    let element = this.elementRef.nativeElement.parentElement;
    while (element && element !== document.documentElement) {
      const style = window.getComputedStyle(element);
      const willChange = style.willChange.split(',').map((property) => property.trim());
      const createsFixedContainingBlock =
        style.transform !== 'none' ||
        style.filter !== 'none' ||
        style.perspective !== 'none' ||
        style.contain.includes('paint') ||
        style.contain.includes('layout') ||
        style.contain.includes('strict') ||
        style.contain.includes('content') ||
        willChange.includes('transform') ||
        willChange.includes('filter') ||
        willChange.includes('perspective');

      if (createsFixedContainingBlock) {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, top: rect.top };
      }

      element = element.parentElement;
    }

    return { left: 0, top: 0 };
  }
}

function filterChangeDetails(event: MouseEvent): HTMLDetailsElement | null {
  return event.currentTarget instanceof HTMLElement ? event.currentTarget.closest('details') : null;
}
