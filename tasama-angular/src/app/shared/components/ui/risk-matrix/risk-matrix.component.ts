import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PmConsoleRiskMatrixSelection {
  likelihood: string;
  consequence: string;
  rating: string;
}

@Component({
  selector: 'app-pm-console-risk-matrix',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="risk-matrix-card" [class.compact]="compact" [attr.aria-label]="title">
      <header class="risk-matrix-card-head">
        <div>
          <strong>{{ title }}</strong>
          @if (description) {
            <small>{{ description }}</small>
          }
        </div>
        <span class="risk-matrix-rating-pill" [class]="ratingTone(selectedRating)">{{ selectedRating || 'Not rated' }}</span>
      </header>

      <div class="risk-matrix-grid" role="grid" [attr.aria-label]="title">
        <span class="risk-matrix-axis y-axis" aria-hidden="true">Likelihood</span>
        <div class="risk-matrix-body">
          @for (row of likelihoodOptions; track row) {
            <div class="risk-matrix-row" role="row">
              <span class="risk-matrix-row-label">{{ row }}</span>
              @for (column of consequenceOptions; track column) {
                <button
                  class="risk-matrix-cell"
                  [class]="ratingTone(ratingFor(row, column))"
                  [class.is-selected]="isSelected(row, column)"
                  type="button"
                  role="gridcell"
                  [disabled]="readonly"
                  [attr.aria-pressed]="isSelected(row, column)"
                  [attr.aria-label]="row + ' likelihood and ' + column + ' consequence: ' + ratingFor(row, column)"
                  (click)="selectCell(row, column)"
                >
                  {{ ratingFor(row, column) }}
                </button>
              }
            </div>
          }
          <div class="risk-matrix-consequence-labels" aria-hidden="true">
            <span></span>
            @for (column of consequenceOptions; track column) {
              <span>{{ column }}</span>
            }
          </div>
        </div>
        <span class="risk-matrix-axis x-axis" aria-hidden="true">Consequence</span>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .risk-matrix-card {
        background: #ffffff;
        border: 1px solid #e1e8f2;
        border-radius: 14px;
        box-shadow: 0 10px 24px rgba(16, 24, 40, 0.05);
        display: grid;
        gap: 14px;
        min-width: 0;
        padding: 14px;
      }

      .risk-matrix-card-head {
        align-items: flex-start;
        display: flex;
        gap: 12px;
        justify-content: space-between;
      }

      .risk-matrix-card-head div {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .risk-matrix-card-head strong {
        color: #202633;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.25;
      }

      .risk-matrix-card-head small {
        color: #687182;
        font-size: 10.5px;
        font-weight: 500;
        line-height: 1.45;
      }

      .risk-matrix-rating-pill {
        align-items: center;
        border: 1px solid #dfe4ee;
        border-radius: 999px;
        color: #556072;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10px;
        font-weight: 700;
        height: 26px;
        justify-content: center;
        min-width: 78px;
        padding: 0 10px;
        text-transform: uppercase;
      }

      .risk-matrix-grid {
        display: grid;
        gap: 8px;
        grid-template-columns: auto minmax(0, 1fr);
        min-width: 0;
      }

      .risk-matrix-axis {
        color: #596273;
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.08em;
        line-height: 1;
        text-transform: uppercase;
      }

      .risk-matrix-axis.y-axis {
        align-self: center;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
      }

      .risk-matrix-axis.x-axis {
        grid-column: 2;
        justify-self: center;
      }

      .risk-matrix-body {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .risk-matrix-row,
      .risk-matrix-consequence-labels {
        display: grid;
        gap: 2px;
        grid-template-columns: 76px repeat(5, minmax(44px, 1fr));
      }

      .risk-matrix-row-label,
      .risk-matrix-consequence-labels span {
        align-items: center;
        color: #596273;
        display: flex;
        font-size: 9.5px;
        font-weight: 600;
        justify-content: flex-end;
        line-height: 1.25;
        min-height: 34px;
        text-align: right;
      }

      .risk-matrix-consequence-labels span {
        justify-content: center;
        min-height: 24px;
        text-align: center;
      }

      .risk-matrix-cell {
        align-items: center;
        border: 2px solid #ffffff;
        color: #ffffff;
        display: inline-flex;
        font-size: 9.5px;
        font-weight: 800;
        justify-content: center;
        min-height: 42px;
        outline: 1px solid rgba(255, 255, 255, 0);
        padding: 0 4px;
        text-transform: uppercase;
      }

      .risk-matrix-cell:not(:disabled):hover,
      .risk-matrix-cell:not(:disabled):focus-visible {
        box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.18);
        outline: 2px solid #10069f;
        outline-offset: 1px;
      }

      .risk-matrix-cell.is-selected {
        box-shadow:
          inset 0 0 0 2px #ffffff,
          0 0 0 2px #10069f;
        position: relative;
        z-index: 1;
      }

      .risk-matrix-cell:disabled {
        cursor: default;
      }

      .low { background: #3fa049; border-color: rgba(34, 160, 107, 0.22); color: #ffffff; }
      .medium { background: #ffc928; border-color: rgba(222, 165, 16, 0.24); color: #202633; }
      .high { background: #ff4e1d; border-color: rgba(224, 82, 82, 0.24); color: #ffffff; }
      .extreme { background: #fb171b; border-color: rgba(212, 28, 34, 0.28); color: #ffffff; }
      .neutral { background: #f4f7fb; color: #556072; }

      .compact { box-shadow: none; }

      .compact .risk-matrix-row,
      .compact .risk-matrix-consequence-labels {
        grid-template-columns: 68px repeat(5, minmax(38px, 1fr));
      }

      .compact .risk-matrix-cell { min-height: 36px; }

      @media (max-width: 760px) {
        .risk-matrix-grid { grid-template-columns: minmax(0, 1fr); }
        .risk-matrix-axis.y-axis { writing-mode: horizontal-tb; transform: none; }
        .risk-matrix-axis.x-axis { grid-column: 1; }
        .risk-matrix-row,
        .risk-matrix-consequence-labels,
        .compact .risk-matrix-row,
        .compact .risk-matrix-consequence-labels {
          grid-template-columns: 70px repeat(5, minmax(42px, 1fr));
          min-width: 420px;
        }
        .risk-matrix-body { overflow: auto; }
      }
    `,
  ],
})
export class PmConsoleRiskMatrixComponent {
  @Input() title = 'Risk rating';
  @Input() description = '';
  @Input() likelihood = '';
  @Input() consequence = '';
  @Input() readonly = false;
  @Input() compact = false;

  @Output() readonly selectionChange = new EventEmitter<PmConsoleRiskMatrixSelection>();

  readonly likelihoodOptions = ['Almost certain', 'Likely', 'Possible', 'Unlikely', 'Rare'];
  readonly consequenceOptions = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe'];

  get selectedRating(): string {
    return this.ratingFor(this.likelihood, this.consequence);
  }

  ratingFor(likelihood: string, consequence: string): string {
    const row = this.likelihoodOptions.indexOf(likelihood);
    const column = this.consequenceOptions.indexOf(consequence);
    if (row < 0 || column < 0) return '';
    const matrix = [
      ['Medium', 'High', 'High', 'High', 'Extreme'],
      ['Medium', 'Medium', 'High', 'High', 'Extreme'],
      ['Low', 'Medium', 'Medium', 'High', 'Extreme'],
      ['Low', 'Low', 'Medium', 'Medium', 'High'],
      ['Low', 'Low', 'Low', 'Medium', 'Medium'],
    ];
    return matrix[row]?.[column] || '';
  }

  ratingTone(rating: string): string {
    const normalized = rating.toLowerCase();
    if (normalized === 'low') return 'low';
    if (normalized === 'medium') return 'medium';
    if (normalized === 'high') return 'high';
    if (normalized === 'extreme') return 'extreme';
    return 'neutral';
  }

  isSelected(likelihood: string, consequence: string): boolean {
    return this.likelihood === likelihood && this.consequence === consequence;
  }

  selectCell(likelihood: string, consequence: string): void {
    if (this.readonly) return;
    this.selectionChange.emit({
      likelihood,
      consequence,
      rating: this.ratingFor(likelihood, consequence),
    });
  }
}
