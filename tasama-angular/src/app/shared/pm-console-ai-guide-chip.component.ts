import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

export interface PmConsoleAiGuideCopy {
  title?: string;
  what: string;
  how: string;
  example: string;
}

const pmConsoleAiGuideCopy: Record<string, PmConsoleAiGuideCopy> = {
  'Case for change': {
    what: 'The short narrative that explains the problem or opportunity the project exists to solve.',
    how: 'Write the context first, then the impact of doing nothing, then the change the project is expected to create.',
    example: 'Example: current teams duplicate research intake, causing delays and inconsistent visibility for leadership.',
  },
  'Business drivers': {
    what: 'The strategic or operational reasons that justify moving the project forward now.',
    how: 'Add one driver per row. Keep each driver tied to a source, priority, and clear reason it matters.',
    example: 'Example: Strategic priority, executive mandate, operational efficiency, compliance, or user demand.',
  },
  Outcomes: {
    what: 'The results that define what success should look like once the project is delivered.',
    how: 'Describe measurable outcomes, the owner who can confirm them, and how progress will be checked.',
    example: 'Example: reduce duplicate intake requests by 30 percent within two reporting cycles.',
  },
  'Project alignment': {
    what: 'The link between the project objectives and approved strategic objectives.',
    how: 'Connect each project objective to the strategy it supports, then keep the wording concrete and reviewable.',
    example: 'Example: improve research visibility, linked to the strategic objective for national R&D coordination.',
  },
  Capabilities: {
    what: 'Capability mapping used when the plan needs architecture, governance, or operating model traceability.',
    how: 'Only add capabilities that are directly affected by the project or needed for governance review.',
    example: 'Example: data governance, portfolio reporting, stakeholder engagement, or service catalogue management.',
  },
  Services: {
    what: 'Service catalogue mapping for the business service, value stream, or delivery phase touched by the project.',
    how: 'Pick the service group first, then add the value stream, phase, and service name reviewers should trace.',
    example: 'Example: research enablement, opportunity intake, discovery phase, source pack review service.',
  },
  'Budget overview': {
    what: 'A quick financial summary showing the approved budget, forecast, actuals, and remaining funds.',
    how: 'Check the totals against the project budget rows and use it as the reviewer-facing financial snapshot.',
    example: 'Example: approved budget SAR 500K, forecast SAR 480K, actuals SAR 0, available funds SAR 500K.',
  },
  'Budget Overview': {
    what: 'A quick financial summary showing the approved budget, forecast, actuals, and remaining funds.',
    how: 'Check the totals against the project budget rows and use it as the reviewer-facing financial snapshot.',
    example: 'Example: approved budget SAR 500K, forecast SAR 480K, actuals SAR 0, available funds SAR 500K.',
  },
  'Project budget': {
    what: 'The fiscal year baseline and forecast for CAPEX and OPEX.',
    how: 'Start with the first financial year, then add baseline and forecast values before funding or monthly phasing.',
    example: 'Example: FY 2026-2027 with CAPEX baseline SAR 300K and OPEX baseline SAR 180K.',
  },
  'Funding sources': {
    what: 'The allocation lines or confirmed sources that explain where the project budget comes from.',
    how: 'Add funding after the fiscal year baseline exists, then tie the amount to the correct source or allocation.',
    example: 'Example: PMO central allocation, sponsor-approved funding, or portfolio reserve.',
  },
  'Monthly budget': {
    what: 'The monthly phasing view that spreads budget across the delivery period.',
    how: 'Use it after the fiscal year baseline is set, then adjust monthly CAPEX and OPEX where timing is known.',
    example: 'Example: heavier forecast in discovery and build months, lower spend during approval periods.',
  },
  'Schedule and scope': {
    what: 'The delivery timing, scope boundary, milestones, and key products that make the plan governable.',
    how: 'Confirm dates first, then add scope, exclusions, milestones, and deliverables that reviewers can validate.',
    example: 'Example: forecast start and end dates, three milestones, in-scope audience, and one end product.',
  },
  Milestones: {
    what: 'Major checkpoints, decisions, or delivery events that show how the project will progress.',
    how: 'Add the milestone name, due date, owner, priority, and any note that helps PMO understand the checkpoint.',
    example: 'Example: initiation gate readiness, due 12 Jun 2026, owned by the project manager.',
  },
  'End Product': {
    what: 'The tangible deliverable or product the project will create.',
    how: 'Describe the product, owner, timing, related capability, budget, and dependency links when relevant.',
    example: 'Example: national R&D dashboard, owned by Research Office, delivered during planning-to-build transition.',
  },
  'End products': {
    what: 'The tangible deliverables or products the project will create.',
    how: 'Add one product per row with owner, timing, capability, budget, and dependency links when relevant.',
    example: 'Example: source pack workflow, reporting dashboard, stakeholder intake form, or data quality checklist.',
  },
  'Benefits register': {
    what: 'The value the project is expected to realize after delivery.',
    how: 'Capture the benefit, type, category, owner, description, and planned realization date.',
    example: 'Example: faster research opportunity triage, efficiency benefit, owned by Research Office.',
  },
  'Risk register': {
    what: 'Future threats that could affect scope, schedule, cost, quality, or adoption.',
    how: 'Write each risk as cause, event, and impact, then add owner, rating, controls, and treatment action.',
    example: 'Example: if data owners are not confirmed, reporting quality may delay governance approval.',
  },
  'Issues register': {
    what: 'Current blockers, decisions, or problems that already need active management.',
    how: 'Add the issue type, criticality, owner, due date, status, and the action needed to resolve it.',
    example: 'Example: access approval pending for source data, due this week, owned by PMO lead.',
  },
  'Change impact register': {
    what: 'The people, process, technology, or operating model impact created by the project.',
    how: 'Identify the impacted audience, impact type, level, owner, and readiness action.',
    example: 'Example: research administrators need a new intake process and short enablement briefings.',
  },
  'Documents and links': {
    what: 'Supporting evidence reviewers can use to validate the project plan.',
    how: 'Add source packs, approvals, discovery notes, dashboards, or reference links with a useful description.',
    example: 'Example: discovery source pack link with a note explaining which assumptions it supports.',
  },
  'Resource plan': {
    what: 'The delivery roles, allocation, and ownership needed to staff the project.',
    how: 'Add the resource role, type, impact, business unit, FTE estimate, dates, and comments.',
    example: 'Example: business analyst, internal shared resource, 0.5 FTE from Research Office.',
  },
  'Predecessor dependencies': {
    what: 'Upstream projects or deliverables this plan depends on before work can progress.',
    how: 'Add the dependent project, owner, product, due date, impact, and what is needed from that team.',
    example: 'Example: data source onboarding must finish before dashboard build starts.',
  },
  'Successor dependencies': {
    what: 'Downstream projects or teams that depend on this project delivering something first.',
    how: 'Capture who is waiting, what they need, when they need it, and the impact if this project slips.',
    example: 'Example: research portal rollout needs the approved source pack workflow.',
  },
  'Follow up actions': {
    what: 'Actions carried forward after closure or review.',
    how: 'Add a clear action, owner, due date, and current status so nothing falls between lifecycle stages.',
    example: 'Example: archive final benefits evidence, owner PMO analyst, due after closure approval.',
  },
  Recommendations: {
    what: 'Lessons or improvement suggestions captured from the project experience.',
    how: 'Write the recommendation as something a future project team can actually apply.',
    example: 'Example: nominate data owners before initiation approval for data-heavy projects.',
  },
  'Project budget at closure': {
    what: 'The final financial position used during project closure.',
    how: 'Summarize final baseline, actuals, variance, and any explanation needed for PMO sign-off.',
    example: 'Example: closed SAR 20K under forecast because vendor onboarding was not required.',
  },
  Benefits: {
    what: 'The benefit position being confirmed at closure or in summary views.',
    how: 'State whether benefits are realized, deferred, or transferred, then add owner and evidence.',
    example: 'Example: efficiency benefit transferred to BAU owner for post-project tracking.',
  },
  'Major known risks': {
    what: 'The most important unresolved risks at closure or stage transition.',
    how: 'Include only risks that still matter after the current stage, with owner and next action.',
    example: 'Example: adoption risk remains with BAU owner until training completion is confirmed.',
  },
};

