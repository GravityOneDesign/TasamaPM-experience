import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface PmConsoleFrontdoorAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeLabel?: string;
  ctaLabel?: string;
  disabled?: boolean;
  decor?: 'waves' | 'loops' | 'hex' | 'plus' | 'burst';
}

export type PmConsoleFrontdoorActionCtaMode = 'label' | 'arrow';

@Component({
  selector: 'app-pm-console-frontdoor-action-cards',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .frontdoor-action-grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(var(--frontdoor-action-columns, 5), minmax(185px, 1fr));
        justify-content: start;
        margin: 0 -18px -24px;
        min-width: 0;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0 18px 28px;
        scrollbar-width: thin;
        width: calc(100% + 36px);
      }

      .frontdoor-action-grid.without-edge-bleed {
        margin: 0;
        padding: 0 0 2px;
        width: 100%;
      }

      .frontdoor-action-card {
        appearance: none;
        background:
          radial-gradient(170px 128px at 0% 100%, rgba(237, 234, 255, 0.82) 0%, rgba(246, 244, 255, 0.52) 42%, rgba(255, 255, 255, 0) 76%),
          linear-gradient(180deg, #ffffff 0%, #ffffff 48%, #f8f6ff 78%, #f2f0fb 100%),
          #ffffff;
        border: 0;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(11, 11, 11, 0.05);
        box-sizing: border-box;
        color: inherit;
        contain: paint;
        cursor: pointer;
        display: grid;
        font-family: "Montserrat", system-ui, sans-serif;
        gap: 12px;
        grid-template-rows: 40px auto minmax(0, 1fr) 24px;
        height: 264px;
        min-height: 264px;
        overflow: hidden;
        padding: 12px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .frontdoor-action-card:disabled {
        cursor: default;
        opacity: 1;
      }

      .frontdoor-action-card::before {
        border-radius: inherit;
        box-shadow:
          inset 0 0 0 1px rgba(214, 216, 223, 0.72),
          inset 0 0 0 4px #ffffff;
        content: "";
        inset: 0;
        pointer-events: none;
        position: absolute;
        z-index: 2;
      }

      .frontdoor-action-card::after {
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        content: "";
        opacity: 0.95;
        pointer-events: none;
        position: absolute;
        z-index: 0;
      }

      .frontdoor-action-card.decor-waves::after {
        background-image: url("../../assets/frontdoor-actions/waves.png");
        clip-path: inset(0 0 18px 0);
        height: 88px;
        left: 4px;
        opacity: 0.56;
        top: 190px;
        width: 88px;
      }

      .frontdoor-action-card.decor-loops::after {
        background-image: url("../../assets/frontdoor-actions/loops.png");
        clip-path: inset(0 0 18px 0);
        height: 88px;
        left: 4px;
        opacity: 0.56;
        top: 190px;
        width: 88px;
      }

      .frontdoor-action-card.decor-hex::after {
        background-image: url("../../assets/frontdoor-actions/hex.png");
        height: 88px;
        left: -17px;
        top: 194px;
        width: 88px;
      }

      .frontdoor-action-card.decor-plus::after {
        background-image: url("../../assets/frontdoor-actions/plus.png");
        height: 90px;
        left: -8px;
        top: 197px;
        width: 88px;
      }

      .frontdoor-action-card.decor-burst::after {
        background-image: url("../../assets/frontdoor-actions/burst.png");
        height: 90px;
        left: -14px;
        top: 193px;
        width: 88px;
      }

      .frontdoor-action-icon {
        align-items: center;
        background:
          linear-gradient(rgba(16, 6, 159, 0.03), rgba(16, 6, 159, 0.03)),
          #ffffff;
        border: 0;
        border-radius: 8px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.12);
        color: #10069f;
        display: inline-flex;
        grid-row: 1;
        height: 40px;
        justify-content: center;
        position: relative;
        width: 40px;
        z-index: 1;
      }

      .frontdoor-action-icon .icon {
        height: 22px;
        width: 22px;
      }

      .frontdoor-action-icon .icon svg,
      .frontdoor-action-icon .icon i {
        height: 22px;
        width: 22px;
      }

      .frontdoor-action-copy {
        display: grid;
        gap: 4px;
        grid-row: 2;
        margin-top: 0;
        min-width: 0;
        position: relative;
        width: min(100%, 161px);
        z-index: 1;
      }

      .frontdoor-action-title {
        color: #0b0b0b;
        display: block;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        margin: 0;
      }

      .frontdoor-action-description {
        color: #2f2f2f;
        display: block;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        margin: 0;
      }

      .frontdoor-action-button {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        grid-row: 4;
        height: 24px;
        justify-content: center;
        justify-self: end;
        line-height: 16px;
        min-height: 0;
        position: relative;
        z-index: 1;
      }

      .frontdoor-action-button.has-badge {
        height: 24px;
        justify-self: start;
      }

      .frontdoor-action-button.is-arrow-only {
        height: 24px;
      }

      .frontdoor-action-card:disabled .frontdoor-action-button.is-arrow-only {
        color: rgba(16, 6, 159, 0.32);
      }

      .frontdoor-action-badge {
        align-items: center;
        backdrop-filter: blur(2px);
        background: rgba(52, 38, 247, 0.11);
        border-radius: 8px;
        color: #535353;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        justify-content: center;
        line-height: 16px;
        padding: 4px 8px;
        white-space: nowrap;
      }

      .frontdoor-action-card:not(:disabled):hover,
      .frontdoor-action-card:not(:disabled):focus-visible {
        box-shadow: 0 8px 18px rgba(1, 10, 15, 0.14);
        outline: 0;
      }

      .frontdoor-action-card:not(:disabled):hover::before,
      .frontdoor-action-card:not(:disabled):focus-visible::before {
        box-shadow:
          inset 0 0 0 1px rgba(198, 202, 214, 0.82),
          inset 0 0 0 4px #ffffff;
      }

      .frontdoor-action-card:focus-visible {
        border-radius: 12px;
        outline: 2px solid rgba(16, 6, 159, 0.16);
        outline-offset: 2px;
      }

      .frontdoor-action-button .icon {
        height: 24px;
        width: 24px;
      }

      @media (max-width: 1180px) {
        .frontdoor-action-grid {
          grid-template-columns: repeat(var(--frontdoor-action-columns, 5), minmax(185px, 1fr));
        }
      }

      @media (max-width: 780px) {
        .frontdoor-action-grid {
          grid-template-columns: repeat(var(--frontdoor-action-columns, 5), minmax(185px, 1fr));
        }
      }

      @media (max-width: 540px) {
        .frontdoor-action-grid,
        .frontdoor-action-grid.without-edge-bleed {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
  template: `
    <section class="frontdoor-action-grid" [class.without-edge-bleed]="!edgeBleed" [style.--frontdoor-action-columns]="columnCount" [attr.aria-label]="ariaLabel">
      @for (action of actions; track action.id) {
        <button
          class="frontdoor-action-card decor-{{ action.decor || 'waves' }}"
          type="button"
          [disabled]="action.disabled"
          [attr.aria-disabled]="action.disabled ? 'true' : null"
          [attr.aria-label]="cardAriaLabel(action)"
          (click)="selectAction(action)"
        >
          <span class="frontdoor-action-icon" aria-hidden="true">
            <span [pmConsoleIcon]="action.icon"></span>
          </span>
          <span class="frontdoor-action-copy">
            <span class="frontdoor-action-title">{{ action.title }}</span>
            <span class="frontdoor-action-description">{{ action.description }}</span>
          </span>
          <span
            class="frontdoor-action-button"
            [class.has-label]="action.ctaLabel && ctaMode === 'label'"
            [class.has-badge]="action.badgeLabel"
            [class.is-arrow-only]="ctaMode === 'arrow'"
            aria-hidden="true"
          >
            @if (action.badgeLabel) {
              <span class="frontdoor-action-badge">{{ action.badgeLabel }}</span>
            } @else if (ctaMode === 'arrow' && !action.disabled) {
              <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
            } @else if (action.ctaLabel) {
              <span>{{ action.ctaLabel }}</span>
            } @else if (!action.disabled) {
              <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
            }
          </span>
        </button>
      }
    </section>
  `,
})
export class PmConsoleFrontdoorActionCardsComponent {
  @Input() actions: readonly PmConsoleFrontdoorAction[] = [];
  @Input() ariaLabel = 'Project actions';
  @Input() projectName = '';
  @Input() edgeBleed = true;
  @Input() ctaMode: PmConsoleFrontdoorActionCtaMode = 'label';
  @Input() columnCount = 5;

  @Output() readonly actionSelected = new EventEmitter<string>();

  selectAction(action: PmConsoleFrontdoorAction): void {
    if (action.disabled) return;
    this.actionSelected.emit(action.id);
  }

  cardAriaLabel(action: PmConsoleFrontdoorAction): string {
    const scope = this.projectName ? ` for ${this.projectName}` : '';
    const status = action.badgeLabel ? `, ${action.badgeLabel}` : '';
    return `${action.title}${scope}${status}`;
  }
}
