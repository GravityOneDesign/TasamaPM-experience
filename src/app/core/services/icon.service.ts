import { Injectable } from '@angular/core';

declare global {
  interface Window {
    lucide?: {
      createIcons: (options?: { attrs?: Record<string, string> }) => void;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class PmConsoleIconService {
  private loading?: Promise<void>;
  private refreshScheduled = false;

  refresh(): void {
    if (this.refreshScheduled) return;
    this.refreshScheduled = true;

    queueMicrotask(() => {
      this.refreshScheduled = false;
      void this.load().then(() => {
        window.lucide?.createIcons({
          attrs: {
            'stroke-width': '1.6',
            'aria-hidden': 'true',
          },
        });
      });
    });
  }

  private load(): Promise<void> {
    if (window.lucide) return Promise.resolve();
    if (this.loading) return this.loading;

    this.loading = new Promise((resolve, reject) => {
      const src = 'assets/lucide.min.js';
      const existing = document.querySelector<HTMLScriptElement>(`script[data-angular-loader="${src}"]`);
      if (existing?.dataset['loaded'] === 'true') {
        resolve();
        return;
      }

      const script = existing ?? document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset['angularLoader'] = src;
      script.addEventListener(
        'load',
        () => {
          script.dataset['loaded'] = 'true';
          resolve();
        },
        { once: true },
      );
      script.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), { once: true });

      if (!existing) {
        document.body.appendChild(script);
      }
    });

    return this.loading;
  }
}
