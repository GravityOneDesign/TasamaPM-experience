import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PmConsoleAgentResponderService {
  composeReply(prompt: string): string {
    const subject = this.toSubject(prompt);
    return `Got it. I can help with ${subject}. What should we focus on next?`;
  }

  private toSubject(prompt: string): string {
    const normalized = prompt.replace(/\s+/g, ' ').trim();
    if (!normalized) return 'that';

    const clipped = normalized.length > 72 ? `${normalized.slice(0, 69).trim()}...` : normalized;
    return `"${clipped}"`;
  }
}
