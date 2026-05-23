import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { PmConsoleAgentMessageComponent } from './pm-console-agent-message.component';
import { PmConsoleAgentMessage, PmConsoleAgentMessageActionEvent } from './pm-console-agent-message.model';

@Component({
  selector: 'app-pm-console-agent-conversation',
  standalone: true,
  imports: [PmConsoleAgentMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-height: 0;
      }

      .agent-conversation {
        display: flex;
        flex-direction: column;
        gap: 14px;
        height: 100%;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 12px 132px;
        scrollbar-width: thin;
      }

      .agent-conversation::-webkit-scrollbar {
        width: 8px;
      }

      .agent-conversation::-webkit-scrollbar-thumb {
        background: rgba(1, 10, 15, 0.16);
        border-radius: 9999px;
      }

      @media (max-width: 760px) {
        .agent-conversation {
          padding: 18px 12px 144px;
        }
      }
    `,
  ],
  template: `
    <section #conversationPanel class="agent-conversation" aria-label="DotZ conversation">
      @for (message of messages; track message.id) {
        <app-pm-console-agent-message [message]="message" (messageAction)="messageAction.emit($event)" />
      }
    </section>
  `,
})
export class PmConsoleAgentConversationComponent implements OnChanges {
  @Input() messages: readonly PmConsoleAgentMessage[] = [];
  @Output() readonly messageAction = new EventEmitter<PmConsoleAgentMessageActionEvent>();
  @ViewChild('conversationPanel') private conversationPanel?: ElementRef<HTMLElement>;

  ngOnChanges(): void {
    queueMicrotask(() => this.scrollToLatestMessage());
  }

  private scrollToLatestMessage(): void {
    const panel = this.conversationPanel?.nativeElement;
    if (!panel) return;

    panel.scrollTo({
      behavior: 'smooth',
      top: panel.scrollHeight,
    });
  }
}
