import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';
import { PmConsoleFieldComponent } from '../shared/pm-console-field.component';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import {
  PmConsoleRiskProfileComponent,
  type RiskProfileFieldChange,
  type RiskProfileMatrixChange,
  type RiskProfileOptions,
  type RiskProfileRecord,
  type RiskProfileTab,
  type RiskTreatmentDraftChange,
  type RiskTreatmentDraftRecord,
  type RiskTreatmentRecord,
} from '../shared/pm-console-risk-profile.component';
import { PmConsoleRowActionMenuComponent } from '../shared/pm-console-row-action-menu.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import {
  ProgramRow,
  Risk,
  riskCategoryOptions,
  type RiskCategory,
  type RiskExposure,
  type RiskLevel,
  type RiskStatus,
} from './portfolio-workspace.data';

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
  category: RiskCategory;
  owner: string;
  mitigation: string;
  lastReview: string;
  exposure: RiskExposure;
  status: RiskStatus;
}

type RiskRegisterViewMode = 'grouped' | 'tree-detail';
type RiskTreeSelectionKind = RiskLevel | 'standalone';

interface RiskTreeSelection {
  key: string;
  label: string;
  kind: RiskTreeSelectionKind;
  lineage: string;
  risks: Risk[];
}

type RiskFilterField = 'status' | 'level' | 'program' | 'project' | 'category' | 'exposure';

interface RiskAppliedFilter {
  field: RiskFilterField;
  id: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-portfolio-workspace-risk-register',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleFieldComponent,
    PmConsoleIconComponent,
    PmConsoleRowActionMenuComponent,
    PmConsolePlanDrawerComponent,
    PmConsoleRiskProfileComponent,
    PmConsoleStatusPillComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="risk-register-host animation-slide" aria-label="Risk register">
      <div class="risk-table-panel">
        <article class="risk-hierarchy-shell">
          <header class="risk-hierarchy-toolbar" aria-label="Risk register tools">
            <div class="risk-hierarchy-toolbar-left">
              <div class="risk-view-toggle" role="group" aria-label="Risk register view">
                <button
                  type="button"
                  [class.active]="riskRegisterViewMode === 'grouped'"
                  [attr.aria-pressed]="riskRegisterViewMode === 'grouped'"
                  (click)="setRiskRegisterViewMode('grouped')"
                >
                  <span pmConsoleIcon="table-2" aria-hidden="true"></span>
                  <span>Grouped Table</span>
                </button>
                <button
                  type="button"
                  [class.active]="riskRegisterViewMode === 'tree-detail'"
                  [attr.aria-pressed]="riskRegisterViewMode === 'tree-detail'"
                  (click)="setRiskRegisterViewMode('tree-detail')"
                >
                  <span pmConsoleIcon="list-tree" aria-hidden="true"></span>
                  <span>Tree + Detail</span>
                </button>
              </div>
            </div>

            <div class="risk-hierarchy-toolbar-actions">
              <label class="risk-hierarchy-search" [class.has-query]="riskSearchQuery.trim().length > 0" title="Search risks">
                <span pmConsoleIcon="search" aria-hidden="true"></span>
                <input
                  type="search"
                  [value]="riskSearchQuery"
                  placeholder="Search risks"
                  aria-label="Search risks"
                  (input)="setRiskSearchQuery($event)"
                />
              </label>
              <div class="risk-filter-control risk-entity-filter-control">
                <button
                  class="risk-toolbar-button risk-entity-filter-button"
                  type="button"
                  aria-label="Filter by program"
                  aria-haspopup="menu"
                  [class.active]="riskProgramFilterMenuOpen || riskProgramFilters.length"
                  [attr.aria-expanded]="riskProgramFilterMenuOpen"
                  (click)="toggleRiskProgramFilterMenu()"
                >
                  <span pmConsoleIcon="layers" aria-hidden="true"></span>
                  <span>{{ riskProgramDropdownLabel }}</span>
                  @if (riskProgramFilters.length) {
                    <strong class="risk-filter-count">{{ riskProgramFilters.length }}</strong>
                  }
                  <span class="risk-dropdown-chevron" pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                </button>

                @if (riskProgramFilterMenuOpen) {
                  <section class="risk-filter-menu risk-entity-filter-menu" role="menu" aria-label="Filter risks by program">
                    <header>
                      <strong>Programs</strong>
                      <button type="button" [disabled]="!riskProgramFilters.length" (click)="clearRiskEntityFilters('program')">Clear</button>
                    </header>
                    <label class="risk-filter-menu-search">
                      <span pmConsoleIcon="search" aria-hidden="true"></span>
                      <input
                        type="search"
                        [value]="riskProgramFilterQuery"
                        placeholder="Search programs"
                        aria-label="Search programs"
                        (input)="setRiskProgramFilterQuery($event)"
                      />
                    </label>
                    <div class="risk-entity-filter-list">
                      @if (filteredRiskProgramFilterOptions.length) {
                        @for (program of filteredRiskProgramFilterOptions; track program) {
                          <label>
                            <input type="checkbox" [checked]="isRiskFilterSelected('program', program)" (change)="toggleRiskFilter('program', program, $event)" />
                            <span>{{ program }}</span>
                          </label>
                        }
                      } @else {
                        <p>No programs found.</p>
                      }
                    </div>
                  </section>
                }
              </div>
              <div class="risk-filter-control risk-entity-filter-control">
                <button
                  class="risk-toolbar-button risk-entity-filter-button"
                  type="button"
                  aria-label="Filter by project"
                  aria-haspopup="menu"
                  [class.active]="riskProjectFilterMenuOpen || riskProjectFilters.length"
                  [attr.aria-expanded]="riskProjectFilterMenuOpen"
                  (click)="toggleRiskProjectFilterMenu()"
                >
                  <span pmConsoleIcon="folder" aria-hidden="true"></span>
                  <span>{{ riskProjectDropdownLabel }}</span>
                  @if (riskProjectFilters.length) {
                    <strong class="risk-filter-count">{{ riskProjectFilters.length }}</strong>
                  }
                  <span class="risk-dropdown-chevron" pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                </button>

                @if (riskProjectFilterMenuOpen) {
                  <section class="risk-filter-menu risk-entity-filter-menu" role="menu" aria-label="Filter risks by project">
                    <header>
                      <strong>Projects</strong>
                      <button type="button" [disabled]="!riskProjectFilters.length" (click)="clearRiskEntityFilters('project')">Clear</button>
                    </header>
                    <label class="risk-filter-menu-search">
                      <span pmConsoleIcon="search" aria-hidden="true"></span>
                      <input
                        type="search"
                        [value]="riskProjectFilterQuery"
                        placeholder="Search projects"
                        aria-label="Search projects"
                        (input)="setRiskProjectFilterQuery($event)"
                      />
                    </label>
                    <div class="risk-entity-filter-list">
                      @if (filteredRiskProjectFilterOptions.length) {
                        @for (project of filteredRiskProjectFilterOptions; track project) {
                          <label>
                            <input type="checkbox" [checked]="isRiskFilterSelected('project', project)" (change)="toggleRiskFilter('project', project, $event)" />
                            <span>{{ project }}</span>
                          </label>
                        }
                      } @else {
                        <p>No projects found.</p>
                      }
                    </div>
                  </section>
                }
              </div>
              <div class="risk-filter-control">
                <button
                  class="risk-toolbar-button"
                  type="button"
                  aria-label="Filter risks"
                  aria-haspopup="menu"
                  [class.active]="riskFilterMenuOpen || hasRiskFacetFilters"
                  [attr.aria-expanded]="riskFilterMenuOpen"
                  (click)="toggleRiskFilterMenu()"
                >
                  <span pmConsoleIcon="filter" aria-hidden="true"></span>
                  <span>Filter</span>
                  @if (riskFacetFilterCount) {
                    <strong class="risk-filter-count">{{ riskFacetFilterCount }}</strong>
                  }
                </button>

                @if (riskFilterMenuOpen) {
                  <section class="risk-filter-popover" role="menu" aria-label="Filter risks">
                    <header>
                      <div>
                        <strong>Filters</strong>
                        <small>{{ riskFacetFilterSummary }}</small>
                      </div>
                      <button class="risk-filter-reset" type="button" [disabled]="!hasRiskFacetFilters" (click)="resetRiskFacetFilters()">Reset</button>
                    </header>

                    <div class="risk-filter-grid">
                      <fieldset>
                        <legend>Status</legend>
                        @for (status of riskStatusFilterOptions; track status) {
                          <label>
                            <input type="checkbox" [checked]="isRiskFilterSelected('status', status)" (change)="toggleRiskFilter('status', status, $event)" />
                            <span>{{ valueLabel(status) }}</span>
                          </label>
                        }
                      </fieldset>

                      <fieldset>
                        <legend>Level</legend>
                        @for (level of riskLevelFilterOptions; track level) {
                          <label>
                            <input type="checkbox" [checked]="isRiskFilterSelected('level', level)" (change)="toggleRiskFilter('level', level, $event)" />
                            <span>{{ riskLevelLabel(level) }}</span>
                          </label>
                        }
                      </fieldset>

                      <fieldset>
                        <legend>Category</legend>
                        @for (category of riskCategoryOptions; track category) {
                          <label>
                            <input type="checkbox" [checked]="isRiskFilterSelected('category', category)" (change)="toggleRiskFilter('category', category, $event)" />
                            <span>{{ category }}</span>
                          </label>
                        }
                      </fieldset>

                      <fieldset>
                        <legend>AR</legend>
                        @for (exposure of riskExposureFilterOptions; track exposure) {
                          <label>
                            <input type="checkbox" [checked]="isRiskFilterSelected('exposure', exposure)" (change)="toggleRiskFilter('exposure', exposure, $event)" />
                            <span>{{ valueLabel(exposure) }}</span>
                          </label>
                        }
                      </fieldset>
                    </div>
                  </section>
                }
              </div>
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

          @if (riskAppliedFilters.length) {
            <div class="risk-applied-filters" aria-label="Applied risk filters">
              <span>Filters Applied</span>
              @for (filter of riskAppliedFilters; track filter.id) {
                <button type="button" (click)="clearRiskFilter(filter.field, filter.value)" [attr.aria-label]="'Remove ' + filter.label + ' filter ' + filter.value">
                  <small>{{ filter.label }}</small>
                  <strong>{{ filter.value }}</strong>
                  <span pmConsoleIcon="x" aria-hidden="true"></span>
                </button>
              }
              <em>{{ riskCountLabel(activeRisks.length) }} shown</em>
            </div>
          }

          <ng-template #riskTableHead>
            <thead>
              <tr>
                <th class="risk-col-name">Risk Name</th>
                <th class="risk-col-category">Risk Category</th>
                <th class="risk-col-ar">AR</th>
                <th class="risk-col-treatment">Treatment</th>
                <th class="risk-col-rr">RR</th>
                <th class="risk-col-owner">Risk Owner</th>
                <th class="risk-col-end-date">End Date</th>
                <th class="risk-col-review-due">Review Due Date</th>
                <th class="risk-col-status">Status</th>
                <th class="risk-col-actions" aria-label="Actions"></th>
              </tr>
            </thead>
          </ng-template>

