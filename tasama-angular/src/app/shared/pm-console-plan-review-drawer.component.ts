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
            <div class="header-top-row">
              <span class="eyebrow-text">REVIEW ACTION</span>
              <span class="plan-pill">Project Plan</span>
            </div>
            <h2 class="plan-title">Vision 2030</h2>
            <p class="plan-desc">
              Track blockers, open decisions, and delivery problems so ownership and next action are visible without opening another tool.
            </p>
          </header>

          <section class="drawer-body">
            <!-- Project Profile Card -->
            <div class="info-card">
              <div class="card-header">
                <div class="card-title-group">
                  <div class="icon-square">
                    <span pmConsoleIcon="rocket" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Project Profile</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Collapse project profile">
                  <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                </button>
              </div>

              <div class="profile-grid">
                <div class="grid-item">
                  <span class="grid-label">Project name</span>
                  <strong class="grid-value">UAE Research Map</strong>
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
            </div>

            <!-- Purpose and Outcome Card -->
            <div class="info-card">
              <div class="card-header">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="info" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Purpose and outcome</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Collapse purpose and outcome">
                  <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                </button>
              </div>

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
                        <span pmConsoleIcon="layout-template" class="border-icon" aria-hidden="true"></span>
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
            </div>

            <!-- Dates and scope Card -->
            <div class="info-card">
              <div class="card-header">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="calendar" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Dates and scope</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Collapse dates and scope">
                  <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                </button>
              </div>

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
                        <span pmConsoleIcon="layout-template" class="border-icon" aria-hidden="true"></span>
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
                        <span pmConsoleIcon="layout-template" class="border-icon" aria-hidden="true"></span>
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
            </div>

            <!-- Budget baseline Card -->
            <div class="info-card">
              <div class="card-header">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="dollar-sign" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Budget baseline</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Collapse budget baseline">
                  <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                </button>
              </div>

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
            </div>

            <!-- Risks Card -->
            <div class="info-card">
              <div class="card-header">
                <div class="card-title-group">
                  <div class="icon-square border-only">
                    <span pmConsoleIcon="triangle-alert" class="border-icon" aria-hidden="true"></span>
                  </div>
                  <h3 class="card-title">Risks</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Collapse risks">
                  <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                </button>
              </div>

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
                  <button type="button" class="menu-item" (click)="closeMoreActions()">Recommend Rivision</button>
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
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        height: 100%;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: 800px;
        max-width: 100%;
      }

      .drawer-inner {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        background-color: #f7f9fc;
        padding-bottom: 24px;
      }

      /* Header */
      .plan-header {
        padding: 40px 40px 32px;
        background-color: #f7f9fc;
        border-bottom: 1px solid #e2e8f0;
      }

      .header-top-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .eyebrow-text {
        color: #111827;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .plan-pill {
        background: #e0f2fe;
        color: #0284c7;
        font-size: 12px;
        font-weight: 500;
        padding: 4px 12px;
        border-radius: 999px;
      }

      .plan-title {
        color: #111827;
        font-size: 28px;
        font-weight: 600;
        margin: 0 0 12px;
        letter-spacing: -0.5px;
      }

      .plan-desc {
        color: #6b7280;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
        max-width: 80%;
      }

      /* Body */
      .drawer-body {
        padding: 32px 40px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      /* Cards */
      .info-card {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid #f1f5f9;
        padding: 24px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .card-title-group {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .icon-square {
        background: #f5f3ff;
        color: #4338ca;
        border-radius: 8px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon-square.border-only {
        background: transparent;
        border: 1px solid #4338ca;
      }

      .border-icon {
        color: #111827;
      }

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }

      .info-icon {
        color: #9ca3af;
        cursor: pointer;
        height: 16px;
        width: 16px;
      }

      .collapse-btn {
        background: none;
        border: 1px solid #e5e7eb;
        border-radius: 50%;
        color: #4b5563;
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
      }

      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .grid-label {
        color: #6b7280;
        font-size: 13px;
      }

      .grid-value {
        color: #111827;
        font-size: 14px;
        font-weight: 500;
      }
      
      .user-cell {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .avatar {
        background: #eef2ff;
        color: #4338ca;
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
      }

      .section-title {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: #111827;
      }

      .statement-box {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        background: #ffffff;
      }
      
      .statement-box p {
        margin: 0;
        color: #6b7280;
        font-size: 13px;
        line-height: 1.6;
      }

      /* Outcome Nested Card */
      .outcome-card {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 8px;
      }

      .outcome-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px;
        border-bottom: 1px solid #f1f5f9;
        background: #ffffff;
      }

      .outcome-title-group {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .outcome-title-group .icon-square {
        border-color: #e5e7eb;
      }

      .outcome-title-group .border-icon {
        color: #4338ca;
      }

      .outcome-title {
        margin: 0 0 4px;
        font-size: 15px;
        font-weight: 600;
        color: #111827;
      }

      .outcome-desc {
        margin: 0;
        font-size: 13px;
        color: #6b7280;
      }

      .records-badge {
        background: #f1f5f9;
        color: #475569;
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
        color: #6b7280;
        padding: 16px 20px;
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
        border-top: 1px solid #e5e7eb;
      }

      .outcome-table td {
        padding: 16px 20px;
        font-size: 13px;
        color: #374151;
        border-bottom: 1px solid #e5e7eb;
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
      }

      .ai-label {
        font-size: 12px;
        color: #111827;
      }

      .ai-badge {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 600;
        padding: 4px 12px;
      }

      /* Footer */
      .drawer-footer {
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        padding: 20px 40px;
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
        color: #111827;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        padding: 10px 16px;
      }

      .btn-more {
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 999px;
        color: #374151;
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
        color: #6b7280;
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
        background: #1e1b4b; /* Dark navy blue from screenshot */
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
  @Output() close = new EventEmitter<void>();
  isMoreActionsOpen = false;

  toggleMoreActions() {
    this.isMoreActionsOpen = !this.isMoreActionsOpen;
  }

  closeMoreActions() {
    this.isMoreActionsOpen = false;
  }
}
