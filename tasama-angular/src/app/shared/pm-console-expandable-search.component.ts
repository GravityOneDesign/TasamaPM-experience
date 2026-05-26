import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

@Component({
  selector: 'app-pm-console-expandable-search',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        --pm-expandable-search-height: var(--action-control-height, var(--pm-toolbar-control-height, 40px));
        --pm-expandable-search-radius: var(--action-control-radius, 8px);
        --pm-expandable-search-expanded-width: var(--action-search-expanded-width, 320px);
        --pm-expandable-search-grow: var(--action-search-grow, 1);
        display: inline-flex;
        flex: 0 1 var(--pm-expandable-search-height);
        max-width: var(--pm-expandable-search-height);
        min-width: var(--pm-expandable-search-height);
        overflow: hidden;
        transition:
          flex-basis var(--motion-medium, 220ms) var(--motion-ease, ease),
          flex-grow var(--motion-medium, 220ms) var(--motion-ease, ease),
          max-width var(--motion-medium, 220ms) var(--motion-ease, ease),
          width var(--motion-medium, 220ms) var(--motion-ease, ease);
        width: var(--pm-expandable-search-height);
      }

      :host(:hover),
      :host(:focus-within) {
        flex-basis: var(--pm-expandable-search-expanded-width);
        flex-grow: var(--pm-expandable-search-grow);
        max-width: var(--pm-expandable-search-expanded-width);
        width: var(--pm-expandable-search-expanded-width);
      }

      .pm-expandable-search {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: var(--pm-expandable-search-radius);
        color: #727272;
        cursor: text;
        display: inline-flex;
        gap: 0;
        height: var(--pm-expandable-search-height);
        min-width: 0;
        overflow: hidden;
        padding: 0 10px;
        transition:
          background-color var(--motion-medium, 220ms) var(--motion-ease, ease),
          border-color var(--motion-medium, 220ms) var(--motion-ease, ease),
          box-shadow var(--motion-medium, 220ms) var(--motion-ease, ease),
          gap var(--motion-medium, 220ms) var(--motion-ease, ease),
          padding var(--motion-medium, 220ms) var(--motion-ease, ease);
        width: 100%;
      }

      :host(:hover) .pm-expandable-search,
      :host(:focus-within) .pm-expandable-search {
        border-color: #d6d8df;
        box-shadow: 0 1px 2px rgba(25, 33, 61, 0.05);
        gap: 8px;
        padding: 0 12px;
      }

      .pm-expandable-search .icon {
        flex: 0 0 18px;
        height: 18px;
        width: 18px;
      }

      .pm-expandable-search input {
        background: transparent;
        border: 0;
        color: #404040;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        min-width: 0;
        opacity: 0;
        outline: 0;
        pointer-events: none;
        transition:
          opacity var(--motion-medium, 220ms) var(--motion-ease, ease),
          width var(--motion-medium, 220ms) var(--motion-ease, ease);
        width: 0;
      }

      :host(:hover) .pm-expandable-search input,
      :host(:focus-within) .pm-expandable-search input {
        opacity: 1;
        pointer-events: auto;
        width: 100%;
      }

      .pm-expandable-search input::placeholder {
        color: #727272;
      }
    `,
  ],
  template: `
    <label class="pm-expandable-search" [attr.for]="inputId || null">
      <span pmConsoleIcon="search" aria-hidden="true"></span>
      <input
        [attr.id]="inputId || null"
        type="search"
        [attr.aria-label]="ariaLabel"
        [placeholder]="placeholder"
        [value]="value"
        (input)="emitSearch($event)"
      />
    </label>
  `,
})
export class PmConsoleExpandableSearchComponent {
  @Input() ariaLabel = 'Search';
  @Input() inputId = '';
  @Input() placeholder = 'Search';
  @Input() value = '';

  @Output() readonly searchChange = new EventEmitter<string>();

  emitSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement | null)?.value ?? '');
  }
}
