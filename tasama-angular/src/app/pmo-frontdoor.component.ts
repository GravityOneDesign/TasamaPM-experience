import { ChangeDetectionStrategy, Component, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { PmConsoleIconService } from './pm-console-icon.service';
import {
  pmoFrontdoorActions,
  pmoFrontdoorDigestSections,
  pmoFrontdoorHealthRows,
  pmoFrontdoorMetrics,
  pmoFrontdoorQuickLinks,
  pmoFrontdoorTabs,
  pmoFrontdoorWorkFilters,
  pmoFrontdoorWorkItems,
  type PmoFrontdoorQuickLink,
  type PmoFrontdoorTab,
} from './pmo-frontdoor.data';
import type { ProjectOption } from './pm-console.types';
import type { PmoGovernanceWorkspaceTarget } from './pmo-governance-workspace.data';
import { PortfolioManagerActionsComponent } from './portfolio-manager-actions.component';
import { PmConsoleDigestPanelComponent } from './shared/pm-console-digest-panel.component';
import { PmConsoleFrontdoorActionCardsComponent } from './shared/pm-console-frontdoor-action-cards.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleModeTabsComponent } from './shared/pm-console-mode-tabs.component';

@Component({
  selector: 'app-pmo-frontdoor',
  standalone: true,
  imports: [
    PortfolioManagerActionsComponent,
    PmConsoleDigestPanelComponent,
    PmConsoleFrontdoorActionCardsComponent,
    PmConsoleIconComponent,
    PmConsoleModeTabsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pm101-operational-canvas pmo-frontdoor-canvas">
      <div class="page-motion-host">
        <div class="content-grid pm101-operational-grid normal-pm-frontdoor-grid pmo-frontdoor-grid">
          <div class="left-column">
            <section class="workspace-panel pm101-operational-workspace normal-pm-frontdoor-workspace pmo-frontdoor-workspace">
              <div class="workspace-shell-head pm101-operational-shell-head pm101-frontdoor-assigned-shell-head normal-pm-frontdoor-shell-head pmo-frontdoor-shell-head">
                <div class="onboarding-operational-tabs">
                  <app-pm-console-mode-tabs
                    ariaLabel="PMO front door sections"
                    [tabs]="tabs"
                    [activeId]="selectedTab"
                    (tabSelected)="setTab($event)"
                  ></app-pm-console-mode-tabs>
                </div>
              </div>

              <div class="workspace-body normal-pm-frontdoor-body pmo-frontdoor-body">
                @if (selectedTab === 'overview') {
                  <section class="pmo-frontdoor-overview" aria-label="PMO portfolio overview">
                    <article class="pmo-performance-hero" aria-label="Portfolio performance snapshot">
                      <div class="pmo-performance-hero-stage">
                        <div class="pmo-hero-metrics" aria-label="PMO scope metrics">
                          @for (metric of metrics; track metric.label) {
                            <span class="pmo-hero-metric">
                              <strong>{{ metric.value }}</strong>
                              <span>{{ metric.label }}</span>
                            </span>
                          }
                        </div>

                        <section class="pmo-hero-health" aria-label="Portfolio and program performance">
                          <span class="pmo-hero-visual pmo-hero-visual-performance" aria-hidden="true">
                            <img class="pmo-hero-illustration pmo-hero-illustration-performance" src="assets/executive/overall-portfolio-health.svg" alt="" />
                          </span>
                          <div class="pmo-hero-copy">
                            <h2>Overall Portfolio Health</h2>
                            <div class="pmo-health-rows">
                              @for (row of healthRows; track row.label) {
                                <div class="pmo-health-row">
                                  <span>{{ row.label }}</span>
                                  <div class="pmo-health-track" aria-hidden="true">
                                    <i class="is-on-track"></i>
                                    <i class="is-delayed"></i>
                                    <i class="is-critical"></i>
                                  </div>
                                  <div class="pmo-health-labels">
                                    <span>On Track: {{ row.onTrack }}</span>
                                    <span>Delayed: {{ row.delayed }}</span>
                                    <span>Critical: {{ row.critical }}</span>
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        </section>

                        <section class="pmo-hero-budget" aria-label="Budget tracking snapshot">
                          <span class="pmo-hero-visual pmo-hero-visual-budget" aria-hidden="true">
                            <img class="pmo-hero-illustration pmo-hero-illustration-budget" src="assets/executive/budget-tracking.svg" alt="" />
                          </span>
                          <div class="pmo-hero-budget-copy">
                            <h2>Budget Health</h2>
                            <div class="pmo-budget-card">
                              <span>Actual vs Planned Budget</span>
                              <div class="pmo-budget-card-body">
                                <div class="pmo-budget-bars" aria-hidden="true">
                                  @for (bar of budgetBars; track $index) {
                                    <i></i>
                                  }
                                </div>
                                <div class="pmo-budget-values">
                                  <p><strong>$175.9M</strong><span>/ $479.9M</span></p>
                                  <p><strong>40%</strong><span>of total budget used</span></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>

                        <span class="pmo-hero-divider" aria-hidden="true"></span>
                      </div>
                    </article>

                    <app-pm-console-frontdoor-action-cards
                      ariaLabel="PMO front door actions"
                      projectName="Portfolio Management Office"
                      [actions]="actions"
                      ctaMode="arrow"
                      (actionSelected)="selectAction($event)"
                    ></app-pm-console-frontdoor-action-cards>
                  </section>
                } @else if (selectedTab === 'manage-work') {
                  <app-portfolio-manager-actions
                    [workspaceTitle]="'PMO Console'"
                    searchPlaceholder="Search PMO work..."
                    [actionItems]="workItems"
                    [boardFilters]="workFilters"
                    [showTargetPicker]="true"
                    [showBoardDetailPanel]="false"
                    [openItemsInDrawer]="true"
                    todayKey="2026-05-26"
                  />
                } @else {
                  <div class="pmo-frontdoor-quicklinks quicklinks-view" data-work-view="quicklinks">
                    <section class="workspace-quick-links-view" aria-label="All Portfolios PMO quick links">
                      <h2>All Portfolios</h2>
                      <div class="selected-project-quick-link-grid">
                        @for (link of quickLinks; track link.id) {
                          <article class="selected-project-quick-link-card" [attr.data-quick-link-id]="link.id">
                            <button class="selected-project-quick-link-main" type="button" [attr.aria-label]="link.title + ' for All Portfolios'" (click)="openQuickLink(link)">
                              <span class="selected-project-quick-link-icon">
                                <span [pmConsoleIcon]="link.icon" aria-hidden="true"></span>
                              </span>
                              <span class="selected-project-quick-link-copy">
                                <strong>{{ link.title }}</strong>
                                <small>{{ link.description }}</small>
                              </span>
                            </button>
                          </article>
                        }
                      </div>
                    </section>
                  </div>
                }
              </div>
            </section>
          </div>

          <div class="right-column normal-pm-digest-column pmo-frontdoor-digest-column">
            <app-pm-console-digest-panel
              title="Welcome!"
              [subtitleLines]="welcomeSubtitle"
              heroIconName="flag"
              [heroAssetSrc]="welcomeIconSrc"
              digestTitle="Daily Digest"
              digestIconName="wand-sparkles"
              [sections]="digestSections"
            ></app-pm-console-digest-panel>
          </div>
        </div>
      </div>

    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-frontdoor-grid {
        align-content: stretch;
        align-items: stretch;
      }

      .content-grid.normal-pm-frontdoor-grid.pmo-frontdoor-grid {
        grid-template-columns: minmax(300px, 320px) minmax(0, 1fr);
      }

      .pmo-frontdoor-workspace {
        min-width: 0;
      }

      .pmo-frontdoor-workspace .pmo-frontdoor-body {
        min-height: 0;
        padding: 16px 16px 24px;
      }

      .pmo-frontdoor-shell-head .onboarding-operational-tabs {
        max-width: 100%;
      }

      .pmo-frontdoor-overview {
        display: grid;
        gap: 24px;
        min-width: 0;
      }

      .pmo-performance-hero {
        --pmo-hero-stage-width: clamp(976px, calc(100cqw - 178px), 1280px);
        background:
          radial-gradient(ellipse 62% 86% at 50% 50%, #0c5fe7 0%, #1f227d 100%),
          #10069f;
        border-radius: 12px;
        color: #ffffff;
        container-type: inline-size;
        height: 264px;
        min-width: 0;
        overflow: hidden;
        position: relative;
      }

      .pmo-performance-hero::before {
        content: "";
        display: none;
        pointer-events: none;
        position: absolute;
      }

      .pmo-performance-hero::after {
        content: "";
        display: none;
        pointer-events: none;
        position: absolute;
      }

      .pmo-performance-hero-stage {
        height: 264px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        transform-origin: center center;
        width: var(--pmo-hero-stage-width);
      }

      .pmo-hero-metrics {
        align-items: center;
        display: flex;
        gap: 8px;
        left: 16px;
        position: absolute;
        top: 16px;
        z-index: 4;
      }

      @container (min-width: 976px) {
        .pmo-hero-metrics {
          left: calc(16px - ((100cqw - var(--pmo-hero-stage-width)) / 2));
        }
      }

      .pmo-hero-metric {
        align-items: center;
        background: rgba(255, 255, 255, 0.08);
        border: 0;
        border-bottom: 1px solid rgba(173, 220, 145, 0.98);
        border-radius: 7px;
        box-shadow: none;
        display: inline-flex;
        gap: 8px;
        height: 36px;
        padding: 8px 12px;
      }

      .pmo-hero-metric:nth-child(1) {
        width: 140px;
      }

      .pmo-hero-metric:nth-child(2) {
        width: 138px;
      }

      .pmo-hero-metric:nth-child(3) {
        width: 131px;
      }

      .pmo-hero-metric strong {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }

      .pmo-hero-metric span {
        color: #ffffff;
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
        white-space: nowrap;
      }

      .pmo-hero-health,
      .pmo-hero-budget {
        align-items: start;
        display: grid;
        position: absolute;
        z-index: 2;
      }

      .pmo-hero-health {
        gap: 11px;
        grid-template-columns: 230px 260px;
        left: 16px;
        top: 68px;
        transform: translateX(-44px);
        width: 501px;
      }

      .pmo-hero-budget {
        gap: 11px;
        grid-template-columns: 181px 251px;
        right: 29px;
        top: 62px;
        width: 443px;
      }

      .pmo-hero-visual {
        display: block;
        min-width: 0;
        overflow: visible;
        position: relative;
      }

      .pmo-hero-visual-performance {
        height: 180px;
        overflow: hidden;
        width: 230px;
      }

      .pmo-hero-visual-budget {
        height: 164px;
        width: 181px;
      }

      .pmo-hero-illustration {
        display: block;
        height: auto;
        position: absolute;
        pointer-events: none;
        user-select: none;
      }

      .pmo-hero-illustration-performance {
        left: -142px;
        top: -85px;
        width: 528px;
      }

      .pmo-hero-illustration-budget {
        left: -136px;
        top: -72px;
        width: 406px;
      }

      .pmo-hero-copy,
      .pmo-hero-budget-copy {
        display: grid;
        min-width: 0;
      }

      .pmo-hero-copy {
        gap: 12px;
        margin-top: 15px;
        position: relative;
        z-index: 3;
      }

      .pmo-hero-budget-copy {
        gap: 12px;
        margin-top: 21px;
        position: relative;
        z-index: 3;
      }

      .pmo-hero-copy h2,
      .pmo-hero-budget-copy h2 {
        color: #ffffff;
        font-weight: 600;
        margin: 0;
      }

      .pmo-hero-copy h2 {
        font-size: 14px;
        line-height: 20px;
      }

      .pmo-hero-budget-copy h2 {
        font-size: 14px;
        line-height: 20px;
      }

      .pmo-health-rows {
        display: grid;
        gap: 16px;
      }

      .pmo-health-row {
        display: grid;
        gap: 5px;
        min-width: 0;
      }

      .pmo-health-row > span {
        color: rgba(255, 255, 255, 0.88);
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }

      .pmo-health-track {
        background: transparent;
        border-radius: 999px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        height: 8px;
        overflow: hidden;
        width: 260px;
      }

      .pmo-health-track i {
        display: block;
        min-width: 0;
      }

      .pmo-health-track .is-on-track {
        background: linear-gradient(90deg, #addc91 28.85%, rgba(152, 200, 152, 0.58) 100%);
      }

      .pmo-health-track .is-delayed {
        background: linear-gradient(90deg, rgba(255, 183, 16, 0.55) 47.12%, rgba(255, 183, 16, 0.2) 100%);
      }

      .pmo-health-track .is-critical {
        background: linear-gradient(90deg, rgba(240, 151, 151, 0.66) 0%, rgba(240, 151, 151, 0) 100%);
      }

      .pmo-health-labels {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 260px;
      }

      .pmo-health-labels span {
        color: rgba(255, 255, 255, 0.84);
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        white-space: nowrap;
      }

      .pmo-health-labels span:nth-child(2) {
        text-align: center;
      }

      .pmo-health-labels span:nth-child(3) {
        text-align: right;
      }

      .pmo-hero-divider {
        background: rgba(255, 255, 255, 0.76);
        border-radius: 999px;
        height: 120px;
        left: 50%;
        position: absolute;
        top: 90px;
        width: 1px;
        z-index: 4;
      }

      .pmo-budget-card {
        background: rgba(255, 255, 255, 0.09);
        border-radius: 8px;
        display: grid;
        gap: 4px;
        height: 106px;
        padding: 8px;
      }

      .pmo-budget-card > span {
        color: #ffffff;
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
      }

      .pmo-budget-card-body {
        align-items: center;
        display: grid;
        gap: 12px;
        grid-template-columns: 54px 169px;
        height: 70px;
      }

      .pmo-budget-bars {
        display: grid;
        gap: 3px;
      }

      .pmo-budget-bars i {
        background: rgba(255, 255, 255, 0.11);
        border-radius: 999px;
        height: 4px;
        width: 54px;
      }

      .pmo-budget-bars i:nth-child(n + 7) {
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.66) 0%, rgba(255, 255, 255, 0.13) 100%);
      }

      .pmo-budget-values {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .pmo-budget-values p {
        align-items: baseline;
        color: #ffffff;
        display: flex;
        gap: 4px;
        margin: 0;
        min-width: 0;
      }

      .pmo-budget-values strong {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
      }

      .pmo-budget-values span {
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        line-height: 16px;
        white-space: nowrap;
      }

      .pmo-budget-values p:first-child span {
        color: rgba(255, 255, 255, 0.74);
        font-weight: 500;
      }

      .pmo-frontdoor-quicklinks {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: auto !important;
      }

      .pmo-frontdoor-quicklinks .workspace-quick-links-view {
        padding-top: 0;
      }

      .pmo-frontdoor-quicklinks .selected-project-quick-link-grid {
        align-items: stretch;
        grid-auto-rows: minmax(130px, auto);
      }

      .pmo-frontdoor-quicklinks .selected-project-quick-link-card,
      .pmo-frontdoor-quicklinks .selected-project-quick-link-main {
        height: 100%;
        min-height: 0;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-section-label {
        color: #777777;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel {
        gap: 16px;
        padding: 16px 12px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-body {
        background:
          linear-gradient(90deg, rgba(16, 6, 159, 0.075) 0%, rgba(16, 6, 159, 0.0375) 25%, rgba(151, 71, 255, 0.0375) 75%, rgba(200, 125, 127, 0.15) 100%),
          #ffffff;
        padding: 12px 8px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-content {
        gap: 24px;
        margin-top: 12px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-section {
        gap: 8px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-section-label::after {
        background: linear-gradient(90deg, rgba(16, 6, 159, 0.25) 0%, rgba(151, 71, 255, 0.25) 50%, rgba(200, 125, 127, 0.25) 100%);
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-list {
        gap: 8px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-item {
        color: #0b0b0b;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        min-height: 56px;
        padding: 12px;
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-section:first-child .digest-panel-item {
        background: linear-gradient(90deg, rgba(200, 125, 159, 0.1) 0%, rgba(151, 71, 255, 0.025) 51.92%, rgba(16, 6, 159, 0.025) 75%, rgba(16, 6, 159, 0.05) 100%);
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-section:nth-child(2) .digest-panel-item {
        background: linear-gradient(90deg, rgba(200, 125, 127, 0.1) 0%, rgba(151, 71, 255, 0.025) 51.92%, rgba(16, 6, 159, 0.025) 75%, rgba(16, 6, 159, 0.05) 100%);
      }

      app-pm-console-digest-panel ::ng-deep .digest-panel-item strong {
        color: #10069f;
        font-weight: 500;
      }

      @container (max-width: 980px) {
        .content-grid.normal-pm-frontdoor-grid.pmo-frontdoor-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }

      @container (max-width: 975px) {
        .pmo-performance-hero-stage {
          transform: translate(-50%, -50%) scale(0.94);
        }
      }

      @container (max-width: 920px) {
        .pmo-performance-hero-stage {
          transform: translate(-50%, -50%) scale(0.89);
        }
      }

      @container (max-width: 860px) {
        .pmo-performance-hero-stage {
          transform: translate(-50%, -50%) scale(0.84);
        }
      }

      @media (max-width: 1180px) {
        .pmo-performance-hero {
          height: auto;
          min-height: 440px;
        }

        .pmo-performance-hero-stage {
          display: grid;
          gap: 20px;
          height: auto;
          left: auto;
          padding: 24px;
          position: relative;
          top: auto;
          transform: none;
          width: auto;
        }

        .pmo-hero-metrics,
        .pmo-hero-health,
        .pmo-hero-budget,
        .pmo-hero-divider {
          left: auto;
          position: relative;
          right: auto;
          top: auto;
          transform: none;
        }

        .pmo-hero-metrics {
          flex-wrap: wrap;
        }

        .pmo-hero-health,
        .pmo-hero-budget {
          width: min(100%, 520px);
        }

        .pmo-hero-divider {
          display: none;
        }

        .pmo-hero-visual {
          overflow: hidden;
        }

        .pmo-hero-copy,
        .pmo-hero-budget-copy {
          margin-top: 0;
        }
      }

      @media (max-width: 780px) {
        .pmo-hero-health,
        .pmo-hero-budget {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-frontdoor-scope-actions {
          display: none;
        }

        .pmo-frontdoor-shell-head .onboarding-operational-tabs {
          max-width: calc(100% - 32px);
        }

        .pmo-hero-visual-performance,
        .pmo-hero-visual-budget {
          height: 180px;
          max-height: 180px;
          width: 100%;
        }

        .pmo-hero-illustration-performance {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 520px;
        }

        .pmo-hero-illustration-budget {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 440px;
        }

        .pmo-health-track,
        .pmo-health-labels {
          width: 100%;
        }

        .pmo-status-reports-overview-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px;
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
        }

        .pmo-status-reports-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .pmo-status-reports-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #0b0b0b;
        }

        .pmo-status-reports-section-title span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #e3f2fd;
          border-radius: 8px;
          color: #1976d2;
        }

        .pmo-status-reports-count-badge {
          margin-left: auto;
          padding: 4px 8px;
          background: #ffebee;
          color: #c62828;
          font-size: 12px;
          font-weight: 600;
          border-radius: 4px;
          white-space: nowrap;
        }

        .pmo-status-reports-section-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #0264c8;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 0;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pmo-status-reports-section-cta:hover {
          opacity: 0.8;
        }

        .pmo-status-reports-preview {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pmo-status-report-preview-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: #f9f9f9;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: inherit;
        }

        .pmo-status-report-preview-card:hover {
          background: #f5f5f5;
          border-color: #d0d0d0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        .pmo-status-report-preview-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pmo-status-report-preview-header strong {
          font-size: 14px;
          color: #0b0b0b;
          font-weight: 600;
          line-height: 1.3;
        }

        .pmo-status-report-preview-project {
          font-size: 12px;
          color: #999;
          font-weight: 400;
        }

        .pmo-status-report-preview-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
          font-size: 12px;
          color: #999;
          font-weight: 400;
        }
      }
    `,
  ],
})
export class PmoFrontdoorComponent implements AfterViewChecked {
  @Output() readonly workspaceRequested = new EventEmitter<PmoGovernanceWorkspaceTarget | undefined>();
  @Output() readonly reportReviewRequested = new EventEmitter<void>();
  @Output() readonly decisionIntelligenceRequested = new EventEmitter<void>();
  @Output() readonly frameworkRequested = new EventEmitter<void>();

  selectedTab: PmoFrontdoorTab = 'overview';
  selectedPortfolioScope = 'all-portfolios';
  readonly tabs = pmoFrontdoorTabs;
  readonly metrics = pmoFrontdoorMetrics;
  readonly healthRows = pmoFrontdoorHealthRows;
  readonly digestSections = pmoFrontdoorDigestSections;
  readonly actions = pmoFrontdoorActions;
  readonly workItems = pmoFrontdoorWorkItems;
  readonly workFilters = pmoFrontdoorWorkFilters;
  readonly quickLinks = pmoFrontdoorQuickLinks;
  readonly portfolioScopeOptions: readonly ProjectOption[] = [{ id: 'all-portfolios', name: 'All Portfolios' }];
  readonly welcomeIconSrc = './assets/pane-top-icon.svg';
  readonly welcomeSubtitle = ["Here's what's happening across your portfolios today."];
  readonly budgetBars = Array.from({ length: 10 });
  private iconsHydrated = false;

  constructor(private readonly iconsService: PmConsoleIconService) { }

  ngAfterViewChecked(): void {
    if (this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  setTab(tabId: string): void {
    if (!isPmoFrontdoorTab(tabId) || tabId === this.selectedTab) return;
    this.selectedTab = tabId;
    this.iconsHydrated = false;
  }

  setPortfolioScope(scopeId: string): void {
    this.selectedPortfolioScope = scopeId;
    this.iconsHydrated = false;
  }

  selectAction(actionId: string): void {
    if (actionId === 'framework') {
      this.frameworkRequested.emit();
      return;
    }
    if (actionId === 'report-review') {
      this.reportReviewRequested.emit();
      return;
    }
    if (actionId === 'decision-intelligence') {
      this.decisionIntelligenceRequested.emit();
      return;
    }
    if (actionId) this.openWorkspace();
  }

  openQuickLink(link: PmoFrontdoorQuickLink): void {
    this.openWorkspace(link.target);
  }

  openWorkspace(target?: PmoGovernanceWorkspaceTarget): void {
    this.workspaceRequested.emit(target);
  }
}

function isPmoFrontdoorTab(tabId: string): tabId is PmoFrontdoorTab {
  return tabId === 'overview' || tabId === 'manage-work' || tabId === 'quicklinks';
}
