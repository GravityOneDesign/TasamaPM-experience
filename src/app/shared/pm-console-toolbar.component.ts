import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-pm-console-toolbar',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <div class="pm-project-table-toolbar" [ngClass]="toolbarClass">
      <span [hidden]="!itemLabel">{{ itemLabel }}</span>
      <ng-content select="[toolbarLabel]"></ng-content>
      <div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PmConsoleToolbarComponent {
  @Input() itemLabel = '';
  @Input() toolbarClass: string | string[] | Set<string> | Record<string, unknown> = '';
}
