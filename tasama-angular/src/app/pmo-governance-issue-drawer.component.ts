import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  createPmoGovernanceIssueDraft,
  pmoGovernanceIssueFormOptions,
  type PmoGovernanceIssueDraft,
  type PmoGovernanceIssuePriority,
  type PmoGovernanceIssueStatus,
} from './pmo-governance-workspace.data';

type PmoIssueDateField = 'dateRaised' | 'issueDueDate' | 'dateClosed';

@Component({
  selector: 'app-pmo-governance-issue-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-plan-drawer
      title="Add Issue"
      eyebrow="Governance Forum"
      description="Issue setup details"
      submitLabel="Add"
      cancelLabel="Cancel"
      closeAriaLabel="Close add issue drawer"
      ariaLabel="Add issue"
      panelWidth="min(760px, calc(100vw - 72px))"
      [submitFirst]="true"
      [submitDisabled]="!canAdd"
      (close)="close.emit()"
      (submitForm)="submitIssue($event)"
    >
      <div planDrawerBody class="pmo-issue-drawer-form">
        <section class="pmo-issue-form-section" aria-labelledby="pmo-issue-details-heading">
          <h3 id="pmo-issue-details-heading">Issue Details</h3>

          <div class="pmo-issue-form-grid">
            <label class="pmo-issue-field is-full">
              <span class="pmo-issue-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Issue
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <textarea [value]="draft.issue" rows="3" (input)="updateIssue($event)"></textarea>
            </label>

            <label class="pmo-issue-field is-full">
              <span class="pmo-issue-field-label">
                Issue Description
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <textarea [value]="draft.issueDescription" rows="3" (input)="updateIssueDescription($event)"></textarea>
            </label>

            <label class="pmo-issue-field">
              <span class="pmo-issue-field-label">
                Issue Priority
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-issue-select-wrap">
                <select [value]="draft.issuePriority" (change)="updateIssuePriority($event)" aria-label="Issue priority">
                  <option value="" disabled>Select Priority</option>
                  @for (option of options.priorityOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-issue-field is-full">
              <span class="pmo-issue-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Resolution
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <textarea [value]="draft.resolution" rows="3" placeholder="Type description here" (input)="updateResolution($event)"></textarea>
            </label>

            <label class="pmo-issue-field">
              <span class="pmo-issue-field-label">
                Issue Status
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-issue-select-wrap">
                <select [value]="draft.issueStatus" (change)="updateIssueStatus($event)" aria-label="Issue status">
                  <option value="" disabled>Select Status</option>
                  @for (option of options.statusOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-issue-field">
              <span class="pmo-issue-field-label">
                Owner
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-issue-select-wrap">
                <select [value]="draft.owner" (change)="updateOwner($event)" aria-label="Owner">
                  <option value="" disabled>Select Owner</option>
                  @for (option of options.ownerOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-issue-field starts-row">
              <span class="pmo-issue-field-label">
                Date Raised
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-issue-date-wrap">
                <input type="date" [value]="draft.dateRaised" (input)="updateDate('dateRaised', $event)" aria-label="Date raised" />
                <span pmConsoleIcon="calendar-days" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-issue-field">
              <span class="pmo-issue-field-label">
                Issue Due Date
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-issue-date-wrap">
                <input type="date" [value]="draft.issueDueDate" (input)="updateDate('issueDueDate', $event)" aria-label="Issue due date" />
                <span pmConsoleIcon="calendar-days" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-issue-field">
              <span class="pmo-issue-field-label">
                Date Closed
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-issue-date-wrap">
                <input type="date" [value]="draft.dateClosed" (input)="updateDate('dateClosed', $event)" aria-label="Date closed" />
                <span pmConsoleIcon="calendar-days" aria-hidden="true"></span>
              </span>
            </label>
          </div>
        </section>
      </div>
    </app-pm-console-plan-drawer>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-issue-drawer-form,
      .pmo-issue-form-section,
      .pmo-issue-form-grid,
      .pmo-issue-field {
        display: grid;
        min-width: 0;
      }

      .pmo-issue-form-section {
        border: 1px solid #e5e9f1;
        border-radius: 8px;
        gap: 16px;
        padding: 16px;
      }

      .pmo-issue-form-section h3 {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-issue-form-grid {
        gap: 16px 18px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .pmo-issue-field {
        gap: 7px;
      }

      .pmo-issue-field.is-full {
        grid-column: 1 / -1;
      }

      .pmo-issue-field.starts-row {
        grid-column-start: 1;
      }

      .pmo-issue-field-label {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        line-height: 15px;
        min-height: 15px;
      }

      .pmo-issue-field-label .icon {
        color: #8c94a3;
        height: 12px;
        width: 12px;
      }

      .pmo-required {
        color: #d33131;
      }

      .pmo-issue-field textarea,
      .pmo-issue-select-wrap,
      .pmo-issue-date-wrap {
        background: #ffffff;
        border: 1px solid #d9dee8;
        border-radius: 6px;
        color: #2f2f2f;
        font: inherit;
        font-size: 12px;
        line-height: 16px;
        min-width: 0;
        width: 100%;
      }

      .pmo-issue-select-wrap,
      .pmo-issue-date-wrap {
        min-height: 38px;
      }

      .pmo-issue-field textarea {
        min-height: 72px;
        padding: 10px 11px;
        resize: vertical;
      }

      .pmo-issue-field textarea::placeholder {
        color: #9aa3b2;
        font-style: italic;
      }

      .pmo-issue-field textarea:focus,
      .pmo-issue-select-wrap:focus-within,
      .pmo-issue-date-wrap:focus-within {
        border-color: rgba(16, 6, 159, 0.52);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.11);
        outline: none;
      }

      .pmo-issue-select-wrap,
      .pmo-issue-date-wrap {
        align-items: center;
        display: flex;
        gap: 6px;
        padding: 0 10px;
      }

      .pmo-issue-select-wrap select,
      .pmo-issue-date-wrap input {
        background: transparent;
        border: 0;
        color: #2f2f2f;
        flex: 1 1 auto;
        font: inherit;
        min-height: 36px;
        min-width: 0;
        outline: 0;
        padding: 0;
      }

      .pmo-issue-select-wrap select {
        appearance: none;
      }

      .pmo-issue-date-wrap input::-webkit-calendar-picker-indicator {
        opacity: 0;
        width: 0;
      }

      .pmo-issue-select-wrap .icon,
      .pmo-issue-date-wrap .icon {
        color: #8c94a3;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      @media (max-width: 860px) {
        .pmo-issue-form-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .pmo-issue-form-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class PmoGovernanceIssueDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceIssueDraft>();

  readonly options = pmoGovernanceIssueFormOptions;
  draft = createPmoGovernanceIssueDraft();

  get canAdd(): boolean {
    return Boolean(this.draft.issue.trim() && this.draft.resolution.trim());
  }

  updateIssue(event: Event): void {
    this.draft = { ...this.draft, issue: this.eventValue(event) };
  }

  updateIssueDescription(event: Event): void {
    this.draft = { ...this.draft, issueDescription: this.eventValue(event) };
  }

  updateIssuePriority(event: Event): void {
    this.draft = { ...this.draft, issuePriority: this.eventValue(event) as PmoGovernanceIssuePriority | '' };
  }

  updateResolution(event: Event): void {
    this.draft = { ...this.draft, resolution: this.eventValue(event) };
  }

  updateIssueStatus(event: Event): void {
    this.draft = { ...this.draft, issueStatus: this.eventValue(event) as PmoGovernanceIssueStatus | '' };
  }

  updateOwner(event: Event): void {
    this.draft = { ...this.draft, owner: this.eventValue(event) };
  }

  updateDate(field: PmoIssueDateField, event: Event): void {
    this.draft = { ...this.draft, [field]: this.eventValue(event) };
  }

  submitIssue(event: Event): void {
    event.preventDefault();
    if (!this.canAdd) return;
    this.save.emit({
      ...this.draft,
      issue: this.draft.issue.trim(),
      issueDescription: this.draft.issueDescription.trim(),
      resolution: this.draft.resolution.trim(),
    });
  }

  private eventValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    return target?.value ?? '';
  }
}
