export interface StageDefinition {
  id: string;
  label: string;
  gate: string;
}

export interface StageProfile {
  project: string;
  currentStage: number;
  tone: 'green' | 'amber' | 'blue';
  gateDue: string;
  gateDone: number;
  gateTotal: number;
  checkpoint: string;
  checklist: string[];
}

export type StageGateStatus = 'complete' | 'submitted' | 'current' | 'upcoming' | 'revoked';

export interface StageGateContext {
  profile: StageProfile;
  stage: StageDefinition;
  stageIndex: number;
  status: StageGateStatus;
  checkedCount: number;
}

export const stageDefinitions: StageDefinition[] = [
  { id: 'initiation', label: 'Initiation', gate: 'Initiation gate' },
  { id: 'planning', label: 'Planning', gate: 'Planning gate' },
  { id: 'execution', label: 'Execution', gate: 'Execution gate' },
  { id: 'closure', label: 'Closure', gate: 'Closure gate' },
];

export const projectPlanStageDateWindows: Record<string, { start: string; end: string }> = {
  initiation: { start: '01/05/2026', end: '07/05/2026' },
  planning: { start: '08/05/2026', end: '12/06/2026' },
  execution: { start: '15/06/2026', end: '30/11/2026' },
  closure: { start: '01/12/2026', end: '31/12/2026' },
};

export const stageProfiles: StageProfile[] = [
  {
    project: 'Vision 2030',
    currentStage: 2,
    tone: 'green',
    gateDue: 'Jun 12',
    gateDone: 3,
    gateTotal: 5,
    checkpoint: 'Benefits baseline and status report evidence',
    checklist: ['Scope narrative updated', 'RAID log reviewed', 'Benefits baseline attached', 'Sponsor sign-off drafted', 'Next-stage owners assigned'],
  },
  {
    project: 'UAE Research Map',
    currentStage: 0,
    tone: 'amber',
    gateDue: 'Jun 12',
    gateDone: 2,
    gateTotal: 5,
    checkpoint: 'Project identity, stakeholder scope, and initiation evidence',
    checklist: ['Project identity confirmed', 'Stakeholder scope drafted', 'Initial RAID log created', 'Sponsor route identified', 'Planning owners assigned'],
  },
  {
    project: 'NEOM Integration',
    currentStage: 1,
    tone: 'amber',
    gateDue: 'May 24',
    gateDone: 2,
    gateTotal: 5,
    checkpoint: 'Budget response and dependency reset',
    checklist: ['Commercial risk response added', 'Dependency owner confirmed', 'Integration plan refreshed', 'Finance approval requested', 'Steering note prepared'],
  },
  {
    project: 'Smart City Alpha',
    currentStage: 2,
    tone: 'blue',
    gateDue: 'May 29',
    gateDone: 4,
    gateTotal: 5,
    checkpoint: 'Product evidence and benefits owner response',
    checklist: ['Pilot evidence uploaded', 'API dependency closed', 'Benefits owner confirmed', 'Acceptance criteria checked', 'Go-forward decision captured'],
  },
  {
    project: 'PMO Capability',
    currentStage: 1,
    tone: 'green',
    gateDue: 'May 15',
    gateDone: 3,
    gateTotal: 4,
    checkpoint: 'Forum pack and rollout plan',
    checklist: ['Forum pack complete', 'Training audience confirmed', 'Playbook draft linked', 'Rollout risks logged'],
  },
];
