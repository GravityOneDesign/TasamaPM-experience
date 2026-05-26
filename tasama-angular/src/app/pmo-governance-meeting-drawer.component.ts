import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { createPmoGovernanceMeetingDraft, type PmoGovernanceMeetingDraft } from './pmo-governance-workspace.data';

@Component({
  selector: 'app-pmo-governance-meeting-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-plan-drawer
      title="Create Meeting"
      eyebrow="Governance Forum"
      description="Meeting setup details"
      submitLabel="Save"
      cancelLabel="Cancel"
      closeAriaLabel="Close create meeting drawer"
      ariaLabel="Create meeting"
      [submitDisabled]="!canSave"
      (close)="close.emit()"
      (submitForm)="submitMeeting($event)"
    >
      <div planDrawerBody class="pmo-meeting-drawer-form">
        <section class="pmo-meeting-form-section" aria-labelledby="pmo-meeting-details-heading">
          <h3 id="pmo-meeting-details-heading">Meeting Details</h3>

          <div class="pmo-meeting-form-grid">
            <label class="pmo-meeting-field is-full">
              <span class="pmo-meeting-field-label">
                Meeting Name
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <input type="text" [value]="draft.meetingName" autocomplete="off" (input)="updateMeetingName($event)" />
            </label>

            <label class="pmo-meeting-field">
              <span class="pmo-meeting-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Meeting Date
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-meeting-date-wrap">
                <input type="date" [value]="draft.meetingDate" (input)="updateMeetingDate($event)" aria-label="Meeting date" />
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

      .pmo-meeting-drawer-form,
      .pmo-meeting-form-section,
      .pmo-meeting-form-grid,
      .pmo-meeting-field {
        display: grid;
        min-width: 0;
      }

      .pmo-meeting-form-section {
        border: 1px solid #e5e9f1;
        border-radius: 8px;
        gap: 16px;
        padding: 16px;
      }

      .pmo-meeting-form-section h3 {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-meeting-form-grid {
        gap: 16px 18px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-meeting-field {
        gap: 7px;
      }

      .pmo-meeting-field.is-full {
        grid-column: 1 / -1;
      }

      .pmo-meeting-field-label {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        line-height: 15px;
      }

      .pmo-meeting-field-label .icon {
        color: #8c94a3;
        height: 12px;
        width: 12px;
      }

      .pmo-required {
        color: #d33131;
      }

      .pmo-meeting-field input,
      .pmo-meeting-date-wrap {
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

      .pmo-meeting-field input {
        padding: 0 11px;
      }

      .pmo-meeting-field input:focus,
      .pmo-meeting-date-wrap:focus-within {
        border-color: rgba(16, 6, 159, 0.52);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.11);
        outline: none;
      }

      .pmo-meeting-date-wrap {
        align-items: center;
        display: flex;
        gap: 6px;
        padding: 0 12px 0 10px;
      }

      .pmo-meeting-date-wrap input {
        border: 0;
        flex: 1 1 auto;
        min-height: 36px;
        min-width: 0;
        padding: 0;
      }

      .pmo-meeting-date-wrap input::-webkit-calendar-picker-indicator {
        opacity: 0;
        width: 0;
      }

      .pmo-meeting-date-wrap .icon {
        color: #8c94a3;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      @media (max-width: 760px) {
        .pmo-meeting-form-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class PmoGovernanceMeetingDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceMeetingDraft>();

  draft = createPmoGovernanceMeetingDraft();

  get canSave(): boolean {
    return Boolean(this.draft.meetingDate);
  }

  updateMeetingName(event: Event): void {
    this.draft = { ...this.draft, meetingName: this.eventValue(event) };
  }

  updateMeetingDate(event: Event): void {
    this.draft = { ...this.draft, meetingDate: this.eventValue(event) };
  }

  submitMeeting(event: Event): void {
    event.preventDefault();
    if (!this.canSave) return;
    this.save.emit({
      ...this.draft,
      meetingName: this.draft.meetingName.trim(),
    });
  }

  private eventValue(event: Event): string {
    const target = event.target as HTMLInputElement | null;
    return target?.value ?? '';
  }
}
