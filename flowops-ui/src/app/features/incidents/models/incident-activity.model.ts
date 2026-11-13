export type IncidentActivityType =
  | 'StatusChanged'
  | 'Assigned'
  | 'CommentAdded';

export interface IncidentActivity {
  id: string;
  incidentId: string;
  type: IncidentActivityType;
  message: string;
  performedBy: string;
  createdAt: string;

  previousValue?: string;
  newValue?: string;
}