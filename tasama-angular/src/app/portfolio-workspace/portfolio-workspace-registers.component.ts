import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import type { PortfolioManagerStatusTrendInput } from '../portfolio-manager-status-trend.component';
import {
  PmConsoleRegisterTableComponent,
  type PmConsoleRegisterTableCell,
  type PmConsoleRegisterTableColumn,
  type PmConsoleRegisterTableRow,
  type PmConsoleRegisterTableTrendItem,
} from '../shared/pm-console-register-table.component';
import {
  portfolioRows,
  portfolioProgramRows,
  standaloneProjects,
  riskRegisterData,
  benefitsRegisterData,
  PortfolioRow,
  ProgramRow,
  ProjectRow,
  Risk,
  Benefit
} from './portfolio-workspace.data';
import { PortfolioWorkspaceRiskRegisterComponent } from './portfolio-workspace-risk-register.component';
import { PortfolioWorkspaceBenefitsRegisterComponent } from './portfolio-workspace-benefits-register.component';

type SubTab = 'projects' | 'risks' | 'benefits';

@Component({
  selector: 'app-portfolio-workspace-registers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PmConsoleRegisterTableComponent,
    PortfolioWorkspaceRiskRegisterComponent,
    PortfolioWorkspaceBenefitsRegisterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-registers-tab">

      @if (showRegisterTabs) {
        <div class="sub-tabs">
          <button
            class="pm-register-tab"
            [class.is-active]="activeSubTab === 'projects'"
            type="button"
            (click)="setSubTab('projects')"
          >
            <span>Program & Project Register</span>
          </button>
          <button
            class="pm-register-tab"
            [class.is-active]="activeSubTab === 'risks'"
            type="button"
            (click)="setSubTab('risks')"
          >
            <span>Risk Register</span>
          </button>
          <button
            class="pm-register-tab"
            [class.is-active]="activeSubTab === 'benefits'"
            type="button"
            (click)="setSubTab('benefits')"
          >
            <span>Benefits Register</span>
          </button>
          <button
            class="pm-register-tab"
            type="button"
            [disabled]="true"
          >
            <span>Issues Register</span>
          </button>
        </div>
      }

      <!-- Tab Outlet -->
      @switch (activeSubTab) {

        <!-- PROJECT REGISTER -->
	        @case ('projects') {
	          <div class="tab-content-container animation-slide">
	            <app-pm-console-register-table
	              class="portfolio-register-table"
	              [columns]="portfolioRegisterColumns"
	              [rows]="portfolioRegisterRows"
	              storageKey="tasama.portfolioRegister.visibleColumns.v1"
	              ariaLabel="Portfolio register"
	              itemName="portfolio register rows"
	              [showItemLabel]="false"
	              [selectable]="false"
	              searchVariant="workspace"
	              searchPlaceholder="Search portfolios..."
	              searchAriaLabel="Search portfolio register"
	              toolbarClass="pm-workspace-register-toolbar portfolio-register-toolbar"
	              [showGroupBy]="false"
	              [showFilter]="true"
	              [showExport]="true"
	              emptyTitle="No portfolio register rows"
	              emptyDescription="Try a different search or filter."
	              (rowOpen)="openPortfolioRegisterRow($event)"
	            >
	              <span registerTableToolbarLabel class="portfolio-register-summary" aria-label="Portfolio register summary">
	                <span class="summary-pill active">
	                  <span class="pill-label">Portfolios</span>
	                  <span class="pill-badge-circle">{{ portfolios.length }}</span>
	                </span>
	                <span class="summary-pill inactive">
	                  <span class="pill-label">Standalone Project Groups</span>
	                  <span class="pill-badge-circle">{{ standaloneProjectGroupCount }}</span>
	                </span>
	              </span>

	              <span registerTableToolbarActions class="create-dropdown-container">
	                <button class="pm-table-add-project" type="button" (click)="toggleCreateDropdown($event)">
	                  <span pmConsoleIcon="plus" aria-hidden="true"></span>
	                  <span>Add new</span>
	                </button>
	                @if (showCreateDropdown) {
	                  <span class="create-dropdown-menu">
	                    <button class="dropdown-item" type="button" (click)="onCreateOption('New Portfolio')">
	                      <span pmConsoleIcon="briefcase" aria-hidden="true"></span>
	                      <span>New Portfolio</span>
	                    </button>
	                    <button class="dropdown-item" type="button" (click)="onCreateOption('New Program')">
	                      <span pmConsoleIcon="layers" aria-hidden="true"></span>
	                      <span>New Program</span>
	                    </button>
	                    <button class="dropdown-item" type="button" (click)="onCreateOption('New Project')">
	                      <span pmConsoleIcon="folder" aria-hidden="true"></span>
	                      <span>New Project</span>
	                    </button>
	                  </span>
	                }
	              </span>
	            </app-pm-console-register-table>
	          </div>
	        }

        <!-- RISK REGISTER -->
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

        <!-- BENEFITS REGISTER -->
        @case ('benefits') {
          <div class="tab-content-container animation-slide">
            <app-portfolio-workspace-benefits-register [benefits]="benefits" />
          </div>
        }
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
      padding: 4px 0 0;
      animation: fadeIn 0.3s ease-out;
    }

    /* Sub-tabs styling */
    .sub-tabs {
      position: sticky;
      top: -10px;
      z-index: 12;
      background: #ffffff;
      border-bottom: 1px solid #edf0f6;
      margin-bottom: 4px;
      display: flex;
      gap: 24px;
    }

    .sub-tabs .pm-register-tab {
      background: transparent;
      border: none;
      padding: 10px 4px 8px 4px;
      font-size: 13.5px;
      font-weight: 500;
      color: #707788;
      cursor: pointer;
      position: relative;
      transition: color 0.2s ease;
    }

    .sub-tabs .pm-register-tab:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .sub-tabs .pm-register-tab::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
      transition: background-color 0.2s ease;
    }

    .sub-tabs .pm-register-tab.is-active {
      color: var(--brand, #007aff);
      font-weight: 600;
    }

    .sub-tabs .pm-register-tab.is-active::after {
      background: var(--brand, #007aff);
    }

	    .tab-content-container {
	      display: flex;
	      flex-direction: column;
	      gap: 8px;
	      flex: 1;
	      min-height: 0;
	      overflow: hidden;
	    }

	    .portfolio-register-table {
	      display: block;
	      flex: 1 1 auto;
	      min-height: 0;
	    }

	    .portfolio-register-summary {
	      align-items: center;
	      display: inline-flex;
	      gap: 12px;
	      min-width: 0;
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

	    .create-dropdown-container {
	      display: inline-flex;
	      position: relative;
	    }

	    .create-dropdown-menu {
	      background: #ffffff;
	      border: 1px solid #edf0f6;
	      border-radius: 10px;
	      box-shadow: 0 10px 25px rgba(25, 33, 61, 0.12);
	      display: flex;
	      flex-direction: column;
	      gap: 4px;
	      margin-top: 6px;
	      padding: 6px;
	      position: absolute;
	      right: 0;
	      top: 100%;
	      width: 172px;
	      z-index: 100;
	    }

	    .create-dropdown-menu .dropdown-item {
	      align-items: center;
	      background: transparent;
	      border: 0;
	      border-radius: 6px;
	      color: #252a34;
	      cursor: pointer;
	      display: flex;
	      font-size: 13px;
	      font-weight: 500;
	      gap: 8px;
	      padding: 8px 12px;
	      text-align: left;
	      width: 100%;
	    }

	    .create-dropdown-menu .dropdown-item .icon {
	      color: #707788;
	      height: 14px;
	      width: 14px;
	    }

	    .pm-project-table-scroll {
      flex: 1;
      overflow: auto;
      min-height: 0;
      border: 1px solid #e3e5e9;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
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

    .portfolio-row,
    .program-row,
    .standalone-group-row {
      transition: background-color 0.15s ease;
    }

    .portfolio-row,
    .standalone-group-row {
      background: #ffffff;
    }

    .portfolio-row.is-expanded,
    .program-row.is-expanded,
    .standalone-group-row.is-expanded {
      background: rgba(16, 6, 159, 0.025) !important;
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

    .portfolio-tag {
      background: #e5f4ef;
      color: #0f6b57;
    }

    .program-tag {
      background: #eef2ff;
      color: #10069f;
    }

    .project-tag {
      background: #fff3dc;
      color: #975a16;
    }

    .standalone-group-tag {
      background: #eef1f5;
      color: #4b5565;
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
    }

    .date-col, .budget-col {
      color: #555555;
    }

    .pm-project-table th:last-child,
    .pm-project-table td:last-child {
      padding-right: 64px !important; /* Prevent overlap with chatbot bubble icon */
    }

    /* Child rows styling */
    .program-child-row {
      background: #fbfcff !important;
    }

    .project-child-row {
      background: #f8fafc !important;
    }

    .nested-level-one {
      padding-left: 28px !important;
    }

    .nested-level-two,
    .nested-standalone-project {
      padding-left: 56px !important;
    }

    .corner-arrow {
      color: #707788;
      font-size: 14px;
    }

    .project-name-span {
      color: #252a34;
      font-size: 13px;
    }

    .standalone-group-row {
      border-top: 1.5px solid #edf0f6 !important;
      background: #ffffff;
    }

    .standalone-row {
      background: #fbfcfe;
    }

    /* Table extension to edge */
    .pm-project-table {
      min-width: 980px !important;
      table-layout: fixed;
      width: 100% !important;
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
      font-weight: 600;
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
  `]
})
export class PortfolioWorkspaceRegistersComponent {
  @Input() showRegisterTabs = true;

  activeSubTab: SubTab = 'projects';
  expandedPortfolioIds = new Set<string>();
  expandedProgramIds = new Set<string>(); // default closed by default
  standaloneGroupExpanded = false;
  searchQuery = '';
  statusFilter: string | null = null;
  showSearch = false; // toggleable search bar
  showCreateDropdown = false;

  portfolios: PortfolioRow[] = portfolioRows;
  programs = portfolioProgramRows;
  standaloneList = standaloneProjects;
  riskData: Risk[] = riskRegisterData;
  benefits: Benefit[] = benefitsRegisterData;
	  readonly standaloneProjectGroup = {
	    id: 'standalone-projects',
	    name: 'Standalone Projects',
	    manager: 'PMO Desk',
	    startDate: '2026-02-18',
	    endDate: '2027-02-28',
	    budgetUtilised: '$830K / $4.05M',
	  };
	  readonly portfolioRegisterColumns: PmConsoleRegisterTableColumn[] = [
	    { id: 'name', label: 'Portfolio / Program / Project Name', minWidth: 330, maxWidth: 440 },
	    { id: 'manager', label: 'Manager', minWidth: 180, maxWidth: 230 },
	    { id: 'statusTrend', label: 'Status Trend', minWidth: 286, maxWidth: 286 },
	    { id: 'startDate', label: 'Start Date', minWidth: 130, maxWidth: 160 },
	    { id: 'endDate', label: 'End Date', minWidth: 130, maxWidth: 160 },
	    { id: 'budget', label: 'Budget Utilised', minWidth: 150, maxWidth: 185, align: 'right' },
	  ];
	  private readonly trendPeriodLabels = ['Mar', 'Apr', 'May'];

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

	  get portfolioRegisterRows(): PmConsoleRegisterTableRow[] {
	    const rows: PmConsoleRegisterTableRow[] = [];

	    for (const portfolio of this.filteredPortfolios) {
	      rows.push(this.portfolioRegisterRowForPortfolio(portfolio));

	      if (this.isPortfolioExpanded(portfolio.id)) {
	        for (const program of portfolio.programs) {
	          rows.push(this.portfolioRegisterRowForProgram(program));

	          if (this.isExpanded(program.id)) {
	            for (const project of program.projects || []) {
	              rows.push(this.portfolioRegisterRowForProject(project, 2));
	            }
	          }
	        }
	      }
	    }

	    if (this.standaloneProjectGroupCount) {
	      rows.push(this.portfolioRegisterRowForStandaloneGroup());

	      if (this.standaloneGroupExpanded) {
	        for (const project of this.filteredStandaloneProjects) {
	          rows.push(this.portfolioRegisterRowForProject(project, 1));
	        }
	      }
	    }

	    return rows;
	  }

	  openPortfolioRegisterRow(row: PmConsoleRegisterTableRow): void {
	    if (row.id === this.standaloneProjectGroup.id) {
	      this.toggleStandaloneGroup();
	      return;
	    }

	    if (row.id.startsWith('portfolio-')) {
	      this.togglePortfolio(row.id);
	      return;
	    }

	    if (row.id.startsWith('prog-')) {
	      this.toggleProgram(row.id);
	    }
	  }

	  private portfolioRegisterRowForPortfolio(portfolio: PortfolioRow): PmConsoleRegisterTableRow {
	    return this.portfolioRegisterRowForItem({
	      id: portfolio.id,
	      name: portfolio.name,
	      manager: portfolio.manager,
	      startDate: portfolio.startDate,
	      endDate: portfolio.endDate,
	      budgetUtilised: portfolio.budgetUtilised,
	      tag: 'Portfolio',
	      tagTone: 'portfolio',
	      prefixIcon: this.isPortfolioExpanded(portfolio.id) ? 'chevron-down' : 'chevron-right',
	      clickable: true,
	      expanded: this.isPortfolioExpanded(portfolio.id),
	      alert: portfolio.status === 'alert' || portfolio.status === 'off-track',
	      ariaLabel: `${this.isPortfolioExpanded(portfolio.id) ? 'Collapse' : 'Expand'} ${portfolio.name} programs`,
	    });
	  }

	  private portfolioRegisterRowForProgram(program: ProgramRow): PmConsoleRegisterTableRow {
	    const isExpanded = this.isExpanded(program.id);
	    return this.portfolioRegisterRowForItem({
	      id: program.id,
	      name: program.name,
	      manager: program.manager,
	      startDate: program.startDate,
	      endDate: program.endDate,
	      budgetUtilised: program.budgetUtilised,
	      tag: 'Program',
	      tagTone: 'program',
	      prefixIcon: isExpanded ? 'chevron-down' : 'chevron-right',
	      indentLevel: 1,
	      clickable: Boolean(program.projects?.length),
	      expanded: isExpanded,
	      alert: program.id === 'prog-1' || program.id === 'prog-2',
	      ariaLabel: `${isExpanded ? 'Collapse' : 'Expand'} ${program.name} projects`,
	    });
	  }

	  private portfolioRegisterRowForProject(project: ProjectRow | ProgramRow, indentLevel: number): PmConsoleRegisterTableRow {
	    return this.portfolioRegisterRowForItem({
	      id: project.id,
	      name: project.name,
	      manager: project.manager,
	      startDate: project.startDate,
	      endDate: project.endDate,
	      budgetUtilised: project.budgetUtilised,
	      tag: 'Project',
	      tagTone: 'project',
	      prefixIcon: 'corner-down-right',
	      indentLevel,
	      clickable: false,
	      ariaLabel: project.name,
	    });
	  }

	  private portfolioRegisterRowForStandaloneGroup(): PmConsoleRegisterTableRow {
	    return this.portfolioRegisterRowForItem({
	      id: this.standaloneProjectGroup.id,
	      name: this.standaloneProjectGroup.name,
	      manager: this.standaloneProjectGroup.manager,
	      startDate: this.standaloneProjectGroup.startDate,
	      endDate: this.standaloneProjectGroup.endDate,
	      budgetUtilised: this.standaloneProjectGroup.budgetUtilised,
	      tag: 'Project Group',
	      tagTone: 'project-group',
	      prefixIcon: this.standaloneGroupExpanded ? 'chevron-down' : 'chevron-right',
	      clickable: true,
	      expanded: this.standaloneGroupExpanded,
	      ariaLabel: `${this.standaloneGroupExpanded ? 'Collapse' : 'Expand'} standalone projects`,
	    });
	  }

	  private portfolioRegisterRowForItem(item: {
	    id: string;
	    name: string;
	    manager: string;
	    startDate: string;
	    endDate: string;
	    budgetUtilised: string;
	    tag: string;
	    tagTone: string;
	    prefixIcon: string;
	    indentLevel?: number;
	    clickable: boolean;
	    expanded?: boolean;
	    alert?: boolean;
	    ariaLabel: string;
	  }): PmConsoleRegisterTableRow {
	    const budget = this.getBudgetParts(item.budgetUtilised);
	    const cells: Record<string, PmConsoleRegisterTableCell> = {
	      name: {
	        kind: 'primary',
	        title: item.name,
	        subtitle: this.getRegisterDisplayId(item.id),
	        prefixIcon: item.prefixIcon,
	        tag: item.tag,
	        tagTone: item.tagTone,
	        indentLevel: item.indentLevel,
	        alert: item.alert,
	        alertLabel: 'Needs attention',
	        ariaLabel: item.ariaLabel,
	      },
	      manager: {
	        kind: 'person',
	        title: item.manager,
	        initials: this.getInitials(item.manager),
	      },
	      statusTrend: {
	        kind: 'trend',
	        trend: this.trendItemsFor(item.id),
	      },
	      startDate: { kind: 'text', text: this.formatDate(item.startDate) },
	      endDate: { kind: 'text', text: this.formatDate(item.endDate) },
	      budget: { kind: 'budget', value: budget.bold, suffix: budget.normal },
	    };

	    return {
	      id: item.id,
	      ariaLabel: item.ariaLabel,
	      clickable: item.clickable,
	      expanded: item.expanded,
	      cells,
	    };
	  }

	  private trendItemsFor(id: string): readonly PmConsoleRegisterTableTrendItem[] {
	    return this.getThreePeriodTrend(id).map((trend, index) => {
	      const label = this.trendPeriodLabels[index] ?? `P${index + 1}`;
	      return {
	        label,
	        icon: this.trendIcon(trend),
	        tone: this.trendTone(trend),
	        ariaLabel: `${label}: ${this.trendAriaLabel(trend)}`,
	      };
	    });
	  }

	  private trendIcon(trend: PortfolioManagerStatusTrendInput): string {
	    if (trend === 'cross') return 'circle-x';
	    if (trend === 'bell') return 'triangle-alert';
	    return 'circle-check';
	  }

	  private trendTone(trend: PortfolioManagerStatusTrendInput): PmConsoleRegisterTableTrendItem['tone'] {
	    if (trend === 'cross') return 'danger';
	    if (trend === 'bell') return 'warning';
	    return 'success';
	  }

	  private trendAriaLabel(trend: PortfolioManagerStatusTrendInput): string {
	    if (trend === 'cross') return 'Off track';
	    if (trend === 'bell') return 'Alert';
	    return 'On track';
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

  isPortfolioExpanded(id: string): boolean {
    return this.expandedPortfolioIds.has(id);
  }

  togglePortfolio(id: string): void {
    if (this.expandedPortfolioIds.has(id)) {
      this.expandedPortfolioIds.delete(id);
    } else {
      this.expandedPortfolioIds.add(id);
    }
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

  toggleStandaloneGroup(): void {
    this.standaloneGroupExpanded = !this.standaloneGroupExpanded;
  }

  filterStatus(status: string | null): void {
    this.statusFilter = status;
  }

  onSearch(): void {
    // Component search query handled reactively in getter below
  }



  getRegisterDisplayId(id: string): string {
    if (id.startsWith('portfolio-')) {
      const num = id.split('-')[1];
      return `ATRC-PF-0${num}`;
    }
    if (id === 'standalone-projects') {
      return 'ATRC-SA';
    }
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
      'portfolio-1': ['check', 'check', 'bell'],
      'portfolio-2': ['check', 'bell', 'bell'],
      'standalone-projects': ['check', 'bell', 'check'],
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

  get filteredPortfolios(): PortfolioRow[] {
    let list = this.portfolios;
    if (this.statusFilter) {
      list = list.filter((portfolio) => portfolio.status === this.statusFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((portfolio) => this.portfolioSearchValue(portfolio).includes(q));
    }
    return list;
  }

  get filteredStandaloneProjects(): ProgramRow[] {
    if (!this.searchQuery) return this.standaloneList;
    const q = this.searchQuery.toLowerCase();
    return this.standaloneList.filter((project) => this.programSearchValue(project).includes(q));
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

  get standaloneProjectGroupCount(): number {
    return this.standaloneList.length ? 1 : 0;
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
    return this.filteredPortfolios.length + this.standaloneProjectGroupCount;
  }

  private portfolioSearchValue(portfolio: PortfolioRow): string {
    return [
      portfolio.name,
      portfolio.manager,
      portfolio.status,
      portfolio.programs.map((program: ProgramRow) => this.programSearchValue(program)).join(' '),
    ].join(' ').toLowerCase();
  }

  private programSearchValue(program: ProgramRow): string {
    return [
      program.name,
      program.manager,
      program.status,
      program.projects?.map((project) => [project.name, project.manager, project.status].join(' ')).join(' ') ?? '',
    ].join(' ').toLowerCase();
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
