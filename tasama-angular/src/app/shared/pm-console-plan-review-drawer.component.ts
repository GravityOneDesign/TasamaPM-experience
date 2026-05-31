import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from './pm-console-icon.component';

@Component({
  selector: 'app-pm-console-plan-review-drawer',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="plan-drawer-shell" aria-live="polite">
      <button class="plan-drawer-backdrop" type="button" (click)="close.emit()" aria-label="Close plan drawer"></button>
      <aside class="plan-drawer" role="dialog" aria-modal="true" aria-label="Project Plan Review">
        
        <div class="drawer-inner">
          <header class="plan-header">
            <div class="plan-header-copy">
              <div class="header-top-row">
                <span class="eyebrow-text">REVIEW ACTION</span>
                <span class="plan-pill">Project Plan</span>
              </div>
              <h2 class="plan-title">{{ projectName }}</h2>
              <p class="plan-desc">
                Track blockers, open decisions, and delivery problems so ownership and next action are visible without opening another tool.
              </p>
            </div>
            <div class="drawer-header-actions">
              <button type="button" class="drawer-icon-btn" aria-label="Expand plan drawer">
                <span pmConsoleIcon="maximize-2" aria-hidden="true"></span>
              </button>
              <button type="button" class="drawer-icon-btn" aria-label="Close plan drawer" (click)="close.emit()">
                <span pmConsoleIcon="x" aria-hidden="true"></span>
              </button>
            </div>
          </header>

          <section class="drawer-body">
            <!-- Project Profile Card -->
            <div class="info-card">
              <div class="card-header" (click)="toggleSection('profile')" style="cursor: pointer;">
                <div class="card-title-group">
                  <div class="icon-square">
                    <span pmConsoleIcon="rocket" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Project Profile</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Toggle project profile">
                  <span [pmConsoleIcon]="isSectionExpanded('profile') ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                </button>
              </div>

              @if (isSectionExpanded('profile')) {
              <div class="profile-grid">
                <div class="grid-item">
                  <span class="grid-label">Project name</span>
                  <strong class="grid-value">{{ projectName }}</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Category</span>
                  <strong class="grid-value">Research & Development</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Business Unit</span>
                  <strong class="grid-value">Research Office</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">PMO Contact</span>
                  <strong class="grid-value">PMO Desk</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Project Manager</span>
                  <div class="user-cell">
                    <span class="avatar">MH</span>
                    <span class="grid-value">Muna Hassan</span>
                  </div>
                </div>
              </div>
              }
            </div>

            <!-- Purpose and Outcome Card -->
            <div class="info-card">
              <div class="card-header" (click)="toggleSection('purpose')" style="cursor: pointer;">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="info" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Purpose and outcome</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Toggle purpose and outcome">
                  <span [pmConsoleIcon]="isSectionExpanded('purpose') ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                </button>
              </div>

              @if (isSectionExpanded('purpose')) {
              <div class="card-content">
                <h4 class="section-title">Opportunity or Problem Statement</h4>
                <div class="statement-box">
                  <p>
                    Track blockers, open decisions, and delivery problems so ownership and next action are visible without
                    opening another tool. Track blockers, open decisions, and delivery problems so ownership and next action
                    are visible without opening another tool. Track blockers, open decisions, and delivery problems so ownership
                    and next action are visible without opening another tool.
                  </p>
                </div>

                <!-- Outcome Nested Card -->
                <div class="outcome-card">
                  <div class="outcome-header">
                    <div class="outcome-title-group">
                      <div class="icon-square border-only">
                        <span pmConsoleIcon="clipboard-check" class="border-icon" aria-hidden="true"></span>
                      </div>
                      <div>
                        <h4 class="outcome-title">Outcome</h4>
                        <p class="outcome-desc">Measurable outcomes expected from the project.</p>
                      </div>
                    </div>
                    <span class="records-badge">1 records</span>
                  </div>

                  <table class="outcome-table">
                    <thead>
                      <tr>
                        <th>Outcome</th>
                        <th>Measure</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Reduce fragmentation in research efforts</td>
                        <td>Discovery coverage</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="ai-component-row">
                  <span class="ai-label">AI component:</span>
                  <span class="ai-badge">No</span>
                </div>
              </div>
              }
            </div>

            <!-- Dates and scope Card -->
            <div class="info-card">
              <div class="card-header" (click)="toggleSection('dates')" style="cursor: pointer;">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="calendar" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Dates and scope</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Toggle dates and scope">
                  <span [pmConsoleIcon]="isSectionExpanded('dates') ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                </button>
              </div>

              @if (isSectionExpanded('dates')) {
              <div class="profile-grid">
                <div class="grid-item">
                  <span class="grid-label">Baseline Start date</span>
                  <strong class="grid-value">31/05/2026</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Baseline End date</span>
                  <strong class="grid-value">01/06/2026</strong>
                </div>
              </div>

              <div class="card-content mt-4">
                <h4 class="section-title">In Scope</h4>
                <div class="statement-box">
                  <p>
                    Track blockers, open decisions, and delivery problems so ownership and next action are visible without
                    opening another tool. Track blockers, open decisions, and delivery problems so ownership and next action
                    are visible without opening another tool. Track blockers, open decisions, and delivery problems so ownership
                    and next action are visible without opening another tool.
                  </p>
                </div>

                <!-- End Product Nested Card -->
                <div class="outcome-card">
                  <div class="outcome-header">
                    <div class="outcome-title-group">
                      <div class="icon-square border-only">
                        <span pmConsoleIcon="package-check" class="border-icon" aria-hidden="true"></span>
                      </div>
                      <div>
                        <h4 class="outcome-title">End Product (Deliverables)</h4>
                        <p class="outcome-desc">End deliverables produced by the project.</p>
                      </div>
                    </div>
                    <span class="records-badge">1 records</span>
                  </div>
                  <table class="outcome-table">
                    <thead>
                      <tr>
                        <th>Deliverable</th>
                        <th>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Research capability map</td>
                        <td>Delivery Office</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Management Product Nested Card -->
                <div class="outcome-card">
                  <div class="outcome-header">
                    <div class="outcome-title-group">
                      <div class="icon-square border-only">
                        <span pmConsoleIcon="clipboard-list" class="border-icon" aria-hidden="true"></span>
                      </div>
                      <div>
                        <h4 class="outcome-title">Management Product</h4>
                        <p class="outcome-desc">Management products required for governance.</p>
                      </div>
                    </div>
                    <span class="records-badge">1 records</span>
                  </div>
                  <table class="outcome-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Project initiation documentation</td>
                        <td>PMO</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              }
            </div>

            <!-- Budget baseline Card -->
            <div class="info-card">
              <div class="card-header" (click)="toggleSection('budget')" style="cursor: pointer;">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="dollar-sign" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Budget baseline</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Toggle budget baseline">
                  <span [pmConsoleIcon]="isSectionExpanded('budget') ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                </button>
              </div>

              @if (isSectionExpanded('budget')) {
              <div class="profile-grid">
                <div class="grid-item">
                  <span class="grid-label">CAPEX Baseline (FY)</span>
                  <strong class="grid-value">300,000 SAR</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">OPEX Baseline (FY)</span>
                  <strong class="grid-value">300,000 SAR</strong>
                </div>
              </div>
              }
            </div>

            <!-- Risks Card -->
            <div class="info-card">
              <div class="card-header" (click)="toggleSection('risks')" style="cursor: pointer;">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="triangle-alert" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Risks</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Toggle risks">
                  <span [pmConsoleIcon]="isSectionExpanded('risks') ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                </button>
              </div>

              @if (isSectionExpanded('risks')) {
              <div class="card-content">
                <div class="outcome-card">
                  <div class="outcome-header">
                    <div class="outcome-title-group">
                      <div class="icon-square border-only">
                        <span pmConsoleIcon="layout-template" class="border-icon" aria-hidden="true"></span>
                      </div>
                      <div>
                        <h4 class="outcome-title">Risks Register</h4>
                        <p class="outcome-desc">Risk, owner, and current exposure.</p>
                      </div>
                    </div>
                    <span class="records-badge">1 records</span>
                  </div>
                  <table class="outcome-table">
                    <thead>
                      <tr>
                        <th>Risk</th>
                        <th>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Stakeholder data quality</td>
                        <td>PMO</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              }
            </div>
          </section>
        </div>

        <!-- Action Footer -->
        <footer class="drawer-footer">
          <div class="footer-actions">
            <button type="button" class="btn-cancel" (click)="close.emit()">Cancel</button>
            <div class="more-actions-wrapper">
              <button type="button" class="btn-more" (click)="toggleMoreActions()">
                More actions
                <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
              </button>
              
              @if (isMoreActionsOpen) {
                <div class="more-actions-backdrop" (click)="closeMoreActions()"></div>
                <div class="more-actions-menu">
                  <button type="button" class="menu-item" (click)="closeMoreActions()">Recommend Revision</button>
                  <button type="button" class="menu-item" (click)="closeMoreActions()">Reassign</button>
                  <button type="button" class="menu-item" (click)="closeMoreActions()">Share</button>
                </div>
              }
            </div>
            <button type="button" class="btn-approve">Approve</button>
          </div>
        </footer>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      :host ::ng-deep .icon {
        color: #10069f !important;
      }

      .plan-drawer-shell {
        inset: 0;
        isolation: isolate;
        pointer-events: none;
        position: fixed;
        z-index: 1000;
      }

      .plan-drawer-backdrop {
        appearance: none;
        background: rgba(11, 11, 11, 0.4);
        border: none;
        inset: 0;
        opacity: 1;
        pointer-events: auto;
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        cursor: default;
      }

      .plan-drawer {
        background: var(--surface-default, #ffffff);
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.18);
        display: flex;
        flex-direction: column;
        height: 100%;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: min(720px, calc(100vw - 72px));
        max-width: 100%;
      }

      .drawer-inner {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        background-color: #f7f7fc;
      }

      /* Header */
      .plan-header {
        align-items: flex-start;
        background-color: #f7f7fc;
        border-bottom: 1px solid #dddddd;
        display: flex;
        gap: 24px;
        justify-content: space-between;
        min-height: 128px;
        padding: 24px;
      }

      .plan-header-copy {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .drawer-header-actions {
        align-items: center;
        display: flex;
        flex: 0 0 auto;
        gap: 12px;
      }

      .drawer-icon-btn {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        color: #10069f;
        cursor: pointer;
        display: inline-flex;
        height: 32px;
        justify-content: center;
        padding: 0;
        width: 32px;
      }

      .drawer-icon-btn .icon {
        height: 18px;
        width: 18px;
      }

      .header-top-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 0;
      }

      .eyebrow-text {
        color: #10069f;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .plan-pill {
        background: rgba(49, 136, 181, 0.1);
        color: #3188b5;
        font-size: 12px;
        font-weight: 300;
        padding: 4px 12px;
        border-radius: 6px;
      }

      .plan-title {
        color: #202633;
        font-size: 20px;
        font-weight: 600;
        line-height: 23px;
        margin: 0;
        letter-spacing: 0;
      }

      .plan-desc {
        color: #687182;
        font-size: 11px;
        font-weight: 500;
        line-height: 17px;
        margin: 0;
        max-width: 520px;
      }

      /* Body */
      .drawer-body {
        background: #f7f7fc;
        padding: 16px 24px 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      /* Cards */
      .info-card {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 2px rgba(1, 10, 15, 0.08);
        border: 1px solid #f4f7fb;
        padding: 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;
      }

      .card-title-group {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .icon-square {
        align-items: center;
        background: #f2f5ff;
        border: 1px solid #e2e7ff;
        border-radius: 10px;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 auto;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .icon-square .icon {
        height: 19px;
        stroke-width: 2;
        width: 19px;
      }
      
      .icon-square.border-only {
        background: #ffffff;
        border-color: #dfe4ee;
      }

      .border-icon {
        color: #10069f;
      }

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #0b0b0b;
        margin: 0;
      }

      .info-icon {
        color: #10069f;
        cursor: pointer;
        height: 16px;
        width: 16px;
      }

      .collapse-btn {
        background: none;
        border: 1px solid #dfe4ee;
        border-radius: 50%;
        color: #10069f;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      }

      /* Profile Grid */
      .profile-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px 16px;
        margin-top: 16px;
      }

      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .grid-label {
        color: #687182;
        font-size: 11px;
      }

      .grid-value {
        color: #0b0b0b;
        font-size: 12.5px;
        font-weight: 500;
      }
      
      .user-cell {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .avatar {
        background: #eef2ff;
        color: #10069f;
        font-size: 11px;
        font-weight: 600;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Purpose and Outcome */
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 16px;
      }

      .section-title {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
        color: #2f2f2f;
      }

      .statement-box {
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        padding: 20px;
        background: #ffffff;
      }
      
      .statement-box p {
        margin: 0;
        color: #687182;
        font-size: 13px;
        line-height: 1.6;
      }

      /* Outcome Nested Card */
      .outcome-card {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 12px;
      }

      .outcome-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px;
        border-bottom: 1px solid #f4f7fb;
        background: #ffffff;
      }

      .outcome-title-group {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .outcome-title-group .icon-square {
        background: #f2f5ff;
        border-color: #e2e7ff;
        height: 38px;
        width: 38px;
      }

      .outcome-title-group .border-icon {
        color: #10069f;
      }

      .outcome-title {
        margin: 0 0 8px;
        font-size: 15px;
        font-weight: 600;
        color: #0b0b0b;
      }

      .outcome-desc {
        margin: 0;
        font-size: 13px;
        color: #687182;
      }

      .records-badge {
        background: #f4f7fb;
        color: #556072;
        font-size: 12px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 999px;
      }

      .outcome-table {
        width: 100%;
        border-collapse: collapse;
      }

      .outcome-table th {
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        color: #687182;
        padding: 12px 20px;
        background: #f8fafc;
        border-bottom: 1px solid #edf2f7;
        border-top: 1px solid #edf2f7;
      }

      .outcome-table td {
        padding: 14px 20px;
        font-size: 13px;
        color: #303645;
        border-bottom: 1px solid #edf2f7;
      }
      
      .outcome-table tbody tr:last-child td {
        border-bottom: none;
      }

      .mt-4 {
        margin-top: 24px;
      }

      .ai-component-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
        justify-content: flex-start !important;
      }

      .ai-label {
        font-size: 12px;
        color: #0b0b0b;
      }

      .ai-badge {
        background: #f7f7fc;
        border: 1px solid #dfe4ee;
        border-radius: 6px;
        color: #10069f;
        font-size: 13px;
        font-weight: 600;
        padding: 4px 12px;
      }

      /* Footer */
      .drawer-footer {
        background: #ffffff;
        border-top: 1px solid #dddddd;
        bottom: 0;
        min-height: 73px;
        padding: 16px 24px;
        position: sticky;
        z-index: 3;
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
      }

      .footer-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .btn-cancel {
        background: transparent;
        border: none;
        color: #0b0b0b;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        padding: 10px 16px;
      }

      .btn-more {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 999px;
        color: #303645;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
      }

      .btn-more .icon {
        width: 16px;
        height: 16px;
        color: #10069f;
      }

      .more-actions-wrapper {
        position: relative;
        display: inline-block;
      }

      .more-actions-backdrop {
        position: fixed;
        inset: 0;
        z-index: 100;
        cursor: default;
      }

      .more-actions-menu {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        width: 220px;
        z-index: 101;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .menu-item {
        background: transparent;
        border: none;
        border-bottom: 1px solid #f1f5f9;
        text-align: left;
        padding: 16px 20px;
        color: #374151;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.15s ease;
      }
      
      .menu-item:last-child {
        border-bottom: none;
      }
      
      .menu-item:hover {
        background: #f8fafc;
      }

      .btn-approve {
        background: #10069f;
        border: none;
        border-radius: 999px;
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        padding: 10px 24px;
      }
    `
  ]
})
export class PmConsolePlanReviewDrawerComponent {
  @Input() projectName = 'Vision 2030';
  @Input() actionTitle = '';
  @Output() close = new EventEmitter<void>();
  isMoreActionsOpen = false;
  private readonly expandedSections = new Set<string>(['profile', 'purpose']);

  get actionDescription(): string {
    return 'Track blockers, open decisions, and delivery problems so ownership and next action are visible without opening another tool.';
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections.has(section);
  }

  toggleSection(section: string): void {
    if (this.expandedSections.has(section)) {
      this.expandedSections.delete(section);
    } else {
      this.expandedSections.add(section);
    }
  }

  toggleMoreActions() {
    this.isMoreActionsOpen = !this.isMoreActionsOpen;
  }

  closeMoreActions() {
    this.isMoreActionsOpen = false;
  }
}
