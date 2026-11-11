import { Injectable, computed, inject, signal } from '@angular/core';

import { Incident, IncidentStatus } from '../models/incident.model';
import { MOCK_INCIDENTS } from '../data/incidents.mock';
import { IncidentActivity } from '../models/incident-activity.model';

@Injectable(
    {
        providedIn: 'root'
    }
)

export class IncidentService {

    //private writable state
    private readonly _incidents = signal<Incident[]>(MOCK_INCIDENTS);

    //public readonly state
    readonly incidents = this._incidents.asReadonly();

    //Computed state
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

    readonly closedIncident = computed(
        () => this.incidents().filter(
            incident =>
                incident.status === 'Resolved' ||
                incident.status === 'Closed'
        ).length
    );

    //Buisness Rules - Allowed status transitions
    private readonly allowedTransitions: Record<IncidentStatus, readonly IncidentStatus[]>
        = {
            New: ['Triaged'],
            Triaged: ['Assigned'],
            Assigned: ['Investigating'],
            Investigating: ['Mitigated'],
            Mitigated: ['Resolved'],
            Resolved: ['Closed', 'Investigating'],
            Closed: []
        }
}