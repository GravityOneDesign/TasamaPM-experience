import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PmConsoleFrontdoorActionCardsComponent,
  type PmConsoleFrontdoorAction,
} from '../frontdoor-action-cards/frontdoor-action-cards.component';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pm-console-portfolio-manager-frontdoor-overview',
  standalone: true,
  imports: [PmConsoleFrontdoorActionCardsComponent, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .portfolio-frontdoor-overview {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .portfolio-frontdoor-hero {
        border-radius: 12px;
        color: #ffffff;
        display: grid;
        min-height: 240px;
        overflow: hidden;
        padding: 16px;
        position: relative;
      }

      .portfolio-frontdoor-hero-image,
      .portfolio-frontdoor-hero::before,
      .portfolio-frontdoor-hero::after {
        inset: 0;
        position: absolute;
      }

      .portfolio-frontdoor-hero-image {
        height: 100%;
        object-fit: cover;
        width: 100%;
        z-index: 0;
      }

      .portfolio-frontdoor-hero::before {
        background:
          linear-gradient(180deg, rgba(11, 11, 11, 0.08) 0%, rgba(11, 11, 11, 0.72) 100%),
          linear-gradient(90deg, rgba(8, 45, 49, 0.72) 0%, rgba(9, 38, 47, 0.42) 52%, rgba(8, 45, 49, 0.18) 100%);
        content: '';
        z-index: 1;
      }

      .portfolio-frontdoor-hero::after {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 42%);
        content: '';
        pointer-events: none;
        z-index: 2;
      }

      .portfolio-frontdoor-hero-content {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        min-height: 208px;
        position: relative;
        z-index: 3;
      }

      .portfolio-frontdoor-hero-top {
        align-items: flex-start;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-width: 0;
      }

      .portfolio-frontdoor-title {
        align-items: center;
        display: inline-flex;
        gap: 12px;
        min-width: 0;
      }

      .portfolio-frontdoor-title-icon {
        align-items: center;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 8px;
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 auto;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .portfolio-frontdoor-title h2 {
        color: #ffffff;
        font-size: 24px;
        font-weight: 500;
        line-height: 1.2;
        margin: 0;
        min-width: 0;
      }

      .portfolio-frontdoor-pills {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .portfolio-frontdoor-pill {
        align-items: center;
        background: rgba(47, 47, 47, 0.42);
        border-radius: 7px;
        color: #ffffff;
        display: inline-flex;
        font-size: 13px;
        font-weight: 500;
        gap: 8px;
        line-height: 18px;
        min-height: 24px;
        padding: 3px 10px;
        white-space: nowrap;
      }

      .portfolio-frontdoor-pill.status {
        background: rgba(135, 190, 120, 0.72);
      }

      .portfolio-frontdoor-pill-dot {
        background: #9dd66e;
        border-radius: 999px;
        height: 7px;
        width: 7px;
      }

      .portfolio-frontdoor-hero-bottom {
        align-items: end;
        display: flex;
        justify-content: flex-end;
      }

      .portfolio-frontdoor-cta {
        align-items: center;
        background: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 999px;
        color: #0b0b0b;
        display: inline-flex;
        font-size: 13px;
        font-weight: 500;
        gap: 12px;
        height: 42px;
        justify-content: center;
        line-height: 18px;
        padding: 4px 5px 4px 16px;
        white-space: nowrap;
      }

      .portfolio-frontdoor-cta .icon {
        align-items: center;
        background: #a8dc83;
        border-radius: 999px;
        color: #0b0b0b;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      .portfolio-action-heading {
        display: grid;
        gap: 4px;
      }

      .portfolio-action-heading h2 {
        color: #0b0b0b;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .portfolio-action-heading p {
        color: #404040;
        font-size: 13px;
        line-height: 18px;
        margin: 0;
      }

      @media (max-width: 780px) {
        .portfolio-frontdoor-title h2 {
          font-size: 22px;
        }

        .portfolio-frontdoor-hero-top {
          align-items: start;
          flex-direction: column;
        }

        .portfolio-frontdoor-pills {
          justify-content: flex-start;
        }
      }
    `,
  ],
  template: `
    <section class="portfolio-frontdoor-overview" [attr.aria-label]="portfolioName + ' overview'">
      <article class="portfolio-frontdoor-hero">
        <img class="portfolio-frontdoor-hero-image" [src]="heroImageSrc" alt="" aria-hidden="true" />
        <div class="portfolio-frontdoor-hero-content">
          <div class="portfolio-frontdoor-hero-top">
            <div class="portfolio-frontdoor-title">
              <span class="portfolio-frontdoor-title-icon" aria-hidden="true">
                <span pmConsoleIcon="folder"></span>
              </span>
              <h2>{{ portfolioName }}</h2>
            </div>
            <div class="portfolio-frontdoor-pills" aria-label="Portfolio status">
              <span class="portfolio-frontdoor-pill">Portfolio overview</span>
              <span class="portfolio-frontdoor-pill status">
                <i class="portfolio-frontdoor-pill-dot" aria-hidden="true"></i>
                {{ statusLabel }}
              </span>
            </div>
          </div>

          <div aria-hidden="true"></div>

          <div class="portfolio-frontdoor-hero-bottom">
            <button class="portfolio-frontdoor-cta" type="button" (click)="portfolioOpen.emit()">
              <span>Go to Portfolio Workspace</span>
              <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </article>

      <div class="portfolio-action-heading">
        <h2>Run your portfolio, end to end</h2>
        <p>Navigate every key area of your portfolio, all in one place.</p>
      </div>

      <app-pm-console-frontdoor-action-cards
        ariaLabel="Portfolio manager actions"
        [actions]="actions"
        (actionSelected)="actionSelected.emit($event)"
      ></app-pm-console-frontdoor-action-cards>
    </section>
  `,
})
export class PmConsolePortfolioManagerFrontdoorOverviewComponent {
  @Input() portfolioName = 'Portfolio Name';
  @Input() heroImageSrc = './assets/card-visual-2.jpg';
  @Input() statusLabel = 'On Track';
  @Input() actions: readonly PmConsoleFrontdoorAction[] = [];

  @Output() readonly portfolioOpen = new EventEmitter<void>();
  @Output() readonly actionSelected = new EventEmitter<string>();
}
