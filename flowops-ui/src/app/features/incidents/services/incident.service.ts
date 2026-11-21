
import { Injectable, signal, computed, inject } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IncidentApiService } from './incident-api';
import { ActivityApiService } from './activity-api';

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

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private readonly incidentApi = inject(IncidentApiService);
  private readonly activityApi = inject(ActivityApiService);

  // ==========================================
  // 1. APPLICATION STATE
  // ==========================================

  private readonly _incidents = signal<Incident[]>([]);
  readonly incidents = this._incidents.asReadonly();

  private readonly _activities = signal<IncidentActivity[]>([]);
  readonly activities = this._activities.asReadonly();

  private readonly _comments = signal<IncidentComment[]>([]);
  readonly comments = this._comments.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  // ==========================================
  // 2. DASHBOARD KPI STATE
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
  // 3. INCIDENT LIFECYCLE RULES
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
  // 4. INITIAL DATA LOADING
  // ==========================================

  constructor() {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loadIncidents();
    this.loadComments();
    this.loadActivities();
  }

  // ==========================================
  // 5. LOAD INCIDENTS
  // ==========================================

  loadIncidents(): void {
    this._loading.set(true);
    this._error.set(null);

    this.incidentApi.getIncidents().subscribe({
      next: incidents => {
        this._incidents.set(incidents);
        this._loading.set(false);
      },
      error: error => {
        console.error('Failed to load incidents:', error);

        this._error.set(
          'Unable to load incidents. Please check whether the API server is running.'
        );

        this._loading.set(false);
      }
    });
  }

  refreshIncidents(): void {
    this.loadIncidents();
  }

  // ==========================================
  // 6. CHANGE INCIDENT STATUS
  // ==========================================

  transitionIncident(
    incidentId: string,
    nextStatus: IncidentStatus,
    performedBy = 'Current User'
  ) {

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

        this._incidents.update(current =>
          current.map(item =>
            item.id === incidentId
              ? updatedIncident
              : item
          )
        );

        this.addActivity({
          incidentId,
          type: 'StatusChanged',
          message: `Status changed from ${incident.status} to ${nextStatus}`,
          performedBy,
          previousValue: incident.status,
          newValue: nextStatus
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
  // 7. ASSIGN ENGINEER
  // ==========================================

  assignIncident(
    incidentId: string,
    assignedTo: string,
    performedBy = 'Current User'
  ) {

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

        this._incidents.update(current =>
          current.map(item =>
            item.id === incidentId
              ? updatedIncident
              : item
          )
        );

        this.addActivity({
          incidentId,
          type: 'Assigned',
          message: `Assigned to ${engineer}`,
          performedBy,
          previousValue: incident.assignedTo,
          newValue: engineer
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
  // 8. AVAILABLE STATUS TRANSITIONS
  // ==========================================

  getAllowedTransitions(
    currentStatus: IncidentStatus
  ): readonly IncidentStatus[] {
    return this.allowedTransitions[currentStatus] ?? [];
  }

  // ==========================================
  // 9. SAVE ACTIVITY HISTORY
  // ==========================================

  private addActivity(
    activity: Omit<IncidentActivity, 'id' | 'createdAt'>
  ): void {

    const newActivity: IncidentActivity = {
      ...activity,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    this.activityApi.createActivity(newActivity).subscribe({
      next: savedActivity => {
        this._activities.update(current => [
          savedActivity,
          ...current
        ]);
      },
      error: error => {
        console.error('Failed to persist activity:', error);
      }
    });
  }

  // ==========================================
  // 10. LOAD ACTIVITY HISTORY
  // ==========================================

  loadActivities(): void {
    this.activityApi.getActivities().subscribe({
      next: activities => {
        this._activities.set(activities);
      },
      error: error => {
        console.error('Failed to load activities:', error);
      }
    });
  }

  // ==========================================
  // 11. SAVE INCIDENT COMMENT
  // ==========================================

  addComment(
    incidentId: string,
    message: string,
    author = 'Current User'
  ) {

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

        this.addActivity({
          incidentId,
          type: 'CommentAdded',
          message: `${author} added a comment`,
          performedBy: author
        });
      }),

      map(() => true),

      catchError(error => {
        console.error('Failed to save comment:', error);
        return of(false);
      })
    );
  }

  // ==========================================
  // 12. LOAD COMMENTS
  // ==========================================

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
