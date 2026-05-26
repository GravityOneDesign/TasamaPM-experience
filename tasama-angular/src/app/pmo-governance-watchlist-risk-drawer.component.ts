import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  pmoGovernanceWatchlistRiskPickerCategories,
  pmoGovernanceWatchlistRiskPickerRows,
  type PmoGovernanceWatchlistRiskPickerCategory,
  type PmoGovernanceWatchlistRiskPickerCategoryId,
  type PmoGovernanceWatchlistRiskPickerRow,
  type PmoGovernanceWatchlistSelection,
} from './pmo-governance-workspace.data';

@Component({
  selector: 'app-pmo-governance-watchlist-risk-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-plan-drawer
      title="Add Risks to Watchlist"
      eyebrow="My Workspace"
      description="Select risks to track in this forum watchlist."
      submitLabel="Add"
      cancelLabel="Cancel"
      closeAriaLabel="Close add risks to watchlist drawer"
      ariaLabel="Add risks to watchlist"
      panelWidth="min(920px, calc(100vw - 72px))"
      [submitFirst]="true"
      [submitDisabled]="selectedRiskCount === 0"
      (close)="close.emit()"
      (submitForm)="submitSelection($event)"
    >
      <div planDrawerBody class="pmo-watchlist-risk-drawer">
        <nav class="pmo-watchlist-risk-tabs" role="tablist" aria-label="Risk source categories">
          @for (category of categories; track category.id) {
            <button
              [class.active]="activeCategoryId === category.id"
              type="button"
              role="tab"
              [attr.aria-selected]="activeCategoryId === category.id"
              (click)="setActiveCategory(category.id)"
            >
              {{ category.label }}
            </button>
          }
        </nav>

        <p class="pmo-watchlist-risk-helper">Select the risk you want to add to your watchlist from the list below</p>

        <label class="pmo-watchlist-risk-search">
          <span pmConsoleIcon="search" aria-hidden="true"></span>
          <input type="search" placeholder="Search..." [value]="searchQuery" aria-label="Search risks" (input)="setSearchQuery($event)" />
        </label>

        <div class="pmo-watchlist-risk-summary" aria-live="polite">
          <span>{{ riskShowingLabel }}</span>
        </div>

        <div class="pmo-watchlist-risk-table-scroll" tabindex="0">
          <table class="pmo-watchlist-risk-table" aria-label="Risks available to add to watchlist">
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Risk</th>
              </tr>
            </thead>
            <tbody>
              @for (risk of visibleRiskRows; track risk.id) {
                <tr [class.is-selected]="isRiskSelected(risk.id)">
                  <td>
                    <input
                      type="checkbox"
                      [checked]="isRiskSelected(risk.id)"
                      [attr.aria-label]="'Select ' + risk.name"
                      (change)="toggleRisk(risk.id, $event)"
                    />
                  </td>
                  <td>
                    <span>{{ risk.name }}</span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="2">
                    <div class="pmo-watchlist-risk-empty">
                      <strong>No risks match your search</strong>
                      <span>Try a different term or switch risk categories.</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <span planDrawerFooterPrefix class="pmo-watchlist-selected-chip">
        {{ activeCategorySelectedCount }} {{ activeCategory.selectionLabel }}
      </span>
    </app-pm-console-plan-drawer>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-watchlist-risk-drawer {
        align-content: start;
        display: grid;
        gap: 14px;
        min-height: 0;
        min-width: 0;
      }

      .pmo-watchlist-risk-tabs {
        align-items: end;
        border-bottom: 1px solid #e4e7ef;
        display: flex;
        gap: 22px;
        min-width: 0;
        overflow-x: auto;
      }

      .pmo-watchlist-risk-tabs button {
        border-bottom: 2px solid transparent;
        color: #435064;
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        min-height: 36px;
        padding: 0 0 10px;
        white-space: nowrap;
      }

      .pmo-watchlist-risk-tabs button.active {
        border-color: var(--brand);
        color: var(--brand);
        font-weight: 600;
      }

      .pmo-watchlist-risk-tabs button:hover,
      .pmo-watchlist-risk-tabs button:focus-visible {
        color: var(--brand);
        outline: none;
      }

      .pmo-watchlist-risk-helper {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        margin: 0;
      }

      .pmo-watchlist-risk-search {
        align-items: center;
        background: #f3f5f9;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        color: #808895;
        display: flex;
        gap: 8px;
        min-height: 36px;
        padding: 0 12px;
      }

      .pmo-watchlist-risk-search .icon {
        flex: 0 0 auto;
        height: 17px;
        width: 17px;
      }

      .pmo-watchlist-risk-search input {
        background: transparent;
        border: 0;
        color: #2f2f2f;
        flex: 1 1 auto;
        font: inherit;
        font-size: 12px;
        font-style: italic;
        font-weight: 500;
        line-height: 16px;
        min-width: 0;
        outline: none;
      }

      .pmo-watchlist-risk-search:focus-within {
        border-color: rgba(16, 6, 159, 0.52);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.1);
      }

      .pmo-watchlist-risk-summary {
        align-items: center;
        color: #3f4858;
        display: flex;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        min-height: 18px;
      }

      .pmo-watchlist-risk-table-scroll {
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        max-height: min(48vh, 440px);
        min-height: 300px;
        min-width: 0;
        overflow: auto;
      }

      .pmo-watchlist-risk-table {
        border-collapse: separate;
        border-spacing: 0;
        min-width: 640px;
        width: 100%;
      }

      .pmo-watchlist-risk-table thead th {
        background: #f3f6fb;
        border-bottom: 1px solid #dfe4ee;
        color: #596273;
        font-size: 11px;
        font-weight: 600;
        height: 32px;
        line-height: 14px;
        padding: 0 10px;
        position: sticky;
        text-align: left;
        top: 0;
        z-index: 1;
      }

      .pmo-watchlist-risk-table thead th:first-child,
      .pmo-watchlist-risk-table tbody td:first-child {
        text-align: center;
        width: 42px;
      }

      .pmo-watchlist-risk-table tbody tr:nth-child(even) td {
        background: #f7f8fb;
      }

      .pmo-watchlist-risk-table tbody tr.is-selected td {
        background: #f4f5ff;
      }

      .pmo-watchlist-risk-table tbody tr:hover td {
        background: #f8f9ff;
      }

      .pmo-watchlist-risk-table td {
        border-bottom: 1px solid #eef1f6;
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
        height: 36px;
        line-height: 17px;
        padding: 0 10px;
        vertical-align: middle;
      }

      .pmo-watchlist-risk-table tbody tr:last-child td {
        border-bottom: 0;
      }

      .pmo-watchlist-risk-table input[type='checkbox'] {
        accent-color: var(--brand);
        height: 14px;
        margin: 0;
        width: 14px;
      }

      .pmo-watchlist-risk-empty {
        align-items: center;
        display: grid;
        gap: 4px;
        justify-items: center;
        min-height: 180px;
        text-align: center;
      }

      .pmo-watchlist-risk-empty strong {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
      }

      .pmo-watchlist-risk-empty span {
        color: #687182;
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
      }

      .pmo-watchlist-selected-chip {
        align-items: center;
        background: var(--brand);
        border-radius: 7px;
        color: #ffffff;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 600;
        min-height: 28px;
        padding: 0 11px;
        white-space: nowrap;
      }

      @media (max-width: 760px) {
        .pmo-watchlist-risk-tabs {
          gap: 18px;
        }

        .pmo-watchlist-risk-table-scroll {
          max-height: 46vh;
          min-height: 260px;
        }
      }
    `,
  ],
})
export class PmoGovernanceWatchlistRiskDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly add = new EventEmitter<PmoGovernanceWatchlistSelection>();

  readonly categories = pmoGovernanceWatchlistRiskPickerCategories;
  readonly riskRows = pmoGovernanceWatchlistRiskPickerRows;
  activeCategoryId: PmoGovernanceWatchlistRiskPickerCategoryId = 'organisational';
  searchQuery = '';
  selectedRiskIds = new Set(this.riskRows.filter((risk) => risk.selected).map((risk) => risk.id));

  get activeCategory(): PmoGovernanceWatchlistRiskPickerCategory {
    return this.categories.find((category) => category.id === this.activeCategoryId) ?? this.categories[0];
  }

  get activeCategoryRiskRows(): readonly PmoGovernanceWatchlistRiskPickerRow[] {
    return this.riskRows.filter((risk) => risk.categoryId === this.activeCategoryId);
  }

  get visibleRiskRows(): readonly PmoGovernanceWatchlistRiskPickerRow[] {
    const query = this.normalizedSearchQuery;
    if (!query) return this.activeCategoryRiskRows;
    return this.activeCategoryRiskRows.filter((risk) => this.normalizeSearchValue(risk.name).includes(query));
  }

  get selectedRiskCount(): number {
    return this.selectedRiskIds.size;
  }

  get activeCategorySelectedCount(): number {
    return this.activeCategoryRiskRows.filter((risk) => this.selectedRiskIds.has(risk.id)).length;
  }

  get riskShowingLabel(): string {
    const visibleCount = this.visibleRiskRows.length;
    const totalCount = this.activeCategoryRiskRows.length;
    if (this.searchQuery.trim()) return `Showing ${visibleCount} of ${totalCount} ${this.activeCategory.label.toLowerCase()}`;
    return `Showing all ${totalCount} ${this.activeCategory.label.toLowerCase()}`;
  }

  setActiveCategory(categoryId: PmoGovernanceWatchlistRiskPickerCategoryId): void {
    this.activeCategoryId = categoryId;
    this.searchQuery = '';
  }

  setSearchQuery(value: Event | string): void {
    this.searchQuery = typeof value === 'string' ? value : (value.target as HTMLInputElement | null)?.value ?? '';
  }

  isRiskSelected(riskId: string): boolean {
    return this.selectedRiskIds.has(riskId);
  }

  toggleRisk(riskId: string, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const nextSelection = new Set(this.selectedRiskIds);
    if (input?.checked) {
      nextSelection.add(riskId);
    } else {
      nextSelection.delete(riskId);
    }
    this.selectedRiskIds = nextSelection;
  }

  submitSelection(event: Event): void {
    event.preventDefault();
    const selectedRiskIds = [...this.selectedRiskIds];
    if (!selectedRiskIds.length) return;
    const selectedRiskSet = new Set(selectedRiskIds);
    this.add.emit({
      categoryId: this.activeCategoryId,
      selectedRiskIds,
      selectedRisks: this.riskRows.filter((risk) => selectedRiskSet.has(risk.id)),
    });
  }

  private get normalizedSearchQuery(): string {
    return this.normalizeSearchValue(this.searchQuery);
  }

  private normalizeSearchValue(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
}
