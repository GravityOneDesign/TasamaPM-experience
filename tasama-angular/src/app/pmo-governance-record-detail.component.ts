import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from './shared/pm-console-row-action-menu.component';
import {
  type PmoGovernanceRecordDetail,
  type PmoGovernanceRecordRelationBlock,
} from './pmo-governance-workspace.data';

@Component({
  selector: 'app-pmo-governance-record-detail',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsoleRowActionMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pmo-record-detail-view" [class.is-drawer]="presentation === 'drawer'" [attr.aria-label]="detail.recordId + ' record detail'">
      <header class="pmo-record-detail-header">
        <button class="pmo-record-back" type="button" [attr.aria-label]="closeButtonLabel" (click)="backSelected.emit()">
          <span [pmConsoleIcon]="closeButtonIcon" aria-hidden="true"></span>
        </button>

        <div class="pmo-record-title-block">
          <span class="pmo-record-field-label">
            Record Title
            <span pmConsoleIcon="circle-help" aria-hidden="true"></span>
          </span>
          <h2>{{ detail.title }}</h2>
        </div>

        <div class="pmo-record-header-actions" aria-label="Record actions">
          <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + detail.recordId">
            <button type="button" role="menuitem">
              <span pmConsoleIcon="pencil" aria-hidden="true"></span>
              <span>Edit record</span>
            </button>
            <button type="button" role="menuitem">
              <span pmConsoleIcon="history" aria-hidden="true"></span>
              <span>View activity</span>
            </button>
            <button class="danger" type="button" role="menuitem">
              <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
              <span>Delete record</span>
            </button>
          </app-pm-console-row-action-menu>
        </div>

        <dl class="pmo-record-header-meta" aria-label="Record identity">
          <div>
            <dt>Record Id</dt>
            <dd>{{ detail.recordId }}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span class="pmo-record-detail-status" [class.is-open]="detail.status === 'Open'" [class.is-closed]="detail.status === 'Closed'">
                {{ detail.status }}
              </span>
            </dd>
          </div>
        </dl>
      </header>

      <div class="pmo-record-detail-body">
        <section class="pmo-record-context-grid" aria-label="Record context">
          <div>
            <span>Forum</span>
            <strong>{{ detail.forum }}</strong>
          </div>
          <div>
            <span>Meeting</span>
            <strong>{{ detail.meeting }}</strong>
          </div>
        </section>

        <section class="pmo-record-section" aria-labelledby="record-overview-heading">
          <header class="pmo-record-section-header">
            <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
            <h3 id="record-overview-heading">Overview</h3>
          </header>

          <div class="pmo-record-field-grid">
            <div class="pmo-record-field is-wide">
              <span>Record Title <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.title }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Record Type <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.type }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Record Priority <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.priority }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Record Category <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.category }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Decision Date <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.decisionDate }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Created By <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.createdBy }}</strong>
            </div>
            <div class="pmo-record-field is-full">
              <span>Record Description <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <p>{{ detail.description }}</p>
            </div>
            <div class="pmo-record-field is-full">
              <span>Primary Agenda <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.primaryAgenda }}</strong>
            </div>
          </div>
        </section>

        <section class="pmo-record-section pmo-record-ownership" aria-labelledby="record-ownership-heading">
          <h3 id="record-ownership-heading">Ownership</h3>
          <div class="pmo-record-owner-grid">
            <div class="pmo-record-field">
              <span>Record Owner <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.owner }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Business Unit <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.businessUnit }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Responsible Officer <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.responsibleOfficer }}</strong>
            </div>
            <div class="pmo-record-field">
              <span>Record Approver <span pmConsoleIcon="circle-help" aria-hidden="true"></span></span>
              <strong>{{ detail.approver }}</strong>
            </div>
          </div>
        </section>

        <section class="pmo-record-related-grid" aria-label="Related record information">
          @for (block of primaryRelationBlocks; track block.id) {
            <article class="pmo-record-related-card">
              <h3>{{ block.title }} <span pmConsoleIcon="circle-help" aria-hidden="true"></span></h3>
              <div class="pmo-record-related-list">
                @for (item of block.items; track item.title) {
                  <div class="pmo-record-related-item">
                    <span>{{ item.title }}</span>
                    @if (item.meta) {
                      <small>{{ item.meta }}</small>
                    }
                  </div>
                } @empty {
                  <span class="pmo-record-empty-badge">{{ block.emptyLabel }}</span>
                }
              </div>
            </article>
          }

          <article class="pmo-record-related-card pmo-record-source-card">
            <h3>Related Sources & Recommendations <span pmConsoleIcon="circle-help" aria-hidden="true"></span></h3>
            @if (detail.relatedSource.recommendations.length) {
              <div class="pmo-record-source-table" role="table" aria-label="Related source recommendations">
                <div class="pmo-record-source-head" role="row">
                  <span role="columnheader">Source Name</span>
                  <span role="columnheader">Recommendations</span>
                </div>
                <div class="pmo-record-source-row" role="row">
                  <div role="cell">
                    <strong>{{ detail.relatedSource.sourceName }}</strong>
                    <small>
                      <span pmConsoleIcon="link" aria-hidden="true"></span>
                      {{ detail.relatedSource.linkLabel }}
                    </small>
                    <small>{{ detail.relatedSource.linkValue }}</small>
                  </div>
                  <ul role="cell">
                    @for (recommendation of detail.relatedSource.recommendations; track recommendation) {
                      <li>{{ recommendation }}</li>
                    }
                  </ul>
                </div>
              </div>
            } @else {
              <span class="pmo-record-empty-badge">No source available for this forum</span>
            }
          </article>

          <article class="pmo-record-related-card">
            <h3>{{ detail.relatedRisks.title }} <span pmConsoleIcon="circle-help" aria-hidden="true"></span></h3>
            <div class="pmo-record-related-list">
              @for (item of detail.relatedRisks.items; track item.title) {
                <div class="pmo-record-related-item">
                  <span>{{ item.title }}</span>
                </div>
              } @empty {
                <span class="pmo-record-empty-badge">{{ detail.relatedRisks.emptyLabel }}</span>
              }
            </div>
          </article>

          @for (block of secondaryRelationBlocks; track block.id) {
            <article class="pmo-record-related-card" [class.is-half]="block.id === 'links'">
              <h3>{{ block.title }} <span pmConsoleIcon="circle-help" aria-hidden="true"></span></h3>
              <div class="pmo-record-related-list">
                @for (item of block.items; track item.title) {
                  <div class="pmo-record-related-item">
                    <span>{{ item.title }}</span>
                    @if (item.meta) {
                      <small>{{ item.meta }}</small>
                    }
                  </div>
                } @empty {
                  <span class="pmo-record-empty-badge">{{ block.emptyLabel }}</span>
                }
              </div>
            </article>
          }
        </section>

        <section class="pmo-record-section pmo-record-activity" aria-labelledby="record-activity-heading">
          <header class="pmo-record-section-header">
            <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
            <h3 id="record-activity-heading">Activity Log</h3>
          </header>

          <div class="pmo-record-activity-toolbar">
            <select aria-label="Activity log filter">
              <option>Comments</option>
              <option>History</option>
              <option>All</option>
            </select>
            <button type="button">
              <span pmConsoleIcon="plus-circle" aria-hidden="true"></span>
              <span>Add Comments</span>
            </button>
          </div>

          <div class="pmo-record-activity-list">
            @for (entry of detail.activity; track entry.id) {
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
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-record-detail-view {
        display: grid;
        grid-row: 1 / -1;
        grid-template-rows: auto minmax(0, 1fr);
        height: 100%;
        min-height: 0;
        overflow: auto;
        padding: 22px 46px 32px;
      }

      .pmo-record-detail-view.is-drawer {
        padding: 20px 24px 28px;
      }

      .pmo-record-detail-header {
        align-items: start;
        display: grid;
        gap: 14px 16px;
        grid-template-columns: 38px minmax(0, 1fr) auto;
        min-width: 0;
        padding-bottom: 22px;
      }

      .pmo-record-back {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d7dde8;
        color: #697386;
        display: inline-flex;
        justify-content: center;
      }

      .pmo-record-back {
        border-radius: 999px;
        height: 34px;
        width: 34px;
      }

      .pmo-record-back:hover,
      .pmo-record-back:focus-visible {
        border-color: rgba(16, 6, 159, 0.32);
        color: #10069f;
        outline: none;
      }

      .pmo-record-title-block {
        display: grid;
        gap: 6px;
        min-width: 0;
      }

      .pmo-record-field-label,
      .pmo-record-field > span,
      .pmo-record-context-grid span,
      .pmo-record-header-meta dt {
        align-items: center;
        color: #526072;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 5px;
        letter-spacing: 0;
        line-height: 15px;
        text-transform: uppercase;
      }

      .pmo-record-field-label .icon,
      .pmo-record-field > span .icon,
      .pmo-record-related-card h3 .icon {
        color: #8c94a3;
        height: 12px;
        width: 12px;
      }

      .pmo-record-title-block h2 {
        color: #0b0b0b;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .pmo-record-header-actions {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .pmo-record-back .icon {
        height: 17px;
        width: 17px;
      }

      :host ::ng-deep .pmo-record-header-actions .pm-row-action-menu {
        display: inline-flex;
      }

      .pmo-record-header-meta {
        display: grid;
        gap: 24px;
        grid-column: 2 / -1;
        grid-template-columns: minmax(82px, max-content) minmax(96px, max-content);
        margin: 0;
        min-width: 0;
      }

      .pmo-record-header-meta div {
        display: grid;
        gap: 5px;
      }

      .pmo-record-header-meta dd {
        color: #1d252d;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-record-detail-status {
        align-items: center;
        background: #edf0f5;
        border: 1px solid #dce2ed;
        border-radius: 999px;
        color: #526072;
        display: inline-flex;
        min-height: 24px;
        padding: 2px 10px;
      }

      .pmo-record-detail-status.is-open {
        background: rgba(232, 119, 34, 0.12);
        border-color: rgba(232, 119, 34, 0.24);
        color: #91440d;
      }

      .pmo-record-detail-status.is-closed {
        background: rgba(173, 220, 145, 0.28);
        border-color: rgba(118, 181, 76, 0.24);
        color: #173f35;
      }

      .pmo-record-detail-body {
        background: #ffffff;
        display: grid;
        gap: 14px;
        min-width: 0;
      }

      .pmo-record-context-grid,
      .pmo-record-field-grid,
      .pmo-record-owner-grid,
      .pmo-record-related-grid {
        display: grid;
        min-width: 0;
      }

      .pmo-record-context-grid {
        border-bottom: 1px solid #e7ebf2;
        gap: 24px;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        padding-bottom: 14px;
      }

      .pmo-record-context-grid div {
        display: grid;
        gap: 5px;
        min-width: 0;
      }

      .pmo-record-context-grid strong {
        color: #2f2f2f;
        font-size: 13px;
        font-weight: 500;
        line-height: 19px;
      }

      .pmo-record-section {
        border-top: 1px solid #edf0f5;
        display: grid;
        gap: 14px;
        padding-top: 14px;
      }

      .pmo-record-section-header {
        align-items: center;
        display: flex;
        gap: 8px;
      }

      .pmo-record-section-header .icon {
        align-items: center;
        background: #eef2ff;
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        height: 18px;
        justify-content: center;
        width: 18px;
      }

      .pmo-record-section-header .icon svg {
        height: 13px;
        width: 13px;
      }

      .pmo-record-section h3,
      .pmo-record-related-card h3 {
        color: #1d252d;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin: 0;
      }

      .pmo-record-field-grid {
        gap: 16px 24px;
        grid-template-columns: minmax(260px, 2fr) repeat(3, minmax(120px, 1fr));
      }

      .pmo-record-owner-grid {
        gap: 16px 24px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .pmo-record-field {
        display: grid;
        gap: 6px;
        min-width: 0;
      }

      .pmo-record-field.is-wide {
        grid-column: span 1;
      }

      .pmo-record-field.is-full {
        grid-column: 1 / -1;
      }

      .pmo-record-field strong,
      .pmo-record-field p {
        color: #2f2f2f;
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;
        margin: 0;
      }

      .pmo-record-field p {
        max-width: 980px;
      }

      .pmo-record-related-grid {
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pmo-record-related-card {
        background: #f9fafc;
        border: 1px solid #e4e8f0;
        border-radius: 8px;
        display: grid;
        gap: 12px;
        min-height: 112px;
        min-width: 0;
        padding: 14px;
      }

      .pmo-record-related-card.is-half {
        grid-column: span 1;
      }

      .pmo-record-related-card h3 {
        align-items: center;
        display: inline-flex;
        gap: 5px;
      }

      .pmo-record-related-list {
        align-content: start;
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .pmo-record-related-item {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e7ebf2;
        border-radius: 7px;
        display: grid;
        gap: 6px;
        grid-template-columns: minmax(0, 1fr) auto;
        min-height: 34px;
        min-width: 0;
        padding: 7px 10px;
      }

      .pmo-record-related-item span {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
        min-width: 0;
      }

      .pmo-record-related-item small {
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
        align-content: start;
      }

      .pmo-record-source-table {
        background: #ffffff;
        border: 1px solid #e1e6ef;
        border-radius: 8px;
        display: grid;
        min-width: 0;
        overflow: hidden;
      }

      .pmo-record-source-head,
      .pmo-record-source-row {
        display: grid;
        grid-template-columns: minmax(140px, 0.85fr) minmax(0, 1.5fr);
      }

      .pmo-record-source-head {
        background: #f2f5fb;
      }

      .pmo-record-source-head span,
      .pmo-record-source-row > div,
      .pmo-record-source-row > ul {
        border-left: 1px solid #e1e6ef;
        color: #2f2f2f;
        font-size: 12px;
        line-height: 17px;
        margin: 0;
        padding: 10px;
      }

      .pmo-record-source-head span:first-child,
      .pmo-record-source-row > div:first-child {
        border-left: 0;
      }

      .pmo-record-source-head span {
        color: #526072;
        font-weight: 600;
      }

      .pmo-record-source-row > div {
        display: grid;
        gap: 7px;
      }

      .pmo-record-source-row strong {
        color: #1d252d;
        font-size: 12px;
        font-weight: 600;
        line-height: 17px;
      }

      .pmo-record-source-row small {
        align-items: center;
        color: #677184;
        display: inline-flex;
        font-size: 11px;
        gap: 5px;
        line-height: 15px;
      }

      .pmo-record-source-row small .icon {
        color: #10069f;
        height: 12px;
        width: 12px;
      }

      .pmo-record-source-row ul {
        display: grid;
        gap: 7px;
        list-style: none;
      }

      .pmo-record-source-row li {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
      }

      .pmo-record-activity-toolbar {
        align-items: center;
        display: flex;
        gap: 10px;
      }

      .pmo-record-activity-toolbar select {
        background: #ffffff;
        border: 1px solid #d7dde8;
        border-radius: 7px;
        color: #2f2f2f;
        font-size: 12px;
        height: 34px;
        min-width: 132px;
        padding: 0 10px;
      }

      .pmo-record-activity-toolbar button {
        align-items: center;
        background: transparent;
        border: 0;
        color: #10069f;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 6px;
        min-height: 34px;
        padding: 0 4px;
      }

      .pmo-record-activity-toolbar button .icon {
        height: 15px;
        width: 15px;
      }

      .pmo-record-activity-list {
        display: grid;
        gap: 10px;
      }

      .pmo-record-activity-item {
        border-top: 1px solid #edf0f5;
        display: grid;
        gap: 6px;
        padding-top: 10px;
      }

      .pmo-record-activity-item div {
        align-items: center;
        color: #677184;
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        gap: 8px;
        line-height: 16px;
      }

      .pmo-record-activity-item strong {
        color: #10069f;
        font-size: 12px;
        font-weight: 600;
      }

      .pmo-record-activity-item span {
        color: #677184;
        font-size: 12px;
      }

      .pmo-record-activity-item time {
        color: #677184;
        font-size: 12px;
        font-style: italic;
        margin-left: auto;
      }

      .pmo-record-activity-item p {
        color: #2f2f2f;
        font-size: 13px;
        line-height: 19px;
        margin: 0;
      }

      @media (max-width: 1100px) {
        .pmo-record-detail-header {
          grid-template-columns: 38px minmax(0, 1fr);
        }

        .pmo-record-header-actions {
          grid-column: 2;
          justify-content: flex-start;
        }

        .pmo-record-field-grid,
        .pmo-record-owner-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .pmo-record-detail-view {
          padding: 16px;
        }

        .pmo-record-detail-header,
        .pmo-record-context-grid,
        .pmo-record-field-grid,
        .pmo-record-owner-grid,
        .pmo-record-related-grid,
        .pmo-record-source-head,
        .pmo-record-source-row {
          grid-template-columns: 1fr;
        }

        .pmo-record-title-block,
        .pmo-record-header-actions,
        .pmo-record-header-meta {
          grid-column: 1;
        }

        .pmo-record-header-actions {
          flex-wrap: wrap;
        }

        .pmo-record-source-row > div,
        .pmo-record-source-row > ul {
          border-left: 0;
          border-top: 1px solid #e1e6ef;
        }

        .pmo-record-source-row > div:first-child {
          border-top: 0;
        }

        .pmo-record-activity-item time {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class PmoGovernanceRecordDetailComponent {
  @Input({ required: true }) detail!: PmoGovernanceRecordDetail;
  @Input() presentation: 'page' | 'drawer' = 'page';
  @Input() closeButtonLabel = 'Back to all records';
  @Input() closeButtonIcon = 'arrow-left';
  @Output() readonly backSelected = new EventEmitter<void>();

  get primaryRelationBlocks(): readonly PmoGovernanceRecordRelationBlock[] {
    return [
      this.detail.relatedAgendas,
      this.detail.relatedOutcomes,
      this.detail.relatedRecords,
      this.detail.relatedProjects,
    ];
  }

  get secondaryRelationBlocks(): readonly PmoGovernanceRecordRelationBlock[] {
    return [this.detail.relatedCapabilities, this.detail.relatedValueStreams, this.detail.relatedLinks];
  }
}
