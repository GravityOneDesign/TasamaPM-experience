import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PortfolioGroup, ProgramGroup, ProjectGroup } from './portfolio-workspace-risk-register.component';
import { Risk } from './portfolio-workspace.data';

@Component({
  selector: 'app-portfolio-workspace-risk-visual',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vl-wrapper">
      <div class="vl-canvas">
        @for (portfolio of groups; track portfolio.key) {
          <div class="vl-layout">
            <!-- Portfolio Card (left column) -->
            <div class="vl-portfolio-col">
              <div
                class="vl-portfolio-card"
                [class.has-risks]="portfolio.directRisks.length > 0"
                (click)="openPanelForRisks(portfolio.directRisks, portfolio.label, 'portfolio')"
              >
                @if (portfolio.directRisks.length > 0) {
                  <span class="vl-risk-dot"></span>
                }
                <span class="vl-card-badge portfolio">Portfolio</span>
                <span class="vl-card-title portfolio-title">{{ portfolio.label }}</span>
                <span class="vl-card-subtitle">{{ getPortfolioRiskCount(portfolio) }} risks</span>
              </div>
            </div>

            <!-- Connector arm -->
            <div class="vl-connector-col">
              <div class="vl-connector-line"></div>
            </div>

            <!-- Programs + Projects column -->
            <div class="vl-entities-col">
              <!-- Programs -->
              @for (program of portfolio.programs; track program.key) {
                <div class="vl-entity-group">
                  <div class="vl-node-row">
                    <div class="vl-arm"></div>
                    <div
                      class="vl-entity-card program-card"
                      [class.has-risks]="program.directRisks.length > 0"
                      [class.is-expanded]="isExpanded(program.key)"
                      (click)="openPanelForRisks(program.directRisks, program.label, 'program')"
                    >
                      @if (program.directRisks.length > 0) {
                        <span class="vl-risk-dot"></span>
                      }
                      <div class="vl-card-body">
                        <span class="vl-card-badge program">Program</span>
                        <span class="vl-card-title">{{ program.label }}</span>
                        @if (program.projects.length > 0 || program.directRisks.length > 0) {
                          <span class="vl-card-subtitle">
                            {{ program.projects.length }} projects · {{ getProgramRiskCount(program) }} risks
                          </span>
                        }
                      </div>
                    </div>
                    @if (program.projects.length > 0) {
                      <button
                        class="vl-expand-btn"
                        type="button"
                        [class.is-expanded]="isExpanded(program.key)"
                        (click)="toggleExpand(program.key); $event.stopPropagation()"
                        [attr.aria-label]="'Expand ' + program.label"
                      >
                        <span [pmConsoleIcon]="'chevron-right'"></span>
                      </button>
                    }
                  </div>

                  <!-- Expanded projects -->
                  @if (isExpanded(program.key)) {
                    <div class="vl-projects-expanded">
                      <div class="vl-project-connector-col">
                        <div class="vl-project-connector-line"></div>
                      </div>
                      <div class="vl-projects-list">
                        @for (project of program.projects; track project.key; let last = $last) {
                          <div class="vl-node-row project-row">
                            <div class="vl-project-arm" [class.is-last]="last"></div>
                            <div
                              class="vl-entity-card project-card"
                              [class.has-risks]="project.risks.length > 0"
                              (click)="openPanelForRisks(project.risks, project.label, 'project')"
                            >
                              @if (project.risks.length > 0) {
                                <span class="vl-risk-dot"></span>
                              }
                              <div class="vl-card-body">
                                <span class="vl-card-badge project">Project</span>
                                <span class="vl-card-title">{{ project.label }}</span>
                                @if (project.risks.length > 0) {
                                  <span class="vl-card-subtitle">{{ project.risks.length }} risk{{ project.risks.length > 1 ? 's' : '' }}</span>
                                }
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Standalone Projects -->
              @if (portfolio.standaloneProjects.risks.length > 0) {
                <div class="vl-entity-group">
                  @for (risk of getStandaloneProjectGroups(portfolio); track risk.linkedTo) {
                    <div class="vl-node-row">
                      <div class="vl-arm"></div>
                      <div
                        class="vl-entity-card project-card"
                        [class.has-risks]="true"
                        (click)="openPanelForRisks([risk], risk.linkedTo, 'project')"
                      >
                        <span class="vl-risk-dot"></span>
                        <div class="vl-card-body">
                          <span class="vl-card-badge project">Project</span>
                          <span class="vl-card-title">{{ risk.linkedTo }}</span>
                          <span class="vl-card-subtitle">1 risk</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Right Panel Drawer -->
      @if (panelOpen) {
        <div class="vl-panel-backdrop" (click)="closePanel()"></div>
        <div class="vl-panel" [class.is-open]="panelOpen">
          <div class="vl-panel-header">
            <div class="vl-panel-header-text">
              <span class="vl-panel-overline">RISK DETAILS</span>
              <h3 class="vl-panel-title">{{ panelEntityName }}</h3>
              <span class="vl-panel-subtitle">{{ panelEntityType | titlecase }}</span>
            </div>
            <button class="vl-panel-close" type="button" (click)="closePanel()" aria-label="Close panel">
              <span [pmConsoleIcon]="'x'"></span>
            </button>
          </div>
          <div class="vl-panel-body">
            @for (risk of panelRisks; track risk.id; let i = $index) {
              @if (i > 0) {
                <div class="vl-panel-divider"></div>
              }
              <div class="vl-risk-detail" [class.is-selected]="panelRisks.length > 1 && selectedRiskId === risk.id" (click)="selectedRiskId = risk.id">
                <!-- Risk ID & Name -->
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Risk ID</span>
                  <span class="vl-detail-value id-value">{{ risk.id }}</span>
                </div>
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Risk Name</span>
                  <span class="vl-detail-value name-value">{{ risk.name }}</span>
                </div>
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Linked To</span>
                  <span class="vl-detail-value">
                    <span class="vl-level-badge" [ngClass]="risk.level">{{ risk.level }}</span>
                    {{ risk.linkedTo }}
                  </span>
                </div>
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Owner</span>
                  <span class="vl-detail-value owner-value">
                    <span class="vl-avatar" [style.background]="'rgba(0, 122, 255, 0.08)'" [style.color]="'#007aff'">{{ risk.owner.initials }}</span>
                    {{ risk.owner.name }}
                  </span>
                </div>
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Mitigation</span>
                  <span class="vl-detail-value mitigation-value">{{ risk.mitigation }}</span>
                </div>
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Last Review</span>
                  <span class="vl-detail-value">{{ risk.lastReview }}</span>
                </div>
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Exposure</span>
                  <span class="vl-detail-value">
                    <span class="exposure-badge" [ngClass]="risk.exposure">{{ risk.exposure }}</span>
                  </span>
                </div>
                <div class="vl-detail-row">
                  <span class="vl-detail-label">Status</span>
                  <span class="vl-detail-value">
                    <span class="risk-status-badge" [ngClass]="risk.status">{{ risk.status }}</span>
                  </span>
                </div>
              </div>
            }
            @if (panelRisks.length === 0) {
              <div class="vl-panel-empty">No risks associated with this entity.</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      position: relative;
    }

    .vl-wrapper {
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
    }

    .vl-canvas {
      display: flex;
      flex-direction: column;
      gap: 40px;
      padding: 32px;
      background: #f8f9fb;
      border: 1px solid #e3e5e9;
      border-radius: 16px;
      min-height: 100%;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    }

    /* ── Portfolio-level layout row ── */
    .vl-layout {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }

    /* ── Portfolio Card (left) ── */
    .vl-portfolio-col {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      min-height: 100%;
    }

    .vl-portfolio-card {
      position: relative;
      width: 200px;
      min-height: 200px;
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 16px;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      cursor: default;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .vl-portfolio-card.has-risks {
      cursor: pointer;
    }

    .vl-portfolio-card.has-risks:hover {
      border-color: rgba(16, 6, 159, 0.25);
      box-shadow: 0 2px 8px rgba(16, 6, 159, 0.08);
    }

    .portfolio-title {
      font-size: 15px !important;
      font-weight: 700 !important;
      color: #10069f;
    }

    /* ── Connector column ── */
    .vl-connector-col {
      flex-shrink: 0;
      width: 48px;
      display: flex;
      align-items: center;
      position: relative;
      align-self: stretch;
    }

    .vl-connector-line {
      width: 100%;
      height: 1px;
      background: #cbd5e1;
      position: absolute;
      top: 50%;
    }

    /* ── Entities column (programs/projects) ── */
    .vl-entities-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      padding-left: 0;
    }

    /* Vertical trunk line running down the entities column */
    .vl-entities-col::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #cbd5e1;
    }

    .vl-entity-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Node row ── */
    .vl-node-row {
      display: flex;
      align-items: center;
      gap: 0;
      position: relative;
    }

    /* Horizontal arm from trunk to card */
    .vl-arm {
      flex-shrink: 0;
      width: 24px;
      height: 1px;
      background: #cbd5e1;
    }

    /* ── Entity Card ── */
    .vl-entity-card {
      position: relative;
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      padding: 14px 16px;
      min-width: 240px;
      max-width: 320px;
      display: flex;
      align-items: center;
      cursor: default;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    }

    .vl-entity-card.has-risks {
      cursor: pointer;
    }

    .vl-entity-card.has-risks:hover {
      border-color: rgba(0, 122, 255, 0.25);
      box-shadow: 0 2px 8px rgba(0, 122, 255, 0.08);
    }

    .project-card.has-risks:hover {
      border-color: rgba(74, 85, 104, 0.3);
      box-shadow: 0 2px 8px rgba(74, 85, 104, 0.08);
    }

    .vl-card-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 1;
      min-width: 0;
    }

    /* ── Card badge, title, subtitle ── */
    .vl-card-badge {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 10px;
      display: inline-flex;
      align-self: flex-start;
      line-height: 1.3;
    }

    .vl-card-badge.portfolio {
      background: rgba(16, 6, 159, 0.06);
      color: #10069f;
    }

    .vl-card-badge.program {
      background: rgba(0, 122, 255, 0.06);
      color: #007aff;
    }

    .vl-card-badge.project {
      background: rgba(74, 85, 104, 0.06);
      color: #4a5568;
    }

    .vl-card-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #252a34;
      line-height: 1.3;
    }

    .vl-card-subtitle {
      font-size: 12px;
      color: #718096;
      font-weight: 400;
    }

    /* ── Risk dot ── */
    .vl-risk-dot {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #D97706;
      border: 2px solid #ffffff;
      z-index: 2;
    }

    /* ── Expand button ── */
    .vl-expand-btn {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #e3e5e9;
      background: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 8px;
      color: #718096;
      font-size: 14px;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    }

    .vl-expand-btn:hover {
      background: #f4f5f7;
      border-color: #cbd5e1;
      color: #252a34;
    }

    .vl-expand-btn.is-expanded {
      transform: rotate(90deg);
      background: #f0f0ff;
      border-color: rgba(16, 6, 159, 0.2);
      color: #10069f;
    }

    /* ── Expanded Projects Sub-layout ── */
    .vl-projects-expanded {
      display: flex;
      gap: 0;
      margin-left: 24px; /* aligns with end of the arm */
      padding-left: 0;
      animation: fadeSlideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .vl-project-connector-col {
      flex-shrink: 0;
      width: 24px;
      position: relative;
      margin-left: 120px; /* offset past the program card width center */
    }

    .vl-project-connector-line {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #cbd5e1;
    }

    .vl-projects-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .project-row {
      position: relative;
    }

    .vl-project-arm {
      flex-shrink: 0;
      width: 24px;
      height: 1px;
      background: #cbd5e1;
      position: relative;
    }

    /* Vertical extension above the arm */
    .vl-project-arm::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      top: -28px; /* extends up to connect to trunk */
      width: 1px;
      background: #cbd5e1;
    }

    .vl-project-arm.is-last::before {
      top: -28px;
      bottom: 50%;
    }

    /* ── Right Panel Drawer ── */
    .vl-panel-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.12);
      z-index: 999;
      animation: backdropFade 0.2s ease;
    }

    @keyframes backdropFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .vl-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 440px;
      background: #ffffff;
      z-index: 1000;
      box-shadow: -4px 0 24px rgba(15, 23, 42, 0.10);
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .vl-panel.is-open {
      transform: translateX(0);
    }

    .vl-panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e3e5e9;
    }

    .vl-panel-header-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .vl-panel-overline {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--brand, #10069f);
    }

    .vl-panel-title {
      font-size: 16px;
      font-weight: 700;
      color: #252a34;
      margin: 0;
      line-height: 1.3;
    }

    .vl-panel-subtitle {
      font-size: 12px;
      color: #718096;
      font-weight: 400;
      text-transform: capitalize;
    }

    .vl-panel-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #e3e5e9;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #718096;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }

    .vl-panel-close:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #252a34;
    }

    /* ── Panel Body ── */
    .vl-panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px 32px;
    }

    .vl-risk-detail {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .vl-panel-divider {
      height: 1px;
      background: #e3e5e9;
      margin: 20px 0;
    }

    .vl-detail-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 0;
      border-bottom: 1px solid #f1f3f5;
    }

    .vl-detail-row:last-child {
      border-bottom: none;
    }

    .vl-detail-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8b95a5;
    }

    .vl-detail-value {
      font-size: 13.5px;
      color: #252a34;
      line-height: 1.5;
    }

    .vl-detail-value.id-value {
      font-weight: 600;
      color: #718096;
      font-size: 12px;
      letter-spacing: 0.03em;
    }

    .vl-detail-value.name-value {
      font-weight: 600;
      font-size: 14px;
    }

    .vl-detail-value.mitigation-value {
      color: #4a5568;
      line-height: 1.6;
    }

    .vl-detail-value.owner-value {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .vl-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 9.5px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .vl-level-badge {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 10px;
      margin-right: 6px;
      letter-spacing: 0.04em;
    }

    .vl-level-badge.portfolio {
      background: rgba(16, 6, 159, 0.06);
      color: #10069f;
    }

    .vl-level-badge.program {
      background: rgba(0, 122, 255, 0.06);
      color: #007aff;
    }

    .vl-level-badge.project {
      background: rgba(74, 85, 104, 0.06);
      color: #4a5568;
    }

    /* ── Exposure & Status badges (reused from parent) ── */
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

    .vl-panel-empty {
      text-align: center;
      padding: 40px 20px;
      color: #8b95a5;
      font-size: 13px;
    }
  `]
})
export class PortfolioWorkspaceRiskVisualComponent {
  @Input() groups: PortfolioGroup[] = [];

  expandedPrograms = new Set<string>();
  panelOpen = false;
  panelRisks: Risk[] = [];
  panelEntityName = '';
  panelEntityType = '';
  selectedRiskId = '';

  toggleExpand(key: string): void {
    if (this.expandedPrograms.has(key)) {
      this.expandedPrograms.delete(key);
    } else {
      this.expandedPrograms.add(key);
    }
    this.expandedPrograms = new Set(this.expandedPrograms);
  }

  isExpanded(key: string): boolean {
    return this.expandedPrograms.has(key);
  }

  openPanelForRisks(risks: Risk[], entityName: string, entityType: string): void {
    if (risks.length === 0) return;
    this.panelRisks = risks;
    this.panelEntityName = entityName;
    this.panelEntityType = entityType;
    this.selectedRiskId = risks[0].id;
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
    this.panelRisks = [];
    this.panelEntityName = '';
    this.panelEntityType = '';
    this.selectedRiskId = '';
  }

  getPortfolioRiskCount(portfolio: PortfolioGroup): number {
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

  getProgramRiskCount(program: ProgramGroup): number {
    let count = program.directRisks.length;
    for (const proj of program.projects) {
      count += proj.risks.length;
    }
    return count;
  }

  /** Group standalone project risks by their linkedTo field for card display */
  getStandaloneProjectGroups(portfolio: PortfolioGroup): Risk[] {
    const seen = new Set<string>();
    const result: Risk[] = [];
    for (const r of portfolio.standaloneProjects.risks) {
      if (!seen.has(r.linkedTo)) {
        seen.add(r.linkedTo);
        result.push(r);
      }
    }
    return result;
  }
}
