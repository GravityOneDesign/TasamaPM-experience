import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import {
  PmoGovernanceForumOverviewComponent,
  type PmoGovernanceForumOverviewDraft,
} from './pmo-governance-forum-overview.component';
import { PmoGovernanceIssueDrawerComponent } from './pmo-governance-issue-drawer.component';
import { PmoGovernanceMeetingDrawerComponent } from './pmo-governance-meeting-drawer.component';
import { PmoGovernanceRecordDrawerComponent } from './pmo-governance-record-drawer.component';
import { PmoGovernanceSourceDrawerComponent } from './pmo-governance-source-drawer.component';
import { PmoGovernanceWatchlistRiskDrawerComponent } from './pmo-governance-watchlist-risk-drawer.component';
import { PmConsoleExpandableSearchComponent } from './shared/pm-console-expandable-search.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import {
  PmConsoleRegisterTableComponent,
  type PmConsoleRegisterTableColumn,
  type PmConsoleRegisterTableRow,
} from './shared/pm-console-register-table.component';
import {
  pmoGovernanceForumDetailTabs,
  pmoGovernanceForumIssueEmptyState,
  pmoGovernanceForumRecordRows,
  pmoGovernanceForumSourceRows,
  pmoGovernancePastMeetingRows,
  pmoGovernanceWatchlistCategories,
  pmoGovernanceWatchlistRows,
  type PmoGovernanceForumDetailTabId,
  type PmoGovernanceForumRow,
  type PmoGovernanceIssueDraft,
  type PmoGovernanceMeetingDraft,
  type PmoGovernanceMeetingRow,
  type PmoGovernanceRecordDraft,
  type PmoGovernanceRecordRow,
  type PmoGovernanceRecordScope,
  type PmoGovernanceSourceDraft,
  type PmoGovernanceSourceRow,
  type PmoGovernanceSourceScope,
  type PmoGovernanceWatchlistCategoryId,
  type PmoGovernanceWatchlistSelection,
  type PmoGovernanceWatchlistRow,
} from './pmo-governance-workspace.data';

interface PmoGovernanceForumDetailDrawerTab {
  readonly id: PmoGovernanceForumDetailTabId;
  readonly label: string;
}

