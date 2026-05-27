import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';
import { PmConsoleFieldComponent } from '../shared/pm-console-field.component';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from '../shared/pm-console-row-action-menu.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { ProgramRow, Risk, type RiskExposure, type RiskLevel, type RiskStatus } from './portfolio-workspace.data';

export interface ProjectGroup {
  key: string;
  label: string;
  risks: Risk[];
}

export interface ProgramGroup {
  key: string;
  label: string;
  directRisks: Risk[];
  projects: ProjectGroup[];
}

export interface PortfolioGroup {
  key: string;
  label: string;
  directRisks: Risk[];
  programs: ProgramGroup[];
  standaloneProjects: ProjectGroup;
}

interface ProjectLinkOption {
  label: string;
  projectName: string;
  parentProgram?: string;
}

interface AddPortfolioRiskDraft {
  level: RiskLevel;
  program: string;
  project: string;
  riskName: string;
  owner: string;
  mitigation: string;
  lastReview: string;
  exposure: RiskExposure;
  status: RiskStatus;
}

@Component({
  selector: 'app-portfolio-workspace-risk-register',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleFieldComponent,
    PmConsoleIconComponent,
    PmConsolePlanDrawerComponent,
    PmConsoleRowActionMenuComponent,
    PmConsoleStatusPillComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="risk-register-host animation-slide" aria-label="Risk register">
      <div class="risk-table-panel">
        <article class="risk-hierarchy-shell">
          <header class="risk-hierarchy-toolbar" aria-label="Risk register tools">
            <div class="risk-hierarchy-toolbar-left">
              <span class="risk-register-grouped-by" aria-label="Grouped by portfolio program project">
                <span>Grouped By</span>
                <strong>Portfolio / Program / Project</strong>
              </span>
              <span class="risk-register-total">{{ riskCountLabel(activeRisks.length) }}</span>
            </div>

            <div class="risk-hierarchy-toolbar-actions">
              <label class="risk-hierarchy-search">
                <span pmConsoleIcon="search" aria-hidden="true"></span>
                <input
                  type="search"
                  [value]="riskSearchQuery"
                  placeholder="Search risks"
                  aria-label="Search risks"
                  (input)="setRiskSearchQuery($event)"
                />
              </label>
              <button class="risk-toolbar-button" type="button" aria-label="Filter risks">
                <span pmConsoleIcon="filter" aria-hidden="true"></span>
                <span>Filter</span>
              </button>
              <button class="risk-toolbar-button" type="button" aria-label="Export risks">
                <span pmConsoleIcon="download" aria-hidden="true"></span>
                <span>Export</span>
              </button>
              <button class="risk-toolbar-button primary" type="button" aria-label="Add risk" (click)="openAddRiskDrawer()">
                <span pmConsoleIcon="plus" aria-hidden="true"></span>
                <span>Add Risk</span>
              </button>
            </div>
          </header>

          <div class="risk-hierarchy-table" role="table" aria-label="Hierarchical risk register">
            <div class="risk-hierarchy-head" role="row">
              <span>Risk</span>
              <span>Owner</span>
              <span>Mitigation</span>
              <span>Last Review</span>
              <span>Exposure</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            @if (activeRisks.length) {
              @let hierarchy = riskHierarchy;
              <section class="risk-node risk-node-portfolio" [class.is-collapsed]="isRiskNodeCollapsed(portfolioNodeId)" aria-label="Portfolio risk group">
                <button
                  class="risk-node-header"
                  type="button"
                  [attr.aria-expanded]="!isRiskNodeCollapsed(portfolioNodeId)"
                  (click)="toggleRiskNode(portfolioNodeId)"
                >
                  <span [pmConsoleIcon]="isRiskNodeCollapsed(portfolioNodeId) ? 'chevron-right' : 'chevron-down'" class="risk-node-chevron" aria-hidden="true"></span>
                  <span class="risk-level-badge portfolio">Portfolio</span>
                  <strong>{{ hierarchy.label }}</strong>
                  <span class="risk-node-count">{{ riskCountLabel(activeRisks.length) }}</span>
                  @if (hierarchy.directRisks.length) {
                    <small>{{ riskCountLabel(hierarchy.directRisks.length) }} at this level</small>
                  }
                </button>

                @if (!isRiskNodeCollapsed(portfolioNodeId)) {
                  <div class="risk-node-body">
                    <ng-container *ngTemplateOutlet="riskRows; context: { $implicit: hierarchy.directRisks }"></ng-container>

                    @for (program of hierarchy.programs; track program.key) {
                      <section class="risk-node risk-node-program" [class.is-collapsed]="isRiskNodeCollapsed(program.key)">
                        <button
                          class="risk-node-header"
                          type="button"
                          [attr.aria-expanded]="!isRiskNodeCollapsed(program.key)"
                          (click)="toggleRiskNode(program.key)"
                        >
                          <span [pmConsoleIcon]="isRiskNodeCollapsed(program.key) ? 'chevron-right' : 'chevron-down'" class="risk-node-chevron" aria-hidden="true"></span>
                          <span class="risk-level-badge program">Program</span>
                          <strong>{{ program.label }}</strong>
                          <span class="risk-node-count">{{ riskCountLabel(programRiskCount(program)) }}</span>
                          @if (program.directRisks.length) {
                            <small>{{ riskCountLabel(program.directRisks.length) }} at program level</small>
                          }
                        </button>

                        @if (!isRiskNodeCollapsed(program.key)) {
                          <div class="risk-node-body">
                            <ng-container *ngTemplateOutlet="riskRows; context: { $implicit: program.directRisks }"></ng-container>

                            @for (project of program.projects; track project.key) {
                              <section class="risk-node risk-node-project" [class.is-collapsed]="isRiskNodeCollapsed(project.key)">
                                <button
                                  class="risk-node-header"
                                  type="button"
                                  [attr.aria-expanded]="!isRiskNodeCollapsed(project.key)"
                                  (click)="toggleRiskNode(project.key)"
                                >
                                  <span [pmConsoleIcon]="isRiskNodeCollapsed(project.key) ? 'chevron-right' : 'chevron-down'" class="risk-node-chevron" aria-hidden="true"></span>
                                  <span class="risk-level-badge project">Project</span>
                                  <strong>{{ project.label }}</strong>
                                  <span class="risk-node-count">{{ riskCountLabel(project.risks.length) }}</span>
                                </button>

                                @if (!isRiskNodeCollapsed(project.key)) {
                                  <div class="risk-node-body">
                                    <ng-container *ngTemplateOutlet="riskRows; context: { $implicit: project.risks }"></ng-container>
                                  </div>
                                }
                              </section>
                            }
                          </div>
                        }
                      </section>
                    }

                    @if (standaloneRiskProjects.length) {
                      <section class="risk-node risk-node-standalone" [class.is-collapsed]="isRiskNodeCollapsed(standaloneNodeId)">
                        <button
                          class="risk-node-header"
                          type="button"
                          [attr.aria-expanded]="!isRiskNodeCollapsed(standaloneNodeId)"
                          (click)="toggleRiskNode(standaloneNodeId)"
                        >
                          <span [pmConsoleIcon]="isRiskNodeCollapsed(standaloneNodeId) ? 'chevron-right' : 'chevron-down'" class="risk-node-chevron" aria-hidden="true"></span>
                          <span class="risk-level-badge standalone">Standalone</span>
                          <strong>Standalone Projects</strong>
                          <span class="risk-node-count">{{ riskCountLabel(standaloneRiskCount) }}</span>
                        </button>

                        @if (!isRiskNodeCollapsed(standaloneNodeId)) {
                          <div class="risk-node-body">
                            @for (project of standaloneRiskProjects; track project.key) {
                              <section class="risk-node risk-node-project" [class.is-collapsed]="isRiskNodeCollapsed(project.key)">
                                <button
                                  class="risk-node-header"
                                  type="button"
                                  [attr.aria-expanded]="!isRiskNodeCollapsed(project.key)"
                                  (click)="toggleRiskNode(project.key)"
                                >
                                  <span [pmConsoleIcon]="isRiskNodeCollapsed(project.key) ? 'chevron-right' : 'chevron-down'" class="risk-node-chevron" aria-hidden="true"></span>
                                  <span class="risk-level-badge project">Project</span>
                                  <strong>{{ project.label }}</strong>
                                  <span class="risk-node-count">{{ riskCountLabel(project.risks.length) }}</span>
                                </button>

                                @if (!isRiskNodeCollapsed(project.key)) {
                                  <div class="risk-node-body">
                                    <ng-container *ngTemplateOutlet="riskRows; context: { $implicit: project.risks }"></ng-container>
                                  </div>
                                }
                              </section>
                            }
                          </div>
                        }
                      </section>
                    }
                  </div>
                }
              </section>
            } @else {
              <div class="risk-hierarchy-empty">
                <span pmConsoleIcon="shield-alert" aria-hidden="true"></span>
                <strong>No risks match this view</strong>
                <span>Clear the search or add a risk linked to this portfolio.</span>
              </div>
            }
          </div>
        </article>
      </div>

      <ng-template #riskRows let-risks>
        @for (risk of risks; track risk.id) {
          <div class="risk-item-row" role="row">
            <div class="risk-item-primary" role="cell">
              <span class="risk-id">{{ risk.id }}</span>
              <div>
                <strong>{{ risk.name }}</strong>
                <small>{{ riskLineageLabel(risk) }}</small>
              </div>
            </div>
            <div class="risk-owner" role="cell">
              <span class="risk-avatar" aria-hidden="true">{{ risk.owner.initials }}</span>
              <span>{{ risk.owner.name }}</span>
            </div>
            <div class="risk-mitigation" role="cell">{{ risk.mitigation }}</div>
            <div class="risk-date" role="cell">{{ risk.lastReview }}</div>
            <div role="cell">
              <span [pmConsoleStatusPill]="valueLabel(risk.exposure)" baseClass="pm-table-row-status" [tone]="exposureTone(risk.exposure)"></span>
            </div>
            <div role="cell">
              <span [pmConsoleStatusPill]="valueLabel(risk.status)" baseClass="pm-table-row-status" [tone]="statusTone(risk.status)"></span>
            </div>
            <div class="risk-actions" role="cell">
              <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + risk.id">
                <button type="button" role="menuitem">
                  <span pmConsoleIcon="panel-right-open" aria-hidden="true"></span>
                  Manage
                </button>
                <button type="button" role="menuitem">
                  <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                  Edit
                </button>
              </app-pm-console-row-action-menu>
            </div>
          </div>
        }
      </ng-template>

      @if (isAddRiskDrawerOpen) {
        <app-pm-console-plan-drawer
          title="Add risk"
          eyebrow="Risk Register"
          description="Create a risk and link it to the portfolio, a program, or a project."
          submitLabel="Add risk"
          closeAriaLabel="Close add risk drawer"
          panelClass="portfolio-risk-drawer"
          [submitDisabled]="!canSaveAddRiskDraft"
          (close)="closeAddRiskDrawer()"
          (submitForm)="saveAddRisk($event)"
        >
          <div planDrawerBody class="portfolio-risk-drawer-grid">
            <app-pm-console-field
              label="Link risk to"
              type="select"
              [value]="riskLevelLabel(addRiskDraft.level)"
              [options]="riskLevelOptions"
              ariaLabel="Link risk to"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskLevelFromLabel($event)"
            />

            @if (addRiskDraft.level === 'program') {
              <app-pm-console-field
                label="Program"
                type="select"
                [value]="addRiskDraft.program"
                [options]="programOptions"
                ariaLabel="Program"
                fieldClass="dependency-drawer-field"
                [mandatory]="true"
                (valueChange)="updateAddRiskDraft('program', $event)"
              />
            }

            @if (addRiskDraft.level === 'project') {
              <app-pm-console-field
                label="Project"
                type="select"
                [value]="addRiskDraft.project"
                [options]="projectOptions"
                ariaLabel="Project"
                fieldClass="dependency-drawer-field"
                [mandatory]="true"
                (valueChange)="updateAddRiskDraft('project', $event)"
              />
            }

            <app-pm-console-field
              label="Risk Name"
              type="textarea"
              [value]="addRiskDraft.riskName"
              placeholder="Type risk name here"
              ariaLabel="Risk Name"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              [wide]="true"
              [maxLength]="500"
              (valueChange)="updateAddRiskDraft('riskName', $event)"
            />
            <app-pm-console-field
              label="Risk Owner"
              type="select"
              [value]="addRiskDraft.owner"
              [options]="ownerOptions"
              ariaLabel="Risk Owner"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskDraft('owner', $event)"
            />
            <app-pm-console-field
              label="Exposure"
              type="select"
              [value]="valueLabel(addRiskDraft.exposure)"
              [options]="exposureOptions"
              ariaLabel="Exposure"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskExposure($event)"
            />
            <app-pm-console-field
              label="Status"
              type="select"
              [value]="valueLabel(addRiskDraft.status)"
              [options]="statusOptions"
              ariaLabel="Status"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskStatus($event)"
            />
            <app-pm-console-field
              label="Last Review"
              type="date"
              [value]="addRiskDraft.lastReview"
              ariaLabel="Last Review"
              fieldClass="dependency-drawer-field"
              (valueChange)="updateAddRiskDraft('lastReview', $event)"
            />
            <app-pm-console-field
              label="Mitigation"
              type="textarea"
              [value]="addRiskDraft.mitigation"
              placeholder="Describe the current mitigation or next control action"
              ariaLabel="Mitigation"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              [wide]="true"
              (valueChange)="updateAddRiskDraft('mitigation', $event)"
            />
          </div>
        </app-pm-console-plan-drawer>
      }
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .risk-register-host {
      --risk-register-section-gap: 12px;
      display: grid;
      flex: 1;
      gap: 0;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      width: 100%;
    }

    .risk-table-panel {
      background: #f7f8fc;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      padding: var(--risk-register-section-gap) 20px 20px;
    }

    .risk-hierarchy-shell {
      display: grid;
      gap: 12px;
      grid-template-rows: auto minmax(0, 1fr);
      height: 100%;
      min-height: 0;
      min-width: 0;
    }

    .risk-hierarchy-toolbar {
      align-items: center;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      min-height: 40px;
      min-width: 0;
    }

    .risk-hierarchy-toolbar-left,
    .risk-hierarchy-toolbar-actions {
      align-items: center;
      display: flex;
      gap: 10px;
      min-width: 0;
    }

    .risk-register-grouped-by {
      align-items: center;
      color: #6f7584;
      display: inline-flex;
      font-size: 12px;
      gap: 8px;
      line-height: 16px;
      white-space: nowrap;
    }

    .risk-register-grouped-by strong,
    .risk-register-total {
      background: #eef1f6;
      border: 1px solid #e8ebf2;
      border-radius: 999px;
      color: #546073;
      font-size: 12px;
      font-weight: 400;
      height: 32px;
      line-height: 16px;
      padding: 7px 12px;
      white-space: nowrap;
    }

    .risk-register-total {
      background: #f5f6fb;
      color: #737b8d;
    }

    .risk-hierarchy-search,
    .risk-toolbar-button {
      align-items: center;
      background: #ffffff;
      border: 1px solid #e0e3ea;
      border-radius: 8px;
      color: #3c4454;
      display: inline-flex;
      gap: 8px;
      height: 40px;
      min-height: 40px;
    }

    .risk-hierarchy-search {
      padding: 0 10px;
      width: 220px;
    }

    .risk-hierarchy-search .icon,
    .risk-toolbar-button .icon {
      color: #6f7584;
      height: 16px;
      width: 16px;
    }

    .risk-hierarchy-search input {
      border: 0;
      color: #252a34;
      font-size: 12px;
      min-width: 0;
      outline: 0;
      width: 100%;
    }

    .risk-toolbar-button {
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      justify-content: center;
      padding: 0 14px;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
      white-space: nowrap;
    }

    .risk-toolbar-button:hover,
    .risk-toolbar-button:focus-visible,
    .risk-hierarchy-search:focus-within {
      border-color: #cfd5e2;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
      outline: 0;
    }

    .risk-toolbar-button.primary {
      background: var(--brand, #10069f);
      border-color: var(--brand, #10069f);
      color: #ffffff;
      font-weight: 600;
    }

    .risk-toolbar-button.primary .icon {
      color: #ffffff;
    }

    .risk-hierarchy-table {
      background: #ffffff;
      border: 1px solid #e0e3ea;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      min-height: 0;
      overflow: auto;
    }

    .risk-hierarchy-head,
    .risk-item-row {
      display: grid;
      grid-template-columns: minmax(230px, 1.7fr) minmax(128px, 0.8fr) minmax(220px, 1.4fr) 104px 96px 104px 72px;
      min-width: 1040px;
    }

    .risk-hierarchy-head {
      background: #f3f5f9;
      border-bottom: 1px solid #e1e4ec;
      color: #303643;
      font-size: 11px;
      font-weight: 500;
      line-height: 16px;
      position: sticky;
      top: 0;
      z-index: 5;
    }

    .risk-hierarchy-head span,
    .risk-item-row > div {
      align-items: center;
      display: flex;
      min-width: 0;
      padding: 12px 14px;
    }

    .risk-node {
      min-width: 1040px;
      position: relative;
    }

    .risk-node-body {
      position: relative;
    }

    .risk-node-body::before {
      background: #d8dde8;
      bottom: 8px;
      content: "";
      left: 30px;
      position: absolute;
      top: 0;
      width: 1px;
    }

    .risk-node-program > .risk-node-body::before {
      left: 54px;
    }

    .risk-node-standalone > .risk-node-body::before,
    .risk-node-project > .risk-node-body::before {
      content: none;
    }

    .risk-node-header {
      align-items: center;
      background: #f8fafc;
      border: 0;
      border-bottom: 1px solid #e3e7ef;
      color: #2f3746;
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 10px;
      min-height: 48px;
      padding: 0 14px;
      position: relative;
      text-align: left;
      width: 100%;
      z-index: 1;
    }

    .risk-node-header:hover {
      background: #f4f7fb;
    }

    .risk-node-header:focus-visible {
      box-shadow: inset 0 0 0 2px rgba(16, 6, 159, 0.16);
      outline: 0;
    }

    .risk-node-header strong {
      color: #252a34;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-node-header small {
      color: #737b8d;
      font-size: 11px;
      line-height: 14px;
      margin-left: 2px;
      white-space: nowrap;
    }

    .risk-node-chevron {
      color: #6f7584;
      height: 16px;
      width: 16px;
    }

    .risk-level-badge,
    .risk-node-count,
    .risk-id {
      align-items: center;
      border-radius: 999px;
      display: inline-flex;
      flex: 0 0 auto;
      font-size: 10px;
      font-weight: 500;
      height: 22px;
      justify-content: center;
      line-height: 12px;
      padding: 0 8px;
      white-space: nowrap;
    }

    .risk-level-badge.portfolio {
      background: #efeefe;
      color: #10069f;
    }

    .risk-level-badge.program {
      background: #eaf3ff;
      color: #1d5bbf;
    }

    .risk-level-badge.project {
      background: #ecf8f2;
      color: #16704a;
    }

    .risk-level-badge.standalone {
      background: #fff7e8;
      color: #98690f;
    }

    .risk-node-count {
      background: #ffffff;
      border: 1px solid #e2e6ef;
      color: #5c6473;
      margin-left: auto;
    }

    .risk-node-program > .risk-node-header {
      background: #fbfcff;
      padding-left: 38px;
    }

    .risk-node-project > .risk-node-header {
      background: #ffffff;
      min-height: 44px;
      padding-left: 62px;
    }

    .risk-node-standalone > .risk-node-header {
      background: #fffdf9;
      padding-left: 38px;
    }

    .risk-item-row {
      background: #ffffff;
      border-bottom: 1px solid #edf0f5;
      color: #343b49;
      font-size: 11px;
      line-height: 15px;
    }

    .risk-item-row:hover {
      background: #fbfcff;
    }

    .risk-item-primary {
      gap: 10px;
      padding-left: 86px !important;
    }

    .risk-id {
      background: #f4f6fb;
      color: #4c5668;
      min-width: 58px;
    }

    .risk-item-primary strong {
      color: #12366d;
      display: -webkit-box;
      font-size: 11.5px;
      font-weight: 500;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .risk-item-primary small {
      color: #7b8495;
      display: block;
      font-size: 10px;
      line-height: 13px;
      margin-top: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-owner {
      gap: 8px;
    }

    .risk-avatar {
      align-items: center;
      background: #f1edff;
      border: 1px solid #e4dcff;
      border-radius: 999px;
      color: #10069f;
      display: inline-flex;
      flex: 0 0 auto;
      font-size: 10px;
      font-weight: 500;
      height: 26px;
      justify-content: center;
      width: 26px;
    }

    .risk-owner span:last-child,
    .risk-mitigation,
    .risk-date {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-actions {
      justify-content: center;
    }

    .risk-actions ::ng-deep .pm-row-action-trigger {
      height: 30px;
      width: 30px;
    }

    .risk-hierarchy-empty {
      align-items: center;
      color: #6f7584;
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
      min-height: 280px;
      padding: 36px;
      text-align: center;
    }

    .risk-hierarchy-empty .icon {
      color: #9aa3b4;
      height: 28px;
      width: 28px;
    }

    .risk-hierarchy-empty strong {
      color: #252a34;
      font-size: 14px;
      font-weight: 500;
    }

    .risk-table-panel app-pm-console-register-table {
      height: 100%;
    }

    .risk-table-panel ::ng-deep .pm-main-register-table-view {
      gap: var(--risk-register-section-gap);
    }

    .risk-table-panel ::ng-deep .pm-project-table-toolbar.portfolio-risk-register-toolbar {
      --action-control-height: 40px;
      --pm-toolbar-control-height: 40px;
      --pm-toolbar-square-size: 40px;
      align-items: center;
      gap: 14px;
      min-height: 40px;
    }

    .risk-table-panel ::ng-deep .pm-project-table-toolbar.portfolio-risk-register-toolbar > div {
      gap: 10px;
    }

    .risk-table-panel ::ng-deep .portfolio-risk-register-toolbar .pm-register-search-field,
    .risk-table-panel ::ng-deep .portfolio-risk-register-toolbar .pm-table-tool,
    .risk-table-panel ::ng-deep .portfolio-risk-register-toolbar .pm-table-add-project {
      height: 40px;
      min-height: 40px;
    }

    .risk-table-panel ::ng-deep .portfolio-risk-register-toolbar .pm-register-search-field,
    .risk-table-panel ::ng-deep .portfolio-risk-register-toolbar .pm-table-tool.square {
      width: 40px;
    }

    .risk-table-panel ::ng-deep .pm-register-grouped-by {
      font-size: 12px;
      gap: 8px;
      line-height: 16px;
    }

    .risk-table-panel ::ng-deep .pm-register-grouped-chip {
      background: #eef1f6;
      border-color: #e8ebf2;
      border-radius: 999px;
      color: #546073;
      font-size: 12px;
      gap: 6px;
      height: 32px;
      padding: 0 10px 0 12px;
    }

    .risk-table-panel ::ng-deep .pm-register-grouped-chip .pm-register-group-clear .icon {
      height: 12px;
      width: 12px;
    }

    .risk-table-panel ::ng-deep .pm-register-group-clear {
      height: 16px;
      width: 16px;
    }

    .risk-table-panel ::ng-deep .pm-main-register-table-scroll {
      border-color: #e0e3ea;
      border-radius: 16px;
      box-shadow: none;
      min-height: 0;
    }

    .risk-table-panel ::ng-deep .pm-main-register-table th,
    .risk-table-panel ::ng-deep .pm-main-register-table td {
      font-size: 11px;
      line-height: 15px;
    }

    .risk-table-panel ::ng-deep .pm-table-column-header,
    .risk-table-panel ::ng-deep .pm-register-cell-text,
    .risk-table-panel ::ng-deep .pm-register-person-copy strong,
    .risk-table-panel ::ng-deep .pm-register-person-copy small {
      font-size: 11px;
      line-height: 15px;
    }

    .risk-table-panel ::ng-deep .pm-register-primary-button strong,
    .risk-table-panel ::ng-deep .pm-register-cell-text.strong {
      font-size: 11.5px !important;
      line-height: 16px !important;
    }

    .risk-table-panel ::ng-deep .pm-register-primary-button strong {
      max-height: 32px;
    }

    .risk-table-panel ::ng-deep .pm-register-primary-button span {
      font-size: 10px;
      line-height: 13px;
    }

    .risk-table-panel ::ng-deep .pm-register-group-title {
      font-size: 12px;
      line-height: 15px;
    }

    .risk-table-panel ::ng-deep .pm-register-group-count,
    .risk-table-panel ::ng-deep .pm-table-row-status {
      font-size: 10.5px;
      line-height: 13px;
    }

    .risk-table-panel ::ng-deep .pm-table-chip {
      font-size: 9.5px;
      line-height: 12px;
    }

    .portfolio-risk-drawer-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .portfolio-risk-drawer-grid ::ng-deep .wide {
      grid-column: 1 / -1;
    }

    .animation-slide {
      animation: slideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(8px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 760px) {
      .risk-register-host {
        grid-template-rows: minmax(0, 1fr);
      }

      .risk-table-panel {
        padding: 12px;
      }

      .risk-hierarchy-toolbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .risk-hierarchy-toolbar-left,
      .risk-hierarchy-toolbar-actions {
        flex-wrap: wrap;
        width: 100%;
      }

      .risk-hierarchy-search {
        flex: 1 1 180px;
      }

      .portfolio-risk-drawer-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PortfolioWorkspaceRiskRegisterComponent {
  @Input() risks: Risk[] = [];
  @Input() programs: ProgramRow[] = [];
  @Input() standaloneProjects: ProgramRow[] = [];
  @Input() portfolioName = 'Safe Security Portfolio';
  @Output() readonly riskCreate = new EventEmitter<Risk>();

  readonly riskLevelOptions = ['Portfolio', 'Program', 'Project'];
  readonly exposureOptions = ['Low', 'Medium', 'High', 'Critical'];
  readonly statusOptions = ['Watching', 'Monitoring', 'Active', 'Escalated'];
  readonly portfolioNodeId = 'risk-node::portfolio';
  readonly standaloneNodeId = 'risk-node::standalone-projects';
  collapsedRiskNodeIds = new Set<string>();
  isAddRiskDrawerOpen = false;
  riskSearchQuery = '';
  addRiskDraft: AddPortfolioRiskDraft = this.createAddRiskDraft();

  get activeRisks(): Risk[] {
    const query = this.riskSearchQuery.trim().toLowerCase();
    if (!query) return this.risks;

    return this.risks.filter((risk) => this.riskMatchesQuery(risk, query));
  }

  get riskHierarchy(): PortfolioGroup {
    const risks = this.activeRisks;
    const directRisks = risks.filter((risk) => risk.level === 'portfolio');
    const programNames = new Set<string>();

    for (const program of this.programs) {
      programNames.add(program.name);
    }

    for (const risk of risks) {
      if (risk.level === 'program') programNames.add(risk.linkedTo);
      if (risk.parentProgram) programNames.add(risk.parentProgram);
    }

    const programs = Array.from(programNames)
      .map((programName) => {
        const directProgramRisks = risks.filter((risk) => risk.level === 'program' && this.sameEntityName(risk.linkedTo, programName));
        const sourceProgram = this.programs.find((program) => this.sameEntityName(program.name, programName));
        const projectNames = new Set<string>();

        for (const project of sourceProgram?.projects || []) {
          projectNames.add(project.name);
        }

        for (const risk of risks) {
          if (risk.level === 'project' && risk.parentProgram && this.sameEntityName(risk.parentProgram, programName)) {
            projectNames.add(risk.linkedTo);
          }
        }

        const projects = Array.from(projectNames)
          .map((projectName) => ({
            key: `risk-node::project::${programName}::${projectName}`,
            label: projectName,
            risks: risks.filter(
              (risk) =>
                risk.level === 'project' &&
                this.sameEntityName(risk.linkedTo, projectName) &&
                this.sameEntityName(risk.parentProgram || '', programName),
            ),
          }))
          .filter((project) => project.risks.length > 0);

        return {
          key: `risk-node::program::${programName}`,
          label: programName,
          directRisks: directProgramRisks,
          projects,
        };
      })
      .filter((program) => this.programRiskCount(program) > 0);

    return {
      key: this.portfolioNodeId,
      label: this.portfolioName,
      directRisks,
      programs,
      standaloneProjects: {
        key: this.standaloneNodeId,
        label: 'Standalone Projects',
        risks: this.standaloneRiskProjects.flatMap((project) => project.risks),
      },
    };
  }

  get standaloneRiskProjects(): ProjectGroup[] {
    const projectNames = new Set<string>();

    for (const project of this.standaloneProjects) {
      projectNames.add(project.name);
    }

    for (const risk of this.activeRisks) {
      if (risk.level === 'project' && !risk.parentProgram) projectNames.add(risk.linkedTo);
    }

    return Array.from(projectNames)
      .map((projectName) => ({
        key: `risk-node::standalone-project::${projectName}`,
        label: projectName,
        risks: this.activeRisks.filter(
          (risk) => risk.level === 'project' && !risk.parentProgram && this.sameEntityName(risk.linkedTo, projectName),
        ),
      }))
      .filter((project) => project.risks.length > 0);
  }

  get standaloneRiskCount(): number {
    return this.standaloneRiskProjects.reduce((total, project) => total + project.risks.length, 0);
  }

  get programOptions(): string[] {
    return this.programs.map((program) => program.name);
  }

  get projectLinkOptions(): ProjectLinkOption[] {
    const programProjects = this.programs.flatMap((program) =>
      (program.projects || []).map((project) => ({
        label: `${program.name} / ${project.name}`,
        projectName: project.name,
        parentProgram: program.name,
      })),
    );
    const standalone = this.standaloneProjects.map((project) => ({
      label: `Standalone / ${project.name}`,
      projectName: project.name,
    }));
    return [...programProjects, ...standalone];
  }

  get projectOptions(): string[] {
    return this.projectLinkOptions.map((project) => project.label);
  }

  get ownerOptions(): string[] {
    const names = [
      this.portfolioName,
      ...this.programs.map((program) => program.manager),
      ...this.programs.flatMap((program) => (program.projects || []).map((project) => project.manager)),
      ...this.standaloneProjects.map((project) => project.manager),
      ...this.risks.map((risk) => risk.owner.name),
    ];
    return Array.from(new Set(names.filter((name) => name && name !== this.portfolioName))).sort();
  }

  get canSaveAddRiskDraft(): boolean {
    const draft = this.addRiskDraft;
    const hasTarget =
      draft.level === 'portfolio' ||
      (draft.level === 'program' && Boolean(draft.program.trim())) ||
      (draft.level === 'project' && Boolean(draft.project.trim()));

    return Boolean(
      hasTarget &&
        draft.riskName.trim() &&
        draft.owner.trim() &&
        draft.mitigation.trim() &&
        draft.exposure &&
        draft.status,
    );
  }

  setRiskSearchQuery(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.riskSearchQuery = target.value;
    }
  }

  toggleRiskNode(nodeId: string): void {
    if (this.collapsedRiskNodeIds.has(nodeId)) {
      this.collapsedRiskNodeIds.delete(nodeId);
    } else {
      this.collapsedRiskNodeIds.add(nodeId);
    }
    this.collapsedRiskNodeIds = new Set(this.collapsedRiskNodeIds);
  }

  isRiskNodeCollapsed(nodeId: string): boolean {
    return this.collapsedRiskNodeIds.has(nodeId);
  }

  programRiskCount(program: ProgramGroup): number {
    return program.directRisks.length + program.projects.reduce((total, project) => total + project.risks.length, 0);
  }

  riskCountLabel(count: number): string {
    return count === 1 ? '1 risk' : `${count} risks`;
  }

  riskLineageLabel(risk: Risk): string {
    if (risk.level === 'portfolio') return `${this.riskLevelLabel(risk.level)} / ${risk.linkedTo}`;
    if (risk.level === 'program') return `${risk.parentPortfolio || this.portfolioName} / ${risk.linkedTo}`;

    return [risk.parentPortfolio || this.portfolioName, risk.parentProgram, risk.linkedTo].filter(Boolean).join(' / ');
  }

  openAddRiskDrawer(): void {
    this.addRiskDraft = this.createAddRiskDraft();
    this.isAddRiskDrawerOpen = true;
  }

  closeAddRiskDrawer(): void {
    this.isAddRiskDrawerOpen = false;
  }

  updateAddRiskDraft<K extends keyof AddPortfolioRiskDraft>(field: K, value: AddPortfolioRiskDraft[K]): void {
    this.addRiskDraft = {
      ...this.addRiskDraft,
      [field]: value,
    };
  }

  updateAddRiskLevel(level: RiskLevel): void {
    this.addRiskDraft = {
      ...this.addRiskDraft,
      level,
      program: level === 'program' ? this.addRiskDraft.program || this.programOptions[0] || '' : this.addRiskDraft.program,
      project: level === 'project' ? this.addRiskDraft.project || this.projectOptions[0] || '' : this.addRiskDraft.project,
    };
  }

  updateAddRiskLevelFromLabel(label: string): void {
    this.updateAddRiskLevel(this.riskLevelFromLabel(label));
  }

  updateAddRiskExposure(label: string): void {
    this.updateAddRiskDraft('exposure', this.exposureFromLabel(label));
  }

  updateAddRiskStatus(label: string): void {
    this.updateAddRiskDraft('status', this.statusFromLabel(label));
  }

  saveAddRisk(event: Event): void {
    event.preventDefault();
    if (!this.canSaveAddRiskDraft) return;

    const draft = this.addRiskDraft;
    const projectLink = draft.level === 'project' ? this.projectLinkOptions.find((project) => project.label === draft.project) : null;
    const risk: Risk = {
      id: this.nextRiskId(),
      name: draft.riskName.trim(),
      level: draft.level,
      linkedTo: draft.level === 'portfolio' ? this.portfolioName : draft.level === 'program' ? draft.program : projectLink?.projectName || draft.project,
      parentProgram: draft.level === 'project' ? projectLink?.parentProgram : undefined,
      parentPortfolio: draft.level === 'portfolio' ? undefined : this.portfolioName,
      owner: {
        name: draft.owner.trim(),
        initials: this.initialsFor(draft.owner),
      },
      mitigation: draft.mitigation.trim(),
      lastReview: this.displayDate(draft.lastReview),
      exposure: draft.exposure,
      status: draft.status,
    };

    this.riskCreate.emit(risk);
    this.closeAddRiskDrawer();
  }

  riskLevelLabel(level: RiskLevel): string {
    if (level === 'portfolio') return 'Portfolio';
    if (level === 'program') return 'Program';
    return 'Project';
  }

  exposureTone(exposure: Risk['exposure']): string {
    if (exposure === 'critical') return 'red';
    if (exposure === 'high') return 'amber';
    if (exposure === 'low') return 'neutral';
    return 'blue';
  }

  statusTone(status: Risk['status']): string {
    if (status === 'escalated') return 'red';
    if (status === 'active') return 'amber';
    if (status === 'monitoring') return 'blue';
    return 'neutral';
  }

  valueLabel(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private riskLevelFromLabel(label: string): RiskLevel {
    const normalized = label.toLowerCase();
    if (normalized === 'program') return 'program';
    if (normalized === 'project') return 'project';
    return 'portfolio';
  }

  private exposureFromLabel(label: string): RiskExposure {
    const normalized = label.toLowerCase();
    if (normalized === 'critical') return 'critical';
    if (normalized === 'high') return 'high';
    if (normalized === 'low') return 'low';
    return 'medium';
  }

  private statusFromLabel(label: string): RiskStatus {
    const normalized = label.toLowerCase();
    if (normalized === 'escalated') return 'escalated';
    if (normalized === 'monitoring') return 'monitoring';
    if (normalized === 'watching') return 'watching';
    return 'active';
  }

  private createAddRiskDraft(): AddPortfolioRiskDraft {
    return {
      level: 'project',
      program: this.programOptions[0] || '',
      project: this.projectOptions[0] || '',
      riskName: '',
      owner: this.ownerOptions[0] || '',
      mitigation: '',
      lastReview: this.todayDateInput(),
      exposure: 'medium',
      status: 'active',
    };
  }

  private nextRiskId(): string {
    const next = this.risks.reduce((max, risk) => {
      const match = risk.id.match(/\d+$/);
      return match ? Math.max(max, Number(match[0])) : max;
    }, 0) + 1;
    return `RSK-${String(next).padStart(2, '0')}`;
  }

  private initialsFor(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'R';
  }

  private todayDateInput(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private displayDate(value: string): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${month}/${day}/${year}`;
  }

  private riskMatchesQuery(risk: Risk, query: string): boolean {
    const searchable = [
      risk.id,
      risk.name,
      risk.level,
      risk.linkedTo,
      risk.parentProgram || '',
      risk.parentPortfolio || '',
      risk.owner.name,
      risk.mitigation,
      risk.lastReview,
      risk.exposure,
      risk.status,
    ];

    return searchable.some((value) => value.toLowerCase().includes(query));
  }

  private sameEntityName(left: string, right: string): boolean {
    return left.trim().toLowerCase() === right.trim().toLowerCase();
  }
}
