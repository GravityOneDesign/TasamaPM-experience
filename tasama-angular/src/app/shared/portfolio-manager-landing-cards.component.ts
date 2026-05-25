import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-manager-landing-cards',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .pm101-four-cards-strip {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        box-sizing: border-box;
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-bottom: 24px;
        padding: 20px;
        width: 100%;
      }

      .pm101-static-card {
        appearance: none;
        background: none;
        border: 1px solid transparent;
        border-radius: 10px;
        box-shadow:
          0 1px 1px rgba(1, 10, 15, 0.04),
          0 2px 4px rgba(1, 10, 15, 0.12);
        box-sizing: border-box;
        display: block;
        font-family: inherit;
        height: 160px;
        overflow: hidden;
        padding: 0;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .pm101-static-card.card-overview {
        background: #0b0b0b;
        color: #ffffff;
        cursor: pointer;
      }

      .pm101-static-card.card-active {
        background: #ffffff;
        border-color: #e2e8f0;
        color: #0b0b0b;
      }

      .pm101-project-card-art {
        height: 100%;
        inset: 0;
        object-fit: cover;
        position: absolute;
        width: 100%;
      }

      .pm101-static-card.card-active .pattern-bg {
        display: none;
      }

      .pm101-static-card-content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        padding: 16px;
        position: relative;
        z-index: 1;
      }

      .pm101-static-card strong {
        color: inherit;
        display: block;
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
      }

      .pm101-card-kicker,
      .pm101-stat-label,
      .health-label,
      .finance-label {
        color: #64748b;
        font-size: 12px;
      }

      .pm101-card-kicker {
        display: block;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.05em;
        margin-bottom: 2px;
        text-transform: uppercase;
      }

      .pm101-stats-row {
        display: flex;
        gap: 24px;
      }

      .pm101-stat-item {
        display: flex;
        flex-direction: column;
      }

      .pm101-stat-number {
        color: #10069f;
        font-size: 32px;
        font-weight: 700;
        line-height: 36px;
      }

      .pm101-card-header-row,
      .pm101-finance-item,
      .pm101-health-item {
        align-items: center;
        display: flex;
      }

      .pm101-card-header-row,
      .pm101-finance-item {
        justify-content: space-between;
      }

      .pm101-status-pill {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        padding: 4px 8px;
      }

      .pm101-status-pill.on-track {
        background: #e6f7ed;
        border: 1px solid rgba(30, 126, 52, 0.2);
        color: #1e7e34;
      }

      .pm101-health-list,
      .pm101-finance-list {
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: auto 0 0;
        padding: 0;
      }

      .pm101-health-list {
        gap: 4px;
      }

      .pm101-finance-list {
        gap: 8px;
      }

      .health-dot {
        border-radius: 50%;
        display: inline-block;
        height: 6px;
        margin-right: 8px;
        width: 6px;
      }

      .dot-green {
        background: #addc91;
      }

      .dot-amber {
        background: #ffb800;
      }

      .dot-red {
        background: #ff4d4f;
      }

      .health-count,
      .finance-value {
        color: #0b0b0b;
        font-weight: 600;
      }

      .health-count {
        margin-right: 4px;
      }

      .finance-value.font-highlight {
        color: #1e7e34;
      }

      .financial-title {
        margin-bottom: 8px;
      }

      @media (max-width: 1024px) {
        .pm101-four-cards-strip {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .pm101-four-cards-strip {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  template: `
    <div class="pm101-four-cards-strip">
      <!-- Card 1: Portfolio Overview -->
      <button
        class="pm101-static-card card-overview"
        type="button"
        (click)="onOverviewClick.emit()"
        aria-label="View Portfolio Name"
      >
        <img class="pm101-project-card-art" src="./assets/Card-visual-2.jpg" alt="" aria-hidden="true" />
        <div class="pm101-static-card-content">
          <strong>Portfolio Name</strong>
          <span class="pm101-project-cta">
            <span>Go to portfolio</span>
            <span class="pm101-project-cta-arrow" aria-hidden="true"></span>
          </span>
        </div>
      </button>

      <!-- Card 2: Your portfolio at a glance -->
      <div class="pm101-static-card card-active">
        <img class="pm101-project-card-art pattern-bg" src="./assets/pm101-active-card-bg.jpg" alt="" aria-hidden="true" />
        <div class="pm101-static-card-content">
          <div>
            <span class="pm101-card-kicker">OVERVIEW</span>
            <strong>Your portfolio at a glance</strong>
          </div>
          <div class="pm101-stats-row">
            <div class="pm101-stat-item">
              <span class="pm101-stat-number">10</span>
              <span class="pm101-stat-label">Programs</span>
            </div>
            <div class="pm101-stat-item">
              <span class="pm101-stat-number">10</span>
              <span class="pm101-stat-label">Projects</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Portfolio Health -->
      <div class="pm101-static-card card-active">
        <img class="pm101-project-card-art pattern-bg" src="./assets/pm101-active-card-bg.jpg" alt="" aria-hidden="true" />
        <div class="pm101-static-card-content">
          <div class="pm101-card-header-row">
            <strong>Portfolio Health</strong>
            <span class="pm101-status-pill on-track">On Track</span>
          </div>
          <ul class="pm101-health-list">
            <li class="pm101-health-item">
              <span class="health-dot dot-green"></span>
              <span class="health-count">72</span>
              <span class="health-label">On track</span>
            </li>
            <li class="pm101-health-item">
              <span class="health-dot dot-amber"></span>
              <span class="health-count">14</span>
              <span class="health-label">Delayed</span>
            </li>
            <li class="pm101-health-item">
              <span class="health-dot dot-red"></span>
              <span class="health-count">5</span>
              <span class="health-label">Critical</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 4: Financial overview -->
      <div class="pm101-static-card card-active">
        <img class="pm101-project-card-art pattern-bg" src="./assets/pm101-active-card-bg.jpg" alt="" aria-hidden="true" />
        <div class="pm101-static-card-content">
          <strong class="financial-title">Financial overview</strong>
          <ul class="pm101-finance-list">
            <li class="pm101-finance-item">
              <span class="finance-label">Total budget</span>
              <span class="finance-value">AED 112.9M</span>
            </li>
            <li class="pm101-finance-item">
              <span class="finance-label">Spent to date</span>
              <span class="finance-value font-highlight">AED 479.9K</span>
            </li>
            <li class="pm101-finance-item">
              <span class="finance-label">Non-financial resources</span>
              <span class="finance-value">63 tracked</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class PortfolioManagerLandingCardsComponent {
  @Output() readonly onOverviewClick = new EventEmitter<void>();
}
