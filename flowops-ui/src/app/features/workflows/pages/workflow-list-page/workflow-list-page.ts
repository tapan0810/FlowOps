import { Component, inject } from '@angular/core';

import { DatePipe } from '@angular/common';

import { WorkflowService } from '../../services/workflow';

@Component({
  selector: 'app-workflow-list-page',
  imports: [DatePipe],
  templateUrl: './workflow-list-page.html',
  styleUrl: './workflow-list-page.scss'
})
export class WorkflowListPage {

  private readonly workflowService =
    inject(WorkflowService);

  readonly workflows = this.workflowService.workflows;

  readonly totalWorkflows =
    this.workflowService.totalWorkflows;

  readonly activeWorkflows =
    this.workflowService.activeWorkflows;

  readonly draftWorkflows =
    this.workflowService.draftWorkflows;

  changeStatus(
    id: string,
    status: 'Active' | 'Draft' | 'Disabled'
  ): void {

    const success =
      this.workflowService.updateWorkflowStatus(id, status);

    if (!success) {
      window.alert('Unable to update workflow.');
    }
  }

  deleteWorkflow(id: string): void {

    const confirmed = window.confirm(
      'Are you sure you want to delete this workflow?'
    );

    if (!confirmed) {
      return;
    }

    this.workflowService.deleteWorkflow(id);
  }
}