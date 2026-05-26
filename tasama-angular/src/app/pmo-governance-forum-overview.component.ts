import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleFieldComponent } from './shared/pm-console-field.component';
import { PmConsoleStatusPillComponent } from './shared/pm-console-status-pill.component';
import {
  pmoGovernanceForumFormOptions,
  type PmoGovernanceForumRow,
  type PmoGovernanceForumType,
} from './pmo-governance-workspace.data';

export interface PmoGovernanceForumOverviewDraft {
  readonly forumName: string;
  readonly type: PmoGovernanceForumType;
  readonly category: string;
  readonly description: string;
  readonly createdOn: string;
  readonly createdBy: string;
  readonly forumId: string;
  readonly chair: string;
  readonly secretariatMembers: readonly string[];
  readonly memberNames: readonly string[];
}

type PmoGovernanceForumPeopleField = 'secretariatMembers' | 'memberNames';

@Component({
  selector: 'app-pmo-governance-forum-overview',
  standalone: true,
  imports: [PmConsoleFieldComponent, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pmo-forum-overview-tab" aria-label="Forum overview">
      <article class="pmo-forum-overview-section pmo-forum-profile-section">
        <header class="pmo-forum-overview-section-head">
          <div>
            <span>Forum information</span>
            <h3>Overview</h3>
          </div>
          <div class="pmo-forum-overview-actions">
            <span
              [pmConsoleStatusPill]="draft.type"
              baseClass="pmo-forum-type-pill"
              [tone]="draft.type === 'Non-Substantiated' ? 'is-muted' : 'is-active'"
            ></span>
            <button class="pmo-forum-cancel-button" type="button" (click)="cancelChanges()">Cancel</button>
            <button class="pmo-forum-save-button" type="button" (click)="saveChanges()">Save</button>
          </div>
        </header>

        <div class="pmo-forum-profile-grid">
          <app-pm-console-field
            label="Forum Name"
            [value]="draft.forumName"
            fieldClass="pmo-forum-edit-field"
            [mandatory]="true"
            [help]="true"
            (valueChange)="updateField('forumName', $event)"
          />
          <app-pm-console-field
            label="Type"
            type="select"
            [value]="draft.type"
            [options]="typeOptions"
            fieldClass="pmo-forum-edit-field"
            [help]="true"
            (valueChange)="updateType($event)"
          />
          <app-pm-console-field
            label="Category"
            type="select"
            [value]="draft.category"
            [options]="categoryOptions"
            fieldClass="pmo-forum-edit-field"
            [help]="true"
            (valueChange)="updateField('category', $event)"
          />
          <app-pm-console-field
            label="Forum Description"
            type="textarea"
            [value]="draft.description"
            fieldClass="pmo-forum-edit-field"
            [mandatory]="true"
            [help]="true"
            [wide]="true"
            [rows]="7"
            (valueChange)="updateField('description', $event)"
          />
        </div>
      </article>

      <aside class="pmo-forum-overview-side" aria-label="Forum metadata and ownership">
        <article class="pmo-forum-overview-section">
          <header class="pmo-forum-overview-section-head is-compact">
            <span pmConsoleIcon="info" aria-hidden="true"></span>
            <h3>Forum Identity</h3>
          </header>

          <div class="pmo-forum-meta-list">
            <app-pm-console-field
              label="Created On"
              [value]="draft.createdOn"
              fieldClass="pmo-forum-edit-field"
              [help]="true"
              (valueChange)="updateField('createdOn', $event)"
            />
            <app-pm-console-field
              label="Created By"
              [value]="draft.createdBy"
              fieldClass="pmo-forum-edit-field"
              [help]="true"
              (valueChange)="updateField('createdBy', $event)"
            />
            <app-pm-console-field
              label="Forum ID"
              [value]="draft.forumId"
              fieldClass="pmo-forum-edit-field"
              [help]="true"
              (valueChange)="updateField('forumId', $event)"
            />
          </div>
        </article>

        <article class="pmo-forum-overview-section">
          <header class="pmo-forum-overview-section-head is-compact">
            <span pmConsoleIcon="users" aria-hidden="true"></span>
            <h3>Ownership</h3>
          </header>

          <div class="pmo-forum-owner-list">
            <app-pm-console-field
              label="Forum Chair"
              type="select"
              [value]="draft.chair"
              [options]="chairOptions"
              placeholder="Select Forum Chair"
              fieldClass="pmo-forum-edit-field"
              [help]="true"
              (valueChange)="updateField('chair', $event)"
            />

            <label class="pmo-forum-people-field">
              <span class="pmo-forum-people-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Forum Secretariat
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-forum-chip-select">
                @for (person of draft.secretariatMembers; track person) {
                  <span class="pmo-forum-chip">
                    {{ person }}
                    <button type="button" [attr.aria-label]="'Remove ' + person + ' from forum secretariat'" (click)="removePerson('secretariatMembers', person)">
                      <span pmConsoleIcon="x" aria-hidden="true"></span>
                    </button>
                  </span>
                }
                <select [value]="''" (change)="addPerson('secretariatMembers', $event)" aria-label="Add forum secretariat">
                  <option value="">Add Secretariat</option>
                  @for (option of availableSecretariatOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-forum-people-field">
              <span class="pmo-forum-people-label">
                Forum Members
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-forum-chip-select" [class.is-empty]="draft.memberNames.length === 0">
                @for (person of draft.memberNames; track person) {
                  <span class="pmo-forum-chip">
                    {{ person }}
                    <button type="button" [attr.aria-label]="'Remove ' + person + ' from forum members'" (click)="removePerson('memberNames', person)">
                      <span pmConsoleIcon="x" aria-hidden="true"></span>
                    </button>
                  </span>
                }
                <select [value]="''" (change)="addPerson('memberNames', $event)" aria-label="Add forum member">
                  <option value="">Add Forum Member</option>
                  @for (option of availableMemberOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>
          </div>
        </article>
      </aside>
    </section>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-forum-overview-tab {
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(0, 1fr);
        min-height: 0;
        padding-top: 18px;
      }

      .pmo-forum-overview-side {
        display: grid;
        gap: 14px;
        grid-template-columns: minmax(0, 1fr);
        min-width: 0;
      }

      .pmo-forum-overview-section {
        background: #ffffff;
        border: 1px solid #e5e9f1;
        border-radius: 8px;
        display: grid;
        gap: 16px;
        min-width: 0;
        padding: 16px;
      }

      .pmo-forum-profile-section {
        align-content: start;
      }

      .pmo-forum-overview-section-head {
        align-items: flex-start;
        display: flex;
        gap: 12px;
        justify-content: space-between;
        min-width: 0;
      }

      .pmo-forum-overview-section-head > div:first-child {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .pmo-forum-overview-section-head > span:not(.pmo-forum-type-pill) {
        align-items: center;
        background: #eef2ff;
        border-radius: 999px;
        color: var(--brand);
        display: inline-flex;
        flex: 0 0 26px;
        height: 26px;
        justify-content: center;
        width: 26px;
      }

      .pmo-forum-overview-section-head > span:not(.pmo-forum-type-pill) .icon {
        height: 15px;
        width: 15px;
      }

      .pmo-forum-overview-section-head.is-compact {
        align-items: center;
        justify-content: flex-start;
      }

      .pmo-forum-overview-section-head > div > span {
        color: var(--brand);
        font-size: 10px;
        font-weight: 600;
        line-height: 12px;
        text-transform: uppercase;
      }

      .pmo-forum-overview-section-head h3 {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-forum-overview-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .pmo-forum-type-pill {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
        min-height: 26px;
        padding: 5px 10px;
        white-space: nowrap;
      }

      .pmo-forum-type-pill.is-active {
        background: rgba(16, 6, 159, 0.08);
        color: var(--brand);
      }

      .pmo-forum-type-pill.is-muted {
        background: #eef1f7;
        color: #526072;
      }

      .pmo-forum-profile-grid {
        display: grid;
        gap: 16px 18px;
        grid-template-columns: minmax(0, 1.4fr) minmax(128px, 0.8fr) minmax(150px, 1fr);
        min-width: 0;
      }

      .pmo-forum-owner-list,
      .pmo-forum-meta-list,
      .pmo-forum-people-field {
        display: grid;
        min-width: 0;
      }

      .pmo-forum-owner-list,
      .pmo-forum-meta-list {
        gap: 14px;
      }

      .pmo-forum-people-field {
        gap: 7px;
      }

      .pmo-forum-people-label {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        line-height: 15px;
        min-width: 0;
      }

      .pmo-forum-people-label .icon {
        color: #8c94a3;
        height: 12px;
        width: 12px;
      }

      .pmo-required {
        color: #d33131;
      }

      :host ::ng-deep .pmo-forum-edit-field {
        gap: 7px;
      }

      :host ::ng-deep .pmo-forum-edit-field .matrix-field-label {
        color: #526072;
        font-size: 11px;
        font-weight: 600;
        line-height: 15px;
      }

      :host ::ng-deep .pmo-forum-edit-field input,
      :host ::ng-deep .pmo-forum-edit-field select,
      :host ::ng-deep .pmo-forum-edit-field textarea {
        border-color: #d9dee8;
        border-radius: 6px;
        color: #2f2f2f;
        font-size: 12px;
        line-height: 16px;
        min-height: 38px;
      }

      :host ::ng-deep .pmo-forum-edit-field textarea {
        line-height: 18px;
        min-height: 132px;
      }

      .pmo-forum-chip-select {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d9dee8;
        border-radius: 6px;
        color: #2f2f2f;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        min-height: 38px;
        padding: 4px 10px;
      }

      .pmo-forum-chip {
        align-items: center;
        background: #f4f6fb;
        border: 1px solid #e4e7ef;
        border-radius: 4px;
        color: #2f2f2f;
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        line-height: 15px;
        min-height: 24px;
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

      .pmo-forum-chip-select select {
        appearance: none;
        background: transparent;
        border: 0;
        color: #2f2f2f;
        flex: 1 1 118px;
        font: inherit;
        font-size: 12px;
        min-height: 28px;
        min-width: 0;
        outline: 0;
      }

      .pmo-forum-chip-select > .icon {
        color: #8c94a3;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      .pmo-forum-save-button,
      .pmo-forum-cancel-button {
        align-items: center;
        border-radius: 7px;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        height: 32px;
        justify-content: center;
        padding: 0 12px;
      }

      .pmo-forum-save-button {
        background: var(--brand);
        border: 1px solid var(--brand);
        color: #ffffff;
      }

      .pmo-forum-cancel-button {
        background: #ffffff;
        border: 1px solid #cfd8ea;
        color: #526388;
      }

      @media (max-width: 760px) {
        .pmo-forum-profile-grid,
        .pmo-forum-overview-side {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-forum-overview-section-head {
          align-items: flex-start;
          flex-direction: column;
        }

        .pmo-forum-overview-actions {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export class PmoGovernanceForumOverviewComponent implements OnChanges {
  @Input({ required: true }) forum!: PmoGovernanceForumRow;
  @Output() readonly forumSave = new EventEmitter<PmoGovernanceForumOverviewDraft>();

  readonly typeOptions = [...pmoGovernanceForumFormOptions.typeOptions];
  readonly categoryOptions = pmoGovernanceForumFormOptions.categoryOptions.filter((option) => option !== '');
  readonly chairOptions = [...pmoGovernanceForumFormOptions.chairOptions];
  readonly secretariatOptions = [...pmoGovernanceForumFormOptions.secretariatOptions];
  readonly memberOptions = [...pmoGovernanceForumFormOptions.memberOptions];

  draft: PmoGovernanceForumOverviewDraft = this.emptyDraft();
  private savedDraft: PmoGovernanceForumOverviewDraft = this.emptyDraft();

  ngOnChanges(): void {
    this.draft = this.draftFromForum(this.forum);
    this.savedDraft = this.cloneDraft(this.draft);
  }

  get availableSecretariatOptions(): readonly string[] {
    return this.secretariatOptions.filter((option) => !this.draft.secretariatMembers.includes(option));
  }

  get availableMemberOptions(): readonly string[] {
    return this.memberOptions.filter((option) => !this.draft.memberNames.includes(option));
  }

  updateField(field: Exclude<keyof PmoGovernanceForumOverviewDraft, 'type' | 'secretariatMembers' | 'memberNames'>, value: string): void {
    this.draft = { ...this.draft, [field]: value };
  }

  updateType(value: string): void {
    this.draft = { ...this.draft, type: value as PmoGovernanceForumType };
  }

  addPerson(field: PmoGovernanceForumPeopleField, event: Event): void {
    const value = this.eventValue(event);
    if (value && !this.draft[field].includes(value)) {
      this.draft = { ...this.draft, [field]: [...this.draft[field], value] };
    }
    this.resetSelect(event);
  }

  removePerson(field: PmoGovernanceForumPeopleField, person: string): void {
    this.draft = { ...this.draft, [field]: this.draft[field].filter((option) => option !== person) };
  }

  saveChanges(): void {
    this.savedDraft = this.cloneDraft(this.draft);
    this.forumSave.emit(this.savedDraft);
  }

  cancelChanges(): void {
    this.draft = this.cloneDraft(this.savedDraft);
  }

  private draftFromForum(forum: PmoGovernanceForumRow): PmoGovernanceForumOverviewDraft {
    return {
      forumName: forum.forumName,
      type: forum.type,
      category: forum.category,
      description: forum.description,
      createdOn: forum.createdOn,
      createdBy: forum.createdBy,
      forumId: forum.forumId,
      chair: forum.chair,
      secretariatMembers: [...forum.secretariatMembers],
      memberNames: [...forum.memberNames],
    };
  }

  private cloneDraft(draft: PmoGovernanceForumOverviewDraft): PmoGovernanceForumOverviewDraft {
    return {
      ...draft,
      secretariatMembers: [...draft.secretariatMembers],
      memberNames: [...draft.memberNames],
    };
  }

  private emptyDraft(): PmoGovernanceForumOverviewDraft {
    return {
      forumName: '',
      type: 'Substantiated',
      category: '',
      description: '',
      createdOn: '',
      createdBy: '',
      forumId: '',
      chair: '',
      secretariatMembers: [],
      memberNames: [],
    };
  }

  private eventValue(event: Event): string {
    const target = event.target as HTMLSelectElement | null;
    return target?.value ?? '';
  }

  private resetSelect(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) target.value = '';
  }
}
