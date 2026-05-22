import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleReportingEmptyIllustrationComponent } from '../shared/pm-console-reporting-empty-illustration.component';
import { PmConsoleModeTabsComponent, PmConsoleModeTabItem } from '../shared/pm-console-mode-tabs.component';

@Component({
  selector: 'app-portfolio-workspace-framework',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PmConsoleIconComponent,
    PmConsoleReportingEmptyIllustrationComponent,
    PmConsoleModeTabsComponent
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
  `]
})
export class PortfolioWorkspaceFrameworkComponent {
  @Output() readonly back = new EventEmitter<void>();

  activeSectionId = 'org-structure';

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

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

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


