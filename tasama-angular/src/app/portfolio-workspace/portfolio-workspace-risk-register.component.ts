import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';
import { PmConsoleFieldComponent } from '../shared/pm-console-field.component';
import {
  PmConsoleRegisterTableComponent,
  type PmConsoleRegisterTableCell,
  type PmConsoleRegisterTableColumn,
  type PmConsoleRegisterTableGroup,
  type PmConsoleRegisterTableRow,
} from '../shared/pm-console-register-table.component';
import { ProgramRow, Risk, type RiskExposure, type RiskLevel, type RiskStatus } from './portfolio-workspace.data';

export interface ProjectGroup {
  key: string;
  label: string;
  risks: Risk[];
}

export interface ProgramGroup {
  key: string;
  label: string;
  directRisks: Risk[];
  projects: ProjectGroup[];
}

export interface PortfolioGroup {
  key: string;
  label: string;
  directRisks: Risk[];
  programs: ProgramGroup[];
  standaloneProjects: ProjectGroup;
}

type RiskLevelFilter = RiskLevel;

interface RiskLevelFilterOption {
  id: RiskLevelFilter;
  label: string;
  itemName: string;
  emptyTitle: string;
  emptyDescription: string;
}

interface ProjectLinkOption {
  label: string;
  projectName: string;
  parentProgram?: string;
}

interface AddPortfolioRiskDraft {
  level: RiskLevel;
  program: string;
  project: string;
  riskName: string;
  owner: string;
  mitigation: string;
  lastReview: string;
  exposure: RiskExposure;
  status: RiskStatus;
}

const riskLevelFilterOptions: RiskLevelFilterOption[] = [
  {
    id: 'portfolio',
    label: 'Portfolio',
    itemName: 'portfolio risks',
    emptyTitle: 'No portfolio risks',
    emptyDescription: 'Portfolio-level risks will appear here when they are linked to this portfolio.',
  },
  {
    id: 'program',
    label: 'Program',
    itemName: 'program risks',
    emptyTitle: 'No program risks',
    emptyDescription: 'Program-level risks will appear here when they are linked to a program.',
  },
  {
    id: 'project',
    label: 'Project',
    itemName: 'project risks',
    emptyTitle: 'No project risks',
    emptyDescription: 'Project-level risks will appear here when they are linked to a project.',
  },
];

const riskTableColumns: PmConsoleRegisterTableColumn[] = [
  { id: 'id', label: 'Risk ID', minWidth: 84, maxWidth: 112 },
  { id: 'risk', label: 'Risk', minWidth: 190, maxWidth: 300 },
  { id: 'linkedTo', label: 'Level / Linked to', minWidth: 160, maxWidth: 260 },
  { id: 'parentContext', label: 'Parent context', minWidth: 180, maxWidth: 280, visible: false },
  { id: 'owner', label: 'Owner', minWidth: 130, maxWidth: 190 },
  { id: 'mitigation', label: 'Mitigation', minWidth: 190, maxWidth: 320 },
  { id: 'lastReview', label: 'Last Review', minWidth: 100, maxWidth: 140 },
  { id: 'exposure', label: 'Exposure', minWidth: 100, maxWidth: 136 },
  { id: 'status', label: 'Status', minWidth: 100, maxWidth: 140 },
  { id: 'actions', label: 'Actions', minWidth: 64, maxWidth: 80, align: 'right' },
];

