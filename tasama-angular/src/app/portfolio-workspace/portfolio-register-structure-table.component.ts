import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmConsoleIconComponent } from '../shared/pm-console-icon.component';
import { PmConsoleRowActionMenuComponent } from '../shared/pm-console-row-action-menu.component';
import { PmConsoleStatusPillComponent } from '../shared/pm-console-status-pill.component';

export type PortfolioRegisterGroupLevel = 'portfolio' | 'program' | 'project' | 'standalone';
export type PortfolioRegisterCellKind = 'text' | 'primary' | 'person' | 'status' | 'actions';

export interface PortfolioRegisterStructureColumn {
  id: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  ariaLabel?: string;
}

export interface PortfolioRegisterCellAction {
  id: string;
  label: string;
  icon: string;
  tone?: string;
}

export interface PortfolioRegisterStructureCell {
  kind: PortfolioRegisterCellKind;
  text?: string;
  title?: string;
  subtitle?: string;
  tone?: string;
  initials?: string;
  actions?: PortfolioRegisterCellAction[];
}

export interface PortfolioRegisterStructureRow {
  kind: 'group' | 'row';
  id: string;
  label?: string;
  level?: PortfolioRegisterGroupLevel;
  countLabel?: string;
  metaLabel?: string;
  expanded?: boolean;
  depth?: 0 | 1 | 2;
  branchClass?: string;
  branchTerminal?: boolean;
  programBranchTerminal?: boolean;
  cells?: Record<string, PortfolioRegisterStructureCell>;
}

export interface PortfolioRegisterStructureActionEvent {
  row: PortfolioRegisterStructureRow;
  action: PortfolioRegisterCellAction;
}

