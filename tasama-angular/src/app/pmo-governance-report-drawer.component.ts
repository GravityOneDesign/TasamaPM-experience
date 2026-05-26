import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  createPmoGovernanceReportDraft,
  pmoGovernanceReportFormOptions,
  type PmoGovernanceReportDraft,
} from './pmo-governance-workspace.data';

type PmoReportSelectField = Exclude<keyof PmoGovernanceReportDraft, 'reportName'>;

@Component({
  selector: 'app-pmo-governance-report-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-plan-drawer
      title="New Report"
      eyebrow="My Workspace"
      description="Save a report template for governance records"
      submitLabel="Save Report Template"
      cancelLabel="Cancel"
      closeAriaLabel="Close create report drawer"
      ariaLabel="Create report template"
      panelWidth="min(760px, calc(100vw - 72px))"
      [submitDisabled]="!canSave"
      (close)="close.emit()"
      (submitForm)="submitReport($event)"
    >
      <div planDrawerBody class="pmo-report-drawer-form">
        <section class="pmo-report-form-section" aria-labelledby="pmo-report-template-heading">
          <div class="pmo-report-section-title">
            <span pmConsoleIcon="file-text" aria-hidden="true"></span>
            <h3 id="pmo-report-template-heading">Report Template</h3>
          </div>

          <label class="pmo-report-field">
            <span class="pmo-report-field-label">
              Report Name
              <span class="pmo-required" aria-hidden="true">*</span>
            </span>
            <input type="text" [value]="draft.reportName" placeholder="Enter report name here" autocomplete="off" (input)="updateReportName($event)" />
          </label>
        </section>

        <section class="pmo-report-form-section" aria-labelledby="pmo-report-filters-heading">
          <div class="pmo-report-section-title">
            <span pmConsoleIcon="filter" aria-hidden="true"></span>
            <h3 id="pmo-report-filters-heading">Filters</h3>
          </div>

          <div class="pmo-report-field-grid">
            <label class="pmo-report-field is-wide">
              <span class="pmo-report-field-label">Forum</span>
              <span class="pmo-report-select-wrap">
                <select [value]="draft.forum" (change)="updateSelect('forum', $event)" aria-label="Forum">
                  @for (option of options.forumOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <div class="pmo-report-subgroup is-wide">
              <span class="pmo-report-subgroup-label">Records</span>
              <div class="pmo-report-field-grid pmo-report-record-grid">
                <label class="pmo-report-field">
                  <span class="pmo-report-field-label">Type</span>
                  <span class="pmo-report-select-wrap">
                    <select [value]="draft.recordType" (change)="updateSelect('recordType', $event)" aria-label="Record type">
                      @for (option of options.recordTypeOptions; track option) {
                        <option [value]="option">{{ option }}</option>
                      }
                    </select>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                  </span>
                </label>

                <label class="pmo-report-field">
                  <span class="pmo-report-field-label">Progress</span>
                  <span class="pmo-report-select-wrap">
                    <select [value]="draft.progress" (change)="updateSelect('progress', $event)" aria-label="Progress">
                      @for (option of options.progressOptions; track option) {
                        <option [value]="option">{{ option }}</option>
                      }
                    </select>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                  </span>
                </label>

                <label class="pmo-report-field">
                  <span class="pmo-report-field-label">Record Status</span>
                  <span class="pmo-report-select-wrap">
                    <select [value]="draft.recordStatus" (change)="updateSelect('recordStatus', $event)" aria-label="Record status">
                      @for (option of options.recordStatusOptions; track option) {
                        <option [value]="option">{{ option }}</option>
                      }
                    </select>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                  </span>
                </label>

                <label class="pmo-report-field">
                  <span class="pmo-report-field-label">Due Date Status</span>
                  <span class="pmo-report-select-wrap">
                    <select [value]="draft.dueDateStatus" (change)="updateSelect('dueDateStatus', $event)" aria-label="Due date status">
                      @for (option of options.dueDateStatusOptions; track option) {
                        <option [value]="option">{{ option }}</option>
                      }
                    </select>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                  </span>
                </label>

                <label class="pmo-report-field">
                  <span class="pmo-report-field-label">Priority</span>
                  <span class="pmo-report-select-wrap">
                    <select [value]="draft.priority" (change)="updateSelect('priority', $event)" aria-label="Priority">
                      @for (option of options.priorityOptions; track option) {
                        <option [value]="option">{{ option }}</option>
                      }
                    </select>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                  </span>
                </label>
              </div>
            </div>

            <label class="pmo-report-field">
              <span class="pmo-report-field-label">Division</span>
              <span class="pmo-report-select-wrap">
                <select [value]="draft.division" (change)="updateSelect('division', $event)" aria-label="Division">
                  @for (option of options.divisionOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-report-field">
              <span class="pmo-report-field-label">People</span>
              <span class="pmo-report-select-wrap">
                <select [value]="draft.people" (change)="updateSelect('people', $event)" aria-label="People">
                  @for (option of options.peopleOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>
          </div>
        </section>

        <section class="pmo-report-form-section" aria-labelledby="pmo-report-timeframe-heading">
          <div class="pmo-report-section-title">
            <span pmConsoleIcon="calendar-days" aria-hidden="true"></span>
            <h3 id="pmo-report-timeframe-heading">Time Frame</h3>
          </div>

          <label class="pmo-report-field">
            <span class="sr-only">Time Frame</span>
            <span class="pmo-report-select-wrap">
              <select [value]="draft.timeFrame" (change)="updateSelect('timeFrame', $event)" aria-label="Time frame">
                @for (option of options.timeFrameOptions; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
              <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
            </span>
          </label>
        </section>

        <section class="pmo-report-form-section" aria-labelledby="pmo-report-group-heading">
          <div class="pmo-report-section-title">
            <span pmConsoleIcon="layers" aria-hidden="true"></span>
            <h3 id="pmo-report-group-heading">Group By</h3>
          </div>

          <label class="pmo-report-field">
            <span class="sr-only">Group By</span>
            <span class="pmo-report-select-wrap">
              <select [value]="draft.groupBy" (change)="updateSelect('groupBy', $event)" aria-label="Group by">
                @for (option of options.groupByOptions; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
              <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
            </span>
          </label>
        </section>
      </div>
    </app-pm-console-plan-drawer>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-report-drawer-form,
      .pmo-report-form-section,
      .pmo-report-field,
      .pmo-report-field-grid,
      .pmo-report-subgroup {
        display: grid;
        min-width: 0;
      }

      .pmo-report-drawer-form {
        gap: 16px;
      }

      .pmo-report-form-section {
        background: #ffffff;
        border: 1px solid #e5e9f1;
        border-radius: 8px;
        gap: 16px;
        padding: 16px;
      }

      .pmo-report-section-title {
        align-items: center;
        color: var(--brand);
        display: flex;
        gap: 8px;
        min-width: 0;
      }

      .pmo-report-section-title::after {
        background: rgba(16, 6, 159, 0.34);
        content: "";
        flex: 1 1 auto;
        height: 1px;
        min-width: 24px;
      }

      .pmo-report-section-title .icon {
        flex: 0 0 auto;
        height: 15px;
        width: 15px;
      }

      .pmo-report-section-title h3 {
        color: #10069f;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
        white-space: nowrap;
      }

      .pmo-report-field-grid {
        gap: 16px 18px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-report-field {
        gap: 7px;
      }

      .pmo-report-field.is-wide,
      .pmo-report-subgroup.is-wide {
        grid-column: 1 / -1;
      }

      .pmo-report-subgroup {
        gap: 10px;
      }

      .pmo-report-subgroup-label,
      .pmo-report-field-label {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        line-height: 15px;
        min-height: 15px;
      }

      .pmo-report-subgroup-label {
        color: #2f2f2f;
        font-size: 12px;
      }

      .pmo-required {
        color: #d33131;
      }

      .pmo-report-field input,
      .pmo-report-select-wrap {
        background: #ffffff;
        border: 1px solid #d9dee8;
        border-radius: 6px;
        color: #2f2f2f;
        font: inherit;
        font-size: 12px;
        line-height: 16px;
        min-height: 38px;
        min-width: 0;
        width: 100%;
      }

      .pmo-report-field input {
        padding: 0 11px;
      }

      .pmo-report-field input::placeholder {
        color: #8c94a3;
        font-style: italic;
      }

      .pmo-report-field input:focus,
      .pmo-report-select-wrap:focus-within {
        border-color: rgba(16, 6, 159, 0.52);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.11);
        outline: none;
      }

      .pmo-report-select-wrap {
        align-items: center;
        display: flex;
        gap: 6px;
        padding: 0 10px;
      }

      .pmo-report-select-wrap select {
        appearance: none;
        background: transparent;
        border: 0;
        color: #2f2f2f;
        flex: 1 1 auto;
        font: inherit;
        min-height: 36px;
        min-width: 0;
        outline: 0;
      }

      .pmo-report-select-wrap .icon {
        color: #8c94a3;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      .sr-only {
        clip: rect(0 0 0 0);
        border: 0;
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      @media (max-width: 760px) {
        .pmo-report-field-grid,
        .pmo-report-record-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class PmoGovernanceReportDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceReportDraft>();

  readonly options = pmoGovernanceReportFormOptions;

  draft = createPmoGovernanceReportDraft();

  get canSave(): boolean {
    return Boolean(this.draft.reportName.trim());
  }

  updateReportName(event: Event): void {
    this.draft = { ...this.draft, reportName: this.eventValue(event) };
  }

  updateSelect(field: PmoReportSelectField, event: Event): void {
    this.draft = { ...this.draft, [field]: this.eventValue(event) };
  }

  submitReport(event: Event): void {
    event.preventDefault();
    if (!this.canSave) return;
    this.save.emit({
      ...this.draft,
      reportName: this.draft.reportName.trim(),
    });
  }

  private eventValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLSelectElement | null;
    return target?.value ?? '';
  }
}
