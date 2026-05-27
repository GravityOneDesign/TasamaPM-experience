import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleWorkCalendarComponent, PmConsoleCalendarCell, PmConsoleCalendarItem, PmConsoleCalendarFilter } from './shared/pm-console-work-calendar.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { iconName } from './portfolio-manager-icon.utils';
import { portfolioActionItems, portfolioBoardFilters, PortfolioActionItem, PortfolioBoardFilter, PortfolioBoardColumn } from './portfolio-manager-actions.data';
import { PortfolioManagerActionDrawerService } from './portfolio-manager-action-drawer.service';
import { portfolioProgramRows, standaloneProjects, type ProgramRow } from './portfolio-workspace/portfolio-workspace.data';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

type PortfolioWorkTargetType = 'all' | 'program' | 'project';
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
  id: 'programs' | 'projects';
  label: string;
  options: PortfolioWorkTargetOption[];
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
        <h2 class="workspace-action-title">{{ workspaceTitle }}</h2>

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
          <details class="work-filter-dropdown target-picker-dropdown">
            <summary [attr.aria-label]="'Select program or project: ' + selectedTargetOption.label">
              <span class="work-filter-selected-icon">
                <span class="icon" aria-hidden="true">
                  <i [attr.data-lucide]="targetIconName(selectedTargetOption)"></i>
                </span>
              </span>
              <span>{{ selectedTargetOption.label }}</span>
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

              <button
                class="target-picker-option all-target"
                [class.active]="selectedTargetId === allTargetOption.id"
                type="button"
                role="menuitemradio"
                [attr.aria-checked]="selectedTargetId === allTargetOption.id"
                (click)="selectTarget(allTargetOption.id, $event)"
              >
                <span class="target-option-copy">
                  <strong>{{ allTargetOption.label }}</strong>
                  <small>{{ actionItems.length }} actions</small>
                </span>
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
                          [class.active]="selectedTargetId === target.id"
                          type="button"
                          role="menuitemradio"
                          [attr.aria-checked]="selectedTargetId === target.id"
                          (click)="selectTarget(target.id, $event)"
                        >
                          <span class="target-option-copy">
                            <strong>{{ target.label }}</strong>
                            @if (target.parentLabel) {
                              <small>{{ target.parentLabel }}</small>
                            } @else {
                              <small>{{ target.type === 'program' ? targetCountLabel(target) : 'Standalone project' }}</small>
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
          <details class="work-filter-dropdown">
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
                        type="button"
                        [attr.aria-label]="actionItemAriaLabel(item)"
                        [disabled]="!(column.column === 'Overdue' && item.type === 'Status Reports')"
                        (click)="selectBoardItem(item)"
                      >
                        <span class="compact-action-accent {{ item.tone }}" aria-hidden="true"></span>
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
                        class="task-card {{ taskCardClass(item.type) }}"
                        [class.is-selected]="activeBoardItem?.id === item.id"
                        [class.has-volume]="actionItemTotal(item) > 1"
                        [attr.data-card-kind]="item.kind"
                        type="button"
                        [attr.aria-label]="actionItemAriaLabel(item)"
                        (click)="selectBoardItem(item)"
                      >
                        <div class="task-top">
                          <span>{{ item.type }}</span>
                          @if (actionItemTotal(item) > 1) {
                            <strong class="task-volume-count">{{ actionItemTotal(item) }}</strong>
                          }
                        </div>
                        <h3>{{ item.label }}</h3>
                        <p>{{ item.project }}</p>
                        <div class="task-bottom">
                          <span class="avatar-sm">{{ item.owner }}</span>
                          <small>{{ item.meta }}</small>
                          <span class="task-action">
                            <span>{{ item.cta }}</span>
                            <span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                          </span>
                        </div>
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
      z-index: 0;
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
      color: inherit;
      cursor: pointer;
      font: inherit;
      text-align: left;
      width: 100%;
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

    .task-card.has-volume {
      min-height: 164px;
    }

    .task-card .task-top {
      display: flex;
      justify-content: space-between;
    }

    .task-volume-count {
      align-items: center;
      background: #10069f;
      border-radius: 999px;
      color: #ffffff;
      display: inline-flex;
      flex: 0 0 auto;
      font-size: 12px;
      font-weight: 600;
      height: 28px;
      justify-content: center;
      line-height: 1;
      min-width: 28px;
      padding: 0 9px;
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
      gap: 2px;
      max-height: 360px;
      min-width: 330px;
      overflow: auto;
      padding: 6px;
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
      position: sticky;
      top: 0;
      z-index: 2;
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
      gap: 2px;
      min-width: 0;
    }

    .target-picker-group summary::-webkit-details-marker {
      display: none;
    }

    .target-picker-group-label {
      align-items: center;
      color: #4c5566;
      cursor: pointer;
      display: flex;
      font-size: 11.5px;
      font-weight: 500;
      gap: 8px;
      justify-content: space-between;
      letter-spacing: 0;
      padding: 8px 8px 4px;
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
      min-height: 40px;
      min-width: 0;
      padding: 6px 10px;
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
  `],
})
export class PortfolioManagerActionsComponent implements AfterViewChecked, OnDestroy {
  @Input() workspaceTitle = 'Portfolio Name';
  @Input() searchPlaceholder = 'Search actions...';
  @Input() targetPickerAriaLabel = 'Portfolio work target selector';
  @Input() targetAllLabel = 'All programs and projects';
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
  selectedTargetId = 'all';
  selectedBoardItemId = '';
  searchQuery = '';
  targetSearchQuery = '';

  readonly programs = portfolioProgramRows;
  readonly standaloneProjects = standaloneProjects;
  readonly collapsedTargetGroupIds = new Set<PortfolioWorkTargetGroup['id']>();

  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly actionDrawer: PortfolioManagerActionDrawerService,
    private readonly iconsService: PmConsoleIconService
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
    this.selectedTargetId = targetId;
    this.targetSearchQuery = '';
    if (event) {
      (event.currentTarget as HTMLElement | null)?.closest('details')?.removeAttribute('open');
    }
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
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
      id: 'all',
      label: this.targetAllLabel,
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
        id: 'programs',
        label: 'Programs',
        options: this.programs.map((program) => this.createProgramTarget(program)),
      },
      {
        id: 'projects',
        label: 'Projects',
        options: [
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
    return [this.allTargetOption, ...this.targetGroups.flatMap((group) => group.options)];
  }

  get selectedTargetOption(): PortfolioWorkTargetOption {
    return this.targetOptions.find((option) => option.id === this.selectedTargetId) || this.allTargetOption;
  }

  get filteredItems(): PortfolioActionItem[] {
    return this.actionItems.filter((item) => {
      if (!this.matchesSelectedTarget(item)) {
        return false;
      }
      // Filter category
      if (this.selectedFilter !== 'all' && item.kind !== this.selectedFilter) {
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
    return this.sumActionItems(items.filter((item) => item.kind === filter.id));
  }

  countForActionFilter(filter: PortfolioBoardFilter): number {
    const targetItems = this.actionItems.filter((item) => this.matchesSelectedTarget(item));
    const searchedItems = this.searchQuery
      ? targetItems.filter((item) => this.matchesSearch(item, this.searchQuery))
      : targetItems;
    if (filter.id === 'all') return this.sumActionItems(searchedItems);
    return this.sumActionItems(searchedItems.filter((item) => item.kind === filter.id));
  }

  targetIconName(target: PortfolioWorkTargetOption): string {
    if (target.type === 'program') return 'network';
    if (target.type === 'project') return 'folder';
    return 'grid';
  }

  targetCountLabel(target: PortfolioWorkTargetOption): string {
    const count = target.projectNames?.length || 0;
    return count === 1 ? '1 project' : `${count} projects`;
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
    const orderByColumn: Record<PortfolioBoardColumn['column'], readonly PortfolioActionItem['kind'][]> = {
      Overdue: ['report', 'plan', 'change', 'benefit', 'governance'],
      'This week': ['change', 'governance', 'report', 'plan', 'benefit'],
      Upcoming: ['report', 'change', 'benefit', 'plan', 'governance'],
    };
    const order = orderByColumn[column.column];
    return [...column.items].sort((first, second) => {
      const firstIndex = order.indexOf(first.kind);
      const secondIndex = order.indexOf(second.kind);
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

  // New implementation for calendar tasks
  generateCalendarItems(): PortfolioCalendarItem[] {
    const tasks = [
      { label: 'Status Reports', kind: 'report', tone: 'blue' },
      { label: 'Project Plans', kind: 'plan', tone: 'blue' },
      { label: 'Change Requests', kind: 'change', tone: 'red' },
      { label: 'Benefits', kind: 'benefit', tone: 'blue' },
      { label: 'Governance Register', kind: 'governance', tone: 'green' },
    ];

    const calendarItems: PortfolioCalendarItem[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate tasks for the current month
    for (let day = 1; day <= new Date(currentYear, currentMonth + 1, 0).getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const numTasks = Math.floor(Math.random() * 4); // 0 to 3 tasks per day

      for (let i = 0; i < numTasks; i++) {
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        calendarItems.push({
          id: `${randomTask.kind}-${date.toISOString()}-${i}`,
          date: date.toISOString().split('T')[0], // YYYY-MM-DD
          label: randomTask.label,
          tone: randomTask.tone,
          project: 'Various Projects',
          kind: randomTask.kind,
          targetType: 'portfolio',
        });
      }
    }

    return calendarItems;
  }

  calendarActionItems: PortfolioCalendarItem[] = this.generateCalendarItems();

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
    const target = this.selectedTargetOption;
    if (target.type === 'all') return true;
    if (target.type === 'project') return item.project === target.label;
    return item.project === target.label || Boolean(target.projectNames?.includes(item.project));
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