export function pmConsoleAiGuideFor(title: string): PmConsoleAiGuideCopy | null {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return null;
  return pmConsoleAiGuideCopy[trimmedTitle] || pmConsoleAiGuideCopy[trimmedTitle.toLowerCase()] || null;
}

@Component({
  selector: 'app-pm-console-ai-guide-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasGuide) {
      <span
        class="ai-guide-chip"
        [class.align-right]="align === 'right'"
        [class.is-open]="open"
        (mouseenter)="openGuide()"
        (mouseleave)="closeGuide()"
      >
        <button
          class="ai-guide-chip-trigger"
          [class.is-loading]="open && !typingComplete"
          type="button"
          [attr.aria-label]="ariaLabel"
          [attr.aria-busy]="open && !typingComplete"
          [attr.aria-expanded]="open"
          (click)="toggleGuide($event)"
        >
          <span class="ai-guide-loader" aria-hidden="true"></span>
          <span class="ai-guide-icon" aria-hidden="true"></span>
        </button>
        @if (open) {
          <aside class="ai-guide-popover" role="tooltip" (click)="$event.stopPropagation()">
            <header class="ai-guide-popover-head">
              <span aria-hidden="true"></span>
              <div>
                <small>Field guide</small>
                <strong>{{ title }}</strong>
              </div>
            </header>
            <div class="ai-guide-popover-body">
              <p class="ai-guide-primary-text" [class.is-typing]="!typingComplete">{{ typedGuide }}</p>
              @if (typingComplete) {
                <div class="ai-guide-example">
                  <span>Good example</span>
                  <p>{{ example }}</p>
                </div>
              }
            </div>
          </aside>
        }
      </span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex: 0 0 auto;
        line-height: 1;
        min-width: 0;
        position: relative;
        z-index: 16;
      }

      .ai-guide-chip {
        display: inline-flex;
        position: relative;
      }

      .ai-guide-chip-trigger {
        align-items: center;
        background:
          transparent
          url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAVCAYAAACt4nWrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAArdJREFUeAG1lEtIVFEYx/9Ojo45YyY1oykqEipKqYRGUdQuKqhFtAlaaUSmIb2QooWLwI0VpLTQRRA90EUbw8iwCI1KzddMJT4qckwmx5m5zZQz93E6j0mkyeYm+ocD9+Oe8/u+8/++e2MIFVZJhqVeVN8dQafDhRWHu6R5TMz48WTwG1YUHggquNMzBVUmGHP6Mf41gOUq5rfnrNrrTycxNh3A9x8ytBCghjSexGqJx74SKyr2Z+N8kx3vJiRoCpAYb0BuugVVx3KQbk2IgMcuDqzmOEwbg/DJIQ5lAJUuW1Ic0lJMfI9XCmFq5icU/p5gxCGhp9+N9ls7kWSO/Xvli9X0+CPaXjiRYDSgtbYMloRY9I960dU/i4fPnJB8Ck+uyhq/oaJouHIqH+VHs5eunMk/r+DI9jQ86PqCXVutHHyyYRC9Dg80BgyKilUK5DF91mTA/kH6ExXZ0G6HG6nrTSjKWofdBSl4PjRLwXMCRNehPam4WlnAgaJ60GQaiEr+7TnT20kJtuR4NJ4u4vG5Rrvwnh7elpeM4wcysWmjCaWFyejpneNglkjTEB3OdrV0fEZxtheEHujqc3H43pINuHmhaGHb/YYytD6aQk3dsLBG1QFnG/vee/B62AMlxBompqbzpQuHq1+hvqYQ6TYTKmoH0P1mVkwVXdB02AIC4SObBFoNoUuRxdXtoz60dTiRn2Omlrg5lLDmquBNjgpPNK7hPrL5JiHRRBI+zEAtrZ8WmiumBjy2mI0R8IhpObgjjdvAD6phAL+6Ruc5fCMOprEKMes0rizPiQ7PyzTj2pktyMswh/0OL1kkZFaxj4YVAAotzE3CveZSZGWsjYDH6Pmf37g9jobm8XCVwNkTm3GxMhdRRXSqpm6I2IrbyaV6u94jRDecqerywP9sJ7psWa4MWEX9ArD1VCpF1XsqAAAAAElFTkSuQmCC")
          center / 23px 21px no-repeat;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        color: #ffffff;
        display: inline-flex;
        height: 21px;
        justify-content: center;
        padding: 0;
        position: relative;
        transition:
          box-shadow 150ms ease,
          opacity 150ms ease,
          transform 150ms ease;
        width: 23px;
      }

      .ai-guide-chip-trigger:hover,
      .ai-guide-chip-trigger:focus-visible,
      .ai-guide-chip.is-open .ai-guide-chip-trigger {
        box-shadow: none;
        outline: none;
        transform: none;
      }

      .ai-guide-chip-trigger:focus-visible {
        outline: 2px solid rgba(35, 80, 210, 0.28);
        outline-offset: 2px;
      }

      .ai-guide-icon {
        display: none;
      }

      .ai-guide-loader {
        animation: aiGuideSpin 780ms linear infinite;
        border: 2px solid rgba(255, 255, 255, 0.34);
        border-radius: 999px;
        border-top-color: #ffffff;
        height: 13px;
        opacity: 0;
        position: absolute;
        transition: opacity 130ms ease;
        width: 13px;
      }

      .ai-guide-chip-trigger.is-loading .ai-guide-icon {
        opacity: 0;
        transform: scale(0.82);
      }

      .ai-guide-chip-trigger.is-loading .ai-guide-loader {
        opacity: 1;
      }

      .ai-guide-chip-trigger.is-loading {
        background: linear-gradient(135deg, #3f8ddd 0%, #2139c4 58%, #1326a8 100%);
        border-radius: 7px 9px 9px 2px;
      }

      .ai-guide-popover {
        animation: aiGuidePopoverIn 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
        background:
          linear-gradient(180deg, rgba(248, 251, 255, 0.92) 0%, #ffffff 46%),
          #ffffff;
        border: 1px solid rgba(120, 143, 190, 0.22);
        border-radius: 16px;
        box-shadow:
          0 22px 58px rgba(25, 33, 61, 0.16),
          0 3px 12px rgba(25, 33, 61, 0.08);
        color: #202633;
        display: grid;
        gap: 12px;
        left: 0;
        padding: 14px;
        position: absolute;
        text-align: left;
        top: calc(100% + 10px);
        width: min(348px, calc(100vw - 40px));
        z-index: 40;
      }

      .ai-guide-chip.align-right .ai-guide-popover {
        left: auto;
        right: 0;
      }

      .ai-guide-popover::before {
        background: #f8fbff;
        border-left: 1px solid rgba(120, 143, 190, 0.22);
        border-top: 1px solid rgba(120, 143, 190, 0.22);
        content: "";
        height: 10px;
        left: 10px;
        position: absolute;
        top: -6px;
        transform: rotate(45deg);
        width: 10px;
      }

      .ai-guide-chip.align-right .ai-guide-popover::before {
        left: auto;
        right: 10px;
      }

      .ai-guide-popover-head {
        align-items: center;
        display: flex;
        gap: 10px;
        min-width: 0;
      }

      .ai-guide-popover-head > span {
        align-items: center;
        background:
          transparent
          url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAVCAYAAACt4nWrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAArdJREFUeAG1lEtIVFEYx/9Ojo45YyY1oykqEipKqYRGUdQuKqhFtAlaaUSmIb2QooWLwI0VpLTQRRA90EUbw8iwCI1KzddMJT4qckwmx5m5zZQz93E6j0mkyeYm+ocD9+Oe8/u+8/++e2MIFVZJhqVeVN8dQafDhRWHu6R5TMz48WTwG1YUHggquNMzBVUmGHP6Mf41gOUq5rfnrNrrTycxNh3A9x8ytBCghjSexGqJx74SKyr2Z+N8kx3vJiRoCpAYb0BuugVVx3KQbk2IgMcuDqzmOEwbg/DJIQ5lAJUuW1Ic0lJMfI9XCmFq5icU/p5gxCGhp9+N9ls7kWSO/Xvli9X0+CPaXjiRYDSgtbYMloRY9I960dU/i4fPnJB8Ck+uyhq/oaJouHIqH+VHs5eunMk/r+DI9jQ86PqCXVutHHyyYRC9Dg80BgyKilUK5DF91mTA/kH6ExXZ0G6HG6nrTSjKWofdBSl4PjRLwXMCRNehPam4WlnAgaJ60GQaiEr+7TnT20kJtuR4NJ4u4vG5Rrvwnh7elpeM4wcysWmjCaWFyejpneNglkjTEB3OdrV0fEZxtheEHujqc3H43pINuHmhaGHb/YYytD6aQk3dsLBG1QFnG/vee/B62AMlxBompqbzpQuHq1+hvqYQ6TYTKmoH0P1mVkwVXdB02AIC4SObBFoNoUuRxdXtoz60dTiRn2Omlrg5lLDmquBNjgpPNK7hPrL5JiHRRBI+zEAtrZ8WmiumBjy2mI0R8IhpObgjjdvAD6phAL+6Ruc5fCMOprEKMes0rizPiQ7PyzTj2pktyMswh/0OL1kkZFaxj4YVAAotzE3CveZSZGWsjYDH6Pmf37g9jobm8XCVwNkTm3GxMhdRRXSqpm6I2IrbyaV6u94jRDecqerywP9sJ7psWa4MWEX9ArD1VCpF1XsqAAAAAElFTkSuQmCC")
          center / 23px 21px no-repeat;
        border-radius: 0;
        box-shadow: none;
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 23px;
        height: 21px;
        justify-content: center;
        width: 23px;
      }

      .ai-guide-popover-head div {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .ai-guide-popover-head small {
        color: #687182;
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 12px;
        text-transform: uppercase;
      }

      .ai-guide-popover-head strong {
        color: #151a25;
        font-size: 13.5px;
        font-weight: 700;
        line-height: 18px;
      }

      .ai-guide-popover-body {
        display: grid;
        gap: 12px;
      }

      .ai-guide-primary-text {
        color: #3b4558;
        font-size: 12.5px;
        font-weight: 500;
        line-height: 18px;
        margin: 0;
        min-height: 72px;
      }

      .ai-guide-primary-text.is-typing::after {
        animation: aiGuideCursor 920ms steps(2, start) infinite;
        color: #10069f;
        content: "|";
        font-weight: 700;
        padding-left: 2px;
      }

      .ai-guide-example {
        animation: aiGuideExampleIn 180ms ease both;
        background: #f7faff;
        border: 1px solid #e2ebfb;
        border-radius: 12px;
        display: grid;
        gap: 4px;
        padding: 10px 11px;
      }

      .ai-guide-example span {
        color: #10069f;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0;
        line-height: 13px;
        text-transform: uppercase;
      }

      .ai-guide-example p {
        color: #536076;
        font-size: 11.5px;
        font-weight: 500;
        line-height: 16px;
        margin: 0;
      }

      @keyframes aiGuidePopoverIn {
        from {
          opacity: 0;
          transform: translateY(-8px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes aiGuideExampleIn {
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes aiGuideCursor {
        0%,
        45% {
          opacity: 1;
        }
        46%,
        100% {
          opacity: 0;
        }
      }

      @keyframes aiGuideSpin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class PmConsoleAiGuideChipComponent implements OnDestroy {
  @Input() title = '';
  @Input() what = '';
  @Input() how = '';
  @Input() example = '';
  @Input() align: 'left' | 'right' = 'left';

  open = false;
  typedCharacterCount = 0;
  private typingTimer: number | null = null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  get hasGuide(): boolean {
    return Boolean(this.what || this.how || this.example);
  }

  get ariaLabel(): string {
    return `Show AI guide for ${this.title}`;
  }

  get totalTypingLength(): number {
    return this.guideText.length;
  }

  get typingComplete(): boolean {
    return this.typedCharacterCount >= this.totalTypingLength;
  }

  get guideText(): string {
    return [this.what, this.how].filter(Boolean).join(' ');
  }

  get typedGuide(): string {
    return this.guideText.slice(0, Math.min(this.typedCharacterCount, this.guideText.length));
  }

  openGuide(): void {
    if (!this.hasGuide) return;
    this.setOpen(true);
  }

  closeGuide(): void {
    this.setOpen(false);
  }

  toggleGuide(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.hasGuide) return;
    this.setOpen(!this.open);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    const target = event.target;
    if (target instanceof Node && this.elementRef.nativeElement.contains(target)) return;
    this.setOpen(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.setOpen(false);
  }

  ngOnDestroy(): void {
    this.clearTypingTimer();
  }

  private setOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    if (open) {
      this.startTyping();
    } else {
      this.clearTypingTimer();
      this.typedCharacterCount = 0;
    }
    this.changeDetectorRef.markForCheck();
  }

  private startTyping(): void {
    this.clearTypingTimer();
    this.typedCharacterCount = 0;
    const total = this.totalTypingLength;
    if (!total) return;

    this.typingTimer = window.setInterval(() => {
      this.typedCharacterCount = Math.min(total, this.typedCharacterCount + 2);
      if (this.typedCharacterCount >= total) {
        this.clearTypingTimer();
      }
      this.changeDetectorRef.markForCheck();
    }, 34);
  }

  private clearTypingTimer(): void {
    if (this.typingTimer === null) return;
    window.clearInterval(this.typingTimer);
    this.typingTimer = null;
  }
}
