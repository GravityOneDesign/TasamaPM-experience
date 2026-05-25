import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { StageGateStatus } from '../pm-console-stage-gate.data';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface StageGateAttachment {
  id: string;
  name: string;
  source: 'upload' | 'link';
  addedOn: string;
  sizeLabel?: string;
  url?: string;
}

export interface StageGateChecklistChange {
  index: number;
  checked: boolean;
}

@Component({
  selector: 'app-pm-console-stage-gate-drawer',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stage-drawer-shell" aria-live="polite">
      <button class="stage-drawer-backdrop" type="button" (click)="close.emit()" [attr.aria-label]="closeAriaLabel"></button>
      <aside class="stage-gate-drawer" role="dialog" aria-modal="true" [attr.aria-label]="ariaLabel || project + ' ' + gate + ' submission'">
        <div class="drawer-head">
          <button class="drawer-close" type="button" (click)="close.emit()" aria-label="Close drawer">
            <span pmConsoleIcon="chevron-left" aria-hidden="true"></span>
          </button>
          <div>
            <span class="eyebrow">{{ project }}</span>
            <h2>{{ gate }}</h2>
            <p>{{ stageLabel }} stage gate submission to PMO</p>
          </div>
        </div>

        <div class="drawer-status-card {{ status }}">
          <strong>{{ statusLabel }}</strong>
          <span>{{ readinessText }} · Due {{ dueLabel }}</span>
        </div>

        <div class="stage-gate-review-flow" aria-label="Stage gate workflow">
          <span [class.active]="status === 'current'">Ready</span>
          <i></i>
          <span [class.active]="status === 'submitted'">Submitted</span>
          <i></i>
          <span [class.active]="status === 'complete'">Approved</span>
        </div>

        <form class="stage-gate-form" (submit)="handleSubmit($event)">
          <div class="stage-gate-drawer-body">
            <div class="drawer-section stage-checklist-section">
              <div class="drawer-section-headline">
                <span class="drawer-section-title">Checklist</span>
                <small>{{ normalizedCheckedCount }}/{{ totalChecklistCount }} complete</small>
              </div>
              <div class="project-stages-panel-progress" aria-hidden="true">
                <span [style.width]="checklistProgressWidth"></span>
              </div>
              <div class="project-stages-checklist">
                @for (item of checklist; track item; let index = $index) {
                  <label class="stage-checklist-item" [class.checked]="isChecklistChecked(index)" [class.is-disabled]="!canEditChecklist">
                    <input
                      type="checkbox"
                      [checked]="isChecklistChecked(index)"
                      [disabled]="!canEditChecklist"
                      (change)="checklistChange.emit({ index, checked: $any($event.target).checked })"
                    />
                    <i aria-hidden="true"><span pmConsoleIcon="check"></span></i>
                    <span>{{ item }}</span>
                  </label>
                }
              </div>
            </div>

            <div class="drawer-section stage-comment-section">
              <div class="drawer-section-headline">
                <span class="drawer-section-title">Comments</span>
                <small>{{ isCommentAdded ? 'Added' : 'Required' }}</small>
              </div>
              <label class="project-stages-comment-field">
                <span>Submission comments</span>
                <textarea
                  rows="7"
                  maxlength="1200"
                  [value]="comment"
                  [disabled]="!canEditComments"
                  (input)="commentChange.emit($any($event.target).value)"
                  placeholder="Add PMO review notes before submitting"
                  aria-label="Stage gate submission comments"
                ></textarea>
              </label>
            </div>

            <div class="drawer-section stage-evidence-section" [class.is-attached]="isEvidenceAttached">
              <div class="drawer-section-headline">
                <span class="drawer-section-title">Evidence</span>
                <small>{{ evidenceEnabled ? evidenceLabel : 'Not required' }}</small>
              </div>
              @if (evidenceEnabled) {
                <p>{{ checkpoint }}</p>
                <label class="stage-evidence-upload">
                  <input type="file" multiple (change)="handleAttachmentsSelected($event)" [disabled]="!canEditChecklist" />
                  <span [pmConsoleIcon]="isEvidenceAttached ? 'file-check-2' : 'upload-cloud'" aria-hidden="true"></span>
                  <strong>{{ isEvidenceAttached ? evidenceLabel : 'Attach proof of work' }}</strong>
                  <small>{{ isEvidenceAttached ? 'Evidence attached for PMO review' : 'Upload artefact, sign-off, or work proof requested by PMO' }}</small>
                </label>
                @if (attachments.length) {
                  <div class="attachment-list stage-attachment-list" aria-label="Stage gate evidence attachments">
                    @for (attachment of attachments; track attachment.id) {
                      <article class="attachment-list-item">
                        <span class="attachment-list-icon" aria-hidden="true"><span pmConsoleIcon="paperclip"></span></span>
                        <div>
                          <strong>{{ attachment.name }}</strong>
                          <small>{{ attachmentMeta(attachment) }}</small>
                        </div>
                        <div class="attachment-list-actions">
                          @if (attachment.url) {
                            <a [href]="attachment.url" [attr.download]="attachment.source === 'upload' ? attachment.name : null" [attr.target]="attachment.source === 'link' ? '_blank' : null" rel="noreferrer">{{ attachment.source === 'upload' ? 'Download' : 'Open' }}</a>
                          } @else {
                            <span>Archived</span>
                          }
                          @if (canEditChecklist) {
                            <button type="button" (click)="attachmentRemove.emit(attachment.id)" [attr.aria-label]="'Remove ' + attachment.name">
                              <span pmConsoleIcon="x" aria-hidden="true"></span>
                            </button>
                          }
                        </div>
                      </article>
                    }
                  </div>
                }
              } @else {
                <p>PMO has not enabled evidence capture for this gate.</p>
              }
            </div>
          </div>

          <button class="drawer-submit" type="submit" [disabled]="!canSubmitGate">
            {{ submitLabel }}
          </button>
        </form>
      </aside>
    </div>
  `,
})
export class PmConsoleStageGateDrawerComponent {
  @Input() project = '';
  @Input() gate = '';
  @Input() stageLabel = '';
  @Input() status: StageGateStatus = 'upcoming';
  @Input() checkedCount = 0;
  @Input() gateTotal = 0;
  @Input() dueLabel = '';
  @Input() checkpoint = '';
  @Input() checklist: readonly string[] = [];
  @Input() checklistState: readonly boolean[] = [];
  @Input() comment = '';
  @Input() attachments: readonly StageGateAttachment[] = [];
  @Input() ariaLabel = '';
  @Input() closeAriaLabel = 'Close stage gate drawer';

  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly submitGate = new EventEmitter<Event>();
  @Output() readonly commentChange = new EventEmitter<string>();
  @Output() readonly checklistChange = new EventEmitter<StageGateChecklistChange>();
  @Output() readonly attachmentsSelected = new EventEmitter<File[]>();
  @Output() readonly attachmentRemove = new EventEmitter<string>();

  get statusLabel(): string {
    if (this.status === 'complete') return 'Complete';
    if (this.status === 'submitted') return 'Stage gate submitted';
    if (this.status === 'revoked') return 'Revoked';
    if (this.status === 'current') return 'Current stage';
    return 'Upcoming';
  }

  get readinessText(): string {
    if (this.status === 'complete') return `${this.totalChecklistCount}/${this.totalChecklistCount} approved by PMO`;
    if (this.status === 'submitted') return 'Submitted to PMO and waiting for approval';
    if (this.status === 'current' || this.status === 'revoked') return `${this.normalizedCheckedCount}/${this.totalChecklistCount} ready`;
    return 'Not started';
  }

  get totalChecklistCount(): number {
    return Math.max(1, this.gateTotal || this.checklist.length);
  }

  get normalizedCheckedCount(): number {
    if (this.checklistState.length) return this.checklistState.filter(Boolean).length;
    return Math.min(this.checkedCount, this.totalChecklistCount);
  }

  get checklistProgressWidth(): string {
    const progress = Math.min(100, Math.max(0, (this.normalizedCheckedCount / this.totalChecklistCount) * 100));
    return `${progress}%`;
  }

  get canEditChecklist(): boolean {
    return this.status === 'current';
  }

  get canEditComments(): boolean {
    return this.status === 'current' || this.status === 'submitted' || this.status === 'revoked';
  }

  get isCommentAdded(): boolean {
    return this.comment.trim().length > 0;
  }

  get evidenceEnabled(): boolean {
    return this.status === 'current' || this.status === 'submitted' || this.status === 'complete';
  }

  get evidenceLabel(): string {
    const count = this.attachments.length;
    if (!count) return 'Required';
    return count === 1 ? '1 attachment' : `${count} attachments`;
  }

  get isEvidenceAttached(): boolean {
    return this.attachments.length > 0;
  }

  get canSubmitGate(): boolean {
    return this.status === 'current' && this.isChecklistComplete && this.isCommentAdded && (!this.evidenceEnabled || this.isEvidenceAttached);
  }

  get submitLabel(): string {
    if (this.status === 'current') return 'Submit stage gate to PMO';
    if (this.status === 'submitted') return 'Already submitted to PMO';
    if (this.status === 'complete') return 'Approved by PMO';
    if (this.status === 'revoked') return 'Rework required before submit';
    return 'Current stage required first';
  }

  isChecklistChecked(index: number): boolean {
    if (this.checklistState.length) return Boolean(this.checklistState[index]);
    return index < this.normalizedCheckedCount;
  }

  attachmentMeta(attachment: StageGateAttachment): string {
    return [attachment.source === 'upload' ? 'Uploaded file' : 'Linked document', attachment.sizeLabel, attachment.addedOn].filter(Boolean).join(' | ');
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.canSubmitGate) return;
    this.submitGate.emit(event);
  }

  handleAttachmentsSelected(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.files?.length) return;
    this.attachmentsSelected.emit(Array.from(input.files));
    input.value = '';
  }

  private get isChecklistComplete(): boolean {
    return this.checklist.every((_, index) => this.isChecklistChecked(index));
  }
}
