import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleReportingEmptyIllustrationComponent } from '../shared/pm-console-reporting-empty-illustration.component';
import { PmConsoleModeTabsComponent, PmConsoleModeTabItem } from '../shared/pm-console-mode-tabs.component';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';
import { GlossaryItem, initialP3mGlossary, initialRiskGlossary, initialBenefitsGlossary } from './portfolio-workspace.data';


export interface TaxonomyCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: string[];
  needsAttention?: boolean;
  workflowStepsData?: any[];
}

@Component({
  selector: 'app-portfolio-workspace-framework',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PmConsoleReportingEmptyIllustrationComponent,
    PmConsoleModeTabsComponent,
    PmConsolePlanDrawerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top Hero Header with Back Button and Sliding Tabs -->
    <header class="project-plan-hero plan-builder-hero project-scope-hero project-plan-card-hero">
      <img class="project-plan-hero-art" src="./assets/workspace-line-art.svg" alt="" aria-hidden="true" />
      <div class="project-plan-hero-inner">
        <div class="project-plan-summary">
          <div class="project-plan-title plan-builder-title">
            <button class="project-plan-back" type="button" aria-label="Go back" (click)="back.emit()">
              <span class="icon" aria-hidden="true"><span pmConsoleIcon="arrow-left"></span></span>
            </button>
            <h1>Framework Settings</h1>
          </div>
        </div>

        <!-- Horizontal sliding tabs using shared PmConsoleModeTabsComponent -->
        <app-pm-console-mode-tabs
          ariaLabel="Framework settings tabs"
          [tabs]="tabs"
          [activeId]="activeSectionId"
          (tabSelected)="setSection($event)"
        ></app-pm-console-mode-tabs>
      </div>
    </header>

    <!-- Scrollable full-width tab content area -->
    <main class="portfolio-workspace-body" style="grid-row: 2; overflow-y: auto; background: #ffffff; padding: 24px; display: flex; flex-direction: column;">
      
      @if (activeSectionId === 'org-structure') {
        <div class="org-structure-container animation-fade">
          @if (groupObjects.length === 0) {
            <div class="org-structure-intro">
              <h2>Organisational Structure</h2>
              <p>Configure groups, divisions, brands, and sections to define the portfolio's hierarchical architecture.</p>
            </div>

            <div class="org-empty-state-wrapper">
              <div class="org-empty-circle">
                <span pmConsoleIcon="building" class="org-empty-icon"></span>
              </div>
              <h3>Build your organisational structure</h3>
              <p>Start by adding your first Group. From there, you can branch out to include specific divisions, branches, and sections to accurately map your hierarchy.</p>
              <button id="org-empty-add-division-btn" class="org-empty-btn" type="button" (click)="openAddGroupDrawer()">
                <span pmConsoleIcon="plus"></span>
                <span>Add Group</span>
              </button>
            </div>
          } @else {
            <div class="org-structure-header-row">
              <div class="org-structure-intro">
                <h2>Organisational Structure</h2>
                <p>Configure groups, divisions, brands, and sections to define the portfolio's hierarchical architecture.</p>
              </div>
              <button id="org-header-add-division-btn" class="org-header-add-btn" type="button" (click)="openAddGroupDrawer()">
                <span pmConsoleIcon="plus"></span>
                <span>Add Group</span>
              </button>
            </div>

            <!-- Horizontal Groups Tabs Row -->
            <div class="groups-tabs-row">
              @for (group of groupObjects; track $index; let gIdx = $index) {
                <div 
                  class="group-card pointer animation-fade" 
                  [class.active]="selectedGroupIndex === gIdx"
                  (click)="selectGroup(gIdx)"
                >
                  <div class="group-card-icon-wrap">
                    <span pmConsoleIcon="folder" class="group-card-icon"></span>
                  </div>
                  <div class="group-card-title-area">
                    <input
                      [id]="'org-group-input-' + gIdx"
                      type="text"
                      class="group-card-input"
                      [placeholder]="'Group Name'"
                      [(ngModel)]="group.name"
                      (ngModelChange)="syncLegacyArrays()"
                      (click)="selectedGroupIndex === gIdx ? $event.stopPropagation() : selectGroup(gIdx)"
                    />
                    @if (group.owner) {
                      <span class="group-card-owner-badge">Owner: {{ group.owner }}</span>
                    }
                  </div>
                  
                  <div class="division-action-menu-wrap" (click)="$event.stopPropagation()">
                    <button 
                      [id]="'org-group-menu-btn-' + gIdx"
                      type="button" 
                      class="division-action-trigger flat-dots-trigger" 
                      (click)="toggleGroupMenu($event, gIdx)"
                      title="Actions"
                    >
                      <span pmConsoleIcon="more-vertical"></span>
                    </button>
                    
                    @if (openGroupMenuIndex === gIdx) {
                      <div class="division-dropdown-menu animation-fade" role="menu">
                        <button 
                          [id]="'org-group-edit-action-' + gIdx"
                          type="button" 
                          class="division-dropdown-item" 
                          (click)="openEditGroupDrawer(gIdx); openGroupMenuIndex = null"
                        >
                          <span pmConsoleIcon="eye" class="item-icon"></span>
                          <span>View Details</span>
                        </button>
                        <button 
                          [id]="'org-group-delete-action-' + gIdx"
                          type="button" 
                          class="division-dropdown-item delete" 
                          (click)="removeGroup(gIdx)"
                        >
                          <span pmConsoleIcon="trash-2" class="item-icon"></span>
                          <span>Delete</span>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Add Group tab button -->
              <button 
                id="org-add-group-btn" 
                class="add-group-tab-card" 
                type="button" 
                (click)="openAddGroupDrawer()"
              >
                <span pmConsoleIcon="plus"></span>
                <span>Add Group</span>
              </button>
            </div>

            <!-- Active Group Content Panel -->
            @if (groupObjects[selectedGroupIndex]) {
              <div class="active-group-details animation-fade" style="margin-top: 8px; width: 100%;">
                <!-- Divisions under the active Group -->
                <div class="divisions-list-stack" style="gap: 36px; display: flex; flex-direction: column;">
                  @for (div of groupObjects[selectedGroupIndex].divisions; track $index; let dIdx = $index) {
                    <div class="division-section animation-fade">
                      <!-- Division Header Card -->
                      <div class="division-card">
                        <div class="division-card-icon-wrap">
                          <span pmConsoleIcon="git-branch" class="division-card-icon"></span>
                        </div>
                        <input
                          [id]="'org-division-input-' + selectedGroupIndex + '-' + dIdx"
                          type="text"
                          class="division-card-input"
                          [placeholder]="'Division Name'"
                          [(ngModel)]="div.name"
                          (ngModelChange)="syncLegacyArrays()"
                        />
                        <div class="division-action-menu-wrap">
                          <button 
                            [id]="'org-division-menu-btn-' + selectedGroupIndex + '-' + dIdx"
                            type="button" 
                            class="division-action-trigger flat-dots-trigger" 
                            (click)="toggleDivisionMenu($event, selectedGroupIndex, dIdx)"
                            title="Actions"
                          >
                            <span pmConsoleIcon="more-vertical"></span>
                          </button>
                          
                          @if (openDivisionIndex && openDivisionIndex.groupIndex === selectedGroupIndex && openDivisionIndex.divisionIndex === dIdx) {
                            <div class="division-dropdown-menu animation-fade" role="menu">
                              <button 
                                [id]="'org-division-delete-action-' + selectedGroupIndex + '-' + dIdx"
                                type="button" 
                                class="division-dropdown-item delete" 
                                (click)="removeDivision(selectedGroupIndex, dIdx)"
                              >
                                <span pmConsoleIcon="trash-2" class="item-icon"></span>
                                <span>Delete</span>
                              </button>
                            </div>
                          }
                        </div>
                      </div>

                      <!-- Branches Row (horizontal columns grid) -->
                      <div class="branches-row-flex">
                        @for (branch of div.branches; track $index; let bIdx = $index) {
                          <div class="branch-column-card animation-fade">
                            <!-- Branch Header Card -->
                            <div class="branch-card-header-box">
                              <div class="branch-card-icon-wrap">
                                <span pmConsoleIcon="git-branch" class="branch-card-icon"></span>
                              </div>
                              <input
                                [id]="'org-branch-input-' + selectedGroupIndex + '-' + dIdx + '-' + bIdx"
                                type="text"
                                class="branch-card-input"
                                [placeholder]="'Branch Name'"
                                [(ngModel)]="branch.name"
                                (ngModelChange)="syncLegacyArrays()"
                              />
                              
                              <div class="division-action-menu-wrap">
                                <button 
                                  [id]="'org-branch-menu-btn-' + selectedGroupIndex + '-' + dIdx + '-' + bIdx"
                                  type="button" 
                                  class="division-action-trigger flat-dots-trigger" 
                                  (click)="toggleBranchMenu($event, selectedGroupIndex, dIdx, bIdx)"
                                  title="Actions"
                                >
                                  <span pmConsoleIcon="more-vertical"></span>
                                </button>
                                
                                @if (openBranchIndex && openBranchIndex.groupIndex === selectedGroupIndex && openBranchIndex.divisionIndex === dIdx && openBranchIndex.branchIndex === bIdx) {
                                  <div class="division-dropdown-menu animation-fade" role="menu">
                                    <button 
                                      [id]="'org-branch-delete-action-' + selectedGroupIndex + '-' + dIdx + '-' + bIdx"
                                      type="button" 
                                      class="division-dropdown-item delete" 
                                      (click)="removeBranch(selectedGroupIndex, dIdx, bIdx)"
                                    >
                                      <span pmConsoleIcon="trash-2" class="item-icon"></span>
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                }
                              </div>
                            </div>

                            <!-- Vertically stacked sections list inside branch -->
                            <div class="sections-list-wrap">
                              @for (sec of branch.sections; track $index; let sIdx = $index) {
                                <div class="section-card animation-fade">
                                  <input
                                    [id]="'org-section-input-' + selectedGroupIndex + '-' + dIdx + '-' + bIdx + '-' + sIdx"
                                    type="text"
                                    class="section-item-input"
                                    [placeholder]="'Section'"
                                    [(ngModel)]="sec.name"
                                    (ngModelChange)="syncLegacyArrays()"
                                  />
                                  
                                  <div class="division-action-menu-wrap">
                                    <button 
                                      [id]="'org-section-menu-btn-' + selectedGroupIndex + '-' + dIdx + '-' + bIdx + '-' + sIdx"
                                      type="button" 
                                      class="division-action-trigger flat-dots-trigger" 
                                      (click)="toggleSectionMenu($event, selectedGroupIndex, dIdx, bIdx, sIdx)"
                                      title="Actions"
                                    >
                                      <span pmConsoleIcon="more-vertical"></span>
                                    </button>
                                    
                                    @if (openSectionIndex && 
                                         openSectionIndex.groupIndex === selectedGroupIndex && 
                                         openSectionIndex.divisionIndex === dIdx && 
                                         openSectionIndex.branchIndex === bIdx && 
                                         openSectionIndex.sectionIndex === sIdx) {
                                      <div class="division-dropdown-menu animation-fade" role="menu">
                                        <button 
                                          [id]="'org-section-delete-action-' + selectedGroupIndex + '-' + dIdx + '-' + bIdx + '-' + sIdx"
                                          type="button" 
                                          class="division-dropdown-item delete" 
                                          (click)="removeSection(selectedGroupIndex, dIdx, bIdx, sIdx)"
                                        >
                                          <span pmConsoleIcon="trash-2" class="item-icon"></span>
                                          <span>Delete</span>
                                        </button>
                                      </div>
                                    }
                                  </div>
                                </div>
                              }
                            </div>

                            <!-- Add Section CTA at the bottom of the branch column -->
                            <button 
                              [id]="'org-add-section-btn-' + selectedGroupIndex + '-' + dIdx + '-' + bIdx"
                              class="section-text-cta-btn"
                              type="button"
                              (click)="addSection(selectedGroupIndex, dIdx, bIdx)"
                            >
                              <span pmConsoleIcon="plus"></span>
                              <span>Add Section</span>
                            </button>
                          </div>
                        }

                        <!-- Add Branch CTA button at the end of the flex row -->
                        <div class="branch-cta-end">
                          <button 
                            [id]="'org-add-branch-btn-' + selectedGroupIndex + '-' + dIdx" 
                            class="branch-text-cta-btn" 
                            type="button" 
                            (click)="addBranch(selectedGroupIndex, dIdx)"
                          >
                            <span pmConsoleIcon="plus"></span>
                            <span>Add Branches</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  }

                  <!-- Add Division CTA at the bottom of the group's divisions list -->
                  <button 
                    [id]="'org-add-division-btn-' + selectedGroupIndex"
                    class="section-text-cta-btn"
                    type="button"
                    (click)="addDivisionToGroup(selectedGroupIndex)"
                    style="margin-top: 8px;"
                  >
                    <span pmConsoleIcon="plus"></span>
                    <span>Add Division</span>
                  </button>
                </div>
              </div>
            }
          }

          <!-- Add Group Side Drawer (uses platform-standard shell) -->
          @if (isAddingGroup) {
            <app-pm-console-plan-drawer
              eyebrow="ORGANISATIONAL STRUCTURE"
              [title]="editingGroupIndex !== null ? 'Group Details' : 'Add New Group'"
              description="Configure group details, purpose, and environment factors."
              [submitLabel]="editingGroupIndex !== null ? 'Save' : 'Add'"
              cancelLabel="Cancel"
              (close)="closeAddGroupDrawer()"
              (submitForm)="saveGroup(); $event.preventDefault()"
            >
              <!-- Drawer body content projected into planDrawerBody -->
              <div planDrawerBody class="ud-form">
                <!-- Row 1: Group Name + Owner selection -->
                <div class="ud-row ud-row-2col">
                  <div class="ud-field">
                    <label for="groupName" class="ud-label">Group <span class="ud-required">*</span></label>
                    <input 
                      id="groupName" 
                      type="text" 
                      class="ud-input" 
                      placeholder="Enter Group name" 
                      [(ngModel)]="newGroupName" 
                    />
                  </div>
                  <div class="ud-field">
                    <label for="groupOwner" class="ud-label">Owner</label>
                    <div class="ud-select-wrap">
                      <select id="groupOwner" class="ud-select ud-select--pill" [(ngModel)]="newGroupOwner">
                        <option value="">Select Owner</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Jane Smith">Jane Smith</option>
                        <option value="Alex Johnson">Alex Johnson</option>
                        <option value="Sarah Lee">Sarah Lee</option>
                        @for (u of users; track u.username) {
                          <option [value]="u.name">{{ u.name }}</option>
                        }
                      </select>
                      <span pmConsoleIcon="chevron-down" class="ud-select-chevron"></span>
                    </div>
                  </div>
                </div>

                <!-- Purpose Field (with custom toolbar) -->
                <div class="ud-field">
                  <label class="ud-label">Purpose</label>
                  <div class="rich-editor-container">
                    <div class="rich-editor-toolbar">
                      <button type="button" class="toolbar-btn bold-btn" title="Bold">B</button>
                      <button type="button" class="toolbar-btn italic-btn" title="Italic">I</button>
                      <span class="toolbar-divider"></span>
                      <button type="button" class="toolbar-btn" title="Number List"><span pmConsoleIcon="list-ordered"></span></button>
                      <button type="button" class="toolbar-btn" title="Bullet List"><span pmConsoleIcon="list"></span></button>
                      <span class="toolbar-divider"></span>
                      <button type="button" class="toolbar-btn" title="Copy"><span pmConsoleIcon="copy"></span></button>
                      <button type="button" class="toolbar-btn" title="Cut"><span pmConsoleIcon="scissors"></span></button>
                      <button type="button" class="toolbar-btn" title="Paste"><span pmConsoleIcon="clipboard"></span></button>
                      <span class="toolbar-divider"></span>
                      <button type="button" class="toolbar-btn" title="Undo"><span pmConsoleIcon="corner-up-left"></span></button>
                      <button type="button" class="toolbar-btn" title="Redo"><span pmConsoleIcon="corner-up-right"></span></button>
                    </div>
                    <textarea 
                      class="rich-editor-textarea" 
                      placeholder="Enter purpose details..." 
                      [(ngModel)]="newGroupPurpose"
                    ></textarea>
                  </div>
                </div>

                <!-- Environment Factors Field (with custom toolbar) -->
                <div class="ud-field">
                  <label class="ud-label">Environment Factors</label>
                  <div class="rich-editor-container">
                    <div class="rich-editor-toolbar">
                      <button type="button" class="toolbar-btn bold-btn" title="Bold">B</button>
                      <button type="button" class="toolbar-btn italic-btn" title="Italic">I</button>
                      <span class="toolbar-divider"></span>
                      <button type="button" class="toolbar-btn" title="Number List"><span pmConsoleIcon="list-ordered"></span></button>
                      <button type="button" class="toolbar-btn" title="Bullet List"><span pmConsoleIcon="list"></span></button>
                      <span class="toolbar-divider"></span>
                      <button type="button" class="toolbar-btn" title="Copy"><span pmConsoleIcon="copy"></span></button>
                      <button type="button" class="toolbar-btn" title="Cut"><span pmConsoleIcon="scissors"></span></button>
                      <button type="button" class="toolbar-btn" title="Paste"><span pmConsoleIcon="clipboard"></span></button>
                      <span class="toolbar-divider"></span>
                      <button type="button" class="toolbar-btn" title="Undo"><span pmConsoleIcon="corner-up-left"></span></button>
                      <button type="button" class="toolbar-btn" title="Redo"><span pmConsoleIcon="corner-up-right"></span></button>
                    </div>
                    <textarea 
                      class="rich-editor-textarea" 
                      placeholder="Enter environment factors..." 
                      [(ngModel)]="newGroupEnvFactors"
                    ></textarea>
                  </div>
                </div>
              </div>
            </app-pm-console-plan-drawer>
          }
        </div>
      } @else if (activeSectionId === 'user-management') {
        <div class="user-management-container animation-fade">
          <div class="user-management-header">
            <div class="user-title-group">
              <h2>User Management</h2>
              <p>Configure team members, access roles, and system permission levels.</p>
            </div>
            
            <div class="user-header-actions">
              <button class="export-btn" type="button" (click)="exportUsers()">
                <span pmConsoleIcon="download"></span>
                <span>Export</span>
              </button>
              <button class="add-user-btn" type="button" (click)="openAddUserForm()">
                <span pmConsoleIcon="plus"></span>
                <span>Add User</span>
              </button>
            </div>
          </div>

          <!-- Total Users Summary Bar -->
          <div class="total-users-bar">
            <div class="total-users-bar-inner">
              <span class="total-users-icon-wrap">
                <span pmConsoleIcon="users" class="total-users-icon"></span>
              </span>
              <span class="total-users-label">Total Users</span>
              <span class="total-users-count">{{ maxUsers }}</span>
            </div>
          </div>

          <!-- Add User Side Drawer (uses platform-standard shell) -->
          @if (isAddingUser) {
            <app-pm-console-plan-drawer
              eyebrow="USER MANAGEMENT"
              [title]="editingUserIndex !== null ? 'Edit user details' : 'Add a new User'"
              description="Manage and configure user access and controls"
              [submitLabel]="editingUserIndex !== null ? 'Save' : 'Add'"
              cancelLabel="Cancel"
              (close)="closeAddUserDrawer()"
              (submitForm)="addUser(); $event.preventDefault()"
            >
              <!-- Form content projected into the drawer body -->
              <div planDrawerBody class="ud-form">

                <!-- Row 1: Username + Login Access -->
                <div class="ud-row ud-row-2col">
                  <div class="ud-field">
                    <label for="udUsername" class="ud-label">Username <span class="ud-required">*</span></label>
                    <input id="udUsername" type="text" class="ud-input" placeholder="test@example.com" [(ngModel)]="drawerUsername" />
                  </div>
                  <div class="ud-field">
                    <label class="ud-label">Login Access</label>
                    <div class="ud-checkbox-row">
                      <span class="ud-checkbox-box" [class.ud-checkbox-box--checked]="drawerLoginAccess" (click)="drawerLoginAccess = !drawerLoginAccess"></span>
                    </div>
                  </div>
                </div>

                <!-- Row 2: First Name + Last Name -->
                <div class="ud-row ud-row-2col">
                  <div class="ud-field">
                    <label for="udFirstName" class="ud-label">First Name <span class="ud-required">*</span></label>
                    <input id="udFirstName" type="text" class="ud-input" placeholder="First Name" [(ngModel)]="drawerFirstName" />
                  </div>
                  <div class="ud-field">
                    <label for="udLastName" class="ud-label">Last Name <span class="ud-required">*</span></label>
                    <input id="udLastName" type="text" class="ud-input" placeholder="Last Name" [(ngModel)]="drawerLastName" />
                  </div>
                </div>

                <!-- Row 3: User Role -->
                <div class="ud-field">
                  <label for="udUserRole" class="ud-label">User Role <span class="ud-required">*</span></label>
                  <input id="udUserRole" type="text" class="ud-input" placeholder="Select one or more internal roles" [(ngModel)]="drawerUserRole" />
                </div>

                <!-- Row 4: Email Notification -->
                <div class="ud-field">
                  <label class="ud-label">Email Notification</label>
                  <div class="ud-radio-group">
                    <label class="ud-radio-label">
                      <input type="radio" name="udEmailNotif" value="yes" [(ngModel)]="drawerEmailNotification" class="ud-radio" /> Yes
                    </label>
                    <label class="ud-radio-label">
                      <input type="radio" name="udEmailNotif" value="no" [(ngModel)]="drawerEmailNotification" class="ud-radio" /> No
                    </label>
                  </div>
                </div>

                <!-- Row 5: Group -->
                <div class="ud-field">
                  <label for="udGroup" class="ud-label">Group</label>
                  <div class="ud-select-wrap">
                    <select id="udGroup" class="ud-select ud-select--pill" [(ngModel)]="drawerGroup">
                      <option value="All">All</option>
                      @for (g of groups; track g) {
                        <option [value]="g">{{ g }}</option>
                      }
                      @if (groups.length === 0) {
                        <option value="Asset Management">Asset Management</option>
                        <option value="Risk Management">Risk Management</option>
                        <option value="Portfolio Management">Portfolio Management</option>
                      }
                    </select>
                    <span pmConsoleIcon="chevron-down" class="ud-select-chevron"></span>
                  </div>
                </div>

                <!-- Row 6: Division / Branch / Section -->
                <div class="ud-row ud-row-3col">
                  <div class="ud-field">
                    <label for="udDivision" class="ud-label">Division</label>
                    <div class="ud-select-wrap">
                      <select id="udDivision" class="ud-select ud-select--pill" [(ngModel)]="drawerDivision">
                        <option value="All">All</option>
                        @for (d of divisions; track d) { <option [value]="d">{{ d }}</option> }
                      </select>
                      <span pmConsoleIcon="chevron-down" class="ud-select-chevron"></span>
                    </div>
                  </div>
                  <div class="ud-field">
                    <label for="udBranch" class="ud-label">Branch</label>
                    <div class="ud-select-wrap">
                      <select id="udBranch" class="ud-select ud-select--pill" [(ngModel)]="drawerBranch">
                        <option value="All">All</option>
                        @for (b of brands; track b) { <option [value]="b">{{ b }}</option> }
                      </select>
                      <span pmConsoleIcon="chevron-down" class="ud-select-chevron"></span>
                    </div>
                  </div>
                  <div class="ud-field">
                    <label for="udSection" class="ud-label">Section</label>
                    <div class="ud-select-wrap">
                      <select id="udSection" class="ud-select ud-select--pill" [(ngModel)]="drawerSection">
                        <option value="All">All</option>
                        @for (s of sections; track s) { <option [value]="s">{{ s }}</option> }
                      </select>
                      <span pmConsoleIcon="chevron-down" class="ud-select-chevron"></span>
                    </div>
                  </div>
                </div>
              </div>
            </app-pm-console-plan-drawer>
          }

          <!-- Change Password Side Drawer (uses platform-standard shell) -->
          @if (isChangingPassword) {
            <app-pm-console-plan-drawer
              eyebrow="USER MANAGEMENT"
              title="Change User Password"
              description="Manage and configure user access and controls"
              submitLabel="Save"
              cancelLabel="Cancel"
              (close)="closeChangePasswordDrawer()"
              (submitForm)="changePassword(); $event.preventDefault()"
            >
              <!-- Form content projected into the drawer body -->
              <div planDrawerBody class="ud-form">
                <!-- New Password Field -->
                <div class="ud-field">
                  <label for="udNewPassword" class="ud-label">New Password <span class="ud-required">*</span></label>
                  <input id="udNewPassword" type="password" class="ud-input" placeholder="Enter new password" [(ngModel)]="drawerNewPassword" />
                </div>

                <!-- Confirm New Password Field -->
                <div class="ud-field">
                  <label for="udConfirmPassword" class="ud-label">Confirm New Password <span class="ud-required">*</span></label>
                  <input id="udConfirmPassword" type="password" class="ud-input" placeholder="Confirm new password" [(ngModel)]="drawerConfirmPassword" />
                </div>
              </div>
            </app-pm-console-plan-drawer>
          }

          <!-- Custom Premium User Table -->
          <div class="user-table-wrapper">
            <table class="user-table">
              <thead>
                <tr>
                  <th style="width: 20%;">Name</th>
                  <th style="width: 13%;">User Name</th>
                  <th style="width: 12%;">Role(s)</th>
                  <th style="width: 18%;">Email</th>
                  <th style="width: 13%;">Business Unit</th>
                  <th style="width: 9%;">Login Access</th>
                  <th style="width: 10%;">Last Login</th>
                  <th style="width: 5%; text-align: center;">More Action</th>
                </tr>
              </thead>
              <tbody>
                @if (users.length > 0) {
                  @for (user of users; track user.username; let i = $index) {
                    <tr class="animation-slide-in">
                      <td>
                        <div class="user-avatar-info">
                          <div class="avatar-circle">{{ getInitials(user.name) }}</div>
                          <span class="user-avatar-name">{{ user.name }}</span>
                        </div>
                      </td>
                      <td class="font-mono-text">{{ user.username }}</td>
                      <td>
                        <span class="role-badge">{{ user.role }}</span>
                      </td>
                      <td class="text-slate-email">{{ user.email }}</td>
                      <td class="text-slate-bu">{{ user.businessUnit }}</td>
                      <td>
                        <span class="access-pill" [class.enabled]="user.loginAccess === 'Enabled'" [class.disabled]="user.loginAccess === 'Disabled'">
                          {{ user.loginAccess }}
                        </span>
                      </td>
                      <td class="last-login-cell">{{ user.lastLogin || '—' }}</td>
                      <td class="user-action-cell">
                        <div class="user-action-wrap">
                          <button
                            class="user-dots-btn"
                            type="button"
                            aria-label="More actions"
                            (click)="toggleUserMenu($event, i)"
                          >
                            <span class="user-dots-btn-dot"></span>
                            <span class="user-dots-btn-dot"></span>
                            <span class="user-dots-btn-dot"></span>
                          </button>

                          @if (openUserMenuIndex === i) {
                            <div class="user-action-menu" role="menu">
                              <button class="user-action-item" type="button" role="menuitem" (click)="openEditUserForm(i)">Edit</button>
                              <button class="user-action-item" type="button" role="menuitem" (click)="removeUser(i); closeUserMenu()">Delete</button>
                              <button class="user-action-item" type="button" role="menuitem" (click)="closeUserMenu()">Print</button>
                              <button class="user-action-item" type="button" role="menuitem" (click)="openChangePasswordForm(i)">Change Password</button>
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                } @else {
                  <tr>
                    <td colspan="8" class="table-empty-cell">
                      <div class="table-empty-container">
                        <span pmConsoleIcon="users" class="table-empty-icon"></span>
                        <h4>No Users Configured</h4>
                        <p>Get started by adding system members and defining their workspace roles.</p>
                        <button class="empty-add-user-btn" type="button" (click)="openAddUserForm()">
                          <span pmConsoleIcon="plus"></span>
                          <span>Add User</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else if (activeSectionId === 'workflow-designer') {
        <div class="standards-container animation-fade">
          <div class="workflow-header-row">
            <div class="standards-intro">
              <h2>Workflow Designer</h2>
              <p>Build and manage workflows</p>
            </div>
            <button class="add-workflow-btn" type="button" (click)="addNewWorkflow()">
              <span pmConsoleIcon="plus" class="btn-icon"></span>
              <span>Add new</span>
            </button>
          </div>

          <div class="standards-sections-stack">
            <section class="standards-group">
              <div class="standards-grid">
                @for (card of workflowCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Workflow Designer')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>
          </div>
        </div>
      } @else if (activeSectionId === 'standards') {
        <div class="standards-split-layout animation-fade">

          <!-- Left Sidebar: category nav -->
          <div class="standards-sidebar" style="padding-top: 48px;">
            <nav class="standards-category-nav" aria-label="Standards categories">
              @for (cat of standardsCategories; track cat.id) {
                <button
                  type="button"
                  class="standards-cat-btn"
                  [class.active]="activeStandardsCategory === cat.id"
                  (click)="setStandardsCategory(cat.id)"
                >
                  <div class="cat-content-left">
                    <span class="cat-label">{{ cat.label }}</span>
                  </div>
                  <span class="cat-count">{{ getCategoryCount(cat.id) }}</span>
                </button>
              }
            </nav>
          </div>

          <!-- Right Panel: cards for the selected category -->
          <div class="standards-cards-panel">
            @if (activeStandardsCategory === 'project-setup') {
              <div class="standards-grid animation-fade">
                @for (card of projectSetupCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Project Setup')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeStandardsCategory === 'project-planning') {
              <div class="standards-grid animation-fade">
                @for (card of projectPlanningCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Project Planning')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeStandardsCategory === 'project-closure') {
              <div class="standards-grid animation-fade">
                @for (card of projectClosureCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Project Closure')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeStandardsCategory === 'benefits-config') {
              <div class="standards-grid animation-fade">
                @for (card of benefitsConfigCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Benefits and Config')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            }
          </div>
        </div>
      } @else if (activeSectionId === 'governance') {
        <div class="standards-split-layout animation-fade">

          <!-- Left Sidebar: category nav -->
          <div class="standards-sidebar" style="padding-top: 48px;">
            <nav class="standards-category-nav" aria-label="Governance categories">
              @for (cat of governanceCategories; track cat.id) {
                <button
                  type="button"
                  class="standards-cat-btn"
                  [class.active]="activeGovernanceCategory === cat.id"
                  (click)="setGovernanceCategory(cat.id)"
                >
                  <div class="cat-content-left">
                    <span class="cat-label">{{ cat.label }}</span>
                  </div>
                  <span class="cat-count">{{ getGovernanceCategoryCount(cat.id) }}</span>
                </button>
              }
            </nav>
          </div>

          <!-- Right Panel: cards for the selected category -->
          <div class="standards-cards-panel">
            @if (activeGovernanceCategory === 'change-request') {
              <div class="standards-grid animation-fade">
                @for (card of changeRequestCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Change Request Management')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeGovernanceCategory === 'stage-gate') {
              <div class="standards-grid animation-fade">
                @for (card of stageGateCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Stage Gate Management')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeGovernanceCategory === 'monitoring-reporting') {
              <div class="standards-grid animation-fade">
                @for (card of monitoringReportingCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Monitoring & Reporting')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeGovernanceCategory === 'prioritization') {
              <div class="standards-grid animation-fade">
                @for (card of prioritizationCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Portfolio & Investment Prioritization')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeGovernanceCategory === 'risk-management') {
              <div class="standards-grid animation-fade">
                @for (card of riskManagementCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Risk Management')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            }
          </div>
        </div>
      } @else if (activeSectionId === 'financial') {
        <div class="standards-split-layout animation-fade">

          <!-- Left Sidebar: category nav -->
          <div class="standards-sidebar" style="padding-top: 48px;">
            <nav class="standards-category-nav" aria-label="Financial categories">
              @for (cat of financialCategories; track cat.id) {
                <button
                  type="button"
                  class="standards-cat-btn"
                  [class.active]="activeFinancialCategory === cat.id"
                  (click)="setFinancialCategory(cat.id)"
                >
                  <div class="cat-content-left">
                    <span class="cat-label">{{ cat.label }}</span>
                  </div>
                  <span class="cat-count">{{ getFinancialCategoryCount(cat.id) }}</span>
                </button>
              }
            </nav>
          </div>

          <!-- Right Panel: cards for the selected category -->
          <div class="standards-cards-panel">
            @if (activeFinancialCategory === 'funding-sources') {
              <div class="standards-grid animation-fade">
                @for (card of fundingSourcesCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Funding Sources')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeFinancialCategory === 'financial-cycle') {
              <div class="standards-grid animation-fade">
                @for (card of financialCycleCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Financial Cycle')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>
                        {{ card.title }}
                        @if (card.items && card.items.length > 0) {
                          <span class="standards-card-item-count">
                            <span class="standards-card-item-count-inner">{{ card.items.length }}</span>
                          </span>
                        }
                      </h4>
                      <p>{{ card.description }}</p>
                    </div>
                    @if (card.items && card.items.length > 0) {
                      <div class="standards-card-meta">
                        {{ getCardItemsPreview(card.items) }}
                      </div>
                    }
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            }
          </div>
        </div>
      } @else if (activeSectionId === 'glossary') {
        <div class="standards-split-layout animation-fade">

          <!-- Left Sidebar: category nav -->
          <div class="standards-sidebar" style="padding-top: 48px;">
            <nav class="standards-category-nav" aria-label="Glossary categories">
              @for (cat of glossaryCategories; track cat.id) {
                <button
                  type="button"
                  class="standards-cat-btn"
                  [class.active]="activeGlossaryTab === cat.id"
                  (click)="setGlossaryTab(cat.id)"
                >
                  <div class="cat-content-left">
                    <span class="cat-label">{{ cat.label }}</span>
                  </div>
                  <span class="cat-count">{{ getGlossaryCategoryCount(cat.id) }}</span>
                </button>
              }
            </nav>
          </div>

          <!-- Right Panel: table for the selected glossary tab -->
          <div class="standards-cards-panel" style="padding-top: 48px; padding-left: 8px;">
            <div class="tab-content-container animation-slide" style="gap: 16px; display: flex; flex-direction: column;">
              
              <!-- Glossary Header Block & Search (No Add Button) -->
              <div class="glossary-top-bar" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 12px; width: 100%;">
                <div class="glossary-header-block" style="text-align: left;">
                  <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 6px 0; font-family: inherit;">Glossary</h2>
                  <p style="font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.5;">Configure contextual help for each and every label used in the p3m module.</p>
                </div>
                
                <!-- Search bar -->
                <div class="search-toggle-container is-expanded" style="display: flex; align-items: center; gap: 8px;">
                  <div style="position: relative; display: flex; align-items: center;">
                    <span pmConsoleIcon="search" style="position: absolute; left: 10px; color: #64748b; font-size: 14px; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; justify-content: center;"></span>
                    <input
                      type="text"
                      class="toolbar-search-input"
                      placeholder="Search glossary..."
                      [(ngModel)]="glossarySearchQuery"
                      (input)="onSearchQueryChange()"
                      style="padding-left: 32px; width: 240px; height: 36px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: #ffffff; color: #334155; transition: border-color 0.2s;"
                    />
                  </div>
                </div>
              </div>

              <!-- Glossary Table styled like pm-project-table -->
              <div class="pm-project-table-scroll" style="min-height: 380px; border-radius: 16px 16px 0 0; border-bottom: none;">
                <table class="pm-project-table" style="width: 100%; min-width: 800px; table-layout: auto; border-collapse: separate; border-spacing: 0;">
                  <thead>
                    <tr>
                      <th style="width: 25%; background: #fbfcff; color: #555555; font-weight: 600; padding: 15px 14px; border-bottom: 1px solid #eceef3; font-size: 12px; text-align: left;">System Label</th>
                      <th style="width: 25%; background: #fbfcff; color: #555555; font-weight: 600; padding: 15px 14px; border-bottom: 1px solid #eceef3; font-size: 12px; text-align: left;">Custom Label</th>
                      <th style="width: 40%; background: #fbfcff; color: #555555; font-weight: 600; padding: 15px 14px; border-bottom: 1px solid #eceef3; font-size: 12px; text-align: left;">Contextual Help</th>
                      <th style="width: 10%; background: #fbfcff; color: #555555; font-weight: 600; padding: 15px 14px; border-bottom: 1px solid #eceef3; font-size: 12px; text-align: center;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of getPaginatedGlossaryList(); track item.id) {
                      <tr class="program-row" style="background: #ffffff; transition: background-color 0.15s ease;">
                        <!-- System Label -->
                        <td style="font-weight: 600; color: #252a34; font-size: 13.5px; padding: 14px 14px; border-bottom: 1px solid #eceef3; vertical-align: middle;">
                          @if (editingGlossaryId === item.id) {
                            <input 
                              type="text" 
                              class="form-control" 
                              [(ngModel)]="editingSystemLabel"
                              style="height: 32px; font-size: 13px; padding: 6px 10px; border: 1px solid #d0d5dd; border-radius: 8px; width: 100%; box-sizing: border-box;"
                            />
                          } @else {
                            {{ item.systemLabel }}
                          }
                        </td>
                        
                        <!-- Custom Label -->
                        <td style="font-size: 13.5px; color: #252a34; padding: 14px 14px; border-bottom: 1px solid #eceef3; vertical-align: middle;">
                          @if (editingGlossaryId === item.id) {
                            <input 
                              type="text" 
                              class="form-control" 
                              [(ngModel)]="editingCustomLabel"
                              style="height: 32px; font-size: 13px; padding: 6px 10px; border: 1px solid #d0d5dd; border-radius: 8px; width: 100%; box-sizing: border-box;"
                            />
                          } @else {
                            @if (item.customLabel) {
                              {{ item.customLabel }}
                            } @else {
                              <span style="color: #94a3b8; font-style: italic;">No custom label set</span>
                            }
                          }
                        </td>
                        
                        <!-- Contextual Help -->
                        <td style="font-size: 13.5px; color: #555555; line-height: 1.45; padding: 14px 14px; border-bottom: 1px solid #eceef3; vertical-align: middle;">
                          @if (editingGlossaryId === item.id) {
                            <textarea 
                              class="form-control" 
                              [(ngModel)]="editingContextualHelp"
                              rows="2"
                              style="font-size: 13px; padding: 6px 10px; border: 1px solid #d0d5dd; border-radius: 8px; width: 100%; box-sizing: border-box; resize: vertical;"
                            ></textarea>
                          } @else {
                            {{ item.contextualHelp }}
                          }
                        </td>
                        
                        <!-- Action -->
                        <td style="text-align: center; overflow: visible; position: relative; padding: 14px 14px; border-bottom: 1px solid #eceef3; vertical-align: middle;">
                          <div style="display: flex; gap: 8px; justify-content: center; align-items: center; overflow: visible;">
                            @if (editingGlossaryId === item.id) {
                              <button 
                                type="button" 
                                class="priority-action-btn" 
                                (click)="saveEditGlossary(item.id)" 
                                title="Save"
                                style="color: #059669; background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; transition: all 0.2s ease;"
                              >
                                <span pmConsoleIcon="check"></span>
                              </button>
                              <button 
                                type="button" 
                                class="priority-action-btn delete" 
                                (click)="cancelEditGlossary()" 
                                title="Cancel"
                                style="color: #ef4444; background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; transition: all 0.2s ease;"
                              >
                                <span pmConsoleIcon="x"></span>
                              </button>
                            } @else {
                              <!-- Actions vertical three-dot menu dropdown enclosed in a bordered square matching Image 2 exactly -->
                              <div style="position: relative; display: inline-block; overflow: visible;">
                                <button 
                                  type="button" 
                                  class="glossary-action-btn" 
                                  (click)="toggleGlossaryActionMenu($event, item.id)"
                                  title="Actions"
                                  style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; color: #475569; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; transition: all 0.2s ease;"
                                >
                                  <span pmConsoleIcon="more-vertical" style="font-size: 16px;"></span>
                                </button>
                                
                                @if (activeGlossaryActionId === item.id) {
                                  <div class="priority-dropdown-menu animation-fade" style="position: absolute; right: 0; top: 36px; background: #ffffff; border: 1px solid #dfe4ee; border-radius: 8px; box-shadow: 0 4px 12px rgba(25, 33, 61, 0.08); z-index: 100; min-width: 100px; padding: 4px 0;">
                                    <button 
                                      type="button" 
                                      class="dropdown-item" 
                                      (click)="triggerEditGlossary(item)" 
                                      style="display: flex; align-items: center; gap: 8px; width: 100%; border: none; background: transparent; padding: 8px 12px; font-size: 12.5px; color: #334155; text-align: left; cursor: pointer;"
                                    >
                                      <span pmConsoleIcon="edit-2" style="font-size: 12px; color: #64748b;"></span>
                                      <span>Edit</span>
                                    </button>
                                    <button 
                                      type="button" 
                                      class="dropdown-item delete" 
                                      (click)="triggerDeleteGlossary(item.id)" 
                                      style="display: flex; align-items: center; gap: 8px; width: 100%; border: none; background: transparent; padding: 8px 12px; font-size: 12.5px; color: #ef4444; text-align: left; cursor: pointer;"
                                    >
                                      <span pmConsoleIcon="trash-2" style="font-size: 12px; color: #ef4444;"></span>
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                    @if (getFilteredGlossaryList().length === 0) {
                      <tr>
                        <td colspan="4" style="padding: 32px; text-align: center; color: #94a3b8; font-style: italic;">
                          No glossary terms found matching your search.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Pagination Footer -->
              <div class="glossary-pagination-container" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #ffffff; border: 1px solid #e3e5e9; border-radius: 0 0 16px 16px; font-family: inherit; margin-top: -16px;">
                <div style="font-size: 13px; color: #64748b;">
                  Showing 
                  <strong>{{ getFilteredGlossaryList().length === 0 ? 0 : (glossaryCurrentPage - 1) * glossaryPageSize + 1 }}</strong> 
                  to 
                  <strong>{{ Math.min(glossaryCurrentPage * glossaryPageSize, getFilteredGlossaryList().length) }}</strong> 
                  of 
                  <strong>{{ getFilteredGlossaryList().length }}</strong> 
                  results
                </div>
                
                <div style="display: flex; gap: 8px; align-items: center;">
                  <button 
                    type="button"
                    class="tb-btn"
                    [disabled]="glossaryCurrentPage === 1"
                    (click)="prevGlossaryPage()"
                    style="height: 32px; padding: 0 12px; font-size: 12.5px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #e3e5e9; background: #ffffff; color: #334155; cursor: pointer; transition: all 0.2s;"
                  >
                    <span pmConsoleIcon="chevron-left" style="font-size: 14px; display: inline-flex; align-items: center; justify-content: center;"></span>
                    <span>Previous</span>
                  </button>
                  
                  <!-- Page numbers -->
                  @for (page of glossaryPages; track page) {
                    <button
                      type="button"
                      class="tb-btn"
                      [class.active-page]="page === glossaryCurrentPage"
                      (click)="setGlossaryPage(page)"
                      style="height: 32px; width: 32px; display: inline-flex; align-items: center; justify-content: center; font-size: 12.5px; border-radius: 6px; border: 1px solid #e3e5e9; background: #ffffff; color: #334155; cursor: pointer; padding: 0;"
                    >
                      {{ page }}
                    </button>
                  }
                  
                  <button 
                    type="button"
                    class="tb-btn"
                    [disabled]="glossaryCurrentPage === glossaryTotalPages || glossaryTotalPages === 0"
                    (click)="nextGlossaryPage()"
                    style="height: 32px; padding: 0 12px; font-size: 12.5px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #e3e5e9; background: #ffffff; color: #334155; cursor: pointer; transition: all 0.2s;"
                  >
                    <span>Next</span>
                    <span pmConsoleIcon="chevron-right" style="font-size: 14px; display: inline-flex; align-items: center; justify-content: center;"></span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      } @else {
        <!-- Content for other tabs, e.g. coming soon -->
        <div class="framework-content animation-fade">
          <div class="empty-state-card">
            <app-pm-console-reporting-empty-illustration class="illustration-elem"></app-pm-console-reporting-empty-illustration>
            
            <h4 class="empty-heading">{{ getActiveSectionLabel() }}</h4>
            <p class="empty-subtext">This configuration panel is coming soon to the Safe Security portfolio workspace.</p>
            
            <div class="meta-tag-wrapper">
              <span class="meta-tag">
                <span [pmConsoleIcon]="'lock'" class="tag-icon"></span>
                <span>Administrator Access Only</span>
              </span>
            </div>
          </div>
        </div>
      }
    </main>

    <!-- Interactive Plan Drawer Panel matching Image 2 outcome panel appearance -->
    @if (selectedCard) {
      <app-pm-console-plan-drawer
        [eyebrow]="selectedCard.id === 'priority' ? 'Portfolio Setup' : selectedCardGroup"
        [title]="selectedCard.id === 'priority' ? 'Manage Priorities' : 'Add ' + selectedCard.title.toLowerCase()"
        [description]="'Manage and configure the active guidelines and options for ' + selectedCard.title.toLowerCase() + '.' "
        submitLabel="Add item"
        cancelLabel="Cancel"
        [hideFooter]="selectedCard.id === 'priority'"
        [panelClass]="selectedCard.id === 'priority' ? 'priority-drawer-view' : ''"
        (close)="closeDrawer()"
        (submitForm)="saveDrawer($event)"
      >
        <div planDrawerBody class="standards-drawer-body">
          @if (selectedCard.id === 'priority') {
            <div class="priority-drawer-table-wrapper" style="margin-top: 10px;">
              <!-- Add new item and search row aligned to the top-right of the table -->
              <div class="priority-add-row" style="display: flex; gap: 12px; justify-content: flex-end; align-items: center; margin-bottom: 16px;">
                <!-- Expandable Search Box -->
                <div class="priority-expandable-search" title="Search priorities">
                  <span pmConsoleIcon="search" class="search-icon"></span>
                  <input 
                    type="text" 
                    class="search-input" 
                    placeholder="Search priorities..." 
                    [(ngModel)]="searchQuery"
                  />
                </div>

                <button 
                  type="button" 
                  class="add-workflow-btn" 
                  (click)="addPriorityItem()"
                  style="height: 32px; padding: 0 14px; border-radius: 8px; font-size: 12.5px; display: inline-flex; align-items: center; gap: 6px;"
                >
                  <span pmConsoleIcon="plus" style="font-size: 12px;"></span>
                  <span>Add item</span>
                </button>
              </div>

              <!-- Sleek platform table matching Image 2 and User table style -->
              <div class="user-table-wrapper" style="border-radius: 8px;">
                <table class="user-table" style="margin: 0; width: 100%;">
                  <thead>
                    <tr>
                      <th style="width: 75%; padding: 10px 16px; font-size: 11px;">Name</th>
                      <th style="width: 25%; padding: 10px 16px; font-size: 11px; text-align: center;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of getFilteredPriorities(); track item) {
                      <tr>
                        <td style="padding: 10px 16px; font-size: 13px;">
                          @if (editingPriorityIndex === selectedCard.items.indexOf(item)) {
                            <input 
                              type="text" 
                              class="form-control" 
                              [(ngModel)]="editingPriorityValue"
                              (keydown.enter)="saveEditPriority(selectedCard.items.indexOf(item))"
                              (keydown.escape)="cancelEditPriority()"
                              style="height: 28px; padding: 4px 8px; font-size: 12.5px; width: 100%; box-sizing: border-box;"
                              autofocus
                            />
                          } @else {
                            <span style="font-weight: 500; color: #1e293b;">{{ item }}</span>
                          }
                        </td>
                        <td style="padding: 10px 16px; text-align: center; overflow: visible;">
                          <div style="display: flex; gap: 8px; justify-content: center; align-items: center; overflow: visible; position: relative;">
                            @if (editingPriorityIndex === selectedCard.items.indexOf(item)) {
                              <button 
                                type="button" 
                                class="priority-action-btn" 
                                (click)="saveEditPriority(selectedCard.items.indexOf(item))" 
                                title="Save"
                                style="color: #059669;"
                              >
                                <span pmConsoleIcon="check"></span>
                              </button>
                              <button 
                                type="button" 
                                class="priority-action-btn delete" 
                                (click)="cancelEditPriority()" 
                                title="Cancel"
                              >
                                <span pmConsoleIcon="x"></span>
                              </button>
                            } @else {
                              <!-- Actions Container three dot menu with popup dropdown -->
                              <div style="position: relative; display: inline-block; overflow: visible;">
                                <button 
                                  type="button" 
                                  class="priority-action-btn" 
                                  (click)="toggleActionMenu($event, selectedCard.items.indexOf(item))"
                                  title="Actions"
                                >
                                  <span pmConsoleIcon="more-horizontal"></span>
                                </button>
                                
                                @if (activeActionMenuIndex === selectedCard.items.indexOf(item)) {
                                  <div class="priority-dropdown-menu animation-fade" style="position: absolute; right: 0; top: 32px; background: #ffffff; border: 1px solid #dfe4ee; border-radius: 8px; box-shadow: 0 4px 12px rgba(25, 33, 61, 0.08); z-index: 100; min-width: 100px; padding: 4px 0;">
                                    <button 
                                      type="button" 
                                      class="dropdown-item" 
                                      (click)="triggerEditRow(selectedCard.items.indexOf(item), item)" 
                                      style="display: flex; align-items: center; gap: 8px; width: 100%; border: none; background: transparent; padding: 8px 12px; font-size: 12.5px; color: #334155; text-align: left; cursor: pointer;"
                                    >
                                      <span pmConsoleIcon="edit-2" style="font-size: 12px; color: #64748b;"></span>
                                      <span>Edit</span>
                                    </button>
                                    <button 
                                      type="button" 
                                      class="dropdown-item delete" 
                                      (click)="triggerDeleteRow(item)" 
                                      style="display: flex; align-items: center; gap: 8px; width: 100%; border: none; background: transparent; padding: 8px 12px; font-size: 12.5px; color: #ef4444; text-align: left; cursor: pointer;"
                                    >
                                      <span pmConsoleIcon="trash-2" style="font-size: 12px; color: #ef4444;"></span>
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                    @if (getFilteredPriorities().length === 0) {
                      <tr>
                        <td colspan="2" style="padding: 24px; text-align: center; color: #94a3b8; font-style: italic;">
                          No priority items match search.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>

                <!-- Image 2 styled footer replacing pagination footer entirely -->
                <div class="priority-footer" style="padding: 10px 16px; background: #f8fafc; border-top: 1px solid #dfe4ee; font-size: 12px; color: #64748b; font-weight: 500; text-align: right;">
                  {{ getFilteredPriorities().length }} {{ getFilteredPriorities().length === 1 ? 'item' : 'items' }}
                </div>
              </div>
            </div>
          } @else {
            <!-- Current Items List tags -->
            <div class="drawer-section compact" style="margin-bottom: 24px;">
              <span class="drawer-section-title">Current {{ selectedCard.title }} Options</span>
              <div class="standards-tags-list">
                @for (item of selectedCard.items; track item; let i = $index) {
                  <span class="standards-tag">
                    <span class="tag-text">{{ item }}</span>
                    <button type="button" class="tag-delete-btn" (click)="removeDrawerItem(i)" aria-label="Delete item">
                      <span pmConsoleIcon="x"></span>
                    </button>
                  </span>
                }
                @if (selectedCard.items.length === 0) {
                  <p class="empty-items-text">No active categories defined.</p>
                }
              </div>
            </div>

            <!-- outcome styled text area from Image 2 -->
            <div class="drawer-section">
              <label class="form-label" for="newItemName">
                {{ selectedCard.title }} *
              </label>
              <textarea 
                id="newItemName"
                class="form-control text-area-outcome" 
                placeholder="Describe the {{ selectedCard.title.toLowerCase() }} users should see" 
                [(ngModel)]="newDrawerItem"
                name="newDrawerItem"
                rows="3"
                required
              ></textarea>
            </div>

            <!-- measure styled input from Image 2 -->
            <div class="drawer-section" style="margin-top: 20px;">
              <label class="form-label" for="newMeasure">
                Measure
              </label>
              <input 
                id="newMeasure"
                type="text" 
                class="form-control" 
                placeholder="How will this be measured?" 
                [(ngModel)]="drawerMeasure"
                name="drawerMeasure"
              />
            </div>

            <!-- owner and status side by side select from Image 2 -->
            <div class="form-row-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px;">
              <div class="drawer-section">
                <label class="form-label" for="drawerOwner">Owner</label>
                <div class="select-wrapper">
                  <select id="drawerOwner" [(ngModel)]="drawerOwner" name="drawerOwner" class="form-control select-control">
                    <option value="Fatima Qahtani">Fatima Qahtani</option>
                    <option value="Muna Hassan">Muna Hassan</option>
                    <option value="PMO Desk">PMO Desk</option>
                  </select>
                  <span pmConsoleIcon="chevron-down" class="select-chevron"></span>
                </div>
              </div>

              <div class="drawer-section">
                <label class="form-label" for="drawerStatus">Status</label>
                <div class="select-wrapper">
                  <select id="drawerStatus" [(ngModel)]="drawerStatus" name="drawerStatus" class="form-control select-control">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <span pmConsoleIcon="chevron-down" class="select-chevron"></span>
                </div>
              </div>
            </div>
          }
        </div>
      </app-pm-console-plan-drawer>
    }
    
    @if (isCreatingWorkflow) {
      <app-pm-console-plan-drawer
        eyebrow=""
        title="Create Workflow"
        description=""
        submitLabel="Create"
        cancelLabel="Cancel"
        (close)="closeWorkflowDrawer()"
        (submitForm)="saveWorkflow($event)"
      >
        <div planDrawerBody class="standards-drawer-body">
          <div class="standards-drawer-form" style="padding-top: 16px;">
            <!-- Type field -->
            <div class="form-group" style="margin-bottom: 24px;">
              <label class="form-label" style="display: flex; align-items: center; gap: 4px; font-weight: 500; font-size: 13px; color: #334155; margin-bottom: 8px;">
                Type<span style="color: #e11d48;">*</span>
                <span pmConsoleIcon="info" style="font-size: 14px; color: #94a3b8; cursor: pointer;"></span>
              </label>
              <div style="position: relative;">
                <select class="form-control" [(ngModel)]="workflowType" [disabled]="!!editingWorkflowId" (change)="workflowApplicability = ''" style="width: 100%; height: 40px; border-radius: 8px; border: 1px solid #cbd5e1; padding: 0 12px; font-size: 14px; color: #475569; appearance: none; background: #ffffff; outline: none; cursor: pointer;">
                  <option value="" disabled selected>Select</option>
                  @for (type of workflowTypes; track type) {
                    <option [value]="type">{{ type }}</option>
                  }
                </select>
                <span pmConsoleIcon="chevron-down" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b;"></span>
              </div>
            </div>

            @if (workflowType) {
              <!-- Applicable for field -->
              <div class="form-group" style="margin-bottom: 24px;">
                <label class="form-label" style="font-weight: 500; font-size: 13px; color: #334155; margin-bottom: 12px; display: block;">Applicable for</label>
                @if (editingWorkflowId) {
                  <div style="font-size: 13px; color: #475569; padding: 10px 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                    {{ workflowApplicability || 'None selected' }}
                  </div>
                } @else {
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    @for (option of currentApplicabilityOptions; track option) {
                      <button 
                        type="button" 
                        class="workflow-pill" 
                        [class.active]="workflowApplicability === option"
                        (click)="workflowApplicability = option"
                      >
                        {{ option }}
                      </button>
                    }
                  </div>
                  <p style="font-size: 11px; color: #94a3b8; margin: 8px 0 0 0; display: flex; align-items: center; gap: 4px;">
                    <span pmConsoleIcon="info" style="font-size: 12px;"></span>
                    Type and Applicable cannot be changed after creating.
                  </p>
                }
              </div>

              <!-- Steps Section -->
              <div class="steps-section" style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                <!-- Accordions for existing steps -->
                <div class="steps-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                  @for (step of workflowSteps; track step.name; let i = $index) {
                    <div class="step-accordion" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                      <div 
                        class="step-accordion-header" 
                        style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; cursor: pointer; font-size: 13px; font-weight: 500; color: #334155;"
                      >
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1;" (click)="toggleStepAccordion(i)">
                          <span pmConsoleIcon="git-commit" style="color: #64748b; font-size: 16px;"></span>
                          {{ step.name }}
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <button type="button" (click)="editWorkflowStep(i, $event)" style="background: transparent; border: none; color: #2563eb; font-size: 12px; font-weight: 500; cursor: pointer; padding: 4px 8px;">Edit</button>
                          <span [pmConsoleIcon]="newStepExpandedIndex === i ? 'chevron-up' : 'chevron-down'" style="color: #64748b;" (click)="toggleStepAccordion(i)"></span>
                        </div>
                      </div>
                      @if (newStepExpandedIndex === i) {
                        <div class="step-accordion-body" style="padding: 16px; background: #ffffff; border-top: 1px solid #e2e8f0; font-size: 13px; color: #475569;">
                          <p style="margin: 0 0 8px 0;"><strong>Mandatory:</strong> {{ step.isMandatory ? 'Yes' : 'No' }}</p>
                          <p style="margin: 0 0 8px 0;"><strong>On Reject:</strong> {{ step.rejectAction === 'restart' ? 'Restart the workflow' : 'Stay on same step' }}</p>
                          <p style="margin: 0;"><strong>AI Component:</strong> {{ step.aiComponent === 'yes' ? 'Yes' : (step.aiComponent === 'no' ? 'No' : 'Not Required') }}</p>
                        </div>
                      }
                    </div>
                  }
                </div>

                @if (!isAddingWorkflowStep && workflowApplicability) {
                  <button 
                    type="button" 
                    class="tb-btn" 
                    (click)="openAddStepForm()"
                    style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; color: #3b82f6; font-size: 13px; font-weight: 500; cursor: pointer; width: 100%; justify-content: center; transition: all 0.2s;"
                  >
                    <span pmConsoleIcon="plus" style="font-size: 14px;"></span>
                    Add step
                  </button>
                } @else if (isAddingWorkflowStep) {
                <!-- HUGE Step Form -->
                <div class="step-form-container" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #ffffff;">
                  
                  <!-- Basic Details -->
                  <div style="margin-bottom: 24px;">
                    <div style="font-size: 12px; color: #2563eb; font-weight: 500; margin-bottom: 12px;">Basic Details</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
                      <div>
                        <label style="font-size: 11px; color: #2563eb; display: block; margin-bottom: 6px;">Name</label>
                        <input type="text" [(ngModel)]="newStepName" style="width: 100%; height: 32px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 0 8px; font-size: 12px; outline: none; box-sizing: border-box;" />
                      </div>
                      <div>
                        <label style="font-size: 11px; color: #2563eb; display: block; margin-bottom: 6px;">Mandatory Step ?</label>
                        <input type="checkbox" [(ngModel)]="newStepMandatory" style="width: 14px; height: 14px; border: 1px solid #cbd5e1; border-radius: 3px;" />
                      </div>
                    </div>
                    <div>
                      <label style="font-size: 11px; color: #2563eb; display: block; margin-bottom: 8px;">If the step rejected, then</label>
                      <div style="display: flex; gap: 16px; align-items: center;">
                        <label style="font-size: 12px; color: #334155; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                          <input type="radio" name="rejectAction" value="restart" [(ngModel)]="newStepRejectAction" />
                          Restart the workflow
                        </label>
                        <label style="font-size: 12px; color: #334155; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                          <input type="radio" name="rejectAction" value="stay" [(ngModel)]="newStepRejectAction" />
                          Stay on same step
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- AI component -->
                  <div style="margin-bottom: 24px; border-top: 1px dashed #e2e8f0; padding-top: 16px;">
                    <div style="font-size: 12px; color: #2563eb; font-weight: 500; margin-bottom: 12px;">AI component</div>
                    <div style="display: flex; gap: 16px; align-items: center;">
                      <label style="font-size: 12px; color: #334155; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                        <input type="radio" name="aiComp" value="yes" [(ngModel)]="newStepAiComponent" /> Yes
                      </label>
                      <label style="font-size: 12px; color: #334155; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                        <input type="radio" name="aiComp" value="no" [(ngModel)]="newStepAiComponent" /> No
                      </label>
                      <label style="font-size: 12px; color: #334155; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                        <input type="radio" name="aiComp" value="not_required" [(ngModel)]="newStepAiComponent" /> Not Required
                      </label>
                    </div>
                  </div>

                  <!-- Configure Actions -->
                  <div style="margin-bottom: 24px; border-top: 1px dashed #e2e8f0; padding-top: 16px;">
                    <div style="font-size: 12px; color: #334155; font-weight: 500; margin-bottom: 12px;">Configure Actions</div>
                    <button type="button" style="background: #2563eb; color: #ffffff; border: none; border-radius: 4px; padding: 6px 12px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 12px; cursor: pointer;">
                      Add New <span pmConsoleIcon="chevron-down" style="font-size: 14px;"></span>
                    </button>
                    <div style="border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden;">
                      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                        <thead>
                          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                            <th style="padding: 10px; text-align: left; font-weight: 600; color: #475569;">USER NAME/ROLE</th>
                            <th style="padding: 10px; text-align: left; font-weight: 600; color: #475569;">NAME</th>
                            <th style="padding: 10px; text-align: left; font-weight: 600; color: #475569;">ACTION TYPE</th>
                            <th style="padding: 10px; text-align: left; font-weight: 600; color: #475569;">EMAIL NOTIFICATION</th>
                            <th style="padding: 10px; text-align: left; font-weight: 600; color: #475569;">DELETE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colspan="5" style="padding: 12px; text-align: center; color: #94a3b8; font-style: italic;">No record found</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Email Notifications setup -->
                  <div style="border-top: 1px dashed #e2e8f0; padding-top: 16px;">
                    <div style="font-size: 12px; color: #334155; font-weight: 500; margin-bottom: 16px;">Email Notifications setup</div>
                    
                    <!-- When Submitted -->
                    <div class="step-accordion" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
                      <div class="step-accordion-header" (click)="toggleEmailAccordion('submitted')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; cursor: pointer; font-size: 13px; font-weight: 500; color: #334155;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span pmConsoleIcon="mail" style="color: #64748b; font-size: 16px;"></span>
                          When Submitted
                        </div>
                        <span [pmConsoleIcon]="emailAccordionOpen === 'submitted' ? 'chevron-up' : 'chevron-down'" style="color: #64748b;"></span>
                      </div>
                      @if (emailAccordionOpen === 'submitted') {
                        <div class="step-accordion-body" style="padding: 16px; background: #ffffff; border-top: 1px solid #e2e8f0;">
                          <div style="font-size: 11px; color: #334155; margin-bottom: 6px;">Email template</div>
                          <div style="border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; background: #ffffff;">
                            <div style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; padding: 6px 8px; display: flex; gap: 12px; align-items: center; color: #475569;">
                              <span pmConsoleIcon="bold" style="font-size: 14px; cursor: pointer;"></span>
                              <span pmConsoleIcon="italic" style="font-size: 14px; cursor: pointer;"></span>
                              <div style="width: 1px; height: 14px; background: #cbd5e1;"></div>
                              <span pmConsoleIcon="list" style="font-size: 14px; cursor: pointer;"></span>
                              <span style="font-family: serif; font-size: 16px; font-weight: bold; line-height: 1; cursor: pointer;">"</span>
                              <div style="width: 1px; height: 14px; background: #cbd5e1;"></div>
                              <span pmConsoleIcon="link" style="font-size: 14px; cursor: pointer;"></span>
                              <span pmConsoleIcon="image" style="font-size: 14px; cursor: pointer;"></span>
                            </div>
                            <textarea style="width: 100%; height: 80px; border: none; padding: 8px; font-size: 13px; outline: none; resize: vertical; box-sizing: border-box;"></textarea>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- When Approved -->
                    <div class="step-accordion" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
                      <div class="step-accordion-header" (click)="toggleEmailAccordion('approved')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; cursor: pointer; font-size: 13px; font-weight: 500; color: #334155;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span pmConsoleIcon="mail" style="color: #64748b; font-size: 16px;"></span>
                          When Approved/Endorsed/Reviewed
                        </div>
                        <span [pmConsoleIcon]="emailAccordionOpen === 'approved' ? 'chevron-up' : 'chevron-down'" style="color: #64748b;"></span>
                      </div>
                      @if (emailAccordionOpen === 'approved') {
                        <div class="step-accordion-body" style="padding: 16px; background: #ffffff; border-top: 1px solid #e2e8f0;">
                          <div style="display: flex; gap: 16px; margin-bottom: 12px;">
                             <label style="font-size: 11px; color: #334155; display: flex; align-items: center; gap: 6px;"><input type="radio" name="appLink" checked> Link Users</label>
                             <label style="font-size: 11px; color: #334155; display: flex; align-items: center; gap: 6px;"><input type="radio" name="appLink"> Link Roles</label>
                          </div>
                          <div style="position: relative; width: 100%; margin-bottom: 12px;">
                            <div (click)="isApprovedDropdownOpen = !isApprovedDropdownOpen" style="border: 1px solid #cbd5e1; border-radius: 4px; min-height: 32px; padding: 4px 8px; background: #ffffff; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; cursor: pointer;">
                              @if (approvedSelectedRoles.length === 0) {
                                <span style="color: #94a3b8; font-size: 12px; padding: 2px 4px;">Select</span>
                              }
                              @for (role of approvedSelectedRoles; track role) {
                                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 2px 6px; font-size: 12px; display: flex; align-items: center; gap: 4px; color: #334155;">
                                  <span (click)="removeRole('approved', role, $event)" style="color: #2563eb; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px;">&times;</span>
                                  {{ role }}
                                </div>
                              }
                              <div style="flex-grow: 1; min-width: 20px;"></div>
                              <span pmConsoleIcon="chevron-down" style="color: #64748b; font-size: 14px;"></span>
                            </div>
                            @if (isApprovedDropdownOpen) {
                              <div style="position: absolute; top: 100%; left: 0; right: 0; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; margin-top: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10; max-height: 200px; overflow-y: auto;">
                                <div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project Roles</div>
                                @for (role of availableRoles; track role) {
                                  <div (click)="toggleRole('approved', role)" style="padding: 8px 12px; font-size: 13px; color: #334155; cursor: pointer; transition: background 0.2s;" [style.background]="approvedSelectedRoles.includes(role) ? '#f8fafc' : 'transparent'" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background=this.getAttribute('data-active') === 'true' ? '#f8fafc' : 'transparent'" [attr.data-active]="approvedSelectedRoles.includes(role) ? 'true' : 'false'">
                                    {{ role }}
                                  </div>
                                }
                              </div>
                            }
                          </div>
                          <div style="font-size: 11px; color: #334155; margin-bottom: 6px;">Email template</div>
                          <div style="border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; background: #ffffff;">
                            <div style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; padding: 6px 8px; display: flex; gap: 12px; align-items: center; color: #475569;">
                              <span pmConsoleIcon="bold" style="font-size: 14px; cursor: pointer;"></span>
                              <span pmConsoleIcon="italic" style="font-size: 14px; cursor: pointer;"></span>
                              <div style="width: 1px; height: 14px; background: #cbd5e1;"></div>
                              <span pmConsoleIcon="list" style="font-size: 14px; cursor: pointer;"></span>
                              <span style="font-family: serif; font-size: 16px; font-weight: bold; line-height: 1; cursor: pointer;">"</span>
                            </div>
                            <textarea style="width: 100%; height: 80px; border: none; padding: 8px; font-size: 13px; outline: none; resize: vertical; box-sizing: border-box;"></textarea>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- When Rejected -->
                    <div class="step-accordion" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                      <div class="step-accordion-header" (click)="toggleEmailAccordion('rejected')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; cursor: pointer; font-size: 13px; font-weight: 500; color: #334155;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span pmConsoleIcon="mail" style="color: #64748b; font-size: 16px;"></span>
                          When Sent back/Rejected
                        </div>
                        <span [pmConsoleIcon]="emailAccordionOpen === 'rejected' ? 'chevron-up' : 'chevron-down'" style="color: #64748b;"></span>
                      </div>
                      @if (emailAccordionOpen === 'rejected') {
                        <div class="step-accordion-body" style="padding: 16px; background: #ffffff; border-top: 1px solid #e2e8f0;">
                          <div style="display: flex; gap: 16px; margin-bottom: 12px;">
                             <label style="font-size: 11px; color: #334155; display: flex; align-items: center; gap: 6px;"><input type="radio" name="rejLink" checked> Link Users</label>
                             <label style="font-size: 11px; color: #334155; display: flex; align-items: center; gap: 6px;"><input type="radio" name="rejLink"> Link Roles</label>
                          </div>
                          <div style="position: relative; width: 100%; margin-bottom: 12px;">
                            <div (click)="isRejectedDropdownOpen = !isRejectedDropdownOpen" style="border: 1px solid #cbd5e1; border-radius: 4px; min-height: 32px; padding: 4px 8px; background: #ffffff; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; cursor: pointer;">
                              @if (rejectedSelectedRoles.length === 0) {
                                <span style="color: #94a3b8; font-size: 12px; padding: 2px 4px;">Select</span>
                              }
                              @for (role of rejectedSelectedRoles; track role) {
                                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 2px 6px; font-size: 12px; display: flex; align-items: center; gap: 4px; color: #334155;">
                                  <span (click)="removeRole('rejected', role, $event)" style="color: #2563eb; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px;">&times;</span>
                                  {{ role }}
                                </div>
                              }
                              <div style="flex-grow: 1; min-width: 20px;"></div>
                              <span pmConsoleIcon="chevron-down" style="color: #64748b; font-size: 14px;"></span>
                            </div>
                            @if (isRejectedDropdownOpen) {
                              <div style="position: absolute; top: 100%; left: 0; right: 0; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; margin-top: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10; max-height: 200px; overflow-y: auto;">
                                <div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project Roles</div>
                                @for (role of availableRoles; track role) {
                                  <div (click)="toggleRole('rejected', role)" style="padding: 8px 12px; font-size: 13px; color: #334155; cursor: pointer; transition: background 0.2s;" [style.background]="rejectedSelectedRoles.includes(role) ? '#f8fafc' : 'transparent'" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background=this.getAttribute('data-active') === 'true' ? '#f8fafc' : 'transparent'" [attr.data-active]="rejectedSelectedRoles.includes(role) ? 'true' : 'false'">
                                    {{ role }}
                                  </div>
                                }
                              </div>
                            }
                          </div>
                          <div style="font-size: 11px; color: #334155; margin-bottom: 6px;">Email template</div>
                          <div style="border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; background: #ffffff;">
                            <div style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; padding: 6px 8px; display: flex; gap: 12px; align-items: center; color: #475569;">
                              <span pmConsoleIcon="bold" style="font-size: 14px; cursor: pointer;"></span>
                              <span pmConsoleIcon="italic" style="font-size: 14px; cursor: pointer;"></span>
                              <div style="width: 1px; height: 14px; background: #cbd5e1;"></div>
                              <span pmConsoleIcon="list" style="font-size: 14px; cursor: pointer;"></span>
                              <span style="font-family: serif; font-size: 16px; font-weight: bold; line-height: 1; cursor: pointer;">"</span>
                            </div>
                            <textarea style="width: 100%; height: 80px; border: none; padding: 8px; font-size: 13px; outline: none; resize: vertical; box-sizing: border-box;"></textarea>
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <div style="display: flex; justify-content: flex-start; gap: 12px; margin-top: 32px;">
                    <button type="button" (click)="saveWorkflowStep()" style="background: #2563eb; color: white; border: none; border-radius: 4px; padding: 8px 24px; font-size: 13px; font-weight: 500; cursor: pointer;">{{ editingStepIndex !== null ? 'Save' : 'Add' }}</button>
                    <button type="button" (click)="cancelAddStep()" style="background: transparent; color: #2563eb; border: 1px solid #2563eb; border-radius: 4px; padding: 8px 24px; font-size: 13px; font-weight: 500; cursor: pointer;">Cancel</button>
                  </div>
                </div>
              }
            </div>
            @}
          </div>
        </div>
      </app-pm-console-plan-drawer>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }

    .project-plan-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .project-plan-title h1 {
      margin: 0;
      line-height: 1;
      transform: translateY(1px); /* slight optical nudge */
    }

    .project-plan-title .project-plan-back {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .framework-content {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      padding: 48px;
    }

    .empty-state-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 460px;
    }

    .illustration-elem {
      --reporting-empty-illustration-height: 140px;
      margin-bottom: 24px;
      opacity: 0.95;
    }

    .empty-heading {
      font-size: 18px;
      font-weight: 600;
      color: #202633;
      margin: 0 0 8px 0;
    }

    .empty-subtext {
      font-size: 13.5px;
      line-height: 1.6;
      color: #555555;
      margin: 0 0 20px 0;
    }

    .meta-tag-wrapper {
      display: flex;
      justify-content: center;
    }

    .meta-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f4f5f7;
      border: 1px solid #e3e5e9;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #707788;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .tag-icon {
      font-size: 12px;
      color: var(--brand, #007aff);
    }

    /* Org Structure Layout */
    .org-structure-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      height: 100%;
      color: #202633;
    }

    .org-structure-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .org-structure-intro h2 {
      font-size: 18px;
      font-weight: 600;
      color: #0b0b0b;
      margin: 0 0 4px 0;
    }

    .org-structure-intro p {
      font-size: 13px;
      color: #687182;
      margin: 0;
    }

    /* Centered Empty State */
    .org-empty-state-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 64px 32px;
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 12px;
      min-height: 380px;
      box-shadow: 0 1px 3px rgba(25, 33, 61, 0.04);
      margin-top: 16px;
    }

    .org-empty-circle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #eff6ff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .org-empty-icon {
      font-size: 24px;
      color: #2563eb;
      display: inline-flex;
    }

    .org-empty-state-wrapper h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .org-empty-state-wrapper p {
      font-size: 13.5px;
      line-height: 1.5;
      color: #64748b;
      max-width: 440px;
      margin: 0 0 24px 0;
    }

    /* Action Buttons */
    .org-empty-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.16);
      transition: all 0.2s ease;
    }

    .org-empty-btn:hover {
      background: #1d4ed8;
      box-shadow: 0 4px 8px rgba(37, 99, 235, 0.24);
      transform: translateY(-1px);
    }

    .org-header-add-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.16);
      transition: all 0.2s ease;
    }

    .org-header-add-btn:hover {
      background: #1d4ed8;
      box-shadow: 0 4px 8px rgba(37, 99, 235, 0.24);
      transform: translateY(-1px);
    }



    .division-action-menu-wrap {
      position: relative;
      display: inline-block;
      overflow: visible;
    }

    .division-action-trigger {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #475569;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      outline: none;
    }

    .division-action-trigger:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .division-action-trigger:focus-visible {
      background: #e2e8f0;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    .division-dropdown-menu {
      position: absolute;
      right: 0;
      top: 36px;
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(25, 33, 61, 0.08);
      z-index: 100;
      min-width: 110px;
      padding: 4px 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .division-dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      border: none;
      background: transparent;
      padding: 8px 12px;
      font-size: 13px;
      color: #334155;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s ease;
      outline: none;
    }

    .division-dropdown-item:hover {
      background: #f1f5f9;
    }

    .division-dropdown-item .item-icon {
      font-size: 13px;
      color: #64748b;
      display: inline-flex;
    }

    .division-dropdown-item.delete {
      color: #ef4444;
    }

    .division-dropdown-item.delete:hover {
      background: #fee2e2;
    }

    .division-dropdown-item.delete .item-icon {
      color: #ef4444;
    }

    /* Group Cards & Layout */
    .groups-tabs-row {
      display: flex;
      flex-direction: row;
      gap: 16px;
      overflow-x: auto;
      padding: 8px 4px 16px 4px;
      margin-top: 12px;
      margin-bottom: 4px;
      align-items: center;
      width: 100%;
    }

    .groups-tabs-row::-webkit-scrollbar {
      height: 6px;
    }
    .groups-tabs-row::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    .groups-tabs-row::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    .groups-tabs-row::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .add-group-tab-card {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 70px;
      width: 180px;
      flex: 0 0 180px;
      border: 1.5px dashed #cbd5e1;
      border-radius: 16px;
      background: transparent;
      color: #64748b;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-sizing: border-box;
      transition: all 0.2s ease;
      outline: none;
    }

    .add-group-tab-card:hover {
      border-color: #10069f;
      color: #10069f;
      background: #f4f6fc;
      box-shadow: 0 4px 12px rgba(16, 6, 159, 0.05);
    }

    .groups-list-stack {
      display: flex;
      flex-direction: column;
      gap: 40px;
      margin-top: 24px;
      width: 100%;
    }

    .group-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
    }

    .group-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      width: 320px;
      flex: 0 0 320px;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .group-card.pointer {
      cursor: pointer;
    }

    .group-card:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .group-card.active {
      background: #f4f6fc;
      border: 1.5px solid #10069f;
      box-shadow: 0 4px 16px rgba(16, 6, 159, 0.08);
    }

    .group-card.active:hover {
      background: #f4f6fc;
      border-color: #0b0482;
      box-shadow: 0 6px 20px rgba(16, 6, 159, 0.12);
    }

    .group-card-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #f1f5f9;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .group-card.active .group-card-icon-wrap {
      background: #10069f;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(16, 6, 159, 0.2);
    }

    .group-card-icon {
      font-size: 18px;
      display: inline-flex;
    }

    .group-card-title-area {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      width: 100%;
    }

    .group-card-input {
      font-size: 16px;
      font-weight: 600;
      color: #475569;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 6px;
      padding: 4px 8px;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.15s ease;
      cursor: inherit;
    }

    .group-card.active .group-card-input {
      color: #10069f;
    }

    .group-card-input:hover {
      background: rgba(241, 245, 249, 0.8);
      border-color: #cbd5e1;
    }

    .group-card.active .group-card-input:hover {
      background: rgba(255, 255, 255, 0.6);
      border-color: #cbd5e1;
    }

    .group-card-input:focus {
      background: #ffffff;
      border-color: #64748b;
      box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.12);
    }

    .group-card.active .group-card-input:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }

    .group-card-owner-badge {
      font-size: 11.5px;
      font-weight: 500;
      color: #64748b;
      padding-left: 8px;
      margin-top: 1px;
    }

    .group-card.active .group-card-owner-badge {
      color: #10069f;
    }

    /* Rich editor styled panels in drawer */
    .rich-editor-container {
      border: 1px solid #dfe4ee;
      border-radius: 8px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-top: 6px;
      transition: all 0.2s ease;
    }

    .rich-editor-container:focus-within {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
    }

    .rich-editor-toolbar {
      background: #f8fafc;
      border-bottom: 1px solid #dfe4ee;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
    }

    .toolbar-btn {
      background: transparent;
      border: none;
      border-radius: 4px;
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .toolbar-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .toolbar-btn.bold-btn {
      font-weight: 800;
    }

    .toolbar-btn.italic-btn {
      font-style: italic;
      font-family: serif;
      font-size: 14px;
    }

    .toolbar-divider {
      width: 1px;
      height: 16px;
      background: #cbd5e1;
      margin: 0 6px;
    }

    .rich-editor-textarea {
      border: none;
      outline: none;
      background: transparent;
      padding: 12px;
      font-size: 13px;
      color: #334155;
      min-height: 120px;
      font-family: inherit;
      resize: vertical;
      width: 100%;
      box-sizing: border-box;
      line-height: 1.5;
    }

    /* Division Cards & Layout */
    .divisions-list-stack {
      display: flex;
      flex-direction: column;
      gap: 36px;
      margin-top: 24px;
    }

    .division-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }

    .division-card {
      background: #f4f6fc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 12px 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      max-width: 400px;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .division-card:hover {
      box-shadow: 0 4px 12px rgba(25, 33, 61, 0.04);
      border-color: #cbd5e1;
    }

    .division-card-icon-wrap, .branch-card-icon-wrap {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #ffffff;
      color: #10069f;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      flex-shrink: 0;
    }

    .division-card-icon, .branch-card-icon {
      font-size: 16px;
      display: inline-flex;
    }

    .division-card-input {
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 6px;
      padding: 6px 10px;
      outline: none;
      flex-grow: 1;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.15s ease;
    }

    .division-card-input:hover {
      background: rgba(255, 255, 255, 0.6);
      border-color: #cbd5e1;
    }

    .division-card-input:focus {
      background: #ffffff;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    /* Flat Action Dots Button (No stroke / Flat) */
    .flat-dots-trigger {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      outline: none !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      color: #64748b !important;
      transition: all 0.2s ease !important;
    }

    .flat-dots-trigger:hover {
      background: #e2e8f0 !important;
      color: #0f172a !important;
    }

    .flat-dots-trigger:focus-visible {
      background: #e2e8f0 !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;
    }

    /* Branch Container Columns and Layout */
    .branches-row-flex {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 20px;
      overflow-x: auto;
      padding: 8px 4px 20px 4px;
      width: 100%;
      scroll-behavior: smooth;
    }

    .branch-column-card {
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 20px;
      padding: 20px;
      width: 290px;
      min-width: 290px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 2px 5px rgba(25, 33, 61, 0.02);
      box-sizing: border-box;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .branch-column-card:hover {
      box-shadow: 0 4px 12px rgba(25, 33, 61, 0.05);
      border-color: #cbd5e1;
    }

    .branch-card-header-box {
      background: #f4f6fc;
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      width: 100%;
      box-sizing: border-box;
    }

    .branch-card-input {
      font-size: 13.5px;
      font-weight: 600;
      color: #0f172a;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 6px;
      padding: 4px 8px;
      outline: none;
      flex-grow: 1;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.15s ease;
    }

    .branch-card-input:hover {
      background: rgba(255, 255, 255, 0.6);
      border-color: #cbd5e1;
    }

    .branch-card-input:focus {
      background: #ffffff;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    /* Sections vertical list inside Branch */
    .sections-list-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .section-card {
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .section-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    }

    .section-item-input {
      border: none;
      background: transparent;
      padding: 4px 8px;
      font-size: 13.5px;
      font-weight: 500;
      color: #334155;
      outline: none;
      flex-grow: 1;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.15s ease;
    }

    .section-item-input:hover {
      background: #f8fafc;
      border-radius: 6px;
    }

    .section-item-input:focus {
      background: #f1f5f9;
      border-radius: 6px;
    }

    /* Add CTAs buttons */
    .section-text-cta-btn {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      transition: all 0.2s ease;
      outline: none;
      width: fit-content;
      margin-top: 4px;
    }

    .section-text-cta-btn:hover {
      color: #10069f;
    }

    .branch-text-cta-btn {
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      transition: all 0.2s ease;
      outline: none;
      height: 40px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .branch-text-cta-btn:hover {
      color: #10069f;
      background: #f8fafc;
    }

    .branch-cta-end {
      display: flex;
      align-items: center;
      height: 100%;
      margin-top: 8px;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* User Management Layout */
    .user-management-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
      height: 100%;
      color: #202633;
    }

    .user-management-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-title-group h2 {
      font-size: 18px;
      font-weight: 600;
      color: #0b0b0b;
      margin: 0 0 4px 0;
    }

    .user-title-group p {
      font-size: 13px;
      color: #687182;
      margin: 0;
    }

    .user-header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .export-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #10069f;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(16, 6, 159, 0.12);
      transition: all 0.2s ease;
    }

    .export-btn:hover {
      background: #1b10bd;
      box-shadow: 0 4px 8px rgba(16, 6, 159, 0.2);
      transform: translateY(-1px);
    }

    .export-btn span[pmConsoleIcon] {
      font-size: 14px;
      display: inline-flex;
    }

    .add-user-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #10069f;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(16, 6, 159, 0.12);
      transition: all 0.2s ease;
    }

    .add-user-btn:hover {
      background: #1b10bd;
      box-shadow: 0 4px 8px rgba(16, 6, 159, 0.2);
      transform: translateY(-1px);
    }

    .add-user-btn span[pmConsoleIcon] {
      font-size: 14px;
      display: inline-flex;
    }

    /* Total Users Bar */
    .total-users-bar {
      background: #f8fafc;
      border: 1px solid #dfe4ee;
      border-radius: 10px;
      padding: 14px 20px;
    }

    .total-users-bar-inner {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .total-users-icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      background: rgba(16, 6, 159, 0.08);
      border-radius: 6px;
      color: #10069f;
    }

    .total-users-icon {
      font-size: 15px;
      display: inline-flex;
    }

    .total-users-label {
      font-size: 13.5px;
      font-weight: 600;
      color: #334155;
    }

    .total-users-count {
      font-size: 14px;
      font-weight: 700;
      color: #10069f;
      margin-left: 4px;
    }

    /* =============================================
       User Drawer form field styles (ud-*)
       The drawer chrome (overlay, width, header,
       footer, close button) comes from the shared
       PmConsolePlanDrawerComponent.
       ============================================= */

    .ud-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Two-column row */
    .ud-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ud-row-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: start;
    }

    .ud-row-3col {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      align-items: start;
    }

    /* Field wrapper */
    .ud-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Label — Montserrat 14px/500 #0A0A0A as per Figma */
    .ud-label {
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      color: #0a0a0a;
    }

    .ud-required {
      color: #fb2c36;
      margin-left: 1px;
    }

    /* Text input — Figma: 36px h, 8px radius, rgba(0,0,0,0.15) border */
    .ud-input {
      height: 36px;
      padding: 4px 12px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #0a0a0a;
      background: #ffffff;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .ud-input::placeholder {
      color: #717182;
    }

    .ud-input:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }

    /* Checkbox — styled square as per Figma */
    .ud-checkbox-row {
      height: 36px;
      display: flex;
      align-items: center;
    }

    .ud-checkbox-box {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.10);
      background: #f3f3f5;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.12s, border-color 0.12s;
    }

    .ud-checkbox-box--checked {
      background: #10069f;
      border-color: #10069f;
    }

    .ud-checkbox-box--checked::after {
      content: '';
      display: block;
      width: 9px;
      height: 5px;
      border-left: 2px solid #fff;
      border-bottom: 2px solid #fff;
      transform: rotate(-45deg) translate(0px, -1px);
    }

    /* Radio buttons */
    .ud-radio-group {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .ud-radio-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #0a0a0a;
      cursor: pointer;
    }

    .ud-radio {
      width: 16px;
      height: 16px;
      accent-color: #10069f;
      cursor: pointer;
      flex-shrink: 0;
    }

    /* Select wrapper — positions chevron */
    .ud-select-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    /* Bordered select (Group) — same as text input */
    .ud-select {
      appearance: none;
      -webkit-appearance: none;
      height: 36px;
      padding: 8px 32px 8px 12px;
      border-radius: 8px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #717182;
      width: 100%;
      cursor: pointer;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }

    .ud-select--bordered {
      border: 1px solid rgba(0, 0, 0, 0.15);
      background: #ffffff;
    }

    .ud-select--bordered:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }

    /* Pill select (Division / Branch / Section) — #F3F3F5 bg, no visible border */
    .ud-select--pill {
      border: 1px solid transparent;
      background: #f3f3f5;
      color: #0a0a0a;
      font-weight: 500;
    }

    .ud-select--pill:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }

    .ud-select-chevron {
      position: absolute;
      right: 10px;
      pointer-events: none;
      color: #717182;
      font-size: 13px;
      display: inline-flex;
      opacity: 0.5;
    }

    /* Table Wrapper & Table */
    .user-table-wrapper {
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(25, 33, 61, 0.04);
      overflow: visible;
      width: 100%;
    }

    .user-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      text-align: left;
    }

    .user-table th {
      background: #f8fafc;
      border-bottom: 1px solid #dfe4ee;
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      padding: 14px 16px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .user-table th:first-child {
      border-top-left-radius: 12px;
    }

    .user-table th:last-child {
      border-top-right-radius: 12px;
    }

    .user-table th.sortable {
      cursor: pointer;
      user-select: none;
      display: table-cell;
      position: relative;
    }

    .sort-icon-wrapper {
      display: inline-flex;
      align-items: center;
      margin-left: 6px;
      vertical-align: middle;
    }

    .sort-icon-triangle {
      font-size: 8px;
      color: #10069f;
      display: inline-block;
      transform: scale(0.9);
    }

    .user-table td {
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 13.5px;
      padding: 12px 16px;
      vertical-align: middle;
    }

    .user-table tr:last-child td {
      border-bottom: none;
    }

    .user-table tr:last-child td:first-child {
      border-bottom-left-radius: 12px;
    }

    .user-table tr:last-child td:last-child {
      border-bottom-right-radius: 12px;
    }

    .user-table tr:hover td {
      background: #f8fafc;
    }

    /* Avatars and badges */
    .user-avatar-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e0f2fe;
      color: #0369a1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .user-avatar-name {
      font-weight: 500;
      color: #1e293b;
    }

    .font-mono-text {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      color: #64748b;
    }

    .role-badge {
      display: inline-flex;
      background: #f1f5f9;
      color: #475569;
      font-size: 11.5px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .text-slate-email {
      color: #475569;
    }

    .text-slate-bu {
      color: #475569;
    }

    .access-pill {
      display: inline-flex;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .access-pill.enabled {
      background: rgba(16, 185, 129, 0.08);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.15);
    }

    .access-pill.disabled {
      background: rgba(239, 68, 68, 0.08);
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.15);
    }

    .user-row-delete-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      transition: all 0.2s ease;
      opacity: 0.4;
    }

    .user-table tr:hover .user-row-delete-btn {
      opacity: 1;
    }

    .user-row-delete-btn:hover {
      background: #fee2e2;
      color: #ef4444;
    }

    /* 3-dot more-action button */
    .user-action-cell {
      text-align: center;
      position: relative;
    }

    .user-action-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .user-dots-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 8px;
      border-radius: 6px;
      transition: background 0.15s;
    }

    .user-dots-btn:hover {
      background: #f1f5f9;
    }

    .user-dots-btn-dot {
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #475569;
      flex-shrink: 0;
    }

    /* Dropdown menu */
    .user-action-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(25, 33, 61, 0.13), 0 1px 4px rgba(25, 33, 61, 0.06);
      border: 1px solid #e8eaf0;
      padding: 8px 0;
      min-width: 180px;
      z-index: 100;
      animation: menuFadeIn 0.12s ease forwards;
    }

    @keyframes menuFadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .user-action-item {
      display: block;
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      padding: 12px 20px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #10069f;
      cursor: pointer;
      transition: background 0.12s;
      white-space: nowrap;
    }

    .user-action-item:hover {
      background: #f4f6fc;
    }

    .last-login-cell {
      color: #64748b;
      font-size: 13px;
    }

    /* Empty state table row cell */
    .table-empty-cell {
      padding: 0 !important;
    }

    .table-empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .table-empty-icon {
      font-size: 32px;
      color: #cbd5e1;
      margin-bottom: 12px;
      display: inline-flex;
    }

    .table-empty-container h4 {
      font-size: 15px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 6px 0;
    }

    .table-empty-container p {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 16px 0;
      max-width: 380px;
    }

    .empty-add-user-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #10069f;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 600;
      padding: 6px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .empty-add-user-btn:hover {
      background: rgba(16, 6, 159, 0.04);
      border-color: #10069f;
    }

    .empty-add-user-btn span[pmConsoleIcon] {
      font-size: 13px;
      display: inline-flex;
    }

    /* Standards & Taxonomies Layout */
    .standards-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      height: 100%;
      color: #202633;
    }

    .active-page {
      background: #10069f !important;
      color: #ffffff !important;
      border-color: #10069f !important;
      font-weight: 600;
    }

    .glossary-action-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #10069f !important;
    }

    /* Sidebar + panel split layout for Standards & Taxonomies */
    .standards-split-layout {
      display: flex;
      gap: 24px;
      width: 100%;
      min-height: 0;
      flex: 1;
      color: #202633;
    }

    /* Left sidebar nav */
    .standards-sidebar {
      display: flex;
      flex-direction: column;
      width: 260px;
      min-width: 220px;
      flex-shrink: 0;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      position: relative;
      z-index: 10;
      padding: 16px;
      gap: 12px;
      margin-top: -24px;
      margin-left: -24px;
      margin-bottom: -24px;
    }

    .standards-category-nav {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .standards-cat-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 14px 16px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #334155;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .standards-cat-btn:hover {
      background: #f8fafc;
    }

    .standards-cat-btn.active {
      background: #f5f6ff;
      color: #10069f;
      font-weight: 600;
      border-color: transparent;
      border-left: 3px solid #10069f;
    }

    .cat-content-left {
      display: flex;
      align-items: center;
    }

    .cat-label {
      font-size: 14px;
    }

    .cat-count {
      font-size: 13px;
      font-weight: 500;
      color: #64748b;
    }


    /* Right cards panel */
    .standards-cards-panel {
      flex: 1;
      min-width: 0;
      overflow-y: auto;
      padding-top: 8px;
      padding-bottom: 24px;
      padding-right: 8px;
      padding-left: 2px;
    }

    .standards-intro h2 {
      font-size: 18px;
      font-weight: 600;
      color: #0b0b0b;
      margin: 0 0 12px 0;
    }

    .standards-intro p {
      font-size: 13px;
      color: #687182;
      margin: 0;
    }

    .standards-sections-stack {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .standards-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .standards-section-heading {
      font-size: 14.5px;
      font-weight: 600;
      color: #202633;
      margin: 0;
      border-left: 3px solid #10069f;
      padding-left: 8px;
    }

    .standards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .standards-card {
      position: relative;
      background: linear-gradient(145deg, #ffffff 40%, #f4f6fb 100%);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      padding: 18px;
      text-align: left;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      min-height: 160px;
      height: auto;
      box-sizing: border-box;
      outline: none;
    }

    .standards-card:hover {
      box-shadow: 0 6px 16px rgba(16, 6, 159, 0.08);
      border-color: #c7d2fe;
      transform: translateY(-2px);
    }

    .standards-card-icon-container {
      align-items: center;
      border-radius: 10px;
      display: flex;
      height: 38px;
      width: 38px;
      justify-content: center;
      border: 1px solid #f1f5f9;
      flex-shrink: 0;
    }

    .standards-card-icon-container.setup-color {
      background: #f5f6ff;
      color: #10069f;
    }

    .standards-card-icon-container.planning-color {
      background: #f0fdfa;
      color: #0d9488;
    }

    .standards-card-icon-container.closure-color {
      background: #e0f2fe;
      color: #0284c7;
    }

    .standards-card-icon-container.benefits-color {
      background: #eef2ff;
      color: #4f46e5;
    }

    .standards-card-icon {
      font-size: 18px;
      display: inline-flex;
    }

    .standards-card-body {
      margin-top: 14px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .standards-card-body h4 {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.3;
      display: flex;
      align-items: center;
    }

    .standards-card-item-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid transparent;
      margin-left: 8px;
    }

    .standards-card-item-count-inner {
      font-size: 11px;
      font-weight: 600;
    }

    .standards-card:has(.setup-color) .standards-card-item-count {
      background: #f5f6ff;
    }
    .standards-card:has(.setup-color) .standards-card-item-count-inner {
      color: #10069f;
    }

    .standards-card:has(.planning-color) .standards-card-item-count {
      background: #f0fdfa;
    }
    .standards-card:has(.planning-color) .standards-card-item-count-inner {
      color: #0d9488;
    }

    .standards-card:has(.closure-color) .standards-card-item-count {
      background: #e0f2fe;
    }
    .standards-card:has(.closure-color) .standards-card-item-count-inner {
      color: #0284c7;
    }

    .standards-card:has(.benefits-color) .standards-card-item-count {
      background: #eef2ff;
    }
    .standards-card:has(.benefits-color) .standards-card-item-count-inner {
      color: #4f46e5;
    }

    .standards-card-meta {
      margin-top: 12px;
      font-size: 11.5px;
      color: #64748b;
      line-height: 1.4;
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 24px;
      box-sizing: border-box;
    }

    .standards-card-body p {
      font-size: 13px;
      line-height: 1.45;
      color: #64748b;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .standards-card-arrow-right {
      position: absolute;
      bottom: 16px;
      right: 18px;
      color: #10069f;
      font-size: 18px;
      display: inline-flex;
      transition: transform 0.2s ease;
    }

    .standards-card:hover .standards-card-arrow-right {
      transform: translateX(3px);
    }

    /* Amber Attention Dot on Card Top Right */
    .attention-dot {
      display: none;
    }

    /* Workflow Designer Custom Header & Buttons */
    .workflow-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .add-workflow-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #10069f;
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 13.5px;
      font-weight: 600;
      padding: 10px 18px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(16, 6, 159, 0.12);
      transition: all 0.2s ease;
    }

    .add-workflow-btn:hover {
      background: #1b10bd;
      box-shadow: 0 4px 12px rgba(16, 6, 159, 0.2);
      transform: translateY(-1px);
    }

    .add-workflow-btn .btn-icon {
      font-size: 14px;
    }

    /* Workflow Pills */
    .workflow-pill {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 13px;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      display: block;
      width: fit-content;
    }
    .workflow-pill:hover {
      background: #f1f5f9;
    }
    .workflow-pill.active {
      background: #f5f6ff;
      border-color: #10069f;
      color: #10069f;
      font-weight: 500;
    }

    /* Priority Drawer Table */
    /* Standards Side Drawer custom styles */
    .standards-drawer-body {
      padding: 8px 0;
    }

    .drawer-section-title {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 8px;
    }

    .standards-tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .standards-tag {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      color: #334155;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 500;
    }

    .tag-delete-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 4px;
      width: 14px;
      height: 14px;
      transition: all 0.15s ease;
    }

    .tag-delete-btn:hover {
      background: #fee2e2;
      color: #ef4444;
    }

    .tag-delete-btn span {
      font-size: 10px;
    }

    .empty-items-text {
      font-size: 12.5px;
      color: #94a3b8;
      margin: 0;
      font-style: italic;
    }

    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: #344054;
      display: block;
      margin-bottom: 6px;
    }

    .form-control {
      background: #ffffff;
      border: 1px solid #d0d5dd;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13.5px;
      padding: 10px 14px;
      outline: none;
      transition: all 0.2s ease;
      width: 100%;
      box-sizing: border-box;
      color: #1d2939;
    }

    .form-control:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 255, 0.08);
    }

    .text-area-outcome {
      resize: vertical;
      min-height: 80px;
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
      right: 12px;
      pointer-events: none;
      color: #667085;
      font-size: 14px;
      display: inline-flex;
    }

    .priority-action-btn {
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      transition: all 0.2s ease;
      padding: 0;
    }
    .priority-action-btn:hover {
      background: #f1f5f9;
      color: #10069f;
    }
    .priority-action-btn.delete:hover {
      background: #fee2e2;
      color: #ef4444;
    }

    .priority-expandable-search {
      position: relative;
      display: flex;
      align-items: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .priority-expandable-search:hover,
    .priority-expandable-search:focus-within {
      width: 200px;
      background: #ffffff;
      border-color: #cbd5e1;
      padding-left: 10px;
      padding-right: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .priority-expandable-search .search-icon {
      position: absolute;
      right: 9px;
      font-size: 14px;
      color: #64748b;
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .priority-expandable-search:hover .search-icon,
    .priority-expandable-search:focus-within .search-icon {
      left: 10px;
      right: auto;
      color: #10069f;
    }

    .priority-expandable-search .search-input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-size: 13px;
      padding-left: 20px;
      padding-right: 28px;
      color: #334155;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .priority-expandable-search:hover .search-input,
    .priority-expandable-search:focus-within .search-input {
      opacity: 1;
    }

    /* Actions dropdown styles */
    .priority-dropdown-menu {
      animation: motion-fade-in 0.15s ease both;
    }
    .dropdown-item {
      transition: background 0.15s ease, color 0.15s ease;
    }
    .dropdown-item:hover {
      background: #f8fafc;
      color: #10069f !important;
    }
    .dropdown-item.delete:hover {
      background: #fee2e2;
      color: #ef4444 !important;
    }

    /* Increased description font size for Manage Priorities */
    .priority-drawer-view .plan-entry-drawer-title p {
      font-size: 13px !important;
      line-height: 1.5 !important;
      color: #475569 !important;
      max-width: 100% !important;
    }
  `]
})
export class PortfolioWorkspaceFrameworkComponent implements OnInit {
  @Output() readonly back = new EventEmitter<void>();

  activeSectionId = 'org-structure';

  groupObjects: Array<{
    name: string;
    owner?: string;
    purpose?: string;
    environmentFactors?: string;
    divisions: Array<{
      name: string;
      branches: Array<{
        name: string;
        sections: Array<{ name: string }>;
      }>;
    }>;
  }> = [];

  ngOnInit(): void {
    if (this.divisions.length > 0) {
      this.groupObjects = [{
        name: 'Group #1',
        owner: 'John Doe',
        purpose: 'Default Group Purpose',
        environmentFactors: 'Default Environment Factors',
        divisions: this.divisions.map(name => ({
          name: name,
          branches: []
        }))
      }];
      this.syncLegacyArrays();
    } else {
      this.groupObjects = [];
    }
  }

  // Glossary category sidebar state
  activeGlossaryTab = 'p3m';

  readonly glossaryCategories = [
    { id: 'p3m', label: 'P3M Glossary' },
    { id: 'risk', label: 'Risk Glossary' },
    { id: 'benefits', label: 'Benefits glossary' }
  ];

  p3mGlossary: GlossaryItem[] = [...initialP3mGlossary];
  riskGlossary: GlossaryItem[] = [...initialRiskGlossary];
  benefitsGlossary: GlossaryItem[] = [...initialBenefitsGlossary];

  editingGlossaryId: string | null = null;
  editingSystemLabel = '';
  editingCustomLabel = '';
  editingContextualHelp = '';

  activeGlossaryActionId: string | null = null;
  glossarySearchQuery = '';

  // Pagination state
  glossaryCurrentPage = 1;
  glossaryPageSize = 5;
  readonly Math = Math;

  setGlossaryTab(id: string): void {
    this.activeGlossaryTab = id;
    this.editingGlossaryId = null;
    this.activeGlossaryActionId = null;
    this.glossaryCurrentPage = 1;
    this.changeDetector.markForCheck();
  }

  onSearchQueryChange(): void {
    this.glossaryCurrentPage = 1;
    this.changeDetector.markForCheck();
  }

  get glossaryTotalPages(): number {
    return Math.ceil(this.getFilteredGlossaryList().length / this.glossaryPageSize);
  }

  get glossaryPages(): number[] {
    const total = this.glossaryTotalPages;
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPaginatedGlossaryList(): GlossaryItem[] {
    const list = this.getFilteredGlossaryList();
    const startIndex = (this.glossaryCurrentPage - 1) * this.glossaryPageSize;
    return list.slice(startIndex, startIndex + this.glossaryPageSize);
  }

  setGlossaryPage(page: number): void {
    if (page >= 1 && page <= this.glossaryTotalPages) {
      this.glossaryCurrentPage = page;
      this.changeDetector.markForCheck();
    }
  }

  nextGlossaryPage(): void {
    if (this.glossaryCurrentPage < this.glossaryTotalPages) {
      this.glossaryCurrentPage++;
      this.changeDetector.markForCheck();
    }
  }

  prevGlossaryPage(): void {
    if (this.glossaryCurrentPage > 1) {
      this.glossaryCurrentPage--;
      this.changeDetector.markForCheck();
    }
  }

  getGlossaryCategoryCount(id: string): number {
    switch (id) {
      case 'p3m': return this.p3mGlossary.length;
      case 'risk': return this.riskGlossary.length;
      case 'benefits': return this.benefitsGlossary.length;
      default: return 0;
    }
  }

  getFilteredGlossaryList(): GlossaryItem[] {
    let list: GlossaryItem[] = [];
    if (this.activeGlossaryTab === 'p3m') list = this.p3mGlossary;
    else if (this.activeGlossaryTab === 'risk') list = this.riskGlossary;
    else if (this.activeGlossaryTab === 'benefits') list = this.benefitsGlossary;

    const q = this.glossarySearchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter(item => 
      item.systemLabel.toLowerCase().includes(q) || 
      item.customLabel.toLowerCase().includes(q) || 
      item.contextualHelp.toLowerCase().includes(q)
    );
  }

  toggleGlossaryActionMenu(event: Event, id: string): void {
    event.stopPropagation();
    this.activeGlossaryActionId = this.activeGlossaryActionId === id ? null : id;
    this.changeDetector.markForCheck();
  }

  triggerEditGlossary(item: GlossaryItem): void {
    this.activeGlossaryActionId = null;
    this.editingGlossaryId = item.id;
    this.editingSystemLabel = item.systemLabel;
    this.editingCustomLabel = item.customLabel;
    this.editingContextualHelp = item.contextualHelp;
    this.changeDetector.markForCheck();
  }

  saveEditGlossary(id: string): void {
    let list: GlossaryItem[] = [];
    if (this.activeGlossaryTab === 'p3m') list = this.p3mGlossary;
    else if (this.activeGlossaryTab === 'risk') list = this.riskGlossary;
    else if (this.activeGlossaryTab === 'benefits') list = this.benefitsGlossary;

    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx].systemLabel = this.editingSystemLabel.trim();
      list[idx].customLabel = this.editingCustomLabel.trim();
      list[idx].contextualHelp = this.editingContextualHelp.trim();
      
      // trigger change detection by re-assigning array
      if (this.activeGlossaryTab === 'p3m') this.p3mGlossary = [...list];
      else if (this.activeGlossaryTab === 'risk') this.riskGlossary = [...list];
      else if (this.activeGlossaryTab === 'benefits') this.benefitsGlossary = [...list];
    }
    
    this.editingGlossaryId = null;
    this.changeDetector.markForCheck();
  }

  cancelEditGlossary(): void {
    // If we were editing a newly added item with a temp id, remove it
    if (this.editingGlossaryId && this.editingGlossaryId.startsWith('temp-')) {
      this.triggerDeleteGlossary(this.editingGlossaryId);
    }
    this.editingGlossaryId = null;
    this.changeDetector.markForCheck();
  }

  triggerDeleteGlossary(id: string): void {
    this.activeGlossaryActionId = null;
    if (this.activeGlossaryTab === 'p3m') {
      this.p3mGlossary = this.p3mGlossary.filter(item => item.id !== id);
    } else if (this.activeGlossaryTab === 'risk') {
      this.riskGlossary = this.riskGlossary.filter(item => item.id !== id);
    } else if (this.activeGlossaryTab === 'benefits') {
      this.benefitsGlossary = this.benefitsGlossary.filter(item => item.id !== id);
    }
    this.changeDetector.markForCheck();
  }

  openAddGlossaryItem(): void {
    const tempId = `temp-${Date.now()}`;
    const newItem: GlossaryItem = {
      id: tempId,
      systemLabel: '',
      customLabel: '',
      contextualHelp: ''
    };

    if (this.activeGlossaryTab === 'p3m') {
      this.p3mGlossary = [newItem, ...this.p3mGlossary];
    } else if (this.activeGlossaryTab === 'risk') {
      this.riskGlossary = [newItem, ...this.riskGlossary];
    } else if (this.activeGlossaryTab === 'benefits') {
      this.benefitsGlossary = [newItem, ...this.benefitsGlossary];
    }

    this.triggerEditGlossary(newItem);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeActionMenuIndex = null;
    this.activeGlossaryActionId = null;
    this.openGroupMenuIndex = null;
    this.openDivisionIndex = null;
    this.openBranchIndex = null;
    this.openSectionIndex = null;
  }


  // Standards & Taxonomies category sidebar state
  activeStandardsCategory = 'project-setup';

  readonly standardsCategories = [
    { id: 'project-setup', label: 'Project Setup' },
    { id: 'project-planning', label: 'Project Planning' },
    { id: 'project-closure', label: 'Project Closure' },
    { id: 'benefits-config', label: 'Benefits and Config' }
  ];

  setStandardsCategory(id: string): void {
    this.activeStandardsCategory = id;
    this.changeDetector.markForCheck();
  }

  getCategoryCount(id: string): number {
    switch (id) {
      case 'project-setup': return this.projectSetupCards.length;
      case 'project-planning': return this.projectPlanningCards.length;
      case 'project-closure': return this.projectClosureCards.length;
      case 'benefits-config': return this.benefitsConfigCards.length;
      default: return 0;
    }
  }

  // Standards & Taxonomies Cards Data State
  projectSetupCards: TaxonomyCard[] = [
    { id: 'category', title: 'Project Category', icon: 'layers', description: 'Define different types of project classifications.', items: ['Research & Development', 'Compliance & Regulatory', 'Business Expansion', 'Infrastructure', 'Software Development'] },
    { id: 'priority', title: 'Priority', icon: 'alert-circle', description: 'Set system-wide priority tiers.', items: ['Critical', 'High', 'Medium', 'Low'], needsAttention: true },
    { id: 'size', title: 'Project Size', icon: 'maximize', description: 'Scale definitions for sizing.', items: ['Small', 'Medium', 'Large', 'Enterprise'] },
    { id: 'tier', title: 'Project Tier', icon: 'bar-chart', description: 'Tier rankings for governance and reviews.', items: ['Tier 1 (High Governance)', 'Tier 2 (Medium Governance)', 'Tier 3 (Light Governance)'] },
    { id: 'procurement', title: 'Procurement Type', icon: 'shopping-bag', description: 'Purchase and sourcing classifications.', items: ['Direct Purchase', 'Request For Proposal (RFP)', 'Sole Source', 'Contract Expansion'] },
    { id: 'supplier', title: 'External Senior Supplier', icon: 'users', description: 'Define third-party vendor categories.', items: ['Vendor Partner', 'Offshore Contractor', 'Independent Consultant', 'OEM Supplier'] }
  ];

  projectPlanningCards: TaxonomyCard[] = [
    { id: 'resource', title: 'Resource', icon: 'user-check', description: 'Resource naming standards and capacities.', items: ['Developer', 'Project Manager', 'Business Analyst', 'QA Engineer', 'Solution Architect'] },
    { id: 'change-impact', title: 'Change Impact', icon: 'refresh-cw', description: 'Change levels.', items: ['Disruptive', 'Major', 'Moderate', 'Minor'], needsAttention: true },
    { id: 'schedule', title: 'Schedule Range', icon: 'calendar', description: 'Timeline margins and baseline parameters.', items: ['Short-term (< 3 months)', 'Medium-term (3-12 months)', 'Long-term (> 12 months)'] },
    { id: 'dependency-impact', title: 'Impact of Dependency', icon: 'git-commit', description: 'Severity ratings of dependent delays.', items: ['High Impact (Blocker)', 'Medium Impact (Workaround)', 'Low Impact (Negligible)'] },
    { id: 'resource-type', title: 'Resource Type', icon: 'briefcase', description: 'Staffing categories.', items: ['Internal Staff', 'External Consultant', 'Subcontractor'] },
    { id: 'product-type', title: 'Product Type', icon: 'package', description: 'Output deliverable definitions.', items: ['Software Release', 'Infrastructure Upgrade', 'Process Definition', 'Audit Report'] },
    { id: 'issue-type', title: 'Issue Type', icon: 'bug', description: 'Problem classifications.', items: ['Blocker', 'Bug', 'Risk', 'Change Request', 'Task'] },
    { id: 'miscellaneous', title: 'Miscellaneous', icon: 'help-circle', description: 'General settings and custom fields.', items: ['Custom Field A', 'Custom Field B'] }
  ];

  projectClosureCards: TaxonomyCard[] = [
    { id: 'closure-content', title: 'Project Closure Content', icon: 'check-circle', description: 'Required deliverables and checks for ending projects.', items: ['Handover Document', 'Final Budget Report', 'Stakeholder Sign-off', 'Closure Certificate'] },
    { id: 'program-closure', title: 'Program Closure Content', icon: 'archive', description: 'Criteria and summary templates for closing entire programs.', items: ['Program Benefits Report', 'Consolidated Asset Register', 'Executive Sponsor Review'] },
    { id: 'lessons-learnt', title: 'Lessons Learnt Category', icon: 'book-open', description: 'Group lessons by domain.', items: ['Technical Execution', 'Procurement & Legal', 'Resource Management', 'Scope & Timeline'], needsAttention: true },
    { id: 'closure-reasons', title: 'Reasons for Closure', icon: 'x-circle', description: 'Allowed closure grounds.', items: ['Successful Delivery', 'Budget Exhaustion', 'Strategic Alignment Shift', 'Cancelled by Sponsor'] }
  ];

  benefitsConfigCards: TaxonomyCard[] = [
    { id: 'benefits-categories', title: 'Benefits Type & Categories', icon: 'trending-up', description: 'Financial and non-financial category rules.', items: ['Revenue Growth', 'Cost Reduction', 'Process Efficiency', 'Risk Mitigation', 'Regulatory Compliance'] }
  ];

  workflowCards: TaxonomyCard[] = [
    { id: 'program-plan', title: 'Program Plan', icon: 'sliders', description: 'Configure and manage stage-gate workflows for program planning.', items: ['Phase 1: Initiation', 'Phase 2: Planning & Setup', 'Phase 3: Active Monitoring', 'Phase 4: Stage Gate Review', 'Phase 5: Closure'] }
  ];

  isCreatingWorkflow = false;
  workflowType = '';
  workflowApplicability = '';
  workflowTypes = ['Type 1', 'Type 2', 'Type 3'];
  workflowApplicabilityOptions = [
    'All projects',
    'Standalone project within a portfolio',
    'Project within a program',
    'Project without a program or portfolio'
  ];

  get currentApplicabilityOptions(): string[] {
    if (this.workflowType === 'Type 2') {
      return ['All projects', 'Standalone project within a portfolio'];
    } else if (this.workflowType === 'Type 3') {
      return ['All projects', 'Project within a program'];
    }
    return this.workflowApplicabilityOptions;
  }

  isAddingWorkflowStep = false;
  workflowSteps: any[] = [];
  newStepName = '';
  newStepMandatory = false;
  newStepRejectAction = 'restart';
  newStepAiComponent = 'not_required';
  newStepExpandedIndex = -1;

  emailAccordionOpen: string = '';

  availableRoles = ['Project Manager', 'Project Sponsor', 'PMO Contact', 'Delivery Manager', 'Initiator(Author)'];
  approvedSelectedRoles: string[] = [];
  rejectedSelectedRoles: string[] = [];
  isApprovedDropdownOpen = false;
  isRejectedDropdownOpen = false;

  editingWorkflowId: string | null = null;
  editingStepIndex: number | null = null;

  addNewWorkflow(): void {
    this.isCreatingWorkflow = true;
    this.editingWorkflowId = null;
    this.workflowType = '';
    this.workflowApplicability = '';
    this.workflowSteps = [];
    this.isAddingWorkflowStep = false;
    this.editingStepIndex = null;
    this.changeDetector.markForCheck();
  }

  closeWorkflowDrawer(): void {
    this.isCreatingWorkflow = false;
    this.editingWorkflowId = null;
    this.changeDetector.markForCheck();
  }

  openAddStepForm(): void {
    this.isAddingWorkflowStep = true;
    this.editingStepIndex = null;
    this.newStepName = '';
    this.newStepMandatory = false;
    this.newStepRejectAction = 'restart';
    this.newStepAiComponent = 'not_required';
    this.approvedSelectedRoles = [];
    this.rejectedSelectedRoles = [];
    this.isApprovedDropdownOpen = false;
    this.isRejectedDropdownOpen = false;
    this.changeDetector.markForCheck();
  }

  editWorkflowStep(index: number, event: Event): void {
    event.stopPropagation();
    const step = this.workflowSteps[index];
    this.newStepName = step.name;
    this.newStepMandatory = step.isMandatory || false;
    this.newStepRejectAction = step.rejectAction || 'restart';
    this.newStepAiComponent = step.aiComponent || 'not_required';
    this.approvedSelectedRoles = step.approvedRoles || [];
    this.rejectedSelectedRoles = step.rejectedRoles || [];
    this.isApprovedDropdownOpen = false;
    this.isRejectedDropdownOpen = false;
    this.editingStepIndex = index;
    this.isAddingWorkflowStep = true;
    this.newStepExpandedIndex = -1;
    this.changeDetector.markForCheck();
  }

  cancelAddStep(): void {
    this.isAddingWorkflowStep = false;
    this.editingStepIndex = null;
    this.changeDetector.markForCheck();
  }

  saveWorkflowStep(): void {
    if (!this.newStepName) return;
    
    const stepData = {
      name: this.newStepName,
      isMandatory: this.newStepMandatory,
      rejectAction: this.newStepRejectAction,
      aiComponent: this.newStepAiComponent,
      approvedRoles: [...this.approvedSelectedRoles],
      rejectedRoles: [...this.rejectedSelectedRoles]
    };

    if (this.editingStepIndex !== null) {
      this.workflowSteps[this.editingStepIndex] = stepData;
      this.newStepExpandedIndex = this.editingStepIndex;
    } else {
      this.workflowSteps.push(stepData);
      this.newStepExpandedIndex = this.workflowSteps.length - 1;
    }
    
    this.isAddingWorkflowStep = false;
    this.editingStepIndex = null;
    this.changeDetector.markForCheck();
  }

  toggleStepAccordion(index: number): void {
    if (this.newStepExpandedIndex === index) {
      this.newStepExpandedIndex = -1;
    } else {
      this.newStepExpandedIndex = index;
    }
    this.changeDetector.markForCheck();
  }

  toggleEmailAccordion(section: string): void {
    if (this.emailAccordionOpen === section) {
      this.emailAccordionOpen = '';
    } else {
      this.emailAccordionOpen = section;
    }
    this.changeDetector.markForCheck();
  }

  toggleRole(type: 'approved' | 'rejected', role: string): void {
    if (type === 'approved') {
      const index = this.approvedSelectedRoles.indexOf(role);
      if (index === -1) {
        this.approvedSelectedRoles.push(role);
      } else {
        this.approvedSelectedRoles.splice(index, 1);
      }
    } else {
      const index = this.rejectedSelectedRoles.indexOf(role);
      if (index === -1) {
        this.rejectedSelectedRoles.push(role);
      } else {
        this.rejectedSelectedRoles.splice(index, 1);
      }
    }
    this.changeDetector.markForCheck();
  }

  removeRole(type: 'approved' | 'rejected', role: string, event: Event): void {
    event.stopPropagation();
    if (type === 'approved') {
      this.approvedSelectedRoles = this.approvedSelectedRoles.filter(r => r !== role);
    } else {
      this.rejectedSelectedRoles = this.rejectedSelectedRoles.filter(r => r !== role);
    }
    this.changeDetector.markForCheck();
  }

  saveWorkflow(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (!this.workflowType || !this.workflowApplicability) return;

    if (this.editingWorkflowId) {
      const idx = this.workflowCards.findIndex(c => c.id === this.editingWorkflowId);
      if (idx !== -1) {
        this.workflowCards[idx].title = this.workflowType;
        this.workflowCards[idx].description = `Applicable for: ${this.workflowApplicability}`;
        this.workflowCards[idx].items = this.workflowSteps.map(s => s.name);
        this.workflowCards[idx].workflowStepsData = JSON.parse(JSON.stringify(this.workflowSteps));
      }
    } else {
      const nextId = `workflow-${this.workflowCards.length + 1}-${Date.now()}`;
      const newWorkflow: TaxonomyCard = {
        id: nextId,
        title: this.workflowType,
        icon: 'activity',
        description: `Applicable for: ${this.workflowApplicability}`,
        items: this.workflowSteps.map(s => s.name),
        workflowStepsData: JSON.parse(JSON.stringify(this.workflowSteps))
      };
      this.workflowCards = [...this.workflowCards, newWorkflow];
    }
    this.isCreatingWorkflow = false;
    this.editingWorkflowId = null;
    this.changeDetector.markForCheck();
  }

  // Governance category sidebar state
  activeGovernanceCategory = 'change-request';

  readonly governanceCategories = [
    { id: 'change-request', label: 'Change Request Management' },
    { id: 'stage-gate', label: 'Stage Gate Management' },
    { id: 'monitoring-reporting', label: 'Monitoring & Reporting' },
    { id: 'prioritization', label: 'Portfolio & Investment Prioritization' },
    { id: 'risk-management', label: 'Risk Management' }
  ];

  setGovernanceCategory(id: string): void {
    this.activeGovernanceCategory = id;
    this.changeDetector.markForCheck();
  }

  getGovernanceCategoryCount(id: string): number {
    switch (id) {
      case 'change-request': return this.changeRequestCards.length;
      case 'stage-gate': return this.stageGateCards.length;
      case 'monitoring-reporting': return this.monitoringReportingCards.length;
      case 'prioritization': return this.prioritizationCards.length;
      case 'risk-management': return this.riskManagementCards.length;
      default: return 0;
    }
  }

  // Governance & Controls Cards Data State
  changeRequestCards: TaxonomyCard[] = [
    { id: 'cr-trigger', title: 'Change Request Trigger', icon: 'zap', description: 'Configure triggers for launching change requests.', items: ['Budget Deviation > 10%', 'Schedule Delay > 2 Weeks', 'Scope Change Request'] },
    { id: 'cr-tolerance', title: 'Change Request Tolerance', icon: 'shield-alert', description: 'Set tolerance limits and threshold boundaries.', items: ['Green Tier (+/- 5%)', 'Amber Tier (+/- 10%)', 'Red Tier (> 10%)'] }
  ];

  stageGateCards: TaxonomyCard[] = [
    { id: 'stage-mgmt', title: 'Stage Management', icon: 'map', description: 'Define stage and gate parameters.', items: ['Discovery Stage', 'Initiation Stage', 'Execution Stage', 'Closure Stage'] },
    { id: 'gate-checklist', title: 'Stage Gate Checklist', icon: 'check-square', description: 'Set required deliverables for each gate review.', items: ['Project Brief Approved', 'Business Case Signed', 'PID Approved', 'Post Project Review'] }
  ];

  monitoringReportingCards: TaxonomyCard[] = [
    { id: 'report-freq', title: 'Report Frequency', icon: 'calendar', description: 'Define intervals for status and progress reports.', items: ['Weekly Status Report', 'Monthly PSR Report', 'Quarterly Review'] }
  ];

  prioritizationCards: TaxonomyCard[] = [
    { id: 'assess-framework', title: 'Assessment Framework', icon: 'activity', description: 'Set framework matrices for prioritising projects.', items: ['Strategic Alignment Rating', 'Financial NPV Scoring', 'Risk Severity Factor'] },
    { id: 'business-case-opt', title: 'Business Case Option', icon: 'file-text', description: 'Establish business case options guidelines.', items: ['Do Nothing Option', 'Minimum Viable Option', 'Preferred Option', 'Alternative Option'] }
  ];

  riskManagementCards: TaxonomyCard[] = [
    { id: 'risk-matrix', title: 'Matrix', icon: 'grid', description: 'Risk probability and impact matrix specifications.', items: ['5x5 Matrix Grid', '3x3 Matrix Grid', 'Weighted Severity Scoring'] },
    { id: 'risk-source', title: 'Source', icon: 'target', description: 'Classify categories of risk sources.', items: ['External Factors', 'Technical Capabilities', 'Procurement & Logistics', 'Resource Constraints'] },
    { id: 'risk-consequence', title: 'Consequence', icon: 'alert-triangle', description: 'Describe potential impacts of realized risks.', items: ['Severe Financial Loss', 'Project Delivery Delay', 'Reputational Damage', 'Compliance Failure'] },
    { id: 'risk-control', title: 'Control', icon: 'lock', description: 'Define risk controls and mitigations.', items: ['Peer Code Reviews', 'Weekly Stakeholder Syncs', 'Dual-site Backups', 'Third-party Auditing'] },
    { id: 'risk-control-eff', title: 'Control Effectiveness', icon: 'shield', description: 'Ratings for how effective controls are.', items: ['Highly Effective', 'Moderately Effective', 'Ineffective'] },
    { id: 'risk-control-rating', title: 'Control Rating', icon: 'star', description: 'Set quality assurance ratings for controls.', items: ['Satisfactory Control', 'Needs Improvement', 'Unsatisfactory Control'] },
    { id: 'risk-category', title: 'Category', icon: 'tag', description: 'Classify risk items into global categories.', items: ['Financial Risk', 'Operational Risk', 'Security Risk', 'Reputational Risk'] },
    { id: 'risk-treatment', title: 'Treatment Type', icon: 'heart', description: 'Define treatment options for identified risks.', items: ['Avoid Risk', 'Mitigate Risk', 'Transfer Risk', 'Accept Risk'] },
    { id: 'risk-user-access', title: 'User Access', icon: 'user-x', description: 'Configure access permissions for risk registers.', items: ['Portfolio Manager (Full Access)', 'Project Manager (Edit Owned)', 'Viewer (Read Only)'] },
    { id: 'risk-plan-library', title: 'Planning Library', icon: 'book', description: 'Manage mitigation guides and baseline documents.', items: ['Standard Security Checklist', 'Disaster Recovery Template', 'GDPR Compliance Guidelines'] }
  ];

  // Financial category sidebar state
  activeFinancialCategory = 'funding-sources';

  readonly financialCategories = [
    { id: 'funding-sources', label: 'Funding Sources' },
    { id: 'financial-cycle', label: 'Financial Cycle' }
  ];

  setFinancialCategory(id: string): void {
    this.activeFinancialCategory = id;
    this.changeDetector.markForCheck();
  }

  getFinancialCategoryCount(id: string): number {
    switch (id) {
      case 'funding-sources': return this.fundingSourcesCards.length;
      case 'financial-cycle': return this.financialCycleCards.length;
      default: return 0;
    }
  }

  // Financial & Budget Management Cards Data State
  fundingSourcesCards: TaxonomyCard[] = [
    { id: 'cost-centre', title: 'Cost Centre', icon: 'wallet', description: 'Define the cost centres for tracking department and team budgets.', items: ['Safe Security HQ', 'Product & Engineering', 'Global Sales', 'Marketing', 'Customer Success'] },
    { id: 'ongoing-cost', title: 'Ongoing Cost', icon: 'refresh-cw', description: 'Configure recurring operating and support expenses.', items: ['SaaS Subscriptions', 'Cloud Infrastructure', 'Consulting Fees', 'Hardware Maintenance'] },
    { id: 'budget-range', title: 'Budget Range', icon: 'sliders', description: 'Set standard funding thresholds and priority levels.', items: ['Micro (< $50k)', 'Small ($50k - $250k)', 'Medium ($250k - $1M)', 'Enterprise (> $1M)'] }
  ];

  financialCycleCards: TaxonomyCard[] = [
    { id: 'financial-cycle', title: 'Financial Cycle', icon: 'calendar', description: 'Establish financial accounting cycles and fiscal reporting periods.', items: ['FY26 Q1', 'FY26 Q2', 'FY26 Q3', 'FY26 Q4', 'FY27 Planning'] }
  ];

  // Drawer interaction state
  selectedCard: TaxonomyCard | null = null;
  selectedCardGroup = '';
  newDrawerItem = '';
  drawerMeasure = '';
  drawerOwner = 'Fatima Qahtani';
  drawerStatus = 'Active';

  openCardDrawer(card: TaxonomyCard, group: string): void {
    if (group === 'Workflow Designer') {
      this.isCreatingWorkflow = true;
      this.editingWorkflowId = card.id;
      this.workflowType = card.title;
      // Extract applicability from description, assuming format: "Applicable for: X"
      const descMatch = card.description.match(/Applicable for: (.*)/);
      this.workflowApplicability = descMatch ? descMatch[1] : '';
      
      // Load steps if present, otherwise fallback to mapping string items
      if (card.workflowStepsData) {
        this.workflowSteps = JSON.parse(JSON.stringify(card.workflowStepsData));
      } else {
        this.workflowSteps = card.items.map(itemName => ({
          name: itemName,
          isMandatory: false,
          rejectAction: 'restart',
          aiComponent: 'not_required'
        }));
      }

      this.isAddingWorkflowStep = false;
      this.editingStepIndex = null;
      this.changeDetector.markForCheck();
      return;
    }

    this.selectedCard = JSON.parse(JSON.stringify(card));
    this.selectedCardGroup = group;
    this.newDrawerItem = '';
    this.drawerMeasure = '';
    this.drawerOwner = 'Fatima Qahtani';
    this.drawerStatus = 'Active';
    this.newPriorityName = '';
    this.editingPriorityIndex = null;
    this.editingPriorityValue = '';
    this.changeDetector.markForCheck();
  }

  closeDrawer(): void {
    this.selectedCard = null;
    this.changeDetector.markForCheck();
  }

  removeDrawerItem(index: number): void {
    if (this.selectedCard) {
      this.selectedCard.items = this.selectedCard.items.filter((_, i) => i !== index);
      this.changeDetector.markForCheck();
    }
  }

  saveDrawer(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (!this.selectedCard) return;

    const val = this.newDrawerItem.trim();
    if (val) {
      this.selectedCard.items = [...this.selectedCard.items, val];
      this.newDrawerItem = '';
    }

    const cardId = this.selectedCard.id;
    let found = false;

    let idx = this.projectSetupCards.findIndex(c => c.id === cardId);
    if (idx !== -1) {
      this.projectSetupCards[idx].items = [...this.selectedCard.items];
      found = true;
    }

    if (!found) {
      idx = this.projectPlanningCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.projectPlanningCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.projectClosureCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.projectClosureCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.benefitsConfigCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.benefitsConfigCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.workflowCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.workflowCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.changeRequestCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.changeRequestCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.stageGateCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.stageGateCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.monitoringReportingCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.monitoringReportingCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.prioritizationCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.prioritizationCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.riskManagementCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.riskManagementCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.fundingSourcesCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.fundingSourcesCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    if (!found) {
      idx = this.financialCycleCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        this.financialCycleCards[idx].items = [...this.selectedCard.items];
        found = true;
      }
    }

    this.selectedCard = null;
    this.changeDetector.markForCheck();
  }

  // Priority Editor Specific State
  newPriorityName = '';
  editingPriorityIndex: number | null = null;
  editingPriorityValue = '';
  searchQuery = '';
  activeActionMenuIndex: number | null = null;

  getFilteredPriorities(): string[] {
    if (!this.selectedCard) return [];
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.selectedCard.items;
    return this.selectedCard.items.filter(item => item.toLowerCase().includes(q));
  }

  toggleActionMenu(event: Event, index: number): void {
    event.stopPropagation();
    this.activeActionMenuIndex = this.activeActionMenuIndex === index ? null : index;
    this.changeDetector.markForCheck();
  }

  triggerEditRow(index: number, item: string): void {
    this.activeActionMenuIndex = null;
    this.startEditPriority(index, item);
  }

  triggerDeleteRow(item: string): void {
    this.activeActionMenuIndex = null;
    if (this.selectedCard) {
      const idx = this.selectedCard.items.indexOf(item);
      if (idx !== -1) {
        this.deletePriorityItem(idx);
      }
    }
  }

  addPriorityItem(): void {
    const val = this.newPriorityName.trim();
    if (val && this.selectedCard) {
      this.selectedCard.items = [...this.selectedCard.items, val];
      this.newPriorityName = '';
      
      // Update parent list
      const idx = this.projectSetupCards.findIndex(c => c.id === 'priority');
      if (idx !== -1) {
        this.projectSetupCards[idx].items = [...this.selectedCard.items];
      }
      this.changeDetector.markForCheck();
    }
  }

  deletePriorityItem(index: number): void {
    if (this.selectedCard) {
      this.selectedCard.items = this.selectedCard.items.filter((_, i) => i !== index);
      
      // Update parent list
      const idx = this.projectSetupCards.findIndex(c => c.id === 'priority');
      if (idx !== -1) {
        this.projectSetupCards[idx].items = [...this.selectedCard.items];
      }
      this.changeDetector.markForCheck();
    }
  }

  startEditPriority(index: number, val: string): void {
    this.editingPriorityIndex = index;
    this.editingPriorityValue = val;
    this.changeDetector.markForCheck();
  }

  saveEditPriority(index: number): void {
    const val = this.editingPriorityValue.trim();
    if (val && this.selectedCard) {
      this.selectedCard.items[index] = val;
      this.selectedCard.items = [...this.selectedCard.items];
      this.editingPriorityIndex = null;
      this.editingPriorityValue = '';
      
      // Update parent list
      const idx = this.projectSetupCards.findIndex(c => c.id === 'priority');
      if (idx !== -1) {
        this.projectSetupCards[idx].items = [...this.selectedCard.items];
      }
      this.changeDetector.markForCheck();
    }
  }

  cancelEditPriority(): void {
    this.editingPriorityIndex = null;
    this.editingPriorityValue = '';
    this.changeDetector.markForCheck();
  }

  tabs: PmConsoleModeTabItem[] = [
    { id: 'org-structure', label: 'Organisational Structure', icon: 'git-branch', widthPx: 216 },
    { id: 'user-management', label: 'User Management', icon: 'users', widthPx: 156 },
    { id: 'workflow-designer', label: 'Workflow Designer', icon: 'activity', widthPx: 166 },
    { id: 'standards', label: 'Standards & Taxonomies', icon: 'book-open', widthPx: 196 },
    { id: 'governance', label: 'Governance & Controls', icon: 'shield', widthPx: 186 },
    { id: 'financial', label: 'Financial & Budget Management', icon: 'wallet', widthPx: 236 },
    { id: 'glossary', label: 'Glossary', icon: 'list', widthPx: 116 }
  ];

  isAddingDivision = false;
  isAddingBrand = false;
  isAddingSection = false;

  newDivisionName = '';
  newBrandName = '';
  newSectionName = '';

  selectedGroupIndex = 0;
  groups: string[] = [];
  divisions: string[] = [];
  brands: string[] = [];
  sections: string[] = [];
  
  openGroupMenuIndex: number | null = null;
  openDivisionIndex: { groupIndex: number; divisionIndex: number } | null = null;
  openBranchIndex: { groupIndex: number; divisionIndex: number; branchIndex: number } | null = null;
  openSectionIndex: { groupIndex: number; divisionIndex: number; branchIndex: number; sectionIndex: number } | null = null;

  isAddingGroup = false;
  editingGroupIndex: number | null = null;
  newGroupName = '';
  newGroupOwner = '';
  newGroupPurpose = '';
  newGroupEnvFactors = '';

  // User Management Drawer
  isAddingUser = false;
  openUserMenuIndex: number | null = null;
  editingUserIndex: number | null = null;
  drawerUsername = '';
  drawerFirstName = '';
  drawerLastName = '';
  drawerUserRole = '';
  drawerLoginAccess = false;
  drawerEmailNotification: 'yes' | 'no' = 'yes';
  drawerGroup = 'Asset Management';
  drawerDivision = 'All';
  drawerBranch = 'All';
  drawerSection = 'All';

  // Change Password Drawer
  isChangingPassword = false;
  changePasswordUserIndex: number | null = null;
  drawerNewPassword = '';
  drawerConfirmPassword = '';

  maxUsers = 10;

  users: Array<{
    name: string;
    username: string;
    role: string;
    email: string;
    businessUnit: string;
    loginAccess: 'Enabled' | 'Disabled';
    lastLogin?: string;
  }> = [];

  constructor(private readonly changeDetector: ChangeDetectorRef) { }

  setSection(id: string): void {
    this.activeSectionId = id;
    this.changeDetector.markForCheck();
  }

  getActiveSectionLabel(): string {
    const sec = this.tabs.find(s => s.id === this.activeSectionId);
    return sec ? sec.label : 'Framework Configuration';
  }

  // Group Sidedrawer Actions
  openAddGroupDrawer(): void {
    this.editingGroupIndex = null;
    this.isAddingGroup = true;
    this.newGroupName = '';
    this.newGroupOwner = '';
    this.newGroupPurpose = '';
    this.newGroupEnvFactors = '';
    this.changeDetector.markForCheck();
  }

  openEditGroupDrawer(index: number): void {
    this.editingGroupIndex = index;
    const group = this.groupObjects[index];
    this.newGroupName = group.name;
    this.newGroupOwner = group.owner || '';
    this.newGroupPurpose = group.purpose || '';
    this.newGroupEnvFactors = group.environmentFactors || '';
    this.isAddingGroup = true;
    this.changeDetector.markForCheck();
  }

  closeAddGroupDrawer(): void {
    this.isAddingGroup = false;
    this.editingGroupIndex = null;
    this.changeDetector.markForCheck();
  }

  saveGroup(): void {
    const val = this.newGroupName.trim();
    if (val) {
      if (this.editingGroupIndex !== null) {
        const group = this.groupObjects[this.editingGroupIndex];
        group.name = val;
        group.owner = this.newGroupOwner;
        group.purpose = this.newGroupPurpose;
        group.environmentFactors = this.newGroupEnvFactors;
        this.syncLegacyArrays();
      } else {
        this.groupObjects = [...this.groupObjects, {
          name: val,
          owner: this.newGroupOwner,
          purpose: this.newGroupPurpose,
          environmentFactors: this.newGroupEnvFactors,
          divisions: []
        }];
        this.selectedGroupIndex = this.groupObjects.length - 1;
        this.syncLegacyArrays();
      }
    }
    this.isAddingGroup = false;
    this.editingGroupIndex = null;
  }

  removeGroup(index: number): void {
    this.groupObjects = this.groupObjects.filter((_, i) => i !== index);
    if (this.selectedGroupIndex >= this.groupObjects.length) {
      this.selectedGroupIndex = Math.max(0, this.groupObjects.length - 1);
    }
    this.syncLegacyArrays();
  }

  selectGroup(index: number): void {
    this.selectedGroupIndex = index;
    this.changeDetector.markForCheck();
  }

  toggleGroupMenu(event: Event, index: number): void {
    event.stopPropagation();
    this.openGroupMenuIndex = this.openGroupMenuIndex === index ? null : index;
    this.openDivisionIndex = null;
    this.openBranchIndex = null;
    this.openSectionIndex = null;
    this.changeDetector.markForCheck();
  }

  // Division Actions
  addDivisionCard(): void {
    this.openAddGroupDrawer();
  }

  addDivisionToGroup(groupIndex: number): void {
    const group = this.groupObjects[groupIndex];
    const nextNum = group.divisions.length + 1;
    group.divisions = [...group.divisions, { name: `Division #${nextNum}`, branches: [] }];
    this.syncLegacyArrays();
  }

  removeDivision(groupIndex: number, divisionIndex: number): void {
    const group = this.groupObjects[groupIndex];
    group.divisions = group.divisions.filter((_, idx) => idx !== divisionIndex);
    this.syncLegacyArrays();
  }

  toggleDivisionMenu(event: Event, groupIndex: number, divisionIndex: number): void {
    event.stopPropagation();
    this.openGroupMenuIndex = null;
    this.openBranchIndex = null;
    this.openSectionIndex = null;
    if (this.openDivisionIndex && this.openDivisionIndex.groupIndex === groupIndex && this.openDivisionIndex.divisionIndex === divisionIndex) {
      this.openDivisionIndex = null;
    } else {
      this.openDivisionIndex = { groupIndex, divisionIndex };
    }
    this.changeDetector.markForCheck();
  }

  editDivision(groupIndex: number, divisionIndex: number): void {
    this.openDivisionIndex = null;
    setTimeout(() => {
      const inputEl = document.getElementById(`org-division-input-${groupIndex}-${divisionIndex}`) as HTMLInputElement | null;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
    }, 50);
    this.changeDetector.markForCheck();
  }

  // Branch Actions
  addBranch(groupIndex: number, divisionIndex: number): void {
    const div = this.groupObjects[groupIndex].divisions[divisionIndex];
    const nextNum = div.branches.length + 1;
    div.branches = [...div.branches, { name: `Branch #${nextNum}`, sections: [] }];
    this.syncLegacyArrays();
  }

  removeBranch(groupIndex: number, divisionIndex: number, branchIndex: number): void {
    const div = this.groupObjects[groupIndex].divisions[divisionIndex];
    div.branches = div.branches.filter((_, idx) => idx !== branchIndex);
    this.syncLegacyArrays();
  }

  toggleBranchMenu(event: Event, groupIndex: number, divisionIndex: number, branchIndex: number): void {
    event.stopPropagation();
    this.openGroupMenuIndex = null;
    this.openDivisionIndex = null;
    this.openSectionIndex = null;
    if (this.openBranchIndex && 
        this.openBranchIndex.groupIndex === groupIndex && 
        this.openBranchIndex.divisionIndex === divisionIndex && 
        this.openBranchIndex.branchIndex === branchIndex) {
      this.openBranchIndex = null;
    } else {
      this.openBranchIndex = { groupIndex, divisionIndex, branchIndex };
    }
    this.changeDetector.markForCheck();
  }

  // Section Actions
  addSection(groupIndex: number, divisionIndex: number, branchIndex: number): void {
    const branch = this.groupObjects[groupIndex].divisions[divisionIndex].branches[branchIndex];
    const nextNum = branch.sections.length + 1;
    branch.sections = [...branch.sections, { name: `Section #${nextNum}` }];
    this.syncLegacyArrays();
  }

  removeSection(groupIndex: number, divisionIndex: number, branchIndex: number, sectionIndex: number): void {
    const branch = this.groupObjects[groupIndex].divisions[divisionIndex].branches[branchIndex];
    branch.sections = branch.sections.filter((_, idx) => idx !== sectionIndex);
    this.syncLegacyArrays();
  }

  toggleSectionMenu(event: Event, groupIndex: number, divisionIndex: number, branchIndex: number, sectionIndex: number): void {
    event.stopPropagation();
    this.openGroupMenuIndex = null;
    this.openDivisionIndex = null;
    this.openBranchIndex = null;
    if (this.openSectionIndex && 
        this.openSectionIndex.groupIndex === groupIndex && 
        this.openSectionIndex.divisionIndex === divisionIndex && 
        this.openSectionIndex.branchIndex === branchIndex && 
        this.openSectionIndex.sectionIndex === sectionIndex) {
      this.openSectionIndex = null;
    } else {
      this.openSectionIndex = { groupIndex, divisionIndex, branchIndex, sectionIndex };
    }
    this.changeDetector.markForCheck();
  }

  // Synchronisation
  syncLegacyArrays(): void {
    const groupList: string[] = [];
    const divisionList: string[] = [];
    const brandList: string[] = [];
    const sectionList: string[] = [];
    for (const group of this.groupObjects) {
      if (group.name.trim() !== '') {
        groupList.push(group.name);
      }
      for (const div of group.divisions) {
        if (div.name.trim() !== '') {
          divisionList.push(div.name);
        }
        for (const br of div.branches) {
          if (br.name.trim() !== '') {
            brandList.push(br.name);
          }
          for (const sec of br.sections) {
            if (sec.name.trim() !== '') {
              sectionList.push(sec.name);
            }
          }
        }
      }
    }
    this.groups = groupList;
    this.divisions = divisionList;
    this.brands = brandList;
    this.sections = sectionList;
    this.changeDetector.markForCheck();
  }

  startAddDivision(): void {
    this.isAddingDivision = true;
    this.newDivisionName = '';
    this.changeDetector.markForCheck();
  }

  addDivision(): void {
    const val = this.newDivisionName.trim();
    if (val && this.groupObjects.length > 0) {
      this.groupObjects[0].divisions = [...this.groupObjects[0].divisions, { name: val, branches: [] }];
      this.syncLegacyArrays();
    }
    this.isAddingDivision = false;
    this.newDivisionName = '';
    this.changeDetector.markForCheck();
  }

  startAddBrand(): void {
    this.isAddingBrand = true;
    this.newBrandName = '';
    this.changeDetector.markForCheck();
  }

  addBrand(): void {
    const val = this.newBrandName.trim();
    if (val) {
      this.brands = [...this.brands, val];
    }
    this.isAddingBrand = false;
    this.newBrandName = '';
    this.changeDetector.markForCheck();
  }

  removeBrand(index: number): void {
    this.brands = this.brands.filter((_, i) => i !== index);
    this.changeDetector.markForCheck();
  }



  // User Management Methods
  openAddUserForm(): void {
    this.editingUserIndex = null;
    this.drawerUsername = '';
    this.drawerFirstName = '';
    this.drawerLastName = '';
    this.drawerUserRole = '';
    this.drawerLoginAccess = false;
    this.drawerEmailNotification = 'yes';
    this.drawerGroup = 'Asset Management';
    this.drawerDivision = 'All';
    this.drawerBranch = 'All';
    this.drawerSection = 'All';
    this.isAddingUser = true;
    this.changeDetector.markForCheck();
  }

  openEditUserForm(index: number): void {
    const user = this.users[index];
    if (!user) return;
    this.editingUserIndex = index;

    // Split name into first and last name
    const nameParts = (user.name || '').trim().split(/\s+/);
    this.drawerFirstName = nameParts[0] || '';
    this.drawerLastName = nameParts.slice(1).join(' ') || '';

    this.drawerUsername = user.username || '';
    this.drawerUserRole = user.role || '';
    this.drawerLoginAccess = user.loginAccess === 'Enabled';
    this.drawerEmailNotification = 'yes';
    this.drawerGroup = user.businessUnit || 'Asset Management';
    this.drawerDivision = 'All';
    this.drawerBranch = 'All';
    this.drawerSection = 'All';

    this.isAddingUser = true;
    this.closeUserMenu();
  }

  closeAddUserDrawer(): void {
    this.isAddingUser = false;
    this.editingUserIndex = null;
    this.changeDetector.markForCheck();
  }

  addUser(): void {
    const firstName = this.drawerFirstName.trim();
    const lastName = this.drawerLastName.trim();
    const username = this.drawerUsername.trim();
    const role = this.drawerUserRole.trim() || 'Team Member';
    const name = [firstName, lastName].filter(Boolean).join(' ') || username;
    const loginAccess: 'Enabled' | 'Disabled' = this.drawerLoginAccess ? 'Enabled' : 'Disabled';

    if (username) {
      if (this.editingUserIndex !== null) {
        // Edit existing user
        const updatedUsers = [...this.users];
        updatedUsers[this.editingUserIndex] = {
          ...updatedUsers[this.editingUserIndex],
          name,
          username,
          role,
          email: username,
          businessUnit: this.drawerGroup,
          loginAccess
        };
        this.users = updatedUsers;
      } else {
        // Add new user
        this.users = [...this.users, {
          name,
          username,
          role,
          email: username,
          businessUnit: this.drawerGroup,
          loginAccess
        }];
      }
    }

    this.isAddingUser = false;
    this.editingUserIndex = null;
    this.changeDetector.markForCheck();
  }

  openChangePasswordForm(index: number): void {
    const user = this.users[index];
    if (!user) return;
    this.changePasswordUserIndex = index;
    this.drawerNewPassword = '';
    this.drawerConfirmPassword = '';
    this.isChangingPassword = true;
    this.closeUserMenu();
  }

  closeChangePasswordDrawer(): void {
    this.isChangingPassword = false;
    this.changePasswordUserIndex = null;
    this.changeDetector.markForCheck();
  }

  changePassword(): void {
    const newPass = this.drawerNewPassword.trim();
    const confPass = this.drawerConfirmPassword.trim();
    if (!newPass || newPass !== confPass) {
      alert('Passwords do not match or are empty.');
      return;
    }
    // Simulate successful password update
    this.isChangingPassword = false;
    this.changePasswordUserIndex = null;
    this.changeDetector.markForCheck();
  }

  removeUser(index: number): void {
    if (confirm('Are you sure?')) {
      this.users = this.users.filter((_, i) => i !== index);
      if (this.openUserMenuIndex === index) this.openUserMenuIndex = null;
      this.changeDetector.markForCheck();
    }
  }

  toggleUserMenu(event: Event, index: number): void {
    event.stopPropagation();
    this.openUserMenuIndex = this.openUserMenuIndex === index ? null : index;
    this.changeDetector.markForCheck();
  }

  closeUserMenu(): void {
    this.openUserMenuIndex = null;
    this.changeDetector.markForCheck();
  }

  @HostListener('click')
  onHostClick(): void {
    if (this.openUserMenuIndex !== null) {
      this.openUserMenuIndex = null;
      this.changeDetector.markForCheck();
    }
  }

  exportUsers(): void {
    if (this.users.length === 0) return;
    const headers = ['Name', 'User Name', 'Role(s)', 'Email', 'Business Unit', 'Login Access', 'Last Login'];
    const rows = this.users.map(u => [
      u.name, u.username, u.role, u.email, u.businessUnit, u.loginAccess, u.lastLogin ?? ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  getCardItemsPreview(items: string[]): string {
    if (!items || items.length === 0) return '';
    if (items.length <= 3) return items.join(', ');
    return `${items.slice(0, 3).join(', ')} .. ${items.length - 3} more`;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}


