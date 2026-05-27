import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { PmConsoleIconComponent } from './pm-console-icon.component';

export interface PmConsoleCreateMenuOption {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
}

let createMenuInstance = 0;

@Component({
  selector: 'app-pm-console-create-menu',
  standalone: true,
  imports: [NgClass, PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pm-create-menu" [class.is-open]="isOpen" (click)="$event.stopPropagation()">
      <button
        class="pm-create-menu-trigger"
        [ngClass]="buttonClass"
        type="button"
        aria-haspopup="menu"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="menuId"
        [attr.aria-label]="ariaLabel || label"
        (click)="toggleMenu($event)"
      >
        <span [pmConsoleIcon]="icon" aria-hidden="true"></span>
        <span>{{ label }}</span>
        <span pmConsoleIcon="chevron-down" aria-hidden="true"></span>
      </button>

      @if (isOpen) {
        <div class="pm-create-menu-popover" [id]="menuId" role="menu">
          @for (option of options; track option.id) {
            <button type="button" role="menuitem" (click)="selectOption(option)">
              <span [pmConsoleIcon]="option.icon || 'plus'" aria-hidden="true"></span>
              <span>{{ option.label }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      position: relative;
    }

    .pm-create-menu {
      display: inline-flex;
      position: relative;
    }

    .pm-create-menu-trigger {
      align-items: center;
      background: var(--brand, #10069f);
      border: 1px solid var(--brand, #10069f);
      border-radius: 8px;
      color: #ffffff;
      cursor: pointer;
      display: inline-flex;
      font-size: 12px;
      font-weight: 600;
      gap: 6px;
      min-height: 34px;
      padding: 8px 12px;
      transition: background-color 160ms var(--motion-ease), border-color 160ms var(--motion-ease), box-shadow 160ms var(--motion-ease);
      white-space: nowrap;
    }

    .pm-create-menu-trigger:hover,
    .pm-create-menu-trigger:focus-visible,
    .pm-create-menu.is-open .pm-create-menu-trigger {
      background: #2f5bea;
      border-color: #2f5bea;
      box-shadow: 0 8px 18px rgba(16, 6, 159, 0.15);
      outline: none;
    }

    .pm-create-menu-trigger .icon {
      height: 14px;
      width: 14px;
    }

    .pm-create-menu-trigger .icon:last-child {
      height: 13px;
      transition: transform 160ms var(--motion-ease);
      width: 13px;
    }

    .pm-create-menu.is-open .pm-create-menu-trigger .icon:last-child {
      transform: rotate(180deg);
    }

    .pm-create-menu-popover {
      animation: motion-popover-in var(--motion-fast) var(--motion-ease) both;
      background: #ffffff;
      border: 1px solid #e1e7f0;
      border-radius: 8px;
      box-shadow: 0 14px 32px rgba(24, 31, 44, 0.14);
      display: grid;
      gap: 4px;
      min-width: 156px;
      padding: 6px;
      position: absolute;
      right: 0;
      top: calc(100% + 6px);
      z-index: 1000;
    }

    .pm-create-menu-popover button {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: #303645;
      cursor: pointer;
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

    .pm-create-menu-popover button:hover,
    .pm-create-menu-popover button:focus-visible {
      background: #f7f7ff;
      color: #10069f;
      outline: none;
    }

    .pm-create-menu-popover .icon {
      color: #707788;
      flex: 0 0 auto;
      height: 14px;
      width: 14px;
    }

    .pm-create-menu-popover button:hover .icon,
    .pm-create-menu-popover button:focus-visible .icon {
      color: #10069f;
    }
  `],
})
export class PmConsoleCreateMenuComponent {
  @Input() label = 'Add new';
  @Input() ariaLabel = '';
  @Input() icon = 'plus';
  @Input() buttonClass: string | string[] | Set<string> | Record<string, unknown> = '';
  @Input() options: readonly PmConsoleCreateMenuOption[] = [];

  @Output() readonly optionSelect = new EventEmitter<PmConsoleCreateMenuOption>();

  readonly menuId = `pm-create-menu-${createMenuInstance++}`;
  isOpen = false;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectOption(option: PmConsoleCreateMenuOption): void {
    this.optionSelect.emit(option);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target;
    if (target instanceof Node && this.elementRef.nativeElement.contains(target)) return;
    this.closeMenu();
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscape(event: Event): void {
    if (!this.isOpen) return;
    event.preventDefault();
    this.closeMenu();
  }

  private closeMenu(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.changeDetector.markForCheck();
  }
}
