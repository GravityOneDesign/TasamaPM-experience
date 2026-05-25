import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from '../shared/pm-console-row-action-menu.component';
import {
  PmConsoleRegisterTableComponent,
  PmConsoleRegisterTableColumn,
  PmConsoleRegisterTableRow,
  PmConsoleRegisterTableActionEvent
} from '../shared/pm-console-register-table.component';
import { Risk } from './portfolio-workspace.data';
import { PortfolioWorkspaceRiskVisualComponent } from './portfolio-workspace-risk-visual.component';

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

@Component({
  selector: 'app-portfolio-workspace-risk-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PmConsoleRowActionMenuComponent,
    PmConsoleRegisterTableComponent,
    PortfolioWorkspaceRiskVisualComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="risk-register-host animation-slide">
      <!-- Toolbar -->
      <div class="register-toolbar">
        <div class="toolbar-left" style="display: flex; align-items: center; gap: 12px;">
          <!-- Segmented Toggle on the left -->
          <div class="view-mode-toggle" style="margin-left: 0;">
            <button
              type="button"
              [class.active]="viewMode === 'grouped'"
              (click)="viewMode = 'grouped'"
            >
              Grouped
            </button>
            <button
              type="button"
              [class.active]="viewMode === 'flat'"
              (click)="viewMode = 'flat'"
            >
              List view
            </button>
            <button
              type="button"
              [class.active]="viewMode === 'visual'"
              (click)="viewMode = 'visual'"
            >
              Visual Layer
            </button>
          </div>
        </div>

        <div class="toolbar-right">
          <!-- Toggleable Search -->
          <div class="search-toggle-container" [class.is-expanded]="showSearch">
            <button
              class="tb-btn search-toggle-btn"
              type="button"
              (click)="toggleSearch()"
              aria-label="Toggle risk search"
            >
              <span [pmConsoleIcon]="'search'"></span>
            </button>
            @if (showSearch) {
              <input
                type="search"
                class="toolbar-search-input"
                placeholder="Search Risks..."
                [(ngModel)]="searchQuery"
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
            <span>Add new</span>
          </button>
          <button class="tb-btn settings-btn" type="button" aria-label="Settings">
            <span [pmConsoleIcon]="'settings'"></span>
          </button>
        </div>
      </div>

      <!-- Grouped View -->
      @if (viewMode === 'grouped') {
        <div class="pm-project-table-scroll">
          <table class="pm-project-table pm-grouped-risk-table">
            <thead>
              <tr>
                <th style="width: 22%">Portfolio / Program / Project</th>
                <th style="width: 24%">Risk ID & Name</th>
                <th style="width: 12%">Owner</th>
                <th style="width: 18%">Mitigation</th>
                <th style="width: 8%">Last Review</th>
                <th style="width: 8%">Exposure</th>
                <th style="width: 8%">Status</th>
                <th style="width: 8%; text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (portfolio of computedGroups; track portfolio.key) {
                <!-- Portfolio Header Row -->
                <tr class="rr-group-header rr-portfolio-header" (click)="toggleGroup(portfolio.key)">
                  <td class="rr-hierarchy-cell rr-indent-portfolio">
                    <div class="hierarchy-cell-content">
                      @if (isCollapsed(portfolio.key)) {
                        <span pmConsoleIcon="chevron-right" class="group-chevron"></span>
                      } @else {
                        <span pmConsoleIcon="chevron-down" class="group-chevron"></span>
                      }
                      <div class="hierarchy-name-container">
                        <span class="group-badge portfolio-badge">Portfolio</span>
                        <strong class="group-title">{{ portfolio.label }}</strong>
                      </div>
                      <span class="group-count">{{ getPortfolioCount(portfolio) }}</span>
                    </div>
                  </td>
                  <td colspan="7"></td>
                </tr>

                @if (!isCollapsed(portfolio.key)) {
                  <!-- Portfolio Direct Risks -->
                  @for (risk of portfolio.directRisks; track risk.id) {
                    <tr class="rr-risk-row">
                      <td class="rr-hierarchy-cell rr-indent-risk-portfolio"
                          [class.rr-trunk-portfolio]="portfolio.programs.length > 0 || portfolio.standaloneProjects.risks.length > 0">
                      </td>
                      <td class="rr-name-cell">
                        <div class="risk-id-above-name">
                          <span class="risk-id-text">{{ risk.id }}</span>
                          <a class="risk-name-link">{{ risk.name }}</a>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                            {{ risk.owner.initials }}
                          </div>
                          <span class="owner-name">{{ risk.owner.name }}</span>
                        </div>
                      </td>
                      <td class="description-text full-wrap">
                        {{ risk.mitigation }}
                      </td>
                      <td class="date-cell">{{ risk.lastReview }}</td>
                      <td>
                        <span class="exposure-badge {{ risk.exposure }}">
                          {{ risk.exposure }}
                        </span>
                      </td>
                      <td>
                        <span class="risk-status-badge {{ risk.status }}">
                          {{ risk.status }}
                        </span>
                      </td>
                      <td class="schedule-table-actions">
                        <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + risk.id">
                          <button type="button" role="menuitem">
                            <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                            Edit
                          </button>
                          <button class="danger" type="button" role="menuitem">
                            <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                            Delete
                          </button>
                        </app-pm-console-row-action-menu>
                      </td>
                    </tr>
                  }

                  <!-- Programs -->
                  @for (program of portfolio.programs; track program.key; let lastProgram = $last) {
                    <tr class="rr-group-header rr-program-header" (click)="toggleGroup(program.key)">
                      <td class="rr-hierarchy-cell rr-indent-program rr-elbow-program"
                          [class.is-last]="lastProgram && portfolio.standaloneProjects.risks.length === 0">
                        <div class="hierarchy-cell-content">
                          @if (isCollapsed(program.key)) {
                            <span pmConsoleIcon="chevron-right" class="group-chevron"></span>
                          } @else {
                            <span pmConsoleIcon="chevron-down" class="group-chevron"></span>
                          }
                          <div class="hierarchy-name-container">
                            <span class="group-badge program-badge">Program</span>
                            <strong class="group-title">{{ program.label }}</strong>
                          </div>
                          <span class="group-count">{{ getProgramCount(program) }}</span>
                        </div>
                      </td>
                      <td colspan="7"></td>
                    </tr>

                    @if (!isCollapsed(program.key)) {
                      <!-- Program Direct Risks -->
                      @for (risk of program.directRisks; track risk.id) {
                        <tr class="rr-risk-row">
                          <td class="rr-hierarchy-cell rr-indent-risk-program"
                              [class.rr-trunk-portfolio]="!lastProgram || portfolio.standaloneProjects.risks.length > 0"
                              [class.rr-trunk-program]="program.projects.length > 0">
                          </td>
                          <td class="rr-name-cell">
                            <div class="risk-id-above-name">
                              <span class="risk-id-text">{{ risk.id }}</span>
                              <a class="risk-name-link">{{ risk.name }}</a>
                            </div>
                          </td>
                          <td>
                            <div class="avatar-cell">
                              <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                                {{ risk.owner.initials }}
                              </div>
                              <span class="owner-name">{{ risk.owner.name }}</span>
                            </div>
                          </td>
                          <td class="description-text full-wrap">
                            {{ risk.mitigation }}
                          </td>
                          <td class="date-cell">{{ risk.lastReview }}</td>
                          <td>
                            <span class="exposure-badge {{ risk.exposure }}">
                              {{ risk.exposure }}
                            </span>
                          </td>
                          <td>
                            <span class="risk-status-badge {{ risk.status }}">
                              {{ risk.status }}
                            </span>
                          </td>
                          <td class="schedule-table-actions">
                            <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + risk.id">
                              <button type="button" role="menuitem">
                                <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                Edit
                              </button>
                              <button class="danger" type="button" role="menuitem">
                                <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                Delete
                              </button>
                            </app-pm-console-row-action-menu>
                          </td>
                        </tr>
                      }

                      <!-- Projects inside Program -->
                      @for (project of program.projects; track project.key; let lastProject = $last) {
                        <tr class="rr-group-header rr-project-header" (click)="toggleGroup(project.key)">
                          <td class="rr-hierarchy-cell rr-indent-project rr-elbow-project"
                              [class.is-last]="lastProject"
                              [class.rr-trunk-portfolio]="!lastProgram || portfolio.standaloneProjects.risks.length > 0">
                            <div class="hierarchy-cell-content">
                              @if (isCollapsed(project.key)) {
                                <span pmConsoleIcon="chevron-right" class="group-chevron"></span>
                              } @else {
                                <span pmConsoleIcon="chevron-down" class="group-chevron"></span>
                              }
                              <div class="hierarchy-name-container">
                                <span class="group-badge project-badge">Project</span>
                                <strong class="group-title">{{ project.label }}</strong>
                              </div>
                              <span class="group-count">{{ project.risks.length }}</span>
                            </div>
                          </td>
                          <td colspan="7"></td>
                        </tr>

                        @if (!isCollapsed(project.key)) {
                          @for (risk of project.risks; track risk.id) {
                            <tr class="rr-risk-row">
                              <td class="rr-hierarchy-cell rr-indent-risk-project"
                                  [class.rr-trunk-portfolio]="!lastProgram || portfolio.standaloneProjects.risks.length > 0"
                                  [class.rr-trunk-program]="!lastProject">
                              </td>
                              <td class="rr-name-cell">
                                <div class="risk-id-above-name">
                                  <span class="risk-id-text">{{ risk.id }}</span>
                                  <a class="risk-name-link">{{ risk.name }}</a>
                                </div>
                              </td>
                              <td>
                                <div class="avatar-cell">
                                  <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                                    {{ risk.owner.initials }}
                                  </div>
                                  <span class="owner-name">{{ risk.owner.name }}</span>
                                </div>
                              </td>
                              <td class="description-text full-wrap">
                                {{ risk.mitigation }}
                              </td>
                              <td class="date-cell">{{ risk.lastReview }}</td>
                              <td>
                                <span class="exposure-badge {{ risk.exposure }}">
                                  {{ risk.exposure }}
                                </span>
                              </td>
                              <td>
                                <span class="risk-status-badge {{ risk.status }}">
                                  {{ risk.status }}
                                </span>
                              </td>
                              <td class="schedule-table-actions">
                                <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + risk.id">
                                  <button type="button" role="menuitem">
                                    <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                    Edit
                                  </button>
                                  <button class="danger" type="button" role="menuitem">
                                    <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                    Delete
                                  </button>
                                </app-pm-console-row-action-menu>
                              </td>
                            </tr>
                          }
                        }
                      }
                    }
                  }

                  <!-- Standalone Projects -->
                  @if (portfolio.standaloneProjects.risks.length > 0) {
                    <tr class="rr-group-header rr-standalone-header" (click)="toggleGroup(portfolio.standaloneProjects.key)">
                      <td class="rr-hierarchy-cell rr-indent-standalone rr-elbow-program is-last">
                        <div class="hierarchy-cell-content">
                          @if (isCollapsed(portfolio.standaloneProjects.key)) {
                            <span pmConsoleIcon="chevron-right" class="group-chevron"></span>
                          } @else {
                            <span pmConsoleIcon="chevron-down" class="group-chevron"></span>
                          }
                          <div class="hierarchy-name-container">
                            <span class="group-badge standalone-badge">Project</span>
                            <div class="tooltip-container">
                              <strong class="group-title">Independent Security Assessment</strong>
                              <span class="tooltip-text">Associated Program: None</span>
                            </div>
                          </div>
                          <span class="group-count">{{ portfolio.standaloneProjects.risks.length }}</span>
                        </div>
                      </td>
                      <td colspan="7"></td>
                    </tr>

                    @if (!isCollapsed(portfolio.standaloneProjects.key)) {
                      @for (risk of portfolio.standaloneProjects.risks; track risk.id) {
                        <tr class="rr-risk-row">
                          <td class="rr-hierarchy-cell rr-indent-risk-standalone">
                          </td>
                          <td class="rr-name-cell">
                            <div class="risk-id-above-name">
                              <span class="risk-id-text">{{ risk.id }}</span>
                              <a class="risk-name-link">{{ risk.name }}</a>
                            </div>
                          </td>
                          <td>
                            <div class="avatar-cell">
                              <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                                {{ risk.owner.initials }}
                              </div>
                              <span class="owner-name">{{ risk.owner.name }}</span>
                            </div>
                          </td>
                          <td class="description-text full-wrap">
                            {{ risk.mitigation }}
                          </td>
                          <td class="date-cell">{{ risk.lastReview }}</td>
                          <td>
                            <span class="exposure-badge {{ risk.exposure }}">
                              {{ risk.exposure }}
                            </span>
                          </td>
                          <td>
                            <span class="risk-status-badge {{ risk.status }}">
                              {{ risk.status }}
                            </span>
                          </td>
                          <td class="schedule-table-actions">
                            <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + risk.id">
                              <button type="button" role="menuitem">
                                <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                Edit
                              </button>
                              <button class="danger" type="button" role="menuitem">
                                <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                Delete
                              </button>
                            </app-pm-console-row-action-menu>
                          </td>
                        </tr>
                      }
                    }
                  }
                }
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Flat View Mode -->
      @if (viewMode === 'flat') {
        <div class="flat-list-wrapper">
          <app-pm-console-register-table
            [columns]="flatColumns"
            [rows]="flatRows"
            [showToolbar]="false"
            [selectable]="false"
            ariaLabel="Flat Risk Register"
            (cellAction)="onCellAction($event)"
          />
        </div>
      }

      <!-- Visual Layer Mode -->
      @if (viewMode === 'visual') {
        <app-portfolio-workspace-risk-visual
          [groups]="computedGroups"
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

    .risk-register-host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      height: 100%;
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

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
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
      background: var(--brand, #10069f);
      border-color: var(--brand, #10069f);
      color: #ffffff;
    }

    .primary-tb:hover {
      background: #0d0580;
      border-color: #0d0580;
    }

    .settings-btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 34px !important;
      height: 34px !important;
      padding: 0 !important;
    }

    /* Segmented view-mode-toggle styling */
    .view-mode-toggle {
      display: inline-flex;
      background: #f4f5f7;
      border: 1px solid #e3e5e9;
      border-radius: 8px;
      padding: 2px;
      margin-left: 12px;
    }
    .view-mode-toggle button {
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #555555;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 12px;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .view-mode-toggle button:hover {
      color: #111111;
    }
    .view-mode-toggle button.active {
      background: #ffffff;
      color: var(--brand, #10069f);
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    /* Search overlay expanded style */
    .search-toggle-container {
      position: relative;
      display: flex;
      align-items: center;
      transition: all 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .search-toggle-container.is-expanded {
      background: #f4f5f7;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding-right: 6px;
    }
    .search-toggle-btn {
      border: none !important;
      background: transparent !important;
    }
    .toolbar-search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      color: #252a34;
      padding: 4px 6px;
      width: 180px;
    }

    /* Table styles & Hierarchical headers */
    .pm-project-table-scroll {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      border: 1px solid #e3e5e9;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    }
    .pm-grouped-risk-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
    }
    .pm-grouped-risk-table th {
      background: #f8fafc;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .pm-grouped-risk-table th, 
    .pm-grouped-risk-table td {
      border-bottom: 1px solid #e3e5e9;
    }

    .rr-group-header {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease;
    }

    /* Portfolio headers: dark indigo label, background tint rgba(16, 6, 159, 0.04) */
    .rr-portfolio-header {
      background-color: rgba(16, 6, 159, 0.04) !important;
    }
    .rr-portfolio-header:hover {
      background-color: rgba(16, 6, 159, 0.07) !important;
    }
    .rr-portfolio-header .group-title {
      color: #10069f;
      font-size: 14px;
    }

    /* Program headers: medium weight, rgba(0, 122, 255, 0.03) tint */
    .rr-program-header {
      background-color: rgba(0, 122, 255, 0.03) !important;
    }
    .rr-program-header:hover {
      background-color: rgba(0, 122, 255, 0.06) !important;
    }
    .rr-program-header .group-title {
      color: #007aff;
      font-size: 13.5px;
    }

    /* Project sub-headers: same light grey coloring as Independent security assessment */
    .rr-project-header {
      background-color: rgba(100, 116, 139, 0.03) !important;
    }
    .rr-project-header:hover {
      background-color: rgba(100, 116, 139, 0.06) !important;
    }
    .rr-project-header .group-title {
      color: #4a5568;
      font-size: 13px;
    }

    /* Standalone sections */
    .rr-standalone-header {
      background-color: rgba(100, 116, 139, 0.03) !important;
    }
    .rr-standalone-header:hover {
      background-color: rgba(100, 116, 139, 0.06) !important;
    }
    .rr-standalone-header .group-title {
      color: #475569;
      font-size: 13px;
    }

    /* Indent risk rows */
    .rr-risk-row {
      transition: background-color 0.15s ease;
    }
    .rr-risk-row:hover {
      background-color: #fbfcff;
    }

    /* Header content wrapper */
    .group-header-content {
      display: flex;
      align-items: center;
      padding: 10px 12px;
    }

    .group-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      color: #718096;
      width: 16px;
      height: 16px;
      font-size: 16px;
    }

    .group-badge {
      font-size: 11px;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: 12px; /* pill shape */
      margin-right: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;
    }
    .portfolio-badge {
      background: rgba(16, 6, 159, 0.06);
      color: #10069f;
    }
    .program-badge {
      background: rgba(0, 122, 255, 0.06);
      color: #007aff;
    }
    .project-badge {
      background: rgba(74, 85, 104, 0.06);
      color: #4a5568;
    }
    .standalone-badge {
      background: rgba(74, 85, 104, 0.06);
      color: #4a5568;
    }

    .group-title {
      font-weight: 600;
    }

    .group-count {
      font-size: 11px;
      font-weight: 600;
      background: #e3e5e9;
      color: #4a5568;
      border-radius: 12px;
      padding: 2px 8px;
      margin-left: 10px;
    }

    .risk-id-above-name {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
      text-align: left;
    }

    .risk-id-text {
      font-size: 11px;
      font-weight: 500;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .full-wrap {
      white-space: normal !important;
      word-wrap: break-word !important;
      line-height: 1.4;
      font-size: 13px;
      color: #4a5568;
    }

    .date-cell {
      color: #555555;
      font-size: 12.5px;
    }

    .risk-name-link {
      font-size: 13.5px;
      font-weight: 600;
      color: #252a34;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.15s ease;
      text-align: left;
    }
    .risk-name-link:hover {
      color: var(--brand, #10069f);
      text-decoration: underline;
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
      background: #eff6ff;
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.2);
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
      background: #f8fafc;
      color: #64748b;
      border-color: rgba(100, 116, 139, 0.2);
    }

    /* Avatars and Cell layouts */
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
    }
    .owner-name {
      font-size: 13px;
      color: #252a34;
    }

    .pm-grouped-risk-table th:last-child {
      padding-right: 48px !important;
      text-align: right !important;
    }

    .schedule-table-actions {
      display: table-cell !important;
      vertical-align: middle !important;
      text-align: right !important;
      overflow: visible;
      padding-right: 48px !important;
    }

    .schedule-table-actions .pm-row-action-trigger {
      background: #ffffff !important;
      border: 1px solid #dfe7f2 !important;
      border-radius: 12px !important;
      width: 40px !important;
      height: 40px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease !important;
      box-shadow: none !important;
    }

    .schedule-table-actions .pm-row-action-trigger:hover,
    .schedule-table-actions .pm-row-action-trigger[aria-expanded="true"] {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
      color: var(--brand, #10069f) !important;
    }

    .flat-list-wrapper {
      width: 100%;
      height: 100%;
    }

    .tooltip-container {
      position: relative;
      display: inline-block;
    }

    .tooltip-text {
      visibility: hidden;
      width: 160px;
      background-color: #1e293b;
      color: #ffffff;
      text-align: center;
      border-radius: 6px;
      padding: 6px 10px;
      position: absolute;
      z-index: 100;
      bottom: 125%; /* Position above the text */
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: none; /* Instant appearance */
      font-size: 11px;
      font-weight: 500;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      pointer-events: none;
      line-height: 1.4;
      font-family: inherit;
    }

    .tooltip-text::after {
      content: "";
      position: absolute;
      top: 100%; /* At the bottom of the tooltip */
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #1e293b transparent transparent transparent;
    }

    .tooltip-container:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }

    .animation-slide {
      animation: slideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(8px); }
      to { opacity: 1; transform: translateX(0); }
    }

    /* Make gap between all columns equal in List View */
    .flat-list-wrapper ::ng-deep .pm-main-register-table th,
    .flat-list-wrapper ::ng-deep .pm-main-register-table td {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    /* Hierarchy Column & Cells styling */
    .rr-hierarchy-cell {
      position: relative;
      vertical-align: middle !important;
      height: 64px;
      padding: 8px 12px 8px 16px !important;
    }

    .hierarchy-cell-content {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      height: 100%;
    }

    .hierarchy-name-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 3px;
    }

    .hierarchy-name-container .group-badge {
      margin-right: 0 !important;
    }

    .hierarchy-name-container .group-title {
      font-size: 13px;
      line-height: 1.2;
    }

    /* Indentations for Hierarchy cells */
    .rr-indent-portfolio {
      padding-left: 16px !important;
    }

    .rr-indent-program,
    .rr-indent-standalone {
      padding-left: 40px !important;
    }

    .rr-indent-project {
      padding-left: 64px !important;
    }

    /* Background Trunks (Vertical Lines) */
    .rr-trunk-portfolio {
      background-image: linear-gradient(to right, #cbd5e1 1px, transparent 1px) !important;
      background-position: 24px 0 !important;
      background-size: 1px 100% !important;
      background-repeat: no-repeat !important;
    }

    .rr-trunk-program {
      background-image: linear-gradient(to right, #cbd5e1 1px, transparent 1px) !important;
      background-position: 48px 0 !important;
      background-size: 1px 100% !important;
      background-repeat: no-repeat !important;
    }

    .rr-trunk-portfolio.rr-trunk-program {
      background-image: 
        linear-gradient(to right, #cbd5e1 1px, transparent 1px),
        linear-gradient(to right, #cbd5e1 1px, transparent 1px) !important;
      background-position: 24px 0, 48px 0 !important;
      background-size: 1px 100%, 1px 100% !important;
      background-repeat: no-repeat, no-repeat !important;
    }

    /* Elbow Pseudo-Elements */
    .rr-elbow-program {
      position: relative;
    }

    .rr-elbow-program::before {
      content: "";
      position: absolute;
      left: 24px;
      top: 0;
      height: 50%;
      width: 12px;
      border-left: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
      z-index: 2;
    }

    .rr-elbow-program:not(.is-last)::after {
      content: "";
      position: absolute;
      left: 24px;
      top: 50%;
      bottom: 0;
      width: 1px;
      background-color: #cbd5e1;
      z-index: 2;
    }

    .rr-elbow-project {
      position: relative;
    }

    .rr-elbow-project::before {
      content: "";
      position: absolute;
      left: 48px;
      top: 0;
      height: 50%;
      width: 12px;
      border-left: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
      z-index: 2;
    }

    .rr-elbow-project:not(.is-last)::after {
      content: "";
      position: absolute;
      left: 48px;
      top: 50%;
      bottom: 0;
      width: 1px;
      background-color: #cbd5e1;
      z-index: 2;
    }
  `]
})
export class PortfolioWorkspaceRiskRegisterComponent {
  @Input() risks: Risk[] = [];

  viewMode: 'grouped' | 'flat' | 'visual' = 'grouped';
  collapsedGroupIds = new Set<string>();
  searchQuery = '';
  showSearch = false;

  toggleGroup(key: string): void {
    if (this.collapsedGroupIds.has(key)) {
      this.collapsedGroupIds.delete(key);
    } else {
      this.collapsedGroupIds.add(key);
    }
    this.collapsedGroupIds = new Set(this.collapsedGroupIds);
  }

  isCollapsed(key: string): boolean {
    return this.collapsedGroupIds.has(key);
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchQuery = '';
    }
  }

  getPortfolioCount(portfolio: PortfolioGroup): number {
    let count = portfolio.directRisks.length;
    for (const prog of portfolio.programs) {
      count += prog.directRisks.length;
      for (const proj of prog.projects) {
        count += proj.risks.length;
      }
    }
    count += portfolio.standaloneProjects.risks.length;
    return count;
  }

  getProgramCount(program: ProgramGroup): number {
    let count = program.directRisks.length;
    for (const proj of program.projects) {
      count += proj.risks.length;
    }
    return count;
  }

  get computedGroups(): PortfolioGroup[] {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = this.risks.filter(r => {
      if (!query) return true;
      return (
        r.id.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query) ||
        r.linkedTo.toLowerCase().includes(query) ||
        r.owner.name.toLowerCase().includes(query) ||
        r.mitigation.toLowerCase().includes(query)
      );
    });

    const portfoliosMap = new Map<string, { directRisks: Risk[], programsMap: Map<string, { directRisks: Risk[], projectsMap: Map<string, Risk[]> }>, standaloneRisks: Risk[] }>();

    for (const r of filtered) {
      const portKey = r.level === 'portfolio' ? r.linkedTo : (r.parentPortfolio || 'Unassigned Portfolio');
      if (!portfoliosMap.has(portKey)) {
        portfoliosMap.set(portKey, {
          directRisks: [],
          programsMap: new Map(),
          standaloneRisks: []
        });
      }
      const portGroup = portfoliosMap.get(portKey)!;

      if (r.level === 'portfolio') {
        portGroup.directRisks.push(r);
      } else if (r.level === 'program') {
        const progKey = r.linkedTo;
        if (!portGroup.programsMap.has(progKey)) {
          portGroup.programsMap.set(progKey, { directRisks: [], projectsMap: new Map() });
        }
        portGroup.programsMap.get(progKey)!.directRisks.push(r);
      } else { // level === 'project'
        if (r.parentProgram) {
          const progKey = r.parentProgram;
          if (!portGroup.programsMap.has(progKey)) {
            portGroup.programsMap.set(progKey, { directRisks: [], projectsMap: new Map() });
          }
          const progGroup = portGroup.programsMap.get(progKey)!;
          const projKey = r.linkedTo;
          if (!progGroup.projectsMap.has(projKey)) {
            progGroup.projectsMap.set(projKey, []);
          }
          progGroup.projectsMap.get(projKey)!.push(r);
        } else {
          portGroup.standaloneRisks.push(r);
        }
      }
    }

    const result: PortfolioGroup[] = [];
    const sortedPortKeys = Array.from(portfoliosMap.keys()).sort();

    for (const portKey of sortedPortKeys) {
      const portVal = portfoliosMap.get(portKey)!;
      const programs: ProgramGroup[] = [];
      const sortedProgKeys = Array.from(portVal.programsMap.keys()).sort();

      for (const progKey of sortedProgKeys) {
        const progVal = portVal.programsMap.get(progKey)!;
        const projects: ProjectGroup[] = [];
        const sortedProjKeys = Array.from(progVal.projectsMap.keys()).sort();

        for (const projKey of sortedProjKeys) {
          projects.push({
            key: `${portKey}::${progKey}::${projKey}`,
            label: projKey,
            risks: progVal.projectsMap.get(projKey)!
          });
        }

        programs.push({
          key: `${portKey}::${progKey}`,
          label: progKey,
          directRisks: progVal.directRisks,
          projects
        });
      }

      result.push({
        key: portKey,
        label: portKey,
        directRisks: portVal.directRisks,
        programs,
        standaloneProjects: {
          key: `${portKey}::standalone`,
          label: 'Project',
          risks: portVal.standaloneRisks
        }
      });
    }

    return result;
  }

  get flatColumns(): PmConsoleRegisterTableColumn[] {
    return [
      { id: 'riskIdName', label: 'Risk ID & Name', minWidth: 280 },
      { id: 'linkedTo', label: 'Linked to', minWidth: 260 },
      { id: 'owner', label: 'Owner', minWidth: 150 },
      { id: 'mitigation', label: 'Mitigation', minWidth: 280 },
      { id: 'lastReview', label: 'Last Review', minWidth: 85 },
      { id: 'exposure', label: 'Exposure', minWidth: 85 },
      { id: 'status', label: 'Status', minWidth: 95 },
      { id: 'actions', label: 'Actions', minWidth: 60, align: 'center' }
    ];
  }

  get flatRows(): PmConsoleRegisterTableRow[] {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = this.risks.filter(r => {
      if (!query) return true;
      return (
        r.id.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query) ||
        r.linkedTo.toLowerCase().includes(query) ||
        r.owner.name.toLowerCase().includes(query) ||
        r.mitigation.toLowerCase().includes(query)
      );
    });

    return filtered.map(r => ({
      id: r.id,
      clickable: false,
      cells: {
        riskIdName: {
          kind: 'primary',
          subtitle: r.id,
          title: r.name,
          ariaLabel: `View risk ${r.id}: ${r.name}`
        },
        linkedTo: {
          kind: 'chip-text',
          chipLabel: r.level,
          chipTone: r.level,
          text: r.linkedTo
        },
        owner: {
          kind: 'person',
          title: r.owner.name,
          initials: r.owner.initials
        },
        mitigation: {
          kind: 'text',
          text: r.mitigation
        },
        lastReview: {
          kind: 'text',
          text: r.lastReview
        },
        exposure: {
          kind: 'status',
          label: r.exposure,
          tone: r.exposure === 'critical' || r.exposure === 'high' ? 'red' : r.exposure === 'medium' ? 'amber' : 'neutral'
        },
        status: {
          kind: 'status',
          label: r.status,
          tone: r.status === 'escalated' ? 'red' : r.status === 'active' ? 'amber' : r.status === 'monitoring' ? 'blue' : 'neutral'
        },
        actions: {
          kind: 'menu',
          ariaLabel: `Actions for ${r.id}`,
          actions: [
            { id: 'edit', label: 'Edit', icon: 'pencil' },
            { id: 'delete', label: 'Delete', icon: 'trash-2', tone: 'danger' }
          ]
        }
      }
    }));
  }

  onCellAction(event: PmConsoleRegisterTableActionEvent): void {
    console.log('Cell action event triggered on flat list:', event);
  }
}
