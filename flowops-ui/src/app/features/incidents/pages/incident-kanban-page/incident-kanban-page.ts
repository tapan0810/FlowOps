import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup
} from '@angular/cdk/drag-drop';

import { RouterLink } from '@angular/router';

import { IncidentService } from '../../services/incident.service';

import type {
  Incident,
  IncidentStatus
} from '../../models/incident.model';

interface KanbanColumn {
  status: IncidentStatus;
  title: string;
}

@Component({
  selector: 'app-incident-kanban-page',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    RouterLink
  ],
  templateUrl: './incident-kanban-page.html',
  styleUrl: './incident-kanban-page.scss'
})
export class IncidentKanbanPage {

  private readonly incidentService =
    inject(IncidentService);

  readonly incidents = this.incidentService.incidents;

  readonly movingIncidentId = signal<string | null>(null);

  readonly columns: KanbanColumn[] = [
    { status: 'New', title: 'New' },
    { status: 'Triaged', title: 'Triaged' },
    { status: 'Assigned', title: 'Assigned' },
    { status: 'Investigating', title: 'Investigating' },
    { status: 'Mitigated', title: 'Mitigated' },
    { status: 'Resolved', title: 'Resolved' },
    { status: 'Closed', title: 'Closed' }
  ];

  readonly groupedIncidents = computed(() => {

    const allIncidents = this.incidents();

    return this.columns.map(column => ({
      ...column,
      incidents: allIncidents.filter(
        incident => incident.status === column.status
      )
    }));
  });

  drop(
    event: CdkDragDrop<IncidentStatus, IncidentStatus, Incident>
  ): void {

    const incident = event.item.data;
    const targetStatus = event.container.data;

    // Ignore drops into the same column.
    if (event.previousContainer === event.container) {
      return;
    }

    // Prevent duplicate submissions for the same incident.
    if (this.movingIncidentId() === incident.id) {
      return;
    }

    this.movingIncidentId.set(incident.id);

    this.incidentService
      .transitionIncident(
        incident.id,
        targetStatus,
        'Current User'
      )
      .subscribe({
        next: success => {

          if (!success) {
            window.alert(
              `Cannot move ${incident.id} from ${incident.status} to ${targetStatus}.`
            );
          }

          this.movingIncidentId.set(null);
        },

        error: error => {
          console.error('Kanban transition failed:', error);

          window.alert(
            'Unable to update the incident. Please try again.'
          );

          this.movingIncidentId.set(null);
        }
      });
  }

  readonly criticalCount = computed(() =>
  this.incidents().filter(
    incident => incident.severity === 'Critical'
  ).length
);

readonly openCount = computed(() =>
  this.incidents().filter(
    incident =>
      incident.status !== 'Resolved' &&
      incident.status !== 'Closed'
  ).length
);
}