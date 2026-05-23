import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { ExecutiveBulletinItemComponent } from '../../components/bulletin-item/bulletin-item.component';
import {
  executiveBulletins,
  executiveInsightCards,
  executiveScopeMetrics,
} from '../../data/dashboard.data';
import { ExecutiveInsightsPageComponent } from '../insights/insights-page.component';
import { ExecutiveInsightCardComponent } from '../../components/insight-card/insight-card.component';
import { ExecutiveStatCardComponent } from '../../components/stat-card/stat-card.component';

const EXECUTIVE_STAGE_WIDTH = 1440;
const EXECUTIVE_STAGE_HEIGHT = 810;
const EXECUTIVE_INSIGHTS_TRANSITION_MS = 420;

@Component({
  selector: 'app-executive-dashboard',
  standalone: true,
  imports: [
    ExecutiveBulletinItemComponent,
    ExecutiveInsightCardComponent,
    ExecutiveInsightsPageComponent,
    ExecutiveStatCardComponent,
    PmConsoleIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (activeView === 'insights') {
      <app-executive-insights-page (homeSelected)="returnToFrontDoor()" />
    } @else {
    <main
      class="executive-dashboard"
      [class.executive-dashboard--opening]="insightsTransitionActive"
      [attr.aria-busy]="insightsTransitionActive"
      aria-label="Executive insights dashboard"
    >
      <div class="executive-stage">
        <img class="executive-logo" src="assets/executive/tasama-logo-white.svg" alt="Tasama Business Services" />

        <button class="executive-cta" type="button" [disabled]="insightsTransitionActive" (click)="openInsights()">
          <span>Start Exploring Executive Insights</span>
          <span class="executive-cta-icon" aria-hidden="true">
            <span class="executive-cta-glyph" [pmConsoleIcon]="'chevron-right'"></span>
          </span>
        </button>

        <section class="executive-scope" aria-label="Portfolio scope">
          <p>Portfolio Scope</p>
          <div class="executive-scope-grid">
            @for (metric of scopeMetrics; track metric.label) {
              <app-executive-stat-card [metric]="metric" />
            }
          </div>
        </section>

        <section class="executive-bulletin" aria-label="AI bulletin">
          <p>AI Bulletin</p>
          <div class="executive-bulletin-list">
            @for (bulletin of bulletins; track $index) {
              <app-executive-bulletin-item [bulletin]="bulletin" [carouselIndex]="$index" />
            }
          </div>
          <div class="executive-bulletin-dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </section>

        @for (card of insightCards; track card.id) {
          <section class="executive-card-shell" [class.executive-card-shell--budget]="card.id === 'budget'">
            <app-executive-insight-card [card]="card" />
          </section>
        }
      </div>

      @if (insightsTransitionActive) {
        <div class="executive-transition-veil" aria-hidden="true"></div>
      }
    </main>
    }
  `,
  styles: [
    `
      :host {
        --executive-scale: 1;
        display: block;
        height: 100%;
      }

      @property --executive-cta-stroke-angle {
        syntax: '<angle>';
        inherits: false;
        initial-value: 0deg;
      }

      .executive-dashboard {
        background:
          radial-gradient(ellipse at 50% 50%, rgba(12, 95, 231, 1) 0%, rgba(22, 65, 178, 1) 50%, rgba(31, 34, 125, 1) 100%),
          #10069f;
        color: #ffffff;
        height: 100vh;
        min-height: 100%;
        overflow: hidden;
        position: relative;
        width: 100%;
      }

      .executive-stage {
        height: 810px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) scale(var(--executive-scale));
        transform-origin: center;
        transition:
          filter 420ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)),
          opacity 420ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)),
          transform 420ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1));
        width: 1440px;
      }

      .executive-dashboard--opening .executive-stage {
        filter: blur(7px);
        opacity: 0.24;
        transform: translate(-50%, -50%) scale(calc(var(--executive-scale) * 0.982));
      }

      .executive-logo {
        display: block;
        height: 51px;
        left: 48px;
        object-fit: contain;
        position: absolute;
        top: 52px;
        width: 242px;
      }

      .executive-cta {
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 999px;
        color: #ffffff;
        display: inline-flex;
        filter: drop-shadow(-1px 1px 2px rgba(1, 10, 15, 0.15));
        font-size: 15px;
        font-weight: 600;
        gap: 8px;
        height: 54px;
        isolation: isolate;
        justify-content: center;
        left: 1008px;
        line-height: 24px;
        overflow: hidden;
        padding: 8px 8px 8px 24px;
        position: absolute;
        top: 58px;
        transition:
          background 180ms ease,
          border-color 180ms ease,
          box-shadow 240ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)),
          transform 240ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1));
        width: 354px;
        z-index: 4;
      }

      .executive-cta::before {
        --executive-cta-stroke-angle: 0deg;
        animation: executiveCtaStrokeOrbit 2600ms linear infinite;
        background: conic-gradient(
          from var(--executive-cta-stroke-angle),
          rgba(255, 255, 255, 0.2) 0deg,
          rgba(255, 255, 255, 0.2) 114deg,
          rgba(173, 220, 145, 0.95) 156deg,
          rgba(255, 255, 255, 0.96) 180deg,
          rgba(173, 220, 145, 0.95) 204deg,
          rgba(255, 255, 255, 0.2) 246deg,
          rgba(255, 255, 255, 0.2) 360deg
        );
        border-radius: inherit;
        content: '';
        inset: 0;
        padding: 2px;
        pointer-events: none;
        position: absolute;
        z-index: 0;
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }

      .executive-cta::after {
        background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.42) 45%, transparent 70%);
        content: '';
        height: 140%;
        left: -38%;
        position: absolute;
        top: -20%;
        transform: translateX(-110%);
        width: 34%;
      }

      .executive-cta > span:first-child {
        position: relative;
        white-space: nowrap;
        z-index: 1;
      }

      .executive-cta:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
      }

      .executive-cta:hover::before {
        animation-duration: 1500ms;
      }

      .executive-cta:hover .executive-cta-icon {
        transform: translateX(2px);
      }

      .executive-cta:focus-visible {
        outline: 3px solid rgba(173, 220, 145, 0.62);
        outline-offset: 3px;
      }

      .executive-cta:disabled {
        cursor: default;
      }

      .executive-dashboard--opening .executive-cta {
        animation: executiveCtaLiftOff 420ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) both;
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.36);
        box-shadow: 0 18px 42px rgba(1, 10, 15, 0.2);
      }

      .executive-dashboard--opening .executive-cta::after {
        animation: executiveCtaSheen 420ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) both;
      }

      .executive-cta-icon {
        align-items: center;
        background: #addc91;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        height: 35px;
        justify-content: center;
        position: relative;
        transition:
          background 180ms ease,
          transform 240ms var(--motion-ease, cubic-bezier(0.2, 0.8, 0.2, 1));
        width: 35px;
        z-index: 1;
      }

      .executive-dashboard--opening .executive-cta-icon {
        background: #c3eea8;
        transform: translateX(8px) scale(1.06);
      }

      .executive-cta-glyph {
        height: 18px;
        width: 18px;
      }

      .executive-scope {
        left: 80px;
        position: absolute;
        top: 147px;
        width: 428px;
      }

      .executive-scope > p {
        align-items: center;
        background: #addc91;
        border-radius: 20px;
        color: #4a4a4a;
        display: flex;
        font-size: 14px;
        font-weight: 500;
        height: 26px;
        justify-content: center;
        line-height: 24px;
        margin-bottom: 14px;
        width: 176px;
      }

      .executive-scope-grid {
        display: flex;
        gap: 11px;
      }

      .executive-bulletin {
        left: 80px;
        position: absolute;
        top: 324px;
        width: 410px;
      }

      .executive-bulletin > p {
        color: rgba(255, 255, 255, 0.46);
        font-size: 15px;
        font-weight: 400;
        line-height: 33px;
        margin-left: 13px;
        margin-bottom: 9px;
      }

      .executive-bulletin-list {
        display: grid;
        gap: 17px;
      }

      .executive-bulletin-dots {
        align-items: center;
        display: flex;
        gap: 4px;
        justify-content: center;
        margin-top: 16px;
      }

      .executive-bulletin-dots span {
        animation: executiveBulletinDotCycle 12s ease-in-out infinite;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 999px;
        height: 6px;
        opacity: 0.7;
        width: 6px;
      }

      .executive-bulletin-dots span:first-child {
        background: #fafafb;
      }

      .executive-bulletin-dots span:nth-child(2) {
        animation-delay: 3s;
      }

      .executive-bulletin-dots span:nth-child(3) {
        animation-delay: 6s;
      }

      .executive-bulletin-dots span:nth-child(4) {
        animation-delay: 9s;
      }

      @keyframes executiveBulletinDotCycle {
        0%,
        18% {
          background: #fafafb;
          opacity: 1;
          width: 24px;
        }

        24%,
        100% {
          background: rgba(255, 255, 255, 0.25);
          opacity: 0.7;
          width: 6px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .executive-bulletin-dots span {
          animation: none;
        }

        .executive-bulletin-dots span:first-child {
          background: #fafafb;
          opacity: 1;
          width: 24px;
        }
      }

      .executive-card-shell {
        height: 565px;
        left: 509px;
        position: absolute;
        top: 176px;
        width: 422px;
      }

      .executive-card-shell--budget {
        height: 692px;
        left: 948px;
        top: 49px;
      }

      .executive-transition-veil {
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        position: fixed;
        z-index: 20;
      }

      .executive-transition-veil::before {
        animation: executiveInsightsWipe 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
        background: #ffffff;
        border-radius: 999px;
        box-shadow: 0 0 0 26px rgba(173, 220, 145, 0.16);
        content: '';
        height: 76px;
        position: absolute;
        right: 72px;
        top: 46px;
        transform-origin: center;
        width: 76px;
      }

      @keyframes executiveCtaLiftOff {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        42% {
          opacity: 1;
          transform: translateY(-2px) scale(1.018);
        }

        100% {
          opacity: 0.58;
          transform: translateY(-4px) scale(1.05);
        }
      }

      @keyframes executiveCtaSheen {
        0% {
          transform: translateX(-120%);
        }

        100% {
          transform: translateX(430%);
        }
      }

      @keyframes executiveCtaStrokeOrbit {
        to {
          --executive-cta-stroke-angle: 360deg;
        }
      }

      @keyframes executiveInsightsWipe {
        0% {
          opacity: 0.2;
          transform: translate3d(0, 0, 0) scale(0.6);
        }

        32% {
          opacity: 0.9;
        }

        100% {
          opacity: 1;
          transform: translate3d(-34vw, 20vh, 0) scale(48);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .executive-stage,
        .executive-cta,
        .executive-cta-icon {
          transition: none;
        }

        .executive-dashboard--opening .executive-stage {
          filter: none;
          opacity: 1;
          transform: translate(-50%, -50%) scale(var(--executive-scale));
        }

        .executive-dashboard--opening .executive-cta,
        .executive-cta::before,
        .executive-dashboard--opening .executive-cta::after,
        .executive-transition-veil::before {
          animation: none;
        }
      }
    `,
  ],
})
export class ExecutiveDashboardComponent implements OnDestroy {
  @HostBinding('style.--executive-scale')
  stageScale = this.getStageScale();

  activeView: 'front-door' | 'insights' = 'front-door';
  insightsTransitionActive = false;

  readonly bulletins = executiveBulletins;
  readonly insightCards = executiveInsightCards;
  readonly scopeMetrics = executiveScopeMetrics;

  private insightsTransitionTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.clearInsightsTransition();
  }

  openInsights(): void {
    if (this.activeView === 'insights' || this.insightsTransitionActive) {
      return;
    }

    if (this.prefersReducedMotion()) {
      this.activeView = 'insights';
      return;
    }

    this.insightsTransitionActive = true;
    this.insightsTransitionTimer = setTimeout(() => {
      this.activeView = 'insights';
      this.insightsTransitionActive = false;
      this.insightsTransitionTimer = null;
      this.changeDetectorRef.markForCheck();
    }, EXECUTIVE_INSIGHTS_TRANSITION_MS);
  }

  returnToFrontDoor(): void {
    this.clearInsightsTransition();
    this.activeView = 'front-door';
    this.insightsTransitionActive = false;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.stageScale = this.getStageScale();
  }

  private getStageScale(): string {
    if (typeof window === 'undefined') {
      return '1';
    }

    const scale = Math.min(window.innerWidth / EXECUTIVE_STAGE_WIDTH, window.innerHeight / EXECUTIVE_STAGE_HEIGHT);
    return String(scale);
  }

  private clearInsightsTransition(): void {
    if (!this.insightsTransitionTimer) {
      return;
    }

    clearTimeout(this.insightsTransitionTimer);
    this.insightsTransitionTimer = null;
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}


