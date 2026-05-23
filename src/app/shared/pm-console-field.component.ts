import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export type PmConsoleFieldType = 'text' | 'number' | 'date' | 'password' | 'search' | 'textarea' | 'select' | 'money';

@Component({
  selector: 'app-pm-console-field',
  standalone: true,
  imports: [NgClass, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <label class="matrix-field" [ngClass]="fieldClasses">
      <span class="matrix-field-label">
        {{ label }}
        @if (badge) {
          <small>{{ badge }}</small>
        }
        @if (mandatory) {
          <b>*</b>
        }
      </span>
      @if (description) {
        <small class="matrix-field-description">{{ description }}</small>
      }

      @if (type === 'select') {
        <span class="matrix-select-wrap">
          <select [value]="controlValue" [attr.aria-label]="ariaLabel || label" [disabled]="disabled" (change)="valueChange.emit($any($event.target).value)">
            @if (placeholder) {
              <option value="" [disabled]="placeholderDisabled" [selected]="!controlValue">{{ placeholder }}</option>
            }
            @for (option of options; track option) {
              <option [value]="option" [selected]="option === controlValue">{{ option }}</option>
            }
          </select>
          <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
        </span>
      } @else if (type === 'textarea') {
        <textarea
          [value]="controlValue"
          [attr.aria-label]="ariaLabel || label"
          [attr.placeholder]="placeholder || null"
          [attr.rows]="rows || null"
          [attr.maxlength]="maxLength || null"
          [disabled]="disabled"
          (input)="valueChange.emit($any($event.target).value)"
        ></textarea>
      } @else if (type === 'money') {
        <span class="matrix-money-wrap">
          <small>{{ currency }}</small>
          <input
            [type]="inputType || 'text'"
            [value]="controlValue"
            [attr.aria-label]="ariaLabel || label"
            [attr.placeholder]="placeholder || null"
            [attr.min]="min || null"
            [attr.step]="step || null"
            [disabled]="disabled"
            (input)="valueChange.emit($any($event.target).value)"
          />
        </span>
      } @else {
        <input
          [type]="type"
          [value]="controlValue"
          [attr.aria-label]="ariaLabel || label"
          [attr.placeholder]="placeholder || null"
          [attr.min]="min || null"
          [attr.step]="step || null"
          [disabled]="disabled"
          (input)="valueChange.emit($any($event.target).value)"
        />
      }
      @if (afterText) {
        <small [class]="afterClass">{{ afterText }}</small>
      }
    </label>
  `,
})
export class PmConsoleFieldComponent {
  @Input() label = '';
  @Input() value: string | number | null | undefined = '';
  @Input() type: PmConsoleFieldType = 'text';
  @Input() options: string[] = [];
  @Input() placeholder = '';
  @Input() placeholderDisabled = true;
  @Input() description = '';
  @Input() ariaLabel = '';
  @Input() badge = '';
  @Input() afterText = '';
  @Input() afterClass = '';
  @Input() currency = 'SAR';
  @Input() rows = 0;
  @Input() min = '';
  @Input() step = '';
  @Input() maxLength = 0;
  @Input() inputType = '';
  @Input() disabled = false;
  @Input() mandatory = false;
  @Input() wide = false;
  @Input() fieldClass = '';

  @Output() readonly valueChange = new EventEmitter<string>();

  get controlValue(): string {
    return this.value == null ? '' : String(this.value);
  }

  get fieldClasses(): string[] {
    const classes = [this.fieldClass];
    if (this.wide) classes.push('wide');
    if (this.type === 'select') classes.push('matrix-field-select');
    if (this.type === 'textarea') classes.push('matrix-field-textarea');
    if (this.type === 'money') classes.push('matrix-field-money');
    if (this.type === 'number') classes.push('matrix-field-number');
    return classes.filter(Boolean);
  }
}
