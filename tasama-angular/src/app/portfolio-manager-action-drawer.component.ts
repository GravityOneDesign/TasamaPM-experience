import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleReportDrawerComponent } from './pm-console-report-drawer.component';
import {
  stageDefinitions,
  stageProfiles,
  type StageGateContext,
  type StageGateStatus,
  type StageProfile,
} from './portfolio-manager-stage-gate.data';
import {
  clonePortfolioActionBenefitProfile,
  clonePortfolioActionRiskProfile,
  portfolioActionBenefitProfileOptions,
  portfolioActionGenericChecklist,
  portfolioActionProjectOptions,
  portfolioActionReportCards,
  portfolioActionReportDetails,
  portfolioActionReportOverviewFields,
  portfolioActionReportSections,
  portfolioActionReportStatusOptions,
  portfolioActionReportTrendOptions,
  portfolioActionRiskProfileConfig,
  portfolioActionRiskTreatmentDraftInitial,
  portfolioActionScopeProducts,
  portfolioActionStageChecklist,
  type PortfolioActionChecklistItem,
  type PortfolioActionItem,
  type PortfolioActionReportCard,
  type PortfolioActionReportDetail,
  type PortfolioActionReportOverviewField,
  type PortfolioActionScopeProduct,
} from './portfolio-manager-actions.data';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  PmConsoleBenefitProfileComponent,
  type BenefitProfileFieldChange,
  type BenefitProfileMeasureRow,
  type BenefitProfileObjectiveLink,
  type BenefitProfileRecipientRow,
  type BenefitProfileRecord,
} from './shared/pm-console-benefit-profile.component';
import {
  PmConsoleRiskProfileComponent,
  type RiskProfileFieldChange,
  type RiskProfileMatrixChange,
  type RiskProfileRecord,
  type RiskProfileTab,
  type RiskTreatmentDraftRecord,
  type RiskTreatmentDraftChange,
  type RiskTreatmentRecord,
} from './shared/pm-console-risk-profile.component';
import { PortfolioManagerStageGateDrawerComponent, type StageGateAttachment } from './portfolio-manager-stage-gate-drawer.component';
import { pmoStatusReports, type PmoStatusReport } from './pmo-frontdoor.data';

type ReportDetailMode = 'simple' | 'detailed';
type ReportDrawerPresentationMode = 'compose' | 'pdf-preview';

