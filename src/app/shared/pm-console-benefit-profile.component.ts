import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';
import { PmConsoleFieldComponent } from './pm-console-field.component';
import { PmConsoleIconComponent } from './pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from './pm-console-row-action-menu.component';
import { PmConsoleStatusPillComponent } from './pm-console-status-pill.component';

export type BenefitProfileTab = 'profile' | 'track';
export type BenefitProfileSection = 'context' | 'measure';

export interface BenefitProfileObjectiveLink {
  id: string;
  division: string;
  branch: string;
  section: string;
  objective: string;
}

export interface BenefitProfileRecipientRow {
  id: string;
  recipient: string;
  impactLevel: string;
  startDate: string;
  endDate: string;
  comment: string;
}

export interface BenefitProfileMeasureRow {
  id: string;
  measure: string;
  owner: string;
  description: string;
  metric: string;
  polarity: string;
  baselineValue: string;
  targetValue: string;
  frequency: string;
  startDate: string;
  endDate: string;
  status: string;
  dependencies: string;
  informationSource: string;
}

export interface BenefitProfileRecord {
  id: string;
  project: string;
  benefitType: string;
  category: string;
  benefitName: string;
  description: string;
  owner: string;
  realizationDate: string;
  state: string;
  stage: string;
  product: string;
  outcomes: string;
  strategicObjective: string;
  businessPlanObjectives: BenefitProfileObjectiveLink[];
  manager: string;
  recipients: BenefitProfileRecipientRow[];
  impact: string;
  impactJustification: string;
  likelihood: string;
  likelihoodJustification: string;
  overallStatus: string;
  statusComment: string;
  measures: BenefitProfileMeasureRow[];
  createdOn: string;
}

export type BenefitProfileField = Exclude<keyof BenefitProfileRecord, 'id' | 'businessPlanObjectives' | 'recipients' | 'measures' | 'createdOn'>;

export interface BenefitProfileFieldChange {
  field: BenefitProfileField;
  value: string;
}

interface ObjectiveDraft {
  division: string;
  branch: string;
  section: string;
  objective: string;
}

interface RecipientDraft {
  recipient: string;
  impactLevel: string;
  startDate: string;
  endDate: string;
  comment: string;
}

interface MeasureDraft {
  measure: string;
  owner: string;
  description: string;
  metric: string;
  polarity: string;
  baselineValue: string;
  targetValue: string;
  frequency: string;
  startDate: string;
  endDate: string;
  status: string;
  dependencies: string;
  informationSource: string;
}

