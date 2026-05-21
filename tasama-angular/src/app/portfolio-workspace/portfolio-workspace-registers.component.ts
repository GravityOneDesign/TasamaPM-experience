import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import {
  portfolioProgramRows,
  standaloneProjects,
  riskRegisterData,
  benefitsRegisterData,
  ProgramRow,
  ProjectRow
} from './portfolio-workspace.data';

type SubTab = 'projects' | 'risks' | 'benefits';

@Component({
  selector: 'app-portfolio-workspace-registers',
  standalone: true,
  imports: [CommonModule, FormsModule, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-registers-tab">
      
      <!-- Sub-tab bar -->
      <div class="pm-register-tabs sub-tabs">
        <button
          class="pm-register-tab"
          [class.is-active]="activeSubTab === 'projects'"
          type="button"
          (click)="setSubTab('projects')"
        >
          <span>Project Register</span>
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
      </div>

      <!-- Tab Outlet -->
      @switch (activeSubTab) {
        
        <!-- PROJECT REGISTER -->
        @case ('projects') {
          <div class="tab-content-container animation-slide">
            <!-- Stats row -->
            <div class="stats-row">
              <article class="pm-project-table-stat cursor-pointer" (click)="filterStatus(null)">
                <span [pmConsoleIcon]="'layers'" class="stat-icon p-icon"></span>
                <div class="stat-meta">
                  <span class="stat-label">All Programs</span>
                  <strong class="stat-value">{{ allProgramsCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat cursor-pointer border-emerald" (click)="filterStatus('on-track')">
                <span [pmConsoleIcon]="'check-circle'" class="stat-icon text-success"></span>
                <div class="stat-meta">
                  <span class="stat-label">On-Track</span>
                  <strong class="stat-value text-success">{{ onTrackCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat cursor-pointer border-red" (click)="filterStatus('off-track')">
                <span [pmConsoleIcon]="'alert-triangle'" class="stat-icon text-danger"></span>
                <div class="stat-meta">
                  <span class="stat-label">Off-Track</span>
                  <strong class="stat-value text-danger">{{ offTrackCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat cursor-pointer border-amber" (click)="filterStatus('alert')">
                <span [pmConsoleIcon]="'shield-alert'" class="stat-icon text-warning"></span>
                <div class="stat-meta">
                  <span class="stat-label">Alert</span>
                  <strong class="stat-value text-warning">{{ alertCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat cursor-pointer border-grey" (click)="filterStatus('not-started')">
                <span [pmConsoleIcon]="'clock'" class="stat-icon text-muted"></span>
                <div class="stat-meta">
                  <span class="stat-label">Not Started</span>
                  <strong class="stat-value text-muted">{{ notStartedCount }}</strong>
                </div>
              </article>
            </div>

            <!-- Toolbar -->
            <div class="register-toolbar">
              <div class="toolbar-left">
                <span class="items-count">{{ totalRowsCount }} items found</span>
                <label class="search-box">
                  <span pmConsoleIcon="search" aria-hidden="true"></span>
                  <input type="search" placeholder="Search Programs..." [(ngModel)]="searchQuery" (input)="onSearch()" />
                </label>
              </div>
              <div class="toolbar-right">
                <button class="tb-btn" type="button" aria-label="Filter options">
                  <span [pmConsoleIcon]="'filter'"></span>
                  <span>Filter</span>
                </button>
                <button class="tb-btn primary-tb" type="button" aria-label="Export PDF">
                  <span [pmConsoleIcon]="'download-cloud'"></span>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="pm-project-table-view">
              <table class="program-register-table">
                <thead>
                  <tr>
                    <th style="width: 40px"><input type="checkbox" aria-label="Select all rows" /></th>
                    <th style="width: 40%">Program / Project Name</th>
                    <th style="width: 12%">Stage</th>
                    <th style="width: 12%">Status Trend</th>
                    <th style="width: 15%">Manager</th>
                    <th style="width: 15%">Start Date</th>
                    <th style="width: 12%">Budget Utilised</th>
                  </tr>
                </thead>
                <tbody>
                  @for (prog of filteredPrograms; track prog.id) {
                    <!-- Program Row -->
                    <tr class="program-row" [class.is-expanded]="isExpanded(prog.id)">
                      <td><input type="checkbox" aria-label="Select program" /></td>
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
                          <div class="title-meta">
                            <strong>{{ prog.name }}</strong>
                            <span class="badge-tag program-tag">Program</span>
                          </div>
                        </div>
                      </td>
                      <td><span class="stage-span">{{ prog.stage }}</span></td>
                      <td>
                        <div class="trend-wrapper">
                          <span [pmConsoleIcon]="trendIcon(prog.trend)" class="trend-icon" [class]="prog.trend"></span>
                          <span [pmConsoleStatusPill]="prog.status" baseClass="dependency-register-pill" [tone]="statusTone(prog.status)"></span>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle">{{ getInitials(prog.manager) }}</div>
                          <span class="manager-name">{{ prog.manager }}</span>
                        </div>
                      </td>
                      <td class="date-col">{{ formatDate(prog.startDate) }}</td>
                      <td class="budget-col">{{ prog.budgetUtilised }}</td>
                    </tr>

                    <!-- Child Project Rows -->
                    @if (isExpanded(prog.id) && prog.projects) {
                      @for (proj of prog.projects; track proj.id) {
                        <tr class="project-child-row animation-slide">
                          <td></td>
                          <td class="primary-col indented-col">
                            <div class="name-cell-wrapper">
                              <span [pmConsoleIcon]="'corner-down-right'" class="corner-arrow"></span>
                              <div class="title-meta">
                                <span class="project-name-span">{{ proj.name }}</span>
                                <span class="badge-tag project-tag">Project</span>
                              </div>
                            </div>
                          </td>
                          <td><span class="stage-span">{{ proj.stage }}</span></td>
                          <td>
                            <div class="trend-wrapper">
                              <span [pmConsoleIcon]="trendIcon(proj.trend)" class="trend-icon" [class]="proj.trend"></span>
                              <span [pmConsoleStatusPill]="proj.status" baseClass="dependency-register-pill" [tone]="statusTone(proj.status)"></span>
                            </div>
                          </td>
                          <td>
                            <div class="avatar-cell">
                              <div class="avatar-circle secondary-circle">{{ getInitials(proj.manager) }}</div>
                              <span class="manager-name">{{ proj.manager }}</span>
                            </div>
                          </td>
                          <td class="date-col">{{ formatDate(proj.startDate) }}</td>
                          <td class="budget-col">{{ proj.budgetUtilised }}</td>
                        </tr>
                      }
                    }
                  }

                  <!-- Standalone Projects -->
                  @for (sa of standaloneList; track sa.id) {
                    <tr class="program-row standalone-row">
                      <td><input type="checkbox" aria-label="Select standalone project" /></td>
                      <td class="primary-col">
                        <div class="name-cell-wrapper no-chevron">
                          <div class="title-meta">
                            <strong>{{ sa.name }}</strong>
                            <span class="badge-tag standalone-tag">Standalone</span>
                          </div>
                        </div>
                      </td>
                      <td><span class="stage-span">{{ sa.stage }}</span></td>
                      <td>
                        <div class="trend-wrapper">
                          <span [pmConsoleIcon]="trendIcon(sa.trend)" class="trend-icon" [class]="sa.trend"></span>
                          <span [pmConsoleStatusPill]="sa.status" baseClass="dependency-register-pill" [tone]="statusTone(sa.status)"></span>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle">{{ getInitials(sa.manager) }}</div>
                          <span class="manager-name">{{ sa.manager }}</span>
                        </div>
                      </td>
                      <td class="date-col">{{ formatDate(sa.startDate) }}</td>
                      <td class="budget-col">{{ sa.budgetUtilised }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- RISK REGISTER -->
        @case ('risks') {
          <div class="tab-content-container animation-slide">
            <div class="register-toolbar">
              <div class="toolbar-left">
                <span class="items-count">3 active risks tracked</span>
              </div>
              <div class="toolbar-right">
                <button class="tb-btn primary-tb" type="button">
                  <span [pmConsoleIcon]="'plus'"></span>
                  <span>Log Risk</span>
                </button>
              </div>
            </div>

            <div class="pm-project-table-view">
              <table class="program-register-table">
                <thead>
                  <tr>
                    <th style="width: 10%">Risk ID</th>
                    <th style="width: 15%">Source</th>
                    <th style="width: 45%">Description</th>
                    <th style="width: 15%">Owner</th>
                    <th style="width: 15%">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  @for (risk of risks; track risk.id) {
                    <tr>
                      <td><span class="risk-id-badge">{{ risk.id }}</span></td>
                      <td><strong>{{ risk.source }}</strong></td>
                      <td class="description-text">{{ risk.description }}</td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle">{{ getInitials(risk.owner) }}</div>
                          <span>{{ risk.owner }}</span>
                        </div>
                      </td>
                      <td>
                        <span class="risk-rating-badge" [style.background]="risk.ratingColor + '20'" [style.color]="risk.ratingColor" [style.border]="'1px solid ' + risk.ratingColor + '40'">
                          {{ risk.rating }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- BENEFITS REGISTER -->
        @case ('benefits') {
          <div class="tab-content-container animation-slide">
            <div class="register-toolbar">
              <div class="toolbar-left">
                <span class="items-count">3 strategic benefits mapped</span>
              </div>
            </div>

            <div class="pm-project-table-view">
              <table class="program-register-table">
                <thead>
                  <tr>
                    <th style="width: 25%">Strategic Benefit</th>
                    <th style="width: 30%">Performance Metric</th>
                    <th style="width: 15%">Baseline</th>
                    <th style="width: 15%">Target</th>
                    <th style="width: 15%">Owner</th>
                    <th style="width: 10%">Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (b of benefits; track b.id) {
                    <tr>
                      <td><strong>{{ b.benefit }}</strong></td>
                      <td>{{ b.metric }}</td>
                      <td class="baseline-col">{{ b.baseline }}</td>
                      <td class="target-col">{{ b.target }}</td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle">{{ getInitials(b.owner) }}</div>
                          <span>{{ b.owner }}</span>
                        </div>
                      </td>
                      <td>
                        <span [pmConsoleStatusPill]="b.status" baseClass="dependency-register-pill" [tone]="statusTone(b.status)"></span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }

    </div>
  `,
  styles: [`
    .workspace-registers-tab {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px;
      animation: fadeIn 0.3s ease-out;
    }

    /* Sub-tabs styling */
    .sub-tabs.pm-register-tabs {
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      padding-bottom: 0px;
      margin-bottom: 4px;
      display: flex;
      gap: 24px;
    }

    .sub-tabs .pm-register-tab {
      background: transparent;
      border: none;
      padding: 10px 4px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-muted, #8e8e93);
      cursor: pointer;
      position: relative;
      transition: color 0.2s ease;
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
      color: var(--color-primary, #007aff);
      font-weight: 600;
    }

    .sub-tabs .pm-register-tab.is-active::after {
      background: var(--color-primary, #007aff);
    }

    .tab-content-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Stats row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .pm-project-table-stat {
      background: var(--bg-card, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
    }

    .pm-project-table-stat:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.06);
    }

    .stat-icon {
      font-size: 22px;
    }

    .p-icon {
      color: #007aff;
    }

    .border-emerald:hover { border-color: rgba(52, 199, 89, 0.4); }
    .border-red:hover { border-color: rgba(255, 69, 58, 0.4); }
    .border-amber:hover { border-color: rgba(255, 159, 10, 0.4); }
    .border-grey:hover { border-color: rgba(142, 142, 147, 0.4); }

    .stat-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-text, #ffffff);
    }

    .text-success { color: #30d158 !important; }
    .text-danger { color: #ff453a !important; }
    .text-warning { color: #ff9f0a !important; }
    .text-muted { color: #aeaeb2 !important; }

    /* Toolbar */
    .register-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-card, rgba(255, 255, 255, 0.02));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
      border-radius: 8px;
      padding: 12px 16px;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .items-count {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-input, rgba(0, 0, 0, 0.3));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 6px;
      padding: 6px 12px;
      width: 260px;
    }

    .search-box span {
      color: var(--color-text-muted, #8e8e93);
      font-size: 14px;
    }

    .search-box input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--color-text, #ffffff);
      font-size: 13px;
      width: 100%;
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 8px 12px;
      color: var(--color-text, #ffffff);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .tb-btn:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .primary-tb {
      background: var(--color-primary, #007aff);
      border-color: var(--color-primary, #007aff);
    }

    .primary-tb:hover {
      background: #0062cc;
    }

    /* Table styling */
    .pm-project-table-view {
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      border-radius: 12px;
      overflow: hidden;
      background: var(--bg-card, rgba(255, 255, 255, 0.04));
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .program-register-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .program-register-table th {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-muted, #8e8e93);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      background: rgba(0, 0, 0, 0.15);
    }

    .program-register-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
      font-size: 13px;
      color: var(--color-text, #ffffff);
      vertical-align: middle;
    }

    .program-row {
      background: rgba(255, 255, 255, 0.01);
      transition: background-color 0.15s ease;
    }

    .program-row:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .program-row.is-expanded {
      background: rgba(0, 122, 255, 0.02);
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
      color: var(--color-text-muted, #8e8e93);
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
      background: rgba(255, 255, 255, 0.08);
      color: var(--color-text, #ffffff);
    }

    .chevron-icon {
      font-size: 14px;
    }

    .title-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-meta strong {
      font-weight: 600;
      color: var(--color-text, #ffffff);
    }

    .badge-tag {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.02em;
    }

    .program-tag {
      background: rgba(0, 122, 255, 0.15);
      color: #007aff;
      border: 1px solid rgba(0, 122, 255, 0.25);
    }

    .project-tag {
      background: rgba(255, 159, 10, 0.1);
      color: #ff9f0a;
      border: 1px solid rgba(255, 159, 10, 0.2);
    }

    .standalone-tag {
      background: rgba(142, 142, 147, 0.12);
      color: #aeaeb2;
      border: 1px solid rgba(142, 142, 147, 0.2);
    }

    .stage-span {
      color: var(--color-text-muted, #8e8e93);
      font-size: 12px;
    }

    .trend-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .trend-icon {
      font-size: 14px;
    }

    .trend-icon.up {
      color: #30d158;
    }

    .trend-icon.stable {
      color: #007aff;
    }

    .trend-icon.down {
      color: #ff453a;
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
      background: var(--color-primary-soft, rgba(0, 122, 255, 0.15));
      color: var(--color-primary, #007aff);
      font-size: 9px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 122, 255, 0.2);
    }

    .avatar-circle.secondary-circle {
      background: rgba(255, 159, 10, 0.1);
      color: #ff9f0a;
      border-color: rgba(255, 159, 10, 0.2);
    }

    .manager-name {
      font-size: 12px;
      color: var(--color-text-semi, #e5e5ea);
    }

    .date-col, .budget-col {
      color: var(--color-text-semi, #e5e5ea);
    }

    /* Child rows styling */
    .project-child-row {
      background: rgba(0, 0, 0, 0.12);
    }

    .indented-col {
      padding-left: 24px !important;
    }

    .corner-arrow {
      color: var(--color-text-muted, #8e8e93);
      font-size: 14px;
    }

    .project-name-span {
      color: var(--color-text-semi, #e5e5ea);
      font-size: 13px;
    }

    .standalone-row {
      border-top: 1.5px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    /* Risk / Benefit styling modifications */
    .description-text {
      color: var(--color-text-semi, #e5e5ea);
      line-height: 1.4;
      font-size: 13px;
    }

    .risk-id-badge {
      font-family: monospace;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--color-text-muted, #8e8e93);
    }

    .risk-rating-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.03em;
    }

    .baseline-col, .target-col {
      color: var(--color-text-semi, #e5e5ea);
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
  `]
})
export class PortfolioWorkspaceRegistersComponent {
  activeSubTab: SubTab = 'projects';
  expandedProgramIds = new Set<string>(['prog-1']); // default open first program
  searchQuery = '';
  statusFilter: string | null = null;

  programs = portfolioProgramRows;
  standaloneList = standaloneProjects;
  risks = riskRegisterData;
  benefits = benefitsRegisterData;

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

  trendIcon(trend: 'stable' | 'up' | 'down'): string {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'minus';
    }
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
}
