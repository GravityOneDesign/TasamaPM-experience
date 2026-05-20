import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface PmConsoleSideNavItem {
  id: string;
  icon: string;
  label: string;
  disabled?: boolean;
  disabledTitle?: string | null;
}

@Component({
  selector: 'app-pm-console-side-nav',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <aside class="side-rail" data-tour-target="side-navigation" aria-label="Main navigation">
      <nav class="side-rail-group" aria-label="Primary navigation">
        @for (item of primaryItems; track item.id) {
          <button
            class="rail-button"
            [class.active]="activeItemId === item.id"
            type="button"
            [attr.aria-label]="item.label"
            [attr.aria-current]="activeItemId === item.id ? 'page' : null"
            [disabled]="item.disabled"
            [attr.aria-disabled]="item.disabled ? 'true' : null"
            [attr.title]="item.disabled ? item.disabledTitle : item.label"
            (click)="selectItem(item)"
          >
            <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
          </button>
        }
      </nav>

      <nav class="side-rail-group side-rail-utility" aria-label="Utility navigation">
        @for (item of utilityItems; track item.id) {
          <button
            class="rail-button"
            [class.active]="activeItemId === item.id"
            type="button"
            [attr.aria-label]="item.label"
            [attr.aria-current]="activeItemId === item.id ? 'page' : null"
            [disabled]="item.disabled"
            [attr.aria-disabled]="item.disabled ? 'true' : null"
            [attr.title]="item.disabled ? item.disabledTitle : item.label"
            (click)="selectItem(item)"
          >
            <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
          </button>
        }
      </nav>
    </aside>
  `,
})
export class PmConsoleSideNavComponent {
  @Input() primaryItems: readonly PmConsoleSideNavItem[] = [];
  @Input() utilityItems: readonly PmConsoleSideNavItem[] = [];
  @Input() activeItemId = '';

  @Output() readonly itemSelected = new EventEmitter<PmConsoleSideNavItem>();

  selectItem(item: PmConsoleSideNavItem): void {
    if (item.disabled) return;
    this.itemSelected.emit(item);
  }
}
