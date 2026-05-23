import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExecutiveInsightCard } from '../../data/dashboard.data';

@Component({
  selector: 'app-executive-insight-card',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="executive-card-grid" [ngClass]="'executive-card-grid--' + card.id" aria-hidden="true"></span>
    @for (layer of card.illustrationLayers; track layer.id) {
      <img
        class="executive-insight-illustration"
        [ngClass]="'executive-insight-illustration--' + layer.id"
        [src]="layer.src"
        alt=""
        aria-hidden="true"
      />
    }
    <h2 [ngClass]="'executive-insight-title executive-insight-title--' + card.id">{{ card.title }}</h2>

    @if (card.statusLabel) {
      <div class="executive-status-pill">
        <span>{{ card.statusLabel }}</span>
      </div>
    }

    @if (card.budgetSummary; as budget) {
      <section class="executive-budget-panel" aria-label="Budget summary">
        <p>{{ budget.label }}</p>
        <div class="executive-budget-bars" aria-hidden="true">
          @for (bar of budgetBars; track $index) {
            <span></span>
          }
        </div>
        <div class="executive-budget-values">
          <div>
            <strong>{{ budget.actual }}</strong>
            <span>/ {{ budget.planned }}</span>
          </div>
          <div>
            <strong>{{ budget.percentage }}</strong>
            <span>{{ budget.usageLabel }}</span>
          </div>
        </div>
      </section>
    }
  `,
  styles: [
    `
      :host {
        border-radius: 30px;
        display: block;
        height: 100%;
        overflow: hidden;
        position: relative;
        width: 100%;
      }

      :host::before {
        background:
          radial-gradient(circle at 38% 39%, rgba(22, 126, 255, 0.84) 0%, rgba(22, 126, 255, 0.34) 34%, rgba(22, 126, 255, 0) 68%),
          linear-gradient(180deg, rgba(11, 11, 11, 0) 0%, rgba(11, 11, 11, 0.12) 38%, rgba(76, 234, 245, 0.3) 156%);
        border-radius: inherit;
        content: '';
        inset: 0;
        mask-image: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.08) 15%, rgba(0, 0, 0, 0.82) 45%, #000000 100%);
        mix-blend-mode: screen;
        opacity: 0.72;
        position: absolute;
      }

      .executive-insight-illustration {
        display: block;
        pointer-events: none;
        position: absolute;
        transform: translate3d(0, 0, 0);
        transform-origin: 50% 58%;
        user-select: none;
        will-change: transform;
        z-index: 2;
      }

      .executive-card-grid {
        background-image:
          linear-gradient(30deg, transparent 49.4%, rgba(96, 204, 255, 0.3) 50%, transparent 50.6%),
          linear-gradient(150deg, transparent 49.4%, rgba(96, 204, 255, 0.3) 50%, transparent 50.6%);
        background-size: 112px 64px;
        inset: 44px -54px 168px -54px;
        mix-blend-mode: screen;
        opacity: 0.42;
        pointer-events: none;
        position: absolute;
        z-index: 1;
      }

      .executive-card-grid--budget {
        display: none;
      }

      .executive-card-grid--portfolio {
        display: none;
      }

      .executive-insight-illustration--portfolio-performing {
        animation: executivePortfolioIllustrationDrift 7600ms ease-in-out infinite;
        height: 576px;
        left: -197px;
        mix-blend-mode: screen;
        top: -26px;
        width: 790px;
      }

      .executive-insight-illustration--budget-tracking {
        animation: executiveBudgetIllustrationDrift 8200ms ease-in-out infinite;
        height: 600px;
        left: -175px;
        top: 74px;
        width: 668px;
      }

      .executive-insight-title {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        position: absolute;
        text-align: center;
        z-index: 3;
      }

      .executive-insight-title--portfolio {
        left: 31px;
        top: 360px;
        width: 360px;
      }

      .executive-insight-title--budget {
        left: 24px;
        top: 489px;
        width: 374px;
      }

      .executive-status-pill {
        align-items: center;
        animation: executiveStatusPillFlow 3600ms ease-in-out infinite;
        background: linear-gradient(
          110deg,
          rgba(36, 177, 93, 0.18) 0%,
          rgba(44, 203, 111, 0.58) 34%,
          rgba(139, 238, 149, 0.66) 50%,
          rgba(33, 166, 94, 0.54) 66%,
          rgba(36, 177, 93, 0.18) 100%
        );
        background-size: 220% 100%;
        border-radius: 24px;
        box-shadow:
          inset 0 4px 4px rgba(11, 11, 11, 0.13),
          0 12px 28px rgba(20, 154, 87, 0.16);
        color: #ffffff;
        display: flex;
        height: 59px;
        justify-content: center;
        left: 38px;
        padding: 0 24px;
        position: absolute;
        top: 426px;
        will-change: background-position;
        width: 360px;
        z-index: 3;
      }

      .executive-status-pill span {
        font-size: 16px;
        font-weight: 600;
        line-height: 34px;
        white-space: nowrap;
      }

      .executive-budget-panel {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 15px;
        color: #ffffff;
        height: 145px;
        left: 24px;
        padding: 14px 16px;
        position: absolute;
        top: 525px;
        width: 359px;
        z-index: 3;
      }

      .executive-budget-panel p {
        font-size: 13px;
        font-weight: 400;
        line-height: 24px;
      }

      .executive-budget-bars {
        bottom: 22px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        left: 16px;
        position: absolute;
        width: 54px;
      }

      .executive-budget-bars span {
        background: rgba(255, 255, 255, 0.11);
        display: block;
        height: 4px;
        width: 54px;
      }

      .executive-budget-bars span:nth-last-child(-n + 4) {
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.13));
      }

      .executive-budget-values {
        display: grid;
        gap: 6px;
        left: 97px;
        position: absolute;
        top: 47px;
      }

      .executive-budget-values div {
        align-items: baseline;
        display: flex;
        gap: 6px;
        white-space: nowrap;
      }

      .executive-budget-values strong {
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
        line-height: 43px;
      }

      .executive-budget-values span {
        color: rgba(255, 255, 255, 0.74);
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
      }

      @keyframes executivePortfolioIllustrationDrift {
        0%,
        100% {
          transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
        }

        34% {
          transform: translate3d(4px, -8px, 0) rotate(0.35deg) scale(1.004);
        }

        68% {
          transform: translate3d(-5px, 5px, 0) rotate(-0.28deg) scale(0.998);
        }
      }

      @keyframes executiveBudgetIllustrationDrift {
        0%,
        100% {
          transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
        }

        38% {
          transform: translate3d(-5px, -7px, 0) rotate(-0.32deg) scale(1.003);
        }

        72% {
          transform: translate3d(5px, 6px, 0) rotate(0.28deg) scale(0.998);
        }
      }

      @keyframes executiveStatusPillFlow {
        0%,
        100% {
          background-position: 0% 50%;
        }

        50% {
          background-position: 100% 50%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .executive-insight-illustration,
        .executive-status-pill {
          animation: none;
        }

        .executive-insight-illustration {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
  ],
})
export class ExecutiveInsightCardComponent {
  @Input({ required: true }) card!: ExecutiveInsightCard;

  readonly budgetBars = Array.from({ length: 10 });
}

