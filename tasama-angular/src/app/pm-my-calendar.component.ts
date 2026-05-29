/**
 * Project Manager - "My Calendar" (Manage My Work) calendar.
 *
 * Project-Manager-specific variant of the shared `PmConsoleWorkCalendarComponent`.
 * It exists ONLY so the PM calendar pills/chips can carry PM-specific styling
 * without affecting the Portfolio Manager calendar (the other consumer of the
 * shared component) or any other module.
 *
 * Behaviour, inputs, outputs and data structures are inherited verbatim from the
 * shared base via `extends` - no business logic is duplicated or changed here.
 * Only the template + scoped styles are owned locally so the visual treatment can
 * diverge safely. Do NOT add behaviour here; behaviour belongs to the shared base.
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleWorkCalendarComponent, type PmConsoleCalendarItem } from './shared/pm-console-work-calendar.component';

export type {
  PmConsoleCalendarTargetType,
  PmConsoleCalendarItem,
  PmConsoleCalendarCell,
  PmConsoleCalendarFilter,
} from './shared/pm-console-work-calendar.component';

@Component({
  selector: 'app-pm-my-calendar',
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
                    [class.is-static]="!isChipClickable(cell.items[0])"
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
                    <span class="calendar-event-title">{{ getCalendarChipType(cell.items[0]) }}</span>
                  </button>

                  <div class="calendar-event-with-more">
                    <button
                      class="calendar-event"
                      [class.is-static]="!isChipClickable(cell.items[1])"
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
                      <span class="calendar-event-title">{{ getCalendarChipType(cell.items[1]) }}</span>
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
                      [class.is-static]="!isChipClickable(item)"
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
                      <span class="calendar-event-title">{{ getCalendarChipType(item) }}</span>
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
        [class.is-static]="!isChipClickable(previewItem)"
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
        (click)="openAgendaItem(previewItem, $event)"
      >
        <span class="calendar-card-top">
          <span class="calendar-popover-kind" [attr.data-event-type]="getCalendarChipType(previewItem)">{{ getCalendarChipType(previewItem) }}</span>
          <!-- Arrow shown on all cards for consistency; click is gated by isChipClickable. -->
          <span class="calendar-card-arrow" pmConsoleIcon="arrow-right" aria-hidden="true"></span>
        </span>
        <span class="calendar-card-title">{{ previewItem.label }}</span>
        <span class="calendar-card-subtitle">{{ itemTargetLabel(previewItem) }}</span>
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
        <div class="calendar-day-card-header">
          <span class="calendar-popover-kind neutral">{{ dateLabel(previewCell.key) }}</span>
          <strong>{{ previewCell.items.length }} item{{ previewCell.items.length === 1 ? '' : 's' }} scheduled</strong>
        </div>
        <div class="calendar-day-agenda-list">
          @for (item of previewCell.items; track item.date + item.label + item.project) {
            <button class="calendar-agenda-card" [class.is-static]="!isChipClickable(item)" [attr.data-event-type]="getCalendarChipType(item)" type="button" (click)="openAgendaItem(item, $event)">
              <span class="calendar-card-top">
                <span class="calendar-popover-kind" [attr.data-event-type]="getCalendarChipType(item)">{{ getCalendarChipType(item) }}</span>
                <span class="calendar-card-arrow" pmConsoleIcon="arrow-right" aria-hidden="true"></span>
              </span>
              <span class="calendar-card-title">{{ item.label }}</span>
              <span class="calendar-card-subtitle">{{ itemTargetLabel(item) }}</span>
            </button>
          }
        </div>
      </aside>
    }

  `,
  styles: [
    `
      /*
       * Host sizing kept self-contained for the PM variant.
       * The shared component relied on a global styles.css rule that targets
       * \`app-pm-console-work-calendar\`; that selector does not match this local
       * element name, so the same flex/height/clipping is declared here to keep
       * the PM "My Calendar" layout identical to before.
       */
      :host {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        max-height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
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

      /*
       * PM "My Calendar" keeps the today DATE HIGHLIGHT (navy day-number badge +
       * cell outline from global styles) but hides only the "Today" text label
       * badge (the global .calendar-cell.today::after pill). Scoped to this
       * component, so PMO / Portfolio calendars are unaffected.
       */
      .calendar-cell.today::after {
        content: none;
        display: none;
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

      /*
       * PM "My Calendar" pill / chip base chrome.
       * Locked locally (not inherited from global styles.css) so the PM pill spec
       * is self-contained and isolated from the shared / Portfolio Manager calendar.
       * Per-status fill, border and text colour are applied by the
       * [data-event-type="..."] rules further down. Shape/typography are defined here.
       */
      .calendar-event {
        align-items: center;
        background: #ffffff;
        border: 1px solid #edf0f6;
        border-radius: 999px;
        box-shadow: 0 4px 10px rgba(25, 33, 61, 0.035);
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        font-size: 10.25px;
        font-weight: 500;
        gap: 6px;
        height: 22px;
        letter-spacing: 0;
        line-height: 1;
        margin-top: 0;
        max-width: calc(100% - 2px);
        min-width: 0;
        overflow: hidden;
        padding: 0 8px;
        position: relative;
        white-space: nowrap;
        /*
         * Keep pills just above the cell background but BELOW overlay UI such as the
         * board/calendar filter dropdown (its stacking context sits at z-index 50).
         * The shared component uses z-index: 70 here, which causes pills to bleed
         * through that dropdown; lowering it to 1 fixes the layering for the PM view.
         */
        z-index: 1;
      }

      .calendar-event-dot {
        border-radius: 999px;
        flex: 0 0 6px;
        height: 6px;
        width: 6px;
      }

      /*
       * Non-actionable pill types (everything except Plans / Status reports) keep
       * their hover preview but are not clickable, so they use the default cursor.
       */
      .calendar-event.is-static,
      .calendar-item-hover-card.is-static,
      .calendar-agenda-card.is-static {
        cursor: default;
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
        max-width: 100%;
        width: 100%;
      }

      .calendar-event-with-more .calendar-event {
        flex: 1 1 auto;
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

      /* Single-pill hover card (Figma "card" design) */
      .calendar-item-hover-card {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 16px;
      }

      /* Shared Figma card content (single-item card + day-agenda cards) */
      .calendar-card-top {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: space-between;
        width: 100%;
      }

      .calendar-card-arrow {
        color: #0b0b0b;
        flex: 0 0 auto;
        height: 16px;
        width: 16px;
      }

      .calendar-card-arrow .icon {
        height: 16px;
        width: 16px;
      }

      .calendar-card-title {
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

      .calendar-card-subtitle {
        color: #777777;
        display: block;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        white-space: nowrap;
        width: 100%;
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

      .calendar-popover-action .icon,
      .calendar-agenda-row .icon {
        height: 14px;
        width: 14px;
      }

      .calendar-popover-tag-row {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        min-width: 0;
      }

      .calendar-popover-kind {
        align-items: center;
        border-radius: 6px;
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        justify-content: center;
        justify-self: start;
        letter-spacing: 0.24px;
        line-height: 16px;
        padding: 2px 6px;
        text-transform: none;
        white-space: nowrap;
      }

      .calendar-popover-context-tag {
        align-items: center;
        background: #fbfcff;
        border: 1px solid #dfe4ee;
        border-radius: 999px;
        color: #3f4654;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 600;
        justify-self: start;
        line-height: 1.2;
        max-width: 100%;
        overflow-wrap: anywhere;
        padding: 5px 8px;
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

      /* Day hover card: header + stacked Figma cards, full-bleed dividers */
      .calendar-day-hover-card {
        display: block;
        gap: 0;
        overflow: hidden;
        padding: 0;
      }

      .calendar-day-card-header {
        align-items: center;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 16px;
      }

      .calendar-day-card-header strong {
        font-size: 13px;
      }

      .calendar-day-agenda-list {
        display: block;
        max-height: 340px;
        overflow-y: auto;
      }

      .calendar-agenda-card {
        background: #ffffff;
        border: 0;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 16px;
        text-align: left;
        transition: background 120ms ease;
        width: 100%;
      }

      .calendar-agenda-card:last-child {
        border-bottom: 0;
      }

      .calendar-agenda-card:hover,
      .calendar-agenda-card:focus-visible {
        background: #f7f9fc;
        outline: 0;
      }

      .calendar-agenda-row {
        align-items: center;
        background: #ffffff;
        border: 1px solid #edf0f6;
        border-radius: 8px;
        color: #303645;
        display: grid;
        gap: 12px;
        grid-template-columns: auto minmax(0, 1fr) auto;
        min-height: 48px;
        padding: 10px 14px;
        text-align: left;
        transition: background 120ms ease, border-color 120ms ease;
      }

      .calendar-agenda-row.blue {
        background: #ffffff;
        border-color: #e3ebfc;
      }

      .calendar-agenda-row.red {
        background: #ffffff;
        border-color: #fcdbd9;
      }

      .calendar-agenda-row.green {
        background: #ffffff;
        border-color: #d1f2e1;
      }

      .calendar-agenda-row:hover,
      .calendar-agenda-row:focus-visible {
        background: #f7f9fc;
        border-color: #cbd5e1;
        outline: 0;
      }

      .calendar-agenda-row.blue:hover,
      .calendar-agenda-row.blue:focus-visible {
        background: #f5f8ff;
        border-color: #b8caff;
      }

      .calendar-agenda-row.red:hover,
      .calendar-agenda-row.red:focus-visible {
        background: #fff5f4;
        border-color: #ffa8a1;
      }

      .calendar-agenda-row.green:hover,
      .calendar-agenda-row.green:focus-visible {
        background: #f2fcf7;
        border-color: #a3e2c3;
      }

      .calendar-agenda-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .calendar-agenda-title {
        color: #0b0b0b;
        display: block;
        font-size: 12.5px;
        font-weight: 600;
        line-height: 1.4;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .calendar-agenda-subtitle {
        color: #536071;
        display: block;
        font-size: 11px;
        font-weight: 400;
        line-height: 1.4;
        margin-top: 2px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        background: rgba(141, 200, 232, 0.1) !important;
        border-color: rgba(141, 200, 232, 0.25) !important;
        color: #8dc8e8 !important;
      }
      .calendar-event[data-event-type="Plans"] .calendar-event-dot {
        background: #8dc8e8 !important;
      }

      .calendar-event[data-event-type="Governance Committees"] {
        background: rgba(52, 84, 196, 0.1) !important;
        border-color: rgba(52, 84, 196, 0.25) !important;
        color: #3454c4 !important;
      }
      .calendar-event[data-event-type="Governance Committees"] .calendar-event-dot {
        background: #3454c4 !important;
      }

      .calendar-event[data-event-type="Status reports"] {
        background: rgba(111, 32, 149, 0.1) !important;
        border-color: rgba(111, 32, 149, 0.25) !important;
        color: #6f2095 !important;
      }
      .calendar-event[data-event-type="Status reports"] .calendar-event-dot {
        background: #6f2095 !important;
      }

      .calendar-event[data-event-type="Change requests"] {
        background: rgba(196, 52, 114, 0.1) !important;
        border-color: rgba(196, 52, 114, 0.25) !important;
        color: #c43472 !important;
      }
      .calendar-event[data-event-type="Change requests"] .calendar-event-dot {
        background: #c43472 !important;
      }

      .calendar-event[data-event-type="Benefits"] {
        background: rgba(22, 107, 73, 0.1) !important;
        border-color: rgba(22, 107, 73, 0.25) !important;
        color: #166b49 !important;
      }
      .calendar-event[data-event-type="Benefits"] .calendar-event-dot {
        background: #166b49 !important;
      }

      /* Hover-card type tags — colors per the Figma card designs. Note: the Plans
         card tag uses a deeper blue (#3188b5) than the inline pill (#8dc8e8). */
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
        background: rgba(196, 52, 114, 0.1) !important;
        color: #c43472 !important;
      }
      .calendar-popover-kind[data-event-type="Benefits"] {
        background: rgba(22, 108, 73, 0.1) !important;
        color: #166c49 !important;
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
export class PmMyCalendarComponent extends PmConsoleWorkCalendarComponent {
  /**
   * In the PM "My Calendar" only Plans and Status reports are actionable; clicking
   * any other pill type (Benefits, Governance Committees, …) does nothing. Hover
   * previews remain available for every type.
   */
  isChipClickable(item: PmConsoleCalendarItem): boolean {
    const type = this.getCalendarChipType(item);
    return type === 'Plans' || type === 'Status reports';
  }

  override openAgendaItem(item: PmConsoleCalendarItem, event: MouseEvent): void {
    if (!this.isChipClickable(item)) {
      // Swallow the click for non-actionable types so nothing opens.
      event.stopPropagation();
      return;
    }
    super.openAgendaItem(item, event);
  }
}

