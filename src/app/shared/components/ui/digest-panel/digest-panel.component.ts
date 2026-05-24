import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PmConsoleIconComponent } from '../icon/icon.component';

export interface PmConsoleDigestTextPart {
  text: string;
  emphasis?: boolean;
}

export interface PmConsoleDigestItem {
  parts: readonly PmConsoleDigestTextPart[];
}

export interface PmConsoleDigestSection {
  label: string;
  items: readonly PmConsoleDigestItem[];
}

@Component({
  selector: 'app-pm-console-digest-panel',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-height: 0;
        min-width: 0;
      }

      .digest-panel {
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 12px;
        box-shadow:
          0 1px 0.5px rgba(1, 10, 15, 0.04),
          0 2px 2px rgba(1, 10, 15, 0.08);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        gap: 16px;
        height: 100%;
        min-height: 0;
        overflow: hidden;
        padding: 12px;
      }

      .digest-panel-hero {
        align-items: center;
        display: grid;
        gap: 12px;
        grid-template-columns: 64px minmax(0, 1fr);
        min-width: 0;
      }

      .digest-panel-hero-icon {
        align-items: center;
        background: rgba(16, 6, 159, 0.03);
        border-radius: 12px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.12);
        color: #10069f;
        display: inline-flex;
        height: 64px;
        justify-content: center;
        width: 64px;
      }

      .digest-panel-hero-icon .icon {
        height: 28px;
        width: 28px;
      }

      .digest-panel-hero-icon img {
        display: block;
        height: auto;
        width: 28px;
      }

      .digest-panel-hero-copy {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .digest-panel-hero-copy h2 {
        color: #0b0b0b;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .digest-panel-hero-copy p {
        color: #2f2f2f;
        font-size: 12px;
        line-height: 16px;
        margin: 0;
      }

      .digest-panel-body {
        background:
          linear-gradient(91.53deg, rgba(16, 6, 159, 0.075) 2.48%, rgba(16, 6, 159, 0.038) 28.33%, rgba(151, 71, 255, 0.038) 80.05%, rgba(200, 125, 127, 0.15) 105.9%),
          #ffffff;
        border: 4px solid #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(1, 10, 15, 0.1);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
        overflow: hidden;
        padding: 12px 8px;
        position: relative;
      }

      .digest-panel-body::after {
        background: rgba(255, 255, 255, 0.86);
        clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%);
        content: "";
        height: 40px;
        opacity: 0.8;
        pointer-events: none;
        position: absolute;
        right: 2px;
        top: 2px;
        width: 40px;
      }

      .digest-panel-title {
        align-items: center;
        display: inline-flex;
        gap: 8px;
        min-width: 0;
        position: relative;
        z-index: 1;
      }

      .digest-panel-title .icon {
        color: #9747ff;
        height: 16px;
        width: 16px;
      }

      .digest-panel-title span:last-child {
        background: linear-gradient(90deg, #10069f 0%, #9747ff 50%, #c87d7f 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 16px;
      }

      .digest-panel-content {
        align-content: start;
        display: grid;
        gap: 24px;
        margin-top: 8px;
        min-height: 0;
        position: relative;
        z-index: 1;
      }

      .digest-panel-section {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .digest-panel-section-label {
        align-items: center;
        color: #777777;
        display: grid;
        font-size: 12px;
        font-weight: 400;
        gap: 8px;
        grid-template-columns: auto minmax(0, 1fr);
        line-height: 16px;
      }

      .digest-panel-section-label::after {
        background: linear-gradient(90deg, rgba(16, 6, 159, 0.3), rgba(200, 125, 127, 0.3));
        content: "";
        height: 1px;
      }

      .digest-panel-list {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .digest-panel-item {
        background: linear-gradient(90deg, rgba(200, 125, 159, 0.1) 0%, rgba(151, 71, 255, 0.025) 51.92%, rgba(16, 6, 159, 0.025) 75%, rgba(16, 6, 159, 0.05) 100%);
        border-radius: 8px;
        color: #2f2f2f;
        display: grid;
        font-size: 12px;
        font-weight: 400;
        grid-template-columns: minmax(0, 1fr);
        justify-content: center;
        line-height: 16px;
        min-height: 48px;
        padding: 8px;
      }

      .digest-panel-item:not(:first-child) {
        background: linear-gradient(90deg, rgba(200, 125, 127, 0.1) 0%, rgba(151, 71, 255, 0.025) 51.92%, rgba(16, 6, 159, 0.025) 75%, rgba(16, 6, 159, 0.05) 100%);
      }

      .digest-panel-item-copy {
        align-self: center;
        display: block;
        min-width: 0;
      }

      .digest-panel-item-copy > :not(:first-child)::before {
        content: " ";
      }

      .digest-panel-item strong {
        font-weight: 500;
      }
    `,
  ],
  template: `
    <article class="digest-panel" [attr.aria-label]="title">
      <header class="digest-panel-hero">
        <span class="digest-panel-hero-icon" aria-hidden="true">
          @if (heroAssetSrc) {
            <img [src]="heroAssetSrc" alt="" />
          } @else {
            <span [pmConsoleIcon]="heroIconName"></span>
          }
        </span>
        <div class="digest-panel-hero-copy">
          <h2>{{ title }}</h2>
          <p>
            @for (line of subtitleLines; track line; let last = $last) {
              {{ line }}@if (!last) { <br /> }
            }
          </p>
        </div>
      </header>

      <section class="digest-panel-body" [attr.aria-label]="digestTitle">
        <div class="digest-panel-title">
          <span [pmConsoleIcon]="digestIconName" aria-hidden="true"></span>
          <span>{{ digestTitle }}</span>
        </div>
        <div class="digest-panel-content">
          @for (section of visibleSections; track section.label) {
            <section class="digest-panel-section" [attr.aria-label]="section.label">
              <div class="digest-panel-section-label">{{ section.label }}</div>
              <div class="digest-panel-list">
                @for (item of section.items; track $index) {
                  <p class="digest-panel-item">
                    <span class="digest-panel-item-copy">
                      @for (part of item.parts; track $index; let last = $last) {
                        @if (part.emphasis) {
                          <strong>{{ part.text }}</strong>
                        } @else {
                          <span>{{ part.text }}</span>
                        }
                      }
                    </span>
                  </p>
                }
              </div>
            </section>
          }
        </div>
      </section>
    </article>
  `,
})
export class PmConsoleDigestPanelComponent {
  @Input() title = 'Welcome!';
  @Input() subtitleLines: readonly string[] = ['Start your project', 'management journey!'];
  @Input() heroIconName = 'target';
  @Input() heroAssetSrc = '';
  @Input() digestTitle = 'Daily Digest';
  @Input() digestIconName = 'wand-sparkles';
  @Input() sectionLabel = 'Birds Eye View';
  @Input() items: readonly PmConsoleDigestItem[] = [];
  @Input() sections: readonly PmConsoleDigestSection[] = [];

  get visibleSections(): readonly PmConsoleDigestSection[] {
    return this.sections.length ? this.sections : [{ label: this.sectionLabel, items: this.items }];
  }
}

