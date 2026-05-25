import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleReportingEmptyIllustrationComponent } from '../shared/pm-console-reporting-empty-illustration.component';
import { PmConsoleModeTabsComponent, PmConsoleModeTabItem } from '../shared/pm-console-mode-tabs.component';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';

export interface TaxonomyCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: string[];
  needsAttention?: boolean;
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
    <main class="portfolio-workspace-body" style="grid-row: 2; overflow-y: auto; background: #ffffff; padding: 24px;">
      
      @if (activeSectionId === 'org-structure') {
        <div class="org-structure-container animation-fade">
          <div class="org-structure-intro">
            <h2>Organisational Structure</h2>
            <p>Configure divisions, brands, and sections to define the portfolio's hierarchical architecture.</p>
          </div>

          <div class="org-columns-grid">
            
            <!-- Division Column -->
            <div class="org-column-card">
              <header class="org-column-header division-header">
                <span class="org-column-icon-wrapper">
                  <span pmConsoleIcon="network" class="org-column-icon"></span>
                </span>
                <div class="org-column-title-group">
                  <h3>Divisions</h3>
                  <span class="org-item-count" [class.empty]="divisions.length === 0">
                    {{ divisions.length }} {{ divisions.length === 1 ? 'division' : 'divisions' }}
                  </span>
                </div>
              </header>

              <div class="org-column-body">
                @if (divisions.length > 0) {
                  <ul class="org-item-list">
                    @for (item of divisions; track item; let i = $index) {
                      <li class="org-item-row animation-slide-in">
                        <span class="org-item-bullet division-bullet"></span>
                        <span class="org-item-name">{{ item }}</span>
                        <button class="org-item-delete-btn" type="button" aria-label="Delete division" (click)="removeDivision(i)">
                          <span pmConsoleIcon="trash-2"></span>
                        </button>
                      </li>
                    }
                  </ul>
                } @else {
                  <div class="org-column-empty">
                    <span pmConsoleIcon="plus-circle" class="empty-icon"></span>
                    <p>No divisions defined yet.</p>
                  </div>
                }

                @if (isAddingDivision) {
                  <div class="org-inline-form animation-fade">
                    <input 
                      type="text" 
                      class="org-inline-input" 
                      placeholder="Division name..." 
                      [(ngModel)]="newDivisionName"
                      (keydown.enter)="addDivision()"
                      (keydown.escape)="isAddingDivision = false"
                    />
                    <div class="org-inline-actions">
                      <button class="org-inline-submit-btn" type="button" (click)="addDivision()">Add</button>
                      <button class="org-inline-cancel-btn" type="button" (click)="isAddingDivision = false">Cancel</button>
                    </div>
                  </div>
                }
              </div>

              @if (!isAddingDivision) {
                <footer class="org-column-footer">
                  <button class="org-add-btn" type="button" (click)="startAddDivision()">
                    <span pmConsoleIcon="plus"></span>
                    <span>Add division</span>
                  </button>
                </footer>
              }
            </div>

            <!-- Brand Column -->
            <div class="org-column-card">
              <header class="org-column-header brand-header">
                <span class="org-column-icon-wrapper">
                  <span pmConsoleIcon="award" class="org-column-icon"></span>
                </span>
                <div class="org-column-title-group">
                  <h3>Brands</h3>
                  <span class="org-item-count" [class.empty]="brands.length === 0">
                    {{ brands.length }} {{ brands.length === 1 ? 'brand' : 'brands' }}
                  </span>
                </div>
              </header>

              <div class="org-column-body">
                @if (brands.length > 0) {
                  <ul class="org-item-list">
                    @for (item of brands; track item; let i = $index) {
                      <li class="org-item-row animation-slide-in">
                        <span class="org-item-bullet brand-bullet"></span>
                        <span class="org-item-name">{{ item }}</span>
                        <button class="org-item-delete-btn" type="button" aria-label="Delete brand" (click)="removeBrand(i)">
                          <span pmConsoleIcon="trash-2"></span>
                        </button>
                      </li>
                    }
                  </ul>
                } @else {
                  <div class="org-column-empty">
                    <span pmConsoleIcon="plus-circle" class="empty-icon"></span>
                    <p>No brands defined yet.</p>
                  </div>
                }

                @if (isAddingBrand) {
                  <div class="org-inline-form animation-fade">
                    <input 
                      type="text" 
                      class="org-inline-input" 
                      placeholder="Brand name..." 
                      [(ngModel)]="newBrandName"
                      (keydown.enter)="addBrand()"
                      (keydown.escape)="isAddingBrand = false"
                    />
                    <div class="org-inline-actions">
                      <button class="org-inline-submit-btn" type="button" (click)="addBrand()">Add</button>
                      <button class="org-inline-cancel-btn" type="button" (click)="isAddingBrand = false">Cancel</button>
                    </div>
                  </div>
                }
              </div>

              @if (!isAddingBrand) {
                <footer class="org-column-footer">
                  <button class="org-add-btn" type="button" (click)="startAddBrand()">
                    <span pmConsoleIcon="plus"></span>
                    <span>Add brand</span>
                  </button>
                </footer>
              }
            </div>

            <!-- Section Column -->
            <div class="org-column-card">
              <header class="org-column-header section-header">
                <span class="org-column-icon-wrapper">
                  <span pmConsoleIcon="layers" class="org-column-icon"></span>
                </span>
                <div class="org-column-title-group">
                  <h3>Sections</h3>
                  <span class="org-item-count" [class.empty]="sections.length === 0">
                    {{ sections.length }} {{ sections.length === 1 ? 'section' : 'sections' }}
                  </span>
                </div>
              </header>

              <div class="org-column-body">
                @if (sections.length > 0) {
                  <ul class="org-item-list">
                    @for (item of sections; track item; let i = $index) {
                      <li class="org-item-row animation-slide-in">
                        <span class="org-item-bullet section-bullet"></span>
                        <span class="org-item-name">{{ item }}</span>
                        <button class="org-item-delete-btn" type="button" aria-label="Delete section" (click)="removeSection(i)">
                          <span pmConsoleIcon="trash-2"></span>
                        </button>
                      </li>
                    }
                  </ul>
                } @else {
                  <div class="org-column-empty">
                    <span pmConsoleIcon="plus-circle" class="empty-icon"></span>
                    <p>No sections defined yet.</p>
                  </div>
                }

                @if (isAddingSection) {
                  <div class="org-inline-form animation-fade">
                    <input 
                      type="text" 
                      class="org-inline-input" 
                      placeholder="Section name..." 
                      [(ngModel)]="newSectionName"
                      (keydown.enter)="addSection()"
                      (keydown.escape)="isAddingSection = false"
                    />
                    <div class="org-inline-actions">
                      <button class="org-inline-submit-btn" type="button" (click)="addSection()">Add</button>
                      <button class="org-inline-cancel-btn" type="button" (click)="isAddingSection = false">Cancel</button>
                    </div>
                  </div>
                }
              </div>

              @if (!isAddingSection) {
                <footer class="org-column-footer">
                  <button class="org-add-btn" type="button" (click)="startAddSection()">
                    <span pmConsoleIcon="plus"></span>
                    <span>Add section</span>
                  </button>
                </footer>
              }
            </div>

          </div>
        </div>
      } @else if (activeSectionId === 'user-management') {
        <div class="user-management-container animation-fade">
          <div class="user-management-header">
            <div class="user-title-group">
              <h2>User Management</h2>
              <p>Configure team members, access roles, and system permission levels.</p>
            </div>
            
            <button class="add-user-btn" type="button" (click)="openAddUserForm()">
              <span pmConsoleIcon="plus"></span>
              <span>Add User</span>
            </button>
          </div>

          <!-- Sleek Add User Inline Form -->
          @if (isAddingUser) {
            <div class="user-inline-form-card animation-slide-in">
              <div class="form-grid">
                <div class="form-field">
                  <label for="userName">Name</label>
                  <input id="userName" type="text" [(ngModel)]="newUserName" placeholder="Fatima Qahtani" />
                </div>
                <div class="form-field">
                  <label for="userUsername">User Name</label>
                  <input id="userUsername" type="text" [(ngModel)]="newUserUsername" placeholder="fatima.q" />
                </div>
                <div class="form-field">
                  <label for="userRole">Role(s)</label>
                  <input id="userRole" type="text" [(ngModel)]="newUserRole" placeholder="Portfolio Manager" />
                </div>
                <div class="form-field">
                  <label for="userEmail">Email</label>
                  <input id="userEmail" type="email" [(ngModel)]="newUserEmail" placeholder="fatima@client.co" />
                </div>
                <div class="form-field">
                  <label for="userBU">Business Unit</label>
                  <input id="userBU" type="text" [(ngModel)]="newUserBU" placeholder="Safe Security" />
                </div>
                <div class="form-field">
                  <label for="userAccess">Login Access</label>
                  <select id="userAccess" [(ngModel)]="newUserAccess">
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>
              <div class="form-actions">
                <button class="form-submit-btn" type="button" (click)="addUser()">Save User</button>
                <button class="form-cancel-btn" type="button" (click)="isAddingUser = false">Cancel</button>
              </div>
            </div>
          }

          <!-- Custom Premium User Table -->
          <div class="user-table-wrapper">
            <table class="user-table">
              <thead>
                <tr>
                  <th style="width: 22%;">Name</th>
                  <th style="width: 15%;" class="sortable">
                    User Name 
                    <span class="sort-icon-wrapper active">
                      <span pmConsoleIcon="triangle" class="sort-icon-triangle"></span>
                    </span>
                  </th>
                  <th style="width: 15%;">Role(s)</th>
                  <th style="width: 20%;">Email</th>
                  <th style="width: 15%;">Business Unit</th>
                  <th style="width: 8%;">Login Access</th>
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
                      <td style="text-align: center;">
                        <button class="user-row-delete-btn" type="button" (click)="removeUser(i)" aria-label="Remove user">
                          <span pmConsoleIcon="trash-2"></span>
                        </button>
                      </td>
                    </tr>
                  }
                } @else {
                  <tr>
                    <td colspan="7" class="table-empty-cell">
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
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>
          </div>
        </div>
      } @else if (activeSectionId === 'standards') {
        <div class="standards-container animation-fade">
          <div class="standards-intro">
            <h2>Review and customise the standards your programs and projects will follow across this portfolio.</h2>
          </div>

          <div class="standards-sections-stack">
            <!-- Section: Project Setup -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Project Setup</h3>
              <div class="standards-grid">
                @for (card of projectSetupCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Project Setup')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Project Planning -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Project Planning</h3>
              <div class="standards-grid">
                @for (card of projectPlanningCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Project Planning')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container planning-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Project Closure -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Project Closure</h3>
              <div class="standards-grid">
                @for (card of projectClosureCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Project Closure')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container closure-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Benefits Configuration -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Benefits Configuration</h3>
              <div class="standards-grid">
                @for (card of benefitsConfigCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Benefits Configuration')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container benefits-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>
          </div>
        </div>
      } @else if (activeSectionId === 'governance') {
        <div class="standards-container animation-fade">
          <div class="standards-intro">
            <h2>Governance & Controls</h2>
            <p>Define governance frameworks, prioritisation matrices, change request tolerances, and risk controls.</p>
          </div>

          <div class="standards-sections-stack">
            <!-- Section: Change Request Management -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Change Request Management</h3>
              <div class="standards-grid">
                @for (card of changeRequestCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Change Request Management')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Stage Gate Management -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Stage Gate Management</h3>
              <div class="standards-grid">
                @for (card of stageGateCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Stage Gate Management')">
                    <div class="standards-card-icon-container planning-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Monitoring & Reporting -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Monitoring & Reporting</h3>
              <div class="standards-grid">
                @for (card of monitoringReportingCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Monitoring & Reporting')">
                    <div class="standards-card-icon-container closure-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Portfolio & Investment Prioritization -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Portfolio & Investment Prioritization</h3>
              <div class="standards-grid">
                @for (card of prioritizationCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Portfolio & Investment Prioritization')">
                    <div class="standards-card-icon-container benefits-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Risk Management -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Risk Management</h3>
              <div class="standards-grid">
                @for (card of riskManagementCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Risk Management')">
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>
          </div>
        </div>
      } @else if (activeSectionId === 'financial') {
        <div class="standards-container animation-fade">
          <div class="standards-intro">
            <h2>Financial & Budget Management</h2>
            <p>Review and customise the financial structures and accounting cycles across this portfolio.</p>
          </div>

          <div class="standards-sections-stack">
            <!-- Section: Funding Sources -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Funding Sources</h3>
              <div class="standards-grid">
                @for (card of fundingSourcesCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Funding Sources')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container setup-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>

            <!-- Section: Financial Cycle -->
            <section class="standards-group">
              <h3 class="standards-section-heading">Financial Cycle</h3>
              <div class="standards-grid">
                @for (card of financialCycleCards; track card.id) {
                  <button type="button" class="standards-card" (click)="openCardDrawer(card, 'Financial Cycle')">
                    @if (card.needsAttention) {
                      <span class="attention-dot" title="Needs attention"></span>
                    }
                    <div class="standards-card-icon-container planning-color">
                      <span [pmConsoleIcon]="card.icon" class="standards-card-icon"></span>
                    </div>
                    <div class="standards-card-body">
                      <h4>{{ card.title }}</h4>
                      <p>{{ card.description }}</p>
                    </div>
                    <span pmConsoleIcon="arrow-right" class="standards-card-arrow-right"></span>
                  </button>
                }
              </div>
            </section>
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
  `,
  styles: [`
    :host {
      display: contents;
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
      gap: 20px;
      width: 100%;
      height: 100%;
      color: #202633;
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

    .org-columns-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      align-items: start;
    }

    .org-column-card {
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(25, 33, 61, 0.04);
      display: flex;
      flex-direction: column;
      min-height: 380px;
      overflow: hidden;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .org-column-card:hover {
      box-shadow: 0 4px 12px rgba(25, 33, 61, 0.06);
      border-color: #cbd5e1;
    }

    .org-column-header {
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      gap: 12px;
      padding: 16px;
    }

    .org-column-icon-wrapper {
      align-items: center;
      border-radius: 8px;
      display: flex;
      height: 36px;
      justify-content: center;
      width: 36px;
    }

    .division-header .org-column-icon-wrapper {
      background: rgba(16, 6, 159, 0.08);
      color: #10069f;
    }

    .brand-header .org-column-icon-wrapper {
      background: rgba(13, 148, 136, 0.08);
      color: #0d9488;
    }

    .section-header .org-column-icon-wrapper {
      background: rgba(225, 29, 72, 0.08);
      color: #e11d48;
    }

    .org-column-icon {
      font-size: 18px;
      display: inline-flex;
    }

    .org-column-title-group h3 {
      font-size: 14px;
      font-weight: 600;
      color: #252a34;
      margin: 0;
    }

    .org-item-count {
      font-size: 11px;
      font-weight: 500;
      color: #687182;
    }

    .org-item-count.empty {
      color: #94a3b8;
    }

    .org-column-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 16px;
      gap: 12px;
    }

    .org-column-empty {
      align-items: center;
      border: 1px dashed #e2e8f0;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
      padding: 32px 16px;
      text-align: center;
      color: #94a3b8;
      flex-grow: 1;
    }

    .org-column-empty .empty-icon {
      font-size: 24px;
      color: #cbd5e1;
    }

    .org-column-empty p {
      font-size: 12.5px;
      margin: 0;
    }

    .org-item-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .org-item-row {
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      display: flex;
      gap: 10px;
      padding: 10px 12px;
      position: relative;
      transition: all 0.2s ease;
    }

    .org-item-row:hover {
      background: #ffffff;
      border-color: #cbd5e1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .org-item-bullet {
      border-radius: 50%;
      height: 6px;
      width: 6px;
      flex-shrink: 0;
    }

    .division-bullet {
      background-color: #10069f;
    }

    .brand-bullet {
      background-color: #0d9488;
    }

    .section-bullet {
      background-color: #e11d48;
    }

    .org-item-name {
      font-size: 13px;
      font-weight: 500;
      color: #334155;
      flex-grow: 1;
      word-break: break-all;
    }

    .org-item-delete-btn {
      align-items: center;
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      height: 24px;
      justify-content: center;
      padding: 0;
      width: 24px;
      border-radius: 4px;
      opacity: 0;
      transition: all 0.2s ease;
    }

    .org-item-row:hover .org-item-delete-btn {
      opacity: 1;
    }

    .org-item-delete-btn:hover {
      background: #fee2e2;
      color: #ef4444;
    }

    .org-inline-form {
      border: 1px solid #10069f;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
      box-shadow: 0 4px 6px -1px rgba(16, 6, 159, 0.05);
    }

    .org-inline-input {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
      padding: 8px 10px;
      width: 100%;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .org-inline-input:focus {
      border-color: #10069f;
    }

    .org-inline-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
    }

    .org-inline-submit-btn {
      background: #10069f;
      border: none;
      border-radius: 6px;
      color: #ffffff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      transition: background 0.15s ease;
    }

    .org-inline-submit-btn:hover {
      background: #1b10bd;
    }

    .org-inline-cancel-btn {
      background: transparent;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      color: #64748b;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      transition: all 0.15s ease;
    }

    .org-inline-cancel-btn:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .org-column-footer {
      border-top: 1px solid #f1f5f9;
      padding: 12px 16px;
      background: #f8fafc;
    }

    .org-add-btn {
      align-items: center;
      background: transparent;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      color: #10069f;
      cursor: pointer;
      display: flex;
      font-size: 13px;
      font-weight: 600;
      gap: 8px;
      height: 36px;
      justify-content: center;
      width: 100%;
      transition: all 0.2s ease;
    }

    .org-add-btn:hover {
      background: rgba(16, 6, 159, 0.04);
      border-color: #10069f;
      border-style: solid;
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

    /* User Inline Form Card */
    .user-inline-form-card {
      background: #f8fafc;
      border: 1px solid #dfe4ee;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-field label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .form-field input, .form-field select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13.5px;
      padding: 8px 12px;
      outline: none;
      background: #ffffff;
      color: #334155;
      transition: all 0.15s ease;
    }

    .form-field input:focus, .form-field select:focus {
      border-color: #10069f;
      box-shadow: 0 0 0 3px rgba(16, 6, 159, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .form-submit-btn {
      background: #10069f;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .form-submit-btn:hover {
      background: #1b10bd;
    }

    .form-cancel-btn {
      background: transparent;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      color: #64748b;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .form-cancel-btn:hover {
      background: #e2e8f0;
      color: #334155;
    }

    /* Table Wrapper & Table */
    .user-table-wrapper {
      background: #ffffff;
      border: 1px solid #dfe4ee;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(25, 33, 61, 0.04);
      overflow: hidden;
      width: 100%;
    }

    .user-table {
      width: 100%;
      border-collapse: collapse;
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
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }

    .standards-card {
      position: relative;
      background: linear-gradient(180deg, #ffffff 0%, #f6f8fc 100%);
      border: 1px solid #dfe4ee;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(25, 33, 61, 0.03);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      padding: 16px;
      text-align: left;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      height: 146px;
      box-sizing: border-box;
      outline: none;
    }

    .standards-card:hover {
      box-shadow: 0 8px 16px rgba(16, 6, 159, 0.06);
      border-color: #cbd5e1;
      transform: translateY(-2px);
    }

    .standards-card-icon-container {
      align-items: center;
      border-radius: 8px;
      display: flex;
      height: 32px;
      width: 32px;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(226, 232, 240, 0.8);
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
      background: #e0f2fe; /* Light sky blue instead of red */
      color: #0284c7;      /* Beautiful different shade of blue */
    }

    .standards-card-icon-container.benefits-color {
      background: #eef2ff;
      color: #4f46e5;
    }

    .standards-card-icon {
      font-size: 14px;
      display: inline-flex;
    }

    .standards-card-body {
      margin-top: 10px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .standards-card-body h4 {
      font-size: 13.5px;
      font-weight: 700;
      color: #1d2939;
      margin: 0;
      line-height: 1.3;
    }

    .standards-card-body p {
      font-size: 11px;
      line-height: 1.4;
      color: #667085;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .standards-card-arrow-right {
      position: absolute;
      bottom: 12px;
      right: 16px;
      color: #10069f;
      font-size: 14px;
      display: inline-flex;
      transition: transform 0.2s ease;
    }

    .standards-card:hover .standards-card-arrow-right {
      transform: translateX(3px);
    }

    /* Amber Attention Dot on Card Top Right */
    .attention-dot {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 7px;
      height: 7px;
      background-color: #f59e0b; /* Amber warning dot */
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
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
      font-size: 16px;
      display: inline-flex;
    }

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
export class PortfolioWorkspaceFrameworkComponent {
  @Output() readonly back = new EventEmitter<void>();

  activeSectionId = 'org-structure';

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

  addNewWorkflow(): void {
    const nextId = `workflow-${this.workflowCards.length + 1}`;
    const newWorkflow: TaxonomyCard = {
      id: nextId,
      title: `Custom Workflow ${this.workflowCards.length + 1}`,
      icon: 'activity',
      description: 'Custom user-defined project workflow governance steps.',
      items: ['Step 1: Draft', 'Step 2: Review', 'Step 3: Approved']
    };
    this.workflowCards = [...this.workflowCards, newWorkflow];
    this.changeDetector.markForCheck();
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

  divisions: string[] = [];
  brands: string[] = [];
  sections: string[] = [];

  // User Management
  isAddingUser = false;
  newUserName = '';
  newUserUsername = '';
  newUserRole = '';
  newUserEmail = '';
  newUserBU = '';
  newUserAccess: 'Enabled' | 'Disabled' = 'Enabled';

  users: Array<{
    name: string;
    username: string;
    role: string;
    email: string;
    businessUnit: string;
    loginAccess: 'Enabled' | 'Disabled';
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

  startAddDivision(): void {
    this.isAddingDivision = true;
    this.newDivisionName = '';
    this.changeDetector.markForCheck();
  }

  addDivision(): void {
    const val = this.newDivisionName.trim();
    if (val) {
      this.divisions = [...this.divisions, val];
    }
    this.isAddingDivision = false;
    this.newDivisionName = '';
    this.changeDetector.markForCheck();
  }

  removeDivision(index: number): void {
    this.divisions = this.divisions.filter((_, i) => i !== index);
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

  startAddSection(): void {
    this.isAddingSection = true;
    this.newSectionName = '';
    this.changeDetector.markForCheck();
  }

  addSection(): void {
    const val = this.newSectionName.trim();
    if (val) {
      this.sections = [...this.sections, val];
    }
    this.isAddingSection = false;
    this.newSectionName = '';
    this.changeDetector.markForCheck();
  }

  removeSection(index: number): void {
    this.sections = this.sections.filter((_, i) => i !== index);
    this.changeDetector.markForCheck();
  }

  // User Management Methods
  openAddUserForm(): void {
    this.isAddingUser = true;
    this.newUserName = '';
    this.newUserUsername = '';
    this.newUserRole = '';
    this.newUserEmail = '';
    this.newUserBU = '';
    this.newUserAccess = 'Enabled';
    this.changeDetector.markForCheck();
  }

  addUser(): void {
    const name = this.newUserName.trim();
    const username = this.newUserUsername.trim();
    const role = this.newUserRole.trim() || 'Team Member';
    const email = this.newUserEmail.trim();
    const businessUnit = this.newUserBU.trim() || 'Safe Security';
    const loginAccess = this.newUserAccess;

    if (name && username && email) {
      this.users = [...this.users, {
        name,
        username,
        role,
        email,
        businessUnit,
        loginAccess
      }];
    }

    this.isAddingUser = false;
    this.newUserName = '';
    this.newUserUsername = '';
    this.newUserRole = '';
    this.newUserEmail = '';
    this.newUserBU = '';
    this.newUserAccess = 'Enabled';
    this.changeDetector.markForCheck();
  }

  removeUser(index: number): void {
    this.users = this.users.filter((_, i) => i !== index);
    this.changeDetector.markForCheck();
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


