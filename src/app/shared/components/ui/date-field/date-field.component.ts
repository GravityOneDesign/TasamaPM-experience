import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-pm-console-date-field',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: 100%;
      }

      .pm-date-field {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 8px;
        box-sizing: border-box;
        color: #2f2f2f;
        cursor: pointer;
        display: flex;
        font: inherit;
        gap: 8px;
        min-height: 36px;
        min-width: 0;
        overflow: hidden;
        padding: 0 10px;
        position: relative;
        width: 100%;
      }

      .pm-date-field:focus-within {
        border-color: rgba(16, 6, 159, 0.42);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
      }

      .pm-date-field.is-disabled {
        background: #f5f6fa;
        color: #8a93a4;
        cursor: not-allowed;
      }

      .pm-date-input {
        appearance: none;
        background: transparent !important;
        border: 0 !important;
        border-radius: 0 !important;
        cursor: inherit;
        height: 100% !important;
        inset: 0;
        margin: 0;
        opacity: 0;
        padding: 0 !important;
        position: absolute;
        width: 100% !important;
        z-index: 2;
      }

      .pm-date-input::-webkit-calendar-picker-indicator {
        cursor: pointer;
        height: 100%;
        width: 100%;
      }

      .pm-date-display {
        flex: 1 1 auto;
        font-size: inherit;
        line-height: 20px;
        min-width: 0;
        overflow: hidden;
        pointer-events: none;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-date-field.is-empty .pm-date-display {
        color: #777777;
      }

      .pm-date-field .icon {
        color: #404040;
        flex: 0 0 16px;
        height: 16px;
        pointer-events: none;
        width: 16px;
      }
    `,
  ],
  template: `
    <span class="pm-date-field" [class.is-empty]="!displayValue" [class.is-disabled]="disabled">
      <input
        class="pm-date-input"
        type="date"
        [value]="dateInputValue"
        [attr.aria-label]="ariaLabel"
        [disabled]="disabled"
        (change)="handleDateChange($any($event.target).value)"
      />
      <span class="pm-date-display">{{ displayValue || placeholder }}</span>
      <span pmConsoleIcon="calendar-days" aria-hidden="true"></span>
    </span>
  `,
})
export class PmConsoleDateFieldComponent {
  @Input() value: string | null | undefined = '';
  @Input() ariaLabel = 'Select date';
  @Input() placeholder = 'Select date';
  @Input() disabled = false;

  @Output() readonly valueChange = new EventEmitter<string>();

  get displayValue(): string {
    return this.formatDisplayDate(this.value || '');
  }

  get dateInputValue(): string {
    return this.toDateInputValue(this.value || '');
  }

  handleDateChange(value: string): void {
    this.valueChange.emit(this.formatDisplayDate(value));
  }

  private toDateInputValue(value: string): string {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    const dayMonthYear = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
    if (!dayMonthYear) return '';

    const [, day, month, year] = dayMonthYear;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private formatDisplayDate(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (isoDate) {
      const [, year, month, day] = isoDate;
      return `${day}/${month}/${year}`;
    }

    const dayMonthYear = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
    if (dayMonthYear) {
      const [, day, month, year] = dayMonthYear;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }

    return trimmed;
  }
}
