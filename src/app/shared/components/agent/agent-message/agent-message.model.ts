export type PmConsoleAgentMessageAuthor = 'assistant' | 'user';
export type PmConsoleAgentMessageAction = 'regenerate' | 'like' | 'dislike' | 'copy' | 'send';
export type PmConsoleAgentMessageStatus = 'complete' | 'thinking' | 'typing';

export interface PmConsoleAgentMessage {
  readonly id: string;
  readonly author: PmConsoleAgentMessageAuthor;
  readonly content: string;
  readonly status?: PmConsoleAgentMessageStatus;
}

export interface PmConsoleAgentMessageActionEvent {
  readonly action: PmConsoleAgentMessageAction;
  readonly message: PmConsoleAgentMessage;
}
