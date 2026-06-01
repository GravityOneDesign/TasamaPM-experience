import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleWorkCalendarComponent, PmConsoleCalendarCell, PmConsoleCalendarItem, PmConsoleCalendarFilter } from './shared/pm-console-work-calendar.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { iconName } from './portfolio-manager-icon.utils';
import { portfolioActionItems, portfolioBoardFilters, PortfolioActionItem, PortfolioBoardFilter, PortfolioBoardColumn } from './portfolio-manager-actions.data';
import { PortfolioManagerActionDrawerService } from './portfolio-manager-action-drawer.service';
import { portfolioProgramRows, standaloneProjects, type ProgramRow } from './portfolio-workspace/portfolio-workspace.data';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

type PortfolioWorkTargetType = 'all' | 'portfolio' | 'program' | 'project';
type PortfolioActionsBoardPresentation = 'kanban' | 'compact';

type PortfolioCalendarItem = PmConsoleCalendarItem & {
  id: string;
  targetType: PortfolioActionItem['targetType'];
};

interface PortfolioWorkTargetOption {
  id: string;
  label: string;
  type: PortfolioWorkTargetType;
  parentLabel?: string;
  projectNames?: string[];
}

interface PortfolioWorkTargetGroup {
  id: 'portfolios' | 'programs' | 'projects';
  label: string;
  options: PortfolioWorkTargetOption[];
}

interface PortfolioTargetRow {
  name: string;
  programs?: readonly ProgramRow[];
}

