import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { PmoGovernanceForumDrawerComponent } from './pmo-governance-forum-drawer.component';
import { PmoGovernanceRecordDetailDrawerComponent } from './pmo-governance-record-detail-drawer.component';
import { PmoGovernanceRecordDrawerComponent } from './pmo-governance-record-drawer.component';
import { PmoGovernanceReportDrawerComponent } from './pmo-governance-report-drawer.component';
import { PmoGovernanceSourceDrawerComponent } from './pmo-governance-source-drawer.component';
import { PmConsoleExpandableSearchComponent } from './shared/pm-console-expandable-search.component';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from './shared/pm-console-row-action-menu.component';
import {
  pmoGovernanceForumDetailTabs,
  pmoGovernanceForumIssueEmptyState,
  pmoGovernanceForumRecordRows,
  pmoGovernanceForumSourceRows,
  pmoGovernanceForumRows,
  pmoGovernancePastMeetingRows,
  pmoGovernancePrimaryTabs,
  pmoGovernanceRecordDetailFor,
  pmoGovernanceRecordRows,
  pmoGovernanceReportTemplateRowFromDraft,
  pmoGovernanceReportTemplateRows,
  pmoGovernanceSectionTabs,
  pmoGovernanceSourceRows,
  pmoGovernanceWatchlistCategories,
  pmoGovernanceWatchlistRows,
  type PmoGovernanceForumDraft,
  type PmoGovernanceForumDetailTabId,
  type PmoGovernanceForumRow,
  type PmoGovernanceForumScope,
  type PmoGovernanceMeetingRow,
  type PmoGovernanceRecordDetail,
  type PmoGovernanceRecordDraft,
  type PmoGovernanceRecordRow,
  type PmoGovernanceRecordScope,
  type PmoGovernanceReportDraft,
  type PmoGovernanceReportTemplateRow,
  type PmoGovernanceSectionId,
  type PmoGovernanceSourceDraft,
  type PmoGovernanceSourceRow,
  type PmoGovernanceSourceScope,
  type PmoGovernanceTabId,
  type PmoGovernanceWatchlistCategoryId,
  type PmoGovernanceWatchlistRow,
} from './pmo-governance-workspace.data';

type PmoGovernanceSourceDrawerContext = 'workspace' | 'forum';
type PmoGovernanceRecordDrawerContext = 'workspace' | 'forum';

