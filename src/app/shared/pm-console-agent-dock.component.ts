import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { PmConsoleAgentLauncherComponent } from './pm-console-agent-launcher.component';
import { PmConsoleAgentMessage, PmConsoleAgentMessageActionEvent } from './pm-console-agent-message.model';
import { PmConsoleAgentPanelComponent } from './pm-console-agent-panel.component';
import { PmConsoleAgentResponderService } from './pm-console-agent-responder.service';

@Component({
  selector: 'app-pm-console-agent-dock',
  standalone: true,
  imports: [PmConsoleAgentLauncherComponent, PmConsoleAgentPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-console-agent-panel
      [open]="agentPanelOpen"
      [messages]="agentMessages"
      (closePanel)="closeAgentPanel()"
      (messageAction)="handleMessageAction($event)"
      (promptSubmitted)="submitPrompt($event)"
    />
    <app-pm-console-agent-launcher (agentSelected)="toggleAgentPanel()" />
  `,
})
export class PmConsoleAgentDockComponent implements OnDestroy {
  agentPanelOpen = false;
  agentMessages: readonly PmConsoleAgentMessage[] = [];

  private messageCounter = 0;
  private readonly responseTimers = new Set<ReturnType<typeof window.setTimeout>>();
  private readonly typingTimers = new Set<ReturnType<typeof window.setInterval>>();

  constructor(
    private readonly agentResponder: PmConsoleAgentResponderService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  toggleAgentPanel(): void {
    this.agentPanelOpen = !this.agentPanelOpen;
    this.changeDetector.markForCheck();
  }

  closeAgentPanel(): void {
    if (!this.agentPanelOpen) return;
    this.agentPanelOpen = false;
    this.changeDetector.markForCheck();
  }

  ngOnDestroy(): void {
    for (const timer of this.responseTimers) {
      window.clearTimeout(timer);
    }

    for (const timer of this.typingTimers) {
      window.clearInterval(timer);
    }

    this.responseTimers.clear();
    this.typingTimers.clear();
  }

  submitPrompt(prompt: string): void {
    const userMessage = this.createMessage('user', prompt);
    const thinkingMessage = this.createMessage('assistant', '', 'thinking');
    const replyContent = this.agentResponder.composeReply(prompt);

    this.agentMessages = [...this.agentMessages, userMessage];
    this.changeDetector.markForCheck();

    const thinkingTimer = window.setTimeout(() => {
      this.responseTimers.delete(thinkingTimer);
      this.agentMessages = [...this.agentMessages, thinkingMessage];
      this.changeDetector.markForCheck();
    }, 240);

    const typingTimer = window.setTimeout(() => {
      this.responseTimers.delete(typingTimer);
      this.typeReply(thinkingMessage.id, replyContent);
    }, 920);

    this.responseTimers.add(thinkingTimer);
    this.responseTimers.add(typingTimer);
  }

  handleMessageAction(event: PmConsoleAgentMessageActionEvent): void {
    if (event.action === 'regenerate') {
      this.regenerateMessage(event.message);
      return;
    }

    if (event.action === 'copy') {
      void this.copyMessageText(event.message.content);
      return;
    }

    if (event.action === 'send') {
      this.openConversationPrintOutput();
    }
  }

  private regenerateMessage(message: PmConsoleAgentMessage): void {
    const sourcePrompt = this.findPromptBeforeMessage(message.id);
    const replyContent = this.agentResponder.composeReply(sourcePrompt || message.content);

    this.updateMessage(message.id, {
      content: '',
      status: 'thinking',
    });

    const timer = window.setTimeout(() => {
      this.responseTimers.delete(timer);
      this.typeReply(message.id, replyContent);
    }, 620);

    this.responseTimers.add(timer);
  }

  private typeReply(messageId: string, content: string): void {
    let cursor = 0;
    this.updateMessage(messageId, { content: '', status: 'typing' });

    const timer = window.setInterval(() => {
      cursor = Math.min(content.length, cursor + 2);
      this.updateMessage(messageId, {
        content: content.slice(0, cursor),
        status: cursor >= content.length ? 'complete' : 'typing',
      });

      if (cursor < content.length) return;

      this.typingTimers.delete(timer);
      window.clearInterval(timer);
    }, 18);

    this.typingTimers.add(timer);
  }

  private findPromptBeforeMessage(messageId: string): string {
    const messageIndex = this.agentMessages.findIndex((message) => message.id === messageId);
    if (messageIndex < 0) return '';

    for (let index = messageIndex - 1; index >= 0; index -= 1) {
      const message = this.agentMessages[index];
      if (message.author === 'user' && message.content.trim()) return message.content;
    }

    return '';
  }

  private async copyMessageText(content: string): Promise<void> {
    const normalizedContent = content.trim();
    if (!normalizedContent || !navigator.clipboard) return;

    await navigator.clipboard.writeText(normalizedContent).catch(() => undefined);
  }

  private openConversationPrintOutput(): void {
    const printableMessages = this.agentMessages.filter((message) => message.status !== 'thinking' && message.content.trim());
    if (printableMessages.length === 0) return;

    const printWindow = window.open('', '_blank', 'width=720,height=900');
    const printedAt = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
    const transcript = printableMessages
      .map(
        (message) => `
          <article class="message ${message.author}">
            <span>${message.author === 'user' ? 'You' : 'DotZ'}</span>
            <p>${this.escapeHtml(message.content)}</p>
          </article>
        `,
      )
      .join('');

    const html = `
      <!doctype html>
      <html>
        <head>
          <title>DotZ Conversation</title>
          <style>
            * { box-sizing: border-box; }
            body {
              color: #0b0b0b;
              font-family: Inter, Arial, sans-serif;
              margin: 0;
              padding: 28px;
            }
            header {
              border-bottom: 1px solid #e6e6e6;
              margin-bottom: 20px;
              padding-bottom: 14px;
            }
            h1 {
              font-size: 20px;
              line-height: 28px;
              margin: 0 0 4px;
            }
            small {
              color: #727272;
              font-size: 12px;
            }
            .conversation {
              display: grid;
              gap: 12px;
            }
            .message {
              border-radius: 10px;
              max-width: 86%;
              padding: 10px 12px;
            }
            .message.user {
              background: #f1f3fc;
              justify-self: end;
            }
            .message.assistant {
              background: #ffffff;
              justify-self: start;
            }
            .message span {
              color: #727272;
              display: block;
              font-size: 11px;
              margin-bottom: 4px;
            }
            .message p {
              font-size: 13px;
              line-height: 18px;
              margin: 0;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>DotZ Conversation</h1>
            <small>Printed ${this.escapeHtml(printedAt)}</small>
          </header>
          <main class="conversation">${transcript}</main>
        </body>
      </html>
    `;

    if (!printWindow) {
      console.log(`DotZ Conversation\n${printableMessages.map((message) => `${message.author}: ${message.content}`).join('\n')}`);
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 160);
  }

  private updateMessage(messageId: string, patch: Partial<PmConsoleAgentMessage>): void {
    this.agentMessages = this.agentMessages.map((message) =>
      message.id === messageId
        ? {
            ...message,
            ...patch,
          }
        : message,
    );
    this.changeDetector.markForCheck();
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private createMessage(
    author: PmConsoleAgentMessage['author'],
    content: string,
    status: PmConsoleAgentMessage['status'] = 'complete',
  ): PmConsoleAgentMessage {
    this.messageCounter += 1;
    return {
      id: `dotz-message-${this.messageCounter}`,
      author,
      content,
      status,
    };
  }
}
