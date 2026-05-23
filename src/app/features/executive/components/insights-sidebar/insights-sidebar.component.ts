import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { executiveInsightNavItems, executiveInsightUtilityNavItems } from '../../data/insights.data';

@Component({
  selector: 'app-executive-insights-sidebar',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="executive-insights-sidebar" aria-label="Executive console navigation">
      <nav class="nav-group" aria-label="Primary navigation">
        @for (item of navItems; track item.id) {
          <button
            class="nav-button"
            [class.is-active]="item.active"
            type="button"
            [attr.aria-label]="item.label"
            [attr.aria-current]="item.active ? 'page' : null"
            (click)="selectNavItem(item.id)"
          >
            <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
          </button>
        }
      </nav>

      <nav class="nav-group nav-group--utility" aria-label="Utility navigation">
        @for (item of utilityItems; track item.id) {
          <button class="nav-button" type="button" [attr.aria-label]="item.label">
            <span [pmConsoleIcon]="item.icon" aria-hidden="true"></span>
          </button>
        }
      </nav>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .executive-insights-sidebar {
        align-items: center;
        background: #ffffff;
        border-right: 1px solid #eceef3;
        box-shadow: 0 1px 1px rgba(1, 10, 15, 0.04), 4px 0 8px rgba(1, 10, 15, 0.05);
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        left: 0;
        padding: 16px 8px;
        position: absolute;
        top: 0;
        width: 64px;
        z-index: 3;
      }

      .nav-group {
        display: grid;
        gap: 16px;
      }

      .nav-button {
        align-items: center;
        border-radius: 12px;
        color: #647084;
        display: inline-flex;
        height: 48px;
        justify-content: center;
        transition:
          background var(--motion-fast, 160ms) var(--motion-ease, ease),
          color var(--motion-fast, 160ms) var(--motion-ease, ease);
        width: 48px;
      }

      .nav-button:hover {
        background: #f5f6fb;
        color: #10069f;
      }

      .nav-button:focus-visible {
        outline: 3px solid rgba(16, 6, 159, 0.24);
        outline-offset: 2px;
      }

      .nav-button.is-active {
        background: #10069f;
        color: #ffffff;
      }

      .nav-button span {
        height: 24px;
        width: 24px;
      }
    `,
  ],
})
export class ExecutiveInsightsSidebarComponent {
  @Output() readonly homeSelected = new EventEmitter<void>();

  readonly navItems = executiveInsightNavItems;
  readonly utilityItems = executiveInsightUtilityNavItems;

  selectNavItem(itemId: string): void {
    if (itemId === 'home') {
      this.homeSelected.emit();
    }
  }
}


