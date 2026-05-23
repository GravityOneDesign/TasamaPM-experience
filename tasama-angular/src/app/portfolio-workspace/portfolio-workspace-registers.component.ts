import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
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

      <!-- Tab Outlet -->
      @switch (activeSubTab) {
        
        <!-- PROJECT REGISTER -->
        @case ('projects') {
          <div class="tab-content-container animation-slide">

            <div class="register-toolbar">
              <div class="toolbar-left" style="display: flex; align-items: center; gap: 12px;">
                <!-- Programs summary container -->
                <div class="summary-pill active">
                  <span class="pill-label">programs</span>
                  <span class="pill-badge">{{ allProgramsCount }}</span>
                </div>
                <!-- Standalone Projects summary container -->
                <div class="summary-pill inactive">
                  <span class="pill-label">standalone projects</span>
                  <span class="pill-badge">{{ standaloneList.length }}</span>
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
                    <th style="width: 36%">Program / Project Name</th>
                    <th style="width: 18%">Manager</th>
                    <th style="width: 14%">Status Trend</th>
                    <th style="width: 11%">Start Date</th>
                    <th style="width: 11%">End Date</th>
                    <th style="width: 10%">Budget Utilised</th>
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
                                <span class="review-needed-alert" title="Needs Attention">
                                  <span [pmConsoleIcon]="'alert'"></span>
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

        <!-- RISK REGISTER -->
        @case ('risks') {
          <div class="tab-content-container animation-slide">
            <div class="register-toolbar">
              <div class="toolbar-left">
                <span class="items-count">Items: {{ filteredRisks.length }}</span>
              </div>
              <div class="toolbar-right">
                <!-- Toggleable Search for Risks -->
                <div class="search-toggle-container" [class.is-expanded]="showRiskSearch">
                  <button class="tb-btn search-toggle-btn" type="button" (click)="showRiskSearch = !showRiskSearch" aria-label="Toggle risk search">
                    <span [pmConsoleIcon]="'search'"></span>
                  </button>
                  @if (showRiskSearch) {
                    <input
                      type="search"
                      class="toolbar-search-input"
                      placeholder="Search Risks..."
                      [(ngModel)]="riskSearchQuery"
                      (input)="onRiskSearch()"
                      autofocus
                    />
                  }
                </div>

                <button class="tb-btn" type="button" aria-label="Filter options">
                  <span [pmConsoleIcon]="'filter'"></span>
                  <span>Filter</span>
                </button>
                <button class="tb-btn" type="button" aria-label="Export">
                  <span [pmConsoleIcon]="'download-cloud'"></span>
                  <span>Export</span>
                </button>
                <button class="tb-btn primary-tb" type="button">
                  <span [pmConsoleIcon]="'plus'"></span>
                  <span>Add Risk</span>
                </button>
                <button class="tb-btn settings-btn" type="button" aria-label="Settings">
                  <span [pmConsoleIcon]="'settings'"></span>
                </button>
              </div>
            </div>

            <div class="pm-project-table-scroll">
              <table class="pm-project-table">
                <thead>
                  <tr>
                    <th style="width: 4%; text-align: center;"><input type="checkbox" style="cursor: pointer;" /></th>
                    <th style="width: 10%">Risk ID</th>
                    <th style="width: 22%">Risk</th>
                    <th style="width: 14%">Linked Initiative</th>
                    <th style="width: 12%">Initiative Type</th>
                    <th style="width: 12%">Owner</th>
                    <th style="width: 12%">Mitigation</th>
                    <th style="width: 8%">Last Review</th>
                    <th style="width: 8%">Exposure</th>
                    <th style="width: 8%">Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (risk of filteredRisks; track risk.id) {
                    <tr>
                      <td style="text-align: center;"><input type="checkbox" style="cursor: pointer;" /></td>
                      <td><span class="risk-id-badge">{{ risk.id }}</span></td>
                      <td>
                        <a class="risk-name-link">{{ risk.risk }}</a>
                      </td>
                      <td style="color: #252a34; font-size: 13px;"><strong>{{ risk.linkedInitiative }}</strong></td>
                      <td>
                        <span class="initiative-type-chip {{ risk.initiativeType.toLowerCase() }}">
                          {{ risk.initiativeType }}
                        </span>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                            {{ getInitials(risk.owner) }}
                          </div>
                          <span class="owner-name" style="font-size: 13px; color: #252a34;">{{ risk.owner }}</span>
                        </div>
                      </td>
                      <td class="description-text" style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" [title]="risk.mitigation">
                        {{ risk.mitigation }}
                      </td>
                      <td style="color: #555555; font-size: 12.5px;">{{ risk.lastReview }}</td>
                      <td>
                        <span class="exposure-badge {{ risk.exposure.toLowerCase() }}">
                          {{ risk.exposure }}
                        </span>
                      </td>
                      <td>
                        <span class="risk-status-badge {{ risk.status.toLowerCase() }}">
                          {{ risk.status }}
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

    .summary-pill .pill-badge {
      font-size: 13.5px;
      font-weight: 400; /* Light font weight */
      color: #707788;
      background: transparent !important;
      padding: 0;
    }

    .pm-project-table-scroll {
      flex: 1;
      overflow-y: auto;
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

    /* New styles for Risk Register chips & badges */
    .risk-name-link {
      font-size: 13px;
      font-weight: 500;
      color: var(--brand, #007aff);
      text-decoration: none;
      cursor: pointer;
      transition: color 0.15s ease;
    }
    .risk-name-link:hover {
      color: #0056cc;
      text-decoration: underline;
    }

    .initiative-type-chip {
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.04em;
      display: inline-block;
      border: 1px solid transparent;
    }
    .initiative-type-chip.project {
      background: rgba(0, 122, 255, 0.08);
      color: #007aff;
      border-color: rgba(0, 122, 255, 0.15);
    }
    .initiative-type-chip.program {
      background: rgba(147, 51, 234, 0.08);
      color: #9333ea;
      border-color: rgba(147, 51, 234, 0.15);
    }
    .initiative-type-chip.portfolio {
      background: rgba(245, 158, 11, 0.08);
      color: #f59e0b;
      border-color: rgba(245, 158, 11, 0.15);
    }

    .exposure-badge {
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 999px;
      letter-spacing: 0.04em;
      display: inline-block;
      border: 1px solid transparent;
      text-align: center;
      min-width: 65px;
    }
    .exposure-badge.critical {
      background: #fff0f0;
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.2);
    }
    .exposure-badge.high {
      background: #fff5eb;
      color: #f97316;
      border-color: rgba(249, 115, 22, 0.2);
    }
    .exposure-badge.medium {
      background: #fffbeb;
      color: #d97706;
      border-color: rgba(217, 119, 6, 0.2);
    }
    .exposure-badge.low {
      background: #f8fafc;
      color: #64748b;
      border-color: rgba(100, 116, 139, 0.2);
    }

    .risk-status-badge {
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 999px;
      letter-spacing: 0.04em;
      display: inline-block;
      border: 1px solid transparent;
      text-align: center;
      min-width: 85px;
    }
    .risk-status-badge.monitoring {
      background: #fffbeb;
      color: #d97706;
      border-color: rgba(217, 119, 6, 0.2);
    }
    .risk-status-badge.escalated {
      background: #fff0f0;
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.2);
    }
    .risk-status-badge.active {
      background: #fffbeb;
      color: #d97706;
      border-color: rgba(217, 119, 6, 0.2);
    }
    .risk-status-badge.watching {
      background: #eff6ff;
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.2);
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
  activeSubTab: SubTab = 'projects';
  expandedProgramIds = new Set<string>(); // default closed by default
  searchQuery = '';
  statusFilter: string | null = null;
  showSearch = false; // toggleable search bar
  showCreateDropdown = false;

  riskSearchQuery = '';
  showRiskSearch = false;

  programs = portfolioProgramRows;
  standaloneList = standaloneProjects;
  risks = riskRegisterData;
  benefits = benefitsRegisterData;

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

  onRiskSearch(): void {
    // handled reactively in getter
  }

  get filteredRisks(): any[] {
    let list = this.risks;
    if (this.riskSearchQuery) {
      const q = this.riskSearchQuery.toLowerCase();
      list = list.filter(r => 
        r.id.toLowerCase().includes(q) ||
        r.risk.toLowerCase().includes(q) ||
        r.linkedInitiative.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.mitigation.toLowerCase().includes(q)
      );
    }
    return list;
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

