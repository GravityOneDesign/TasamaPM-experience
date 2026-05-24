import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PmConsolePlanDrawerComponent } from './pm-console-plan-drawer.component';
import { PmConsoleFieldComponent } from './shared/pm-console-field.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleRiskMatrixComponent } from './shared/pm-console-risk-matrix.component';
import { PmConsoleStatusPillComponent } from './shared/pm-console-status-pill.component';
import { PmConsoleTableActionComponent } from './shared/pm-console-table-action.component';

type PlanDrawersHost = Record<string, any>;

@Component({
  selector: 'app-pm-console-plan-drawers',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleFieldComponent,
    PmConsoleIconComponent,
    PmConsolePlanDrawerComponent,
    PmConsoleRiskMatrixComponent,
    PmConsoleStatusPillComponent,
    PmConsoleTableActionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (selectedPage === 'project-plan' && projectPlanEntry === 'quick') {
                @if (isBudgetDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="budgetPlanConfig.drawerTitle"
                    [eyebrow]="budgetPlanConfig.fieldName"
                    [description]="budgetPlanConfig.drawerBody"
                    [submitLabel]="budgetPlanConfig.actionLabel"
                    [submitDisabled]="!canSaveBudgetYearDraft()"
                    closeAriaLabel="Close budget drawer"
                    panelClass="budget-drawer"
                    (close)="closeBudgetDrawer()"
                    (submitForm)="saveBudgetDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid budget-drawer-grid">
                      <app-pm-console-field label="Fiscal year" type="select" [value]="budgetYearDraft.fy" [options]="budgetPlanConfig.fyOptions" [placeholder]="budgetPlanConfig.fyPlaceholder" ariaLabel="Fiscal year" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateBudgetYearDraft('fy', $event)" />
                      <app-pm-console-field label="CAPEX Baseline (FY)" type="money" inputType="number" [value]="budgetYearDraft.baselineCapex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="CAPEX Baseline (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('baselineCapex', $event)" />
                      <app-pm-console-field label="OPEX Baseline (FY)" type="money" inputType="number" [value]="budgetYearDraft.baselineOpex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="OPEX Baseline (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('baselineOpex', $event)" />
                      <app-pm-console-field label="CAPEX Forecast (FY)" type="money" inputType="number" [value]="budgetYearDraft.forecastCapex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="CAPEX Forecast (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('forecastCapex', $event)" />
                      <app-pm-console-field label="OPEX Forecast (FY)" type="money" inputType="number" [value]="budgetYearDraft.forecastOpex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="OPEX Forecast (FY)" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetYearDraft('forecastOpex', $event)" />
                      <app-pm-console-field label="CAPEX Committed" type="money" inputType="number" [value]="budgetYearDraft.committedCapex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="CAPEX committed" fieldClass="dependency-drawer-field" min="0" step="100" (valueChange)="updateBudgetYearDraft('committedCapex', $event)" />
                      <app-pm-console-field label="OPEX Committed" type="money" inputType="number" [value]="budgetYearDraft.committedOpex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="OPEX committed" fieldClass="dependency-drawer-field" min="0" step="100" (valueChange)="updateBudgetYearDraft('committedOpex', $event)" />
                      <app-pm-console-field label="CAPEX YTD Actual" type="money" inputType="number" [value]="budgetYearDraft.actualCapex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="CAPEX YTD actual" fieldClass="dependency-drawer-field" min="0" step="100" (valueChange)="updateBudgetYearDraft('actualCapex', $event)" />
                      <app-pm-console-field label="OPEX YTD Actual" type="money" inputType="number" [value]="budgetYearDraft.actualOpex" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="OPEX YTD actual" fieldClass="dependency-drawer-field" min="0" step="100" (valueChange)="updateBudgetYearDraft('actualOpex', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isBudgetFundingDrawerOpen) {
                  @let year = activeBudgetYear;
                  <app-pm-console-plan-drawer
                    [title]="budgetPlanConfig.fundingTitle"
                    [eyebrow]="budgetPlanConfig.fieldName"
                    [description]="budgetPlanConfig.fundingBody"
                    submitLabel="Add funding source"
                    [submitDisabled]="!year || !canSaveBudgetFundingDraft()"
                    closeAriaLabel="Close funding sources drawer"
                    panelClass="budget-funding-drawer"
                    (close)="closeBudgetFundingDrawer()"
                    (submitForm)="saveBudgetFundingDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid budget-funding-drawer-grid">
                      <app-pm-console-field
                        label="Funding source"
                        [value]="budgetFundingSourceDraft.source"
                        [placeholder]="budgetPlanConfig.sourcePlaceholder"
                        ariaLabel="Funding source"
                        fieldClass="dependency-drawer-field"
                        [mandatory]="true"
                        [wide]="true"
                        (valueChange)="updateBudgetFundingDraft('source', $event)"
                      />
                      <app-pm-console-field
                        label="Type"
                        type="select"
                        [value]="budgetFundingSourceDraft.type"
                        [options]="budgetPlanConfig.sourceTypeOptions"
                        [placeholder]="budgetPlanConfig.sourceTypePlaceholder"
                        ariaLabel="Funding type"
                        fieldClass="dependency-drawer-field"
                        [mandatory]="true"
                        (valueChange)="updateBudgetFundingDraft('type', $event)"
                      />
                      <app-pm-console-field label="Amount" type="money" inputType="number" [value]="budgetFundingSourceDraft.amount" [placeholder]="budgetPlanConfig.amountPlaceholder" ariaLabel="Funding amount" fieldClass="dependency-drawer-field" min="0" step="1000" [mandatory]="true" (valueChange)="updateBudgetFundingDraft('amount', $event)" />
                      <app-pm-console-field
                        label="Status"
                        type="select"
                        [value]="budgetFundingSourceDraft.status"
                        [options]="budgetPlanConfig.sourceStatusOptions"
                        ariaLabel="Funding status"
                        fieldClass="dependency-drawer-field"
                        (valueChange)="updateBudgetFundingDraft('status', $event)"
                      />
                      <app-pm-console-field
                        label="Notes"
                        type="textarea"
                        [value]="budgetFundingSourceDraft.notes"
                        placeholder="Add allocation or approval notes"
                        ariaLabel="Funding notes"
                        fieldClass="dependency-drawer-field"
                        [wide]="true"
                        (valueChange)="updateBudgetFundingDraft('notes', $event)"
                      />
                    </div>
                    @if ((year?.fundingSources?.length || 0) > 0) {
                      <div planDrawerBody class="dependency-register-table-shell budget-drawer-table-shell">
                        <table class="dependency-register-table budget-secondary-table" aria-label="Saved funding sources">
                          <thead>
                            <tr>
                              <th>Source</th>
                              <th>Type</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (row of year?.fundingSources || []; track row.id) {
                              <tr>
                                <td class="dependency-register-primary">
                                  <strong>{{ row.source }}</strong>
                                  <small>{{ row.notes || 'Funding source detail' }}</small>
                                </td>
                                <td>{{ row.type }}</td>
                                <td>{{ formatBudgetCurrency(row.amount) }}</td>
                                <td><span [pmConsoleStatusPill]="row.status" baseClass="dependency-register-pill" [tone]="row.status === 'Confirmed' ? 'indigo' : row.status === 'Pending approval' ? 'amber' : 'neutral'"></span></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                  </app-pm-console-plan-drawer>
                }
                @if (isBudgetMonthlyDrawerOpen) {
                  @let year = activeBudgetYear;
                  <app-pm-console-plan-drawer
                    [title]="budgetPlanConfig.monthlyTitle"
                    [eyebrow]="budgetPlanConfig.fieldName"
                    [description]="budgetPlanConfig.monthlyBody"
                    submitLabel="Save monthly budget"
                    [submitDisabled]="!year || !budgetMonthlyEditorRows.length"
                    closeAriaLabel="Close monthly budget drawer"
                    panelClass="budget-monthly-drawer"
                    (close)="closeBudgetMonthlyDrawer()"
                    (submitForm)="saveBudgetMonthlyDrawer($event)"
                  >
                    <div planDrawerBody class="budget-month-card-list">
                      @if (!budgetMonthlyEditorRows.length) {
                        <div class="budget-quiet-empty">
                          <strong>No monthly budget rows yet</strong>
                          <span>Add the FY budget first. Monthly CAPEX and OPEX phasing rows will then be available for refinement.</span>
                        </div>
                      } @else {
                        @for (row of budgetMonthlyEditorRows; track row.id) {
                        <article class="budget-month-card">
                          <div class="budget-month-card-head">
                            <div>
                              <strong>{{ row.month }}</strong>
                              <small>{{ formatBudgetCurrency(budgetMonthlyTotal(row, 'budget')) }} baseline phasing</small>
                            </div>
                            <span class="dependency-register-count">{{ formatBudgetCurrency(budgetMonthlyAvailable(row)) }} available</span>
                          </div>
                          <div class="budget-month-card-grid">
                            <article class="budget-month-stream">
                              <strong>CAPEX</strong>
                              <label><span>Budget</span><input type="number" [value]="row.capexBudget" aria-label="CAPEX budget for {{ row.month }}" disabled /></label>
                              <label><span>Forecast</span><input type="number" min="0" step="100" [value]="row.capexForecast" (input)="updateBudgetMonthlyRow(row.id, 'capexForecast', $any($event.target).value)" aria-label="CAPEX forecast for {{ row.month }}" /></label>
                              <label><span>Actual</span><input type="number" min="0" step="100" [value]="row.capexActual" (input)="updateBudgetMonthlyRow(row.id, 'capexActual', $any($event.target).value)" aria-label="CAPEX actual for {{ row.month }}" /></label>
                              <label><span>Committed</span><input type="number" min="0" step="100" [value]="row.capexCommitted" (input)="updateBudgetMonthlyRow(row.id, 'capexCommitted', $any($event.target).value)" aria-label="CAPEX committed for {{ row.month }}" /></label>
                            </article>
                            <article class="budget-month-stream">
                              <strong>OPEX</strong>
                              <label><span>Budget</span><input type="number" [value]="row.opexBudget" aria-label="OPEX budget for {{ row.month }}" disabled /></label>
                              <label><span>Forecast</span><input type="number" min="0" step="100" [value]="row.opexForecast" (input)="updateBudgetMonthlyRow(row.id, 'opexForecast', $any($event.target).value)" aria-label="OPEX forecast for {{ row.month }}" /></label>
                              <label><span>Actual</span><input type="number" min="0" step="100" [value]="row.opexActual" (input)="updateBudgetMonthlyRow(row.id, 'opexActual', $any($event.target).value)" aria-label="OPEX actual for {{ row.month }}" /></label>
                              <label><span>Committed</span><input type="number" min="0" step="100" [value]="row.opexCommitted" (input)="updateBudgetMonthlyRow(row.id, 'opexCommitted', $any($event.target).value)" aria-label="OPEX committed for {{ row.month }}" /></label>
                            </article>
                          </div>
                        </article>
                        }
                      }
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (activeBenefitDrawer; as register) {
                  <app-pm-console-plan-drawer
                    [title]="benefitDrawerTitle"
                    [eyebrow]="register.fieldName + ' · AI ready'"
                    [description]="register.description"
                    [submitLabel]="benefitDrawerSubmitLabel"
                    [submitDisabled]="!canSaveBenefitDraft(register)"
                    closeAriaLabel="Close benefit drawer"
                    panelClass="benefit-drawer"
                    (close)="closeBenefitDrawer()"
                    (submitForm)="saveBenefitDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid benefit-drawer-grid">
                            <app-pm-console-field label="Benefit Type" type="select" [value]="register.draft.benefitType" [options]="register.benefitTypeOptions" [placeholder]="register.benefitTypePlaceholder" ariaLabel="Benefit Type" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('benefitType', $event)" />
                            <app-pm-console-field label="Benefit Category" type="select" [value]="register.draft.category" [options]="register.benefitCategoryOptions" [placeholder]="register.benefitCategoryPlaceholder" ariaLabel="Benefit Category" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('category', $event)" />
                            <app-pm-console-field label="Benefit Name" [value]="register.draft.benefitName" placeholder="Enter benefit name" ariaLabel="Benefit Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateBenefitDraft('benefitName', $event)" />
                            <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Enter description" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateBenefitDraft('description', $event)" />
                            <app-pm-console-field label="Benefit Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Benefit Owner" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('owner', $event)" />
                            <app-pm-console-field label="Realisation Date" type="date" [value]="register.draft.realizationDate" ariaLabel="Realisation Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateBenefitDraft('realizationDate', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (activeRiskDrawer; as register) {
                  <app-pm-console-plan-drawer
                    [title]="riskDrawerTitle"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [submitLabel]="editingRiskPlanId ? 'Save changes' : register.actionLabel"
                    [submitDisabled]="!canSaveRiskDraft(register)"
                    closeAriaLabel="Close risk drawer"
                    panelClass="risk-drawer"
                    (close)="closeRiskDrawer()"
                    (submitForm)="saveRiskDrawer($event)"
                  >
                    <div planDrawerBody class="risk-drawer-layout">
                      <div class="dependency-drawer-grid risk-drawer-grid">
                        <app-pm-console-field label="Risk Category" type="select" [value]="register.draft.riskCategory" [options]="register.categoryOptions" [placeholder]="register.categoryPlaceholder" ariaLabel="Risk Category" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('riskCategory', $event)" />
                        <app-pm-console-field label="Risk Status" type="select" [value]="register.draft.status" [options]="register.statusOptions" [placeholder]="register.statusPlaceholder" ariaLabel="Risk Status" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('status', $event)" />
                        <app-pm-console-field label="Risk Name" type="textarea" [value]="register.draft.riskName" placeholder="Type risk name here" ariaLabel="Risk Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" [maxLength]="500" [afterText]="riskDrawerCharacterCount + ' characters remaining'" (valueChange)="updateRiskDraft('riskName', $event)" />
                        <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Type risk description here" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateRiskDraft('description', $event)" />
                        <app-pm-console-field label="Risk Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Risk Owner" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('owner', $event)" />
                        <app-pm-console-field label="Risk Manager" type="select" [value]="register.draft.manager" [options]="register.ownerOptions" ariaLabel="Risk Manager" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('manager', $event)" />
                        <app-pm-console-field label="Start Date" type="date" [value]="register.draft.startDate" ariaLabel="Start Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('startDate', $event)" />
                        <app-pm-console-field label="End Date" type="date" [value]="register.draft.endDate" ariaLabel="End Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('endDate', $event)" />
                        <app-pm-console-field label="Actual Risk Likelihood" type="select" [value]="register.draft.actualLikelihood" [options]="register.likelihoodOptions" placeholder="Select likelihood" ariaLabel="Actual Risk Likelihood" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('actualLikelihood', $event)" />
                        <app-pm-console-field label="Actual Risk Consequence" type="select" [value]="register.draft.actualConsequence" [options]="register.consequenceOptions" placeholder="Select consequence" ariaLabel="Actual Risk Consequence" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('actualConsequence', $event)" />
                        <app-pm-console-field label="Actual Risk Rating" [value]="register.draft.actualRating || '-'" ariaLabel="Actual Risk Rating" fieldClass="dependency-drawer-field" [disabled]="true" />
                        <app-pm-console-field label="Residual Risk Likelihood" type="select" [value]="register.draft.residualLikelihood" [options]="register.likelihoodOptions" placeholder="Select likelihood" ariaLabel="Residual Risk Likelihood" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('residualLikelihood', $event)" />
                        <app-pm-console-field label="Residual Risk Consequence" type="select" [value]="register.draft.residualConsequence" [options]="register.consequenceOptions" placeholder="Select consequence" ariaLabel="Residual Risk Consequence" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('residualConsequence', $event)" />
                        <app-pm-console-field label="Residual Risk Rating" [value]="register.draft.residualRating || '-'" ariaLabel="Residual Risk Rating" fieldClass="dependency-drawer-field" [disabled]="true" />
                        <section class="risk-radio-field wide" aria-label="Enterprise wide impact">
                          <span class="matrix-field-label">Does this risk have an enterprise wide impact?</span>
                          <label><input type="radio" name="risk-enterprise-drawer" [checked]="register.draft.enterpriseImpact" (change)="updateRiskDraftEnterpriseImpact(true)" /> Yes</label>
                          <label><input type="radio" name="risk-enterprise-drawer" [checked]="!register.draft.enterpriseImpact" (change)="updateRiskDraftEnterpriseImpact(false)" /> No</label>
                        </section>
                      </div>

                      <aside class="risk-drawer-matrix-stack">
                        <app-pm-console-risk-matrix
                          title="Actual risk rating"
                          description="Click the consequence and likelihood cell."
                          [likelihood]="register.draft.actualLikelihood"
                          [consequence]="register.draft.actualConsequence"
                          [compact]="true"
                          (selectionChange)="updateRiskDraftMatrix('actual', $event)"
                        ></app-pm-console-risk-matrix>
                        <app-pm-console-risk-matrix
                          title="Residual risk rating"
                          description="Expected level after treatment."
                          [likelihood]="register.draft.residualLikelihood"
                          [consequence]="register.draft.residualConsequence"
                          [compact]="true"
                          (selectionChange)="updateRiskDraftMatrix('residual', $event)"
                        ></app-pm-console-risk-matrix>
                      </aside>
                    </div>

                    <section planDrawerBody class="risk-treatment-card risk-drawer-treatment-card">
                      <header>
                        <div>
                          <span class="risk-profile-section-eyebrow">Treatment</span>
                          <strong>{{ riskTreatmentCountLabel(register.draft.treatments) }}</strong>
                        </div>
                      </header>
                      <div class="risk-treatment-compose">
                        <app-pm-console-field label="Proposed Treatment" type="textarea" [value]="riskTreatmentDraft.treatment" placeholder="Describe the treatment action" ariaLabel="Proposed Treatment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskTreatmentDraft('treatment', $event)" />
                        <app-pm-console-field label="Type" type="select" [value]="riskTreatmentDraft.type" [options]="register.treatmentTypeOptions" ariaLabel="Treatment Type" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('type', $event)" />
                        <app-pm-console-field label="Category" type="select" [value]="riskTreatmentDraft.category" [options]="register.treatmentCategoryOptions" ariaLabel="Treatment Category" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('category', $event)" />
                        <app-pm-console-field label="Owner" type="select" [value]="riskTreatmentDraft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Treatment Owner" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('owner', $event)" />
                        <app-pm-console-field label="End Date" type="date" [value]="riskTreatmentDraft.endDate" ariaLabel="Treatment End Date" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('endDate', $event)" />
                        <button class="risk-profile-add-treatment" type="button" [disabled]="!canAddRiskTreatmentDraft()" (click)="addRiskTreatmentToDraft()"><span pmConsoleIcon="plus" aria-hidden="true"></span>Add risk treatment</button>
                      </div>
                      @if (register.draft.treatments.length) {
                        <div class="risk-treatment-pill-list">
                          @for (treatment of register.draft.treatments; track treatment.id) {
                            <span>
                              {{ treatment.treatment }}
                              <button type="button" (click)="removeRiskTreatmentFromDraft(treatment.id)" [attr.aria-label]="'Remove treatment'"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                            </span>
                          }
                        </div>
                      }
                    </section>
                  </app-pm-console-plan-drawer>
                }
                @if (isIssueDrawerOpen) {
                  @let register = activeIssuePlan;
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveIssueDraft(register)"
                    closeAriaLabel="Close issue drawer"
                    panelClass="issue-drawer"
                    (close)="closeIssueDrawer()"
                    (submitForm)="saveIssueDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid issue-drawer-grid">
                            <app-pm-console-field label="Issue Type" type="select" [value]="register.draft.issueType" [options]="register.issueTypeOptions" [placeholder]="register.issueTypePlaceholder" ariaLabel="Issue Type" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('issueType', $event)" />
                            <app-pm-console-field label="Criticality" type="select" [value]="register.draft.criticality" [options]="register.criticalityOptions" ariaLabel="Criticality" fieldClass="dependency-drawer-field" (valueChange)="updateIssueDraft('criticality', $event)" />
                            <app-pm-console-field label="Issue" type="textarea" [value]="register.draft.issue" placeholder="Describe the issue or blocker" ariaLabel="Issue" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateIssueDraft('issue', $event)" />
                            <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Add supporting context" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateIssueDraft('description', $event)" />
                            <app-pm-console-field label="Resolution" type="textarea" [value]="register.draft.resolution" placeholder="Describe the current resolution path" ariaLabel="Resolution" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateIssueDraft('resolution', $event)" />
                            <app-pm-console-field label="Status" type="select" [value]="register.draft.status" [options]="register.statusOptions" ariaLabel="Status" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('status', $event)" />
                            <app-pm-console-field label="Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Owner" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('owner', $event)" />
                            <app-pm-console-field label="Date Raised" type="date" [value]="register.draft.dateRaised" ariaLabel="Date Raised" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateIssueDraft('dateRaised', $event)" />
                            <app-pm-console-field label="Due Date" type="date" [value]="register.draft.dueDate" ariaLabel="Due Date" fieldClass="dependency-drawer-field" (valueChange)="updateIssueDraft('dueDate', $event)" />
                            <app-pm-console-field label="Date Closed" type="date" [value]="register.draft.dateClosed" ariaLabel="Date Closed" fieldClass="dependency-drawer-field" (valueChange)="updateIssueDraft('dateClosed', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isRelatedLinksDrawerOpen) {
                  @let register = activeRelatedLinksRegister;
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveRelatedLinksDraft(register)"
                    closeAriaLabel="Close related links drawer"
                    (close)="closeRelatedLinksDrawer()"
                    (submitForm)="saveRelatedLinksDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid">
                            <app-pm-console-field label="Name" [value]="register.draft.name" [placeholder]="register.namePlaceholder" ariaLabel="Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateRelatedLinksDraft('name', $event)" />
                            <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" [placeholder]="register.descriptionPlaceholder" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateRelatedLinksDraft('description', $event)" />
                            <app-pm-console-field label="Link To Document" [value]="register.draft.documentLink" [placeholder]="register.documentPlaceholder" ariaLabel="Link To Document" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateRelatedLinksDraft('documentLink', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isResourceDrawerOpen) {
                  @let register = activeResourcePlan;
                  <app-pm-console-plan-drawer
                    [title]="editingResourcePlanId ? 'Edit resource' : register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [submitLabel]="editingResourcePlanId ? 'Save changes' : register.actionLabel"
                    [submitDisabled]="!canSaveResourceDraft(register)"
                    closeAriaLabel="Close resource drawer"
                    (close)="closeResourceDrawer()"
                    (submitForm)="saveResourceDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid">
                            <app-pm-console-field label="Resource" type="select" [value]="register.draft.resource" [options]="register.resourceOptions" [placeholder]="register.resourcePlaceholder" ariaLabel="Resource" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateResourceDraft('resource', $event)" />
                            <app-pm-console-field label="Resource type" type="select" [value]="register.draft.resourceType" [options]="register.resourceTypeOptions" [placeholder]="register.resourceTypePlaceholder" ariaLabel="Resource type" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('resourceType', $event)" />
                            <app-pm-console-field label="Level of Impact" type="select" [value]="register.draft.impact" [options]="register.impactOptions" [placeholder]="register.impactPlaceholder" ariaLabel="Level of Impact" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('impact', $event)" />
                            <app-pm-console-field label="Business Unit" type="select" [value]="register.draft.businessUnit" [options]="register.businessUnitOptions" [placeholder]="register.businessUnitPlaceholder" ariaLabel="Business Unit" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('businessUnit', $event)" />
                            <app-pm-console-field label="Assigned by" type="select" [value]="register.draft.assignedBy" [options]="register.assignedByOptions" [placeholder]="register.assignedByPlaceholder" ariaLabel="Assigned by" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('assignedBy', $event)" />
                            <app-pm-console-field label="Resources (FTE Count)" [value]="register.draft.fteCount" [placeholder]="register.ftePlaceholder" ariaLabel="Resources" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateResourceDraft('fteCount', $event)" />
                            <app-pm-console-field label="Baseline Start Date" type="date" [value]="register.draft.baselineStart" ariaLabel="Baseline Start Date" fieldClass="dependency-drawer-field" (valueChange)="updateResourceDraft('baselineStart', $event)" />
                            <app-pm-console-field label="End Date" type="date" [value]="register.draft.baselineEnd" ariaLabel="End Date" fieldClass="dependency-drawer-field" (valueChange)="updateResourceDraft('baselineEnd', $event)" />
                            <app-pm-console-field label="Comments" type="textarea" [value]="register.draft.comments" placeholder="Type comments here" ariaLabel="Comments" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateResourceDraft('comments', $event)" />
                            <section class="resource-attachment-builder wide" aria-label="Resource attachments">
                              <div class="resource-attachment-builder-head">
                                <span class="matrix-field-label">Attachments</span>
                                <small class="matrix-field-description">Upload supporting files or add a document link for this resource line.</small>
                              </div>
                              <label class="resource-attachment-upload">
                                <input type="file" multiple (change)="addResourceDraftAttachments($event)" />
                                <span class="icon" aria-hidden="true"><i data-lucide="upload-cloud"></i></span>
                                <strong>Add attachment</strong>
                                <small>Files are listed with the resource once saved.</small>
                              </label>
                              <div class="resource-attachment-link-row">
                                <input type="text" [value]="register.draft.attachmentLink" [attr.placeholder]="register.attachmentLinkPlaceholder" aria-label="Attachment link" (input)="updateResourceDraft('attachmentLink', $any($event.target).value)" />
                                <button type="button" (click)="addResourceDraftAttachmentLink()" [disabled]="!register.draft.attachmentLink.trim()">Add link</button>
                              </div>
                              @if (register.draft.attachments.length) {
                                <div class="attachment-list resource-draft-attachment-list" aria-label="Selected resource attachments">
                                  @for (attachment of register.draft.attachments; track attachment.id) {
                                    <article class="attachment-list-item">
                                      <span class="attachment-list-icon" aria-hidden="true"><span class="icon"><i data-lucide="paperclip"></i></span></span>
                                      <div>
                                        <strong>{{ attachment.name }}</strong>
                                        <small>{{ attachmentMeta(attachment) }}</small>
                                      </div>
                                      <button type="button" (click)="removeResourceDraftAttachment(attachment.id)" [attr.aria-label]="'Remove ' + attachment.name">
                                        <span class="icon" aria-hidden="true"><i data-lucide="x"></i></span>
                                      </button>
                                    </article>
                                  }
                                </div>
                              }
                            </section>
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (activeChangeImpactDrawer; as register) {
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveChangeImpactDraft(register)"
                    closeAriaLabel="Close change impact drawer"
                    panelClass="change-impact-drawer"
                    (close)="closeChangeImpactDrawer()"
                    (submitForm)="saveChangeImpactDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid change-impact-drawer-grid">
                            <app-pm-console-field label="Change Impact Category" type="select" [value]="register.draft.category" [options]="register.categoryOptions" [placeholder]="register.categoryPlaceholder" ariaLabel="Change Impact Category" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeImpactDraft('category', $event)" />
                            <app-pm-console-field label="Stakeholder Impacted" type="select" [value]="register.draft.stakeholder" [options]="register.stakeholderOptions" [placeholder]="register.stakeholderPlaceholder" ariaLabel="Stakeholder Impacted" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeImpactDraft('stakeholder', $event)" />
                            <app-pm-console-field label="Level of Impact" type="select" [value]="register.draft.level" [options]="register.levelOptions" [placeholder]="register.levelPlaceholder" ariaLabel="Level of Impact" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeImpactDraft('level', $event)" />
                            <app-pm-console-field label="Comment" type="textarea" [value]="register.draft.comment" placeholder="Describe the impact in plain language" description="Add the business context, behavior shift, or delivery friction this impact is likely to create." ariaLabel="Comment" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" [afterText]="changeImpactCommentCharactersRemaining + ' characters remaining'" afterClass="change-impact-comment-count" (valueChange)="updateChangeImpactDraft('comment', $event)" />
                            <section class="change-impact-strategy-builder wide" aria-label="Change strategies">
                              <div class="change-impact-strategy-head">
                                <div>
                                  <span class="matrix-field-label">Change Strategy</span>
                                  <small class="matrix-field-description">Add the actions that will reduce the impact or prepare the audience.</small>
                                </div>
                              </div>
                              <div class="change-impact-strategy-compose">
                                <input type="text" [value]="register.draft.strategyInput" (input)="updateChangeImpactDraft('strategyInput', $any($event.target).value)" aria-label="Change Strategy" [attr.placeholder]="register.strategyPlaceholder" />
                                <button class="change-impact-strategy-add" type="button" (click)="addChangeImpactStrategy()">Add strategy</button>
                              </div>
                              @if (register.draft.strategies.length) {
                                <div class="change-impact-strategy-list is-editor" aria-label="Draft change strategies">
                                  @for (strategy of register.draft.strategies; track strategy) {
                                    <span class="change-impact-strategy-pill">
                                      <span>{{ strategy }}</span>
                                      <button type="button" aria-label="Remove strategy {{ strategy }}" (click)="removeChangeImpactStrategy(strategy)"><span class="icon" aria-hidden="true"><i data-lucide="x"></i></span></button>
                                    </span>
                                  }
                                </div>
                              } @else {
                                <p class="change-impact-strategy-empty">No strategies added yet. Add the adoption, communication, or training response you want tracked with this impact.</p>
                              }
                            </section>
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (activeDependencyRegister; as register) {
                  <app-pm-console-plan-drawer
                    [title]="register.title"
                    [eyebrow]="register.fieldName"
                    [description]="register.description"
                    [submitLabel]="register.actionLabel"
                    [submitDisabled]="!canSaveDependencyDraft(register)"
                    closeAriaLabel="Close dependency drawer"
                    (close)="closeDependencyDrawer()"
                    (submitForm)="saveDependencyDrawer($event)"
                  >
                          <div planDrawerBody class="dependency-drawer-grid">
                            <app-pm-console-field [label]="register.key === 'predecessor' ? 'Predecessor Project' : 'Successor Project'" type="select" [value]="register.draft.project" [options]="register.projectOptions" [placeholder]="register.projectPlaceholder" [ariaLabel]="register.key === 'predecessor' ? 'Predecessor Project' : 'Successor Project'" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('project', $event)" />
                            <app-pm-console-field label="Impact of Dependency" type="select" [value]="register.draft.impact" [options]="register.impactOptions" [placeholder]="register.impactPlaceholder" ariaLabel="Impact of Dependency" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('impact', $event)" />
                            <app-pm-console-field label="Dependent Product" type="select" [value]="register.draft.dependentProduct" [options]="register.dependentProductOptions" [placeholder]="register.dependentProductPlaceholder" ariaLabel="Dependent Product" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('dependentProduct', $event)" />
                            <app-pm-console-field label="Project Manager" [value]="register.draft.projectManager" placeholder="Type project manager name" ariaLabel="Project Manager" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('projectManager', $event)" />
                            <app-pm-console-field label="Baseline Start Date" type="date" [value]="register.draft.baselineStart" ariaLabel="Baseline Start Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('baselineStart', $event)" />
                            <app-pm-console-field label="Baseline End Date" type="date" [value]="register.draft.baselineEnd" ariaLabel="Baseline End Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateDependencyDraft('baselineEnd', $event)" />
                            <app-pm-console-field label="Nature of Dependency" type="textarea" [value]="register.draft.nature" placeholder="Describe how this dependency affects delivery" description="Explain the handoff, blocker, or downstream reliance in plain language." ariaLabel="Nature of Dependency" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateDependencyDraft('nature', $event)" />
                          </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewBusinessDriverDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewDriverDrawerTitle"
                    eyebrow="Business Drivers"
                    description="Capture the strategic reason cleanly in the drawer, then come back to the register to compare all drivers at a glance."
                    [submitLabel]="editingOverviewBusinessDriverId ? 'Save changes' : 'Add business driver'"
                    [submitDisabled]="!canSaveOverviewBusinessDriverDraft()"
                    closeAriaLabel="Close business driver drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewBusinessDriverDrawer()"
                    (submitForm)="saveOverviewBusinessDriverDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Business driver" type="select" [value]="overviewBusinessDriverDraft.driver" [options]="overviewBusinessDriverOptionLabels" placeholder="Select business driver" ariaLabel="Business driver" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateOverviewBusinessDriverDraft('driver', $event)" />
                      <app-pm-console-field label="Source" [value]="overviewBusinessDriverDraft.source" placeholder="Strategy Office" ariaLabel="Source" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewBusinessDriverDraft('source', $event)" />
                      <app-pm-console-field label="Priority" type="select" [value]="overviewBusinessDriverDraft.priority" [options]="scheduleScopePriorityOptions" ariaLabel="Priority" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewBusinessDriverDraft('priority', $event)" />
                      <app-pm-console-field label="Why it matters" type="textarea" [value]="overviewBusinessDriverDraft.note" placeholder="Add the strategic or operational reason for this driver" description="Keep this short and specific so the driver reads well in the register table." ariaLabel="Why it matters" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateOverviewBusinessDriverDraft('note', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewOutcomeDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewOutcomeDrawerTitle"
                    eyebrow="Outcome"
                    description="Move the old inline outcome form into the drawer so the page stays focused on reading, while the form stays focused on writing."
                    [submitLabel]="editingOverviewOutcomeId ? 'Save changes' : 'Add outcome'"
                    [submitDisabled]="!canSaveOverviewOutcomeDraft()"
                    closeAriaLabel="Close outcome drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewOutcomeDrawer()"
                    (submitForm)="saveOverviewOutcomeDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Outcome" type="textarea" [value]="overviewOutcomeDraft.outcome" placeholder="Describe the outcome users should see" ariaLabel="Outcome" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateOverviewOutcomeDraft('outcome', $event)" />
                      <app-pm-console-field label="Measure" [value]="overviewOutcomeDraft.measure" placeholder="How will this be measured?" ariaLabel="Measure" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateOverviewOutcomeDraft('measure', $event)" />
                      <app-pm-console-field label="Owner" type="select" [value]="overviewOutcomeDraft.owner" [options]="scheduleScopeOwnerOptions" placeholder="Select owner" [placeholderDisabled]="false" ariaLabel="Owner" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewOutcomeDraft('owner', $event)" />
                      <app-pm-console-field label="Status" type="select" [value]="overviewOutcomeDraft.status" [options]="overviewOutcomeStatusOptions" ariaLabel="Status" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewOutcomeDraft('status', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewObjectiveDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewObjectiveDrawerTitle"
                    eyebrow="Project Alignment (Objectives)"
                    description="Project objectives now sit in the same right-drawer pattern, with the linked strategic objective visible at the same time."
                    [submitLabel]="editingOverviewObjectiveId ? 'Save changes' : 'Add project objective'"
                    [submitDisabled]="!canSaveOverviewObjectiveDraft()"
                    closeAriaLabel="Close project objective drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewObjectiveDrawer()"
                    (submitForm)="saveOverviewObjectiveDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Project objective" type="textarea" [value]="overviewObjectiveDraft.objective" placeholder="Describe the project objective" ariaLabel="Project objective" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateOverviewObjectiveDraft('objective', $event)" />
                      <app-pm-console-field label="Linked strategic objective" type="select" [value]="overviewObjectiveDraft.linkedObjective" [options]="overviewStrategicObjectiveLinks" ariaLabel="Linked strategic objective" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateOverviewObjectiveDraft('linkedObjective', $event)" />
                      <app-pm-console-field label="Status" type="select" [value]="overviewObjectiveDraft.status" [options]="overviewObjectiveStatusOptions" ariaLabel="Objective status" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewObjectiveDraft('status', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewCapabilityDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewCapabilityDrawerTitle"
                    eyebrow="Link Capabilities"
                    description="Keep capability mapping detailed and deliberate without forcing users to open an inline editor inside the page."
                    [submitLabel]="editingOverviewCapabilityId ? 'Save changes' : 'Link capabilities'"
                    [submitDisabled]="!canSaveOverviewCapabilityDraft()"
                    closeAriaLabel="Close capability drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewCapabilityDrawer()"
                    (submitForm)="saveOverviewCapabilityDrawer($event)"
                  >
                    <section planDrawerBody class="schedule-drawer-section">
                      <div class="schedule-drawer-section-head">
                        <div>
                          <strong>Choose capabilities</strong>
                          <small>Select the capabilities this project influences. The register will add one row per selected capability.</small>
                        </div>
                      </div>
                      <div class="overview-capability-selector" role="group" aria-label="Capability selection">
                        @for (option of overviewCapabilityOptions; track option.capability) {
                          <label class="overview-capability-option" [class.is-selected]="overviewCapabilityDraft.selectedCapabilities.includes(option.capability)">
                            <input type="checkbox" [checked]="overviewCapabilityDraft.selectedCapabilities.includes(option.capability)" (change)="toggleOverviewCapabilitySelection(option.capability)" />
                            <span>
                              <strong>{{ option.capability }}</strong>
                              <small>{{ option.domain }} · {{ option.owner }}</small>
                            </span>
                          </label>
                        }
                      </div>
                    </section>
                  </app-pm-console-plan-drawer>
                }
                @if (isOverviewServiceDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="overviewServiceDrawerTitle"
                    eyebrow="Link Services"
                    description="Keep the service mapping flow structured, but contained, so users can complete it without losing the overview context behind the drawer."
                    [submitLabel]="editingOverviewServiceId ? 'Save changes' : 'Link service'"
                    [submitDisabled]="!canSaveOverviewServiceDraft()"
                    closeAriaLabel="Close service drawer"
                    panelClass="overview-drawer"
                    (close)="closeOverviewServiceDrawer()"
                    (submitForm)="saveOverviewServiceDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Service group" type="select" [value]="overviewServiceDraft.serviceGroup" [options]="overviewServiceGroupOptions" placeholder="Select service group" ariaLabel="Service group" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateOverviewServiceDraft('serviceGroup', $event)" />
                      <app-pm-console-field label="Value stream" type="select" [value]="overviewServiceDraft.valueStream" [options]="overviewServiceValueStreamOptions" placeholder="Select value stream" ariaLabel="Value stream" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateOverviewServiceDraft('valueStream', $event)" />
                      <app-pm-console-field label="Phase" type="select" [value]="overviewServiceDraft.phase" [options]="overviewServicePhaseOptions" placeholder="Select phase" [placeholderDisabled]="false" ariaLabel="Phase" fieldClass="dependency-drawer-field" (valueChange)="updateOverviewServiceDraft('phase', $event)" />
                      <app-pm-console-field label="Service" type="select" [value]="overviewServiceDraft.service" [options]="overviewServiceOptions" placeholder="Select service" ariaLabel="Service" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateOverviewServiceDraft('service', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isScheduleMilestoneDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="scheduleScopeMilestoneDrawerTitle"
                    eyebrow="Milestones"
                    description="Keep schedule checkpoints focused, then manage them from the register instead of expanding an inline form."
                    [submitLabel]="editingScheduleMilestoneId ? 'Save changes' : 'Add milestone'"
                    [submitDisabled]="!canSaveScheduleMilestoneDraft()"
                    closeAriaLabel="Close milestone drawer"
                    panelClass="schedule-drawer"
                    (close)="closeScheduleMilestoneDrawer()"
                    (submitForm)="saveScheduleMilestoneDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <app-pm-console-field label="Milestone" [value]="scheduleMilestoneDraft.milestone" placeholder="Name the milestone" ariaLabel="Milestone" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateScheduleMilestoneDraft('milestone', $event)" />
                      <app-pm-console-field label="Due date" type="date" [value]="scheduleMilestoneDraft.dueDate" ariaLabel="Due date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateScheduleMilestoneDraft('dueDate', $event)" />
                      <app-pm-console-field label="Person responsible" type="select" [value]="scheduleMilestoneDraft.owner" [options]="scheduleScopeOwnerOptions" placeholder="Select owner" [placeholderDisabled]="false" ariaLabel="Person responsible" fieldClass="dependency-drawer-field" (valueChange)="updateScheduleMilestoneDraft('owner', $event)" />
                      <app-pm-console-field label="Milestone priority" type="select" [value]="scheduleMilestoneDraft.priority" [options]="scheduleScopePriorityOptions" ariaLabel="Milestone priority" fieldClass="dependency-drawer-field" (valueChange)="updateScheduleMilestoneDraft('priority', $event)" />
                      <app-pm-console-field label="Milestone note" type="textarea" [value]="scheduleMilestoneDraft.note" placeholder="Add context, dependencies, or assumptions" description="Optional context for PMO or delivery reviewers." ariaLabel="Milestone note" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateScheduleMilestoneDraft('note', $event)" />
                    </div>
                  </app-pm-console-plan-drawer>
                }
                @if (isScheduleEndProductDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="scheduleScopeEndProductDrawerTitle"
                    eyebrow="End Product (Deliverables)"
                    description="Use the drawer for product setup, then come back to the register table for comparison and review."
                    [submitLabel]="editingScheduleEndProductId ? 'Save changes' : 'Add end product'"
                    [submitDisabled]="!canSaveScheduleEndProductDraft()"
                    closeAriaLabel="Close end product drawer"
                    panelClass="schedule-product-drawer"
                    (close)="closeScheduleEndProductDrawer()"
                    (submitForm)="saveScheduleEndProductDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <label class="matrix-field dependency-drawer-field wide">
                        <span class="matrix-field-label">Product <b>*</b></span>
                        <input type="text" [value]="scheduleEndProductDraft.product" (input)="updateScheduleEndProductDraft('product', $any($event.target).value)" aria-label="Product" placeholder="Name the end product" />
                      </label>

                      <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                        <span class="matrix-field-label">Product description</span>
                        <textarea [value]="scheduleEndProductDraft.description" (input)="updateScheduleEndProductDraft('description', $any($event.target).value)" aria-label="Product description" placeholder="Describe what the product delivers"></textarea>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product owner <b>*</b></span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleEndProductDraft.owner" (change)="updateScheduleEndProductDraft('owner', $any($event.target).value)" aria-label="Product owner">
                            <option value="">Select owner</option>
                            @for (option of scheduleScopeOwnerOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product category</span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleEndProductDraft.category" (change)="updateScheduleEndProductDraft('category', $any($event.target).value)" aria-label="Product category">
                            @for (option of scheduleScopeCategoryOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field wide">
                        <span class="matrix-field-label">Capability</span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleEndProductDraft.capability" (change)="updateScheduleEndProductDraft('capability', $any($event.target).value)" aria-label="Capability">
                            <option value="">Select capability</option>
                            @for (option of scheduleScopeCapabilityOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                    </div>

                    <section planDrawerBody class="schedule-drawer-section">
                      <div class="schedule-drawer-section-head">
                        <div>
                          <strong>Timing and budget</strong>
                          <small>These are still detailed-only fields, but now they’re grouped logically instead of stacked in one long modal.</small>
                        </div>
                      </div>
                      <div class="dependency-drawer-grid">
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">Start date</span>
                          <input type="date" [value]="scheduleEndProductDraft.startDate" (input)="updateScheduleEndProductDraft('startDate', $any($event.target).value)" aria-label="Start date" />
                        </label>
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">End date</span>
                          <input type="date" [value]="scheduleEndProductDraft.endDate" (input)="updateScheduleEndProductDraft('endDate', $any($event.target).value)" aria-label="End date" />
                        </label>
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">CAPEX</span>
                          <input type="text" [value]="scheduleEndProductDraft.capex" (input)="updateScheduleEndProductDraft('capex', $any($event.target).value)" aria-label="CAPEX" placeholder="0" />
                        </label>
                        <label class="matrix-field dependency-drawer-field">
                          <span class="matrix-field-label">OPEX</span>
                          <input type="text" [value]="scheduleEndProductDraft.opex" (input)="updateScheduleEndProductDraft('opex', $any($event.target).value)" aria-label="OPEX" placeholder="0" />
                        </label>
                      </div>
                    </section>

                    <section planDrawerBody class="schedule-drawer-section">
                      <div class="schedule-drawer-section-head">
                        <div>
                          <strong>Delivery links</strong>
                          <small>Keep predecessor and successor relationships close to the product instead of pushing them into a separate modal context.</small>
                        </div>
                      </div>
                      <div class="dependency-drawer-grid">
                        <app-pm-console-field label="Predecessors" type="select" [value]="scheduleEndProductDraft.predecessors" [options]="scheduleScopeDeliveryLinkOptions" placeholder="Select linked project" [placeholderDisabled]="false" ariaLabel="Predecessors" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateScheduleEndProductDraft('predecessors', $event)" />
                        <app-pm-console-field label="Successors" type="select" [value]="scheduleEndProductDraft.successors" [options]="scheduleScopeDeliveryLinkOptions" placeholder="Select linked project" [placeholderDisabled]="false" ariaLabel="Successors" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateScheduleEndProductDraft('successors', $event)" />
                      </div>
                    </section>
                  </app-pm-console-plan-drawer>
                }
                @if (isScheduleManagementProductDrawerOpen) {
                  <app-pm-console-plan-drawer
                    [title]="scheduleScopeManagementProductDrawerTitle"
                    eyebrow="Management Product"
                    description="Keep governance artefacts in the same drawer pattern so the experience stays consistent across the whole Schedule & Scope tab."
                    [submitLabel]="editingScheduleManagementProductId ? 'Save changes' : 'Add management product'"
                    [submitDisabled]="!canSaveScheduleManagementProductDraft()"
                    closeAriaLabel="Close management product drawer"
                    panelClass="schedule-drawer"
                    (close)="closeScheduleManagementProductDrawer()"
                    (submitForm)="saveScheduleManagementProductDrawer($event)"
                  >
                    <div planDrawerBody class="dependency-drawer-grid">
                      <label class="matrix-field dependency-drawer-field wide">
                        <span class="matrix-field-label">Product <b>*</b></span>
                        <input type="text" [value]="scheduleManagementProductDraft.product" (input)="updateScheduleManagementProductDraft('product', $any($event.target).value)" aria-label="Product" placeholder="Name the management product" />
                      </label>
                      <label class="matrix-field matrix-field-textarea dependency-drawer-field wide">
                        <span class="matrix-field-label">Product description</span>
                        <textarea [value]="scheduleManagementProductDraft.description" (input)="updateScheduleManagementProductDraft('description', $any($event.target).value)" aria-label="Product description" placeholder="Describe the governance artefact"></textarea>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product owner <b>*</b></span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleManagementProductDraft.owner" (change)="updateScheduleManagementProductDraft('owner', $any($event.target).value)" aria-label="Product owner">
                            <option value="">Select owner</option>
                            @for (option of scheduleScopeOwnerOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field matrix-field-select dependency-drawer-field">
                        <span class="matrix-field-label">Product category</span>
                        <span class="matrix-select-wrap">
                          <select [value]="scheduleManagementProductDraft.category" (change)="updateScheduleManagementProductDraft('category', $any($event.target).value)" aria-label="Product category">
                            @for (option of scheduleScopeCategoryOptions; track option) {
                              <option [value]="option">{{ option }}</option>
                            }
                          </select>
                          <span class="icon" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
                        </span>
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">Start date</span>
                        <input type="date" [value]="scheduleManagementProductDraft.startDate" (input)="updateScheduleManagementProductDraft('startDate', $any($event.target).value)" aria-label="Start date" />
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">End date</span>
                        <input type="date" [value]="scheduleManagementProductDraft.endDate" (input)="updateScheduleManagementProductDraft('endDate', $any($event.target).value)" aria-label="End date" />
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">CAPEX</span>
                        <input type="text" [value]="scheduleManagementProductDraft.capex" (input)="updateScheduleManagementProductDraft('capex', $any($event.target).value)" aria-label="CAPEX" placeholder="0" />
                      </label>
                      <label class="matrix-field dependency-drawer-field">
                        <span class="matrix-field-label">OPEX</span>
                        <input type="text" [value]="scheduleManagementProductDraft.opex" (input)="updateScheduleManagementProductDraft('opex', $any($event.target).value)" aria-label="OPEX" placeholder="0" />
                      </label>
                    </div>
                  </app-pm-console-plan-drawer>
                }

    }

    @if (selectedPage === 'project-plan' && projectPlanEntry === 'change-request') {
                    @if (isChangeRequestDrawerOpen) {
                      <app-pm-console-plan-drawer
                        [title]="changeRequestDrawerTitle"
                        eyebrow="Project change request"
                        description="Create a single PCR with overview, impact assessment, and evidence links in one side drawer."
                        [submitLabel]="editingChangeRequestId ? 'Save request' : 'Create request'"
                        [submitDisabled]="!canSaveChangeRequestDraft()"
                        closeAriaLabel="Close change request drawer"
                        panelClass="change-request-drawer"
                        (close)="closeChangeRequestDrawer()"
                        (submitForm)="saveChangeRequestDrawer($event)"
                      >
                        <div planDrawerBody class="change-request-drawer-body">
                          <nav class="change-request-drawer-nav" role="tablist" aria-label="Change request drawer sections">
                            @for (tab of changeRequestDrawerTabs; track tab.id) {
                              <button
                                type="button"
                                role="tab"
                                [class.active]="changeRequestDrawerTab === tab.id"
                                [attr.aria-selected]="changeRequestDrawerTab === tab.id"
                                (click)="setChangeRequestDrawerTab(tab.id)"
                              >
                                <span [pmConsoleIcon]="iconName(tab.icon)" aria-hidden="true"></span>
                                <span>{{ tab.label }}</span>
                              </button>
                            }
                          </nav>

                          @if (changeRequestDrawerTab === 'overview') {
                            <section class="change-request-drawer-section" aria-label="Change request overview">
                              <div class="change-request-context-grid">
                                <div>
                                  <span>Project</span>
                                  <strong>{{ changeRequestDraft.project }}</strong>
                                </div>
                                <div>
                                  <span>PMO</span>
                                  <strong>{{ changeRequestDraft.pmo }}</strong>
                                </div>
                              </div>

                              <div class="dependency-drawer-grid change-request-overview-grid">
                                <app-pm-console-field label="Due Date" type="date" [value]="changeRequestDraft.dueDate" ariaLabel="Due Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeRequestDraft('dueDate', $event)" />
                                <app-pm-console-field label="Trigger" type="select" [value]="changeRequestDraft.trigger" [options]="changeRequestTriggerOptions" placeholder="Select trigger" ariaLabel="Trigger" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateChangeRequestDraft('trigger', $event)" />

                                <section class="change-request-choice-card wide" aria-label="Priority">
                                  <span class="matrix-field-label">Priority <b>*</b></span>
                                  <div class="change-request-radio-row">
                                    @for (priority of changeRequestPriorityOptions; track priority) {
                                      <label>
                                        <input type="radio" name="change-request-priority" [checked]="changeRequestDraft.priority === priority" (change)="updateChangeRequestDraft('priority', priority)" />
                                        <span>{{ priority }}</span>
                                      </label>
                                    }
                                  </div>
                                </section>

                                <section class="change-request-choice-card wide" aria-label="Change request type">
                                  <span class="matrix-field-label">Type of change <b>*</b></span>
                                  <div class="change-request-type-options">
                                    @for (type of changeRequestTypeOptions; track type) {
                                      <label [class.active]="isChangeRequestTypeSelected(type)">
                                        <input type="checkbox" [checked]="isChangeRequestTypeSelected(type)" (change)="toggleChangeRequestType(type, $any($event.target).checked)" />
                                        <span>{{ type }}</span>
                                      </label>
                                    }
                                  </div>
                                </section>

                                <app-pm-console-field label="Change Details" type="textarea" [value]="changeRequestDraft.changeDetails" placeholder="Describe the requested change" ariaLabel="Change Details" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" [afterText]="changeRequestCommentCharactersRemaining + ' characters remaining'" afterClass="change-impact-comment-count" (valueChange)="updateChangeRequestDraft('changeDetails', $event)" />
                                <app-pm-console-field label="Business Justification" type="textarea" [value]="changeRequestDraft.businessJustification" placeholder="Explain why the project needs this change" ariaLabel="Business Justification" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('businessJustification', $event)" />
                                <app-pm-console-field label="Risk / Impact of Change" type="textarea" [value]="changeRequestDraft.riskImpact" placeholder="Summarize delivery, governance, and adoption risk" ariaLabel="Risk / Impact of Change" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('riskImpact', $event)" />
                                <app-pm-console-field label="Release(s) Impacted" type="textarea" [value]="changeRequestDraft.releasesImpacted" placeholder="List impacted releases or governance packs" ariaLabel="Releases Impacted" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('releasesImpacted', $event)" />
                              </div>
                            </section>
                          } @else if (changeRequestDrawerTab === 'impact') {
                            <section class="change-request-drawer-section" aria-label="Impact assessment">
                              <div class="dependency-drawer-grid change-request-impact-fields">
                                <app-pm-console-field label="Impact to Resource" type="textarea" [value]="changeRequestDraft.impactToResource" placeholder="Describe resource impact" ariaLabel="Impact to Resource" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('impactToResource', $event)" />
                                <app-pm-console-field label="Impact to Quality" type="textarea" [value]="changeRequestDraft.impactToQuality" placeholder="Describe quality impact" ariaLabel="Impact to Quality" fieldClass="dependency-drawer-field" [maxLength]="3000" [wide]="true" (valueChange)="updateChangeRequestDraft('impactToQuality', $event)" />
                              </div>

                              <div class="change-request-impact-tabs" role="tablist" aria-label="Impact assessment tables">
                                @for (tab of changeRequestImpactTabs; track tab.id) {
                                  <button type="button" role="tab" [class.active]="changeRequestImpactTab === tab.id" [attr.aria-selected]="changeRequestImpactTab === tab.id" (click)="setChangeRequestImpactTab(tab.id)">{{ tab.label }}</button>
                                }
                              </div>

                              @if (changeRequestImpactTab === 'benefits') {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table" aria-label="Impacted benefits">
                                    <thead><tr><th>End Benefit</th><th>Benefit Profile</th><th>Benefit Owner</th><th>Product</th></tr></thead>
                                    <tbody>
                                      @for (row of changeRequestImpactBenefits; track row.benefit) {
                                        <tr><td class="dependency-register-primary"><strong>{{ row.benefit }}</strong></td><td>{{ row.profile }}</td><td>{{ row.owner }}</td><td>{{ row.product }}</td></tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              } @else if (changeRequestImpactTab === 'capabilities') {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table" aria-label="Impacted capabilities">
                                    <thead><tr><th>Capability Group Name</th><th>Capability Name</th><th>Capability Manager</th><th>Products</th></tr></thead>
                                    <tbody>
                                      @for (row of changeRequestImpactCapabilities; track row.group + row.capability) {
                                        <tr><td>{{ row.group }}</td><td class="dependency-register-primary"><strong>{{ row.capability }}</strong></td><td>{{ row.manager }}</td><td>{{ row.products }}</td></tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              } @else {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table change-request-project-impact-table" aria-label="Impacted projects and products">
                                    <thead><tr><th>Impacted Project</th><th>Project Manager</th><th>Products</th></tr></thead>
                                    <tbody>
                                      @for (row of changeRequestImpactProjects; track row.project) {
                                        <tr>
                                          <td class="dependency-register-primary"><strong>{{ row.project }}</strong></td>
                                          <td>{{ row.manager }}</td>
                                          <td>
                                            <ul class="change-request-product-list">
                                              @for (product of row.products; track product) {
                                                <li>{{ product }}</li>
                                              }
                                            </ul>
                                          </td>
                                        </tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              }
                            </section>
                          } @else {
                            <section class="change-request-drawer-section" aria-label="Related links">
                              <div class="dependency-drawer-grid change-request-link-grid">
                                <app-pm-console-field label="Name" [value]="changeRequestDraft.relatedLinkName" placeholder="Enter link name" ariaLabel="Related link name" fieldClass="dependency-drawer-field" (valueChange)="updateChangeRequestRelatedLinkDraft('relatedLinkName', $event)" />
                                <app-pm-console-field label="Link To Document" [value]="changeRequestDraft.relatedLinkUrl" placeholder="Paste document link" ariaLabel="Related link document" fieldClass="dependency-drawer-field" (valueChange)="updateChangeRequestRelatedLinkDraft('relatedLinkUrl', $event)" />
                                <app-pm-console-field label="Description" type="textarea" [value]="changeRequestDraft.relatedLinkDescription" placeholder="Add description" ariaLabel="Related link description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateChangeRequestRelatedLinkDraft('relatedLinkDescription', $event)" />
                                <button class="change-request-add-link wide" type="button" [disabled]="!canAddChangeRequestRelatedLink()" (click)="addChangeRequestRelatedLink()">
                                  <span class="icon" aria-hidden="true"><i data-lucide="plus"></i></span>
                                  <span>Add related link</span>
                                </button>
                              </div>

                              @if (changeRequestDraft.relatedLinks.length) {
                                <div class="dependency-register-table-shell change-request-drawer-table-shell">
                                  <table class="dependency-register-table change-request-drawer-table" aria-label="Related links added to change request">
                                    <thead><tr><th>Name</th><th>Description</th><th>Document</th><th></th></tr></thead>
                                    <tbody>
                                      @for (link of changeRequestDraft.relatedLinks; track link.id) {
                                        <tr>
                                          <td class="dependency-register-primary"><strong>{{ link.name }}</strong></td>
                                          <td>{{ link.description || 'No description added' }}</td>
                                          <td class="related-links-register-access"><strong><a [href]="relatedLinkHref(link.documentLink)" target="_blank" rel="noreferrer">Open document</a></strong><small>{{ link.documentLink }}</small></td>
                                          <td class="schedule-table-actions"><button pmConsoleTableAction iconName="trash-2" actionClass="schedule-table-action danger" type="button" (click)="removeChangeRequestRelatedLink(link.id)" [attr.aria-label]="'Remove ' + link.name"></button></td>
                                        </tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              } @else {
                                <div class="change-request-related-empty">
                                  <span class="icon" aria-hidden="true"><i data-lucide="link-2-off"></i></span>
                                  <strong>No related link(s) added.</strong>
                                  <p>Add approvals, source packs, or supporting documents that PMO should review with this PCR.</p>
                                </div>
                              }
                            </section>
                          }
                        </div>
                      </app-pm-console-plan-drawer>
                    }

    }

    @if (selectedPage !== 'project-plan') {
      @if (activeBenefitDrawer; as register) {
        <app-pm-console-plan-drawer
          [title]="benefitDrawerTitle"
          [eyebrow]="register.fieldName + ' · AI ready'"
          [description]="register.description"
          [submitLabel]="benefitDrawerSubmitLabel"
          [submitDisabled]="!canSaveBenefitDraft(register)"
          closeAriaLabel="Close benefit drawer"
          panelClass="benefit-drawer"
          (close)="closeBenefitDrawer()"
          (submitForm)="saveBenefitDrawer($event)"
        >
          <div planDrawerBody class="dependency-drawer-grid benefit-drawer-grid">
            <app-pm-console-field label="Linked Project" type="select" [value]="register.draft.project" [options]="register.projectOptions" placeholder="Select linked project" ariaLabel="Linked Project" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateBenefitDraft('project', $event)" />
            <app-pm-console-field label="Benefit Type" type="select" [value]="register.draft.benefitType" [options]="register.benefitTypeOptions" [placeholder]="register.benefitTypePlaceholder" ariaLabel="Benefit Type" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('benefitType', $event)" />
            <app-pm-console-field label="Benefit Category" type="select" [value]="register.draft.category" [options]="register.benefitCategoryOptions" [placeholder]="register.benefitCategoryPlaceholder" ariaLabel="Benefit Category" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('category', $event)" />
            <app-pm-console-field label="Benefit Name" [value]="register.draft.benefitName" placeholder="Enter benefit name" ariaLabel="Benefit Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" (valueChange)="updateBenefitDraft('benefitName', $event)" />
            <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Enter description" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateBenefitDraft('description', $event)" />
            <app-pm-console-field label="Benefit Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Benefit Owner" fieldClass="dependency-drawer-field" (valueChange)="updateBenefitDraft('owner', $event)" />
            <app-pm-console-field label="Realisation Date" type="date" [value]="register.draft.realizationDate" ariaLabel="Realisation Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateBenefitDraft('realizationDate', $event)" />
          </div>
        </app-pm-console-plan-drawer>
      }
      @if (activeRiskDrawer; as register) {
        <app-pm-console-plan-drawer
          [title]="riskDrawerTitle"
          [eyebrow]="register.fieldName"
          [description]="register.description"
          [submitLabel]="editingRiskPlanId ? 'Save changes' : register.actionLabel"
          [submitDisabled]="!canSaveRiskDraft(register)"
          closeAriaLabel="Close risk drawer"
          panelClass="risk-drawer"
          (close)="closeRiskDrawer()"
          (submitForm)="saveRiskDrawer($event)"
        >
          <div planDrawerBody class="risk-drawer-layout">
            <div class="dependency-drawer-grid risk-drawer-grid">
              <app-pm-console-field label="Risk Category" type="select" [value]="register.draft.riskCategory" [options]="register.categoryOptions" [placeholder]="register.categoryPlaceholder" ariaLabel="Risk Category" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('riskCategory', $event)" />
              <app-pm-console-field label="Risk Status" type="select" [value]="register.draft.status" [options]="register.statusOptions" [placeholder]="register.statusPlaceholder" ariaLabel="Risk Status" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('status', $event)" />
              <app-pm-console-field label="Risk Name" type="textarea" [value]="register.draft.riskName" placeholder="Type risk name here" ariaLabel="Risk Name" fieldClass="dependency-drawer-field" [mandatory]="true" [wide]="true" [maxLength]="500" [afterText]="riskDrawerCharacterCount + ' characters remaining'" (valueChange)="updateRiskDraft('riskName', $event)" />
              <app-pm-console-field label="Description" type="textarea" [value]="register.draft.description" placeholder="Type risk description here" ariaLabel="Description" fieldClass="dependency-drawer-field" [wide]="true" (valueChange)="updateRiskDraft('description', $event)" />
              <app-pm-console-field label="Risk Owner" type="select" [value]="register.draft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Risk Owner" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('owner', $event)" />
              <app-pm-console-field label="Risk Manager" type="select" [value]="register.draft.manager" [options]="register.ownerOptions" ariaLabel="Risk Manager" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('manager', $event)" />
              <app-pm-console-field label="Start Date" type="date" [value]="register.draft.startDate" ariaLabel="Start Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('startDate', $event)" />
              <app-pm-console-field label="End Date" type="date" [value]="register.draft.endDate" ariaLabel="End Date" fieldClass="dependency-drawer-field" [mandatory]="true" (valueChange)="updateRiskDraft('endDate', $event)" />
              <app-pm-console-field label="Actual Risk Likelihood" type="select" [value]="register.draft.actualLikelihood" [options]="register.likelihoodOptions" placeholder="Select likelihood" ariaLabel="Actual Risk Likelihood" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('actualLikelihood', $event)" />
              <app-pm-console-field label="Actual Risk Consequence" type="select" [value]="register.draft.actualConsequence" [options]="register.consequenceOptions" placeholder="Select consequence" ariaLabel="Actual Risk Consequence" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('actualConsequence', $event)" />
              <app-pm-console-field label="Actual Risk Rating" [value]="register.draft.actualRating || '-'" ariaLabel="Actual Risk Rating" fieldClass="dependency-drawer-field" [disabled]="true" />
              <app-pm-console-field label="Residual Risk Likelihood" type="select" [value]="register.draft.residualLikelihood" [options]="register.likelihoodOptions" placeholder="Select likelihood" ariaLabel="Residual Risk Likelihood" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('residualLikelihood', $event)" />
              <app-pm-console-field label="Residual Risk Consequence" type="select" [value]="register.draft.residualConsequence" [options]="register.consequenceOptions" placeholder="Select consequence" ariaLabel="Residual Risk Consequence" fieldClass="dependency-drawer-field" (valueChange)="updateRiskDraft('residualConsequence', $event)" />
              <app-pm-console-field label="Residual Risk Rating" [value]="register.draft.residualRating || '-'" ariaLabel="Residual Risk Rating" fieldClass="dependency-drawer-field" [disabled]="true" />
              <section class="risk-radio-field wide" aria-label="Enterprise wide impact">
                <span class="matrix-field-label">Does this risk have an enterprise wide impact?</span>
                <label><input type="radio" name="risk-enterprise-workspace-drawer" [checked]="register.draft.enterpriseImpact" (change)="updateRiskDraftEnterpriseImpact(true)" /> Yes</label>
                <label><input type="radio" name="risk-enterprise-workspace-drawer" [checked]="!register.draft.enterpriseImpact" (change)="updateRiskDraftEnterpriseImpact(false)" /> No</label>
              </section>
            </div>

            <aside class="risk-drawer-matrix-stack">
              <app-pm-console-risk-matrix
                title="Actual risk rating"
                description="Click the consequence and likelihood cell."
                [likelihood]="register.draft.actualLikelihood"
                [consequence]="register.draft.actualConsequence"
                [compact]="true"
                (selectionChange)="updateRiskDraftMatrix('actual', $event)"
              ></app-pm-console-risk-matrix>
              <app-pm-console-risk-matrix
                title="Residual risk rating"
                description="Expected level after treatment."
                [likelihood]="register.draft.residualLikelihood"
                [consequence]="register.draft.residualConsequence"
                [compact]="true"
                (selectionChange)="updateRiskDraftMatrix('residual', $event)"
              ></app-pm-console-risk-matrix>
            </aside>
          </div>

          <section planDrawerBody class="risk-treatment-card risk-drawer-treatment-card">
            <header>
              <div>
                <span class="risk-profile-section-eyebrow">Treatment</span>
                <strong>{{ riskTreatmentCountLabel(register.draft.treatments) }}</strong>
              </div>
            </header>
            <div class="risk-treatment-compose">
              <app-pm-console-field label="Proposed Treatment" type="textarea" [value]="riskTreatmentDraft.treatment" placeholder="Describe the treatment action" ariaLabel="Proposed Treatment" fieldClass="risk-profile-field" [wide]="true" (valueChange)="updateRiskTreatmentDraft('treatment', $event)" />
              <app-pm-console-field label="Type" type="select" [value]="riskTreatmentDraft.type" [options]="register.treatmentTypeOptions" ariaLabel="Treatment Type" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('type', $event)" />
              <app-pm-console-field label="Category" type="select" [value]="riskTreatmentDraft.category" [options]="register.treatmentCategoryOptions" ariaLabel="Treatment Category" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('category', $event)" />
              <app-pm-console-field label="Owner" type="select" [value]="riskTreatmentDraft.owner" [options]="register.ownerOptions" [placeholder]="register.ownerPlaceholder" ariaLabel="Treatment Owner" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('owner', $event)" />
              <app-pm-console-field label="End Date" type="date" [value]="riskTreatmentDraft.endDate" ariaLabel="Treatment End Date" fieldClass="risk-profile-field" (valueChange)="updateRiskTreatmentDraft('endDate', $event)" />
              <button class="risk-profile-add-treatment" type="button" [disabled]="!canAddRiskTreatmentDraft()" (click)="addRiskTreatmentToDraft()"><span pmConsoleIcon="plus" aria-hidden="true"></span>Add risk treatment</button>
            </div>
            @if (register.draft.treatments.length) {
              <div class="risk-treatment-pill-list">
                @for (treatment of register.draft.treatments; track treatment.id) {
                  <span>
                    {{ treatment.treatment }}
                    <button type="button" (click)="removeRiskTreatmentFromDraft(treatment.id)" [attr.aria-label]="'Remove treatment'"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                  </span>
                }
              </div>
            }
          </section>
        </app-pm-console-plan-drawer>
      }
    }
  `,
})
export class PmConsolePlanDrawersComponent {
  [key: string]: any;
  declare activeBenefitDrawer: any;
  declare activeBudgetYear: any;
  declare activeChangeImpactDrawer: any;
  declare activeDependencyRegister: any;
  declare activeIssuePlan: any;
  declare activeRelatedLinksRegister: any;
  declare activeResourcePlan: any;
  declare activeRiskDrawer: any;
  declare addChangeImpactStrategy: any;
  declare addChangeRequestRelatedLink: any;
  declare addResourceDraftAttachmentLink: any;
  declare addResourceDraftAttachments: any;
  declare addRiskTreatmentToDraft: any;
  declare attachment: any;
  declare attachmentMeta: any;
  declare benefitDrawerSubmitLabel: any;
  declare benefitDrawerTitle: any;
  declare budgetFundingSourceDraft: any;
  declare budgetMonthlyAvailable: any;
  declare budgetMonthlyEditorRows: any;
  declare budgetMonthlyTotal: any;
  declare budgetPlanConfig: any;
  declare budgetYearDraft: any;
  declare canAddChangeRequestRelatedLink: any;
  declare canAddRiskTreatmentDraft: any;
  declare canSaveBenefitDraft: any;
  declare canSaveBudgetFundingDraft: any;
  declare canSaveBudgetYearDraft: any;
  declare canSaveChangeImpactDraft: any;
  declare canSaveChangeRequestDraft: any;
  declare canSaveDependencyDraft: any;
  declare canSaveIssueDraft: any;
  declare canSaveOverviewBusinessDriverDraft: any;
  declare canSaveOverviewCapabilityDraft: any;
  declare canSaveOverviewObjectiveDraft: any;
  declare canSaveOverviewOutcomeDraft: any;
  declare canSaveOverviewServiceDraft: any;
  declare canSaveRelatedLinksDraft: any;
  declare canSaveResourceDraft: any;
  declare canSaveRiskDraft: any;
  declare canSaveScheduleEndProductDraft: any;
  declare canSaveScheduleManagementProductDraft: any;
  declare canSaveScheduleMilestoneDraft: any;
  declare changeImpactCommentCharactersRemaining: any;
  declare changeRequestCommentCharactersRemaining: any;
  declare changeRequestDraft: any;
  declare changeRequestDrawerTab: any;
  declare changeRequestDrawerTabs: any;
  declare changeRequestDrawerTitle: any;
  declare changeRequestImpactBenefits: any;
  declare changeRequestImpactCapabilities: any;
  declare changeRequestImpactProjects: any;
  declare changeRequestImpactTab: any;
  declare changeRequestImpactTabs: any;
  declare changeRequestPriorityOptions: any;
  declare changeRequestTriggerOptions: any;
  declare changeRequestTypeOptions: any;
  declare closeBenefitDrawer: any;
  declare closeBudgetDrawer: any;
  declare closeBudgetFundingDrawer: any;
  declare closeBudgetMonthlyDrawer: any;
  declare closeChangeImpactDrawer: any;
  declare closeChangeRequestDrawer: any;
  declare closeDependencyDrawer: any;
  declare closeIssueDrawer: any;
  declare closeOverviewBusinessDriverDrawer: any;
  declare closeOverviewCapabilityDrawer: any;
  declare closeOverviewObjectiveDrawer: any;
  declare closeOverviewOutcomeDrawer: any;
  declare closeOverviewServiceDrawer: any;
  declare closeRelatedLinksDrawer: any;
  declare closeResourceDrawer: any;
  declare closeRiskDrawer: any;
  declare closeScheduleEndProductDrawer: any;
  declare closeScheduleManagementProductDrawer: any;
  declare closeScheduleMilestoneDrawer: any;
  declare editingChangeRequestId: any;
  declare editingOverviewBusinessDriverId: any;
  declare editingOverviewCapabilityId: any;
  declare editingOverviewObjectiveId: any;
  declare editingOverviewOutcomeId: any;
  declare editingOverviewServiceId: any;
  declare editingResourcePlanId: any;
  declare editingRiskPlanId: any;
  declare editingScheduleEndProductId: any;
  declare editingScheduleManagementProductId: any;
  declare editingScheduleMilestoneId: any;
  declare formatBudgetCurrency: any;
  declare iconName: any;
  declare isBudgetDrawerOpen: any;
  declare isBudgetFundingDrawerOpen: any;
  declare isBudgetMonthlyDrawerOpen: any;
  declare isChangeRequestDrawerOpen: any;
  declare isChangeRequestTypeSelected: any;
  declare isIssueDrawerOpen: any;
  declare isOverviewBusinessDriverDrawerOpen: any;
  declare isOverviewCapabilityDrawerOpen: any;
  declare isOverviewObjectiveDrawerOpen: any;
  declare isOverviewOutcomeDrawerOpen: any;
  declare isOverviewServiceDrawerOpen: any;
  declare isRelatedLinksDrawerOpen: any;
  declare isResourceDrawerOpen: any;
  declare isScheduleEndProductDrawerOpen: any;
  declare isScheduleManagementProductDrawerOpen: any;
  declare isScheduleMilestoneDrawerOpen: any;
  declare link: any;
  declare option: any;
  declare overviewBusinessDriverDraft: any;
  declare overviewBusinessDriverOptionLabels: any;
  declare overviewCapabilityDraft: any;
  declare overviewCapabilityDrawerTitle: any;
  declare overviewCapabilityOptions: any;
  declare overviewDriverDrawerTitle: any;
  declare overviewObjectiveDraft: any;
  declare overviewObjectiveDrawerTitle: any;
  declare overviewObjectiveStatusOptions: any;
  declare overviewOutcomeDraft: any;
  declare overviewOutcomeDrawerTitle: any;
  declare overviewOutcomeStatusOptions: any;
  declare overviewServiceDraft: any;
  declare overviewServiceDrawerTitle: any;
  declare overviewServiceGroupOptions: any;
  declare overviewServiceOptions: any;
  declare overviewServicePhaseOptions: any;
  declare overviewServiceValueStreamOptions: any;
  declare overviewStrategicObjectiveLinks: any;
  declare priority: any;
  declare product: any;
  declare projectPlanEntry: any;
  declare register: any;
  declare relatedLinkHref: any;
  declare removeChangeImpactStrategy: any;
  declare removeChangeRequestRelatedLink: any;
  declare removeResourceDraftAttachment: any;
  declare removeRiskTreatmentFromDraft: any;
  declare riskDrawerCharacterCount: any;
  declare riskDrawerTitle: any;
  declare riskTreatmentCountLabel: any;
  declare riskTreatmentDraft: any;
  declare row: any;
  declare saveBenefitDrawer: any;
  declare saveBudgetDrawer: any;
  declare saveBudgetFundingDrawer: any;
  declare saveBudgetMonthlyDrawer: any;
  declare saveChangeImpactDrawer: any;
  declare saveChangeRequestDrawer: any;
  declare saveDependencyDrawer: any;
  declare saveIssueDrawer: any;
  declare saveOverviewBusinessDriverDrawer: any;
  declare saveOverviewCapabilityDrawer: any;
  declare saveOverviewObjectiveDrawer: any;
  declare saveOverviewOutcomeDrawer: any;
  declare saveOverviewServiceDrawer: any;
  declare saveRelatedLinksDrawer: any;
  declare saveResourceDrawer: any;
  declare saveRiskDrawer: any;
  declare saveScheduleEndProductDrawer: any;
  declare saveScheduleManagementProductDrawer: any;
  declare saveScheduleMilestoneDrawer: any;
  declare scheduleEndProductDraft: any;
  declare scheduleManagementProductDraft: any;
  declare scheduleMilestoneDraft: any;
  declare scheduleScopeCapabilityOptions: any;
  declare scheduleScopeCategoryOptions: any;
  declare scheduleScopeDeliveryLinkOptions: any;
  declare scheduleScopeEndProductDrawerTitle: any;
  declare scheduleScopeManagementProductDrawerTitle: any;
  declare scheduleScopeMilestoneDrawerTitle: any;
  declare scheduleScopeOwnerOptions: any;
  declare scheduleScopePriorityOptions: any;
  declare selectedPage: any;
  declare setChangeRequestDrawerTab: any;
  declare setChangeRequestImpactTab: any;
  declare strategy: any;
  declare tab: any;
  declare toggleChangeRequestType: any;
  declare toggleOverviewCapabilitySelection: any;
  declare track: any;
  declare treatment: any;
  declare updateBenefitDraft: any;
  declare updateBudgetFundingDraft: any;
  declare updateBudgetMonthlyRow: any;
  declare updateBudgetYearDraft: any;
  declare updateChangeImpactDraft: any;
  declare updateChangeRequestDraft: any;
  declare updateChangeRequestRelatedLinkDraft: any;
  declare updateDependencyDraft: any;
  declare updateIssueDraft: any;
  declare updateOverviewBusinessDriverDraft: any;
  declare updateOverviewObjectiveDraft: any;
  declare updateOverviewOutcomeDraft: any;
  declare updateOverviewServiceDraft: any;
  declare updateRelatedLinksDraft: any;
  declare updateResourceDraft: any;
  declare updateRiskDraft: any;
  declare updateRiskDraftEnterpriseImpact: any;
  declare updateRiskDraftMatrix: any;
  declare updateRiskTreatmentDraft: any;
  declare updateScheduleEndProductDraft: any;
  declare updateScheduleManagementProductDraft: any;
  declare updateScheduleMilestoneDraft: any;
  declare year: any;

  private hostValue: PlanDrawersHost | null = null;
  private hostProxyAttached = false;

  @Input({ required: true })
  set host(value: PlanDrawersHost) {
    this.hostValue = value;
    this.attachHostProxy();
  }

  get host(): PlanDrawersHost | null {
    return this.hostValue;
  }

  private attachHostProxy(): void {
    if (this.hostProxyAttached) {
      return;
    }

    const componentPrototype = Object.getPrototypeOf(this);
    const proxyTarget = Object.create(componentPrototype);

    Object.setPrototypeOf(
      this,
      new Proxy(proxyTarget, {
        get: (target, property, receiver) => {
          if (property in target) {
            return Reflect.get(target, property, receiver);
          }

          const value = this.hostValue?.[property as string];
          return typeof value === 'function' ? value.bind(this.hostValue) : value;
        },
        set: (target, property, value, receiver) => {
          if (property in target || !this.hostValue) {
            return Reflect.set(target, property, value, receiver);
          }

          this.hostValue[property as string] = value;
          return true;
        },
      }),
    );

    this.hostProxyAttached = true;
  }
}
