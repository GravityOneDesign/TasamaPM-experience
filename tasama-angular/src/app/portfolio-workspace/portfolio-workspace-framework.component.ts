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
  workflowType?: string;
  workflowApplicability?: string;
}

export interface ReportFreqRow {
  id: string;
  name: string;
  type: 'portfolio' | 'program' | 'project';
  parentProgram?: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  dueOnDays: number;
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
    <main class="portfolio-workspace-body" style="grid-row: 2; overflow-y: auto; background: #ffffff; padding: 12px 24px 24px 24px; display: flex; flex-direction: column;">
      
      @if (activeSectionId === 'user-management') {
        <div class="user-management-container animation-fade">
          <div class="user-management-header">
            <div class="user-title-group">
              <h2>User Management</h2>
              <p>Configure team members, access roles, and system permission levels.</p>
            </div>
          </div>

          <!-- Metrics Cards Row -->
          <div class="user-metrics-row">
            <!-- Active Users Card -->
            <div class="user-metric-card">
              <div class="metric-icon-wrap blue">
                <span pmConsoleIcon="users" class="metric-icon"></span>
              </div>
              <div class="metric-info">
                <span class="metric-label">Total Active Users</span>
                <span class="metric-count">{{ getActiveUsersCount() }}</span>
              </div>
            </div>

            <!-- Available Licences Card -->
            <div class="user-metric-card">
              <div class="metric-icon-wrap grey">
                <span pmConsoleIcon="key" class="metric-icon"></span>
              </div>
              <div class="metric-info">
                <span class="metric-label">Total Available Licences</span>
                <span class="metric-count">{{ availableLicences }}</span>
              </div>
            </div>
          </div>

          <!-- Actions Row Below Cards -->
          <div class="user-actions-row">
            <button class="export-btn" type="button" (click)="exportUsers()">
              <span pmConsoleIcon="download"></span>
              <span>Export</span>
            </button>
            <button class="add-user-btn" type="button" (click)="openAddUserForm()">
              <span pmConsoleIcon="plus"></span>
              <span>Request new license</span>
            </button>
          </div>

          <!-- Add User Side Drawer (uses platform-standard shell) -->
          @if (isAddingUser) {
            <app-pm-console-plan-drawer
              eyebrow="USER MANAGEMENT"
              [title]="editingUserIndex !== null ? 'Edit user details' : 'Request new license'"
              description="Manage and configure user access and controls"
              [submitLabel]="editingUserIndex !== null ? 'Save' : 'Send request'"
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
                  <th style="width: 24%;">Name</th>
                  <th style="width: 16%;">Role(s)</th>
                  <th style="width: 19%;">Email</th>
                  <th style="width: 19%;">Business Unit</th>
                  <th style="width: 11%;">Login Access</th>
                  <th style="width: 11%;">Last Login</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @if (users.length > 0) {
                  @for (user of users; track user.username; let i = $index) {
                    <tr class="animation-slide-in">
                      <td>
                        <div class="user-avatar-info">
                          <div [class]="'avatar-circle ' + getRoleBadgeClass(user.role)">{{ getInitials(user.name) }}</div>
                          <span class="user-avatar-name">{{ user.name }}</span>
                        </div>
                      </td>
                      <td>
                        <span [class]="'role-badge ' + getRoleBadgeClass(user.role)">{{ user.role }}</span>
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
                            aria-label="Actions"
                            (click)="toggleUserMenu($event, i)"
                          >
                            <span pmConsoleIcon="more-vertical"></span>
                          </button>

                          @if (openUserMenuIndex === i) {
                            <div class="user-action-menu" role="menu">
                              <button class="user-action-item" type="button" role="menuitem" (click)="openEditUserForm(i)">Edit</button>
                              <button class="user-action-item" type="button" role="menuitem" (click)="removeUser(i); closeUserMenu()">Delete</button>
                              <button class="user-action-item" type="button" role="menuitem" (click)="closeUserMenu()">Swap User</button>
                              <button class="user-action-item" type="button" role="menuitem" (click)="openChangePasswordForm(i)">Change Password</button>
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                } @else {
                  <tr>
                    <td colspan="7" class="table-empty-cell">">
                      <div class="table-empty-container">
                        <span pmConsoleIcon="users" class="table-empty-icon"></span>
                        <h4>No Users Configured</h4>
                        <p>Get started by adding system members and defining their workspace roles.</p>
                        <button class="empty-add-user-btn" type="button" (click)="openAddUserForm()">
                          <span pmConsoleIcon="plus"></span>
                          <span>Request new license</span>
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
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            } @else if (activeGovernanceCategory === 'monitoring-reporting') {
              <div class="animation-fade" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
                <!-- Customisation indicator banner (Option B) -->
                <div style="display: flex; align-items: center; gap: 10px; background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px 16px; border-radius: 8px; font-family: Montserrat, -apple-system, sans-serif;">
                  <span [pmConsoleIcon]="'info'" style="font-size: 18px; color: #1d4ed8; flex-shrink: 0;"></span>
                  <span style="font-size: 13px; color: #1e40af; font-weight: 500; line-height: 1.4;">
                    Cards in this section allow per-project and per-program customisations. Other tabs configure global defaults.
                  </span>
                </div>

                <div class="standards-grid" style="margin-top: 0px;">
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
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
                </div>
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
                  <h2 style="font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 6px 0; font-family: inherit;">{{ glossaryHeaderTitle }}</h2>
                  <p style="font-size: 13.5px; color: #64748b; margin: 0; line-height: 1.5;">{{ glossaryHeaderDescription }}</p>
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
                      <th style="width: 25%; background: #fbfcff; color: #555555; font-weight: 600; padding: 15px 14px; border-bottom: 1px solid #eceef3; font-size: 12px; text-align: left;">{{ glossarySystemLabelHeader }}</th>
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

    <!-- Dedicated Reporting Frequency side drawer -->
    @if (isReportFreqDrawerOpen) {
      <app-pm-console-plan-drawer
        eyebrow="MONITORING & REPORTING"
        title="Reporting Frequency"
        description="View and customise reporting intervals and due dates for all portfolio items."
        cancelLabel="Cancel"
        [hideFooter]="true"
        (close)="closeReportFreqDrawer()"
      >
        <div planDrawerBody class="standards-drawer-body" style="padding: 0 0 24px 0; display: flex; flex-direction: column; gap: 16px; font-family: Montserrat, -apple-system, sans-serif;">
          <!-- Top bar with filters and counts -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; width: 100%;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <!-- Grouped Entity picker -->
              <div class="rf-picker-container" (click)="$event.stopPropagation()">
                <button type="button" 
                        class="rf-picker-pill" 
                        [class.active]="reportFreqFilterEntity !== 'all'"
                        (click)="toggleReportFreqPicker($event)">
                  <span [pmConsoleIcon]="'grid'" style="font-size: 14px;"></span>
                  <span>{{ reportFreqFilterEntity === 'all' ? 'All programs & projects' : reportFreqFilterEntity }}</span>
                  <span [pmConsoleIcon]="'chevron-down'" style="font-size: 12px; margin-left: 2px;"></span>
                </button>

                @if (isReportFreqPickerOpen) {
                  <div class="rf-picker-dropdown">
                    <div class="rf-picker-search">
                      <span [pmConsoleIcon]="'search'" style="font-size: 12px; color: #64748b;"></span>
                      <input type="text" 
                             class="rf-picker-search-input" 
                             placeholder="Search programs or projects..."
                             [(ngModel)]="reportFreqSearchQuery"
                             (click)="$event.stopPropagation()" />
                    </div>
                    <div class="rf-picker-list">
                      <div class="rf-picker-all-row" 
                           [class.selected]="reportFreqFilterEntity === 'all'"
                           (click)="selectReportFreqEntity('all')">
                        All programs & projects
                      </div>
                      
                      <!-- Programs Group -->
                      @if (getFilteredProgramsForPicker().length > 0) {
                        <div class="rf-picker-group-header">Programs</div>
                        @for (prog of getFilteredProgramsForPicker(); track prog.name) {
                          <div class="rf-picker-item" 
                               [class.selected]="reportFreqFilterEntity === prog.name"
                               (click)="selectReportFreqEntity(prog.name)">
                            <span>{{ prog.name }}</span>
                            <span class="rf-picker-item-sub">{{ prog.projectCount }} project(s)</span>
                          </div>
                        }
                      }

                      <!-- Projects Group -->
                      @if (getFilteredProjectsForPicker().length > 0) {
                        <div class="rf-picker-group-header">Projects</div>
                        @for (proj of getFilteredProjectsForPicker(); track proj.name) {
                          <div class="rf-picker-item" 
                               [class.selected]="reportFreqFilterEntity === proj.name"
                               (click)="selectReportFreqEntity(proj.name)">
                            <span>{{ proj.name }}</span>
                          </div>
                        }
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Frequency Filter Pill -->
              <select class="rf-freq-select" 
                      [(ngModel)]="reportFreqFilterFreq" 
                      (change)="changeDetector.markForCheck()">
                <option value="all">All frequencies</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>

            <!-- Item Count Label -->
            <div style="font-size: 13.5px; font-weight: 500; color: #475569;">
              Showing {{ getFilteredReportFreqRows().length }} of {{ reportFreqRows.length }} items
            </div>
          </div>

          <!-- Table Container -->
          <div class="priority-table-wrapper" style="margin-top: 4px;">
            <table class="priority-table">
              <thead>
                <tr>
                  <th style="width: 32%;">Item</th>
                  <th style="width: 18%;">Type</th>
                  <th style="width: 20%;">Report Frequency</th>
                  <th style="width: 20%;">Report Due (Days)</th>
                  <th style="width: 10%; text-align: center;">Edit</th>
                </tr>
              </thead>
              <tbody>
                @if (getFilteredReportFreqRows().length === 0) {
                  <tr>
                    <td colspan="5" style="text-align: center; color: #64748b; padding: 24px;">
                      No items match the selected filters.
                    </td>
                  </tr>
                } @else {
                  @for (row of getFilteredReportFreqRows(); track row.id) {
                    <tr>
                      <!-- Column 1: Item Name (light font weight, truncated, hover full name) -->
                      <td [attr.title]="row.name">
                        <span style="font-weight: 300; color: #0b0b0b; font-size: 13.5px;">
                          {{ row.name.length > 22 ? (row.name | slice:0:20) + '...' : row.name }}
                        </span>
                      </td>

                      <!-- Column 2: Type Chip to the right of Name -->
                      <td>
                        <span class="rf-chip" 
                              [class.rf-chip-portfolio]="row.type === 'portfolio'"
                              [class.rf-chip-program]="row.type === 'program'"
                              [class.rf-chip-project]="row.type === 'project'">
                          {{ row.type === 'portfolio' ? 'Portfolio' : row.type === 'program' ? 'Program' : 'Project' }}
                        </span>
                      </td>

                      <!-- Column 3: Report Frequency -->
                      <td>
                        @if (reportFreqEditingRowId === row.id) {
                          <select class="rf-table-select" [(ngModel)]="reportFreqEditFrequency">
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Annually">Annually</option>
                          </select>
                        } @else {
                          <span style="color: #2f2f2f;">{{ row.frequency }}</span>
                        }
                      </td>

                      <!-- Column 4: Report Due (Days After Cycle End) -->
                      <td>
                        @if (reportFreqEditingRowId === row.id) {
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="number" 
                                   class="rf-due-input" 
                                   min="1" 
                                   max="30" 
                                   [(ngModel)]="reportFreqEditDueOnDays" />
                            <span style="font-size: 11px; color: #64748b;">days</span>
                          </div>
                        } @else {
                          <span style="color: #2f2f2f;">{{ row.dueOnDays }} days</span>
                        }
                      </td>

                      <!-- Column 5: Actions (Remove stroke container around edit icon) -->
                      <td style="text-align: center;">
                        @if (reportFreqEditingRowId === row.id) {
                          <div style="display: inline-flex; gap: 6px; justify-content: center;">
                            <button type="button" 
                                    class="rf-save-btn" 
                                    (click)="saveReportFreqRow(row.id)" 
                                    title="Save">
                              <span [pmConsoleIcon]="'check'"></span>
                            </button>
                            <button type="button" 
                                    class="rf-cancel-btn" 
                                    (click)="cancelReportFreqEdit()" 
                                    title="Cancel">
                              <span [pmConsoleIcon]="'x'"></span>
                            </button>
                          </div>
                        } @else {
                          <button type="button" 
                                  class="rf-edit-btn" 
                                  (click)="startEditReportFreqRow(row)" 
                                  title="Edit">
                            <span [pmConsoleIcon]="'edit-2'"></span>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        </div>
      </app-pm-console-plan-drawer>
    }



    <!-- Interactive Plan Drawer Panel matching Image 2 outcome panel appearance -->
    @if (selectedCard) {
      <app-pm-console-plan-drawer
        [eyebrow]="selectedCard.id === 'priority' ? 'Portfolio Setup' : selectedCardGroup"
        [title]="'Manage ' + selectedCard.title"
        [description]="'Manage and configure the active guidelines and options for ' + selectedCard.title.toLowerCase() + '.' "
        submitLabel="Add item"
        cancelLabel="Cancel"
        [hideFooter]="true"
        [panelClass]="'priority-drawer-view'"
        (close)="closeDrawer()"
        (submitForm)="saveDrawer($event)"
      >
        <div planDrawerBody class="standards-drawer-body">
          <div class="priority-drawer-table-wrapper" style="margin-top: 10px;">
            
            <!-- Top bar: Count and Search aligned to the top matching Image 2 -->
            <div class="priority-top-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; width: 100%;">
              <div class="priority-count-label" style="font-size: 14px; font-weight: 500; color: #475569;">
                Showing all {{ getFilteredItems().length }} {{ selectedCard.id === 'priority' ? 'priorities' : selectedCard.title.toLowerCase() }}
              </div>
              
              <!-- Expandable Search Box -->
              <div class="priority-expandable-search" [attr.title]="'Search ' + (selectedCard.id === 'priority' ? 'priorities' : selectedCard.title.toLowerCase())">
                <span pmConsoleIcon="search" class="search-icon"></span>
                <input 
                  type="text" 
                  class="search-input" 
                  [placeholder]="'Search ' + (selectedCard.id === 'priority' ? 'priorities' : selectedCard.title.toLowerCase()) + '...'" 
                  [(ngModel)]="searchQuery"
                />
              </div>
            </div>

            <!-- Input Row: Enter new item and Add button matching Image 2 -->
            <div class="priority-add-input-row" style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px; width: 100%;">
              <input 
                type="text" 
                class="form-control" 
                [placeholder]="'Enter new ' + (selectedCard.id === 'priority' ? 'priority' : selectedCard.title.toLowerCase()) + '...'" 
                [(ngModel)]="newPriorityName"
                (keydown.enter)="addItem()"
                style="height: 38px; font-size: 13px; flex: 1; border: 1px solid #d0d5dd; border-radius: 8px; padding: 8px 12px;"
              />
              <button 
                type="button" 
                class="priority-add-btn" 
                (click)="addItem()"
                style="height: 38px; padding: 0 18px; border-radius: 8px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; background-color: #10069f; color: #ffffff; border: none; cursor: pointer; transition: all 0.2s;"
              >
                <span pmConsoleIcon="plus" style="font-size: 12px;"></span>
                <span>Add</span>
              </button>
            </div>

            <!-- Sleek platform table matching Image 2 -->
            <div class="priority-table-wrapper">
              <table class="priority-table" style="margin: 0; width: 100%;">
                <thead>
                  <tr>
                    <th style="width: 15%; text-align: left;">S.No</th>
                    <th style="width: 60%; text-align: left;">{{ selectedCard.title }}</th>
                    <th style="width: 25%; text-align: center;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of getFilteredItems(); track item; let i = $index) {
                    <tr>
                      <td style="font-size: 13px; color: #475569; font-weight: 500;">
                        {{ i + 1 }}
                      </td>
                      <td style="font-size: 13px;">
                        @if (editingPriorityIndex === selectedCard.items.indexOf(item)) {
                          <input 
                            type="text" 
                            class="form-control" 
                            [(ngModel)]="editingPriorityValue"
                            (keydown.enter)="saveEditItem(selectedCard.items.indexOf(item))"
                            (keydown.escape)="cancelEditItem()"
                            style="height: 28px; padding: 4px 8px; font-size: 12.5px; width: 100%; box-sizing: border-box;"
                            autofocus
                          />
                        } @else {
                          <span style="font-weight: 500; color: #1e293b;">{{ item }}</span>
                        }
                      </td>
                      <td style="text-align: center; vertical-align: middle;">
                        <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                          @if (editingPriorityIndex === selectedCard.items.indexOf(item)) {
                            <button 
                              type="button" 
                              class="priority-action-btn" 
                              (click)="saveEditItem(selectedCard.items.indexOf(item))" 
                              title="Save"
                              style="color: #059669; background: transparent; border: none; display: inline-flex; align-items: center; justify-content: center;"
                            >
                              <span pmConsoleIcon="check" style="font-size: 16px;"></span>
                            </button>
                            <button 
                              type="button" 
                              class="priority-action-btn delete" 
                              (click)="cancelEditItem()" 
                              title="Cancel"
                              style="color: #ef4444; background: transparent; border: none; display: inline-flex; align-items: center; justify-content: center;"
                            >
                              <span pmConsoleIcon="x" style="font-size: 16px;"></span>
                            </button>
                          } @else {
                            <!-- Actions Container: Edit & Delete available on first click matching Image 2 -->
                            <button 
                              type="button" 
                              class="priority-row-action-btn edit-btn" 
                              (click)="startEditItem(selectedCard.items.indexOf(item), item)" 
                              title="Edit"
                            >
                              <span pmConsoleIcon="edit-2" style="font-size: 14px;"></span>
                            </button>
                            <button 
                              type="button" 
                              class="priority-row-action-btn delete-btn" 
                              (click)="deleteItem(selectedCard.items.indexOf(item))" 
                              title="Delete"
                            >
                              <span pmConsoleIcon="trash-2" style="font-size: 14px;"></span>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                  @if (getFilteredItems().length === 0) {
                    <tr>
                      <td colspan="3" style="padding: 24px; text-align: center; color: #94a3b8; font-style: italic;">
                        No items match search.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </app-pm-console-plan-drawer>
    }
    
    @if (isCreatingWorkflow) {
      <app-pm-console-plan-drawer
        eyebrow="Workflow Designer"
        [title]="workflowType"
        [description]="'Create custom ' + workflowType + ' Workflow'"
        submitLabel="Create"
        cancelLabel="Cancel"
        panelClass="workflow-custom-drawer"
        [submitDisabled]="!workflowName"
        (close)="closeWorkflowDrawer()"
        (submitForm)="saveWorkflow($event)"
      >
        <div planDrawerBody class="workflow-drawer-wrapper">
          <!-- Tabs row: shown for Project Stage Closure, placed just below description -->
          @if (workflowType === 'Project Stage Closure') {
            <div class="workflow-drawer-tabs">
              <button
                type="button"
                class="workflow-drawer-tab"
                [class.active]="workflowActiveTab === 'standard'"
                (click)="workflowActiveTab = 'standard'"
              >
                <span pmConsoleIcon="calendar" class="tab-icon"></span>
                Standard Workflow
              </button>
              <button
                type="button"
                class="workflow-drawer-tab"
                [class.active]="workflowActiveTab === 'custom'"
                (click)="workflowActiveTab = 'custom'"
              >
                <span pmConsoleIcon="sidebar" class="tab-icon" style="transform: rotate(90deg);"></span>
                Customised Workflow
              </button>
            </div>
          }
          <!-- White content area -->
          <div class="workflow-drawer-content-area" [class.no-tabs]="workflowType !== 'Project Stage Closure'">
            <!-- Workflow Name + Description fields (shared for both tabs / both types) -->
            <div class="workflow-form-fields">
              <div class="workflow-field-group">
                <label class="workflow-field-label">Workflow Name <span class="required-star">*</span></label>
                <input
                  type="text"
                  class="workflow-field-input"
                  placeholder="Enter workflow name"
                  [(ngModel)]="workflowName"
                />
              </div>
              <div class="workflow-field-group">
                <label class="workflow-field-label">Description</label>
                <textarea
                  class="workflow-field-textarea"
                  placeholder="Enter a brief description of this workflow"
                  rows="4"
                  [(ngModel)]="workflowDescription"
                ></textarea>
              </div>

              <!-- Conditional Dropdowns -->
              @if (workflowType === 'Project Stage Closure' && workflowActiveTab === 'custom') {
                <div class="workflow-field-group">
                  <label class="workflow-field-label">Applicability</label>
                  <div class="ud-select-wrap" style="position: relative;">
                    <select class="workflow-field-select" [(ngModel)]="workflowApplicability">
                      <option value="">Select applicability</option>
                      <option value="Project within program">Project within program</option>
                      <option value="Standalone">Standalone</option>
                    </select>
                    <span pmConsoleIcon="chevron-down" class="ud-select-chevron" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 16px;"></span>
                  </div>
                </div>
              } @else if (workflowType === 'KPI Measure Tracking') {
                <div class="workflow-field-group">
                  <label class="workflow-field-label">Cascading Type</label>
                  <div class="ud-select-wrap" style="position: relative;">
                    <select class="workflow-field-select" [(ngModel)]="workflowApplicability">
                      <option value="">Select type</option>
                      <option value="Cascaded">Cascaded</option>
                      <option value="Non-cascading">Non-cascading</option>
                    </select>
                    <span pmConsoleIcon="chevron-down" class="ud-select-chevron" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 16px;"></span>
                  </div>
                </div>
              }

              <!-- Step Details Header -->
              <div class="workflow-step-details-header">
                <h3 class="workflow-step-details-title">Step Details</h3>
                @if (!isAddingWorkflowStep) {
                  <button type="button" class="workflow-add-step-btn" (click)="openAddStepForm()">
                    <span pmConsoleIcon="plus" class="btn-icon"></span>
                    Add step
                  </button>
                }
              </div>

              @if (!isAddingWorkflowStep) {
                <!-- Steps List -->
                @if (workflowSteps.length > 0) {
                  <div class="workflow-steps-list" style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
                    @for (step of workflowSteps; track $index; let idx = $index) {
                      <div class="workflow-step-card" [class.expanded]="newStepExpandedIndex === idx" style="border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff; overflow: hidden; transition: all 0.2s;">
                        <!-- Step Header -->
                        <div class="workflow-step-card-header" (click)="toggleStepAccordion(idx)" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; background: #f8fafc; hover: background: #f1f5f9;">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="step-badge" style="width: 24px; height: 24px; border-radius: 50%; background: #10069f; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;">
                              {{ idx + 1 }}
                            </div>
                            <span class="step-name" style="font-weight: 600; color: #1e293b; font-size: 14px;">{{ step.name }}</span>
                            @if (step.isMandatory) {
                              <span class="mandatory-badge" style="background: rgba(225, 29, 72, 0.08); color: #e11d48; border: 1px solid rgba(225, 29, 72, 0.15); font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 500;">Mandatory</span>
                            }
                          </div>
                          
                          <div style="display: flex; align-items: center; gap: 8px;" (click)="$event.stopPropagation()">
                            <button type="button" class="priority-action-btn" (click)="editWorkflowStep(idx, $event)" title="Edit step" style="color: #64748b; background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px;">
                              <span pmConsoleIcon="edit-2"></span>
                            </button>
                            <button type="button" class="priority-action-btn delete" (click)="workflowSteps.splice(idx, 1); changeDetector.markForCheck()" title="Delete step" style="color: #ef4444; background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px;">
                              <span pmConsoleIcon="trash-2"></span>
                            </button>
                            <span [pmConsoleIcon]="newStepExpandedIndex === idx ? 'chevron-up' : 'chevron-down'" style="font-size: 16px; color: #64748b; margin-left: 8px; cursor: pointer;" (click)="toggleStepAccordion(idx)"></span>
                          </div>
                        </div>

                        <!-- Step Accordion Body -->
                        @if (newStepExpandedIndex === idx) {
                          <div class="workflow-step-card-body" style="padding: 16px; border-top: 1px solid #cbd5e1; background: #ffffff; font-size: 13px; color: #475569; display: flex; flex-direction: column; gap: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                              <div><strong>Reject Action:</strong> <span style="text-transform: capitalize;">{{ step.rejectAction }}</span></div>
                              <div><strong>AI Component:</strong> <span style="text-transform: capitalize;">{{ step.aiComponent?.replace('_', ' ') }}</span></div>
                            </div>
                            
                            @if (step.configuredActions && step.configuredActions.length > 0) {
                              <div>
                                <strong style="display: block; margin-bottom: 8px;">Configured Actions:</strong>
                                <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
                                    <thead style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                                      <tr>
                                        <th style="padding: 8px 12px; font-weight: 600; color: #475569; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.04em;">User / Role</th>
                                        <th style="padding: 8px 12px; font-weight: 600; color: #475569; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.04em;">Action Type</th>
                                        <th style="padding: 8px 12px; font-weight: 600; color: #475569; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.04em; text-align: center;">Email</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      @for (action of step.configuredActions; track action.id) {
                                        <tr style="border-bottom: 1px solid #f1f5f9;">
                                          <td style="padding: 8px 12px;">
                                            <div style="display: flex; align-items: center; gap: 6px;">
                                              <span class="ca-action-icon-badge" [class.ca-action-icon-badge--role]="action.type === 'role'" [class.ca-action-icon-badge--user]="action.type === 'user'" style="width: 18px; height: 18px; font-size: 10px;">
                                                <span [pmConsoleIcon]="action.type === 'role' ? 'shield' : 'user'"></span>
                                              </span>
                                              <span style="font-weight: 500;">{{ action.label }}</span>
                                            </div>
                                          </td>
                                          <td style="padding: 8px 12px;">{{ action.actionType }}</td>
                                          <td style="padding: 8px 12px; text-align: center;">
                                            @if (action.emailNotification) {
                                              <span pmConsoleIcon="check" style="color: #059669; font-size: 14px;"></span>
                                            } @else {
                                              <span pmConsoleIcon="x" style="color: #cbd5e1; font-size: 14px;"></span>
                                            }
                                          </td>
                                        </tr>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else {
                  <div class="workflow-steps-empty" style="text-align: center; padding: 32px 16px; border: 1.5px dashed #cbd5e1; border-radius: 12px; margin-top: 16px;">
                    <span pmConsoleIcon="sliders" style="font-size: 28px; color: #94a3b8; display: block; margin-bottom: 8px;"></span>
                    <p style="font-size: 13.5px; color: #64748b; margin: 0 0 4px 0; font-weight: 500;">No Steps Defined</p>
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">Click '+ Add Step' to define the sequence for this workflow.</p>
                  </div>
                }
              }

              @if (isAddingWorkflowStep) {
                <div class="step-form-container" style="margin-top: 16px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; padding: 24px; display: flex; flex-direction: column; gap: 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);">
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: -4px;">
                    <h4 style="font-size: 15px; font-weight: 600; color: #10069f; margin: 0;">
                      {{ editingStepIndex !== null ? 'Edit Step Details' : 'New Step Details' }}
                    </h4>
                  </div>

                  <!-- Basic Details Section -->
                  <div class="form-section-block" style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; border-left: 3px solid #10069f; padding-left: 8px;">
                      Basic Details
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: flex-end;">
                      <div class="workflow-field-group">
                        <label class="workflow-field-label">Step Name <span class="required-star">*</span></label>
                        <input type="text" class="workflow-field-input" placeholder="Enter step name" [(ngModel)]="newStepName" />
                      </div>
                      
                      <div style="height: 40px; display: flex; align-items: center;">
                        <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 500; color: #334155; cursor: pointer;">
                          <input type="checkbox" [(ngModel)]="newStepMandatory" style="width: 18px; height: 18px; accent-color: #10069f; cursor: pointer;" />
                          Mandatory Step
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Configure Actions Section -->
                  <div class="form-section-block" style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; border-left: 3px solid #10069f; padding-left: 8px;">
                        Configure Actions
                      </div>
                      
                    </div>

                    <!-- Configured Actions Table -->
                    <div class="user-table-wrapper" style="border-radius: 8px; overflow: visible; margin-top: 4px;">
                      <table class="user-table" style="margin: 0; width: 100%;">
                        <thead>
                          <tr>
                            <th style="padding: 8px 12px; font-size: 11px; width: 40%; background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">User / Role</th>
                            <th style="padding: 8px 12px; font-size: 11px; width: 25%; background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Action Type</th>
                            <th style="padding: 8px 12px; font-size: 11px; width: 25%; background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; text-align: center;">Email Notification</th>
                            <th style="padding: 8px 12px; font-size: 11px; width: 10%; background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; text-align: center;"></th>
                          </tr>
                        </thead>
                        <tbody>
                          @if (configuredActions.length > 0) {
                            @for (action of configuredActions; track action.id; let i = $index) {
                              <tr style="animation: slideIn 0.15s ease;">
                                <td style="padding: 8px 12px; vertical-align: middle;">
                                  <div style="display: flex; align-items: center; gap: 6px;">
                                    <span
                                      class="ca-action-icon-badge"
                                      [class.ca-action-icon-badge--role]="action.type === 'role'"
                                      [class.ca-action-icon-badge--user]="action.type === 'user'"
                                    >
                                      <span [pmConsoleIcon]="action.type === 'role' ? 'shield' : 'user'"></span>
                                    </span>
                                    <span style="font-size: 12.5px; font-weight: 500; color: #1e293b;">{{ action.label }}</span>
                                    <span style="font-size: 10px; color: #94a3b8; text-transform: capitalize;">{{ action.type }}</span>
                                  </div>
                                </td>
                                <td style="padding: 6px 12px; vertical-align: middle;">
                                  <div class="ud-select-wrap" style="position: relative;">
                                    <select
                                      class="ud-select ud-select--pill"
                                      style="height: 28px; font-size: 12px; padding: 0 28px 0 8px; min-width: 95px;"
                                      [value]="action.actionType"
                                      (change)="setCaActionType(i, $any($event.target).value)"
                                    >
                                      @for (opt of actionTypeOptions; track opt) {
                                        <option [value]="opt">{{ opt }}</option>
                                      }
                                    </select>
                                    <span pmConsoleIcon="chevron-down" class="ud-select-chevron" style="font-size: 11px;"></span>
                                  </div>
                                </td>
                                <td style="padding: 6px 12px; vertical-align: middle; text-align: center;">
                                  <label style="display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
                                    <span
                                      class="ud-checkbox-box"
                                      [class.ud-checkbox-box--checked]="action.emailNotification"
                                      (click)="toggleCaEmailNotification(i)"
                                    ></span>
                                  </label>
                                </td>
                                <td style="padding: 6px 12px; vertical-align: middle; text-align: center;">
                                  <button
                                    type="button"
                                    (click)="removeCaAction(i)"
                                    title="Remove"
                                    style="background: transparent; border: none; cursor: pointer; color: #ef4444; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 5px; transition: background 0.15s;"
                                  >
                                    <span pmConsoleIcon="trash-2" style="font-size: 13px;"></span>
                                  </button>
                                </td>
                              </tr>
                            }
                          } @else {
                          }
                          <tr>
                            <td style="padding: 8px 12px; vertical-align: middle; overflow: visible;">
                      <!-- Add New Action — Roles & Users picker -->
                      <div class="ca-picker-wrap" style="position: relative; width: 100%;">
                        <details
                          class="ca-picker-dropdown"
                          (toggle)="onCaPickerToggle($event)"
                        >
                          <summary aria-label="Add New action" style="display: inline-flex; align-items: center; gap: 6px; border: none; border-radius: 9999px; padding: 0 12px; color: #1e293b; font-weight: 500; font-size: 12.5px; height: 28px; background: #f1f5f9; cursor: pointer;">
                            <span pmConsoleIcon="users" aria-hidden="true" style="font-size: 14px; color: #64748b;"></span>
                            <span>{{ selectedCaTarget.label }}</span>
                            <span pmConsoleIcon="chevron-down" aria-hidden="true" class="ca-chevron" style="font-size: 11px; margin-left: 2px; color: #64748b;"></span>
                          </summary>

                          <div class="ca-picker-menu" role="menu">
                            <!-- Search -->
                            <label class="ca-picker-search" (click)="$event.stopPropagation()">
                              <span pmConsoleIcon="search" aria-hidden="true"></span>
                              <input
                                type="search"
                                placeholder="Search Users or roles"
                                aria-label="Search Users or roles"
                                [value]="caPickerSearchQuery"
                                (input)="onCaPickerSearchChange($event)"
                              />
                            </label>

                            <!-- All Roles and Users -->
                            <button
                              class="ca-picker-option ca-all-option"
                              [class.active]="selectedCaTargetId === 'all'"
                              type="button"
                              role="menuitemradio"
                              [attr.aria-checked]="selectedCaTargetId === 'all'"
                              (click)="selectCaTarget('all', $event)"
                            >
                              <span class="ca-option-copy">
                                <strong>All Roles and Users</strong>
                                <small>{{ users.length }} {{ users.length === 1 ? 'user' : 'users' }}</small>
                              </span>
                            </button>

                            @if (hasCaFilteredOptions) {
                              @for (group of filteredCaGroups; track group.id) {
                                @if (group.options.length) {
                                  <details
                                    class="ca-picker-group"
                                    [attr.aria-label]="group.label"
                                    [open]="isCaGroupExpanded(group.id)"
                                    (toggle)="onCaGroupToggle(group.id, $event)"
                                  >
                                    <summary class="ca-picker-group-label" (click)="$event.stopPropagation()">
                                      <span>{{ group.label }}</span>
                                      <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
                                    </summary>
                                    @for (option of group.options; track option.id) {
                                      <button
                                        class="ca-picker-option"
                                        [class.active]="selectedCaTargetId === option.id"
                                        type="button"
                                        role="menuitemradio"
                                        [attr.aria-checked]="selectedCaTargetId === option.id"
                                        (click)="selectCaTarget(option.id, $event)"
                                      >
                                        <span class="ca-option-copy">
                                          <strong>{{ option.label }}</strong>
                                          @if (option.subLabel) {
                                            <small>{{ option.subLabel }}</small>
                                          }
                                        </span>
                                      </button>
                                    }
                                  </details>
                                }
                              }
                            } @else {
                              <div class="ca-picker-empty">No roles or users found.</div>
                            }
                          </div>
                        </details>
                      </div>
                            </td>
                            <td style="padding: 6px 12px; vertical-align: middle;">
                              <div class="ud-select-wrap" style="position: relative;">
                                <select class="ud-select ud-select--pill" style="height: 28px; font-size: 12px; padding: 0 28px 0 8px; min-width: 95px;" [(ngModel)]="newCaActionType">
                                  @for (opt of actionTypeOptions; track opt) {
                                    <option [value]="opt">{{ opt }}</option>
                                  }
                                </select>
                                <span pmConsoleIcon="chevron-down" class="ud-select-chevron" style="font-size: 11px;"></span>
                              </div>
                            </td>
                            <td style="padding: 6px 12px; vertical-align: middle; text-align: center;">
                              <label style="display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
                                <span class="ud-checkbox-box" [class.ud-checkbox-box--checked]="newCaEmailNotification" (click)="newCaEmailNotification = !newCaEmailNotification"></span>
                              </label>
                            </td>
                            <td style="padding: 6px 12px; vertical-align: middle; text-align: center;"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Reject Action Section -->
                  <div class="form-section-block" style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; border-left: 3px solid #10069f; padding-left: 8px;">
                      If the step is rejected, then
                    </div>
                    
                    <div class="ud-radio-group" style="margin-top: 4px;">
                      <label class="ud-radio-label">
                        <input type="radio" name="newStepRejectAction" value="restart" [(ngModel)]="newStepRejectAction" class="ud-radio" />
                        <span>Restart the workflow</span>
                      </label>
                      <label class="ud-radio-label" style="margin-left: 24px;">
                        <input type="radio" name="newStepRejectAction" value="stay" [(ngModel)]="newStepRejectAction" class="ud-radio" />
                        <span>Stay on the current step</span>
                      </label>
                    </div>
                  </div>

                  <!-- AI Component Section -->
                  <div class="form-section-block" style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; border-left: 3px solid #10069f; padding-left: 8px;">
                      AI component
                    </div>
                    
                    <div class="ud-radio-group" style="margin-top: 4px;">
                      <label class="ud-radio-label">
                        <input type="radio" name="newStepAiComponent" value="yes" [(ngModel)]="newStepAiComponent" class="ud-radio" />
                        <span>Yes</span>
                      </label>
                      <label class="ud-radio-label" style="margin-left: 24px;">
                        <input type="radio" name="newStepAiComponent" value="no" [(ngModel)]="newStepAiComponent" class="ud-radio" />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                    <!-- Email Notifications Setup Accordions -->
                    <div class="form-section-block" style="display: flex; flex-direction: column; gap: 12px;">
                      <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; border-left: 3px solid #10069f; padding-left: 8px; margin-bottom: 4px;">
                        Email Notifications setup
                      </div>

                      <!-- Accordion 0: Submitted -->
                      <div class="notification-accordion" style="border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff; overflow: visible; margin-bottom: 8px;">
                        <div class="accordion-trigger" (click)="toggleEmailAccordion('submitted')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; background: #f8fafc; border-radius: 8px 8px 0 0;">
                          <span style="font-size: 13.5px; font-weight: 600; color: #334155;">When step is submitted</span>
                          <span [pmConsoleIcon]="emailAccordionOpen === 'submitted' ? 'chevron-up' : 'chevron-down'" style="font-size: 16px; color: #64748b;"></span>
                        </div>
                        
                        @if (emailAccordionOpen === 'submitted') {
                          <div class="accordion-content" style="padding: 16px; border-top: 1px solid #cbd5e1; display: flex; flex-direction: column; gap: 14px; overflow: visible; position: relative; z-index: 60;">
                            <div class="workflow-field-group">
                              <label class="workflow-field-label">Email template</label>
                              <div class="rich-editor-container">
                                <div class="rich-editor-toolbar">
                                  <button type="button" class="toolbar-btn bold-btn" title="Bold">B</button>
                                  <button type="button" class="toolbar-btn italic-btn" title="Italic">I</button>
                                  <span class="toolbar-divider"></span>
                                  <button type="button" class="toolbar-btn" title="Number List"><span pmConsoleIcon="list-ordered"></span></button>
                                  <button type="button" class="toolbar-btn" title="Bullet List"><span pmConsoleIcon="list"></span></button>
                                  <span class="toolbar-divider"></span>
                                  <button type="button" class="toolbar-btn" title="Quote"><span pmConsoleIcon="quote"></span></button>
                                  <span class="toolbar-divider"></span>
                                  <button type="button" class="toolbar-btn" title="Copy"><span pmConsoleIcon="copy"></span></button>
                                  <button type="button" class="toolbar-btn" title="Cut"><span pmConsoleIcon="scissors"></span></button>
                                  <button type="button" class="toolbar-btn" title="Paste"><span pmConsoleIcon="clipboard"></span></button>
                                  <span class="toolbar-divider"></span>
                                  <button type="button" class="toolbar-btn" title="Undo"><span pmConsoleIcon="corner-up-left"></span></button>
                                  <button type="button" class="toolbar-btn" title="Redo"><span pmConsoleIcon="corner-up-right"></span></button>
                                </div>
                                <textarea class="rich-editor-textarea" placeholder="Enter email template..." [(ngModel)]="newStepSubmittedEmail" rows="4" style="min-height: 80px;"></textarea>
                              </div>
                            </div>
                          </div>
                        }
                      </div>

                      <!-- Accordion 1: Approved -->
                      <div class="notification-accordion" style="border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff; overflow: visible;">
                      <div class="accordion-trigger" (click)="toggleEmailAccordion('approved')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; background: #f8fafc; border-radius: 8px 8px 0 0;">
                        <span style="font-size: 13.5px; font-weight: 600; color: #334155;">When step is approved</span>
                        <span [pmConsoleIcon]="emailAccordionOpen === 'approved' ? 'chevron-up' : 'chevron-down'" style="font-size: 16px; color: #64748b;"></span>
                      </div>
                      
                      @if (emailAccordionOpen === 'approved') {
                        <div class="accordion-content" style="padding: 16px; border-top: 1px solid #cbd5e1; display: flex; flex-direction: column; gap: 14px; overflow: visible; position: relative; z-index: 50;">
                          <div class="workflow-field-group" style="overflow: visible; position: relative;">
                            <label class="workflow-field-label">Recipient Roles</label>
                            
                            <!-- Custom dropdown triggering approved roles multi-select -->
                            <div class="multiselect-dropdown-container" style="position: relative; overflow: visible;">
                              <div class="multiselect-trigger" (click)="isApprovedDropdownOpen = !isApprovedDropdownOpen; isRejectedDropdownOpen = false; isSubmittedDropdownOpen = false; $event.stopPropagation()" style="min-height: 38px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 36px 6px 12px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; background: #ffffff; cursor: pointer; position: relative;">
                                @if (approvedSelectedRoles.length === 0) {
                                  <span style="color: #94a3b8; font-size: 13px;">Select roles to notify</span>
                                }
                                @for (role of approvedSelectedRoles; track role) {
                                  <span class="role-badge" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; background: #f1f5f9; border: 1px solid #cbd5e1; font-size: 11px; color: #334155; font-weight: 500;">
                                    {{ role }}
                                    <span pmConsoleIcon="x" style="font-size: 10px; cursor: pointer; color: #94a3b8;" (click)="removeRole('approved', role, $event)"></span>
                                  </span>
                                }
                                <span pmConsoleIcon="chevron-down" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 14px;"></span>
                              </div>

                              @if (isApprovedDropdownOpen) {
                                <div class="multiselect-dropdown-menu" style="position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); z-index: 100; max-height: 200px; overflow-y: auto; padding: 6px 0;">
                                  @for (role of availableRoles; track role) {
                                    <div class="multiselect-item" (click)="toggleRole('approved', role); $event.stopPropagation()" style="padding: 8px 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #334155; transition: background 0.15s;">
                                      <input type="checkbox" [checked]="approvedSelectedRoles.includes(role)" style="pointer-events: none;" />
                                      <span>{{ role }}</span>
                                    </div>
                                  }
                                </div>
                              }
                            </div>
                          </div>

                          <div class="workflow-field-group">
                            <label class="workflow-field-label">Email template</label>
                            <div class="rich-editor-container">
                              <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn bold-btn" title="Bold">B</button>
                                <button type="button" class="toolbar-btn italic-btn" title="Italic">I</button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Number List"><span pmConsoleIcon="list-ordered"></span></button>
                                <button type="button" class="toolbar-btn" title="Bullet List"><span pmConsoleIcon="list"></span></button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Quote"><span pmConsoleIcon="quote"></span></button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Copy"><span pmConsoleIcon="copy"></span></button>
                                <button type="button" class="toolbar-btn" title="Cut"><span pmConsoleIcon="scissors"></span></button>
                                <button type="button" class="toolbar-btn" title="Paste"><span pmConsoleIcon="clipboard"></span></button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Undo"><span pmConsoleIcon="corner-up-left"></span></button>
                                <button type="button" class="toolbar-btn" title="Redo"><span pmConsoleIcon="corner-up-right"></span></button>
                              </div>
                              <textarea class="rich-editor-textarea" placeholder="Enter email template..." [(ngModel)]="newStepApprovedEmail" rows="4" style="min-height: 80px;"></textarea>
                            </div>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Accordion 2: Rejected -->
                    <div class="notification-accordion" style="border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff; overflow: visible; margin-top: 8px;">
                      <div class="accordion-trigger" (click)="toggleEmailAccordion('rejected')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; background: #f8fafc; border-radius: 8px 8px 0 0;">
                        <span style="font-size: 13.5px; font-weight: 600; color: #334155;">When step is rejected</span>
                        <span [pmConsoleIcon]="emailAccordionOpen === 'rejected' ? 'chevron-up' : 'chevron-down'" style="font-size: 16px; color: #64748b;"></span>
                      </div>
                      
                      @if (emailAccordionOpen === 'rejected') {
                        <div class="accordion-content" style="padding: 16px; border-top: 1px solid #cbd5e1; display: flex; flex-direction: column; gap: 14px; overflow: visible; position: relative; z-index: 40;">
                          <div class="workflow-field-group" style="overflow: visible; position: relative;">
                            <label class="workflow-field-label">Recipient Roles</label>
                            
                            <!-- Custom dropdown triggering rejected roles multi-select -->
                            <div class="multiselect-dropdown-container" style="position: relative; overflow: visible;">
                              <div class="multiselect-trigger" (click)="isRejectedDropdownOpen = !isRejectedDropdownOpen; isApprovedDropdownOpen = false; isSubmittedDropdownOpen = false; $event.stopPropagation()" style="min-height: 38px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 36px 6px 12px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; background: #ffffff; cursor: pointer; position: relative;">
                                @if (rejectedSelectedRoles.length === 0) {
                                  <span style="color: #94a3b8; font-size: 13px;">Select roles to notify</span>
                                }
                                @for (role of rejectedSelectedRoles; track role) {
                                  <span class="role-badge" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; background: #f1f5f9; border: 1px solid #cbd5e1; font-size: 11px; color: #334155; font-weight: 500;">
                                    {{ role }}
                                    <span pmConsoleIcon="x" style="font-size: 10px; cursor: pointer; color: #94a3b8;" (click)="removeRole('rejected', role, $event)"></span>
                                  </span>
                                }
                                <span pmConsoleIcon="chevron-down" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 14px;"></span>
                              </div>

                              @if (isRejectedDropdownOpen) {
                                <div class="multiselect-dropdown-menu" style="position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); z-index: 100; max-height: 200px; overflow-y: auto; padding: 6px 0;">
                                  @for (role of availableRoles; track role) {
                                    <div class="multiselect-item" (click)="toggleRole('rejected', role); $event.stopPropagation()" style="padding: 8px 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #334155; transition: background 0.15s;">
                                      <input type="checkbox" [checked]="rejectedSelectedRoles.includes(role)" style="pointer-events: none;" />
                                      <span>{{ role }}</span>
                                    </div>
                                  }
                                </div>
                              }
                            </div>
                          </div>

                          <div class="workflow-field-group">
                            <label class="workflow-field-label">Email template</label>
                            <div class="rich-editor-container">
                              <div class="rich-editor-toolbar">
                                <button type="button" class="toolbar-btn bold-btn" title="Bold">B</button>
                                <button type="button" class="toolbar-btn italic-btn" title="Italic">I</button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Number List"><span pmConsoleIcon="list-ordered"></span></button>
                                <button type="button" class="toolbar-btn" title="Bullet List"><span pmConsoleIcon="list"></span></button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Quote"><span pmConsoleIcon="quote"></span></button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Copy"><span pmConsoleIcon="copy"></span></button>
                                <button type="button" class="toolbar-btn" title="Cut"><span pmConsoleIcon="scissors"></span></button>
                                <button type="button" class="toolbar-btn" title="Paste"><span pmConsoleIcon="clipboard"></span></button>
                                <span class="toolbar-divider"></span>
                                <button type="button" class="toolbar-btn" title="Undo"><span pmConsoleIcon="corner-up-left"></span></button>
                                <button type="button" class="toolbar-btn" title="Redo"><span pmConsoleIcon="corner-up-right"></span></button>
                              </div>
                              <textarea class="rich-editor-textarea" placeholder="Enter email template..." [(ngModel)]="newStepRejectedEmail" rows="4" style="min-height: 80px;"></textarea>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Form Action Buttons -->
                  <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 8px;">
                    <button type="button" class="workflow-field-button-secondary" (click)="cancelAddStep()" style="height: 38px; padding: 0 20px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #475569; background: #ffffff; cursor: pointer; transition: background 0.15s;">
                      Cancel
                    </button>
                    <button type="button" class="workflow-field-button-primary" (click)="saveWorkflowStep()" [disabled]="!newStepName" style="height: 38px; padding: 0 24px; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; color: #ffffff; background: #10069f; cursor: pointer; transition: background 0.15s;" [style.opacity]="newStepName ? 1 : 0.6">
                      {{ editingStepIndex !== null ? 'Save Step' : 'Add Step' }}
                    </button>
                  </div>

                </div>
              }
            </div>
          </div>
        </div>
      </app-pm-console-plan-drawer>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
    /* Workflow Designer custom drawer */
    ::ng-deep .workflow-custom-drawer .plan-entry-drawer-head {
      border-bottom: none;
      padding-bottom: 0;
      background: #f1f5f9;
    }
    ::ng-deep .workflow-custom-drawer .plan-entry-drawer-body {
      padding: 0;
      background: #f1f5f9;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .workflow-drawer-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex-grow: 1;
    }
    .workflow-drawer-tabs {
      display: flex;
      gap: 4px;
      padding: 12px 20px 0;
    }
    .workflow-drawer-tab {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px 12px 0 0;
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .workflow-drawer-tab.active {
      background: #ffffff;
      color: #10069f;
    }
    .workflow-drawer-tab .tab-icon { font-size: 16px; }
    .workflow-drawer-content-area {
      background: #ffffff;
      flex-grow: 1;
      width: 100%;
      overflow-y: auto;
    }
    .workflow-drawer-content-area.no-tabs {
      border-radius: 8px 8px 0 0;
      margin-top: 16px;
    }
    .workflow-form-fields {
      padding: 24px 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .workflow-field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .workflow-field-label {
      font-size: 13px;
      font-weight: 500;
      color: #334155;
    }
    .required-star {
      color: #e11d48;
    }
    .workflow-field-input,
    .workflow-field-select {
      height: 40px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0 12px;
      font-size: 14px;
      color: #1e293b;
      background: #ffffff;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      width: 100%;
      box-sizing: border-box;
      appearance: none;
    }
    .workflow-field-input:focus,
    .workflow-field-select:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }
    .workflow-field-textarea {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      color: #1e293b;
      background: #ffffff;
      outline: none;
      resize: vertical;
      font-family: inherit;
      line-height: 1.5;
      transition: border-color 0.15s, box-shadow 0.15s;
      width: 100%;
      box-sizing: border-box;
    }
    .workflow-field-textarea:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }
    .workflow-step-details-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    .workflow-step-details-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    .workflow-add-step-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      background: #ffffff;
      color: #10069f;
      border: 1.5px solid #10069f;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .workflow-add-step-btn:hover {
      background: rgba(16, 6, 159, 0.04);
    }
    .workflow-add-step-btn .btn-icon {
      font-size: 16px;
    }
    /* end Workflow Designer */

    /* ── Configure Actions Roles & Users picker ───────────────────────── */
    .ca-picker-wrap {
      position: relative;
    }

    .ca-picker-dropdown {
      position: relative;
    }

    .ca-picker-dropdown > summary {
      align-items: center;
      background: #ffffff;
      border: 1.5px solid #10069f;
      border-radius: 9999px;
      color: #10069f;
      cursor: pointer;
      display: flex;
      font-size: 13px;
      font-weight: 600;
      gap: 6px;
      height: 32px;
      list-style: none;
      padding: 0 16px;
      user-select: none;
      white-space: nowrap;
      transition: background 0.15s, box-shadow 0.15s;
    }

    .ca-picker-dropdown > summary::-webkit-details-marker {
      display: none;
    }

    .ca-picker-dropdown > summary:hover {
      background: rgba(16, 6, 159, 0.04);
    }

    .ca-picker-dropdown[open] > summary {
      background: rgba(16, 6, 159, 0.04);
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }

    .ca-picker-dropdown > summary span[pmConsoleIcon] {
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      color: #10069f;
    }

    .ca-chevron {
      transition: transform 160ms ease;
    }

    .ca-picker-dropdown[open] .ca-chevron {
      transform: rotate(180deg);
    }

    .ca-picker-menu {
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(25, 33, 61, 0.10);
      display: grid;
      gap: 2px;
      max-height: 300px;
      min-width: 260px;
      overflow: auto;
      padding: 6px;
      position: absolute;
      right: 0;
      top: calc(100% + 6px);
      z-index: 300;
    }

    .ca-picker-search {
      align-items: center;
      background: #ffffff;
      border: 1px solid #e3e8f0;
      border-radius: 8px;
      color: #6f7785;
      display: flex;
      gap: 8px;
      height: 34px;
      margin-bottom: 4px;
      padding: 0 10px;
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .ca-picker-search input {
      background: transparent;
      border: 0;
      color: #252a34;
      font: inherit;
      font-size: 12px;
      min-width: 0;
      outline: 0;
      width: 100%;
    }

    .ca-picker-search span[pmConsoleIcon] {
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      color: #687182;
    }

    .ca-picker-group {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .ca-picker-group summary::-webkit-details-marker {
      display: none;
    }

    .ca-picker-group-label {
      align-items: center;
      color: #4c5566;
      cursor: pointer;
      display: flex;
      font-size: 10.5px;
      font-weight: 600;
      gap: 8px;
      justify-content: space-between;
      padding: 6px 8px 2px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      user-select: none;
    }

    .ca-picker-group-label span[pmConsoleIcon] {
      font-size: 12px;
      display: inline-flex;
      transition: transform 160ms ease;
    }

    .ca-picker-group:not([open]) .ca-picker-group-label span[pmConsoleIcon] {
      transform: rotate(-90deg);
    }

    .ca-picker-option {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: #252a34;
      cursor: pointer;
      display: flex;
      font: inherit;
      min-height: 38px;
      min-width: 0;
      padding: 5px 10px;
      text-align: left;
      width: 100%;
    }

    .ca-picker-option:hover,
    .ca-picker-option.active {
      background: #f4f6fb;
    }

    .ca-picker-option.active {
      color: var(--brand, #10069f);
    }

    .ca-all-option {
      margin-bottom: 2px;
    }

    .ca-option-copy {
      display: grid;
      gap: 1px;
      min-width: 0;
    }

    .ca-picker-option strong {
      color: inherit;
      display: block;
      font-size: 11.5px;
      font-weight: 500;
      line-height: 15px;
      overflow: hidden;
      padding: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ca-picker-option small {
      color: #737b8c;
      display: block;
      font-size: 10.5px;
      font-weight: 400;
      line-height: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ca-picker-empty {
      color: #737b8c;
      font-size: 12px;
      padding: 10px 8px;
      text-align: center;
    }

    /* Configure Actions table — action icon badge */
    .ca-action-icon-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      flex-shrink: 0;
    }

    .ca-action-icon-badge--role {
      background: rgba(16, 6, 159, 0.08);
      color: #10069f;
    }

    .ca-action-icon-badge--user {
      background: rgba(16, 185, 129, 0.08);
      color: #059669;
    }

    /* Checkbox for Configure Actions email notification */
    .ud-checkbox-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border: 1.5px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      flex-shrink: 0;
    }

    .ud-checkbox-box--checked {
      background: #10069f;
      border-color: #10069f;
    }

    .ud-checkbox-box--checked::after {
      content: '';
      display: block;
      width: 4px;
      height: 7px;
      border: 1.5px solid #ffffff;
      border-top: none;
      border-left: none;
      transform: rotate(45deg) translate(-1px, -1px);
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

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* User Management Layout */
    .user-management-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      height: 100%;
      color: #202633;
    }

    /* ── Roles & Users picker ──────────────────────────────── */
    .user-target-picker {
      flex: 0 0 auto;
      min-width: 0;
    }

    .user-picker-dropdown {
      position: relative;
    }

    .user-picker-dropdown[open] {
      z-index: 220;
    }

    .user-picker-dropdown > summary {
      align-items: center;
      background: #ffffff;
      border: 1.5px solid #dfe4ee;
      border-radius: 8px;
      color: #252a34;
      cursor: pointer;
      display: flex;
      font-size: 13px;
      font-weight: 500;
      gap: 8px;
      height: 36px;
      list-style: none;
      padding: 0 12px;
      user-select: none;
      white-space: nowrap;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .user-picker-dropdown > summary::-webkit-details-marker {
      display: none;
    }

    .user-picker-dropdown > summary:hover,
    .user-picker-dropdown[open] > summary {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.08);
    }

    .user-picker-dropdown > summary .icon {
      height: 15px;
      width: 15px;
      color: #687182;
      display: inline-flex;
      align-items: center;
    }

    .user-picker-dropdown[open] > summary .icon:last-child {
      transform: rotate(180deg);
    }

    .user-picker-menu {
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(25, 33, 61, 0.10);
      display: grid;
      gap: 2px;
      max-height: 360px;
      min-width: 280px;
      overflow: auto;
      padding: 6px;
      position: absolute;
      right: 0;
      top: calc(100% + 6px);
      z-index: 220;
    }

    .user-picker-search {
      align-items: center;
      background: #ffffff;
      border: 1px solid #e3e8f0;
      border-radius: 8px;
      color: #6f7785;
      display: flex;
      gap: 8px;
      height: 36px;
      margin-bottom: 6px;
      padding: 0 10px;
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .user-picker-search input {
      background: transparent;
      border: 0;
      color: #252a34;
      font: inherit;
      font-size: 12px;
      min-width: 0;
      outline: 0;
      width: 100%;
    }

    .user-picker-search span[pmConsoleIcon] {
      height: 15px;
      width: 15px;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      color: #687182;
    }

    .user-picker-group {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .user-picker-group summary::-webkit-details-marker {
      display: none;
    }

    .user-picker-group-label {
      align-items: center;
      color: #4c5566;
      cursor: pointer;
      display: flex;
      font-size: 11.5px;
      font-weight: 600;
      gap: 8px;
      justify-content: space-between;
      letter-spacing: 0;
      padding: 8px 8px 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      user-select: none;
    }

    .user-picker-group-label span[pmConsoleIcon] {
      height: 13px;
      width: 13px;
      font-size: 12px;
      display: inline-flex;
      transition: transform 160ms ease;
    }

    .user-picker-group:not([open]) .user-picker-group-label span[pmConsoleIcon] {
      transform: rotate(-90deg);
    }

    .user-picker-option {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: #252a34;
      cursor: pointer;
      display: flex;
      font: inherit;
      min-height: 40px;
      min-width: 0;
      padding: 6px 10px;
      text-align: left;
      width: 100%;
    }

    .user-picker-option:hover,
    .user-picker-option.active {
      background: #f4f6fb;
    }

    .user-picker-option.active {
      color: var(--brand, #10069f);
    }

    .all-user-target {
      border-radius: 6px;
      margin-bottom: 4px;
    }

    .user-target-option-copy {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .user-picker-option strong {
      background: transparent;
      border-radius: 0;
      color: inherit;
      display: block;
      font-size: 11.5px;
      font-weight: 500;
      line-height: 16px;
      min-width: 0;
      overflow: hidden;
      padding: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-picker-option small {
      color: #737b8c;
      display: block;
      font-size: 11px;
      font-weight: 400;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-picker-empty {
      color: #737b8c;
      font-size: 12px;
      padding: 12px 8px;
      text-align: center;
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

    .user-actions-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 0;
      margin-bottom: 0;
      width: 100%;
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

    /* Metrics cards (aligned exactly with Image 1: flat white cards, light-grey borders, and soft background-colored icons) */
    .user-metrics-row {
      display: flex;
      gap: 16px;
      margin-top: 4px;
      margin-bottom: 0;
      width: 100%;
    }

    .user-metric-card {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    }

    .metric-icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .metric-icon-wrap.blue {
      background: #edf2fe;
      border: 1px solid #d2dfff;
      color: #10069f;
    }

    .metric-icon-wrap.grey {
      background: #f1f3f7;
      border: 1px solid #e2e8f0;
      color: #64748b;
    }

    .metric-icon {
      font-size: 20px;
      display: inline-flex;
    }

    .metric-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-label {
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
    }

    .metric-count {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
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

    /* Table Wrapper & Table (aligned exactly with Image 2) */
    .user-table-wrapper {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
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
      background: #fbfcff;
      border-bottom: 1px solid #eceef3;
      color: #555555;
      font-size: 12px;
      font-weight: 600;
      padding: 15px 14px;
      text-transform: none;
      letter-spacing: normal;
    }

    .user-table th:first-child,
    .user-table td:first-child {
      padding-left: 64px !important;
    }

    .user-table th:first-child {
      border-top-left-radius: 16px;
    }

    .user-table th:last-child {
      border-top-right-radius: 16px;
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
      border-bottom: 1px solid #eceef3;
      color: #252a34;
      font-size: 12px;
      padding: 13px 14px;
      vertical-align: middle;
    }

    .user-table th:last-child,
    .user-table td:last-child {
      padding-right: 64px !important;
      text-align: right !important;
    }

    .user-table tr:last-child td {
      border-bottom: none;
    }

    .user-table tr:last-child td:first-child {
      border-bottom-left-radius: 16px;
    }

    .user-table tr:last-child td:last-child {
      border-bottom-right-radius: 16px;
    }

    .user-table tr:hover td {
      background: #fbfcff;
    }

    /* Avatars and badges */
    .user-avatar-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9.5px;
      font-weight: 600;
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .user-avatar-name {
      font-weight: 500;
      color: #252a34;
    }

    .font-mono-text {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      color: #64748b;
    }

    /* Role Badges and Unified Pills */
    .role-badge {
      display: inline-flex;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 999px; /* Rounded pill treatment */
      border: none;
      line-height: 1.2;
      align-items: center;
      text-transform: none;
    }

    /* 4 Distinct Premium color-ways (shared by avatar and pill!) */
    .role-lavender {
      background: #DFDFEE !important;
      color: #10069f !important;
    }

    .role-sky {
      background: #ECF3FF !important;
      color: #1d4ed8 !important;
    }

    .role-greyblue {
      background: #E6ECF8 !important;
      color: #244980 !important;
    }

    .role-cream {
      background: #FFF8EB !important;
      color: #b45309 !important;
    }

    .text-slate-email {
      color: #555555;
    }

    .text-slate-bu {
      color: #555555;
    }

    .access-pill {
      display: inline-flex;
      font-size: 11px;
      font-weight: 600; /* Aligned with role-badge! */
      padding: 4px 12px; /* Aligned padding! */
      border-radius: 999px; /* Aligned rounded pill! */
      border: none;
      line-height: 1.2;
      align-items: center;
      text-transform: none; /* Aligned casing! */
    }

    .access-pill.enabled {
      background: #d1fae5;
      color: #047857;
    }

    .access-pill.disabled {
      background: #fee2e2;
      color: #b91c1c;
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

    /* 3-dot Actions button (aligned exactly with Image 5) */
    .user-action-cell {
      text-align: right;
      position: relative;
    }

    .user-action-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .user-dots-btn {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 8px;
      color: #707788;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      transition: all 0.15s ease-in-out;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .user-dots-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #10069f;
    }

    .user-dots-btn span[pmConsoleIcon] {
      font-size: 16px;
      display: inline-flex;
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

    /* Custom Priority Table styles to avoid inheritance issues from User Management */
    .priority-table-wrapper {
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      overflow: hidden;
      width: 100%;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    }
    .priority-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      text-align: left;
    }
    .priority-table th {
      background: #f8fafc;
      border-bottom: 1px solid #eceef3;
      color: #475569;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 16px;
    }
    .priority-table td {
      border-bottom: 1px solid #eceef3;
      color: #1e293b;
      font-size: 13px;
      padding: 10px 16px;
      vertical-align: middle;
    }
    .priority-table tr:last-child td {
      border-bottom: none;
    }
    .priority-table tr:hover td {
      background: #f8fafc;
    }

    /* Direct Edit & Delete Buttons */
    .priority-row-action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
    }
    .priority-row-action-btn.edit-btn {
      border: 1px solid #cbd5e1;
      color: #10069f;
    }
    .priority-row-action-btn.edit-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    .priority-row-action-btn.delete-btn {
      border: 1px solid #fecaca;
      color: #ef4444;
    }
    .priority-row-action-btn.delete-btn:hover {
      background: #fee2e2;
      border-color: #fca5a5;
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

    /* Step Details accordions and form styles */
    .workflow-step-card-header:hover {
      background: #f1f5f9 !important;
    }
    .workflow-step-card.expanded {
      border-color: #10069f !important;
      box-shadow: 0 4px 12px rgba(16, 6, 159, 0.06);
    }
    .notification-accordion {
      transition: all 0.25s ease-in-out;
    }
    .accordion-trigger:hover {
      background: #f1f5f9 !important;
    }
    .multiselect-trigger:hover {
      border-color: #10069f !important;
    }
    .multiselect-item {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 13px;
      color: #334155;
      transition: background 0.15s;
    }
    .multiselect-item:hover {
      background: #f1f5f9;
      color: #10069f;
    }
    .workflow-field-button-secondary:hover {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
    }
    .workflow-field-button-primary:hover:not([disabled]) {
      background: #0d0481 !important;
    }

    /* Clickable Section Row style */
    .section-clickable-row {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #334155;
      font-size: 13px;
      font-weight: 500;
      min-width: 0;
      flex-grow: 1;
      cursor: pointer;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #CFDEFD;
      background: #ffffff;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .section-clickable-row:hover {
      color: #10069f !important;
      background: #F4F5FF;
      border-color: #10069f;
    }
    .section-clickable-row:hover .section-name-text {
      text-decoration: none;
    }
    .section-clickable-row .icon-branch {
      color: #64748b;
      font-size: 14px;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }
    .section-clickable-row:hover .icon-branch {
      color: #10069f;
    }

    /* Scrollbar styling for nested sections inside branch card */
    .sections-scroll-list::-webkit-scrollbar {
      width: 4px;
    }
    .sections-scroll-list::-webkit-scrollbar-track {
      background: transparent;
    }
    .sections-scroll-list::-webkit-scrollbar-thumb {
      background: #cfdefd;
      border-radius: 10px;
    }
    .sections-scroll-list::-webkit-scrollbar-thumb:hover {
      background: #10069f;
    }
    .sections-scroll-list {
      scrollbar-width: thin;
      scrollbar-color: #cfdefd transparent;
    }

    /* Reporting Frequency entity picker container */
    .rf-picker-container {
      position: relative;
      display: inline-block;
    }

    /* Reporting Frequency entity picker pill button */
    .rf-picker-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 32px;
      line-height: 1;
      user-select: none;
    }
    .rf-picker-pill:hover {
      border-color: #94a3b8;
      background: #f8fafc;
    }
    .rf-picker-pill.active {
      border-color: #10069f;
      color: #10069f;
      background: #f4f5ff;
    }

    /* Reporting Frequency entity picker dropdown panel */
    .rf-picker-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 280px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      z-index: 100;
      display: flex;
      flex-direction: column;
      max-height: 320px;
      overflow: hidden;
      animation: motion-fade-in 0.15s ease both;
    }
    .rf-picker-search {
      padding: 8px 12px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f8fafc;
    }
    .rf-picker-search-input {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      color: #334155;
      padding: 0;
    }
    .rf-picker-list {
      overflow-y: auto;
      flex: 1;
      padding: 4px 0;
    }
    .rf-picker-all-row {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      color: #10069f;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background 0.15s;
    }
    .rf-picker-all-row:hover {
      background: #f4f5ff;
    }
    .rf-picker-group-header {
      padding: 6px 16px 2px 16px;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .rf-picker-item {
      padding: 8px 16px 8px 24px;
      font-size: 13px;
      color: #334155;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: background 0.15s;
    }
    .rf-picker-item:hover {
      background: #f8fafc;
      color: #10069f;
    }
    .rf-picker-item.selected {
      background: #f4f5ff;
      color: #10069f;
      font-weight: 500;
    }
    .rf-picker-item-sub {
      font-size: 11px;
      color: #64748b;
    }

    /* Reporting Frequency frequency select pill */
    .rf-freq-select {
      appearance: none;
      -webkit-appearance: none;
      display: inline-flex;
      align-items: center;
      padding: 0 24px 0 12px;
      background: #ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E") no-repeat right 8px center;
      background-size: 14px;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 32px;
      outline: none;
    }
    .rf-freq-select:hover {
      border-color: #94a3b8;
      background-color: #f8fafc;
    }
    .rf-freq-select:focus {
      border-color: #10069f;
      background-color: #ffffff;
    }

    /* Reporting Frequency type chips */
    .rf-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
      width: fit-content;
    }
    .rf-chip-portfolio {
      background: #DFDFEE;
      color: #10069f;
    }
    .rf-chip-program {
      background: #E1E9FF;
      color: #3b5bdb;
    }
    .rf-chip-project {
      background: #FFF8EB;
      border: 1px solid #FFEECF;
      color: #92400e;
    }

    /* Inline edit inputs in table */
    .rf-table-select {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
      color: #1e293b;
      outline: none;
      background: #ffffff;
    }
    .rf-table-select:focus {
      border-color: #10069f;
    }
    .rf-due-input {
      width: 70px;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
      color: #1e293b;
      outline: none;
      background: #ffffff;
      text-align: center;
    }
    .rf-due-input:focus {
      border-color: #10069f;
    }

    /* Reporting Frequency edit actions buttons (borderless) */
    .rf-edit-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: #10069f;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 8px;
      padding: 0;
    }
    .rf-edit-btn:hover {
      background: #f1f5f9;
    }

    .rf-save-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: #22c55e;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 8px;
      padding: 0;
    }
    .rf-save-btn:hover {
      background: #f0fdf4;
    }

    .rf-cancel-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: #ef4444;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 8px;
      padding: 0;
    }
    .rf-cancel-btn:hover {
      background: #fef2f2;
    }
  `]
})
export class PortfolioWorkspaceFrameworkComponent implements OnInit {
  @Output() readonly back = new EventEmitter<void>();

  activeSectionId = 'user-management';

  @HostListener('window:resize')
  onWindowResize(): void {
    // Triggers change detection on resize
  }

  getElbowPath(idx: number, branchCount: number): string {
    const container = document.querySelector('.active-group-details');
    const xDiv = container ? container.clientWidth / 2 : 400;
    const xBranch = 124 + idx * 280;
    const yStart = 112;
    const yMid = 136;
    const yEnd = 160;
    const r = 12; // corner radius
    
    if (xBranch === xDiv) {
      return `M ${xDiv} ${yStart} L ${xDiv} ${yEnd}`;
    }
    
    if (xBranch < xDiv) {
      // Left branch: curves to left, then curves down
      return `M ${xDiv} ${yStart} ` +
             `L ${xDiv} ${yMid - r} ` +
             `A ${r} ${r} 0 0 1 ${xDiv - r} ${yMid} ` +
             `L ${xBranch + r} ${yMid} ` +
             `A ${r} ${r} 0 0 0 ${xBranch} ${yMid + r} ` +
             `L ${xBranch} ${yEnd}`;
    } else {
      // Right branch: curves to right, then curves down
      return `M ${xDiv} ${yStart} ` +
             `L ${xDiv} ${yMid - r} ` +
             `A ${r} ${r} 0 0 0 ${xDiv + r} ${yMid} ` +
             `L ${xBranch - r} ${yMid} ` +
             `A ${r} ${r} 0 0 1 ${xBranch} ${yMid + r} ` +
             `L ${xBranch} ${yEnd}`;
    }
  }

  groupObjects: Array<{
    name: string;
    owner?: string;
    purpose?: string;
    environmentFactors?: string;
    divisions: Array<{
      name: string;
      owner?: string;
      purpose?: string;
      branches: Array<{
        name: string;
        owner?: string;
        purpose?: string;
        sections: Array<{ name: string }>;
      }>;
    }>;
  }> = [];

  ngOnInit(): void {
  }

  // Glossary category sidebar state
  activeGlossaryTab = 'p3m';

  readonly glossaryCategories = [
    { id: 'p3m', label: 'P3M Glossary' },
    { id: 'risk', label: 'Risk Glossary' },
    { id: 'benefits', label: 'Benefits glossary' }
  ];

  get glossaryHeaderTitle(): string {
    if (this.activeGlossaryTab === 'risk') return 'Risk Glossary';
    if (this.activeGlossaryTab === 'benefits') return 'Benefits Glossary';
    return 'Glossary';
  }

  get glossaryHeaderDescription(): string {
    if (this.activeGlossaryTab === 'risk') return 'Risk Labels currently used in the organisation';
    if (this.activeGlossaryTab === 'benefits') return 'Benefits Management Labels currently used in the organisation';
    return 'Configure contextual help for each and every label used in the P3M module.';
  }

  get glossarySystemLabelHeader(): string {
    return this.activeGlossaryTab === 'risk' ? 'Label name' : 'System Label';
  }

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
    this.isSubmittedDropdownOpen = false;
    this.isApprovedDropdownOpen = false;
    this.isRejectedDropdownOpen = false;
    this.isReportFreqPickerOpen = false;
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
    { id: 'category', title: 'Project Category', icon: 'layers', description: 'Define different types of project Category.', items: ['Research & Development', 'Compliance & Regulatory', 'Business Expansion', 'Infrastructure', 'Software Development'] },
    { id: 'priority', title: 'Priority', icon: 'alert-circle', description: 'Set priority levels for ranking and filtering of projects.', items: ['Critical', 'High', 'Medium', 'Low'], needsAttention: true },
    { id: 'size', title: 'Project Size', icon: 'maximize', description: 'Configure size bands based on project scale.', items: ['Small', 'Medium', 'Large', 'Enterprise'] },
    { id: 'tier', title: 'Project Tier', icon: 'bar-chart', description: 'Tier rankings for governance and reviews.', items: ['Tier 1 (High Governance)', 'Tier 2 (Medium Governance)', 'Tier 3 (Light Governance)'] },
    { id: 'procurement', title: 'Procurement Type', icon: 'shopping-bag', description: 'Purchase and sourcing classifications.', items: ['Direct Purchase', 'Request For Proposal (RFP)', 'Sole Source', 'Contract Expansion'] },
    { id: 'supplier', title: 'External Senior Supplier', icon: 'users', description: 'Define third-party vendor categories.', items: ['Vendor Partner', 'Offshore Contractor', 'Independent Consultant', 'OEM Supplier'] }
  ];

  projectPlanningCards: TaxonomyCard[] = [
    { id: 'resource', title: 'Resource', icon: 'user-check', description: 'Resource naming standards and capacities.', items: ['Developer', 'Project Manager', 'Business Analyst', 'QA Engineer', 'Solution Architect'] },
    { id: 'change-impact', title: 'Change Impact', icon: 'refresh-cw', description: 'Levels of change impact expected from the projects.', items: ['Disruptive', 'Major', 'Moderate', 'Minor'], needsAttention: true },
    { id: 'schedule', title: 'Schedule Range', icon: 'calendar', description: 'Timeline margins that provide indicative schedules for concepts and business cases.', items: ['Short-term (< 3 months)', 'Medium-term (3-12 months)', 'Long-term (> 12 months)'] },
    { id: 'dependency-impact', title: 'Impact of Dependency', icon: 'git-commit', description: 'Severity ratings of dependent delays.', items: ['High Impact (Blocker)', 'Medium Impact (Workaround)', 'Low Impact (Negligible)'] },
    { id: 'resource-type', title: 'Resource Type', icon: 'briefcase', description: 'Staffing categories.', items: ['Internal Staff', 'External Consultant', 'Subcontractor'] },
    { id: 'product-type', title: 'Product Type', icon: 'package', description: 'Product deliverable definitions.', items: ['Software Release', 'Infrastructure Upgrade', 'Process Definition', 'Audit Report'] },
    { id: 'issue-type', title: 'Issue Type', icon: 'bug', description: 'Problem classifications.', items: ['Blocker', 'Bug', 'Risk', 'Change Request', 'Task'] },
    { id: 'miscellaneous', title: 'Miscellaneous', icon: 'help-circle', description: 'General settings and custom fields.', items: ['Custom Field A', 'Custom Field B'] }
  ];

  projectClosureCards: TaxonomyCard[] = [
    { id: 'closure-content', title: 'Project Closure Content', icon: 'check-circle', description: 'Define the message displayed to users when a project closure is initiated.', items: ['Handover Document', 'Final Budget Report', 'Stakeholder Sign-off', 'Closure Certificate'] },
    { id: 'program-closure', title: 'Program Closure Content', icon: 'archive', description: 'Define the message displayed to users when a program closure is initiated.', items: ['Program Benefits Report', 'Consolidated Asset Register', 'Executive Sponsor Review'] },
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

  workflowActiveTab: 'standard' | 'custom' = 'standard';
  workflowName = '';
  workflowDescription = '';
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
  newCaActionType = 'Approve';
  newCaEmailNotification = false;
  newStepExpandedIndex = -1;

  emailAccordionOpen: string = '';

  availableRoles = ['Project Manager', 'Project Sponsor', 'PMO Contact', 'Delivery Manager', 'Initiator(Author)'];
  submittedSelectedRoles: string[] = [];
  approvedSelectedRoles: string[] = [];
  rejectedSelectedRoles: string[] = [];
  isSubmittedDropdownOpen = false;
  isApprovedDropdownOpen = false;
  isRejectedDropdownOpen = false;
  newStepSubmittedEmail = '';
  newStepApprovedEmail = '';
  newStepRejectedEmail = '';

  editingWorkflowId: string | null = null;
  editingStepIndex: number | null = null;



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
    this.newStepAiComponent = 'no';
    this.newCaActionType = 'Approve';
    this.newCaEmailNotification = false;
    this.submittedSelectedRoles = [];
    this.approvedSelectedRoles = [];
    this.rejectedSelectedRoles = [];
    this.isSubmittedDropdownOpen = false;
    this.isApprovedDropdownOpen = false;
    this.isRejectedDropdownOpen = false;
    this.newStepSubmittedEmail = '';
    this.newStepApprovedEmail = '';
    this.newStepRejectedEmail = '';
    this.configuredActions = [];
    this.changeDetector.markForCheck();
  }

  editWorkflowStep(index: number, event: Event): void {
    event.stopPropagation();
    const step = this.workflowSteps[index];
    this.newStepName = step.name;
    this.newStepMandatory = step.isMandatory || false;
    this.newStepRejectAction = step.rejectAction || 'restart';
    this.newStepAiComponent = step.aiComponent || 'no';
    this.newCaActionType = 'Approve';
    this.newCaEmailNotification = false;
    this.submittedSelectedRoles = step.submittedRoles || [];
    this.approvedSelectedRoles = step.approvedRoles || [];
    this.rejectedSelectedRoles = step.rejectedRoles || [];
    this.isSubmittedDropdownOpen = false;
    this.isApprovedDropdownOpen = false;
    this.isRejectedDropdownOpen = false;
    this.newStepSubmittedEmail = step.submittedEmail || '';
    this.newStepApprovedEmail = step.approvedEmail || '';
    this.newStepRejectedEmail = step.rejectedEmail || '';
    this.configuredActions = step.configuredActions ? JSON.parse(JSON.stringify(step.configuredActions)) : [];
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
      submittedRoles: [...this.submittedSelectedRoles],
      approvedRoles: [...this.approvedSelectedRoles],
      rejectedRoles: [...this.rejectedSelectedRoles],
      submittedEmail: this.newStepSubmittedEmail,
      approvedEmail: this.newStepApprovedEmail,
      rejectedEmail: this.newStepRejectedEmail,
      configuredActions: JSON.parse(JSON.stringify(this.configuredActions))
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

  toggleRole(type: 'submitted' | 'approved' | 'rejected', role: string): void {
    if (type === 'submitted') {
      const index = this.submittedSelectedRoles.indexOf(role);
      if (index === -1) {
        this.submittedSelectedRoles.push(role);
      } else {
        this.submittedSelectedRoles.splice(index, 1);
      }
    } else if (type === 'approved') {
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

  removeRole(type: 'submitted' | 'approved' | 'rejected', role: string, event: Event): void {
    event.stopPropagation();
    if (type === 'submitted') {
      this.submittedSelectedRoles = this.submittedSelectedRoles.filter(r => r !== role);
    } else if (type === 'approved') {
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
    if (!this.workflowName) return;

    if (this.editingWorkflowId) {
      const idx = this.workflowCards.findIndex(c => c.id === this.editingWorkflowId);
      if (idx !== -1) {
        this.workflowCards[idx].title = this.workflowName;
        this.workflowCards[idx].description = this.workflowDescription;
        this.workflowCards[idx].items = this.workflowSteps.map(s => s.name);
        this.workflowCards[idx].workflowStepsData = JSON.parse(JSON.stringify(this.workflowSteps));
        this.workflowCards[idx].workflowType = this.workflowType;
        this.workflowCards[idx].workflowApplicability = this.workflowApplicability;
      }
    } else {
      const nextId = `workflow-${this.workflowCards.length + 1}-${Date.now()}`;
      const newWorkflow: TaxonomyCard = {
        id: nextId,
        title: this.workflowName,
        icon: 'activity',
        description: this.workflowDescription,
        items: this.workflowSteps.map(s => s.name),
        workflowStepsData: JSON.parse(JSON.stringify(this.workflowSteps)),
        workflowType: this.workflowType,
        workflowApplicability: this.workflowApplicability
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
    { id: 'funding-sources', label: 'Budget Management' },
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
    { id: 'funding-sources', title: 'Funding Sources', icon: 'wallet', description: 'Define the funding sources available for allocation to projects', items: [] },
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

  isReportFreqDrawerOpen = false;
  reportFreqRows: ReportFreqRow[] = [
    { id: '1', name: 'SAFE Portfolio', type: 'portfolio', frequency: 'Quarterly', dueOnDays: 10 },
    { id: '2', name: 'Program Alpha', type: 'program', frequency: 'Monthly', dueOnDays: 7 },
    { id: '3', name: 'Program Beta', type: 'program', frequency: 'Quarterly', dueOnDays: 10 },
    { id: '4', name: 'Program Gamma', type: 'program', frequency: 'Monthly', dueOnDays: 5 },
    { id: '5', name: 'UAE Research Map', type: 'project', parentProgram: 'Program Alpha', frequency: 'Monthly', dueOnDays: 5 },
    { id: '6', name: 'Global Anti-Scam Taskforce', type: 'project', parentProgram: 'Program Alpha', frequency: 'Weekly', dueOnDays: 3 },
    { id: '7', name: 'Counter Terrorism Operations', type: 'project', parentProgram: 'Program Beta', frequency: 'Quarterly', dueOnDays: 14 },
    { id: '8', name: 'Vision 2030', type: 'project', parentProgram: 'Program Beta', frequency: 'Monthly', dueOnDays: 7 },
    { id: '9', name: 'NEOM Integration', type: 'project', parentProgram: 'Program Beta', frequency: 'Quarterly', dueOnDays: 10 },
    { id: '10', name: 'Smart City Alpha', type: 'project', parentProgram: 'Program Gamma', frequency: 'Weekly', dueOnDays: 3 },
    { id: '11', name: 'PMO Capability', type: 'project', parentProgram: 'Program Gamma', frequency: 'Monthly', dueOnDays: 5 }
  ];

  reportFreqFilterEntity = 'all';
  reportFreqFilterFreq = 'all';
  reportFreqEditingRowId: string | null = null;
  reportFreqEditFrequency = '';
  reportFreqEditDueOnDays = 5;
  reportFreqSearchQuery = '';
  isReportFreqPickerOpen = false;

  openReportFreqDrawer(): void {
    this.isReportFreqDrawerOpen = true;
    this.reportFreqFilterEntity = 'all';
    this.reportFreqFilterFreq = 'all';
    this.reportFreqEditingRowId = null;
    this.reportFreqSearchQuery = '';
    this.isReportFreqPickerOpen = false;
    this.changeDetector.markForCheck();
  }

  closeReportFreqDrawer(): void {
    this.isReportFreqDrawerOpen = false;
    this.changeDetector.markForCheck();
  }

  getFilteredReportFreqRows(): ReportFreqRow[] {
    return this.reportFreqRows.filter(row => {
      let matchEntity = true;
      if (this.reportFreqFilterEntity !== 'all') {
        if (row.name !== this.reportFreqFilterEntity) {
          if (row.type === 'project' && row.parentProgram === this.reportFreqFilterEntity) {
            matchEntity = true;
          } else {
            matchEntity = false;
          }
        }
      }

      let matchFreq = true;
      if (this.reportFreqFilterFreq !== 'all') {
        matchFreq = row.frequency === this.reportFreqFilterFreq;
      }

      return matchEntity && matchFreq;
    });
  }

  startEditReportFreqRow(row: ReportFreqRow): void {
    this.reportFreqEditingRowId = row.id;
    this.reportFreqEditFrequency = row.frequency;
    this.reportFreqEditDueOnDays = row.dueOnDays;
    this.changeDetector.markForCheck();
  }

  saveReportFreqRow(id: string): void {
    const row = this.reportFreqRows.find(r => r.id === id);
    if (row) {
      row.frequency = this.reportFreqEditFrequency as any;
      row.dueOnDays = this.reportFreqEditDueOnDays;
    }
    this.reportFreqEditingRowId = null;
    this.changeDetector.markForCheck();
  }

  cancelReportFreqEdit(): void {
    this.reportFreqEditingRowId = null;
    this.changeDetector.markForCheck();
  }

  toggleReportFreqPicker(event: Event): void {
    event.stopPropagation();
    this.isReportFreqPickerOpen = !this.isReportFreqPickerOpen;
    this.changeDetector.markForCheck();
  }

  selectReportFreqEntity(name: string | 'all'): void {
    this.reportFreqFilterEntity = name;
    this.isReportFreqPickerOpen = false;
    this.changeDetector.markForCheck();
  }

  getFilteredProgramsForPicker(): { name: string; projectCount: number }[] {
    const query = this.reportFreqSearchQuery.trim().toLowerCase();
    const programs = this.reportFreqRows.filter(r => r.type === 'program');
    
    return programs
      .map(p => {
        const projectCount = this.reportFreqRows.filter(r => r.type === 'project' && r.parentProgram === p.name).length;
        return { name: p.name, projectCount };
      })
      .filter(p => !query || p.name.toLowerCase().includes(query));
  }

  getFilteredProjectsForPicker(): { name: string }[] {
    const query = this.reportFreqSearchQuery.trim().toLowerCase();
    const projects = this.reportFreqRows.filter(r => r.type === 'project');
    
    return projects
      .filter(p => !query || p.name.toLowerCase().includes(query))
      .map(p => ({ name: p.name }));
  }

  private readonly disabledDrawerGroups = new Set([
    'Change Request Management',
    'Stage Gate Management',
    'Monitoring & Reporting',
    'Portfolio & Investment Prioritization',
    'Risk Management',
    'Funding Sources',
    'Financial Cycle'
  ]);

  openCardDrawer(card: TaxonomyCard, group: string): void {
    if (card.id === 'report-freq') {
      this.openReportFreqDrawer();
      return;
    }
    if (this.disabledDrawerGroups.has(group)) {
      return;
    }
    if (group === 'Workflow Designer') {
      this.isCreatingWorkflow = true;
      this.editingWorkflowId = card.id;
      this.workflowName = card.title;
      this.workflowDescription = card.description;
      this.workflowType = card.workflowType || 'Project Stage Closure';
      this.workflowApplicability = card.workflowApplicability || '';

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

  getFilteredItems(): string[] {
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
    this.startEditItem(index, item);
  }

  triggerDeleteRow(item: string): void {
    this.activeActionMenuIndex = null;
    if (this.selectedCard) {
      const idx = this.selectedCard.items.indexOf(item);
      if (idx !== -1) {
        this.deleteItem(idx);
      }
    }
  }

  addItem(): void {
    const val = this.newPriorityName.trim();
    if (val && this.selectedCard) {
      this.selectedCard.items = [...this.selectedCard.items, val];
      this.newPriorityName = '';
      this.syncSelectedCardBack();
    }
  }

  deleteItem(index: number): void {
    if (this.selectedCard) {
      this.selectedCard.items = this.selectedCard.items.filter((_, i) => i !== index);
      this.syncSelectedCardBack();
    }
  }

  startEditItem(index: number, val: string): void {
    this.editingPriorityIndex = index;
    this.editingPriorityValue = val;
    this.changeDetector.markForCheck();
  }

  saveEditItem(index: number): void {
    const val = this.editingPriorityValue.trim();
    if (val && this.selectedCard) {
      this.selectedCard.items[index] = val;
      this.selectedCard.items = [...this.selectedCard.items];
      this.editingPriorityIndex = null;
      this.editingPriorityValue = '';
      this.syncSelectedCardBack();
    }
  }

  cancelEditItem(): void {
    this.editingPriorityIndex = null;
    this.editingPriorityValue = '';
    this.changeDetector.markForCheck();
  }

  private syncSelectedCardBack(): void {
    if (!this.selectedCard) return;
    const cardId = this.selectedCard.id;
    const items = [...this.selectedCard.items];
    const group = this.selectedCardGroup;

    let arr: TaxonomyCard[] | null = null;
    if (group === 'Project Setup') {
      arr = this.projectSetupCards;
    } else if (group === 'Project Planning') {
      arr = this.projectPlanningCards;
    } else if (group === 'Project Closure') {
      arr = this.projectClosureCards;
    } else if (group === 'Benefits and Config') {
      arr = this.benefitsConfigCards;
    }

    if (arr) {
      const idx = arr.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        arr[idx].items = items;
      }
    }
    this.changeDetector.markForCheck();
  }

  tabs: PmConsoleModeTabItem[] = [
    { id: 'user-management', label: 'User Management', icon: 'users', widthPx: 156 },
    { id: 'workflow-designer', label: 'Workflow Designer', icon: 'activity', widthPx: 166 },
    { id: 'standards', label: 'Standards & Taxonomies', icon: 'book-open', widthPx: 196 },
    { id: 'governance', label: 'Governance & Controls', icon: 'shield', widthPx: 186 },
    { id: 'financial', label: 'Financial & Budget Management', icon: 'wallet', widthPx: 236 },
    { id: 'glossary', label: 'Glossary', icon: 'list', widthPx: 116 }
  ];



  // User Management Drawer
  isAddingUser = false;
  groups: string[] = ['Main Group'];
  divisions: string[] = ['Strategy & Investment', 'Technology & Innovation', 'Operations & Delivery'];
  brands: string[] = ['Project Management Office', 'Enterprise Architecture', 'Cyber Security'];
  sections: string[] = ['Standards & Governance', 'Solutions Delivery', 'Infrastructure Support'];
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

  // Configure Actions Roles & Users picker
  selectedCaTargetId = 'all';
  caPickerSearchQuery = '';
  collapsedCaGroupIds = new Set<string>();

  // Change Password Drawer
  isChangingPassword = false;
  changePasswordUserIndex: number | null = null;
  drawerNewPassword = '';
  drawerConfirmPassword = '';

  maxUsers = 10;
  availableLicences = 15;

  users: Array<{
    name: string;
    username: string;
    role: string;
    email: string;
    businessUnit: string;
    loginAccess: 'Enabled' | 'Disabled';
    lastLogin?: string;
  }> = [
      { name: 'Alice Mercer', username: 'alice.mercer@org.com', role: 'Project Manager', email: 'alice.mercer@org.com', businessUnit: 'Portfolio Management', loginAccess: 'Enabled', lastLogin: '2026-05-20' },
      { name: 'Brian Holloway', username: 'brian.holloway@org.com', role: 'Project Sponsor', email: 'brian.holloway@org.com', businessUnit: 'Asset Management', loginAccess: 'Enabled', lastLogin: '2026-05-18' },
      { name: 'Clara Shen', username: 'clara.shen@org.com', role: 'PMO Contact', email: 'clara.shen@org.com', businessUnit: 'Risk Management', loginAccess: 'Enabled', lastLogin: '2026-05-22' },
      { name: 'David Osei', username: 'david.osei@org.com', role: 'Delivery Manager', email: 'david.osei@org.com', businessUnit: 'Portfolio Management', loginAccess: 'Enabled', lastLogin: '2026-05-15' },
      { name: 'Evelyn Park', username: 'evelyn.park@org.com', role: 'Initiator(Author)', email: 'evelyn.park@org.com', businessUnit: 'Asset Management', loginAccess: 'Disabled', lastLogin: '2026-04-30' },
      { name: 'Frank Addo', username: 'frank.addo@org.com', role: 'Project Manager', email: 'frank.addo@org.com', businessUnit: 'Risk Management', loginAccess: 'Enabled', lastLogin: '2026-05-21' },
    ];

  // Configure Actions rows
  configuredActions: Array<{
    id: string;
    label: string;
    type: 'role' | 'user';
    actionType: string;
    emailNotification: boolean;
  }> = [];

  getActiveUsersCount(): number {
    return this.users.filter(u => u.loginAccess === 'Enabled').length;
  }

  getRoleBadgeClass(role: string): string {
    const r = (role || '').toLowerCase();
    if (r.includes('portfolio')) return 'role-lavender';
    if (r.includes('program')) return 'role-sky';
    if (r.includes('project') || r.includes('analyst')) return 'role-greyblue';
    return 'role-cream';
  }

  readonly actionTypeOptions = ['Approve', 'Reject', 'Review', 'Notify', 'Escalate', 'Reassign'];

  constructor(public readonly changeDetector: ChangeDetectorRef) { }

  setSection(id: string): void {
    this.activeSectionId = id;
    this.changeDetector.markForCheck();
  }

  getActiveSectionLabel(): string {
    const sec = this.tabs.find(s => s.id === this.activeSectionId);
    return sec ? sec.label : 'Framework Configuration';
  }



  // ── Configure Actions picker getters & methods ────────────────────────────────────

  get selectedCaTarget(): { id: string; label: string } {
    if (this.selectedCaTargetId === 'all') {
      return { id: 'all', label: 'All Roles and Users' };
    }
    for (const group of this.caTargetGroups) {
      const match = group.options.find(o => o.id === this.selectedCaTargetId);
      if (match) return { id: match.id, label: match.label };
    }
    return { id: 'all', label: 'All Roles and Users' };
  }

  get caTargetGroups(): Array<{ id: string; label: string; options: Array<{ id: string; label: string; subLabel?: string }> }> {
    // Roles accordion — always shows all availableRoles; adds user-count subheading
    const roleCounts = new Map<string, number>();
    for (const u of this.users) {
      const role = (u.role || 'Unassigned').trim();
      roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
    }
    const rolesGroup = {
      id: 'role',
      label: 'Roles',
      options: this.availableRoles.map(role => ({
        id: `role::${role}`,
        label: role,
        subLabel: (() => {
          const count = roleCounts.get(role) ?? 0;
          return count === 1 ? '1 user' : count > 1 ? `${count} users` : 'Role';
        })(),
      })),
    };

    // Users accordion
    const usersGroup = {
      id: 'user',
      label: 'Users',
      options: this.users.map(u => ({
        id: `user::${u.username}`,
        label: u.name || u.username,
        subLabel: u.role || undefined,
      })),
    };

    return [rolesGroup, usersGroup];
  }

  get filteredCaGroups(): Array<{ id: string; label: string; options: Array<{ id: string; label: string; subLabel?: string }> }> {
    const q = this.caPickerSearchQuery;
    if (!q) return this.caTargetGroups;
    return this.caTargetGroups.map(group => ({
      ...group,
      options: group.options.filter(o =>
        [o.label, o.subLabel ?? ''].some(v => v.toLowerCase().includes(q))
      ),
    }));
  }

  get hasCaFilteredOptions(): boolean {
    return this.filteredCaGroups.some(g => g.options.length > 0);
  }

  isCaGroupExpanded(groupId: string): boolean {
    return !this.collapsedCaGroupIds.has(groupId);
  }

  onCaGroupToggle(groupId: string, event: Event): void {
    const details = event.currentTarget as HTMLDetailsElement;
    if (details.open) {
      this.collapsedCaGroupIds.delete(groupId);
    } else {
      this.collapsedCaGroupIds.add(groupId);
    }
    this.changeDetector.markForCheck();
  }

  onCaPickerSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.caPickerSearchQuery = input.value.toLowerCase().trim();
    if (this.caPickerSearchQuery) {
      this.collapsedCaGroupIds.clear();
    }
    this.changeDetector.markForCheck();
  }

  onCaPickerToggle(event: Event): void {
    const details = event.currentTarget as HTMLDetailsElement;
    if (!details.open) {
      this.caPickerSearchQuery = '';
    }
    this.changeDetector.markForCheck();
  }

  selectCaTarget(id: string, event?: Event): void {
    if (id !== 'all') {
      // Add a row to the configured actions table
      const alreadyAdded = this.configuredActions.some(a => a.id === id);
      if (!alreadyAdded) {
        const target = this.selectedCaTarget;
        const label = this.caTargetGroups
          .flatMap(g => g.options)
          .find(o => o.id === id)?.label ?? id;
        const type: 'role' | 'user' = id.startsWith('role::') ? 'role' : 'user';
        this.configuredActions = [...this.configuredActions, {
          id,
          label,
          type,
          actionType: this.newCaActionType,
          emailNotification: this.newCaEmailNotification,
        }];
      }
    }
    this.newCaActionType = 'Approve';
    this.newCaEmailNotification = false;
    this.selectedCaTargetId = 'all'; // reset picker to default
    this.caPickerSearchQuery = '';
    if (event) {
      (event.currentTarget as HTMLElement | null)?.closest('details')?.removeAttribute('open');
    }
    this.changeDetector.markForCheck();
  }

  removeCaAction(index: number): void {
    this.configuredActions = this.configuredActions.filter((_, i) => i !== index);
    this.changeDetector.markForCheck();
  }

  toggleCaEmailNotification(index: number): void {
    this.configuredActions = this.configuredActions.map((a, i) =>
      i === index ? { ...a, emailNotification: !a.emailNotification } : a
    );
    this.changeDetector.markForCheck();
  }

  setCaActionType(index: number, value: string): void {
    this.configuredActions = this.configuredActions.map((a, i) =>
      i === index ? { ...a, actionType: value } : a
    );
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
