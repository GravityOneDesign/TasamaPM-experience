import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';
import {
  PmConsoleAgentMessage,
  PmConsoleAgentMessageAction,
  PmConsoleAgentMessageActionEvent,
} from './pm-console-agent-message.model';

@Component({
  selector: 'app-pm-console-agent-message',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      .agent-message {
        animation: agent-message-enter 220ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        display: flex;
        width: 100%;
      }

      .agent-message.user {
        --message-enter-x: 12px;
        --message-enter-y: 18px;
        justify-content: flex-end;
      }

      .agent-message.assistant {
        --message-enter-x: -8px;
        --message-enter-y: 10px;
        justify-content: flex-start;
      }

      .agent-message-content {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-width: 0;
      }

      .agent-message.user .agent-message-content {
        align-items: flex-end;
        padding-left: 44px;
      }

      .agent-message.assistant .agent-message-content {
        align-items: flex-start;
        padding-right: 44px;
      }

      .agent-message-bubble {
        background: #ffffff;
        border-radius: 10px;
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        max-width: 100%;
        min-height: 36px;
        padding: 9px 12px;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .agent-message.assistant .agent-message-bubble {
        box-shadow: none;
      }

      .agent-message.user .agent-message-bubble {
        background: #f1f3fc;
      }

      .agent-message-actions {
        align-items: center;
        display: flex;
        gap: 4px;
        justify-content: flex-start;
        margin-top: 2px;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
        transform: translateY(-4px);
        transition:
          max-height 180ms ease,
          opacity 160ms ease,
          transform 180ms ease;
      }

      .agent-message.actionable:hover .agent-message-actions,
      .agent-message.actionable:focus-within .agent-message-actions {
        max-height: 32px;
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      .agent-message-action {
        align-items: center;
        border-radius: 8px;
        color: rgba(1, 10, 15, 0.7);
        display: inline-flex;
        height: 32px;
        justify-content: center;
        transition:
          background 150ms ease,
          color 150ms ease,
          transform 150ms ease;
        width: 33px;
      }

      .agent-message-action:hover,
      .agent-message-action:focus-visible {
        background: rgba(1, 10, 15, 0.055);
        color: #0b0b0b;
        outline: 0;
      }

      .agent-message-action .icon {
        height: 16px;
        width: 16px;
      }

      .agent-message-action.like.is-active {
        color: #139b72;
      }

      .agent-message-action.dislike.is-active {
        color: #ef4444;
      }

      .agent-message-action.like.is-active .icon,
      .agent-message-action.dislike.is-active .icon {
        fill: currentColor;
      }

      .agent-message-action.regenerate.is-animating .icon {
        animation: agent-action-regenerate 560ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      .agent-message-action.like.is-animating .icon,
      .agent-message-action.dislike.is-animating .icon {
        animation: agent-action-pop 380ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      .agent-message-action.copy.is-animating .icon {
        animation: agent-action-copy 460ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      .agent-message-action.send.is-animating .icon {
        animation: agent-action-send 480ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      .agent-message-thinking {
        align-items: center;
        display: inline-flex;
        gap: 4px;
        height: 18px;
      }

      .agent-message-thinking span {
        animation: agent-thinking-dot 920ms ease-in-out infinite;
        background: #737789;
        border-radius: 9999px;
        height: 5px;
        opacity: 0.38;
        width: 5px;
      }

      .agent-message-thinking span:nth-child(2) {
        animation-delay: 140ms;
      }

      .agent-message-thinking span:nth-child(3) {
        animation-delay: 280ms;
      }

      .agent-message-text.typing::after {
        animation: agent-typing-cursor 780ms steps(1) infinite;
        content: '';
        display: inline-block;
        height: 14px;
        margin-left: 2px;
        transform: translateY(2px);
        width: 1px;
        background: #727272;
      }

      @keyframes agent-message-enter {
        from {
          opacity: 0;
          transform: translate(var(--message-enter-x), var(--message-enter-y)) scale(0.96);
        }

        to {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
      }

      @keyframes agent-thinking-dot {
        0%,
        70%,
        100% {
          opacity: 0.35;
          transform: translateY(0);
        }

        35% {
          opacity: 1;
          transform: translateY(-3px);
        }
      }

      @keyframes agent-typing-cursor {
        0%,
        45% {
          opacity: 1;
        }

        46%,
        100% {
          opacity: 0;
        }
      }

      @keyframes agent-action-regenerate {
        0% {
          transform: translateX(0) rotate(0deg);
        }

        35% {
          transform: translateX(2px) rotate(115deg);
        }

        100% {
          transform: translateX(0) rotate(360deg);
        }
      }

      @keyframes agent-action-pop {
        0% {
          transform: scale(1);
        }

        45% {
          transform: scale(1.24);
        }

        100% {
          transform: scale(1);
        }
      }

      @keyframes agent-action-copy {
        0% {
          transform: translate(0, 0) scale(1);
        }

        42% {
          transform: translate(2px, -2px) scale(1.12);
        }

        100% {
          transform: translate(0, 0) scale(1);
        }
      }

      @keyframes agent-action-send {
        0% {
          opacity: 1;
          transform: translate(0, 0) rotate(0deg);
        }

        45% {
          opacity: 0.78;
          transform: translate(4px, -4px) rotate(8deg);
        }

        100% {
          opacity: 1;
          transform: translate(0, 0) rotate(0deg);
        }
      }

      @media (max-width: 760px) {
        .agent-message.user .agent-message-content {
          padding-left: 40px;
        }

        .agent-message.assistant .agent-message-content {
          padding-right: 40px;
        }
      }
    `,
  ],
  template: `
    <article
      class="agent-message"
      [class.assistant]="message.author === 'assistant'"
      [class.user]="message.author === 'user'"
      [class.thinking]="message.status === 'thinking'"
      [class.typing]="message.status === 'typing'"
      [class.actionable]="showActions"
    >
      <div class="agent-message-content">
        <p class="agent-message-bubble">
          @if (message.status === 'thinking') {
            <span class="agent-message-thinking" aria-label="DotZ is thinking">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </span>
          } @else {
            <span class="agent-message-text" [class.typing]="message.status === 'typing'">{{ message.content }}</span>
          }
        </p>
        @if (showActions) {
          <div class="agent-message-actions" aria-label="DotZ response actions">
            @for (action of actions; track action) {
              <button
                class="agent-message-action"
                type="button"
                [class.regenerate]="action === 'regenerate'"
                [class.like]="action === 'like'"
                [class.dislike]="action === 'dislike'"
                [class.copy]="action === 'copy'"
                [class.send]="action === 'send'"
                [class.is-active]="isActionActive(action)"
                [class.is-animating]="animatedAction === action"
                [attr.aria-label]="actionLabel(action)"
                [attr.aria-pressed]="action === 'like' || action === 'dislike' ? isActionActive(action) : null"
                (click)="handleAction(action)"
              >
                <span [pmConsoleIcon]="actionIcon(action)" aria-hidden="true"></span>
              </button>
            }
          </div>
        }
      </div>
    </article>
  `,
})
export class PmConsoleAgentMessageComponent implements OnDestroy {
  @Input({ required: true }) message!: PmConsoleAgentMessage;
  @Output() readonly messageAction = new EventEmitter<PmConsoleAgentMessageActionEvent>();

  readonly actions: readonly PmConsoleAgentMessageAction[] = ['regenerate', 'like', 'dislike', 'copy', 'send'];
  animatedAction: PmConsoleAgentMessageAction | null = null;
  copied = false;
  feedback: 'like' | 'dislike' | null = null;

  private actionAnimationTimer?: ReturnType<typeof window.setTimeout>;
  private copiedTimer?: ReturnType<typeof window.setTimeout>;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  get showActions(): boolean {
    return (
      this.message.author === 'assistant' &&
      this.message.status !== 'thinking' &&
      this.message.status !== 'typing' &&
      this.message.content.trim().length > 0
    );
  }

  ngOnDestroy(): void {
    if (this.actionAnimationTimer) window.clearTimeout(this.actionAnimationTimer);
    if (this.copiedTimer) window.clearTimeout(this.copiedTimer);
  }

  actionIcon(action: PmConsoleAgentMessageAction): string {
    if (action === 'regenerate') return 'refresh-cw';
    if (action === 'like') return 'thumbs-up';
    if (action === 'dislike') return 'thumbs-down';
    if (action === 'copy') return this.copied ? 'check' : 'copy';
    return 'send';
  }

  actionLabel(action: PmConsoleAgentMessageAction): string {
    if (action === 'regenerate') return 'Regenerate answer';
    if (action === 'like') return 'Like answer';
    if (action === 'dislike') return 'Dislike answer';
    if (action === 'copy') return this.copied ? 'Copied answer' : 'Copy answer';
    return 'Send conversation to print output';
  }

  handleAction(action: PmConsoleAgentMessageAction): void {
    this.animateAction(action);

    if (action === 'like' || action === 'dislike') {
      this.feedback = action;
    }

    if (action === 'copy') {
      this.showCopiedState();
    }

    this.messageAction.emit({
      action,
      message: this.message,
    });
  }

  isActionActive(action: PmConsoleAgentMessageAction): boolean {
    return (action === 'like' || action === 'dislike') && this.feedback === action;
  }

  private animateAction(action: PmConsoleAgentMessageAction): void {
    if (this.actionAnimationTimer) window.clearTimeout(this.actionAnimationTimer);

    this.animatedAction = action;
    this.actionAnimationTimer = window.setTimeout(() => {
      this.animatedAction = null;
      this.changeDetector.markForCheck();
    }, 620);
  }

  private showCopiedState(): void {
    if (this.copiedTimer) window.clearTimeout(this.copiedTimer);

    this.copied = true;
    this.copiedTimer = window.setTimeout(() => {
      this.copied = false;
      this.changeDetector.markForCheck();
    }, 1100);
  }
}
