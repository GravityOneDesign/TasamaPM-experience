import { Injectable, signal } from '@angular/core';
import type { PortfolioActionItem } from './portfolio-manager-actions.data';

@Injectable({ providedIn: 'root' })
export class PortfolioManagerActionDrawerService {
  private readonly activeItemSignal = signal<PortfolioActionItem | null>(null);

  readonly activeItem = this.activeItemSignal.asReadonly();

  open(item: PortfolioActionItem): void {
    this.activeItemSignal.set(item);
  }

  close(): void {
    this.activeItemSignal.set(null);
  }
}
