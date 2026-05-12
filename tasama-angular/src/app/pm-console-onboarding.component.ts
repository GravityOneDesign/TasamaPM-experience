import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pm-console-onboarding',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="onboarding-screen" aria-label="Tasama onboarding">
      <img class="onboarding-line-art" src="./assets/onboarding-figma-line-art.svg" alt="" aria-hidden="true" />
      <div class="onboarding-brand" aria-label="Tasama">
        <img src="./assets/tasama-onboarding-logo.svg" alt="Tasama" />
      </div>
      <div class="onboarding-intro">
        <h1><span>Welcome,</span><em>Ahmed Khalid</em></h1>
        <p>Manage projects, delivery &amp; reporting, in one intelligent operational workspace.</p>
        <div class="onboarding-actions">
          <button class="onboarding-primary" type="button" (click)="takeTour.emit()">
            <span>Take A Tour</span>
            <span class="onboarding-primary-icon">
              <span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </span>
          </button>
          <button class="onboarding-secondary" type="button" (click)="proceed.emit()">
            <span>Proceed to front door</span>
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <aside class="onboarding-options" aria-label="PMO onboarding options">
        <div class="onboarding-options-list">
          <header>
            <span>Getting started</span>
            <strong>Your PMO onboarding</strong>
            <small>A quick walkthrough &mdash; 2 minutes.</small>
          </header>
          <article>
            <img src="./assets/onboarding-step-plan.svg" alt="" aria-hidden="true" />
            <div>
              <strong>Plan</strong>
              <p>Create project plans, timelines, risks, and dependencies.</p>
            </div>
            <span>1</span>
          </article>
          <article>
            <img src="./assets/onboarding-step-report.svg" alt="" aria-hidden="true" />
            <div>
              <strong>Report</strong>
              <p>Submit weekly PSRs, update status, and track delivery health.</p>
            </div>
            <span>2</span>
          </article>
          <article>
            <img src="./assets/onboarding-step-govern.svg" alt="" aria-hidden="true" />
            <div>
              <strong>Govern</strong>
              <p>Monitor actions, approvals, and project workflows.</p>
            </div>
            <span>3</span>
          </article>
        </div>
      </aside>
      <div class="onboarding-powered">
        <span>Powered by</span>
        <img src="./assets/strategy-zero-logo.png" alt="Strategy Zero" />
      </div>
    </section>
  `,
})
export class PmConsoleOnboardingComponent {
  @Output() readonly takeTour = new EventEmitter<void>();
  @Output() readonly proceed = new EventEmitter<void>();
}
