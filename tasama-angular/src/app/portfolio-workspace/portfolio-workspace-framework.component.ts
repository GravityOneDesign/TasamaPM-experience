import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleReportingEmptyIllustrationComponent } from '../shared/pm-console-reporting-empty-illustration.component';

interface FrameworkSection {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-portfolio-workspace-framework',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleReportingEmptyIllustrationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-framework-tab">
      
      <!-- Left sidebar -->
      <aside class="framework-sidebar">
        <span class="eyebrow-label">Framework Settings</span>
        <nav class="framework-nav">
          @for (sec of sections; track sec.id) {
            <button
              class="sidebar-nav-btn"
              [class.is-active]="activeSectionId === sec.id"
              type="button"
              (click)="setSection(sec.id)"
            >
              <span [pmConsoleIcon]="sec.icon" class="btn-icon"></span>
              <span class="btn-text">{{ sec.label }}</span>
            </button>
          }
        </nav>
      </aside>

      <!-- Right content empty state panel -->
      <main class="framework-content">
        <div class="empty-state-card animation-fade">
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
      </main>

    </div>
  `,
  styles: [`
    .workspace-framework-tab {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 24px;
      padding: 10px 0;
      min-height: calc(100vh - 260px);
      animation: fadeIn 0.3s ease-out;
    }

    /* Left Sidebar */
    .framework-sidebar {
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-right: 1px solid #e3e5e9;
      padding-right: 20px;
    }

    .eyebrow-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #707788;
      padding-left: 12px;
      margin-bottom: 4px;
    }

    .framework-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sidebar-nav-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      background: transparent;
      border: none;
      border-left: 3px solid transparent;
      padding: 10px 12px;
      color: #555555;
      font-size: 13.5px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      border-radius: 0 6px 6px 0;
      transition: background-color 0.15s ease, color 0.15s ease, border-left-color 0.15s ease;
    }

    .sidebar-nav-btn:hover {
      background: #f4f5f7;
      color: #202633;
    }

    .sidebar-nav-btn.is-active {
      background: rgba(0, 122, 255, 0.08);
      color: var(--brand, #007aff);
      border-left-color: var(--brand, #007aff);
      font-weight: 600;
    }

    .btn-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    .btn-text {
      line-height: 1.4;
    }

    /* Right Content Area */
    .framework-content {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 12px;
      padding: 48px;
      min-height: 420px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
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

    /* Animations */
    .animation-fade {
      animation: fadeIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PortfolioWorkspaceFrameworkComponent {
  activeSectionId = 'org-structure';

  sections: FrameworkSection[] = [
    { id: 'org-structure', label: 'Organisational Structure', icon: 'git-branch' },
    { id: 'user-management', label: 'User Management', icon: 'users' },
    { id: 'workflow-designer', label: 'Workflow Designer', icon: 'activity' },
    { id: 'standards', label: 'Standards & Taxonomies', icon: 'book-open' },
    { id: 'governance', label: 'Governance & Controls', icon: 'shield' },
    { id: 'financial', label: 'Financial & Budget Management', icon: 'wallet' },
    { id: 'glossary', label: 'Glossary', icon: 'list' }
  ];

  setSection(id: string): void {
    this.activeSectionId = id;
  }

  getActiveSectionLabel(): string {
    const sec = this.sections.find(s => s.id === this.activeSectionId);
    return sec ? sec.label : 'Framework Configuration';
  }
}
