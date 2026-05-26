import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  createPmoGovernanceSourceDraft,
  pmoGovernanceSourceFormOptions,
  type PmoGovernanceSourceDraft,
  type PmoGovernanceSourceMode,
  type PmoGovernanceSourceType,
} from './pmo-governance-workspace.data';

type PmoGovernanceSourceDrawerContext = 'workspace' | 'forum';

@Component({
  selector: 'app-pmo-governance-source-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-plan-drawer
      title="Add Source"
      eyebrow="My Workspace"
      description="Source setup details"
      submitLabel="Save"
      cancelLabel="Cancel"
      closeAriaLabel="Close add source drawer"
      ariaLabel="Add source"
      [submitDisabled]="!canSave"
      (close)="close.emit()"
      (submitForm)="submitSource($event)"
    >
      <div planDrawerBody class="pmo-source-drawer-form">
        <section class="pmo-source-form-section" aria-labelledby="pmo-source-details-heading">
          <h3 id="pmo-source-details-heading">Source Details</h3>

          @if (sourceContext === 'forum') {
            <fieldset class="pmo-source-mode-field">
              <legend class="sr-only">Source action</legend>
              <div class="pmo-source-mode-options" role="radiogroup" aria-label="Source action">
                <label class="pmo-source-mode-option" [class.active]="draft.sourceMode === 'new'">
                  <input type="radio" name="pmo-source-mode" value="new" [checked]="draft.sourceMode === 'new'" (change)="updateSourceMode('new')" />
                  <span aria-hidden="true"></span>
                  Add Source
                </label>
                <label class="pmo-source-mode-option" [class.active]="draft.sourceMode === 'existing'">
                  <input type="radio" name="pmo-source-mode" value="existing" [checked]="draft.sourceMode === 'existing'" (change)="updateSourceMode('existing')" />
                  <span aria-hidden="true"></span>
                  Add Existing Source
                </label>
              </div>
            </fieldset>
          }

          <div class="pmo-source-form-grid">
            <label class="pmo-source-field">
              <span class="pmo-source-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Type
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <span class="pmo-source-select-wrap">
                <select [value]="draft.type" (change)="updateType($event)" aria-label="Source type">
                  @if (sourceContext === 'forum') {
                    <option value="" disabled>Select</option>
                  }
                  @for (option of options.typeOptions; track option) {
                    <option [value]="option">{{ option }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </span>
            </label>

            <label class="pmo-source-field">
              <span class="pmo-source-field-label">
                <span class="pmo-required" aria-hidden="true">*</span>
                Source Name
                <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
              </span>
              <input type="text" [value]="draft.sourceName" autocomplete="off" (input)="updateSourceName($event)" />
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

      .pmo-source-drawer-form,
      .pmo-source-form-section,
      .pmo-source-form-grid,
      .pmo-source-field {
        display: grid;
        min-width: 0;
      }

      .pmo-source-form-section {
        border: 1px solid #e5e9f1;
        border-radius: 8px;
        gap: 16px;
        padding: 16px;
      }

      .pmo-source-form-section h3 {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
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

      .pmo-source-form-grid {
        gap: 16px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-source-mode-field {
        border: 0;
        margin: 0;
        padding: 0;
      }

      .pmo-source-mode-options {
        align-items: center;
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        max-width: 560px;
      }

      .pmo-source-mode-option {
        align-items: center;
        color: #2f2f2f;
        cursor: pointer;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        line-height: 16px;
        min-height: 28px;
      }

      .pmo-source-mode-option input {
        height: 1px;
        margin: 0;
        opacity: 0;
        position: absolute;
        width: 1px;
      }

      .pmo-source-mode-option > span {
        border: 1px solid #aeb7c9;
        border-radius: 999px;
        height: 14px;
        pointer-events: none;
        position: relative;
        width: 14px;
      }

      .pmo-source-mode-option.active {
        color: var(--brand);
        font-weight: 600;
      }

      .pmo-source-mode-option.active > span {
        border-color: var(--brand);
      }

      .pmo-source-mode-option.active > span::after {
        background: var(--brand);
        border-radius: inherit;
        content: "";
        height: 8px;
        inset: 2px;
        position: absolute;
        width: 8px;
      }

      .pmo-source-mode-option:has(input:focus-visible) > span {
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.12);
      }

      .pmo-source-field {
        gap: 7px;
      }

      .pmo-source-field-label {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        line-height: 15px;
      }

      .pmo-source-field-label .icon {
        color: #8c94a3;
        height: 12px;
        width: 12px;
      }

      .pmo-required {
        color: #d33131;
      }

      .pmo-source-field input,
      .pmo-source-select-wrap {
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

      .pmo-source-field input {
        padding: 0 11px;
      }

      .pmo-source-field input:focus,
      .pmo-source-select-wrap:focus-within {
        border-color: rgba(16, 6, 159, 0.52);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.11);
        outline: none;
      }

      .pmo-source-select-wrap {
        align-items: center;
        display: flex;
        gap: 6px;
        padding: 0 10px;
      }

      .pmo-source-select-wrap select {
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

      .pmo-source-select-wrap .icon {
        color: #8c94a3;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      @media (max-width: 760px) {
        .pmo-source-form-grid,
        .pmo-source-mode-options {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class PmoGovernanceSourceDrawerComponent implements OnChanges {
  @Input() sourceContext: PmoGovernanceSourceDrawerContext = 'workspace';

  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<PmoGovernanceSourceDraft>();

  readonly options = pmoGovernanceSourceFormOptions;

  draft = createPmoGovernanceSourceDraft();

  ngOnChanges(): void {
    this.draft = {
      ...createPmoGovernanceSourceDraft(),
      type: this.sourceContext === 'forum' ? '' : 'Management',
    };
  }

  get canSave(): boolean {
    return Boolean(this.draft.type && this.draft.sourceName.trim());
  }

  updateSourceMode(sourceMode: PmoGovernanceSourceMode): void {
    this.draft = { ...this.draft, sourceMode };
  }

  updateType(event: Event): void {
    this.draft = { ...this.draft, type: this.eventValue(event) as PmoGovernanceSourceType | '' };
  }

  updateSourceName(event: Event): void {
    this.draft = { ...this.draft, sourceName: this.eventValue(event) };
  }

  submitSource(event: Event): void {
    event.preventDefault();
    if (!this.canSave) return;
    this.save.emit({
      ...this.draft,
      sourceName: this.draft.sourceName.trim(),
    });
  }

  private eventValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLSelectElement | null;
    return target?.value ?? '';
  }
}
