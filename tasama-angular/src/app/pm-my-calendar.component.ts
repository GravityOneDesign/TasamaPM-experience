import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Placeholder calendar component used to satisfy the missing import in pm-console-content.component.ts.
 * This component follows the project's component guidelines: standalone, OnPush change detection,
 * and minimal markup. It provides the inputs/outputs expected by the template.
 */
@Component({
  selector: 'app-pm-my-calendar',
  standalone: true,
  imports: [],
  template: `
    <div class="pm-my-calendar-placeholder" style="padding: var(--spacing-medium); text-align: center; color: var(--color-primary);">
      Calendar component placeholder
    </div>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmMyCalendarComponent {
  // Expected inputs (types are minimal placeholders)
  @Input() monthLabel: string = '';
  @Input() monthItemCount: number = 0;
  @Input() cells: any[] = [];
  @Input() filters: any[] = [];
  @Input() showFilterBar: boolean = false;
  @Input() selectedFilterId: string = '';

  // Expected outputs
  @Output() monthShift = new EventEmitter<number>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() itemOpen = new EventEmitter<any>();
}
