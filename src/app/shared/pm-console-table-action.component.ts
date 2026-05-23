import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

@Component({
  selector: 'button[pmConsoleTableAction]',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
  },
  template: `<span [pmConsoleIcon]="iconName" aria-hidden="true"></span>`,
})
export class PmConsoleTableActionComponent {
  @Input() iconName = 'pencil';
  @Input() actionClass = 'schedule-table-action';
  @Input() danger = false;

  @HostBinding('class')
  get hostClass(): string {
    return [this.actionClass, this.danger ? 'danger' : ''].filter(Boolean).join(' ');
  }
}
