
import { Injectable, signal, computed, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import type {
  Incident,
  IncidentStatus
} from '../models/incident.model';

import type {
  IncidentActivity
} from '../models/incident-activity.model';

import type {
  IncidentComment
} from '../models/incident-comment.model';

import { IncidentApiService } from './incident-api';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  // ==========================================
  // 1. DEPENDENCY INJECTION
  // ==========================================

  private readonly incidentApi = inject(IncidentApiService);


  // ==========================================
  // 2. INCIDENT STATE
  // ==========================================

  private readonly _incidents = signal<Incident[]>([]);

  readonly incidents = this._incidents.asReadonly();


  // ==========================================
  // 3. LOADING AND ERROR STATE
  // ==========================================

  private readonly _loading = signal(false);

  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);

  readonly error = this._error.asReadonly();


  // ==========================================
  // 4. ACTIVITY HISTORY STATE
  // ==========================================

  private readonly _activities = signal<IncidentActivity[]>([]);

  readonly activities = this._activities.asReadonly();


  // ==========================================
  // 5. COMMENTS STATE
  // ==========================================

  private readonly _comments = signal<IncidentComment[]>([]);

  readonly comments = this._comments.asReadonly();


  // ==========================================
  // 6. KPI CALCULATIONS
  // ==========================================

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


  // ==========================================
  // 7. BUSINESS RULES: STATUS TRANSITIONS
  // ==========================================

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


  // ==========================================
  // 8. INITIALIZE INCIDENT DATA FROM API
  // ==========================================

  constructor() {
    this.loadIncidents();
  }


  // ==========================================
  // 9. GET ALL INCIDENTS
  // ==========================================

  loadIncidents(): void {

    this._loading.set(true);
    this._error.set(null);

    this.incidentApi.getIncidents().subscribe({

      next: (incidents) => {

        this._incidents.set(incidents);

        this._loading.set(false);

      },

      error: (error: unknown) => {

        console.error('Failed to load incidents:', error);

        this._error.set(
          'Unable to load incidents. Please check the API server.'
        );

        this._loading.set(false);

      }

    });

  }


  // ==========================================
  // 10. REFRESH INCIDENTS
  // ==========================================

  refreshIncidents(): void {
    this.loadIncidents();
  }


  // ==========================================
  // 11. CHANGE INCIDENT STATUS
  // ==========================================

  transitionIncident(
    incidentId: string,
    nextStatus: IncidentStatus,
    performedBy = 'Current User'
  ): Observable<boolean> {

    const incident = this.incidents().find(
      item => item.id === incidentId
    );

    if (!incident) {
      return of(false);
    }

    const allowedStatuses =
      this.allowedTransitions[incident.status];

    if (!allowedStatuses.includes(nextStatus)) {
      return of(false);
    }

    return this.incidentApi.updateIncident(
      incidentId,
      { status: nextStatus }
    ).pipe(
      tap(updatedIncident => {

        // Update local application state only after API success.
        this._incidents.update(current =>
          current.map(item =>
            item.id === incidentId
              ? updatedIncident
              : item
          )
        );

        // Record the successful operation.
        this.addActivity({
          incidentId,
          type: 'StatusChanged',
          message: `Status changed from ${incident.status} to ${nextStatus}`,
          performedBy
        });
      }),

      map(() => true),

      catchError(error => {
        console.error('Failed to update incident status:', error);
        return of(false);
      })
    );
  }


  // ==========================================
  // 12. ASSIGN OR REASSIGN ENGINEER
  // ==========================================

  assignIncident(
    incidentId: string,
    assignedTo: string,
    performedBy = 'Current User'
  ): Observable<boolean> {

    const engineer = assignedTo.trim();

    if (!engineer || engineer === 'Unassigned') {
      return of(false);
    }

    const incident = this.incidents().find(
      item => item.id === incidentId
    );

    if (!incident || incident.status === 'Closed') {
      return of(false);
    }

    if (incident.assignedTo === engineer) {
      return of(false);
    }

    return this.incidentApi.updateIncident(
      incidentId,
      { assignedTo: engineer }
    ).pipe(
      tap(updatedIncident => {

        // Update the frontend only after API success.
        this._incidents.update(current =>
          current.map(item =>
            item.id === incidentId
              ? updatedIncident
              : item
          )
        );

        // Record assignment activity.
        this.addActivity({
          incidentId,
          type: 'Assigned',
          message: `Assigned to ${engineer}`,
          performedBy
        });
      }),

      map(() => true),

      catchError(error => {
        console.error('Failed to assign incident:', error);
        return of(false);
      })
    );
  }


  // ==========================================
  // 13. GET ALLOWED TRANSITIONS
  // ==========================================

  getAllowedTransitions(
    currentStatus: IncidentStatus
  ): readonly IncidentStatus[] {

    return this.allowedTransitions[currentStatus] ?? [];

  }


  // ==========================================
  // 14. ADD ACTIVITY HISTORY
  // ==========================================

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


  // ==========================================
  // 15. ADD INCIDENT COMMENT
  // ==========================================

  addComment(
  incidentId: string,
  message: string,
  author = 'Current User'
): Observable<boolean> {

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return of(false);
  }

  const incidentExists = this.incidents().some(
    incident => incident.id === incidentId
  );

  if (!incidentExists) {
    return of(false);
  }

  const newComment: IncidentComment = {
    id: `${incidentId}-${crypto.randomUUID()}`,
    incidentId,
    message: trimmedMessage,
    author,
    createdAt: new Date().toISOString()
  };

  return this.incidentApi.createComment(newComment).pipe(
    tap(savedComment => {
      this._comments.update(current => [
        savedComment,
        ...current
      ]);
    }),
    map(() => true),
    catchError(error => {
      console.error('Failed to save comment:', error);
      return of(false);
    })
  );
}

  //========================================
  //. LOAD COMMENTS
  //========================================
  loadComments(): void {
  this.incidentApi.getComments().subscribe({
    next: comments => {
      this._comments.set(comments);
    },
    error: error => {
      console.error('Failed to load comments:', error);
    }
  });
}

}