          <ng-template #riskBranchMarker let-branchClass="branchClass">
            <span class="risk-branch-map {{ branchClass }}" aria-hidden="true">
              <span class="risk-branch-track portfolio"></span>
              <span class="risk-branch-track program"></span>
              <span class="risk-branch-track project"></span>
              <span class="risk-branch-elbow"></span>
              <span class="risk-branch-node"></span>
            </span>
          </ng-template>

          @let hierarchy = riskHierarchy;
          @if (riskRegisterViewMode === 'grouped') {
            <div class="risk-portfolio-block">
              <div class="risk-table-scroll">
                <table class="risk-structure-table" aria-label="Hierarchical risk register">
                  <ng-container *ngTemplateOutlet="riskTableHead"></ng-container>
                  <tbody>
                    @if (activeRisks.length) {
                      <tr class="risk-group-row risk-portfolio-row" [class.is-risk-open]="!isRiskNodeCollapsed(portfolioNodeId)">
                        <td colspan="10">
                          <button
                            class="risk-group-toggle risk-portfolio-toggle"
                            type="button"
                            [attr.aria-expanded]="!isRiskNodeCollapsed(portfolioNodeId)"
                            (click)="toggleRiskNode(portfolioNodeId)"
                          >
                            <ng-container *ngTemplateOutlet="riskBranchMarker; context: { branchClass: 'portfolio-node' }"></ng-container>
                            <span class="risk-toggle-icon" [pmConsoleIcon]="isRiskNodeCollapsed(portfolioNodeId) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                            <strong>{{ hierarchy.label }}</strong>
                            <span class="risk-portfolio-id">Portfolio</span>
                            <span class="risk-portfolio-count">{{ riskCountLabel(portfolioRiskCount(hierarchy)) }}</span>
                            @if (hierarchy.directRisks.length) {
                              <small>{{ riskLevelCountLabel(hierarchy.directRisks.length, 'portfolio') }}</small>
                            }
                          </button>
                        </td>
                      </tr>

                      @if (!isRiskNodeCollapsed(portfolioNodeId)) {
                        <ng-container
                          *ngTemplateOutlet="riskRows; context: { $implicit: hierarchy.directRisks, levelClass: 'portfolio-risk', indentClass: '', branchClass: 'portfolio-risk-node' }"
                        ></ng-container>
                      }

                      @for (program of hierarchy.programs; track program.key) {
                        <tr class="risk-group-row risk-program-row" [class.is-risk-open]="!isRiskNodeCollapsed(program.key)">
                          <td colspan="10">
                            <button
                              class="risk-group-toggle"
                              type="button"
                              [attr.aria-expanded]="!isRiskNodeCollapsed(program.key)"
                              (click)="toggleRiskNode(program.key)"
                            >
                              <ng-container
                                *ngTemplateOutlet="
                                  riskBranchMarker;
                                  context: {
                                    branchClass:
                                      program.projects.length || (!isRiskNodeCollapsed(program.key) && program.directRisks.length)
                                        ? 'program-node branch-start-node'
                                        : 'program-node'
                                  }
                                "
                              ></ng-container>
                              <span class="risk-toggle-icon" [pmConsoleIcon]="isRiskNodeCollapsed(program.key) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                              <strong>{{ program.label }}</strong>
                              <span class="risk-level-badge program">Program</span>
                              <span class="risk-node-count">{{ riskCountLabel(programRiskCount(program)) }}</span>
                              @if (program.directRisks.length) {
                                <small>{{ riskLevelCountLabel(program.directRisks.length, 'program') }}</small>
                              }
                            </button>
                          </td>
                        </tr>

                        @if (!isRiskNodeCollapsed(program.key)) {
                          <ng-container
                            *ngTemplateOutlet="riskRows; context: { $implicit: program.directRisks, levelClass: 'program-risk', indentClass: 'ind-program', branchClass: 'program-risk-node' }"
                          ></ng-container>
                        }

                        @for (project of program.projects; track project.key; let isLastProject = $last) {
                          <tr class="risk-group-row risk-project-row" [class.is-risk-open]="!isRiskNodeCollapsed(project.key)">
                            <td colspan="10">
                              <button
                                class="risk-group-toggle"
                                type="button"
                                [attr.aria-expanded]="!isRiskNodeCollapsed(project.key)"
                                (click)="toggleRiskNode(project.key)"
                              >
                                <ng-container *ngTemplateOutlet="riskBranchMarker; context: { branchClass: isLastProject && isRiskNodeCollapsed(project.key) ? 'project-node project-terminal-node' : 'project-node' }"></ng-container>
                                <span class="risk-toggle-icon" [pmConsoleIcon]="isRiskNodeCollapsed(project.key) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                                <strong>{{ project.label }}</strong>
                                <span class="risk-level-badge project">Project</span>
                                <span class="risk-node-count">{{ riskCountLabel(project.risks.length) }}</span>
                                <small>{{ riskLevelCountLabel(project.risks.length, 'project') }}</small>
                              </button>
                            </td>
                          </tr>

                          @if (!isRiskNodeCollapsed(project.key)) {
                            <ng-container
                              *ngTemplateOutlet="riskRows; context: { $implicit: project.risks, levelClass: 'project-risk', indentClass: 'ind-project', branchClass: 'project-risk-node', terminalBranch: isLastProject }"
                            ></ng-container>
                          }
                        }
                      }

                      @if (standaloneRiskProjects.length) {
                        <tr class="risk-group-row risk-standalone-row" [class.is-risk-open]="!isRiskNodeCollapsed(standaloneNodeId)">
                          <td colspan="10">
                            <button
                              class="risk-group-toggle"
                              type="button"
                              [attr.aria-expanded]="!isRiskNodeCollapsed(standaloneNodeId)"
                              (click)="toggleRiskNode(standaloneNodeId)"
                            >
                              <ng-container *ngTemplateOutlet="riskBranchMarker; context: { branchClass: 'standalone-node' }"></ng-container>
                              <span class="risk-toggle-icon" [pmConsoleIcon]="isRiskNodeCollapsed(standaloneNodeId) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                              <strong>{{ hierarchy.standaloneProjects.label }}</strong>
                              <span class="risk-level-badge standalone">Standalone</span>
                              <span class="risk-node-count">{{ riskCountLabel(standaloneRiskCount) }}</span>
                            </button>
                          </td>
                        </tr>

                        @if (!isRiskNodeCollapsed(standaloneNodeId)) {
                          @for (project of standaloneRiskProjects; track project.key; let isLastStandaloneProject = $last) {
                            <tr class="risk-group-row risk-project-row risk-standalone-project-row" [class.is-risk-open]="!isRiskNodeCollapsed(project.key)">
                              <td colspan="10">
                                <button
                                  class="risk-group-toggle"
                                  type="button"
                                  [attr.aria-expanded]="!isRiskNodeCollapsed(project.key)"
                                  (click)="toggleRiskNode(project.key)"
                                >
                                  <ng-container *ngTemplateOutlet="riskBranchMarker; context: { branchClass: isLastStandaloneProject && isRiskNodeCollapsed(project.key) ? 'standalone-project-node project-terminal-node' : 'standalone-project-node' }"></ng-container>
                                  <span class="risk-toggle-icon" [pmConsoleIcon]="isRiskNodeCollapsed(project.key) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                                  <strong>{{ project.label }}</strong>
                                  <span class="risk-level-badge project">Project</span>
                                  <span class="risk-node-count">{{ riskCountLabel(project.risks.length) }}</span>
                                  <small>{{ riskLevelCountLabel(project.risks.length, 'project') }}</small>
                                </button>
                              </td>
                            </tr>

                            @if (!isRiskNodeCollapsed(project.key)) {
                              <ng-container
                                *ngTemplateOutlet="riskRows; context: { $implicit: project.risks, levelClass: 'project-risk', indentClass: 'ind-project', branchClass: 'standalone-risk-node', terminalBranch: isLastStandaloneProject }"
                              ></ng-container>
                            }
                          }
                        }
                      }
                    } @else {
                      <tr>
                        <td colspan="10">
                          <div class="risk-hierarchy-empty">
                            <span pmConsoleIcon="shield-alert" aria-hidden="true"></span>
                            <strong>No risks match this view</strong>
                            <span>Clear the search or add a risk linked to this portfolio.</span>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          } @else {
            @let selectedContext = selectedRiskTreeContext;
            <div class="risk-tree-detail-layout">
              <aside class="risk-tree-panel" aria-label="Risk relationship tree">
                <header class="risk-tree-panel-header">
                  <strong>Relationship Tree</strong>
                  <span>{{ riskCountLabel(activeRisks.length) }}</span>
                </header>

                <nav class="risk-tree-list" aria-label="Portfolio program project tree">
                  <div class="risk-tree-row level-0" [class.active]="isRiskTreeNodeSelected(hierarchy.key)">
                    <button
                      class="risk-tree-expander"
                      type="button"
                      [attr.aria-label]="isRiskTreeNodeCollapsed(hierarchy.key) ? 'Expand portfolio' : 'Collapse portfolio'"
                      [attr.aria-expanded]="!isRiskTreeNodeCollapsed(hierarchy.key)"
                      (click)="toggleRiskTreeNode(hierarchy.key)"
                    >
                      <span [pmConsoleIcon]="isRiskTreeNodeCollapsed(hierarchy.key) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                    </button>
                    <button class="risk-tree-node" type="button" (click)="selectRiskTreeNode(hierarchy.key)">
                      <span pmConsoleIcon="briefcase-business" aria-hidden="true"></span>
                      <span class="risk-tree-copy">
                        <strong>{{ hierarchy.label }}</strong>
                        <small>Portfolio</small>
                      </span>
                      <span class="risk-node-count">{{ riskCountLabel(hierarchy.directRisks.length) }}</span>
                    </button>
                  </div>

                  @if (!isRiskTreeNodeCollapsed(hierarchy.key)) {
                    @for (program of hierarchy.programs; track program.key) {
                      <div class="risk-tree-row level-1" [class.active]="isRiskTreeNodeSelected(program.key)">
                        <button
                          class="risk-tree-expander"
                          type="button"
                          [attr.aria-label]="isRiskTreeNodeCollapsed(program.key) ? 'Expand program' : 'Collapse program'"
                          [attr.aria-expanded]="!isRiskTreeNodeCollapsed(program.key)"
                          (click)="toggleRiskTreeNode(program.key)"
                        >
                          <span [pmConsoleIcon]="isRiskTreeNodeCollapsed(program.key) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                        </button>
                        <button class="risk-tree-node" type="button" (click)="selectRiskTreeNode(program.key)">
                          <span class="risk-level-badge program">Program</span>
                          <span class="risk-tree-copy">
                            <strong>{{ program.label }}</strong>
                            <small>{{ hierarchy.label }}</small>
                          </span>
                          <span class="risk-node-count">{{ riskCountLabel(program.directRisks.length) }}</span>
                        </button>
                      </div>

                      @if (!isRiskTreeNodeCollapsed(program.key)) {
                        @for (project of program.projects; track project.key) {
                          <div class="risk-tree-row level-2" [class.active]="isRiskTreeNodeSelected(project.key)">
                            <span class="risk-tree-expander placeholder" aria-hidden="true"></span>
                            <button class="risk-tree-node" type="button" (click)="selectRiskTreeNode(project.key)">
                              <span class="risk-level-badge project">Project</span>
                              <span class="risk-tree-copy">
                                <strong>{{ project.label }}</strong>
                                <small>{{ program.label }}</small>
                              </span>
                              <span class="risk-node-count">{{ riskCountLabel(project.risks.length) }}</span>
                            </button>
                          </div>
                        }
                      }
                    }

                    @if (standaloneRiskProjects.length) {
                      <div class="risk-tree-row level-1" [class.active]="isRiskTreeNodeSelected(standaloneNodeId)">
                        <button
                          class="risk-tree-expander"
                          type="button"
                          [attr.aria-label]="isRiskTreeNodeCollapsed(standaloneNodeId) ? 'Expand standalone projects' : 'Collapse standalone projects'"
                          [attr.aria-expanded]="!isRiskTreeNodeCollapsed(standaloneNodeId)"
                          (click)="toggleRiskTreeNode(standaloneNodeId)"
                        >
                          <span [pmConsoleIcon]="isRiskTreeNodeCollapsed(standaloneNodeId) ? 'chevron-right' : 'chevron-down'" aria-hidden="true"></span>
                        </button>
                        <button class="risk-tree-node" type="button" (click)="selectRiskTreeNode(standaloneNodeId)">
                          <span class="risk-level-badge standalone">Standalone</span>
                          <span class="risk-tree-copy">
                            <strong>Standalone Projects</strong>
                            <small>{{ hierarchy.label }}</small>
                          </span>
                          <span class="risk-node-count">{{ riskCountLabel(standaloneRiskCount) }}</span>
                        </button>
                      </div>

                      @if (!isRiskTreeNodeCollapsed(standaloneNodeId)) {
                        @for (project of standaloneRiskProjects; track project.key) {
                          <div class="risk-tree-row level-2" [class.active]="isRiskTreeNodeSelected(project.key)">
                            <span class="risk-tree-expander placeholder" aria-hidden="true"></span>
                            <button class="risk-tree-node" type="button" (click)="selectRiskTreeNode(project.key)">
                              <span class="risk-level-badge project">Project</span>
                              <span class="risk-tree-copy">
                                <strong>{{ project.label }}</strong>
                                <small>Standalone</small>
                              </span>
                              <span class="risk-node-count">{{ riskCountLabel(project.risks.length) }}</span>
                            </button>
                          </div>
                        }
                      }
                    }
                  }
                </nav>
              </aside>

              <section class="risk-detail-panel" aria-label="Selected risk register">
                <header class="risk-detail-header">
                  <div>
                    <span class="risk-level-badge {{ selectedContext.kind }}">{{ riskTreeKindLabel(selectedContext.kind) }}</span>
                    <strong>{{ selectedContext.label }}</strong>
                    <small>{{ selectedContext.lineage }}</small>
                  </div>
                  <span class="risk-register-total">{{ riskCountLabel(selectedContext.risks.length) }}</span>
                </header>

                <div class="risk-detail-table-scroll">
                  <table class="risk-structure-table risk-detail-table" aria-label="Risks for selected relationship node">
                    <ng-container *ngTemplateOutlet="riskTableHead"></ng-container>
                    <tbody>
                      @if (selectedContext.risks.length) {
                        <ng-container
                          *ngTemplateOutlet="riskRows; context: { $implicit: selectedContext.risks, levelClass: riskTreeLevelClass(selectedContext.kind), indentClass: '', branchClass: riskTreeBranchClass(selectedContext.kind) }"
                        ></ng-container>
                      } @else {
                        <tr>
                          <td colspan="10">
                            <div class="risk-hierarchy-empty compact">
                              <span pmConsoleIcon="shield-alert" aria-hidden="true"></span>
                              <strong>No risks at this level</strong>
                              <span>Select another node in the relationship tree.</span>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          }
        </article>
      </div>

      <ng-template #riskRows let-risks let-levelClass="levelClass" let-indentClass="indentClass" let-branchClass="branchClass" let-terminalBranch="terminalBranch">
        @for (risk of risks; track risk.id; let isLastRisk = $last) {
          <tr
            class="risk-data-row {{ levelClass }}"
            [class.is-branch-terminal]="isLastRisk && levelClass === 'project-risk'"
            [class.is-program-branch-terminal]="isLastRisk && terminalBranch"
          >
            <td class="risk-name-cell {{ indentClass }}">
              <div class="risk-name-row">
                <ng-container *ngTemplateOutlet="riskBranchMarker; context: { branchClass: branchClass }"></ng-container>
                <div class="risk-name-stack">
                  <span class="risk-id-line">
                    <span class="risk-id-code">{{ risk.id }}</span>
                    <span pmConsoleIcon="triangle-alert" aria-label="Needs attention"></span>
                  </span>
                  <strong>{{ risk.name }}</strong>
                  <small>{{ riskLineageLabel(risk) }}</small>
                </div>
              </div>
            </td>
            <td class="risk-category-cell">
              <span class="risk-category-text">{{ risk.category }}</span>
            </td>
            <td class="risk-rating-cell">
              <span
                class="risk-rating-swatch {{ exposureTone(risk.exposure) }}"
                [attr.aria-label]="'AR ' + valueLabel(risk.exposure)"
                [attr.title]="valueLabel(risk.exposure)"
              ></span>
            </td>
            <td class="risk-treatment" [attr.title]="risk.mitigation">
              <span class="risk-treatment-count">{{ riskTreatmentCount(risk) }}</span>
            </td>
            <td class="risk-rating-cell">
              <span
                class="risk-rating-swatch {{ residualRiskTone(risk) }}"
                [attr.aria-label]="'RR ' + residualRiskLabel(risk)"
                [attr.title]="residualRiskLabel(risk)"
              ></span>
            </td>
            <td class="risk-owner">
              <span>{{ risk.owner.name }}</span>
            </td>
            <td class="risk-date">{{ riskDateLabel(riskEndDate(risk)) }}</td>
            <td class="risk-date">{{ riskDateLabel(riskReviewDueDate(risk)) }}</td>
            <td>
              <span [pmConsoleStatusPill]="valueLabel(risk.status)" baseClass="pm-table-row-status" [tone]="statusTone(risk.status)"></span>
            </td>
            <td class="risk-actions-cell">
              <app-pm-console-row-action-menu ariaLabel="Risk actions">
                <button type="button" role="menuitem" (click)="manageRisk(risk)">
                  <span pmConsoleIcon="settings" aria-hidden="true"></span>
                  <span>Manage</span>
                </button>
                <button class="danger" type="button" role="menuitem" (click)="deleteRisk(risk.id)">
                  <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                  <span>Delete</span>
                </button>
              </app-pm-console-row-action-menu>
            </td>
          </tr>
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
              label="Risk Category"
              type="select"
              [value]="addRiskDraft.category"
              [options]="riskCategoryOptions"
              ariaLabel="Risk Category"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskCategory($event)"
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

      @if (activeRiskProfile; as riskProfile) {
        <div class="risk-profile-drawer-shell" aria-live="polite">
          <button class="risk-profile-drawer-backdrop" type="button" (click)="closeRiskProfile()" aria-label="Close risk profile drawer"></button>
          <aside class="risk-profile-drawer" role="dialog" aria-modal="true" [attr.aria-label]="'Manage risk ' + riskProfile.id">
            <app-pm-console-risk-profile
              [risk]="riskProfile"
              [config]="riskProfileConfig"
              [activeTab]="activeRiskProfileTab"
              [treatmentDraft]="riskTreatmentDraft"
              [projectRiskCount]="projectRiskProfileCount"
              (closeProfile)="closeRiskProfile()"
              (completeProfile)="completeRiskProfile()"
              (tabChange)="setRiskProfileTab($event)"
              (fieldChange)="updateRiskProfileField($event)"
              (sharedRiskChange)="updateRiskProfileSharedRisk($event)"
              (matrixChange)="updateRiskProfileMatrix($event)"
              (treatmentDraftChange)="updateRiskTreatmentDraft($event)"
              (treatmentAdd)="addRiskTreatmentToProfile()"
              (treatmentRemove)="removeRiskTreatmentFromProfile($event)"
            ></app-pm-console-risk-profile>
          </aside>
        </div>
      }
    </section>
  `,
  styles: [`
    :host {
      background: var(--panel, #ffffff);
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
      background: var(--panel, #ffffff);
      width: 100%;
    }

    .risk-table-panel {
      background: var(--panel, #ffffff);
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
      flex-wrap: wrap;
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

    .risk-hierarchy-toolbar-actions {
      margin-left: auto;
    }

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
      --risk-search-collapsed-size: 40px;
      --risk-search-expanded-width: 220px;
      cursor: text;
      flex: 0 1 var(--risk-search-collapsed-size);
      gap: 0;
      justify-content: center;
      max-width: var(--risk-search-collapsed-size);
      min-width: var(--risk-search-collapsed-size);
      overflow: hidden;
      padding: 0;
      transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        flex-basis 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
        gap 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
        max-width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
        padding 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
        width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
      width: var(--risk-search-collapsed-size);
    }

    .risk-hierarchy-search:hover,
    .risk-hierarchy-search:focus-within,
    .risk-hierarchy-search.has-query {
      flex-basis: var(--risk-search-expanded-width);
      gap: 8px;
      justify-content: flex-start;
      max-width: min(var(--risk-search-expanded-width), 100%);
      padding: 0 10px;
      width: var(--risk-search-expanded-width);
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
      opacity: 0;
      outline: 0;
      pointer-events: none;
      transition:
        opacity 0.18s ease,
        width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
      width: 0;
    }

    .risk-hierarchy-search:hover input,
    .risk-hierarchy-search:focus-within input,
    .risk-hierarchy-search.has-query input {
      opacity: 1;
      pointer-events: auto;
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
    .risk-hierarchy-search:hover,
    .risk-hierarchy-search:focus-within {
      border-color: #cfd5e2;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
      outline: 0;
    }

    .risk-toolbar-button.active {
      background: #f3f1ff;
      border-color: rgba(16, 6, 159, 0.22);
      color: #10069f;
    }

    .risk-filter-control {
      position: relative;
    }

    .risk-entity-filter-button {
      justify-content: flex-start;
      max-width: 190px;
      min-width: 132px;
    }

    .risk-entity-filter-button > span:not(.icon) {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-dropdown-chevron.icon {
      height: 14px;
      margin-left: auto;
      width: 14px;
    }

    .risk-filter-count {
      align-items: center;
      background: #10069f;
      border-radius: 999px;
      color: #ffffff;
      display: inline-flex;
      font-size: 10px;
      font-weight: 600;
      height: 18px;
      justify-content: center;
      line-height: 12px;
      min-width: 18px;
      padding: 0 6px;
    }

    .risk-filter-popover,
    .risk-filter-menu {
      background: #ffffff;
      border: 1px solid #dfe4ed;
      border-radius: 12px;
      box-shadow: 0 18px 48px rgba(15, 23, 42, 0.14);
      color: #303746;
      display: grid;
      gap: 12px;
      padding: 14px;
      position: absolute;
      right: 0;
      top: calc(100% + 8px);
      z-index: 20;
    }

    .risk-filter-popover {
      width: min(420px, calc(100vw - 32px));
    }

    .risk-filter-menu {
      width: min(340px, calc(100vw - 32px));
    }

    .risk-filter-popover header,
    .risk-filter-menu header {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .risk-filter-popover header > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .risk-filter-popover header strong,
    .risk-filter-menu header strong {
      color: #252a34;
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    }

    .risk-filter-popover header small {
      color: #7b8495;
      font-size: 10px;
      line-height: 13px;
    }

    .risk-filter-reset,
    .risk-filter-menu header button {
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: #10069f;
      cursor: pointer;
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      height: 28px;
      padding: 0 8px;
    }

    .risk-filter-reset:disabled,
    .risk-filter-menu header button:disabled {
      color: #a2a9b7;
      cursor: not-allowed;
    }

    .risk-filter-grid {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      max-height: 300px;
      overflow: auto;
      padding-right: 2px;
    }

    .risk-filter-grid fieldset {
      border: 1px solid #edf0f5;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 0;
      min-width: 0;
      padding: 10px;
    }

    .risk-filter-grid fieldset.wide {
      grid-column: 1 / -1;
    }

    .risk-filter-grid legend {
      color: #5c6473;
      font-size: 10.5px;
      font-weight: 600;
      line-height: 13px;
      padding: 0 4px;
    }

    .risk-filter-grid label {
      align-items: center;
      color: #303746;
      display: flex;
      font-size: 11px;
      gap: 8px;
      line-height: 15px;
      min-width: 0;
    }

    .risk-filter-grid input {
      accent-color: #10069f;
      flex: 0 0 auto;
      height: 14px;
      width: 14px;
    }

    .risk-filter-grid label span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-filter-menu-search {
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e4e8f0;
      border-radius: 9px;
      display: flex;
      gap: 8px;
      height: 36px;
      padding: 0 10px;
    }

    .risk-filter-menu-search .icon {
      color: #7b8495;
      height: 15px;
      width: 15px;
    }

    .risk-filter-menu-search input {
      background: transparent;
      border: 0;
      color: #252a34;
      flex: 1 1 auto;
      font-size: 11.5px;
      min-width: 0;
      outline: 0;
    }

    .risk-entity-filter-list {
      display: grid;
      gap: 4px;
      max-height: 260px;
      overflow: auto;
      padding-right: 2px;
    }

    .risk-entity-filter-list label {
      align-items: center;
      border-radius: 8px;
      color: #303746;
      display: flex;
      font-size: 11.5px;
      gap: 8px;
      line-height: 15px;
      min-height: 32px;
      min-width: 0;
      padding: 6px 8px;
    }

    .risk-entity-filter-list label:hover {
      background: #f6f8fb;
    }

    .risk-entity-filter-list input {
      accent-color: #10069f;
      flex: 0 0 auto;
      height: 14px;
      width: 14px;
    }

    .risk-entity-filter-list label span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-entity-filter-list p {
      color: #7b8495;
      font-size: 11px;
      line-height: 16px;
      margin: 0;
      padding: 8px;
    }

    .risk-applied-filters {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-height: 32px;
    }

    .risk-applied-filters > span,
    .risk-applied-filters em {
      color: #7b8495;
      font-size: 10.5px;
      font-style: normal;
      line-height: 13px;
      white-space: nowrap;
    }

    .risk-applied-filters button {
      align-items: center;
      background: #f8f9fe;
      border: 1px solid #e0e5ef;
      border-radius: 999px;
      color: #303746;
      cursor: pointer;
      display: inline-flex;
      gap: 6px;
      min-height: 28px;
      padding: 0 8px;
    }

    .risk-applied-filters button small {
      color: #7b8495;
      font-size: 10px;
      line-height: 12px;
    }

    .risk-applied-filters button strong {
      color: #252a34;
      font-size: 10.5px;
      font-weight: 600;
      line-height: 13px;
    }

    .risk-applied-filters button .icon {
      color: #6f7584;
      height: 12px;
      width: 12px;
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

    .risk-view-toggle {
      align-items: center;
      background: #f5f6fb;
      border: 1px solid #e0e3ea;
      border-radius: 8px;
      display: inline-flex;
      gap: 2px;
      height: 36px;
      padding: 2px;
      white-space: nowrap;
    }

    .risk-view-toggle button {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: #5c6473;
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      gap: 6px;
      height: 30px;
      padding: 0 10px;
    }

    .risk-view-toggle button.active {
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
      color: #10069f;
    }

    .risk-view-toggle button:focus-visible {
      box-shadow: 0 0 0 2px rgba(16, 6, 159, 0.14);
      outline: 0;
    }

    .risk-view-toggle .icon {
      height: 14px;
      width: 14px;
    }

    .risk-portfolio-block {
      background: #ffffff;
      border: 1px solid #e3e7f0;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .risk-tree-detail-layout {
      display: grid;
      gap: 12px;
      grid-template-columns: 332px minmax(0, 1fr);
      height: 100%;
      min-height: 0;
      min-width: 0;
    }

    .risk-tree-panel,
    .risk-detail-panel {
      background: #ffffff;
      border: 1px solid #e0e3ea;
      border-radius: 10px;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .risk-tree-panel-header,
    .risk-detail-header {
      align-items: center;
      border-bottom: 1px solid #e3e7ef;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      min-height: 40px;
      padding: 0 12px;
    }

    .risk-tree-panel-header strong,
    .risk-detail-header strong {
      color: #252a34;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
    }

    .risk-tree-panel-header span {
      color: #858c9a;
      font-size: 10px;
      font-weight: 500;
      line-height: 12px;
      white-space: nowrap;
    }

    .risk-detail-header {
      min-height: 52px;
      padding: 8px 16px;
    }

    .risk-tree-list {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: 2px;
      min-height: 0;
      overflow: auto;
      padding: 8px;
    }

    .risk-tree-row {
      --tree-indent: 0px;
      align-items: center;
      border-radius: 7px;
      display: grid;
      gap: 4px;
      grid-template-columns: 22px minmax(0, 1fr);
      min-width: 0;
      padding: 2px 8px 2px calc(8px + var(--tree-indent));
    }

    .risk-tree-row.level-1 {
      --tree-indent: 16px;
    }

    .risk-tree-row.level-2 {
      --tree-indent: 32px;
    }

    .risk-tree-row:hover {
      background: #f7f8fb;
    }

    .risk-tree-row.active {
      background: #f3f1ff;
    }

    .risk-tree-expander {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: #6f7584;
      cursor: pointer;
      display: inline-flex;
      height: 28px;
      justify-content: center;
      width: 22px;
    }

    .risk-tree-expander:hover,
    .risk-tree-expander:focus-visible {
      background: #f4f6fb;
      outline: 0;
    }

    .risk-tree-expander.placeholder {
      pointer-events: none;
      visibility: hidden;
    }

    .risk-tree-expander .icon {
      height: 14px;
      width: 14px;
    }

    .risk-tree-node {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 8px;
      color: #303746;
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 7px;
      min-height: 28px;
      min-width: 0;
      padding: 0;
      text-align: left;
    }

    .risk-tree-row.active .risk-tree-node {
      color: #10069f;
    }

    .risk-tree-node:focus-visible {
      box-shadow: 0 0 0 2px rgba(16, 6, 159, 0.14);
      outline: 0;
    }

    .risk-tree-node > .icon {
      color: #10069f;
      flex: 0 0 auto;
      height: 15px;
      width: 15px;
    }

    .risk-tree-node .risk-level-badge {
      border-radius: 999px;
      font-size: 0;
      height: 8px;
      min-width: 0;
      padding: 0;
      width: 8px;
    }

    .risk-tree-node .risk-level-badge.program {
      background: #9b7ac6;
    }

    .risk-tree-node .risk-level-badge.project {
      background: #566990;
    }

    .risk-tree-node .risk-level-badge.standalone {
      background: #7c8797;
    }

    .risk-tree-node .risk-node-count {
      background: transparent;
      border: 0;
      color: #9aa3b4;
      font-size: 10px;
      font-weight: 400;
      height: auto;
      justify-content: flex-end;
      margin-left: 8px;
      min-width: 34px;
      padding: 0;
    }

    .risk-tree-copy {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-width: 0;
    }

    .risk-tree-copy strong,
    .risk-tree-copy small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-tree-copy strong {
      font-size: 11.5px;
      font-weight: 500;
      line-height: 15px;
    }

    .risk-tree-copy small {
      display: none;
    }

    .risk-detail-header > div {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0;
    }

    .risk-detail-header small {
      color: #7b8495;
      flex: 1 1 100%;
      font-size: 10.5px;
      line-height: 13px;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-detail-table-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .risk-detail-table {
      min-width: 0;
    }

    .risk-detail-table th {
      padding: 10px 12px;
    }

    .risk-detail-table td {
      padding: 12px;
    }

    .risk-detail-table .risk-col-category {
      width: 10%;
    }

    .risk-detail-table .risk-col-name {
      width: 34%;
    }

    .risk-detail-table .risk-col-ar,
    .risk-detail-table .risk-col-rr {
      width: 4.5%;
    }

    .risk-detail-table .risk-col-treatment {
      width: 7%;
    }

    .risk-detail-table .risk-col-owner {
      width: 12%;
    }

    .risk-detail-table .risk-col-end-date,
    .risk-detail-table .risk-col-status {
      width: 8%;
    }

    .risk-detail-table .risk-col-review-due {
      width: 9%;
    }

    .risk-detail-table .risk-col-actions {
      width: 3%;
    }

    .risk-group-toggle:focus-visible {
      box-shadow: inset 0 0 0 2px rgba(16, 6, 159, 0.16);
      outline: 0;
    }

    .risk-portfolio-id,
    .risk-portfolio-count,
    .risk-level-badge,
    .risk-node-count {
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

    .risk-portfolio-id {
      background: rgba(16, 6, 159, 0.06);
      border: 0.5px solid rgba(16, 6, 159, 0.15);
      color: #10069f;
      letter-spacing: 0;
    }

    .risk-portfolio-count {
      background: #ffffff;
      border: 1px solid #e1e5ef;
      color: #606a7b;
    }

    .risk-table-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .risk-structure-table {
      border-collapse: separate;
      border-spacing: 0;
      min-width: 0;
      table-layout: fixed;
      width: 100%;
    }

    .risk-structure-table th {
      background: #f2f4f8;
      border-bottom: 1px solid #dfe4ed;
      color: #343b49;
      font-size: 11px;
      font-weight: 500;
      height: 55px;
      line-height: 15px;
      padding: 0 10px;
      position: sticky;
      text-align: left;
      top: 0;
      white-space: normal;
      z-index: 3;
    }

    .risk-col-category {
      width: 10%;
    }

    .risk-col-name {
      width: 34%;
    }

    .risk-structure-table th.risk-col-name {
      padding-left: 78px;
    }

    .risk-col-ar,
    .risk-col-rr {
      width: 4.5%;
    }

    .risk-col-treatment {
      width: 7%;
    }

    .risk-col-owner {
      width: 12%;
    }

    .risk-col-end-date,
    .risk-col-status {
      width: 8%;
    }

    .risk-col-review-due {
      width: 9%;
    }

    .risk-col-actions {
      width: 3%;
    }


    .risk-structure-table td {
      border-bottom: 1px solid #edf0f5;
      color: #343b49;
      font-size: 11px;
      line-height: 15px;
      padding: 12px 10px;
      vertical-align: middle;
    }

    .risk-data-row {
      background: #ffffff;
    }

    .risk-data-row:hover {
      background: #fbfcff;
    }

    .risk-structure-table td.risk-name-cell.ind-program,
    .risk-structure-table td.risk-name-cell.ind-project {
      padding-left: 10px;
    }

    .risk-group-row td {
      border-bottom: 1px solid #dfe4ef;
      padding: 0;
    }

    .risk-portfolio-row td {
      background: #f3f3fa;
      border-top: 1px solid #e6e8f6;
    }

    .risk-program-row td {
      background: #f5f9ff;
      border-top: 1px solid #edf0f5;
    }

    .risk-project-row td {
      background: #f7fcff;
      border-top: 1px solid #dbe8f0;
    }

    .risk-standalone-row td {
      background: rgba(238, 230, 248, 0.53);
      border-top: 1px solid #e7def0;
    }

    .risk-standalone-project-row td {
      background: #f5f9ff;
      border-top: 1px solid #edf0f5;
    }

    .risk-group-row.is-risk-open td {
      border-bottom-color: #d9e0ec;
    }

    .risk-group-row.is-risk-open .risk-group-toggle {
      background: rgba(255, 255, 255, 0.14);
    }

    .risk-group-toggle {
      align-items: center;
      background: transparent;
      border: 0;
      color: #293241;
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 8px;
      min-height: 58px;
      padding: 0 16px 0 10px;
      text-align: left;
      width: 100%;
    }

    .risk-project-row .risk-group-toggle {
      min-height: 58px;
    }

    .risk-standalone-row .risk-group-toggle {
      min-height: 58px;
    }

    .risk-group-toggle:hover {
      background: rgba(255, 255, 255, 0.34);
    }

    .risk-group-toggle .icon {
      color: #697386;
      height: 16px;
      width: 16px;
    }

    .risk-group-toggle .risk-toggle-icon.icon {
      background: transparent;
      border: 0;
      border-radius: 0;
      color: #697386;
      height: 17px;
      padding: 0;
      width: 17px;
    }

    .risk-group-row.is-risk-open .risk-toggle-icon.icon {
      color: #5f6680;
    }

    .risk-portfolio-toggle {
      min-height: 56px;
    }

    .risk-group-toggle strong {
      color: #242b38;
      flex: 0 1 auto;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-group-toggle small {
      color: #6d7585;
      flex: 0 0 auto;
      font-size: 10.5px;
      line-height: 14px;
      white-space: nowrap;
    }

    .risk-level-badge.portfolio {
      background: rgba(16, 6, 159, 0.06);
      box-shadow: inset 0 0 0 0.5px rgba(16, 6, 159, 0.15);
      color: #10069f;
    }

    .risk-level-badge.program {
      background: #e3f0ff;
      box-shadow: none;
      color: #1d5bbf;
    }

    .risk-level-badge.project {
      background: #e3f5eb;
      box-shadow: none;
      color: #267a57;
    }

    .risk-level-badge.standalone {
      background: #e3f0ff;
      box-shadow: none;
      color: #1d5bbf;
    }

    .risk-node-count {
      background: #ffffff;
      border: 1px solid #e0e5ee;
      color: #596273;
      margin-left: 2px;
    }

    .risk-name-row {
      align-items: center;
      display: flex;
      min-height: 58px;
      min-width: 0;
    }

    .risk-branch-map {
      --node-color: #dedef1;
      --node-size: 10px;
      --node-x: 10px;
      --portfolio-track-color: #dedef1;
      --program-track-color: rgba(16, 6, 159, 0.35);
      --project-track-color: #7773c8;
      --standalone-track-color: #aba8dd;
      --elbow-color: #dedef1;
      --elbow-left: 10px;
      --elbow-width: 0px;
      align-self: stretch;
      display: inline-flex;
      flex: 0 0 58px;
      min-height: inherit;
      position: relative;
    }

    .risk-name-row .risk-branch-map {
      margin: -12px 0;
      min-height: calc(100% + 24px);
    }

    .risk-branch-track,
    .risk-branch-elbow,
    .risk-branch-node {
      position: absolute;
    }

    .risk-branch-track,
    .risk-branch-elbow {
      display: none;
      pointer-events: none;
    }

    .risk-branch-track {
      border-radius: 999px;
      bottom: 0;
      top: 0;
      width: 1px;
    }

    .risk-branch-track.portfolio {
      background: var(--portfolio-track-color);
      left: 9.5px;
    }

    .risk-branch-track.program {
      background: var(--program-track-color);
      left: 24.5px;
    }

    .risk-branch-track.project {
      background: var(--project-track-color);
      left: 40.5px;
    }

    .risk-branch-elbow {
      background: var(--elbow-color);
      border: 0;
      border-radius: 999px;
      height: 1px;
      left: var(--elbow-left);
      top: calc(50% - 0.5px);
      width: var(--elbow-width);
    }

    .risk-branch-node {
      background: var(--node-color);
      border: 0;
      border-radius: 999px;
      box-shadow: none;
      height: var(--node-size);
      left: var(--node-x);
      top: 50%;
      transform: translate(-50%, -50%);
      width: var(--node-size);
      z-index: 1;
    }

    .risk-branch-map.portfolio-risk-node,
    .risk-branch-map.program-risk-node,
    .risk-branch-map.project-risk-node,
    .risk-branch-map.standalone-risk-node {
      --node-size: 8px;
    }

    .risk-branch-map.portfolio-risk-node .risk-branch-node,
    .risk-branch-map.program-risk-node .risk-branch-node,
    .risk-branch-map.project-risk-node .risk-branch-node,
    .risk-branch-map.standalone-risk-node .risk-branch-node {
      background: #ffffff;
      border: 1.5px solid var(--node-color);
    }

    .risk-branch-map.portfolio-node,
    .risk-branch-map.portfolio-risk-node {
      --node-color: #dedef1;
      --node-x: 10px;
    }

    .risk-branch-map.program-node,
    .risk-branch-map.program-risk-node {
      --elbow-color: #a0a1dd;
      --elbow-left: 10px;
      --elbow-width: 16px;
      --node-color: #aba8dd;
      --node-x: 25px;
    }

    .risk-branch-map.project-node,
    .risk-branch-map.project-risk-node {
      --elbow-color: #7773c8;
      --elbow-left: 25px;
      --elbow-width: 16px;
      --node-color: #7773c8;
      --node-x: 41px;
    }

    .risk-branch-map.standalone-node {
      --elbow-color: var(--standalone-track-color);
      --elbow-left: 10px;
      --elbow-width: 16px;
      --node-color: var(--standalone-track-color);
      --node-x: 25px;
      --program-track-color: var(--standalone-track-color);
    }

    .risk-branch-map.standalone-project-node,
    .risk-branch-map.standalone-risk-node {
      --elbow-color: var(--standalone-track-color);
      --elbow-left: 25px;
      --elbow-width: 16px;
      --node-color: var(--standalone-track-color);
      --node-x: 41px;
      --program-track-color: var(--standalone-track-color);
      --project-track-color: var(--standalone-track-color);
    }

    .risk-branch-map.portfolio-node {
      flex-basis: 20px;
    }

    .risk-branch-map.program-risk-node {
      flex-basis: 88px;
    }

    .risk-branch-map.program-node,
    .risk-branch-map.standalone-node {
      flex-basis: 58px;
    }

    .risk-branch-map.project-node,
    .risk-branch-map.standalone-project-node {
      flex-basis: 80px;
    }

    .risk-branch-map.project-risk-node,
    .risk-branch-map.standalone-risk-node {
      flex-basis: 113px;
    }

    .risk-branch-map.portfolio-node .risk-branch-track.portfolio,
    .risk-branch-map.portfolio-risk-node .risk-branch-track.portfolio,
    .risk-branch-map.program-node .risk-branch-track.portfolio,
    .risk-branch-map.program-risk-node .risk-branch-track.portfolio,
    .risk-branch-map.program-risk-node .risk-branch-track.program,
    .risk-branch-map.project-node .risk-branch-track.portfolio,
    .risk-branch-map.project-node .risk-branch-track.program,
    .risk-branch-map.project-risk-node .risk-branch-track.portfolio,
    .risk-branch-map.project-risk-node .risk-branch-track.program,
    .risk-branch-map.project-risk-node .risk-branch-track.project,
    .risk-branch-map.standalone-node .risk-branch-track.portfolio,
    .risk-branch-map.standalone-project-node .risk-branch-track.portfolio,
    .risk-branch-map.standalone-project-node .risk-branch-track.program,
    .risk-branch-map.standalone-risk-node .risk-branch-track.portfolio,
    .risk-branch-map.standalone-risk-node .risk-branch-track.program,
    .risk-branch-map.standalone-risk-node .risk-branch-track.project,
    .risk-branch-map.program-node .risk-branch-elbow,
    .risk-branch-map.program-risk-node .risk-branch-elbow,
    .risk-branch-map.project-node .risk-branch-elbow,
    .risk-branch-map.project-risk-node .risk-branch-elbow,
    .risk-branch-map.standalone-node .risk-branch-elbow,
    .risk-branch-map.standalone-project-node .risk-branch-elbow,
    .risk-branch-map.standalone-risk-node .risk-branch-elbow {
      display: block;
    }

    .risk-branch-map.portfolio-node .risk-branch-track.portfolio {
      top: 50%;
    }

    .risk-branch-map.program-node .risk-branch-track.program,
    .risk-branch-map.project-node .risk-branch-track.project,
    .risk-branch-map.standalone-node .risk-branch-track.program,
    .risk-branch-map.standalone-project-node .risk-branch-track.project {
      bottom: 50%;
      top: 50%;
    }

    .risk-branch-map.branch-start-node.program-node .risk-branch-track.program {
      bottom: 0;
      display: block;
      top: 50%;
    }

    .risk-group-row.is-risk-open .risk-branch-map.program-node .risk-branch-track.program,
    .risk-group-row.is-risk-open .risk-branch-map.project-node .risk-branch-track.project,
    .risk-group-row.is-risk-open .risk-branch-map.standalone-node .risk-branch-track.program,
    .risk-group-row.is-risk-open .risk-branch-map.standalone-project-node .risk-branch-track.project {
      bottom: 0;
      display: block;
      top: 50%;
    }

    .risk-branch-map.project-terminal-node .risk-branch-track.program {
      bottom: 50%;
    }

    .risk-data-row.is-branch-terminal .risk-branch-map.project-risk-node .risk-branch-track.project,
    .risk-data-row.is-branch-terminal .risk-branch-map.standalone-risk-node .risk-branch-track.project {
      bottom: 50%;
    }

    .risk-data-row.is-program-branch-terminal .risk-branch-map.project-risk-node .risk-branch-track.program,
    .risk-data-row.is-program-branch-terminal .risk-branch-map.standalone-risk-node .risk-branch-track.program {
      bottom: 50%;
    }

    .risk-name-stack {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      padding-left: 0;
      position: relative;
    }

    .risk-name-stack::before {
      display: none;
    }

    .risk-id-line {
      align-items: center;
      color: #81899a;
      display: inline-flex;
      gap: 5px;
      white-space: nowrap;
    }

    .risk-id-code {
      display: inline-block;
      font-size: 10.5px;
      font-weight: 500;
      line-height: 13px;
      margin-right: 5px;
      white-space: nowrap;
    }

    .risk-id-line .icon {
      color: #ff5630;
      height: 13px;
      vertical-align: -2px;
      width: 13px;
    }

    .risk-name-cell strong {
      color: #12366d;
      display: -webkit-box;
      font-size: 11.5px;
      font-weight: 500;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .risk-name-cell small {
      color: #7b8495;
      display: block;
      font-size: 10px;
      line-height: 13px;
      margin-top: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-category-cell {
      white-space: normal;
    }

    .risk-category-text {
      color: #303746;
      display: inline-block;
      font-size: 12px;
      line-height: 17px;
    }

    .risk-rating-cell {
      text-align: left;
    }

    .risk-rating-swatch {
      border-radius: 5px;
      box-shadow: inset 0 0 0 1px rgba(36, 43, 56, 0.05);
      display: inline-block;
      height: 20px;
      vertical-align: middle;
      width: 20px;
    }

    .risk-rating-swatch.low {
      background: #3fa049;
    }

    .risk-rating-swatch.medium {
      background: #ffc928;
    }

    .risk-rating-swatch.high {
      background: #ff4e1d;
    }

    .risk-rating-swatch.extreme {
      background: #fb171b;
    }

    .risk-rating-swatch.neutral {
      background: #d8dde7;
    }

    .risk-treatment-count {
      color: #303746;
      display: inline-block;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
    }

    .risk-owner span,
    .risk-date {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-owner {
      white-space: nowrap;
    }

    .risk-owner span {
      display: inline-block;
      max-width: 100%;
      vertical-align: middle;
    }

    .risk-date {
      max-width: 100%;
    }

    .risk-actions-cell {
      position: relative;
      text-align: right;
    }

    :host ::ng-deep .risk-actions-cell .pm-row-action-menu {
      justify-content: flex-end;
      width: 100%;
    }

    :host ::ng-deep .risk-actions-cell .pm-row-action-trigger {
      background: transparent;
      border: 0;
      color: #10069f;
      height: 30px;
      padding: 0;
      width: 30px;
    }

    :host ::ng-deep .risk-actions-cell .pm-row-action-trigger:hover,
    :host ::ng-deep .risk-actions-cell .pm-row-action-trigger:focus-visible,
    :host ::ng-deep .risk-actions-cell .pm-row-action-trigger[aria-expanded='true'] {
      background: #f1f3ff;
      border: 0;
      outline: 0;
    }

    :host ::ng-deep .risk-actions-cell .pm-row-action-popover {
      min-width: 132px;
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

    .risk-hierarchy-empty.compact {
      min-height: 220px;
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

      .risk-hierarchy-search:hover,
      .risk-hierarchy-search:focus-within,
      .risk-hierarchy-search.has-query {
        flex-basis: min(220px, 100%);
      }

      .risk-view-toggle {
        width: 100%;
      }

      .risk-view-toggle button {
        flex: 1 1 0;
        justify-content: center;
      }

      .risk-tree-detail-layout {
        grid-template-columns: 1fr;
      }

      .risk-tree-panel {
        max-height: 320px;
      }

      .portfolio-risk-drawer-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PortfolioWorkspaceRiskRegisterComponent implements OnChanges {
  @Input() risks: Risk[] = [];
  @Input() programs: ProgramRow[] = [];
  @Input() standaloneProjects: ProgramRow[] = [];
  @Input() portfolioName = 'Safe Security Portfolio';
  @Output() readonly riskCreate = new EventEmitter<Risk>();
  @Output() readonly riskManage = new EventEmitter<Risk>();
  @Output() readonly riskDelete = new EventEmitter<string>();

  readonly riskLevelOptions = ['Portfolio', 'Program', 'Project'];
  readonly riskCategoryOptions = riskCategoryOptions;
  readonly exposureOptions = ['Low', 'Medium', 'High', 'Critical'];
  readonly statusOptions = ['Watching', 'Monitoring', 'Active', 'Escalated'];
  readonly riskLevelFilterOptions: RiskLevel[] = ['portfolio', 'program', 'project'];
  readonly riskExposureFilterOptions: RiskExposure[] = ['low', 'medium', 'high', 'critical'];
  readonly riskStatusFilterOptions: RiskStatus[] = ['watching', 'monitoring', 'active', 'escalated'];
  readonly portfolioNodeId = 'risk-node::portfolio';
  readonly standaloneNodeId = 'risk-node::standalone-projects';
  collapsedRiskNodeIds = new Set<string>([this.standaloneNodeId]);
  collapsedRiskTreeNodeIds = new Set<string>();
  isAddRiskDrawerOpen = false;
  riskFilterMenuOpen = false;
  riskProgramFilterMenuOpen = false;
  riskProjectFilterMenuOpen = false;
  riskStatusFilters: string[] = [];
  riskLevelFilters: string[] = [];
  riskProgramFilters: string[] = [];
  riskProjectFilters: string[] = [];
  riskCategoryFilters: string[] = [];
  riskExposureFilters: string[] = [];
  riskProgramFilterQuery = '';
  riskProjectFilterQuery = '';
  riskRegisterViewMode: RiskRegisterViewMode = 'grouped';
  selectedRiskTreeNodeId = this.portfolioNodeId;
  riskSearchQuery = '';
  addRiskDraft: AddPortfolioRiskDraft = this.createAddRiskDraft();
  activeRiskProfile: RiskProfileRecord | null = null;
  activeRiskProfileTab: RiskProfileTab = 'identification';
  riskTreatmentDraft: RiskTreatmentDraftRecord = this.createRiskTreatmentDraft();
  private riskDefaultCollapseInitialized = false;

  ngOnChanges(): void {
    if (this.riskDefaultCollapseInitialized || (!this.risks.length && !this.programs.length && !this.standaloneProjects.length)) return;

    this.collapsedRiskNodeIds = this.defaultCollapsedRiskNodeIds();
    this.riskDefaultCollapseInitialized = true;
  }

  get activeRisks(): Risk[] {
    const query = this.riskSearchQuery.trim().toLowerCase();
    const filteredRisks = this.risks.filter((risk) => this.riskMatchesFilters(risk));
    if (!query) return filteredRisks;

    return filteredRisks.filter((risk) => this.riskMatchesQuery(risk, query));
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

  get riskProgramFilterOptions(): string[] {
    const programs = new Set<string>();
    for (const risk of this.risks) {
      if (risk.level === 'program') programs.add(risk.linkedTo);
      if (risk.parentProgram) programs.add(risk.parentProgram);
    }
    return Array.from(programs).sort();
  }

  get riskProjectFilterOptions(): string[] {
    const projects = new Set<string>();
    for (const risk of this.risks) {
      if (risk.level === 'project') projects.add(risk.linkedTo);
    }
    return Array.from(projects).sort();
  }

  get filteredRiskProgramFilterOptions(): string[] {
    return this.filteredFilterOptions(this.riskProgramFilterOptions, this.riskProgramFilterQuery);
  }

  get filteredRiskProjectFilterOptions(): string[] {
    return this.filteredFilterOptions(this.riskProjectFilterOptions, this.riskProjectFilterQuery);
  }

  get riskProgramDropdownLabel(): string {
    if (!this.riskProgramFilters.length) return 'Program';
    if (this.riskProgramFilters.length === 1) return this.riskProgramFilters[0];
    return `${this.riskProgramFilters.length} programs`;
  }

  get riskProjectDropdownLabel(): string {
    if (!this.riskProjectFilters.length) return 'Project';
    if (this.riskProjectFilters.length === 1) return this.riskProjectFilters[0];
    return `${this.riskProjectFilters.length} projects`;
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

  get riskProfileConfig(): RiskProfileOptions {
    return {
      categoryOptions: [...riskCategoryOptions],
      ownerOptions: this.ownerOptions,
      statusOptions: this.statusOptions,
      strategicRiskOptions: ['Yes', 'No'],
      impactedObjectiveOptions: [
        'Portfolio delivery confidence',
        'Secure remote access framework',
        'Incident response readiness',
        'Agency compliance assurance',
      ],
      controlEffectivenessOptions: ['Effective', 'Partially effective', 'Needs improvement', 'Not rated'],
      treatmentApproachOptions: ['Mitigate the threat', 'Transfer the threat', 'Avoid the threat', 'Accept the threat'],
      treatmentTypeOptions: ['Mitigate', 'Transfer', 'Avoid', 'Accept'],
      treatmentCategoryOptions: ['Governance', 'Operational', 'Technology', 'Compliance', 'Stakeholder'],
      ownerPlaceholder: 'Select owner',
    };
  }

  get projectRiskProfileCount(): number {
    return this.activeRisks.filter((risk) => risk.level === 'project').length;
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
        draft.category &&
        draft.owner.trim() &&
        draft.mitigation.trim() &&
        draft.exposure &&
        draft.status,
    );
  }

  get selectedRiskTreeContext(): RiskTreeSelection {
    return this.findRiskTreeContext(this.selectedRiskTreeNodeId) || this.portfolioRiskTreeContext(this.riskHierarchy);
  }

  get riskActiveFilterCount(): number {
    return (
      this.riskStatusFilters.length +
      this.riskLevelFilters.length +
      this.riskProgramFilters.length +
      this.riskProjectFilters.length +
      this.riskCategoryFilters.length +
      this.riskExposureFilters.length
    );
  }

  get riskFacetFilterCount(): number {
    return this.riskStatusFilters.length + this.riskLevelFilters.length + this.riskCategoryFilters.length + this.riskExposureFilters.length;
  }

  get hasRiskFilters(): boolean {
    return this.riskActiveFilterCount > 0;
  }

  get hasRiskFacetFilters(): boolean {
    return this.riskFacetFilterCount > 0;
  }

  get riskFilterSummary(): string {
    return this.hasRiskFilters ? `${this.riskCountLabel(this.activeRisks.length)} shown` : 'All risks';
  }

  get riskFacetFilterSummary(): string {
    return this.hasRiskFacetFilters ? `${this.riskCountLabel(this.activeRisks.length)} shown` : 'All risks';
  }

  get riskAppliedFilters(): RiskAppliedFilter[] {
    return [
      ...this.riskStatusFilters.map((value) => this.createAppliedFilter('status', value, this.valueLabel(value))),
      ...this.riskLevelFilters.map((value) => this.createAppliedFilter('level', value, this.riskLevelLabel(value as RiskLevel))),
      ...this.riskProgramFilters.map((value) => this.createAppliedFilter('program', value, value)),
      ...this.riskProjectFilters.map((value) => this.createAppliedFilter('project', value, value)),
      ...this.riskCategoryFilters.map((value) => this.createAppliedFilter('category', value, value)),
      ...this.riskExposureFilters.map((value) => this.createAppliedFilter('exposure', value, this.valueLabel(value))),
    ];
  }

  setRiskSearchQuery(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.riskSearchQuery = target.value;
    }
  }

  setRiskRegisterViewMode(mode: RiskRegisterViewMode): void {
    this.riskRegisterViewMode = mode;
  }

  toggleRiskFilterMenu(): void {
    this.riskFilterMenuOpen = !this.riskFilterMenuOpen;
    if (this.riskFilterMenuOpen) {
      this.riskProgramFilterMenuOpen = false;
      this.riskProjectFilterMenuOpen = false;
    }
  }

  toggleRiskProgramFilterMenu(): void {
    this.riskProgramFilterMenuOpen = !this.riskProgramFilterMenuOpen;
    if (this.riskProgramFilterMenuOpen) {
      this.riskFilterMenuOpen = false;
      this.riskProjectFilterMenuOpen = false;
    }
  }

  toggleRiskProjectFilterMenu(): void {
    this.riskProjectFilterMenuOpen = !this.riskProjectFilterMenuOpen;
    if (this.riskProjectFilterMenuOpen) {
      this.riskFilterMenuOpen = false;
      this.riskProgramFilterMenuOpen = false;
    }
  }

  setRiskProgramFilterQuery(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.riskProgramFilterQuery = target.value;
    }
  }

  setRiskProjectFilterQuery(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.riskProjectFilterQuery = target.value;
    }
  }

  toggleRiskFilter(field: RiskFilterField, value: string, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const values = this.riskFilterValues(field);
    const normalizedValue = this.filterKey(value);
    const nextValues = target.checked
      ? Array.from(new Set([...values, value]))
      : values.filter((item) => this.filterKey(item) !== normalizedValue);
    this.setRiskFilterValues(field, nextValues);
  }

  isRiskFilterSelected(field: RiskFilterField, value: string): boolean {
    const normalizedValue = this.filterKey(value);
    return this.riskFilterValues(field).some((item) => this.filterKey(item) === normalizedValue);
  }

  clearRiskFilter(field: RiskFilterField, value: string): void {
    const normalizedValue = this.filterKey(value);
    this.setRiskFilterValues(field, this.riskFilterValues(field).filter((item) => this.filterKey(item) !== normalizedValue));
  }

  resetRiskFilters(): void {
    this.riskStatusFilters = [];
    this.riskLevelFilters = [];
    this.riskProgramFilters = [];
    this.riskProjectFilters = [];
    this.riskCategoryFilters = [];
    this.riskExposureFilters = [];
  }

  resetRiskFacetFilters(): void {
    this.riskStatusFilters = [];
    this.riskLevelFilters = [];
    this.riskCategoryFilters = [];
    this.riskExposureFilters = [];
  }

  clearRiskEntityFilters(field: 'program' | 'project'): void {
    if (field === 'program') {
      this.riskProgramFilters = [];
      this.riskProgramFilterQuery = '';
      return;
    }

    this.riskProjectFilters = [];
    this.riskProjectFilterQuery = '';
  }

  manageRisk(risk: Risk): void {
    this.activeRiskProfile = this.createRiskProfile(risk);
    this.activeRiskProfileTab = 'identification';
    this.riskTreatmentDraft = this.createRiskTreatmentDraft(this.activeRiskProfile);
    this.riskManage.emit(risk);
  }

  closeRiskProfile(): void {
    this.activeRiskProfile = null;
    this.activeRiskProfileTab = 'identification';
    this.riskTreatmentDraft = this.createRiskTreatmentDraft();
  }

  setRiskProfileTab(tab: RiskProfileTab): void {
    this.activeRiskProfileTab = tab;
  }

  updateRiskProfileField(change: RiskProfileFieldChange): void {
    if (!this.activeRiskProfile) return;
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      [change.field]: change.value,
    };
  }

  updateRiskProfileSharedRisk(sharedRisk: boolean): void {
    if (!this.activeRiskProfile) return;
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      sharedRisk,
    };
  }

  updateRiskProfileMatrix(change: RiskProfileMatrixChange): void {
    if (!this.activeRiskProfile) return;
    const { likelihood, consequence, rating } = change.selection;
    this.activeRiskProfile =
      change.kind === 'actual'
        ? {
            ...this.activeRiskProfile,
            actualLikelihood: likelihood,
            actualConsequence: consequence,
            actualRating: rating,
          }
        : {
            ...this.activeRiskProfile,
            residualLikelihood: likelihood,
            residualConsequence: consequence,
            residualRating: rating,
          };
  }

  updateRiskTreatmentDraft(change: RiskTreatmentDraftChange): void {
    this.riskTreatmentDraft = {
      ...this.riskTreatmentDraft,
      [change.field]: change.value,
    };
  }

  addRiskTreatmentToProfile(): void {
    if (!this.activeRiskProfile || !this.riskTreatmentDraft.treatment.trim()) return;

    const treatment: RiskTreatmentRecord = {
      id: `TRT-${String(this.activeRiskProfile.treatments.length + 1).padStart(3, '0')}`,
      ...this.riskTreatmentDraft,
    };
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      treatments: [...this.activeRiskProfile.treatments, treatment],
    };
    this.riskTreatmentDraft = this.createRiskTreatmentDraft(this.activeRiskProfile);
  }

  removeRiskTreatmentFromProfile(treatmentId: string): void {
    if (!this.activeRiskProfile) return;
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      treatments: this.activeRiskProfile.treatments.filter((treatment) => treatment.id !== treatmentId),
    };
  }

  completeRiskProfile(): void {
    if (!this.activeRiskProfile) return;
    this.activeRiskProfile = {
      ...this.activeRiskProfile,
      status: 'Closed',
    };
  }

  deleteRisk(riskId: string): void {
    this.riskDelete.emit(riskId);
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

  toggleRiskTreeNode(nodeId: string): void {
    if (this.collapsedRiskTreeNodeIds.has(nodeId)) {
      this.collapsedRiskTreeNodeIds.delete(nodeId);
    } else {
      this.collapsedRiskTreeNodeIds.add(nodeId);
    }
    this.collapsedRiskTreeNodeIds = new Set(this.collapsedRiskTreeNodeIds);
  }

  isRiskTreeNodeCollapsed(nodeId: string): boolean {
    return this.collapsedRiskTreeNodeIds.has(nodeId);
  }

  selectRiskTreeNode(nodeId: string): void {
    this.selectedRiskTreeNodeId = nodeId;
  }

  isRiskTreeNodeSelected(nodeId: string): boolean {
    return this.selectedRiskTreeContext.key === nodeId;
  }

  programRiskCount(program: ProgramGroup): number {
    return program.directRisks.length + program.projects.reduce((total, project) => total + project.risks.length, 0);
  }

  portfolioRiskCount(portfolio: PortfolioGroup): number {
    return (
      portfolio.directRisks.length +
      portfolio.programs.reduce((total, program) => total + this.programRiskCount(program), 0) +
      portfolio.standaloneProjects.risks.length
    );
  }

  riskCountLabel(count: number): string {
    return count === 1 ? '1 risk' : `${count} risks`;
  }

  riskLevelCountLabel(count: number, level: RiskLevel): string {
    return `${this.riskCountLabel(count)} at ${this.riskLevelLabel(level).toLowerCase()} level`;
  }

  riskLineageLabel(risk: Risk): string {
    if (risk.level === 'portfolio') return `${this.riskLevelLabel(risk.level)} / ${risk.linkedTo}`;
    if (risk.level === 'program') return `${risk.parentPortfolio || this.portfolioName} / ${risk.linkedTo}`;

    return [risk.parentPortfolio || this.portfolioName, risk.parentProgram, risk.linkedTo].filter(Boolean).join(' / ');
  }

  riskTreeKindLabel(kind: RiskTreeSelectionKind): string {
    if (kind === 'standalone') return 'Standalone';
    return this.riskLevelLabel(kind);
  }

  riskTreeLevelClass(kind: RiskTreeSelectionKind): string {
    if (kind === 'program') return 'program-risk';
    if (kind === 'project' || kind === 'standalone') return 'project-risk';
    return 'portfolio-risk';
  }

  riskTreeBranchClass(kind: RiskTreeSelectionKind): string {
    if (kind === 'program') return 'program-risk-node';
    if (kind === 'project') return 'project-risk-node';
    if (kind === 'standalone') return 'standalone-risk-node';
    return 'portfolio-risk-node';
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

  updateAddRiskCategory(label: string): void {
    this.updateAddRiskDraft('category', this.riskCategoryFromLabel(label));
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
      category: draft.category,
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
    if (exposure === 'critical') return 'extreme';
    if (exposure === 'high') return 'high';
    if (exposure === 'medium') return 'medium';
    if (exposure === 'low') return 'low';
    return 'neutral';
  }

  statusTone(status: Risk['status']): string {
    if (status === 'escalated') return 'red';
    if (status === 'active') return 'amber';
    if (status === 'monitoring') return 'blue';
    return 'neutral';
  }

  residualRiskLabel(risk: Risk): string {
    return this.valueLabel(this.residualRiskExposure(risk));
  }

  residualRiskTone(risk: Risk): string {
    return this.exposureTone(this.residualRiskExposure(risk));
  }

  riskEndDate(risk: Risk): string {
    if (risk.level === 'program') {
      return this.displayDate(this.findProgramEndDate(risk.linkedTo));
    }

    if (risk.level === 'project') {
      return this.displayDate(this.findProjectEndDate(risk.linkedTo, risk.parentProgram));
    }

    return this.displayDate(this.latestPortfolioEndDate());
  }

  riskReviewDueDate(risk: Risk): string {
    return this.addDaysToDisplayDate(risk.lastReview, 30);
  }

  riskDateLabel(value: string): string {
    if (!value) return 'N/A';
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return value;

    const [, month, day, year] = match;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = Number(month) - 1;
    const labelMonth = monthNames[monthIndex] || month;
    return `${Number(day)} ${labelMonth} ${year}`;
  }

  riskTreatmentCount(risk: Risk): number {
    return risk.mitigation.trim() ? 1 : 0;
  }

  valueLabel(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private findRiskTreeContext(nodeId: string): RiskTreeSelection | null {
    const hierarchy = this.riskHierarchy;

    if (nodeId === hierarchy.key) {
      return this.portfolioRiskTreeContext(hierarchy);
    }

    for (const program of hierarchy.programs) {
      if (nodeId === program.key) {
        return {
          key: program.key,
          label: program.label,
          kind: 'program',
          lineage: hierarchy.label,
          risks: program.directRisks,
        };
      }

      const project = program.projects.find((item) => item.key === nodeId);
      if (project) {
        return {
          key: project.key,
          label: project.label,
          kind: 'project',
          lineage: `${hierarchy.label} / ${program.label}`,
          risks: project.risks,
        };
      }
    }

    if (nodeId === this.standaloneNodeId) {
      return {
        key: this.standaloneNodeId,
        label: 'Standalone Projects',
        kind: 'standalone',
        lineage: hierarchy.label,
        risks: this.standaloneRiskProjects.flatMap((project) => project.risks),
      };
    }

    for (const project of this.standaloneRiskProjects) {
      if (project.key === nodeId) {
        return {
          key: project.key,
          label: project.label,
          kind: 'project',
          lineage: `${hierarchy.label} / Standalone Projects`,
          risks: project.risks,
        };
      }
    }

    return null;
  }

  private portfolioRiskTreeContext(hierarchy: PortfolioGroup): RiskTreeSelection {
    return {
      key: hierarchy.key,
      label: hierarchy.label,
      kind: 'portfolio',
      lineage: 'Portfolio',
      risks: hierarchy.directRisks,
    };
  }

  private riskLevelFromLabel(label: string): RiskLevel {
    const normalized = label.toLowerCase();
    if (normalized === 'program') return 'program';
    if (normalized === 'project') return 'project';
    return 'portfolio';
  }

  private riskCategoryFromLabel(label: string): RiskCategory {
    return this.riskCategoryOptions.find((category) => category === label) || 'Reputational';
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
      category: 'Reputational',
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

  private createAppliedFilter(field: RiskFilterField, rawValue: string, displayValue: string): RiskAppliedFilter {
    return {
      field,
      id: `${field}-${this.filterKey(rawValue)}`,
      label: this.riskFilterFieldLabel(field),
      value: displayValue,
    };
  }

  private riskFilterFieldLabel(field: RiskFilterField): string {
    if (field === 'status') return 'Status';
    if (field === 'level') return 'Level';
    if (field === 'program') return 'Program';
    if (field === 'project') return 'Project';
    if (field === 'category') return 'Category';
    return 'AR';
  }

  private filteredFilterOptions(options: string[], query: string): string[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) => option.toLowerCase().includes(normalizedQuery));
  }

  private riskFilterValues(field: RiskFilterField): string[] {
    if (field === 'status') return this.riskStatusFilters;
    if (field === 'level') return this.riskLevelFilters;
    if (field === 'program') return this.riskProgramFilters;
    if (field === 'project') return this.riskProjectFilters;
    if (field === 'category') return this.riskCategoryFilters;
    return this.riskExposureFilters;
  }

  private setRiskFilterValues(field: RiskFilterField, values: string[]): void {
    if (field === 'status') this.riskStatusFilters = values;
    if (field === 'level') this.riskLevelFilters = values;
    if (field === 'program') this.riskProgramFilters = values;
    if (field === 'project') this.riskProjectFilters = values;
    if (field === 'category') this.riskCategoryFilters = values;
    if (field === 'exposure') this.riskExposureFilters = values;
  }

  private riskMatchesFilters(risk: Risk): boolean {
    if (this.riskStatusFilters.length && !this.riskStatusFilters.some((status) => this.filterKey(status) === this.filterKey(risk.status))) return false;
    if (this.riskLevelFilters.length && !this.riskLevelFilters.some((level) => this.filterKey(level) === this.filterKey(risk.level))) return false;
    if (this.riskCategoryFilters.length && !this.riskCategoryFilters.some((category) => this.filterKey(category) === this.filterKey(risk.category))) return false;
    if (this.riskExposureFilters.length && !this.riskExposureFilters.some((exposure) => this.filterKey(exposure) === this.filterKey(risk.exposure))) return false;

    if (this.riskProgramFilters.length) {
      const riskProgram = risk.level === 'program' ? risk.linkedTo : risk.parentProgram || '';
      if (!this.riskProgramFilters.some((program) => this.sameEntityName(program, riskProgram))) return false;
    }

    if (this.riskProjectFilters.length) {
      if (risk.level !== 'project' || !this.riskProjectFilters.some((project) => this.sameEntityName(project, risk.linkedTo))) return false;
    }

    return true;
  }

  private riskMatchesQuery(risk: Risk, query: string): boolean {
    const searchable = [
      risk.id,
      risk.name,
      risk.category,
      risk.level,
      risk.linkedTo,
      risk.parentProgram || '',
      risk.parentPortfolio || '',
      risk.owner.name,
      risk.mitigation,
      this.riskEndDate(risk),
      this.riskDateLabel(this.riskEndDate(risk)),
      this.riskReviewDueDate(risk),
      this.riskDateLabel(this.riskReviewDueDate(risk)),
      this.residualRiskLabel(risk),
      risk.lastReview,
      risk.exposure,
      risk.status,
    ];

    return searchable.some((value) => value.toLowerCase().includes(query));
  }

  private residualRiskExposure(risk: Risk): RiskExposure {
    const exposureOrder: RiskExposure[] = ['low', 'medium', 'high', 'critical'];
    const exposureIndex = exposureOrder.indexOf(risk.exposure);
    const reduction =
      risk.status === 'watching'
        ? 2
        : risk.status === 'monitoring' || risk.status === 'active'
          ? 1
          : 0;

    return exposureOrder[Math.max(0, exposureIndex - reduction)] || risk.exposure;
  }

  private findProgramEndDate(programName: string): string {
    return this.programs.find((program) => this.sameEntityName(program.name, programName))?.endDate || '';
  }

  private findProjectEndDate(projectName: string, parentProgram?: string): string {
    if (parentProgram) {
      const program = this.programs.find((item) => this.sameEntityName(item.name, parentProgram));
      const project = program?.projects?.find((item) => this.sameEntityName(item.name, projectName));
      if (project?.endDate) return project.endDate;
    }

    for (const program of this.programs) {
      const project = program.projects?.find((item) => this.sameEntityName(item.name, projectName));
      if (project?.endDate) return project.endDate;
    }

    return this.standaloneProjects.find((project) => this.sameEntityName(project.name, projectName))?.endDate || '';
  }

  private latestPortfolioEndDate(): string {
    const endDates = [
      ...this.programs.map((program) => program.endDate),
      ...this.programs.flatMap((program) => (program.projects || []).map((project) => project.endDate)),
      ...this.standaloneProjects.map((project) => project.endDate),
    ].filter(Boolean);

    const sortedEndDates = endDates.sort();
    return sortedEndDates[sortedEndDates.length - 1] || '';
  }

  private addDaysToDisplayDate(value: string, days: number): string {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return value;

    const [, month, day, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    date.setDate(date.getDate() + days);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  }

  private createRiskProfile(risk: Risk): RiskProfileRecord {
    const actualRisk = this.riskMatrixDefaults(risk.exposure);
    const residualRisk = this.riskMatrixDefaults(this.residualRiskExposure(risk));
    const startDate = this.inputDateFromDisplayDate(risk.lastReview);
    const endDate = this.inputDateFromDisplayDate(this.riskEndDate(risk));
    const reviewDueDate = this.inputDateFromDisplayDate(this.riskReviewDueDate(risk));
    const owner = risk.owner.name;
    const treatmentCategory = this.treatmentCategoryFromRiskCategory(risk.category);
    const treatments: RiskTreatmentRecord[] = risk.mitigation.trim()
      ? [
          {
            id: 'TRT-001',
            treatment: risk.mitigation,
            type: 'Mitigate',
            category: treatmentCategory,
            owner,
            manager: owner,
            startDate,
            endDate: reviewDueDate,
            status: this.valueLabel(risk.status),
          },
        ]
      : [];

    return {
      id: risk.id,
      riskCategory: risk.category,
      riskName: risk.name,
      description: `${this.riskLineageLabel(risk)}. ${risk.mitigation}`,
      owner,
      manager: owner,
      lead: owner,
      startDate,
      endDate,
      reviewDueDate,
      status: this.valueLabel(risk.status),
      strategicRisk: risk.level === 'portfolio' ? 'Yes' : 'No',
      enterpriseImpact: risk.level === 'portfolio' || risk.exposure === 'critical',
      actualLikelihood: actualRisk.likelihood,
      actualConsequence: actualRisk.consequence,
      actualRating: actualRisk.rating,
      residualLikelihood: residualRisk.likelihood,
      residualConsequence: residualRisk.consequence,
      residualRating: residualRisk.rating,
      impactedObjective: risk.level === 'portfolio' ? 'Portfolio delivery confidence' : 'Agency compliance assurance',
      sharedRisk: risk.level !== 'project',
      source: this.riskLineageLabel(risk),
      consequence: this.riskConsequenceText(risk),
      controlSummary: risk.mitigation,
      overallControlEffectiveness: this.controlEffectivenessForRisk(risk),
      analysisComment: `Last reviewed on ${this.riskDateLabel(risk.lastReview)}.`,
      treatmentApproach: 'Mitigate the threat',
      treatmentType: 'Mitigate',
      treatmentComment: risk.mitigation,
      treatments,
      createdOn: startDate,
    };
  }

  private createRiskTreatmentDraft(profile: RiskProfileRecord | null = this.activeRiskProfile): RiskTreatmentDraftRecord {
    return {
      treatment: '',
      type: 'Mitigate',
      category: profile?.riskCategory ? this.treatmentCategoryFromRiskCategory(profile.riskCategory as RiskCategory) : 'Governance',
      owner: profile?.owner || '',
      manager: profile?.manager || profile?.owner || '',
      startDate: profile?.startDate || '',
      endDate: profile?.reviewDueDate || '',
      status: 'Proposed',
    };
  }

  private riskMatrixDefaults(exposure: RiskExposure): { likelihood: string; consequence: string; rating: string } {
    if (exposure === 'critical') return { likelihood: 'Almost certain', consequence: 'Severe', rating: 'Extreme' };
    if (exposure === 'high') return { likelihood: 'Likely', consequence: 'Major', rating: 'High' };
    if (exposure === 'medium') return { likelihood: 'Possible', consequence: 'Moderate', rating: 'Medium' };
    return { likelihood: 'Unlikely', consequence: 'Minor', rating: 'Low' };
  }

  private riskConsequenceText(risk: Risk): string {
    if (risk.exposure === 'critical') return 'Could materially disrupt portfolio delivery and require executive escalation.';
    if (risk.exposure === 'high') return 'Could delay key milestones or reduce confidence in delivery readiness.';
    if (risk.exposure === 'medium') return 'Could create localized schedule, compliance, or stakeholder pressure.';
    return 'Limited impact expected if current controls remain active.';
  }

  private controlEffectivenessForRisk(risk: Risk): string {
    if (risk.exposure === 'low') return 'Effective';
    if (risk.exposure === 'medium') return 'Partially effective';
    if (risk.exposure === 'high') return 'Needs improvement';
    return 'Not rated';
  }

  private treatmentCategoryFromRiskCategory(category: RiskCategory): string {
    if (category === 'Technology Risk') return 'Technology';
    if (category === 'Compliance Risk') return 'Compliance';
    if (category === 'Stakeholder Risk' || category === 'Reputational') return 'Stakeholder';
    if (category === 'Operational Risk' || category === 'Schedule Risk') return 'Operational';
    return 'Governance';
  }

  private inputDateFromDisplayDate(value: string): string {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return value;
    const [, month, day, year] = match;
    return `${year}-${month}-${day}`;
  }

  private defaultCollapsedRiskNodeIds(): Set<string> {
    const collapsedNodeIds = new Set<string>();
    const hierarchy = this.riskHierarchy;
    collapsedNodeIds.add(this.standaloneNodeId);

    for (const program of hierarchy.programs) {
      collapsedNodeIds.add(program.key);
      for (const project of program.projects) {
        collapsedNodeIds.add(project.key);
      }
    }

    for (const project of this.standaloneRiskProjects) {
      collapsedNodeIds.add(project.key);
    }

    return collapsedNodeIds;
  }

  private sameEntityName(left: string, right: string): boolean {
    return left.trim().toLowerCase() === right.trim().toLowerCase();
  }

  private filterKey(value: string): string {
    return value.trim().toLowerCase();
  }
}
