import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ContentChild,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';
import { PmConsoleExpandableSearchComponent } from './pm-console-expandable-search.component';
import { PmConsoleRowActionMenuComponent } from './pm-console-row-action-menu.component';
import { PmConsoleStatusPillComponent } from './pm-console-status-pill.component';
import { PmConsoleToolbarComponent } from './pm-console-toolbar.component';

export interface PmConsoleRegisterTableColumn {
  id: string;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface PmConsoleRegisterTableMenuItem {
  id: string;
  label: string;
  icon?: string;
  tone?: string;
  ariaLabel?: string;
}

export interface PmConsoleRegisterTableTrendItem {
  label: string;
  icon?: string;
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
  ariaLabel?: string;
}

export interface PmConsoleRegisterTableCell {
  kind: 'text' | 'primary' | 'status' | 'budget' | 'person' | 'action' | 'iconAction' | 'menu' | 'checkbox' | 'tags' | 'trend' | 'chip-text';
  text?: string;
  title?: string;
  subtitle?: string;
  label?: string;
  value?: string;
  suffix?: string;
  icon?: string;
  tone?: string;
  items?: string[];
  trend?: readonly PmConsoleRegisterTableTrendItem[];
  actions?: PmConsoleRegisterTableMenuItem[];
  initials?: string;
  handle?: string;
  avatarUrl?: string;
  checked?: boolean;
  muted?: boolean;
  strong?: boolean;
  wrap?: boolean;
  clampLines?: number;
  ariaLabel?: string;
  prefixIcon?: string;
  tag?: string;
  tagTone?: string;
  chipLabel?: string;
  chipTone?: 'portfolio' | 'program' | 'project';
  indentLevel?: number;
  alert?: boolean;
  alertLabel?: string;
}

export interface PmConsoleRegisterTableRow {
  id: string;
  ariaLabel?: string;
  clickable?: boolean;
  selected?: boolean;
  expanded?: boolean;
  cells: Record<string, PmConsoleRegisterTableCell>;
}

export interface PmConsoleRegisterTableActionEvent {
  row: PmConsoleRegisterTableRow;
  column: PmConsoleRegisterTableColumn;
  cell: PmConsoleRegisterTableCell;
  action?: PmConsoleRegisterTableMenuItem;
}

type ColumnMotionState = 'visible' | 'entering' | 'exiting';
type RegisterTableSearchVariant = 'button' | 'workspace';

const COLUMN_MOTION_MS = 280;
let registerTableInstance = 0;

@Component({
  selector: 'app-pm-console-register-table',
  standalone: true,
  imports: [CommonModule, PmConsoleExpandableSearchComponent, PmConsoleIconComponent, PmConsoleRowActionMenuComponent, PmConsoleStatusPillComponent, PmConsoleToolbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-height: 0;
        min-width: 0;
      }

      .pm-main-register-table-view {
        display: grid;
        gap: 12px;
        grid-template-rows: auto minmax(0, 1fr);
        height: 100%;
        min-height: 0;
        min-width: 0;
      }

      .pm-main-register-table-view.without-toolbar {
        grid-template-rows: minmax(0, 1fr);
      }

      .pm-register-toolbar-label {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        min-width: 0;
      }

      .pm-main-register-table {
        min-width: var(--register-table-min-width, 980px);
        width: 100%;
      }

      .pm-main-register-table-scroll {
        height: var(--register-table-scroll-height, 100%);
        min-height: var(--register-table-scroll-min-height, 475px);
      }

      .pm-main-register-table-row.is-clickable {
        cursor: pointer;
      }

      .pm-main-register-table-row.is-clickable:hover td {
        background: #fbfcff;
      }

      .pm-main-register-table-row.is-clickable:focus-visible {
        outline: 2px solid rgba(16, 6, 159, 0.22);
        outline-offset: -2px;
      }

      .pm-main-register-table .pm-table-column-cell.align-right .pm-table-column-frame {
        justify-content: flex-end;
      }

      .pm-main-register-table .pm-table-column-cell.align-center .pm-table-column-frame {
        justify-content: center;
      }

      .pm-main-register-table .pm-table-column-cell.pm-table-actions-cell {
        overflow: visible;
      }

      .pm-main-register-table .pm-table-column-cell:not(.is-entering):not(.is-exiting) {
        min-width: var(--column-open-width, 150px);
      }

      .pm-main-register-table .pm-table-trend-cell:not(.is-entering):not(.is-exiting) {
        max-width: 286px;
        min-width: 286px;
        width: 286px;
      }

      .pm-main-register-table .pm-table-menu-frame {
        overflow: visible;
        transform: none;
      }

      .pm-register-cell-text {
        color: #555555;
        display: block;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-register-cell-text.strong {
        color: #252a34;
        font-weight: 600;
      }

      .pm-register-cell-text.muted {
        color: #777777;
      }

      .pm-register-cell-text.wrap {
        display: -webkit-box;
        line-clamp: var(--register-cell-line-clamp, 2);
        -webkit-line-clamp: var(--register-cell-line-clamp, 2);
        -webkit-box-orient: vertical;
        white-space: normal;
      }

      .pm-register-cell-inline {
        align-items: flex-start;
        display: grid;
        gap: 8px;
        grid-template-columns: 16px minmax(0, 1fr);
        min-width: 0;
        width: 100%;
      }

      .pm-register-cell-inline > .icon {
        color: var(--register-cell-icon-color, #252a34);
        height: 16px;
        margin-top: 1px;
        width: 16px;
      }

      .pm-main-register-table-detail-row td {
        background: #f6f7fa;
        padding: 0 20px 14px;
      }

      .pm-main-register-table-detail-row:hover td {
        background: #f6f7fa;
      }

      .pm-register-primary-button {
        align-items: flex-start;
        background: transparent;
        border: 0;
        box-sizing: border-box;
        color: #354cb5;
        display: flex;
        gap: 9px;
        max-width: 100%;
        min-width: 0;
        padding: 0 0 0 var(--register-primary-indent, 0);
        text-align: left;
        width: 100%;
      }

      .pm-register-primary-button.is-static {
        cursor: default;
      }

      .pm-register-primary-icon {
        align-items: center;
        color: #687182;
        display: inline-flex;
        flex: 0 0 auto;
        height: 18px;
        justify-content: center;
        width: 18px;
      }

      .pm-register-primary-icon .icon {
        height: 15px;
        width: 15px;
      }

      .pm-register-primary-copy {
        display: grid;
        flex: 1 1 auto;
        gap: 3px;
        min-width: 0;
      }

      .pm-register-primary-meta {
        align-items: center;
        color: #9aa2b1;
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        gap: 5px;
        line-height: 14px;
        min-width: 0;
      }

      .pm-register-primary-alert {
        color: #d97706;
        display: inline-flex;
        flex: 0 0 auto;
      }

      .pm-register-primary-alert .icon {
        height: 12px;
        width: 12px;
      }

      .pm-register-primary-main {
        align-items: center;
        display: flex;
        gap: 8px;
        min-width: 0;
      }

      .pm-register-primary-button strong {
        color: #354cb5;
        display: block;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-register-primary-tag {
        background: #f4f7fb;
        border: 1px solid #e3e8f0;
        border-radius: 999px;
        color: #4f596a;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10.5px;
        font-weight: 500;
        line-height: 1;
        padding: 5px 9px;
        white-space: nowrap;
      }

      .pm-register-primary-tag.portfolio {
        background: #e5f4ef;
        border-color: #cde9df;
        color: #0f6b57;
      }

      .pm-register-primary-tag.program {
        background: #eef2ff;
        border-color: #dfe5ff;
        color: #10069f;
      }

      .pm-register-primary-tag.project {
        background: #fff3dc;
        border-color: #ffe2ad;
        color: #975a16;
      }

      .pm-register-primary-tag.project-group {
        background: #eef1f5;
        border-color: #dfe4ec;
        color: #4b5565;
      }

      .pm-register-primary-tag.tag-count {
        background: #f4f7fb;
        border-color: #e3e8f0;
        color: #5f6878;
      }

      .pm-register-trend-list {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        display: inline-flex;
        height: 34px;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        width: min(100%, 204px);
      }

      .pm-register-trend-pill {
        align-items: center;
        color: #404040;
        display: inline-flex;
        flex: 1 1 0;
        font-size: 13px;
        font-weight: 400;
        gap: 4px;
        height: 100%;
        justify-content: center;
        line-height: 18px;
        min-width: 0;
        padding: 0 6px;
        position: relative;
        white-space: nowrap;
      }

      .pm-register-trend-pill:not(:last-child)::after {
        background: #dcdfe6;
        content: "";
        height: 18px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
      }

      .pm-register-trend-pill .icon {
        flex: 0 0 auto;
        height: 18px;
        width: 18px;
      }

      .pm-register-trend-pill .icon svg {
        stroke-width: 2;
      }

      .pm-register-trend-pill > span:last-child {
        color: #404040;
        flex: 0 0 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-register-trend-pill.success .icon {
        color: var(--green);
      }

      .pm-register-trend-pill.warning .icon {
        color: var(--amber);
      }

      .pm-register-trend-pill.danger .icon {
        color: var(--red);
      }

      .pm-register-trend-pill.neutral .icon {
        color: #9aa1ad;
      }

      .pm-register-person {
        align-items: center;
        display: flex;
        gap: 10px;
        min-width: 0;
      }

      .pm-register-person input {
        accent-color: var(--brand);
        flex: 0 0 auto;
        margin: 0;
      }

      .pm-register-avatar {
        align-items: center;
        background: #f0eefc;
        border: 1px solid #ffffff;
        border-radius: 999px;
        color: var(--brand);
        display: inline-flex;
        flex: 0 0 30px;
        font-size: 11px;
        font-weight: 600;
        height: 30px;
        justify-content: center;
        overflow: hidden;
        width: 30px;
      }

      .pm-register-avatar img {
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .pm-register-person-copy {
        display: grid;
        min-width: 0;
      }

      .pm-register-person-copy strong {
        color: #252a34;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-register-person-copy small {
        color: #777777;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-register-action-button {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d3d3d3;
        border-radius: 999px;
        color: var(--brand);
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 5px;
        height: 36px;
        justify-content: center;
        line-height: 16px;
        padding: 0 15px;
        white-space: nowrap;
      }

      .pm-main-register-table .pm-table-actions-cell .pm-register-action-button {
        height: 36px;
        min-width: 94px;
        padding: 0 15px;
        width: auto;
      }

      .pm-register-action-button .icon {
        height: 15px;
        width: 15px;
      }

      .pm-main-register-table .pm-table-actions-cell .pm-register-action-button .icon {
        height: 15px;
        width: 15px;
      }

      .pm-register-icon-action {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e3e5e9;
        border-radius: 7px;
        color: #6f7785;
        display: inline-flex;
        height: 30px;
        justify-content: center;
        padding: 0;
        width: 30px;
      }

      .pm-register-icon-action.danger {
        color: #c2413d;
      }

      .pm-register-icon-action.favorite-active,
      .pm-register-icon-action.favorite-muted {
        background: transparent;
        border: 0;
        color: #c9d1df;
      }

      .pm-register-icon-action.favorite-active {
        color: var(--brand);
      }

      .pm-register-icon-action .icon {
        height: 15px;
        width: 15px;
      }

      .pm-register-checkbox-cell {
        accent-color: var(--brand);
        margin: 0;
      }

      .pm-register-tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        min-width: 0;
      }

      .pm-register-tag {
        background: #f4f7fb;
        border: 1px solid #e3e8f0;
        border-radius: 999px;
        color: #4f596a;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 600;
        line-height: 1;
        padding: 6px 9px;
        white-space: nowrap;
      }

      .pm-register-empty-state {
        align-items: center;
        display: grid;
        gap: 5px;
        justify-items: center;
        min-height: var(--register-empty-min-height, 160px);
        text-align: center;
      }

      .pm-register-empty-state strong {
        color: #202633;
        font-size: 14px;
        font-weight: 600;
      }

      .pm-register-empty-state span {
        color: #687182;
        font-size: 12px;
      }

      @media (max-width: 860px) {
        .pm-main-register-table-view {
          gap: 10px;
        }
      }
    `,
  ],
  template: `
    <article class="pm-main-register-table-view" [class.without-toolbar]="!showToolbar">
      @if (showToolbar) {
        <app-pm-console-toolbar [itemLabel]="showItemLabel ? computedItemLabel : ''" [toolbarClass]="toolbarClass">
          <span toolbarLabel class="pm-register-toolbar-label">
            <ng-content select="[registerTableToolbarLabel]"></ng-content>
          </span>
          @if (showSearch) {
            @if (searchVariant === 'workspace') {
              <app-pm-console-expandable-search
                class="pm-register-expandable-search"
                [ariaLabel]="computedSearchAriaLabel"
                [placeholder]="computedSearchPlaceholder"
                [value]="searchValue"
                (searchChange)="setSearchValue($event)"
              />
            } @else {
              <button class="pm-table-tool square" type="button" [attr.aria-label]="'Search ' + itemName"><span pmConsoleIcon="search" aria-hidden="true"></span></button>
            }
          }
          @if (showFilter) {
            <button class="pm-table-tool" type="button"><span pmConsoleIcon="filter" aria-hidden="true"></span><span>Filter</span></button>
          }
          @if (showGroupBy) {
            <button class="pm-table-tool" type="button"><span pmConsoleIcon="sliders-horizontal" aria-hidden="true"></span><span>Group by</span></button>
          }
          @if (showExport) {
            <button class="pm-table-tool" type="button"><span pmConsoleIcon="download" aria-hidden="true"></span><span>Export</span></button>
          }
          <ng-content select="[registerTableToolbarActions]"></ng-content>
          <div class="pm-table-settings-menu" data-register-columns-menu>
            <button class="pm-table-tool square" type="button" aria-label="Table settings" aria-haspopup="dialog" [attr.aria-expanded]="columnMenuOpen" [attr.aria-controls]="columnPickerId" (click)="toggleColumnMenu()"><span pmConsoleIcon="settings" aria-hidden="true"></span></button>
            @if (columnMenuOpen) {
              <section class="pm-table-column-popover" [id]="columnPickerId" role="dialog" [attr.aria-label]="'Choose visible ' + itemName + ' columns'">
                <div class="pm-table-column-popover-head">
                  <div>
                    <strong>Visible columns</strong>
                    <small>{{ visibleColumns.length }} of {{ columns.length }} selected</small>
                  </div>
                  <button class="pm-table-column-reset" type="button" [disabled]="visibleColumns.length === columns.length" (click)="resetColumns()">Reset</button>
                </div>
                <div class="pm-table-column-options" role="group" [attr.aria-label]="itemName + ' table columns'">
                  @for (column of columns; track column.id) {
                    <label class="pm-table-column-option" [class.is-locked]="isColumnLocked(column.id)">
                      <input type="checkbox" [checked]="isColumnVisible(column.id)" [disabled]="isColumnLocked(column.id)" (change)="toggleColumn(column.id, $event)" />
                      <span>{{ column.label }}</span>
                    </label>
                  }
                </div>
                <p class="pm-table-column-hint">Keep at least one column visible in the table.</p>
              </section>
            }
          </div>
          @if (addButtonLabel) {
            <button class="pm-table-add-project" type="button" [attr.aria-label]="addButtonAriaLabel || addButtonLabel" (click)="emitAdd($event)">
              <span [pmConsoleIcon]="addButtonIcon" aria-hidden="true"></span>
              <span>{{ addButtonLabel }}</span>
            </button>
          }
        </app-pm-console-toolbar>
      }

      <div class="pm-project-table-scroll pm-main-register-table-scroll" tabindex="0">
        <table class="pm-project-table pm-register-table pm-main-register-table" [attr.aria-label]="ariaLabel" [style.--register-table-min-width.px]="tableMinWidth()">
          <thead>
            <tr>
              @if (selectable) {
                <th class="pm-table-check-cell"><input type="checkbox" [attr.aria-label]="selectAllLabel" /></th>
              }
              @for (column of renderedColumns; track column.id) {
                <th class="pm-table-column-cell {{ column.align ? 'align-' + column.align : '' }}" [class.pm-table-trend-cell]="column.id === 'statusTrend' || column.id === 'trend'" [class.is-entering]="columnMotionState(column.id) === 'entering'" [class.is-exiting]="columnMotionState(column.id) === 'exiting'" [style.--column-open-width]="columnWidth(column.id)">
                  <div class="pm-table-column-frame">
                    <span class="pm-table-column-header">{{ column.label }}</span>
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of visibleRows; track row.id) {
              <tr
                class="pm-main-register-table-row"
                [class.is-clickable]="row.clickable !== false"
                [attr.role]="row.clickable === false ? null : 'button'"
                [attr.tabindex]="row.clickable === false ? null : 0"
                [attr.aria-label]="row.ariaLabel || 'Open row'"
                (click)="openRow(row)"
                (keydown.enter)="openRowFromKeyboard($event, row)"
                (keydown.space)="openRowFromKeyboard($event, row)"
              >
                @if (selectable) {
                  <td class="pm-table-check-cell"><input type="checkbox" [checked]="row.selected" [attr.aria-label]="'Select ' + (row.ariaLabel || 'row')" (click)="$event.stopPropagation()" /></td>
                }
                @for (column of renderedColumns; track column.id) {
                  @let cell = cellFor(row, column.id);
                  <td class="pm-table-column-cell {{ column.align ? 'align-' + column.align : '' }}" [class.pm-table-project-cell]="cell?.kind === 'primary'" [class.pm-table-status-cell]="cell?.kind === 'status'" [class.pm-table-trend-cell]="cell?.kind === 'trend' || column.id === 'statusTrend' || column.id === 'trend'" [class.pm-table-actions-cell]="cell?.kind === 'action' || cell?.kind === 'menu'" [class.is-entering]="columnMotionState(column.id) === 'entering'" [class.is-exiting]="columnMotionState(column.id) === 'exiting'" [style.--column-open-width]="columnWidth(column.id)">
                    <div class="pm-table-column-frame" [class.pm-table-menu-frame]="cell?.kind === 'menu'">
                      @if (cell) {
	                        @switch (cell.kind) {
	                          @case ('primary') {
	                            @if (row.clickable === false) {
	                              <span class="pm-register-primary-button is-static" [style.--register-primary-indent.px]="cell.indentLevel ? cell.indentLevel * 28 : null">
	                                <span class="pm-register-primary-copy">
	                                  @if (cell.subtitle || cell.alert) {
	                                    <span class="pm-register-primary-meta">
	                                      @if (cell.subtitle) {
	                                        <span>{{ cell.subtitle }}</span>
	                                      }
	                                      @if (cell.alert) {
	                                        <span class="pm-register-primary-alert" [attr.title]="cell.alertLabel || 'Needs attention'">
	                                          <span pmConsoleIcon="triangle-alert" aria-hidden="true"></span>
	                                        </span>
	                                      }
	                                    </span>
	                                  }
	                                  <span class="pm-register-primary-main">
	                                    @if (cell.prefixIcon) {
	                                      <span class="pm-register-primary-icon" [pmConsoleIcon]="cell.prefixIcon" aria-hidden="true"></span>
	                                    }
	                                    <strong>{{ cell.title || cell.text }}</strong>
	                                    @if (cell.tag) {
	                                      <span class="pm-register-primary-tag {{ cell.tagTone || '' }}">{{ cell.tag }}</span>
	                                    }
	                                  </span>
	                                </span>
	                              </span>
	                            } @else {
	                              <button class="pm-register-primary-button" type="button" [attr.aria-label]="cell.ariaLabel || cell.title" [style.--register-primary-indent.px]="cell.indentLevel ? cell.indentLevel * 28 : null" (click)="openRow(row); $event.stopPropagation()">
	                                <span class="pm-register-primary-copy">
	                                  @if (cell.subtitle || cell.alert) {
	                                    <span class="pm-register-primary-meta">
	                                      @if (cell.subtitle) {
	                                        <span>{{ cell.subtitle }}</span>
	                                      }
	                                      @if (cell.alert) {
	                                        <span class="pm-register-primary-alert" [attr.title]="cell.alertLabel || 'Needs attention'">
	                                          <span pmConsoleIcon="triangle-alert" aria-hidden="true"></span>
	                                        </span>
	                                      }
	                                    </span>
	                                  }
	                                  <span class="pm-register-primary-main">
	                                    @if (cell.prefixIcon) {
	                                      <span class="pm-register-primary-icon" [pmConsoleIcon]="cell.prefixIcon" aria-hidden="true"></span>
	                                    }
	                                    <strong>{{ cell.title || cell.text }}</strong>
	                                    @if (cell.tag) {
	                                      <span class="pm-register-primary-tag {{ cell.tagTone || '' }}">{{ cell.tag }}</span>
	                                    }
	                                  </span>
	                                </span>
	                              </button>
	                            }
	                          }
                          @case ('status') {
                            <span [pmConsoleStatusPill]="cell.label || cell.text || ''" baseClass="pm-table-row-status" [tone]="cell.tone || 'neutral'"></span>
                          }
                          @case ('budget') {
                            <span class="pm-table-budget"><strong>{{ cell.value || cell.text }}</strong>@if (cell.suffix) { <small>{{ cell.suffix }}</small> }</span>
                          }
                          @case ('person') {
                            <span class="pm-register-person">
                              @if (cell.checked !== undefined) {
                                <input type="checkbox" [checked]="cell.checked" [attr.aria-label]="cell.ariaLabel || 'Submitted by ' + cell.title" (click)="$event.stopPropagation()" />
                              }
                              <span class="pm-register-avatar" aria-hidden="true">
                                @if (cell.avatarUrl) {
                                  <img [src]="cell.avatarUrl" alt="" />
                                } @else {
                                  {{ cell.initials || cell.title?.slice(0, 2) }}
                                }
                              </span>
                              <span class="pm-register-person-copy">
                                <strong>{{ cell.title }}</strong>
                                @if (cell.handle) {
                                  <small>{{ cell.handle }}</small>
                                }
                              </span>
                            </span>
                          }
                          @case ('action') {
                            <button class="pm-register-action-button {{ cell.tone || '' }}" type="button" [attr.aria-label]="cell.ariaLabel || cell.label" (click)="emitAction(row, column, cell, $event)">
                              <span [pmConsoleIcon]="cell.icon || 'file-text'" aria-hidden="true"></span>
                              <span>{{ cell.label }}</span>
                            </button>
                          }
                          @case ('iconAction') {
                            <button class="pm-register-icon-action {{ cell.tone || '' }}" type="button" [attr.aria-label]="cell.ariaLabel || cell.label" (click)="emitAction(row, column, cell, $event)">
                              <span [pmConsoleIcon]="cell.icon || 'more-horizontal'" aria-hidden="true"></span>
                            </button>
                          }
                          @case ('menu') {
                            <app-pm-console-row-action-menu [ariaLabel]="cell.ariaLabel || 'Actions for row'">
                              @for (action of cell.actions || []; track action.id) {
                                <button type="button" role="menuitem" class="{{ action.tone || '' }}" [attr.aria-label]="action.ariaLabel || action.label" (click)="emitMenuAction(row, column, cell, action, $event)">
                                  <span [pmConsoleIcon]="action.icon || 'circle'" aria-hidden="true"></span>
                                  <span>{{ action.label }}</span>
                                </button>
                              }
                            </app-pm-console-row-action-menu>
                          }
                          @case ('checkbox') {
                            <input class="pm-register-checkbox-cell" type="checkbox" [checked]="cell.checked" [attr.aria-label]="cell.ariaLabel || cell.label" (click)="$event.stopPropagation()" />
                          }
	                          @case ('tags') {
	                            <span class="pm-register-tag-list">
	                              @for (item of cell.items || []; track item) {
	                                <span class="pm-register-tag">{{ item }}</span>
	                              }
	                            </span>
	                          }
                          @case ('chip-text') {
                            <span class="pm-register-cell-inline">
                              @if (cell.chipLabel) {
                                <span class="pm-table-chip {{ cell.chipTone || '' }}">{{ cell.chipLabel }}</span>
                              }
                              <span class="pm-register-cell-text">{{ cell.text || cell.label }}</span>
                            </span>
                          }
	                          @case ('trend') {
	                            <span class="pm-register-trend-list" [attr.aria-label]="cell.ariaLabel || 'Report status trend'">
	                              @for (item of cell.trend || []; track item.label) {
	                                <span class="pm-register-trend-pill {{ item.tone || 'neutral' }}" role="img" [attr.aria-label]="item.ariaLabel || item.label" [attr.title]="item.ariaLabel || item.label">
	                                  <span [pmConsoleIcon]="item.icon || 'circle'" aria-hidden="true"></span>
	                                  <span>{{ item.label }}</span>
	                                </span>
	                              }
	                            </span>
	                          }
                          @default {
                            @if (cell.icon) {
                              <span class="pm-register-cell-inline">
                                <span [pmConsoleIcon]="cell.icon" aria-hidden="true"></span>
                                <span
                                  class="pm-register-cell-text"
                                  [class.strong]="cell.strong"
                                  [class.muted]="cell.muted"
                                  [class.wrap]="cell.wrap"
                                  [style.--register-cell-line-clamp]="cell.clampLines || null"
                                >
                                  {{ cell.text || cell.label }}
                                </span>
                              </span>
                            } @else {
                              <span
                                class="pm-register-cell-text"
                                [class.strong]="cell.strong"
                                [class.muted]="cell.muted"
                                [class.wrap]="cell.wrap"
                                [style.--register-cell-line-clamp]="cell.clampLines || null"
                              >
                                {{ cell.text || cell.label }}
                              </span>
                            }
                          }
                        }
                      }
                    </div>
                  </td>
                }
              </tr>
              @if (row.expanded && rowDetailTemplate) {
                <tr class="pm-main-register-table-detail-row">
                  <td [attr.colspan]="tableColumnSpan()">
                    <ng-container [ngTemplateOutlet]="rowDetailTemplate" [ngTemplateOutletContext]="{ $implicit: row }"></ng-container>
                  </td>
                </tr>
              }
            } @empty {
              <tr>
                <td [attr.colspan]="tableColumnSpan()">
                  <div class="pm-register-empty-state">
                    <strong>{{ emptyTitle }}</strong>
                    @if (emptyDescription) {
                      <span>{{ emptyDescription }}</span>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </article>
  `,
})
export class PmConsoleRegisterTableComponent implements OnChanges, OnDestroy {
  @ContentChild('registerTableRowDetail') rowDetailTemplate?: TemplateRef<{ $implicit: PmConsoleRegisterTableRow }>;

  @Input() columns: PmConsoleRegisterTableColumn[] = [];
  @Input() rows: PmConsoleRegisterTableRow[] = [];
  @Input() storageKey = '';
  @Input() ariaLabel = 'Register table';
  @Input() itemName = 'items';
  @Input() itemLabel = '';
  @Input() selectAllLabel = 'Select all rows';
  @Input() toolbarClass: string | string[] | Set<string> | Record<string, unknown> = 'pm-main-register-toolbar';
  @Input() selectable = true;
  @Input() showToolbar = true;
  @Input() showItemLabel = true;
  @Input() showSearch = true;
  @Input() searchVariant: RegisterTableSearchVariant = 'button';
  @Input() searchPlaceholder = '';
  @Input() searchAriaLabel = '';
  @Input() showFilter = true;
  @Input() showGroupBy = false;
  @Input() showExport = true;
  @Input() addButtonLabel = '';
  @Input() addButtonAriaLabel = '';
  @Input() addButtonIcon = 'plus';
  @Input() emptyTitle = 'No records in this view';
  @Input() emptyDescription = '';

  @Output() rowOpen = new EventEmitter<PmConsoleRegisterTableRow>();
  @Output() cellAction = new EventEmitter<PmConsoleRegisterTableActionEvent>();
  @Output() addItem = new EventEmitter<void>();

  readonly columnPickerId = `pm-register-table-columns-${++registerTableInstance}`;
  visibleColumnIds: string[] = [];
  renderedColumnIds: string[] = [];
  columnMotionStates: Record<string, ColumnMotionState | undefined> = {};
  columnMenuOpen = false;
  searchValue = '';

  private columnTimers: Record<string, number | undefined> = {};
  private columnFrames: Record<string, number | undefined> = {};

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('columns' in changes || 'storageKey' in changes) {
      this.syncColumnsFromInputs();
    }
  }

  ngOnDestroy(): void {
    for (const handle of Object.values(this.columnTimers)) {
      if (handle) window.clearTimeout(handle);
    }
    for (const handle of Object.values(this.columnFrames)) {
      if (handle) window.cancelAnimationFrame(handle);
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.columnMenuOpen) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!this.elementRef.nativeElement.contains(target)) this.closeColumnMenu();
  }

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    this.closeColumnMenu();
  }

  get computedItemLabel(): string {
    return this.itemLabel || `Items: ${this.visibleRows.length}`;
  }

  get computedSearchPlaceholder(): string {
    return this.searchPlaceholder || `Search ${this.itemName}`;
  }

  get computedSearchAriaLabel(): string {
    return this.searchAriaLabel || `Search ${this.itemName}`;
  }

  get visibleRows(): PmConsoleRegisterTableRow[] {
    const query = this.normalizedSearchValue();
    if (!this.showSearch || this.searchVariant !== 'workspace' || !query) return this.rows;
    return this.rows.filter((row) => this.searchableRowValue(row).includes(query));
  }

  get visibleColumns(): PmConsoleRegisterTableColumn[] {
    const visible = new Set(this.visibleColumnIds);
    return this.columns.filter((column) => visible.has(column.id));
  }

  get renderedColumns(): PmConsoleRegisterTableColumn[] {
    const rendered = new Set(this.renderedColumnIds);
    return this.columns.filter((column) => rendered.has(column.id));
  }

  toggleColumnMenu(): void {
    this.columnMenuOpen = !this.columnMenuOpen;
  }

  closeColumnMenu(): void {
    if (!this.columnMenuOpen) return;
    this.columnMenuOpen = false;
    this.changeDetector.markForCheck();
  }

  isColumnVisible(id: string): boolean {
    return this.visibleColumnIds.includes(id);
  }

  isColumnLocked(id: string): boolean {
    return this.visibleColumnIds.length === 1 && this.visibleColumnIds[0] === id;
  }

  columnMotionState(id: string): ColumnMotionState {
    return this.columnMotionStates[id] || 'visible';
  }

  columnWidth(id: string): string {
    const column = this.columns.find((item) => item.id === id);
    const min = column?.minWidth || 132;
    const max = column?.maxWidth || Math.max(min, 190);
    const visibleTotal = this.visibleColumns.reduce((total, item) => total + (item.maxWidth || Math.max(item.minWidth || 132, 190)), 0) || max;
    const share = (max / visibleTotal) * 100;
    return `clamp(${min}px, ${share.toFixed(3)}%, ${max}px)`;
  }

  tableMinWidth(): number {
    const columnWidthTotal = this.visibleColumns.reduce((total, column) => total + (column.minWidth || 132), 0);
    return (this.selectable ? 48 : 0) + columnWidthTotal;
  }

  tableColumnSpan(): number {
    return this.renderedColumns.length + (this.selectable ? 1 : 0);
  }

  toggleColumn(id: string, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const shouldShow = Boolean(input?.checked);
    const isVisible = this.isColumnVisible(id);
    if (shouldShow === isVisible) return;

    if (shouldShow) {
      this.visibleColumnIds = this.normalizeColumns([...this.visibleColumnIds, id]);
      this.showColumn(id);
    } else {
      if (this.isColumnLocked(id)) return;
      this.visibleColumnIds = this.normalizeColumns(this.visibleColumnIds.filter((columnId) => columnId !== id));
      this.hideColumn(id);
    }

    this.persistColumns();
  }

  resetColumns(): void {
    const nextVisible = this.defaultColumnIds();
    const nextVisibleSet = new Set(nextVisible);
    for (const id of nextVisible) {
      if (!this.visibleColumnIds.includes(id)) this.showColumn(id);
    }
    for (const id of this.visibleColumnIds) {
      if (!nextVisibleSet.has(id)) this.hideColumn(id);
    }
    this.visibleColumnIds = nextVisible;
    this.persistColumns();
  }

  setSearchValue(value: Event | string): void {
    this.searchValue = typeof value === 'string' ? value : (value.target as HTMLInputElement | null)?.value || '';
  }

  cellFor(row: PmConsoleRegisterTableRow, columnId: string): PmConsoleRegisterTableCell | null {
    return row.cells[columnId] || null;
  }

  openRow(row: PmConsoleRegisterTableRow): void {
    if (row.clickable === false) return;
    this.rowOpen.emit(row);
  }

  openRowFromKeyboard(event: Event, row: PmConsoleRegisterTableRow): void {
    event.preventDefault();
    this.openRow(row);
  }

  emitAction(row: PmConsoleRegisterTableRow, column: PmConsoleRegisterTableColumn, cell: PmConsoleRegisterTableCell, event: Event): void {
    event.stopPropagation();
    this.cellAction.emit({ row, column, cell });
  }

  emitMenuAction(
    row: PmConsoleRegisterTableRow,
    column: PmConsoleRegisterTableColumn,
    cell: PmConsoleRegisterTableCell,
    action: PmConsoleRegisterTableMenuItem,
    event: Event,
  ): void {
    event.stopPropagation();
    this.cellAction.emit({ row, column, cell, action });
  }

  emitAdd(event: Event): void {
    event.stopPropagation();
    this.addItem.emit();
  }

  private syncColumnsFromInputs(): void {
    const visible = this.loadColumns();
    this.visibleColumnIds = visible;
    this.renderedColumnIds = [...visible];
    this.columnMotionStates = visible.reduce<Record<string, ColumnMotionState>>((states, id) => {
      states[id] = 'visible';
      return states;
    }, {});
  }

  private loadColumns(): string[] {
    if (this.storageKey) {
      try {
        const stored = window.localStorage.getItem(this.storageKey);
        if (stored) return this.normalizeColumns(JSON.parse(stored));
      } catch {
        return this.defaultColumnIds();
      }
    }
    return this.defaultColumnIds();
  }

  private persistColumns(): void {
    if (!this.storageKey) return;
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.visibleColumnIds));
    } catch {
      // In-memory column preferences still work when storage is unavailable.
    }
  }

  private defaultColumnIds(): string[] {
    const defaultIds = this.columns.filter((column) => column.visible !== false).map((column) => column.id);
    return defaultIds.length ? defaultIds : this.columns.slice(0, 1).map((column) => column.id);
  }

  private normalizeColumns(ids: string[]): string[] {
    const requested = new Set(ids);
    const normalized = this.columns.filter((column) => requested.has(column.id)).map((column) => column.id);
    return normalized.length ? normalized : this.defaultColumnIds();
  }

  private normalizedSearchValue(): string {
    return this.normalizeSearchValue(this.searchValue);
  }

  private searchableRowValue(row: PmConsoleRegisterTableRow): string {
    const values = [row.id, row.ariaLabel || ''];
    for (const cell of Object.values(row.cells)) {
      values.push(
        cell.text || '',
        cell.title || '',
        cell.subtitle || '',
        cell.label || '',
        cell.value || '',
        cell.suffix || '',
        cell.initials || '',
        cell.handle || '',
        ...(cell.items || []),
        ...(cell.actions || []).map((action) => action.label),
      );
    }
    return this.normalizeSearchValue(values.join(' '));
  }

  private normalizeSearchValue(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  private normalizeRenderedColumns(ids: string[]): string[] {
    const requested = new Set(ids);
    return this.columns.filter((column) => requested.has(column.id)).map((column) => column.id);
  }

  private showColumn(id: string): void {
    this.clearColumnAnimation(id);
    this.renderedColumnIds = this.normalizeRenderedColumns([...this.renderedColumnIds, id]);
    this.columnMotionStates = {
      ...this.columnMotionStates,
      [id]: 'entering',
    };
    this.columnFrames[id] = window.requestAnimationFrame(() => {
      this.columnFrames[id] = undefined;
      this.columnMotionStates = {
        ...this.columnMotionStates,
        [id]: 'visible',
      };
      this.changeDetector.markForCheck();
    });
  }

  private hideColumn(id: string): void {
    this.clearColumnAnimation(id);
    this.columnMotionStates = {
      ...this.columnMotionStates,
      [id]: 'exiting',
    };
    this.columnTimers[id] = window.setTimeout(() => {
      this.columnTimers[id] = undefined;
      this.renderedColumnIds = this.renderedColumnIds.filter((columnId) => columnId !== id);
      const nextStates = { ...this.columnMotionStates };
      delete nextStates[id];
      this.columnMotionStates = nextStates;
      this.changeDetector.markForCheck();
    }, COLUMN_MOTION_MS);
  }

  private clearColumnAnimation(id: string): void {
    const timer = this.columnTimers[id];
    if (timer) {
      window.clearTimeout(timer);
      this.columnTimers[id] = undefined;
    }

    const frame = this.columnFrames[id];
    if (frame) {
      window.cancelAnimationFrame(frame);
      this.columnFrames[id] = undefined;
    }
  }
}