@Component({
  selector: 'app-portfolio-manager-action-drawer',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleBenefitProfileComponent,
    PmConsoleIconComponent,
    PmConsolePlanDrawerComponent,
    PmConsoleReportDrawerComponent,
    PmConsoleRiskProfileComponent,
    PortfolioManagerStageGateDrawerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item; as selected) {
      @if (activeGroupItems.length) {
        @if (selected.kind === 'report' && selected.column === 'Overdue') {
          <div class="portfolio-action-profile-drawer-shell" aria-live="polite">
            <button class="portfolio-action-profile-backdrop" type="button" (click)="close.emit()" [attr.aria-label]="'Close drawer'"></button>
            <aside class="portfolio-action-group-drawer overdue-reports-drawer" role="dialog" aria-modal="true" aria-label="Overdue status reports list">
              
              <!-- Header -->
              <header class="overdue-reports-header">
                <div class="header-left">
                  <span class="report-icon-bg">
                    <span pmConsoleIcon="chart-column" aria-hidden="true"></span>
                  </span>
                  <h2>Status Reports</h2>
                  <span class="overdue-pill">Overdue</span>
                </div>
                <button class="overdue-reports-close" type="button" (click)="close.emit()" aria-label="Close list">
                  <span pmConsoleIcon="x" aria-hidden="true"></span>
                </button>
              </header>

              <!-- Search Area -->
              <section class="overdue-reports-search-section">
                <div class="search-input-wrapper">
                  <span pmConsoleIcon="search" class="search-icon" aria-hidden="true"></span>
                  <input
                    type="text"
                    placeholder="Search.."
                    aria-label="Search status reports"
                    [value]="searchQuery"
                    (input)="onSearchInput($event)"
                  />
                </div>
                <div class="showing-count-label">
                  Showing all {{ filteredReports.length }} status reports
                </div>
              </section>

              <!-- Scrollable List of Cards -->
              <section class="overdue-reports-list" aria-label="Overdue status reports">
                @for (report of filteredReports; track report.id) {
                  <div class="overdue-report-card">
                    <header class="card-header">
                      <span pmConsoleIcon="calendar" class="calendar-icon" aria-hidden="true"></span>
                      <span>{{ report.dueDate }} ({{ report.overdueText }})</span>
                    </header>
                    <h3 class="card-title">{{ report.title }}</h3>
                    <p class="card-project">{{ report.project }}</p>
                    <div class="card-divider"></div>
                    <footer class="card-footer">
                      <div class="card-owner">
                        <span class="owner-avatar {{ getAvatarClass(report.ownerInitials) }}">{{ report.ownerInitials }}</span>
                        <span class="owner-name">{{ report.ownerName }}</span>
                      </div>
                      <button class="open-link" type="button" (click)="close.emit()">
                        <span>Open</span>
                        <span pmConsoleIcon="chevron-right" class="arrow-icon" aria-hidden="true"></span>
                      </button>
                    </footer>
                  </div>
                }
              </section>

            </aside>
          </div>
        } @else {
          <div class="portfolio-action-profile-drawer-shell" aria-live="polite">
            <button class="portfolio-action-profile-backdrop" type="button" (click)="close.emit()" [attr.aria-label]="'Close ' + selected.label + ' drawer'"></button>
            <aside class="portfolio-action-group-drawer" role="dialog" aria-modal="true" [attr.aria-label]="selected.label + ' action list'">
              <header class="portfolio-action-group-header">
                <button class="portfolio-action-group-close" type="button" (click)="close.emit()" aria-label="Close action list">
                  <span pmConsoleIcon="x" aria-hidden="true"></span>
                </button>
                <span class="portfolio-action-group-icon {{ selected.tone }}">
                  <span [pmConsoleIcon]="groupIcon(selected)" aria-hidden="true"></span>
                </span>
                <div>
                  <small>{{ selected.column }}</small>
                  <h2>{{ selected.label }}</h2>
                  <p>{{ selected.detailSummary || selected.meta }}</p>
                </div>
                <strong>{{ activeGroupItems.length }}</strong>
              </header>

              <section class="portfolio-action-group-summary" aria-label="Action queue summary">
                <span>
                  <small>Queue type</small>
                  <strong>{{ selected.type }}</strong>
                </span>
                <span>
                  <small>Due window</small>
                  <strong>{{ selected.meta }}</strong>
                </span>
                <span>
                  <small>Scope</small>
                  <strong>{{ selected.project }}</strong>
                </span>
              </section>

              <section class="portfolio-action-group-list" aria-label="Action items">
                @for (detail of activeGroupItems; track detail.id) {
                  <article class="portfolio-action-group-row">
                    <span class="portfolio-action-group-row-icon {{ detail.tone }}">
                      <span [pmConsoleIcon]="groupIcon(detail)" aria-hidden="true"></span>
                    </span>
                    <span class="portfolio-action-group-row-copy">
                      <strong>{{ detail.label }}</strong>
                      <small>{{ detail.project }} · {{ targetLabel(detail) }}</small>
                    </span>
                    <span class="portfolio-action-group-row-meta">
                      <small>{{ detail.meta }}</small>
                      <b>{{ detail.owner }}</b>
                    </span>
                    <button type="button">
                      <span>{{ groupActionLabel(detail) }}</span>
                      <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
                    </button>
                  </article>
                }
              </section>

              <footer class="portfolio-action-group-footer">
                <button class="secondary" type="button" (click)="close.emit()">Close</button>
                <button class="primary" type="button" (click)="close.emit()">Mark queue reviewed</button>
              </footer>
            </aside>
          </div>
        }
      } @else {
        @switch (selected.kind) {
          @case ('report') {
            @if (activeReportDetails; as details) {
              <app-pm-console-report-drawer
                [projectName]="selected.project"
                [details]="details"
                [submitted]="false"
                [presentationMode]="reportPresentationMode"
                [activeMode]="reportMode"
                [activeSection]="reportSection"
                [reportSections]="reportSections"
                [statusOptions]="reportStatusOptions"
                [trendOptions]="reportTrendOptions"
                [overviewCard]="activeReportCards[0] || null"
                [simpleCards]="activeReportCards"
                [detailedCards]="activeReportCards"
                [overviewFields]="activeReportOverviewFields"
                [scopeProducts]="activeReportScopeProducts"
                [sectionDetails]="emptySectionDetails"
                [detailItemMap]="emptyDetailItemMap"
                (close)="close.emit()"
                (save)="submitAndClose($event)"
                (preview)="reportPresentationMode = 'pdf-preview'"
                (previewBack)="reportPresentationMode = 'compose'"
                (modeChange)="setReportMode($any($event))"
                (sectionChange)="reportSection = $event"
              ></app-pm-console-report-drawer>
            }
          }
          @case ('risk') {
            @if (activeRiskProfile; as risk) {
              <div class="portfolio-action-profile-drawer-shell" aria-live="polite">
                <button class="portfolio-action-profile-backdrop" type="button" (click)="close.emit()" aria-label="Close risk drawer"></button>
                <aside class="portfolio-action-profile-drawer" role="dialog" aria-modal="true" [attr.aria-label]="'Review risk ' + risk.id">
                  <app-pm-console-risk-profile
                    [risk]="risk"
                    [config]="riskProfileConfig"
                    [activeTab]="activeRiskProfileTab"
                    [treatmentDraft]="riskTreatmentDraft"
                    [projectRiskCount]="1"
                    (closeProfile)="close.emit()"
                    (tabChange)="activeRiskProfileTab = $event"
                    (fieldChange)="updateRiskProfileField($event)"
                    (sharedRiskChange)="updateRiskSharedRisk($event)"
                    (matrixChange)="updateRiskProfileMatrix($event)"
                    (treatmentDraftChange)="updateRiskTreatmentDraft($event)"
                    (treatmentAdd)="addRiskTreatment()"
                    (treatmentRemove)="removeRiskTreatment($event)"
                  ></app-pm-console-risk-profile>
                </aside>
              </div>
            }
          }
          @case ('benefit') {
            @if (activeBenefitProfile; as benefit) {
              <div class="portfolio-action-profile-drawer-shell" aria-live="polite">
                <button class="portfolio-action-profile-backdrop" type="button" (click)="close.emit()" aria-label="Close benefit drawer"></button>
                <aside class="portfolio-action-profile-drawer benefit" role="dialog" aria-modal="true" [attr.aria-label]="'Review benefit ' + benefit.id">
                  <app-pm-console-benefit-profile
                    [benefit]="benefit"
                    [projectOptions]="projectOptions"
                    [categoryOptions]="benefitProfileOptions.categoryOptions"
                    [ownerOptions]="benefitProfileOptions.ownerOptions"
                    [productOptions]="benefitProfileOptions.productOptions"
                    [strategicObjectiveOptions]="benefitProfileOptions.strategicObjectiveOptions"
                    (closeProfile)="close.emit()"
                    (completeProfile)="completeBenefitProfile($event)"
                    (fieldChange)="updateBenefitProfileField($event)"
                    (objectiveAdd)="addBenefitObjective($event)"
                    (recipientAdd)="addBenefitRecipient($event)"
                    (measureAdd)="addBenefitMeasure($event)"
                    (removeMeasure)="removeBenefitMeasure($event)"
                  ></app-pm-console-benefit-profile>
                </aside>
              </div>
            }
          }
          @case ('milestone') {
            @if (stageGateContextForAction(selected); as gate) {
              <app-portfolio-manager-stage-gate-drawer
                [project]="gate.profile.project"
                [gate]="gate.stage.gate"
                [stageLabel]="gate.stage.label"
                [status]="gate.status"
                [checkedCount]="gate.checkedCount"
                [gateTotal]="gate.profile.gateTotal"
                [dueLabel]="gate.profile.gateDue"
                [checkpoint]="gate.profile.checkpoint"
                [checklist]="gate.profile.checklist"
                [checklistState]="stageGateChecklistStateFor(gate)"
                [comment]="stageGateCommentFor(gate)"
                [attachments]="stageGateAttachmentsFor(gate)"
                [ariaLabel]="gate.profile.project + ' ' + gate.stage.gate + ' submission'"
                (close)="close.emit()"
                (submitGate)="submitStageGateAction($event, gate)"
                (commentChange)="updateStageGateComment(gate, $event)"
                (checklistChange)="toggleStageGateChecklistItem(gate, $event.index, $event.checked)"
                (attachmentsSelected)="addStageGateFiles($event, gate)"
                (attachmentRemove)="removeStageGateAttachment(gate, $event)"
              ></app-portfolio-manager-stage-gate-drawer>
            }
          }
          @default {
            <app-pm-console-plan-drawer
              [title]="selected.label"
              eyebrow="Portfolio action"
              [description]="'Review and close this quick action for ' + selected.project + '.'"
              [summaryLabel]="selected.project"
              [summary]="selected.meta"
              submitLabel="Mark reviewed"
              cancelLabel="Close"
              closeAriaLabel="Close action drawer"
              (close)="close.emit()"
              (submitForm)="submitAndClose($event)"
            >
              <div planDrawerBody class="portfolio-action-review-body">
                <ng-container [ngTemplateOutlet]="actionContext" [ngTemplateOutletContext]="{ action: selected }"></ng-container>
                <ng-container [ngTemplateOutlet]="checklist" [ngTemplateOutletContext]="{ items: genericChecklist(selected) }"></ng-container>
              </div>
            </app-pm-console-plan-drawer>
          }
        }
      }
    }

    <ng-template #actionContext let-action="action">
      <div class="portfolio-action-context-grid">
        <span>
          <small>Action type</small>
          <strong>{{ action.type }}</strong>
        </span>
        <span>
          <small>Owner</small>
          <strong>{{ action.owner }}</strong>
        </span>
        <span>
          <small>Due state</small>
          <strong>{{ action.meta }}</strong>
        </span>
        <span>
          <small>Target</small>
          <strong>{{ targetLabel(action) }}</strong>
        </span>
      </div>
    </ng-template>

    <ng-template #checklist let-items="items">
      <section class="portfolio-action-checklist" aria-label="Review checklist">
        <header>
          <span pmConsoleIcon="clipboard-check" aria-hidden="true"></span>
          <strong>Review checklist</strong>
        </header>
        @for (entry of items; track entry.label) {
          <article [class.complete]="entry.complete">
            <span class="portfolio-action-check-icon" aria-hidden="true">
              <span [pmConsoleIcon]="entry.complete ? 'check' : 'circle-dot'"></span>
            </span>
            <span>
              <strong>{{ entry.label }}</strong>
              <small>{{ entry.meta }}</small>
            </span>
          </article>
        }
      </section>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .portfolio-action-profile-drawer-shell {
        inset: 0;
        isolation: isolate;
        pointer-events: none;
        position: fixed;
        z-index: 1000;
      }

      :host ::ng-deep .report-drawer-shell,
      :host ::ng-deep .plan-entry-drawer-shell {
        inset: 0;
        isolation: isolate;
        z-index: 1000;
      }

      .portfolio-action-profile-backdrop {
        animation: motion-fade-in var(--motion-medium) var(--motion-ease) both;
        background: rgba(18, 24, 38, 0.24);
        inset: 0;
        pointer-events: auto;
        position: absolute;
      }

      .portfolio-action-profile-drawer {
        animation: motion-drawer-in var(--motion-medium) var(--motion-ease) backwards;
        background: #ffffff;
        bottom: 0;
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.2);
        display: flex;
        max-width: calc(100vw - 28px);
        overflow: hidden;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: min(860px, calc(100vw - 72px));
      }

      .portfolio-action-profile-drawer.benefit {
        width: min(900px, calc(100vw - 72px));
      }

      .portfolio-action-group-drawer {
        animation: motion-drawer-in var(--motion-medium) var(--motion-ease) backwards;
        background: #ffffff;
        bottom: 0;
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.2);
        display: grid;
        grid-template-rows: auto auto minmax(0, 1fr) auto;
        max-width: calc(100vw - 28px);
        overflow: hidden;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: min(720px, calc(100vw - 72px));
      }

      .portfolio-action-group-header {
        align-items: start;
        border-bottom: 1px solid #e4e8f1;
        display: grid;
        gap: 14px;
        grid-template-columns: auto auto minmax(0, 1fr) auto;
        padding: 22px 24px 20px;
      }

      .portfolio-action-group-close {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        color: #536071;
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .portfolio-action-group-close:hover,
      .portfolio-action-group-close:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.22);
        color: #10069f;
        outline: 0;
      }

      .portfolio-action-group-close .icon {
        height: 16px;
        width: 16px;
      }

      .portfolio-action-group-icon {
        align-items: center;
        background: #f5f7fb;
        border-radius: 10px;
        color: #536071;
        display: inline-flex;
        height: 42px;
        justify-content: center;
        width: 42px;
      }

      .portfolio-action-group-icon.blue,
      .portfolio-action-group-row-icon.blue {
        background: #eef4ff;
        color: #1f4fb8;
      }

      .portfolio-action-group-icon.green,
      .portfolio-action-group-row-icon.green {
        background: #eefbf5;
        color: #166b49;
      }

      .portfolio-action-group-icon.red,
      .portfolio-action-group-row-icon.red {
        background: #fff0f0;
        color: #9e2f2f;
      }

      .portfolio-action-group-icon.neutral,
      .portfolio-action-group-row-icon.neutral {
        background: #f5f7fb;
        color: #536071;
      }

      .portfolio-action-group-icon .icon {
        height: 20px;
        width: 20px;
      }

      .portfolio-action-group-header small,
      .portfolio-action-group-header p,
      .portfolio-action-group-summary small,
      .portfolio-action-group-row small {
        color: #657084;
        font-size: 12px;
        line-height: 1.35;
      }

      .portfolio-action-group-header h2 {
        color: #0b0b0b;
        font-size: 22px;
        font-weight: 600;
        line-height: 1.16;
        margin: 2px 0 6px;
      }

      .portfolio-action-group-header p {
        margin: 0;
      }

      .portfolio-action-group-header > strong {
        align-items: center;
        background: #10069f;
        border-radius: 999px;
        color: #ffffff;
        display: inline-flex;
        font-size: 13px;
        font-weight: 600;
        height: 32px;
        justify-content: center;
        min-width: 32px;
        padding: 0 10px;
      }

      .portfolio-action-group-summary {
        background: #fbfcff;
        border-bottom: 1px solid #e4e8f1;
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        padding: 14px 24px;
      }

      .portfolio-action-group-summary span {
        background: #ffffff;
        border: 1px solid #edf0f6;
        border-radius: 8px;
        display: grid;
        gap: 4px;
        min-width: 0;
        padding: 10px 12px;
      }

      .portfolio-action-group-summary strong {
        color: #252a34;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .portfolio-action-group-list {
        align-content: start;
        display: grid;
        gap: 10px;
        grid-auto-rows: max-content;
        min-height: 0;
        overflow: auto;
        padding: 18px 24px 20px;
      }

      .portfolio-action-group-row {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e8f1;
        border-radius: 8px;
        display: grid;
        gap: 12px;
        grid-template-columns: auto minmax(0, 1fr) minmax(116px, auto) auto;
        min-height: 72px;
        padding: 12px;
      }

      .portfolio-action-group-row-icon {
        align-items: center;
        border-radius: 8px;
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .portfolio-action-group-row-icon .icon {
        height: 16px;
        width: 16px;
      }

      .portfolio-action-group-row-copy,
      .portfolio-action-group-row-meta {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .portfolio-action-group-row-copy strong {
        color: #252a34;
        font-size: 13.5px;
        font-weight: 600;
        line-height: 1.25;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .portfolio-action-group-row-meta {
        justify-items: end;
        text-align: right;
      }

      .portfolio-action-group-row-meta b {
        align-items: center;
        background: #f2f4f8;
        border: 1px solid #e3e7ef;
        border-radius: 999px;
        color: #667085;
        display: inline-flex;
        font-size: 10px;
        font-weight: 600;
        height: 24px;
        justify-content: center;
        min-width: 24px;
        padding: 0 6px;
      }

      .portfolio-action-group-row button {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        color: #303645;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 6px;
        height: 34px;
        justify-content: center;
        padding: 0 10px;
        white-space: nowrap;
      }

      .portfolio-action-group-row button:hover,
      .portfolio-action-group-row button:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.22);
        color: #10069f;
        outline: 0;
      }

      .portfolio-action-group-row button .icon {
        height: 14px;
        width: 14px;
      }

      .portfolio-action-group-footer {
        align-items: center;
        border-top: 1px solid #e4e8f1;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        padding: 14px 24px;
      }

      .portfolio-action-group-footer button {
        align-items: center;
        border-radius: 8px;
        display: inline-flex;
        font-size: 13px;
        font-weight: 600;
        height: 38px;
        justify-content: center;
        padding: 0 14px;
      }

      .portfolio-action-group-footer .secondary {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        color: #303645;
      }

      .portfolio-action-group-footer .primary {
        background: #10069f;
        border: 1px solid #10069f;
        color: #ffffff;
      }

      app-pm-console-risk-profile,
      app-pm-console-benefit-profile {
        display: block;
        height: 100%;
        min-height: 0;
        overflow: auto;
        width: 100%;
      }

      .portfolio-action-review-body {
        display: grid;
        gap: 16px;
      }

      .portfolio-action-context-grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .portfolio-action-context-grid span {
        background: #fbfcff;
        border: 1px solid #e4e8f1;
        border-radius: 8px;
        display: grid;
        gap: 4px;
        min-width: 0;
        padding: 12px;
      }

      .portfolio-action-context-grid small,
      .portfolio-action-checklist article small {
        color: #657084;
        font-size: 12px;
        line-height: 1.35;
      }

      .portfolio-action-context-grid strong,
      .portfolio-action-checklist article strong {
        color: #252a34;
        font-size: 13px;
        font-weight: 650;
        line-height: 1.3;
      }

      .portfolio-action-checklist {
        background: #ffffff;
        border: 1px solid #e4e8f1;
        border-radius: 8px;
        display: grid;
        gap: 0;
        overflow: hidden;
      }

      .portfolio-action-checklist header {
        align-items: center;
        background: #f7f7fc;
        border-bottom: 1px solid #e4e8f1;
        display: flex;
        gap: 8px;
        min-height: 42px;
        padding: 0 14px;
      }

      .portfolio-action-checklist header .icon {
        color: #10069f;
        height: 16px;
        width: 16px;
      }

      .portfolio-action-checklist article {
        align-items: start;
        border-bottom: 1px solid #eef1f6;
        display: grid;
        gap: 10px;
        grid-template-columns: auto minmax(0, 1fr);
        padding: 13px 14px;
      }

      .portfolio-action-checklist article:last-child {
        border-bottom: 0;
      }

      .portfolio-action-check-icon {
        align-items: center;
        background: #f1f4f9;
        border-radius: 999px;
        color: #6b7280;
        display: inline-flex;
        height: 24px;
        justify-content: center;
        width: 24px;
      }

      .portfolio-action-checklist article.complete .portfolio-action-check-icon {
        background: #eefbf5;
        color: #15803d;
      }

      .portfolio-action-check-icon .icon {
        height: 14px;
        width: 14px;
      }

      @media (max-width: 760px) {
        .portfolio-action-profile-drawer,
        .portfolio-action-profile-drawer.benefit,
        .portfolio-action-group-drawer {
          max-width: 100vw;
          width: 100vw;
        }

        .portfolio-action-context-grid {
          grid-template-columns: 1fr;
        }

        .portfolio-action-group-header {
          grid-template-columns: auto minmax(0, 1fr) auto;
        }

        .portfolio-action-group-close {
          grid-column: 1;
        }

        .portfolio-action-group-icon {
          display: none;
        }

        .portfolio-action-group-summary,
        .portfolio-action-group-row {
          grid-template-columns: 1fr;
        }

        .portfolio-action-group-row-meta {
          justify-items: start;
          text-align: left;
        }
      }

      .overdue-reports-drawer {
        width: min(420px, calc(100vw - 72px));
        display: flex;
        flex-direction: column;
      }

      .overdue-reports-header {
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 24px 24px 16px;
      }

      .overdue-reports-header .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .overdue-reports-header .report-icon-bg {
        width: 40px;
        height: 40px;
        background: #eef4ff;
        color: #1f4fb8;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overdue-reports-header .report-icon-bg span {
        width: 20px;
        height: 20px;
      }

      .overdue-reports-header h2 {
        color: #0b0b0b;
        font-size: 20px;
        font-weight: 600;
        margin: 0;
      }

      .overdue-reports-header .overdue-pill {
        background: #fde2e2;
        color: #d32f2f;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        line-height: 1;
      }

      .overdue-reports-close {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        color: #536071;
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .overdue-reports-close:hover,
      .overdue-reports-close:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.22);
        color: #10069f;
        outline: 0;
      }

      .overdue-reports-close span {
        width: 16px;
        height: 16px;
      }

      .overdue-reports-search-section {
        padding: 0 24px 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .search-input-wrapper {
        position: relative;
        width: 100%;
      }

      .search-input-wrapper input {
        padding: 0 12px 0 36px;
        height: 38px;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        width: 100%;
        font-size: 13px;
        color: #2f2f2f;
        background: #ffffff;
        outline: none;
      }

      .search-input-wrapper input:focus {
        border-color: #10069f;
      }

      .search-input-wrapper .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #888;
        width: 16px;
        height: 16px;
      }

      .showing-count-label {
        font-size: 13px;
        color: #657084;
        font-weight: 400;
      }

      .overdue-reports-list {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 0 24px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .overdue-report-card {
        background: #ffffff;
        border: 1px solid #eef1f6;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        box-shadow: 0 1px 3px rgba(25, 33, 61, 0.03);
      }

      .overdue-report-card .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #737b8c;
        font-size: 12.5px;
      }

      .overdue-report-card .card-header .calendar-icon {
        width: 14px;
        height: 14px;
        color: #737b8c;
      }

      .overdue-report-card .card-title {
        font-size: 15px;
        font-weight: 600;
        color: #0b0b0b;
        margin: 0;
        line-height: 1.35;
      }

      .overdue-report-card .card-project {
        font-size: 13px;
        color: #657084;
        margin: 0;
      }

      .overdue-report-card .card-divider {
        height: 1px;
        background: #eef1f6;
        margin: 4px 0;
      }

      .overdue-report-card .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .overdue-report-card .card-owner {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .overdue-report-card .owner-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: #ffffff;
      }

      .overdue-report-card .owner-avatar.avatar-mh {
        background: #6366f1;
      }

      .overdue-report-card .owner-avatar.avatar-ok {
        background: #a855f7;
      }

      .overdue-report-card .owner-avatar.avatar-nh {
        background: #3b82f6;
      }

      .overdue-report-card .owner-avatar.avatar-js {
        background: #ec4899;
      }

      .overdue-report-card .owner-avatar.avatar-dg {
        background: #10b981;
      }

      .overdue-report-card .owner-name {
        font-size: 13px;
        color: #2f2f2f;
        font-weight: 500;
      }

      .overdue-report-card .open-link {
        background: transparent;
        border: none;
        padding: 0;
        color: #10069f;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      }

      .overdue-report-card .open-link .arrow-icon {
        width: 13px;
        height: 13px;
      }
    `,
  ],
})
export class PortfolioManagerActionDrawerComponent implements OnChanges, OnDestroy {
  @Input() item: PortfolioActionItem | null = null;
  @Output() readonly close = new EventEmitter<void>();

  searchQuery = '';

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  get filteredReports(): readonly PmoStatusReport[] {
    if (!this.searchQuery) return pmoStatusReports;
    const q = this.searchQuery.toLowerCase().trim();
    return pmoStatusReports.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.project.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q)
    );
  }

  getAvatarClass(initials: string): string {
    const mapping: Record<string, string> = {
      'MH': 'avatar-mh',
      'OK': 'avatar-ok',
      'NH': 'avatar-nh',
      'JS': 'avatar-js',
      'DG': 'avatar-dg',
    };
    return mapping[initials] || 'avatar-mh';
  }

  readonly projectOptions = portfolioActionProjectOptions;
  readonly benefitProfileOptions = portfolioActionBenefitProfileOptions;
  readonly riskProfileConfig = portfolioActionRiskProfileConfig;
  readonly reportSections = portfolioActionReportSections;
  readonly reportStatusOptions = portfolioActionReportStatusOptions;
  readonly reportTrendOptions = portfolioActionReportTrendOptions;
  readonly emptySectionDetails: Record<string, never> = {};
  readonly emptyDetailItemMap: Record<string, never[]> = {};

  activeBenefitProfile: BenefitProfileRecord | null = null;
  activeRiskProfile: RiskProfileRecord | null = null;
  activeRiskProfileTab: RiskProfileTab = 'identification';
  riskTreatmentDraft: RiskTreatmentDraftRecord = { ...portfolioActionRiskTreatmentDraftInitial };
  activeReportDetails: PortfolioActionReportDetail | null = null;
  activeReportCards: PortfolioActionReportCard[] = [];
  activeReportOverviewFields: PortfolioActionReportOverviewField[] = [];
  activeReportScopeProducts: PortfolioActionScopeProduct[] = [];
  activeGroupItems: readonly PortfolioActionItem[] = [];
  reportMode: ReportDetailMode = 'simple';
  reportPresentationMode: ReportDrawerPresentationMode = 'compose';
  reportSection = 'Overview';
  submittedStageGateKeys: string[] = [];
  stageGateAttachments: Record<string, StageGateAttachment[]> = {};
  stageGateChecklistState: Record<string, boolean[]> = {};
  stageGateComments: Record<string, string> = {};

  ngOnChanges(): void {
    this.hydrateDrawerState();
  }

  ngOnDestroy(): void {
    Object.values(this.stageGateAttachments).flat().forEach((attachment) => this.revokeAttachmentUrl(attachment));
  }

  setReportMode(mode: ReportDetailMode): void {
    this.reportMode = mode;
    if (mode === 'detailed') {
      this.reportSection = 'Overview';
    }
  }

  submitAndClose(event: Event): void {
    event.preventDefault();
    this.close.emit();
  }

  targetLabel(action: PortfolioActionItem): string {
    return `${this.capitalize(action.targetType)} · ${action.project}`;
  }

  groupIcon(action: PortfolioActionItem): string {
    if (action.kind === 'plan') return 'file-text';
    if (action.kind === 'report') return 'chart-column';
    if (action.kind === 'benefit') return 'circle-check';
    if (action.kind === 'change') return 'git-pull-request';
    if (action.kind === 'governance') return 'landmark';
    if (action.kind === 'milestone') return 'flag';
    if (action.kind === 'risk') return 'triangle-alert';
    if (action.kind === 'dependency') return 'network';
    return 'check-square';
  }

  groupActionLabel(action: PortfolioActionItem): string {
    if (action.kind === 'plan') return 'Review';
    if (action.kind === 'report') return 'Open report';
    if (action.kind === 'benefit') return 'Review';
    if (action.kind === 'change') return 'Assess';
    if (action.kind === 'governance') return 'Open';
    return action.cta || 'Open';
  }

  stageChecklist(action: PortfolioActionItem): PortfolioActionChecklistItem[] {
    return portfolioActionStageChecklist(action);
  }

  genericChecklist(action: PortfolioActionItem): PortfolioActionChecklistItem[] {
    return portfolioActionGenericChecklist(action);
  }

  stageGateContextForAction(action: PortfolioActionItem): StageGateContext | null {
    if (action.kind !== 'milestone') return null;
    const profile = this.stageProfileForAction(action);
    const stageIndex = this.stageCurrentIndex(profile);
    const stage = stageDefinitions[stageIndex] || stageDefinitions[0];
    if (!stage) return null;
    const status = this.stageStatus(profile, stageIndex);
    return {
      profile,
      stage,
      stageIndex,
      status,
      checkedCount: this.stageGateCheckedCount(profile, stageIndex, status),
    };
  }

  submitStageGateAction(event: Event, gate: StageGateContext): void {
    event.preventDefault();
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    if (!this.submittedStageGateKeys.includes(key)) {
      this.submittedStageGateKeys = [...this.submittedStageGateKeys, key];
    }
    this.close.emit();
  }

  stageGateChecklistStateFor(gate: StageGateContext): boolean[] {
    return this.stageGateChecklistState[this.stageGateKey(gate.profile.project, gate.stage.id)] || [];
  }

  stageGateCommentFor(gate: StageGateContext): string {
    return this.stageGateComments[this.stageGateKey(gate.profile.project, gate.stage.id)] || '';
  }

  updateStageGateComment(gate: StageGateContext, value: string): void {
    this.stageGateComments = {
      ...this.stageGateComments,
      [this.stageGateKey(gate.profile.project, gate.stage.id)]: value,
    };
  }

  toggleStageGateChecklistItem(gate: StageGateContext, index: number, checked: boolean): void {
    if (!this.canEditStageGateChecklist(gate.status)) return;
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    const current = this.stageGateChecklistState[key] || this.initialStageGateChecklistState(gate.profile, gate.stageIndex);
    const next = [...current];
    next[index] = checked;
    this.stageGateChecklistState = {
      ...this.stageGateChecklistState,
      [key]: next,
    };
  }

  stageGateAttachmentsFor(gate: StageGateContext): StageGateAttachment[] {
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    const attachments = this.stageGateAttachments[key] || [];
    if (attachments.length || gate.status !== 'complete') return attachments;
    return [this.archivedStageGateAttachment(gate)];
  }

  addStageGateFiles(files: readonly File[], gate: StageGateContext): void {
    if (!this.canEditStageGateChecklist(gate.status) || !files.length) return;
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    const attachments = files.map((file) => this.createFileAttachment(file, 'stage-gate'));
    this.stageGateAttachments = {
      ...this.stageGateAttachments,
      [key]: [...(this.stageGateAttachments[key] || []), ...attachments],
    };
  }

  removeStageGateAttachment(gate: StageGateContext, id: string): void {
    if (!this.canEditStageGateChecklist(gate.status)) return;
    const key = this.stageGateKey(gate.profile.project, gate.stage.id);
    const current = this.stageGateAttachments[key] || [];
    const removed = current.find((attachment) => attachment.id === id);
    this.revokeAttachmentUrl(removed);
    this.stageGateAttachments = {
      ...this.stageGateAttachments,
      [key]: current.filter((attachment) => attachment.id !== id),
    };
  }

  updateRiskProfileField(change: RiskProfileFieldChange): void {
    if (!this.activeRiskProfile) return;
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      [change.field]: change.value,
    };
  }

  updateRiskSharedRisk(sharedRisk: boolean): void {
    if (!this.activeRiskProfile) return;
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      sharedRisk,
    };
  }

  updateRiskProfileMatrix(change: RiskProfileMatrixChange): void {
    if (!this.activeRiskProfile) return;
    if (change.kind === 'actual') {
      this.activeRiskProfile = {
        ...this.activeRiskProfile,
        actualLikelihood: change.selection.likelihood,
        actualConsequence: change.selection.consequence,
        actualRating: change.selection.rating,
      };
      return;
    }
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      residualLikelihood: change.selection.likelihood,
      residualConsequence: change.selection.consequence,
      residualRating: change.selection.rating,
    };
  }

  updateRiskTreatmentDraft(change: RiskTreatmentDraftChange): void {
    this.riskTreatmentDraft = {
      ...this.riskTreatmentDraft,
      [change.field]: change.value,
    };
  }

  addRiskTreatment(): void {
    if (!this.activeRiskProfile || !this.riskTreatmentDraft.treatment.trim()) return;
    const treatment: RiskTreatmentRecord = {
      id: `TRT-${String(this.activeRiskProfile.treatments.length + 1).padStart(3, '0')}`,
      treatment: this.riskTreatmentDraft.treatment.trim(),
      type: this.riskTreatmentDraft.type,
      category: this.riskTreatmentDraft.category,
      owner: this.riskTreatmentDraft.owner || 'Owner to confirm',
      manager: this.riskTreatmentDraft.manager || 'Fatima Qahtani',
      startDate: this.riskTreatmentDraft.startDate,
      endDate: this.riskTreatmentDraft.endDate,
      status: this.riskTreatmentDraft.status || 'Proposed',
    };
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      treatments: [...this.activeRiskProfile.treatments, treatment],
    };
    this.riskTreatmentDraft = { ...portfolioActionRiskTreatmentDraftInitial };
  }

  removeRiskTreatment(treatmentId: string): void {
    if (!this.activeRiskProfile) return;
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      treatments: this.activeRiskProfile.treatments.filter((treatment) => treatment.id !== treatmentId),
    };
  }

  updateBenefitProfileField(change: BenefitProfileFieldChange): void {
    if (!this.activeBenefitProfile) return;
    this.activeBenefitProfile = {
      ...this.activeBenefitProfile,
      [change.field]: change.value,
    };
  }

  completeBenefitProfile(benefitId: string): void {
    if (!this.activeBenefitProfile || this.activeBenefitProfile.id !== benefitId) return;
    this.activeBenefitProfile = {
      ...this.activeBenefitProfile,
      state: 'Closed',
      stage: 'Realized',
      overallStatus: 'Harvested',
    };
  }

  addBenefitObjective(objective: BenefitProfileObjectiveLink): void {
    if (!this.activeBenefitProfile) return;
    this.activeBenefitProfile = {
      ...this.activeBenefitProfile,
      businessPlanObjectives: [...this.activeBenefitProfile.businessPlanObjectives, objective],
    };
  }

  addBenefitRecipient(recipient: BenefitProfileRecipientRow): void {
    if (!this.activeBenefitProfile) return;
    this.activeBenefitProfile = {
      ...this.activeBenefitProfile,
      recipients: [...this.activeBenefitProfile.recipients, recipient],
    };
  }

  addBenefitMeasure(measure: BenefitProfileMeasureRow): void {
    if (!this.activeBenefitProfile) return;
    this.activeBenefitProfile = {
      ...this.activeBenefitProfile,
      measures: [...this.activeBenefitProfile.measures, measure],
    };
  }

  removeBenefitMeasure(measureId: string): void {
    if (!this.activeBenefitProfile) return;
    this.activeBenefitProfile = {
      ...this.activeBenefitProfile,
      measures: this.activeBenefitProfile.measures.filter((measure) => measure.id !== measureId),
    };
  }

  private hydrateDrawerState(): void {
    const action = this.item;
    this.activeBenefitProfile = null;
    this.activeRiskProfile = null;
    this.activeRiskProfileTab = 'identification';
    this.riskTreatmentDraft = { ...portfolioActionRiskTreatmentDraftInitial };
    this.activeReportDetails = null;
    this.activeReportCards = [];
    this.activeReportOverviewFields = [];
    this.activeReportScopeProducts = [];
    this.activeGroupItems = [];
    this.reportMode = 'simple';
    this.reportPresentationMode = 'compose';
    this.reportSection = 'Overview';

    if (!action) return;
    if (action.detailItems?.length) {
      this.activeGroupItems = action.detailItems;
      return;
    }
    if (action.kind === 'risk') {
      this.activeRiskProfile = clonePortfolioActionRiskProfile(action.project);
      return;
    }
    if (action.kind === 'benefit') {
      this.activeBenefitProfile = clonePortfolioActionBenefitProfile(action.project);
      return;
    }
    if (action.kind === 'milestone') {
      const gate = this.stageGateContextForAction(action);
      if (gate) this.ensureStageGateChecklistState(gate.profile, gate.stageIndex);
      return;
    }
    if (action.kind === 'report') {
      this.activeReportDetails = portfolioActionReportDetails(action);
      this.activeReportCards = portfolioActionReportCards(action);
      this.activeReportOverviewFields = portfolioActionReportOverviewFields(action);
      this.activeReportScopeProducts = portfolioActionScopeProducts(action);
    }
  }

  private stageProfileForAction(action: PortfolioActionItem): StageProfile {
    const profile = stageProfiles.find((item) => item.project === action.project);
    if (profile) return profile;
    const fallbackChecklist = portfolioActionStageChecklist(action).map((entry) => entry.label);
    return {
      project: action.project,
      currentStage: 0,
      tone: 'amber',
      gateDue: this.actionDueLabel(action),
      gateDone: fallbackChecklist.filter((_, index) => index < 2).length,
      gateTotal: fallbackChecklist.length || 3,
      checkpoint: 'Gate evidence pack and sponsor decision note',
      checklist: fallbackChecklist.length ? fallbackChecklist : ['Gate evidence pack attached', 'Mandatory watchlist checked', 'Sponsor decision note confirmed'],
    };
  }

  private stageCurrentIndex(profile: StageProfile): number {
    return Math.min(Math.max(profile.currentStage, 0), stageDefinitions.length - 1);
  }

  private stageStatus(profile: StageProfile, stageIndex: number): StageGateStatus {
    const currentIndex = this.stageCurrentIndex(profile);
    const stage = stageDefinitions[stageIndex];
    const key = stage ? this.stageGateKey(profile.project, stage.id) : '';
    if (stageIndex < currentIndex) return 'complete';
    if (stageIndex === currentIndex) return this.submittedStageGateKeys.includes(key) ? 'submitted' : 'current';
    return 'upcoming';
  }

  private stageGateCheckedCount(profile: StageProfile, stageIndex: number, status = this.stageStatus(profile, stageIndex)): number {
    if (status === 'complete' || status === 'submitted') return profile.gateTotal;
    const stage = stageDefinitions[stageIndex];
    if (!stage) return 0;
    const state = this.stageGateChecklistState[this.stageGateKey(profile.project, stage.id)];
    if (state) return state.filter(Boolean).length;
    return status === 'current' ? Math.min(profile.gateDone, profile.gateTotal) : 0;
  }

  private ensureStageGateChecklistState(profile: StageProfile, stageIndex: number): void {
    const stage = stageDefinitions[stageIndex];
    if (!stage) return;
    const key = this.stageGateKey(profile.project, stage.id);
    if (this.stageGateChecklistState[key]) return;
    this.stageGateChecklistState = {
      ...this.stageGateChecklistState,
      [key]: this.initialStageGateChecklistState(profile, stageIndex),
    };
  }

  private initialStageGateChecklistState(profile: StageProfile, stageIndex: number): boolean[] {
    const status = this.stageStatus(profile, stageIndex);
    const checkedCount = status === 'complete' || status === 'submitted' ? profile.gateTotal : status === 'current' ? profile.gateDone : 0;
    return profile.checklist.map((_, index) => index < checkedCount);
  }

  private canEditStageGateChecklist(status: StageGateStatus): boolean {
    return status === 'current';
  }

  private stageGateKey(project: string, stageId: string): string {
    return `${project}|${stageId}`;
  }

  private createFileAttachment(file: File, idPrefix: string): StageGateAttachment {
    return {
      id: `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name || 'Untitled attachment',
      source: 'upload',
      sizeLabel: this.formatAttachmentSize(file.size),
      addedOn: this.formatAttachmentDate(new Date()),
      url: URL.createObjectURL(file),
    };
  }

  private archivedStageGateAttachment(gate: StageGateContext): StageGateAttachment {
    return {
      id: `archived-${gate.profile.project}-${gate.stage.id}`,
      name: `${gate.stage.label} gate approved evidence`,
      source: 'upload',
      addedOn: 'Approved evidence',
    };
  }

  private revokeAttachmentUrl(attachment: StageGateAttachment | undefined): void {
    if (attachment?.source === 'upload' && attachment.url?.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
  }

  private formatAttachmentSize(size: number): string {
    if (!Number.isFinite(size) || size <= 0) return '0 KB';
    if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  private formatAttachmentDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
  }

  private actionDueLabel(action: PortfolioActionItem): string {
    return action.meta.replace(/^Due\s+/i, '') || action.date;
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
