import type { Workflow } from '../models/workflow.model';

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'WF-001',
    name: 'Critical Incident Escalation',
    description: 'Automatically escalate critical incidents.',
    status: 'Active',
    trigger: 'IncidentCreated',
    conditions: [
      {
        id: 'COND-001',
        field: 'severity',
        operator: 'equals',
        value: 'Critical'
      }
    ],
    actions: [
      {
        id: 'ACT-001',
        type: 'AssignIncident',
        value: 'Incident Manager'
      },
      {
        id: 'ACT-002',
        type: 'SendNotification',
        value: 'Critical incident requires immediate attention.'
      }
    ],
    createdAt: '2026-11-13T08:00:00.000Z',
    updatedAt: '2026-11-13T08:00:00.000Z'
  },
  {
    id: 'WF-002',
    name: 'SLA Breach Notification',
    description: 'Notify the operations team when an SLA is breached.',
    status: 'Draft',
    trigger: 'SlaBreached',
    conditions: [],
    actions: [
      {
        id: 'ACT-003',
        type: 'SendNotification',
        value: 'An incident SLA has been breached.'
      }
    ],
    createdAt: '2026-11-13T08:00:00.000Z',
    updatedAt: '2026-11-13T08:00:00.000Z'
  }
];