import { AfterViewInit, Component, OnDestroy } from '@angular/core';

declare global {
  interface Window {
    TasamaPmConsole?: {
      mount: () => (() => void) | void;
    };
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<main id="app" aria-label="Project Management Console"></main>'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private cleanup?: () => void;

  async ngAfterViewInit(): Promise<void> {
    await this.loadScript('assets/lucide.min.js');
    await this.loadScript('assets/pm-console.js');

    const cleanup = window.TasamaPmConsole?.mount();
    if (typeof cleanup === 'function') {
      this.cleanup = cleanup;
    }
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }

  private loadScript(src: string): Promise<void> {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-angular-loader="${src}"]`);
    if (existing?.dataset['loaded'] === 'true') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = existing ?? document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset['angularLoader'] = src;
      script.addEventListener('load', () => {
        script.dataset['loaded'] = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), { once: true });

      if (!existing) {
        document.body.appendChild(script);
      }
    });
  }
}
