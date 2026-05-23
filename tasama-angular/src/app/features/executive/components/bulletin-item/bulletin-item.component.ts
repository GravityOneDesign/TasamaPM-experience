import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ExecutiveBulletinItem } from '../../data/dashboard.data';

@Component({
  selector: 'app-executive-bulletin-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="executive-bulletin-icon" aria-hidden="true">
      <img class="executive-bulletin-glyph" src="assets/executive/chat-ai-line.svg" alt="" />
    </span>
    <span class="executive-bulletin-copy">
      <strong>{{ bulletin.title }}</strong>
      <span>{{ bulletin.body }}</span>
    </span>
  `,
  styles: [
    `
      :host {
        --executive-bulletin-bg-active: linear-gradient(
          90deg,
          rgba(8, 10, 84, 0.46) 0%,
          rgba(13, 34, 128, 0.34) 55%,
          rgba(18, 70, 193, 0.18) 100%
        );
        --executive-bulletin-bg-rest: linear-gradient(
          90deg,
          rgba(8, 10, 84, 0.4) 0%,
          rgba(13, 34, 128, 0.29) 55%,
          rgba(18, 70, 193, 0.14) 100%
        );
        align-items: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        background: var(--executive-bulletin-bg-rest);
        border-radius: 999px;
        box-shadow:
          inset 28px 0 46px rgba(5, 7, 60, 0.18),
          inset -22px 0 42px rgba(57, 134, 255, 0.08);
        color: #ffffff;
        display: flex;
        gap: 11px;
        height: 73px;
        isolation: isolate;
        overflow: hidden;
        padding: 8px 22px 8px 8px;
        position: relative;
        scale: 1;
        transform-origin: center;
        transition: scale var(--motion-fast, 160ms) var(--motion-ease, ease);
        width: 410px;
        will-change: scale;
        animation: executiveBulletinCardCycle 12s ease-in-out infinite;
        animation-delay: var(--executive-bulletin-delay);
      }

      :host(:hover) {
        scale: 1.035;
        z-index: 2;
      }

      .executive-bulletin-icon {
        align-items: center;
        backdrop-filter: blur(13px) saturate(120%);
        -webkit-backdrop-filter: blur(13px) saturate(120%);
        background:
          radial-gradient(circle at 27% 21%, rgba(210, 218, 255, 0.12), transparent 19%),
          radial-gradient(circle at 37% 31%, rgba(104, 120, 211, 0.3), transparent 34%),
          radial-gradient(circle at 70% 78%, rgba(56, 68, 163, 0.34), transparent 44%),
          linear-gradient(145deg, rgba(40, 47, 141, 0.82), rgba(22, 27, 108, 0.91) 48%, rgba(10, 14, 77, 0.97) 100%);
        border: 0;
        border-radius: 999px;
        box-shadow:
          inset 9px 9px 15px rgba(158, 171, 246, 0.12),
          inset -15px -17px 27px rgba(3, 7, 58, 0.5),
          inset 0 0 0 1px rgba(221, 229, 255, 0.11),
          0 12px 22px rgba(3, 8, 65, 0.28);
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 48px;
        height: 48px;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: 48px;
        z-index: 1;
      }

      .executive-bulletin-icon::before,
      .executive-bulletin-icon::after {
        border-radius: inherit;
        content: '';
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .executive-bulletin-icon::before {
        background:
          radial-gradient(circle at 30% 27%, rgba(230, 236, 255, 0.07), transparent 27%),
          radial-gradient(circle at 52% 84%, rgba(145, 158, 234, 0.06), transparent 32%);
        box-shadow:
          inset 8px 8px 13px rgba(175, 187, 255, 0.05),
          inset -11px -13px 18px rgba(5, 9, 68, 0.28);
        opacity: 0.68;
      }

      .executive-bulletin-icon::after {
        background: conic-gradient(
          from 188deg,
          rgba(229, 236, 255, 0.68) 0deg 122deg,
          transparent 135deg 218deg,
          rgba(211, 222, 255, 0.42) 238deg 332deg,
          transparent 344deg 360deg
        );
        inset: 1px;
        opacity: 0.9;
        padding: 1px;
        -webkit-mask:
          linear-gradient(rgba(1, 1, 1, 1) 0 0) content-box,
          linear-gradient(rgba(1, 1, 1, 1) 0 0);
        -webkit-mask-composite: xor;
        mask:
          linear-gradient(rgba(1, 1, 1, 1) 0 0) content-box,
          linear-gradient(rgba(1, 1, 1, 1) 0 0);
        mask-composite: exclude;
      }

      .executive-bulletin-glyph {
        display: block;
        filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.16));
        height: 20px;
        object-fit: contain;
        position: relative;
        width: 20px;
        z-index: 2;
      }

      .executive-bulletin-copy {
        display: grid;
        gap: 1px;
        min-width: 0;
      }

      .executive-bulletin-copy strong {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        white-space: nowrap;
      }

      .executive-bulletin-copy span {
        color: rgba(255, 255, 255, 0.62);
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @keyframes executiveBulletinCardCycle {
        0%,
        18% {
          background: var(--executive-bulletin-bg-active);
          filter: drop-shadow(0 10px 24px rgba(17, 35, 124, 0.12));
          opacity: 1;
          transform: translateX(0);
        }

        24%,
        100% {
          background: var(--executive-bulletin-bg-rest);
          filter: none;
          opacity: 0.94;
          transform: translateX(-2px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        :host {
          animation: none;
          transition: none;
        }

        :host(:hover) {
          scale: 1;
        }
      }
    `,
  ],
})
export class ExecutiveBulletinItemComponent {
  @Input({ required: true }) bulletin!: ExecutiveBulletinItem;
  @Input() carouselIndex = 0;

  @HostBinding('style.--executive-bulletin-delay')
  get carouselDelay(): string {
    return `${this.carouselIndex * 3}s`;
  }
}

