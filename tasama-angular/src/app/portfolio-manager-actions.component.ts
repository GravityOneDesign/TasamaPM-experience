import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleWorkCalendarComponent, PmConsoleCalendarCell, PmConsoleCalendarItem, PmConsoleCalendarFilter } from './shared/pm-console-work-calendar.component';
import { PmConsoleIconService } from './pm-console-icon.service';
import { iconName } from './pm-console-icon.utils';
import { portfolioActionItems, portfolioBoardFilters, PortfolioActionItem, PortfolioBoardFilter, PortfolioBoardColumn } from './portfolio-manager-actions.data';
import { PortfolioManagerActionDrawerService } from './portfolio-manager-action-drawer.service';
import { portfolioProgramRows, standaloneProjects, type ProgramRow } from './portfolio-workspace/portfolio-workspace.data';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

type PortfolioWorkTargetType = 'all' | 'program' | 'project';

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
        <h2 class="workspace-action-title">Portfolio Name</h2>

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

        <!-- Program / Project selector -->
        <div class="portfolio-target-picker" aria-label="Portfolio work target selector">
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
      color: var(--brand, #10069f);
      cursor: pointer;
      display: flex;
      font-size: 10px;
      font-weight: 700;
      gap: 8px;
      justify-content: space-between;
      letter-spacing: 0.04em;
      padding: 8px 8px 4px;
      text-transform: uppercase;
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
      font-size: 12px;
      font-weight: 600;
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
      font-weight: 500;
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
    }
  `],
})
export class PortfolioManagerActionsComponent implements AfterViewChecked, OnDestroy {
  activeView: 'calendar' | 'board' = 'calendar';
  calendarMonth = new Date(2026, 4, 1); // May 2026
  selectedFilter = 'all';
  selectedTargetId = 'all';
  searchQuery = '';
  targetSearchQuery = '';
  
  readonly boardFilters = portfolioBoardFilters;
  readonly actionItems = portfolioActionItems;
  readonly allTargetOption: PortfolioWorkTargetOption = {
    id: 'all',
    label: 'All programs and projects',
    type: 'all',
  };
  readonly programs = portfolioProgramRows;
  readonly standaloneProjects = standaloneProjects;
  readonly collapsedTargetGroupIds = new Set<PortfolioWorkTargetGroup['id']>();

  private iconsHydrated = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly actionDrawer: PortfolioManagerActionDrawerService,
    private readonly iconsService: PmConsoleIconService
  ) {}

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  ngOnDestroy(): void {
    this.actionDrawer.close();
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

  handleTaskAction(item: PortfolioActionItem): void {
    this.openActionDrawer(item);
  }

  handleCalendarItemOpen(item: PmConsoleCalendarItem): void {
    const action = this.actionItems.find((candidate) => candidate.id === item.id)
      || this.actionItems.find((candidate) =>
        candidate.date === item.date
        && candidate.label === item.label
        && candidate.project === item.project
        && candidate.kind === item.kind
      );
    if (!action) return;
    this.openActionDrawer(action);
  }

  openActionDrawer(item: PortfolioActionItem): void {
    this.actionDrawer.open(item);
    this.iconsHydrated = false;
    this.changeDetector.markForCheck();
  }

  // Getters
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
        id: item.id,
        date: item.date,
        label: item.label,
        tone: item.tone,
        project: item.project,
        targetType: item.targetType,
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
    const targetItems = this.actionItems.filter((item) => this.matchesSelectedTarget(item));
    const searchedItems = this.searchQuery
      ? targetItems.filter((item) => {
          const matchesLabel = item.label.toLowerCase().includes(this.searchQuery);
          const matchesProject = item.project.toLowerCase().includes(this.searchQuery);
          const matchesType = item.type.toLowerCase().includes(this.searchQuery);
          return matchesLabel || matchesProject || matchesType;
        })
      : targetItems;
    if (filter.id === 'all') return searchedItems.length;
    return searchedItems.filter((item) => item.kind === filter.id).length;
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
    const target = this.selectedTargetOption;
    if (target.type === 'all') return true;
    if (target.type === 'project') return item.project === target.label;
    return item.project === target.label || Boolean(target.projectNames?.includes(item.project));
  }
}
