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
      <div class="sub-tabs">
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
            <div class="pm-project-table-stats">
              <article class="pm-project-table-stat blue cursor-pointer" [class.active-filter]="statusFilter === null" (click)="filterStatus(null)">
                <span><span [pmConsoleIcon]="'layers'"></span></span>
                <div class="stat-body">
                  <small class="stat-label">All Programs</small>
                  <strong class="stat-value">{{ allProgramsCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat green cursor-pointer" [class.active-filter]="statusFilter === 'on-track'" (click)="filterStatus('on-track')">
                <span><span [pmConsoleIcon]="'check-circle'"></span></span>
                <div class="stat-body">
                  <small class="stat-label">On-Track</small>
                  <strong class="stat-value text-success">{{ onTrackCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat red cursor-pointer" [class.active-filter]="statusFilter === 'off-track'" (click)="filterStatus('off-track')">
                <span><span [pmConsoleIcon]="'alert-triangle'"></span></span>
                <div class="stat-body">
                  <small class="stat-label">Off-Track</small>
                  <strong class="stat-value text-danger">{{ offTrackCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat amber cursor-pointer" [class.active-filter]="statusFilter === 'alert'" (click)="filterStatus('alert')">
                <span><span [pmConsoleIcon]="'shield-alert'"></span></span>
                <div class="stat-body">
                  <small class="stat-label">Alert</small>
                  <strong class="stat-value text-warning">{{ alertCount }}</strong>
                </div>
              </article>

              <article class="pm-project-table-stat neutral cursor-pointer" [class.active-filter]="statusFilter === 'not-started'" (click)="filterStatus('not-started')">
                <span><span [pmConsoleIcon]="'clock'"></span></span>
                <div class="stat-body">
                  <small class="stat-label">Not Started</small>
                  <strong class="stat-value text-muted">{{ notStartedCount }}</strong>
                </div>
              </article>
            </div>

            <!-- Toolbar -->
            <div class="register-toolbar">
              <div class="toolbar-left">
                <span class="items-count">{{ totalRowsCount }} items found</span>
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
                <button class="tb-btn" type="button" aria-label="Export PDF">
                  <span [pmConsoleIcon]="'download-cloud'"></span>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="pm-project-table-scroll">
              <table class="pm-project-table">
                <thead>
                  <tr>
                    <th style="width: 38%">Program / Project Name</th>
                    <th style="width: 12%">Stage</th>
                    <th style="width: 15%">Status Trend</th>
                    <th style="width: 15%">Manager</th>
                    <th style="width: 12%">Start Date</th>
                    <th style="width: 8%">Budget Utilised</th>
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
                          <div class="program-title-column">
                            <span class="program-display-id">{{ getProgramDisplayId(prog.id) }}</span>
                            <div class="title-meta">
                              <strong class="program-name-blue">{{ prog.name }}</strong>
                              <span class="badge-tag program-tag">Program</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span class="stage-span">{{ prog.stage }}</span></td>
                      <td>
                        <div class="trend-circle-wrapper">
                          @for (trendItem of getThreePeriodTrend(prog.id); track $index) {
                            <div class="trend-circle" [class]="trendItem">
                              @if (trendItem === 'check') {
                                <span [pmConsoleIcon]="'check'"></span>
                              } @else if (trendItem === 'bell') {
                                <span [pmConsoleIcon]="'bell'"></span>
                              } @else {
                                <span [pmConsoleIcon]="'x'"></span>
                              }
                            </div>
                          }
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
                          <td class="primary-col indented-col">
                            <div class="name-cell-wrapper">
                              <span [pmConsoleIcon]="'corner-down-right'" class="corner-arrow"></span>
                              <div class="program-title-column">
                                <span class="program-display-id">{{ getProgramDisplayId(proj.id) }}</span>
                                <div class="title-meta">
                                  <strong class="program-name-blue">{{ proj.name }}</strong>
                                  <span class="badge-tag project-tag">Project</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td><span class="stage-span">{{ proj.stage }}</span></td>
                          <td>
                            <div class="trend-circle-wrapper">
                              @for (trendItem of getThreePeriodTrend(proj.id); track $index) {
                                <div class="trend-circle" [class]="trendItem">
                                  @if (trendItem === 'check') {
                                    <span [pmConsoleIcon]="'check'"></span>
                                  } @else if (trendItem === 'bell') {
                                    <span [pmConsoleIcon]="'bell'"></span>
                                  } @else {
                                    <span [pmConsoleIcon]="'x'"></span>
                                  }
                                </div>
                              }
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
                      <td class="primary-col">
                        <div class="name-cell-wrapper no-chevron">
                          <div class="program-title-column">
                            <span class="program-display-id">{{ getProgramDisplayId(sa.id) }}</span>
                            <div class="title-meta">
                              <strong class="program-name-blue">{{ sa.name }}</strong>
                              <span class="badge-tag standalone-tag">Standalone</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span class="stage-span">{{ sa.stage }}</span></td>
                      <td>
                        <div class="trend-circle-wrapper">
                          @for (trendItem of getThreePeriodTrend(sa.id); track $index) {
                            <div class="trend-circle" [class]="trendItem">
                              @if (trendItem === 'check') {
                                <span [pmConsoleIcon]="'check'"></span>
                              } @else if (trendItem === 'bell') {
                                <span [pmConsoleIcon]="'bell'"></span>
                              } @else {
                                <span [pmConsoleIcon]="'x'"></span>
                              }
                            </div>
                          }
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

            <div class="pm-project-table-scroll">
              <table class="pm-project-table">
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
                          <span class="owner-name">{{ risk.owner }}</span>
                        </div>
                      </td>
                      <td>
                        <span class="risk-rating-badge" [style.background]="risk.ratingColor + '15'" [style.color]="risk.ratingColor" [style.border]="'1px solid ' + risk.ratingColor + '30'">
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

            <div class="pm-project-table-scroll">
              <table class="pm-project-table">
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
                          <span class="owner-name">{{ b.owner }}</span>
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
      gap: 24px;
      padding: 10px 0;
      animation: fadeIn 0.3s ease-out;
    }

    /* Sub-tabs styling */
    .sub-tabs {
      position: sticky;
      top: -10px;
      z-index: 12;
      background: #ffffff;
      border-bottom: 1px solid #edf0f6;
      padding-bottom: 4px;
      margin-bottom: 18px;
      display: flex;
      gap: 24px;
    }

    .sub-tabs .pm-register-tab {
      background: transparent;
      border: none;
      padding: 10px 4px;
      font-size: 13.5px;
      font-weight: 500;
      color: #707788;
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
      color: var(--brand, #007aff);
      font-weight: 600;
    }

    .sub-tabs .pm-register-tab.is-active::after {
      background: var(--brand, #007aff);
    }

    .tab-content-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Stats row */
    .pm-project-table-stats {
      position: sticky;
      top: 38px;
      z-index: 11;
      background: #ffffff;
      padding: 8px 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .active-filter {
      border-color: var(--brand, #007aff) !important;
      box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1) !important;
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: #707788;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #252a34;
    }

    .text-success { color: #16a15f !important; }
    .text-danger { color: #de350b !important; }
    .text-warning { color: #b27b00 !important; }
    .text-muted { color: #5e6c84 !important; }

    /* Toolbar */
    .register-toolbar {
      position: sticky;
      top: 126px;
      z-index: 11;
      background: #ffffff;
      padding: 12px 20px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
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
    }

    .title-meta strong {
      font-weight: 600;
      color: #252a34;
    }

    .badge-tag {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.04em;
    }

    .program-tag {
      background: rgba(0, 122, 255, 0.08);
      color: #007aff;
      border: 1px solid rgba(0, 122, 255, 0.2);
    }

    .project-tag {
      background: rgba(255, 159, 10, 0.08);
      color: #ff9f0a;
      border: 1px solid rgba(255, 159, 10, 0.2);
    }

    .standalone-tag {
      background: #f4f5f7;
      color: #5e6c84;
      border: 1px solid rgba(94, 108, 132, 0.2);
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

    /* 3-period Trend Circles */
    .trend-circle-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .trend-circle {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .trend-circle.check {
      background: #16a15f;
    }

    .trend-circle.bell {
      background: #d97706;
    }

    .trend-circle.cross {
      background: #de350b;
    }

    .trend-circle span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .trend-circle ::ng-deep .icon {
      width: 11px !important;
      height: 11px !important;
      stroke-width: 3px !important;
      color: #ffffff !important;
    }

    .trend-icon {
      font-size: 14px;
    }

    .trend-icon.up {
      color: #16a15f;
    }

    .trend-icon.stable {
      color: var(--brand, #007aff);
    }

    .trend-icon.down {
      color: #de350b;
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
      background: rgba(0, 122, 255, 0.08);
      color: #007aff;
      font-size: 9.5px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid rgba(0, 122, 255, 0.2);
    }

    .avatar-circle.secondary-circle {
      background: rgba(255, 159, 10, 0.08);
      color: #ff9f0a;
      border-color: rgba(255, 159, 10, 0.2);
    }

    .manager-name, .owner-name {
      font-size: 13px;
      color: #252a34;
    }

    .date-col, .budget-col {
      color: #555555;
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

    /* Table extension to edge */
    .pm-project-table {
      width: 100% !important;
      min-width: 100% !important;
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
  expandedProgramIds = new Set<string>(); // default closed by default
  searchQuery = '';
  statusFilter: string | null = null;
  showSearch = false; // toggleable search bar

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

  getThreePeriodTrend(id: string): ('check' | 'bell' | 'cross')[] {
    const trendMap: Record<string, ('check' | 'bell' | 'cross')[]> = {
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
      
      'sa-proj-1': ['check', 'check', 'check'],
      'sa-proj-2': ['bell', 'bell', 'check']
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