@Component({
  selector: 'app-portfolio-workspace-risk-register',
  standalone: true,
  imports: [CommonModule, PmConsoleFieldComponent, PmConsolePlanDrawerComponent, PmConsoleRegisterTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="risk-register-host animation-slide" aria-label="Risk register">
      <div class="risk-table-panel">
        <app-pm-console-register-table
          [columns]="riskTableColumns"
          [rows]="activeRiskTableRows"
          [rowGroups]="activeRiskTableGroups"
          [storageKey]="activeStorageKey"
          [ariaLabel]="activeAriaLabel"
          [itemName]="activeRiskLevelOption.itemName"
          [showItemLabel]="false"
          groupedByLabel="Grouped By"
          [groupChipLabel]="activeGroupChipLabel"
          [selectable]="false"
          searchVariant="workspace"
          [showGroupBy]="activeRiskLevelFilter !== 'portfolio'"
          [searchPlaceholder]="activeSearchPlaceholder"
          [searchAriaLabel]="activeSearchAriaLabel"
          selectAllLabel="Select all risks"
          toolbarClass="pm-workspace-register-toolbar portfolio-risk-register-toolbar"
          addButtonLabel="Add Risk"
          addButtonAriaLabel="Add risk"
          [emptyTitle]="activeRiskLevelOption.emptyTitle"
          [emptyDescription]="activeRiskLevelOption.emptyDescription"
          (addItem)="openAddRiskDrawer()"
          (groupBy)="enableRiskGrouping()"
          (groupClear)="clearRiskGrouping()"
          (groupToggle)="toggleRiskGroup($event)"
        >
          <span registerTableToolbarLabel class="risk-filter-tabs" role="tablist" aria-label="Risk level tabs">
            @for (option of riskLevelFilterOptions; track option.id) {
              <button
                class="risk-filter-tab {{ option.id }}"
                type="button"
                role="tab"
                [id]="'risk-filter-tab-' + option.id"
                [class.is-active]="activeRiskLevelFilter === option.id"
                [attr.aria-selected]="activeRiskLevelFilter === option.id"
                (click)="setActiveRiskLevelFilter(option.id)"
              >
                <span>{{ option.label }}</span>
                <strong>{{ riskCount(option.id) }}</strong>
              </button>
            }
          </span>
        </app-pm-console-register-table>
      </div>

      @if (isAddRiskDrawerOpen) {
        <app-pm-console-plan-drawer
          title="Add risk"
          eyebrow="Risk Register"
          description="Create a risk and link it to the portfolio, a program, or a project."
          submitLabel="Add risk"
          closeAriaLabel="Close add risk drawer"
          panelClass="portfolio-risk-drawer"
          [submitDisabled]="!canSaveAddRiskDraft"
          (close)="closeAddRiskDrawer()"
          (submitForm)="saveAddRisk($event)"
        >
          <div planDrawerBody class="portfolio-risk-drawer-grid">
            <app-pm-console-field
              label="Link risk to"
              type="select"
              [value]="riskLevelLabel(addRiskDraft.level)"
              [options]="riskLevelOptions"
              ariaLabel="Link risk to"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskLevelFromLabel($event)"
            />

            @if (addRiskDraft.level === 'program') {
              <app-pm-console-field
                label="Program"
                type="select"
                [value]="addRiskDraft.program"
                [options]="programOptions"
                ariaLabel="Program"
                fieldClass="dependency-drawer-field"
                [mandatory]="true"
                (valueChange)="updateAddRiskDraft('program', $event)"
              />
            }

            @if (addRiskDraft.level === 'project') {
              <app-pm-console-field
                label="Project"
                type="select"
                [value]="addRiskDraft.project"
                [options]="projectOptions"
                ariaLabel="Project"
                fieldClass="dependency-drawer-field"
                [mandatory]="true"
                (valueChange)="updateAddRiskDraft('project', $event)"
              />
            }

            <app-pm-console-field
              label="Risk Name"
              type="textarea"
              [value]="addRiskDraft.riskName"
              placeholder="Type risk name here"
              ariaLabel="Risk Name"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              [wide]="true"
              [maxLength]="500"
              (valueChange)="updateAddRiskDraft('riskName', $event)"
            />
            <app-pm-console-field
              label="Risk Owner"
              type="select"
              [value]="addRiskDraft.owner"
              [options]="ownerOptions"
              ariaLabel="Risk Owner"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskDraft('owner', $event)"
            />
            <app-pm-console-field
              label="Exposure"
              type="select"
              [value]="valueLabel(addRiskDraft.exposure)"
              [options]="exposureOptions"
              ariaLabel="Exposure"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskExposure($event)"
            />
            <app-pm-console-field
              label="Status"
              type="select"
              [value]="valueLabel(addRiskDraft.status)"
              [options]="statusOptions"
              ariaLabel="Status"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              (valueChange)="updateAddRiskStatus($event)"
            />
            <app-pm-console-field
              label="Last Review"
              type="date"
              [value]="addRiskDraft.lastReview"
              ariaLabel="Last Review"
              fieldClass="dependency-drawer-field"
              (valueChange)="updateAddRiskDraft('lastReview', $event)"
            />
            <app-pm-console-field
              label="Mitigation"
              type="textarea"
              [value]="addRiskDraft.mitigation"
              placeholder="Describe the current mitigation or next control action"
              ariaLabel="Mitigation"
              fieldClass="dependency-drawer-field"
              [mandatory]="true"
              [wide]="true"
              (valueChange)="updateAddRiskDraft('mitigation', $event)"
            />
          </div>
        </app-pm-console-plan-drawer>
      }
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .risk-register-host {
      display: grid;
      flex: 1;
      gap: 14px;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      width: 100%;
    }

    .risk-filter-tabs {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .risk-filter-tab {
      align-items: center;
      background: #ffffff;
      border: 1px solid #e3e5e9;
      border-radius: 999px;
      color: #4f596a;
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      gap: 8px;
      height: 32px;
      justify-content: center;
      padding: 0 13px;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
      white-space: nowrap;
    }

    .risk-filter-tab:hover {
      border-color: #cfd5e1;
      color: #252a34;
    }

    .risk-filter-tab.is-active {
      background: rgba(16, 6, 159, 0.06);
      border-color: rgba(16, 6, 159, 0.2);
      color: var(--brand, #10069f);
    }

    .risk-filter-tab:focus-visible {
      outline: 2px solid rgba(16, 6, 159, 0.22);
      outline-offset: 2px;
    }

    .risk-filter-tab strong {
      align-items: center;
      background: #e3e5e9;
      border-radius: 999px;
      color: #4f596a;
      display: inline-flex;
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 700;
      height: 20px;
      justify-content: center;
      min-width: 20px;
      padding: 0 7px;
    }

    .risk-filter-tab.is-active strong {
      background: #ffffff;
      color: var(--brand, #10069f);
    }

    .risk-table-panel {
      min-height: 0;
      min-width: 0;
    }

    .risk-table-panel app-pm-console-register-table {
      height: 100%;
    }

    .portfolio-risk-drawer-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .portfolio-risk-drawer-grid ::ng-deep .wide {
      grid-column: 1 / -1;
    }

    .animation-slide {
      animation: slideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(8px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 760px) {
      .risk-filter-tabs {
        align-items: stretch;
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .risk-filter-tab {
        justify-content: space-between;
        min-width: 0;
        width: 100%;
      }

      .portfolio-risk-drawer-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PortfolioWorkspaceRiskRegisterComponent {
  @Input() risks: Risk[] = [];
  @Input() programs: ProgramRow[] = [];
  @Input() standaloneProjects: ProgramRow[] = [];
  @Input() portfolioName = 'Safe Security Portfolio';
  @Output() readonly riskCreate = new EventEmitter<Risk>();

  readonly riskLevelFilterOptions = riskLevelFilterOptions;
  readonly riskTableColumns = riskTableColumns;
  readonly riskLevelOptions = ['Portfolio', 'Program', 'Project'];
  readonly exposureOptions = ['Low', 'Medium', 'High', 'Critical'];
  readonly statusOptions = ['Watching', 'Monitoring', 'Active', 'Escalated'];
  activeRiskLevelFilter: RiskLevelFilter = 'project';
  riskGroupingEnabled = true;
  collapsedRiskGroupIds = new Set<string>();
  isAddRiskDrawerOpen = false;
  addRiskDraft: AddPortfolioRiskDraft = this.createAddRiskDraft();

  setActiveRiskLevelFilter(level: RiskLevelFilter): void {
    this.activeRiskLevelFilter = level;
    this.riskGroupingEnabled = level !== 'portfolio';
  }

  riskCount(level: RiskLevelFilter): number {
    return this.risks.filter((risk) => risk.level === level).length;
  }

  get activeRiskLevelOption(): RiskLevelFilterOption {
    return riskLevelFilterOptions.find((option) => option.id === this.activeRiskLevelFilter) || riskLevelFilterOptions[0];
  }

  get activeRisks(): Risk[] {
    return this.risks.filter((risk) => risk.level === this.activeRiskLevelFilter);
  }

  get programOptions(): string[] {
    return this.programs.map((program) => program.name);
  }

  get projectLinkOptions(): ProjectLinkOption[] {
    const programProjects = this.programs.flatMap((program) =>
      (program.projects || []).map((project) => ({
        label: `${program.name} / ${project.name}`,
        projectName: project.name,
        parentProgram: program.name,
      })),
    );
    const standalone = this.standaloneProjects.map((project) => ({
      label: `Standalone / ${project.name}`,
      projectName: project.name,
    }));
    return [...programProjects, ...standalone];
  }

  get projectOptions(): string[] {
    return this.projectLinkOptions.map((project) => project.label);
  }

  get ownerOptions(): string[] {
    const names = [
      this.portfolioName,
      ...this.programs.map((program) => program.manager),
      ...this.programs.flatMap((program) => (program.projects || []).map((project) => project.manager)),
      ...this.standaloneProjects.map((project) => project.manager),
      ...this.risks.map((risk) => risk.owner.name),
    ];
    return Array.from(new Set(names.filter((name) => name && name !== this.portfolioName))).sort();
  }

  get canSaveAddRiskDraft(): boolean {
    const draft = this.addRiskDraft;
    const hasTarget =
      draft.level === 'portfolio' ||
      (draft.level === 'program' && Boolean(draft.program.trim())) ||
      (draft.level === 'project' && Boolean(draft.project.trim()));

    return Boolean(
      hasTarget &&
        draft.riskName.trim() &&
        draft.owner.trim() &&
        draft.mitigation.trim() &&
        draft.exposure &&
        draft.status,
    );
  }

  get activeRiskTableRows(): PmConsoleRegisterTableRow[] {
    return this.riskTableRowsFor(this.activeRisks);
  }

  get activeRiskTableGroups(): PmConsoleRegisterTableGroup[] {
    if (!this.riskGroupingEnabled || this.activeRiskLevelFilter === 'portfolio') return [];

    const groupedRisks = new Map<string, { label: string; risks: Risk[] }>();

    for (const risk of this.activeRisks) {
      const group = this.riskGroupFor(risk);
      const existing = groupedRisks.get(group.key);
      if (existing) {
        existing.risks.push(risk);
      } else {
        groupedRisks.set(group.key, { label: group.label, risks: [risk] });
      }
    }

    return Array.from(groupedRisks.entries()).map(([key, group]) => ({
      id: key,
      label: group.label,
      countLabel: this.riskGroupCountLabel(group.risks.length),
      ariaLabel: `${group.label} risk group`,
      collapsed: this.collapsedRiskGroupIds.has(key),
      rows: this.riskTableRowsFor(group.risks),
    }));
  }

  get activeGroupChipLabel(): string {
    if (!this.riskGroupingEnabled) return '';
    if (this.activeRiskLevelFilter === 'portfolio') return '';
    if (this.activeRiskLevelFilter === 'program') return 'Program Name';
    if (this.activeRiskLevelFilter === 'project') return 'Project Name';
    return '';
  }

  get activeStorageKey(): string {
    return 'tasama.portfolioWorkspace.risks.visibleColumns.v2';
  }

  get activeAriaLabel(): string {
    return `${this.activeRiskLevelOption.label} risks register`;
  }

  get activeItemLabel(): string {
    const count = this.activeRisks.length;
    return count === 1 ? 'Items: 1 risk' : `Items: ${count} risks`;
  }

  get activeSearchPlaceholder(): string {
    return `Search ${this.activeRiskLevelOption.itemName}`;
  }

  get activeSearchAriaLabel(): string {
    return `Search ${this.activeRiskLevelOption.itemName}`;
  }

  openAddRiskDrawer(): void {
    this.addRiskDraft = this.createAddRiskDraft();
    this.isAddRiskDrawerOpen = true;
  }

  closeAddRiskDrawer(): void {
    this.isAddRiskDrawerOpen = false;
  }

  enableRiskGrouping(): void {
    if (this.activeRiskLevelFilter === 'portfolio') return;
    this.riskGroupingEnabled = true;
  }

  clearRiskGrouping(): void {
    this.riskGroupingEnabled = false;
    this.collapsedRiskGroupIds = new Set<string>();
  }

  toggleRiskGroup(groupId: string): void {
    if (this.collapsedRiskGroupIds.has(groupId)) {
      this.collapsedRiskGroupIds.delete(groupId);
    } else {
      this.collapsedRiskGroupIds.add(groupId);
    }
    this.collapsedRiskGroupIds = new Set(this.collapsedRiskGroupIds);
  }

  updateAddRiskDraft<K extends keyof AddPortfolioRiskDraft>(field: K, value: AddPortfolioRiskDraft[K]): void {
    this.addRiskDraft = {
      ...this.addRiskDraft,
      [field]: value,
    };
  }

  updateAddRiskLevel(level: RiskLevel): void {
    this.addRiskDraft = {
      ...this.addRiskDraft,
      level,
      program: level === 'program' ? this.addRiskDraft.program || this.programOptions[0] || '' : this.addRiskDraft.program,
      project: level === 'project' ? this.addRiskDraft.project || this.projectOptions[0] || '' : this.addRiskDraft.project,
    };
  }

  updateAddRiskLevelFromLabel(label: string): void {
    this.updateAddRiskLevel(this.riskLevelFromLabel(label));
  }

  updateAddRiskExposure(label: string): void {
    this.updateAddRiskDraft('exposure', this.exposureFromLabel(label));
  }

  updateAddRiskStatus(label: string): void {
    this.updateAddRiskDraft('status', this.statusFromLabel(label));
  }

  saveAddRisk(event: Event): void {
    event.preventDefault();
    if (!this.canSaveAddRiskDraft) return;

    const draft = this.addRiskDraft;
    const projectLink = draft.level === 'project' ? this.projectLinkOptions.find((project) => project.label === draft.project) : null;
    const risk: Risk = {
      id: this.nextRiskId(),
      name: draft.riskName.trim(),
      level: draft.level,
      linkedTo: draft.level === 'portfolio' ? this.portfolioName : draft.level === 'program' ? draft.program : projectLink?.projectName || draft.project,
      parentProgram: draft.level === 'project' ? projectLink?.parentProgram : undefined,
      parentPortfolio: draft.level === 'portfolio' ? undefined : this.portfolioName,
      owner: {
        name: draft.owner.trim(),
        initials: this.initialsFor(draft.owner),
      },
      mitigation: draft.mitigation.trim(),
      lastReview: this.displayDate(draft.lastReview),
      exposure: draft.exposure,
      status: draft.status,
    };

    this.riskCreate.emit(risk);
    this.closeAddRiskDrawer();
  }

  riskLevelLabel(level: RiskLevel): string {
    if (level === 'portfolio') return 'Portfolio';
    if (level === 'program') return 'Program';
    return 'Project';
  }

  private riskTableRowsFor(risks: Risk[]): PmConsoleRegisterTableRow[] {
    return risks.map((risk) => this.riskTableRowFor(risk));
  }

  private riskTableRowFor(risk: Risk): PmConsoleRegisterTableRow {
    const cells: Record<string, PmConsoleRegisterTableCell> = {
      id: { kind: 'text', text: risk.id, strong: true },
      risk: {
        kind: 'primary',
        title: risk.name,
        ariaLabel: `View ${risk.id}: ${risk.name}`,
      },
      linkedTo: {
        kind: 'chip-text',
        chipLabel: this.riskLevelLabel(risk.level),
        chipTone: risk.level,
        text: risk.linkedTo,
      },
      parentContext: {
        kind: 'text',
        text: this.parentContextLabel(risk),
        muted: risk.level === 'portfolio',
      },
      owner: {
        kind: 'person',
        title: risk.owner.name,
        initials: risk.owner.initials,
      },
      mitigation: {
        kind: 'text',
        text: risk.mitigation,
      },
      lastReview: {
        kind: 'text',
        text: risk.lastReview,
        muted: true,
      },
      exposure: {
        kind: 'status',
        label: this.valueLabel(risk.exposure),
        tone: this.exposureTone(risk.exposure),
      },
      status: {
        kind: 'status',
        label: this.valueLabel(risk.status),
        tone: this.statusTone(risk.status),
      },
      actions: {
        kind: 'menu',
        ariaLabel: `Actions for ${risk.id}`,
        actions: [
          { id: 'manage', label: 'Manage', icon: 'panel-right-open', ariaLabel: `Manage ${risk.id}` },
          { id: 'edit', label: 'Edit', icon: 'pencil', ariaLabel: `Edit ${risk.id}` },
        ],
      },
    };

    return {
      id: risk.id,
      ariaLabel: `${this.riskLevelLabel(risk.level)} risk ${risk.id}: ${risk.name}`,
      clickable: false,
      cells,
    };
  }

  private riskGroupFor(risk: Risk): { key: string; label: string } {
    const label = risk.linkedTo || this.riskFallbackGroupLabel(risk.level);
    return {
      key: `${risk.level}::${label}`,
      label,
    };
  }

  private riskFallbackGroupLabel(level: RiskLevel): string {
    if (level === 'portfolio') return this.portfolioName || 'Portfolio';
    if (level === 'program') return 'Unassigned program';
    return 'Unassigned project';
  }

  private riskGroupCountLabel(count: number): string {
    return count === 1 ? '1 risk' : `${count} risks`;
  }

  private parentContextLabel(risk: Risk): string {
    if (risk.level === 'portfolio') return 'Portfolio level';
    if (risk.level === 'program') return risk.parentPortfolio || 'No portfolio linked';

    const parents = [risk.parentProgram, risk.parentPortfolio].filter(Boolean);
    return parents.length ? parents.join(' / ') : 'No program linked';
  }

  private exposureTone(exposure: Risk['exposure']): string {
    if (exposure === 'critical') return 'red';
    if (exposure === 'high') return 'amber';
    if (exposure === 'low') return 'neutral';
    return 'blue';
  }

  private statusTone(status: Risk['status']): string {
    if (status === 'escalated') return 'red';
    if (status === 'active') return 'amber';
    if (status === 'monitoring') return 'blue';
    return 'neutral';
  }

  valueLabel(value: string): string {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private riskLevelFromLabel(label: string): RiskLevel {
    const normalized = label.toLowerCase();
    if (normalized === 'program') return 'program';
    if (normalized === 'project') return 'project';
    return 'portfolio';
  }

  private exposureFromLabel(label: string): RiskExposure {
    const normalized = label.toLowerCase();
    if (normalized === 'critical') return 'critical';
    if (normalized === 'high') return 'high';
    if (normalized === 'low') return 'low';
    return 'medium';
  }

  private statusFromLabel(label: string): RiskStatus {
    const normalized = label.toLowerCase();
    if (normalized === 'escalated') return 'escalated';
    if (normalized === 'monitoring') return 'monitoring';
    if (normalized === 'watching') return 'watching';
    return 'active';
  }

  private createAddRiskDraft(): AddPortfolioRiskDraft {
    return {
      level: this.activeRiskLevelFilter,
      program: this.programOptions[0] || '',
      project: this.projectOptions[0] || '',
      riskName: '',
      owner: this.ownerOptions[0] || '',
      mitigation: '',
      lastReview: this.todayDateInput(),
      exposure: 'medium',
      status: 'active',
    };
  }

  private nextRiskId(): string {
    const next = this.risks.reduce((max, risk) => {
      const match = risk.id.match(/\d+$/);
      return match ? Math.max(max, Number(match[0])) : max;
    }, 0) + 1;
    return `RSK-${String(next).padStart(2, '0')}`;
  }

  private initialsFor(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'R';
  }

  private todayDateInput(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private displayDate(value: string): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${month}/${day}/${year}`;
  }
}
