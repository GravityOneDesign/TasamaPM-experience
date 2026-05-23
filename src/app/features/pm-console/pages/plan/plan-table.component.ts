import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { PmConsoleAiGuideChipComponent, pmConsoleAiGuideFor } from '../../../../shared/components/ui/ai-guide-chip/ai-guide-chip.component';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { PmConsoleStatusPillComponent } from '../../../../shared/components/ui/status-pill/status-pill.component';

@Component({
  selector: 'app-pm-console-plan-table',
  standalone: true,
  imports: [CommonModule, PmConsoleAiGuideChipComponent, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <article class="plan-data-table-card" [ngClass]="panelClass" [class.is-collapsible]="collapsible" [class.is-collapsed]="collapsible && !isOpen">
      <header class="plan-data-table-head">
        <div class="plan-data-table-title">
          <span class="plan-data-table-icon" aria-hidden="true">
            <span [pmConsoleIcon]="iconName"></span>
          </span>
          <span class="plan-data-table-copy">
            @if (eyebrow) {
              <small class="plan-data-table-eyebrow">{{ eyebrow }}</small>
            }
            <span class="plan-data-table-heading-line">
              <strong>{{ title }}</strong>
              @if (hasAiGuide) {
                <app-pm-console-ai-guide-chip
                  [title]="resolvedAiGuideTitle"
                  [what]="resolvedAiGuideWhat"
                  [how]="resolvedAiGuideHow"
                  [example]="resolvedAiGuideExample"
                ></app-pm-console-ai-guide-chip>
              }
            </span>
            <small>{{ description }}</small>
          </span>
        </div>
        <div class="plan-data-table-actions">
          @if (countLabel) {
            <span [pmConsoleStatusPill]="countLabel" baseClass="plan-data-table-count"></span>
          }
          @if (actionLabel) {
            <button class="plan-data-table-add" type="button" [attr.aria-label]="actionAriaLabel || actionLabel" [disabled]="actionDisabled" (click)="action.emit()">
              <span [pmConsoleIcon]="actionIconName" aria-hidden="true"></span>
              {{ actionLabel }}
            </button>
          }
          @if (collapsible) {
            <button class="plan-data-table-collapse-toggle" type="button" [attr.aria-label]="isOpen ? 'Collapse ' + title : 'Expand ' + title" [attr.aria-expanded]="isOpen" (click)="toggleOpen()">
              <span [pmConsoleIcon]="isOpen ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
            </button>
          }
        </div>
      </header>

      @if (!collapsible || isOpen) {
        <section class="plan-data-table-body">
          <ng-content></ng-content>
        </section>
      }
    </article>
  `,
  styles: [
    `
      app-pm-console-plan-table {
        display: block;
        min-width: 0;
        width: 100%;
      }

      .matrix-field-group-grid > app-pm-console-plan-table,
      .simple-plan-section-fields > app-pm-console-plan-table,
      .schedule-scope-form-section-milestones > app-pm-console-plan-table {
        grid-column: 1 / -1;
      }

      .plan-data-table-card {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.08);
        display: flex;
        flex-direction: column;
        overflow: visible;
        padding: 1px;
        width: 100%;
      }

      .plan-data-table-card.is-collapsible.is-collapsed .plan-data-table-head {
        border-bottom: 0;
      }

      .plan-data-table-head {
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        padding: 16px;
      }

      .plan-data-table-title {
        align-items: flex-start;
        display: flex;
        gap: 12px;
        min-width: 0;
      }

      .plan-data-table-icon {
        align-items: center;
        background: rgba(16, 6, 159, 0.03);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.1);
        color: #10069f;
        display: inline-flex;
        height: 40px;
        justify-content: center;
        width: 40px;
      }

      .plan-data-table-icon .icon {
        height: 24px;
        width: 24px;
      }

      .plan-data-table-copy {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .plan-data-table-heading-line {
        align-items: center;
        display: flex;
        gap: 8px;
        min-width: 0;
      }

      .plan-data-table-eyebrow {
        color: #10069f;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        line-height: 12px;
        text-transform: uppercase;
      }

      .plan-data-table-copy strong {
        color: #0b0b0b;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }

      .plan-data-table-copy small:not(.plan-data-table-eyebrow) {
        color: #777777;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }

      .plan-data-table-actions {
        align-items: center;
        display: flex;
        flex: 0 0 auto;
        gap: 10px;
        justify-content: flex-end;
      }

      .plan-data-table-collapse-toggle {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      .plan-data-table-collapse-toggle:hover,
      .plan-data-table-collapse-toggle:focus-visible {
        background: #f7f7ff;
        border-color: #c7d0f6;
        outline: none;
      }

      .plan-data-table-collapse-toggle .icon {
        height: 16px;
        width: 16px;
      }

      .plan-data-table-count {
        align-items: center;
        background: #f4f7fb;
        border-radius: 999px;
        color: #556072;
        display: inline-flex;
        font-size: 10.5px;
        font-weight: 600;
        height: 30px;
        justify-content: center;
        padding: 0 12px;
        white-space: nowrap;
      }

      .plan-data-table-add {
        align-items: center;
        background: #ffffff;
        border: 1px solid #10069f;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        gap: 4px;
        min-height: 36px;
        padding: 0 14px;
        font-size: 12px;
        font-weight: 600;
        justify-content: center;
        white-space: nowrap;
      }

      .plan-data-table-add .icon {
        height: 14px;
        width: 14px;
      }

      .plan-data-table-add:hover,
      .plan-data-table-add:focus-visible {
        background: #f7f7ff;
        outline: none;
      }

      .plan-data-table-add:disabled {
        border-color: #c9d0e1;
        color: #8b95a8;
        cursor: default;
      }

      .plan-data-table-body {
        display: grid;
        gap: 12px;
        padding: 12px;
      }

      .plan-data-table-body > .dependency-register-table-shell,
      .plan-data-table-body > .budget-table-wrap,
      .plan-data-table-body > .matrix-register-table {
        border: 1px solid #e5eef4;
        border-radius: 12px;
        margin: 0;
        overflow: auto;
        padding-top: 1px;
        width: 100%;
      }

      .plan-data-table-card table,
      .plan-data-table-card .dependency-register-table,
      .plan-data-table-card .budget-table {
        border-collapse: separate;
        border-spacing: 0;
        margin: 0;
        min-width: 720px;
        width: 100%;
      }

      .plan-data-table-card th,
      .plan-data-table-card .dependency-register-table th,
      .plan-data-table-card .budget-table th {
        background: #f7f7fc;
        border-bottom: 0;
        color: #687182;
        font-size: 10.5px;
        font-weight: 600;
        height: 37px;
        letter-spacing: 0.01em;
        line-height: 13px;
        padding: 12px 16px;
        text-align: left;
        white-space: nowrap;
      }

      .plan-data-table-card td,
      .plan-data-table-card .dependency-register-table td,
      .plan-data-table-card .budget-table td {
        border-bottom: 1px solid #e5eef4;
        color: #303645;
        font-size: 12px;
        font-weight: 400;
        line-height: 17.4px;
        padding: 12px 16px;
        vertical-align: middle;
      }

      .plan-data-table-card tbody tr:last-child td,
      .plan-data-table-card tbody tr:last-child th[scope='row'] {
        border-bottom: 0;
      }

      .plan-data-table-card .plan-table-clickable-row {
        cursor: pointer;
      }

      .plan-data-table-card .plan-table-clickable-row:hover td,
      .plan-data-table-card .plan-table-clickable-row:hover th[scope='row'] {
        background: #fbfcff;
      }

      .plan-data-table-card .plan-table-clickable-row:focus-visible {
        outline: 2px solid rgba(16, 6, 159, 0.45);
        outline-offset: -2px;
      }

      .plan-data-table-card th[scope='row'] {
        border-bottom: 1px solid #e5eef4;
        color: #202633;
        font-size: 12px;
        font-weight: 600;
        line-height: 16.2px;
        padding: 12px 16px;
        text-align: left;
      }

      .plan-data-table-card .dependency-register-primary,
      .plan-data-table-card .dependency-register-baseline {
        display: table-cell;
      }

      .plan-data-table-card .dependency-register-primary strong,
      .plan-data-table-card .dependency-register-baseline strong {
        color: #202633;
        display: block;
        font-size: 12px;
        font-weight: 600;
        line-height: 16.2px;
      }

      .plan-data-table-card .dependency-register-primary small,
      .plan-data-table-card .dependency-register-baseline small {
        color: #687182;
        display: block;
        font-size: 10.5px;
        font-weight: 500;
        line-height: 15.75px;
        margin-top: 4px;
      }

      .plan-data-table-card .dependency-register-pill,
      .plan-data-table-card .overview-status-pill,
      .plan-data-table-card .schedule-priority-pill,
      .plan-data-table-card .benefit-register-type-pill,
      .plan-data-table-card .benefit-register-category-pill,
      .plan-data-table-card .issue-register-type-pill,
      .plan-data-table-card .issue-register-criticality-pill,
      .plan-data-table-card .change-impact-level-pill {
        border-radius: 999px;
        font-size: 10px;
        font-weight: 600;
        line-height: 14.5px;
        padding: 4px 12px;
        white-space: nowrap;
      }

      .plan-data-table-card .schedule-table-actions {
        justify-content: flex-end;
        width: 1%;
        white-space: nowrap;
      }

      .plan-data-table-card .budget-money-input {
        min-width: 118px;
      }

      .plan-data-table-card .matrix-register-table {
        background: #ffffff;
        display: grid;
      }

      .plan-data-table-card .matrix-register-row {
        border-bottom: 1px solid #e5eef4;
        color: #303645;
        font-size: 12px;
        line-height: 17.4px;
        min-width: 720px;
      }

      .plan-data-table-card .matrix-register-row:last-child {
        border-bottom: 0;
      }

      .plan-data-table-card .matrix-register-row.head {
        background: #f7f7fc;
        color: #687182;
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.01em;
      }

      .plan-data-table-card .matrix-register-row > span {
        padding: 12px 16px;
      }

      @media (max-width: 760px) {
        .plan-data-table-head {
          align-items: flex-start;
          flex-direction: column;
        }

        .plan-data-table-actions {
          justify-content: space-between;
          width: 100%;
        }
      }
    `,
  ],
})
export class PmConsolePlanTableComponent implements OnChanges {
  @Input() title = '';
  @Input() eyebrow = '';
  @Input() description = '';
  @Input() countLabel = '';
  @Input() actionLabel = '';
  @Input() actionAriaLabel = '';
  @Input() actionDisabled = false;
  @Input() actionIconName = 'plus';
  @Input() iconName = 'list';
  @Input() panelClass = '';
  @Input() aiGuideTitle = '';
  @Input() aiGuideWhat = '';
  @Input() aiGuideHow = '';
  @Input() aiGuideExample = '';
  @Input() collapsible = false;
  @Input() expanded = true;

  @Output() action = new EventEmitter<void>();
  @Output() expandedChange = new EventEmitter<boolean>();

  isOpen = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collapsible'] || changes['expanded']) {
      this.isOpen = !this.collapsible || this.expanded;
    }
  }

  toggleOpen(): void {
    if (!this.collapsible) return;
    this.isOpen = !this.isOpen;
    this.expandedChange.emit(this.isOpen);
  }

  get hasAiGuide(): boolean {
    return Boolean(this.aiGuideWhat || this.aiGuideHow || this.aiGuideExample || pmConsoleAiGuideFor(this.title));
  }

  get resolvedAiGuideTitle(): string {
    return this.aiGuideTitle || pmConsoleAiGuideFor(this.title)?.title || this.title;
  }

  get resolvedAiGuideWhat(): string {
    return this.aiGuideWhat || pmConsoleAiGuideFor(this.title)?.what || '';
  }

  get resolvedAiGuideHow(): string {
    return this.aiGuideHow || pmConsoleAiGuideFor(this.title)?.how || '';
  }

  get resolvedAiGuideExample(): string {
    return this.aiGuideExample || pmConsoleAiGuideFor(this.title)?.example || '';
  }
}



