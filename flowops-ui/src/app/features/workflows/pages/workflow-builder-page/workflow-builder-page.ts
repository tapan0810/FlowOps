
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { WorkflowService } from '../../services/workflow';

import type {
  WorkflowTrigger,
  WorkflowCondition,
  WorkflowConditionField,
  WorkflowOperator,
  WorkflowAction,
  WorkflowActionType
} from '../../models/workflow.model';

@Component({
  selector: 'app-workflow-builder-page',
  imports: [],
  templateUrl: './workflow-builder-page.html',
  styleUrl: './workflow-builder-page.scss'
})
export class WorkflowBuilderPage {

  private readonly workflowService =
    inject(WorkflowService);

  private readonly router = inject(Router);

  readonly name = signal('');
  readonly description = signal('');

  readonly trigger = signal<WorkflowTrigger>(
    'IncidentCreated'
  );

  readonly conditions = signal<WorkflowCondition[]>([]);

  readonly actions = signal<WorkflowAction[]>([
    {
      id: crypto.randomUUID(),
      type: 'SendNotification',
      value: 'New incident requires attention.'
    }
  ]);

  readonly errorMessage = signal('');

  // Add a new condition.
  addCondition(): void {
    this.conditions.update(current => [
      ...current,
      {
        id: crypto.randomUUID(),
        field: 'severity',
        operator: 'equals',
        value: 'Critical'
      }
    ]);
  }

  // Remove a condition.
  removeCondition(id: string): void {
    this.conditions.update(current =>
      current.filter(condition => condition.id !== id)
    );
  }

  // Update a condition field.
  updateConditionField(
    id: string,
    field: WorkflowConditionField
  ): void {
    this.conditions.update(current =>
      current.map(condition =>
        condition.id === id
          ? { ...condition, field, value: this.defaultValue(field) }
          : condition
      )
    );
  }

  updateConditionOperator(
    id: string,
    operator: WorkflowOperator
  ): void {
    this.conditions.update(current =>
      current.map(condition =>
        condition.id === id
          ? { ...condition, operator }
          : condition
      )
    );
  }

  updateConditionValue(
    id: string,
    value: string
  ): void {
    this.conditions.update(current =>
      current.map(condition =>
        condition.id === id
          ? { ...condition, value }
          : condition
      )
    );
  }

  // Add an action.
  addAction(): void {
    this.actions.update(current => [
      ...current,
      {
        id: crypto.randomUUID(),
        type: 'SendNotification',
        value: ''
      }
    ]);
  }

  // Remove an action.
  removeAction(id: string): void {
    this.actions.update(current =>
      current.filter(action => action.id !== id)
    );
  }

  updateActionType(
    id: string,
    type: WorkflowActionType
  ): void {
    this.actions.update(current =>
      current.map(action =>
        action.id === id
          ? {
              ...action,
              type,
              value: this.defaultActionValue(type)
            }
          : action
      )
    );
  }

  updateActionValue(
    id: string,
    value: string
  ): void {
    this.actions.update(current =>
      current.map(action =>
        action.id === id
          ? { ...action, value }
          : action
      )
    );
  }

  private defaultValue(
    field: WorkflowConditionField
  ): string {
    switch (field) {
      case 'severity':
        return 'Critical';
      case 'status':
        return 'New';
      case 'serviceName':
        return '';
    }
  }

  private defaultActionValue(
    type: WorkflowActionType
  ): string {
    switch (type) {
      case 'AssignIncident':
        return 'Incident Manager';
      case 'ChangeSeverity':
        return 'High';
      case 'SendNotification':
        return 'New incident requires attention.';
    }
  }

  // Save workflow as Draft.
  saveWorkflow(): void {

    this.errorMessage.set('');

    const workflowName = this.name().trim();
    const workflowDescription = this.description().trim();

    if (!workflowName) {
      this.errorMessage.set('Workflow name is required.');
      return;
    }

    if (this.actions().length === 0) {
      this.errorMessage.set('Add at least one action.');
      return;
    }

    if (this.actions().some(action => !action.value.trim())) {
      this.errorMessage.set('Every action must have a value.');
      return;
    }

    if (this.conditions().some(condition => !condition.value.trim())) {
      this.errorMessage.set('Every condition must have a value.');
      return;
    }

    this.workflowService.createWorkflow({
      name: workflowName,
      description: workflowDescription,
      status: 'Draft',
      trigger: this.trigger(),
      conditions: this.conditions(),
      actions: this.actions()
    });

    this.router.navigate(['/workflows']);
  }

  cancel(): void {
    this.router.navigate(['/workflows']);
  }
}
