import { TestBed } from '@angular/core/testing';
import { WorkflowEngineService } from './workflow-engine';
import type { Workflow } from '../models/workflow.model';
import type { Incident } from '../../incidents/models/incident.model';

describe('WorkflowEngineService', () => {
  let service: WorkflowEngineService;

  const incident: Incident = {
    id: 'INC-1',
    title: 'Payment API unavailable',
    description: 'Payment requests fail.',
    severity: 'Critical',
    status: 'New',
    serviceName: 'Payments',
    assignedTo: 'Unassigned',
    createdAt: '2026-11-21T08:00:00.000Z',
    slaTargetMinutes: 30
  };

  const workflow: Workflow = {
    id: 'WF-1',
    name: 'Critical escalation',
    description: 'Escalate critical incidents',
    status: 'Active',
    trigger: 'IncidentCreated',
    conditions: [{ id: 'C-1', field: 'severity', operator: 'equals', value: 'Critical' }],
    actions: [{ id: 'A-1', type: 'SendNotification', value: 'Escalate now' }],
    createdAt: '2026-11-21T08:00:00.000Z',
    updatedAt: '2026-11-21T08:00:00.000Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowEngineService);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('matches an active workflow with a matching trigger and condition', () => {
    expect(service.evaluateWorkflow(workflow, incident).matched).toBe(true);
  });

  it('does not match a different trigger', () => {
    expect(service.evaluateWorkflow(workflow, incident, 'SlaBreached').matched).toBe(false);
  });

  it('does not match when a condition fails', () => {
    const changed = { ...incident, severity: 'Low' as const };
    expect(service.evaluateWorkflow(workflow, changed).matched).toBe(false);
  });
});
