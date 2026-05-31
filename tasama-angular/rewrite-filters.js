const fs = require('fs');

let file = fs.readFileSync('src/app/pmo-governance-risk-register.component.ts', 'utf8');
file = file.replace(/\r\n/g, '\n');

// 1. Replace the HTML structure
const oldHTMLRegex = /                @if \(riskEntityFilterMenuOpen\) \{[\s\S]*?<\/section>\n                \}/;

const newHTML = `                @if (riskEntityFilterMenuOpen) {
                  <section class="work-filter-menu target-picker-menu" role="menu" aria-label="Filter risks by entity">
                    <label class="target-picker-search" (click)="$event.stopPropagation()">
                      <span pmConsoleIcon="search" aria-hidden="true"></span>
                      <input
                        type="search"
                        [value]="riskEntityFilterQuery"
                        placeholder="Search programs or projects"
                        aria-label="Search entities"
                        (input)="setRiskEntityFilterQuery($event)"
                      />
                    </label>

                    <button
                      class="target-picker-option all-target"
                      type="button"
                      (click)="clearAllRiskEntityFilters()"
                    >
                      <span class="target-option-copy">
                        <strong>All portfolios</strong>
                        <small>{{ riskPortfolioFilters.length + riskProgramFilters.length + riskProjectFilters.length }} actions applied</small>
                      </span>
                    </button>

                    <details
                      class="target-picker-group"
                      [open]="riskEntityAccordionState.portfolio"
                      (toggle)="toggleRiskEntityAccordion('portfolio', $event)"
                    >
                      <summary class="target-picker-group-label" (click)="$event.stopPropagation()">
                        <span>Portfolios</span>
                        <span pmConsoleIcon="chevron-down" aria-hidden="true" class="icon"></span>
                      </summary>
                      @if (filteredRiskPortfolioFilterOptions.length) {
                        @for (portfolio of filteredRiskPortfolioFilterOptions; track portfolio) {
                          <label class="target-picker-option" style="cursor: pointer;">
                            <input type="checkbox" [checked]="isRiskFilterSelected('portfolio', portfolio)" (change)="toggleRiskFilter('portfolio', portfolio, $event)" style="margin-right: 8px;" />
                            <span class="target-option-copy">
                              <strong>{{ portfolio }}</strong>
                            </span>
                          </label>
                        }
                      } @else {
                        <p style="padding: 6px 10px; font-size: 11.5px; color: #6f7785; margin: 0;">No portfolios found</p>
                      }
                    </details>

                    <details
                      class="target-picker-group"
                      [open]="riskEntityAccordionState.program"
                      (toggle)="toggleRiskEntityAccordion('program', $event)"
                    >
                      <summary class="target-picker-group-label" (click)="$event.stopPropagation()">
                        <span>Programs</span>
                        <span pmConsoleIcon="chevron-down" aria-hidden="true" class="icon"></span>
                      </summary>
                      @if (filteredRiskProgramFilterOptions.length) {
                        @for (program of filteredRiskProgramFilterOptions; track program) {
                          <label class="target-picker-option" style="cursor: pointer;">
                            <input type="checkbox" [checked]="isRiskFilterSelected('program', program)" (change)="toggleRiskFilter('program', program, $event)" style="margin-right: 8px;" />
                            <span class="target-option-copy">
                              <strong>{{ program }}</strong>
                            </span>
                          </label>
                        }
                      } @else {
                        <p style="padding: 6px 10px; font-size: 11.5px; color: #6f7785; margin: 0;">No programs found</p>
                      }
                    </details>

                    <details
                      class="target-picker-group"
                      [open]="riskEntityAccordionState.project"
                      (toggle)="toggleRiskEntityAccordion('project', $event)"
                    >
                      <summary class="target-picker-group-label" (click)="$event.stopPropagation()">
                        <span>Projects</span>
                        <span pmConsoleIcon="chevron-down" aria-hidden="true" class="icon"></span>
                      </summary>
                      @if (filteredRiskProjectFilterOptions.length) {
                        @for (project of filteredRiskProjectFilterOptions; track project) {
                          <label class="target-picker-option" style="cursor: pointer;">
                            <input type="checkbox" [checked]="isRiskFilterSelected('project', project)" (change)="toggleRiskFilter('project', project, $event)" style="margin-right: 8px;" />
                            <span class="target-option-copy">
                              <strong>{{ project }}</strong>
                            </span>
                          </label>
                        }
                      } @else {
                        <p style="padding: 6px 10px; font-size: 11.5px; color: #6f7785; margin: 0;">No projects found</p>
                      }
                    </details>
                  </section>
                }`;

file = file.replace(oldHTMLRegex, newHTML);

// 2. Replace the CSS
const oldCSSRegex = /    \.risk-entity-filter-menu \{[\s\S]*?line-height: 1\.3;\n    \}/;

const newCSS = `    .target-picker-menu {
      display: grid;
      gap: 2px;
      max-height: 360px;
      min-width: 330px;
      overflow: auto;
      padding: 6px;
      z-index: 220;
      background: #ffffff;
      border: 1px solid #e3e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
    }

    .target-picker-search {
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

    .target-picker-search input {
      background: transparent;
      border: 0;
      color: #252a34;
      font: inherit;
      font-size: 12px;
      min-width: 0;
      outline: 0;
      width: 100%;
    }

    .target-picker-search .icon {
      height: 15px;
      width: 15px;
    }

    .target-picker-group {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .target-picker-group summary::-webkit-details-marker {
      display: none;
    }

    .target-picker-group-label {
      align-items: center;
      color: #4c5566;
      cursor: pointer;
      display: flex;
      font-size: 11.5px;
      font-weight: 500;
      gap: 8px;
      justify-content: space-between;
      letter-spacing: 0;
      padding: 8px 8px 4px;
      text-transform: none;
      user-select: none;
    }

    .target-picker-group-label .icon {
      height: 13px;
      transition: transform 160ms ease;
      width: 13px;
    }

    .target-picker-group:not([open]) .target-picker-group-label .icon {
      transform: rotate(-90deg);
    }

    .target-picker-option {
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

    .target-picker-option:hover,
    .target-picker-option.active {
      background: #f4f6fb;
    }

    .target-picker-option.active {
      color: var(--brand, #10069f);
    }

    .target-option-copy {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .target-picker-option strong,
    .target-picker-option small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .target-picker-option strong {
      font-size: 11.5px;
      font-weight: 500;
    }

    .target-picker-option small {
      color: #6f7785;
      font-size: 10.5px;
    }

    .all-target {
      background: #f4f6fb;
    }
    
    .all-target strong {
      color: var(--brand, #10069f);
    }`;

file = file.replace(oldCSSRegex, newCSS);

file = file.replace(/toggleRiskEntityAccordion\(section: 'portfolio' \| 'program' \| 'project'\): void \{[\s\S]*?\}\n/,
`toggleRiskEntityAccordion(section: 'portfolio' | 'program' | 'project', event?: Event): void {
    if (event) {
      const details = event.currentTarget as HTMLDetailsElement;
      this.riskEntityAccordionState[section] = details.open;
    } else {
      this.riskEntityAccordionState[section] = !this.riskEntityAccordionState[section];
    }
  }
`);

fs.writeFileSync('src/app/pmo-governance-risk-register.component.ts', file, 'utf8');
console.log('Done!');
