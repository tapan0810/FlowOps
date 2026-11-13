import { Service } from '@angular/core';

@Service()
export class WorkflowEngine {}
import { Injectable } from '@angular/core';

import type {
  Workflow,
  WorkflowCondition
} from '../models/workflow.model';

import type {
  Incident
} from '../../incidents/models/incident.model';

export interface WorkflowEvaluationResult {
  workflowId: string;
  workflowName: string;
  matched: boolean;
  reason: string;
  actions: Workflow['actions'];
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowEngineService {

  evaluateWorkflow(
    workflow: Workflow,
    incident: Incident
  ): WorkflowEvaluationResult {

    if (workflow.status !== 'Active') {
      return {
        workflowId: workflow.id,
        workflowName: workflow.name,
        matched: false,
        reason: 'Workflow is not active.',
        actions: []
      };
    }

    if (!this.matchesTrigger(workflow, 'IncidentCreated')) {
      return {
        workflowId: workflow.id,
        workflowName: workflow.name,
        matched: false,
        reason: 'Trigger does not match.',
        actions: []
      };
    }

    const conditionsMatched =
      workflow.conditions.every(condition =>
        this.evaluateCondition(condition, incident)
      );

    if (!conditionsMatched) {
      return {
        workflowId: workflow.id,
        workflowName: workflow.name,
        matched: false,
        reason: 'One or more conditions were not satisfied.',
        actions: []
      };
    }

    return {
      workflowId: workflow.id,
      workflowName: workflow.name,
      matched: true,
      reason: 'All conditions matched.',
      actions: workflow.actions
    };
  }

  private matchesTrigger(
    workflow: Workflow,
    event: 'IncidentCreated'
  ): boolean {
    return workflow.trigger === event;
  }

  private evaluateCondition(
    condition: WorkflowCondition,
    incident: Incident
  ): boolean {

    const actualValue = incident[condition.field];

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