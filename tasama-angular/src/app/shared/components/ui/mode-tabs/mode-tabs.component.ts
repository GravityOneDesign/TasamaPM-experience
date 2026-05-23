import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from '../icon/icon.component';

export interface PmConsoleModeTabItem {
  id: string;
  label: string;
  icon: string;
  widthPx?: number;
  ariaLabel?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-pm-console-mode-tabs',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pm-console-mode-tabs',
  },
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <div class="plan-builder-modebar project-modebar project-modebar-inline" role="tablist" [attr.aria-label]="ariaLabel">
      <div
        class="plan-builder-mode-toggle project-mode-toggle"
        [style.--project-entry-tab-left]="activeIndicatorLeft"
        [style.--project-entry-tab-width]="activeIndicatorWidth"
      >
        <span class="project-mode-tab-indicator" aria-hidden="true"></span>
        @for (tab of tabs; track tab.id) {
          <button
            [class.active]="tab.id === activeId"
            [style.width]="tabWidth(tab)"
            [attr.aria-label]="tab.ariaLabel || null"
            [attr.aria-selected]="tab.id === activeId"
            [disabled]="tab.disabled"
            type="button"
            role="tab"
            (click)="selectTab(tab)"
          >
            <span [pmConsoleIcon]="tab.icon" aria-hidden="true"></span>
            {{ tab.label }}
          </button>
        }
      </div>
    </div>
  `,
})
export class PmConsoleModeTabsComponent {
  private readonly defaultTabWidthPx = 120;

  @Input() tabs: readonly PmConsoleModeTabItem[] = [];
  @Input() activeId = '';
  @Input() ariaLabel = 'Tabs';

  @Output() readonly tabSelected = new EventEmitter<string>();

  get activeIndicatorLeft(): string {
    const activeIndex = this.activeTabIndex;
    const left = this.tabs.slice(0, activeIndex).reduce((total, tab) => total + this.tabWidthPx(tab), 0);
    return `${left}px`;
  }

  get activeIndicatorWidth(): string {
    const activeTab = this.tabs[this.activeTabIndex];
    return `${activeTab ? this.tabWidthPx(activeTab) : 0}px`;
  }

  tabWidth(tab: PmConsoleModeTabItem): string {
    return `${this.tabWidthPx(tab)}px`;
  }

  selectTab(tab: PmConsoleModeTabItem): void {
    if (tab.disabled || tab.id === this.activeId) return;
    this.tabSelected.emit(tab.id);
  }

  private get activeTabIndex(): number {
    const activeIndex = this.tabs.findIndex((tab) => tab.id === this.activeId);
    return Math.max(0, activeIndex);
  }

  private tabWidthPx(tab: PmConsoleModeTabItem): number {
    return tab.widthPx ?? this.defaultTabWidthPx;
  }
}
