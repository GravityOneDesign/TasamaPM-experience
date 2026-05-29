import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleCreateMenuComponent, type PmConsoleCreateMenuOption } from '../shared/pm-console-create-menu.component';
import { type PmConsoleFieldOption } from '../shared/pm-console-field.component';
import { PortfolioManagerStatusTrendComponent, type PortfolioManagerStatusTrendInput } from '../portfolio-manager-status-trend.component';
import {
  portfolioProgramRows,
  standaloneProjects,
  riskRegisterData,
  benefitsRegisterData,
  issuesRegisterData,
  ProgramRow,
  ProjectRow,
  Risk,
  Benefit,
  Issue
} from './portfolio-workspace.data';
import { PortfolioWorkspaceRiskRegisterComponent } from './portfolio-workspace-risk-register.component';
import { PortfolioWorkspaceBenefitsRegisterComponent } from './portfolio-workspace-benefits-register.component';
import { PortfolioWorkspaceIssuesRegisterComponent } from './portfolio-workspace-issues-register.component';
import {
  PortfolioWorkspaceRegisterCreateDrawerComponent,
  type PortfolioProgramCreatePayload,
  type PortfolioProjectCreatePayload,
  type PortfolioRegisterCreateKind,
} from './portfolio-workspace-register-create-drawer.component';

type SubTab = 'projects' | 'benefits' | 'risks' | 'issues';

interface RegisterSubTabItem {
  readonly id: SubTab;
  readonly label: string;
}

const registerSubTabs: readonly RegisterSubTabItem[] = [
  { id: 'projects', label: 'Program & Project Register' },
  { id: 'benefits', label: 'Benefit' },
  { id: 'risks', label: 'Risk' },
  { id: 'issues', label: 'Issues' },
];

const createMenuOptions: readonly PmConsoleCreateMenuOption[] = [
  { id: 'program', label: 'Program', icon: 'layers' },
  { id: 'project', label: 'Project', icon: 'folder' },
];

const portfolioOptions: readonly string[] = ['Tasama Client 1'];
const unassignedManager = 'Unassigned';

