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
    <aside class="side-rail" [class.is-expanded]="expanded" data-tour-target="side-navigation" aria-label="Main navigation">
      <div class="side-rail-section">
        <div class="side-rail-controls">
          <button
            class="side-rail-toggle"
            type="button"
            [attr.aria-label]="expanded ? 'Collapse main navigation' : 'Expand main navigation'"
            [attr.aria-pressed]="expanded"
            [attr.title]="expanded ? 'Collapse navigation' : 'Expand navigation'"
            (click)="toggleExpanded()"
          >
            <span [pmConsoleIcon]="expanded ? 'chevron-left' : 'chevron-right'" aria-hidden="true"></span>
          </button>
        </div>

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
              [attr.title]="item.disabled ? item.disabledTitle : expanded ? null : item.label"
              (click)="selectItem(item)"
            >
              <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
              <span class="rail-button-label">{{ item.label }}</span>
            </button>
          }
        </nav>
      </div>

      <div class="side-rail-section side-rail-utility-section">
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
              [attr.title]="item.disabled ? item.disabledTitle : expanded ? null : item.label"
              (click)="selectItem(item)"
            >
              <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
              <span class="rail-button-label">{{ item.label }}</span>
            </button>
          }
        </nav>
      </div>
    </aside>
  `,
})
export class PmConsoleSideNavComponent {
  @Input() primaryItems: readonly PmConsoleSideNavItem[] = [];
  @Input() utilityItems: readonly PmConsoleSideNavItem[] = [];
  @Input() activeItemId = '';
  @Input() expanded = false;

  @Output() readonly itemSelected = new EventEmitter<PmConsoleSideNavItem>();
  @Output() readonly expandedChange = new EventEmitter<boolean>();

  selectItem(item: PmConsoleSideNavItem): void {
    if (item.disabled) return;
    this.itemSelected.emit(item);
  }

  toggleExpanded(): void {
    this.expandedChange.emit(!this.expanded);
  }
}
