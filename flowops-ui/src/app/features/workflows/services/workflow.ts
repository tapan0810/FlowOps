import { Injectable, computed, signal } from '@angular/core';

import type { Workflow, WorkflowStatus } from '../models/workflow.model';
import { MOCK_WORKFLOWS } from '../data/workflows.mock';

const STORAGE_KEY = 'flowops.workflows.v1';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private readonly _workflows = signal<Workflow[]>(this.readInitialWorkflows());
  readonly workflows = this._workflows.asReadonly();

  readonly totalWorkflows = computed(() => this.workflows().length);
  readonly activeWorkflows = computed(() => this.workflows().filter(w => w.status === 'Active').length);
  readonly draftWorkflows = computed(() => this.workflows().filter(w => w.status === 'Draft').length);

  private readInitialWorkflows(): Workflow[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed as Workflow[];
        }
      }
    } catch (error) {
      console.warn('Could not read saved workflows; using demo data.', error);
    }
    return [...MOCK_WORKFLOWS];
  }

  private persist(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._workflows()));
      }
    } catch (error) {
      console.error('Could not persist workflows.', error);
    }
  }

  getWorkflowById(id: string): Workflow | undefined {
    return this.workflows().find(workflow => workflow.id === id);
  }

  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Workflow {
    const now = new Date().toISOString();
    const newWorkflow: Workflow = {
      ...workflow,
      id: `WF-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    this._workflows.update(current => [...current, newWorkflow]);
    this.persist();
    return newWorkflow;
  }

  updateWorkflowStatus(id: string, status: WorkflowStatus): boolean {
    if (!this.getWorkflowById(id)) return false;
    this._workflows.update(current => current.map(workflow =>
      workflow.id === id ? { ...workflow, status, updatedAt: new Date().toISOString() } : workflow
    ));
    this.persist();
    return true;
  }

  deleteWorkflow(id: string): boolean {
    if (!this.getWorkflowById(id)) return false;
    this._workflows.update(current => current.filter(workflow => workflow.id !== id));
    this.persist();
    return true;
  }
}
