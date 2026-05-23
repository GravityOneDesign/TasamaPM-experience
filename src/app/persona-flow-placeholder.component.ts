import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonaFlowOption } from './persona-flow.config';

@Component({
  selector: 'app-persona-flow-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="persona-flow-shell" [attr.aria-label]="persona.instanceTitle">
      <section class="persona-flow-panel">
        <div class="persona-flow-kicker">Tasama workspace</div>
        <h1>{{ persona.instanceTitle }}</h1>
        <p>{{ persona.label }} flow is ready for its branch-specific build.</p>
        <div class="persona-flow-status">
          <span>Access granted</span>
          <strong>{{ persona.label }}</strong>
        </div>
        <button class="persona-flow-back" type="button" (click)="backToLogin.emit()">Back to login</button>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .persona-flow-shell {
        align-items: center;
        background:
          linear-gradient(135deg, rgba(16, 6, 159, 0.94), rgba(23, 63, 53, 0.88)),
          url('../assets/login-hero.jpg') center/cover;
        color: #ffffff;
        display: flex;
        min-height: 100vh;
        padding: 48px;
      }

      .persona-flow-panel {
        display: flex;
        flex-direction: column;
        gap: 18px;
        max-width: 560px;
      }

      .persona-flow-kicker {
        color: #addc91;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 16px;
        text-transform: uppercase;
      }

      .persona-flow-panel h1 {
        font-size: clamp(32px, 5vw, 56px);
        font-weight: 600;
        line-height: 1.04;
      }

      .persona-flow-panel p {
        color: rgba(255, 255, 255, 0.82);
        font-size: 16px;
        line-height: 24px;
        max-width: 430px;
      }

      .persona-flow-status {
        align-items: center;
        border-top: 1px solid rgba(255, 255, 255, 0.24);
        display: flex;
        gap: 14px;
        margin-top: 10px;
        padding-top: 18px;
      }

      .persona-flow-status span {
        color: rgba(255, 255, 255, 0.68);
        font-size: 12px;
        line-height: 16px;
      }

      .persona-flow-status strong {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
      }

      .persona-flow-back {
        align-items: center;
        background: #ffffff;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        font-size: 13px;
        font-weight: 600;
        height: 40px;
        justify-content: center;
        margin-top: 14px;
        padding: 0 20px;
        width: fit-content;
      }

      .persona-flow-back:focus-visible {
        outline: 3px solid rgba(173, 220, 145, 0.6);
        outline-offset: 3px;
      }

      @media (max-width: 760px) {
        .persona-flow-shell {
          padding: 28px;
        }
      }
    `,
  ],
})
export class PersonaFlowPlaceholderComponent {
  @Input({ required: true }) persona!: PersonaFlowOption;
  @Output() readonly backToLogin = new EventEmitter<void>();
}