@Component({
  selector: 'app-pmo-governance-workspace',
  standalone: true,
  imports: [
    PmConsoleExpandableSearchComponent,
    PmConsoleIconComponent,
    PmoGovernanceForumDrawerComponent,
    PmoGovernanceRecordDetailDrawerComponent,
    PmoGovernanceRecordDrawerComponent,
    PmoGovernanceReportDrawerComponent,
    PmoGovernanceSourceDrawerComponent,
    PmConsoleRowActionMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pmo-governance-canvas">
      <div class="page-motion-host">
        <section class="pmo-governance-page" aria-label="My Workspace">
          <header class="pmo-page-header">
            <div class="pmo-title-group">
              <button class="pmo-back-button" type="button" aria-label="Back">
                <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
              </button>
              <div>
                <h1>My Workspace</h1>
                <p>Portfolio registers and governance work</p>
              </div>
            </div>

          </header>

          <article class="pmo-content-surface">
            <nav class="pmo-tab-strip pmo-primary-tabs" role="tablist" aria-label="My workspace sections">
              @for (tab of primaryTabs; track tab.id) {
                <button
                  [class.active]="activePrimaryTab === tab.id"
                  type="button"
                  role="tab"
                  [attr.aria-selected]="activePrimaryTab === tab.id"
                  (click)="setPrimaryTab(tab.id)"
                >
                  <span [pmConsoleIcon]="tab.icon || 'layout-grid'" aria-hidden="true"></span>
                  {{ tab.label }}
                </button>
              }
            </nav>

            @if (activePrimaryTab === 'governance') {
              @if (selectedForum; as forum) {
                <section hidden class="pmo-forum-detail-view" [attr.aria-label]="forum.forumName + ' forum meetings'">
                  <header class="pmo-forum-detail-header">
                    <button class="pmo-forum-detail-back" type="button" aria-label="Back to forums" (click)="closeForumDetail()">
                      <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
                    </button>

                    <div class="pmo-forum-detail-meta">
                      <div class="pmo-forum-detail-field is-wide">
                        <span>Forum Name</span>
                        <strong>{{ forum.forumName }}</strong>
                      </div>
                      <div class="pmo-forum-detail-field">
                        <span>Type</span>
                        <strong>{{ forum.type }}</strong>
                      </div>
                      <div class="pmo-forum-detail-field">
                        <span>Category</span>
                        <strong>{{ forum.category }}</strong>
                      </div>
                    </div>

                  </header>

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

                  @if (activeForumDetailTab === 'meetings') {
                    <section class="pmo-meetings-register" aria-label="Forum meetings">
                      <div class="pmo-meeting-section-heading">
                        <h2>Upcoming Meetings</h2>
                        <button class="pm-table-add-project pmo-create-meeting" type="button">
                          <span pmConsoleIcon="plus" aria-hidden="true"></span>
                          <span>Create New Meeting</span>
                        </button>
                      </div>

                      <div class="pmo-meeting-table-wrap">
                        <table class="pmo-forum-table pmo-meeting-table" aria-label="Upcoming meetings">
                          <colgroup>
                            <col class="pmo-meeting-col-date" />
                            <col class="pmo-meeting-col-name" />
                            <col class="pmo-meeting-col-count" />
                            <col class="pmo-meeting-col-count" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th scope="col">Meeting Date</th>
                              <th scope="col">Meeting Name</th>
                              <th scope="col" class="pmo-center">Actions</th>
                              <th scope="col" class="pmo-center">Decisions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colspan="4"><span class="pmo-no-meeting-badge">No Meeting!</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div class="pmo-meeting-section-heading pmo-past-meeting-heading">
                        <h2>Past Meetings</h2>
                        <app-pm-console-expandable-search
                          class="pmo-meeting-search"
                          [ariaLabel]="'Search past meetings'"
                          [placeholder]="'Search'"
                          [value]="meetingSearchQuery"
                          (searchChange)="setMeetingSearchQuery($event)"
                        />
                      </div>

                      <div class="pmo-meeting-table-wrap">
                        <table class="pmo-forum-table pmo-meeting-table pmo-past-meeting-table" aria-label="Past meetings">
                          <colgroup>
                            <col class="pmo-meeting-col-date" />
                            <col class="pmo-meeting-col-name" />
                            <col class="pmo-meeting-col-count" />
                            <col class="pmo-meeting-col-count" />
                            <col class="pmo-col-action" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th scope="col">Meeting Date</th>
                              <th scope="col">
                                <span class="pmo-sort-header">Meeting Name<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                              </th>
                              <th scope="col" class="pmo-center">Actions</th>
                              <th scope="col" class="pmo-center">Decisions</th>
                              <th scope="col" aria-label="Actions"></th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (meeting of visiblePastMeetings; track meeting.id) {
                              <tr>
                                <td>{{ meeting.meetingDate }}</td>
                                <td><span class="pmo-forum-name">{{ meeting.meetingName }}</span></td>
                                <td class="pmo-center">{{ meeting.actions }}</td>
                                <td class="pmo-center">{{ meeting.decisions }}</td>
                                <td class="pmo-action-cell">
                                  <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + meeting.meetingName">
                                    <button type="button" role="menuitem">
                                      <span pmConsoleIcon="eye" aria-hidden="true"></span>
                                      <span>View meeting</span>
                                    </button>
                                    <button type="button" role="menuitem">
                                      <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                      <span>Edit meeting</span>
                                    </button>
                                    <button class="danger" type="button" role="menuitem">
                                      <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                      <span>Delete meeting</span>
                                    </button>
                                  </app-pm-console-row-action-menu>
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="5"><span class="pmo-no-report-data">No meetings match your search</span></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>

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
                          <button class="pm-table-add-project pmo-add-source" type="button" (click)="openSourceDrawer('forum')">
                            <span pmConsoleIcon="plus" aria-hidden="true"></span>
                            <span>Add Source</span>
                          </button>
                        </div>
                      </div>

                      <div class="pmo-meeting-table-wrap">
                        <table class="pmo-forum-table pmo-source-table pmo-forum-source-table" aria-label="Forum sources">
                          <colgroup>
                            <col class="pmo-source-col-name" />
                            <col class="pmo-source-col-type" />
                            <col class="pmo-source-col-updated" />
                            <col class="pmo-source-col-count" />
                            <col class="pmo-source-col-count" />
                            <col class="pmo-col-action" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th scope="col">Source</th>
                              <th scope="col">Type</th>
                              <th scope="col">
                                <span class="pmo-sort-header">Last Updated On<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                              </th>
                              <th scope="col" class="pmo-center">Recommendations</th>
                              <th scope="col" class="pmo-center">Associated Records</th>
                              <th scope="col" aria-label="Actions"></th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (source of visibleForumSources; track source.id) {
                              <tr>
                                <td><span class="pmo-forum-name">{{ source.source }}</span></td>
                                <td>{{ source.type }}</td>
                                <td>{{ source.lastUpdatedOn }}</td>
                                <td class="pmo-center">{{ source.recommendations }}</td>
                                <td class="pmo-center">{{ source.associatedRecords }}</td>
                                <td class="pmo-action-cell">
                                  <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + source.source">
                                    <button type="button" role="menuitem">
                                      <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                      <span>Edit source</span>
                                    </button>
                                    <button class="danger" type="button" role="menuitem">
                                      <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                      <span>Delete source</span>
                                    </button>
                                  </app-pm-console-row-action-menu>
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="6"><span class="pmo-no-report-data">No sources match your search</span></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>

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
                          <button class="pm-table-add-project pmo-add-source" type="button" (click)="openRecordDrawer('forum')">
                            <span pmConsoleIcon="plus" aria-hidden="true"></span>
                            <span>Add Record</span>
                          </button>
                        </div>
                      </div>

                      <div class="pmo-meeting-table-wrap">
                        <table class="pmo-forum-table pmo-record-table pmo-forum-record-table" aria-label="Forum records">
                          <colgroup>
                            <col class="pmo-col-favorite" />
                            <col class="pmo-record-col-id" />
                            <col class="pmo-record-col-title" />
                            <col class="pmo-record-col-type" />
                            <col class="pmo-record-col-owner" />
                            <col class="pmo-record-col-due" />
                            <col class="pmo-record-col-status" />
                            <col class="pmo-col-action" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th scope="col" aria-label="Favorite"><span pmConsoleIcon="star" aria-hidden="true"></span></th>
                              <th scope="col">
                                <span class="pmo-sort-header">Record<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                              </th>
                              <th scope="col">Record Title</th>
                              <th scope="col">Type</th>
                              <th scope="col">Owner</th>
                              <th scope="col">Due On</th>
                              <th scope="col">Status</th>
                              <th scope="col" aria-label="Actions"></th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (record of visibleForumRecords; track record.id) {
                              <tr>
                                <td class="pmo-favorite-cell">
                                  <button class="pmo-favorite-button" [class.is-favorite]="record.favorite" type="button" [attr.aria-label]="'Favorite ' + record.record">
                                    <span pmConsoleIcon="star" aria-hidden="true"></span>
                                  </button>
                                </td>
                                <td><strong class="pmo-record-id">{{ record.record }}</strong></td>
                                <td><span class="pmo-forum-name pmo-record-title">{{ record.recordTitle }}</span></td>
                                <td>{{ record.type }}</td>
                                <td>{{ record.owner }}</td>
                                <td>
                                  @if (record.dueOn === 'N/A') {
                                    {{ record.dueOn }}
                                  } @else {
                                    <span class="pmo-record-date" [class.is-open]="record.status === 'Open'">{{ record.dueOn }}</span>
                                  }
                                </td>
                                <td>
                                  @if (record.status === 'N/A') {
                                    {{ record.status }}
                                  } @else {
                                    <span class="pmo-record-status" [class.is-open]="record.status === 'Open'">
                                      {{ record.status }}
                                    </span>
                                  }
                                </td>
                                <td class="pmo-action-cell">
                                  <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + record.record">
                                    <button type="button" role="menuitem">
                                      <span pmConsoleIcon="eye" aria-hidden="true"></span>
                                      <span>View record</span>
                                    </button>
                                    <button type="button" role="menuitem">
                                      <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                      <span>Edit record</span>
                                    </button>
                                    <button class="danger" type="button" role="menuitem">
                                      <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                      <span>Delete record</span>
                                    </button>
                                  </app-pm-console-row-action-menu>
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="8"><span class="pmo-no-report-data">No records match your search</span></td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
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
                            <span>{{ category.label }}</span>
                            <span pmConsoleIcon="chevron-right" aria-hidden="true"></span>
                          </button>
                        }
                      </nav>

                      <section class="pmo-watchlist-panel" [attr.aria-label]="activeWatchlistCategoryLabel + ' watchlist'">
                        <header class="pmo-watchlist-heading">
                          <h2>{{ activeWatchlistCategoryLabel }}</h2>
                          <button class="pm-table-add-project pmo-add-watchlist" type="button">
                            <span pmConsoleIcon="plus" aria-hidden="true"></span>
                            <span>Add to Watchlist</span>
                          </button>
                  </header>

                        <div class="pmo-watchlist-table-wrap">
                          <table class="pmo-forum-table pmo-watchlist-table" aria-label="Watchlist items">
                            <colgroup>
                              <col class="pmo-watchlist-col-name" />
                              <col class="pmo-watchlist-col-related" />
                              <col class="pmo-watchlist-col-owner" />
                              <col class="pmo-watchlist-col-action" />
                            </colgroup>
                            <thead>
                              <tr>
                                <th scope="col">
                                  <span class="pmo-sort-header">Name<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                                </th>
                                <th scope="col">Related Entity</th>
                                <th scope="col">Owner</th>
                                <th scope="col" aria-label="Actions"></th>
                              </tr>
                            </thead>
                            <tbody>
                              @for (item of visibleWatchlistRows; track item.id) {
                                <tr class="pmo-watchlist-item-row" [class.is-expanded]="item.expanded">
                                  <td>
                                    <span class="pmo-watchlist-name">
                                      <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                                      <strong>{{ item.name }}</strong>
                                    </span>
                                  </td>
                                  <td>{{ item.relatedEntity }}</td>
                                  <td>{{ item.owner }}</td>
                                  <td class="pmo-action-cell">
                                    <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + item.name">
                                      <button type="button" role="menuitem">
                                        <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                        <span>Edit watchlist item</span>
                                      </button>
                                      <button class="danger" type="button" role="menuitem">
                                        <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                        <span>Delete watchlist item</span>
                                      </button>
                                    </app-pm-console-row-action-menu>
                                  </td>
                                </tr>
                                @if (item.expanded) {
                                  <tr class="pmo-watchlist-expanded-row">
                                    <td colspan="4">
                                      <div class="pmo-watchlist-records-panel">
                                        <span>Records</span>
                                        <button class="pmo-watchlist-record-add" type="button">
                                          <span pmConsoleIcon="plus" aria-hidden="true"></span>
                                          <span>Add</span>
                                        </button>
                                        <div class="pmo-watchlist-no-records">
                                          @if (item.records.length) {
                                            @for (record of item.records; track record) {
                                              <strong>{{ record }}</strong>
                                            }
                                          } @else {
                                            <span>No Record Added</span>
                                          }
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                }
                              } @empty {
                                <tr>
                                  <td colspan="4"><span class="pmo-no-report-data">No watchlist items available</span></td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </section>
                  } @else if (activeForumDetailTab === 'issues') {
                    <section class="pmo-issues-register" aria-label="Forum issues">
                      <header class="pmo-issues-toolbar">
                        <button class="pm-table-add-project pmo-add-issue" type="button">
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
              }
              <nav class="pmo-tab-strip pmo-secondary-tabs" role="tablist" aria-label="Governance registers">
                @for (tab of sectionTabs; track tab.id) {
                  <button
                    [class.active]="activeSectionTab === tab.id"
                    type="button"
                    role="tab"
                    [attr.aria-selected]="activeSectionTab === tab.id"
                    (click)="setSectionTab(tab.id)"
                  >
                    {{ tab.label }}
                  </button>
                }
              </nav>

              @if (activeSectionTab === 'forums') {
                <div class="pmo-forum-toolbar">
                  <div class="pmo-viewing-control" aria-label="Forum visibility">
                    <span>Viewing</span>
                    <button
                      [class.active]="forumScope === 'mine'"
                      type="button"
                      [attr.aria-pressed]="forumScope === 'mine'"
                      (click)="setForumScope('mine')"
                    >
                      My Forums (0)
                    </button>
                    <button
                      [class.active]="forumScope === 'all'"
                      type="button"
                      [attr.aria-pressed]="forumScope === 'all'"
                      (click)="setForumScope('all')"
                    >
                      All Forums (15)
                    </button>
                  </div>

                  <div class="pmo-forum-actions">
                    <app-pm-console-expandable-search
                      class="pmo-forum-search"
                      [ariaLabel]="'Search forums'"
                      [placeholder]="'Search'"
                      [value]="searchQuery"
                      (searchChange)="setSearchQuery($event)"
                    />
                    <button class="pm-table-add-project pmo-add-forum" type="button" (click)="openForumDrawer()">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      <span>Add New Forum</span>
                    </button>
                  </div>
                </div>

                <div class="pmo-table-wrap pmo-scroll-table-wrap">
                  <table class="pmo-forum-table" aria-label="Governance forums">
                    <colgroup>
                      <col class="pmo-col-favorite" />
                      <col class="pmo-col-forum" />
                      <col class="pmo-col-id" />
                      <col class="pmo-col-secretariat" />
                      <col class="pmo-col-type" />
                      <col class="pmo-col-category" />
                      <col class="pmo-col-members" />
                      <col class="pmo-col-meeting" />
                      <col class="pmo-col-action" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th scope="col" aria-label="Favorite"><span pmConsoleIcon="star" aria-hidden="true"></span></th>
                        <th scope="col">Forum Name</th>
                        <th scope="col">
                          <span class="pmo-sort-header">Forum ID<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                        </th>
                        <th scope="col">Secretariat</th>
                        <th scope="col">Type</th>
                        <th scope="col">Category</th>
                        <th scope="col" class="pmo-center">No. Of Members</th>
                        <th scope="col">Next Meeting On</th>
                        <th scope="col" aria-label="Actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (forum of visibleForums; track forum.id) {
                        <tr
                          class="pmo-clickable-row"
                          tabindex="0"
                          [attr.aria-label]="'Open ' + forum.forumName + ' forum detail'"
                          (click)="openForumDetail(forum)"
                          (keydown.enter)="openForumDetail(forum)"
                          (keydown.space)="openForumDetail(forum); $event.preventDefault()"
                        >
                          <td class="pmo-favorite-cell">
                            <button class="pmo-favorite-button" [class.is-favorite]="forum.favorite" type="button" [attr.aria-label]="'Favorite ' + forum.forumName" (click)="$event.stopPropagation()">
                              <span pmConsoleIcon="star" aria-hidden="true"></span>
                            </button>
                          </td>
                          <td>
                            <button class="pmo-forum-name pmo-forum-link" type="button" (click)="openForumDetail(forum); $event.stopPropagation()">
                              {{ forum.forumName }}
                            </button>
                            <span class="pmo-forum-tag">
                              <span pmConsoleIcon="tag" aria-hidden="true"></span>
                              {{ forum.tagCount }}
                            </span>
                          </td>
                          <td>{{ forum.forumId }}</td>
                          <td>
                            <span class="pmo-secretariat">{{ forum.secretariat }}</span>
                            @if (forum.moreOwners) {
                              <small class="pmo-more-owners">{{ forum.moreOwners }}</small>
                            }
                          </td>
                          <td>
                            <span class="pmo-type-pill" [class.non-substantiated]="forum.type === 'Non-Substantiated'">{{ forum.type }}</span>
                          </td>
                          <td>{{ forum.category }}</td>
                          <td class="pmo-center">
                            @if (forum.members === 0) {
                              <span class="pmo-zero-badge">0</span>
                            } @else {
                              {{ forum.members }}
                            }
                          </td>
                          <td><span class="pmo-meeting-badge">{{ forum.nextMeeting }}</span></td>
                          <td class="pmo-action-cell">
                            <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + forum.forumName">
                              <button type="button" role="menuitem" (click)="openForumDetail(forum)">
                                <span pmConsoleIcon="eye" aria-hidden="true"></span>
                                <span>View forum</span>
                              </button>
                              <button type="button" role="menuitem">
                                <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                <span>Edit forum</span>
                              </button>
                              <button class="danger" type="button" role="menuitem">
                                <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                <span>Delete forum</span>
                              </button>
                            </app-pm-console-row-action-menu>
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="9">
                            <div class="pmo-empty-state">
                              <strong>No forums match your search</strong>
                              <span>Try another forum name, owner, or category.</span>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

              } @else if (activeSectionTab === 'sources') {
                <div class="pmo-forum-toolbar">
                  <div class="pmo-viewing-control" aria-label="Source visibility">
                    <span>Viewing</span>
                    <button
                      [class.active]="sourceScope === 'mine'"
                      type="button"
                      [attr.aria-pressed]="sourceScope === 'mine'"
                      (click)="setSourceScope('mine')"
                    >
                      My Sources (0)
                    </button>
                    <button
                      [class.active]="sourceScope === 'all'"
                      type="button"
                      [attr.aria-pressed]="sourceScope === 'all'"
                      (click)="setSourceScope('all')"
                    >
                      All Sources (19)
                    </button>
                  </div>

                  <div class="pmo-forum-actions">
                    <app-pm-console-expandable-search
                      class="pmo-forum-search"
                      [ariaLabel]="'Search sources'"
                      [placeholder]="'Search'"
                      [value]="sourceSearchQuery"
                      (searchChange)="setSourceSearchQuery($event)"
                    />
                    <button class="pm-table-add-project pmo-add-forum" type="button" (click)="openSourceDrawer('workspace')">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      <span>Add New Source</span>
                    </button>
                  </div>
                </div>

                <div class="pmo-table-wrap">
                  <table class="pmo-forum-table pmo-source-table" aria-label="Governance sources">
                    <colgroup>
                      <col class="pmo-source-col-name" />
                      <col class="pmo-source-col-type" />
                      <col class="pmo-source-col-updated" />
                      <col class="pmo-source-col-count" />
                      <col class="pmo-source-col-count" />
                      <col class="pmo-col-action" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th scope="col">Source</th>
                        <th scope="col">
                          <span class="pmo-sort-header">Type<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                        </th>
                        <th scope="col">Last Updated On</th>
                        <th scope="col" class="pmo-center">Recommendations</th>
                        <th scope="col" class="pmo-center">Associated Records</th>
                        <th scope="col" aria-label="Actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (source of visibleSources; track source.id) {
                        <tr>
                          <td><span class="pmo-forum-name">{{ source.source }}</span></td>
                          <td>{{ source.type }}</td>
                          <td>{{ source.lastUpdatedOn }}</td>
                          <td class="pmo-center">{{ source.recommendations }}</td>
                          <td class="pmo-center">{{ source.associatedRecords }}</td>
                          <td class="pmo-action-cell">
                            <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + source.source">
                              <button type="button" role="menuitem">
                                <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                <span>Edit source</span>
                              </button>
                              <button class="danger" type="button" role="menuitem">
                                <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                <span>Delete source</span>
                              </button>
                            </app-pm-console-row-action-menu>
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="6">
                            <div class="pmo-empty-state">
                              <strong>No sources match your search</strong>
                              <span>Try another source name, type, or date.</span>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

              } @else if (activeSectionTab === 'records') {
                <div class="pmo-forum-toolbar">
                  <div class="pmo-viewing-control" aria-label="Record visibility">
                    <span>Viewing</span>
                    <button
                      [class.active]="recordScope === 'mine'"
                      type="button"
                      [attr.aria-pressed]="recordScope === 'mine'"
                      (click)="setRecordScope('mine')"
                    >
                      My Records (0)
                    </button>
                    <button
                      [class.active]="recordScope === 'all'"
                      type="button"
                      [attr.aria-pressed]="recordScope === 'all'"
                      (click)="setRecordScope('all')"
                    >
                      All Records (49)
                    </button>
                  </div>

                  <div class="pmo-forum-actions">
                    <app-pm-console-expandable-search
                      class="pmo-forum-search"
                      [ariaLabel]="'Search records'"
                      [placeholder]="'Search'"
                      [value]="recordSearchQuery"
                      (searchChange)="setRecordSearchQuery($event)"
                    />
                    <button class="pm-table-add-project pmo-add-forum" type="button" (click)="openRecordDrawer('workspace')">
                      <span pmConsoleIcon="plus" aria-hidden="true"></span>
                      <span>Add New Record</span>
                    </button>
                  </div>
                </div>

                <div class="pmo-table-wrap">
                  <table class="pmo-forum-table pmo-record-table" aria-label="Governance records">
                    <colgroup>
                      <col class="pmo-col-favorite" />
                      <col class="pmo-record-col-id" />
                      <col class="pmo-record-col-title" />
                      <col class="pmo-record-col-type" />
                      <col class="pmo-record-col-owner" />
                      <col class="pmo-record-col-due" />
                      <col class="pmo-record-col-status" />
                      <col class="pmo-col-action" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th scope="col" aria-label="Favorite"><span pmConsoleIcon="star" aria-hidden="true"></span></th>
                        <th scope="col">
                          <span class="pmo-sort-header">Record<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                        </th>
                        <th scope="col">Record Title</th>
                        <th scope="col">Type</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Due On</th>
                        <th scope="col">Status</th>
                        <th scope="col" aria-label="Actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (record of visibleRecords; track record.id) {
                        <tr
                          class="pmo-clickable-row"
                          tabindex="0"
                          [attr.aria-label]="'Open ' + record.record + ' record detail'"
                          (click)="openRecordDetail(record)"
                          (keydown.enter)="openRecordDetail(record)"
                          (keydown.space)="openRecordDetail(record); $event.preventDefault()"
                        >
                          <td class="pmo-favorite-cell">
                            <button class="pmo-favorite-button" [class.is-favorite]="record.favorite" type="button" [attr.aria-label]="'Favorite ' + record.record" (click)="$event.stopPropagation()">
                              <span pmConsoleIcon="star" aria-hidden="true"></span>
                            </button>
                          </td>
                          <td><strong class="pmo-record-id">{{ record.record }}</strong></td>
                          <td><span class="pmo-forum-name pmo-record-title">{{ record.recordTitle }}</span></td>
                          <td>{{ record.type }}</td>
                          <td>{{ record.owner }}</td>
                          <td>
                            @if (record.dueOn === 'N/A') {
                              {{ record.dueOn }}
                            } @else {
                              <span class="pmo-record-date" [class.is-open]="record.status === 'Open'">{{ record.dueOn }}</span>
                            }
                          </td>
                          <td>
                            @if (record.status === 'N/A') {
                              {{ record.status }}
                            } @else {
                              <span class="pmo-record-status" [class.is-open]="record.status === 'Open'" [class.is-pending]="record.status === 'Pending closure'">
                                {{ record.status }}
                              </span>
                            }
                          </td>
                          <td class="pmo-action-cell">
                            <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + record.record">
                              <button type="button" role="menuitem" (click)="openRecordDetail(record)">
                                <span pmConsoleIcon="eye" aria-hidden="true"></span>
                                <span>View record</span>
                              </button>
                              <button type="button" role="menuitem">
                                <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                                <span>Edit record</span>
                              </button>
                              <button class="danger" type="button" role="menuitem">
                                <span pmConsoleIcon="trash-2" aria-hidden="true"></span>
                                <span>Delete record</span>
                              </button>
                            </app-pm-console-row-action-menu>
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="8"><span class="pmo-no-report-data">No data available in table</span></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

              } @else if (activeSectionTab === 'reports') {
                <section class="pmo-reports-view" aria-label="Saved Report Templates">
                  <header class="pmo-reports-heading">
                    <div>
                      <h2>Saved Report Templates</h2>
                    </div>
                  </header>

                  <div class="pmo-forum-toolbar pmo-report-toolbar">
                    <div class="pmo-forum-actions pmo-report-actions">
                      <app-pm-console-expandable-search
                        class="pmo-forum-search"
                        [ariaLabel]="'Search saved report templates'"
                        [placeholder]="'Search'"
                        [value]="reportSearchQuery"
                        (searchChange)="setReportSearchQuery($event)"
                      />
                      <button class="pm-table-add-project pmo-create-report" type="button" (click)="openReportDrawer()">
                        <span pmConsoleIcon="plus" aria-hidden="true"></span>
                        <span>Create Report</span>
                      </button>
                    </div>
                  </div>

                  <div class="pmo-table-wrap pmo-report-table-wrap">
                    <table class="pmo-forum-table pmo-report-table" aria-label="Saved report templates">
                      <colgroup>
                        <col class="pmo-report-name-col" />
                        <col class="pmo-report-group-col" />
                        <col class="pmo-report-action-col" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th scope="col">
                            <span class="pmo-sort-header">Report Name<span pmConsoleIcon="arrow-up" aria-hidden="true"></span></span>
                          </th>
                          <th scope="col">Group By</th>
                          <th scope="col">View/Print</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (report of visibleReports; track report.id) {
                          <tr>
                            <td>{{ report.reportName }}</td>
                            <td>{{ report.groupBy }}</td>
                            <td>{{ report.viewLabel }}</td>
                          </tr>
                        } @empty {
                          <tr>
                            <td colspan="3"><span class="pmo-no-report-data">No data available in table</span></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </section>
              }
            } @else {
              <section class="pmo-register-placeholder" [attr.aria-label]="activePrimaryTabLabel + ' coming soon'">
                <strong>{{ activePrimaryTabLabel }}</strong>
                <span>This workspace tab is ready for the next set of register content.</span>
              </section>
            }

          </article>
        </section>
      </div>

      @if (selectedRecordDetail; as recordDetail) {
        <app-pmo-governance-record-detail-drawer [detail]="recordDetail" (closeSelected)="closeRecordDetail()" />
      }

      @if (forumDrawerOpen) {
        <app-pmo-governance-forum-drawer (close)="closeForumDrawer()" (save)="saveForumDraft($event)" />
      }

      @if (sourceDrawerOpen) {
        <app-pmo-governance-source-drawer (close)="closeSourceDrawer()" (save)="saveSourceDraft($event)" />
      }

      @if (recordDrawerOpen) {
        <app-pmo-governance-record-drawer (close)="closeRecordDrawer()" (save)="saveRecordDraft($event)" />
      }

      @if (reportDrawerOpen) {
        <app-pmo-governance-report-drawer (close)="closeReportDrawer()" (save)="saveReportDraft($event)" />
      }
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-governance-canvas {
        padding: 9px 8px 16px;
      }

      .pmo-governance-page {
        display: grid;
        font-weight: 400;
        gap: 0;
        grid-template-rows: 108px minmax(0, 1fr);
        height: 100%;
        min-height: 0;
        min-width: 0;
      }

      .pmo-page-header {
        align-items: flex-start;
        background:
          url('../assets/workspace-line-art.svg') right 3px top -40px / 858px 188px no-repeat,
          linear-gradient(90deg, #eef2ff 0%, #f0f2ff 56%, #eeeffc 100%),
          #eef2ff;
        border: 1px solid #eeeeee;
        border-bottom: 0;
        border-radius: 16px 16px 0 0;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-height: 108px;
        min-width: 0;
        overflow: hidden;
        padding: 16px;
        position: relative;
      }

      .pmo-title-group,
      .pmo-forum-actions,
      .pmo-viewing-control,
      .pmo-sort-header {
        align-items: center;
        display: flex;
      }

      .pmo-title-group {
        gap: 8px;
        min-width: 0;
        position: relative;
        z-index: 2;
      }

      .pmo-title-group h1 {
        color: #0b0b0b;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
      }

      .pmo-title-group p {
        display: none;
      }

      .pmo-back-button {
        align-items: center;
        border-radius: 6px;
        color: #828899;
        display: inline-flex;
        flex: 0 0 auto;
        height: 24px;
        justify-content: center;
        outline: none;
        transition:
          background var(--motion-fast) var(--motion-ease),
          color var(--motion-fast) var(--motion-ease);
        width: 24px;
      }

      .pmo-back-button:hover,
      .pmo-back-button:focus-visible {
        background: rgba(16, 6, 159, 0.08);
        color: #10069f;
      }

      .pmo-back-button .icon {
        height: 20px;
        width: 20px;
      }

      .pmo-content-surface {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 0 0 16px 16px;
        border-top: 0;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.08);
        display: grid;
        gap: 0;
        grid-template-rows: auto auto minmax(0, 1fr) auto;
        min-height: 0;
        overflow: visible;
        position: relative;
      }

      .pmo-tab-strip {
        align-items: flex-end;
        border-bottom: 1px solid #e6e9f0;
        display: flex;
        gap: 2px;
        min-width: 0;
        padding: 0 20px;
      }

      .pmo-tab-strip button {
        align-items: center;
        color: #404756;
        display: inline-flex;
        font-size: 12px;
        font-weight: 500;
        gap: 6px;
        height: 42px;
        justify-content: center;
        padding: 0 14px;
        position: relative;
        white-space: nowrap;
      }

      .pmo-primary-tabs {
        background: transparent;
        border-bottom: 0;
        bottom: 100%;
        gap: 0;
        height: 44px;
        left: 0;
        max-width: calc(100% - 32px);
        overflow: visible;
        padding: 0 16px;
        position: absolute;
        z-index: 4;
      }

      .pmo-primary-tabs button {
        background: transparent;
        border: 1px solid transparent;
        border-bottom: 0;
        border-radius: 8px 8px 0 0;
        box-shadow: none;
        color: #404040;
        font-size: 12px;
        font-weight: 400;
        height: 44px;
        min-width: 148px;
        padding: 0 22px;
        z-index: 1;
      }

      .pmo-primary-tabs button .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-primary-tabs button.active {
        background: #ffffff;
        color: var(--brand);
        font-weight: 500;
        z-index: 3;
      }

      .pmo-primary-tabs button.active::before,
      .pmo-primary-tabs button.active::after {
        background: #ffffff;
        bottom: 0;
        content: "";
        display: block;
        height: 14px;
        pointer-events: none;
        position: absolute;
        width: 14px;
      }

      .pmo-primary-tabs button.active::before {
        background: radial-gradient(circle at left top, transparent 14px, #ffffff 14.5px);
        left: -14px;
      }

      .pmo-primary-tabs button.active::after {
        background: radial-gradient(circle at right top, transparent 14px, #ffffff 14.5px);
        border-radius: 0;
        left: auto;
        right: -14px;
      }

      .pmo-secondary-tabs button {
        height: 36px;
      }

      .pmo-tab-strip button.active {
        color: var(--brand);
      }

      .pmo-tab-strip button.active::after {
        background: var(--brand);
        border-radius: 999px 999px 0 0;
        bottom: -1px;
        content: "";
        height: 2px;
        left: 12px;
        position: absolute;
        right: 12px;
      }

      .pmo-primary-tabs button.active::after {
        background: radial-gradient(circle at right top, transparent 14px, #ffffff 14.5px);
        border-radius: 0;
        bottom: 0;
        height: 14px;
        left: auto;
        right: -14px;
        width: 14px;
      }

      .pmo-forum-toolbar {
        align-items: center;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-width: 0;
        padding: 16px 28px 8px;
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
        font-weight: 400;
        line-height: 18px;
        margin-right: 4px;
      }

      .pmo-viewing-control button {
        background: #ffffff;
        border: 1px solid #d5dbea;
        border-radius: 7px;
        color: var(--brand);
        font-size: 12px;
        font-weight: 500;
        height: 36px;
        padding: 0 13px;
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

      .pmo-add-forum {
        --pm-toolbar-control-height: 38px;
        border-radius: 7px;
        height: 38px;
      }

      .pmo-forum-search {
        --pm-expandable-search-expanded-width: 220px;
        --pm-expandable-search-grow: 0;
        --pm-expandable-search-height: 38px;
        --pm-expandable-search-radius: 7px;
      }

      .pmo-table-wrap {
        max-height: min(532px, calc(100dvh - 292px));
        margin: 0 28px;
        min-height: 0;
        overscroll-behavior: contain;
        overflow: auto;
      }

      .pmo-scroll-table-wrap {
        overscroll-behavior: contain;
      }

      .pmo-forum-table {
        border: 1px solid #dfe4ee;
        border-collapse: separate;
        border-radius: 8px;
        border-spacing: 0;
        color: #202633;
        min-width: 1088px;
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
        padding: 9px 10px;
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
        font-weight: 500;
        height: 52px;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .pmo-forum-table tbody tr:nth-child(even) td {
        background: #f8f9fb;
      }

      .pmo-forum-table tbody tr:hover td {
        background: #fbfcff;
      }

      .pmo-forum-table tbody tr.pmo-clickable-row {
        cursor: pointer;
        outline: none;
      }

      .pmo-forum-table tbody tr.pmo-clickable-row:focus-visible td {
        background: #f2f5ff;
        box-shadow: inset 0 0 0 1px rgba(16, 6, 159, 0.26);
      }

      .pmo-forum-table tbody tr:last-child td {
        border-bottom: 0;
      }

      .pmo-col-favorite {
        width: 48px;
      }

      .pmo-col-forum {
        width: 246px;
      }

      .pmo-col-id {
        width: 74px;
      }

      .pmo-col-secretariat {
        width: 134px;
      }

      .pmo-col-type {
        width: 128px;
      }

      .pmo-col-category {
        width: 134px;
      }

      .pmo-col-members {
        width: 118px;
      }

      .pmo-col-meeting {
        width: 144px;
      }

      .pmo-col-action {
        width: 42px;
      }

      .pmo-source-table {
        min-width: 980px;
      }

      .pmo-source-table th,
      .pmo-source-table td {
        height: 43px;
        padding-bottom: 10px;
        padding-top: 10px;
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
        min-width: 1120px;
      }

      .pmo-record-table th {
        height: 60px;
      }

      .pmo-record-table td {
        height: 60px;
        padding-bottom: 12px;
        padding-top: 12px;
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

      .pmo-sort-header {
        gap: 4px;
      }

      .pmo-sort-header .icon {
        color: var(--brand);
        height: 12px;
        width: 12px;
      }

      .pmo-favorite-cell,
      .pmo-action-cell,
      .pmo-center {
        text-align: center;
      }

      .pmo-favorite-button {
        color: #c8ced8;
        height: 28px;
        width: 28px;
      }

      .pmo-favorite-button.is-favorite {
        color: #b59e5f;
      }

      .pmo-favorite-button.is-favorite .icon svg {
        fill: currentColor;
      }

      .pmo-forum-name {
        color: #1d252d;
        display: block;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-forum-link {
        background: transparent;
        border: 0;
        cursor: pointer;
        padding: 0;
        text-align: left;
        width: 100%;
      }

      .pmo-forum-link:hover,
      .pmo-forum-link:focus-visible {
        color: var(--brand);
        outline: none;
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

      .pmo-record-status.is-open {
        color: #1d252d;
      }

      .pmo-record-status.is-pending {
        color: #5f6878;
      }

      .pmo-secretariat {
        color: #1d252d;
        display: block;
        font-weight: 500;
        line-height: 17px;
      }

      .pmo-forum-tag {
        align-items: center;
        background: #eef0f4;
        border: 1px solid #e3e7ef;
        border-radius: 999px;
        color: #687182;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        gap: 4px;
        height: 20px;
        margin-top: 5px;
        min-width: 44px;
        padding: 0 9px;
      }

      .pmo-forum-tag .icon {
        color: var(--brand);
        height: 11px;
        width: 11px;
      }

      .pmo-more-owners {
        color: var(--brand);
        display: block;
        font-size: 11px;
        font-style: italic;
        font-weight: 600;
        line-height: 15px;
        margin-top: 2px;
      }

      .pmo-type-pill {
        background: rgba(173, 220, 145, 0.28);
        border: 1px solid rgba(118, 181, 76, 0.24);
        border-radius: 999px;
        color: #173f35;
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        max-width: 100%;
        min-height: 22px;
        padding: 3px 8px;
        white-space: normal;
      }

      .pmo-type-pill.non-substantiated {
        background: rgba(232, 119, 34, 0.12);
        border-color: rgba(232, 119, 34, 0.22);
        color: #91440d;
      }

      .pmo-zero-badge,
      .pmo-meeting-badge {
        align-items: center;
        border-radius: 6px;
        display: inline-flex;
        font-size: 11px;
        font-weight: 500;
        justify-content: center;
      }

      .pmo-zero-badge {
        background: #e8ebf1;
        color: #687182;
        height: 24px;
        min-width: 28px;
        padding: 0 8px;
      }

      .pmo-meeting-badge {
        background: #eef0f4;
        color: #5f6878;
        font-style: italic;
        min-height: 26px;
        padding: 4px 12px;
      }

      .pmo-forum-table thead th,
      .pmo-forum-table thead th span {
        font-weight: 500;
      }

      .pmo-forum-table tbody td,
      .pmo-forum-table tbody td button,
      .pmo-forum-table tbody td small,
      .pmo-forum-table tbody td span,
      .pmo-forum-table tbody td strong {
        font-weight: 400;
      }

      .pmo-empty-state {
        align-items: center;
        display: grid;
        gap: 5px;
        justify-items: center;
        min-height: 220px;
        text-align: center;
      }

      .pmo-empty-state strong {
        color: #202633;
        font-size: 14px;
        font-weight: 500;
      }

      .pmo-empty-state span {
        color: #687182;
        font-size: 12px;
      }

      .pmo-register-placeholder {
        align-items: center;
        color: #687182;
        display: grid;
        gap: 6px;
        justify-items: center;
        min-height: 360px;
        padding: 40px 28px;
        text-align: center;
      }

      .pmo-register-placeholder strong {
        color: #202633;
        font-size: 15px;
        font-weight: 500;
      }

      .pmo-register-placeholder span {
        font-size: 12px;
        font-weight: 500;
      }

      .pmo-forum-detail-view {
        display: grid;
        grid-row: 1 / -1;
        grid-template-rows: auto auto auto;
        min-height: 0;
        overflow: auto;
        padding: 22px 46px 28px;
      }

      .pmo-forum-detail-view[hidden] {
        display: none !important;
      }

      .pmo-forum-detail-header {
        align-items: start;
        display: grid;
        gap: 16px;
        grid-template-columns: 38px minmax(0, 1fr) auto;
        min-width: 0;
        padding: 0 0 42px;
      }

      .pmo-forum-detail-back {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d7dde8;
        border-radius: 999px;
        color: #7b8494;
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .pmo-forum-detail-back .icon {
        height: 18px;
        width: 18px;
      }

      .pmo-forum-detail-meta {
        display: grid;
        gap: 28px;
        grid-template-columns: minmax(220px, 1fr) 100px 180px;
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
        font-weight: 500;
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

      .pmo-forum-detail-actions {
        align-items: center;
        display: flex;
        gap: 6px;
        justify-content: flex-end;
      }

      .pmo-forum-action-button {
        height: 30px;
      }

      .pmo-forum-detail-tabs {
        align-items: flex-end;
        border-bottom: 1px solid #dfe4ee;
        display: flex;
        gap: 42px;
        justify-content: center;
        min-width: 0;
      }

      .pmo-forum-detail-tabs button {
        color: #404756;
        font-size: 12px;
        font-weight: 500;
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

      .pmo-meetings-register {
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

      .pmo-meeting-section-heading h2 {
        color: #1d252d;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
      }

      .pmo-create-meeting {
        --pm-toolbar-control-height: 32px;
        border-radius: 4px;
        height: 32px;
        min-width: 140px;
      }

      .pmo-meeting-table-wrap {
        margin-top: 8px;
        min-height: 0;
        overflow: visible;
      }

      .pmo-meeting-table {
        min-width: 820px;
      }

      .pmo-meeting-table th,
      .pmo-meeting-table td {
        height: 42px;
        padding: 10px 18px;
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

      .pmo-no-meeting-badge {
        background: #9a9a9a;
        color: #ffffff;
        display: table;
        font-size: 10px;
        font-weight: 500;
        line-height: 12px;
        margin: 0 auto;
        min-height: 23px;
        padding: 6px 10px 5px;
      }

      .pmo-past-meeting-heading {
        margin-top: 44px;
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

      .pmo-meeting-footer {
        padding: 16px 0 0;
      }

      .pmo-forum-sources-register {
        display: block;
        min-height: 0;
        padding-top: 10px;
      }

      .pmo-forum-source-toolbar {
        align-items: center;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        min-width: 0;
        padding-bottom: 8px;
      }

      .pmo-add-source {
        --pm-toolbar-control-height: 32px;
        border-radius: 4px;
        height: 32px;
        min-width: 88px;
      }

      .pmo-forum-source-search {
        --pm-expandable-search-expanded-width: 180px;
      }

      .pmo-forum-source-table {
        min-width: 940px;
      }

      .pmo-forum-source-table th,
      .pmo-forum-source-table td {
        height: 49px;
        padding: 12px 10px;
      }

      .pmo-forum-records-register {
        display: block;
        min-height: 0;
        padding-top: 10px;
      }

      .pmo-print-records-button {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d5dbea;
        border-radius: 7px;
        color: var(--brand);
        display: inline-flex;
        font-size: 12px;
        font-weight: 600;
        gap: 6px;
        height: 32px;
        justify-content: center;
        padding: 0 12px;
        white-space: nowrap;
      }

      .pmo-print-records-button .icon {
        height: 14px;
        width: 14px;
      }

      .pmo-forum-record-table {
        min-width: 1040px;
      }

      .pmo-forum-record-table th,
      .pmo-forum-record-table td {
        height: 52px;
        padding-bottom: 10px;
        padding-top: 10px;
      }

      .pmo-watchlist-register {
        align-items: start;
        display: grid;
        gap: 24px;
        grid-template-columns: 190px minmax(0, 1fr);
        min-height: 0;
        padding-top: 20px;
      }

      .pmo-watchlist-category-rail {
        background: #ffffff;
        border: 1px solid #e3e9f1;
        border-radius: 8px;
        display: grid;
        overflow: hidden;
      }

      .pmo-watchlist-category-rail button {
        align-items: center;
        background: #ffffff;
        color: #2f3a4b;
        display: flex;
        font-size: 13px;
        font-weight: 500;
        gap: 10px;
        height: 42px;
        justify-content: space-between;
        padding: 0 13px 0 17px;
        position: relative;
        text-align: left;
      }

      .pmo-watchlist-category-rail button + button {
        border-top: 1px solid #edf1f6;
      }

      .pmo-watchlist-category-rail button .icon {
        color: #7d8797;
        height: 14px;
        width: 14px;
      }

      .pmo-watchlist-category-rail button.active {
        background: #f4f6fc;
        color: var(--brand);
        font-weight: 500;
      }

      .pmo-watchlist-category-rail button.active::before {
        background: var(--brand);
        content: "";
        inset: 0 auto 0 0;
        position: absolute;
        width: 3px;
      }

      .pmo-watchlist-category-rail button.active .icon {
        color: var(--brand);
      }

      .pmo-watchlist-panel {
        display: block;
        min-width: 0;
      }

      .pmo-watchlist-heading {
        align-items: start;
        display: grid;
        gap: 8px;
        justify-items: start;
        min-width: 0;
      }

      .pmo-watchlist-heading h2 {
        color: #1d252d;
        font-size: 14px;
        font-weight: 500;
        line-height: 19px;
      }

      .pmo-add-watchlist {
        --pm-toolbar-control-height: 32px;
        border-radius: 4px;
        height: 32px;
        min-width: 160px;
      }

      .pmo-watchlist-heading strong {
        color: #333b4a;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }

      .pmo-watchlist-table-wrap {
        margin-top: 5px;
        min-height: 0;
        overflow: auto;
      }

      .pmo-watchlist-table {
        min-width: 920px;
      }

      .pmo-watchlist-table th,
      .pmo-watchlist-table td {
        height: 40px;
        padding: 8px 10px;
      }

      .pmo-watchlist-table tbody tr:nth-child(even) td {
        background: #fbfcfe;
      }

      .pmo-watchlist-table tbody tr.pmo-watchlist-expanded-row td {
        background: #f6f7fa;
        height: 78px;
        padding: 0 28px 11px;
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

      .pmo-watchlist-name .icon {
        color: #69758a;
        height: 14px;
        width: 14px;
      }

      .pmo-watchlist-name strong {
        display: -webkit-box;
        font-size: 12px;
        font-weight: 500;
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
        font-weight: 500;
        gap: 5px;
        justify-self: start;
        line-height: 18px;
      }

      .pmo-watchlist-record-add .icon {
        height: 14px;
        width: 14px;
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
        --pm-toolbar-control-height: 32px;
        border-radius: 4px;
        height: 32px;
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
        max-width: min(1060px, 100%);
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
        font-weight: 500;
      }

      .pmo-forum-detail-empty span {
        font-size: 12px;
        font-weight: 500;
      }

      .pmo-reports-view {
        display: grid;
        grid-template-rows: auto auto minmax(0, 1fr);
        min-height: 0;
        padding: 18px 28px 28px;
      }

      .pmo-reports-heading {
        align-items: center;
        display: flex;
        justify-content: space-between;
        min-width: 0;
      }

      .pmo-reports-heading h2 {
        color: #1d252d;
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
      }

      .pmo-create-report {
        --pm-toolbar-control-height: 38px;
        border-radius: 7px;
        color: #ffffff;
        height: 38px;
        min-width: 146px;
      }

      .pmo-report-toolbar {
        justify-content: flex-end;
        padding: 16px 0 8px;
      }

      .pmo-report-actions {
        width: auto;
      }

      .pmo-report-table-wrap {
        margin: 0;
      }

      .pmo-report-table {
        min-width: 760px;
      }

      .pmo-report-name-col {
        width: 38%;
      }

      .pmo-report-group-col {
        width: 34%;
      }

      .pmo-report-action-col {
        width: 28%;
      }

      .pmo-no-report-data {
        color: #555555;
        display: block;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
      }

      @media (max-width: 1180px) {
        .pmo-forum-toolbar {
          align-items: flex-start;
          flex-direction: column;
        }

        .pmo-forum-actions {
          justify-content: flex-start;
          width: 100%;
        }

        .pmo-watchlist-register {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-watchlist-category-rail {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .pmo-watchlist-category-rail button + button {
          border-left: 1px solid #edf1f6;
          border-top: 0;
        }
      }

      @media (max-width: 760px) {
        .pmo-governance-canvas {
          padding: 12px;
        }

        .pmo-page-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .pmo-content-surface {
          border-radius: 8px;
        }

        .pmo-forum-toolbar,
        .pmo-register-placeholder,
        .pmo-reports-view {
          padding-left: 16px;
          padding-right: 16px;
        }

        .pmo-table-wrap {
          margin: 0 16px;
        }

        .pmo-forum-actions {
          flex-wrap: wrap;
        }

        .pmo-forum-search {
          --pm-expandable-search-expanded-width: min(220px, 100%);
        }

        .pmo-forum-detail-view {
          padding-left: 16px;
          padding-right: 16px;
        }

        .pmo-watchlist-category-rail {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-watchlist-category-rail button + button {
          border-left: 0;
          border-top: 1px solid #edf1f6;
        }

        .pmo-reports-heading {
          align-items: flex-start;
          flex-direction: column;
          gap: 12px;
        }

        .pmo-report-toolbar {
          padding-left: 0;
          padding-right: 0;
        }

        .pmo-report-table-wrap {
          margin-left: 0;
          margin-right: 0;
        }
      }
    `,
  ],
})
export class PmoGovernanceWorkspaceComponent {
  @Input() forums: readonly PmoGovernanceForumRow[] = pmoGovernanceForumRows;
  @Output() readonly forumDetailSelected = new EventEmitter<PmoGovernanceForumRow>();

  readonly primaryTabs = pmoGovernancePrimaryTabs;
  readonly sectionTabs = pmoGovernanceSectionTabs;
  readonly baseReportTemplates = pmoGovernanceReportTemplateRows;
  readonly sources = pmoGovernanceSourceRows;
  readonly records = pmoGovernanceRecordRows;
  readonly forumDetailTabs = pmoGovernanceForumDetailTabs;
  readonly pastMeetings = pmoGovernancePastMeetingRows;
  readonly forumSources = pmoGovernanceForumSourceRows;
  readonly forumRecords = pmoGovernanceForumRecordRows;
  readonly watchlistCategories = pmoGovernanceWatchlistCategories;
  readonly watchlistRows = pmoGovernanceWatchlistRows;
  readonly forumIssueEmptyState = pmoGovernanceForumIssueEmptyState;

  activePrimaryTab: PmoGovernanceTabId = 'governance';
  activeSectionTab: PmoGovernanceSectionId = 'forums';
  activeForumDetailTab: PmoGovernanceForumDetailTabId = 'overview';
  activeWatchlistCategory: PmoGovernanceWatchlistCategoryId = 'risks';
  forumScope: PmoGovernanceForumScope = 'all';
  sourceScope: PmoGovernanceSourceScope = 'all';
  recordScope: PmoGovernanceRecordScope = 'all';
  forumSourceScope: PmoGovernanceSourceScope = 'all';
  forumRecordScope: PmoGovernanceRecordScope = 'all';
  selectedForum: PmoGovernanceForumRow | null = null;
  selectedRecordDetail: PmoGovernanceRecordDetail | null = null;
  searchQuery = '';
  sourceSearchQuery = '';
  recordSearchQuery = '';
  meetingSearchQuery = '';
  forumSourceSearchQuery = '';
  forumRecordSearchQuery = '';
  reportSearchQuery = '';
  forumDrawerOpen = false;
  sourceDrawerOpen = false;
  recordDrawerOpen = false;
  reportDrawerOpen = false;
  createdReportTemplates: readonly PmoGovernanceReportTemplateRow[] = [];
  private sourceDrawerContext: PmoGovernanceSourceDrawerContext = 'workspace';
  private recordDrawerContext: PmoGovernanceRecordDrawerContext = 'workspace';

  get reportTemplates(): readonly PmoGovernanceReportTemplateRow[] {
    return [...this.createdReportTemplates, ...this.baseReportTemplates];
  }

  get visibleForums(): readonly PmoGovernanceForumRow[] {
    const query = this.normalizedSearchQuery;
    const scopedForums = this.forumScope === 'mine' ? [] : this.forums;
    if (!query) return scopedForums;
    return scopedForums.filter((forum) => this.forumSearchValue(forum).includes(query));
  }

  get visibleReports(): readonly PmoGovernanceReportTemplateRow[] {
    const query = this.normalizedReportSearchQuery;
    if (!query) return this.reportTemplates;
    return this.reportTemplates.filter((report) => this.reportSearchValue(report).includes(query));
  }

  get visibleSources(): readonly PmoGovernanceSourceRow[] {
    const query = this.normalizedSourceSearchQuery;
    const scopedSources = this.sourceScope === 'mine' ? [] : this.sources;
    if (!query) return scopedSources;
    return scopedSources.filter((source) => this.sourceSearchValue(source).includes(query));
  }

  get visibleRecords(): readonly PmoGovernanceRecordRow[] {
    const query = this.normalizedRecordSearchQuery;
    const scopedRecords = this.recordScope === 'mine' ? [] : this.records;
    if (!query) return scopedRecords;
    return scopedRecords.filter((record) => this.recordSearchValue(record).includes(query));
  }

  get visiblePastMeetings(): readonly PmoGovernanceMeetingRow[] {
    const query = this.normalizedMeetingSearchQuery;
    if (!query) return this.pastMeetings;
    return this.pastMeetings.filter((meeting) => this.meetingSearchValue(meeting).includes(query));
  }

  get activeForumDetailLabel(): string {
    return this.forumDetailTabs.find((tab) => tab.id === this.activeForumDetailTab)?.label ?? 'Forum Section';
  }

  get activePrimaryTabLabel(): string {
    return this.primaryTabs.find((tab) => tab.id === this.activePrimaryTab)?.label ?? 'Workspace';
  }

  get visibleForumSources(): readonly PmoGovernanceSourceRow[] {
    const query = this.normalizedForumSourceSearchQuery;
    const scopedSources = this.forumSourceScope === 'mine' ? [] : this.forumSources;
    if (!query) return scopedSources;
    return scopedSources.filter((source) => this.sourceSearchValue(source).includes(query));
  }

  get visibleForumRecords(): readonly PmoGovernanceRecordRow[] {
    const query = this.normalizedForumRecordSearchQuery;
    const scopedRecords = this.forumRecordScope === 'mine' ? [] : this.forumRecords;
    if (!query) return scopedRecords;
    return scopedRecords.filter((record) => this.recordSearchValue(record).includes(query));
  }

  get activeWatchlistCategoryLabel(): string {
    return this.watchlistCategories.find((category) => category.id === this.activeWatchlistCategory)?.label ?? 'Watchlist';
  }

  get visibleWatchlistRows(): readonly PmoGovernanceWatchlistRow[] {
    return this.watchlistRows.filter((item) => item.categoryId === this.activeWatchlistCategory);
  }

  setPrimaryTab(tabId: PmoGovernanceTabId | PmoGovernanceSectionId | PmoGovernanceForumDetailTabId): void {
    if (
      tabId === 'portfolio-register' ||
      tabId === 'risk-register' ||
      tabId === 'benefits-register' ||
      tabId === 'issues-register' ||
      tabId === 'governance'
    ) {
      this.activePrimaryTab = tabId;
      this.forumDrawerOpen = false;
      this.sourceDrawerOpen = false;
      this.recordDrawerOpen = false;
      this.reportDrawerOpen = false;
      if (tabId !== 'governance') {
        this.selectedForum = null;
        this.selectedRecordDetail = null;
      }
    }
  }

  setSectionTab(tabId: PmoGovernanceTabId | PmoGovernanceSectionId | PmoGovernanceForumDetailTabId): void {
    if (tabId === 'forums' || tabId === 'sources' || tabId === 'records' || tabId === 'reports') {
      this.activeSectionTab = tabId;
      this.selectedRecordDetail = null;
      this.forumDrawerOpen = false;
      this.sourceDrawerOpen = false;
      this.recordDrawerOpen = false;
      this.reportDrawerOpen = false;
    }
  }

  setForumDetailTab(tabId: PmoGovernanceTabId | PmoGovernanceSectionId | PmoGovernanceForumDetailTabId): void {
    if (tabId === 'overview' || tabId === 'meetings' || tabId === 'sources' || tabId === 'records' || tabId === 'watchlist' || tabId === 'issues') {
      this.activeForumDetailTab = tabId;
    }
  }

  openForumDetail(forum: PmoGovernanceForumRow): void {
    this.selectedForum = null;
    this.selectedRecordDetail = null;
    this.activeForumDetailTab = 'overview';
    this.forumDetailSelected.emit(forum);
  }

  closeForumDetail(): void {
    this.selectedForum = null;
    this.activeForumDetailTab = 'overview';
  }

  openRecordDetail(record: PmoGovernanceRecordRow): void {
    this.selectedRecordDetail = pmoGovernanceRecordDetailFor(record);
    this.selectedForum = null;
    this.forumDrawerOpen = false;
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.reportDrawerOpen = false;
    this.activeSectionTab = 'records';
  }

  closeRecordDetail(): void {
    this.selectedRecordDetail = null;
    this.activeSectionTab = 'records';
  }

  openForumDrawer(): void {
    this.selectedForum = null;
    this.selectedRecordDetail = null;
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.reportDrawerOpen = false;
    this.forumDrawerOpen = true;
  }

  closeForumDrawer(): void {
    this.forumDrawerOpen = false;
  }

  saveForumDraft(_draft: PmoGovernanceForumDraft): void {
    this.forumDrawerOpen = false;
  }

  openSourceDrawer(context: PmoGovernanceSourceDrawerContext): void {
    this.sourceDrawerContext = context;
    this.forumDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.reportDrawerOpen = false;
    this.sourceDrawerOpen = true;
  }

  closeSourceDrawer(): void {
    this.sourceDrawerOpen = false;
  }

  saveSourceDraft(_draft: PmoGovernanceSourceDraft): void {
    this.sourceDrawerOpen = false;
    if (this.sourceDrawerContext === 'forum') {
      this.forumSourceScope = 'all';
      return;
    }
    this.sourceScope = 'all';
  }

  openRecordDrawer(context: PmoGovernanceRecordDrawerContext): void {
    this.recordDrawerContext = context;
    this.forumDrawerOpen = false;
    this.sourceDrawerOpen = false;
    this.reportDrawerOpen = false;
    this.recordDrawerOpen = true;
  }

  closeRecordDrawer(): void {
    this.recordDrawerOpen = false;
  }

  saveRecordDraft(_draft: PmoGovernanceRecordDraft): void {
    this.recordDrawerOpen = false;
    if (this.recordDrawerContext === 'forum') {
      this.forumRecordScope = 'all';
      return;
    }
    this.recordScope = 'all';
  }

  openReportDrawer(): void {
    this.selectedForum = null;
    this.selectedRecordDetail = null;
    this.forumDrawerOpen = false;
    this.sourceDrawerOpen = false;
    this.recordDrawerOpen = false;
    this.activePrimaryTab = 'governance';
    this.activeSectionTab = 'reports';
    this.reportDrawerOpen = true;
  }

  closeReportDrawer(): void {
    this.reportDrawerOpen = false;
  }

  saveReportDraft(draft: PmoGovernanceReportDraft): void {
    const nextReport = pmoGovernanceReportTemplateRowFromDraft(draft, `report-template-${this.createdReportTemplates.length + 1}`);
    this.createdReportTemplates = [nextReport, ...this.createdReportTemplates];
    this.reportSearchQuery = '';
    this.reportDrawerOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  closeOpenDrawerFromEscape(event: Event): void {
    if (!this.selectedRecordDetail && !this.forumDrawerOpen && !this.sourceDrawerOpen && !this.recordDrawerOpen && !this.reportDrawerOpen) return;
    event.preventDefault();
    if (this.reportDrawerOpen) {
      this.closeReportDrawer();
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
    if (this.forumDrawerOpen) {
      this.closeForumDrawer();
      return;
    }
    if (this.selectedRecordDetail) {
      this.closeRecordDetail();
      return;
    }
  }

  setForumScope(scope: PmoGovernanceForumScope): void {
    this.forumScope = scope;
  }

  setSourceScope(scope: PmoGovernanceSourceScope): void {
    this.sourceScope = scope;
  }

  setForumSourceScope(scope: PmoGovernanceSourceScope): void {
    this.forumSourceScope = scope;
  }

  setForumRecordScope(scope: PmoGovernanceRecordScope): void {
    this.forumRecordScope = scope;
  }

  setWatchlistCategory(categoryId: PmoGovernanceWatchlistCategoryId): void {
    this.activeWatchlistCategory = categoryId;
  }

  setRecordScope(scope: PmoGovernanceRecordScope): void {
    this.recordScope = scope;
  }

  setSearchQuery(value: Event | string): void {
    this.searchQuery = this.searchInputValue(value);
  }

  setSourceSearchQuery(value: Event | string): void {
    this.sourceSearchQuery = this.searchInputValue(value);
  }

  setRecordSearchQuery(value: Event | string): void {
    this.recordSearchQuery = this.searchInputValue(value);
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

  setReportSearchQuery(value: Event | string): void {
    this.reportSearchQuery = this.searchInputValue(value);
  }

  private searchInputValue(value: Event | string): string {
    return typeof value === 'string' ? value : (value.target as HTMLInputElement | null)?.value ?? '';
  }

  private get normalizedSearchQuery(): string {
    return this.normalizeSearchValue(this.searchQuery);
  }

  private get normalizedReportSearchQuery(): string {
    return this.normalizeSearchValue(this.reportSearchQuery);
  }

  private get normalizedSourceSearchQuery(): string {
    return this.normalizeSearchValue(this.sourceSearchQuery);
  }

  private get normalizedRecordSearchQuery(): string {
    return this.normalizeSearchValue(this.recordSearchQuery);
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

  private forumSearchValue(forum: PmoGovernanceForumRow): string {
    return this.normalizeSearchValue(
      [
        forum.forumName,
        forum.forumId,
        forum.secretariat,
        forum.moreOwners ?? '',
        forum.type,
        forum.category,
        String(forum.members),
        forum.nextMeeting,
      ].join(' '),
    );
  }

  private reportSearchValue(report: PmoGovernanceReportTemplateRow): string {
    return this.normalizeSearchValue([report.reportName, report.groupBy, report.viewLabel].join(' '));
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

  private normalizeSearchValue(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
}
