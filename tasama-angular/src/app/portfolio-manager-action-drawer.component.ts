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
import {
  PortfolioManagerStageGateDrawerComponent,
  type StageGateAttachment,
} from './portfolio-manager-stage-gate-drawer.component';

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
        .portfolio-action-profile-drawer.benefit {
          max-width: 100vw;
          width: 100vw;
        }

        .portfolio-action-context-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PortfolioManagerActionDrawerComponent implements OnChanges, OnDestroy {
  @Input() item: PortfolioActionItem | null = null;
  @Output() readonly close = new EventEmitter<void>();

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
    this.reportMode = 'simple';
    this.reportPresentationMode = 'compose';
    this.reportSection = 'Overview';

    if (!action) return;
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
