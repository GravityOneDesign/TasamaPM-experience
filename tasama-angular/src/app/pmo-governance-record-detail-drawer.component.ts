import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  type PmoGovernanceRecordDetail,
  type PmoGovernanceRecordRelationBlock,
} from './pmo-governance-workspace.data';

type PmoGovernanceRecordDetailTab = 'overview' | 'relationships' | 'activity';

@Component({
  selector: 'app-pmo-governance-record-detail-drawer',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (detail; as selectedRecord) {
      <div class="pmo-record-drawer-shell" aria-live="polite">
        <button class="pmo-record-drawer-backdrop" type="button" aria-label="Close record detail" (click)="closeSelected.emit()"></button>
        <aside class="pmo-record-drawer" role="dialog" aria-modal="true" [attr.aria-label]="selectedRecord.recordId + ' record detail'">
          <header class="pmo-record-drawer-head">
            <div class="pmo-record-drawer-title">
              <span>Governance record</span>
              <h2>{{ selectedRecord.title }}</h2>
              <p>{{ selectedRecord.type }} - {{ selectedRecord.forum }}</p>
            </div>
            <button class="pmo-record-drawer-close" type="button" aria-label="Close record detail" (click)="closeSelected.emit()">
              <span pmConsoleIcon="x" aria-hidden="true"></span>
            </button>
          </header>

          <section class="pmo-record-detail-view" [attr.aria-label]="selectedRecord.recordId + ' record workspace'">
            <nav class="pmo-record-detail-tabs" role="tablist" aria-label="Record detail sections">
              <button [class.active]="activeTab === 'overview'" type="button" role="tab" [attr.aria-selected]="activeTab === 'overview'" (click)="setActiveTab('overview')">
                Overview
              </button>
              <button [class.active]="activeTab === 'relationships'" type="button" role="tab" [attr.aria-selected]="activeTab === 'relationships'" (click)="setActiveTab('relationships')">
                Relationships
              </button>
              <button [class.active]="activeTab === 'activity'" type="button" role="tab" [attr.aria-selected]="activeTab === 'activity'" (click)="setActiveTab('activity')">
                Activity
              </button>
            </nav>

            @if (activeTab === 'overview') {
              <div class="pmo-record-detail-grid">
                <section class="pmo-record-panel pmo-record-main-panel" aria-labelledby="pmo-record-overview-heading">
                  <div class="pmo-record-panel-head">
                    <div>
                      <span>Record information</span>
                      <h3 id="pmo-record-overview-heading">Overview</h3>
                    </div>
                    <div class="pmo-record-panel-actions">
                      <span class="pmo-record-status-chip">{{ selectedRecord.status }}</span>
                      <button class="pmo-record-secondary-button" type="button">
                        <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                        <span>Edit Record</span>
                      </button>
                    </div>
                  </div>

                  <div class="pmo-record-overview-grid">
                    <div class="pmo-record-field is-wide">
                      <span>Record Title <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <strong>{{ selectedRecord.title }}</strong>
                    </div>
                    <div class="pmo-record-field">
                      <span>Record Type <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <strong>{{ selectedRecord.type }}</strong>
                    </div>
                    <div class="pmo-record-field">
                      <span>Priority <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <strong>{{ selectedRecord.priority }}</strong>
                    </div>
                    <div class="pmo-record-field">
                      <span>Category <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <strong>{{ selectedRecord.category }}</strong>
                    </div>
                    <div class="pmo-record-field">
                      <span>Decision Date <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <strong>{{ selectedRecord.decisionDate }}</strong>
                    </div>
                    <div class="pmo-record-field">
                      <span>Created By <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <strong>{{ selectedRecord.createdBy }}</strong>
                    </div>
                    <div class="pmo-record-field is-full">
                      <span>Record Description <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <p>{{ selectedRecord.description }}</p>
                    </div>
                    <div class="pmo-record-field is-full">
                      <span>Primary Agenda <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                      <strong>{{ selectedRecord.primaryAgenda }}</strong>
                    </div>
                  </div>
                </section>

                <aside class="pmo-record-side-stack" aria-label="Record details">
                  <section class="pmo-record-panel pmo-record-side-panel" aria-labelledby="pmo-record-identity-heading">
                    <div class="pmo-record-side-heading">
                      <span pmConsoleIcon="info" aria-hidden="true"></span>
                      <h3 id="pmo-record-identity-heading">Record Identity</h3>
                    </div>
                    <div class="pmo-record-side-fields">
                      <div class="pmo-record-field">
                        <span>Record ID <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                        <strong>{{ selectedRecord.recordId }}</strong>
                      </div>
                      <div class="pmo-record-field">
                        <span>Forum <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                        <strong>{{ selectedRecord.forum }}</strong>
                      </div>
                      <div class="pmo-record-field">
                        <span>Meeting <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                        <strong>{{ selectedRecord.meeting }}</strong>
                      </div>
                    </div>
                  </section>

                  <section class="pmo-record-panel pmo-record-side-panel" aria-labelledby="pmo-record-ownership-heading">
                    <div class="pmo-record-side-heading">
                      <span pmConsoleIcon="users" aria-hidden="true"></span>
                      <h3 id="pmo-record-ownership-heading">Ownership</h3>
                    </div>
                    <div class="pmo-record-side-fields">
                      <div class="pmo-record-field">
                        <span>Record Owner <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                        <strong>{{ selectedRecord.owner }}</strong>
                      </div>
                      <div class="pmo-record-field">
                        <span>Business Unit <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                        <strong>{{ selectedRecord.businessUnit }}</strong>
                      </div>
                      <div class="pmo-record-field">
                        <span>Responsible Officer <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                        <strong>{{ selectedRecord.responsibleOfficer }}</strong>
                      </div>
                      <div class="pmo-record-field">
                        <span>Record Approver <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
                        <strong>{{ selectedRecord.approver }}</strong>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            } @else if (activeTab === 'relationships') {
              <section class="pmo-record-relations" aria-label="Record relationships">
                @for (block of relationBlocks; track block.id) {
                  <article class="pmo-record-relation-card" [class.is-wide]="block.id === 'sources' || block.id === 'risks'">
                    <h3>{{ block.title }} <span pmConsoleIcon="circle-help" aria-hidden="true"></span></h3>
                    @if (block.id === 'sources' && selectedRecord.relatedSource.recommendations.length) {
                      <div class="pmo-record-source-card">
                        <strong>{{ selectedRecord.relatedSource.sourceName }}</strong>
                        <div class="pmo-record-source-link">
                          <span pmConsoleIcon="link" aria-hidden="true"></span>
                          <span>{{ selectedRecord.relatedSource.linkLabel }}: {{ selectedRecord.relatedSource.linkValue }}</span>
                        </div>
                        <ul>
                          @for (recommendation of selectedRecord.relatedSource.recommendations; track recommendation) {
                            <li>{{ recommendation }}</li>
                          }
                        </ul>
                      </div>
                    } @else {
                      <div class="pmo-record-relation-list">
                        @for (item of block.items; track item.title) {
                          <div class="pmo-record-relation-item">
                            <span>{{ item.title }}</span>
                            @if (item.meta) {
                              <small>{{ item.meta }}</small>
                            }
                          </div>
                        } @empty {
                          <span class="pmo-record-empty-badge">{{ block.emptyLabel }}</span>
                        }
                      </div>
                    }
                  </article>
                }
              </section>
            } @else {
              <section class="pmo-record-panel pmo-record-activity-panel" aria-labelledby="pmo-record-activity-heading">
                <div class="pmo-record-panel-head">
                  <div>
                    <span>Record activity</span>
                    <h3 id="pmo-record-activity-heading">Activity</h3>
                  </div>
                  <button class="pmo-record-secondary-button" type="button">
                    <span pmConsoleIcon="plus-circle" aria-hidden="true"></span>
                    <span>Add Comments</span>
                  </button>
                </div>

                <div class="pmo-record-activity-list">
                  @for (entry of selectedRecord.activity; track entry.id) {
                    <article class="pmo-record-activity-item">
                      <div>
                        @if (entry.actor) {
                          <strong>{{ entry.actor }}</strong>
                        }
                        @if (entry.meta) {
                          <span>{{ entry.meta }}</span>
                        }
                        @if (entry.timestamp) {
                          <time>{{ entry.timestamp }}</time>
                        }
                      </div>
                      <p>{{ entry.body }}</p>
                    </article>
                  }
                </div>
              </section>
            }
          </section>
        </aside>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-record-drawer-shell {
        inset: 0;
        isolation: isolate;
        pointer-events: none;
        position: fixed;
        z-index: 1000;
      }

      .pmo-record-drawer-backdrop {
        animation: motion-fade-in var(--motion-medium) var(--motion-ease) both;
        background: rgba(18, 24, 38, 0.22);
        inset: 0;
        pointer-events: auto;
        position: absolute;
      }

      .pmo-record-drawer {
        animation: motion-drawer-in var(--motion-medium) var(--motion-ease) backwards;
        background: #ffffff;
        bottom: 0;
        box-shadow: -22px 0 50px rgba(25, 33, 61, 0.2);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        max-width: calc(100vw - 28px);
        overflow: hidden;
        pointer-events: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: min(1040px, calc(100vw - 72px));
        will-change: opacity;
      }

      .pmo-record-drawer-head {
        align-items: flex-start;
        background: #f7f7fc;
        border-bottom: 1px solid #e4e7ef;
        display: flex;
        gap: 18px;
        justify-content: space-between;
        min-height: 98px;
        padding: 24px 28px 18px;
      }

      .pmo-record-drawer-title {
        display: grid;
        gap: 7px;
        min-width: 0;
      }

      .pmo-record-drawer-title span {
        color: #10069f;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 1;
        text-transform: uppercase;
      }

      .pmo-record-drawer-title h2 {
        color: #0b0b0b;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .pmo-record-drawer-title p {
        color: #687182;
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
        margin: 0;
      }

      .pmo-record-drawer-close {
        align-items: center;
        border-radius: 10px;
        color: #596273;
        display: inline-flex;
        flex: 0 0 36px;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .pmo-record-drawer-close:hover,
      .pmo-record-drawer-close:focus-visible {
        background: #eef1f7;
        outline: none;
      }

      .pmo-record-drawer-close .icon {
        height: 17px;
        width: 17px;
      }

      .pmo-record-detail-view {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
        overflow: auto;
        padding: 22px 32px 28px;
      }

      .pmo-record-detail-tabs {
        align-items: flex-end;
        border-bottom: 1px solid #dfe4ee;
        display: flex;
        gap: 42px;
        justify-content: flex-start;
        min-width: 0;
        overflow-x: auto;
      }

      .pmo-record-detail-tabs button {
        color: #404756;
        font-size: 12px;
        font-weight: 600;
        height: 38px;
        position: relative;
        white-space: nowrap;
      }

      .pmo-record-detail-tabs button.active {
        color: var(--brand);
      }

      .pmo-record-detail-tabs button.active::after {
        background: var(--brand);
        border-radius: 999px 999px 0 0;
        bottom: -1px;
        content: "";
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
      }

      .pmo-record-detail-grid {
        align-items: start;
        display: grid;
        gap: 20px;
        grid-template-columns: minmax(0, 1fr) 330px;
        min-width: 0;
        padding-top: 20px;
      }

      .pmo-record-panel {
        background: #ffffff;
        border: 1px solid #dfe4ee;
        border-radius: 8px;
        display: grid;
        min-width: 0;
      }

      .pmo-record-main-panel {
        gap: 18px;
        padding: 20px 18px;
      }

      .pmo-record-panel-head {
        align-items: start;
        display: flex;
        gap: 14px;
        justify-content: space-between;
        min-width: 0;
      }

      .pmo-record-panel-head > div:first-child,
      .pmo-record-drawer-title {
        min-width: 0;
      }

      .pmo-record-panel-head span,
      .pmo-record-field > span {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 5px;
        line-height: 16px;
      }

      .pmo-record-panel-head > div:first-child > span {
        color: #10069f;
        text-transform: uppercase;
      }

      .pmo-record-panel-head h3,
      .pmo-record-side-heading h3,
      .pmo-record-relation-card h3 {
        color: #0b0b0b;
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        margin: 4px 0 0;
      }

      .pmo-record-panel-actions {
        align-items: center;
        display: flex;
        flex: 0 0 auto;
        gap: 8px;
      }

      .pmo-record-status-chip {
        align-items: center;
        background: rgba(16, 6, 159, 0.08);
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        height: 30px;
        padding: 0 12px;
      }

      .pmo-record-secondary-button {
        align-items: center;
        background: #ffffff;
        border: 1px solid #cfd8ea;
        border-radius: 7px;
        color: #526388;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 6px;
        height: 34px;
        justify-content: center;
        padding: 0 13px;
      }

      .pmo-record-secondary-button .icon {
        height: 14px;
        width: 14px;
      }

      .pmo-record-overview-grid,
      .pmo-record-side-fields {
        display: grid;
        min-width: 0;
      }

      .pmo-record-overview-grid {
        gap: 16px 18px;
        grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
      }

      .pmo-record-field {
        display: grid;
        gap: 7px;
        min-width: 0;
      }

      .pmo-record-field.is-wide {
        grid-column: span 1;
      }

      .pmo-record-field.is-full {
        grid-column: 1 / -1;
      }

      .pmo-record-field > span .icon,
      .pmo-record-relation-card h3 .icon {
        color: #8c94a3;
        height: 13px;
        width: 13px;
      }

      .pmo-record-field strong,
      .pmo-record-field p {
        color: #2f2f2f;
        font-size: 13px;
        font-weight: 500;
        line-height: 19px;
        margin: 0;
      }

      .pmo-record-field p {
        max-width: 72ch;
      }

      .pmo-record-side-stack {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .pmo-record-side-panel {
        gap: 18px;
        padding: 20px 18px;
      }

      .pmo-record-side-heading {
        align-items: center;
        display: flex;
        gap: 12px;
      }

      .pmo-record-side-heading > .icon {
        color: #10069f;
        height: 26px;
        width: 26px;
      }

      .pmo-record-side-heading h3 {
        margin: 0;
      }

      .pmo-record-side-fields {
        gap: 14px;
      }

      .pmo-record-relations {
        align-content: start;
        align-items: start;
        display: grid;
        gap: 16px;
        grid-auto-rows: max-content;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        min-width: 0;
        padding-top: 20px;
      }

      .pmo-record-relation-card {
        align-self: start;
        background: #f9fafc;
        border: 1px solid #e4e8f0;
        border-radius: 8px;
        box-sizing: border-box;
        display: grid;
        gap: 12px;
        min-height: 118px;
        min-width: 0;
        padding: 16px;
      }

      .pmo-record-relation-card.is-wide {
        grid-column: 1 / -1;
      }

      .pmo-record-relation-card h3 {
        align-items: center;
        display: inline-flex;
        gap: 5px;
        margin: 0;
      }

      .pmo-record-relation-list {
        align-content: start;
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .pmo-record-relation-item {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e7ebf2;
        border-radius: 7px;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
        min-height: 34px;
        min-width: 0;
        padding: 7px 10px;
      }

      .pmo-record-relation-item span,
      .pmo-record-source-card li {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
        min-width: 0;
      }

      .pmo-record-relation-item small {
        color: #677184;
        font-size: 11px;
        font-weight: 600;
        line-height: 15px;
      }

      .pmo-record-empty-badge {
        align-items: center;
        align-self: start;
        background: #8b95a6;
        border-radius: 6px;
        color: #ffffff;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        justify-self: center;
        line-height: 14px;
        min-height: 26px;
        padding: 6px 10px;
      }

      .pmo-record-source-card {
        background: #ffffff;
        border: 1px solid #e7ebf2;
        border-radius: 7px;
        display: grid;
        gap: 8px;
        padding: 10px;
      }

      .pmo-record-source-card strong {
        color: #1d252d;
        font-size: 12px;
        font-weight: 600;
        line-height: 17px;
      }

      .pmo-record-source-link {
        align-items: center;
        color: #677184;
        display: flex;
        font-size: 11px;
        gap: 6px;
        line-height: 15px;
      }

      .pmo-record-source-link .icon {
        color: #10069f;
        height: 12px;
        width: 12px;
      }

      .pmo-record-source-card ul {
        display: grid;
        gap: 6px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .pmo-record-activity-panel {
        gap: 16px;
        margin-top: 20px;
        padding: 20px 18px;
      }

      .pmo-record-activity-list {
        display: grid;
        gap: 10px;
        min-width: 0;
      }

      .pmo-record-activity-item {
        border-top: 1px solid #edf0f5;
        display: grid;
        gap: 6px;
        min-width: 0;
        padding-top: 10px;
      }

      .pmo-record-activity-item:first-child {
        border-top: 0;
        padding-top: 0;
      }

      .pmo-record-activity-item div {
        align-items: center;
        color: #677184;
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        gap: 8px;
        line-height: 16px;
        min-width: 0;
      }

      .pmo-record-activity-item strong {
        color: #10069f;
        font-size: 12px;
        font-weight: 600;
      }

      .pmo-record-activity-item span,
      .pmo-record-activity-item time {
        color: #677184;
        font-size: 12px;
      }

      .pmo-record-activity-item time {
        font-style: italic;
        margin-left: auto;
      }

      .pmo-record-activity-item p {
        color: #2f2f2f;
        font-size: 13px;
        line-height: 19px;
        margin: 0;
      }

      @media (max-width: 980px) {
        .pmo-record-detail-grid,
        .pmo-record-relations,
        .pmo-record-overview-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-record-panel-head,
        .pmo-record-panel-actions {
          align-items: flex-start;
          flex-direction: column;
        }
      }

      @media (max-width: 760px) {
        .pmo-record-drawer {
          max-width: 100vw;
          width: 100vw;
        }

        .pmo-record-drawer-head,
        .pmo-record-detail-view {
          padding-left: 16px;
          padding-right: 16px;
        }

        .pmo-record-detail-tabs {
          gap: 24px;
        }
      }
    `,
  ],
})
export class PmoGovernanceRecordDetailDrawerComponent {
  @Input({ required: true }) detail!: PmoGovernanceRecordDetail;
  @Output() readonly closeSelected = new EventEmitter<void>();

  activeTab: PmoGovernanceRecordDetailTab = 'overview';

  get relationBlocks(): readonly PmoGovernanceRecordRelationBlock[] {
    return [
      this.detail.relatedAgendas,
      this.detail.relatedOutcomes,
      this.detail.relatedRecords,
      this.detail.relatedProjects,
      {
        id: 'sources',
        title: 'Related Sources & Recommendations',
        emptyLabel: 'No Sources',
        items: this.detail.relatedSource.recommendations.map((recommendation) => ({ title: recommendation })),
      },
      this.detail.relatedRisks,
      this.detail.relatedCapabilities,
      this.detail.relatedValueStreams,
      this.detail.relatedLinks,
    ];
  }

  setActiveTab(tab: PmoGovernanceRecordDetailTab): void {
    this.activeTab = tab;
  }
}
