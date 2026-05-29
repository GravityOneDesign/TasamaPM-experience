import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleFieldComponent } from '../shared/pm-console-field.component';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';
import {
  Issue,
  IssueCriticality,
  IssueLevel,
  IssueStatus,
  ProgramRow,
} from './portfolio-workspace.data';
import {
  PortfolioRegisterStructureColumn,
  PortfolioRegisterStructureRow,
  PortfolioRegisterStructureTableComponent,
} from './portfolio-register-structure-table.component';

interface IssueProjectGroup {
  key: string;
  label: string;
  issues: Issue[];
}

interface IssueProgramGroup {
  key: string;
  label: string;
  directIssues: Issue[];
  projects: IssueProjectGroup[];
}

interface AddIssueDraft {
  level: IssueLevel;
  program: string;
  project: string;
  issueType: string;
  criticality: IssueCriticality;
  issue: string;
  resolution: string;
  owner: string;
  dueDate: string;
  status: IssueStatus;
}

interface ProjectLinkOption {
  label: string;
  projectName: string;
  parentProgram?: string;
}

const issueRegisterColumns: PortfolioRegisterStructureColumn[] = [
  { id: 'issueId', label: 'Issue ID', width: '12%', className: 'nowrap' },
  { id: 'issueType', label: 'Issue Type', width: '14%' },
  { id: 'issue', label: 'Issue', width: '23%' },
  { id: 'criticality', label: 'Criticality', width: '11%' },
  { id: 'resolution', label: 'Resolution', width: '21%' },
  { id: 'owner', label: 'Owner', width: '12%' },
  { id: 'dueDate', label: 'Due Date', width: '9%' },
  { id: 'status', label: 'Status', width: '10%' },
];

