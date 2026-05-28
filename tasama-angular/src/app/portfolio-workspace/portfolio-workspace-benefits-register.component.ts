import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from '../shared/pm-console-row-action-menu.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import {
  PmConsoleRegisterTableComponent,
  PmConsoleRegisterTableColumn,
  PmConsoleRegisterTableRow,
  PmConsoleRegisterTableActionEvent
} from '../shared/pm-console-register-table.component';
import { Benefit } from './portfolio-workspace.data';

export interface ProjectGroup {
  key: string;
  label: string;
  benefits: Benefit[];
}

export interface ProgramGroup {
  key: string;
  label: string;
  directBenefits: Benefit[];
  projects: ProjectGroup[];
}

@Component({
  selector: 'app-portfolio-workspace-benefits-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PmConsoleRowActionMenuComponent,
    PmConsoleStatusPillComponent,
    PmConsoleRegisterTableComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="benefit-register-host animation-slide">
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
          </div>
        </div>

        <div class="toolbar-right">
          <!-- Toggleable Search -->
          <div class="search-toggle-container" [class.is-expanded]="showSearch">
            <button
              class="tb-btn search-toggle-btn"
              type="button"
              (click)="toggleSearch()"
              aria-label="Toggle benefit search"
            >
              <span [pmConsoleIcon]="'search'"></span>
            </button>
            @if (showSearch) {
              <input
                type="search"
                class="toolbar-search-input"
                placeholder="Search Benefits..."
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
          <table class="pm-project-table pm-grouped-benefit-table">
            <thead>
              <tr>
                <th style="width: 32%">Benefit</th>
                <th style="width: 14%">Owner</th>
                <th style="width: 12%">Target Date</th>
                <th style="width: 22%">KPI / Measure</th>
                <th style="width: 12%">Realization</th>
                <th style="width: 8%">Status</th>
                <th style="width: 8%; text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (program of computedGroups; track program.key) {
                <!-- Program Header Row -->
                <tr class="br-group-header br-program-header" (click)="toggleGroup(program.key)">
                  <td colspan="7">
                    <div class="group-header-content">
                      @if (isCollapsed(program.key)) {
                        <span pmConsoleIcon="chevron-right" class="group-chevron"></span>
                      } @else {
                        <span pmConsoleIcon="chevron-down" class="group-chevron"></span>
                      }
                      <span class="group-badge program-badge">Program</span>
                      <strong class="group-title">{{ program.label }}</strong>
                      <span class="group-count">{{ getProgramCount(program) }}</span>
                    </div>
                  </td>
                </tr>

                @if (!isCollapsed(program.key)) {
                  <!-- Program Direct Benefits -->
                  @for (b of program.directBenefits; track b.id) {
                    <tr class="br-benefit-row">
                      <td class="br-name-cell">
                        <div class="benefit-id-above-name">
                          <span class="benefit-id-text">{{ b.id }}</span>
                          <a class="benefit-name-link">{{ b.name }}</a>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                            {{ b.owner.initials }}
                          </div>
                          <span class="owner-name">{{ b.owner.name }}</span>
                        </div>
                      </td>
                      <td class="date-cell">{{ b.targetDate }}</td>
                      <td class="description-text full-wrap">{{ b.kpiMeasure }}</td>
                      <td class="realization-cell">{{ b.realization }}</td>
                      <td>
                        <span [pmConsoleStatusPill]="b.status" baseClass="br-status-badge" [tone]="statusTone(b.status)"></span>
                      </td>
                      <td class="schedule-table-actions">
                        <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + b.id">
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
                  @for (project of program.projects; track project.key) {
                    <tr class="br-group-header br-project-header" (click)="toggleGroup(project.key)">
                      <td colspan="7">
                        <div class="group-header-content" style="padding-left: 20px;">
                          @if (isCollapsed(project.key)) {
                            <span pmConsoleIcon="chevron-right" class="group-chevron"></span>
                          } @else {
                            <span pmConsoleIcon="chevron-down" class="group-chevron"></span>
                          }
                          <span class="group-badge project-badge">Project</span>
                          <strong class="group-title">{{ project.label }}</strong>
                          <span class="group-count">{{ project.benefits.length }}</span>
                        </div>
                      </td>
                    </tr>

                    @if (!isCollapsed(project.key)) {
                      @for (b of project.benefits; track b.id) {
                        <tr class="br-benefit-row br-indent-1">
                          <td class="br-name-cell">
                            <div class="benefit-id-above-name" style="padding-left: 24px;">
                              <span class="benefit-id-text">{{ b.id }}</span>
                              <a class="benefit-name-link">{{ b.name }}</a>
                            </div>
                          </td>
                          <td>
                            <div class="avatar-cell">
                              <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                                {{ b.owner.initials }}
                              </div>
                              <span class="owner-name">{{ b.owner.name }}</span>
                            </div>
                          </td>
                          <td class="date-cell">{{ b.targetDate }}</td>
                          <td class="description-text full-wrap">{{ b.kpiMeasure }}</td>
                          <td class="realization-cell">{{ b.realization }}</td>
                          <td>
                            <span [pmConsoleStatusPill]="b.status" baseClass="br-status-badge" [tone]="statusTone(b.status)"></span>
                          </td>
                          <td class="schedule-table-actions">
                            <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + b.id">
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
              @for (standalone of standaloneGroups; track standalone.key) {
                <tr class="br-group-header br-standalone-header" (click)="toggleGroup(standalone.key)">
                  <td colspan="7">
                    <div class="group-header-content">
                      @if (isCollapsed(standalone.key)) {
                        <span pmConsoleIcon="chevron-right" class="group-chevron"></span>
                      } @else {
                        <span pmConsoleIcon="chevron-down" class="group-chevron"></span>
                      }
                      <span class="group-badge standalone-badge">Project</span>
                      <strong class="group-title">{{ standalone.label }}</strong>
                      <span class="group-count">{{ standalone.benefits.length }}</span>
                    </div>
                  </td>
                </tr>

                @if (!isCollapsed(standalone.key)) {
                  @for (b of standalone.benefits; track b.id) {
                    <tr class="br-benefit-row br-indent-1">
                      <td class="br-name-cell">
                        <div class="benefit-id-above-name" style="padding-left: 24px;">
                          <span class="benefit-id-text">{{ b.id }}</span>
                          <a class="benefit-name-link">{{ b.name }}</a>
                        </div>
                      </td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'" [style.borderColor]="'rgba(0, 122, 255, 0.2)'">
                            {{ b.owner.initials }}
                          </div>
                          <span class="owner-name">{{ b.owner.name }}</span>
                        </div>
                      </td>
                      <td class="date-cell">{{ b.targetDate }}</td>
                      <td class="description-text full-wrap">{{ b.kpiMeasure }}</td>
                      <td class="realization-cell">{{ b.realization }}</td>
                      <td>
                        <span [pmConsoleStatusPill]="b.status" baseClass="br-status-badge" [tone]="statusTone(b.status)"></span>
                      </td>
                      <td class="schedule-table-actions">
                        <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + b.id">
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
            ariaLabel="Flat Benefits Register"
            (cellAction)="onCellAction($event)"
          />
        </div>
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

    .benefit-register-host {
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
    .pm-grouped-benefit-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
    }
    .pm-grouped-benefit-table th {
      background: #f8fafc;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .pm-grouped-benefit-table th,
    .pm-grouped-benefit-table td {
      border-bottom: 1px solid #e3e5e9;
    }

    .br-group-header {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease;
    }

    /* Program headers: medium weight, rgba(0, 122, 255, 0.03) tint */
    .br-program-header {
      background-color: rgba(0, 122, 255, 0.03) !important;
    }
    .br-program-header:hover {
      background-color: rgba(0, 122, 255, 0.06) !important;
    }
    .br-program-header .group-title {
      color: #007aff;
      font-size: 13.5px;
    }

    /* Project sub-headers: same light grey coloring as Independent security assessment */
    .br-project-header {
      background-color: rgba(100, 116, 139, 0.03) !important;
    }
    .br-project-header:hover {
      background-color: rgba(100, 116, 139, 0.06) !important;
    }
    .br-project-header .group-title {
      color: #4a5568;
      font-size: 13px;
    }

    /* Standalone sections */
    .br-standalone-header {
      background-color: rgba(100, 116, 139, 0.03) !important;
    }
    .br-standalone-header:hover {
      background-color: rgba(100, 116, 139, 0.06) !important;
    }
    .br-standalone-header .group-title {
      color: #475569;
      font-size: 13px;
    }

    /* Indent benefit rows */
    .br-benefit-row {
      transition: background-color 0.15s ease;
    }
    .br-benefit-row:hover {
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

    .benefit-id-above-name {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
      text-align: left;
    }

    .benefit-id-text {
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

    .benefit-name-link {
      font-size: 13.5px;
      font-weight: 600;
      color: #252a34;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.15s ease;
      text-align: left;
    }
    .benefit-name-link:hover {
      color: var(--brand, #10069f);
      text-decoration: underline;
    }

    .br-status-badge {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.02em;
      display: inline-block;
      border: 1px solid transparent;
      text-align: center;
      min-width: 85px;
    }
    .br-status-badge.emerald {
      background: #e8f7ee;
      border-color: rgba(22, 161, 95, 0.2);
      color: #16a15f;
    }
    .br-status-badge.amber {
      background: #fff5e6;
      border-color: rgba(217, 119, 6, 0.2);
      color: #d97706;
    }
    .br-status-badge.red {
      background: #fff0f0;
      border-color: rgba(222, 53, 11, 0.2);
      color: #de350b;
    }
    .br-status-badge.neutral {
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

    .pm-grouped-benefit-table th:last-child {
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
  `]
})
export class PortfolioWorkspaceBenefitsRegisterComponent {
  @Input() benefits: Benefit[] = [];

  viewMode: 'grouped' | 'flat' = 'grouped';
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

  getProgramCount(program: ProgramGroup): number {
    let count = program.directBenefits.length;
    for (const proj of program.projects) {
      count += proj.benefits.length;
    }
    return count;
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

  get computedGroups(): ProgramGroup[] {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = this.benefits.filter(b => {
      if (!query) return true;
      return (
        b.id.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query) ||
        b.linkedTo.toLowerCase().includes(query) ||
        b.owner.name.toLowerCase().includes(query) ||
        b.kpiMeasure.toLowerCase().includes(query)
      );
    });

    const programsMap = new Map<string, { directBenefits: Benefit[], projectsMap: Map<string, Benefit[]> }>();

    for (const b of filtered) {
      if (b.level === 'program') {
        const progKey = b.linkedTo;
        if (!programsMap.has(progKey)) {
          programsMap.set(progKey, { directBenefits: [], projectsMap: new Map() });
        }
        programsMap.get(progKey)!.directBenefits.push(b);
      } else if (b.level === 'project' && b.parentProgram) {
        const progKey = b.parentProgram;
        if (!programsMap.has(progKey)) {
          programsMap.set(progKey, { directBenefits: [], projectsMap: new Map() });
        }
        const progVal = programsMap.get(progKey)!;
        const projKey = b.linkedTo;
        if (!progVal.projectsMap.has(projKey)) {
          progVal.projectsMap.set(projKey, []);
        }
        progVal.projectsMap.get(projKey)!.push(b);
      }
    }

    const result: ProgramGroup[] = [];
    const sortedProgKeys = Array.from(programsMap.keys()).sort();

    for (const progKey of sortedProgKeys) {
      const progVal = programsMap.get(progKey)!;
      const projects: ProjectGroup[] = [];
      const sortedProjKeys = Array.from(progVal.projectsMap.keys()).sort();

      for (const projKey of sortedProjKeys) {
        projects.push({
          key: `prog::${progKey}::proj::${projKey}`,
          label: projKey,
          benefits: progVal.projectsMap.get(projKey)!
        });
      }

      result.push({
        key: `prog::${progKey}`,
        label: progKey,
        directBenefits: progVal.directBenefits,
        projects
      });
    }

    return result;
  }

  get standaloneGroups(): ProjectGroup[] {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = this.benefits.filter(b => {
      if (!query) return true;
      return (
        b.id.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query) ||
        b.linkedTo.toLowerCase().includes(query) ||
        b.owner.name.toLowerCase().includes(query) ||
        b.kpiMeasure.toLowerCase().includes(query)
      );
    });

    const standaloneMap = new Map<string, Benefit[]>();
    for (const b of filtered) {
      if (b.level === 'project' && !b.parentProgram) {
        const projKey = b.linkedTo;
        if (!standaloneMap.has(projKey)) {
          standaloneMap.set(projKey, []);
        }
        standaloneMap.get(projKey)!.push(b);
      }
    }

    const result: ProjectGroup[] = [];
    const sortedKeys = Array.from(standaloneMap.keys()).sort();
    for (const key of sortedKeys) {
      result.push({
        key: `standalone::${key}`,
        label: key,
        benefits: standaloneMap.get(key)!
      });
    }
    return result;
  }

  get flatColumns(): PmConsoleRegisterTableColumn[] {
    return [
      { id: 'benefitName', label: 'Benefit', minWidth: 280 },
      { id: 'linkedTo', label: 'Linked Project', minWidth: 260 },
      { id: 'owner', label: 'Owner', minWidth: 150 },
      { id: 'targetDate', label: 'Target Date', minWidth: 95 },
      { id: 'kpiMeasure', label: 'KPI / Measure', minWidth: 280 },
      { id: 'realization', label: 'Realization', minWidth: 150 },
      { id: 'status', label: 'Status', minWidth: 95 },
      { id: 'actions', label: 'Actions', minWidth: 60, align: 'center' }
    ];
  }

  get flatRows(): PmConsoleRegisterTableRow[] {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = this.benefits.filter(b => {
      if (!query) return true;
      return (
        b.id.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query) ||
        b.linkedTo.toLowerCase().includes(query) ||
        b.owner.name.toLowerCase().includes(query) ||
        b.kpiMeasure.toLowerCase().includes(query)
      );
    });

    return filtered.map(b => ({
      id: b.id,
      clickable: false,
      cells: {
        benefitName: {
          kind: 'primary',
          subtitle: b.id,
          title: b.name,
          ariaLabel: `View benefit ${b.id}: ${b.name}`
        },
        linkedTo: {
          kind: 'chip-text',
          chipLabel: b.level,
          chipTone: b.level,
          text: b.linkedTo
        },
        owner: {
          kind: 'person',
          title: b.owner.name,
          initials: b.owner.initials
        },
        targetDate: {
          kind: 'text',
          text: b.targetDate
        },
        kpiMeasure: {
          kind: 'text',
          text: b.kpiMeasure
        },
        realization: {
          kind: 'text',
          text: b.realization
        },
        status: {
          kind: 'status',
          label: b.status,
          tone: this.statusTone(b.status)
        },
        actions: {
          kind: 'menu',
          ariaLabel: `Actions for ${b.id}`,
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
