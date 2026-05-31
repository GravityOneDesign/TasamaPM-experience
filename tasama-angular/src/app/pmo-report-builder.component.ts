import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal, computed } from '@angular/core';

export interface ReportTemplate {
  id: string;
  name: string;
  selected: boolean;
}

export interface ScopeProject {
  id: string;
  name: string;
  selected: boolean;
}

export interface ScopeProgram {
  id: string;
  name: string;
  type: 'program' | 'standalone-project';
  selected: boolean;
  expanded: boolean;
  projects: ScopeProject[];
}

export interface ScopePortfolio {
  id: string;
  name: string;
  selected: boolean;
  expanded: boolean;
  programs: ScopeProgram[];
}
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmConsoleFieldComponent } from './shared/pm-console-field.component';

@Component({
  selector: 'app-pmo-report-builder',
  standalone: true,
  imports: [PmConsoleIconComponent, PmConsoleFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="pmo-report-builder-canvas">
      <div class="pmo-report-builder-sidebar">
        <button class="pmo-report-builder-back" type="button" aria-label="Back to Custom Reports" (click)="backSelected.emit()">
          <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
          <span>Report Builder</span>
        </button>

        <nav class="pmo-report-builder-steps" aria-label="Report builder steps">
          <div class="pmo-report-builder-step" [class.is-active]="currentStep() === 1" [class.is-completed]="currentStep() > 1" (click)="setStep(1)" style="cursor: pointer;">
            <div class="step-indicator">
              @if (currentStep() > 1) {
                <span pmConsoleIcon="check" aria-hidden="true" class="step-check"></span>
              } @else {
                <span class="step-dot"></span>
              }
            </div>
            <div class="step-content">
              <span class="step-label">Step 1</span>
              <span class="step-title">Report Profile</span>
            </div>
          </div>
          
          <div class="pmo-report-builder-step" [class.is-active]="currentStep() === 2" [class.is-completed]="currentStep() > 2" (click)="setStep(2)" style="cursor: pointer;">
            <div class="step-indicator">
              @if (currentStep() > 2) {
                <span pmConsoleIcon="check" aria-hidden="true" class="step-check"></span>
              } @else if (currentStep() === 2) {
                <span class="step-dot"></span>
              } @else {
                <span class="step-number">2</span>
              }
            </div>
            <div class="step-content">
              <span class="step-label">Step 2</span>
              <span class="step-title">Add templates</span>
            </div>
          </div>

          <div class="pmo-report-builder-step" [class.is-active]="currentStep() === 3" [class.is-completed]="currentStep() > 3" (click)="setStep(3)" style="cursor: pointer;">
            <div class="step-indicator">
              @if (currentStep() > 3) {
                <span pmConsoleIcon="check" aria-hidden="true" class="step-check"></span>
              } @else if (currentStep() === 3) {
                <span class="step-dot"></span>
              } @else {
                <span class="step-number">3</span>
              }
            </div>
            <div class="step-content">
              <span class="step-label">Step 3</span>
              <span class="step-title">Select reporting scope</span>
              <span class="step-subtitle">Portfolios, Programs, Project</span>
            </div>
          </div>

          <div class="pmo-report-builder-step" [class.is-active]="currentStep() === 4" [class.is-completed]="currentStep() > 4" (click)="setStep(4)" style="cursor: pointer;">
            <div class="step-indicator">
              @if (currentStep() > 4) {
                <span pmConsoleIcon="check" aria-hidden="true" class="step-check"></span>
              } @else if (currentStep() === 4) {
                <span class="step-dot"></span>
              } @else {
                <span class="step-number">4</span>
              }
            </div>
            <div class="step-content">
              <span class="step-label">Step 4</span>
              <span class="step-title">Download or Schedule</span>
            </div>
          </div>
        </nav>

        <div class="pmo-report-builder-sidebar-bg" aria-hidden="true">
          <img src="assets/workspace-line-art.svg" alt="" />
        </div>
      </div>

      <div class="pmo-report-builder-content">
        @if (currentStep() === 1) {
          <section class="pmo-report-step-panel">
            <header class="pmo-report-step-header">
              <div class="pmo-report-step-title-group">
                <div class="pmo-report-step-icon">
                  <span pmConsoleIcon="pencil" aria-hidden="true"></span>
                </div>
                <div class="pmo-report-step-title">
                  <h2>Report Profile</h2>
                  <p>Lorem ipsum dolor sit amet solicitude suscipit sem quis antique semper eu justo.</p>
                </div>
              </div>
              <div class="pmo-report-step-actions">
                <button class="pmo-report-step-action-back" type="button" (click)="backSelected.emit()">
                  <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
                  <span>Back</span>
                </button>
                <button class="pmo-report-step-action-next" type="button" (click)="setStep(2)">
                  <span>Next</span>
                  <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
                </button>
              </div>
            </header>

            <div class="pmo-report-step-body">
              <div class="pmo-report-form">
                <div class="pmo-report-form-group">
                  <label for="report-title">
                    Report Title<span class="required" aria-hidden="true">*</span>
                  </label>
                  <input id="report-title" class="pmo-report-input" [class.has-error]="showTitleError()" type="text" placeholder="Enter Title" [value]="reportTitle()" (input)="onTitleInput($event)" />
                  @if (showTitleError()) {
                    <div class="pmo-report-error-msg">Please fill out the Report Title</div>
                  }
                </div>

                <div class="pmo-report-form-group">
                  <label for="report-description">Description</label>
                  <textarea id="report-description" class="pmo-report-textarea" placeholder="Enter Portfolio Dossier Description"></textarea>
                  <span class="char-count">3000 characters remaining</span>
                </div>

                <div class="pmo-report-form-group">
                  <label for="report-tags">Tags</label>
                  <div class="pmo-report-select-wrapper">
                    <select id="report-tags" class="pmo-report-select">
                      <option value="" disabled selected>Select</option>
                    </select>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true" class="select-icon"></span>
                  </div>
                  
                  <div class="pmo-report-tags-list">
                    <span class="pmo-report-tag">
                      high priority <button type="button" aria-label="Remove tag"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                    </span>
                    <span class="pmo-report-tag">
                      watchlist <button type="button" aria-label="Remove tag"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                    </span>
                    <span class="pmo-report-tag">
                      critical path <button type="button" aria-label="Remove tag"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        } @else if (currentStep() === 2) {
          <section class="pmo-report-step-panel pmo-report-step2-panel">
            <header class="pmo-report-step-header">
              <div class="pmo-report-step-title-group">
                <div class="pmo-report-step-icon step2-icon">
                  <span pmConsoleIcon="layers" aria-hidden="true"></span>
                </div>
                <div class="pmo-report-step-title">
                  <h2>Add templates</h2>
                  <p>Select one or more report templates</p>
                </div>
              </div>
              <div class="pmo-report-step-actions">
                <button class="pmo-report-step-action-back" type="button" (click)="setStep(1)">
                  <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
                  <span>Back</span>
                </button>
                <button class="pmo-report-step-action-next" type="button" (click)="setStep(3)">
                  <span>Next</span>
                  <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
                </button>
              </div>
            </header>

            <div class="pmo-report-step-body pmo-report-step2-body">
              <div class="pmo-templates-sidebar">
                <div class="pmo-templates-header">
                  <span>Standard Templates ({{ selectedTemplatesCount }}/15 selected)</span>
                </div>
                <div class="pmo-templates-list">
                  @for (template of templates(); track template.id) {
                    <div 
                      class="pmo-template-item" 
                      [class.is-active]="previewTemplateId() === template.id"
                      (click)="setPreviewTemplate(template.id)"
                    >
                      <label class="pmo-template-checkbox" (click)="$event.stopPropagation()">
                        <input type="checkbox" [checked]="template.selected" (change)="toggleTemplateSelection(template.id)">
                        <span class="checkbox-custom">
                          @if (template.selected) {
                            <span pmConsoleIcon="check" aria-hidden="true"></span>
                          }
                        </span>
                      </label>
                      <span class="pmo-template-name">{{ template.name }}</span>
                      @if (previewTemplateId() === template.id) {
                        <span pmConsoleIcon="arrow-right" aria-hidden="true" class="pmo-template-active-icon"></span>
                      }
                    </div>
                  }
                </div>
              </div>
              <div class="pmo-template-preview-area">
                <div class="pmo-template-preview-header">
                  <h3>Template preview</h3>
                  <button type="button" class="pmo-template-preview-expand" aria-label="Expand preview">
                    <span pmConsoleIcon="maximize" aria-hidden="true"></span>
                  </button>
                </div>
                <div class="pmo-template-preview-content">
                  <div class="pmo-template-preview-placeholder">
                    <span>Preview for {{ getTemplateName(previewTemplateId()) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        } @else if (currentStep() === 3) {
          <section class="pmo-report-step-panel pmo-report-step3-panel">
            <header class="pmo-report-step-header">
              <div class="pmo-report-step-title-group">
                <div class="pmo-report-step-icon step3-icon">
                  <span pmConsoleIcon="briefcase" aria-hidden="true"></span>
                </div>
                <div class="pmo-report-step-title">
                  <h2>Select reporting scope</h2>
                  <p>Portfolios, Programs, Projects</p>
                </div>
              </div>
              <div class="pmo-report-step-actions">
                <button class="pmo-report-step-action-back" type="button" (click)="setStep(2)">
                  <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
                  <span>Back</span>
                </button>
                <button class="pmo-report-step-action-next" type="button" (click)="setStep(4)">
                  <span>Next</span>
                  <span pmConsoleIcon="arrow-right" aria-hidden="true"></span>
                </button>
              </div>
            </header>

            <div class="pmo-report-step-body pmo-report-step3-body">
              <div class="pmo-scope-search-bar">
                <div class="pmo-scope-search-input">
                  <span pmConsoleIcon="search" aria-hidden="true"></span>
                  <input type="text" placeholder="Search portfolios, programs, projects...">
                </div>
                <div class="pmo-scope-counters">
                  <span class="counter-label">Selected:</span>
                  <span class="counter-pill portfolio-pill">Portfolio <strong>{{ selectedPortfoliosCount() }}</strong></span>
                  <span class="counter-pill program-pill">Programs <strong>{{ selectedProgramsCount() }}</strong></span>
                  <span class="counter-pill project-pill">Projects <strong>{{ selectedProjectsCount() }}</strong></span>
                  <span class="counter-pill standalone-pill">Standalone projects <strong>{{ selectedStandaloneProjectsCount() }}</strong></span>
                </div>
              </div>

              <div class="pmo-scope-accordion">
                @for (portfolio of scopeData(); track portfolio.id) {
                  <div class="pmo-scope-portfolio-row" [class.is-expanded]="portfolio.expanded">
                    <div class="pmo-scope-portfolio-header" (click)="togglePortfolioExpanded(portfolio.id)">
                      <label class="pmo-template-checkbox" (click)="$event.stopPropagation()">
                        <input type="checkbox" [checked]="portfolio.selected" (change)="togglePortfolioSelection(portfolio.id)">
                        <span class="checkbox-custom">
                          @if (portfolio.selected) {
                            <span pmConsoleIcon="check" aria-hidden="true"></span>
                          }
                        </span>
                      </label>
                      <span class="pmo-scope-portfolio-name">{{ portfolio.name }}</span>
                      <div class="pmo-scope-portfolio-stats">
                        <span class="pmo-scope-stat">Programs <strong>{{ getSelectedProgramsCount(portfolio) }}/{{ portfolio.programs.length }}</strong></span>
                        <span class="pmo-scope-stat">Projects <strong>{{ getSelectedProjectsCount(portfolio) }}/{{ getTotalProjectsCount(portfolio) }}</strong></span>
                        <button type="button" class="pmo-scope-expand-btn">
                          <span [pmConsoleIcon]="portfolio.expanded ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                        </button>
                      </div>
                    </div>

                    @if (portfolio.expanded) {
                      <div class="pmo-scope-programs-list">
                        @for (program of portfolio.programs; track program.id) {
                          <div class="pmo-scope-program-row">
                            <div class="pmo-scope-program-header" (click)="toggleProgramExpanded(portfolio.id, program.id)">
                              <label class="pmo-template-checkbox" (click)="$event.stopPropagation()">
                                <input type="checkbox" [checked]="program.selected" (change)="toggleProgramSelection(portfolio.id, program.id)">
                                <span class="checkbox-custom">
                                  @if (program.selected) {
                                    <span pmConsoleIcon="check" aria-hidden="true"></span>
                                  }
                                </span>
                              </label>
                              <span class="pmo-scope-program-name">{{ program.name }}</span>
                              <span class="pmo-scope-type-pill" [class.is-program]="program.type === 'program'" [class.is-standalone]="program.type === 'standalone-project'">
                                {{ program.type === 'program' ? 'Program' : 'Standalone project' }}
                              </span>
                              
                              <div class="pmo-scope-program-stats">
                                @if (program.type === 'program') {
                                  <span class="pmo-scope-stat-badge">{{ getProgramSelectedProjectsCount(program) }}/{{ program.projects.length }}</span>
                                }
                                <button type="button" class="pmo-scope-expand-btn">
                                  <span [pmConsoleIcon]="program.expanded ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                                </button>
                              </div>
                            </div>

                            @if (program.expanded && program.projects.length > 0) {
                              <div class="pmo-scope-projects-grid-container">
                                <p class="pmo-scope-projects-hint">Please click to select the projects</p>
                                <div class="pmo-scope-projects-grid">
                                  @for (project of program.projects; track project.id) {
                                    <label class="pmo-scope-project-card" [class.is-selected]="project.selected">
                                      <input type="checkbox" [checked]="project.selected" (change)="toggleProjectSelection(portfolio.id, program.id, project.id)">
                                      <span class="checkbox-custom">
                                        @if (project.selected) {
                                          <span pmConsoleIcon="check" aria-hidden="true"></span>
                                        }
                                      </span>
                                      <span class="pmo-scope-project-name">{{ project.name }}</span>
                                    </label>
                                  }
                                </div>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </section>
        } @else if (currentStep() === 4) {
          <section class="pmo-report-step-panel pmo-report-step4-panel">
            <header class="pmo-report-step-header">
              <div class="pmo-report-step-title-group">
                <div class="pmo-report-step-icon step4-icon">
                  <span pmConsoleIcon="calendar" aria-hidden="true"></span>
                </div>
                <div class="pmo-report-step-title">
                  <h2>Download or Schedule</h2>
                  <p>Download on the go or schedule reports</p>
                </div>
              </div>
              <div class="pmo-report-step-actions">
                <button class="pmo-report-step-action-back" type="button" (click)="setStep(3)">
                  <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
                  <span>Back</span>
                </button>
                <button class="pmo-report-step-action-primary" type="button" (click)="saveAndProceed()">
                  <span>Save & proceed</span>
                </button>
              </div>
            </header>

            <div class="pmo-report-step-body pmo-report-step4-body">
              <div class="pmo-schedule-form">
                <div class="pmo-report-form-group">
                  <label>Frequency</label>
                  <div class="pmo-frequency-toggle">
                    @for (freq of frequencies; track freq) {
                      <button 
                        type="button" 
                        class="pmo-frequency-btn" 
                        [class.is-active]="selectedFrequency() === freq"
                        (click)="setFrequency(freq)"
                      >
                        {{ freq }}
                      </button>
                    }
                  </div>
                </div>

                <div class="pmo-report-form-group">
                  <label for="recurring-date">Recurring Date</label>
                  <input id="recurring-date" class="pmo-report-input" [class.has-error]="showRecurringDateError()" type="date" [value]="selectedRecurringDate()" (change)="onRecurringDateChange($event)" />
                  @if (showRecurringDateError()) {
                    <div class="pmo-report-error-msg">Please select a Recurring Date</div>
                  }
                </div>

                <div class="pmo-report-form-group">
                  <label for="additional-recipients">Additional Recipients (optional)</label>
                  <div class="pmo-report-input-icon-wrapper">
                    <span pmConsoleIcon="users" aria-hidden="true" class="input-icon"></span>
                    <input id="additional-recipients" class="pmo-report-input has-icon" type="text" placeholder="Type the recipients email & press enter" />
                  </div>
                  <div class="pmo-recipients-list">
                    <span class="pmo-recipient-tag">
                      munahassan&#64;gmail.com <button type="button" aria-label="Remove recipient"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                    </span>
                    <span class="pmo-recipient-tag">
                      amar&#64;gmail.com <button type="button" aria-label="Remove recipient"><span pmConsoleIcon="x" aria-hidden="true"></span></button>
                    </span>
                  </div>
                </div>

                <div class="pmo-report-form-group">
                  <label for="file-format">File format</label>
                  <div class="pmo-report-select-wrapper has-icon-start">
                    <span pmConsoleIcon="file-text" aria-hidden="true" class="start-icon" style="color: #ef4444;"></span>
                    <select id="file-format" class="pmo-report-select">
                      <option value="pdf" selected>PDF</option>
                    </select>
                    <span pmConsoleIcon="chevron-down" aria-hidden="true" class="select-icon"></span>
                  </div>
                </div>
              </div>

              <div class="pmo-report-preview-panel">
                <div class="pmo-report-preview-header">
                  <h3>Final report preview</h3>
                  <div class="pmo-report-preview-actions">
                    <button type="button" class="pmo-download-now-btn">
                      <span>Download now</span>
                      <span pmConsoleIcon="download" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="pmo-template-preview-expand" aria-label="Expand preview">
                      <span pmConsoleIcon="maximize" aria-hidden="true"></span>
                    </button>
                  </div>
                </div>
                <div class="pmo-report-preview-content">
                  <!-- Final preview placeholder -->
                </div>
              </div>
            </div>
          </section>
        }
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-report-builder-canvas {
        background: #f1f5f9;
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
        padding: 16px 24px 24px;
        gap: 24px;
      }

      .pmo-report-builder-sidebar {
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
      }

      .pmo-report-builder-back {
        align-items: center;
        background: transparent;
        border: 0;
        color: #0b0b0b;
        display: flex;
        font-size: 16px;
        font-weight: 600;
        gap: 8px;
        height: 64px;
        line-height: 24px;
        outline: none;
        padding: 0 24px;
        width: 100%;
        text-align: left;
        cursor: pointer;
      }

      .pmo-report-builder-back .icon {
        color: #687182;
        height: 20px;
        width: 20px;
      }

      .pmo-report-builder-steps {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        padding: 8px 24px 24px;
        z-index: 2;
      }

      .pmo-report-builder-step {
        display: flex;
        gap: 12px;
        padding: 16px 0;
        position: relative;
      }

      .pmo-report-builder-step:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 11px;
        top: 40px;
        bottom: -8px;
        width: 1px;
        background: #e4e7ef;
      }

      .step-indicator {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 50%;
        display: flex;
        height: 24px;
        justify-content: center;
        width: 24px;
        z-index: 2;
      }

      .step-number {
        color: #6b7280;
        font-size: 11px;
        font-weight: 500;
      }

      .step-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .step-label {
        color: #6b7280;
        font-size: 11px;
        font-weight: 500;
        line-height: 14px;
      }

      .step-title {
        color: #374151;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      }

      .step-subtitle {
        color: #6b7280;
        font-size: 12px;
        font-style: italic;
        line-height: 16px;
        margin-top: 2px;
      }

      .pmo-report-builder-step.is-completed .step-indicator {
        background: #22c55e;
        border-color: #22c55e;
      }

      .pmo-report-builder-step.is-completed .step-check {
        color: #ffffff;
        height: 14px;
        width: 14px;
      }

      .pmo-report-builder-step.is-active .step-indicator {
        border-color: #10069f;
      }

      .pmo-report-builder-step.is-active .step-dot {
        background: #10069f;
        border-radius: 50%;
        height: 10px;
        width: 10px;
      }

      .pmo-report-builder-step.is-active .step-title,
      .pmo-report-builder-step.is-completed .step-title {
        color: #0b0b0b;
        font-weight: 600;
      }

      .pmo-report-builder-sidebar-bg {
        bottom: 0;
        left: 0;
        opacity: 0.5;
        pointer-events: none;
        position: absolute;
        right: 0;
        z-index: 1;
      }
      
      .pmo-report-builder-sidebar-bg img {
        width: 100%;
        height: auto;
        transform: translateY(20%) scale(1.5);
        transform-origin: bottom left;
      }

      .pmo-report-builder-content {
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        min-width: 0;
        overflow: hidden;
      }

      .pmo-report-step-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .pmo-report-step-header {
        align-items: center;
        border-bottom: 1px solid #e4e7ef;
        display: flex;
        justify-content: space-between;
        padding: 16px 24px;
      }

      .pmo-report-step-title-group {
        align-items: center;
        display: flex;
        gap: 16px;
      }

      .pmo-report-step-icon {
        align-items: center;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        color: #0b0b0b;
        display: flex;
        height: 48px;
        justify-content: center;
        width: 48px;
        box-shadow: 0 1px 2px rgba(25, 33, 61, 0.05);
      }
      
      .pmo-report-step-icon .icon {
        color: #22c55e;
        height: 24px;
        width: 24px;
      }

      .pmo-report-step-title h2 {
        color: #0b0b0b;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .pmo-report-step-title p {
        color: #6b7280;
        font-size: 13px;
        line-height: 20px;
        margin: 0;
      }

      .pmo-report-step-actions {
        display: flex;
        gap: 12px;
      }

      .pmo-report-step-action-back {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 20px;
        color: #687182;
        display: flex;
        font-size: 14px;
        font-weight: 500;
        gap: 8px;
        height: 40px;
        padding: 0 20px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .pmo-report-step-action-back:hover {
        background: #f1f5f9;
      }

      .pmo-report-step-action-back .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-report-step-action-next {
        align-items: center;
        background: #10069f;
        border: 1px solid #10069f;
        border-radius: 20px;
        color: #ffffff;
        display: flex;
        font-size: 14px;
        font-weight: 500;
        gap: 8px;
        height: 40px;
        padding: 0 20px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .pmo-report-step-action-next:hover {
        background: #0d057a;
      }

      .pmo-report-step-action-next .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-report-step-body {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 32px 24px;
      }

      .pmo-report-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 800px;
      }

      .pmo-report-form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .pmo-report-form-group label {
        color: #374151;
        font-size: 14px;
        font-weight: 500;
      }

      .pmo-report-form-group label .required {
        color: #ef4444;
        margin-left: 2px;
      }

      .pmo-report-input,
      .pmo-report-textarea,
      .pmo-report-select {
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        color: #111827;
        font-family: inherit;
        font-size: 14px;
        outline: none;
        padding: 12px 16px;
        width: 100%;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .pmo-report-input.has-error {
        border-color: #ef4444;
        box-shadow: 0 0 0 1px #ef4444;
      }

      .pmo-report-error-msg {
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
      }

      .pmo-report-input::placeholder,
      .pmo-report-textarea::placeholder {
        color: #9ca3af;
      }

      .pmo-report-input:focus,
      .pmo-report-textarea:focus,
      .pmo-report-select:focus {
        border-color: #10069f;
        box-shadow: 0 0 0 1px #10069f;
      }

      .pmo-report-textarea {
        height: 120px;
        resize: vertical;
      }

      .char-count {
        color: #6b7280;
        font-size: 12px;
        font-style: italic;
      }

      .pmo-report-select-wrapper {
        position: relative;
      }

      .pmo-report-select {
        appearance: none;
        cursor: pointer;
        padding-right: 40px;
      }

      .pmo-report-select-wrapper .select-icon {
        color: #6b7280;
        height: 20px;
        pointer-events: none;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
      }

      .pmo-report-tags-list {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        flex-wrap: wrap;
      }

      .pmo-report-tag {
        align-items: center;
        background: #f3e8ff;
        border-radius: 16px;
        color: #4b5563;
        display: inline-flex;
        font-size: 13px;
        gap: 4px;
        padding: 4px 12px;
      }

      .pmo-report-tag button {
        align-items: center;
        background: transparent;
        border: 0;
        color: #9ca3af;
        cursor: pointer;
        display: flex;
        height: 16px;
        justify-content: center;
        padding: 0;
        width: 16px;
      }
      
      .pmo-report-tag button:hover {
        color: #4b5563;
      }

      .pmo-report-tag button .icon {
        height: 12px;
        width: 12px;
      }
      .pmo-report-step2-body {
        display: grid;
        grid-template-columns: 360px minmax(0, 1fr);
        gap: 24px;
        padding: 24px;
        overflow: hidden;
      }

      .pmo-templates-sidebar {
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .pmo-templates-header {
        color: #6b7280;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 12px;
      }

      .pmo-templates-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
        padding-right: 8px;
      }

      .pmo-template-item {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        gap: 12px;
        padding: 12px 16px;
        transition: all var(--motion-fast) var(--motion-ease);
      }

      .pmo-template-item:hover {
        border-color: #d1d5db;
      }

      .pmo-template-item.is-active {
        background: #f8f7ff;
        border-color: #d5ccff;
      }

      .pmo-template-checkbox {
        cursor: pointer;
        display: flex;
        position: relative;
      }

      .pmo-template-checkbox input {
        opacity: 0;
        position: absolute;
      }

      .checkbox-custom {
        align-items: center;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        display: flex;
        height: 18px;
        justify-content: center;
        width: 18px;
      }

      .pmo-template-checkbox input:checked + .checkbox-custom {
        background: #ffffff;
        border-color: #10069f;
      }

      .checkbox-custom .icon {
        color: #10069f;
        height: 14px;
        width: 14px;
      }

      .pmo-template-name {
        color: #374151;
        font-size: 14px;
        font-weight: 500;
      }

      .pmo-template-active-icon {
        color: #10069f;
        height: 16px;
        margin-left: auto;
        width: 16px;
      }

      .pmo-template-preview-area {
        background: #f8f9fc;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        padding: 16px;
      }

      .pmo-template-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .pmo-template-preview-header h3 {
        font-size: 14px;
        font-weight: 600;
        color: #0b0b0b;
        margin: 0;
      }

      .pmo-template-preview-expand {
        align-items: center;
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 6px;
        color: #687182;
        cursor: pointer;
        display: flex;
        justify-content: center;
        height: 32px;
        width: 32px;
      }
      
      .pmo-template-preview-expand:hover {
        background: #f1f5f9;
      }

      .pmo-template-preview-expand .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-template-preview-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 14px;
      }

      .pmo-report-step-icon.step2-icon .icon {
        color: #10069f;
        height: 24px;
        width: 24px;
      }

      .pmo-report-step-icon.step3-icon .icon {
        color: #10069f;
        height: 24px;
        width: 24px;
      }

      .pmo-report-step3-body {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        overflow-y: auto;
      }

      .pmo-scope-search-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .pmo-scope-search-input {
        position: relative;
        width: 400px;
      }

      .pmo-scope-search-input .icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        height: 16px;
        width: 16px;
      }

      .pmo-scope-search-input input {
        width: 100%;
        height: 40px;
        padding: 8px 16px 8px 36px;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        font-size: 14px;
        color: #111827;
        outline: none;
      }

      .pmo-scope-search-input input::placeholder {
        color: #9ca3af;
      }

      .pmo-scope-search-input input:focus {
        border-color: #10069f;
        box-shadow: 0 0 0 1px #10069f;
      }

      .pmo-scope-counters {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .counter-label {
        font-size: 12px;
        color: #6b7280;
        margin-right: 4px;
      }

      .counter-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        color: #374151;
      }

      .portfolio-pill { background: #fce8e8; }
      .program-pill { background: #e0f2fe; }
      .project-pill { background: #f3f4f6; }
      .standalone-pill { background: #f3e8ff; }

      .pmo-scope-accordion {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .pmo-scope-portfolio-row {
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        background: #ffffff;
      }

      .pmo-scope-portfolio-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        cursor: pointer;
      }

      .pmo-scope-portfolio-name {
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        color: #111827;
      }

      .pmo-scope-portfolio-stats {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .pmo-scope-stat {
        font-size: 12px;
        color: #6b7280;
      }

      .pmo-scope-stat strong {
        color: #111827;
        font-weight: 500;
      }

      .pmo-scope-expand-btn {
        background: transparent;
        border: 0;
        color: #6b7280;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
      }

      .pmo-scope-expand-btn .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-scope-programs-list {
        display: flex;
        flex-direction: column;
        padding: 0 20px 20px 48px;
      }

      .pmo-scope-program-row {
        display: flex;
        flex-direction: column;
        border-top: 1px solid #f3f4f6;
      }

      .pmo-scope-program-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 0;
        cursor: pointer;
      }

      .pmo-scope-program-name {
        font-size: 14px;
        font-weight: 500;
        color: #111827;
      }

      .pmo-scope-type-pill {
        font-size: 11px;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 12px;
        color: #0b0b0b;
      }

      .pmo-scope-type-pill.is-program {
        background: #ccfbf1;
        color: #0f766e;
      }

      .pmo-scope-type-pill.is-standalone {
        background: #e0e7ff;
        color: #4338ca;
      }

      .pmo-scope-program-stats {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-left: auto;
      }

      .pmo-scope-stat-badge {
        font-size: 11px;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        background: #ffffff;
        color: #374151;
      }

      .pmo-scope-projects-grid-container {
        padding: 0 0 16px 36px;
      }

      .pmo-scope-projects-hint {
        font-size: 12px;
        color: #6b7280;
        margin: 0 0 12px 0;
      }

      .pmo-scope-projects-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .pmo-scope-project-card {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        background: #ffffff;
        cursor: pointer;
        transition: border-color var(--motion-fast) var(--motion-ease);
      }
      
      .pmo-scope-project-card input {
        opacity: 0;
        position: absolute;
      }

      .pmo-scope-project-card.is-selected {
        border-color: #10069f;
      }

      .pmo-scope-project-name {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        line-height: 1.4;
      }
      .pmo-report-step-icon.step4-icon .icon {
        color: #10069f;
        height: 24px;
        width: 24px;
      }

      .pmo-report-step-action-primary {
        align-items: center;
        background: #10069f;
        border: 1px solid #10069f;
        border-radius: 20px;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        font-weight: 500;
        gap: 8px;
        height: 40px;
        padding: 0 20px;
        transition: all var(--motion-fast) var(--motion-ease);
      }

      .pmo-report-step-action-primary:hover {
        background: #0d057a;
      }

      .pmo-report-step4-body {
        display: grid;
        grid-template-columns: 380px minmax(0, 1fr);
        gap: 32px;
        padding: 24px 32px;
        overflow-y: auto;
      }

      .pmo-schedule-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .pmo-frequency-toggle {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }

      .pmo-frequency-btn {
        background: #ffffff;
        border: 1px solid #e4e7ef;
        border-radius: 8px;
        color: #687182;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        padding: 8px 16px;
        transition: all var(--motion-fast) var(--motion-ease);
      }

      .pmo-frequency-btn:hover {
        background: #f1f5f9;
        color: #374151;
      }

      .pmo-frequency-btn.is-active {
        background: #eef2ff;
        border-color: #c7d2fe;
        color: #4f46e5;
      }

      .pmo-report-input-icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .pmo-report-input-icon-wrapper .input-icon {
        position: absolute;
        left: 12px;
        color: #687182;
        height: 18px;
        width: 18px;
      }

      .pmo-report-input.has-icon {
        padding-left: 40px;
      }

      .pmo-recipients-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .pmo-recipient-tag {
        align-items: center;
        background: #f3e8ff;
        border-radius: 16px;
        color: #4b5563;
        display: inline-flex;
        font-size: 13px;
        gap: 4px;
        padding: 4px 12px;
      }

      .pmo-recipient-tag button {
        align-items: center;
        background: transparent;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        display: flex;
        justify-content: center;
        padding: 2px;
      }

      .pmo-recipient-tag button:hover {
        color: #4b5563;
      }

      .pmo-recipient-tag button .icon {
        height: 12px;
        width: 12px;
      }

      .pmo-report-select-wrapper.has-icon-start .start-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        height: 18px;
        width: 18px;
        pointer-events: none;
      }

      .pmo-report-select-wrapper.has-icon-start select {
        padding-left: 40px;
      }

      .pmo-report-preview-panel {
        background: #f8f9fc;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        padding: 24px;
        min-height: 400px;
      }

      .pmo-report-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .pmo-report-preview-header h3 {
        font-size: 15px;
        font-weight: 500;
        color: #111827;
        margin: 0;
      }

      .pmo-report-preview-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .pmo-download-now-btn {
        align-items: center;
        background: #ffffff;
        border: 1px solid #10069f;
        border-radius: 20px;
        color: #10069f;
        cursor: pointer;
        display: flex;
        font-size: 13px;
        font-weight: 600;
        gap: 8px;
        height: 36px;
        padding: 0 16px;
        transition: all var(--motion-fast) var(--motion-ease);
      }

      .pmo-download-now-btn:hover {
        background: #f1f5f9;
      }

      .pmo-download-now-btn .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-report-preview-content {
        flex: 1;
        background: #ffffff;
        border-radius: 8px;
        border: 1px dashed #d1d5db;
      }
    `
  ]
})
export class PmoReportBuilderComponent {
  @Output() readonly backSelected = new EventEmitter<void>();
  @Output() readonly saveReport = new EventEmitter<{ title: string; recursOn: string }>();

  reportTitle = signal('');
  showTitleError = signal(false);
  showRecurringDateError = signal(false);

  currentStep = signal(1);

  readonly templates = signal<ReportTemplate[]>([
    { id: '1', name: 'Portfolio Summary Report', selected: true },
    { id: '2', name: 'Portfolio Status', selected: true },
    { id: '3', name: 'Detailed Report', selected: true },
    { id: '4', name: 'Deliverables Timeline', selected: false },
    { id: '5', name: 'Delivery Risk By Governance', selected: false },
    { id: '6', name: 'Portfolio Status updates (PMO)', selected: false },
    { id: '7', name: 'Delivery Risk By Ownership', selected: false },
    { id: '8', name: 'Overview Report', selected: false },
    { id: '9', name: 'Project Summary Report Template 1', selected: false },
    { id: '10', name: 'Project Summary Report Template 2', selected: false },
    { id: '11', name: 'Financial Report', selected: false },
    { id: '12', name: 'Projects Exceptions Report', selected: false }
  ]);

  previewTemplateId = signal<string | null>('6');

  get selectedTemplatesCount() {
    return this.templates().filter(t => t.selected).length;
  }

  setStep(step: number) {
    if (step > 1 && !this.reportTitle().trim()) {
      this.showTitleError.set(true);
      return;
    }
    this.currentStep.set(step);
  }

  onTitleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.reportTitle.set(value);
    if (value.trim()) {
      this.showTitleError.set(false);
    }
  }

  toggleTemplateSelection(templateId: string) {
    this.templates.update(templates =>
      templates.map(t => t.id === templateId ? { ...t, selected: !t.selected } : t)
    );
  }

  setPreviewTemplate(templateId: string) {
    this.previewTemplateId.set(templateId);
  }

  getTemplateName(id: string | null): string {
    if (!id) return '';
    return this.templates().find(t => t.id === id)?.name ?? '';
  }

  readonly scopeData = signal<ScopePortfolio[]>([
    {
      id: '1',
      name: 'Safe Security',
      selected: false,
      expanded: false,
      programs: [
        {
          id: '1.1',
          name: 'Information Security Framework',
          type: 'program',
          selected: false,
          expanded: false,
          projects: [
            { id: '1.1.1', name: 'Access Control Implementation', selected: false },
            { id: '1.1.2', name: 'Vulnerability Assessment Program', selected: false }
          ]
        },
        {
          id: '1.2',
          name: 'Incident Response',
          type: 'program',
          selected: false,
          expanded: false,
          projects: [
            { id: '1.2.1', name: 'Security Operations Center Setup', selected: false }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Tasama',
      selected: false,
      expanded: false,
      programs: [
        {
          id: '2.1',
          name: 'Governance & Compliance',
          type: 'program',
          selected: false,
          expanded: false,
          projects: [
            { id: '2.1.1', name: 'Cybersecurity Function Establishment & Co-Sourced Oper...', selected: false },
            { id: '2.1.2', name: 'Governance Elevation Program', selected: false },
            { id: '2.1.3', name: 'Institutional Excellence – Enterprise-wide Policies, Processe...', selected: false },
            { id: '2.1.4', name: 'Local Content Establishment', selected: false }
          ]
        },
        {
          id: '2.2',
          name: 'Digital & Transformation',
          type: 'program',
          selected: false,
          expanded: false,
          projects: [
            { id: '2.2.1', name: 'Cloud Migration Strategy', selected: false },
            { id: '2.2.2', name: 'ERP System Upgrade', selected: false }
          ]
        },
        {
          id: '2.3',
          name: 'PIF Product Commercialization (QARAR)',
          type: 'standalone-project',
          selected: false,
          expanded: false,
          projects: [
            { id: '2.3.1', name: 'QARAR Launch Marketing', selected: false }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Portfolio 3',
      selected: false,
      expanded: false,
      programs: [
        {
          id: '3.1',
          name: 'Human Capital Development',
          type: 'program',
          selected: false,
          expanded: false,
          projects: [
            { id: '3.1.1', name: 'Leadership Training Initiative', selected: false },
            { id: '3.1.2', name: 'Performance Management Redesign', selected: false }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Standalone Projects',
      selected: false,
      expanded: false,
      programs: [
        {
          id: '4.1',
          name: 'Uncategorized Standalones',
          type: 'standalone-project',
          selected: false,
          expanded: false,
          projects: [
            { id: '4.1.1', name: 'Headquarters Relocation', selected: false },
            { id: '4.1.2', name: 'Annual Strategy Summit Planning', selected: false }
          ]
        }
      ]
    }
  ]);

  selectedPortfoliosCount = computed(() => {
    return this.scopeData().filter(p => p.selected).length;
  });

  selectedProgramsCount = computed(() => {
    return this.scopeData().reduce((acc, p) => {
      return acc + p.programs.filter(pr => pr.type === 'program' && pr.selected).length;
    }, 0);
  });

  selectedStandaloneProjectsCount = computed(() => {
    return this.scopeData().reduce((acc, p) => {
      return acc + p.programs.filter(pr => pr.type === 'standalone-project' && pr.selected).length;
    }, 0);
  });

  selectedProjectsCount = computed(() => {
    return this.scopeData().reduce((acc, p) => {
      return acc + p.programs.reduce((prAcc, pr) => {
        return prAcc + pr.projects.filter(proj => proj.selected).length;
      }, 0);
    }, 0);
  });

  getSelectedProgramsCount(portfolio: ScopePortfolio): number {
    return portfolio.programs.length ? portfolio.programs.filter(p => p.selected).length : 0;
  }

  getSelectedProjectsCount(portfolio: ScopePortfolio): number {
    return portfolio.programs.reduce((acc, pr) => acc + pr.projects.filter(p => p.selected).length, 0);
  }

  getTotalProjectsCount(portfolio: ScopePortfolio): number {
    return portfolio.programs.reduce((acc, pr) => acc + pr.projects.length, 0);
  }

  getProgramSelectedProjectsCount(program: ScopeProgram): number {
    return program.projects.filter(p => p.selected).length;
  }

  togglePortfolioExpanded(portfolioId: string) {
    this.scopeData.update(data => data.map(p => p.id === portfolioId ? { ...p, expanded: !p.expanded } : p));
  }

  toggleProgramExpanded(portfolioId: string, programId: string) {
    this.scopeData.update(data => data.map(p => {
      if (p.id !== portfolioId) return p;
      return {
        ...p,
        programs: p.programs.map(pr => pr.id === programId ? { ...pr, expanded: !pr.expanded } : pr)
      };
    }));
  }

  togglePortfolioSelection(portfolioId: string) {
    this.scopeData.update(data => data.map(p => {
      if (p.id !== portfolioId) return p;
      const newSelected = !p.selected;
      return {
        ...p,
        selected: newSelected,
        programs: p.programs.map(pr => ({
          ...pr,
          selected: newSelected,
          projects: pr.projects.map(proj => ({ ...proj, selected: newSelected }))
        }))
      };
    }));
  }

  toggleProgramSelection(portfolioId: string, programId: string) {
    this.scopeData.update(data => data.map(p => {
      if (p.id !== portfolioId) return p;
      
      const newPrograms = p.programs.map(pr => {
        if (pr.id !== programId) return pr;
        const newSelected = !pr.selected;
        return {
          ...pr,
          selected: newSelected,
          projects: pr.projects.map(proj => ({ ...proj, selected: newSelected }))
        };
      });

      const allProgramsSelected = newPrograms.length > 0 && newPrograms.every(pr => pr.selected);
      
      return {
        ...p,
        selected: allProgramsSelected,
        programs: newPrograms
      };
    }));
  }

  toggleProjectSelection(portfolioId: string, programId: string, projectId: string) {
    this.scopeData.update(data => data.map(p => {
      if (p.id !== portfolioId) return p;

      const newPrograms = p.programs.map(pr => {
        if (pr.id !== programId) return pr;

        const newProjects = pr.projects.map(proj => {
          if (proj.id !== projectId) return proj;
          return { ...proj, selected: !proj.selected };
        });

        const allProjectsSelected = newProjects.length > 0 && newProjects.every(proj => proj.selected);

        return {
          ...pr,
          selected: allProjectsSelected,
          projects: newProjects
        };
      });

      const allProgramsSelected = newPrograms.length > 0 && newPrograms.every(pr => pr.selected);

      return {
        ...p,
        selected: allProgramsSelected,
        programs: newPrograms
      };
    }));
  }

  readonly frequencies = ['Once', 'Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'];
  
  selectedFrequency = signal<string>('Weekly');
  selectedRecurringDate = signal<string>('');

  setFrequency(freq: string) {
    this.selectedFrequency.set(freq);
    this.selectedRecurringDate.set('');
    this.showRecurringDateError.set(false);
  }

  onRecurringDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedRecurringDate.set(value);
    if (value.trim()) {
      this.showRecurringDateError.set(false);
    }
  }

  saveAndProceed() {
    let hasError = false;
    
    if (!this.reportTitle().trim()) {
      this.showTitleError.set(true);
      hasError = true;
    }
    
    if (!this.selectedRecurringDate().trim()) {
      this.showRecurringDateError.set(true);
      hasError = true;
    }
    
    if (hasError) {
      if (!this.reportTitle().trim()) {
        this.currentStep.set(1);
      }
      return;
    }

    this.saveReport.emit({
      title: this.reportTitle(),
      recursOn: this.selectedRecurringDate()
    });
  }
}
