import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { PmConsoleAgentConversationComponent } from './pm-console-agent-conversation.component';
import { PmConsoleAgentMessage, PmConsoleAgentMessageActionEvent } from './pm-console-agent-message.model';
import { PmConsoleAgentOrbComponent } from './pm-console-agent-orb.component';
import { PmConsoleIconComponent } from './pm-console-icon.component';

interface PmConsoleAgentUploadedFile {
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

@Component({
  selector: 'app-pm-console-agent-panel',
  standalone: true,
  imports: [PmConsoleAgentConversationComponent, PmConsoleAgentOrbComponent, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }

      .agent-panel-layer {
        inset: 0;
        pointer-events: none;
        position: fixed;
        z-index: 150;
      }

      .agent-panel {
        background: #ffffff;
        border: 0.5px solid #dcdee5;
        border-radius: 8px;
        bottom: 14px;
        box-shadow: 0 0 16px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
        left: auto;
        max-width: calc(100vw - 44px);
        opacity: 0;
        overflow: hidden;
        pointer-events: auto;
        position: absolute;
        right: 22px;
        top: 78px;
        transform: translateX(calc(100% + 24px)) scale(0.985);
        transform-origin: right center;
        transition:
          opacity 260ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)),
          transform 320ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1));
        width: clamp(260px, calc((100vw - 104px) * 0.28), 344px);
      }

      .agent-panel-layer.is-open .agent-panel {
        opacity: 1;
        transform: translateX(0) scale(1);
      }

      .agent-panel-header {
        align-items: center;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        flex: 0 0 54px;
        justify-content: space-between;
        padding: 0 14px 1px 0;
      }

      .agent-panel-brand {
        align-items: center;
        display: flex;
        gap: 0;
        min-width: 0;
      }

      .agent-panel-orb-frame {
        align-items: center;
        display: flex;
        height: 52px;
        justify-content: center;
        position: relative;
        width: 52px;
      }

      .agent-panel-orb-frame app-pm-console-agent-orb {
        flex: 0 0 auto;
      }

      .agent-panel-title {
        align-items: center;
        color: #404040;
        display: inline-flex;
        font-size: 17px;
        font-weight: 600;
        line-height: 23px;
        min-width: 0;
      }

      .agent-panel-close {
        align-items: center;
        border-radius: 8px;
        color: #404040;
        display: inline-flex;
        height: 32px;
        justify-content: center;
        transition:
          background var(--motion-fast, 160ms) ease,
          box-shadow var(--motion-fast, 160ms) ease;
        width: 32px;
      }

      .agent-panel-close:hover,
      .agent-panel-close:focus-visible {
        background: rgba(1, 10, 15, 0.05);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
        outline: 0;
      }

      .agent-panel-close .icon {
        height: 24px;
        width: 24px;
      }

      .agent-panel-body {
        flex: 1 1 auto;
        min-height: 0;
        position: relative;
      }

      .agent-panel-conversation {
        inset: 0;
        position: absolute;
      }

      .agent-panel-greeting {
        left: 50%;
        position: absolute;
        top: calc(50% - 132px);
        transform: translateX(-50%);
        width: min(300px, calc(100% - 40px));
      }

      .agent-panel-greeting-copy {
        color: #404040;
        display: grid;
        gap: 2px;
        justify-items: start;
        line-height: 1;
      }

      .agent-panel-greeting-copy span {
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 26px;
      }

      .agent-panel-greeting-copy strong {
        font-size: 21px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 30px;
      }

      .agent-panel-chips {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-start;
        padding-top: 14px;
      }

      .agent-panel-chip {
        align-items: center;
        border: 1px solid #d3d3d3;
        border-radius: 9999px;
        color: #0b0b0b;
        display: inline-flex;
        font-size: 13px;
        font-weight: 500;
        gap: 8px;
        justify-content: center;
        letter-spacing: 0;
        line-height: 18px;
        min-height: 28px;
        padding: 4px 10px 4px 8px;
        transition:
          background var(--motion-fast, 160ms) ease,
          border-color var(--motion-fast, 160ms) ease,
          box-shadow var(--motion-fast, 160ms) ease,
          transform var(--motion-fast, 160ms) ease;
        white-space: nowrap;
      }

      .agent-panel-chip:hover,
      .agent-panel-chip:focus-visible {
        background: rgba(1, 10, 15, 0.035);
        border-color: #b9bbc4;
        box-shadow: 0 4px 10px rgba(1, 10, 15, 0.06);
        outline: 0;
        transform: translateY(-1px);
      }

      .agent-panel-chip .icon {
        height: 16px;
        width: 16px;
      }

      .agent-panel-chip.project-status .icon {
        color: #d25df3;
      }

      .agent-panel-chip.reports-due .icon {
        color: #f2aa13;
      }

      .agent-panel-chip.next-actions .icon {
        color: #10b8c7;
      }

      .agent-prompt-area {
        bottom: 12px;
        left: 12px;
        position: absolute;
        right: 12px;
      }

      .agent-prompt {
        background: rgba(1, 10, 15, 0.05);
        border: 1px solid #e6e6e6;
        border-radius: 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        padding: 1px;
      }

      .agent-prompt-attachments {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 6px 10px 0;
      }

      .agent-upload-chip {
        align-items: center;
        animation: agent-upload-chip-enter 180ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        background: #e6e6e6;
        border: 1px solid #e6e6e6;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        color: #727272;
        display: inline-flex;
        font-size: 12px;
        gap: 5px;
        height: 30px;
        line-height: 16px;
        max-width: 100%;
        min-width: 0;
        padding: 7px 8px;
      }

      .agent-upload-chip .icon {
        color: #727272;
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }

      .agent-upload-chip.is-pdf .agent-upload-kind {
        color: #ef4444;
      }

      .agent-upload-chip.is-image .agent-upload-kind {
        color: #3448d4;
      }

      .agent-upload-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .agent-upload-remove {
        align-items: center;
        border-radius: 9999px;
        color: #727272;
        display: inline-flex;
        flex: 0 0 auto;
        height: 16px;
        justify-content: center;
        transition:
          background 150ms ease,
          color 150ms ease,
          transform 150ms ease;
        width: 16px;
      }

      .agent-upload-remove:hover,
      .agent-upload-remove:focus-visible {
        background: rgba(1, 10, 15, 0.08);
        color: #0b0b0b;
        outline: 0;
        transform: scale(1.04);
      }

      .agent-upload-remove .icon {
        height: 12px;
        width: 12px;
      }

      .agent-prompt textarea {
        background: transparent;
        border: 0;
        color: #404040;
        display: block;
        font-size: 12.5px;
        line-height: 18px;
        max-height: 128px;
        min-height: 40px;
        outline: 0;
        padding: 8px 11px 4px;
        resize: none;
        width: 100%;
      }

      .agent-prompt.has-attachments textarea {
        min-height: 56px;
        padding-top: 8px;
      }

      .agent-prompt textarea::placeholder {
        color: #727272;
        opacity: 1;
      }

      .agent-prompt-footer {
        align-items: flex-start;
        display: flex;
        justify-content: space-between;
        padding: 1px 8px 7px;
      }

      .agent-prompt-tools {
        align-items: center;
        display: flex;
        gap: 4px;
      }

      .agent-prompt-action,
      .agent-voice-action {
        align-items: center;
        border-radius: 8px;
        display: inline-flex;
        font-size: 12px;
        gap: 5px;
        height: 24px;
        justify-content: center;
        line-height: 16px;
        padding: 4px 8px;
        transition:
          background var(--motion-fast, 160ms) ease,
          box-shadow var(--motion-fast, 160ms) ease;
        white-space: nowrap;
      }

      .agent-prompt-action {
        background: rgba(255, 255, 255, 0.05);
        color: #727272;
        font-weight: 400;
      }

      .agent-voice-action {
        background: rgba(1, 10, 15, 0.05);
        border-radius: 9999px;
        color: #0b0b0b;
        font-weight: 500;
      }

      .agent-prompt-action:hover,
      .agent-prompt-action:focus-visible,
      .agent-voice-action:hover,
      .agent-voice-action:focus-visible {
        background: rgba(1, 10, 15, 0.08);
        box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.06);
        outline: 0;
      }

      .agent-prompt-action .icon,
      .agent-voice-action .icon {
        height: 14px;
        width: 14px;
      }

      .agent-prompt-file-input {
        display: none;
      }

      @keyframes agent-upload-chip-enter {
        from {
          opacity: 0;
          transform: translateY(4px) scale(0.96);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .agent-panel-disclaimer {
        color: #727272;
        font-size: 10.5px;
        font-weight: 400;
        line-height: 13px;
        margin-top: 5px;
        text-align: center;
      }

      @media (max-width: 760px) {
        .agent-panel {
          border-radius: 0;
          bottom: 0;
          left: 0;
          max-width: none;
          right: auto;
          top: 0;
          width: 100vw;
        }

        .agent-panel-header {
          padding-right: 16px;
        }

        .agent-panel-greeting {
          top: calc(50% - 170px);
          width: calc(100% - 44px);
        }

        .agent-panel-greeting-copy span {
          font-size: 22px;
          line-height: 32px;
        }

        .agent-panel-greeting-copy strong {
          font-size: 25px;
          line-height: 36px;
          white-space: normal;
        }

        .agent-panel-chips {
          gap: 10px;
        }

        .agent-prompt-area {
          bottom: 12px;
          left: 12px;
          right: 12px;
        }

        .agent-prompt-footer {
          gap: 8px;
        }

        .agent-prompt-tools {
          flex-wrap: wrap;
        }
      }
    `,
  ],
  template: `
    <section class="agent-panel-layer" [class.is-open]="open" [attr.aria-hidden]="open ? null : 'true'">
      <aside class="agent-panel" role="dialog" aria-label="DotZ assistant" [attr.aria-modal]="open ? 'false' : null">
        <header class="agent-panel-header">
          <div class="agent-panel-brand">
            <span class="agent-panel-orb-frame" aria-hidden="true">
              <app-pm-console-agent-orb [size]="44" />
            </span>
            <span class="agent-panel-title">
              DotZ
            </span>
          </div>
          <button class="agent-panel-close" type="button" aria-label="Close DotZ assistant" (click)="closePanel.emit()">
            <span pmConsoleIcon="panel-right-close" aria-hidden="true"></span>
          </button>
        </header>

        <div class="agent-panel-body">
          @if (messages.length === 0) {
            <section class="agent-panel-greeting" aria-label="Assistant start prompts">
              <h2 class="agent-panel-greeting-copy">
                <span>Hey Muna,</span>
                <strong>Where should we start today?</strong>
              </h2>
              <div class="agent-panel-chips">
                <button class="agent-panel-chip project-status" type="button" (click)="submitQuickPrompt('Summarize project status')">
                  <span pmConsoleIcon="chart-bar" aria-hidden="true"></span>
                  <span>Project status</span>
                </button>
                <button class="agent-panel-chip reports-due" type="button" (click)="submitQuickPrompt('Show reports due')">
                  <span pmConsoleIcon="file-text" aria-hidden="true"></span>
                  <span>Reports due</span>
                </button>
                <button class="agent-panel-chip next-actions" type="button" (click)="submitQuickPrompt('List my next actions')">
                  <span pmConsoleIcon="list-checks" aria-hidden="true"></span>
                  <span>Next actions</span>
                </button>
              </div>
            </section>
          } @else {
            <app-pm-console-agent-conversation
              class="agent-panel-conversation"
              [messages]="messages"
              (messageAction)="messageAction.emit($event)"
            />
          }

          <form class="agent-prompt-area" aria-label="Ask DotZ" (submit)="submitPrompt($event)">
            <div class="agent-prompt" [class.has-attachments]="uploadedFiles.length > 0">
              @if (uploadedFiles.length > 0) {
                <div class="agent-prompt-attachments" aria-label="Attached files">
                  @for (file of uploadedFiles; track file.id) {
                    <span class="agent-upload-chip" [class.is-pdf]="isPdfFile(file)" [class.is-image]="isImageFile(file)">
                      <span class="agent-upload-kind" [pmConsoleIcon]="uploadedFileIcon(file)" aria-hidden="true"></span>
                      <span class="agent-upload-name">{{ file.name }}</span>
                      <button class="agent-upload-remove" type="button" [attr.aria-label]="'Remove ' + file.name" (click)="removeUploadedFile(file.id)">
                        <span pmConsoleIcon="x" aria-hidden="true"></span>
                      </button>
                    </span>
                  }
                </div>
              }
              <textarea
                aria-label="Ask DotZ"
                placeholder="What would you like to know?"
                [value]="draftPrompt"
                (input)="updateDraftPrompt($event)"
                (keydown)="handlePromptKeydown($event)"
              ></textarea>
              <div class="agent-prompt-footer">
                <div class="agent-prompt-tools">
                  <button class="agent-prompt-action" type="button" (click)="attachmentInput.click()">
                    <span pmConsoleIcon="paperclip" aria-hidden="true"></span>
                    <span>Attach</span>
                  </button>
                  <input
                    #attachmentInput
                    class="agent-prompt-file-input"
                    type="file"
                    multiple
                    (change)="handleFileUpload($event)"
                  />
                  <button class="agent-prompt-action" type="button">
                    <span pmConsoleIcon="circle" aria-hidden="true"></span>
                    <span>Web Search</span>
                  </button>
                </div>
                <button class="agent-voice-action" type="button">
                  <span pmConsoleIcon="audio-lines" aria-hidden="true"></span>
                  <span>Voice</span>
                </button>
              </div>
            </div>
            <p class="agent-panel-disclaimer">DotZ is AI and can make mistakes. Please double-check responses.</p>
          </form>
        </div>
      </aside>
    </section>
  `,
})
export class PmConsoleAgentPanelComponent {
  @Input() open = false;
  @Input() messages: readonly PmConsoleAgentMessage[] = [];
  @Output() readonly closePanel = new EventEmitter<void>();
  @Output() readonly promptSubmitted = new EventEmitter<string>();
  @Output() readonly messageAction = new EventEmitter<PmConsoleAgentMessageActionEvent>();

  draftPrompt = '';
  uploadedFiles: readonly PmConsoleAgentUploadedFile[] = [];
  private uploadedFileCounter = 0;

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    if (!this.open) return;
    this.closePanel.emit();
  }

  handlePromptKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    this.submitPrompt();
  }

  submitPrompt(event?: Event): void {
    event?.preventDefault();

    const prompt = this.composeSubmittedPrompt();
    if (!prompt) return;

    this.promptSubmitted.emit(prompt);
    this.draftPrompt = '';
    this.uploadedFiles = [];
  }

  submitQuickPrompt(prompt: string): void {
    this.promptSubmitted.emit(prompt);
    this.draftPrompt = '';
    this.uploadedFiles = [];
  }

  updateDraftPrompt(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    this.draftPrompt = target?.value ?? '';
  }

  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const files = Array.from(input?.files ?? []);
    if (files.length === 0) return;

    const uploadedFiles = files.map((file) => {
      this.uploadedFileCounter += 1;
      return {
        id: `dotz-upload-${this.uploadedFileCounter}`,
        name: file.name,
        type: file.type,
      };
    });

    this.uploadedFiles = [...this.uploadedFiles, ...uploadedFiles];
    if (input) input.value = '';
  }

  isImageFile(file: PmConsoleAgentUploadedFile): boolean {
    return file.type.startsWith('image/') || /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file.name);
  }

  isPdfFile(file: PmConsoleAgentUploadedFile): boolean {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  }

  removeUploadedFile(fileId: string): void {
    this.uploadedFiles = this.uploadedFiles.filter((file) => file.id !== fileId);
  }

  uploadedFileIcon(file: PmConsoleAgentUploadedFile): string {
    if (this.isImageFile(file)) return 'image';
    if (this.isPdfFile(file)) return 'file-text';
    return 'file';
  }

  private composeSubmittedPrompt(): string {
    const prompt = this.draftPrompt.trim();
    const attachmentNames = this.uploadedFiles.map((file) => file.name);

    if (attachmentNames.length === 0) return prompt;

    const attachmentSummary = `Attached files: ${attachmentNames.join(', ')}`;
    return prompt ? `${prompt}\n${attachmentSummary}` : `Review these files.\n${attachmentSummary}`;
  }
}
