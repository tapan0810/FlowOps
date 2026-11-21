import { Injectable } from '@angular/core';

import type {
  Workflow,
  WorkflowCondition,
  WorkflowTrigger
} from '../models/workflow.model';

import type { Incident } from '../../incidents/models/incident.model';

export interface WorkflowEvaluationResult {
  workflowId: string;
  workflowName: string;
  matched: boolean;
  reason: string;
  actions: Workflow['actions'];
}

/**
 * Evaluates workflow rules only. It deliberately does not execute actions:
 * real action execution belongs in a trusted backend worker.
 */
@Injectable({ providedIn: 'root' })
export class WorkflowEngineService {
  evaluateWorkflow(
    workflow: Workflow,
    incident: Incident,
    event: WorkflowTrigger = 'IncidentCreated'
  ): WorkflowEvaluationResult {
    const result = (matched: boolean, reason: string): WorkflowEvaluationResult => ({
      workflowId: workflow.id,
      workflowName: workflow.name,
      matched,
      reason,
      actions: matched ? workflow.actions : []
    });

    if (workflow.status !== 'Active') {
      return result(false, 'Workflow is not active.');
    }

    if (workflow.trigger !== event) {
      return result(false, 'Trigger does not match.');
    }

    const failedCondition = workflow.conditions.find(
      condition => !this.evaluateCondition(condition, incident)
    );

    if (failedCondition) {
      return result(false, `Condition did not match: ${failedCondition.field} ${failedCondition.operator} ${failedCondition.value}.`);
    }

    return result(true, 'Trigger and all conditions matched.');
  }

  private evaluateCondition(
    condition: WorkflowCondition,
    incident: Incident
  ): boolean {
    const actualValue = String(incident[condition.field]);

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value;
      case 'notEquals':
        return actualValue !== condition.value;
      default:
        return false;
    }
  }
}
