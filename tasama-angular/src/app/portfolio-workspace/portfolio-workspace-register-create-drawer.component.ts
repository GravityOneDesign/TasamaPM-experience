import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PmConsoleFieldComponent, type PmConsoleFieldOption } from '../shared/pm-console-field.component';
import { PmConsolePlanDrawerComponent } from '../pm-console-plan-drawer.component';

export type PortfolioRegisterCreateKind = 'program' | 'project';

export interface PortfolioProgramCreatePayload {
  readonly name: string;
  readonly relatedPortfolio: string;
  readonly manager: string;
}

export interface PortfolioProjectCreatePayload {
  readonly name: string;
  readonly programId: string;
  readonly manager: string;
  readonly complete: boolean;
}

interface ProgramCreateDraft {
  readonly name: string;
  readonly relatedPortfolio: string;
  readonly manager: string;
}

interface ProjectCreateDraft {
  readonly name: string;
  readonly programId: string;
  readonly manager: string;
}

@Component({
  selector: 'app-portfolio-workspace-register-create-drawer',
  standalone: true,
  imports: [CommonModule, PmConsoleFieldComponent, PmConsolePlanDrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (kind === 'program') {
      <app-pm-console-plan-drawer
        title="Add Program"
        description="Create a program and keep it visible in the Program & Project Register."
        submitLabel="Save"
        cancelLabel="Cancel"
        closeAriaLabel="Close add program drawer"
        panelClass="portfolio-register-create-drawer"
        [submitDisabled]="!canSaveProgram"
        (close)="close.emit()"
        (submitForm)="saveProgram($event)"
      >
        <div planDrawerBody class="register-create-form program-create-form">
          <app-pm-console-field
            label="Name"
            placeholder="Enter program name"
            ariaLabel="Program name"
            fieldClass="dependency-drawer-field"
            [mandatory]="true"
            [value]="programDraft.name"
            (valueChange)="updateProgramDraft('name', $event)"
          />
          <app-pm-console-field
            label="Related Portfolio"
            type="select"
            ariaLabel="Related portfolio"
            fieldClass="dependency-drawer-field"
            [mandatory]="true"
            [options]="portfolioOptions"
            [value]="programDraft.relatedPortfolio"
            (valueChange)="updateProgramDraft('relatedPortfolio', $event)"
          />
          <app-pm-console-field
            label="Program Manager"
            type="select"
            placeholder="Select Program Manager"
            ariaLabel="Program manager"
            fieldClass="dependency-drawer-field"
            [options]="managerOptions"
            [value]="programDraft.manager"
            (valueChange)="updateProgramDraft('manager', $event)"
          />
        </div>
      </app-pm-console-plan-drawer>
    } @else {
      <app-pm-console-plan-drawer
        title="Add New Project Plan"
        description="Create a project plan shell from the register."
        cancelLabel="Close"
        closeAriaLabel="Close add project drawer"
        panelClass="portfolio-register-create-drawer compact-project-drawer"
        [hideFooter]="true"
        (close)="close.emit()"
        (submitForm)="saveProject($event)"
      >
        <div planDrawerBody class="register-create-form project-create-form">
          <app-pm-console-field
            label="Project Name"
            placeholder="Enter Project Name"
            ariaLabel="Project name"
            fieldClass="dependency-drawer-field"
            [wide]="true"
            [mandatory]="true"
            [value]="projectDraft.name"
            (valueChange)="updateProjectDraft('name', $event)"
          />
          <app-pm-console-field
            label="Program"
            type="select"
            placeholder="Select Program"
            ariaLabel="Program"
            fieldClass="dependency-drawer-field"
            [mandatory]="true"
            [options]="programOptions"
            [value]="projectDraft.programId"
            (valueChange)="updateProjectDraft('programId', $event)"
          />
          <app-pm-console-field
            label="Project Manager"
            type="select"
            placeholder="Select Project Manager"
            ariaLabel="Project manager"
            fieldClass="dependency-drawer-field"
            [mandatory]="true"
            [options]="managerOptions"
            [value]="projectDraft.manager"
            (valueChange)="updateProjectDraft('manager', $event)"
          />
        </div>

        <footer planDrawerFooter class="register-create-footer">
          <button class="register-create-submit" type="submit" [disabled]="!canSaveProject">Save</button>
          <button class="register-create-submit" type="button" [disabled]="!canSaveProject" (click)="saveProject($event, true)">Save and Complete</button>
          <button class="register-create-cancel" type="button" (click)="close.emit()">Close</button>
        </footer>
      </app-pm-console-plan-drawer>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }

    .register-create-form {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .project-create-form {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .register-create-form ::ng-deep .wide {
      grid-column: 1 / -1;
    }

    .register-create-footer {
      align-items: center;
      background: rgba(255, 255, 255, 0.96);
      border-top: 1px solid #e4e7ef;
      display: flex;
      flex: 0 0 auto;
      gap: 10px;
      justify-content: flex-end;
      min-height: 58px;
      padding: 11px 16px 13px;
    }

    .register-create-cancel,
    .register-create-submit {
      align-items: center;
      border-radius: 8px;
      display: inline-flex;
      font-size: 11px;
      font-weight: 600;
      height: 34px;
      justify-content: center;
      padding: 0 16px;
      white-space: nowrap;
    }

    .register-create-submit {
      background: #10069f;
      border: 1px solid #10069f;
      color: #ffffff;
      min-width: 84px;
    }

    .register-create-submit:disabled {
      background: #c9d0e1;
      border-color: #c9d0e1;
      color: #f8fbff;
      cursor: default;
    }

    .register-create-cancel {
      background: #ffffff;
      border: 1px solid #cfd6e3;
      color: #10069f;
    }

    .register-create-cancel:hover,
    .register-create-cancel:focus-visible {
      background: #f7f7ff;
      outline: none;
    }

    @media (max-width: 760px) {
      .register-create-form {
        grid-template-columns: 1fr;
      }

      .register-create-footer {
        align-items: stretch;
        flex-direction: column;
      }

      .register-create-cancel,
      .register-create-submit {
        width: 100%;
      }
    }
  `],
})
export class PortfolioWorkspaceRegisterCreateDrawerComponent implements OnChanges {
  @Input() kind: PortfolioRegisterCreateKind = 'project';
  @Input() portfolioOptions: readonly string[] = ['Tasama Client 1'];
  @Input() programOptions: readonly PmConsoleFieldOption[] = [];
  @Input() managerOptions: readonly PmConsoleFieldOption[] = [];

  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly programCreate = new EventEmitter<PortfolioProgramCreatePayload>();
  @Output() readonly projectCreate = new EventEmitter<PortfolioProjectCreatePayload>();

  programDraft: ProgramCreateDraft = this.createProgramDraft();
  projectDraft: ProjectCreateDraft = this.createProjectDraft();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kind']) {
      this.programDraft = this.createProgramDraft();
      this.projectDraft = this.createProjectDraft();
      return;
    }

    if (changes['portfolioOptions'] && !this.programDraft.relatedPortfolio) {
      this.programDraft = {
        ...this.programDraft,
        relatedPortfolio: this.defaultPortfolio,
      };
    }
  }

  get canSaveProgram(): boolean {
    return Boolean(this.programDraft.name.trim() && this.programDraft.relatedPortfolio.trim());
  }

  get canSaveProject(): boolean {
    return Boolean(
      this.projectDraft.name.trim() &&
      this.projectDraft.programId.trim() &&
      this.projectDraft.manager.trim()
    );
  }

  updateProgramDraft<K extends keyof ProgramCreateDraft>(field: K, value: ProgramCreateDraft[K]): void {
    this.programDraft = {
      ...this.programDraft,
      [field]: value,
    };
  }

  updateProjectDraft<K extends keyof ProjectCreateDraft>(field: K, value: ProjectCreateDraft[K]): void {
    this.projectDraft = {
      ...this.projectDraft,
      [field]: value,
    };
  }

  saveProgram(event: Event): void {
    event.preventDefault();
    if (!this.canSaveProgram) return;

    this.programCreate.emit({
      name: this.programDraft.name.trim(),
      relatedPortfolio: this.programDraft.relatedPortfolio.trim(),
      manager: this.programDraft.manager.trim(),
    });
  }

  saveProject(event: Event, complete = false): void {
    event.preventDefault();
    if (!this.canSaveProject) return;

    this.projectCreate.emit({
      name: this.projectDraft.name.trim(),
      programId: this.projectDraft.programId.trim(),
      manager: this.projectDraft.manager.trim(),
      complete,
    });
  }

  private createProgramDraft(): ProgramCreateDraft {
    return {
      name: '',
      relatedPortfolio: this.defaultPortfolio,
      manager: '',
    };
  }

  private createProjectDraft(): ProjectCreateDraft {
    return {
      name: '',
      programId: '',
      manager: '',
    };
  }

  private get defaultPortfolio(): string {
    return this.portfolioOptions[0] || 'Tasama Client 1';
  }
}
