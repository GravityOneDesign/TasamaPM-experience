const fs = require('fs');
let c = fs.readFileSync('src/app/pmo-report-review-progress.component.ts', 'utf8');

c = c.replace(/<section class="pmo-report-review-body" aria-label="Reports">/, `@if (activeTabId === 'governance') {
            <app-pmo-governance-register></app-pmo-governance-register>
          } @else {
          <section class="pmo-report-review-body" aria-label="Reports">`);

c = c.replace(/<\/section>\s*<\/section>\s*<\/div>\s*<\/main>/, `</section>
          }
        </section>
      </div>
    </main>`);

c = c.replace(/import \{ PmConsoleIconComponent \} from '\.\/shared\/pm-console-icon\.component';/, `import { PmConsoleIconComponent } from './shared/pm-console-icon.component';
import { PmoGovernanceRegisterComponent } from './pmo-governance-register.component';`);

c = c.replace(/imports: \[\s*PmConsoleIconComponent,\s*PmConsoleDateFieldComponent\s*\],/, `imports: [PmConsoleIconComponent, PmConsoleDateFieldComponent, PmoGovernanceRegisterComponent],`);

fs.writeFileSync('src/app/pmo-report-review-progress.component.ts', c);
