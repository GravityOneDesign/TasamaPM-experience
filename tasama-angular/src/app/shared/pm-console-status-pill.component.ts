import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'span[pmConsoleStatusPill]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ label }}`,
})
export class PmConsoleStatusPillComponent {
  @Input({ alias: 'pmConsoleStatusPill' }) label = '';
  @Input() baseClass = '';
  @Input() tone = '';

  @HostBinding('class')
  get hostClass(): string {
    return [this.baseClass, this.tone].filter(Boolean).join(' ');
  }
}
