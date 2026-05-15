import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PmConsoleIconService } from './pm-console-icon.service';
import { PmConsoleIconComponent } from './shared/pm-console-icon.component';

interface NotificationItem {
  title: string;
  detail: string;
  time: string;
  tone: string;
  icon: string;
  unread: boolean;
}

@Component({
  selector: 'app-pm-console-notifications',
  standalone: true,
  imports: [PmConsoleIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open) {
      <div class="notification-overlay" role="presentation">
        <button class="notification-backdrop" type="button" aria-label="Close notifications" (click)="closePanel.emit()"></button>
        <section class="notification-panel" role="dialog" aria-modal="true" aria-label="Notifications">
          <div class="notification-head">
            <div>
              <h2>Notifications</h2>
              <span>{{ unreadCount }} unread updates</span>
            </div>
            <button class="notification-close" type="button" aria-label="Close notifications" (click)="closePanel.emit()">
              <span pmConsoleIcon="x" aria-hidden="true"></span>
            </button>
          </div>
          <div class="notification-list">
            @for (item of notifications; track item.title) {
              <article class="notification-item {{ item.tone }} {{ item.unread ? 'unread' : '' }}">
                <span class="notification-item-icon">
                  <span [pmConsoleIcon]="lucideName(item.icon)" aria-hidden="true"></span>
                </span>
                <div>
                  <div class="notification-item-top">
                    <strong>{{ item.title }}</strong>
                    <time>{{ item.time }}</time>
                  </div>
                  <p>{{ item.detail }}</p>
                </div>
              </article>
            }
          </div>
          <button class="notification-footer-action" type="button">Open notification center</button>
        </section>
      </div>
    }
  `,
})
export class PmConsoleNotificationsComponent implements AfterViewChecked, OnChanges {
  @Input() open = false;
  @Output() readonly closePanel = new EventEmitter<void>();

  readonly notifications: NotificationItem[] = [
    {
      title: 'Vision 2030 status report is overdue',
      detail: 'Due 5 days ago. Submit the weekly update before the next steering check.',
      time: '12 min',
      tone: 'red',
      icon: 'alert',
      unread: true,
    },
    {
      title: 'Stage gate checklist ready',
      detail: '3 of 5 items are complete for the Execution gate.',
      time: '1 hr',
      tone: 'blue',
      icon: 'stageGate',
      unread: true,
    },
    {
      title: 'Benefits owner response received',
      detail: 'Smart City Alpha has a new owner note for review.',
      time: 'Today',
      tone: 'green',
      icon: 'check',
      unread: false,
    },
    {
      title: 'PMO forum pack due this week',
      detail: 'Prepare the capability pack before Friday.',
      time: 'May 15',
      tone: 'neutral',
      icon: 'calendar',
      unread: false,
    },
  ];

  private readonly icons: Record<string, string> = {
    alert: 'triangle-alert',
    calendar: 'calendar-days',
    check: 'circle-check',
    stageGate: 'clipboard-check',
  };
  private iconsHydrated = false;

  constructor(private readonly iconsService: PmConsoleIconService) {}

  get unreadCount(): number {
    return this.notifications.filter((item) => item.unread).length;
  }

  ngOnChanges(): void {
    if (!this.open) {
      this.iconsHydrated = false;
    }
  }

  ngAfterViewChecked(): void {
    if (!this.open || this.iconsHydrated) return;
    this.iconsService.refresh();
    this.iconsHydrated = true;
  }

  lucideName(name: string): string {
    return this.icons[name] || 'layout-grid';
  }
}
