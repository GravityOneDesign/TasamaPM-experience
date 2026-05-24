import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleWorkCalendarComponent, PmConsoleCalendarCell, PmConsoleCalendarItem, PmConsoleCalendarFilter } from './shared/pm-console-work-calendar.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { iconName } from './pm-console-icon.utils';
import { portfolioActionItems, portfolioBoardFilters, PortfolioActionItem, PortfolioBoardFilter, PortfolioBoardColumn } from './portfolio-manager-actions.data';

@Component({
  selector: 'app-portfolio-manager-actions',
  standalone: true,
  imports: [CommonModule, PmConsoleWorkCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="actions-workspace">
      <!-- Toolbar row -->
      <div class="workspace-control-row actions-control-row">
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

        <!-- Search input -->
        <label class="workspace-search">
          <span class="icon" aria-hidden="true"><i data-lucide="search"></i></span>
          <input
            type="search"
            [placeholder]="'Search actions...'"
            aria-label="Search actions"
            (input)="onSearchChange($event)"
          />
        </label>

        <!-- Add Item Button -->
        <button class="add-action-item-button" type="button" (click)="handleAddActionItem()">
          <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>
          <span>Add Item</span>
        </button>

        <!-- Calendar / Board Toggle -->
        <div class="action-view-switch" role="tablist" aria-label="Actions view options">
          <button
            [class.active]="activeView === 'calendar'"
            type="button"
            role="tab"
            [attr.aria-selected]="activeView === 'calendar'"
            (click)="setView('calendar')"
          >
            <span class="icon" aria-hidden="true"><i data-lucide="calendar-days"></i></span>
            <span>Calendar</span>
          </button>
          <button
            [class.active]="activeView === 'board'"
            type="button"
            role="tab"
            [attr.aria-selected]="activeView === 'board'"
            (click)="setView('board')"
          >
            <span class="icon" aria-hidden="true"><i data-lucide="columns-3"></i></span>
            <span>Board</span>
          </button>
        </div>
      </div>

      <!-- Views container -->
      <div class="workspace-body" style="padding: 0; height: 100%;">
        <!-- Board view -->
        <div class="board-view" [class.is-hidden]="activeView !== 'board'" data-work-view="board">
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
                  <strong>{{ column.items.length }}</strong>
                </header>
                <div class="task-stack">
                  @for (item of column.items; track item.id) {
                    <article class="task-card {{ taskCardClass(item.type) }}" [attr.data-card-kind]="item.kind">
                      <div class="task-top">
                        <span>{{ item.type }}</span>
                      </div>
                      <h3>{{ item.label }}</h3>
                      <p>{{ item.project }}</p>
                      <div class="task-bottom">
                        <span class="avatar-sm">{{ item.owner }}</span>
                        <small>{{ item.meta }}</small>
                        <button class="task-action" type="button" (click)="handleTaskAction(item)">
                          <span>{{ item.cta }}</span>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-right"></i></span>
                        </button>
                      </div>
                    </article>
                  } @empty {
                    <div class="empty-column">No actions in this lane.</div>
                  }
                </div>
              </section>
            }
          </div>
        </div>

        <!-- Calendar view -->
        <div class="calendar-view" [class.is-hidden]="activeView !== 'calendar'" data-work-view="calendar">
          <app-pm-console-work-calendar
            [monthLabel]="calendarMonthLabel"
            [monthItemCount]="visibleMonthItems.length"
            [cells]="calendarCells"
            [filters]="calendarFilterOptions"
            [selectedFilterId]="selectedFilter"
            [showFilterBar]="false"
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
      min-height: 0;
      width: 100%;
    }
    .actions-workspace {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
    }
    .workspace-body {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
    }
  `],
})
export class PortfolioManagerActionsComponent implements AfterViewChecked, OnDestroy {
  activeView: 'calendar' | 'board' = 'calendar';
  calendarMonth = new Date(2026, 4, 1); // May 2026
  selectedFilter = 'all';
  searchQuery = '';
  
  readonly boardFilters = portfolioBoardFilters;
  readonly actionItems = portfolioActionItems;

  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly iconsService: PmConsoleIconService
  ) {}

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  ngOnDestroy(): void {}

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

  handleAddActionItem(): void {
    alert('Create Action flow coming soon');
  }

  handleTaskAction(item: PortfolioActionItem): void {
    alert(`Performing action "${item.cta}" on task "${item.label}"`);
  }

  handleCalendarItemOpen(item: PmConsoleCalendarItem): void {
    alert(`Opened calendar event: "${item.label}" for project "${item.project}"`);
  }

  // Getters
  get selectedFilterOption(): PortfolioBoardFilter {
    return this.boardFilters.find((f) => f.id === this.selectedFilter) || this.boardFilters[0];
  }

  get filteredItems(): PortfolioActionItem[] {
    return this.actionItems.filter((item) => {
      // Filter category
      if (this.selectedFilter !== 'all' && item.kind !== this.selectedFilter) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        const matchesLabel = item.label.toLowerCase().includes(this.searchQuery);
        const matchesProject = item.project.toLowerCase().includes(this.searchQuery);
        const matchesType = item.type.toLowerCase().includes(this.searchQuery);
        if (!matchesLabel && !matchesProject && !matchesType) {
          return false;
        }
      }
      return true;
    });
  }

  // Calendar getters and cells logic
  get calendarMonthLabel(): string {
    return this.calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get visibleMonthItems(): PmConsoleCalendarItem[] {
    return this.filteredItems
      .filter((item) => this.sameMonth(this.parseDate(item.date), this.calendarMonth))
      .map((item) => ({
        date: item.date,
        label: item.label,
        tone: item.tone,
        project: item.project,
        kind: item.kind
      }));
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
        today: key === '2026-05-12',
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
    if (filter.id === 'all') return items.length;
    return items.filter((item) => item.kind === filter.id).length;
  }

  countForActionFilter(filter: PortfolioBoardFilter): number {
    if (filter.id === 'all') return this.filteredItems.length;
    return this.filteredItems.filter((item) => item.kind === filter.id).length;
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
}
