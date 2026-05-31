import { Injectable, signal } from '@angular/core';
import type { PortfolioActionItem } from './portfolio-manager-actions.data';

/**
 * Project Manager-local copy of the action-drawer state service. Holds the active
 * calendar action item for the PM "My Calendar" right-panel drawer. Isolated from
 * the Portfolio/PMO drawer service so opening a PM drawer never affects PMO.
 */
@Injectable({ providedIn: 'root' })
export class PmMyActionsDrawerService {
  private readonly activeItemSignal = signal<PortfolioActionItem | null>(null);

  readonly activeItem = this.activeItemSignal.asReadonly();

  open(item: PortfolioActionItem): void {
    this.activeItemSignal.set(item);
  }

  close(): void {
    this.activeItemSignal.set(null);
  }
}
