import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { pmoDecisionIntelligenceSections } from './pmo-decision-intelligence.data';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

@Component({
  selector: 'app-pmo-decision-intelligence',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app-canvas pmo-decision-canvas">
      <div class="page-motion-host">
        <section class="pmo-decision-page" aria-label="Insights and Decision Intelligence">
          <header class="pmo-decision-header">
            <div class="pmo-decision-title-group">
              <button class="pmo-decision-back-button" type="button" aria-label="Back to PMO home" (click)="backSelected.emit()">
                <span pmConsoleIcon="arrow-left" aria-hidden="true"></span>
              </button>
              <h1>Insights &amp; Decision Intelligence</h1>
            </div>
          </header>

          <section class="pmo-decision-body" aria-label="Decision intelligence tools">
            @for (section of sections; track section.id) {
              <section class="pmo-decision-section" [class.is-expanded]="isSectionExpanded(section.id)" [attr.aria-labelledby]="section.id + '-heading'">
                <header class="pmo-decision-section-heading">
                  <h2 [id]="section.id + '-heading'">
                    @if (!isSectionExpanded(section.id)) {
                      <span class="pmo-decision-collapsed-preview" aria-hidden="true">
                        <img [src]="section.categoryArtwork.src" alt="" decoding="async" />
                      </span>
                    }
                    <span>{{ section.title }}{{ isSectionExpanded(section.id) ? ' (' + section.count + ')' : '' }}</span>
                  </h2>
                  <span aria-hidden="true"></span>
                  <button
                    class="pmo-decision-section-toggle"
                    type="button"
                    [attr.aria-label]="(isSectionExpanded(section.id) ? 'Collapse ' : 'Expand ') + section.title"
                    [attr.aria-expanded]="isSectionExpanded(section.id)"
                    (click)="toggleSection(section.id)"
                  >
                    <span [pmConsoleIcon]="isSectionExpanded(section.id) ? 'chevron-up' : 'chevron-down'" aria-hidden="true"></span>
                  </button>
                </header>

                @if (isSectionExpanded(section.id) && section.cards.length) {
                  <div class="pmo-decision-expanded-row">
                    <aside class="pmo-decision-category-card" [attr.aria-label]="section.title">
                      <img
                        class="pmo-decision-category-art"
                        [src]="section.categoryArtwork.src"
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                        [style.left.px]="section.categoryArtwork.left"
                        [style.top.px]="section.categoryArtwork.top"
                        [style.width.px]="section.categoryArtwork.width"
                        [style.height.px]="section.categoryArtwork.height"
                      />
                      <strong>{{ section.title }}</strong>
                    </aside>

                    <div class="pmo-decision-card-row">
                      @for (card of section.cards; track card.id) {
                        <button class="pmo-decision-card" type="button" [attr.aria-label]="card.title">
                          <span class="pmo-decision-card-icon" aria-hidden="true">
                            <span [pmConsoleIcon]="card.icon"></span>
                          </span>
                          <span class="pmo-decision-card-copy">
                            <strong>{{ card.title }}</strong>
                            <small>{{ card.description }}</small>
                          </span>
                          <span class="pmo-decision-card-arrow" pmConsoleIcon="arrow-right" aria-hidden="true"></span>
                        </button>
                      }
                    </div>
                  </div>
                }
              </section>
            }
          </section>
        </section>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .pmo-decision-canvas {
        overflow: hidden;
        padding: 16px 24px 24px;
      }

      .pmo-decision-page {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 16px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.08);
        display: grid;
        grid-template-rows: 108px minmax(0, 1fr);
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
      }

      .pmo-decision-header {
        background:
          url('../assets/workspace-line-art.svg') right 18px top -39px / 858px 188px no-repeat,
          linear-gradient(90deg, #eef2ff 0%, #f0f2ff 56%, #eeeffc 100%),
          #eef2ff;
        border-radius: 16px 16px 0 0;
        min-height: 108px;
        overflow: hidden;
        position: relative;
      }

      .pmo-decision-title-group {
        align-items: center;
        display: flex;
        gap: 8px;
        left: 16px;
        min-width: 0;
        position: absolute;
        top: 17px;
        z-index: 2;
      }

      .pmo-decision-title-group h1 {
        color: #0b0b0b;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .pmo-decision-back-button {
        align-items: center;
        border-radius: 6px;
        color: #828899;
        display: inline-flex;
        flex: 0 0 auto;
        height: 24px;
        justify-content: center;
        outline: none;
        transition:
          background var(--motion-fast) var(--motion-ease),
          color var(--motion-fast) var(--motion-ease);
        width: 24px;
      }

      .pmo-decision-back-button:hover,
      .pmo-decision-back-button:focus-visible {
        background: rgba(16, 6, 159, 0.08);
        color: #10069f;
      }

      .pmo-decision-back-button .icon {
        height: 20px;
        width: 20px;
      }

      .pmo-decision-body {
        align-content: start;
        background: #ffffff;
        display: grid;
        min-height: 0;
        overflow: auto;
        padding: 8px 18px 24px;
      }

      .pmo-decision-section {
        border-bottom: 1px solid #eeeeee;
        display: grid;
        min-width: 0;
      }

      .pmo-decision-section.is-expanded {
        padding-bottom: 0;
      }

      .pmo-decision-section-heading {
        align-items: center;
        display: grid;
        gap: 12px;
        grid-template-columns: auto minmax(0, 1fr) 24px;
        min-height: 16px;
        min-width: 0;
      }

      .pmo-decision-section-heading h2 {
        color: #777777;
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
        margin: 0;
        white-space: nowrap;
      }

      .pmo-decision-section-heading > span {
        background: #dddddd;
        height: 1px;
        min-width: 24px;
      }

      .pmo-decision-section-toggle {
        align-items: center;
        border-radius: 6px;
        color: #687182;
        display: inline-flex;
        height: 24px;
        justify-content: center;
        outline: none;
        width: 24px;
      }

      .pmo-decision-section-toggle:hover,
      .pmo-decision-section-toggle:focus-visible {
        background: rgba(16, 6, 159, 0.08);
        color: #10069f;
      }

      .pmo-decision-section-toggle .icon {
        height: 16px;
        width: 16px;
      }

      .pmo-decision-expanded-row {
        display: grid;
        gap: 13px;
        grid-template-columns: 130px minmax(0, 1fr);
        min-height: 205px;
        min-width: 0;
        padding: 16px 12px;
      }

      .pmo-decision-category-card {
        background: linear-gradient(180deg, #5f55f2 0%, #10069f 100%);
        border: 0;
        border-radius: 5.2px;
        box-shadow: 0 0.65px 2.6px rgba(1, 10, 15, 0.1);
        height: 173px;
        min-width: 0;
        overflow: hidden;
        position: relative;
      }

      .pmo-decision-category-art {
        display: block;
        object-fit: fill;
        position: absolute;
        user-select: none;
      }

      .pmo-decision-category-card strong {
        bottom: 11px;
        color: #addc91;
        display: block;
        font-size: 17px;
        font-weight: 600;
        left: 12px;
        line-height: 22px;
        max-width: 114px;
        position: absolute;
      }

      .pmo-decision-card-row {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        min-width: 0;
      }

      .pmo-decision-card {
        background:
          radial-gradient(180px 122px at 100% 0%, rgba(16, 6, 159, 0.08) 0%, rgba(16, 6, 159, 0.024) 48%, rgba(255, 255, 255, 0) 72%),
          #fbfbff;
        border: 1px solid rgba(216, 220, 232, 0.86);
        border-radius: 15px;
        box-shadow: 0 3px 10px rgba(11, 11, 11, 0.06);
        color: inherit;
        display: grid;
        grid-template-rows: 40px minmax(0, 1fr) 24px;
        height: 173px;
        min-width: 0;
        outline: none;
        overflow: hidden;
        padding: 20px;
        position: relative;
        text-align: left;
        transition:
          border-color var(--motion-fast) var(--motion-ease),
          box-shadow var(--motion-fast) var(--motion-ease),
          transform var(--motion-fast) var(--motion-ease);
      }

      .pmo-decision-card::after {
        box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.72);
        content: "";
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .pmo-decision-card:hover,
      .pmo-decision-card:focus-visible {
        border-color: #d6d8df;
        box-shadow: 0 8px 18px rgba(1, 10, 15, 0.12);
        transform: translateY(-1px);
      }

      .pmo-decision-card-icon {
        align-items: center;
        background:
          linear-gradient(rgba(16, 6, 159, 0.03), rgba(16, 6, 159, 0.03)),
          #ffffff;
        border-radius: 8px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.12);
        color: #10069f;
        display: inline-flex;
        height: 40px;
        justify-content: center;
        position: relative;
        width: 40px;
        z-index: 1;
      }

      .pmo-decision-card-icon .icon {
        height: 20px;
        width: 20px;
      }

      .pmo-decision-card-copy {
        display: grid;
        gap: 6px;
        min-width: 0;
        position: relative;
        z-index: 1;
      }

      .pmo-decision-card-copy strong {
        color: #0b0b0b;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
      }

      .pmo-decision-card-copy small {
        color: #2f2f2f;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
      }

      .pmo-decision-card-arrow {
        align-self: end;
        color: #10069f;
        height: 18px;
        justify-self: end;
        position: relative;
        width: 18px;
        z-index: 1;
      }

      .pmo-decision-section:not(.is-expanded) {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 12px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 8px rgba(11, 11, 11, 0.05);
        margin: 8px 0 0;
        min-height: 104px;
        padding: 12px 14px;
      }

      .pmo-decision-section:not(.is-expanded) .pmo-decision-section-heading {
        grid-template-columns: minmax(0, 1fr) 24px;
        min-height: 78px;
      }

      .pmo-decision-section:not(.is-expanded) .pmo-decision-section-heading h2 {
        align-items: center;
        color: #10069f;
        display: inline-flex;
        font-size: 16px;
        font-weight: 600;
        gap: 18px;
        line-height: 22px;
        min-width: 0;
      }

      .pmo-decision-collapsed-preview {
        background: linear-gradient(180deg, #5f55f2 0%, #10069f 100%);
        border-radius: 20px;
        box-shadow:
          0 16px 28px rgba(16, 6, 159, 0.12),
          0 3px 8px rgba(1, 10, 15, 0.1);
        display: block;
        flex: 0 0 112px;
        height: 70px;
        overflow: hidden;
        position: relative;
        width: 112px;
      }

      .pmo-decision-collapsed-preview img {
        display: block;
        height: 100%;
        inset: 0;
        object-fit: cover;
        object-position: left top;
        position: absolute;
        width: 100%;
      }

      .pmo-decision-section:not(.is-expanded) .pmo-decision-section-heading h2 > span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pmo-decision-section:not(.is-expanded) .pmo-decision-section-heading > span {
        display: none;
      }

      @media (max-width: 1180px) {
        .pmo-decision-canvas {
          overflow: auto;
          padding: 14px 16px 20px;
        }

        .pmo-decision-page {
          min-height: 706px;
        }

        .pmo-decision-body {
          overflow-x: auto;
        }

        .pmo-decision-expanded-row {
          min-width: 1282px;
        }
      }

      @media (max-width: 760px) {
        .pmo-decision-canvas {
          padding: 12px;
        }

        .pmo-decision-page {
          grid-template-rows: 108px minmax(0, 1fr);
        }

        .pmo-decision-body {
          padding: 12px;
        }

        .pmo-decision-expanded-row {
          grid-template-columns: minmax(0, 1fr);
          min-width: 0;
          padding: 16px 0;
        }

        .pmo-decision-category-card {
          height: 173px;
          justify-self: start;
          width: 130px;
        }

        .pmo-decision-card-row {
          grid-template-columns: minmax(0, 1fr);
        }

        .pmo-decision-card {
          height: auto;
          min-height: 166px;
        }

        .pmo-decision-section:not(.is-expanded) {
          min-height: 94px;
          padding: 10px 12px;
        }

        .pmo-decision-section:not(.is-expanded) .pmo-decision-section-heading {
          min-height: 72px;
        }

        .pmo-decision-section:not(.is-expanded) .pmo-decision-section-heading h2 {
          gap: 12px;
        }

        .pmo-decision-collapsed-preview {
          border-radius: 16px;
          flex-basis: 94px;
          height: 60px;
          width: 94px;
        }
      }
    `,
  ],
})
export class PmoDecisionIntelligenceComponent {
  @Output() readonly backSelected = new EventEmitter<void>();

  readonly sections = pmoDecisionIntelligenceSections;
  readonly expandedSectionIds = new Set(this.sections.filter((section) => section.expanded).map((section) => section.id));

  isSectionExpanded(sectionId: string): boolean {
    return this.expandedSectionIds.has(sectionId);
  }

  toggleSection(sectionId: string): void {
    if (this.expandedSectionIds.has(sectionId)) {
      this.expandedSectionIds.delete(sectionId);
      return;
    }
    this.expandedSectionIds.add(sectionId);
  }
}
