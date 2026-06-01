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
  portfolioActionGovernanceData,
  portfolioActionPlanReviewData,
  type GovernanceCommitteeDrawerData,
  type PlanReviewDrawerData,
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
        <div class="portfolio-action-profile-drawer-shell" aria-live="polite">
          <button class="portfolio-action-profile-backdrop" type="button" (click)="close.emit()" [attr.aria-label]="'Close drawer'"></button>
          <aside class="portfolio-action-group-drawer overdue-reports-drawer" role="dialog" aria-modal="true" [attr.aria-label]="selected.type + ' list'">
            
            <!-- Header -->
            <header class="overdue-reports-header">
              <div class="header-left">
                <span class="report-icon-bg {{ selected.tone }}">
                  <span [pmConsoleIcon]="groupIcon(selected)" aria-hidden="true"></span>
                </span>
                <h2>{{ selected.type }}</h2>
                <span class="overdue-pill {{ selected.column === 'Overdue' ? 'red' : selected.column === 'This week' ? 'blue' : 'amber' }}">
                  {{ selected.column }}
                </span>
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
                  aria-label="Search items"
                  [value]="searchQuery"
                  (input)="onSearchInput($event)"
                />
              </div>
              <div class="showing-count-label">
                Showing all {{ filteredGroupItems.length }} {{ selected.type.toLowerCase() }}
              </div>
            </section>

            <!-- Scrollable List of Cards -->
            <section class="overdue-reports-list" [attr.aria-label]="selected.type">
              @for (report of filteredGroupItems; track report.id) {
                <div class="overdue-report-card">
                  <div class="card-top-pill">
                    <span class="action-type-pill" [attr.data-card-type]="getNormalizedCardType(report)">
                      {{ getNormalizedCardType(report) }}
                    </span>
                  </div>
                  <h3 class="card-title">{{ report.label }}</h3>
                  <p class="card-project">{{ report.project }}</p>
                  <div class="card-divider"></div>
                  <footer class="card-footer">
                    <div class="card-footer-left">
                      <span pmConsoleIcon="calendar" class="calendar-icon" aria-hidden="true"></span>
                      <span>{{ formatCardDate(report.date) }} ({{ getReportMeta(report, selected.column) }})</span>
                    </div>
                    <button class="open-link" type="button" (click)="handleDetailItemClick(report)">
                      <span>{{ report.cta || 'Open' }}</span>
                      <span pmConsoleIcon="chevron-right" class="arrow-icon" aria-hidden="true"></span>
                    </button>
                  </footer>
                </div>
              }
            </section>

          </aside>
        </div>
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
          @case ('governance') {
            @if (activeGovernanceData; as gov) {
              <div class="portfolio-action-profile-drawer-shell" aria-live="polite">
                <button class="portfolio-action-profile-backdrop" type="button" (click)="close.emit()" aria-label="Close drawer"></button>
                <aside class="review-action-drawer" role="dialog" aria-modal="true" [attr.aria-label]="'Review: ' + selected.label">
                  <header class="ra-header">
                    <div class="ra-header-copy">
                      <span class="ra-eyebrow governance">UPCOMING EVENT</span>
                      <h2>{{ selected.label }}</h2>
                      <div class="ra-meta-row">
                        <span class="ra-meta-label">Forum Name:</span>
                        <span class="ra-meta-value">{{ gov.forumName }}</span>
                        <span class="ra-meta-label">Category:</span>
                        <span class="ra-category-pill">{{ gov.category }}</span>
                      </div>
                    </div>
                    <div class="ra-header-actions">
                      <button type="button" class="ra-icon-btn" aria-label="Expand"><span pmConsoleIcon="maximize-2" aria-hidden="true"></span></button>
                      <button type="button" class="ra-icon-btn" (click)="close.emit()" aria-label="Close"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                    </div>
                  </header>
                  <div class="ra-body">
                    <section class="ra-section">
                      <div class="ra-section-head" (click)="toggleReviewSection('meeting')">
                        <span class="ra-node"><span pmConsoleIcon="calendar" aria-hidden="true"></span></span>
                        <h3>Meeting Details</h3>
                        <button type="button" class="ra-info-btn" aria-label="Info"><span pmConsoleIcon="info" aria-hidden="true"></span></button>
                        <span class="ra-spacer"></span>
                        <button type="button" class="ra-chevron-btn"><span [pmConsoleIcon]="collapsedReviewSections.has('meeting') ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></span></button>
                      </div>
                      @if (!collapsedReviewSections.has('meeting')) {
                        <div class="ra-section-body">
                          <div class="ra-fields four">
                            <div class="ra-field"><small>Meeting Time</small><span>{{ gov.meetingTime }}</span></div>
                            <div class="ra-field"><small>Meeting Date</small><span>{{ gov.meetingDate }}</span></div>
                            <div class="ra-field"><small>Type</small><span>{{ gov.meetingType }}</span></div>
                            <div class="ra-field"><small>Location</small><span>{{ gov.location }}</span></div>
                          </div>
                          <div class="ra-card">
                            <div class="ra-card-head">
                              <span class="ra-card-icon"><span pmConsoleIcon="clipboard-list" aria-hidden="true"></span></span>
                              <div class="ra-card-copy"><strong>Attendees</strong><small>List of meeting attendees</small></div>
                              <span class="ra-count-pill">{{ gov.attendees.length }} attendees</span>
                            </div>
                            <table class="ra-table">
                              <thead><tr><th>Name</th><th>Role</th></tr></thead>
                              <tbody>
                                @for (att of gov.attendees; track $index) {
                                  <tr>
                                    <td><span class="ra-avatar-cell"><span class="ra-avatar">{{ att.initials }}</span>{{ att.name }}</span></td>
                                    <td>{{ att.role }}</td>
                                  </tr>
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      }
                    </section>
                    <section class="ra-section">
                      <div class="ra-section-head" (click)="toggleReviewSection('agenda')">
                        <span class="ra-node"><span pmConsoleIcon="calendar-range" aria-hidden="true"></span></span>
                        <h3>Governance Committee Agenda / Watchlist</h3>
                        <span class="ra-count-sep">|</span>
                        <span class="ra-count-inline">{{ gov.agendaItems.length }} items</span>
                        <span class="ra-spacer"></span>
                        <button type="button" class="ra-chevron-btn"><span [pmConsoleIcon]="collapsedReviewSections.has('agenda') ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></span></button>
                      </div>
                      @if (!collapsedReviewSections.has('agenda')) {
                        <div class="ra-section-body">
                          <div class="ra-agenda-grid">
                            @for (a of gov.agendaItems; track a.id) {
                              <div class="ra-agenda-card">
                                <span class="ra-agenda-eyebrow">AGENDA ITEM {{ a.id }}</span>
                                <strong>{{ a.title }}</strong>
                                <p>{{ a.description }}</p>
                                <button type="button" class="ra-agenda-cta">{{ a.ctaLabel }} <span pmConsoleIcon="arrow-right" aria-hidden="true"></span></button>
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </section>
                  </div>
                </aside>
              </div>
            }
          }
          @case ('plan') {
            @if (activePlanReviewData; as plan) {
              <div class="portfolio-action-profile-drawer-shell" aria-live="polite">
                <button class="portfolio-action-profile-backdrop" type="button" (click)="close.emit()" aria-label="Close drawer"></button>
                <aside class="review-action-drawer" role="dialog" aria-modal="true" [attr.aria-label]="'Review plan: ' + selected.label">
                  <header class="ra-header">
                    <div class="ra-header-copy">
                      <span class="ra-eyebrow-row">
                        <span class="ra-eyebrow plan">REVIEW ACTION</span>
                        <span class="ra-eyebrow-pill">Project Plan</span>
                      </span>
                      <h2>{{ selected.label }}</h2>
                      <p class="ra-description">Track blockers, open decisions, and delivery problems so ownership and next action are visible without opening another tool.</p>
                    </div>
                    <div class="ra-header-actions">
                      <button type="button" class="ra-icon-btn" aria-label="Expand"><span pmConsoleIcon="maximize-2" aria-hidden="true"></span></button>
                      <button type="button" class="ra-icon-btn" (click)="close.emit()" aria-label="Close"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                    </div>
                  </header>
                  <div class="ra-body">
                    <!-- Project Profile -->
                    <section class="ra-section">
                      <div class="ra-section-head" (click)="toggleReviewSection('profile')">
                        <span class="ra-node"><span pmConsoleIcon="pen-tool" aria-hidden="true"></span></span>
                        <h3>Project Profile</h3>
                        <button type="button" class="ra-info-btn" aria-label="Info"><span pmConsoleIcon="info" aria-hidden="true"></span></button>
                        <span class="ra-spacer"></span>
                        <button type="button" class="ra-chevron-btn"><span [pmConsoleIcon]="collapsedReviewSections.has('profile') ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></span></button>
                      </div>
                      @if (!collapsedReviewSections.has('profile')) {
                        <div class="ra-section-body">
                          <div class="ra-fields three">
                            <div class="ra-field"><small>Project name</small><span>{{ plan.projectName }}</span></div>
                            <div class="ra-field"><small>Category</small><span>{{ plan.category }}</span></div>
                            <div class="ra-field"><small>Business Unit</small><span>{{ plan.businessUnit }}</span></div>
                          </div>
                          <div class="ra-fields two">
                            <div class="ra-field"><small>PMO Contact</small><span>{{ plan.pmoContact }}</span></div>
                            <div class="ra-field"><small>Project Manager</small><span class="ra-avatar-cell"><span class="ra-avatar">{{ plan.projectManagerInitials }}</span>{{ plan.projectManager }}</span></div>
                          </div>
                        </div>
                      }
                    </section>
                    <!-- Purpose and outcome -->
                    <section class="ra-section">
                      <div class="ra-section-head" (click)="toggleReviewSection('purpose')">
                        <span class="ra-node"><span pmConsoleIcon="target" aria-hidden="true"></span></span>
                        <h3>Purpose and outcome</h3>
                        <button type="button" class="ra-info-btn" aria-label="Info"><span pmConsoleIcon="info" aria-hidden="true"></span></button>
                        <span class="ra-spacer"></span>
                        <button type="button" class="ra-chevron-btn"><span [pmConsoleIcon]="collapsedReviewSections.has('purpose') ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></span></button>
                      </div>
                      @if (!collapsedReviewSections.has('purpose')) {
                        <div class="ra-section-body">
                          <div class="ra-text-block">
                            <small>Opportunity or Problem Statement</small>
                            <div class="ra-text-content">{{ plan.problemStatement }}</div>
                          </div>
                          <div class="ra-card">
                            <div class="ra-card-head">
                              <span class="ra-card-icon"><span pmConsoleIcon="box" aria-hidden="true"></span></span>
                              <div class="ra-card-copy"><strong>Outcome</strong><small>Measurable outcomes expected from the project.</small></div>
                              <span class="ra-count-pill">{{ plan.outcomes.length }} records</span>
                            </div>
                            <table class="ra-table">
                              <thead><tr><th>Outcome</th><th>Measure</th></tr></thead>
                              <tbody>
                                @for (row of plan.outcomes; track row.outcome) {
                                  <tr><td>{{ row.outcome }}</td><td>{{ row.measure }}</td></tr>
                                }
                              </tbody>
                            </table>
                          </div>
                          <div class="ra-pill-row"><small>AI component</small><span class="ra-pill-tag">{{ plan.aiComponent }}</span></div>
                        </div>
                      }
                    </section>
                    <!-- Dates and scope -->
                    <section class="ra-section">
                      <div class="ra-section-head" (click)="toggleReviewSection('dates')">
                        <span class="ra-node"><span pmConsoleIcon="calendar" aria-hidden="true"></span></span>
                        <h3>Dates and scope</h3>
                        <button type="button" class="ra-info-btn" aria-label="Info"><span pmConsoleIcon="info" aria-hidden="true"></span></button>
                        <span class="ra-spacer"></span>
                        <button type="button" class="ra-chevron-btn"><span [pmConsoleIcon]="collapsedReviewSections.has('dates') ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></span></button>
                      </div>
                      @if (!collapsedReviewSections.has('dates')) {
                        <div class="ra-section-body">
                          <div class="ra-fields two">
                            <div class="ra-field"><small>Baseline Start date</small><span>{{ plan.baselineStartDate }}</span></div>
                            <div class="ra-field"><small>Baseline End date</small><span>{{ plan.baselineEndDate }}</span></div>
                          </div>
                          <div class="ra-text-block">
                            <small>In Scope</small>
                            <div class="ra-text-content">{{ plan.inScope }}</div>
                          </div>
                          <div class="ra-card">
                            <div class="ra-card-head">
                              <span class="ra-card-icon"><span pmConsoleIcon="package" aria-hidden="true"></span></span>
                              <div class="ra-card-copy"><strong>End Product (Deliverables)</strong><small>End deliverables produced by the project.</small></div>
                              <span class="ra-count-pill">{{ plan.endProducts.length }} records</span>
                            </div>
                            <table class="ra-table">
                              <thead><tr><th>Deliverable</th><th>Owner</th></tr></thead>
                              <tbody>
                                @for (row of plan.endProducts; track row.name) {
                                  <tr><td>{{ row.name }}</td><td>{{ row.owner }}</td></tr>
                                }
                              </tbody>
                            </table>
                          </div>
                          <div class="ra-card">
                            <div class="ra-card-head">
                              <span class="ra-card-icon"><span pmConsoleIcon="file-text" aria-hidden="true"></span></span>
                              <div class="ra-card-copy"><strong>Management Product</strong><small>Management products required for governance.</small></div>
                              <span class="ra-count-pill">{{ plan.managementProducts.length }} records</span>
                            </div>
                            <table class="ra-table">
                              <thead><tr><th>Product</th><th>Owner</th></tr></thead>
                              <tbody>
                                @for (row of plan.managementProducts; track row.name) {
                                  <tr><td>{{ row.name }}</td><td>{{ row.owner }}</td></tr>
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      }
                    </section>
                    <!-- Budget baseline -->
                    <section class="ra-section">
                      <div class="ra-section-head" (click)="toggleReviewSection('budget')">
                        <span class="ra-node"><span pmConsoleIcon="circle-dollar-sign" aria-hidden="true"></span></span>
                        <h3>Budget baseline</h3>
                        <button type="button" class="ra-info-btn" aria-label="Info"><span pmConsoleIcon="info" aria-hidden="true"></span></button>
                        <span class="ra-spacer"></span>
                        <button type="button" class="ra-chevron-btn"><span [pmConsoleIcon]="collapsedReviewSections.has('budget') ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></span></button>
                      </div>
                      @if (!collapsedReviewSections.has('budget')) {
                        <div class="ra-section-body">
                          <div class="ra-fields two">
                            <div class="ra-field"><small>CAPEX Baseline (FY)</small><span>{{ plan.capexBaseline }}</span></div>
                            <div class="ra-field"><small>OPEX Baseline (FY)</small><span>{{ plan.opexBaseline }}</span></div>
                          </div>
                        </div>
                      }
                    </section>
                    <!-- Risks -->
                    <section class="ra-section">
                      <div class="ra-section-head" (click)="toggleReviewSection('plan-risks')">
                        <span class="ra-node red"><span pmConsoleIcon="shield-alert" aria-hidden="true"></span></span>
                        <h3>Risks</h3>
                        <button type="button" class="ra-info-btn" aria-label="Info"><span pmConsoleIcon="info" aria-hidden="true"></span></button>
                        <span class="ra-spacer"></span>
                        <button type="button" class="ra-chevron-btn"><span [pmConsoleIcon]="collapsedReviewSections.has('plan-risks') ? 'chevron-down' : 'chevron-up'" aria-hidden="true"></span></button>
                      </div>
                      @if (!collapsedReviewSections.has('plan-risks')) {
                        <div class="ra-section-body">
                          <div class="ra-card">
                            <div class="ra-card-head">
                              <span class="ra-card-icon red"><span pmConsoleIcon="shield-alert" aria-hidden="true"></span></span>
                              <div class="ra-card-copy"><strong>Risks Register</strong><small>Risk, owner, and current exposure.</small></div>
                              <span class="ra-count-pill">{{ plan.risks.length }} records</span>
                            </div>
                            <table class="ra-table">
                              <thead><tr><th>Risk</th><th>Owner</th></tr></thead>
                              <tbody>
                                @for (row of plan.risks; track row.risk) {
                                  <tr><td>{{ row.risk }}</td><td>{{ row.owner }}</td></tr>
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      }
                    </section>
                  </div>
                  <footer class="ra-footer">
                    <button type="button" class="ra-footer-cancel" (click)="close.emit()">Cancel</button>
                    <button type="button" class="ra-footer-more">More actions <span pmConsoleIcon="chevron-down" aria-hidden="true"></span></button>
                    <button type="button" class="ra-footer-approve" (click)="submitAndClose($event)">Approve</button>
                  </footer>
                </aside>
              </div>
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
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overdue-reports-header .report-icon-bg.blue {
        background: #eef4ff;
        color: #1f4fb8;
      }

      .overdue-reports-header .report-icon-bg.red {
        background: #fff0f0;
        color: #9e2f2f;
      }

      .overdue-reports-header .report-icon-bg.green {
        background: #eefbf5;
        color: #166b49;
      }

      .overdue-reports-header .report-icon-bg.amber {
        background: #fff8e7;
        color: #8a5c12;
      }

      .overdue-reports-header .report-icon-bg.neutral {
        background: #f5f7fb;
        color: #536071;
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
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        line-height: 1;
      }

      .overdue-reports-header .overdue-pill.red {
        background: #fde2e2;
        color: #d32f2f;
      }

      .overdue-reports-header .overdue-pill.blue {
        background: #eef4ff;
        color: #1f4fb8;
      }

      .overdue-reports-header .overdue-pill.amber {
        background: #fff8e7;
        color: #8a5c12;
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

      .overdue-report-card .card-top-pill {
        display: flex;
        justify-content: flex-start;
      }

      .overdue-report-card .action-type-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        line-height: 1;
        border: 1px solid transparent;
      }

      .overdue-report-card .action-type-pill[data-card-type="Plans"] {
        border-color: rgba(121, 186, 221, 0.25);
        background: rgba(121, 186, 221, 0.1);
        color: #79badd;
      }

      .overdue-report-card .action-type-pill[data-card-type="Governance Committees"] {
        border-color: rgba(52, 84, 196, 0.25);
        background: rgba(52, 84, 196, 0.1);
        color: #3454c4;
      }

      .overdue-report-card .action-type-pill[data-card-type="Status reports"] {
        border-color: rgba(111, 32, 149, 0.25);
        background: rgba(111, 32, 149, 0.1);
        color: #6f2095;
      }

      .overdue-report-card .action-type-pill[data-card-type="Change requests"] {
        border-color: rgba(196, 52, 114, 0.25);
        background: rgba(196, 52, 114, 0.1);
        color: #c43472;
      }

      .overdue-report-card .action-type-pill[data-card-type="Benefits"] {
        border-color: rgba(22, 107, 73, 0.25);
        background: rgba(22, 107, 73, 0.1);
        color: #166b49;
      }

      .overdue-report-card .action-type-pill[data-card-type="Dependency"] {
        border-color: rgba(121, 186, 221, 0.25);
        background: rgba(121, 186, 221, 0.1);
        color: #79badd;
      }

      .overdue-report-card .action-type-pill[data-card-type="Risk"] {
        border-color: rgba(196, 52, 114, 0.25);
        background: rgba(196, 52, 114, 0.1);
        color: #c43472;
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

      .overdue-report-card .card-footer-left {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #737b8c;
        font-size: 12.5px;
      }

      .overdue-report-card .card-footer-left .calendar-icon {
        width: 14px;
        height: 14px;
        color: #737b8c;
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

      /* === Review Action Drawer (Governance + Plan) === */

      .review-action-drawer {
        animation: motion-drawer-in var(--motion-medium) var(--motion-ease) backwards;
        background: #ffffff;
        bottom: 0;
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.2);
        display: flex;
        flex-direction: column;
        max-width: calc(100vw - 28px);
        overflow: hidden;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: min(620px, calc(100vw - 72px));
      }

      .review-action-drawer::after {
        display: none;
      }

      .ra-header {
        align-items: flex-start;
        background: #f7f7fc;
        border-bottom: 1px solid #ddd;
        display: flex;
        flex: 0 0 auto;
        gap: 16px;
        justify-content: space-between;
        padding: 24px 24px 17px 24px;
      }

      .ra-header-copy {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .ra-eyebrow-row {
        align-items: center;
        display: flex;
        gap: 8px;
      }

      .ra-eyebrow {
        color: #10069f;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        line-height: 1;
        text-transform: uppercase;
      }

      .ra-eyebrow.plan { color: #10069f; }

      .ra-eyebrow-pill {
        background: rgba(49, 136, 181, 0.1);
        border-radius: 6px;
        color: #3188b5;
        font-size: 11px;
        font-weight: 500;
        line-height: 16px;
        padding: 2px 6px;
      }

      .ra-header-copy h2 {
        color: #202633;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.25;
        margin: 0;
      }

      .ra-meta-row {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .ra-meta-label {
        color: #687182;
        font-size: 12px;
        font-weight: 400;
      }

      .ra-meta-value {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 600;
        margin-right: 10px;
      }

      .ra-category-pill {
        background: transparent;
        border: 1px solid #2f2f2f;
        border-radius: 4px;
        color: #2f2f2f;
        font-size: 11px;
        font-weight: 500;
        padding: 2px 10px;
      }

      .ra-description {
        color: #687182;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.55;
        margin: 0;
        max-width: 52ch;
      }

      .ra-header-actions {
        display: flex;
        flex-shrink: 0;
        gap: 6px;
      }

      .ra-icon-btn {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        color: #536071;
        cursor: pointer;
        display: inline-flex;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      .ra-icon-btn:hover,
      .ra-icon-btn:focus-visible {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.22);
        color: #10069f;
        outline: 0;
      }

      .ra-icon-btn .icon { height: 15px; width: 15px; }

      /* Body + timeline */

      .ra-body {
        background: #f7f7fc;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 10px;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 16px 24px 24px 24px;
        position: relative;
      }

      .ra-body::before {
        display: none;
      }

      /* Sections — each rendered as its own white card */

      .ra-section {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 2px rgba(1, 10, 15, 0.08);
        margin-bottom: 0;
        padding: 16px;
      }

      .ra-section:last-child {
        margin-bottom: 0;
      }

      .ra-section-head {
        align-items: center;
        cursor: pointer;
        display: flex;
        gap: 12px;
        user-select: none;
      }

      .ra-node {
        align-items: center;
        background: rgba(16, 6, 159, 0.03);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.1);
        color: #10069f;
        display: inline-flex;
        flex-shrink: 0;
        height: 40px;
        justify-content: center;
        width: 40px;
      }

      .ra-node .icon { height: 22px; width: 22px; }
      .ra-node.red { background: rgba(16, 6, 159, 0.03); color: #10069f; }

      .ra-section-head h3 {
        color: #0b0b0b;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.4;
        margin: 0;
      }

      .ra-info-btn {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 50%;
        color: #a0a8b9;
        cursor: pointer;
        display: inline-flex;
        height: 20px;
        justify-content: center;
        padding: 0;
        width: 20px;
      }

      .ra-info-btn .icon { height: 14px; width: 14px; }

      .ra-spacer { flex: 1 1 auto; }

      .ra-count-sep {
        color: #c5c9d4;
        font-size: 14px;
        font-weight: 300;
      }

      .ra-count-inline {
        color: #687182;
        font-size: 13px;
        font-weight: 400;
        white-space: nowrap;
      }

      .ra-chevron-btn {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 999px;
        color: #536071;
        cursor: pointer;
        flex-shrink: 0;
        display: inline-flex;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      .ra-chevron-btn .icon { height: 16px; width: 16px; }

      .ra-section-body {
        display: grid;
        gap: 16px;
        padding: 8px 0 0 0;
      }

      /* Fields */

      .ra-fields {
        display: grid;
        gap: 16px;
      }

      .ra-fields.four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .ra-fields.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .ra-fields.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }

      .ra-field {
        display: grid;
        gap: 6px;
      }

      .ra-field small {
        color: #6f6f6f;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.45;
      }

      .ra-field > span {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.35;
      }

      /* Sub-cards */

      .ra-card {
        background: #ffffff;
        border: 1px solid #eee;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.08);
        overflow: hidden;
        padding: 2px;
      }

      .ra-card-head {
        align-items: center;
        background: #ffffff;
        border-bottom: 1px solid #eee;
        display: flex;
        gap: 12px;
        padding: 16px 16px 17px;
      }

      .ra-card-icon {
        align-items: center;
        background: rgba(16, 6, 159, 0.03);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.1);
        color: #10069f;
        display: inline-flex;
        flex-shrink: 0;
        height: 40px;
        justify-content: center;
        width: 40px;
      }

      .ra-card-icon.red { background: rgba(16, 6, 159, 0.03); color: #10069f; }
      .ra-card-icon .icon { height: 22px; width: 22px; }

      .ra-card-copy {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .ra-card-copy strong {
        color: #0b0b0b;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.4;
      }

      .ra-card-copy small {
        color: #777;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.3;
      }

      .ra-count-pill {
        background: #f4f7fb;
        border-radius: 999px;
        color: #556072;
        font-size: 10.5px;
        font-weight: 600;
        margin-left: auto;
        padding: 7px 12px;
        white-space: nowrap;
      }

      /* Tables */

      .ra-table {
        border: 1px solid #e5eef4;
        border-collapse: separate;
        border-radius: 12px;
        border-spacing: 0;
        margin: 10px;
        overflow: hidden;
        width: calc(100% - 20px);
      }

      .ra-table th {
        background: #f7f7fc;
        border-bottom: 1px solid #e5eef4;
        color: #687182;
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.105px;
        padding: 12px 16px;
        text-align: left;
      }

      .ra-table td {
        border-top: 1px solid #edf0f6;
        color: #303645;
        font-size: 12px;
        font-weight: 400;
        padding: 12px 16px;
      }

      .ra-table thead tr:first-child th:first-child { border-top-left-radius: 12px; }
      .ra-table thead tr:first-child th:last-child { border-top-right-radius: 12px; }
      .ra-table tbody tr:last-child td:first-child { border-bottom-left-radius: 12px; }
      .ra-table tbody tr:last-child td:last-child { border-bottom-right-radius: 12px; }

      .ra-avatar-cell {
        align-items: center;
        display: inline-flex;
        gap: 10px;
      }

      .ra-avatar {
        align-items: center;
        background: #10069f;
        border-radius: 50%;
        color: #ffffff;
        display: inline-flex;
        flex-shrink: 0;
        font-size: 10px;
        font-weight: 600;
        height: 28px;
        justify-content: center;
        width: 28px;
      }

      /* Text blocks */

      .ra-text-block {
        display: grid;
        gap: 8px;
      }

      .ra-text-block small {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
      }

      .ra-text-content {
        background: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        color: #687182;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.55;
        padding: 16px;
      }

      /* Pill row */

      .ra-pill-row {
        align-items: center;
        display: flex;
        gap: 10px;
      }

      .ra-pill-row small {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
      }

      .ra-pill-tag {
        align-items: center;
        background: #f6f8ff;
        border: 1px solid #dfe4ee;
        border-radius: 10px;
        color: #10069f;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        justify-content: center;
        min-width: 70px;
        padding: 6px 10px;
        text-align: center;
      }

      /* Agenda grid (governance) */

      .ra-agenda-grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .ra-agenda-card {
        background: #ffffff;
        border: 1px solid #e4e8f1;
        border-radius: 10px;
        display: grid;
        gap: 8px;
        padding: 16px;
      }

      .ra-agenda-eyebrow {
        color: #10069f;
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .ra-agenda-card strong {
        color: #0b0b0b;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.35;
      }

      .ra-agenda-card p {
        color: #687182;
        font-size: 12px;
        line-height: 1.5;
        margin: 0;
      }

      .ra-agenda-cta {
        align-items: center;
        background: transparent;
        border: 0;
        color: #10069f;
        cursor: pointer;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 4px;
        justify-self: start;
        padding: 0;
      }

      .ra-agenda-cta .icon { height: 13px; width: 13px; }

      /* Footer (Plans) */

      .ra-footer {
        align-items: center;
        background: #ffffff;
        border-top: 1px solid #ddd;
        display: flex;
        flex: 0 0 auto;
        gap: 12px;
        justify-content: flex-end;
        padding: 17px 24px 16px;
      }

      .ra-footer-cancel {
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: #404040;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.14px;
        padding: 0 16px;
      }

      .ra-footer-more {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d3d3d3;
        border-radius: 999px;
        color: #404040;
        cursor: pointer;
        display: inline-flex;
        font-size: 14px;
        font-weight: 600;
        gap: 8px;
        height: 40px;
        justify-content: center;
        letter-spacing: 0.14px;
        padding: 0 17px;
      }

      .ra-footer-more .icon { height: 16px; width: 16px; }

      .ra-footer-approve {
        align-items: center;
        background: #10069f;
        border: 1px solid #10069f;
        border-radius: 999px;
        color: #ffffff;
        cursor: pointer;
        display: inline-flex;
        font-size: 14px;
        font-weight: 600;
        height: 40px;
        justify-content: center;
        letter-spacing: 0.14px;
        min-width: 96px;
        padding: 0 31px;
      }

      .ra-footer-approve:hover { background: #0d0580; }

      @media (max-width: 760px) {
        .review-action-drawer {
          max-width: 100vw;
          width: 100vw;
        }

        .ra-fields.four,
        .ra-fields.three {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ra-agenda-grid {
          grid-template-columns: 1fr;
        }
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

  get filteredGroupItems(): readonly PortfolioActionItem[] {
    if (!this.activeGroupItems.length) return [];
    if (!this.searchQuery) return this.activeGroupItems;
    const q = this.searchQuery.toLowerCase().trim();
    return this.activeGroupItems.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.project.toLowerCase().includes(q) ||
      (item.owner && item.owner.toLowerCase().includes(q))
    );
  }

  getAvatarClass(initials: string): string {
    const mapping: Record<string, string> = {
      'MH': 'avatar-mh',
      'OK': 'avatar-ok',
      'NH': 'avatar-nh',
      'JS': 'avatar-js',
      'DG': 'avatar-dg',
      'FQ': 'avatar-fq',
      'AH': 'avatar-ah',
      'SA': 'avatar-sa',
      'FA': 'avatar-fa',
    };
    return mapping[initials] || 'avatar-mh';
  }

  formatCardDate(dateStr: string): string {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getNormalizedCardType(report: PortfolioActionItem): string {
    const type = report.type || '';
    if (type.toLowerCase().includes('plan')) return 'Plans';
    if (type.toLowerCase().includes('governance')) return 'Governance Committees';
    if (type.toLowerCase().includes('status') || type.toLowerCase().includes('report')) return 'Status reports';
    if (type.toLowerCase().includes('change')) return 'Change requests';
    if (type.toLowerCase().includes('benefit')) return 'Benefits';
    if (type.toLowerCase().includes('dependency')) return 'Dependency';
    if (type.toLowerCase().includes('risk')) return 'Risk';
    if (type.toLowerCase().includes('task')) return 'Task';
    if (type.toLowerCase().includes('milestone')) return 'Milestone';
    return type || 'Action';
  }

  getReportMeta(report: PortfolioActionItem, parentColumn?: string): string {
    if (report.meta !== 'Pending') {
      return report.meta;
    }
    const col = parentColumn || report.column || 'This week';
    if (col === 'Overdue') {
      return 'Overdue';
    }
    // Calculate difference in days relative to today: May 26, 2026
    const today = new Date('2026-05-26T00:00:00');
    const reportDate = new Date(`${report.date}T00:00:00`);
    if (Number.isNaN(reportDate.getTime())) {
      return 'Due soon';
    }
    const diffTime = reportDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return 'Due today';
    }
    return `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }

  getOwnerFullName(initials: string): string {
    const mapping: Record<string, string> = {
      'FQ': 'Fatima Qahtani',
      'MH': 'Muna Hassan',
      'AH': 'Ahmed Hassan',
      'SA': 'Sarah Al Saud',
      'FA': 'Fatima Al-Saud',
      'OK': 'Osman Khan',
      'NH': 'Nadia Hossain',
      'JS': 'Jasmine Smith',
      'DG': 'David Garcia',
    };
    return mapping[initials] || initials;
  }

  handleDetailItemClick(detail: PortfolioActionItem): void {
    this.item = detail;
    this.hydrateDrawerState();
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
  activeGovernanceData: GovernanceCommitteeDrawerData | null = null;
  activePlanReviewData: PlanReviewDrawerData | null = null;
  collapsedReviewSections = new Set<string>();
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

  toggleReviewSection(sectionId: string): void {
    const next = new Set(this.collapsedReviewSections);
    if (next.has(sectionId)) {
      next.delete(sectionId);
    } else {
      next.add(sectionId);
    }
    this.collapsedReviewSections = next;
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
    this.activeGovernanceData = null;
    this.activePlanReviewData = null;
    this.collapsedReviewSections = new Set<string>();
    this.reportMode = 'simple';
    this.reportPresentationMode = 'compose';
    this.reportSection = 'Overview';

    if (!action) return;
    if (action.detailItems?.length) {
      this.activeGroupItems = action.detailItems;
      return;
    }
    if (action.kind === 'governance') {
      this.activeGovernanceData = portfolioActionGovernanceData(action);
      return;
    }
    if (action.kind === 'plan') {
      this.activePlanReviewData = portfolioActionPlanReviewData(action);
      // Start with only Project Profile expanded; collapse the rest.
      this.collapsedReviewSections = new Set<string>(['purpose', 'dates', 'budget', 'plan-risks']);
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
