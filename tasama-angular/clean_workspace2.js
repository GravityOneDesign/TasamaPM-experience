const fs = require('fs');
let c = fs.readFileSync('src/app/pmo-governance-workspace.component.ts', 'utf8');

c = c.replace(/\} @else if \(activePrimaryTab === 'governance'\) \{[\s\S]*?(?=\} @else \{\s*<section class="pmo-register-placeholder")/, '');

c = c.replace(/@if \(selectedRecordDetail; as recordDetail\) \{[\s\S]*?\}[\s\S]*?@if \(reportDrawerOpen\) \{[\s\S]*?\}/, '');

// Remove imports for drawers
c = c.replace(/import \{ PmoGovernanceForumDrawerComponent \} from '\.\/pmo-governance-forum-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceRecordDetailDrawerComponent \} from '\.\/pmo-governance-record-detail-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceRecordDrawerComponent \} from '\.\/pmo-governance-record-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceReportDrawerComponent \} from '\.\/pmo-governance-report-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceSourceDrawerComponent \} from '\.\/pmo-governance-source-drawer\.component';/, '');

// Remove from imports array
c = c.replace(/PmoGovernanceForumDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceRecordDetailDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceRecordDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceReportDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceSourceDrawerComponent,\r?\n/, '');

fs.writeFileSync('src/app/pmo-governance-workspace.component.ts', c);
