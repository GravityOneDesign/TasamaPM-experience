import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { Benefit } from './portfolio-workspace.data';
import {
  PortfolioRegisterStructureColumn,
  PortfolioRegisterStructureRow,
  PortfolioRegisterStructureTableComponent,
} from './portfolio-register-structure-table.component';

interface BenefitProjectGroup {
  key: string;
  label: string;
  benefits: Benefit[];
}

interface BenefitProgramGroup {
  key: string;
  label: string;
  directBenefits: Benefit[];
  projects: BenefitProjectGroup[];
}

const benefitRegisterColumns: PortfolioRegisterStructureColumn[] = [
  { id: 'benefitNumber', label: 'Benefit Number', width: '13%', className: 'nowrap' },
  { id: 'benefitCategory', label: 'Benefit Category', width: '16%' },
  { id: 'benefitName', label: 'Benefit Name', width: '30%' },
  { id: 'owner', label: 'Owner', width: '17%' },
  { id: 'realisationDate', label: 'Realisation Date', width: '12%' },
  { id: 'benefitState', label: 'Benefit State', width: '12%' },
];

@Component({
  selector: 'app-portfolio-workspace-benefits-register',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PortfolioRegisterStructureTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="portfolio-benefit-register" aria-label="Benefit register">
      <header class="portfolio-register-toolbar" aria-label="Benefit register tools">
        <div class="portfolio-register-toolbar-left">
          <span class="portfolio-register-total">{{ benefitCountLabel(filteredBenefits.length) }}</span>
        </div>
        <div class="portfolio-register-toolbar-actions">
          <label class="portfolio-register-search" [class.has-query]="searchQuery.trim().length > 0" title="Search benefits">
            <span pmConsoleIcon="search" aria-hidden="true"></span>
            <input
              type="search"
              [value]="searchQuery"
              placeholder="Search benefits"
              aria-label="Search benefits"
              (input)="setSearchQuery($event)"
            />
          </label>
          <button class="portfolio-register-tool" type="button" aria-label="Filter benefits">
            <span pmConsoleIcon="filter" aria-hidden="true"></span>
            <span>Filter</span>
          </button>
          <button class="portfolio-register-tool" type="button" aria-label="Export benefits">
            <span pmConsoleIcon="download" aria-hidden="true"></span>
            <span>Export</span>
          </button>
          <button class="portfolio-register-tool square" type="button" aria-label="Benefit register settings">
            <span pmConsoleIcon="settings" aria-hidden="true"></span>
          </button>
        </div>
      </header>

      <app-portfolio-register-structure-table
        [columns]="columns"
        [rows]="structureRows"
        [showHierarchyConnectors]="false"
        ariaLabel="Benefits register"
        emptyTitle="No benefits match this view"
        emptyBody="Clear the search to show programme and project benefits."
        (groupToggle)="toggleGroup($event)"
      />
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

    .portfolio-benefit-register {
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

    @media (max-width: 920px) {
      .portfolio-benefit-register {
        padding: 10px 12px 16px;
      }

      .portfolio-register-toolbar-actions {
        width: 100%;
      }
    }
  `]
})
export class PortfolioWorkspaceBenefitsRegisterComponent {
  @Input() benefits: Benefit[] = [];

  readonly columns = benefitRegisterColumns;
  collapsedGroupIds = new Set<string>();
  searchQuery = '';

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

  get filteredBenefits(): Benefit[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.benefits;
    return this.benefits.filter((benefit) => this.matchesBenefitSearch(benefit, query));
  }

  get structureRows(): PortfolioRegisterStructureRow[] {
    const rows: PortfolioRegisterStructureRow[] = [];

    for (const program of this.programGroups) {
      const programHasChildren = program.directBenefits.length > 0 || program.projects.length > 0;
      rows.push(this.groupRow(
        program.key,
        program.label,
        'program',
        this.benefitCountLabel(this.programBenefitCount(program)),
        0,
        '',
        programHasChildren ? 'program-root-node branch-start-node' : 'program-root-node',
      ));
      if (this.isCollapsed(program.key)) continue;

      rows.push(...program.directBenefits.map((benefit) => this.benefitRow(benefit, 1, 'program-root-record-node')));
      for (const [projectIndex, project] of program.projects.entries()) {
        const isLastProject = projectIndex === program.projects.length - 1;
        const projectCollapsed = this.isCollapsed(project.key);
        rows.push(this.groupRow(
          project.key,
          project.label,
          'project',
          this.benefitCountLabel(project.benefits.length),
          1,
          '',
          isLastProject && projectCollapsed ? 'root-project-node project-terminal-node' : 'root-project-node',
        ));
        if (!this.isCollapsed(project.key)) {
          rows.push(...project.benefits.map((benefit, benefitIndex) => {
            const isLastBenefit = benefitIndex === project.benefits.length - 1;
            return this.benefitRow(benefit, 2, 'root-project-record-node', isLastBenefit, isLastProject && isLastBenefit);
          }));
        }
      }
    }

    if (this.standaloneGroups.length) {
      const standaloneRootId = 'benefit-standalone-root';
      rows.push(this.groupRow(
        standaloneRootId,
        'Standalone Projects',
        'standalone',
        this.benefitCountLabel(this.standaloneBenefitCount),
        0,
        '',
        'standalone-root-node',
      ));
      if (!this.isCollapsed(standaloneRootId)) {
        for (const [projectIndex, project] of this.standaloneGroups.entries()) {
          const isLastProject = projectIndex === this.standaloneGroups.length - 1;
          const projectCollapsed = this.isCollapsed(project.key);
          rows.push(this.groupRow(
            project.key,
            project.label,
            'project',
            this.benefitCountLabel(project.benefits.length),
            1,
            '',
            isLastProject && projectCollapsed ? 'root-standalone-project-node project-terminal-node' : 'root-standalone-project-node',
          ));
          if (!this.isCollapsed(project.key)) {
            rows.push(...project.benefits.map((benefit, benefitIndex) => {
              const isLastBenefit = benefitIndex === project.benefits.length - 1;
              return this.benefitRow(benefit, 2, 'root-standalone-record-node', isLastBenefit, isLastProject && isLastBenefit);
            }));
          }
        }
      }
    }

    return rows;
  }

  benefitCountLabel(count: number): string {
    return count === 1 ? '1 benefit' : `${count} benefits`;
  }

  private get programGroups(): BenefitProgramGroup[] {
    const programsMap = new Map<string, { directBenefits: Benefit[]; projectsMap: Map<string, Benefit[]> }>();

    for (const benefit of this.filteredBenefits) {
      if (benefit.level === 'program') {
        const programName = benefit.linkedTo;
        if (!programsMap.has(programName)) {
          programsMap.set(programName, { directBenefits: [], projectsMap: new Map() });
        }
        programsMap.get(programName)!.directBenefits.push(benefit);
        continue;
      }

      if (!benefit.parentProgram) continue;
      if (!programsMap.has(benefit.parentProgram)) {
        programsMap.set(benefit.parentProgram, { directBenefits: [], projectsMap: new Map() });
      }
      const program = programsMap.get(benefit.parentProgram)!;
      if (!program.projectsMap.has(benefit.linkedTo)) {
        program.projectsMap.set(benefit.linkedTo, []);
      }
      program.projectsMap.get(benefit.linkedTo)!.push(benefit);
    }

    return Array.from(programsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([programName, program]) => ({
        key: `benefit-program::${programName}`,
        label: programName,
        directBenefits: program.directBenefits,
        projects: Array.from(program.projectsMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([projectName, benefits]) => ({
            key: `benefit-program::${programName}::project::${projectName}`,
            label: projectName,
            benefits,
          })),
      }));
  }

  private get standaloneGroups(): BenefitProjectGroup[] {
    const standaloneMap = new Map<string, Benefit[]>();
    for (const benefit of this.filteredBenefits) {
      if (benefit.level !== 'project' || benefit.parentProgram) continue;
      if (!standaloneMap.has(benefit.linkedTo)) {
        standaloneMap.set(benefit.linkedTo, []);
      }
      standaloneMap.get(benefit.linkedTo)!.push(benefit);
    }

    return Array.from(standaloneMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([projectName, benefits]) => ({
        key: `benefit-standalone::${projectName}`,
        label: projectName,
        benefits,
      }));
  }

  private benefitRow(
    benefit: Benefit,
    depth: 0 | 1 | 2,
    branchClass: string,
    branchTerminal = false,
    programBranchTerminal = false,
  ): PortfolioRegisterStructureRow {
    return {
      kind: 'row',
      id: benefit.id,
      depth,
      branchClass,
      branchTerminal,
      programBranchTerminal,
      cells: {
        benefitNumber: { kind: 'text', text: benefit.id },
        benefitCategory: { kind: 'text', text: benefit.category },
        benefitName: { kind: 'primary', title: benefit.name, subtitle: benefit.linkedTo },
        owner: { kind: 'person', text: benefit.owner.name, initials: benefit.owner.initials },
        realisationDate: { kind: 'text', text: this.dateLabel(benefit.targetDate) },
        benefitState: { kind: 'status', text: this.stateLabel(benefit.status), tone: this.stateTone(benefit.status) },
      },
    };
  }

  private groupRow(
    id: string,
    label: string,
    level: 'program' | 'project' | 'standalone',
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

  private programBenefitCount(program: BenefitProgramGroup): number {
    return program.directBenefits.length + program.projects.reduce((total, project) => total + project.benefits.length, 0);
  }

  private get standaloneBenefitCount(): number {
    return this.standaloneGroups.reduce((total, project) => total + project.benefits.length, 0);
  }

  private matchesBenefitSearch(benefit: Benefit, query: string): boolean {
    return [
      benefit.id,
      benefit.category,
      benefit.name,
      benefit.linkedTo,
      benefit.parentProgram || '',
      benefit.owner.name,
      benefit.targetDate,
      benefit.status,
    ].some((value) => value.toLowerCase().includes(query));
  }

  private stateLabel(status: string): string {
    return status
      .replace(/-/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private stateTone(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('track') || normalized.includes('completed')) return 'green';
    if (normalized.includes('review')) return 'amber';
    if (normalized.includes('alert') || normalized.includes('delay')) return 'red';
    return 'neutral';
  }

  private dateLabel(value: string): string {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return value;
    const [, month, day, year] = match;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${Number(day)} ${monthNames[Number(month) - 1] || month} ${year}`;
  }
}
