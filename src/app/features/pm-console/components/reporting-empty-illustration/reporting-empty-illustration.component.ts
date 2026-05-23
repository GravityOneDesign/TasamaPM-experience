import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pm-console-reporting-empty-illustration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="reporting-empty-illustration" aria-hidden="true">
      <img src="./assets/reporting-trends-empty-state.svg" alt="" decoding="async" />
    </figure>
  `,
  styles: [
    `
      :host {
        display: block;
        flex: 0 0 auto;
      }

      .reporting-empty-illustration {
        align-items: center;
        display: flex;
        height: var(--reporting-empty-illustration-height, 218px);
        justify-content: center;
        margin: 0;
        overflow: hidden;
      }

      .reporting-empty-illustration img {
        display: block;
        height: auto;
        max-height: var(--reporting-empty-illustration-height, 218px);
        max-width: 100%;
        object-fit: contain;
      }
    `,
  ],
})
export class PmConsoleReportingEmptyIllustrationComponent {}

