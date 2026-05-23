import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { PmConsoleIconComponent } from './pm-console-icon.component';

@Component({
  selector: 'app-pm-console-row-action-menu',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="pm-row-action-menu" (click)="$event.stopPropagation()">
      <button
        #triggerButton
        class="schedule-table-action pm-row-action-trigger"
        type="button"
        [attr.aria-label]="ariaLabel"
        [attr.aria-expanded]="isOpen"
        aria-haspopup="menu"
        (click)="toggleMenu($event)"
      >
        <span pmConsoleIcon="ellipsis-vertical" aria-hidden="true"></span>
      </button>

      @if (isOpen) {
        <div
          #popover
          class="pm-row-action-popover"
          role="menu"
          [style.top.px]="popoverTop"
          [style.left.px]="popoverLeft"
          (click)="handlePopoverClick($event)"
        >
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .pm-row-action-menu {
        display: inline-flex;
        justify-content: flex-end;
        position: relative;
      }

      .pm-row-action-trigger {
        background: #ffffff;
        border-color: #dfe7f2;
        border-radius: 999px;
      }

      .pm-row-action-trigger:hover,
      .pm-row-action-trigger:focus-visible,
      .pm-row-action-trigger[aria-expanded='true'] {
        background: #f7f7ff;
        border-color: rgba(16, 6, 159, 0.28);
        color: #10069f;
      }

      .pm-row-action-popover {
        background: #ffffff;
        border: 1px solid #e1e7f0;
        border-radius: 8px;
        box-shadow: 0 14px 32px rgba(24, 31, 44, 0.14);
        display: grid;
        min-width: 168px;
        padding: 6px;
        position: fixed;
        z-index: 1000;
      }

      .pm-row-action-popover button {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 6px;
        color: #303645;
        display: flex;
        font-size: 12px;
        font-weight: 600;
        gap: 8px;
        justify-content: flex-start;
        min-height: 34px;
        padding: 0 10px;
        text-align: left;
        white-space: nowrap;
        width: 100%;
      }

      .pm-row-action-popover button:hover,
      .pm-row-action-popover button:focus-visible {
        background: #f7f7ff;
        color: #10069f;
        outline: none;
      }

      .pm-row-action-popover button.danger {
        color: #c03737;
      }

      .pm-row-action-popover button.danger:hover,
      .pm-row-action-popover button.danger:focus-visible {
        background: #fff0f0;
        color: #a92525;
      }

      .pm-row-action-popover .icon {
        flex: 0 0 auto;
        height: 14px;
        width: 14px;
      }
    `,
  ],
})
export class PmConsoleRowActionMenuComponent implements OnDestroy {
  private static activeMenu: PmConsoleRowActionMenuComponent | null = null;

  @Input() ariaLabel = 'Row actions';

  @ViewChild('triggerButton') private triggerButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('popover') private popover?: ElementRef<HTMLElement>;

  isOpen = false;
  popoverTop = 0;
  popoverLeft = 0;

  private positionFrame: number | null = null;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnDestroy(): void {
    if (PmConsoleRowActionMenuComponent.activeMenu === this) {
      PmConsoleRowActionMenuComponent.activeMenu = null;
    }
    if (this.positionFrame !== null) {
      window.cancelAnimationFrame(this.positionFrame);
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    if (this.isOpen) {
      this.closeMenu();
      return;
    }
    this.openMenu();
  }

  handlePopoverClick(event: MouseEvent): void {
    event.stopPropagation();
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('button')) {
      this.closeMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('window:resize')
  handleWindowResize(): void {
    if (this.isOpen) this.closeMenu();
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeKey(event: Event): void {
    if (!this.isOpen) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.closeMenu(true);
  }

  private openMenu(): void {
    PmConsoleRowActionMenuComponent.activeMenu?.closeMenu();
    PmConsoleRowActionMenuComponent.activeMenu = this;
    this.isOpen = true;
    this.positionPopover();
    this.changeDetector.markForCheck();
  }

  private closeMenu(restoreFocus = false): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    if (PmConsoleRowActionMenuComponent.activeMenu === this) {
      PmConsoleRowActionMenuComponent.activeMenu = null;
    }
    if (this.positionFrame !== null) {
      window.cancelAnimationFrame(this.positionFrame);
      this.positionFrame = null;
    }
    if (restoreFocus) this.triggerButton?.nativeElement.focus();
    this.changeDetector.markForCheck();
  }

  private positionPopover(): void {
    if (this.positionFrame !== null) {
      window.cancelAnimationFrame(this.positionFrame);
    }

    this.positionFrame = window.requestAnimationFrame(() => {
      this.positionFrame = null;
      const trigger = this.triggerButton?.nativeElement;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const popover = this.popover?.nativeElement;
      const menuWidth = popover?.offsetWidth || 168;
      const menuHeight = popover?.offsetHeight || 92;
      const margin = 8;

      let left = triggerRect.right - menuWidth;
      let top = triggerRect.bottom + 6;

      if (top + menuHeight + margin > window.innerHeight) {
        top = triggerRect.top - menuHeight - 6;
      }

      this.popoverLeft = Math.max(margin, Math.min(left, window.innerWidth - menuWidth - margin));
      this.popoverTop = Math.max(margin, Math.min(top, window.innerHeight - menuHeight - margin));
      this.changeDetector.markForCheck();
    });
  }
}
