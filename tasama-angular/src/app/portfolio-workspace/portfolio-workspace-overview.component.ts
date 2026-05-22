import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { PmConsoleRowActionMenuComponent } from '../shared/pm-console-row-action-menu.component';
import { PmConsolePlanTableComponent } from '../pm-console-plan-table.component';
import { portfolioSummary, KPICard, ObjectiveRow } from './portfolio-workspace.data';

@Component({
  selector: 'app-portfolio-workspace-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PmConsoleStatusPillComponent,
    PmConsoleRowActionMenuComponent,
    PmConsolePlanTableComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-overview-tab">
      <!-- 1. Top Section Grid (Description & Key Roles) -->
      <div class="overview-top-grid">
        <div class="overview-header-card description-card">
          <h3>Description</h3>
          <p class="description-text">{{ description }}</p>
        </div>

        <div class="overview-header-card roles-card">
          <h3>Portfolio Roles</h3>
          <div class="roles-list">
            <div class="role-item">
              <span class="role-label">Portfolio Owner</span>
              <div class="role-content">
                <div class="avatar-circle font-owner">{{ getInitials(owner) }}</div>
                <strong class="role-name">{{ owner }}</strong>
              </div>
            </div>
            <div class="role-divider"></div>
            <div class="role-item">
              <span class="role-label">Portfolio Sponsor</span>
              <div class="role-content">
                <div class="avatar-circle font-sponsor">{{ getInitials(sponsor) }}</div>
                <strong class="role-name">{{ sponsor }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. KPI Summary Stat Cards Grid (Only 2 columns now) -->
      <div class="pm-project-table-stats">
        @for (kpi of kpis; track kpi.label) {
          <article class="pm-project-table-stat {{ kpiTone(kpi.label) }}">
            <span><span [pmConsoleIcon]="kpi.icon"></span></span>
            <div class="stat-body">
              <small>{{ kpi.label }}</small>
              <div class="stat-value-row">
                <strong class="stat-value">{{ kpi.value }}</strong>
                <span class="stat-trend" [class.trend-up]="kpi.trend.startsWith('+')" [class.trend-stable]="kpi.trend === 'Stable'">
                  {{ kpi.trend }}
                </span>
              </div>
            </div>
          </article>
        }
      </div>

      <!-- 3. Strategic Objectives Table Section wrapped in app-pm-console-plan-table -->
      <div class="objectives-wrapper">
        <app-pm-console-plan-table
          title="Strategic Objectives"
          description="Expected results and measures that define what success should look like for this portfolio."
          [countLabel]="objectives.length + ' objectives'"
          actionLabel="Add objective"
          actionAriaLabel="Add objective"
          [iconName]="'target'"
          panelClass="overview-register-card"
          (action)="openAddObjectiveModal()"
        >
          @if (objectives.length) {
            <div class="dependency-register-table-shell">
              <table class="dependency-register-table" aria-label="Strategic Objectives">
                <thead>
                  <tr>
                    <th style="width: 35%">Objective</th>
                    <th style="width: 35%">Target Measure</th>
                    <th style="width: 18%">Owner</th>
                    <th style="width: 12%">Status</th>
                    <th aria-label="Actions" style="width: 5%"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (obj of objectives; track obj.title; let i = $index) {
                    <tr>
                      <td class="dependency-register-primary">
                        <strong>{{ obj.title }}</strong>
                      </td>
                      <td class="objective-measure">{{ obj.measure }}</td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle font-owner">{{ getInitials(obj.owner) }}</div>
                          <span class="owner-name">{{ obj.owner }}</span>
                        </div>
                      </td>
                      <td>
                        <span [pmConsoleStatusPill]="obj.status" baseClass="dependency-register-pill" [tone]="statusTone(obj.status)"></span>
                      </td>
                      <td class="schedule-table-actions">
                        <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + obj.title">
                          <button type="button" role="menuitem" (click)="openEditObjectiveModal(i)">
                            <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                            Edit
                          </button>
                          <button class="danger" type="button" role="menuitem" (click)="deleteObjective(i)">
                            <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                            Delete
                          </button>
                        </app-pm-console-row-action-menu>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="empty-state-card">
              <span [pmConsoleIcon]="'target'" class="empty-icon"></span>
              <p class="empty-title">No objectives added yet</p>
              <p class="empty-subtitle">Click the button above to add the first strategic objective.</p>
            </div>
          }
        </app-pm-console-plan-table>
      </div>

      <!-- 4. KPIs Table Section wrapped in app-pm-console-plan-table -->
      <div class="kpi-section-wrapper">
        <app-pm-console-plan-table
          title="KPIs"
          description="Key performance indicators tracked across the active programs and workspaces."
          [countLabel]="kpiRows.length + ' KPIs'"
          actionLabel="Add KPI"
          actionAriaLabel="Add KPI"
          [iconName]="'activity'"
          panelClass="overview-register-card"
          (action)="openAddKpiModal()"
        >
          @if (kpiRows.length) {
            <div class="dependency-register-table-shell">
              <table class="dependency-register-table" aria-label="KPIs">
                <thead>
                  <tr>
                    <th style="width: 35%">KPI</th>
                    <th style="width: 35%">Target Measure</th>
                    <th style="width: 18%">Owner</th>
                    <th style="width: 12%">Status</th>
                    <th aria-label="Actions" style="width: 5%"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (kpi of kpiRows; track kpi.title; let i = $index) {
                    <tr>
                      <td class="dependency-register-primary">
                        <strong>{{ kpi.title }}</strong>
                      </td>
                      <td class="objective-measure">{{ kpi.measure }}</td>
                      <td>
                        <div class="avatar-cell">
                          <div class="avatar-circle font-owner">{{ getInitials(kpi.owner) }}</div>
                          <span class="owner-name">{{ kpi.owner }}</span>
                        </div>
                      </td>
                      <td>
                        <span [pmConsoleStatusPill]="kpi.status" baseClass="dependency-register-pill" [tone]="statusTone(kpi.status)"></span>
                      </td>
                      <td class="schedule-table-actions">
                        <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + kpi.title">
                          <button type="button" role="menuitem" (click)="openEditKpiModal(i)">
                            <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                            Edit
                          </button>
                          <button class="danger" type="button" role="menuitem" (click)="deleteKpi(i)">
                            <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                            Delete
                          </button>
                        </app-pm-console-row-action-menu>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="empty-state-card">
              <span [pmConsoleIcon]="'activity'" class="empty-icon"></span>
              <p class="empty-title">No KPIs added yet</p>
              <p class="empty-subtitle">Click the button above to add the first Key Performance Indicator.</p>
            </div>
          }
        </app-pm-console-plan-table>
      </div>
    </div>

    <!-- 5. Interactive Form Dialog Overlay -->
    @if (showFormModal) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <div class="modal-header-title">
              <span [pmConsoleIcon]="modalType === 'objective' ? 'target' : 'activity'" class="modal-title-icon"></span>
              <h3>{{ editingIndex !== null ? 'Edit' : 'Add' }} {{ modalType === 'objective' ? 'Strategic Objective' : 'KPI' }}</h3>
            </div>
            <button class="modal-close-btn" type="button" aria-label="Close modal" (click)="closeModal()">
              <span pmConsoleIcon="x"></span>
            </button>
          </header>

          <form (submit)="$event.preventDefault(); saveItem()" class="modal-form">
            <div class="form-group">
              <label for="form-title">{{ modalType === 'objective' ? 'Objective Name' : 'KPI Name' }} *</label>
              <input
                id="form-title"
                name="title"
                type="text"
                required
                [(ngModel)]="formModel.title"
                placeholder="e.g. {{ modalType === 'objective' ? 'Enhance Firewall Policies' : 'SOC MTTR Reduction' }}"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="form-measure">Target Measure *</label>
              <textarea
                id="form-measure"
                name="measure"
                required
                rows="3"
                [(ngModel)]="formModel.measure"
                placeholder="e.g. 100% deployment on ministerial servers"
                class="form-control"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="form-owner">Owner *</label>
              <input
                id="form-owner"
                name="owner"
                type="text"
                required
                [(ngModel)]="formModel.owner"
                placeholder="e.g. Fatima Qahtani"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="form-status">Status *</label>
              <div class="select-wrapper">
                <select id="form-status" name="status" required [(ngModel)]="formModel.status" class="form-control select-control">
                  <option value="On-Track">On-Track</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Alert">Alert</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Started">Not Started</option>
                </select>
                <span pmConsoleIcon="chevron-down" class="select-chevron"></span>
              </div>
            </div>

            <footer class="modal-footer">
              <button class="btn btn-outline" type="button" (click)="closeModal()">Cancel</button>
              <button class="btn btn-primary" type="submit" [disabled]="!isFormValid()">
                {{ editingIndex !== null ? 'Save Changes' : 'Add Item' }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .workspace-overview-tab {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 10px 0;
      animation: fadeIn 0.3s ease-out;
    }

    .overview-top-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 16px;
      align-items: stretch;
    }

    .overview-header-card {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
    }

    .overview-header-card h3 {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #707788;
      margin: 0 0 10px 0;
    }

    .description-text {
      font-size: 15px;
      line-height: 1.6;
      color: #252a34;
      margin: 0;
    }

    .roles-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 4px;
      justify-content: center;
      flex-grow: 1;
    }

    .role-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .role-label {
      font-size: 9.5px;
      font-weight: 600;
      color: #707788;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .role-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .role-name {
      font-size: 13.5px;
      font-weight: 600;
      color: #202633;
    }

    .role-divider {
      height: 1px;
      background: #e3e5e9;
    }

    .pm-project-table-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 4px 0;
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .stat-value-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: 100%;
    }

    .stat-trend {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(15, 23, 42, 0.04);
      color: #555555;
    }

    .stat-trend.trend-up {
      color: #16a15f;
      background: #e8f7ee;
    }

    .stat-trend.trend-stable {
      color: var(--brand, #007aff);
      background: rgba(0, 122, 255, 0.08);
    }

    .objective-measure {
      color: #555555;
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
    }

    .font-owner {
      background: rgba(0, 122, 255, 0.08);
      color: #007aff;
      border: 1.5px solid rgba(0, 122, 255, 0.2);
    }

    .font-sponsor {
      background: rgba(255, 159, 10, 0.08);
      color: #ff9f0a;
      border: 1.5px solid rgba(255, 159, 10, 0.2);
    }

    .owner-name {
      font-size: 13px;
      color: #252a34;
    }

    /* Empty State Cards */
    .empty-state-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      text-align: center;
      background: #fafbfc;
      border: 1px dashed #e3e5e9;
      border-radius: 8px;
      margin: 12px 0;
    }

    .empty-icon {
      font-size: 24px;
      color: #a0aec0;
      margin-bottom: 8px;
      display: inline-block;
    }

    .empty-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #4a5568;
      margin: 0 0 4px 0;
    }

    .empty-subtitle {
      font-size: 11.5px;
      color: #718096;
      margin: 0;
    }

    /* Modal Backdrop & Overlay Styling */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeInOverlay 0.25s ease-out;
    }

    .modal-container {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid rgba(226, 232, 240, 0.8);
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUpScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      border-bottom: 1px solid #edf2f7;
    }

    .modal-header-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .modal-title-icon {
      color: var(--brand, #10069f);
      font-size: 20px;
    }

    .modal-header h3 {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }

    .modal-close-btn {
      background: none;
      border: none;
      color: #718096;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .modal-close-btn:hover {
      background: #f7fafc;
      color: #2d3748;
    }

    .modal-form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 600;
      color: #4a5568;
    }

    .form-control {
      font-family: inherit;
      font-size: 13.5px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #cbd5e0;
      background: #ffffff;
      color: #2d3748;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .form-control::placeholder {
      color: #a0aec0;
    }

    .form-control:focus {
      border-color: var(--brand, #10069f);
      box-shadow: 0 0 0 3px rgba(16, 6, 255, 0.1);
    }

    textarea.form-control {
      resize: vertical;
    }

    .select-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .select-control {
      appearance: none;
      -webkit-appearance: none;
      padding-right: 36px;
    }

    .select-chevron {
      position: absolute;
      right: 14px;
      pointer-events: none;
      color: #718096;
      font-size: 14px;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 10px;
      border-top: 1px solid #edf2f7;
      padding-top: 18px;
    }

    .btn {
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      outline: none;
    }

    .btn-outline {
      background: #ffffff;
      border-color: #cbd5e0;
      color: #4a5568;
    }

    .btn-outline:hover:not(:disabled) {
      background: #f7fafc;
      border-color: #a0aec0;
      color: #2d3748;
    }

    .btn-primary {
      background: var(--brand, #10069f);
      color: #ffffff;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0d057a;
    }

    .btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* Status Pill Tones */
    ::ng-deep .dependency-register-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    ::ng-deep .dependency-register-pill.emerald {
      background: #e8f7ee;
      color: #16a15f;
      border: 1px solid rgba(22, 161, 95, 0.2);
    }

    ::ng-deep .dependency-register-pill.amber {
      background: #fff8e6;
      color: #b27b00;
      border: 1px solid rgba(178, 123, 0, 0.2);
    }

    ::ng-deep .dependency-register-pill.red {
      background: #fdf2f2;
      color: #de350b;
      border: 1px solid rgba(222, 53, 11, 0.2);
    }

    ::ng-deep .dependency-register-pill.neutral {
      background: #f4f5f7;
      color: #5e6c84;
      border: 1px solid rgba(94, 108, 132, 0.2);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUpScale {
      from { opacity: 0; transform: translateY(20px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class PortfolioWorkspaceOverviewComponent implements OnInit {
  description = portfolioSummary.description;
  kpis = portfolioSummary.kpis.filter(k => k.label !== 'Overall Progress' && k.label !== 'Compliance Rate');
  objectives = [...portfolioSummary.objectives];
  owner = portfolioSummary.owner;
  sponsor = portfolioSummary.sponsor;

  // New state variables for KPIs section
  kpiRows: ObjectiveRow[] = [
    { title: 'SOC MTTR Reduction', measure: 'Lower mean time to response to under 5 minutes', owner: 'Dr. Khalid Al-Mansoori', status: 'On-Track' },
    { title: 'MFA Enrollment Rate', measure: 'Attain 100% MFA enrollment for senior civil servants', owner: 'Saeed Al-Mansoori', status: 'Alert' },
    { title: 'Endpoint Protection Coverage', measure: '95% active endpoint client installations', owner: 'Fatima Qahtani', status: 'On-Track' }
  ];

  // State variables for Form Modal
  showFormModal = false;
  modalType: 'objective' | 'kpi' = 'objective';
  editingIndex: number | null = null;
  formModel: ObjectiveRow = {
    title: '',
    measure: '',
    owner: '',
    status: 'On-Track'
  };

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  kpiTone(label: string): string {
    switch (label.toLowerCase()) {
      case 'overall progress': return 'blue';
      case 'active programs': return 'blue';
      case 'budget utilisation': return 'blue';
      case 'compliance rate': return 'green';
      default: return 'neutral';
    }
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
      case 'under review':
      case 'draft':
        return 'amber';
      case 'alert':
      case 'delayed':
      case 'off-track':
        return 'red';
      default:
        return 'neutral';
    }
  }

  // Modal Handlers
  openAddObjectiveModal(): void {
    this.modalType = 'objective';
    this.editingIndex = null;
    this.formModel = {
      title: '',
      measure: '',
      owner: '',
      status: 'On-Track'
    };
    this.showFormModal = true;
    this.cdr.markForCheck();
  }

  openEditObjectiveModal(index: number): void {
    this.modalType = 'objective';
    this.editingIndex = index;
    const obj = this.objectives[index];
    this.formModel = { ...obj };
    this.showFormModal = true;
    this.cdr.markForCheck();
  }

  openAddKpiModal(): void {
    this.modalType = 'kpi';
    this.editingIndex = null;
    this.formModel = {
      title: '',
      measure: '',
      owner: '',
      status: 'On-Track'
    };
    this.showFormModal = true;
    this.cdr.markForCheck();
  }

  openEditKpiModal(index: number): void {
    this.modalType = 'kpi';
    this.editingIndex = index;
    const kpi = this.kpiRows[index];
    this.formModel = { ...kpi };
    this.showFormModal = true;
    this.cdr.markForCheck();
  }

  deleteObjective(index: number): void {
    this.objectives = this.objectives.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  deleteKpi(index: number): void {
    this.kpiRows = this.kpiRows.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showFormModal = false;
    this.cdr.markForCheck();
  }

  isFormValid(): boolean {
    return !!(
      this.formModel.title?.trim() &&
      this.formModel.measure?.trim() &&
      this.formModel.owner?.trim() &&
      this.formModel.status
    );
  }

  saveItem(): void {
    if (!this.isFormValid()) return;

    if (this.modalType === 'objective') {
      if (this.editingIndex !== null) {
        const updated = [...this.objectives];
        updated[this.editingIndex] = { ...this.formModel };
        this.objectives = updated;
      } else {
        this.objectives = [...this.objectives, { ...this.formModel }];
      }
    } else {
      if (this.editingIndex !== null) {
        const updated = [...this.kpiRows];
        updated[this.editingIndex] = { ...this.formModel };
        this.kpiRows = updated;
      } else {
        this.kpiRows = [...this.kpiRows, { ...this.formModel }];
      }
    }

    this.closeModal();
  }
}
