import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from './pm-console-icon.component';

@Component({
  selector: 'app-pm-console-governance-meeting-drawer',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gov-meeting-drawer-shell" aria-live="polite">
      <button class="gov-meeting-drawer-backdrop" type="button" (click)="close.emit()" aria-label="Close meeting drawer"></button>
      <aside class="gov-meeting-drawer" role="dialog" aria-modal="true" aria-label="Governance Meeting Details">
        <div class="drawer-inner">
          <header class="gov-meeting-header">
            <div class="header-top-row">
              <span class="eyebrow-text">UPCOMING EVENT</span>
              <span class="committee-pill">Governance Committee</span>
            </div>
            <h2 class="meeting-title">Annual Performance Review</h2>
            <div class="meta-row">
              <span class="meta-label">Forum Name:</span>
              <strong class="meta-value">Audit Committee</strong>
              <span class="meta-label">Category:</span>
              <span class="category-pill">Business Excellence</span>
            </div>
          </header>

          <section class="drawer-body">
            <!-- Meeting Details Card -->
            <div class="meeting-card">
              <div class="card-header">
                <div class="card-title-group">
                  <span pmConsoleIcon="calendar" class="card-icon" aria-hidden="true"></span>
                  <h3 class="card-title">Meeting Details</h3>
                  <span pmConsoleIcon="info" class="info-icon" aria-hidden="true"></span>
                </div>
                <button type="button" class="collapse-btn" aria-label="Collapse meeting details">
                  <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                </button>
              </div>

              <div class="meeting-grid">
                <div class="grid-item">
                  <span class="grid-label">Meeting Time</span>
                  <strong class="grid-value">2:00 PM</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Meeting Date</span>
                  <strong class="grid-value">01/06/2026</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Type</span>
                  <strong class="grid-value">In-person</strong>
                </div>
                <div class="grid-item">
                  <span class="grid-label">Location</span>
                  <strong class="grid-value">Conference Room 1</strong>
                </div>
              </div>

              <!-- Attendees Inner Card -->
              <div class="attendees-card">
                <div class="attendees-header">
                  <div class="attendees-title-group">
                    <div class="icon-square">
                      <span pmConsoleIcon="layout-grid" aria-hidden="true"></span>
                    </div>
                    <div>
                      <h4 class="attendees-title">Attendees</h4>
                      <p class="attendees-desc">List of meeting attendees</p>
                    </div>
                  </div>
                  <span class="attendees-badge">5 attendees</span>
                </div>
                <table class="attendees-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="user-cell">
                          <span class="avatar">MH</span>
                          <span class="user-name">Muna Hassan</span>
                        </div>
                      </td>
                      <td>Delivery Office</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="user-cell">
                          <span class="avatar">MH</span>
                          <span class="user-name">Muna Hassan</span>
                        </div>
                      </td>
                      <td>Delivery Office</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="user-cell">
                          <span class="avatar">MH</span>
                          <span class="user-name">Muna Hassan</span>
                        </div>
                      </td>
                      <td>Delivery Office</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="user-cell">
                          <span class="avatar">MH</span>
                          <span class="user-name">Muna Hassan</span>
                        </div>
                      </td>
                      <td>Delivery Office</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Forum Agenda / Watchlist -->
            <div class="agenda-section">
              <div class="card-header">
                <div class="card-title-group">
                  <span pmConsoleIcon="calendar-days" class="card-icon" aria-hidden="true"></span>
                  <h3 class="card-title">Forum Agenda / Watchlist <span class="header-count">| 4 items</span></h3>
                </div>
                <button type="button" class="collapse-btn" aria-label="Collapse agenda">
                  <span pmConsoleIcon="chevron-up" aria-hidden="true"></span>
                </button>
              </div>

              <div class="agenda-grid">
                <div class="agenda-card">
                  <span class="agenda-eyebrow">AGENDA ITEM 1</span>
                  <h4 class="agenda-title">Total active initiatives across sectors</h4>
                  <p class="agenda-desc">Agreement on current portfolio status and areas requiring intervention.</p>
                  <a href="#" class="agenda-link">View Project <span pmConsoleIcon="arrow-right" aria-hidden="true"></span></a>
                </div>
                <div class="agenda-card">
                  <span class="agenda-eyebrow">AGENDA ITEM 2</span>
                  <h4 class="agenda-title">Total active initiatives across sectors</h4>
                  <p class="agenda-desc">Agreement on current portfolio status and areas requiring intervention.</p>
                  <a href="#" class="agenda-link">View Program <span pmConsoleIcon="arrow-right" aria-hidden="true"></span></a>
                </div>
                <div class="agenda-card">
                  <span class="agenda-eyebrow">AGENDA ITEM 3</span>
                  <h4 class="agenda-title">Total active initiatives across sectors</h4>
                  <p class="agenda-desc">Agreement on current portfolio status and areas requiring intervention.</p>
                  <a href="#" class="agenda-link">View Risk <span pmConsoleIcon="arrow-right" aria-hidden="true"></span></a>
                </div>
                <div class="agenda-card">
                  <span class="agenda-eyebrow">AGENDA ITEM 4</span>
                  <h4 class="agenda-title">Total active initiatives across sectors</h4>
                  <p class="agenda-desc">Agreement on current portfolio status and areas requiring intervention.</p>
                  <a href="#" class="agenda-link">View Issue <span pmConsoleIcon="arrow-right" aria-hidden="true"></span></a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .gov-meeting-drawer-shell {
        inset: 0;
        isolation: isolate;
        pointer-events: none;
        position: fixed;
        z-index: 1000;
      }

      .gov-meeting-drawer-backdrop {
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

      .gov-meeting-drawer {
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
        height: 100%;
        overflow-y: auto;
        background-color: #f7f9fc;
      }

      /* Header */
      .gov-meeting-header {
        padding: 32px 40px;
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
        color: #4b5563;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .committee-pill {
        background: #eef2ff;
        color: #4338ca;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 999px;
      }

      .meeting-title {
        color: #111827;
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 16px;
      }

      .meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
      }

      .meta-label {
        color: #6b7280;
      }

      .meta-value {
        color: #374151;
        font-weight: 600;
        margin-right: 16px;
      }

      .category-pill {
        background: #f3e8ff;
        color: #7e22ce;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 999px;
      }

      /* Body */
      .drawer-body {
        padding: 32px 40px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      /* Cards */
      .meeting-card,
      .agenda-section {
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
        gap: 8px;
      }

      .card-icon {
        color: #4338ca;
      }

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }

      .header-count {
        color: #6b7280;
        font-weight: 400;
      }

      .info-icon {
        color: #9ca3af;
        cursor: pointer;
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

      /* Grid */
      .meeting-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 24px;
      }

      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .grid-label {
        color: #6b7280;
        font-size: 12px;
      }

      .grid-value {
        color: #374151;
        font-size: 14px;
        font-weight: 600;
      }

      /* Attendees Card */
      .attendees-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }

      .attendees-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        background: #f8fafc;
      }

      .attendees-title-group {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .icon-square {
        background: #eef2ff;
        color: #4338ca;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .attendees-title {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }

      .attendees-desc {
        margin: 0;
        font-size: 12px;
        color: #6b7280;
      }

      .attendees-badge {
        background: #f1f5f9;
        color: #475569;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 999px;
      }

      .attendees-table {
        width: 100%;
        border-collapse: collapse;
      }

      .attendees-table th {
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        padding: 12px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
      }

      .attendees-table td {
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 13px;
        color: #4b5563;
      }

      .attendees-table tr:last-child td {
        border-bottom: none;
      }

      .user-cell {
        display: flex;
        align-items: center;
        gap: 12px;
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

      .user-name {
        color: #374151;
      }

      /* Agenda Grid */
      .agenda-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .agenda-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
      }

      .agenda-eyebrow {
        color: #9ca3af;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }

      .agenda-title {
        color: #111827;
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 12px;
        line-height: 1.4;
      }

      .agenda-desc {
        color: #6b7280;
        font-size: 13px;
        margin: 0 0 16px;
        line-height: 1.5;
        flex-grow: 1;
      }

      .agenda-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: #4338ca;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
      }

      .agenda-link:hover {
        text-decoration: underline;
      }
    `
  ]
})
export class PmConsoleGovernanceMeetingDrawerComponent {
  @Output() close = new EventEmitter<void>();
}
