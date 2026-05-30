const fs = require('fs');
let c = fs.readFileSync('src/app/pmo-governance-register.component.ts', 'utf8');

c = c.replace(/@Component\(\{[\s\S]*?template: `[\s\S]*?@else if \(activePrimaryTab === 'governance'\) \{/, `@Component({
  selector: 'app-pmo-governance-register',
  standalone: true,
  imports: [
    PmConsoleExpandableSearchComponent,
    PmConsoleIconComponent,
    PmoGovernanceForumDrawerComponent,
    PmoGovernanceRecordDetailDrawerComponent,
    PmoGovernanceRecordDrawerComponent,
    PmoGovernanceReportDrawerComponent,
    PmoGovernanceSourceDrawerComponent,
    PmConsoleRegisterTableComponent,
    PmConsoleRowActionMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="pmo-governance-register-container">`);

c = c.replace(/\} @else \{\s*<section class="pmo-register-placeholder"[\s\S]*?<\/section>\s*\}\s*<\/article>\s*<\/section>\s*<\/div>/, '</div>');
c = c.replace(/export class PmoGovernanceWorkspaceComponent/, 'export class PmoGovernanceRegisterComponent');
c = c.replace(/@Input\(\) target: PmoGovernanceWorkspaceTarget = pmoGovernanceDefaultWorkspaceTarget;/,'');
c = c.replace(/readonly primaryTabs = pmoGovernancePrimaryTabs;/,'');
c = c.replace(/activePrimaryTab: PmoGovernanceTabId = 'portfolio-register';/,'');
c = c.replace(/get activePrimaryTabLabel\(\)[\s\S]*?\n  }/,'');
c = c.replace(/setPrimaryTab\(tabId: string\)[\s\S]*?\n  }/,'');
c = c.replace(/if \(!isPmoGovernanceTabId\(this\.target\.primaryTab\)\) return;[\s\S]*?this\.setPrimaryTab\(this\.target\.primaryTab\);/,'');
c = c.replace(/import \{ PortfolioWorkspaceRegistersComponent \} from '\.\/portfolio-workspace\/portfolio-workspace-registers\.component';\r?\n/,'');
c = c.replace(/import \{\s*pmoGovernanceDefaultWorkspaceTarget,\s*pmoGovernancePrimaryTabs,[\s\S]*?\} from '\.\/pmo-governance-workspace\.data';/, 
`import {
  pmoGovernanceForumDetailTabs,
  pmoGovernanceForumIssueEmptyState,
  pmoGovernanceForumRecordRows,
  pmoGovernanceForumSourceRows,
  pmoGovernanceForumRows,
  pmoGovernancePastMeetingRows,
  pmoGovernanceRecordDetailFor,
  pmoGovernanceRecordRows,
  pmoGovernanceReportTemplateRowFromDraft,
  pmoGovernanceReportTemplateRows,
  pmoGovernanceSectionTabs,
  pmoGovernanceSourceRows,
  pmoGovernanceWatchlistCategories,
  pmoGovernanceWatchlistRows,
  type PmoGovernanceForumDraft,
  type PmoGovernanceForumDetailTabId,
  type PmoGovernanceForumRow,
  type PmoGovernanceForumScope,
  type PmoGovernanceMeetingRow,
  type PmoGovernanceRecordDetail,
  type PmoGovernanceRecordDraft,
  type PmoGovernanceRecordRow,
  type PmoGovernanceRecordScope,
  type PmoGovernanceReportDraft,
  type PmoGovernanceReportTemplateRow,
  type PmoGovernanceSectionId,
  type PmoGovernanceSourceDraft,
  type PmoGovernanceSourceRow,
  type PmoGovernanceSourceScope,
  type PmoGovernanceWatchlistCategoryId,
  type PmoGovernanceWatchlistRow,
} from './pmo-governance-workspace.data';`);

fs.writeFileSync('src/app/pmo-governance-register.component.ts', c);