@Component({
  selector: 'app-pm-console-benefit-profile',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleFieldComponent,
    PmConsoleIconComponent,
    PmConsolePlanDrawerComponent,
    PmConsoleRowActionMenuComponent,
    PmConsoleStatusPillComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (benefit; as record) {
      <article class="risk-profile-shell benefit-profile-shell" aria-label="Benefit profile">
        <header class="risk-profile-header benefit-profile-header">
          <div class="risk-profile-title benefit-profile-title">
            <button class="risk-profile-back" type="button" (click)="closeProfile.emit()" aria-label="Back to benefits register">
              <span pmConsoleIcon="chevron-left" aria-hidden="true"></span>
            </button>
            <div>
              <span class="risk-profile-eyebrow">{{ record.id }} · {{ record.stage || 'Benefit profile' }}</span>
              <h3>{{ record.benefitName }}</h3>
              <small>{{ record.project }} · Owner {{ record.owner || 'Owner to confirm' }}</small>
            </div>
          </div>
        </header>

        <div class="benefit-profile-tabs" role="tablist" aria-label="Benefit profile tabs">
          <button type="button" role="tab" [class.active]="activeTab === 'profile'" [attr.aria-selected]="activeTab === 'profile'" (click)="setActiveTab('profile')">
            <span pmConsoleIcon="layout-panel-left" aria-hidden="true"></span>
            Benefit Profile
          </button>
          <button type="button" role="tab" [class.active]="activeTab === 'track'" [attr.aria-selected]="activeTab === 'track'" (click)="setActiveTab('track')">
            <span pmConsoleIcon="activity" aria-hidden="true"></span>
            Track Benefit
          </button>
        </div>

        @if (activeTab === 'profile') {
          <div class="risk-profile-layout benefit-profile-layout">
            <nav class="risk-profile-nav benefit-profile-nav" aria-label="Benefit profile sections">
              <button type="button" [class.active]="activeSection === 'context'" (click)="setActiveSection('context')">
                <span pmConsoleIcon="panel-top" aria-hidden="true"></span>
                <span>Context</span>
              </button>
              <button type="button" [class.active]="activeSection === 'measure'" (click)="setActiveSection('measure')">
                <span pmConsoleIcon="chart-no-axes-column" aria-hidden="true"></span>
                <span>Measure</span>
              </button>
            </nav>

            <section class="risk-profile-panel benefit-profile-panel">
              @if (activeSection === 'context') {
                <div class="benefit-profile-summary-grid" aria-label="Benefit summary">
                  <article>
                    <span>Benefit category</span>
                    <strong>{{ record.category || 'Not selected' }}</strong>
                    <small>{{ record.benefitType || 'Benefit type TBD' }}</small>
                  </article>
                  <article>
                    <span>Realisation date</span>
                    <strong>{{ displayDate(record.realizationDate) }}</strong>
                    <small>{{ record.state || 'Active' }}</small>
                  </article>
                  <article>
                    <span>Tracking readiness</span>
                    <strong>{{ readinessScore(record) }}%</strong>
                    <small>{{ record.measures.length }} measure(s), {{ record.recipients.length }} recipient(s)</small>
                  </article>
                </div>

                <div class="risk-profile-form-grid benefit-profile-form-grid">
                  <app-pm-console-field label="Linked Project" type="select" [value]="record.project" [options]="projectOptions" ariaLabel="Linked Project" fieldClass="risk-profile-field benefit-profile-field" [mandatory]="true" (valueChange)="updateField('project', $event)" />
                  <app-pm-console-field label="Benefit Category" type="select" [value]="record.category" [options]="categoryOptions" ariaLabel="Benefit Category" fieldClass="risk-profile-field benefit-profile-field" [mandatory]="true" (valueChange)="updateField('category', $event)" />
                  <app-pm-console-field label="Benefit Name" [value]="record.benefitName" placeholder="Type benefit name" ariaLabel="Benefit Name" fieldClass="risk-profile-field benefit-profile-field" [mandatory]="true" [wide]="true" (valueChange)="updateField('benefitName', $event)" />
                  <app-pm-console-field label="Benefit State" type="select" [value]="record.state" [options]="stateOptions" ariaLabel="Benefit State" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('state', $event)" />
                  <app-pm-console-field label="Benefit Stage" type="select" [value]="record.stage" [options]="stageOptions" ariaLabel="Benefit Stage" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('stage', $event)" />
                  <app-pm-console-field label="Realisation Date" type="date" [value]="dateInputValue(record.realizationDate)" ariaLabel="Realisation Date" fieldClass="risk-profile-field benefit-profile-field" [mandatory]="true" (valueChange)="updateField('realizationDate', $event)" />
                  <app-pm-console-field label="Benefit Description" type="textarea" [value]="record.description" placeholder="Describe the benefit" ariaLabel="Benefit Description" fieldClass="risk-profile-field benefit-profile-field" [wide]="true" (valueChange)="updateField('description', $event)" />
                  <app-pm-console-field label="Outcomes" type="textarea" [value]="record.outcomes" placeholder="Capture the expected outcome" ariaLabel="Outcomes" fieldClass="risk-profile-field benefit-profile-field" [wide]="true" (valueChange)="updateField('outcomes', $event)" />
                  <app-pm-console-field label="Product" type="select" [value]="record.product" [options]="productOptions" placeholder="Select product" ariaLabel="Product" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('product', $event)" />
                  <app-pm-console-field label="Strategic Objective" type="select" [value]="record.strategicObjective" [options]="strategicObjectiveOptions" placeholder="Select objective" ariaLabel="Strategic Objective" fieldClass="risk-profile-field benefit-profile-field" [wide]="true" (valueChange)="updateField('strategicObjective', $event)" />
                </div>

                <section class="benefit-profile-card benefit-profile-objectives" aria-label="Business plan objectives">
                  <header>
                    <div>
                      <span class="risk-profile-section-eyebrow">Benefit alignment</span>
                      <strong>Business Plan Objectives</strong>
                    </div>
                    <button class="risk-profile-add-treatment" type="button" (click)="toggleObjectiveComposer()">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      Add Business Plan Objective
                    </button>
                  </header>

                  @if (showObjectiveComposer) {
                    <div class="benefit-inline-composer">
                      <app-pm-console-field label="Division" type="select" [value]="objectiveDraft.division" [options]="divisionOptions" placeholder="Select division" ariaLabel="Division" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateObjectiveDraft('division', $event)" />
                      <app-pm-console-field label="Branch" type="select" [value]="objectiveDraft.branch" [options]="branchOptions" placeholder="Select branch" ariaLabel="Branch" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateObjectiveDraft('branch', $event)" />
                      <app-pm-console-field label="Section" type="select" [value]="objectiveDraft.section" [options]="sectionOptions" placeholder="Select section" ariaLabel="Section" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateObjectiveDraft('section', $event)" />
                      <app-pm-console-field label="Objective" [value]="objectiveDraft.objective" placeholder="Type objective" ariaLabel="Objective" fieldClass="risk-profile-field benefit-profile-field" [wide]="true" (valueChange)="updateObjectiveDraft('objective', $event)" />
                      <div class="benefit-inline-actions wide">
                        <button class="risk-profile-primary" type="button" [disabled]="!canAddObjective()" (click)="addObjective()">Add</button>
                        <button class="risk-profile-secondary" type="button" (click)="cancelObjectiveComposer()">Cancel</button>
                      </div>
                    </div>
                  }

                  @if (record.businessPlanObjectives.length) {
                    <div class="benefit-objective-list">
                      @for (objective of record.businessPlanObjectives; track objective.id) {
                        <article>
                          <strong>{{ objective.objective }}</strong>
                          <small>{{ objective.division }} · {{ objective.branch }} · {{ objective.section }}</small>
                        </article>
                      }
                    </div>
                  } @else {
                    <p class="risk-profile-empty-note benefit-profile-empty-note">No Business Plan Objectives linked.</p>
                  }
                </section>

                <section class="benefit-profile-card benefit-profile-ownership" aria-label="Benefit ownership">
                  <header>
                    <div>
                      <span class="risk-profile-section-eyebrow">Ownership</span>
                      <strong>Manager, owner, and recipients</strong>
                    </div>
                  </header>
                  <div class="risk-profile-form-grid benefit-profile-form-grid">
                    <app-pm-console-field label="Benefit Manager" type="select" [value]="record.manager" [options]="ownerOptions" ariaLabel="Benefit Manager" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('manager', $event)" />
                    <app-pm-console-field label="Benefit Owner" type="select" [value]="record.owner" [options]="ownerOptions" ariaLabel="Benefit Owner" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('owner', $event)" />
                  </div>

                  <div class="benefit-recipient-head">
                    <span class="risk-profile-section-eyebrow">Recipients</span>
                    <button class="risk-profile-add-treatment" type="button" (click)="toggleRecipientComposer()">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      Add Stakeholder
                    </button>
                  </div>

                  @if (showRecipientComposer) {
                    <div class="benefit-inline-composer">
                      <app-pm-console-field label="Recipient" type="select" [value]="recipientDraft.recipient" [options]="recipientOptions" placeholder="Select recipient" ariaLabel="Recipient" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateRecipientDraft('recipient', $event)" />
                      <app-pm-console-field label="Level of Impact" type="select" [value]="recipientDraft.impactLevel" [options]="impactOptions" placeholder="Select level" ariaLabel="Level of Impact" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateRecipientDraft('impactLevel', $event)" />
                      <app-pm-console-field label="Start Date" type="date" [value]="recipientDraft.startDate" ariaLabel="Recipient Start Date" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateRecipientDraft('startDate', $event)" />
                      <app-pm-console-field label="End Date" type="date" [value]="recipientDraft.endDate" ariaLabel="Recipient End Date" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateRecipientDraft('endDate', $event)" />
                      <app-pm-console-field label="Comment" type="textarea" [value]="recipientDraft.comment" placeholder="Type comment" ariaLabel="Recipient Comment" fieldClass="risk-profile-field benefit-profile-field" [wide]="true" (valueChange)="updateRecipientDraft('comment', $event)" />
                      <div class="benefit-inline-actions wide">
                        <button class="risk-profile-primary" type="button" [disabled]="!canAddRecipient()" (click)="addRecipient()">Add</button>
                        <button class="risk-profile-secondary" type="button" (click)="cancelRecipientComposer()">Cancel</button>
                      </div>
                    </div>
                  }

                  @if (record.recipients.length) {
                    <div class="dependency-register-table-shell benefit-profile-table-shell">
                      <table class="dependency-register-table benefit-profile-table" aria-label="Benefit recipients">
                        <thead><tr><th>Recipient</th><th>Impact</th><th>Start Date</th><th>End Date</th><th>Comment</th></tr></thead>
                        <tbody>
                          @for (recipient of record.recipients; track recipient.id) {
                            <tr>
                              <td class="dependency-register-primary"><strong>{{ recipient.recipient }}</strong></td>
                              <td>{{ recipient.impactLevel }}</td>
                              <td>{{ displayDate(recipient.startDate) }}</td>
                              <td>{{ displayDate(recipient.endDate) }}</td>
                              <td>{{ recipient.comment || 'No comment' }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  } @else {
                    <p class="risk-profile-empty-note benefit-profile-empty-note">No recipients added yet.</p>
                  }
                </section>

                <section class="benefit-profile-card" aria-label="Benefit impact and likelihood">
                  <header>
                    <div>
                      <span class="risk-profile-section-eyebrow">Assessment</span>
                      <strong>Impact and likelihood</strong>
                    </div>
                  </header>
                  <div class="risk-profile-form-grid benefit-profile-form-grid">
                    <app-pm-console-field label="Impact" type="select" [value]="record.impact" [options]="impactOptions" placeholder="Select impact" ariaLabel="Impact" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('impact', $event)" />
                    <app-pm-console-field label="Impact Justification" type="textarea" [value]="record.impactJustification" placeholder="Add justification" ariaLabel="Impact Justification" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('impactJustification', $event)" />
                    <app-pm-console-field label="Likelihood" type="select" [value]="record.likelihood" [options]="likelihoodOptions" placeholder="Select likelihood" ariaLabel="Likelihood" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('likelihood', $event)" />
                    <app-pm-console-field label="Likelihood Justification" type="textarea" [value]="record.likelihoodJustification" placeholder="Add justification" ariaLabel="Likelihood Justification" fieldClass="risk-profile-field benefit-profile-field" (valueChange)="updateField('likelihoodJustification', $event)" />
                  </div>
                </section>
              } @else {
                <section class="benefit-profile-card benefit-profile-measure-board" aria-label="Benefit measure board">
                  <header>
                    <div>
                      <span class="risk-profile-section-eyebrow">Measures</span>
                      <strong>{{ measureCountLabel(record.measures) }}</strong>
                    </div>
                    <button class="risk-profile-add-treatment" type="button" (click)="openMeasureDrawer()">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      Add Measure
                    </button>
                  </header>
                  <p>Capture how the benefit will be measured, the owner of the evidence, and the target value PMO can track over time.</p>
                  <ng-container [ngTemplateOutlet]="measureTable" [ngTemplateOutletContext]="{ measures: record.measures }"></ng-container>
                </section>
              }
            </section>
          </div>
        } @else {
          <section class="benefit-track-panel" aria-label="Track benefit">
            <div class="benefit-track-overview">
              <article>
                <span>Benefit Name</span>
                <strong>{{ record.benefitName }}</strong>
                <small>{{ record.project }}</small>
              </article>
              <article>
                <span>Benefit Stage</span>
                <label class="benefit-track-select">
                  <select [value]="record.stage" aria-label="Benefit Stage" (change)="updateField('stage', $any($event.target).value)">
                    @for (stage of stageOptions; track stage) {
                      <option [value]="stage" [selected]="stage === record.stage">{{ stage }}</option>
                    }
                  </select>
                  <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                </label>
              </article>
              <article>
                <span>Realisation Date</span>
                <strong>{{ displayDate(record.realizationDate) }}</strong>
                <small>{{ record.manager || 'Manager to confirm' }}</small>
              </article>
            </div>

            <section class="benefit-status-board" aria-label="Benefit status">
              <div class="benefit-status-head">
                <div>
                  <span class="risk-profile-section-eyebrow">Benefit status</span>
                  <strong>Overall Status</strong>
                </div>
              </div>
              <div class="benefit-status-options" role="radiogroup" aria-label="Overall Status">
                @for (status of statusOptions; track status) {
                  <button type="button" role="radio" [attr.aria-checked]="record.overallStatus === status" [class.active]="record.overallStatus === status" [class]="benefitStatusTone(status)" (click)="updateField('overallStatus', status)">
                    <span pmConsoleIcon="circle" aria-hidden="true"></span>
                    {{ status }}
                  </button>
                }
              </div>
              <app-pm-console-field label="Comment" type="textarea" [value]="record.statusComment" placeholder="Type comments here" ariaLabel="Benefit status comment" fieldClass="risk-profile-field benefit-profile-field" [wide]="true" (valueChange)="updateField('statusComment', $event)" />
            </section>

            <section class="benefit-profile-card benefit-track-measures" aria-label="Tracked measures">
              <header>
                <div>
                  <span class="risk-profile-section-eyebrow">Measure</span>
                  <strong>{{ measureCountLabel(record.measures) }}</strong>
                </div>
                <button class="risk-profile-add-treatment" type="button" (click)="openMeasureDrawer()">
                  <span pmConsoleIcon="plus" aria-hidden="true"></span>
                  Add Measure
                </button>
              </header>
              <ng-container [ngTemplateOutlet]="measureTable" [ngTemplateOutletContext]="{ measures: record.measures }"></ng-container>
            </section>
          </section>
        }

        <footer class="risk-profile-footer benefit-profile-footer">
          <div class="risk-profile-actions benefit-profile-actions">
            <span [pmConsoleStatusPill]="record.overallStatus || 'To Commence'" baseClass="dependency-register-pill" [tone]="benefitStatusTone(record.overallStatus)"></span>
            <button class="risk-profile-secondary" type="button">View activity</button>
            <button class="risk-profile-secondary" type="button">More actions</button>
            <button class="risk-profile-primary benefit-profile-complete" type="button" (click)="completeProfile.emit(record.id)">Mark realized</button>
          </div>
        </footer>
      </article>

      <ng-template #measureTable let-measures="measures">
        @if (measures.length) {
          <div class="dependency-register-table-shell benefit-profile-table-shell">
            <table class="dependency-register-table benefit-profile-table benefit-measure-table" aria-label="Benefit measures">
              <thead><tr><th>Measure</th><th>Owner</th><th>Status</th><th>Baseline</th><th>Target</th><th>Dates</th><th></th></tr></thead>
              <tbody>
                @for (measure of measures; track measure.id) {
                  <tr>
                    <td class="dependency-register-primary"><strong>{{ measure.measure }}</strong><small>{{ measure.description || measure.informationSource || 'No description added' }}</small></td>
                    <td>{{ measure.owner || 'Owner to confirm' }}</td>
                    <td><span [pmConsoleStatusPill]="measure.status" baseClass="dependency-register-pill" [tone]="benefitStatusTone(measure.status)"></span></td>
                    <td>{{ measure.metric }} {{ measure.baselineValue || '0' }}</td>
                    <td>{{ measure.metric }} {{ measure.targetValue || '0' }}</td>
                    <td class="dependency-register-baseline"><strong>{{ displayDate(measure.startDate) }}</strong><small>{{ displayDate(measure.endDate) }}</small></td>
                    <td class="schedule-table-actions">
                      <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + measure.measure">
                        <button class="danger" type="button" role="menuitem" (click)="removeMeasure.emit(measure.id)">
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
          <div class="benefit-measure-empty">
            <span pmConsoleIcon="chart-no-axes-column" aria-hidden="true"></span>
            <strong>No measures added yet</strong>
            <p>Add the first baseline and target so this benefit can be tracked after the plan is approved.</p>
            <button class="risk-profile-add-treatment" type="button" (click)="openMeasureDrawer()">
              <span pmConsoleIcon="plus" aria-hidden="true"></span>
              Add Measure
            </button>
          </div>
        }
      </ng-template>

      @if (isMeasureDrawerOpen) {
        <app-pm-console-plan-drawer
          title="Add Measure"
          eyebrow="Benefit measure"
          description="Define the metric, target, owner, and evidence source used to track this benefit."
          submitLabel="Save Measure"
          [submitDisabled]="!canSaveMeasureDraft()"
          closeAriaLabel="Close measure drawer"
          panelClass="benefit-measure-drawer"
          (close)="closeMeasureDrawer()"
          (submitForm)="saveMeasure($event)"
        >
          <div planDrawerBody class="dependency-drawer-grid benefit-measure-drawer-grid">
            <app-pm-console-field label="Measure Name" [value]="measureDraft.measure" placeholder="Type measure name" ariaLabel="Measure Name" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateMeasureDraft('measure', $event)" />
            <app-pm-console-field label="Measure Owner" type="select" [value]="measureDraft.owner" [options]="ownerOptions" placeholder="Select measure owner" ariaLabel="Measure Owner" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('owner', $event)" />
            <app-pm-console-field label="Measure Description" type="textarea" [value]="measureDraft.description" placeholder="Type measure here" ariaLabel="Measure Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateMeasureDraft('description', $event)" />
            <app-pm-console-field label="Metric" type="select" [value]="measureDraft.metric" [options]="metricOptions" ariaLabel="Metric" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('metric', $event)" />
            <app-pm-console-field label="Polarity" type="select" [value]="measureDraft.polarity" [options]="polarityOptions" ariaLabel="Polarity" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('polarity', $event)" />
            <app-pm-console-field label="Baseline Value" [value]="measureDraft.baselineValue" placeholder="0" ariaLabel="Baseline Value" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('baselineValue', $event)" />
            <app-pm-console-field label="Target Value" [value]="measureDraft.targetValue" placeholder="0" ariaLabel="Target Value" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('targetValue', $event)" />
            <app-pm-console-field label="Frequency of Reporting" type="select" [value]="measureDraft.frequency" [options]="frequencyOptions" ariaLabel="Frequency of Reporting" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('frequency', $event)" />
            <app-pm-console-field label="Start Date" type="date" [value]="measureDraft.startDate" ariaLabel="Start Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateMeasureDraft('startDate', $event)" />
            <app-pm-console-field label="End Date" type="date" [value]="measureDraft.endDate" ariaLabel="End Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateMeasureDraft('endDate', $event)" />
            <app-pm-console-field label="Dependencies" type="textarea" [value]="measureDraft.dependencies" placeholder="Type description here" ariaLabel="Dependencies" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('dependencies', $event)" />
            <app-pm-console-field label="Information Source" type="textarea" [value]="measureDraft.informationSource" placeholder="Type description here" ariaLabel="Information Source" fieldClass="dependency-drawer-field" (valueChange)="updateMeasureDraft('informationSource', $event)" />
          </div>
        </app-pm-console-plan-drawer>
      }
    }
  `,
  styles: [
    `
      app-pm-console-benefit-profile {
        display: block;
        min-height: 0;
      }

      .benefit-profile-focus-frame app-pm-console-benefit-profile {
        height: 100%;
      }

      .benefit-profile-shell {
        gap: 16px;
      }

      .pm-projects-shell.benefit-profile-focus-shell {
        margin-top: 0;
        padding: 0;
      }

      .benefit-profile-focus-canvas.workspaces-canvas {
        overflow: hidden;
        padding: 9px 8px 16px;
      }

      .benefit-profile-focus-frame {
        background: #f7f7fc;
        display: grid;
        height: 100%;
        min-height: calc(100vh - 25px);
        overflow: hidden;
        padding: 16px 18px;
      }

      .benefit-profile-focus-frame .benefit-profile-shell {
        grid-template-rows: auto auto minmax(0, 1fr) auto;
        height: 100%;
        min-height: 0;
      }

      .benefit-profile-focus-frame .benefit-profile-layout {
        height: 100%;
        min-height: 0;
        overflow: hidden;
      }

      .benefit-profile-focus-frame .benefit-profile-panel,
      .benefit-profile-focus-frame .benefit-track-panel {
        min-height: 0;
        overflow: auto;
      }

      .benefit-profile-header {
        border-color: #e4e9f2;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
      }

      .benefit-profile-title h3 {
        color: #2f3542;
        font-weight: 500;
        max-width: 68ch;
      }

      .benefit-profile-title small {
        font-weight: 400;
      }

      .benefit-profile-actions {
        align-items: center;
        justify-content: flex-end;
      }

      .benefit-profile-shell .risk-profile-eyebrow,
      .benefit-profile-shell .risk-profile-section-eyebrow {
        font-weight: 600;
      }

      .benefit-profile-complete {
        background: #0f8f5f;
        border-color: #0f8f5f;
      }

      .benefit-profile-tabs {
        align-items: center;
        border-bottom: 1px solid #e5e9f1;
        display: flex;
        gap: 6px;
        padding: 0 18px;
      }

      .benefit-profile-tabs button {
        align-items: center;
        border-bottom: 2px solid transparent;
        color: #596273;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 7px;
        min-height: 42px;
        padding: 0 12px;
      }

      .benefit-profile-tabs button.active {
        border-bottom-color: #10069f;
        color: #10069f;
      }

      .benefit-profile-tabs .icon {
        height: 15px;
        width: 15px;
      }

      .benefit-profile-layout {
        grid-template-columns: 208px minmax(0, 1fr);
      }

      .benefit-profile-nav button {
        font-weight: 500;
      }

      .benefit-profile-nav button.active {
        font-weight: 600;
      }

      .benefit-profile-panel {
        align-content: start;
        display: grid;
        gap: 18px;
        min-height: 0;
      }

      .benefit-profile-summary-grid,
      .benefit-track-overview {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .benefit-profile-summary-grid article,
      .benefit-track-overview article {
        background: #f8fafc;
        border: 1px solid #e5eaf2;
        border-radius: 8px;
        display: grid;
        gap: 5px;
        min-height: 82px;
        padding: 14px;
      }

      .benefit-profile-summary-grid span,
      .benefit-track-overview span {
        color: #687182;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }

      .benefit-profile-summary-grid strong,
      .benefit-track-overview strong {
        color: #202633;
        font-size: 17px;
        font-weight: 600;
        line-height: 21px;
      }

      .benefit-profile-summary-grid small,
      .benefit-track-overview small {
        color: #687182;
        font-size: 11px;
        font-weight: 400;
      }

      .benefit-profile-form-grid {
        gap: 14px;
      }

      .benefit-profile-field .matrix-field-label {
        color: #2f3542;
        font-weight: 500;
      }

      .benefit-profile-field input,
      .benefit-profile-field select,
      .benefit-profile-field textarea {
        color: #303645;
        font-weight: 400;
      }

      .benefit-profile-card {
        align-content: start;
        background: #ffffff;
        border: 1px solid #e5eaf2;
        border-radius: 10px;
        box-shadow: 0 12px 32px rgba(25, 33, 61, 0.06);
        display: grid;
        gap: 14px;
        padding: 16px;
      }

      .benefit-profile-measure-board,
      .benefit-track-measures {
        align-self: start;
      }

      .benefit-profile-measure-board {
        gap: 12px;
        padding: 18px;
      }

      .benefit-profile-measure-board > header {
        margin-bottom: 2px;
      }

      .benefit-profile-measure-board > p {
        max-width: 78ch;
      }

      .benefit-profile-card header,
      .benefit-recipient-head,
      .benefit-status-head {
        align-items: center;
        display: flex;
        gap: 12px;
        justify-content: space-between;
      }

      .benefit-profile-card header div,
      .benefit-status-head div {
        display: grid;
        gap: 4px;
      }

      .benefit-profile-card header strong,
      .benefit-status-head strong {
        color: #202633;
        font-size: 15px;
        font-weight: 600;
      }

      .benefit-profile-card p,
      .benefit-measure-empty p {
        color: #687182;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        margin: 0;
      }

      .benefit-inline-composer {
        background: #f8fafc;
        border: 1px solid #e5eaf2;
        border-radius: 8px;
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding: 14px;
      }

      .benefit-inline-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .benefit-inline-actions.wide {
        grid-column: 1 / -1;
      }

      .benefit-inline-actions button:disabled {
        background: #c9d0e1;
        border-color: #c9d0e1;
        color: #ffffff;
        cursor: default;
      }

      .benefit-objective-list {
        display: grid;
        gap: 8px;
      }

      .benefit-objective-list article {
        background: #f8fafc;
        border: 1px solid #e5eaf2;
        border-radius: 8px;
        display: grid;
        gap: 4px;
        padding: 12px;
      }

      .benefit-objective-list strong {
        color: #2b3240;
        font-size: 12px;
        font-weight: 600;
      }

      .benefit-objective-list small {
        color: #687182;
        font-size: 11px;
        font-weight: 400;
      }

      .benefit-profile-table-shell {
        border-radius: 8px;
      }

      .benefit-profile-measure-board .benefit-profile-table-shell,
      .benefit-track-measures .benefit-profile-table-shell {
        margin-top: 4px;
      }

      .benefit-profile-table th,
      .benefit-profile-table td {
        white-space: normal;
      }

      .benefit-measure-table th,
      .benefit-measure-table td {
        padding-bottom: 14px;
        padding-top: 14px;
      }

      .benefit-measure-table .dependency-register-primary strong {
        color: #303645;
        font-size: 12px;
        font-weight: 500;
      }

      .benefit-measure-table .dependency-register-primary small {
        font-weight: 400;
      }

      .benefit-track-panel {
        display: grid;
        gap: 16px;
        padding: 18px;
      }

      .benefit-track-select {
        align-items: center;
        background: #ffffff;
        border: 1px solid #dfe5ef;
        border-radius: 8px;
        display: flex;
        min-height: 36px;
        padding: 0 10px;
      }

      .benefit-track-select select {
        appearance: none;
        background: transparent;
        border: 0;
        color: #202633;
        flex: 1 1 auto;
        font: inherit;
        font-size: 12px;
        font-weight: 400;
        outline: 0;
      }

      .benefit-track-select .icon {
        color: #687182;
        height: 14px;
        width: 14px;
      }

      .benefit-status-board {
        background: #ffffff;
        border: 1px solid #e5eaf2;
        border-radius: 10px;
        display: grid;
        gap: 14px;
        padding: 16px;
      }

      .benefit-status-options {
        display: grid;
        gap: 9px;
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }

      .benefit-status-options button {
        align-items: center;
        background: #f8fafc;
        border: 1px solid #e4eaf2;
        border-radius: 8px;
        color: #485367;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 7px;
        justify-content: center;
        min-height: 38px;
        padding: 0 10px;
      }

      .benefit-status-options button.active {
        background: #eef2ff;
        border-color: rgba(16, 6, 159, 0.32);
        color: #10069f;
      }

      .benefit-status-options button.green.active {
        background: #e8f8ef;
        border-color: rgba(16, 143, 95, 0.32);
        color: #0f8f5f;
      }

      .benefit-status-options button.red.active {
        background: #fff0f0;
        border-color: rgba(198, 55, 55, 0.32);
        color: #c03737;
      }

      .benefit-status-options button.amber.active {
        background: #fff6e8;
        border-color: rgba(197, 122, 32, 0.32);
        color: #b26919;
      }

      .benefit-status-options .icon {
        height: 10px;
        width: 10px;
      }

      .benefit-measure-empty {
        align-items: center;
        background: #f8fafc;
        border: 1px dashed #cfd8e6;
        border-radius: 8px;
        display: grid;
        gap: 8px;
        justify-items: center;
        min-height: 164px;
        padding: 22px;
        text-align: center;
      }

      .benefit-measure-empty > .icon {
        align-items: center;
        background: #f0efff;
        border-radius: 12px;
        color: #10069f;
        display: inline-flex;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .benefit-measure-empty strong {
        color: #202633;
        font-size: 14px;
        font-weight: 600;
      }

      .plan-entry-drawer.benefit-measure-drawer {
        width: min(820px, calc(100vw - 72px));
      }

      .benefit-measure-drawer-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @media (max-width: 940px) {
        .benefit-profile-layout,
        .benefit-profile-summary-grid,
        .benefit-track-overview,
        .benefit-status-options,
        .benefit-inline-composer,
        .benefit-measure-drawer-grid {
          grid-template-columns: 1fr;
        }

        .benefit-profile-nav {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .plan-entry-drawer.benefit-measure-drawer {
          width: 100vw;
        }
      }
    `,
  ],
})
export class PmConsoleBenefitProfileComponent {
  @Input() benefit: BenefitProfileRecord | null = null;
  @Input() projectOptions: string[] = [];
  @Input() categoryOptions: string[] = [];
  @Input() ownerOptions: string[] = [];
  @Input() productOptions: string[] = [];
  @Input() strategicObjectiveOptions: string[] = [];

  @Output() readonly closeProfile = new EventEmitter<void>();
  @Output() readonly completeProfile = new EventEmitter<string>();
  @Output() readonly fieldChange = new EventEmitter<BenefitProfileFieldChange>();
  @Output() readonly objectiveAdd = new EventEmitter<BenefitProfileObjectiveLink>();
  @Output() readonly recipientAdd = new EventEmitter<BenefitProfileRecipientRow>();
  @Output() readonly measureAdd = new EventEmitter<BenefitProfileMeasureRow>();
  @Output() readonly removeMeasure = new EventEmitter<string>();

  activeTab: BenefitProfileTab = 'profile';
  activeSection: BenefitProfileSection = 'context';
  showObjectiveComposer = false;
  showRecipientComposer = false;
  isMeasureDrawerOpen = false;

  readonly stateOptions = ['Active', 'Draft', 'Paused', 'Closed'];
  readonly stageOptions = ['Planned', 'Validating', 'In realization', 'Realized'];
  readonly statusOptions = ['Off Track', 'On Track', 'Delayed', 'Harvested', 'To Commence'];
  readonly impactOptions = ['Low', 'Medium', 'High', 'Transformational'];
  readonly likelihoodOptions = ['Low', 'Medium', 'High', 'Certain'];
  readonly divisionOptions = ['Strategy', 'Research Office', 'Operations', 'Corporate Services'];
  readonly branchOptions = ['Portfolio Delivery', 'Innovation Enablement', 'Service Quality', 'PMO'];
  readonly sectionOptions = ['Research Platforms', 'Sponsor Services', 'Data Operations', 'Governance'];
  readonly recipientOptions = ['Researchers', 'Sponsor Forum', 'PMO Desk', 'Operations Leads', 'Strategy Office'];
  readonly metricOptions = ['#', '%', '$', 'Days', 'Score'];
  readonly polarityOptions = ['Increase', 'Decrease', 'Maintain'];
  readonly frequencyOptions = ['Weekly', 'Monthly', 'Quarterly', 'Annually'];

  objectiveDraft: ObjectiveDraft = this.createObjectiveDraft();
  recipientDraft: RecipientDraft = this.createRecipientDraft();
  measureDraft: MeasureDraft = this.createMeasureDraft();

  setActiveTab(tab: BenefitProfileTab): void {
    this.activeTab = tab;
  }

  setActiveSection(section: BenefitProfileSection): void {
    this.activeSection = section;
  }

  updateField(field: BenefitProfileField, value: string): void {
    this.fieldChange.emit({ field, value });
  }

  toggleObjectiveComposer(): void {
    this.showObjectiveComposer = !this.showObjectiveComposer;
  }

  cancelObjectiveComposer(): void {
    this.showObjectiveComposer = false;
    this.objectiveDraft = this.createObjectiveDraft();
  }

  updateObjectiveDraft(field: keyof ObjectiveDraft, value: string): void {
    this.objectiveDraft = {
      ...this.objectiveDraft,
      [field]: value,
    };
  }

  canAddObjective(): boolean {
    return Boolean(this.objectiveDraft.objective.trim());
  }

  addObjective(): void {
    if (!this.canAddObjective()) return;
    this.objectiveAdd.emit({
      id: `benefit-objective-${Date.now()}`,
      division: this.objectiveDraft.division || 'Strategy',
      branch: this.objectiveDraft.branch || 'Portfolio Delivery',
      section: this.objectiveDraft.section || 'Governance',
      objective: this.objectiveDraft.objective.trim(),
    });
    this.cancelObjectiveComposer();
  }

  toggleRecipientComposer(): void {
    this.showRecipientComposer = !this.showRecipientComposer;
  }

  cancelRecipientComposer(): void {
    this.showRecipientComposer = false;
    this.recipientDraft = this.createRecipientDraft();
  }

  updateRecipientDraft(field: keyof RecipientDraft, value: string): void {
    this.recipientDraft = {
      ...this.recipientDraft,
      [field]: value,
    };
  }

  canAddRecipient(): boolean {
    return Boolean(this.recipientDraft.recipient.trim());
  }

  addRecipient(): void {
    if (!this.canAddRecipient()) return;
    this.recipientAdd.emit({
      id: `benefit-recipient-${Date.now()}`,
      recipient: this.recipientDraft.recipient.trim(),
      impactLevel: this.recipientDraft.impactLevel || 'Medium',
      startDate: this.recipientDraft.startDate,
      endDate: this.recipientDraft.endDate,
      comment: this.recipientDraft.comment.trim(),
    });
    this.cancelRecipientComposer();
  }

  openMeasureDrawer(): void {
    this.measureDraft = this.createMeasureDraft();
    this.isMeasureDrawerOpen = true;
  }

  closeMeasureDrawer(): void {
    this.isMeasureDrawerOpen = false;
  }

  updateMeasureDraft(field: keyof MeasureDraft, value: string): void {
    this.measureDraft = {
      ...this.measureDraft,
      [field]: value,
    };
  }

  canSaveMeasureDraft(): boolean {
    return Boolean(this.measureDraft.measure.trim() && this.measureDraft.startDate.trim() && this.measureDraft.endDate.trim());
  }

  saveMeasure(event: Event): void {
    event.preventDefault();
    if (!this.canSaveMeasureDraft()) return;
    this.measureAdd.emit({
      id: `benefit-measure-${Date.now()}`,
      measure: this.measureDraft.measure.trim(),
      owner: this.measureDraft.owner.trim(),
      description: this.measureDraft.description.trim(),
      metric: this.measureDraft.metric || '#',
      polarity: this.measureDraft.polarity || 'Increase',
      baselineValue: this.measureDraft.baselineValue.trim() || '0',
      targetValue: this.measureDraft.targetValue.trim() || '0',
      frequency: this.measureDraft.frequency || 'Monthly',
      startDate: this.measureDraft.startDate,
      endDate: this.measureDraft.endDate,
      status: this.measureDraft.status || 'To Commence',
      dependencies: this.measureDraft.dependencies.trim(),
      informationSource: this.measureDraft.informationSource.trim(),
    });
    this.closeMeasureDrawer();
  }

  measureCountLabel(measures: BenefitProfileMeasureRow[]): string {
    return measures.length === 1 ? '1 measure' : `${measures.length} measures`;
  }

  readinessScore(record: BenefitProfileRecord): number {
    const checks = [
      record.category,
      record.benefitName,
      record.owner,
      record.realizationDate,
      record.strategicObjective,
      record.measures.length ? 'measures' : '',
      record.recipients.length ? 'recipients' : '',
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  benefitStatusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('off')) return 'red';
    if (normalized.includes('delay') || normalized.includes('attention')) return 'amber';
    if (normalized.includes('track') || normalized.includes('harvest') || normalized.includes('realized') || normalized.includes('realised')) return 'green';
    if (normalized.includes('commence') || normalized.includes('planned')) return 'blue';
    return 'neutral';
  }

  displayDate(value: string): string {
    if (!value) return 'N/A';
    const inputValue = this.dateInputValue(value);
    const parsed = inputValue ? new Date(`${inputValue}T00:00:00Z`) : new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(parsed);
  }

  dateInputValue(value: string): string {
    if (!value) return '';
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return value;
    const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      return `${slashMatch[3]}-${slashMatch[1].padStart(2, '0')}-${slashMatch[2].padStart(2, '0')}`;
    }
    const textMatch = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
    const monthIndex = textMatch ? ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(textMatch[2].toLowerCase()) : -1;
    if (textMatch && monthIndex >= 0) {
      return `${textMatch[3]}-${String(monthIndex + 1).padStart(2, '0')}-${textMatch[1].padStart(2, '0')}`;
    }
    return '';
  }

  private createObjectiveDraft(): ObjectiveDraft {
    return {
      division: '',
      branch: '',
      section: '',
      objective: '',
    };
  }

  private createRecipientDraft(): RecipientDraft {
    return {
      recipient: '',
      impactLevel: '',
      startDate: '',
      endDate: '',
      comment: '',
    };
  }

  private createMeasureDraft(): MeasureDraft {
    return {
      measure: '',
      owner: '',
      description: '',
      metric: '#',
      polarity: 'Increase',
      baselineValue: '0',
      targetValue: '0',
      frequency: 'Monthly',
      startDate: '',
      endDate: '',
      status: 'To Commence',
      dependencies: '',
      informationSource: '',
    };
  }
}
