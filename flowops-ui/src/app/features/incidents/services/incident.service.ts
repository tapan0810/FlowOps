
import { Injectable, signal, computed } from '@angular/core';

import type {
  Incident,
  IncidentStatus
} from '../models/incident.model';

import type {
  IncidentActivity
} from '../models/incident-activity.model';

import { MOCK_INCIDENTS } from '../data/incidents.mock';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  // Incident state
  private readonly _incidents = signal<Incident[]>(MOCK_INCIDENTS);

  readonly incidents = this._incidents.asReadonly();

  // Activity history state
  private readonly _activities = signal<IncidentActivity[]>([]);

  readonly activities = this._activities.asReadonly();

  // KPI calculations
  readonly totalIncidents = computed(
    () => this.incidents().length
  );

  readonly criticalIncidents = computed(
    () => this.incidents().filter(
      incident => incident.severity === 'Critical'
    ).length
  );

  readonly openIncidents = computed(
    () => this.incidents().filter(
      incident =>
        incident.status !== 'Resolved' &&
        incident.status !== 'Closed'
    ).length
  );

  readonly resolvedIncidents = computed(
    () => this.incidents().filter(
      incident =>
        incident.status === 'Resolved' ||
        incident.status === 'Closed'
    ).length
  );

  // Business rules: allowed status transitions
  private readonly allowedTransitions: Record<
    IncidentStatus,
    readonly IncidentStatus[]
  > = {
    New: ['Triaged'],
    Triaged: ['Assigned'],
    Assigned: ['Investigating'],
    Investigating: ['Mitigated'],
    Mitigated: ['Resolved'],
    Resolved: ['Closed', 'Investigating'],
    Closed: []
  };

  // Change incident status
  transitionIncident(
    incidentId: string,
    nextStatus: IncidentStatus,
    performedBy = 'Current User'
  ): boolean {

    const incident = this.incidents().find(
      item => item.id === incidentId
    );

    if (!incident) {
      return false;
    }

    const allowedStatuses =
      this.allowedTransitions[incident.status];

    if (!allowedStatuses.includes(nextStatus)) {
      return false;
    }

    this._incidents.update(current =>
      current.map(item =>
        item.id === incidentId
          ? { ...item, status: nextStatus }
          : item
      )
    );

    this.addActivity({
      incidentId,
      type: 'StatusChanged',
      message: `Status changed from ${incident.status} to ${nextStatus}`,
      performedBy
    });

    return true;
  }

  // Assign or reassign an engineer
  assignIncident(
    incidentId: string,
    assignedTo: string,
    performedBy = 'Current User'
  ): boolean {

    const engineer = assignedTo.trim();

    if (!engineer || engineer === 'Unassigned') {
      return false;
    }

    const incident = this.incidents().find(
      item => item.id === incidentId
    );

    if (!incident || incident.status === 'Closed') {
      return false;
    }

    if (incident.assignedTo === engineer) {
      return false;
    }

    this._incidents.update(current =>
      current.map(item =>
        item.id === incidentId
          ? { ...item, assignedTo: engineer }
          : item
      )
    );

    this.addActivity({
      incidentId,
      type: 'Assigned',
      message: `Assigned to ${engineer}`,
      performedBy
    });

    return true;
  }

  // Add an activity event
  private addActivity(
    activity: Omit<IncidentActivity, 'id' | 'createdAt'>
  ): void {

    const newActivity: IncidentActivity = {
      ...activity,
      id: `${activity.incidentId}-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    this._activities.update(current => [
      newActivity,
      ...current
    ]);
  }

}
