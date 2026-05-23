import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ProjectOption } from '../../models/pm-console.types';
import { PmConsoleIconComponent } from '../../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pm-console-project-dropdown',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }

      .pm-project-dropdown {
        transition:
          background var(--motion-fast, 160ms) var(--motion-ease, ease),
          box-shadow var(--motion-fast, 160ms) var(--motion-ease, ease);
      }

      .pm-project-dropdown.is-open {
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 12px 24px rgba(21, 31, 54, 0.1);
      }

      .pm-project-dropdown-trigger {
        align-items: center;
        background: transparent;
        border: 0;
        color: #4f5969;
        cursor: pointer;
        display: inline-flex;
        flex: 1 1 auto;
        font: inherit;
        font-size: 11px;
        font-weight: 500;
        gap: 8px;
        justify-content: space-between;
        line-height: 15px;
        min-width: 0;
        outline: 0;
        padding: 0;
        text-align: left;
      }

      .pm-project-dropdown-trigger:focus-visible {
        color: var(--brand, #10069f);
      }

      .pm-project-dropdown-value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-project-dropdown-trigger .icon {
        color: #657184;
        flex: 0 0 auto;
        height: 16px;
        transition: transform var(--motion-fast, 160ms) var(--motion-ease, ease);
        width: 16px;
      }

      .pm-project-dropdown.is-open .pm-project-dropdown-trigger .icon {
        transform: rotate(180deg);
      }

      .pm-project-dropdown-menu {
        animation: motion-popover-in 140ms var(--motion-ease, ease);
        background: #ffffff;
        border: 1px solid #dfe6f1;
        border-radius: 12px;
        box-shadow: 0 18px 42px rgba(21, 31, 54, 0.16);
        display: grid;
        gap: 4px;
        max-height: min(280px, calc(100vh - 32px));
        overflow: auto;
        padding: 6px;
        position: fixed;
        z-index: 220;
      }

      .pm-project-dropdown-option {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 8px;
        color: #343b49;
        cursor: pointer;
        display: grid;
        font: inherit;
        font-size: 12px;
        font-weight: 500;
        grid-template-columns: 18px minmax(0, 1fr);
        gap: 8px;
        min-height: 38px;
        padding: 0 10px;
        text-align: left;
        width: 100%;
      }

      .pm-project-dropdown-option:hover,
      .pm-project-dropdown-option:focus-visible,
      .pm-project-dropdown-option.is-active {
        background: #f5f6ff;
        color: var(--brand, #10069f);
        outline: none;
      }

      .pm-project-dropdown-option.is-selected {
        background: rgba(16, 6, 159, 0.08);
        color: var(--brand, #10069f);
      }

      .pm-project-dropdown-check {
        align-items: center;
        border-radius: 999px;
        color: var(--brand, #10069f);
        display: inline-flex;
        height: 18px;
        justify-content: center;
        width: 18px;
      }

      .pm-project-dropdown-option:not(.is-selected) .pm-project-dropdown-check {
        visibility: hidden;
      }

      .pm-project-dropdown-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
  template: `
    <div
      #triggerShell
      class="workspace-project-switch pm-project-dropdown"
      [class.is-open]="isOpen"
      [attr.data-tour-target]="tourTarget || null"
      (click)="$event.stopPropagation()"
    >
      <span class="workspace-project-switch-label">{{ label }}</span>
      <button
        #triggerButton
        class="pm-project-dropdown-trigger"
        type="button"
        [attr.aria-label]="ariaLabel || label"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="listboxId"
        aria-haspopup="listbox"
        (click)="toggleDropdown($event)"
        (keydown)="handleTriggerKeydown($event)"
      >
        <span class="pm-project-dropdown-value">{{ selectedProjectName }}</span>
        <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
      </button>
    </div>

    @if (isOpen) {
      <div
        #popover
        class="pm-project-dropdown-menu"
        role="listbox"
        [id]="listboxId"
        [attr.aria-label]="ariaLabel || label"
        [style.top.px]="popoverTop"
        [style.left.px]="popoverLeft"
        [style.width.px]="popoverWidth"
      >
        @for (project of options; track project.id; let index = $index) {
          <button
            class="pm-project-dropdown-option"
            [class.is-active]="index === activeIndex"
            [class.is-selected]="project.id === value"
            type="button"
            role="option"
            [attr.aria-selected]="project.id === value"
            (click)="selectProject(project.id)"
            (keydown)="handleOptionKeydown($event, index)"
          >
            <span class="pm-project-dropdown-check" pmConsoleIcon="check" aria-hidden="true"></span>
            <span class="pm-project-dropdown-name">{{ project.name }}</span>
          </button>
        }
      </div>
    }
  `,
})
export class PmConsoleProjectDropdownComponent implements OnDestroy {
  private static activeDropdown: PmConsoleProjectDropdownComponent | null = null;
  private static nextId = 0;

  @Input() label = 'Viewing';
  @Input() ariaLabel = 'Select project';
  @Input() options: readonly ProjectOption[] = [];
  @Input() value = 'all';
  @Input() tourTarget = '';

  @Output() readonly valueChange = new EventEmitter<string>();

  @ViewChild('triggerShell') private triggerShell?: ElementRef<HTMLElement>;
  @ViewChild('triggerButton') private triggerButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('popover') private popover?: ElementRef<HTMLElement>;

  readonly listboxId = `pm-project-dropdown-${PmConsoleProjectDropdownComponent.nextId++}`;

  isOpen = false;
  activeIndex = 0;
  popoverTop = 0;
  popoverLeft = 0;
  popoverWidth = 0;

  private positionFrame: number | null = null;
  private positionUntil = 0;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnDestroy(): void {
    if (PmConsoleProjectDropdownComponent.activeDropdown === this) {
      PmConsoleProjectDropdownComponent.activeDropdown = null;
    }
    this.cancelPositionFrame();
  }

  get selectedProjectName(): string {
    return this.options.find((project) => project.id === this.value)?.name || 'All projects';
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (this.isOpen) {
      this.closeDropdown();
      return;
    }
    this.openDropdown();
  }

  selectProject(projectId: string): void {
    if (projectId !== this.value) {
      this.valueChange.emit(projectId);
    }
    this.closeDropdown(true);
  }

  handleTriggerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.openDropdown();
    this.moveActiveOption(event.key === 'ArrowDown' ? 1 : -1);
  }

  handleOptionKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveActiveOption(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveActiveOption(-1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectProject(this.options[index]?.id || this.value);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown(true);
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  handleViewportChange(): void {
    if (this.isOpen) this.closeDropdown();
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeKey(event: Event): void {
    if (!this.isOpen) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.closeDropdown(true);
  }

  private openDropdown(): void {
    if (!this.options.length) return;
    PmConsoleProjectDropdownComponent.activeDropdown?.closeDropdown();
    PmConsoleProjectDropdownComponent.activeDropdown = this;
    this.activeIndex = Math.max(0, this.options.findIndex((project) => project.id === this.value));
    this.isOpen = true;
    this.positionUntil = window.performance.now() + 360;
    this.positionPopover();
    this.changeDetector.markForCheck();
  }

  private closeDropdown(restoreFocus = false): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    if (PmConsoleProjectDropdownComponent.activeDropdown === this) {
      PmConsoleProjectDropdownComponent.activeDropdown = null;
    }
    this.positionUntil = 0;
    this.cancelPositionFrame();
    if (restoreFocus) this.triggerButton?.nativeElement.focus();
    this.changeDetector.markForCheck();
  }

  private moveActiveOption(direction: 1 | -1): void {
    const total = this.options.length;
    if (!total) return;
    this.activeIndex = (this.activeIndex + direction + total) % total;
    this.changeDetector.markForCheck();
  }

  private positionPopover(): void {
    this.cancelPositionFrame();
    this.positionFrame = window.requestAnimationFrame((timestamp) => {
      this.positionFrame = null;
      const trigger = this.triggerShell?.nativeElement;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const popover = this.popover?.nativeElement;
      const menuHeight = popover?.offsetHeight || 44 + this.options.length * 42;
      const margin = 8;
      const width = Math.max(220, triggerRect.width);

      let left = triggerRect.left;
      let top = triggerRect.bottom + 8;

      if (top + menuHeight + margin > window.innerHeight) {
        top = triggerRect.top - menuHeight - 8;
      }

      this.popoverWidth = Math.min(width, window.innerWidth - margin * 2);
      this.popoverLeft = Math.max(margin, Math.min(left, window.innerWidth - this.popoverWidth - margin));
      this.popoverTop = Math.max(margin, Math.min(top, window.innerHeight - menuHeight - margin));
      const desiredLeft = this.popoverLeft;
      const desiredTop = this.popoverTop;

      for (let pass = 0; pass < 2; pass += 1) {
        this.changeDetector.detectChanges();
        const paintedRect = popover?.getBoundingClientRect();
        if (!paintedRect) break;

        const offsetLeft = paintedRect.left - desiredLeft;
        const offsetTop = paintedRect.top - desiredTop;
        if (Math.abs(offsetLeft) < 0.5 && Math.abs(offsetTop) < 0.5) break;

        this.popoverLeft -= offsetLeft;
        this.popoverTop -= offsetTop;
      }
      this.changeDetector.detectChanges();
      if (this.isOpen && timestamp < this.positionUntil) {
        this.positionPopover();
      }
    });
  }

  private cancelPositionFrame(): void {
    if (this.positionFrame === null) return;
    window.cancelAnimationFrame(this.positionFrame);
    this.positionFrame = null;
  }
}


