import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-pm-console-agent-orb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        --agent-orb-scale: 0.55;
        --agent-orb-size: 96px;
        display: block;
        height: var(--agent-orb-size);
        position: relative;
        width: var(--agent-orb-size);
      }

      .agent-art {
        display: block;
        filter: brightness(1.2) contrast(0.88) saturate(1);
        height: 88px;
        left: 50%;
        overflow: hidden;
        pointer-events: none;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) scale(var(--agent-orb-scale));
        transform-origin: center;
        width: 88px;
      }

      .agent-art::before,
      .agent-art::after {
        border-radius: 999px;
        content: '';
        pointer-events: none;
        position: absolute;
      }

      .agent-art::before {
        background:
          radial-gradient(circle at 44% 42%, rgba(255, 255, 255, 0.52) 0 16%, rgba(251, 241, 255, 0.32) 30%, transparent 49%),
          radial-gradient(circle at 33% 56%, rgba(255, 129, 222, 0.28), transparent 50%),
          radial-gradient(circle at 66% 55%, rgba(111, 194, 255, 0.36), transparent 58%);
        inset: 22px 20px 19px;
        mix-blend-mode: screen;
        opacity: 0.72;
        z-index: 3;
      }

      .agent-art::after {
        border: 1px solid rgba(255, 255, 255, 0.38);
        box-shadow:
          inset 0 0 12px rgba(255, 255, 255, 0.32),
          0 0 18px rgba(247, 154, 226, 0.24),
          0 0 20px rgba(112, 182, 255, 0.22);
        inset: 23px 21px 20px;
        mix-blend-mode: screen;
        opacity: 0.62;
        z-index: 4;
      }

      .agent-core {
        height: 54px;
        left: 50%;
        position: absolute;
        top: calc(50% + 6px);
        transform: translate(-50%, -50%);
        width: 46px;
        z-index: 1;
      }

      .agent-layer,
      .agent-layer > span,
      .agent-layer img,
      .agent-gif,
      .agent-gif-crop,
      .agent-gif img {
        display: block;
        position: absolute;
      }

      .agent-layer img,
      .agent-gif img {
        max-width: none;
        pointer-events: none;
      }

      .agent-mask {
        mask-clip: no-clip;
        mask-image: url('../../../assets/dotz-agent-light/ellipse-10-mask.png');
        mask-mode: alpha;
        mask-repeat: no-repeat;
        mask-size: 282.775px 286.918px;
        -webkit-mask-clip: no-clip;
        -webkit-mask-image: url('../../../assets/dotz-agent-light/ellipse-10-mask.png');
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 282.775px 286.918px;
      }

      .agent-glow-base {
        bottom: 17.81%;
        left: 6.31%;
        right: 6.31%;
        top: 7.53%;
      }

      .agent-glow-base > span {
        inset: -71.84% -72.06%;
      }

      .agent-glow-base img,
      .agent-top-light img,
      .agent-bottom-light img,
      .agent-sheen img,
      .agent-pin-light img,
      .agent-rim img,
      .agent-rim-inner img,
      .agent-rim-overlay img {
        height: 100%;
        width: 100%;
      }

      .agent-top-light {
        bottom: 62.81%;
        left: 13.95%;
        mix-blend-mode: overlay;
        right: 13.95%;
        top: 7.38%;
      }

      .agent-top-light > span {
        height: 100%;
        transform: scaleX(-1);
        width: 100%;
      }

      .agent-top-light .agent-mask {
        inset: 0;
        mask-position: -25.867px -1.066px;
        -webkit-mask-position: -25.867px -1.066px;
      }

      .agent-top-light img {
        height: 270.54%;
        left: -41.39%;
        top: -85.27%;
        width: 182.78%;
      }

      .agent-energy {
        bottom: 46.38%;
        left: 20.38%;
        mask-position: -46.42px -10.277px;
        mix-blend-mode: color-dodge;
        right: 20.27%;
        top: 9.84%;
        -webkit-mask-position: -46.42px -10.277px;
      }

      .agent-energy img,
      .agent-energy-hard img,
      .agent-sheen img,
      .agent-pin-light img,
      .agent-spark-overlay img {
        inset: 0;
      }

      .agent-energy-hard-wrap {
        bottom: 46.38%;
        left: 20.38%;
        mix-blend-mode: hard-light;
        right: 20.27%;
        top: 9.84%;
      }

      .agent-energy-hard-wrap > span {
        height: 100%;
        transform: scaleX(-1);
        width: 100%;
      }

      .agent-energy-hard {
        inset: 0;
        mask-position: -46.42px -10.277px;
        -webkit-mask-position: -46.42px -10.277px;
      }

      .agent-bottom-light {
        bottom: 13.41%;
        left: 20.49%;
        mix-blend-mode: overlay;
        right: 20.49%;
        top: 62.17%;
      }

      .agent-bottom-light > span {
        height: 100%;
        transform: rotate(180deg) scaleX(-1);
        width: 100%;
      }

      .agent-bottom-light .agent-mask {
        inset: 0;
        mask-position: -46.774px -206.237px;
        -webkit-mask-position: -46.774px -206.237px;
      }

      .agent-bottom-light img {
        height: 365.54%;
        left: -64.47%;
        top: -132.77%;
        width: 228.94%;
      }

      .agent-saturation {
        bottom: 72.27%;
        left: 21.48%;
        mask-position: -49.963px 6.023px;
        mix-blend-mode: saturation;
        right: 21.37%;
        top: 5.49%;
        -webkit-mask-position: -49.963px 6.023px;
      }

      .agent-saturation > span {
        inset: -36.7% -16.77%;
      }

      .agent-pin-light {
        bottom: 83.82%;
        left: 37.76%;
        mask-position: -102.054px -6.027px;
        right: 37.76%;
        top: 8.71%;
        -webkit-mask-position: -102.054px -6.027px;
      }

      .agent-pin-light > span {
        inset: -180.93% -64.88%;
      }

      .agent-sheen,
      .agent-spark,
      .agent-spark-overlay {
        transform: rotate(-9deg);
      }

      .agent-sheen {
        bottom: 23.48%;
        left: 30.89%;
        mask-position: -80.045px -72.692px;
        mix-blend-mode: screen;
        right: 10.59%;
        top: 26.51%;
        -webkit-mask-position: -80.045px -72.692px;
      }

      .agent-spark {
        bottom: 38.4%;
        left: 11.47%;
        mask-position: -17.933px -16.833px;
        mix-blend-mode: screen;
        right: 30%;
        top: 11.59%;
        -webkit-mask-position: -17.933px -16.833px;
      }

      .agent-spark img {
        inset: 0;
        height: 100%;
        width: 100%;
      }

      .agent-spark-overlay {
        bottom: 37.9%;
        left: 35.05%;
        mask-position: -93.387px -83.59px;
        mix-blend-mode: overlay;
        right: 26.7%;
        top: 29.42%;
        -webkit-mask-position: -93.387px -83.59px;
      }

      .agent-rim {
        bottom: 17.2%;
        left: 5.76%;
        mask-position: 0.354px 0;
        right: 5.65%;
        top: 7.1%;
        -webkit-mask-position: 0.354px 0;
      }

      .agent-rim > span {
        inset: -16.33% -16.38%;
      }

      .agent-rim-inner {
        bottom: 18.14%;
        left: 6.31%;
        mask-position: -1.417px 0;
        right: 6.2%;
        top: 7.1%;
        -webkit-mask-position: -1.417px 0;
      }

      .agent-rim-inner > span {
        inset: -13.41% -13.46%;
      }

      .agent-rim-overlay {
        bottom: 17.96%;
        left: 5.98%;
        mask-position: -0.354px 1.414px;
        mix-blend-mode: overlay;
        right: 5.87%;
        top: 6.72%;
        -webkit-mask-position: -0.354px 1.414px;
      }

      .agent-rim-overlay > span {
        inset: -6.19% -6.21%;
      }

      .agent-gif {
        border-radius: 111px;
        height: 39px;
        left: calc(50% + 0.5px);
        mix-blend-mode: overlay;
        opacity: 0.75;
        overflow: hidden;
        top: calc(50% + 2.5px);
        transform: translate(-50%, -50%);
        width: 39px;
        z-index: 2;
      }

      .agent-gif img {
        height: 217.98%;
        left: -96.3%;
        top: -58.92%;
        width: 292.67%;
      }
    `,
  ],
  template: `
    <span class="agent-art" aria-hidden="true">
      <span class="agent-core">
        <span class="agent-layer agent-glow-base">
          <span><img src="./assets/dotz-agent-light/ellipse-2.png" alt="" /></span>
        </span>
        <span class="agent-layer agent-top-light">
          <span>
            <span class="agent-mask"><img src="./assets/dotz-agent-light/ellipse-11.png" alt="" /></span>
          </span>
        </span>
        <span class="agent-layer agent-mask agent-energy"><img src="./assets/dotz-agent-light/group-6.png" alt="" /></span>
        <span class="agent-layer agent-energy-hard-wrap">
          <span><span class="agent-mask agent-energy-hard"><img src="./assets/dotz-agent-light/group-7.png" alt="" /></span></span>
        </span>
        <span class="agent-layer agent-bottom-light">
          <span>
            <span class="agent-mask"><img src="./assets/dotz-agent-light/ellipse-12.png" alt="" /></span>
          </span>
        </span>
        <span class="agent-layer agent-mask agent-saturation">
          <span><img src="./assets/dotz-agent-light/ellipse-9.png" alt="" /></span>
        </span>
        <span class="agent-layer agent-mask agent-pin-light">
          <span><img src="./assets/dotz-agent-light/ellipse-4.png" alt="" /></span>
        </span>
        <span class="agent-layer agent-mask agent-sheen"><img src="./assets/dotz-agent-light/ellipse-116.png" alt="" /></span>
        <span class="agent-layer agent-mask agent-spark"><img src="./assets/dotz-agent-light/ellipse-114.png" alt="" /></span>
        <span class="agent-layer agent-mask agent-spark-overlay"><img src="./assets/dotz-agent-light/ellipse-115.png" alt="" /></span>
        <span class="agent-layer agent-mask agent-rim">
          <span><img src="./assets/dotz-agent-light/ellipse-110.png" alt="" /></span>
        </span>
        <span class="agent-layer agent-mask agent-rim-inner">
          <span><img src="./assets/dotz-agent-light/ellipse-109.png" alt="" /></span>
        </span>
        <span class="agent-layer agent-mask agent-rim-overlay">
          <span><img src="./assets/dotz-agent-light/ellipse-111.png" alt="" /></span>
        </span>
      </span>
      <span class="agent-gif">
        <img src="./assets/dotz-agent-light/ai-production.gif" alt="" />
      </span>
    </span>
  `,
})
export class PmConsoleAgentOrbComponent {
  @Input() size = 96;

  @HostBinding('style.--agent-orb-size.px')
  get orbSize(): number {
    return this.size;
  }

  @HostBinding('style.--agent-orb-scale')
  get orbScale(): string {
    return String(this.size / 88);
  }
}