@Component({
  selector: 'app-portfolio-manager-actions',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleWorkCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="actions-workspace">
      <!-- Toolbar row -->
      <div class="workspace-control-row actions-control-row">
        <!-- Heading -->
        <h2 class="workspace-action-title">{{ currentWorkspaceTitle }}</h2>

        <!-- Search input -->
        <label class="workspace-search">
          <span class="icon" aria-hidden="true"><i data-lucide="search"></i></span>
          <input
            type="search"
            [placeholder]="searchPlaceholder"
            [attr.aria-label]="searchPlaceholder"
            (input)="onSearchChange($event)"
          />
        </label>

        <!-- Program / Project selector -->
        @if (showTargetPicker) {
        <div class="portfolio-target-picker" [attr.aria-label]="targetPickerAriaLabel">
          <details class="work-filter-dropdown target-picker-dropdown" (toggle)="onFilterDropdownToggle($event)">
            <summary [attr.aria-label]="'Select program or project: ' + targetPickerLabel">
              <span class="work-filter-selected-icon">
                <span class="icon" aria-hidden="true">
                  <i [attr.data-lucide]="targetPickerIcon"></i>
                </span>
              </span>
              <span>{{ targetPickerLabel }}</span>
              <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
            </summary>
            <div class="work-filter-menu target-picker-menu" role="menu">
              <label class="target-picker-search" (click)="$event.stopPropagation()">
                <span pmConsoleIcon="search" aria-hidden="true"></span>
                <input
                  type="search"
                  placeholder="Search programs or projects"
                  aria-label="Search programs or projects"
                  [value]="targetSearchQuery"
                  (input)="onTargetSearchChange($event)"
                />
              </label>

              <button class="target-picker-reset" type="button" (click)="resetFilters($event)">
                <span pmConsoleIcon="rotate-ccw" aria-hidden="true"></span>
                <span>Reset filters</span>
              </button>

              @if (hasFilteredTargetOptions) {
                @for (group of filteredTargetGroups; track group.id) {
                  @if (group.options.length) {
                    <details
                      class="target-picker-group"
                      [attr.aria-label]="group.label"
                      [open]="isTargetGroupExpanded(group.id)"
                      (toggle)="onTargetGroupToggle(group.id, $event)"
                    >
                      <summary class="target-picker-group-label" (click)="$event.stopPropagation()">
                        <span>{{ group.label }}</span>
                        <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                      </summary>
                      @for (target of group.options; track target.id) {
                        <button
                          class="target-picker-option"
                          [class.active]="isTargetSelected(target.id)"
                          type="button"
                          role="menuitemcheckbox"
                          [attr.aria-checked]="isTargetSelected(target.id)"
                          (click)="selectTarget(target.id, $event)"
                        >
                          <span class="target-picker-check" [class.checked]="isTargetSelected(target.id)" aria-hidden="true">
                            <span pmConsoleIcon="check" aria-hidden="true"></span>
                          </span>
                          <span class="target-option-copy">
                            <strong>{{ target.label }}</strong>
                            @if (target.parentLabel) {
                              <small>{{ target.parentLabel }}</small>
                            } @else {
                              <small>{{ targetOptionSubtitle(target) }}</small>
                            }
                          </span>
                        </button>
                      }
                    </details>
                  }
                }
              } @else {
                <div class="target-picker-empty">No programs or projects found.</div>
              }
            </div>
          </details>
        </div>
        }

        <!-- Filter dropdown -->
        <div class="board-filter action-board-filter" aria-label="Action filters">
          <details class="work-filter-dropdown" (toggle)="onFilterDropdownToggle($event)">
            <summary [attr.aria-label]="'Filter actions by ' + selectedFilterOption.label">
              <span class="work-filter-selected-icon">
                <span class="icon" aria-hidden="true">
                  <i [attr.data-lucide]="iconName(selectedFilterOption.icon)"></i>
                </span>
              </span>
              <span>{{ selectedFilterOption.label }}</span>
              <strong>{{ countForActionFilter(selectedFilterOption) }}</strong>
              <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
            </summary>
            <div class="work-filter-menu" role="menu">
              @for (filter of boardFilters; track filter.id) {
                <button
                  [class.active]="selectedFilter === filter.id"
                  type="button"
                  role="menuitemradio"
                  [attr.aria-checked]="selectedFilter === filter.id"
                  (click)="setBoardFilter(filter.id, $event)"
                >
                  <span class="work-filter-option-icon">
                    <span class="icon" aria-hidden="true">
                      <i [attr.data-lucide]="iconName(filter.icon)"></i>
                    </span>
                  </span>
                  <span>{{ filter.label }}</span>
                  <strong>{{ countForActionFilter(filter) }}</strong>
                </button>
              }
            </div>
          </details>
        </div>

        <!-- Calendar / Board Toggle -->
        <div class="action-view-switch" role="tablist" aria-label="Actions view options">
          <button
            [class.active]="activeView === 'calendar'"
            type="button"
            role="tab"
            data-action-view="calendar"
            [attr.aria-selected]="activeView === 'calendar'"
            (click)="setView('calendar')"
          >
            <span pmConsoleIcon="calendar-fold" aria-hidden="true"></span>
            <span>My Calendar</span>
          </button>
          <button
            [class.active]="activeView === 'board'"
            type="button"
            role="tab"
            data-action-view="board"
            [attr.aria-selected]="activeView === 'board'"
            (click)="setView('board')"
          >
            <span pmConsoleIcon="kanban" aria-hidden="true"></span>
            <span>My Actions</span>
          </button>
        </div>
      </div>

      <!-- Views container -->
      <div class="workspace-body">
        <!-- Board view -->
        <div
          class="board-view"
          [class.is-hidden]="activeView !== 'board'"
          [class.has-detail-panel]="showBoardDetailPanel && boardPresentation !== 'compact'"
          [class.is-compact-board]="boardPresentation === 'compact'"
          data-work-view="board"
        >
          @if (boardPresentation === 'compact') {
            <div class="compact-action-board" aria-label="PMO action board">
              @for (column of visibleBoardColumns; track column.column) {
                <section class="compact-action-column {{ column.tone }}">
                  <header>
                    <span class="compact-column-title">
                      <span class="compact-column-icon {{ column.tone }}">
                        <span [pmConsoleIcon]="boardColumnIcon(column.column)" aria-hidden="true"></span>
                      </span>
                      <span>{{ column.column }}</span>
                    </span>
                    <strong>{{ boardColumnCount(column.items) }}</strong>
                  </header>
                  <div class="compact-action-stack">
                    @for (item of compactColumnItems(column); track item.id) {
                      <button
                        class="compact-action-card {{ item.tone }}"
                        [attr.data-card-kind]="item.kind"
                        [attr.data-card-type]="item.type"
                        type="button"
                        [attr.aria-label]="actionItemAriaLabel(item)"
                        (click)="selectBoardItem(item)"
                      >
                        <span class="compact-action-icon {{ item.tone }}">
                          <span [pmConsoleIcon]="boardDetailIcon(item)" aria-hidden="true"></span>
                        </span>
                        <span class="compact-action-title">{{ item.type }}</span>
                        <strong class="compact-action-count">{{ actionItemTotal(item) }}</strong>
                        <span class="compact-action-view">
                          <span>{{ item.cta }}</span>
                          <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
                        </span>
                      </button>
                    } @empty {
                      <div class="empty-column">No actions in this lane.</div>
                    }
                  </div>
                </section>
              }
            </div>
          } @else {
            <div class="kanban-board">
              @for (column of visibleBoardColumns; track column.column) {
                <section class="kanban-column {{ column.tone }}">
                  <header>
                    <div>
                      <span class="board-column-icon {{ column.tone }}">
                        <span class="icon" aria-hidden="true">
                          <i [attr.data-lucide]="boardColumnIcon(column.column)"></i>
                        </span>
                      </span>
                      <h3>{{ column.column }}</h3>
                    </div>
                    <strong>{{ boardColumnCount(column.items) }}</strong>
                  </header>
                  <div class="task-stack">
                    @for (item of column.items; track item.id) {
                      <button
                        class="task-card {{ taskCardClass(item.type) }} {{ item.tone }}"
                        [class.is-selected]="activeBoardItem?.id === item.id"
                        [attr.data-card-kind]="item.kind"
                        [attr.data-card-type]="item.type"
                        type="button"
                        [attr.aria-label]="actionItemAriaLabel(item)"
                        (click)="selectBoardItem(item)"
                      >
                        <span class="task-card-icon {{ item.tone }}">
                          <span [pmConsoleIcon]="boardDetailIcon(item)" aria-hidden="true"></span>
                        </span>
                        
                        <div class="task-card-title-container">
                          <span class="task-card-title">{{ item.label }}</span>
                          <span class="task-card-count">{{ actionItemTotal(item) }}</span>
                        </div>

                        <span class="task-card-action">
                          <span>View All</span>
                          <span pmConsoleIcon="chevron-right" class="arrow-icon" aria-hidden="true"></span>
                        </span>
                      </button>
                    } @empty {
                      <div class="empty-column">No actions in this lane.</div>
                    }
                  </div>
                </section>
              }
            </div>
          }

          @if (showBoardDetailPanel) {
            <aside class="board-detail-panel" aria-label="Selected action list">
              @if (activeBoardItem; as selectedBoardAction) {
                <header>
                  <span class="board-detail-icon {{ selectedBoardAction.tone }}">
                    <span [pmConsoleIcon]="boardDetailIcon(selectedBoardAction)" aria-hidden="true"></span>
                  </span>
                  <span>
                    <small>{{ selectedBoardAction.column }}</small>
                    <strong>{{ selectedBoardAction.label }}</strong>
                  </span>
                  <b>{{ actionItemTotal(selectedBoardAction) }}</b>
                </header>
                <p>{{ boardDetailSummary(selectedBoardAction) }}</p>
                <div class="board-detail-list">
                  @for (detail of detailItemsFor(selectedBoardAction); track detail.id) {
                    <button class="board-detail-row" type="button" (click)="openActionDrawer(selectedBoardAction)">
                      <span class="board-detail-row-dot {{ detail.tone }}" aria-hidden="true"></span>
                      <span>
                        <strong>{{ detail.label }}</strong>
                        <small>{{ detail.project }} · {{ detail.meta }}</small>
                      </span>
                      <span class="board-detail-row-owner">{{ detail.owner }}</span>
                    </button>
                  }
                </div>
                <button class="board-detail-open" type="button" (click)="openActionDrawer(selectedBoardAction)">
                  <span>{{ selectedBoardAction.cta }}</span>
                  <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
                </button>
              } @else {
                <div class="board-detail-empty">
                  <span pmConsoleIcon="list-checks" aria-hidden="true"></span>
                  <strong>Select an action tile</strong>
                  <small>The expanded list will appear here before you open the full review panel.</small>
                </div>
              }
            </aside>
          }
        </div>

        <!-- Calendar view -->
        <div class="calendar-view" [class.is-hidden]="activeView !== 'calendar'" data-work-view="calendar">
          <app-pm-console-work-calendar
            [monthLabel]="calendarMonthLabel"
            [monthItemCount]="visibleMonthItemCount"
            [cells]="calendarCells"
            [filters]="calendarFilterOptions"
            [selectedFilterId]="selectedFilter"
            [showFilterBar]="false"
            [truncateInlineLabels]="true"
            (monthShift)="shiftMonth($event)"
            (filterChange)="setBoardFilter($event)"
            (itemOpen)="handleCalendarItemOpen($event)"
          ></app-pm-console-work-calendar>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      height: 100%;
      min-height: 0;
      width: 100%;
    }
    .actions-workspace {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
      height: 100%;
    }
    .actions-control-row {
      padding: 0 0 8px;
      overflow: visible;
      position: relative;
      z-index: 180;
    }
    .workspace-body {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      height: auto;
      min-height: 0;
      overflow: hidden;
      padding: 0;
      position: relative;
      /* z-index intentionally omitted: a stacking context here would trap the
         calendar hover/preview cards beneath the control row (filters). */
    }
    .calendar-view,
    .board-view {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      height: auto;
      min-height: 0;
    }

    .board-view.has-detail-panel {
      display: grid;
      gap: 16px;
      grid-template-columns: minmax(0, 1fr) minmax(292px, 332px);
      overflow: hidden;
    }

    .board-view.has-detail-panel .kanban-board {
      min-width: 0;
    }

    .board-view.is-compact-board {
      overflow: hidden;
    }

    .compact-action-board {
      display: grid;
      flex: 1 1 auto;
      gap: 16px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .compact-action-column {
      background: #f7f8fb;
      border: 1px solid #eef1f6;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 0;
      min-width: 0;
      padding: 14px 12px;
    }

    .compact-action-column header {
      align-items: center;
      display: flex;
      gap: 10px;
      justify-content: space-between;
      min-height: 24px;
      min-width: 0;
    }

    .compact-column-title {
      align-items: center;
      color: #0b0b0b;
      display: inline-flex;
      font-size: 13px;
      font-weight: 600;
      gap: 7px;
      line-height: 18px;
      min-width: 0;
    }

    .compact-column-icon,
    .compact-action-icon {
      align-items: center;
      border-radius: 6px;
      display: inline-flex;
      flex: 0 0 auto;
      justify-content: center;
    }

    .compact-column-icon {
      height: 20px;
      width: 20px;
    }

    .compact-column-icon .icon {
      height: 13px;
      width: 13px;
    }

    .compact-column-icon.red,
    .compact-action-icon.red {
      background: #fff0f0;
      color: #9e2f2f;
    }

    .compact-column-icon.blue,
    .compact-action-icon.blue {
      background: #eef4ff;
      color: #1f4fb8;
    }

    .compact-column-icon.amber {
      background: #fff8e7;
      color: #8a5c12;
    }

    .compact-column-icon.green,
    .compact-action-icon.green {
      background: #eefbf5;
      color: #166b49;
    }

    .compact-action-icon.neutral {
      background: #f2f4f8;
      color: #536071;
    }

    .compact-action-column header strong {
      color: #536071;
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    }

    .compact-action-stack {
      display: grid;
      gap: 10px;
      min-height: 0;
      overflow: auto;
      padding-right: 2px;
    }

    .compact-action-card {
      align-items: center;
      background: #ffffff;
      border: 1px solid #eef1f6;
      border-radius: 7px;
      box-shadow: 0 1px 2px rgba(25, 33, 61, 0.04);
      color: #2f2f2f;
      cursor: pointer;
      display: grid;
      font: inherit;
      gap: 8px;
      grid-template-columns: auto auto minmax(0, 1fr) auto auto;
      min-height: 50px;
      overflow: hidden;
      padding: 8px 8px 8px 0;
      position: relative;
      text-align: left;
      transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
      width: 100%;
    }

    .compact-action-card::before,
    .task-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: 7px 0 0 7px;
    }

    .compact-action-card.red::before,
    .task-card.red::before {
      background: #e05252;
      
    }

    .compact-action-card.blue::before,
    .task-card.blue::before {
      background: #2563eb;
    }

    .compact-action-card.green::before,
    .task-card.green::before {
      background: #22a06b;
    }

    .compact-action-card.amber::before,
    .task-card.amber::before {
      background: #8a5c12;
    }

    .compact-action-card.neutral::before,
    .task-card.neutral::before {
      background: #98a1b2;
    }

    /* Override side stroke colors by card kind */
    .compact-action-card[data-card-kind="report"]::before,
    .task-card[data-card-kind="report"]::before {
      background: #3426f7;
    }

    .compact-action-card[data-card-kind="plan"]::before,
    .task-card[data-card-kind="plan"]::before {
      background: #1f4fb8;
    }

    .compact-action-card[data-card-kind="change"]::before,
    .task-card[data-card-kind="change"]::before {
      background: #9e2f2f;
    }

    .compact-action-card[data-card-kind="benefit"]::before,
    .task-card[data-card-kind="benefit"]::before {
      background: #1f4fb8;
    }

    .compact-action-card[data-card-kind="governance"]::before,
    .task-card[data-card-kind="governance"]::before {
      background: #166b49;
    }

    .compact-action-card:hover,
    .compact-action-card:focus-visible {
      border-color: rgba(16, 6, 159, 0.22);
      box-shadow: 0 6px 14px rgba(25, 33, 61, 0.08);
      outline: 0;
    }

    .compact-action-accent {
      align-self: stretch;
      border-radius: 999px;
      display: block;
      height: 34px;
      margin-left: 0;
      width: 3px;
    }

    .compact-action-accent.blue {
      background: #2563eb;
    }

    .compact-action-accent.red {
      background: #e05252;
    }

    .compact-action-accent.green {
      background: #22a06b;
    }

    .compact-action-accent.neutral {
      background: #98a1b2;
    }

    .compact-action-icon {
      height: 26px;
      width: 26px;
    }

    .compact-action-icon .icon {
      height: 15px;
      width: 15px;
    }

    .compact-action-title {
      color: #252a34;
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .compact-action-count {
      align-items: center;
      color: #10069f;
      display: inline-flex;
      font-size: 12px;
      font-weight: 600;
      justify-content: center;
      line-height: 16px;
      min-width: 18px;
    }

    .compact-action-view {
      align-items: center;
      color: #10069f;
      display: inline-flex;
      font-size: 11px;
      font-weight: 600;
      gap: 4px;
      line-height: 16px;
      white-space: nowrap;
    }

    .compact-action-view .icon {
      height: 13px;
      width: 13px;
    }

    .task-card {
      align-items: center;
      background: #ffffff;
      border: 1px solid #eef1f6;
      border-radius: 12px !important;
      box-shadow: 0 1px 2px rgba(25, 33, 61, 0.04);
      color: #2f2f2f;
      cursor: pointer;
      display: grid !important;
      font: inherit;
      gap: 8px;
      grid-template-columns: auto minmax(0, 1fr) auto;
      min-height: 50px !important;
      overflow: hidden;
      padding: 8px 12px 8px 14px !important;
      position: relative;
      text-align: left;
      transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
      width: 100%;
    }

    .task-card:hover {
      border-color: rgba(16, 6, 159, 0.22);
      box-shadow: 0 6px 14px rgba(25, 33, 61, 0.08);
      transform: translateY(-1px);
    }

    .task-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: 12px 0 0 12px !important;
    }

    .task-card:focus-visible {
      border-color: rgba(16, 6, 159, 0.42);
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.12);
      outline: 0;
    }

    .task-card.is-selected {
      border-color: rgba(16, 6, 159, 0.46);
      box-shadow: 0 8px 20px rgba(25, 33, 61, 0.1);
    }

    .task-card-icon {
      align-items: center;
      border-radius: 6px;
      display: inline-flex;
      flex: 0 0 auto;
      justify-content: center;
      height: 26px;
      width: 26px;
    }

    .task-card-icon .icon {
      height: 15px;
      width: 15px;
    }

    .task-card-icon.blue {
      background: #eef4ff;
      color: #1f4fb8;
    }

    .task-card-icon.red {
      background: #fff0f0;
      color: #9e2f2f;
    }

    .task-card-icon.green {
      background: #eefbf5;
      color: #166b49;
    }

    .task-card-icon.amber {
      background: #fff8e7;
      color: #8a5c12;
    }

    .task-card-icon.neutral {
      background: #f2f4f8;
      color: #536071;
    }

    .task-card-title-container {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .task-card-title {
      color: #252a34;
      font-size: 13px;
      font-weight: 600;
      line-height: 16px;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .task-card-count {
      align-items: center;
      background: #eef4ff;
      color: #10069f;
      border-radius: 999px;
      display: inline-flex;
      font-size: 11px;
      font-weight: 600;
      height: 20px;
      justify-content: center;
      min-width: 20px;
      padding: 0 4px;
    }

    .task-card-action {
      align-items: center;
      color: #10069f;
      display: inline-flex;
      font-size: 11px;
      font-weight: 600;
      gap: 4px;
      line-height: 16px;
      white-space: nowrap;
      margin-left: auto;
    }

    .task-card-action .arrow-icon {
      height: 13px;
      width: 13px;
    }

    .board-detail-panel {
      background: #ffffff;
      border: 1px solid #e3e8f0;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(25, 33, 61, 0.06);
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 0;
      overflow: hidden;
      padding: 14px;
    }

    .board-detail-panel header {
      align-items: center;
      border-bottom: 1px solid #edf0f6;
      display: grid;
      gap: 10px;
      grid-template-columns: auto minmax(0, 1fr) auto;
      padding-bottom: 12px;
    }

    .board-detail-icon {
      align-items: center;
      background: #f5f7fb;
      border-radius: 8px;
      color: #536071;
      display: inline-flex;
      height: 36px;
      justify-content: center;
      width: 36px;
    }

    .board-detail-icon.blue {
      background: #eef4ff;
      color: #1f4fb8;
    }

    .board-detail-icon.green {
      background: #eefbf5;
      color: #166b49;
    }

    .board-detail-icon.red {
      background: #fff0f0;
      color: #9e2f2f;
    }

    .board-detail-icon .icon {
      height: 18px;
      width: 18px;
    }

    .board-detail-panel header small,
    .board-detail-panel p,
    .board-detail-row small,
    .board-detail-empty small {
      color: #657084;
      font-size: 12px;
      line-height: 1.35;
    }

    .board-detail-panel header strong,
    .board-detail-empty strong {
      color: #0b0b0b;
      display: block;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
      margin-top: 2px;
    }

    .board-detail-panel header b {
      align-items: center;
      background: #10069f;
      border-radius: 999px;
      color: #ffffff;
      display: inline-flex;
      font-size: 12px;
      font-weight: 600;
      height: 28px;
      justify-content: center;
      min-width: 28px;
      padding: 0 9px;
    }

    .board-detail-panel p {
      margin: 0;
    }

    .board-detail-list {
      display: grid;
      gap: 8px;
      min-height: 0;
      overflow: auto;
      padding-right: 2px;
    }

    .board-detail-row {
      align-items: center;
      background: #fbfcff;
      border: 1px solid #edf0f6;
      border-radius: 8px;
      color: inherit;
      display: grid;
      gap: 8px;
      grid-template-columns: auto minmax(0, 1fr) auto;
      min-height: 54px;
      padding: 9px 10px;
      text-align: left;
    }

    .board-detail-row:hover,
    .board-detail-row:focus-visible {
      background: #f7f7ff;
      border-color: rgba(16, 6, 159, 0.22);
      outline: 0;
    }

    .board-detail-row strong,
    .board-detail-row small {
      display: block;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .board-detail-row strong {
      color: #252a34;
      font-size: 12.5px;
      font-weight: 600;
      line-height: 1.25;
    }

    .board-detail-row-dot {
      border-radius: 999px;
      height: 8px;
      width: 8px;
    }

    .board-detail-row-dot.blue {
      background: #2563eb;
    }

    .board-detail-row-dot.green {
      background: #22a06b;
    }

    .board-detail-row-dot.red {
      background: #e05252;
    }

    .board-detail-row-dot.neutral {
      background: #98a1b2;
    }

    .board-detail-row-owner {
      align-items: center;
      background: #f2f4f8;
      border: 1px solid #e3e7ef;
      border-radius: 999px;
      color: #667085;
      display: inline-flex;
      font-size: 10px;
      font-weight: 600;
      height: 24px;
      justify-content: center;
      min-width: 24px;
      padding: 0 6px;
    }

    .board-detail-open {
      align-items: center;
      background: #10069f;
      border: 1px solid #10069f;
      border-radius: 8px;
      color: #ffffff;
      display: inline-flex;
      font-size: 12.5px;
      font-weight: 600;
      gap: 8px;
      height: 38px;
      justify-content: center;
      margin-top: auto;
      padding: 0 14px;
    }

    .board-detail-open:hover,
    .board-detail-open:focus-visible {
      background: #1c16b8;
      outline: 2px solid rgba(16, 6, 159, 0.18);
      outline-offset: 2px;
    }

    .board-detail-open .icon {
      height: 15px;
      width: 15px;
    }

    .board-detail-empty {
      align-content: center;
      color: #657084;
      display: grid;
      gap: 8px;
      height: 100%;
      justify-items: center;
      min-height: 220px;
      text-align: center;
    }

    .board-detail-empty .icon {
      color: #10069f;
      height: 24px;
      width: 24px;
    }
    app-pm-console-work-calendar {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }

    .portfolio-target-picker {
      flex: 0 0 auto;
      min-width: 0;
    }

    .target-picker-dropdown {
      position: relative;
    }

    .target-picker-dropdown[open] {
      z-index: 220;
    }

    .target-picker-dropdown summary {
      border-radius: var(--action-control-radius);
      height: var(--action-control-height);
      min-width: 220px;
      padding: 0 12px;
    }

    .target-picker-menu {
      display: grid;
      gap: 8px;
      max-height: 360px;
      min-width: 330px;
      overflow: auto;
      padding: 8px;
      z-index: 220;
    }

    .target-picker-search {
      align-items: center;
      background: #ffffff;
      border: 1px solid #e3e8f0;
      border-radius: 8px;
      color: #6f7785;
      display: flex;
      gap: 8px;
      height: 36px;
      margin-bottom: 6px;
      padding: 0 10px;
      position: relative;
      z-index: 3;
    }

    .target-picker-reset {
      align-items: center;
      background: #f4f6fb;
      border: 0;
      border-radius: 8px;
      color: var(--brand, #10069f);
      cursor: pointer;
      display: flex;
      gap: 8px;
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      min-height: 36px;
      padding: 8px 10px;
      text-align: left;
      width: 100%;
    }

    .target-picker-reset .icon {
      height: 13px;
      width: 13px;
    }

    .target-picker-reset:hover,
    .target-picker-reset:focus-visible {
      background: #eef0ff;
      outline: 0;
    }

    .target-picker-search input {
      background: transparent;
      border: 0;
      color: #252a34;
      font: inherit;
      font-size: 12px;
      min-width: 0;
      outline: 0;
      width: 100%;
    }

    .target-picker-search .icon {
      height: 15px;
      width: 15px;
    }

    .target-picker-group {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .target-picker-group summary::-webkit-details-marker {
      display: none;
    }

    .target-picker-group-label {
      align-items: center;
      border: 1px solid #e3e8f0;
      border-radius: 8px;
      color: #4c5566;
      cursor: pointer;
      display: flex;
      font-size: 11.5px;
      font-weight: 500;
      gap: 8px;
      justify-content: space-between;
      letter-spacing: 0;
      min-height: 42px;
      padding: 8px 12px;
      text-transform: none;
      user-select: none;
    }

    .target-picker-group-label .icon {
      height: 13px;
      transition: transform 160ms ease;
      width: 13px;
    }

    .target-picker-group:not([open]) .target-picker-group-label .icon {
      transform: rotate(-90deg);
    }

    .target-picker-option {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: #252a34;
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 10px;
      min-height: 40px;
      min-width: 0;
      padding: 6px 12px;
      text-align: left;
      width: 100%;
    }

    .target-picker-option:hover,
    .target-picker-option.active {
      background: #f4f6fb;
    }

    .target-picker-option.active {
      color: var(--brand, #10069f);
    }

    .target-picker-check {
      align-items: center;
      background: #ffffff;
      border: 1px solid #cfd6e4;
      border-radius: 4px;
      color: #ffffff;
      display: inline-flex;
      flex: 0 0 auto;
      height: 16px;
      justify-content: center;
      margin-top: 1px;
      width: 16px;
    }

    .target-picker-check .icon {
      height: 11px;
      opacity: 0;
      width: 11px;
    }

    .target-picker-check.checked {
      background: var(--brand, #10069f);
      border-color: var(--brand, #10069f);
    }

    .target-picker-check.checked .icon {
      opacity: 1;
    }

    .target-option-copy {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .target-picker-option strong,
    .target-picker-option small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .target-picker-option strong {
      background: transparent;
      border-radius: 0;
      color: inherit;
      display: block;
      font-size: 11.5px;
      font-weight: 500;
      height: auto;
      justify-content: flex-start;
      line-height: 16px;
      min-width: 0;
      padding: 0;
    }

    .target-picker-option small {
      color: #737b8c;
      display: block;
      font-size: 11px;
      font-weight: 400;
      line-height: 14px;
    }

    .target-picker-empty {
      color: #737b8c;
      font-size: 12px;
      padding: 12px 8px;
      text-align: center;
    }

    @media (max-width: 900px) {
      .target-picker-dropdown summary,
      .target-picker-menu {
        min-width: min(330px, calc(100vw - 48px));
      }

      .board-view.has-detail-panel {
        grid-template-columns: minmax(0, 1fr);
        overflow: auto;
      }

      .compact-action-board {
        grid-template-columns: minmax(0, 1fr);
        overflow: auto;
      }

      .board-detail-panel {
        min-height: 320px;
      }
    }

    .compact-column-icon {
      background: transparent !important;
      color: #657084 !important;
      height: 20px;
      width: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .compact-column-icon .icon {
      height: 16px !important;
      width: 16px !important;
    }

    .compact-action-card {
      align-items: center;
      background: #ffffff;
      border: 1px solid #eef1f6;
      border-radius: 12px !important;
      box-shadow: 0 1px 2px rgba(25, 33, 61, 0.04);
      color: #2f2f2f;
      cursor: pointer;
      display: grid;
      font: inherit;
      gap: 8px;
      grid-template-columns: auto minmax(0, 1fr) auto auto !important;
      min-height: 64px !important;
      overflow: hidden;
      padding: 14px 12px 14px 12px !important;
      position: relative;
      text-align: left;
      transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
      width: 100%;
    }

    .compact-action-card::before {
      display: none !important;
    }

    .compact-action-title,
    .task-card-title {
      font-size: 13px !important;
      font-weight: 300 !important;
    }

    .compact-action-count {
      align-items: center;
      background: #eef4ff !important;
      color: #2f2f2f !important;
      border-radius: 50% !important;
      display: inline-flex;
      font-size: 12px;
      font-weight: 300 !important;
      height: 24px !important;
      justify-content: center;
      min-width: 24px !important;
      padding: 0 !important;
    }

    .compact-action-view,
    .task-card-action {
      font-weight: 300 !important;
    }

    .compact-action-view span,
    .task-card-action span {
      font-weight: 300 !important;
    }

    /* Type-specific colors and opacities (25% stroke, 10% icon container, 100% icon) */
    [data-card-type="Governance Committees"]::before,
    [data-card-type="Governance Committees"] .compact-action-accent {
      background: rgba(52, 84, 196, 0.25) !important;
    }
    [data-card-type="Governance Committees"] .compact-action-icon,
    [data-card-type="Governance Committees"] .task-card-icon {
      background: rgba(52, 84, 196, 0.1) !important;
      color: #3454c4 !important;
    }

    [data-card-type="Change requests"]::before,
    [data-card-type="Change requests"] .compact-action-accent,
    [data-card-type="Change Requests"]::before,
    [data-card-type="Change Requests"] .compact-action-accent {
      background: rgba(196, 52, 114, 0.25) !important;
    }
    [data-card-type="Change requests"] .compact-action-icon,
    [data-card-type="Change requests"] .task-card-icon,
    [data-card-type="Change Requests"] .compact-action-icon,
    [data-card-type="Change Requests"] .task-card-icon {
      background: rgba(196, 52, 114, 0.1) !important;
      color: #c43472 !important;
    }

    [data-card-type="Status reports"]::before,
    [data-card-type="Status reports"] .compact-action-accent,
    [data-card-type="Status Reports"]::before,
    [data-card-type="Status Reports"] .compact-action-accent {
      background: rgba(111, 32, 149, 0.25) !important;
    }
    [data-card-type="Status reports"] .compact-action-icon,
    [data-card-type="Status reports"] .task-card-icon,
    [data-card-type="Status Reports"] .compact-action-icon,
    [data-card-type="Status Reports"] .task-card-icon {
      background: rgba(111, 32, 149, 0.1) !important;
      color: #6f2095 !important;
    }

    [data-card-type="Plans"]::before,
    [data-card-type="Plans"] .compact-action-accent,
    [data-card-type="Project Plans"]::before,
    [data-card-type="Project Plans"] .compact-action-accent {
      background: rgba(121, 186, 221, 0.25) !important;
    }
    [data-card-type="Plans"] .compact-action-icon,
    [data-card-type="Plans"] .task-card-icon,
    [data-card-type="Project Plans"] .compact-action-icon,
    [data-card-type="Project Plans"] .task-card-icon {
      background: rgba(121, 186, 221, 0.1) !important;
      color: #79badd !important;
    }

    [data-card-type="Benefits"]::before,
    [data-card-type="Benefits"] .compact-action-accent {
      background: rgba(22, 107, 73, 0.25) !important;
    }
    [data-card-type="Benefits"] .compact-action-icon,
    [data-card-type="Benefits"] .task-card-icon {
      background: rgba(22, 107, 73, 0.1) !important;
      color: #166b49 !important;
    }
  `],
})
export class PortfolioManagerActionsComponent implements AfterViewChecked, OnDestroy {
  @Input() workspaceTitle = 'Portfolio Name';
  @Input() boardWorkspaceTitle = '';
  @Input() searchPlaceholder = 'Search actions...';
  @Input() targetPickerAriaLabel = 'Portfolio work target selector';
  @Input() targetAllLabel = 'All portfolios';
  @Input() actionItems: readonly PortfolioActionItem[] = portfolioActionItems;
  @Input() boardFilters: readonly PortfolioBoardFilter[] = portfolioBoardFilters;
  @Input() showTargetPicker = true;
  @Input() openItemsInDrawer = true;
  @Input() showBoardDetailPanel = false;
  @Input() boardPresentation: PortfolioActionsBoardPresentation = 'kanban';
  @Input() todayKey = '2026-05-12';
  @Output() readonly actionSelected = new EventEmitter<PortfolioActionItem>();

  activeView: 'calendar' | 'board' = 'calendar';
  calendarMonth = new Date(2026, 4, 1); // May 2026
  selectedFilter = 'all';
  selectedTargetId = 'portfolio::all';
  selectedTargetIds = new Set<string>(['portfolio::all']);
  selectedBoardItemId = '';
  searchQuery = '';
  targetSearchQuery = '';

  readonly programs = portfolioProgramRows;
  readonly standaloneProjects = standaloneProjects;
  readonly portfolios: readonly PortfolioTargetRow[] = [
    { name: 'Tasama Client 1', programs: portfolioProgramRows },
  ];
  readonly collapsedTargetGroupIds = new Set<PortfolioWorkTargetGroup['id']>(['programs', 'projects']);

  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly actionDrawer: PortfolioManagerActionDrawerService,
    private readonly iconsService: PmConsoleIconService,
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  ngOnDestroy(): void {
    if (this.openItemsInDrawer) {
      this.actionDrawer.close();
    }
  }

  iconName(name: string): string {
    return iconName(name);
  }

  get currentWorkspaceTitle(): string {
    return this.activeView === 'board' && this.boardWorkspaceTitle ? this.boardWorkspaceTitle : this.workspaceTitle;
  }

  setView(view: 'calendar' | 'board'): void {
    this.activeView = view;
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  setBoardFilter(filterId: string, event?: Event): void {
    this.selectedFilter = filterId;
    if (event) {
      (event.currentTarget as HTMLElement | null)?.closest('details')?.removeAttribute('open');
    }
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  resetFilters(event?: Event): void {
    event?.stopPropagation();
    this.selectedTargetId = 'portfolio::all';
    this.selectedTargetIds.clear();
    this.selectedTargetIds.add('portfolio::all');
    this.selectedFilter = 'all';
    this.searchQuery = '';
    this.targetSearchQuery = '';
    this.collapsedTargetGroupIds.clear();
    this.collapsedTargetGroupIds.add('programs');
    this.collapsedTargetGroupIds.add('projects');
    (event?.currentTarget as HTMLElement | null)?.closest('details.target-picker-dropdown')?.removeAttribute('open');
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  onFilterDropdownToggle(event: Event): void {
    const current = event.currentTarget as HTMLDetailsElement;
    if (!current.open) return;
    const filters = this.elementRef.nativeElement.querySelectorAll<HTMLDetailsElement>('.actions-control-row > .portfolio-target-picker > details, .actions-control-row > .board-filter > details');
    filters.forEach((details) => {
      if (details !== current) details.removeAttribute('open');
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase().trim();
    this.changeDetector.markForCheck();
  }

  onTargetSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.targetSearchQuery = input.value.toLowerCase().trim();
    if (this.targetSearchQuery) {
      this.collapsedTargetGroupIds.clear();
    }
    this.changeDetector.markForCheck();
  }

  onTargetGroupToggle(groupId: PortfolioWorkTargetGroup['id'], event: Event): void {
    const details = event.currentTarget as HTMLDetailsElement;
    if (details.open) {
      this.collapsedTargetGroupIds.clear();
      this.collapsedTargetGroupIds.delete(groupId);
    } else {
      this.collapsedTargetGroupIds.add(groupId);
    }
    this.changeDetector.markForCheck();
  }

  isTargetGroupExpanded(groupId: PortfolioWorkTargetGroup['id']): boolean {
    return !this.collapsedTargetGroupIds.has(groupId);
  }

  selectTarget(targetId: string, event?: Event): void {
    event?.stopPropagation();
    const target = this.targetOptions.find((option) => option.id === targetId);
    const isAllTarget = targetId === 'portfolio::all' || targetId === 'program::all' || targetId === 'project::all' || target?.type === 'all';

    if (isAllTarget) {
      this.selectedTargetIds.clear();
      this.selectedTargetIds.add(targetId);
    } else {
      this.selectedTargetIds.delete('portfolio::all');
      this.selectedTargetIds.delete('program::all');
      this.selectedTargetIds.delete('project::all');
      if (this.selectedTargetIds.has(targetId)) {
        this.selectedTargetIds.delete(targetId);
      } else {
        this.selectedTargetIds.add(targetId);
      }
      if (!this.selectedTargetIds.size) {
        this.selectedTargetIds.add('portfolio::all');
      }
    }

    this.selectedTargetId = Array.from(this.selectedTargetIds)[0] || 'portfolio::all';
    this.targetSearchQuery = '';
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  isTargetSelected(targetId: string): boolean {
    return this.selectedTargetIds.has(targetId);
  }

  handleAddActionItem(): void {
    alert('Create Action flow coming soon');
  }

  handleTaskAction(item: PortfolioActionItem, event?: Event): void {
    event?.stopPropagation();
    this.openActionDrawer(item);
  }

  handleCalendarItemOpen(item: PmConsoleCalendarItem): void {
    const portfolioItem = item as PortfolioCalendarItem;
    const action = this.actionItems.find((candidate) => candidate.id === portfolioItem.id)
      || this.actionItems.find((candidate) =>
        candidate.date === portfolioItem.date
        && candidate.label === portfolioItem.label
        && candidate.project === portfolioItem.project
        && candidate.kind === portfolioItem.kind
      );
    if (!action) return;
    this.openActionDrawer(action);
  }

  openActionDrawer(item: PortfolioActionItem): void {
    this.actionSelected.emit(item);
    if (!this.openItemsInDrawer) return;
    this.actionDrawer.open(item);
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  // Getters
  get allTargetOption(): PortfolioWorkTargetOption {
    return {
      id: 'portfolio::all',
      label: 'All portfolios',
      type: 'all',
    };
  }

  get selectedFilterOption(): PortfolioBoardFilter {
    return this.boardFilters.find((f) => f.id === this.selectedFilter) || this.boardFilters[0];
  }

  get targetGroups(): PortfolioWorkTargetGroup[] {
    const actionProjectOptions = this.actionItems
      .filter((item) => item.targetType === 'project')
      .map((item) => item.project);
    const fixtureProjectOptions = [
      ...this.programs.flatMap((program) => (program.projects || []).map((project) => project.name)),
      ...this.standaloneProjects.map((project) => project.name),
    ];
    const fixtureProjectNames = new Set(fixtureProjectOptions);
    const actionOnlyProjects = Array.from(new Set(actionProjectOptions))
      .filter((projectName) => !fixtureProjectNames.has(projectName))
      .map((projectName) => this.createProjectTarget(projectName, 'Action workspace'));

    return [
      {
        id: 'portfolios',
        label: 'Portfolios',
        options: [
          this.allTargetOption,
          ...this.portfolios.map((portfolio) => ({
            id: `portfolio::${portfolio.name}`,
            label: portfolio.name,
            type: 'portfolio' as const,
            projectNames: Array.from(new Set([
              ...(portfolio.programs || []).flatMap((prog) => (prog.projects || []).map((proj) => proj.name)),
              ...actionProjectOptions,
            ])),
          })),
        ],
      },
      {
        id: 'programs',
        label: 'Programs',
        options: [
          {
            id: 'program::all',
            label: 'All programs',
            type: 'program' as const,
            projectNames: Array.from(new Set([
              ...this.programs.flatMap((program) => (program.projects || []).map((project) => project.name)),
              ...actionProjectOptions,
            ])),
          },
          ...this.programs.map((program) => this.createProgramTarget(program)),
        ],
      },
      {
        id: 'projects',
        label: 'Projects',
        options: [
          {
            id: 'project::all',
            label: 'All projects',
            type: 'project' as const,
            projectNames: Array.from(new Set([...fixtureProjectOptions, ...actionProjectOptions])),
          },
          ...this.programs.flatMap((program) =>
            (program.projects || []).map((project) => this.createProjectTarget(project.name, program.name)),
          ),
          ...this.standaloneProjects.map((project) => this.createProjectTarget(project.name, 'Standalone project')),
          ...actionOnlyProjects,
        ],
      },
    ];
  }

  get filteredTargetGroups(): PortfolioWorkTargetGroup[] {
    const query = this.targetSearchQuery;
    if (!query) return this.targetGroups;

    return this.targetGroups.map((group) => ({
      ...group,
      options: group.options.filter((option) =>
        [option.label, option.parentLabel || '', option.type].some((value) => value.toLowerCase().includes(query)),
      ),
    }));
  }

  get hasFilteredTargetOptions(): boolean {
    return this.filteredTargetGroups.some((group) => group.options.length > 0);
  }

  get targetOptions(): PortfolioWorkTargetOption[] {
    return this.targetGroups.flatMap((group) => group.options);
  }

  get selectedTargetOption(): PortfolioWorkTargetOption {
    const selectedIds = Array.from(this.selectedTargetIds);
    if (selectedIds.length === 1) {
      return this.targetOptions.find((option) => option.id === selectedIds[0]) || this.allTargetOption;
    }
    return {
      id: 'selected-targets',
      label: `${selectedIds.length} filters`,
      type: 'all',
    };
  }

  get targetPickerLabel(): string {
    return this.selectedTargetOption.label;
  }

  get targetPickerIcon(): string {
    if (this.selectedTargetIds.size > 1) return 'list-filter';
    return this.targetIconName(this.selectedTargetOption);
  }

  getFilterIdForKind(kind: string): string {
    if (kind === 'report') return 'report';
    if (kind === 'benefit') return 'benefit';
    if (kind === 'change') return 'change';
    if (kind === 'risk') return 'risk';
    if (kind === 'governance') return 'governance';
    return 'plan';
  }

  get filteredItems(): PortfolioActionItem[] {
    return this.actionItems.filter((item) => {
      if (!this.matchesSelectedTarget(item)) {
        return false;
      }
      // Filter category using the mapper
      if (this.selectedFilter !== 'all' && this.getFilterIdForKind(item.kind) !== this.selectedFilter) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        if (!this.matchesSearch(item, this.searchQuery)) {
          return false;
        }
      }
      return true;
    });
  }

  get activeBoardItem(): PortfolioActionItem | null {
    const items = this.visibleBoardColumns.flatMap((column) => column.items);
    if (!items.length) return null;
    return items.find((item) => item.id === this.selectedBoardItemId) || items[0];
  }

  // Calendar getters and cells logic
  get calendarMonthLabel(): string {
    return this.calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get visibleMonthItems(): PortfolioCalendarItem[] {
    return this.filteredItems
      .filter((item) => this.sameMonth(this.parseDate(item.date), this.calendarMonth))
      .map((item) => ({
        id: item.id,
        date: item.date,
        label: item.label,
        tone: item.tone,
        project: item.project,
        targetType: item.targetType,
        kind: item.kind
      }));
  }

  get visibleMonthItemCount(): number {
    return this.filteredItems
      .filter((item) => this.sameMonth(this.parseDate(item.date), this.calendarMonth))
      .reduce((total, item) => total + this.actionItemTotal(item), 0);
  }

  get calendarCells(): PmConsoleCalendarCell[] {
    const month = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth(), 1);
    const firstDayOffset = (month.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
    const gridStart = this.addDays(month, -firstDayOffset);

    return Array.from({ length: totalCells }, (_, index) => {
      const date = this.addDays(gridStart, index);
      const key = this.dateKey(date);
      const current = this.sameMonth(date, month);

      return {
        key,
        day: date.getDate(),
        current,
        today: key === this.todayKey,
        items: current ? this.visibleMonthItems.filter((item) => item.date === key) : [],
      };
    });
  }

  get calendarFilterOptions(): PmConsoleCalendarFilter[] {
    return this.boardFilters.map((filter) => ({
      id: filter.id,
      label: filter.label,
      icon: this.iconName(filter.icon),
      count: this.countCalendarFilter(filter),
    }));
  }

  countCalendarFilter(filter: PortfolioBoardFilter): number {
    const items = this.filteredItems.filter((item) => this.sameMonth(this.parseDate(item.date), this.calendarMonth));
    if (filter.id === 'all') return this.sumActionItems(items);
    return this.sumActionItems(items.filter((item) => this.getFilterIdForKind(item.kind) === filter.id));
  }

  countForActionFilter(filter: PortfolioBoardFilter): number {
    const targetItems = this.actionItems.filter((item) => this.matchesSelectedTarget(item));
    const searchedItems = this.searchQuery
      ? targetItems.filter((item) => this.matchesSearch(item, this.searchQuery))
      : targetItems;
    if (filter.id === 'all') return this.sumActionItems(searchedItems);
    return this.sumActionItems(searchedItems.filter((item) => this.getFilterIdForKind(item.kind) === filter.id));
  }

  targetIconName(target: PortfolioWorkTargetOption): string {
    if (target.type === 'portfolio') return 'briefcase';
    if (target.type === 'program') return 'network';
    if (target.type === 'project') return 'folder';
    return 'grid';
  }

  targetCountLabel(target: PortfolioWorkTargetOption): string {
    const count = target.projectNames?.length || 0;
    return count === 1 ? '1 project' : `${count} projects`;
  }

  targetOptionSubtitle(target: PortfolioWorkTargetOption): string {
    if (target.type === 'all') return `${this.actionItems.length} actions`;
    if (target.type === 'program' || target.type === 'portfolio') return this.targetCountLabel(target);
    if (target.id === 'project::all') return `${target.projectNames?.length || 0} projects`;
    return 'Standalone project';
  }

  // Board columns
  get visibleBoardColumns(): PortfolioBoardColumn[] {
    const items = this.filteredItems;
    return [
      {
        column: 'Overdue',
        tone: 'red',
        items: items.filter((item) => item.column === 'Overdue')
      },
      {
        column: 'This week',
        tone: 'blue',
        items: items.filter((item) => item.column === 'This week')
      },
      {
        column: 'Upcoming',
        tone: 'amber',
        items: items.filter((item) => item.column === 'Upcoming')
      }
    ];
  }

  selectBoardItem(item: PortfolioActionItem): void {
    if (!this.showBoardDetailPanel) {
      this.openActionDrawer(item);
      return;
    }
    this.selectedBoardItemId = item.id;
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  boardColumnCount(items: readonly PortfolioActionItem[]): number {
    return this.sumActionItems(items);
  }

  compactColumnItems(column: PortfolioBoardColumn): PortfolioActionItem[] {
    const grouped: Record<string, PortfolioActionItem[]> = {};
    for (const item of column.items) {
      const typeKey = item.type || 'Other';
      if (!grouped[typeKey]) {
        grouped[typeKey] = [];
      }
      grouped[typeKey].push(item);
    }

    const orderByColumn: Record<PortfolioBoardColumn['column'], readonly string[]> = {
      Overdue: ['Status Reports', 'Project Plans', 'Change Requests', 'Benefits', 'Governance Committees'],
      'This week': ['Project Plans', 'Governance Committees', 'Status Reports', 'Change Requests', 'Benefits'],
      Upcoming: ['Change Requests', 'Benefits', 'Status Reports', 'Project Plans', 'Governance Committees'],
    };
    const order = orderByColumn[column.column];

    const result: PortfolioActionItem[] = [];
    for (const [typeKey, items] of Object.entries(grouped)) {
      const firstItem = items[0];
      result.push({
        id: `pmo-group-${column.column}-${firstItem.kind}`,
        date: firstItem.date,
        label: typeKey,
        project: firstItem.project,
        targetType: 'portfolio',
        type: typeKey,
        kind: firstItem.kind,
        tone: firstItem.tone,
        owner: 'PMO',
        meta: `Showing all ${items.length} ${typeKey.toLowerCase()}`,
        cta: 'View All',
        column: column.column,
        detailItems: items,
        detailSummary: `Showing all ${items.length} ${typeKey.toLowerCase()}`,
      });
    }

    return result.sort((first, second) => {
      const firstIndex = order.indexOf(first.type);
      const secondIndex = order.indexOf(second.type);
      return (firstIndex === -1 ? order.length : firstIndex) - (secondIndex === -1 ? order.length : secondIndex);
    });
  }

  actionItemTotal(item: PortfolioActionItem): number {
    return item.detailItems?.length || 1;
  }

  actionItemAriaLabel(item: PortfolioActionItem): string {
    const total = this.actionItemTotal(item);
    const suffix = total === 1 ? '1 item' : `${total} items`;
    return `${item.label}, ${item.column}, ${suffix}. Select action list.`;
  }

  detailItemsFor(item: PortfolioActionItem): readonly PortfolioActionItem[] {
    return item.detailItems?.length ? item.detailItems : [item];
  }

  boardDetailIcon(item: PortfolioActionItem): string {
    if (item.kind === 'plan') return 'file-text';
    if (item.kind === 'report') return 'chart-column';
    if (item.kind === 'benefit') return 'circle-check';
    if (item.kind === 'change') return 'git-pull-request';
    if (item.kind === 'governance') return 'landmark';
    return this.boardColumnIcon(item.column);
  }

  boardDetailSummary(item: PortfolioActionItem): string {
    if (item.detailSummary) return item.detailSummary;
    const total = this.actionItemTotal(item);
    return total === 1
      ? `${item.project} has one action ready for review.`
      : `${item.project} has ${total} actions ready for review.`;
  }

  boardColumnIcon(column: string): string {
    if (column === 'Overdue') return 'triangle-alert';
    if (column === 'This week') return 'calendar-days';
    return 'clock-3';
  }

  taskCardClass(type: string): string {
    return type
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  shiftMonth(delta: number): void {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + delta, 1);
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  // Private helpers
  private parseDate(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private dateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private sameMonth(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
  }

  private createProgramTarget(program: ProgramRow): PortfolioWorkTargetOption {
    return {
      id: `program::${program.name}`,
      label: program.name,
      type: 'program',
      projectNames: (program.projects || []).map((project) => project.name),
    };
  }

  private createProjectTarget(projectName: string, parentLabel: string): PortfolioWorkTargetOption {
    return {
      id: `project::${projectName}`,
      label: projectName,
      type: 'project',
      parentLabel,
    };
  }

  private matchesSelectedTarget(item: PortfolioActionItem): boolean {
    if (!this.showTargetPicker) return true;
    const selectedTargets = Array.from(this.selectedTargetIds)
      .map((targetId) => this.targetOptions.find((target) => target.id === targetId))
      .filter((target): target is PortfolioWorkTargetOption => Boolean(target));
    if (!selectedTargets.length) return true;
    return selectedTargets.some((target) => {
      if (target.type === 'all' || target.id === 'portfolio::all') return true;
      if (target.id === 'program::all' || target.id === 'project::all') return Boolean(target.projectNames?.includes(item.project));
      if (target.type === 'project') return item.project === target.label;
      if (target.type === 'portfolio') {
        return item.project === target.label || Boolean(target.projectNames?.includes(item.project));
      }
      return item.project === target.label || Boolean(target.projectNames?.includes(item.project));
    });
  }

  private matchesSearch(item: PortfolioActionItem, query: string): boolean {
    const values = [
      item.label,
      item.project,
      item.type,
      item.meta,
      ...this.detailItemsFor(item).flatMap((detail) => [detail.label, detail.project, detail.type, detail.meta]),
    ];
    return values.some((value) => value.toLowerCase().includes(query));
  }

  private sumActionItems(items: readonly PortfolioActionItem[]): number {
    return items.reduce((total, item) => total + this.actionItemTotal(item), 0);
  }
}
