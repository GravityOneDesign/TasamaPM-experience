import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleFieldComponent } from '../../../../shared/components/ui/field/field.component';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { PmConsoleRiskMatrixComponent, type PmConsoleRiskMatrixSelection } from '../../../../shared/components/ui/risk-matrix/risk-matrix.component';
import { PmConsoleRowActionMenuComponent } from '../../../../shared/components/ui/row-action-menu/row-action-menu.component';
import { PmConsoleStatusPillComponent } from '../../../../shared/components/ui/status-pill/status-pill.component';

export type RiskProfileTab = 'identification' | 'analysis' | 'treatment';

export interface RiskTreatmentRecord {
  id: string;
  treatment: string;
  type: string;
  category: string;
  owner: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface RiskTreatmentDraftRecord {
  treatment: string;
  type: string;
  category: string;
  owner: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface RiskProfileRecord {
  id: string;
  riskCategory: string;
  riskName: string;
  description: string;
  owner: string;
  manager: string;
  lead: string;
  startDate: string;
  endDate: string;
  reviewDueDate: string;
  status: string;
  strategicRisk: string;
  enterpriseImpact: boolean;
  actualLikelihood: string;
  actualConsequence: string;
  actualRating: string;
  residualLikelihood: string;
  residualConsequence: string;
  residualRating: string;
  impactedObjective: string;
  sharedRisk: boolean;
  source: string;
  consequence: string;
  controlSummary: string;
  overallControlEffectiveness: string;
  analysisComment: string;
  treatmentApproach: string;
  treatmentType: string;
  treatmentComment: string;
  treatments: RiskTreatmentRecord[];
  createdOn: string;
}

export type RiskProfileField = Exclude<keyof RiskProfileRecord, 'id' | 'enterpriseImpact' | 'sharedRisk' | 'treatments' | 'createdOn'>;

export interface RiskProfileOptions {
  categoryOptions: string[];
  ownerOptions: string[];
  statusOptions: string[];
  strategicRiskOptions: string[];
  impactedObjectiveOptions: string[];
  controlEffectivenessOptions: string[];
  treatmentApproachOptions: string[];
  treatmentTypeOptions: string[];
  treatmentCategoryOptions: string[];
  ownerPlaceholder: string;
}

export interface RiskProfileFieldChange {
  field: RiskProfileField;
  value: string;
}

export interface RiskProfileMatrixChange {
  kind: 'actual' | 'residual';
  selection: PmConsoleRiskMatrixSelection;
}

export interface RiskTreatmentDraftChange {
  field: keyof RiskTreatmentDraftRecord;
  value: string;
}

@Component({
  selector: 'app-pm-console-risk-profile',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleFieldComponent,
    PmConsoleIconComponent,
    PmConsoleRiskMatrixComponent,
    PmConsoleRowActionMenuComponent,
    PmConsoleStatusPillComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="risk-profile-shell" aria-label="Risk profile">
      <header class="risk-profile-header">
        <div class="risk-profile-title">
          <button class="risk-profile-back" type="button" (click)="closeProfile.emit()" aria-label="Close risk profile">
            <span pmConsoleIcon="x" aria-hidden="true"></span>
          </button>
          <div>
            <span class="risk-profile-eyebrow">{{ risk.id }} · {{ risk.actualRating || 'Not rated' }}</span>
            <h3>{{ risk.riskName }}</h3>
            <small>Created on {{ dateLabel(risk.createdOn) }} · Owner {{ risk.owner }}</small>
          </div>
        </div>
      </header>

      <div class="risk-profile-layout">
        <nav class="risk-profile-nav" aria-label="Risk profile sections">
          @for (tab of tabs; track tab.id) {
            <button type="button" [class.active]="activeTab === tab.id" (click)="tabChange.emit(tab.id)">
              <span [pmConsoleIcon]="tab.icon" aria-hidden="true"></span>
              <span>{{ tab.label }}</span>
            </button>
          }
        </nav>

        <section class="risk-profile-panel">
          @if (activeTab === 'identification') {
            <div class="risk-profile-form-grid">
              <app-pm-console-field label="Risk Status" type="select" [value]="risk.status" [options]="config.statusOptions" ariaLabel="Risk Status" fieldClass="risk-profile-field" (valueChange)="changeField('status', $event)" />
              <app-pm-console-field label="Risk Name" type="textarea" [value]="risk.riskName" placeholder="Type risk name" ariaLabel="Risk Name" fieldClass="risk-profile-field" [mandatory]="true" [wide]="true" [maxLength]="500" (valueChange)="changeField('riskName', $event)" />
              <app-pm-console-field label="Start Date" type="date" [value]="risk.startDate" ariaLabel="Start Date" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="changeField('startDate', $event)" />
              <app-pm-console-field label="End Date" type="date" [value]="risk.endDate" ariaLabel="End Date" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="changeField('endDate', $event)" />
              <app-pm-console-field label="Risk Description" type="textarea" [value]="risk.description" placeholder="Describe the risk" ariaLabel="Risk Description" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('description', $event)" />
              <app-pm-console-field label="Risk Category" type="select" [value]="risk.riskCategory" [options]="config.categoryOptions" ariaLabel="Risk Category" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="changeField('riskCategory', $event)" />
              <app-pm-console-field label="Strategic Risk" type="select" [value]="risk.strategicRisk" [options]="config.strategicRiskOptions" ariaLabel="Strategic Risk" fieldClass="risk-profile-field" (valueChange)="changeField('strategicRisk', $event)" />
              <app-pm-console-field label="Risk Lead" type="select" [value]="risk.lead" [options]="config.ownerOptions" ariaLabel="Risk Lead" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="changeField('lead', $event)" />
              <app-pm-console-field label="Risk Manager" type="select" [value]="risk.manager" [options]="config.ownerOptions" ariaLabel="Risk Manager" fieldClass="risk-profile-field" [mandatory]="true" (valueChange)="changeField('manager', $event)" />
            </div>
          } @else if (activeTab === 'analysis') {
            <div class="risk-profile-analysis">
              <div class="risk-profile-form-grid">
                <app-pm-console-field label="Impacted Objective" type="select" [value]="risk.impactedObjective" [options]="config.impactedObjectiveOptions" ariaLabel="Impacted Objective" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('impactedObjective', $event)" />
                <section class="risk-linked-strip wide" aria-label="Linked risks">
                  <span class="matrix-field-label">Linked risks</span>
                  <div>
                    <span>Division risks <b>0</b></span>
                    <span>Branch risks <b>0</b></span>
                    <span>Section risks <b>0</b></span>
                    <span>Project risks <b>{{ projectRiskCount }}</b></span>
                    <span>Program risks <b>0</b></span>
                  </div>
                </section>
                <app-pm-console-field label="Source" type="textarea" [value]="risk.source" placeholder="Add source" ariaLabel="Source" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('source', $event)" />
                <app-pm-console-field label="Consequence" type="textarea" [value]="risk.consequence" placeholder="Add consequence" ariaLabel="Consequence" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('consequence', $event)" />
                <section class="risk-radio-field wide" aria-label="Shared risk">
                  <span class="matrix-field-label">Is this a shared risk?</span>
                  <label><input type="radio" name="risk-shared-profile" [checked]="risk.sharedRisk" (change)="sharedRiskChange.emit(true)" /> Yes</label>
                  <label><input type="radio" name="risk-shared-profile" [checked]="!risk.sharedRisk" (change)="sharedRiskChange.emit(false)" /> No</label>
                </section>
              </div>

              <section class="risk-control-card">
                <header>
                  <div>
                    <span class="risk-profile-section-eyebrow">Control</span>
                    <strong>Current control view</strong>
                  </div>
                  <span class="dependency-register-count">{{ risk.overallControlEffectiveness }}</span>
                </header>
                <p>{{ risk.controlSummary || 'No control added yet.' }}</p>
                <app-pm-console-field label="Control summary" type="textarea" [value]="risk.controlSummary" placeholder="Describe the control or assurance activity" ariaLabel="Control summary" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('controlSummary', $event)" />
                <app-pm-console-field label="Overall Control Effectiveness" type="select" [value]="risk.overallControlEffectiveness" [options]="config.controlEffectivenessOptions" ariaLabel="Overall Control Effectiveness" fieldClass="risk-profile-field" (valueChange)="changeField('overallControlEffectiveness', $event)" />
                <app-pm-console-field label="Comment" type="textarea" [value]="risk.analysisComment" placeholder="Add analysis comments" ariaLabel="Analysis comment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('analysisComment', $event)" />
              </section>

              <div class="risk-rating-section">
                <div class="risk-rating-summary">
                  <span class="risk-profile-section-eyebrow">Actual Risk Rating</span>
                  <strong>{{ risk.actualRating || '-' }}</strong>
                  <small>{{ risk.actualConsequence || '-' }} consequence · {{ risk.actualLikelihood || '-' }} likelihood</small>
                </div>
                <app-pm-console-risk-matrix
                  title="Actual risk rating"
                  description="Select the current consequence and likelihood."
                  [likelihood]="risk.actualLikelihood"
                  [consequence]="risk.actualConsequence"
                  (selectionChange)="changeMatrix('actual', $event)"
                ></app-pm-console-risk-matrix>
              </div>
            </div>
          } @else {
            <div class="risk-profile-treatment">
              <div class="risk-profile-form-grid">
                <app-pm-console-field label="Treatment Approach" type="select" [value]="risk.treatmentApproach" [options]="config.treatmentApproachOptions" ariaLabel="Treatment Approach" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('treatmentApproach', $event)" />
                <app-pm-console-field label="Treatment Type" type="select" [value]="risk.treatmentType" [options]="config.treatmentTypeOptions" ariaLabel="Treatment Type" fieldClass="risk-profile-field" (valueChange)="changeField('treatmentType', $event)" />
                <app-pm-console-field label="Comment" type="textarea" [value]="risk.treatmentComment" placeholder="Add treatment comment" ariaLabel="Treatment comment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeField('treatmentComment', $event)" />
              </div>

              <section class="risk-treatment-card">
                <header>
                  <div>
                    <span class="risk-profile-section-eyebrow">Treatment</span>
                    <strong>{{ treatmentCountLabel(risk.treatments) }}</strong>
                  </div>
                </header>
                <div class="risk-treatment-compose">
                  <app-pm-console-field label="Proposed Treatment" type="textarea" [value]="treatmentDraft.treatment" placeholder="Describe the treatment action" ariaLabel="Proposed Treatment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="changeTreatmentDraft('treatment', $event)" />
                  <app-pm-console-field label="Type" type="select" [value]="treatmentDraft.type" [options]="config.treatmentTypeOptions" ariaLabel="Treatment Type" fieldClass="risk-profile-field" (valueChange)="changeTreatmentDraft('type', $event)" />
                  <app-pm-console-field label="Category" type="select" [value]="treatmentDraft.category" [options]="config.treatmentCategoryOptions" ariaLabel="Treatment Category" fieldClass="risk-profile-field" (valueChange)="changeTreatmentDraft('category', $event)" />
                  <app-pm-console-field label="Owner" type="select" [value]="treatmentDraft.owner" [options]="config.ownerOptions" [placeholder]="config.ownerPlaceholder" ariaLabel="Treatment Owner" fieldClass="risk-profile-field" (valueChange)="changeTreatmentDraft('owner', $event)" />
                  <app-pm-console-field label="Manager" type="select" [value]="treatmentDraft.manager" [options]="config.ownerOptions" ariaLabel="Treatment Manager" fieldClass="risk-profile-field" (valueChange)="changeTreatmentDraft('manager', $event)" />
                  <app-pm-console-field label="Start Date" type="date" [value]="treatmentDraft.startDate" ariaLabel="Treatment Start Date" fieldClass="risk-profile-field" (valueChange)="changeTreatmentDraft('startDate', $event)" />
                  <app-pm-console-field label="End Date" type="date" [value]="treatmentDraft.endDate" ariaLabel="Treatment End Date" fieldClass="risk-profile-field" (valueChange)="changeTreatmentDraft('endDate', $event)" />
                  <button class="risk-profile-add-treatment" type="button" [disabled]="!canAddTreatment()" (click)="treatmentAdd.emit()"><span pmConsoleIcon="plus" aria-hidden="true"></span>Add treatment</button>
                </div>
                @if (risk.treatments.length) {
                  <div class="dependency-register-table-shell risk-treatment-table-shell">
                    <table class="dependency-register-table risk-treatment-table" aria-label="Risk treatments">
                      <thead>
                        <tr><th>Proposed Treatment</th><th>Type</th><th>Category</th><th>Owner</th><th>Dates</th><th></th></tr>
                      </thead>
                      <tbody>
                        @for (treatment of risk.treatments; track treatment.id) {
                          <tr>
                            <td class="dependency-register-primary"><strong>{{ treatment.treatment }}</strong><small>{{ treatment.status }}</small></td>
                            <td>{{ treatment.type }}</td>
                            <td>{{ treatment.category }}</td>
                            <td>{{ treatment.owner }}</td>
                            <td class="dependency-register-baseline"><strong>{{ dateLabel(treatment.startDate) }}</strong><small>{{ dateLabel(treatment.endDate) }}</small></td>
                            <td class="schedule-table-actions">
                              <app-pm-console-row-action-menu ariaLabel="Treatment actions">
                                <button class="danger" type="button" role="menuitem" (click)="treatmentRemove.emit(treatment.id)">
                                  <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                  Delete
                                </button>
                              </app-pm-console-row-action-menu>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                } @else {
                  <p class="risk-profile-empty-note">No treatment added yet.</p>
                }
              </section>

              <div class="risk-rating-section">
                <div class="risk-rating-summary">
                  <span class="risk-profile-section-eyebrow">Residual Risk Rating</span>
                  <strong>{{ risk.residualRating || '-' }}</strong>
                  <small>{{ risk.residualConsequence || '-' }} consequence · {{ risk.residualLikelihood || '-' }} likelihood</small>
                </div>
                <app-pm-console-risk-matrix
                  title="Residual risk rating"
                  description="Select the expected rating after treatment."
                  [likelihood]="risk.residualLikelihood"
                  [consequence]="risk.residualConsequence"
                  (selectionChange)="changeMatrix('residual', $event)"
                ></app-pm-console-risk-matrix>
              </div>
            </div>
          }
        </section>
      </div>

      <footer class="risk-profile-footer">
        <div class="risk-profile-actions">
          <span [pmConsoleStatusPill]="risk.status" baseClass="dependency-register-pill" [tone]="statusTone(risk.status)"></span>
          <button class="risk-profile-secondary" type="button">View activity</button>
          <button class="risk-profile-primary" type="button" (click)="completeProfile.emit(risk.id)">Complete assessment</button>
        </div>
      </footer>
    </article>
  `,
})
export class PmConsoleRiskProfileComponent {
  @Input() risk!: RiskProfileRecord;
  @Input() config!: RiskProfileOptions;
  @Input() activeTab: RiskProfileTab = 'identification';
  @Input() treatmentDraft!: RiskTreatmentDraftRecord;
  @Input() projectRiskCount = 0;

  @Output() closeProfile = new EventEmitter<void>();
  @Output() completeProfile = new EventEmitter<string>();
  @Output() tabChange = new EventEmitter<RiskProfileTab>();
  @Output() fieldChange = new EventEmitter<RiskProfileFieldChange>();
  @Output() sharedRiskChange = new EventEmitter<boolean>();
  @Output() matrixChange = new EventEmitter<RiskProfileMatrixChange>();
  @Output() treatmentDraftChange = new EventEmitter<RiskTreatmentDraftChange>();
  @Output() treatmentAdd = new EventEmitter<void>();
  @Output() treatmentRemove = new EventEmitter<string>();

  readonly tabs: { id: RiskProfileTab; label: string; icon: string }[] = [
    { id: 'identification', label: 'Identification', icon: 'info' },
    { id: 'analysis', label: 'Analysis', icon: 'chart-column' },
    { id: 'treatment', label: 'Treatment', icon: 'check-square' },
  ];

  changeField(field: RiskProfileField, value: string): void {
    this.fieldChange.emit({ field, value });
  }

  changeMatrix(kind: 'actual' | 'residual', selection: PmConsoleRiskMatrixSelection): void {
    this.matrixChange.emit({ kind, selection });
  }

  changeTreatmentDraft(field: keyof RiskTreatmentDraftRecord, value: string): void {
    this.treatmentDraftChange.emit({ field, value });
  }

  canAddTreatment(): boolean {
    return Boolean(this.treatmentDraft?.treatment?.trim());
  }

  treatmentCountLabel(treatments: RiskTreatmentRecord[]): string {
    return treatments.length === 1 ? '1 treatment' : `${treatments.length} treatments`;
  }

  statusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('closed')) return 'success';
    if (normalized.includes('escalated')) return 'critical';
    if (normalized.includes('monitor')) return 'amber';
    if (normalized.includes('open')) return 'indigo';
    return 'neutral';
  }

  dateLabel(value: string): string {
    if (!value) return 'N/A';
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const parsed = dateOnlyMatch
      ? new Date(Date.UTC(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3])))
      : new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(parsed);
  }
}


