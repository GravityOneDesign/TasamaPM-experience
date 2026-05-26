import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  createPmoGovernanceRecordDraft,
  pmoGovernanceRecordFormOptions,
  type PmoGovernanceRecordDraft,
  type PmoGovernanceRecordType,
} from './pmo-governance-workspace.data';

type PmoRecordSelectField = 'forumName' | 'meeting' | 'owner';

@Component({
  selector: 'app-pmo-governance-record-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-plan-drawer
      title="Add Record"
      eyebrow="My Workspace"
      description="Record setup details"
      submitLabel="Save"
      cancelLabel="Cancel"
      closeAriaLabel="Close add record drawer"
      ariaLabel="Add record"
      [submitDisabled]="!canSave"
      (close)="close.emit()"
      (submitForm)="submitRecord($event)"
    >
      <div planDrawerBody class="pmo-record-drawer-form">
        <section class="pmo-record-form-section" aria-labelledby="pmo-record-details-heading">
          <h3 id="pmo-record-details-heading">Record Details</h3>

          <div class="pmo-record-form-grid">
            <label class="pmo-record-field">
              <span class="pmo-record-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Forum Name
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-record-select-wrap">
                <select [value]="draft.forumName" (change)="updateSelect('forumName', $event)" aria-label="Forum name">
                  @for (option of options.forumOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-record-field">
              <span class="pmo-record-field-label">
                Meeting
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-record-select-wrap">
                <select [value]="draft.meeting" (change)="updateSelect('meeting', $event)" aria-label="Meeting">
                  <option value="">Select</option>
                  @for (option of options.meetingOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-record-field is-full">
              <span class="pmo-record-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Record Title
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <input type="text" [value]="draft.recordTitle" autocomplete="off" (input)="updateRecordTitle($event)" />
            </label>

            <fieldset class="pmo-record-field is-full pmo-record-radio-field">
              <legend class="pmo-record-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Record Type
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </legend>
              <div class="pmo-record-type-options" role="radiogroup" aria-label="Record type">
                @for (option of options.typeOptions; track option) {
                  <label class="pmo-record-type-option" [class.active]="draft.recordType === option">
                    <input type="radio" name="pmo-record-type" [value]="option" [checked]="draft.recordType === option" (change)="updateRecordType(option)" />
                    <span aria-hidden="true"></span>
                    {{ option }}
                  </label>
                }
              </div>
            </fieldset>

            <label class="pmo-record-field">
              <span class="pmo-record-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Owner
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-record-select-wrap">
                <select [value]="draft.owner" (change)="updateSelect('owner', $event)" aria-label="Owner">
                  <option value="">Select</option>
                  @for (option of options.ownerOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-record-field">
              <span class="pmo-record-field-label">
                Agreed Due
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-record-date-wrap">
                <input type="date" [value]="draft.agreedDue" (input)="updateAgreedDue($event)" aria-label="Agreed due" />
                <span pmConsoleIcon="calendar-days" aria-hidden="true"></span>
              </span>
            </label>
          </div>

          <button class="pmo-record-more-button" type="button" [attr.aria-expanded]="detailsExpanded" (click)="toggleDetails()">
            <span>Add more details</span>
            <span pmConsoleIcon="circle-chevron-right" aria-hidden="true"></span>
          </button>

          @if (detailsExpanded) {
            <label class="pmo-record-field pmo-record-textarea-field">
              <span class="pmo-record-field-label">Details</span>
              <textarea [value]="draft.details" rows="4" (input)="updateDetails($event)"></textarea>
            </label>
          }
        </section>
      </div>
    </app-pm-console-plan-drawer>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-record-drawer-form,
      .pmo-record-form-section,
      .pmo-record-form-grid,
      .pmo-record-field {
        display: grid;
        min-width: 0;
      }

      .pmo-record-form-section {
        border: 1px solid #e5e9f1;
        border-radius: 8px;
        gap: 16px;
        padding: 16px;
      }

      .pmo-record-form-section h3 {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-record-form-grid {
        gap: 16px 18px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-record-field {
        border: 0;
        gap: 7px;
        margin: 0;
        padding: 0;
      }

      .pmo-record-field.is-full,
      .pmo-record-textarea-field {
        grid-column: 1 / -1;
      }

      .pmo-record-field-label {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        line-height: 15px;
        min-height: 15px;
      }

      .pmo-record-field-label .icon {
        color: #8c94a3;
        height: 12px;
        width: 12px;
      }

      .pmo-required {
        color: #d33131;
      }

      .pmo-record-field input,
      .pmo-record-field textarea,
      .pmo-record-select-wrap,
      .pmo-record-date-wrap {
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

      .pmo-record-field input,
      .pmo-record-select-wrap,
      .pmo-record-date-wrap {
        min-height: 38px;
      }

      .pmo-record-field input {
        padding: 0 11px;
      }

      .pmo-record-field textarea {
        min-height: 92px;
        padding: 10px 11px;
        resize: vertical;
      }

      .pmo-record-field input:focus,
      .pmo-record-field textarea:focus,
      .pmo-record-select-wrap:focus-within,
      .pmo-record-date-wrap:focus-within {
        border-color: rgba(16, 6, 159, 0.52);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.11);
        outline: none;
      }

      .pmo-record-select-wrap,
      .pmo-record-date-wrap {
        align-items: center;
        display: flex;
        gap: 6px;
        padding: 0 10px;
      }

      .pmo-record-select-wrap select {
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

      .pmo-record-select-wrap .icon,
      .pmo-record-date-wrap .icon {
        color: #8c94a3;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      .pmo-record-date-wrap {
        padding-right: 12px;
      }

      .pmo-record-date-wrap input {
        border: 0;
        flex: 1 1 auto;
        min-height: 36px;
        padding: 0;
      }

      .pmo-record-date-wrap input::-webkit-calendar-picker-indicator {
        opacity: 0;
        width: 0;
      }

      .pmo-record-type-options {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
      }

      .pmo-record-type-option {
        align-items: center;
        background: #ffffff;
        border: 1px solid #cfd8ea;
        border-radius: 7px;
        color: #526388;
        cursor: pointer;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 7px;
        height: 34px;
        padding: 0 13px 0 10px;
        transition:
          background-color var(--motion-fast) var(--motion-ease),
          border-color var(--motion-fast) var(--motion-ease),
          color var(--motion-fast) var(--motion-ease);
      }

      .pmo-record-type-option input {
        height: 1px;
        margin: 0;
        opacity: 0;
        position: absolute;
        width: 1px;
      }

      .pmo-record-type-option > span {
        border: 1px solid #aeb7c9;
        border-radius: 999px;
        height: 12px;
        pointer-events: none;
        position: relative;
        width: 12px;
      }

      .pmo-record-type-option.active {
        background: rgba(16, 6, 159, 0.08);
        border-color: rgba(16, 6, 159, 0.42);
        color: var(--brand);
      }

      .pmo-record-type-option.active > span {
        border-color: var(--brand);
      }

      .pmo-record-type-option.active > span::after {
        background: var(--brand);
        border-radius: inherit;
        content: "";
        height: 6px;
        inset: 2px;
        position: absolute;
        width: 6px;
      }

      .pmo-record-type-option:has(input:focus-visible) {
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.12);
      }

      .pmo-record-more-button {
        align-items: center;
        color: var(--brand);
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 5px;
        justify-self: start;
        line-height: 16px;
      }

      .pmo-record-more-button .icon {
        height: 14px;
        width: 14px;
      }

      @media (max-width: 760px) {
        .pmo-record-form-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class PmoGovernanceRecordDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceRecordDraft>();

  readonly options = pmoGovernanceRecordFormOptions;

  detailsExpanded = false;
  draft = createPmoGovernanceRecordDraft();

  get canSave(): boolean {
    return Boolean(this.draft.forumName && this.draft.recordTitle.trim() && this.draft.recordType && this.draft.owner);
  }

  updateSelect(field: PmoRecordSelectField, event: Event): void {
    this.draft = { ...this.draft, [field]: this.eventValue(event) };
  }

  updateRecordTitle(event: Event): void {
    this.draft = { ...this.draft, recordTitle: this.eventValue(event) };
  }

  updateRecordType(recordType: PmoGovernanceRecordType): void {
    this.draft = { ...this.draft, recordType };
  }

  updateAgreedDue(event: Event): void {
    this.draft = { ...this.draft, agreedDue: this.eventValue(event) };
  }

  updateDetails(event: Event): void {
    this.draft = { ...this.draft, details: this.eventValue(event) };
  }

  toggleDetails(): void {
    this.detailsExpanded = !this.detailsExpanded;
  }

  submitRecord(event: Event): void {
    event.preventDefault();
    if (!this.canSave) return;
    this.save.emit({
      ...this.draft,
      recordTitle: this.draft.recordTitle.trim(),
      details: this.draft.details.trim(),
    });
  }

  private eventValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    return target?.value ?? '';
  }
}
