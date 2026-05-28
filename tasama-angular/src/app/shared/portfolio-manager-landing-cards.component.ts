import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-manager-landing-cards',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pm101-four-cards-strip">
      <!-- Card 1: Portfolio Overview -->
      <button 
        class="pm101-static-card card-overview" 
        type="button" 
        (click)="onOverviewClick.emit()"
        aria-label="View Portfolio Name"
      >
        <img class="pm101-project-card-art" src="./assets/Portfolio manager card.png" alt="" aria-hidden="true" />
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
          <strong style="margin-bottom: 8px;">Financial overview</strong>
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
