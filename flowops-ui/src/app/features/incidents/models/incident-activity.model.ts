
export type IncidentActivityType =
  | 'Created'
  | 'StatusChanged'
  | 'Assigned';

export interface IncidentActivity {
  id: string;
  incidentId: string;
  type: IncidentActivityType;
  message: string;
  performedBy: string;
  createdAt: string;
}
