import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PortfolioManagerStatusTrendComponent, type PortfolioManagerStatusTrendInput } from '../portfolio-manager-status-trend.component';
import { PmConsolePlanEmptyStateComponent } from '../pm-console-plan-empty-state.component';
import {
  portfolioProgramRows,
  standaloneProjects,
  riskRegisterData,
  benefitsRegisterData,
  ProgramRow,
  Risk,
  Benefit
} from './portfolio-workspace.data';
import { PortfolioWorkspaceRiskRegisterComponent } from './portfolio-workspace-risk-register.component';
import { PortfolioWorkspaceBenefitsRegisterComponent } from './portfolio-workspace-benefits-register.component';

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

@Component({
  selector: 'app-portfolio-workspace-registers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PortfolioManagerStatusTrendComponent,
    PmConsolePlanEmptyStateComponent,
    PortfolioWorkspaceRiskRegisterComponent,
    PortfolioWorkspaceBenefitsRegisterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-registers-tab">
      <div class="portfolio-register-shell" [class.without-register-nav]="!showRegisterTabs">
        @if (showRegisterTabs) {
          <aside class="portfolio-register-nav project-plan-sections plan-builder-nav quick-plan-nav matrix-plan-nav" aria-label="Register sections">
            <div class="matrix-nav-scroll">
              <div class="matrix-nav-group">
                <div class="matrix-nav-list" role="tablist" aria-label="Portfolio registers">
                  @for (tab of registerSubTabs; track tab.id) {
                    <button
                      [class.active]="activeSubTab === tab.id"
                      type="button"
                      role="tab"
                      [attr.aria-selected]="activeSubTab === tab.id"
                      (click)="setSubTab(tab.id)"
                    >
                      <span class="matrix-nav-item-label">{{ tab.label }}</span>
                    </button>
                  }
                </div>
              </div>
            </div>
          </aside>
        }

        <main class="portfolio-register-panel">
          @switch (activeSubTab) {
            @case ('projects') {
              <div class="tab-content-container animation-slide">

            <div class="register-toolbar">
              <div class="toolbar-left" style="display: flex; align-items: center; gap: 12px;">
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
              
              <div class="toolbar-right" style="display: flex; align-items: center; gap: 10px; margin-left: auto;">
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

                <!-- Create Dropdown Container -->
                <div class="create-dropdown-container" style="position: relative; display: inline-block;">
                  <button class="tb-btn primary-tb" type="button" (click)="toggleCreateDropdown($event)" style="display: inline-flex; align-items: center; gap: 6px;">
                    <span [pmConsoleIcon]="'plus'"></span>
                    <span>Add new</span>
                  </button>
                  @if (showCreateDropdown) {
                    <div class="create-dropdown-menu" style="position: absolute; right: 0; top: 100%; margin-top: 6px; background: white; border: 1px solid #edf0f6; border-radius: 10px; box-shadow: 0 10px 25px rgba(25, 33, 61, 0.12); width: 150px; z-index: 100; padding: 6px; display: flex; flex-direction: column; gap: 4px;">
                      <button class="dropdown-item" type="button" (click)="onCreateOption('New Project')" style="background: transparent; border: none; padding: 8px 12px; font-size: 13px; font-weight: 500; color: #252a34; text-align: left; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; width: 100%; transition: background-color 0.15s ease;">
                        <span [pmConsoleIcon]="'folder'" style="font-size: 14px; color: #707788;"></span>
                        <span>New Project</span>
                      </button>
                      <button class="dropdown-item" type="button" (click)="onCreateOption('New Program')" style="background: transparent; border: none; padding: 8px 12px; font-size: 13px; font-weight: 500; color: #252a34; text-align: left; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; width: 100%; transition: background-color 0.15s ease;">
                        <span [pmConsoleIcon]="'layers'" style="font-size: 14px; color: #707788;"></span>
                        <span>New Program</span>
                      </button>
                    </div>
                  }
                </div>

                <button class="tb-btn settings-btn" type="button" aria-label="Settings" style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; padding: 0;">
                  <span [pmConsoleIcon]="'settings'"></span>
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="pm-project-table-scroll">
              <table class="pm-project-table">
                <thead>
                  <tr>
                    <th style="width: 28%">Program / Project Name</th>
                    <th style="width: 16%">Manager</th>
                    <th style="width: 20%">Status Trend</th>
                    <th style="width: 12%">Start Date</th>
                    <th style="width: 12%">End Date</th>
                    <th style="width: 12%">Budget Utilised</th>
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
                            <div class="program-id-alert-wrapper" style="display: flex; align-items: center; gap: 6px;">
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
                        <app-portfolio-manager-status-trend [tones]="getThreePeriodTrend(prog.id)" [ariaLabel]="prog.name + ' report status trend'"></app-portfolio-manager-status-trend>
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
                            <app-portfolio-manager-status-trend [tones]="getThreePeriodTrend(proj.id)" [ariaLabel]="proj.name + ' report status trend'"></app-portfolio-manager-status-trend>
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
                        <app-portfolio-manager-status-trend [tones]="getThreePeriodTrend(sa.id)" [ariaLabel]="sa.name + ' report status trend'"></app-portfolio-manager-status-trend>
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
                />
              </div>
            }

            @case ('issues') {
              <div class="tab-content-container animation-slide">
                <div class="portfolio-issues-empty">
                  <app-pm-console-plan-empty-state
                    title="Issues register"
                    description="Track portfolio, program, and project issues that need active resolution."
                    countLabel="0 issues"
                    actionLabel="Add issue"
                    actionAriaLabel="Add issue"
                    iconName="issues"
                    emptyTitle="No issues logged yet"
                    emptyBody="Open blockers, dependency problems, and unresolved decisions will appear here once they are added to the portfolio workspace."
                  />
                </div>
              </div>
            }
          }
        </main>
      </div>
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
      background: #f7f7fc;
      display: grid;
      flex: 1;
      grid-template-columns: 252px minmax(0, 1fr);
      min-height: 0;
      overflow: hidden;
    }

    .portfolio-register-shell.without-register-nav {
      grid-template-columns: minmax(0, 1fr);
    }

    .portfolio-register-nav {
      min-height: 0;
    }

    .portfolio-register-nav.plan-builder-nav.quick-plan-nav.matrix-plan-nav {
      width: auto;
    }

    .portfolio-register-nav.plan-builder-nav.quick-plan-nav.matrix-plan-nav .matrix-nav-list {
      gap: 10px;
    }

    .portfolio-register-nav.plan-builder-nav.quick-plan-nav.matrix-plan-nav .matrix-nav-list button:focus {
      outline: none;
    }

    .portfolio-register-nav.plan-builder-nav.quick-plan-nav.matrix-plan-nav .matrix-nav-list button:focus-visible {
      box-shadow: 0 0 0 2px rgba(16, 6, 159, 0.18);
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
      gap: 8px;
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
      padding: 6px 0;
      margin-bottom: 4px;
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
      gap: 16px;
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
      gap: 10px;
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
    .create-dropdown-menu .dropdown-item:hover {
      background-color: #f4f5f7 !important;
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
      .portfolio-register-shell {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto minmax(0, 1fr);
      }

      .portfolio-register-nav.plan-builder-nav.quick-plan-nav.matrix-plan-nav {
        border-bottom: 1px solid #dddddd;
        border-right: 0;
        width: 100%;
      }
    }
  `]
})
export class PortfolioWorkspaceRegistersComponent {
  @Input() showRegisterTabs = true;

  readonly registerSubTabs = registerSubTabs;
  activeSubTab: SubTab = 'projects';
  expandedProgramIds = new Set<string>(); // default closed by default
  searchQuery = '';
  statusFilter: string | null = null;
  showSearch = false; // toggleable search bar
  showCreateDropdown = false;

  programs = portfolioProgramRows;
  standaloneList = standaloneProjects;
  riskData: Risk[] = riskRegisterData;
  benefits: Benefit[] = benefitsRegisterData;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showCreateDropdown = false;
  }

  toggleCreateDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showCreateDropdown = !this.showCreateDropdown;
  }

  onCreateOption(option: string): void {
    console.log('Selected option:', option);
    this.showCreateDropdown = false;
  }

  addRisk(risk: Risk): void {
    this.riskData = [...this.riskData, risk];
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



  getProgramDisplayId(id: string): string {
    if (id.startsWith('prog-')) {
      const num = id.split('-')[1];
      return `ATRC-0${num}`;
    }
    if (id.startsWith('sa-proj-')) {
      const num = id.split('-')[2];
      return `ATRC-SA-0${num}`;
    }
    if (id.startsWith('proj-')) {
      // e.g. proj-1-1 -> ATRC-01-01
      const parts = id.split('-');
      return `ATRC-0${parts[1]}-0${parts[2]}`;
    }
    return id.toUpperCase();
  }

  getThreePeriodTrend(id: string): readonly PortfolioManagerStatusTrendInput[] {
    const trendMap: Record<string, readonly PortfolioManagerStatusTrendInput[]> = {
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
