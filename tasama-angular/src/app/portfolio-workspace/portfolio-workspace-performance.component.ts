import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';
import { benefitsRegisterData } from './portfolio-workspace.data';

@Component({
  selector: 'app-portfolio-workspace-performance',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-performance-page">
      <!-- Header -->
      <div class="performance-header">
        <div class="perf-title-group">
          <h2>Portfolio Performance Dashboard</h2>
          <p>Real-time delivery assurance, cost control, and strategic benefits realization metrics.</p>
        </div>
        <div class="time-filter">
          <span class="filter-label">Reporting Cycle:</span>
          <select class="cycle-select">
            <option>May 2026 (Current)</option>
            <option>April 2026</option>
            <option>Q1 2026 Summary</option>
          </select>
        </div>
      </div>

      <!-- Main KPI Stats -->
      <div class="performance-stats-grid">
        <article class="perf-stat-card border-green">
          <div class="stat-icon-wrapper bg-green">
            <span [pmConsoleIcon]="'trending-up'"></span>
          </div>
          <div class="stat-details">
            <small>Schedule Performance Index (SPI)</small>
            <div class="value-row">
              <h3>1.04</h3>
              <span class="trend-pill trend-up">On Track</span>
            </div>
            <p class="stat-desc">EV ($8.53M) / PV ($8.20M) • Ahead of schedule</p>
          </div>
        </article>

        <article class="perf-stat-card border-green">
          <div class="stat-icon-wrapper bg-green">
            <span [pmConsoleIcon]="'banknote'"></span>
          </div>
          <div class="stat-details">
            <small>Cost Performance Index (CPI)</small>
            <div class="value-row">
              <h3>0.98</h3>
              <span class="trend-pill trend-stable">Within Buffer</span>
            </div>
            <p class="stat-desc">EV ($8.53M) / AC ($8.70M) • Minimal cost variance</p>
          </div>
        </article>

        <article class="perf-stat-card border-purple">
          <div class="stat-icon-wrapper bg-purple">
            <span [pmConsoleIcon]="'check-circle-2'"></span>
          </div>
          <div class="stat-details">
            <small>Milestone Hit Rate</small>
            <div class="value-row">
              <h3>94%</h3>
              <span class="trend-pill trend-up">+2% MoM</span>
            </div>
            <p class="stat-desc">17 of 18 baseline milestones achieved</p>
          </div>
        </article>

        <article class="perf-stat-card border-blue">
          <div class="stat-icon-wrapper bg-blue">
            <span [pmConsoleIcon]="'target'"></span>
          </div>
          <div class="stat-details">
            <small>Benefits Realization</small>
            <div class="value-row">
              <h3>78%</h3>
              <span class="trend-pill trend-up">On Track</span>
            </div>
            <p class="stat-desc">Target key metrics tracking successfully</p>
          </div>
        </article>
      </div>

      <!-- Two Column Layout: EVM Chart/Breakdown & Benefit Tracker -->
      <div class="performance-body-grid">
        <!-- EVM Section -->
        <section class="perf-panel evm-panel">
          <div class="panel-header">
            <span [pmConsoleIcon]="'calculator'" class="panel-icon icon-blue"></span>
            <h4>Earned Value Management (EVM) Analysis</h4>
          </div>
          <p class="panel-sub">Earned Value metrics monitor portfolio expenditure against actual delivery value.</p>

          <div class="evm-progress-stack">
            <div class="evm-progress-row">
              <div class="progress-labels">
                <span>Earned Value (EV) <small>Value of work completed</small></span>
                <strong>$8,528,000</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill fill-ev" style="width: 85.2%"></div>
              </div>
            </div>

            <div class="evm-progress-row">
              <div class="progress-labels">
                <span>Planned Value (PV) <small>Baseline scheduled value</small></span>
                <strong>$8,200,000</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill fill-pv" style="width: 82.0%"></div>
              </div>
            </div>

            <div class="evm-progress-row">
              <div class="progress-labels">
                <span>Actual Cost (AC) <small>Expenditure incurred</small></span>
                <strong>$8,702,040</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill fill-ac" style="width: 87.0%"></div>
              </div>
            </div>
          </div>

          <div class="evm-metrics-cards">
            <div class="evm-subcard">
              <span class="label">Schedule Variance (SV)</span>
              <strong class="val positive">+$328,000</strong>
            </div>
            <div class="evm-subcard">
              <span class="label">Cost Variance (CV)</span>
              <strong class="val negative">-$174,040</strong>
            </div>
            <div class="evm-subcard">
              <span class="label">Estimate at Completion (EAC)</span>
              <strong class="val">$18,874,000</strong>
            </div>
          </div>
        </section>

        <!-- Benefits Realization Section -->
        <section class="perf-panel benefits-panel">
          <div class="panel-header">
            <span [pmConsoleIcon]="'award'" class="panel-icon icon-purple"></span>
            <h4>Strategic Benefits Tracking</h4>
          </div>
          <p class="panel-sub">Performance against target benefits defined for the Safe Security portfolio.</p>

          <div class="benefits-tracker-list">
            @for (benefit of benefits; track benefit.id) {
              <div class="benefit-track-card">
                <div class="benefit-card-header">
                  <div class="benefit-info">
                    <h5>{{ benefit.benefit }}</h5>
                    <p class="metric-text">{{ benefit.metric }}</p>
                  </div>
                  <span [pmConsoleStatusPill]="benefit.status" baseClass="dependency-register-pill" [tone]="benefit.status === 'On-Track' ? 'emerald' : 'amber'"></span>
                </div>
                <div class="benefit-visual-row">
                  <div class="baseline-tag">
                    <small>Baseline</small>
                    <span>{{ benefit.baseline }}</span>
                  </div>
                  <div class="range-meter">
                    <div class="range-fill" [style.width]="benefit.id === 'b-1' ? '70%' : benefit.id === 'b-2' ? '88%' : '45%'"></div>
                  </div>
                  <div class="target-tag">
                    <small>Target</small>
                    <span>{{ benefit.target }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .workspace-performance-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 10px 0;
      animation: fadeIn 0.3s ease-out;
    }

    .performance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f2f4;
      padding-bottom: 16px;
    }

    .perf-title-group h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .perf-title-group p {
      font-size: 13.5px;
      color: #64748b;
      margin: 4px 0 0 0;
    }

    .time-filter {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-label {
      font-size: 13px;
      font-weight: 500;
      color: #64748b;
    }

    .cycle-select {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13.5px;
      color: #1e293b;
      font-weight: 600;
      cursor: pointer;
      outline: none;
    }

    .cycle-select:focus {
      border-color: var(--brand, #10069f);
    }

    .performance-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .perf-stat-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      display: flex;
      align-items: flex-start;
      gap: 14px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .perf-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    }

    .perf-stat-card.border-green { border-left: 4px solid #10b981; }
    .perf-stat-card.border-purple { border-left: 4px solid #8b5cf6; }
    .perf-stat-card.border-blue { border-left: 4px solid #3b82f6; }

    .stat-icon-wrapper {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .bg-green { background: #ecfdf5; color: #10b981; }
    .bg-purple { background: #f5f3ff; color: #8b5cf6; }
    .bg-blue { background: #eff6ff; color: #3b82f6; }

    .stat-details {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .stat-details small {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .value-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-top: 4px;
    }

    .value-row h3 {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .trend-pill {
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .trend-pill.trend-up { background: #d1fae5; color: #065f46; }
    .trend-pill.trend-stable { background: #e0f2fe; color: #075985; }

    .stat-desc {
      font-size: 11.5px;
      color: #64748b;
      margin: 4px 0 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .performance-body-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .perf-panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .panel-icon {
      font-size: 20px;
    }

    .icon-blue { color: #3b82f6; }
    .icon-purple { color: #8b5cf6; }

    .panel-header h4 {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .panel-sub {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 20px 0;
    }

    .evm-progress-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .evm-progress-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .progress-labels span {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }

    .progress-labels span small {
      font-weight: 400;
      color: #64748b;
      margin-left: 6px;
    }

    .progress-labels strong {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }

    .progress-bar-bg {
      height: 8px;
      background: #f1f5f9;
      border-radius: 99px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 99px;
    }

    .fill-ev { background: #10b981; }
    .fill-pv { background: #3b82f6; }
    .fill-ac { background: #ef4444; }

    .evm-metrics-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: auto;
    }

    .evm-subcard {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .evm-subcard .label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
    }

    .evm-subcard .val {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }

    .evm-subcard .val.positive { color: #10b981; }
    .evm-subcard .val.negative { color: #ef4444; }

    .benefits-tracker-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .benefit-track-card {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .benefit-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .benefit-info h5 {
      font-size: 13.5px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .benefit-info .metric-text {
      font-size: 11.5px;
      color: #64748b;
      margin: 2px 0 0 0;
    }

    .benefit-visual-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .baseline-tag, .target-tag {
      display: flex;
      flex-direction: column;
      min-width: 60px;
    }

    .baseline-tag { align-items: flex-start; }
    .target-tag { align-items: flex-end; }

    .baseline-tag small, .target-tag small {
      font-size: 9.5px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
    }

    .baseline-tag span, .target-tag span {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }

    .range-meter {
      flex-grow: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 99px;
      overflow: hidden;
      position: relative;
    }

    .range-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #3b82f6);
      border-radius: 99px;
    }

    /* Dense Table Status Pill Tones overrides */
    ::ng-deep .dependency-register-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PortfolioWorkspacePerformanceComponent implements OnInit {
  benefits = benefitsRegisterData;

  ngOnInit(): void {}
}