@Component({
  selector: 'app-pmo-governance-forum-detail-drawer',
  standalone: true,
  imports: [
    PmConsoleExpandableSearchComponent,
    PmConsoleIconComponent,
    PmConsoleRegisterTableComponent,
    PmoGovernanceForumOverviewComponent,
    PmoGovernanceIssueDrawerComponent,
    PmoGovernanceMeetingDrawerComponent,
    PmoGovernanceRecordDrawerComponent,
    PmoGovernanceSourceDrawerComponent,
    PmoGovernanceWatchlistRiskDrawerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (currentForum; as selectedForum) {
      <div class="pmo-forum-drawer-shell" aria-live="polite">
        <button class="pmo-forum-drawer-backdrop" type="button" aria-label="Close forum drawer" (click)="closeSelected.emit()"></button>
        <aside class="pmo-forum-drawer" role="dialog" aria-modal="true" [attr.aria-label]="selectedForum.forumName + ' forum detail'">
          <header class="pmo-forum-drawer-head">
            <div class="pmo-forum-drawer-title">
              <span>Governance forum</span>
              <h2>{{ selectedForum.forumName }}</h2>
              <p>{{ selectedForum.type }} - {{ selectedForum.category }}</p>
            </div>
            <button class="pmo-forum-drawer-close" type="button" aria-label="Close forum drawer" (click)="closeSelected.emit()">
              <span pmConsoleIcon="x" aria-hidden="true"></span>
            </button>
          </header>

          <section class="pmo-forum-detail-view" [attr.aria-label]="selectedForum.forumName + ' forum workspace'">
            <nav class="pmo-forum-detail-tabs" role="tablist" aria-label="Forum detail sections">
              @for (tab of forumDetailTabs; track tab.id) {
                <button
                  [class.active]="activeForumDetailTab === tab.id"
                  type="button"
                  role="tab"
                  [attr.aria-selected]="activeForumDetailTab === tab.id"
                  (click)="setForumDetailTab(tab.id)"
                >
                  {{ tab.label }}
                </button>
              }
            </nav>

            @if (activeForumDetailTab === 'overview') {
              <app-pmo-governance-forum-overview [forum]="selectedForum" (forumSave)="saveForumOverview($event)" />
            } @else if (activeForumDetailTab === 'meetings') {
              <section class="pmo-meetings-register" aria-label="Forum meetings">
                <div class="pmo-meeting-section-heading">
                  <h3>Upcoming Meetings</h3>
                  <button class="pm-table-add-project pmo-create-meeting" type="button" (click)="openMeetingDrawer()">
                    <span pmConsoleIcon="plus" aria-hidden="true"></span>
                    <span>Create New Meeting</span>
                  </button>
                </div>

                <app-pm-console-register-table
                  class="pmo-forum-register-table pmo-upcoming-meeting-register"
                  [columns]="meetingRegisterColumns"
                  [rows]="upcomingMeetingRegisterRows"
                  ariaLabel="Upcoming meetings"
                  itemName="meetings"
                  [selectable]="false"
                  [showToolbar]="false"
                  [showSearch]="false"
                  [showFilter]="false"
                  [showExport]="false"
                  emptyTitle="No Meeting!"
                ></app-pm-console-register-table>

                <div class="pmo-meeting-section-heading pmo-past-meeting-heading">
                  <h3>Past Meetings</h3>
                  <app-pm-console-expandable-search
                    class="pmo-meeting-search"
                    [ariaLabel]="'Search past meetings'"
                    [placeholder]="'Search'"
                    [value]="meetingSearchQuery"
                    (searchChange)="setMeetingSearchQuery($event)"
                  />
                </div>

                <app-pm-console-register-table
                  class="pmo-forum-register-table pmo-past-meeting-register"
                  [columns]="pastMeetingRegisterColumns"
                  [rows]="pastMeetingRegisterRows"
                  ariaLabel="Past meetings"
                  itemName="meetings"
                  [selectable]="false"
                  [showToolbar]="false"
                  [showSearch]="false"
                  [showFilter]="false"
                  [showExport]="false"
                  emptyTitle="No meetings match your search"
                ></app-pm-console-register-table>

              </section>
            } @else if (activeForumDetailTab === 'sources') {
              <section class="pmo-forum-sources-register" aria-label="Forum sources">
                <div class="pmo-forum-source-toolbar">
                  <div class="pmo-viewing-control" aria-label="Forum source visibility">
                    <span>Viewing</span>
                    <button
                      [class.active]="forumSourceScope === 'mine'"
                      type="button"
                      [attr.aria-pressed]="forumSourceScope === 'mine'"
                      (click)="setForumSourceScope('mine')"
                    >
                      My Sources (0)
                    </button>
                    <button
                      [class.active]="forumSourceScope === 'all'"
                      type="button"
                      [attr.aria-pressed]="forumSourceScope === 'all'"
                      (click)="setForumSourceScope('all')"
                    >
                      All Sources (8)
                    </button>
                  </div>

                  <div class="pmo-forum-actions">
                    <app-pm-console-expandable-search
                      class="pmo-meeting-search pmo-forum-source-search"
                      [ariaLabel]="'Search forum sources'"
                      [placeholder]="'Search'"
                      [value]="forumSourceSearchQuery"
                      (searchChange)="setForumSourceSearchQuery($event)"
                    />
                    <button class="pm-table-add-project pmo-add-source" type="button" (click)="openSourceDrawer()">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      <span>Add Source</span>
                    </button>
                  </div>
                </div>

                <app-pm-console-register-table
                  class="pmo-forum-register-table pmo-forum-source-register"
                  [columns]="forumSourceRegisterColumns"
                  [rows]="forumSourceRegisterRows"
                  ariaLabel="Forum sources"
                  itemName="sources"
                  [selectable]="false"
                  [showToolbar]="false"
                  [showSearch]="false"
                  [showFilter]="false"
                  [showExport]="false"
                  emptyTitle="No sources match your search"
                ></app-pm-console-register-table>

              </section>
            } @else if (activeForumDetailTab === 'records') {
              <section class="pmo-forum-records-register" aria-label="Forum records">
                <div class="pmo-forum-source-toolbar pmo-forum-record-toolbar">
                  <div class="pmo-viewing-control" aria-label="Forum record visibility">
                    <span>Viewing</span>
                    <button
                      [class.active]="forumRecordScope === 'mine'"
                      type="button"
                      [attr.aria-pressed]="forumRecordScope === 'mine'"
                      (click)="setForumRecordScope('mine')"
                    >
                      My Records (0)
                    </button>
                    <button
                      [class.active]="forumRecordScope === 'all'"
                      type="button"
                      [attr.aria-pressed]="forumRecordScope === 'all'"
                      (click)="setForumRecordScope('all')"
                    >
                      All Records (24)
                    </button>
                    <button class="pmo-print-records-button" type="button">
                      <span pmConsoleIcon="printer" aria-hidden="true"></span>
                      <span>Print Forum Records</span>
                    </button>
                  </div>

                  <div class="pmo-forum-actions">
                    <app-pm-console-expandable-search
                      class="pmo-meeting-search pmo-forum-source-search"
                      [ariaLabel]="'Search forum records'"
                      [placeholder]="'Search'"
                      [value]="forumRecordSearchQuery"
                      (searchChange)="setForumRecordSearchQuery($event)"
                    />
                    <button class="pm-table-add-project pmo-add-source" type="button" (click)="openRecordDrawer()">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      <span>Add Record</span>
                    </button>
                  </div>
                </div>

                <app-pm-console-register-table
                  class="pmo-forum-register-table pmo-forum-record-register"
                  [columns]="forumRecordRegisterColumns"
                  [rows]="forumRecordRegisterRows"
                  ariaLabel="Forum records"
                  itemName="records"
                  [selectable]="false"
                  [showToolbar]="false"
                  [showSearch]="false"
                  [showFilter]="false"
                  [showExport]="false"
                  emptyTitle="No records match your search"
                ></app-pm-console-register-table>
              </section>
            } @else if (activeForumDetailTab === 'watchlist') {
              <section class="pmo-watchlist-register" aria-label="Forum watchlist">
                <nav class="pmo-watchlist-category-rail" aria-label="Watchlist categories">
                  @for (category of watchlistCategories; track category.id) {
                    <button
                      [class.active]="activeWatchlistCategory === category.id"
                      type="button"
                      [attr.aria-current]="activeWatchlistCategory === category.id ? 'page' : null"
                      (click)="setWatchlistCategory(category.id)"
                    >
                      <span class="pmo-watchlist-category-label">
                        <span [pmConsoleIcon]="watchlistCategoryIcon(category.id)" aria-hidden="true"></span>
                        <span>{{ category.label }}</span>
                      </span>
                      <span class="pmo-watchlist-category-count" [class.has-items]="category.total > 0">{{ category.total }}</span>
                    </button>
                  }
                </nav>

                <section class="pmo-watchlist-panel" [attr.aria-label]="activeWatchlistCategoryLabel + ' watchlist'">
                  <header class="pmo-watchlist-heading">
                    <h3>{{ activeWatchlistCategoryLabel }}</h3>
                    <button class="pm-table-add-project pmo-add-watchlist" type="button" (click)="openWatchlistDrawer()">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      <span>Add to Watchlist</span>
                    </button>
                  </header>

                  <app-pm-console-register-table
                    class="pmo-forum-register-table pmo-watchlist-register-table"
                    [columns]="watchlistRegisterColumns"
                    [rows]="watchlistRegisterRows"
                    ariaLabel="Watchlist items"
                    itemName="watchlist items"
                    [selectable]="false"
                    [showToolbar]="false"
                    [showSearch]="false"
                    [showFilter]="false"
                    [showExport]="false"
                    emptyTitle="No watchlist items available"
                  >
                    <ng-template #registerTableRowDetail let-row>
                      <div class="pmo-watchlist-records-panel">
                        <span>Records</span>
                        <button class="pmo-watchlist-record-add" type="button">
                          <span pmConsoleIcon="plus" aria-hidden="true"></span>
                          <span>Add</span>
                        </button>
                        <div class="pmo-watchlist-no-records">
                          @let records = watchlistRecordsForRow(row.id);
                          @if (records.length) {
                            @for (record of records; track record) {
                              <strong>{{ record }}</strong>
                            }
                          } @else {
                            <span>No Record Added</span>
                          }
                        </div>
                      </div>
                    </ng-template>
                  </app-pm-console-register-table>
                </section>
              </section>
            } @else if (activeForumDetailTab === 'issues') {
              <section class="pmo-issues-register" aria-label="Forum issues">
                <header class="pmo-issues-toolbar">
                  <button class="pm-table-add-project pmo-add-issue" type="button" (click)="openIssueDrawer()">
                    <span pmConsoleIcon="plus" aria-hidden="true"></span>
                    <span>Add Issue</span>
                  </button>
                </header>

                <div class="pmo-issues-empty-state">
                  <p>{{ forumIssueEmptyState.message }}</p>
                  <span>{{ forumIssueEmptyState.badgeLabel }}</span>
                </div>
              </section>
            } @else {
              <section class="pmo-forum-detail-empty" aria-label="Forum detail empty state">
                <strong>{{ activeForumDetailLabel }}</strong>
                <span>No data is available for this forum section yet.</span>
              </section>
            }
          </section>
        </aside>
      </div>

      @if (sourceDrawerOpen) {
        <app-pmo-governance-source-drawer sourceContext="forum" (close)="closeSourceDrawer()" (save)="saveSourceDraft($event)" />
      }

      @if (recordDrawerOpen) {
        <app-pmo-governance-record-drawer (close)="closeRecordDrawer()" (save)="saveRecordDraft($event)" />
      }

      @if (meetingDrawerOpen) {
        <app-pmo-governance-meeting-drawer (close)="closeMeetingDrawer()" (save)="saveMeetingDraft($event)" />
      }

      @if (watchlistDrawerOpen) {
        <app-pmo-governance-watchlist-risk-drawer (close)="closeWatchlistDrawer()" (add)="saveWatchlistSelection($event)" />
      }

      @if (issueDrawerOpen) {
        <app-pmo-governance-issue-drawer (close)="closeIssueDrawer()" (save)="saveIssueDraft($event)" />
      }
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-forum-drawer-shell {
        inset: 0;
        isolation: isolate;
        pointer-events: none;
        position: fixed;
        z-index: 1000;
      }

      .pmo-forum-drawer-backdrop {
        animation: motion-fade-in var(--motion-medium) var(--motion-ease) both;
        background: rgba(18, 24, 38, 0.22);
        inset: 0;
        pointer-events: auto;
        position: absolute;
      }

      .pmo-forum-drawer {
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

      .pmo-forum-drawer-head {
        align-items: flex-start;
        background: #f7f7fc;
        border-bottom: 1px solid #e4e7ef;
        display: flex;
        gap: 18px;
        justify-content: space-between;
        min-height: 98px;
        padding: 24px 28px 18px;
      }

      .pmo-forum-drawer-title {
        display: grid;
        gap: 7px;
        min-width: 0;
      }

      .pmo-forum-drawer-title span {
        background: rgba(16, 6, 159, 0.08);
        border-radius: 4px;
        color: #10069f;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.8px;
        line-height: 1;
        padding: 4px 10px;
        text-transform: uppercase;
        width: fit-content;
      }

      .pmo-forum-drawer-title h2 {
        color: #0b0b0b;
        font-size: 22px;
        font-weight: 700;
        line-height: 26px;
        margin: 0;
      }

      .pmo-forum-drawer-title p {
        color: #687182;
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
        margin: 0;
      }

      .pmo-forum-drawer-close {
        align-items: center;
        border-radius: 10px;
        color: #596273;
        display: inline-flex;
        flex: 0 0 36px;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .pmo-forum-drawer-close:hover,
      .pmo-forum-drawer-close:focus-visible {
        background: #eef1f7;
        outline: none;
      }

      .pmo-forum-drawer-close .icon {
        height: 17px;
        width: 17px;
      }

      .pmo-forum-detail-view {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
        overflow: auto;
        padding: 22px 32px 28px;
      }

      .pmo-forum-detail-header {
        align-items: start;
        display: grid;
        gap: 18px;
        grid-template-columns: minmax(0, 1fr) auto;
        min-width: 0;
        padding: 0 0 32px;
      }

      .pmo-forum-detail-meta {
        display: grid;
        gap: 28px;
        grid-template-columns: minmax(220px, 1fr) 128px 178px;
        min-width: 0;
      }

      .pmo-forum-detail-field {
        display: grid;
        gap: 6px;
        min-width: 0;
      }

      .pmo-forum-detail-field span {
        color: #404756;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 16px;
        text-transform: uppercase;
      }

      .pmo-forum-detail-field strong {
        color: #1d252d;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-forum-detail-actions,
      .pmo-forum-actions,
      .pmo-viewing-control,
      .pmo-sort-header {
        align-items: center;
        display: flex;
      }

      .pmo-forum-detail-actions {
        gap: 6px;
        justify-content: flex-end;
      }

      .pmo-secondary-button {
        align-items: center;
        background: #ffffff;
        border: 1px solid #cfd8ea;
        border-radius: 7px;
        color: #526388;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 600;
        gap: 6px;
        height: 34px;
        justify-content: center;
        padding: 0 13px;
      }

      .pmo-secondary-button .icon {
        height: 14px;
        width: 14px;
      }

      .pmo-forum-action-button {
        height: 30px;
      }

      .pmo-forum-detail-tabs {
        align-items: flex-end;
        border-bottom: 1px solid #dfe4ee;
        display: flex;
        gap: 42px;
        justify-content: flex-start;
        min-width: 0;
        overflow-x: auto;
      }

      .pmo-forum-detail-tabs button {
        color: #404756;
        font-size: 12px;
        font-weight: 600;
        height: 38px;
        position: relative;
        white-space: nowrap;
      }

      .pmo-forum-detail-tabs button.active {
        color: var(--brand);
      }

      .pmo-forum-detail-tabs button.active::after {
        background: var(--brand);
        border-radius: 999px 999px 0 0;
        bottom: -1px;
        content: "";
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
      }

      .pmo-meetings-register,
      .pmo-forum-sources-register,
      .pmo-forum-records-register {
        display: block;
        min-height: 0;
        padding-top: 22px;
      }

      .pmo-meeting-section-heading {
        align-items: center;
        display: flex;
        justify-content: space-between;
        min-width: 0;
      }

      .pmo-meeting-section-heading h3 {
        color: #1d252d;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        margin: 0;
      }

      .pm-table-add-project {
        align-items: center;
        background: var(--brand);
        border: 1px solid var(--brand);
        border-radius: 7px;
        color: #ffffff;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 8px;
        height: var(--pm-toolbar-control-height, 38px);
        justify-content: center;
        min-width: 0;
        padding: 0 14px;
        white-space: nowrap;
      }

      .pm-table-add-project .icon {
        height: 15px;
        width: 15px;
      }

      .pmo-create-meeting {
        --pm-toolbar-control-height: 32px;
        border-radius: 4px;
        min-width: 140px;
      }

      .pmo-meeting-table-wrap {
        margin-top: 8px;
        min-height: 0;
        overflow: auto;
      }

      .pmo-forum-register-table {
        --register-empty-min-height: 112px;
        --register-table-scroll-height: min(348px, calc(100dvh - 356px));
        --register-table-scroll-min-height: 0;
        display: block;
        margin-top: 8px;
        min-width: 0;
      }

      .pmo-upcoming-meeting-register {
        --register-empty-min-height: 112px;
        --register-table-scroll-height: 154px;
        --register-table-scroll-min-height: 154px;
      }

      .pmo-forum-table {
        border: 1px solid #dfe4ee;
        border-collapse: separate;
        border-radius: 8px;
        border-spacing: 0;
        color: #202633;
        min-width: 820px;
        overflow: hidden;
        table-layout: fixed;
        width: 100%;
      }

      .pmo-forum-table th,
      .pmo-forum-table td {
        border-bottom: 1px solid #eceef3;
        border-left: 1px solid #eef1f6;
        font-size: 12px;
        line-height: 16px;
        padding: 10px 18px;
        text-align: left;
        vertical-align: middle;
      }

      .pmo-forum-table th:first-child,
      .pmo-forum-table td:first-child {
        border-left: 0;
      }

      .pmo-forum-table th {
        background: #f6f8fc;
        color: #252a34;
        font-weight: 600;
        height: 42px;
      }

      .pmo-forum-table tbody tr:nth-child(even) td {
        background: #f8f9fb;
      }

      .pmo-forum-table tbody tr:hover td {
        background: #fbfcff;
      }

      .pmo-forum-table tbody tr:last-child td {
        border-bottom: 0;
      }

      .pmo-meeting-col-date {
        width: 26%;
      }

      .pmo-meeting-col-name {
        width: 38%;
      }

      .pmo-meeting-col-count {
        width: 18%;
      }

      .pmo-center,
      .pmo-action-cell,
      .pmo-favorite-cell {
        text-align: center;
      }

      .pmo-sort-header {
        gap: 4px;
      }

      .pmo-sort-header .icon {
        color: var(--brand);
        height: 12px;
        width: 12px;
      }

      .pmo-forum-name {
        color: #1d252d;
        display: block;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-no-meeting-badge {
        background: #9a9a9a;
        color: #ffffff;
        display: table;
        font-size: 10px;
        font-weight: 600;
        line-height: 12px;
        margin: 0 auto;
        min-height: 23px;
        padding: 6px 10px 5px;
      }

      .pmo-past-meeting-heading {
        margin-top: 44px;
      }

      .workspace-search {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d7dde8;
        border-radius: 8px;
        color: #737d91;
        display: inline-flex;
        gap: 8px;
        min-width: 0;
        padding: 0 12px;
      }

      .workspace-search .icon {
        flex: 0 0 auto;
        height: 16px;
        width: 16px;
      }

      .workspace-search input {
        background: transparent;
        border: 0;
        color: #202633;
        font-size: 12px;
        min-width: 0;
        outline: 0;
        width: 100%;
      }

      .pmo-meeting-search {
        --pm-expandable-search-expanded-width: 180px;
        --pm-expandable-search-grow: 0;
        --pm-expandable-search-height: 32px;
        --pm-expandable-search-radius: 7px;
      }

      .pmo-past-meeting-table tbody tr:nth-child(even) td {
        background: #f3f3f3;
      }

      .pmo-forum-source-toolbar {
        align-items: center;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-width: 0;
        padding-bottom: 8px;
      }

      .pmo-viewing-control {
        color: #1d252d;
        flex-wrap: wrap;
        gap: 10px;
        min-width: 0;
      }

      .pmo-viewing-control > span {
        color: #404756;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        margin-right: 4px;
      }

      .pmo-viewing-control button,
      .pmo-print-records-button {
        background: #ffffff;
        border: 1px solid #d5dbea;
        border-radius: 7px;
        color: var(--brand);
        font-size: 12px;
        font-weight: 600;
        height: 32px;
        padding: 0 13px;
        white-space: nowrap;
      }

      .pmo-viewing-control button:hover,
      .pmo-viewing-control button:focus-visible {
        background: rgba(16, 6, 159, 0.06);
        border-color: rgba(16, 6, 159, 0.28);
      }

      .pmo-viewing-control button.active {
        background: rgba(16, 6, 159, 0.08);
        border-color: rgba(16, 6, 159, 0.34);
        box-shadow: inset 0 0 0 1px rgba(16, 6, 159, 0.08);
        color: var(--brand);
      }

      .pmo-forum-actions {
        gap: 12px;
        justify-content: flex-end;
        min-width: 0;
      }

      .pmo-add-source,
      .pmo-add-watchlist,
      .pmo-add-issue {
        --pm-toolbar-control-height: 32px;
        border-radius: 4px;
      }

      .pmo-add-source {
        min-width: 88px;
      }

      .pmo-forum-source-search {
        --pm-expandable-search-expanded-width: 180px;
      }

      .pmo-source-table {
        min-width: 940px;
      }

      .pmo-source-col-name {
        width: 32%;
      }

      .pmo-source-col-type {
        width: 13%;
      }

      .pmo-source-col-updated {
        width: 18%;
      }

      .pmo-source-col-count {
        width: 17%;
      }

      .pmo-record-table {
        min-width: 1040px;
      }

      .pmo-col-favorite {
        width: 48px;
      }

      .pmo-record-col-id {
        width: 74px;
      }

      .pmo-record-col-title {
        width: 35%;
      }

      .pmo-record-col-type {
        width: 96px;
      }

      .pmo-record-col-owner {
        width: 152px;
      }

      .pmo-record-col-due {
        width: 132px;
      }

      .pmo-record-col-status {
        width: 138px;
      }

      .pmo-favorite-button {
        color: #c8ced8;
        height: 28px;
        width: 28px;
      }

      .pmo-record-id {
        color: #1d252d;
        font-size: 12px;
        font-weight: 500;
      }

      .pmo-record-title {
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
      }

      .pmo-record-date {
        align-items: center;
        background: #858585;
        border-radius: 7px;
        color: #ffffff;
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        min-height: 32px;
        padding: 0 8px;
      }

      .pmo-record-date.is-open {
        background: #f05565;
      }

      .pmo-record-status {
        color: #333b4a;
        display: inline-flex;
        font-weight: 500;
        max-width: 100%;
      }

      .pmo-watchlist-register {
        align-items: stretch;
        display: grid;
        gap: 24px;
        grid-template-columns: 224px minmax(0, 1fr);
        min-height: max(520px, calc(100vh - 292px));
        padding-top: 20px;
      }

      .pmo-watchlist-category-rail {
        align-self: stretch;
        background: #ffffff;
        border: 0;
        border-right: 1px solid #dddddd;
        border-radius: 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0;
        min-height: 100%;
        overflow: visible;
        padding: 16px 16px 16px 0;
      }

      .pmo-watchlist-category-rail button {
        align-items: center;
        background: #ffffff;
        border-left: 1px solid transparent;
        border-radius: 12px;
        color: #404040;
        display: flex;
        font-size: 12px;
        font-weight: 500;
        gap: 8px;
        justify-content: space-between;
        min-height: 44px;
        padding: 12px 8px;
        position: relative;
        text-align: left;
        transition:
          background-color var(--motion-fast) var(--motion-ease),
          color var(--motion-fast) var(--motion-ease);
        width: 100%;
      }

      .pmo-watchlist-category-rail button + button {
        margin-top: 2px;
      }

      .pmo-watchlist-category-rail button.active {
        background: rgba(16, 6, 159, 0.03);
        border-left-color: var(--brand);
        border-radius: 8px;
        color: var(--brand);
        font-weight: 600;
      }

      .pmo-watchlist-category-rail button:hover,
      .pmo-watchlist-category-rail button:focus-visible {
        background: rgba(16, 6, 159, 0.05);
        color: var(--brand);
        outline: 0;
      }

      .pmo-watchlist-category-label {
        align-items: center;
        display: inline-flex;
        gap: 8px;
        min-width: 0;
      }

      .pmo-watchlist-category-label .icon {
        flex: 0 0 16px;
        height: 16px;
        width: 16px;
      }

      .pmo-watchlist-category-label span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-watchlist-category-count {
        align-items: center;
        background: #aaaaaa;
        border-radius: 999px;
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10px;
        font-weight: 600;
        height: 18px;
        justify-content: center;
        min-width: 18px;
        padding: 0 6px;
      }

      .pmo-watchlist-category-count.has-items {
        background: #22a06b;
      }

      .pmo-watchlist-panel {
        display: block;
        min-height: 0;
        min-width: 0;
      }

      .pmo-watchlist-heading {
        align-items: start;
        display: grid;
        gap: 8px;
        justify-items: start;
        min-width: 0;
      }

      .pmo-watchlist-heading h3 {
        color: #1d252d;
        font-size: 14px;
        font-weight: 600;
        line-height: 19px;
        margin: 0;
      }

      .pmo-add-watchlist {
        min-width: 160px;
      }

      .pmo-watchlist-heading strong {
        color: #333b4a;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
      }

      .pmo-watchlist-register-table {
        --register-cell-icon-color: #2f3a4b;
        margin-top: 5px;
      }

      .pmo-watchlist-col-name {
        width: 50%;
      }

      .pmo-watchlist-col-related {
        width: 26%;
      }

      .pmo-watchlist-col-owner {
        width: 20%;
      }

      .pmo-watchlist-col-action {
        width: 44px;
      }

      .pmo-watchlist-name {
        align-items: center;
        color: #2f3a4b;
        display: grid;
        gap: 8px;
        grid-template-columns: 16px minmax(0, 1fr);
        min-width: 0;
      }

      .pmo-watchlist-name strong {
        display: -webkit-box;
        font-size: 12px;
        font-weight: 600;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .pmo-watchlist-records-panel {
        display: grid;
        gap: 6px;
        padding: 10px 0 0 6px;
      }

      .pmo-watchlist-records-panel > span {
        color: #1f2937;
        font-size: 12px;
        line-height: 16px;
      }

      .pmo-watchlist-record-add {
        align-items: center;
        color: var(--brand);
        display: inline-flex;
        font-size: 13px;
        font-weight: 600;
        gap: 5px;
        justify-self: start;
        line-height: 18px;
      }

      .pmo-watchlist-no-records {
        align-items: center;
        background: #f1f5fc;
        color: #53565a;
        display: flex;
        font-size: 12px;
        justify-content: center;
        line-height: 16px;
        min-height: 20px;
        text-align: center;
      }

      .pmo-issues-register {
        display: grid;
        grid-template-rows: auto minmax(240px, 1fr);
        min-height: 360px;
        padding-top: 8px;
      }

      .pmo-issues-toolbar {
        align-items: center;
        display: flex;
        justify-content: flex-end;
        min-width: 0;
      }

      .pmo-add-issue {
        min-width: 112px;
      }

      .pmo-issues-empty-state {
        align-content: start;
        color: #53565a;
        display: grid;
        gap: 26px;
        justify-items: center;
        min-height: 260px;
        padding-top: 72px;
        text-align: center;
      }

      .pmo-issues-empty-state p {
        color: #53565a;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        margin: 0;
        max-width: min(760px, 100%);
      }

      .pmo-issues-empty-state span {
        align-items: center;
        background: #a8a8a8;
        border-radius: 4px;
        color: #ffffff;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        height: 24px;
        justify-content: center;
        min-width: 70px;
        padding: 0 10px;
      }

      .pmo-forum-detail-empty {
        align-items: center;
        color: #687182;
        display: grid;
        gap: 6px;
        justify-items: center;
        min-height: 300px;
        text-align: center;
      }

      .pmo-forum-detail-empty strong {
        color: #202633;
        font-size: 15px;
        font-weight: 600;
      }

      .pmo-forum-detail-empty span,
      .pmo-no-report-data {
        font-size: 12px;
        font-weight: 500;
      }

      .pmo-no-report-data {
        color: #555555;
        display: block;
        text-align: center;
      }

      @media (max-width: 1180px) {
        .pmo-forum-detail-header,
        .pmo-forum-source-toolbar {
          align-items: flex-start;
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-forum-detail-meta {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-forum-actions {
          justify-content: flex-start;
          width: 100%;
        }

        .pmo-watchlist-register {
          grid-template-columns: minmax(0, 1fr);
          min-height: 0;
        }

        .pmo-watchlist-category-rail {
          border-bottom: 1px solid #dddddd;
          border-right: 0;
          flex-direction: row;
          min-height: 0;
          overflow-x: auto;
          padding: 10px 0;
        }

        .pmo-watchlist-category-rail button + button {
          margin-left: 2px;
          margin-top: 0;
        }
      }

      @media (max-width: 760px) {
        .pmo-forum-drawer {
          max-width: none;
          width: 100vw;
        }

        .pmo-forum-drawer-head,
        .pmo-forum-detail-view {
          padding-left: 16px;
          padding-right: 16px;
        }

        .pmo-forum-detail-tabs {
          gap: 20px;
          justify-content: flex-start;
          overflow-x: auto;
        }

        .pmo-forum-detail-actions,
        .pmo-forum-actions,
        .pmo-meeting-section-heading {
          align-items: flex-start;
          flex-direction: column;
        }

        .pmo-meeting-search {
          --pm-expandable-search-expanded-width: min(180px, 100%);
        }

        .pmo-watchlist-category-rail {
          align-items: stretch;
          flex-direction: column;
          overflow-x: visible;
        }

        .pmo-watchlist-category-rail button + button {
          margin-left: 0;
          margin-top: 2px;
        }
      }
    `,
  ],
})
export class PmoGovernanceForumDetailDrawerComponent implements OnChanges {
  @Input() forum: PmoGovernanceForumRow | null = null;
  @Output() readonly closeSelected = new EventEmitter<void>();
  @Output() readonly forumUpdated = new EventEmitter<PmoGovernanceForumRow>();

  readonly forumDetailTabs = pmoGovernanceForumDetailTabs as readonly PmoGovernanceForumDetailDrawerTab[];
  readonly pastMeetings = pmoGovernancePastMeetingRows;
  readonly forumSources = pmoGovernanceForumSourceRows;
  readonly forumRecords = pmoGovernanceForumRecordRows;
  readonly watchlistCategories = pmoGovernanceWatchlistCategories;
  readonly watchlistRows = pmoGovernanceWatchlistRows;
  readonly forumIssueEmptyState = pmoGovernanceForumIssueEmptyState;
  readonly meetingRegisterColumns: PmConsoleRegisterTableColumn[] = [
    { id: 'meetingDate', label: 'Meeting Date', minWidth: 170, maxWidth: 220 },
    { id: 'meetingName', label: 'Meeting Name', minWidth: 360, maxWidth: 520 },
    { id: 'actions', label: 'Actions', minWidth: 120, maxWidth: 150, align: 'center' },
    { id: 'decisions', label: 'Decisions', minWidth: 120, maxWidth: 150, align: 'center' },
  ];
  readonly pastMeetingRegisterColumns: PmConsoleRegisterTableColumn[] = [
    ...this.meetingRegisterColumns,
    { id: 'rowActions', label: '', minWidth: 72, maxWidth: 84, align: 'center' },
  ];
  readonly forumSourceRegisterColumns: PmConsoleRegisterTableColumn[] = [
    { id: 'source', label: 'Source', minWidth: 320, maxWidth: 460 },
    { id: 'type', label: 'Type', minWidth: 150, maxWidth: 180 },
    { id: 'lastUpdatedOn', label: 'Last Updated On', minWidth: 170, maxWidth: 210 },
    { id: 'recommendations', label: 'Recommendations', minWidth: 180, maxWidth: 210, align: 'center' },
    { id: 'associatedRecords', label: 'Associated Records', minWidth: 210, maxWidth: 240, align: 'center' },
    { id: 'actions', label: '', minWidth: 72, maxWidth: 84, align: 'center' },
  ];
  readonly forumRecordRegisterColumns: PmConsoleRegisterTableColumn[] = [
    { id: 'favorite', label: '', minWidth: 70, maxWidth: 78, align: 'center' },
    { id: 'record', label: 'Record', minWidth: 100, maxWidth: 120 },
    { id: 'recordTitle', label: 'Record Title', minWidth: 360, maxWidth: 520 },
    { id: 'type', label: 'Type', minWidth: 140, maxWidth: 170 },
    { id: 'owner', label: 'Owner', minWidth: 180, maxWidth: 220 },
    { id: 'dueOn', label: 'Due On', minWidth: 150, maxWidth: 180 },
    { id: 'status', label: 'Status', minWidth: 160, maxWidth: 190 },
    { id: 'rowActions', label: '', minWidth: 72, maxWidth: 84, align: 'center' },
  ];
  readonly watchlistRegisterColumns: PmConsoleRegisterTableColumn[] = [
    { id: 'name', label: 'Name', minWidth: 430, maxWidth: 620 },
    { id: 'relatedEntity', label: 'Related Entity', minWidth: 320, maxWidth: 420 },
    { id: 'owner', label: 'Owner', minWidth: 220, maxWidth: 280 },
    { id: 'actions', label: '', minWidth: 72, maxWidth: 84, align: 'center' },
  ];

  activeForumDetailTab: PmoGovernanceForumDetailTabId = 'overview';
  activeWatchlistCategory: PmoGovernanceWatchlistCategoryId = 'risks';
  forumSourceScope: PmoGovernanceSourceScope = 'all';
  forumRecordScope: PmoGovernanceRecordScope = 'all';
  meetingSearchQuery = '';
  forumSourceSearchQuery = '';
  forumRecordSearchQuery = '';
  sourceDrawerOpen = false;
  recordDrawerOpen = false;
  meetingDrawerOpen = false;
  watchlistDrawerOpen = false;
  issueDrawerOpen = false;
  currentForum: PmoGovernanceForumRow | null = null;

  ngOnChanges(): void {
    this.currentForum = this.forum ? this.cloneForum(this.forum) : null;
    this.activeForumDetailTab = 'overview';
    this.activeWatchlistCategory = 'risks';
    this.forumSourceScope = 'all';
    this.forumRecordScope = 'all';
    this.meetingSearchQuery = '';
    this.forumSourceSearchQuery = '';
    this.forumRecordSearchQuery = '';
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.meetingDrawerOpen = false;
    this.watchlistDrawerOpen = false;
    this.issueDrawerOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  closeFromEscape(event: Event): void {
    event.preventDefault();
    if (this.meetingDrawerOpen) {
      this.closeMeetingDrawer();
      return;
    }
    if (this.watchlistDrawerOpen) {
      this.closeWatchlistDrawer();
      return;
    }
    if (this.issueDrawerOpen) {
      this.closeIssueDrawer();
      return;
    }
    if (this.recordDrawerOpen) {
      this.closeRecordDrawer();
      return;
    }
    if (this.sourceDrawerOpen) {
      this.closeSourceDrawer();
      return;
    }
    this.closeSelected.emit();
  }

  get visiblePastMeetings(): readonly PmoGovernanceMeetingRow[] {
    const query = this.normalizedMeetingSearchQuery;
    if (!query) return this.pastMeetings;
    return this.pastMeetings.filter((meeting) => this.meetingSearchValue(meeting).includes(query));
  }

  get upcomingMeetingRegisterRows(): PmConsoleRegisterTableRow[] {
    return [];
  }

  get pastMeetingRegisterRows(): PmConsoleRegisterTableRow[] {
    return this.visiblePastMeetings.map((meeting) => ({
      id: meeting.id,
      ariaLabel: `Open ${meeting.meetingName}`,
      clickable: false,
      cells: {
        meetingDate: { kind: 'text', text: meeting.meetingDate, muted: true },
        meetingName: { kind: 'text', text: meeting.meetingName, strong: true, wrap: true, clampLines: 2 },
        actions: { kind: 'text', text: String(meeting.actions) },
        decisions: { kind: 'text', text: String(meeting.decisions) },
        rowActions: {
          kind: 'menu',
          ariaLabel: `Actions for ${meeting.meetingName}`,
          actions: [
            { id: 'view', label: 'View meeting', icon: 'eye' },
            { id: 'edit', label: 'Edit meeting', icon: 'pencil' },
            { id: 'delete', label: 'Delete meeting', icon: 'trash-2', tone: 'danger' },
          ],
        },
      },
    }));
  }

  get activeForumDetailLabel(): string {
    return this.forumDetailTabs.find((tab) => tab.id === this.activeForumDetailTab)?.label ?? 'Forum Section';
  }

  get visibleForumSources(): readonly PmoGovernanceSourceRow[] {
    const query = this.normalizedForumSourceSearchQuery;
    const scopedSources = this.forumSourceScope === 'mine' ? [] : this.forumSources;
    if (!query) return scopedSources;
    return scopedSources.filter((source) => this.sourceSearchValue(source).includes(query));
  }

  get forumSourceRegisterRows(): PmConsoleRegisterTableRow[] {
    return this.visibleForumSources.map((source) => ({
      id: source.id,
      ariaLabel: `Open ${source.source}`,
      clickable: false,
      cells: {
        source: { kind: 'text', text: source.source, strong: true, wrap: true, clampLines: 2 },
        type: { kind: 'text', text: source.type },
        lastUpdatedOn: { kind: 'text', text: source.lastUpdatedOn, muted: source.lastUpdatedOn === '-' },
        recommendations: { kind: 'text', text: String(source.recommendations) },
        associatedRecords: { kind: 'text', text: String(source.associatedRecords) },
        actions: {
          kind: 'menu',
          ariaLabel: `Actions for ${source.source}`,
          actions: [
            { id: 'edit', label: 'Edit source', icon: 'pencil' },
            { id: 'delete', label: 'Delete source', icon: 'trash-2', tone: 'danger' },
          ],
        },
      },
    }));
  }

  get visibleForumRecords(): readonly PmoGovernanceRecordRow[] {
    const query = this.normalizedForumRecordSearchQuery;
    const scopedRecords = this.forumRecordScope === 'mine' ? [] : this.forumRecords;
    if (!query) return scopedRecords;
    return scopedRecords.filter((record) => this.recordSearchValue(record).includes(query));
  }

  get forumRecordRegisterRows(): PmConsoleRegisterTableRow[] {
    return this.visibleForumRecords.map((record) => ({
      id: record.id,
      ariaLabel: `Open ${record.record}`,
      clickable: false,
      cells: {
        favorite: { kind: 'iconAction', icon: 'star', muted: !record.favorite, ariaLabel: `Favorite ${record.record}` },
        record: { kind: 'text', text: record.record, strong: true },
        recordTitle: { kind: 'text', text: record.recordTitle, strong: true, wrap: true, clampLines: 2 },
        type: { kind: 'text', text: record.type },
        owner: { kind: 'text', text: record.owner },
        dueOn: { kind: 'text', text: record.dueOn, muted: record.dueOn === 'N/A' },
        status:
          record.status === 'N/A'
            ? { kind: 'text', text: record.status, muted: true }
            : { kind: 'status', label: record.status, tone: this.recordStatusTone(record.status) },
        rowActions: {
          kind: 'menu',
          ariaLabel: `Actions for ${record.record}`,
          actions: [
            { id: 'view', label: 'View record', icon: 'eye' },
            { id: 'edit', label: 'Edit record', icon: 'pencil' },
            { id: 'delete', label: 'Delete record', icon: 'trash-2', tone: 'danger' },
          ],
        },
      },
    }));
  }

  get activeWatchlistCategoryLabel(): string {
    return this.watchlistCategories.find((category) => category.id === this.activeWatchlistCategory)?.label ?? 'Watchlist';
  }

  get visibleWatchlistRows(): readonly PmoGovernanceWatchlistRow[] {
    return this.watchlistRows.filter((item) => item.categoryId === this.activeWatchlistCategory);
  }

  get watchlistRegisterRows(): PmConsoleRegisterTableRow[] {
    return this.visibleWatchlistRows.map((item) => ({
      id: item.id,
      ariaLabel: item.name,
      clickable: false,
      expanded: item.expanded,
      cells: {
        name: { kind: 'text', text: item.name, icon: item.expanded ? 'chevron-down' : 'chevron-right', strong: true, wrap: true, clampLines: 2 },
        relatedEntity: { kind: 'text', text: item.relatedEntity, wrap: true, clampLines: 2 },
        owner: { kind: 'text', text: item.owner, muted: item.owner === '-' },
        actions: {
          kind: 'menu',
          ariaLabel: `Actions for ${item.name}`,
          actions: [
            { id: 'edit', label: 'Edit watchlist item', icon: 'pencil' },
            { id: 'delete', label: 'Delete watchlist item', icon: 'trash-2', tone: 'danger' },
          ],
        },
      },
    }));
  }

  setForumDetailTab(tabId: PmoGovernanceForumDetailTabId): void {
    this.activeForumDetailTab = tabId;
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.meetingDrawerOpen = false;
    this.watchlistDrawerOpen = false;
    this.issueDrawerOpen = false;
  }

  saveForumOverview(draft: PmoGovernanceForumOverviewDraft): void {
    if (!this.currentForum) return;

    const secretariatMembers = [...draft.secretariatMembers];
    const memberNames = [...draft.memberNames];

    const updatedForum: PmoGovernanceForumRow = {
      ...this.currentForum,
      forumName: draft.forumName,
      forumId: draft.forumId,
      secretariat: secretariatMembers[0] ?? '-',
      moreOwners: secretariatMembers.length > 1 ? `+${secretariatMembers.length - 1} more` : undefined,
      type: draft.type,
      category: draft.category,
      description: draft.description,
      createdOn: draft.createdOn,
      createdBy: draft.createdBy,
      chair: draft.chair,
      secretariatMembers,
      memberNames,
      members: memberNames.length,
    };

    this.currentForum = updatedForum;
    this.forumUpdated.emit(updatedForum);
  }

  setForumSourceScope(scope: PmoGovernanceSourceScope): void {
    this.forumSourceScope = scope;
  }

  openSourceDrawer(): void {
    this.recordDrawerOpen = false;
    this.meetingDrawerOpen = false;
    this.watchlistDrawerOpen = false;
    this.issueDrawerOpen = false;
    this.sourceDrawerOpen = true;
  }

  closeSourceDrawer(): void {
    this.sourceDrawerOpen = false;
  }

  saveSourceDraft(_draft: PmoGovernanceSourceDraft): void {
    this.sourceDrawerOpen = false;
    this.forumSourceScope = 'all';
  }

  openRecordDrawer(): void {
    this.sourceDrawerOpen = false;
    this.meetingDrawerOpen = false;
    this.watchlistDrawerOpen = false;
    this.issueDrawerOpen = false;
    this.recordDrawerOpen = true;
  }

  closeRecordDrawer(): void {
    this.recordDrawerOpen = false;
  }

  saveRecordDraft(_draft: PmoGovernanceRecordDraft): void {
    this.recordDrawerOpen = false;
    this.forumRecordScope = 'all';
  }

  openMeetingDrawer(): void {
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.watchlistDrawerOpen = false;
    this.issueDrawerOpen = false;
    this.meetingDrawerOpen = true;
  }

  closeMeetingDrawer(): void {
    this.meetingDrawerOpen = false;
  }

  saveMeetingDraft(_draft: PmoGovernanceMeetingDraft): void {
    this.meetingDrawerOpen = false;
  }

  openWatchlistDrawer(): void {
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.meetingDrawerOpen = false;
    this.issueDrawerOpen = false;
    this.watchlistDrawerOpen = true;
  }

  closeWatchlistDrawer(): void {
    this.watchlistDrawerOpen = false;
  }

  saveWatchlistSelection(_selection: PmoGovernanceWatchlistSelection): void {
    this.watchlistDrawerOpen = false;
    this.activeWatchlistCategory = 'risks';
  }

  openIssueDrawer(): void {
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.meetingDrawerOpen = false;
    this.watchlistDrawerOpen = false;
    this.issueDrawerOpen = true;
  }

  closeIssueDrawer(): void {
    this.issueDrawerOpen = false;
  }

  saveIssueDraft(_draft: PmoGovernanceIssueDraft): void {
    this.issueDrawerOpen = false;
  }

  setForumRecordScope(scope: PmoGovernanceRecordScope): void {
    this.forumRecordScope = scope;
  }

  setWatchlistCategory(categoryId: PmoGovernanceWatchlistCategoryId): void {
    this.activeWatchlistCategory = categoryId;
  }

  watchlistCategoryIcon(categoryId: PmoGovernanceWatchlistCategoryId): string {
    const icons: Record<PmoGovernanceWatchlistCategoryId, string> = {
      risks: 'shield-alert',
      projects: 'briefcase',
      programs: 'layers',
    };
    return icons[categoryId];
  }

  watchlistRecordsForRow(rowId: string): readonly string[] {
    return this.watchlistRows.find((item) => item.id === rowId)?.records ?? [];
  }

  setMeetingSearchQuery(value: Event | string): void {
    this.meetingSearchQuery = this.searchInputValue(value);
  }

  setForumSourceSearchQuery(value: Event | string): void {
    this.forumSourceSearchQuery = this.searchInputValue(value);
  }

  setForumRecordSearchQuery(value: Event | string): void {
    this.forumRecordSearchQuery = this.searchInputValue(value);
  }

  private searchInputValue(value: Event | string): string {
    return typeof value === 'string' ? value : (value.target as HTMLInputElement | null)?.value ?? '';
  }

  private cloneForum(forum: PmoGovernanceForumRow): PmoGovernanceForumRow {
    return {
      ...forum,
      secretariatMembers: [...forum.secretariatMembers],
      memberNames: [...forum.memberNames],
    };
  }

  private get normalizedMeetingSearchQuery(): string {
    return this.normalizeSearchValue(this.meetingSearchQuery);
  }

  private get normalizedForumSourceSearchQuery(): string {
    return this.normalizeSearchValue(this.forumSourceSearchQuery);
  }

  private get normalizedForumRecordSearchQuery(): string {
    return this.normalizeSearchValue(this.forumRecordSearchQuery);
  }

  private meetingSearchValue(meeting: PmoGovernanceMeetingRow): string {
    return this.normalizeSearchValue(
      [
        meeting.meetingDate,
        meeting.meetingName,
        String(meeting.actions),
        String(meeting.decisions),
      ].join(' '),
    );
  }

  private sourceSearchValue(source: PmoGovernanceSourceRow): string {
    return this.normalizeSearchValue(
      [
        source.source,
        source.type,
        source.lastUpdatedOn,
        String(source.recommendations),
        String(source.associatedRecords),
      ].join(' '),
    );
  }

  private recordSearchValue(record: PmoGovernanceRecordRow): string {
    return this.normalizeSearchValue(
      [
        record.record,
        record.recordTitle,
        record.type,
        record.owner,
        record.dueOn,
        record.status,
      ].join(' '),
    );
  }

  private recordStatusTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('open') || normalized.includes('pending')) return 'amber';
    if (normalized.includes('closed')) return 'green';
    return 'neutral';
  }

  private normalizeSearchValue(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
}