@Component({
  selector: 'app-portfolio-register-structure-table',
  standalone: true,
  imports: [CommonModule, PmConsoleIconComponent, PmConsoleRowActionMenuComponent, PmConsoleStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #registerBranchMarker let-branchClass="branchClass">
      <span class="portfolio-register-branch-map {{ branchClass }}" aria-hidden="true">
        <span class="portfolio-register-branch-track portfolio"></span>
        <span class="portfolio-register-branch-track program"></span>
        <span class="portfolio-register-branch-track project"></span>
        <span class="portfolio-register-branch-elbow"></span>
        <span class="portfolio-register-branch-node"></span>
      </span>
    </ng-template>

    <ng-template #registerCellContent let-cell="cell" let-row="row">
      @if (cell) {
        @switch (cell.kind) {
          @case ('primary') {
            <span class="portfolio-register-primary">
              @if (cell.subtitle) {
                <small>{{ cell.subtitle }}</small>
              }
              <strong>{{ cell.title || cell.text }}</strong>
            </span>
          }
          @case ('person') {
            <span class="portfolio-register-person">
              <span class="portfolio-register-avatar" aria-hidden="true">{{ cell.initials || cell.text?.slice(0, 2) }}</span>
              <span>{{ cell.text || cell.title }}</span>
            </span>
          }
          @case ('status') {
            <span [pmConsoleStatusPill]="cell.text || cell.title || ''" baseClass="portfolio-register-status" [tone]="cell.tone || 'neutral'"></span>
          }
          @case ('actions') {
            <app-pm-console-row-action-menu [ariaLabel]="'Actions for ' + row.id">
              @for (action of cell.actions || []; track action.id) {
                <button
                  type="button"
                  role="menuitem"
                  class="{{ action.tone || '' }}"
                  (click)="emitAction(row, action, $event)"
                >
                  <span [pmConsoleIcon]="action.icon" aria-hidden="true"></span>
                  <span>{{ action.label }}</span>
                </button>
              }
            </app-pm-console-row-action-menu>
          }
          @default {
            <span class="portfolio-register-text">{{ cell.text || cell.title }}</span>
          }
        }
      }
    </ng-template>

    <div class="portfolio-register-table-scroll">
      <table
        class="portfolio-register-structure-table"
        [class.without-connectors]="!showHierarchyConnectors"
        [attr.aria-label]="ariaLabel"
      >
        <thead>
          <tr>
            @for (column of columns; track column.id) {
              <th
                [class]="columnClass(column)"
                [style.width]="column.width || null"
                [attr.aria-label]="column.ariaLabel || null"
              >
                {{ column.label }}
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.id) {
            @if (row.kind === 'group') {
              <tr
                class="portfolio-register-group-row {{ groupClass(row) }}"
                [class.is-register-open]="row.expanded !== false"
              >
                <td [attr.colspan]="columns.length">
                  <button
                    class="portfolio-register-group-toggle depth-{{ row.depth || 0 }}"
                    type="button"
                    [attr.aria-expanded]="row.expanded !== false"
                    (click)="groupToggle.emit(row.id)"
                  >
                    @if (showHierarchyConnectors) {
                      <ng-container *ngTemplateOutlet="registerBranchMarker; context: { branchClass: branchClass(row) }"></ng-container>
                    }
                    <span
                      class="portfolio-register-chevron"
                      [pmConsoleIcon]="row.expanded === false ? 'chevron-right' : 'chevron-down'"
                      aria-hidden="true"
                    ></span>
                    <strong>{{ row.label }}</strong>
                    @if (row.level) {
                      <span class="portfolio-register-level {{ row.level }}">{{ levelLabel(row.level) }}</span>
                    }
                    @if (row.countLabel) {
                      <span class="portfolio-register-count">{{ row.countLabel }}</span>
                    }
                    @if (row.metaLabel) {
                      <small>{{ row.metaLabel }}</small>
                    }
                  </button>
                </td>
              </tr>
            } @else {
              <tr
                class="portfolio-register-data-row depth-{{ row.depth || 0 }}"
                [class.is-branch-terminal]="row.branchTerminal"
                [class.is-program-branch-terminal]="row.programBranchTerminal"
              >
                @for (column of columns; track column.id; let isFirstColumn = $first) {
                  @let cell = cellFor(row, column.id);
                  <td [class]="cellClass(column, cell)">
                    @if (isFirstColumn) {
                      <div class="portfolio-register-cell-row">
                        @if (showHierarchyConnectors) {
                          <ng-container *ngTemplateOutlet="registerBranchMarker; context: { branchClass: branchClass(row) }"></ng-container>
                        }
                        <ng-container *ngTemplateOutlet="registerCellContent; context: { cell: cell, row: row }"></ng-container>
                      </div>
                    } @else {
                      <ng-container *ngTemplateOutlet="registerCellContent; context: { cell: cell, row: row }"></ng-container>
                    }
                  </td>
                }
              </tr>
            }
          } @empty {
            <tr>
              <td [attr.colspan]="columns.length">
                <div class="portfolio-register-empty">
                  <strong>{{ emptyTitle }}</strong>
                  @if (emptyBody) {
                    <span>{{ emptyBody }}</span>
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 0;
      min-width: 0;
    }

    .portfolio-register-table-scroll {
      background: #ffffff;
      border: 1px solid #e2e7f0;
      border-radius: 14px;
      height: 100%;
      min-height: 0;
      overflow: auto;
    }

    .portfolio-register-structure-table {
      border-collapse: separate;
      border-spacing: 0;
      min-width: 1040px;
      table-layout: fixed;
      width: 100%;
    }

    .portfolio-register-structure-table th {
      background: #f2f4f8;
      border-bottom: 1px solid #dfe4ed;
      color: #343b49;
      font-size: 11px;
      font-weight: 500;
      height: 55px;
      line-height: 15px;
      padding: 0 10px;
      position: sticky;
      text-align: left;
      top: 0;
      white-space: normal;
      z-index: 3;
    }

    .portfolio-register-structure-table th:first-child {
      padding-left: 78px;
    }

    .portfolio-register-structure-table.without-connectors th:first-child {
      padding-left: 10px;
    }

    .portfolio-register-structure-table th.align-center,
    .portfolio-register-structure-table td.align-center {
      text-align: center;
    }

    .portfolio-register-structure-table th.align-right,
    .portfolio-register-structure-table td.align-right {
      text-align: right;
    }

    .portfolio-register-structure-table td {
      border-bottom: 1px solid #edf0f5;
      color: #343b49;
      font-size: 11px;
      line-height: 15px;
      padding: 12px 10px;
      vertical-align: middle;
    }

    .portfolio-register-data-row {
      background: #ffffff;
    }

    .portfolio-register-data-row:hover {
      background: #fbfcff;
    }

    .portfolio-register-group-row td {
      border-bottom: 1px solid #dfe4ef;
      padding: 0;
    }

    .portfolio-register-group-row.portfolio td {
      background: #f3f3fa;
      border-top: 1px solid #e6e8f6;
    }

    .portfolio-register-group-row.program td {
      background: #f8fbff;
    }

    .portfolio-register-group-row.project td,
    .portfolio-register-group-row.standalone td {
      background: #fafbfc;
    }

    .portfolio-register-group-toggle {
      align-items: center;
      background: transparent;
      border: 0;
      color: #343b49;
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 8px;
      min-height: 58px;
      padding: 0 16px 0 10px;
      text-align: left;
      width: 100%;
    }

    .portfolio-register-group-toggle:hover,
    .portfolio-register-group-toggle:focus-visible {
      background: rgba(16, 6, 159, 0.035);
      outline: 0;
    }

    .portfolio-register-structure-table.without-connectors .portfolio-register-group-toggle.depth-1 {
      padding-left: 34px;
    }

    .portfolio-register-structure-table.without-connectors .portfolio-register-group-toggle.depth-2 {
      padding-left: 58px;
    }

    .portfolio-register-structure-table.without-connectors .portfolio-register-data-row.depth-1 td:first-child {
      padding-left: 34px;
    }

    .portfolio-register-structure-table.without-connectors .portfolio-register-data-row.depth-2 td:first-child {
      padding-left: 58px;
    }

    .portfolio-register-chevron.icon {
      color: #6c7484;
      height: 16px;
      width: 16px;
    }

    .portfolio-register-group-toggle strong {
      color: #2d3544;
      font-size: 12px;
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .portfolio-register-group-toggle small {
      color: #7a8494;
      font-size: 10.5px;
      margin-left: auto;
      white-space: nowrap;
    }

    .portfolio-register-level,
    .portfolio-register-count {
      align-items: center;
      border-radius: 999px;
      display: inline-flex;
      flex: 0 0 auto;
      font-size: 10px;
      font-weight: 500;
      height: 22px;
      justify-content: center;
      line-height: 12px;
      padding: 0 8px;
      white-space: nowrap;
    }

    .portfolio-register-level.portfolio {
      background: rgba(16, 6, 159, 0.06);
      border: 0.5px solid rgba(16, 6, 159, 0.15);
      color: #10069f;
    }

    .portfolio-register-level.program {
      background: rgba(0, 122, 255, 0.08);
      border: 0.5px solid rgba(0, 122, 255, 0.16);
      color: #0067d8;
    }

    .portfolio-register-level.project,
    .portfolio-register-level.standalone {
      background: rgba(74, 85, 104, 0.07);
      border: 0.5px solid rgba(74, 85, 104, 0.14);
      color: #4a5568;
    }

    .portfolio-register-count {
      background: #ffffff;
      border: 1px solid #e1e5ef;
      color: #606a7b;
    }

    .portfolio-register-cell-row {
      align-items: center;
      display: flex;
      min-height: 58px;
      min-width: 0;
    }

    .portfolio-register-cell-row .portfolio-register-branch-map {
      margin: -12px 0;
      min-height: calc(100% + 24px);
    }

    .portfolio-register-branch-map {
      --node-color: #dedef1;
      --node-size: 10px;
      --node-x: 10px;
      --portfolio-track-color: #dedef1;
      --program-track-color: rgba(16, 6, 159, 0.35);
      --project-track-color: #7773c8;
      --standalone-track-color: #aba8dd;
      --elbow-color: #dedef1;
      --elbow-left: 10px;
      --elbow-width: 0px;
      align-self: stretch;
      display: inline-flex;
      flex: 0 0 58px;
      min-height: inherit;
      position: relative;
    }

    .portfolio-register-branch-track,
    .portfolio-register-branch-elbow,
    .portfolio-register-branch-node {
      position: absolute;
    }

    .portfolio-register-branch-track,
    .portfolio-register-branch-elbow {
      display: none;
      pointer-events: none;
    }

    .portfolio-register-branch-track {
      border-radius: 999px;
      bottom: 0;
      top: 0;
      width: 1px;
    }

    .portfolio-register-branch-track.portfolio {
      background: var(--portfolio-track-color);
      left: 9.5px;
    }

    .portfolio-register-branch-track.program {
      background: var(--program-track-color);
      left: 24.5px;
    }

    .portfolio-register-branch-track.project {
      background: var(--project-track-color);
      left: 40.5px;
    }

    .portfolio-register-branch-elbow {
      background: var(--elbow-color);
      border-radius: 999px;
      height: 1px;
      left: var(--elbow-left);
      top: calc(50% - 0.5px);
      width: var(--elbow-width);
    }

    .portfolio-register-branch-node {
      background: var(--node-color);
      border-radius: 999px;
      height: var(--node-size);
      left: var(--node-x);
      top: 50%;
      transform: translate(-50%, -50%);
      width: var(--node-size);
      z-index: 1;
    }

    .portfolio-register-branch-map.portfolio-record-node,
    .portfolio-register-branch-map.program-record-node,
    .portfolio-register-branch-map.project-record-node,
    .portfolio-register-branch-map.standalone-record-node {
      --node-size: 8px;
    }

    .portfolio-register-branch-map.portfolio-record-node .portfolio-register-branch-node,
    .portfolio-register-branch-map.program-record-node .portfolio-register-branch-node,
    .portfolio-register-branch-map.project-record-node .portfolio-register-branch-node,
    .portfolio-register-branch-map.standalone-record-node .portfolio-register-branch-node {
      background: #ffffff;
      border: 1.5px solid var(--node-color);
    }

    .portfolio-register-branch-map.portfolio-node,
    .portfolio-register-branch-map.portfolio-record-node {
      --node-color: #dedef1;
      --node-x: 10px;
    }

    .portfolio-register-branch-map.program-node,
    .portfolio-register-branch-map.program-record-node {
      --elbow-color: #a0a1dd;
      --elbow-left: 10px;
      --elbow-width: 16px;
      --node-color: #aba8dd;
      --node-x: 25px;
    }

    .portfolio-register-branch-map.project-node,
    .portfolio-register-branch-map.project-record-node {
      --elbow-color: #7773c8;
      --elbow-left: 25px;
      --elbow-width: 16px;
      --node-color: #7773c8;
      --node-x: 41px;
    }

    .portfolio-register-branch-map.standalone-node {
      --elbow-color: var(--standalone-track-color);
      --elbow-left: 10px;
      --elbow-width: 16px;
      --node-color: var(--standalone-track-color);
      --node-x: 25px;
      --program-track-color: var(--standalone-track-color);
    }

    .portfolio-register-branch-map.standalone-project-node,
    .portfolio-register-branch-map.standalone-record-node {
      --elbow-color: var(--standalone-track-color);
      --elbow-left: 25px;
      --elbow-width: 16px;
      --node-color: var(--standalone-track-color);
      --node-x: 41px;
      --program-track-color: var(--standalone-track-color);
      --project-track-color: var(--standalone-track-color);
    }

    .portfolio-register-branch-map.program-root-node,
    .portfolio-register-branch-map.program-root-record-node {
      --node-color: #aba8dd;
      --node-x: 10px;
      --portfolio-track-color: #aba8dd;
    }

    .portfolio-register-branch-map.root-project-node,
    .portfolio-register-branch-map.root-project-record-node {
      --elbow-color: #7773c8;
      --elbow-left: 10px;
      --elbow-width: 16px;
      --node-color: #7773c8;
      --node-x: 25px;
      --portfolio-track-color: #aba8dd;
      --program-track-color: #7773c8;
    }

    .portfolio-register-branch-map.standalone-root-node {
      --node-color: var(--standalone-track-color);
      --node-x: 10px;
      --portfolio-track-color: var(--standalone-track-color);
    }

    .portfolio-register-branch-map.root-standalone-project-node,
    .portfolio-register-branch-map.root-standalone-record-node {
      --elbow-color: var(--standalone-track-color);
      --elbow-left: 10px;
      --elbow-width: 16px;
      --node-color: var(--standalone-track-color);
      --node-x: 25px;
      --portfolio-track-color: var(--standalone-track-color);
      --program-track-color: var(--standalone-track-color);
    }

    .portfolio-register-branch-map.portfolio-node {
      flex-basis: 20px;
    }

    .portfolio-register-branch-map.program-record-node {
      flex-basis: 88px;
    }

    .portfolio-register-branch-map.program-node,
    .portfolio-register-branch-map.standalone-node {
      flex-basis: 58px;
    }

    .portfolio-register-branch-map.project-node,
    .portfolio-register-branch-map.standalone-project-node {
      flex-basis: 80px;
    }

    .portfolio-register-branch-map.project-record-node,
    .portfolio-register-branch-map.standalone-record-node {
      flex-basis: 113px;
    }

    .portfolio-register-branch-map.program-root-node,
    .portfolio-register-branch-map.program-root-record-node,
    .portfolio-register-branch-map.standalone-root-node {
      flex-basis: 58px;
    }

    .portfolio-register-branch-map.root-project-node,
    .portfolio-register-branch-map.root-project-record-node,
    .portfolio-register-branch-map.root-standalone-project-node,
    .portfolio-register-branch-map.root-standalone-record-node {
      flex-basis: 88px;
    }

    .portfolio-register-branch-map.portfolio-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.portfolio-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.program-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.program-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.program-record-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.project-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.project-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.project-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.project-record-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.project-record-node .portfolio-register-branch-track.project,
    .portfolio-register-branch-map.standalone-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.standalone-project-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.standalone-project-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.standalone-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.standalone-record-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.standalone-record-node .portfolio-register-branch-track.project,
    .portfolio-register-branch-map.program-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.program-record-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.project-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.project-record-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.standalone-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.standalone-project-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.standalone-record-node .portfolio-register-branch-elbow {
      display: block;
    }

    .portfolio-register-branch-map.program-root-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.program-root-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.standalone-root-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.root-project-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.root-project-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.root-project-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.root-project-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.root-project-record-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.root-project-record-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.root-standalone-project-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.root-standalone-project-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.root-standalone-project-node .portfolio-register-branch-elbow,
    .portfolio-register-branch-map.root-standalone-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.root-standalone-record-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.root-standalone-record-node .portfolio-register-branch-elbow {
      display: block;
    }

    .portfolio-register-branch-map.program-root-record-node,
    .portfolio-register-branch-map.root-project-record-node,
    .portfolio-register-branch-map.root-standalone-record-node {
      --node-size: 8px;
    }

    .portfolio-register-branch-map.program-root-record-node .portfolio-register-branch-node,
    .portfolio-register-branch-map.root-project-record-node .portfolio-register-branch-node,
    .portfolio-register-branch-map.root-standalone-record-node .portfolio-register-branch-node {
      background: #ffffff;
      border: 1.5px solid var(--node-color);
    }

    .portfolio-register-branch-map.portfolio-node .portfolio-register-branch-track.portfolio {
      top: 50%;
    }

    .portfolio-register-branch-map.program-root-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.standalone-root-node .portfolio-register-branch-track.portfolio {
      bottom: 50%;
      top: 50%;
    }

    .portfolio-register-branch-map.program-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.project-node .portfolio-register-branch-track.project,
    .portfolio-register-branch-map.standalone-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.standalone-project-node .portfolio-register-branch-track.project,
    .portfolio-register-branch-map.root-project-node .portfolio-register-branch-track.program,
    .portfolio-register-branch-map.root-standalone-project-node .portfolio-register-branch-track.program {
      bottom: 50%;
      top: 50%;
    }

    .portfolio-register-branch-map.branch-start-node.program-node .portfolio-register-branch-track.program {
      bottom: 0;
      display: block;
      top: 50%;
    }

    .portfolio-register-branch-map.branch-start-node.program-root-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.branch-start-node.standalone-root-node .portfolio-register-branch-track.portfolio {
      bottom: 0;
      display: block;
      top: 50%;
    }

    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.program-node .portfolio-register-branch-track.program,
    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.project-node .portfolio-register-branch-track.project,
    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.standalone-node .portfolio-register-branch-track.program,
    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.standalone-project-node .portfolio-register-branch-track.project,
    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.root-project-node .portfolio-register-branch-track.program,
    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.root-standalone-project-node .portfolio-register-branch-track.program {
      bottom: 0;
      display: block;
      top: 50%;
    }

    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.program-root-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-group-row.is-register-open .portfolio-register-branch-map.standalone-root-node .portfolio-register-branch-track.portfolio {
      bottom: 0;
      display: block;
      top: 50%;
    }

    .portfolio-register-branch-map.project-terminal-node .portfolio-register-branch-track.program {
      bottom: 50%;
    }

    .portfolio-register-branch-map.project-terminal-node.root-project-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-branch-map.project-terminal-node.root-standalone-project-node .portfolio-register-branch-track.portfolio {
      bottom: 50%;
    }

    .portfolio-register-data-row.is-branch-terminal .portfolio-register-branch-map.project-record-node .portfolio-register-branch-track.project,
    .portfolio-register-data-row.is-branch-terminal .portfolio-register-branch-map.standalone-record-node .portfolio-register-branch-track.project,
    .portfolio-register-data-row.is-branch-terminal .portfolio-register-branch-map.root-project-record-node .portfolio-register-branch-track.program,
    .portfolio-register-data-row.is-branch-terminal .portfolio-register-branch-map.root-standalone-record-node .portfolio-register-branch-track.program {
      bottom: 50%;
    }

    .portfolio-register-data-row.is-program-branch-terminal .portfolio-register-branch-map.project-record-node .portfolio-register-branch-track.program,
    .portfolio-register-data-row.is-program-branch-terminal .portfolio-register-branch-map.standalone-record-node .portfolio-register-branch-track.program,
    .portfolio-register-data-row.is-program-branch-terminal .portfolio-register-branch-map.root-project-record-node .portfolio-register-branch-track.portfolio,
    .portfolio-register-data-row.is-program-branch-terminal .portfolio-register-branch-map.root-standalone-record-node .portfolio-register-branch-track.portfolio {
      bottom: 50%;
    }

    .portfolio-register-primary {
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    .portfolio-register-primary small {
      color: #718096;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .portfolio-register-primary strong,
    .portfolio-register-text {
      color: #343b49;
      display: block;
      font-size: 11px;
      font-weight: 500;
      line-height: 15px;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .portfolio-register-primary strong {
      color: #252a34;
      font-weight: 600;
      white-space: normal;
    }

    .portfolio-register-text {
      white-space: normal;
    }

    .nowrap .portfolio-register-text {
      white-space: nowrap;
    }

    .portfolio-register-person {
      align-items: center;
      display: inline-flex;
      gap: 8px;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
    }

    .portfolio-register-person > span:last-child {
      display: block;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .portfolio-register-avatar {
      align-items: center;
      background: rgba(16, 6, 159, 0.08);
      border: 1px solid rgba(16, 6, 159, 0.14);
      border-radius: 999px;
      color: #10069f;
      display: inline-flex;
      flex: 0 0 24px;
      font-size: 9px;
      font-weight: 700;
      height: 24px;
      justify-content: center;
      width: 24px;
    }

    .portfolio-register-status {
      font-size: 10px;
      min-width: 74px;
      text-transform: capitalize;
    }

    .portfolio-register-status.green {
      background: #e8f7ee;
      border-color: rgba(22, 161, 95, 0.2);
      color: #16a15f;
    }

    .portfolio-register-status.amber {
      background: #fff5e6;
      border-color: rgba(217, 119, 6, 0.2);
      color: #d97706;
    }

    .portfolio-register-status.red {
      background: #fff0f0;
      border-color: rgba(222, 53, 11, 0.2);
      color: #de350b;
    }

    .portfolio-register-status.blue {
      background: #eef6ff;
      border-color: rgba(37, 99, 235, 0.18);
      color: #2563eb;
    }

    .portfolio-register-status.neutral {
      background: #f8fafc;
      border-color: rgba(100, 116, 139, 0.2);
      color: #64748b;
    }

    .portfolio-register-empty {
      align-items: center;
      display: grid;
      gap: 6px;
      justify-items: center;
      min-height: 220px;
      text-align: center;
    }

    .portfolio-register-empty strong {
      color: #202633;
      font-size: 14px;
      font-weight: 600;
    }

    .portfolio-register-empty span {
      color: #687182;
      font-size: 12px;
    }

    @media (max-width: 960px) {
      .portfolio-register-structure-table {
        min-width: 920px;
      }
    }
  `]
})
export class PortfolioRegisterStructureTableComponent {
  @Input() columns: PortfolioRegisterStructureColumn[] = [];
  @Input() rows: PortfolioRegisterStructureRow[] = [];
  @Input() ariaLabel = 'Portfolio register table';
  @Input() emptyTitle = 'No records match this view';
  @Input() emptyBody = '';
  @Input() showHierarchyConnectors = true;

  @Output() readonly groupToggle = new EventEmitter<string>();
  @Output() readonly rowAction = new EventEmitter<PortfolioRegisterStructureActionEvent>();

  columnClass(column: PortfolioRegisterStructureColumn): string {
    return [column.className || '', column.align ? `align-${column.align}` : ''].filter(Boolean).join(' ');
  }

  cellClass(column: PortfolioRegisterStructureColumn, cell: PortfolioRegisterStructureCell | null): string {
    return [
      column.className || '',
      column.align ? `align-${column.align}` : '',
      cell?.kind === 'actions' ? 'portfolio-register-actions-cell' : '',
    ].filter(Boolean).join(' ');
  }

  groupClass(row: PortfolioRegisterStructureRow): string {
    return row.level || 'program';
  }

  branchClass(row: PortfolioRegisterStructureRow): string {
    if (row.branchClass) return row.branchClass;
    if (row.kind === 'group') {
      if (row.level === 'portfolio') return 'portfolio-node';
      if (row.level === 'standalone') return 'standalone-node';
      if (row.level === 'project') return 'project-node';
      return 'program-node';
    }
    if (row.depth === 0) return 'portfolio-record-node';
    if (row.depth === 1) return 'program-record-node';
    return 'project-record-node';
  }

  cellFor(row: PortfolioRegisterStructureRow, columnId: string): PortfolioRegisterStructureCell | null {
    return row.cells?.[columnId] || null;
  }

  levelLabel(level: PortfolioRegisterGroupLevel): string {
    if (level === 'portfolio') return 'Portfolio';
    if (level === 'program') return 'Program';
    if (level === 'standalone') return 'Standalone';
    return 'Project';
  }

  emitAction(row: PortfolioRegisterStructureRow, action: PortfolioRegisterCellAction, event: Event): void {
    event.stopPropagation();
    this.rowAction.emit({ row, action });
  }
}
