import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleCalendarCell, PmConsoleCalendarFilter, PmConsoleCalendarItem } from './shared/pm-console-work-calendar.component';

/**
 * PM "My Calendar" component – displays a month view calendar with optional filter bar.
 * Simplified placeholder implementation to satisfy missing import and enable compilation.
 */
@Component({
  selector: 'app-pm-my-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pm-my-calendar">
      <div class="header">
        <button (click)="onPrevMonth()" aria-label="Previous month">‹</button>
        <span class="month-label">{{ monthLabel }}</span>
        <button (click)="onNextMonth()" aria-label="Next month">›</button>
      </div>
      <div *ngIf="showFilterBar && filters?.length" class="filter-bar">
        <select [value]="selectedFilterId" (change)="onFilterChange($event.target.value)">
          <option *ngFor="let f of filters" [value]="f.id">{{ f.label }}</option>
        </select>
      </div>
      <div class="grid">
        <ng-container *ngFor="let cell of cells">
          <div class="cell" (click)="onItemOpen(cell.item)" [class.has-item]="!!cell.item">
            <span class="date">{{ cell.date }}</span>
            <ng-container *ngIf="cell.item">
              <div class="item">{{ cell.item.title }}</div>
            </ng-container>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .pm-my-calendar { display: flex; flex-direction: column; gap: 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .filter-bar { padding: 8px 0; }
    .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
    .cell { border: 1px solid #e4e7ef; border-radius: 4px; padding: 8px; min-height: 60px; cursor: pointer; }
    .cell.has-item { background-color: #f7f7fc; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmMyCalendarComponent {
  @Input() monthLabel: string = '';
  @Input() monthItemCount: number = 0;
  @Input() cells: PmConsoleCalendarCell[] = [];
  @Input() filters: PmConsoleCalendarFilter[] = [];
  @Input() showFilterBar: boolean = false;
  @Input() selectedFilterId: string = '';

  @Output() monthShift = new EventEmitter<number>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() itemOpen = new EventEmitter<PmConsoleCalendarItem>();

  onPrevMonth() { this.monthShift.emit(-1); }
  onNextMonth() { this.monthShift.emit(1); }
  onFilterChange(id: string) { this.filterChange.emit(id); }
  onItemOpen(item: PmConsoleCalendarItem | undefined) { if (item) this.itemOpen.emit(item); }
