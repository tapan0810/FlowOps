
export type WorkflowStatus = 'Active' | 'Draft' | 'Disabled';

export type WorkflowTrigger =
  | 'IncidentCreated'
  | 'IncidentUpdated'
  | 'SlaBreached';

export type WorkflowConditionField =
  | 'severity'
  | 'status'
  | 'serviceName';

export type WorkflowOperator =
  | 'equals'
  | 'notEquals';

export type WorkflowActionType =
  | 'AssignIncident'
  | 'ChangeSeverity'
  | 'SendNotification';

export interface WorkflowCondition {
  id: string;
  field: WorkflowConditionField;
  operator: WorkflowOperator;
  value: string;
}

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  value: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  createdAt: string;
  updatedAt: string;
}
