const fs = require('fs');
let c = fs.readFileSync('src/app/pmo-governance-workspace.component.ts', 'utf8');

c = c.replace(/\} @else if \(activePrimaryTab === 'governance'\) \{[\s\S]*?\} @else \{/, '} @else {');
c = c.replace(/@if \(selectedRecordDetail; as recordDetail\) \{[\s\S]*?\}[\s\S]*?@if \(reportDrawerOpen\) \{[\s\S]*?\}/, '');
// Also remove imports for drawers
c = c.replace(/import \{ PmoGovernanceForumDrawerComponent \} from '\.\/pmo-governance-forum-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceRecordDetailDrawerComponent \} from '\.\/pmo-governance-record-detail-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceRecordDrawerComponent \} from '\.\/pmo-governance-record-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceReportDrawerComponent \} from '\.\/pmo-governance-report-drawer\.component';/, '');
c = c.replace(/import \{ PmoGovernanceSourceDrawerComponent \} from '\.\/pmo-governance-source-drawer\.component';/, '');

// Remove them from imports array
c = c.replace(/PmoGovernanceForumDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceRecordDetailDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceRecordDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceReportDrawerComponent,\r?\n/, '');
c = c.replace(/PmoGovernanceSourceDrawerComponent,\r?\n/, '');

// Now remove the governance tab from primary tabs in data file
let dataStr = fs.readFileSync('src/app/pmo-governance-workspace.data.ts', 'utf8');
dataStr = dataStr.replace(/\{ id: 'governance', label: 'Governance Register', icon: 'layout-grid' \},/, '');
dataStr = dataStr.replace(/'governance' \| /, '');
fs.writeFileSync('src/app/pmo-governance-workspace.data.ts', dataStr);

fs.writeFileSync('src/app/pmo-governance-workspace.component.ts', c);