@Component({
  selector: 'app-portfolio-workspace-issues-register',
  standalone: true,
  imports: [
    CommonModule,
    PmConsoleFieldComponent,
    PmConsoleIconComponent,
    PmConsolePlanDrawerComponent,
    PortfolioRegisterStructureTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="portfolio-issue-register" aria-label="Issues register">
      <header class="portfolio-register-toolbar" aria-label="Issue register tools">
        <div class="portfolio-register-toolbar-left">
          <span class="portfolio-register-total">{{ issueCountLabel(filteredIssues.length) }}</span>
        </div>
        <div class="portfolio-register-toolbar-actions">
          <label class="portfolio-register-search" [class.has-query]="searchQuery.trim().length > 0" title="Search issues">
            <span pmConsoleIcon="search" aria-hidden="true"></span>
            <input
              type="search"
              [value]="searchQuery"
              placeholder="Search issues"
              aria-label="Search issues"
              (input)="setSearchQuery($event)"
            />
          </label>
          <button class="portfolio-register-tool" type="button" aria-label="Filter issues">
            <span pmConsoleIcon="filter" aria-hidden="true"></span>
            <span>Filter</span>
          </button>
          <button class="portfolio-register-tool" type="button" aria-label="Export issues">
            <span pmConsoleIcon="download" aria-hidden="true"></span>
            <span>Export</span>
          </button>
          <button class="portfolio-register-tool primary" type="button" aria-label="Add issue" (click)="openAddIssueDrawer()">
            <span pmConsoleIcon="plus" aria-hidden="true"></span>
            <span>Add Issue</span>
          </button>
          <button class="portfolio-register-tool square" type="button" aria-label="Issue register settings">
            <span pmConsoleIcon="settings" aria-hidden="true"></span>
          </button>
        </div>
      </header>

      <app-portfolio-register-structure-table
        [columns]="columns"
        [rows]="structureRows"
        ariaLabel="Issues register"
        emptyTitle="No issues match this view"
        emptyBody="Clear the search or add an issue linked to this portfolio."
        (groupToggle)="toggleGroup($event)"
      />

      @if (isAddIssueDrawerOpen) {
        <app-pm-console-plan-drawer
          title="Add issue"
          eyebrow="Issues Register"
          description="Create an issue and link it to the portfolio, a program, or a project."
          submitLabel="Add issue"
          closeAriaLabel="Close add issue drawer"
          panelClass="portfolio-issue-drawer"
          [submitDisabled]="!canSaveAddIssueDraft"
          (close)="closeAddIssueDrawer()"
          (submitForm)="saveIssue($event)"
        >
          <div planDrawerBody class="portfolio-issue-drawer-grid">
            <app-pm-console-field
              label="Link issue to"
              type="select"
              [value]="levelLabel(addIssueDraft.level)"
              [options]="levelOptions"
              ariaLabel="Link issue to"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateIssueLevelFromLabel($event)"
            />

            @if (addIssueDraft.level === 'program') {
              <app-pm-console-field
                label="Program"
                type="select"
                [value]="addIssueDraft.program"
                [options]="programOptions"
                ariaLabel="Program"
                fieldClass="dependency-drawer-field"
                [mandatory]="true"
                (valueChange)="updateIssueDraft('program', $event)"
              />
            }

            @if (addIssueDraft.level === 'project') {
              <app-pm-console-field
                label="Project"
                type="select"
                [value]="addIssueDraft.project"
                [options]="projectOptions"
                ariaLabel="Project"
                fieldClass="dependency-drawer-field"
                [mandatory]="true"
                (valueChange)="updateIssueDraft('project', $event)"
              />
            }

            <app-pm-console-field
              label="Issue Type"
              type="select"
              [value]="addIssueDraft.issueType"
              [options]="issueTypeOptions"
              ariaLabel="Issue Type"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateIssueDraft('issueType', $event)"
            />
            <app-pm-console-field
              label="Issue"
              type="textarea"
              [value]="addIssueDraft.issue"
              placeholder="Type issue here"
              ariaLabel="Issue"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              [wide]="true"
              [maxLength]="500"
              (valueChange)="updateIssueDraft('issue', $event)"
            />
            <app-pm-console-field
              label="Criticality"
              type="select"
              [value]="criticalityLabel(addIssueDraft.criticality)"
              [options]="criticalityOptions"
              ariaLabel="Criticality"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateIssueCriticality($event)"
            />
            <app-pm-console-field
              label="Owner"
              type="select"
              [value]="addIssueDraft.owner"
              [options]="ownerOptions"
              ariaLabel="Owner"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateIssueDraft('owner', $event)"
            />
            <app-pm-console-field
              label="Due Date"
              type="date"
              [value]="addIssueDraft.dueDate"
              ariaLabel="Due Date"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateIssueDraft('dueDate', $event)"
            />
            <app-pm-console-field
              label="Status"
              type="select"
              [value]="statusLabel(addIssueDraft.status)"
              [options]="statusOptions"
              ariaLabel="Status"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateIssueStatus($event)"
            />
            <app-pm-console-field
              label="Resolution"
              type="textarea"
              [value]="addIssueDraft.resolution"
              placeholder="Describe the resolution path"
              ariaLabel="Resolution"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              [wide]="true"
              (valueChange)="updateIssueDraft('resolution', $event)"
            />
          </div>
        </app-pm-console-plan-drawer>
      }
    </section>
  `,
  styles: [`
    :host {
      background: #ffffff;
      display: flex;
      flex: 1;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .portfolio-issue-register {
      display: grid;
      flex: 1;
      gap: 12px;
      grid-template-rows: auto minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      padding: 12px 20px 20px;
    }

    .portfolio-register-toolbar {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: space-between;
      min-height: 40px;
      min-width: 0;
    }

    .portfolio-register-toolbar-left,
    .portfolio-register-toolbar-actions {
      align-items: center;
      display: flex;
      gap: 10px;
      min-width: 0;
    }

    .portfolio-register-toolbar-actions {
      margin-left: auto;
    }

    .portfolio-register-total {
      background: #f5f6fb;
      border: 1px solid #e8ebf2;
      border-radius: 999px;
      color: #737b8d;
      font-size: 12px;
      font-weight: 400;
      height: 32px;
      line-height: 16px;
      padding: 7px 12px;
      white-space: nowrap;
    }

    .portfolio-register-search,
    .portfolio-register-tool {
      align-items: center;
      background: #ffffff;
      border: 1px solid #e0e3ea;
      border-radius: 8px;
      color: #3c4454;
      display: inline-flex;
      gap: 8px;
      height: 40px;
      min-height: 40px;
    }

    .portfolio-register-search {
      --register-search-size: 40px;
      --register-search-width: 220px;
      cursor: text;
      flex: 0 1 var(--register-search-size);
      gap: 0;
      justify-content: center;
      max-width: var(--register-search-size);
      min-width: var(--register-search-size);
      overflow: hidden;
      padding: 0;
      transition: flex-basis 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), gap 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), max-width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), padding 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
      width: var(--register-search-size);
    }

    .portfolio-register-search:hover,
    .portfolio-register-search:focus-within,
    .portfolio-register-search.has-query {
      flex-basis: var(--register-search-width);
      gap: 8px;
      justify-content: flex-start;
      max-width: min(var(--register-search-width), 100%);
      padding: 0 10px;
      width: var(--register-search-width);
    }

    .portfolio-register-search .icon,
    .portfolio-register-tool .icon {
      color: #6f7584;
      height: 16px;
      width: 16px;
    }

    .portfolio-register-search input {
      border: 0;
      color: #252a34;
      font-size: 12px;
      min-width: 0;
      opacity: 0;
      outline: 0;
      pointer-events: none;
      transition: opacity 0.18s ease, width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
      width: 0;
    }

    .portfolio-register-search:hover input,
    .portfolio-register-search:focus-within input,
    .portfolio-register-search.has-query input {
      opacity: 1;
      pointer-events: auto;
      width: 100%;
    }

    .portfolio-register-tool {
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      justify-content: center;
      padding: 0 14px;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
      white-space: nowrap;
    }

    .portfolio-register-tool.primary {
      background: #10069f;
      border-color: #10069f;
      color: #ffffff;
    }

    .portfolio-register-tool.primary .icon {
      color: #ffffff;
    }

    .portfolio-register-tool.square {
      padding: 0;
      width: 40px;
    }

    .portfolio-register-tool:hover,
    .portfolio-register-tool:focus-visible,
    .portfolio-register-search:hover,
    .portfolio-register-search:focus-within {
      border-color: #cfd5e2;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
      outline: 0;
    }

    .portfolio-register-tool.primary:hover,
    .portfolio-register-tool.primary:focus-visible {
      background: #0d0580;
      border-color: #0d0580;
    }

    .portfolio-issue-drawer-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .portfolio-issue-drawer-grid .wide,
    .portfolio-issue-drawer-grid .dependency-drawer-field.wide {
      grid-column: 1 / -1;
    }

    @media (max-width: 920px) {
      .portfolio-issue-register {
        padding: 10px 12px 16px;
      }

      .portfolio-register-toolbar-actions,
      .portfolio-issue-drawer-grid {
        grid-template-columns: 1fr;
        width: 100%;
      }
    }
  `]
})
export class PortfolioWorkspaceIssuesRegisterComponent {
  @Input() issues: Issue[] = [];
  @Input() programs: ProgramRow[] = [];
  @Input() standaloneProjects: ProgramRow[] = [];
  @Output() readonly issueCreate = new EventEmitter<Issue>();

  readonly columns = issueRegisterColumns;
  readonly levelOptions = ['Portfolio', 'Program', 'Project'];
  readonly issueTypeOptions = ['Scope issue', 'Schedule issue', 'Budget issue', 'Decision required', 'Dependency issue', 'Resource issue', 'Technical issue', 'Vendor issue', 'Communications issue', 'Compliance issue'];
  readonly criticalityOptions = ['Critical', 'High', 'Medium', 'Low'];
  readonly statusOptions = ['Open', 'In Progress', 'Pending Decision', 'Resolved', 'Closed'];
  readonly portfolioName = 'Safe Security Portfolio';
  readonly portfolioNodeId = 'issue-portfolio-root';

  collapsedGroupIds = new Set<string>();
  searchQuery = '';
  isAddIssueDrawerOpen = false;
  addIssueDraft: AddIssueDraft = this.createIssueDraft();

  setSearchQuery(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement | null)?.value || '';
  }

  toggleGroup(groupId: string): void {
    const next = new Set(this.collapsedGroupIds);
    if (next.has(groupId)) {
      next.delete(groupId);
    } else {
      next.add(groupId);
    }
    this.collapsedGroupIds = next;
  }

  get filteredIssues(): Issue[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.issues;
    return this.issues.filter((issue) => this.matchesIssueSearch(issue, query));
  }

  get structureRows(): PortfolioRegisterStructureRow[] {
    if (!this.filteredIssues.length) return [];

    const rows: PortfolioRegisterStructureRow[] = [
      this.groupRow(this.portfolioNodeId, this.portfolioName, 'portfolio', this.issueCountLabel(this.filteredIssues.length), 0, '', 'portfolio-node'),
    ];

    if (this.isCollapsed(this.portfolioNodeId)) return rows;

    rows.push(...this.portfolioIssues.map((issue) => this.issueRow(issue, 1, 'portfolio-record-node')));

    for (const program of this.programGroups) {
      const programHasChildren = program.directIssues.length > 0 || program.projects.length > 0;
      rows.push(this.groupRow(
        program.key,
        program.label,
        'program',
        this.issueCountLabel(this.programIssueCount(program)),
        1,
        '',
        programHasChildren ? 'program-node branch-start-node' : 'program-node',
      ));
      if (this.isCollapsed(program.key)) continue;
      rows.push(...program.directIssues.map((issue) => this.issueRow(issue, 2, 'program-record-node')));
      for (const [projectIndex, project] of program.projects.entries()) {
        const isLastProject = projectIndex === program.projects.length - 1;
        const projectCollapsed = this.isCollapsed(project.key);
        rows.push(this.groupRow(
          project.key,
          project.label,
          'project',
          this.issueCountLabel(project.issues.length),
          2,
          '',
          isLastProject && projectCollapsed ? 'project-node project-terminal-node' : 'project-node',
        ));
        if (!this.isCollapsed(project.key)) {
          rows.push(...project.issues.map((issue, issueIndex) => {
            const isLastIssue = issueIndex === project.issues.length - 1;
            return this.issueRow(issue, 2, 'project-record-node', isLastIssue, isLastProject && isLastIssue);
          }));
        }
      }
    }

    const standaloneGroups = this.standaloneGroups;
    if (standaloneGroups.length) {
      const standaloneRootId = 'issue-standalone-root';
      rows.push(this.groupRow(standaloneRootId, 'Standalone Projects', 'standalone', this.issueCountLabel(this.standaloneIssueCount), 1, '', 'standalone-node'));
      if (!this.isCollapsed(standaloneRootId)) {
        for (const [projectIndex, project] of standaloneGroups.entries()) {
          const isLastProject = projectIndex === standaloneGroups.length - 1;
          const projectCollapsed = this.isCollapsed(project.key);
          rows.push(this.groupRow(
            project.key,
            project.label,
            'project',
            this.issueCountLabel(project.issues.length),
            2,
            '',
            isLastProject && projectCollapsed ? 'standalone-project-node project-terminal-node' : 'standalone-project-node',
          ));
          if (!this.isCollapsed(project.key)) {
            rows.push(...project.issues.map((issue, issueIndex) => {
              const isLastIssue = issueIndex === project.issues.length - 1;
              return this.issueRow(issue, 2, 'standalone-record-node', isLastIssue, isLastProject && isLastIssue);
            }));
          }
        }
      }
    }

    return rows;
  }

  get programOptions(): string[] {
    return this.programs.map((program) => program.name);
  }

  get projectLinkOptions(): ProjectLinkOption[] {
    const programProjects = this.programs.flatMap((program) =>
      (program.projects || []).map((project) => ({
        label: project.name,
        projectName: project.name,
        parentProgram: program.name,
      })),
    );
    const standalone = this.standaloneProjects.map((project) => ({
      label: project.name,
      projectName: project.name,
    }));
    return [...programProjects, ...standalone];
  }

  get projectOptions(): string[] {
    return this.projectLinkOptions.map((project) => project.label);
  }

  get ownerOptions(): string[] {
    const owners = new Set<string>([
      ...this.issues.map((issue) => issue.owner.name),
      ...this.programs.map((program) => program.manager),
      ...this.standaloneProjects.map((project) => project.manager),
      'PMO Desk',
    ]);
    return Array.from(owners).sort();
  }

  get canSaveAddIssueDraft(): boolean {
    const draft = this.addIssueDraft;
    return Boolean(
      draft.issueType.trim() &&
        draft.issue.trim() &&
        draft.resolution.trim() &&
        draft.owner.trim() &&
        draft.dueDate.trim() &&
        (draft.level !== 'program' || draft.program.trim()) &&
        (draft.level !== 'project' || draft.project.trim()),
    );
  }

  openAddIssueDrawer(): void {
    this.addIssueDraft = this.createIssueDraft();
    this.isAddIssueDrawerOpen = true;
  }

  closeAddIssueDrawer(): void {
    this.isAddIssueDrawerOpen = false;
  }

  updateIssueDraft<K extends keyof AddIssueDraft>(field: K, value: AddIssueDraft[K]): void {
    this.addIssueDraft = {
      ...this.addIssueDraft,
      [field]: value,
    };
  }

  updateIssueLevelFromLabel(label: string): void {
    const level = this.levelFromLabel(label);
    this.addIssueDraft = {
      ...this.addIssueDraft,
      level,
      program: level === 'program' ? this.addIssueDraft.program || this.programOptions[0] || '' : this.addIssueDraft.program,
      project: level === 'project' ? this.addIssueDraft.project || this.projectOptions[0] || '' : this.addIssueDraft.project,
    };
  }

  updateIssueCriticality(label: string): void {
    this.updateIssueDraft('criticality', this.criticalityFromLabel(label));
  }

  updateIssueStatus(label: string): void {
    this.updateIssueDraft('status', this.statusFromLabel(label));
  }

  saveIssue(event: Event): void {
    event.preventDefault();
    if (!this.canSaveAddIssueDraft) return;

    const draft = this.addIssueDraft;
    const projectLink = draft.level === 'project' ? this.projectLinkOptions.find((project) => project.label === draft.project) : null;
    const issue: Issue = {
      id: this.nextIssueId(),
      issueType: draft.issueType.trim(),
      issue: draft.issue.trim(),
      criticality: draft.criticality,
      resolution: draft.resolution.trim(),
      level: draft.level,
      linkedTo: draft.level === 'portfolio' ? this.portfolioName : draft.level === 'program' ? draft.program : projectLink?.projectName || draft.project,
      parentProgram: draft.level === 'project' ? projectLink?.parentProgram : undefined,
      parentPortfolio: draft.level === 'portfolio' ? undefined : this.portfolioName,
      owner: {
        name: draft.owner.trim(),
        initials: this.initialsFor(draft.owner),
      },
      dueDate: this.displayDate(draft.dueDate),
      status: draft.status,
    };

    this.issueCreate.emit(issue);
    this.closeAddIssueDrawer();
  }

  issueCountLabel(count: number): string {
    return count === 1 ? '1 issue' : `${count} issues`;
  }

  levelLabel(level: IssueLevel): string {
    if (level === 'portfolio') return 'Portfolio';
    if (level === 'program') return 'Program';
    return 'Project';
  }

  criticalityLabel(criticality: IssueCriticality): string {
    return this.valueLabel(criticality);
  }

  statusLabel(status: IssueStatus): string {
    return this.valueLabel(status);
  }

  private get portfolioIssues(): Issue[] {
    return this.filteredIssues.filter((issue) => issue.level === 'portfolio');
  }

  private get programGroups(): IssueProgramGroup[] {
    const programsMap = new Map<string, { directIssues: Issue[]; projectsMap: Map<string, Issue[]> }>();

    for (const issue of this.filteredIssues) {
      if (issue.level === 'program') {
        const programName = issue.linkedTo;
        if (!programsMap.has(programName)) {
          programsMap.set(programName, { directIssues: [], projectsMap: new Map() });
        }
        programsMap.get(programName)!.directIssues.push(issue);
        continue;
      }

      if (issue.level !== 'project' || !issue.parentProgram) continue;
      if (!programsMap.has(issue.parentProgram)) {
        programsMap.set(issue.parentProgram, { directIssues: [], projectsMap: new Map() });
      }
      const program = programsMap.get(issue.parentProgram)!;
      if (!program.projectsMap.has(issue.linkedTo)) {
        program.projectsMap.set(issue.linkedTo, []);
      }
      program.projectsMap.get(issue.linkedTo)!.push(issue);
    }

    return Array.from(programsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([programName, program]) => ({
        key: `issue-program::${programName}`,
        label: programName,
        directIssues: program.directIssues,
        projects: Array.from(program.projectsMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([projectName, issues]) => ({
            key: `issue-program::${programName}::project::${projectName}`,
            label: projectName,
            issues,
          })),
      }));
  }

  private get standaloneGroups(): IssueProjectGroup[] {
    const standaloneMap = new Map<string, Issue[]>();
    for (const issue of this.filteredIssues) {
      if (issue.level !== 'project' || issue.parentProgram) continue;
      if (!standaloneMap.has(issue.linkedTo)) {
        standaloneMap.set(issue.linkedTo, []);
      }
      standaloneMap.get(issue.linkedTo)!.push(issue);
    }

    return Array.from(standaloneMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([projectName, issues]) => ({
        key: `issue-standalone::${projectName}`,
        label: projectName,
        issues,
      }));
  }

  private get standaloneIssueCount(): number {
    return this.standaloneGroups.reduce((total, group) => total + group.issues.length, 0);
  }

  private issueRow(
    issue: Issue,
    depth: 0 | 1 | 2,
    branchClass: string,
    branchTerminal = false,
    programBranchTerminal = false,
  ): PortfolioRegisterStructureRow {
    return {
      kind: 'row',
      id: issue.id,
      depth,
      branchClass,
      branchTerminal,
      programBranchTerminal,
      cells: {
        issueId: { kind: 'text', text: issue.id },
        issueType: { kind: 'text', text: issue.issueType },
        issue: { kind: 'primary', title: issue.issue, subtitle: this.issueLineage(issue) },
        criticality: { kind: 'status', text: this.criticalityLabel(issue.criticality), tone: this.criticalityTone(issue.criticality) },
        resolution: { kind: 'text', text: issue.resolution },
        owner: { kind: 'person', text: issue.owner.name, initials: issue.owner.initials },
        dueDate: { kind: 'text', text: this.dateLabel(issue.dueDate) },
        status: { kind: 'status', text: this.statusLabel(issue.status), tone: this.statusTone(issue.status) },
      },
    };
  }

  private groupRow(
    id: string,
    label: string,
    level: 'portfolio' | 'program' | 'project' | 'standalone',
    countLabel: string,
    depth: 0 | 1 | 2,
    metaLabel = '',
    branchClass = '',
  ): PortfolioRegisterStructureRow {
    return {
      kind: 'group',
      id,
      label,
      level,
      countLabel,
      metaLabel,
      depth,
      branchClass,
      expanded: !this.isCollapsed(id),
    };
  }

  private isCollapsed(groupId: string): boolean {
    return this.collapsedGroupIds.has(groupId);
  }

  private programIssueCount(program: IssueProgramGroup): number {
    return program.directIssues.length + program.projects.reduce((total, project) => total + project.issues.length, 0);
  }

  private matchesIssueSearch(issue: Issue, query: string): boolean {
    return [
      issue.id,
      issue.issueType,
      issue.issue,
      issue.resolution,
      issue.linkedTo,
      issue.parentProgram || '',
      issue.owner.name,
      issue.dueDate,
      issue.status,
      issue.criticality,
    ].some((value) => value.toLowerCase().includes(query));
  }

  private issueLineage(issue: Issue): string {
    if (issue.level === 'portfolio') return 'Portfolio';
    if (issue.level === 'program') return 'Program';
    return issue.parentProgram || 'Standalone Project';
  }

  private criticalityTone(criticality: IssueCriticality): string {
    if (criticality === 'critical') return 'red';
    if (criticality === 'high') return 'amber';
    if (criticality === 'medium') return 'blue';
    return 'neutral';
  }

  private statusTone(status: IssueStatus): string {
    if (status === 'closed' || status === 'resolved') return 'green';
    if (status === 'in-progress') return 'blue';
    if (status === 'pending-decision') return 'amber';
    return 'red';
  }

  private levelFromLabel(label: string): IssueLevel {
    const normalized = label.toLowerCase();
    if (normalized === 'program') return 'program';
    if (normalized === 'project') return 'project';
    return 'portfolio';
  }

  private criticalityFromLabel(label: string): IssueCriticality {
    const normalized = label.toLowerCase();
    if (normalized === 'critical' || normalized === 'high' || normalized === 'medium' || normalized === 'low') {
      return normalized;
    }
    return 'low';
  }

  private statusFromLabel(label: string): IssueStatus {
    const normalized = label.toLowerCase().replace(/\s+/g, '-');
    if (normalized === 'in-progress' || normalized === 'pending-decision' || normalized === 'resolved' || normalized === 'closed') {
      return normalized;
    }
    return 'open';
  }

  private valueLabel(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private dateLabel(value: string): string {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return value;
    const [, month, day, year] = match;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${Number(day)} ${monthNames[Number(month) - 1] || month} ${year}`;
  }

  private displayDate(value: string): string {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return value;
    const [, year, month, day] = match;
    return `${month}/${day}/${year}`;
  }

  private createIssueDraft(): AddIssueDraft {
    return {
      level: 'portfolio',
      program: this.programOptions[0] || '',
      project: this.projectOptions[0] || '',
      issueType: 'Decision required',
      criticality: 'low',
      issue: '',
      resolution: '',
      owner: 'PMO Desk',
      dueDate: '2026-06-12',
      status: 'open',
    };
  }

  private nextIssueId(): string {
    const highest = this.issues.reduce((max, issue) => {
      const numeric = Number(issue.id.replace(/\D/g, ''));
      return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
    }, 0);
    return `ISS-${String(highest + 1).padStart(2, '0')}`;
  }

  private initialsFor(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'PM';
  }
}
