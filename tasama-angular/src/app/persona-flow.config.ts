import { PmConsoleMountOptions } from './pm-console.types';

export type PersonaFlowId = 'project-manager' | 'program-manager' | 'executive' | 'pmo' | 'portfolio-manager';

export interface PersonaFlowOption {
  readonly id: PersonaFlowId;
  readonly label: string;
  readonly instanceTitle: string;
  readonly entryState?: PmConsoleMountOptions;
}

export const personaFlowOptions: readonly PersonaFlowOption[] = [
  {
    id: 'project-manager',
    label: 'Project Manager',
    instanceTitle: 'Project Manager Instance',
    entryState: {
      authenticated: true,
      projectId: 'all',
      selectedPage: 'workspace',
      selectedView: 'pm101',
      frontDoorMode: 'assigned',
    },
  },
  {
    id: 'program-manager',
    label: 'Program Manager',
    instanceTitle: 'Program Manager Instance',
  },
  {
    id: 'executive',
    label: 'Executive',
    instanceTitle: 'Executive Instance',
  },
  {
    id: 'pmo',
    label: 'PMO',
    instanceTitle: 'PMO Instance',
  },
  {
    id: 'portfolio-manager',
    label: 'Portfolio Manager',
    instanceTitle: 'Portfolio Manager Instance',
    entryState: {
      authenticated: true,
      projectId: 'all',
      selectedPage: 'workspace',
      selectedView: 'pm101',
      frontDoorMode: 'assigned',
    },
  },
];

export const defaultPersonaFlowId: PersonaFlowId = 'project-manager';

export function getPersonaFlowOption(id: string | null): PersonaFlowOption {
  return personaFlowOptions.find((option) => option.id === id) ?? personaFlowOptions[0];
}
