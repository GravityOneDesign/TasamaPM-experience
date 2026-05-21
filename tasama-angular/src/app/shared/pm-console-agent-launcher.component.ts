import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PmConsoleAgentOrbComponent } from './pm-console-agent-orb.component';

@Component({
  selector: 'app-pm-console-agent-launcher',
  standalone: true,
  imports: [PmConsoleAgentOrbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }

      .agent-launcher {
        --agent-launcher-size: 96px;
        align-items: center;
        background: transparent;
        border: 0;
        bottom: 22px;
        cursor: pointer;
        display: flex;
        height: var(--agent-launcher-size);
        justify-content: center;
        overflow: visible;
        padding: 0;
        position: fixed;
        right: 24px;
        touch-action: manipulation;
        width: var(--agent-launcher-size);
        z-index: 140;
      }

      .agent-launcher app-pm-console-agent-orb {
        filter: none;
        transition:
          filter var(--motion-fast, 160ms) ease,
          transform var(--motion-fast, 160ms) ease;
      }

      .agent-launcher:hover app-pm-console-agent-orb {
        filter: brightness(1.04) saturate(1.05);
        transform: translateY(-1px) scale(1.035);
      }

      .agent-launcher:focus-visible {
        border-radius: 50%;
        box-shadow:
          0 0 0 3px rgba(255, 255, 255, 0.88),
          0 0 0 6px rgba(82, 126, 255, 0.34);
        outline: 0;
      }

      @media (max-width: 760px) {
        .agent-launcher {
          --agent-launcher-size: 80px;
          bottom: 14px;
          right: 14px;
        }
      }
    `,
  ],
  template: `
    <button
      class="agent-launcher"
      type="button"
      aria-label="Open AI agent"
      (pointerdown)="handleLauncherPointerDown($event)"
      (keydown.enter)="handleLauncherKeydown($event)"
      (keydown.space)="handleLauncherKeydown($event)"
    >
      <app-pm-console-agent-orb [size]="96" />
    </button>
  `,
})
export class PmConsoleAgentLauncherComponent {
  @Output() readonly agentSelected = new EventEmitter<void>();

  handleLauncherPointerDown(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.agentSelected.emit();
  }

  handleLauncherKeydown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.agentSelected.emit();
  }
}
