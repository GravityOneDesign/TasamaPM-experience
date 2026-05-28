import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';

export interface RoleQuickLink {
  id: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-pm-console-role-quick-links-grid',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .quicklinks-view {
        overflow: auto;
      }

      .workspace-quick-links-view {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 26px;
        min-height: 0;
        padding-top: 5px;
      }

      .workspace-quick-links-view h2 {
        color: #0b0b0b;
        font-size: 18px;
        font-weight: 600;
        line-height: 24px;
        margin: 0;
      }

      .workspace-quick-links-view .selected-project-quick-link-grid {
        display: grid;
        flex: 0 0 auto;
        gap: 16px;
        grid-auto-rows: minmax(130px, auto);
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .workspace-quick-links-view .selected-project-quick-link-card {
        background:
          radial-gradient(132px 86px at 100% 0, rgba(16, 6, 159, 0.08), rgba(16, 6, 159, 0.025) 48%, rgba(255, 255, 255, 0) 72%),
          #fbfbff;
        border: 1px solid rgba(216, 220, 232, 0.86);
        border-radius: 12px;
        box-shadow:
          inset 0 0 0 3px rgba(255, 255, 255, 0.72),
          0 2px 8px rgba(11, 11, 11, 0.06);
        display: flex;
        min-height: 130px;
        position: relative;
        transition: box-shadow 0.2s, outline 0.2s;
      }
      
      .workspace-quick-links-view .selected-project-quick-link-card:hover,
      .workspace-quick-links-view .selected-project-quick-link-card:focus-within {
        border-color: #dfe3ee;
        box-shadow: 0 4px 12px #010a0f14;
        transform: translateY(-1px);
      }

      .workspace-quick-links-view .selected-project-quick-link-main {
        appearance: none;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        padding: 16px;
        text-align: left;
        width: 100%;
      }

      .workspace-quick-links-view .selected-project-quick-link-icon {
        align-items: center;
        background: rgba(16, 6, 159, 0.06);
        border-radius: 8px;
        color: #10069f;
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .workspace-quick-links-view .selected-project-quick-link-icon .icon {
        height: 18px;
        width: 18px;
      }

      .workspace-quick-links-view .selected-project-quick-link-copy {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .workspace-quick-links-view .selected-project-quick-link-copy strong {
        color: #0b0b0b;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }

      .workspace-quick-links-view .selected-project-quick-link-copy small {
        color: #404040;
        font-size: 12px;
        line-height: 16px;
      }

      .workspace-quick-links-view .selected-project-quick-link-pin {
        display: none;
      }

      @media (max-width: 1180px) {
        .workspace-quick-links-view .selected-project-quick-link-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .workspace-quick-links-view .selected-project-quick-link-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 520px) {
        .workspace-quick-links-view .selected-project-quick-link-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
  template: `
    <div class="workspace-quick-links-view">
      <div class="selected-project-quick-link-grid" role="list">
        @for (link of links; track link.id) {
          <article class="selected-project-quick-link-card" role="listitem">
            <button
              class="selected-project-quick-link-main"
              type="button"
              [attr.aria-label]="link.title"
              (click)="linkSelected.emit(link.id)"
            >
              <span class="selected-project-quick-link-icon" aria-hidden="true">
                <span class="icon" [pmConsoleIcon]="link.icon"></span>
              </span>
              <span class="selected-project-quick-link-copy">
                <strong>{{ link.title }}</strong>
                <small>{{ link.description }}</small>
              </span>
            </button>
            <button type="button" class="selected-project-quick-link-pin" title="Pin" aria-label="Pin">
              <span aria-hidden="true" class="icon selected-project-pin-default">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin"><path d="M12 17v5"></path><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path></svg>
              </span>
              <span aria-hidden="true" class="icon selected-project-pin-unpin">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-off"><path d="M12 17v5"></path><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"></path><path d="m2 2 20 20"></path><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"></path></svg>
              </span>
            </button>
          </article>
        }
      </div>
    </div>
  `,
})
export class PmConsoleRoleQuickLinksGridComponent {
  @Input() links: readonly RoleQuickLink[] = [];

  @Output() readonly linkSelected = new EventEmitter<string>();
}