@Component({
  selector: 'app-portfolio-workspace-registers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PmConsoleCreateMenuComponent,
    PmConsoleStatusTrendComponent,
    PortfolioWorkspaceRiskRegisterComponent,
    PortfolioWorkspaceBenefitsRegisterComponent,
    PortfolioWorkspaceIssuesRegisterComponent,
    PortfolioWorkspaceRegisterCreateDrawerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-registers-tab">
      <div class="portfolio-register-shell">
        <aside class="portfolio-register-nav" aria-label="Register sections">
          <div class="portfolio-register-tab-scroll">
            <div class="portfolio-register-tab-list" role="tablist" aria-label="Portfolio registers">
              @for (tab of registerSubTabs; track tab.id) {
                <button
                  [class.active]="activeSubTab === tab.id"
                  type="button"
                  role="tab"
                  [attr.aria-selected]="activeSubTab === tab.id"
                  (click)="setSubTab(tab.id)"
                >
                  <span class="portfolio-register-tab-label">{{ tab.label }}</span>
                </button>
              }
            </div>
          </div>
        </aside>

        <main class="portfolio-register-panel">
          @switch (activeSubTab) {
            @case ('projects') {
              <div class="tab-content-container animation-slide">

            <div class="register-toolbar">
              <div class="toolbar-left">
                <!-- Programs summary container -->
                <div class="summary-pill active">
                  <span class="pill-label">Programs</span>
                  <span class="pill-badge-circle">{{ allProgramsCount }}</span>
                </div>
                <!-- Standalone Projects summary container -->
                <div class="summary-pill inactive">
                  <span class="pill-label">Standalone Projects</span>
                  <span class="pill-badge-circle">{{ standaloneList.length }}</span>
                </div>
              </div>
              
              <div class="toolbar-right">
                <!-- Toggleable Search -->
                <div class="search-toggle-container" [class.is-expanded]="showSearch">
                  <button class="tb-btn search-toggle-btn" type="button" (click)="showSearch = !showSearch" aria-label="Toggle search">
                    <span [pmConsoleIcon]="'search'"></span>
                  </button>
                  @if (showSearch) {
                    <input
                      type="search"
                      class="toolbar-search-input"
                      placeholder="Search Programs..."
                      [(ngModel)]="searchQuery"
                      (input)="onSearch()"
                      autofocus
                    />
                  }
                </div>

                <button class="tb-btn" type="button" aria-label="Filter options">
                  <span [pmConsoleIcon]="'filter'"></span>
                  <span>Filter</span>
                </button>
                <button class="tb-btn" type="button" aria-label="Export">
                  <span [pmConsoleIcon]="'download'"></span>
                  <span>Export</span>
                </button>

                <app-pm-console-create-menu
                  label="Add new"
                  ariaLabel="Add program or project"
                  [options]="createMenuOptions"
                  (optionSelect)="openCreateDrawer($event)"
                />

                <button class="tb-btn settings-btn" type="button" aria-label="Settings">
                  <span [pmConsoleIcon]="'settings'"></span>
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="pm-project-table-scroll">
              <table class="pm-project-table">
                <thead>
                  <tr>
                    <th>Program / Project Name</th>
                    <th>Manager</th>
                    <th>Status Trend</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Budget Utilised</th>
                  </tr>
                </thead>
                <tbody>
                  @for (prog of filteredPrograms; track prog.id) {
                    <!-- Program Row -->
                    <tr class="program-row" [class.is-expanded]="isExpanded(prog.id)">
                      <td class="primary-col">
                        <div class="name-cell-wrapper">
                          <button
                            class="expand-toggle-btn"
                            type="button"
                            (click)="toggleProgram(prog.id)"
                            [attr.aria-label]="isExpanded(prog.id) ? 'Collapse projects' : 'Expand projects'"
                          >
                            <span [pmConsoleIcon]="isExpanded(prog.id) ? 'chevron-down' : 'chevron-right'" class="chevron-icon"></span>
                          </button>
                          <div class="program-title-column" title="{{ prog.name }}">
                            <div class="program-id-alert-wrapper">
                              <span class="program-display-id">{{ getProgramDisplayId(prog.id) }}</span>
                              @if (prog.id === 'prog-1' || prog.id === 'prog-2') {
                                <span class="review-needed-alert" title="Needs attention">
                                  <span [pmConsoleIcon]="'triangle-alert'"></span>
                                </span>
                              }
                            </div>
                            <div class="title-meta">
                              <strong class="program-name-blue" title="{{ prog.name }}">{{ truncateName(prog.name, 30) }}</strong>
                              <span class="badge-tag program-tag">Program</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle" [ngStyle]="getManagerAvatarStyles(prog.manager)">{{ getInitials(prog.manager) }}</div>
                          <span class="manager-name">{{ prog.manager }}</span>
                        </div>
                      </td>
                      <td>
                        <app-pm-console-status-trend [tones]="getThreePeriodTrend(prog.id)" [ariaLabel]="prog.name + ' report status trend'"></app-pm-console-status-trend>
                      </td>
                      <td class="date-col">{{ formatDate(prog.startDate) }}</td>
                      <td class="date-col">{{ formatDate(prog.endDate) }}</td>
                      <td class="budget-col">
                        <span class="pm-table-budget">
                          <strong>{{ getBudgetParts(prog.budgetUtilised).bold }}</strong><small>{{ getBudgetParts(prog.budgetUtilised).normal }}</small>
                        </span>
                      </td>
                    </tr>

                    <!-- Child Project Rows -->
                    @if (isExpanded(prog.id) && prog.projects) {
                      @for (proj of prog.projects; track proj.id) {
                        <tr class="project-child-row animation-slide">
                          <td class="primary-col indented-col">
                            <div class="name-cell-wrapper">
                              <span [pmConsoleIcon]="'corner-down-right'" class="corner-arrow"></span>
                              <div class="program-title-column" title="{{ proj.name }}">
                                <span class="program-display-id">{{ getProgramDisplayId(proj.id) }}</span>
                                <div class="title-meta">
                                  <strong class="program-name-blue" title="{{ proj.name }}">{{ truncateName(proj.name, 30) }}</strong>
                                  <span class="badge-tag project-tag">Project</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div class="avatar-cell">
                              <div class="avatar-circle" [ngStyle]="getManagerAvatarStyles(proj.manager)">{{ getInitials(proj.manager) }}</div>
                              <span class="manager-name">{{ proj.manager }}</span>
                            </div>
                          </td>
                          <td>
                            <app-pm-console-status-trend [tones]="getThreePeriodTrend(proj.id)" [ariaLabel]="proj.name + ' report status trend'"></app-pm-console-status-trend>
                          </td>
                          <td class="date-col">{{ formatDate(proj.startDate) }}</td>
                          <td class="date-col">{{ formatDate(proj.endDate) }}</td>
                          <td class="budget-col">
                            <span class="pm-table-budget">
                              <strong>{{ getBudgetParts(proj.budgetUtilised).bold }}</strong><small>{{ getBudgetParts(proj.budgetUtilised).normal }}</small>
                            </span>
                          </td>
                        </tr>
                      }
                    }
                  }

                  <!-- Standalone Projects -->
                  @for (sa of standaloneList; track sa.id) {
                    <tr class="program-row standalone-row">
                      <td class="primary-col">
                        <div class="name-cell-wrapper no-chevron">
                          <div class="program-title-column" title="{{ sa.name }}">
                            <span class="program-display-id">{{ getProgramDisplayId(sa.id) }}</span>
                            <div class="title-meta">
                              <strong class="program-name-blue" title="{{ sa.name }}">{{ truncateName(sa.name, 30) }}</strong>
                              <span class="badge-tag project-tag">Project</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle" [ngStyle]="getManagerAvatarStyles(sa.manager)">{{ getInitials(sa.manager) }}</div>
                          <span class="manager-name">{{ sa.manager }}</span>
                        </div>
                      </td>
                      <td>
                        <app-pm-console-status-trend [tones]="getThreePeriodTrend(sa.id)" [ariaLabel]="sa.name + ' report status trend'"></app-pm-console-status-trend>
                      </td>
                      <td class="date-col">{{ formatDate(sa.startDate) }}</td>
                      <td class="date-col">{{ formatDate(sa.endDate) }}</td>
                      <td class="budget-col">
                        <span class="pm-table-budget">
                          <strong>{{ getBudgetParts(sa.budgetUtilised).bold }}</strong><small>{{ getBudgetParts(sa.budgetUtilised).normal }}</small>
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
            }

            @case ('benefits') {
              <div class="tab-content-container animation-slide">
                <app-portfolio-workspace-benefits-register [benefits]="benefits" />
              </div>
            }

            @case ('risks') {
              <div class="tab-content-container animation-slide">
                <app-portfolio-workspace-risk-register
                  [risks]="riskData"
                  [programs]="programs"
                  [standaloneProjects]="standaloneList"
                  (riskCreate)="addRisk($event)"
                  (riskDelete)="deleteRisk($event)"
                />
              </div>
            }

            @case ('issues') {
              <div class="tab-content-container animation-slide">
                <app-portfolio-workspace-issues-register
                  [issues]="issues"
                  [programs]="programs"
                  [standaloneProjects]="standaloneList"
                  (issueCreate)="addIssue($event)"
                />
              </div>
            }
          }
        </main>
      </div>
      @if (createDrawerKind) {
        <app-portfolio-workspace-register-create-drawer
          [kind]="createDrawerKind"
          [portfolioOptions]="portfolioOptions"
          [programOptions]="programSelectOptions"
          [managerOptions]="managerOptions"
          (close)="closeCreateDrawer()"
          (programCreate)="addProgramFromDrawer($event)"
          (projectCreate)="addProjectFromDrawer($event)"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .workspace-registers-tab {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      padding: 0;
      animation: fadeIn 0.3s ease-out;
    }

    .portfolio-register-shell {
      background: #ffffff;
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .portfolio-register-nav {
      align-items: stretch;
      background: #ffffff;
      border-bottom: 1px solid #edf0f6;
      display: flex;
      flex: 0 0 auto;
      height: 48px;
      margin: 0;
      min-height: 0;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 32px;
      width: 100%;
    }

    .portfolio-register-tab-scroll {
      align-items: stretch;
      display: flex;
      flex: 1 1 auto;
      flex-direction: row;
      height: 100%;
      min-height: 0;
      overflow-x: auto;
      overflow-y: hidden;
      width: 100%;
    }

    .portfolio-register-tab-list {
      align-items: stretch;
      display: flex;
      flex-direction: row;
      gap: 32px;
      height: 100%;
      width: auto;
    }

    .portfolio-register-tab-list button {
      align-items: center;
      background: transparent;
      border: 0;
      color: #5e6472;
      display: inline-flex;
      flex: 0 0 auto;
      font-size: 12px;
      font-weight: 500;
      height: 100%;
      justify-content: center;
      line-height: 16px;
      min-width: 0;
      overflow: visible;
      padding: 0 2px;
      position: relative;
      white-space: nowrap;
      width: auto;
      z-index: 0;
    }

    .portfolio-register-tab-list button:hover {
      color: #252a34;
    }

    .portfolio-register-tab-list button.active {
      background: transparent;
      color: var(--brand);
      font-weight: 500;
    }

    .portfolio-register-tab-list button.active::after {
      background: var(--brand);
      border-radius: 999px 999px 0 0;
      bottom: -1px;
      content: "";
      display: block;
      height: 2px;
      left: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
    }

    .portfolio-register-tab-label {
      overflow: visible;
      text-overflow: clip;
      white-space: nowrap;
    }

    .portfolio-register-tab-list button:focus {
      outline: none;
    }

    .portfolio-register-tab-list button:focus-visible {
      box-shadow: inset 0 0 0 2px rgba(16, 6, 159, 0.18);
    }

    .portfolio-register-panel {
      background: #ffffff;
      display: flex;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      padding: 0;
    }

    .tab-content-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .portfolio-issues-empty {
      min-height: 0;
      overflow: auto;
      padding: 4px;
    }

    /* Toolbar */
    .register-toolbar {
      position: sticky;
      top: 0px;
      z-index: 11;
      background: transparent;
      padding: 14px 20px 12px;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: none;
      box-shadow: none;
    }

    /* Summary pills styled simple, clean, light weight, slate grey as requested */
    .summary-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 0;
      font-size: 13.5px;
      font-weight: 400; /* Light font weight */
      color: #707788;   /* Same shade of grey as other body text */
      background: transparent !important;
      border: none;
    }

    .summary-pill .pill-badge-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #DFDFEE;
      opacity: 0.75;
      color: #4f46e5;
      font-size: 11px;
      font-weight: 400; /* light font weight */
      line-height: 1;
    }

    .pm-project-table-scroll {
      flex: 1;
      overflow: auto;
      min-height: 0;
      border: 1px solid #e3e5e9;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      margin: 12px;
    }

    .pm-project-table th {
      background: #f8fafc;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .items-count {
      font-size: 13px;
      font-weight: 600;
      color: #707788;
    }

    /* Toggleable search */
    .search-toggle-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-search-input {
      background: #f4f5f7;
      border: 1px solid #e3e5e9;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      color: #252a34;
      outline: none;
      width: 180px;
      transition: border-color 0.2s ease, width 0.2s ease;
    }

    .toolbar-search-input:focus {
      border-color: var(--brand, #007aff);
      background: #ffffff;
      box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }

    .tb-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 8px;
      padding: 8px 14px;
      color: #252a34;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    .tb-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .primary-tb {
      background: var(--brand, #007aff);
      border-color: var(--brand, #007aff);
      color: #ffffff;
    }

    .primary-tb:hover {
      background: #0062cc;
      border-color: #0062cc;
    }

    .program-row {
      transition: background-color 0.15s ease;
    }

    .program-row.is-expanded {
      background: rgba(0, 122, 255, 0.02) !important;
    }

    .name-cell-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .name-cell-wrapper.no-chevron {
      padding-left: 28px;
    }

    .expand-toggle-btn {
      background: transparent;
      border: none;
      color: #707788;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      padding: 0;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .expand-toggle-btn:hover {
      background: rgba(15, 23, 42, 0.04);
      color: #252a34;
    }

    .chevron-icon {
      font-size: 14px;
    }

    /* Program ID & Name */
    .program-title-column {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: flex-start;
      text-align: left;
    }

    .program-display-id {
      font-size: 10.5px;
      font-weight: 500;
      color: #8a94a6;
      letter-spacing: 0.02em;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .program-name-blue {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--brand, #007aff);
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .program-name-blue:hover {
      color: #0056cc;
      text-decoration: underline;
    }

    .title-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
      min-width: 0;
    }

    .title-meta strong {
      font-weight: 600;
      color: #252a34;
    }

    .badge-tag {
      font-size: 12px;
      font-weight: 600;
      text-transform: none; /* normal capitalized, not uppercase */
      padding: 4px 12px;
      border-radius: 999px; /* rounded pill shape */
      letter-spacing: normal;
      border: none;
      display: inline-flex;
      align-items: center;
    }

    .program-tag {
      background: #eef2ff; /* solid light lavender background from image 2 */
      color: #10069f;      /* deep indigo text from image 2 */
    }

    .project-tag {
      background: #E6ECF8; /* solid very light gray-blue background */
      color: #244980;      /* blue text */
    }

    .stage-span {
      color: #555555;
      font-size: 12px;
    }

    .trend-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 9.5px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none; /* remove outline from profile icon of Manager */
    }

    .manager-name, .owner-name {
      font-size: 13px;
      color: #252a34;
      white-space: nowrap;
    }

    .date-col, .budget-col {
      color: #555555;
      white-space: nowrap;
    }

    .pm-project-table th:last-child,
    .pm-project-table td:last-child {
      padding-right: 64px !important; /* Prevent overlap with chatbot bubble icon */
    }

    /* Child rows styling */
    .project-child-row {
      background: #f8fafc !important;
    }

    .indented-col {
      padding-left: 24px !important;
    }

    .corner-arrow {
      color: #707788;
      font-size: 14px;
    }

    .project-name-span {
      color: #252a34;
      font-size: 13px;
    }

    .standalone-row {
      border-top: 1.5px solid #edf0f6 !important;
      background: #ffffff;
    }

    /* Keep register columns spacious; allow horizontal scroll on narrower screens. */
    .pm-project-table {
      width: 100% !important;
      min-width: 1680px !important;
      table-layout: fixed;
    }

    .pm-project-table th:nth-child(1) { width: 34% !important; }
    .pm-project-table th:nth-child(2) { width: 16% !important; }
    .pm-project-table th:nth-child(3) { width: 18% !important; }
    .pm-project-table th:nth-child(4) { width: 11% !important; }
    .pm-project-table th:nth-child(5) { width: 11% !important; }
    .pm-project-table th:nth-child(6) { width: 10% !important; }

    .pm-project-table td:nth-child(3),
    .pm-project-table td:nth-child(4),
    .pm-project-table td:nth-child(5),
    .pm-project-table td:nth-child(6) {
      white-space: nowrap;
    }

    /* Risk / Benefit styling modifications */
    .description-text {
      color: #555555;
      line-height: 1.4;
      font-size: 13px;
    }

    .risk-id-badge {
      font-family: monospace;
      font-weight: 600;
      background: #f4f5f7;
      padding: 2px 6px;
      border-radius: 4px;
      color: #5e6c84;
      border: 1px solid rgba(94, 108, 132, 0.15);
    }

    .risk-rating-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.03em;
      display: inline-block;
    }

    .baseline-col, .target-col {
      color: #555555;
    }

    .status-pill {
      align-items: center;
      border: 1px solid transparent;
      border-radius: 999px;
      display: inline-flex;
      font-size: 11px;
      font-weight: 600;
      height: 22px;
      justify-content: center;
      padding: 0 10px;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .status-pill.on-track {
      background: #e8f7ee;
      border-color: rgba(22, 161, 95, 0.2);
      color: #16a15f;
    }
    .status-pill.critical {
      background: #fff0f0;
      border-color: rgba(222, 53, 11, 0.2);
      color: #de350b;
    }
    .status-pill.needs-attention {
      background: #fff5e6;
      border-color: rgba(217, 119, 6, 0.2);
      color: #d97706;
    }
    .status-pill.review-needed {
      background: #eef2ff;
      border-color: rgba(16, 6, 159, 0.15);
      color: #10069f;
    }
    /* Animations */
    .animation-slide {
      animation: slideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(8px); }
      to { opacity: 1; transform: translateX(0); }
    }



    .settings-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0 !important;
    }

    .program-id-alert-wrapper {
      align-items: center;
      display: flex;
      gap: 6px;
    }

    /* Needs Review indicator & legend styles */
    .review-legend {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #eef2ff;
      border: 1px solid rgba(16, 6, 159, 0.15);
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 12px;
      font-weight: 600;
      color: #10069f;
      margin-right: 6px;
    }

    .review-legend-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .review-legend-icon ::ng-deep .icon {
      width: 14px !important;
      height: 14px !important;
      stroke-width: 2.5px !important;
      color: #10069f !important;
    }

    .review-needed-alert {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #de350b;
      cursor: help;
    }
    
    .review-needed-alert ::ng-deep .icon {
      width: 12px !important;
      height: 12px !important;
      stroke-width: 2.5px !important;
      color: #de350b !important;
    }

    @media (max-width: 900px) {
      .portfolio-register-nav {
        padding: 0 16px;
      }

      .portfolio-register-tab-list {
        gap: 24px;
      }

      .portfolio-register-tab-list button {
        font-size: 12px;
      }
    }
  `]
})
export class PortfolioWorkspaceRegistersComponent {
  readonly registerSubTabs = registerSubTabs;
  readonly createMenuOptions = createMenuOptions;
  readonly portfolioOptions = portfolioOptions;

  activeSubTab: SubTab = 'projects';
  expandedProgramIds = new Set<string>(); // default closed by default
  searchQuery = '';
  statusFilter: string | null = null;
  showSearch = false; // toggleable search bar
  createDrawerKind: PortfolioRegisterCreateKind | null = null;

  programs: ProgramRow[] = portfolioProgramRows.map((program) => ({
    ...program,
    projects: program.projects ? [...program.projects] : undefined,
  }));
  standaloneList: ProgramRow[] = standaloneProjects.map((project) => ({ ...project }));
  riskData: Risk[] = riskRegisterData;
  benefits: Benefit[] = benefitsRegisterData;
  issues: Issue[] = issuesRegisterData;

  openCreateDrawer(option: PmConsoleCreateMenuOption): void {
    if (!this.isCreateKind(option.id)) return;
    this.createDrawerKind = option.id;
  }

  closeCreateDrawer(): void {
    this.createDrawerKind = null;
  }

  addProgramFromDrawer(payload: PortfolioProgramCreatePayload): void {
    const program = this.createProgramRow(payload);
    this.programs = [program, ...this.programs];
    this.closeCreateDrawer();
  }

  addProjectFromDrawer(payload: PortfolioProjectCreatePayload): void {
    const selectedProgram = this.programs.find((program) => program.id === payload.programId);
    if (!selectedProgram) {
      this.standaloneList = [this.createStandaloneProjectRow(payload), ...this.standaloneList];
      this.closeCreateDrawer();
      return;
    }

    const project = this.createProjectRow(payload, selectedProgram);
    this.programs = this.programs.map((program) => {
      if (program.id !== selectedProgram.id) return program;
      return {
        ...program,
        projects: [project, ...(program.projects || [])],
      };
    });
    const nextExpandedProgramIds = new Set(this.expandedProgramIds);
    nextExpandedProgramIds.add(selectedProgram.id);
    this.expandedProgramIds = nextExpandedProgramIds;
    this.closeCreateDrawer();
  }

  addRisk(risk: Risk): void {
    this.riskData = [...this.riskData, risk];
  }

  deleteRisk(riskId: string): void {
    this.riskData = this.riskData.filter((risk) => risk.id !== riskId);
  }

  addIssue(issue: Issue): void {
    this.issues = [...this.issues, issue];
  }

  getRowStatusLabel(id: string, defaultStatus: string): string {
    // The first three top-level rows visible are 'prog-1', 'prog-2', 'prog-3'
    if (id === 'prog-1' || id === 'prog-2' || id === 'prog-3') {
      return 'Review Needed';
    }
    switch (defaultStatus) {
      case 'on-track':
      case 'completed':
        return 'On Track';
      case 'off-track':
      case 'delayed':
        return 'Critical';
      case 'alert':
      case 'not-started':
        return 'Needs Attention';
      case 'under-review':
        return 'Review Needed';
      default:
        return 'On Track';
    }
  }

  getRowStatusClass(id: string, defaultStatus: string): string {
    const label = this.getRowStatusLabel(id, defaultStatus);
    switch (label) {
      case 'On Track':
        return 'on-track';
      case 'Critical':
        return 'critical';
      case 'Needs Attention':
        return 'needs-attention';
      case 'Review Needed':
        return 'review-needed';
      default:
        return 'on-track';
    }
  }

  setSubTab(tab: SubTab): void {
    this.activeSubTab = tab;
  }

  isExpanded(id: string): boolean {
    return this.expandedProgramIds.has(id);
  }

  toggleProgram(id: string): void {
    if (this.expandedProgramIds.has(id)) {
      this.expandedProgramIds.delete(id);
    } else {
      this.expandedProgramIds.add(id);
    }
  }

  filterStatus(status: string | null): void {
    this.statusFilter = status;
  }

  onSearch(): void {
    // Component search query handled reactively in getter below
  }

  private createManagerOptions(): readonly string[] {
    const names = new Set<string>();
    for (const program of this.programs) {
      if (program.manager && program.manager !== unassignedManager) names.add(program.manager);
      for (const project of program.projects || []) {
        if (project.manager && project.manager !== unassignedManager) names.add(project.manager);
      }
    }
    for (const project of this.standaloneList) {
      if (project.manager && project.manager !== unassignedManager) names.add(project.manager);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }

  get managerOptions(): readonly string[] {
    return this.createManagerOptions();
  }

  get programSelectOptions(): readonly PmConsoleFieldOption[] {
    return this.programs.map((program) => ({
      value: program.id,
      label: program.name,
    }));
  }

  private isCreateKind(id: string): id is PortfolioRegisterCreateKind {
    return id === 'program' || id === 'project';
  }

  private createProgramRow(payload: PortfolioProgramCreatePayload): ProgramRow {
    return {
      id: this.nextProgramId(),
      name: payload.name,
      stage: 'Initiation',
      trend: 'stable',
      manager: payload.manager || unassignedManager,
      relatedPortfolio: payload.relatedPortfolio,
      startDate: this.isoDateWithOffset(0),
      endDate: this.isoDateWithOffset(365),
      budgetUtilised: '$0 / $0',
      status: 'not-started',
      isProgram: true,
      projects: [],
    };
  }

  private createStandaloneProjectRow(payload: PortfolioProjectCreatePayload): ProgramRow {
    return {
      id: this.nextStandaloneProjectId(),
      name: payload.name,
      stage: payload.complete ? 'Planning' : 'Initiation',
      trend: 'stable',
      manager: payload.manager || unassignedManager,
      relatedPortfolio: this.portfolioOptions[0],
      startDate: this.isoDateWithOffset(0),
      endDate: this.isoDateWithOffset(90),
      budgetUtilised: '$0 / $0',
      status: payload.complete ? 'under-review' : 'not-started',
      isProgram: false,
    };
  }

  private createProjectRow(payload: PortfolioProjectCreatePayload, program: ProgramRow): ProjectRow {
    return {
      id: this.nextProjectId(program),
      name: payload.name,
      stage: payload.complete ? 'Planning' : 'Initiation',
      trend: 'stable',
      manager: payload.manager || unassignedManager,
      startDate: this.isoDateWithOffset(0),
      endDate: this.isoDateWithOffset(90),
      budgetUtilised: '$0 / $0',
      status: payload.complete ? 'under-review' : 'not-started',
    };
  }

  private nextProgramId(): string {
    return `prog-${this.nextNumericId(this.programs, /^prog-(\d+)$/)}`;
  }

  private nextStandaloneProjectId(): string {
    return `sa-proj-${this.nextNumericId(this.standaloneList, /^sa-proj-(\d+)$/)}`;
  }

  private nextProjectId(program: ProgramRow): string {
    const programNumber = program.id.match(/^prog-(\d+)$/)?.[1] || '0';
    return `proj-${programNumber}-${this.nextNumericId(program.projects || [], /^proj-\d+-(\d+)$/)}`;
  }

  private nextNumericId(rows: readonly { readonly id: string }[], pattern: RegExp): number {
    return rows.reduce((next, row) => {
      const match = row.id.match(pattern);
      if (!match) return next;
      return Math.max(next, Number(match[1]) + 1);
    }, 1);
  }

  private isoDateWithOffset(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  private displayIdPart(value: string | undefined): string {
    return (value || '0').padStart(2, '0');
  }



  getProgramDisplayId(id: string): string {
    if (id.startsWith('prog-')) {
      const num = this.displayIdPart(id.split('-')[1]);
      return `ATRC-${num}`;
    }
    if (id.startsWith('sa-proj-')) {
      const num = this.displayIdPart(id.split('-')[2]);
      return `ATRC-SA-${num}`;
    }
    if (id.startsWith('proj-')) {
      // e.g. proj-1-1 -> ATRC-01-01
      const parts = id.split('-');
      return `ATRC-${this.displayIdPart(parts[1])}-${this.displayIdPart(parts[2])}`;
    }
    return id.toUpperCase();
  }

  getThreePeriodTrend(id: string): readonly PmConsoleStatusTrendInput[] {
    const trendMap: Record<string, readonly PmConsoleStatusTrendInput[]> = {
      'prog-1': ['check', 'bell', 'bell'],
      'proj-1-1': ['check', 'check', 'bell'],
      'proj-1-2': ['check', 'check', 'check'],
      
      'prog-2': ['bell', 'cross', 'bell'],
      'proj-2-1': ['bell', 'cross', 'cross'],
      'proj-2-2': ['bell', 'bell', 'check'],
      
      'prog-3': ['check', 'check', 'check'],
      'proj-3-1': ['check', 'check', 'check'],
      'proj-3-2': ['check', 'check', 'bell'],
      
      'prog-4': ['bell', 'cross', 'check'],
      'proj-4-1': ['cross', 'cross', 'bell'],
      'proj-4-2': ['bell', 'cross', 'check'],
      
      'prog-5': ['bell', 'cross', 'check'],
      'proj-5-1': ['bell', 'cross', 'check'],
      
      'prog-6': ['check', 'check', 'bell'],
      'proj-6-1': ['check', 'check', 'check'],
      'proj-6-2': ['check', 'bell', 'bell'],
      
      'prog-7': ['check', 'bell', 'cross'],
      'proj-7-1': ['check', 'bell', 'bell'],
      
      'prog-8': ['check', 'check', 'check'],
      'proj-8-1': ['check', 'check', 'check'],
      'proj-8-2': ['check', 'check', 'bell'],
      
      'sa-proj-1': ['check', 'check', 'check'],
      'sa-proj-2': ['bell', 'bell', 'check'],
      'sa-proj-3': ['check', 'check', 'check'],
      'sa-proj-4': ['bell', 'bell', 'check']
    };
    return trendMap[id] || ['check', 'check', 'check'];
  }

  get filteredPrograms(): ProgramRow[] {
    let list = this.programs;
    if (this.statusFilter) {
      list = list.filter(p => p.status === this.statusFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.manager.toLowerCase().includes(q));
    }
    return list;
  }

  get allProgramsCount(): number {
    return this.programs.length;
  }

  get onTrackCount(): number {
    return this.programs.filter(p => p.status === 'on-track').length;
  }

  get offTrackCount(): number {
    return this.programs.filter(p => p.status === 'off-track').length;
  }

  get alertCount(): number {
    return this.programs.filter(p => p.status === 'alert').length;
  }

  get notStartedCount(): number {
    return this.programs.filter(p => p.status === 'not-started').length;
  }

  get totalRowsCount(): number {
    return this.filteredPrograms.length + this.standaloneList.length;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  statusTone(status: string): string {
    switch (status.toLowerCase()) {
      case 'on-track':
      case 'completed':
        return 'emerald';
      case 'under-review':
      case 'under review':
      case 'draft':
      case 'pending approval':
        return 'amber';
      case 'alert':
      case 'delayed':
      case 'off-track':
        return 'red';
      default:
        return 'neutral';
    }
  }

  getManagerAvatarStyles(name: string): { [key: string]: string } {
    const palettes = [
      { bg: '#FFF8EA', color: '#b45309' },      // Cream / Orange-Brown text
      { bg: '#E6ECF8', color: '#244980' },      // Gray-Blue / Deep Blue text
      { bg: '#DFDFEE', color: '#4f46e5' }       // Purple-Gray / Indigo text
    ];
    if (!name) return { background: palettes[0].bg, color: palettes[0].color };
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % palettes.length;
    return {
      background: palettes[index].bg,
      color: palettes[index].color
    };
  }

  getBudgetParts(budgetStr: string): { bold: string; normal: string } {
    if (!budgetStr) return { bold: '', normal: '' };
    const parts = budgetStr.split('/');
    if (parts.length >= 2) {
      return { bold: parts[0].trim(), normal: ' / ' + parts[1].trim() };
    }
    return { bold: budgetStr, normal: '' };
  }

  truncateName(name: string, limit: number = 30): string {
    if (!name) return '';
    return name.length > limit ? name.substring(0, limit) + '...' : name;
  }
}
