import { Injectable, computed, signal } from '@angular/core';

import type {
  Workflow,
  WorkflowStatus
} from '../models/workflow.model';

import { MOCK_WORKFLOWS } from '../data/workflows.mock';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private readonly _workflows =
    signal<Workflow[]>(MOCK_WORKFLOWS);

  readonly workflows = this._workflows.asReadonly();

  readonly totalWorkflows = computed(
    () => this.workflows().length
  );

  readonly activeWorkflows = computed(
    () => this.workflows().filter(
      workflow => workflow.status === 'Active'
    ).length
  );

  readonly draftWorkflows = computed(
    () => this.workflows().filter(
      workflow => workflow.status === 'Draft'
    ).length
  );

  getWorkflowById(id: string): Workflow | undefined {
    return this.workflows().find(
      workflow => workflow.id === id
    );
  }

  createWorkflow(
    workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
  ): Workflow {

    const now = new Date().toISOString();

    const newWorkflow: Workflow = {
      ...workflow,
      id: `WF-${crypto.randomUUID()}`,
      createdAt: now,
      updatedAt: now
    };

    this._workflows.update(current => [
      ...current,
      newWorkflow
    ]);

    return newWorkflow;
  }

  updateWorkflowStatus(
    id: string,
    status: WorkflowStatus
  ): boolean {

    const existing = this.getWorkflowById(id);

    if (!existing) {
      return false;
    }

    this._workflows.update(current =>
      current.map(workflow =>
        workflow.id === id
          ? {
              ...workflow,
              status,
              updatedAt: new Date().toISOString()
            }
          : workflow
      )
    );

    return true;
  }

  deleteWorkflow(id: string): boolean {

    const exists = this.workflows().some(
      workflow => workflow.id === id
    );

    if (!exists) {
      return false;
    }

    this._workflows.update(current =>
      current.filter(workflow => workflow.id !== id)
    );

    return true;
  }
}