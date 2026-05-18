import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface PmConsoleProjectProfileField {
  label: string;
  value: string;
  avatarInitials?: string;
  wide?: boolean;
}

@Component({
  selector: 'app-pm-console-project-profile-card',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: 100%;
      }

      .project-profile-card {
        align-items: start;
        background: #ffffff;
        border: 1px solid #e8e8e8;
        border-left: 4px solid #10069f;
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(1, 10, 15, 0.08);
        display: grid;
        gap: 32px;
        grid-template-columns: 264px minmax(0, 1fr);
        min-height: 152px;
        overflow: clip;
        padding: 16px 16px 16px 12px;
      }

      .project-profile-intro {
        display: grid;
        gap: 12px;
        min-width: 0;
      }

      .project-profile-icon {
        align-items: center;
        background: rgba(16, 6, 159, 0.03);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(1, 10, 15, 0.1);
        color: #10069f;
        display: inline-flex;
        height: 40px;
        justify-content: center;
        width: 40px;
      }

      .project-profile-icon .icon {
        height: 24px;
        width: 24px;
      }

      .project-profile-copy {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .project-profile-copy h3 {
        color: #111111;
        font-size: 18px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 24px;
        margin: 0;
      }

      .project-profile-copy p {
        color: #767676;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        margin: 0;
      }

      .project-profile-fields {
        align-content: start;
        display: grid;
        gap: 24px 16px;
        grid-template-columns: repeat(3, minmax(0, 240px));
        margin: 0;
        min-width: 0;
      }

      .project-profile-field {
        display: grid;
        gap: 6px;
        min-width: 0;
      }

      .project-profile-field.wide {
        grid-column: span 2;
      }

      .project-profile-field dt {
        color: #6f6f6f;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 16px;
        margin: 0;
        white-space: nowrap;
      }

      .project-profile-field dd {
        align-items: center;
        color: #101010;
        display: flex;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
        min-width: 0;
      }

      .project-profile-field dd strong {
        color: inherit;
        display: block;
        font: inherit;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .project-profile-avatar {
        align-items: center;
        background: rgba(16, 6, 159, 0.1);
        border-radius: 999px;
        color: #10069f;
        display: inline-flex;
        flex: 0 0 24px;
        font-size: 10px;
        font-weight: 600;
        height: 24px;
        justify-content: center;
        line-height: 12px;
        width: 24px;
      }

      @media (max-width: 980px) {
        .project-profile-card {
          gap: 22px;
          grid-template-columns: minmax(0, 1fr);
        }

        .project-profile-fields {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .project-profile-fields {
          grid-template-columns: minmax(0, 1fr);
        }

        .project-profile-field.wide {
          grid-column: auto;
        }
      }
    `,
  ],
  template: `
    <article class="project-profile-card">
      <section class="project-profile-intro" aria-label="Project profile summary">
        <span class="project-profile-icon" aria-hidden="true">
          <span [pmConsoleIcon]="iconName"></span>
        </span>
        <div class="project-profile-copy">
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
      </section>

      <dl class="project-profile-fields">
        @for (field of fields; track field.label) {
          <div class="project-profile-field" [class.wide]="field.wide">
            <dt>{{ field.label }}</dt>
            <dd [class.has-avatar]="field.avatarInitials">
              @if (field.avatarInitials) {
                <span class="project-profile-avatar" aria-hidden="true">{{ field.avatarInitials }}</span>
              }
              <strong>{{ field.value }}</strong>
            </dd>
          </div>
        }
      </dl>
    </article>
  `,
})
export class PmConsoleProjectProfileCardComponent {
  @Input() title = 'Project Profile';
  @Input() description = 'Browse your project setup';
  @Input() iconName = 'rocket';
  @Input() fields: PmConsoleProjectProfileField[] = [];
}
