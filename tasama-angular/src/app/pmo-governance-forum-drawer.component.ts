import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  createPmoGovernanceForumDraft,
  pmoGovernanceForumFormOptions,
  type PmoGovernanceForumDraft,
  type PmoGovernanceForumType,
} from './pmo-governance-workspace.data';

type PmoForumPeopleField = 'secretariat' | 'members';

@Component({
  selector: 'app-pmo-governance-forum-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-plan-drawer
      title="Add New Forum"
      eyebrow="My Workspace"
      description="Forum setup details"
      submitLabel="Save"
      cancelLabel="Cancel"
      closeAriaLabel="Close add forum drawer"
      ariaLabel="Add new forum"
      (close)="close.emit()"
      (submitForm)="submitForum($event)"
    >
      <div planDrawerBody class="pmo-forum-drawer-form">
        <section class="pmo-forum-form-section" aria-labelledby="pmo-forum-overview-heading">
          <h3 id="pmo-forum-overview-heading">Forum Information</h3>

          <div class="pmo-forum-form-grid">
            <label class="pmo-forum-field is-wide">
              <span class="pmo-forum-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Forum Name
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <input type="text" [value]="draft.forumName" autocomplete="off" (input)="updateForumName($event)" />
            </label>

            <label class="pmo-forum-field">
              <span class="pmo-forum-field-label">
                Type
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-forum-select-wrap">
                <select [value]="draft.type" (change)="updateType($event)" aria-label="Forum type">
                  @for (option of options.typeOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-forum-field">
              <span class="pmo-forum-field-label">
                Category
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-forum-select-wrap">
                <select [value]="draft.category" (change)="updateCategory($event)" aria-label="Forum category">
                  <option value="" disabled>Choose Category</option>
                  @for (option of options.categoryOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-forum-field is-full pmo-forum-textarea-field">
              <span class="pmo-forum-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Forum Description
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <textarea [value]="draft.description" rows="5" (input)="updateDescription($event)"></textarea>
            </label>
          </div>
        </section>

        <section class="pmo-forum-form-section" aria-labelledby="pmo-forum-ownership-heading">
          <h3 id="pmo-forum-ownership-heading">Forum Ownership</h3>

          <div class="pmo-forum-form-grid">
            <label class="pmo-forum-field">
              <span class="pmo-forum-field-label">
                Forum Chair
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-forum-select-wrap">
                <select [value]="draft.chair" (change)="updateChair($event)" aria-label="Forum chair">
                  <option value="">Select Forum Chair</option>
                  @for (option of options.chairOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-forum-field">
              <span class="pmo-forum-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Forum Secretariat
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-forum-chip-select">
                @for (person of draft.secretariat; track person) {
                  <span class="pmo-forum-chip">
                    {{ person }}
                    <button type="button" [attr.aria-label]="'Remove ' + person + ' from forum secretariat'" (click)="removePerson('secretariat', person)">
                      <span pmConsoleIcon="x" aria-hidden="true"></span>
                    </button>
                  </span>
                }
                <select [value]="''" (change)="addPerson('secretariat', $event)" aria-label="Add forum secretariat">
                  <option value="">Add Secretariat</option>
                  @for (option of availableSecretariatOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-forum-field is-wide">
              <span class="pmo-forum-field-label">
                Forum Members
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-forum-chip-select is-placeholder" [class.has-value]="draft.members.length > 0">
                @for (person of draft.members; track person) {
                  <span class="pmo-forum-chip">
                    {{ person }}
                    <button type="button" [attr.aria-label]="'Remove ' + person + ' from forum members'" (click)="removePerson('members', person)">
                      <span pmConsoleIcon="x" aria-hidden="true"></span>
                    </button>
                  </span>
                }
                <select [value]="''" (change)="addPerson('members', $event)" aria-label="Add forum member">
                  <option value="">Select Forum Members</option>
                  @for (option of availableMemberOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-forum-workflow">
              <span class="pmo-forum-field-label">
                Enable Workflow?
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <input type="checkbox" role="switch" [checked]="draft.workflowEnabled" (change)="toggleWorkflow($event)" />
              <span class="pmo-forum-switch-track" aria-hidden="true"><span></span></span>
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

      .pmo-forum-drawer-form,
      .pmo-forum-form-section,
      .pmo-forum-form-grid,
      .pmo-forum-field {
        display: grid;
        min-width: 0;
      }

      .pmo-forum-drawer-form {
        gap: 18px;
      }

      .pmo-forum-form-section {
        border: 1px solid #e5e9f1;
        border-radius: 8px;
        gap: 16px;
        padding: 16px;
      }

      .pmo-forum-form-section h3 {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-forum-form-grid {
        gap: 16px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-forum-field {
        gap: 7px;
      }

      .pmo-forum-field.is-wide,
      .pmo-forum-field.is-full {
        grid-column: 1 / -1;
      }

      .pmo-forum-field-label {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        line-height: 15px;
      }

      .pmo-forum-field-label .icon {
        color: #8c94a3;
        height: 12px;
        width: 12px;
      }

      .pmo-required {
        color: #d33131;
      }

      .pmo-forum-field input,
      .pmo-forum-field textarea,
      .pmo-forum-select-wrap,
      .pmo-forum-chip-select {
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

      .pmo-forum-field input,
      .pmo-forum-select-wrap,
      .pmo-forum-chip-select {
        min-height: 38px;
      }

      .pmo-forum-field input {
        padding: 0 11px;
      }

      .pmo-forum-field textarea {
        min-height: 108px;
        padding: 10px 11px;
        resize: vertical;
      }

      .pmo-forum-field input:focus,
      .pmo-forum-field textarea:focus,
      .pmo-forum-select-wrap:focus-within,
      .pmo-forum-chip-select:focus-within {
        border-color: rgba(16, 6, 159, 0.52);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.11);
        outline: none;
      }

      .pmo-forum-select-wrap,
      .pmo-forum-chip-select {
        align-items: center;
        display: flex;
        gap: 6px;
        padding: 0 10px;
      }

      .pmo-forum-select-wrap select,
      .pmo-forum-chip-select select {
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

      .pmo-forum-select-wrap .icon,
      .pmo-forum-chip-select > .icon {
        color: #8c94a3;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      .pmo-forum-chip-select {
        flex-wrap: wrap;
        min-height: 38px;
        padding-bottom: 3px;
        padding-top: 3px;
      }

      .pmo-forum-chip-select.is-placeholder:not(.has-value) select {
        color: #8c94a3;
        font-style: italic;
      }

      .pmo-forum-chip {
        align-items: center;
        background: #f4f6fb;
        border: 1px solid #e4e7ef;
        border-radius: 4px;
        color: #2f2f2f;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 6px;
        line-height: 16px;
        min-height: 26px;
        padding: 0 7px;
      }

      .pmo-forum-chip button {
        align-items: center;
        border-radius: 999px;
        color: #697386;
        display: inline-flex;
        height: 18px;
        justify-content: center;
        width: 18px;
      }

      .pmo-forum-chip button:hover,
      .pmo-forum-chip button:focus-visible {
        background: #e9edf5;
        color: var(--brand);
        outline: none;
      }

      .pmo-forum-chip button .icon {
        height: 12px;
        width: 12px;
      }

      .pmo-forum-workflow {
        align-items: center;
        display: inline-flex;
        gap: 10px;
        grid-column: 1 / -1;
        justify-self: start;
        min-height: 38px;
        position: relative;
      }

      .pmo-forum-workflow input {
        height: 30px;
        margin: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        width: 50px;
      }

      .pmo-forum-switch-track {
        align-items: center;
        background: #cfd3dc;
        border: 1px solid #cfd3dc;
        border-radius: 999px;
        display: inline-flex;
        height: 24px;
        padding: 2px;
        transition:
          background-color var(--motion-fast) var(--motion-ease),
          border-color var(--motion-fast) var(--motion-ease);
        width: 48px;
      }

      .pmo-forum-switch-track span {
        background: #ffffff;
        border-radius: 999px;
        box-shadow: 0 1px 4px rgba(31, 42, 64, 0.24);
        display: block;
        height: 18px;
        transform: translateX(0);
        transition: transform var(--motion-fast) var(--motion-ease);
        width: 18px;
      }

      .pmo-forum-workflow input:checked + .pmo-forum-switch-track {
        background: var(--brand);
        border-color: var(--brand);
      }

      .pmo-forum-workflow input:checked + .pmo-forum-switch-track span {
        transform: translateX(24px);
      }

      .pmo-forum-workflow input:focus-visible + .pmo-forum-switch-track {
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.14);
      }

      @media (max-width: 760px) {
        .pmo-forum-form-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class PmoGovernanceForumDrawerComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceForumDraft>();

  readonly options = pmoGovernanceForumFormOptions;

  draft = createPmoGovernanceForumDraft();

  get availableSecretariatOptions(): readonly string[] {
    return this.options.secretariatOptions.filter((option) => !this.draft.secretariat.includes(option));
  }

  get availableMemberOptions(): readonly string[] {
    return this.options.memberOptions.filter((option) => !this.draft.members.includes(option));
  }

  updateForumName(event: Event): void {
    this.draft = { ...this.draft, forumName: this.eventValue(event) };
  }

  updateType(event: Event): void {
    this.draft = { ...this.draft, type: this.eventValue(event) as PmoGovernanceForumType };
  }

  updateCategory(event: Event): void {
    this.draft = { ...this.draft, category: this.eventValue(event) };
  }

  updateDescription(event: Event): void {
    this.draft = { ...this.draft, description: this.eventValue(event) };
  }

  updateChair(event: Event): void {
    this.draft = { ...this.draft, chair: this.eventValue(event) };
  }

  addPerson(field: PmoForumPeopleField, event: Event): void {
    const value = this.eventValue(event);
    if (value && !this.draft[field].includes(value)) {
      this.draft = { ...this.draft, [field]: [...this.draft[field], value] };
    }
    this.resetSelect(event);
  }

  removePerson(field: PmoForumPeopleField, person: string): void {
    this.draft = { ...this.draft, [field]: this.draft[field].filter((option) => option !== person) };
  }

  toggleWorkflow(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.draft = { ...this.draft, workflowEnabled: Boolean(target?.checked) };
  }

  submitForum(event: Event): void {
    event.preventDefault();
    this.save.emit({
      ...this.draft,
      secretariat: [...this.draft.secretariat],
      members: [...this.draft.members],
    });
  }

  private eventValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    return target?.value ?? '';
  }

  private resetSelect(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) target.value = '';
  }
}
